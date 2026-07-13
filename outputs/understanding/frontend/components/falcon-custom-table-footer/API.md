# falcon-custom-table-footer — API

## Selectors

- Angular: `falcon-angular-custom-table-footer`
- Class: `FalconAngularCustomTableFooterComponent`
- **No Stencil tags** — Angular-only composite.

## Import

```ts
import { FalconAngularCustomTableFooterComponent } from '@falcon/ui-core/angular';
// per-component deep path: '@falcon/ui-core/angular/falcon-custom-table-footer'
```

`[CODE]` index.ts:2 exports the class; `angular-wrapper/index.ts:64` re-exports the whole barrel. There are **no exported types** (the public surface is all primitives). Add `FalconAngularCustomTableFooterComponent` to the consuming standalone component's `imports: []`. It does NOT declare `CUSTOM_ELEMENTS_SCHEMA` (it renders no raw custom-element itself — the inner `<falcon-angular-paginator>` declares its own).

## Inputs (signal inputs — modern API)

`[CODE]` falcon-custom-table-footer.component.ts:26-38 — **8 inputs**, all via the Angular `input()` / `input.required()` signal API (NOT legacy `@Input` decorators).

| Name | Type | Default | Notes |
|---|---|---|---|
| `totalRecords` | `number` | **required** (`input.required<number>()`) | Total record count across all pages. The only required input. |
| `currentPage` | `number` | `1` | Current page (1-indexed). |
| `rows` | `number` | `10` | Rows per page. |
| `rowsPerPageOptions` | `readonly number[]` | `[10, 20, 30, 40]` | Options for the rows-per-page `<select>`. |
| `disabled` | `boolean` | `false` | Disables ALL controls (loading / empty-data state) — dims + makes the band pointer-inert AND sets `[disabled]` on each control. |
| `showingLabel` | `string` | `'Showing'` | Localized — consumer-translated to avoid coupling to any i18n stack. |
| `fromLabel` | `string` | `'from'` | Localized. |
| `rowsPerPageLabel` | `string` | `'Rows per page'` | Localized. |

> `[CODE]` These are **signal inputs** — read in the template as calls (`totalRecords()`, `currentPage()`, …). There is NO CVA and NO `[(ngModel)]` two-way binding on this component; page/rows changes flow OUT via outputs only.

## Outputs (signal outputs)

`[CODE]` falcon-custom-table-footer.component.ts:40-41 — **2 outputs** via the `output()` signal API.

| Name | Payload | When |
|---|---|---|
| `pageChange` | `number` (new page) | Emitted from `onPaginatorValueChange(page)` when the inner paginator's `(valueChange)` fires AND `page` is a number `>= 1` (`[CODE]` ts:61-65). |
| `rowsChange` | `number` (new page size) | Emitted from `onSelectRows(value)` when the `<select>`'s `(ngModelChange)` yields a finite `> 0` number (`[CODE]` ts:67-70). |

## Internal computed state

`[CODE]` falcon-custom-table-footer.component.ts:43-59 — three `computed()` signals derive the display values:

| Computed | Formula | Notes |
|---|---|---|
| `totalPages` | `Math.max(1, Math.ceil(totalRecords / Math.max(1, rows)))` | Fed to the paginator's `[totalPages]`. Always ≥ 1. |
| `first` | `totalRecords === 0 ? 0 : (currentPage - 1) * rows + 1` | The "X" in "Showing X - Y". |
| `last` | `totalRecords === 0 ? 0 : Math.min(totalRecords, currentPage * rows)` | The "Y" in "Showing X - Y". |

## CVA / ngModel / Reactive Forms

**NO.** `[CODE]` This component implements no `ControlValueAccessor` and provides no `NG_VALUE_ACCESSOR`. It is a presentational composite — state flows in via signal inputs and out via outputs. (The inner native `<select>` DOES use `[ngModel]` + `(ngModelChange)` internally — `[CODE]` html:38-39 — but that is one-way display binding to `rows()`, not a form control exposed to the consumer.)

## Signal compatibility

`[CODE]` **Fully signals-first** — `input()` / `input.required()` / `output()` / `computed()`, `OnPush`. This is the MOST modern component in batch B09 (contrast `falcon-tree` / `falcon-paginator`, which use legacy `@Input`/`@Output`).

## Methods

`[CODE]` Two `protected` handlers (not public API): `onPaginatorValueChange(page)` (guards `page >= 1` before emitting `pageChange`) and `onSelectRows(value)` (coerces + guards `> 0` before emitting `rowsChange`). No public imperative methods.

## Composed sub-component

`[CODE]` falcon-custom-table-footer.component.html:21-29 — the center region renders `<falcon-angular-paginator>` with:

```html
<falcon-angular-paginator
  [currentPage]="currentPage()"
  [totalPages]="totalPages()"
  [showFirstLast]="true"
  [showPrevNext]="true"
  [showPageInfo]="true"
  size="sm"
  [disabled]="disabled()"
  (valueChange)="onPaginatorValueChange($event)" />
```

So the nav cluster is `« ‹ [page] of N › »` (first/last + prev/next + the `showPageInfo` "N of M" label), `size="sm"`, disabled in tandem with the footer.

## Slots / template inputs

`[CODE]` _None._ No `<ng-content>`, no `ng-template` inputs — the three regions are fixed.

## Supported sizes / states / variants

- The footer band is single-height (`h-[var(--falcon-table-row-height)]` = 52px); no size axis on the footer itself (the inner paginator is pinned to `size="sm"`).
- **States:** enabled / disabled (the only state axis — `disabled()` dims the band + every control).
- No `variant` / `appearance`.

## Constraints

- `[CODE]` `totalRecords` is **required** — instantiating without it is a compile error.
- `[CODE]` `disabled` cascades: the band gets `pointer-events-none` + `opacity-60` + `aria-disabled`, the paginator gets `[disabled]`, the `<select>` gets `[disabled]` (html:11-12/28/37).
- `[CODE]` Page math assumes `rows >= 1` (guarded via `Math.max(1, rows)`); `totalRecords === 0` yields `first=last=0`.
- The footer emits `pageChange` / `rowsChange` but does NOT itself re-fetch data — the host (data-table → feature) owns the re-query.

## Accessibility

`[CODE]` falcon-custom-table-footer.component.html:
- The band gets `[attr.aria-disabled]="disabled() ? 'true' : null"` (html:12).
- The rows-per-page `<select>` has an associated `<label>` (html:34-35) — better than the bare paginator's `aria-label`-only jump input.
- `[CODE]` **GAP** — the "Showing X - Y from Z" text is a plain `<div>` with no `aria-live`, so screen readers do not re-announce the slice when the page changes.
- `[CODE]` **GAP** — the rows-per-page `<label>` has no `for`/`id` association to the `<select>` (it is an adjacent `<label>` wrapping nothing), so the click-to-focus + AT name association is weaker than a wired `<label for>`.
- ARIA roles (`role="navigation"`, `aria-current`) on the page strip come from the composed `<falcon-angular-paginator>`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED) against falcon-custom-table-footer.component.ts (71 ln) + .component.html (45 ln). Confirmed: 8 signal inputs (1 required), 2 signal outputs, 3 computeds, NO CVA, native `<select>` for rows-per-page, composes `<falcon-angular-paginator size="sm">`. a11y gaps (no `aria-live`, weak `<label>` association) flagged.
