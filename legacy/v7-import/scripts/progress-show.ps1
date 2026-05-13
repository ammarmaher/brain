# *** progress-show - reads progress.json and renders the 0-100 bar ***
# *** Phase I reader. Optional -Watch refreshes in place every 1s. ***
# *** PS 5.1 compatible. ***

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]  [string] $TaskId,
    [Parameter(Mandatory = $false)] [switch] $Watch
)

$ErrorActionPreference = 'Stop'

$BrainRoot   = Split-Path -Parent $PSScriptRoot
$ProgressFs  = Join-Path $BrainRoot ('state\' + $TaskId + '\progress.json')

# *** Render a 10-char bar. 100% -> 10 hashes. Each hash = 10%. ***
function Format-Bar {
    param([int]$Percent)
    if ($Percent -lt 0)   { $Percent = 0 }
    if ($Percent -gt 100) { $Percent = 100 }
    $filled = [int][math]::Floor($Percent / 10)
    $empty  = 10 - $filled
    $bar    = ('#' * $filled) + ('.' * $empty)
    return ('[{0}] {1}%' -f $bar, $Percent)
}

function Get-Line {
    param([string]$tid, [string]$path)
    if (-not (Test-Path -LiteralPath $path)) {
        $bar = Format-Bar -Percent 0
        return ('{0} - no progress yet' -f $bar)
    }
    try {
        $raw  = Get-Content -Raw -LiteralPath $path
        $data = $raw | ConvertFrom-Json
    } catch {
        $bar = Format-Bar -Percent 0
        return ('{0} - progress unreadable' -f $bar)
    }
    $bar = Format-Bar -Percent ([int]$data.percent)
    return ('{0} - {1} (TaskId: {2})' -f $bar, $data.step, $tid)
}

if (-not $Watch) {
    Write-Output (Get-Line -tid $TaskId -path $ProgressFs)
    exit 0
}

# *** Watch mode: redraw on the same line using \r. Ctrl+C to exit. ***
$lastLen = 0
try {
    while ($true) {
        $line = Get-Line -tid $TaskId -path $ProgressFs
        $pad  = ''
        if ($line.Length -lt $lastLen) {
            $pad = ' ' * ($lastLen - $line.Length)
        }
        [System.Console]::Write("`r" + $line + $pad)
        $lastLen = $line.Length
        Start-Sleep -Seconds 1
    }
} finally {
    [System.Console]::Write("`n")
}
