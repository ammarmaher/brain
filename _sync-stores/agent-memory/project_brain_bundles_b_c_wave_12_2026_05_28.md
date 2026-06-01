---
name: brain-bundles-b-c-wave-12-2026-05-28
description: Wave 12 — Bundle B (self-maintaining) + Bundle C (self-explaining) + compatibility fix · 4 maintenance scripts (drift detector + implicit-edge emitter + trust scoring + wave diff) + /brain-verify orchestrator skill + BQL forward-compat upgrade · orphan count dropped 280→166 (-40%) · 457 nodes now trust-tiered · BQL auto-discovers future wave-*.json files
metadata: 
  node_type: memory
  type: project
  originSessionId: 1ddc4de1-42ef-4b42-b947-16d520447c6a
---

# Bundle B + C + compatibility fix — Wave 12

🟢 **WAVE-12-LANDED 2026-05-28T01:00:00Z** — Orchestrator-mode wave following user's "do the best to make all things work and be more compatible." Bundle B + C from yesterday's recommendation analysis plus the critical false-orphan encoding-artifact fix.

## Headline numbers

| Metric | Before W12 | After W12 | Delta |
|---|---:|---:|---:|
| Orphan-count | 280 | 166 | **-114** (-40%) |
| Total edges | 306 | 470 | **+164** |
| Nodes with trust tier | 0 | 457 | **+457** |
| BQL sources auto-loaded | 7 (hardcoded) | 9+ (globbed) | forward-compat |
| Maintenance scripts | 0 | 4 | new infrastructure |
| Graph coverage overall | 0.94 | **0.96** | +2 pts |

## What landed

### 4 maintenance scripts in `200-Graph/graph/`

1. **`verify-evidence.js`** (165 lines) — drift detector. Walks every node's `evidence:` paths, checks file existence, emits report at `.health/evidence-drift-<date>.json`. First run flagged 111 broken paths across 108 nodes.

2. **`emit-implicit-edges.js`** (175 lines) — backfill emitter. Emits 164 implicit edges that were described in wave-playback markdown but never encoded as JSON: 66 EVIDENCED_BY + 42 GOVERNED_BY_PES_RULE + 37 HAS_VALIDATION + 5 IN_MODULE + 8 PARENT_MOC + 4 GOVERNED_BY_ARCHITECTURE_RULE + 2 AFFECTS_VISUAL_AREA.

3. **`apply-trust-scores.js`** (165 lines) — VERIFICATION-STATUS ladder promotion. Tier breakdown: 70 ✋runtime / 20 🟢code / 349 🟡structural / 38 🔴unverified. Written to `trust-overlay.json`, auto-merged into BQL via `n.trust` field.

4. **`wave-diff.js`** (145 lines) — per-wave audit. Modes: `--wave N` / `--from A --to B` / `--since N`. Validates each wave's claimed additions against actual graph state.

### BQL upgrade (`query.js`)

- **Glob loader** — replaced hardcoded `safeReadJson('wave-XXX.json')` lines with `fs.readdirSync(deltaDir).filter(f => f.endsWith('.json'))`. Auto-discovers `wave-013.json`, `wave-014.json`, etc. Picked up `implicit-edges-wave-12.json` immediately.
- **Trust filter** — new `--trust runtime|code|structural|unverified` CLI flag. Lets agents query e.g. "show me runtime-verified pages" via `--trust runtime --filter type=Page`.
- **Trust annotation** — every node returned by any query now carries `trust` + `trust_reason` fields.

### `/brain-verify` skill + slash command

- [VAULT] `.claude/skills/brain-verify/SKILL.md` — auto-triggers on health-check phrases ("check brain health", "drift check", "trust score", "wave diff", "fix orphan count")
- [VAULT] `.claude/commands/brain-verify.md` — slash command interface with sub-commands `drift | emit-edges | trust | wave-diff | all`

## What this enables for agents

| Question | How to answer (post-Wave-12) |
|---|---|
| "What's actually runtime-verified?" | `node query.js --trust runtime` — returns 70 nodes (PES + roles + 2 browser-verified pages) |
| "What does the brain claim that isn't backed by evidence?" | `node query.js --trust unverified` — returns 38 stub/inferred nodes |
| "Is the graph fresh? Any broken citations?" | `/brain-verify drift` — runs verify-evidence.js + reports |
| "What did Wave N add?" | `node wave-diff.js --wave 5` — shows the 82 new nodes / 0 explicit edges (and the implicit-edges-wave-12.json that backfilled them) |
| "PES key K — what governs it + who uses it?" | `node query.js --id <pes-key>` — now returns explicit GOVERNED_BY edges (was empty pre-Wave-12) |

## Compatibility wins

1. **Forward-compat BQL** — future wave delta files are auto-discovered. Zero code change when Wave 13/14/... arrive.
2. **Trust-tier as first-class property** — security-class decisions per [BRAIN-OUT] DECISION-PROTOCOL.md can now check `n.trust === 'runtime'` before trusting a fact.
3. **Self-maintenance via scripts** — graph doesn't rely on perfect human discipline; the drift detector catches rot.
4. **Audit trail queryable** — `wave-diff.js` makes the wave-by-wave story machine-checkable, not just narrative.

## Rules emitted (reusable)

- **Hardcoded file lists in script loaders are a forward-compat liability** — always glob the directory. The BQL grew from 7 hardcoded sources to ∞ via 5 lines of fs.readdirSync.
- **Encoding artifacts (false orphans) compound** — 280 reported orphans was scary even though only ~20 were real. Always emit explicit edges per wave; don't rely on summary-shape JSON.
- **Trust-tier promotion is a "free" intelligence win** — VERIFICATION-STATUS.md was prose; promoting its ladder to per-node JSON property took 165 lines + makes the entire graph filterable by verification quality.
- **Drift detector should ship from Wave 1, not Wave 12** — would have caught path-format inconsistencies earlier. Note for future graph-from-scratch projects.
- **Slash command + skill pair for every maintenance operation** — slash command for explicit, skill for auto-trigger. `/brain-verify` + `/brain-context` are the pattern; future skills should follow.

## Stop conditions

7/7 stop conditions still met. Wave 12 didn't change them; it improved quality within the met threshold.

## What's still pending from yesterday's 10-item list

- **Item #4 — xlsx watcher (`/brain-resync-validation`)** — slash command that diffs Validations.xlsx against current V-rule nodes + emits new REPLACES/Conflict edges. Probably 1 wave of work.
- **Item #5 — `when-to-consult` backfill on every node** — rolling (1 wave per cluster). Highest-effort, medium-impact.
- **Item #9 — PR → graph edges** — needs git hook (user approval per CLAUDE.md no-auto-commit rule).
- **Item #10 — Active-learning capture** — defer to GSD skill's existing Approved Learning Mode.

## Related

- [[project_brain_query_layer_wave_11_2026_05_28]] — Bundle A (BQL + /brain-context)
- [[project_obsidian_graph_playback_loop_complete_2026_05_27]] — 10-wave build that produced the data
- [[project_validation_xlsx_sot_flip_wave_f_2026_05_24]] — the SoT invariant trust scoring preserves
