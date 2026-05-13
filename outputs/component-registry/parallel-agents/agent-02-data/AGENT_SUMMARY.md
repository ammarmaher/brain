# Agent 2 — Data / Table / Status Components — SUMMARY

## What I investigated

The 10 in-scope components for Agent 2:

1. **`falcon-table`** — Stencil core (685 LOC + 810 LOC Light variant) — the table rendering substrate.
2. **`falcon-data-table`** — Angular wrapper (672 LOC + projection orchestrator) — the canonical Angular data-table; replaced PrimeNG p-table in Wave PR-7.
3. **`falcon-tree-table`** — CSS Grid recursive expandable table (597 LOC).
4. **`falcon-paginator`** — Numeric pagination strip with optional first/last + jump + rows-per-page.
5. **`falcon-filter-panel`** — Horizontal row of typed filter inputs (text/select/date/daterange).
6. **`falcon-status-badge`** — Workflow-state pill (9 severities → 4 buckets).
7. **`falcon-badge`** — Generic semantic indicator (6 variants × 3 appearances × 3 sizes).
8. **`falcon-tag`** — Chip/tag with optional icon and dismiss action (7 severities).
9. **`falcon-empty-state`** — Icon + title + description + action slot for empty/zero states.
10. **`falcon-organization-hierarchy-tree-tw`** — Bespoke org-hierarchy panel (Light DOM only — no Shadow companion, no Angular wrapper).

Cross-link only (not in my scope): `falcon-tree`, `falcon-tree-panel` (Agent 4).

## Totals

- **10 components investigated.**
- **10 component folders created** under `agent-02-data/components/`.
- **60 markdown files written** (10 × 6 mandatory files: OVERVIEW / API / USAGE / GAPS_AND_UPGRADES / TOKENS / DECISION).
- **3 agent-root files** in `agent-02-data/` (this file + COMPONENT_COVERAGE.md + UPGRADE_CANDIDATES.md).

## Hotspots

### `falcon-table` core (Stencil 685 LOC + Light 810 LOC)

- Most complex component in the roster. 14 token categories, ARIA `role="grid"`, PR-3 lazy mode, frozen columns, sticky actions, scrollable, multi-sort, global filter, Strategy E projection mount-points.
- **Critical gap:** row-action `⋮` button still uses `pi pi-ellipsis-v` (PrimeIcon — violates Wave PR-8 ban). **P0 fix.**
- **A11y gap:** no keyboard sort, no Arrow-key row nav. **P0/P1.**

### `falcon-data-table` Angular wrapper (672 LOC)

- The production-canonical Angular table. Heavy use across admin / management consoles.
- Strategy E projection orchestrator is non-trivial — subscribes to Stencil `falcon-cells-mounted` event and mounts `EmbeddedViewRef` root-nodes into Light-DOM cells. NO specs for this critical path.
- Three menu input shapes (legacy x2 + typed) — API surface confusion.
- `[reorderableColumns]` / `[resizableColumns]` are API placeholders without implementation.

### `falcon-organization-hierarchy-tree-tw`

- **Light DOM only.** No Shadow companion. No Angular wrapper. No verified production adoption (grep against admin/management consoles returned no hits).
- Most-incomplete component in the roster.

### Adoption gaps

- `<falcon-angular-status-badge>` / `<falcon-angular-badge>` / `<falcon-angular-tag>` / `<falcon-angular-empty-state>` — verified-zero direct consumer in `apps/`. Admin-console org-hierarchy page inlines its own status-chip Tailwind classes instead of composing `<falcon-angular-status-badge>`.

## Top 5 dynamic-capability findings

1. **Strategy E projection** in `<falcon-angular-data-table>` is the standout pattern. Stencil emits projection mount-points; Angular wraps with `EmbeddedViewRef`. This pattern should be adopted by `<falcon-angular-tree-table>` (FTT-01).

2. **Tokens are well-architected.** Every component has a per-component token file. The 9-severity → 4-visual-bucket mapping in `<falcon-status-badge>` is exemplary — semantic vocabulary on inputs, visual decisions in tokens.

3. **Wrappers are inconsistent in what they expose.** Sometimes the Stencil Method/Prop is exposed by the wrapper, sometimes not. Examples: `<falcon-angular-paginator>` lacks PR-3 inputs; `<falcon-angular-status-badge>` lacks `[ariaLabel]`. The wrappers need a parity sweep.

4. **Strategy E only powers `<falcon-angular-data-table>`** today. `<falcon-angular-tree-table>` consumers must use Stencil per-row named slots (`cell-{key}-{nodeId}`), which is `O(rows × cols)` markup. Tree-table needs Strategy E.

5. **The PrimeIcon row-action button** at `falcon-table.tsx:655` (`pi pi-ellipsis-v`) is a P0 — the Wave PR-8 PrimeIcons-removal program explicitly bans `pi pi-*` classes. Easy 5-minute fix.

## Top 5 reusable-upgrade ideas (cross-component)

1. **Strategy E projection for `<falcon-angular-tree-table>`** — adopt the `<falcon-angular-data-table>` pattern (`[falconTreeTableCell]`, `[falconTreeTableHeaderCell]`, `[falconTreeTableEmpty]`, `[falconTreeTableLoading]`). FTT-01.

2. **Typed cell column types** — extend `FalconTableColumnType` (and parallel `FalconTreeColumnType`) with `'status'` / `'tag'` / `'avatar'` types that auto-compose the matching Falcon Angular component. Removes per-page `<ng-template>` boilerplate for the common cases. FT-06, FSB-02, FTT-03.

3. **Default `<falcon-empty-state>` composition** inside table empty cells — accept a typed `[emptyState]="{ iconName, titleKey, descriptionKey, actionLabelKey }"` input on `<falcon-table>` core that auto-composes the primitive. Removes per-table `<ng-template falconDataTableEmpty>` boilerplate. FT-05, FDT-03, FES-01.

4. **Wrapper API parity sweep** — bring all Angular wrappers up to parity with their Stencil cores. `<falcon-angular-paginator>` needs PR-3 inputs (FP-01); `<falcon-angular-status-badge>` / `<falcon-angular-empty-state>` / `<falcon-angular-tag>` need `[ariaLabel]` (FSB-03, FES-05, FT-?); `<falcon-angular-data-table>` needs `[density]` + `(multiSortChange)` (FDT-01).

5. **Organization-hierarchy modernisation** — ship Shadow companion + Angular wrapper + brand registry tokens (FOHT-01, FOHT-02, FOHT-03). Currently this component is held back from production by missing library standards.

## Cross-cutting concerns

- **No `.spec.ts` files** found alongside any of the 10 components. Vitest specs for the Stencil cores + projection orchestrator + utils would catch regressions.
- **No dark-mode overrides** at component-token-file level for: `falcon-table`, `falcon-data-table`, `falcon-tag`, `falcon-badge`, `falcon-status-badge`, `falcon-empty-state`, `falcon-tree-table`, `falcon-paginator`, `falcon-filter-panel`, `falcon-organization-hierarchy-tree-tw`. Dark contrast relies on master-theme palette inversion. Loading-overlay tokens (`rgba(255,255,255,0.7)`) are hardcoded — visible regression on dark canvas.
- **The Wave PR-8 PrimeIcons-removal program** has one outstanding violation: `pi pi-ellipsis-v` in the Stencil Shadow `<falcon-table>` row-action button.
