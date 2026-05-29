---
type: architectural-finding
title: "CommChannel/App Status FSM is owned by Commerce, not Provisioning"
discovered: 2026-05-17
wave: 5d
severity: HIGH (business-critical misconception risk)
source-prefix: [CODE] falcon-core-provisioning-svc + [CODE] falcon-core-commerce-svc + [BRAIN-OUT] Wave 5d report
---

# Architectural Finding: CommChannel/App Status FSM Owner = Commerce

> [!tldr]
> The InActive→Paid→Active→Expired→Disabled lifecycle for CommChannels and Applications is **owned and driven by the Commerce service**, not Provisioning. Provisioning reads and mirrors the state; it does NOT transition it. This matters for any business discussion about "why did a CommChannel change status?"

## What was found

Wave 5d (Provisioning controller deep-dive) discovered that `falcon-core-provisioning-svc` ships only **2 controllers**:

| Controller | Endpoints | Role |
|---|---|---|
| `ServicesController` | 5 (list, details, visible-details, shadow-rows, etc.) | Read current subscription state + expose `availableActions[]` |
| `LookupController` | 1 (lookup values for dropdowns) | Read-only catalog (currently returns empty — see pending question) |

There are **no** lifecycle-mutation controllers in Provisioning (no activate/renew/disable/enable/payment endpoints).

## Who actually owns the FSM

The status FSM (`eProductSubscriptionStatus`: 1=InActive, 2=Paid, 3=Active, 4=Expired, 5=Disabled) and the action availability logic (`ServicesActionsPolicy.cs`) live in:

```
falcon-core-provisioning-svc/Domain/Services/Policies/ServicesActionsPolicy.cs
falcon-core-provisioning-svc/Domain/Constants/Enums.cs  ← eProductSubscriptionStatus
```

But the **transitions** (InActive→Paid, Paid→Active, Active→Expired, Expired→InActive-grace, etc.) are **driven by Commerce** via Kafka events and direct service calls. Provisioning reflects the resulting state via its ServicesController read endpoints.

## Why this matters in business meetings

| Business question | Correct answer |
|---|---|
| "Why is this CommChannel Expired?" | "Commerce service expired it based on the contract date + payment timeline. Provisioning is just showing you the state." |
| "Who triggers the Do Payment action?" | "The FE calls Commerce (not Provisioning) to initiate payment. Commerce then fires a Kafka event that Provisioning + Charging consume." |
| "Where do I look to debug a CommChannel stuck in 'Paid'?" | "Commerce service — the Paid→Active transition is Commerce's job. Provisioning cannot move it." |
| "What does the Provisioning service actually do?" | "It is the read layer for subscription state and the policy engine for which actions are available to which roles. The write layer is Commerce." |

## Kafka event chain (inferred from service discovery)

```
FE → Commerce POST /api/Node/{id}/comm-channels/{action}
  → Commerce updates CommChannelConfig.status
  → Commerce publishes Kafka event (e.g. CommChannelActivated)
  → Provisioning consumes event → updates its own subscription mirror
  → Charging consumes event → records WalletRecord deduction
```

[INFERRED] The Kafka event chain above is inferred from the service architecture + Wave 5d code evidence. Verify against `falcon-core-commerce-svc/Infrastructure/Kafka/` + `falcon-core-provisioning-svc/Infrastructure/Kafka/` event handlers.

## Impact on Add Client wizard

Step 3 (CommChannels) + Step 4 (Applications) of the Add Client wizard call:
- `GET commerce/Node/{id}/comm-channels/visible/details` — Commerce, not Provisioning
- `GET commerce/Node/{id}/applications` — Commerce, not Provisioning

The `LookupController` in Provisioning (`GET /api/lookup-values?name=`) is used for the **wizard's search/filter dropdown population** — but it currently returns empty (see `wave-5d-provisioning-lookup-empty-seed.md`).

## Action items

1. **Confirm Kafka chain** by reading Commerce + Provisioning event handlers.
2. **Resolve the LookupController empty-seed question** (pending question `wave-5d-provisioning-lookup-empty-seed.md`) — this directly impacts Add Client wizard functionality.
3. **Update architecture wiki** (`falcon-wiki/Home/Software-Architecture-Design/`) with "Provisioning = read-mirror + action-policy; Commerce = FSM owner" as a standing architectural truth.

## See also

- `understanding/backend/provisioning/controllers/ServicesController/` — the read layer
- `understanding/backend/provisioning/controllers/LookupController/` — the empty lookup catalog
- `understanding/backend/commerce/controllers/CommChannelController/` (Wave 5a, when complete) — the FSM write layer
- `_pending-questions/wave-5d-provisioning-lookup-empty-seed.md`
- `prd/modules/01-account-management/BUSINESS_RULES.md` BR-AM-20..24 (FSM rules owned here by PRD)
