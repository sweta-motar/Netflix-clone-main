param(
    [string]$ReportPath = "C:\Users\Swati\Downloads\Netflix_report1_merged.docx",
    [string]$OutputPath = "C:\Users\Swati\Desktop\devops\Netflix-clone-main\Netflix_Report_Clean_Clear_Diagrams.docx"
)

$ErrorActionPreference = "Stop"

$Root = "C:\Users\Swati\Desktop\devops\Netflix-clone-main"
$OutDir = Join-Path $Root "generated_diagrams\clean"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Add-Type -AssemblyName System.Drawing

function Color-Html([string]$hex) {
    return [System.Drawing.ColorTranslator]::FromHtml("#$hex")
}

function New-Canvas([int]$w, [int]$h) {
    $bmp = [System.Drawing.Bitmap]::new($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::White)
    return @($bmp, $g)
}

function Text-Center($g, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size = 30, [int]$style = 0, [string]$color = "111111") {
    $font = [System.Drawing.Font]::new("Arial", [single]$size, [System.Drawing.FontStyle]$style)
    $brush = [System.Drawing.SolidBrush]::new((Color-Html $color))
    $fmt = [System.Drawing.StringFormat]::new()
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $fmt.Trimming = [System.Drawing.StringTrimming]::Word
    $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x, $y, $w, $h), $fmt)
    $fmt.Dispose(); $brush.Dispose(); $font.Dispose()
}

function Text-Left($g, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size = 26, [int]$style = 0, [string]$color = "111111") {
    $font = [System.Drawing.Font]::new("Arial", [single]$size, [System.Drawing.FontStyle]$style)
    $brush = [System.Drawing.SolidBrush]::new((Color-Html $color))
    $fmt = [System.Drawing.StringFormat]::new()
    $fmt.Alignment = [System.Drawing.StringAlignment]::Near
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $fmt.Trimming = [System.Drawing.StringTrimming]::Word
    $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x, $y, $w, $h), $fmt)
    $fmt.Dispose(); $brush.Dispose(); $font.Dispose()
}

function Title($g, [string]$text, [int]$w) {
    Text-Center $g $text 0 25 $w 70 42 1
}

function RoundBox($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$text, [string]$fill = "EAF3FF", [string]$border = "2E75B6", [float]$size = 27) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $r = 30
    $path.AddArc($x, $y, $r, $r, 180, 90)
    $path.AddArc($x + $w - $r, $y, $r, $r, 270, 90)
    $path.AddArc($x + $w - $r, $y + $h - $r, $r, $r, 0, 90)
    $path.AddArc($x, $y + $h - $r, $r, $r, 90, 90)
    $path.CloseFigure()
    $brush = [System.Drawing.SolidBrush]::new((Color-Html $fill))
    $pen = [System.Drawing.Pen]::new((Color-Html $border), 4)
    $g.FillPath($brush, $path)
    $g.DrawPath($pen, $path)
    Text-Center $g $text $x $y $w $h $size 0
    $pen.Dispose(); $brush.Dispose(); $path.Dispose()
}

function RectBox($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$text, [string]$fill = "FFFFFF", [string]$border = "404040", [float]$size = 26) {
    $brush = [System.Drawing.SolidBrush]::new((Color-Html $fill))
    $pen = [System.Drawing.Pen]::new((Color-Html $border), 4)
    $g.FillRectangle($brush, $x, $y, $w, $h)
    $g.DrawRectangle($pen, $x, $y, $w, $h)
    Text-Center $g $text $x $y $w $h $size 0
    $pen.Dispose(); $brush.Dispose()
}

function Diamond($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$text) {
    $pts = @(
        [System.Drawing.PointF]::new($x + $w/2, $y),
        [System.Drawing.PointF]::new($x + $w, $y + $h/2),
        [System.Drawing.PointF]::new($x + $w/2, $y + $h),
        [System.Drawing.PointF]::new($x, $y + $h/2)
    )
    $brush = [System.Drawing.SolidBrush]::new((Color-Html "FFF2CC"))
    $pen = [System.Drawing.Pen]::new((Color-Html "C55A11"), 4)
    $g.FillPolygon($brush, $pts)
    $g.DrawPolygon($pen, $pts)
    Text-Center $g $text $x $y $w $h 25 0
    $pen.Dispose(); $brush.Dispose()
}

function Arrow($g, [float]$x1, [float]$y1, [float]$x2, [float]$y2, [string]$label = "") {
    $pen = [System.Drawing.Pen]::new((Color-Html "202020"), 4)
    $cap = [System.Drawing.Drawing2D.AdjustableArrowCap]::new(7, 8)
    $pen.CustomEndCap = $cap
    $g.DrawLine($pen, $x1, $y1, $x2, $y2)
    if ($label.Trim().Length -gt 0) {
        Text-Center $g $label (($x1+$x2)/2 - 140) (($y1+$y2)/2 - 28) 280 52 20 0 "202020"
    }
    $cap.Dispose(); $pen.Dispose()
}

function Actor($g, [float]$x, [float]$y, [string]$label) {
    $pen = [System.Drawing.Pen]::new((Color-Html "111111"), 4)
    $g.DrawEllipse($pen, $x + 35, $y, 55, 55)
    $g.DrawLine($pen, $x + 62, $y + 55, $x + 62, $y + 155)
    $g.DrawLine($pen, $x, $y + 90, $x + 125, $y + 90)
    $g.DrawLine($pen, $x + 62, $y + 155, $x + 10, $y + 230)
    $g.DrawLine($pen, $x + 62, $y + 155, $x + 115, $y + 230)
    Text-Center $g $label ($x - 35) ($y + 235) 195 55 25 1
    $pen.Dispose()
}

function Entity($g, [float]$x, [float]$y, [float]$w, [string]$name, [string[]]$fields, [string]$color) {
    $row = 54
    $h = 70 + ($fields.Count * $row)
    RectBox $g $x $y $w $h "" "FFFFFF" $color 24
    $headerBrush = [System.Drawing.SolidBrush]::new((Color-Html "F7FBFF"))
    $g.FillRectangle($headerBrush, $x + 2, $y + 2, $w - 4, 66)
    $headerBrush.Dispose()
    Text-Left $g $name ($x + 22) $y ($w - 44) 66 28 1
    $linePen = [System.Drawing.Pen]::new((Color-Html "D9D9D9"), 2)
    $g.DrawLine($linePen, $x, $y + 68, $x + $w, $y + 68)
    for ($i = 0; $i -lt $fields.Count; $i++) {
        $yy = $y + 70 + ($i * $row)
        Text-Left $g $fields[$i] ($x + 22) $yy ($w - 44) $row 22 0
        if ($i -lt $fields.Count - 1) { $g.DrawLine($linePen, $x, $yy + $row, $x + $w, $yy + $row) }
    }
    $linePen.Dispose()
}

function Save-Dfd0($path) {
    $c = New-Canvas 1900 1150; $bmp=$c[0]; $g=$c[1]
    Title $g "Netflix Clone - DFD Level 0 (Context Diagram)" 1900
    RoundBox $g 755 450 390 160 "Netflix Clone`nSystem" "FCE4EC" "C2185B" 30
    Actor $g 120 445 "User"
    Actor $g 1560 445 "Developer"
    RoundBox $g 720 155 460 120 "TMDB / Rapid API`nMovie Data" "EDE7F6" "673AB7" 27
    RoundBox $g 1160 740 430 120 "Firebase / SQLite`nAuth and Data" "FFF8E1" "F9A825" 27
    RoundBox $g 305 740 430 120 "Prometheus + Grafana`nMonitoring" "E8F5E9" "2E7D32" 27
    RoundBox $g 720 930 460 120 "Jenkins, Docker, Kubernetes`nCI/CD Deployment" "E3F2FD" "1565C0" 25
    Arrow $g 305 535 755 515 "browse, search, watch"
    Arrow $g 755 580 305 580 "content and UI"
    Arrow $g 950 450 950 275 "fetch movie data"
    Arrow $g 1010 275 1010 450 "API response"
    Arrow $g 1145 535 1160 800 "auth, wishlist, history"
    Arrow $g 1160 765 1145 520 "stored user data"
    Arrow $g 1560 570 1180 980 "push code / trigger build"
    Arrow $g 950 930 950 610 "deploy and scale"
    Arrow $g 755 560 735 770 "metrics"
    Arrow $g 735 790 755 540 "dashboards"
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Dfd1($path) {
    $c = New-Canvas 2200 1500; $bmp=$c[0]; $g=$c[1]
    Title $g "Netflix Clone - DFD Level 1" 2200
    RectBox $g 80 220 520 950 "Frontend Layer" "EEF6FF" "42A5F5" 32
    RectBox $g 780 220 520 700 "Backend / Services Layer" "FFF3E0" "FB8C00" 32
    RectBox $g 1500 220 520 380 "External APIs" "F3E5F5" "8E24AA" 32
    RectBox $g 1500 720 520 360 "Data Layer" "FFFDE7" "FBC02D" 32
    RectBox $g 80 1240 820 170 "CI/CD Layer" "E8F5E9" "43A047" 30
    RectBox $g 1160 1240 760 170 "Monitoring Layer" "FFEBEE" "E53935" 30
    RoundBox $g 180 360 330 100 "User Interface" "FFFFFF" "1E88E5" 25
    RoundBox $g 180 560 330 100 "Search Module" "FFFFFF" "1E88E5" 25
    RoundBox $g 180 760 330 100 "Video Player" "FFFFFF" "1E88E5" 25
    RoundBox $g 180 960 330 100 "Wishlist View" "FFFFFF" "1E88E5" 25
    Actor $g 20 580 "User"
    RoundBox $g 880 360 330 100 "Movie Fetch API" "FFFFFF" "EF6C00" 25
    RoundBox $g 880 560 330 100 "Authentication API" "FFFFFF" "EF6C00" 25
    RoundBox $g 880 760 330 100 "Wishlist / History API" "FFFFFF" "EF6C00" 25
    RoundBox $g 1605 340 310 95 "TMDB API" "FFFFFF" "7B1FA2" 25
    RoundBox $g 1605 820 310 95 "Firebase Auth" "FFFFFF" "F9A825" 24
    RoundBox $g 1605 950 310 95 "SQLite Database" "FFFFFF" "F9A825" 24
    RoundBox $g 200 1285 220 80 "GitHub" "FFFFFF" "2E7D32" 24
    RoundBox $g 455 1285 220 80 "Jenkins" "FFFFFF" "2E7D32" 24
    RoundBox $g 710 1285 160 80 "Docker / K8s" "FFFFFF" "2E7D32" 22
    RoundBox $g 1290 1285 220 80 "Prometheus" "FFFFFF" "C62828" 24
    RoundBox $g 1570 1285 220 80 "Grafana" "FFFFFF" "C62828" 24
    Arrow $g 125 705 180 410 "interacts"
    Arrow $g 510 410 880 410 "movie request"
    Arrow $g 880 440 510 440 "results"
    Arrow $g 510 610 880 410 "search query"
    Arrow $g 510 810 880 410 "trailer request"
    Arrow $g 510 1010 880 810 "save/read"
    Arrow $g 1210 410 1605 390 "fetch movie data"
    Arrow $g 1605 430 1210 430 "API response"
    Arrow $g 1210 610 1605 865 "authenticate"
    Arrow $g 1210 810 1605 995 "store data"
    Arrow $g 420 1325 455 1325 "push"
    Arrow $g 675 1325 710 1325 "build"
    Arrow $g 870 1285 1040 920 "deploy"
    Arrow $g 1040 920 1290 1325 "metrics"
    Arrow $g 1510 1325 1570 1325 "visualize"
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-UseCase($path) {
    $c = New-Canvas 1900 1200; $bmp=$c[0]; $g=$c[1]
    Title $g "Netflix Clone - Use Case Diagram" 1900
    RectBox $g 360 160 1120 880 "Netflix Clone System" "F8FBFF" "2E75B6" 32
    Actor $g 95 480 "User"
    Actor $g 1660 480 "Developer"
    $cases = @(
        @(520,290,340,100,"Register / Login"),
        @(980,290,340,100,"Browse Movies"),
        @(520,470,340,100,"Search Content"),
        @(980,470,340,100,"View Movie Details"),
        @(520,650,340,100,"Manage Wishlist"),
        @(980,650,340,100,"Watch Trailer"),
        @(750,820,360,100,"View Watch History"),
        @(980,940,340,80,"Run CI/CD Pipeline")
    )
    foreach($uc in $cases){ RoundBox $g $uc[0] $uc[1] $uc[2] $uc[3] $uc[4] "FFFFFF" "4472C4" 25 }
    foreach($p in @(@(520,340),@(980,340),@(520,520),@(980,520),@(520,700),@(980,700),@(750,870))){
        Arrow $g 255 600 $p[0] $p[1] ""
    }
    Arrow $g 1660 600 1320 980 ""
    Text-Center $g "External services used: Firebase Authentication, TMDB API, Django Backend and SQLite Database" 390 1070 1060 60 24 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Activity($path) {
    $c = New-Canvas 1700 2100; $bmp=$c[0]; $g=$c[1]
    Title $g "Netflix Clone - Activity Diagram" 1700
    $x=610; $w=480; $h=105
    RoundBox $g $x 150 $w 95 "Start" "D9EAD3" "38761D" 28
    RoundBox $g $x 310 $w $h "Open Application" "EAF3FF" "2E75B6" 27
    RoundBox $g $x 490 $w $h "Login using Firebase Auth" "EAF3FF" "2E75B6" 26
    Diamond $g 650 670 400 190 "Authenticated?"
    RoundBox $g $x 930 $w $h "Search / Browse Movies" "EAF3FF" "2E75B6" 26
    RoundBox $g $x 1110 $w $h "Fetch Movie Data from TMDB API" "EAF3FF" "2E75B6" 25
    RoundBox $g $x 1290 $w $h "Display Movie List and Details" "EAF3FF" "2E75B6" 25
    Diamond $g 650 1470 400 190 "Add to Wishlist?"
    RoundBox $g 1130 1510 360 100 "Store Wishlist / History" "FFF2CC" "C55A11" 23
    RoundBox $g $x 1720 $w $h "Watch Trailer / Continue Browsing" "EAF3FF" "2E75B6" 25
    RoundBox $g $x 1900 $w 95 "End" "F4CCCC" "C00000" 28
    Arrow $g 850 245 850 310
    Arrow $g 850 415 850 490
    Arrow $g 850 595 850 670
    Arrow $g 850 860 850 930 "Yes"
    Arrow $g 650 765 410 765 "No"
    Arrow $g 410 765 610 540 "retry login"
    Arrow $g 850 1035 850 1110
    Arrow $g 850 1215 850 1290
    Arrow $g 850 1395 850 1470
    Arrow $g 1050 1565 1130 1560 "Yes"
    Arrow $g 1310 1610 1090 1770
    Arrow $g 850 1660 850 1720 "No"
    Arrow $g 850 1825 850 1900
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Class($path) {
    $c = New-Canvas 1900 1400; $bmp=$c[0]; $g=$c[1]
    Title $g "Netflix Clone - Class Diagram" 1900
    Entity $g 100 180 390 "User" @("+ id", "+ email", "+ password", "+ isAdmin", "+ login()", "+ logout()") "2E75B6"
    Entity $g 565 180 390 "Profile" @("+ id", "+ userId", "+ name", "+ avatar", "+ updateProfile()") "2E75B6"
    Entity $g 1030 180 390 "Movie" @("+ movieId", "+ title", "+ overview", "+ rating", "+ posterUrl", "+ trailerUrl") "C00000"
    Entity $g 565 760 390 "Wishlist" @("+ id", "+ userId", "+ movieId", "+ addedAt", "+ addMovie()", "+ removeMovie()") "9EAD00"
    Entity $g 1030 760 390 "History" @("+ id", "+ userId", "+ movieId", "+ watchedAt", "+ saveWatch()") "9C27B0"
    Entity $g 1460 460 340 "BackendAPI" @("+ request", "+ response", "+ authenticate()", "+ fetchMovies()", "+ saveData()") "F57C00"
    Arrow $g 490 360 565 360 "1 owns 1"
    Arrow $g 760 625 760 760 "1 creates many"
    Arrow $g 1225 625 1225 760 "1 watched many"
    Arrow $g 955 905 1030 905 "references"
    Arrow $g 1420 360 1460 550 "uses"
    Arrow $g 1420 905 1460 610 "uses"
    Arrow $g 1490 620 1420 470 "returns movie data"
    Text-Center $g "Classes represent the frontend models, Django API operations, and stored data relationships." 170 1280 1560 60 25 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-ER($path) {
    $c = New-Canvas 1900 1500; $bmp=$c[0]; $g=$c[1]
    Title $g "Netflix Clone - E-R Diagram" 1900
    Entity $g 90 270 390 "users" @("id  PK", "email", "password", "is_admin") "2E75B6"
    Entity $g 760 150 390 "profiles" @("id  PK", "user_id  FK", "name", "avatar") "1565C0"
    Entity $g 760 575 390 "wishlist" @("id  PK", "user_id  FK", "movie_id  FK", "added_at") "9EAD00"
    Entity $g 760 1000 390 "history" @("id  PK", "user_id  FK", "movie_id  FK", "watched_at") "9C27B0"
    Entity $g 1370 575 390 "movies" @("movie_id  PK", "title", "overview", "rating", "poster_url", "trailer_url") "C00000"
    Arrow $g 480 420 760 320 "1 : 1"
    Arrow $g 480 470 760 725 "1 : many"
    Arrow $g 480 520 760 1150 "1 : many"
    Arrow $g 1150 725 1370 725 "many : 1"
    Arrow $g 1150 1150 1370 880 "many : 1"
    Text-Center $g "A user owns one profile and can create many wishlist/history records. Each record references a movie." 180 1370 1540 60 25 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Cicd($path) {
    $c = New-Canvas 2000 1000; $bmp=$c[0]; $g=$c[1]
    Title $g "Netflix Clone - CI/CD Pipeline Flow" 2000
    $nodes = @(
        @(80,390,220,120,"GitHub`nRepository","EAF3FF","2E75B6"),
        @(360,390,220,120,"Jenkins`nPipeline","FFF2CC","BF9000"),
        @(640,230,250,120,"SonarQube`nCode Quality","E2F0D9","548235"),
        @(640,550,250,120,"Docker`nBuild Images","FCE4D6","C55A11"),
        @(970,550,230,120,"Trivy`nSecurity Scan","F4CCCC","C00000"),
        @(1280,550,230,120,"Docker Registry`nPush Images","EADCF8","7030A0"),
        @(1580,390,260,120,"Kubernetes`nDeploy Services","D9EAD3","38761D"),
        @(1580,720,260,120,"Prometheus + Grafana`nMonitor App","DDEBF7","1F4E79")
    )
    foreach($n in $nodes){ RoundBox $g $n[0] $n[1] $n[2] $n[3] $n[4] $n[5] $n[6] 24 }
    Arrow $g 300 450 360 450 "push"
    Arrow $g 580 420 640 290 "analyze"
    Arrow $g 580 480 640 610 "build"
    Arrow $g 890 610 970 610 "scan"
    Arrow $g 1200 610 1280 610 "push"
    Arrow $g 1510 610 1580 450 "deploy"
    Arrow $g 1710 510 1710 720 "metrics"
    Text-Center $g "Pipeline automates build, quality check, vulnerability scan, deployment, and monitoring." 280 885 1440 60 26 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

$diagrams = @{
    DFD0 = Join-Path $OutDir "dfd_level_0.png"
    DFD1 = Join-Path $OutDir "dfd_level_1.png"
    UseCase = Join-Path $OutDir "use_case.png"
    Activity = Join-Path $OutDir "activity.png"
    Class = Join-Path $OutDir "class.png"
    ER = Join-Path $OutDir "er.png"
    CICD = Join-Path $OutDir "cicd.png"
}

Save-Dfd0 $diagrams.DFD0
Save-Dfd1 $diagrams.DFD1
Save-UseCase $diagrams.UseCase
Save-Activity $diagrams.Activity
Save-Class $diagrams.Class
Save-ER $diagrams.ER
Save-Cicd $diagrams.CICD

Copy-Item -LiteralPath $ReportPath -Destination $OutputPath -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($OutputPath, $false, $false)

function Find-After($doc, [string]$text, [int]$start = 0) {
    $r = $doc.Range($start, $doc.Content.End)
    $f = $r.Find
    $f.ClearFormatting()
    $f.Text = $text
    $f.MatchCase = $false
    $f.MatchWholeWord = $false
    if ($f.Execute()) { return $r }
    return $null
}

function Add-Figure($doc, [string]$anchor, [int]$start, [string]$image, [string]$caption, [float]$maxWidth = 475) {
    $r = Find-After $doc $anchor $start
    if ($null -eq $r) {
        Write-Warning "Anchor not found: $anchor"
        return
    }
    $r.Collapse(0)
    $r.InsertParagraphAfter()
    $r.Collapse(0)
    $pic = $doc.InlineShapes.AddPicture($image, $false, $true, $r)
    $pic.LockAspectRatio = -1
    if ($pic.Width -gt $maxWidth) { $pic.Width = $maxWidth }
    $pic.Range.ParagraphFormat.Alignment = 1
    $r = $pic.Range
    $r.Collapse(0)
    $r.InsertParagraphAfter()
    $r.Collapse(0)
    $r.Text = $caption
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

    # Remove old/pasted diagrams from the System Design pages only. Keep screenshots later in implementation.
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
    $requirementsEnd = Find-After $doc "Availability - The system should be available for continuous integration and deployment." 0
    if ($null -ne $requirementsEnd) { $start = $requirementsEnd.End }

    Add-Figure $doc "Data Flow Diagram" $start $diagrams.DFD0 "Fig 5.1 DFD Level 0 / Context Diagram of Netflix Clone" 475
    Add-Figure $doc "Level 1:" $start $diagrams.DFD1 "Fig 5.2 DFD Level 1 of Netflix Clone" 475
    Add-Figure $doc "USE CASE DIAGRAM" $start $diagrams.UseCase "Fig 5.3 Use Case Diagram of Netflix Clone" 475
    Add-Figure $doc "ACTIVITY DIAGRAM" $start $diagrams.Activity "Fig 5.4 Activity Diagram of Netflix Clone" 430
    Add-Figure $doc "CLASS DIAGRAM" $start $diagrams.Class "Fig 5.5 Class Diagram of Netflix Clone" 475
    Add-Figure $doc "E-R DIAGRAM" $start $diagrams.ER "Fig 5.6 E-R Diagram of Netflix Clone" 475

    $implStart = 0
    $impl = Find-After $doc "IMPLEMENTATION" 0
    if ($null -ne $impl) { $implStart = $impl.End }
    Add-Figure $doc "6.6 CI/CD and Deployment Module" $implStart $diagrams.CICD "Fig 6.6.1 CI/CD Pipeline Flow of Netflix Clone" 475

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

Write-Output "Created clean diagram report: $OutputPath"
