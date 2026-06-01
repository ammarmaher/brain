---
type: graph-entry
title: Falcon Knowledge Graph — Start Here
audience: all AI agents (Claude / Codex / OpenClaw / future agents) + Ammar
created: 2026-05-27
home: true
up: "[[../00-MOCs/Knowledge-Health]]"
tags: [graph, entry, knowledge-graph, playback]
---

# Falcon Knowledge Graph — Start Here

> [!tldr]
> This folder is the **knowledge-graph projection** of every Falcon knowledge store. Each Falcon concept (component, page, service, API, DTO, validation, business rule, token, CSS variable, theme, architecture rule, PES rule, scan, report, gap) is modelled as a **typed node** with **typed edges** to its related concepts. Open any node and walk the graph without guessing.

## What "playback" means here

Playback ≠ transcript replay. **Playback = knowledge-graph traversability.** A future agent landing cold on any node must be able to navigate to every related node along a typed, evidence-cited edge. Each wave's job is to make this more true than the previous wave.

## How this graph relates to existing knowledge

The graph does **not replace** the Falcon knowledge stores — it **threads them**.

- [VAULT] `falcon-wiki/30-Components/` — 63 component dossiers (kebab-case) → indexed as `Component` nodes here.
- [VAULT] `falcon-wiki/20-Pages/` — 14 page dossiers → indexed as `Page` nodes here.
- [VAULT] `falcon-wiki/50-Services/` — 9 services → indexed as `Service` nodes here.
- [BRAIN-SK] `Brain SK/_obsidian/30-Validation/` — 30 `V-*.md` files → indexed as `ValidationRule` nodes.
- [BRAIN-SK] `Brain SK/_obsidian/40-API/` — 25 `E-*.md` entity files → reconciled into `DTO` + `Endpoint` nodes.
- [BRAIN-SK] `Brain SK/_obsidian/47-Events/` — 21 Kafka events → `KafkaEvent` nodes.
- [BRAIN-SK] `Brain SK/_obsidian/35-Architecture/` — 24 files inc. 8 ADRs → `ArchitectureRule` nodes.
- [BRAIN-OUT] `Brain Outputs/understanding/frontend/components/` — canonical component dossiers (63 folders × 9 files each).
- [BRAIN-OUT] `Brain Outputs/understanding/pages/` — canonical page dossiers (14 pages × 17–25 files each).
- [BRAIN-OUT] `Brain Outputs/understanding/backend/` — canonical service dossiers (9 services × 6 files each).
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/` — 47 PES keys + 6 roles + 12-axis matrix.
- [BRAIN-OUT] `Brain Outputs/prd/modules/` — 6 PRD modules × ~6 files each (BUSINESS_RULES, ENTITIES, WORKFLOWS, QUESTIONS).
- [CODE] `Source_of_truth_theme/Validations.xlsx` + frozen snapshot `Validations.SOT-2026-05-24.xlsx` + parsed TSVs at `.xlsx-parse/dump-SOT/` — **the SoT for validation rules. Wins over PRD where they conflict.**

## Validation SoT — read this twice

Per [MEMORY] `project_validation_xlsx_sot_flip_wave_f_2026_05_24` (Ammar declared 2026-05-24): **validation knowledge comes from `Validations.xlsx`, NOT from PRD**.

The graph encodes this with three invariants:
1. Every `ValidationRule` node MUST carry `sot: xlsx` if the xlsx covers its field. If xlsx is silent, `sot: prd` is allowed with a note.
2. Where a PRD-derived V-rule was superseded by an xlsx-derived one (e.g., `V-account-name-format-uniqueness` → `V-account-name-format-xlsx-2026-05-24`), the graph carries a `REPLACES` edge from new → old.
3. `HAS_VALIDATION` edges with `evidence-strength: confirmed` are only emitted for xlsx-traceable rows. PRD-only rules get `evidence-strength: needs-review`.

## Navigation

| You want… | Go to |
|---|---|
| Node + edge type definitions | [[GRAPH_SCHEMA]] |
| Component nodes + relationships | [[COMPONENT_REGISTRY_GRAPH]] |
| Component ↔ style ↔ token wiring | [[COMPONENT_STYLE_GRAPH_INDEX]] · [[STYLE_TOKEN_GRAPH]] · [[CSS_VARIABLE_GRAPH]] · [[TAILWIND_USAGE_GRAPH]] |
| Page → component usage | [[PAGE_TO_COMPONENT_USAGE_GRAPH]] |
| API ↔ business rule ↔ architecture | [[API_BUSINESS_ARCHITECTURE_GRAPH]] |
| How MOCs connect | [[MOC_CONNECTIONS_INDEX]] |
| Orphan + weak-cluster reviews | [[ORPHAN_NODES_REVIEW]] · [[WEAK_CLUSTERS_REVIEW]] |
| What's missing → next wave focus | [[GRAPH_GAPS_AND_NEXT_STEPS]] |
| Coverage score per dimension | [[GRAPH_COVERAGE_REPORT]] |
| Per-wave playback (this is the audit trail) | `waves/` folder — start with [[waves/WAVE-001-GRAPH-PLAYBACK]] |
| Machine-readable graph (for tools) | `graph/nodes.json` · `graph/edges.json` · `.csv` counterparts |

## Continuous wave mode — how this advances

- Wave N reads vault root, classifies new nodes, asserts new edges (evidence-cited), emits playback file, decides Wave N+1 target.
- Wave loop stops only when ALL stop conditions in `GRAPH_GAPS_AND_NEXT_STEPS.md` are met (90% coverage, no unjustified orphans, every important node has a parent MOC, every important node has relevant outgoing/incoming links).
- Hard ceiling: 10 waves per session. Beyond that → halt-and-flag for human review per [BRAIN-OUT] `19-night-shift-readiness/DECISION-PROTOCOL.md` Class F operational forks.

## What this graph never does

- Edits application code (everything under `Falcon/falcon-web-platform-ui/`, services, etc.)
- Runs npm/Docker/tests/servers
- Commits or pushes
- Stores secrets
- Fabricates edges — weak evidence becomes `NEEDS_REVIEW` edges, never confirmed ones

## Mirror

Brain SK side has a stub pointer at [BRAIN-SK] `Brain SK/_obsidian/95-Graph/README.md`. The canonical graph lives **here** in falcon-wiki (Azure-DevOps-synced + has the MOC convention slot at `100-Authority/` / `200-Graph/`).

## See also

- [[../00-MOCs/Knowledge-Health]] · [[../00-MOCs/Orphans]] · [[../00-MOCs/Dead-Links]] · [[../00-MOCs/Linker-Health]] — existing health MOCs the wave loop feeds into
- [[../Home]] — vault root
- [[../_INDEX]] — Obsidian-side index
- [BRAIN-OUT] `0-MASTER-INDEX.md` — original 7-store knowledge router
- [BRAIN-OUT] `BRAIN-ARCHITECTURE-CHART.md` — visual chart of every store + folder
