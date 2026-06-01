---
name: obsidian-graph-playback-wave-1-2026-05-27
description: "Wave 1 of Obsidian knowledge-graph playback (continuous N-wave mode) — foundation landed at falcon-wiki/200-Graph/ with 35 node types, 45 edge types, 343 seed nodes, REPLACES edges enforcing xlsx-over-PRD validation SoT; baseline coverage 22%, Wave 2 target = Component-Style-Token expansion"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1ddc4de1-42ef-4b42-b947-16d520447c6a
---

# Obsidian knowledge-graph playback — Wave 1

🟢 **WAVE-1-LANDED 2026-05-27T15:26:56Z** — User asked for "infinite waves" of Obsidian knowledge-graph construction with explicit validation-from-xlsx-not-PRD invariant. Wave 1 delivered the foundation; Wave 2 ready to auto-trigger on user nod.

## What "playback" means (user override)

User clarified: playback ≠ transcript replay. **Playback = typed knowledge graph traversability**. Every Falcon concept (component, page, service, API, DTO, validation, BR, token, CSS var, PES, architecture, scan, report, gap, wave) is a typed node connected by typed edges; future agents walk the graph from any starting node.

## Location

- **Canonical:** [VAULT] `C:\Falcon\falcon-wiki\200-Graph\` (the Obsidian SoT vault, next to `100-Authority/`)
- **Mirror stub:** [BRAIN-SK] `C:\Falcon\Brain SK\_obsidian\95-Graph\README.md` (pointer to canonical to avoid dual-write drift)

## Files landed in Wave 1 (20 total)

Foundation:
- `200-Graph/00_START_HERE.md` — entry doc
- `200-Graph/GRAPH_SCHEMA.md` — 35 node types + 45 edge types contract
- `200-Graph/waves/WAVE-001-GRAPH-PLAYBACK.md` — full wave audit trail

Indexes (8):
- `MOC_CONNECTIONS_INDEX.md`, `COMPONENT_STYLE_GRAPH_INDEX.md`, `COMPONENT_REGISTRY_GRAPH.md` (63 components enumerated), `STYLE_TOKEN_GRAPH.md`, `CSS_VARIABLE_GRAPH.md`, `TAILWIND_USAGE_GRAPH.md`, `PAGE_TO_COMPONENT_USAGE_GRAPH.md` (14 pages + IN_MODULE edges), `API_BUSINESS_ARCHITECTURE_GRAPH.md`

Quality (4):
- `ORPHAN_NODES_REVIEW.md` (4 cluster-level orphans flagged with remediation plan; 0 node-level orphans)
- `WEAK_CLUSTERS_REVIEW.md` (6 weak clusters identified for Wave 2-6)
- `GRAPH_GAPS_AND_NEXT_STEPS.md` (Wave 2-10 roadmap + stop conditions contract)
- `GRAPH_COVERAGE_REPORT.md` (baseline 22%; target 90%; 8 weighted dimensions)

Machine-readable (4):
- `graph/nodes.json` (83 explicit nodes + cluster placeholders for 47 PES, 24 arch rules, 16 events, 20 entities, 63 components, 76 MOCs)
- `graph/edges.json` (62 explicit edges incl. 3 REPLACES xlsx→PRD, 16 IN_MODULE, 9 NEXT_WAVE_TARGET)
- `graph/nodes.csv` + `graph/edges.csv` — Gephi/igraph-compatible

## Validation SoT enforcement (critical invariant)

User reinforced twice: validation knowledge comes from `Validations.xlsx` ([VAULT] `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx`), NOT PRD. Encoded in graph as:
1. ValidationRule nodes carry `sot: xlsx` or `sot: prd` field
2. Where xlsx supersedes PRD (account-name + person-name + username on 2026-05-24), explicit `REPLACES` edges from new → old V-rule. **3 such edges asserted in Wave 1.**
3. `HAS_VALIDATION` edges from pages/DTOs only emit `evidence-strength: confirmed` for xlsx-covered fields; PRD-only rules are `needs-review`.

## Inventory confirmed via 4 parallel Explore agents

| Domain | Count | Source |
|---|---:|---|
| Components (canonical) | 63 | [BRAIN-OUT] `understanding/frontend/components/<comp>/` (9 files each) |
| Pages (canonical) | 14 | [BRAIN-OUT] `understanding/pages/<page>/` (17-25 files each; organization-hierarchy largest at 25) |
| Services (canonical) | 9 | [BRAIN-OUT] `understanding/backend/<svc>/` (6 files each) |
| Kafka events | 21 | [BRAIN-SK] `47-Events/` |
| Entities (E-*) | 25 | [BRAIN-SK] `40-API/E-*.md` |
| V-rules | 30 | [BRAIN-SK] `30-Validation/V-*.md` (3 xlsx-SoT + 27 PRD/other) |
| Architecture rules | 24 | [BRAIN-SK] `35-Architecture/*` inc. 8 ADRs |
| PES keys | 47 | [BRAIN-OUT] `authority-dataset/03-pes-keys/REGISTRY-RAW.md` ([CODE] `falcon-access.registry.ts:1-185`) |
| PRD modules | 6 | [BRAIN-OUT] `prd/modules/<m>/` |
| MOCs | 76 | 46 [VAULT] `00-MOCs/` + 30 [BRAIN-SK] `*INDEX*.md` |
| Parsed validation TSVs | 20 | [VAULT] `Source_of_truth_theme/.xlsx-parse/dump-SOT/` + `dump-NEW/` |

## Coexistence with parallel autopilot

A separate "brain-improvement-plan-autopilot" 14-wave run completed today at 18:00 — touched plugins + MEMORY (62% reduction) + frontmatter schema + Dataview MATRIX + .base files + MOCs. **Did NOT touch `200-Graph/`** — different scope, no conflict. The graph builds on top of (compatible with) the autopilot's frontmatter schema improvements.

## Wave 2 ready to trigger (not auto-continued in this session)

Wave 2 target: Component → DesignToken → CSSVariable → TailwindClass + Variant/Size/State expansion. Plan in `GRAPH_GAPS_AND_NEXT_STEPS.md` — spawn 4 parallel Explore agents reading 63 component `TOKENS.md` + 46 theming files. Expected coverage delta: 22% → 50%.

**Why not auto-continued:** Conservative-default principle per [BRAIN-OUT] `DECISION-PROTOCOL.md` — first wave of new infrastructure deserves human sanity check before scaling. Loop resumes on user nod or explicit `continue wave 2` trigger.

## Rules emitted (reusable)

- **Knowledge graph stays single-canonical** — primary in Falcon Wiki (200-Graph/), mirror is a pointer-stub in Brain SK. Avoids dual-write drift.
- **No fabricated edges** — weak evidence = `NEEDS_REVIEW` edge, never `confirmed`. Wave 1 enforced this strictly: 0 inferred edges asserted.
- **xlsx wins over PRD** is graph-encodable — REPLACES edge from new xlsx-V-rule to old PRD-V-rule is the durable expression of the SoT-flip. Preserves provenance.
- **Per-wave playback file is the audit trail** — not transcript-replayable but graph-replayable. Each wave's file lists nodes/edges added + next-wave target.
- **Stop conditions are explicit + measurable** — coverage ≥ 90% AND no unjustified orphans AND every important node has parent-MOC + outgoing/incoming edges. Encoded in `GRAPH_GAPS_AND_NEXT_STEPS.md` so future agents check before claiming done.
- **Cluster placeholders are legitimate Wave-1 nodes** — when 47 PES keys or 16 remaining events can't all be enumerated in one wave without context blowout, emit a cluster-placeholder node with `expand-in-wave: N` and a NEXT_WAVE_TARGET edge. Future waves dereference them.

## Related

- [[project_validation_xlsx_sot_flip_wave_f_2026_05_24]] — the source-of-truth flip this graph enforces
- [[project_brain_sync_repo_2026_05_21]] — the brain sync infrastructure the graph lives in
- [[project_docker_health_login_verify_2026_05_21]] — backend health context
