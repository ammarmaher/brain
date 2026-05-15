# *** Shared helpers used by every detector engine ***
# *** Dot-sourced via:  . (Join-Path $PSScriptRoot '_detector-helpers.ps1') ***

function Get-RuleFrontmatter {
  param([string] $FilePath)
  $raw = Get-Content $FilePath -Raw
  if ($raw -notmatch '(?s)^---\r?\n(.+?)\r?\n---') { return $null }
  $fm = $matches[1]

  $result = @{}

  foreach ($key in @('ruleId', 'name', 'category', 'severity')) {
    if ($fm -match "(?m)^${key}:\s*(.+)$") {
      $result[$key] = $matches[1].Trim().Trim("'", '"')
    }
  }

  # detector block
  if ($fm -match '(?ms)^detector:\s*\r?\n((?:[ \t]+.*\r?\n)+)') {
    $detBlock = $matches[1]
    if ($detBlock -match '(?m)^[ \t]+type:\s*(.+)$') {
      $result['detectorType'] = $matches[1].Trim()
    }
    if ($detBlock -match "(?ms)^[ \t]+patterns:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $patterns = @()
      foreach ($line in $matches[1] -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") { $patterns += $matches[1] }
      }
      $result['patterns'] = $patterns
    }
    if ($detBlock -match "(?ms)^[ \t]+exemptPatterns:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $exPatterns = @()
      foreach ($line in $matches[1] -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") { $exPatterns += $matches[1] }
      }
      $result['exemptPatterns'] = $exPatterns
    }
    if ($detBlock -match "(?m)^[ \t]+description:\s*['""]?(.+?)['""]?\s*$") {
      $result['detectorDescription'] = $matches[1].Trim()
    }
  }

  # scope
  if ($fm -match '(?ms)^scope:\s*\r?\n((?:[ \t]+.*\r?\n)+)') {
    $scopeBlock = $matches[1]
    if ($scopeBlock -match "(?ms)^[ \t]+paths:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $paths = @()
      foreach ($line in $matches[1] -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") { $paths += $matches[1] }
      }
      $result['scopePaths'] = $paths
    }
    if ($scopeBlock -match "(?ms)^[ \t]+exemptPaths:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $eps = @()
      foreach ($line in $matches[1] -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") { $eps += $matches[1] }
      }
      $result['scopeExemptPaths'] = $eps
    }
  }

  # autoFix.patchHint
  if ($fm -match "(?ms)^autoFix:\s*\r?\n((?:[ \t]+.*\r?\n)+)") {
    $afBlock = $matches[1]
    if ($afBlock -match "(?m)^[ \t]+patchHint:\s*['""]?(.*?)['""]?\s*$") {
      $result['patchHint'] = $matches[1].Trim()
    }
  }

  return $result
}

function Convert-GlobToRegex {
  param([string] $Glob)
  $rx = [regex]::Escape($Glob)
  $rx = $rx -replace '\\\*\\\*', '.*'
  $rx = $rx -replace '\\\*',     '[^/\\\\]*'
  $rx = $rx -replace '\\\?',     '.'
  return '^' + $rx + '$'
}

function Test-PathMatches {
  param([string] $RelPath, [string[]] $Globs)
  if (-not $Globs -or $Globs.Count -eq 0) { return $false }
  $norm = $RelPath -replace '\\', '/'
  foreach ($g in $Globs) {
    if ([string]::IsNullOrWhiteSpace($g)) { continue }
    $rx = Convert-GlobToRegex $g
    if ($norm -match $rx) { return $true }
  }
  return $false
}

function Load-ExemptionRegistry {
  param([string] $ExemptionsFile)
  $registry = @{}
  if (-not (Test-Path $ExemptionsFile)) { return $registry }
  $lines = Get-Content $ExemptionsFile
  $currentRule = $null
  foreach ($line in $lines) {
    if ($line -match '^### (R-[A-Z]+-\d+)') {
      $currentRule = $matches[1]
      if (-not $registry.ContainsKey($currentRule)) { $registry[$currentRule] = @() }
      continue
    }
    if ($currentRule -and $line -match '^\|\s*`([^`]+)`\s*\|') {
      $registry[$currentRule] += $matches[1]
    }
  }
  return $registry
}
