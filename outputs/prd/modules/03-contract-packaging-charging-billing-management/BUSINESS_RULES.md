*** PRD Understanding - Contract & Cost Management - BUSINESS_RULES ***

# 03-contract-packaging-charging-billing-management - Business Rules

> Citations point at `Brain SK\skills\imported-business\prd-knowledge\modules\03-contract-packaging-charging-billing-management\latest-prd.md` unless otherwise noted.

## Contract Structure & Validation

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-01 | Contracts are created by Falcon usertype only. | latest-prd.md:23 | [CONFIRMED] |
| BR-CC-02 | Contract has 4 wizard steps: Information / Rate Card / Contract Details / Addons. | latest-prd.md:23-46 | [CONFIRMED] |
| BR-CC-03 | Contract ID is auto-generated and unique. | latest-prd.md:25 | [CONFIRMED] |
| BR-CC-04 | Farabi Reference ID is <=50 chars, used for Farabi integration. | latest-prd.md:25 | [CONFIRMED] |
| BR-CC-05 | Contract Name is <=50 chars, mandatory. | latest-prd.md:25 | [CONFIRMED] |
| BR-CC-06 | Start Date must be >= today at 00:00 (mandatory). | latest-prd.md:25, 82 | [CONFIRMED] |
| BR-CC-07 | Expiration Date must be > Start Date AND > now (mandatory); time-of-day is 23:59:59.999. | latest-prd.md:25, 83, 85 | [CONFIRMED] |
| BR-CC-08 | Contract Value (SAR) is a positive float, <= hundreds of millions, mandatory. | latest-prd.md:25, 84 | [CONFIRMED] |
| BR-CC-09 | Contract Remaining Value is auto-calculated. | latest-prd.md:25 | [CONFIRMED] |
| BR-CC-10 | Status is auto-derived from dates; users cannot set it directly. | latest-prd.md:25; understanding.md:44 | [CONFIRMED] |

## Statuses

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-11 | Statuses are: Pending, Active, Expired. | latest-prd.md:46-50 | [CONFIRMED] |
| BR-CC-12 | Pending = start date in future; contract value NOT yet in Master Wallet; Remaining Value = `NA`. | latest-prd.md:47 | [CONFIRMED] |
| BR-CC-13 | Active = start date reached; value charged to Master Wallet; Remaining Value set. | latest-prd.md:48 | [CONFIRMED] |
| BR-CC-14 | Expired = expiration date reached; wallet records linked to this contract are deducted from wallets' lump-sum values; records retained but unusable; Remaining Value still shown to Falcon, hidden from client. | latest-prd.md:49, 60; understanding.md:48 | [CONFIRMED] |

## Edit Restrictions

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-15 | Pending contract edit (Falcon only): editable = Name, Farabi Ref ID, Start Date, Expiration Date, Value, Rate Card, Contract Details grid, Addons values. | latest-prd.md:53 | [CONFIRMED] |
| BR-CC-16 | Active / Expired contract edit (Falcon only): editable = Farabi Ref ID, Expiration Date (must be > now AND > Start Date), Rate Card price value, Contract Details grid, Addons values. Locked: Name, Value, Start Date. | latest-prd.md:54, 86 | [CONFIRMED] |
| BR-CC-17 | Extending an Expired contract's Expiration beyond now -> status returns to Active; previously-hidden values reappear; wallet records re-added to lump-sums. | latest-prd.md:55-56 | [CONFIRMED] |

## Rate Card (Step 2)

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-18 | Rate Card exists per visible CommChannel; Price Unit is from a predefined list (Falcon-set, client view-only); Price Value converts SAR -> Points. | latest-prd.md:27-28 | [CONFIRMED] |
| BR-CC-19 | SAR -> Points conversion: `balance_in_points = sum(wallet_balance_sar / rate_card_price_value)` grouped by contract. | latest-prd.md:28, 69-70 | [CONFIRMED] |
| BR-CC-20 | Rate Card Price Value applies to: Multiple-wallet accounts, OR Single-wallet accounts with EXACTLY ONE active commchannel. | latest-prd.md:28 | [CONFIRMED] |
| BR-CC-21 | Rate Card price-unit list is editable in DB without deployment. | understanding.md:99 | [CONFIRMED] |

## Contract Details Matrix (Step 3)

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-22 | Cost is a function of (Application, CommChannel, Priority/ServiceType, Destination) -> SAR cost. | latest-prd.md:31 | [CONFIRMED] |
| BR-CC-23 | Predefined WhatsApp priorities: Authentication, Utility, Advertisement, Service (tentative). | latest-prd.md:34 | [CONFIRMED; **`Service` is tentative**] |
| BR-CC-24 | Voice priorities: High, Normal, Very Low. | latest-prd.md:35 | [CONFIRMED] |
| BR-CC-25 | AI transactions have no Priority and Destination = `Global`. | latest-prd.md:32, 36 | [CONFIRMED] |
| BR-CC-26 | Destinations come from the `International Phone# Destination List` sheet + `Destination Identification` doc. | attachments.md:30; latest-prd.md:93 | [CONFIRMED] |

## Addons (Step 4)

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-27 | Two parts: Sub-services addon rate card (per sub-service cost: Voice Number, Nabaa Template, ...) + Free credit (addons) per sub-service or per commchannel/application. | latest-prd.md:40-44 | [CONFIRMED] |
| BR-CC-28 | If addon free-credit exhausts -> fall back to addons rate-card value. | latest-prd.md:44 | [CONFIRMED] |
| BR-CC-29 | Zero-value addon rate card short-circuits deduction (treated as free). | understanding.md:87 | [INFERRED] |

## Wallet Impact / Charging Logic

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-30 | Every balance-affecting action is linked to a contract ID. | latest-prd.md:60; cross-ref BR-AM-36 | [CONFIRMED] |
| BR-CC-31 | Balance is deducted from the **nearest-expiring** Active contract first, looping forward until amount is satisfied. | latest-prd.md:60; understanding.md:44 | [CONFIRMED] |
| BR-CC-32 | Send Transaction (Normal User via App): check wallet sufficiency -> iterate nearest-expiring Active contracts -> deduct per Contract Details matrix -> update wallet + contract remaining -> dispatch. | latest-prd.md:62; understanding.md:74-75 | [CONFIRMED] |
| BR-CC-33 | Activate / Purchase from Addons - Single wallet: use addons rate card of newest active contract; if free credit zero, action completes; else deduct from nearest-expired addon then fallback to Master Wallet. | latest-prd.md:63; understanding.md:77 | [CONFIRMED] |
| BR-CC-34 | Activate / Purchase from Addons - Multiple wallet: same as Single but fallback order is Master -> CommChannel wallets by user-set priority. | latest-prd.md:63 | [CONFIRMED] |
| BR-CC-35 | Transfer Balance always pulls from nearest-expiring record in source wallet; destination inherits the contract ID linkage. | latest-prd.md:65 | [CONFIRMED] |
| BR-CC-36 | Activate / Renew CommChannel or Application: cascade similar to addons - Master Wallet first (Single), Master -> CommChannel wallets by priority (Multiple). | latest-prd.md:66 | [CONFIRMED] |
| BR-CC-37 | Contract value flows into Master Wallet when contract becomes Active (cross-ref BR-AM-35). | understanding.md:43 | [CONFIRMED] |
| BR-CC-38 | On contract Expiration, all wallet records linked to that contract are excluded from every wallet's lump-sum. Records persist for audit. | latest-prd.md:60, 49 | [CONFIRMED] |
| BR-CC-39 | Multiple Active contracts simultaneously per account are allowed. | understanding.md:45 | [CONFIRMED] |

## Roles & View Visibility

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-40 | Account Owner can view contracts; Remaining Value is visible only when Active, `NA` when Pending, hidden when Expired. | latest-prd.md:74-75 | [CONFIRMED] |

## Open / Unstated

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-CC-41 | Packaging and Billing scope - PRD silent (folder names them but body doesn't cover). | understanding.md:135 | [OPEN] |
| BR-CC-42 | Tie-breaker when multiple Active contracts share the same Expiration Date - silent. | understanding.md:88 | [OPEN] |
| BR-CC-43 | Concurrent send-transaction locking strategy (optimistic vs pessimistic) on shared wallet - silent. | understanding.md:137 | [OPEN] |
| BR-CC-44 | Tax / VAT handling on SAR values - silent. | understanding.md:120, 140 | [OPEN] |
| BR-CC-45 | Remaining Value real-time vs eventually-consistent - silent. | understanding.md:141 | [OPEN] |
| BR-CC-46 | Audit log granularity for contract edits - silent. | understanding.md:142 | [OPEN] |
| BR-CC-47 | Retroactive treatment when Expired contract is extended back to Active (charges in the expired window?) - silent. | latest-prd.md:103; understanding.md:89 | [OPEN] |
| BR-CC-48 | Cancellation of Pending contracts - silent (assumed allowed by standard practice). | understanding.md:128 | [OPEN] |
| BR-CC-49 | Refund flow (failed campaign) - silent in this PRD; flagged in root-documents/latest-prd.md:22. | root-documents/latest-prd.md:22 | [OPEN] |
| BR-CC-50 | Addons rate card fallback when searched contract has no matching addon - silent; flagged in root-documents. | root-documents/latest-prd.md:23 | [OPEN] |
