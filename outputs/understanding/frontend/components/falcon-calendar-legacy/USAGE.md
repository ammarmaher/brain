# falcon-calendar (LEGACY FACADE — REMOVED) — USAGE

> **RECONCILE 2026-06-03 (B22):** The legacy `<falcon-calendar>` is **DELETED** and had **0 consumers** at every sweep. No valid usage — use `<falcon-angular-date-picker>` (field) or `<falcon-angular-calendar>` (inline grid).

## Real usage in active codebase (2026-06-03)
- `[CODE]` **0 live consumers, 0 production source.** `Grep "<falcon-calendar[\s>]"` (non-`dist`) hits only docs for the UNRELATED modern Stencil calendar (`apps/.../component-docs/calendar.md`) + historical plans (`docs/_plans/.w33b-codex-review.txt`, `docs/archive/`). None binds the legacy `libs/falcon` component.

## Recommended usage (the replacement)
```html
<!-- Date field + popover -->
<falcon-angular-date-picker
  [label]="'fields.startDate.label' | translate"
  [(ngModel)]="startDate"
  [min]="minDate"
  [max]="maxDate" />

<!-- Inline month grid -->
<falcon-angular-calendar [value]="selected" (valueChange)="onPick($event)" />
```
> See the `falcon-date-picker` / `falcon-calendar` (modern Stencil) dossiers for the full live API.

## Reactive Forms / ngModel
- `<falcon-angular-date-picker>` provides CVA (`Date | null` two-way). `<falcon-angular-calendar>` uses `[value]` + `(valueChange)`.

## Effective-date validation (the no-op inputs)
- The legacy `useEffectiveDateValidation` / `status` / `pricingType` / `renewDate` inputs were silent no-ops. Re-express the rule as a `disabledDates` predicate on `<falcon-angular-date-picker>` OR a cross-field rule in the host flow's `validations.ts`. The companion `FalconEffectiveDateDirective` is itself a Wave-3 no-op orphan (still in the tree, 0 consumers) and should not be relied on.

## Do / Don't

| Do | Don't |
|---|---|
| Use `<falcon-angular-date-picker>` / `<falcon-angular-calendar>`. | Try to import `FalconCalendarComponent` — it is gone. |
| Move effective-date rules into `validations.ts`. | Wire `useEffectiveDateValidation` expecting behavior. |
| Raise a "confirm-on-Set" feature request on the date-picker if truly needed. | Revive PrimeNG `<p-datepicker>` to get Set/Cancel back. |

## Consumer Sweep (2026-06-03)
[CODE] `Grep "<falcon-calendar[\s>]"` across the repo (excluding `dist/`) → **0 legacy-component consumers.** Residue is only the modern-Stencil docs + historical plans noted above. Confirms the Wave-7 sweep ("0 source files, 0 consumers, ORPHAN").

> Wave 7 (2026-05-17) count was **0**; B22 count is **0** — unchanged. The legacy component was consumer-less; deletion was risk-free.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Consumer Sweep re-run (legacy `<falcon-calendar>` → 0 live; only modern-Stencil docs + historical plans). Replacement snippets 🟡 CODE-DERIVED from the live `<falcon-angular-date-picker>`/`<falcon-angular-calendar>` APIs.
