---
type: feature-compare
feature: contact-groups
purpose: "Answers 'why is contact-groups admin-side read-only while mgmt-side has full CRUD' + which scope-aware PES keys gate each role. Open before porting/modifying any contact-group flow."
admin-side-app: admin-console
admin-side-route: /admin-console/contact-groups
admin-side-gateway: SystemGateway
mgmt-side-app: management-console
mgmt-side-route: /management-console/contact-groups
mgmt-side-gateway: CoreGateway
falcon-only: false
client-only: false
shared: true
pes-keys-admin:
  - contactGroup.view('sys')
  - contactGroup.create('sys')
  - contactGroup.edit('sys')
  - contactGroup.share('sys')
  - contactGroup.shareOther('sys')
  - contactGroup.delete('sys')
  - contactGroup.downloadValidated('sys')
  - contactGroup.downloadOriginal('sys')
  - contactGroups.viewShared
pes-keys-mgmt:
  - contactGroup.view('acc')
  - contactGroup.create('acc')
  - contactGroup.edit('acc')
  - contactGroup.share('acc')
  - contactGroup.shareOther('acc')
  - contactGroup.delete('acc')
  - contactGroup.downloadValidated('acc')
  - contactGroup.downloadOriginal('acc')
  - contactGroups.viewShared
extracted: 2026-05-16
---

# Feature · `contact-groups` — Falcon vs Client

> [!tldr]
> The **only feature in the platform whose PES namespace is shared via a scope arg** — `FalconAccess.contactGroup.<action>(scope: 'sys' | 'acc')`. Same TypeScript factory produces `sys.contact-group / *` keys for admin-console callers and `acc.contact-group / *` keys for mgmt-console callers. Authority asymmetry is the headline: **admin-side is read-only** (Falcon staff can browse, share, and download but cannot **create / edit / delete** any contact group — those `sys.contact-group.*` rules are explicit `deny`). Mgmt-side has the full **5-step create wizard**, in-place edit, and delete. Both sides honour the per-action expression `"r.obj.createdby" == "r.sub.userid"` so non-owners cannot edit / delete a group they didn't author.

## At a glance

| Falcon (admin-console) | Client (management-console) | Notes |
|---|---|---|
| Route: `/admin-console/contact-groups` + `/admin-console/contact-groups/:groupId` (flat, two top-level routes) | Route: `/management-console/contact-groups/{'', 'create', ':groupId'}` (nested router-outlet, 3 children share a tree-panel parent shell) | [BRAIN-OUT] `contact-groups.diff.md:7-13` |
| Gateway: `SystemGateway` (`:7256`) | Gateway: `CoreGateway` (`:7038`) | Both proxy to **Falcon Core Contact Group Service** (`falcon-core-contact-group-svc`) under `contactgroup/contact-groups/*` → upstream `/api/contact-groups/*` |
| **Read + share + download only** — NO create UI, NO upload wizard, NO file pipeline | **Full CRUD** — 5-step create wizard (upload-group-details → preview-configure → review-create → share-group), in-place edit + share | [BRAIN-OUT] `contact-groups.diff.md:11, 36-53` |
| 2 components: `ContactGroupsComponent` (list) + `ContactGroupDetailsComponent` (detail w/ edit) | 7+ components: parent shell, list, create wizard (4 steps), details, share dialog | [BRAIN-OUT] `contact-groups.diff.md:19-25` |
| 2 services, 6 endpoints | 13+ endpoints incl. upload-config / init / S3-PUT / complete / preview / create / share-policy / delete | [BRAIN-OUT] `contact-groups.diff.md:35-53` |
| PES namespace: `FalconAccess.contactGroup.*('sys')` | PES namespace: `FalconAccess.contactGroup.*('acc')` | **Shared registry**; scope arg switches the resource prefix |
| 9 PES queries via `resolveFlags(...)` | Same 9 queries — same module namespace | [CODE] `contact-groups.component.ts:268-294`; [BRAIN-OUT] `contact-groups.diff.md:82-88` |
| Tree panel (`<falcon-organization-hierarchy-tree>`, 30%) drives `NodeId` query param | Same tree panel, same `NodeId` scoping | [CODE] `contact-groups.component.ts:341-368` |
| Detail edit: `sharePolicy: null` hard-coded — selections **NOT sent** in admin build (open bug) | Detail edit: full `sharePolicy` update via `PATCH /api/contact-groups/{id}/share-policy` | [CODE] `contact-group-details.component.ts:625-640`; [BRAIN-OUT] `contact-groups.diff.md:49` |

## Per-role capability

| Role | Land on page | View tab | Shared tab (`view-shared`) | Create | Edit | Delete | Share | `share-other` | Download | Download-original |
|---|---|---|---|---|---|---|---|---|---|---|
| **sys-admin** | ✅ admin-console | ✅ `sys.contact-group / view` allow | (factory always returns `acc.contact-group / view-shared` — no rule on sys side → silent deny) | ❌ `sys.contact-group / create` deny | ❌ `sys.contact-group / edit` deny | ❌ `sys.contact-group / delete` deny | ❌ `sys.contact-group / share` deny | ❌ no seed rule | ✅ `sys.contact-group / download` allow | ✅ `sys.contact-group / download-original` allow |
| **sys-ops** | ✅ admin-console | ✅ | (silent deny) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **sys-products** | ✅ admin-console | ✅ | (silent deny) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **acc-owner** | ✅ management-console | ✅ `acc.contact-group / view` allow | (no rule — silent deny) | ✅ `acc.contact-group / create` allow | ✅ **expr** `r.obj.createdby == r.sub.userid` (own-only) | ✅ **expr** own-only | ✅ allow (un-expressioned) | (no seed rule) | ✅ | ✅ |
| **acc-admin** | ✅ management-console | ✅ | (silent deny) | ✅ | ✅ expr own-only | ✅ expr own-only | ✅ allow | (no seed rule) | ✅ | ✅ |
| **acc-user** | ✅ management-console (contact-groups-only console view) | ✅ | ✅ **`acc.contact-group / view-shared` allow — UNIQUE to acc-user** | ✅ | ✅ expr own-only | ✅ expr own-only | ✅ **expr own-only** (tighter than acc-owner / acc-admin) | (no seed rule) | ✅ | ✅ |

> [!warning]
> **Critical authority asymmetry**: every `sys-*` role gets **deny** on `create / edit / delete / share / share-other`. Falcon staff are **read-only** on tenant contact groups — by design, because contact groups are tenant-owned business data. The admin-console UI mirrors this by **not exposing a create-page route** at all. See [BRAIN-OUT] `contact-groups.diff.md:11`.

> [!note]
> The expression `"r.obj.createdby" == "r.sub.userid"` is enforced at the PES layer for `edit` / `delete` on `acc-*` roles. Frontend complements it with an explicit `isOwner` overlay using `session.identityUserId === row.createdByUserId` (NOT `session.subjectId`, which is the Zitadel `sub` claim). See [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md` and [CODE] `apps/admin-console/.../contact-groups/models/models.ts:42-45` for the explicit "NEVER compare with session.subjectId" banner.

## PES keys consumed

### Shared via scope arg (the unique pattern)

Factory: `FalconAccess.contactGroup.<action>(scope: 'sys' | 'acc')` produces `{ action, resource: \`${scope}.contact-group\` }`. [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:13-25, 162-171`.

```typescript
contactGroup: {
  view:              (scope) => contactGroupQuery('view', scope),
  create:            (scope) => contactGroupQuery('create', scope),
  edit:              (scope) => contactGroupQuery('edit', scope),
  share:             (scope) => contactGroupQuery('share', scope),
  shareOther:        (scope) => contactGroupQuery('share-other', scope),
  delete:            (scope) => contactGroupQuery('delete', scope),
  downloadValidated: (scope) => contactGroupQuery('download', scope),
  downloadOriginal:  (scope) => contactGroupQuery('download-original', scope),
}
```

The factory adds `ignoreExpression: true` to each query — the **expression `r.obj.createdby == r.sub.userid` is evaluated by the backend / facade**, not by the FE permission resolver. So `resolveFlags(...)` returns `true` for `canEdit` even when the user isn't the creator; the FE then overlays its own `isOwner` check via `rowFlagsFor(row)`.

### Admin side (admin-console passes `'sys'`)

All 9 batch-resolved in a single call. [CODE] `contact-groups.component.ts:268-294`.

| Key | Resource | Action | Where checked |
|---|---|---|---|
| `FalconAccess.contactGroup.view('sys')` | `sys.contact-group` | `view` | List page batch | [CODE] `contact-groups.component.ts:270` |
| `FalconAccess.contactGroup.create('sys')` | `sys.contact-group` | `create` | List page batch (always denies for sys-*) | [CODE] `:271` |
| `FalconAccess.contactGroup.edit('sys')` | `sys.contact-group` | `edit` | List + per-row + detail `canEdit` | [CODE] `:272`, `models.ts:55`, `contact-group-details.component.ts:166-169` |
| `FalconAccess.contactGroup.share('sys')` | `sys.contact-group` | `share` | List batch + per-row | [CODE] `:273`, `models.ts:57` |
| `FalconAccess.contactGroup.shareOther('sys')` | `sys.contact-group` | `share-other` | Per-row Share overlay (share groups owned by others) | [CODE] `:274` |
| `FalconAccess.contactGroup.delete('sys')` | `sys.contact-group` | `delete` | List + per-row | [CODE] `:275`, `models.ts:56` |
| `FalconAccess.contactGroup.downloadValidated('sys')` | `sys.contact-group` | `download` | List + detail `canDownloadValidated` | [CODE] `:276`, `contact-group-details.component.ts:183-187` |
| `FalconAccess.contactGroup.downloadOriginal('sys')` | `sys.contact-group` | `download-original` | List + detail `canDownloadOriginal` | [CODE] `:277`, `contact-group-details.component.ts:189-192` |
| `FalconAccess.contactGroups.viewShared()` | `acc.contact-group` | `view-shared` | Controls visibility of the "Shared Groups" tab — **note the hard-coded `acc.*` resource** | [CODE] `:278`; registry `falcon-access.registry.ts:13-25` |

### Mgmt side (management-console passes `'acc'`)

Same 9 keys. The only difference is the scope arg → resource prefix `acc.contact-group` instead of `sys.contact-group`. Both consoles use the same factory file.

> [!note]
> **`contactGroups.viewShared()` always returns `resource: 'acc.contact-group'` — even when called from admin-console.** This is the literal registry definition. Whether the backend honours an `acc.*` resource for `sys.*` callers is a backend policy decision; the seed catalog has **no rule for this resource on any sys-* role**, so the call returns false silently on admin-side (Falcon staff don't see a Shared tab). [CODE] `falcon-access.registry.ts:13-15`; [BRAIN-OUT] `contact-groups.05-PES.md:50-51`.

## Differences

### Routing
- **Admin**: 2 flat top-level routes (`contact-groups` + `contact-groups/:groupId`) under `loadComponent` lazy loader; both declare `canActivate: [shellAccessGuard]` but omit `data.access`, so the guard short-circuits to `true`. Real gating happens inside the components. [CODE] `apps/admin-console/src/app/features/routes.ts:77-95`.
- **Mgmt**: parent `ContactGroupsComponent` (tree + outlet shell) with **3 nested children**: `''` (list), `'create'` (5-step wizard), `':groupId'` (detail). The parent route owns the `<falcon-organization-hierarchy-tree>` so it persists across child navigation. [BRAIN-OUT] `contact-groups.diff.md:7-13`.
- **`?mode=edit` / `?mode=share` query params** are emitted by the list page on row-action navigation but the detail component **ignores them** — detail always opens in view mode; user clicks the in-page Edit button to toggle. Same caveat both sides. [BRAIN-OUT] `contact-groups.01-ROUTING.md:7`; [CODE] `contact-group-details.component.ts:253-265`.

### Component
- **Admin** = 2 components (list + detail). No create wizard.
- **Mgmt** = parent shell + list + create wizard with **5 step components** (`UploadGroupDetailsStepComponent`, `PreviewConfigureStepComponent`, `ReviewCreateStepComponent`, `ShareGroupStepComponent`) + 4 matching services + detail + share dialog.
- **Shared types** come from `libs/falcon/src/shared-types/lib/models/contact-group.models.ts` (`ContactGroupListItemDto`, `ContactGroupTableRowVm`, `PagedResult<T>`, `ContactGroupStatus`, `SharePolicyDto`, etc.) — consumed by both apps. [BRAIN-OUT] `contact-groups.diff.md:79`.
- **Shared mapper** `mapContactGroupsResponseToTableRows()` lives at `libs/falcon/src/shared-utils/lib/utils/contact-group.mapper.ts`. [BRAIN-OUT] `contact-groups.07-CROSS-PAGE.md:29`.
- **Shared row-overlay helper** `rowFlags(row, session, flags)` is the same logic both sides — overlays ownership (`session.identityUserId === row.createdByUserId`) onto PBAC flags. [BRAIN-OUT] `contact-groups.diff.md:90-91`.
- **Mgmt-only**: `ContactGroupsStateService` (signals for selectedNode, uploadConfig, pendingSuccessMessage) provided at parent-component level so multi-tab navigation doesn't bleed state. Admin has no equivalent. [BRAIN-OUT] `contact-groups.diff.md:93-96`.

### Service / API
- **Admin uses 2 services + 6 endpoints**: `ContactGroupsApiService` (list, shared-list) + `ContactGroupDetailsService` (detail, contacts, file-download, update, shareable-users). [BRAIN-OUT] `contact-groups.03-SERVICES-APIS.md:1-30`.
- **Mgmt adds the create-upload pipeline**: `upload-config`, `uploads/init` (S3 pre-signed URL), `uploads/{uploadId}/complete`, `uploads/{uploadId}/preview`, `POST contact-groups`, `PATCH contact-groups/{id}/share-policy`, `DELETE contact-groups/{id}` — about **7 additional endpoints**. [BRAIN-OUT] `contact-groups.diff.md:36-53`.
- **Identity user-picker** (`GET identity/user?Status=2&Status=3&Status=4&Role=6&...`) — same call on both sides; routes through the same gateway and lands on `falcon-core-identity-svc`. Status filter includes `Active=2, Suspended=3, Locked=4` and `Role=NormalUser=6` (already-shared users may be in any of those states). [BRAIN-OUT] `contact-groups.03-SERVICES-APIS.md:25-27`.
- **Open bug on admin side**: `onSave()` hard-codes `sharePolicy: null` in the `UpdateContactGroupRequest`, so the multiselect user changes are **silently discarded** — even though the multiselect UI is wired up. [CODE] `contact-group-details.component.ts:625-640`; [BRAIN-OUT] `contact-groups.02-COMPONENTS.md:112`.

### DTOs
- **Shared** (both apps): `ContactGroupListItemDto`, `ContactGroupTableRowVm`, `PagedResult<T>`, `ContactGroupStatus` (`Created=1, InProgress=2, Completed=3, Failed=4`), `GetContactGroupsRequestParams`, `CONTACT_GROUP_STATUS_LABELS`, `normalizeContactGroupStatus`, `SharePolicyDto`, `ContactGroupSharedUserDto`. [CODE] `libs/falcon/src/shared-types/lib/models/contact-group.models.ts`.
- **Admin-only locals**: `ContactGroupPermissionFlags`, `RowActionFlags`, `rowFlags()` helper. [CODE] `apps/admin-console/.../contact-groups/models/models.ts`.
- **Mgmt-only**: `InitUploadSessionRequest/Response`, `UploadConfigResponse`, `CompleteUploadResponse`, `UploadPreviewResponse`, `CreateContactGroupRequest/Response`, `ShareGroupRequest`, `ShareableUser`, `SharedUserOption`, `ContactGroupContactItem`, `ContactGroupFileDownloadDto`, `ContactGroupFileType` (Original=0, Validated=1, ErrorReport=2), `UpdateContactGroupRequest`. [BRAIN-OUT] `contact-groups.diff.md:69-79`.

### Gateway
- **Admin → SystemGateway → Falcon Core Contact Group Service.** Gateway strips `/contactgroup` and prepends `/api` → upstream hit is `GET /api/contact-groups`. [CODE comment in `contact-groups-api.service.ts:30-32`] inline-documents this rewrite.
- **Mgmt → CoreGateway → Falcon Core Contact Group Service.** Same upstream API, different external host. [BRAIN-OUT] `contact-groups.diff.md:62-66`.
- **Identity calls** (`identity/user`) → both sides route through their respective gateway → land on `falcon-core-identity-svc`. [BRAIN-OUT] `contact-groups.03-SERVICES-APIS.md:48-49`.

## What changes when copying admin → mgmt

> [!note]
> Direction is unusual here: admin-side is the **subset**. Going admin → mgmt means **adding** the create wizard and related infrastructure, not stripping. The reverse (mgmt → admin) is the common direction: drop the create wizard, leave list + detail + downloads + share-other gating.

When porting **admin-console → mgmt-console** (adding wizard):
- [ ] Convert flat 2-route structure to nested 3-child structure under a parent shell that owns the tree-panel.
- [ ] Add `CreateContactGroupComponent` + 4 step components (`UploadGroupDetailsStepComponent`, `PreviewConfigureStepComponent`, `ReviewCreateStepComponent`, `ShareGroupStepComponent`).
- [ ] Add per-step services (`UploadGroupDetailsService`, `PreviewConfigureService`, `ReviewCreateService`, `ShareGroupService`) + 7 new endpoints (upload-config / init / S3-PUT external / complete / preview / create / share-policy / delete).
- [ ] Add `ContactGroupsStateService` (signals provided at parent-component level for multi-tab isolation).
- [ ] Switch PES scope arg in every `FalconAccess.contactGroup.<action>(...)` call from `'sys'` to `'acc'`.
- [ ] Replace `Gateway.SystemGateway` with `Gateway.CoreGateway` in `app.config.ts`.
- [ ] Honour expression-gated permissions: `edit` and `delete` only on own groups (`row.createdByUserId === session.identityUserId`). Frontend overlay already lives in `rowFlags()` — shared logic.
- [ ] Honour acc-user's narrower scope: `share` is `expression`-restricted to own-only, and acc-user is the ONLY role with `view-shared` (the "Shared Groups" tab).
- [ ] Fix the open bug while porting: `onSave()` must include `editSelectedUserIds` in `sharePolicy` rather than hard-coding `null`. [CODE] `contact-group-details.component.ts:625-640`.

When porting **mgmt-console → admin-console** (stripping wizard):
- [ ] Remove `create` child route and `CreateContactGroupComponent` (admin staff can't create contact groups — explicit deny on `sys.contact-group / create`).
- [ ] Remove all 7 wizard-pipeline endpoints from the API service.
- [ ] Switch PES scope arg from `'acc'` to `'sys'`.
- [ ] Replace `Gateway.CoreGateway` with `Gateway.SystemGateway`.
- [ ] Replace tree-panel mounting from "tenant root from session" to "`FALCON_ROOT_NODE` virtual root over `OrgHierarchyApiService.getRootNodes()` → all client tenants".
- [ ] Remove `ContactGroupsStateService` (admin doesn't need cross-tab state).
- [ ] Keep the 9-key batch-resolve pattern (`canView` + `canCreate` (always false on sys) + `canEdit` + `canShare` + `canShareOther` + `canDelete` + `canDownloadValidated` + `canDownloadOriginal` + `canViewSharedGroups`).
- [ ] Accept that the Shared Groups tab will silently never show for sys-* roles (`contactGroups.viewShared()` resolves to `acc.contact-group / view-shared` with no rule for sys-*).

## Cross-references

- Roles: [[../01-roles/sys-admin]] · [[../01-roles/sys-ops]] · [[../01-roles/sys-products]] · [[../01-roles/acc-owner]] · [[../01-roles/acc-admin]] · [[../01-roles/acc-user]]
- PES key universe + factory definition: [[../03-pes-keys/REGISTRY-RAW]] (scope-aware semantics in the `contactGroup` namespace table)
- Old-UI dataset (admin): `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\admin-console\contact-groups\`
- Old-UI dataset (mgmt diff): `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\management-console\_diffs\contact-groups.diff.md`
- Shared row-flag helper: `apps/admin-console/.../contact-groups/models/models.ts:42-60`
- Shared types: `libs/falcon/src/shared-types/lib/models/contact-group.models.ts`
- Identity user filter values: `UserStatus.{Active=2, Suspended=3, Locked=4}` + `UserRoles.NormalUser=6` — same params shape on create-wizard share step and detail share picker
