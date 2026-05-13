*** Brain SK Frontend Component-Knowledge sub-domain ***
*** Path: domains/frontend/component-knowledge/SKILL.md ***
*** Created: 2026-05-13 ***

# Frontend Component-Knowledge Sub-domain

This sub-domain owns Brain SK's understanding of every Falcon Angular component in the active workspace. It contains TWO skills:

1. **Deep-build** — the original seven-agent parallel investigation that produces full per-component dossiers (6 files per component) + 10 master synthesis files.
2. **Incremental-scan** — the lightweight runner that decides which components have changed and only re-scans those.

Use `incremental-scan` BEFORE any deep build. It owns the metadata, edit tracking, and per-run reports.

## Sub-skills

| Skill | Path | Purpose |
|---|---|---|
| **Incremental Scan** | `incremental-scan/SKILL.md` | Detect changed/new components, refresh edit-tracking, run reports + PDF, sync to Brain SK + Git |
| Deep Build (legacy, pre-incremental) | — | The seven-agent parallel investigation. Triggered by incremental-scan only when components have changed |

## When to use which

| Trigger | Use |
|---|---|
| "scan components", "what changed", "edit tracking" | **incremental-scan** |
| "build deep component knowledge", "first-time build", "rebuild from scratch" | **deep-build** (which incremental-scan delegates to per-component) |
| Before any component-knowledge recommendation | **incremental-scan** first |

## Canonical paths

- Active source: `C:\Falcon\Falcon\falcon-web-platform-ui`
- Canonical knowledge output: `C:\Falcon\Brain Outputs\understanding\frontend`
- Per-component folder: `…\understanding\frontend\components\<component-name>\`
- Scan metadata: `…\understanding\frontend\_scan-state\component-scan-metadata.json`
- Per-run reports: `C:\Falcon\Brain Outputs\reports\component-scans\<YYYY-MM-DD-HHmm>\`

## Hard rules

- Active source is the only truth. Off-limits: deprecated / old / WebstormProjects duplicates / node_modules / dist / demos.
- Every scan report MUST include last-edited-user, last-edited-date/time, changed files, scan status, scan reason, skip reason.
- Component-knowledge folder writes always include all 6 mandatory files: `OVERVIEW.md`, `API.md`, `USAGE.md`, `TOKENS.md`, `GAPS_AND_UPGRADES.md`, `DECISION.md`.
- Additive sync only. No `robocopy /MIR`.
- Never commit secrets / plugin data / temp files.
