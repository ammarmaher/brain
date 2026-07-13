# Task: sidebar "Organization Hierarchy" (admin) click does not navigate — ROOT-CAUSED + HARDENED + LIVE-VERIFIED

- **taskId**: sidebar-org-hierarchy-click-dead-2026-06-10
- **Status**: completed (2026-06-10 ~19:08 local)
- **Repo**: C:\Falcon\Falcon\falcon-web-platform-ui (branch polishing-v0.4), FE-only, NO commits (per instruction)
- **Note**: current-task.json was taken over mid-task by concurrent session `pes-role-catalog-pr-docker-verify-2026-06-10` (it lists this task as pausedPreviousTask) — left untouched; completion recorded here + progress-log + memory.

## Report
Sidebar item "Organization Hierarchy" (admin scope) reportedly did nothing on click: URL unchanged, no console error; page reachable only via direct URL `/#/admin-console/h`.

## Root cause
The click path itself is CORRECT (live-verified to land on healthy servers). The reported failure is environmental:
1. A wedged admin-console dev origin (webpack dev-server stuck mid-recompile/OOM) accepts the chunk request and never responds.
2. The NESTED lazy import (`h` → org-hierarchy-page.routes; `:navigationToken` → menu component) stays pending forever → the router navigation is silently in-flight: no NavigationError, no NavigationCancel, no URL change.
3. Angular caches the in-flight loader per route → every subsequent click joins the same hung promise (dead until webpack's ~120s chunk timeout). A new tab / full reload = fresh runtime → direct URL works.
4. The pre-existing (uncommitted, same-day) diagnostics missed exactly this: the sidebar watchdog was armed inside `navigation.then(...)` (hung promise never settles → watchdog never armed → zero output), and RemoteRouteService's 15s `withLoadTimeout` only guards the REMOTE-ENTRY load — already loaded when clicking from Templates.

## Fix (6 files)
1. `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` — watchdog armed AT CLICK TIME (before the promise can settle); epoch-guarded against superseding clicks; bounded re-checks (5 × 2000ms) distinguish DROPPED (guard rejection / failed module) from HUNG (chunk fetch in flight); both warn loudly; healthy bootstrap-redirect stays silent.
2. `libs/falcon/src/shared-utils/lib/utils/lazy-load-timeout.ts` (NEW) — `withLazyLoadTimeout(work, what, timeoutMs=20s)`: races the import against a rejection → hang becomes a loud RETRYABLE NavigationError (router drops cached loader; webpack resets the failed chunk).
3. `libs/falcon/src/shared-utils/index.ts` — export the helper via `@falcon`.
4. `apps/admin-console/src/app/app.routes.ts` — `h` loadChildren wrapped.
5. `apps/admin-console/src/app/features/org-hierarchy-page/org-hierarchy-page.routes.ts` — `:navigationToken` loadComponent wrapped.
6. `apps/management-console/src/app/app.routes.ts` + `.../org-hierarchy-page/org-hierarchy-page.routes.ts` — same twin wraps (identical hang class).

## Evidence
- Live (Chrome, sysadmin/Admin@1234, localhost:4200): Dashboard→Org, Templates→Org (exact reported repro), Org→Templates→Org, Org→Dashboard→Org — ALL land on `/admin-console/h/{fresh-token}`; page renders (tree + users table); console free of [Sidebar]/[LAZY-LOAD] warnings (no watchdog false positives through the resolved-false bootstrap redirect).
- `nx run-many --target=build --projects=host-shell,admin-console,management-console` → exit 0 ("Successfully ran target build for 3 projects").
- admin-console vitest: 841/841 tests pass; 1 FILE failed at vite transform = parallel session's in-flight `contracts-addons-section.component.spec.ts` edit (unrelated; its tests never ran).

## Lessons
- A navigation that HANGS produces zero router events; only a click-time watchdog or a loader-level timeout can surface it. `.then`-armed watchdogs are dead code for hangs.
- Tooling: a browser-zoom change between Chrome sessions makes raw-coordinate clicks land on the wrong sidebar row (CSS px ≠ screenshot px) — indistinguishable from the bug under test. Use element-ref clicks for regression clicking.
- Dev servers left RUNNING for the user: host-shell :4200 (+static remotes 4301/4302), admin-console watch :4204.
