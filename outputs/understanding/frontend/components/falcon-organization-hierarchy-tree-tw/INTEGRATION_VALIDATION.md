# falcon-organization-hierarchy-tree-tw — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
The component is **presentational** — it renders whatever `tree` it is handed and owns no endpoint. The hierarchy it would display is owned by:
- **Commerce** — the organization hierarchy (accounts, clients, sub-nodes) is a Commerce-owned aggregate. `[MEMORY]` `project_info_panel_backend_integration_wave15` + `project_commchannels_apps_tabs_phase1` — the org-hierarchy page calls `commerce/Node/...` via the System Gateway; the tree would be built from a Commerce node query.
- `[INFERRED]` **Identity** — users under a node are Identity-owned, but this component renders only the node tree, not the user list.

The component never issues HTTP. A consuming page's **state service** would own the fetch and assign the `tree` element property.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| organization hierarchy / node tree | `GET` | Commerce | node tree response → `FalconOrgHierarchyNode` | System Gateway (`useGateway()`) | `[INFERRED]` — no production consumer wires this today (see gotcha) |
| subtree on expand (lazy) | `GET` | Commerce | child nodes for a parent id | System Gateway | `[CODE]` `API.md` `falcon-toggle` is the lazy-load hook; the consumer fetches + reassigns `tree` |

`[CODE]` Verified 2026-06-03 — there are **ZERO live render consumers** (the prior playground + showcase consumers are gone). So **no backend wiring is exercised anywhere** — the table above is the intended contract, not an observed one. The live org-hierarchy tree (`<falcon-tree-panel>` via `<app-organization-hierarchy-tree>`) DOES wire Commerce: `[CODE]` organization-hierarchy-tree.component.ts injects `OrgHierarchyTreeApiService` (`getTree()` / `getChildren()`) — but that is a SEPARATE component, not this Stencil tree.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The component does **no field validation** — it is a navigation control. |

`[CODE]` There is no `validations/` for this component. Any V-rules belong to the wizard flows its `falcon-action` event would launch (Add Client / Add Node / Edit Node / Add User), each owning its own `validations/`.

## PES keys gating this component
The component has no PES key of its own. Action availability is consumer-resolved:
- `[CODE]` `API.md` **`FalconOrgHierarchyAction.disabled`** + per-node `node.disabled` — the consumer's state slice resolves these against `FalconAccess.*` before assigning `rootActions` / `nodeActions`.
- `[CODE]` `API.md` **`showExpand` / `showMoreActions`** — coarse panel-level gates.
- `[INFERRED]` The launched wizards carry their own PES gates (`[MEMORY]` `FalconAccess.adminConsole.*`); this component only surfaces the entry point.

## State / signal pattern
`[CODE]` `tsx:31-36` State is held in Stencil `@State` (Stencil's signal equivalent — re-render on write). The component is **controlled**:
- `[CODE]` `API.md` Inputs `tree`, `selectedId` (mutable, reflect), `expandedIds` (mutable), `rootActions`, `nodeActions` are `@Prop`s the consumer's page state owns.
- `[CODE]` `API.md` Events `falcon-select` / `falcon-toggle` / `falcon-action` push interaction up; the consumer mutates its own state.
- `[CODE]` `tsx:47-64` an internal `FlatRow[]` is derived by walking the visible tree (depth, path, posInSet, setSize, ancestor rails); `CtxMenuPos` holds the floating menu anchor.
- `[CODE]` `API.md` `@Method`s `selectAndScrollTo` / `expandAll` / `collapseAll` / `closeContextMenu` give an imperative surface.
- `[CODE]` `API.md` global `@Listen` handlers on `document` + `window` — `keydown` (Escape closes ctx-menu), `mousedown` (outside-click closes), `scroll` + `resize` (reposition the menu).
- Error pipeline: none — the component has no async surface of its own.

## Skeleton ↔ app-wrapper layering
This component is the Phase 1 brief's other named org-hierarchy renderer — and its layering is **incomplete**, which is its defining trait:
- **Stencil skeleton** — `<falcon-organization-hierarchy-tree-tw>` (`libs/falcon-ui-core/src/components/...`). `[CODE]` `OVERVIEW.md` — **Light DOM ONLY**. It is the UNIQUE component in the Falcon library with no Shadow-DOM companion (`<falcon-organization-hierarchy-tree>` does not exist — verified). Its Tailwind utilities are inline in the `.tsx`; a companion `<style>` block (`tsx:69+` `ORG_HIERARCHY_RAIL_STYLES`) scoped via `[data-fohtree-render="tailwind"]` expresses the rail SVG geometry Tailwind cannot.
- **Angular wrapper** — **NONE.** `[CODE]` `OVERVIEW.md` — there is no `<falcon-angular-organization-hierarchy-tree>`. Angular consumers use the raw Stencil tag directly and must set object props via `@ViewChild` + `ElementRef.nativeElement` property assignment in `ngAfterViewInit` (`[attr.x]` would stringify).
- **App layer** — would be a per-project thin wrapper the consuming page writes by hand (`GAPS_AND_UPGRADES.md` FOHT-02 recommends shipping a shared one).
- **Contrast with `<falcon-tree-panel>`** — the *production* org-hierarchy panel is the bespoke Angular `<falcon-tree-panel>` (a self-contained library component) wrapped by host-shell's `<app-organization-hierarchy-tree>`. This `-tw` component is a **separate, parallel Stencil implementation** — the library skeleton exists, the wrapper does not, and production has not adopted it. Per `feedback_library_skeleton_app_api` the missing wrapper is the blocker: there is no clean app-API layer to inject services through.

## Integration gotchas
- `[CODE]` `OVERVIEW.md` + `USAGE.md` — **object props stringify if bound as `[attr.x]`** — `tree`, `rootActions`, `nodeActions`, `expandedIds` must be set via `el.tree = …` etc. in `ngAfterViewInit`.
- `[CODE]` `OVERVIEW.md` — **no Shadow DOM = no style isolation** — global CSS that touches `[data-fohtree-render="tailwind"]` selectors WILL leak in/out. (The `client-logo bank-{x}` brand-class dependency is currently MOOT — `node.brand` is unused — but the leakage risk for the data-`fohtree`-* selectors stands.)
- `[CODE]` `USAGE.md` — `defineFalconTwComponent('falcon-organization-hierarchy-tree-tw')` must be awaited (e.g. in `ngOnInit`) before the tag upgrades.
- `[CODE]` the companion `<style>` block uses `!important` at 4 sites (`tsx` lines 156/158/165/166) to beat Tailwind utility specificity for the sticky menu button hover/open — a known specificity smell (`GAPS_AND_UPGRADES.md` FOHT-06).
- `[CODE]` `GAPS_AND_UPGRADES.md` — `position: sticky; inset-inline-end` for the ⋮ menu button reveal may not behave in all browsers inside `overflow:hidden` scroll parents — runtime-test Chrome/Safari/Firefox/Edge.
- `[INFERRED]` Because no Angular wrapper exists, there is no central place to inject the Commerce node query — every consuming project would re-implement the fetch + property-assignment boilerplate until FOHT-02 ships.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) from the full `falcon-organization-hierarchy-tree-tw.tsx` (1207 ln) + the live `<app-organization-hierarchy-tree>`/`<falcon-tree-panel>` source. **Light-DOM-only / no-Angular-wrapper / zero-live-render-consumers** ✅ VERIFIED. The live Commerce wiring lives in the SEPARATE `OrgHierarchyTreeApiService` behind `<app-organization-hierarchy-tree>`, not this tree. `!important` corrected to tsx:156/158/165/166. Backend wiring for THIS component remains `[INFERRED]` (it has no live consumer).
