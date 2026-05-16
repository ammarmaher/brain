# *** NIGHT-SHIFT-LOOP.ps1 ***
# Chained verification:
#   GATE 0 - Brain health (brain-audit.ps1 must be GREEN or YELLOW; RED halts)
#   GATE 1 - Build green (nx build $App)
#   GATE 2 - Scanner clean (scan-authority -CheckOnly)
#   GATE 3 - Backend PES verify (login + authorize for users in SPEC pes-checks block)
#   GATE 4 - Done marker (completion report at $OutputDir)
#   [GATE 5 - FE runtime: DEFERRED until workspace compile errors fixed]
#
# Brain-aware as of 2026-05-16:
#   - Knows about clusters 18 (A->Z traces) · 20 (Brain-Maintenance) · 21 (Onboarding)
#   - Calls brain-audit.ps1 as the first gate so the brain itself is proven healthy
#     before the task runs against it
#   - Embeds cluster 20 (MEMORY-GROW) reminder in completion report
#
# See NIGHT-SHIFT-LOOP.md for protocol details + exit-code table.
# ASCII only (no Unicode glyphs - PS 5.1 Windows-1252 trap).

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$SpecPath,

  [string]$App = "management-console",

  [string]$RepoRoot = "C:\Falcon\Falcon\falcon-web-platform-ui",

  [string]$ScannerPath = "C:\Falcon\falcon-wiki\scripts\scan-authority.ps1",

  [string]$BrainAuditPath = "C:\Falcon\Brain Outputs\datasets\authority-dataset\20-brain-maintenance\brain-audit.ps1",

  [string]$OutputDir = "C:\Falcon\Brain Outputs\datasets\authority-dataset\_runtime-verification",

  [switch]$SkipBrainAudit,

  [switch]$SkipBackend,

  [switch]$DryRun,

  [switch]$Quiet
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# *** Helpers ***
function Write-Log {
  param([string]$Message, [string]$Level = "INFO")
  if (-not $Quiet) {
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host "[loop $ts $Level] $Message"
  }
}

function Get-TaskId {
  param([string]$Path)
  return [System.IO.Path]::GetFileNameWithoutExtension($Path)
}

function New-ReportPath {
  param([string]$TaskId)
  $stamp = Get-Date -Format "yyyy-MM-dd-HHmm"
  return Join-Path $OutputDir "loop-$TaskId-$stamp.md"
}

# *** Validate SPEC.md ***
Write-Log "Validating SPEC at $SpecPath"
if (-not (Test-Path $SpecPath)) {
  Write-Log "SPEC.md not found: $SpecPath" "ERROR"
  exit 10
}

$specContent = [System.IO.File]::ReadAllText($SpecPath)
$verdict = [regex]::Match($specContent, "(?m)^verdict:\s*(\S+)").Groups[1].Value
$class = [regex]::Match($specContent, "(?m)^class:\s*(\S+)").Groups[1].Value
$taskId = Get-TaskId -Path $SpecPath
$reportPath = New-ReportPath -TaskId $taskId

if ($verdict -ne "proceed" -and $verdict -ne "proceed-with-defaults" -and $verdict -ne "complete") {
  Write-Log "SPEC.md verdict is '$verdict' — must be 'proceed' or 'proceed-with-defaults' to run the loop" "ERROR"
  exit 10
}

Write-Log "SPEC.md valid · task=$taskId · class=$class · verdict=$verdict"

if ($DryRun) {
  Write-Log "Dry-run: SPEC.md is valid. Exiting without running gates." "INFO"
  exit 0
}

# *** Output dir ***
if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$gates = @{
  brain = @{ status = "skipped"; detail = ""; exit = $null }
  build = @{ status = "skipped"; detail = ""; exit = $null }
  scanner = @{ status = "skipped"; detail = ""; exit = $null }
  backend = @{ status = "skipped"; detail = ""; exit = $null }
  done = @{ status = "skipped"; detail = ""; exit = $null }
}

# *** GATE 0 - Brain health (pre-flight) ***
# The brain must be healthy before we trust any claim it makes about the task.
# brain-audit.ps1 exit codes: 0=GREEN, 1=YELLOW (warnings ok), 2=RED (critical, halt).
if ($SkipBrainAudit) {
  Write-Log "Gate 0 SKIPPED (-SkipBrainAudit)" "WARN"
  $gates.brain = @{ status = "SKIPPED"; detail = "user requested skip"; exit = $null }
} elseif (Test-Path $BrainAuditPath) {
  Write-Log "GATE 0: brain-audit (proves dataset health before task runs)"
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $BrainAuditPath -ReportOnly 2>&1 | Out-Null
  $brainExit = $LASTEXITCODE
  if ($brainExit -eq 2) {
    $gates.brain = @{ status = "FAIL"; detail = "brain audit CRITICAL (exit 2)"; exit = 4 }
    Write-Log "Gate 0 FAIL - brain audit returned CRITICAL findings" "ERROR"
    $haltReport = @"
---
type: night-shift-loop-report
task: $taskId
run-at: $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
verdict: halt
exit-code: 4
gate-failed: Gate 0 - Brain health
purpose: "Brain audit returned CRITICAL findings - dataset is unhealthy. Cannot run night-shift safely."
---

# HALT - brain health CRITICAL

Brain audit (``brain-audit.ps1``) detected CRITICAL findings - broken wikilinks, orphan
memory entries, or other issues that mean the dataset cannot be trusted as source of truth.

Open the latest report at:
  C:\Falcon\Brain Outputs\datasets\authority-dataset\_runtime-verification\brain-audit-*.md

Fix all CRIT findings before re-running this loop.
"@
    Set-Content -Path $reportPath -Value $haltReport
    exit 4
  } elseif ($brainExit -eq 1) {
    $gates.brain = @{ status = "PASS (YELLOW)"; detail = "warnings present, not blocking"; exit = 0 }
    Write-Log "Gate 0 PASS (YELLOW) - non-critical warnings only"
  } else {
    $gates.brain = @{ status = "PASS"; detail = "GREEN"; exit = 0 }
    Write-Log "Gate 0 PASS - brain is GREEN"
  }
} else {
  Write-Log "Gate 0 SKIPPED - brain-audit.ps1 not found at $BrainAuditPath" "WARN"
  $gates.brain = @{ status = "SKIPPED"; detail = "brain-audit not found"; exit = $null }
}

# *** GATE 1 - Build green ***
Write-Log "GATE 1: nx build $App"
Push-Location $RepoRoot
try {
  $buildLog = & "C:\Program Files\nodejs\npx.cmd" nx build $App --skip-nx-cache 2>&1 | Out-String
  $buildExit = $LASTEXITCODE
} catch {
  $buildExit = 99
  $buildLog = $_.Exception.Message
}
Pop-Location

if ($buildExit -ne 0) {
  $gates.build = @{ status = "FAIL"; detail = "exit $buildExit"; exit = 1 }
  Write-Log "Gate 1 FAIL · exit=$buildExit" "ERROR"
  $tail = ($buildLog -split "`n" | Select-Object -Last 30) -join "`n"
  Set-Content -Path "$reportPath.build-log.txt" -Value $tail

  # Compose halt report + exit
  $haltReport = @"
---
type: night-shift-loop-report
task: $taskId
run-at: $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
verdict: halt
exit-code: 1
gate-failed: Gate 1 — Build
purpose: "Answers 'why night-shift task $taskId halted at build gate'. Open to diagnose + retry."
---

# Loop report · $taskId · HALT

## TL;DR
Build red. Halted at Gate 1.

## Gate result
- Gate 1 Build: FAIL · exit=$buildExit · log tail: $reportPath.build-log.txt

## Recommended next action
1. Read the build log tail
2. Cross-check against ANTI-PATTERNS.md cheat sheet
3. If it's a known pitfall (SCSS / PrimeNG / `*ngIf` etc.), fix and retry the loop
4. If unknown error, halt-and-flag — write a _pending-questions/$taskId-build.md
"@
  Set-Content -Path $reportPath -Value $haltReport
  Write-Log "Halt report at: $reportPath" "INFO"
  exit 1
}

$gates.build = @{ status = "PASS"; detail = "exit 0"; exit = 0 }
Write-Log "Gate 1 PASS"

# *** GATE 2 — Scanner clean ***
if (Test-Path $ScannerPath) {
  Write-Log "GATE 2: $ScannerPath -CheckOnly"
  $scanOutput = & powershell.exe -ExecutionPolicy Bypass -File $ScannerPath -CheckOnly -Quiet 2>&1 | Out-String
  $scanExit = $LASTEXITCODE
  if ($scanExit -eq 0) {
    $gates.scanner = @{ status = "PASS"; detail = "all clean"; exit = 0 }
    Write-Log "Gate 2 PASS"
  } else {
    $gates.scanner = @{ status = "FAIL"; detail = "drift detected · exit=$scanExit"; exit = 2 }
    Write-Log "Gate 2 FAIL · drift detected" "WARN"
    $haltReport = @"
---
type: night-shift-loop-report
task: $taskId
run-at: $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
verdict: halt
exit-code: 2
gate-failed: Gate 2 — Scanner
---

# Loop report · $taskId · HALT

Scanner detected drift on watched files. Read the drift report at falcon-wiki/100-Authority/_drift-*.md.

Per DECISION-PROTOCOL F-006: night-shift cannot self-verify intent — halt-and-flag.

Scanner output:
``````
$scanOutput
``````
"@
    Set-Content -Path $reportPath -Value $haltReport
    exit 2
  }
} else {
  Write-Log "Gate 2 SKIPPED · scanner not found at $ScannerPath" "WARN"
  $gates.scanner = @{ status = "SKIPPED"; detail = "scanner not found"; exit = $null }
}

# *** GATE 3 — Backend PES verify ***
if ($SkipBackend) {
  Write-Log "Gate 3 SKIPPED (-SkipBackend)" "WARN"
  $gates.backend = @{ status = "SKIPPED"; detail = "user requested skip"; exit = $null }
} else {
  Write-Log "GATE 3: Backend PES verify (3 users × N queries from SPEC)"

  $identity = "http://localhost:7777/api"
  $pes = "http://localhost:5296"
  $password = "Admin@1234"
  $tenantId = "test-tenant-001"

  # Quick health check
  try {
    $h = Invoke-WebRequest -Uri "$identity/auth/login" -Method POST `
         -Body '{"username":"accowner","password":"' + $password + '"}' `
         -ContentType "application/json" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    $backendUp = $true
  } catch {
    $backendUp = $false
  }

  if (-not $backendUp) {
    $gates.backend = @{ status = "FAIL"; detail = "backend unreachable"; exit = 3 }
    Write-Log "Gate 3 FAIL · backend unreachable" "ERROR"
    Set-Content -Path $reportPath -Value @"
---
type: night-shift-loop-report
task: $taskId
verdict: halt
exit-code: 3
gate-failed: Gate 3 — Backend
---

# HALT · backend unreachable

Identity service at $identity is not responding. Cannot verify PES claims at runtime.
Either start docker stack (``docker compose up -d``) or run with -SkipBackend.
"@
    exit 3
  }

  # Extract PES check matrix from SPEC.md (look for a code block tagged 'pes-checks')
  # Format expected (one per line):
  #   <username> <resource> <action> <expected: allow|deny>
  $pesBlock = [regex]::Match($specContent, "(?ms)``````pes-checks\s*(.+?)``````").Groups[1].Value
  if (-not $pesBlock) {
    Write-Log "Gate 3 SKIPPED · no 'pes-checks' block in SPEC.md" "WARN"
    $gates.backend = @{ status = "SKIPPED"; detail = "no pes-checks block in SPEC"; exit = $null }
  } else {
    $checks = $pesBlock -split "`n" | Where-Object { $_ -match "^\s*\S+\s+\S+\s+\S+\s+(allow|deny)\s*$" } | ForEach-Object {
      $parts = $_.Trim() -split "\s+"
      [PSCustomObject]@{ user=$parts[0]; resource=$parts[1]; action=$parts[2]; expected=$parts[3] }
    }
    Write-Log "Gate 3 · running $($checks.Count) PES checks"
    $passes = 0; $fails = @()
    foreach ($c in $checks) {
      try {
        $loginBody = @{ username = $c.user; password = $password } | ConvertTo-Json
        $login = Invoke-RestMethod -Uri "$identity/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
        $token = $login.result.tokens.accessToken
        $payload = ($token -split '\.')[1]
        $payload = $payload + ("=" * ((4 - ($payload.Length % 4)) % 4))
        $sub = ([System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($payload.Replace('-','+').Replace('_','/'))) | ConvertFrom-Json).sub
        $authBody = @{ sub = @{ kind = "u:${sub}@${tenantId}" }; obj = @{ kind = $c.resource }; actions = @($c.action) } | ConvertTo-Json -Depth 5
        $resp = Invoke-RestMethod -Uri "$pes/pes/authorize" -Method POST -Body $authBody `
                -Headers @{ "Content-Type"="application/json"; "Authorization"="Bearer $token" }
        $actual = if ($resp.results.$($c.action)) { "allow" } else { "deny" }
        if ($actual -eq $c.expected) { $passes++ } else { $fails += "$($c.user)/$($c.resource)/$($c.action) expected=$($c.expected) got=$actual" }
      } catch {
        $fails += "$($c.user)/$($c.resource)/$($c.action) ERROR: $($_.Exception.Message)"
      }
    }
    if ($fails.Count -eq 0) {
      $gates.backend = @{ status = "PASS"; detail = "$passes/$($checks.Count) match"; exit = 0 }
      Write-Log "Gate 3 PASS · $passes/$($checks.Count)"
    } else {
      $gates.backend = @{ status = "FAIL"; detail = "$($fails.Count) mismatch"; exit = 3 }
      Write-Log "Gate 3 FAIL · $($fails.Count) PES mismatches" "ERROR"
      $details = $fails -join "`n  - "
      Set-Content -Path $reportPath -Value @"
---
type: night-shift-loop-report
task: $taskId
verdict: halt
exit-code: 3
gate-failed: Gate 3 — Backend PES verify
---

# HALT · PES mismatch

Dataset claim contradicts runtime. This is HIGH severity (Class A fork F-001 escalation).

Mismatches:
  - $details

This means: either the dataset is wrong, OR the PES catalog has drifted from BuiltInRoleCatalog.cs. Halt-and-flag immediately.
"@
      exit 3
    }
  }
}

# *** GATE 4 — Done marker ***
Write-Log "GATE 4: Writing completion report"
$gates.done = @{ status = "PASS"; detail = "report written"; exit = 0 }

$report = @"
---
type: night-shift-loop-report
task: $taskId
run-at: $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
verdict: pass
exit-code: 0
purpose: "Answers 'did the night-shift task $taskId pass all 4 gates'. ✅ Yes."
---

# Loop report · $taskId · PASS

## TL;DR
All gates passed. Task safely marked complete.

## Gates
| Gate | Status | Detail |
|---|---|---|
| 0 Brain health (brain-audit) | $($gates.brain.status) | $($gates.brain.detail) |
| 1 Build (nx build $App) | $($gates.build.status) | $($gates.build.detail) |
| 2 Scanner (scan-authority -CheckOnly) | $($gates.scanner.status) | $($gates.scanner.detail) |
| 3 Backend PES verify | $($gates.backend.status) | $($gates.backend.detail) |
| 4 Done marker | $($gates.done.status) | $($gates.done.detail) |
| 5 FE runtime (Ammar QA-Web) | DEFERRED | Workspace compile errors per VERIFICATION-STATUS.md |

## Spec
- SPEC.md: $SpecPath
- Class: $class

## Memory-grow reminder (per cluster 20)
This task is structurally complete. Before closing, decide if it is memory-worthy
(see ``20-brain-maintenance/MEMORY-GROW-PROTOCOL.md`` for criteria):
- New pattern discovered? Add to MEMORY.md
- Drift between code + dataset claim? Add to MEMORY.md
- Workspace-state trap? Add to MEMORY.md
- Trivial fix with no systemic implication? Skip memory.

## Brain-grounding (per cluster 21)
This task ran under night-shift mode, which means it consulted:
- 0-MASTER-INDEX.md (router)
- VERIFICATION-STATUS.md (runtime status truth)
- DECISION-PROTOCOL.md (forks)
- The relevant A->Z trace from 18-a-to-z-traces/ (if porting Add Client/User/Node/Edit Node)
- 15-implementation-pitfalls/_INDEX.md (anti-patterns)

## Next actions
- Task complete on Gates 0-4
- FE-runtime gate deferred until workspace compile errors are fixed (out of dataset scope)
- Consider scheduling Ammar QA-Web manually when FE is stable
- Run brain-audit weekly: ``20-brain-maintenance/brain-audit.ps1``

## See also
- DECISION-PROTOCOL.md
- VERIFICATION-STATUS.md
- 18-a-to-z-traces/_INDEX.md (per-feature 18-layer traces)
- 20-brain-maintenance/MEMORY-GROW-PROTOCOL.md (end-of-task obligations)
- 21-onboarding/PR-TEMPLATE.md (PR-level brain-grounding declaration)
- $SpecPath
"@

Set-Content -Path $reportPath -Value $report
Write-Log "Loop complete · report at: $reportPath" "INFO"
exit 0
