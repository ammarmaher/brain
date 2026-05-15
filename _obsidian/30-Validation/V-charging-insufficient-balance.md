*** Validation V-charging-insufficient-balance — charge requires sufficient nearest-expiring balance ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: charging · 2026-05-15 ***

# V-charging-insufficient-balance — Send Transaction / Do Payment must not exceed wallet balance

> Every balance-affecting action (Send Transaction, Activate Sub-Service, Activate/Renew CommChannel/App, Transfer) is bounded by the available balance in the relevant wallet, which is computed as the sum of WalletRecords linked to **non-Expired** contracts (since `BR-CC-38` excludes Expired contracts from lump-sums). A charge for more than the available balance must be rejected by the OCS before the application dispatches.

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CC-32` (Send Transaction wallet-sufficiency check) — also implicated in `BR-CC-31` (nearest-expiring iteration), `BR-CC-33`/`BR-CC-34` (Addon fallbacks), `BR-CC-36` (CommChannel/App activation cascade)
- **PRD line reference:** "Send Transaction (Normal User via App): check wallet sufficiency -> iterate nearest-expiring Active contracts -> deduct per Contract Details matrix -> update wallet + contract remaining -> dispatch." (`latest-prd.md:62; understanding.md:74-75`)
- **Workflow citation:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) §W6 Step 3 ("Check wallet (…) has >= cost") · §W6 Failure mode "Insufficient balance" · §W7 Failure mode "Insufficient balance across all fallbacks" · §W8 Failure mode "Insufficient balance -> stay in current status (grace logic)"
- **Excel cell:** none — runtime check at charge time

## Backend enforcement

- **Service:** [[Charging Service]]
- **DTO:** `ReserveWalletChargeRequest` (reserve step) · `DirectDebitRequest` (direct-debit step) · `CommitWalletReservationRequest` (commit converts reserve → final debit)
- **Attribute:** None at DTO level — Charging DTOs deliberately ship "bare `string` / `decimal` / enum" per [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md). The check is **handler-side**: `IReserveWalletChargeHandler` / `IDirectDebitHandler` / `ICommitWalletReservationHandler` evaluate balance availability after wallet/account existence and idempotency.
- **Error code:** `FalconKeys.Error.InsufficientBalance` (Charging catalog, likely 422) — per [Charging ERRORS](../../../Brain%20Outputs/understanding/backend/charging/ERRORS.md) row "`InsufficientBalance — Not enough quota to charge / transfer / debit`". Related: `InvalidAmount` (amount ≤ 0), `WalletNotFound`, `NoAnyCommChannelWalletWasFound`, `CommChannelSubWalletNotFound`.
- **Source file:** [Charging VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md) §"Handler-Level Validation" point 3 "Balance availability — `InsufficientBalance`"
- **Cascade behaviour:** The handler iterates nearest-expiring WalletRecords per `BR-CC-31`. `InsufficientBalance` fires only after exhausting all eligible records *and* fallback wallets (Multiple-wallet cascade Master → CommChannel by user priority per `BR-CC-34`/`BR-CC-36`).
- **Reservation TTL:** A reserved charge auto-releases after `ReservationTtlSeconds` (default 300) — the frontend must be prepared for `ReservationNotFound` if Commit is delayed past TTL ([Charging VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md) §"Reservation TTL & Expiry").

## Frontend implementation hint

- **Form / page section:**
  - **Send Transaction** is initiated from inside an Application (e.g. WhatsApp Campaign Composer) — surfaced via the Core Gateway. No standalone admin page.
  - **Do Payment / Activate Sub-Service** dialogs live on the Organization Hierarchy CommChannels & Services tab and on the Wallets & Balance Mgmt page (`Brain Outputs/understanding/pages/organization-hierarchy/` is the seeded analog). The "Do Payment Priority Popup" wrapper (`<app-do-payment-priority-popup>`) is the canonical UI host.
- **Suggested validator wiring:**
  - **Optimistic precheck:** call the wallet-balance summary endpoint (`GET /Wallet/.../summary`) on dialog open to display "Available: SAR X / Required: SAR Y". Mark Submit disabled when `available < required`.
  - **Authoritative check:** ALWAYS the server. Treat any `InsufficientBalance` 422 from Reserve/Commit/Direct-Debit as the final answer — show the localized message from the response body and offer a "Top up" link to the transfer dialog.
  - Handle `WalletVersionConflict` separately: the handler retries internally up to `MaxOptimisticRetries=3`; surfacing this code to the user means the conflict outlasted the retry window — treat as transient, show "Try again".
- **Page note:** Wallets & Balance Mgmt page **not yet seeded** under `10-Pages/`. The Do Payment popup pattern *is* documented for Organization Hierarchy. Send Transaction surface is per-Application (`inferred`).

## Cross-domain links

- **Permission gate:** PRD-03 `BR-CC-40` view rules · PRD-02 user role matrix controls who can initiate Send Transaction / Do Payment / Activate. AO/Node Admin permissions per `Brain Outputs/understanding/pages/organization-hierarchy/BUSINESS_RULES.md`.
- **Business rule cluster:** [[V-charging-no-applicable-rate]] (sibling failure on the same Reserve call — different cause) · [[V-charging-transfer-source-destination]] (transfer is one route to *cause* an Insufficient Balance) · `BR-CC-31` (nearest-expiring cascade) · `BR-CC-38` (Expired records excluded from lump-sum, shrinking available balance)
- **Related learning events:** none in this vault — the Do Payment Priority Popup wrapper pattern is recorded under `feedback_library_skeleton_app_api.md` in MEMORY.md.
- **Open question:** `BR-CC-43` (concurrent send-transaction locking on shared wallet — silent in PRD; backend uses optimistic concurrency with 3 retries per [Charging VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md))

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
