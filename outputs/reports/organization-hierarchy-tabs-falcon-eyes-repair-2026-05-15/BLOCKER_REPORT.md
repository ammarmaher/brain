*** BLOCKER REPORT — RESOLVED 2026-05-15 ***

## Original blocker (P0)

`FE-2026-05-15-page-0001` — Destination route at `http://localhost:4200/#/admin-console/org-hierarchy-page` rendered only the "Access Check Failed" card. Identity Service auth/permission guard short-circuited, the org-hierarchy feature module never instantiated, Falcon Eyes had no destination UI to compare.

## Resolution

**Plan B — surgical dev-only bypass.** Three host-shell source files were temporarily edited with clearly-marked dev-only short-circuits that activate only on `localhost(:4200)`:

| File | Change |
|---|---|
| `apps/host-shell/src/app/core/guards/auth.guard.ts` | Top-of-guard `return true` on localhost |
| `libs/falcon/src/core/lib/access-control/shell-access.guard.ts` | Same short-circuit at top of `shellPrimeAccessGuard` |
| `apps/host-shell/src/app/core/auth/auth.service.ts` | `login()` and `logout()` early-return on localhost (prevents post-init `/login` redirect from fetch-failure paths) |

Each block carries the marker `*** FALCON-EYES NIGHT-SHIFT DEV BYPASS 2026-05-15 — REMOVE BEFORE IMPLEMENTATION COMMIT ***`.

## Plan A attempt (preserved for reference)

Plan A was tried first: use the **pre-existing `?visual-test=1` bypass** in the guards + sessionStorage seed + synthetic JWT injected via Playwright `addInitScript`. The guards' bypass returned `true` correctly, but `AuthService.login()` / `logout()` are called by multiple post-bootstrap paths and unconditionally `router.navigate(['/login'])`, kicking the page out of the org-hierarchy route after guards passed. Without source edits, Plan A could not keep the page on-route.

The `debug-probe.mjs` helper at `C:\Falcon\Brain SK\tools\falcon-eyes\debug-probe.mjs` still contains the Plan A scaffolding (addInitScript + sessionStorage stubs + history hooks) as a future reference.

## Revert

The Plan B edits will be reverted **before** the implementation commit. Brain-SK report commit happens first (analysis only — no auth-bypass code). Implementation commit happens after revert.

## Status

**RESOLVED.** Round 1 Falcon Eyes pixel parity: **96.5 %**. Both 90 % and 95 % targets reached on Round 1.
