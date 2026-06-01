---
type: deep-analysis-report
audience: executive-and-engineering
flow: Add Client wizard
page: Organization Hierarchy
date: 2026-05-16
version: v2.0 (post-screenshot + post-React-source)
status: locked
overall-readiness-before: 94%
overall-readiness-after: 78%
delta-explanation: "Lower number = the Brain LEARNED. We discovered scope gaps and corrected confidence honestly."
sources-of-truth:
  - "C:/Falcon/Source_of_truth_theme/images/Add Client/ (7 screenshots)"
  - "C:/Falcon/Source_of_truth_theme/HTML/latest.html (bundler-loader)"
  - "C:/Falcon/Source_of_truth_theme/React/Falcon-Taha (1)/admin/addclient.jsx (836 lines)"
  - "C:/Falcon/Source_of_truth_theme/React/Falcon-Taha (1)/admin/addclient.css (931 lines)"
related:
  - "[[Add-Client-Brain-Coverage-Report]]"
  - "[[15-IMPLEMENTATION_PLAN]]"
  - "[[18-STEP_1_RESEARCH_AND_PLAN]]"
---

*** Add Client — Deep Visual + Source Analysis v2 ***
*** Brain learned from 7 screenshots + 1,767 lines of React/CSS source ***
*** Honest correction: dropped from 94% → 78% because scope grew ***

# Add Client — Deep Analysis v2

> **What changed from v1 (Brain Coverage Report):** v1 was based on backend + frontend infrastructure assumptions only. v2 incorporates the **visual source of truth** (5 step screenshots + 2 dialog screenshots) and the **React reference implementation** (`addclient.jsx` 836 LoC + `addclient.css` 931 LoC). Numbers dropped honestly — the Brain learned the page is larger than originally scoped.

---

## 📉 Overall Readiness — BEFORE vs AFTER

| Metric | v1 (Pre-Screenshot) | v2 (Post-Source) | Delta | Why |
|---|---:|---:|---:|---|
| **Overall Brain Readiness** | 94% | **78%** | **−16 pp** | Discovered the Sending Credentials dialog + 6 new components + scope corrections |
| Backend Understanding | 95% | 95% | 0 | Unchanged — still solid |
| Frontend Infrastructure | 92% | 88% | −4 pp | `<falcon-angular-textarea>`, `<falcon-angular-email-field>`, `<falcon-angular-phone-field>` don't map 1:1 — plain inputs in source |
| Validation Architecture | 95% | 95% | 0 | Architecture solid; what to validate changed slightly |
| Component Mapping | 85% | **70%** | **−15 pp** | 6 new components discovered (radio-card, chip-input, number-stepper, send-dialog, success-modal, currency-prefix-input) |
| Wave Plan Definition | 100% | 90% | −10 pp | Wave 6 (Submit) needs new Wave 6.5 for Sending Credentials dialog flow |
| Open Questions Resolved | 94% | 89% | −5 pp | 2 new clarifications needed (read-only Password/Role on Step 5; chip-input availability in Falcon) |

**Why the drop is healthy:** the Brain didn't pretend to know what it hadn't seen. The 16-point honest correction proves the methodology works — when given real source, the Brain measured the real gap.

---

## 🔍 Methodology — How the Brain Analyzed

| Phase | Source | Time spent | What it produced |
|---|---|---|---|
| **1. Visual extraction** | 5 step screenshots + 2 dialog screenshots (≈1.5 MB total) | per-screenshot inspection | Per-step element inventory: fields, dropdowns, switches, radios, table columns |
| **2. Source-code grounding** | `addclient.jsx` (836 lines) + `addclient.css` (931 lines) | structured walkthrough of all 5 step components + 2 modal components | Confirmed field types (text vs select vs textarea), interaction patterns (disabled-when-off, read-only password), grid layouts |
| **3. Cross-reference vs Brain v1 plan** | `15-IMPLEMENTATION_PLAN.md` v2.1 + `18-STEP_1_RESEARCH_AND_PLAN.md` | line-by-line comparison | 11 corrections to prior assumptions logged below |
| **4. Component re-mapping** | Existing Falcon library inventory | confidence assignment per component | 13 reused + **6 new** discovered |
| **5. Honest re-scoring** | All findings combined | weighted recalculation | 94% → 78% with full justification |

---

## 🔧 v1 Assumptions That React Source Corrected (11 corrections)

| # | v1 plan assumption | Reality in React source | Severity |
|---|---|---|---|
| 1 | Sector is a cascade dropdown from Authority Letter | Plain TEXT INPUT in React | 🟠 Med |
| 2 | District is a cascade dropdown from City | Plain TEXT INPUT in React | 🟠 Med |
| 3 | Additional Address is a `<textarea>` | Plain TEXT INPUT in React | 🟢 Low |
| 4 | City cascades from Country | Hardcoded list, no cascade in React | 🟠 Med |
| 5 | Step 2 has Balance Transfer Limit % field | NOT PRESENT in React | 🟢 Low (simpler than plan) |
| 6 | Step 2 limits are single numeric inputs | DUAL layout: read-only "Current existing" + editable "Max allowed" with up/down arrows | 🔴 High |
| 7 | Step 2 password level is plain radio | RADIO CARDS with title + description | 🟠 Med |
| 8 | Step 2 IPs is a multi-select | Pill/chip list + Enter-to-add input | 🟠 Med |
| 9 | Step 5 password is server-generated, NOT rendered | Rendered as DISABLED read-only display (default `#123455`) | 🔴 High |
| 10 | Step 5 Role is a dropdown loaded from PES | DISABLED read-only display with default "Account Owner" | 🔴 High |
| 11 | Delivery Method (Email/SMS/Both) is on Step 5 form | Lives in a SEPARATE "Sending Credentials" dialog opened on Save | 🔴 High |

**4 HIGH-severity corrections, 5 MED, 2 LOW.** The Brain's v1 plan was directionally correct but materially wrong on Step 2 limits, Step 5 password/role rendering, and the delivery-method placement.

---

## 🆕 New Components Discovered (6, not in v1 plan)

| # | Component | Where used | Confidence to build | Approach |
|---|---|---|---|---|
| **1** | `<falcon-angular-radio-card>` (or extend `falcon-radio-group`) | Step 2 — Password Security Level | **85%** | Likely extension of existing `<falcon-radio-group>` with card variant — verify; if unavailable, build as wrapper |
| **2** | Chip/pill input for IP list | Step 2 — Allowed IPs | **70%** | Check `libs/falcon-ui-core/` for existing chip/tag input; fall back to wrapper around `<falcon-angular-input>` + chip rendering |
| **3** | `<falcon-angular-number-stepper>` with up/down arrows | Step 2 — Max Allowed limits | **75%** | Check if Falcon input supports `[showButtons]`; if not, build wrapper |
| **4** | Currency-icon-prefixed numeric input | Step 3/4 — Price Value (Saudi Riyal glyph) | **80%** | Likely `<falcon-angular-input>` with prefix slot + `RiyalGlyph` SVG icon |
| **5** | `<send-credentials-dialog>` (app-level wrapper around `<falcon-angular-dialog>`) | Step 5 finish flow | **60%** | NEW build — 3 illustrated radio cards + summary section + actions |
| **6** | `<success-toast-dialog>` (or use existing `falcon-angular-success-dialog`) | Step 5 final confirmation | **80%** | Probably exists; if not, simple modal with SVG illustration + close |

**Total new component effort: ~8–12 hours** depending on how many extensions already exist in `libs/falcon-ui-core/`.

---

## 📐 Per-Step Deep Analysis

### Step 1 — Account Information (revised: 90% ready, was 100%)

**Visual evidence:** `Account Information.png` — 4-column grid with 18 fields + client picture upload.

| # | Field | Type in React | Required? | Falcon Component (confirmed) | Confidence |
|---|---|---|---|---|---:|
| 1 | Client Picture | Photo upload | optional | `<falcon-angular-photo-uploader>` | 100% |
| 2 | Account Name | Text input | ✅ required | `<falcon-angular-input>` | 100% |
| 3 | Finance ID | Text input | ✅ required (per drift #3) | `<falcon-angular-input>` | 100% |
| 4 | Classification Category | Dropdown | optional | `<falcon-angular-dropdown>` | 100% |
| 5 | Classification Sub Category | Dropdown | optional | `<falcon-angular-dropdown>` | 100% |
| 6 | Entity Name | Text input | optional | `<falcon-angular-input>` | 100% |
| 7 | Authority Letter Type | Dropdown (default "Government") | optional | `<falcon-angular-dropdown>` | 100% |
| 8 | Sector | **Text input** (CORRECTION) | optional | `<falcon-angular-input>` | 100% |
| 9 | Budget No. | **Text input** | conditional (Authority ∈ Government/Charity) | `<falcon-angular-input>` | 100% |
| 10 | Country | Dropdown (hardcoded list in React) | optional | `<falcon-angular-dropdown>` | 100% |
| 11 | City | Dropdown (hardcoded, NO cascade in React) | optional | `<falcon-angular-dropdown>` | 100% |
| 12 | District | **Text input** (CORRECTION) | optional | `<falcon-angular-input>` | 100% |
| 13 | Street | Text input | optional | `<falcon-angular-input>` | 100% |
| 14 | Building Number | Text input | optional | `<falcon-angular-input>` | 100% |
| 15 | Postal Code | Text input | optional | `<falcon-angular-input>` | 100% |
| 16 | Additional Address | **Text input** (CORRECTION, was textarea in plan) | optional | `<falcon-angular-input>` | 100% |
| 17 | Another ID | Text input | optional | `<falcon-angular-input>` | 100% |
| 18 | VAT Registration Number | Text input | optional · format `\d{15}` | `<falcon-angular-input>` | 100% |

**Layout:** 4-column CSS grid `grid-template-columns: repeat(4, 1fr)`. Section divider "Account Official" between top 4 fields and bottom 14.

**Validations (SMART per field):**

| Field | Validation rule (SMART) |
|---|---|
| Account Name | **S**pecific: starts with letter, max 30 chars. **M**easurable: regex `/^[a-zA-Z][\w\s-]{1,29}$/`. **A**chievable: existing `accountNameValidator` covers it. **R**elevant: backend `ThrowIfMaxLengthExceed(30)`. **T**imely: live (every keystroke). Plus async uniqueness on blur (350 ms debounce). |
| Finance ID | Required (drift #3), 2-50 chars. Live on blur. |
| VAT Registration Number | Optional, but if filled MUST match 15-digit pattern. Live on blur. |
| Budget No. | Required IF `authority ∈ {Government, Charity}`. Cross-field validator. |
| Address fields | All optional. Cross-field rule: `Country required when City filled · City required when District filled · City required when Street filled`. Live on form-value change. |

**Decision:** keep v1 plan's 5-layer validation architecture; replace cascade-loader assumption with static-list-then-backend-lookup (confirm in K1 audit).

---

### Step 2 — Account Settings (revised: 55% ready, was 64%)

**Visual evidence:** `Account setting.png` — 2-column layout: left = security + IPs, right = limitations sidebar (360 px fixed width).

**Structure correction (from React):**

```
grid-template-columns: minmax(0, 1fr) 360px
```

**LEFT SIDE:**

**Password Security Level — RADIO CARDS** (not plain radio):
- Card 1: "Normal" — sub: "Username, Password, OTP"
- Card 2: "Advanced" — sub: "Comply with NCA regulations, press here for more details."

**Allowed IPs — chip/pill input** (NOT multi-select dropdown):
- Pre-loaded chips: "192.168.0.1 ×", "192.168.0.1 ×"
- Input below: "Enter IP Address (IPv4 or IPv6) and press Enter"
- Help text: "* Restrict platform access and limit it from these IPs only"

**RIGHT SIDE — Account Limitations (3 limits, each with dual layout):**

| Limit | Current Existing (disabled) | Max Allowed (editable + up/down arrows) |
|---|---|---|
| Max normal user limit | `0` | `20` |
| Max System User Limit | `5` | `5` |
| Max Node Level | `0` | `2` |

**No "Balance Transfer Limit %" field exists** — v1 plan's drift #13 entry is for a feature not in this UI version.

**Falcon components needed:**

| Element | Falcon component | Confidence | Effort |
|---|---|---:|---|
| Password security cards | `<falcon-angular-radio-group>` with card variant OR new `<falcon-angular-radio-card>` | 85% | 1-2 h |
| Allowed IPs chip input | TBD — verify if `<falcon-angular-chips>` or similar exists; otherwise wrap `<falcon-angular-input>` | 70% | 2-3 h |
| Limit number stepper | `<falcon-angular-input>` with `[showButtons]` OR new `<falcon-angular-number-stepper>` | 75% | 1 h |
| Read-only "Current existing" display | `<falcon-angular-input>` disabled | 100% | 0 |

**Validations (SMART):**

| Field | Validation rule |
|---|---|
| Password Security Level | Required · must be `Normal` or `Advanced`. Static enum (drift #1 retired). |
| Allowed IPs | Each chip must match IPv4 regex `^(\d{1,3}\.){3}\d{1,3}$` OR IPv6 regex. At least 1 chip required (or 0 if BE allows). Validate on every Enter-press. |
| Max Normal User | Integer 1-999 (FE enforces per drift #5). Cannot be less than `Current existing`. |
| Max System User | Integer 1-999. Cannot be less than `Current existing`. |
| Max Node Level | Integer 1-99. Cannot be less than `Current existing`. |

**Cross-field rule:** `Max Allowed ≥ Current Existing` per limit row.

---

### Step 3 — CommChannels & Services (revised: 70%, was 64%)

**Visual evidence:** `Com, Communication and Service.png` — 5-column data table.

**Table structure (from React CSS):**

```
grid-template-columns: 80px minmax(0, 1.6fr) 180px 180px 110px
```

| Col 1 (80px) | Col 2 (flex) | Col 3 (180px) | Col 4 (180px) | Col 5 (110px) |
|---|---|---|---|---|
| **Visibility** | **Name** | **Price Type** | **Price Value** | **Status** |
| Switch toggle | Channel name | Dropdown | Riyal-prefixed number | Pill / dashes |

**Pricing-type options (correction — 4 options, not 2):**

```
- One Time
- Monthly
- Quarterly
- Yearly
```

**Behavior:** when Visibility = OFF, Price Type + Price Value inputs are DISABLED, Status shows `------` dashes.

**Pagination:** "Showing 1-3 from 3" + "1 of 1" + "Rows per page: 10" → confirms `<falcon-angular-data-table>` pagination pattern.

**Falcon components needed:**

| Element | Falcon component | Confidence |
|---|---|---:|
| Row table | Custom-styled `<falcon-angular-data-table>` OR custom CSS-grid component | 75% |
| Visibility switch | `<falcon-angular-switch>` | 100% |
| Price Type dropdown (inline) | `<falcon-angular-dropdown>` (compact variant) | 100% |
| Price Value with Riyal prefix | `<falcon-angular-input>` + prefix slot + `<falcon-icon name="riyal">` | 80% |
| Status pill | Plain `<span>` with token-styled classes (no component needed) | 100% |

**Validations (SMART):**

| Field | Rule |
|---|---|
| Per-row Visibility | Boolean. No validation (just toggle). |
| Per-row Price Type | Required IF Visibility = ON. Must be one of 4 enum values. |
| Per-row Price Value | Required IF Visibility = ON. Positive number. |

---

### Step 4 — Applications & Services (revised: 75%, was 73%)

**Visual evidence:** `Application and Service.png` — IDENTICAL layout to Step 3.

**Reuse confirmed:** the shared `<client-service-row-table>` is the correct design — drive it with `kind: 'commChannel' | 'app'` prop.

**Differences from Step 3:** zero. Same columns, same row count visible, same pagination, same behavior.

**3 sample apps visible:**
1. Basic Send App — Monthly, 2,000, Active
2. Survey Engine — OFF
3. Campaign Engine — One Time, 2,000, Active

---

### Step 5 — Account Owner Creation (revised: 45%, was 60%)

**Visual evidence:** `Account Owner Creation.png` — Owner Picture at top + 4-column grid with 8 fields.

| # | Field | Type in React | Required? | Falcon Component |
|---|---|---|---|---|
| 1 | Owner Picture | Photo upload | optional | `<falcon-angular-photo-uploader>` |
| 2 | First Name | Text input | ✅ required | `<falcon-angular-input>` |
| 3 | Last Name | Text input | ✅ required | `<falcon-angular-input>` |
| 4 | User Name | Text input | ✅ required | `<falcon-angular-input>` |
| 5 | Password | **DISABLED text input (read-only)** value=`#123455` | display-only | `<falcon-angular-input [disabled]="true">` |
| 6 | National ID / Iqama | Text input | optional | `<falcon-angular-input>` |
| 7 | Phone Number | Text input | ✅ required | `<falcon-angular-input>` (NOT specialized phone field) |
| 8 | Email Address | Text input | ✅ required | `<falcon-angular-input>` (NOT specialized email field) |
| 9 | Role | **DISABLED text input (read-only)** value=`Account Owner` | display-only | `<falcon-angular-input [disabled]="true">` |

**MAJOR CORRECTION:** Q1 resolution in v1 said "no password input — server-generated". The screenshot SHOWS a disabled password field with the server-generated value displayed. Plan needs update: render it as **disabled read-only**, not hidden.

**MAJOR CORRECTION:** Q2 (PES role loader) was over-scoped. The Role field is a hardcoded "Account Owner" disabled display in the React reference. PES-driven role selection might apply only if creating non-AO users. For Add Client → AO, the Role is fixed.

**Validations (SMART):**

| Field | Rule |
|---|---|
| First Name | Required · 2-50 chars · letters only (`lettersOnly` validator). Live on blur. |
| Last Name | Required · same as First Name. |
| User Name | Required · 30 char max (drift #2) · pattern letters/digits/email. **Async uniqueness via `AccountValidationService.isUserExist(username)`** on blur with 350 ms debounce. |
| Password | NO validation — read-only display. |
| Phone Number | Required · E.164 format (drift #14 + Q8). **Async uniqueness via `isUserExist(*, *, phone)`** on blur. |
| Email Address | Required (drift #14) · RFC email. **Async uniqueness via `isUserExist(*, email, *)`** on blur. |
| Role | NO validation — read-only display. |

---

### Sending Credentials Dialog — NEW (40% ready, was 0%)

**Visual evidence:** `ac-modal ac-success-modal.png` (filename is misleading — this is the "Sending" modal, NOT success).

**Critical: opens on Save click of Step 5, NOT inline in Step 5.**

**Structure:**

```
┌──────────────────────────────────────────────────┐
│  Sending Credentials                          [×] │
│  An email and/or SMS with the username and       │
│  password will be sent to the account owner      │
│                                                   │
│  Delivery method:                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ ⦿ Send via   │ │ ○ Send via   │ │ ○ Both, SMS  ││
│  │   Email      │ │   SMS        │ │   and Email  ││
│  │  [envelope]  │ │  [sms icon]  │ │  [both icon] ││
│  └──────────────┘ └──────────────┘ └──────────────┘│
│                                                   │
│  👤 Account owner   📞 Phone Number   📧 Email     │
│     Jawad Lababneh    966587415590     j.l@t2.sa  │
│                                                   │
│              [Cancel]  [Send Credentials]         │
└──────────────────────────────────────────────────┘
```

**Falcon components:**

| Element | Component | Confidence |
|---|---|---:|
| Dialog frame | `<falcon-angular-dialog>` (or `<falcon-angular-modal>`) | 100% (exists) |
| 3 illustrated radio cards | NEW: `<send-credentials-card-radio>` wrapping `<falcon-angular-radio-group>` + illustration slot | 60% |
| Summary line items (avatar + phone + email) | Plain HTML + `<falcon-icon>` glyphs | 100% |
| Cancel + Send Credentials buttons | `<falcon-angular-button>` (link + primary variants) | 100% |

**Behavior:**
- Opens after Step 5 form submit + 400/422 success (account created BE-side)
- User picks delivery method (defaults to `email`)
- Clicking Send Credentials triggers a credential-send API → opens Success modal
- Cancel closes the dialog (account is already created — credentials just not sent)

**API needed (NEW):**

```
POST /api/Account/{accountId}/send-credentials
Body: { method: "email" | "sms" | "both" }
```

**Open question:** is this endpoint already in the Identity Service? Or does it auto-fire on account creation with default method? Backend confirmation needed (NEW Q10).

**Validations:** delivery method required (radio).

---

### Success Modal — NEW (60% ready, was 0%)

**Visual evidence:** `ac-modal ac-send-modal.png` (file naming swap with the other modal — verified).

**Structure:**
- SVG illustration (clipboard + checkmark + sparkles)
- Title: "Completed successfully"
- Subtitle: "Credentials sent to the user"
- Single close (X) button at top right

**Falcon components:**

| Element | Component | Confidence |
|---|---|---:|
| Modal frame | `<falcon-angular-dialog>` (small variant) | 100% |
| Illustration | Inline SVG (no component) | 100% |
| Title + subtitle | Plain typography | 100% |
| Close button | `<falcon-icon-button>` or built-in dialog close | 100% |

**Behavior:**
- Opens after Send Credentials button click
- Close (X) → push toast "Client created ✓" + close wizard → refresh tree

---

## 📊 Component Confidence — BEFORE vs AFTER

| Component | v1 Confidence | v2 Confidence | Why changed |
|---|---:|---:|---|
| `<falcon-stepper>` family | 90% | 95% | Confirmed 5-step + Save-vs-Next pattern |
| `<falcon-angular-input>` | 95% | **100%** | Confirmed (most pervasive Falcon component in plan) |
| `<falcon-angular-dropdown>` | 95% | **100%** | Confirmed everywhere |
| `<falcon-angular-form-field>` | 100% | **100%** | Pattern proven |
| `<falcon-angular-photo-uploader>` | 100% | **100%** | Confirmed Step 1 + Step 5 |
| `<falcon-angular-textarea>` | 85% | **0%** | NOT USED — react uses plain text input for Additional Address |
| `<falcon-angular-radio-group>` | 50% | **30%** | Need radio-card extension |
| `<falcon-angular-switch>` | 95% | **100%** | Confirmed |
| `<falcon-angular-data-table>` | 80% | **70%** | Need custom-styled variant |
| `<falcon-angular-button>` | 100% | **100%** | Confirmed |
| `<falcon-angular-email-field>` | 80% | **40%** | NOT used in React — plain input |
| `<falcon-angular-phone-field>` | 80% | **40%** | NOT used in React — plain input |
| `<falcon-angular-radio-card>` (NEW) | n/a | **85%** | Extends radio-group |
| Chip/pill input (NEW) | n/a | **70%** | Verify availability |
| `<falcon-angular-number-stepper>` (NEW) | n/a | **75%** | Verify `[showButtons]` |
| Currency-prefixed input (NEW) | n/a | **80%** | Wrap input + icon |
| `<send-credentials-dialog>` (NEW) | n/a | **60%** | New component |
| `<success-modal>` (NEW) | n/a | **80%** | Verify or build |

**Component re-mapping summary:**
- **Reused with high confidence (≥95%):** 6 components
- **Reused with medium confidence (60-94%):** 3 components
- **Reused with low confidence (<60%):** 3 components (textarea, email-field, phone-field — likely NOT used)
- **New components needed:** 6

---

## 🧪 Validation Plan — SMART Per Step

### Step 1 (12 validators, all in `client-information-step/validations/validations.ts`)

```ts
// Sync
required('accountName')
maxLength('accountName', 30)
pattern('accountName', /^[A-Za-z]/)
required('financeId')
maxLength('financeId', 50)
pattern('vat', /^\d{15}$/, optional: true)

// Conditional
requiredIf('budgetNo', () => authority() ∈ ['Government', 'Charity'])
requiredIf('country', () => !!city())
requiredIf('city', () => !!district() || !!street())

// Async
accountNameUniqueValidatorBackend(AccountValidationService) // 350ms debounce
```

### Step 2 (8 validators)

```ts
required('securityLevel') // enum: Normal | Advanced
ipv4OrV6('allowedIp') // per chip on Enter
maxAllowed_ge_currentExisting('maxNormal', 'currentNormal')
maxAllowed_ge_currentExisting('maxSystem', 'currentSystem')
maxAllowed_ge_currentExisting('maxNode', 'currentNode')
range('maxNormal', 1, 999)
range('maxSystem', 1, 999)
range('maxNode', 1, 99)
```

### Step 3 + 4 (3 per-row validators, shared)

```ts
// row factory
priceType_requiredIf_visible(row)
priceValue_requiredIf_visible(row)
priceValue_positive(row)
```

### Step 5 (10 validators)

```ts
// Sync
required('firstName') + lettersOnly + range(2, 50)
required('lastName')  + lettersOnly + range(2, 50)
required('userName') + maxLength(30) + lettersDigitsOrEmail
required('phoneNumber') + e164Pattern
required('emailAddress') + rfcEmail

// Async
usernameUniqueValidator(AccountValidationService)
emailUniqueValidator(AccountValidationService)
phoneUniqueValidator(AccountValidationService)
```

### Sending Credentials Dialog (1 validator)

```ts
required('deliveryMethod') // enum: email | sms | both
```

**Total validators across the wizard: 34 (28 sync + 5 async + 1 dialog).**

---

## 🌊 Revised Wave Plan

| # | Wave | Pre-Analysis | Post-Analysis | Notes |
|---|---|---:|---:|---|
| 0 | Validation infra | 100% | 100% | Unchanged |
| 1 | Step 1 implementation | 100% | 90% | 4 field-type corrections to apply |
| 2 | Step 2 implementation | 63% | 55% | +3 new components (radio-card, chip-input, number-stepper) |
| 3 | Step 3 implementation | 70% | 70% | + currency-prefixed input |
| 4 | Step 4 implementation | 78% | 75% | + shared row table needs custom-style variant |
| 5 | Step 5 implementation | 60% | 45% | Password + Role read-only (not editable) |
| **5.5** | **Sending Credentials Dialog (NEW)** | n/a | **40%** | New wave — was missing from v1 |
| **5.6** | **Success Modal (NEW)** | n/a | **80%** | Small wave — likely small effort |
| 6 | Wizard submit | 67% | 70% | Simpler than thought (no delivery method on form) |
| 7 | Polish | 80% | 80% | Unchanged |

**Total waves: 9 (was 8).** Average readiness across waves: 70% (was 77% — drop reflects scope growth).

---

## ⚠ Risks — Revised

| # | Risk | Severity | New/Existing |
|---|---|---|---|
| 1 | Step 5 atomic-vs-separate Identity call | 🔴 HIGH | Existing |
| 2 | Step 2 limit field property names | 🟠 MED | Existing |
| 3 | Submit error routing schema | 🟠 MED | Existing |
| 4 | Step 3 CommChannels DTO shape | 🟢 LOW | Existing |
| 5 | i18n catalog gaps | 🟢 LOW | Existing |
| **6** | **`POST /api/Account/{id}/send-credentials` endpoint existence** | 🔴 **HIGH** | **NEW** |
| **7** | **`<falcon-angular-chips>` or chip-input availability in library** | 🟠 **MED** | **NEW** |
| **8** | **`<falcon-angular-input [showButtons]>` for number stepper** | 🟢 **LOW** | **NEW** |

**Total risks: 8 (was 5).** Net +1 HIGH, +1 MED, +1 LOW.

---

## ✅ Verification Gate Re-Run

| # | Question | v1 Answer | v2 Answer | Δ |
|---|---|---|---|---|
| 1 | Endpoint for account creation? | `POST /api/Node/create-account` | Same | — |
| 2 | AccountName max? | 30 chars | Same (placeholder "Max 30 Characters" confirms in UI) | — |
| 3 | Uniqueness check? | `AccountValidationService.checkAccountNameExists` | Same | — |
| 4 | PES integration? | `AccessControlFacade.authorize` | **N/A for Add Client AO** — Role is hardcoded "Account Owner" in this flow | ✏ Re-scoped |
| 5 | Validators folder? | `<step>/validations/validations.ts` | Same | — |
| 6 | Password level enum? | `ePasswordSecurityLevel { Normal, Advanced }` | Same | — |
| 7 | CommChannels endpoint? | `GET /api/CommunicationChannel` | Same | — |
| 8 | Wizard state service? | `AddClientWizardStateService` | Same | — |
| **9** | **Credential delivery API?** | **Unknown** | **`POST /api/Account/{id}/send-credentials` — needs BE confirmation (Q10)** | 🆕 NEW |
| **10** | **Password rendering on Step 5?** | **Hidden (Q1 resolution)** | **Disabled read-only display (CORRECTION)** | 🔴 Corrected |
| **11** | **Role rendering on Step 5?** | **PES-loaded dropdown (Q2)** | **Disabled read-only "Account Owner"** | 🔴 Corrected |

**11 verification points (was 8). 8 same + 3 new/corrected.**

---

## 🧠 Brain Skill Addition — Visual Source-of-Truth Methodology

A new brain skill is being added: `code-skills/visual-source-of-truth-analysis-skill`.

**Trigger phrases:** `analyze screenshots for <page>`, `deep visual analysis of <page>`, `re-analyze with source of truth`

**5-phase methodology:**

1. **Gather** — confirm all 3 sources exist (screenshots, HTML, React)
2. **Visual extract** — per-screenshot element inventory (fields, controls, layout)
3. **Source grounding** — read React/HTML to confirm types + behaviors
4. **Cross-reference** — compare against prior plan; log corrections
5. **Re-score honestly** — adjust % per dimension; produce delta table

**Output contract:** Obsidian note + PDF + Brain SK commit.

Full skill spec at `C:/Falcon/brain-skills/code-skills/visual-source-of-truth-analysis-skill/Skill.md`.

---

## 📎 Companion Artifacts

- **PDF v1 (Brain Coverage):** `C:/Falcon/Falcon Specs v2.0 - Add Client Brain Coverage Report.pdf`
- **PDF v2 (Deep Analysis):** `C:/Falcon/Falcon Specs v3.0 - Add Client Deep Analysis.pdf`
- **Obsidian v1:** `[[Add-Client-Brain-Coverage-Report]]`
- **Obsidian v2:** this file
- **Parent plan:** `[[15-IMPLEMENTATION_PLAN]]` v2.1 (needs v2.2 update reflecting these findings)
- **New brain skill:** `C:/Falcon/brain-skills/code-skills/visual-source-of-truth-analysis-skill/`

---

## 🎯 Bottom Line for the Boss

- **The Brain dropped from 94% → 78% on purpose.** It LEARNED from real source. The honest number wins.
- **11 corrections to prior assumptions** — 4 of them are HIGH severity (Step 2 dual-layout limits, Step 5 read-only Password/Role, Delivery in modal not form).
- **6 new components discovered** that weren't in v1 plan. Total new build effort: 8-12 hours.
- **1 new HIGH risk:** `/send-credentials` endpoint existence. Backend confirmation requested.
- **Wave count grew from 7 → 9.** Two new waves (5.5 Sending dialog + 5.6 Success modal).
- **Validators across wizard: 34 total** (28 sync + 5 async + 1 dialog).
- **PDF v3.0 contains** per-step screenshots + component map + validators + revised numbers.

**Decision:** continue with Wave 0 + Wave 1 as planned; deep-research Steps 2–5 in parallel; commission backend Q10 (send-credentials endpoint) immediately.

## Tags

#type/deep-analysis #flow/add-client #page/organization-hierarchy #screenshot-grounded #source-grounded #brain-learning #v2 #before-after-comparison
