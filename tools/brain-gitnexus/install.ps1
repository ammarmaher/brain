<#
  brain-gitnexus — prerequisite check + guidance stub (Tier 3).
  GitNexus is MCP-native. Its exact install command is UNVERIFIED here — read README.md
  and the repo before running anything. This script only checks prerequisites.
#>
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-Ver($cmd) {
  $c = Get-Command $cmd -ErrorAction SilentlyContinue
  if (-not $c) { return 'MISSING' }
  try { return ((& $cmd --version 2>&1 | Out-String).Trim() -split "`n")[0] } catch { return 'present' }
}
function Test-Python {
  foreach ($c in 'py', 'python', 'python3') {
    $cmd = Get-Command $c -ErrorAction SilentlyContinue
    if ($cmd -and $cmd.Source -notlike '*WindowsApps*') {
      $v = & $c --version 2>&1 | Out-String
      if ($v -match 'Python 3\.\d+') { return $v.Trim() }
    }
  }
  return 'MISSING (winget install Python.Python.3.11)'
}

Write-Host '== brain-gitnexus prerequisite check ==' -ForegroundColor Cyan
Write-Host ("node   : {0}" -f (Get-Ver node))
Write-Host ("git    : {0}" -f (Get-Ver git))
Write-Host ("python : {0}" -f (Test-Python))
Write-Host ''
Write-Host 'NEXT: GitNexus install is UNVERIFIED. Open README.md, confirm the real install command' -ForegroundColor Yellow
Write-Host '      from the GitNexus repo, then register it as an MCP server in Claude Code (.mcp.json).'
