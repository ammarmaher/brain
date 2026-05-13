*** PRD Understanding - Contract & Cost Management - QUESTIONS ***

# 03-contract-packaging-charging-billing-management - Open Questions

> Carried forward from `understanding.md:144-152`, `latest-prd.md:99-105`, plus new findings.

## Inherited from existing understanding.md / latest-prd.md

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-CC-01 | Where are **Packaging** and **Billing** PRDs? Are they Phase 2? (BR-CC-41) | Folder title implies coverage but body covers Contract + Cost only. | latest-prd.md:99-100; understanding.md:135; Drive folder `3- Contract, Packaging, Charging, Billing Mngmnt Module`. |
| Q-CC-02 | What is the tie-breaker when multiple Active contracts share the same Expiration Date? (BR-CC-42) | Charging cascade picks "nearest-expiring"; tie-breaker affects which contract is debited first. | understanding.md:88; ask Jawad / Mahmood. |
| Q-CC-03 | When an Expired contract is extended back to Active, do retroactive transactions in the expired window get processed? (BR-CC-47) | Determines whether the system needs a back-fill mechanism. | latest-prd.md:103; understanding.md:89; ask Jawad. |
| Q-CC-04 | Is the auto-Activate transition a cron job, an event, or a first-read computation? | Implementation strategy. | understanding.md:136; check Hangfire / Kafka topology. |
| Q-CC-05 | How is concurrent balance deduction handled on the same wallet — optimistic, pessimistic, or compare-and-swap? | Race conditions on high-volume Send Transaction. | understanding.md:137; ask Mahmood. |
| Q-CC-06 | Does VAT or any fee apply on top of SAR values per transaction? (BR-CC-44) | Pricing math + invoice integrity. | understanding.md:120, 140; ask Finance. |
| Q-CC-07 | Is there an audit log endpoint for contract edits (who changed what, when)? | Compliance + dispute resolution. | understanding.md:142; check Commerce ENDPOINT_REGISTRY (none observed). |
| Q-CC-08 | Is `Remaining Value` real-time or eventually-consistent? (BR-CC-45) | High-volume Send Transaction display lag. | understanding.md:141; ask Mahmood. |
| Q-CC-09 | Whatsapp priority `Service` (tentative per PRD) - keep, drop, or feature-flag? (BR-CC-23) | UI dropdown + matrix shape. | latest-prd.md:101; ask Jawad. |
| Q-CC-10 | Is the hundreds-of-millions upper bound per-contract or total-active? | Validation rule shape. | latest-prd.md:100; ask Jawad. |
| Q-CC-11 | Addons rate card zero-value short-circuit — does it mean "free" or "no cost applies"? (BR-CC-29) | Different semantics for billing display. | latest-prd.md:103; ask Jawad. |
| Q-CC-12 | Is there an admin UI for Price Unit list management, or is DB-only the permanent intent? (BR-CC-21) | Operations workflow when adding new Price Units. | understanding.md:128, 149; ask Mahmood. |
| Q-CC-13 | Pending contract cancellation - supported? (BR-CC-48) | Standard practice but PRD silent. | understanding.md:131; ask Jawad. |
| Q-CC-14 | Refund (failed campaign) — to which contract does the balance return; what expiration date? | Cross-cuts 03 + 01. | root-documents/latest-prd.md:22; ask Jawad. |
| Q-CC-15 | Addons purchase fallback — which contract defines the addon rate card when the searched contract has no matching addon? (BR-CC-50) | Determines fallback contract selection. | root-documents/latest-prd.md:23; ask Jawad. |

## New questions surfaced during cross-reference

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-CC-16 | The Commerce `CreateContractRequest` uses richer fields (`Quotas[]`, `OverageRates[]`, `UnitConversions[]`) than the PRD's `Addons` + `Rate Card`. Are Quotas / Overage / UnitConversions superset extensions, or pure renames? | Code-PRD mapping discipline. | Commerce DTO_DICTIONARY; ask Mahmood. |
| Q-CC-17 | Charging exposes `Reserve / Authorize / Commit / Release / DirectDebit` (OCS-style two-phase). PRD describes Send Transaction as a single "deduct from wallet" operation. Where is the OCS lifecycle surfaced to the business user? | Maps OCS primitives to PRD vocabulary. | Charging ENDPOINT_REGISTRY. |
| Q-CC-18 | `International Phone# Destination List` sheet was captured tab-1 only. What's in subsequent tabs? | Destination list completeness. | attachments.md:35; re-export multi-tab. |
| Q-CC-19 | Phone Number Analysis V6 (Drive Drawing) versus the prose `Destination Identification` doc — are they consistent? | Destination logic correctness. | attachments.md:66-69; ask Dina. |
| Q-CC-20 | Contracts API today has no `cancel`/`delete` endpoint. Is it intentional (immutable after create until expiry)? | Lifecycle gap (Q-CC-13 is the PRD-side question). | Commerce ENDPOINT_REGISTRY. |
| Q-CC-21 | `Contract.CommittedValue` (Commerce DTO) vs `Contract.ValueSar` (PRD) - is `CommittedValue` the same field, with currency abstracted out? | Naming alignment. | Commerce `ContractSummaryResponse`; PRD wording. |
| Q-CC-22 | When AO views Remaining Value on an Active contract, is the value computed from `Wallet -> WalletRecord (this contract) -> sum` server-side, or stored on Contract? | Performance + correctness. | Commerce `ContractResponse.RemainingBalance` semantics; cross-ref Charging `GetContractBalanceSummaries`. |
| Q-CC-23 | The Phone Number Analysis V6 + Destination logic - is the destination axis computed at send time, or stored against each ContractDetail row? | Static vs dynamic destination matching. | `Destination Identification` doc deep-read; ask Dina. |
| Q-CC-24 | Farabi integration cadence (real-time vs batch) and failure / reconciliation modes? | Integration reliability. | understanding.md:138; ask Farabi-integration owner. |
| Q-CC-25 | Where is the Send Transaction's `Dispatch` step (step 5 in W6) implemented — in 03's domain, in an Application service (e.g. WhatsApp BSP), or downstream? | Critical path of the platform. | Cross-check Falcon Charging Kafka topics + downstream services. |

## Banned synonyms / glossary discipline

- The PRD uses **Contract**; flag any UI/business copy using "Agreement" or "Subscription" (different concepts).
- The PRD uses **Master Wallet** consistently; do NOT alias.
- The PRD uses **Active / Pending / Expired** for contract statuses; flag if UI uses "Live", "Draft", "Closed".
- The PRD uses **Remaining Value**; flag "Balance Remaining" / "Credit Remaining" (consistent term).
- The PRD uses **Rate Card** for the SAR-per-Point conversion; flag "Pricing Sheet".
- The PRD uses **Contract Details** for the cost matrix; flag "Tariff Plan" (note: Commerce code uses `ContractTariffPlanResponse` — Q-CC-21).
- The PRD uses **Addon**; flag "Add-on" with hyphen (PRD style is one word per the doc).
- The PRD uses **Send Transaction**; this is the unit of work. Flag "Send Message" if more specific term is needed.
