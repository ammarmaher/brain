# falcon-organization-hierarchy-tree-tw — DECISION

## Brain SK final recommendation

### USE FOR

- **Nothing in production today.** ⚠️ This component is REGISTERED/DOCUMENTED but UN-RENDERED — it has ZERO live consumers (verified 2026-06-03). The live org-hierarchy rail is `<falcon-tree-panel>` via `<app-organization-hierarchy-tree>`. For org-hierarchy work, use THAT path.
- IF later adopted (FOHT-05 decision): when you need the pinned root header + recursive child list + per-row/per-root context menus.

### AVOID FOR

- The live org-hierarchy panel — use `<falcon-tree-panel>` / `<app-organization-hierarchy-tree>` (it has the Angular layer, PES gating, and Commerce wiring).
- Generic tree views → `<falcon-angular-tree>`. Tree-with-columns → `<falcon-angular-tree-table>`.
- Any keyboard-accessibility-required context until FOHT-07 (no `onKeyDown`) is closed.

## Preferred variant

Light DOM `<falcon-organization-hierarchy-tree-tw>` — this is the ONLY render path today. Consumer uses the Stencil tag directly inside Angular templates with `@ViewChild` + element-property reflection.

## Required upgrades before broader use

| ID | Priority |
|---|---|
| FOHT-05 DECIDE adopt-vs-delete (the gating question — it's currently dead) | **P1** |
| FOHT-02 Ship Angular wrapper (if adopting) | **P1** |
| FOHT-07 Add roving keyboard nav (no `onKeyDown` today) | **P1** |
| FOHT-04 Stencil unit tests | **P1** |
| FOHT-08 Wire or remove the latent `node.brand` prop | **P2** |
| FOHT-03 Brand registry tokens (if `brand` is wired) | **P2** |
| FOHT-01 Ship Shadow DOM companion (only if a hard isolation need appears) | **P2** |

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

**DEAD / UN-RENDERED — ADOPT-OR-DELETE PENDING.** Registered + documented but with ZERO live render consumers (the live org-hierarchy rail is the SEPARATE `<falcon-tree-panel>` / `<app-organization-hierarchy-tree>`). It is the most-incomplete-AND-unused unit in the roster: missing Angular wrapper, missing keyboard nav, latent `brand` prop, no tests. The headline question is NOT "what to upgrade" but "adopt it (build the wrapper + migrate the live rail onto it for cross-framework parity) OR delete it as superseded dead code (as the legacy stepper was)." A human must decide (FOHT-05). It is NOT a regression — the live tree works via `falcon-tree-panel`.

## Dynamic capability assessment

1. **Static today:** Chrome layout (root header → section label → recursive list). No `[size]` / `[density]`. Indicator bubble via `iconUrl`/`icon`/`initials` (NOT `brand` — unused).
2. **Dynamic via inputs/outputs:** tree, selectedId, expandedIds, rootActions, nodeActions, sectionLabel, showExpand, showMoreActions, defaultExpandLevel, ariaLabel. Events: falcon-select, falcon-toggle, falcon-action. Methods: selectAndScrollTo, expandAll, collapseAll, closeContextMenu.
3. **Dynamic via slots:** NONE — no slots.
4. **Dynamic via tokens:** Full org-hierarchy token surface (213 lines, `:where()`-scoped, shared with the live `app-organization-hierarchy-tree` wrapper).
5. **Dynamic via Tailwind classes:** None at component level.
6. **Missing for reuse:** an adopt-vs-delete decision FIRST; then (if adopting) Angular wrapper, keyboard nav, tests.
7. **Add to shared component:** FOHT-02 (wrapper), FOHT-07 (keyboard), FOHT-04 (tests) — only if adopted.
8. **Better flags/options:** `[size]` / `[density]` for compact org panels.
9. **Safest upgrade path (IF adopted):**
   1. DECIDE adopt-vs-delete (FOHT-05) — gates everything.
   2. Add roving keyboard nav (FOHT-07) — a11y blocker, additive.
   3. Ship Angular wrapper (FOHT-02) — additive.
   4. Add unit tests (FOHT-04) — regression confidence.
   5. Wire/remove `node.brand` (FOHT-08).
10. **Risky to change:**
   - The inline `<style>` block (`ORG_HIERARCHY_RAIL_STYLES`) — changing affects sticky menu button + rail SVG geometry.
   - Document-level `@Listen` handlers (Escape/mousedown/scroll/resize) — required for ctx-menu behaviour.
   - Method signatures (`selectAndScrollTo`/`expandAll`/`collapseAll`/`closeContextMenu`) — public contract.
   - The shared `--falcon-tree-*` token dependency (rails/node/indicator) — also drives `falcon-tree` / `falcon-tree-table` and the live `falcon-tree-panel` wrapper.
   - (NOT risky: `node.brand` — it is unused today, so changing it breaks nothing.)

**Verdict:** A complete, capable bespoke Stencil tree that NOTHING renders — the live org rail diverged onto `<falcon-tree-panel>`. Decide adopt-or-delete before any further investment.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21). Status reframed NEEDS-UPGRADE → DEAD/UN-RENDERED (adopt-or-delete). Counts corrected: token file 213 ln; `node.brand` latent/unused; keyboard nav absent (FOHT-07); zero live render consumers. The live org tree is `<falcon-tree-panel>`.
