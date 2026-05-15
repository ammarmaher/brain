*** Journey — First Login ***
*** Folder index · 2026-05-15 ***
*** Crosses: Login · Force Change Password · OTP Challenge · Pending → Active ***

# First Login — folder index

> A user in `Pending` status enters the platform for the first time. IP allowlist is enforced at the gateway, the password security level decides complexity, an OTP challenge gates session creation, and on success the user transitions `Pending → Active`. This is a sub-journey reused by [[New Tenant Onboarding]] (for the AO) and triggered every time [[Add User Flow]] completes.

## Files in this folder

| File | Read when... |
|---|---|
| [README.md](README.md) | You want the journey index + actor + cross-link map (this file) |
| [PLAYBOOK.md](PLAYBOOK.md) | You need the full multi-page narrative with step-by-step, Kafka events, V-rules, error recovery |

## Journey at a glance

- **Trigger:** A user in `Pending` status (created via Add Client Step 5 or Add User) opens the Login page and enters their credentials.
- **Outcome:** User session created; user transitions `Pending → Active`; default home page loads.
- **Pages traversed:** Login → Force Change Password → OTP Challenge → default home.
- **Flow playbooks used:** [[Add User Flow]] (sibling — built; first-login is the activation gate) · [[First Login Flow]] (forward-ref).
- **Services exercised:** Identity (primary) → Access PES → Commerce (read tenant settings) → Core Gateway (IP allowlist).
- **Kafka events fired:** `identity.user-status-changed.v1` (forward-ref) · `identity.session-created.v1` (forward-ref).

## Cross-journey relations

- **Depends on:** [[Add User Flow]] or [[Add Client Flow]] Step 5 completed. Credentials delivered. User in `Pending`.
- **Triggers downstream:** Any subsequent journey for that user — first session is the gate.
- **Sibling:** Lockout path — 3 wrong passwords or 3 wrong OTPs → user `Locked`. Recovery via admin unlock.

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
