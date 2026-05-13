# falcon-angular-tree — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) Parallel implementation in `<falcon-tree-panel>`
- **Gap:** `<falcon-tree-panel>` (legacy bespoke under `libs/falcon/src/shared-ui/`) renders its own `<falcon-tree-node>` recursive component — NOT `<falcon-angular-tree>`. Two separate code paths for the same visual contract.
- **Risk:** drift between the two implementations; hover-path / expand-collapse / focus mode may diverge.
- **Recommendation:** plan a Wave to refactor `<falcon-tree-panel>` to internally compose `<falcon-angular-tree>` plus the chrome + 3-dot menus. Or extract `<falcon-tree-panel>`'s chrome into a new `<falcon-angular-tree-shell>` and have it consume `<falcon-angular-tree>`.

### 2. (P0) No row template / per-node custom rendering
- **Gap:** the row structure is fixed (rails + chevron + multi-check + initials chip + icon + label + badge). No way to add custom decoration (e.g., a small status pill, a per-row 3-dot menu, an action button).
- **Recommendation:** add `<slot name="row-{id}">` per row OR an Angular `*falconTreeNode` directive that provides a TemplateRef per node.
- **Why this matters:** the org-hierarchy use case requires per-row 3-dot menus — which is exactly why `<falcon-tree-panel>` reinvented the whole thing.

### 3. (P0) No per-row action slot for 3-dot menu trigger
- **Gap:** related to above. Even without full row template, a fixed-position "action slot" at the row's trailing edge would cover the most common need.
- **Recommendation:** add `<slot name="actions-{id}">` rendered absolutely at row trailing edge with sticky positioning + `pointer-events: auto` when row hover.

### 4. (P1) No virtualization for large trees
- **Gap:** `flattenTree(visibleNodes, expandedIds)` produces an array of every visible row; `rows.map((_, idx) => renderRow(rows, idx, hoverSet))` renders all of them. For 1000+ nodes, this is O(n) DOM nodes.
- **Recommendation:** integrate with `@angular/cdk/scrolling` virtual-scroll viewport OR Stencil-native windowing.

### 5. (P1) No lazy children loader
- **Gap:** `nodes` is the full forest. No way to lazy-fetch children when a node is expanded.
- **Recommendation:** add `loadChildren?: (parentId) => Promise<FalconTreeNode[]>` Input. Display a spinner on the expanded parent while loading.

### 6. (P1) No drag-and-drop reordering
- **Gap:** users cannot drag a node to a new parent.
- **Recommendation:** add `enableDragDrop?: boolean` Input + `(falcon-drop)` Output with `(dragId, newParentId, newIndex)` payload.

### 7. (P1) No "select all descendants" affordance in multi mode
- **Gap:** when multi mode is enabled, clicking a parent toggles only that parent's inclusion. No way to ask "select me + all my children".
- **Recommendation:** add a `selectMode?: 'self-only' | 'cascading'` Input under multi mode.

### 8. (P2) Initials indicator is always shown
- **Gap:** every row shows a 2-letter initials chip. For deep file trees where every level is a node, this is visually heavy.
- **Recommendation:** add `showInitials?: boolean` Input.

### 9. (P2) `node.icon` AND initials chip both render
- **Gap:** when `node.icon` is set, the initials chip still renders alongside. Inconsistent.
- **Recommendation:** treat `node.icon` as a replacement for the initials chip.

### 10. (P2) Search is case-sensitive substring only
- **Gap:** `filterTreeBySearch()` (in utils) likely does a simple `label.toLowerCase().includes(query.toLowerCase())`. Audit to confirm.
- **Recommendation:** expose a `searchPredicate?: (node, query) => boolean` Input for custom matchers (fuzzy, regex, multi-field).

### 11. (P3) No "keyboard chord" shortcuts
- **Gap:** `*` (asterisk) commonly means "expand all" in tree UIs; not handled.
- **Recommendation:** add `*` → `expandAll()`.

### 12. (P3) `hoverPath` does NOT include the hovered node itself
- **Gap:** `buildAncestorPath()` returns only the ancestors. If a consumer wants the hovered node included, they must add it manually.
- **Recommendation:** document; or add `includeSelf?: boolean` option to the `(hoverChange)` event detail.

## Missing accessibility features
- **(P1) `aria-controls` not set on chevron** — fix by adding `aria-controls={subtreeId}`.
- **(P2) Multi-mode rows have `aria-selected` but no `role="checkbox"` semantics on the per-row check** — AT users may not realize each row is independently toggleable.
- **(P2) `aria-busy` not set during lazy-load (when item 5 lands).**

## Missing tests
- _None observed in active source._

## Missing Tailwind / token parity
- 14-category contract is documented in `tree.tokens.css`. Verify the Tailwind helper file references each.

## Performance risks
- **High:** for 1000+ nodes, the unvirtualized DOM is the bottleneck. See item 4.
- `flattenTree` is called every render. Could be memoized off `nodes` + `expandedIds` + `searchQuery`.

## Visual / interaction risks
- The hover-path Set is cleared on `mouseLeave` — if the user moves rapidly between rows, the hover-path may flicker between empty and full.
- The smooth-scroll on programmatic select is asynchronous via `requestAnimationFrame` — caller cannot await its completion.

## Reusable upgrade priority
- All items belong in shared component.

## Workaround availability
- For #1 (parallel implementations): the legacy `<falcon-tree-panel>` exists today; new code can use `<falcon-angular-tree>` directly + assemble chrome manually.
- For #2/#3 (row template): a consumer can wrap `<falcon-angular-tree>` and overlay a custom action layer absolutely positioned. Hacky.
- For #4 (virtualization): truncate the tree client-side and load more on scroll. Manual.
