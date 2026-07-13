*** PRD Understanding - Basic Send Application - PLATFORM_GROUNDING ***

# BSA Platform Grounding — What the Falcon Backend Has Today vs What a NEW BSA Backend Must Build

> Deep-reading analyst report · 2026-07-06 · READ-ONLY over brain stores.
> Grounds the Basic Send Application (BSA) PRD (`scratchpad/basic-send-prd/prd-v5.md`) against the real Falcon backend knowledge.
> Source prefixes: `[PRD]` = BSA PRD v5 section · `[PRD-03/04/05]` = platform PRD modules · `[BRAIN-OUT]` = `C:\Falcon\Brain Outputs\...` · `[VAULT]` = wiki-architect/falcon-wiki note · `[MEMORY]` = `C:\Users\User\.claude\projects\C--Falcon\memory\...` (point-in-time; flagged) · `[INFERRED]` = my reasoning, flagged.
> Trust ladder per [BRAIN-OUT] `datasets/authority-dataset/VERIFICATION-STATUS.md`: 🟢 code-verified · 🟢 build-verified · 🟡 structurally checked/spot-checked · ✋ runtime-verified · 🔴 unverified.

---

## 0. Executive summary

- **BSA already exists as a catalog SKU, not as software.** The Commerce Applications catalog contains an application literally named "Basic Send App" (`695a304f901bb7d4a830d0dc`) that can be priced in contracts, made visible, and purchased through the existing marketplace do-payment flow — runtime-verified on the local stack. There is **no runtime application behind it** — no transaction engine, no send pipeline, no BSA API. [MEMORY] `reference_create_contract_api_sysadmin_recipe_2026_06_25.md` · [MEMORY] `project_module_06_bsa_2026_05_19.md`
- **The charging substrate BSA's Send Logic requires is fully built and is exactly shaped for it.** Charging (OCS) exposes `reserve/authorize → commit | release`, `debit`, idempotency-as-success (`AlreadyApplied` on `ReferenceType+ReferenceId`), reservation TTL + expiry sweeper, a rating engine keyed on `ApplicationId/Channel/Priority/Destination/Unit` (error `NoApplicableRate`), per-strategy wallet resolution (UserBased/NodeBased × SingleWallet/MultipleWallets), a Redis `ocs:realtime-events` stream naming WHATSAPP/SMS/VOICE as "hot channels", and even a **WhatsApp batch simulator** (Charging Lab) that drives the production reserve/commit/release handlers per message. [BRAIN-OUT] `understanding/backend/charging/*`
- **Every BSA read-side dependency exists:** marketplace purchase + order status (Commerce), commchannel status/visibility per node (Commerce + Provisioning), wallet balances + contract balance summaries (Charging + gateway aggregation), contact groups own/shared/columns/contacts (Contact Group svc), voice records library + IVR/voice templates + WhatsApp template entity (templates-svc `feat/ivr-templete`, 42 OpenAPI paths, deployed locally), PES authorize/advise (Access svc, runtime-verified).
- **What is genuinely missing is the entire BSA execution plane:** transaction compose/store/schedule, batch processor + balance orchestration loop, real Meta WhatsApp Cloud API send + message-status webhooks, SIP/voice dialer + per-second realtime charging loop, conversation store + 24h customer-service-window logic, voice retry engine, exports, the BSA public API + the 4 Skeleton APIs, and a Sender-ID registry (WABA numbers / SIP numbers — the Voice Account screen today is FE **mock-only**, "no backend exists"). Several of these are **CONFIRMED-ABSENT** by the brain's own gap documents, not merely unfound.
- **Integration recipe is well-documented:** YARP gateway with `/{service}/{**remainder}` → strip prefix + prepend `/api`, ClientOnly/FalconOnly policies, per-tenant rate limiter, Zitadel JWT with `urn:zitadel:iam:org:project:roles` + user-metadata claims, PES subject `u:<JWT.sub>@<tenant-id>` (runtime-verified 21/21), Kafka `service.event-name.v1` Avro topics with outbox pattern, `ServiceOperationResult<T>` envelope, `FalconException(FalconKeys.Error.X)` + per-service `ErrorMessages.{en,ar}.resx`.

---

## 1. EXISTING — services/endpoints that already cover BSA dependencies

### 1.1 Marketplace application purchase / activation

BSA needs ([PRD] "Application Purchase, Activation, and Navigation"): AO/Falcon-only purchase from Marketplace, status → Active immediately after purchase, submenu creation, access by all Normal Users unless overridden.

**Owner: Commerce (order + payment orchestration) + Provisioning (subscription record) + Charging (payment processing via Kafka).**

| Capability | Endpoint / mechanism | Source |
|---|---|---|
| Purchase an application | `POST /api/Node/application/do-payment` (`DoPaymentApplicationRequest` → `ICreateFalconServiceOrderHandler`) | [BRAIN-OUT] `understanding/backend/commerce/ENDPOINT_REGISTRY.md` + `controllers/NodeController/ENDPOINTS.md` |
| Purchase a comm-channel | `POST /api/Node/comm-channel/do-payment` (same handler family) | [BRAIN-OUT] `understanding/backend/commerce/ENDPOINT_REGISTRY.md` |
| Poll order status after purchase | `GET /api/Node/order/{orderId}/status` → `GetOrderStatusResponse` (order id, status, last update, payment/charging linkage) | [BRAIN-OUT] `understanding/backend/commerce/controllers/NodeController/{ENDPOINTS,DTOS}.md` |
| Async payment loop | Kafka: Commerce produces `commerce.order-created.v1` → Charging `FalconServiceOrderCreatedEventConsumer` processes payment → Charging produces `charging.order-payment-processed.v1` → Commerce updates order | [BRAIN-OUT] `understanding/backend/commerce/SERVICE_OVERVIEW.md` §Kafka + `charging/SERVICE_OVERVIEW.md` §Kafka |
| List applications for a node (full catalog) | `GET /api/Node/{id}/applications` → `List<AccountApplicationResponse>` | [BRAIN-OUT] `understanding/backend/commerce/ENDPOINT_REGISTRY.md` |
| List VISIBLE applications with details (marketplace read) | `GET /api/Node/{NodeId}/applications/visible/details` — twin of the comm-channels visible/details endpoint; mgmt marketplace repointed to it | [MEMORY] `project_applications_visible_details_endpoint_marketplace_2026_06_22.md` (BE draft PR 42748; deployed locally; route flipped 404→401 = resolves) |
| Global application catalog | `GET /api/Application` → `List<ApplicationResponse>` | [BRAIN-OUT] `understanding/backend/commerce/ENDPOINT_REGISTRY.md` |
| Subscription record per account (status/visibility/actions) | Provisioning `GET /api/Services/account/{id}/applications` → `GetAccountApplicationServiceRespose { ApplicationId, Visibility, AccountId, eProductSubscriptionStatus Status, bool CanHide, List<eFalconServiceAction> AvailableActions }` | [BRAIN-OUT] `understanding/backend/provisioning/{ENDPOINT_REGISTRY,DTO_DICTIONARY}.md` |
| Action-availability model (who sees DoPayment/Disable/Enable) | Backend `AllowedFalconServiceActionsGenerator.cs:10-50` builds `availableActions[]` from userType + Visibility + Status (InActive→+DoPayment if pricing configured; Active→+Disable; Expired→+DoPayment; Disabled→+Enable); payment currently transitions **directly to Active** (`Activate()` Operations.cs:156) — matches BSA "Active immediately, no additional activation steps" | [MEMORY] `project_service_action_display_model_2026_06_25.md` (cross-grounded vs [BRAIN-OUT] BR-AM-20 6-state spec — see drift §5) |
| "Basic Send App" exists as a purchasable catalog item | Commerce `Applications` catalog id `695a304f901bb7d4a830d0dc` on test-tenant-001; visible + priceable in contracts | [MEMORY] `reference_create_contract_api_sysadmin_recipe_2026_06_25.md` ✋ |
| BSA is spec'd auto-available at account creation, default 0 SAR one-time | BSA BRD V2: "AUTOMATICALLY AVAILABLE for every account on creation · Visibility enabled · One-time payment · 0 SAR (Falcon-editable)" | [MEMORY] `project_module_06_bsa_2026_05_19.md` (source `C:\Falcon\PRD\BRDs\6- Basic Sending App\Basic Send Application-V2.docx`) — note [PRD] v5 instead says "purchased only from the Marketplace"; see conflicts §5 |
| PES gates for purchase | `managementConsole.services.payment` = **only acc-owner**; `adminConsole.services.payment` = sys-admin · sys-products — matches [PRD] "Account Owner & Falcon Usertype only allowed to purchase" | [BRAIN-OUT] `datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md:45,72` 🟢 code-verified |
| Submenu after activation | FE concern; dynamic `microapp.<name>` PES factory exists (`FalconAccess.microApps.mount(name)`); sidebar child-route pattern proven for CommChannels submenu | [BRAIN-OUT] REGISTRY-RAW.md:144 + [MEMORY] `project_commchannels_submenu_meta_voice_ai_2026_06_30.md` |

**Verdict: COVERED for purchase/activation/read.** The only purchase-side gap is business drift (Paid/Activate 6-state model per BR-AM-20, CR 126240) — a Commerce/platform concern, not BSA scope.

### 1.2 CommChannel status read (BSA send-button gating)

BSA needs ([PRD] "BSA Behavior Based on WhatsApp/Voice Communication Channel Status"): read the WhatsApp/Voice channel status for the account; disable Send when not Active; fail scheduled transactions when channel unavailable at due time.

| Capability | Endpoint | Source |
|---|---|---|
| Channels for node (full, enriched: `ChannelId, Visibility, PricingType, PriceValue, Status, CanHide, AvailableActions`) | Commerce `GET /api/Node/{id}/comm-channels` → `List<AccountCommunicationChannelResponse>` | [BRAIN-OUT] `understanding/backend/commerce/ENDPOINT_REGISTRY.md` + `controllers/NodeController/DTOS.md` |
| Visible-only slim list | Commerce `GET /api/Node/{NodeId}/comm-channels/visible` → `List<VisibleCommunicationChannelResponse>` | [BRAIN-OUT] same |
| Visible-only with details (client marketplace view) | Commerce `GET /api/Node/{NodeId}/comm-channels/visible/details` | [BRAIN-OUT] same; ✋ row-mutation flow browser-verified 2026-05-21 per VERIFICATION-STATUS.md §service-pricing |
| Subscription-side status | Provisioning `GET /api/Services/account/{id}/comm-channels` → `GetAccountCommunicationChannelServiceRespose { CommChannelId, Visibility, Status (eProductSubscriptionStatus), CanHide, AvailableActions }` | [BRAIN-OUT] `understanding/backend/provisioning/DTO_DICTIONARY.md` |
| Global channel catalog | Commerce `GET /api/CommunicationChannel` | [BRAIN-OUT] `understanding/backend/commerce/ENDPOINT_REGISTRY.md` |
| Status vocabulary (current code) | 5 statuses `None(0)/InActive(1)/Active(2)/Expired(3)/Disabled(4)` — BSA's "Expired, Disabled or any status that prevents sending" maps 1:1 | [MEMORY] `project_service_action_display_model_2026_06_25.md` citing `[CODE] Enums.cs` |
| Grace-period semantics ("grace period finished" fail reason) | BR-AM-21 grace = 7d Monthly / 30d Yearly+OneTime; BR-AM-23 renewal-fail → Expired → grace → InActive | [MEMORY] same, citing [BRAIN-OUT] `prd/modules/01.../BUSINESS_RULES.md` |
| Send-capability per state (business flowchart) | InVisible=all hidden · InActive(first)=send NO · Paid+Active=send YES · Expired/grace=send NO (templates still editable) · Disabled=all hidden — matches BSA gating exactly | [MEMORY] same (CommChannel Business Review flowchart, CR 126240 sheets) |
| Channel-visibility change events | Kafka `commerce.comm-channel-shown.v1` (→Charging) + `commerce.comm-channel-visibility-changed.v1`, `commerce.comm-channel-init.v1` (→Templates) — a BSA service can subscribe the same way | [BRAIN-OUT] `charging/SERVICE_OVERVIEW.md` + `templates/SERVICE_OVERVIEW.md` §Kafka |

**Verdict: COVERED for reads + events.** What does NOT exist: any *push* of channel-status to a scheduler (BSA's "scheduled transaction fails at due time when channel inactive" must re-check at execution time — the read endpoints support that) [INFERRED].

### 1.3 Wallet / balance + charging (reservation, commit, refund; balance strategies)

BSA needs ([PRD] "Send Logic"): no reservation at creation; per-record/batch reserve→proceed→commit|refund at execution; comply with balance strategy (UserBased/NodeBased × Single/Multiple wallet); no balance failover; abort on insufficient balance; cost estimation; per-second voice deduction.

**Owner: Charging (`Falcon.Charging.Api`, :7224) — the platform OCS.** [BRAIN-OUT] `understanding/backend/charging/SERVICE_OVERVIEW.md`: owns wallets (master / per-comm-channel / per-owner sub-wallets), reservation lifecycle "for usage-based billing (e.g. WhatsApp message charging)", direct debit, transfers, contract balance summaries, real-time charging core (Redis stream `ocs:realtime-events` for hot channels **WHATSAPP / SMS / VOICE**), Charging Lab simulator.

| Capability | Endpoint | Source |
|---|---|---|
| Read all wallets for an account | `POST /api/Wallet/get-account-wallets` `{AccountId, OwnerIds[]}` → `{MasterWallet, CommChannelWallets[], OwnerWallets[{OwnerId, Balance, CommChannelSubWallets[]}]}` | [BRAIN-OUT] `charging/controllers/WalletController/{ENDPOINTS,DTOS}.md` |
| Per-contract remaining balance | `GET /api/Wallet/contract-balance-summaries?accountId=` → `Summaries[{ContractId, AvailableAmount}]` | [BRAIN-OUT] same |
| Two-phase charge: reserve/authorize | `POST /api/Wallet/authorize` + `POST /api/Wallet/reserve` (same handler; comment: "Authorize is phase-1 for delivery-based policies … WA_DELIVERY_COMMIT must create the hold during authorization") — `ReserveWalletChargeRequest { AccountId, OwnerId, Channel, Currency, ApplicationId, Priority="NONE", Destination="ANY", Unit, Quantity, PolicyCode, ReferenceType, ReferenceId, ChargeKind=Usage, QuotaCode?, SubService?, ReservationTtlSeconds=300 }` → `{ ReservationId, RatedAmount, QuotaUnits, BilledUnits, ExpiresAt, AlreadyApplied }` | [BRAIN-OUT] `charging/controllers/WalletController/{ENDPOINTS,DTOS,OVERVIEW}.md` |
| Commit on delivery success | `POST /api/Wallet/commit` `{ReservationId}` → `{ReservationId, Status, RatedAmount, QuotaUnits, BilledUnits, AlreadyApplied}` | [BRAIN-OUT] same |
| Refund/release on failure | `POST /api/Wallet/release` `{ReservationId}` (same response shape) — this IS the BSA "deduct then refund on internal failure" primitive | [BRAIN-OUT] same |
| One-shot final debit | `POST /api/Wallet/debit` (`DirectDebitRequest { AccountId, Amount, Currency, ReferenceType, ReferenceId, Description?, ServiceId? }`) → `{TransactionId, DebitedAmount, RemainingBalance, AlreadyApplied}` | [BRAIN-OUT] same |
| Transfer (contract-lineage-preserving) | `POST /api/Wallet/transfer` | [BRAIN-OUT] same |
| Idempotency | duplicate `(ReferenceType, ReferenceId)` → success + `AlreadyApplied=true`, original transaction id — retry-safe batch processing built-in | [BRAIN-OUT] `charging/ERRORS.md` §Idempotency-as-Success |
| Rating engine (cost estimation input) | Reservation rates against active contract tariffs by `ApplicationId/Channel/Priority/Destination/Unit`; no combo → `NoApplicableRate`; nearest-expiring-Active-contract-first per BR-CC-31/32 (cascade server-side; tie-break OPEN Q-CC-02) | [BRAIN-OUT] `charging/ERRORS.md` + `prd/modules/03.../BUSINESS_RULES.md:71-76` + `GAPS.md` GAP-CC-18/20 |
| Reservation TTL + auto-expiry | `OcsReservationExpiry` sweeper (50-batch, 5s poll); `ReservationNotFound` on commit of expired reservation ("retry the full reserve-commit cycle") | [BRAIN-OUT] `charging/SERVICE_OVERVIEW.md` + `ERRORS.md` §Reservation Lifecycle |
| Optimistic concurrency for hot wallets | `MongoOcsRepositoryBase` optimistic concurrency; `WalletVersionConflict` after `MaxOptimisticRetries:3` — answers PRD-03 Q-CC-05 (concurrent deduction) | [BRAIN-OUT] `charging/SERVICE_OVERVIEW.md` + `ERRORS.md` |
| Insufficient balance | error `InsufficientBalance` — the BSA abort trigger | [BRAIN-OUT] `charging/ERRORS.md` |
| Balance strategies (the exact BSA vocabulary) | Commerce `POST /api/Setting/wallets` (`ConfigureWalletSettingsRequest { WalletBalanceType: 1=UserBased/2=NodeBased, WalletType: 1=SingleWallet/2=MultipleWallets }`, **FalconOnly**) + `GET /api/Setting/wallets/{ownerId}`; effective defaults `NodeBased` + `SingleWallet`; Charging materializes wallets from `commerce.wallet-configured.v1`, per-user sub-wallets from `commerce.user-wallet-create.v1`, per-subnode from `commerce.subnode-wallet-create.v1`, channel sub-wallets from `commerce.comm-channel-shown.v1` | [BRAIN-OUT] `commerce/controllers/SettingController/{DTOS,VALIDATIONS}.md` + `commerce/controllers/AccountHierarchyController/VALIDATIONS.md:53-54` + `charging/SERVICE_OVERVIEW.md` §Kafka |
| Owner-wallet resolution per strategy | UserBased → Identity `GET /api/user/by-tenant` owners; NodeBased → Commerce node tree (documented in gateway aggregation + TestingAccounts overview) | [BRAIN-OUT] `GATEWAY_ROUTE_MAP.md:54` + `commerce/controllers/TestingAccountsController/OVERVIEW.md:83-84` |
| Aggregated hierarchy+balances read for UI | Core GW `GET /api/commerce/accounts/{Id}/hierarchy` (Commerce + Identity + Charging merge) | [BRAIN-OUT] `core-gateway/ENDPOINT_REGISTRY.md` |
| **Working batch reserve/commit/release reference implementation (WhatsApp)** | Charging Lab: `POST /api/testing/charging/whatsapp/batches` (clamp MessageCount 1..1000, per-message ref `testing-wa-{runId}-{sequence}`, per-message reserve through the **production** handler, delivery trigger → commit|release, TTL diagnostics, run counters) + 7 read endpoints (overview/wallets/reservations/ledger/balances/runs) + System GW BFF passthrough `/api/testing/charging/*` | [BRAIN-OUT] `charging/controllers/TestingChargingController/OVERVIEW.md` + `charging/ENDPOINT_REGISTRY.md` + `GATEWAY_ROUTE_MAP.md` §TestingCharging |

**Verdict: the charging/wallet dependency is COVERED at the API level, including the exact reserve→commit/release per record/batch semantics the BSA Send Logic describes.** The Charging Lab is a production-handler-faithful blueprint of the BSA WhatsApp batch loop (its class comment: "The simulator delegates to the existing reserve/commit/release handlers; it does not bypass rating, quota, wallet mutation, idempotency, ledger, or outbox rules").
**NOT covered:** per-second realtime debit loop for live voice calls (see §3.4); the BSA-side orchestration (which wallet/owner to charge for a given sender/user — the Lab's owner-resolution helper is explicitly QA-only convenience, `TestingChargingService.cs:422-432`) [BRAIN-OUT] TestingChargingController/OVERVIEW.md §3.

### 1.4 Templates retrieval (approved / own / shared) — WhatsApp + Voice/IVR

BSA needs ([PRD] "Send Whatsapp Message", "Send Voice IVR Message", "API §Skeleton"): select pre-approved templates created-by-me or shared-with-me; 3-tier WhatsApp hierarchy (Category → Language → Name); variables list; template status re-check at execution; Voice IVR 2-tier (Static/Dynamic → Name); templates carry Reference ID.

**State is two-layered — the brain's backend scan is STALE here and memory supersedes it:**

- **Stale layer** (scan of ~2026-05): templates-svc = only 3 `communication-channel-configs` endpoints; "The Template entity … has **no production code anywhere in the platform today**" [BRAIN-OUT] `understanding/backend/templates/ENDPOINT_REGISTRY.md` + `prd/modules/05-templates/GAPS.md` (GAP-TM-01..28) + `QUESTIONS.md:97` + `understanding/pages/templates-list/08-BACKEND_API.md`.
- **Current layer** ([MEMORY], 2026-06-10 → 2026-07-06):
  - Gateways gained a `templates-cluster` + templates proxy routes via PRs 41572/41573 (both gateways; YARP cluster → `http://templates:8080`) [MEMORY] `project_signalr_mode_branch_set_and_main_baseline_2026_06_10.md` F1.
  - templates-svc branch **`feat/ivr-templete`** (@`21ced39`, later `54c3f22`) "adds a large IVR / Voice Template feature **on top of WhatsApp templates** (Voice Records Library w/ S3 audio, Voice Templates CRUD/approve/reject/share, channel-neutral vs WhatsApp endpoint route groups …). 196 files, +9199/−230"; deployed to local Docker on :7264; **OpenAPI = 42 paths**, Swagger live ✋ [MEMORY] `project_templates_svc_local_docker_deploy_2026_06_30.md`.
  - Voice Records read endpoints now emit a **nested `sharePolicy { sharedWithAllUsers, sharedUsers[] }`** — "Same shape as Contact Group sharePolicy" (own/shared semantics wired) [MEMORY] `project_voice_record_sharepolicy_read_side_2026_07_06.md` (commit `54c3f22`).
  - PES seeds for templates exist: PR 43022 added `sys/acc.voice-template` + `sys/acc.voice-record` resources to `BuiltInRoleCatalog.cs` (acc-user gets view/create/preview/view-shared + creator-scoped delete/share via `"r.obj.createdby"=="r.sub.userid"` PES expression) — the **exact own-vs-shared authorization pattern BSA templates/CG selection needs**, live-verified in the running PES binary [MEMORY] `project_voice_record_pes_gating_2026_07_01.md` ✋.
  - Voice/IVR template NAME rule relaxed to 2–50 any-symbols (commit `014f479`) — IVR template entity confirmed present [MEMORY] `project_voice_record_sharepolicy_read_side_2026_07_06.md`.
  - IVR trees are stored in templates-svc: usage-reader walks `flow.nodes[].content[].voiceRecordId` with `DisplayStatus != Deleted` (delete guard 409 when a record is used by an IVR) [MEMORY] `project_voice_record_ivr_lock_and_header_layout_2026_07_01.md`.
- **Design authority for WhatsApp templates:** [VAULT] `wiki-architect/Home/Software-Architecture-Design/Falcon-Template-Management-BRD-&-Technical-Architecture.md` (4751 lines, newest wiki doc): Template Management Service + Internal Approval Workflow Engine (two-tier, any-to-approve) + **Meta Template Adapter** + **Meta Webhook Handler** + Validation Engine (25+ rules, `WhatsAppTemplateRuleSnapshot`) + Preview Engine + **`Sendability Status` "used by Messaging/Campaign services to gate sending"** — i.e., the platform already plans that BSA consumes template sendability, not raw Meta state. Falcon normalized statuses: Pending Internal | Internally Approved | Submitted To Meta | Approved | Rejected | Restricted | Deleted | Unsupported | Sync Failed.
- Template↔Meta state mapping is PRD-confirmed: BR-TM-26 (In-Review→Pending; Active-Quality-*→Approved usable; **Paused/Disabled→Approved NOT usable**) — the BSA "template no longer Approved → prompt user to reselect" rule is grounded here [BRAIN-OUT] `prd/modules/05-templates/BUSINESS_RULES.md:62`.

**Verdict: PARTIALLY COVERED, trending covered.** Template ENTITIES (WhatsApp + Voice/IVR) with approve/reject/share exist on the deployed branch; own/shared PES semantics exist; category/language/variables are PRD-defined fields. **The precise endpoint list of the 42 paths is NOT in the brain** (registry stale — flagged) and Meta-facing sync/webhook is missing (§3.3). The BSA "Skeleton API to retrieve templates" is therefore a thin façade over an existing service — plus a filter for "Approved + (mine or shared-with-me)".

### 1.5 Contact groups retrieval (own / shared + columns)

BSA needs ([PRD] "Add Recipients", "API"): list CGs created-by-me or shared-with-me, active/not-deleted; per-CG column names ("their final shape"); pick destination column; map columns→variables; iterate recipients.

**Owner: Contact Group svc (`Falcon.ContactGroup.Api`, :7300) — fully built, most-tested service (~80+ tests).** [BRAIN-OUT] `understanding/backend/contact-group/SERVICE_OVERVIEW.md`.

| Capability | Endpoint | Source |
|---|---|---|
| Own groups (node-scoped) | `GET /api/contact-groups` (`NodeId, Page, PageSize`) → `PagedResult<ContactGroupListItemDto>` | [BRAIN-OUT] `contact-group/ENDPOINT_REGISTRY.md` |
| Shared-with-me groups | `GET /api/contact-groups/shared` → same shape | [BRAIN-OUT] same |
| Details incl. column schema (aliases) | `GET /api/contact-groups/{groupId}` → `GetContactGroupDetailsResponse` ("contains the column definitions including their alias keys") | [BRAIN-OUT] `contact-group/DTO_DICTIONARY.md:70` |
| Browse contacts (recipient iteration) | `GET /api/contact-groups/{groupId}/contacts?page=&pageSize=` → `PagedResult<Dictionary<string,object>>` — keys = column aliases from `ColumnConfig` | [BRAIN-OUT] `contact-group/ENDPOINT_REGISTRY.md` + `DTO_DICTIONARY.md:56` |
| Column config at creation | `CreateContactGroupRequest { UploadSessionId, Name, ReferenceId, HasHeader, ColumnConfig, SharePolicy }`; `ColumnConfig` = per-column type + alias | [BRAIN-OUT] `contact-group/DTO_DICTIONARY.md:16,26` |
| Share policy (all-users or list) | `SharePolicy { SharedWithAllUsers, SharedUserIds[] }` + `PATCH /{groupId}/share` | [BRAIN-OUT] same |
| Soft delete ("active = not deleted" filter basis) | `DELETE /{groupId}` soft-delete; 7-day retention; Falcon can still download | [BRAIN-OUT] `contact-group/SERVICE_OVERVIEW.md` + [PRD-04] OVERVIEW |
| File downloads (original/validated) | `GET /{groupId}/files/{fileType}` (pre-signed S3, 15-min expiry) | [BRAIN-OUT] `contact-group/ENDPOINT_REGISTRY.md` |
| Downstream-campaign hook | Kafka **`contactgroup.import-requested.v1`** — produced explicitly to "notify downstream consumers (likely campaign tooling) that a contact group is ready for import" — a natural BSA consumption point | [BRAIN-OUT] `contact-group/SERVICE_OVERVIEW.md` §Kafka |
| PES matrix (own vs shared) | `contactGroup.<action>(scope)` factory; acc-user uniquely holds `view-shared`; edit/delete own-only | [BRAIN-OUT] `datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md:87-105` 🟢; runtime path ✋ (2026-05-28 E2E: "Contact-groups acc-user UNIQUELY sees Shared tab — confirmed in DOM") |
| Reference ID on CG (BSA API lookup key) | `ReferenceId` field on create/update | [BRAIN-OUT] `contact-group/DTO_DICTIONARY.md` |
| PRD cross-link (columns = template variables) | [PRD-04] OVERVIEW: "Columns become template variables when groups are linked to templates"; warn when channel needs a missing column | [BRAIN-OUT] `prd/modules/04-contact-group-management/OVERVIEW.md` |

**Verdict: FULLY COVERED.** The BSA "Skeleton contact-group API" is a filter/reshape of existing endpoints; recipient iteration for the batch engine can page `/contacts` at `ImportBatchSize`-like granularity (CG svc itself batches at 1000, exports at 10000 — config precedent) [BRAIN-OUT] `contact-group/SERVICE_OVERVIEW.md` §FileImport.

### 1.6 Voice records / IVR storage

BSA needs ([PRD] "Voice Tab"): pre-approved Voice IVR templates (Static/Dynamic trees), preview/play IVR node-by-node with variable replacement, voice records as IVR node content.

| Capability | Mechanism | Source |
|---|---|---|
| Voice Records Library (S3 audio) | templates-svc `/api/voice-records/*`: `POST upload-session` (presigned MinIO/S3 PUT; contentType allow-list mp3/wav; 20MB max) → PUT bytes → `POST /{recordId}/complete` (server-side duration probe via pure-C# `ManagedAudioProbe`) → `GET /api/voice-records` (list, newest-first) · `GET /{id}` · `GET /{id}/preview-url` (presigned GET) · `POST /{id}/share` · shared list | [MEMORY] `reference_voice_records_api_seed_recipe_2026_06_30.md` ✋ RUNTIME-VERIFIED (4 records seeded via real API as client user) |
| Tenant/node scoping from JWT | `CreateVoiceRecordUploadSessionHandler.cs:35` — Falcon users 403 `ForbiddenToManageVoiceRecord`; tenant+node from `currentUser`, not request | [MEMORY] same |
| Share policy on records | nested `sharePolicy` on list/details/shared/complete (commit `54c3f22`) | [MEMORY] `project_voice_record_sharepolicy_read_side_2026_07_06.md` |
| IVR trees referencing records | IVR flow docs: `flow.nodes[].content[].voiceRecordId`; `IVoiceRecordUsageReader.IsUsedByAnyIvrAsync` guards record deletion (409) | [MEMORY] `project_voice_record_ivr_lock_and_header_layout_2026_07_01.md` |
| Voice Templates CRUD/approve/reject/share | part of `feat/ivr-templete` (42-path OpenAPI) | [MEMORY] `project_templates_svc_local_docker_deploy_2026_06_30.md` |
| PES resources | `sys/acc.voice-record` + `sys/acc.voice-template` seeded (PR 43022), live in PES ✋ | [MEMORY] `project_voice_record_pes_gating_2026_07_01.md` |
| Infra | MinIO S3 (`falcon-minio-1` :9000, bucket `falcon-templates-dev` self-provisioning), 7 Mongo indexes (`VoiceRecordIndexInitializer`), Mongo `FalconTemplateDb` | [MEMORY] `project_templates_svc_local_docker_deploy_2026_06_30.md` |

**Verdict: COVERED for storage/authoring.** [INFERRED] What BSA additionally needs from IVR at SEND time — rendering a per-recipient IVR audio path with variable replacement and driving it over a call — is execution-plane work (§3.4), not storage.

### 1.7 PES permission checks

BSA needs ([PRD] Assumptions): default role permissions with per-user permission-group overrides; authorization on every API call.

| Capability | Mechanism | Source |
|---|---|---|
| Decision endpoint | `POST /pes/authorize` (single) + `POST /pes/authorize/resources` (batch) + `POST /pes/advise` (rules+obligations) | [BRAIN-OUT] `understanding/backend/access/ENDPOINT_REGISTRY.md` |
| Subject contract | `u:<JWT.sub>@<tenant-id>` (JWT.sub = Zitadel user-id) — **✋ runtime-verified 21/21 PES decisions (2026-05-16)** | [BRAIN-OUT] `datasets/authority-dataset/VERIFICATION-STATUS.md` §runtime-verified |
| Role catalog + per-account roles | `BuiltInRoleCatalog.cs` seeds 6 canonical roles + tenant-scoped p-rules; `POST /pes/roles/bootstrap/account/{tenantId}` (SystemOnly) provisions per-account roles | [BRAIN-OUT] `access/{SERVICE_OVERVIEW,ENDPOINT_REGISTRY}.md` 🟢 |
| Attribute/expression rules (creator-scoped) | PES expression support proven: `"r.obj.createdby"=="r.sub.userid"` (acc-user delete/share own voice records) — the exact primitive for BSA "own transactions only" | [MEMORY] `project_voice_record_pes_gating_2026_07_01.md` ✋ |
| Per-user overrides (permission groups) | Policy-rule CRUD exists (`POST/DELETE /pes/policyrule`, `GET policyrulesBySub/ByObj/ByFilter`); "Permission Group" is a PRD-02 entity (tuples Menu/Tab/Action/Role/Value with Allow/Not-Allow/Deny/Can-be-overridden) — PES can express it; a management UI/API productization is not evidenced | [BRAIN-OUT] `access/ENDPOINT_REGISTRY.md` + `understanding/glossary/permission-group.md` · [INFERRED] gap flagged in §3.8 |
| FE consumption pattern | `AccessControlFacade.resolveFlags` → `POST {baseURLPes}/pes/authorize/resources`; fail-closed seeding; FE key registry `falcon-access.registry.ts` (47 factories + later voice additions); `microapp.<name>` mount key for dynamic apps | [BRAIN-OUT] `datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md` + [MEMORY] `project_voice_record_pes_gating_2026_07_01.md` |
| Role-link sync | Kafka `identity.user-events.v1` → PES `UserRoleLinkSyncRequestedConsumer` (group `falcon-pes-svc`) | [BRAIN-OUT] `access/SERVICE_OVERVIEW.md` §Kafka |

**Verdict: COVERED as a decision engine + proven patterns.** MISSING: BSA-specific PES resources (e.g. `acc.bsa` / `acc.bsa-transaction` actions view/send/cancel/schedule/export/converse) — must be seeded in `BuiltInRoleCatalog.cs` + FE registry, following the voice-record PR 43022 recipe. Note the routing trap: `acc.services view` currently DENIES acc-admin and acc-user — BSA's "all Normal Users can use it" requires its own resource, not reuse of `acc.services` [MEMORY] `project_voice_record_pes_gating_2026_07_01.md` §Key-routing-fact.

### 1.8 Identity / auth (supporting dependency)

- Login/OTP/refresh: `POST /api/auth/login → verify-otp → refresh-token`; JWT via Zitadel; ~30-min TTL; user-id/user-type ride in `urn:zitadel:iam:user:metadata` (Commerce reads them via `ZitadelClaimsTransformation`) [BRAIN-OUT] `identity/ENDPOINT_REGISTRY.md` + [MEMORY] `reference_create_contract_api_sysadmin_recipe_2026_06_25.md` ✋.
- East-west user reads BSA will need for "shared with", sender restriction, display names: `GET /api/user/by-tenant` (TenantId, ExcludeRole), `GET /api/user/{id}`, `GET /api/user/` (paged, filters), `GET /api/security/user-status/{IdentityUserId}` (anonymous cache-backed status probe) [BRAIN-OUT] `identity/ENDPOINT_REGISTRY.md`.
- Webhook precedent: `POST /api/webhook/zitadel` with `x-zitadel-signature` HMAC verification — the platform's only signed-webhook implementation today; a template for the Meta webhook handler [BRAIN-OUT] `identity/{SERVICE_OVERVIEW,ENDPOINT_REGISTRY}.md`.

---

## 2. VERIFIED vs UNVERIFIED (per VERIFICATION-STATUS + memory runtime evidence)

Trust source: [BRAIN-OUT] `datasets/authority-dataset/VERIFICATION-STATUS.md` (glossary: 🟢 code-verified · 🟡 structural/spot-check · ✋ runtime-verified · 🔴 unverified) + dated [MEMORY] runtime notes.

| Dependency claim | Level | Evidence |
|---|---|---|
| PES gate end-to-end (JWT → subject format → allow/deny for acc-owner/admin/user across 7 queries) | ✋ runtime-verified (2026-05-16, 21/21 PASS) | [BRAIN-OUT] VERIFICATION-STATUS.md §"Runtime-verified — backend PES gate" + `_runtime-verification/pes-gate-results-2026-05-16.json` |
| PES voice-record/voice-template matrix live in running PES binary; FE fail-closed resolver against `pes/authorize/resources` | ✋ runtime-verified (2026-07-01, UTF-16 byte-match + live vocab cross-check acc 6 / sys 5) | [MEMORY] `project_voice_record_pes_gating_2026_07_01.md` |
| Mgmt-console E2E: 6 routes × 3 roles through real Docker stack + real PES (16/18 GREEN; 2 RED were commerce 500s B-12/B-13) incl. marketplace mount + contact-groups shared-tab role asymmetry | ✋ runtime-verified (2026-05-28) | [BRAIN-OUT] VERIFICATION-STATUS.md §Mgmt-console port E2E |
| Comm-channel visibility PUT → 200 partial row; zero eventual-consistency window | ✋ browser-verified (2026-05-21) | [BRAIN-OUT] VERIFICATION-STATUS.md §service-pricing row mutations |
| Contract creation via `POST /api/Contracts` incl. rate-matrix gates (app|channel|priority|destination|unit uniqueness; currency-must-match-wallet) | ✋ runtime-verified (2026-06-25; 3 contracts created; 2 latent Commerce bugs found: contractId same-second collision, `CreatedBy` never stamped) | [MEMORY] `reference_create_contract_api_sysadmin_recipe_2026_06_25.md` |
| "Basic Send App" catalog item purchasable/visible on TT001 | ✋ runtime-manipulated (visibility flags set in Mongo; endpoints round-trip through gateways 200) | [MEMORY] same + `project_applications_visible_details_endpoint_marketplace_2026_06_22.md` (route 404→401 live) |
| Voice-records presigned upload → complete → list → preview-url | ✋ runtime-verified (2026-06-30, 4 records seeded via real API) | [MEMORY] `reference_voice_records_api_seed_recipe_2026_06_30.md` |
| templates-svc (feat/ivr-templete) deployed: health 200, Swagger 42 paths | ✋ runtime-verified reachable (2026-06-30) — **individual template endpoints NOT exercised in any brain record** | [MEMORY] `project_templates_svc_local_docker_deploy_2026_06_30.md` |
| Charging Wallet endpoints (reserve/commit/release/debit/transfer/get-account-wallets) shapes + semantics | 🟢 code-verified (file:line drill-down); **no recorded runtime exercise of reserve/commit/release in the stores read** — the Charging Lab exists precisely to do so, but no run log is filed in the brain | [BRAIN-OUT] `charging/controllers/WalletController/*` + [INFERRED] honesty note |
| Kafka topic inventory (all services) | 🟢 code-verified from appsettings/Program.cs scans; consumer-group misconfig flagged (Charging uses group `commerce-service`) | [BRAIN-OUT] `BACKEND_SERVICE_MAP.md` + per-service overviews |
| Gateway route tables + policies + rate limiter | 🟢 code-verified; **stale on templates** — `core-gateway/ENDPOINT_REGISTRY.md` "No templates-cluster" is contradicted by [MEMORY] PRs 41572/41573 + compose override (2026-06-10/30). Trust memory here | [BRAIN-OUT] `GATEWAY_ROUTE_MAP.md` vs [MEMORY] `project_signalr_mode_branch_set_and_main_baseline_2026_06_10.md` |
| Provisioning subscription DTOs (`Status`, `CanHide`, `AvailableActions`) | 🟢 code-verified | [BRAIN-OUT] `provisioning/DTO_DICTIONARY.md` |
| Contact-group endpoint registry + S3/Hangfire configs | 🟢 code-verified (some DTO fields marked "(inferred)") + ✋ list/shared browser-verified in the 2026-05-28 E2E | [BRAIN-OUT] `contact-group/*` + VERIFICATION-STATUS.md |
| BR-CC-31/32 nearest-expiring cascade actually implemented in Charging handler | 🔴 UNVERIFIABLE server-side per the brain's own gap row ("presumably the Charging handler selects nearest-expiring") | [BRAIN-OUT] `prd/modules/03.../GAPS.md` GAP-CC-18 |
| 6-state BR-AM-20 lifecycle (Paid status + Activate action) | 🔴 NOT in code (code = 5 statuses, payment→Active directly); CONFIRMED drift vs PRD | [MEMORY] `project_service_action_display_model_2026_06_25.md` |
| WhatsApp template entity endpoints exact routes/DTOs | 🔴 unverified/undocumented in brain (registry stale; only branch-level facts) | [INFERRED] from §1.4 |
| Local stack overall serving | ✋ 8/9 services on main serving incl. identity (2026-06-30) + templates on branch | [MEMORY] `project_backend_flip_to_main_deploy_2026_06_30.md` (per MEMORY.md index line) |

**Consumption rule** (from VERIFICATION-STATUS.md §How-to-consume): trust 🟢 shapes at face value; verify 🔴 before relying; for security-sensitive gates "DO NOT trust the dataset alone — verify the PES gate at runtime with real test users."

---

## 3. MISSING — candidate scope of the NEW separate BSA backend service

Classification: **CONFIRMED-ABSENT** = a brain/PRD gap document explicitly says it's missing. **ABSENT-IN-BRAIN** = exhaustive search of the stores found nothing (could exist outside the brain's knowledge, but nothing indicates it does).

### 3.1 Transaction engine (compose / store / schedule) — CONFIRMED-ABSENT
- No service owns a Send Transaction / campaign entity. [BRAIN-OUT] `prd/modules/03.../QUESTIONS.md` **Q-CC-25**: "Where is the Send Transaction's Dispatch step (step 5 in W6) implemented — in 03's domain, in an Application service (e.g. WhatsApp BSP), or downstream?" — open, cross-check found nothing. [BRAIN-OUT] `03/GAPS.md` W6 playbook "MISSING (cross-cuts Application services)".
- Pre-BSA the atlas even recorded "Falcon does NOT have send scheduling / Campaign entity" — corrected only by the BSA **BRD document**, not by code [MEMORY] `project_module_06_bsa_2026_05_19.md`.
- The 7-state transaction FSM (Scheduled → In Progress → {Completed, Partially Processed, Failed, Canceled, Deleted}) and 6-state recipient FSM exist ONLY in the BRD/PRD [MEMORY] same + [PRD] "Transaction statuses".
- Grep of all `understanding/backend/*` registries: zero transaction/outbox-tab/scheduled endpoints. ABSENT + confirmed by Q-CC-25 ⇒ **CONFIRMED-ABSENT**.
- Available building blocks: Hangfire (Commerce contract-lifecycle worker; Contact Group cleanup cron + stuck-job watchdog + soft-delete retention) for due-date scheduling; Mongo + `UnitOfWorkFilter` per-action transaction pattern; Kafka outbox pattern (Charging `WalletOutboxPublisherWorker`) [BRAIN-OUT] `commerce/SERVICE_OVERVIEW.md`, `contact-group/SERVICE_OVERVIEW.md`, `charging/SERVICE_OVERVIEW.md`.

### 3.2 Batch processor + balance orchestration — CONFIRMED-ABSENT (production); QA analog exists
- The only batch reserve→deliver→commit/release loop in the platform is the **Charging Lab WhatsApp simulator** — explicitly a QA surface, gated by `Settings:TestingCharging:Enabled` (404 camouflage when off), clamped to 1000 messages, "Calling this controller on a production database mutates production balances", owner-resolution convenience "QA-only … real production code paths cannot" [BRAIN-OUT] `charging/controllers/TestingChargingController/OVERVIEW.md`. ⇒ production batch engine **CONFIRMED-ABSENT**, with a high-fidelity internal blueprint to copy.
- BSA-specific orchestration rules that exist nowhere: manual-recipients-first then CGs in added order; duplicate-removal when disallowed; variable replacement immediately before dispatch (= per-recipient Send date); per-record deduct-then-refund; abort-vs-partial status math; cancel-at-next-batch-edge + post-cancel count/cost recalc [PRD] "Send Logic" + "Outbox" — all [INFERRED] new code.

### 3.3 Meta WhatsApp send integration + status webhooks — CONFIRMED-ABSENT
- **Template-side Meta integration**: [BRAIN-OUT] `prd/modules/05-templates/GAPS.md` GAP-TM-14 "No Meta-webhook endpoint observed" = MISSING; "GAP-TM-11,14 Meta integration is significant work — likely 3-4 weeks for webhook + state machine". The [VAULT] Template-Management BRD designs the **Meta Template Adapter** (creation/edit/delete/fetch/status-sync/media/Flows, credential resolution per WABA, retry/circuit-break/idempotency/DLQ) + **Meta Webhook Handler** (signature validation → normalized status → Kafka) — design-only; the wiki doc itself lists them under "Major implementation gaps (likely)". ⇒ CONFIRMED-ABSENT (designed, not built).
- **Message-send-side Meta integration** (Cloud API `/messages`, per-message delivery webhooks Sent/Delivered/Read/Played/Seen, reply capture): zero traces anywhere — greps for Meta/WhatsApp across `understanding/backend` hit only the Charging Lab (simulator) and PRD text. The BSA PRD's own suggestion ("backend call to sync the selected template with Meta … in case … not updated in Falcon via webhook") confirms webhooks are not trusted/built. ⇒ **ABSENT-IN-BRAIN**, effectively CONFIRMED-ABSENT via GAP-TM-14 for the webhook infrastructure.
- **WABA / WhatsApp Sender-ID registry** ("verified phone number linked to the client's Meta Business account"): the Meta Service .Mng page is a Wave-1 structural placeholder — "full SoT Meta-OAuth hub … deferred to later waves (gated on backend endpoints)" [MEMORY] `project_commchannels_submenu_meta_voice_ai_2026_06_30.md`. ⇒ CONFIRMED-ABSENT.

### 3.4 SIP / voice dialer integration + realtime per-second charging — ABSENT-IN-BRAIN (Sender-ID side CONFIRMED-ABSENT)
- SIP/dialer/telephony: grep over all of `understanding/` → 1 irrelevant hit. No dialer service, no SIP trunk config, no call-state model. ⇒ **ABSENT-IN-BRAIN**.
- Voice Accounts (SIP accounts + numbers = BSA "Voice Sender ID"): built in FE as **mock-first** — "**No backend exists** (grep zero voice-account/sip/trunk)"; FE service GETs `templates/voice-accounts` and falls back to `MOCK_VOICE_ACCOUNTS_PAGE` [MEMORY] `project_voice_account_tab_and_create_wizard_2026_07_01.md`. ⇒ **CONFIRMED-ABSENT** (the memory says so verbatim).
- Per-second realtime deduction during live calls: Charging has the substrate — Redis `ocs:realtime-events` stream "for hot channels: WHATSAPP / SMS / VOICE" + `RealTimeChargingCore` infrastructure area [BRAIN-OUT] `charging/SERVICE_OVERVIEW.md` — but no public API or documented consumer implements a per-second debit loop / mid-call termination on exhaustion. ⇒ engine **ABSENT-IN-BRAIN**; substrate exists.
- Voice per-recipient statuses (Ringing/Live/Unreachable/Busy/No-Answer/Initiator-drop…) + SIP status mapping: PRD-only ([PRD] "Check the mapping of the below statuses with SIP status in this sheet" — the sheet is not in the brain). ⇒ ABSENT.

### 3.5 Conversation store + customer-service-window logic — ABSENT-IN-BRAIN
- Greps for conversation/inbox/chat over `understanding/` → only rule/glossary noise. No conversation entity, no message store, no 24h-window timer anywhere. The 24h CS-window + reset-on-inbound + free-form-vs-template gating + conversation-history chaining exists only in [PRD] "WhatsApp Conversation Page". ⇒ **ABSENT-IN-BRAIN** (inbound-message capture additionally depends on the missing Meta webhooks §3.3).
- [PRD] v5 itself lists "The conversation menu item" under **Pending** — the PRD acknowledges deferral.

### 3.6 Retry engine (voice) — ABSENT-IN-BRAIN
- Up-to-3 attempts per selected failure statuses with per-attempt wait durations + attempt audit trail ([PRD] "Retry Logic") — no scheduler/retry ledger exists. Closest precedents: Contact Group `MaxImportRetries: 3` + stuck-job watchdog; Charging optimistic-retry (25→250ms) — different granularity entirely [BRAIN-OUT] `contact-group/SERVICE_OVERVIEW.md`, `charging/SERVICE_OVERVIEW.md`. ⇒ ABSENT-IN-BRAIN.
- Note the PRD's own asymmetry: "Previously failed scheduled transactions are not retried automatically" (channel-down case) vs configurable voice retries (call-outcome case) [PRD] — the engine must distinguish these [INFERRED].

### 3.7 Exports (details + statistics) — ABSENT-IN-BRAIN
- No export endpoints exist on any service registry. Contact Group has an `ExportBatchSize: 10000` config knob + validated-file downloads (S3 presigned) — a pattern, not a transaction-export feature [BRAIN-OUT] `contact-group/SERVICE_OVERVIEW.md`. Statistics aggregation (delivered/read/reply rates, cost breakdowns) exists nowhere. ⇒ ABSENT-IN-BRAIN.

### 3.8 BSA public API + Skeleton APIs — CONFIRMED-ABSENT (as an API surface); read-sides mostly exist
- The 4 APIs ([PRD] "API"): BSA Send · Template Retrieval · Contact Group Retrieval · SenderID Retrieval — also enumerated in the BSA BRD [MEMORY] `project_module_06_bsa_2026_05_19.md`. None exists as an API product.
  - Template retrieval: façade over templates-svc (§1.4) — filter Approved + own/shared; lookup by autogenerated ID **or Reference ID** [PRD].
  - Contact-group retrieval: façade over contact-group svc (§1.5).
  - SenderID retrieval: **blocked** — no backend Sender-ID registry for either channel (§3.3, §3.4).
  - Send API: the whole §3.1/3.2 engine.
- "In future only system user" + API keys/machine tokens: Zitadel service-account bootstrapping exists (`ConfigureZitadelOnStartup`, PES `SystemOnly` policy) but no client-facing API-key issuance story. ⇒ ABSENT-IN-BRAIN [BRAIN-OUT] `identity/SERVICE_OVERVIEW.md`, `access/SERVICE_OVERVIEW.md`.
- BSA-specific PES resources (e.g. `acc.bsa-transaction` view/send/cancel/schedule/export/converse; sender-ID restriction attribute rules): not seeded. Pattern to copy = voice PR 43022 [MEMORY] `project_voice_record_pes_gating_2026_07_01.md`. ⇒ ABSENT (expected; new feature).
- Permission-Group productization (BSA's "unless a permission group … overrides this default"): PES can express per-user rules today; PRD-02 defines the entity; `adminConsole.userPermissionGroup.assign` FE key exists "(Wave 1.3.0 — not in seed catalog yet)" [BRAIN-OUT] REGISTRY-RAW.md:54. ⇒ PARTIAL / ABSENT-IN-BRAIN as a shipped feature.

### 3.9 Misc missing glue
- **Cost estimation endpoint** (pre-send estimate by destination × category × count × active contract): the rating engine computes cost only inside reserve; there is no dry-run/quote API. `POST /api/Wallet/authorize` is documented as possibly diverging into pre-validation later ("hints at future divergence") [BRAIN-OUT] `charging/controllers/WalletController/OVERVIEW.md` §Aliases. ⇒ ABSENT-IN-BRAIN; either a new Charging quote endpoint or BSA-side rating read is needed.
- **Destination identification** (recipient number → Destination axis for rating): the PRD-03 "Destination Identification" doc + "International Phone# Destination List" sheet define the axis; no runtime service resolves a phone number to a Destination code in any registry [BRAIN-OUT] `prd/modules/03.../OVERVIEW.md` §Module Dependencies. ⇒ ABSENT-IN-BRAIN.
- **Per-recipient message store** (statuses, dates, costs, has-reply): part of §3.1 store. ABSENT.

---

## 4. INTEGRATION CONTRACTS — how a new BSA service plugs into the platform

### 4.1 Gateway routing (the front door)
- Two YARP gateways, two audiences: **Core Gateway :7038** (`ClientOnly`, tenant from JWT, `PerTenant` rate limiter 100 req/60s, IP-allowlist middleware fail-open-on-Redis-error) and **System Gateway :7256** (`FalconOnly`, tenant from response bodies, no anonymous auth route) [BRAIN-OUT] `GATEWAY_ROUTE_MAP.md`.
- Pass-through convention: route `/{service-prefix}/{**remainder}` → strip prefix → prepend `/api` → cluster (`<name>-cluster`, dev destination `http://localhost:<port>` / compose `http://<service>:8080`). FE URL rule: `<gateway-base>/<service-prefix>/<internal-path>` [BRAIN-OUT] same §Frontend URL Cheat-Sheet.
- **Recipe for BSA:** add `bsa-cluster` + `bsa-proxy` (`/bsa/{**remainder}`, ClientOnly + PerTenant) to Core Gateway; a FalconOnly twin on System Gateway if Falcon views are needed; plus compose service + `ReverseProxy__Clusters__bsa-cluster__Destinations__destination1__Address` env — exactly how templates was onboarded (PRs 41572/41573 + docker-compose.override.yml), including the failure mode to avoid: adding routes before the container exists made **both gateways crash** with YARP fatal "No address found for destination on cluster 'templates-cluster'" [MEMORY] `project_signalr_mode_branch_set_and_main_deploy_2026_06_10.md` F1 + `project_templates_svc_local_docker_deploy_2026_06_30.md`.
- Aggregation option: FastEndpoints handlers in `Features/` grouped under gateway-owned prefixes (e.g. `/api/commerce/...`) that short-circuit YARP when a response must merge multiple services (hierarchy = Commerce+Identity+Charging; contracts = Commerce+Charging). BSA cross-service reads (e.g. outbox row enriched with template name + CG names) can either aggregate in-gateway or east-west inside BSA [BRAIN-OUT] `core-gateway/ENDPOINT_REGISTRY.md` · [INFERRED] the Testing-Charging BFF shows the "re-serialize downstream as JsonElement to avoid DTO duplication" gateway pattern [BRAIN-OUT] `GATEWAY_ROUTE_MAP.md:106`.
- PES is **NOT gateway-routed** ("No pes-cluster — PES is internal-only"); FE calls it at `baseURLPes` directly; backend services call it east-west [BRAIN-OUT] `core-gateway/ENDPOINT_REGISTRY.md` §What-Doesn't-Exist.

### 4.2 AuthN/AuthZ (JWT + PES)
- JWT: Zitadel Bearer; `RoleClaimType: urn:zitadel:iam:org:project:roles`; client tenant id from JWT (gateway injects `X-Tenant-Id` from `currentUser.TenantId`); Falcon admins are tenant-less by design [BRAIN-OUT] `BACKEND_SERVICE_MAP.md` §Conventions + `GATEWAY_ROUTE_MAP.md`.
- Policies: `ClientOnly` / `FalconOnly` at gateway; service-level `[Authorize]` + per-action `FalconOnly` (Commerce visibility/pricing endpoints) or claim policies (`RequireClaim("user-type","1","Falcon")` on Contracts create) [BRAIN-OUT] `commerce/ENDPOINT_REGISTRY.md` + [MEMORY] `reference_create_contract_api_sysadmin_recipe_2026_06_25.md`.
- **Claims gotcha to inherit-with-care:** `ZitadelClaimsTransformation` decodes `user-type`/`tenant-id`/`node-id` from metadata but NOT `user-id` → Commerce `CreatedBy` is null on every contract. BSA must decode user-id from `urn:zitadel:iam:user:metadata` itself for creator attribution ("transactions sent by the logged-in user" is a core BSA filter) [MEMORY] `reference_create_contract_api_sysadmin_recipe_2026_06_25.md` GOTCHA 2 · [INFERRED] importance for BSA.
- Tenant/node resolution pattern for client callers: from `currentUser` (JWT), never from the request body (voice-records precedent: 400 `NodeIdMissing` if absent; Falcon callers 403 on client-owned writes) [MEMORY] `reference_voice_records_api_seed_recipe_2026_06_30.md`. Templates PUT shows the dual pattern: Falcon → route id = tenant; Client → JWT [BRAIN-OUT] `templates/ENDPOINT_REGISTRY.md` §Tenant Resolution.
- PES integration: seed BSA resources in `BuiltInRoleCatalog.cs` (+ per-account bootstrap picks them up via `EnsureAllExistingAccountRoles`), mirror in FE `falcon-access.registry.ts`, resolve via `POST /pes/authorize/resources` with subject `u:<zitadel-user-id>@<tenant-id>`; creator-scoped rules via `"r.obj.createdby"=="r.sub.userid"` expressions; standing rule: PES g-rule subjects use the **Zitadel id**, not Mongo `_id` [BRAIN-OUT] VERIFICATION-STATUS.md + [MEMORY] `project_voice_record_pes_gating_2026_07_01.md` + [MEMORY] `feedback_pes_g_link_uses_zitadel_id.md` (index).

### 4.3 Kafka topic conventions (async spine)
- Naming: `<producing-service>.<event-kebab>.v1` (e.g. `commerce.order-created.v1`, `charging.order-payment-processed.v1`, `contactgroup.import-requested.v1`, `identity.user-events.v1`) — BSA topics would be `bsa.transaction-created.v1`, `bsa.batch-processed.v1`, etc. [BRAIN-OUT] all `SERVICE_OVERVIEW.md` §Kafka [INFERRED naming].
- Serialization: Confluent Avro + Schema Registry, BACKWARD compatibility; consumer group = service name (**avoid Charging's flagged misconfig of reusing `commerce-service` group**) [BRAIN-OUT] `charging/SERVICE_OVERVIEW.md` §Kafka note.
- Reliability: outbox pattern for producers (Charging `WalletOutboxPublisherWorker` + `OcsOutbox` + `UnitOfWorkFilter` commits Mongo + outbox atomically); self-trigger-via-Kafka for async durability (Contact Group produces AND consumes `contactgroup.import-requested.v1`) — the recommended shape for BSA's schedule→execute handoff [BRAIN-OUT] `charging/SERVICE_OVERVIEW.md` + `contact-group/SERVICE_OVERVIEW.md` [INFERRED recommendation].
- Topics BSA should consume: `commerce.comm-channel-shown.v1` / visibility-changed (channel gating), `commerce.contract-lifecycle.v1` (rate validity), `commerce.wallet-configured.v1` (strategy awareness), `contactgroup.import-requested.v1` (CG readiness), `identity.user-events.v1` (sharing/roles) [BRAIN-OUT] service overviews [INFERRED selection].

### 4.4 Service skeleton conventions (to be a well-formed 10th service)
- Clean Architecture 5-project layout (`Api/Application/Contracts/Domain/Infrastructure`) or monolithic-Api with layer folders; **.NET 10**; FastEndpoints+Mediator (Identity/CG/Templates style) or Controllers+handlers (Commerce/Charging style) [BRAIN-OUT] `BACKEND_SERVICE_MAP.md` §File Layout.
- Envelope: `ServiceOperationResult<T>` on every endpoint; errors via `FalconException(FalconKeys.Error.X)` with per-service `ErrorMessages.{en,ar}.resx` + startup `ValidateResourceCompleteness()` fail-fast; Commerce additionally maps HTTP status via `[ErrorHttpStatus]` attribute (adopt this — Charging's absence of it left status mapping "inferred") [BRAIN-OUT] `BACKEND_SERVICE_MAP.md` §Conventions + `charging/ERRORS.md`.
- Persistence: MongoDB per-service DB (`FalconBsaDb` by convention; note wiki-prescribed snake_case names are already drifted platform-wide), `MongoRepository<T>` base, index initializer at startup; Redis for idempotency/locks (Charging `IdempotencyTtlSeconds: 86400`; CG distributed locks `LockTtlMinutes: 5`); Hangfire for cron; S3/MinIO tenant-scoped key templates for artifacts (CG `tenants/{tenantId}/...` pattern) [BRAIN-OUT] service overviews.
- East-west HTTP: typed `ServicesClients:<Name>:BaseUrl` HttpClients (Commerce→Provisioning/Identity; CG→Identity; Templates→Identity) — BSA needs clients for Templates, ContactGroup, Charging, Commerce, Identity [BRAIN-OUT] `commerce/SERVICE_OVERVIEW.md` + `contact-group/SERVICE_OVERVIEW.md` [INFERRED list].
- Health: `/health` anonymous; CORS `Cors:AllowedOrigins` (localhost:4200/4301 dev); Serilog; Swagger/OpenAPI dev-only.
- Charging-call contract for the send loop: reserve with `ReferenceType`/`ReferenceId` = deterministic per-recipient key (Lab precedent `testing-wa-{runId}-{sequence}` ⇒ e.g. `bsa-wa-{transactionId}-{sequence}`), treat `AlreadyApplied=true` as success, honor `ExpiresAt`/TTL (size batches so processing < TTL, or raise `ReservationTtlSeconds`), on `ReservationNotFound`-at-commit re-run the reserve-commit cycle, surface `NoApplicableRate` as a contract-configuration failure, expect `WalletVersionConflict` retries to be internal to Charging [BRAIN-OUT] `charging/{ERRORS.md, controllers/TestingChargingController/OVERVIEW.md}` [INFERRED application].
- FE integration: Falcon UI library only; API services live in host apps not libs; data tables default page size 10; PES fail-closed flag resolution; i18n en+ar lockstep ([MEMORY] standing rules `feedback_falcon_ui_library_only_no_native.md`, `feedback_api_code_stays_in_host_app.md`, `feedback_data_table_default_page_size_10.md` — per MEMORY.md index).

### 4.5 Cross-module contracts from the PRD layer
- [PRD-03] W6 defines BSA's charging step-list verbatim (determine context → matrix lookup on nearest-expiring Active contract → check wallet per Balance×Wallet cell → reserve → dispatch → commit|release) — BSA implements steps 1+5 and delegates 2/3/4/6/7 to Charging [BRAIN-OUT] `prd/modules/03.../WORKFLOWS.md:68-81`.
- [PRD-04] contact-group columns become template variables; warn when a channel needs a column the group lacks [BRAIN-OUT] `prd/modules/04.../OVERVIEW.md` §Dependencies.
- [PRD-05] template Sendability (BR-TM-26/27: Paused/Disabled → NOT usable at send time; "Runtime block must live in the Send Transaction pipeline … not in Templates microservice" — i.e., **BSA owns the send-time sendability check**) [BRAIN-OUT] `prd/modules/05-templates/GAPS.md` GAP-TM-15 + `BUSINESS_RULES.md:62-63`; Q-TM-20 (Paused template with queued send → fail or reroute?) is still OPEN and BSA's PRD answers it: fail with reason ("Asset Missing" edge case) [PRD] Edge Cases [INFERRED reconciliation].
- BSA PRD's refund edge case ("platform's core Wallet Engine will automatically process the refund based on the overarching contract rules" after third-party rejection) maps to Charging release/ledger — but note current reservation windows are short-TTL; post-commit refunds for late Meta rejections have **no documented API** (release only works pre-commit; `DirectDebit` has no compensating credit endpoint in the registry) — flag as an open contract question for Charging [INFERRED from BRAIN-OUT `charging/ENDPOINT_REGISTRY.md`].

---

## 5. Drift, conflicts, and stale-knowledge warnings the BSA program must carry

1. **Purchase model conflict:** BSA BRD V2 (2026-05-19) says auto-available at account creation, 0 SAR default; [PRD] v5 says "purchased only from the Marketplace … by AO or Falcon". Business must reconcile [MEMORY] `project_module_06_bsa_2026_05_19.md` vs [PRD].
2. **Service lifecycle drift:** code = 5 statuses, payment→Active direct; BR-AM-20 [CONFIRMED] = 6-state incl. Paid + Activate action; CR 126240 sheets remove Disable/Enable for channels and add "service account" precondition ("service account" = zero matches in code AND PRDs). BSA's channel-gating must consume whatever this lands on [MEMORY] `project_service_action_display_model_2026_06_25.md`.
3. **Stale brain docs superseded by memory:** templates ENDPOINT_REGISTRY (3 endpoints vs 42 live paths); core-gateway "No templates-cluster"; templates-list page dossier ("Template CRUD DO NOT EXIST"); marketplace "shows all" compare-note (now visible-only). Anyone re-reading the brain must apply the [MEMORY] layer on top.
4. **Charging config parse artifact:** `OcsResilience`/`OcsOutbox`/`OcsReservationExpiry` possibly nested under `Settings:Kafka` by accident — "config classes may not bind correctly. Verify." [BRAIN-OUT] `charging/SERVICE_OVERVIEW.md` §Configuration Notes — matters for BSA's TTL assumptions.
5. **Commerce write-attribution bug** (`CreatedBy` null everywhere) + contractId same-second collision — both latent and relevant to BSA's audit/ownership queries [MEMORY] `reference_create_contract_api_sysadmin_recipe_2026_06_25.md`.
6. **Hidden-service contract trap:** contracts can price services invisible on the node; FE renders those rate rows empty (GOTCHA 3) — BSA cost estimation must rate against *visible/active* channel + active contract, or reproduce this confusion [MEMORY] same.
7. **acc.services PES key is acc-owner-only** — do not gate BSA screens on it or Normal Users are locked out; BSA needs its own resources [MEMORY] `project_voice_record_pes_gating_2026_07_01.md`.
8. **Templates svc is on a feature branch locally** (`feat/ivr-templete`), other 9 services on main — merged-to-main status of the template/IVR surface is NOT recorded in the brain; treat as unmerged until verified [MEMORY] `project_templates_svc_local_docker_deploy_2026_06_30.md`.
9. **Standing rules:** backend is SoT — FE/agents must not author backend code (`feedback_backend_is_sot_do_not_author_backend_2026_07_01`); never claim QA states without runtime evidence; no commits/branches without explicit instruction ([MEMORY] index).

---

## 6. Bottom line for the NEW BSA backend

**Reuse (do not rebuild):** Charging reserve/commit/release/debit + rating + idempotency + TTL; Commerce do-payment/order-status/channel+app reads/settings; Provisioning subscription reads; Contact Group own/shared/columns/contacts/downloads; templates-svc template + voice-record/IVR entities (extend, don't fork); PES decisions + role catalog seeding; Identity users/auth/webhook-HMAC pattern; gateways (add cluster+routes); Kafka/Avro/outbox conventions.

**Build new (the BSA service proper):** transaction aggregate + compose validation + scheduler; batch processor with the PRD's ordering/dup/status/cancel semantics wrapped around Charging; Meta Cloud API sender + template-sync + signed status/reply webhooks; WABA & SIP sender-ID registries; voice dialer adapter + per-second charge loop on the existing realtime core; conversation store + 24h CS-window; voice retry engine; per-recipient stats + exports; BSA public API + 3 skeleton facades + API-key/machine-auth story; BSA PES resources + FE registry keys; cost-estimation/quote path.

**The one architectural anchor with runtime proof already inside the platform:** the Charging Lab demonstrates end-to-end that a WhatsApp-style batch send loop can ride the production OCS handlers without bypassing any rating/quota/idempotency/ledger rule — the BSA engine is that loop, made durable (Mongo store + Hangfire/Kafka scheduling), multi-tenant-safe (real owner resolution, PES-gated), and pointed at real Meta/SIP providers instead of mock outcomes. [BRAIN-OUT] `charging/controllers/TestingChargingController/OVERVIEW.md` + [INFERRED].
