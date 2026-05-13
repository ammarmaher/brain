# Latest PRD — Contract & Cost Management

| Field | Value |
|---|---|
| Drive folder | `3- Contract, Packaging, Charging, Billing Mngmnt Module` |
| Selected PRD file | `Contract & Cost Management V2` |
| Detected version | `V2` → numeric 2 |
| Mime type | Google Doc |
| Sync date | 2026-04-24 |
| Selection reason | Explicit `V2` beats the explicit `V1`. |

## Ignored duplicates

- `Contract & Cost Management V1` — earlier version; kept in Drive.

## Summary

Module owns contracts — their structure (information, rate card, contract details matrix, addons), statuses (Pending / Active / Expired), and the business logic that charges client wallets against the most-expiring contract first. Contracts feed the Master Wallet when they go Active. Contract edits are Falcon-usertype only, with field-level restrictions that depend on contract status. The PRD also details balance-impacting actions (Send Transaction, Activate/Purchase services, Contract expiration, Transfer balance) and how contract records move across wallets.

## Main requirements

### Create contract (Falcon usertype only) — 4 steps

**Step 1 — Contract Information**
- Contract ID (auto, unique), Farabi Reference ID (≤50, for Farabi integration), Contract Name (≤50, mandatory), Start Date (mandatory, ≥ today at 00:00), Expiration Date (> Start Date, at 23:59:59.999, mandatory), Value in SAR (positive float, ≤ hundreds of millions, mandatory), Contract Remaining Value (auto-calculated), Created Date (auto), Status (auto from dates).

**Step 2 — Rate Card**
Per visible CommChannel: Price Unit (predefined list, Falcon sets, client view-only) + Price Value (used to convert wallets from SAR → Points; applicable to Multiple-wallet accounts or Single-wallet with exactly one active commchannel). Example formula: `balance_in_points = sum(wallet_balance_sar / rate_card_price_value)` grouped by contract.

**Step 3 — Contract Details**
Matrix of Application × CommChannel × Priority/ServiceType × Destination → Cost(SAR). Charging uses this matrix to deduct per transaction. AI transactions have no Priority or Destination (only Destination = `Global`).

Predefined priorities:
- WhatsApp: Authentication, Utility, Advertisement, Service (tentative).
- Voice: High, Normal, Very low.
- AI: no priority; destination = `Global`.

**Step 4 — Addons**
Two things:
- Sub-services addon rate card (per sub-service cost: Voice Number, Nabaa Template, …).
- Free credit (addons) per sub-service or per commchannel/application.

If addon free-credit exhausts → fall back to addons rate-card value.

### Statuses

- **Pending** — start date in future; value NOT yet in master wallet; remaining = "NA"; full edit allowed (except auto IDs / created date).
- **Active** — start date reached; value charged to Master Wallet; remaining set; limited edit (see below).
- **Expired** — expiration date reached; all wallet records linked to this contract are deducted from the wallets' lump-sum values; records kept but unusable; remaining still shown to Falcon but hidden from client; limited edit.

### Edit contract (Falcon only)

**Pending** — editable: Name, Farabi Ref ID, Start Date, Expiration Date, Value, Rate Card (Unit + Value), Contract Details grid, Addons values.
**Active / Expired** — editable: Farabi Ref ID, Expiration Date (must be > now + start date), Rate Card price value, Contract Details grid, Addons values.

Extending an Expired contract's expiration beyond now → status returns to Active, hidden values come back, wallet records re-added to lump-sum totals.

### Wallet impact rules

Every balance-affecting action links to a contract ID. Balance is always deducted from the **nearest-expiring** active contract's wallet record first, looping to subsequent contracts until the transaction value is satisfied.

1. **Send Transaction (from App by Normal User)** — check configured wallet sufficiency → iterate nearest-expiring active contract records → update wallet + contract remaining.
2. **Activate / Purchase from Addons (Falcon or Account Owner)** — Single-wallet: use addons rate card of newest active contract; if free credit is zero, action completes; else deduct from nearest-expired addon then fallback to Master Wallet. Multiple-wallet: same but with fallback order Master → CommChannel wallets by user-set priority.
3. **Contract Expiration** — subtract this contract's wallet records from ALL wallet lump-sums; records persist but marked unusable.
4. **Transfer Balance** — always from nearest-expiring contract record in source; destination gets the same contract ID linked.
5. **Activate/Renew CommChannel or Application** — similar nearest-expiring cascade as #2 but using Master Wallet first, then CommChannel wallets by priority (Multiple-wallet case).

### Rate Card SAR → Points example

Client has Whatsapp wallet `1,701,495 SAR` = `1,250,245 SAR` (Contract #1 @ 0.18 SAR/txn) + `451,250 SAR` (Contract #2 @ 0.20 SAR/txn). Switching display to Points → `(1,250,245/0.18) + (451,250/0.20)` = `9,202,055.56 Points`.

## Roles

- **Falcon usertype** — full create/edit/view.
- **Client Account Owner** — view only (Remaining Value visible only when Active; hidden when Expired; `NA` when Pending).
- **Client Node Admin** — view only per 02-user-management matrix.
- **Normal User** — not applicable.

## Validations

- Start Date ≥ now at 00:00.
- Expiration Date > Start Date AND > now.
- Value > 0, float, ≤ hundreds of millions.
- Pending contracts are fully editable except auto-generated fields.
- Active / Expired contracts lock Name, Value, Start Date.
- Expiration Date edit on Active / Expired must be > now AND > start date.

## Dependencies

- **Account Management** — wallet configuration (Single / Multiple), commchannel wallet priority order.
- **CommChannel module** — visibility of commchannels feeds Rate Card and Contract Details.
- **Applications** — list feeds Contract Details matrix.
- **Destinations** — see `Destination Identification` supporting doc + `International Phone# Destination List` sheet; used in Contract Details.
- **Wallet & Balance Management** (in 01-account-management) — describes how wallets respond to contract events.
- **Farabi integration** — via Farabi Reference ID on each contract.

## Open questions

- "Packaging" and "Billing" (reports) are named in the folder title but the PRD covers Contract + Cost only. Where do Packaging and Billing live? In a future PRD?
- Contract hundreds-of-millions upper bound — is that per-contract or total-active?
- Priority `Service` for WhatsApp is tentative. Keep or drop?
- When an Expired contract is extended back to Active, does the retroactive period cover "lost" time (e.g. deductions since expiry)?
- Addons rate card zero-value short-circuit — does that mean free, or does it mean "no cost applies at all"? PRD wording implies free.
- Is `Remaining Value` real-time or eventually consistent? Matters for displays during high-volume send transactions.
