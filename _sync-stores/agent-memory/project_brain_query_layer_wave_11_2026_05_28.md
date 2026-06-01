---
name: brain-query-layer-wave-11-2026-05-28
description: Wave 11 (post-loop intelligence layer) — Brain Query Layer (BQL) + /brain-context skill + Q-*/Gap auto-surfacer · turns the 1462-node graph from locked JSON into a live query API · self-contained Node.js script + registered Claude skill + slash command · 0.3s topical context bundle replaces 5-15 file manual reads
metadata: 
  node_type: memory
  type: project
  originSessionId: 1ddc4de1-42ef-4b42-b947-16d520447c6a
---

# Brain Query Layer (BQL) + /brain-context skill — Wave 11

🟢 **WAVE-11-LANDED 2026-05-28T00:48:30Z** — Post-graph-build-loop intelligence layer. Highest-ROI item from yesterday's "more intelligent brain" recommendation analysis (Bundle A).

## What landed

| File | Purpose |
|---|---|
| [VAULT] `falcon-wiki/200-Graph/graph/query.js` (~440 lines) | Self-contained Node.js BQL — no npm deps, read-only over graph data |
| `.claude/skills/brain-context/SKILL.md` | Skill definition; triggers on "what does the brain know about X" / "/brain-context X" / "context for X" / "graph context X" etc |
| `.claude/commands/brain-context.md` | Slash command interface |
| [VAULT] `falcon-wiki/200-Graph/waves/WAVE-011-GRAPH-PLAYBACK.md` | Wave documentation |
| `universal-brain/state/current-task.json` | Task lifecycle |

## What BQL can do

```bash
# Stats
node 200-Graph/graph/query.js --stats

# Type filter
node 200-Graph/graph/query.js --type ValidationRule
node 200-Graph/graph/query.js --type PESRule

# The hero query — full context bundle for any topic
node 200-Graph/graph/query.js --context "Add Client" --markdown
node 200-Graph/graph/query.js --context "wallet" --markdown
node 200-Graph/graph/query.js --context "organization-hierarchy" --markdown

# Specialty queries
node 200-Graph/graph/query.js --xlsx-vrules --markdown      # all sot:xlsx V-rules (41 of them)
node 200-Graph/graph/query.js --replaces-chain              # 7 REPLACES edges (3 critical xlsx→PRD)
node 200-Graph/graph/query.js --validation-for page:organization-hierarchy
node 200-Graph/graph/query.js --module mod:account-mgmt
node 200-Graph/graph/query.js --service svc:commerce
node 200-Graph/graph/query.js --from comp:falcon-button --hops 2
node 200-Graph/graph/query.js --search "wallet" --markdown
node 200-Graph/graph/query.js --id pes:sys.wallet.transfer
```

## Stats loaded

- 7 data files normalized: Wave 1 baseline + 5 wave deltas + 2 supplementary
- 457 nodes across 23 active types
- 306 edges across 20 active types
- 41 xlsx-derived V-rules surfaced
- 7 REPLACES edges (including the 3 critical xlsx → PRD V-rule supersessions)
- 4 Conflict nodes

## Why this matters

**Before Wave 11:** agents walking cold had to:
1. Read `0-MASTER-INDEX.md` for routing
2. Read 5-15 files to gather topical context
3. Cross-reference between Falcon Wiki / Brain SK / Brain Outputs manually
Cost: ~30 seconds + 10-20 KB context burned on irrelevant material

**After Wave 11:** `/brain-context <topic>` returns curated bundle in 0.3 seconds, ~1-5 KB markdown, including:
- Primary node matches (up to 15)
- Related ValidationRules with `sot:` tag (xlsx wins over PRD per 2026-05-24 invariant)
- Related BusinessRules (high-leverage subset)
- Related PESRules (permissions + namespace + purpose)
- **Open Gaps surfaced as potential blockers BEFORE work starts**
- Conflicts (PRD ↔ xlsx ↔ code disagreements with documented winners)
- 1-hop neighborhood for top-3 matches

## Source-prefix preserved

The BQL output already carries `[BRAIN-OUT] graph/nodes.json + edges.json + wave-deltas/` source-prefix. Consumers preserve when quoting.

## Validation SoT invariant preserved

The `sot:` field on every ValidationRule node propagates through queries. Where xlsx supersedes PRD, the REPLACES edges are first-class queryable data (`--replaces-chain`). Per `project_validation_xlsx_sot_flip_wave_f_2026_05_24` — xlsx always wins.

## Next bundles (not landed)

Per the recommendation analysis, Bundles B + C remain:

**Bundle B — "Make the graph self-maintaining"**
- Drift detector (`verify-evidence.js`) — walks every node's evidence paths, marks broken as NEEDS_REVIEW
- xlsx watcher slash command (`/brain-resync-validation`) — re-parses Validations.xlsx, diffs, emits new REPLACES/Conflict
- Trust-score promotion — ✋runtime / 🟢code / 🟡structural / 🔴unverified as `trust:` property

**Bundle C — "Make the graph self-explaining"**
- Backfill `purpose:` + `when-to-consult:` fields on every node
- Per-wave graph diff
- Auto-generated walk-the-graph tutorial per role

## Rules emitted (reusable)

- **Knowledge graph value scales with queryability, not file count** — Wave 11 is 1 file (~440 lines) but unlocks the value of all 1,462 nodes that took 10 waves to build. Build the API alongside the data, not after.
- **Self-contained Node scripts beat npm-dependent tools for skill backends** — no install, no maintenance, runs anywhere Node runs. ~440 lines covers a credible query DSL.
- **Skill description should LIST trigger phrases verbatim** — increases auto-trigger reliability. The Claude runtime picks up on phrase patterns.
- **Slash commands + skills are complementary, not redundant** — slash command for explicit invocation, skill for auto-trigger on natural-language triggers. Register both.
- **Context bundles should ALWAYS surface Open Gaps + Conflicts** — these are the highest-leverage info for agents starting work (prevents them missing known blockers).

## Related

- [[project_obsidian_graph_playback_loop_complete_2026_05_27]] — the 10-wave graph-build loop that produced the data BQL now serves
- [[project_validation_xlsx_sot_flip_wave_f_2026_05_24]] — the SoT invariant BQL enforces via `sot:` field + REPLACES edges
- [[project_obsidian_graph_playback_wave_1_2026_05_27]] — Wave 1 foundation
