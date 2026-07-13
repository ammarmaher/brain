---
name: project_sidebar_org_hierarchy_dead_click_hung_chunk_2026_06_10
description: "host-shell sidebar Org Hierarchy (admin) dead click root-caused — hung nested lazy-chunk import on wedged remote origin, silently in-flight navigation + cached loader; fixed via click-time watchdog + withLazyLoadTimeout on the h chain (both consoles); live-verified"
metadata: 
  node_type: memory
  type: project
  originSessionId: 609f2fd4-2e28-4923-a0bb-05a329c5e6d5
---

# Sidebar "Organization Hierarchy" (admin) dead click — ROOT-CAUSED + HARDENED + LIVE-VERIFIED (2026-06-10, claude, FE-only, NO commits)

**Symptom**: click did nothing — URL unchanged, ZERO console output; page worked via direct URL `/#/admin-console/h`. Was the OPEN flag from [[project_org_hierarchy_tree_rail_lines_fix_2026_06_10]].

**Root cause (environmental, NOT a code-path bug)**: the click path is correct (live-verified to land on healthy servers: `/admin-console/h` → bootstrap guard mints token → `/admin-console/h/{token}`). The dead click happens when the admin-console dev origin (:4204) wedges mid-recompile: the NESTED lazy chunk import (`h` → org-hierarchy-page.routes, `:navigationToken` → menu component) stays pending FOREVER → router navigation silently in-flight (no NavigationError/Cancel, no URL change) → Angular caches the in-flight loader → every later click joins the same hung promise (until webpack's ~120s chunk timeout). New tab/reload = fresh runtime → direct URL works. Same-day diagnostics by another session missed it: sidebar watchdog armed inside `navigation.then(...)` (hung promise never settles → never armed → silence), and RemoteRouteService's 15s timeout only guards the REMOTE-ENTRY load (already loaded when clicking from Templates).

**Why (lesson)**: a HUNG navigation emits no router events and never settles its promise — only a click-time watchdog or a loader-level timeout can see it. `.then`-armed watchdogs are dead code for hangs.

**How to apply (fix shape, 6 files)**:
- `sidebar.component.ts` (host-shell): arm `watchForDroppedNavigation` AT CLICK TIME, epoch-guarded (`++clickEpoch`), bounded re-checks (5×2000ms) → distinguishes DROPPED (guard rejection) vs HUNG (still in flight) — both console.warn; healthy bootstrap-redirect stays silent (landed startsWith target).
- NEW `@falcon` util `withLazyLoadTimeout(import(...), what, 20s)` (`libs/falcon/src/shared-utils/lib/utils/lazy-load-timeout.ts`): races a rejection → hang becomes a loud RETRYABLE NavigationError (router drops cached loader, webpack resets failed chunk → next click retries fresh). Applied to the org `h` chain in BOTH consoles (admin+mgmt `app.routes.ts` `h` loadChildren + `org-hierarchy-page.routes.ts` `:navigationToken` loadComponent). Reusable for any remote-nested lazy route.

**Evidence**: live Chrome (sysadmin) — Dashboard→Org, Templates→Org (exact reported repro), repeat matrix: all land with fresh tokens, page renders, zero [Sidebar]/[LAZY-LOAD] warnings (no false positives). `nx run-many build` host-shell+admin+mgmt exit 0. Admin vitest 841/841 (1 transform-failed FILE = parallel session's in-flight contracts spec, unrelated).

**Tooling trap (cost ~20 min)**: a Chrome zoom change between sessions shifted CSS px vs screenshot px — raw-coordinate clicks hit the WRONG sidebar row (dead zone), perfectly mimicking the bug (no nav, no console). Use element-ref clicks (`computer` with `ref` from read_page) for click regression; verify with `document.elementFromPoint`.

Related: [[project_org_hierarchy_tree_rail_lines_fix_2026_06_10]] · [[project_opaque_navigation_token_system_2026_06_08]] · [[project_org_hierarchy_routed_userdetails_urlstate_2026_06_08]]
