---
name: project_org_hierarchy_tree_rail_lines_fix_2026_06_10
description: Org-hierarchy tree connector rails invisible/fragmented — root-caused (self-stretch vs row padding + alpha-18 rest tone) and fixed in shared falcon-tree-panel; live-verified both states on admin-console
metadata: 
  node_type: memory
  type: project
  originSessionId: 6f929095-e79b-4668-9dd7-90c9d665bacb
---

# Org Hierarchy tree rails invisible/fragmented — FIXED + LIVE-VERIFIED (2026-06-10, claude, FE-only, NO commits)

**Report**: hover on a tree node should show the connector line back to its origin (old-UI reference = always-visible ladder + dark hover path); implemented tree showed "nothing".

**Surface**: shared `falcon-tree-panel` (libs/falcon shared-ui) — rendered by host-shell wrapper `<app-organization-hierarchy-tree>` (imported cross-app via `@host-shell/shared/organization-hierarchy-tree` TS alias) inside admin-console `org-hierarchy-page` (`/admin-console/h/{token}`). Same component serves mgmt console, templates page, wallet, contact-groups, marketplace (clients-only modes have no rails).

**Verified NOT broken first** (don't re-investigate): rail-highlight math `utils/rail-highlight.ts` (233-test suite green), `TreeHoverPathDirective` (mousemove→`data-index-path`→signal), zoneless signal chain, Tailwind v4 generation — all `bg-falcon-rail-*` utilities + `--background-image-falcon-rail-*`/`--color-falcon-rail-*` vars WERE in served styles.css. The trail actually LIT on hover — but fragmented + dim.

**Root causes (2, both visual-layer)**:
1. `.tree-rail` spans (ancestor rails + elbow) are flex items in `.client-row` (`py-row-pad-y`=6px); `self-stretch` covers only the CONTENT box → each row's segment 6px short top+bottom → 12px white gaps → ladder broken into fragments.
2. Rest tone `--color-falcon-teal-alpha-18` rgba(13,63,68,.18) at 1px ≈ invisible on white/teal-50 → no hover ⇒ no visible lines at all (user screenshots without live hover showed empty columns).

**Why (lesson)**: a 1px guide line must span the row's FULL border-box (bleed across padding with negative margins), and a rest-state hairline needs ≥~0.30 alpha to read. `self-stretch` inside a padded flex row silently under-paints — same family as the SCSS→Tailwind drift lesson in [[project_dashboard_main_parity_tailwind_scrape_2026_06_08]].

**How to apply (fix shape)**:
- `falcon-tailwind-tokens.css`: NEW semantic `--color-falcon-rail-rest: rgba(13,63,68,0.30)` (do NOT touch `teal-alpha-18` — shared by calendar/drawer/tree-indicator); `rail-default` gradient repointed to it.
- `falcon-tree-node.component.html`: `-my-row-pad-y` on BOTH rail spans (symmetric padding keeps 50% midline = row center so elbow arms stay centered); dim pseudos `before/after:bg-falcon-teal-alpha-18` → `bg-falcon-rail-rest`.

**Evidence**: live Chrome localhost:4200 (sysadmin), BMW222→E30→E33→E3335r→za chain; DOM rails 36px (was 24) + −6px margins; REST = continuous visible ladder, HOVER = continuous dark teal path that dims below hovered node; 0 console errors. host-shell vitest 233/233 green (1 PRE-EXISTING unrelated file failure: `falcon-http-ui-dispatcher.spec.ts` can't resolve `@falcon/studio/runtime` from falcon-image-uploader). Prod builds not run by this session — concurrent `frontend-zero-warnings` session was building the same tree simultaneously; both watch dev-servers compiled green. Mgmt console inherits the fix (not live-verified).

**~~OPEN BUG flagged~~ RESOLVED 2026-06-10**: sidebar "Organization Hierarchy" (admin) dead click — root-caused + hardened + live-verified by the spawned background task; see [[project_sidebar_org_hierarchy_dead_click_hung_chunk_2026_06_10]] (hung nested lazy-chunk import on wedged remote origin; click-time watchdog + withLazyLoadTimeout).

Related: [[project_org_hierarchy_routed_userdetails_urlstate_2026_06_08]] · [[project_opaque_navigation_token_system_2026_06_08]] · [[reference_fe_structure_standard_angular21_2026_06_02]]
