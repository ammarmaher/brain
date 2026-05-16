# falcon-data-table — DECISION

## Wave 22D (2026-05-15) — Shadow rows are Angular-only by design

**Decision:** The shadow-row feature ships as an **Angular-only** capability. The cross-framework showcase originally implied by FU-01 (a single `demos/component-docs/falcon-data-table-shadow-rows.md` reused by Angular + React + Vue demos) is replaced by an Angular-only demo at `demos/angular-playground/src/studio/shadow-rows/shadow-rows-demo.component.ts` (toggled from `app.component.ts`'s view switcher). Cross-framework parity is deferred indefinitely.

**Why Angular-only:**

1. **Projection lives in the Angular wrapper, not in Stencil.** The Stencil base `<falcon-table-tw>` emits structural meta + events (`falcon-shadow-toggle`, `falcon-shadow-action`, `falcon-shadow-delete-request`, `falcon-shadow-cells-mounted`) and renders empty mount-points (`<td data-shadow-cell>`). The actual consumer template projection — the bit that turns a `<ng-template falconDataTableShadow>` into a rendered DOM subtree — uses Angular's `ViewContainerRef.createEmbeddedView` (Strategy E2, see Wave 20 decision). That orchestrator is framework-specific.
2. **React + Vue would each need their own orchestrator.** A React equivalent in `libs/falcon-ui-react/` would need a portal-style mounter that takes a `RenderFn<{ row, shadow, mode }>` and writes into the mount-point. A Vue equivalent in `libs/falcon-ui-vue/` would need a `<Teleport>`-based mounter with slot props. Both are separate features with their own consumer ergonomics — they cannot be authored from inside the Stencil base.
3. **Raw events are framework-neutral; templates are not.** React/Vue consumers of `<falcon-table-tw>` CAN consume shadow rows today — they just have to (a) listen for `falcon-shadow-cells-mounted`, (b) imperatively write DOM (or mount a React/Vue tree) into the emitted `<td data-shadow-cell>` element themselves, (c) listen for `falcon-shadow-action` to drive their own state. That is a low-level integration path, not a high-level template-based one. Documented as a path forward, not implemented.
4. **Scope discipline.** Shipping a high-level React/Vue projection orchestrator is a multi-day feature — equivalent in scope to the Angular projection rewrite that landed in Wave 20. The shadow-row feature itself is complete on its own merits; cross-framework parity is a separate program with its own design + test + token-parity work.

**Implications:**

- The earlier project memory entry `project_falcon_cross_framework_demos_inside_workspace` (which claimed cross-framework demos exist at `apps/demo/{angular,react,vue}/`) is inaccurate — those apps were never committed. Only `demos/angular-playground/` exists today. Memory file marked **SUPERSEDED** in this wave.
- `libs/falcon-ui-showcase-data/` (cross-framework registry + 28 MD docs) is orphaned scaffolding; if cross-framework demos are revived it can be reused, but it has no consumer today.
- The Vite + tsconfig alias for `@falcon/ui-core/angular` added in this wave gives `demos/angular-playground/` first-class access to the Angular wrapper layer — future Angular demos that need wrappers (not just raw Stencil tags) can extend this same pattern.

**Status:** **SHIPPED Wave 22D.** Demo verified via `npx vite build` (Angular compiler green for the new component; pre-existing `tsc -b` errors in `main.ts` + `component-docs-panel.component.ts` are unrelated and predate this wave).

---

## Wave 21 (2026-05-15) — Why `(shadowRowDeleteRequest)` over `[(shadowRows)]` two-way binding

**Decision:** The original Wave 20 follow-up FU-04 was "two-way `[(shadowRows)]`". After analysis it was re-scoped to a new convenience output `(shadowRowDeleteRequest)` emitting `{ row, shadow, proposedShadowsForRow }`.

**Why two-way `[(shadowRows)]` is the wrong shape:**

1. **Ownership clarity.** `shadowRows` is consumer-derived collection state — typically produced by a `computed()` over server data, a feature-flag selector, or a service query. The library never "owns" the shadow map; it only reads it as input. Two-way binding implies bidirectional ownership and would conflate sources of truth.
2. **Mutation semantics.** Stencil receives a STRIPPED meta map (just `{ id, targetColumn, mode }` per shadow). The consumer payload (`data: D`) lives only in the Angular wrapper's input. If the library wrote back into `shadowRows`, the consumer's typed `D` payload would have to round-trip through the meta map — and the wrapper can't reconstruct a `D` it didn't author.
3. **Three input shapes.** `FalconShadowRowsInput<T>` accepts a `Map`, a `Record`, OR a `(row) => ShadowRow[]` function. There is no canonical "writeable" shape — pushing mutations back through a function-shape input is nonsensical.
4. **No two-way idiom for derived state.** Angular's two-way binding (`[(x)]="y"`) is a sugar over `[x]="y" (xChange)="y = $event"`. It works well for unidirectionally-owned primitives (selection, expanded ids, mode overrides). It does not work well for derived collections.

**Why `(shadowRowDeleteRequest)` wins:**

1. **Pure event.** The library proposes a new state, the consumer decides whether to apply, transform, persist, or ignore. Side-effects stay on the consumer side.
2. **Composable with the existing API.** Fires ALONGSIDE the existing `(shadowRowDelete)`. Consumers picking only `(shadowRowDelete)` are unaffected. Consumers wanting the convenience pick up `(shadowRowDeleteRequest)` for zero-ceremony "splice and re-render" patterns.
3. **No two-way ceremony.** The consumer's signal/observable/setter remains the source of truth. No need to reason about input-write loops or change-detection cycles in the wrapper.
4. **Symmetric with future extensions.** If a future wave needs `(shadowRowAddRequest)` or `(shadowRowReorderRequest)`, the same pattern composes — each emits the proposed-new-state without taking ownership.

**Status:** **SHIPPED Wave 21.** First consumer follow-up: management-console migration (FDT-SHADOW-FU-07) should adopt `(shadowRowDeleteRequest)` if its data-flow tolerates the optimistic "apply proposal" model.

---

## Wave 20 (2026-05-15) — Shadow rows: ng-template + Strategy E (Strategy E2)

**Decision:** Multi-shadow editable rows use `<ng-template falconDataTableShadow>` + `<ng-template falconDataTableShadowActions>` projected through Strategy E (the same Stencil-emits-mount-points / Angular-creates-EmbeddedViewRef pattern used by the existing cell projection).

**Alternatives considered:**

| Strategy | Why rejected |
|---|---|
| **Light-DOM slots (`<slot name="shadow-row-{id}">`)** | Stencil `shadow: false` does NOT auto-redistribute slotted light-DOM children. Wave 14 already had to manually move `slot="row-expansion"` children in `componentDidRender`. Scaling that pattern to N-shadow-rows-per-N-parent-rows multiplies the manual-redistribution complexity. |
| **`NgComponentOutlet` + per-shadow component class** | Forces every consumer to declare a one-off component per shadow shape. Loses the inline-template ergonomics designers + UI engineers expect. Heavy on `ComponentFactoryResolver` machinery. |
| **`expandedRowId` (single-shadow row-expansion)** | Already exists. Only supports ONE auxiliary row per parent. The CommChannels & Services scenario needs N scheduled changes per app, each tied to a different column. |
| **Per-page hand-rolled `<tr>` in app code** | Forbidden — UI/UX rule from `organization-hierarchy/UI_UX_RULES.md` (and standing Falcon library-first rule). Page-level layouts skip token + a11y + i18n. |

**Why Strategy E wins:**

1. Reuses the existing Stencil `falcon-cells-mounted` projection orchestrator pattern — proven in production.
2. Consumer ergonomics — inline `<ng-template>` with typed context (`row`, `shadow`, `mode`, `startEdit`, `save`, `cancel`, `delete`).
3. Mode toggling is library-owned (`shadowRowModes` two-way binding) — consumer never has to wire `view` ↔ `edit` button handlers manually unless they want to.
4. Notch alignment is library-owned (`targetColumn` is the only public contract) — consumers can NEVER produce a misaligned notch.
5. Tokens cover all visual chrome (9 tokens) — consumers tweak via per-instance host class.
6. Regression-fenced — `hasShadowRows === false` skips ALL shadow code paths in Stencil (zero overhead for tables that don't use the feature).

**Status:** **READY** for production use. First consumer: admin-console `applications-table` (CommChannels & Services tab on the organization-hierarchy page). management-console migration is pending (FDT-SHADOW-FU-07).



## Brain SK final recommendation

### USE THIS COMPONENT FOR

- **Every new Angular list/table page.** This is the canonical Angular data-table.
- Sortable + paginated + selectable lists with custom Angular cell templates.
- Tables that require row-action `⋮` menus (typed `rowActions` or legacy `rowMenuItems`).
- Server-side pagination/sort/filter (`[lazy]="true"`).
- Tables that render Falcon Angular components (avatar / status-badge / tag / button) inside cells — projected templates support this fully.

### AVOID THIS COMPONENT FOR

- Tree-shaped data → `<falcon-angular-tree-table>`.
- Bespoke org-hierarchy with chevrons + per-node menus → `<falcon-organization-hierarchy-tree-tw>`.
- Framework-agnostic mounts → `<falcon-table-tw>`.
- Form controls (no `[(ngModel)]`).

## Preferred variant / render path

- **Always Light DOM** — the component is hardcoded to render `<falcon-table-tw>` with `[hosts-external-cells]=""`. The `[useTailwind]` input is API-symmetry only, kept so consumers can write `[useTailwind]="true"` uniformly across Falcon wrappers.

## Required upgrades before wider use

| ID | Priority | Why |
|---|---|---|
| FDT-01 multiSortChange output | **P1** | Multi-sort mode is non-functional from the consumer's view (no event surfaces) |
| FDT-02 Projection-orchestrator specs | **P1** | Strategy E is non-trivial; regressions are likely without tests |
| FT-01 PrimeIcon row-action button removal | **P0** | Inherited from `falcon-table` (FT-01) — `pi pi-ellipsis-v` violates Wave PR-8 |
| FT-02/FT-03 Keyboard sort + grid nav | **P0/P1** | Inherited from `falcon-table` core — same a11y impact |
| FDT-04 Implement or remove reorder/resize placeholders | **P2** | API surface confusion |

## Relationship to other components

- **Builds on `falcon-table-tw`** (Stencil Light DOM) — the rendering substrate.
- **Composes `falcon-angular-menu`** for the row-action `⋮` popup.
- **Projects four directives** (`[falconDataTableCell]`, `[falconDataTableHeaderCell]`, `[falconDataTableEmpty]`, `[falconDataTableLoading]`).
- **Sibling Falcon wrappers commonly rendered inside cells:** `falcon-angular-avatar`, `falcon-angular-status-badge`, `falcon-angular-tag`, `falcon-angular-button`, `falcon-angular-icon`.
- **Sibling for empty state:** `falcon-angular-empty-state` (project via `<ng-template falconDataTableEmpty>`).

## Exact rule for future implementation tasks

1. **Use `<falcon-angular-data-table>` for any new Angular table.** Never hand-roll `<table>`.
2. Define typed `ColumnDef[]` in the feature state service. Declare it `readonly`.
3. For every non-text cell (status / avatar / actions / tags), use `<ng-template falconDataTableCell="field">` — NEVER use `col.render()`.
4. Prefer typed `[rowActions]` over `[rowMenuItems]` / `[boundMenuItems]`.
5. Use `[lazy]="true"` + `[totalRecords]` + `(lazyLoad)` for server-side pagination.
6. Use `[showGlobalFilter]` + `[globalFilterFields]` for instant client filter; thread `(globalFilterChange)` through your existing lazy-load cycle for server-side filter.
7. For empty pages, project `<ng-template falconDataTableEmpty>` with `<falcon-angular-empty-state>`.
8. For loading, project `<ng-template falconDataTableLoading>` only if you want custom content (default skeleton rows already ship).
9. Pass `[rootClass]` and `[tableStyleClass]` for table-level Tailwind. Use per-column `tdClass` / `widthClass` for per-cell utilities.
10. Apply per-instance token overrides via a host class + `--falcon-data-table-*` mutations.

## Status

**READY** for production use. Heavy active deployment in both admin-console + management-console organization-hierarchy pages. The Strategy E projection orchestrator is the foundational pattern that makes Angular cell templates work over Stencil Light DOM — it's working as designed.

Caveats (must fix soon):
- Inherits the `pi pi-ellipsis-v` PrimeIcon row-action button from `falcon-table` core (P0 fix in the Stencil core).
- `[reorderableColumns]` / `[resizableColumns]` placeholder inputs (P2 — implement or remove).
- No `(multiSortChange)` output (P1).

## Dynamic capability assessment

### 1. What is static today?

- The fact that the component renders `<falcon-table-tw>` (not `<falcon-table>` Shadow). Hardcoded — `[useTailwind]` does nothing operative.
- The row-menu component used internally — always `<falcon-angular-menu>` with `[appendTo]="'body'"`.
- The `[currentPageReportTemplate]` and `[paginatorTemplate]` are hardcoded in the template (lines 31-32) — consumers can't override the report text shape.
- The row-action `⋮` icon — still `pi pi-ellipsis-v` from the Stencil core.

### 2. What is already dynamic through inputs/outputs?

All key behaviour: data, columns, selection (two-way), pagination (size, options, totalRecords, lazy), sort (mode, change), loading (with skeleton count), scrollable + scrollHeight, striped, hoverable, tableStyleClass, rootClass, rowStyleClass, global filter (show, fields, value, change), row-actions (three input shapes), action flags, sticky actions, paginator-dropdown append-to, empty message (key + pre-translated).

Events: `selectionChange`, `sortChange`, `lazyLoad`, `rowAction`, `rowMenuAction` (alias), `globalFilterChange`.

### 3. What is already dynamic through slots / ng-template?

- Per-column body cell: `<ng-template falconDataTableCell="field">` with context `{ $implicit: row, row, value, field, rowIndex }`.
- Per-column header cell: `<ng-template falconDataTableHeaderCell="field">` with context `{ $implicit: column, field }`.
- Empty state: `<ng-template falconDataTableEmpty>`.
- Loading body: `<ng-template falconDataTableLoading>`.
- Inline column-level templates: `ColumnDef.template` + `ColumnDef.headerTemplate` (precedence: inline > projected).

### 4. What is dynamic through token / theme overrides?

The full data-table token surface (19 categories, ~80 variables) PLUS inherited `falcon-table` tokens. Per-instance host-class + `--falcon-data-table-*` override pattern works.

### 5. What is dynamic through Tailwind classes?

- Per-column header: `widthClass`
- Per-column cell: `tdClass`
- Per-row: `rowStyleClass` callback returning a single string (note: only string, not array — the wrapper coerces via `(row) => fn(row as T)` at line 287 and the Stencil core supports the wider `string | string[] | Record<string,boolean>`)
- Host: `rootClass`
- Inner `<table>`: `tableStyleClass`

### 6. What is missing to make this component reusable across pages?

- `[density]` input (Stencil core supports it; wrapper doesn't expose it).
- `(multiSortChange)` output.
- A typed cell-template context helper for better TS inference.
- A built-in empty-state composer (`[emptyState]="{ iconName, descriptionKey, actionLabelKey }"`).
- Virtual scrolling for large lists.

### 7. What capability should be added to the shared component vs per-page?

- **Density input:** definitely shared — minor wrapper edit (forward `[density]` to `[attr.density]`).
- **`multiSortChange`:** definitely shared.
- **Default empty-state composition:** shared.
- **Virtual scrolling:** shared (CDK virtual-for + Strategy E coordination).
- **PrimeIcon row-action fix:** in the Stencil core (`falcon-table` FT-01).

### 8. What flags/options/templates/slots would make it better?

- `[density]` input.
- `[autoFocusOnReady]` so newly-rendered tables can focus their first row.
- `[searchPlaceholder]` + `[searchAriaLabel]` (currently passes through whatever the core hardcodes).
- `[paginationAriaLabel]`.
- `(multiSortChange)` output.
- `[emptyState]="{ iconName, titleKey, descriptionKey, actionLabelKey }"` shape that composes `<falcon-angular-empty-state>` without a template.
- `<ng-template falconDataTableRowExpansion>` for expandable rows (long-tail feature).

### 9. What is the safest upgrade path?

1. Add `[density]` input — fully additive (P1).
2. Add `(multiSortChange)` — additive, forwards an already-existing Stencil event (P1).
3. Wire optional `[emptyState]` shape — additive (P2).
4. Implement (or remove) `[reorderableColumns]` / `[resizableColumns]` (P2).
5. Add typed-action callback support (`FalconDataTableRowMenuAction<T>.command`) — additive (P2).
6. Add virtual scrolling behind an opt-in `[virtual]="true"` flag — additive (P2).
7. **Eventually deprecate `rowMenuItems` and `boundMenuItems`** once consumers migrate to typed `rowActions`.

### 10. What would be risky to change because other pages depend on it?

- **`ColumnDef` field name `headerKey`** (i18n key vs label) — consumers (admin-console + management-console) treat it as either translation key OR plain label. Renaming breaks both.
- **`emptyMessageKey` semantics** — the input does NOT translate; renaming or wiring translate would silently change behaviour for existing consumers.
- **The `rowAction` / `rowMenuAction` dual-emit** — both events fire from `onMenuItemSelect`. Consumers may listen on either. Removing the alias breaks something.
- **The three menu-input shapes** (`rowMenuItems` / `boundMenuItems` / `rowActions`) precedence — changing order would silently change row-menu content.
- **`<falcon-angular-menu>` `[appendTo]="'body'"`** — flipping to inline would affect z-index stacking in modals / drawers.
- **`addEventListener` event names** — `falcon-cells-mounted`, `falcon-row-action-trigger`, `falcon-row-select`, `falcon-sort`, `falcon-lazy-load`, `falcon-global-filter-change`. Rename = break.
- **`adaptColumns()` `align` mapping** — `'right' → 'end'`, `'left' → 'start'`. Consumers passing other values fall through unchanged. Documented in the source.

**Verdict:** `<falcon-angular-data-table>` is the most production-mature wrapper in the Falcon UI core. Its main risk surface is the legacy input shapes and the inherited PrimeIcon — both well-known and solvable.
