*** PRD Understanding - Contract & Cost Management - WORKFLOWS ***

# 03-contract-packaging-charging-billing-management - Workflows

## W1: Create Contract (4-step wizard, Falcon only)

- **Trigger:** Falcon System Admin / Product clicks `Add Contract` on the Contracts list.
- **Source:** `latest-prd.md:23-44`; cross-ref Commerce `POST /api/Contracts` (`CreateContractRequest`).
- **Steps:**
  1. **Step 1 - Contract Information**: enter Name (<=50), Farabi Reference ID (<=50, optional), Start Date (>=today 00:00), Expiration Date (>Start), Value SAR (>0 float, <=hundreds-of-millions). Contract ID + Created Date auto-set.
  2. **Step 2 - Rate Card**: for each visible CommChannel, set Price Unit (predefined) + Price Value SAR (used for SAR<->Points display).
  3. **Step 3 - Contract Details**: fill matrix of Application x CommChannel x Priority/ServiceType x Destination -> Cost SAR. WhatsApp priorities = Authentication / Utility / Advertisement / Service (tentative). Voice = High / Normal / Very Low. AI = no priority, destination = Global.
  4. **Step 4 - Addons**: set sub-service addon rate card + free credits per sub-service or per commchannel/application.
  5. Save -> status auto = `Pending` (if Start Date > now) or `Active` (if Start Date already passed at create).
- **Success:** Contract row persisted.
- **Failure modes:** Validation (dates, value range, mandatory fields). Permission denied.

## W2: Auto-Transition Pending -> Active

- **Trigger:** Start Date reached.
- **Source:** `understanding.md:71`; cross-ref BR-CC-13.
- **Steps:**
  1. Background job (or first-read computation; tie-breaker unclear Q-CC-04) detects `Pending && startDate <= now`.
  2. Contract.status -> Active.
  3. Insert WalletRecord with `valueSar = Contract.valueSar`, `contractId = Contract.id` into Master Wallet aggregate.
  4. Master Wallet lump-sum increases by Contract.valueSar.
- **Success:** Master Wallet usable; Remaining Value = Contract.valueSar.
- **Failure modes:** Concurrent activation (idempotent expected).

## W3: Auto-Transition Active -> Expired

- **Trigger:** Expiration Date reached.
- **Source:** `latest-prd.md:49, 60`; cross-ref BR-CC-14, BR-AM-38.
- **Steps:**
  1. Background job detects `Active && expirationDate <= now`.
  2. Contract.status -> Expired.
  3. All WalletRecords with `contractId = Contract.id` are flagged unusable and **excluded from every wallet's lump-sum value**.
  4. Records persist for audit; Falcon can still see Remaining Value; client sees it hidden.
- **Success:** Wallet lump-sums recomputed; client UI hides the contract's remaining.
- **Failure modes:** Race with in-flight Send Transaction (Q-CC-05).

## W4: Extension - Expired -> Active

- **Trigger:** Falcon edits an Expired contract's Expiration Date to a future value.
- **Source:** `latest-prd.md:55-56`; BR-CC-17.
- **Steps:**
  1. Validate new Expiration > now AND > Start Date.
  2. Update Contract.expirationDate.
  3. Contract.status -> Active.
  4. Re-include all of this contract's WalletRecords in lump-sum calculations.
- **Success:** Wallet values rebound; client UI re-shows Remaining.
- **Failure modes:** Retroactive transactions in the Expired window (BR-CC-47 / Q-CC-03 OPEN).

## W5: Edit Contract (Falcon only, status-aware)

- **Trigger:** Falcon opens contract detail -> Edit.
- **Source:** `latest-prd.md:50-56`; Commerce `PUT /api/Contracts/{contractId}` (`UpdateContractRequest`).
- **Steps:**
  1. Determine status -> field-restriction set:
     - **Pending**: editable = Name, Farabi Ref ID, Start Date, Expiration Date, Value, Rate Card, Contract Details grid, Addons (everything except auto IDs / created date).
     - **Active/Expired**: editable = Farabi Ref ID, Expiration Date (must satisfy BR-CC-07), Rate Card price value, Contract Details grid, Addons. Locked: Name, Value, Start Date.
  2. Validate fields against restriction set.
  3. If Expiration Date moves and crosses now boundary -> trigger W4 (Expired -> Active) if applicable.
  4. Save.
- **Success:** Contract updated.
- **Failure modes:** Field-restriction violation. Permission denied (non-Falcon).

## W6: Send Transaction (Normal User via App) - Charging Cascade

- **Trigger:** Normal User submits a campaign / message via an Application.
- **Source:** `latest-prd.md:62`; cross-ref Charging `POST /api/Wallet/reserve` + `commit` (OCS reserve/commit semantics).
- **Steps:**
  1. Determine deduction context (Application, CommChannel, Priority, Destination).
  2. Look up cost in Contract Details matrix of the nearest-expiring Active contract.
  3. Check wallet (per Balance Type x Wallet Type cell from 01) has >= cost.
  4. Reserve the amount in Charging (`/api/Wallet/reserve`).
  5. Application dispatches the message.
  6. Confirmation -> Commit (`/api/Wallet/commit`); failure -> Release (`/api/Wallet/release`).
  7. WalletRecord(s) of nearest-expiring contract debited; Contract.remainingValueSar reduced.
- **Success:** Transaction dispatched; ledger entry recorded.
- **Failure modes:** Insufficient balance. No matching matrix cell. Concurrent debit race (BR-CC-43 / Q-CC-06 OPEN).

## W7: Activate / Purchase Sub-Service from Addons

- **Trigger:** Falcon or AO purchases a sub-service (e.g. Voice Number, Nabaa Template).
- **Source:** `latest-prd.md:63`; BR-CC-33, BR-CC-34.
- **Steps (Single wallet):**
  1. Look up nearest-active-contract addon free-credit for the sub-service.
  2. If free-credit > 0 -> consume free-credit, action completes (zero net cost).
  3. Else use addon rate card; if zero -> short-circuit free.
  4. Else deduct from nearest-expired addon record; fallback to Master Wallet.
- **Steps (Multiple wallet):** Same as above but fallback Master -> CommChannel wallets by user-defined priority.
- **Success:** Sub-service activated.
- **Failure modes:** Insufficient balance across all fallbacks.

## W8: Activate / Renew CommChannel or Application

- **Trigger:** Falcon flips Visibility on a commchannel/app and AO triggers Do Payment, OR renewal date reached for an active service.
- **Source:** `latest-prd.md:66`; cross-ref BR-AM-22, BR-AM-23 (lifecycle); Commerce `POST /api/Node/comm-channel/do-payment`.
- **Steps:**
  1. Determine activation cost from CommChannelConfig.priceValueSar (01).
  2. Cascade similar to W7 (Single = Master first; Multiple = Master -> CommChannel wallets by priority).
  3. Service status -> Paid -> Active.
- **Success:** Service Active; renewal date set.
- **Failure modes:** Insufficient balance -> stay in current status (grace logic).

## W9: Transfer Balance with Contract-ID Preservation

- **Trigger:** Wallet transfer initiated by user with permission (01 W3).
- **Source:** `latest-prd.md:65`; BR-CC-35.
- **Steps:**
  1. Pull from nearest-expiring WalletRecord in source.
  2. Inherit `contractId` on destination's new WalletRecord.
  3. Maintain Balance Transfer Limit % rules from 01 (BR-AM-34).
- **Success:** Funds moved; contract linkage preserved.
- **Failure modes:** Limit exceeded; insufficient source.

## W10: View Contract (with role-aware visibility)

- **Trigger:** User opens contract detail / list.
- **Source:** `latest-prd.md:74-75`; BR-CC-40.
- **Steps:**
  1. Resolve user role.
  2. Falcon: full visibility regardless of status.
  3. AO: full visibility except Remaining Value -> hidden when Expired, `NA` when Pending, real value when Active.
  4. Node Admin: view per 02-user-management role matrix.
- **Success:** UI renders restricted views.
- **Failure modes:** Permission denied.
