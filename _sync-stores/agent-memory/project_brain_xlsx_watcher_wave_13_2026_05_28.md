---
name: brain-xlsx-watcher-wave-13-2026-05-28
description: "Wave 13 — xlsx watcher / brain-resync-validation skill — re-parses Validations.xlsx TSVs, diffs against current ValidationRule nodes, emits delta JSON · first run surfaced 57 new + 51 modified + 9 stale + 5 PRD-supersession-candidates · xlsx coverage 67/120 (56%) → 120/120 (100%) · BQL auto-discovers via forward-compat"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1ddc4de1-42ef-4b42-b947-16d520447c6a
---

# xlsx watcher + /brain-resync-validation skill — Wave 13

🟢 **WAVE-13-LANDED 2026-05-28T01:10:00Z** — Bundle B item #4 from the recommendation list. xlsx is now self-resyncable.

## What landed

| File | Purpose |
|---|---|
| [VAULT] `200-Graph/graph/resync-xlsx.js` (~285 lines) | xlsx-vs-graph differ + delta emitter |
| [VAULT] `200-Graph/graph/wave-deltas/xlsx-resync-2026-05-28.json` | First run delta — 57 new + 51 Conflicts + 65 edges |
| [VAULT] `.claude/skills/brain-resync-validation/SKILL.md` | Skill (auto-trigger on "resync xlsx", "xlsx drift", "/xlsx-resync") |
| [VAULT] `.claude/commands/brain-resync-validation.md` | Slash command |

## What the first run discovered

| Finding | Count | Meaning |
|---|---:|---|
| NEW xlsx V-rules | 57 | Fields xlsx covers that graph didn't capture in Wave 3 |
| MODIFIED V-rules | 51 | Graph values differ from xlsx — xlsx wins per SoT-flip |
| STALE V-rules | 9 | Graph nodes whose field no longer in xlsx |
| PRD supersession candidates | 5 | needs-review (heuristic match) |

### Real semantic drift surfaced

- `vrule:xlsx:account-name`: graph says allowed = "Letters + digits + Space + & + apostrophe + hyphen"; xlsx says "Letters and digits Only" — Wave 3 extraction conflated columns
- `vrule:xlsx:authority-letter-type`: xlsx specifies "Commercial (Private)"; graph had just "Commercial"
- `"Building Numbe"` (missing 'r') — real xlsx data-quality issue surfaced

### PRD supersession candidates (needs-review)

| xlsx field | Candidate PRD V-rule |
|---|---|
| Visibility | vrule:service-visibility-pricing-required |
| Password Security Level | vrule:password-security-level-enum |
| Password | vrule:password-complexity-per-security-level |
| Status | vrule:contract-edit-status-aware-fields |
| Contact Group Name | vrule:contact-group-name-required-format |

## How it works

1. Glob `Source_of_truth_theme/.xlsx-parse/dump-SOT/*.tsv` (8 sheets)
2. Detect column schema per sheet (column variants handled)
3. Build normalized records → `vrule:xlsx:<slug>`
4. Load current graph V-rules (Wave 1 + all wave-deltas)
5. Diff: new / modified / stale / supersession-candidate
6. Emit delta JSON in wave-delta schema → BQL auto-loads

The diff is idempotent — re-running with no xlsx changes produces empty arrays.

## Validation SoT invariant preserved

Per [MEMORY] `project_validation_xlsx_sot_flip_wave_f_2026_05_24`:
- Every NEW V-rule: `sot: xlsx`
- Every MODIFIED V-rule: Conflict node, `winner: <xlsx_id>`, `rule: xlsx-wins-over-graph-state`
- PRD supersession: REPLACES edge, `evidence-strength: needs-review`
- STALE: NEEDS_REVIEW edge

## Skill triggers

`/brain-resync-validation`, "resync xlsx", "xlsx drift", "is brain in sync with xlsx", "did xlsx change", "refresh xlsx V-rules", "rebuild xlsx V-rules".

## Rules emitted (reusable)

- **Agent-driven extraction is lossy vs direct TSV parsing** — Wave 3 captured 67/120 records (56%); the script captures all 120. Future graph-build waves should call this watcher as the canonical xlsx source, not re-extract via agents.
- **Schema-flexible parsing is required when SoT files have inconsistent headers** — same xlsx has multiple column layouts across sheets. Detect per-sheet rather than hardcode.
- **Idempotent watchers are diffable** — re-running produces a same-shape delta. Compare two days' deltas to see what changed.
- **PRD supersession candidates should always be needs-review** — heuristic name-matching is approximate. The 3 confirmed REPLACES (Wave 1) came from Ammar's explicit declaration, not heuristic.
- **xlsx data-quality issues surface in the diff** — typo "Building Numbe" was hidden in Wave 3's normalized extraction; the watcher exposes it. The brain can now help maintain xlsx quality, not just consume it.

## Compatibility wins

| Win | How |
|---|---|
| Forward-compat | BQL auto-discovered xlsx-resync-2026-05-28.json without code change |
| Future xlsx versions | Script handles both dump-SOT and could extend to dump-NEW with --dump-dir flag |
| Schema-flexible | Detects column layouts per sheet |
| Idempotent | Re-runs produce diffable delta state |

## Coverage impact

| Dimension | Before W13 | After W13 |
|---|---:|---:|
| xlsx record coverage | 67/120 (56%) | **120/120 (100%)** |
| ValidationRule nodes | 67 | 124 |
| Conflict nodes (machine-detected) | 4 | 55 |
| Total graph nodes | 457 | 518 |
| Total edges | 470 | 586 |

## Remaining from 10-item recommendation list

After Bundle A (Wave 11) + Bundle B/C (Wave 12) + xlsx watcher (Wave 13): **8 of 10 items landed**.

| # | Item | Status |
|---:|---|---|
| 5 | `when-to-consult:` backfill on every node | ⏳ rolling, 1 wave per cluster |
| 9 | PR → graph edges via git hook | ⏸️ needs user approval per no-auto-commit rule |

## Related

- [[project_validation_xlsx_sot_flip_wave_f_2026_05_24]] — the SoT invariant this script enforces
- [[project_brain_query_layer_wave_11_2026_05_28]] — BQL (Bundle A)
- [[project_brain_bundles_b_c_wave_12_2026_05_28]] — drift + trust + edge backfill (Bundle B + C)
- [[project_obsidian_graph_playback_loop_complete_2026_05_27]] — the 10-wave build loop
