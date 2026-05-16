[CmdletBinding()]
param(
  [string] $RulesFolder = (Split-Path $PSScriptRoot -Parent)
)
$ErrorActionPreference = 'Stop'
$fixturesRoot = Join-Path $PSScriptRoot 'test-fixtures'
$tmpOut = Join-Path $env:TEMP "falcon-rulebook-test-$(Get-Date -Format 'yyyyMMddHHmmss').jsonl"

$results = @()

# ----------------------------------------------------------------
# Helper â€” load violations from a JSONL file
# ----------------------------------------------------------------
function Get-Violations {
  param([string] $Path)
  if (-not (Test-Path $Path)) { return @() }
  return @(Get-Content $Path | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json })
}

# ----------------------------------------------------------------
# Helper â€” common bad/good assertion
# ----------------------------------------------------------------
function Test-Fixture {
  param(
    [string] $RuleId,
    [string] $Engine,
    [object[]] $Hits,
    [int] $BadCount,
    [int] $GoodCount
  )
  $badHits  = @($Hits | Where-Object { $_.filePath -match '(^|/)bad-' })
  $goodHits = @($Hits | Where-Object { $_.filePath -match '(^|/)good-' })
  $badHitFiles = @($badHits | Select-Object -ExpandProperty filePath -Unique)

  $passBad  = $badHitFiles.Count -ge $BadCount
  $passGood = $goodHits.Count    -eq 0
  $pass     = $passBad -and $passGood
  $status   = if ($pass) { 'PASS' } else { 'FAIL' }

  return [PSCustomObject]@{
    Rule         = $RuleId
    Engine       = $Engine
    BadExpected  = $BadCount
    BadHits      = $badHits.Count
    GoodExpected = 0
    GoodHits     = $goodHits.Count
    Status       = $status
  }
}

# ----------------------------------------------------------------
# Regex + structural fixtures (existing behaviour)
# ----------------------------------------------------------------
Get-ChildItem $fixturesRoot -Directory | ForEach-Object {
  $ruleId = $_.Name
  # *** Skip AST fixtures here; they're handled below ***
  if ($ruleId -eq 'R-FE-007' -or $ruleId -eq 'R-BE-002') { return }

  $bad  = @(Get-ChildItem $_.FullName -File -Filter 'bad-*'  -Recurse)
  $good = @(Get-ChildItem $_.FullName -File -Filter 'good-*' -Recurse)

  & (Join-Path $PSScriptRoot 'regex-runner.ps1') `
      -RulesFolder $RulesFolder `
      -TargetRepos @($_.FullName) `
      -OutputFile $tmpOut `
      -OnlyRules @($ruleId) `
      -RunId "test-$ruleId" 2>&1 | Out-Null

  $hits = Get-Violations -Path $tmpOut
  $results += Test-Fixture -RuleId $ruleId -Engine 'regex' -Hits $hits -BadCount $bad.Count -GoodCount $good.Count
}

# ----------------------------------------------------------------
# AST-FE fixture (R-FE-007) â€” invoke tsx + ast-runner-fe.ts
# ----------------------------------------------------------------
$tsxAvailable = $false
$nodeModules = Join-Path $PSScriptRoot 'node_modules'
try {
  $null = & node --version 2>$null
  if ($LASTEXITCODE -eq 0 -and (Test-Path $nodeModules)) { $tsxAvailable = $true }
} catch { $tsxAvailable = $false }

$feFixture = Join-Path $fixturesRoot 'R-FE-007'
if (Test-Path $feFixture) {
  $bad  = @(Get-ChildItem $feFixture -File -Filter 'bad-*'  -Recurse)
  $good = @(Get-ChildItem $feFixture -File -Filter 'good-*' -Recurse)

  if ($tsxAvailable) {
    $tsxCli = Join-Path $PSScriptRoot 'node_modules/tsx/dist/cli.cjs'
    $feRunner = Join-Path $PSScriptRoot 'ast-runner-fe.ts'
    Push-Location $PSScriptRoot
    try {
      & node $tsxCli $feRunner `
          --rules $RulesFolder `
          --target $feFixture `
          --output $tmpOut `
          --runId 'test-R-FE-007' 2>&1 | Out-Null
    } finally { Pop-Location }
    $hits = Get-Violations -Path $tmpOut
    $results += Test-Fixture -RuleId 'R-FE-007' -Engine 'ast-fe' -Hits $hits -BadCount $bad.Count -GoodCount $good.Count
  } else {
    $results += [PSCustomObject]@{
      Rule = 'R-FE-007'; Engine = 'ast-fe'
      BadExpected = $bad.Count; BadHits = 0
      GoodExpected = 0; GoodHits = 0
      Status = 'SKIP (tsx/node unavailable)'
    }
  }
}

# ----------------------------------------------------------------
# AST-BE fixture (R-BE-002) â€” invoke dotnet + Roslyn runner
# ----------------------------------------------------------------
$dotnetAvailable = $false
$beDll = Join-Path $PSScriptRoot 'build-be/bin/Debug/net8.0/FalconAstRunnerBE.dll'
try {
  $null = & dotnet --version 2>$null
  if ($LASTEXITCODE -eq 0 -and (Test-Path $beDll)) { $dotnetAvailable = $true }
} catch { $dotnetAvailable = $false }

$beFixture = Join-Path $fixturesRoot 'R-BE-002'
if (Test-Path $beFixture) {
  $bad  = @(Get-ChildItem $beFixture -File -Filter 'bad-*'  -Recurse)
  $good = @(Get-ChildItem $beFixture -File -Filter 'good-*' -Recurse)

  if ($dotnetAvailable) {
    & dotnet $beDll `
        --rules $RulesFolder `
        --target $beFixture `
        --output $tmpOut `
        --runId 'test-R-BE-002' 2>&1 | Out-Null
    $hits = Get-Violations -Path $tmpOut
    # *** AST-BE may emit hits for multiple rule IDs against one file; filter to R-BE-002 ***
    $hits = @($hits | Where-Object { $_.ruleId -eq 'R-BE-002' })
    $results += Test-Fixture -RuleId 'R-BE-002' -Engine 'ast-be' -Hits $hits -BadCount $bad.Count -GoodCount $good.Count
  } else {
    $results += [PSCustomObject]@{
      Rule = 'R-BE-002'; Engine = 'ast-be'
      BadExpected = $bad.Count; BadHits = 0
      GoodExpected = 0; GoodHits = 0
      Status = 'SKIP (dotnet unavailable)'
    }
  }
}

Write-Host ""
Write-Host "=== Falcon Rulebook -- Detector Test Runner ==="
$results | Format-Table -AutoSize
$failed = $results | Where-Object { $_.Status -like '*FAIL*' }
$skipped = $results | Where-Object { $_.Status -like 'SKIP*' }
if ($failed.Count -gt 0) {
  Write-Host ""
  Write-Host "$($failed.Count) rule(s) failed their fixture suite -- investigate before night shift trusts them."
  exit 1
} else {
  Write-Host ""
  Write-Host "All $($results.Count) rules passed their fixture suite ($($skipped.Count) skipped due to missing toolchain)."
}
