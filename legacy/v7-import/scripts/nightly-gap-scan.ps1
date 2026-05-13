# *** nightly-gap-scan.ps1 ***
# *** Phase E wrapper: triggers the business-gap-detection skill via a dated run record. ***
# *** Cron contract: this script ONLY records the invocation event + writes the stub. ***
# *** Adnan/Claude performs the actual gap analysis when invoked against the run record. ***
# *** PowerShell 5.1 compatible. No '??', no ternary, no '&&'. Exit 0 always (cron). ***

[CmdletBinding()]
param()

$ErrorActionPreference = 'Continue'

# *** Resolve Brain root from this script's location (scripts\..). ***
$here       = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$brainRoot  = Split-Path $here -Parent
$skillsRoot = Join-Path (Split-Path $brainRoot -Parent) 'brain-skills'

# *** Canonical paths the cron contract owns. ***
$skillFile      = Join-Path $skillsRoot 'business-skills\business-gap-detection\Skill.md'
$suggestionsDir = Join-Path $brainRoot 'Brain Generated\suggestions'
$analysisIndex  = Join-Path $brainRoot 'Brain Generated\analysis\index.json'

# *** Date stamps (local time for filename, UTC for record fields). ***
$dateStamp  = Get-Date -Format 'yyyy-MM-dd'
$timeStamp  = Get-Date -Format 'HH:mm:ss'
$startedUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')

$runFile = Join-Path $suggestionsDir ($dateStamp + '.md')
$runTemp = $runFile + '.tmp'

# *** Ensure suggestions dir exists. ***
if (-not (Test-Path -LiteralPath $suggestionsDir)) {
    try {
        New-Item -ItemType Directory -Path $suggestionsDir -Force | Out-Null
    } catch {
        Write-Warning ("[nightly-gap-scan] Could not create suggestions dir: {0}" -f $_.Exception.Message)
        exit 0
    }
}

# *** Verify the source skill is reachable; warn (do not fail) if missing. ***
$skillStatus = 'OK'
if (-not (Test-Path -LiteralPath $skillFile)) {
    Write-Warning ("[nightly-gap-scan] Skill.md not found at {0}" -f $skillFile)
    $skillStatus = 'MISSING'
}

# *** Build the dated run record (markdown). Status = INITIATED until Adnan acts on it. ***
$lines = @()
$lines += '# Nightly Gap Scan Run'
$lines += ''
$lines += ('- Date:           ' + $dateStamp)
$lines += ('- Time started:   ' + $timeStamp + ' (local)')
$lines += ('- Started (UTC):  ' + $startedUtc)
$lines += '- Status:         INITIATED'
$lines += '- Trigger:        Windows Task Scheduler (FalconBrainNightlyGapScan)'
$lines += ('- Skill source:   ' + $skillFile)
$lines += ('- Skill status:   ' + $skillStatus)
$lines += ''
$lines += '## TODO (for Adnan/Claude when activating this record)'
$lines += ''
$lines += '1. Read the activation rules in `business-skills/business-gap-detection/Skill.md`.'
$lines += '2. Cross-reference PRD `latest-prd.md` against module `understanding.md` for every active module.'
$lines += '3. Diff Wiki topics against PRD requirements; flag contradictions.'
$lines += '4. Validate every domain term against `domain-glossary` (no undefined terms).'
$lines += '5. Cross-check `test-case-authoring/coverage-matrix.md` against PRD requirements.'
$lines += '6. Emit per-module `gap-report.md` files under `business-gap-detection/modules/<slug>/`.'
$lines += '7. Append a summary to this file under a new `## Findings` section.'
$lines += '8. Set the `Status` field above to one of: COMPLETED-CLEAN | COMPLETED-WITH-GAPS | FAILED.'
$lines += '9. If any HIGH-severity gap exists, set the coding gate to CLOSED and notify the user.'
$lines += ''
$lines += '## Findings'
$lines += ''
$lines += '_Pending — populated when the skill is activated against this run record._'
$lines += ''

$body = ($lines -join [Environment]::NewLine) + [Environment]::NewLine

# *** Atomic write: temp file then rename. Skip overwrite if today's file already exists. ***
if (Test-Path -LiteralPath $runFile) {
    Write-Output ("[nightly-gap-scan] Run file already exists for {0}; skipping rewrite." -f $dateStamp)
} else {
    try {
        [System.IO.File]::WriteAllText($runTemp, $body, [System.Text.UTF8Encoding]::new($false))
        Move-Item -LiteralPath $runTemp -Destination $runFile -Force
        Write-Output ("[nightly-gap-scan] Wrote {0}" -f $runFile)
    } catch {
        Write-Warning ("[nightly-gap-scan] Failed to write run file: {0}" -f $_.Exception.Message)
        if (Test-Path -LiteralPath $runTemp) { Remove-Item -LiteralPath $runTemp -Force -ErrorAction SilentlyContinue }
        exit 0
    }
}

# *** Append to analysis index if it already exists. Otherwise warn and move on. ***
if (Test-Path -LiteralPath $analysisIndex) {
    try {
        $relativeOutput = 'L0-summary/' + $dateStamp + '.md'
        $entry = [ordered]@{
            type      = 'nightly-gap-scan'
            level     = 'L0'
            outputs   = @($relativeOutput)
            timestamp = $startedUtc
            summary   = 'Nightly scan triggered'
        }

        $existingRaw = Get-Content -LiteralPath $analysisIndex -Raw -ErrorAction Stop
        $parsed = $null
        if (-not [string]::IsNullOrWhiteSpace($existingRaw)) {
            $parsed = $existingRaw | ConvertFrom-Json -ErrorAction Stop
        }

        # *** Coerce existing payload into an array and append. ***
        $list = New-Object System.Collections.ArrayList
        if ($null -ne $parsed) {
            if ($parsed -is [System.Array]) {
                foreach ($item in $parsed) { [void]$list.Add($item) }
            } else {
                [void]$list.Add($parsed)
            }
        }
        [void]$list.Add($entry)

        $indexTemp = $analysisIndex + '.tmp'
        $json = $list | ConvertTo-Json -Depth 8
        [System.IO.File]::WriteAllText($indexTemp, $json, [System.Text.UTF8Encoding]::new($false))
        Move-Item -LiteralPath $indexTemp -Destination $analysisIndex -Force
        Write-Output ("[nightly-gap-scan] Appended entry to {0}" -f $analysisIndex)
    } catch {
        Write-Warning ("[nightly-gap-scan] Could not update analysis index: {0}" -f $_.Exception.Message)
    }
} else {
    Write-Warning ("[nightly-gap-scan] analysis index not present at {0}; skipping append." -f $analysisIndex)
}

# *** Phase F: invoke ChatGPT mindset for the actual gap analysis. ***
# *** Reads each module's latest-prd.md + understanding.md, asks ChatGPT to flag gaps, ***
# *** writes per-module gap-report.md, then ticks the knowledge journal. ***
$prdRoot         = Join-Path $skillsRoot 'business-skills\prd-knowledge\modules'
$gapOutRoot      = Join-Path $skillsRoot 'business-skills\business-gap-detection\modules'
$askChatGpt      = Join-Path $here 'ask-chatgpt.ps1'
$growthTick      = Join-Path $here 'growth-tick.ps1'
$geminiPolish    = Join-Path $here 'gemini-polish.ps1'
$geminiArtifacts = Join-Path $here 'gemini-artifacts.ps1'

$totalNew      = 0
$totalResolved = 0
$producedFiles = @()

if ((Test-Path -LiteralPath $prdRoot) -and (Test-Path -LiteralPath $askChatGpt)) {
    $modules = Get-ChildItem -LiteralPath $prdRoot -Directory -ErrorAction SilentlyContinue
    foreach ($mod in $modules) {
        $prdFile = Join-Path $mod.FullName 'latest-prd.md'
        if (-not (Test-Path -LiteralPath $prdFile)) { continue }

        $prdText = Get-Content -LiteralPath $prdFile -Raw -ErrorAction SilentlyContinue
        if ([string]::IsNullOrWhiteSpace($prdText)) { continue }
        if ($prdText.Length -gt 12000) { $prdText = $prdText.Substring(0, 12000) + "`n`n[... truncated for nightly scan ...]" }

        $prompt = @"
You are the Falcon business-gap-detection mindset. Read the PRD content below for module '$($mod.Name)' and produce a concise gap report.

Output format (markdown):
# Gap Report — $($mod.Name) — $dateStamp

## Summary
<one-sentence verdict>

## Gaps Found
- [SEVERITY] <short title> — <one-line description>
(repeat; use CRITICAL/HIGH/MEDIUM/LOW)

## Resolved Since Last Scan
- (or 'None')

## Open Questions
- (or 'None')

PRD CONTENT:
$prdText
"@

        try {
            $response = & $askChatGpt -Prompt $prompt -Quiet 2>$null
            if ([string]::IsNullOrWhiteSpace($response)) { continue }

            $modOutDir = Join-Path $gapOutRoot $mod.Name
            if (-not (Test-Path -LiteralPath $modOutDir)) {
                New-Item -ItemType Directory -Path $modOutDir -Force | Out-Null
            }
            $reportPath = Join-Path $modOutDir 'gap-report.md'
            Set-Content -LiteralPath $reportPath -Value $response -Encoding UTF8

            # *** Gemini verification + polish: rewrite to professional contract. ***
            if (Test-Path -LiteralPath $geminiPolish) {
                try {
                    & $geminiPolish -InputPath $reportPath -Kind 'gap-report' -Quiet | Out-Null
                    $response = Get-Content -LiteralPath $reportPath -Raw -ErrorAction SilentlyContinue
                } catch {
                    Write-Warning ("[nightly-gap-scan] gemini-polish failed for {0}: {1}" -f $mod.Name, $_.Exception.Message)
                }
            }

            $newCount = ([regex]::Matches($response, '(?im)^\s*[-*]\s+\**\s*\[?\s*(CRITICAL|HIGH|MEDIUM|LOW)\b')).Count
            $resolvedSection = [regex]::Match($response, '(?is)## Resolved Since Last Scan(.*?)(##|\z)')
            $resolvedCount = 0
            if ($resolvedSection.Success) {
                $resolvedCount = ([regex]::Matches($resolvedSection.Groups[1].Value, '(?im)^\s*[-*]\s+(?!None)')).Count
            }

            $totalNew      += $newCount
            $totalResolved += $resolvedCount
            $producedFiles += $reportPath
            Write-Output ("[nightly-gap-scan] Gap report written: {0} (+{1} / -{2})" -f $reportPath, $newCount, $resolvedCount)

            # *** Gemini artifact generation: dev handbook + end-user guide with diagrams + tables. ***
            if (Test-Path -LiteralPath $geminiArtifacts) {
                try {
                    & $geminiArtifacts -Module $mod.Name -PrdPath $prdFile -GapReportPath $reportPath -DateStamp $dateStamp -Quiet | Out-Null
                    $artifactDir = Join-Path $brainRoot ("Brain Generated\analysis\L1-abstraction\{0}\{1}" -f $dateStamp, $mod.Name)
                    $devHb = Join-Path $artifactDir 'dev-handbook.md'
                    $userGd = Join-Path $artifactDir 'user-guide.md'
                    if (Test-Path -LiteralPath $devHb)  { $producedFiles += $devHb }
                    if (Test-Path -LiteralPath $userGd) { $producedFiles += $userGd }
                } catch {
                    Write-Warning ("[nightly-gap-scan] gemini-artifacts failed for {0}: {1}" -f $mod.Name, $_.Exception.Message)
                }
            }

            # *** Mirror this module's outputs into Brain Generated\analysis\L2-business\by-module\<module>\ ***
            try {
                $byModuleDir = Join-Path $brainRoot ("Brain Generated\analysis\L2-business\by-module\{0}" -f $mod.Name)
                if (-not (Test-Path -LiteralPath $byModuleDir)) {
                    New-Item -ItemType Directory -Path $byModuleDir -Force | Out-Null
                }
                if (Test-Path -LiteralPath $reportPath) {
                    Copy-Item -LiteralPath $reportPath -Destination (Join-Path $byModuleDir 'gap-report.md') -Force
                }
                $modCatalog = Join-Path $skillsRoot ("business-skills\module-catalog\modules\{0}\understanding.md" -f $mod.Name)
                if (Test-Path -LiteralPath $modCatalog) {
                    Copy-Item -LiteralPath $modCatalog -Destination (Join-Path $byModuleDir 'module-understanding.md') -Force
                }
                $prdUnderstand = Join-Path $mod.FullName 'understanding.md'
                if (Test-Path -LiteralPath $prdUnderstand) {
                    Copy-Item -LiteralPath $prdUnderstand -Destination (Join-Path $byModuleDir 'prd-understanding.md') -Force
                }
                $testCases = Join-Path $mod.FullName 'test-cases.md'
                if (Test-Path -LiteralPath $testCases) {
                    Copy-Item -LiteralPath $testCases -Destination (Join-Path $byModuleDir 'test-cases.md') -Force
                }
            } catch {
                Write-Warning ("[nightly-gap-scan] by-module mirror failed for {0}: {1}" -f $mod.Name, $_.Exception.Message)
            }

            # *** Throttle: stay under Gemini free-tier 15 RPM. 5s gap between modules. ***
            Start-Sleep -Seconds 5
        } catch {
            Write-Warning ("[nightly-gap-scan] Module '{0}' failed: {1}" -f $mod.Name, $_.Exception.Message)
        }
    }

    # *** Update the run-record status + findings. ***
    try {
        $statusLine = if ($totalNew -gt 0) { 'COMPLETED-WITH-GAPS' } else { 'COMPLETED-CLEAN' }
        $runText = Get-Content -LiteralPath $runFile -Raw
        $runText = $runText -replace 'Status:\s+INITIATED', ('Status:         ' + $statusLine)
        $findings = "## Findings`r`n`r`nNightly run completed at $startedUtc`r`n`r`n- Modules scanned: $($modules.Count)`r`n- New findings (this run): $totalNew`r`n- Resolved since last scan: $totalResolved`r`n- Reports: $($producedFiles.Count)`r`n"
        $runText = $runText -replace '_Pending.*?activated against this run record\._', $findings
        Set-Content -LiteralPath $runFile -Value $runText -Encoding UTF8
    } catch {
        Write-Warning ("[nightly-gap-scan] Could not update run-record status: {0}" -f $_.Exception.Message)
    }

    # *** Tick the knowledge journal so growth is visible. ***
    if (Test-Path -LiteralPath $growthTick) {
        try {
            $summary = "Nightly gap scan: $($modules.Count) modules, +$totalNew new, -$totalResolved resolved"
            & $growthTick -RunId ("nightly-gap-scan-" + $dateStamp) -Source 'nightly-gap-scan.ps1' -Summary $summary -Outputs $producedFiles -NewFindings $totalNew -ResolvedFindings $totalResolved -Level 'L2' | Out-Null
        } catch {
            Write-Warning ("[nightly-gap-scan] growth-tick failed: {0}" -f $_.Exception.Message)
        }
    }
} else {
    Write-Warning '[nightly-gap-scan] PRD root or ask-chatgpt.ps1 unavailable; skipping analysis phase (run-record stub still written).'
}

# *** Cron contract: never propagate failures. ***
exit 0
