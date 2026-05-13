# falcon-tree-panel (LEGACY BESPOKE) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) Parallel implementation to `<falcon-angular-tree>`
- The panel renders its OWN internal `<falcon-tree-node>` recursive component instead of composing `<falcon-angular-tree>`. Two parallel code paths for the same locked-spec contract.
- **Recommendation:** plan a Wave to:
  1. Extend `<falcon-angular-tree>` with per-row action slot + per-row template (see `falcon-tree/GAPS_AND_UPGRADES.md` items 2+3).
  2. Refactor `<falcon-tree-panel>` to compose `<falcon-angular-tree>` + chrome.
  3. Delete `<falcon-tree-node>`.
- **Risk:** mid-priority — the locked-spec visual is currently consistent across both implementations (both follow `admin/hierarchy.jsx`). But future updates to one may not propagate to the other.

### 2. (P0) Legacy SCSS files violate project rule
- Both `falcon-tree-panel.component.scss` and `falcon-tree-node/falcon-tree-node.component.scss` exist.
- **Recommendation:** delete during convergence with `<falcon-angular-tree>`. The new home for visuals is `tree.tokens.css` + Tailwind helper.

### 3. (P0) `ViewEncapsulation.None` is a leakage risk
- The component disables encapsulation so the menu overlay's `styleClass` selectors reach the rendered DOM. Every CSS rule MUST be prefixed.
- **Recommendation:** when the `<falcon-angular-menu>` component supports an `itemClass` or `itemTemplate` Input, switch to encapsulated.

### 4. (P1) No keyboard nav for the 3-dot trigger
- Tab moves into the row, then to the 3-dot button, then opens the menu. But there's no Enter/Space handler on the row to open the menu via keyboard (only mouse click). For AT users this is a blocker.
- **Recommendation:** add `(keydown.alt.f10)` listener that opens the per-row menu (Windows convention for "right-click menu via keyboard").

### 5. (P1) No "action disabled" state
- `FalconTreeAction` has `visible(node)` but no `disabled(node)` predicate. If an action should be present but greyed out per-node, the consumer must filter via `visible(node)` and lose the affordance.
- **Recommendation:** add `disabled?: (node) => boolean` to `FalconTreeAction`.

### 6. (P1) No "action variant" beyond `highlighted`
- `highlighted` is a single boolean that paints the item red (`.fph-menu-item-highlighted`). No way to express "warning" vs "destructive" vs "success".
- **Recommendation:** add `variant?: 'default' | 'highlighted' | 'destructive' | 'warning'` and map to per-variant `styleClass`.

### 7. (P1) Hover-path mirror is rebuilt on every mousemove
- `TreeHoverPathDirective` fires on every mousemove and resolves the closest `.client-row`. Dedup is by `data-node-path` key. For long sessions on a large tree, this is many trivial passes.
- **Recommendation:** debounce or use `mouseenter`/`mouseleave` instead of `mousemove`.

### 8. (P1) Chevron-overlap auto-scroll is undocumented from consumer's perspective
- The panel scrolls the container right when the chevron overlaps the sticky 3-dot button. This is invisible to the consumer.
- **Recommendation:** document this behavior loudly; or expose a `(autoScrolledIntoView)` Output for analytics / scroll-state restoration.

### 9. (P2) No selection-cascade option
- Multi-selection is not supported. Single-select only.
- **Recommendation:** add `selectionMode?: 'none' | 'single' | 'multi'` Input (mirroring `<falcon-angular-tree>`).

### 10. (P2) `mode` is binary
- `'falcon' | 'client'`. No way for the root row to render a custom template (e.g., a partner brand badge).
- **Recommendation:** add `<ng-content select="[slot=root-row]">` for a fully custom root row.

### 11. (P2) `findNode` walks the full tree
- `findNode(root, id)` is recursive — O(n). Each per-row menu open re-walks. For very large trees this is wasteful.
- **Recommendation:** memoize via `WeakMap<root, Map<id, node>>` or rebuild on `root` ref change.

### 12. (P2) `clientsLabelKey` rendering placement is fixed
- Section label between root row and tree body. No way to move it.
- **Recommendation:** add `<ng-content select="[slot=section-label]">`.

### 13. (P3) No "Expand all" / "Collapse all" trigger
- The panel has no shortcut UI for this.
- **Recommendation:** include in the root 3-dot menu by default OR expose programmatic API.

## Missing accessibility features
- **(P1) `role="tree"` on the outer panel is delegated to inner node component** — verify presence.
- **(P1) The 3-dot button on each row has `aria-label="More actions for {nodeName}"`** — verify; the source uses a generic label.
- **(P2) The menu overlay's focus management is owned by `<falcon-angular-menu>`** — verify menu items get focus after open.

## Missing tests
- _None observed in active source._

## Missing Tailwind / token parity
- The panel has NO `*.tokens.css` file. All visual values are in SCSS.
- **Recommendation:** during convergence, create `tree-panel.tokens.css` for the chrome (aside, root row visuals, section label) — or fold everything into `tree.tokens.css` via additional categories.

## Performance risks
- Mousemove + mouseover listeners with RxJS `fromEvent` + `takeUntilDestroyed` — fine, but for very interactive sessions the auto-scroll re-computation per hover is non-trivial.
- `effect()` on `selectedId` triggers `requestAnimationFrame` → DOM measurement → `scrollTo()` per selection change. Multiple rapid selections may produce visible scroll jitter.

## Visual / interaction risks
- The auto-scroll behavior may surprise users who expected the panel to stay scrolled where they left it.
- The Falcon SVG in `mode="falcon"` is hardcoded — no way to swap brand assets.

## Reusable upgrade priority
- All items should land in shared component. Especially #1 (convergence) and #5/#6 (action richer types).

## Workaround availability
- For #2 (SCSS): tolerate until convergence.
- For #5 (disabled action): filter via `visible(node)` to hide instead of greying.
- For #10 (custom root row): use `mode="client"` and pre-process the root data to fit.
