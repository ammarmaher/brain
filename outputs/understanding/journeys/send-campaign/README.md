*** Journey — Send Campaign ***
*** Folder index · 2026-05-15 ***
*** Crosses: Contact Groups · Templates · Send Transaction · Charging cascade ***

# Send Campaign — folder index

> A Normal User picks a Contact Group + a Template + composes a Send Transaction. Backend charges the **nearest-expiring Active contract** via the Charging cascade. This is the most common day-to-day Falcon transactional flow — every other journey eventually leads here.

## Files in this folder

| File | Read when... |
|---|---|
| [README.md](README.md) | You want the journey index + actor + cross-link map (this file) |
| [PLAYBOOK.md](PLAYBOOK.md) | You need the full multi-page narrative with step-by-step, Kafka events, V-rules, error recovery |

## Journey at a glance

- **Trigger:** Normal User (or any user role with Send permission) clicks "New Send Transaction" inside the Send module.
- **Outcome:** Send Transaction posted; nearest-expiring Active contract debited; downstream delivery starts.
- **Pages traversed:** Contact Groups → Templates → Send Transaction.
- **Flow playbooks used:** [[Send Transaction Flow]] (forward-ref) · [[Contact Group Selection Flow]] (forward-ref) · [[Template Selection Flow]] (forward-ref).
- **Services exercised:** Contact Group → Templates → Commerce → Charging → Provisioning (delivery) → Access (PES).
- **Kafka events fired:** `commerce.service-order-created.v1` · `commerce.charging-debited.v1` (forward-ref) · `templates.template-used.v1` (forward-ref).

## Cross-journey relations

- **Depends on:** [[New Tenant Onboarding]] (tenant must have an Active Account + funded wallet + ≥ 1 Active Contract).
- **Triggers downstream:** Provisioning delivery pipeline (out-of-scope for this journey, lives in PRD-03/05).
- **Sibling journeys:** [[Wallet Transfer]] (alternative way the wallet topology changes).

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
