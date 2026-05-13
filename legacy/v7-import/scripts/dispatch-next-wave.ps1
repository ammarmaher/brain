# *** dispatch-next-wave.ps1 ***
# *** Dispatches the NEXT-WAVE-BRIEF.md to one mindset and saves the response ***
# *** Usage: dispatch-next-wave.ps1 -Mindset chatgpt|gemini ***

param(
    [Parameter(Mandatory)] [ValidateSet('chatgpt', 'gemini')] [string]$Mindset
)
$ErrorActionPreference = 'Stop'

$briefPath = 'C:\Falcon\Brain\Brain Generated\NEXT-WAVE-BRIEF.md'
$brief = Get-Content -Raw $briefPath

$prompt = if ($Mindset -eq 'chatgpt') {
    @"
You are ChatGPT (strategic commander) responding to the Falcon Revamp Next-Wave Brief below. Read it in full, then return ONLY the Markdown plan as specified in Section 5 (the five sections A through E plus the format requirements). Do not include any preamble, no greeting, no 'here is my plan' — just the Markdown content starting with '#'.

--- BEGIN BRIEF ---
$brief
--- END BRIEF ---
"@
} else {
    @"
You are Gemini (verification officer + visual/architecture analyst) responding to the Falcon Revamp Next-Wave Brief below. Read it in full, then return ONLY the Markdown plan as specified in Section 5 (the five sections A through E plus the format requirements). Do not include any preamble, no greeting — just the Markdown content starting with '#'. Be honest about uncertainty per Section 9 of the brief.

--- BEGIN BRIEF ---
$brief
--- END BRIEF ---
"@
}

$outPath = "C:\Falcon\Brain\Brain Generated\NEXT-WAVE-PLAN-$($Mindset.ToUpper()).md"
$script = if ($Mindset -eq 'chatgpt') { 'C:\Falcon\Brain\scripts\ask-chatgpt.ps1' } else { 'C:\Falcon\Brain\scripts\ask-gemini.ps1' }
$model  = if ($Mindset -eq 'chatgpt') { 'gpt-4o' } else { 'gemini-2.5-flash' }

Write-Host "[$Mindset] Calling $script with model $model..."
$response = & $script -Prompt $prompt -Model $model -Quiet
$response | Out-File -FilePath $outPath -Encoding utf8

$bytes = (Get-Item $outPath).Length
Write-Host "[$Mindset] Done. Wrote $bytes bytes to $outPath"
