# Volume 55 — Marketplace Visibility & Pricing Specialist Guide

> **Specialist depth:** The Marketplace's two parallel menu items (CommChannels & Services Mng + Marketplace & Applications Mng), the Falcon-vs-Client view divergence, the Visibility commercial gate, the Falcon-only pricing edits, and the scheduled-price-change feature (currently UNIMPLEMENTED per Wave 18b — flagged HIGH).
>
> **Authority:** Vol 44 §7 (MP-TT-01..05 tautologies) + Wave 18b code-verification (MP-TT-02 enforced, MP-TT-04 entirely missing).

---

## §1 — The Two Menu Items (Vol 44 §7.1)

### §1.1 The pages

The Falcon admin console exposes TWO parallel marketplace pages outside the Organization Hierarchy:

| Menu item | Surfaces | Backend entity |
|---|---|---|
| **CommChannels & Services Mng** | WhatsApp channels (Auth/Util/Mark), Voice channels, SMS channels + their sub-services | `CommunicationChannelServices` Mongo collection |
| **Marketplace & Applications Mng** | Falcon-built + partner applications | `ApplicationServices` Mongo collection |

### §1.2 The dual-page sync (MP-TT-01)

These pages are **bidirectionally synced** with the corresponding tabs inside the Organization Hierarchy → Account/Node detail view:
- Any change in the Marketplace pages instantly reflects in Org Hierarchy tabs (and vice versa).
- They're not two stores — they're two **views of one underlying entity**.

The Provisioning service is the SoT for both (Mongo collections `ApplicationServices` and `CommunicationChannelServices` per Wave 18b Finding §4).

### §1.3 Why two menu items vs one?

UX clarity:
- CommChannels = the "infrastructure" services (WA, Voice, SMS — the message-delivery rails).
- Applications = the "applications" tier (BSA, Voice IVR builder, future-Campaigns — built on top of CommChannels).

A client AO typically buys CommChannels first, then Applications on top.

---

## §2 — The Visibility Commercial Gate (MP-TT-02)

### §2.1 What Visibility does

Every CommChannel/Application has a `visibility: Show | Hide` flag.
- **Show** = visible to the client.
- **Hide** = invisible to the client; only Falcon staff see it.

### §2.2 Why it's Falcon-controlled

This is a **commercial gate**, NOT a security gate. Falcon controls which services a client account is "offered". Examples:
- Trial accounts may only see WA-Util (no Mark, no Voice).
- Paid-tier accounts see everything.
- Specific clients get bespoke services hidden from others.

### §2.3 Code enforcement (Wave 18b — CONFIRMED MP-TT-02)

`ChangeVisibility` endpoint at Provisioning is gated by:
1. `[FalconOnly]` controller-level PES policy.
2. `CanHide` domain invariant.
3. `CannotHideActiveService` invariant (cannot Hide a CommChannel/App currently in `Active` state — must Disable first).

**Code:** `Domain/Services/Policies/ServicesActionsPolicy.cs:28-29` (visibility policy) + `Domain/Services/Policies/ServicesActionsPolicy.cs:17-20` (Falcon-disable lock).

### §2.4 What clients see

Client view (CommChannels & Services Mng OR Marketplace & Applications Mng on the client side):
- ONLY services where `visibility=Show`.
- Card view OR table view (toggle).
- Per-row action: Do Payment / Enable / Disable (status-dependent — Vol 46 §6.1).

Client cannot:
- Toggle Visibility.
- Edit Pricing Type or Pricing Value.

### §2.5 What Falcon staff see

Falcon view (System Console):
- ALL services regardless of Visibility.
- Per-row action menu: Edit Pricing Type, Edit Pricing Value, Do Payment, Enable, Disable.
- Visibility toggle.

---

## §3 — Falcon-Only Pricing Edits (MP-TT-03)

### §3.1 The Pricing Type field

Enum (per Vol 44): `Monthly | Yearly | OneTimePayment`.

(Note: Vol 44 §7 explicitly says NO `Quarterly` — confirmed in BRD spreadsheet.)

### §3.2 The Pricing Value field

Decimal SAR amount per the Pricing Type cycle.

### §3.3 Both editable ONLY by Falcon staff (MP-TT-03)

Per Vol 44 §7 — clients see Pricing Type and Pricing Value as read-only. Editing requires Falcon-side authorization.

### §3.4 Code drift (Wave 18b finding)

The Falcon-only filter EXISTS at the Provisioning policy layer (`ServicesActionsPolicy.cs`), but **the actual price-change command handlers do NOT exist**. The filter is positioned correctly; the implementation is missing.

**Implication:** Currently no one can edit pricing — not even Falcon admin via the UI. The UI may surface the edit dialog but submitting it fails (or routes to a missing endpoint).

**Q-MP-01 (NEW HIGH):** Confirm if the Falcon UI's "Edit Pricing Type" button is currently broken in production OR if the edit flow uses a different (Commerce-side?) handler.

---

## §4 — Scheduled Price Change (MP-TT-04 — UNIMPLEMENTED, HIGH GAP)

### §4.1 What the BRD requires (Vol 44 §7.4)

When Falcon staff edits Pricing Type or Pricing Value while service status ≠ `Inactive (First Time)` AND status ≠ `-`:
- The system MUST add 3 fields to the service: `NewPricingType`, `NewPricingValue`, `EffectiveDate`.
- At the `EffectiveDate`, the pricing changes are automatically applied (new becomes current; old is replaced).
- Until the EffectiveDate hits, BOTH old AND new pricing are visible (in the "More Details" section per Vol 44 §7.3).

### §4.2 Status code (Wave 18b — CONFIRMED MISSING)

Per Wave 18b Finding §3:
- ❌ No `effectiveDate` field on Provisioning's service entities.
- ❌ No scheduled-change projection (no `ScheduledPricingChange` collection or sub-document).
- ❌ No background worker / Hangfire / Kafka scheduler to flip pricing at `effectiveDate`.
- ❌ No price-change command handlers.

**This is a 100% greenfield feature** — none of it exists.

### §4.3 Task chip spawned

A task chip was spawned in the prior wave for this implementation (Wave 18b §3 follow-up). The fix decision requires architect input on:
- Option A: Commerce-side projection + Kafka delayed event.
- Option B: Provisioning-side scheduler / BackgroundService.
- Option C: Hybrid.

### §4.4 Acceptance criteria for the fix

1. `service.NewPricingType` + `service.NewPricingValue` + `service.EffectiveDate` fields populated when Falcon edits an Active/Expired/Disabled service.
2. UI surfaces both old and new pricing under "More Details".
3. At `EffectiveDate`, pricing auto-flips. Audit entry written.
4. Before `EffectiveDate`, Falcon can edit the New fields again OR cancel the scheduled change.
5. After `EffectiveDate`, the change is committed (no rollback).
6. When status = `Inactive (First Time)`, the new pricing replaces directly (no scheduling — see §5 below).

---

## §5 — Inactive (First Time) vs Inactive (MP-TT-05)

### §5.1 The distinction

Vol 44 §7.4 makes this explicit:
- **`Inactive (First Time)`** = the service has NEVER been activated (no prior `Activated` event in its history).
- **`Inactive`** (without qualifier) = the service WAS activated at some point, then became Inactive (e.g., disabled, expired, etc.).

### §5.2 Why it matters

For Falcon staff editing pricing:
- If status = `Inactive (First Time)` → **price change applies immediately** to the main Pricing Type / Pricing Value fields. No scheduling.
- If status = `Inactive` (or Active / Expired / Disabled) → **price change is scheduled** with `EffectiveDate`.

### §5.3 Implementation hint

The "First Time" qualifier likely reads from `StatusHistory[]`:
```
if (service.StatusHistory.IsEmpty || service.StatusHistory.AllAre(Inactive)):
    treat as Inactive (First Time)
else:
    treat as Inactive (post-activation)
```

But Wave 18b found `StatusHistory[]` is **modeled but never written**. So the "First Time" distinction may not work at runtime either.

**Q-MP-02 (NEW):** How is `Inactive (First Time)` currently distinguished from `Inactive` in code, given `StatusHistory` is empty?

---

## §6 — The Falcon-Side Edit Menu

### §6.1 The 5 actions

Per Vol 44 §7.2:
1. **Edit Pricing Type** — opens a dialog to change Monthly/Yearly/OneTimePayment.
2. **Edit Pricing Value** — opens a dialog to change SAR amount.
3. **Do Payment** — triggers the order saga (Vol 53).
4. **Enable** — re-enables a Disabled service.
5. **Disable** — disables an Active service (state transition).

The visible subset depends on current status (per Vol 46 §6 stuck-state table + Vol 44 §6).

### §6.2 Action visibility per status (Falcon side)

| Status | Edit Type | Edit Value | Do Payment | Enable | Disable |
|---|---|---|---|---|---|
| Inactive (First Time) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Inactive | ✅ (scheduled) | ✅ (scheduled) | ✅ | ❌ | ❌ |
| Active | ✅ (scheduled) | ✅ (scheduled) | ❌ (already paid) | ❌ | ✅ |
| Expired | ✅ (scheduled) | ✅ (scheduled) | ✅ | ❌ | ✅ |
| Disabled | ✅ (scheduled) | ✅ (scheduled) | ✅ | ✅ | ❌ |

### §6.3 Wave 18b code-status

Of the 5 actions above:
- **ChangeVisibility** — ✅ implemented (technically Visibility, not in the 5-action menu but adjacent).
- **DoPayment / Enable / Disable / Edit Pricing Type / Edit Pricing Value** — ❌ ALL MISSING command handlers in Provisioning.

These are likely routed via Commerce's saga-lite orchestrators (per Wave 18a) and Commerce writes to Provisioning's Mongo directly? Or there's a yet-undiscovered handler path?

**Q-MP-03 (NEW HIGH):** Where exactly do the 5 Falcon-menu actions route? Provisioning? Commerce? Charging? Trace one end-to-end.

---

## §7 — The Client-Side Menu (Card or Table)

### §7.1 What clients see

- Card view (default for marketplace browsing) OR table view (toggle).
- Per-row action buttons (card) OR 3-dot menu (table):
  - **Do Payment** (status: Inactive / Expired / Disabled)
  - **Enable** (status: Disabled)
  - **Disable** (status: Active)
- "More Details" link to see First Activation Date, Activation Date, Renew Date, and scheduled pricing changes.

### §7.2 What clients CANNOT do

- Toggle Visibility.
- Edit Pricing Type.
- Edit Pricing Value.
- See scheduled pricing changes in the main fields (only under "More Details").

### §7.3 Why this design

Pricing is Falcon's commercial decision. The client doesn't negotiate pricing through the UI — they have a contract; the contract drives pricing. Marketplace UI is for status management + activation.

---

## §8 — End-to-End Pricing Edit Flow (Falcon-side, IF implemented)

```
[1] Falcon staff opens CommChannels & Services Mng
     │
     ▼
[2] Clicks "Edit Pricing Value" on a service in status=Active
     │
     ▼
[3] Dialog opens:
     - Current Pricing Type: Monthly
     - Current Pricing Value: 500 SAR
     - New Pricing Type: [select]
     - New Pricing Value: [input]
     - Effective Date: [date picker] (must be > today)
     │
     ▼
[4] Falcon submits.
     │
     ▼
[5] [GAP] — backend handler does NOT exist
     │
     ▼
[6] [IDEAL] Provisioning (OR Commerce) updates service:
     - NewPricingType, NewPricingValue, EffectiveDate populated
     - Audit entry written
     - Kafka event emitted (e.g., service-pricing-scheduled.v1)
     │
     ▼
[7] [IDEAL] On EffectiveDate (background worker / Kafka scheduler):
     - Pricing Type ← NewPricingType
     - Pricing Value ← NewPricingValue
     - New* fields cleared
     - Audit entry written
     - Kafka event emitted (e.g., service-pricing-changed.v1)
     │
     ▼
[8] Client and Falcon both see the new pricing on their next refresh.
```

Steps 5-8 are the **unimplemented portion**. Task chip is open for this work.

---

## §9 — Cross-Reference to Vol 44 (Marketplace Truth Tautologies)

| ID | Tautology | Code status |
|---|---|---|
| MP-TT-01 | Marketplace ↔ Org Hierarchy bidirectional sync | ✅ Inferred from single-store model |
| MP-TT-02 | Visibility = Falcon-controlled commercial gate | ✅ ENFORCED (`ServicesActionsPolicy.cs:28-29`) |
| MP-TT-03 | Pricing Type/Value editable only by Falcon | 🟡 PARTIAL (filter exists, handlers missing) |
| MP-TT-04 | Scheduled price change = New + EffectiveDate triplet | ❌ ENTIRELY MISSING |
| MP-TT-05 | Inactive (First Time) ≠ Inactive — apply-now vs schedule | 🟡 LIKELY BROKEN (`StatusHistory` empty) |

---

## §10 — Edge Cases

### §10.1 Falcon edits pricing while client mid-DoPayment

**Setup:** Falcon clicks Edit Pricing Value at 14:00:00.000; client clicks Do Payment at 14:00:00.001 — same service, race.
**Behavior:** The Pending Order (from Vol 53) snapshots the price at order-creation time. If Order is Pending when Falcon submits new pricing → Order completes at the old price. New pricing applies to future orders.

### §10.2 EffectiveDate in the past
**Setup:** Falcon submits a pricing edit with EffectiveDate = yesterday.
**Behavior:** [IDEAL] Reject with `InvalidEffectiveDate` (must be future).

### §10.3 EffectiveDate = today
**Setup:** Falcon submits with EffectiveDate = today.
**Behavior:** [IDEAL] Apply immediately at the next scheduler sweep (could be within minutes), OR apply at 00:00:01 of the date. Implementation choice.

### §10.4 Cancel a scheduled price change
**Setup:** Falcon scheduled a pricing change for next month; now wants to cancel.
**Behavior:** [IDEAL] Endpoint to clear New* fields. Need to design.

### §10.5 Two Falcon admins edit pricing simultaneously
**Setup:** Falcon A and B both submit pricing edits.
**Behavior:** [IDEAL] Optimistic concurrency on the service entity catches the conflict. Second submission gets `VersionConflict`.

### §10.6 Service activated between EffectiveDate scheduling and effect date
**Setup:** Pricing scheduled at EffectiveDate D. On day D, service is still in Inactive (First Time) state.
**Behavior:** [IDEAL] On D, pricing flips. The "First Time" qualifier doesn't bypass the scheduled change.

---

## §11 — Mental Model

### §11.1 The "Falcon owns commerce, client owns operation" axiom

- **Falcon** decides WHAT is sold (Visibility), at WHAT PRICE (Pricing Type/Value), to WHOM (per-account configuration).
- **Client** decides WHEN to ACTIVATE (Do Payment), and WHEN to PAUSE (Disable).

The marketplace is a 2-sided gate — Falcon's commercial controls + Client's operational controls.

### §11.2 The "scheduled change is a contract" axiom

A scheduled price change (`NewPricingType` + `NewPricingValue` + `EffectiveDate`) is effectively a **mini-contract** between Falcon and Client. Until EffectiveDate, the old price is in force. After, the new. Cancellation before EffectiveDate is allowed; after, it's commit.

### §11.3 The "Inactive First Time = greenfield" axiom

A never-activated service can be repriced without trace, because there's no historical billing dependency. Once activated, any price change creates a billing transition that affects future invoices — must be scheduled with notice.

---

## §12 — Cross-References

- Vol 44 §7 — Marketplace truth tautologies (MP-TT-01..05)
- Vol 46 §6 — CommChannel/App stuck-state action cascade
- Vol 49 — Template Lifecycle (Falcon's role similar — commercial control)
- Vol 51 §V51-PROVISIONING-ADDENDUM — Wave 18b findings on Provisioning's thin-skeleton state
- Vol 53 — Order/Polling Specialist (the DoPayment saga)
- `[CODE]` `Domain/Services/Policies/ServicesActionsPolicy.cs:17-20, 28-29`
- `Acc-CommChannels-Marketplace-MenuItems.txt` — BRD source

---

## §13 — Open Questions

| ID | Question | Severity |
|---|---|---|
| Q-MP-01 | Is the Falcon UI's Edit Pricing Type/Value currently broken in production? | **HIGH** |
| Q-MP-02 | How is `Inactive (First Time)` currently distinguished, given `StatusHistory` is empty? | MED |
| Q-MP-03 | Where do the 5 Falcon-menu actions route (Provisioning? Commerce? Charging?)? Trace end-to-end | **HIGH** |
| Q-MP-04 | Cancel a scheduled pricing change — endpoint shape? | MED |
| Q-MP-05 | EffectiveDate at exact boundary (00:00 of date) — apply at sweep or trigger event? | LOW |
| Q-MP-06 | Audit trail for pricing changes — written where? | MED |

---

**End of Volume 55 — Marketplace Visibility & Pricing Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 44 §7 + Vol 46 §6 + Vol 51 §V51-PROVISIONING-ADDENDUM
**Spawns:** Q-MP-01..06 + reinforces the task chip for MP-TT-04 implementation
