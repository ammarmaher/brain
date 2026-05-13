<#
.SYNOPSIS
  Falcon Brain — portable backup & restore.

.DESCRIPTION
  One script, three modes:
    Backup  — package everything Brain-related into a single .zip
    Restore — unpack a .zip on a new machine and place files where they belong
    List    — show what WOULD be backed up (no writes), useful for dry-run

  Covers:
    - C:\falcon\Brain\           (core Brain — orchestrator, voices, configs)
    - C:\falcon\brain-skills\    (business + front-end + code/testing skills)
    - C:\falcon\universal-brain\ (cross-session task state)
    - C:\falcon\.claude\         (project-local skills, commands, agents)
    - C:\falcon\CLAUDE.md        (project memory)
    - $env:USERPROFILE\.claude\  (global Claude skills + settings + memory)
    - PowerShell profile         (the `claude` launcher function)

  By default API keys (Brain\config\keys.env) are EXCLUDED. Pass -IncludeKeys
  to bake them in — recommended ONLY when transferring via an encrypted
  channel.

.EXAMPLE
  # Source machine — package everything (no keys, safe to share)
  .\falcon-brain-portable.ps1 -Mode Backup -BackupPath "D:\falcon-brain-2026-04-27.zip"

.EXAMPLE
  # Source machine — include API keys (transfer via encrypted USB only!)
  .\falcon-brain-portable.ps1 -Mode Backup -BackupPath "D:\falcon-brain-with-keys.zip" -IncludeKeys

.EXAMPLE
  # Target machine — restore
  .\falcon-brain-portable.ps1 -Mode Restore -BackupPath "D:\falcon-brain-2026-04-27.zip"

.EXAMPLE
  # Source machine — preview what would be backed up
  .\falcon-brain-portable.ps1 -Mode List
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Backup', 'Restore', 'List')]
    [string]$Mode,

    [string]$BackupPath = "$env:USERPROFILE\Desktop\falcon-brain-$(Get-Date -Format 'yyyy-MM-dd-HHmm').zip",
    [string]$FalconRoot = 'C:\falcon',
    [string]$ClaudeUserRoot = (Join-Path $env:USERPROFILE '.claude'),
    [switch]$IncludeKeys = $false,
    [switch]$IncludeWiki = $false,
    [switch]$Force = $false
)

# *** Banner *********************************************************
$Banner = @"

============================================================
   FALCON BRAIN — PORTABLE BACKUP & RESTORE
   Mode: $Mode
   Backup file: $BackupPath
============================================================

"@
Write-Host $Banner -ForegroundColor Cyan

# *** Source paths ***************************************************
$SourcePaths = @(
    @{ Source = (Join-Path $FalconRoot 'Brain');           Target = 'falcon\Brain';           Required = $true  },
    @{ Source = (Join-Path $FalconRoot 'brain-skills');    Target = 'falcon\brain-skills';    Required = $true  },
    @{ Source = (Join-Path $FalconRoot 'universal-brain'); Target = 'falcon\universal-brain'; Required = $true  },
    @{ Source = (Join-Path $FalconRoot '.claude');         Target = 'falcon\.claude';         Required = $true  },
    @{ Source = (Join-Path $FalconRoot 'CLAUDE.md');       Target = 'falcon\CLAUDE.md';       Required = $true  },
    @{ Source = $ClaudeUserRoot;                           Target = '_user\.claude';          Required = $true  }
)

# Optional: PowerShell profile (one of two locations)
$PsProfileCandidates = @(
    (Join-Path $env:USERPROFILE 'Documents\PowerShell\Microsoft.PowerShell_profile.ps1'),
    (Join-Path $env:USERPROFILE 'Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1')
)
foreach ($p in $PsProfileCandidates) {
    if (Test-Path $p) {
        $SourcePaths += @{ Source = $p; Target = '_user\PowerShell_profile.ps1'; Required = $false }
        break
    }
}

# Optional: Falcon Wiki (only if -IncludeWiki)
if ($IncludeWiki) {
    $SourcePaths += @{ Source = (Join-Path $FalconRoot 'falcon-wiki'); Target = 'falcon\falcon-wiki'; Required = $false }
}

# *** Exclusion patterns *********************************************
$ExcludePatterns = @(
    'node_modules',
    'dist',
    '.git',
    'logs',
    'backups',
    'graphify-out',
    'tmp',
    'obj',
    'bin'
)

if (-not $IncludeKeys) {
    $ExcludePatterns += @('keys.env', '*.pat', '*.token', 'admin.pat')
}

# *** Helper functions ***********************************************
function Test-IsExcluded {
    param([string]$Path)
    foreach ($pattern in $ExcludePatterns) {
        if ($Path -like "*\$pattern" -or $Path -like "*\$pattern\*" -or (Split-Path $Path -Leaf) -like $pattern) {
            return $true
        }
    }
    return $false
}

function Get-FolderSizeMB {
    param([string]$Path)
    if (-not (Test-Path $Path)) { return 0 }
    if ((Get-Item $Path).PSIsContainer) {
        $bytes = (Get-ChildItem $Path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    } else {
        $bytes = (Get-Item $Path).Length
    }
    if (-not $bytes) { return 0 }
    return [math]::Round($bytes / 1MB, 2)
}

function Write-Manifest {
    param(
        [string]$ManifestPath,
        [array]$Entries
    )
    $manifest = [ordered]@{
        timestamp     = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK')
        sourceMachine = $env:COMPUTERNAME
        sourceUser    = $env:USERNAME
        falconRoot    = $FalconRoot
        claudeRoot    = $ClaudeUserRoot
        includeKeys   = $IncludeKeys.IsPresent
        includeWiki   = $IncludeWiki.IsPresent
        entries       = $Entries
    }
    $manifest | ConvertTo-Json -Depth 5 | Set-Content -Path $ManifestPath -Encoding UTF8
}

# ====================================================================
# MODE: List
# ====================================================================
if ($Mode -eq 'List') {
    Write-Host '== Source paths that WOULD be backed up ==' -ForegroundColor Yellow
    Write-Host ''
    $totalMB = 0
    foreach ($p in $SourcePaths) {
        $exists = Test-Path $p.Source
        $size   = if ($exists) { Get-FolderSizeMB $p.Source } else { 0 }
        $totalMB += $size
        $marker = if ($exists) { '✓' } else { if ($p.Required) { '✗ MISSING' } else { '–' } }
        Write-Host ("  [{0}] {1,-50}  {2,8} MB  →  {3}" -f $marker, $p.Source, $size, $p.Target)
    }
    Write-Host ''
    Write-Host ("Total: {0} MB" -f $totalMB) -ForegroundColor Cyan
    Write-Host ''
    Write-Host '== Exclusion patterns ==' -ForegroundColor Yellow
    $ExcludePatterns | ForEach-Object { Write-Host "  - $_" }
    Write-Host ''
    Write-Host 'No files were written. Use -Mode Backup to create the zip.' -ForegroundColor Cyan
    return
}

# ====================================================================
# MODE: Backup
# ====================================================================
if ($Mode -eq 'Backup') {
    if (Test-Path $BackupPath -and -not $Force) {
        Write-Host "Backup file already exists: $BackupPath" -ForegroundColor Red
        Write-Host 'Pass -Force to overwrite.' -ForegroundColor Red
        exit 1
    }

    # Verify required sources exist
    foreach ($p in $SourcePaths | Where-Object { $_.Required }) {
        if (-not (Test-Path $p.Source)) {
            Write-Host "Missing required source: $($p.Source)" -ForegroundColor Red
            exit 1
        }
    }

    # Stage to a temp directory
    $stagingRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("falcon-brain-stage-" + [guid]::NewGuid().ToString())
    Write-Host "Staging directory: $stagingRoot" -ForegroundColor DarkGray
    New-Item -ItemType Directory -Path $stagingRoot -Force | Out-Null

    $manifest = @()
    foreach ($p in $SourcePaths) {
        if (-not (Test-Path $p.Source)) {
            Write-Host "  skipping (not present): $($p.Source)" -ForegroundColor DarkYellow
            continue
        }
        $dest = Join-Path $stagingRoot $p.Target
        $destParent = Split-Path $dest -Parent
        if (-not (Test-Path $destParent)) {
            New-Item -ItemType Directory -Path $destParent -Force | Out-Null
        }

        $sizeMB = Get-FolderSizeMB $p.Source
        Write-Host ("  [+] {0,-50}  {1,8} MB" -f $p.Source, $sizeMB) -ForegroundColor Green

        if ((Get-Item $p.Source).PSIsContainer) {
            # Robocopy with exclusions
            $excludeArgs = @()
            foreach ($pat in $ExcludePatterns) {
                $excludeArgs += '/XD'; $excludeArgs += $pat
                $excludeArgs += '/XF'; $excludeArgs += $pat
            }
            $rcArgs = @($p.Source, $dest, '/E', '/NJH', '/NJS', '/NP', '/NDL', '/NFL', '/R:1', '/W:1') + $excludeArgs
            & robocopy @rcArgs | Out-Null
        } else {
            Copy-Item -Path $p.Source -Destination $dest -Force
        }

        $manifest += [ordered]@{
            source = $p.Source
            target = $p.Target
            sizeMB = $sizeMB
        }
    }

    # Write manifest
    $manifestPath = Join-Path $stagingRoot 'MANIFEST.json'
    Write-Manifest -ManifestPath $manifestPath -Entries $manifest

    # Add a README at the root of the zip
    $readme = @"
Falcon Brain — Portable Backup
==============================

Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Source machine: $env:COMPUTERNAME
Source user: $env:USERNAME

To restore on a new machine:
  1. Copy this .zip to the target machine
  2. Run:  .\falcon-brain-portable.ps1 -Mode Restore -BackupPath '<path-to-zip>'

API keys included: $($IncludeKeys.IsPresent)
Wiki included:     $($IncludeWiki.IsPresent)

Folder layout inside the zip:
  falcon\          → goes to C:\falcon\
  _user\.claude\   → goes to %USERPROFILE%\.claude\
  _user\PowerShell_profile.ps1 → optional, manual placement
"@
    $readme | Set-Content -Path (Join-Path $stagingRoot 'README.txt') -Encoding UTF8

    # Compress
    Write-Host ''
    Write-Host 'Compressing zip...' -ForegroundColor Yellow
    if (Test-Path $BackupPath) { Remove-Item $BackupPath -Force }
    Compress-Archive -Path (Join-Path $stagingRoot '*') -DestinationPath $BackupPath -CompressionLevel Optimal

    # Cleanup staging
    Remove-Item $stagingRoot -Recurse -Force

    $finalSizeMB = [math]::Round((Get-Item $BackupPath).Length / 1MB, 2)
    Write-Host ''
    Write-Host '== Backup complete ==' -ForegroundColor Green
    Write-Host ("File: {0}" -f $BackupPath) -ForegroundColor Cyan
    Write-Host ("Size: {0} MB" -f $finalSizeMB) -ForegroundColor Cyan
    if (-not $IncludeKeys) {
        Write-Host ''
        Write-Host 'NOTE: API keys (Brain\config\keys.env) were NOT included.' -ForegroundColor Yellow
        Write-Host '      Transfer them separately via a secure channel.' -ForegroundColor Yellow
    }
    return
}

# ====================================================================
# MODE: Restore
# ====================================================================
if ($Mode -eq 'Restore') {
    if (-not (Test-Path $BackupPath)) {
        Write-Host "Backup file not found: $BackupPath" -ForegroundColor Red
        exit 1
    }

    # Confirm before overwriting
    if (-not $Force) {
        Write-Host 'WARNING: this will overwrite existing files at:' -ForegroundColor Yellow
        Write-Host "  - $FalconRoot\" -ForegroundColor Yellow
        Write-Host "  - $ClaudeUserRoot\" -ForegroundColor Yellow
        Write-Host ''
        $confirm = Read-Host 'Continue? (yes/no)'
        if ($confirm -ne 'yes') {
            Write-Host 'Aborted.' -ForegroundColor Red
            exit 0
        }
    }

    # Extract to staging
    $stagingRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("falcon-brain-restore-" + [guid]::NewGuid().ToString())
    Write-Host "Extracting to: $stagingRoot" -ForegroundColor DarkGray
    New-Item -ItemType Directory -Path $stagingRoot -Force | Out-Null
    Expand-Archive -Path $BackupPath -DestinationPath $stagingRoot -Force

    # Read manifest
    $manifestPath = Join-Path $stagingRoot 'MANIFEST.json'
    if (-not (Test-Path $manifestPath)) {
        Write-Host 'Backup is missing MANIFEST.json — aborting.' -ForegroundColor Red
        Remove-Item $stagingRoot -Recurse -Force
        exit 1
    }
    $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
    Write-Host ("Backup created: {0}" -f $manifest.timestamp) -ForegroundColor Cyan
    Write-Host ("Source machine: {0}" -f $manifest.sourceMachine) -ForegroundColor Cyan
    Write-Host ''

    # Ensure target roots exist
    if (-not (Test-Path $FalconRoot)) { New-Item -ItemType Directory -Path $FalconRoot -Force | Out-Null }
    if (-not (Test-Path $ClaudeUserRoot)) { New-Item -ItemType Directory -Path $ClaudeUserRoot -Force | Out-Null }

    # Restore falcon\ tree
    $falconStage = Join-Path $stagingRoot 'falcon'
    if (Test-Path $falconStage) {
        Write-Host '  -> Restoring falcon tree...' -ForegroundColor Green
        & robocopy $falconStage $FalconRoot /E /NJH /NJS /NP /NDL /NFL /R:1 /W:1 | Out-Null
    }

    # Restore _user\.claude
    $claudeStage = Join-Path $stagingRoot '_user\.claude'
    if (Test-Path $claudeStage) {
        Write-Host '  -> Restoring user .claude...' -ForegroundColor Green
        & robocopy $claudeStage $ClaudeUserRoot /E /NJH /NJS /NP /NDL /NFL /R:1 /W:1 | Out-Null
    }

    # Place PowerShell profile (suggest, do not auto-overwrite)
    $psProfileSrc = Join-Path $stagingRoot '_user\PowerShell_profile.ps1'
    if (Test-Path $psProfileSrc) {
        $psProfileDest = $PsProfileCandidates[0]   # prefer PS7 path
        $psProfileDestDir = Split-Path $psProfileDest -Parent
        if (-not (Test-Path $psProfileDestDir)) {
            New-Item -ItemType Directory -Path $psProfileDestDir -Force | Out-Null
        }
        if (Test-Path $psProfileDest) {
            $backupName = $psProfileDest + ".pre-restore-" + (Get-Date -Format 'yyyyMMddHHmmss')
            Copy-Item $psProfileDest $backupName -Force
            Write-Host "  -> Existing profile backed up to: $backupName" -ForegroundColor DarkYellow
        }
        Copy-Item $psProfileSrc $psProfileDest -Force
        Write-Host "  -> PowerShell profile placed at: $psProfileDest" -ForegroundColor Green
    }

    # Cleanup staging
    Remove-Item $stagingRoot -Recurse -Force

    Write-Host ''
    Write-Host '== Restore complete ==' -ForegroundColor Green
    Write-Host ''
    Write-Host '== Post-restore checklist ==' -ForegroundColor Yellow
    Write-Host '  [ ] Install Claude Code CLI:  npm install -g @anthropic-ai/claude-code'
    Write-Host '  [ ] Install PowerShell 7+ (winget install Microsoft.PowerShell)'
    Write-Host '  [ ] If keys.env was NOT in the backup: copy it manually to' -NoNewline
    Write-Host "  $FalconRoot\Brain\config\keys.env" -ForegroundColor Cyan
    Write-Host '  [ ] Re-generate / copy any Azure DevOps PATs and store at expected paths'
    Write-Host '  [ ] If username differs from source machine: search/replace any hardcoded paths'
    Write-Host '       (look in *.json, *.md, *.ps1 under .claude\ and Brain\)'
    Write-Host '  [ ] Reload PowerShell profile:  . $PROFILE'
    Write-Host '  [ ] Test:  claude   (banner should appear)'
    Write-Host ''
    return
}
