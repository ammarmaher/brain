---
type: session-handoff
title: Waves 13-15 — Next-session execution packet
created: 2026-05-28
parent-plan: C:\Falcon\falcon-wiki\200-Graph\PLAN-WAVES-11-15-TO-97-PERCENT.md
status: READY-TO-EXECUTE-IN-FRESH-SESSION
---

# Waves 13-15 Handoff Packet

> [!info]
> This file is the one-stop briefing for the next session. Read it first; it contains everything needed to execute Waves 13, 14, 15 without re-discovering context.

## Status as of 2026-05-28T02:30Z

| Wave | Status | Key output |
|---|---|---|
| 11 | ✅ COMPLETE | `wave-deltas/wave-011.json` · `40-Tokens/INDEX.md` · `waves/WAVE-011-SUPPLEMENTARY-2026-05-28.md` |
| 12 | ✅ COMPLETE | `wave-deltas/wave-012.json` · `BE_FE_WIRE_LEVEL_INTEGRATION_GRAPH.md` · `waves/WAVE-012-GRAPH-PLAYBACK-2026-05-28.md` |
| **13** | **READY** | spawn 4 parallel agents |
| 14 | queued | spawn 3 parallel agents (after 13) |
| 15 | queued | consolidate + verify + re-PDF |

## Pre-flight (already done — don't redo)

- Snapshot: `C:\Falcon\universal-brain\snapshots\pre-waves-11-15\` (42 files captured + Obsidian configs)
- `falcon-wiki/40-Tokens/` directory: created (was empty)
- Brain state: `universal-brain/state/waves-11-15-progress.json` tracks workstream (separate from any other session's `current-task.json`)

## Coverage now vs target

| Dimension | Current | Target | Wave that closes |
|---|---:|---:|---|
| Authority | 100% | ✅ | maintain |
| Backend | 99% | ✅ | maintain |
| Architecture | 95% | 99% | **Wave 14** |
| Validation | 95% | 99% | **Wave 13** |
| Cross-store | 99% | ✅ | maintain |
| Business rules | 90% | 98% | **Wave 13** |
| Frontend | 97% | ✅ | maintain |
| MOC | 97% | 98% | Wave 15 |
| Component-rel | 97% | ✅ | maintain |
| Style/token | 97% | ✅ | maintain |
| Page→component | 98% | ✅ | maintain |
| API↔biz↔arch | 100% | ✅ | maintain |
| Orphan reduction | 95% | 98% | Wave 15 |
| Weak cluster | 100% | ✅ | maintain |
| Evidence | 95% | 97% | Wave 15 |
| **Weighted total** | **98.5%** | ≥97% on every dim | Waves 13-15 fill remaining |

# WAVE 13 — Validation + Business Rule Closure (next to execute)

**Effort:** ~2.5 hours · **Risk:** medium

## Spawn 4 parallel agents:

### Agent A — xlsx canonical parse
Read all TSVs in `C:\Falcon\Source_of_truth_theme\.xlsx-parse\dump-SOT\`. Build canonical xlsx-field → ValidationRule map. Output JSON with every field × validation rule combo, marked `sot: xlsx`.

### Agent B — PRD-only V-rule cross-walk
Read all 27 PRD-only V-rule files in `C:\Falcon\Brain SK\_obsidian\30-Validation\V-*.md` (frontmatter `sot: prd`). For each, cross-check Agent A's xlsx map. Emit:
- `xlsx-silent-acceptable` (xlsx doesn't cover this field — keep PRD authority)
- `needs-xlsx-revision` (xlsx mentions field but contradicts PRD)
- `confirmed-by-both` (both agree)

### Agent C — BR-* enforcer tracing
Read all 5 `BUSINESS_RULES.md` files in `C:\Falcon\Brain Outputs\prd\modules\<m>\BUSINESS_RULES.md`. For each of 225 BR-* rules, cross-reference Wave 12's endpoint + DTO + page + component data to identify the enforcer. Use `wave-deltas/wave-012.json` as input. Emit JSON of BR-* → enforcer with evidence-strength.

### Agent D — Q-UM-07 reconciliation + KAFKA-GAP-01 + KAFKA-GAP-02
- Read `_pending-questions/Q-UM-07-RESOLVED-2026-05-19.md` and determine if standing-truth ("Q-UM-07 blocked on Drive re-export") needs update or if a real residual gap remains.
- Resolve KAFKA-GAP-01 (topic-name drift): `commerce.user-creation-requested.v1` vs `commerce.user-created.v1` — search backend code to identify the actual published topic.
- Resolve KAFKA-GAP-02 (shared consumer group): verify if `commerce-service` group is actually shared by checking Kafka consumer registration code in Commerce + Charging.

## Wave 13 outputs

- `waves/WAVE-013-GRAPH-PLAYBACK-2026-05-28.md`
- `graph/wave-deltas/wave-013.json`
- `200-Graph/VALIDATION_CONFLICT_RESOLUTIONS.md` (NEW)
- `200-Graph/BR_ENFORCER_MAP.md` (NEW)
- Updates: GRAPH_COVERAGE_REPORT.md row

## Expected coverage delta after Wave 13

Validation 95→99% · Business rules 90→98% · Total 98.5→99%

---

# WAVE 14 — Architecture + Pattern Adherence

**Effort:** ~2 hours · **Risk:** low (read-only audit + edge emission)

## Spawn 3 parallel agents:

### Agent A — ADR adherence matrix
Read 24 files in `C:\Falcon\Brain SK\_obsidian\35-Architecture\` (8 ADRs + 16 supporting). For each ArchitectureRule, list which components/services/pages adhere. Emit `GOVERNED_BY_ARCHITECTURE_RULE` edges. Use Wave 12 data as input.

### Agent B — Pattern usage + Anti-pattern violations
Read 14 patterns in `C:\Falcon\Brain SK\_obsidian\90-Approved-Patterns\` + `C:\Falcon\Brain Outputs\datasets\authority-dataset\15-implementation-pitfalls\ANTI-PATTERNS.md`. For each pattern, find ≥3 component/page consumers + emit `USES_PATTERN` edges. For each anti-pattern, find documented violations + emit `HAS_ANTI_PATTERN` edges.

### Agent C — Dark-mode cascade closure (P0-08 drifts)
Resolve the 5 drift findings from Wave 11:
- Focus-ring color drift (semantic blue vs actual teal)
- 27-stop neutral over-granulation (consolidate to 18)
- Spacing aliases collisions (-14↔-9, -16↔-11, -20↔-12)
- Button fallback hex drift
- Semantic Tier-2 tokens not in @theme
Emit `Conflict` nodes with resolution + `REPLACES` edges.

## Wave 14 outputs

- `waves/WAVE-014-GRAPH-PLAYBACK-2026-05-28.md`
- `graph/wave-deltas/wave-014.json`
- `200-Graph/ARCHITECTURE_ADHERENCE_REPORT.md` (NEW)
- `200-Graph/PATTERN_USAGE_GRAPH.md` (NEW)
- `200-Graph/ANTI_PATTERN_VIOLATIONS.md` (NEW)
- `200-Graph/THEME_DRIFT_RESOLUTIONS.md` (NEW)

## Expected coverage after Wave 14

Architecture 95→99% · Pattern compliance ~70→97% · Frontend (dark-mode) 97→98% · Total 99→99.3%

---

# WAVE 15 — Consolidate + Verify + Re-PDF (final wave)

**Effort:** ~1.5 hours · **Risk:** low (read-mostly with one consolidation write)

## Sequential (no parallel agents needed — orchestrator does it)

1. **Merge wave-deltas → master nodes.json + edges.json (v2):**
   - Inputs: `nodes.json` (Wave 1 baseline) + all 12 `wave-deltas/wave-NNN.json` files (Waves 2-13-14)
   - Output: consolidated `graph/nodes.json` + `graph/edges.json` (v2)
   - Preserve originals: `graph/nodes-wave-01-baseline.json` + `graph/edges-wave-01-baseline.json`

2. **Regenerate CSV exports:** `graph/nodes.csv` + `graph/edges.csv`

3. **Run scanner:** `falcon-wiki/scripts/scan-authority.ps1 -CheckOnly` — expect 67/67 source files clean

4. **Verify 10 final gates:**
   - Every dimension ≥ 97% (from updated GRAPH_COVERAGE_REPORT)
   - Conflicts = 0 (or each has REPLACES/decision)
   - Every Component has TOKENS.md or `deprecated` flag — already verified Wave 11 (61/61)
   - Every Endpoint has EXPOSED_BY + USES_DTO + VALIDATED_BY — verified Wave 12 for 150 endpoints
   - Every Page has ≥1 USES_COMPONENT + ≥1 CONNECTS_TO_API — verified Wave 12 for 14/14 pages
   - All 25 WrapperComponent ↔ StencilComponent pairs have WRAPS edge — Wave 11 emitted ~48
   - Zero inferred-only edges
   - Scanner 67/67 clean
   - PDF regenerated
   - Sync state ready

5. **Regenerate PDF:** `FALCON-KNOWLEDGE-GRAPH-FINAL-V2-REPORT.pdf` via `md-to-html.js` + Chrome headless

6. **Update aggregate-summary.json:** `Brain Outputs/graphs/aggregate-summary.json`

7. **Write final wave playback:** `waves/WAVE-015-GRAPH-PLAYBACK-2026-05-28.md`

8. **Add memory entry:** `~/.claude/projects/C--Falcon/memory/project_obsidian_graph_waves_11_to_15_2026_05_28.md` + MEMORY.md index

9. **Update 00_START_HERE.md** to point at the v2 PDF

## Final acceptance

If all 10 gates pass → Wave 15 declares plan COMPLETE.
If any gate fails → halt-and-flag rather than declare done; surface specific gap for follow-up.

---

# Safety rules (every wave)

- ✅ No app code edits
- ✅ No git commits or pushes
- ✅ No npm install / build / test runner
- ✅ No docker compose / dev server starts
- ✅ Writes confined to `falcon-wiki/200-Graph/`, `falcon-wiki/40-Tokens/`, `universal-brain/state/`, `Brain Outputs/graphs/`, home-memory
- ✅ Evidence-only edges throughout
- ✅ Preserve all prior wave-delta files (Wave 15 consolidates by reading them, doesn't delete)
- ✅ Snapshot already taken in pre-flight — rollback path exists

# How the next session starts

1. Read this file (`universal-brain/state/WAVES-13-15-HANDOFF.md`).
2. Read `falcon-wiki/200-Graph/PLAN-WAVES-11-15-TO-97-PERCENT.md` for full plan context (optional refresher).
3. Read `universal-brain/state/waves-11-15-progress.json` for current status.
4. Skip pre-flight — already done.
5. Spawn Wave 13's 4 parallel agents per the briefs above.
6. Aggregate → write Wave 13 outputs.
7. Spawn Wave 14's 3 agents.
8. Spawn Wave 15 (sequential).
9. Update memory + declare complete.

Estimated session budget: ~6 hours of execution time + minimal user interaction.

# What NOT to do

- Don't re-walk components/services/pages (already done in Waves 11+12 — read the deltas).
- Don't overwrite `current-task.json` if it shows another session's task (use `waves-11-15-progress.json` instead).
- Don't push to sync repo without explicit user "push" instruction.
- Don't declare Wave 15 done if any of 10 gates fail — halt-and-flag.

# Key paths to reference

| What | Path |
|---|---|
| Plan doc | `falcon-wiki/200-Graph/PLAN-WAVES-11-15-TO-97-PERCENT.md` |
| Progress tracker | `universal-brain/state/waves-11-15-progress.json` |
| Snapshot | `universal-brain/snapshots/pre-waves-11-15/` |
| Wave 11 delta | `falcon-wiki/200-Graph/graph/wave-deltas/wave-011.json` |
| Wave 12 delta | `falcon-wiki/200-Graph/graph/wave-deltas/wave-012.json` |
| Wave 12 headline doc | `falcon-wiki/200-Graph/BE_FE_WIRE_LEVEL_INTEGRATION_GRAPH.md` |
| Wave 1 nodes baseline | `falcon-wiki/200-Graph/graph/nodes.json` |
| Wave 1 edges baseline | `falcon-wiki/200-Graph/graph/edges.json` |
| Coverage report | `falcon-wiki/200-Graph/GRAPH_COVERAGE_REPORT.md` |
| Stop conditions | `falcon-wiki/200-Graph/GRAPH_GAPS_AND_NEXT_STEPS.md` |
| xlsx canonical | `Source_of_truth_theme/Validations.SOT-2026-05-24.xlsx` |
| xlsx parsed TSVs | `Source_of_truth_theme/.xlsx-parse/dump-SOT/*.tsv` |
| V-rule files | `Brain SK/_obsidian/30-Validation/V-*.md` |
| Q-* tickets | `Brain Outputs/datasets/authority-dataset/_pending-questions/*.md` |
| Architecture rules | `Brain SK/_obsidian/35-Architecture/*.md` |
| Approved patterns | `Brain SK/_obsidian/90-Approved-Patterns/*.md` |
| Anti-patterns | `Brain Outputs/datasets/authority-dataset/15-implementation-pitfalls/ANTI-PATTERNS.md` |
