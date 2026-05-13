# *** gemini-artifacts.ps1 ***
# *** Generate professional dev handbook + end-user guide for one module. ***
# *** Inputs: module name, latest-prd.md path, polished gap-report.md path. ***
# *** Outputs (under Brain/Brain Generated/analysis/L1-abstraction/<date>/<module>/): ***
# ***   dev-handbook.md   — Mermaid diagrams + tables + acceptance criteria for engineers ***
# ***   user-guide.md     — plain-language task walkthroughs + decision trees for end users ***
# *** Gemini IS the verification mindset — output is review-grade. ***
# *** PowerShell 5.1 compatible. Exit 0 always (cron-safe). ***

[CmdletBinding()]
param(
    [Parameter(Mandatory)] [string]$Module,
    [Parameter(Mandatory)] [string]$PrdPath,
    [string]$GapReportPath,
    [string]$DateStamp = (Get-Date -Format 'yyyy-MM-dd'),
    [switch]$Quiet
)

$ErrorActionPreference = 'Continue'

$here       = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$brainRoot  = Split-Path $here -Parent
$askGemini  = Join-Path $here 'ask-gemini.ps1'
$askChatGpt = Join-Path $here 'ask-chatgpt.ps1'

if (-not (Test-Path -LiteralPath $askGemini)) {
    Write-Warning '[gemini-artifacts] ask-gemini.ps1 missing'
    exit 0
}

# *** Helper: try Gemini first, fall back to ChatGPT if Gemini returns nothing or rate-limits. ***
function Invoke-Mindset {
    param([string]$Prompt, [switch]$Quiet)
    $output = $null
    try {
        if ($Quiet) {
            $output = & $askGemini -Prompt $Prompt -Quiet 2>$null
        } else {
            $output = & $askGemini -Prompt $Prompt 2>$null
        }
    } catch {
        Write-Warning ("[gemini-artifacts] Gemini failed: {0}" -f $_.Exception.Message)
    }

    if ([string]::IsNullOrWhiteSpace($output) -and (Test-Path -LiteralPath $askChatGpt)) {
        Write-Warning '[gemini-artifacts] Falling back to ChatGPT'
        try {
            if ($Quiet) {
                $output = & $askChatGpt -Prompt $Prompt -Model 'gpt-4o-mini' -Quiet 2>$null
            } else {
                $output = & $askChatGpt -Prompt $Prompt -Model 'gpt-4o-mini' 2>$null
            }
        } catch {
            Write-Warning ("[gemini-artifacts] ChatGPT fallback also failed: {0}" -f $_.Exception.Message)
        }
    }
    return $output
}
if (-not (Test-Path -LiteralPath $PrdPath)) {
    Write-Warning ("[gemini-artifacts] PRD missing: {0}" -f $PrdPath)
    exit 0
}

$prdText = Get-Content -LiteralPath $PrdPath -Raw -ErrorAction SilentlyContinue
if ([string]::IsNullOrWhiteSpace($prdText)) { exit 0 }
if ($prdText.Length -gt 14000) { $prdText = $prdText.Substring(0, 14000) + "`n`n[... truncated ...]" }

$gapText = ''
if ($GapReportPath -and (Test-Path -LiteralPath $GapReportPath)) {
    $gapText = Get-Content -LiteralPath $GapReportPath -Raw -ErrorAction SilentlyContinue
    if ($gapText.Length -gt 6000) { $gapText = $gapText.Substring(0, 6000) }
}

# *** Output directory: Brain/Brain Generated/analysis/L1-abstraction/<date>/<module>/ ***
$outDir = Join-Path $brainRoot ("Brain Generated\analysis\L1-abstraction\{0}\{1}" -f $DateStamp, $Module)
if (-not (Test-Path -LiteralPath $outDir)) {
    try { New-Item -ItemType Directory -Path $outDir -Force | Out-Null } catch { exit 0 }
}

# *** Triple-backtick fence as a variable so PowerShell here-strings don't mangle it. ***
$fence = [string]([char]96) + [string]([char]96) + [string]([char]96)

# *** ===== Dev Handbook contract — Mermaid + tables + acceptance criteria ===== ***
$devContract = @"
You are the Falcon Gemini verification mindset. Produce a professional Dev Handbook for module '$Module' that any engineer can pick up and start work from.

Hard rules:
1. Output ONLY markdown. No preamble, no closing remarks, no fenced code-blocks around the entire document.
2. Use Mermaid for every diagram, each wrapped in a fenced ${fence}mermaid block (open with three backticks then ``mermaid``, close with three backticks). Use only valid Mermaid syntax (graph TD, sequenceDiagram, stateDiagram-v2, classDiagram, erDiagram).
3. Every table must be a real GitHub-flavoured markdown table.
4. Do NOT invent endpoints, DTOs, or rules not implied by the PRD or gap report. Mark unknowns explicitly: ``(TBD — see gap report)``.
5. Use the exact section order below. Do not add or remove top-level headings.

Required sections (use these literal H2 headings):

# Dev Handbook — $Module — $DateStamp

## Module Purpose
One paragraph in precise business English describing what the module is responsible for.

## Architecture Overview
A Mermaid ``graph TD`` diagram showing this module's components and how it interacts with neighbouring services.

## Domain Model
A Mermaid ``classDiagram`` or ``erDiagram`` showing entities, key fields, and relationships.

## Key Flows
For each main workflow (3-5 flows), output:
### Flow: <name>
- **Trigger:** ...
- **Preconditions:** ...
- **Postconditions:** ...
A Mermaid ``sequenceDiagram`` showing actors and messages.

## State Transitions
A Mermaid ``stateDiagram-v2`` for the primary status field, plus a markdown table:
| From | To | Triggered by | Guard |

## Permission Matrix
A markdown table:
| Role | Action | Allowed | Notes |

## API Contract Summary
A markdown table:
| Endpoint | Method | Purpose | Auth | Notes |

## Acceptance Criteria
A bulleted checklist (- [ ]) — one criterion per line, written in Given/When/Then form.

## Open Questions
Bullets only. Each maps to a gap from the gap report when applicable: ``(see gap: <title>)``.

PRD:
$prdText

GAP REPORT:
$gapText
"@

# *** ===== End-User Guide contract — plain language + decision trees ===== ***
$userContract = @"
You are the Falcon Gemini verification mindset. Produce a professional End-User Guide for module '$Module' that any non-technical end user can follow to get their work done in the system.

Hard rules:
1. Output ONLY markdown. No preamble, no closing remarks.
2. Plain business English. No jargon. No code. Replace technical terms with the user-facing label.
3. Use Mermaid for every decision tree, wrapped in a fenced ${fence}mermaid block with ``flowchart TD``.
4. Tables must be real markdown tables.
5. Use the exact section order below. Do not skip sections.

Required sections (use these literal H2 headings):

# User Guide — $Module — $DateStamp

## What This Module Does
One paragraph in everyday language explaining the module from the user's point of view.

## Who Uses It
A markdown table:
| Role | What they can do here | What they cannot do |

## Common Tasks
For each task (4-6 tasks), output:
### Task: <name>
- **When to do this:** ...
- **What you need before you start:** ...
**Steps:**
1. ...
2. ...
**What you will see when it works:** ...
**What to do if something goes wrong:** ...

## Decision Tree — "What should I do next?"
A Mermaid ``flowchart TD`` that branches across the most common user questions and points to the right Task above.

## Glossary
A markdown table of every business term used in this guide:
| Term | Plain meaning |

## Frequently Asked Questions
3-5 Q&A pairs as plain text — each ``**Q:**`` followed by ``**A:**``.

PRD:
$prdText

GAP REPORT:
$gapText
"@

# *** ===== Generate Dev Handbook ===== ***
$devOutput = Invoke-Mindset -Prompt $devContract -Quiet:$Quiet
if (-not [string]::IsNullOrWhiteSpace($devOutput)) {
    $devOutput = $devOutput -replace '^\s*```(?:markdown|md)?\s*\r?\n', ''
    $devOutput = $devOutput -replace '\r?\n```\s*$', ''
    $devPath = Join-Path $outDir 'dev-handbook.md'
    try {
        Set-Content -LiteralPath $devPath -Value $devOutput -Encoding UTF8
        Write-Host ("[gemini-artifacts] Dev handbook: {0}" -f $devPath)
    } catch {
        Write-Warning ("[gemini-artifacts] Could not write dev-handbook: {0}" -f $_.Exception.Message)
    }
} else {
    Write-Warning ("[gemini-artifacts] Empty dev-handbook for {0}" -f $Module)
}

# *** ===== Generate End-User Guide ===== ***
$userOutput = Invoke-Mindset -Prompt $userContract -Quiet:$Quiet
if (-not [string]::IsNullOrWhiteSpace($userOutput)) {
    $userOutput = $userOutput -replace '^\s*```(?:markdown|md)?\s*\r?\n', ''
    $userOutput = $userOutput -replace '\r?\n```\s*$', ''
    $userPath = Join-Path $outDir 'user-guide.md'
    try {
        Set-Content -LiteralPath $userPath -Value $userOutput -Encoding UTF8
        Write-Host ("[gemini-artifacts] User guide:   {0}" -f $userPath)
    } catch {
        Write-Warning ("[gemini-artifacts] Could not write user-guide: {0}" -f $_.Exception.Message)
    }
} else {
    Write-Warning ("[gemini-artifacts] Empty user-guide for {0}" -f $Module)
}

exit 0
