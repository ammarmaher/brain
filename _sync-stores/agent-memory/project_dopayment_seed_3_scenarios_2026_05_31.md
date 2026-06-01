---
name: project_dopayment_seed_3_scenarios_2026_05_31
description: How to seed + run the 3 Do-Payment scenarios (success / insufficient / multi-wallet-priority) for accowner on test-tenant-001; the charging funding-decision rules; the seed script location.
metadata: 
  node_type: memory
  type: project
  originSessionId: 82d5a43c-779d-4136-841b-34bf6102bd56
---

Seeded the three Do-Payment scenarios on the LOCAL stack for the **accowner** Client login and RUNTIME-VERIFIED them (backend E2E via API + host-shell UI via Chrome). NO COMMITS. Data-only seed on the local Mongo.

## The flow (host-shell, NOT mgmt/admin)
- Real Do-Payment + wallet-priority flow lives ONLY in host-shell `DoPaymentPriorityPopupComponent` (`apps/host-shell/src/app/shared-components/do-payment-priority-popup`) used by host-shell `service-pricing`. mgmt-console comm-mkt-view INTENTIONALLY omits it. Do-Payment is NOT PES-gated; the comm-channels page is gated by `acc.service.view` (acc-owner ALLOW).
- FE: `POST {coreGateway}/commerce/Node/comm-channel/do-payment {accountId, commChannelId, commChannelPriorityIds:[]}` -> Pending order + Kafka `commerce.order-created.v1` -> charging deducts -> `charging.order-payment-processed.v1` -> commerce marks Paid/Failed -> FE polls `GET /commerce/Node/order/{orderId}/status`.

## Charging funding decision — `[CODE] ResolveWalletFundingDecisionPolicy.cs:8-34`
- `master >= price` -> Master -> SUCCESS (Completed).
- `master < price` BUT `master+commWallets >= price` (or comm alone >= price), first submit has NO priority list -> Fail + `CommChannelPriorityOrderRequired` -> FE opens drag-drop reorder dialog -> resubmit WITH priorities -> Both/CommChannel -> Completed.
- `master+comm < price` -> Fail + `InsufficientFunds` (centred popup).
- **CRITICAL: clean `InsufficientFunds` REQUIRES MultipleWallets strategy.** SingleWallet shortfall throws unmapped InsufficientBalance -> `DeductFalconServiceCostHandler.cs:81-86` RETHROWS -> order stuck Pending -> FE HANGS (no popup). So Honda (SingleWallet 1 SAR) is NOT a clean insufficient demo; the canonical c1000x fixtures also lack client logins. => chose accowner/test-tenant-001 made MultipleWallets.
- DoPayment shown iff `[CODE] AllowedFalconServiceActionsGenerator`: visibility==true AND status in {InActive(1),Expired(3)} AND pricingType+priceValue both set. Order blocked if `RenewDate` set AND today<=RenewDate (`FalconServiceConfigurationBase.Operations.cs:152` RenewalNotDueYet) — so payable channel needs RenewDate null or past.

## The seed (idempotent + re-runnable = reseed)
- Script: `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-dopayment-test-tenant-001.js` (canonical stack tree is `C:\Falcon\Falcon\Falcon\`, NOT the sibling `C:\Falcon\Falcon\falcon-essentials`).
- Run: `docker cp <script> falcon-mongo-1:/tmp/ ; docker exec -i falcon-mongo-1 mongosh --quiet -u root -p example --authenticationDatabase admin /tmp/seed-dopayment-test-tenant-001.js`
- What it does: (1) repairs the null embedded comm-channel ids on node a11001 (seed bug — they were ALL null, unpayable) by assigning real catalog ids 1:1; normalizes the 3 targets to eligible states; (2) sets commerce `Settingss.walletSettings.walletType=2` (needed or getOrderStatus throws WalletSettingsNotFound); (3) upserts charging `wallet_strategy_read_model` walletStructure=2 (MultipleWallets); (4) deletes ALL account-owner wallets for a11001 then inserts master 3000 + WhatsApp(d0e2) 2000 + AI(d0e3) 2000 (clone c10003 doc to preserve BSON types); (5) clears the account's test orders. Re-running RESETS balances + channel states (channel activation auto-creates zero-balance per-channel ACCOUNT wallets after a SUCCESS -> step 4 deletes ALL account wallets so they don't stray into commTotal).

## USER + NODE + scenario map (the deliverable)
- **User: `accowner` / `Admin@1234`** (acc-owner; tenant test-tenant-001). The only pre-seeded Client login on a tenant we can fully configure. acc-admin/acc-user are DENIED `acc.service.view`. sysadmin/sys-* use admin/system consoles which omit Do-Payment.
- **Node: `000000000000000000a11001`** ("Test Tenant 001" root; comm-channels live only on the main node). UI: host-shell -> Org Hierarchy -> "Test Tenant 001" -> "CommChannels & Services".
- Account wallets (the "wallets you have" to prioritize) — MULTI-WALLET design: master ALL=2,000 + WhatsApp(d0e2)=2,000 + AI(d0e3)=2,000 + SMS(d110)=2,000 (total 8,000). 3 channel wallets so the drag-drop genuinely prioritizes MULTIPLE wallets.
- Pay these channels (by catalog name; real id = `_id`):
  - **Telegram Bot** (`_id` ...d114, InActive, 1,500) -> SUCCESS (master 2,000 alone covers).
  - **Apple Business Chat** (`_id` ...d115, InActive, 5,000) -> PRIORITIZE-WALLETS. master 2,000 < 5,000 AND a single channel wallet (2,000) is NOT enough -> the reorder dialog requires prioritising MULTIPLE wallets (master + >=2 of WhatsApp/AI/SMS; one is spared by your order). Resubmit -> Completed. RUNTIME-PROVEN drain: master 0 + WhatsApp 0 + AI 0 + SMS 1,500.
  - **Voice** (`_id` ...d0de, Expired, 10,000) -> INSUFFICIENT (master+all wallets 8,000 < 10,000).
- **CRITICAL LEARNING — the embedded comm-channel id is stored under `_id`, NOT `id`** (commerce C# maps its `Id` property -> Mongo `_id`). A lowercase `id` field is IGNORED by commerce and DROPPED on the next node save (channel activation). So: (a) identify/seed channels by `_id`; (b) do NOT panic if `id` reads null after a payment — `_id` is intact and do-payment keeps working; (c) only the channel you SUCCESSFULLY pay is consumed (goes Active); the other scenarios stay payable in the same session. The original "null id" recon was a field-name misread; the channels were never broken.

## Verification (RUNTIME)
- Backend E2E (API, accowner /api/auth/login token via gateway :7038): Voice -> Failed/InsufficientFunds(1); Apple Business Chat first submit -> Failed/CommChannelPriorityOrderRequired(2); Telegram Bot -> Completed(3); Apple Business Chat resubmit with priorities -> Completed(3). Kafka round-trip ~1.5s (no P0-1 drop on this stack).
- UI (ammar-qa-web, real OIDC): all 3 rows show "Do Payment" in the kebab; **BUG-DOPAYMENT does NOT reproduce on host-shell** (it was a mgmt-console-only / FE-hide concern). Insufficient -> "Insufficient Balance" OK modal; Apple Business Chat -> drag-reorder "Insufficient Balance Detected" dialog. Both non-consuming paths verified; state left pristine.
- Re-verify script: `...\seed\_verify-dopayment.ps1`.

## Gotchas
- SUCCESS + the priority RESOLVE consume balance + activate the channel -> reseed (re-run the script) to repeat. INSUFFICIENT + cancelling the priority dialog do NOT consume.
- Stack env: FE -> LOCAL (host-shell :4200, remote :4301); login WORKS (2026-05-30 blocker resolved); TestingCharging+RealTimeCharging ON.
- Priority reorder dialog opens after a poll delay (order-status poll-gated) — not instant; benign AbortError console noise on navigate-away mid-poll.

Related: [[reference_login_connectivity_qa_cert_and_docker_ai_2026_05_30]], BACKEND-BUGS-REGISTRY BUG-DOPAYMENT (now clarified: host-shell shows Do-Payment fine; the registry note was the mgmt-console path).
