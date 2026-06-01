---
type: graph-quality
title: Orphan Nodes Review
created: 2026-05-27
wave-introduced: 1
last-updated-wave: 1
up: "[[00_START_HERE]]"
tags: [graph, quality, orphans]
---

# Orphan Nodes Review

> [!warning]
> Orphan = a node with no PARENT_MOC edge and no incoming RELATED_TO / USED_BY / DOCUMENTED_IN edge. Wave 1 identified 4 *cluster-level* orphans (empty/stub vault folders) and 0 *node-level* orphans (all 343 nodes have at least one provenance edge).

## Cluster-level orphans (Wave 1)

These folders exist but are effectively empty or under-populated:

| Cluster | Path | Wave-1 state | Justification | Wave to fix |
|---|---|---|---|---|
| `Tokens` | [VAULT] `falcon-wiki/40-Tokens/` | EMPTY (0 files) | Tokens are inside per-component `TOKENS.md` files, not centralized | Wave 2 will populate via extraction |
| `Validation-Rules` (wiki side) | [VAULT] `falcon-wiki/65-Validation-Rules/` | only `_INDEX.md` | Real V-rules live in Brain SK `30-Validation/` (30 files) | Wave 3 will create projection files + REPLACES edges per SoT-flip |
| `PES-Rules` (Brain SK side) | [BRAIN-SK] `_obsidian/66-PES-Rules/` | only README | Real PES content in [BRAIN-OUT] `authority-dataset/03-pes-keys/` | Wave 5 will project 47 PES keys here |
| `Business-Rules` (Brain SK side) | [BRAIN-SK] `_obsidian/67-Business-Rules/` | 3 topic files | BR-* rules live in [BRAIN-OUT] `prd/modules/<m>/BUSINESS_RULES.md` (180 rules) | Wave 5 will project each BR-* as a node |

## Justified orphans (acceptable)

| Node / cluster | Why it's OK as an orphan |
|---|---|
| Old-UI Dataset files (150 in `Brain Outputs/datasets/old-ui-dataset/10-pages/`) | Legacy provenance reference. Used as evidence FOR other nodes (PAGE was-OLD-version) but not themselves first-class graph nodes. |
| `Brain Outputs/_investigations/`, `_link_probe.txt` | Working directories; not knowledge nodes. |
| `Brain Outputs/discovery/`, `worktrees/` | Process scaffolding; not nodes. |
| `falcon-wiki/Untitled.canvas`, `Brain SK/Untitled.base` | Obsidian-app default files; not nodes. |
| `falcon-wiki/_macros/`, `_mounts/`, `_templates/` | Obsidian plugin / templater config; not nodes. |
| Operational MOCs (`Local-Auth-Recipe`, `Local-Backend-Bring-Up`, `IDE-Setup-Doctrine-*`) | Procedural docs; not nodes the graph needs to traverse. They link OUT to nodes but aren't themselves cluster heads. |

## Node-level orphans

**Wave 1 result: 0 confirmed node-level orphans.**

Every node emitted in Wave 1 carries:
- At least one `EVIDENCED_BY` edge to a source file
- At least one `DISCOVERED_IN_WAVE` edge to Wave-001
- (Most) at least one `PARENT_MOC` edge

The graph builder's evidence-only-edges rule (no fabricated edges) means we don't create unsupported parent-MOC edges — but every Wave-1 node has SOME inbound or outbound edge, so none are fully isolated.

## Wave 2+ orphan-reduction targets

| Wave | Target | Expected impact |
|---|---|---|
| 2 | Populate `40-Tokens/` cluster via extraction | -1 cluster orphan |
| 3 | Project Brain SK V-rules into `65-Validation-Rules/` | -1 cluster orphan |
| 5 | Project PES + BR clusters | -2 cluster orphans |
| 6 | Audit + emit `Gap` nodes for any node still without a parent MOC at that point | ensures node-level orphan count stays at 0 |

## Methodology

For each wave, the orphan check runs:

```
foreach node in graph.nodes:
  inbound_edges = filter(edges, e -> e.to == node.id)
  outbound_edges = filter(edges, e -> e.from == node.id)
  if (inbound_edges + outbound_edges) == [evidence_edges_only]:
    flag as ORPHAN
  if no PARENT_MOC edge AND node.type in {Component, Page, Service, ValidationRule, BusinessRule, PESRule, ArchitectureRule, DTO}:
    flag as MISSING_PARENT_MOC
```

Results land here per wave.

## See also

- [[WEAK_CLUSTERS_REVIEW]]
- [[GRAPH_GAPS_AND_NEXT_STEPS]]
- [[GRAPH_COVERAGE_REPORT]]
