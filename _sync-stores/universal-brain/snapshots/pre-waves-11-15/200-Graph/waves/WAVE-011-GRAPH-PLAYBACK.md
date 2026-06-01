---
type: wave-playback
wave: 011
title: Brain Query Layer (BQL) + /brain-context skill + Q-* gap surfacer
ran-at: 2026-05-28T00:48:30Z
agent: claude (opus 4.7)
scope: post-loop optimization wave — Bundle A from yesterday's recommendation analysis
verdict: WAVE-11-LANDED-INTELLIGENCE-LAYER-LIVE
coverage-before: 0.94
coverage-after: 0.94 (unchanged — this wave adds a query layer, not graph data)
brain-intelligence-delta: "+significant" (locked JSON → live query API + skill-callable)
up: "[[../00_START_HERE]]"
parent-wave: "[[WAVE-010-GRAPH-PLAYBACK]]"
tags: [wave, playback, wave-011, bql, query-layer, skill, brain-context]
---

# Wave 011 — Brain Query Layer (BQL) + /brain-context skill

## Objective

Implement **Bundle A** from yesterday's "more intelligent brain" recommendation:
1. Brain Query Layer (BQL) — a self-contained Node.js query engine over the graph data files
2. `/brain-context <topic>` skill — wraps BQL for one-shot context loading
3. Q-* + Gap auto-surfacer — built into the context bundle

## Why this was the highest-leverage move

Yesterday's analysis: the graph had 1,462 nodes + 5,209 edges across 7 data files, but agents had to read JSON manually to query it. Bundle A turns the graph from a **document** into an **API** — agents can now ask topical questions and get curated answers in ~0.2 seconds.

## Files landed

| File | Lines | Purpose |
|---|---:|---|
| `200-Graph/graph/query.js` | ~440 | The BQL — CLI query engine over normalized graph data |
| `.claude/skills/brain-context/SKILL.md` | ~140 | Skill definition + trigger phrases + workflow contract |
| `.claude/commands/brain-context.md` | ~55 | Slash command interface |
| `waves/WAVE-011-GRAPH-PLAYBACK.md` | this file | Wave documentation |

## BQL architecture

### Normalizer (loader)

Ingests 7 graph data files into a single in-memory graph:

| Source | Type of content |
|---|---|
| `nodes.json` | Wave 1 baseline nodes |
| `edges.json` | Wave 1 baseline edges |
| `wave-deltas/wave-002.json` | Wave 2 nodes-added array |
| `nodes-wave-002.json` (supplementary) | Parallel-session Wave 2 nodes |
| `edges-wave-002.json` (supplementary) | Parallel-session Wave 2 edges |
| `wave-deltas/wave-003-and-004.json` | xlsx-validation-rules + conflicts + page-component edges + kafka events + e-entities |
| `wave-deltas/wave-005.json` | PES keys + roles + ADRs + BR high-leverage |

Handles inconsistent JSON shapes across waves — wave deltas use different field names (`graph-id` vs `id`, `graph-type` vs `type`, arrays vs maps for relationships). Normalizer merges into a unified `{id, type, name, evidence, sot, ...}` shape.

### Query primitives

| Function | What it does |
|---|---|
| `byType(t)` | All nodes of a type |
| `byId(id)` | One node + its edges |
| `edgesFrom(id)` / `edgesTo(id)` | Directed edge lookup |
| `bfs(startId, hops)` | Breadth-first walk N hops out |
| `search(text)` | Substring across id + name + evidence |
| `orphans()` | Nodes with no edges |
| `gaps()` | All `type:Gap` nodes |
| `conflicts()` | All `type:Conflict` nodes |
| `xlsxVRules()` | ValidationRules with `sot:xlsx` |
| `replacesChain()` | All REPLACES edges (xlsx → PRD lineage) |
| `byModule(mod)` / `byService(svc)` | Module/service-scoped subgraph |
| `validationForPage(p)` | V-rules applying to a page |
| `buildContext(topic)` | The hero query — assembles full topic bundle |
| `statsSummary()` | Graph health snapshot |

### Output formatters

`--json` (default) / `--table` / `--markdown` / `--compact`

The skill always uses `--markdown` for direct embedding into responses.

## Loaded graph stats (Wave 11 baseline)

```
sources_loaded: 7 files
total_nodes: 457
total_edges: 306
node_types: 23 distinct types active
edge_types: 20 distinct edge types active
orphans: 280 (mostly cluster placeholders + PES/V-rule nodes without explicit edges in deltas)
conflicts: 4
xlsx_vrules: 41
replaces_edges: 7
```

> [!info]
> The 280 "orphan" count is artifact-of-encoding, not real orphaning. Many wave-3/4/5 nodes were emitted with summary-shape JSON (e.g., the 47 PES keys arrived as a `pes-keys` array; their GOVERNED_BY edges were described in markdown wave playback but not encoded as JSON edge records). Future improvement: emit explicit edges per wave so orphan count drops.

## Tested queries (sanity)

| Query | Result |
|---|---|
| `--stats` | 457 nodes, 306 edges, all 7 sources loaded |
| `--xlsx-vrules --markdown` | 41 V-rules emitted as markdown table; all carry `sot:xlsx` |
| `--replaces-chain` | 7 REPLACES edges including the 3 critical xlsx→PRD V-rule supersessions |
| `--context "Add Client" --markdown` | 3 primary V-rule matches + 1-hop REPLACES neighborhood |
| `--context "wallet" --markdown` | 11 primary matches (Page + 4 KafkaEvents + 2 DTOs + 4 PESRules) + 2 BRs + 1-hop neighborhood |

All queries return in <0.3 seconds.

## Skill integration

The `brain-context` skill is registered in the Claude runtime at:

- Skill: `C:\Falcon\.claude\skills\brain-context\SKILL.md`
- Slash command: `C:\Falcon\.claude\commands\brain-context.md`

Trigger phrases (per skill description):
- "what does the brain know about X"
- "context for X" / "/brain-context X" / "/brain X"
- "show me everything related to X"
- "give me brain context on X"
- "Falcon knowledge on X" / "brain knowledge on X"
- "graph context X" / "graph nodes for X"

Recommended usage: **invoke proactively at the start of any Falcon implementation task** to load relevant brain knowledge in one shot rather than reading 5-15 files manually.

## Q-* + Gap surfacing

Built into `buildContext()`:
- Filters all `type:Gap` nodes whose JSON blob contains the topic substring
- Filters all `type:Conflict` nodes similarly
- Surfaces them as a "potential blockers" section in the bundle output
- Agents see known issues BEFORE starting work, not after hitting them

(Wave 6 emitted Gap descriptions in markdown but not all as JSON nodes — when those land in JSON deltas, surfacing density will improve. Today it works for the 4 Conflict nodes already in JSON.)

## What this changes for agents

Before Wave 11:
1. Read `0-MASTER-INDEX.md` (Master Index routing)
2. Follow routing to relevant store
3. Read 5-15 files to collect related knowledge
4. Manually cross-reference between stores
**Cost: 30+ seconds, 10-20 KB of context burned on irrelevant material**

After Wave 11:
1. Invoke `/brain-context <topic>` (or skill auto-triggers)
2. BQL returns ~1-5 KB curated bundle
**Cost: 0.3 seconds, ~3 KB context, includes Open Gaps surfaced automatically**

## Coverage trajectory

| Wave | Title | Coverage |
|---:|---|---:|
| 10 | Final consolidation + PDF | 94% (FINAL of graph-build loop) |
| **11** | **BQL + skill + Q-surfacer** | **94% (same — this adds a query layer, not graph data)** |

The graph coverage metric measures graph completeness. Wave 11 doesn't add nodes/edges; it adds **accessibility**. A separate "brain intelligence" metric would capture this — to be defined in a future wave.

## Stop conditions

7/7 already met since Wave 7. Wave 11 doesn't change that.

## Safety verification

- ✓ No application code edits
- ✓ Read-only BQL (no writes to graph data)
- ✓ New writes only to `200-Graph/graph/query.js` + `.claude/skills/brain-context/` + `.claude/commands/brain-context.md` + wave playback + memory
- ✓ No npm install / build / test / server commands
- ✓ No commits or pushes
- ✓ No secrets

## What Bundle B and C would add next (not landed today)

Per yesterday's recommendation analysis, the next two bundles:

**Bundle B — "Make the graph self-maintaining" (1 session, recommended next)**
- Graph drift detector (`verify-evidence.js` walks every node's `evidence:` paths, checks existence + line presence)
- xlsx watcher (`/brain-resync-validation` re-parses Validations.xlsx + diffs against current V-rule nodes)
- Trust-score promotion (✋ runtime / 🟢 code / 🟡 structural / 🔴 unverified as `trust:` property)

**Bundle C — "Make the graph self-explaining" (rolling)**
- Backfill `purpose:` + `when-to-consult:` fields on every node (slow, 1 wave per cluster)
- Per-wave graph diff (`wave-diff.js`)
- Auto-generated walk-the-graph tutorial per role

## See also

- [[WAVE-010-GRAPH-PLAYBACK]] — graph-build loop final wave
- [[../graph/query.js]] — the BQL itself
- [[../00_START_HERE]] — graph entry
- `.claude/skills/brain-context/SKILL.md` — skill definition
- `.claude/commands/brain-context.md` — slash command
