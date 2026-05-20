param(
    [string]$TemplatePath = "C:\Users\Swati\Downloads\Netflix_report1_merged.docx",
    [string]$OutputPath = "C:\Users\Swati\Desktop\devops\Netflix-clone-main\Netflix_Clone_Project_Report_Final.docx"
)

$ErrorActionPreference = "Stop"

function Set-Cell {
    param(
        $Table,
        [int]$Row,
        [int]$Col,
        [string]$Text,
        [string]$Fill = "FFFFFF",
        [int]$Bold = 0
    )
    $cell = $Table.Cell($Row, $Col)
    $cell.Range.Text = $Text
    $cell.Range.Font.Name = "Times New Roman"
    $cell.Range.Font.Size = 11
    $cell.Range.Font.Bold = $Bold
    $cell.Range.ParagraphFormat.Alignment = 1
    $cell.VerticalAlignment = 1
    $cell.Shading.BackgroundPatternColor = [Convert]::ToInt32($Fill.Substring(4,2) + $Fill.Substring(2,2) + $Fill.Substring(0,2), 16)
}

function Add-Caption {
    param($Range, [string]$Caption)
    $Range.InsertParagraphAfter()
    $Range.Collapse(0)
    $Range.Text = $Caption
    $Range.Font.Name = "Times New Roman"
    $Range.Font.Size = 11
    $Range.Font.Bold = 1
    $Range.ParagraphFormat.Alignment = 1
    $Range.InsertParagraphAfter()
    $Range.Collapse(0)
}

function Add-BoxTable {
    param(
        $Doc,
        [string]$AnchorText,
        [string]$Caption,
        [object[]]$Rows,
        [string]$StartAfterText = ""
    )

    $range = $Doc.Content
    if ($StartAfterText.Trim().Length -gt 0) {
        $startRange = $Doc.Content
        $startFind = $startRange.Find
        $startFind.ClearFormatting()
        $startFind.Text = $StartAfterText
        $startFind.MatchCase = $false
        $startFind.MatchWholeWord = $false
        if ($startFind.Execute()) {
            $range.SetRange($startRange.End, $Doc.Content.End)
        }
    }

    $find = $range.Find
    $find.ClearFormatting()
    $find.Text = $AnchorText
    $find.MatchCase = $false
    $find.MatchWholeWord = $false

    if (-not $find.Execute()) {
        Write-Warning "Anchor not found: $AnchorText"
        return
    }

    $range.Collapse(0)
    $range.InsertParagraphAfter()
    $range.Collapse(0)

    Add-Caption $range $Caption

    $rowCount = $Rows.Count
    $colCount = ($Rows | ForEach-Object { $_.Count } | Measure-Object -Maximum).Maximum
    $table = $Doc.Tables.Add($range, $rowCount, $colCount)
    $table.Borders.Enable = 1
    $table.Range.ParagraphFormat.SpaceAfter = 0
    $table.Range.ParagraphFormat.Alignment = 1
    $table.Rows.Alignment = 1
    $table.TopPadding = 6
    $table.BottomPadding = 6
    $table.LeftPadding = 4
    $table.RightPadding = 4

    for ($r = 1; $r -le $rowCount; $r++) {
        $items = $Rows[$r - 1]
        for ($c = 1; $c -le $colCount; $c++) {
            $text = ""
            if ($c -le $items.Count) { $text = [string]$items[$c - 1] }
            $fill = "FFFFFF"
            $bold = 0
            if ($text -match "^(User|Frontend|Backend|Database|Firebase|TMDB|GitHub|Jenkins|Docker|Kubernetes|Prometheus|Grafana|Class|Entity|Activity|Use Case|External|System)") {
                $fill = "D9EAF7"
                $bold = 1
            }
            if ($text -match "^(START|END|LOGIN|BROWSE|VIEW|WATCH|LOGOUT)") {
                $fill = "E2F0D9"
                $bold = 1
            }
            Set-Cell $table $r $c $text $fill $bold
        }
    }

    $after = $table.Range
    $after.Collapse(0)
    $after.InsertParagraphAfter()
}

if (-not (Test-Path -LiteralPath $TemplatePath)) {
    throw "Template not found: $TemplatePath"
}

Copy-Item -LiteralPath $TemplatePath -Destination $OutputPath -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($OutputPath, $false, $false)

try {
    foreach ($section in $doc.Sections) {
        $section.PageSetup.TopMargin = 72
        $section.PageSetup.BottomMargin = 72
        $section.PageSetup.LeftMargin = 90
        $section.PageSetup.RightMargin = 72
    }

    foreach ($para in $doc.Paragraphs) {
        $text = $para.Range.Text.Trim()
        if ($text -eq "/") {
            $para.Range.Delete()
        } elseif ($text.Length -gt 95) {
            $para.Range.ParagraphFormat.Alignment = 3
            $para.Range.Font.Name = "Times New Roman"
            if ($para.Range.Font.Size -lt 10 -or $para.Range.Font.Size -gt 14) {
                $para.Range.Font.Size = 12
            }
        }
    }

    $systemDesignStart = "Availability - The system should be available for continuous integration and deployment."

    Add-BoxTable $doc "Data Flow Diagram" "Fig 5.1 Data Flow Diagram of Netflix Clone" @(
        @("External Entity", "Data/Request", "System Process", "Data Store / Service"),
        @("User", "Login, search, browse, wishlist", "React Frontend", "Firebase Auth"),
        @("React Frontend", "API request / response", "Django REST Backend", "SQLite Database"),
        @("Django Backend", "Movie metadata request", "TMDB API Integration", "TMDB Cloud Service"),
        @("Application Pods", "Metrics and health data", "Monitoring Layer", "Prometheus and Grafana")
    ) $systemDesignStart

    Add-BoxTable $doc "USE CASE DIAGRAM" "Fig 5.2 Use Case Diagram of Netflix Clone" @(
        @("Actor", "Use Case", "System Response"),
        @("User", "Register / Login", "Validate account using Firebase Authentication"),
        @("User", "Browse and Search Movies", "Display dynamic movie list from TMDB API"),
        @("User", "View Movie Details", "Show overview, rating, poster and trailer option"),
        @("User", "Manage Wishlist", "Save or remove selected movies"),
        @("User", "Watch Trailer", "Open trailer playback using YouTube/video service"),
        @("Admin / Developer", "Run CI/CD Pipeline", "Build, scan, containerize and deploy application")
    ) $systemDesignStart

    Add-BoxTable $doc "ACTIVITY DIAGRAM" "Fig 5.3 Activity Diagram of Netflix Clone" @(
        @("START", "Open Application"),
        @("LOGIN", "Authenticate user session"),
        @("BROWSE", "Fetch categories, banners and movie rows"),
        @("VIEW", "Open details modal and read movie information"),
        @("WATCH", "Add to wishlist / play trailer / continue watching"),
        @("LOGOUT", "End authenticated session"),
        @("END", "Application workflow completed")
    ) $systemDesignStart

    Add-BoxTable $doc "CLASS DIAGRAM" "Fig 5.4 Class Diagram of Netflix Clone" @(
        @("Class", "Important Attributes", "Main Operations"),
        @("User", "id, email, password, is_admin", "register(), login(), logout()"),
        @("Profile", "id, user_id, name, avatar", "createProfile(), updateProfile()"),
        @("Movie", "movie_id, title, overview, poster, rating", "fetchMovies(), viewDetails()"),
        @("Wishlist", "id, user_id, movie_id, created_at", "addMovie(), removeMovie()"),
        @("History", "id, user_id, movie_id, watched_at", "saveWatch(), getContinueWatching()"),
        @("BackendAPI", "request, response, status", "authenticate(), storeData(), returnResponse()")
    ) $systemDesignStart

    Add-BoxTable $doc "E-R DIAGRAM" "Fig 5.5 E-R Diagram of Netflix Clone" @(
        @("Entity", "Relationship", "Entity"),
        @("User", "1 to 1 owns", "Profile"),
        @("User", "1 to many creates", "Wishlist"),
        @("User", "1 to many records", "History"),
        @("Wishlist", "many records reference", "Movie"),
        @("History", "many records reference", "Movie"),
        @("Movie", "data fetched from", "TMDB API")
    ) $systemDesignStart

    Add-BoxTable $doc "6.6 CI/CD and Deployment Module" "Fig 6.6.1 CI/CD Pipeline Flow" @(
        @("GitHub", "Push source code and Jenkinsfile"),
        @("Jenkins", "Checkout, install dependencies, test and build"),
        @("SonarQube", "Perform static code quality analysis"),
        @("Docker", "Build frontend and backend container images"),
        @("Trivy", "Scan images for known vulnerabilities"),
        @("Docker Registry", "Store versioned container images"),
        @("Kubernetes", "Deploy frontend, backend, services and pods"),
        @("Prometheus / Grafana", "Monitor metrics and visualize dashboards")
    ) "IMPLEMENTATION"

    $doc.Fields.Update() | Out-Null
    $doc.Save()
}
finally {
    $doc.Close($true)
    $word.Quit()
}

Write-Output "Created final report: $OutputPath"
