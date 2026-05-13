# *** growth-tick.ps1 ***
# *** Append a knowledge-growth entry every time Brain analyzes something. ***
# *** Source of truth: Brain/Brain Generated/analysis/L0-summary/knowledge-journal.md (append-only). ***
# *** PowerShell 5.1 compatible. Exit 0 always (must never break callers). ***

[CmdletBinding()]
param(
    [Parameter(Mandatory)] [string]$RunId,
    [Parameter(Mandatory)] [string]$Source,
    [Parameter(Mandatory)] [string]$Summary,
    [string[]]$Outputs = @(),
    [int]$NewFindings = 0,
    [int]$ResolvedFindings = 0,
    [string]$Level = 'L0'
)

$ErrorActionPreference = 'Continue'

$here       = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$brainRoot  = Split-Path $here -Parent
$journalDir = Join-Path $brainRoot 'Brain Generated\analysis\L0-summary'
$journal    = Join-Path $journalDir 'knowledge-journal.md'
$indexPath  = Join-Path $brainRoot 'Brain Generated\analysis\index.json'

if (-not (Test-Path -LiteralPath $journalDir)) {
    try { New-Item -ItemType Directory -Path $journalDir -Force | Out-Null } catch { exit 0 }
}

# *** Initialize journal header on first write. ***
if (-not (Test-Path -LiteralPath $journal)) {
    $header = @(
        '# Brain Knowledge Journal',
        '',
        '> Append-only growth log. Every analysis run writes one entry. Never edit historical entries.',
        '',
        '| Field | Meaning |',
        '|---|---|',
        '| Run ID | Unique id of the analysis run |',
        '| Source | Script/skill that produced the entry |',
        '| Level | L0 summary / L1 abstraction / L2 business / L3 technical |',
        '| Delta | + new findings  /  - resolved findings |',
        '| Outputs | Files created/updated by this run |',
        '',
        '---',
        ''
    ) -join "`r`n"
    try { Set-Content -LiteralPath $journal -Value $header -Encoding UTF8 } catch { exit 0 }
}

$timestampUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$delta        = "+{0} / -{1}" -f $NewFindings, $ResolvedFindings
$outputsList  = if ($Outputs.Count -gt 0) { ($Outputs | ForEach-Object { '  - ' + $_ }) -join "`r`n" } else { '  - (none)' }

$entry = @"

## $timestampUtc — $RunId

- **Source:** $Source
- **Level:** $Level
- **Delta:** $delta
- **Summary:** $Summary
- **Outputs:**
$outputsList
"@

try {
    Add-Content -LiteralPath $journal -Value $entry -Encoding UTF8
    Write-Host "[growth-tick] Journal updated: $journal"
} catch {
    Write-Warning ("[growth-tick] Could not append to journal: {0}" -f $_.Exception.Message)
    exit 0
}

# *** Mirror the entry into index.json so machine-readable trail stays in sync. ***
try {
    if (Test-Path -LiteralPath $indexPath) {
        $raw = Get-Content -LiteralPath $indexPath -Raw
        $idx = $raw | ConvertFrom-Json
    } else {
        $idx = @()
    }

    # *** index.json shape varies (some entries are wrapped { runs: [...] }, some flat). Always append flat. ***
    $newRecord = [ordered]@{
        id        = $RunId
        type      = 'growth-tick'
        level     = $Level
        outputs   = $Outputs
        summary   = $Summary
        delta     = @{ new = $NewFindings; resolved = $ResolvedFindings }
        timestamp = $timestampUtc
    }

    if ($idx -is [System.Array]) {
        $idx = @($idx) + $newRecord
    } else {
        $idx = @($idx, $newRecord)
    }

    $idx | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $indexPath -Encoding UTF8
    Write-Host "[growth-tick] index.json updated"
} catch {
    Write-Warning ("[growth-tick] Could not update index.json: {0}" -f $_.Exception.Message)
}

exit 0
