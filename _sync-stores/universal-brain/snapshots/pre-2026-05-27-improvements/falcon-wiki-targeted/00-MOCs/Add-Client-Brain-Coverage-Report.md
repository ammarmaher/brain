---
type: brain-coverage-report
audience: executive-and-engineering
flow: Add Client wizard
page: Organization Hierarchy
date: 2026-05-16
version: v1.0
status: draft-v1 (pre-screenshot)
overall-readiness: 94%
implementation-ready: Wave 0 + Wave 1 (Step 1 only)
remaining-research: Steps 2, 3, 4, 5 (in parallel)
prd: PRD-01 Account Management (+ PRD-02 trigger via Step 5)
companion-pdf: "C:/Falcon/Falcon Specs v2.0 - Add Client Brain Coverage Report.pdf"
related:
  - "[[Brain-SK-PAGES_INDEX]]"
  - "[[Organization-Hierarchy]]"
brain-skill-chain-used:
  - Brain SK CLAUDE.md
  - IMPLEMENTATION_KNOWLEDGE_MAP.md
  - Add Client folder (17 files)
  - validators.ts + validation-messages.ts
  - AccountValidationService + LookupService + AccessControlFacade
---

*** Add Client — Brain Coverage Report v1 ***
*** Snapshot of how the Falcon Brain understands, plans, and waves the build ***
*** Pre-screenshot draft — v2 will incorporate UI screenshots once provided ***

# Add Client — Brain Coverage Report (v1)

> **Purpose:** show the boss, in numbers, how completely the Falcon Brain understands the Add Client wizard, how it has structured the build into 7 waves, what Falcon components it will use, what validation it will enforce, and where the open risks are. **All percentages are suggested estimates, not measured production telemetry.**

---

## 🎯 Executive Summary

The Falcon Brain has assembled a **94% overall readiness** for the Add Client 5-step wizard. Backend understanding (95%), validation architecture (95%), and wave-plan definition (100%) are at production grade. The 6% gap is dominated by **deep-research depth for Steps 2 through 5** — Step 1 is fully implementation-ready, the remaining 4 steps have plan-level coverage but lack the field-by-field validator/component lock that Step 1 has.

**Recommended next move:** kick off Wave 0 + Wave 1 (Step 1 implementation) while four parallel research agents close the depth gap for Steps 2–5. By Wave 1 landing, the Brain will be at 100% across all 5 steps.

---

## 🧠 Brain Knowledge Coverage — 6 dimensions

| # | Dimension | Weight | Score | Evidence |
|---|---|---|---|---|
| 1 | **Backend Understanding** | 20% | **95** | Commerce ENDPOINT_REGISTRY · DTO_DICTIONARY · ERRORS catalog · all 5 steps' API endpoints mapped · Q6 just resolved (`GET /api/CommunicationChannel`) |
| 2 | **Frontend Infrastructure** | 20% | **92** | 25+ validators in `validators.ts` · `validation-messages.ts` i18n catalog · `AccountValidationService` + `LookupService` + `AccessControlFacade` + `HttpService` all wired |
| 3 | **Validation Architecture** | 20% | **95** | 5-layer system designed · 12-rule defensive contract · async wiring spec (debounce + switchMap + HTTP-fail → null) |
| 4 | **Component Mapping** | 15% | **85** | Step 1 100% locked · Steps 2-5 plan-level · screenshots will close the 15-pt gap |
| 5 | **Wave Plan Definition** | 15% | **100** | 7 waves × 3 levels (Validation → API integration → API validation) fully documented in `15-IMPLEMENTATION_PLAN.md` v2.1 |
| 6 | **Open Questions Resolved** | 10% | **94** | 8 of 9 LOCKED + Q6 PARTIAL→FULL = 8.5/9 resolved · 1 cross-cutting (atomic submit semantics) still open |

**Overall = (95·0.20) + (92·0.20) + (95·0.20) + (85·0.15) + (100·0.15) + (94·0.10) = 93.55 → 94 %**

---

## 📋 Per-Step Readiness Matrix

| Step | Research Depth | Components Mapped | Validators Defined | API Confirmed | Overall | Status |
|---|---:|---:|---:|---:|---:|---|
| **1 — Account Information** | 100% | 100% | 100% | 100% | **100%** | 🟢 Implementation-ready |
| **2 — Account Settings** | 60% | 70% | 75% | 50% | **64%** | 🟡 Plan-level, deep research pending |
| **3 — CommChannels & Services** | 55% | 60% | 70% | 70% | **64%** | 🟡 Q6 endpoint answered, DTO shape pending |
| **4 — Applications & Services** | 65% | 65% | 70% | 90% | **73%** | 🟡 Endpoint locked, row submission shape pending |
| **5 — Account Owner Creation** | 60% | 60% | 70% | 50% | **60%** | 🟡 Atomic-vs-separate-call question open |

Average across 5 steps: **72%**. Step 1 alone is 100% — everything else needs the v18-style deep research pass.

---

## 🌊 The 7-Wave Build Plan

Each wave has the 3-level structure the user requested: **Validation → API integration → API validation**.

| # | Wave | Level-1 Validation | Level-2 API Integration | Level-3 API Validation | Readiness |
|---|---|---|---|---|---:|
| **0** | Validation infra foundation | Establish per-step `validations/` folder pattern · wire `accountNameUniqueValidator` for Step 1 | `AccountValidationService.checkAccountNameExists` (already exists) | 400 → i18n key mapping | **100%** |
| **1** | Step 1 — Account Info | All sync + async + cross-field validators (`step-1/validations/validations.ts`) | Cascade lookups · profile-pic upload | `Info.AccountName/FinanceId/BudgetNo/Country/City` errors | **100%** |
| **2** | Step 2 — Settings | IP/CIDR · 4 limit-range · `ePasswordSecurityLevel` enum | No init API (Q1 locked — no policy endpoint) | `InvalidAccountLimits` 422 mapping | **63%** |
| **3** | Step 3 — CommChannels | Per-row visibility ↔ pricing coupling | `GET /api/CommunicationChannel` catalog load | Per-row pricing-type enum validation | **70%** |
| **4** | Step 4 — Applications | Mirror Step 3 with `kind:'app'` driver | `GET /api/Application` (verified) | Per-row validation, same shape | **78%** |
| **5** | Step 5 — Account Owner | Username/email/phone async · E.164 phone · role gate | `AccessControlFacade.authorize(...)` for PES · `AccountValidationService.isUserExist` | `UserAlreadyExists` / `InvalidRole` / `RoleNotGrantable` | **60%** |
| **6** | Wizard shell + Submit | Cross-step pre-flight · per-step error badge routing | Composite `CreateAccountRequest` POST `/api/Node/create-account` | 400/422 → originating step's `errorSteps` input | **67%** |
| **7** | Polish | i18n catalog gaps · RTL · accessibility | n/a | Falcon Eyes ≥ 90% vs reference | **80%** |

Average wave readiness: **77%**.

---

## 🛡 Validation Architecture — 5 Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 5: validation-messages.ts                                     │
│           messageFor() + hasLiveError()                              │
│           SHARED i18n catalog — DO NOT DUPLICATE                     │
└─────────────────────────────────────────────────────────────────────┘
                          ▲
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 4: services/validators.ts (page-level, shared)                │
│           25+ pure sync ValidatorFn library                          │
│           accountNameValidator, anyStringValidator, phoneValidator… │
└─────────────────────────────────────────────────────────────────────┘
                          ▲
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 3: <step>/validations/validations.ts (NEW per-step)           │
│           - composes shared sync validators                          │
│           - declares step-specific cross-field rules                 │
│           - exports AsyncValidatorFn factories that wrap Layer 2     │
└─────────────────────────────────────────────────────────────────────┘
                          ▲
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 2: <step>/services/services.ts (NEW per-step)                 │
│           - step-init data loaders (cascade lookups, catalogs)       │
│           - per-step adapter over AccountValidationService           │
│           - 350ms debounceTime + switchMap cancel                    │
└─────────────────────────────────────────────────────────────────────┘
                          ▲
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 1: backend-bound singletons (already exists)                  │
│           AccountValidationService · LookupService · AccessControl-  │
│           Facade · HttpService                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### The defensive contract — 12 rules

1. No validator throws (always returns `null` or `ValidationErrors`)
2. Async-pending never blocks input (form is `pending`, not `invalid`)
3. Failed async = soft no-op (server is the safety net)
4. Stale results never surface (`switchMap` cancels)
5. No silent disabled state (every disabled control has a UI reason)
6. i18n keys mandatory (raw strings forbidden)
7. No regex in templates (live in `validators.ts` or step `validations.ts`)
8. `hasLiveError` + `messageFor` always used together
9. No double-trigger (sync-failing field skips async call)
10. Defensive cancellation via `takeUntilDestroyed`
11. Catalog fallback (mock data when GET fails + Light Learning event)
12. PES failure soft-fallback (minimum grantable role + Light Learning event)

---

## 🧩 Falcon Component Map — what we'll use

| Component | Steps consuming | Purpose |
|---|---|---|
| `<falcon-stepper>` + `<falcon-step>` + `<falcon-step-list>` + `<falcon-step-panels>` | Wizard shell | 5-step navigation |
| `<falcon-angular-input>` | 1, 2, 5 | Text inputs (Account Name, IP, names, username) |
| `<falcon-angular-dropdown>` | 1, 2, 3, 4, 5 | All dropdowns (Authority, Country/City, Classification, Pricing Type, Role, Delivery Method) |
| `<falcon-angular-form-field>` | 1, 2, 3, 4, 5 | Label + error wrapper |
| `<falcon-angular-photo-uploader>` | 1, 5 | Profile pictures |
| `<falcon-angular-textarea>` | 1 | Additional Address |
| `<falcon-angular-email-field>` | 5 | Email with built-in format check |
| `<falcon-angular-phone-field>` | 5 | E.164 phone |
| `<falcon-angular-radio-group>` | 5 | Delivery Method (Email/SMS/Both) |
| `<falcon-angular-switch>` | 3, 4 | Per-row visibility toggle |
| `<falcon-angular-data-table>` | 3, 4 | Row table for CommChannels + Apps |
| `<falcon-angular-button>` | All | Next / Back / Submit |
| `<client-service-row-table>` (page-level shared) | 3, 4 | Shared row composition (driven by `kind:'commChannel'\|'app'`) |

### Component count

- **Existing Falcon components reused:** **13** (all 5 steps)
- **New custom components needed:** **0** (R-FE-005 satisfied — no raw HTML where a Falcon component exists)
- **New per-step services:** **5** (one per step, each in `services/services.ts`)
- **New per-step validation files:** **6** (5 steps + shared row table)
- **New wizard-level state service:** **1** (`AddClientWizardStateService`)

---

## 📐 Best-Practices Enforcement (Falcon rulebook adherence)

| Rule | What it enforces | Coverage |
|---|---|---:|
| **R-FE-005** | Falcon UI library first (no raw HTML) | **100%** |
| **R-FE-009** | Feature folder pattern: `models/` + `services/` + `validations/` | **100%** |
| **R-NOOR-001 / R-NOOR-003** | Layout ownership · typography scale | **90%** |
| **R-NOOR-004** | Color palette over intent (Admin Console scope) | **95%** |
| **R-XC-002** | No direct Zitadel calls (Identity Service only) | **100%** |
| **R-VAL-001** | Defensive validators (no throws, HTTP-fail → null) | **100%** |
| **R-VAL-002** | Debounce 350ms + `switchMap` cancel + `takeUntilDestroyed` | **100%** |
| **R-VAL-003** | i18n keys not raw strings | **100%** |
| **R-FE-013** | No SCSS · no inline styles · tokens only | **100%** |
| **R-PES-001** | AccessControlFacade only (no raw `/pes/authorize`) | **100%** |

**Average rule adherence in the plan: 98.5%**.

---

## ⚠ Open Items & Risks (5)

| # | Item | Severity | Owner | Impact |
|---|---|---|---|---|
| 1 | Step 5 atomic-vs-separate Identity call — does `POST /api/Node/create-account` create the user, or do we make a second Identity call? | 🔴 **HIGH** | Backend confirmation | Decides if Wave 6 is "1 POST" or "saga + rollback" |
| 2 | Step 2 limit field property names + ranges (drift #5: FE enforces because BE lacks `[ThrowIf*]`) | 🟠 **MED** | Backend confirmation | Affects Step 2 validation matrix accuracy |
| 3 | Submit error routing — does backend return `errorPath: "Info.AccountName"` style metadata? | 🟠 **MED** | Backend payload schema | Affects Wave 6 per-step error-badge routing |
| 4 | Step 3 CommChannels DTO shape (multi-lang name? icon glyph or URL?) | 🟢 **LOW** | Q6 follow-up | Cosmetic / TS-type accuracy |
| 5 | i18n catalog gaps (~6 keys missing in `validation-messages.ts`) | 🟢 **LOW** | FE audit K2 | Polish wave 7 |

---

## ⏱ Time-Phased Action Plan

### 🚀 Quick Wins (This Week)

1. **Start Wave 0** — establish `validations/` folder pattern on Step 1 (foundation for all 4 remaining steps)
2. **Spawn 4 parallel deep-research agents** to produce files `19-STEP_2_RESEARCH_AND_PLAN.md` through `22-STEP_5_RESEARCH_AND_PLAN.md` at v18 quality
3. **Receive UI screenshots** to lock final component selection per step
4. **Resolve open risk #1** (atomic vs separate Identity call) via Commerce backend ticket

### 📅 Medium-Term (1–3 Weeks)

1. **Complete Wave 1** (Step 1 implementation + acceptance criteria)
2. **Complete Waves 2 + 3 + 4** in parallel once research files land
3. **Resolve open risks #2 + #3** before Wave 6 design freeze
4. **Build i18n catalog audit script** to detect missing keys per V-rule
5. **Pre-validate `<falcon-stepper>` errorSteps input** against backend error payload shape

### 🎯 Strategic (1–3 Months)

1. **Adopt the v18 research template** as the Brain standard for every future flow (Add User, Edit Node, Add Node, etc.)
2. **Generalize the `validations/` folder pattern** into a Falcon platform convention (R-FE-009 extension)
3. **Build a CI-time validator coverage check** — each form field must have either a sync or async validator OR an explicit `@no-validator` annotation
4. **Promote `AccountValidationService` patterns** into a shared `BackendAsyncValidator` abstraction reusable across all wizards
5. **Extend `AccessControlFacade` integration tests** for tenant context propagation in nested wizard scopes

---

## 🧠 Brain Skill Chain Used (provenance)

This report was produced by loading and reasoning over:

1. **Brain SK CLAUDE.md** — top-level entry with Permanent Rules (Learning-First Routing, Flow Playbooks as spec, Canonical Knowledge Root)
2. **IMPLEMENTATION_KNOWLEDGE_MAP.md** — the 8-question verification gate
3. **Add Client folder** (17 files, ~250 KB) — the decomposed playbook
4. **Commerce ENDPOINT_REGISTRY + DTO_DICTIONARY + ERRORS catalog**
5. **Frontend code:** `validators.ts` (25+ exports inventoried), `validation-messages.ts`, `AccountValidationService`, `LookupService`, `AccessControlFacade`, `HttpService`
6. **Existing Step 1 component** — source-of-truth for the established pattern
7. **`ePasswordSecurityLevel` enum** — confirmed 2-value (drift #1 dead)
8. **15-IMPLEMENTATION_PLAN.md v2.1** (49 KB locked plan)
9. **16-OPEN_QUESTIONS_RESOLVED.md** (9 resolutions, 18 KB)
10. **17-BACKEND_QUESTION_Q6_COMM_CHANNELS_CATALOG.md** (now answered)
11. **18-STEP_1_RESEARCH_AND_PLAN.md** (43 KB, v18 deep-research template)

Total Brain-source bytes reasoned over: **~500 KB**.

---

## 📎 Companion Artifacts

- **Boss PDF:** `C:/Falcon/Falcon Specs v2.0 - Add Client Brain Coverage Report.pdf`
- **Parent plan:** [[15-IMPLEMENTATION_PLAN]] v2.1
- **Resolutions:** [[16-OPEN_QUESTIONS_RESOLVED]]
- **Backend Q6 ticket:** [[17-BACKEND_QUESTION_Q6_COMM_CHANNELS_CATALOG]]
- **Step 1 deep research:** [[18-STEP_1_RESEARCH_AND_PLAN]]

---

## ✅ Verification Gate — Brain proves it knows the page (8 questions)

| # | Question | Answer | Confidence |
|---|---|---|---:|
| 1 | What endpoint creates the account? | `POST /api/Node/create-account` (System Gateway) with `CreateAccountRequest` body | 100% |
| 2 | What field cap applies to Account Name? | 30 chars (`ThrowIfMaxLengthExceed(30)`) — not 100 as v1 plan claimed | 100% |
| 3 | Where is uniqueness checked? | `AccountValidationService.checkAccountNameExists` → `POST /api/Node/ValidateAccountName?AccountName=` (notShowToaster header) | 100% |
| 4 | How is PES wired? | `AccessControlFacade.authorize(...)` from `libs/falcon/src/core/lib/access-control/` — never raw `/pes/authorize` | 100% |
| 5 | Where do per-step validators live? | New `<step>/validations/validations.ts` (R-FE-009 extension) | 100% |
| 6 | Password level enum? | `ePasswordSecurityLevel { Normal = 1, Advanced = 2 }` — drift #1 retired | 100% |
| 7 | CommChannels catalog endpoint? | `GET /api/CommunicationChannel` (Q6 just resolved) | 95% (DTO shape pending) |
| 8 | Wizard state service? | `AddClientWizardStateService` provided at wizard component (NEVER `providedIn: 'root'`) | 100% |

**8/8 answered with file citations. Verification gate passed.**

---

## Tags

#type/coverage-report #flow/add-client #page/organization-hierarchy #brain-coverage #boss-report #percentages-suggested #v1
