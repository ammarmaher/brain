---
name: Vol 53 + 54 + 55 (Order Polling + Reservation TTL + Marketplace Pricing)
description: Three specialist Atlas volumes — async order saga with 2s×30min polling, reservation TTL self-healing, and Marketplace visibility/pricing with 4 live code drifts
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 53 + Vol 54 + Vol 55 Burst — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (Waves 21-22 autopilot).

## What landed

- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-53-ORDER-PAYMENT-POLLING-SPECIALIST.md` — 11 sections
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-54-RESERVATION-TTL-SPECIALIST.md` — 13 sections
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-55-MARKETPLACE-VISIBILITY-PRICING-SPECIALIST.md` — 13 sections
- 3 Obsidian graph nodes in 10-Pages
- 1 new Obsidian hub: `MARKETPLACE-PRICING-SPECIALIST-HUB.md`
- AMMAR_BRAIN_HOME + ATLAS_MASTER_INDEX + MEMORY updated

## Vol 53 — Order Status & Payment Polling

Key truths:
- Order has 3 states: **Pending / Active / Failed** (Failed is terminal — must create new order to retry)
- FE polls `GET /api/order/{id}/status` via `SimplePollService` every 2 seconds for up to 30 minutes
- 3 documented failure-reason dialogs map to wallet `ResolveWalletFundingDecisionPolicy` Fail variants
- Order is the runtime for the Marketplace DoPayment action

## Vol 54 — Reservation & TTL

Key truths:
- **`available = balance - reservedAmount`** — the formula every query must use
- 3 outcomes: Commit (success) / Release (cancel) / Expire (worker self-heal)
- `ReservationExpiryWorker` is the only safety-net BackgroundService in Charging
- Multi-contract reservations record `sources[]` for proportional commit/release
- TTL is mandatory — the self-healing mechanism for orphaned reservations

## Vol 55 — Marketplace Visibility & Pricing (4 drifts flagged)

Code-verified MP-TT status:

| ID | Status |
|---|---|
| MP-TT-01 | ✅ Inferred from single-store model |
| MP-TT-02 | ✅ CODE-VERIFIED (Visibility = Falcon-only) |
| MP-TT-03 | 🟡 PARTIAL (filter exists, handlers missing) |
| MP-TT-04 | ❌ ENTIRELY MISSING (scheduled price change — task chip already open) |
| MP-TT-05 | 🟡 LIKELY BROKEN (Inactive First Time depends on StatusHistory which is empty) |

## Atlas state after these waves

- **Volumes:** 55 (Vols 1-55)
- **Specialist Hubs:** 5 active (Wallet, Campaigns, User-Lifecycle, PES, **Marketplace**)
- **Code-verified volumes:** Vol 45 (Wave 11) · Vol 47 (Wave 14) · Vol 50 (Wave 17) · Vol 51 partial (Wave 18a + 18b)
- **Live bugs/gaps:** 8 task chips (Wave 14 × 3 + Wave 18b × 2 + Wave 17 × 2 + lingering)
- **Background agents running:** Wave 23 Identity-deep + Wave 24 Gateways

## Trigger phrases

- `vol 53 order polling` / `SimplePollService 2s 30min` / `3 failure dialogs`
- `vol 54 reservation TTL` / `ReservationExpiryWorker` / `available = balance - reserved`
- `vol 55 marketplace pricing` / `MARKETPLACE-PRICING-SPECIALIST-HUB`
- `MP-TT-04 missing scheduled price change`
- `falcon owns commerce client owns operation`
- `order entity Pending Active Failed`
- `commit XOR release reservation invariant`
