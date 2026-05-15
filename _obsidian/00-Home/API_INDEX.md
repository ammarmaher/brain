---
type: hub
hub: api
created: 2026-05-15
---
*** API Index — graph hub ***
*** Updated 2026-05-15 ***

# API Index

> Brain Outputs holds approved API contract rules. This note holds the graph.
>
> **Canonical knowledge root:** [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). API contracts live at [`understanding/backend/<service>/ENDPOINT_REGISTRY.md`](../../../Brain%20Outputs/understanding/backend/) + [`understanding/backend/<service>/DTO_DICTIONARY.md`](../../../Brain%20Outputs/understanding/backend/). Page-level API rules live at `understanding/pages/<page>/API_RULES.md`.

## Per-page API rule registries

| Page | API rules file | Approved count |
|---|---|---|
| organization-hierarchy | [API_RULES.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/API_RULES.md) | 0 (seed) |

## Backend hub

- [[BACKEND_INDEX]] — 9 services tracked. Vault service notes: [[Commerce Service]] · [[Charging Service]] · [[Provisioning Service]] · [[Identity Service]] · [[Templates Service]] · [[Contact Group Service]] · [[Access PES Service]] · [[Core Gateway Service]] · [[System Gateway Service]].

## Global pattern (seed)

- [API_PATTERN.md](../../outputs/understanding/frontend/patterns/API_PATTERN.md) — seed.

## PRD entities → backend contracts (upstream)

| PRD | Entities | Backend service folder |
|---|---|---|
| [[01 Account Management]] | Account · Node · AccountSettings · CommChannelConfig · AppConfig · Wallet · WalletRecord · WalletTypeConfig · TransferTx | [`commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) · [`charging/`](../../../Brain%20Outputs/understanding/backend/charging/) |
| [[02 User Management]] | User · UserStatusHistory · LoginAttempt · OtpChallenge · Session · PermissionGroup · Permission | [`identity/`](../../../Brain%20Outputs/understanding/backend/identity/) · [`access/`](../../../Brain%20Outputs/understanding/backend/access/) |
| [[03 Contract Packaging Charging Billing]] | Contract · RateCardEntry · ContractDetail · Addon · WalletRecord · PriceUnit · Destination · Priority | [`commerce/`](../../../Brain%20Outputs/understanding/backend/commerce/) · [`charging/`](../../../Brain%20Outputs/understanding/backend/charging/) · [`provisioning/`](../../../Brain%20Outputs/understanding/backend/provisioning/) |
| [[04 Contact Group Management]] | ContactGroup · ContactGroupColumn · ContactGroupRecord · SharePolicy · UploadSession | [`contact-group/`](../../../Brain%20Outputs/understanding/backend/contact-group/) |
| [[05 Templates]] | Template · TemplateHeader/Body/Footer/Button/Variable · TemplateVersion · TemplateApprovalTrail · CommChannelConfig · CheckerLevel/User | [`templates/`](../../../Brain%20Outputs/understanding/backend/templates/) — **GAP-TM-01:** no public API yet · **GAP-TM-02:** no gateway route |

Hub: [[PRD_INDEX]].

## Entity reconciliation (Phase 2D — 15 notes)

Built in parallel by 2 specialist agents (2D-A: PRDs 01+02 · 2D-B: PRDs 03+04+05). Each note traces a PRD entity through to its backend DTO(s) with a side-by-side field-reconciliation table and explicit ✅ / ⚠ / ❌ / ➕ drift flags. Folder: `_obsidian/40-API/`.

### PRD-01 Account Management (5 entities)

| Entity | Vault note | Service | Drift count | Headline drift |
|---|---|---|---|---|
| Account | [[E-account]] | [[Commerce Service]] | 10 | Letter-prefix regex missing on AccountName; `accountId` vs `id` collapse; profilePicture write/read asymmetry |
| Node | [[E-node]] | [[Commerce Service]] | 3 | PRD `type` + `settings` fields not enumerated on DTO; backend has `EffectiveDate` extra (scheduled rename) |
| AccountSettings | [[E-account-settings]] | [[Commerce Service]] | 5 | **HIGH:** `PasswordSecurityLevel` enum vocabulary mismatch — PRD `Normal/Advanced` vs backend `Low/Medium/High/Strict` (Q-UM-12) |
| CommChannelConfig | [[E-comm-channel-config]] | [[Commerce Service]] | 8 | `accountId` → `NodeId`; visibility enum → bool; 6-state status not exposed as single field; 3 date fields undocumented |
| AppConfig | [[E-app-config]] | [[Commerce Service]] | 8 | Mirror of CommChannelConfig (12 endpoints duplicated — consolidation candidate) |

### PRD-02 User Management (3 entities)

| Entity | Vault note | Service | Drift count | Headline drift |
|---|---|---|---|---|
| User | [[E-user]] | [[Identity Service]] | 9 | **HIGH:** `username` PRD ≤30 vs backend `MaximumLength(100)`; both `Role` enum AND `RoleKey` string exposed (transitional) |
| OtpChallenge | [[E-otp-challenge]] | [[Identity Service]] | 9 | PRD's 1 entity = backend's 2 records (`AuthenticationSession` + `VerificationSession`); `expiresAt` absolute vs relative seconds. **⚠ SECURITY:** `DevOtpCode?` flag leaks OTP in dev mode |
| Session | [[E-session]] | [[Identity Service]] | 8 | `SessionId` shared with OTP-flow; `idleTimeoutAt` not exposed (FE hardcodes 30 min); `refreshTokenId` relational vs opaque |

### PRD-03 Contract / Packaging / Charging / Billing (5 entities)

| Entity | Vault note | Service | Drift count | Headline drift |
|---|---|---|---|---|
| Contract | [[E-contract]] | [[Commerce Service]] | 11 | `expirationDate` → `EndDate`; `name`/`farabiRefId` `<=50` not enforced; `valueSar` upper-bound differs (PRD "hundreds of millions" vs `decimal.MaxValue`); currency cross-service drift |
| RateCardEntry | [[E-rate-card-entry]] | [[Commerce Service]] | 4 | **HIGH:** `ContractUnitConversionRequest` carries no `ChannelId` (PRD says N:1 CommChannel) — verify against source `.cs` |
| Addon | [[E-addon]] | [[Commerce Service]] | 6 | **HIGH structural:** 1 PRD entity → 2 backend collections (`Quotas[]` + `OverageRates[]`). FE must keep both synced by `SubService` + `ChannelId` |
| Wallet | [[E-wallet]] | [[Charging Service]] | 8 | **HIGH structural:** 1 PRD "Wallet" → backend 3-tier (`Master / CommChannel / Owner` + `CommChannelSubWallet`); `walletId` lowercase-w casing bug; no public CRUD (server-side from Kafka only); currency missing on response |
| WalletRecord | [[E-wallet-record]] | [[Charging Service]] | 7 | **No first-class WalletRecord DTO** anywhere on production Charging API; `ContractBalanceSummary` is the closest analogue but carries different semantics |

### PRD-04 Contact Group Management (2 entities)

| Entity | Vault note | Service | Drift count | Headline drift |
|---|---|---|---|---|
| ContactGroup | [[E-contact-group]] | [[Contact Group Service]] | 9 | `contactId` → `GroupId`; `originalFileRef` persistent vs ephemeral pre-signed URL with `ExpiresInSeconds`; `softDeleted` not surfaced on response (blocks Falcon view-deleted UI); Failed status missing (GAP-CGM-26) |
| UploadSession | [[E-upload-session]] | [[Contact Group Service]] | 5 | `uploadId` naming drift across DTOs; state field NOT on response shape (only via 5 error codes); `fileName` cap on backend not in PRD |

### PRD-05 Templates — skipped (GAP-TM-01 / GAP-TM-02)

All 8 PRD-05 entities (Template · TemplateHeader/Body/Footer/Button/Variable · TemplateVersion · TemplateApprovalTrail · CheckerLevel · CheckerUser) have **no public API DTOs** in the Templates service per the GAP-TM-01 architectural decision. Reconciliation cannot be done until the architectural decision lands. The two CommChannelConfig-related entities belong to PRD-01 and are reconciled under [[E-comm-channel-config]] there.

## Drift summary across all 15 entities (~95 findings)

| Severity | Count | Examples |
|---|---|---|
| **HIGH (structural / semantic)** | 8 | Addon 1→2 collections · Wallet 1→3-tier hierarchy · No first-class WalletRecord DTO · Username 30↔100 · PasswordSecurityLevel enum vocab · OtpChallenge 1→2 records · RateCardEntry missing ChannelId · DevOtpCode security flag |
| **MEDIUM (naming / shape)** | ~40 | accountId↔NodeId · expiresAt absolute↔relative · name caps not in PRD or not in DTO · multiple ID naming inconsistencies · enum names differ |
| **LOW (cosmetic)** | ~30 | Casing (lowercase `walletId`) · plural/singular drift · field-suffix dropped (`priceValueSar`→`priceValue`) |
| **MISSING on backend** | ~15 | `softDeleted` flag · `idleTimeoutAt` · 6-state status as single field · audit log · `lastLoginAt` enumeration |
| **EXTRA on backend (➕)** | ~25 | Future-scheduled changes · audit fields (`CreatedBy`, `RowVersion`) · OAuth2/OIDC token bundle · `Stage` state machine · `CanEdit` boolean · `BusinessTimeZone` |

## Security-flagged drift (call out)

- **`DevOtpCode?` on `LoginStepResponse`** — leaks the OTP code to the client in development mode. Must be ensured off in production. Worth surfacing into [[GAPS_INDEX]] as a security item.

## Related hubs

- [[PAGE_LEARNING_INDEX]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]]

## Tags

#type/index #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #service/access #service/charging #service/commerce #service/contact-group #service/core-gateway #service/identity #service/provisioning #service/system-gateway #service/templates #drift #gap #blocked #security
