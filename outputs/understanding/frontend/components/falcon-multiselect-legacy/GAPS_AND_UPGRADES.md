# falcon-multiselect (LEGACY STUB — REMOVED) — GAPS & UPGRADES

## RECONCILE 2026-06-03 (B22) — DELETION FLAG

`[CODE]` **The component is DELETED from the production tree** (re-confirmed this pass). It shipped as a Wave-3 stub with **zero consumers** and was always flagged ORPHAN / "DELETE in Wave 8 cleanup." That has happened:
- `Glob libs/falcon/src/shared-ui/lib/components/falcon-multiselect/**` → No files found.
- `Grep "<falcon-multiselect"` (non-`dist`) → 0 hits anywhere (no source, no templates, no doc residue).
- `shared-ui/index.ts` → exports only `FalconAngularMultiSelectComponent` (line 58); no `FalconMultiselectComponent`.

**Wave flag: DELETION CONFIRMED (already executed). No promotion. No HIGH-RISK-QUEUE item — there were never any consumers, so removal was risk-free.**

The historical SCSS-rule violation (#4 below) is **resolved by the deletion**.

---

## Historical gaps (all resolved by removal)

### 1. (was P0) Dual-panel UX missing
- The original feature was never reimplemented in the stub. **Resolved** — if a future page genuinely needs a dual-panel transfer list, raise it as a NEW `dual-panel` variant on `<falcon-angular-multi-select>` (a library GAP), per `feedback_falcon_custom_library_mandatory`. Do NOT revive this façade.

### 2. (was P0) Server-filter / infinite-scroll missing
- Dropped in the stub. **Resolved** — propose as a lazy/async-options mode on `<falcon-angular-multi-select>` (its own G3 async-options gap) if needed.

### 3. (was P0) Select-All-with-cross-page-cache missing
- Same as #2.

### 4. (was P0) SCSS file violated the no-SCSS house rule
- **Resolved** — `[CODE]` deleted with the folder (Glob = empty).

### 5. (was P1) `subtitle` field on `FalconMultiselectItem` lost in mapping
- The adapter dropped `subtitle`. **Resolved** — moot; the type is gone. `<falcon-angular-multi-select>` carries its own option model.

## Rubric audit (§5) at removal
- **A — Angular 21:** legacy decorator `@Input`/`@Output`, two-way `[selectedIds]`, NO CVA, NO signals, NO Stencil — off-pattern (a reason for deprecation).
- **B — Stencil dual-render:** N/A (single-render Angular; no Shadow/`-tw` twin).
- **C — Falcon house rules:** had a `.scss` (no-SCSS violation); the original wrapped banned `primeng/multiselect` (dropped in the stub). Resolved by removal.
- **D — Accessibility:** delegated to the embedded multi-select.
- **E — Cross-framework parity:** none (no React/Vue twin). N/A.
- **F — Completeness/drift:** prior dossier already corrected (2026-05-18) to deletion; B22 re-verified.

## Missing tests
- None relevant — component removed.

## Recommended action
- **None.** The stub had no consumers and is deleted. Keep this dossier as a historical migration map; the canonical multi-value picker is `<falcon-angular-multi-select>`.

## Wave 7 Findings (2026-05-17)
**STATUS: ORPHAN.** No source files, no consumers, no module-federation references. Recommendation at the time: DELETE in Wave 8 cleanup. Successor: `falcon-multi-select`.

## Deep-Dive Sweep Findings (2026-06-03 — B22)
**Consumer count: 0** ([CODE] grep `<falcon-multiselect>` non-`dist` → 0 hits). **DELETION CONFIRMED** — folder gone, barrel export gone, zero residue. Prior 🔴/2026-05-18 historical correction upgraded to a confirmed REMOVED verdict. All findings `safe-local` (dead-orphan/doc). See `FINDINGS/B22.md`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22) — DELETION re-confirmed (Glob + grep + barrel). Historical gaps preserved as resolved-by-removal. No HIGH-RISK-QUEUE.
