---
type: hub
hub: implementation-knowledge-map
created: 2026-05-15
---
*** Implementation Knowledge Map — source-of-truth load order ***
*** Created 2026-05-15 by Brain SK Phase 2G — flow playbooks ***

# Implementation Knowledge Map

> **The Brain SK knowledge IS the implementation spec.** When you start a new session to implement (or validate) any frontend or backend work on Falcon, this note tells you exactly which files to load — in order — so the work is grounded in the canonical source of truth.

## 🔥 NEW (2026-05-18) — Business Scenarios Atlas + CONCLUSION KNOWLEDGE

> **The Atlas is now the master reference.** 33 volumes · 177+ entries · ~225,000 words. Source-prefixed. Truthful. Covers every user × every status × every action.

**Read order for ANY question:**

1. [`BUSINESS-SCENARIOS-ATLAS-VOL-33-CONCLUSION-KNOWLEDGE.md`](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-33-CONCLUSION-KNOWLEDGE.md) — **THE master answer key** (12 sections including 20 canonical facts + diffuse implementations + hard nots + new instructions)
2. [`BUSINESS-SCENARIOS-ATLAS-INDEX.md`](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-INDEX.md) — topic router to all 33 volumes
3. The specific volume matching your question

**Key volumes by use case:**

| Use case | Volume |
|---|---|
| "Can [role] do [action] when [state]?" | Vol 28 — Complete Matrices |
| Need mnemonic recall fast | Vol 29 — Memory Card |
| "What cascades when X happens?" | Vol 30 — Cross-Module Cascades |
| Error code lookup | Vol 31 — Error Catalog |
| Campaigns / WhatsApp / Facebook (truthful) | Vol 32 — Honest Implementation Map |
| Business meeting deep prep | Vols 1-19 (scenarios + ops + strategy) |
| Forward-looking strategic planning | Vols 20-27 (AI · industry · pricing · M&A · talent · IR · brain meta) |

**Read THIS before any implementation work:**

- 🔥 [Vol 33 §2 — The 20 Canonical Facts](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-33-CONCLUSION-KNOWLEDGE.md#2--the-20-canonical-facts) — covers ~80% of questions
- 🔴 [Vol 33 §4 — The Hard Nots](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-33-CONCLUSION-KNOWLEDGE.md#4--the-hard-nots-never-claim-these-as-falcon-features) — what Falcon does NOT do (NEVER claim otherwise)
- 🔴 [Vol 33 §6 — Critical Security Actions](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-33-CONCLUSION-KNOWLEDGE.md#6--the-4-critical-security-actions-fix-this-sprint) — must-fix vulnerabilities
- 📋 [Vol 33 §8 — New Instructions](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-33-CONCLUSION-KNOWLEDGE.md#8--new-instructions-for-future-sessions) — 10 standing rules for future sessions

---

## Theming & Tailwind knowledge — Angular-first (updated 2026-05-20)

For any task that touches styling, theming, or component visual contracts, load the Theming cluster:

- [[36-Theming/README|36-Theming Index]] — top-level cluster index (Angular-first)
- [[Tailwind CSS]] — library entry

**Theme governance (read first):**
- [[Falcon Tailwind Theme]] ★ — THE styling source of truth + 5 governance rules
- [[Falcon Component Theme Contract]] ★ — 9-section contract every component must satisfy
- [[Tailwind Falcon Alignment Scorecard]] — Angular-first delivery 95%; codebase 71% → 93% via 2-wave fix

**🟢 CURRENT delivery scope (Angular only):**
- [[Falcon Angular Wrapper Pattern]] · [[Falcon Stencil-to-Angular Bridge]] · [[Tailwind Multi-Framework Strategy]] (framework-neutral architecture overview)

**🟡 FUTURE EXTENSION (NOT current scope — placeholders only):**
- [[Falcon React Wrapper Future Pattern]] · [[Falcon Vue Wrapper Future Pattern]]

**Tokens + mental model:**
- [[Tailwind Mental Model]] (3-layer doctrine) · [[Falcon Design Tokens]] · [[Falcon Color Palette Audit]]

**Layout + sizing reference (new 2026-05-20):**
- [[Tailwind Sizing and Responsive]] · [[Tailwind Layout Flex Grid]] · [[Tailwind Spacing Radius Shadow Borders]] · [[Tailwind Utility Cheatsheet]] · [[Tailwind Official Docs Map]]

**Audit + governance tooling (new 2026-05-20):**
- [[Falcon Component Audit Scorecard]] ★ — per-component 6-dimension audit
- [[Component Theme Contract Template]] — markdown stub for new components
- [[Tailwind Implementation Review Checklist]] — pre-merge PR review

**Light Mode Visual Baseline (new 2026-05-20):**

Read these BEFORE any styling/page-building task touches code:

- [[Falcon Light Mode Visual Baseline]] ★ — overall visual identity (surfaces, colors, borders, shadows, radius, spacing)
- [[Falcon Current Color Usage Map]] — every color token with hex + where used
- [[Falcon Current Spacing Radius Shadow Map]] — dimensional vocabulary
- [[Falcon Current Hover Focus State Map]] — per-component interactive-state behavior
- [[Falcon Organization Hierarchy Visual Standard]] ★ — canonical reference page
- [[Falcon Page Visual Consistency Rules]] — 12 rules for new pages
- [[Falcon Do Not Change Visual Rules]] — 20 strict guardrails (refusal list)

**Component Recognition & Page Assembly (new 2026-05-20):**

Read these BEFORE any new page, HTML, Angular template, or component is written. The Brain must recognize each visible UI pattern and map it to an existing Falcon component first — bespoke work is last resort:

- [[Falcon Component Recognition Playbook]] ★ — UI pattern → Falcon component lookup
- [[Falcon Page Assembly Playbook]] ★ — compose components into a full page
- [[Falcon Component Selection Decision Tree]] — reuse → extend → create
- [[Falcon Component Capability Matrix]] — 9-column quick-pick reference
- [[Falcon Screenshot To Component Mapping Guide]] — 6-step process for designs / screenshots / HTML / React handoffs
- [[Falcon Component Gap Registry]] — P0/P1/P2/P3 capability gaps
- [[Falcon New Page Implementation Checklist]] — pre-merge 8-section gate

**Trigger phrases (component recognition):** `new page`, `build a page`, `convert this HTML`, `take this React design`, `screenshot to Angular`, `which Falcon component for...`, `is there a Falcon component for...`, `assemble this layout`, `Falcon-ify this`.

**Component Combination Intelligence (new 2026-05-20):**

Read these BEFORE wiring two or more Falcon components together. Answers "how do components compose?" — not just which single component to use:

- [[Falcon Component Composition Playbook]] ★ — 9 composition families (Table+Actions, Tree+Details, Form+Validation, Popup+Confirm, Stepper+Forms, Filter+Search, CardGrid, Loading/Empty/Error, Tabs+CTAs) + anti-patterns
- [[Falcon Page Region Patterns]] — 12 named page regions (R01 shell → R12 toast) with canonical layout strings, allowed components, and wrong-pattern table
- [[Falcon Component Combination Matrix]] — 7 canonical UI compositions with wiring templates, required states, known gaps, and example pages
- [[Falcon Data Table Composition Rules]] — cell templates, row actions, selection, expansion, inline-row loading, empty state, pagination, sorting, filter integration
- [[Falcon Form Composition Rules]] — control-to-wrapper mapping, CVA rules (4 known gaps), label+error pattern, grid layout, async validators, footer contract, unsaved changes guard
- [[Falcon Popup and Drawer Composition Rules]] — popup vs drawer decision table, portal contract (`[appendTo]="'body'"` mandatory), z-index ladder, focus trap, loading states, a11y
- [[Falcon Tree and Details Composition Rules]] — split layout (320 px tree), node selection signal, PathPrefix subtree fetch, tabs + CTAs, info-form edit mode, PES role-change gate, visual consistency

**Trigger phrases (composition):** `wire components`, `how do I combine`, `compose a page`, `table with actions`, `tree with details`, `form inside drawer`, `popup with form`, `wizard step form`, `how do I build a [composition name]`.

Brain Outputs SoT: [theme/](../../Brain%20Outputs/understanding/frontend/theme/) — 11 existing audits + 11 new Falcon-specific files. Component capability + gap SoT: [FALCON_COMPONENT_CAPABILITY_MATRIX](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md) + [COMPONENT_UPGRADE_BACKLOG](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md).

**Trigger phrases (Angular-first):** `tailwind`, `theme`, `falcon tailwind theme`, `component theme contract`, `component audit`, `audit scorecard`, `review checklist`, `mental model`, `tokens`, `sizing`, `resize`, `responsive`, `flex`, `grid`, `container query`, `spacing`, `radius`, `shadow`, `borders`, `dark mode`, `colors`, `angular wrapper`, `angular forms`, `palette`, `hover`, `focus`, `states`, `variants`. React/Vue triggers route to future-placeholder notes only.

## Permanent rule

When a session begins implementation work on a Falcon page, **load these artifacts before writing a single line of code or markup**:

1. **The flow playbook** for the user action (see "Flow playbooks" below). This is the most concentrated source — it pre-cross-references PRD + backend + V-rules + components + entities + permissions for that specific flow.
2. **The page note** in `_obsidian/10-Pages/<Page>.md` — Falcon components used · learning events · drifts on this page.
3. **The relevant PRD module(s)** — every requirement with cited PRD-line evidence.
4. **The relevant backend service notes** — DTO contracts and validation rules.
5. **The entity reconciliation notes (`E-*`)** — to know which backend fields drift from PRD.
6. **The V-rules** — every validation traced PRD → backend → frontend.
7. **The permission matrices** — who can do what.
8. **The page-level rule registries** in `Brain Outputs/understanding/pages/<page>/` — `UI_UX_RULES.md` · `VALIDATION_RULES.md` · `API_RULES.md` · `BUSINESS_RULES.md` · `GAP_REGISTRY.md`.

**If a playbook covers your flow, the playbook is enough to start. Everything else is referenced inside.** Drill deeper only when you find a gap or a drift in the playbook.

## Flow playbooks (the spec for implementation)

| Flow | Vault graph node | SoT file (canonical) | Page | PRD |
|---|---|---|---|---|
| Add Client (5-step wizard) | [[Add Client Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/) **folder** — 17 files (`README` + 14 section files + `PLAYBOOK`). Load `README.md` first; drill into section files per task type. | [[Organization Hierarchy]] | [[01 Account Management]] |
| Add User (3-tab wizard) | [[Add User Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20User.md) | [[Organization Hierarchy]] | [[02 User Management]] |
| Add Node (sub-node) | [[Add Node Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20Node.md) | [[Organization Hierarchy]] | [[01 Account Management]] |
| Edit Node (rename · scheduled rename · move ❌ · archive ❌) | [[Edit Node Flow]] | [`Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md`](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Edit%20Node.md) | [[Organization Hierarchy]] | [[01 Account Management]] |
| **--- Wave 4 — Page mining catch-up · 2026-05-18 ---** | | | | |
| Edit User (3 tabs · 3-endpoint save chain · OTP) | [[Edit User Flow]] | [`pages/edit-user/`](../../../Brain%20Outputs/understanding/pages/edit-user/) folder — 16 files. **HALT Q-UM-13** (admin OTP path) | [[Organization Hierarchy]] · User Details | [[02 User Management]] |
| Contracts List (mode FSM · list+add+view+edit) | [[Contracts List Flow]] | [`pages/contracts-list/`](../../../Brain%20Outputs/understanding/pages/contracts-list/) folder — 16 files | Admin Console > Contracts | [[03 Contract Packaging Charging Billing Management]] |
| Add Contract (4-step wizard) | [[Add Contract Flow]] | [`pages/add-contract/`](../../../Brain%20Outputs/understanding/pages/add-contract/) folder — 16 files | Admin Console > Contracts | [[03 Contract Packaging Charging Billing Management]] |
| Edit Contract (4 tabs · status-aware freeze · extension) | [[Edit Contract Flow]] | [`pages/edit-contract/`](../../../Brain%20Outputs/understanding/pages/edit-contract/) folder — 16 files | Admin Console > Contracts | [[03 Contract Packaging Charging Billing Management]] |
| Wallets and Balance Management (strategy + transfer drawer) | [[Wallets and Balance Management Flow]] | [`pages/wallets-and-balance-management/`](../../../Brain%20Outputs/understanding/pages/wallets-and-balance-management/) folder — 16 files | Admin Console > Wallets | [[01 Account Management]] |
| Templates List (**BLOCKED** GAP-T-001) | [[Templates List Flow]] | [`pages/templates-list/`](../../../Brain%20Outputs/understanding/pages/templates-list/) folder — 16 files. Backend CRUD MISSING. | Templates | [[05 Templates]] |
| Create Template (WhatsApp) (2-step · **BLOCKED**) | [[Create Template WhatsApp Flow]] | [`pages/create-template-whatsapp/`](../../../Brain%20Outputs/understanding/pages/create-template-whatsapp/) folder — 16 files | Templates > New | [[05 Templates]] |
| Contact Groups List (2-tab · detail · download) | [[Contact Groups List Flow]] | [`pages/contact-groups-list/`](../../../Brain%20Outputs/understanding/pages/contact-groups-list/) folder — 16 files | Admin Console > Contact Groups | [[04 Contact Group Management]] |
| Create Contact Group (4-stage · S3 upload session FSM) | [[Create Contact Group Flow]] | [`pages/create-contact-group/`](../../../Brain%20Outputs/understanding/pages/create-contact-group/) folder — 16 files | Management Console > Contact Groups | [[04 Contact Group Management]] |
| Login (3-stage · IP allowlist · OTP · first-login) | [[Login Flow]] | [`pages/login/`](../../../Brain%20Outputs/understanding/pages/login/) folder — 16 files | /login | [[02 User Management]] |
| Forgot Password (3-step · Active-only · silent OTP) | [[Forgot Password Flow]] | [`pages/forgot-password/`](../../../Brain%20Outputs/understanding/pages/forgot-password/) folder — 16 files | /login/forgot-password | [[02 User Management]] |
| Change Password (self-service · revoke all sessions) | [[Change Password Flow]] | [`pages/change-password/`](../../../Brain%20Outputs/understanding/pages/change-password/) folder — 16 files | /profile/change-password | [[02 User Management]] |
| My Profile (self-edit · Role/Status/PG hidden per BR-UM-41) | [[My Profile Flow]] | [`pages/my-profile/`](../../../Brain%20Outputs/understanding/pages/my-profile/) folder — 16 files | /profile | [[02 User Management]] |

Each playbook contains:
- Trigger / entry point
- Permission matrix (per-role, per-step)
- Step-by-step field tables (every field → PRD rule → backend DTO field → V-rule wiki-link → frontend validator)
- Backend endpoint summary (method · path · request · response · error codes)
- State / status transitions and Kafka side effects
- Error states + UX mapping
- Cross-flow dependencies
- Wiki-links to E-* entity notes (drift to be aware of)
- Wiki-links to V-rules (validation triangulation)
- Wiki-links to Falcon components used
- Implementation checklist (FE/BE)

## Load order for each task type

### Frontend implementation task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The flow playbook (e.g. Add Client/README.md)
3. Page note ([[Organization Hierarchy]] or the seeded page stub)
4. Falcon component notes wiki-linked in the playbook
5. V-rules wiki-linked in the playbook
6. E-* entity notes (only if drift is suspected)
7. [[35-Architecture/README]] for any architectural rule the task touches (forbidden patterns / quality gates)
8. [[ERROR_INDEX]] for any backend error code the FE must surface
```

### Backend implementation task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The flow playbook
3. Backend service note ([[Commerce Service]] / [[Identity Service]] / etc.)
4. Brain Outputs/understanding/backend/<service>/DTO_DICTIONARY.md
5. Brain Outputs/understanding/backend/<service>/VALIDATIONS.md
6. Brain Outputs/understanding/backend/<service>/ENDPOINT_REGISTRY.md
7. E-* entity reconciliation notes
8. V-rules wiki-linked in the playbook
9. [[47-Events/README]] for Kafka events the service produces or consumes
10. [[ERROR_INDEX]] for the error codes the service throws
```

### Cross-page / journey task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The journey playbook ([[16-Journeys/README]] → pick journey)
3. Each flow playbook the journey traverses
4. [[47-Events/README]] for Kafka events fired during the journey
5. [[ERROR_INDEX]] for failure-mode error codes
```

### Glossary / terminology task

```text
1. [[GLOSSARY_INDEX]] (or 05-Glossary/README.md)
2. The specific term note (e.g. [[Account]] vs [[Tenant]])
3. Related E-* entity note (if the term is an entity)
4. Related PRD note
```

### Full-stack / integration task

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. The flow playbook (covers FE + BE together)
3. understanding/integration/ (cross-service flows)
4. Permission matrices ([[Falcon Roles Permission Matrix]] / [[Contact Group Permission Matrix]])
5. Drill into FE or BE specifics from the playbook's wiki-links
```

### Validation task (catching drift)

```text
1. IMPLEMENTATION_KNOWLEDGE_MAP (this note)
2. VALIDATION_INDEX → 25 V-rules
3. API_INDEX → 15 E-* entity reconciliation notes
4. The relevant flow playbook's "Implementation checklist" section
```

## What "source of truth" means here

| Source | Authority |
|---|---|
| **Falcon Architecture Wiki** (`falcon-wiki/Home/Software-Architecture-Design/`) | Highest — architectural rules cannot be overridden by skill content |
| **Backend code** (`Brain Outputs/understanding/backend/<service>/`) | Concrete DTO + validator + error code authority |
| **PRD modules** (`Brain Outputs/prd/modules/`) | Business requirement authority |
| **Flow playbooks** (`Brain Outputs/understanding/pages/<page>/flows/`) | **Implementation spec — combines all of the above for a specific user action** |
| **V-rules** (`_obsidian/30-Validation/V-*.md`) | Triangulated validation: cited PRD line + backend attribute + frontend hint |
| **E-* entity notes** (`_obsidian/40-API/E-*.md`) | Side-by-side PRD entity ↔ backend DTO field reconciliation (catches drift) |
| **Page notes** (`_obsidian/10-Pages/<Page>.md`) | Page-level graph navigation |
| **Component notes** (`_obsidian/60-Components/<Component>.md`) | Falcon component dossier graph navigation |
| Falcon component dossiers (`Brain Outputs/understanding/frontend/components/<name>/`) | Component API + USAGE + TOKENS authority |
| Page learning files (`Brain Outputs/understanding/pages/<page>/PAGE_LEARNING.md` + sister files) | Page-level learning history + scorecards |

## How to verify a session is correctly grounded

Before producing any code, a session should be able to answer:

1. **Which PRD lines does this flow implement?** (cite line numbers from PRD module files)
2. **Which backend endpoint(s) will I call?** (cite from ENDPOINT_REGISTRY)
3. **What is the exact request DTO shape?** (cite from DTO_DICTIONARY)
4. **What validation will the backend enforce?** (cite from VALIDATIONS — attribute or FluentValidation rule + error code)
5. **What V-rule wiki-links apply?** (every form field should map to one)
6. **What Falcon components am I composing?** (every section/cell should map to a component note)
7. **Which permission roles can perform this action?** (cite from Falcon Roles Permission Matrix)
8. **What entity drift do I need to handle?** (cite from E-* entity reconciliation notes)

If a session cannot answer all 8 of these for the flow it's about to implement, it has not loaded enough context. Re-read the playbook + drill into its wiki-links.

## Trigger phrases for a new session

When you start a new Claude session and want to implement something:

| You type | What happens |
|---|---|
| `implement Add Client wizard` | Session loads [[Add Client Flow]] + cross-linked notes |
| `implement Add User` | Session loads [[Add User Flow]] |
| `validate Organization Hierarchy validations` | Session loads [[Organization Hierarchy]] page note + all linked V-rules |
| `what backend changes does Add Client require?` | Session loads [[Add Client Flow]] → backend-endpoint section + drilled E-* entities |
| `which V-rules apply to Settings tab?` | Session loads [[Organization Hierarchy]] → V-rules section |

## Tags

#type/index #prd/01 #prd/02 #service/commerce #service/identity #drift #gap

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]] · [[APPROVED_PATTERNS_INDEX]]
