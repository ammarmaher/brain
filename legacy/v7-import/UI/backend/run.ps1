# *** Brain UI Backend launcher (Windows) ***
# *** Creates venv, installs deps, runs uvicorn on configured port ***

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

if (-not (Test-Path ".venv")) {
    python -m venv .venv
}

. .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

if (-not $env:BRAIN_UI_PORT) { $env:BRAIN_UI_PORT = "8000" }
uvicorn app.main:app --host 0.0.0.0 --port $env:BRAIN_UI_PORT --reload
