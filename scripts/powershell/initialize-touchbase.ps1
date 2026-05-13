param(
  [string]$ProjectRoot = "C:\Falcon\Falcon",
  [string]$BrainRoot = (Get-Location).Path
)

Write-Host "Brain SK TouchBase initialization" -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host "Brain root: $BrainRoot"

$outputRoot = Join-Path $BrainRoot "outputs\discovery"
$obsidianRoot = Join-Path $BrainRoot "_obsidian"
New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
New-Item -ItemType Directory -Force -Path $obsidianRoot | Out-Null

$pathMapMd = Join-Path $outputRoot "discovered-path-map.md"
$readinessMd = Join-Path $outputRoot "startup-readiness-report.md"

@"
# Discovered Path Map

Project root: `$ProjectRoot`
Generated: $(Get-Date -Format o)

| Area | Status | Path | Evidence |
|---|---:|---|---|
| Project root | $((Test-Path $ProjectRoot) ? 'OK' : 'MISSING') | `$ProjectRoot` | TouchBase input |
| Frontend | pending | auto-detect required | angular.json / nx.json / package.json |
| Backend | pending | auto-detect required | .sln / .csproj / Controllers |
| Gateway | pending | auto-detect required | ocelot.json / Gateway |
| PRD | pending | auto-detect required | PRD / requirements / epics |
| Wiki | pending | auto-detect required | wiki / docs / architecture |
| Obsidian | OK | `$obsidianRoot` | Brain vault folder |
"@ | Set-Content -Encoding UTF8 $pathMapMd

@"
# Startup Readiness Report

Generated: $(Get-Date -Format o)

| Check | Status | Action |
|---|---:|---|
| Project root | $((Test-Path $ProjectRoot) ? 'OK' : 'MISSING') | If missing, ask Ammar for path |
| Brain outputs | OK | Created outputs/discovery |
| Obsidian index | OK | Created _obsidian folder |

Next: run Claude command `/bootstrap-touchbase` or `Initialize Brain SK` to perform deep discovery.
"@ | Set-Content -Encoding UTF8 $readinessMd

Write-Host "Generated:" -ForegroundColor Green
Write-Host "- $pathMapMd"
Write-Host "- $readinessMd"
