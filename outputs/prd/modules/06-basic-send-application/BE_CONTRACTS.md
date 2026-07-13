# BSA Backend Contract Extract — exact existing shapes the Basic Send Application will call

> Purpose: give the BSA architecture document REAL quoted contracts instead of invented ones.
> Source prefixes: `[BRAIN-OUT]` = `C:\Falcon\Brain Outputs\...` · `[MEMORY]` = `C:\Users\User\.claude\projects\C--Falcon\memory\...` (point-in-time) · `[CODE]` = file read this session from the checked-out repos · `[RUNTIME]` = live HTTP probe executed 2026-07-06 against the local Docker stack · `(inferred)` = the brain itself marks the shape as inferred, not code-verified.
> Envelope rule: every Commerce/Charging/Provisioning/Identity endpoint returns `ServiceOperationResult<T>` = `{ bool IsSuccessful; List<string> ErrorMessages; T? Result; }` ([BRAIN-OUT] commerce/DTO_DICTIONARY.md §Cross-Cutting). Contact-group + templates (FastEndpoints) use the same record shape per [BRAIN-OUT] contact-group/DTO_DICTIONARY.md ("inferred — same record shape as Identity"). JSON is camelCase on the wire (framework default, .NET 6+).

---

## 1. Charging — `WalletController` (`/api/Wallet`, via gateway `/charging/Wallet/...`)

[BRAIN-OUT] `understanding/backend/charging/controllers/WalletController/{ENDPOINTS,DTOS,OVERVIEW,VALIDATIONS,ERRORS}.md`. Auth: class-level `[Authorize]` only — **no per-action policy**; any authenticated user (client or Falcon) can call all 8; handler-side ownership checks are flagged "verify" by the brain.

### Endpoints BSA calls

| Method | Gateway URL | Request DTO | Response (T) |
|---|---|---|---|
| POST | `/charging/Wallet/get-account-wallets` | `GetAccountWalletsRequest { string AccountId, List<string> OwnerIds }` | `GetAccountWalletsResponse` |
| GET | `/charging/Wallet/contract-balance-summaries?accountId=` | (query) | `GetContractBalanceSummariesResponse { List<ContractBalanceSummary> Summaries }`, each `{ ContractId, AvailableAmount }` |
| POST | `/charging/Wallet/debit` | `DirectDebitRequest` | `DirectDebitResponse { string TransactionId, decimal DebitedAmount, decimal RemainingBalance, bool AlreadyApplied }` |
| POST | `/charging/Wallet/authorize` | `ReserveWalletChargeRequest` | `ReserveWalletChargeResponse { string ReservationId, decimal RatedAmount, decimal QuotaUnits, decimal BilledUnits, DateTime ExpiresAt, bool AlreadyApplied }` |
| POST | `/charging/Wallet/reserve` | same as authorize (URL alias, same handler `IReserveWalletChargeHandler`) | same |
| POST | `/charging/Wallet/commit` | `UpdateWalletReservationRequest { string ReservationId }` | `UpdateWalletReservationResponse { string ReservationId, string Status, decimal RatedAmount, decimal QuotaUnits, decimal BilledUnits, bool AlreadyApplied }` |
| POST | `/charging/Wallet/release` | `UpdateWalletReservationRequest { string ReservationId }` | `UpdateWalletReservationResponse` |

Alias note (verbatim from controller comments, quoted in [BRAIN-OUT] OVERVIEW.md): *"The Authorize endpoint is the phase-1 endpoint for delivery-based policies. It currently shares the same implementation as reserve because WA_DELIVERY_COMMIT must create the hold during authorization and return the reservation id immediately."*

### `ReserveWalletChargeRequest` — full field list ([BRAIN-OUT] DTOS.md, verbatim)

```
string AccountId, OwnerId, Channel, eCurrency Currency, ApplicationId,
Priority = "NONE", Destination = "ANY", Unit, decimal Quantity,
PolicyCode, ReferenceType, ReferenceId, ChargeKind = OcsChargeKinds.Usage,
string? QuotaCode, SubService?, UsageCode? (legacy),
int ReservationTtlSeconds = 300
```

### `DirectDebitRequest` — full field list

```
string AccountId, decimal Amount, eCurrency Currency, string ReferenceType,
string ReferenceId, string? Description, string? ServiceId
```

### `GetAccountWalletsResponse` — nested shape

- `MasterWallet` : `GetMasterWalletResponse { string Id, decimal? Balance }`
- `CommChannelWallets[]` : `GetAccountCommChannelWalletResponse { string Id, string CommChannelId, decimal Balance }`
- `OwnerWallets[]` : `GetAccountOwnerWalletResponse { string Id, string OwnerId, decimal? Balance, List<GetAccountCommChannelSubWalletResponse> CommChannelSubWallets }`
- `GetAccountCommChannelSubWalletResponse { string CommChannelId, string walletId (sic — lowercase C# property → serializes as "walletid" on the wire, flagged Bug), decimal Balance }`

### Error codes ([BRAIN-OUT] ERRORS.md — HTTP statuses "(inferred)")

| Endpoint | Errors |
|---|---|
| get-account-wallets | `WalletNotFound` (404), `WalletSettingsNotFound` (404), `UnauthorizedUserToPerformThisAction` (403) |
| contract-balance-summaries | `WalletNotFound` |
| debit | `InvalidAmount`, `WalletNotFound`, `WalletSettingsNotFound`, `InsufficientBalance`, `WalletVersionConflict` |
| authorize / reserve | `InvalidChargeRequest`, `InvalidIdempotencyKey`, `NoApplicableRate`, `CommChannelSubWalletNotFound`, `InsufficientBalance`, `WalletNotFound`, `WalletSettingsNotFound`, `WalletVersionConflict` |
| commit / release | `ReservationNotFound`, `WalletVersionConflict` |

Semantics (all [BRAIN-OUT] ERRORS.md + VALIDATIONS.md):
- **`AlreadyApplied` idempotency**: mutators key on `ReferenceType + ReferenceId` in a Redis cache, TTL `RealTimeCharging:IdempotencyTtlSeconds = 86400s (24h)`. Duplicate within TTL → cached response with `AlreadyApplied = true`, HTTP success, **no exception**. Commit/Release are idempotent on the reservation id itself (re-commit returns the existing committed response).
- **`ReservationNotFound` covers three cases**: invalid `ReservationId`; reservation already committed/released; reservation expired (auto-released by the background sweeper).
- **`WalletVersionConflict`** surfaces only after the internal optimistic-concurrency retry loop exhausts: `OcsResilience:MaxOptimisticRetries: 3`, `BaseRetryDelayMs: 25`, `MaxRetryDelayMs: 250`, `RetryJitterRatio: 0.2`. Treat as transient/retryable ("likely 409" — inferred).
- **TTL config**: request default `ReservationTtlSeconds = 300`; config ceiling `RealTimeCharging:ReservationTtlSeconds = 300`; "Handler may clamp the request value — verify" (brain's own caveat).
- **Hot channels**: `RealTimeCharging:HotChannels = ["WHATSAPP", "SMS", "VOICE"]` go through the Redis-stream fast path; others take the Mongo-only path; same validation both ways.
- **No DTO-level validation at all** on WalletController requests — all handler-side.

---

## 2. Contact Group service (`/api/contact-groups/*`, via gateway `/contactgroup/...`)

[BRAIN-OUT] `understanding/backend/contact-group/{ENDPOINT_REGISTRY,DTO_DICTIONARY}.md` + [CODE] FE mirrors in `Falcon\falcon-web-platform-ui\libs\falcon\src\shared-types\lib\models\contact-group.models.ts` and `apps\management-console\src\app\features\contact-groups\models\models.ts` (FE mirrors are the proven-working wire contract and CORRECT two brain "(inferred)" shapes — see risk register).

### Read endpoints BSA calls (all `RequireAuthorization()`)

| Method | Route | Request | Response |
|---|---|---|---|
| GET | `/api/contact-groups` | `ListContactGroupsRequest { NodeId?, Page, PageSize }` | `PagedResult<ContactGroupListItemDto>` |
| GET | `/api/contact-groups/shared` | `ListSharedContactGroupsRequest { Page, PageSize }` | `PagedResult<ContactGroupListItemDto>` (403 possible) |
| GET | `/api/contact-groups/{groupId}` | route | `GetContactGroupDetailsResponse` (name, share policy, columns, statistics, file availability flags — brain: full field list not drilled) |
| GET | `/api/contact-groups/{groupId}/contacts?page=&pageSize=` | route+query | `PagedResult<Dictionary<string, object>>` — **dynamic alias-keyed rows** |
| GET | `/api/contact-groups/{groupId}/files/{fileType}` | `FileType ∈ {original, validated}` | `GetFileDownloadUrlResponse { string DownloadUrl, string FileName, int ExpiresInSeconds }` |
| GET | `/api/contact-groups/upload-config` | none | `UploadConfigResponse { int MaxFileSizeMB, List<string> AllowedExtensions, int PreviewRowCount }` |

### `PagedResult<T>` envelope — CORRECTED wire shape

[CODE] FE mirror (contact-group.models.ts:59-64): `{ items: T[], totalCount: number, pageNumber: number, pageSize: number }`.
([BRAIN-OUT] DTO_DICTIONARY said `{ Items[], TotalCount, Page, PageSize }` "(inferred)" — the FE's `pageNumber` naming is the proven one.)

### `ContactGroupListItemDto` — exact wire shape ([CODE] FE mirror, contact-group.models.ts:37-54)

```ts
{
  id: string; name: string; referenceId?: string | null;
  status: ContactGroupStatus;              // enum: InProgress = 1, Completed = 2
  createdByUserId: string; createdByDisplayName: string; createdByUsername: string;
  createdAt: string;                       // ISO 8601
  sharePolicy: SharePolicyDto;
  uploadedContacts: number;                // defaults 0 server-side
  isDeleted?: boolean;                     // ONLY present for Falcon admin users
}
```

### `SharePolicyDto` — exact ([CODE] FE mirror)

```ts
{ sharedWithAllUsers: boolean; sharedUsers?: ContactGroupSharedUserDto[] }
// ContactGroupSharedUserDto = { userId, firstName, lastName, username }  (denormalized at share time)
```

Mutex rule ([CODE] share-group.validation.ts): `sharedWithAllUsers === true` requires `sharedUsers` empty.

### `ColumnConfig` — exact create-payload item ([CODE] mgmt models.ts:278-289, "origin/main proven-working shape")

```ts
ColumnConfigItem { sourceIndex: number; originalName: string; alias: string; isIgnored: boolean; dataType: string /* 'string'|'number'|'date'|'boolean' */ }
// CreateContactGroupRequest = { uploadSessionId, name, path?: string|null, referenceId?, description?, hasHeader: boolean, columnConfig: ColumnConfigItem[], sharePolicy: { sharedWithAllUsers, sharedUsers?: ContactGroupSharedUserDto[] } }
// POST response wire = { id: string, status?: number }   // field is `id`, NOT `groupId`
```

### Dynamic contacts rows

`GET {groupId}/contacts` items are keyed by the group's column aliases (e.g. `{ "name": "Alice", "phone": "+1-555-0100" }`); consumer must read the column schema from `GetContactGroupDetailsResponse` first ([BRAIN-OUT] DTO_DICTIONARY.md §Dynamic-Keyed Response).

---

## 3. Commerce — NodeController + catalog + settings (`/api/Node`, via `/commerce/Node/...`)

[BRAIN-OUT] `understanding/backend/commerce/ENDPOINT_REGISTRY.md` + `controllers/NodeController/{ENDPOINTS,DTOS,FRONTEND_CONTRACT}.md` + `controllers/SettingController/DTOS.md`; wire shapes corroborated by [CODE] FE mirrors.

### Comm-channel / application reads (class `[Authorize]`, ClientOnly via Core GW)

| Method | Route | Response (T) |
|---|---|---|
| GET | `/api/Node/{id}/comm-channels` | `List<AccountCommunicationChannelResponse>` (full) |
| GET | `/api/Node/{NodeId}/comm-channels/visible` | `List<VisibleCommunicationChannelResponse>` (slim) |
| GET | `/api/Node/{NodeId}/comm-channels/visible/details` | `List<AccountCommunicationChannelResponse>` |
| GET | `/api/Node/{id}/applications` | `List<AccountApplicationResponse>` |
| GET | `/api/Node/{NodeId}/applications/visible/details` | applications twin of visible/details — [MEMORY] `project_applications_visible_details_endpoint_marketplace_2026_06_22` (BE draft PR 42748, deployed locally, route flips 404→401) — NOT in the brain registry (stale) |
| GET | `/api/Application` | `List<ApplicationResponse>` (global catalog) |
| GET | `/api/CommunicationChannel` | `List<CommunicationChannelResponse>` (global catalog) |

### `AccountCommunicationChannelResponse` / `AccountApplicationResponse` — exact wire shape

[CODE] FE mirror `libs/falcon/src/shared-features/service-pricing-table/models/models.ts:45-64` (its own SoT header cites `[CODE] falcon-core-commerce-svc/.../ResponseDtos/AccountApplicationResponse.cs`); both kinds share one shape:

```ts
AccountServiceWire {
  id: string; name: string;
  pricingType: number | null;      // ePricingType: None=0, Monthly=1, Yearly=2, OneTimePayment=3
  priceValue: number | null;
  firstActivationDate: string | null; activationDate: string | null; renewDate: string | null;
  icon: string | null; subTitle: string | null; description: string | null;
  visibility: boolean;
  status: number;                  // see enum below
  details: ({type:'priceType', newPriceType, effectiveDate} | {type:'priceValue', newPriceValue})[] | null;
  canHide: boolean;
  availableActions: number[] | null;   // see enum below
}
```

### Status / AvailableActions enums — exact values

[MEMORY] `project_service_action_display_model_2026_06_25` citing `[CODE] Commerce Enums.cs`:
- **Status** (5 values, NO `Paid` in code): `None=0, InActive=1, Active=2, Expired=3, Disabled=4`
- **Actions**: `DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5` (NO `Activate`)
- Server computes `availableActions[]` in `AllowedFalconServiceActionsGenerator.cs:10-50`: base = Falcon user ? `[EditPriceType, EditPriceValue]` : `[]`; if `!Visibility` → base only; then by status — InActive → +DoPayment (only if pricing configured) +Disable; Active → +Disable; Expired → +DoPayment(if pricing)+Disable; Disabled → +Enable (only if last-disabled-by Client OR caller is Falcon); **None → THROWS (500)**.
- Action-validation errors (all 422 unless noted, [MEMORY] same, citing `[BRAIN-SK] V-service-visibility-pricing-required.md:43-50`): `PriceValueNotConfigured`, `PricingTypeNotConfigured`, `HiddenProductMustNotHavePricing`, `ActivationNotAllowedForHiddenProduct` (do-payment while hidden), `CannotEnableNonVisibleService`, `CannotHideServiceWithTheCurrentStatus`; `InvalidPriceValue/Type` (400).
- BR-AM-20 6-state model (with `Paid` + `Activate`) is CONFIRMED PRD spec but **NOT in code** — documented drift; BSA must build against the 5-state code reality.

### Do-payment (purchase) — exact request/response

[CODE] FE mirror `libs/falcon/src/shared-types/lib/models/do-payment.models.ts` (header: "Mirrors backend Falcon.Commerce.Contracts.Models"):

```ts
POST /commerce/Node/comm-channel/do-payment
  { accountId: string, commChannelId: string, commChannelPriorityIds: { commChannelPriorityId: number, channelId: string }[] }
POST /commerce/Node/application/do-payment
  { accountId: string, applicationId: string, commChannelPriorityIds: CommChannelPriority[] }
→ both: { orderId: string, status: ProcessState }
```

### Order status — exact response + enums

[CODE] FE mirrors `order-status.models.ts` + `order-status.enums.ts`:

```ts
GET /commerce/Node/order/{orderId}/status
→ { status: ProcessState, failureReason?: OrderFailureReason | null, walletType: WalletType }

enum ProcessState        { Pending=1, Running=2, Completed=3, Failed=4 }
enum OrderFailureReason  { None=0, InsufficientFunds=1, CommChannelPriorityOrderRequired=2, WalletNotConfigForTheNode=3 }
enum WalletType          { SingleWallet=1, MultipleWallets=2 }
```

Async flow ([BRAIN-OUT] NodeController/FRONTEND_CONTRACT.md): do-payment → `commerce.order-created.v1` → Charging processes payment → `charging.order-payment-processed.v1` → Commerce updates order → FE polls order-status. ✋ Runtime-verified E2E 2026-05-31 ([MEMORY] `project_dopayment_seed_3_scenarios_2026_05_31`: Failed/InsufficientFunds(1), Failed/CommChannelPriorityOrderRequired(2), Completed(3); Kafka round-trip ~1.5s).

### Wallet settings (SettingController)

[BRAIN-OUT] `controllers/SettingController/DTOS.md` (has [CODE] file:line citations):

```csharp
GET /api/Setting/wallets/{ownerId} → GetWalletSettingsResponse
  { eCurrency Currency; eWalletBalanceType WalletBalanceType; eWalletBaseType WalletType; }   // no OwnerId on read
POST /api/Setting/wallets  (Auth: FalconOnly)  ConfigureWalletSettingsRequest
  { [Required] string OwnerId; [Required][EnumDataType] eCurrency Currency;
    [Required][EnumDataType] eWalletBalanceType WalletBalanceType; [Required][EnumDataType] eWalletBaseType WalletType; }
```

Enum values: `eCurrency { SAR=1, Points=2 }` and `eWalletBalanceType { NodeBased=1, UserBased=2 }` per [CODE] FE mirrors (`wallet-balance-management/modules/modules.ts` — "Matches backend: eWalletBalanceType"); `eWalletBaseType { SingleWallet=1, MultipleWallets=2 }`. **Conflict flagged**: the brain's SettingController/DTOS.md guessed `1=UserBased, 2=NodeBased "(verify)"` — the FE mirror says the opposite; trust the FE mirror, re-verify in `Falcon.Commerce.Domain.Constants` before hardcoding.

---

## 4. Provisioning — `ServicesController` (`/api/Services`, via `/provisioning/Services/...`)

[BRAIN-OUT] `understanding/backend/provisioning/{ENDPOINT_REGISTRY,DTO_DICTIONARY}.md` + `controllers/ServicesController/DTOS.md`.

| Method | Route | Auth | Response (T) |
|---|---|---|---|
| GET | `/api/Services/account/{id}/comm-channels` | class `[Authorize]` | `List<GetAccountCommunicationChannelServiceRespose>` |
| GET | `/api/Services/account/{id}/applications` | class `[Authorize]` | `List<GetAccountApplicationServiceRespose>` |
| POST | `/api/Services/create-account-services` | **FalconOnly** | `CreateAccountServicesResponse` |
| PUT | `/api/Services/account/comm-channel/visibility` | **FalconOnly** | `ChangeAccountCommunicationChannelServiceVisibilityResponse` |
| PUT | `/api/Services/account/application/visibility` | **FalconOnly** | `ChangeAccountApplicationServiceVisibilityResponse` |

### The "Respose" typo is REAL (class names, code-verified 🟢 per grounding doc)

```
GetAccountApplicationServiceRespose          (sic)
  { string ApplicationId, bool Visibility, string AccountId,
    eProductSubscriptionStatus Status, bool CanHide, List<eFalconServiceAction> AvailableActions }
GetAccountCommunicationChannelServiceRespose (sic)
  { string CommChannelId, bool Visibility, string AccountId,
    eProductSubscriptionStatus Status, bool CanHide, List<eFalconServiceAction> AvailableActions }
```

Typo is consistent across file name + controller + handlers; invisible on the camelCase wire. Enum literal values are the Commerce ones in §3 (Status 0-4, Actions 1-5) — the provisioning brain file only lists "likely values" (inferred); the exact numeric contract above is from [MEMORY] `project_service_action_display_model_2026_06_25` (Commerce Enums.cs; provisioning twin unverified — see risk register).

Create shape: `CreateAccountServicesRequest { List<CreateAccountCommunicationChannelServiceRequest>, List<CreateAccountApplicationServiceRequest> }`, base fields `{ string AccountId, eProductSubscriptionStatus Status, bool Visibility, string TenantId }` + `CommChannelId`/`ApplicationId`.

---

## 5. Access (PES) — authorize + role bootstrap (`pes/*`, direct at `baseURLPes`, NOT via the API gateways)

[BRAIN-OUT] `understanding/backend/access/{ENDPOINT_REGISTRY,DTO_DICTIONARY}.md`; request/response shapes below are EXACT from [CODE] FE source (the running FE's proven contract), which supersedes the brain's "(inferred)" AuthRequest guess.

### Endpoints

| Method | Route | Notes |
|---|---|---|
| POST | `/pes/authorize` | single `AuthRequest` → decisionPoint.Evaluate |
| POST | `/pes/authorize/resources` | batch — **this is what the FE uses** ([MEMORY] `project_voice_record_pes_gating_2026_07_01`: `AccessControlFacade.resolveFlags → AccessControlClient.authorizeResources → POST {baseURLPes}/pes/authorize/resources`) |
| POST | `/pes/advise` | rules + obligations |
| GET | `/pes/policyrulesByObj?obj=` | vocabulary introspection (returns cross-tenant rules — 774 rows for one resource; heavy + leaky, do not use as a runtime discovery mechanism, per WAVE C note in same memory) |
| POST | `/pes/roles/bootstrap/account/{tenantId}` | `RequireAuthorization(AuthorizationPolicies.SystemOnly)` → `builtInRoleProvisioner.EnsureAccountRoles(tenantId, auditActor)` — the role-bootstrap endpoint |
| GET | `/pes/health` | anonymous. GOTCHA: `/pes/roles` returns 401 (needs JWT) so it is NOT a liveness probe ([MEMORY] voice pes gating) |

### `POST /pes/authorize/resources` — EXACT request/response JSON shape

[CODE] `Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\access-control\access-control.types.ts` (verbatim):

```ts
PesAuthorizeResourcesRequest {
  sub: {                                  // PesSubject
    kind: string;                         // "u:<login-or-subjectId>@<namespace>"
    roles?: string[];
    departments?: string[];
    attr: Record<string, unknown>;        // FE sends {}
  };
  resources: [{                           // PesAuthorizeResource
    seqNo: number;                        // index, 0-based
    obj: { kind: string;                  // e.g. "acc.voice-record" — resource key "<scope>.<resource>"
           attr: Record<string, unknown>;
           ignoreExpression: boolean };
    actions: string[];                    // FE sends exactly one action per resource entry
  }]
}
PesAuthorizeResourcesResponse { results?: Record<string, Record<string, boolean>> }
// FE reads decision at results["<obj.kind>_<seqNo>"][action], falling back to results[obj.kind][action]
// ([CODE] access-control.facade.ts:186-192)
```

### Subject format — exact

[CODE] `current-subject.builder.ts` + `policy-subject.models.ts` (cited in its spec): system user → `u:<normalized-login>@system`; account user → `u:<login>@<tenantId>` (login falls back to `session.subjectId` = JWT `sub`). [MEMORY] `feedback_pes_g_link_uses_zitadel_id` (STANDING RULE): the PES `g`-rule object must be `u:<ZitadelUserId>@<namespace>` (namespace = `system` for Falcon users, `<tenantId>` for client users); Zitadel id = JWT.sub, **never** the Mongo `_id`. All subject/object strings are lowercased server-side (`sub.ToLower()`, `obj.ToLower()`).

### BuiltInRoleCatalog seeding pattern (what BSA must replicate for its own resources)

[MEMORY] `project_voice_record_pes_gating_2026_07_01` — PR 43022 (falcon-core-access-svc): new resources are seeded by editing **`BuiltInRoleCatalog.cs`** (C# is the SoT; "no JSON seed anywhere"), adding `sys.<resource>` + `acc.<resource>` action rules per role. Voice-record example matrix (runtime-confirmed): sys-admin/sys-ops/sys-products = view+preview allow, create/delete/share deny; acc-owner + acc-admin = all 6 allow; acc-user = view/create/preview/view-shared allow + delete/share **creator-scoped** via condition `"r.obj.createdby"=="r.sub.userid"`. Actions are kebab-case strings (e.g. `view-shared`). Redeploy = restart the PES container against the bind-mount; a single-file BuiltInRoleCatalog change needs NO zitadel-config re-run. FE side registers the same vocabulary in `libs/falcon/.../falcon-access.registry.ts` (query shape `resource: "<scope>.<resource>", attrs:{}, ignoreExpression:true`) guarded by golden-map test `tools/validation-tests/falcon-access-contract.test.ts`.
Routing trap for BSA screens: `acc.services view` is allowed ONLY for acc-owner (deny acc-admin + acc-user) — do not gate BSA pages on `services.view` or Normal Users are locked out; BSA needs its own PES resources ([MEMORY] same).

---

## 6. Identity — user reads + webhook (`/api/user/*`, via `/identity/user/...`)

[BRAIN-OUT] `understanding/backend/identity/{ENDPOINT_REGISTRY,DTO_DICTIONARY}.md`.

### Endpoints BSA needs (shared-with pickers + display names)

| Method | Route | Request | Response (T) | Notes |
|---|---|---|---|---|
| GET | `/api/user/by-tenant` | `ListTenantUsersRequest(TenantId, PathPrefix, ExcludeRole)` | `List<TenantUserDto>` | **East-west** — used by the gateways' hierarchy aggregation |
| GET | `/api/user/{id}` | `GetUserByIdRequest(Id, IncludeDeleted)` | `UserResponse` | Falcon users may IncludeDeleted; client users tenant-scoped |
| GET | `/api/user/` | `ListNodeUsersRequest(NodeId, TenantId, Search, Status[], Role[], PathPrefix, PageNumber, PageSize, IncludeDeleted, ExcludeCurrentUser, IgnoreNodeIdFilter)` | `PagedResponse<UserInfoResponse>` | tenant-scoping from JWT for client users |
| GET | `/api/user/count` | `GetUserCountRequest(TenantId, Roles[])` | `long` | east-west |

### Exact field lists

```
TenantUserDto { Id, NodeId, FirstName, LastName, Path }
UserResponse  { Id, NodeId, FirstName, LastName, Username, Email, PhoneNumber,
                eUserRoles Role, string RoleKey, eUserType UserType, eUserStatus Status,
                string PermissionGroup, TenantId, Image, DateTime CreatedAt, string? CreatedBy,
                bool IsPhoneVerified, bool IsEmailVerified, string? Path }
PagedResponse<T> { List<T> Items, long TotalCount, int PageNumber, int PageSize }
```

`UserInfoResponse` = "lightweight version used in list pages" — exact fields NOT recorded in the brain (risk register).

### Zitadel webhook HMAC pattern (the model for BSA's own provider callbacks)

[BRAIN-OUT] identity/ENDPOINT_REGISTRY.md §Webhook, verbatim: `POST /api/webhook/zitadel` — request = **raw body + `x-zitadel-signature` header**; auth = **Anonymous + HMAC signature verification via `ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body)`**; on verified events (`UserLocked/Unlocked/Deactivated/Reactivated/EmailVerified/PhoneVerified`) updates user status in Mongo. Templates-svc exposes the same pattern for Meta: `POST + GET /api/webhooks/meta/template` ([RUNTIME] path inventory §7).

---

## 7. Templates-svc — LIVE path inventory ([RUNTIME] probed 2026-07-06)

Stack state: `http://localhost:7264/health/ready` → **200** (plain `/health` → 404 — health lives at `/health/ready` + `/health/live`); `http://localhost:7264/openapi/v1.json` → **200**, title **"Falcon.Templates.Api | v1"**, **45 paths / 52 operations** (grew from 42 paths at the 2026-06-30 deploy — [MEMORY] `project_templates_svc_local_docker_deploy_2026_06_30`; service runs branch `feat/ivr-templete`, host port 7264 → container 8080, internal name `templates`). Auth is NOT expressed in the OpenAPI doc (no securitySchemes, no global/per-op security); [RUNTIME] unauthenticated `GET /api/voice-records` → 401 and `GET /api/voice-records/validation-config` → 401 ⇒ JWT required on the API surface (login via identity :7777). Writes additionally require a CLIENT user — Falcon users get 403 `ForbiddenToManageVoiceRecord`; tenant+node come from the JWT, not the body ([MEMORY] `reference_voice_records_api_seed_recipe_2026_06_30`, runtime-verified).

Full list (grouped; raw dump saved beside this file at `templates-openapi.json`):

### whatsapp-templates (19 paths / 22 ops)
```
POST   /api/whatsapp-templates
GET    /api/whatsapp-templates/{Id}            PUT /api/whatsapp-templates/{Id}            DELETE /api/whatsapp-templates/{Id}
GET    /api/whatsapp-templates/shared
GET    /api/whatsapp-templates/{Id}/shared-users
PATCH  /api/whatsapp-templates/{Id}/share
POST   /api/whatsapp-templates/{TemplateId}/submit
POST   /api/whatsapp-templates/{TemplateId}/resubmit
POST   /api/whatsapp-templates/{TemplateId}/approval/approve
POST   /api/whatsapp-templates/{TemplateId}/approval/reject
GET    /api/whatsapp-templates/{TemplateId}/meta-history
POST   /api/whatsapp-templates/preview
GET    /api/whatsapp-templates/validation-metadata
POST   /api/whatsapp-templates/sync/{WabaId}
POST   /api/whatsapp-templates/media/upload-sessions
POST   /api/whatsapp-templates/media/{AssetId}/complete
DELETE /api/whatsapp-templates/media/{AssetId}
GET    /api/whatsapp-templates/media/{AssetId}/preview-url
POST   /api/whatsapp-templates/flows              GET /api/whatsapp-templates/flows
GET    /api/whatsapp-templates/flows/{flowId}
```

### voice-templates / IVR (7 paths / 9 ops)
```
POST   /api/voice-templates
GET    /api/voice-templates/{Id}    PUT /api/voice-templates/{Id}    DELETE /api/voice-templates/{Id}
GET    /api/voice-templates/ready-ivrs
GET    /api/voice-templates/{Id}/runtime
POST   /api/voice-templates/{TemplateId}/approval/approve
POST   /api/voice-templates/{TemplateId}/approval/reject
POST   /api/voice-templates/{Id}/share
```

### voice-records (9 paths / 10 ops) — flow runtime-verified 2026-06-30 (upload-session → presigned PUT → complete → list/preview)
```
GET    /api/voice-records                         GET /api/voice-records/shared
POST   /api/voice-records/upload-session          POST /api/voice-records/{Id}/complete
GET    /api/voice-records/{Id}                    DELETE /api/voice-records/{Id}
GET    /api/voice-records/{Id}/preview-url        POST /api/voice-records/{Id}/share
GET    /api/voice-records/validation-config       GET /api/voice-records/name-exists
```
Runtime facts ([MEMORY] seed recipe): `upload-session` body `{source:1, fileName, contentType, sizeBytes}` → `result.{recordId,url,objectKey,expiresInSeconds}`; presigned URL host is `minio:9000` and must be rewritten to `localhost:9000` by the caller (host not signed; same for `preview-url`); contentType allow-list audio/mpeg, audio/wav, audio/x-wav, audio/wave, audio/vnd.wave; max 20MB; `complete` body `{name}` → VoiceRecordListItemDto.

### templates (channel-neutral, 5 paths / 5 ops)
```
GET    /api/templates
GET    /api/templates/pending-approvals
GET    /api/templates/{TemplateId}/approval/history
GET    /api/templates/is-checker
POST   /api/templates/internal/approval-config-change/apply
```

### communication-channel-configs (4 paths / 4 ops)
```
GET    /api/communication-channel-configs
PUT    /api/communication-channel-configs/{id}
GET    /api/communication-channel-configs/user-checker-levels
PUT    /api/communication-channel-configs/{id}/users/{userId}/checker-assignments
```

### webhooks (1 path / 2 ops)
```
POST   /api/webhooks/meta/template                GET /api/webhooks/meta/template
```

This closes prereq P-1's endpoint-enumeration half. Per-endpoint DTO schemas are in the saved `templates-openapi.json` components (not expanded here).

### Gateways ([RUNTIME] one line each)
- Core Gateway `http://localhost:7038/health` → **401** (alive; health endpoint auth-challenged on this deployment; https not served). `GET http://localhost:7038/templates/voice-records` → **401** ⇒ the running Docker gateway HAS the templates route (matched + ClientOnly-challenged, not 404/502).
- System Gateway `http://localhost:7256/health` → **401** (alive; same).

---

## 8. Gateway onboarding recipe for a new `bsa-cluster`

Sources: [CODE] `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\appsettings.json` (read this session — quoted verbatim) + [BRAIN-OUT] `understanding/backend/GATEWAY_ROUTE_MAP.md` + [MEMORY] crash-trap memories.

### 8.1 Route entry — exact shape to copy (this is the real `templates-proxy` JSON, the newest precedent)

```json
"ReverseProxy": {
  "Routes": {
    "bsa-proxy": {
      "ClusterId": "bsa-cluster",
      "AuthorizationPolicy": "ClientOnly",        // Core GW; "FalconOnly" in System GW; "Anonymous" only for auth-style routes
      "RateLimiterPolicy": "PerTenant",           // the only rate-limiter name in use
      "Match": { "Path": "/bsa/{**remainder}" },
      "Transforms": [
        { "PathRemovePrefix": "/bsa" },
        { "PathPrefix": "/api" }
      ]
    }
  },
  "Clusters": {
    "bsa-cluster": {
      "Destinations": { "destination1": { "Address": "http://localhost:<port>" } },
      "HttpRequest": { "ActivityTimeout": "00:00:30" }
    }
  }
}
```

Config keys in play (exact names): `ReverseProxy:Routes:<route-id>:{ClusterId, AuthorizationPolicy, RateLimiterPolicy, Order, Match:Path, Transforms}` and `ReverseProxy:Clusters:<cluster-id>:{Destinations:destination1:Address, HttpRequest:ActivityTimeout}`. Policy names: **`ClientOnly`** (Core GW default), **`FalconOnly`** (System GW default), **`Anonymous`** (Core GW `identity-auth-proxy` only, with `"Order": 0` so it wins over the authenticated `/identity/{**remainder}` at `"Order": 1`). Rate limiter: **`PerTenant`** backed by root config `RateLimiting { "PermitLimit": 100, "WindowInSeconds": 60, "QueueLimit": 0 }`.

Both gateways need the same additions (Core `falcon-int-core-gateway-svc` + System `falcon-int-system-gateway-svc`); System GW has no anonymous route and pulls tenant from downstream response bodies (admins are tenant-less) [BRAIN-OUT] GATEWAY_ROUTE_MAP.md.

Environment overrides: in the Docker stack the cluster address is supplied as an env var on the gateway containers — precedent (verbatim from [MEMORY] `project_signalr_mode_branch_set_and_main_baseline_2026_06_10`): `ReverseProxy__Clusters__templates-cluster__Destinations__destination1__Address: http://templates:8080` in `docker-compose.override.yml`. For BSA: `ReverseProxy__Clusters__bsa-cluster__Destinations__destination1__Address: http://bsa:8080`. Local checked-out appsettings currently points templates-cluster at `http://localhost:5208` ([CODE] appsettings.json:213) while the Docker stack uses `http://templates:8080` — two different worlds, keep them straight.

### 8.2 THE CRASH TRAP (must-know)

[MEMORY] `project_signalr_mode_branch_set_and_main_baseline_2026_06_10` (F1): when PRs 41572/41573 added the templates proxy route without a resolvable cluster destination in the compose env, **BOTH gateways CRASHED at startup** — YARP fatal: **"No address found for destination on cluster 'templates-cluster'"**. Consequence for BSA: adding `bsa-proxy` route config to the gateways is a **deploy-order hazard** — the cluster's `Destinations.destination1.Address` must be present in every environment's config (or compose env var) **before or together with** the route, otherwise both gateways go down for everyone. (Related but distinct failure: address present, container absent → routes 502 only, gateways stay up — [MEMORY] `project_templates_svc_local_docker_deploy_2026_06_30`.)

### 8.3 Aggregation handler pattern (if BSA needs a BFF endpoint)

[BRAIN-OUT] GATEWAY_ROUTE_MAP.md: custom cross-service reads live in `Falcon.Core.Gateway/Features/*` as FastEndpoints groups registered via `MapGatewayEndpoints()`, grouped under `/api/commerce/` with the gateway's policy (`CommerceEndpointGroup` ClientOnly / FalconOnly per gateway); they short-circuit YARP for matched paths. Precedents: `GET /api/commerce/accounts/{Id}/hierarchy` (Commerce + Identity `user/by-tenant` + Charging `wallet/get-account-wallets`), `GET /api/commerce/contracts` (+`/charging wallet/contract-balance-summaries` overlay), `GET /api/commerce/contracts/{ContractId}` (enforces `contract.AccountId == JWT.TenantId`, forces `CanEdit=false`). The System-GW TestingCharging group shows the pass-through style: re-serialize downstream responses as `JsonElement` so the gateway does not duplicate DTOs.

### 8.4 Service-side startup traps (for the new BSA service itself)

- FastEndpoints startup crash if zero endpoints are discovered — contact-group guards this with an always-on `GET /api/_internal/info` (`AllowAnonymous`, returns `{ service, status }`) [BRAIN-OUT] contact-group/ENDPOINT_REGISTRY.md — copy that pattern.
- Charging-style startup gate `app.ValidateErrrosResourceCompleteness()` (sic) fails boot if any error code lacks EN+AR translations [BRAIN-OUT] WalletController/VALIDATIONS.md.
- Health endpoints: services expose anonymous `/health` (templates-svc: `/health/ready` + `/health/live`) — [RUNTIME].

---

## 9. Contract risk register — shapes the BSA build MUST re-verify against source

Every row below is marked inferred/stale/unverified by its own source (or contradicted between sources). Verify in code before freezing the BSA contract.

| # | Contract | Risk | Where to verify |
|---|---|---|---|
| R1 | Charging HTTP status codes per error (`WalletVersionConflict` "likely 409", 404/403 mappings) | "(inferred)" — no `[ErrorHttpStatus]` in Charging; mapping done by exception middleware | Charging exception-handler middleware |
| R2 | `ReservationTtlSeconds` clamping ("Handler may clamp the request value — verify") | brain caveat | `ReserveWalletChargeHandler` |
| R3 | Wallet handler-side tenant/owner ownership checks (`IAccessCurrentUser`) — can a client debit another tenant's wallet? | brain: "verify"; class-level `[Authorize]` only | Charging handlers |
| R4 | `GetAccountCommChannelSubWalletResponse.walletId` lowercase property → wire `walletid` | flagged Bug; brain "likely serializes" | run get-account-wallets once, inspect JSON |
| R5 | Reserve/commit/release NEVER runtime-exercised ("no recorded runtime exercise ... in the stores read") | [BRAIN-OUT] BSA PLATFORM_GROUNDING.md §evidence table | Charging Lab / manual E2E |
| R6 | Contact-group `GetContactGroupDetailsResponse` full field list; `CreateContactGroupResponse` "diagnostic counters"; `InitUploadResponse`/`CompleteUploadResponse` field lists | all "(inferred)" in DTO_DICTIONARY | `Falcon.ContactGroup.Api/Application/*/Models` |
| R7 | Contact-group `ColumnConfigItem` flat-array shape "Backend confirmation is still pending (B-10)" (FE ships origin/main's proven shape) | FE comment | `CreateContactGroupRequest.cs:38-51` |
| R8 | `PagedResult` naming conflict: brain says `Page/PageSize`, FE mirror says `pageNumber/pageSize` | contradiction (FE mirror is proven-working) | contact-group PagedResult.cs |
| R9 | Provisioning `eProductSubscriptionStatus`/`eFalconServiceAction` numeric values — brain lists only "likely values (verify)"; exact 0-4/1-5 values proven for the **Commerce** enums; provisioning twin assumed identical | assumption | `Falcon.Provisioning.Domain.Constants` |
| R10 | `eWalletBalanceType` value order: brain "1=UserBased, 2=NodeBased (verify)" vs FE mirror `NodeBased=1, UserBased=2` | direct contradiction — trust FE, but re-verify | `Falcon.Commerce.Domain.Constants` |
| R11 | PES `AuthResponse` (single authorize) + `PolicyRule`/`Role` field lists | "(inferred)" in access DTO_DICTIONARY (batch `authorize/resources` shape is exact — §5) | `T2.PES.Authorization` types |
| R12 | Identity `UserInfoResponse` (list rows) exact fields | not recorded | Identity Contracts |
| R13 | Templates-svc per-endpoint auth policies (client-only writes proven ONLY for voice-records) + WhatsApp-template DTO shapes ("routes/DTOs 🔴 unverified" per grounding doc; OpenAPI components saved but unreviewed) | partial | `Falcon.Templates.Api/Endpoints/*` + saved `templates-openapi.json` components |
| R14 | Templates path inventory drift: 42 paths (2026-06-30) → 45 ([RUNTIME] today) — branch `feat/ivr-templete` still moving (sharePolicy read-side landed 2026-07-06) | moving target | re-dump `/openapi/v1.json` at build start |
| R15 | Gateway `/health` returning 401 on the running Docker stack (brain says health endpoints are anonymous) | deployment divergence | gateway Program.cs + compose env |
| R16 | Brain gateway registry is STALE on templates (claims "No templates-cluster"); local appsettings has it at `localhost:5208` while Docker uses `templates:8080` | staleness proven; trust [CODE]+[RUNTIME] | live compose + both gateways' configs |
| R17 | Commerce 5-state service lifecycle vs BR-AM-20 6-state PRD (Paid/Activate) — CONFIRMED drift; CR 126240 may land mid-BSA-build | business drift | Commerce Enums.cs + CR 126240 status |
| R18 | `Status = None(0)` makes `AllowedFalconServiceActionsGenerator` THROW (500) — BSA read paths must tolerate a 500 from comm-channel reads on misconfigured rows | code-verified quirk | generator:27 |
| R19 | PES has GET-with-body endpoints (`policyrulesBySub`, `policyrulesByFilter`) — HTTP anti-pattern; some clients strip GET bodies | brain note | avoid these two from BSA |
| R20 | `GetOrderStatusResponse` brain description ("order id, status, last update, charging linkage") vs FE mirror (`{status, failureReason?, walletType}` — no order id) | contradiction (FE mirror proven by the do-payment popup flow) | Commerce ResponseDtos/GetOrderStatusResponse.cs |

---

## Appendix — canonical URL construction

[BRAIN-OUT] GATEWAY_ROUTE_MAP.md: `<gateway-base-url>/<service-prefix>/<service-internal-path-minus-/api>`. Client traffic → Core GW `:7038` (`ClientOnly`); Falcon-admin traffic → System GW `:7256` (`FalconOnly`); PES → its own base URL (`baseURLPes`, port 5296 per [MEMORY] voice pes gating) — **never** via the API gateways ([CODE] access-control.client.ts comment: a relative URL gets rewritten to the 7045 gateway → guaranteed 404). Gateways inject `X-Tenant-Id` + `X-Correlation-Id`; FE sends only `Authorization: Bearer <jwt>` + JSON content headers.
