---
type: validation-rule
id: V-charging-transfer-source-destination
prd: PRD-03
service: charging
severity: high
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-charging-transfer-source-destination — transfer source ≠ destination + currency match ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: charging · 2026-05-15 ***

# V-charging-transfer-source-destination — Balance Transfer requires distinct, currency-matched wallets

> A Transfer Balance request must specify two *different* wallets, both belonging to the same account scope and the same currency. The cascade also preserves contract-ID linkage on the destination's new WalletRecord (`BR-CC-35`), so any source/destination combo that violates the source-destination matrix (Master↔Comm, Comm↔User/Node, User↔User) is rejected before the funds move.

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CC-35` (transfer pulls from nearest-expiring record + inherits contract id); cross-ref PRD-01 `BR-AM-34` (Balance Transfer Limit % from `01 Account Management`)
- **PRD line reference:** "Transfer Balance always pulls from nearest-expiring record in source wallet; destination inherits the contract ID linkage." (`latest-prd.md:65`)
- **Workflow citation:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) §W9 "Transfer Balance with Contract-ID Preservation" — Steps 1-3, Failure modes "Limit exceeded; insufficient source"
- **Excel cell:** none

## Backend enforcement

- **Service:** [[Charging Service]]
- **DTO:** `TransferBalanceRequest` (handler: `ITransferBalanceHandler`)
- **Attribute:** None at DTO level (Charging convention — bare scalars per [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md)). The matrix check is **handler-side**: §"Handler-Level Validation" point 4 "Transfer wallet identity — `InvalidTransferWallets`, `InvalidWalletIdentity` (source ≠ destination, currency match, …)".
- **Error codes (Charging catalog, per [Charging ERRORS](../../../Brain%20Outputs/understanding/backend/charging/ERRORS.md)):**
  - `InvalidTransferWallets` — "Source/destination combo invalid (same id, currency mismatch, …)"
  - `InvalidWalletIdentity` — "Wallet id shape / scope invalid"
  - `WalletNotFound` / `NoAnyCommChannelWalletWasFound` / `CommChannelSubWalletNotFound` — wallet existence
  - `InsufficientBalance` — source has nothing to send ([[V-charging-insufficient-balance]])
  - `InvalidAmount` — amount ≤ 0
- **Likely HTTP status:** 422 for `Invalid*` per the Charging inference table in [Charging ERRORS](../../../Brain%20Outputs/understanding/backend/charging/ERRORS.md) §"Error Surface Mapping (inferred)". `*NotFound` → 404. **Verify** by triggering each case.
- **Cross-service note:** Balance Transfer Limit % (`BR-AM-34` in PRD-01) is enforced by **Commerce** (tenant settings owner), not Charging — `TransferBalanceRequest` carries the resolved amount; Commerce-side limit logic gates the front-end before the Charging call. Two-layer validation is intentional.

## Frontend implementation hint

- **Form / page section:** Wallets & Balance Mgmt page → Transfer Balance dialog ([[Falcon Dialog]]). Source wallet dropdown + Destination wallet dropdown + Amount input + Confirm button. Same wrapper pattern as the Do Payment popup (`<falcon-angular-...-dialog>` skeleton + `<app-...-popup>` wrapper per the standing library/wrapper rule in MEMORY.md).
- **Suggested validator wiring:**
  - `FormGroup` with cross-field validator: `(g) => g.value.sourceWalletId === g.value.destinationWalletId ? { sameWallet: true } : null`.
  - Filter the Destination dropdown by `currency === source.currency` (avoid mismatched options entirely).
  - Restrict the Destination dropdown to wallets allowed by the source-destination matrix per role (Master↔Comm, Comm↔User/Node, User↔User) — compute from a single capability list resolved against the current user's role.
  - `Amount`: `[Validators.required, Validators.min(0.0000001), Validators.max(source.availableBalance × balanceTransferLimitPct)]` — the **% cap** is from `BR-AM-34` (PRD-01) and lives in tenant settings; fetch once on dialog open.
- **Page note:** Wallets & Balance Mgmt page **not yet seeded** under `10-Pages/`. Selecting [[Falcon Dropdown]] for both wallet pickers + [[Falcon Input]] for amount + [[Falcon Button]] confirm — `inferred`.

## Cross-domain links

- **Permission gate:** Permission to initiate transfer is set per-wallet-pair via the Account Settings module of PRD-01 — see `Brain Outputs/understanding/pages/organization-hierarchy/BUSINESS_RULES.md` (Wallet config rules). Falcon, AO, and certain Node Admin roles may have it.
- **Business rule cluster:** [[V-charging-insufficient-balance]] (sibling failure mode) · `BR-CC-31` (transfer also obeys nearest-expiring within the source) · `BR-CC-30` (every balance move keeps its contract ID linkage)
- **Related learning events:** none in this vault
- **Open question:** `BR-CC-43` (concurrent transfer locking — silent; handled by Charging's optimistic-retry pattern with `WalletVersionConflict`)

## Tags

#type/v-rule #status/triangulated #prd/01 #prd/03 #service/charging #severity/medium

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
