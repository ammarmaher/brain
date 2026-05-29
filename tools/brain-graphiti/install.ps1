<#
  brain-graphiti — install script (Tier 3, Python + Docker).
  Graphiti = temporal knowledge graph for agent memory (facts with validity over time).
  PREREQUISITES: Python 3.10+ (NOT installed, 2026-05-28) + Docker (present) for the Neo4j backend.
  Isolated: venv in this folder + a dedicated Neo4j container.
#>
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

Write-Host '== brain-graphiti install (Tier 3) ==' -ForegroundColor Cyan

# Python gate
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
  Write-Host 'BLOCKED: Python 3.10+ not found. Run:  winget install Python.Python.3.11' -ForegroundColor Red
  exit 1
}
# Docker gate
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host 'BLOCKED: Docker not found (needed for the Neo4j backend).' -ForegroundColor Red
  exit 1
}
Write-Host "Using $py ($(& $py --version)) + $(docker --version)"

& $py -m venv .venv
& (Join-Path $here '.venv\Scripts\pip.exe') install --upgrade pip
& (Join-Path $here '.venv\Scripts\pip.exe') install -r requirements.txt
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env'; Write-Host 'Created .env — set OPENAI_API_KEY + NEO4J_PASSWORD.' -ForegroundColor Yellow }

Write-Host 'Starting Neo4j backend...' -ForegroundColor Yellow
docker compose up -d

Write-Host '== brain-graphiti installed ==' -ForegroundColor Green
Write-Host 'Next: set keys in .env, then  .venv\Scripts\python ingest-brain.py'
