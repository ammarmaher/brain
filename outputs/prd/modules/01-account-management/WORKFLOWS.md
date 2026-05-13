*** PRD Understanding - Account Management - WORKFLOWS ***

# 01-account-management - Workflows

> Drive Drawings live under `Brain SK\skills\imported-business\prd-knowledge\modules\01-account-management\attachments.md`. They were NOT text-extracted in the 2026-04-24 sync — only names + IDs were captured.

## W1: Create Account (5-step wizard)

- **Trigger:** Falcon System Admin or Product clicks `Organization Hierarchy -> Add Client`.
- **Source:** `latest-prd.md:31-54`; visualized in `Figure Acc.2: Creating new account process` and `Figure Acc.4: Flow diagram for creating a new account process`.
- **Steps:**
  1. **Step 1 - Account Information** (mandatory). Enter Account Name, Account ID (auto), Finance ID, Classification Category, Sub-category, Profile Pic, Official Data (Entity Name, Authority Letter Type + Sector + ID, address fields, Another ID, VAT). Validate uniqueness on Account Name. (latest-prd.md:33-40)
  2. **Step 2 - Account Settings** (mandatory). Set Password Security Level (Normal/Advanced), Allowed IPs, Account Limits (Normal User, System User, Node Levels, Balance Transfer %). Empty values not allowed; 0 = no limit. (latest-prd.md:42-45)
  3. **Step 3 - Configuring Commchannels / Services** (optional). For each commchannel: Name (display), Visibility (default Hide), Pricing Type, Price Value. Pricing required only if Visibility=Show. (latest-prd.md:47-48)
  4. **Step 4 - Configuring Applications & Services** (optional). Same shape as Step 3. (latest-prd.md:50-51)
  5. **Step 5 - Creating Account Owner user** (mandatory). Creates the client-side AO user per the User Management module (Personal Info + Role + Permissions). (latest-prd.md:53-54)
- **Success:** Account row created; AO user delivered credentials via Email/Phone/Both (per 02-user-management).
- **Failure modes:** Duplicate Account Name; Account Name violates format; missing mandatory fields in Steps 1/2/5; AO user count exceeds Normal-User account limit (caught at Step 5 by 02-user-management).

## W2: Wallet & Balance Configuration (Falcon usertype only)

- **Trigger:** Falcon navigates `Wallets & Balance Mng` -> select client.
- **Source:** `latest-prd.md:65-91`; supporting doc `Acc - Wallet & Balance Mng VB4`; visualized in `Figure Acc.1 Falcon Hierarchy Structure` + the Wallet 1..8 series of Drive Drawings.
- **Steps:**
  1. Pick Balance Type (User / Node).
  2. Pick Wallet Type (Single / Multiple).
  3. Save config (one of 4 matrix cells).
- **Success:** Wallet topology recorded. Subsequent transactions and transfers use the resolved cell.
- **Failure modes:** Permission denied (non-Falcon). Open: changing Balance/Wallet Type post-creation with non-zero balances (BR-AM-41 - OPEN).

## W3: Balance Transfer

- **Trigger:** User invokes transfer from a wallet UI (UI differs per scenario cell).
- **Source:** `latest-prd.md:86-91`; Drive `Wallet 1..8 ...` series for each (Balance Type x Wallet Type) cell.
- **Steps:**
  1. Resolve source + destination per role x topology matrix:
     - Master <-> Comm Wallet: Falcon only (Multiple-wallet topology).
     - Comm Wallet <-> User/Node commchnl wallet: Falcon + AO.
     - User/Node wallet <-> User/Node wallet: Falcon + AO + Node Admin.
     - Master <-> User/Node (Single-wallet only): Falcon + AO.
  2. Apply Balance Transfer Limit (%) check from Account Limits, unless source is Master Wallet.
  3. Move SAR amount; destination record inherits the source's contract ID linkage (nearest-expiring first).
- **Success:** Transfer recorded; both wallets reflect new balances; audit row created with actor + at.
- **Failure modes:** Source insufficient. Limit % exceeded. Role-x-topology not allowed.

## W4: CommChannel / Application Activation (first time)

- **Trigger:** Falcon flips Visibility from Hide -> Show for a commchannel/app, sets Pricing Type + Price Value.
- **Source:** `latest-prd.md:47-48`, `latest-prd.md:56-63`; Drive `Figure Acc.3: Configuring Commchannels & Application (First time)` and `Figure Acc.6: Flow diagram CommChnl & App (Activation & Renew)`.
- **Steps:**
  1. Visibility = Show. Pricing Type + Price Value become required.
  2. Save. Status remains `InActive (First time)`.
  3. Client side (AO) requests payment.
  4. Master Wallet debited by Price Value, contract ID tagged.
  5. Status -> `Paid` -> `Active` (with First Activation Date + Renew Date set).
- **Success:** Service Active; renew date scheduled.
- **Failure modes:** Insufficient Master Wallet -> stays Paid? Or InActive? (open question, PRD silent on the gap between paid + activated).

## W5: CommChannel / Application Renewal

- **Trigger:** Renew Date reached.
- **Source:** `latest-prd.md:56-63`; Drive `Figure Acc.6` and `Figure Acc.18..20` (Renew InActiveFT / Disabled / Expired-InActive).
- **Steps:**
  1. System attempts to deduct Price Value from Master Wallet on Renew Date.
  2. Success -> stays `Active`, new Renew Date scheduled.
  3. Failure -> status -> `Expired`. Start grace period: 7 days (Monthly) or 30 days (Yearly / One Time Payment) per BR-AM-21.
  4. During grace: AO can pay manually. On payment -> back to `Active` retroactive.
  5. Grace ends without payment -> `InActive (Grace Period Ends)`.
- **Success:** Renewal succeeds -> Active continues.
- **Failure modes:** Grace expires without payment.

## W6: Manual Disable / Enable CommChannel / App

- **Trigger:** Falcon hits `Disable` / `Enable` action on a service row.
- **Source:** `latest-prd.md:63`; Drive `Figure Acc.5..17` (Edit visibility / status variants).
- **Steps:**
  1. Service status changes to `Disabled` (manual). Service is not consumable.
  2. Enable transitions back to previous status (Active / Paid / InActive).
- **Success:** Status updated.
- **Failure modes:** Permission denied.

## W7: Account Edit (Falcon-side)

- **Trigger:** Falcon selects Account -> Account Information or Settings tab -> Edit.
- **Source:** `latest-prd.md:33-45`; Permission sheet `Permission list - Jawad` flags `Edit Account basic/official information`, `Edit Account Limitations`, `Edit Password Security Level on Root/Main`, `Edit Account Limitations` as Falcon-only with role-specific deny pattern (Operation = Not Allow).
- **Steps:**
  1. Open Account row -> Information or Settings tab.
  2. Modify mutable fields per role matrix.
  3. Save.
- **Success:** Account updated.
- **Failure modes:** Validation failure (uniqueness, format). Permission denied.
- **Open questions:** Account Limits edit while live users exceed new limit (BR-AM-39 - OPEN).

## W8: Contract -> Master Wallet Funding (cross-module)

- **Trigger:** A contract becomes Active (03-contract-packaging-charging-billing-management module). Listener in 01-account-management observes.
- **Source:** `latest-prd.md:93-98`.
- **Steps:**
  1. Contract status changes to Active.
  2. Contract value flows into Master Wallet as a WalletRecord tagged with contract ID.
  3. Master Wallet lump sum is increased.
- **Success:** Master Wallet usable for activations and transfers.
- **Failure modes:** Not described in this PRD; cross-reference 03's contract activation flow.

## W9: Contract Expiration -> Wallet Sweep (cross-module)

- **Trigger:** Contract reaches expiration date (in 03).
- **Source:** `latest-prd.md:98`.
- **Steps:**
  1. Contract status -> Expired.
  2. All wallet records linked to the contract are excluded from lump-sum values.
  3. Records persist for audit; not consumable.
- **Success:** Lump sums recomputed.
- **Failure modes:** Race conditions on concurrent send transactions (open).
