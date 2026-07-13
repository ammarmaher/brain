# falcon-table — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify the right Falcon component, and how to compose it to parity.
> **falcon-table is the substrate.** In app code you almost never name it directly — the consumer-facing component is `<falcon-angular-data-table>` (own dossier). This layer fingerprints the *table shape* and routes the agent to the data-table for Angular work, to the Stencil tag for framework-agnostic work.

## Visual fingerprint
`[CODE]` falcon-table-tw.tsx — A bordered, optionally-striped grid of rows under a header row. The header carries column labels; sortable columns show a `▲▼` sort glyph and a per-priority badge in multi-sort. Optional leading column: a checkbox (multiple-select) or radio (single-select). Optional trailing column: a `⋮` row-action trigger. Optional sticky header on scroll; optional frozen columns pinned to the inline edge. A footer paginator strip (`{first} - {last} of {totalRecords}` + first/prev/jump/next/last + rows-per-page). A `<input type="search">` global-filter box. Loading → skeleton rows; empty → a single centred message cell. Distinguishing trait vs siblings: **flat rows, no indentation, no expand chevron on data rows** (a chevron, if present, belongs only to a shadow-row parent).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<DataGrid>` / `<Table>` + `<TablePagination>` | MUI `DataGrid` ≈ `<falcon-angular-data-table>` (sort/select/paginate/lazy in one); plain `<Table>` ≈ raw substrate |
| PrimeNG | `<p-table>` | direct 1:1 — `falcon-table` replaced the legacy `<falcon-data-table>` PrimeNG `p-table` wrapper in Wave PR-7; `currentPageReportTemplate` / `paginatorTemplate` token vocabulary is deliberately PrimeNG-shaped |
| Ant Design | `<Table>` | columns-array + dataSource model maps 1:1 |
| Bootstrap | `.table` / `react-bootstrap <Table>` | upgrade target — replace with the data-table |
| shadcn / Radix | `<Table>` + TanStack Table | shadcn ships the markup, TanStack the logic; `falcon-table` bundles both |
| plain HTML | `<table><thead><tbody>` | always replace — never hand-roll a `<table>` for a Falcon list |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a flat list of records, sortable / selectable / paginated | `<falcon-angular-data-table>` (Angular) — substrate is `falcon-table` | raw `<falcon-angular-table>` (deprecated) |
| a framework-agnostic table (React/Vue/vanilla) with no Angular cell templates | Stencil `<falcon-table-tw>` directly | the Angular wrapper |
| rows that **indent** and **expand** to reveal child rows of the *same column shape* | `<falcon-angular-tree-table>` | falcon-table |
| a hierarchy with chrome that differs per depth (root header + child list + per-row menu) | `<falcon-angular-tree>` / `<falcon-tree-panel>` / `<falcon-organization-hierarchy-tree-tw>` | falcon-table |
| a per-row preview of a *pending change* under the parent | `<falcon-angular-data-table>` shadow-rows API | a separate component |
| a single search field above a list (no other filters) | the table's built-in `[showGlobalFilter]` + `[globalFilterFields]` | `<falcon-angular-filter-panel>` |
| a multi-field filter strip (status select + date range + text) above the list | `<falcon-angular-filter-panel>` (above the table) | the table's global filter |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`) — for Angular, work through `<falcon-angular-data-table>`:
1. **Inputs** — `[data]`/`rows`, `[columns]` (each `FalconTableColumn`: `key`, `label`, `sortable`, `type`, `width`, `align`); `selectionMode`, `sortMode`, `paginated`, `pageSize`, `density`, `striped`, `scrollable`, `lazy` + `totalRecords`.
2. **Column descriptor extras** — `FalconTableColumnExt`: `headerClass` / `cellClass` (Tailwind), `maxWidth`, `frozen`, `render` (HTML-string fallback only).
3. **Templates (Strategy E)** — `<ng-template falconDataTableCell="field" let-row>` for custom cells, `<ng-template falconDataTableHeaderCell>`, `<ng-template falconDataTableEmpty>`, `<ng-template falconDataTableLoading>`. This is how you render `<falcon-angular-status-badge>`, `<falcon-angular-tag>`, `<falcon-angular-avatar>`, action menus inside cells.
4. **Shadow rows** — pass `shadowRows` meta + a per-shadow template for scheduled-change previews.
5. **Variants** — `selectionMode` (`none`/`single`/`multiple`), `sortMode` (`single`/`multiple`), `density`, `responsiveLayout` (`scroll`/`stack`).
6. **Token override** — host marker class + re-declare `--falcon-table-*` (14 categories) for spacing / colour; `[styleClass]` / `[tableStyleClass]` for container Tailwind.
7. **Upgrade** — gaps (keyboard sort, `i18n` search placeholder, `status`/`tag`/`avatar` column types, `<falcon-empty-state>` composition) → raise as a shared-component upgrade (`GAPS_AND_UPGRADES.md` FT-01..FT-11), never hand-roll.
8. **Wrapper** — for a recurring feature shape (e.g. the shared `<app-applications-table>`), wrap the data-table once and reuse.

## Anti-patterns
- Raw `<table>` / `<thead>` / `<tbody>` HTML for a Falcon list — banned (`feedback_falcon_ui_library_only_no_native`).
- New `<falcon-angular-table>` usages — the basic wrapper is `@deprecated`; reach `<falcon-angular-data-table>`.
- PrimeNG `<p-table>` in app code — banned; the data-table replaced it.
- A Falcon Angular component inside `col.render()` — `render()` is an HTML string via `innerHTML`; the component never instantiates. Use a `falconDataTableCell` template.
- `[attr.rows]` / `[attr.columns]` — object/array inputs must be element *properties*, not attributes.
- Using `col.type='badge'` for a business-meaningful status — it renders a generic neutral chip with no severity. Project a `<falcon-angular-status-badge>` cell template.
- Using falcon-table for indented / expandable hierarchical data — that is `<falcon-angular-tree-table>` (see the table-vs-tree-vs-tree-table split above).

## Verification
🟡 CODE-DERIVED, RE-VERIFIED 2026-06-03 (B08) from `[CODE]` falcon-table-tw.tsx (1702 ln) + falcon-table.types.ts (227 ln) + the UI-layer dossiers. Visual-fingerprint `⋮` + chevron glyphs confirmed as `falcon-icon falcon-icon-{ellipsis-v,chevron-down}` (no PrimeIcon). Cross-library map `[INFERRED]` from standard library APIs. Data-table-is-the-consumer-surface routing ✅ VERIFIED against `OVERVIEW.md` + Wave 17 `[MEMORY]`.
