*** Journey note — Suspend Client ***
*** Vault file: 16-Journeys/Suspend Client.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\journeys\suspend-client\ ***
*** Created 2026-05-15 by Brain SK Phase 3B — User Journeys ***

# Suspend Client

> A Falcon admin suspends an entire tenant Account. The status change cascades: Identity locks users + invalidates sessions, Charging freezes the wallet topology, Provisioning rejects new service orders, Access PES returns Deny, Core Gateway flips its tenant-status cache. The AO is notified out-of-band. Recovery via admin Unsuspend.

## Entry point in Brain Outputs

- [Journey README](../../../Brain%20Outputs/understanding/journeys/suspend-client/README.md)
- [Journey PLAYBOOK](../../../Brain%20Outputs/understanding/journeys/suspend-client/PLAYBOOK.md)

## Pages traversed (in order)

1. [[Organization Hierarchy]] — Admin selects the target Account
2. [[Org Settings]] — `forward-ref (Settings tab editing for status)` — Admin sets Status to Suspended
3. Notification delivery — AO receives email / SMS (no dedicated page)
4. [[Login]] — `forward-ref (page not yet seeded)` — AO later sees "Account suspended" toast

## Flow playbooks used (in order)

- [[Edit Node Flow]] — built (sibling — covers rename; suspend lives next to it)
- [[Suspend Account Flow]] — `forward-ref (flow not yet seeded)`
- [[Unsuspend Account Flow]] — `forward-ref (flow not yet seeded)` — reverse journey

## Kafka events fired

- `commerce.account-status-changed.v1` — `forward-ref (event name TBC)` — Commerce → Identity + Charging + Provisioning + Access + Core Gateway
- `commerce.tenant-ip-allowlist-changed.v1` — Commerce → Core Gateway (cache refresh)
- `identity.user-status-changed.v1` — `forward-ref (event name TBC)` — Identity → Access PES (per user locked)
- `identity.session-invalidated.v1` — `forward-ref (event name TBC)` — Identity → audit (per session revoked)
- `provisioning.service-order-rejected.v1` — `forward-ref (event name TBC)` — Provisioning → audit (per in-flight rejected)

## Hub backlinks

[[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[16-Journeys/README|16-Journeys]]
