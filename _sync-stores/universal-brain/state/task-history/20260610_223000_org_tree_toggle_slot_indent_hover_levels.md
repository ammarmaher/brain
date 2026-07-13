# Org-hierarchy tree: toggle slot + compact indent + hover-all-levels — COMPLETED 2026-06-10

FE-only, NO commits. Files changed (4):
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.ts` — `hasChildren`: in-memory children now WIN over stale wire flag (`children.length > 0 || (n.hasChildren ?? false)`); fixes "node shows without a toggle" after lazy-load/path-refresh merges.
- `.../falcon-tree-node.component.html` — rails+elbow `w-rail`→`w-tree-rail` (10px); ancestor-rail guide paints on `rail.onPath` ALONE (was ANDed with `hasNext` → last-child columns never painted on hover); elbow arm bleeds across flex gap (`after:-end-row-gap`); chevron+spacer lose `ms-0.5`; spacer (depth>0) carries 1px continuation hairline (rest tone / turn tone when elbow arm lit).
- `libs/falcon-theme/src/falcon-tailwind-tokens.css` — NEW `--spacing-tree-rail: 0.625rem`; `--spacing-row-gap` 6→4px; shared `--spacing-rail` (wallet/data-table consumers) untouched.

Verification:
- host-shell vitest 260/260 (incl. 233-case rail-highlight truth table — math untouched by design).
- `nx run-many -t build -p host-shell admin-console management-console --skip-nx-cache` GREEN (hash 3b9c4acfc02a5341).
- Bundle: `.w-tree-rail`, `after:-end-row-gap`, `before:-end-row-gap`, `before:top-[calc(50%-0.5px)]`, tokens present in dist/apps/host-shell/styles.css.
- LIVE localhost:4200 (sysadmin): depth-0 logos all X=281 (chevron or spacer, slot 18px); BMW222 chain logo X = 281/309/323/337/351/365/379 (exact 14px/level); depth-4 leaves asdasd/asxxxxxxx align with za; leaf hairline rgba(13,63,68,.3)@8.5px; hover asdasd → ALL ancestor columns guide-lit incl. last-child cols on E30/E33/E3335r rows, za passing fully lit, hovered slot hairline rgb(13,63,68), below-rows dim. 0 console errors.

Dev servers left RUNNING healthy: host-shell :4200 (preview-managed), admin-console :4204 (background npm task btwmzzi5w).
Memory: project_org_tree_toggle_slot_indent_hover_all_levels_2026_06_10.md + MEMORY.md index line.
