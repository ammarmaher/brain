---
type: page
slug: login
prd-implements: [PRD-02]
has-flow-folder: false
status: stub
created: 2026-05-15
---
*** Page note — Login ***
*** Vault file: 10-Pages/Login.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\login\ ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***

# Login

> **STUB — seeded from PRD-02 OVERVIEW.** Brain Outputs is the source of truth — every link below points into the SoT tree. Detailed rule/component/V-rule content is intentionally absent until Light/Deep Learning runs.

## Entry point in Brain Outputs
- [PAGE_LEARNING.md](../../../Brain%20Outputs/understanding/pages/login/PAGE_LEARNING.md) — entry point + sources + expected components

## Implements PRDs
- [[02 User Management]] — **primary** (`latest-prd.md:67-74` Login screen behavior)

## Likely Falcon components
- [[Falcon Input]] · [[Falcon Password]] · [[Falcon Button]] · [[Falcon Form Field]] · [[Falcon Alert Dialog]]

## Backend services
- [[Identity Service]] — **primary**; owns `/auth/login`, IP allowlist enforcement, OTP issuance, lockout. Frontend NEVER calls Zitadel directly.

## Related V-rules
- _None promoted yet_ — V-rules will land in `VALIDATION_RULES.md` after Light/Deep Learning.

## Tags

#type/page #status/stub #prd/02 #service/identity #security

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Organization Hierarchy]] · [[Forgot Password]] · [[Change Password]]
