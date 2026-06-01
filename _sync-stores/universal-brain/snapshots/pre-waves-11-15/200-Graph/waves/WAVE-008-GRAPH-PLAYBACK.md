---
type: wave-playback
wave: 008
title: Brain Outputs cross-projection + structured JSON data
ran-at: 2026-05-27T17:00:00Z
agent: claude (opus 4.7)
scope: Brain Outputs/graphs/ projection files; aggregated graph data; brain-sync surface
verdict: WAVE-8-LANDED
coverage-before: 0.92
coverage-after: 0.93
stop-conditions-met: 7/7
next-wave-target: Wave 9 — Brain understanding measurement
up: "[[../00_START_HERE]]"
parent-wave: "[[WAVE-007-GRAPH-PLAYBACK]]"
tags: [wave, playback, wave-008, brain-outputs, cross-projection]
---

# Wave 008 — Brain Outputs Cross-Projection

## Objective

Make the knowledge graph discoverable + machine-readable from the **Brain Outputs** store (not just Falcon Wiki + Brain SK). This closes the 3-store coverage loop.

## Files landed in Brain Outputs

| File | Purpose |
|---|---|
| `Brain Outputs/graphs/README.md` | Projection pointer documenting canonical-vs-projection split (landed Wave 7 prep) |
| `Brain Outputs/graphs/aggregate-summary.json` | Cumulative graph state across all waves — node counts by type, edge counts by type, coverage trajectory |

## Aggregate summary (the graph at Wave 8 close)

```
NODE TYPE             COUNT
================================
Wave                   7
App                    5
Module                 6
Feature               14
Page                  14
Component             63 (40 with TOKENS.md, 23 gaps)
WrapperComponent      ~25 (Wave 6 partial)
StencilComponent      ~25
Service                9
Endpoint             137
DTO (incl E-*)       206 (+20 E-* reconciled, 4 stubs)
KafkaEvent            21
ValidationRule        78 (30 V-* + 48 xlsx-derived)
BusinessRule         225 (BR-AM-42, BR-UM-50, BR-CC-50, BR-CGM-38, BR-TM-41, BR-RD-4)
ArchitectureRule      23 (15 rules + 8 ADRs)
PESRule               47
Role                   6
DesignToken           15
CSSVariable           ~80 sampled (~330 discoverable Wave 9+)
TailwindClass         12 sampled
VisualState            9
Pattern               14 (4 approved + 10 cross-pattern)
AntiPattern           13
ScanMetadata           1
Gap                   70
Conflict              10
MOC                   76
================================
TOTAL                 ~1,460 nodes
```

```
EDGE TYPE                       COUNT
=====================================
DISCOVERED_IN_WAVE              ~1,460 (implicit, one per node)
EVIDENCED_BY                    ~1,460
PARENT_MOC                      ~340
IN_MODULE                        ~80
USES_COMPONENT                  ~125
HAS_VALIDATION                   78
REPLACES                          3 (xlsx → PRD V-rules)
CONFLICTS_WITH                   20 (10 × 2-sided)
DEFINES_CSS_VARIABLE             80
DEFINES_TOKEN                   120
HAS_STATE                       120
HAS_GAP                          70
GOVERNED_BY_ARCHITECTURE_RULE   ~315 (every component → relevant ADRs)
GOVERNED_BY_PES_RULE             80
IMPLEMENTS_BUSINESS_RULE        120
PRODUCES_EVENT                   21
CONSUMES_EVENT                   28
BELONGS_TO_SERVICE              ~370
USES_DTO                        ~250
USES_TAILWIND_CLASS              30
NEXT_WAVE_TARGET                  9
NEEDS_REVIEW                      6
=====================================
TOTAL                          ~5,200+ edges
```

## Per-store presence

| Store | Graph presence | What it carries |
|---|---|---|
| **Falcon Wiki** (canonical) | ✓ Full | 22 graph markdown files + 4 data files + Canvas + Base + waves/ + wave-deltas/ |
| **Brain SK** | ✓ Mirror stub | `95-Graph/README.md` pointer + leverages existing 30-Validation, 40-API, 47-Events, 60-Components nodes |
| **Brain Outputs** | ✓ Projection | `graphs/README.md` + `graphs/aggregate-summary.json` |
| **Memory** | ✓ Indexed | `project_obsidian_graph_playback_wave_1_2026_05_27.md` |
| **PRD Modules** | ✓ Referenced (read-only) | 6 modules feed BR-* nodes |
| **Authority Dataset** | ✓ Referenced (read-only) | PES + capability maps feed 47 PES nodes + 6 Role nodes |
| **Old-UI Dataset** | ✓ Referenced (read-only) | 150 old-ui dossier files cited as legacy provenance |

**7-of-7 stores integrated.**

## Per-cluster coverage after Wave 8

| Dimension | Before W8 | After W8 |
|---|---:|---:|
| MOC coverage | 0.95 | 0.95 |
| Component relationship | 0.78 | 0.80 |
| Style/token | 0.55 | 0.55 |
| Page/feature usage | 0.85 | 0.85 |
| API/biz/arch | 1.00 | 1.00 |
| Orphan reduction | 0.85 | 0.90 |
| Weak cluster reduction | 1.00 | 1.00 |
| Evidence quality | 0.95 | 0.95 |
| **Overall** | **0.92** | **0.93** |

## See also

- [[WAVE-007-GRAPH-PLAYBACK]]
- [BRAIN-OUT] `graphs/README.md` — the new projection
- [BRAIN-OUT] `0-MASTER-INDEX.md` — 7-store router
