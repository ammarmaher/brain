*** PRD Understanding - Account Management - GAPS ***

# 01-account-management - PRD vs Code Gaps

> Cross-references backend ENDPOINT_REGISTRY for `commerce` (controllers/NodeController, AccountHierarchyController, ContractsController, InformationController, SettingController) and `charging` (controllers/WalletController). Citation paths assume `Brain Outputs\understanding\backend\<service>\ENDPOINT_REGISTRY.md` and `latest-prd.md` is relative to `Brain SK\skills\imported-business\prd-knowledge\modules\01-account-management\`.

## Coverage Matrix

| # | PRD Requirement | PRD Citation | Backend Code Location | Status |
|---|---|---|---|---|
| GAP-AM-01 | Create Account (5-step wizard) | latest-prd.md:31-54 | Commerce `POST /api/Node/create-account` (`CreateAccountRequest -> CreateAccountResponse` via `ICreateMainNodeProcess`) | COVERED |
| GAP-AM-02 | Account Name uniqueness check | latest-prd.md:34 (BR-AM-03) | Commerce `GET /api/Node/ValidateAccountName?AccountName=` -> `bool`; bound in frontend `account-validation.service.ts` | COVERED |
| GAP-AM-03 | Account Name <=30 chars, starts with letter | latest-prd.md:34 (BR-AM-03) | `CreateAccountRequest.Info.AccountName` is `string` with `[ThrowIfNotPassed]` and `[ThrowIfMaxLengthExceed(30)]`; **starts-with-letter** rule not visible in commerce DTO attributes | PARTIAL |
| GAP-AM-04 | Read account hierarchy (Root -> Main -> Sub) | understanding.md:18 | Commerce `GET /api/Node?NodeId=` (`GetHierarchy` -> `List<GetHierarchyNodeResponse>`); also `GET /api/accounts/hierarchy` (`AccountHierarchyController`) returning `GetAccountHierarchyResponse` (recursive `Hierarchy.SubNodes`) | COVERED |
| GAP-AM-05 | Create Sub-Node | latest-prd.md:27-29; understanding.md:33 | Commerce `POST /api/Node/create-SubNode` (`CreateSubNodeRequest`) | COVERED |
| GAP-AM-06 | Change Node Name | understanding.md:33 | Commerce `PUT /api/Node/ChangeNodeName` (`ChangeNodeNameRequest`) | COVERED |
| GAP-AM-07 | Move Sub-Node to a different parent level | root-documents/latest-prd.md:21 (Q-AM-18) | No `MoveNode` / `ReParentNode` endpoint visible | MISSING |
| GAP-AM-08 | Account Information edit (basic + official) | latest-prd.md:33-40 | Commerce `GET /api/Information?NodeId=` + `PUT /api/Information` (`UpdateMainNodeInfoRequest`) - **no class-level `[Authorize]` observed**; verify intent | COVERED (with auth concern flagged in BACKEND_SERVICE_MAP) |
| GAP-AM-09 | Account Settings (Password Security, Allowed IPs, Account Limits) | latest-prd.md:42-45 | Commerce `GET /api/Setting?ownerId=` + `PUT /api/Setting` (`UpdateSettingsRequest`) | COVERED |
| GAP-AM-10 | Allowed IPs enforced via HTTP header at the Gateway | latest-prd.md:44 (BR-AM-10) | Commerce east-west `GET /api/Security/ip-allowlists` returning `Dictionary<tenantId, IpAllowlistEntryDto>`; Core Gateway consumes at startup + has Kafka topic for invalidation | COVERED |
| GAP-AM-11 | Account Limits: Max Normal User Limit, Max System User Limit, Max Node Levels, Balance Transfer Limit (%) | latest-prd.md:45 (BR-AM-11) | `CreateAccountRequest.Settings` carries `MaxNormalUserLimit, MaxSystemUserLimit, MaxNodeLevel, BalanceTransferLimit`; runtime enforcement at user-create time = Identity (via `ListNodeUsersRequest`); runtime enforcement at transfer time = Charging | PARTIAL (account-create stores the limits; enforcement is split across services and not fully verified) |
| GAP-AM-12 | Wallet topology configuration (Balance Type x Wallet Type) - Falcon only | latest-prd.md:67-79 (BR-AM-25, BR-AM-26) | Commerce `POST /api/Setting/wallets` (`ConfigureWalletSettingsRequest`) with class-level `[Authorize(Policy = "FalconOnly")]`; `GET /api/Setting/wallets/{ownerId}` (`GetWalletSettingsResponse`) | COVERED |
| GAP-AM-13 | Wallet read (account-level + per-owner) | understanding.md:24, 45 | Charging `POST /api/Wallet/get-account-wallets` (`GetAccountWalletsRequest -> GetAccountWalletsResponse` with `MasterWallet, CommChannelWallets[], OwnerWallets[]`); `GET /api/Wallet/contract-balance-summaries?accountId=` | COVERED |
| GAP-AM-14 | Balance Transfer across wallets with role-x-topology matrix | latest-prd.md:86-91 (BR-AM-30..34) | Charging `POST /api/Wallet/transfer` (`TransferBalanceRequest` with `Source { WalletId, ChannelId }`, `Destination { WalletId, ChannelId }`, `Amount, Currency, Description`) | COVERED (envelope); role-x-topology matrix enforcement not verifiable from DTO alone |
| GAP-AM-15 | Balance Transfer Limit (%) enforcement (non-Master source) | latest-prd.md:91 (BR-AM-34) | Not visible in `TransferBalanceRequest` (no percent / cap field); enforcement must be server-side from account settings. Not verifiable from DTO. | UNVERIFIABLE (likely server-side; deep dive needed) |
| GAP-AM-16 | CommChannel & Application list per account | latest-prd.md:47-51 | Commerce `GET /api/Node/{id}/comm-channels`, `GET /api/Node/{id}/applications`, `GET /api/Node/{NodeId}/comm-channels/visible`, `GET /api/Node/{NodeId}/comm-channels/visible/details` | COVERED |
| GAP-AM-17 | Visibility toggle (Hide/Show) - Falcon only | latest-prd.md:48 (BR-AM-14) | Commerce `PUT /api/Node/comm-channel/visibility` + `PUT /api/Node/application/visibility` with `[Authorize(Policy = "FalconOnly")]`; provisioning service also has mirror endpoints `PUT /api/Services/account/comm-channel/visibility` + `PUT /api/Services/account/application/visibility` (FalconOnly) | COVERED |
| GAP-AM-18 | Pricing Type + Price Value config - Falcon only | latest-prd.md:48 (BR-AM-15-17) | Commerce `PUT /api/Node/comm-channel/price-type`, `PUT /api/Node/comm-channel/price-value`, `PUT /api/Node/application/price-type`, `PUT /api/Node/application/price-value` (all FalconOnly); plus DELETE variants to cancel pending price changes (FalconOnly) | COVERED |
| GAP-AM-19 | CommChannel/App lifecycle: Activate via Master Wallet debit | latest-prd.md:62 (BR-AM-22, W4) | Commerce `POST /api/Node/comm-channel/do-payment` (`DoPaymentCommunicationChannelRequest`) + `POST /api/Node/application/do-payment` (`DoPaymentApplicationRequest`); both map to `CreateFalconServiceOrderCommand`. Order status read via `GET /api/Node/order/{orderId}/status` | COVERED |
| GAP-AM-20 | CommChannel/App Enable / Disable (manual) | latest-prd.md:63 (BR-AM-24, W6) | Commerce `POST /api/Node/comm-channel/enable` + `POST /api/Node/comm-channel/disable` + `POST /api/Node/application/enable` + `POST /api/Node/application/disable` | COVERED |
| GAP-AM-21 | Account Owner user created at Step 5 | latest-prd.md:53-54 (BR-AM-19) | Identity `POST /api/user` (`CreateUserRequest`); orchestrated either by frontend post-account-create or as part of `CreateAccountRequest.AccountOwner` in Commerce | COVERED |
| GAP-AM-22 | Grace period 7 days (Monthly) / 30 days (Yearly / OneTime) | latest-prd.md:61 (BR-AM-21) | No visible endpoint exposing grace-period config; presumably hardcoded in renewal job (Hangfire or Kafka consumer). DTOs do not surface a `GracePeriodDays` field. | UNVERIFIABLE (renewal worker code not yet mapped) |
| GAP-AM-23 | Renewal job (background) on Renew Date | latest-prd.md:56-63; W5 | No HTTP surface; background job presumed in Commerce or Charging. | UNVERIFIABLE |
| GAP-AM-24 | Contract -> Master Wallet funding on contract Activate (cross-module) | latest-prd.md:95 (BR-AM-35, W8) | Commerce produces 11 Kafka topics; Charging consumes 9. Funding likely happens via a Commerce-produced `ContractActivated` event consumed by Charging. Not directly verifiable from REST DTOs. | UNVERIFIABLE (Kafka event level) |
| GAP-AM-25 | Contract Expire -> Wallet records excluded from lump-sum (cross-module) | latest-prd.md:98 (BR-AM-38, W9) | Same as GAP-AM-24 — event-level wiring; needs Kafka topic inspection. | UNVERIFIABLE |
| GAP-AM-26 | Permissions per role per action (Operation, Product, System Admin matrix) | Permission sheet `Permission list - Jawad` (02-user-management/attachments.md) | Access (PES) service `falcon-core-access-svc` (`pes/authorize/resources` etc.) consumed by frontend `access-control.client.ts`. Whether the policy rules in PES line up with the sheet is unverified. | PARTIAL (engine exists; sheet-to-rules consistency open - Q-AM-16) |
| GAP-AM-27 | Wallet config edit (change Balance Type / Wallet Type mid-life) | Q-AM-01 / BR-AM-41 | `POST /api/Setting/wallets` exists; whether it allows changes after first-set is not documented. PRD silent on migration. | UNVERIFIABLE |
| GAP-AM-28 | Account Limits edit while live users exceed new limit | Q-AM-03 / BR-AM-39 | `PUT /api/Setting` (`UpdateSettingsRequest`) accepts new limits; enforcement at run time is server-side. PRD silent. | UNVERIFIABLE |
| GAP-AM-29 | Account archive / soft-delete state | Q-AM-08 / BR-AM-42 hint | No `DELETE /api/Node/{id}` endpoint observed; no `archive` field surfaced on `GetMainNodeInfoResponse`. PRD also silent. | MISSING |
| GAP-AM-30 | `System User` definition + max-limit enforcement | Q-AM-12 | `CreateAccountRequest.Settings.MaxSystemUserLimit` exists; what counts as a System User is silent in PRD and in code naming. Identity uses `eUserRoles` (sys-admin, operation, product) which counts on the Falcon side, not the client side. | UNVERIFIABLE |
| GAP-AM-31 | Multi-currency support across Master/Comm/User wallets | understanding.md:119 | Charging DTOs carry `eCurrency Currency`; PRD uses SAR exclusively (latest-prd.md:48, 65). System supports the field; product policy is SAR-only. | COVERED (technically; policy aside) |
| GAP-AM-32 | Authority Letter Type enum (Government / Commercial / Charity) with linked Sector + ID | latest-prd.md:40 (BR-AM-08) | Commerce `eAuthorityLetterType` enum visible in Domain Constants; DTO accepts the type + sector + ID. | COVERED |
| GAP-AM-33 | Tax / VAT handling on Price Values | understanding.md:120 | DTOs carry `vatRegistrationNumber` for the account; no `VatPercent` / `VatAmount` on Price Value. PRD silent on tax application. | UNVERIFIABLE / MISSING |

## Summary

- **Total rows:** 33.
- **COVERED:** 18.
- **PARTIAL:** 3 (GAP-AM-03, 11, 26).
- **MISSING:** 3 (GAP-AM-07 move-node, GAP-AM-29 archive, partial GAP-AM-33 VAT).
- **UNVERIFIABLE:** 9 (mostly background-job / Kafka-event level, plus tax + Account limit edit semantics).

## Quick-win flags

- **GAP-AM-03 (PARTIAL)** is easy to lift: add `[RegularExpression(@"^[A-Za-z].*$")]` or equivalent to `CreateAccountRequest.Info.AccountName`. Server-side rejection beats UI-only.
- **GAP-AM-07 (MISSING)** is a known backlog item (root-documents); likely Phase 2.
- **GAP-AM-15 + 22 + 23 + 24 + 25** all need a Kafka / background-job inspection pass to be fully verified — flagged for next-pass deep dive.
