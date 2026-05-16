---
type: cross-cut-matrix
axis-a: E-* entities (15)
axis-b: features (7)
purpose: "Answers 'which entities does feature F touch + which DTO drift items (rename, type flip, missing/extra) must I reconcile'. Open before wiring DTOs or handlers for any feature port."
extracted: 2026-05-16
source: Brain SK/_obsidian/40-API/E-*.md + feature compares
---

# Entity Drift × Feature — Cross-Cut Matrix

> [!tldr]
> 15 E-* entity reconciliations from PRD-01..04 mapped onto the 7 Falcon features in [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md). Use this matrix to know which DTOs a feature touches, which drift items the implementer must reconcile at the wire (rename, type flip, missing field, extra field), and which entities cross service boundaries (= Kafka touches + multi-handler validation).

## 1. The 15 entities — index, drift count, 1-line description

> Drift count from each entity note's YAML front-matter. Service column reflects the **system of record** (the service that owns writes); downstream readers are listed in §7.

| # | E-* key | PRD | Service (system of record) | Drift count | 1-line description |
|---|---|---|---|---|---|
| 1 | [`E-account`](../../../../Brain%20SK/_obsidian/40-API/E-account.md) | PRD-01 | commerce | 16 | The "Client" entity — legal container on a Main node; owner of users/wallets/contracts/configs/settings |
| 2 | [`E-account-settings`](../../../../Brain%20SK/_obsidian/40-API/E-account-settings.md) | PRD-01 | commerce | 14 | Embedded per-account password tier + IP allowlist + 4 limit caps |
| 3 | [`E-addon`](../../../../Brain%20SK/_obsidian/40-API/E-addon.md) | PRD-03 | commerce | 10 | Sub-service add-on on a contract — PRD models as one, backend splits into `Quotas` + `OverageRates` (1:2 drift) |
| 4 | [`E-app-config`](../../../../Brain%20SK/_obsidian/40-API/E-app-config.md) | PRD-01 | commerce | 13 | Per-account Application override — visibility / pricing / 6-state lifecycle (mirror of CommChannelConfig) |
| 5 | [`E-comm-channel-config`](../../../../Brain%20SK/_obsidian/40-API/E-comm-channel-config.md) | PRD-01 | commerce | 13 | Per-account CommChannel override — visibility / pricing / 6-state lifecycle |
| 6 | [`E-contact-group`](../../../../Brain%20SK/_obsidian/40-API/E-contact-group.md) | PRD-04 | contact-group | 19 | Named recipient list owned by Client-side creator; soft-deleted, downloadable by Falcon |
| 7 | [`E-contract`](../../../../Brain%20SK/_obsidian/40-API/E-contract.md) | PRD-03 | commerce | 19 | Commercial agreement — Info + Rate Card + Contract Details matrix + Addons; auto-status Pending→Active→Expired |
| 8 | [`E-node`](../../../../Brain%20SK/_obsidian/40-API/E-node.md) | PRD-01 | commerce | 8 | Tree element: Root / Main / Sub; bounded by `MaxNodeLevel` |
| 9 | [`E-otp-challenge`](../../../../Brain%20SK/_obsidian/40-API/E-otp-challenge.md) | PRD-02 | identity | 11 | Per-purpose OTP session — 5 flows (login / first-login / edit-email / edit-phone / forgot-password) |
| 10 | [`E-rate-card-entry`](../../../../Brain%20SK/_obsidian/40-API/E-rate-card-entry.md) | PRD-03 | commerce | 8 | Per-CommChannel pricing row inside a contract (SAR↔Points conversion); backend `ContractUnitConversion*` |
| 11 | [`E-session`](../../../../Brain%20SK/_obsidian/40-API/E-session.md) | PRD-02 | identity | 10 | Live JWT session — 30-min idle timeout; shares `SessionId` lineage with OtpChallenge |
| 12 | [`E-upload-session`](../../../../Brain%20SK/_obsidian/40-API/E-upload-session.md) | PRD-04 | contact-group | 10 | Pre-create file scratch space — init → S3 PUT → complete → preview → join to ContactGroup create |
| 13 | [`E-user`](../../../../Brain%20SK/_obsidian/40-API/E-user.md) | PRD-02 | identity | 9 | Person with credentials/role/status; `usertype = Falcon\|Client`; lifecycle 5-status |
| 14 | [`E-wallet`](../../../../Brain%20SK/_obsidian/40-API/E-wallet.md) | PRD-03 (def PRD-01) | charging | 17 | 3-tier hierarchy (Master / CommChannel / Owner / CommChannelSubWallet) — PRD models as one |
| 15 | [`E-wallet-record`](../../../../Brain%20SK/_obsidian/40-API/E-wallet-record.md) | PRD-03 (def PRD-01) | charging | 12 | Ledger row linking wallet ↔ contract; no public DTO — derived projection only |

**Total drift items across the catalog:** 179 (sum of front-matter `drift-count` fields). Source: 15 E-* notes.

## 2. Drift legend (4 verdicts)

Used in each per-entity note's "Field reconciliation" table and reused by name in the per-feature inventory in §5.

| Symbol | Verdict | Meaning |
|---|---|---|
| ✅ | match | PRD field name + type + cardinality lines up with the backend DTO (modulo case). No FE work required beyond standard wiring. |
| ⚠ | DRIFT | The field is present on both sides but a property mismatches — naming, casing, type (e.g. enum collapsed to boolean), cardinality (single value vs nested list), nullability, semantic meaning, length cap, or temporal shape (absolute datetime vs relative seconds). FE must reconcile at the service / mapper layer. |
| ❌ | MISSING | The PRD field has no backend counterpart (or no documented counterpart in `DTO_DICTIONARY.md`). The FE either cannot render the field, must hardcode a default, or must fetch via a separate endpoint. Each occurrence is a candidate gap. |
| ➕ | EXTRA | The backend DTO carries a field the PRD does not enumerate. Usually a platform concern (`TenantId`, `Path`, `CreatedBy`, idempotency markers, pre-signed URLs, OAuth tokens, FE-convenience flags like `CanEdit`/`CanSave`). FE renders or honours per the V-rules. |

## 3. Master matrix — entity × feature

> Cell legend:
> - `✓` — feature reads or writes this entity. Footnote carries the drift count owners must mitigate.
> - `—` — entity not used by this feature.
> - `(✓)` — indirect reference (entity surfaces through a sibling DTO or cross-service event, not a direct CRUD touch).
>
> Feature columns abbreviated as in File 1: **OH** / **CH** / **MA** / **CG** / **WB** / **CC** / **TC**.

| Entity | OH | CH | MA | CG | WB | CC | TC |
|---|---|---|---|---|---|---|---|
| E-account | ✓[^a1] | (✓)[^a2] | (✓)[^a2] | (✓)[^a3] | (✓)[^a2] | (✓)[^a4] | (✓)[^a2] |
| E-account-settings | ✓[^s1] | — | — | — | ✓[^s2] | (✓)[^s3] | — |
| E-addon | — | — | — | — | — | ✓[^o1] | — |
| E-app-config | ✓[^p1] | — | ✓[^p2] | — | — | (✓)[^p3] | — |
| E-comm-channel-config | ✓[^c1] | ✓[^c2] | — | — | — | (✓)[^c3] | — |
| E-contact-group | — | — | — | ✓[^g1] | — | — | — |
| E-contract | (✓)[^k1] | — | — | — | (✓)[^k2] | ✓[^k3] | (✓)[^k4] |
| E-node | ✓[^n1] | (✓)[^n2] | (✓)[^n2] | (✓)[^n3] | (✓)[^n2] | (✓)[^n2] | (✓)[^n2] |
| E-otp-challenge | (✓)[^t1] | — | — | — | — | — | — |
| E-rate-card-entry | — | — | — | — | (✓)[^r1] | ✓[^r2] | (✓)[^r3] |
| E-session | ✓[^e1] | ✓[^e1] | ✓[^e1] | ✓[^e1] | ✓[^e1] | ✓[^e1] | ✓[^e1] |
| E-upload-session | — | — | — | ✓[^u1] | — | — | — |
| E-user | ✓[^v1] | ✓[^v2] | ✓[^v2] | ✓[^v3] | ✓[^v2] | ✓[^v2] | ✓[^v2] |
| E-wallet | (✓)[^w1] | ✓[^w2] | ✓[^w2] | — | ✓[^w3] | (✓)[^w4] | ✓[^w5] |
| E-wallet-record | (✓)[^l1] | (✓)[^l2] | (✓)[^l2] | — | ✓[^l3] | (✓)[^l4] | ✓[^l5] |

[^a1]: OH reads `GetAccountHierarchyResponse` (AccountName, AccountIcon, TenantId, Currency, WalletBalanceType, CanSave); writes `CreateAccountRequest` via Add Client wizard. 16-drift entity — highest count in the catalog.
[^a2]: Feature consumes Account context via session (`tenantId` from JWT + `account_id` from session). Not a direct CRUD touch, but `GetAccountHierarchyResponse.Currency` / `AccountId` flows in for display / scoping.
[^a3]: ContactGroup binds to an Account scope via `tenantId` (gateway-injected `X-Tenant-Id` header).
[^a4]: Contracts read `accountId` from session to scope the contract list; create binds `CreateContractRequest.AccountId` to the selected account/node.
[^s1]: OH Settings tab — IP allowlist edit + password security level + 4 limits. Reads `GetSettingsResponse`, writes `UpdateSettingsRequest`. Vocabulary drift on `PasswordSecurityLevel` (Q-UM-12) is the biggest item — see [BRAIN-OUT] V-password-security-level-enum.
[^s2]: Wallet transfer dialog reads `BalanceTransferLimit %` from `AccountSettings` to compute the `Validators.max` on the amount control.
[^s3]: Contract activation triggers `PasswordPolicy` reseed via Identity if any password tier changes flow through.
[^o1]: Add Contract wizard Step 4 (Addons) + Edit Contract — **structural drift (high)**. PRD has 1 entity; backend has 2 collections (`Quotas` + `OverageRates`). FE must keep them paired by `SubService + ChannelId`.
[^p1]: OH `apps-services-tab` — per-row visibility / pricing / status. Mirror endpoints of CommChannelConfig.
[^p2]: marketplace-applications service-card list — reads `AccountApplicationResponse`; admin-side edits via `Change*` endpoints.
[^p3]: Indirect — contract activation can trigger app provisioning via `ServiceOrderCreated` Kafka.
[^c1]: OH `comm-channels-tab` — same shape as app-config; primary admin edit surface for visibility / pricing / 6-state lifecycle.
[^c2]: comms-hub list — reads `AccountCommunicationChannelResponse` / `VisibleCommunicationChannelResponse`. Mgmt-console flips to `/visible/details` for visibility + payment-status filtering.
[^c3]: Indirect — Contract Details matrix axes reference CommChannel ids; the `RateCardEntry` link to CommChannel is missing on the backend DTO (see [^r2]).
[^k1]: OH does not render contracts directly, but the Master Wallet card + WalletConfigured Kafka event linkage routes through Contract data.
[^k2]: Wallet UI reads `ContractBalanceSummary` (per-contract attribution) via `GET contract-balance-summaries` for the wallet's "remaining by contract" breakdown.
[^k3]: contracts-cost-management is the primary CRUD surface — Add / Edit / List Contracts. 19-drift entity (tied with E-contact-group for highest in catalog) — owners must mitigate naming (`EndDate` ↔ "Expiration Date"), missing length caps, missing range caps, status-aware edit, currency cross-service drift.
[^k4]: Testing-charging simulates contract activation cascades — reads `Contract.id` to target specific rate cards in scenarios.
[^n1]: OH renders the entire `AccountHierarchyNodeResponse` tree (recursive `SubNodes[]`). Direct writes: `CreateSubNodeRequest` (Add Node flow) + `ChangeNodeNameRequest` (Edit Node flow). Note: `type` (root/main/sub) NOT explicitly on response — FE infers from position.
[^n2]: All authenticated features carry `nodeId` from session + JWT `path` claim. Indirect touch.
[^n3]: Contact-group create + list filter by `nodeId`.
[^v1]: OH Add User wizard + Edit User pages — writes `CreateUserRequest`, reads `UserResponse` / `UserInfoResponse` / `ListNodeUsersRequest`. 9-drift entity — `username` 30↔100 drift, `role` exposed twice (`Role` enum + `RoleKey` string), `profilePicture` write/read asymmetry, audit `CreatedBy` extra.
[^v2]: Every authenticated feature reads the current `UserResponse` via `GET /user/me` for header + role-based UI gating.
[^v3]: Contact-group `SharedUserIds[]` resolves user ids against Identity; `sharedWith` listing reads `UserInfoResponse` rows.
[^t1]: OH `otp-popup` section — shared OTP dialog used across login + first-login + edit-email + edit-phone + forgot-password. The dialog itself is shared; the V-rule applicability (Lockout) covers the policy.
[^g1]: contact-groups is the only feature that touches `E-contact-group`. 19-drift entity — `contactId` ↔ `GroupId` rename, `uploadedCount` ↔ `RowCount`, persistent file ref ↔ pre-signed URL, `sharedWith[]` ↔ `IsShared` + `SharePolicy` split, `softDeleted` not on response.
[^r1]: Wallet "Remaining by contract" tooltip exposes per-CommChannel rate context; reads `ContractUnitConversionResponse` rows nested under `ContractResponse.TariffPlan`.
[^r2]: Add Contract Step 2 (Rate Card matrix) + Edit Contract Pending. **Highest-severity drift** in this entity: `commChannelId` is MISSING on the backend `ContractUnitConversion*` DTO — FE may need to encode the channel link via `Code`/`Name`/`RatingUnit` semantics.
[^r3]: Testing-charging simulator exercises rate-card lookups when evaluating `ReserveWalletChargeRequest`.
[^e1]: Every authenticated feature requires `E-session`. Session lifecycle (`SessionId` lineage shared with `E-otp-challenge`) is platform-cross-cut. Idle timeout = 30 min per BR-UM — FE-side timer based on JWT `iat`.
[^u1]: contact-group wizard Step 1 — file picker → `POST /uploads/init` → S3 PUT → `POST /uploads/{uploadId}/complete` → preview render. `UploadId` on upload DTOs vs `UploadSessionId` on the consuming create DTO — same value, two names.
[^w1]: OH renders Master Wallet card + per-row balance pills in `comm-channels-tab` / `apps-services-tab`.
[^w2]: comms-hub / marketplace-applications Do-Payment dialogs reserve against wallet — `ReserveWalletChargeRequest` reads wallet balances first.
[^w3]: wallet-balance-management is the primary surface — reads `GetAccountWalletsResponse` (3-tier hierarchy: Master / CommChannel / Owner). 17-drift entity — nullability inconsistency (Master `decimal?` vs CommChannel `decimal`), `walletId` lowercase-w casing bug, currency missing on per-wallet response, no public CRUD.
[^w4]: Contract activation creates wallet records via Kafka `WalletConfigured` event; contracts feature doesn't render wallets but the cascade routes here.
[^w5]: testing-charging simulator returns `TestingChargingWalletSnapshotResponse` + `TestingChargingBalancesResponse` for scenario runs.
[^l1]: OH does not display per-record ledger rows but inherits the Master Wallet linkage.
[^l2]: After Do-Payment success, `DirectDebitResponse` returns `TransactionId + DebitedAmount + RemainingBalance + AlreadyApplied` — wallet record created server-side.
[^l3]: wallet-balance-management reads `GetContractBalanceSummariesResponse` for per-contract attribution. **No first-class WalletRecord DTO** — semantic drift between PRD `valueSar` (contribution) and backend `AvailableAmount` (remaining).
[^l4]: Contract list renders `RemainingBalance` column derived from wallet-record aggregation.
[^l5]: Testing-charging admin-only `TestingChargingLedgerEntryResponse` exposes per-record ledger rows (paged) — the only place full ledger surfaces.

## 4. Per-feature entity inventory (drill-down)

Each subsection lists the E-* entities the feature consumes, the most consequential drift items the implementer must mitigate, and any cross-service Kafka touches.

### 4.1 `organization-hierarchy` — 7 direct + 6 indirect

Most entity-dense feature. Hosts Add Client (5 steps) + Add User + Add Node + Edit Node + Settings tab.

| Entity | Touch | Top drift items to mitigate at the FE |
|---|---|---|
| E-account | direct | (16 drifts) — `accountId` vs `id` collapse, `profilePicture` account-vs-owner mismatch, AccountOfficialData per-field DTO opacity, letter-prefix regex backend-missing |
| E-account-settings | direct | (14 drifts) — `PasswordSecurityLevel` Normal/Advanced ↔ Low/Medium/High/Strict (Q-UM-12), `maxNodeLevels` (PRD) vs `MaxNodeLevel` (backend) casing, `BalanceTransferLimit` unit hint dropped, `Enabled` toggle extra on backend |
| E-node | direct | (8 drifts) — `type` (root/main/sub) NOT on response DTO (FE infers from position), per-node `settings` missing on backend (lives on Account), `EffectiveDate` extra on `ChangeNodeNameRequest` |
| E-user | direct | (9 drifts) — `username` 30↔100, `Role` enum vs `RoleKey` string (use `RoleKey`), `profilePicture` write/read asymmetry, `permissionGroupId` vs `PermissionGroup` naming, `updatedAt` + `lastLoginAt` missing |
| E-comm-channel-config | direct (Step 3 + comm-channels-tab) | (13 drifts) — `accountId` vs `NodeId`, `visibility` enum → bool, `priceValueSar` → `priceValue` (currency hint dropped), 6-state status not single field, scheduled price change + cancel-pending extras |
| E-app-config | direct (Step 4 + apps-services-tab) | (13 drifts) — same shape as comm-channel-config |
| E-otp-challenge | direct (otp-popup) | (11 drifts) — `SessionId` shared with `E-session`, `userId` not on wire, `channel` split across DTOs/endpoints, `expiresAt` relative-seconds shape, `attempts`/`resendCount` server-only |
| E-session | platform | (10 drifts) — JWT-derived, FE never sees `userId/ipAtLogin/createdAt/lastActivityAt/idleTimeoutAt` |
| E-contract / E-wallet / E-wallet-record / E-addon / E-rate-card-entry | indirect | OH consumes Account hierarchy + Master Wallet pills — surfaces of [E-contract] / [E-wallet] data; no CRUD here |
| E-upload-session / E-contact-group | n/a | not used by OH |

**Cross-service touches:**
- Commerce → Identity Kafka `UserCreationRequested` (Step 5 of Add Client)
- Commerce → Charging Kafka `WalletConfigured` (Account create + Sub-node create)
- Commerce → Charging Kafka `ContractLifecycle` (when contracts activate post-create)

### 4.2 `comms-hub` — 4 direct + 4 indirect

Listing surface with embedded Do-Payment + payment dialog.

| Entity | Touch | Top drift items |
|---|---|---|
| E-comm-channel-config | direct (list rows) | (13 drifts) — same as OH; mgmt-console reads via `/visible/details` |
| E-user | direct (header context) | basic `UserResponse` for nav + role gating |
| E-wallet | direct (Do-Payment reserve) | (17 drifts) — 3-tier hierarchy understanding required; `Balance` nullability inconsistency |
| E-session | platform | (10 drifts) |
| E-wallet-record | indirect (post-reserve commit) | `TransactionId` from `DirectDebitResponse`; `AlreadyApplied` idempotency marker |
| E-account / E-node / E-account-settings / E-contract | indirect | feature reads tenant + currency + account scope |

**Cross-service touches:**
- Commerce → Charging gRPC/Kafka on reserve/commit
- WhatsApp Business child page (stub) eventually consumes Templates entity (not yet seeded) — GAP-TM-02

### 4.3 `marketplace-applications` — 4 direct + 4 indirect

Mirror of comms-hub. Service-card pattern + payment dialog.

| Entity | Touch | Top drift items |
|---|---|---|
| E-app-config | direct (service cards) | (13 drifts) — mirror of CommChannelConfig |
| E-user | direct (header) | same as comms-hub |
| E-wallet | direct (Do-Payment) | (17 drifts) |
| E-session | platform | (10 drifts) |
| E-wallet-record | indirect (post-debit) | `TransactionId` + `RemainingBalance` |
| E-account / E-node / E-account-settings / E-contract | indirect | tenant scoping |

### 4.4 `contact-groups` — 3 direct + 4 indirect

The only feature touching `E-contact-group` + `E-upload-session`. Strong client-side authority (Falcon admin denied; clients own CRUD).

| Entity | Touch | Top drift items |
|---|---|---|
| E-contact-group | direct (CRUD) | (19 drifts — highest in catalog) — `contactId`↔`GroupId`, `uploadedCount`↔`RowCount`, persistent ref ↔ pre-signed URL, `sharedWith[]`↔`IsShared` + dual-fetch, `softDeleted` not on response (Falcon download-deleted UI blocked) |
| E-upload-session | direct (wizard Step 1) | (10 drifts) — `UploadId`↔`UploadSessionId` rename, `ExpiresInSeconds` relative shape, state encoded via 5 error codes (not a field), `PreSignedUrl` + `MaxFileSizeMB` extras |
| E-user | direct (share UI) | (9 drifts) — `SharedUserIds[]` resolves against Identity `UserInfoResponse`; `IdentityServiceError` if lookup fails |
| E-account / E-node / E-account-settings / E-session | indirect | tenant + node + auth scoping |

**Cross-service touches:**
- Kafka `contactgroup.import-requested.v1` produced by Contact-Group service
- Identity service resolves `SharedUserIds[]` (sync REST call → 502 on failure)
- S3 (via pre-signed URLs) for original + validated file storage
- Templates (cross-PRD-04↔05) — column names become template variables when a group binds to a template (BR-TM-12) — blocked by GAP-TM-02

### 4.5 `wallet-balance-management` — 4 direct + 4 indirect

Falcon-mostly. Primary surface for the 3-tier wallet hierarchy.

| Entity | Touch | Top drift items |
|---|---|---|
| E-wallet | direct (primary read) | (17 drifts) — 3-tier (Master/CommChannel/Owner/Sub), Master+Owner `decimal?` vs CommChannel `decimal`, `walletId` (lowercase-w) on Sub, no public CRUD, currency missing on response |
| E-wallet-record | direct (ContractBalanceSummary) | (12 drifts) — no first-class DTO, `valueSar` ↔ `AvailableAmount` semantic shift, `walletId` + `createdAt` absent on summary |
| E-account-settings | direct (BalanceTransferLimit %) | feeds transfer dialog amount cap |
| E-session | platform | (10 drifts) |
| E-contract | indirect | `RemainingBalance` per-contract attribution |
| E-rate-card-entry | indirect | per-row tooltip context |
| E-account / E-node / E-user | indirect | scope + header |

**Cross-service touches:**
- Charging direct (POST `/Wallet/transfer`, `/Wallet/debit`, `/Wallet/reserve`)
- Commerce → Charging Kafka `WalletConfigured` lifecycle events

### 4.6 `contracts-cost-management` — 4 direct + 3 indirect

Strongest authority asymmetry per parity matrix. acc-admin + acc-user denied; only acc-owner can land.

| Entity | Touch | Top drift items |
|---|---|---|
| E-contract | direct (CRUD) | (19 drifts) — `EndDate` vs "Expiration Date", missing `[MaxLength]` on Name + farabiRefId, `[Range]` upper unenforced for valueSar, status-aware edit gate, currency cross-service drift, `CanEdit` + `TariffPlan` + `BusinessTimeZone` extras |
| E-rate-card-entry | direct (Step 2 matrix) | (8 drifts) — **`commChannelId` MISSING on backend DTO** (high severity), `[Range]` allows 0 (PRD implies positive), `Code/Name/RatingUnit/Status` extras |
| E-addon | direct (Step 4) | (10 drifts) — 1:2 structural split (Quotas + OverageRates), `SubService` nullable inconsistency, `IncludedAmount` vs `freeCreditValue` rename, `UnitPrice` vs `rateCardValue` rename |
| E-user | direct (header) | (9 drifts) — minor |
| E-session | platform | (10 drifts) |
| E-wallet / E-wallet-record | indirect | Contract activation funds Master Wallet → triggers WalletRecord creation via Kafka |
| E-account / E-node | indirect | scope binding |

**Cross-service touches:**
- Commerce → Charging Kafka `ContractLifecycle` (Pending → Active funds Master Wallet)
- Commerce → Provisioning Kafka `ServiceOrderCreated` (Addon sub-service activations)
- Commerce → Charging consumer rebuilds rate card matrix for `NoApplicableRate` lookups

### 4.7 `testing-charging` — 5 direct + 3 indirect

Admin-only diagnostic surface; mutates real OCS state via `Settings:TestingCharging:Enabled` flag. Not exposed to Client per security boundary.

| Entity | Touch | Top drift items |
|---|---|---|
| E-wallet | direct (`TestingChargingWalletSnapshotResponse`) | (17 drifts) — same hierarchy + nullability picture as wallet-balance |
| E-wallet-record | direct (`TestingChargingLedgerEntryResponse`) | (12 drifts) — **only feature exposing per-record ledger rows** (paged) |
| E-contract | direct (scenario picks contract id) | (19 drifts) |
| E-rate-card-entry | direct (matrix lookup) | (8 drifts) |
| E-user / E-session | platform | admin-only header + auth |
| E-account / E-node | indirect | scope binding |
| E-account-settings | indirect | reads `Settings:TestingCharging:Enabled` to gate the page |

**Cross-service touches:** internal Charging endpoints only — no Kafka emit. Diagnostic outputs feed admin UI directly.

## 5. The 4 drift verdicts in detail

### ✅ MATCH — clean PRD↔backend alignment

**Implication:** standard wiring; no special mapper. Examples drawn from the catalog:

1. **`Contract.startDate` / `endDate` typing** — [BRAIN-OUT] E-contract: both sides use `DateTime [Required]`. No FE work beyond the cross-field `endBeforeStart` validator.
2. **`User.email` / `phoneNumber` types** — [BRAIN-OUT] E-user: round-trip `string` on both write (`UserPersonalInformation`) and read (`UserResponse`).
3. **`UploadSession.fileName` / `contentType` / `fileSizeBytes`** — [BRAIN-OUT] E-upload-session: clean match on `InitUploadRequest` shape; only the absolute-vs-relative `expiresAt` shape differs.

### ⚠ DRIFT — both sides present, property mismatch

**Implication:** map at the service-layer, never hand-rolled in components. Examples:

1. **`Contract.expirationDate` ↔ `EndDate`** (naming) — [BRAIN-OUT] E-contract. Edit Contract UI labels MUST match PRD vocabulary ("Expiration Date"); the wire field is `EndDate`. Mapper at the contracts API service.
2. **`Wallet.balance`** is `decimal?` on Master + Owner, `decimal` on CommChannel + Sub-wallet — [BRAIN-OUT] E-wallet. **Internal inconsistency** between same-concept fields. FE must defensively null-coalesce all wallet balance reads.
3. **`OtpChallenge.expiresAt`** modeled as `OtpExpiresInSeconds: int?` (relative TTL) — [BRAIN-OUT] E-otp-challenge. FE computes `expiresAt = now + OtpExpiresInSeconds` in the OTP popup component.

### ❌ MISSING — PRD field has no backend counterpart

**Implication:** FE either renders a placeholder, hardcodes a default, fetches via another path, or surfaces as a gap. Examples:

1. **`Account.financeId`** — [BRAIN-OUT] E-account: not enumerated in `DTO_DICTIONARY.md` Info breakdown. FE cannot populate this field on Edit Settings forms today. Surface as candidate gap.
2. **`RateCardEntry.commChannelId`** — [BRAIN-OUT] E-rate-card-entry: backend `ContractUnitConversion*` DTOs carry no `ChannelId`. FE rendering of a per-CommChannel rate matrix in Add Contract Step 2 is **structurally blocked** until backend exposes the link or until the FE encodes via `Code`/`Name`/`RatingUnit` semantics.
3. **`Session.idleTimeoutAt`** — [BRAIN-OUT] E-session: not on any DTO. FE hardcodes the 30-minute rule client-side via a setInterval against JWT `iat`. PRD-level idle-timeout rule not server-driven.
4. **`ContactGroup.softDeleted`** — [BRAIN-OUT] E-contact-group: backend has `DeleteContactGroupRequest` but no `SoftDeleted`/`IsDeleted` indicator on response/list DTOs. **Blocks the Falcon view-only "see deleted groups" UI** (BR-CGM-28).
5. **`OtpChallenge.userId`** — [BRAIN-OUT] E-otp-challenge: not on public DTOs. **Intentionally missing** (correct security — server resolves from `SessionId`). The PRD models it because conceptually each challenge belongs to a user; FE never needs it on the wire.

### ➕ EXTRA — backend carries a field PRD doesn't enumerate

**Implication:** platform concern, FE honours but doesn't render. Or FE convenience flag, FE renders. Examples:

1. **`UserResponse.CreatedBy`, `Path`** — [BRAIN-OUT] E-user: backend audit + node-path; FE surfaces `Path` in breadcrumbs, ignores `CreatedBy` unless an audit UI exists.
2. **`AccountHierarchyNodeResponse.CanSave`, `WalletBalanceType`, `WalletType`** — [BRAIN-OUT] E-account: FE-convenience flags driving edit-state + wallet topology UX. Render directly per [BRAIN-OUT] OH page conventions.
3. **`ContractResponse.CanEdit`, `TariffPlan`, `BusinessTimeZone`, `StartLocalDateTime`, `EndLocalDateTime`** — [BRAIN-OUT] E-contract: FE renders `CanEdit` to toggle per-field disabling per [BRAIN-OUT] V-contract-edit-status-aware-fields; renders Local DateTime fields in the user's tz-aware display.
4. **`AuthenticatedResult.<access>`, `<id>`, `<refresh>`** — [BRAIN-OUT] E-session: standard OAuth2/OIDC token bundle. FE stores in the auth provider, never renders.
5. **`LoginStepResponse.DevOtpCode?`** — [BRAIN-OUT] E-otp-challenge: development-mode-only OTP leak. **Security flag** — FE must not render in production builds (verified via `environment.production` guard).
6. **`PreSignedUrl`, `MaxFileSizeMB`, `ExpiresInSeconds`** on `InitUploadResponse` — [BRAIN-OUT] E-upload-session: required for S3 PUT flow + size-cap hint + ttl computation.
7. **`AlreadyApplied`** on `DirectDebitResponse` / `ReserveWalletChargeResponse` / `UpdateWalletReservationResponse` — [BRAIN-OUT] E-wallet-record: idempotency indicator. **MUST be honoured by FE** to avoid double-counting on retry.

## 6. Cross-service touches

Which entities cross service boundaries (= multi-handler validation, Kafka events, gRPC east-west, or shared cache). Implementers MUST verify the downstream consumer when changing any of these.

| Entity | Owned by | Read by (downstream) | Linkage mechanism |
|---|---|---|---|
| E-account | commerce | identity (Step 5 user create), charging (wallet topology), core-gateway (tenant + IP cache), access-pes (permission context) | Kafka `UserCreationRequested`, `WalletConfigured`, `ServiceOrderCreated`; Redis tenant-IP cache; JWT tenant id |
| E-account-settings | commerce | identity (PasswordPolicy + IpAllowlistPreProcessor), core-gateway (Redis IP cache), access-pes (permission context) | Kafka `commerce.tenant-ip-allowlist-changed.v1`; gRPC `GET /Security/ip-allowlists`; embedded in Account |
| E-user | identity | commerce (UserCreationRequested consumer at Step 5; reverse), access-pes (PermissionGroupId join), gateways (JWT forwarding) | Kafka `UserCreationRequested`; JWT claims (`sub` = Zitadel id, `tenantId`, `nodeId`, `path`); identity proxies Zitadel |
| E-node | commerce | identity (User.NodeId), access-pes (Path-based scoping) | implicit via User.NodeId; JWT `path` claim |
| E-comm-channel-config | commerce | templates (reads master + per-account), charging (pricing logic for app charges) | Kafka `ServiceOrderCreated` after DoPayment |
| E-app-config | commerce | provisioning (sub-service activation), charging (billing) | Kafka `ServiceOrderCreated` |
| E-contract | commerce | charging (`ContractLifecycle` Kafka consumer drives wallet funding + matrix reads), provisioning (`ServiceOrderCreated`) | Kafka `ContractLifecycle`, `ServiceOrderCreated`; Master Wallet funding on Pending → Active |
| E-rate-card-entry | commerce | charging (rate engine reads via Kafka projection) | Kafka `ContractLifecycle` |
| E-addon | commerce | charging (Quotas evaluated first, OverageRates fallback), provisioning (sub-service activation via `SubService`) | Kafka `ContractLifecycle`, `ServiceOrderCreated` |
| E-wallet | charging | commerce (gateway aggregations project balances onto hierarchy response), provisioning (activation reads balance), system-gateway / core-gateway (JWT forwarding) | gRPC + Kafka; testing-charging endpoints `TestingChargingWalletSnapshotResponse` |
| E-wallet-record | charging | commerce (ContractBalanceSummary read), testing-charging (`TestingChargingLedgerEntryResponse`) | derived from Reserve/Commit/Debit handlers + `ContractLifecycle` events |
| E-otp-challenge | identity | core-gateway (IpAllowlistPreProcessor runs **before** OTP endpoints), zitadel (delivery), access-pes (engages once `Stage == Authenticated`) | Zitadel adapter; `SessionId` lineage shared with `E-session` |
| E-session | identity | core-gateway + system-gateway (JWT validation, tenant + path forwarding), access-pes (permission decisions per request), zitadel (token issuance/refresh) | JWT bearer; refresh proxied through identity |
| E-contact-group | contact-group | templates (cross-PRD-04↔05 — column names → template variables, BR-TM-12), access-pes (share-policy gating), identity (`IdentityServiceError` resolving `SharedUserIds[]`) | Kafka `contactgroup.import-requested.v1`; sync REST call to Identity for user resolution |
| E-upload-session | contact-group | S3 (pre-signed PUT), hangfire (orphan cleanup), contact-group create (`UploadSessionId` join) | pre-signed URL flow; background job |

### Notable structural cross-cuts

- **User owned by Identity, NOT Commerce** — Wiki rule (per [BRAIN-OUT] `Home/Software-Architecture-Design/Account-Management-Module.md` + memory `feedback_frontend_auth_identity_service.md`). Commerce's `CreateAccountRequest.AccountOwner` block flows to Identity via Kafka `UserCreationRequested` — Commerce never persists users directly. Per memory `feedback_pes_g_link_uses_zitadel_id.md`, PES `g`-rule `obj` MUST be `u:<ZitadelUserId>@<ns>`, NEVER `u:<MongoObjectId>@<ns>` — FE `CurrentSubjectBuilder` derives subject from `JWT.sub`.
- **Node carries NodeId into Identity Users** — `User.NodeId` is set at create time and used by access-pes for path-based scoping. Updating a node's name does NOT cascade to user records (users carry the id, not the name).
- **Wallet 3-tier hierarchy is backend-only** — PRD models one Wallet entity; backend exposes Master / CommChannel / Owner / CommChannelSubWallet. FE must understand the tree to render balances correctly; mgmt-console drops Master Wallet card (Falcon-only per parity matrix).
- **Contract → Wallet funding is event-driven** — Pending → Active transitions in Commerce produce a Kafka `ContractLifecycle` event consumed by Charging, which creates wallet records funding Master Wallet. Contracts feature never writes to charging directly.
- **OtpChallenge and Session share a `SessionId` lineage** — backend collapses the PRD's two entities into one `AuthenticationSession` record that transitions through stages (`InProgress` → `OtpRequired` → `PasswordChangeRequired` → `Authenticated`). FE distinguishes via `LoginStepResponse.Stage`.

## See also

- [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md) — the 7-feature parity grid + per-role landing table
- [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) — sibling matrix on V-rules
- [BRAIN-OUT] `understanding/backend/<service>/DTO_DICTIONARY.md` (one per service) — concrete request/response shapes
- [BRAIN-OUT] `understanding/backend/<service>/ENDPOINT_REGISTRY.md` — endpoint inventory per service
- [BRAIN-OUT] `prd/modules/<NN-name>/ENTITIES.md` — PRD-side entity definitions
- Brain SK `_obsidian/00-Home/API_INDEX.md` — the vault graph hub for entities
