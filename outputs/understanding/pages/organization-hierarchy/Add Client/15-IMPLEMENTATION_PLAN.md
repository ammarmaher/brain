---
type: implementation-plan
purpose: frontend-only-plan-disk-true
version: 2 (refined 2026-05-16 PM after disk inspection)
supersedes: v1 (committed in c206449, based on stale playbook component table)
playbook: Add Client wizard
page: Organization Hierarchy
prd: PRD-01 Account Management (+ PRD-02 trigger via Step 5)
status: locked-disk-true
scope: frontend only (no backend; no code in this doc)
implementation-owner: Ammar Mk
related-flows:
  - Add User (already uses FalconStepperComponent — shared pattern, not shared component work)
  - Add Node (separate)
  - Edit Node (separate)
---

*** Add Client — Implementation Plan v2 (disk-true, frontend only) ***
*** Built from actual code inspection, not the stale playbook table ***
*** Replaces v1 — same playbook, more accurate state + per-step validations folder design ***

# 🧭 Add Client — Frontend Implementation Plan (v2)

> Disk-true implementation plan for the **Add Client** 5-step wizard. Built by inspecting the actual `falcon-web-platform-ui/apps/admin-console/.../add-client-wizard/` folder + the `validators.ts`/`validation-messages.ts`/`AccountValidationService` infrastructure that already exists.
>
> **Frontend only. No code in this doc. Implementation by Ammar.**

## What v1 got wrong (and v2 fixes)

V1's "Tier 0 — Stepper unification" was based on the playbook's 09-COMPONENTS table that called the current consumer `<falcon-stepper-legacy>`. **That table is stale.** Disk inspection 2026-05-16 PM shows:

- `add-client-wizard.component.ts` already imports `FalconStepperComponent` from `@falcon`
- `add-user-wizard.component.ts` already imports `FalconStepperComponent` from `@falcon`
- Add User additionally imports `FalconAngularStepperComponent` from `@falcon/ui-core/angular` as a "visual verification harness" (the swap is one-line revertable)
- Both wizards have all per-step folders + `models/models.ts` + `services/services.ts`

**The real work today is NOT component unification — it's:**

1. Adding the missing `validations/` folder per step (user's specific ask)
2. Wiring `AccountValidationService` async validators into the actual steps (currently Step 1 uses mock-tree local check)
3. Designing the step-init API loading pattern (password policy, PES roles, lookup catalogs)
4. Filling the V-rule + drift handling gaps
5. Making PRD-mandatory required fields enforce client-side

This plan reflects that.

---

## 📋 Section 0 — Disk-true current state

### What already exists (verified 2026-05-16 PM)

```
apps/admin-console/src/app/features/org-hierarchy-page/
├── models/
│   └── models.ts                     ✅ page-level types (ClientNode, BackendSOR, etc.)
├── services/
│   ├── services.ts                   ✅ HierarchyService
│   ├── validators.ts                 ✅ sync ValidatorFn library
│   ├── validation-messages.ts        ✅ i18n key catalog + messageFor() + hasLiveError()
│   ├── hierarchy-page-state.service.ts  ✅ 675-line page state
│   ├── mock-tree.ts                  ✅ mock data
│   ├── mock-applications.ts          ✅ mock data
│   └── otp-mock.service.ts           ✅ OTP mock
└── components/
    └── wizard-components/
        ├── add-client-wizard/
        │   ├── add-client-wizard.component.ts/html  ✅ SHELL (FalconStepperComponent + per-step signals)
        │   ├── index.ts                              ✅
        │   ├── models/models.ts                      ✅ wizard form-value types
        │   ├── services/services.ts                  ✅ AddClientApiService (POST commerce/Node/create-account)
        │   ├── client-information-step/              ✅ Step 1 — partial implementation
        │   ├── client-settings-step/                 ✅ Step 2 — partial implementation
        │   ├── client-comm-channels-step/            ✅ Step 3 — partial implementation
        │   ├── client-applications-step/             ✅ Step 4 — partial implementation
        │   ├── client-account-owner-step/            ✅ Step 5 — partial implementation
        │   └── client-service-row-table/             ✅ shared row table (Steps 3 + 4 consumer)
        └── add-user-wizard/
            ├── add-user-wizard.component.ts/html     ✅ same FalconStepperComponent pattern
            ├── models/models.ts
            ├── services/services.ts
            ├── user-personal-step/
            ├── user-role-status-step/
            └── user-permissions-step/

libs/falcon/src/shared-data-access/lib/services/
├── account-validation.service.ts     ✅ THE backend-calling async source
│   ├── checkAccountNameExists(name)  → POST commerce/Node/ValidateAccountName (SystemGateway), returns boolean
│   └── isUserExist(username, email?, phoneNumber?) → POST user/exist (IdentityGateway), returns boolean
├── http.service.ts                   ✅ shared HttpService (used by all wizards)
├── lookup.service.ts                 ✅ for cascade dropdowns
└── ...
```

### What's STUBBED / SHALLOW today

| Step | What's there | What's missing |
|------|---|---|
| 1 — Information | Form fields + sync validators + mock-tree duplicate check | **Backend async validator (`AccountValidationService.checkAccountNameExists`) — Step 1 currently only checks against `mock-tree.ts`** |
| 2 — Settings | Form fields | **Password Policy not loaded on init** (no API call for password-level rules); 4 limit fields lack documented `[ThrowIf*]` enforcement on backend (drift #5) — must enforce FE-side |
| 3 — CommChannels | Row table + per-row controls | **Catalog source unclear** — verify if `GET /api/Setting/comm-channel-configs` is wired or if mock-only |
| 4 — Applications | Same shape as Step 3 (shares row table) | Same catalog concern |
| 5 — Account Owner | Form fields + (likely) hardcoded role enum | **PES-driven role dropdown missing** (must call PES for grantable roles); **`isUserExist` async validator not wired**; **password policy bootstrap missing** |
| All | Per-step `valid` signal in wizard shell | **No per-step `validations/` folder** — validation logic is inlined in step components |

---

## 📁 Section 1 — Target folder structure (after this plan)

The convention extends the existing one. Every step folder gains a `validations/` subfolder. Per the R-FE-009 rule "one file per type-folder" — all validators for a step go in **one** file.

```
add-client-wizard/
├── add-client-wizard.component.ts/html   (unchanged shell)
├── index.ts
├── models/
│   └── models.ts                          (wizard-level types — unchanged)
├── services/
│   └── services.ts                        (AddClientApiService — unchanged)
├── client-information-step/
│   ├── client-information-step.component.ts/html
│   ├── index.ts
│   ├── models/
│   │   └── models.ts                      (NEW — step-1-only types: ClientInfoFormValue, AUTHORITY_OPTIONS, etc.)
│   │                                       (currently in ../models/models.ts — move here for locality)
│   ├── services/
│   │   └── services.ts                    (NEW — step-1 init data loading: cascade Sector dropdown, lookup tables)
│   └── validations/
│       └── validations.ts                 (NEW — step-1 sync + async validators + form schema)
├── client-settings-step/
│   ├── client-settings-step.component.ts/html
│   ├── index.ts
│   ├── models/models.ts                   (NEW — ClientSettingsFormValue + password-level enums)
│   ├── services/
│   │   └── services.ts                    (NEW — password-policy loader, IP-pattern lookup, limit defaults)
│   └── validations/
│       └── validations.ts                 (NEW — password-level mapping, IP validator, limit-range validators)
├── client-comm-channels-step/
│   ├── client-comm-channels-step.component.ts/html
│   ├── index.ts
│   ├── models/models.ts
│   ├── services/
│   │   └── services.ts                    (NEW — CommChannels catalog loader)
│   └── validations/
│       └── validations.ts                 (NEW — per-row visibility + price validators)
├── client-applications-step/
│   ├── client-applications-step.component.ts/html
│   ├── index.ts
│   ├── models/models.ts
│   ├── services/
│   │   └── services.ts                    (NEW — Apps catalog loader)
│   └── validations/
│       └── validations.ts                 (NEW — per-row validators, mirror of step-3)
├── client-account-owner-step/
│   ├── client-account-owner-step.component.ts/html
│   ├── index.ts
│   ├── models/models.ts                   (NEW — Step-5 types: UserPersonalFormValue, DeliveryMethod enum)
│   ├── services/
│   │   └── services.ts                    (NEW — PES role loader, password-policy bootstrap)
│   └── validations/
│       └── validations.ts                 (NEW — username/email/phone async validators, name validators, role gate)
└── client-service-row-table/
    ├── client-service-row-table.component.ts/html
    ├── index.ts
    ├── models/models.ts                    (NEW — shared RowConfig type)
    └── validations/
        └── validations.ts                  (NEW — per-row visibility-toggles-show / price-required validators)
```

**Convention rules:**
- ✅ One `validations.ts` file per step folder — ALL step-specific validators live there
- ✅ One `services/services.ts` per step folder — ALL step-specific HTTP / init data loaders live there
- ✅ One `models/models.ts` per step folder — ALL step-specific types live there
- ✅ All four type-folders (`models`, `services`, `validations`, plus the step component itself) follow R-FE-009 one-file-per-type-folder rule
- ✅ Shared validators (used by 2+ steps OR by the page-level state service) stay in `services/validators.ts` at the page level
- ✅ Shared HTTP services that the wizard itself uses end-to-end stay in `add-client-wizard/services/services.ts` (e.g., `AddClientApiService`)

**What NOT to move:**
- `services/validators.ts` at the page level — keep it; it's the shared library
- `services/validation-messages.ts` at the page level — keep it; it's the i18n catalog all steps use
- Backend-bound async services (`AccountValidationService`) — stay in `libs/falcon/src/shared-data-access/lib/services/` (universal singleton); each step's `validations.ts` wraps them in `AsyncValidatorFn`

---

## 🛡 Section 2 — Validation architecture (the centerpiece)

### Five layers, well-defined responsibilities

```
                       UI / Step Component
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Layer 5: validation-messages.ts          │  ← i18n key resolver (ValidationErrors → ValidationMessage)
        │           hasLiveError() + messageFor()   │     SHARED — DO NOT DUPLICATE per step
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Layer 4: services/validators.ts          │  ← pure sync ValidatorFn library
        │           (page-level shared)             │     accountNameValidator, lettersAndDigits, etc.
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Layer 3: <step>/validations/             │  ← NEW per-step folder (this plan's deliverable)
        │           validations.ts                  │     - composes shared sync validators
        │                                           │     - declares step-specific cross-field rules
        │                                           │     - exports AsyncValidatorFn factories that wrap Layer 2
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Layer 2: <step>/services/services.ts     │  ← step-init data + per-call API wrappers
        │           (NEW per-step service)          │     - loadPasswordPolicy(), loadSectorsForAuthority()
        │                                           │     - per-step adapter over AccountValidationService
        │                                           │       (debounced, signal-friendly, cancellable)
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Layer 1: AccountValidationService et al  │  ← backend-bound singletons (already exists)
        │           libs/falcon/.../shared-data-     │     - checkAccountNameExists()
        │           access                          │     - isUserExist()
        │                                           │     - (FUTURE) loadPasswordPolicy()
        └──────────────────────────────────────────┘
```

### The 5 validation types we'll wire

| Type | Where it runs | Trigger | Example |
|---|---|---|---|
| **Sync — required + format** | Layer 4 → Layer 3 | on every keystroke (live errors per `LIVE_ERROR_KEYS`) | Account Name min/max + letters-prefix |
| **Sync — cross-field** | Layer 3 | on form value change | Step 2: `MaxNormalUserLimit + MaxSystemUserLimit ≤ totalUserCap` if a cap rule exists |
| **Async — backend uniqueness** | Layer 3 → Layer 2 → Layer 1 | on field blur (NOT every keystroke — costs API call) | Account Name uniqueness, Username uniqueness, Email already-in-use |
| **Async — bootstrap rules** | Layer 2 (loader) | on step init | Password Policy: load rules, compose dynamic password validator |
| **Cross-step** | wizard shell | on Submit pre-flight | Step 5 username must be different from any user added in this same wizard draft (rare) |

### How errors surface to UI (don't re-invent — this already works)

The current code uses this exact pattern in `client-information-step.component.ts`:

1. Each form value is a **signal** (`model.required<ClientInfoFormValue>()`)
2. Each error is a **computed** that returns `ValidationMessage | null`
3. `hasLiveError(errors)` determines whether to show during typing or wait for blur
4. `messageFor(errors)` resolves error key → translated message via i18n
5. Template uses `*ngIf="error()"` to show error UI inline below field

**This pattern WORKS. Don't redesign. Adopt it for every new step + every new validator.**

### How async validators MUST be wired (the user's specific ask)

The `AccountValidationService` exists with `checkAccountNameExists()` and `isUserExist()`. But Step 1 today checks via `collectAccountNames(treeRoot)` — that's a LOCAL mock check. Real implementation must:

1. **Wrap the singleton call in an `AsyncValidatorFn`** at `client-information-step/validations/validations.ts`:
   - signature: `accountNameUniqueValidator(svc: AccountValidationService): AsyncValidatorFn`
   - inside: `(control) => svc.checkAccountNameExists(control.value).pipe(map(exists => exists ? { duplicateAccountName: true } : null))`
2. **Debounce inside the wrapper** — 350ms `debounceTime` so it doesn't fire on every keystroke (user pause = check)
3. **Cancel pending requests** when the value changes (`switchMap` not `mergeMap`)
4. **Suppress error toaster** — already handled by `notShowToaster: 'true'` header in `AccountValidationService` — confirm it propagates through
5. **Combine with sync validator** — if sync fails (e.g., name too short), DON'T call async (waste of API)
6. **Loading state in UI** — show a small spinner next to the field while async is pending; resolve to ✓ or error message

Same pattern for `isUserExist` in Step 5 for username/email/phone uniqueness.

---

## 🚀 Section 3 — Step-init API loading pattern

Several steps need to load data on init. The pattern:

### The init contract per step service

Each step's `services/services.ts` exposes a single `init$` Observable (or `initSignal()` if signal-style preferred). The step component:

1. Calls `init$` on `ngOnInit` (or `effect()` if signal)
2. Shows loading skeleton while pending
3. Replaces skeleton with form when resolved
4. Shows error fallback if rejected (cached defaults + Light Learning event)

### Per-step init data table

| Step | What loads on init | Endpoint / source | Defensive fallback |
|---|---|---|---|
| 1 — Information | Authority Letter options + Country/City/Sector cascade | `LookupService.getLookup(authorityLookupId)` + cascade endpoints | Use hardcoded `AUTHORITY_OPTIONS` from models if API fails; surface Light Learning event |
| 1 — Information | Classification Category / Subcategory | `LookupService.getLookup(classCatLookupId)` (per drift Q-AM-11) | Use hardcoded `CLASS_CAT_OPTIONS` if API fails |
| 1 — Information | Profile-picture upload pre-signed URL | Not on init — on submit; out of scope here | n/a |
| 2 — Settings | **Password Policy** (per security level: min length + complexity rules) | NEW endpoint — **needs backend confirmation** (gap: not in playbook 08-BACKEND_API.md) | Use hardcoded policy with `passwordsAtLeast8` as minimum |
| 2 — Settings | IP-pattern validator config | Static — no API call needed | n/a |
| 3 — CommChannels | CommChannels catalog (one row per channel) | `GET /api/Setting/comm-channel-configs` | Use `mock-applications.ts` fallback |
| 4 — Applications | Apps catalog (one row per app) | `GET /api/Setting/application-configs` (per playbook) — **verify exists** | Use mock catalog fallback |
| 5 — Account Owner | **PES grantable roles** for current actor + target node | `POST /pes/authorize` (per playbook 01-PERMISSIONS + Auth Flow Architecture) | Fall back to safest minimum (Normal User only); surface Light Learning event |
| 5 — Account Owner | **Password Policy** (server-generated password preview) | Same endpoint as Step 2's policy load — share the result via wizard state | Same fallback as Step 2 |
| 5 — Account Owner | Delivery method options | Static enum (Email / SMS / Both) | n/a |

### Where init data lives once loaded

- **Step-local data** (e.g., per-step catalog) → step component signal
- **Wizard-shared data** (e.g., Password Policy used by Step 2 AND Step 5) → wizard-level signal in `add-client-wizard.component.ts` OR a wizard-level `AddClientStateService` (new) injected into both steps

**Decision recommendation:** put wizard-shared state in a new `add-client-wizard/services/add-client-state.service.ts` (provided at the wizard component level via `providers: [...]`, NEVER `providedIn: 'root'` — per the R-FE-009 + state-mgmt doctrine).

---

## 🔌 Section 4 — Async validator wiring (the user's specific custom-validation ask)

The two backend-bound checks the user mentioned:

### 4.1 Account Name uniqueness (Step 1)

**Current state:** Step 1 only checks `collectAccountNames(treeRoot)` — local mock data. Not safe for production.

**Target state:**

1. **`client-information-step/validations/validations.ts`** exports:
   ```
   accountNameUniqueValidator(svc: AccountValidationService): AsyncValidatorFn
   ```
2. **`client-information-step.component.ts`** injects `AccountValidationService` from `@falcon`
3. **Account Name signal** has both sync (`accountNameValidator` from `services/validators.ts`) AND async wrapper applied
4. **Trigger order**: sync first; if sync passes, async runs after 350ms debounce
5. **UI state**: while async pending, show spinner; on result, show ✓ or `duplicateAccountName` error
6. **Cancellation**: typing during pending check cancels the in-flight request (`switchMap`)

### 4.2 Username uniqueness (Step 5)

**Current state:** Step 5's `usernameTaken()` is computed locally — need to verify what source it reads.

**Target state:**

1. **`client-account-owner-step/validations/validations.ts`** exports:
   ```
   usernameUniqueValidator(svc: AccountValidationService): AsyncValidatorFn
   emailUniqueValidator(svc: AccountValidationService): AsyncValidatorFn
   phoneUniqueValidator(svc: AccountValidationService): AsyncValidatorFn
   ```
2. **Composite check via `isUserExist`** — the existing service takes `(username, email?, phoneNumber?)`. Two options:
   - **Option A:** call `isUserExist` 3 times (once per field) — cheap to debounce, simple
   - **Option B:** call `isUserExist` once with all 3 fields once any blur — saves API calls; needs composite error mapping
   - **RECOMMENDATION: Option A** — simpler, debounce per field, individual error attribution
3. **Same pattern as Account Name**: sync first, debounce, cancel-on-change, suppress toaster

### 4.3 Backend-bound validators ALWAYS-WORK requirement

User said: *"the validation must always work"*. Concrete steps:

- ✅ **Defensive**: if `AccountValidationService` returns an error (network down, 500), treat as `null` (no error) — DON'T block the user. Server submit is the safety net. Light Learning event captures the failure.
- ✅ **Idempotent**: same field value always yields same async result (cache by value if hit-rate is high)
- ✅ **Race-safe**: switchMap cancels stale requests; in-flight requests don't override fresh values
- ✅ **Observable cleanup**: every async validator uses `takeUntilDestroyed(inject(DestroyRef))` so it doesn't leak past component lifecycle
- ✅ **Loading state**: UI shows pending state DURING the check; never silently waits

---

## 📐 Section 5 — Per-step plan (5 steps + shared row table)

### Step 1 — Account Information

**Status today:** Step component exists; uses sync validators from `services/validators.ts`; checks duplicate name against mock tree.

**Files to create:**
- `client-information-step/models/models.ts` — move step-1 types here (AUTHORITY_OPTIONS, CLASS_CAT_OPTIONS, sectorForAuthority(), budgetLabelKeyForAuthority(), ClientInfoFormValue, etc.) from `add-client-wizard/models/models.ts`. Keep models.ts at wizard level for cross-step shared types only.
- `client-information-step/services/services.ts` — new step service:
  - `init$` Observable: loads Authority + Classification + Country/City/Sector cascade via `LookupService`
  - `loadSectorsForAuthority(authorityId)` — cascade endpoint
  - Caches lookups in service-local signals
- `client-information-step/validations/validations.ts` — new validation layer:
  - `step1Validators` — composes `accountNameValidator`, `anyStringValidator(2, 100)`, `nationalIdValidator` etc. from shared library
  - `accountNameUniqueValidator(svc)` AsyncValidatorFn factory (the user's specific custom validator)
  - `step1IsValid(value)` — pure function: takes the form value, runs all validators, returns boolean (used by wizard shell's `step1Valid` signal)
  - `step1FieldErrors(value)` — returns per-field error map for UI

**Validation matrix for Step 1:**

| Field | Sync rules | Async rules | Init data dependency |
|---|---|---|---|
| Account Name | required · letters-prefix · 2-100 chars · `accountNameValidator` | **`accountNameUniqueValidator`** → `AccountValidationService.checkAccountNameExists` | none |
| Classification Category | required | none | LookupService classification options |
| Classification Subcategory | required when category selected | none | LookupService (cascade) |
| Profile Picture | optional · max 2MB · image MIME types | none | none |
| Authority Letter | required | none | LookupService authority options |
| Country | required | none | LookupService countries |
| City | required when country selected | none | LookupService (cascade by country) |
| Sector | required (cascade from Authority Letter) | none | LookupService (cascade by authority) |
| VAT | optional · format `\d{15}` (15-digit Saudi VAT) | none | none |
| Finance ID | required (per drift #3) · 2-50 chars | none | none |
| Address | optional · 0-250 chars | none | none |
| Additional Address (textarea) | optional · 0-500 chars | none | none |
| Budget Number | conditional required (Authority ∈ {Government, Charity}) · numeric | none | none |

**Falcon components (confirmed from existing code):**

- `<falcon-angular-input>` (text fields)
- `<falcon-angular-dropdown>` (all dropdowns)
- `<falcon-angular-form-field>` (label + error wrapper — already in use)
- `<falcon-angular-photo-uploader>` (Profile Picture — confirmed import from current code, NOT `<falcon-single-uploader>` as playbook said)
- `TranslatePipe` (i18n strings)

**Anti-patterns to actively avoid** (from the 71-pattern catalog):

- ❌ **C-AP-07** raw `<select>` instead of `<falcon-angular-dropdown>`
- ❌ **T-AP-01** arbitrary `text-[Npx]` typography — use `text-{xs..5xl}` (assuming R-NOOR-003 amendment lands; if not, current `text-base / text-sm / text-xs` still recommended)
- ❌ **F-AP-04** any localStorage persistence of wizard draft (component-scoped signals only)
- ❌ **S-AP-02** using BehaviorSubject where a signal would do (use `signal()` + `computed()` throughout)

### Step 2 — Account Settings

**Status today:** Step component exists; form fields present; password policy NOT loaded from backend.

**Files to create:**
- `client-settings-step/models/models.ts` — `ClientSettingsFormValue`, `PasswordSecurityLevel` enum (backend codes Low/Medium/High/Strict), display-label mapping (Normal/Advanced per drift #1)
- `client-settings-step/services/services.ts` — new step service:
  - `loadPasswordPolicy(level: PasswordSecurityLevel)` — loads server-driven password rules for selected level
  - `init$` — loads default policy + IP-allowlist defaults
- `client-settings-step/validations/validations.ts`:
  - `step2Validators` — composes `cidrOrIpValidator`, `intInRange(1, 999)`, `percentage(0, 100)`
  - `dynamicPasswordValidator(policy)` — composes password rules from loaded policy
  - `step2IsValid` + `step2FieldErrors`

**Validation matrix for Step 2:**

| Field | Sync rules | Async rules | Init data dependency |
|---|---|---|---|
| Password Security Level | required · valid enum | none | none (static enum) |
| Allowed IPs | required (≥1) · each item must match IPv4/IPv6/CIDR regex | none | none |
| Max Normal User Limit | required · int · 1-999 (drift #5 — FE enforces because BE missing `[ThrowIf*]`) | none | none |
| Max System User Limit | required · int · 1-999 | none | none |
| Max Node Level | required · int · 1-999 | none | none |
| Balance Transfer Limit (%) | required · int · 0-100 (drift #13 — display `%` suffix, serialize bare) | none | none |

**Drift handling (specific code-level notes):**

- **Drift #1 (HIGH — password level vocabulary)**: Step 2's dropdown displays PRD labels (Normal/Advanced), submits backend codes (Low/Medium/High/Strict). Lock the mapping in validations.ts. Recommended: `Normal → Medium`, `Advanced → Strict`. **Light Learning event** if backend rejects the mapping.
- **Drift #5 (limit fields lack `[ThrowIf*]`)**: comment in validations.ts: `// per drift #5 — FE enforces strict; BE only handler-level validation via InvalidAccountLimits (422)`
- **Drift #13 (BalanceTransferLimit%)**: UI input has `%` suffix indicator; serializer in wizard's `services.ts` strips the `%` before sending

### Step 3 — Configuring CommChannels & Services

**Status today:** Step component exists + shared `client-service-row-table` already extracted.

**Files to create:**
- `client-comm-channels-step/models/models.ts` — `ClientCommChannelsFormValue` (array of row configs), `CommChannelRowConfig`
- `client-comm-channels-step/services/services.ts`:
  - `loadCommChannelsCatalog()` — fetches the channels list from backend
  - Returns observable of catalog + caches in signal
- `client-comm-channels-step/validations/validations.ts`:
  - `step3Validators` — per-row visibility + price-required-when-shown
  - This step is OPTIONAL per PRD — `step3IsValid` returns `true` by default if user skips

**Validation matrix for Step 3:**

| Field (per row) | Sync rules | Async rules |
|---|---|---|
| Visibility (toggle) | none — just a boolean | none |
| PricingType | required IF Visibility = Show | none |
| PriceValue | required IF Visibility = Show · positive number | none |

### Step 4 — Configuring Applications & Services

**Status today:** Step component exists + shares `client-service-row-table` with Step 3.

**Files to create:** mirror of Step 3 structure (`models/`, `services/`, `validations/`).

**Key insight:** Step 3 + Step 4 should pass `kind: 'commChannel' | 'app'` to the shared `client-service-row-table` so the row component drives its validator behavior accordingly. **No duplicated validation logic between Step 3 and Step 4.**

### Step 5 — Account Owner Creation

**Status today:** Step component exists; uses some local validation; PES integration likely hardcoded.

**Files to create:**
- `client-account-owner-step/models/models.ts` — `ClientAccountOwnerFormValue`, `UserRoleKey`, `DeliveryMethod` enum
- `client-account-owner-step/services/services.ts`:
  - `loadGrantableRoles()` — calls PES once on wizard open → caches in signal
  - `loadPasswordPolicy()` — same as Step 2 (share via wizard state if implemented)
- `client-account-owner-step/validations/validations.ts`:
  - `step5Validators` — name validators, email format, phone format
  - **`usernameUniqueValidator(svc)`** AsyncValidatorFn factory
  - **`emailUniqueValidator(svc)`** AsyncValidatorFn factory
  - **`phoneUniqueValidator(svc)`** AsyncValidatorFn factory
  - `roleGateValidator(grantableRoles)` — rejects roles the actor cannot grant
  - `step5IsValid` + `step5FieldErrors`

**Validation matrix for Step 5:**

| Field | Sync rules | Async rules | Init data dependency |
|---|---|---|---|
| First Name | required · letters only · 2-50 chars (`lettersOnly` validator) | none | none |
| Last Name | required · letters only · 2-50 chars | none | none |
| Username | required · letters-digits-or-email pattern · **30 char max (drift #2 — FE tighter than BE 100)** · immutable hint | **`usernameUniqueValidator`** → `AccountValidationService.isUserExist(username)` | none |
| Email | required (drift #14 — FE enforces because BE missing `[ThrowIfNotPassed]`) · valid RFC | **`emailUniqueValidator`** → `AccountValidationService.isUserExist(*, email, *)` | none |
| Phone Number | required (drift #14) · E.164 / Saudi format | **`phoneUniqueValidator`** → `AccountValidationService.isUserExist(*, *, phone)` | none |
| Profile Picture | optional | none | none |
| Role | required · must be in grantable-roles list | none (PES gate sync via cached list) | PES `POST /pes/authorize` |
| Delivery Method | required · one of {Email, SMS, Both} | none | none |

### Shared component — `client-service-row-table`

**Status today:** Exists; consumed by Step 3 + Step 4.

**Files to create:**
- `client-service-row-table/models/models.ts` — `RowConfig` interface, `RowKind = 'commChannel' | 'app'`
- `client-service-row-table/validations/validations.ts` — pure per-row validators (no async)

---

## 🧪 Section 6 — Acceptance criteria (per step + overall)

| Step | Acceptance criteria (≥) |
|---|---|
| 1 | All sync validators wired · `accountNameUniqueValidator` fires on blur after 350ms debounce · sector cascade reloads on Authority change · profile-picture upload preview renders · `step1Valid` signal correctly tracks all required fields · zero R-FE-* / R-NOOR-* violations on touched files · `nx build admin-console` green |
| 2 | Password level dropdown shows PRD labels, submits backend codes · IPs validate against IPv4/IPv6/CIDR · 4 limits enforce drift #5 ranges · password policy loads on init (or graceful default) · `step2Valid` correct · build green · audit clean |
| 3 | CommChannels catalog loads on init · per-row validators enforce visibility/price coupling · skip-step path works · `step3Valid` defaults to true when skipped · build green |
| 4 | Apps catalog loads on init · shares `client-service-row-table` with Step 3 (zero duplicated row UI) · `kind: 'app'` driver works · skip-step path works · build green |
| 5 | PES grantable roles load on init · `usernameUniqueValidator` + `emailUniqueValidator` + `phoneUniqueValidator` all wire to `AccountValidationService.isUserExist` · async validators debounce 350ms + switchMap cancel · loading spinner shows per field while pending · build green |
| Overall | Composite `CreateAccountRequest` posted on Step 5 Submit · server errors route to originating step's error badge (use `<falcon-stepper>` errorSteps input) · success toast + tree refresh + wizard closes · RTL parity confirmed · all visible strings via `TranslatePipe` · Falcon Eyes ≥ 90% vs reference · no Falcon source committed until explicit "commit" |

---

## 🛡 Section 7 — Validation defensive contract (the "always-works" requirement)

User said: *"the validation must always work"*. This list is the safety net.

1. **No validator throws.** Every validator returns `null` or `ValidationErrors` — never throws an exception. Async validators catch HTTP failures and resolve to `null` (not error).
2. **No async validator blocks UX.** While async is pending, the form is `pending`, not `invalid` — submit button is disabled BUT user can keep typing.
3. **Failed async = soft no-op.** Network failure on `isUserExist` does NOT block submission. Backend handler is the safety net. Surface as Light Learning event.
4. **Stale results never surface.** `switchMap` cancels in-flight requests on every value change.
5. **No silent disabled state.** Every disabled control has a UI reason next to it (e.g., "Loading password policy…" while init is pending).
6. **i18n always works.** Every validator returns a key from `validation-messages.ts` — never a raw string. If a key is missing, fallback to `hierarchy.validation.unknown` (must exist in en + ar catalogs).
7. **No regex-in-template.** All regexes live in `validators.ts` (page-level) or `<step>/validations/validations.ts` (step-level) — never inlined in components.
8. **`hasLiveError` + `messageFor` always used together.** Pattern from existing `client-information-step` — don't deviate.
9. **No double-trigger.** Sync validator failing must SKIP async (no API call when sync is already failing).
10. **Defensive cancellation.** Every component injecting an async validator uses `takeUntilDestroyed(inject(DestroyRef))` to clean up on destroy.

---

## 🚦 Section 8 — Session-by-session sequencing

| # | Session | Goal | Deliverable |
|---|---|---|---|
| **0** | Validation infrastructure foundation | Establish per-step `validations/` folder pattern + wire `accountNameUniqueValidator` for Step 1 | Step 1's `validations/validations.ts` + Step 1's `services/services.ts` (lookup loader) + Step 1 component refactored to use them |
| **1** | Step 1 — Account Information (complete) | Full Step 1 implementation with async validator + cascade dropdowns + Profile Picture | Step 1 100% per acceptance criteria · build green · audit clean |
| **2** | Step 2 — Account Settings | Add password-policy bootstrap loader + dynamic password validator + IP validator + limits | Step 2 100% per acceptance criteria |
| **3** | Step 3 + Step 4 — CommChannels + Applications | Add shared row-table validation behavior driven by `kind` · per-row validators | Both Step 3 + Step 4 100% |
| **4** | Step 5 — Account Owner | PES role loader + 3 async validators (username/email/phone) + delivery method + role gate | Step 5 100% |
| **5** | Wizard shell + Submit | Composite `CreateAccountRequest` builder · error routing per step · success toast + tree refresh | End-to-end submit working |
| **6** | Polish | Falcon Eyes vs reference · RTL · i18n catalog gaps · accessibility | ≥ 90% Falcon Eyes parity |

**Total: 7 sessions.** Each session ends with a green build + audit pass + uncommitted working tree for your review.

---

## 🎯 Section 9 — What to implement NEXT

### **Session 0 — Validation infrastructure for Step 1**

This is the foundation. Once Session 0 lands, every subsequent step follows the same recipe.

**Concrete deliverables (no code, just file-by-file specification):**

1. **Create `client-information-step/services/services.ts`**:
   - `Step1InitService` `@Injectable()` provided at the step component level (`providers: [Step1InitService]` on the step component decorator)
   - `init$: Observable<Step1InitData>` — composes `LookupService.getLookup(authorityId)` + classification + countries
   - `loadSectorsForAuthority(authority)` — cascade endpoint
   - Cache last result in service-local signal
   - Subscribe lifecycle via `takeUntilDestroyed`

2. **Create `client-information-step/validations/validations.ts`**:
   - Export `step1FormSchema` — declarative description of which validator applies to which field
   - Export `accountNameUniqueValidator(svc: AccountValidationService): AsyncValidatorFn` factory
   - Export `step1IsValid(value: ClientInfoFormValue): boolean` — pure check
   - Export `step1FieldErrors(value: ClientInfoFormValue): Record<keyof ClientInfoFormValue, ValidationMessage | null>` — per-field error map

3. **Refactor `client-information-step.component.ts`**:
   - Replace the inline `accountNameError = computed(...)` that uses `collectAccountNames(treeRoot)` with the new async validator wired to `AccountValidationService`
   - Inject `AccountValidationService` from `@falcon`
   - Show pending spinner state while async is in flight
   - All other field errors continue using existing pattern (`messageFor` + `hasLiveError`)
   - The component's `valid` model output reads from `step1IsValid(value)` (sync) AND awaits async settle

4. **Move step-1 types** from `add-client-wizard/models/models.ts` into `client-information-step/models/models.ts`:
   - Move: `ClientInfoFormValue`, `AUTHORITY_OPTIONS`, `CLASS_CAT_OPTIONS`, `CLASS_SUB_OPTIONS`, `CITY_OPTIONS`, `COUNTRY_OPTIONS`, `sectorForAuthority`, `budgetLabelKeyForAuthority`, `emptyClientInfo`
   - Keep: cross-step composite types in `add-client-wizard/models/models.ts` (e.g., `NewClientWizardPayload`)
   - Update imports in:
     - `add-client-wizard.component.ts` (now imports from step folder)
     - any other consumer

5. **Update `add-client-wizard.component.ts` shell** (no behavior change, just import path adjustments)

6. **Documentation in component banner comments**: `*** client-information-step — Step 1 with validations/ folder pattern. ***`

### Why Session 0 is the right first move

- ✅ Smallest possible scope (one step, one folder)
- ✅ Establishes the pattern for all 4 remaining steps
- ✅ Closes the most visible drift (mock-tree check → real backend async validator)
- ✅ Touches the most-active file in the wizard (Step 1 is the entry point)
- ✅ Light Learning events from Session 0 inform Sessions 1-5 planning
- ✅ Validates the `<falcon-stepper>` step-valid signal contract end-to-end

### What's INTENTIONALLY out of scope for Session 0

- ❌ Steps 2-5 changes
- ❌ Wizard shell changes
- ❌ Backend changes (no backend work in this entire plan)
- ❌ New Falcon library components (none needed — disk truth proved this)
- ❌ Cross-step state service (defer to Session 2 when Step 2 needs shared password policy)

---

## 🚨 Section 10 — Gaps that need YOUR decisions BEFORE code

These are real questions the implementation will hit immediately. Resolve before code.

| ID | Question | Blocks which step | Recommendation |
|---|---|---|---|
| **D-2026-05-16-NEW-Q1** | Step 2 password policy: does the backend endpoint exist? If not, FE uses hardcoded defaults? | Step 2 init load | Default to hardcoded with `passwordsAtLeast8` + Light Learning event |
| **D-2026-05-16-NEW-Q2** | PES `POST /pes/authorize` payload shape — confirm with backend (or use `AccessControlFacade` per State Management Architecture) | Step 5 init | Use existing `AccessControlFacade` from `libs/falcon/src/core/lib/access-control/access-control.facade.ts` |
| **D-2026-05-16-NEW-Q3** | Q-UM-12 — Password level mapping (Normal↔Medium, Advanced↔Strict)? | Step 2 | Lock the mapping; Light Learning event the first time backend disagrees |
| **D-2026-05-16-NEW-Q4** | Q-AM-06 — Finance ID free-text or system-driven? | Step 1 | Default to free-text required (current behavior) until clarified |
| **D-2026-05-16-NEW-Q5** | Drift #4 — Budget Number conditional on Authority ∈ {Gov, Charity}? | Step 1 | Apply this rule; comment with reference |
| **D-2026-05-16-NEW-Q6** | Step 3 + 4 catalog endpoints — verify `GET /api/Setting/comm-channel-configs` + `application-configs` work in dev | Steps 3 + 4 | Verify before Session 3; if missing, use mock fallback + raise gap |
| **D-2026-05-16-NEW-Q7** | Step 5 username max — drift #2 says FE enforces 30 but BE allows 100 — confirm? | Step 5 | FE enforces 30 (tighter); comment |
| **D-2026-05-16-NEW-Q8** | Step 5 phone format — Saudi-only (`+966\d{9}`) or international (`E.164`)? | Step 5 | E.164 — broader; allow Saudi as a hint format |
| **D-2026-05-16-NEW-Q9** | Cross-step state — provide a wizard-level `AddClientStateService` for shared init data (password policy etc.)? | Sessions 2 + 5 | Yes — `providers: [AddClientStateService]` on the wizard component |

---

## 🧠 Section 11 — Brain artifacts this plan consumes

- ✅ Add Client playbook (16 files, 62 KB)
- ✅ `validators.ts` + `validation-messages.ts` from disk
- ✅ `AccountValidationService` from `libs/falcon/.../shared-data-access`
- ✅ Component Atlas + 62 dossiers (Tier 1)
- ✅ Folder Structure Deep-Dive (Tier 2 — confirmed the `models/services/validations` pattern)
- ✅ State Management Architecture (Tier 2 — signal-first + feature-scoped service)
- ✅ Auth Flow Architecture (Tier 2 — PES integration in Step 5)
- ✅ Token Taxonomy (Tier 2 — typography after R-NOOR-003 amendment)
- ✅ ADR-005 (dual-render not needed — components already exist)
- ✅ ADR-008 (feature folder pattern — extended with `validations/` per step)
- ✅ Anti-Pattern Catalog (Tier 4 — 11 entries actively relevant to wizard)
- ✅ 14 PRD↔DTO drifts from playbook 13-GAPS_AND_DRIFTS
- ✅ Existing dirty working-tree from the morning's PATTERN-04 + R-NOOR-007 work (must respect it)

---

## ✅ Plan locked

Disk-true. Implementation owner: **Ammar Mk**. No code in this doc. The implementation work follows session-by-session per Section 8.

When you start a session, paste Section 5's row for that step + Section 4's relevant async-validator wiring spec + Section 6's acceptance criteria. That's the kickoff brief.

---

## Related

- [Add Client Playbook README](README.md)
- [00-OVERVIEW](00-OVERVIEW.md) through [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- v1 of this plan (superseded — commit `c206449` in brain repo)
- Actual code: `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/`
- `services/validators.ts` + `services/validation-messages.ts` (page-level validation library)
- `AccountValidationService` at `libs/falcon/src/shared-data-access/lib/services/account-validation.service.ts`
- [[Frontend Architecture Atlas]] · [[Component Atlas]] · [[Decisions Queue]]

## Tags

#type/implementation-plan #flow/add-client #page/organization-hierarchy #disk-true #v2 #frontend-only #plan-locked
