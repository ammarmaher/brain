---
name: session-backup-wave-22-mgmt-console-e2e-root-cause-fixes
description: "Fixed the 4 Wave 21 misses (marketplace redirect, contracts copy, i18n leak, wallet guard) with reproduce-before-fix discipline"
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-28
  status: completed
  originSessionId: 25972c96-56f6-47b9-b1ee-a0d5bc4ea595
---

## What Was Done
Wave 22 of the 2026-05-28 mgmt-console E2E loop. Wave 20/21 had fixed wrong causes; Wave 22 reproduced each bug first, then fixed the REAL cause.

- **FIX-1 (marketplace silent-redirect, cells 7/8/9):** Root cause was NOT a component/chunk issue — the STALE dev-server bundle had the `marketplace` child route MISSING entirely from `__federation_expose_management_console.js` (children went comm-mgmt→organization-hierarchy→wallet, marketplace absent). Router fell to wildcard → `/management-console`. Source `app.routes.ts:51-61` is correct. Proven by: forcing recompile (touched `:55` comment) regenerated expose WITH marketplace; clean `nx build` (hash `1a7b48efa38156a5`) has all 6 routes + `marketplaceApplicationsRoutes`; live PID 63236 serves fresh WITH marketplace. REMOVED Wave 20's dead try/catch in `marketplace-applications.component.ts` constructor.
- **FIX-2 (contracts "Select a Falcon client" copy, cell 16):** Flipped `contracts-cost-management.component.ts:152` → `mgmtEmptyListMessage`, `:180` → `mgmtEmptyStateMessage`. Zero live refs to bug key `emptyStateMessage` remain.
- **FIX-3 (raw i18n leak):** Wave 21's "[label] projection bug" hypothesis DISPROVEN at runtime — `[attr.label]` held the raw key because the pipe returned an UNRESOLVED key (stale i18n bundle missing `common.refresh`; source + build HAVE it). `[label]` works when key resolves (proved via DOM test). NO shared-lib change. Added genuinely-missing `common.view` ("View"/"عرض") to en/ar.json.
- **FIX-4 (wallet acc-admin guard, cell 11):** Wave 20 guard read `session.roles` = always `[]` (setFromToken hard-codes it). FE role signal EXISTS: `GET identity/user/me` → `roleKey`. Rewrote `accOwnerOnlyGuard` (wallet routes :46-84) as async CanActivateFn fetching `/user/me` via HttpService+useGateway, permits only `roleKey==='acc-owner'`. CONFIRMED vs live backend: accowner→"acc-owner"→ALLOW, accadmin→"acc-admin"→DENY(/401).

## What Remains
- In-browser VISUAL paint of FIX-1/2/3 blocked by a STUCK Chrome disk-cache of the `:4301` expose module (survives tab-close, cache:'reload', unique query, Ctrl+Shift+R). curl gets fresh; only Chrome stale. Needs `chrome://settings/clearBrowserData` + single dev-server. NOT a code defect.
- NO COMMITS made (per constraint). All edits in working tree.

## Key Decisions
- FIX-1 & FIX-3 root causes were STALE DEV-SERVER BUNDLES, not code. Documented as B-15 (duplicate nx serve on :4301 — host-shell MF build PID 33012 stale vs standalone PID 63236 fresh; browser hit stale via the dual-stack `::` binding). Restarted host-shell so `:4301` is single fresh instance.
- FIX-4: chose FE-gateable (`/user/me` roleKey) over backend-bound B-2. B-2 still recommended long-term.

## Files Changed (working tree, uncommitted)
- apps/management-console/src/app/app.routes.ts (FIX-1 comment touch :55 — forced recompile; route was always correct)
- apps/management-console/src/app/features/marketplace-applications/marketplace-applications.component.ts (removed Wave 20 try/catch)
- apps/management-console/src/app/features/contracts-cost-management/contracts-cost-management.component.ts (:152 + :180 mgmt keys)
- apps/management-console/src/app/features/wallet-balance-management/wallet-balance-management.routes.ts (async /user/me guard)
- libs/falcon/src/language/i18n/en.json (+common.view "View")
- libs/falcon/src/language/i18n/ar.json (+common.view "عرض")
- C:\Falcon\plans\backend-flags-2026-05-27.md (B-2 Wave 22 update, B-14, B-15)
- C:\Falcon\plans\runtime-verification-e2e-2026-05-28.md (Wave 22 section)

## Context for Next Agent
- Build green hash `1a7b48efa38156a5`. All 4 fixes in dist.
- To finish browser confirmation: clear Chrome cache (chrome://settings/clearBrowserData), ensure exactly ONE `nx serve management-console` (kill duplicate), reload, re-test cells 7/8/9 (marketplace should mount for accowner) + 16 (contracts mgmt copy) + 10/13/14/15 (refresh button shows "Refresh" not raw key) + 11 (accadmin DENY at wallet).
- Pre-flight MUST probe `:4301/remoteEntry.mjs` content (not just HTTP 200) AND check for duplicate dev-servers (`netstat ':4301'` + the host-shell "Skipping proxy ... port already in use" log line).
