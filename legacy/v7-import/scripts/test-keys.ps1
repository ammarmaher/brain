# *** test-keys.ps1 ***
# *** Verify both API keys can authenticate. Run after editing keys.env. ***
# *** Usage: scripts\test-keys.ps1 [-Quiet] ***

param(
    [switch]$Quiet
)

$ErrorActionPreference = 'Continue'
$root = Split-Path $PSScriptRoot -Parent
$keys = Join-Path $root 'config\keys.env'
$picker = Join-Path $PSScriptRoot 'play-alert-context.ps1'

if (-not (Test-Path $keys)) {
    Write-Host "[FAIL] keys.env not found at $keys" -ForegroundColor Red
    Write-Host "       Copy config\keys.env.example to config\keys.env and fill in your keys." -ForegroundColor Yellow
    if (-not $Quiet) {
        try { & $picker -Mindset claude -Category blocked | Out-Null } catch { }
    }
    exit 1
}

$geminiOk = $false
$chatgptOk = $false

Write-Host "[1/2] Testing Gemini..."
try {
    # *** -Quiet on inner call so only our test-keys verdict alert plays ***
    $g = & "$PSScriptRoot\ask-gemini.ps1" -Prompt 'Reply with the single word: OK' -Quiet
    if ($g -match 'OK') {
        Write-Host "[OK] Gemini authenticated" -ForegroundColor Green
        $geminiOk = $true
    }
    else { Write-Host "[?] Gemini responded but unexpected: $g" -ForegroundColor Yellow }
}
catch {
    Write-Host "[FAIL] Gemini: $_" -ForegroundColor Red
}

Write-Host "[2/2] Testing ChatGPT..."
try {
    $c = & "$PSScriptRoot\ask-chatgpt.ps1" -Prompt 'Reply with the single word: OK' -Quiet
    if ($c -match 'OK') {
        Write-Host "[OK] ChatGPT authenticated" -ForegroundColor Green
        $chatgptOk = $true
    }
    else { Write-Host "[?] ChatGPT responded but unexpected: $c" -ForegroundColor Yellow }
}
catch {
    Write-Host "[FAIL] ChatGPT: $_" -ForegroundColor Red
}

# *** End alert: only claim tested+reviewed when BOTH keys pass; otherwise blocked ***
if (-not $Quiet) {
    if ($geminiOk -and $chatgptOk) {
        try { & $picker -Mindset gemini -Category finished -Tested:$true -Reviewed:$true | Out-Null } catch { }
    }
    else {
        try { & $picker -Mindset claude -Category blocked | Out-Null } catch { }
    }
}
