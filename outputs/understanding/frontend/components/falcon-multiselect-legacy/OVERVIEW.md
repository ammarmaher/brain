# falcon-multiselect (LEGACY STUB — REMOVED) — OVERVIEW

> **RECONCILE 2026-06-03 (B22):** This component is **DELETED from the source tree** — re-confirmed this pass. It was a Wave-3 stub façade that shipped with **zero consumers** and was always "slated for deletion." That deletion has been executed. This dossier is a **historical record + migration map**, status corrected to REMOVED.

## Live-code status (2026-06-03)
- `[CODE]` `Glob libs/falcon/src/shared-ui/lib/components/falcon-multiselect/**` → **No files found.** The `shared-ui/lib/components/` directory holds 14 component folders; `falcon-multiselect` is not among them.
- `[CODE]` `Grep "<falcon-multiselect"` across the repo (excluding `dist/`) → **0 hits anywhere** (not even historical docs). It is the cleanest of the three B22 legacy components — no residue at all.
- `[CODE]` The barrel `libs/falcon/src/shared-ui/index.ts` re-exports `FalconAngularMultiSelectComponent` (line 58) but **NOT** `FalconMultiselectComponent` — the legacy export is gone.
- This matches the Wave-7 sweep, which already recorded "0 source files, 0 consumers, ORPHAN, flagged for deletion."

**Verdict: DEPRECATED → REMOVED. Migration target `<falcon-angular-multi-select>` is live. Safe — there were never any consumers; removal carried zero risk. NO HIGH-RISK-QUEUE item.**

---

## Historical record (component as it last existed)

## Purpose
Wave 3 façade **STUB**. Was originally a complex `<p-multiSelect>` wrapper with dual-panel UX (search + chips left, selected list right), server-filter, infinite-scroll, and Select-All-with-cross-page-cache. Wave 3 verified zero consumer templates referenced it in `apps/` or `libs/`, then shipped a stub façade that:
- Kept the public selector + inputs/outputs as compile-compatible no-ops.
- Dropped the `primeng/multiselect` import.
- Rendered `<falcon-angular-multi-select>` for the trivial single-list dropdown case so any latent dropdown-only consumer would still see something.

The dual-panel + server-filter + infinite-scroll + Select-All UX was explicitly **NOT** preserved.

> **Single-render legacy Angular** — bespoke Angular standalone component in `libs/falcon/src/shared-ui`, **NOT a Stencil dual-render component**. NO Shadow tag, NO `-tw` Light-DOM twin, NO `libs/falcon-ui-tokens` token file of its own (it inherited tokens from the embedded `<falcon-angular-multi-select>`). The B/C/E Stencil-twin rubric dimensions do not apply.

## Business / UI use case
- Latent / accidental consumers only. No active use, ever (Wave 3 grep = 0).

## When to use it / when NOT to use it
- DO NOT use for anything. For multi-select, use `<falcon-angular-multi-select>` directly.

## Status
- **REMOVED (2026-06-03).** Was DEPRECATED / REFERENCE-ONLY (Wave 3 stub); deleted.

## Migration target (replaced BY)
- `<falcon-angular-multi-select>` (`FalconAngularMultiSelectComponent`, exported from `libs/falcon/src/shared-ui/index.ts:58`) — the modern dual-render Stencil-backed multi-value picker (chips + search + Select-all).

## Source paths (as last present — now DELETED)
| Layer | Path (no longer exists 2026-06-03) |
|---|---|
| Component | `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.ts` |
| Template | `…/falcon-multiselect.component.html` |
| SCSS | `…/falcon-multiselect.component.scss` |
| Models | `…/falcon-multiselect.models.ts` (`FalconMultiselectItem`) |
| Barrel | `…/index.ts` |

> `[CODE]` 2026-06-03 — every path returns "No files found." No Stencil layer, no `-tw` twin, no `multiselect.tokens.css` (none ever existed).

## Selectors / tags
| Layer | Tag / selector |
|---|---|
| Angular selector (deleted) | `falcon-multiselect` (ESLint disabled) |
| Stencil tag | _None — single-render Angular._ |

## Known consumers (grep verified 2026-06-03)
- **0** — `[CODE]` zero hits for `<falcon-multiselect` anywhere outside `dist/`. (Wave 7 also recorded 0.)

## Related components
- `<falcon-angular-multi-select>` — the modern replacement (migration target).
- `<falcon-angular-dropdown>` / `<falcon-angular-checkbox-group>` — sibling pickers (see RECOGNITION routing table).

## Ownership / responsibility
- Was legacy bespoke `libs/falcon/src/shared-ui`. Ownership retired.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22 RECONCILE). Component **confirmed DELETED** (Glob of folder empty; 0 grep hits repo-wide; barrel exports only `FalconAngularMultiSelectComponent`). Migration target confirmed live. Historical-record section 🟡 CODE-DERIVED / `[BRAIN-OUT]` from the prior Wave-3 dossier.
