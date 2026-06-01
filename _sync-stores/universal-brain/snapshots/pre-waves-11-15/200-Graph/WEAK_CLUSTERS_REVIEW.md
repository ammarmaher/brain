---
type: graph-quality
title: Weak Clusters Review
created: 2026-05-27
wave-introduced: 1
last-updated-wave: 1
up: "[[00_START_HERE]]"
tags: [graph, quality, weak-clusters]
---

# Weak Clusters Review

> [!summary]
> A weak cluster = a node-type family that the graph has identified BUT cannot densely populate yet because evidence-rich source extraction is required (Wave 2+). Wave 1 flags 6 weak clusters with concrete remediation plans.

## Wave 1 — weak clusters identified

| # | Cluster | Node type(s) | Wave-1 size | Target size (estimate) | Remediation wave |
|---:|---|---|---:|---:|---:|
| 1 | Design tokens | `DesignToken`, `CSSVariable` | 0 + handful from memory | 500-1500 | Wave 2 |
| 2 | Tailwind classes | `TailwindClass` | 0 | 200-500 (unique) | Wave 2 |
| 3 | Directives | `Directive` | 0 | 30-60 | Wave 3 (via FE code grep `*.directive.ts`) |
| 4 | Visual primitives | `Variant`, `Size`, `VisualState` | 0 | 200+ (avg 5 per component × 63) | Wave 2 |
| 5 | Reusable patterns | `Pattern` | 0 | 20-30 | Wave 6 (from [BRAIN-SK] `90-Approved-Patterns/`) |
| 6 | Reports + scans | `Report`, `ScanMetadata` | 1 + 80+ files unindexed | 100+ | Wave 6 |

## Why weak in Wave 1

Wave 1 is intentionally a **breadth-first foundation pass**:
- Catalogue every node-TYPE that exists in the Falcon knowledge ecosystem
- Seed a sample / representative node per type
- Defer dense extraction to subsequent waves

This avoids the failure mode of "Wave 1 takes 20 hours and runs out of context before producing playback".

## Strength of strong clusters (for contrast)

These clusters ARE dense in Wave 1 because the evidence was already structured:

| Cluster | Wave-1 size | Why strong |
|---|---:|---|
| `Component` | 63 | Brain Outputs canonical dossier folder per component |
| `Service` | 9 | Brain Outputs canonical dossier per service |
| `Page` | 14 | Brain Outputs canonical dossier per page |
| `KafkaEvent` | 21 | Brain SK `47-Events/` has one file per event |
| `DTO` (E-*) | 25 | Brain SK `40-API/E-*.md` has one file per entity |
| `ArchitectureRule` | 24 | Brain SK `35-Architecture/` has one file per rule |
| `ValidationRule` | 30 | Brain SK `30-Validation/V-*.md` |
| `MOC` | 76 | `falcon-wiki/00-MOCs/` + Brain SK `*INDEX*.md` |

## Wave 2 plan — Cluster 1 + 2 + 4 (Component-Style-Token expansion)

Spawn 4 parallel Explore agents:
1. Agent A: Read `TOKENS.md` for components 1-20 → emit DesignToken + CSSVariable nodes + DEFINES_* edges
2. Agent B: Read `TOKENS.md` for components 21-40 → same
3. Agent C: Read `TOKENS.md` for components 41-63 → same
4. Agent D: Read [BRAIN-SK] `36-Theming/` 46 files → emit ThemeMode, MAPS_TO_TOKEN, OVERRIDES_TOKEN edges + the Tailwind audit → TailwindClass nodes

For variants/sizes/states: read each component's `API.md` → extract from frontmatter or "Props" section.

## Wave 3 plan — Cluster 3 (Directives)

Use the existing scanner pattern from [BRAIN-OUT] `falcon-wiki/scripts/scan-authority.ps1` — it watches 67 canonical source files. Add a directives glob pattern (`**/*.directive.ts`) under FE code roots (read-only via Grep; never run npm). Each match → `Directive` node + USED_BY edges from consumers.

## Wave 6 plan — Cluster 5 + 6 (Patterns + Reports/Scans)

For Patterns: read each file in [BRAIN-SK] `90-Approved-Patterns/`. Frontmatter likely has structured fields.
For Reports: walk [BRAIN-OUT] `reports/` tree (80+ files across 8 families); each scan run is a `Report` node + DISCOVERED_IN_WAVE links back to the Wave that produced it (if applicable).

## See also

- [[ORPHAN_NODES_REVIEW]]
- [[GRAPH_COVERAGE_REPORT]]
- [[GRAPH_GAPS_AND_NEXT_STEPS]]
