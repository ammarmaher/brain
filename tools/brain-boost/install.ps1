<#
  brain-boost — install script (Tier 1 + Tier 2, Node/local)
  Isolated: installs ONLY inside this folder's node_modules.
  Never touches C:\Falcon\Falcon\falcon-web-platform-ui.

  Usage:
    powershell -ExecutionPolicy Bypass -File install.ps1
#>
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

Write-Host '== brain-boost install (Tier 1+2) ==' -ForegroundColor Cyan

# 1. Node check
$node = (node --version) 2>$null
if (-not $node) { throw 'Node.js not found. Install Node 20+ first.' }
Write-Host "node $node / npm $(npm --version)"

# 2. Install isolated deps
Write-Host 'Installing dependencies (orama, transformers.js, graphology, sqlite-vec, ...)' -ForegroundColor Yellow
npm install --no-audit --no-fund

# 3. Pre-download the local embedding model (all-MiniLM-L6-v2, ~90MB) so first query is fast
Write-Host 'Warming the local embedding model (one-time download)...' -ForegroundColor Yellow
# --dns-result-order=ipv4first: this host resets IPv6 TLS to huggingface.co (see brain memory infra_ado_ipv6_blocked_use_ipv4)
node --dns-result-order=ipv4first src/warm-model.mjs

Write-Host '== brain-boost ready ==' -ForegroundColor Green
Write-Host 'Next: npm run index   (build the semantic index over the brain)'
Write-Host '      npm run query -- "how do components and tailwind relate"'
Write-Host '      npm run health  (graph orphan + community report)'
Write-Host '      npm run lint    (dossier + skill structure lint)'
