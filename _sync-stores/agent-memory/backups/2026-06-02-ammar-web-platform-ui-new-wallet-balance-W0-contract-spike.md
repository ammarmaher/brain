---
name: Session Backup - new-wallet-balance W0 contract spike
description: STATIC contract capture + channel crosswalk decision + fixture for new-wallet-balance backend integration
type: project
agent: ammar-web-platform-ui
date: 2026-06-02
status: completed
---

## What Was Done
READ-ONLY W0 spike (no product code). Captured the REAL channel set + DTO contract STATICALLY from backend code (no live call) and DECIDED the crosswalk.

## Crosswalk Decision: A2 (data-driven, keyed by real channelId)
- Real channels = Commerce SeedData.GetCommunicationChannels(): ONLY 3 -> WhatsApp(695a304f901bb7d4a830d0e2) / Voice(695a304f901bb7d4a830d0de) / AI(695a304f901bb7d4a830d0e3). NO sms, NO email.
- IChannel.id = CommunicationChannel.Id = Mongo ObjectId (opaque 24-hex). IChannel.name = _translateHelper.GetTranslation(c.Name) -> LOCALIZED (en/ar).
- New UI hardcodes 5 literals whatsapp/voice/aichat/sms/email -> A1 name-map IMPOSSIBLE (count mismatch + localized names + AI != aiChat + opaque ids).
- Shipped wallet-balance-management already does A2: treats channel.id opaque, label=channel.name, column key ch_{c.id}. Copy that.

## Other resolved
- walletType/walletBalanceType: stored (Commerce Settings.WalletSettings), server-driven, re-query on toggle; single->node.balance, multiple->node.channelBalances[].
- disabled: BalanceNode.Disabled = owner has no charging wallet; row carries bare owner id, balance 0, channelBalances[].walletId=null. Non-actionable.
- saveUnused = TRUE: Client view never POSTs commerce/setting/wallets (strategy read-only; canSave just gates a hidden form).
- IWalletChannelBalance.walletId is nullable in practice (gateway emits null) though FE type says string.
- Transfer DTO TransferBalanceRequest == ITransferRequest exactly; response {Success,Message,TransactionId} (no errorCode wire -> use ServiceOperationResult.errorMessages[0]).
- wallet id form OWNERTYPE:ownerId:CHANNEL:SAR (channel uppercased).

## Files
- Created: apps/management-console/src/app/features/new-wallet-balance/__tests__/fixtures/hierarchy.fixture.json (single+multiple x node+user + firstTimeCanSave; real channel ObjectIds + OCS wallet ids).

## Context for Next Agent (W4 builder)
- types.ts WbChannelId literal union + WbAllocation fixed keys MUST become string-keyed (real channelId) for A2 — a MODEL change, NOT a view change. WB_CHANNELS becomes runtime (label from channel.name; icon/tone by best-effort name match w/ generic fallback).
- nx test management-console = Vitest; __tests__ under src/** with *.spec.ts is auto-discovered; Stencil dist externalized -> pure-logic tests only.