# falcon-organization-hierarchy-tree-tw — DECISION

## Brain SK final recommendation

### USE FOR

- Org-hierarchy panel on admin / management consoles (with the caveats below).
- Specifically: when you need the pinned root header + recursive child list + per-row + per-root context menus + brand bubble visuals.

### AVOID FOR

- Generic tree views → `<falcon-angular-tree>`.
- Tree-with-data-columns → `<falcon-angular-tree-table>`.
- Production until a Shadow companion + Angular wrapper are shipped (FOHT-01, FOHT-02).

## Preferred variant

Light DOM `<falcon-organization-hierarchy-tree-tw>` — this is the ONLY render path today. Consumer uses the Stencil tag directly inside Angular templates with `@ViewChild` + element-property reflection.

## Required upgrades before broader use

| ID | Priority |
|---|---|
| FOHT-01 Ship Shadow DOM companion | **P1** |
| FOHT-02 Ship Angular wrapper | **P1** |
| FOHT-03 Brand registry tokens | **P2** |
| FOHT-04 Stencil unit tests | **P1** |
| FOHT-05 Audit production adoption | **P1** |

## Relationship to other components

- Standalone — not composed by any other Falcon component.
- Tokens cross-reference `--falcon-tree-*` (shared with `<falcon-tree>` and `<falcon-tree-table>`) for rail behaviour parity.

## Exact rule

1. Reach this component for org-hierarchy panels specifically — its chrome is opinionated.
2. Bind object props via `@ViewChild` + `el.tree = …` in `ngAfterViewInit`.
3. Listen to `(falcon-select)` / `(falcon-toggle)` / `(falcon-action)` events.
4. Use `selectAndScrollTo(id)` for imperative selection + scroll.
5. Until FOHT-02 lands, write a thin Angular wrapper PER PROJECT to centralize the boilerplate.

## Status

**NEEDS-UPGRADE.** Most-incomplete component in Agent 2's roster — missing Shadow companion, missing Angular wrapper, missing brand registry, no production adoption visible.

## Dynamic capability assessment

1. **Static today:** Chrome layout (root header → section label → recursive list). No `[size]` / `[density]`. Brand styling via consumer CSS classes.
2. **Dynamic via inputs/outputs:** tree, selectedId, expandedIds, rootActions, nodeActions, sectionLabel, showExpand, showMoreActions, defaultExpandLevel, ariaLabel. Events: falcon-select, falcon-toggle, falcon-action. Methods: selectAndScrollTo, expandAll, collapseAll, closeContextMenu.
3. **Dynamic via slots:** NONE — no slots.
4. **Dynamic via tokens:** Full org-hierarchy token surface (~200 lines).
5. **Dynamic via Tailwind classes:** None at component level.
6. **Missing for reuse:** Shadow companion, Angular wrapper, brand registry tokens.
7. **Add to shared component:** FOHT-01, FOHT-02, FOHT-03, FOHT-04.
8. **Better flags/options:** `[size]` / `[density]` for compact org panels.
9. **Safest upgrade path:**
   1. Ship Angular wrapper FIRST (most impactful, additive).
   2. Add unit tests SECOND (regression confidence).
   3. Brand registry THIRD (token-only, additive).
   4. Shadow companion FOURTH (largest architectural change).
10. **Risky to change:**
   - `node.brand: string → client-logo bank-X` CSS class — changing breaks consumer CSS.
   - Inline `<style>` block in the `.tsx` — changing affects sticky menu button + rail SVG behaviour.
   - Document-level event listeners (Escape/mousedown/scroll/resize) — required for ctx menu behaviour; renaming would break.
   - Method signatures (`selectAndScrollTo`, `expandAll`, `collapseAll`, `closeContextMenu`) — public contract.

**Verdict:** Promising bespoke component held back by incomplete delivery (no Shadow, no wrapper). Recommend Wave to bring it up to library standards before consumer pages adopt it widely.
