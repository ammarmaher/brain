# falcon-multiselect (LEGACY STUB — REMOVED) — USAGE

> **RECONCILE 2026-06-03 (B22):** The stub is **DELETED** and had **zero consumers** at every sweep. There is no valid usage — use `<falcon-angular-multi-select>`.

## Real usage in active codebase (2026-06-03)
- `[CODE]` **0 consumers, 0 source files.** `Grep "<falcon-multiselect"` (non-`dist`) returns nothing at all.

## Recommended usage (the replacement)
```html
<falcon-angular-multi-select
  [options]="options"
  [(ngModel)]="selectedIds"
  [placeholder]="'fields.items.placeholder' | translate"
  filter="true">
</falcon-angular-multi-select>
```
> See the `falcon-multi-select` dossier for the full live API.

## Reactive Forms / ngModel
- The replacement `<falcon-angular-multi-select>` provides CVA (the legacy stub did not). Works with `formControlName` / `[(ngModel)]`.

## Do / Don't

| Do | Don't |
|---|---|
| Use `<falcon-angular-multi-select>` for any multi-value pick. | Try to import `FalconMultiselectComponent` — it is gone. |
| Raise a feature request for a true dual-panel transfer list (library GAP). | Revive the legacy stub to get dual-panel UX. |

## Consumer Sweep (2026-06-03)
[CODE] `Grep "<falcon-multiselect"` across the repo (excluding `dist/`) → **0 hits.** No source, no templates, no historical-doc references. Confirms the Wave-7 sweep ("0 source files, 0 consumers, ORPHAN"). The component left no trace.

> Wave 7 (2026-05-17) count was **0**; B22 count is **0** — unchanged. The component was always consumer-less; deletion was risk-free.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B22). Consumer Sweep re-run (`<falcon-multiselect>` → 0 everywhere). Replacement snippet 🟡 CODE-DERIVED from the live `<falcon-angular-multi-select>` API.
