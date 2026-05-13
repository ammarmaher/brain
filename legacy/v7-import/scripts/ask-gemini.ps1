# *** ask-gemini.ps1 ***
# *** Send a prompt to Gemini using the API key in config/keys.env ***
# *** Usage: scripts\ask-gemini.ps1 -Prompt "..." [-Model gemini-2.5-flash] [-Quiet] ***

param(
    [Parameter(Mandatory)] [string]$Prompt,
    [string]$Model = 'gemini-2.5-flash',
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
    try { & $picker -Mindset gemini -Category taskReceived | Out-Null } catch { }
}

if (-not (Test-Path $KeysEnv)) {
    throw "keys.env not found at $KeysEnv. Copy config\keys.env.example to config\keys.env and fill in your keys."
}

$envMap = @{}
Get-Content $KeysEnv | Where-Object { $_ -match '^[^#=]+=' } | ForEach-Object {
    $k, $v = $_ -split '=', 2
    $envMap[$k.Trim()] = $v.Trim().Trim('"')
}
$key = $envMap['GEMINI_API_KEY']
if (-not $key -or $key -like 'PASTE_*') {
    throw "GEMINI_API_KEY missing or still set to placeholder in $KeysEnv"
}

$bodyJson = @{
    contents = @(@{ parts = @(@{ text = $Prompt }) })
} | ConvertTo-Json -Depth 6 -Compress

# *** UTF-8 byte body — Invoke-RestMethod defaults to ISO-8859-1 in PS 5.1 and corrupts non-ASCII (Arabic). ***
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyJson)

$uri = "https://generativelanguage.googleapis.com/v1beta/models/${Model}:generateContent?key=$key"

# *** Retry with exponential backoff on 429 (quota) and 503 (transient). ***
$maxAttempts = 5
$attempt     = 0
$resp        = $null
while ($attempt -lt $maxAttempts) {
    $attempt++
    try {
        $resp = Invoke-RestMethod -Uri $uri -Method Post -ContentType 'application/json; charset=utf-8' -Body $bodyBytes
        break
    } catch {
        $status = $null
        if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
        if (($status -eq 429 -or $status -eq 503) -and $attempt -lt $maxAttempts) {
            $sleep = [Math]::Pow(2, $attempt) * 5
            Write-Warning ("[ask-gemini] HTTP {0} (attempt {1}/{2}); sleeping {3}s before retry" -f $status, $attempt, $maxAttempts, $sleep)
            Start-Sleep -Seconds $sleep
            continue
        }
        throw
    }
}
if ($null -eq $resp) { throw '[ask-gemini] No response after retries' }
$resp.candidates[0].content.parts[0].text

# *** End alert: Gemini IS the verification layer -> -Reviewed:$true is honest ***
if (-not $Quiet) {
    try { & $picker -Mindset gemini -Category finished -Reviewed:$true | Out-Null } catch { }
}
