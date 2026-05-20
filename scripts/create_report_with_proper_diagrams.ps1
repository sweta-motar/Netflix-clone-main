param(
    [string]$ReportPath = "C:\Users\Swati\Downloads\Netflix_report1_merged.docx",
    [string]$DiagramDocPath = "C:\Users\Swati\Downloads\Netflix_diagram.docx",
    [string]$OutputPath = "C:\Users\Swati\Desktop\devops\Netflix-clone-main\Netflix_Report_With_Proper_Diagrams.docx"
)

$ErrorActionPreference = "Stop"

$Root = "C:\Users\Swati\Desktop\devops\Netflix-clone-main"
$Work = Join-Path $Root "generated_diagrams"
$Extract = Join-Path $Work "diagram_doc"
New-Item -ItemType Directory -Force -Path $Work | Out-Null
New-Item -ItemType Directory -Force -Path $Extract | Out-Null

$ZipPath = Join-Path $Extract "Netflix_diagram.zip"
Copy-Item -LiteralPath $DiagramDocPath -Destination $ZipPath -Force
Expand-Archive -LiteralPath $ZipPath -DestinationPath (Join-Path $Extract "unzipped") -Force
$Media = Join-Path $Extract "unzipped\word\media"

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

function New-Canvas {
    param([int]$Width = 1800, [int]$Height = 1100)
    $bmp = New-Object System.Drawing.Bitmap $Width, $Height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::White)
    return @($bmp, $g)
}

function Draw-CenteredText {
    param($G, [string]$Text, [float]$X, [float]$Y, [float]$W, [float]$H, [float]$Size = 28, [int]$Style = 0)
    $fontStyle = [System.Drawing.FontStyle]$Style
    $font = New-Object System.Drawing.Font("Arial", [single]$Size, $fontStyle)
    $fmt = New-Object System.Drawing.StringFormat
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $G.DrawString($Text, $font, [System.Drawing.Brushes]::Black, (New-Object System.Drawing.RectangleF $X,$Y,$W,$H), $fmt)
    $font.Dispose()
    $fmt.Dispose()
}

function Draw-Title {
    param($G, [string]$Text, [int]$Width)
    Draw-CenteredText $G $Text 0 25 $Width 70 38 1
}

function Draw-RoundBox {
    param($G, [float]$X, [float]$Y, [float]$W, [float]$H, [string]$Text, [string]$Fill = "EAF3FF", [string]$Border = "2E75B6")
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = 28
    $path.AddArc($X, $Y, $r, $r, 180, 90)
    $path.AddArc($X + $W - $r, $Y, $r, $r, 270, 90)
    $path.AddArc($X + $W - $r, $Y + $H - $r, $r, $r, 0, 90)
    $path.AddArc($X, $Y + $H - $r, $r, $r, 90, 90)
    $path.CloseFigure()
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#$Fill"))
    $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#$Border"), 4
    )
    $G.FillPath($brush, $path)
    $G.DrawPath($pen, $path)
    Draw-CenteredText $G $Text $X $Y $W $H 25 0
    $brush.Dispose()
    $pen.Dispose()
    $path.Dispose()
}

function Draw-EllipseBox {
    param($G, [float]$X, [float]$Y, [float]$W, [float]$H, [string]$Text, [string]$Fill = "FFF7DC", [string]$Border = "C55A11")
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#$Fill"))
    $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#$Border"), 4)
    $G.FillEllipse($brush, $X, $Y, $W, $H)
    $G.DrawEllipse($pen, $X, $Y, $W, $H)
    Draw-CenteredText $G $Text $X $Y $W $H 23 0
    $brush.Dispose()
    $pen.Dispose()
}

function Draw-LineArrow {
    param($G, [float]$X1, [float]$Y1, [float]$X2, [float]$Y2, [string]$Label = "")
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(35,35,35), 4)
    $cap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap 7, 8
    $pen.CustomEndCap = $cap
    $G.DrawLine($pen, $X1, $Y1, $X2, $Y2)
    if ($Label.Length -gt 0) {
        Draw-CenteredText $G $Label (($X1+$X2)/2 - 120) (($Y1+$Y2)/2 - 32) 240 55 18 0
    }
    $pen.Dispose()
    $cap.Dispose()
}

function Draw-Actor {
    param($G, [float]$X, [float]$Y, [string]$Label)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Black, 4)
    $G.DrawEllipse($pen, $X + 35, $Y, 55, 55)
    $G.DrawLine($pen, $X + 62, $Y + 55, $X + 62, $Y + 155)
    $G.DrawLine($pen, $X, $Y + 90, $X + 125, $Y + 90)
    $G.DrawLine($pen, $X + 62, $Y + 155, $X + 10, $Y + 230)
    $G.DrawLine($pen, $X + 62, $Y + 155, $X + 115, $Y + 230)
    Draw-CenteredText $G $Label ($X - 30) ($Y + 235) 185 50 22 1
    $pen.Dispose()
}

function Save-UseCaseDiagram {
    param([string]$Path)
    $items = New-Canvas 1800 1100
    $bmp = $items[0]; $g = $items[1]
    Draw-Title $g "Netflix Clone - Use Case Diagram" 1800
    Draw-Actor $g 90 390 "User"
    Draw-Actor $g 1540 390 "Developer"

    $sysPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#2E75B6"), 5)
    $sysBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#F6FAFF"))
    $g.FillRectangle($sysBrush, 360, 155, 1070, 820)
    $g.DrawRectangle($sysPen, 360, 155, 1070, 820)
    Draw-CenteredText $g "Netflix Clone System" 360 165 1070 60 28 1

    $cases = @(
        @(520,260,330,95,"Register / Login"),
        @(940,260,330,95,"Browse Movies"),
        @(520,420,330,95,"Search Content"),
        @(940,420,330,95,"View Movie Details"),
        @(520,580,330,95,"Manage Wishlist"),
        @(940,580,330,95,"Watch Trailer"),
        @(735,750,360,95,"View Watch History"),
        @(940,850,330,95,"Run CI/CD Pipeline")
    )
    foreach($c in $cases){ Draw-EllipseBox $g $c[0] $c[1] $c[2] $c[3] $c[4] "FFFFFF" "4472C4" }

    foreach($target in @(@(520,307),@(520,467),@(520,627),@(735,797),@(940,307),@(940,467),@(940,627))){
        Draw-LineArrow $g 260 505 $target[0] ($target[1]+20) ""
    }
    Draw-LineArrow $g 1540 505 1270 897 ""
    Draw-CenteredText $g "Uses Firebase Auth, TMDB API, Django APIs and SQLite data" 415 1000 970 45 22 0

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

function Save-CicdDiagram {
    param([string]$Path)
    $items = New-Canvas 1900 900
    $bmp = $items[0]; $g = $items[1]
    Draw-Title $g "Netflix Clone - CI/CD Pipeline Flow" 1900
    $nodes = @(
        @(80,300,220,115,"GitHub`nSource Code","EAF3FF","2E75B6"),
        @(360,300,220,115,"Jenkins`nPipeline","FFF2CC","BF9000"),
        @(640,180,220,115,"SonarQube`nCode Analysis","E2F0D9","548235"),
        @(640,430,220,115,"Docker`nImage Build","FCE4D6","C55A11"),
        @(920,430,220,115,"Trivy`nImage Scan","F4CCCC","C00000"),
        @(1200,430,220,115,"Registry`nPush Image","EADCF8","7030A0"),
        @(1480,300,250,115,"Kubernetes`nDeploy Pods/Services","D9EAD3","38761D"),
        @(1480,590,250,115,"Prometheus + Grafana`nMonitor Metrics","DDEBF7","1F4E79")
    )
    foreach($n in $nodes){ Draw-RoundBox $g $n[0] $n[1] $n[2] $n[3] $n[4] $n[5] $n[6] }
    Draw-LineArrow $g 300 357 360 357 "push"
    Draw-LineArrow $g 580 330 640 245 "quality"
    Draw-LineArrow $g 580 390 640 487 "build"
    Draw-LineArrow $g 860 487 920 487 "scan"
    Draw-LineArrow $g 1140 487 1200 487 "push"
    Draw-LineArrow $g 1420 487 1480 357 "deploy"
    Draw-LineArrow $g 1605 415 1605 590 "metrics"
    Draw-CenteredText $g "Automated delivery: checkout -> analysis -> build -> security scan -> deploy -> monitor" 270 780 1360 55 24 1
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

$UseCasePng = Join-Path $Work "use_case_diagram.png"
$CicdPng = Join-Path $Work "cicd_pipeline_diagram.png"
Save-UseCaseDiagram $UseCasePng
Save-CicdDiagram $CicdPng

$DiagramMap = @{
    Dfd0 = Join-Path $Media "image2.png"
    Dfd1 = Join-Path $Media "image3.png"
    Activity = Join-Path $Media "image4.png"
    Class = Join-Path $Media "image5.png"
    ER = Join-Path $Media "image6.png"
    UseCase = $UseCasePng
    Cicd = $CicdPng
}

Copy-Item -LiteralPath $ReportPath -Destination $OutputPath -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($OutputPath, $false, $false)

function Find-After {
    param($Doc, [string]$Text, [int]$Start = 0)
    $r = $Doc.Range($Start, $Doc.Content.End)
    $f = $r.Find
    $f.ClearFormatting()
    $f.Text = $Text
    $f.MatchCase = $false
    $f.MatchWholeWord = $false
    if ($f.Execute()) { return $r }
    return $null
}

function Add-Figure {
    param($Doc, [string]$AnchorText, [int]$StartAfter, [string]$ImagePath, [string]$Caption, [float]$MaxWidth = 470)
    $r = Find-After $Doc $AnchorText $StartAfter
    if ($null -eq $r) {
        Write-Warning "Anchor not found: $AnchorText"
        return
    }
    $r.Collapse(0)
    $r.InsertParagraphAfter()
    $r.Collapse(0)
    $pic = $Doc.InlineShapes.AddPicture($ImagePath, $false, $true, $r)
    $pic.LockAspectRatio = -1
    if ($pic.Width -gt $MaxWidth) { $pic.Width = $MaxWidth }
    $pic.Range.ParagraphFormat.Alignment = 1
    $r = $pic.Range
    $r.Collapse(0)
    $r.InsertParagraphAfter()
    $r.Collapse(0)
    $r.Text = $Caption
    $r.Font.Name = "Times New Roman"
    $r.Font.Size = 11
    $r.Font.Bold = 1
    $r.ParagraphFormat.Alignment = 1
    $r.InsertParagraphAfter()
}

try {
    foreach ($section in $doc.Sections) {
        $section.PageSetup.TopMargin = 72
        $section.PageSetup.BottomMargin = 72
        $section.PageSetup.LeftMargin = 90
        $section.PageSetup.RightMargin = 72
    }

    for ($i = $doc.Shapes.Count; $i -ge 1; $i--) {
        $s = $doc.Shapes.Item($i)
        $p = $s.Anchor.Information(3)
        if ($p -ge 23 -and $p -le 25) { $s.Delete() }
    }
    for ($i = $doc.InlineShapes.Count; $i -ge 1; $i--) {
        $s = $doc.InlineShapes.Item($i)
        $p = $s.Range.Information(3)
        if ($p -ge 23 -and $p -le 25) { $s.Delete() }
    }

    foreach ($para in $doc.Paragraphs) {
        if ($para.Range.Text.Trim() -eq "/") { $para.Range.Delete() }
    }

    $start = 0
    $startRange = Find-After $doc "Availability - The system should be available for continuous integration and deployment." 0
    if ($null -ne $startRange) { $start = $startRange.End }

    Add-Figure $doc "Data Flow Diagram" $start $DiagramMap.Dfd0 "Fig 5.1 DFD Level 0 / Context Diagram of Netflix Clone" 475
    Add-Figure $doc "Level 1:" $start $DiagramMap.Dfd1 "Fig 5.2 DFD Level 1 of Netflix Clone" 475
    Add-Figure $doc "USE CASE DIAGRAM" $start $DiagramMap.UseCase "Fig 5.3 Use Case Diagram of Netflix Clone" 475
    Add-Figure $doc "ACTIVITY DIAGRAM" $start $DiagramMap.Activity "Fig 5.4 Activity Diagram of Netflix Clone" 475
    Add-Figure $doc "CLASS DIAGRAM" $start $DiagramMap.Class "Fig 5.5 Class Diagram of Netflix Clone" 430
    Add-Figure $doc "E-R DIAGRAM" $start $DiagramMap.ER "Fig 5.6 E-R Diagram of Netflix Clone" 430

    $implStartRange = Find-After $doc "IMPLEMENTATION" 0
    $implStart = 0
    if ($null -ne $implStartRange) { $implStart = $implStartRange.End }
    Add-Figure $doc "6.6 CI/CD and Deployment Module" $implStart $DiagramMap.Cicd "Fig 6.6.1 CI/CD Pipeline Flow of Netflix Clone" 475

    foreach ($para in $doc.Paragraphs) {
        $text = $para.Range.Text.Trim()
        if ($text.Length -gt 95) {
            $para.Range.ParagraphFormat.Alignment = 3
            $para.Range.Font.Name = "Times New Roman"
        }
    }

    $doc.Fields.Update() | Out-Null
    $doc.Save()
}
finally {
    $doc.Close($true)
    $word.Quit()
}

Write-Output "Created report with proper diagrams: $OutputPath"
