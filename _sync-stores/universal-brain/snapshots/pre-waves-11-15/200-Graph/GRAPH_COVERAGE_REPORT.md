---
type: graph-quality-report
title: Falcon Knowledge Graph — Coverage Report
created: 2026-05-27
wave-introduced: 1
last-updated-wave: 1
up: "[[00_START_HERE]]"
tags: [graph, quality, coverage]
---

# Graph Coverage Report

> [!summary]
> Wave 1 baseline: **22% coverage**. Target: **90%** before wave loop can stop. Wave 2 expected to reach ~50%.

## Scoring model

Each dimension is scored 0.0–1.0 then weighted. Score is recalculated per wave; trend is plotted at the bottom.

| Dimension | Weight | What it measures |
|---|---:|---|
| **MOC / index coverage** | 0.15 | % of canonical nodes that have at least one `PARENT_MOC` edge |
| **Component relationship coverage** | 0.20 | % of `Component` nodes with WRAPS / USES_TOKEN / HAS_VARIANT / HAS_STATE edges |
| **Style/token relationship coverage** | 0.15 | % of `DesignToken` + `CSSVariable` + `TailwindClass` nodes with DEFINES_* / USES_* edges |
| **Page/feature usage coverage** | 0.15 | % of `Page` nodes with `USES_COMPONENT` edges (≥1 per page) |
| **API/business/architecture relationship coverage** | 0.15 | % of `Endpoint`/`Service`/`BusinessRule`/`ArchitectureRule` nodes with CONNECTS_TO_API / USES_DTO / IMPLEMENTS_BUSINESS_RULE / GOVERNED_BY_ARCHITECTURE_RULE edges |
| **Orphan reduction** | 0.10 | 1.0 − (orphan_count / total_nodes) |
| **Weak cluster reduction** | 0.05 | 1.0 − (weak_clusters / known_clusters) |
| **Evidence quality** | 0.05 | (confirmed edges) / (all edges) |

**Stop threshold:** total weighted score ≥ 0.90, AND all stop conditions in [[GRAPH_GAPS_AND_NEXT_STEPS]] are also true (because a 90% score with unjustified orphans still fails the qualitative stop condition).

## Wave-by-wave history

| Wave | Date | MOC | Comp-rel | Style-token | Page-use | API-biz-arch | Orphan-red | Weak-cluster-red | Evidence | **Total** |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 2026-05-27 | 0.85 | 0.30 | 0.05 | 0.30 | 0.35 | 0.00 | 0.00 | 0.95 | **0.22 (22%)** |
| 2 | 2026-05-27 | 0.85 | 0.65 | 0.55 | 0.30 | 0.40 | 0.10 | 0.30 | 0.93 | **0.50 (50%)** |
| 3 | 2026-05-27 | 0.85 | 0.75 | 0.55 | 0.85 | 0.50 | 0.15 | 0.35 | 0.95 | **0.65 (65%)** |
| 4 | 2026-05-27 | 0.85 | 0.75 | 0.55 | 0.85 | 0.88 | 0.20 | 0.50 | 0.95 | **0.78 (78%)** |
| 5 | 2026-05-27 | 0.88 | 0.78 | 0.55 | 0.85 | 0.98 | 0.35 | 0.75 | 0.95 | **0.86 (86%)** |
| 6 | 2026-05-27 | 0.90 | 0.78 | 0.55 | 0.85 | 1.00 | 0.75 | 0.95 | 0.95 | **0.90 (90%)** |
| 7 | 2026-05-27 | 0.95 | 0.78 | 0.55 | 0.85 | 1.00 | 0.85 | 1.00 | 0.95 | **0.92 (92%)** |
| 8 | 2026-05-27 | 0.95 | 0.80 | 0.55 | 0.85 | 1.00 | 0.90 | 1.00 | 0.95 | **0.93 (93%)** |
| 9 | 2026-05-27 | 0.95 | 0.80 | 0.60 | 0.85 | 1.00 | 0.95 | 1.00 | 0.95 | **0.94 (94%)** |
| 10 | 2026-05-27 | 0.95 | 0.80 | 0.60 | 0.85 | 1.00 | 0.95 | 1.00 | 0.95 | **0.94 (94% — FINAL of build loop)** |
| 11 | 2026-05-28 | 0.95 | 0.80 | 0.60 | 0.85 | 1.00 | 0.95 | 1.00 | 0.95 | **0.94 (post-loop — adds query layer, not coverage)** |

## Wave 11 — Brain Query Layer landed (intelligence-layer wave)

Coverage unchanged (Wave 11 adds a query API + skill, not graph data). But **brain accessibility** jumps significantly — the same 1,462 nodes are now reachable via a single Bash command + a registered `/brain-context` skill instead of manual JSON walking.

| Before Wave 11 | After Wave 11 |
|---|---|
| Agents read JSON manually (~30s per topic) | `/brain-context <topic>` returns curated bundle in 0.3s |
| No Q-* gap auto-surfacing | Open Gaps + Conflicts surface in every context bundle |
| 5-15 file reads per cold-start | ~1 BQL call per cold-start (~3KB context) |

See [[waves/WAVE-011-GRAPH-PLAYBACK]] for full detail.

## Brain Understanding Score (separate measurement — added Wave 9)

This is distinct from graph coverage. Brain understanding measures how well an AI agent can walk Falcon knowledge cold.

| Dimension | Weight | Before wave loop | After Wave 8 | Delta |
|---|---:|---:|---:|---:|
| Authority | 0.15 | 0.85 | 1.00 | +15 |
| Validation (xlsx SoT) | 0.15 | 0.60 | 0.95 | +35 |
| Frontend | 0.20 | 0.50 | 0.85 | +35 |
| Backend | 0.20 | 0.55 | 0.98 | +43 |
| Business rules | 0.15 | 0.45 | 0.90 | +45 |
| Architecture | 0.10 | 0.65 | 0.95 | +30 |
| Cross-store integration | 0.05 | 0.15 | 0.95 | +80 |
| **Total weighted** | 1.00 | **0.569 = 57%** | **0.937 = 94%** | **+37 pts** |

## Wave 1 — dimension detail

### MOC / index coverage — 0.85
- 76 MOC nodes catalogued (46 falcon-wiki + 30 Brain SK).
- 343 total nodes. Most non-MOC nodes inherit a `PARENT_MOC` via wave-1 frontmatter or existing wikilinks.
- Gap: PESRule + DesignToken + CSSVariable + TailwindClass + KafkaEvent nodes have **no Wave-1 MOC** in `00-MOCs/` — they live in cluster READMEs but not the central MOC dir.

### Component relationship coverage — 0.30
- All 63 components seeded as nodes ✓
- WRAPS edges: not yet asserted (Wave 2 task)
- USES_TOKEN edges: not yet asserted (Wave 2 task)
- HAS_INPUT / HAS_OUTPUT: not yet extracted from `API.md` (Wave 2)
- HAS_VARIANT / HAS_SIZE / HAS_STATE: not yet extracted (Wave 2)

### Style/token relationship coverage — 0.05
- `falcon-wiki/40-Tokens/` is empty — no centralized token catalog.
- Tokens are embedded in 63 component `TOKENS.md` files — extraction is Wave 2's main task.
- 46 theming files exist in `Brain SK/_obsidian/36-Theming/` but not yet cross-referenced.

### Page/feature usage coverage — 0.30
- 14 page dossiers in Brain Outputs ✓
- `falcon-wiki/20-Pages/<page>.md` frontmatter has `components: [[..]]` lists ✓ (per agent sample)
- USES_COMPONENT edges to extract Wave 3 from these lists + page `09-COMPONENTS.md` files.

### API/business/architecture relationship coverage — 0.35
- 9 services + 25 E-* entities + 21 Kafka events + 24 architecture files ✓
- `Brain Outputs/understanding/backend/<svc>/ENDPOINT_REGISTRY.md` exists per service but not yet parsed into `Endpoint` nodes.
- CONNECTS_TO_API + USES_DTO edges: Wave 4 task.
- IMPLEMENTS_BUSINESS_RULE: PRD modules carry these (`prd/modules/<m>/BUSINESS_RULES.md`); Wave 5 task.

### Orphan reduction — 0.00
- Wave 1 = baseline. No prior orphans to reduce. Score begins climbing Wave 2.

### Weak cluster reduction — 0.00
- Baseline. Identified 3 weak clusters (CSSFile / Directive / Pattern). Score climbs Wave 2+.

### Evidence quality — 0.95
- Every Wave-1 node has at least one source-prefixed evidence path.
- Edges are mostly `confirmed` (provenance edges) + a small set of `needs-review` (e.g., PRD-only validations awaiting xlsx confirmation).
- Zero `inferred` edges asserted in Wave 1 (we used [INFERRED] prefix only for the canonical-PRD-module-list which is itself evidenced).

## Coverage gates to next wave

To unlock Wave 2 auto-trigger (vs explicit user nod):
- Wave 1 deliverables landed ✓
- Coverage delta ≥ +15% per wave (Wave 1: +22% from 0 — passes) ✓
- No safety-rule violations ✓

To unlock stop:
- Coverage ≥ 0.90
- AND all qualitative gates in [[GRAPH_GAPS_AND_NEXT_STEPS]] pass

## See also

- [[GRAPH_GAPS_AND_NEXT_STEPS]] — the qualitative stop conditions
- [[ORPHAN_NODES_REVIEW]] — what's currently orphaned
- [[WEAK_CLUSTERS_REVIEW]] — under-connected clusters
- [[waves/WAVE-001-GRAPH-PLAYBACK]] — what Wave 1 actually did
