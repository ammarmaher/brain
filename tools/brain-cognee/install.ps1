<#
  brain-cognee — install script (Tier 3, Python).
  Cognee auto-builds a knowledge graph + vector memory from documents.
  PREREQUISITE: Python 3.10+ (NOT installed on this host as of 2026-05-28).
  Isolated: creates a venv inside this folder. Never touches the Angular workspace.
#>
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

Write-Host '== brain-cognee install (Tier 3) ==' -ForegroundColor Cyan

# --- Hard prerequisite gate: Python 3.10+ ---
function Find-Python {
  foreach ($c in 'py', 'python', 'python3') {
    $cmd = Get-Command $c -ErrorAction SilentlyContinue
    if (-not $cmd) { continue }
    if ($cmd.Source -like '*WindowsApps*') { continue }  # skip the Microsoft Store alias stub
    $v = & $c --version 2>&1 | Out-String
    if ($v -match 'Python 3\.(\d+)' -and [int]$Matches[1] -ge 10) { return $c }
  }
  return $null
}
$py = Find-Python
if (-not $py) {
  Write-Host 'BLOCKED: Python 3.10+ not found.' -ForegroundColor Red
  Write-Host 'Install it first:  winget install Python.Python.3.11'
  Write-Host 'Then re-run:       powershell -ExecutionPolicy Bypass -File install.ps1'
  exit 1
}
Write-Host "Using $py ($(& $py --version))"

# --- Isolated venv + install ---
& $py -m venv .venv
$pip = Join-Path $here '.venv\Scripts\pip.exe'
& $pip install --upgrade pip
& $pip install -r requirements.txt

if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env'; Write-Host 'Created .env — add your LLM_API_KEY before running.' -ForegroundColor Yellow }
Write-Host '== brain-cognee installed ==' -ForegroundColor Green
Write-Host 'Next: set LLM_API_KEY in .env, then  .venv\Scripts\python ingest-brain.py'
