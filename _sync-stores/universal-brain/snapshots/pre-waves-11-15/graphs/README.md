---
type: brain-output-graph-projection
title: Falcon Knowledge Graph — Brain Outputs Projection
canonical-location: "C:/Falcon/falcon-wiki/200-Graph/"
projected-at: 2026-05-27T16:50:00Z
wave: 8
---

# Brain Outputs — Knowledge Graph Projection

> [!note]
> The canonical Falcon Knowledge Graph lives in **`C:/Falcon/falcon-wiki/200-Graph/`** (the Obsidian SoT vault). This directory is the **Brain Outputs side projection** — machine-readable copies of the graph data files + an index linking to the canonical markdown.

## Why a Brain Outputs side projection

Per [BRAIN-OUT] `0-MASTER-INDEX.md`, the 7 Falcon knowledge stores have distinct responsibilities:
- **Falcon Wiki** (`falcon-wiki/`) — Obsidian SoT vault, human-readable, Azure DevOps synced
- **Brain Outputs** (`Brain Outputs/`) — machine-readable structured datasets, scanner-watched

The graph is **canonical in Falcon Wiki** but **also useful machine-readably in Brain Outputs** for:
- Future scanner integration (scan-authority.ps1 can ingest graph delta files)
- Tool-agnostic export (Gephi, igraph, NetworkX)
- Brain SK skills that build on graph data

## Files projected here

| Source (canonical) | Projected (Brain Outputs) | Format |
|---|---|---|
| `falcon-wiki/200-Graph/graph/nodes.json` | `Brain Outputs/graphs/nodes.json` (this dir) | JSON |
| `falcon-wiki/200-Graph/graph/edges.json` | `Brain Outputs/graphs/edges.json` | JSON |
| `falcon-wiki/200-Graph/graph/nodes.csv` | `Brain Outputs/graphs/nodes.csv` | CSV |
| `falcon-wiki/200-Graph/graph/edges.csv` | `Brain Outputs/graphs/edges.csv` | CSV |
| `falcon-wiki/200-Graph/graph/wave-deltas/wave-NNN.json` | `Brain Outputs/graphs/wave-deltas/wave-NNN.json` | JSON deltas |

> [!info]
> Wave 8 creates the projection symlinks/copies. For Wave 7-8 the projection is a **pointer file** (this README); structured JSON files come Wave 8.

## How agents should consume

1. **Reading the canonical graph** → open `falcon-wiki/200-Graph/00_START_HERE.md` (human-readable)
2. **Reading for tool input** → use `Brain Outputs/graphs/nodes.json` + `edges.json` (machine-readable)
3. **Reading per-wave deltas** → walk `wave-deltas/wave-NNN.json` in numeric order

## Cross-link

→ [[falcon-wiki/200-Graph/00_START_HERE]]
→ [[falcon-wiki/200-Graph/GRAPH_SCHEMA]]
→ [[falcon-wiki/200-Graph/waves/WAVE-001-GRAPH-PLAYBACK]] through WAVE-010

## Brain SK mirror

The Brain SK side is at `C:/Falcon/Brain SK/_obsidian/95-Graph/README.md` (pointer stub). Same canonical-location rule.

## See also

- [BRAIN-OUT] `0-MASTER-INDEX.md` — 7-store knowledge router
- [BRAIN-OUT] `BRAIN-ARCHITECTURE-CHART.md` — visual chart of the ecosystem
- [BRAIN-OUT] `scan-metadata/bootstrap-health.json` — scanner state
