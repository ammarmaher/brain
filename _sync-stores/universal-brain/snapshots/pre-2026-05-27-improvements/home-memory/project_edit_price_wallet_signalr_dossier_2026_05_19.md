---
name: Edit Price + Due Payment + Wallet + SignalR dossier
description: Stage-1 mastery dossier for the edit-price/due-payment/wallet/insufficient-funds area + a SignalR enhancement plan to replace order-status polling.
type: project
originSessionId: b587fc86-734c-4f63-b47d-a1ec14184cff
---
🟢 STAGE-1 KNOWLEDGE BUILD 2026-05-19. Investigation only — no code changed. Full dossier at `C:\Falcon\reports\edit-price-due-payment-wallet-signalr-dossier.md`.

**Why:** User is about to make many changes to the edit-price area and wants to add SignalR (replace order-status polling). Needed deep A→Z mastery first.

**How to apply:** Read the dossier before any edit-price / due-payment / wallet / SignalR work. Built from 4 code-grounded agents (Commerce@main, Charging@main, FE@main, FE@polishing-v0.4) + Atlas Vol 45/53 + Pricing BRD.

**Key truths:**
- Backend repos (Commerce, Charging) on `main` = source of truth. FE working tree on `polishing-v0.4`; `main` FE has older inline (duplicated) payment/polling; v0.4 extracted it to host-shell `do-payment-priority-popup` orchestrator. `SimplePollService` byte-identical both branches.
- Edit price = Falcon-only. Live (visible+Active/Expired) service → change stored as pending `NewPricingInfo`, committed at `Renew()`; else immediate. Price embedded in `Node` doc's Applications[]/CommChannels[].
- Due payment = Order saga: POST do-payment → Commerce `Order(Pending)` + `commerce.order-created.v1` → Charging `DirectDebitHandler` debits wallet → `charging.order-payment-processed.v1` → Commerce `CompleteFalconServicePaymentProcess` flips Order Paid/Failed.
- FE polls `GET order/{id}/status` every 2s (main: 30min / v0.4: 60s). Response = enum-only `{Status:eProcessState, FailureReason:eOrderFailureReason?, WalletType:eWalletBaseType}` — NO message field.
- Wallet: `OcsWallet` aggregate keyed `{OwnerType}:{OwnerId}:{Channel}:{Currency}`; Master = `ACCOUNT:{id}:ALL:SAR`. Funding: Master cut first, then CommChannel wallets in request priority order, nearest-expiry FIFO buckets. NO partial funding — aborts whole op.
- `WalletNotConfigForTheNode=3` in Commerce enum but NOT Charging — FE realistically gets only InsufficientFunds(1)/CommChannelPriorityOrderRequired(2).

**SignalR plan (recommended):** Commerce emits new `commerce.order-finalized.v1` after `CompleteFalconServicePaymentProcess`; SignalR hub lives in the Gateway (System+Core); FE joins group `order:{orderId}`, gets catch-up snapshot on join, keeps ONE reconciliation GET as fallback. `handleTerminal` is transport-agnostic — reused. MUST FIX FIRST: no idempotency guard on Commerce's `FalconServiceOrderPaymentProcessedEventConsumer` (duplicate delivery → infinite re-consume).

**Open decisions for Stage-2:** target branch (main vs v0.4), hub host, new event vs reuse, connection lifecycle, whether to also push wallet-balance updates.

**Stage-2 SEED PLAN (2026-05-19):** Full DB seed plan at `C:\Falcon\reports\edit-price-payment-seed-plan.md`. 10 do-payment + 5 edit-price test cases. Key findings: NO wallet seeder in Charging (must direct-insert `OcsWallet` into `FalconChargingDB.wallets`); Commerce nodes have empty service arrays + no `walletSettings` + no contracts; edit-price = Falcon users only, do-payment = `acc-owner` only.

**FINAL CONSOLIDATION (2026-05-19):**
- Business locked 100% (BRD-grounded): `C:\Falcon\reports\edit-price-payment-BUSINESS-SPEC.md`.
- Final consolidated result (business + revamp plan + 35 test cases): `C:\Falcon\reports\edit-price-payment-REVAMP-final.md`.
- **Runtime-tested via API:** backend saga WORKS — Mitsubishi do-payment → Completed (wallet 100000→99500), Honda → InsufficientFunds; edit price-value/type PUT → 200; bad effective date → 422 `InvalidEffectiveDateForPeriodicPricingChange`.
- **Phase A FE fix is INCOMPLETE** — fixed `org-hierarchy-page` apps-tab but the parallel `marketplace-applications/apps-services-table` copy still POSTs `comm-channel/do-payment` (runtime-confirmed by user). Root cause = FE duplication: apps/services price+payment logic copy-pasted across org-hierarchy-page / marketplace-applications / comm-channels-services. Phase A should NOT ship as-is; fold into the revamp.
- **REVAMP plan:** R0 escalations → R1 consolidate FE into one shared owned feature (kills duplication) → R2 bugs (B1 idempotency, B3 do-payment authz, G3 toasts) → R3 SignalR (gateway hub + `commerce.order-finalized.v1`) → R4 UI/UX → R5 verify.
- **Escalate:** J1 Disabled edit-price PRD↔code conflict; J5 VAT entirely unspecified; Q-CC-02 same-expiry tie-break.
- Browser MCP (Claude-in-Chrome) never connected this session — FE runtime verification still pending a working browser channel.
