---
title: "Falcon Management-Console Port — Specification & Night-Shift Execution Plan"
subtitle: "Copying admin-console capabilities to management-console with full user-type & status awareness"
version: "v1.0"
date: "2026-05-18"
author: "Adnan (Jakco) — Falcon Platform Orchestrator"
audience: "Engineering · Architecture · QA · Product"
status: "PLAN-ONLY · No code changes applied"
brain-grounded: "Authority Dataset · Brain Outputs · Brain SK · Falcon Wiki · Memory"
---

# Falcon Management-Console Port

## Specification & Night-Shift Execution Plan

**Document version:** v1.0
**Date:** 2026-05-18
**Author:** Adnan (Jakco) — Falcon Platform Orchestrator
**Audience:** Engineering · Architecture · QA · Product
**Status:** **PLAN-ONLY — no code changes applied.** This document is the contract that night-shift execution will follow.

---

## How to read this document

1. **Sections 1–4** are the *strategic context*: why this port, who it serves, what already exists.
2. **Sections 5–8** are the *authority model*: the 3 client roles, the user-status state machine, the account lifecycle, and the per-feature parity matrix. **These sections govern every decision about what to move and what NOT to move.**
3. **Sections 9–14** are the *per-feature recipes*: organization-hierarchy, comms-hub, marketplace-applications, contact-groups, wallet-balance-management, contracts-cost-management.
4. **Sections 15–18** are *cross-cutting concerns*: validation rules, non-PES gates, error handling, pitfalls.
5. **Section 19** is the *night-shift execution plan* — **17 numbered waves** with explicit Definition-of-Done per wave.
6. **Appendices** carry raw lookups: PES key inventory, V-rule index, error catalog, test users.

Every Falcon-specific fact carries a source prefix per the brain-grounding protocol:

- `[CODE]` — read directly from source code with file:line.
- `[BRAIN-OUT]` — read from the authority dataset / understanding folders.
- `[VAULT]` — read from `falcon-wiki/` Obsidian SoT vault.
- `[BRAIN-SK]` — read from `Brain SK/_obsidian/` graph vault.
- `[MEMORY]` — read from agent shared memory entries.
- `[INFERRED]` — author's reasoning (flagged so a reader can sanity-check).

---

## 1. Executive Summary

### 1.1 What the user asked for

> "Copy what we do [in admin-console] and paste it to the management-console. Apply the validations for each thing. We are using handling [permissions/gating] with different user types — the client has multiple status types of user. Cover all scenarios, all areas, all code, what should and shouldn't move. Then create a wave-based plan for night-shift execution."

### 1.2 The shape of the answer

| Question | Answer |
|---|---|
| What gets copied? | The **organization-hierarchy** page (tree + 4 tabs + drawers + Add User wizard), the **wallet** view + transfer, the **contracts** view-only surface, **marketplace-applications**, and parity for **comms-hub** (already half-ported). |
| What never gets copied? | The **5-step Add Client wizard** (clients don't create clients — authority boundary). The **Master Wallet card** + **cross-account tree picker** + **wallet-strategy edit** (Falcon-only). The full **Contract Create/Edit wizard** + **DoPayment matrix authoring** (Falcon-only). The **testing-charging** feature entirely (mutates real OCS state). The **synthetic Falcon root** node in the tree. The `EditPriceType` / `EditPriceValue` / `Visibility` row actions on service tables. |
| Who is the user? | Three `acc-*` roles: **acc-owner** (full), **acc-admin** (org + users + contact-groups), **acc-user** (contact-groups only). Each role has explicit-deny entries in the PES catalog — the UI must hide actions that are explicit-deny, not merely silent-deny. |
| What user statuses matter? | Five user statuses: **Pending** (first-login forced password change), **Active** (full operations), **Suspended** (admin-disabled), **Locked** (3+ failed attempts), **Deleted** (soft-deleted, excluded from quota). HTTP responses 401/403/423 route flow control; never display error codes — display `errorMessages[0]`. |
| Why is this complex? | The Falcon copy-recipe is **12 steps**. Each step has a citation in the authority dataset. Mechanical copy without re-deriving session-type / node-type / tab-visibility / composite gates ships broken UI. The biggest risk is silently breaking a cross-field validator because an admin-only state variable (`isFalconUser`, `isFalconNode`) no longer exists on mgmt. |
| How is it shipped? | **17 waves** over the night-shift cadence, each wave atomic, each wave verified against the per-role capability table at `Brain Outputs/datasets/authority-dataset/05-capability-maps/`. PES gate is **already runtime-verified 21/21 PASS** (2026-05-16). FE-level rendering verification is the last wave. |

### 1.3 The non-negotiables (read these before any work starts)

1. **Source prefix every Falcon fact.** Unprefixed claims are convention violations.
2. **Brain Outputs is the source of truth.** Flow playbooks are the implementation spec.
3. **Mechanical copy without re-derivation is a defect.** Re-derive every non-PES gate in mgmt-console terms.
4. **Explicit deny is a security boundary.** The UI MUST NOT surface an action that is explicit-deny — it is not a "soft hide", it is "the user cannot do this by design".
5. **Add Client wizard is Falcon-only.** Never port. Clients don't create clients.
6. **The 21/21 PES verification is backend-only.** FE route guards + Falcon UI Core rendering are not yet runtime-verified; Wave 17 closes that.
7. **No SCSS. No PrimeNG.** Tailwind v4 utilities only; Falcon UI Core (`<falcon-*>`) is the only UI kit.
8. **HTTP status routes flow; never display error codes.** Display `errorMessages[0]` (already localized). Log error codes for instrumentation only.

---

## 2. Strategic Context

### 2.1 The Falcon platform — the 30-second model

```
Browser ─► Angular Web Platform
            ├── host-shell  (port 4200) — auth, layout, sidebar
            ├── admin-console (route /admin-console)   — for Falcon staff (sys-* roles)
            └── management-console (route /management-console) — for Clients (acc-* roles)

Client users  ──► Core Gateway   (port 7038) ──► Backend services
Falcon users  ──► System Gateway (port 7256) ──► Backend services

Backend services (each .NET 10):
  Commerce (7045)   ↔ Kafka ↔ Charging (7224)
  Commerce (7045)   ↔ Kafka ↔ Provisioning (7163)
  Commerce (7045)   ↔ Kafka ↔ Identity (8080)

Identity (Zitadel-backed) — owns user lifecycle (NOT Commerce, NOT Zitadel directly).
PES (Permission Engineering System) — gateway-resident, evaluates `<resource>/<action>` rules.
```

`[VAULT] falcon-wiki/Home/Software-Architecture-Design/High-Level-Architecture.md` · `[BRAIN-OUT] Brain Outputs/datasets/authority-dataset/07-cross-cutting/session-shape.md`

### 2.2 The two consoles are not identical

- **admin-console** is the *control plane*: org tree across ALL clients, the 5-step Add Client wizard, full wallet/contract lifecycle, testing-charging diagnostic.
- **management-console** is the *tenant plane*: org tree scoped to ONE tenant, no Add Client (clients are onboarded by Falcon), view-only contracts, transfer-only wallet, no master-wallet visibility.

This is **authority asymmetry by design**. The port is not "make mgmt look like admin"; the port is "make mgmt deliver the tenant-scoped subset, with the Falcon-only sub-features cleanly absent and the validation logic re-derived in mgmt terms."

### 2.3 What's already verified

| Layer | Status | Evidence |
|---|---|---|
| Backend PES gate (3 acc-* users × 7 PES queries) | **21/21 RUNTIME-VERIFIED PASS** (2026-05-16) | `[BRAIN-OUT] authority-dataset/_runtime-verification/comms-hub-2026-05-16.md` |
| FE route guard runtime behavior | NOT verified | Blocked on workspace Stencil/Angular compile errors (40+) |
| 6 canonical roles + their PES rules | CODE-VERIFIED | `[CODE] BuiltInRoleCatalog.cs:79-290` |
| 47 PES key factories | CODE-VERIFIED | `[CODE] falcon-access.registry.ts:1-185` |
| Tenant-scoped p-rules template | CODE-VERIFIED | `[CODE] pes-account-role-rules.json:1-97` |

`[BRAIN-OUT] authority-dataset/VERIFICATION-STATUS.md`

---

## 3. The 7 Falcon Knowledge Stores — Where Truth Lives

This document is downstream of these 7 stores. Anything claimed here is traceable to one of them.

| # | Store | Path | Owns | Verification |
|---|---|---|---|---|
| 1 | Authority Dataset | `Brain Outputs/datasets/authority-dataset/` | Roles · PES keys · validation · drift · view-hide · port recipe · errors · pitfalls · trigger phrases | Mixed (see VERIFICATION-STATUS.md) |
| 2 | Brain Outputs · Understanding | `Brain Outputs/understanding/` | Per-page deep specs · per-service DTOs · 62 component dossiers · integration | Structurally maintained |
| 3 | Brain Skills | `brain-skills/` + `Brain SK/skills/` | Rule books: Angular · Tailwind · Nx · UI/UX · Business · PRD · PDF | Authoritative for the rule |
| 4 | Falcon Wiki (Obsidian SoT) | `falcon-wiki/` | Architecture · typed PRDs · pages · components · gaps · 100-Authority projections | Source-prefix enforced |
| 5 | Brain SK Obsidian | `Brain SK/_obsidian/` | 25 V-rules · 15 E-* entities · permissions matrices · pattern registries | Structurally maintained |
| 6 | PRD Modules | `Brain Outputs/prd/modules/` | Canonical PRD content per module + BR + Entities + Workflows + Questions | Drive-synced |
| 7 | Old-UI Dataset | `Brain Outputs/datasets/old-ui-dataset/` | Per-page 9-file dossiers from `origin/main` of falcon-web-platform-ui — proven feature inventory | Code-grounded |

`[BRAIN-OUT] authority-dataset/0-MASTER-INDEX.md`

---

## 4. Current State Inventory

### 4.1 Management-console — what's there today

`[CODE] apps/management-console/src/app/`

| Surface | Status | Citation |
|---|---|---|
| Root routes | 2 only — `/` + `/comm-mgmt` | `[CODE] app.routes.ts:1-26` |
| Features | **One only — `comms-hub`** (read-only list + DoPayment + Enable/Disable per row) | `[CODE] features/comms-hub/` |
| App config — default gateway | `Gateway.CoreGateway` | `[CODE] app.config.ts:57` |
| App config — `provideFalconValidations()` | **MISSING** (admin has it) | `[CODE] app.config.ts` (absent) |
| Zoneless change detection | ✓ wired | `[CODE] app.config.ts:31` |
| `provideShellEnvFromWindow()` | ✓ Wave 8 fallback | `[CODE] app.config.ts:49-56` |
| Session/Auth provider | Not wired in config (consumed in services via inject) | — |
| Shared libs imported | `@falcon` (FalconAccess, shellAccessGuard, HttpService, SessionProvider) + `@falcon/ui-core/angular` (Card, DataTable, Cell, StatusBadge) | `[CODE] comms-hub.component.ts` imports |
| Organization-hierarchy route | **ABSENT** | (no route, no folder) |
| Settings tab | **ABSENT** | (no route, no folder) |
| Wallet route | **ABSENT** | (no route, no folder) |
| Contracts route | **ABSENT** | (no route, no folder) |
| Marketplace-applications route | **ABSENT** | (no route, no folder) |
| Contact-groups route | **ABSENT** | (no route, no folder) |

**Verdict:** Management-console is a thin slice today. comms-hub is the only real feature. Everything else listed above is what this plan ports.

### 4.2 Admin-console — what we're porting FROM

`[CODE] apps/admin-console/src/app/features/org-hierarchy-page/` (Wave 7+ canonical implementation with 6-slice facade)

| Surface | Description | Citation |
|---|---|---|
| Page route | Lazy-loaded `/org-hierarchy-page` with `HierarchyPageStateService` provider | `[CODE] org-hierarchy-page.routes.ts:10-17` |
| State facade | `HierarchyPageStateService` + 6 domain slices (tree, node-drawer, add-user, settings, info-panel, users) | `[CODE] services/state/` |
| Tabs | 4 tabs: Hierarchy · Comm Channels · Apps · Settings | `[CODE] tab-components/` |
| Information panel | `<falcon-org-info-panel>` (nested inside Hierarchy tab) — calls `commerce/information` GET + PUT | `[CODE] hierarchy-tab/falcon-org-info-panel/` |
| Settings tab | `SettingsTabComponent` — calls `commerce/setting` GET + PUT | `[CODE] tab-components/settings-tab/` |
| Comm-channels tab | `CommChannelsTabComponent` — calls `commerce/Node/{id}/comm-channels/visible/details` | `[CODE] tab-components/comm-channels-tab/` |
| Apps tab | `AppsServicesTabComponent` — calls `commerce/Node/{id}/applications` | `[CODE] tab-components/apps-services-tab/` |
| Add Node drawer | Drawer mounted via `state.openAddSiblingDrawer()` | `[CODE] hierarchy-tab/falcon-org-node-drawer/` |
| Edit Node drawer | Same drawer, morphed via `state.morphDrawerToEditSibling()` | same |
| **Add Client wizard** | **5-step wizard — Falcon-only — never port** | `[CODE] wizard-components/add-client-wizard/` |
| Add User wizard | 3-step wizard (Personal · Role+Status · Permissions) | `[CODE] wizard-components/add-user-wizard/` |
| Tree component | `<app-organization-hierarchy-tree>` (shared lib, `mode="falcon-full"`) — already in shared libs | `[CODE] org-hierarchy-page-menu.component.html:62-71` |
| Users table | `users-table` slice; row action → drilldown to host-shell `/user-details/:id` | `[CODE] services/state/` + `org-hierarchy-page-menu.component.html:95` |
| PES keys used | 9 unique `FalconAccess.adminConsole.*` keys (see §9.4) | `[CODE]` grep |

**Verdict:** The admin-console org-hierarchy-page is the *donor template*. The plan extracts its 4-tab structure, drops Add Client, flips PES namespace, drops the synthetic Falcon root, and re-derives every composite gate.

### 4.3 Sibling surfaces — admin-console features beyond org-hierarchy

| Feature | Admin route | Port class | Citation |
|---|---|---|---|
| `comms-hub` | `/comm-mgmt` | Shared-with-Client enrichment | Already half-ported (mgmt has it) |
| `marketplace-applications` | `/marketplace-applications` | Shared-with-config-flip | Not yet ported |
| `wallet-balance-management` | `/wallet-balance-management` | Falcon-mostly (drop Master Wallet + cross-account picker) | Not yet ported |
| `contracts-cost-management` | `/contracts-cost-management` | Falcon-mostly (mgmt is view-only acc-owner) | Not yet ported |
| `contact-groups` | `/contact-groups` (read-only on admin) | Client-only authoring (5-step wizard) — direction is reversed | Mgmt needs full CRUD |
| `testing-charging` | `/testing-charging` | **Falcon-only — never port** (security boundary) | n/a |

`[BRAIN-OUT] authority-dataset/04-feature-parity-matrix/MATRIX.md`

---

## 5. The 3 acc-* Client User Roles

> The single biggest determinant of "what to show and what to hide" is which of these three roles is logged in.

### 5.1 Role identity card

| Role | One-line | Test user | Tenant |
|---|---|---|---|
| **acc-owner** | Tenant top admin — full mgmt-console access | `accowner` / `Admin@1234` | `test-tenant-001` |
| **acc-admin** | Tenant org admin — hierarchy + users + contact-groups | `accadmin` / `Admin@1234` | `test-tenant-001` |
| **acc-user** | Normal user — contact-groups only | `accuser` / `Admin@1234` | `test-tenant-001` |

`[BRAIN-OUT] authority-dataset/07-cross-cutting/test-users.md` · all three users seeded with phone numbers for OTP testing.

### 5.2 Per-role landing verdict — the 7 features

| Feature | acc-owner | acc-admin | acc-user |
|---|---|---|---|
| organization-hierarchy | ✅ lands + sees Settings + CommChannels + Apps tabs | ✅ lands + sees Settings (org-level) tab; ❌ no CommChannels/Apps | ❌ explicit deny on `acc.org-hierarchy.view` |
| comms-hub | ✅ lands + sees rows + can DoPayment / Enable / Disable | ❌ explicit deny on `acc.services.view` — empty page | ❌ silent deny |
| marketplace-applications | ✅ lands + same row actions as comms-hub | ❌ explicit deny on `acc.services.view` | ❌ silent deny |
| contact-groups | ✅ full CRUD + share-any | ✅ full CRUD + share-any (own-only edit/delete) | ✅ full CRUD + share-own-only + **uniquely** sees Shared Groups tab |
| wallet-balance-management | ✅ view + transfer (own account only) | ❌ no rule (silent deny) — should not see in sidebar | ❌ no rule (silent deny) |
| contracts-cost-management | ✅ view-only | ❌ **explicit deny** on `acc.contract.view` | ❌ explicit deny |
| testing-charging | ❌ (this feature is admin-console only) | ❌ | ❌ |

`[BRAIN-OUT] authority-dataset/04-feature-parity-matrix/MATRIX.md:88-96` · `[CODE] pes-account-role-rules.json:1-97`

### 5.3 Per-role allow-list (the most important capabilities)

**acc-owner** can:
- `app.management-console.view` — enter mgmt portal
- `acc.org-hierarchy.view` — see the tree
- `acc.account.view` + `edit` — read/modify account root info
- `acc.organization.add` — create sub-nodes
- `acc.account-user.add` + `acc.org-user.add` — add users at root AND sub-node
- `acc.services.view` + `payment` + `disable` — full services control
- `acc.account-settings.view` + `acc.org-settings.view` — both settings scopes
- `acc.users.view` — list users
- `acc.account-profile.{view, edit}` — **only acc-owner can edit**
- `acc.account-password-security-level.{view, edit}` — **only acc-owner**
- `acc.account-allowed-ips.{view, edit}` — **only acc-owner**
- `acc.account-quota.{view, edit}` — **only acc-owner**
- `acc.contract.view` — **only acc-owner** sees contracts
- `acc.contact-group.{view, create, download, download-original, share}` + expression-gated edit/delete (own-only)

`[CODE] BuiltInRoleCatalog.cs:179-209` · `[BRAIN-OUT] 05-capability-maps/acc-owner.capability.md`

**acc-admin** can:
- `app.management-console.view`
- `acc.org-hierarchy.view`
- `acc.account.view` + `edit`
- `acc.organization.add`
- `acc.org-user.add` (**not** `acc.account-user.add` — cannot add root-level users)
- `acc.account-settings.view` + `acc.org-settings.view` (view only — cannot edit password/IPs/quota)
- `acc.users.view`
- `acc.contact-group.{view, create, share, download, download-original}` + own-only edit/delete
- `user.role.other / change-acc-admin-to-{admin,user}` — side-grade or demote
- `user.role.other / change-acc-user-to-{admin,user}` — promote/hold

`[CODE] BuiltInRoleCatalog.cs:219-247`

**acc-user** can:
- `app.management-console.view`
- `acc.contact-group.view` — land on contact-groups page
- `acc.contact-group.create`
- `acc.contact-group.edit` (own-only via expression `r.obj.createdby == r.sub.userid`)
- `acc.contact-group.delete` (own-only)
- `acc.contact-group.share` (own-only — **tighter than acc-owner/admin**)
- `acc.contact-group.download` + `download-original`
- `acc.contact-group.view-shared` — **UNIQUE to acc-user** (sees groups others shared)
- `user.role.self / set-acc-user` — self-confirm own role

`[CODE] BuiltInRoleCatalog.cs:257-288`

### 5.4 Per-role EXPLICIT DENY (UI MUST hide these — security boundary)

> **Explicit deny ≠ silent deny.** A silent deny means "no rule, default deny". An explicit deny is hardcoded `effect: deny` in `BuiltInRoleCatalog.cs`. The UI MUST NOT surface UI controls for explicitly denied actions. Failure to hide an explicit-deny action is a security defect, not a UX nit.

| Role | Explicit denies |
|---|---|
| **acc-owner** | `app.admin-console.view` only (1) — cannot land on admin-console |
| **acc-admin** | `app.admin-console.view`, `acc.services.{view, payment, disable}` (3), `acc.account-profile.edit`, `acc.account-password-security-level.{view, edit}`, `acc.account-allowed-ips.{view, edit}`, `acc.account-quota.{view, edit}`, `acc.contract.view` — **12 total** |
| **acc-user** | `app.admin-console.view`, `acc.org-hierarchy.view`, `acc.account.{view, edit}`, `acc.organization.{view, add}`, `acc.account-user.add`, `acc.org-user.add`, `acc.services.{view, payment, disable}`, `acc.account-settings.view`, `acc.org-settings.view`, `acc.users.view`, `acc.account-profile.{view, edit}`, `acc.account-password-security-level.{view, edit}`, `acc.account-allowed-ips.{view, edit}`, `acc.account-quota.{view, edit}`, `acc.contract.view` — **20+ total** |

`[CODE] BuiltInRoleCatalog.cs:180, 220-240, 258-280` · `[CODE] pes-account-role-rules.json:3, 35-55, 65-87`

### 5.5 Role-edit reach matrix

| Actor | Can promote/demote | Reach acc-owner? | Demote self? |
|---|---|---|---|
| acc-owner | acc-owner, acc-admin, acc-user | ✅ (only role that can) | ✅ (to admin/user) |
| acc-admin | acc-admin, acc-user | ❌ — explicitly barred | ✅ (to acc-user) |
| acc-user | (none) | ❌ | ❌ (cannot even self-promote) |

`[CODE] BuiltInRoleCatalog.cs:48-74`

**Porting implication:** The role-change dropdown in Edit User MUST be computed per this matrix. Backend rejects mismatched requests, but FE should not show what the user cannot do.

---

## 6. The User-Status State Machine

> Five user statuses govern login eligibility, UI visibility, and HTTP error mapping.

### 6.1 Status FSM

```
                    First-login (OTP + force-change-password)
        Pending(1) ───────────────────────────────────────────► Active(2)
                                                                    │
                                                                    │ admin action
                                                                    ▼
                                                              Suspended(3)
                                                                    │
                                                                    │ admin reactivation
                                                                    ▼
                                                                 Active(2)
                                                                    │
                                                                    │ 3+ failed logins/OTPs (auto)
                                                                    ▼
                                                                Locked(4)
                                                                    │
                                                                    │ admin manual unlock → Pending → re-Active
                                                                    │   OR direct Active per BR-UM-08
                                                                    ▼
                                                                 Active(2)
                                                                    │
                                                                    │ admin or self soft-delete
                                                                    ▼
                                                                Deleted(5)
                                                                    │
                                                                    │ Falcon-only restore
                                                                    ▼
                                                                 Active(2)
```

`[CODE] Identity Enums.cs:55-62` · `[BRAIN-OUT] prd/modules/02-user-management/BUSINESS_RULES.md` (BR-UM-06, 07, 08, 25, 27)

### 6.2 Per-status behavior

| Status | Login allowed? | HTTP on login | UI render | Contact-group share target? | Counts toward NormalUser quota? |
|---|---|---|---|---|---|
| Pending(1) | Routes to force-change-password screen | 200 with `{stage: 'PasswordChangeRequired'}` (or 403 `UserPending`) | Standard | No (filter excludes) | Yes |
| Active(2) | Yes | 200 with token | Standard | Yes | Yes |
| Suspended(3) | Blocked | 403 `UserSuspended` | "Contact administrator" screen, no retry | Yes (visual indicator) | Yes |
| Locked(4) | Blocked | 423 `UserLocked` | "Account locked" screen, no retry | Yes (visual indicator) | Yes |
| Deleted(5) | Blocked | 404 generic | "User not found" (no status leak) | No (filter excludes) | **No** (BR-UM-07 exemption) |

`[BRAIN-OUT] authority-dataset/13-error-catalog/CATALOG.md` + 423-status block.

### 6.3 Why this matters for the port

- The mgmt-console login flow MUST handle 401/403/423 per the above table. Display `errorMessages[0]` (already localized) — never display error codes.
- The **Users** table must show status badges per `[CODE] FalconAngularStatusBadgeComponent` accepting the 5 status enums.
- The **Add User** wizard must surface a status dropdown only with values per the FSM (cannot create a `Deleted` user).
- The **contact-group share dialog** filters users by `Status=2&3&4` (Active + Suspended + Locked) — Pending and Deleted are excluded.

`[BRAIN-OUT] authority-dataset/13-error-catalog/FE-CONTRACT.md`

---

## 7. The Account & Tenant Lifecycle

### 7.1 Account creation status (`eAccountCreationStatus`)

7-stage progression driven by the **Add Client wizard** (admin-console only):

| Stage | Number | Meaning |
|---|---|---|
| Pending | 1 | Account record created, no info populated |
| InfoCompleted | 2 | Step 1 done — Account name + classification + address captured |
| SettingsCompleted | 3 | Step 2 done — password policy + IP allowlist + account limits |
| ServicesConfigured | 4 | Step 3 done — per-channel visibility + pricing |
| AppsConfigured | 5 | Step 4 done — per-app visibility + pricing |
| OwnerCreated | 6 | Step 5 done — Account Owner user created (Pending → first-login flips to Active) |
| Completed | 7 | Account is live; Main node is active |

`[CODE] Commerce Enums.cs:43-52` · `[BRAIN-OUT] understanding/pages/organization-hierarchy/Add Client/00-OVERVIEW.md`

**Mgmt-console relevance:** Mgmt USER never sees this enum. The wizard is admin-only. But if mgmt UI ever shows account state, it should expect status `Completed(7)` for all visible accounts.

### 7.2 Post-creation account status

There is **no post-creation account-active/inactive enum**. Once `Completed(7)`, the account's Main node is operational. Tenant/account lifecycle is implicit through:

- **Service subscription status** (per service: `Active`, `Inactive`, `Expired`, `Disabled`)
- **Node hierarchy** (sub-node `Archive` is flagged as MISSING in Q-AM-18 / GAP-AM-29 — never expose in UI per copy playbook anti-patterns)

`[BRAIN-OUT] authority-dataset/02-statuses/_INDEX.md`

---

## 8. The Feature Parity Master Matrix

> The single highest-leverage view of "what moves and what doesn't".

### 8.1 Master classification

| Feature | Class | Admin route | Mgmt route (target) | Notes |
|---|---|---|---|---|
| organization-hierarchy | Shared with Falcon enrichment | `/organization-hierarchy` | `/organization-hierarchy` | Same shared tree component; admin adds Add Client wizard + synthetic Falcon root |
| comms-hub | Shared with Client enrichment | `/comm-mgmt` (flat) | `/comm-mgmt` + 3 stub children (`whatsapp-business`, `voice-service`, `ai`) | Mgmt list endpoint is `/visible/details` |
| marketplace-applications | Shared with config-flip | `/marketplace-applications` | `/marketplace-applications` | Admin enforces 4 in-component PES flags; mgmt uses route-level guard + backend `row.allowedActions` |
| contact-groups | Shared, asymmetric power | `/contact-groups` (read-only) | `/contact-groups` (full 5-step create wizard + share + delete + details) | Admin has NO create UI — every sys-* role is **deny** on create/edit/delete/share |
| wallet-balance-management | Falcon-mostly | `/wallet-balance-management` | `/wallet-balance-management` (view + transfer only) | Master Wallet + cross-account picker + wallet-strategy are Falcon-only |
| contracts-cost-management | Falcon-mostly | `/contracts-cost-management` (full lifecycle) | `/contracts-cost-management` (view-only, **only acc-owner** lands) | Strongest authority asymmetry — acc-admin + acc-user explicitly **deny** |
| testing-charging | Falcon-only | `/testing-charging` | — | Mutates real OCS state — security boundary forbids exposing to Client |

`[BRAIN-OUT] authority-dataset/04-feature-parity-matrix/MATRIX.md`

### 8.2 The asymmetry chart

```
                 admin-console (Falcon)              management-console (Client)
                 ─────────────────────               ─────────────────────────
organization-    ✓ tree + tabs                       ✓ tree + tabs (no Add Client wizard)
hierarchy        ✓ Add Client wizard                 ✓ Add Node + Add User
                 ✓ Add Node + Add User               ✗ no synthetic Falcon root

comms-hub        ✓ flat list                          ✓ nested list + 3 stub children
                                                      ✓ enriched DTO (icon/period/etc)

marketplace-     ✓ in-component PES flags             ✓ route-guard PES + backend rows
applications

contact-groups   👁  view-only                          ✓ full CRUD + 5-step wizard
                 ✓ download                            ✓ share with own-only on acc-user
                 ✗ create/edit/delete/share

wallet-balance-  ✓ Master Wallet                       👁  no Master Wallet
management       ✓ wallet-strategy edit                👁  view-only
                 ✓ cross-account transfer              ✓ transfer (Charging gateway)

contracts-cost-  ✓ full lifecycle                       👁  view-only (acc-owner only)
management       ✓ create / edit / pay                  ✗ acc-admin denied
                                                        ✗ acc-user denied

testing-charging ✓ full feature                         ✗ not present (security)
```

### 8.3 What is **Falcon-only** (zero acc-* equivalent — never port)

1. `testing-charging` — entire feature
2. `wallet-balance-management` — Master Wallet card + wallet-strategy view/edit (admin keeps cross-account tree picker; mgmt loses it)
3. The **5-step Add Client wizard** inside organization-hierarchy (mgmt has Add Node + Add User but no Add Client — clients don't create clients)
4. The **synthetic `FALCON_ROOT_NODE`** virtual root in the tree
5. The **`EditPriceType` / `EditPriceValue` / `Visibility` row actions** on service tables (no `acc.services.{edit-price-type, edit-price-value, visibility}` PES keys exist)
6. The **DoPayment matrix authoring** on Add Client steps 3+4

### 8.4 What is **Client-only** (zero sys-* equivalent — direction reverses)

1. `contact-groups` — create / edit / delete / share full UI (admin can view + download but explicitly cannot author)
2. The `acc.contact-group.view-shared` permission — only `acc-user` has it (Shared Groups tab)

---

## 9. The 12-Step Copy Recipe

> The canonical SOP for porting any `Shared-with-config-flip` feature. Run all 12 for those features; cherry-pick for `Falcon-mostly`.

### Step 1 — Copy the file tree

Copy `apps/admin-console/src/app/features/<feature>/` → `apps/management-console/src/app/features/<feature>/`. Paths vary by feature placement.

**Carries over verbatim:** primary component class, ng-template cell/editor renderers, insufficient-balance dialogs, tree-panel imports.
**Drops/rewrites:** SCSS files (Tailwind utilities only), PrimeNG components, admin-only @Input wiring.

### Step 2 — Rename selectors

Search `selector: 'admin-` and `selector: 'app-admin-` in the copied tree, replace with `selector: 'app-` or scope as needed.

### Step 3 — Namespace flip

`FalconAccess.adminConsole.X` → `FalconAccess.managementConsole.X`.

**Keys with NO mgmt counterpart — DROP entirely:**

| Admin key | Why dropped |
|---|---|
| `wallet.transfer` | No `acc.wallet.transfer` (gating done via server `canSave`) |
| `walletStrategy.{view, edit}` | No `acc.walletStrategy.*` |
| `masterWallet.view` | No `acc.masterWallet.*` |
| `account.add` | Add Client is Falcon-only |
| `rootPasswordSecurityLevel.*` | No `acc.rootPasswordSecurityLevel.*` (only `acc.account-password-security-level.*`) |
| `rootAllowedIps.*` | Same — only account-level on mgmt |
| `accountPasswordSecurityLevel.edit` for acc-admin | Explicit deny on mgmt namespace |

### Step 4 — Gateway flip

Mgmt `app.config.ts` already provides `Gateway.CoreGateway` as default. Drop explicit `useGateway(Gateway.SystemGateway)` overrides in copied services.

**Exceptions (preserve as explicit overrides):**
- `useGateway(Gateway.ChargingGateway)` on wallet transfer
- Identity calls (gateway-agnostic — stay as-is)

### Step 5 — DTO enrichment

Mgmt-side DTOs gain UI hint fields:
- `comms-hub` — `CommChannelServiceItem` gains `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`
- `marketplace-applications` — `MarketplaceApplicationItem` gains the same suite
- `contact-groups` — full upload-pipeline DTOs (`UploadInit`, `UploadComplete`, `Preview`, `Create`, etc.)

### Step 6 — Endpoint suffix

Mgmt-side list endpoints commonly append `/visible` or `/visible/details`:
- `comms-hub`: `commerce/Node/{id}/comm-channels` → `commerce/Node/{id}/comm-channels/visible/details`
- `marketplace-applications`: URL unchanged — only gateway differs

`/visible` filters by visibility = Show. `/details` adds payment/priority/pending-change metadata.

### Step 7 — Session-based account id

Mgmt-side account id comes from session:

```ts
const accountId = session.tenantId || session.client_id;
```

Admin pattern uses tree-picker selection. Drop the picker for mgmt.

### Step 8 — Remove Falcon-only sub-features

Drop per the table in §8.3.

### Step 9 — Add route with `data.access`

```ts
{
  path: 'comm-mgmt',
  component: CommsHubComponent,           // synchronous on mgmt (NOT loadComponent)
  canActivate: [shellAccessGuard],
  data: { access: FalconAccess.managementConsole.services.view() },
}
```

**Trap:** declaring `data.access` without wiring `canActivate: [shellAccessGuard]` makes the guard informational only — NOT enforced. Always pair them.

### Step 10 — Rewire validation

1. **Cross-field rules tied to admin-only state must be reviewed:**
   - Visibility ↔ Pricing conditional (V-service-visibility-pricing-required) — mgmt typically can't edit visibility; collapses to "read-only"
   - `walletStrategy === null` soft-gate on Contract create — drop if mgmt has no Contract create flow
   - `MaxNormalUserLimit` quota pre-flight badge — keep, verify count endpoint via Core Gateway

2. **Non-PES gates need re-derivation:**
   - **Session-type gates flip semantics.** `if (!isFalconUser) return;` is no-op on admin, blanket-deny on mgmt. Drop or flip the literal.
   - **Node-type gates may not exist.** `isFalconNode === true` never true on mgmt — `if (isFalconNode) earlyReturn` is dead code.
   - **Tab-visibility composites need new conditions.** `enabled: !isFalcon && isMain` collapses to `enabled: isMain`.
   - **Composite gates (`PES × node-type`) must be re-derived from the BR rule.**
   - **Server-driven row gates (`row.allowedActions`)** work as-is — backend computes per session.

3. **Validation drift items to preserve** (see §15.4):
   - FE enforces Username maxLength(30) even though backend allows 100
   - PasswordSecurityLevel vocabulary drift — display PRD labels, submit backend codes
   - AccountName letter-prefix regex is FE-only
   - HiddenProductMustNotHavePricing defensive clear
   - Contact-group share-mode mutex

### Step 11 — Reseed PES (if new `acc.*` resources introduced)

Only if the port introduces a new PES key (rare — most are already seeded):

1. `BuiltInRoleCatalog.cs` — add the `BuiltInPolicyRuleDefinition`
2. `pes-account-role-rules.json` — add the tenant-scoped `p`-rule seed
3. `seed-test-users.sh` — verify test-user PES link

Then restart Identity to pick up catalog changes.

### Step 12 — Verify against per-role capability table

Open `Brain Outputs/datasets/authority-dataset/05-capability-maps/<role>.capability.md` for each acc-* role and confirm:

1. **Landing:** role can/cannot hit the route per the table
2. **Visible actions:** row-menu / buttons / tabs match the per-role grid
3. **Backend rejections:** where PES says allow but `row.allowedActions` says no, action is hidden — verify with real user click

`[BRAIN-OUT] authority-dataset/11-copy-playbook/copy-admin-feature-to-mgmt.md`

---

## 10. Per-Feature Recipe — Organization Hierarchy

> The biggest port. Driven by the canonical `org-hierarchy-page` 6-slice facade in admin-console.

### 10.1 What ports

| Surface | Source | Target on mgmt |
|---|---|---|
| Page route | `apps/admin-console/.../org-hierarchy-page/` | `apps/management-console/.../org-hierarchy-page/` |
| State facade | `HierarchyPageStateService` + 6 slices | Same facade, slices renamed to mgmt-aware |
| Hierarchy tab | hierarchy-tab with chart + info-panel + users-table + node-drawer | Same, scoped to tenant |
| Tree component | `<app-organization-hierarchy-tree mode="falcon-full">` | `mode="client-full"` — drops synthetic Falcon root |
| Information panel | `<falcon-org-info-panel>` calling `commerce/information` | Same; AccountName + FinanceId fields hidden (Falcon-only edit) |
| Settings tab | `SettingsTabComponent` calling `commerce/setting` | Same; **mode-gated by node type** — root vs sub-node show different sub-cards |
| Comm Channels tab | `CommChannelsTabComponent` | Same; `/visible/details` endpoint suffix |
| Apps tab | `AppsServicesTabComponent` | Same; visibility/pricing rows view-only |
| Add Node drawer | `falcon-org-node-drawer` | Same; PES `acc.organization.add` gate |
| Edit Node drawer | Drawer morphed via `state.morphDrawerToEditSibling()` | Same |
| Add User wizard | 3-step wizard | Same; root vs sub-node Add gates on different PES keys |
| Users table | Row drilldown to host-shell `/user-details/:id` | Same; preserve `?includeDeleted=true` query for Falcon admins NOT relevant — mgmt users do NOT need soft-deleted visibility |

### 10.2 What does NOT port

| Surface | Why dropped |
|---|---|
| **5-step Add Client wizard** | Falcon-only — clients don't create clients |
| **Synthetic `FALCON_ROOT_NODE`** | Mgmt tree starts at tenant Main node |
| **Cross-account tree picker** | Mgmt is single-tenant; `session.tenantId` resolves account |
| **Add Client button** in tree action list | Tied to the wizard above |
| **AccountName + FinanceId edit** in Info panel | Falcon-only fields — display read-only on mgmt |
| **rootPasswordSecurityLevel / rootAllowedIps** settings cards | Only `account*` variants exist on mgmt |
| **IncludeDeleted** soft-delete visibility on users list | Falcon-only — see PR #40937 / WAVE B+E in admin-console |

### 10.3 PES namespace flip table

| Admin key | Mgmt key | Notes |
|---|---|---|
| `adminConsole.accountHierarchy.view()` | `managementConsole.accountHierarchy.view()` | Route gate |
| `adminConsole.account.add()` | **DROP** | Add Client Falcon-only |
| `adminConsole.organization.add()` | `managementConsole.organization.add()` | Add Node drawer |
| `adminConsole.accountUser.add()` | `managementConsole.accountUser.add()` | Add root-level user (acc-owner only) |
| `adminConsole.orgUser.add()` | `managementConsole.orgUser.add()` | Add sub-node user |
| `adminConsole.accountProfile.{view, edit}` | `managementConsole.accountProfile.{view, edit}` | Info panel edit (acc-owner only on edit) |
| `adminConsole.rootPasswordSecurityLevel.*` | **DROP** | No root-only PES on mgmt |
| `adminConsole.accountPasswordSecurityLevel.*` | `managementConsole.accountPasswordSecurityLevel.*` | Settings tab |
| `adminConsole.rootAllowedIps.*` | **DROP** | Same reason |
| `adminConsole.accountAllowedIps.*` | `managementConsole.accountAllowedIps.*` | Settings tab |
| `adminConsole.accountQuota.{view, edit}` | `managementConsole.accountQuota.{view, edit}` | Settings tab |
| `adminConsole.user.add()` | `managementConsole.user.add()` | Add User wizard root action |
| `adminConsole.userPermissionGroup.assign()` | `managementConsole.userPermissionGroup.assign()` | Add User wizard step 3 |
| `adminConsole.userProfilePicture.upload()` | `managementConsole.userProfilePicture.upload()` | Add User wizard step 1 |

### 10.4 Composite gates to re-derive

| Admin composite | What it does | Mgmt re-derivation |
|---|---|---|
| `canShowEditButton = mode === View && canShow() && canEditAccountProfile` | Info panel Edit button visibility | Same, with mgmt-namespace PES |
| `canEditSelectedSettings = canEditAccountQuota && (isRootSelection || isMainNodeSelection)` | Settings card edit gate | **Re-derive:** mgmt has no synthetic root, so `isRootSelection` semantics differ — `isRootSelection` becomes "tenant root node" not "Falcon synthetic root". Re-express in mgmt's terms. |
| `canAddClient = isRootSelected()` | Tree action — Add Client | **DROP** entirely |
| `canAddUser = wizardAccessFlags().canAddUser` | Wizard guard | Re-derive: at root → `canAddAccountUser` (acc-owner only); at sub-node → `canAddOrgUser` (acc-owner + acc-admin) |

`[BRAIN-OUT] authority-dataset/10-non-pes-gates-by-feature/MATRIX.md` §4

### 10.5 Tab visibility re-derivation

| Tab | Admin condition | Mgmt condition |
|---|---|---|
| hierarchy | `enabled: true` | `enabled: true` |
| settings | `enabled: true` (row-level gating) | `enabled: true` (root → account-settings PES; sub-node → org-settings PES) |
| comm-channels | `enabled: !isFalcon && isMain` | `enabled: isMain` (no synthetic Falcon on mgmt) — **AND `canViewServices`** (denies acc-admin) |
| apps-services | `enabled: !isFalcon && isMain` | `enabled: isMain` — **AND `canViewServices`** |

`[CODE] tabs-layout.component.ts:91-125` — admin reference

### 10.6 Validations to wire (V-rules apply)

From `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` §3.1 — org-hierarchy is the most validation-rich feature:

- **V-account-name-format-uniqueness** — N/A on mgmt (no Add Client wizard); but Info panel READS AccountName — display read-only
- **V-password-security-level-enum** — Settings tab dropdown (acc-owner only edits); show PRD labels Normal/Advanced, submit backend `Low/Medium/High/Strict`
- **V-account-ip-allowlist-enforcement** — Settings tab IP list editor (acc-owner only); + platform-cross-cut at login
- **V-account-limits-zero-means-no-limit** — Settings tab account-limits group (acc-owner only); 0 = no limit; render "No limit" when value === 0
- **V-service-visibility-pricing-required** — comm-channels-tab + apps-services-tab — but mgmt is VIEW-ONLY on these tabs, so validators are display-time only
- **V-user-first-last-name-letters-only** — Add User wizard Tab 1
- **V-username-format-uniqueness-immutable** — Add User wizard Tab 1; username write-only at create, immutable after
- **V-password-complexity-per-security-level** — auto-applies at first-login force-change-password
- **V-normal-user-limit-enforcement** — Add User wizard save; pre-flight via `GET /api/user/count?role=NormalUser` for badge
- **(platform) V-account-ip-allowlist-enforcement** — gateway pre-processor
- **(platform) V-login-lockout-3-wrong-attempts** — Identity policy

### 10.7 Per-role landing verdict (organization-hierarchy)

| Role | Land? | Tab visibility |
|---|---|---|
| acc-owner | ✅ | All 4 tabs visible |
| acc-admin | ✅ | hierarchy + settings only; commchannels + apps tabs HIDDEN |
| acc-user | ❌ explicit deny | n/a |

### 10.8 Port complexity & risks

**Complexity: ⭐⭐⭐⭐ (4 stars)** — Moderate-high. Lots of moving parts (4 tabs + drawers + wizard), but the donor template is well-organized in 6 slices.

**Risks:**
1. **Composite gate re-derivation** — `canEditSelectedSettings` semantics change because mgmt has no synthetic Falcon root
2. **PES namespace flip on ~14 keys** — easy to miss one
3. **Info panel's AccountName + FinanceId Falcon-only edit** — display read-only on mgmt
4. **Add User root vs sub-node gate** — `canAddAccountUser` vs `canAddOrgUser` per node selection

**Open questions:** none beyond Q-AM-18 (Move-node and Archive — both MISSING; do NOT expose in either UI).

---

## 11. Per-Feature Recipe — Comms-Hub

> Already half-ported. Wave 17 (2026-05-18) integrated CommChannels + Apps tabs to real backend. This recipe consolidates what remains.

### 11.1 Status today

- Mgmt route `/comm-mgmt` exists, real component, wired
- `shellAccessGuard` + `FalconAccess.managementConsole.services.view()` set
- 3 stub children (`whatsapp-business`, `voice-service`, `ai`) redirect `/not-found`
- DTO enrichment in place (`CommChannelServiceItem` with icon/period/etc)
- Endpoint uses `/visible/details` suffix

### 11.2 What remains

- Verify acc-admin lands → empty page (explicit deny on `acc.services.view`)
- Verify acc-user lands → empty page (silent deny)
- Confirm error-pipeline handles 422 `InsufficientBalance` + 422 `NoApplicableRate` per FE contract
- Confirm DoPayment dialog wired to charging service via Core Gateway
- Verify Wave 17 backend integration handles all 15 mutation endpoints from the integration plan

### 11.3 Port complexity & risks

**Complexity: ⭐⭐ (2 stars)** — Low. Most work done.

**Open verification:**
- Wave 17 runtime test as acc-owner, acc-admin, acc-user (BLOCKED on FE dev-server poisoning per VERIFICATION-STATUS.md)

---

## 12. Per-Feature Recipe — Marketplace Applications

> Twin of comms-hub. Identical port shape.

### 12.1 Recipe at a glance

| Step | Action |
|---|---|
| 1 | Copy `apps/admin-console/.../marketplace-applications/` → `apps/management-console/.../marketplace-applications/` |
| 2-3 | Drop the 4-key `resolveFlags({...})` on `sys.services.*`. Route-level `data.access` only. |
| 4 | `Gateway.SystemGateway` → `Gateway.CoreGateway` (default) |
| 5 | Replace `AppServiceItem` with `MarketplaceApplicationItem` — adds `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice` |
| 6 | List endpoint URL unchanged (`commerce/Node/{id}/applications`); only gateway differs |
| 7 | Drop `OrgHierarchyApiService.getRootNodes()` + `FALCON_ROOT_NODE`; use `session.tenantId ‖ session.client_id` |
| 8 | Drop EditPriceType / EditPriceValue / Visibility row actions + tree picker. Add card / list view-mode toggle persisted in `localStorage` (`marketplaceAppsViewMode`) |
| 9 | `component: MarketplaceApplicationsComponent` (sync), `data.access: FalconAccess.managementConsole.services.view()` |
| 10 | None — read-only / payment-only |
| 11 | No new resources |
| 12 | Same matrix as comms-hub (mirror feature) |

`[BRAIN-OUT] 04-feature-parity-matrix/marketplace-applications.compare.md`

### 12.2 Per-role landing verdict

| Role | Land? |
|---|---|
| acc-owner | ✅ + payment + disable |
| acc-admin | ❌ explicit deny on `acc.services.view` |
| acc-user | ❌ silent deny |

### 12.3 Port complexity

**Complexity: ⭐⭐ (2 stars)** — Low. Mirror of comms-hub.

---

## 13. Per-Feature Recipe — Contact Groups

> **Direction reverses.** Mgmt is the SUPERSET; admin is the read-only subset. Mgmt-console must gain the full 5-step wizard + share + delete + edit-in-place.

### 13.1 What ports

| Surface | Mgmt has it? | Notes |
|---|---|---|
| Parent shell route `/contact-groups` with tree + outlet | NEEDED | Nested 3-child structure: list / create / details |
| List page | NEEDED | 2 tabs: "My Groups" (all) + "Shared Groups" (acc-user only — `view-shared`) |
| 5-step Create wizard | NEEDED | UploadGroupDetailsStep · PreviewConfigureStep · ReviewCreateStep · ShareGroupStep (+ post-create) |
| S3 upload pipeline | NEEDED | `POST /uploads/init` → external `PUT` to S3 → `POST /uploads/{id}/complete` → `POST /uploads/{id}/preview` → `POST /contact-groups` create |
| Details view | NEEDED | Read-only display + edit toggle |
| Share dialog | NEEDED | Filters users by `Status=2&3&4` (Active+Suspended+Locked) |
| Delete | NEEDED | `DELETE /contact-groups/{id}` |
| Edit-in-place on details | NEEDED | Patch `name`, `sharePolicy`, `referenceId` |

### 13.2 PES — scope-parametrized factory (unique pattern)

The contact-group factory is `FalconAccess.contactGroup.<action>(scope: 'sys' | 'acc')` — resolves to `sys.contact-group/...` (admin) or `acc.contact-group/...` (mgmt).

`[CODE] falcon-access.registry.ts:13-25, 162-171`

### 13.3 Expression-gated permissions

- `edit` and `delete` are gated by `r.obj.createdby == r.sub.userid` (own-only) for acc-user
- Acc-owner + acc-admin can edit/delete any group (un-expressioned)
- Acc-user can share **own-only**; acc-owner + acc-admin can share any
- FE overlay: `session.identityUserId === row.createdByUserId` (NOT `subjectId` — different ID space)
- Backend enforces regardless — FE filter is defense-in-depth + UX

`[CODE] apps/admin-console/.../contact-groups/models/models.ts:42-45`

### 13.4 V-rules (5 direct + 2 platform)

- V-contact-group-name-required-format (mandatory, ≤50, matches NamePattern)
- V-contact-group-file-size-cap (≤ `MaxFileSizeMB` from `GET /upload-config`)
- V-contact-group-file-type-allowlist (CSV / XLS / XLSX per allowlist)
- V-contact-group-column-name-shape (EN-letters-only, ≤20, no dupes, spaces → `_`)
- V-contact-group-share-policy-mode-mutex (FE mutex prevents silent drop)

### 13.5 Per-role landing verdict

| Role | Land? | Capabilities |
|---|---|---|
| acc-owner | ✅ | full CRUD + share-any (own-only on edit/delete via expression for acc-user pattern, but here un-expressioned) |
| acc-admin | ✅ | full CRUD + share-any (own-only edit/delete via expression) |
| acc-user | ✅ | full CRUD + share-own-only + uniquely sees "Shared Groups" tab |

### 13.6 Port complexity

**Complexity: ⭐⭐⭐⭐⭐ (5 stars)** — Highest. 5-step wizard, S3 upload handshake, expression-gated permissions, scope-parametrized PES factory. Has an open bug on admin side (`sharePolicy: null` hardcoded — fix as part of port).

---

## 14. Per-Feature Recipe — Wallet & Contracts (the Falcon-mostly pair)

### 14.1 Wallet-balance-management

**What ports:**
- View wallet balances (per node — for mgmt, only own tenant)
- Transfer Balance dialog (acc-owner only; backend enforces)
- Settings card (wallet structure/distribution — view-only on mgmt; `canSave` from server determines disabled state)

**What does NOT port:**
- Master Wallet card (`sys.master-wallet` has no acc-* equivalent)
- Cross-account tree picker (mgmt is single-tenant)
- wallet-strategy edit (Falcon-only)

**PES keys:**
- Mgmt registry has NO wallet/walletStrategy/masterWallet entries today
- All gating delegated to backend's `canSave` field
- **RECOMMENDATION (registry gap):** add `managementConsole.wallet.{view, transfer}` to registry so FE has client-side gating, not just server-driven

**Gateway:**
- Transfer uses explicit `useGateway(Gateway.ChargingGateway)` — preserve override
- Other calls use default `Gateway.CoreGateway`

**Account ID resolution:**
- Mgmt MUST save to main account ID, not currently-selected tree node
- Copy `resolveSelectedAccountId()` helper

**Port complexity: ⭐⭐⭐⭐ (4 stars)** — Architectural cleanup (add missing PES keys) + Charging Gateway pattern to preserve.

### 14.2 Contracts-cost-management

**What ports:**
- View list of contracts (acc-owner only; backend returns empty for acc-admin/acc-user even if route opens)
- View details of a single contract

**What does NOT port:**
- 4-step Add Contract wizard (Falcon-only — vendors/Falcon own pricing)
- Edit Contract tab surface
- Contract-balance-summaries enrichment endpoint (balance already inline on mgmt response)

**PES keys:**
- Mgmt declares `managementConsole.contract.view()` on `data.access` but the original admin-console implementation lacks `canActivate: [shellAccessGuard]` on the route — **THIS IS A SECURITY GAP**
- **REQUIREMENT:** Add `shellAccessGuard` to mgmt route; verify `data.access` is enforced

**Endpoints:**
- `GET api/commerce/contracts` (note `api/` prefix + lowercase — gateway artifact, not service difference)
- No parallel balance enrichment call (admin only)

**Hardcoded `canEdit: false`** on every row at mgmt response handler.

**Architectural risk:** Original admin→mgmt port used cross-app relative imports (`../../../../../admin-console/...`). **Refactor into shared lib** as part of port.

**Per-role landing verdict:**
| Role | Land? | What they see |
|---|---|---|
| acc-owner | ✅ | View-only contract list |
| acc-admin | ❌ explicit deny on `acc.contract.view` — sidebar hidden; route must redirect |
| acc-user | ❌ explicit deny — sidebar hidden; route must redirect |

**Port complexity: ⭐⭐⭐⭐ (4 stars)** — Architectural cleanup + missing route guard + cross-app imports to extract.

`[BRAIN-OUT] 04-feature-parity-matrix/contracts-cost-management.compare.md` + sister wallet compare

---

## 15. Validation Matrix — Which V-Rules Apply

> 25 V-rules in the platform. The port must wire each one in the right form/field/section.

### 15.1 V-rules matrix (collapsed — only mgmt-facing features shown)

| V-rule | OH | CH | MA | CG | WB | CC |
|---|---|---|---|---|---|---|
| V-account-ip-allowlist-enforcement | ✅ (platform) | ✅ | ✅ | ✅ | ✅ | ✅ |
| V-account-limits-zero-means-no-limit | ✅ (Settings tab) | — | — | — | 📝 (read) | — |
| V-account-name-format-uniqueness | 📝 (Info read-only) | — | — | — | — | — |
| V-charging-insufficient-balance | 📝 | ✅ (DoPayment) | ✅ (DoPayment) | — | ✅ | 📝 |
| V-charging-no-applicable-rate | — | ✅ | ✅ | — | — | 📝 |
| V-charging-transfer-source-destination | — | — | — | — | ✅ | — |
| V-contact-group-column-name-shape | — | — | — | ✅ | — | — |
| V-contact-group-file-size-cap | — | — | — | ✅ | — | — |
| V-contact-group-file-type-allowlist | — | — | — | ✅ | — | — |
| V-contact-group-name-required-format | — | — | — | ✅ | — | — |
| V-contact-group-share-policy-mode-mutex | — | — | — | ✅ | — | — |
| V-contract-committed-value-positive | — | — | — | — | — | 📝 (view) |
| V-contract-currency-enum | — | — | — | — | 📝 (read) | 📝 (view) |
| V-contract-edit-status-aware-fields | — | — | — | — | — | 📝 (view) |
| V-contract-expiration-after-start | — | — | — | — | — | 📝 (view) |
| V-contract-rate-per-unit-non-negative | — | — | — | — | — | 📝 (view) |
| V-login-lockout-3-wrong-attempts | ✅ (platform) | ✅ | ✅ | ✅ | ✅ | ✅ |
| V-normal-user-limit-enforcement | ✅ (Add User) | — | — | — | — | — |
| V-password-complexity-per-security-level | ✅ (first-login flow) | — | — | — | — | — |
| V-password-security-level-enum | ✅ (Settings) | — | — | — | — | — |
| V-service-visibility-pricing-required | ✅ (services tabs view-only) | ✅ | ✅ | — | — | — |
| V-user-first-last-name-letters-only | ✅ (Add User) | — | — | — | — | — |
| V-username-format-uniqueness-immutable | ✅ (Add User) | — | — | — | — | — |

Legend: ✅ direct apply · 📝 indirect/read-only · OH=org-hierarchy · CH=comms-hub · MA=marketplace-applications · CG=contact-groups · WB=wallet · CC=contracts

`[BRAIN-OUT] authority-dataset/06-validation-by-feature/MATRIX.md`

### 15.2 The 3-layer validation architecture

| Layer | Where | When |
|---|---|---|
| **Layer 1** — HTML/directive | `<input falconRequired falconMaxLength="30">` (template) | Render-time, synchronous |
| **Layer 2** — Cross-field FormGroup validators | `validations/validations.ts` per component folder | On value change, synchronous |
| **Layer 3** — Async backend uniqueness | Debounced 300ms with `cancel-on-input` | After user pause |

Examples (async layer):
- Account Name: `GET /api/Node/ValidateAccountName?AccountName=` → returns `bool` → map `true` → `accountNameTaken`
- Username: Identity `POST /api/user/exist` → `ExistResponse { bool Exists }` → map `Exists: true` → `usernameTaken`

`[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` §5

### 15.3 The `[ThrowIf*]` attribute pattern (backend)

| Attribute | Triggers on | Error code (typical) |
|---|---|---|
| `[ThrowIfNotPassed]` | null/missing scalar | `RequiredFieldMissing` (400) |
| `[ThrowIfMaxLengthExceed(N)]` | string length > N | `MaxLengthExceeded` (400) |
| `[ThrowIfNotEnumValue<TEnum>]` | outside enum | `InvalidValue` (422) |
| `[Required]` | null/default | `RequiredFieldMissing` (400) |
| `[Range(decimal, min, max)]` | numeric out of range | `InvalidValue` (422) |
| `[EnumDataType(typeof(TEnum))]` | outside enum | `InvalidValue` (422) |

`[ThrowIf*]` runs BEFORE handler logic (pre-processor chain) — empty/malformed values never reach the handler. Handler-level checks (e.g. `InvalidAccountLimits`, `EffectiveDateMustBeInFuture`) run after.

### 15.4 The 16 drift items to preserve on the port

1. **Username 30↔100 cap** — FE enforces 30, backend allows 100. **Preserve FE max(30).**
2. **PasswordSecurityLevel vocabulary** — PRD says Normal/Advanced; backend says Low/Medium/High/Strict. **Display PRD labels; submit backend codes.**
3. **AccountName letter-prefix regex** — FE-only; no backend mirror. **Preserve FE pattern.**
4. **AccountOwner.PhoneNumber + EmailAddress** — backend missing `[ThrowIfNotPassed]`. **FE enforces required.**
5. **Account Limits `[ThrowIf*]` missing** — FE enforces required+min(0); default 0; render "No limit" when 0.
6. **PRD contract value upper bound** — soft FE max(999_999_999) with warning toast.
7. **Contract Name + farabiRefId length** — FE `maxLength(50)`.
8. **Currency enum drift Commerce↔Charging** — FE wires both directions.
9. **Forgot-password OTP silent vs login OTP attempts** — DON'T show attempts on forgot-password OTP screen.
10. **HiddenProductMustNotHavePricing reverse rule** — toggling Show → Hide must clear priceType + priceValue.
11. **Contact-group share mode silent normalization** — FE mutex prevents losing selection.
12. **OTP `expiresAt` is relative seconds** — FE computes `expiresAt = now + OtpExpiresInSeconds`.
13. **Reservation TTL = 300s** — FE handles `ReservationNotFound` 404 as "expired — re-quote".
14. **No-applicable-rate is contract-config gap** — render "Service not configured" + ops breadcrumb; NO retry CTA.
15. **Template Restricted bodyType bundle** — 4-code structural cluster — blocked by GAP-TM-02.
16. **Sub-node name 30-char cap** — sister rule referenced but not seeded — flag in Add Node drawer.

`[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` §4

---

## 16. Non-PES Gates — The 6 Gate Types

> PES is ONE of many gate types. A porter who migrates without re-evaluating these ships broken UI.

| Gate type | What it checks | Re-derivation on mgmt |
|---|---|---|
| **Session-type** | `session.userType === FALCON_USER \| CLIENT_USER` | Admin: always FALCON. Mgmt: always CLIENT. `if (!isFalconUser) return;` is no-op on admin, blanket-deny on mgmt. **Drop the check or flip the literal.** |
| **Node-type** | `selectedNode().data.{isFalconNode, isFirstLevelChild}` | `isFalconNode === true` never true on mgmt. Dead code on either side of the conditional. **Replace with node-depth or role check, or remove.** |
| **Mode** | Component-local `mode` enum (View/Edit) | Pure UI state. Carries over. |
| **Tab-visibility** | `enabled: !isFalcon && isMain` | Collapses to `enabled: isMain` on mgmt. **Re-derive from BR rule.** |
| **Server-driven row** | `row.allowedActions[]` | Works as-is — backend computes per session. **Verify gateway forwards JWT.** |
| **Composite** | `canEditAccountQuota && (isRootSelection \| isMainNodeSelection)` | PES × node-type × business-rule. **Re-derive from BR rule, not literal copy.** |

`[BRAIN-OUT] authority-dataset/10-non-pes-gates-by-feature/MATRIX.md`

### 16.1 Server-driven row visibility — the most aggressive non-PES gate

Used in comms-hub, marketplace-applications, contact-groups (via `rowFlags`), and org-hierarchy (apps-services + comm-channels tabs).

**Pattern:**

```ts
visible: (row) => {
  if (row.allowedActions !== undefined
      && row.allowedActions !== null
      && Array.isArray(row.allowedActions)) {
    return row.allowedActions.map(a => a as FalconRowAction).includes(actionEnum);
  }
  return false;  // DEFAULT-DENY when missing
}
```

**The backend computes per row:** FSM state + PES + eligibility. The frontend trusts this list verbatim.

**Hard rule:** **DO** trust `row.allowedActions`. **DON'T** re-implement the FSM client-side. Backend is the source of truth.

---

## 17. Error Catalog & Frontend Contract

### 17.1 The HTTP status routing model

| Status | Meaning | Flow control |
|---|---|---|
| 400 | Validation / required / format / regex | Inline form errors |
| 401 | Credentials / unauth | Relogin flow |
| 403 | Authorization / IP allowlist | "Contact administrator" screen (no retry) |
| 404 | Not found | Empty state |
| 409 | Uniqueness conflict | Mark field invalid (e.g. DuplicateUsername) |
| 422 | Business / domain / cross-field | Top-right toast OR inline error (per business case) |
| 423 | Locked | "Account locked" screen, no retry |
| 429 | Rate-limit / OTP throttle | Start 60s timer (login OTP); silent on forgot-pwd |

### 17.2 Falcon error contract (load-bearing)

> **Use HTTP status code as the primary routing signal.** Display localized `errorMessages[0]` to the user (already localized; do not parse codes). Use error codes only for logging / instrumentation, never for branching UI copy.

`[BRAIN-OUT] understanding/backend/commerce/FRONTEND_CONTRACT.md`

Implications:
1. FE does **NOT** switch on `FalconKeys.Error.*` string keys for user-facing copy
2. FE **DOES** switch on HTTP status for flow control
3. Error codes ARE logged (instrumentation/telemetry) but never read off the wire for display

### 17.3 Mgmt-console error pipeline (already configured)

`[CODE] apps/host-shell/.../falcon-http-ui.config.ts:23-67`:
- 400 → top-right business-validation toast (12s)
- 403/404/5xx/network → popup confirm
- 422 → warning toast
- 200 + `isSuccessful: false` → "Validation error" toast
- 401 → AuthService refresh-token flow
- `notShowToaster: 'true'` header set ONLY on do-payment POSTs (popup owns failure dialog)

**Verdict:** Already correctly wired. Reuse on mgmt-console for all new features.

---

## 18. Implementation Pitfalls & Anti-Patterns

### 18.1 Things NOT to copy

| Anti-pattern | Why |
|---|---|
| SCSS files / `*.component.scss` | Tailwind utilities only — no SCSS, no component CSS |
| PrimeNG components / PrimeIcons strings | Platform-wide removal complete |
| `@Input()` decorators relying on admin-only parent context | Mgmt has no equivalent parent |
| `*ngIf` | Use Angular 17+ `@if` (zoneless + Angular 21 doctrine) |
| Hard-coded English strings | `MultiLanguageName(En, Ar)` — i18n keys |
| `alert()` calls | Use toast / dialog per Falcon UX |
| Silent `return of([])` on error | Surfaces empty state without context |
| Cross-app relative imports (`../../../../../admin-console/...`) | Lift to shared library |
| In-component `AccessControlFacade.resolveFlags(...)` from admin | Mgmt uses route-level `data.access` + backend `row.allowedActions` |
| `provideAppDefaultGateway(Gateway.SystemGateway)` | Mgmt is `CoreGateway` |
| Reading admin-only PES keys (`adminConsole.masterWallet.view`, `adminConsole.wallet.transfer`) | Keys don't exist in mgmt namespace |

### 18.2 The "cells render enabled despite visible:false" trap

Documented during Add Client wizard rebuild (Wave 7.15, 2026-05-17). The `<falcon-angular-data-table>` uses async EmbeddedViewRef "Strategy E projection orchestrator" listening to Stencil's `falcon-cells-mounted` event. In zoneless + OnPush descendants (dropdown, app-falcon-native-input), host-binding signal reads don't reliably propagate after context-mutation cycle.

**Rule:** USE `<falcon-angular-data-table>` for sort/filter/expansion/shadow-rows/lazy-load/real-pagination. USE plain Angular `<table>` for edit-in-place CRUD with OnPush cell editors. NEVER mix data-table + heavy OnPush cell editors.

`[MEMORY] project_add_client_wizard_plain_table_2026_05_17.md`

### 18.3 The auto-revert mechanism trap

If a protected file appears to revert after each Write — pause the auto-revert mechanism before refactoring. Discovered during Wave 17 commchannels integration when 5 files auto-reverted after each Write.

`[MEMORY] project_commchannels_apps_tabs_wave17_2026_05_18.md`

### 18.4 The JSDoc block-comment closure trap

NEVER write `*/` sequence inside a `/* */` block — closes the comment prematurely.

`[MEMORY] project_commchannels_apps_tabs_phase1_2026_05_17.md`

### 18.5 The Identity user-id vs Zitadel sub-id trap

For ownership comparisons (e.g. contact-group `createdByUserId`), use `session.identityUserId` (Mongo `_id` mirror), NOT `session.subjectId` (Zitadel `sub`).

For PES subject contracts, `g`-rule `obj` MUST be `u:<ZitadelUserId>@<ns>`, never Mongo `_id`.

`[VAULT] falcon-wiki/00-MOCs/PES-Subject-Contract.md` · `[MEMORY] feedback_pes_g_link_uses_zitadel_id.md`

---

# 19. Night-Shift Execution Plan — 17 Waves

> Each wave is **atomic, verifiable, and reversible**. Each wave ships with: (a) the brain-load chain to run first, (b) the explicit Definition of Done, (c) the verification command, (d) the per-role test users to drive.

## Wave 0 — Pre-flight (run before night shift begins)

**Purpose:** Confirm the workspace is in a state where waves can execute.

**Tasks:**

1. Open `Brain Outputs/datasets/authority-dataset/0-MASTER-INDEX.md` and `VERIFICATION-STATUS.md` (load into context)
2. Run scanner: `cd C:/Falcon/falcon-wiki && pwsh ./scripts/scan-authority.ps1 -CheckOnly` — confirm 67/67 clean (or document the drift that's intentional)
3. Confirm local stack: `cd C:/Falcon/Falcon/falcon-essentials && docker compose ps` (Mongo + Redis + Kafka + Zitadel + Postgres up)
4. Reseed test users: `cd zitadel && ./seed-test-users.sh` (idempotent)
5. Verify 3 acc-* test users authenticate: `accowner` / `accadmin` / `accuser`, all with `Admin@1234`
6. Confirm host-shell builds: `nx build host-shell` → GREEN
7. Confirm admin-console builds: `nx build admin-console` → GREEN
8. Confirm management-console builds: `nx build management-console` → GREEN

**Definition of Done:** All 8 tasks PASS. Any FAIL → halt-and-flag.

---

## Wave 1 — Foundation: PES Seeding + Route Scaffolding

**Goal:** Ensure all `managementConsole.*` PES keys are seeded and `app.routes.ts` is ready to accept new feature lazy modules.

**Brain load chain:**
1. `Brain Outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md`
2. `Brain Outputs/datasets/authority-dataset/11-copy-playbook/namespace-flip.checklist.md`
3. `[CODE] libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (read-only)

**Tasks:**

1.1. Audit `falcon-access.registry.ts` for all `managementConsole.*` keys actually USED in the upcoming waves (org-hierarchy + wallet + contracts + marketplace-applications + contact-groups + Add User flow keys)

1.2. Identify keys that are referenced but MISSING from registry (per §14 wallet recommendation: `managementConsole.wallet.{view, transfer}` are gaps)

1.3. **DOC ONLY:** Produce a one-page list of keys to add (DO NOT modify code in this wave — separate ticket)

1.4. Verify mgmt `app.routes.ts` has the required parent route shape:
```ts
{
  path: '',
  canActivate: [managementConsoleGuard],
  children: [
    // existing comm-mgmt route
    // FUTURE: org-hierarchy-page, wallet, contracts, marketplace-applications, contact-groups routes
  ]
}
```

1.5. Verify mgmt `app.config.ts` wires `provideFalconValidations()` (currently MISSING — admin has it)

**Definition of Done:**
- PES key gap list authored at `Brain Outputs/datasets/authority-dataset/03-pes-keys/MGMT-GAPS-2026-05-18.md`
- `app.routes.ts` parent route structure CONFIRMED (no code change yet)
- `provideFalconValidations()` gap CONFIRMED in mgmt app.config.ts

**Test:** N/A (planning wave).

**Reversibility:** Pure documentation.

---

## Wave 2 — Organization Hierarchy Shell (Route + Tree + Skeleton)

**Goal:** Stand up the mgmt-console route `/organization-hierarchy` with the shared tree component, a 4-tab layout shell, and a loading skeleton. All tabs empty / placeholder; only landing + tree render works.

**Brain load chain:**
1. `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/README.md` (for context, not implementation)
2. `[BRAIN-OUT] authority-dataset/11-copy-playbook/copy-admin-feature-to-mgmt.md` Steps 1-9
3. `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/org-hierarchy-page.routes.ts`
4. `[CODE] apps/admin-console/.../organization-hierarchy/organization-hierarchy.component.ts` (the canonical shell)
5. `[BRAIN-OUT] authority-dataset/10-non-pes-gates-by-feature/MATRIX.md` §3.1 (4 node-type flags)

**Tasks:**

2.1. Create folder `apps/management-console/src/app/features/org-hierarchy-page/`

2.2. Copy file tree from admin-console donor; rename files only (no logic change yet)

2.3. Strip:
- Add Client wizard folder + AddClientWizardComponent imports
- Synthetic Falcon root logic
- Cross-account tree picker references
- All `FalconAccess.adminConsole.*` references (leave dangling for Wave 3 to fix)

2.4. Add route to `app.routes.ts`:
```ts
{
  path: 'organization-hierarchy',
  loadChildren: () =>
    import('./features/org-hierarchy-page/org-hierarchy-page.routes')
      .then(m => m.orgHierarchyPageRoutes),
  canActivate: [shellAccessGuard],
  data: { access: FalconAccess.managementConsole.accountHierarchy.view() }
}
```

2.5. Wire `HierarchyPageStateService` + the 6 slices (placeholders OK — Waves 3-10 populate)

2.6. Mount `<app-organization-hierarchy-tree mode="client-full">` — drops synthetic Falcon root

2.7. Mount `<falcon-tabs-layout>` with 4 stub tabs:
- hierarchy (renders skeleton)
- comm-channels (placeholder text)
- apps-services (placeholder text)
- settings (placeholder text)

2.8. Wire tree → state.applyTreeUpdate sync

2.9. Build: `nx build management-console`

**Definition of Done:**
- Build GREEN
- Login as acc-owner → navigate to `/management-console/organization-hierarchy` → tree renders with tenant root
- Login as acc-admin → same — tree renders (acc-admin has `acc.org-hierarchy.view`)
- Login as acc-user → 403 redirect (explicit deny on `acc.org-hierarchy.view`)
- Test users mapped at `[BRAIN-OUT] 07-cross-cutting/test-users.md`

**Reversibility:** Single feature folder; one route entry. `git revert` cleans.

---

## Wave 3 — Tree Action Wiring + Add Node Drawer

**Goal:** Wire tree row actions (Add Sibling, Edit Sibling, Add User) into the mgmt page-state facade. Mount Add Node drawer with `acc.organization.add` PES gate.

**Brain load chain:**
1. `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md`
2. `[CODE] apps/admin-console/.../org-hierarchy-page-menu.component.ts` + `.html` (donor)
3. `[CODE] apps/admin-console/.../hierarchy-tab/falcon-org-node-drawer/`

**Tasks:**

3.1. Copy `falcon-org-node-drawer/` from admin-console donor

3.2. Wire drawer mount in page-menu component

3.3. PES gate the Add Sibling row action:
```ts
canAddOrganization = computed(() =>
  this.access.resolve(FalconAccess.managementConsole.organization.add())
);
```

3.4. Drop the Add Client tree action entirely (no `'add-client'` in `allowedTreeActions` union)

3.5. Wire the Add User row action (passes through to Wave 7's wizard)

3.6. Wire (treeChange) → state.applyTreeUpdate

3.7. Build + smoke test

**Definition of Done:**
- Build GREEN
- acc-owner → can see "Add Sibling" + "Edit Sibling" + "Add User" tree row actions on any non-root node
- acc-admin → same (both have `organization.add`)
- acc-user → 403 (never lands here anyway)
- Add Sibling drawer opens, form fields render, save button visible
- Edit Sibling drawer opens with pre-populated form
- No console errors; no PrimeNG warnings

---

## Wave 4 — Information Panel (Hierarchy Tab Content)

**Goal:** Mount `<falcon-org-info-panel>` reading `commerce/information` GET + PUT. AccountName + FinanceId fields display read-only on mgmt (Falcon-only edit).

**Brain load chain:**
1. `[MEMORY] project_info_panel_country_city_lookups_wave15b_2026_05_18.md` (per-country city lookup pattern)
2. `[MEMORY] project_info_panel_backend_integration_wave15_2026_05_17.md` (Wave 15 backend integration)
3. `[CODE] apps/admin-console/.../falcon-org-info-panel/`
4. `[BRAIN-OUT] understanding/backend/commerce/ENDPOINT_REGISTRY.md` (commerce/information)

**Tasks:**

4.1. Copy `falcon-org-info-panel/` folder structure (5 new files + state slice)

4.2. State slice: `InfoPanelStateSlice` with `forkJoin(resolvePES, getInfo)` on mount

4.3. PES `FalconAccess.managementConsole.accountProfile.{view, edit}`:
- view → load form
- edit → enable edit mode (acc-owner only — acc-admin has explicit deny on .edit)

4.4. Hide AccountName + FinanceId edit (Falcon-only on backend) — `canEditFalconOnly` computed = false always on mgmt

4.5. Wire per-country city lookup (Wave 15b pattern) — on country change, clear city, fetch new city list

4.6. Wire cross-field validators (`CountryRequiredWhenCity`, `CityRequiredWhenDistrict`, `CityRequiredWhenStreet`)

4.7. PhotoUploader in view + edit modes (Wave 14b `[viewMode]`)

4.8. Submit → `PUT commerce/information` → tree refetch on AccountName change (NOT relevant on mgmt — read-only)

4.9. i18n keys `hierarchy.info.{actions, success, error, validation, exitConfirm, tooltip}` (en + ar)

**Definition of Done:**
- Build GREEN
- acc-owner on tenant root → info panel renders, Edit button visible
- acc-owner clicks Edit → form enabled, AccountName + FinanceId READ-ONLY
- acc-owner saves changes → PUT fires, success toast, view mode restored
- acc-admin → Edit button HIDDEN (explicit deny on `.edit`)
- acc-user → never lands here

---

## Wave 5 — Settings Tab (Acc-Owner Only Edit)

**Goal:** Mount Settings tab with 4 sub-cards: PasswordSecurityLevel, AllowedIps, AccountQuota, (root-only ignored — mgmt has no root variants). All 4 cards display for acc-owner edit; acc-admin views; acc-user/sub-node deeper denied.

**Brain load chain:**
1. `[MEMORY] project_settings_tab_standalone_wave14_2026_05_17.md`
2. `[CODE] apps/admin-console/.../tab-components/settings-tab/`
3. `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` (V-account-limits-zero-means-no-limit + V-password-security-level-enum + V-account-ip-allowlist-enforcement)

**Tasks:**

5.1. Copy `settings-tab/` folder (7 new files: models · services · validations · signals · component · html · index)

5.2. State slice `SettingsTabStateSlice` — mount-time forkJoin(resolvePES, getSettings)

5.3. PES per sub-section:
- PasswordSecurityLevel card: `managementConsole.accountPasswordSecurityLevel.{view, edit}` (acc-owner only edit)
- AllowedIps card: `managementConsole.accountAllowedIps.{view, edit}` (acc-owner only edit)
- AccountQuota card: `managementConsole.accountQuota.{view, edit}` (acc-owner only edit)

5.4. Drop root-* PES key references entirely

5.5. Node-aware tab visibility re-derivation:
- Falcon root → N/A on mgmt
- client root → all 4 cards
- sub-node → org-settings.view (not account-settings)

5.6. PasswordSecurityLevel dropdown: display PRD labels (Normal/Advanced); submit backend codes (Low/Medium/High/Strict)

5.7. AccountLimits inputs: required + min(0); render "No limit" when value === 0

5.8. IP list: dismissible chips with IPv4/IPv6 validation regex

5.9. Endpoint: `GET commerce/setting?ownerId=` + `PUT commerce/setting`

5.10. Body-only component pattern (header + buttons projected into shared `<falcon-node-details-section>` action slot)

**Definition of Done:**
- Build GREEN
- acc-owner on tenant root → all 4 cards render, Edit button on each
- acc-owner saves password level → backend code submitted; UI displays PRD label
- acc-owner adds IP → chip added; remove works
- acc-owner sets quota = 0 → "No limit" rendered
- acc-admin on tenant root → all 4 cards render READ-ONLY (explicit deny on all 4 .edit)
- acc-user → never lands here
- Pre-empts `SettingsOnlyAllowedForMainNode` 422 by node-aware visibility (sub-node hides account-* cards)

---

## Wave 6 — Comm Channels Tab (View-Only on Mgmt)

**Goal:** Mount `comm-channels-tab` reading `commerce/Node/{id}/comm-channels/visible/details`. View-only on mgmt (no inline edit of visibility/pricing — those PES keys don't exist in `acc.*` namespace).

**Brain load chain:**
1. `[MEMORY] project_commchannels_apps_tabs_wave17_2026_05_18.md`
2. `[BRAIN-OUT] 04-feature-parity-matrix/comms-hub.compare.md`
3. `[CODE] apps/admin-console/.../tab-components/comm-channels-tab/`

**Tasks:**

6.1. Copy `comm-channels-tab/` folder

6.2. State slice `CommChannelsTabStateSlice` with mount-time `state.load(nodeId)`

6.3. Endpoint `GET commerce/Node/{nodeId}/comm-channels/visible/details` (shadow-row format)

6.4. Use `serviceRowsToApplicationRows` adapter (from Wave 17) to map backend `ServiceRow` → legacy `ApplicationRow`

6.5. Mount shared `<app-applications-table>` UNTOUCHED

6.6. Drop EditPriceType / EditPriceValue / Visibility row actions (no `acc.services.{edit-*, visibility}` PES keys)

6.7. Preserve DoPayment + Enable + Disable row actions (gated by `row.allowedActions[]`)

6.8. Wire error pipeline reuse from host-shell `falcon-http-ui.config.ts`

**Definition of Done:**
- Build GREEN
- acc-owner on tenant Main node → comm-channels tab visible; rows render with backend-driven actions
- acc-owner clicks DoPayment → dialog opens; payment flow works
- acc-admin → comm-channels tab HIDDEN (explicit deny on `acc.services.view`)
- acc-user → never lands here

---

## Wave 7 — Apps Services Tab (View-Only on Mgmt)

**Goal:** Mirror of Wave 6 for `apps-services-tab`. Same shape, different endpoint.

**Brain load chain:** Same as Wave 6.

**Tasks:**

7.1. Copy `apps-services-tab/` folder

7.2. State slice `AppsServicesTabStateSlice` with mount-time `state.load(nodeId)`

7.3. Endpoint `GET commerce/Node/{nodeId}/applications`

7.4. Use `serviceRowsToApplicationRows` adapter

7.5. Mount shared `<app-applications-table>` with `applicationType='application'`

7.6. Drop EditPriceType / EditPriceValue / Visibility row actions

7.7. Preserve DoPayment + Enable + Disable row actions

**Definition of Done:**
- Build GREEN
- acc-owner → apps tab renders with row actions
- acc-admin → apps tab HIDDEN
- acc-user → never lands here

---

## Wave 8 — Add User Wizard (3-Step)

**Goal:** Port the 3-step Add User wizard from admin-console with mgmt-aware PES gates.

**Brain load chain:**
1. `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`
2. `[CODE] apps/admin-console/.../wizard-components/add-user-wizard/`
3. `[BRAIN-OUT] 06-validation-by-feature/MATRIX.md` (V-user-first-last-name-letters-only, V-username-format-uniqueness-immutable, V-normal-user-limit-enforcement)

**Tasks:**

8.1. Copy `add-user-wizard/` folder

8.2. 3 step components: `user-personal-step`, `user-role-status-step`, `user-permissions-step`

8.3. PES gates per step:
- Step 1 (Personal): `managementConsole.user.add()` for save
- Step 1: `managementConsole.userProfilePicture.upload()` for photo
- Step 3: `managementConsole.userPermissionGroup.assign()` for perm group assignment

8.4. Add User entry point — gate on node selection:
- Selected node is tenant root → check `canAddAccountUser` (acc-owner only)
- Selected node is sub-node → check `canAddOrgUser` (acc-owner + acc-admin)

8.5. Wire validators:
- First/Last name: letters-only, ≤50
- Username: letter-prefix, ≤30 (FE-tighter), unique (async check via `POST /api/user/exist`)
- Email: required + format (FE adds required since backend missing `[ThrowIfNotPassed]`)
- Phone: required + format (FE adds required)
- Password: auto-generated; first-login force-change applies V-password-complexity-per-security-level

8.6. Role dropdown: filter per role-edit reach matrix:
- If actor is acc-owner: can create {acc-owner, acc-admin, acc-user}
- If actor is acc-admin: can create {acc-admin, acc-user} only

8.7. Status dropdown: filter to valid creation values (Pending or Active; cannot create Deleted/Suspended/Locked)

8.8. Normal-user limit pre-flight: `GET /api/user/count?role=NormalUser` → render badge "12 / 50 Normal Users"

8.9. Save → POST to identity → triggers Kafka Identity events; mgmt UI shows success toast and tree refresh

**Definition of Done:**
- Build GREEN
- acc-owner on tenant root → Add User button visible; wizard opens
- acc-owner saves valid form → user created; tree refreshes
- acc-owner tries duplicate username → 409 → field marked invalid
- acc-owner exceeds quota → 422 NormalUserLimitReached → toast
- acc-admin on tenant root → Add User button HIDDEN (silent deny on `acc.account-user.add`)
- acc-admin on sub-node → Add User button VISIBLE (allow on `acc.org-user.add`)
- acc-admin creates user → can only choose {acc-admin, acc-user} in role dropdown
- acc-user → never lands here

---

## Wave 9 — Users Table + Drilldown to /user-details/:id

**Goal:** Populate the Users slice of the page; each row drills down to host-shell `/user-details/:id`.

**Brain load chain:**
1. `[CODE] apps/admin-console/.../org-hierarchy-page-menu.component.html` (drilldown pattern)
2. `[CODE] apps/host-shell/.../user-details-page.component.ts`
3. `[BRAIN-OUT] understanding/pages/edit-user/` folder (16 files — full Edit User playbook)

**Tasks:**

9.1. Mount Users table slice

9.2. Endpoint: `GET /api/identity/user/listByNode/{nodeId}` via Core Gateway

9.3. Status badge per row (5 statuses: Pending/Active/Suspended/Locked/Deleted)

9.4. Row click → navigate to host-shell `/user-details/:id`

9.5. **DO NOT** include `?includeDeleted=true` query param on mgmt — that's Falcon-only (PR #40937)

9.6. Verify host-shell `user-details-page` handles non-Falcon session gracefully (no Falcon-only edit surfaces)

**Definition of Done:**
- Build GREEN
- acc-owner → user list renders with status badges; row click navigates
- acc-admin → same; visible only at sub-node level if they navigated there
- acc-user → never lands here

---

## Wave 10 — Edit Node Drawer (Rename + Scheduled Rename)

**Goal:** The Edit Node drawer (uses same drawer as Add Node, morphed via `state.morphDrawerToEditSibling()`).

**Brain load chain:**
1. `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md`

**Tasks:**

10.1. Wire `state.morphDrawerToEditSibling()` for Edit Sibling tree action

10.2. Form fields: name (with sub-node 30-char cap — flag #16 drift), scheduled rename (effective date)

10.3. PES gate: `managementConsole.organization.edit()` — if it exists; otherwise reuse `.add` semantics (Q-* flag)

10.4. Submit → `PUT commerce/Node/{id}` with scheduled or immediate rename payload

10.5. **DO NOT** expose Move or Archive actions — both MISSING per Q-AM-18

**Definition of Done:**
- Build GREEN
- acc-owner can rename node → success toast + tree refresh
- Scheduled rename with future date → submits
- Past date → form-level validation error
- Move + Archive options not present in UI

---

## Wave 11 — Wallet Balance Management (View + Transfer)

**Goal:** Port wallet view + Transfer Balance dialog. Drop Master Wallet card + cross-account picker + wallet-strategy edit.

**Brain load chain:**
1. `Brain Outputs/understanding/pages/wallets-and-balance-management/` folder
2. `[BRAIN-OUT] 04-feature-parity-matrix/wallet-balance-management.compare.md`
3. `[CODE] apps/admin-console/.../wallet-balance-management/` (donor)
4. `[CODE] apps/management-console/.../wallet-balance.service.ts` (existing pattern for ChargingGateway override)

**Tasks:**

11.1. Copy `wallet-balance-management/` folder

11.2. Drop:
- Master Wallet card
- Cross-account tree picker
- Wallet-strategy edit (Settings card → view-only or hidden)

11.3. Account ID resolution: `session.tenantId || session.client_id` (never tree-picker)

11.4. `resolveSelectedAccountId()` helper — save to main account, never selected sub-node

11.5. PES — add `managementConsole.wallet.{view, transfer}` to registry (per §14 gap recommendation):
- This is a new PES key — Wave 1 should have flagged this
- Coordinate with backend PES catalog (BuiltInRoleCatalog.cs additions)
- If added: route gate `managementConsole.wallet.view()`; Transfer button gate `managementConsole.wallet.transfer()`
- If NOT added (defer to later phase): rely on server-driven `canSave` only

11.6. Transfer Balance dialog: explicit `useGateway(Gateway.ChargingGateway)` override

11.7. Wire validators:
- V-charging-insufficient-balance — transfer amount ≤ source balance
- V-charging-transfer-source-destination — source ≠ destination, currency match
- BalanceTransferLimit % cap (read from tenant settings)

11.8. Route: `/wallet-balance-management` with `data.access` + `shellAccessGuard`

**Definition of Done:**
- Build GREEN
- acc-owner → wallet page renders; Transfer button visible; transfer works
- acc-admin → either page hidden (if new PES) or empty (if relying on server `canSave`)
- acc-user → same
- Master Wallet not visible to any acc-* role

---

## Wave 12 — Contracts Cost Management (View-Only Acc-Owner Only)

**Goal:** Port contracts list + detail view. View-only. Strongest authority asymmetry — acc-admin + acc-user explicit deny.

**Brain load chain:**
1. `Brain Outputs/understanding/pages/contracts-list/` folder
2. `Brain Outputs/understanding/pages/edit-contract/` folder (for status-aware field freeze logic — even read-only renders status-locked badges)
3. `[BRAIN-OUT] 04-feature-parity-matrix/contracts-cost-management.compare.md`

**Tasks:**

12.1. Copy contracts list component + detail view

12.2. **Drop** the 4-step Add Contract wizard

12.3. **Drop** the Edit Contract tab surface

12.4. **Refactor** any cross-app relative imports (`../../../../../admin-console/...`) into shared lib

12.5. Endpoint: `GET api/commerce/contracts` (note `api/` prefix, lowercase — gateway artifact)

12.6. **Drop** the balance-summaries enrichment call (mgmt response has balance inline)

12.7. Hardcode `canEdit: false` on every row (already pattern)

12.8. Route: `/contracts-cost-management` with `data.access: FalconAccess.managementConsole.contract.view()` + **`canActivate: [shellAccessGuard]`** (critical — fix the gap from original port)

12.9. Status-aware field display:
- Pending / Active / Expired badges
- Fields locked by status follow V-contract-edit-status-aware-fields (display only — no edit)

**Definition of Done:**
- Build GREEN
- acc-owner → contracts list renders; row click → detail view; no Edit button visible
- acc-admin → 403 on route entry (shellAccessGuard rejects; explicit deny on `acc.contract.view`)
- acc-user → same 403
- Sidebar menu — Contracts entry hidden for acc-admin + acc-user

---

## Wave 13 — Marketplace Applications

**Goal:** Port marketplace-applications mirror of comms-hub.

**Brain load chain:**
1. `[BRAIN-OUT] 04-feature-parity-matrix/marketplace-applications.compare.md`
2. `[CODE] apps/admin-console/.../marketplace-applications/`

**Tasks:**

13.1. Copy `marketplace-applications/` folder

13.2. Drop the 4-key `resolveFlags({...})` on `sys.services.*`

13.3. Route gate: `data.access: FalconAccess.managementConsole.services.view()` + `shellAccessGuard`

13.4. Gateway: drop `useGateway(Gateway.SystemGateway)` → default `CoreGateway`

13.5. DTO enrichment: extend `AppServiceItem` → `MarketplaceApplicationItem` with `subtitle`, `description`, `iconClass`, `iconSvg`, `iconUrl`, `pricePeriod`, `currency`, `showDates`, `showPrice`

13.6. Endpoint URL unchanged (`commerce/Node/{id}/applications`)

13.7. Session-based account id: `session.tenantId || session.client_id`

13.8. Drop EditPriceType / EditPriceValue / Visibility row actions

13.9. Drop tree picker; drop `FALCON_ROOT_NODE`

13.10. Add card/list view-mode toggle persisted in `localStorage` (`marketplaceAppsViewMode`)

13.11. Component: synchronous (NOT `loadComponent`)

**Definition of Done:**
- Build GREEN
- acc-owner → page renders; row actions per `allowedActions`
- acc-admin → explicit deny (empty page or 403)
- acc-user → silent deny

---

## Wave 14 — Contact Groups (Full CRUD — Direction Reverses)

**Goal:** This is the biggest port. Mgmt is the SUPERSET. Full 5-step wizard + S3 upload pipeline + share dialog + edit-in-place + delete.

**Brain load chain:**
1. `Brain Outputs/understanding/pages/create-contact-group/` folder (16 files)
2. `Brain Outputs/understanding/pages/contact-groups-list/` folder (16 files)
3. `[BRAIN-OUT] 04-feature-parity-matrix/contact-groups.compare.md`

**Tasks:**

14.1. Build parent shell route `/contact-groups` with tree + 3 children: `''` (list), `'create'` (wizard), `':groupId'` (details)

14.2. List page: 2 tabs — "My Groups" + "Shared Groups" (gated `acc.contact-group.view-shared`, only acc-user sees)

14.3. 5-step Create wizard:
- Step 1: UploadGroupDetailsStep — file picker + Group Name (mandatory, ≤50, NamePattern), Reference ID
  - File type allowlist from `GET /upload-config`
  - File size cap from same
- Step 2: PreviewConfigureStep — column config (name EN-letters, ≤20, no dupes, spaces → `_`, alias)
- Step 3: ReviewCreateStep — validate before submit
- Step 4: ShareGroupStep — `SharedWithAllUsers` toggle vs `SharedUsers[]` multiselect (FE mutex prevents silent drop)
- Step 5 (post-create): share dialog opens for additional sharing

14.4. S3 upload pipeline:
- `POST /uploads/init` → returns pre-signed URL
- External `PUT` to S3
- `POST /uploads/{id}/complete`
- `POST /uploads/{id}/preview` → returns columns
- `POST /contact-groups` (create)
- `PATCH /contact-groups/{id}/share-policy` (separate call for share)
- `DELETE /contact-groups/{id}` (delete)

14.5. Details view: read-only display + Edit toggle:
- name (editable)
- sharePolicy (editable — fix the admin bug where it was hardcoded null)
- referenceId (editable)

14.6. Share dialog: filter users by `Status=2&3&4` (Active+Suspended+Locked); render badges for non-Active status

14.7. PES — scope-parametrized factory:
- `FalconAccess.contactGroup.<action>('acc')` (always 'acc' on mgmt)
- Resolve `acc.contact-group.{view, create, edit, delete, share, share-other, download, download-original}` per action

14.8. Expression-gated overlays:
- For acc-user — show edit/delete/share only when `session.identityUserId === row.createdByUserId`
- For acc-owner + acc-admin — un-expressioned (FE shows always; backend enforces own-only on edit/delete)

14.9. Use `session.identityUserId` (NOT `session.subjectId`) for ownership comparisons

14.10. Validators per V-rules (5 rules direct):
- V-contact-group-name-required-format
- V-contact-group-file-size-cap
- V-contact-group-file-type-allowlist
- V-contact-group-column-name-shape
- V-contact-group-share-policy-mode-mutex

**Definition of Done:**
- Build GREEN
- acc-owner → full CRUD + share-any; "My Groups" tab; no "Shared Groups" tab
- acc-admin → same
- acc-user → full CRUD with own-only edit/delete/share + uniquely sees "Shared Groups" tab
- Upload pipeline works end-to-end (init → S3 PUT → complete → preview → create)
- Share dialog filters out Pending + Deleted users
- Status badges render for Suspended + Locked share targets
- Bug fix: sharePolicy patch actually sends `SharedUsers[]` (NOT null)

---

## Wave 15 — Validation Harness + Cross-Cutting Verification

**Goal:** Wire `provideFalconValidations()` in mgmt app.config.ts. Verify all V-rules surface correctly across all 6 ported features.

**Tasks:**

15.1. Add `provideFalconValidations()` to `apps/management-console/src/app/app.config.ts` (currently MISSING)

15.2. Run V-rule audit script (or manual checklist):
- Each form field renders expected validation message
- Each cross-field rule fires on appropriate value change
- Each async uniqueness check debounces 300ms

15.3. Verify error pipeline reuse: all 422 errors render toast; all 401 trigger relogin; all 423 show "account locked" screen

15.4. Verify the 16 drift items from §15.4 are FE-enforced:
- Username 30 cap
- PasswordSecurityLevel display labels
- AccountName letter-prefix
- AccountOwner phone + email required
- Account limits min(0)
- Contract value soft max
- Contract name + farabiRefId 50 cap
- Currency enum
- Forgot-password OTP silent (no attempts counter on that screen)
- HiddenProductMustNotHavePricing defensive clear (when service goes Show → Hide)
- Contact-group share-mode mutex
- OTP expiresAt computed
- Reservation TTL 300s → 404 handling
- No-applicable-rate "Service not configured" non-actionable copy
- Template Restricted bodyType bundle (BLOCKED — flag only)
- Sub-node name 30 cap

15.5. Build all 3 apps GREEN

**Definition of Done:**
- All 3 apps GREEN
- Every form across the 6 features fires expected validator
- Drift items #1-14 are FE-enforced; #15 + #16 flagged in tickets

---

## Wave 16 — Visual Polish + Dark Mode Parity

**Goal:** Apply Wave 14 dark mode tokens + Wave 14b photo uploader viewMode + Wave 15b lookup patterns across all new mgmt features.

**Brain load chain:**
1. `[MEMORY] project_dark_mode_phase_e_migration_2026_05_17.md`
2. `[MEMORY] project_dark_mode_phase_g_toggle_ui_2026_05_17.md`
3. `[MEMORY] project_falcon_tree_panel_tailwind_2026_05_18.md`
4. `[MEMORY] project_noor_instructions_skill` (Admin Console rule book — applies forward-only to new code)

**Tasks:**

16.1. Audit all new mgmt feature files for hardcoded color leaks per Phase E pattern:
- `bg-slate-*` / `text-slate-*` / `border-slate-*` → `bg-falcon-neutral-*` token equivalents
- `bg-white` → `bg-falcon-neutral-0`
- Inline hex codes → CSS-var or token

16.2. Verify dark mode toggle works on mgmt-console:
- topbar toggle button calls `ThemeService.toggle()` (Phase G)
- `<html class='app-dark' data-theme='dark'>` flips correctly
- FOUC script in mgmt-console `index.html` reads `falcon-theme` localStorage key
- All 6 ported features visually correct in both light + dark

16.3. Verify RTL layout (Arabic locale):
- All Tailwind logical properties (`start-1/2 end-0`) work
- No `:host-context([dir=rtl])` rules introduced

16.4. Confirm noor-instructions rule book applied (forward-only):
- 8 categories: layout ownership, theme promotion, typography scale, font ownership, color naming, component reuse, i18n/RTL, global selector hygiene

**Definition of Done:**
- All builds GREEN
- Dark mode: every new mgmt surface renders correctly in `app-dark` mode
- Light mode: unchanged from current (regression tolerance ≤6 hex units)
- RTL: every new mgmt surface mirrors correctly in Arabic locale
- noor-instructions audit PASS

---

## Wave 17 — Final QA Gate (Per-Role Capability Verification)

**Goal:** The Step-12 verification. Login as each acc-* role, walk every feature, confirm landing + visible actions + backend rejections match the per-role capability table.

**Brain load chain:**
1. `Brain Outputs/datasets/authority-dataset/05-capability-maps/acc-owner.capability.md`
2. `Brain Outputs/datasets/authority-dataset/05-capability-maps/acc-admin.capability.md`
3. `Brain Outputs/datasets/authority-dataset/05-capability-maps/acc-user.capability.md`

**Tasks (per-role checklist):**

### 17.1 acc-owner walk-through

- [ ] Login → land on mgmt-console dashboard
- [ ] Sidebar shows: org-hierarchy, comm-mgmt, marketplace-applications, wallet-balance-management, contracts-cost-management, contact-groups
- [ ] Org-hierarchy: tree renders tenant root; all 4 tabs visible; Add User button visible on root; Add Sibling visible on sub-nodes
- [ ] Settings tab: all 4 cards editable
- [ ] Info panel: Edit button visible; AccountName + FinanceId READ-ONLY in edit mode
- [ ] Comm-channels tab: rows render with DoPayment/Enable/Disable actions per `row.allowedActions`
- [ ] Apps tab: same shape
- [ ] Comm-mgmt page: separate route works; same row actions
- [ ] Marketplace-applications: page works; card + list view toggle
- [ ] Wallet: page renders; Transfer button visible; transfer flow works
- [ ] Contracts: list renders; row → detail view; no Edit
- [ ] Contact-groups: full CRUD; create wizard works; share dialog works; "My Groups" tab visible; no "Shared Groups" tab

### 17.2 acc-admin walk-through

- [ ] Login → land on mgmt-console dashboard
- [ ] Sidebar shows: org-hierarchy, contact-groups (services and contracts entries HIDDEN)
- [ ] Org-hierarchy: tree renders; only hierarchy + settings tabs visible; commchannels + apps HIDDEN
- [ ] Settings tab: all 4 cards READ-ONLY (explicit deny on all .edit)
- [ ] Info panel: Edit button HIDDEN (explicit deny on `.edit`)
- [ ] Add User on root: HIDDEN
- [ ] Add User on sub-node: VISIBLE
- [ ] Role dropdown in Add User: only {acc-admin, acc-user} selectable
- [ ] Comm-mgmt page: 403 redirect (or empty page if backend allowed)
- [ ] Marketplace-applications: same 403
- [ ] Wallet: route either denied or empty (depending on PES gap resolution)
- [ ] Contracts: 403 (explicit deny verified)
- [ ] Contact-groups: full CRUD with own-only edit/delete; share-any; no "Shared Groups" tab

### 17.3 acc-user walk-through

- [ ] Login → land on mgmt-console dashboard
- [ ] Sidebar shows: contact-groups ONLY (everything else HIDDEN)
- [ ] Direct nav to /organization-hierarchy → 403 (explicit deny on `acc.org-hierarchy.view`)
- [ ] Direct nav to /comm-mgmt → 403
- [ ] Direct nav to /marketplace-applications → 403
- [ ] Direct nav to /wallet-balance-management → 403
- [ ] Direct nav to /contracts-cost-management → 403
- [ ] Contact-groups: full CRUD with own-only edit/delete/share + UNIQUELY sees "Shared Groups" tab

### 17.4 Sign-off evidence

Capture for each role:
- Screenshots of every key surface (landing, sidebar, each feature page, each tab)
- Network log snippet showing 403 on denied routes
- Console log clean (no errors)

Store evidence at `Brain Outputs/reports/mgmt-console-port-plan-2026-05-18/evidence/`.

**Definition of Done:**
- All 3 walkthroughs PASS without UI defect
- Evidence captured
- Per-role capability tables in authority dataset updated with ✋ runtime-verified marker
- Add row to `Brain Outputs/datasets/authority-dataset/_runtime-verification/mgmt-port-2026-05-18.md`

---

## 20. Wave Dependency Graph

```
Wave 0 (Pre-flight) ─────────────┐
                                 ▼
Wave 1 (PES + Routes) ──────────►Wave 2 (OH Shell)
                                 │
                                 ├──►Wave 3 (Add Node Drawer)
                                 ├──►Wave 4 (Info Panel)
                                 ├──►Wave 5 (Settings Tab)
                                 ├──►Wave 6 (CommChannels Tab)
                                 ├──►Wave 7 (Apps Tab)
                                 ├──►Wave 8 (Add User Wizard)
                                 ├──►Wave 9 (Users Table)
                                 └──►Wave 10 (Edit Node Drawer)
                                 │
                                 ▼
                                 Wave 11 (Wallet) ─┐
                                 Wave 12 (Contracts) ─┤
                                 Wave 13 (Marketplace) ─┤
                                 Wave 14 (Contact Groups) ─┤
                                                           ▼
                                                       Wave 15 (Validation Harness)
                                                           │
                                                           ▼
                                                       Wave 16 (Polish + Dark)
                                                           │
                                                           ▼
                                                       Wave 17 (QA Gate)
```

**Parallel execution opportunities:**

- Waves 4-10 are siblings of Wave 2 — all depend on Wave 2 only. Can run in parallel after Wave 2 lands.
- Waves 11-14 are siblings of Wave 2 (different routes) — can run in parallel after Wave 1 (route scaffolding) lands.
- Waves 15-17 are strictly sequential.

**Critical path:** Wave 0 → 1 → 2 → 14 (longest) → 15 → 16 → 17.

---

## 21. Per-Wave Brain Load Quick Reference

| Wave | Primary brain files |
|---|---|
| 0 | MASTER-INDEX, VERIFICATION-STATUS |
| 1 | 03-pes-keys/REGISTRY-RAW, 11-copy-playbook/namespace-flip.checklist |
| 2 | 11-copy-playbook/copy-admin-feature-to-mgmt Steps 1-9, 10-non-pes-gates §3.1 |
| 3 | flows/Add Node.md |
| 4 | project_info_panel_country_city_lookups_wave15b_2026_05_18.md |
| 5 | project_settings_tab_standalone_wave14_2026_05_17.md |
| 6 | project_commchannels_apps_tabs_wave17_2026_05_18.md, 04-feature-parity-matrix/comms-hub.compare.md |
| 7 | Same as Wave 6 |
| 8 | flows/Add User.md, 06-validation-by-feature MATRIX |
| 9 | pages/edit-user/ folder |
| 10 | flows/Edit Node.md |
| 11 | pages/wallets-and-balance-management/, 04-feature-parity-matrix/wallet-balance-management.compare.md |
| 12 | pages/contracts-list/, pages/edit-contract/, 04-feature-parity-matrix/contracts-cost-management.compare.md |
| 13 | 04-feature-parity-matrix/marketplace-applications.compare.md |
| 14 | pages/create-contact-group/, pages/contact-groups-list/, 04-feature-parity-matrix/contact-groups.compare.md |
| 15 | 06-validation-by-feature/MATRIX.md §4 (16 drift items) |
| 16 | project_dark_mode_phase_e_migration_2026_05_17.md, project_dark_mode_phase_g_toggle_ui_2026_05_17.md |
| 17 | 05-capability-maps/ × 3 acc-* files |

---

## 22. Risk Register

| ID | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R-1 | FE workspace compile errors (40+ Stencil/Angular) block runtime testing | HIGH | HIGH | Pre-flight Wave 0 confirms build GREEN; if FE compile issues recur, dedicate a separate ticket to root-cause |
| R-2 | Composite gates incorrectly re-derived → security defect | MEDIUM | HIGH | Explicit Wave-17 per-role walkthrough catches surface-level leaks; Brain SK V-rules trace each composite |
| R-3 | Missing PES keys for wallet/contracts on mgmt (registry gap) | MEDIUM | MEDIUM | Wave 1 produces gap list; Wave 11/12 either add keys or accept server-side gating with documented decision |
| R-4 | Contact-groups direction reversal causes integration issues | MEDIUM | MEDIUM | Wave 14 brain load chain is comprehensive; expression-gated permissions backend-tested already |
| R-5 | Dark mode parity regressions on new surfaces | MEDIUM | LOW | Wave 16 audits all new files; Phase E pattern is mechanical |
| R-6 | Cross-app relative imports persist on contracts port | LOW | MEDIUM | Wave 12 explicitly refactors into shared lib; Adnan reviews on PR |
| R-7 | Add User role-dropdown leaks acc-owner to acc-admin actor | LOW | HIGH | Wave 8 wires role-edit reach matrix filter; verified at Wave 17 |
| R-8 | Add Client wizard accidentally exposed on mgmt | LOW | CRITICAL | Wave 2 explicitly strips folder + imports; Wave 17 verifies no entry point |
| R-9 | Falcon admin staff lose visibility of soft-deleted users on admin via accidental mgmt-side change | LOW | LOW | Wave 9 explicitly does NOT include `?includeDeleted=true` on mgmt; admin side untouched |
| R-10 | Q-AM-18 (Move + Archive) accidentally surfaced in Edit Node drawer | LOW | MEDIUM | Wave 10 explicitly does not expose; brain-grounded |

---

## 23. Open Questions / Blockers

| ID | Question | Status | Owner |
|---|---|---|---|
| Q-1 | Should `managementConsole.wallet.{view, transfer}` PES keys be added (vs. relying on server `canSave`)? | Open | Architect + Identity-svc owner |
| Q-2 | Q-UM-13 — admin OTP path for Edit User; affects Wave 9 user-details deep-link | Blocked (HALT in IMPLEMENTATION_KNOWLEDGE_MAP) | PRD lead |
| Q-3 | GAP-T-001 — Templates backend CRUD missing; blocks future template features (NOT in scope for this port) | Blocked | Backend (Templates service) |
| Q-4 | Q-UM-07 — PRD-02 Tab 2 still uncaptured; affects user-status edge cases | Blocked on Drive re-export | PRD lead |
| Q-5 | Q-AM-16 — PES catalog ↔ PRD sheet drift audit | Blocked | Architect |
| Q-6 | Q-AM-18 — Move + Archive node actions MISSING; do NOT expose in this port | Decided: do not expose | n/a |

---

## 24. Conclusion

This document defines the **complete scope** for porting the admin-console organization-hierarchy + sibling features to management-console while honoring the 3-role acc-* authority model. It maps:

- **What moves**: 6 features × 4 tabs × dozens of validators
- **What doesn't move**: Add Client wizard, Master Wallet, cross-account picker, Contract authoring, testing-charging entirely
- **Why each decision was made**: per-citation from the 7 Falcon knowledge stores
- **How to execute**: 17 atomic waves with explicit Definition of Done

**Backend PES gate is already runtime-verified 21/21 PASS** (2026-05-16). **FE rendering verification** is the final wave, blocked today on workspace Stencil/Angular compile errors that must be resolved before Wave 17.

Every claim in this document is source-prefixed. Every recipe is traceable to a flow playbook, a V-rule, a capability map, or a code line. The plan is brain-grounded.

Night-shift execution is authorized to proceed wave-by-wave following the dependency graph in §20. Any deviation must be flagged with citation.

---

## Appendix A — Test User Credentials

`[BRAIN-OUT] authority-dataset/07-cross-cutting/test-users.md`

| Username | Role | Tenant | Phone | Password |
|---|---|---|---|---|
| sysadmin | sys-admin | falcon-system | +962788090501 | Admin@1234 |
| sysops | sys-ops | falcon-system | +962788090502 | Admin@1234 |
| sysproducts | sys-products | falcon-system | +962788090503 | Admin@1234 |
| **accowner** | **acc-owner** | **test-tenant-001** | **+962788090504** | **Admin@1234** |
| **accadmin** | **acc-admin** | **test-tenant-001** | **+962788090505** | **Admin@1234** |
| **accuser** | **acc-user** | **test-tenant-001** | **+962788090506** | **Admin@1234** |

## Appendix B — PES Key Quick Reference (Mgmt Namespace)

`[CODE] libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`

```
managementConsole.enter()
managementConsole.accountHierarchy.view()
managementConsole.account.view() / .edit()
managementConsole.organization.add() / .view()
managementConsole.accountUser.add()
managementConsole.orgUser.add()
managementConsole.services.view()
managementConsole.accountSettings.view()
managementConsole.orgSettings.view()
managementConsole.users.view()
managementConsole.accountProfile.view() / .edit()
managementConsole.accountPasswordSecurityLevel.view() / .edit()
managementConsole.accountAllowedIps.view() / .edit()
managementConsole.accountQuota.view() / .edit()
managementConsole.contract.view()
managementConsole.user.add()
managementConsole.userPermissionGroup.assign()
managementConsole.userProfilePicture.upload()
contactGroup.<action>('acc')  // scope-parametrized factory
contactGroups.viewShared()    // hardcoded to acc.contact-group/view-shared
```

**Gaps to address in Wave 1:**
- `managementConsole.wallet.{view, transfer}` (not present today)
- `managementConsole.organization.edit()` (may not exist — verify in Wave 10)

## Appendix C — V-Rules Index

`[BRAIN-OUT] Brain SK/_obsidian/30-Validation/V-*.md` (25 files)

```
V-account-ip-allowlist-enforcement
V-account-limits-zero-means-no-limit
V-account-name-format-uniqueness
V-charging-insufficient-balance
V-charging-no-applicable-rate
V-charging-transfer-source-destination
V-contact-group-column-name-shape
V-contact-group-file-size-cap
V-contact-group-file-type-allowlist
V-contact-group-name-required-format
V-contact-group-share-policy-mode-mutex
V-contract-committed-value-positive
V-contract-currency-enum
V-contract-edit-status-aware-fields
V-contract-expiration-after-start
V-contract-rate-per-unit-non-negative
V-login-lockout-3-wrong-attempts
V-normal-user-limit-enforcement
V-password-complexity-per-security-level
V-password-security-level-enum
V-service-visibility-pricing-required
V-template-checker-level-integrity (blocked — out of scope)
V-template-levels-count-required-for-restricted (blocked — out of scope)
V-user-first-last-name-letters-only
V-username-format-uniqueness-immutable
```

## Appendix D — Error Code Quick Reference

`[BRAIN-OUT] authority-dataset/13-error-catalog/CATALOG.md`

| HTTP | Common error codes |
|---|---|
| 400 | RequiredFieldMissing, MaxLengthExceeded, AccountNameRequired, InvalidFileSize, InvalidFileType, FirstNameLettersOnly, LastNameLettersOnly, UsernameMustStartWithLetter, ContactGroupNameInvalidFormat, InvalidIpAddress, InvalidPriceType, InvalidPriceValue |
| 401 | InvalidCredentials |
| 403 | IpNotAllowed, ForbiddenToShareContactGroup, UserSuspended, UserPending |
| 404 | WalletNotFound, ReservationNotFound, UploadSessionNotFound |
| 409 | DuplicateTenantName, DuplicateUsername |
| 422 | InvalidValue, InvalidAccountLimits, MaxNodeLevelReached, NormalUserLimitReached, PriceValueNotConfigured, PricingTypeNotConfigured, HiddenProductMustNotHavePricing, ActivationNotAllowedForHiddenProduct, InsufficientBalance, NoApplicableRate, InvalidTransferWallets, WalletVersionConflict, ContractEditOnlyAllowedWhenPending, EffectiveDateMustBeInFuture, OtpResendLimitExceeded, InvalidVerificationCode, ChangePasswordFailed, PasswordTooShort, PasswordsDoNotMatch |
| 423 | UserLocked |
| 429 | OtpStillValid |

## Appendix E — Source-Prefix Audit (selected facts)

| Fact | Prefix | Source |
|---|---|---|
| 6 canonical roles + their PES rules | [CODE] | BuiltInRoleCatalog.cs:79-290 |
| 47 PES key factories | [CODE] | falcon-access.registry.ts:1-185 |
| Tenant-scoped p-rules | [CODE] | pes-account-role-rules.json:1-97 |
| 9 status enums | [CODE] | Enums.cs in Identity/Commerce/Provisioning |
| Backend PES gate 21/21 PASS | [BRAIN-OUT] | _runtime-verification/comms-hub-2026-05-16.md |
| 12-step copy recipe | [BRAIN-OUT] | 11-copy-playbook/copy-admin-feature-to-mgmt.md |
| Feature parity matrix | [BRAIN-OUT] | 04-feature-parity-matrix/MATRIX.md |
| V-rules × feature matrix | [BRAIN-OUT] | 06-validation-by-feature/MATRIX.md |
| Non-PES gates matrix | [BRAIN-OUT] | 10-non-pes-gates-by-feature/MATRIX.md |
| Add Client playbook (5-step folder) | [BRAIN-OUT] | understanding/pages/organization-hierarchy/Add Client/README.md |
| Mgmt-console current state (1 feature only) | [CODE] | apps/management-console/src/app/app.routes.ts + features/ |
| Admin-console org-hierarchy-page (6-slice facade) | [CODE] | apps/admin-console/.../org-hierarchy-page/ |
| Acc-owner / acc-admin / acc-user capabilities | [BRAIN-OUT] | 05-capability-maps/ |
| User status FSM (5 states) | [CODE] | Identity Enums.cs:55-62 |
| 16 validation drift items | [BRAIN-OUT] | 06-validation-by-feature/MATRIX.md §4 |
| Wave 17 commchannels integration (recent) | [MEMORY] | project_commchannels_apps_tabs_wave17_2026_05_18.md |
| Wave 15 Info panel backend integration | [MEMORY] | project_info_panel_backend_integration_wave15_2026_05_17.md |
| Wave 14 Settings tab standalone | [MEMORY] | project_settings_tab_standalone_wave14_2026_05_17.md |
| Dark mode Phase E migration | [MEMORY] | project_dark_mode_phase_e_migration_2026_05_17.md |
| Dark mode Phase G toggle UI | [MEMORY] | project_dark_mode_phase_g_toggle_ui_2026_05_17.md |
| Authorization architecture MOC | [VAULT] | falcon-wiki/00-MOCs/Authorization-Security-MOC.md |
| Local auth recipe | [VAULT] | falcon-wiki/00-MOCs/Local-Auth-Recipe.md |
| PES subject contract | [VAULT] | falcon-wiki/00-MOCs/PES-Subject-Contract.md |

---

**End of document. v1.0 · 2026-05-18 · Adnan (Jakco) · Brain-grounded · Plan-only.**
