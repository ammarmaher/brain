# PES — host-shell core

## Permission keys used (at host-shell scope)

| Key path | Where checked | File:line |
|---|---|---|
| `FalconAccess.managementConsole.enter()` | `SHELL_CORE_ACCESS` token (set when userType=2) | `app.config.ts:77-78` |
| `FalconAccess.adminConsole.enter()` | `SHELL_CORE_ACCESS` token (set for non-Client users) | `app.config.ts:79` |
| `FalconAccess.authView.view()` | route data on `/auth-view` route | `app.routes.ts:36` |
| `FalconAccess.managementConsole.accountHierarchy.view()` | Nav item "Organization Hierarchy" (Client side) | `layout.component.ts:285` |
| `FalconAccess.adminConsole.accountHierarchy.view()` | Nav item "Organization Hierarchy" (Falcon side) | `layout.component.ts:304` |
| `FalconAccess.managementConsole.services.view()` | Nav items "CommChannels & Services .Mng" + "Marketplace .Mng" (Client) | `layout.component.ts:341, 374` |
| `FalconAccess.managementConsole.contract.view()` | Nav item "Contracts & Cost .Mng" (Client) | `layout.component.ts:384` |
| `app.management-console:view` | `canMatch` on dynamic remote route | `module-federation.manifest.json:14` |
| `app.admin-console:view` | `canMatch` on dynamic remote route | `module-federation.manifest.json:53` |
| `microapp.user-settings:view` | `canMatch` on dynamic remote route (dev only) | `module-federation.manifest.json:25` |
| `microapp.survey-container:view` | `canMatch` on dynamic remote route (dev only) | `module-federation.manifest.json:38` |

## AccessControlFacade usage
- Service: `AccessControlFacade` from `@falcon` (`libs/falcon/src/lib/access-control/`).
- Methods used in host-shell: `ensure(queries)`, `can(query)`.
- Pattern (`layout.component.ts:420-440`):
```typescript
const accessQueries = dedupeAccessQueries(this.collectNavAccessQueries(items));
if (!accessQueries.length) return;
try {
  await this.accessControlFacade.ensure(accessQueries);
  accessResolved = true;
} catch { accessResolved = false; }
this.navItems = items.map((item) => this.applyItemAccess(item, accessResolved));
```
Each nav item's `safePath` is set to null when `accessControlFacade.can(query)` returns false, which the sidebar template renders as disabled.

## Route guards (`@falcon`-provided)
- `shellPrimeAccessGuard` (`app.routes.ts:17`) — checks `SHELL_CORE_ACCESS` injection token; redirects to `/401` (UnauthorizedComponent) when denied.
- `shellAccessGuard` (`app.routes.ts:33`) — reads `route.data.access` and gates the route via `accessControlFacade.can(query)`.
- `shellAccessMatchGuard` (dynamic remote routes, via `canMatch`) — gates whole remote module loading. Source: `remote-route.service.ts:149, 203, 234, 265, 297`.

## Eligibility / Subscription checks
- No eligibility/subscription checks at the host level — only PES.
- Nav-item `requiredUserTypes` is a static metadata filter (not a runtime eligibility call): items with `requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER]` are hidden when `session.userType !== '1'`. See `layout.component.ts:303-307`.

## Session-bound routing
- `SHELL_CORE_ACCESS` factory (`app.config.ts:72-81`) reads `SessionProvider.session?.userType` at injection time and provides either Admin Console or Management Console access query.
- userType strings: `'1'` (Falcon user), `'2'` (Client user). Defined in `@falcon` as `USER_TYPE_STRINGS`.

## Inferred mapping
- `[INFERRED]` The `FalconAccess.*` builder is a typed wrapper that produces `AccessQuery` objects (with `action`, `resource`, optional `instance` ID). It is the canonical PES API for host code. Direct `.can('string')` use is rare; structured builders are preferred.
