# Components — contact-groups (admin-console)

## Tree
```
ContactGroupsComponent                                  (selector: app-contact-groups, list route)
├── <falcon-organization-hierarchy-tree>                  (libs/falcon — tree panel, 30% width)
├── <p-tabs> + <p-tab>                                    (PrimeNG tabs: "Contact Groups" / "Shared Groups")
└── <falcon-table>                                        (libs/falcon — single table, switches rows + columns by activeTab)
    ├── ng-template #sharedWithCol  → <falcon-chip-list>
    ├── ng-template #createdByCol   (two-line name + username)
    ├── ng-template #creationDateCol (two-line date + time)
    └── ng-template #statusCol      (colored span)

ContactGroupDetailsComponent                            (selector: app-contact-group-details, /:groupId route)
├── <p-toast>                                             (PrimeNG toast for save success/error)
├── <falcon-organization-hierarchy-tree>                  (tree, 30%)
├── Brand header: back button + selectedNodeIconUrl / <falcon-icon icon="buildings"> + selectedNodeLabel
├── Edit / Save+Cancel pButtons
├── Group Information card                                (8-field grid + sharedWith chip-list)
│   └── <falcon-multiselect>                              (edit-mode share picker, lazy + paginated)
├── Section header + 2× Download pButton (Original / Validated)
└── <falcon-table>                                        (contacts table, dynamic columns from columnDefinitions[])
```

## Per-component

### ContactGroupsComponent
- File: `apps/admin-console/src/app/features/contact-groups/contact-groups.component.ts`
- Selector: `app-contact-groups` (line 48)
- Standalone: `true` (line 49)
- ChangeDetection: default (no explicit `ChangeDetectionStrategy.OnPush`)
- Inputs: none
- Outputs: none
- ViewChild templates (line 74-77): `sharedWithCol`, `createdByCol`, `creationDateCol`, `statusCol` — all `TemplateRef<FalconCellContext<ContactGroupTableRowVm>>` with `static: true`
- Services injected (via `inject()`):
  - `Router` (line 65)
  - `ActivatedRoute` (line 66)
  - `TranslateService` from `@falcon` (line 67)
  - `SessionProvider` from `@falcon` (line 68)
  - `OrgHierarchyApiService` (line 69) — sibling feature
  - `ContactGroupsApiService` (line 70)
  - `AccessControlFacade` from `@falcon` (line 71)
  - `ChangeDetectorRef` (line 72)
- Forms: none (no `@angular/forms` imports beyond `CommonModule`)
- State: mostly class fields + 2 signals (`permissions`, `permissionsReady` lines 97-98) + 1 computed (`isReadOnlyViewer` line 100)
- Lifecycle:
  - `ngOnInit` (line 255): set `isFalcon` from `sessionProvider.session.userType === USER_TYPE_STRINGS.FALCON_USER`, kick `loadPermissions()` + `loadRoot()`
  - `ngAfterViewInit` (line 251): `wireColumnTemplates()` injects 4 ng-template refs into column definitions and calls `cdr.detectChanges()`
- Key methods:
  - `loadPermissions()` (lines 268-294) — batch `accessControlFacade.resolveFlags()` of 9 PES queries (see [[05-PES]]); sets `permissions` signal + `canViewSharedGroups` + flips `permissionsReady`
  - `rowFlagsFor(row)` (line 301) — calls helper `rowFlags(row, session, permissions())` for owner-overlay
  - `loadContactGroups(nodeId)` (lines 341-368) — fetches list page with `LIST_PAGE=1`, `LIST_PAGE_SIZE=100` (hard-coded ceiling because FalconTable paginates client-side)
  - `loadSharedGroups(nodeId)` (lines 370-397) — same shape, calls `contactGroupsApi.getSharedGroups()`; only fired when `activeTab === 'shared'`
  - `onTabChange(tabValue)` (lines 427-436) — lazy-loads shared tab on first activation
  - `onNodeSelect(node)` (lines 440-448) — sets node id, refreshes own list and (if visible) shared list
  - `loadRoot()` (lines 452-539) — fetches root node from `OrgHierarchyApiService.getRootNodes()`, replaces with `FALCON_ROOT_NODE` for Falcon users, then drills children
  - `loadNodeChildren(node)` (lines 555-596) — guarded by `loadedChildrenIds` / `loadingChildrenIds` sets
- Row actions (lines 126-194) — array of `T2RowMenuAction<ContactGroupTableRowVm>`:
  - **Own tab**: More Details / Share / Edit / Delete — each with a `visible` predicate (except More Details) calling `rowFlagsFor(row)`
  - **Shared tab**: More Details only (no Share, Edit, Delete)
  - Action handlers route to `/:groupId` with no query / `mode=edit` / `mode=share` (the detail component currently ignores `mode`)
- Column definitions (lines 196-217) — `contactGroupColumns` and `sharedGroupColumns` are identical in this codebase (both 8 columns: ID, Contacts Name, Reference ID, Created By, Creation Date, Uploaded Contact, Status, Shared With)
- Template highlights:
  - 30/70 split via flex (`.contact-groups-container.flex.h-full`)
  - Empty-state placeholder with `<i class="pi pi-users">` icon when no node selected (lines 65-76 of HTML)
  - Skeleton gate using `@if (isLoadingGroups || (contactGroups.length && !permissionsReady())) { ... } @else { ... }` (Angular v17 control flow, lines 99-136 of HTML)
  - `<p-tabs>` projected into `<falcon-table [titleTemplate]="tabsTitle">` so tabs sit inside the table header
  - Row style `getRowStyleClass` returns `'deleted-row'` when `row.isDeleted`
  - Falcon UI: `<falcon-organization-hierarchy-tree>`, `<falcon-chip-list>`, `<falcon-table>`, `<falcon-icon icon="buildings" [useCssVariable]="true">`
  - PrimeNG: `TabsModule`, `SkeletonModule`

### ContactGroupDetailsComponent
- File: `apps/admin-console/src/app/features/contact-groups/components/contact-group-details/contact-group-details.component.ts`
- Selector: `app-contact-group-details` (line 62)
- Standalone: `true` (line 63)
- ChangeDetection: `ChangeDetectionStrategy.OnPush` (line 80)
- Providers: `[MessageService]` (PrimeNG toast — line 81)
- Inputs/Outputs: none
- Services injected (via `inject()` lines 86-96):
  - `Router`, `ActivatedRoute`
  - `ContactGroupDetailsService`
  - `OrgHierarchyApiService`
  - `TranslateService`, `SessionProvider`, `AccessControlFacade` from `@falcon`
  - `ConfirmationService`, `MessageService` from `primeng/api`
  - `ChangeDetectorRef`, `DestroyRef`
- State:
  - Detail: `detail`, `loading`, `error`, `isFalcon`, `groupId`
  - Permissions: `permissions = signal(...)`, `permissionsReady = signal(false)` (lines 105-106)
  - Contacts table: `contacts[]`, `contactColumns[]`, `contactsLoading`, `contactsTotalCount`
  - Edit mode: `isEditing`, `isSaving`, `editName`, `editReferenceId`, `editSelectedUserIds[]`, `multiselectItems[]`, `loadingUsers`, `allSelected`, `searching`, `hasMore`, `selectAllLoading`, `originalDetail` (clone for cancel)
  - Multiselect paging: `rawUsers[]`, `usersCache: Map<string, SharedUserOption>`, `currentPage`, `totalCount`, `currentSearch`, `loadingMore`, `search$: Subject<string>`, 3 cancellable Subscriptions
  - Downloads: `downloadingValidated`, `downloadingOriginal`
  - Tree: `rootNode`, `selectedNodeId`, `selectedNode`, `loadingRoot`, `loadingChildrenIds`/`loadedChildrenIds`/`expandedKeys`
  - Constants: `PAGE_SIZE = 10`, `SELECT_ALL_PAGE_SIZE = 9999999` (line 58-59)
- Computed getters:
  - `canEdit` (line 166) — `detail?.isCreator === true && permissions().canEdit`. The comment on line 167 reinforces: **Creator-only — BE also enforces**.
  - `canDownloadValidated` (line 183) — requires `isCompleted` AND `files.hasValidated` AND `permissions().canDownloadValidated`
  - `canDownloadOriginal` (line 189) — requires `files.hasOriginal` AND `permissions().canDownloadOriginal`
  - `isProcessing` (line 175) — `status !== Completed`
  - `isCompleted` (line 179) — `status === Completed`
  - `isNameValid` (line 195) — `editName.trim().length > 0`
  - `sharedWithChips` (line 208) — builds `FalconChipItem[]` from `sharePolicy.sharedUsers` OR a single `"All Users"` chip
  - `statusLabel` / `statusClass` — driven by `CONTACT_GROUP_STATUS_I18N` and `CONTACT_GROUP_STATUS_STYLE` maps
  - `normalizedStatus` (line 229) — defaults to `InProgress` when not explicitly Completed
  - `formattedCreationDate` / `formattedDeletionDate` — local `formatDate()` returning `dd/MM/yyyy`
- Lifecycle:
  - `ngOnInit` (line 253): sets `isFalcon`, reads `route.snapshot.paramMap.get('groupId')`, calls `loadRoot()` + `loadDetail(groupId)` + `loadPermissions()`. If no `groupId`, sets `error=true` and `permissionsReady.set(true)`.
  - `ngOnDestroy` (line 291): unsubscribes `initSub`/`searchSub`/`selectAllSub` and completes `search$`.
- Edit flow:
  - `onEdit()` (line 590) — clones `detail` to `originalDetail` (JSON deep clone), populates `editName` / `editReferenceId` / `editSelectedUserIds`, flips `isEditing=true`, calls `loadAvailableUsers()`.
  - `onCancel()` (line 606) — fires `ConfirmationService.confirm(...)` with "Discard changes?"; on accept restores `detail` from clone and resets state.
  - `onSave()` (line 625) — builds `UpdateContactGroupRequest { groupId, name, referenceId, sharePolicy: null }` and calls `detailService.updateGroup()`. NOTE: `sharePolicy: null` is hard-coded — the multiselect selections are **NOT** sent in this current build (see `selectedUsers` const built on line 628-630 but unused). Toast on success/error using i18n keys `contactGroups.detail.messages.updateSuccess` / `updateError`.
- Multiselect (share picker):
  - `loadAvailableUsers()` (line 673) — flips `usersLoaded=false` and sets up the debounced search pipeline
  - `setupSearch()` (line 681) — `search$` → `debounceTime(350)` → `distinctUntilChanged()` → `switchMap` to `detailService.getShareableUsers(term, 1, PAGE_SIZE)`
  - `onFilterChange(filter)` (line 710) — pushes into `search$`
  - `onMultiselectOpen()` (line 717) — lazy-loads users on first panel open; **if** the group is `sharedWithAllUsers` OR `allSelected`, the panel fetches `SELECT_ALL_PAGE_SIZE` (9,999,999) in one shot and pre-selects every user
  - `onScrollEnd()` (line 761) — infinite-scroll: loads next page
  - `onSelectAllRequested()` (line 828) — fetches all users in one mega-page, pre-selects them all
  - `handlePageResult()` (line 789) — de-duplicates by `userId`, merges into `rawUsers` and `usersCache`, recomputes `hasMore`
  - `cleanupSearch()` (line 875) — full reset on leaving edit mode
- Download flow:
  - `onDownloadOriginalFile()` / `onDownloadValidatedFile()` — guarded by `canDownload*` getters
  - `downloadFile(groupId, fileType, loadingFlag)` (line 391) — calls `detailService.getFileDownloadUrl()`, then `triggerDownload(url, fileName)` which creates a hidden `<a download>` element (line 414-424)
- Tree code (lines 440-580) is functionally identical to the list page; `onNodeSelect(node)` navigates back to `..` (the list) — selecting a different node closes the detail page
- Template highlights:
  - 30/70 split (`.cgd-container.flex.h-full`)
  - 4 distinct sections gated by `*ngIf`: Loading skeleton, Error, Detail view, Edit mode
  - Edit-mode form: `pInputText` for `editName` + `editReferenceId` (template-driven `[(ngModel)]`); creationDate is `[disabled]="true"`; sharedWith swaps `<falcon-chip-list>` for `<falcon-multiselect>` with custom `ng-template #itemTemplate`
  - Skeleton uses `<p-skeleton>` directly
  - PrimeNG used: `ButtonModule`, `ToastModule`, `SkeletonModule`, `InputTextModule`
  - Falcon UI used: `FalconIconComponent`, `FalconChipListComponent`, `FalconTableComponent`, `FalconMultiselectComponent`, `OrganizationHierarchyTreeComponent`

## Sub-components defined within this feature
**None.** All UI pieces are either inline templates inside the two host components, or imported from `@falcon` / PrimeNG. The folder structure is:
```
contact-groups/
├── contact-groups.component.{ts,html,scss}
├── models/models.ts
├── services/contact-groups-api.service.ts
└── components/
    └── contact-group-details/
        ├── contact-group-details.component.{ts,html,scss}
        ├── models/models.ts
        └── services/contact-group-details.service.ts
```
