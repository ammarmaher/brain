[CmdletBinding()]
param(
  [string] $RulesFolder = (Split-Path $PSScriptRoot -Parent)
)
$ErrorActionPreference = 'Stop'
$fixturesRoot = Join-Path $PSScriptRoot 'test-fixtures'
$tmpOut = Join-Path $env:TEMP "falcon-rulebook-test-$(Get-Date -Format 'yyyyMMddHHmmss').jsonl"

$results = @()

Get-ChildItem $fixturesRoot -Directory | ForEach-Object {
  $ruleId = $_.Name
  # *** Fixtures may sit in scope-matching subdirs (e.g. apps/admin-console/sample/) ***
  $bad  = @(Get-ChildItem $_.FullName -File -Filter 'bad-*'  -Recurse)
  $good = @(Get-ChildItem $_.FullName -File -Filter 'good-*' -Recurse)

  # Treat the fixture folder itself as the "target repo"
  & (Join-Path $PSScriptRoot 'regex-runner.ps1') `
      -RulesFolder $RulesFolder `
      -TargetRepos @($_.FullName) `
      -OutputFile $tmpOut `
      -OnlyRules @($ruleId) `
      -RunId "test-$ruleId" 2>&1 | Out-Null

  $hits = @()
  if (Test-Path $tmpOut) {
    $hits = Get-Content $tmpOut | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json }
  }

  # *** filePath is repo-relative; match bad-/good- at any path segment ***
  $badHits  = @($hits | Where-Object { $_.filePath -match '(^|/)bad-' })
  $goodHits = @($hits | Where-Object { $_.filePath -match '(^|/)good-' })

  # *** Distinct fixture files that produced at least one hit ***
  $badHitFiles = @($badHits | Select-Object -ExpandProperty filePath -Unique)

  $passBad  = $badHitFiles.Count -ge $bad.Count   # every bad fixture produced >= 1 hit
  $passGood = $goodHits.Count    -eq 0            # no good fixture produced hits
  $pass     = $passBad -and $passGood
  $status   = if ($pass) { 'PASS' } else { 'FAIL' }

  $results += [PSCustomObject]@{
    Rule         = $ruleId
    BadExpected  = $bad.Count
    BadHits      = $badHits.Count
    GoodExpected = 0
    GoodHits     = $goodHits.Count
    Status       = $status
  }
}

Write-Host ""
Write-Host "=== Falcon Rulebook -- Detector Test Runner ==="
$results | Format-Table -AutoSize
$failed = $results | Where-Object { $_.Status -like '*FAIL*' }
if ($failed.Count -gt 0) {
  Write-Host ""
  Write-Host "$($failed.Count) rule(s) failed their fixture suite -- investigate before night shift trusts them."
  exit 1
} else {
  Write-Host ""
  Write-Host "All $($results.Count) rules passed their fixture suite."
}
