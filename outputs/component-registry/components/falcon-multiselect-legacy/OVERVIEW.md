# falcon-multiselect (LEGACY STUB) — OVERVIEW

## Purpose
Wave 3 façade STUB. Was originally a complex `<p-multiSelect>` wrapper with dual-panel UX (search + chips left, selected list right), server-filter, infinite-scroll, and Select-All-with-cross-page-cache. Wave 3 verified zero consumer templates reference it in `apps/` or `libs/`, then shipped a stub façade that:
- Keeps the public selector + inputs/outputs as compile-compatible no-ops.
- Drops the `primeng/multiselect` import.
- Renders `<falcon-angular-multi-select>` for the trivial single-list dropdown case so any latent dropdown-only consumer would still see something.

The dual-panel + server-filter + infinite-scroll + Select-All UX is explicitly NOT preserved.

## Business / UI use case
- Latent / accidental consumers only. No active use.

## When to use it / when NOT to use it
- DO NOT use this for anything new.
- For multi-select, use `<falcon-angular-multi-select>` directly.

## Status
- **DEPRECATED / REFERENCE-ONLY (Wave 3 stub).**

## Selector / Tags
- `<falcon-multiselect>` (ESLint disabled).

## Source paths
| Layer | Path |
|---|---|
| Component | `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.ts` |
| Template | `…/falcon-multiselect.component.html` |
| SCSS | `…/falcon-multiselect.component.scss` |
| Models | `…/falcon-multiselect.models.ts` |
| Barrel | `…/index.ts` |

## Known consumers
- _None observed_ (Wave 3 grep confirmed zero consumers).

## Related components
- `<falcon-angular-multi-select>` — the modern replacement.

## Ownership / Responsibility
- Legacy bespoke. Slated for deletion.
