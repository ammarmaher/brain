# falcon-angular-tree — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
`falcon-angular-tree` is **presentational — it owns no data and binds to no endpoint.** The `nodes` forest it renders is business reference data owned elsewhere:
- **Commerce** — the organization-node hierarchy (the canonical hierarchical data). Note the org-hierarchy page consumes `<falcon-tree-panel>`, not this component — but the tree *shape* originates from Commerce node data either way.
- Any module that exposes a hierarchical catalog (categories, classification trees) supplies the `nodes` for a category-tree use.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| `nodes` forest | bound as an element *property* via the Angular wrapper's `syncProps` | the module owning the hierarchy (Commerce for org nodes) | The full forest must be in memory — no lazy children loader exists (`GAPS_AND_UPGRADES.md` item 5) |
| `selectedValue` | CVA two-way (`[(ngModel)]` / `formControlName`) into the parent form/state | (the flow's owning module) | the tree emits the selected id only; the consumer decides what it means |
| `expandedIds` | signal-bound input, kept in sync via `(expandChange)` | n/a — pure view state | not persisted by the component |

The tree NEVER calls an endpoint. The consumer fetches the hierarchy, maps it to `FalconTreeNode[]`, and binds it.

## Validation rules (V-*)
`falcon-angular-tree` runs **no validation rules** — selecting a node is a pick, not a form-field commit. The contracts it does enforce:
- `[CODE]` falcon-tree.types.ts — `FalconTreeNode` requires `id` + `label`; `id` must be unique across the whole forest (selection, focus, scroll-to-id and hover-path all key on it). A duplicate id silently mis-targets.
- `[USAGE]` — passing a **cyclic tree** (a node referencing an ancestor) causes infinite recursion in `flattenTree`. The consumer must guarantee an acyclic forest.
- When used with Reactive Forms in single mode, standard `Validators.required` on the bound `FormControl` validates "a node was chosen" — but that gate lives on the *control*, not the tree.

## PES keys gating this component
The tree has **no PES key of its own.** Permission gating is expressed through the data:
- `[CODE]` falcon-tree-tw.tsx:494 — a node the user may not select is marked `node.disabled=true` by the consumer (resolving the PES decision upstream); the tree then refuses selection on that row.
- `disabled` (whole-tree input) renders the entire tree non-interactive — used when the parent step is itself PES-denied.

## State / signal pattern
`[BRAIN-OUT]` + `[CODE]` — `nodes` is bound from a consumer signal/computed; `selectedValue` flows through CVA; `expandedIds` is a consumer-owned signal updated from `(expandChange)`. Internally the Stencil component holds `focusedId` and `hoverPath` as `@State`, plus a private `justClickedId` flag (`[CODE]` falcon-tree-tw.tsx:154) that suppresses the redundant smooth-scroll when the user clicked the node themselves (vs a programmatic select). `@Watch('selectedValue')` (`[CODE]` :177-192) scrolls a programmatically-selected node into view via `requestAnimationFrame`.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-tree>` (Shadow) / `<falcon-tree-tw>` (Light, default render path). Pure presentational; recursive flatten + hover-path `Set<id>` + keyboard nav + ARIA all live here.
- **Angular wrapper** — `<falcon-angular-tree>`: provides `NG_VALUE_ACCESSOR` (single-mode CVA), delegates the 5 programmatic methods (`selectAndScrollTo`, `expandTo`, `expandAll`, `collapseAll`, `focusNode`) to the Stencil `@Method`s, reflects object props onto the element.
- Per `feedback_library_skeleton_app_api` — the hierarchy is fetched by the app/state layer, never inside the library component.
- **Parallel implementation warning** — `<falcon-tree-panel>` does NOT wrap `<falcon-angular-tree>`; it renders its own `<falcon-tree-node>` recursive component. The org-hierarchy integration (endpoints, state slices) lives in the `falcon-tree-panel` consumer, not here.

## Integration gotchas
- **No lazy load** — binding a partial forest then expecting children to fetch on expand does not work. Fetch the whole hierarchy or use a different component.
- **No virtualization** — `flattenTree` produces a DOM row per visible node; 1000+ nodes is a performance cliff (`GAPS_AND_UPGRADES.md` item 4).
- `selectedValue` is reflected as a DOM attribute (`@Prop({ reflect: true })`); object inputs (`nodes`, `selectedValues`, `expandedIds`) are *not* — they must be set as element properties (the wrapper's `syncProps` handles this).
- Multi-mode is NOT a CVA — `[selectedValues]` + `(valuesChange)` must be wired manually.
- `[CODE]` falcon-tree-tw.tsx:184 — programmatic scroll is `requestAnimationFrame`-deferred; the caller cannot `await` its completion.
- Do not mutate `nodes` in place — pass a fresh array so change detection fires.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B09) from `[CODE]` falcon-tree-tw.tsx + falcon-tree.types.ts + the 6 UI-layer dossiers. **No production consumer of `<falcon-angular-tree>` at all** (B09 sweep — playground folder removed) — endpoint wiring is 🟡 inferred from the intended pattern; the parallel `<falcon-tree-panel>` carries the live org-hierarchy integration.
