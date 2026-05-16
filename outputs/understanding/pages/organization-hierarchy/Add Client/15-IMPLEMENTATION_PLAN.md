---
type: implementation-plan
purpose: frontend-only-plan-zero-code
playbook: Add Client wizard
page: Organization Hierarchy
prd: PRD-01 Account Management (+ PRD-02 trigger via Step 5)
created: 2026-05-16
status: locked-pending-tier-0-decisions
scope: frontend only (no backend; no code in this doc)
implementation-owner: Ammar Mk
estimated-effort: 5 sessions (1 per step), preceded by 1 Tier-0 session
related-flows:
  - Add User (must share stepper component with Add Client)
  - Add Node (separate, post-create dependency)
  - Edit Node (separate)
---

*** Add Client — Implementation Plan (Frontend Only) ***
*** Locks the canonical sequence and decisions BEFORE code is written ***
*** Consumes the full Add Client playbook + brain knowledge graph ***
*** Implementation by Ammar — this doc is the spec, not the code ***

# 🧭 Add Client — Frontend Implementation Plan

> The end-to-end implementation plan for the **Add Client** 5-step wizard on Organization Hierarchy. Frontend only. No backend changes. Every step references the canonical playbook + Falcon library + rulebook + ADRs + anti-pattern catalog from the morning's brain build-out.

## Why this plan exists

The Add Client playbook (16 files, 62 KB) tells you **what to build**. This plan tells you **the exact order to build it, the exact components to use, the exact rules to obey, the exact gaps you'll hit, and what to do about them.** It is the bridge between the brain and the code editor.

Read once. Implement step by step. Stop after each step to verify acceptance.

---

## 📋 Section 0 — Executive summary

| Thing | Value |
|---|---|
| Page | Organization Hierarchy (`apps/admin-console/.../organization-hierarchy-page`) |
| Wizard | Add Client — 5 mandatory + optional steps |
| Transport | One composite `CreateAccountRequest` POSTed to Commerce on Step 5 submit |
| Cross-flow | Step 5 fires Kafka `UserCreationRequested` → Identity → Add User flow runs server-side |
| Permission gate | PES `Allow` on `Add Client` action + Falcon role matrix (sys-admin / operation* / product) |
| Implementation owner | Ammar Mk |
| Estimated sessions | 6 (1 Tier-0 + 5 per-step) |
| Code change scope | `apps/admin-console/**` + `libs/falcon-ui-core/**/falcon-wizard/` + `libs/falcon-ui-core/**/falcon-stepper/` |
| Backend work needed | **None** for this flow's MVP |

*Operation cannot add Client per the role matrix — `Add Client` is `Not Allow` for Operation per the Permission list. They CAN run Add User on existing clients.

---

## 🚦 Section 1 — Pre-flight (load these before any work)

Per Brain SK CLAUDE.md "Permanent Rule: Flow Playbooks Are the Implementation Spec," the canonical sequence is:

1. `_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md`
2. The Add Client playbook folder (all 16 files) — `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`
3. Cross-flow: Add User playbook (`flows/Add User.md`) — for stepper unification (Section 2)
4. Component dossiers for every `<falcon-*>` in the components table
5. The 39-rule rulebook (especially R-FE-* and R-NOOR-*)
6. The 8 ADRs (especially ADR-005 dual-render, ADR-008 feature folders)
7. The Anti-Pattern Catalog — 71 entries, scan for any matching this flow's surface
8. Open Decisions Queue rows (R-NOOR-003 amendment, the 3 HIGH anti-patterns)

### The 8 verification questions for "session correctly grounded"

If you cannot answer all 8 with file citations, you are not ready to implement.

1. ✅ Where is the `CreateAccountRequest` shape canonically defined?
2. ✅ Which Falcon components compose Step 1? Step 5?
3. ✅ What is the customization order rule (R-FE-005)?
4. ✅ Why must Add Client and Add User share the same stepper?
5. ✅ What is the casing convention for Commerce-bound requests?
6. ✅ Which V-rules fire on Step 1 Account Name?
7. ✅ What happens to `UserCreationRequested` after Step 5 submit?
8. ✅ Where do the 14 documented PRD↔DTO drifts surface in code?

---

## 🛠 Section 2 — Tier 0: Stepper unification (BEFORE Step 1)

**This is the user's specific request and is the gating prerequisite for everything else.**

### The current state — three different step-indicator components in two flows

| Flow | Step indicator | Shell | Location |
|---|---|---|---|
| **Add Client** (legacy, current consumer) | `<falcon-stepper-legacy>` | `<falcon-dialog>` (modal) | `libs/falcon-ui-core/**/falcon-stepper-legacy/` |
| **Add Client** (modern target) | `<falcon-stepper>` | `<falcon-wizard>` | `libs/falcon-ui-core/**/falcon-stepper/` + `falcon-wizard/` |
| **Add User** (current target) | `<falcon-tabs>` | `<falcon-wizard>` | `libs/falcon-ui-core/**/falcon-tabs/` + `falcon-wizard/` |

**The user's directive:** Add Client must use the **same** stepper as Add User. Today they don't. Three components doing similar things creates drift, doubles maintenance, and prevents shared UX patterns (error states, progress, RTL, accessibility).

### The unification decision (resolves a Decisions Queue row)

Pick **ONE** step-indicator component to be canonical for both flows.

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| **A. Both use `<falcon-stepper>`** (Add User migrates from `<falcon-tabs>`) | Clear progress indicator with step numbers + error state per step. Better for 5-step wizards like Add Client. | Add User's PRD says "tabs" — semantic drift. Need PRD reconciliation. | ⚖️ semi-recommended if 5-step UX is the target |
| **B. Both use `<falcon-tabs>`** (Add Client migrates from `<falcon-stepper-legacy>`) | Matches PRD-02 wording for Add User. Tabs are friendlier for short flows. | Less suitable for 5 sequential mandatory steps with error states. Add Client loses progress affordance. | ❌ not recommended |
| **C. New unified `<falcon-wizard-stepper>` component** that wraps both visual modes (stepper or tabs) via input | Best of both worlds. One canonical component. Single API surface. | Requires new library work. Adds complexity to `falcon-wizard` family. | ✅ **RECOMMENDED for long-term** |
| **D. Status quo, document the divergence** | No work today. | Tech debt compounds. User explicitly rejected this. | ❌ ruled out by user |

**RECOMMENDED PATH: Option C** — new unified `<falcon-wizard-stepper>` skeleton (Stencil) + Angular wrapper, with `[visualMode]="'stepper' | 'tabs'"` input. Both flows consume it; both call the same component; visual difference is a prop, not a different component.

### Tier 0 deliverables (1 session before any per-step work starts)

1. **Author the new `<falcon-wizard-stepper>` skeleton** in `libs/falcon-ui-core/src/components/falcon-wizard-stepper/`:
   - Stencil component, dual-render (Shadow + `-tw` variant per ADR-005)
   - Inputs: `steps: WizardStep[]`, `currentStep: number`, `visualMode: 'stepper' | 'tabs'`, `errorSteps: number[]`, `disabledSteps: number[]`
   - Outputs: `stepChange` (with from + to + reason), `stepError`, `stepHover`
   - Slots: `<slot name="step-content"/>` (per-step body), `<slot name="actions"/>` (footer buttons)
   - Tokens: `falcon-wizard-stepper.tokens.css` (per Token Taxonomy convention)
   - Falcon library tier: composite (composes `<falcon-button>` for nav + `<falcon-status-badge>` for error states)
2. **Author the Angular wrapper** at `libs/falcon-ui-core/angular-wrapper/falcon-wizard-stepper/`:
   - `<falcon-angular-wizard-stepper>` tag
   - `useTailwind: boolean` input (default `true` per ADR-005)
   - Type-safe `WizardStep` interface exported from wrapper
3. **Write the 6-file dossier** at `Brain Outputs/understanding/frontend/components/falcon-wizard-stepper/`:
   - OVERVIEW · API · USAGE · TOKENS · GAPS_AND_UPGRADES · DECISION
4. **Migrate `<falcon-wizard>`** to compose `<falcon-wizard-stepper>` internally (so existing consumers benefit transparently)
5. **Deprecate `<falcon-stepper-legacy>`** — set `status: deprecated` in DECISION.md, list the migration target as `<falcon-wizard-stepper>` with `visualMode='stepper'`
6. **Update the Component Atlas** + Tier 1 dossier index
7. **Add R-FE-NEW rule:** "Multi-step flows in admin-console must use `<falcon-wizard-stepper>`; new uses of `<falcon-stepper-legacy>` are violations"
8. **Update both playbooks** (Add Client + Add User) to reference the unified component

### Tier 0 acceptance criteria

- ✅ `<falcon-wizard-stepper>` skeleton + Angular wrapper build green
- ✅ Both `visualMode='stepper'` and `visualMode='tabs'` render correctly in showcase
- ✅ RTL parity confirmed (both modes mirror correctly under `dir="rtl"`)
- ✅ Component dossier complete (6 files) + Atlas updated
- ✅ Legacy stepper marked deprecated with clear migration target
- ✅ Add Client playbook (this folder's 09-COMPONENTS.md) updated to point at the unified component

**Estimated effort:** 1 full session. The user implements; this plan is the spec.

---

## 📐 Section 3 — Per-step implementation breakdown

Each step below is its own session. Build → verify → commit (per `feedback_never_commit_without_explicit_permission`) → next step.

### Step 1 — Account Information (mandatory)

**Reference:** [02-STEP_1_BASIC_INFO.md](02-STEP_1_BASIC_INFO.md)

**Fields:**
- Account Name (mandatory, letters-prefix per `V-account-name-format-uniqueness`)
- Classification (dropdown: Government / Charity / Private — sourced from PRD-AM Classification)
- Profile Picture (`<falcon-single-uploader>`)
- Official Data section:
  - Authority Letter (dropdown — drives conditional fields)
  - Country / City / Sector (cascade dropdowns)
  - VAT (text)
  - Finance ID (free-text per Q-AM-06 default — until clarified)
  - Address (text + `<falcon-textarea>` for "Additional Address")
  - Budget Number (conditional on Authority Letter type, per gap #4)

**Falcon components (customization order applied):**

| Use | Component | Tier |
|---|---|---|
| Form shell | Tailwind grid (`grid grid-cols-2 gap-4 ...`) per Noor R-NOOR-001 | n/a |
| Text input | `<falcon-angular-input>` | wrapper |
| Multi-line text | `<falcon-angular-textarea>` | wrapper |
| Dropdown | `<falcon-angular-dropdown>` | wrapper |
| Image upload | `<falcon-angular-single-uploader>` | wrapper |

**Validations (V-rules to enforce on FE):**

| Field | Rule | Source |
|---|---|---|
| Account Name | letters-prefix + 100-char cap + uniqueness (server-checked) | `V-account-name-format-uniqueness` |
| Classification | required | PRD-AM BR-* |
| Authority Letter | required + cascade Sector dropdown | PRD-AM |
| Finance ID | required (BR-AM-05) | drift gap #3 |
| Budget Number | required if Authority Letter ∈ {Government, Charity} | drift gap #4 (undocumented) |

**Drift handling (from 13-GAPS_AND_DRIFTS):**

- **Drift #3 (Finance ID):** treat as free-text required input until Q-AM-06 resolves. Surface as Light Learning event the first time backend rejects.
- **Drift #4 (Budget Number):** apply conditional required logic on FE. Comment in code: `// per drift #4 — undocumented PRD origin`.

**Anti-patterns to avoid (from Anti-Pattern Catalog):**

- ❌ **T-AP-01 — using arbitrary `text-[Npx]` typography** — use the token-backed `text-{xs..5xl}` scale
- ❌ **C-AP-01 — Stencil @Prop name clashing with HTMLElement member** — verify field names like `title` are not used as Stencil @Prop (rename to `titleText` if needed, per the falcon-empty-data lesson)
- ❌ **F-AP-02 — putting state in a service that should be a signal** — Step 1 form is component-local until submit; signals only

**Acceptance criteria:**

- ✅ All required fields enforce client-side `required` + length caps matching the PRD
- ✅ Authority Letter dropdown change triggers Sector dropdown re-fetch
- ✅ Profile Picture preview renders correctly + supports remove
- ✅ Form state persists in component signals (NOT a service yet)
- ✅ "Next" button disabled until Step 1 is valid
- ✅ Build green: `nx build admin-console`
- ✅ Re-run audit: zero new R-FE-* violations on touched files

**Estimated effort:** 1 session.

---

### Step 2 — Account Settings (mandatory)

**Reference:** [03-STEP_2_SETTINGS.md](03-STEP_2_SETTINGS.md)

**Fields:**
- Password Security Level (dropdown — **DRIFT: backend uses Low/Medium/High/Strict, PRD uses Normal/Advanced**)
- Allowed IPs (multi-input or chip-input — `<falcon-angular-multi-select>` with custom IP-pattern validator)
- Max Normal User Limit (number)
- Max System User Limit (number)
- Max Node Level (number)
- Balance Transfer Limit % (number, suffix `%` on display)

**Falcon components:**

| Use | Component |
|---|---|
| Password level | `<falcon-angular-dropdown>` |
| IP allowlist | `<falcon-angular-multi-select>` (with `[allowCreate]="true"` for chip-style entry) |
| Numeric limits | `<falcon-angular-input-number>` |

**Drift handling:**

- **Drift #1 (HIGH — Q-UM-12):** display PRD labels (Normal / Advanced), submit backend codes (Low / Medium / High / Strict). Recommended mapping: `Normal → Medium`, `Advanced → Strict`. **Lock the mapping** before code; surface to user for sign-off.
- **Drift #5 (limit fields lack `[ThrowIf*]`):** FE enforces empty/negative validation, comment with `// per drift #5 — handler-level only on BE`
- **Drift #13 (BalanceTransferLimit% vs BalanceTransferLimit):** UI displays `%` suffix, serializer maps to bare `BalanceTransferLimit`. Document in code.

**Anti-patterns to avoid:**

- ❌ **T-AP-04 — non-monotonic typography** — use `text-base` for labels, not `text-xl` (G-02 gap)
- ❌ **F-AP-04 — storing form state in localStorage** — component signal only

**Acceptance criteria:**

- ✅ Password level dropdown shows PRD labels, submits backend codes (verify via Network tab pre-flight)
- ✅ IP allowlist accepts valid IPv4 / IPv6 / CIDR; rejects garbage
- ✅ Numeric limits: empty + negative are blocked client-side
- ✅ Build green
- ✅ Zero R-FE-* + R-NOOR-* violations on touched files

**Estimated effort:** 1 session.

---

### Step 3 — Configuring CommChannels & Services (optional)

**Reference:** [04-STEP_3_COMM_CHANNELS.md](04-STEP_3_COMM_CHANNELS.md)

**Per-channel fields (one row per CommChannel — sourced from Commerce `GET /api/Setting/comm-channel-configs`):**
- Visibility (toggle: Show / Hide)
- PricingType (dropdown: enum from PRD-AM)
- PriceValue (number, currency)

**Falcon components:**

| Use | Component |
|---|---|
| Row table | `<falcon-angular-data-table>` (NOT a custom HTML table — per R-FE-005) |
| Per-row toggle | `<falcon-angular-switch>` (NOT `<falcon-angular-toggle>` — verify which exists) |
| Per-row dropdown | `<falcon-angular-dropdown>` inside the table cell |
| Per-row price | `<falcon-angular-input-number>` |
| Channel icon | `<falcon-angular-icon>` |
| Channel name | `<falcon-angular-tag>` |

**Drift handling:**

- **Drift #10 (status 6-value enum not exposed):** don't try to read status on Add Client — it doesn't surface until post-create. Out of scope.
- **Drift #11 (`AppId` overloaded for CommChannels AND Apps):** type alias `type CommChannelOrAppId = string` with JSDoc. Used here AND in Step 4.

**Anti-patterns to avoid:**

- ❌ **C-AP-07 — raw `<table>` element** — must use `<falcon-data-table>`
- ❌ **R-AP-03 — hardcoded route slugs** — table row navigation must use route constants

**Acceptance criteria:**

- ✅ `<falcon-data-table>` renders one row per CommChannel
- ✅ Visibility toggle persists per-row in local form state
- ✅ Skip step button works (this step is optional per PRD)
- ✅ "Next" available even with all rows untouched
- ✅ Build green

**Estimated effort:** 1 session.

---

### Step 4 — Configuring Applications & Services (optional)

**Reference:** [05-STEP_4_APPS_SERVICES.md](05-STEP_4_APPS_SERVICES.md)

**Same shape as Step 3** but for Apps (sourced from `GET /api/Setting/application-configs`).

**Implementation note:** Step 3 and Step 4 are essentially identical UX with different data sources. Build them as **one reusable `<app-service-row-table>` Angular component** in `apps/admin-console/.../add-client/shared-components/service-row-table/`. Step 3 passes `kind="commChannel"`, Step 4 passes `kind="app"`. Single component, two consumers, zero duplication.

**Anti-patterns to avoid:**

- ❌ **F-AP-07 — copy-paste duplication** — Step 3 and Step 4 MUST share the row-table component, not be two separate templates
- ❌ **C-AP-04 — nested Falcon component without slot** — if you need custom row content, use the data-table's row template slot (per `falcon-data-table` API.md)

**Acceptance criteria:**

- ✅ Step 3 + Step 4 share the same row-table component
- ✅ App data source confirmed (verify `GET /api/Setting/application-configs` exists; if not, surface as gap)
- ✅ Skip step button works
- ✅ Build green

**Estimated effort:** 0.5 session (because the row table is reused from Step 3).

---

### Step 5 — Account Owner Creation (mandatory) — **the heaviest step**

**Reference:** [06-STEP_5_ACCOUNT_OWNER.md](06-STEP_5_ACCOUNT_OWNER.md)

**Cross-flow:** this step creates the **first Account Owner user** for the new account. Same `CreateUserRequest` shape as Add User flow, but transported via Commerce → Kafka → Identity (server-side); FE never calls Identity directly.

**Fields:**
- First Name
- Last Name
- Username (immutable, 30-char cap per drift #2 — **FE enforces tighter than backend's 100**)
- Email (`<falcon-angular-email-field>` — built-in `Validators.email`)
- Phone Number (`<falcon-angular-phone-field>` — E.164 / Saudi format)
- Profile Picture (`<falcon-angular-single-uploader>`)
- Role (PES-driven dropdown — call PES once on wizard open)
- Delivery Method (`<falcon-angular-radio-group>` — Email / SMS / Both)

**Falcon components:**

| Use | Component |
|---|---|
| Text fields | `<falcon-angular-input>` |
| Email | `<falcon-angular-email-field>` |
| Phone | `<falcon-angular-phone-field>` |
| Photo | `<falcon-angular-single-uploader>` |
| Role dropdown | `<falcon-angular-dropdown>` populated from PES response |
| Delivery Method | `<falcon-angular-radio-group>` |
| Submit button | `<falcon-angular-button>` (variant: primary, loading state during submit) |

**Drift handling:**

- **Drift #2 (HIGH — Username cap 30 vs 100):** FE enforces 30. Comment: `// per drift #2 — FE tighter than backend`.
- **Drift #14 (Phone/Email lack `[ThrowIfNotPassed]`):** FE enforces required. Comment: `// per drift #14 — handler-level on BE, FE enforces PRD`.
- **PES integration:** call PES `POST /pes/authorize` once on wizard open. Cache the grantable roles. **NOT** static client-side enum.

**Anti-patterns to avoid:**

- ❌ **A-AP-10 — `auth/logout` not called** — irrelevant here but **A-AP-03 (don't store auth state in localStorage)** is relevant: don't cache PES response across wizards
- ❌ **R-AP-06 — `adminConsoleGuard` commented out** — confirm route protection is active before testing in dev-serve

**Submit-time work (the final form's hardest piece):**

1. Compose the full `CreateAccountRequest` from Steps 1-5 local signals
2. Apply casing mapping (Commerce PascalCase per drift #9 — verify runtime)
3. POST to `/api/Node/create-account`
4. Surface success: toast + close wizard + refresh hierarchy tree
5. Surface failure: error mapping per [12-ERROR_STATES.md](12-ERROR_STATES.md), with step-level error badges via `<falcon-wizard-stepper>` errorSteps prop
6. Loading state on `<falcon-button>` during inflight request

**Acceptance criteria:**

- ✅ Submit composes single `CreateAccountRequest` from all 5 steps
- ✅ PES dropdown loads + caches per wizard session
- ✅ Username 30-char cap enforced FE-side
- ✅ Phone + Email required FE-side
- ✅ Server errors map to the originating step's error badge
- ✅ Success toast appears + wizard closes + tree refreshes
- ✅ Build green
- ✅ Re-run Falcon Eyes against the design reference (Round 6 plan reference in falcon-eyes reports)

**Estimated effort:** 1.5 sessions (the heaviest step).

---

## 🧰 Section 4 — Falcon component checklist

Per the customization order (R-FE-005):
**inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP**

| Step | Component | Falcon library status | Customization layer needed |
|---|---|---|---|
| Tier 0 | `<falcon-wizard-stepper>` | **NEW** — needs library work | new lib component (Tier 0 deliverable) |
| Shell | `<falcon-wizard>` | ✅ exists | inputs only |
| Shell | `<falcon-dialog>` | ✅ exists | inputs only (modal mode) |
| 1, 5 | `<falcon-input>` | ✅ exists | inputs |
| 1, 5 | `<falcon-textarea>` | ✅ exists | inputs |
| 1, 2, 3, 4, 5 | `<falcon-dropdown>` | ✅ exists | inputs + cascade pattern |
| 1, 5 | `<falcon-single-uploader>` | ⚪ in `libs/falcon/src/shared-ui/` (unmapped per Component Atlas) | verify import path |
| 2, 3, 4 | `<falcon-input-number>` | ✅ exists | inputs |
| 3, 4 | `<falcon-data-table>` | ✅ exists | template slots for per-row cells |
| 3, 4 | `<falcon-switch>` | ✅ exists | inputs |
| 3, 4 | `<falcon-icon>` | ✅ exists | inputs |
| 3, 4 | `<falcon-tag>` | ✅ exists | inputs |
| 5 | `<falcon-email-field>` | ✅ exists | inputs |
| 5 | `<falcon-phone-field>` | ✅ exists | inputs |
| 5 | `<falcon-radio-group>` | ✅ exists | inputs |
| Shell | `<falcon-button>` | ✅ exists | inputs (variant: primary/ghost/danger) |
| Shell | `<falcon-notification>` / `<falcon-toast>` | ✅ exists | inputs |

**Forbidden surface (raw HTML — must NOT appear):**
- ❌ `<input>` · `<select>` · `<button>` · `<textarea>` · `<table>` · `<dialog>`
- ❌ `<div style="...">` inline styles (R-FE-003)
- ❌ Any `.scss` file (R-FE-002)
- ❌ `text-[Npx]` arbitrary typography values (R-NOOR-003 after amendment)
- ❌ `ml-N` / `mr-N` physical spacing (R-NOOR-007) — use `ms-N` / `me-N`

---

## ✅ Section 5 — Validation matrix

Per [07-VALIDATIONS.md](07-VALIDATIONS.md). Every required field must enforce client-side validation BEFORE submit. Server validation is the safety net, not the gate.

| Step | Field | Client-side rule | Source |
|---|---|---|---|
| 1 | Account Name | required, letters-prefix, max 100 | V-account-name-format-uniqueness |
| 1 | Classification | required | PRD-AM |
| 1 | Authority Letter | required, drives Sector cascade | PRD-AM |
| 1 | Finance ID | required (drift #3 — pending Q-AM-06) | PRD-AM BR-AM-05 |
| 1 | Budget Number | required if Authority ∈ {Gov, Charity} | drift #4 |
| 2 | Password Security Level | required, map labels↔codes (drift #1) | Q-UM-12 |
| 2 | Allowed IPs | required (≥1), valid IPv4/IPv6/CIDR | PRD-AM |
| 2 | All limits | required, >0 (drift #5 — FE enforces) | drift #5 |
| 2 | Balance Transfer Limit | required, 0-100 (% suffix display, bare on wire) | drift #13 |
| 3 | (optional step — no required fields) | — | — |
| 4 | (optional step — no required fields) | — | — |
| 5 | First Name | required, letters only, max 50 | V-user-first-last-name-letters-only |
| 5 | Last Name | required, letters only, max 50 | V-user-first-last-name-letters-only |
| 5 | Username | required, format, **max 30** (drift #2 — FE tighter) | V-username-format-uniqueness-immutable |
| 5 | Email | required (drift #14 — FE enforces) | drift #14 |
| 5 | Phone Number | required (drift #14 — FE enforces), E.164/Saudi format | drift #14 |
| 5 | Role | required, populated from PES | PES-driven |
| 5 | Delivery Method | required, one of {Email, SMS, Both} | PRD-UM BR-UM-18 |

---

## 🚫 Section 6 — Anti-pattern avoidance checklist

Before each step ships, scan the diff against the Anti-Pattern Catalog. The most-relevant entries for this wizard:

| ID | Anti-pattern | Where it would creep in |
|---|---|---|
| **C-AP-01** | Stencil `@Prop` clashes with `HTMLElement` member | If the new `<falcon-wizard-stepper>` declares a `@Prop` named `title` or `state` — rename to `stepTitle`/`stepState` |
| **R-AP-03** | Hardcoded route slugs in LayoutComponent | When wiring the wizard's close/back navigation — use the org-hierarchy route constant |
| **T-AP-01** | `text-noor-*` aspiration (now amended) | Use `text-{xs..5xl}` instead — verified by morning's Token Taxonomy |
| **T-AP-04** | Non-monotonic typography (G-02) | Don't use `text-xl` for headings expecting it to be larger than `text-2xl` — it isn't |
| **S-AP-02** | BehaviorSubject where signal would do | Wizard form state must be signals; BehaviorSubject only at facade boundaries |
| **S-AP-04** | Storing form state in localStorage | Don't persist Add Client wizard draft to localStorage — component-local only (per playbook) |
| **F-AP-02** | Wrong scope on service (using `providedIn: 'root'` when feature-scoped is correct) | Add Client services live at `apps/admin-console/.../add-client/services/services.ts`, providers registered on the wizard component |
| **F-AP-07** | Copy-paste duplication between Step 3 + Step 4 | Build ONE `<app-service-row-table>` component, consumed by both steps |
| **A-AP-03** | Storing auth state in localStorage | PES response cached in-memory only, not persisted |
| **C-AP-07** | Raw `<table>` element | Use `<falcon-data-table>` for the rows-tables in Steps 3 + 4 |
| **MF-AP-05** | Refresh-token race under federation | If the wizard runs into a 401 mid-submit, the auth interceptor handles refresh — don't try to retry from the wizard |

---

## 🧪 Section 7 — Acceptance criteria (end-to-end)

The Add Client wizard is **done** when ALL of these hold:

| # | Criterion | Verification |
|---|---|---|
| 1 | Tier 0 unified `<falcon-wizard-stepper>` exists + Add User migrated to use it | Component dossier complete; Add User playbook updated |
| 2 | All 5 steps build green in `nx build admin-console` | `nx build admin-console --configuration=production` exit 0 |
| 3 | Per-step audit: zero new R-FE-* and R-NOOR-* violations | `audit-orchestrator.ps1 -OnlyRules R-FE-*,R-NOOR-* -TargetRepos C:\Falcon\Falcon\falcon-web-platform-ui` |
| 4 | Submit composes single `CreateAccountRequest` | Network tab inspection; matches `DTO_DICTIONARY.md` |
| 5 | All required-field client validations fire BEFORE submit | Manual + Falcon Eyes |
| 6 | PRD↔DTO drifts handled per the recommendations in [13-GAPS_AND_DRIFTS.md](13-GAPS_AND_DRIFTS.md) | Code review against the 14 drifts |
| 7 | RTL mode: wizard mirrors correctly under `dir="rtl"` | Manual visual check + `<falcon-wizard-stepper>` accessibility |
| 8 | i18n: every visible string comes from the i18n catalog (R-NOOR-007) | Grep for hardcoded strings in templates |
| 9 | Error states: server failures route to the originating step's error badge | Simulate via Network tab error injection |
| 10 | Success: toast + tree refresh + wizard closes | E2E manual run |
| 11 | Falcon Eyes visual parity ≥ 90% vs the design reference | Run Falcon Eyes against round-6 plan |
| 12 | Light Learning events captured for every gap encountered | `PAGE_LEARNING.md` updated for Org Hierarchy |
| 13 | No anti-patterns from Section 6 introduced | Per-step anti-pattern grep |
| 14 | No Falcon source committed until user explicitly says `commit` | Standing rule (R-XC-005) |

---

## 🧠 Section 8 — Light Learning capture protocol

Per the Brain SK "Permanent Rule: Page Learning System":

**Every surprise becomes a Light Learning event.** During implementation:

1. **A field validates differently than the playbook says** → write a `pending` event to `Brain Outputs/understanding/pages/organization-hierarchy/LIGHT_LEARNING_EVENTS.md` with screenshot + classification
2. **A Falcon component behaves unexpectedly** → file a `pending` PATTERN in `PENDING_PAGE_PATTERNS.md`
3. **The PRD says X, backend does Y** → add to `13-GAPS_AND_DRIFTS.md`'s 14-drift list as drift #15+
4. **The customization order rule fails for a real reason** → file a GAP in `GAP_REGISTRY.md`

**NEVER promote to global pattern** unless Ammar says "promote this globally" (per APPROVAL_LEARNING_GATE.md).

---

## 🥇 Section 9 — What to implement FIRST + sequencing

### Session-by-session map

| # | Session | Deliverable | Estimated effort | Build gate |
|---|---|---|---|---|
| **0** | Tier 0 — Stepper unification | `<falcon-wizard-stepper>` + dossier + Atlas update | 1 session | Both flows render in showcase |
| **1** | Step 1 — Account Information | Form fields + validations + signals | 1 session | `nx build admin-console` green; audit clean |
| **2** | Step 2 — Account Settings | Password level + IPs + limits | 1 session | Same |
| **3** | Step 3 + Step 4 — CommChannels + Apps | Reusable `<app-service-row-table>` + both steps | 1.5 sessions | Same |
| **4** | Step 5 — Account Owner Creation | PES integration + composite submit + error routing | 1.5 sessions | Same + simulated submit |
| **5** | E2E polish | Falcon Eyes parity + i18n + RTL + accessibility | 1 session | Falcon Eyes ≥ 90% |

**Total: 6 sessions.** Sessions are independent; you can pause between any two.

### THE first move

**Session 0 — author `<falcon-wizard-stepper>`** is the gating prerequisite. Without it:
- Add Client stays on the legacy stepper
- Add User stays on tabs
- The two flows diverge further
- The user's specific request goes unmet

**Per the user's directive: Tier 0 must land before Step 1 starts.**

After Tier 0:
- Step 1 is the lowest-risk per-step session (single form, ~7 fields, no complex interactions)
- It validates the unified stepper's API works for the Add Client shape
- Light Learning events from Step 1 become inputs to Steps 2-5 planning

### Optional shortcut

If Tier 0 feels too big as the first move, you can do **Tier 0 lite**: skip authoring the new component and use `<falcon-wizard>` + `<falcon-stepper>` directly in Add Client. Update Add User in a separate later session. This gets Add Client moving faster at the cost of slightly-divergent step indicators for one sprint. Not recommended — but available if scheduling demands.

---

## 🚧 Section 10 — Gaps that need YOUR decision BEFORE code

Per playbook 13-GAPS_AND_DRIFTS, some questions are open. Resolve these BEFORE you start the affected step.

| ID | Question | Blocks step | Recommendation |
|---|---|---|---|
| **D-2026-05-16-NEW-A** | Stepper unification path — Option A / B / **C (recommended)** / D? | Tier 0 + ALL | **Option C** (new unified component) |
| **Q-UM-12** | Password Security Level mapping (`Normal ↔ Medium`, `Advanced ↔ Strict`?) | Step 2 | Lock the mapping; Light Learning the first time backend disagrees |
| **Q-AM-06** | Finance ID — free-text input or system-driven readonly? | Step 1 | Default to free-text required; revisit if Finance system integration lands |
| **Q-AM-11** | Classification Category — hardcoded enum or DB lookup? | Step 1 | Default to hardcoded enum; switch to lookup if business asks |
| **Drift #4** | Budget Number conditional logic — exactly when required? | Step 1 | Apply "required if Authority ∈ {Gov, Charity}" until business clarifies |
| **Drift #9** | Commerce PascalCase casing at runtime | Step 5 | Verify in Network tab during first submit |
| **R-AP-06 fix** | Restore `adminConsoleGuard` on the admin-console route | Before testing in dev-serve | One-line uncomment; do as a separate small PR |
| **G-02 fix** | Typography scale non-monotonic (`text-xl` 28px > `text-2xl` 24px) | Pre-implementation | Swap the two values in `falcon-tailwind-tokens.css` |
| **G-04 fix** | Stray semicolon at `falcon-tailwind-tokens.css:75` | Pre-implementation | 1-min trivial fix |

---

## 📚 Section 11 — Brain artifacts this plan consumes

This plan is the consumer endpoint of the entire knowledge graph:

| Tier | Artifact | Used for |
|---|---|---|
| Page | Add Client 16-file playbook | The canonical spec — every step references it |
| Page | `flows/Add User.md` | Cross-flow context for stepper unification |
| Page | `PAGE_LEARNING.md` · `LIGHT_LEARNING_EVENTS.md` · `GAP_REGISTRY.md` | Light Learning capture targets |
| Page | `COMPONENT_MAPPING.md` · `VALIDATION_RULES.md` · `UI_UX_RULES.md` | Component + validation + layout rules |
| **Tier 1** | Component Atlas + 62 dossiers | Every `<falcon-*>` choice cross-references its dossier |
| **Tier 1** | Component Usage Matrix | Verify which components are already used in admin-console |
| **Tier 1** | Component Dependency Graph | Understand compose chains (e.g., `<falcon-alert-dialog>` composes `<falcon-dialog>`) |
| **Tier 2** | Folder Structure Deep-Dive | Where new wizard wrappers live (`apps/admin-console/.../add-client/`) |
| **Tier 2** | State Management Architecture | Signal-first; service feature-scoped; no NgRx |
| **Tier 2** | Token Taxonomy | Use real tokens (218 in @theme); NOT aspirational `text-noor-*` |
| **Tier 2** | Auth Flow Architecture | PES integration on Step 5 |
| **Tier 2** | Routing Topology | Wire wizard route + adminConsoleGuard reinstatement |
| **Tier 2** | Module Federation Topology | Wizard runs inside admin-console remote |
| **Tier 3** | ADR-001 | No PrimeNG anywhere |
| **Tier 3** | ADR-002 | Tailwind utilities only |
| **Tier 3** | ADR-004 | Stencil for the new `<falcon-wizard-stepper>` |
| **Tier 3** | ADR-005 | Dual-render path for the new component |
| **Tier 3** | ADR-008 | Feature folder pattern (`add-client/models/models.ts`, `add-client/services/services.ts`) |
| **Tier 4** | Onboarding Playbook | Confirm session-grounding via the 8 verification questions |
| **Tier 4** | Anti-Pattern Catalog | Section 6's avoidance checklist sources from here |
| Rules | 39 rules in `understanding/rules/` | Audit enforces these on the touched files |
| Detectors | `regex-runner.ps1` + `structural-walker.ps1` + LIVE AST runners | Audit gate after each step |

**Every artifact pays dividends in this plan.** Without Tier 1-4, this plan would be ~50% as precise.

---

## 🎯 Section 12 — Recommended next action

**Tell me one of:**

| You say | I do |
|---|---|
| **"start Tier 0"** | Author the `<falcon-wizard-stepper>` skeleton + Angular wrapper + dossier + Atlas update plan (still no code — I deliver the per-file specs) |
| **"start Step 1"** | Skip Tier 0 (legacy stepper stays), give detailed Step 1 file-by-file spec |
| **"resolve gaps first"** | Dispatch decisions on Q-UM-12, Q-AM-06, Q-AM-11, Drift #4 BEFORE coding |
| **"freeze the plan"** | Commit this plan to the brain repo as `15-IMPLEMENTATION_PLAN.md` in the playbook folder; you proceed at your own pace from here |
| **"add to plan"** + topic | Extend a specific section |

**My honest recommendation:** **"start Tier 0"** — the stepper unification is the gating piece per your directive, and it's the highest-leverage component work you can do (touches 2 flows + builds a reusable component for future wizards).

If Tier 0 feels heavy: **"start Step 1"** with the legacy stepper as a working scaffold, and migrate to the unified stepper after Step 5 is shipped. Pragmatic, with accepted tech debt.

---

## ✅ Plan locked

This plan is now the single source of truth for **how** to implement Add Client. The playbook tells you **what** to implement; this plan tells you **how, in what order, with what tools, using what knowledge.**

Implementation owner: **Ammar Mk**. Spec author: orchestrator (this doc). Brain artifacts consumed: ~all Tier 1-4 + Add Client playbook + Add User playbook + 39 rules + 71 anti-patterns + 218 tokens.

When you start a session, paste this plan's Section 9 row for that session as the kickoff brief. The other sections are referenced as needed.

---

## Related

- [Add Client Playbook README](README.md)
- [00-OVERVIEW](00-OVERVIEW.md) through [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — single-doc version of the 16 files
- [../flows/Add User.md](../flows/Add User.md) — cross-flow for stepper unification
- [FRONTEND_KNOWLEDGE_PATH](../../../frontend/FRONTEND_KNOWLEDGE_PATH.md) — the master roadmap
- [[Frontend Architecture Atlas]] · [[Component Atlas]]
- [[Decisions Queue]] — D-2026-05-16-NEW-A added here
- [[ANTI_PATTERN_CATALOG]]
- [[ADR-005]] (dual-render for the new component) · [[ADR-008]] (feature folder layout)

## Tags

#type/implementation-plan #flow/add-client #page/organization-hierarchy #frontend-only #plan-locked
