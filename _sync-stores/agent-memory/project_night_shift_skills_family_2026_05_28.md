---
name: project-night-shift-skills-family-2026-05-28
description: "Night Shift skill family — 4 specialized autonomous modes (FE bugs / feature / brain / backend) + router + shared CONTRACT, all wrapping the existing 5-gate NIGHT-SHIFT-LOOP.ps1. Each mode emits a before/after report with percentages + one concrete diff example. Delivered 2026-05-28."
metadata: 
  node_type: memory
  type: project
  status: delivered
  date: 2026-05-28
  originSessionId: e5b12899-abf1-4571-b2a9-9fc48cd503b4
---

# Night Shift Skill Family — 4 modes + router

## What was built

6 new skills under `C:\Falcon\.claude\skills\` wrapping the existing `19-night-shift-readiness/NIGHT-SHIFT-LOOP.ps1` (5 gates: brain health → build → scanner → PES → done marker).

| Skill | Triggers | Mode focus |
|---|---|---|
| `night-shift` | "night shift" without mode hint | Router — classifies + delegates |
| `night-shift-fe-bugs` | "FE bugs", "deep dive UI overnight", "/night-shift-fe-bugs" | Component graph fan-out: fix component + every consumer in same wave |
| `night-shift-feature` | "build feature X overnight", "scrape and build", "/night-shift-feature" | Investigate (brain/PRD/wiki/web) → SPEC-PROTOCOL → wave plan → ship |
| `night-shift-brain` | "enhance brain", "fill graph gaps", "/night-shift-brain" | Audit + fill gaps from canonical SoT until brain-audit GREEN |
| `night-shift-backend` | "audit backend", "PES coverage", "/night-shift-backend" | Endpoint+DTO+Kafka+CQRS+PES coverage audit, routed to Ammar specialist agents |

Plus `_night-shift-common/CONTRACT.md` — single source of truth for shared invariants (gates, halt rules, report shape, source-prefix discipline, memory contract).

## Shared invariants (all 4 modes honor)

1. Pre-flight reads MASTER-INDEX + VERIFICATION-STATUS + DECISION-PROTOCOL + pitfalls + CONTRACT before any work
2. Five gates from NIGHT-SHIFT-LOOP.ps1 — gate 5 (FE runtime) remains DEFERRED until 40+ Stencil/Angular compile errors fixed
3. Wave structure mandatory — atomic per-wave gates; halt on first red, never bypass
4. Halt-and-flag triggers: ambiguity ≥ 7, SoT conflict, [INFERRED] > 3 per wave, missing canonical evidence
5. Source-prefix discipline: every Falcon fact carries `[CODE] | [BRAIN-OUT] | [VAULT] | [BRAIN-SK] | [MEMORY] | [INFERRED]`
6. **Mandatory report shape**: TL;DR + before/after % table (≥3 dimensions) + one concrete before/after example with file:line + waves table + halt items + memory entries + brain-grounding declaration
7. Memory update at end (or skip if trivial)
8. Workspace safety: no commit/push without explicit instruction; no out-of-scope edits

## Per-mode structure

Each mode skill folder contains 4 files:
- `SKILL.md` — frontmatter + trigger phrases + mode-specific procedure
- `playbook.md` — step-by-step deep-dive (phases 0-4 typical)
- `report-template.md` — before/after report skeleton with mode-specific dimensions
- `learnings.md` — appended after each run (self-improvement log)

## Web-research patterns folded in (3)

From `2026 Agentic Coding Trends Report` + Claude Code best practices:

1. Persistent JSON state-machine + re-anchoring (already in Falcon's universal-brain — reused, not duplicated)
2. Per-skill learnings.md for self-improvement
3. 3-phase eval pattern: Run → Evaluate → Append learnings

## Why this design vs alternatives considered

- **4 separate skills (chosen)** vs 1 skill with subcommands → independent evolution, clearest invocation
- **Wrap existing NIGHT-SHIFT-LOOP.ps1 (chosen)** vs standalone loop per mode → inherits brain-audit + scanner + PES verify for free
- **Build from Falcon primitives + web research (chosen)** vs primitives-only → research confirmed `learnings.md` pattern and 3-phase eval that primitives lacked

## Files written

```
C:\Falcon\.claude\skills\
├── night-shift\SKILL.md                           # Router
├── _night-shift-common\CONTRACT.md                # Shared invariants
├── night-shift-fe-bugs\{SKILL.md, playbook.md, report-template.md, learnings.md}
├── night-shift-feature\{SKILL.md, playbook.md, report-template.md, learnings.md}
├── night-shift-brain\{SKILL.md, playbook.md, report-template.md, learnings.md}
└── night-shift-backend\{SKILL.md, playbook.md, report-template.md, learnings.md}
```

Total: 18 files (1 shared CONTRACT + 1 router SKILL.md + 4 modes × 4 files each). No code edits to existing Falcon source. No backend changes. No commits made.

## How to use

User says any trigger phrase from any mode SKILL.md → that mode's skill activates. If user says "night shift" without a mode, the router classifies and routes (asks ONE clarifying question if truly ambiguous).

A typical run produces ONE report at:
```
Brain Outputs\datasets\authority-dataset\_runtime-verification\
  night-shift-<mode>-<task-id>-<YYYY-MM-DD-HHMM>.md
```

## Related memory

- [[project_brain_query_layer_wave_11_2026_05_28]] — BQL feeds brain mode
- [[project_brain_bundles_b_c_wave_12_2026_05_28]] — brain-verify skill consumed by brain mode
- [[project_brain_xlsx_watcher_wave_13_2026_05_28]] — xlsx-resync consumed by brain + backend modes

## Source citations

- `[BRAIN-OUT] Brain Outputs/datasets/authority-dataset/19-night-shift-readiness/NIGHT-SHIFT-LOOP.md` — the gate definitions every mode wraps
- `[BRAIN-OUT] Brain Outputs/datasets/authority-dataset/19-night-shift-readiness/NIGHT-SHIFT-LOOP.ps1:1-413` — the script every mode invokes
- `[BRAIN-OUT] Brain Outputs/datasets/authority-dataset/19-night-shift-readiness/_INDEX.md:62` — current 95% night-shift-readiness score
- `[BRAIN-SK] C:\Falcon\.claude\skills\_night-shift-common\CONTRACT.md` — shared contract
- `[INFERRED]` — 3-phase eval pattern + learnings.md cadence from web research (Anthropic 2026 Agentic Coding Trends Report + claudefa.st)
