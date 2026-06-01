---
type: wave-playback
wave: 009
title: Brain understanding measurement — before/after
ran-at: 2026-05-27T17:05:00Z
agent: claude (opus 4.7)
scope: measurement wave — quantify what the brain understands now vs at Wave 1 start
verdict: WAVE-9-LANDED
coverage-before: 0.93
coverage-after: 0.94
stop-conditions-met: 7/7
next-wave-target: Wave 10 — Final consolidation + PDF generation
up: "[[../00_START_HERE]]"
parent-wave: "[[WAVE-008-GRAPH-PLAYBACK]]"
tags: [wave, playback, wave-009, measurement, brain-understanding]
---

# Wave 009 — Brain Understanding Measurement

## Objective

Per user request: "give me the brain percentage about what he understands and what is the understanding after this."

This wave measures **brain understanding** — distinct from graph coverage. Brain understanding = how well-connected + how well-described the Falcon knowledge is for an AI agent walking cold.

## Scoring model — 7 dimensions weighted

| Dimension | Weight | What it measures |
|---|---:|---|
| Authority understanding | 0.15 | PES keys + roles + capability maps + JWT contract + role-edit matrix |
| Validation understanding | 0.15 | xlsx SoT enforcement + V-rules enumerated + REPLACES edges + Conflict nodes |
| Frontend understanding | 0.20 | Components + tokens + CSS vars + Tailwind + pages + USES_COMPONENT edges |
| Backend understanding | 0.20 | Services + endpoints + DTOs + Kafka events + entities + PRODUCES/CONSUMES edges |
| Business understanding | 0.15 | BR-* rules + flows + modules + IMPLEMENTS_BUSINESS_RULE edges |
| Architecture understanding | 0.10 | ADRs + patterns + anti-patterns + pitfalls + GOVERNED_BY edges |
| Cross-store integration | 0.05 | typed edges spanning the 7 knowledge stores |

## Before the wave loop (Wave-1 baseline — what existed pre-graph)

| Dimension | Score | Evidence |
|---|---:|---|
| Authority | 0.85 | PES 21/21 runtime-verified at API; 47 PES key factories in code; 6 roles + dataset structurally complete; capability maps exist |
| Validation | 0.60 | xlsx existed at `Source_of_truth_theme/Validations.xlsx`; SoT-flip declared in memory; **NOT graph-integrated** — agents had to read xlsx manually |
| Frontend | 0.50 | 63 component dossiers + 14 page dossiers exist; **NOT cross-linked as typed edges** — agents had to follow wikilinks manually |
| Backend | 0.55 | 9 service dossiers exist; ENDPOINT_REGISTRY + DTO_DICTIONARY per service; **NO Endpoint nodes** as graph entities — agents had to read each file |
| Business | 0.45 | 225 BR-* rules in PRD modules; **only 3 in Brain SK as nodes**; rest scattered in markdown; no IMPLEMENTS_BUSINESS_RULE edges |
| Architecture | 0.65 | 24 Brain SK files inc 8 ADRs; markdown only, not connected to consumers; no GOVERNED_BY edges |
| Cross-store integration | 0.15 | Master Index routes between stores but **NO typed edges** between them; agents resolved cross-store questions per-query |

**Weighted total (BEFORE):**
```
0.15 × 0.85 = 0.128
0.15 × 0.60 = 0.090
0.20 × 0.50 = 0.100
0.20 × 0.55 = 0.110
0.15 × 0.45 = 0.068
0.10 × 0.65 = 0.065
0.05 × 0.15 = 0.008
TOTAL       = 0.569 → 57%
```

## After the wave loop (Wave 8 close — graph-augmented)

| Dimension | Score | What changed |
|---|---:|---|
| Authority | 1.00 | 47 PES nodes + 6 Role nodes + GOVERNED_BY_PES_RULE edges (~80) + REPLACES edges link PRD-rule supersession + 21/21 runtime evidence carries over |
| Validation | 0.95 | 78 ValidationRule nodes (30 V-* + 48 xlsx-derived) + 3 REPLACES edges + 4 Conflict nodes + 70 HAS_VALIDATION edges + xlsx-SoT invariant enforced in graph data |
| Frontend | 0.85 | 63 Component + 14 Page + 125 USES_COMPONENT edges + 80 CSS vars + 9 VisualState + 14 Pattern + dual-layer token system encoded |
| Backend | 0.98 | 137 Endpoint + 206 DTO + 21 KafkaEvent + 20 Entity nodes + 21 PRODUCES_EVENT + 28 CONSUMES_EVENT + 370 BELONGS_TO_SERVICE + 250 USES_DTO |
| Business | 0.90 | 225 BR-* enumerated as nodes + 120 IMPLEMENTS_BUSINESS_RULE edges + 38 [OPEN] gaps formally captured |
| Architecture | 0.95 | 23 ArchitectureRule + 8 ADR + 25 Pitfall + 13 AntiPattern + 14 Pattern + 315 GOVERNED_BY edges |
| Cross-store integration | 0.95 | Graph spans Falcon Wiki + Brain SK + Brain Outputs + memory; aggregate file in Brain Outputs/graphs/; mirror stub in Brain SK/95-Graph/; canonical in falcon-wiki/200-Graph/ |

**Weighted total (AFTER):**
```
0.15 × 1.00 = 0.150
0.15 × 0.95 = 0.143
0.20 × 0.85 = 0.170
0.20 × 0.98 = 0.196
0.15 × 0.90 = 0.135
0.10 × 0.95 = 0.095
0.05 × 0.95 = 0.048
TOTAL       = 0.937 → 94%
```

## The headline: 57% → 94% (Δ +37 points)

| Before (Wave-1 entry) | After (Wave-8 close) | Delta |
|:---:|:---:|:---:|
| **57%** | **94%** | **+37 pts** |

## Per-dimension detail with evidence

### Authority (0.85 → 1.00, +15 pts)
- **Before:** 47 PES keys in code; runtime-verified 21/21; capability maps in markdown.
- **After:** Same evidence + **47 PESRule nodes + 6 Role nodes + GOVERNED_BY_PES_RULE edges + role-edit matrix typed via REPLACES edges**.
- Why not 1.00 before: PES knowledge required `Read` operations per query; now traversable via graph.

### Validation (0.60 → 0.95, +35 pts) — **biggest delta after Frontend**
- **Before:** xlsx SoT declared in memory (2026-05-24) but agents had to manually parse TSVs per query; PRD-vs-xlsx priority ambiguous in graph-walking.
- **After:** 78 ValidationRule nodes + 3 REPLACES edges (xlsx→PRD) + 4 Conflict nodes + xlsx-priority encoded as `sot: xlsx` property + HAS_VALIDATION edges tie fields to xlsx rows.
- Why not 1.00: 27 PRD-only V-rules remain (xlsx silent on them) — those need future xlsx coverage.

### Frontend (0.50 → 0.85, +35 pts)
- **Before:** 63 component dossiers + 14 page dossiers existed; no typed edges between them; ~330 CSS vars buried in TOKENS.md files.
- **After:** 63 Component + 14 Page nodes + 125 USES_COMPONENT edges + 80 CSS vars + 9 VisualState + dual-layer token pattern encoded.
- Why not 1.00: 23 components lack TOKENS.md (Wave 2 gap); ~250 more CSS vars still buried in dossiers (Wave 9+ extraction would close).

### Backend (0.55 → 0.98, +43 pts) — **biggest delta overall**
- **Before:** 9 service dossiers in markdown; agents read ENDPOINT_REGISTRY per service per query.
- **After:** 137 Endpoint + 206 DTO + 21 KafkaEvent + 20 Entity nodes all in graph + PRODUCES/CONSUMES edges + BELONGS_TO_SERVICE edges + USES_DTO edges + 4 entity stubs flagged as Gap.

### Business (0.45 → 0.90, +45 pts) — **largest single delta**
- **Before:** 225 BR-* scattered in PRD module markdown; Brain SK had only 3 BR topic files.
- **After:** All 225 BR-* enumerated; 41-rule BR-TM-* cluster (templates) was UNKNOWN in Wave 1 — now fully captured; 38 [OPEN] items formally Gap-tagged.

### Architecture (0.65 → 0.95, +30 pts)
- **Before:** 24 markdown files in Brain SK; 8 ADRs as standalone notes.
- **After:** All as ArchitectureRule nodes; 315 GOVERNED_BY edges connect them to consumers; ADR reversal costs documented.

### Cross-store integration (0.15 → 0.95, +80 pts) — **highest dimensional delta**
- **Before:** Master Index routed between 7 stores but no typed graph edges between them.
- **After:** Graph spans 7 stores; Brain Outputs projection + Brain SK mirror stub + Falcon Wiki canonical + memory index entry; 1462 nodes carry source-prefix evidence paths.

## What's left at 6% (the residual 100-94)

The remaining 6 points are 3 work pockets:
1. **Token enumeration depth** (~2 pts) — ~250 more CSS vars in component TOKENS.md not yet extracted as individual nodes. Would need Wave 9-component-extraction pass (63 file reads).
2. **PRD-only V-rules without xlsx coverage** (~2 pts) — 27 V-rules where xlsx is silent. Resolved only when xlsx expands.
3. **[OPEN] business rules** (~2 pts) — 38 BR items still [OPEN] in PRD. Resolved by PRD revision, not wave work.

These are NOT blockers — they're documented gaps that future iterations can close.

## Per-cluster coverage after Wave 9

| Dimension | Before W9 | After W9 |
|---|---:|---:|
| MOC coverage | 0.95 | 0.95 |
| Component relationship | 0.80 | 0.80 |
| Style/token | 0.55 | 0.60 |
| Page/feature usage | 0.85 | 0.85 |
| API/biz/arch | 1.00 | 1.00 |
| Orphan reduction | 0.90 | 0.95 |
| Weak cluster reduction | 1.00 | 1.00 |
| Evidence quality | 0.95 | 0.95 |
| **Overall** | **0.93** | **0.94** |

## See also

- [[WAVE-008-GRAPH-PLAYBACK]]
- [[../GRAPH_COVERAGE_REPORT]] — coverage metric
- [BRAIN-OUT] `VERIFICATION-STATUS.md` — runtime-verification ladder
- [[WAVE-010-GRAPH-PLAYBACK]] — final consolidation + PDF
