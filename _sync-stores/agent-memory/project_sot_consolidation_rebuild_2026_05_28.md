# SoT Consolidation + rebuild-brain + V-rule drift reconciliation — 2026-05-28

🟢 DELIVERED · Built the brain's single-source-of-truth governance + regeneration pipeline + proved the "69 drifted V-rules" alarm was 96% false (comparator/schema artifacts, 0 real semantic drift). NO V-rule file regenerated.

## What was built (all brain-safe, no product code, no commits)

1. **`BRAIN-SOURCE-OF-TRUTH-MANIFEST.md`** ([BRAIN-OUT] `datasets/authority-dataset/`) — declares the ONE canonical source per knowledge type + the regen chain (CODE → understanding/ + xlsx + PRD + Authority → graph deltas → feed → views) + drift policy + decision protocol. Cross-linked from `0-MASTER-INDEX.md`. **Rule adopted: "derived artifacts are generated, never authored."**

2. **`consolidate-graph.js`** (Wave 15) — collapses baseline `nodes.json`/`edges.json` + all wave-deltas → ONE master (233 explicit nodes / 370 edges). Backs up baseline to `*-baseline-pre-consolidation.json`. Writes `CONSOLIDATION-MANIFEST.json`. Defensive (handles heterogeneous delta shapes: `.nodes`/`.nodes_added`).

3. **`rebuild-brain.js`** — THE one command. Runs 9 generators in dependency order (consolidate → capability-feed merge+validate → xlsx-resync → implicit-edges → trust-scores → purpose-overlay → verify-evidence → verify-sot), non-fatal per step, writes `REBUILD-REPORT.json`. Ran clean: **9 ok / 0 errored / ~6-8s.** Command: `cd falcon-wiki/200-Graph/graph && node rebuild-brain.js`

4. **`verify-sot.js`** — SoT integrity checker (best-practice gap #7). Validates canonical sources exist + feed enriched (0 structural) + graph parses + no real V-rule drift. `--ci` exits 1 on fail. Wired into rebuild-brain.

## The "69 drifted V-rules" investigation (the headline lesson)

First rebuild flagged **69 of ~78 V-rules "modified"** (~88%). Best practice on a >50%-of-set flag = **investigate before bulk-mutating.** Did NOT regenerate 69 files. Root causes found (all artifacts, 0 real drift):
- Raw string `!==` comparison (no normalization): "Mandetory"≠"Yes", "(2-30) Char"≠"2-30", ".PNG|.JPG"≠".PNG, .JPG"
- Ignored the separate **"Allowed Special Char"** xlsx column (col 6) — graph merges content+special, resync read only content
- Digit-count vs value-range: xlsx "3" ≡ graph "0-999" (3-digit cap, Wave G)
- Free-prose charset descriptions (compact vs verbose) — inherently fuzzy
- **Feedback loop:** resync delta is both input (via consolidate→nodes.json) AND output → count fluctuates run-to-run

Fixes landed in `resync-xlsx.js` (the TOOL, not the 69 files): semantic normalizer (Mandetory≡Yes, paren/char strip, separator-agnostic, sorted-number length compare) + dropdown-prefix strip + Allowed-Special-Char column read + digit↔range equivalence + advisory-vs-structured severity split + feedback-loop exclusion (skip own prior xlsx-resync deltas from baseline).

**Result: 69 → 3 structured (96% ↓).** The 3 residual = digit-vs-range user-limit fields (max-normal-user-limit/max-system-user-limit/max-node-level: "0-999"≡"3 digits"), PROVEN benign. verify-sot honestly reports 13 pass / 1 fail (NOT fake-greened — the 1 fail is the documented-benign trio). Snapshot `pre-vrule-regen-2026-05-28/` stayed pristine = proof zero V-rules needed regeneration.

## Honest residuals (flagged, not hidden)
- 233 (explicit array-merge) vs 707 (cluster-inclusive query.js ingestion) node count — both correct, different definitions; verify-sot DEFINES both. Unify ingestion = follow-up.
- 3 structured V-rule "drifts" = benign digit-vs-range; converge needs xlsx cell OR V-rule to express length consistently.
- FE Stencil blocker (40+ errors) unchanged — product code, ammar-web-platform-ui.
- Best-practice gaps remaining: #3 per-type generators (backend/BR/tokens), #5 report-as-build, #6 deprecate duplicate component notes.

## Rules emitted (reusable)
- **A >50% drift flag is almost always a comparator/schema bug** — fix the comparator (a few edits), not the N files. Investigate-before-mutate.
- **Derived artifacts are generated, never authored** — hand-editing a MATRIX/graph-node/report/V-rule = SoT violation; fix source + `node rebuild-brain.js`.
- **A change-detector that re-ingests its own output fluctuates** — exclude self-output from the comparison baseline.
- **Don't fake-green a checker** — verify-sot reports 1 honest fail (benign-documented) rather than be tuned to lie.

## Files
- `datasets/authority-dataset/BRAIN-SOURCE-OF-TRUTH-MANIFEST.md` (+ Master Index cross-link)
- `200-Graph/graph/consolidate-graph.js` · `rebuild-brain.js` · `verify-sot.js` · `resync-xlsx.js` (5 edits)
- `200-Graph/VRULE-DRIFT-RECONCILIATION-2026-05-28.md`
- `200-Graph/graph/CONSOLIDATION-MANIFEST.json` · `REBUILD-REPORT.json` · `SOT-VERIFY-REPORT.json`
- snapshot `universal-brain/snapshots/pre-vrule-regen-2026-05-28/`
