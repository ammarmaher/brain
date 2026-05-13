# *** gemini-polish.ps1 ***
# *** Verification + polish layer. Reads a draft markdown report, asks Gemini to ***
# *** rewrite it to a strict professional contract, writes the polished version back. ***
# *** Gemini IS the verification mindset (per Brain/Skill.md), so output is review-grade. ***
# *** PowerShell 5.1 compatible. Exit 0 on success, exit 1 on hard failure (callable from cron). ***

[CmdletBinding()]
param(
    [Parameter(Mandatory)] [string]$InputPath,
    [string]$OutputPath,
    [string]$Kind = 'gap-report',
    [switch]$Quiet
)

$ErrorActionPreference = 'Stop'

$here       = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$askGemini  = Join-Path $here 'ask-gemini.ps1'

if (-not (Test-Path -LiteralPath $InputPath)) {
    Write-Warning ("[gemini-polish] Input not found: {0}" -f $InputPath)
    exit 1
}
if (-not (Test-Path -LiteralPath $askGemini)) {
    Write-Warning '[gemini-polish] ask-gemini.ps1 missing'
    exit 1
}

if (-not $OutputPath) { $OutputPath = $InputPath }

$draft = Get-Content -LiteralPath $InputPath -Raw -ErrorAction SilentlyContinue
if ([string]::IsNullOrWhiteSpace($draft)) {
    Write-Warning ("[gemini-polish] Empty draft: {0}" -f $InputPath)
    exit 1
}

# *** Professional rewrite contract — strict, no embellishment, no invented facts. ***
$contract = @"
You are the Falcon verification mindset (Gemini). Rewrite the draft below into a perfect, professional gap report.

Hard rules:
1. Preserve every factual claim. Do not invent gaps, severities, or modules.
2. Do not remove findings. You may merge near-duplicates and note the merge.
3. Use precise business English. No filler. No emojis.
4. Sort findings by severity: CRITICAL > HIGH > MEDIUM > LOW.
5. Each finding MUST be ONE markdown bullet on a single line in this exact shape (no bold, no brackets, no sub-bullets):
   ``- [SEVERITY] Short Title — One-line description (Resolution: PRD|Wiki|Code|Human-decision)``
   Severity is one of CRITICAL, HIGH, MEDIUM, LOW. Use a literal hyphen-bullet ``-`` (not ``*``). No nested bullets. No bold markers anywhere.
6. Keep the existing markdown headings (# Gap Report, ## Summary, ## Gaps Found, ## Resolved Since Last Scan, ## Open Questions). Do NOT add new top-level sections. Do NOT insert ``### CRITICAL`` or other severity sub-headings.
7. End with a one-line verdict: ``Verdict: COMPLETED-CLEAN`` or ``Verdict: COMPLETED-WITH-GAPS (N critical / N high)``.
8. Output ONLY the polished markdown. No preamble, no closing remarks.

DRAFT:
$draft
"@

try {
    if ($Quiet) {
        $polished = & $askGemini -Prompt $contract -Quiet 2>$null
    } else {
        $polished = & $askGemini -Prompt $contract 2>$null
    }
} catch {
    Write-Warning ("[gemini-polish] Gemini call failed: {0}" -f $_.Exception.Message)
    exit 1
}

if ([string]::IsNullOrWhiteSpace($polished)) {
    Write-Warning '[gemini-polish] Gemini returned empty content; leaving draft untouched'
    exit 1
}

# *** Strip optional markdown fences Gemini sometimes wraps around responses. ***
$polished = $polished -replace '^\s*```(?:markdown|md)?\s*\r?\n', ''
$polished = $polished -replace '\r?\n```\s*$', ''

try {
    Set-Content -LiteralPath $OutputPath -Value $polished -Encoding UTF8
    Write-Host ("[gemini-polish] Polished: {0}" -f $OutputPath)
    exit 0
} catch {
    Write-Warning ("[gemini-polish] Could not write output: {0}" -f $_.Exception.Message)
    exit 1
}
