# falcon-custom-table-footer — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

**None — the component is presentational.** `[CODE]` It owns no data and calls no endpoint. It emits a *page number* and a *rows-per-page* value; the host translates those into a backend page query. The data it reports on belongs to whatever module owns the list:
- `[MEMORY]` **Commerce** — paging a comm-channels / apps-services / order list.
- `[MEMORY]` **Identity** — paging a users list.
- `[INFERRED]` Any module owning the paged list.

## Backend wiring

| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | `[CODE]` No HTTP. The footer emits `(pageChange)` / `(rowsChange)`; `<falcon-angular-data-table>` re-emits them (falcon-data-table.component.html:80-81); the feature's state slice issues the paged query and feeds `totalRecords` / `currentPage` / `rows` back down. |

`[CODE]` When the data-table is `[lazy]="true"`, the table's `(lazyLoad)` event carries page/rows; the host fetches and updates the bound signals, which the data-table forwards to this footer. The footer never touches the network.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| `[CODE]` Page guard | the emitted page | `onPaginatorValueChange(page)` (ts:61-65) | No error — a `page < 1` (or non-number) is silently NOT emitted. The inner paginator additionally clamps to `[1, totalPages]`. |
| `[CODE]` Rows guard | the emitted rows | `onSelectRows(value)` (ts:67-70) | No error — a non-finite or `<= 0` value is silently dropped. |
| `[CODE]` `totalPages` floor | derived | `computed()` (ts:43-47) | Always ≥ 1; never surfaces "page 0 of 0". |
| `[INFERRED]` No form-level validation | — | — | The footer is navigation, not data entry. It has no CVA and nothing to mark invalid. |

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| `[INFERRED]` None | — | The footer has no PES key. It is navigation chrome — visible whenever its host table is. `disabled()` is bound from the data-table's `_isEmpty()` (empty/loading), NOT from a permission decision. |

## State / signal pattern

`[CODE]` falcon-custom-table-footer.component.ts:
- **Signals-first, no CVA.** State arrives via `input()` / `input.required()` signals (`totalRecords` required; `currentPage`/`rows`/`rowsPerPageOptions`/`disabled` + 3 labels) and leaves via `output()` signals (`pageChange` / `rowsChange`).
- Three `computed()` signals (`totalPages`, `first`, `last`) derive display values reactively from the inputs — zero imperative state, zero subscriptions, no `DestroyRef` needed (no manual streams).
- The inner native `<select>` uses one-way `[ngModel]="rows()"` + `(ngModelChange)="onSelectRows($event)"` (html:38-39) — display binding only, not a consumer-facing form control.
- The composed `<falcon-angular-paginator>` carries its own single-mode CVA internally, but this footer binds it one-way (`[currentPage]` + `(valueChange)`), NOT via `ngModel`.

## Skeleton ↔ app-wrapper layering

- **No Stencil skeleton.** This is purely the Angular-wrapper layer — there is no `<falcon-custom-table-footer>` Shadow/Light web component. It composes the `<falcon-angular-paginator>` wrapper (which DOES wrap a Stencil skeleton).
- **Layering chain:** feature → `<falcon-angular-data-table>` (Angular wrapper around the `<falcon-table-tw>` Stencil table) → `<falcon-angular-custom-table-footer>` (THIS, Angular composite) → `<falcon-angular-paginator>` (Angular wrapper) → `<falcon-paginator-tw>` (Stencil skeleton).
- Per `feedback_library_skeleton_app_api`: the footer does no data fetching — the feature's state slice does.

## Integration gotchas

- `[CODE]` **It is an INTERNAL footer — do not mount it as a sibling.** falcon-data-table.component.html:69 explicitly warns against a separate footer next to the table. Drive it through the data-table's `footer*Label` + paginator inputs.
- `[CODE]` **Disabled is empty/loading, not PES.** `[disabled]="_isEmpty()"` — a dimmed footer means "no rows," not "denied."
- `[CODE]` **Rows change does NOT reset the page** (ts:67-70 just emits) — the host (feature) must reset to page 1 on a size change or risk a transient out-of-range page.
- `[CODE]` **Labels must be pre-translated.** The footer takes plain strings (`showingLabel`/`fromLabel`/`rowsPerPageLabel`); it does NOT call a translation service. The data-table passes them (defaulting English) — a feature must bind `| translate` to localize.
- `[CODE]` **`rowsPerPageOptions` is a normal array input** (signal input) — no object-prop-attr trap here (unlike the raw Stencil paginator), because this is a pure Angular component.
- `[CODE]` **Page math assumes the host keeps `currentPage` / `rows` / `totalRecords` mutually consistent.** The footer derives the report from them; inconsistent inputs make the report and strip disagree.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED) against `[CODE]` falcon-custom-table-footer.component.ts + .html + falcon-data-table.component.{ts,html}. Confirmed: presentational (no endpoint), signals-first + no CVA, three `computed()` derivations, internal-footer warning, disabled=empty (not PES), rows-change-no-reset. Backend ownership `[MEMORY]`/`[INFERRED]`.
