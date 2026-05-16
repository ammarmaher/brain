---
type: flow-integration
flow: Add Client
playbook: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/
prd-module: PRD-01 Account Management
steps: 5
purpose: "Answers 'who can run Add Client + which V-rules, entities, Kafka events, error codes, status transitions it touches'. Open when implementing or reviewing the 5-step Add Client wizard."
extracted: 2026-05-16
---

# Add Client — Flow × Authority Integration

> [!tldr]
> Falcon-only 5-step wizard (sys-admin · sys-products). One composite POST (`/api/Node/create-account`) creates: Main Node + Account + AccountSettings + N×CommChannelConfig + N×AppConfig + AO User (async via Kafka) + Master Wallet (async). 9 V-rules, 7 entities, 30+ error codes across 5 HTTP status classes, 4 Kafka events. Authority lens: tightest gate of all 4 flows — **only 2 of 6 roles can run it**.

## Permission gate

> Source: `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:9-16`

| Role | Allowed? | Cited from |
|---|---|---|
| `sys-admin` (Falcon System Administrator) | ✅ YES | `[BRAIN-OUT] 01-roles/sys-admin.md:47` (`sys.account.add` = allow) + `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:11` (PRD-01 OVERVIEW Actors row 1 + BR-AM-02) |
| `sys-products` (Falcon Products) | ✅ YES | `[BRAIN-OUT] 01-roles/sys-products.md:47` (`sys.account.add` = allow) + `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:12` (PRD-01 OVERVIEW Actors row 2 + BR-AM-02) |
| `sys-ops` (Falcon System Operation) | ❌ NO | Silent deny — **no rule** for `sys.account.add` in `BuiltInRoleCatalog.cs:113-134` `[BRAIN-OUT] 01-roles/sys-ops.md:60` + explicit "Operation cannot add clients" `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:13` |
| `acc-owner` · `acc-admin` · `acc-user` | ❌ NO | `sys.account.add` is in the `sys.*` namespace; no `acc-*` role has any `sys.*` rule `[BRAIN-OUT] 02-statuses/account-creation-status.md:46` |

**Conclusion:** 2 of 6 roles can run Add Client. Same gate at three layers:

1. **Frontend (visibility)** — `<button>` only renders when `FalconAccess.adminConsole.account.add()` resolves to allow `[CODE] apps/admin-console/.../organization-hierarchy.component.ts:599, 503-508` per `[BRAIN-OUT] 04-feature-parity-matrix/organization-hierarchy.compare.md:74`.
2. **PES policy at gateway/PES service** — `sys.account.add` allow only for sys-admin + sys-products via seed `p`-rules in `BuiltInRoleCatalog.cs` `[CODE] Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs:85-112` (sys-admin) + `:140-166` (sys-products).
3. **Backend `[Authorize]`** — class-level on `NodeController` `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:23`. Note: no `FalconOnly` policy on `POST /api/Node/create-account` itself — Commerce relies on PES at the gateway + the JWT user-type claim.

**Gateway:** System Gateway (`:7256`) only — `[BRAIN-OUT] Add Client/08-BACKEND_API.md:22` + `[BRAIN-OUT] 07-cross-cutting/gateway-routing-map.md:31-32`.

**Account-creation-status lifecycle** (server-side; 7 stages tracking wizard progress): Pending → InfoCompleted → SettingsCompleted → ServicesConfigured → AppsConfigured → OwnerCreated → Completed `[BRAIN-OUT] 02-statuses/account-creation-status.md:16-24`.

## Step × authority cross-cut

> Each step has its own DTO sub-block in `CreateAccountRequest`, its own V-rules, and its own potential error codes. The full composite POST happens **only at the end of Step 5** — earlier "Next" clicks are pure client-side validation. State persisted on the wizard-status enum is server-side only on commit.

| Step | DTO sub-block | PES key checked | V-rules used | Entities created (or read) | Status transition | Kafka emit | Error codes (HTTP) |
|---|---|---|---|---|---|---|---|
| **1 — Basic Info** | `Info` (~20 fields incl. `AccountName`, classification, address, official data) | (none beyond entry gate) | `V-account-name-format-uniqueness` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:13` — backend missing letter-prefix regex, FE enforces · async `GET /api/Node/ValidateAccountName?AccountName=` debounced 300 ms `[BRAIN-OUT] Add Client/08-BACKEND_API.md:84` | reads: `Lookup` (country/city/sector) `[BRAIN-OUT] Add Client/08-BACKEND_API.md:14` | (none on Step 1 alone — server commit is at Step 5) | (none on Step 1 alone) | 400: `AccountNameRequired` · `AccountNameTooLong` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` · `FinanceIdRequired` · `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` · all image-uploader 400s · 409 `DuplicateTenantName` · `DuplicateNodeName` · 422 `InvalidAuthorityLetterType` `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:36-37` |
| **2 — Settings** | `Settings` (`PasswordSecurityLevel` · `AllowedIPs[]` · `MaxNormalUserLimit` · `MaxSystemUserLimit` · `MaxNodeLevel` · `BalanceTransferLimit`) | (none beyond entry gate) | `V-password-security-level-enum` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:14` (Q-UM-12 vocabulary drift) · `V-account-ip-allowlist-enforcement` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:15` · `V-account-limits-zero-means-no-limit` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:16` (backend missing per-field `[ThrowIf*]` attributes — handler-level only) | (none on Step 2 alone) | (none on Step 2 alone) | (none on Step 2 alone) | 400: `MainAccountSettingsRequired` · 422: `InvalidAccountLimits` · `InvalidNodeLevel` · `InvalidValue` · `InvalidIpAddress` `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:38` |
| **3 — CommChannels** | `CommChannels.Services[]` (per-channel `AppId` + `PriceType` + `PriceValue`) | (none beyond entry gate) | `V-service-visibility-pricing-required` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:17` — cross-field reactive form: `visibility` toggle adds/removes `priceType` + `priceValue` validators `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:46-58` | reads: `CommunicationChannel` master list (`GET /api/CommunicationChannel`) `[BRAIN-OUT] Add Client/08-BACKEND_API.md:15` | (none on Step 3 alone) | (none on Step 3 alone) | 400: `PriceValueRequired` · `InvalidPriceValue` · `InvalidPriceType` · 422: `PriceValueNotConfigured` · `PricingTypeNotConfigured` · `HiddenProductMustNotHavePricing` `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:39` |
| **4 — Apps & Services** | `Applications.Services[]` (per-app `AppId` + `PriceType` + `PriceValue`) | (none beyond entry gate) | Same as Step 3 (`V-service-visibility-pricing-required`) | reads: `Application` master list (`GET /api/Application`) `[BRAIN-OUT] Add Client/08-BACKEND_API.md:16` | (none on Step 4 alone) | (none on Step 4 alone) | Same as Step 3 |
| **5 — Account Owner** | `AccountOwner` (FirstName · LastName · UserName · Password=null · NationalId? · PhoneNumber · EmailAddress · Role) + top-level `DeliveryMethod` | (none beyond entry gate — but Identity handler enforces `BR-UM-03` one-AO-per-tenant via 422 `InvalidRoleForUserType`) | `V-user-first-last-name-letters-only` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:18` · `V-username-format-uniqueness-immutable` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:19` (**HIGH drift** — PRD cap 30 vs backend cap 100; FE enforces 30) · `V-password-complexity-per-security-level` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:20` (server-side auto-gen) · `V-normal-user-limit-enforcement` `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:21` (not a create-time concern for AO, applies to subsequent Add User) · async `POST /api/user/exist` debounced 300 ms `[BRAIN-OUT] Add Client/08-BACKEND_API.md:85` | **All Submit-time persistence happens here** (Commerce handler `CreateMainNodeProcess`): Main Node · Account · AccountSettings · N×CommChannelConfig · N×AppConfig — see Status / Kafka cells | Account: → **`Pending`** `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:13` (no explicit "Active on create" per PRD; → Active on first Contract activate · W8 cross-module) · Main Node: created · AccountSettings: persisted · CommChannelConfig × N: → **`InActive (First time)`** per BR-AM-20 `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:14, 16` · AppConfig × N: → `InActive (First time)` · AO User (async): → **`Pending`** per BR-UM-09 `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:18` · Master Wallet (async): → abstract aggregate (lump sum = 0) · server-side wizard-status: → `Completed` `[BRAIN-OUT] 02-statuses/account-creation-status.md:24` | 4 events fire (see §Kafka events) | 400: `RequiredFieldMissing` · `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · `InvalidPhoneNumber` · 409 `DuplicateUsername` · 500-class downstream-failure codes (see §Errors) `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:40` |

### Backend endpoint (final submit)

| Method | Path | Service | Auth | Request | Response | Notes |
|---|---|---|---|---|---|---|
| **POST** | **`/api/Node/create-account`** (via System Gateway → `<system-gateway>/commerce/Node/create-account`) | [[Commerce Service]] `NodeController.CreateAccount` | Class-level `[Authorize]`; Falcon System Admin + Product enforced via PES at gateway | `CreateAccountRequest` (composite — `Info` + `Settings` + `CommChannels?` + `Applications?` + `AccountOwner` + `DeliveryMethod`) | `ServiceOperationResult<CreateAccountResponse>` (carries new Account `Id`) | Wire casing: **PascalCase** (Commerce deviation from camelCase used by Identity / Templates) `[BRAIN-OUT] Add Client/08-BACKEND_API.md:65-66` |

### Pre-fetch reads at wizard open

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/Lookup/{id}?name=&code=` × N | Country / city / sector dropdown options `[BRAIN-OUT] Add Client/08-BACKEND_API.md:14` |
| GET | `/api/CommunicationChannel` | Step 3 master list `[BRAIN-OUT] Add Client/08-BACKEND_API.md:15` |
| GET | `/api/Application` | Step 4 master list `[BRAIN-OUT] Add Client/08-BACKEND_API.md:16` |
| GET | `/api/Node/ValidateAccountName?AccountName=` | Step 1 async uniqueness (debounced 300 ms + cancel-on-input) `[BRAIN-OUT] Add Client/08-BACKEND_API.md:13` |
| POST | `/api/user/exist` | Step 5 async uniqueness (debounced 300 ms + cancel-on-input) `[BRAIN-OUT] Add Client/08-BACKEND_API.md:17` |

### Kafka events on Submit success

| Topic | Producer | Consumer | Side-effect |
|---|---|---|---|
| `commerce.user-creation-requested.v1` | Commerce `UserCreationRequestedEventPublisher` | Identity `UserCreationRequestedConsumer` | Creates Zitadel user · applies `PasswordPolicy(level)` from Step 2 · sends credentials per `DeliveryMethod` `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:29` |
| `commerce.wallet-configured.v1` | Commerce `WalletConfiguredEventPublisher` | Charging `WalletConfiguredEventConsumer` | Materializes Master Wallet (abstract aggregate lump sum = 0) + per-comm-channel sub-wallets if Multiple-wallet mode `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:30` |
| `commerce.identity-settings-sync.v1` | Commerce `TenantIdentitySettingsSyncEventPublisher` | Identity (and others) | Syncs tenant identity settings `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:31` |
| `commerce.tenant-ip-allowlist-changed.v1` | Commerce `TenantIpAllowlistChangedEventPublisher` | Core Gateway | Refreshes Redis IP allowlist cache `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:32` |

## Cross-cluster citations

### V-rules (full list, 9)

| V-rule | Step(s) | Reference |
|---|---|---|
| `V-account-name-format-uniqueness` | 1 | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:13` |
| `V-password-security-level-enum` | 2 | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:14` |
| `V-account-ip-allowlist-enforcement` | 2 (form) + every login (gateway, post-creation) | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:15` |
| `V-account-limits-zero-means-no-limit` | 2 | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:16` |
| `V-service-visibility-pricing-required` | 3 + 4 | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:17` |
| `V-user-first-last-name-letters-only` | 5 | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:18` |
| `V-username-format-uniqueness-immutable` | 5 (immutability not relevant at create) | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:19` — HIGH drift (PRD 30 vs backend 100) |
| `V-password-complexity-per-security-level` | 5 (server-side auto-gen) | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:20` |
| `V-normal-user-limit-enforcement` | 5 (not a create-time concern for AO; subsequent Add User) | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:21` |

> **Phase 2 note:** when `06-validation-by-feature/MATRIX.md` materializes, this entire list should be re-pointed at the matrix footnote `[^c]` (Add Client column).

### Entity drift / consumed entities (E-* references)

| Entity | Created? | Drift / gap noted in playbook |
|---|---|---|
| `E-account` | ✅ Created in Step 5 commit | PRD does not document an explicit "Active on create" status; treat as `Pending` until first Contract activates (W8 cross-module) `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:24-27` |
| `E-account-settings` | ✅ Created in Step 5 commit | Backend missing per-field `[ThrowIf*]` attributes on the 4 limit fields; validation handler-level only `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:36, 73-77` |
| `E-comm-channel-config` × N | ✅ Created in Step 5 commit | Full 6-value status enum not exposed as a single response field `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:55` |
| `E-app-config` × N | ✅ Created in Step 5 commit | Same status-enum gap as comm-channel `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:55` |
| `E-user` (AO) | ✅ Created **async via Kafka** in Step 5 commit | `AccountOwner.PhoneNumber` + `AccountOwner.EmailAddress` are missing `[ThrowIf*]` despite being required `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:86-87` — handler-level only |
| `E-master-wallet` | ✅ Created **async via Kafka** in Step 5 commit | Abstract aggregate; lump sum = 0 until first ContractActivated (BR-AM-28) `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:19, 78-84` |
| `E-node` (Main) | ✅ Created in Step 5 commit | `type` (Root/Main/Sub) not on response DTO `[BRAIN-OUT] flows/Add Node.md:40-41` (drift carries through to all node-touching flows) · `settings` PRD-hinted on Node but no DTO surfaces it (settings live on Account) `[BRAIN-OUT] flows/Add Node.md:41-42` |

> **Phase 2 note:** when `08-entity-drift-by-feature/MATRIX.md` materializes, drill there for the consolidated drift row per entity.

### Business rules (BR-*)

| Rule | Where it fires | Reference |
|---|---|---|
| `BR-AM-02` "Falcon staff can add clients; clients cannot" | Permission gate | `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:7` |
| `BR-AM-03` "Account name: letter-prefix + unique within Falcon scope" | Step 1 V-rule | `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:13` (V-account-name-format-uniqueness) |
| `BR-AM-20` "New CommChannel/App config starts `InActive (First time)`" | Status on commit | `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:52` |
| `BR-AM-28` "Master Wallet abstract lump sum = 0 until first Contract activates" | Master Wallet lifecycle | `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:83` |
| `BR-UM-03` "One Account Owner per account" | Step 5 (first AO; subsequent attempts via Add User would fail) | `[BRAIN-OUT] flows/Add User.md:30, 271` |
| `BR-UM-09` "New user created in `Pending`" | AO user post-commit | `[BRAIN-OUT] Add Client/11-STATE_TRANSITIONS.md:62-71` |
| `BR-UM-15/18` "Credentials sent via `DeliveryMethod`" | Identity consumer post-Kafka | `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:29` |

> **Phase 2 note:** when `09-business-rules-by-feature/MATRIX.md` materializes, drill there for the consolidated BR row.

### Non-PES gates (defense-in-depth)

| Gate type | Where | Effect |
|---|---|---|
| Class-level `[Authorize]` on `NodeController` | Backend | Rejects anonymous calls; relies on PES at gateway for role-based decisions `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:23` |
| Async uniqueness HTTP probe (Account Name) | Step 1 client-side | Pre-empts 409 `DuplicateTenantName` at submit `[BRAIN-OUT] Add Client/08-BACKEND_API.md:84` |
| Async uniqueness HTTP probe (Username) | Step 5 client-side | Pre-empts 409 `DuplicateUsername` at submit `[BRAIN-OUT] Add Client/08-BACKEND_API.md:85` |
| Cross-field client validator (`HiddenProductMustNotHavePricing`) | Step 3/4 reactive form | Prevents submit of incoherent visibility/pricing tuples `[BRAIN-OUT] Add Client/07-VALIDATIONS.md:41` |
| Stepper error-state visual gate | Wizard chrome | UX gate marks offending step on backend rejection `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:45` |
| **No `FalconOnly` policy on `POST /api/Node/create-account`** | Backend | Note: PES at gateway is the actual gate; Commerce relies on the JWT user-type claim + class-level `[Authorize]`. Standalone visibility/pricing edit endpoints (post-create) DO carry `[Authorize(Policy = "FalconOnly")]` `[BRAIN-OUT] Add Client/01-PERMISSIONS.md:28` |

> **Phase 2 note:** when `10-non-pes-gates-by-feature/MATRIX.md` materializes, drill there.

### Error codes (HTTP-grouped, 30+)

> Full mapping in `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:11-30`.

**400 — validation / required-field-missing (~17):**
`AccountNameRequired` · `RequiredFieldMissing` · `AccountIdRequired` · `FinanceIdRequired` · `ParentIdRequired` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` · `MainAccountSettingsRequired` · `OwnerIdRequired` · `AccountNameTooLong` · `MaxLengthExceeded` · `BelowMinimumLength` · `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · `InvalidPhoneNumber` · `InvalidPriceValue` · `InvalidPriceType` · `PriceValueRequired` · `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` · `ImageExtensionNotAllowed` · `InvalidImageFile` · `ExecutableFileNotAllowed` · `ProfilePictureSizeExceeded` · `FileSizeExceeded`.

**409 — uniqueness collisions (3):**
`DuplicateTenantName` (Step 1) · `DuplicateUsername` (Step 5) · `DuplicateNodeName` (Step 1 — separate from tenant collision).

**422 — semantic / cross-field (~7):**
`InvalidAccountLimits` · `InvalidNodeLevel` · `InvalidValue` · `PriceValueNotConfigured` · `PricingTypeNotConfigured` · `HiddenProductMustNotHavePricing` · `InvalidAuthorityLetterType`.

**403 — auth (3):**
`InvalidIpAddress` · `IpNotAllowed` (BR-UM-24 enumeration-leak protection: generic toast — do not differentiate from credential errors) · `Forbidden` / `UnauthorizedAction` / `UnauthorizedUserToPerformThisAction`.

**401 — re-auth (2):**
`Unauthorized` · `InvalidCredentials`.

**500 — downstream Identity/Zitadel failure (5+):**
`CreateIdentityUserFailed` · `GetIdentityUserFailed` · `ExternalServiceError` · `ExternalServiceConnectionError` · `ExternalServiceTimeout` · `ZitadelCreateMachineUserFailed` (and other `Zitadel*Failed`).

**Critical partial-failure UX:** Account may be created server-side **before** the Identity hop fails. Toast: *"Account created but Account Owner creation failed — contact support"*. Preserve wizard state for retry. `[BRAIN-OUT] Add Client/12-ERROR_STATES.md:28` + `[BRAIN-OUT] Add Client/10-KAFKA_SIDE_EFFECTS.md:78-81`.

> **Phase 2 note:** when `13-error-catalog/CATALOG.md` materializes, drill there for the consolidated catalog row per code.

## Cross-references

- Playbook folder (17 files, canonical SoT): `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`
  - [README](../../understanding/pages/organization-hierarchy/Add%20Client/README.md) — load first
  - [01-PERMISSIONS](../../understanding/pages/organization-hierarchy/Add%20Client/01-PERMISSIONS.md)
  - [07-VALIDATIONS](../../understanding/pages/organization-hierarchy/Add%20Client/07-VALIDATIONS.md)
  - [08-BACKEND_API](../../understanding/pages/organization-hierarchy/Add%20Client/08-BACKEND_API.md)
  - [10-KAFKA_SIDE_EFFECTS](../../understanding/pages/organization-hierarchy/Add%20Client/10-KAFKA_SIDE_EFFECTS.md)
  - [11-STATE_TRANSITIONS](../../understanding/pages/organization-hierarchy/Add%20Client/11-STATE_TRANSITIONS.md)
  - [12-ERROR_STATES](../../understanding/pages/organization-hierarchy/Add%20Client/12-ERROR_STATES.md)
- Authority dataset
  - [01-roles/sys-admin](../01-roles/sys-admin.md) · [01-roles/sys-products](../01-roles/sys-products.md)
  - [02-statuses/account-creation-status](../02-statuses/account-creation-status.md) · [02-statuses/user-status](../02-statuses/user-status.md)
  - [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md)
  - [04-feature-parity-matrix/organization-hierarchy.compare](../04-feature-parity-matrix/organization-hierarchy.compare.md)
  - [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md)
- Sibling integration files
  - [MATRIX](MATRIX.md) — master 4-flows view
  - [Add-User.integration](Add-User.integration.md) — Step 5 produces an AO via the same DTO shape (`CreateUserRequest`) but via Kafka (vs HTTP for standalone Add User)
  - [Add-Node-and-Edit-Node.integration](Add-Node-and-Edit-Node.integration.md) — sister flows on the same page
