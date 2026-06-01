---
type: pending-question
fork-id: F-007 + F-021 (external tool + new resource without rule)
wave: 1 and 10
halted-at: 2026-05-17T<startup>+03:00
night-shift-batch: forever-wave-2026-05-17
related:
  - "[[../19-night-shift-readiness/NIGHT-SHIFT-MINING-PLAN-2026-05-17]]"
  - "[[../19-night-shift-readiness/DECISION-PROTOCOL]]"
module: infra
feature: prereq-blockers
verification: unverified
last-verified: 2026-05-17
tags: ["#status/open", "#module/infra", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: p0
due: 
blocked-on: [keys-env-missing, skill-md-missing]
---

# Fork: Wave 1 (PRD Drive sync) and Wave 10 (ChatGPT/Gemini strategy pass) both lack prerequisites

## Why halted

Pre-flight discovered two infrastructure blockers BEFORE Wave 1 ran:

1. **`keys.env` not present** anywhere under `C:\Falcon\` — neither at `C:\falcon\Brain\config\keys.env` (Brain reference path) nor at `C:\Falcon\Brain SK\legacy\v7-import\config\keys.env` (the legacy fallback). `test-keys.ps1` exits 1: "keys.env not found ... Copy config\keys.env.example to config\keys.env and fill in your keys."
2. **`brain-skills/business-skills/prd-knowledge/Skill.md` does not exist** on disk — `C:\Falcon\brain-skills\` only contains two skills (`code-skills/falcon-component-creation-skill` + `code-skills/visual-source-of-truth-analysis-skill`). The Skill registry exposes `brain-prd`, `brain-glossary`, `brain-tests`, `brain-tests-all`, `brain-module`, `brain-business`, `brain-gaps`, `ask-chatgpt`, `ask-gemini`, `brain-engage` etc., but none of the backing Skill.md files referenced by `C:\Falcon\CLAUDE.md` exist on disk.

This means:

- **Wave 1 (PRD Version Lock-In)** cannot pull from Google Drive — `brain-prd` skill has no backing implementation in this workspace
- **Wave 10 (Senior AI Strategy Pass)** cannot call ChatGPT or Gemini — `keys.env` is missing
- **Waves 2 + 3 + 8 partially depend** on `brain-glossary` + `brain-tests-all` skill content; would need either the missing Skill.md files or a fallback procedure

## Sources reviewed

- `C:\Falcon\Brain SK\legacy\v7-import\scripts\test-keys.ps1` (exit 1, `keys.env` not found)
- `Glob C:\Falcon\**\keys.env` → 0 hits
- `Glob C:\Falcon\**\keys.env.example` → 0 hits
- `Glob C:\Falcon\brain-skills\**\Skill.md` → 2 hits, all code-skills, no business-skills
- `Glob C:\Falcon\**\brain-prd\**\*.md` → 0 hits
- `C:\Falcon\CLAUDE.md` lines 117-160 (Brain Skills Protocol — declares these skills as installed)

## Plausible answers

### A — Provision keys + skill backings, then run full plan (recommended for true overnight)
- User pastes ChatGPT + Gemini keys into `C:\falcon\Brain\config\keys.env`
- User confirms whether `brain-prd` / `brain-glossary` / `brain-tests-all` backings still live in a different path or need to be re-installed from a previous machine
- Consequences: full 10-wave plan runs as designed · highest knowledge gain · API cost ongoing

### B — Skip waves needing external services, run local-only mining
- Skip Wave 1 (Drive sync) — trust the existing 2026-04-24 sync as the source-of-truth for tonight
- Skip Wave 10 (Strategy pass) — write the morning brief from Claude synthesis only, no ChatGPT/Gemini
- Run Waves 4 (page mining) + 5 (controller deep-dive) + 6 (drift audit) + 7 (component sweep) + 9 (re-graph) in full autonomy mode using only Claude + spawned Adnan/Ammar subagents
- Consequences: PRD-05 Templates stays at 25% mined tonight · no fresh strategy notes · all local mining still completes · Drive sync queued for next session with keys

### C — Defer entire mining until keys + skills resolved
- Halt the whole forever-wave until user provisions credentials
- Consequences: no progress overnight · safest

## Recommended question for the human

**"For tonight's mining run, do you want to (A) provide ChatGPT + Gemini API keys now and confirm where `brain-prd` is installed, or (B) proceed local-only with the existing 2026-04-24 PRD sync and skip Wave 1 + Wave 10 tonight?"**

## Blast radius

- **If A**: full plan runs. PRD-05 Templates closes from 25% → 100%. Morning brief includes strategy pass. ~10-14h of mining wall-clock.
- **If B**: Waves 4-9 complete tonight. PRD-05 stays 25% (deferred). No strategy brief — replaced with structured local summary. ~6-8h of mining wall-clock. Wave 1 + 10 queued for next session.
- **If C**: nothing happens overnight.

## What proceeds in parallel regardless

Even under option B, these run unblocked:
- Wave 2 PRD Deep Read against the existing 2026-04-24 local sync (BR-* extraction, entity reconciliation, V-rule audit)
- Wave 4 Page Mining Catch-Up (13 skeletal pages → full folders)
- Wave 5 Backend Controller Deep-Dive (per-service Ammar fan-out)
- Wave 6 Drift Audit (`scan-authority.ps1` watching 67 files)
- Wave 7 Frontend Component Gap Sweep
- Wave 9 Obsidian Re-Graph

## Tasks-plugin tracking

- [ ] [[WAVE-1-AND-10-PREREQ-BLOCKERS-2026-05-17]] Fork: Wave 1 (PRD Drive sync) and Wave 10 (ChatGPT/Gemini strategy pass) both lack prerequisites ⏫ #blocked-on/keys-env-missing #blocked-on/skill-md-missing
