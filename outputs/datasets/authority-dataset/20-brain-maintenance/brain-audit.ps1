# *** brain-audit.ps1 ***
# Weekly health check for the Falcon authority dataset + memory + vault projections.
# Surfaces stale verified-at, missing purpose: fields, broken wikilinks, orphan memory
# entries, missing cluster _INDEX, scanner state.
#
# Exit codes:
#   0 - healthy (zero findings)
#   1 - warnings (non-critical issues)
#   2 - critical (broken wikilinks, missing _INDEX, orphan memory)
#
# Usage:
#   .\brain-audit.ps1                    # run + write report
#   .\brain-audit.ps1 -ReportOnly        # write report, suppress console
#   .\brain-audit.ps1 -StaleDays 60      # custom staleness threshold (default 90)
#
# ASCII only (no Unicode glyphs - PS 5.1 Windows-1252 trap).

[CmdletBinding()]
param(
  [int]$StaleDays = 90,
  [switch]$ReportOnly
)

$ErrorActionPreference = "Stop"

$root = "C:\Falcon"
$dataset = "$root\Brain Outputs\datasets\authority-dataset"
$memoryDir = "$env:USERPROFILE\.claude\projects\C--Falcon\memory"
$vaultFalcon = "$root\falcon-wiki\100-Authority"
$vaultBrainSk = "$root\Brain SK\_obsidian\40-Authority"
$reportDir = "$dataset\_runtime-verification"
$today = Get-Date -Format "yyyy-MM-dd"
$reportPath = "$reportDir\brain-audit-$today.md"

if (-not (Test-Path $reportDir)) {
  New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$findings = [System.Collections.ArrayList]::new()
$warnings = 0
$critical = 0

function Add-Finding {
  param(
    [string]$Severity,
    [string]$Category,
    [string]$Message,
    [string]$Path = ""
  )
  $entry = [PSCustomObject]@{
    Severity = $Severity
    Category = $Category
    Message  = $Message
    Path     = $Path
  }
  [void]$findings.Add($entry)
  if ($Severity -eq "WARN") { $script:warnings++ }
  if ($Severity -eq "CRIT") { $script:critical++ }
}

if (-not $ReportOnly) {
  Write-Output ""
  Write-Output "============================================================"
  Write-Output "Falcon Brain Audit - $today"
  Write-Output "============================================================"
  Write-Output ""
}

# Check 1 - Stale verified-at frontmatter
if (-not $ReportOnly) { Write-Output "[1/6] Scanning verified-at frontmatter for staleness (>$StaleDays days)..." }
$threshold = (Get-Date).AddDays(-$StaleDays)
$allMd = Get-ChildItem -Path $dataset, $vaultFalcon, $vaultBrainSk -Recurse -Filter *.md -ErrorAction SilentlyContinue
foreach ($file in $allMd) {
  $content = Get-Content -Path $file.FullName -TotalCount 20 -ErrorAction SilentlyContinue
  $vline = $content | Where-Object { $_ -match '^verified-at:\s*(\d{4}-\d{2}-\d{2})' } | Select-Object -First 1
  if ($vline -and $vline -match '(\d{4}-\d{2}-\d{2})') {
    try {
      $verifiedDate = [DateTime]::ParseExact($matches[1], 'yyyy-MM-dd', $null)
      if ($verifiedDate -lt $threshold) {
        $days = [int]((Get-Date) - $verifiedDate).TotalDays
        Add-Finding -Severity "WARN" -Category "stale-verified-at" -Message "verified-at is $days days old (threshold $StaleDays)" -Path $file.FullName
      }
    } catch { }
  }
}

# Check 2 - Missing purpose: frontmatter (only in dataset roots, not subfiles)
if (-not $ReportOnly) { Write-Output "[2/6] Scanning for missing purpose: frontmatter..." }
$rootIndexes = Get-ChildItem -Path $dataset -Recurse -Filter "_INDEX.md" -ErrorAction SilentlyContinue
$rootIndexes += Get-ChildItem -Path $dataset -Filter "0-MASTER-INDEX.md" -ErrorAction SilentlyContinue
foreach ($file in $rootIndexes) {
  $content = Get-Content -Path $file.FullName -TotalCount 20 -ErrorAction SilentlyContinue
  $hasPurpose = $content | Where-Object { $_ -match '^purpose:' }
  if (-not $hasPurpose) {
    Add-Finding -Severity "WARN" -Category "missing-purpose" -Message "no purpose: field in frontmatter" -Path $file.FullName
  }
}

# Check 3 - Broken wikilinks (only in vault projections)
if (-not $ReportOnly) { Write-Output "[3/6] Scanning vault projections for broken [[wikilinks]]..." }
$vaultMd = Get-ChildItem -Path $vaultFalcon, $vaultBrainSk -Recurse -Filter *.md -ErrorAction SilentlyContinue
$allVaultBasenames = @{}
$allFalconWikiNotes = Get-ChildItem -Path "$root\falcon-wiki" -Recurse -Filter *.md -ErrorAction SilentlyContinue
$allBrainSkNotes = Get-ChildItem -Path "$root\Brain SK\_obsidian" -Recurse -Filter *.md -ErrorAction SilentlyContinue
foreach ($n in $allFalconWikiNotes) { $allVaultBasenames["falcon-wiki:" + $n.BaseName] = $true }
foreach ($n in $allBrainSkNotes) { $allVaultBasenames["brain-sk:" + $n.BaseName] = $true }
foreach ($file in $vaultMd) {
  $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
  if (-not $content) { continue }
  # Strip fenced code blocks AND inline code spans so we don't flag literal wikilink examples
  $clean = $content -replace '(?ms)```.*?```', ''
  $clean = $clean -replace '`[^`]*`', ''
  $isFalconWiki = $file.FullName -like "*\falcon-wiki\*"
  $vaultKey = if ($isFalconWiki) { "falcon-wiki:" } else { "brain-sk:" }
  $links = [regex]::Matches($clean, '\[\[([^\]\|#]+)(?:\|[^\]]+)?\]\]')
  foreach ($m in $links) {
    $linkTarget = $m.Groups[1].Value.Trim()
    if ($linkTarget -match '^https?://') { continue }
    if (-not $allVaultBasenames.ContainsKey($vaultKey + $linkTarget)) {
      Add-Finding -Severity "CRIT" -Category "broken-wikilink" -Message "[[$linkTarget]] target not found in vault" -Path $file.FullName
    }
  }
}

# Check 4 - Orphan memory entries (memory mentions cluster that doesn't exist)
if (-not $ReportOnly) { Write-Output "[4/6] Scanning memory entries for orphans..." }
if (Test-Path $memoryDir) {
  $memoryFiles = Get-ChildItem -Path $memoryDir -Filter "project_*.md" -ErrorAction SilentlyContinue
  foreach ($mf in $memoryFiles) {
    $mc = Get-Content -Path $mf.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $mc) { continue }
    $pathRefs = [regex]::Matches($mc, 'Brain Outputs[\\/]datasets[\\/]authority-dataset[\\/]([^\\/`"\s\)\]]+)')
    foreach ($pm in $pathRefs) {
      $cluster = $pm.Groups[1].Value
      $clusterPath = Join-Path $dataset $cluster
      if (-not (Test-Path $clusterPath)) {
        Add-Finding -Severity "CRIT" -Category "orphan-memory" -Message "memory references missing cluster: $cluster" -Path $mf.FullName
      }
    }
  }
}

# Check 5 - Missing cluster _INDEX.md
if (-not $ReportOnly) { Write-Output "[5/6] Scanning clusters for missing _INDEX.md..." }
$clusters = Get-ChildItem -Path $dataset -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^\d{2}-' }
foreach ($c in $clusters) {
  $hasIndex = Get-ChildItem -Path $c.FullName -Filter "_INDEX.md" -ErrorAction SilentlyContinue
  if (-not $hasIndex) {
    $hasReadme = Get-ChildItem -Path $c.FullName -Filter "README.md" -ErrorAction SilentlyContinue
    if (-not $hasReadme) {
      Add-Finding -Severity "WARN" -Category "missing-index" -Message "cluster has neither _INDEX.md nor README.md" -Path $c.FullName
    }
  }
}

# Check 6 - Scanner installation
if (-not $ReportOnly) { Write-Output "[6/6] Checking scanner installation..." }
$scannerConfig = "$root\falcon-wiki\scripts\scan-authority.config.json"
$scannerScript = "$root\falcon-wiki\scripts\scan-authority.ps1"
if (Test-Path $scannerConfig) {
  # Scanner is installed. Optionally warn if scanner script is missing
  if (-not (Test-Path $scannerScript)) {
    Add-Finding -Severity "WARN" -Category "scanner-script-missing" -Message "scanner config exists but scan-authority.ps1 not found" -Path $scannerConfig
  }
} else {
  Add-Finding -Severity "WARN" -Category "scanner-not-installed" -Message "scan-authority.config.json not found - scanner not installed" -Path $scannerConfig
}

# Build report
$total = $findings.Count
$healthBadge = if ($critical -gt 0) { "RED" } elseif ($warnings -gt 0) { "YELLOW" } else { "GREEN" }

$report = @"
---
type: audit-report
generated: $today
status: $healthBadge
total-findings: $total
critical: $critical
warnings: $warnings
---

# Brain Audit Report - $today

## Summary

- **Health**: $healthBadge
- **Total findings**: $total
- **Critical**: $critical
- **Warnings**: $warnings
- **Stale-days threshold**: $StaleDays

## Findings

"@

if ($total -eq 0) {
  $report += "`nNo issues found. Brain is healthy.`n"
} else {
  $byCategory = $findings | Group-Object -Property Category
  foreach ($grp in $byCategory) {
    $report += "`n### $($grp.Name) ($($grp.Count))`n`n"
    foreach ($f in $grp.Group) {
      $relPath = $f.Path -replace [regex]::Escape($root + "\"), ""
      $report += "- **$($f.Severity)** - $($f.Message) | ``$relPath```n"
    }
  }
}

$report += @"

## Remediation guidance

| Category | Fix |
|---|---|
| ``stale-verified-at`` | Re-verify the cluster + bump ``verified-at:`` frontmatter. If still accurate, just bump date. |
| ``missing-purpose`` | Add ``purpose: "Answers '...'. Open when..."`` to frontmatter. |
| ``broken-wikilink`` | Either fix the link target or remove the link. |
| ``orphan-memory`` | Reconcile - either restore the cluster or update memory to point at new location. |
| ``missing-index`` | Create _INDEX.md (preferred) or README.md for the cluster. |
| ``scanner-dirty`` | Run ``.\falcon-wiki\scripts\scan-authority.ps1 -MarkChecked`` after addressing drift. |
| ``scanner-missing`` | Run ``.\falcon-wiki\scripts\scan-authority.ps1`` for the first time. |

## Next steps

1. Address all **CRIT** findings before next push (they break the brain)
2. Triage **WARN** findings - fix or document as known-deferred
3. Re-run this audit weekly: ``.\Brain Outputs\datasets\authority-dataset\20-brain-maintenance\brain-audit.ps1``
"@

Set-Content -Path $reportPath -Value $report -Encoding UTF8

if (-not $ReportOnly) {
  Write-Output ""
  Write-Output "============================================================"
  Write-Output "Audit complete - $healthBadge"
  Write-Output "  Total findings: $total"
  Write-Output "  Critical: $critical"
  Write-Output "  Warnings: $warnings"
  Write-Output "============================================================"
  Write-Output ""
  Write-Output "Report: $reportPath"
  Write-Output ""
}

if ($critical -gt 0) { exit 2 }
if ($warnings -gt 0) { exit 1 }
exit 0
