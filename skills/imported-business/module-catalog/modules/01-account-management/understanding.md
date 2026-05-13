# Understanding — Account Management

## Module purpose

Own the concept of an Account (i.e. a Client) in Falcon, including hierarchy below it (Root → Main → Sub-nodes), creation, configuration (security, limits, commchannels, apps), and — most notably — the wallet & balance management that turns contract value into spendable credits across per-user or per-node wallets.

## Actors / users

- **Falcon — System Administrator / Product / Operation** — per the role matrix in `02-user-management`:
  - System Admin: full access.
  - Product: can add clients + manage wallet config + edit contracts + pricing; similar breadth to Admin.
  - Operation: can add nodes / users but cannot add clients, cannot edit pricing, cannot wallet-transfer, contract view-only.
- **Client — Account Owner** — primary client-side actor post-creation. Cannot create accounts; configures their own account (users, wallet transfers in scope, commchannels actions in scope).
- **Client — Node Admin / Normal User** — limited scopes, see 02-user-management for detail.

## Main screens

1. **Organization Hierarchy** menu item — hierarchy tree + tabs (Hierarchy, CommChannels & Services, Apps & Services, Settings).
2. **Add Client wizard** (5 steps).
3. **Account Information page** (basic + official info).
4. **Settings tab** (Password Security, Allowed IPs, Account Limitations).
5. **CommChannels & Services tab** (list with Visibility, Pricing, Status, Actions).
6. **Apps & Services tab** (same shape as commchannel list).
7. **Wallets & Balance Mng** menu item — wallet configuration (Falcon usertype) + transfer UI.
8. Many Drive Drawings for wallet transfer and balance deduction flows (see attachments).

## Main actions

- Create Account (5-step wizard).
- Edit Account (information, official data, settings).
- Add / Edit / View Node.
- Add / Edit / View Sub-Node.
- Configure CommChannel visibility, price, enable / disable.
- Configure Application visibility, price, enable / disable.
- Configure Wallet Type and Balance Type (Falcon only).
- Transfer balance (Master ↔ Comm / Comm ↔ User/Node comm / User ↔ User).
- Manage commchannel / application status transitions (Paid / Active / Expired / Disabled).
- Visibility toggle on commchannels & apps (Hide / Show).

## Business rules (partial)

- **R1** Only Falcon usertype can create clients (System Admin, Product).
- **R2** `Account Name` is unique across Falcon, ≤30, starts with letter, mandatory.
- **R3** Account Limits use `0` = no limit. Empty values not allowed.
- **R4** Allowed IPs enforced via a configurable HTTP header parameter. Requests missing the header → rejected.
- **R5** Master Wallet is an abstract aggregate — value is the lump sum of Active contracts' wallet records.
- **R6** Balance Transfer Limit (%) caps every non-Master-source transfer action.
- **R7** `System User` count is separate from `Normal User` count (both have independent limits).
- **R8** Grace period: 7 days for Monthly pricing, 30 days for Yearly / One Time Payment.
- **R9** CommChannel / App default visibility is `Hide`.
- **R10** If Visibility = `Show`, Pricing Type and Price Value become mandatory.
- **R11** Activation of commchannel / app deducts price from Master Wallet on payment; contract-ID-tagged.
- **R12** Balance Type + Wallet Type are configured by Falcon usertype ONLY.
- **R13** Transfer permissions follow a strict source-×-destination matrix (see `latest-prd.md`).

## Workflows

### Create Account
`Organization Hierarchy` → `Add Client` → Step 1 Info → Step 2 Settings → Step 3 CommChannels (optional) → Step 4 Apps (optional) → Step 5 Account Owner user → Save.

### Wallet configuration
Falcon navigates `Wallets & Balance Mng` → select client → chooses Balance Type (User / Node) + Wallet Type (Single / Multiple) → saves config.

### Balance transfer
Depends on active configuration scenario; UI differs per case. Always:
- Enforce allowed-source/destination per role.
- Enforce transfer-limit % where applicable.
- Tag destination record with source contract ID.

### Commchannel / App activation
Set Visibility = Show → Pricing Type + Value mandatory → Save → client side can request activation → Master Wallet debited → status transitions (InActive → Paid → Active).

### Renewal + expiration
Renew Date reached → attempt deduction from Master Wallet → success = status stays Active with new dates; failure = Expired + grace period → grace ends without payment = InActive (Grace Period Ends).

## Edge cases (sampled — more in PRD)

- Contract expires mid-period → wallet records removed from lump-sum, Active commchannels may be unaffected until their own renewal.
- Balance Transfer Limit at 0 = no limit.
- Account Limits edited while active users exist exceeding new limit → PRD doesn't clarify enforcement mode (reject subsequent actions? grandfather existing?).
- CommChannel visibility toggled from Show → Hide while status is Active — behavior not fully spelled out.
- Account switching between Single / Multiple Wallet mid-life — data migration implications unclear.
- Deleting a user with a non-zero wallet balance — fate of balance unclear.

## Validations (consolidated, partial)

- Account Name: unique, ≤30, letter start, mandatory.
- Account Limits: non-empty, numeric, 0 = no limit.
- Password Security Level: enum {Normal, Advanced}.
- Allowed IPs: header-param-based; requires non-empty value.
- Commchannel / App: Pricing Type + Price Value mandatory when Visibility = Show.
- Authority Letter Type: Government / Commercial / Charity with linked Sector + ID field.

## Dependencies

- **User Management** — Account Owner user is created at Step 5; permission matrix lives there.
- **Permissions module** — per-action gating across Organization Hierarchy / CommChannels / Apps / Settings.
- **Contracts** (`03-contract-packaging-charging-billing-management`) — value source for Master Wallet; nearest-expiring deduction rule.
- **Finance integration** — Finance ID links account to Finance team records.
- **Farabi integration** — indirectly via contracts.
- **Notification** — credential delivery + system alerts.

## Data entities (inferred)

- `Node` { id, type: root|main|sub, parentId, accountId?, settings }
- `Account` { id, nodeId, name, financeId, classification, subClassification, profilePic, officialData{…} }
- `AccountSettings` { accountId, passwordSecurityLevel, allowedIps[], limits{maxNormalUser, maxSystemUser, maxNodeLevels, balanceTransferLimitPct} }
- `CommChannelConfig` { accountId, channelId, visibility, pricingType, priceValueSar, firstActivationDate?, activationDate?, renewDate?, status }
- `AppConfig` { accountId, appId, visibility, pricingType, priceValueSar, firstActivationDate?, activationDate?, renewDate?, status }
- `Wallet` { id, type: master|comm|user|node|user-comm|node-comm, ownerId, commChannelId?, valueSar }
- `WalletRecord` { id, walletId, contractId, valueSar, createdAt }
- `TransferTx` { id, srcWalletId, dstWalletId, amountSar, actorId, at, contractIds[] }

## API expectations (implied)

- `POST /accounts` — create (5 steps either multi-step or single transaction).
- `PATCH /accounts/{id}` — edit.
- `GET /accounts/{id}` — detail with tabs.
- `POST /accounts/{id}/wallet-config` — set Balance / Wallet type (Falcon only).
- `POST /wallets/transfer` — transfer with source/destination/amount/contractLinking.
- `POST /commchannels/{id}/enable|disable|visibility|pricing|payment` — granular actions.
- `POST /apps/{id}/enable|disable|visibility|pricing|payment` — granular actions.

## Assumptions

- Balance Type and Wallet Type are one-time config at account creation, rarely changed. PRD doesn't describe the change-mode workflow.
- Account Limits edits apply going forward (no retroactive enforcement) — NOT stated, risky assumption.
- `System User` = a Normal User with a system flag; count lives in its own limit.
- Classifications are static lists maintained in code or DB.

## Risks / unclear areas

- Full wallet transfer flows per scenario (4 cells × many actions) are referenced via external sheets and drawings — not fully text-extractable in this sync.
- Renewal cost calculation when pricing type changes mid-life.
- Handling of balance stranded in deleted user's wallet.
- Migration of accounts between Balance Type / Wallet Type configurations.
- Archival/deletion of accounts.
- Concurrent transfer operations on the same wallet.
- Audit log granularity for config changes.

## Clarifying questions

1. Can Wallet Type or Balance Type be changed after the account has real balances? If yes, what is the migration flow?
2. What happens to the wallet balance of a user being deleted?
3. What is the enforcement mode for Account Limits edits (reject new / migrate existing)?
4. Toggle Visibility from Show → Hide while status is Active — is the commchannel still consumable by users?
5. When an account's Allowed IPs list is edited to exclude an active user's current IP, are active sessions terminated?
6. Who creates the Finance ID — is it entered by Falcon operator or pulled from the Finance system automatically?
7. Balance transfer limit % is computed vs what baseline — source wallet balance at transfer time? per day? per action?
8. Is there a notion of archiving an account, or only Active / Deleted?
9. What triggers the Renewal job — cron, on-demand, or first usage after Renew Date?
10. Full text of the wallet transfer UI flows per scenario — deep sync needed.
