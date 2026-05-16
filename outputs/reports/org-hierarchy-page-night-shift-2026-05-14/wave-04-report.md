# Wave 4 — Frontend Route + Page Skeleton

**Status:** ✅ GREEN
**Run:** 2026-05-14 (Brain SK Night Shift)
**Build hash:** `a4372bd2ff3fba09` (admin-console, 20,216 ms)

## Goal
Land the minimum file set so `nx build admin-console` is green with the new route registered.

## Files created (5)

| Path | Size | Purpose |
|---|---:|---|
| `apps/admin-console/src/app/features/org-hierarchy-page/org-hierarchy-page.routes.ts` | ~500 B | Lazy-loaded child routes — exports `orgHierarchyPageRoutes` + default |
| `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | ~430 B | Standalone OnPush placeholder shell |
| `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | ~330 B | Placeholder body: "Org Hierarchy (Admin)" + Wave 4 note |
| `apps/admin-console/src/app/features/org-hierarchy-page/models/models.ts` | ~970 B | Minimal domain types: `NodeType`, `UserStatus`, `ClientNode`, `User`, etc. |
| `apps/admin-console/src/app/features/org-hierarchy-page/services/services.ts` | ~590 B | `OrgHierarchyStubService` with `SEED_ROOT` — real `OrgHierarchyMockFacade` lands in W7+ |

## Files edited (1)

| Path | Diff | Purpose |
|---|---|---|
| `apps/admin-console/src/app/app.routes.ts` | +9 / -0 | Registers `org-hierarchy-page` lazy route alongside the existing redirect |

## Acceptance criteria

| # | Criterion | Status |
|---|---|:---:|
| 1 | New feature folder exists with required files | ✅ |
| 2 | `nx build admin-console` GREEN | ✅ hash `a4372bd2ff3fba09` |
| 3 | Route registered + lazy-loads (separate chunk visible) | ✅ chunks `components-org-hierarchy-page-menu-component` (888 B) + `features-org-hierarchy-page-org-hierarchy-page-routes` (280 B) |
| 4 | No SCSS / no PrimeNG / no hardcoded hex | ✅ Tailwind utilities only (`p-6 flex flex-col gap-2 text-2xl text-falcon-neutral-900`) |
| 5 | Selector follows `app-*` rule | ✅ `app-org-hierarchy-page-menu` |
| 6 | OnPush + standalone | ✅ both set |

## Verification commands

```
npx nx build admin-console
# → Build at: 2026-05-13T22:00:58.535Z  Hash: a4372bd2ff3fba09  Time: 20216ms
# → Successfully ran target build for project admin-console and 2 tasks it depends on
```

## What's left for later waves (not blocking)

- ⏳ Lint gate — running in parallel
- ⏳ Live verification (Wave 17) — admin-console route reachable after user logs in
- ⏳ State service, full models, mock facade — W7
- ⏳ Tree, tabs, wizards, OTP — W8-W14

## Notes

- The reference state service (619 lines, deep coupling to wizards) was NOT verbatim-copied in Wave 4 by design — see wave plan §W4. A staged port across W7-W14 avoids the "big bang" green-then-red cycle on isolated component fixes.
- Build cached 2 of 3 dependency tasks; admin-console itself ran fresh and emitted the two new lazy chunks listed above.
- No host-shell or management-console regression — those projects untouched in this wave.

Wave 4 complete. Advancing to Wave 5.
