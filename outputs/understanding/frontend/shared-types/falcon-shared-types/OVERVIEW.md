# falcon-shared-types — OVERVIEW

> Non-component area dossier (SWEEP-SPEC §7 lighter 5-file set: OVERVIEW · SURFACE · USAGE · AUDIT · DECISION). This is `@falcon` `shared-types` — the platform's shared **type vocabulary**: domain enums (+ their i18n/string maps), the `ServiceOperationResult<T>` envelope, wire-DTO interfaces, authorization/PES constants (the `FalconAccess` query registry, role keys, route scopes, user-type strings, policy-subject helpers), and a handful of pure helper functions that live alongside the types they operate on. Not a UI component — mirror falcon-input tone, skip the B (Stencil) and E (cross-framework) rubric dimensions; D (a11y) is N/A.

## Area purpose

The single, dependency-light home for types and constants shared across every app + lib. Four cohabiting concerns:

1. **Domain enums + their projections** (`lib/enums/`, `lib/models/globals.ts` + `models.ts`) — the numeric C#-mirrored enums (`UserStatus`, `UserRoles`, `PricingType`, `ProductSubscriptionStatus`, `FalconItemStatus`, `Gateway`, `NodeType`, …) plus the `*I18n` (enum→i18n-key) and `*ToString` (enum→English-label) record maps, the status-severity style map, and the `LOOKUP_IDS` / `OrgHierarchyNode` / `FALCON_ROOT_NODE` constants.
2. **The response envelope + small VMs** (`service-operation-result.model.ts`, `models.ts`) — `ServiceOperationResult<T>` (the universal backend response shape) + `Hook<T>`/`GroupHook<T>` (lookup-option wrappers) + `NavItem`/`Breadcrumb`/`User` + `LookupValueResponse`/`AttachmentRequestModel`/`FileUploaderResponse`.
3. **Wire DTOs** (`do-payment.models.ts`, `order-status.models.ts`, `communication-channel.models.ts`, `contact-group.models.ts`, `org-hierarchy.models.ts`) — backend-mirrored request/response shapes (camelCase wire contract) consumed by the `shared-data-access` services (L04 sibling) and feature components.
4. **The authorization vocabulary** (`lib/constants/` + `lib/models/{access-query,policy-subject}.models.ts`) — the **`FalconAccess` PES query registry** (the typed catalog of every `{action,resource,attrs?}` access query the FE asks PES), the built-in role-key constants + display-label overrides, the route-scope enum, the user-type string constants (System/Account = 1/2), and the policy-subject parse/build/validate helpers (`u:{login}@{tenant}` / `r:{roleKey}@system`).

`[CODE]` Barrel `libs/falcon/src/shared-types/index.ts:2-18` re-exports all 14 source files (3 enum + 6 model + 4 constant + the org-hierarchy & contact-group models). The whole area is re-exported through `@falcon`.

## Business / UI use case

- **Status badges everywhere** — `FalconItemStatus` + `FALCON_STATUS_I18N_KEY` + `FALCON_STATUS_STYLE` drive every status pill (services, channels, subscriptions) in both consoles; `[CODE]` the status/role/gateway family is referenced in **443 occ / 94 files** (grep 2026-06-03).
- **PES gating is built ON this vocabulary** — `FalconAccess.*` factories produce the `{action,resource}` queries the `@falcon/core` `AccessControlFacade` (L02) sends to PES; e.g. `FalconAccess.user.editStatus()` gates the Edit-User status control, `FalconAccess.managementConsole.wallet.transferOwnerOwner(attrs)` gates the per-pair directional wallet transfer. The registry is the FE half of the role/permission business layer.
- **User-type discrimination** — `USER_TYPE_STRINGS` (System='1'/Account='2', with Falcon/Client aliases) is the JWT `user-type` claim contract; it drives gateway selection (the `RuntimeBaseUrlInterceptor` fallback, L04), guard routing, and the policy-subject namespace.
- **The response envelope** — `ServiceOperationResult<T>` is unwrapped by every API service (**405 occ / 67 files**).
- **Role display** — `BUILT_IN_ROLE_KEY_LABELS` + `getRoleDisplayNameFromRoleKey` render the Users list + org-chart cards, with a **deliberate FE display override** for acc-admin/acc-user (diverging from the backend PES englishName by explicit business decision).
- **Do-payment + order-status flows** — `DoPayment*Request/Response`, `GetOrderStatusResponse`, `VisibleCommunicationChannelResponse`, `ProcessState`, `OrderFailureReason` are the wire DTOs the payment + reorder dialogs use.
- **Contact groups** — `ContactGroup*Dto`/`*Vm`/`ContactGroupStatus` + `normalizeContactGroupStatus` back the contact-group list table.

## When to use it / when NOT to use it

**Use it for:**
- ANY enum/type/constant shared by more than one feature or app → declare it here.
- A PES access query → add a `FalconAccess.*` factory (the registry is the ONLY place FE access queries are minted).
- A backend response → type it as `ServiceOperationResult<YourDto>` and declare `YourDto` here (or in the feature if single-app).
- A status/role/pricing-type label → reuse the `*I18n` / `*ToString` maps; do NOT re-map enum→string in a feature.
- User-type checks → `USER_TYPE_STRINGS` + `stringToUserType`/`isValidUserTypeString`.
- Building/parsing a policy subject → `buildAccountUserPolicySubject` / `parsePolicySubject`.

**Do NOT use it for:**
- Single-app-only DTOs/enums → keep them in the feature folder (e.g. wallet wire DTOs live in `shared-data-access/lib/wallet`, `@falcon/wallet`, NOT here — to avoid the `NodeType`/`WalletType` collision).
- Runtime services / HTTP — this lib is types + pure constants + pure helper fns only (no `@Injectable`, no `HttpClient`).
- The wallet `NodeType` (Organization/Service/User) or `WalletType` — those are the `@falcon/wallet` enums; the `shared-types` `NodeType` is Root/Main/Sub (org hierarchy) and `WalletType` (order-status) is SingleWallet/MultipleWallets. **Two distinct `NodeType`s + two distinct `WalletType`s exist by design** — see AUDIT F-class.

## Status

**ACTIVE / PREFERRED / FOUNDATIONAL.** The lowest dependency-tier shared lib — almost everything imports from it. The PES registry is actively extended (wallet directional queries restored 2026-05-29; Add-User wizard entries added v1.3.0 2026-05-16). One `@deprecated` field (`OrgHierarchyNode.isFalconNode`) + two `@deprecated` contact-group type aliases retained for back-compat.

## Replaces

- `[INFERRED]` Per-feature duplicated enum→label maps — superseded by the centralized `*I18n`/`*ToString` records. (Flagged: not stated verbatim; inferred from the maps' role.)
- `[CODE]` The roleKey-workaround wallet gate — `FalconAccess.managementConsole.wallet.{view,transfer}` "replaces the prior acc-owner-only roleKey workaround" (`falcon-access.registry.ts:105-109`).
- `[CODE]` `FalconChipListComponent`'s chip shape — inlined as `FalconChipItem` after that component was removed (`contact-group.models.ts:1-6`).

## Source file paths

| File | Lines | Purpose |
|---|---|---|
| `libs/falcon/src/shared-types/index.ts` | 19 | Area barrel — all 14 source files (named via `export *`). |
| `lib/enums/globels.ts` | 142 | **23 domain enums** (sic "globels") — `PasswordSecurityLevel`, `NodeType`(Root/Main/Sub), `Classification*`, `AuthorityLetterType`, `Sector`, `AccountCreationStatus`, `ProductSubscriptionStatus`, `PricingType`, `ProductType`, `UserStatus`, `UserRoles`, `UserType`, `ChannelStatus`, `DeliveryMethod`, `TabComponentType`, `FalconRowAction`, `FalconItemStatus`, `Gateway`, `FlowStep`. |
| `lib/enums/order-status.enums.ts` | 18 | `ProcessState`, `OrderFailureReason`, `WalletType`(Single/Multiple). |
| `lib/enums/otp.enums.ts` | 28 | `OtpScreenState`, `VerifiableField`, `OTP_DEFAULTS`. |
| `lib/models/globals.ts` | 210 | The enum-projection maps (`*I18n`, `*ToString`, `FALCON_STATUS_I18N_KEY`, `FALCON_STATUS_STYLE`) + `LOOKUP_IDS` + `OrgHierarchyNode` interface + `FALCON_ROOT_NODE`. |
| `lib/models/models.ts` | 48 | `NavItem`, `User`, `Breadcrumb`, `Hook<T>`, `GroupHook<T>`, `LookupValueResponse`, `AttachmentRequestModel`, `FileUploaderResponse`. |
| `lib/models/service-operation-result.model.ts` | 9 | `ServiceOperationResult<T=any>` — the universal envelope class. |
| `lib/models/do-payment.models.ts` | 29 | `CommChannelPriority`, `DoPaymentCommunicationChannelRequest/Response`, `DoPaymentApplicationRequest/Response`. |
| `lib/models/order-status.models.ts` | 7 | `GetOrderStatusResponse`. |
| `lib/models/communication-channel.models.ts` | 10 | `VisibleCommunicationChannelResponse` (camelCase wire fix — G2). |
| `lib/models/access-query.models.ts` | 78 | `AccessQuery`/`AccessDecision`/`AccessQueryMap`/`AccessFlagMap` + `accessKey`/`dedupeAccessQueries`/`resolveAccessQueryAttributes`/`stableAccessValue` helpers. |
| `lib/models/policy-subject.models.ts` | 142 | `POLICY_SUBJECT_CONSTANTS` + `PolicySubjectParts` + build/parse/validate/normalize policy-subject fns + `getAuthorizationUserTypeName`. |
| `lib/models/org-hierarchy.models.ts` | 29 | `OrgNodeListItem`, `OrgNodeActionType`, `OrgNodeAction` (note: `OrgHierarchyNode` is in `globals.ts`). |
| `lib/models/contact-group.models.ts` | 127 | `FalconChipItem`, `ContactGroup*Dto`, `SharePolicyDto`, `PagedResult<T>`, `ContactGroupTableRowVm`, `ContactGroupStatus` + `normalizeContactGroupStatus` + `CONTACT_GROUP_STATUS_LABELS`. |
| `lib/constants/falcon-access.registry.ts` | 264 | **The `FalconAccess` PES query registry** — ~80 `{action,resource,attrs?}` query factories grouped by surface (dashboard/user/contactGroup/managementConsole/adminConsole/microApps) + normalizers. |
| `lib/constants/role-key.constants.ts` | 83 | `SYSTEM_USER_ROLES`/`ACCOUNT_USER_ROLES`, `BUILT_IN_ROLE_KEYS`, role-key unions/types, `BUILT_IN_ROLE_KEY_LABELS` (+ FE display override), `getRoleDisplayNameFromRoleKey`. |
| `lib/constants/route-scope.constants.ts` | 33 | `AppRouteScope`, `APP_ROUTES`, `isPathInScope` + `USER_TYPE_STRINGS` re-export. |
| `lib/constants/user-type.constants.ts` | 61 | `USER_TYPE_STRINGS` (System/Account=1/2, Falcon/Client aliases) + `UserTypeToString`/`StringToUserType` + `userTypeToString`/`stringToUserType`/`isValidUserTypeString`. |
| `@falcon` re-export | — | `libs/falcon/src/index.ts` (`export * from './shared-types'`). |
| Spec/tests | NONE in lib | No `*.spec.ts` under `shared-types/` (AUDIT F-class). |

## Known consumers (grep verified 2026-06-03)

- `[CODE]` status/role/gateway/PES family (`FalconAccess.`/`FalconItemStatus`/`USER_TYPE_STRINGS`/`BUILT_IN_ROLE_KEYS`/`AppRouteScope`/`Gateway.`/`FALCON_STATUS_*`): **443 occ / 94 files** — guards (`management-console`/`admin-console`/`admin-organization-hierarchy.guard`), `route-access.service`, the org-hierarchy services/signals (admin + mgmt), wallet services + specs, contact-group services/routes, layout/sidebar, `shared-features/{user-details,comm-mkt-view,service-pricing-table}`, the `shared-data-access` services + interceptor.
- `[CODE]` `ServiceOperationResult`: **405 occ / 67 files** (the envelope — see L04 data-access sibling).
- `[CODE]` `Hook`/`LookupValueResponse`: lookup-driven dropdowns across both consoles (org-hierarchy, wizards) + `Helper`/`LookupService` in `shared-data-access`.
- `[CODE]` `OrgHierarchyNode`/`FALCON_ROOT_NODE`: the org-hierarchy tree + `node-scope.util` (`shared-utils`, L03) + layout.
- `[CODE]` `ContactGroup*`: contact-groups feature (admin + mgmt) + `contact-group.mapper` (`shared-utils`).
- `[CODE]` policy-subject helpers: `@falcon/core` access-control (subject building) + auth flows.

See `USAGE.md` Consumer Sweep for the enumerated list.

## Related areas

- `@falcon` **shared-data-access** (L04 sibling) — unwraps `ServiceOperationResult`, consumes `Gateway`, `DoPayment*`, `GetOrderStatusResponse`, `VisibleCommunicationChannelResponse`, `Hook`, `FalconItemStatus`, `USER_TYPE_STRINGS`. Every data-access service imports from here.
- `@falcon` **core** (L02) — `AccessControlFacade`/`CurrentSubjectBuilder` consume `AccessQuery`/`FalconAccess`/policy-subject helpers/`USER_TYPE_STRINGS`; the route guards consume `AppRouteScope`/`FalconAccess`.
- `@falcon` **shared-utils** (L03) — `node-scope.util` imports `FALCON_ROOT_NODE`; `contact-group.mapper` imports `ContactGroup*` + `CONTACT_GROUP_STATUS_LABELS`; validators consume `FalconItemStatus`/`PricingType`/`PasswordSecurityLevel`.
- `@falcon` **language** (L03) — the `*I18n` maps' keys are resolved by `TranslateService`.
- `@falcon/wallet` (`shared-data-access/lib/wallet`) — owns its OWN `NodeType`/`WalletType` (collision-isolated from this lib's).

## Ownership / responsibility

`libs/falcon` (`@falcon`). The enum values + DTO field names are owned jointly with the backend (C# enum mirrors, camelCase wire contract). The PES registry's `{action,resource}` strings are owned jointly with the PES `PolicyRules` store + `BuiltInRoleProvisioner` (comments cite live-PES verification dates).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04 sweep). All 18 source files read in full; barrel covers all 14 (verified); the dual-`NodeType`/dual-`WalletType` design + the acc-admin/acc-user display override + the wallet-PES restoration all traced to source comments; consumer counts grep'd. One `[INFERRED]` flag (Replaces §1). No source edited.
