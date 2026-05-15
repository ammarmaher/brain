# *** Falcon Rulebook — Structural Detector Engine ***
# *** Folder / file / naming checks; reads rule frontmatter where detector.type=structural ***

[CmdletBinding()]
param(
  [Parameter(Mandatory)] [string]   $RulesFolder,
  [Parameter(Mandatory)] [string[]] $TargetRepos,
  [Parameter(Mandatory)] [string]   $OutputFile,
  [string] $RunId = (Get-Date -Format 'yyyyMMddHHmmss'),
  [string[]] $OnlyRules = @(),
  [switch] $VerboseDetector
)

$ErrorActionPreference = 'Stop'
$nowIso = (Get-Date).ToUniversalTime().ToString('o')

# ----------------------------------------------------------------
# Reusable helpers (shared shape with regex-runner)
# ----------------------------------------------------------------

. (Join-Path $PSScriptRoot '_detector-helpers.ps1')

# ----------------------------------------------------------------
# Structural check registry — one handler per ruleId
# ----------------------------------------------------------------

$StructuralHandlers = @{

  # R-FE-002: No SCSS / no component CSS / no styles: array
  'R-FE-002' = {
    param($Repo, $Rule)
    $hits = @()
    # SCSS files
    Get-ChildItem $Repo -Recurse -File -Include '*.scss' -ErrorAction SilentlyContinue | ForEach-Object {
      $rel = (($_.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
      if (-not (Test-PathMatches -RelPath $rel -Globs $Rule.scopeExemptPaths)) {
        $hits += @{ filePath=$rel; lineNumber=1; lineContent='(SCSS file present)'; matchedPattern='*.scss exists' }
      }
    }
    # Component-bound css from @Component({ styleUrls: [...] }) — match TS files
    Get-ChildItem $Repo -Recurse -File -Include '*.component.ts','*.ts' -ErrorAction SilentlyContinue | ForEach-Object {
      $rel = (($_.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
      if (Test-PathMatches -RelPath $rel -Globs $Rule.scopeExemptPaths) { return }
      $lines = Get-Content $_.FullName -ErrorAction SilentlyContinue
      for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '(styleUrls|styles)\s*:\s*\[' -and $lines[$i] -notmatch '\[\s*\]') {
          $hits += @{ filePath=$rel; lineNumber=$i+1; lineContent=$lines[$i].Trim(); matchedPattern='@Component styles array' }
        }
      }
    }
    return $hits
  }

  # R-FE-009: Folder structure pattern — one file per type-folder
  'R-FE-009' = {
    param($Repo, $Rule)
    $hits = @()
    # Expected pattern: models/models.ts, services/services.ts, resolvers/resolvers.ts, directives/directives.ts
    Get-ChildItem $Repo -Directory -Recurse -ErrorAction SilentlyContinue | Where-Object {
      $_.Name -in @('models','services','resolvers','directives')
    } | ForEach-Object {
      $dir = $_
      $expectedFile = Join-Path $dir.FullName "$($dir.Name).ts"
      if (-not (Test-Path $expectedFile)) {
        # Find offender file inside
        $actualFiles = Get-ChildItem $dir.FullName -File -Filter '*.ts' -ErrorAction SilentlyContinue
        if ($actualFiles.Count -gt 0) {
          $rel = (($dir.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
          $hits += @{
            filePath = $rel + '/'
            lineNumber = 1
            lineContent = "$($dir.Name)/ has $($actualFiles.Count) ts files but no $($dir.Name).ts"
            matchedPattern = "expected: $($dir.Name).ts"
          }
        }
      }
    }
    return $hits
  }

  # R-FE-012: Build must be green — out-of-band; emits an FYI if there's no recent successful build artifact
  'R-FE-012' = {
    param($Repo, $Rule)
    # The audit-orchestrator can run `nx build` separately; this handler is a placeholder
    # that reports a single FYI row noting build state is verified out-of-band.
    return @(@{
      filePath = '(out-of-band)'
      lineNumber = 0
      lineContent = 'Build state verified by audit-orchestrator post-hoc, not by this handler'
      matchedPattern = '(deferred to orchestrator)'
      severity_hint = 'fyi'
    })
  }

  # R-FE-013: Discard old UI — no new content in deprecated folders
  'R-FE-013' = {
    param($Repo, $Rule)
    $hits = @()
    $forbidden = @('falcon-web-platform-ui-old', 'deprecated-falcon-web-platform-ui')
    foreach ($name in $forbidden) {
      $candidate = Join-Path $Repo $name
      if (Test-Path $candidate) {
        $modified = Get-ChildItem $candidate -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
          $_.LastWriteTime -gt (Get-Date).AddDays(-7)
        }
        foreach ($m in $modified) {
          $rel = (($m.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
          $hits += @{ filePath=$rel; lineNumber=1; lineContent="Modified in deprecated UI folder within last 7 days"; matchedPattern="deprecated UI write detected" }
        }
      }
    }
    return $hits
  }

  # R-FE-014: Canonical workspace only — no edits under WebstormProjects
  'R-FE-014' = {
    param($Repo, $Rule)
    $hits = @()
    if ($Repo -match 'WebstormProjects[\\/]falcon-web-platform-ui') {
      $hits += @{
        filePath = $Repo
        lineNumber = 0
        lineContent = 'TargetRepo is the forbidden duplicate workspace path'
        matchedPattern = 'WebstormProjects/falcon-web-platform-ui'
      }
    }
    return $hits
  }

  # R-NOOR-001: Layout ownership — `<falcon-page-shell>` wrapper expected at every admin-console page
  'R-NOOR-001' = {
    param($Repo, $Rule)
    $hits = @()
    Get-ChildItem $Repo -Recurse -File -Include '*-page.component.html','*.page.html' -ErrorAction SilentlyContinue | ForEach-Object {
      $rel = (($_.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
      if ($rel -notmatch 'apps/admin-console/') { return }
      if (Test-PathMatches -RelPath $rel -Globs $Rule.scopeExemptPaths) { return }
      $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
      if ($content -and $content -notmatch '<falcon-page-(shell|wrapper|layout)') {
        $hits += @{ filePath=$rel; lineNumber=1; lineContent='Admin Console page missing <falcon-page-shell> wrapper'; matchedPattern='page chrome ownership' }
      }
    }
    return $hits
  }

  # R-NOOR-004: Font ownership — fonts must be loaded only in index.html, not via per-component @font-face / @import url(... fonts.googleapis ...)
  'R-NOOR-004' = {
    param($Repo, $Rule)
    $hits = @()
    Get-ChildItem $Repo -Recurse -File -Include '*.ts','*.html','*.css' -ErrorAction SilentlyContinue | ForEach-Object {
      $rel = (($_.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
      if ($rel -notmatch 'apps/admin-console/') { return }
      if ($rel -match '/index\.html$') { return }
      if (Test-PathMatches -RelPath $rel -Globs $Rule.scopeExemptPaths) { return }
      $lines = Get-Content $_.FullName -ErrorAction SilentlyContinue
      for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "@(font-face|import)\b.*?(fonts\.googleapis|fonts\.gstatic|\.woff2?|\.ttf)") {
          $hits += @{ filePath=$rel; lineNumber=$i+1; lineContent=$lines[$i].Trim(); matchedPattern='font loaded outside index.html' }
        }
      }
    }
    return $hits
  }

  # R-BE-003: Internal services no gateway — HttpClient base URLs should not point at gateway hostnames
  'R-BE-003' = {
    param($Repo, $Rule)
    $hits = @()
    Get-ChildItem $Repo -Recurse -File -Include '*.cs','*.json' -ErrorAction SilentlyContinue | ForEach-Object {
      $rel = (($_.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
      if (Test-PathMatches -RelPath $rel -Globs $Rule.scopeExemptPaths) { return }
      $lines = Get-Content $_.FullName -ErrorAction SilentlyContinue
      for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '(gateway[-.]|/api/.*-gateway|7038|7256|core-gateway|system-gateway)') {
          $hits += @{ filePath=$rel; lineNumber=$i+1; lineContent=$lines[$i].Trim(); matchedPattern='gateway URL in internal-service code' }
        }
      }
    }
    return $hits
  }

  # R-XC-001: Identity owns user lifecycle — non-Identity services must not import Zitadel SDK or Mongo Users collection
  'R-XC-001' = {
    param($Repo, $Rule)
    $hits = @()
    # Identity service is exempt
    if ($Repo -match 'falcon-core-identity-svc') { return $hits }
    Get-ChildItem $Repo -Recurse -File -Include '*.cs' -ErrorAction SilentlyContinue | ForEach-Object {
      $rel = (($_.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
      if (Test-PathMatches -RelPath $rel -Globs $Rule.scopeExemptPaths) { return }
      $lines = Get-Content $_.FullName -ErrorAction SilentlyContinue
      for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '(Zitadel\.Sdk|ManagementServiceClient|AdminServiceClient|users\.InsertOne|users\.DeleteOne)') {
          $hits += @{ filePath=$rel; lineNumber=$i+1; lineContent=$lines[$i].Trim(); matchedPattern='non-Identity service writing users directly' }
        }
      }
    }
    return $hits
  }

  # R-XC-002: Frontend never calls Zitadel directly
  'R-XC-002' = {
    param($Repo, $Rule)
    $hits = @()
    Get-ChildItem $Repo -Recurse -File -Include '*.ts','*.html' -ErrorAction SilentlyContinue | ForEach-Object {
      $rel = (($_.FullName).Substring($Repo.Length).TrimStart('\','/')) -replace '\\','/'
      if (Test-PathMatches -RelPath $rel -Globs $Rule.scopeExemptPaths) { return }
      $lines = Get-Content $_.FullName -ErrorAction SilentlyContinue
      for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "(zitadel\.cloud|zitadel\.com|@zitadel/|oidcClientSettings.*authority\s*[:=]\s*['""].+zitadel)") {
          $hits += @{ filePath=$rel; lineNumber=$i+1; lineContent=$lines[$i].Trim(); matchedPattern='direct Zitadel reference from frontend' }
        }
      }
    }
    return $hits
  }

  # R-XC-008: Trunk-based development — no long-lived branches
  'R-XC-008' = {
    param($Repo, $Rule)
    $hits = @()
    if (-not (Test-Path (Join-Path $Repo '.git'))) { return $hits }
    try {
      Push-Location $Repo
      $branches = git for-each-ref --format='%(refname:short)|%(committerdate:iso8601)' refs/heads/ 2>$null
      foreach ($b in $branches) {
        $parts = $b -split '\|'
        $name = $parts[0]
        $dateStr = $parts[1]
        if ($name -in @('main','master','develop','HEAD')) {
          # develop violates TBD itself if it's the working branch — flag
          if ($name -eq 'develop') {
            $hits += @{ filePath="(repo)"; lineNumber=0; lineContent="branch 'develop' exists — violates trunk-based development"; matchedPattern='long-lived non-main branch' }
          }
          continue
        }
        if ($name -match '^(release/|hotfix/)') {
          $hits += @{ filePath="(repo)"; lineNumber=0; lineContent="branch '$name' violates trunk-based development"; matchedPattern='release/hotfix branch pattern' }
        }
        # Age check
        try {
          $d = [datetime]::Parse($dateStr)
          if ((Get-Date) - $d -gt [timespan]::FromDays(14)) {
            $hits += @{ filePath="(repo)"; lineNumber=0; lineContent="branch '$name' has not been updated in >14 days"; matchedPattern='stale long-lived branch' }
          }
        } catch { }
      }
    } finally { Pop-Location }
    return $hits
  }
}

# ----------------------------------------------------------------
# Main
# ----------------------------------------------------------------

Write-Host "=== Falcon Rulebook — Structural Detector Engine ==="
Write-Host "Run ID    : $RunId"
Write-Host "Rules     : $RulesFolder"
Write-Host "Targets   : $($TargetRepos -join ', ')"
Write-Host "Output    : $OutputFile"

$ruleFiles = Get-ChildItem -Path $RulesFolder -Filter 'R-*.md' -Recurse
$structuralRules = @()
foreach ($rf in $ruleFiles) {
  $fm = Get-RuleFrontmatter -FilePath $rf.FullName
  if ($null -eq $fm) { continue }
  if ($fm.detectorType -ne 'structural') { continue }
  if ($OnlyRules.Count -gt 0 -and $OnlyRules -notcontains $fm.ruleId) { continue }
  $structuralRules += $fm
}
Write-Host "Selected $($structuralRules.Count) structural rules"

$exemptions = Load-ExemptionRegistry -ExemptionsFile (Join-Path $RulesFolder 'exemptions/EXEMPTIONS.md')

$outDir = Split-Path -Path $OutputFile -Parent
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
if (Test-Path $OutputFile) { Remove-Item $OutputFile -Force }
New-Item -ItemType File -Force -Path $OutputFile | Out-Null

$violationCount = 0
$rulesWithoutHandler = @()

foreach ($rule in $structuralRules) {
  $ruleId = $rule.ruleId
  if ($VerboseDetector) { Write-Host "[$ruleId] $($rule.name)" }

  if (-not $StructuralHandlers.ContainsKey($ruleId)) {
    $rulesWithoutHandler += $ruleId
    continue
  }
  $handler = $StructuralHandlers[$ruleId]

  foreach ($repo in $TargetRepos) {
    if (-not (Test-Path $repo)) { Write-Warning "  Target missing: $repo"; continue }
    try {
      $hits = & $handler $repo $rule
    } catch {
      Write-Warning "[$ruleId] handler error: $_"
      continue
    }
    foreach ($h in $hits) {
      $violation = [ordered]@{
        ruleId           = $ruleId
        ruleName         = $rule.name
        ruleCategory     = $rule.category
        severity         = $rule.severity
        detectorType     = 'structural'
        targetRepo       = $repo
        filePath         = $h.filePath
        lineNumber       = $h.lineNumber
        lineContent      = $h.lineContent
        matchedPattern   = $h.matchedPattern
        exemptByRule     = $false
        exemptByRegistry = $false
        suggestedFix     = $rule.patchHint
        detectedAt       = $nowIso
        runId            = $RunId
      }
      $violation | ConvertTo-Json -Compress | Add-Content -Path $OutputFile
      $violationCount++
    }
  }
}

Write-Host ""
Write-Host "=== Run complete ==="
Write-Host "Rules executed       : $($structuralRules.Count - $rulesWithoutHandler.Count) / $($structuralRules.Count)"
if ($rulesWithoutHandler.Count -gt 0) {
  Write-Host "Rules without handler: $($rulesWithoutHandler -join ', ')"
  Write-Host "  Note: structural rules require a handler in StructuralHandlers map."
  Write-Host "  Add a scriptblock for each ruleId; falls back to no-op until added."
}
Write-Host "Violations           : $violationCount"
Write-Host "Output               : $OutputFile"
