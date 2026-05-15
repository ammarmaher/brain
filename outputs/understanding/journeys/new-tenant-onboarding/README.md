*** Journey — New Tenant Onboarding ***
*** Folder index · 2026-05-15 ***
*** Crosses: Organization Hierarchy · Login · Org Settings · Contracts · Send Transaction ***

# New Tenant Onboarding — folder index

> The end-to-end birth of a Falcon tenant: a Falcon admin creates the Account, the Account Owner receives credentials, logs in for the first time (forced password change + OTP), creates the first Contract that activates the Account, and the tenant sends its first Send Transaction. This journey threads PRD-01 (Account Management) → PRD-02 (User Management) → PRD-03 (Contracts) → PRD-04/05 (Contact Groups + Templates) → the Charging cascade.

## Files in this folder

| File | Read when... |
|---|---|
| [README.md](README.md) | You want the journey index + actor + cross-link map (this file) |
| [PLAYBOOK.md](PLAYBOOK.md) | You need the full multi-page narrative with step-by-step, Kafka events, V-rules, error recovery |

## Journey at a glance

- **Trigger:** Falcon System Administrator (or Falcon Product) clicks "Add Client" on Organization Hierarchy.
- **Outcome:** Tenant has an `Active` Account, an `Active` AO user with a usable session, an `Active` Contract, a funded Master Wallet, and at least one successful Send Transaction.
- **Pages traversed:** Organization Hierarchy → Login → Force Change Password → OTP Challenge → Org Settings → Contracts → Send Transaction.
- **Flow playbooks used:** [[Add Client Flow]] (built) · [[First Login Flow]] (forward-ref) · [[Add Contract Flow]] (forward-ref) · [[Send Transaction Flow]] (forward-ref).
- **Services exercised:** Commerce → Identity → Charging → Provisioning → Access (PES) → both Gateways.
- **Kafka events fired:** `commerce.user-creation-requested.v1` · `commerce.wallet-configured.v1` · `commerce.identity-settings-sync.v1` · `commerce.tenant-ip-allowlist-changed.v1` · `commerce.contract-activated.v1` · `commerce.service-order-created.v1` · `identity.user-events.v1`.

## Cross-journey relations

- **Depends on:** Zitadel up · Kafka up · Identity/Commerce/Charging/Provisioning running.
- **Triggers downstream:** [[Send Campaign]] (any subsequent transaction) · [[Suspend Client]] (admin action against this tenant).
- **Forward-refs:** Several sub-flows are still single-file in Brain Outputs or not yet seeded — every wiki-link to a non-existent flow is marked `forward-ref (flow not yet seeded)` in the playbook.

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
