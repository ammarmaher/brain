*** Journey note — First Login ***
*** Vault file: 16-Journeys/First Login.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\journeys\first-login\ ***
*** Created 2026-05-15 by Brain SK Phase 3B — User Journeys ***

# First Login

> A user in Pending status enters the platform for the first time. Core Gateway enforces IP allowlist; Identity detects Pending and forces a password change with complexity per `PasswordSecurityLevel`; an OTP challenge gates session creation (60-sec, length per `OtpAppSetting`); on success the user transitions Pending → Active. 3 wrong passwords or 3 wrong OTPs → user Locked (admin unlock required). Sub-journey reused by every newly-created user.

## Entry point in Brain Outputs

- [Journey README](../../../Brain%20Outputs/understanding/journeys/first-login/README.md)
- [Journey PLAYBOOK](../../../Brain%20Outputs/understanding/journeys/first-login/PLAYBOOK.md)

## Pages traversed (in order)

1. [[Login]] — `forward-ref (page not yet seeded)` — username + password entry
2. [[Force Change Password]] — `forward-ref (page not yet seeded)` — required because user is Pending
3. [[OTP Challenge]] — `forward-ref (page not yet seeded)` — 4 or 6 digit code with 60-sec timer
4. Default home — role-dependent landing (no dedicated note)

## Flow playbooks used (in order)

- [[Add User Flow]] — built (sibling — creates the user; this journey is the activation gate)
- [[Add Client Flow]] — built (sibling — Step 5 creates the AO; this journey is what they do next)
- [[First Login Flow]] — `forward-ref (flow not yet seeded)`
- [[Login Flow]] — `forward-ref (flow not yet seeded)` — regular re-login (degenerate version of this journey)

## Kafka events fired

- `identity.user-status-changed.v1` — `forward-ref (event name TBC)` — Identity → Access PES + audit (Pending → Active or → Locked)
- `identity.session-created.v1` — `forward-ref (event name TBC)` — Identity → audit (on session issue)
- `identity.password-changed.v1` — `forward-ref (event name TBC)` — Identity → audit (force-change complete)
- `identity.user-locked.v1` — `forward-ref (event name TBC)` — Identity → admin + audit (3-wrong threshold)

## Hub backlinks

[[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[16-Journeys/README|16-Journeys]]
