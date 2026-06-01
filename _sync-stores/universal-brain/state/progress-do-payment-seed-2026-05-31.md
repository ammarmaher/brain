# Progress — do-payment-seed-3-scenarios-2026-05-31

## Phase 1-2 DONE: brain-first research + cross-service investigation
3 parallel Ammar agents (charging ae0d3f62cbdfb507b, commerce aa88264d216e575b7, essentials a6757a7884c954831) + direct Mongo recon. Full source-prefixed findings in current-task.json + below.

### The Do-Payment flow
- Host-shell DoPaymentPriorityPopupComponent (apps/host-shell/.../shared-components/do-payment-priority-popup). NOT mgmt/admin (those omit it by design).
- FE: POST /commerce/Node/comm-channel/do-payment {accountId, commChannelId, commChannelPriorityIds:[]} -> Pending order + Kafka commerce.order-created.v1 -> charging deducts -> charging.order-payment-processed.v1 -> commerce marks Paid/Failed -> FE polls GET /commerce/Node/order/{orderId}/status.
- Comm-channels page reached via host-shell org-hierarchy -> node -> "CommChannels & Services". Gated by acc.service.view (acc-owner ALLOW; acc-admin/acc-user deny). DoPayment itself NOT PES-gated.

### Outcome decision (charging ResolveWalletFundingDecisionPolicy.cs:8-34)
- master >= price -> SUCCESS (Completed)
- master < price but master+commWallets >= price (or comm alone >= price), first submit NO priority list -> CommChannelPriorityOrderRequired (drag-drop reorder dialog) -> reorder + resubmit -> succeeds
- master+comm < price -> InsufficientFunds (clean centred popup)
- CRITICAL: clean InsufficientFunds REQUIRES MultipleWallets strategy. SingleWallet shortfall throws unmapped -> order stuck Pending -> FE hangs (DirectDebitHandler.cs:242-255 + DeductFalconServiceCostHandler.cs:81-86).
- AllowedFalconServiceActionsGenerator: DoPayment shown iff visibility==true AND status in {InActive(1),Expired(3)} AND pricingType+priceValue both set.

### Environment ground truth
- Stack UP, login WORKS (accowner/sysadmin Admin@1234). FE -> LOCAL. TestingCharging+RealTimeCharging ON.
- Canonical fixtures: Mitsubishi 690000000000000000c10001 (SingleWallet 88,600)=SUCCESS; Honda c10002 (SingleWallet 1)=insufficient-but-HANGS; Mercedes c10003 (MultipleWallets, master 9 + chan 3001/5000/200)=PRIORITY. Channels have REAL ids. NO client logins (only Toyota c10004 = WalletNotConfigured).
- test-tenant-001 (accowner): root node _id=000000000000000000a11001 (ObjectId), tenantId="test-tenant-001". 9 channels incl Expired 7800 / InActive 2600 / InActive 3600 (visible+priced) BUT embedded id=NULL on all (seed bug) -> not payable as-is. NO account wallets, NO strategy. Settingss doc exists (ownerId string a11001) but no walletSettings.

## Phase 3: DECISION — user chose Option B (one login, accowner). DONE.

## Phase 4: SEED + VERIFY — COMPLETE 2026-05-31
- Seed script: C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-dopayment-test-tenant-001.js (idempotent reseed).
- Made test-tenant-001 (node 000000000000000000a11001) MultipleWallets: master 3000 + WhatsApp(d0e2) 2000 + AI(d0e3) 2000; repaired null embedded channel ids; set walletSettings.walletType=2.
- Channel map: Telegram Bot(d114,2600)=SUCCESS, Apple Business Chat(d115,3600)=PRIORITY, Voice(d0de,7800)=INSUFFICIENT.
- Backend E2E (API via gateway :7038, accowner token): all 4 outcomes correct (Failed/1, Failed/2, Completed, Completed-after-reorder). Kafka round-trip ~1.5s.
- UI (ammar-qa-web, OIDC): Do Payment renders on all 3 rows; Insufficient modal + priority reorder dialog confirmed; BUG-DOPAYMENT NOT reproduced on host-shell. State left pristine.
- NO COMMITS. Local Mongo data seed only. current-task.json was reclaimed by a concurrent session (commmkt-toggle task) — left untouched; this file is the record of completion.
- Memory: project_dopayment_seed_3_scenarios_2026_05_31.md + MEMORY.md index updated.
