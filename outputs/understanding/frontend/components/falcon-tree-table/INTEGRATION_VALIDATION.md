# falcon-tree-table — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
`falcon-tree-table` is **presentational — it owns no data and binds to no endpoint.** Its archetypal data source:
- **Charging** — wallet / account-balance hierarchy. The account tree, per-account balance and committed figures are Charging-service domain data (`[MEMORY]` Ammar Core-Charging owns wallet operations, balance, ledger).
- Any module exposing a uniform-column hierarchy could supply the `nodes` + `columns`.

No production page consumes the component yet, so no live endpoint is wired — the wiring below is the intended pattern.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| `nodes` forest (with per-column data on each node) | bound as element property via the Angular wrapper | Charging (wallet hierarchy) | `FalconTreeNode` has an index signature `[columnKey: string]: unknown` (`[CODE]` falcon-tree-table.types.ts:76) — per-column values live directly on the node object |
| `columns` descriptors | element property | n/a — view config | `FalconTreeColumn`: `key`, `label`, `type`, `width`, `align`, `badgeVariant` |
| `selectedValue` | CVA two-way (`[(selectedValue)]` / `[(ngModel)]` / `formControlName`) | (the flow's owning module) | emits selected node id only |
| `expandedIds` | signal-bound input, kept in sync via `(expandChange)` | n/a — view state | not persisted by the component |

The tree-table NEVER calls an endpoint. The consumer fetches the wallet hierarchy, maps each account to a `FalconTreeNode` with its column values, and binds.

## Validation rules (V-*)
`falcon-tree-table` runs **no validation rules** — selecting an account is a pick, not a form commit. Contracts it enforces:
- `[CODE]` falcon-tree-table.types.ts:70-77 — `FalconTreeNode` requires `id` + `label`; `id` must be unique across the whole tree (selection, focus, scroll-to all key on it).
- `[CODE]` falcon-tree-table-tw.tsx:598 — `grid-template-columns` is computed per render by `buildGridTemplate(columns, selectionMode, explicitRadio)`. Column count / widths are a structural contract — overriding via CSS loses to the inline style.
- With Reactive Forms, `Validators.required` on the bound control validates "an account was chosen" — that gate is on the control, not the tree-table.

## PES keys gating this component
The tree-table has **no PES key of its own.** Permission gating is expressed through the data:
- A non-actionable account is marked `node.disabled=true` by the consumer (resolving the PES decision upstream); the tree-table then refuses radio selection on that row.
- `disabled` (whole-component input) renders the entire grid non-interactive.

## State / signal pattern
`[CODE]` + `[BRAIN-OUT]` — `nodes` and `columns` bound from consumer signals; `selectedValue` flows through `NG_VALUE_ACCESSOR` CVA; `expandedIds` is a consumer-owned signal updated from `(expandChange)`. Internally the Stencil component holds expand/hover/focus as `@State`. `[GAPS]` — the `selectedValue` `@Watch` is a no-op (`falcon-tree-table.tsx:118-121`); render reads selection directly each cycle.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-tree-table>` (Shadow) / `<falcon-tree-table-tw>` (Light, default render path). Pure presentational; recursive flatten, grid-template builder, keyboard treegrid nav, hover-path rail repaint all live here.
- **Angular wrapper** — `<falcon-angular-tree-table>`: provides `NG_VALUE_ACCESSOR` CVA for `[(selectedValue)]`, delegates `select` / `expand` / `collapse` `@Method`s, reflects object props.
- **No Strategy E projection.** `[CODE]`-verified — the Angular wrapper directory has no `ContentChild` / `TemplateRef` / `falconTreeTableCell` directive. Custom cells use only the Stencil per-row named slot (see gotchas). FTT-01 proposes adopting the `<falcon-data-table>` Strategy E pattern.
- Per `feedback_library_skeleton_app_api` — the wallet hierarchy is fetched by the app/state layer, never inside the library component.

## Integration gotchas
- `[CODE]` falcon-tree-table-tw.tsx:590 — **custom cells use a per-row named slot**: `<slot name="cell-{columnKey}-{nodeId}">`, rendered only when `column.type='custom'`. The consumer must provide one slotted child PER row PER custom column — `O(rows × columns)` markup. This works on the raw Stencil tag but NOT through the Angular wrapper's standard `<ng-template>` pattern.
- The slot naming scheme (`cell-{columnKey}-{nodeId}`) is a private contract the Stencil render reads literally — renaming breaks every slotted consumer.
- **No lazy expand** — no `node.hasChildren` hint, no `falcon-lazy-load` event. The whole tree must be in memory (FTT-04 gap).
- **No pagination / virtual scroll** — large trees render flat after expansion (FTT-05 gap).
- A `'radio'` column with the same `radioName` across two instances collides on the DOM — the wrapper defaults to a generated id; override only with a guaranteed-unique name.
- Object inputs (`nodes`, `columns`, `expandedIds`) must be element properties, not `[attr.x]` — the wrapper handles this.

## Verification
🟡 CODE-DERIVED, RE-VERIFIED 2026-06-03 (B08) from `[CODE]` falcon-tree-table-tw.tsx (668 ln) + falcon-tree-table.types.ts + the UI-layer dossiers + the wrapper (128 ln). "No Strategy E projection in the Angular wrapper" ✅ RE-VERIFIED (the wrapper has no `TemplateRef`/`ContentChild`/`falconTreeTableCell` directive; custom cells use only the Stencil per-row slot `cell-{key}-{id}` at tsx:630). No production consumer — endpoint wiring is 🟡 inferred from the intended wallet-hierarchy pattern.
