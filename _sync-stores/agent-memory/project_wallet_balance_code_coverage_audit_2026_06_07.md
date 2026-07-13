---
name: project-wallet-balance-code-coverage-audit-2026-06-07
description: "Static code-coverage audit (NOT E2E) of Wallet & Balance Management across both FE apps + charging/commerce backend vs PRD acceptance behavior, per 4 wallet modes (NS/NM/US/UM). ~96% PRD coverage; 927/927 unit tests GREEN; one real gap (BR-AM-34 % limit) + one product-decision partial (mgmt currency reload) + latent FE channel watch-items."
metadata: 
  node_type: memory
  type: project
  originSessionId: b1e85432-b3b0-4942-9a42-52c79c77e3eb
---

**Audit (claude, 2026-06-07, 4 parallel READ-ONLY agents, NO edits/commits):** verified each PRD wallet behavior against the actual function bodies in both apps + backend, per mode. Result = ~96% PRD coverage; everything built is correct; 927/927 unit tests GREEN.

**Branches (NOT one branch — multi-repo):** FE `polishing-v0.4`; charging `feature/contract-quota-consumption` (HEAD 88abe07); commerce `feature/contract-quota-consumed-on-detail` (⚠️ HEAD `e3b7ce7` = the commit [[project_contract_consumed_offered_C_and_ratetables]] flags as the ABANDONED B-approach; the wallet-strategy plumbing audited is stable but NOT origin/main parity — confirm before trusting commerce side).

**Per-surface verdicts:** backend 16/16=100% · admin FE 14/14=100% (A-R15 %limit N/A) · mgmt FE 13.5/14=96.4% (one 🟡). All 4 modes correct — NO mode-specific gaps anywhere.

**Tests RUN green (hard evidence):** admin vitest `wallet-balance-management/__tests__` 418/418 (18 specs); mgmt vitest 415/415 (16 specs); charging xUnit `--filter ~Ocs` 94/94 (14 classes, net10). **= 927/927, 0 fail, 0 skip.** Strong evidence the domain logic works "from a coding perspective." BUT integration tier is UNIT-UNTESTED (HTTP endpoints/auth/routing, real Mongo `TryReplaceAsync` CAS, Kafka consumers + AES-GCM field-encryption, FE↔BE transfer-matrix contract alignment) — needs integration/E2E (out of scope).

**THE 2 GAPS:**
1. ❌ **BR-AM-34 Balance-Transfer-Limit %** — stored in commerce `[CODE] QuotaConfiguration.cs:24-26 BalanceTransferLimitPercentage` but NEVER read/enforced in charging (`TransferBalanceHandler` / `ResolveOcsTransferWalletsPolicy`) NOR either FE. The one real PRD functional gap (deferred by decision; the % field was also removed from Add-Client Step-2 per bug sheet). Insertion point if wanted = `TransferBalanceHandler.Validate`/post-allocation (needs source-owner master balance + the configured %).
2. 🟡 **mgmt currency (SAR/Points) toggle doesn't re-fetch balances** — `[CODE] wbm-client-view.component.ts:201-203 onCurrencySelect` sets a view-LOCAL signal only; the orchestrator's `refetch(override.currency)` machine (`component.ts:408-428`) is never wired to it (no `currencyChange` output). Riyal glyph flips visually but balances do NOT reload in the new currency. Product decision: Points display-only (→dead-code) vs should-reload (→gap). **Admin DOES re-query on currency** (no gap admin side).

**LATENT FE watch-items (admin; don't break audited reqs with the canonical 5-channel backend):** (a) `[CODE] map-wallet-data.ts:90-101 resolveChannelId` hard-caps the channel union at 5 slots (whatsapp/voice/aichat/sms/email) → a 6th platform channel silently won't render; (b) `[CODE] wallet.service.ts:259 activeChannels` static default `['whatsapp','voice','aichat']` is never reconciled with the live mapped `view.channels` → Multiple-mode may show/hide wrong channel columns until "Show All"; (c) admin Description `*` shown but drawer `canSave` doesn't gate on it — enforced one layer up at `onConfirmTransfer` (toast+abort) + backend, so correct-but-lower-fidelity UX.

**Per-mode (all ✅ across BE + both FE):** strategy derives owner type NodeBased→Node / UserBased→User (anti-spoof, never trusted from request) + Single→`ACCOUNT/NODE/USER:{id}:ALL` wallet / Multiple→per-channel wallet `[CODE] ResolveOcsChargeWalletsPolicy.cs:40-58`; nearest-expiry greedy bucket alloc `[CODE] AllocateOcsMonetaryBucketsPolicy.cs:39-68`; transfer matrix single ALL↔ALL owner pairs (Account→Account excluded) / multiple Master↔AccountChannel Falcon-only + channel-match `[CODE] ResolveOcsTransferWalletsPolicy.cs:47-106`; multi-wallet funding decision Master/Both/CommChannel/Fail + priority `[CODE] ResolveWalletFundingDecisionPolicy.cs:8-35`; provisioning materializes per-mode wallets `[CODE] ResolveOwnerWalletProvisioningPolicy.cs`; disabled/wallet-less owner honored both FE. FE table: NodeBased→org/service rows, UserBased→user rows (Rule A `hideValue`); Single→1 wallet col, Multiple→N channel cols.

Related [[reference_wallet_balance_knowledge_map_2026_06_07]] · [[reference_wallet_main_vs_now_transfer_gap_plan_2026_06_06]] · [[project_wallet_transfer_restore_24client_testbed_2026_06_07]].
