# Understanding — Contract & Cost Management

## Module purpose

Define the commercial contract layer between Falcon and client accounts: what a contract is, how its value funds the account's wallets, how each transaction / sub-service purchase / activation consumes that value, and how contract expiration removes value from circulation. Also defines the rate card that converts SAR balances into Points for display.

Covers:
- Contract lifecycle (Pending / Active / Expired) and auto-transitions.
- Rate Card (SAR → Points conversion per commchannel).
- Contract Details matrix (cost of each transaction).
- Addons (free credits and sub-service rate cards).
- Balance-impacting actions and their linkage to contract IDs.

Does NOT cover:
- Packaging (not present in PRD despite folder title).
- Billing reports (not present in PRD despite folder title).

## Actors / users

- **Falcon usertype** (System Admin, Product — per `02-user-management`): create + edit contracts. Operation can view.
- **Client Account Owner**: view all contract details; Remaining Value visible only when Active.
- **Client Node Admin**: view only.
- **Client Normal User**: indirectly consumes contract via Send Transaction.

## Main screens

1. **Contracts & Cost Mng** list (Falcon + AO/NA view-only).
2. **Add Contract** wizard (4 steps — Info / Rate Card / Contract Details / Addons).
3. **Contract Detail** (multi-tab, read-only for clients, edit-constrained for Falcon).
4. **Edit Contract** (Falcon only).
5. (Not in PRD — Packaging and Billing screens: open questions.)

## Main actions

- Create contract (Falcon).
- Edit contract (Falcon, with status-aware restrictions).
- View contract (Falcon + AO).
- Background: auto-transition status on date triggers.
- Background: contract expiration wallet updates.

## Business rules

- **R1** Contract value flows into Master Wallet when contract becomes Active.
- **R2** Every balance-impacting action is linked to a contract ID and follows the **nearest-expiring-first** deduction rule.
- **R3** An account can have multiple Active contracts simultaneously.
- **R4** `Start Date` must be today or later; `Expiration Date` must be strictly greater than `Start Date`.
- **R5** Status is auto-derived from dates — users cannot set it directly.
- **R6** Expired contract's wallet records persist but are subtracted from every wallet's lump-sum value.
- **R7** Extending Expired → Active re-adds those records to the lump-sum totals.
- **R8** Rate Card price value is used for SAR↔Points display; it is advisory, not validated against Contract Details grid.
- **R9** Addons have two facets: free credit balance AND rate card — free credit consumed first, then rate card.
- **R10** Charging priority: Master Wallet first (Single wallet) OR Master → CommChannel wallets by account-defined priority (Multiple wallet).

## Cost matrix dimensions

A transaction cost is a function of **(Application, CommChannel, Priority/ServiceType, Destination)** → SAR cost.

- Applications: defined elsewhere (e.g. "Survey App", "Campaign").
- CommChannels: WhatsApp, Voice, AI, … (visibility-gated).
- Priority / ServiceType (per CommChannel):
  - WhatsApp: Authentication, Utility, Advertisement, Service (tentative).
  - Voice: High, Normal, Very Low.
  - AI: no priority, destination = `Global`.
- Destinations: local + international per `International Phone# Destination List` sheet.

## Main workflows

### Create → Activate → Expire
1. Falcon creates contract (Pending, value not in wallet).
2. Start date reached → system auto-Activate → value added to Master Wallet, linked by contract ID.
3. Client uses wallet for transactions / activations → deductions follow nearest-expiring rule.
4. Expiration date reached → system auto-Expire → lump-sum deduction across all wallets; records retained for audit + Falcon visibility.

### Send Transaction (Normal User via App)
Wallet value check → gather active-contract wallet records > 0 → deduct from nearest-expiring using Contract Details matrix (Application × Commchannel × Priority × Destination) → update wallet value + contract remaining → dispatch transaction only after deduction.

### Addon Activate / Purchase (Falcon + Account Owner)
Single wallet: nearest-expiring addon rate card zero? done; else deduct from nearest-expiring; fallback to Master Wallet if insufficient.
Multiple wallet: same but fallback chain Master → CommChannel wallets by priority.

### Transfer Balance
Always pulls from nearest-expiring record in source wallet; destination wallet inherits contract ID linkage.

## Edge cases

- Zero-value addon rate card short-circuits the deduction loop — treated as "free".
- Account has one Active contract with value less than a pending transaction → transaction aborts before dispatch.
- Multiple contracts with identical expiration dates → tie-breaker not specified; open question.
- Expired contract edited to extend expiration → retroactively reactivates wallet records; what about charges the client would have made during the expired window? PRD silent.
- Addon rate card not set for a requested sub-service → fall back to Master Wallet.
- Whatsapp priority `Service` is tentative — app code may need a feature flag until confirmed.

## Validations

- Contract Name ≤ 50 chars, mandatory.
- Farabi Reference ID ≤ 50 chars.
- Value positive float, ≤ hundreds-of-millions SAR.
- Dates per rules above.
- Rate Card: Price Unit from predefined list (editable only in DB without deployment per PRD).
- Contract Details grid: cells are non-negative floats (inferred; PRD doesn't state explicitly).

## Dependencies

- **Wallet & Balance Management** (in `01-account-management`) — prescriptive rules on how contracts feed and drain wallets.
- **CommChannel & Apps visibility** — constrains Rate Card and Contract Details.
- **Destinations** (`Destination Identification` doc + sheet) — defines destination list.
- **Farabi integration** — contracts carry a Farabi Reference ID for external billing sync.
- **Permissions / User Management** — who can create, edit, view.

## Data entities

- `Contract` { id, farabiRefId, name, startDate, expirationDate, valueSar, remainingValueSar, createdAt, status, accountId }
- `RateCardEntry` { contractId, commChannelId, priceUnit, priceValueSar }
- `ContractDetail` { contractId, applicationId, commChannelId, priority, destination, costSar }
- `Addon` { contractId, subServiceType, freeCreditValue, rateCardValue }
- `WalletRecord` { id, walletId, contractId, valueSar, createdAt } — linked-list-style, nearest-expiring traversal.

## API expectations (implied)

- `POST /contracts` — 4-step wizard commit.
- `PATCH /contracts/{id}` — status-aware field restrictions enforced server-side.
- `GET /contracts?accountId=` — list.
- `GET /contracts/{id}` — detail with tabs.
- Background jobs for date-based status transitions and wallet-sum recalculation on expiry.

## Assumptions

- Rate-card editing "without deployment" via DB implies DB-driven predefined lists for Price Unit; no admin UI for it in MVP.
- "Nearest-expiring" means smallest `expirationDate` among currently-Active contracts.
- Transactions are atomic against wallet balance and contract remaining value.
- Pending contracts can be cancelled; PRD doesn't explicitly say, but standard practice.

## Risks / unclear areas

- **Packaging and Billing are named in folder title but not in PRD.** High risk of scope gap.
- Pending → Active transition — whether it's a cron job, a trigger on first read, or on-the-fly computation.
- Concurrency on multiple Normal Users hitting the same wallet — locking strategy not described.
- Farabi integration cadence, failure modes, and reconciliation not covered.
- Addon types enumerated in the PRD only by example (Voice Number, Nabaa Template, Sender Name) — full list unclear.
- Tax handling — no mention of VAT on SAR values.
- Audit trail granularity for contract edits.
- Remaining Value real-time vs cached.

## Clarifying questions

1. Where are Packaging and Billing PRDs? Are they Phase 2?
2. Tie-breaker when multiple Active contracts share the same Expiration Date?
3. What happens to transactions that occurred during an Expired window if the contract is later extended?
4. Is there an admin UI for Price Unit list management, or is DB-only the permanent intent?
5. How is concurrent balance deduction handled on the same wallet (optimistic lock? pessimistic?)?
6. Does VAT or any fee apply on top of the SAR value per transaction?
7. Is there an audit log endpoint for contract edits (who changed what and when)?
