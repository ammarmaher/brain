# falcon-shared-types — SURFACE (full public API / export inventory)

> Every exported symbol of `@falcon` `shared-types`, source-prefixed. Area barrel: `libs/falcon/src/shared-types/index.ts` (`export *` of all 14 files). Re-exported wholesale by `@falcon`.

---

## 1. Enums — `lib/enums/`

### `globels.ts` (142 ln) — 23 enums (filename is "globels", sic)

| Enum | Members | Source |
|---|---|---|
| `PasswordSecurityLevel` | Normal=1, Advanced=2 | `:1-4` |
| `NodeType` | **Root=1, Main=2, Sub=3** (org hierarchy — distinct from `@falcon/wallet` NodeType) | `:6-10` |
| `ClassificationCategory` | VIP=1, Critical=2, Normal=3 | `:12-16` |
| `ClassificationSubCategory` | Bank=1, Gov=2, SemiGov=3, LargeEnterprise=4, MediumEntity=5, SME=6 | `:18-25` |
| `AuthorityLetterType` | Government=1, Commercial=2, Charity=3 | `:27-31` |
| `Sector` | Government=1, Commercial=2, Charity=3 | `:33-37` |
| `AccountCreationStatus` | Pending=1 … Completed=7 (7 steps) | `:39-47` |
| `ProductSubscriptionStatus` | InActive=1, Paid=2, Active=3, Expired=4, Disabled=5 | `:49-55` |
| `PricingType` | Monthly=1, Yearly=2, OneTimePayment=3 | `:57-61` |
| `ProductType` | CommunicationChannel=1, Service=2, Application=3 | `:63-67` |
| `UserStatus` | Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5 | `:69-75` |
| `UserRoles` | SystemAdministrator=1, Product=2, Operation=3, AccountOwner=4, NodeAdmin=5, NormalUser=6 | `:77-84` |
| `UserType` | Falcon=1, Client=2 | `:86-89` |
| `ChannelStatus` | Active=1, Inactive=2, Expired=3 | `:91-95` |
| `DeliveryMethod` | Email=1, Sms=2, Both=3 | `:97-101` |
| `TabComponentType` | Hierarchy=1, CommChannelsServices=2, AppsServices=3, Settings=4 | `:103-108` |
| `FalconRowAction` | DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5 | `:110-116` |
| `FalconItemStatus` | None=0, InActive=1, Active=2, Expired=3, Disabled=4, **PendingActivation=5, PendingPayment=6** (SA-FIX-FE transitional) | `:118-128` |
| `Gateway` | CoreGateway=1, SystemGateway=2, ChargingGateway=3, IdentityGateway=4 | `:130-135` |
| `FlowStep` | Form='form', Otp='otp', ResetPassword='reset-password' (string enum) | `:137-141` |

### `order-status.enums.ts` (18 ln)

| Enum | Members | Source |
|---|---|---|
| `ProcessState` | Pending=1, Running=2, Completed=3, Failed=4 | `:1-6` |
| `OrderFailureReason` | None=0, InsufficientFunds=1, CommChannelPriorityOrderRequired=2, WalletNotConfigForTheNode=3 | `:8-13` |
| `WalletType` | **SingleWallet=1, MultipleWallets=2** (order-status — distinct from `@falcon/wallet` WalletType, same shape) | `:15-18` |

### `otp.enums.ts` (28 ln)

| Symbol | Definition | Source |
|---|---|---|
| `OtpScreenState` | string enum: Sending/Input/Verifying/Success/Error/Expired | `:5-12` |
| `VerifiableField` | string enum: Email='email', Phone='phone' | `:17-20` |
| `OTP_DEFAULTS` | `{ LENGTH: 6, EXPIRY_SECONDS: 120 } as const` | `:25-28` |

---

## 2. Envelope + view models

### `service-operation-result.model.ts` (9 ln)

| Symbol | Definition | Source |
|---|---|---|
| `ServiceOperationResult<T=any>` | class `{ isSuccessful!: boolean; result!: T; errorCodes: any[]; errorMessages: string[]; errors: string[] }` | `:1-9` |

> `[CODE]` `<T = any>` + `errorCodes: any[]` are eslint-justified (`:1,5`): "backend-mirrored envelope consumed in 60+ files without a type arg" / "heterogeneous numeric+string error codes".

### `models.ts` (48 ln)

| Symbol | Definition | Source |
|---|---|---|
| `NavItem` | `interface { label; path; iconClass; exact?; disabled?; section?; badge? }` | `:1-9` |
| `User` | `interface { name; role; avatar }` | `:11-15` |
| `Breadcrumb` | `interface { label; url }` | `:17-20` |
| `Hook<T=any>` | class `{ value?: T; name? }` — lookup-option wrapper | `:23-26` |
| `GroupHook<T=any>` | class `{ id?: T; name?; parent? }` — grouped option | `:29-33` |
| `LookupValueResponse` | class `{ id?: string; code?: string }` | `:36-39` |
| `AttachmentRequestModel` | class `{ extension?; fileBase64String? }` | `:41-44` |
| `FileUploaderResponse` | class `{ base64?; extension? }` | `:45-48` |

---

## 3. Wire DTOs

### `do-payment.models.ts` (29 ln)

| Symbol | Definition | Source |
|---|---|---|
| `CommChannelPriority` | `{ commChannelPriorityId: number; channelId: string }` | `:6-9` |
| `DoPaymentCommunicationChannelRequest` | `{ accountId; commChannelId; commChannelPriorityIds: CommChannelPriority[] }` | `:11-15` |
| `DoPaymentCommunicationChannelResponse` | `{ orderId: string; status: ProcessState }` | `:17-20` |
| `DoPaymentApplicationRequest` | `{ accountId; applicationId; commChannelPriorityIds }` | `:23-27` |
| `DoPaymentApplicationResponse` | `= DoPaymentCommunicationChannelResponse` (type alias) | `:29` |

### `order-status.models.ts` (7 ln)

| Symbol | Definition | Source |
|---|---|---|
| `GetOrderStatusResponse` | `{ status: ProcessState; failureReason?: OrderFailureReason \| null; walletType: WalletType }` | `:3-7` |

### `communication-channel.models.ts` (10 ln)

| Symbol | Definition | Source |
|---|---|---|
| `VisibleCommunicationChannelResponse` | `{ priorityOrder: number; channelId: string; channelName: string }` (camelCase — fixed the PascalCase wire-mismatch G2) | `:6-10` |

### `org-hierarchy.models.ts` (29 ln)

| Symbol | Definition | Source |
|---|---|---|
| `OrgNodeListItem` | `{ id; name; type?; [key]: unknown }` | `:10-15` |
| `OrgNodeActionType` | `type = 'add-node'\|'edit-node'\|'add-client'\|'add-user'\|'view-details'\|'delete'` | `:20` |
| `OrgNodeAction` | `{ actionId: OrgNodeActionType; nodeKey: string\|null; nodeData?: unknown }` | `:25-29` |

> `OrgHierarchyNode` + `FALCON_ROOT_NODE` are **NOT here** — they live in `lib/models/globals.ts:186-209` (a deliberate dup-export-avoidance, `:1-5`).

### `contact-group.models.ts` (127 ln)

| Symbol | Definition | Source |
|---|---|---|
| `FalconChipItem` | `{ label; value?; styleClass? }` (inlined from removed FalconChipListComponent) | `:2-6` |
| `ContactGroupSharedUserDto` | `{ userId; firstName; lastName; username }` | `:14-19` |
| `SharePolicyDto` | `{ sharedWithAllUsers; sharedUsers? }` | `:25-28` |
| `ContactGroupListItemDto` | `{ id; name; referenceId?; status; createdBy*; createdAt; sharePolicy; uploadedContacts; isDeleted? }` | `:37-54` |
| `PagedResult<T>` | `{ items: T[]; totalCount; pageNumber; pageSize }` | `:59-64` |
| `ContactGroupItemDto` | `@deprecated = ContactGroupListItemDto` | `:69` |
| `ContactGroupListResponseDto` | `@deprecated = PagedResult<ContactGroupListItemDto>` | `:72` |
| `GetContactGroupsRequestParams` | `{ nodeId?; page?; pageSize? }` | `:76-80` |
| `ContactGroupTableRowVm` | `{ id; contactsName; referenceId; createdBy*; creationDate; creationTime; uploadedContacts; status; statusCode; processedRows; totalRows; sharedWith: FalconChipItem[]; isDeleted }` | `:84-103` |
| `ContactGroupStatus` | enum InProgress=1, Completed=2 | `:113-116` |
| `normalizeContactGroupStatus` | `(raw): ContactGroupStatus` — only explicit Completed counts, else InProgress | `:118-122` |
| `CONTACT_GROUP_STATUS_LABELS` | `Record<ContactGroupStatus,string>` = {In Progress, Completed} | `:124-127` |

---

## 4. Enum projections — `lib/models/globals.ts` (210 ln)

**`*I18n` (enum→i18n-key `Record`):** `PasswordSecurityLevelI18n` `:22`, `NodeTypeI18n` `:27`, `ClassificationCategoryI18n` `:33`, `ClassificationSubCategoryI18n` `:39`, `AuthorityLetterTypeI18n` `:48`, `SectorI18n` `:54`, `AccountCreationStatusI18n` `:60`, `ProductSubscriptionStatusI18n` `:70`, `PricingTypeI18n` `:78`, `ProductTypeI18n` `:90`, `UserRolesI18n` `:96`, `UserStatusI18n` `:105`, `UserTypeI18n` `:113`, `ChannelStatusI18n` `:118`, `DeliveryMethodI18n` `:124`, `TabComponentTypeI18n` `:155`.

**`*ToString` (enum→English-label `Record`):** `PricingTypeToString` `:84`, `ChannelStatusToString` `:162`, `UserRolesToString` `:168` (note: NodeAdmin→'Admin', NormalUser→'User').

**Status maps:** `FALCON_STATUS_I18N_KEY: Record<FalconItemStatus,string>` `:130-139`; `FALCON_STATUS_STYLE: Record<FalconItemStatus,{severity:'success'|'warning'|'danger'|'secondary'|'info'}>` `:141-153`.

**Constants:** `LOOKUP_IDS = { Country, City } as const` `:181-184`; `OrgHierarchyNode` interface (`id`/`label`/`tenantId?`/`icon?`/`url?`/`hasChildren`/`children?`/`isRootNode?`/`isMainMenu?`/`isFalconNode?`(@deprecated)/`isFirstLevelChild?`) `:186-198`; `FALCON_ROOT_NODE: OrgHierarchyNode` (synthetic root, id `'FALCON_ROOT_NODE'`) `:199-209`.

---

## 5. Authorization vocabulary — `lib/constants/` + 2 models

### `falcon-access.registry.ts` (264 ln) — the `FalconAccess` PES query registry

`[CODE]` `FalconAccess` `as const` `:3-206` — ~80 factory fns each returning `AccessQuery` (`{action,resource,attrs?,ignoreExpression?}`), grouped:

| Group | Sample factories | Source |
|---|---|---|
| `dashboard` / `authView` / `userProfile` | `view()` → `{view, dashboard}` etc. | `:4-12` |
| `contactGroups` / `contactGroup` | `viewShared()`; `view/create/edit/share/shareOther/delete/downloadValidated/downloadOriginal(scope)` via `contactGroupQuery` (`sys.`/`acc.`, `ignoreExpression:true`) | `:13-25,257-264` |
| `userRole` | `self(targetRoleKey)` → `set-{role}`; `other(current,target)` → `change-{a}-to-{b}` | `:26-35` |
| `userStatus` | `other(current,target)` → `change-{a}-to-{b}` @ `user.status.other` | `:36-41` |
| `user` | `edit(field)`, `editStatus()`, `editRole()`, `editPermissionGroup()`, `verifyEmail()`, `verifyPhone()` @ `user`/`user.role.*` | `:42-52` |
| `managementConsole` | `enter()`, `accountHierarchy.view()`, `account.{view,edit}`, `organization.{view,add}`, `accountUser.add`, `orgUser.add`, `services.{view,payment,disable}`, `accountSettings/orgSettings/users/accountProfile/accountPasswordSecurityLevel/accountAllowedIps/accountQuota/contract`, **`wallet.{view,transfer,transferOwnerOwner,transferMasterOwner,transferOwnerMaster,transferChannelOwner,transferOwnerChannel,transferMasterChannel,transferChannelMaster}`** | `:53-142` |
| `adminConsole` | `enter()`, `accountHierarchy.view()`, `account.add`, `accountProfile.edit`, `rootPasswordSecurityLevel/accountPasswordSecurityLevel/rootAllowedIps/accountAllowedIps/accountQuota`, `services.{payment,editPriceType,editPriceValue,visibility}`, `walletStrategy.{view,edit}`, `masterWallet.view`, `wallet.transfer`, `user.add`, `userPermissionGroup.assign`, `userProfilePicture.upload` | `:143-199` |
| `microApps` | `mount(name)` → `microapp.{normalized-name}` | `:200-205` |

*Private:* `normalizeMicroAppName`, `walletBalanceTransferQuery` (per-pair directional, resource `acc.wallet-balance`, `attrs.{sourcePath,destinationPath}`), `normalizeRoleKey`, `normalizeUserField`, `normalizeUserStatus`, `contactGroupQuery` + `ContactGroupScope` type (`:208-264`).

> `[CODE]` The wallet per-pair directional queries + the acc.wallet-balance resource were "restored 2026-05-29 to match origin/main's mgmt drawer", **verified live vs the PES PolicyRules store** (`:105-141`).

### `role-key.constants.ts` (83 ln)

| Symbol | Definition | Source |
|---|---|---|
| `SYSTEM_USER_ROLES` / `ACCOUNT_USER_ROLES` | `readonly number[]` = [1,2,3] / [4,5,6] | `:2-13` |
| `BUILT_IN_ROLE_KEYS` | `{ system:{sysAdmin:'sys-admin',sysOps:'sys-ops',sysProducts:'sys-products'}, account:{accountOwner:'acc-owner',accountAdmin:'acc-admin',accountUser:'acc-user'} } as const` | `:15-26` |
| `SYSTEM_ROLE_KEYS` / `ACCOUNT_ROLE_KEYS` | `as const` tuples | `:28-38` |
| `SystemRoleKey`/`AccountRoleKey`/`BuiltInRoleKey`/`TargetRoleUserType` | type unions | `:40-44` |
| `IdentityUserRoleContract` | `{ roleKey; targetUserType; tenantId? }` | `:51-55` |
| `BUILT_IN_ROLE_KEY_LABELS` | `Record<BuiltInRoleKey,string>` — **acc-admin→'Account Admin', acc-user→'Account User' (INTENTIONAL FE override vs PES englishName)** | `:68-77` |
| `getRoleDisplayNameFromRoleKey` | `(roleKey): string` → label or `'—'` | `:79-82` |

### `route-scope.constants.ts` (33 ln)

| Symbol | Definition | Source |
|---|---|---|
| `AppRouteScope` | enum AdminConsole='admin-console', ManagementConsole='management-console', AccountAdministration='account-administration', TestDev='' | `:4-9` |
| `APP_ROUTES` | `{ UNAUTHORIZED:'/401', ERROR:'/error', admin_console_BASE, MANAGEMENT_CONSOLE_BASE, ACCOUNT_ADMINISTRATION_BASE } as const` | `:14-20` |
| `isPathInScope` | `(path, scope): boolean` | `:25-29` |
| `USER_TYPE_STRINGS` (re-export) | from `user-type.constants` | `:32` |

### `user-type.constants.ts` (61 ln)

| Symbol | Definition | Source |
|---|---|---|
| `USER_TYPE_STRINGS` | `{ SYSTEM_USER:'1', ACCOUNT_USER:'2', FALCON_USER:'1', CLIENT_USER:'2' } as const` (System/Account primary; Falcon/Client = legacy claim aliases) | `:12-17` |
| `UserTypeString` | `type = typeof USER_TYPE_STRINGS[keyof …]` | `:22` |
| `UserTypeToString` / `StringToUserType` | `Record` maps UserType↔'1'/'2' | `:27-38` |
| `userTypeToString` / `stringToUserType` / `isValidUserTypeString` | converter fns (only '1'/'2' valid) | `:43-60` |

### `access-query.models.ts` (78 ln)

| Symbol | Definition | Source |
|---|---|---|
| `AccessQuery` | `{ action; resource; attrs?; scope?; ignoreExpression? }` | `:1-7` |
| `AccessDecision` | `type = 'allow'\|'deny'\|'unknown'` | `:9` |
| `AccessQueryMap<TKey>` / `AccessFlagMap<TKey>` | `Record<TKey, AccessQuery>` / `Record<TKey, boolean>` | `:10-11` |
| `accessKey` | `(query): string` — stable dedupe key (action\|resource\|scope\|attrs\|ignoreExpr) | `:13-21` |
| `dedupeAccessQueries` | `(queries): AccessQuery[]` — unique by `accessKey` | `:23-38` |
| `resolveAccessQueryAttributes` | `(query): Record<string,unknown>` — `{...scope, ...attrs}` | `:40-45` |
| `stableAccessValue` | `(value): string` — deterministic JSON (sorted keys, Date→ISO) | `:47-49` |

*Private:* `normalizeStableValue` (`:51-78`).

### `policy-subject.models.ts` (142 ln)

| Symbol | Definition | Source |
|---|---|---|
| `POLICY_SUBJECT_CONSTANTS` | `{ USER_PREFIX:'u', ROLE_PREFIX:'r', SYSTEM_NAMESPACE:'system' } as const` | `:3-7` |
| `PolicySubjectKind` / `AuthorizationUserTypeName` | `'u'\|'r'` / `'system'\|'account'` | `:9-13` |
| `PolicySubjectParts` | `{ kind; name; namespace; subject; userType }` | `:15-21` |
| `normalizePolicyLogin` / `normalizePolicyRoleKey` / `normalizePolicyTenantId` | token normalizers (tenant 'system' is reserved → throws) | `:26-41` |
| `buildSystemUserPolicySubject` / `buildAccountUserPolicySubject` / `buildSystemRolePolicySubject` / `buildAccountRolePolicySubject` | build `u:{login}@system` / `u:{login}@{tenant}` / `r:{roleKey}@system` / `r:{roleKey}@{tenant}` | `:43-57` |
| `parsePolicySubject` | `(value): PolicySubjectParts \| null` — strict round-trip parse | `:59-101` |
| `validatePolicySubject` | `(value): PolicySubjectParts` — throws on invalid | `:103-110` |
| `isPolicySubject` | `(value): boolean` | `:112-114` |
| `getAuthorizationUserTypeName` | `(userType): 'system'\|'account'\|null` ('1'→system,'2'→account) | `:116-127` |

*Private:* `normalizePolicyToken` (`:129-142`).

## Export count summary

- **Enums:** 23 (globels) + 3 (order-status) + 2 (otp) + `ContactGroupStatus` = **29 enums** (+ `OTP_DEFAULTS`).
- **Interfaces/types/classes:** `ServiceOperationResult`, `Hook`/`GroupHook`/`LookupValueResponse`/`AttachmentRequestModel`/`FileUploaderResponse`/`NavItem`/`User`/`Breadcrumb` (8) + DTOs (do-payment 4 + order-status 1 + comm-channel 1 + org-hierarchy 3 + contact-group ~9) + `OrgHierarchyNode` + access/policy types (~10) → **~37 interfaces/types/classes**.
- **Enum-projection maps:** 16 `*I18n` + 3 `*ToString` + 2 status maps + `CONTACT_GROUP_STATUS_LABELS` + `BUILT_IN_ROLE_KEY_LABELS` = **~23 record maps**.
- **Constants:** `LOOKUP_IDS`, `FALCON_ROOT_NODE`, `APP_ROUTES`, `USER_TYPE_STRINGS`, `BUILT_IN_ROLE_KEYS`(+role-key tuples), `POLICY_SUBJECT_CONSTANTS`, `OTP_DEFAULTS` → **~10 const objects**.
- **The `FalconAccess` registry:** ~80 query factories (one `as const` object).
- **Helper functions:** ~6 access/dedupe + ~9 policy-subject + ~6 user-type/role + `normalizeContactGroupStatus` + `isPathInScope` → **~23 pure fns**.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Every symbol + line lifted from source; the dual-`NodeType`/dual-`WalletType`, the acc-admin/acc-user display override, the wallet-PES directional restoration, and the `OrgHierarchyNode`-lives-in-globals dup-avoidance all confirmed in code/comments. No source edited.
