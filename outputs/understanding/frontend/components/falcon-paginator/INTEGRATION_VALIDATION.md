# falcon-paginator — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — the component is presentational.** It owns no data and calls no endpoint. It emits a *page number* (and optionally a *rows-per-page* value); the host flow translates that into a backend page query. The data it pages belongs to whatever module the list belongs to:
- `[MEMORY]` **Commerce** — when paging a comm-channels / apps-services / order list.
- `[MEMORY]` **Identity** — when paging a users list.
- `[INFERRED]` Any other module that owns the paged list.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | `[CODE]` `falcon-paginator.tsx` — no HTTP. The host flow owns the wiring: on `falcon-change` it issues a paged query (`?page=N&pageSize=M` or equivalent) and feeds `totalPages`/`totalRecords` back from the response. |

When auto-composed inside `<falcon-angular-data-table [lazy]="true">`, the table's `(lazyLoad)` event carries the page/rows and the host flow does the fetch — `[BRAIN-OUT]` `USAGE.md` Example 3.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[CODE]` Page clamp | the page value | `goto(page)` / jump-to-page input / `totalPages` shrinks | no error — `clampPage` (`falcon-paginator.tsx:82,87,93,147`) silently coerces into `[1, totalPages]`. |
| `[CODE]` Non-numeric jump input guard | the jump-to-page `<input type=number>` | a non-finite value typed | silently ignored — `handleJumpToPage` returns early if `!Number.isFinite(next)` (`falcon-paginator.tsx:143-148`). |
| `[CODE]` Non-numeric rows guard | the rows-per-page `<select>` | a non-finite value | silently ignored — `handleRowsChange` (`falcon-paginator.tsx:150-153`). |
| `[INFERRED]` No form-level validation | — | — | The paginator is navigation, not data entry. Its CVA value (the page number) is always a valid clamped integer; there is nothing to mark invalid. |

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| `[INFERRED]` None | — | The paginator has no PES key. It is navigation chrome — visible whenever its host list is. `[disabled]` is bound by the host (e.g. while a page is loading), not by PES. |

## State / signal pattern
`[CODE]` `falcon-paginator.component.ts`
- **`ControlValueAccessor` — YES.** Unlike `falcon-calendar` / `falcon-date-picker`, the Angular wrapper `FalconAngularPaginatorComponent` DOES implement CVA (`falcon-paginator.component.ts:31-39`). `[(ngModel)]` / `formControlName` binds the **current page number**.
- The wrapper holds the page in a `signal<number>` (`falcon-paginator.component.ts:63`); `currentPage` is a getter/setter over that signal; `writeValue` / `handleChange` keep CVA + signal in sync.
- Stencil internal state: only `resolvedId` is `@State()`. `currentPage` and `rows` are `@Prop({ mutable:true })` — the component mutates them then emits.
- Outputs (wrapper): `valueChange` (page) + `falconBlur`. Stencil events: `falcon-change` (`{page, previousPage}`), `falcon-blur`, `falcon-rows-change` (`{rows, previousRows}`).
- Stencil `@Method()`: `goto(page)` and `setFocus()` (`falcon-paginator.tsx:90-101`) — **not surfaced by the Angular wrapper.**

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-paginator>` (Shadow DOM, `falcon-paginator.tsx:35-39`) and `<falcon-paginator-tw>` (Light DOM Tailwind variant). Pure presentational; the page-item list is built by `buildPaginationItems()` in `falcon-paginator.utils.ts`. **No popover-portal** — the paginator opens no panel; it is immune to the positioning bugs in `_LEARNINGS_POPOVER_PORTAL_PATTERN.md`.
- **Angular wrapper** — `<falcon-angular-paginator>` renders BOTH skeletons behind a `useTailwind` switch (default `true`); `ngOnInit` lazily registers via `defineFalconTwComponent('falcon-paginator')`.
- **Table-composed layering** — inside `<falcon-table>` / `<falcon-table-tw>` the paginator is auto-rendered in the footer when `paginated=true`; the table sets the PR-3 props directly on the inner `<falcon-paginator>` via attribute bindings (`[BRAIN-OUT]` `API.md` cites `falcon-table.tsx:667-678`).
- Per `feedback_library_skeleton_app_api`: the wrapper does no data fetching.

## Integration gotchas
- 🟡 **Wrapper API lag — confirmed against source.** `[CODE]` The Angular wrapper exposes only 11 inputs (`falcon-paginator.component.ts:45-56`) — `totalPages`, `siblingCount`, `boundaryCount`, `showFirstLast`, `showPrevNext`, `disabled`, `size`, `showPageInfo`, `ariaLabel`, `useTailwind`, `rootClass` (+ the CVA `currentPage` setter). The **PR-3 Stencil props** — `totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport` (`falcon-paginator.tsx:54-66`) — are **NOT exposed by the wrapper**, and the `falcon-rows-change` event is **not re-emitted** by the wrapper. So a *standalone* `<falcon-angular-paginator>` cannot drive the rows-per-page dropdown or the current-page report. This matches `GAPS_AND_UPGRADES.md` FP-01 — the existing dossier is accurate.
- `[CODE]` **Workaround for the PR-3 surface standalone** — drop to the Stencil tag `<falcon-paginator-tw>` and set object props (`rowsPerPageOptions`) via `@ViewChild` + native element; OR consume the paginator inside a Falcon table, where the table wires PR-3 for you.
- `[CODE]` **`rowsPerPageOptions` is an object prop** — like `disabledDates` on the calendar, an array prop cannot pass through a string attribute. Set it on the live element (`falcon-paginator.tsx:289` reads `this.rowsPerPageOptions`).
- `[CODE]` **A rows change does NOT reset the page** — `handleRowsChange` only updates `rows` and emits; the host must decide whether to jump back to page 1 (usually yes).
- `[CODE]` **The jump-to-page input and rows-per-page dropdown are native `<input>` / `<select>`** (`falcon-paginator.tsx:272-307`), not Falcon atoms — a documented PR-3-spec choice, FP-03 deferral. They are styled via paginator tokens but are not `<falcon-angular-input-number>` / `<falcon-angular-dropdown>`.
- `[CODE]` **`paginatorTemplate` vocabulary is a public contract** — the region tokens (`CurrentPageReport FirstPageLink …`) are PrimeNG-shaped; renaming them breaks every table that inherits the template.

## Verification
✅ VERIFIED against `[CODE]` `falcon-paginator.tsx` + `[CODE]` `falcon-paginator.component.ts` — the existing 6 dossier files (CVA support, PR-3 wrapper gap, native atoms, methods) are accurate; no corrections needed. Backend ownership is `[MEMORY]`/`[INFERRED]` — the component itself is verified presentational.
