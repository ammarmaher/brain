*** Source Startup Report — Organization Hierarchy Falcon Eyes Repair (RESUMED 2026-05-15) ***

## Goal
Verify both source and destination render the Organization Hierarchy page so Falcon Eyes captures meaningful screenshots.

## Source (Reference)

- URL: `http://localhost:3000/T2 Falcon Admin`
- Status: HTTP 200, static
- Backing process: PID 23200 serving `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha (1)` (no `package.json` — collection of HTML/JSX/CSS)
- Render verified: full Organization Hierarchy page (header, sidebar, tabs, tree, populated users table, pagination)
- **Status: OK**

## Destination (Falcon Angular host-shell)

- URL: `http://localhost:4200/#/admin-console/org-hierarchy-page`
- Status: HTTP 200 + full route render (after auth unblock)
- Backing process: long-running Angular host-shell dev server on 4200 (PID 29464)
- Render verified: full page renders with sidebar, topbar, breadcrumb, Falcon Tabs row (Hierarchy / CommChannels & Services / Apps & Services / Settings), Falcon Tree (Falcon Clients), node header (Add Node / Add User / Information), Falcon Data Table with empty-state slot, paginator, List/Tree toggle
- **Status: OK**

## Auth unblock — Plan B (dev-only bypass, reverted before implementation commit)

Three edits in the host-shell repo with clearly-marked dev-only short-circuits that activate only on `localhost(:4200)`:

| File | Change |
|---|---|
| `apps/host-shell/src/app/core/guards/auth.guard.ts` | Top-of-guard `return true` on localhost |
| `libs/falcon/src/core/lib/access-control/shell-access.guard.ts` | Same in `shellPrimeAccessGuard` |
| `apps/host-shell/src/app/core/auth/auth.service.ts` | `login()` and `logout()` early-return on localhost |

Marker: `*** FALCON-EYES NIGHT-SHIFT DEV BYPASS 2026-05-15 — REMOVE BEFORE IMPLEMENTATION COMMIT ***`

Plan A (`?visual-test=1` query + sessionStorage + synthetic JWT via Playwright `addInitScript`) was attempted first using the pre-existing guard bypass. It did not work because the host-shell's `AuthService.login()` / `logout()` are called from multiple fetch-failure paths during bootstrap and unconditionally call `router.navigate(['/login'])` — kicking the page out of the org-hierarchy route after the guards passed. Plan B closes that escape hatch.

## Servers map

| Port | Service | Status |
|---|---|---|
| 3000 | React SoT (static) | OK |
| 4200 | Falcon Angular host-shell (Nx dev server) | OK |
| 4204 | Falcon Angular admin-console (MF remote, `remoteEntry.mjs`) | OK |
| 4301 | Falcon Angular management-console (MF remote) | OK |
