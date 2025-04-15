# Script to handle additional cleanup and optimization
$backupDir = "cleanup_backup/additional"
if (-not (Test-Path -Path $backupDir)) {
    New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
}

# 1. Move uncommon image formats
$uncommonFormats = @("*.pdf", "*.webp", "*.HEIC", "*.tiff", "*.bmp", "*.raw")
Write-Host "Moving uncommon image formats to backup:"
foreach ($format in $uncommonFormats) {
    $files = Get-ChildItem -Path "public" -Recurse -File -Include $format
    foreach ($file in $files) {
        $destPath = Join-Path -Path $backupDir -ChildPath "uncommon_formats"
        if (-not (Test-Path -Path $destPath)) {
            New-Item -Path $destPath -ItemType Directory -Force | Out-Null
        }
        
        $destFile = Join-Path -Path $destPath -ChildPath $file.Name
        Write-Host "  - Moving $($file.FullName) to backup"
        Move-Item -Path $file.FullName -Destination $destFile -Force
    }
}

# 2. Move potential temporary/test files
$suspiciousPatterns = @("*test*", "*tmp*", "*temp*", "*copy*", "*backup*", "*old*", "*draft*")
Write-Host "`nMoving potential temporary files to backup:"
foreach ($pattern in $suspiciousPatterns) {
    $files = Get-ChildItem -Path "public" -Recurse -File -Include $pattern -Exclude "Inter_Bold.json"
    foreach ($file in $files) {
        $destPath = Join-Path -Path $backupDir -ChildPath "potential_temp_files"
        if (-not (Test-Path -Path $destPath)) {
            New-Item -Path $destPath -ItemType Directory -Force | Out-Null
        }
        
        $destFile = Join-Path -Path $destPath -ChildPath $file.Name
        Write-Host "  - Moving $($file.FullName) to backup"
        Move-Item -Path $file.FullName -Destination $destFile -Force
    }
}

# 3. Clean up empty directories
Write-Host "`nRemoving empty directories:"
$emptyDirs = @()

function Find-EmptyDirectories {
    param(
        [string]$Path
    )
    
    $dirs = Get-ChildItem -Path $Path -Directory -Recurse
    
    foreach ($dir in $dirs) {
        if ((Get-ChildItem -Path $dir.FullName -Force | Measure-Object).Count -eq 0) {
            $script:emptyDirs += $dir.FullName
        }
    }
}

Find-EmptyDirectories -Path "public"

foreach ($dir in $emptyDirs) {
    Write-Host "  - Removing empty directory: $dir"
    Remove-Item -Path $dir -Force
}

# 4. Consolidate directories with only 1-2 files
Write-Host "`nDirectories with very few files (1-2) could be consolidated:"
$dirs = Get-ChildItem -Path "public" -Directory -Recurse
foreach ($dir in $dirs) {
    $fileCount = (Get-ChildItem -Path $dir.FullName -File | Measure-Object).Count
    if ($fileCount -gt 0 -and $fileCount -le 2) {
        Write-Host "  - $($dir.FullName) ($fileCount files)"
        # Note: We're not automatically consolidating these, just listing them
    }
}

Write-Host "`nAdditional cleanup complete."
Write-Host "Note: Large files were not automatically moved/optimized. Consider manually compressing images larger than 2MB."
Write-Host "Note: Directories with few files were not automatically consolidated. Review and manually consolidate if appropriate." 