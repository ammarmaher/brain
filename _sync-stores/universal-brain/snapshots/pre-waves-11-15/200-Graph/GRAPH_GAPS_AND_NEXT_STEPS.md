---
type: graph-roadmap
title: Graph Gaps + Wave Roadmap + Stop Conditions
created: 2026-05-27
wave-introduced: 1
last-updated-wave: 1
up: "[[00_START_HERE]]"
tags: [graph, roadmap, gaps, stop-conditions]
---

# Graph Gaps + Wave Roadmap + Stop Conditions

> [!summary]
> Wave 1 landed the foundation. This file is the **roadmap forward** + the **explicit stop-conditions contract** the wave loop must satisfy before halting.

## Stop conditions (ALL must be true)

Per user spec — wave loop continues until ALL conditions met:

| # | Condition | Wave-1 state |
|---:|---|---|
| 1 | No high-value orphan nodes (or remaining orphans justified in [[ORPHAN_NODES_REVIEW]]) | ⏳ 4 cluster-level orphans flagged with remediation plan; 0 node-level orphans |
| 2 | No major cluster disconnected (component / style / token / API / business / architecture) | ❌ Style/token cluster disconnected from components (Wave 2 fixes) |
| 3 | Every important node has at least one parent MOC / index link | ⏳ 76 MOCs catalogued; PARENT_MOC edges seeded for 343 nodes via frontmatter |
| 4 | Every important node has relevant outgoing/incoming links | ❌ Domain edges (USES_TOKEN, CONNECTS_TO_API, HAS_VALIDATION-xlsx-confirmed) sparse |
| 5 | Typed graph edges exist for important relationships | ⏳ 45 edge types defined; Wave 1 used ~10 actively |
| 6 | Graph coverage ≥ 90% per [[GRAPH_COVERAGE_REPORT]] | ❌ Wave 1 = 22%. Target = 90%. |
| 7 | Remaining gaps documented in this file | ✓ This file |

**Wave 1 verdict: STOP CONDITIONS NOT MET. Continue to Wave 2.**

## Wave roadmap (Wave 2-10)

| Wave | Focus | Files to read (estimate) | Expected coverage after | Stop-condition impact |
|---:|---|---:|---:|---|
| 2 | Component → Style → Token expansion | 63 `TOKENS.md` + 46 theming files + 63 `API.md` | **50%** | #2, #4, #6 |
| 3 | Page → Component → Validation (xlsx-confirmed) | 14 page dossiers + 20 parsed xlsx TSVs | **65%** | #2, #4, #6 |
| 4 | Backend: Endpoint + Controller + DTO + KafkaEvent + Events | 9 services × 6 files + 21 event files | **75%** | #2, #4, #6 |
| 5 | PES + Business Rules expansion | 47 PES keys + 180 BR-* + 24 architecture | **82%** | #2, #4, #6 |
| 6 | Gaps + Patterns + Reports + Quality pass | 30+ gap files + 30+ patterns + 80+ reports | **87%** | #1, #2, #4 |
| 7 | Conflict detection — PRD ↔ xlsx ↔ code triangulation | full cross-walk of Validation + BR + Entity | **89%** | #4 |
| 8 | Orphan reduction final pass | every node re-checked | **90%** | #1 |
| 9 | Coverage validation + edge density audit | graph-wide | **>90%** | #6 |
| 10 | Final consolidation + handoff doc | n/a — produces summary | **convergence** | all |

> [!info]
> If Wave 9 measurement shows ≥90% and all qualitative conditions are met, Wave 10 is the closing handoff doc (graph summary, what each agent should query and how) and the wave loop **stops**.

## Wave 2 detailed plan (immediate next)

**Objective:** Densely populate the Component-Style-Token subgraph.

**Spawn pattern (parallel Explore agents):**
- Agent A: components 1-15 — read `OVERVIEW.md` + `API.md` + `TOKENS.md` for each → return structured node + edge proposal
- Agent B: components 16-30 — same
- Agent C: components 31-45 — same
- Agent D: components 46-63 — same
- Agent E: read [BRAIN-SK] `36-Theming/` 46 files → return ThemeMode, MAPS_TO_TOKEN, OVERRIDES_TOKEN proposals + Tailwind audit class list

**Aggregation:**
Main agent merges agent outputs → updates `graph/nodes.json` + `graph/edges.json` + writes [[STYLE_TOKEN_GRAPH]] / [[CSS_VARIABLE_GRAPH]] / [[TAILWIND_USAGE_GRAPH]] with dense content.

**Edge contract for Wave 2:**
- Only `confirmed` edges where the source file directly states the relationship (e.g., `TOKENS.md` lists the variable)
- `needs-review` edges where the relationship is implied but not explicit (e.g., another component uses a token name without declaring it)
- No `inferred` edges from pattern-matching alone

**Wave 2 playback file:** `waves/WAVE-002-GRAPH-PLAYBACK.md` — created at end of Wave 2.

## Validation invariant (every wave must honor)

Per [MEMORY] `project_validation_xlsx_sot_flip_wave_f_2026_05_24` + user explicit reinforcement:

> Validation knowledge MUST be sourced from `Validations.xlsx` (snapshot at `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx`). PRD-derived V-rules are **superseded** where the xlsx covers the same field.

Every wave that touches `ValidationRule` nodes must:
1. Check xlsx coverage first
2. If xlsx covers the field → `HAS_VALIDATION` edge with `evidence-strength: confirmed` + `sot: xlsx`
3. If PRD covers + xlsx silent → `HAS_VALIDATION` edge with `evidence-strength: confirmed` + `sot: prd` (acceptable until xlsx revision)
4. If PRD and xlsx contradict → `Conflict` node + `REPLACES` edge from xlsx-V-rule to PRD-V-rule + `needs-review` on the old PRD rule

## Halt-and-flag triggers (per [BRAIN-OUT] DECISION-PROTOCOL.md)

The wave loop halts and flags for human review if:
- Wave count reaches 10 without reaching stop conditions
- Wave coverage delta < +5% (loop stalled)
- Two consecutive waves emit `Conflict` nodes for the same node-pair (recurring contradiction needs human decision)
- A safety rule trips (any write outside Obsidian/Brain knowledge area; any app code edit; any commit/push attempt)

## Open questions for next session

None blocking. Wave 1 lands cleanly. Wave 2 can auto-trigger on user nod.

## See also

- [[00_START_HERE]]
- [[GRAPH_COVERAGE_REPORT]]
- [[ORPHAN_NODES_REVIEW]]
- [[WEAK_CLUSTERS_REVIEW]]
- [[waves/WAVE-001-GRAPH-PLAYBACK]]
- [BRAIN-OUT] `19-night-shift-readiness/DECISION-PROTOCOL.md`
