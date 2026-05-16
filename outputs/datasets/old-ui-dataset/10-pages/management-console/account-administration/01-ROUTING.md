# Routing — account-administration

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `/management-console/organization-hierarchy` | `OrganizationHierarchyComponent` | No (synchronous component import) | `managementConsoleGuard` (app-level) + `shellAccessGuard` (route-level) | none | none in URL — node selection via history state |

## Route module
- File: `apps/management-console/src/app/features/account-administration/routes.ts:1-16`
- Loader: synchronous `component:` import (NOT `loadComponent`)
- Exposed as: `accountAdministrationRoutes` (re-export named array)

```typescript
import { Routes } from '@angular/router';
import { FalconAccess, shellAccessGuard } from '@falcon';
import { OrganizationHierarchyComponent } from './organization-hierarchy/organization-hierarchy.component';

export const accountAdministrationRoutes: Routes = [
  {
    path: 'organization-hierarchy',
    canActivate: [shellAccessGuard],
    component: OrganizationHierarchyComponent,
    data: {
      breadcrumb: 'Organization Hierarchy',
      access: FalconAccess.managementConsole.accountHierarchy.view(),
    },
  },
];
```

## Guard implementations

### `managementConsoleGuard` (app-level, applied at `app.routes.ts:13`)
- From: `@falcon` library (`libs/falcon/...`)
- Quoted role: protects every route inside management-console
- Always present on the parent — applies to every child route

### `shellAccessGuard` (route-level)
- From: `@falcon`
- Reads `route.data.access` and validates against `AccessControlFacade`
- Redirects to `/unauthorized` (or similar) when permission denied
- `data.access = FalconAccess.managementConsole.accountHierarchy.view()` — guard checks this specific PBAC key

## Resolver implementations
- **None** — Data is loaded reactively inside the component lifecycle (`OrganizationHierarchyComponent.ngOnInit()` → `loadRoot()`).

## Pending navigation state (no params, but rich `history.state`)
- `selectNodeId: string` — auto-select a node on return from `/profile`
- `expandPath: string[]` — keys to auto-expand from root → target

Read at `organization-hierarchy.component.ts:140-150`:
```typescript
const historyState = (window.history.state || {}) as Record<string, unknown>;
this.pendingSelectNodeId = (historyState['selectNodeId'] as string) || null;
this.pendingExpandPath = Array.isArray(historyState['expandPath'])
  ? historyState['expandPath'] as string[]
  : [];
```

## Outbound navigations
| Trigger | Target | Method |
|---|---|---|
| Click user row (`onUserSelected`) | `/profile?nodeId={userId}&orgNodeId={nodeKey}` | `Router.navigate(['/profile'], { queryParams, state })` |
| Click "Add User" toolbar / context menu | `/profile?mode=add-wizard&nodeId={nodeId}&orgNodeId={nodeId}` | `Router.navigate(['/profile'], { queryParams, state })` |

State passed to `/profile`:
```typescript
state: {
  showTree: true,
  expandPath: ['rootKey', 'parentKey', '...', 'targetKey'],
  orgNodeLabel: this.selectedNode?.label,
  orgNodeIconUrl: this.selectedNode?.data?.raw?.url,
  sourceRoute: this.router.url,
}
```
