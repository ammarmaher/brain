---
type: wave-4-plan
title: "Wave 4 — Page Mining Catch-Up: 13 Skeletal Pages → Full Folders"
created: 2026-05-17
order: PRD-coverage-driven (closes biggest PRD-to-page gap first)
owner: Adnan orchestrator → per-module Ammar agents
pattern: Add Client 22-file folder (the gold standard)
sources:
  - old-ui-dataset (9-file dossiers per page from origin/main)
  - prd/modules/<n>/ (OVERVIEW + BUSINESS_RULES + ENTITIES + WORKFLOWS + QUESTIONS + GAPS)
  - understanding/backend/<svc>/ (ENDPOINT_REGISTRY + DTO_DICTIONARY + VALIDATIONS + ERRORS)
  - understanding/pages/organization-hierarchy/Add Client/ (template to mirror)
---

# Wave 4 — Page Mining Catch-Up Plan

> **Template to follow:** `understanding/pages/organization-hierarchy/Add Client/` — the gold-standard 22-file folder. Every new page folder must produce the same shape.

## Target folder shape (per page)

```
understanding/pages/<page-name>/
  README.md                          ← entry point: folder index + per-task load order
  00-OVERVIEW.md                     ← purpose · actors · entry conditions · exit conditions
  01-PERMISSIONS.md                  ← PES keys per role per action (cite CODE + PRD)
  02-STEP_1_*.md or 02-SECTION_*.md  ← per wizard step or page section
  ...
  07-VALIDATIONS.md                  ← all V-rules with PRD line + backend attribute + FE directive
  08-BACKEND_API.md                  ← all endpoints called: method + path + request + response + errors
  09-COMPONENTS.md                   ← every Falcon component used + props + decision rationale
  10-KAFKA_SIDE_EFFECTS.md           ← Kafka events produced/consumed (or "none")
  11-STATE_TRANSITIONS.md            ← entity status FSM changes this page drives
  12-ERROR_STATES.md                 ← error UX mapping (FalconKeys.Error.* → UI message)
  13-GAPS_AND_DRIFTS.md              ← open gaps + PRD vs backend drift
  14-IMPLEMENTATION_CHECKLIST.md     ← FE + BE checklist item list
  PLAYBOOK.md                        ← full single-doc version (synthesizes all above)
```

Plus vault graph node: `C:\Falcon\Brain SK\_obsidian\10-Pages\<Page> Flow.md`

---

## Page 1: edit-user
**Priority rank:** 1 (PRD-02 V2 has 37 GAP-UM-* items; most complex open module)
**PRD:** `02-user-management/` — BR-UM-36..40 (edit profile / role / status / OTP flows)
**Old-UI source:** `host-shell/auth/00-README.md` (auth) + management-console/account-administration (user detail via org-hierarchy page). Edit user UI lives inside user-details-page in host-shell.
**Backend:** `identity/` — `PUT /api/user/{id}/profile` · `PUT /api/user/{id}/role` · `PUT /api/user/status` · `POST /api/user/me/verify-email` + resend + confirm · same for phone
**Key gaps to document:** GAP-UM-21 (admin-edit OTP path — Q-UM-13 OPEN) · GAP-UM-22 (reject simultaneous Email+Phone edit — BR-UM-21) · GAP-UM-23 (username immutable) · GAP-UM-24 (role edit limit re-check)
**Owner:** ammar-auth + ammar-web-platform-ui
**Destination:** `understanding/pages/edit-user/`

---

## Page 2: contracts-list
**Priority rank:** 2 (PRD-03 V2 — high business-team relevance)
**PRD:** `03-contract-packaging-charging-billing-management/` — list view + status lifecycle + AO/NA view-only
**Old-UI source:** `admin-console/contracts-cost-management/00-README.md` — mode-state machine (list/add/view/edit in one container); local `contracts-data-table` component (NOT `<falcon-table>` — local paginated + click-row + kebab)
**Backend:** Commerce `GET commerce/Contracts` · Charging `GET charging/Wallet/contract-balance-summaries`
**Key items:** no PES guards on route (relies on parent adminConsoleGuard only) · ContractStatus auto-transition logic · RemainingValue visibility rules per status per role
**Owner:** ammar-core-commerce
**Destination:** `understanding/pages/contracts-list/`

---

## Page 3: add-contract (4-step wizard)
**Priority rank:** 3
**PRD:** `03-contract-packaging-charging-billing-management/` — BR-CC-01..20 (creation rules) · 4-step structure: Info / Rate Card / Contract Details / Addons
**Old-UI source:** `admin-console/contracts-cost-management/` — `contracts-add-wizard/` (4-step DynamicStepperComponent) · `contracts-rate-card-section/` · `contracts-contract-details-section/` · `contracts-addons-section/`
**Backend:** Commerce `POST commerce/Contracts` with full `CreateContractRequest` (AccountId, ContractName, FarabiReferenceId, StartDate, EndDate, CommittedValue, Currency, Rates[], UnitConversions[], Quotas[], OverageRates[])
**Key items:** ~25 validation predicates · FarabiRefId ≤50 · startDate ≥today · expirationDate >startDate · valueSar >0 · ngModel + getters (NOT Reactive Forms in old-UI — document and flag as anti-pattern)
**Owner:** ammar-core-commerce
**Destination:** `understanding/pages/add-contract/`

---

## Page 4: edit-contract
**Priority rank:** 4
**PRD:** `03-contract-packaging-charging-billing-management/` — BR-CC-50..56 (status-aware field restrictions: Pending=full edit; Active/Expired=limited)
**Old-UI source:** `admin-console/contracts-cost-management/` — `contracts-edit-contract/` (4-tab edit matching wizard steps) · same shared section components
**Backend:** Commerce `PUT commerce/Contracts/{id}` (status-constrained; backend enforces per-field rules)
**Key items:** status-aware field restrictions (Active: cannot change startDate, valueSar; Expired: further restricted) · extension: re-uses same endpoint + status flips Expired→Active
**Owner:** ammar-core-commerce
**Destination:** `understanding/pages/edit-contract/`

---

## Page 5: wallets-and-balance-management
**Priority rank:** 5 (PRD-01 wallet section — critical for business discussions)
**PRD:** `01-account-management/` — BR-AM-27..38 (wallet topology + transfer matrix + nearest-expiring rule)
**Old-UI source:** `admin-console/wallet-balance-management/00-README.md` — 2 components (container 885 LOC + balance-transfer drawer 700 LOC); 3 HTTP endpoints; 4 PES checks; transfer path business rule machine; amount-cap rule; same-source/destination guard; 9 anti-patterns flagged in old-UI
**Backend:** Commerce `GET commerce/accounts/{id}/hierarchy` · Commerce `POST commerce/setting/wallets` · Charging `POST charging/wallet/transfer`
**Key items:** BalanceType × WalletType topology table · Master Wallet is abstract (aggregate, no physical row) · Transfer matrix (who can transfer what to what per role) · `balanceTransferLimitPct` cap · currency mismatch guard (F-014 in DECISION-PROTOCOL)
**Owner:** ammar-core-charging + ammar-core-commerce
**Destination:** `understanding/pages/wallets-and-balance-management/`

---

## Page 6: templates-list
**Priority rank:** 6 (PRD-05 — 75% unmined; high gap priority)
**PRD:** `05-templates/` — list + status lifecycle + Maker/Checker governance; PRD-05 only 25% mined so document knowns + flag unknowns
**Old-UI source:** Look in `admin-console/marketplace-applications/` (templates may be inside this feature) or a dedicated templates feature — scan during execution
**Backend:** `templates/` — currently only 3 endpoints (CommChannelConfig + UserCheckerLevels); Template CRUD NOT yet in public API (flagged in ENTITIES.md)
**Key gaps:** Template CRUD endpoints MISSING in backend (document as GAP-T-001 MISSING) · Maker/Checker workflow endpoints unclear · list pagination shape unknown
**Owner:** ammar-web-platform-ui (FE) + ammar-auth (if Identity checker-user resolution needed)
**Destination:** `understanding/pages/templates-list/`

---

## Page 7: create-template-whatsapp
**Priority rank:** 7
**PRD:** `05-templates/` — 2-step WhatsApp wizard: Basic Info / Message Structure; Maker submits, Checker approves; Meta approval flow
**Old-UI source:** Look in management-console for template creation wizard
**Backend:** Templates service — Template CRUD endpoints MISSING; document against PRD shape + flag as implementation gap
**Key items:** Template name rules (a-z/0-9/_ only, unique per WA Business Account + language) · TemplateVariable ↔ ContactGroupColumn linkage · TemplateButton kinds · Meta webhook update path for metaState
**Owner:** ammar-web-platform-ui
**Destination:** `understanding/pages/create-template-whatsapp/`

---

## Page 8: contact-groups-list
**Priority rank:** 8
**PRD:** `04-contact-group-management/` — list (own + shared tabs) + detail + edit + download; Falcon view-only
**Old-UI source:** `admin-console/contact-groups/00-README.md` — list + detail in admin-console; create wizard is in management-console only; 9 PES queries (8 contact-group + 1 viewShared); 6 HTTP endpoints; softDeleted visibility (Falcon sees all, clients see non-deleted)
**Backend:** Contact-group service `GET /api/contact-groups` + detail + download endpoints
**Key items:** own-tab vs shared-tab routing · softDeleted visibility per usertype · share-policy multiselect (Identity user-picker `identity/user`) · download (original + validated file types)
**Owner:** ammar-core-commerce (for node context) + gsd-domain-researcher (for contact-group business rules)
**Destination:** `understanding/pages/contact-groups-list/`

---

## Page 9: create-contact-group
**Priority rank:** 9
**PRD:** `04-contact-group-management/` — upload flow: file upload (csv/xls/xlsx ≤N MB) → column configuration → preview → commit; Client usertype only (AO/NA/NU)
**Old-UI source:** management-console (not admin-console) — account-administration feature hosts the create wizard
**Backend:** Contact-group service `POST /api/contact-groups/upload` (pre-signed S3 URL) → `POST /api/contact-groups/commit`; column validation rules
**Key items:** UploadSession lifecycle (Init → Complete → Committed/Abandoned) · column name rules (BR-CGM-06: EN letters, no numbers/special, spaces→_, ≤20, unique) · header detection · preview rows
**Owner:** ammar-web-platform-ui
**Destination:** `understanding/pages/create-contact-group/`

---

## Page 10: login
**Priority rank:** 10
**PRD:** `02-user-management/` — BR-UM-22..27 (First Login + Regular Login + OTP + lockout)
**Old-UI source:** `host-shell/auth/00-README.md` — 5 components in LoginLayout shell; AuthFlowStateService (sessionStorage); 7 Identity endpoints; PrimeNG InputOtp (anti-pattern to replace); SCSS (anti-pattern to replace)
**Backend:** Identity `POST /api/auth/login` → LoginStepResponse stages
**Key items:** IpAllowlistPreProcessor runs BEFORE credentials (BR-UM-24) · OTP 60s expiry + resend · 3-wrong-login lockout (Zitadel policy + webhook) · eAuthenticationStage state machine · AuthFlowStateService cross-screen state
**Owner:** ammar-auth
**Destination:** `understanding/pages/login/`

---

## Page 11: forgot-password
**Priority rank:** 11
**PRD:** `02-user-management/` — BR-UM-30..33 (Active-only, 3-step: username+phone → OTP → new password; generic mismatch alert; silent wrong-OTP)
**Old-UI source:** `host-shell/auth/` — `forgot-password-flow/` (3-step flow component) · 3 Identity endpoints
**Backend:** Identity `POST /api/auth/forgot-password` → `POST /api/auth/verify-otp` → `POST /api/auth/forgot-password/set-password`
**Key items:** Active-only gate (Pending → alert "please login first") · generic mismatch alert (never reveal which field was wrong) · silent wrong-OTP (no lockout for forgot-password per PRD — Q-UM-01 open)
**Owner:** ammar-auth
**Destination:** `understanding/pages/forgot-password/`

---

## Page 12: change-password
**Priority rank:** 12
**PRD:** `02-user-management/` — BR-UM-34/35 (current + new + confirm; force-logout all sessions on success)
**Old-UI source:** `host-shell/auth/` — `change-password/` component · 1 Identity endpoint
**Backend:** Identity `PUT /api/user/change-password` (ChangePasswordRequest) → "Revokes all sessions on success"
**Key items:** changePasswordGuard protects route · force-logout after success (BR-UM-35) · also used for first-login forced change (first-login path vs regular change path — same component, different endpoint branch)
**Owner:** ammar-auth
**Destination:** `understanding/pages/change-password/`

---

## Page 13: my-profile
**Priority rank:** 13 (lowest — self-edit profile, simplest scope)
**PRD:** `02-user-management/` — BR-UM-41 (edit own profile: excludes Role/Status/PermissionGroup) · BR-UM-36 (OTP for email/phone change)
**Old-UI source:** management-console/account-administration or host-shell — user-details-page has a my-profile path
**Backend:** Identity `PUT /api/user/profile` (self-edit, no {id} param) · `POST /api/user/me/verify-email` + resend + confirm · same for phone
**Key items:** excluded fields per BR-UM-41 · OTP gating on email/phone change (same /me/ endpoints as Admin edit, but self-initiated) · profile picture upload (BR-UM-16 optional)
**Owner:** ammar-auth + ammar-web-platform-ui
**Destination:** `understanding/pages/my-profile/`

---

## Execution instructions for Wave 4 agent

1. Work pages in priority order (1 → 13). Do not skip gaps — halt-and-flag and continue to next page.
2. For each page, read the old-UI README first (file path listed above), then the PRD module files, then the backend dossier.
3. Generate ALL files in the folder shape shown at the top. If a section has no content (e.g., no Kafka events), still write the file with "No Kafka side effects for this page."
4. Source-prefix every claim. [CODE] for file:line from old-UI or source code. [PRD] for PRD line citations. [BRAIN-OUT] for dossier citations. [INFERRED] for reasoning.
5. Halt-and-flag at ambiguity ≥7 → write to `_pending-questions/wave-4-<page>-<fork>.md` → continue to next page.
6. After all 13 pages: write `WAVE-4-COMPLETE.md` in `reports/night-shift/2026-05-17/` with per-page file counts + halts raised.
7. Generate Obsidian graph node at `Brain SK/_obsidian/10-Pages/<Page Name> Flow.md` for each page.
8. Add row to `Brain SK/_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md` flow-playbooks table for each new page.

---

## Halt precedents already known (do not halt, apply rule)

| Situation | Rule | Source |
|---|---|---|
| Old-UI uses SCSS | Replace with Tailwind in recommendations | F-017 |
| Old-UI uses `*ngIf`/`*ngFor` | Replace with `@if`/`@for` | F-018 |
| Old-UI uses PrimeNG component | Replace with Falcon UI Core equivalent | F-016 |
| Old-UI uses ngModel not Reactive Forms | Flag as anti-pattern, recommend Reactive Forms | F-022 |
| PRD label ≠ backend enum code | Display PRD label, submit backend code | F-002 |
| PRD cap < backend cap | FE enforces tighter | F-001 |
| Q-UM-13 (admin OTP path unclear) | Halt + write pending-question wave-4-edit-user-Q-UM-13.md | F-010 |
| Template CRUD endpoints MISSING | Document as GAP, continue | F-019 |
