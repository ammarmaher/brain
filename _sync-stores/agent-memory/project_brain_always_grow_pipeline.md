---
name: Brain always-grow pipeline (ChatGPT → Gemini → journal)
description: Autonomous nightly Brain pipeline that analyzes PRDs, polishes via Gemini, and appends to an audit-only knowledge journal
type: project
originSessionId: f1afca13-882b-4599-8532-38124ed50b1c
---
The Falcon Brain at `C:\falcon\Brain\` runs an autonomous learning loop on every cron tick (logon + daily 02:00 via `FalconBrainNightlyGapScan`).

**Why:** User asked Brain to "always work on analyzing data and make sure knowledge always grows" on 2026-05-01. The original `nightly-gap-scan.ps1` was a stub that only wrote a TODO placeholder.

**How to apply:** When working on Brain analysis, treat these scripts as the canonical pipeline:

| Script | Role |
|---|---|
| `scripts/nightly-gap-scan.ps1` | Cron entry point — loops every PRD module, calls ChatGPT for draft gap report, hands off to Gemini for polish, ticks the journal |
| `scripts/ask-chatgpt.ps1` | OpenAI call (UTF-8 byte body for Arabic PRD support) |
| `scripts/ask-gemini.ps1` | Gemini call (UTF-8 byte body) |
| `scripts/gemini-polish.ps1` | Verification layer — rewrites drafts to strict format `- [SEVERITY] Title — Description (Resolution: PRD/Wiki/Code/Human-decision)` |
| `scripts/growth-tick.ps1` | Append-only journal writer; updates `analysis/L0-summary/knowledge-journal.md` + `analysis/index.json` |
| `scripts/gemini-artifacts.ps1` | Per-module dev-handbook (Mermaid + tables + acceptance criteria) and user-guide (plain language + decision tree). Gemini primary, ChatGPT fallback on 429 |

**Artifact contract** — every module per cron tick produces under `Brain/analysis/L1-abstraction/<date>/<module>/`:
- `dev-handbook.md` — Module Purpose / Architecture Overview / Domain Model / Key Flows / State Transitions / Permission Matrix / API Contract Summary / Acceptance Criteria / Open Questions
- `user-guide.md` — What This Module Does / Who Uses It / Common Tasks / Decision Tree / Glossary / FAQ

**Mermaid fence trap** — PowerShell here-strings mangle `` ``` ``. Use `$fence = [string]([char]96)*3` then `${fence}mermaid` in prompts; never wrap `${fence}` in inline-code backticks.

**Rate-limit handling** — Gemini free tier has daily AND per-minute quotas. `ask-gemini.ps1` retries 429/503 with exponential backoff (5/10/20/40/80s). When daily quota truly exhausts, `gemini-artifacts.ps1` auto-falls back to `ask-chatgpt.ps1`. Nightly scan sleeps 5s between modules to stay under 15 RPM.

**Strict contract** — Gemini polish enforces:
- One bullet per finding, hyphen-bullet only (no `*`), no bold/brackets/sub-bullets
- Severity sorted: CRITICAL → HIGH → MEDIUM → LOW
- Final line: `Verdict: COMPLETED-CLEAN` or `Verdict: COMPLETED-WITH-GAPS (N critical / N high)`

**Known PowerShell 5.1 trap:** `Invoke-RestMethod` defaults to ISO-8859-1 — non-ASCII (Arabic) corrupts the JSON body and OpenAI/Gemini reject as 400. Always send `[System.Text.Encoding]::UTF8.GetBytes($json)` as the `-Body`.

Knowledge grows by appending to `Brain/analysis/L0-summary/knowledge-journal.md` — never edit historical entries.
