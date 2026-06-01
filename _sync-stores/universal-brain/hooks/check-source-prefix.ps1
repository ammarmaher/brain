# check-source-prefix.ps1 — scan markdown for Falcon-domain keywords missing source-prefix
# Created 2026-05-27 Wave 13
#
# Usage:
#   .\check-source-prefix.ps1                       # scan default outputs
#   .\check-source-prefix.ps1 -Path <file-or-dir>   # scan specific path
#   .\check-source-prefix.ps1 -RecentClaude         # scan last response saved to clipboard or stdin
#
# Detects: lines that mention Falcon-domain terms (PES, acc-owner, V-rule IDs, BR-* IDs, Falcon services)
# WITHOUT a nearby source-prefix marker ([CODE], [BRAIN-OUT], [VAULT], [BRAIN-SK], [MEMORY], [INFERRED]).
#
# Output: list of suspicious lines with file + line number. Exit 0 if clean, 1 if violations found.

param(
    [string]$Path = '',
    [switch]$RecentClaude = $false,
    [switch]$Quiet = $false
)

$ErrorActionPreference = 'Stop'

# Falcon-domain keywords that should always carry a source-prefix when used as factual claims
$DomainKeywords = @(
    'PES\b', 'acc-owner', 'acc-admin', 'acc-user', 'sys-admin', 'sys-ops', 'sys-products',
    '\bV-[a-z][\w-]+\b', '\bE-[a-z][\w-]+\b', '\bBR-(AM|UM|CC|CGM)-\d+',
    'FalconKeys\.', 'falcon-access\.', 'falcon-core-', 'host-shell', 'admin-console', 'management-console',
    'Zitadel\b', 'Identity service', 'Commerce service', 'Provisioning service', 'Charging service',
    'PRD-0\d', 'Q-UM-\d+', 'Q-AM-\d+', 'Q-CC-\d+', 'Q-CGM-\d+'
)

# Source-prefix markers
$PrefixPattern = '\[(CODE|BRAIN-OUT|VAULT|BRAIN-SK|MEMORY|INFERRED)\]'

function Check-Content {
    param([string]$text, [string]$source = 'stdin')
    $violations = @()
    $lines = $text -split "`r?`n"
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        # Skip code blocks, headings, list markers — those rarely make claims
        if ($line -match '^(\s*```|\s*#|\s*\* |\s*- \[ \])') { continue }
        # Skip lines that already have a prefix
        if ($line -match $PrefixPattern) { continue }
        # Skip lines under 30 chars — too short to be a fact-claim
        if ($line.Length -lt 30) { continue }
        foreach ($kw in $DomainKeywords) {
            if ($line -match $kw) {
                $violations += [pscustomobject]@{
                    Source = $source
                    Line   = $i + 1
                    Match  = $matches[0]
                    Text   = if ($line.Length -gt 120) { $line.Substring(0, 117) + '...' } else { $line }
                }
                break  # one violation per line is enough
            }
        }
    }
    return $violations
}

$allViolations = @()

if ($RecentClaude) {
    # Read from clipboard (assumes user pasted Claude's recent output)
    Add-Type -AssemblyName System.Windows.Forms
    $text = [System.Windows.Forms.Clipboard]::GetText()
    if ([string]::IsNullOrWhiteSpace($text)) {
        Write-Output 'Clipboard is empty. Copy a Claude response first.'
        exit 0
    }
    $allViolations = Check-Content -text $text -source 'clipboard'
}
elseif ($Path) {
    if (Test-Path $Path -PathType Container) {
        Get-ChildItem $Path -Recurse -Filter '*.md' | ForEach-Object {
            $content = Get-Content $_.FullName -Raw -Encoding UTF8
            $v = Check-Content -text $content -source $_.FullName
            $allViolations += $v
        }
    }
    elseif (Test-Path $Path -PathType Leaf) {
        $content = Get-Content $Path -Raw -Encoding UTF8
        $allViolations = Check-Content -text $content -source $Path
    }
    else {
        Write-Output "Path not found: $Path"
        exit 2
    }
}
else {
    # Default: scan universal-brain state files
    Get-ChildItem 'C:\Falcon\universal-brain\state' -Filter '*.md' -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
        # Skip the schema/taxonomy files themselves (they describe the protocol)
        if ($_.Name -match 'SCHEMA|TAXONOMY|PLAN|REPORT|LOG') { return }
        $content = Get-Content $_.FullName -Raw -Encoding UTF8
        $v = Check-Content -text $content -source $_.FullName
        $allViolations += $v
    }
}

if ($allViolations.Count -eq 0) {
    if (-not $Quiet) { Write-Output 'No source-prefix violations detected.' }
    exit 0
}

if (-not $Quiet) {
    Write-Output "=== SOURCE-PREFIX VIOLATIONS: $($allViolations.Count) ==="
    $allViolations | ForEach-Object {
        Write-Output "$($_.Source):$($_.Line)  [match: $($_.Match)]"
        Write-Output "  $($_.Text)"
    }
    Write-Output ''
    Write-Output 'Add [CODE]/[BRAIN-OUT]/[VAULT]/[BRAIN-SK]/[MEMORY]/[INFERRED] prefixes to fix.'
}

exit 1
