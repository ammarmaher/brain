# falcon-tree-table — GAPS & UPGRADES

## Missing capabilities

### Custom cell rendering

- **Per-row Stencil slot is the only custom-cell mechanism.** `<falcon-tree-table-tw>` renders `<slot name="cell-{column.key}-{nodeId}">` only when `column.type='custom'`. Consumer must provide a slotted child PER row PER column — `O(rows × columns)` markup. **P1 — adopt the Strategy E projection pattern from `<falcon-data-table>`** so consumers can write `<ng-template falconTreeTableCell="actions" let-node>` ONCE and it applies to every row.
- **Angular wrapper does NOT project templates.** Even with Stencil slots, Angular consumers can't easily put `<falcon-angular-button>` per row.

### Selection model

- **No multi-select.** Only `'none'` and `'radio'`. Wallet hierarchy with multi-select bulk actions isn't supported. **P2 — add `'multiple'` with per-row checkbox cells.**
- **No expand-on-select.** When a row is selected, its parents do NOT auto-expand. **P2 — option `[expandOnSelect]="true"` would help when selectedValue is set externally.**

### Column types

- `'badge'` column type is generic — bg+fg per `badgeVariant` (`'active' | 'inactive'`). Does NOT compose `<falcon-tag>` or `<falcon-status-badge>` despite those being in the library. **P2 — promote to `'tag'` / `'status'` column types.**
- No `'currency'` or `'date'` formatter (the flat `<falcon-table>` has these but tree-table omits them). **P2.**
- No `'avatar'` column.

### Pagination

- No pagination at all. Tree of 10,000 nodes renders flat in DOM after expansion. **P2 — add a virtual-scroll mode (CDK virtual-for) or paginate per-level.**

### Lazy expand

- No lazy-load hint. Compare with `<falcon-organization-hierarchy-tree-tw>` which has `hasChildren` for lazy load. The tree-table has no equivalent. **P2 — add `node.hasChildren` semantics + `(falcon-lazy-load)` event when expanding a node with `hasChildren=true` and no `children` array yet.**

### Action menus

- **No row-action `⋮` menu.** Consumers needing per-row actions must build a `'custom'` column slotting in Falcon buttons or a `<falcon-angular-menu>` manually. **P2 — first-class `rowActions: FalconDataTableRowMenuAction<FalconTreeNode>[]` input mirroring `<falcon-data-table>`.**

### Reactivity

- `selectedValue` `@Watch` is a no-op (`falcon-tree-table.tsx:118-121`). Render reads selection directly each time. Fine semantically, but a debug log on selection changes could help.

### A11y gaps

- Header cells have `role="columnheader"` but NO `aria-sort` (no sort feature at all). **No gap — but document that the tree-table does NOT support sorting.**
- Tree-grid keyboard nav is implemented well, but the radio cell on `selectionMode='radio'` has its own `<falcon-radio>` — duplicated TAB stop with the label cell. **P3 — explicit `tabindex="-1"` on the radio when the label cell is `tabIndex={0}`.**

### Tests

- **No `.spec.ts` for the tree-table** — utils (`flattenTree`, `findFirstChildId`, `findParentId`) are non-trivial pure functions that scream for unit tests. **P1.**

### Tailwind / token parity

- Shadow + Light variants share token contract.
- No dark-mode override block in `tree-table.tokens.css`.

## Reusable upgrades needed

| ID | Title | Priority | Recommended API |
|---|---|---|---|
| FTT-01 | Strategy E projection in Angular wrapper | **P1** | Adopt the `<falcon-data-table>` pattern: `[falconTreeTableCell="field"]`, `[falconTreeTableHeaderCell="field"]`, `[falconTreeTableEmpty]`, `[falconTreeTableLoading]` |
| FTT-02 | Multi-select | **P2** | `selectionMode='multiple'` + checkbox cells |
| FTT-03 | Status / tag / currency / date / avatar column types | **P2** | Add to `FalconTreeColumnType` and compose Falcon primitives |
| FTT-04 | Lazy expand hint | **P2** | `node.hasChildren` + `(falcon-lazy-load)` event |
| FTT-05 | Pagination / virtual scroll | **P2** | CDK virtual-for OR per-level pagination |
| FTT-06 | Row actions | **P2** | `rowActions` input + `<falcon-angular-menu>` integration |
| FTT-07 | Utils unit tests | **P1** | Vitest specs for `flattenTree`, `findFirstChildId`, `findParentId`, `hasRadioColumn`, `buildGridTemplate` |
| FTT-08 | Sort feature | **P3** | Per-column `sortable` + `aria-sort` |

## Workarounds available

- **Custom cells:** for Angular consumers, build the per-row slot markup explicitly:

```html
<falcon-tree-table-tw [columns]="cols" [nodes]="tree">
  @for (row of flattenTree(tree); track row.node.id) {
    <my-custom-cell [slot]="'cell-actions-' + row.node.id" [row]="row"></my-custom-cell>
  }
</falcon-tree-table-tw>
```

But this duplicates flattening logic — better to upgrade to Strategy E.

- **Multi-select:** add a `'custom'` column with a `<falcon-angular-checkbox>` per row. Consumer maintains the set.
- **Row actions:** add a `'custom'` column with `<falcon-angular-menu>` per row.
- **Sort:** sort the `nodes` array externally (in the consumer service).

## Visual / interaction risks

- The grid template is computed inline (`style={{ gridTemplateColumns: gridTemplate }}`). If the consumer overrides via CSS specificity, the inline style wins (acceptable design).
- Hover-path repaint paints the rail SVG bg-gradient — verify no flicker on rapid mouse movement (`onMouseEnter` setting `hoverPath` triggers re-render).

## Fix in shared component vs per-page

All gaps belong in the shared component.

## Future-proof recommendation

Adopt the Strategy E projection pattern from `<falcon-data-table>`. The tree-table is structurally similar (rows × columns → mount-points). Reusing the pattern would make `<falcon-angular-tree-table>` as powerful as `<falcon-angular-data-table>` for tree data.

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** ([CODE] grep `<falcon-angular-tree-table>` across `apps/` + `libs/falcon/`). See `USAGE.md` for the file list.

No new structural gaps detected by Wave 7 sweep beyond items already listed above.

## Deep-Dive Sweep Findings (2026-06-03 — B08)

**Consumer count: 0 production render-sites** ([CODE] grep — only Tailwind safelist comments, wallet code-comments, showcase tile, docs MD). The component stays ACTIVE / showcase-only.

Findings vs prior dossier (all gaps re-confirmed; component otherwise unchanged):
- **Consumer reality corrected** — prior dossier listed `playground.page.html` (gone, route removed) + wallet as a near-consumer. The wallet only *references* the tree-table in comments and builds its own grid. Net: NO production render-site. Corrected in OVERVIEW/USAGE.
- **No spec exists** (FTT-07) — re-confirmed `[CODE]` grep: zero `*tree-table*.spec.ts` for the Stencil tags, the wrapper, OR the non-trivial pure-fn `falcon-tree-table.utils.ts` (`flattenTree`/`findParentId`/`findFirstChildId`/`hasRadioColumn`/`buildGridTemplate`). The single highest-value, lowest-risk upgrade.
- **No Strategy E in the Angular wrapper** (FTT-01) — re-confirmed: the wrapper (128 ln) has no `TemplateRef`/`ContentChild`/`falconTreeTableCell` directive; custom cells use only the Stencil per-row named slot `cell-{key}-{id}` (tsx:630). Contrast `falcon-data-table` which DID adopt Strategy E.
- API itself is accurate (no drift) — inputs/outputs/`@Method`s/keyboard-nav all verified live.
- All findings `safe-local` (doc + missing-test). No deletion/promotion flag. See FINDINGS/B08.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B08) against falcon-tree-table-tw.tsx (668 ln) + falcon-tree-table.component.ts (128 ln) + .utils.ts (199 ln). All gaps (FTT-01 no Strategy E, FTT-07 no specs, no multi-select/sort/pagination, dead `@Watch`) re-confirmed open; API verified accurate (no drift); consumers corrected to 0 production render-sites. Component stays ACTIVE / showcase-only. 0 HIGH-RISK.
