# Volume 53 — Order Status & Payment Polling Specialist Guide

> **Specialist depth:** The operating model for the Order workflow — `DoPayment` action, `SimplePollService` (2-second × 30-minute polling), 3 failure-reason dialogs, the Commerce ↔ Charging payment saga, and the order-status lifecycle.
>
> **Authority:** Wave 11 (Charging) + Wave 18a (Commerce — confirms `commerce.order-created.v1` produced + `charging.order-payment-processed.v1` consumed). Prior memory entry on commchannels/apps tabs Phase 1.

---

## §1 — Why orders + polling exist

### §1.1 The DoPayment action is NOT synchronous

When AO clicks "Do Payment" on a stuck CommChannel or Application:
- Falcon's BSA/Marketplace UI fires `POST /api/order/do-payment`.
- Commerce creates an **Order** entity in Pending state.
- Order processing involves Charging (FundingDecision + wallet debit) + Provisioning (state transition).
- The UI cannot block waiting for downstream — that would be a 30-minute spinner.

### §1.2 The polling pattern

The FE uses a `SimplePollService` to poll order status every 2 seconds for up to 30 minutes. While polling:
- UI shows a "processing" state.
- Each poll returns one of: `Pending`, `Active` (success), or a failure-reason terminal state.
- On terminal success/failure, UI exits polling and shows the result.

### §1.3 Why 2 seconds / 30 minutes?

- **2-second interval** — short enough for responsive UX, not so short it overloads the backend.
- **30-minute timeout** — generous upper bound for slow saga compensations. Beyond 30 min, UI shows "operation timed out" and recommends user refresh.

Both are configurable but stable in production.

---

## §2 — The Order Entity Lifecycle

### §2.1 Order states

| State | Meaning | Reached from | Reached to |
|---|---|---|---|
| **Pending** | Order created, awaiting processing | initial | Active, Failed |
| **Active** | Order fully processed (target resource activated) | Pending | (terminal success) |
| **Failed** | Order processing failed with explicit reason | Pending | (terminal failure) |

### §2.2 Failure reasons (the 3 dialogs)

| Failure code | Cause | UI dialog | Recovery |
|---|---|---|---|
| `CommChannelPriorityOrderRequired` | Multi-Wallet account; MW alone insufficient; CommChannel priority NOT set in request | Dialog: "Please set CommChannel wallet priority before retrying" | UI re-renders with priority picker → AO sets order → resubmits |
| `InsufficientFunds` | Total available (MW + CommChnl in multi mode) < Needed amount | Dialog: "Insufficient balance. Top up or reduce." | AO charges contract via Falcon admin OR contacts T2 |
| `WalletNotConfigForTheNode` | Account has no active contracts OR no wallet records for the node | Dialog: "Wallet not configured. Contact your administrator." | Falcon admin sets up the account's contract |

These are the **only 3 documented failure-reason dialogs**. Other failures (e.g., Provisioning crash, network error) fall through to a generic "Operation failed" dialog.

### §2.3 State transitions (visual)

```
                ┌────────┐
                │PENDING │
                └────────┘
                /        \
       (saga succeeds)    (saga fails)
              /              \
             ▼                ▼
       ┌────────┐         ┌────────┐
       │ ACTIVE │         │ FAILED │
       └────────┘         └────────┘
                          (with failure code)
```

There's no path back from Failed to Pending — the user must create a NEW order to retry.

---

## §3 — The Payment Saga (end-to-end)

### §3.1 Steps

```
[1] AO clicks DoPayment on stuck CommChannel/App
     │
     ▼
[2] FE: POST /api/order/do-payment
     payload: { resourceId, resourceType, commChannelPriority?[] }
     │
     ▼
[3] Commerce: validate request → create Order (Pending)
     - Emit commerce.order-created.v1 (Kafka)
     - Respond 201 Created with { orderId, status: 'Pending' }
     │
     ▼
[4] FE: start SimplePollService (2s × 30min)
     │
     ▼
[5] Charging consumer of commerce.order-created.v1:
     - Call ResolveWalletFundingDecisionPolicy
       → returns Master | CommChannel | Both | Fail(reason)
     - If Fail: emit charging.order-payment-processed.v1 with status=Failed + reason
     - If success: debit wallets via MongoUnitOfWork; emit ...processed.v1 with status=Funded
     │
     ▼
[6] Commerce consumer of charging.order-payment-processed.v1:
     - If Funded: forward to Provisioning (somehow — see Wave 18b gap)
     - If Failed: mark Order.Failed with the reason
     │
     ▼
[7] Provisioning: activates the CommChannel/App (state transition)
     - Currently NOT FULLY WIRED — Vol 51 §V51-PROVISIONING-ADDENDUM §1 (6 handlers missing)
     - Likely Commerce + Charging write directly to Provisioning's Mongo, OR via a missing intermediate handler
     │
     ▼
[8] Once Provisioning marks the resource Active:
     - Commerce projects this back into Order.Active
     │
     ▼
[9] FE poll returns status=Active → UI exits poll, shows success
```

### §3.2 Where the polling actually polls

`GET /api/order/{orderId}/status` returns `{ orderId, status, failureReason?, lastUpdatedAt }`. The Commerce endpoint reads Order entity's current state.

### §3.3 Idempotency

The `WalletMutationReceipt` pattern (Vol 45 §V45 addendum §3) ensures Charging won't double-debit if the consumer replays. Order itself is idempotent: same `orderId` = same Order. Resubmitting from FE doesn't create a new order.

---

## §4 — The Saga's Race Conditions

### §4.1 Polling completes before Order finalizes

**Setup:** Charging takes longer than 30 min (unlikely but possible during outage).
**Behavior:** Poll times out → UI shows "Operation timed out — refresh to check status." Underlying Order continues processing.
**Resolution:** When user refreshes, order status is fetched fresh; UI catches up.

### §4.2 Network blip mid-poll
**Setup:** One poll fails with network error.
**Behavior:** SimplePollService retries (exponential backoff up to 2× interval) before moving to next 2-second cycle.

### §4.3 User closes tab during polling
**Setup:** User closes browser tab mid-order.
**Behavior:** Order continues to completion in the backend. Next time the user opens the resource, current status reflects.

### §4.4 Two AOs submit the same DoPayment simultaneously
**Setup:** Two AO sessions on same account, both click DoPayment on the same CommChannel.
**Behavior:** Commerce-side optimistic concurrency or unique constraint catches the second. Second request returns the existing order's id.

### §4.5 CommChannelPriorityOrderRequired after a Failed order
**Setup:** Order failed with `CommChannelPriorityOrderRequired`. AO supplies priority and retries.
**Behavior:** Creates a **NEW** order (Failed orders are terminal). Same logical action; new order entity.

---

## §5 — UX Patterns

### §5.1 The 3 dialogs (per prior memory + this volume)

```
┌───────────────────────────────────────────┐
│ Set CommChannel Priority                   │
│                                            │
│ Master Wallet alone cannot fund this       │
│ purchase. Please choose which CommChannel  │
│ wallets to draw from and in what order.    │
│                                            │
│ [picker]                                   │
│                                            │
│ [Cancel]                       [Continue]  │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│ Insufficient Balance                       │
│                                            │
│ Your account doesn't have enough balance   │
│ to complete this purchase.                 │
│                                            │
│ Required: 500 SAR                          │
│ Available: 250 SAR                         │
│                                            │
│ [Cancel]            [Contact Admin]        │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│ Wallet Not Configured                      │
│                                            │
│ This node's wallet is not yet set up.      │
│ Please contact your Falcon administrator.  │
│                                            │
│ [Close]                                    │
└───────────────────────────────────────────┘
```

### §5.2 Polling spinner

While the order is Pending:
- The action button is disabled.
- A small spinner appears next to the status badge.
- After 30 minutes (timeout): the spinner disappears, status shows "Pending — please refresh".

### §5.3 Why the spinner is on the row, not a global blocking modal

Because the user should be able to continue using the rest of the UI. Marketplace is a list view; one stuck row shouldn't freeze the whole page.

---

## §6 — Integration Points

### §6.1 With Wallet Specialist (Vol 45)

The order saga's funding step is `ResolveWalletFundingDecisionPolicy` — Vol 45 §V45 addendum §4. The 3 failure reasons map to the policy's failure variants:
- `Fail(InsufficientFunds)` → Order failure code `InsufficientFunds`
- `Fail(CommChannelPriorityOrderRequired)` → Order failure code `CommChannelPriorityOrderRequired`
- `Fail(WalletNotConfigForTheNode)` → New failure code (not from the policy directly; likely a pre-flight Commerce check)

### §6.2 With Campaigns Specialist (Vol 46)

After a successful DoPayment that activates a CommChannel, BSA can begin sending on that channel (Vol 46 §12 step 4 — "Validate template ... rate limit ... send window" — requires channel = Active).

### §6.3 With User Lifecycle Specialist (Vol 47)

The AO clicking DoPayment must be in status=Active (Vol 47 §9.1 — universal axiom: no non-Active user can mutate). This is checked at the command-handler layer in Commerce.

### §6.4 With PES Specialist (Vol 50)

The `do-payment` action requires PES key like `acc.commchannel/do-payment` and `acc.application/do-payment`. These are seeded for AO + (probably) NA.

### §6.5 With Marketplace Specialist (gap — future Vol 55)

The Marketplace UI shows the stuck-state action buttons (Do Payment / Disable). Vol 44 §6 truth tautologies CC-TT-01..03 document the stuck-state action cascade. Vol 53 is the runtime side of that.

---

## §7 — Edge Cases

### §7.1 Order with zero Needed amount
**Setup:** AO triggers DoPayment on a CommChannel that's actually fine (just clicked by mistake).
**Behavior:** Order succeeds immediately with Needed=0. No wallet debit, just state confirmation.

### §7.2 CommChannel deleted mid-order
**Setup:** AO submits DoPayment; another admin deletes the CommChannel while Pending.
**Behavior:** Provisioning fails to activate (resource gone) → Order Fails with generic error. The Charging debit (if it happened) is refunded via Vol 45 §10.8 compensation.

### §7.3 Multi-wallet account, MW empty but CommChnl wallet has enough
**Setup:** MW = 0; WA-Util CommChnl wallet = 1000 SAR; Needed = 500 SAR. No commChannelPriority supplied.
**Behavior:** `ResolveWalletFundingDecisionPolicy` returns `Fail(CommChannelPriorityOrderRequired)`. UI shows priority picker. AO picks WA-Util-first. Resubmits. Now `Both` branch funds it.

### §7.4 Single-wallet account, MW insufficient
**Setup:** Single-wallet mode; MW < Needed.
**Behavior:** `Fail(InsufficientFunds)` directly. No priority-picker dialog (no CommChnl wallets in single mode). Recovery: top up contract OR reduce.

### §7.5 Order timed out but Provisioning eventually activates
**Setup:** Saga takes 35 min (extreme delay). Poll times out at 30 min. UI shows "Pending — refresh".
**Behavior:** Eventually Provisioning activates → Commerce projects to Order.Active. User refreshing later sees the resource Active.

### §7.6 Contract expires mid-order
**Setup:** Order Pending; contract expires before Charging completes funding decision.
**Behavior:** Funding decision recomputes against current active contracts. If still fundable from remaining contracts → success. If not → Failed with `InsufficientFunds`.

---

## §8 — Order Endpoint Surface

[INFERRED from prior memory + standard patterns]:

| Method | Endpoint | Purpose | PES |
|---|---|---|---|
| POST | `/api/order/do-payment` | Create Order, fire saga | `acc.commchannel/do-payment` OR `acc.application/do-payment` |
| GET | `/api/order/{id}/status` | Poll status | `acc.order/view` (self-only) |
| GET | `/api/order` | List my orders | `acc.order/list` |
| (none) | manual retry/cancel | Failed orders are terminal — new order required |

**Q-ORD-01 (NEW):** Confirm if there's a `cancel-order` endpoint for Pending orders or whether they're always carried-through.

---

## §9 — PR Review Checklist (order-touching)

- [ ] Is the Order entity ID assigned at creation (no late-binding)?
- [ ] Is the FE polling using `SimplePollService` (not a custom poller)?
- [ ] Is the 2s interval honored (not 1s — would overload backend)?
- [ ] Is the 30min timeout honored (configurable but tested at default)?
- [ ] Are the 3 failure dialogs rendered correctly based on `failureReason`?
- [ ] Is the `commChannelPriority` parameter passed through Commerce → Charging?
- [ ] Is the `WalletMutationReceipt` idempotency applied (Vol 45)?
- [ ] Is the Order status check authenticated (no leaking order existence)?
- [ ] Is the Order list scoped to caller's authority (account/node/self)?
- [ ] Are race conditions in §4 covered by tests?

---

## §10 — Cross-References

- Vol 45 — Wallet Specialist (FundingDecisionPolicy is the funding engine)
- Vol 46 — Campaigns Specialist (post-activation channel enablement)
- Vol 47 — User Lifecycle (caller=Active gate)
- Vol 50 — PES Catalog (do-payment key + creator-gate doesn't apply)
- Vol 51 — Saga Map §V51-COMMERCE-ADDENDUM (Commerce produces commerce.order-created.v1)
- Wave 11 — Charging code mining (ResolveWalletFundingDecisionPolicy)
- Wave 18a — Commerce code mining (saga-lite orchestrators + Kafka topics)

---

## §11 — Open Questions

| ID | Question | Severity |
|---|---|---|
| Q-ORD-01 | Does Order support cancel for Pending state? | MED |
| Q-ORD-02 | Is the 30-min timeout configurable per-tenant or global? | LOW |
| Q-ORD-03 | If polling times out, is the Pending order eventually garbage-collected, or held indefinitely for audit? | MED |
| Q-ORD-04 | Confirm the 4th failure mode — when Provisioning activation fails, what failure code shows in UI? | MED |
| Q-ORD-05 | Is there a "retry" UX for Failed orders, or always "create new"? | LOW |

---

**End of Volume 53 — Order Status & Payment Polling Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Vol 45 §4-§5, Vol 46 §12, prior memory (commchannels/apps tabs Phase 1)
**Pending:** Wave 25 code-mining will produce §V53-CODE-VERIFICATION-ADDENDUM
