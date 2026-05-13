# falcon-calendar (LEGACY FACADE) — OVERVIEW

## Purpose
Wave 3 façade. The legacy `<falcon-calendar>` selector now delegates internally to `<falcon-angular-date-picker>` (Falcon UI core). Public inputs/outputs preserved 1:1 for consumers. Two known behavior changes (Wave 3 accepted):
- Set/Cancel overlay UX → replaced by immediate-commit on date select.
- `useEffectiveDateValidation` / `falconEffectiveDate` directive → no-op (no consumers use it).

## Business / UI use case
- Latent consumers from PrimeNG-era `<p-calendar>` API still on `<falcon-calendar>`.
- For new date pickers, use `<falcon-angular-date-picker>` directly.

## When to use it / when NOT to use it
- DO NOT use for new code.
- Allow existing consumers (if any) to keep compiling.

## Status
- **LEGACY FACADE (Wave 3 / Wave-3 facade per registry).**

## Selector / Tags
- `<falcon-calendar>` (Angular component).
- No Stencil tag.

## Source paths
| Layer | Path |
|---|---|
| Component | `libs/falcon/src/shared-ui/lib/components/falcon-calendar/falcon-calendar.component.ts` |
| Template | `…/falcon-calendar.component.html` |
| Barrel | `…/index.ts` |

## Known consumers
- _Verify._ Likely none — Wave 3 noted "both call sites use only [ngModel] + (dateChange)".

## Related components
- `<falcon-angular-date-picker>` — the modern replacement.
- `<falcon-angular-calendar>` — single-month grid (lower-level building block).

## Ownership / Responsibility
- Legacy `libs/falcon/src/shared-ui/`.
- Wraps a Date↔ISO yyyy-mm-dd string conversion at the CVA boundary.
