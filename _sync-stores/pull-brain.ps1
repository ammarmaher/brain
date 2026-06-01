# pull-brain.ps1
# Restore the brain stores FROM this clone back to their canonical paths on disk.
# Additive only (robocopy /E /XO) - copies new/newer files, never deletes local files.
# Run after:  git -C "C:\Falcon\Brain SK" pull
$ErrorActionPreference = "Stop"
$here   = Split-Path -Parent $MyInvocation.MyCommand.Path   # ...\Brain SK\_sync-stores
$repo   = Split-Path -Parent $here                          # ...\Brain SK
$memory = Join-Path $env:USERPROFILE ".claude\projects\C--Falcon\memory"

$jobs = @(
  @{ src = "$repo\_sync-stores\Brain";           dst = "C:\Falcon\Brain" }
  @{ src = "$repo\_sync-stores\universal-brain"; dst = "C:\Falcon\universal-brain" }
  @{ src = "$repo\_sync-stores\brain-skills";    dst = "C:\Falcon\brain-skills" }
  @{ src = "$repo\_sync-stores\agent-memory";    dst = $memory }
  @{ src = "$repo\outputs";                      dst = "C:\Falcon\Brain Outputs" }
)

foreach ($j in $jobs) {
  if (-not (Test-Path $j.src)) { Write-Host "skip (missing): $($j.src)"; continue }
  robocopy $j.src $j.dst /E /XO /XD .git node_modules .venv __pycache__ .cache /NFL /NDL /NP /NJH /R:1 /W:1 | Out-Null
  $code = $LASTEXITCODE
  if ($code -lt 8) { Write-Host ("OK   ({0})  {1}  ->  {2}" -f $code, $j.src, $j.dst) }
  else             { Write-Host ("FAIL ({0})  {1}  ->  {2}" -f $code, $j.src, $j.dst) }
}
Write-Host ""
Write-Host "Restore complete. To ground a Claude Code session, read:"
Write-Host "  C:\Falcon\Brain SK\CLAUDE.md"
Write-Host "  C:\Falcon\universal-brain\backups\latest-restore-packet.md"
Write-Host "  %USERPROFILE%\.claude\projects\C--Falcon\memory\MEMORY.md"
