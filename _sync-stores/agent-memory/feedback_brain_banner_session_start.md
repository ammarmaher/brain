---
name: Brain dual banner + skill self-check on every Claude Code SessionStart
description: SessionStart hook prints two banners — Falcon Brain v1.0 identity + System Integrity Check with green/red skill self-check — at the start of every Claude session
type: feedback
originSessionId: a26d80da-eafa-4a52-af73-9f7abc7d3f70
---
Every Claude Code session opens with two stacked banners rendered by `C:\falcon\Brain\scripts\show-banner.ps1`.

**Why:** User asked (2026-05-03) for visual confirmation that the Brain identity is loaded AND that all skills are intact every time Claude starts. Banner 1 = identity. Banner 2 = real-time integrity check (no false claims).

**Banner 1 — Falcon Brain v1.0 identity:**
- BRAIN block letters (cyan)
- "F A L C O N — V E R S I O N 1 . 0" tagline (green)
- Three mindset cards (ChatGPT magenta · Claude cyan · Gemini blue)
- "Powered by Ammar" (yellow) + SK block-letter signature (yellow)
- Static — same every session.

**Banner 2 — System Integrity Check:**
- Two-column dashboard (left = ORCHESTRATION/MINDSETS/CODE STANDARDS/PROTOCOLS · right = BUSINESS PIPELINE/FRONT-END/UNIVERSAL BRAIN)
- 25 skills checked via `Test-Path` at runtime
- `▣` glyph rendered **green** if the skill file exists, **red** if missing
- Footer: "ALL SYSTEMS ONLINE · 25 / 25 · READY" (green) when all pass; "WARN — N MISSING · X / 25 · READY" (yellow) on any failure
- Dynamic — reflects current disk state every session.

**Wiring:**
- Hook: `C:\Users\Pc5\.claude\settings.json` → `SessionStart` entry 0 (user-level, fires globally for every Claude Code session in any project).
- Hook command: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:/falcon/Brain/scripts/show-banner.ps1"` (timeout 5s).
- Script encoding: UTF-8 with BOM (required so Windows PowerShell 5.1 reads Unicode glyphs `║ ▣ ─ ╔ ╚` correctly).
- Color rendering: `Write-Host -ForegroundColor` writes ANSI color codes that the user's terminal renders directly. Claude Code's tool-output transport strips the colors, but they appear in the user's actual terminal.

**Files involved:**
- `C:\falcon\Brain\scripts\show-banner.ps1` — single script for both banners (UTF-8 BOM, ~12.9KB)
- `C:\falcon\Brain\assets\brain-banner.txt` — legacy plain-text banner (still on disk but no longer the active source; show-banner.ps1 hard-codes the banner art for color control)
- `C:\Users\Pc5\.claude\settings.json` — SessionStart hook
- `C:\falcon\Brain\Skill.md` — "Activation banner (mandatory on every session)" rule documented at top

**Skill registry (25 skills):**
- 3 orchestration: master-orchestrator, brain, sound-announcer
- 3 mindsets: chatgpt-strategic, claude-tactical, gemini-verification
- 1 code: falcon-project-standards
- 5 protocols: MODEL_HANDOFF, QUALITY_GATES, GET_SHIT_DONE, TAILWIND_FIRST, CHART_TABLE_DIFF
- 7 business: wiki-knowledge, prd-knowledge, domain-glossary, module-catalog, business-gap-detection, test-case-authoring, business-pipeline
- 5 front-end: official-angular, angular-tailwind-primeng, angular-upgrade, nx-workspace, nx-module-federation
- 1 universal: universal-brain

**Agent behavior:**
- Do NOT re-print either banner mid-session unless the user explicitly asks.
- The banner is purely cosmetic confirmation — it does NOT auto-load skill content. Skill content still loads on trigger phrases (`use brain`, `take latest from PRD`, etc.) or when the agent reads SKILL.md files.

**To add/remove a skill from the check:**
1. Add path to `$skillFiles` in show-banner.ps1
2. Add an entry to `$L` (left column) or `$R` (right column) with `Kind="skill"` + matching `Key`
3. Re-save with UTF-8 BOM if Windows PowerShell stops parsing it

**To change either banner art:** edit show-banner.ps1 directly. After any edit, re-save with UTF-8 BOM:
```powershell
$p = "C:\falcon\Brain\scripts\show-banner.ps1"
$c = Get-Content $p -Raw -Encoding UTF8
[System.IO.File]::WriteAllText($p, $c, (New-Object System.Text.UTF8Encoding $true))
```

**To disable for a session:** comment out the first `SessionStart` hook entry in `~/.claude/settings.json`.
