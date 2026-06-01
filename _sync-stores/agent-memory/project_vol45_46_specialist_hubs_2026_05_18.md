---
name: Vol 45 + Vol 46 + Specialist Hubs (Wallet + Campaigns)
description: Two specialist Atlas volumes + two Obsidian hub pages + code-verified wallet patterns + 5-word channel truth (WA+Voice+SMS yes, FB/IG no)
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 45 + Vol 46 + Specialist Hubs — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (3-wave autopilot continuation).

## What landed

### Long-form Atlas volumes
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md` — 14 sections + code-verification addendum
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md` — 16 sections

### Code mining
- `Brain Outputs/.../WAVE-11-CODE-MINING-WALLET.md` — agent-produced backend evidence

### Obsidian specialist hubs (anchored under AMMAR_BRAIN_HOME)
- `Brain SK/_obsidian/00-Home/WALLET-SPECIALIST-HUB.md`
- `Brain SK/_obsidian/00-Home/CAMPAIGNS-CHANNELS-SPECIALIST-HUB.md`

### Obsidian atomic notes
- `Brain SK/_obsidian/10-Pages/Vol 45 — Wallet Specialist Guide.md`
- `Brain SK/_obsidian/10-Pages/Vol 46 — Campaigns Channels Specialist Guide.md`
- `Brain SK/_obsidian/67-Business-Rules/MULTI-CONTRACT-CROSS-PRICING-DEEP-DIVE.md`

### Cross-refs appended
- `AMMAR_BRAIN_HOME.md` — Specialist Hubs section added
- `ATLAS_MASTER_INDEX.md` — Vol 45/46 entries + specialist hub callouts
- 5 PRD module notes — Vol 45/46 cross-refs

## Key wallet truths (code-verified via Wave 11)

| Concept | Truth | Code |
|---|---|---|
| Wallet storage | Single MongoDB `OcsWallet` aggregate keyed `{OwnerType}:{OwnerId}:{Channel}:{Currency}` with embedded `OcsWalletBucket[]`. No separate per-contract entity. | `wallets` collection |
| Master Wallet | Stored doc `ACCOUNT:{accountId}:ALL:SAR` (NOT just a computed view) | confirmed |
| Nearest-expiry FIFO | `.OrderBy(b => b.ExpiresAt)` loop | `AllocateOcsMonetaryBucketsPolicy.cs:35-46` |
| Atomicity | MongoDB ClientSession + optimistic concurrency (`Version++`) + `WalletVersionConflict` retry | `MongoUnitOfWork.cs` |
| Idempotency | Deterministic `{operation}:{walletId}:{refType}:{refId}` key | `WalletMutationReceipt` |
| CommChannel priority | **Per-request input**, NOT stored | `DoPayment*` request shape |
| Funding decision | Returns `Master \| CommChannel \| Both \| Fail(...)` | `ResolveWalletFundingDecisionPolicy` |
| Addons | Are Quota buckets with `QuotaCategory=SUB_SERVICE` inside the same aggregate | not separate entity |
| Contract expiry | Kafka-event-driven via `ProjectContractLifecycleProcess.ExecuteExpiryAsync` (NOT Hangfire/Quartz) | confirmed |

## 5-word channel truth (Vol 46 §0)

> **WhatsApp + Voice + SMS implemented; Facebook/Instagram are NOT.**

Full channel status: ✅ WA · ✅ Voice (IVR Static+Dynamic+Flow Builder+Voice Record Library) · ✅ SMS · 🟡 Email (Q-CHN-01..04 open) · ❌ FB Messenger · ❌ FB Pages · ❌ IG DM · ❌ IG Posts · ❌ Telegram · ❌ Twitter · ❌ TikTok · ❌ RCS.

## Questions resolved this wave (via code mining)

- ✅ **Q-CC-13** — One priority list, per-request supplied by caller (not stored)
- ✅ **Q-CC-15** — Priority is per-request, not per-sub-node
- ✅ **Q-CC-16** — Mongo transactions used → replica set required

## Questions still open

- 🟡 Q-CC-12 (WA rates on Contract vs Plan template)
- 🟡 Q-CC-14 (contract expiry boundary race)
- 🟡 Q-CC-17 (ledger append-only enforcement)
- 🟡 Q-CHN-01..10 (Email partial, Campaign orchestration, Flow Builder visual, etc.)

## Trigger phrases (for future sessions)

- `wallet specialist` / `wallet specialist hub` / `wallet specialist guide` / `vol 45`
- `multi-contract cross-pricing` / `BR-CC-31 algorithm` / `nearest-expiry FIFO code`
- `campaigns specialist` / `campaigns channels hub` / `vol 46`
- `does Falcon do Facebook` / `does Falcon do Instagram` → answer: NO
- `OcsWallet` / `AllocateOcsMonetaryBucketsPolicy` / `WalletMutationReceipt`
- `ResolveWalletFundingDecisionPolicy`
- `CommChannel priority storage` → answer: per-request, not stored
- `meta integration boundaries` / `whatsapp business api`
- `voice IVR flow builder`
- `KSA CITC SMS opt-in`

## Why this matters

Vol 44 gave us 35+ truth tautologies; Vol 45 + 46 turn them into **operating manuals** with code citations and edge cases. The Obsidian hubs make them instantly retrievable — any "wallet" or "channels" question routes through one entry point. The 5-word channel truth ends the "does Falcon do Facebook?" ambiguity that has lived in marketing material for too long.
