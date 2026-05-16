# Cross-page dependencies — contact-groups (admin-console)

## Inbound (this feature depends on)

### From sibling features in admin-console
- `OrgHierarchyApiService` — `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts`
  - Both `ContactGroupsComponent` and `ContactGroupDetailsComponent` inject this for `getRootNodes()` and `getChildren(parentId)`.
- `OrgHierarchyNode` (interface) — `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts`
- `mapOrgNodeToTreeNode()`, `updateTreeNodeChildren()` — `apps/admin-console/src/app/features/organization-hierarchy/utils/org-hierarchy.mapper.ts`

### From `@falcon` (libs/falcon)
- Core services & guards:
  - `AccessControlFacade` — `libs/falcon/src/core/lib/access-control/access-control.facade.ts`
  - `SessionProvider` — `libs/falcon/src/core/lib/services/session-provider.service.ts`
  - `TranslateService`, `TranslatePipe`
  - `HttpService` (used inside the two API services)
  - `useGateway()` HTTP option
  - `adminConsoleGuard` (route-level, applied via `app.routes.ts`)
  - `shellAccessGuard` (route-level, applied via `features/routes.ts` — no-op without `data.access`)
- Constants & registries:
  - `FalconAccess` (the PES registry, lines 13-25 declare both `contactGroups` and `contactGroup` namespaces — see [[05-PES]])
  - `USER_TYPE_STRINGS` / `FALCON_ROOT_NODE` — used to detect Falcon admin users + synthesise a virtual root node
  - `UserStatus`, `UserRoles` — enums for the identity picker filter
- Shared types:
  - `ContactGroupListItemDto`, `SharePolicyDto`, `ContactGroupSharedUserDto`, `PagedResult<T>`, `ContactGroupTableRowVm`, `GetContactGroupsRequestParams`, `ContactGroupStatus`, `CONTACT_GROUP_STATUS_LABELS`, `normalizeContactGroupStatus` — `libs/falcon/src/shared-types/lib/models/contact-group.models.ts`
  - `ServiceOperationResult<T>` — generic API envelope (re-exported via `@falcon`)
  - `UserSession` — used by `rowFlags()` for ownership check
- Shared utils:
  - `mapContactGroupsResponseToTableRows()` — DTO → row VM mapper (`libs/falcon/src/shared-utils/lib/utils/contact-group.mapper.ts`)
- Shared UI components:
  - `<falcon-organization-hierarchy-tree>` (`OrganizationHierarchyTreeComponent`) — the tree panel on both pages
  - `<falcon-table>` (`FalconTableComponent`) + its types `T2TableColumn<T>`, `T2RowMenuAction<T>`, `FalconCellContext<T>`
  - `<falcon-chip-list>` (`FalconChipListComponent`) + `FalconChipItem`
  - `<falcon-icon>` (`FalconIconComponent`)
  - `<falcon-multiselect>` (`FalconMultiselectComponent`) + `FalconMultiselectItem`

### From PrimeNG
- `primeng/api`: `TreeNode`, `ConfirmationService`, `MessageService`
- `primeng/tabs`: `TabsModule` (used on the list page)
- `primeng/skeleton`: `SkeletonModule`
- `primeng/button`: `ButtonModule`
- `primeng/toast`: `ToastModule`
- `primeng/inputtext`: `InputTextModule`

### From the runtime environment
- Route param `groupId`
- Query param `mode` (`'edit'` / `'share'`) — set by list-page navigation calls, but **not consumed** by the detail component in this build.
- Session state read from `SessionProvider`: `userType` (for Falcon detection), `identityUserId` (for ownership check)

## Outbound (other features depend on this)

**None directly.** Neither `ContactGroupsApiService` nor `ContactGroupDetailsService` is consumed outside this feature folder. The shared types live in `libs/falcon` and are consumed by management-console too — but that's a sibling, not a dependent.

Cross-app shared assets that originate elsewhere but are also reused here:
- `libs/falcon/src/shared-types/lib/models/contact-group.models.ts` — DTOs + VM are referenced by both `apps/admin-console/.../contact-groups/` (this) and `apps/management-console/.../contact-groups/` (sibling). [CODE — verified by Grep showing both directories importing the same types.]
- `libs/falcon/src/shared-utils/lib/utils/contact-group.mapper.ts` — same dual-consumer.

## Shared state

### Reads
- `SessionProvider.session.userType` — selects between Falcon root path (`FALCON_ROOT_NODE`) and tenant root path
- `SessionProvider.session.identityUserId` — owner-comparison for row flags

### Writes
- **None.** Neither component writes to any global store. There's no NgRx slice, no provider-level service maintaining cross-page contact-group state, no `BehaviorSubject` exposed via `providedIn: 'root'`.
- Navigation state changes (route segments) are the only "side effects" — see below.

### Communication between list and detail
Purely via the URL. The list navigates to `[row.id]` (relative); the detail reads `route.snapshot.paramMap.get('groupId')`. Going back uses `this.router.navigate(['..'], { relativeTo: this.route })`. There is no in-memory cache shared between the two — both reload from server.

### Communication with the tree
The tree is re-instantiated on each component; `selectedNodeId` is not preserved across the list↔detail boundary. Returning from the detail page will re-fire `loadRoot()` and re-fetch the root + children. [CODE — both components hold their own `rootNode` state and call `loadRoot()` in `ngOnInit`.]

## Navigation entry points

- **From the admin-console menu**: there is no menu wiring file in this feature; the entry is provided by the host-shell sidebar (`apps/host-shell`). [INFERRED — sidebar routes are owned by host-shell; not in this feature's scope to define.]
- **Deep links**:
  - `/admin-console/contact-groups` — list
  - `/admin-console/contact-groups/{groupId}` — detail (view mode by default)
  - `/admin-console/contact-groups/{groupId}?mode=edit` — list-row Edit action navigates here, but **the detail page ignores `mode`** so it opens in view mode and the user must click the in-page Edit button.
  - `/admin-console/contact-groups/{groupId}?mode=share` — same caveat.
- **Programmatic navigations** from the list:
  - `onMoreDetails(row)` → `[row.id]`
  - `onEdit(row)` → `[row.id]` + `{ queryParams: { mode: 'edit' } }`
  - `onShare(row)` → `[row.id]` + `{ queryParams: { mode: 'share' } }`
  - `onDelete(row)` → falls through to `onMoreDetails(row)` (no-op delete; comment notes admin-console handles delete in the detail page — but as noted in [[06-VALIDATIONS]], the detail page has no delete UI either)
- **Programmatic navigations** from the detail:
  - `onBack()` → `..`
  - `onNodeSelect(node)` (selecting a different tree node) → `..` (closes detail)

## Module Federation considerations

The admin-console is a Module Federation **remote** (host is the falcon-web-platform-ui host-shell). The `app.routes.ts:18` line exports `routes = appRoutes` because the host's `remote-route.service.ts` uses `findRoutes` to discover remote routes. [CODE comment]

Implication for the new theme/UI: any rebuild must preserve the `export const routes` symbol so the host's remote-route discovery continues to work.

## Hidden gotcha — System Gateway path rewrite

Both API services pass `useGateway()` and hit `contactgroup/contact-groups/...`. The System Gateway strips `contactgroup/` and prepends `/api/`. This is documented inline in `contact-groups-api.service.ts:30-32` [CODE]. The new build must keep using the `contactgroup/` prefix unless the System Gateway YARP config changes.

## Total inbound deps
- **4 sibling features (organization-hierarchy)** — service + models + mapper utils + node type
- **20+ symbols from `@falcon`** — broken down above
- **6 PrimeNG modules**
- **0 outbound services**
