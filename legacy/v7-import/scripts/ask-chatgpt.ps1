# *** ask-chatgpt.ps1 ***
# *** Send a prompt to OpenAI ChatGPT using the API key in config/keys.env ***
# *** Usage: scripts\ask-chatgpt.ps1 -Prompt "..." [-Model gpt-4o-mini] [-Quiet] ***

param(
    [Parameter(Mandatory)] [string]$Prompt,
    [string]$Model = 'gpt-4o-mini',
    [string]$KeysEnv,
    [switch]$Quiet
)
$ErrorActionPreference = 'Stop'

$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$picker = Join-Path $here 'play-alert-context.ps1'

if (-not $KeysEnv) {
    $KeysEnv = Join-Path (Split-Path $here -Parent) 'config\keys.env'
}

# *** Start alert: task received ***
if (-not $Quiet) {
    try { & $picker -Mindset chatgpt -Category taskReceived | Out-Null } catch { }
}

if (-not (Test-Path $KeysEnv)) {
    throw "keys.env not found at $KeysEnv. Copy config\keys.env.example to config\keys.env and fill in your keys."
}

$envMap = @{}
Get-Content $KeysEnv | Where-Object { $_ -match '^[^#=]+=' } | ForEach-Object {
    $k, $v = $_ -split '=', 2
    $envMap[$k.Trim()] = $v.Trim().Trim('"')
}
$key = $envMap['OPENAI_API_KEY']
if (-not $key -or $key -like 'PASTE_*') {
    throw "OPENAI_API_KEY missing or still set to placeholder in $KeysEnv"
}

$bodyJson = @{
    model    = $Model
    messages = @(@{ role = 'user'; content = $Prompt })
} | ConvertTo-Json -Depth 6 -Compress

# *** UTF-8 byte body — Invoke-RestMethod defaults to ISO-8859-1 in PS 5.1 and corrupts non-ASCII (Arabic). ***
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyJson)

$resp = Invoke-RestMethod -Uri 'https://api.openai.com/v1/chat/completions' `
    -Method Post -ContentType 'application/json; charset=utf-8' `
    -Headers @{ Authorization = "Bearer $key" } -Body $bodyBytes
$resp.choices[0].message.content

# *** End alert: planning complete, NO test/review/deploy claims (chatgpt only plans) ***
if (-not $Quiet) {
    try { & $picker -Mindset chatgpt -Category finished -Reviewed:$false -Deployed:$false -Tested:$false | Out-Null } catch { }
}
