---
name: project_org_tree_toggle_slot_indent_hover_all_levels_2026_06_10
description: "Org-hierarchy tree — truthful chevron (children win over stale wire hasChildren), always-reserved 18px toggle slot + leaf continuation hairline, level indent 24→14px via new --spacing-tree-rail, hover trail paints ALL on-path level columns; live-verified on admin-console"
metadata: 
  node_type: memory
  type: project
  originSessionId: f89a69e6-c71c-421c-a30b-a6b735a9d259
---

# Org tree: toggle slot + compact indent + hover-all-levels — FIXED + LIVE-VERIFIED (2026-06-10, claude, FE-only, NO commits)

**User report**: nodes sometimes show without a toggle; reserved toggle space must never disappear; spaces much smaller; hover indicator must indicate ALL levels for ALL nodes.

**Surface**: shared `falcon-tree-panel` (libs/falcon shared-ui) + `libs/falcon-theme/src/falcon-tailwind-tokens.css`. Serves admin + mgmt org-hierarchy, templates, wallet-page, contact-groups, marketplace trees.

**Root causes (3)**:
1. **Toggle vanishing** = `falcon-tree-node.component.ts` `hasChildren = n.hasChildren ?? children.length` — stale wire `false` WON over actually-present children (merged later by lazy-load / path-refresh / post-Add-Node), so a node rendered its children with no chevron. Fix: `children.length > 0 || (n.hasChildren ?? false)` (in-memory children win; wire flag only decides pre-load). NOTE: the 18px spacer slot itself was ALWAYS in the template — the "disappearing space" perception = leaf rows' dead 26px void (elbow arm stopped a gap short, nothing in the slot).
2. **Spacing**: per-level pitch was `w-rail`(18) + `gap-row-gap`(6) = 24px/level. `--spacing-rail` is SHARED (wallet wbm-client-view rails/chevrons, data-table paginator fallbacks) → do NOT shrink it. Added dedicated `--spacing-tree-rail: 0.625rem` (10px) for rail columns only + tightened `--spacing-row-gap` 6→4px (tree-only token) → 14px/level. Chevron/spacer keep 18px `w-rail` hit-target; dropped `ms-0.5`.
3. **Hover trail broke mid-air** = template painted `bg-falcon-rail-guide` only when `rail.hasNext && rail.onPath` — columns whose ancestor is a LAST child rendered NOTHING even on-path (math in `utils/rail-highlight.ts` was always correct; 233-test suite untouched). Fix: paint guide on `rail.onPath` alone; rest-state keeps classic ladder (`hasNext`-gated `rail-default`).

**Polish**: elbow horizontal arm bleeds across the flex gap (`after:-end-row-gap`) onto the slot edge; leaf spacer (depth>0) carries a 1px continuation hairline (`before:` start-0 → `-end-row-gap`, rest tone, flips to `rail-turn` when elbow after is 'turn') so the ladder runs unbroken into the badge. Depth-0 spacer stays plain.

**Files (4)**: falcon-tree-node.component.{ts,html}, falcon-tailwind-tokens.css (+ brain task state). Wire model/services untouched.

**Evidence**: host-shell vitest 260/260 (incl. 233 rail-highlight); `nx run-many build` host-shell+admin+mgmt GREEN; bundle-verified `.w-tree-rail`/`after:-end-row-gap`/`before:-end-row-gap`/`before:top-[calc(50%-0.5px)]` + tokens in dist styles.css. LIVE on localhost:4200 (sysadmin/Admin@1234, preview browser): all depth-0 logos X=281 chevron-or-spacer; BMW222 chain logoX 281→309→323→337→351→365→379 (exact 14px steps); depth-4 leaves asdasd/asxxxxxxx align with za at 351; spacer ::before 1px rgba(13,63,68,.3) @top 8.5px; hovering asdasd lights ALL ancestor cols guide on E30/E33/E3335r rows (last-child cols that previously painted nothing), passing sibling za fully lit, hovered leaf's slot hairline turns rgb(13,63,68), rows below stay dim. 0 console errors.

**Lesson**: when a class binding ANDs a data flag into a visual condition (`hasNext && onPath`), the highlight math can be perfect while the template silently refuses to paint — verify paint conditions separately from path math. Also: `??`-precedence on a wire boolean makes stale flags win over loaded data; order presence-of-data first.

Related: [[project_org_hierarchy_tree_rail_lines_fix_2026_06_10]] · [[project_org_hierarchy_routed_userdetails_urlstate_2026_06_08]] · [[reference_fe_structure_standard_angular21_2026_06_02]]
