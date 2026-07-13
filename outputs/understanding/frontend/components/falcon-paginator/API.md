# falcon-paginator — API

## Selectors

- Angular: `falcon-angular-paginator`
- Stencil Shadow: `<falcon-paginator>` (tag `'falcon-paginator'`, `shadow: true` — `[CODE]` falcon-paginator.tsx:35-38)
- Stencil Light: `<falcon-paginator-tw>` (tag `'falcon-paginator-tw'`, `shadow: false` — `[CODE]` falcon-paginator-tw.tsx:49-51)

## Import

```ts
import { FalconAngularPaginatorComponent } from '@falcon/ui-core/angular';
import type {
  FalconPaginatorSize,
  FalconPaginatorChangeDetail,
  FalconPaginatorBlurDetail,
  FalconPaginatorItem,
} from '@falcon/ui-core/angular';
```

`CUSTOM_ELEMENTS_SCHEMA` is set on the wrapper internally (`[CODE]` falcon-paginator.component.ts:30) — the host does NOT need it.

## Inputs (on `FalconAngularPaginatorComponent`)

`[CODE]` falcon-paginator.component.ts:45-74 — **11 inputs** (the CVA `currentPage` is a getter/setter over the internal signal).

| Name | Type | Default | Notes |
|---|---|---|---|
| `currentPage` (CVA) | `number` | `1` | Two-way via `[(ngModel)]` / `formControlName` / `[(currentPage)]`. Setter writes the `value` signal (`?? 1`). |
| `totalPages` | `number` | `1` | Forwarded as `[attr.total-pages]`. |
| `siblingCount` | `number` | `1` | Pages shown either side of current. |
| `boundaryCount` | `number` | `1` | Pages shown at start/end. |
| `showFirstLast` | `boolean` | `false` | Render first-page + last-page nav. |
| `showPrevNext` | `boolean` | `true` | Render prev + next nav. |
| `disabled` | `boolean` | `false` | Plain `@Input`; CVA `setDisabledState` writes the same `disabled` field. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Maps to per-size height/padding tokens. |
| `showPageInfo` | `boolean` | `false` | Renders the compact "N of M" page-info label. |
| `ariaLabel` | `string` | `'Pagination'` | Outer `<nav>` aria-label. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-paginator-tw>` (Light DOM). `false` → `<falcon-paginator>` (Shadow DOM). |
| `rootClass` | `string` | `''` | Caller-supplied extra classes on the inner Stencil element. |

## Stencil props NOT exposed by the Angular wrapper (GAP FP-01)

`[CODE]` These PR-3 props exist on BOTH Stencil tags (falcon-paginator.tsx:54-66) but the Angular wrapper does NOT surface them — a standalone `<falcon-angular-paginator>` cannot drive the rows-per-page dropdown, jump input, or current-page report:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `totalRecords` | `number` | `0` | Drives the current-page report math. |
| `rows` | `number` (mutable) | `0` | Page size — feeds report + rows-per-page dropdown. |
| `rowsPerPageOptions` | `ReadonlyArray<number>` | `undefined` | When non-empty, RowsPerPageDropdown renders. **Object prop** — must be set on the live element, not a string attr. |
| `currentPageReportTemplate` | `string` | `'{first} - {last} of {totalRecords}'` | Placeholders `{first}` `{last}` `{totalRecords}` `{currentPage}` `{totalPages}`. |
| `paginatorTemplate` | `string` | `undefined` | Region-order string (token vocabulary). When set, overrides the legacy `showFirstLast`/`showPrevNext` ordering. |
| `showCurrentPageReport` | `boolean` | `false` | Show the CurrentPageReport region. |
| `rowsPerPageDropdownAppendTo` | `string` | `undefined` | **`-tw` ONLY** (PR-4, falcon-paginator-tw.tsx:85) — reflected as `data-append-to`; reserved for the future Falcon-dropdown migration. **NOT on the Shadow tag** (parity divergence). |

`[CODE]` `<falcon-table>` sets these directly on the inner `<falcon-paginator>` via attribute bindings, so the PR-3 surface works WHEN consumed inside a table. Standalone via the wrapper, it does not.

## Outputs

`[CODE]` falcon-paginator.component.ts:58-59 — **2 Angular `@Output`s**.

| Name | Payload | Bridged from | Notes |
|---|---|---|---|
| `valueChange` | `number` (the new page) | `falcon-change` | ALSO writes CVA `onChange` (`[CODE]` ts:89-95). |
| `falconBlur` | `FalconPaginatorBlurDetail` (`{ page }`) | `falcon-blur` | ALSO calls CVA `onTouched` (`[CODE]` ts:97-101). |

> `[CODE]` The Stencil tags ALSO emit `falcon-rows-change` (`{ rows, previousRows }`, falcon-paginator.tsx:75-76) — but the Angular wrapper does NOT bind or re-emit it (GAP FP-01). Standalone consumers cannot observe rows-per-page changes through the wrapper.

## Stencil events

| Event | Detail | When |
|---|---|---|
| `falcon-change` | `FalconPaginatorChangeDetail = { page, previousPage }` | Page change (clamped, no-op suppressed). |
| `falcon-blur` | `FalconPaginatorBlurDetail = { page }` | `<nav>` blur. |
| `falcon-rows-change` | `FalconPaginatorRowsChangeDetail = { rows, previousRows }` | RowsPerPage `<select>` change. **Not re-emitted by the wrapper.** |

## Reflected props (Stencil only)

`[CODE]` falcon-paginator.tsx:43-51 — `currentPage` (`@Prop({ mutable:true, reflect:true })`), `totalPages`, `showFirstLast`, `showPrevNext`, `disabled`, `size`, `showPageInfo` are reflected to host attrs. Object/string PR-3 props (`rowsPerPageOptions`, `paginatorTemplate`, `currentPageReportTemplate`, `totalRecords`, `rows`) are NOT reflected.

## Methods (Stencil `@Method` — NOT surfaced by the Angular wrapper)

`[CODE]` falcon-paginator.tsx:90-101.

| Method | Description | Available on |
|---|---|---|
| `goto(page)` | Programmatic page jump (clamped). | BOTH tags |
| `setFocus()` | Focus the current page button. | BOTH tags |

> `[CODE]` Unlike falcon-tree, the Angular wrapper does NOT proxy `goto`/`setFocus`. Reach the inner tag via `@ViewChild` + `nativeElement` to call them — GAP.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.types.ts`:

```ts
type FalconPaginatorSize = 'sm' | 'md' | 'lg';

type FalconPaginatorItem =
  | { readonly kind: 'page'; readonly page: number }
  | { readonly kind: 'ellipsis'; readonly position: 'start' | 'end' };

interface FalconPaginatorChangeDetail   { readonly page: number; readonly previousPage: number | null; }
interface FalconPaginatorBlurDetail     { readonly page: number; }
interface FalconPaginatorRowsChangeDetail { readonly rows: number; readonly previousRows: number | null; }

type FalconPaginatorRegionToken =
  | 'CurrentPageReport' | 'FirstPageLink' | 'PrevPageLink' | 'NextPageLink'
  | 'LastPageLink' | 'PageLinks' | 'JumpToPageInput' | 'RowsPerPageDropdown';
```

## CVA / ngModel / Reactive Forms

**YES** — `[CODE]` falcon-paginator.component.ts:31-39/76-87. `NG_VALUE_ACCESSOR` provided; `[(ngModel)]` / `formControl` / `formControlName` bind the **current page number**. `writeValue(value)` coerces `null`/`undefined` → `1`. `setDisabledState` toggles `disabled`.

## Signal compatibility

`[CODE]` Internal page state is an Angular `signal<number>` (ts:63). External binding is legacy `@Input`/`@Output` (no `input()`/`output()` signal-API). `OnPush` enforced. (Contrast: the SIBLING `<falcon-angular-custom-table-footer>` uses the modern `input()`/`output()` signal API.)

## Region resolution / template

`[CODE]` falcon-paginator.tsx:336-349 — `resolveRegions()`: if `paginatorTemplate` parses to ≥1 valid token, use that order; else fall back to legacy `[FirstPageLink?] PrevPageLink? PageLinks NextPageLink? LastPageLink?` driven by `showFirstLast`/`showPrevNext`. `parsePaginatorTemplate()` (utils:104-118) is whitespace-split, deduped, and silently drops unknown tokens.

## Supported sizes / states

- **size:** `sm` (28px) / `md` (32px) / `lg` (36px) — `[CODE]` paginator.tokens.css:74-79.
- **states:** page button default / hover / active-current / focus / disabled; nav button default / hover / disabled.
- No `variant` / `appearance` axes.

## Slots / template inputs

`[CODE]` _None._ The wrapper template is a bare tag-switcher with no `<ng-content>`; the Stencil components render fixed regions and define no `<slot>`s. Chevrons (`renderChevron`) and ellipsis are built-in SVG/text.

## Constraints

- `[CODE]` falcon-paginator.tsx:104 — a no-op page click (`next === currentPage`) emits nothing (no redundant re-fetch).
- `[CODE]` falcon-paginator.tsx:82/87/93/147 — `clampPage` runs on load, on every `totalPages` change (`@Watch`), and on `goto`/jump — the page can never leave `[1, totalPages]`.
- `[CODE]` falcon-paginator.tsx:150-157 — a rows-per-page change does NOT reset the page; the host decides whether to jump to page 1.
- `[CODE]` `rowsPerPageOptions` is an object prop — set it on the live element, not as a string attribute.

## Accessibility

`[CODE]` falcon-paginator.tsx:240-241/356-360:
- Container `<nav>`: `role="navigation"`, `aria-label` (default `'Pagination'`).
- Current page button: `aria-current="page"` + `aria-label="Page N"`.
- Nav buttons: `aria-label` (`First page` / `Previous page` / `Next page` / `Last page`) — **hardcoded English, no i18n hook** (GAP).
- Ellipsis `<span>` is `aria-hidden="true"`.
- JumpToPage `<input>`: `aria-label="Jump to page"` only — no `<label>` association (GAP FP-04). RowsPerPage `<select>`: `aria-label="Rows per page"`.
- **Keyboard** (`[CODE]` falcon-paginator.tsx:118-137, on the `<nav>`): `ArrowRight`/`ArrowLeft` step page ±1; `Home`/`End` jump to first/last; each refocuses the new current button via `requestAnimationFrame`.
- `disabled` page/nav buttons get the native `disabled` attribute.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09) against falcon-paginator.component.ts (103 ln), .component.html (35 ln), falcon-paginator.tsx (375 ln), falcon-paginator-tw.tsx (408 ln), .types.ts, .utils.ts. Confirmed: 11 wrapper inputs, 2 outputs (`falcon-rows-change` NOT re-emitted — FP-01), single-mode CVA on the page number, `goto`/`setFocus` `@Method`s NOT proxied, `rowsPerPageDropdownAppendTo` is `-tw`-only (parity divergence).
