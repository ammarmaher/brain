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

---

## Resolutions (Wave 2 — 2026-05-17)

### Q-CC-01 — Packaging + Billing scope contradiction [HALT-AND-FLAG, F-010]

**Not resolved autonomously.** PRD body says Contract + Cost; folder title says four concerns. Two readings contradict — DECISION-PROTOCOL `F-010` requires escalation.

**Pending-question file:** `Brain Outputs/datasets/authority-dataset/_pending-questions/wave-2-03-contract-Q-CC-01.md` (raised 2026-05-17).

**Recommendation:** keep current dossier state (Reading A — Packaging + Billing are Phase 2). Re-evaluate after product team responds.

### Q-CC-09 — Service priority tentative status [PARTIAL RESOLUTION]

**Inferred resolution: keep `Service` in the priority dropdown, label as `(tentative)` until product confirms.**

**Reasoning:**
- [PRD] `latest-prd.md:34` explicitly tags `Service` as "tentative" — so the PRD itself flagged the uncertainty.
- [BRAIN-OUT] Commerce DTO `ContractRateRequest.Priority` is a string — accepts any value at the wire level.
- DECISION-PROTOCOL `F-022` (two valid component choices): pick first option per category + log. Here "first option" is "include all four priorities including `Service`" since the PRD literally lists it.
- Conservative default (DECISION-PROTOCOL): include `Service` in the UI (so business users can pick it if needed) + tag with `(tentative)` label so they know it might be dropped.

**Action:** Build Contract Details matrix column with priority dropdown `[Authentication, Utility, Advertisement, Service (tentative)]`. Frontend `i18n` key: `contract.priority.whatsapp.service.tentative` → English: "Service (tentative)" · Arabic: "خدمة (مؤقت)".

### Q-CC-16 — PRD "Addons" vs Commerce DTO `Quotas` + `OverageRates` [RESOLVED]

**Concept mapping confirmed via D-CC-3 drift entry.**

**Resolution:**
- PRD "Addons / Free credit" → DTO `ContractQuotaRequest`
- PRD "Addons / Rate card" → DTO `ContractOverageRateRequest`
- PRD "Rate Card" (Step 2 of wizard) → DTO `ContractUnitConversionRequest` (SAR → Points conversion)
- PRD "Contract Details" (Step 3 of wizard) → DTO `ContractRateRequest` (App × CommChannel × Priority × Destination → Cost)

**Confidence:** High. The four DTOs match the four PRD concepts 1:1 once the mapping is established.

**Action:** Frontend Step 4 ("Addons" tab) is internally split into two sub-tables: "Free Credit Quotas" + "Overage Rates". User-facing label stays "Addons" per PRD glossary discipline.

### Q-CC-21 — `CommittedValue` (DTO) ≡ `ValueSar` (PRD) [RESOLVED]

**Field alias confirmed.** PRD's "Value in SAR" is `CommittedValue` in the Commerce DTO, with currency held in a separate `eCurrency Currency` field. See D-CC-2 in GAPS.md Wave 2 refresh.

**Action:** Frontend input label is "Contract Value (SAR)" (PRD wording); on submit, set `CommittedValue` from the input + `Currency = SAR` (per current product policy of SAR-only).

### Items NOT resolved (pending Drive deep-read or product input)

- Q-CC-02 (nearest-expiring tie-breaker), Q-CC-03 (retroactive expired window), Q-CC-04 (auto-Activate cron/event), Q-CC-05 (concurrent deduction strategy), Q-CC-06 (VAT), Q-CC-07 (audit log), Q-CC-08 (Remaining Value real-time vs eventual), Q-CC-10 (hundreds-of-millions per-contract vs total-active), Q-CC-11 (zero-value addon = free vs no-cost), Q-CC-12 (Price Unit admin UI), Q-CC-13 (Pending cancellation), Q-CC-14 (Refund), Q-CC-15 (Addon fallback contract selection), Q-CC-17 (OCS surface to business user), Q-CC-18 (Destination sheet tabs 2+), Q-CC-19 (Phone Analysis V6 vs Destination Identification), Q-CC-20 (Contracts DELETE endpoint), Q-CC-22 (Remaining Value compute strategy), Q-CC-23 (Destination static vs dynamic), Q-CC-24 (Farabi cadence), Q-CC-25 (Dispatch service ownership).

All require either deep handler code inspection, Drive doc re-read, or product team confirmation.
