---
name: session-backup-chg-01-seed-data-live-funding-matrix-verification
description: Built reusable due-payment seed data on test-tenant-001/a11001 and verified the full funding decision tree (incl. CHG-01) live through the gateway API. All 4 cases PASS.
metadata: 
  node_type: memory
  type: project
  agent: ammar-core-charging
  date: 2026-06-01
  status: completed
  originSessionId: a689d5f6-fe90-4834-a7d0-fae75df61810
---

## What Was Done
Night-shift SEED + LIVE MATRIX for Falcon Charging due-payment (CHG-01). Charging restarted 20:50:45 UTC with the CHG-01 fix recompiled (build log = warnings only, no errors). Produced reusable, re-runnable seed data and a live runner, then verified ALL due-payment funding cases end-to-end through the LIVE gateway API. ALL 4 CASES PASS. NO source changes, NO commits.

## CHG-01 = TWO layers (both in falcon-core-charging-svc)
1. `src/Falcon.Charging.Domain/WalletBalanceManagement/Policies/ResolveWalletFundingDecisionPolicy.cs` — when master+comm covers the amount but `!hasCommPriorities`, return `CommChannelPriorityOrderRequired` (cases 2 & 3) instead of failing. This is the EMPTY-priorities path (CASE C).
2. `src/Falcon.Charging.Application/ChargingEngine/Handlers/DirectDebitHandler.cs` `BuildDebitPlans()` L434-450 — THE actual CHG-01 fix: even WITH a priority list, if the prioritized channels cannot close the gap BUT un-prioritized comm wallets still hold enough eligible balance (`totalEligibleCommBalance - committedByPlans >= remaining`), surface `CommChannelPriorityOrderRequired` (recoverable re-prompt) instead of the misleading `InsufficientFunds`. This is the WRONG-priorities path (CASE D).

## End-to-end flow (verified)
do-payment `POST {gw:7038}/commerce/node/comm-channel/do-payment {accountId, commChannelId, commChannelPriorityIds}` -> commerce `CreateFalconServiceOrderHandler` creates a Pending Order + publishes `commerce.order-created.v1` (FalconServiceOrderCreatedEvent: PurchaseAmount + CommChannelPriorityIds, ServiceId=commChannelId) -> charging `FalconServiceOrderCreatedEventConsumer` -> `DeductFalconServiceCostHandler` (passes AllowCommChannelWalletFallback=true + priorities) -> `DirectDebitHandler` (CHG-01 funding decision) -> publishes `charging.order-payment-processed.v1` -> commerce `CompleteFalconServicePaymentProcess` writes Order.Status + FailureReason (updatedBy='Charging-System'), activates service on Paid, publishes OrderFinalized (resolves Node.TenantId) -> `falcon-comm-realtime-1` logs `"Pushed OrderFinalized for OrderId X (Status=N, FailureReason=M)"` + SignalR push.
status `GET {gw:7038}/commerce/Node/order/{orderId}/status` -> `{Status(eProcessState), FailureReason(eOrderFailureReason?), WalletType(eWalletBaseType?)}`. AutoMapper: Paid->Completed(3), Failed->Failed(4), Pending->Pending(1); FailureReason passthrough; WalletType from Settings.WalletSettings.

## LIVE MATRIX RESULTS (account 000000000000000000a11001, strategy=MultipleWallets, Voice price 10000)
| Case | seeded | priorities | expected | ACTUAL (eProcessState/failureReason/walletType) | order | PASS |
|------|--------|-----------|----------|-------------------------------------------------|-------|------|
| B InsufficientFunds | master=0, SMS=1500 (1500<10000) | [] | Failed/InsufficientFunds | 4 Failed / 1 InsufficientFunds / 2 Multiple | 6a1df353013acbaa3a90964f | PASS |
| C empty-priorities | master=0, SMS=6000+WhatsApp=6000 (12000) | [] | Failed/PriorityRequired | 4 Failed / 2 CommChannelPriorityOrderRequired / 2 | 6a1df380013acbaa3a909650 | PASS |
| D CHG-01 wrong-priority | master=0, WhatsApp=12000, SMS=0 | [SMS] (omits funded WhatsApp) | Failed/PriorityRequired NOT InsufficientFunds | 4 Failed / 2 CommChannelPriorityOrderRequired / 2 | 6a1df394013acbaa3a909656 | PASS |
| A success | master=20000, comm=0 | [] | Completed/Paid | 3 Completed / null / 2 Multiple | 6a1df3a8013acbaa3a909657 | PASS |

Success-path realtime: `Pushed OrderFinalized for OrderId 6a1df3a8013acbaa3a909657 (Status=2, FailureReason=null)` @21:03:37 (confirms success signal fires + commerce populated Context.TenantId). Master debited 20000->10000 (consumed 12000), Voice activated (status 3->2). Charging logs clean (no errors); published order-payment-processed (offset 134=case A) + ocs-wallet-events + outbox Published:1/Failed:0.

## Reusable artifacts
- SEED: `C:/Falcon/plans/seed-due-payment-cases.js` (mongosh, idempotent, CASE=RESET|A|B|C|D|SHOW). Mutates ONLY availableAmount + refreshes eligibility window/status on the ContractFunded buckets of a11001 OCS wallets. Run: `docker cp` into falcon-mongo-1 then `mongosh ... --eval "var CASE='C'; load('/tmp/seed-due-payment-cases.js')"` (the `--file /tmp/...` form path-mangles on this Windows host; use load() or docker cp).
- LIVE RUNNER: `C:/Falcon/plans/run-due-payment-matrix.ps1` (dot-source -> `Invoke-DoPaymentCase -Case C`). Logs in accowner, POSTs do-payment with case-appropriate priorities, polls status to terminal, prints state/reason/walletType. C vs D differ ONLY by the priority list sent here; wallet state set by the seed script.

## Key Facts / Traps (for next agent)
- Login accowner: `POST http://localhost:7777/api/auth/login {username:"accowner", password:"Admin@1234"}`. OTP is OFF in this dev stack (stage=4 Authenticated, token returned directly in `result.tokens.accessToken`). If OTP were on, response carries `result.devOtpCode` (Development only) -> POST /api/auth/verify-otp {sessionId, code}. JWT good ~30 min; tenant-id=test-tenant-001, node-id=a11001, client_id 373183195971125258.
- Charging DB = `FalconChargingDB` (single DB, NOT per-tenant in this stack). Mongo: falcon-mongo-1 (root/example, authDb admin). Charging API container falcon-charging-1 on :7224 directly, but Client path is behind core gateway :7038 (:7224 is NOT the documented entry).
- a11001 OCS wallet shape: ACCOUNT master `ACCOUNT:{acct}:ALL:SAR` + per-channel `ACCOUNT:{acct}:{COMMCHANNELID-UPPER}:SAR`. Channel == commChannelId (uppercased). ContractFunded bucket eligible iff: bucketType=1 ContractFunded + status=1 Active + effectiveFrom<=now<=expiresAt (Saudi day-boundary normalized) + availableAmount>0 + contractId set. Funding sums ALL account comm wallets (ownerType=1 Account, channel!=ALL); NODE wallets (ownerType=3) are excluded.
- Voice (695a304f901bb7d4a830d0de) is the ONLY DoPayment-able channel on a11001 (availableActions includes 1=DoPayment). Others only have 2=Disable or 3=Enable.
- ORDER OF CASES MATTERS: CASE A (success) MUST run LAST. `ValidateActivationEligibility` (commerce FalconServiceConfigurationBase.Operations.cs) throws ServiceAlreadyActive once Voice goes Active. After this session Voice IS Active (status=2) -> to re-run the success case you must first re-expire Voice in commerce (set commChannels[Voice].status=3 + ensure RenewDate in the past) OR pick a different Expired/Inactive channel.
- Enums: eOrderStatus Pending=1/Paid=2/Failed=3 (Mongo Order.status); eProcessState Pending=1/Running=2/Completed=3/Failed=4 (status endpoint); eOrderFailureReason None=0/InsufficientFunds=1/CommChannelPriorityOrderRequired=2/WalletNotConfigForTheNode=3; eWalletBaseType SingleWallet=1/MultipleWallets=2; eFalconServiceStatus None=0/InActive=1/Active=2/Expired=3/Disabled=4.
- After run: wallets RESET to master=0/comm=0 (clean baseline; original live was master=0/SMS=1500). NO source changes, NO commits.

## Files Changed
- NONE in source. New plan/seed files only: `C:/Falcon/plans/seed-due-payment-cases.js`, `C:/Falcon/plans/run-due-payment-matrix.ps1`.

## Context for Next Agent
CHG-01 is LIVE-VERIFIED (CASE D returns CommChannelPriorityOrderRequired not InsufficientFunds). The whole due-payment funding matrix passes through the real gateway. The FE half of the parent night-shift task (DoPaymentPriorityPopup re-prompt on reason=2, InsufficientFunds popup on reason=1, SignalR /hubs/order-status) was NOT touched here — this slice was backend seed + live verification only. The seed+runner scripts are the reusable harness for any future re-verification.
