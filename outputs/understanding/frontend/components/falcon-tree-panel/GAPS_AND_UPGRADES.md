# falcon-tree-panel — GAPS & UPGRADES

> **REFRESHED 2026-06-03 (B24).** Corrections: item 2 ("legacy SCSS files violate the rule") and the TOKENS "all visual values are in SCSS" claim are **STALE — no `.scss`/`.css` files exist** (the SCSS→Tailwind conversion is done; OVERVIEW/TOKENS/DECISION already said this). Item 1 (convergence with `<falcon-angular-tree>`) is downgraded — DECISION says it is "NOT a verified-active roadmap item". The genuine remaining gaps: richer action types (5/6), keyboard-open the kebab (4), a11y `role` wiring, and the RTL/`scrollLeft` fragility. Findings rows in `plans/library-deep-dive/FINDINGS/B24.md`. We FIX NOTHING this pass.

## Missing capabilities

### 1. (P2 — downgraded 2026-06-03) Parallel implementation to `<falcon-angular-tree>`
- The panel renders its OWN internal `<falcon-tree-node>` recursive component instead of composing `<falcon-angular-tree>`. Two parallel code paths for the same locked-spec contract.
- **Recommendation:** plan a Wave to:
  1. Extend `<falcon-angular-tree>` with per-row action slot + per-row template (see `falcon-tree/GAPS_AND_UPGRADES.md` items 2+3).
  2. Refactor `<falcon-tree-panel>` to compose `<falcon-angular-tree>` + chrome.
  3. Delete `<falcon-tree-node>`.
- **Risk:** mid-priority — the locked-spec visual is currently consistent across both implementations (both follow `admin/hierarchy.jsx`). But future updates to one may not propagate to the other. **DECISION (2026-05-18) downgraded this: convergence is "NOT a verified-active roadmap item — treat the two as independent today."** So this is a long-term consistency note, not a P0 blocker.

### 2. ~~(P0) Legacy SCSS files violate project rule~~ → **STALE / RESOLVED** (corrected 2026-06-03)
- `[CODE]` **CORRECTION:** there are **NO `.scss`/`.css` files** anywhere under `falcon-tree-panel/` (Glob clean 2026-06-03; the panel + node + directives + utils are all `.ts`/`.html`). The SCSS→Tailwind conversion is DONE (`[MEMORY]` `project_falcon_tree_panel_tailwind_2026_05_18`; OVERVIEW + TOKENS already state this). The prior "both `falcon-tree-panel.component.scss` and `falcon-tree-node.component.scss` exist" claim was DRIFT — internally contradicted by the same dossier's OVERVIEW/TOKENS. **No action needed.**

### 3. (P2) `ViewEncapsulation.None` reach (not a leakage risk today)
- `[CODE]` ts:67-89 The component disables encapsulation so (a) the host-class scrollbar utility variants reach every scrollable descendant and (b) the menu `rootClass` Tailwind utilities reach the externally-rendered popup. Because there is **no authored CSS file** (only Tailwind utilities + host-level arbitrary variants), there are no bespoke selectors to leak — the historical "every CSS rule MUST be prefixed" concern is largely moot now.
- **Recommendation:** if `<falcon-angular-menu>` later exposes an `itemClass`/`itemTemplate` input, the popup styling could move off `rootClass` and the panel could re-encapsulate. Low priority.

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
- `[CODE]` The pure trail-math `computeTreeRailHighlight()` (`utils/rail-highlight.ts`) IS unit-tested by `apps/host-shell/tests/tree-rail-highlight.spec.ts` (the rail tone truth-table — the well-documented motivation for using an index-path over an id-Set).
- **GAP:** no component-level spec for the panel itself (action dispatch / single-menu `menuContext` swap / `visible(node)` filter / `showSubNodes` collapse / `rootSelectable`/`nodesSelectable` gating / overlap-scroll). Add `falcon-tree-panel.component.spec.ts`.

## Missing Tailwind / token parity
- `[CODE]` **CORRECTION 2026-06-03:** the panel has NO `*.tokens.css` file AND **no SCSS** — visual values are Tailwind utilities bound to Falcon theme tokens (`--spacing-row-*`, `--spacing-rail`, `--spacing-row-action-inset`, `--color-falcon-*`, `--background-image-falcon-rail-*`), plus the popup's `[--falcon-menu-*]` `rootClass` overrides + the shared `.falcon-tree-action-menu` block in `menu.tokens.css` (`TOKENS.md`). The prior "all visual values are in SCSS" was DRIFT.
- **Recommendation (optional):** IF per-instance chrome theming is ever needed, a `tree-panel.tokens.css` (gate-12 `:where()`-scoped) could be added — but today the Tailwind+theme-token approach is the deliberate, compliant stance.

## Performance risks
- `[CODE]` ts:224-235 ONE delegated `mouseover` listener on `.falcon-tree` (RxJS `fromEvent` + `takeUntilDestroyed`) gated to `.chevron`/`.row-action`, plus `TreeHoverPathDirective`'s delegated `mousemove` (deduped by `data-index-path`). Fine for normal trees; the per-hover overlap re-computation is non-trivial on very large trees.
- `[CODE]` `findNode` is recursive O(n) and re-walks the full tree on every per-row menu open (item 11). (Note: the prior "`effect()` on `selectedId` → RAF scroll jitter" risk does NOT apply — there is no such `effect()` in the current source.)

## Visual / interaction risks
- `[CODE]` ts:334-339 The auto-scroll behavior may surprise users who expected the panel to stay scrolled where they left it (item 8) — it nudges right only on chevron/kebab hover overlap.
- `[CODE]` html:32-34 The Falcon SVG in `mode="falcon"` is hardcoded inline — no way to swap brand assets.
- `[CODE]` `scrollLeft`-based overlap math (`computeOverlapDelta` + `scrollTo({left})`) is **RTL-fragile** — `scrollLeft` is browser-inconsistent in RTL (`TOKENS.md` RTL note + `INTEGRATION_VALIDATION.md`). Verify in Arabic.

## Reusable upgrade priority
- Action richness (#5 `disabled(node)`, #6 `variant`) + keyboard-open (#4) + a11y `role` wiring are the highest-value shared upgrades. Convergence (#1) is downgraded (DECISION: not an active roadmap item).

## Workaround availability
- For #5 (disabled action): filter via `visible(node)` to hide instead of greying.
- For #10 (custom root row): use `mode="client"` and pre-process the root data to fit.
- (The old "#2 SCSS — tolerate until convergence" workaround is removed — no SCSS exists.)

## Deep-Dive Sweep Findings (2026-06-03 — B24, REFRESH)

**Consumer count: 10 occurrences / 4 files** — 1 live element consumer (`organization-hierarchy-tree` host-shell wrapper) + 1 spec + 1 archive doc ([CODE] grep `<falcon-tree-panel[\s>]`).

- **SCSS-violation items RESOLVED/STALE** — no `.scss`/`.css` exists (item 2 + the TOKENS "all values in SCSS" claim were drift, internally contradicted by the same dossier's OVERVIEW/TOKENS).
- **Type drift fixed** — `FalconTreeHoverPath` is `readonly number[]` (ordered index path), NOT `ReadonlySet<string>` (API.md corrected).
- **Single-menu model fixed** — ONE shared `#actionMenu` driven by `menuContext` + `activeMenuItems`; the prior two-menu / `rootMenuItems`+`nodeMenuItems` / `targetNodeId` / `hoveredPathIds` / `scrollIfChevronOverlapsAction` names were stale.
- **Stale `effect()`-scroll path removed** — the only auto-scroll trigger is the hover `mouseover` listener.
- **Convergence (#1) downgraded** P0 → P2 (DECISION: not an active roadmap item).
- **Best-practice posture:** PASS on Angular-21 surface (standalone, `input()`/`output()`/`computed`/`signal`, `OnPush`, `inject()`, `takeUntilDestroyed`/`DestroyRef`, `@if`/`@for`, no SCSS, no NgModule). `ViewEncapsulation.None` is justified (scrollbar variants + popup `rootClass` reach). Genuine gaps: a11y `role`/keyboard (4 + a11y), richer actions (5/6), RTL `scrollLeft` fragility, no component spec.
- **No deletion/promotion flags** — ACTIVE production component (the org-hierarchy left rail).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) against `falcon-tree-panel.component.ts` (381 ln) + `.html` (157 ln) + node/directives/utils + `models/models.ts`. SCSS-absence confirmed via Glob (no `.scss`/`.css`). Type + single-menu + helper-name corrections confirmed in source. Convergence-downgrade cross-referenced from `DECISION.md`. No deletion/promotion flags.
