# falcon-shared-types — USAGE

> Real codebase idioms (cite file:line), recommended new usage, a Do/Don't table, and the grep-verified Consumer Sweep. All examples source-prefixed.

## Recommended new usage

### 1. Minting a PES access query (the ONLY way FE asks PES)

```ts
// Gate a control:
const q = FalconAccess.user.editStatus();                 // {action:'edit-status', resource:'user'}
this.access.can(q).subscribe(allowed => …);

// Per-pair directional wallet transfer (carries owner node paths):
const q = FalconAccess.managementConsole.wallet.transferOwnerOwner({ sourcePath, destinationPath });
```

- `[CODE]` `FalconAccess.*` factories (`falcon-access.registry.ts:3-206`) are the single source of FE access queries. NEVER hand-build `{action,resource}` inline — add a factory here so the catalog stays complete + PES-verifiable. The `@falcon/core` `AccessControlFacade` (L02) consumes these.

### 2. Unwrapping a backend response

```ts
this.http.get<ServiceOperationResult<Thing>>(url, { ...useGateway() })
  .pipe(map(res => res.isSuccessful && res.result ? res.result : fallback));
```

- `[CODE]` `ServiceOperationResult<T>` `service-operation-result.model.ts:1-9` is the universal envelope. Read `errorMessages[0]` (localized) for user-facing errors.

### 3. Status badge from a code

```ts
const key   = FALCON_STATUS_I18N_KEY[status];      // → 'status.active'
const style = FALCON_STATUS_STYLE[status];          // → { severity: 'success' }
```

- `[CODE]` `globals.ts:130-153`. Never re-map a status enum→label/severity in a feature — reuse these. Transitional codes 5/6 (PendingActivation/PendingPayment) are already mapped (SA-FIX-FE).

### 4. Role display label

```ts
getRoleDisplayNameFromRoleKey('acc-admin');   // → 'Account Admin' (FE override, NOT PES 'Node Admin')
```

- `[CODE]` `role-key.constants.ts:68-82`. The acc-admin/acc-user labels DELIBERATELY diverge from the backend PES englishName by business decision (`:57-67`) — do NOT "fix" them back.

### 5. User-type discrimination

```ts
if (userType === USER_TYPE_STRINGS.FALCON_USER) { …System gateway… }   // '1'
const ut = stringToUserType(jwtClaim);                                  // '1'→UserType.Falcon
```

- `[CODE]` `user-type.constants.ts:12-17` — System/Account = 1/2 (Falcon/Client are aliases of the same values). This is the JWT `user-type` claim contract; the `RuntimeBaseUrlInterceptor` (L04) + guards (L02) key off it.

### 6. Building / parsing a policy subject

```ts
buildAccountUserPolicySubject(login, tenantId);   // → 'u:{login}@{tenant}'
parsePolicySubject('r:sys-admin@system');          // → { kind:'r', userType:'system', … } or null
```

- `[CODE]` `policy-subject.models.ts:43-114`. Strict round-trip — `parsePolicySubject` returns `null` unless the value re-normalizes to itself.

### 7. Guarding the synthetic root id on the wire

```ts
import { FALCON_ROOT_NODE } from '@falcon';   // shared-types globals
// then use shared-utils node-scope.util.appendNodeId(params, id) which checks id !== FALCON_ROOT_NODE.id
```

- `[CODE]` `globals.ts:199-209` — `FALCON_ROOT_NODE` is a FE-only synthetic node (id `'FALCON_ROOT_NODE'`, not a Mongo ObjectId). `shared-utils` `node-scope.util` (L03) guards it off HTTP requests.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Add a `FalconAccess.*` factory for every new PES query. | Hand-build `{action,resource}` inline in a feature. |
| Reuse `*I18n` / `*ToString` / `FALCON_STATUS_*` maps. | Re-map an enum→label/severity in a feature component. |
| Type responses as `ServiceOperationResult<YourDto>`. | Assume the raw body IS your DTO. |
| Declare a SHARED enum/DTO here. | Put a single-app DTO here (keep it in the feature). |
| Use `USER_TYPE_STRINGS` + `stringToUserType`. | Compare raw `'1'`/`'2'` magic strings. |
| Import wallet `NodeType`/`WalletType` from `@falcon/wallet`. | Confuse them with this lib's `NodeType`(Root/Main/Sub) / `WalletType`(Single/Multiple). |
| Keep `getRoleDisplayNameFromRoleKey`'s acc-admin/acc-user override. | "Fix" the labels to the PES englishName. |
| Reference `FALCON_ROOT_NODE.id` from one place. | Duplicate the literal `'FALCON_ROOT_NODE'` string. |

## Consumer Sweep (grep-verified 2026-06-03)

> `apps/` + `libs/` only; `dist/`, `docs/`, `demos/`, `*.md` excluded from the substantive counts.

**Status / role / gateway / PES family** (`FalconAccess.`/`FalconItemStatus`/`USER_TYPE_STRINGS`/`BUILT_IN_ROLE_KEYS`/`AppRouteScope`/`Gateway.`/`FALCON_STATUS_*`) — **443 occ / 94 files**. Heaviest: host-shell `layout.component.ts` (51 — sidebar/nav scope+role), `@falcon/core` guards (`management-console`/`admin-console`/`admin-organization-hierarchy.guard`) + `route-access.service.ts` (9), org-hierarchy `services/services.ts` (admin 10) + `info-panel-state.signals.ts` (9 each), `shared-features/user-details/signals/signals.ts` (21), `comm-mkt-view.config.ts` (21) + `comm-mkt-card.component.ts` (10), `service-pricing-table/models/models.ts` (23), wallet `wallet-balance-management.component.ts` (admin 10) + `balance-transfer.component.ts` (mgmt 9) + `new-wallet-balance/services/wallet.service.ts` (10) + `pes-gating.spec.ts` (13), `contact-groups-list`/`contact-group-detail.component.ts` (9 each). Within this lib: the registry/role-key/route-scope/user-type files cross-reference each other.

**`ServiceOperationResult` — 405 occ / 67 files** (the envelope — see the L04 shared-data-access sibling for the full list). Includes `libs/sdk/src/types/{user-details.dtos,user-details-gateway.interface,otp-gateway.interface}.ts`.

**`FalconAccess` (PES queries):** `@falcon/core` `access-control` + every guarded route/control — org-hierarchy (services + signals), wallet (route guard + transfer button + drawer per-pair), contact-groups (sys/acc scope), user-details (edit-status/role/perm-group), services (payment/visibility/price), Add-User wizard (sys.user / perm-group / profile-picture).

**Enum projections** (`*I18n`/`*ToString`/`FALCON_STATUS_*`): status pills + dropdown option lists across both consoles; `Helper.enumToOptions` (shared-data-access, L04) + `Helper.getPricingTypeLabel` consume `PricingTypeI18n`/`PricingTypeToString`.

**Wire DTOs:** `DoPayment*` + `GetOrderStatusResponse` + `VisibleCommunicationChannelResponse` → the payment/reorder dialogs + `shared-data-access` payment/order services. `ContactGroup*` → contact-groups feature + `contact-group.mapper` (shared-utils). `Hook`/`LookupValueResponse` → lookup-driven dropdowns + `LookupService`/`Helper`.

**`OrgHierarchyNode`/`FALCON_ROOT_NODE`:** org-hierarchy tree (host-shell shared-component + per-app feature) + `node-scope.util` (shared-utils) + layout.

**Policy-subject helpers:** `@falcon/core` `CurrentSubjectBuilder` + auth flows.

> Verified live: this lib is the lowest-tier foundational vocabulary — the PES `FalconAccess` registry + the status/role maps + the `ServiceOperationResult` envelope are the three most-referenced surfaces.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L04). Idioms lifted from the registry + projection maps + policy-subject fns; consumer counts are raw grep totals (443 status/role/PES family / 405 envelope); the acc-admin/acc-user override + dual-NodeType caveat verified in source comments. No source edited.
