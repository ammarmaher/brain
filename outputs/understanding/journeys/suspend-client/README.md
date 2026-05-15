*** Journey — Suspend Client ***
*** Folder index · 2026-05-15 ***
*** Crosses: Organization Hierarchy · Status change · Wallet effects · User lockout · Notification ***

# Suspend Client — folder index

> A Falcon admin suspends an entire tenant Account. The status change cascades to wallet (frozen / no debit allowed), users (locked out at gateway), in-flight transactions (rejected), and notifications (delivered to the AO). Recovery requires an admin Unsuspend.

## Files in this folder

| File | Read when... |
|---|---|
| [README.md](README.md) | You want the journey index + actor + cross-link map (this file) |
| [PLAYBOOK.md](PLAYBOOK.md) | You need the full multi-page narrative with step-by-step, Kafka events, V-rules, error recovery |

## Journey at a glance

- **Trigger:** Falcon System Administrator opens the target Account on Organization Hierarchy → opens Settings tab → changes Account Status to `Suspended` (or via an admin action menu).
- **Outcome:** Tenant fully suspended — login blocked, charging frozen, in-flight transactions rejected, AO notified.
- **Pages traversed:** Organization Hierarchy → Org Settings (Status change) → notification delivery (out-of-page).
- **Flow playbooks used:** [[Edit Node Flow]] (built — covers rename; suspend lives next to it) · [[Suspend Account Flow]] (forward-ref).
- **Services exercised:** Commerce → Identity → Charging → Provisioning → Access (PES) → Core Gateway.
- **Kafka events fired:** `commerce.account-status-changed.v1` (forward-ref) · `commerce.tenant-ip-allowlist-changed.v1` (cache refresh) · `identity.user-status-changed.v1` (forward-ref).

## Cross-journey relations

- **Depends on:** Tenant exists ([[New Tenant Onboarding]] completed).
- **Triggers downstream:** Any in-flight [[Send Campaign]] fails. Any [[Wallet Transfer]] is rejected.
- **Recovery journey:** Unsuspend (admin reverses status; cascade replays in reverse).

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
