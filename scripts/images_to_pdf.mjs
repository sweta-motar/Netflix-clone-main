import fs from "node:fs";
import path from "node:path";

const inputDir = process.argv[2];
const outputPdf = process.argv[3];

if (!inputDir || !outputPdf) {
  console.error("Usage: node images_to_pdf.mjs <image-dir> <output.pdf>");
  process.exit(1);
}

const files = fs
  .readdirSync(inputDir)
  .filter((name) => /\.jpe?g$/i.test(name))
  .sort()
  .map((name) => path.join(inputDir, name));

if (files.length === 0) {
  console.error("No JPEG files found.");
  process.exit(1);
}

function jpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (
      marker === 0xc0 ||
      marker === 0xc1 ||
      marker === 0xc2 ||
      marker === 0xc3 ||
      marker === 0xc5 ||
      marker === 0xc6 ||
      marker === 0xc7 ||
      marker === 0xc9 ||
      marker === 0xca ||
      marker === 0xcb ||
      marker === 0xcd ||
      marker === 0xce ||
      marker === 0xcf
    ) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  throw new Error("Could not read JPEG dimensions");
}

const pageW = 842; // A4 landscape points
const pageH = 595;
const margin = 24;

const objects = [];
function addObject(content) {
  objects.push(Buffer.isBuffer(content) ? content : Buffer.from(content, "binary"));
  return objects.length;
}

const catalogId = addObject("PLACEHOLDER");
const pagesId = addObject("PLACEHOLDER");
const pageIds = [];

for (let i = 0; i < files.length; i++) {
  const img = fs.readFileSync(files[i]);
  const { width, height } = jpegSize(img);
  const imageId = addObject(
    Buffer.concat([
      Buffer.from(
        `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`,
        "binary",
      ),
      img,
      Buffer.from("\nendstream", "binary"),
    ]),
  );

  const scale = Math.min((pageW - margin * 2) / width, (pageH - margin * 2) / height);
  const drawW = width * scale;
  const drawH = height * scale;
  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;
  const content = `q\n${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/Im${i + 1} Do\nQ`;
  const contentId = addObject(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
  const pageId = addObject(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im${i + 1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
  );
  pageIds.push(pageId);
}

objects[catalogId - 1] = Buffer.from(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`, "binary");
objects[pagesId - 1] = Buffer.from(
  `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`,
  "binary",
);

const chunks = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
const offsets = [0];
for (let i = 0; i < objects.length; i++) {
  offsets.push(Buffer.concat(chunks).length);
  chunks.push(Buffer.from(`${i + 1} 0 obj\n`, "binary"));
  chunks.push(objects[i]);
  chunks.push(Buffer.from("\nendobj\n", "binary"));
}

const body = Buffer.concat(chunks);
let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i < offsets.length; i++) {
  xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
const trailer = `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${body.length}\n%%EOF\n`;

fs.writeFileSync(outputPdf, Buffer.concat([body, Buffer.from(xref + trailer, "binary")]));
console.log(`Created PDF: ${outputPdf}`);
