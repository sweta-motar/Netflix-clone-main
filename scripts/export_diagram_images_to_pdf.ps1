param(
    [string]$ImageDir = "C:\Users\Swati\Desktop\devops\Netflix-clone-main\generated_diagrams\pdf_only",
    [string]$OutputPdf = "C:\Users\Swati\Desktop\devops\Netflix-clone-main\Netflix_Clean_Diagrams_Only.pdf"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

Get-ChildItem -LiteralPath $ImageDir -Filter "*.jpg" -ErrorAction SilentlyContinue | Remove-Item -Force

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = [System.Drawing.Imaging.EncoderParameters]::new(1)
$params.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [int64]95)

Get-ChildItem -LiteralPath $ImageDir -Filter "*.png" | Sort-Object Name | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    try {
        $jpgPath = [System.IO.Path]::ChangeExtension($_.FullName, ".jpg")
        $bmp = [System.Drawing.Bitmap]::new($img.Width, $img.Height)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear([System.Drawing.Color]::White)
        $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
        $g.Dispose()
        $bmp.Save($jpgPath, $encoder, $params)
        $bmp.Dispose()
    }
    finally {
        $img.Dispose()
    }
}

node ".\scripts\images_to_pdf.mjs" $ImageDir $OutputPdf
