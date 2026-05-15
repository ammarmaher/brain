---
type: journey
journey-name: New Tenant Onboarding
crosses-pages: [organization-hierarchy, login, force-change-password, otp-challenge, org-settings, contracts]
prds-involved: []
created: 2026-05-15
---
*** Journey note — New Tenant Onboarding ***
*** Vault file: 16-Journeys/New Tenant Onboarding.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\journeys\new-tenant-onboarding\ ***
*** Created 2026-05-15 by Brain SK Phase 3B — User Journeys ***

# New Tenant Onboarding

> A Falcon admin creates a brand-new client tenant via Add Client; Commerce fans out the Kafka cascade; the Account Owner receives credentials, first-logs-in (forced password change + OTP), transitions Pending → Active, then creates the first Contract that activates the Account and funds the Master Wallet; the AO sends the first Send Transaction against the nearest-expiring Active contract. Journey ends with a fully operational tenant that has executed real business work.

## Entry point in Brain Outputs

- [Journey README](../../../Brain%20Outputs/understanding/journeys/new-tenant-onboarding/README.md) — folder index + cross-link map
- [Journey PLAYBOOK](../../../Brain%20Outputs/understanding/journeys/new-tenant-onboarding/PLAYBOOK.md) — full multi-page narrative

## Pages traversed (in order)

1. [[Organization Hierarchy]] — Falcon admin clicks Add Client (5-step wizard)
2. [[Login]] — `forward-ref (page not yet seeded)` — AO first-login entry
3. [[Force Change Password]] — `forward-ref (page not yet seeded)` — Pending users must change password
4. [[OTP Challenge]] — `forward-ref (page not yet seeded)` — 60-sec challenge per BR-UM-26
5. [[Org Settings]] — `forward-ref (page not yet seeded)` — AO inspects post-login
6. [[Contracts]] — `forward-ref (page not yet seeded)` — AO creates first contract
7. [[Send Transaction]] — `forward-ref (page not yet seeded)` — AO posts first campaign

## Flow playbooks used (in order)

- [[Add Client Flow]] — built
- [[Add User Flow]] — built (sibling, triggered via Kafka by Add Client Step 5)
- [[First Login Flow]] — `forward-ref (flow not yet seeded)`
- [[Add Contract Flow]] — `forward-ref (flow not yet seeded)`
- [[Send Transaction Flow]] — `forward-ref (flow not yet seeded)`

## Kafka events fired

- `commerce.user-creation-requested.v1` — Commerce → Identity (after Add Client Step 5 Submit)
- `commerce.wallet-configured.v1` — Commerce → Charging (Master Wallet topology materialized)
- `commerce.identity-settings-sync.v1` — Commerce → Identity (tenant settings)
- `commerce.tenant-ip-allowlist-changed.v1` — Commerce → Core Gateway (Redis cache refresh)
- `identity.user-events.v1` — Identity → Access PES + Templates (post-AO-creation)
- `commerce.contract-activated.v1` — Commerce → Charging + Provisioning (first contract activates)
- `commerce.service-order-created.v1` — Commerce → Provisioning (Apps/CommChannels go Active)

## Hub backlinks

[[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[16-Journeys/README|16-Journeys]]

## Tags

#type/journey #security
