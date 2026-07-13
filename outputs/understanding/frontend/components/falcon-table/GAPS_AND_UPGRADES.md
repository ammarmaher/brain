# falcon-table — GAPS & UPGRADES

## Missing capabilities

### Cell rendering & projection

- **Basic Angular wrapper (`<falcon-angular-table>`) has no Angular template projection.** Cells are produced by `col.render()` (HTML-string-via-`innerHTML`) or the built-in column type renderers. Custom Angular components inside cells require `<falcon-angular-data-table>` (Strategy E). **P1** — wrapper is already `@deprecated`, but documentation should explicitly call out the deprecation in the source comment.
- **Stencil Light variant emits `falcon-cells-mounted` only when `hostsExternalCells=true`.** This is intentional — without the flag the host renders text/HTML cells itself. **No gap, but document clearly** that Strategy E is opt-in.

### Keyboard accessibility

- **No Arrow / Home / End row navigation on data rows.** Rows are `tabIndex={0}` (`falcon-table.tsx:596`, `falcon-table-tw.tsx:707`) but only TAB walks through them. ARIA `role="grid"` implies grid navigation per WAI-ARIA Authoring Practices. **P1 — would meaningfully improve a11y for large tables.**
- **No Space / Enter to toggle selection.** Selection toggles only on checkbox/radio cell input — clicking the row body emits `falcon-row-click` only.
- **No header keyboard sort.** Headers have a click handler but no `tabindex` / `Enter`/`Space` keydown. **P0 for a11y compliance** — sortable columns must be reachable + activatable by keyboard.

### Empty / loading composition

- **Empty cell renders bare text via `colSpan={totalCols}`.** Not composed with `<falcon-empty-state>` for icon/title/description/action layout. Strategy E projection lets `<falcon-angular-data-table>` provide `<ng-template falconDataTableEmpty>`, but the core doesn't compose `<falcon-empty-state>` by default. **P2 — easy win for consistency with the rest of the system.**
- **Skeleton rows are local CSS classes (`falcon-table-skeleton-row`, `falcon-table-skeleton-block`), not a Falcon Skeleton primitive.** No `<falcon-skeleton>` exists yet — `feedback_no_inline_styles_tokens_only.md` rule is honoured via tokens, but no shared skeleton component to reuse. **P3**.

### Cell types

- `col.type` switch handles `'text' | 'number' | 'badge' | 'currency' | 'date' | 'icon' | 'custom'`. `'date'` carries no formatter — just falls through to `String(value)`. **P2 — wire a `dateFormat` field or supply a locale formatter.**
- The built-in `'badge'` case renders a generic neutral chip — does NOT compose `<falcon-status-badge>` / `<falcon-tag>` (severity-aware). **P2 — promote to a typed `'status' | 'tag'` column type that composes the right Falcon component.**
- No `'avatar'` cell type for user-row tables (admin/management both show user lists).

### Selection

- `'single'` selection uses a radio per row with a deterministic group name (`${host.id}-row-select`). When two `<falcon-angular-table>` instances exist without explicit `host.id`, they could share a group. **P2 — fall back to a generated id when `host.id` is empty.**

### Sorting

- Multi-sort flips between single + multi modes when a sortable column is shift/meta/ctrl-clicked. The priority badge renders only when `sortList.length > 1`. **No way to drop a single column from the multi-sort list except by clicking it twice to flip + once more to re-add** — there is no explicit "remove from sort" affordance. **P3**.
- Multi-sort priority badge is a `<span>` next to the glyph; no per-column visible "drag to reorder priority". **P3**.

### Frozen columns

- `frozen: 'left' | 'right' | true` is supported but the Light variant relies on the cell `data-frozen` attribute and `falconTableFrozenColumnClasses` helper for `position: sticky; inset-inline-start: 0` style — z-index conflicts with action column on Safari should be tested. **P2 — add explicit `--falcon-table-frozen-cell-z` interaction with `--falcon-data-table-actions-sticky-bg`.**
- `alignFrozen` is exposed in `FalconTableColumnExt` but isn't read in either Stencil render path (verified — both call `resolveFrozenSide()` only). **P2 — either implement it or remove from the public type.**

### Pagination

- The paginator inside the Light variant is `<falcon-paginator-tw>`. Strategy E projection orchestrator doesn't expose a way to project a custom paginator. **P3 — most consumers do not need this.**

### Row actions

- **FT-01 RESOLVED (2026-06-03).** The row-action `⋮` icon is now `<i class="falcon-icon falcon-icon-ellipsis-v">` in BOTH render paths (`[CODE]` falcon-table.tsx:660 Shadow / falcon-table-tw.tsx:1621 via `falconTableRowActionIconClasses()`). The prior dossier's flagship P0 (PrimeIcon `pi pi-ellipsis-v` at `falcon-table.tsx:655`) is **stale** — the source has been fixed. (The only surviving `pi pi-ellipsis-v` is in the **compiled** `falcon-table.js:402`, a stale build artifact outside the `.tsx` source sweep scope — not a code defect.) The shadow-row chevron is likewise `falcon-icon falcon-icon-chevron-down`. **No PrimeIcon remains in live `.tsx`/`.css` source.**
- `[CODE]` NEW per-row kebab gate: `actionsVisibleField` (`-tw`, Wave 27) hides the `⋮` for any row where `row[field] === false` — the platform "row-action gated on a row-level allowed-flag" mechanism. The actions `<td>` still mounts (column alignment preserved). Document, not a gap.

### Filtering

- Global filter is rendered by a built-in `<input type="search">`. No way to swap in `<falcon-angular-search-input>` for consistent styling. **P2 — Strategy E doesn't project this either.**
- No per-column filter UI. Only global filter. `internalFilters` state is reserved for future column filters (`falcon-table-tw.tsx:181`) but no UI ships yet.

### Internationalization

- Default English strings (`'No records to display.'`, `'Search…'`, `'Pagination'`) are bare literals — consumers must pass translated strings via `emptyMessage` / `ariaLabel`. Filter input placeholder `'Search…'` is **hardcoded in source** (`[CODE]` falcon-table.tsx:460, falcon-table-tw.tsx:1263 — line refs updated 2026-06-03). **P1 — add `searchPlaceholder` + `searchAriaLabel` props.** (Note: the Actions-column header IS now i18n-able via `actionsHeaderLabel` (`-tw`), and the shadow-row labels/aria-labels are i18n-able — the search placeholder is the main remaining hardcoded string.)
- Sort glyph is Unicode `▲▼` — direction is fine across LTR/RTL but might collide with the Falcon icon font visual language. **P3.**

### Tailwind / token parity (Shadow vs Light)

- Shadow uses `falcon-table.css`; Light uses the helper functions in `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts`. Both consume `--falcon-table-*` tokens so the tokens.css file is the SSOT.
- The Light variant adds extra helper variants (`falconTableSortIconStateClasses`, `falconTableSpinnerClasses`, `falconTableStickyActionsHeaderClasses`, etc.) that the Shadow CSS represents differently. **Risk:** future token additions to the Shadow path may not propagate to Tailwind helpers. **P2 — gate against parity via a CI check or shared `STYLE_CONTRACT.md`.**

### Performance risks

- `componentDidRender()` on the Light variant runs `host.querySelectorAll('[data-cell-mount]')` and `[data-header-mount]` on every render. For a 100-row x 10-column table that's 1000 lookups. Acceptable today but **could become a hotspot at higher row counts. P3**.
- `internalGlobalFilter` filtering does a `String(v).toLowerCase().includes(q)` per row per field per filter pass with no debounce. **P2 — wire a debounce (consumer pattern uses `(input)` directly).**

### Tests

- **FT-11 PARTIALLY RESOLVED (2026-06-03).** A Stencil spec now exists: `[CODE]` `falcon-table-tw.shadow.spec.ts` (346 ln, **16 specs**, Jest `newSpecPage`) covering the SHADOW-ROW internals — render fence, sticky-actions split, chevron toggle event, default action-button payloads (incl. `falcon-shadow-delete-request`), and i18n aria-labels (added Wave 22A, closes FU-08). **Still missing:** specs for the CORE table behaviour (sort / filter / lazy / selection / pagination) on either `falcon-table.tsx` or `falcon-table-tw.tsx`, and **zero** spec for the Angular basic wrapper `falcon-table.component.ts`. **P1 — narrower than originally documented (shadow internals are covered).**

## Reusable upgrades needed

| ID | Title | Priority | Recommended API |
|---|---|---|---|
| ~~FT-01~~ | ~~PrimeIcon removal~~ | **DONE 2026-06-03** | RESOLVED — `falcon-icon falcon-icon-ellipsis-v` is live in both `.tsx` paths. (Stale `pi` only in compiled `.js`.) |
| FT-02 | Keyboard sort | **P0** | Add `tabindex="0"` + `onKeyDown(Enter|Space) → headerClickHandler` on sortable `<th>` (still missing in BOTH paths — falcon-table.tsx:556 / falcon-table-tw.tsx:1416) |
| FT-03 | Grid keyboard nav | **P1** | Add Arrow/Home/End row nav per WAI-ARIA grid pattern |
| FT-04 | i18n placeholders | **P1** | `searchPlaceholder`, `searchAriaLabel`, `paginationAriaLabel` props |
| FT-05 | Compose `<falcon-empty-state>` | **P2** | Optional `emptyStateIcon`, `emptyStateDescription` so default empty cell renders the polished card |
| FT-06 | Status / Tag column types | **P2** | `col.type='status'` composes `<falcon-status-badge>`; `col.type='tag'` composes `<falcon-tag>`; per-row `severity` accessor |
| FT-07 | Avatar column type | **P2** | `col.type='avatar'` composes `<falcon-angular-avatar>` |
| FT-08 | Drop `alignFrozen` or implement it | **P2** | Either consume the prop in `headerCls`/`cellCls` or remove from `FalconTableColumnExt` |
| FT-09 | Strategy E for filter | **P2** | Allow `<ng-template falconDataTableGlobalFilter>` to project a custom filter UI |
| FT-10 | Multi-sort "remove from sort" affordance | **P3** | Shift+Alt-click to remove a column from the multi-sort list |
| FT-11 | Stencil unit tests | **P1** | Vitest specs for sort/filter/lazy/selection flows |

## Workarounds available

- **PrimeIcon row-action button:** consumer can override via custom CSS targeting `i.pi-ellipsis-v` — but this leaks PrimeIcon scoping that the entire system has banned. The fix is in the component.
- **Keyboard sort:** consumer would need a custom header template, which is only available via `<falcon-angular-data-table>`'s `<ng-template falconDataTableHeaderCell>`. So the deprecated basic wrapper has no workaround.
- **i18n:** consumers can supply `[ariaLabel]` for the table; the embedded search input placeholder is unreachable without component change.

## Visual / interaction risks

- The `falcon-table-tw` container has `overflowX: 'auto'` always-on (`falcon-table-tw.tsx:536`). When `scrollable=true` it also clamps `maxHeight`. A 100-column table is therefore always scrollable horizontally without explicit consumer opt-in. **No bug, but document.**
- Header click toggles sort even when `sortable=false` is checked first — the handler exits early. Safe.
- The Shadow variant's default empty cell has `colSpan={totalCols || 1}`. If `totalCols === 0` (no columns + no selection + no actions), the cell `colSpan` would be `0` without the `|| 1` fallback. The current code handles this safely.

## Fix in shared component vs per-page

All gaps above are **shared component fixes** — none should be patched per-page. The whole point of `<falcon-table>` is the rendering substrate.

## Future-proof recommendation

The basic Angular wrapper `<falcon-angular-table>` should be **fully deleted** once the project ships a stricter ESLint flat-block rule disallowing its selector. Today the JSDoc deprecation is silent. Adding a `@deprecated` ESLint rule + a migration codemod to `<falcon-angular-data-table>` is the cleanest path. **P2**.

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** ([CODE] grep `<falcon-angular-table>` across `apps/` + `libs/falcon/`). See `USAGE.md` for the file list.

No new structural gaps detected by Wave 7 sweep beyond items already listed above.

## Deep-Dive Sweep Findings (2026-06-03 — B08)

**Direct `<falcon-angular-table>` (basic wrapper) consumers: 0** ([CODE] grep — only comments/eslint/config refs, no render-site). Wave-7's playground consumer is gone.

Drift corrected vs prior dossier (component stays ACTIVE substrate / basic wrapper stays `@deprecated`):
- **FT-01 (P0) RESOLVED** — row-action `⋮` is `falcon-icon falcon-icon-ellipsis-v` in both `.tsx` paths; PrimeIcon survives only in the stale compiled `.js` (out of scope). This retires the flagship P0.
- **FT-11 narrowed** — a 16-spec Stencil spec (`falcon-table-tw.shadow.spec.ts`) now covers shadow-row internals; core-behaviour + Angular-wrapper specs still absent.
- **API drift filled** — added `actionsHeaderLabel` / `actionsVisibleField` (per-row kebab gate) / `expandedRowId` + the entire shadow-row prop+event suite + `row-expansion` slot + the `headerInset` Alignment-Contract type field; `data-shadow-mount` is now a `<div>` not a `<td>`; `stickyActions` default reverted to `false` (Wave 27). LOC recounted (Shadow 690, `-tw` 1702, types 227).
- **Platform `loading`-hard-swap + `busyRowIds` consumer pattern** documented in API.md (spec note a, runtime-verified 2026-05-21).
- FT-02 (keyboard sort, P0) + FT-03 (grid nav, P1) **still open in BOTH paths** — verified no `tabindex`/keydown on sortable `<th>` or data `<tr>`.
- All findings `safe-local` (doc-only) EXCEPT FT-02/FT-03 (a11y, HIGH-RISK-QUEUE); no deletion/promotion flag. See FINDINGS/B08.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B08) against falcon-table.tsx (690 ln) + falcon-table-tw.tsx (1702 ln) + the new `falcon-table-tw.shadow.spec.ts`. **FT-01 RETIRED** (PrimeIcon resolved in source); FT-11 narrowed (shadow spec exists); FT-02/FT-03 a11y gaps re-confirmed open in both paths. Component stays ACTIVE substrate; basic wrapper stays `@deprecated` with 0 consumers.
