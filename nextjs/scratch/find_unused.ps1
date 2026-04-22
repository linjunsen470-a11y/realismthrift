
$publicDir = "public"
$codeDirs = @("app", "components", "data", "lib")
$files = Get-ChildItem -Path $publicDir -Recurse -File

$unusedFiles = @()

# Read all code content into a single string for faster searching
$allCode = ""
foreach ($dir in $codeDirs) {
    if (Test-Path $dir) {
        $allCode += Get-ChildItem -Path $dir -Recurse -File | ForEach-Object { Get-Content $_.FullName -Raw }
    }
}

foreach ($file in $files) {
    $name = $file.Name
    if ($name -eq "favicon.ico" -or $name -eq "robots.txt" -or $name -eq "sitemap.xml" -or $name -eq ".DS_Store") {
        continue
    }

    # Search for the filename in the concatenated code string
    if ($allCode -notmatch [regex]::Escape($name)) {
        $unusedFiles += $file.FullName
    }
}

$unusedFiles | Out-File "scratch/unused_files.txt"
Write-Host "Found $($unusedFiles.Count) potentially unused files out of $($files.Count)."
