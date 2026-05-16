# PES — contact-groups (admin-console)

## Permission keys used

| Key path | Action | Resource | Where checked | File:line |
|---|---|---|---|---|
| `FalconAccess.contactGroup.view('sys')` | `view` | `sys.contact-group` | List page — batch resolve via `loadPermissions()` | `contact-groups.component.ts:270` |
| `FalconAccess.contactGroup.create('sys')` | `create` | `sys.contact-group` | List page — batch resolve | `contact-groups.component.ts:271` |
| `FalconAccess.contactGroup.edit('sys')` | `edit` | `sys.contact-group` | List page batch + per-row Edit gate (`canEditRow`) + detail-page `canEdit` getter | `contact-groups.component.ts:272`, `models.ts:55`, `contact-group-details.component.ts:166-169` |
| `FalconAccess.contactGroup.share('sys')` | `share` | `sys.contact-group` | List page batch + per-row Share gate (`canShareRow`) | `contact-groups.component.ts:273`, `models.ts:57` |
| `FalconAccess.contactGroup.shareOther('sys')` | `share-other` | `sys.contact-group` | Per-row Share overlay — allows sharing groups owned by others | `contact-groups.component.ts:274`, `models.ts:57` |
| `FalconAccess.contactGroup.delete('sys')` | `delete` | `sys.contact-group` | List page batch + per-row Delete gate (`canDeleteRow`) | `contact-groups.component.ts:275`, `models.ts:56` |
| `FalconAccess.contactGroup.downloadValidated('sys')` | `download` | `sys.contact-group` | List page batch + detail `canDownloadValidated` | `contact-groups.component.ts:276`, `contact-group-details.component.ts:183-187` |
| `FalconAccess.contactGroup.downloadOriginal('sys')` | `download-original` | `sys.contact-group` | List page batch + detail `canDownloadOriginal` | `contact-groups.component.ts:277`, `contact-group-details.component.ts:189-192` |
| `FalconAccess.contactGroups.viewShared()` | `view-shared` | `acc.contact-group` | List page — controls visibility of the "Shared Groups" tab | `contact-groups.component.ts:278` |

**9 total permission queries.** The list page batches all 9 in a single `AccessControlFacade.resolveFlags(...)` call; the detail page re-resolves 8 of them (everything except `viewShared`).

## Source of factories

File: `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:13-25`
```ts
contactGroups: {
  viewShared: (): AccessQuery => ({ action: 'view-shared', resource: 'acc.contact-group' }),
},
contactGroup: {
  view:              (scope: ContactGroupScope): AccessQuery => contactGroupQuery('view', scope),
  create:            (scope: ContactGroupScope): AccessQuery => contactGroupQuery('create', scope),
  edit:              (scope: ContactGroupScope): AccessQuery => contactGroupQuery('edit', scope),
  share:             (scope: ContactGroupScope): AccessQuery => contactGroupQuery('share', scope),
  shareOther:        (scope: ContactGroupScope): AccessQuery => contactGroupQuery('share-other', scope),
  delete:            (scope: ContactGroupScope): AccessQuery => contactGroupQuery('delete', scope),
  downloadValidated: (scope: ContactGroupScope): AccessQuery => contactGroupQuery('download', scope),
  downloadOriginal:  (scope: ContactGroupScope): AccessQuery => contactGroupQuery('download-original', scope),
},
```

Factory (lines 162-171):
```ts
export type ContactGroupScope = 'sys' | 'acc';
function contactGroupQuery(action: string, scope: ContactGroupScope): AccessQuery {
  return {
    action,
    resource: `${scope}.contact-group`,
    attrs: {},
    ignoreExpression: true,
  };
}
```

The admin-console caller passes `'sys'` for every query (Falcon admin scope). Management-console would pass `'acc'`. Note also that `contactGroups.viewShared()` always returns `resource: 'acc.contact-group'` — **even when called from admin-console**. [CODE — this is the literal definition; whether the backend honours an `acc.*` resource for `sys.*` callers is a backend decision.]

## AccessControlFacade usage

### Batch-resolve pattern (both components)
```ts
// contact-groups.component.ts:268-294
private async loadPermissions(): Promise<void> {
  const flags = await this.accessControlFacade.resolveFlags({
    canView:              FalconAccess.contactGroup.view('sys'),
    canCreate:            FalconAccess.contactGroup.create('sys'),
    canEdit:              FalconAccess.contactGroup.edit('sys'),
    canShare:             FalconAccess.contactGroup.share('sys'),
    canShareOther:        FalconAccess.contactGroup.shareOther('sys'),
    canDelete:            FalconAccess.contactGroup.delete('sys'),
    canDownloadValidated: FalconAccess.contactGroup.downloadValidated('sys'),
    canDownloadOriginal:  FalconAccess.contactGroup.downloadOriginal('sys'),
    canViewSharedGroups:  FalconAccess.contactGroups.viewShared(),
  });

  this.permissions.set({ ...flags });           // sets ContactGroupPermissionFlags (8 bools)
  this.canViewSharedGroups = flags.canViewSharedGroups;
  this.permissionsReady.set(true);              // un-gates the template
}
```

Banner comment (lines 261-267) is explicit:
> Batch-resolve all 8 CG flags + the legacy shared-tab flag. PES outage → empty (all-false) flags; gate closes via `permissionsReady` so skeleton stays visible.

### Computed signal on top of flags
```ts
// contact-groups.component.ts:97-103
permissions = signal<ContactGroupPermissionFlags>(emptyContactGroupPermissionFlags());
permissionsReady = signal(false);

isReadOnlyViewer = computed(() => {
  const f = this.permissions();
  return !f.canCreate && !f.canEdit && !f.canDelete;
});
```

(Currently `isReadOnlyViewer` is declared but not consumed in the template — defensive scaffolding.)

### Per-row owner overlay
```ts
// contact-groups.component.ts:301-303
rowFlagsFor(row: ContactGroupTableRowVm): RowActionFlags {
  return rowFlags(row, this.sessionProvider.session, this.permissions());
}
```
Drives the `visible: (row) => this.rowFlagsFor(row).canShareRow|canEditRow|canDeleteRow` predicates on the row-menu actions (lines 143, 156, 169).

### Detail-page creator guard
```ts
// contact-group-details.component.ts:166-169
get canEdit(): boolean {
  // Creator-only for Edit — BE also enforces; tenant flag alone is insufficient.
  return this.detail?.isCreator === true && this.permissions().canEdit;
}
```
**The tenant `canEdit` flag is necessary but not sufficient** — the user must also be the original creator (per backend `isCreator` boolean on the detail DTO).

## Route guards

### `adminConsoleGuard` (app-level)
- File: `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`
- Query: `FalconAccess.adminConsole.enter()` → `{action:'view', resource:'app.admin-console'}`
- Behaviour: failure → `UNAUTHORIZED` route; exception → `ERROR` route.
- Applied: every admin-console route (via `apps/admin-console/src/app/app.routes.ts:8`).

### `shellAccessGuard` (per-route, no-op on this page)
- File: `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-52`
- The contact-groups routes set `canActivate: [shellAccessGuard]` but **omit** `data.access`. The guard short-circuits with `return true`. (See [[01-ROUTING]] for the call-chain.)
- The page-level enforcement comes from the in-component `loadPermissions()` instead.

## Eligibility / Subscription checks

None on this page. There is no service-subscription gate, no feature flag, no quota check in either component. The only gating is PES via `AccessControlFacade` + the `isCreator` per-detail check.

## PES failure mode

`loadPermissions()` is `async/await` on a `Promise`-returning facade. If the facade throws or rejects, `permissions.set(...)` is never reached, leaving the signal at its initial value `emptyContactGroupPermissionFlags()` (all-false) — see `models.ts:28-39`. The `permissionsReady` flag stays `false`, which **keeps the skeleton visible indefinitely** (the template gate `(contactGroups.length && !permissionsReady())` shows skeleton instead of rows). [INFERRED from code structure — no explicit try/catch wraps the `await`, so an unhandled rejection bubbles out and leaves the signals untouched.]

## How session ownership is decided

```ts
const isOwner = !!session?.identityUserId
  && session.identityUserId === row.createdByUserId;
```
- Uses `UserSession.identityUserId` (from Identity Service) — **NOT** `subjectId` (which is the Zitadel sub claim).
- The banner comment (models.ts:42-45) is explicit: "NEVER compare with `session.subjectId` (Zitadel id space)."
- Memory file `feedback_frontend_auth_identity_service.md` is the broader policy: all identity flows go through Identity Service, never Zitadel directly. [MEMORY]
