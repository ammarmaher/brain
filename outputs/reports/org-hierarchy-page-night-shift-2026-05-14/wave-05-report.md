# Wave 5 — Host-Shell Menu Integration

**Status:** ✅ GREEN
**Run:** 2026-05-14 (Brain SK Night Shift)
**Project built:** host-shell — exit 0

## Goal
Sidebar shows "Org Hierarchy (Admin)" entry that navigates to `/admin-console/org-hierarchy-page`.

## Files edited (1)

| Path | Diff | Purpose |
|---|---|---|
| `apps/host-shell/src/app/layout/layout.component.ts` | +14 / -0 | 1 new constant + 1 new NavItem entry per Phase 5 §3 (Option B) |

## Diff summary

**Constant added (line ~54):**
```ts
/*** Wave 5 — Org Hierarchy (Admin) new feature at admin-console/org-hierarchy-page slug. ***/
private readonly admin_console_PATH_ORG_HIERARCHY_PAGE = `${APP_ROUTES.admin_console_BASE}/org-hierarchy-page`;
```

**NavItem added inside `createNavItems()` (top of `Account Administration` section, above existing "Organization Hierarchy (New Page)"):**
```ts
{
  label: 'Org Hierarchy (Admin)',
  path: this.admin_console_PATH_ORG_HIERARCHY_PAGE,
  iconClass: FALCON_ICONS.ORGANIZATION,
  section: 'Account Administration',
  scope: AppRouteScope.AdminConsole,
  requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER],
  hidden: isClient,
},
```

## Acceptance criteria

| # | Criterion | Status |
|---|---|:---:|
| 1 | Build green (`nx build host-shell`) | ✅ |
| 2 | Code review pattern match | ✅ — mirrors existing 'Organization Hierarchy (New Page)' entry shape exactly |
| 3 | New item placed above legacy entries | ✅ first in Account Administration section |
| 4 | FalconUser-only visibility | ✅ `requiredUserTypes: [FALCON_USER]`, `hidden: isClient` |
| 5 | Icon = `FALCON_ICONS.ORGANIZATION` | ✅ matches reference convention |

## Verification deferred to Wave 17

The NavItem is only observable in the rendered sidebar after:
1. `npx nx serve host-shell` running on port 4200
2. User logs in at `/#/login` (Claude cannot type password — security policy)
3. Real-mode `buildNavItems()` runs against the session userType=1 (FalconUser)
4. `RouteAccessService.getSafeLink()` computes `safePath`

Per `<when_to_verify>`: skipping `preview_start` — preview cannot exercise authenticated routing without login. Visual confirmation happens in Wave 17 alongside the rest of the live-parity sweep.

## Pre-existing warnings (NOT introduced)

Build emitted 3 TypeScript "unused file" warnings in `falcon-ui-showcase/`:
- `gallery/showcase-falcon-host.directive.ts`
- `gallery/showcase-tabs-row.component.ts`
- `showcase-data/md-to-html.ts`

These are unrelated to Wave 5 (showcase feature) and pre-date this work. Standing exemption per `feedback_build_must_be_green.md` — only errors block; known warnings allowed.

## What's left for later waves

- ⏳ Lint gate — running in parallel
- ⏳ Live sidebar test — Wave 17
- ⏳ Real route lands content — Waves 7-15

Wave 5 complete. Build hash retained from cached prior build (only host-shell project re-emitted; admin-console + libs cached).
