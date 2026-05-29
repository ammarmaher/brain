---
type: specialist-hub
hub: marketplace-pricing-specialist
created: 2026-05-18
authority: "Vol 55 + Vol 44 §7 (MP-TT-01..05) + Wave 18b code-verification"
status: canonical-code-verified
tags:
  - specialist/marketplace
  - specialist/pricing
  - specialist/visibility
  - specialist/commerce
  - hub
---

# 🛒 Marketplace & Pricing — Specialist Hub

> **Your entry point** for anything Marketplace / Visibility / Pricing / Scheduled-Change related.

## 🚀 Quick triage

| If you're asking... | Start here |
|---|---|
| "Who can flip Visibility (Show/Hide)?" | Falcon staff only — [Vol 55 §2](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-55-MARKETPLACE-VISIBILITY-PRICING-SPECIALIST.md) (CODE-VERIFIED) |
| "Can a client edit pricing?" | No — [Vol 55 §3](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-55-MARKETPLACE-VISIBILITY-PRICING-SPECIALIST.md) (but Falcon handlers are MISSING too) |
| "How does scheduled price change work?" | ❌ NOT IMPLEMENTED — [Vol 55 §4](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-55-MARKETPLACE-VISIBILITY-PRICING-SPECIALIST.md) (task chip spawned) |
| "Inactive vs Inactive (First Time)?" | [Vol 55 §5](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-55-MARKETPLACE-VISIBILITY-PRICING-SPECIALIST.md) (likely broken in code) |
| "Where does DoPayment go?" | [[Vol 53 — Order Payment Polling Specialist]] |
| "What's the 5-action menu?" | [Vol 55 §6](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-55-MARKETPLACE-VISIBILITY-PRICING-SPECIALIST.md) |

## 🧠 The mental model (one paragraph)

The Marketplace has **two menu items** (CommChannels & Services Mng + Marketplace & Applications Mng), both surfacing data from **one** Provisioning entity store (Mongo collections `CommunicationChannelServices` + `ApplicationServices`). Bidirectionally synced with Org Hierarchy tabs. **Falcon controls commerce** (Visibility, Pricing Type, Pricing Value, Scheduled Change) — but currently **only Visibility is fully wired in code**. Pricing edit handlers are missing. Scheduled price change is **100% unimplemented**. **Client controls operation** (DoPayment, Enable, Disable). DoPayment is the order-saga runtime (see Vol 53).

## ⚠️ Live code drifts

| # | Drift | Severity | Status |
|---|---|---|---|
| 1 | Pricing edit handlers missing (MP-TT-03 partial) | **HIGH** | Q-MP-01 open |
| 2 | Scheduled price change entirely missing (MP-TT-04) | **HIGH** | Task chip spawned in Wave 18b §3 |
| 3 | Inactive (First Time) distinction likely broken (StatusHistory empty) | MED | Q-MP-02 open |
| 4 | 6 lifecycle command handlers missing (Activate/Renew/Disable/Enable/DoPayment/DeletePending) | **HIGH** | Task chip spawned in Wave 18b §1 |

## 📚 Sources of truth (priority order)

1. **`[CODE]`** `Domain/Services/Policies/ServicesActionsPolicy.cs:17-20, 28-29` — visibility + Falcon-disable enforcement
2. **`[CODE]`** `Domain/Entities/FalconService/FalconServiceBase.cs:42-75` — `availableActions[]` FSM (read-side)
3. **`[CODE]`** `Domain/Constants/Enums .cs:3-42` (literal space in filename) — `eProductSubscriptionStatus` + `eFalconServiceAction`
4. **`[BRAIN-OUT]`** Vol 55 — specialist operating guide
5. **`[BRAIN-OUT]`** Vol 44 §7 — BRD-extracted MP-TT-01..05 tautologies
6. **`[BRD-EXTRACTED]`** `Acc-CommChannels-Marketplace-MenuItems.txt` — original source

## 🔑 The 5 truth tautologies

| ID | Tautology | Code status |
|---|---|---|
| MP-TT-01 | Marketplace ↔ Org Hierarchy bidirectional sync | ✅ Inferred from single-store model |
| MP-TT-02 | Visibility = Falcon-controlled commercial gate | ✅ CODE-VERIFIED |
| MP-TT-03 | Pricing Type/Value editable only by Falcon | 🟡 PARTIAL (filter exists, handlers missing) |
| MP-TT-04 | Scheduled price change = New + EffectiveDate triplet | ❌ ENTIRELY MISSING |
| MP-TT-05 | Inactive (First Time) ≠ Inactive — apply-now vs schedule | 🟡 LIKELY BROKEN |

## 🚦 Status × Action visibility (Falcon side, Vol 55 §6.2)

| Status | Edit Type | Edit Value | Do Payment | Enable | Disable |
|---|---|---|---|---|---|
| Inactive (First Time) | ✅ apply now | ✅ apply now | ✅ | ❌ | ❌ |
| Inactive | ✅ scheduled | ✅ scheduled | ✅ | ❌ | ❌ |
| Active | ✅ scheduled | ✅ scheduled | ❌ | ❌ | ✅ |
| Expired | ✅ scheduled | ✅ scheduled | ✅ | ❌ | ✅ |
| Disabled | ✅ scheduled | ✅ scheduled | ✅ | ✅ | ❌ |

## ❓ Open questions

| ID | Severity |
|---|---|
| Q-MP-01 | HIGH — Is Falcon UI's Edit Pricing currently broken in prod? |
| Q-MP-02 | MED — Inactive (First Time) distinction |
| Q-MP-03 | HIGH — Where do 5 actions route — Provisioning? Commerce? Charging? |
| Q-MP-04 | MED — Cancel scheduled pricing change |
| Q-MP-05 | LOW — EffectiveDate boundary semantics |
| Q-MP-06 | MED — Audit trail for pricing changes |

## 🔗 See also

- [[WALLET-SPECIALIST-HUB]] — funding decision underlies DoPayment
- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — channel-side dependency
- [[PES-CATALOG-SPECIALIST-HUB]] — Falcon-only PES gate
- [[Vol 53 — Order Payment Polling Specialist]] — DoPayment runtime
- [[Vol 51 — Cross-BC Saga Map]] §V51-PROVISIONING-ADDENDUM — Wave 18b findings
- [[VOL-44-TRUTH-TAUTOLOGIES]] §Marketplace
- [[ATLAS_MASTER_INDEX]]
- [[AMMAR_BRAIN_HOME]]

#specialist/marketplace #specialist/pricing #specialist/visibility #hub #canonical
