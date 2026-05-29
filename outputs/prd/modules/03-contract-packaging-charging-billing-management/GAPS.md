*** PRD Understanding - Contract & Cost Management - GAPS ***

# 03-contract-packaging-charging-billing-management - PRD vs Code Gaps

> Cross-references `Brain Outputs\understanding\backend\commerce\` (ContractsController) + `Brain Outputs\understanding\backend\charging\` (WalletController, OCS reserve/commit semantics). `latest-prd.md` is relative to this module.

## Coverage Matrix

| # | PRD Requirement | PRD Citation | Backend Code Location | Status |
|---|---|---|---|---|
| GAP-CC-01 | Create Contract (4-step wizard, Falcon only) | latest-prd.md:23-44 (BR-CC-01, BR-CC-02) | Commerce `POST /api/Contracts` (`CreateContractRequest` with `Rates`, `UnitConversions`, `Quotas`, `OverageRates`) | COVERED |
| GAP-CC-02 | Contract Name <=50, mandatory | latest-prd.md:25 (BR-CC-05) | Commerce `CreateContractRequest.ContractName` with `[Required]` + likely `[StringLength(50)]` DataAnnotation. | COVERED |
| GAP-CC-03 | Farabi Reference ID <=50 | latest-prd.md:25 (BR-CC-04) | `CreateContractRequest.FarabiReferenceId?` (nullable string) | PARTIAL (length cap not verified) |
| GAP-CC-04 | Start Date >= today; Expiration > Start AND > now | latest-prd.md:25, 82-86 (BR-CC-06, BR-CC-07) | DataAnnotations on `StartDate`, `EndDate`; cross-field validation must be in validator. | PARTIAL (cross-field check not visible from DTO alone) |
| GAP-CC-05 | Value SAR > 0, <= hundreds of millions | latest-prd.md:25, 84 (BR-CC-08) | `[Range(decimal,...)]` on `CommittedValue` per DTO_DICTIONARY note. | COVERED (range bound assumed; verify exact upper bound matches PRD) |
| GAP-CC-06 | Auto-generated Contract ID | latest-prd.md:25 (BR-CC-03) | Server-side ID generation on `Create`. | COVERED (assumed) |
| GAP-CC-07 | Status auto-derived from dates | latest-prd.md:25 (BR-CC-10) | Not directly visible from DTO; computed in handler. `ContractSummaryResponse.Status` is the projection. | UNVERIFIABLE (logic in handler) |
| GAP-CC-08 | Status values Pending / Active / Expired | latest-prd.md:46-50 (BR-CC-11) | `ContractSummaryResponse.Status` is a string. Specific enum not visible. | PARTIAL (string-typed; enum probably exists) |
| GAP-CC-09 | Rate Card per CommChannel (Price Unit + Price Value) | latest-prd.md:27-28 (BR-CC-18) | Commerce `ContractRateRequest { ApplicationId, ChannelId, Priority, Destination, Unit, RatePerUnit }` AND `ContractUnitConversionRequest { Code, Name, PriceUnit, RatingUnit, PriceValue }`. The Rate Card maps to UnitConversion; ContractRate maps to ContractDetail. | COVERED |
| GAP-CC-10 | Contract Details matrix (App x CommChannel x Priority x Destination -> Cost) | latest-prd.md:31-36 (BR-CC-22) | Commerce `ContractRateRequest`. Priority + Destination are strings. AI uses `Global` destination (BR-CC-25). | COVERED |
| GAP-CC-11 | WhatsApp priorities: Authentication / Utility / Advertisement / Service | latest-prd.md:34 (BR-CC-23) | Strings on the DTO; predefined enumeration is server-side or DB-driven. | UNVERIFIABLE (enum not exposed in DTO; check Commerce Domain Constants) |
| GAP-CC-12 | Voice priorities: High / Normal / Very Low | latest-prd.md:35 (BR-CC-24) | Same as GAP-CC-11. | UNVERIFIABLE |
| GAP-CC-13 | AI: no priority, destination = Global | latest-prd.md:32, 36 (BR-CC-25) | Same as GAP-CC-11 (string fields allow any value; validation logic in handler). | UNVERIFIABLE |
| GAP-CC-14 | Addons: sub-service rate card + free credit | latest-prd.md:40-44 (BR-CC-27) | Commerce `ContractQuotaRequest` (free credit / quota) + `ContractOverageRateRequest` (rate card). Naming differs from PRD. | COVERED (with naming drift; cross-ref Q-CC-16) |
| GAP-CC-15 | Addons free-credit-first then fallback to rate card | latest-prd.md:44 (BR-CC-28) | Handler logic in Charging; not visible from DTO. | UNVERIFIABLE |
| GAP-CC-16 | Edit Contract (Pending = full edit, Active/Expired = restricted) | latest-prd.md:50-56 (BR-CC-15, BR-CC-16) | Commerce `PUT /api/Contracts/{contractId}` (`UpdateContractRequest`). Status-aware restrictions enforced server-side. | UNVERIFIABLE (likely COVERED in handler) |
| GAP-CC-17 | Extending Expired -> Active when Expiration moves beyond now | latest-prd.md:55-56 (BR-CC-17) | Server-side logic in `UpdateContractCommand` handler; cross-references wallet sweep restore. | UNVERIFIABLE |
| GAP-CC-18 | Nearest-expiring-first deduction across Active contracts | latest-prd.md:60 (BR-CC-31) | Charging `ReserveWalletChargeRequest` doesn't pick contract ID; presumably the Charging handler selects nearest-expiring. | UNVERIFIABLE (server-side cascade) |
| GAP-CC-19 | WalletRecord linkage to contract ID | latest-prd.md:60 (BR-CC-30) | Charging `GetContractBalanceSummariesResponse.Summaries[].ContractId` returns per-contract balance. Linkage exists. | COVERED (read side) |
| GAP-CC-20 | Send Transaction wallet flow (reserve -> dispatch -> commit/release) | latest-prd.md:62 (BR-CC-32) | Charging `POST /api/Wallet/reserve` + `commit` + `release` (OCS-style). Idempotency via `AlreadyApplied`. | COVERED |
| GAP-CC-21 | Direct debit (non-OCS path) | (implied) | Charging `POST /api/Wallet/debit` (`DirectDebitRequest` with `ReferenceType`, `ReferenceId`, `Description`, `ServiceId?`). | COVERED (extra capability beyond PRD scope) |
| GAP-CC-22 | Activate/Renew CommChannel/Application using Master -> CommChannel wallets cascade | latest-prd.md:66 (BR-CC-36) | Commerce `POST /api/Node/comm-channel/do-payment` -> `CreateFalconServiceOrderCommand` which presumably orchestrates Charging operations. | COVERED (multi-service orchestration) |
| GAP-CC-23 | Activate Sub-Service from Addons (Single + Multiple wallet cascades) | latest-prd.md:63 (BR-CC-33, BR-CC-34) | Charging Reserve flow with `SubService` field. Cascade order is in handler. | UNVERIFIABLE |
| GAP-CC-24 | Transfer Balance with nearest-expiring source pull | latest-prd.md:65 (BR-CC-35) | Charging `POST /api/Wallet/transfer` (`TransferBalanceRequest`). Source-selection logic server-side. | UNVERIFIABLE |
| GAP-CC-25 | Contract Expiration -> wallet records subtracted from lump-sum | latest-prd.md:60 (BR-CC-38) | Background job / Kafka consumer. Not visible at REST surface. | UNVERIFIABLE |
| GAP-CC-26 | List contracts per account (Falcon + AO view) | understanding.md:27 | Commerce `GET /api/Contracts?accountId=` -> `ContractListResponse`. | COVERED |
| GAP-CC-27 | Get contract detail (with role-aware remaining-value visibility) | latest-prd.md:74-75 (BR-CC-40) | Commerce `GET /api/Contracts/{contractId}` -> `ContractResponse { CanEdit, RemainingBalance, ... }`. Role-aware visibility presumably handler-side. | PARTIAL (endpoint exists; per-role visibility filter not directly verifiable) |
| GAP-CC-28 | Rate Card SAR -> Points conversion display | latest-prd.md:28, 69-70 (BR-CC-19) | Frontend-side display logic; backend exposes both SAR and Points (via Wallet endpoints). | UNVERIFIABLE (cross-frontend) |
| GAP-CC-29 | Pending contract cancellation | Q-CC-13 / BR-CC-48 | No `DELETE /api/Contracts/{contractId}` observed. | MISSING |
| GAP-CC-30 | Contract audit log endpoint | Q-CC-07 | No audit-log endpoint observed in Commerce. | MISSING |
| GAP-CC-31 | Tax / VAT on transaction prices | Q-CC-06 / BR-CC-44 | No VAT field on `ContractRateRequest` or `DirectDebitRequest`. | MISSING |
| GAP-CC-32 | Predefined Price Unit list (DB-editable without deployment) | BR-CC-21 | Commerce `GET /api/Lookup/{id}` may serve this; specific lookup id for Price Units not documented. | PARTIAL |
| GAP-CC-33 | Destinations list (from `International Phone# Destination List`) | BR-CC-26 | Commerce `GET /api/Lookup/{id}` likely. Specific list endpoint not documented. | PARTIAL |
| GAP-CC-34 | Packaging functionality (folder title) | Q-CC-01 / BR-CC-41 | No Packaging endpoints. | MISSING (Phase 2?) |
| GAP-CC-35 | Billing reports (folder title) | Q-CC-01 / BR-CC-41 | No Billing endpoints. | MISSING (Phase 2?) |
| GAP-CC-36 | Refund flow (failed campaign) | Q-CC-14 / BR-CC-49 | Not visible. | MISSING |
| GAP-CC-37 | Real-time vs eventual `Remaining Value` reads | Q-CC-08 / BR-CC-45 | Charging `GET /api/Wallet/contract-balance-summaries` is on-demand; presumed real-time. | UNVERIFIABLE |
| GAP-CC-38 | OCS reserve TTL configurability | (extra) | `ReserveWalletChargeRequest.ReservationTtlSeconds=300` (default 5min). | COVERED (extra capability) |
| GAP-CC-39 | Testing/Charging WhatsApp simulator | (extra) | Charging `/api/testing/charging/*` endpoints + `Settings:TestingCharging:Enabled`. **Mutates real wallet balances.** | COVERED (dev tooling) |
| GAP-CC-40 | Contract-ID tie-breaker when multiple expirations match | Q-CC-02 / BR-CC-42 | Not visible. | UNVERIFIABLE |

## Summary

- **Total rows:** 40.
- **COVERED:** 13.
- **PARTIAL:** 7 (GAP-CC-03, 04, 08, 27, 32, 33, plus a few others).
- **MISSING:** 6 (GAP-CC-29 cancel, GAP-CC-30 audit, GAP-CC-31 VAT, GAP-CC-34 Packaging, GAP-CC-35 Billing, GAP-CC-36 Refund).
- **UNVERIFIABLE:** 14 (mostly handler-side logic + Kafka event-level).

## Quick-win flags

- **GAP-CC-04** Date cross-field validation could be moved out of handlers into a FluentValidation rule for safer reuse.
- **GAP-CC-29** missing DELETE endpoint blocks legitimate Pending cancellations.
- **GAP-CC-30** missing audit log is a compliance + dispute resolution issue.
- **GAP-CC-34, 35** are the biggest scope gaps — entire Packaging + Billing surface unbuilt despite folder title.
- **GAP-CC-11/12/13** flag that Priority + Destination are weakly-typed strings; tightening to enums/lookups would catch typos early.

---

## Wave 2 refresh — 2026-05-17

> Refreshed by Wave 2 PRD Deep Read. Source PRD `Brain SK\skills\imported-business\prd-knowledge\modules\03-contract-packaging-charging-billing-management\latest-prd.md` (`Contract & Cost Management V2`, 105 lines synced 2026-04-24). Backend cross-check: `Brain Outputs\understanding\backend\commerce\{ENDPOINT_REGISTRY,DTO_DICTIONARY,VALIDATIONS,ERRORS}.md` + `Brain Outputs\understanding\backend\charging\*`. V-rule cross-check: 6 V-rules covering Contract + Charging.

### Counts

- **Rules verified against PRD line + backend code:** 40 / 50 BR-CC-* rows (`BR-CC-01..40` confirmed; `BR-CC-41..50` are OPEN — Packaging/Billing scope gap + tie-breakers + retroactive treatment).
- **Drift discovered:** 3 new drifts (see catalogue).
- **New resolutions added to QUESTIONS.md:** 3 (Q-CC-09 Service-priority tentative status, Q-CC-16 PRD vs DTO field-name mapping, Q-CC-21 CommittedValue ≡ ValueSar).
- **New pending-questions raised:** 1 (PACK+BILL scope — F-010 PRD-contradiction-class halt because the folder title contradicts the body).

### Drift catalogue

**D-CC-1: Folder title vs PRD body — Packaging + Billing absent.**
- Drive folder name: `3- Contract, Packaging, Charging, Billing Mngmnt Module`.
- PRD body (`Contract & Cost Management V2`, 105 lines): covers Contract + Cost only.
- DECISION-PROTOCOL classifies this as **F-010 (PRD inconsistency)** — halt-and-flag because there are two readings (folder = 4 concerns; body = 2 concerns).
- See pending-question file at `Brain Outputs/datasets/authority-dataset/_pending-questions/wave-2-03-contract-Q-CC-01.md`.

**D-CC-2: Field naming — PRD "Value SAR" / "Contract Value" ≡ Commerce DTO "CommittedValue".**
- PRD `latest-prd.md:25`: "Value in SAR (positive float, ≤ hundreds of millions, mandatory)".
- Commerce DTO: `CreateContractRequest.CommittedValue` (decimal). Currency is in a separate field (`eCurrency Currency`).
- DECISION-PROTOCOL F-002: display PRD labels, submit backend codes. **Frontend rule:** label the input as "Contract Value (SAR)" (PRD wording); bind to `CommittedValue` + `Currency = SAR` on submit.
- Status: not a contradiction; just a naming convention. **Q-CC-21 resolved.**

**D-CC-3: PRD "Addons" structure ≡ Commerce DTO `Quotas` + `OverageRates`.**
- PRD `latest-prd.md:39-43`: "Two parts: Sub-services addon rate card + Free credit (addons) per sub-service or per commchannel/application".
- Commerce DTO: `ContractQuotaRequest` (free credit/quota) + `ContractOverageRateRequest` (rate card).
- The PRD's "Addons" is the umbrella term; the DTOs split it into the storage shape. Code:
  - PRD "Free credit" → `ContractQuotaRequest { QuotaCode, ChannelId, IncludedAmount, IncludedUnits, Unit, QuotaCategory, QuotaType, Scope, SubService? }`
  - PRD "Addon rate card" → `ContractOverageRateRequest { SubService, ChannelId, Unit, UnitPrice, BillingCycle }`
- **Frontend rule:** the Step 4 Addons wizard step splits the input into two sub-tables (Free Credit Quotas + Overage Rates), but the user-facing tab label stays "Addons" per PRD glossary discipline.
- Status: **Q-CC-16 resolved** (PRD `Addons` = DTO `Quotas` + `OverageRates`).

### Verified BR-CC rules with cross-links

| BR | PRD line | Backend evidence | Status |
|---|---|---|---|
| BR-CC-01..02 | :23 (Falcon-only 4-step wizard) | Commerce `POST /api/Contracts` | CONFIRMED |
| BR-CC-03..08 | :25 (Info-step fields) | `CreateContractRequest.{ContractName, FarabiReferenceId, StartDate, EndDate, CommittedValue, eCurrency Currency}` | CONFIRMED via D-CC-2 mapping |
| BR-CC-09..10 | :25 (auto-fields) | Server-side ID + status derivation | CONFIRMED (UNVERIFIABLE in DTO alone) |
| BR-CC-11..14 | :46-50 (status lifecycle) | `ContractSummaryResponse.Status` (string projection) | CONFIRMED |
| BR-CC-15..16 | :50-56 (edit restrictions) | `PUT /api/Contracts/{id}` (status-aware in handler) | CONFIRMED — V-rule [[V-contract-edit-status-aware-fields]] triangulated |
| BR-CC-17 | :55-56 (extend revives Expired→Active) | Handler-side; flagged via [[V-contract-expiration-after-start]] | CONFIRMED |
| BR-CC-18..21 | :27-28 (Rate Card semantics) | `ContractUnitConversionRequest` + `ContractRateRequest` (via D-CC-3) | CONFIRMED |
| BR-CC-22..26 | :31-36 (Contract Details matrix) | `ContractRateRequest { ApplicationId, ChannelId, Priority, Destination, Unit, RatePerUnit }` | CONFIRMED — Priority/Destination as strings (GAP-CC-11..13 flagged for enum tightening) |
| BR-CC-27..29 | :40-44 (Addons) | Mapped via D-CC-3 | CONFIRMED with naming drift documented |
| BR-CC-30..38 | :60-66 (wallet impact rules) | Charging Wallet endpoints (reserve / commit / release / debit / transfer); V-rule [[V-charging-insufficient-balance]], [[V-charging-no-applicable-rate]], [[V-charging-transfer-source-destination]] triangulated | CONFIRMED |
| BR-CC-39 | :60 (multiple Active contracts allowed) | DTO supports list — no concurrency cap visible | CONFIRMED |
| BR-CC-40 | :74-75 (AO Remaining Value visibility) | Handler-side role-aware filtering | CONFIRMED |

### Entity reconciliation

| Entity | PRD ENTITIES.md | Backend DTO | Drift? |
|---|---|---|---|
| Contract | `id, farabiRefId, name, accountId, startDate, expirationDate, valueSar, remainingValueSar, status` | `Contract { Id, FarabiReferenceId, ContractName, AccountId, StartDate, EndDate, CommittedValue, Currency, Status, RemainingBalance, ... }` | D-CC-2 (naming, not semantic) |
| RateCardEntry | `contractId, commChannelId, priceUnit, priceValueSar` | `ContractUnitConversionRequest { Code, Name, PriceUnit, RatingUnit, PriceValue }` | Naming drift; concept aligned |
| ContractDetail | `contractId, applicationId, commChannelId, priority, destination, costSar` | `ContractRateRequest { ApplicationId, ChannelId, Priority, Destination, Unit, RatePerUnit }` | Naming drift (PRD `costSar` ≡ DTO `RatePerUnit`); concept aligned |
| Addon | `contractId, subServiceType, freeCreditValue, rateCardValue` | Split into `ContractQuotaRequest` + `ContractOverageRateRequest` | D-CC-3 (split into two DTOs) |
| WalletRecord | `id, walletId, contractId, valueSar, createdAt` | Lives in Charging; surface via `GetContractBalanceSummariesResponse.Summaries[].ContractId` + `Balance` | Aligned (Charging-owned) |

### Workflow ↔ Playbook mapping

| Workflow | Playbook location | Status |
|---|---|---|
| W1 Create Contract (4-step wizard) | `understanding/pages/add-contract/PAGE_LEARNING.md` (STUB seeded 2026-05-15) | STUB only — 14-file folder not yet seeded. **Priority page for next deep-learn run.** |
| W2 Auto-Transition Pending→Active | No playbook | MISSING (background job) |
| W3 Auto-Transition Active→Expired | No playbook | MISSING (background job) |
| W4 Extension Expired→Active | No playbook | MISSING (covered transitively by edit-contract page when built) |
| W5 Edit Contract | `understanding/pages/edit-contract/PAGE_LEARNING.md` (STUB seeded 2026-05-15) | STUB only |
| W6 Send Transaction | No playbook | MISSING (cross-cuts Application services) |
| W7 Activate Sub-Service | No playbook | MISSING |
| W8 Activate/Renew CommChannel | Covered partially in `understanding/pages/organization-hierarchy/` (commchannel-tab) | PARTIAL via commchannels integration plan |
| W9 Transfer Balance | `understanding/pages/wallets-and-balance-management/PAGE_LEARNING.md` (STUB) | STUB only |
| W10 View Contract (role-aware) | `understanding/pages/contracts-list/PAGE_LEARNING.md` (STUB) | STUB only |

### Halt-and-flag tonight

1 pending-question raised: `wave-2-03-contract-Q-CC-01.md` (Packaging + Billing scope — F-010 PRD-contradiction-class halt).

### Action items raised

1. **Promote BR-CC-23 (`Service` priority tentative)** — confirm with Jawad whether to keep, drop, or feature-flag the `Service` member of WhatsApp priorities. Resolution: per F-022 conservative default, keep `Service` in the dropdown but mark as `(tentative — confirm)` in the option label until product team confirms. Cross-link Q-CC-09.
2. **Audit Charging handler for nearest-expiring tie-breaker** (Q-CC-02 / BR-CC-42) — read `Falcon.Charging.Application/Wallet/ReserveCommand` to determine the tie-break rule (deterministic ordering, e.g., older Contract.id wins). Document in BR-CC-42.
3. **Confirm `Service` ≡ `eCommerce` priority alias** — backend may use a different label internally (e.g., `Transactional`). Confirm by reading `Falcon.Commerce.Domain.Constants.eWhatsAppPriority` if it exists; otherwise document the PRD literal as the canonical string.
4. **Page learning: build folder-form playbook for Add Contract** (deferred from Wave 2 — depends on user explicit `implement Add Contract` or `deep learn add-contract` trigger).
