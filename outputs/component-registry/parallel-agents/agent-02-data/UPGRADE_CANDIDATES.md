# Agent 2 — Reusable Upgrade Backlog

> Cross-component upgrade backlog. One entry per upgrade. Priority: **P0** (blocks correct usage), **P1** (frequent need), **P2** (improvement), **P3** (polish).

---

## P0 — must fix soon

### UC-P0-01 — Remove `pi pi-ellipsis-v` from Stencil `<falcon-table>` row-action button

- **Motivation:** Wave PR-8 PrimeIcons removal program explicitly bans `pi pi-*` classes. The Shadow `<falcon-table>` `.tsx:655` still references this PrimeIcon. Direct violation.
- **Scope:** `falcon-table` (Stencil Shadow source).
- **Proposed change:** Replace `<i class="pi pi-ellipsis-v">` with `<i class="falcon-icon falcon-icon-ellipsis-v">`.
- **Risk:** Low — single source edit. Verify the Falcon icon font ships an `ellipsis-v` glyph.
- **Priority:** P0.

### UC-P0-02 — Keyboard activation for sortable column headers

- **Motivation:** Sortable headers respond to click only. A11y/WCAG compliance requires keyboard activation for any element that triggers an action.
- **Scope:** `falcon-table` (both Shadow + Light Stencil renderers).
- **Proposed change:** Add `tabindex="0"` and `@keydown.enter` / `@keydown.space` → `headerClickHandler(col)(ev)` on sortable `<th>`.
- **Risk:** Low — additive a11y feature.
- **Priority:** P0.

---

## P1 — high-impact reusable upgrades

### UC-P1-01 — Strategy E projection for `<falcon-angular-tree-table>`

- **Motivation:** Tree-table currently requires per-row Stencil slots (`cell-{key}-{nodeId}`) — `O(rows × cols)` markup. Adopting the `<falcon-angular-data-table>` Strategy E pattern would expose `[falconTreeTableCell]`, `[falconTreeTableHeaderCell]`, `[falconTreeTableEmpty]`, `[falconTreeTableLoading]` directives.
- **Scope:** `falcon-tree-table` Stencil Light variant + Angular wrapper.
- **Proposed API:**

```ts
// New directives mirror falcon-data-table:
@Directive({ selector: '[falconTreeTableCell]', standalone: true })
class FalconTreeTableCellDirective { @Input('falconTreeTableCell') field!: string; readonly template = inject(TemplateRef); }
// Plus mount-point emission in <falcon-tree-table-tw> when `hostsExternalCells=true`.
```

- **Risk:** Medium — touches both Stencil and Angular code. Strategy E pattern proven in data-table.
- **Priority:** P1.

### UC-P1-02 — `(multiSortChange)` output on `<falcon-angular-data-table>`

- **Motivation:** Stencil core emits `falcon-multi-sort` but the wrapper forwards only single-mode `(sortChange)`. Multi-sort mode is non-functional from a consumer's view.
- **Scope:** `falcon-data-table` Angular wrapper.
- **Proposed API:** `@Output() readonly multiSortChange = new EventEmitter<{ field: string; order: 1|-1 }[]>();`. Subscribe to `falcon-multi-sort` event in `attachHandlers`.
- **Risk:** Low — additive.
- **Priority:** P1.

### UC-P1-03 — `<falcon-angular-paginator>` PR-3 API parity

- **Motivation:** Stencil core has PR-3 inputs (`totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport`) but the Angular wrapper does not expose them. Standalone Angular consumers can't drive rows-per-page or current-page report.
- **Scope:** `falcon-paginator` Angular wrapper.
- **Proposed change:** Add the six missing `@Input`s + `(rowsChange)` output. Wire to Stencil props via attribute bindings or `el.<prop> = …` assignment.
- **Risk:** Low — additive.
- **Priority:** P1.

### UC-P1-04 — Grid keyboard navigation on `<falcon-table>` rows

- **Motivation:** `role="grid"` implies WAI-ARIA grid keyboard pattern. Today only TAB walks rows; no Arrow/Home/End nav.
- **Scope:** `falcon-table` (both Stencil renderers).
- **Proposed change:** Behind a default-on `[keyboardNav]` flag (so legacy can opt-out), implement Arrow Up/Down/Left/Right + Home/End/PageUp/PageDown row navigation.
- **Risk:** Medium — careful keyboard handler design; testing across screen readers.
- **Priority:** P1.

### UC-P1-05 — `<falcon-organization-hierarchy-tree>` Shadow companion + Angular wrapper

- **Motivation:** The only Falcon component shipped Light-DOM only + no Angular wrapper. Production adoption is blocked by missing library standards.
- **Scope:** `falcon-organization-hierarchy-tree-tw` — add a paired Shadow DOM tag + standard `FalconAngularOrganizationHierarchyTreeComponent` wrapper.
- **Proposed change:** Two new component files (`falcon-organization-hierarchy-tree.tsx` Shadow + `falcon-angular-organization-hierarchy-tree.component.ts` Angular).
- **Risk:** Medium — chrome involves SVG rails + sticky menu button + ctx menu positioning. Shadow encapsulation may interact with the brand-bubble CSS.
- **Priority:** P1.

### UC-P1-06 — Specs for Strategy E orchestrator

- **Motivation:** `<falcon-angular-data-table>` Strategy E projection is non-trivial (`onCellsMounted` + `mountOrReuseView` + view GC). No regression tests today.
- **Scope:** `falcon-data-table.component.ts`.
- **Proposed:** Vitest specs covering: mount, reuse on re-render, GC of orphaned views, empty/loading view lifecycle.
- **Risk:** Low — test-only.
- **Priority:** P1.

### UC-P1-07 — Specs for Stencil tables + paginator utils

- **Motivation:** Sort/filter/lazy logic in `falcon-table` + `clampPage` / `interpolatePageReport` / `buildPaginationItems` utils in `falcon-paginator` are non-trivial pure functions. No tests.
- **Scope:** `falcon-table`, `falcon-paginator`, `falcon-tree-table` (utils).
- **Proposed:** Vitest specs for each utility + Stencil integration tests for the renderer paths.
- **Risk:** Low — test-only.
- **Priority:** P1.

### UC-P1-08 — `<falcon-angular-filter-panel>` Falcon-atom migration + custom field

- **Motivation:** Native `<input>` / `<select>` / `<input type="date">` look different from `<falcon-angular-input>` / `<falcon-angular-dropdown>` / `<falcon-angular-date-picker>`. Visual inconsistency on filter strips.
- **Scope:** `falcon-filter-panel` Stencil renderers.
- **Proposed:** Replace native atoms with Falcon Stencil tags. Add `'custom'` field type with named-slot or projected template support.
- **Risk:** Medium — Stencil-tag-inside-Stencil-tag composition has edge cases (focus management, attribute reflection).
- **Priority:** P1.

### UC-P1-09 — Refactor admin / management consoles to compose `<falcon-angular-status-badge>`

- **Motivation:** Admin-console org-hierarchy page inlines its own `bg-falcon-{color}-50 text-falcon-{color}-700` Tailwind classes for status chips (`organization-hierarchy-menu.component.html:162-195`). Same for management-console parallel page. Divergent palette risk.
- **Scope:** `apps/admin-console/.../organization-hierarchy/components/organization-hierarchy-menu.component.html` + management-console parallel.
- **Proposed change:** Replace inline status chips with `<falcon-angular-status-badge [severity]="value">`.
- **Risk:** Low — visual parity via tokens. Verify each severity maps to the right bucket.
- **Priority:** P1.

---

## P2 — improvements

### UC-P2-01 — Typed cell column types (`'status'`, `'tag'`, `'avatar'`)

- **Motivation:** Removes per-page `<ng-template falconDataTableCell>` boilerplate for common cell shapes. Today consumers must repeat the same Falcon-component compose inside every table.
- **Scope:** `FalconTableColumnType` (+ parallel `FalconTreeColumnType`).
- **Proposed API:**

```ts
type FalconTableColumnType = 'text' | 'number' | 'badge' | 'currency' | 'date' | 'icon' | 'custom'
                            | 'status' | 'tag' | 'avatar';

interface FalconTableColumnExt {
  // … existing …
  /** When type === 'status' | 'tag' | 'avatar', the renderer auto-composes the right Falcon component. */
  readonly statusAccessor?: (row: Record<string, unknown>) => FalconStatusBadgeSeverity;
  readonly tagAccessor?: (row: Record<string, unknown>) => { value: string; severity: FalconTagSeverity }[];
  readonly avatarAccessor?: (row: Record<string, unknown>) => { src?: string; name?: string };
}
```

- **Scope:** `falcon-table` Stencil renderers + types.
- **Risk:** Medium — adds rendering coupling. Stencil composing Stencil. Pattern works elsewhere.
- **Priority:** P2.

### UC-P2-02 — Default `<falcon-empty-state>` composition inside `<falcon-table>` empty cell

- **Motivation:** Consumers must project `<ng-template falconDataTableEmpty>` per table for any non-text empty state. A built-in shorthand reduces boilerplate.
- **Scope:** `falcon-table` core + `falcon-data-table` wrapper.
- **Proposed API:** `[emptyState]="{ iconName, titleKey, descriptionKey, actionLabelKey }"` on `<falcon-angular-data-table>`.
- **Risk:** Low.
- **Priority:** P2.

### UC-P2-03 — `<falcon-angular-data-table>` `[density]` input

- **Motivation:** Stencil core supports `density: 'compact' | 'comfortable' | 'spacious'` — wrapper doesn't expose it.
- **Scope:** `falcon-data-table` Angular wrapper.
- **Risk:** Low — additive.
- **Priority:** P2.

### UC-P2-04 — Implement or remove `[reorderableColumns]` / `[resizableColumns]` placeholders

- **Motivation:** Inputs exist but do nothing. API surface confusion.
- **Scope:** `falcon-data-table` Angular wrapper.
- **Proposed change:** Either implement column reordering + resizing (CDK drag-drop + mouse-move handlers) OR remove the inputs with a deprecation note.
- **Risk:** High (if implementing) — column ordering interacts with Stencil's render path. Medium (if removing) — breaks consumers who set them.
- **Priority:** P2.

### UC-P2-05 — Wrapper `[ariaLabel]` parity sweep

- **Motivation:** Stencil cores expose `ariaLabel` for dot-only / presentational badges. Angular wrappers don't surface it consistently.
- **Scope:** `falcon-angular-status-badge`, `falcon-angular-badge`, `falcon-angular-empty-state`, `falcon-angular-tag`.
- **Proposed change:** Add `[ariaLabel]` input to each wrapper, forward to `[attr.aria-label]` on the inner Stencil tag.
- **Risk:** Low — additive.
- **Priority:** P2.

### UC-P2-06 — Multi-select for `<falcon-angular-tree-table>`

- **Motivation:** Today only `'none'` and `'radio'` modes. Multi-select bulk actions on tree-shaped data isn't supported.
- **Scope:** `falcon-tree-table`.
- **Proposed API:** `selectionMode='multiple'` + per-row checkbox cells.
- **Risk:** Medium — selection semantics on a tree (cascade vs independent) need to be decided.
- **Priority:** P2.

### UC-P2-07 — Frozen + sticky-actions precedence documentation

- **Motivation:** Both compete for inline-end position. No documented winner.
- **Scope:** `falcon-table` types + docs.
- **Proposed:** Either document `stickyActions` wins (current behaviour observed) or implement explicit precedence.
- **Risk:** Low.
- **Priority:** P2.

### UC-P2-08 — Brand registry tokens for `<falcon-organization-hierarchy-tree>`

- **Motivation:** Brand bubble styling uses `client-logo bank-{x}` CSS classes that depend on consumer CSS. Move into a typed token registry.
- **Scope:** `falcon-organization-hierarchy-tree-tw` + tokens.
- **Proposed:** `--falcon-org-hierarchy-brand-{name}-bg` / `-fg` / `-icon-url` tokens. `node.brand: keyof FalconBrandRegistry` typed enum.
- **Risk:** Medium — adds extension surface for brands.
- **Priority:** P2.

### UC-P2-09 — Remove dead-code `classes` computed from `<falcon-angular-tag>`

- **Motivation:** Wrapper has unused `classes` computed signal (lines 62-71) + `_sizeClasses` / `_severityClasses` helpers. Dead code from Wave 9.E refactor.
- **Scope:** `falcon-tag` Angular wrapper.
- **Risk:** Low — verified unused in template.
- **Priority:** P2.

### UC-P2-10 — Strategy E for `<falcon-table>` global filter

- **Motivation:** Built-in `<input type="search">` cannot be replaced with `<falcon-angular-search-input>` for visual consistency.
- **Scope:** `falcon-table` Light + `falcon-data-table`.
- **Proposed:** `<ng-template falconDataTableGlobalFilter>` directive that projects a custom filter UI.
- **Risk:** Low — additive.
- **Priority:** P2.

---

## P3 — polish

### UC-P3-01 — i18n strings (`'Search…'`, `'No records to display.'`, `'Pagination'`, `'Remove'`)

- **Motivation:** Hardcoded English strings in Stencil cores leak into RTL/Arabic UIs.
- **Scope:** `falcon-table`, `falcon-paginator`, `falcon-tag` (dismiss aria-label).
- **Proposed:** Add `[searchPlaceholder]`, `[searchAriaLabel]`, `[paginationAriaLabel]`, `[dismissAriaLabel]` props.
- **Priority:** P3.

### UC-P3-02 — Dark-mode bucket overrides per component-token file

- **Motivation:** Loading overlay `rgba(255,255,255,0.7)` is hardcoded — visible regression on dark canvas. Other tokens cascade from master `app-dark` block.
- **Scope:** All 10 component-token files in `libs/falcon-ui-tokens/src/components/`.
- **Proposed:** Add `:where(.app-dark, .app-dark *)` blocks per component file.
- **Priority:** P3.

### UC-P3-03 — Remove `'warn'` legacy alias from `FalconTagSeverity`

- **Motivation:** API simplification.
- **Scope:** `falcon-tag` types.
- **Risk:** Medium — breaks consumers still passing `'warn'`.
- **Priority:** P3.

### UC-P3-04 — Multi-sort "remove from sort list" affordance

- **Motivation:** Today you can't explicitly remove a column from the multi-sort priority chain — only flip its direction twice.
- **Scope:** `falcon-table`.
- **Proposed:** Shift+Alt-click to remove.
- **Priority:** P3.

### UC-P3-05 — Visual-comparison docs for sibling badges

- **Motivation:** `<falcon-badge>`, `<falcon-status-badge>`, `<falcon-tag>` have overlapping visual identities. A comparison table would help consumers pick the right one.
- **Scope:** Documentation (Agent 7 territory).
- **Priority:** P3.

### UC-P3-06 — Single source for `FalconStatusBadgeSeverity` type

- **Motivation:** Wrapper file re-declares the type instead of importing from `falcon-status-badge.types.ts`.
- **Scope:** `falcon-status-badge` Angular wrapper.
- **Priority:** P3.

---

## Summary by priority

| Priority | Count |
|---|---|
| P0 | 2 |
| P1 | 9 |
| P2 | 10 |
| P3 | 6 |
| **Total** | **27** |
