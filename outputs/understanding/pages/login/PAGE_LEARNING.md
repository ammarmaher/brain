*** Page Learning — Login ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/login/PAGE_LEARNING.md ***

# Login

> **STUB** — page discovered from PRD-02 OVERVIEW (`02-user-management/OVERVIEW.md:34`). Full page-learning artifacts (UI_UX_RULES, VALIDATION_RULES, API_RULES, BUSINESS_RULES, COMPONENT_USAGE_DECISIONS, PAGE_SCORECARD, etc.) will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-02 User Management
- PRD section reference: `Brain Outputs/prd/modules/02-user-management/OVERVIEW.md:34` (Main Screen #7) + `latest-prd.md:67-74` (Login screen behavior)

## Primary backend service
- Identity Service (`Brain Outputs/understanding/backend/identity/`) — owns full auth lifecycle; frontend NEVER calls Zitadel directly

## Expected Falcon components
- [[Falcon Input]] — username + password fields
- [[Falcon Password]] — password input with show/hide toggle
- [[Falcon Button]] — primary submit + secondary "Forgot Password"
- [[Falcon Form Field]] — field wrapper with label + error
- [[Falcon Alert Dialog]] — error / IP-blocked feedback

## Key flows on this page
- Submit username + password → POST `/auth/login` (Identity)
- First-login detection → redirect to Force-Change-Password
- IP allowlist enforcement (per AccountSettings) gates credentials check
- OTP challenge issuance when account requires 2FA
- Failed-attempts auto-lockout (Identity Service rule)
- "Forgot Password?" link → navigate to Forgot Password page

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Login]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Organization Hierarchy]] (sister page)
