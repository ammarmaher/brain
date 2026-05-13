# falcon-table — DECISION

## Brain SK final recommendation

### Use this component (Stencil core) for

- Framework-agnostic mounts (vanilla / React / Vue) — `<falcon-table>` (Shadow) or `<falcon-table-tw>` (Light).
- As the substrate behind a higher-order Angular wrapper that does Strategy E projection.
- Reading tokens for any consumer that needs to match Falcon table chrome visually.

### AVOID this component for

- **Direct Angular use.** Use `<falcon-angular-data-table>` (`FalconAngularDataTableComponent`) instead. It exists explicitly so consumers don't have to drop down to the Stencil tag.
- `<falcon-angular-table>` (the basic Angular wrapper) — **DEPRECATED** per its own JSDoc; do not add new usages.

## Preferred variant / render path

- **Light DOM `<falcon-table-tw>` is the canonical render path** for Angular pages. The Strategy E projection (`hostsExternalCells=true` + `falcon-cells-mounted` event) requires Light DOM access to mount `EmbeddedViewRef` root-nodes into `<td data-cell-mount=…>` cells. Shadow DOM cannot project Angular templates through this mechanism.
- Shadow DOM `<falcon-table>` is the visual reference (declarative token consumption) and powers framework-agnostic mounts.
- `useTailwind=true` is the default on the basic Angular wrapper; flip to `false` only if you need Shadow encapsulation and don't need Angular cell templates.

## Required upgrades before wider direct use

| ID | Priority | Blocker for |
|---|---|---|
| FT-01 PrimeIcon removal at `falcon-table.tsx:655` | **P0** | Compliance with Wave PR-8 PrimeIcons-removal rule |
| FT-02 Keyboard sort | **P0** | A11y certification (sortable columns must be keyboard-activatable) |
| FT-03 Grid keyboard nav | **P1** | WAI-ARIA grid contract (`role="grid"` implies arrow-key nav) |
| FT-04 i18n strings | **P1** | RTL pages / Arabic UI for hardcoded `'Search…'` placeholder |
| FT-11 Stencil unit tests | **P1** | Regression confidence as features compound |

## Relationship to other components

- **`falcon-angular-data-table`** — the Angular-canonical consumer; composes `<falcon-table-tw>` and adds Strategy E projection. Use this in features.
- **`falcon-paginator`** — composed in the footer when `paginated=true`. Same token vocabulary for `currentPageReportTemplate` and `paginatorTemplate`.
- **`falcon-empty-state`** — visually adjacent. Could be composed by default empty cell (currently bare text). Falcon-angular-data-table can project a custom empty template; the bare core does not yet wire `<falcon-empty-state>`.
- **`falcon-filter-panel`** — separate component for above-table filters. Global filter is built into the table; per-column filters are reserved (`internalFilters` state) but unrendered.
- **`falcon-tree-table`** — for tree-shaped data (CSS Grid recursive expandable rows). Different component, different purpose.
- **`falcon-status-badge`, `falcon-tag`, `falcon-badge`** — referenced in cells via `<ng-template falconDataTableCell>`. The `col.type='badge'` built-in renders a generic neutral chip, not the severity-aware variants.

## Exact rule for future implementation tasks

1. **Never** add a new `<falcon-angular-table>` usage in app feature code.
2. For new list pages: use `<falcon-angular-data-table>` (`FalconAngularDataTableComponent`).
3. For framework-agnostic mounts (showcase, docs, cross-framework demos): `<falcon-table-tw>` is the source of truth.
4. For status / tag cells: project a `<ng-template falconDataTableCell="status">` that renders `<falcon-angular-status-badge>` — DO NOT use `col.render()` (HTML string, not Angular component).
5. For paginator inside a table: rely on the built-in footer (`paginated=true`). Don't add a separate `<falcon-angular-paginator>` outside the table.
6. For empty/loading states: project `<ng-template falconDataTableEmpty>` and `<ng-template falconDataTableLoading>` via the data-table directives.

## Status

**NEEDS-UPGRADE** for direct use. **READY** as the substrate behind `<falcon-angular-data-table>`. Core component is feature-rich (lazy mode, frozen columns, multi-sort, sticky actions, scroll mode, ARIA grid) and the project's prime data-table primitive — but its row-action `⋮` button still ships a `pi pi-ellipsis-v` PrimeIcon class which violates Wave PR-8.

## Dynamic capability assessment

### 1. What is static today?

- Search input placeholder (`'Search…'`) and aria-label (`'Search'`) — hardcoded English.
- Pagination region order — controllable via `paginatorTemplate` string but tokens are PrimeNG-shaped (`CurrentPageReport FirstPageLink …`).
- Empty cell content — bare `<td>{emptyMessage}</td>` text; no icon / illustration unless Strategy E is in use.
- Skeleton structure — hardcoded `<span class="falcon-table-skeleton-block" />` per cell.
- Sort glyph — Unicode `▲▼`. Not configurable per-component.
- Cell type `'badge'` renders a generic neutral chip (no severity).
- Row-action icon — `pi pi-ellipsis-v` (PrimeIcon — should be Falcon icon).

### 2. What is already dynamic through inputs/outputs?

All key behaviour: rows, columns (with sortable, type, width, align, headerClass, cellClass, maxWidth, render, frozen, alignFrozen), selection (single/multi/none), sort (single/multi via shift/meta/ctrl), pagination, lazy server-side mode, global filter, density, scrollable + scrollHeight, sticky actions, responsive layout, row-style-class callback, skeleton rows count, row-action trigger.

Events: row-click, row-select, sort, multi-sort, select-all-change, empty, row-action-trigger, page-change, lazy-load, global-filter-change, cells-mounted (Light + hostsExternalCells only).

### 3. What is already dynamic through slots / ng-template?

- **Stencil Shadow has NO slots.** Cells produced by `col.render()` (HTML string via `innerHTML`) or built-in `col.type` renderers.
- **Stencil Light has Strategy E projection points** (`<td data-cell-mount=…>`) used only by `<falcon-angular-data-table>`. The mount-points themselves are not directly consumable as slots from `apps/` Angular code — that lives in the Angular wrapper.
- **No header / footer / paginator slots** at the core level.

### 4. What is dynamic through token / theme overrides?

The full token contract (14 categories, ~80 variables). Per-instance: add a marker class on the host and re-declare `--falcon-table-*` tokens inside that scope.

### 5. What is dynamic through Tailwind classes?

- Container: `[styleClass]` input.
- Table element: `[tableStyleClass]` input.
- Per-row class: `[rowStyleClass]` callback returning `string | string[] | Record<string, boolean>`.
- Per-column header: `headerClass` on `FalconTableColumnExt`.
- Per-column cell: `cellClass` on `FalconTableColumnExt`.

### 6. What is missing to make this component reusable across pages?

- Angular template projection in the basic wrapper. Today only `<falcon-angular-data-table>` projects cells.
- `<falcon-empty-state>` composition for the default empty cell.
- Status/Tag column types that compose `<falcon-status-badge>` / `<falcon-tag>` directly instead of consumer doing it via templates.
- Avatar column type for user rows.
- Keyboard navigation per WAI-ARIA grid pattern.
- i18n hooks for built-in strings.

### 7. What capability should be added to the shared component vs per-page?

- **All visual / interaction gaps belong in the shared component.** No per-page hack is justified for the table since pages already enjoy `<falcon-angular-data-table>` projection.
- The PrimeIcon row-action button MUST be fixed in the shared component.
- A `searchPlaceholder` / `searchAriaLabel` / `paginationAriaLabel` triplet should be added so consumers can pass translated strings.

### 8. What flags/options/templates/slots would make it better?

- `tabindex="0"` + `(keydown.enter)`/`(keydown.space)` on sortable headers.
- Arrow / Home / End row navigation behind a `keyboardNav` flag.
- `searchPlaceholder` + `searchAriaLabel` + `paginationAriaLabel` strings.
- `emptyStateIconName`, `emptyStateDescription` so default empty cell composes `<falcon-empty-state>`.
- `col.type = 'status' | 'tag' | 'avatar' | 'badge-typed'` and matching descriptor fields.
- Strategy E for the global filter input so consumers can project `<falcon-angular-search-input>`.

### 9. What is the safest upgrade path?

1. Fix the PrimeIcon row-action button — single source change, no API break (P0).
2. Add `tabindex="0"` + keydown handler to sortable `<th>` — additive, no API break (P0).
3. Add `searchPlaceholder`, `searchAriaLabel`, `paginationAriaLabel` props with English defaults — fully additive (P1).
4. Add grid keyboard navigation behind a default-on `keyboardNav` flag (consumers can opt out for legacy) — additive (P1).
5. Add `'status' | 'tag' | 'avatar'` column types that compose the matching Falcon component — additive (P2).
6. Compose `<falcon-empty-state>` for the default empty cell behind an `emptyState: { icon, description }` prop — additive (P2).

### 10. What would be risky to change because other pages depend on it?

- **Renaming `selectable` → `selectionMode`** — already done (legacy alias preserved in `effectiveSelection`). Don't remove `selectable` until consumers migrate.
- **Changing `currentPageReportTemplate` / `paginatorTemplate` vocabulary** — these strings are passed through to `<falcon-paginator>`. Vocabulary mirrors PrimeNG's documented spec; consumers may rely on it. **Do not change.**
- **`col.render()` HTML interpretation via `innerHTML`** — switching to template strings or sanitised render would break existing consumers passing markup. Document as `@deprecated` and prefer templates instead, but don't remove silently.
- **Stencil Strategy E mount-point attribute names** (`data-cell-mount`, `data-header-mount`, `data-row-id`, `data-row-index`) — `<falcon-angular-data-table>` reads these directly. **Renaming would break the projection orchestrator.**
- **Event names** (`falcon-row-click`, `falcon-cells-mounted`, etc.) — kebab-case is part of the public surface. The Strategy E orchestrator binds `addEventListener('falcon-cells-mounted', …)` literally.
- **`hostsExternalCells` opt-in flag** — flipping its default to `true` would change rendering for every existing direct consumer of `<falcon-table-tw>`. Keep `false`.

**Verdict: `<falcon-table>` core is mature.** The risky paths are well-known and gated by either type-level contracts or wrapper compositions.
