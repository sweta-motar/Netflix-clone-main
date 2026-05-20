param(
    [string]$OutputPdf = "C:\Users\Swati\Desktop\devops\Netflix-clone-main\Netflix_Clean_Diagrams_Only.pdf"
)

$ErrorActionPreference = "Stop"

$Root = "C:\Users\Swati\Desktop\devops\Netflix-clone-main"
$OutDir = Join-Path $Root "generated_diagrams\pdf_only"
$DocxPath = Join-Path $OutDir "Netflix_Clean_Diagrams_Only.docx"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Add-Type -AssemblyName System.Drawing

function C([string]$hex) { [System.Drawing.ColorTranslator]::FromHtml("#$hex") }

function New-Canvas([int]$w = 2400, [int]$h = 1500) {
    $bmp = [System.Drawing.Bitmap]::new($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::White)
    @($bmp, $g)
}

function Font([float]$size, [int]$style = 0) {
    [System.Drawing.Font]::new("Arial", [single]$size, [System.Drawing.FontStyle]$style)
}

function TextCenter($g, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size = 30, [int]$style = 0, [string]$color = "111111") {
    $font = Font $size $style
    $brush = [System.Drawing.SolidBrush]::new((C $color))
    $fmt = [System.Drawing.StringFormat]::new()
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $fmt.Trimming = [System.Drawing.StringTrimming]::Word
    $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x, $y, $w, $h), $fmt)
    $fmt.Dispose(); $brush.Dispose(); $font.Dispose()
}

function TextLeft($g, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$size = 24, [int]$style = 0, [string]$color = "111111") {
    $font = Font $size $style
    $brush = [System.Drawing.SolidBrush]::new((C $color))
    $fmt = [System.Drawing.StringFormat]::new()
    $fmt.Alignment = [System.Drawing.StringAlignment]::Near
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $fmt.Trimming = [System.Drawing.StringTrimming]::Word
    $g.DrawString($text, $font, $brush, [System.Drawing.RectangleF]::new($x, $y, $w, $h), $fmt)
    $fmt.Dispose(); $brush.Dispose(); $font.Dispose()
}

function Label($g, [string]$text, [float]$x, [float]$y, [float]$w = 210, [float]$h = 42) {
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $pen = [System.Drawing.Pen]::new((C "D0D0D0"), 1)
    $g.FillRectangle($brush, $x, $y, $w, $h)
    $g.DrawRectangle($pen, $x, $y, $w, $h)
    TextCenter $g $text $x $y $w $h 18 0 "222222"
    $pen.Dispose(); $brush.Dispose()
}

function Title($g, [string]$text) {
    TextCenter $g $text 0 30 2400 90 48 1
}

function RoundBox($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$text, [string]$fill = "FFFFFF", [string]$border = "2E75B6", [float]$size = 28) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $r = 32
    $path.AddArc($x, $y, $r, $r, 180, 90)
    $path.AddArc($x + $w - $r, $y, $r, $r, 270, 90)
    $path.AddArc($x + $w - $r, $y + $h - $r, $r, $r, 0, 90)
    $path.AddArc($x, $y + $h - $r, $r, $r, 90, 90)
    $path.CloseFigure()
    $brush = [System.Drawing.SolidBrush]::new((C $fill))
    $pen = [System.Drawing.Pen]::new((C $border), 4)
    $g.FillPath($brush, $path)
    $g.DrawPath($pen, $path)
    TextCenter $g $text $x $y $w $h $size 0
    $pen.Dispose(); $brush.Dispose(); $path.Dispose()
}

function RectBox($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$title, [string]$fill, [string]$border) {
    $brush = [System.Drawing.SolidBrush]::new((C $fill))
    $pen = [System.Drawing.Pen]::new((C $border), 4)
    $g.FillRectangle($brush, $x, $y, $w, $h)
    $g.DrawRectangle($pen, $x, $y, $w, $h)
    TextCenter $g $title $x ($y + 8) $w 50 30 1 $border
    $pen.Dispose(); $brush.Dispose()
}

function Diamond($g, [float]$x, [float]$y, [float]$w, [float]$h, [string]$text) {
    $pts = @(
        [System.Drawing.PointF]::new($x + $w / 2, $y),
        [System.Drawing.PointF]::new($x + $w, $y + $h / 2),
        [System.Drawing.PointF]::new($x + $w / 2, $y + $h),
        [System.Drawing.PointF]::new($x, $y + $h / 2)
    )
    $brush = [System.Drawing.SolidBrush]::new((C "FFF2CC"))
    $pen = [System.Drawing.Pen]::new((C "C55A11"), 4)
    $g.FillPolygon($brush, $pts)
    $g.DrawPolygon($pen, $pts)
    TextCenter $g $text $x $y $w $h 27 0
    $pen.Dispose(); $brush.Dispose()
}

function Arrow($g, [float]$x1, [float]$y1, [float]$x2, [float]$y2, [string]$label = "", [float]$lx = -1, [float]$ly = -1) {
    $pen = [System.Drawing.Pen]::new((C "202020"), 4)
    $cap = [System.Drawing.Drawing2D.AdjustableArrowCap]::new(8, 9)
    $pen.CustomEndCap = $cap
    $g.DrawLine($pen, $x1, $y1, $x2, $y2)
    if ($label.Trim().Length -gt 0) {
        if ($lx -lt 0) { $lx = (($x1 + $x2) / 2) - 110 }
        if ($ly -lt 0) { $ly = (($y1 + $y2) / 2) - 22 }
        Label $g $label $lx $ly 220 44
    }
    $cap.Dispose(); $pen.Dispose()
}

function PolyArrow($g, [System.Drawing.PointF[]]$pts, [string]$label = "", [float]$lx = -1, [float]$ly = -1) {
    $pen = [System.Drawing.Pen]::new((C "202020"), 4)
    $cap = [System.Drawing.Drawing2D.AdjustableArrowCap]::new(8, 9)
    $pen.CustomEndCap = $cap
    $g.DrawLines($pen, $pts)
    if ($label.Trim().Length -gt 0) {
        if ($lx -lt 0) { $lx = $pts[0].X }
        if ($ly -lt 0) { $ly = $pts[0].Y }
        Label $g $label $lx $ly 230 44
    }
    $cap.Dispose(); $pen.Dispose()
}

function P([float]$x,[float]$y) { [System.Drawing.PointF]::new($x,$y) }

function Actor($g, [float]$x, [float]$y, [string]$label) {
    $pen = [System.Drawing.Pen]::new((C "111111"), 4)
    $g.DrawEllipse($pen, $x + 40, $y, 70, 70)
    $g.DrawLine($pen, $x + 75, $y + 70, $x + 75, $y + 205)
    $g.DrawLine($pen, $x, $y + 115, $x + 150, $y + 115)
    $g.DrawLine($pen, $x + 75, $y + 205, $x + 15, $y + 295)
    $g.DrawLine($pen, $x + 75, $y + 205, $x + 135, $y + 295)
    TextCenter $g $label ($x - 30) ($y + 305) 210 55 28 1
    $pen.Dispose()
}

function Entity($g, [float]$x, [float]$y, [float]$w, [string]$name, [string[]]$fields, [string]$color) {
    $row = 58
    $h = 76 + ($fields.Count * $row)
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $pen = [System.Drawing.Pen]::new((C $color), 4)
    $g.FillRectangle($brush, $x, $y, $w, $h)
    $g.DrawRectangle($pen, $x, $y, $w, $h)
    $hb = [System.Drawing.SolidBrush]::new((C "F7FBFF"))
    $g.FillRectangle($hb, $x + 2, $y + 2, $w - 4, 70)
    TextLeft $g $name ($x + 24) $y ($w - 48) 70 30 1
    $line = [System.Drawing.Pen]::new((C "D9D9D9"), 2)
    $g.DrawLine($line, $x, $y + 74, $x + $w, $y + 74)
    for ($i = 0; $i -lt $fields.Count; $i++) {
        $yy = $y + 76 + ($i * $row)
        TextLeft $g $fields[$i] ($x + 24) $yy ($w - 48) $row 23 0
        if ($i -lt $fields.Count - 1) { $g.DrawLine($line, $x, $yy + $row, $x + $w, $yy + $row) }
    }
    $line.Dispose(); $hb.Dispose(); $pen.Dispose(); $brush.Dispose()
}

function Save-Dfd0($path) {
    $cvs = New-Canvas; $bmp=$cvs[0]; $g=$cvs[1]
    Title $g "DFD Level 0 - Netflix Clone Context Diagram"
    RoundBox $g 990 580 420 170 "Netflix Clone`nSystem" "FCE4EC" "C2185B" 33
    Actor $g 150 570 "User"
    Actor $g 2050 570 "Developer"
    RoundBox $g 920 220 560 135 "TMDB / Rapid API`nMovie Information" "F3E5F5" "7B1FA2" 28
    RoundBox $g 1650 575 440 135 "Firebase / SQLite`nUser Data" "FFF8E1" "F9A825" 28
    RoundBox $g 890 1080 620 135 "Jenkins, Docker, Kubernetes`nCI/CD Deployment" "E3F2FD" "1565C0" 27
    RoundBox $g 330 1080 440 135 "Prometheus + Grafana`nMonitoring" "E8F5E9" "2E7D32" 27
    Arrow $g 365 655 990 625 "request" 595 600
    Arrow $g 990 710 365 710 "response" 595 735
    Arrow $g 1200 580 1200 355 "fetch data" 1225 440
    Arrow $g 1285 355 1285 580 "movie data" 1310 440
    Arrow $g 1410 650 1650 650 "auth/data" 1475 595
    Arrow $g 1650 715 1410 715 "stored data" 1475 740
    Arrow $g 2050 725 1510 1145 "push code" 1740 965
    Arrow $g 1200 1080 1200 750 "deploy" 1225 910
    Arrow $g 990 715 770 1145 "metrics" 760 920
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Dfd1($path) {
    $cvs = New-Canvas 2600 1700; $bmp=$cvs[0]; $g=$cvs[1]
    TextCenter $g "DFD Level 1 - Netflix Clone Detailed Data Flow" 0 30 2600 90 48 1
    RectBox $g 100 190 500 1050 "Frontend Layer" "EEF6FF" "1E88E5"
    RectBox $g 820 190 500 900 "Backend Services Layer" "FFF3E0" "EF6C00"
    RectBox $g 1540 190 430 430 "External APIs" "F3E5F5" "7B1FA2"
    RectBox $g 1540 720 430 430 "Data Layer" "FFF8E1" "F9A825"
    RectBox $g 100 1330 820 200 "CI/CD Layer" "E8F5E9" "43A047"
    RectBox $g 1400 1330 720 200 "Monitoring Layer" "FFEBEE" "E53935"

    Actor $g 35 630 "User"
    RoundBox $g 230 330 260 90 "User Interface" "FFFFFF" "1E88E5" 22
    RoundBox $g 230 540 260 90 "Search Module" "FFFFFF" "1E88E5" 22
    RoundBox $g 230 750 260 90 "Video Player" "FFFFFF" "1E88E5" 22
    RoundBox $g 230 960 260 90 "Wishlist View" "FFFFFF" "1E88E5" 22

    RoundBox $g 925 330 290 90 "Movie Fetch API" "FFFFFF" "EF6C00" 22
    RoundBox $g 925 540 290 90 "Authentication API" "FFFFFF" "EF6C00" 22
    RoundBox $g 925 750 290 90 "Wishlist / History API" "FFFFFF" "EF6C00" 21

    RoundBox $g 1625 315 260 90 "TMDB API" "FFFFFF" "7B1FA2" 22
    RoundBox $g 1625 800 260 90 "Firebase Auth" "FFFFFF" "F9A825" 22
    RoundBox $g 1625 965 260 90 "SQLite Database" "FFFFFF" "F9A825" 22

    RoundBox $g 210 1400 190 75 "GitHub" "FFFFFF" "43A047" 20
    RoundBox $g 455 1400 190 75 "Jenkins" "FFFFFF" "43A047" 20
    RoundBox $g 700 1400 170 75 "Docker / K8s" "FFFFFF" "43A047" 18
    RoundBox $g 1505 1400 230 75 "Prometheus" "FFFFFF" "E53935" 20
    RoundBox $g 1815 1400 190 75 "Grafana" "FFFFFF" "E53935" 20

    Arrow $g 185 775 230 375 "interacts" 150 510
    Arrow $g 490 375 925 375 "movie request" 625 320
    Arrow $g 925 420 490 420 "movie results" 625 445
    PolyArrow $g @((P 490 585),(P 700 585),(P 700 375),(P 925 375)) "search query" 570 610
    PolyArrow $g @((P 490 795),(P 740 795),(P 740 375),(P 925 375)) "trailer request" 565 830
    Arrow $g 490 1005 925 795 "save/read" 625 910
    Arrow $g 1215 375 1625 360 "fetch movie data" 1335 320
    Arrow $g 1625 405 1215 420 "API response" 1335 445
    Arrow $g 1215 585 1625 845 "authenticate" 1330 650
    Arrow $g 1215 795 1625 1010 "store data" 1325 880
    Arrow $g 400 1438 455 1438 "push" 397 1383
    Arrow $g 645 1438 700 1438 "build" 638 1485
    PolyArrow $g @((P 870 1400),(P 1065 1240),(P 1065 1090)) "deploy" 940 1245
    PolyArrow $g @((P 1065 1090),(P 1505 1400)) "metrics" 1220 1220
    Arrow $g 1735 1438 1815 1438 "visualize" 1730 1383

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-UseCase($path) {
    $cvs = New-Canvas; $bmp=$cvs[0]; $g=$cvs[1]
    Title $g "Use Case Diagram - Netflix Clone"
    RectBox $g 520 185 1320 1110 "Netflix Clone System" "F8FBFF" "2E75B6"
    Actor $g 160 560 "User"
    Actor $g 2070 560 "Developer"
    $cases = @(
        @(700,330,360,100,"Register / Login"),
        @(1280,330,360,100,"Browse Movies"),
        @(700,560,360,100,"Search Content"),
        @(1280,560,360,100,"View Movie Details"),
        @(700,790,360,100,"Manage Wishlist"),
        @(1280,790,360,100,"Watch Trailer"),
        @(990,1010,390,100,"View Watch History"),
        @(1280,1145,360,90,"Run CI/CD Pipeline")
    )
    foreach($uc in $cases){ RoundBox $g $uc[0] $uc[1] $uc[2] $uc[3] $uc[4] "FFFFFF" "4472C4" 25 }
    foreach($p in @(@(700,380),@(1280,380),@(700,610),@(1280,610),@(700,840),@(1280,840),@(990,1060))){
        Arrow $g 355 710 $p[0] $p[1]
    }
    Arrow $g 2070 715 1640 1190
    TextCenter $g "User features connect to Firebase Authentication, TMDB movie data, Django APIs and SQLite storage." 560 1320 1280 65 27 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Activity($path) {
    $cvs = New-Canvas 1800 2400; $bmp=$cvs[0]; $g=$cvs[1]
    TextCenter $g "Activity Diagram - Netflix Clone" 0 30 1800 90 48 1
    $x = 650; $w = 500; $h = 110
    RoundBox $g $x 170 $w 95 "Start" "D9EAD3" "38761D" 30
    RoundBox $g $x 350 $w $h "Open Application" "EAF3FF" "2E75B6" 28
    RoundBox $g $x 560 $w $h "Login using Firebase Auth" "EAF3FF" "2E75B6" 27
    Diamond $g 690 790 420 200 "Authenticated?"
    RoundBox $g $x 1120 $w $h "Search / Browse Movies" "EAF3FF" "2E75B6" 27
    RoundBox $g $x 1330 $w $h "Fetch Movie Data from TMDB API" "EAF3FF" "2E75B6" 25
    RoundBox $g $x 1540 $w $h "Display Movie List and Details" "EAF3FF" "2E75B6" 25
    Diamond $g 690 1770 420 200 "Add to Wishlist?"
    RoundBox $g 1230 1815 360 100 "Store Wishlist / History" "FFF2CC" "C55A11" 23
    RoundBox $g $x 2050 $w $h "Watch Trailer / Continue Browsing" "EAF3FF" "2E75B6" 25
    RoundBox $g $x 2250 $w 95 "End" "F4CCCC" "C00000" 30
    Arrow $g 900 265 900 350
    Arrow $g 900 460 900 560
    Arrow $g 900 670 900 790
    Arrow $g 900 990 900 1120 "Yes" 930 1030
    PolyArrow $g @((P 690 890),(P 430 890),(P 430 615),(P 650 615)) "No / Retry" 420 745
    Arrow $g 900 1230 900 1330
    Arrow $g 900 1440 900 1540
    Arrow $g 900 1650 900 1770
    Arrow $g 1110 1870 1230 1865 "Yes" 1120 1815
    PolyArrow $g @((P 1410 1915),(P 1410 2105),(P 1150 2105)) "saved" 1400 2000
    Arrow $g 900 1970 900 2050 "No" 930 1990
    Arrow $g 900 2160 900 2250
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Class($path) {
    $cvs = New-Canvas; $bmp=$cvs[0]; $g=$cvs[1]
    Title $g "Class Diagram - Netflix Clone"
    Entity $g 110 220 430 "User" @("+ id", "+ email", "+ password", "+ isAdmin", "+ login()", "+ logout()") "2E75B6"
    Entity $g 650 220 430 "Profile" @("+ id", "+ userId", "+ name", "+ avatar", "+ updateProfile()") "2E75B6"
    Entity $g 1190 220 430 "Movie" @("+ movieId", "+ title", "+ overview", "+ rating", "+ posterUrl", "+ trailerUrl") "C00000"
    Entity $g 650 910 430 "Wishlist" @("+ id", "+ userId", "+ movieId", "+ addedAt", "+ addMovie()", "+ removeMovie()") "9EAD00"
    Entity $g 1190 910 430 "History" @("+ id", "+ userId", "+ movieId", "+ watchedAt", "+ saveWatch()") "9C27B0"
    Entity $g 1780 560 430 "BackendAPI" @("+ request", "+ response", "+ authenticate()", "+ fetchMovies()", "+ saveData()") "F57C00"
    Arrow $g 540 425 650 425 "1 owns 1" 550 370
    Arrow $g 865 610 865 910 "creates" 885 750
    Arrow $g 1405 610 1405 910 "records" 1425 750
    Arrow $g 1080 1080 1190 1080 "references" 1085 1025
    Arrow $g 1620 425 1780 650 "uses" 1645 510
    Arrow $g 1620 1080 1780 755 "uses" 1645 910
    TextCenter $g "The classes show how user data, movie information, wishlist records and history records connect through backend APIs." 250 1360 1900 65 27 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-ER($path) {
    $cvs = New-Canvas; $bmp=$cvs[0]; $g=$cvs[1]
    Title $g "E-R Diagram - Netflix Clone"
    Entity $g 130 430 430 "users" @("id  PK", "email", "password", "is_admin") "2E75B6"
    Entity $g 850 220 430 "profiles" @("id  PK", "user_id  FK", "name", "avatar") "1565C0"
    Entity $g 850 640 430 "wishlist" @("id  PK", "user_id  FK", "movie_id  FK", "added_at") "9EAD00"
    Entity $g 850 1060 430 "history" @("id  PK", "user_id  FK", "movie_id  FK", "watched_at") "9C27B0"
    Entity $g 1600 620 430 "movies" @("movie_id  PK", "title", "overview", "rating", "poster_url", "trailer_url") "C00000"
    Arrow $g 560 535 850 375 "1 : 1" 635 410
    Arrow $g 560 605 850 775 "1 : many" 620 670
    Arrow $g 560 675 850 1195 "1 : many" 610 945
    Arrow $g 1280 775 1600 775 "many : 1" 1350 720
    Arrow $g 1280 1195 1600 985 "many : 1" 1345 1065
    TextCenter $g "One user has one profile and can create many wishlist/history rows. Wishlist and history rows reference movie records." 250 1360 1900 65 27 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

function Save-Cicd($path) {
    $cvs = New-Canvas; $bmp=$cvs[0]; $g=$cvs[1]
    Title $g "CI/CD Pipeline Diagram - Netflix Clone"
    RoundBox $g 120 550 260 125 "GitHub`nRepository" "EAF3FF" "2E75B6" 25
    RoundBox $g 470 550 260 125 "Jenkins`nPipeline" "FFF2CC" "BF9000" 25
    RoundBox $g 850 335 300 125 "SonarQube`nCode Quality" "E2F0D9" "548235" 25
    RoundBox $g 850 765 300 125 "Docker`nBuild Images" "FCE4D6" "C55A11" 25
    RoundBox $g 1240 765 280 125 "Trivy`nSecurity Scan" "F4CCCC" "C00000" 25
    RoundBox $g 1610 765 300 125 "Docker Registry`nPush Images" "EADCF8" "7030A0" 24
    RoundBox $g 1980 550 300 125 "Kubernetes`nDeployment" "D9EAD3" "38761D" 25
    RoundBox $g 1980 1010 300 125 "Prometheus + Grafana`nMonitoring" "DDEBF7" "1F4E79" 24
    Arrow $g 380 612 470 612 "push" 385 555
    Arrow $g 730 580 850 398 "code scan" 735 455
    Arrow $g 730 645 850 828 "build" 745 710
    Arrow $g 1150 828 1240 828 "scan" 1165 775
    Arrow $g 1520 828 1610 828 "push" 1535 775
    Arrow $g 1910 828 1980 612 "deploy" 1915 705
    Arrow $g 2130 675 2130 1010 "metrics" 2150 830
    TextCenter $g "Automated flow: source push -> Jenkins -> quality check -> image build -> vulnerability scan -> registry -> Kubernetes deploy -> monitoring." 180 1320 2040 65 27 1
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()
}

$images = @(
    @{ Name = "DFD Level 0"; Path = Join-Path $OutDir "01_dfd_level_0.png"; Fn = ${function:Save-Dfd0} },
    @{ Name = "DFD Level 1"; Path = Join-Path $OutDir "02_dfd_level_1.png"; Fn = ${function:Save-Dfd1} },
    @{ Name = "Use Case Diagram"; Path = Join-Path $OutDir "03_use_case.png"; Fn = ${function:Save-UseCase} },
    @{ Name = "Activity Diagram"; Path = Join-Path $OutDir "04_activity.png"; Fn = ${function:Save-Activity} },
    @{ Name = "Class Diagram"; Path = Join-Path $OutDir "05_class.png"; Fn = ${function:Save-Class} },
    @{ Name = "E-R Diagram"; Path = Join-Path $OutDir "06_er.png"; Fn = ${function:Save-ER} },
    @{ Name = "CI/CD Pipeline Diagram"; Path = Join-Path $OutDir "07_cicd.png"; Fn = ${function:Save-Cicd} }
)

Save-Dfd0 $images[0].Path
Save-Dfd1 $images[1].Path
Save-UseCase $images[2].Path
Save-Activity $images[3].Path
Save-Class $images[4].Path
Save-ER $images[5].Path
Save-Cicd $images[6].Path

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

try {
    foreach ($section in $doc.Sections) {
        $section.PageSetup.Orientation = 1
        $section.PageSetup.TopMargin = 36
        $section.PageSetup.BottomMargin = 36
        $section.PageSetup.LeftMargin = 36
        $section.PageSetup.RightMargin = 36
    }

    for ($i = 0; $i -lt $images.Count; $i++) {
        if ($i -gt 0) {
            $range = $doc.Content
            $range.Collapse(0)
            $range.InsertBreak(7)
        }

        $range = $doc.Content
        $range.Collapse(0)
        $range.Text = $images[$i].Name
        $range.Font.Name = "Times New Roman"
        $range.Font.Size = 18
        $range.Font.Bold = 1
        $range.ParagraphFormat.Alignment = 1
        $range.InsertParagraphAfter()
        $range.Collapse(0)

        $pic = $doc.InlineShapes.AddPicture($images[$i].Path, $false, $true, $range)
        $pic.LockAspectRatio = -1
        if ($pic.Width -gt 720) { $pic.Width = 720 }
        if ($pic.Height -gt 470) { $pic.Height = 470 }
        $pic.Range.ParagraphFormat.Alignment = 1
    }

    $doc.SaveAs2($DocxPath)
    $doc.ExportAsFixedFormat($OutputPdf, 17)
}
finally {
    $doc.Close($false)
    $word.Quit()
}

Remove-Item -LiteralPath $DocxPath -Force -ErrorAction SilentlyContinue
Write-Output "Created diagrams PDF: $OutputPdf"
