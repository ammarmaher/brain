# Routing — contact-groups (admin-console)

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `/admin-console/contact-groups` | `ContactGroupsComponent` | yes (`loadComponent`) | `adminConsoleGuard` (app-level), `shellAccessGuard` (route-level) | none | none |
| `/admin-console/contact-groups/:groupId` | `ContactGroupDetailsComponent` | yes (`loadComponent`) | `adminConsoleGuard` (app-level), `shellAccessGuard` (route-level) | none | `groupId` (route param); reads `mode` query-param (`'edit'` / `'share'`) at the navigation site, but the detail component itself does NOT consume `mode` — it always opens in view mode and the in-page Edit button drives `isEditing` |

Routes file: `apps/admin-console/src/app/features/routes.ts:77-95` [CODE]

```ts
{
  path: 'contact-groups',
  canActivate: [shellAccessGuard],
  loadComponent: () =>
    import('./contact-groups/contact-groups.component')
      .then(m => m.ContactGroupsComponent),
  data: { breadcrumb: 'Contact Groups' },
},
{
  path: 'contact-groups/:groupId',
  canActivate: [shellAccessGuard],
  loadComponent: () =>
    import('./contact-groups/components/contact-group-details/contact-group-details.component')
      .then(m => m.ContactGroupDetailsComponent),
  data: { breadcrumb: 'Contact Group Details' },
},
```

## App-level wrapper
`apps/admin-console/src/app/app.routes.ts:6-13` [CODE]
```ts
export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [adminConsoleGuard],   // every admin-console route
    children: [ ...accountAdministrationRoutes ],
  },
  { path: '**', redirectTo: '' },
];
```

## Note: NO route `data.access` configured
Both contact-groups routes declare `canActivate: [shellAccessGuard]` but they do NOT define `data.access`. Per `shellAccessGuard` source, when no `access` is provided the guard short-circuits with `return true` (see `evaluateQueries()` line 85: `if (!queries.length) return true;`). The effective gate for the page is therefore:

1. **App-level**: `adminConsoleGuard` ensures the user can `view app.admin-console` (otherwise redirect to `UNAUTHORIZED`).
2. **Page-level**: nothing — page permissions are enforced inside the components by `AccessControlFacade.resolveFlags()` against `FalconAccess.contactGroup.view('sys')` and friends. (See [[05-PES]].)

This is the documented "defense in depth" pattern — see the comment on `adminConsoleGuard:9-12` [CODE].

## Guard implementations

### `adminConsoleGuard` (app-level)
File: `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27` [CODE]
```ts
export const adminConsoleGuard: CanActivateFn = async () => {
  const facade = inject(AccessControlFacade);
  const router = inject(Router);
  const query = FalconAccess.adminConsole.enter();   // {action:'view', resource:'app.admin-console'}
  try {
    await facade.ensure(query);
    return facade.can(query) ? true : router.createUrlTree([APP_ROUTES.UNAUTHORIZED]);
  } catch {
    return router.createUrlTree([APP_ROUTES.ERROR]);
  }
};
```

### `shellAccessGuard` (per-route, no-op here)
File: `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-52` [CODE]
```ts
export const shellAccessGuard: CanActivateFn = async (route) => {
  const queries = resolveActivateQueries(route);
  return evaluateQueries(queries);
};
```
The guard reads `route.data['access']`. Because both contact-groups routes omit `data.access`, `queries` is `[]` and `evaluateQueries` returns `true` immediately (line 85). [INFERRED — call chain follows directly from the code.]

## Resolver implementations
None — neither route declares a resolver. The list component calls `loadRoot()` and `loadContactGroups()` in `ngOnInit`; the detail component reads `route.snapshot.paramMap.get('groupId')` and calls `loadDetail()` itself.
