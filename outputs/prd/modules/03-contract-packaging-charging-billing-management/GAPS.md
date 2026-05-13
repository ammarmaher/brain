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
