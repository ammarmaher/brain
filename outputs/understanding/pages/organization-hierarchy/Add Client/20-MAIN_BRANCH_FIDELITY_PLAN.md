---
type: main-branch-fidelity-plan
purpose: lock the new theme implementation to mirror main-branch backend integration 1:1
flow: Add Client wizard
page: Organization Hierarchy
date: 2026-05-16
version: v1.0
status: locked-against-origin-main
source: "Brain Outputs/worktrees/falcon-old-ui-main/ (detached @ 803ac1d1) — origin/main of falcon-web-platform-ui"
fidelity-rule: "Backend is source of truth. New theme MUST match main-branch DTO + flow + validation exactly."
overall-understanding: 96%
related:
  - "[[19-COMPONENT_CUSTOMIZATION_PLAN]]"
  - "[[Add-Client-Deep-Analysis-v2]]"
---

*** Add Client — Main-Branch Fidelity Plan v1 ***
*** Mirror origin/main backend integration exactly · zero backend changes ***
*** 96% understanding — locked against actual main-branch source ***

# 🎯 Main-Branch Fidelity Plan (file 20)

> **Your hard rule:** the backend is the source of truth. It works. We're just building a new theme. The new theme must use the **same DTO**, **same API calls**, **same validation directives**, **same popup-triggers-API flow** as origin/main of `falcon-web-platform-ui`.

> **What changed in my understanding (vs v4 plan):** I read the actual main-branch source — `node-api.service.ts`, `create-client-wizard.component.ts`, `create-client-wizard.model.ts`, `information-client-step.component.ts`, `comm-channels-step.component.ts`. Several v4 assumptions were wrong. This file corrects all of them and locks the implementation to main-branch fidelity.

---

## 📈 Understanding Percentages

### Per-API Understanding (5 endpoints)

| # | API | Understanding | Evidence |
|---|---|---:|---|
| 1 | `POST commerce/Node/create-account` (the big one) | **100%** | Read `node-api.service.ts:52-71` + `CreateClientWizardRequestDto` interface |
| 2 | `GET commerce/communicationChannel` (Step 3 catalog) | **95%** | Read `communication-channel-api.service.ts` |
| 3 | `GET commerce/application` (Step 4 catalog) | **95%** | Read `application-channel-api.service.ts` |
| 4 | `LookupService.getLookup(LOOKUP_IDS.Country)` (Step 1 cascades) | **100%** | Read `information-client-step.component.ts:193-214` |
| 5 | `AccountValidationService.checkAccountNameExists(name)` (Step 1 async) | **100%** | Read directive + service usage |
| **Average per-API understanding** | | **98%** | |

### Per-Step Understanding (5 steps + 2 dialogs)

| Step | Understanding | Why |
|---|---:|---|
| Step 1 — Information | **95%** | Full directive + lookup + enum mapping locked |
| Step 2 — Settings | **95%** | DTO confirmed (incl. `balanceTransferLimit` field) |
| Step 3 — CommChannels | **95%** | PricingType enum + status enum confirmed |
| Step 4 — Applications | **95%** | Same as Step 3 (shared row pattern) |
| Step 5 — Account Owner | **92%** | Username `.trim().toLowerCase()` rule discovered |
| Send Credentials Popup | **100%** | `<falcon-send-credentials-popup>` already shared lib component |
| Finish Alert Dialog | **90%** | `<falcon-finish-alert-dialog>` exists in OLD lib but NOT in new — port required |
| **Average per-step understanding** | **95%** | |

### Overall Understanding

| Dimension | % |
|---|---:|
| Backend API contract | 98% |
| Wizard submission flow | 100% |
| Per-step validation logic | 95% |
| Lookup IDs + enums | 100% |
| Popup integration | 95% |
| Component reuse | 95% |
| **WEIGHTED OVERALL** | **96%** |

---

## 🔧 Main-Branch Truth — What I Now Know (and v4 Got Wrong)

### Critical Correction #1: The DTO has `countryId` + `cityId`, NOT `country` + `city`

v4 said Country/City are dropdown strings. **Wrong.** They are GUIDs from `LookupService.getLookup(LOOKUP_IDS.Country)`.

```ts
// MAIN BRANCH — create-client-wizard.model.ts:24-25
countryId?: string | null;   // GUID from lookup
cityId?: string | null;      // GUID from lookup (cascade by country)
```

### Critical Correction #2: `balanceTransferLimit` EXISTS in Settings DTO

v3 dropped it ("not in screenshot"). v4 confirmed dropped. **Wrong.** Main-branch DTO has it:

```ts
// MAIN BRANCH — create-client-wizard.model.ts:42
balanceTransferLimit?: number;
```

The screenshot may not show it because it's optional, but the DTO accepts it. New theme MUST include the field (likely hidden or behind a feature flag).

### Critical Correction #3: Classification + Authority are `number` enums, NOT free-text

```ts
classificationCategory?: number | null;       // ClassificationCategory enum
classificationSubCategory?: number | null;    // ClassificationSubCategory enum
authorityLetterType?: number | null;          // AuthorityLetterType enum
```

These come from page-level TypeScript enums (`ClassificationCategory`, `ClassificationSubCategory`, `AuthorityLetterType` — all exported from `@falcon`) + their i18n maps (`ClassificationCategoryI18n`, etc.) + the `Helper.enumToOptions(enum, i18n, translate)` utility.

### Critical Correction #4: Username is `.trim().toLowerCase()` before submit

```ts
// MAIN BRANCH — create-client-wizard.component.ts:352
userName: (model.accountOwner.userName ?? '').trim().toLowerCase(),
```

Not a UI thing — it's a payload sanitization step in `buildWizardModel()`. New theme MUST replicate.

### Critical Correction #5: Comm channels + Applications submit only `visibility===true` rows

```ts
// MAIN BRANCH — create-client-wizard.component.ts:337-349
const filterVisible = <T extends { visibility?: boolean }>(services?: T[]) =>
  services?.filter((service) => service.visibility === true);
```

Off rows are STRIPPED from the payload before POST. New theme MUST replicate.

### Critical Correction #6: `<falcon-finish-alert-dialog>` does NOT exist in new codebase

Exists in `falcon-old-ui-main/libs/falcon/src/shared-ui/lib/components/finish-alert-dialog/` (uses PrimeNG `p-dialog`). NOT in the new `libs/falcon-ui-core/`. Two options:

1. **Port + de-PrimeNG it** — rewrite using `<falcon-angular-dialog>` (recommended, matches new theme rules)
2. **Use `<falcon-angular-popup variant="success">`** if the success variant exists

---

## 🌊 The Confirmed Flow (main-branch authoritative)

```
User clicks "Finish" on Step 5
   ↓
onWizardFinish() → showSendCard = true  (opens popup, NO API call yet)
   ↓
User picks DeliveryMethod in <falcon-send-credentials-popup>
   ↓
Popup emits (submit) with DeliveryMethod enum value
   ↓
onSendCredentials(method) is invoked:
   - wizardState.model.deliveryMethod = method      (set the field)
   - wizardModel = buildWizardModel()                (filter invisible rows + lowercase username)
   - nodeApiService.createAccount(wizardModel)      ← SINGLE ATOMIC POST happens HERE
       ↓
       POST /api/Node/create-account
       body: full CreateClientWizardRequestDto (incl. deliveryMethod)
       ↓
       On 200 + isSuccessful + result:
          showSendCard = false
          showFinishDialog = true       (open success modal)
       On error:
          alert(errorMessage)            (current main-branch UX — could be improved in new theme)
   ↓
User closes <falcon-finish-alert-dialog>
   ↓
onFinishDialogVisibleChange(false)
   ↓
finishClosed.emit()  →  hierarchy tree refresh (consumer's job)
```

**Your point is 100% confirmed:** the popup configures the DeliveryMethod, then the API is called AFTER the popup submits — NOT after Finish click. The API call happens **with** the popup's choice as part of the payload, NOT as a separate "send credentials" call.

---

## 🗺 Main-Branch DTO Map (the canonical contract)

```ts
CreateClientWizardRequestDto {
  id?: string,                              // GUID
  info: {
    id?: string,
    profilePictureInfo?: AttachmentRequestModel | null,
    accountName?: string | null,            // Step 1 — required (FalconStartWithLetterMax30Directive)
    financeId?: string | null,              // Step 1 — required
    classificationCategory?: number | null, // ClassificationCategory enum
    classificationSubCategory?: number | null,
    authorityLetterType?: number | null,    // AuthorityLetterType enum
    entityName?: string | null,
    sector?: string | null,                 // PLAIN TEXT (per main + React)
    budgetNo?: string | null,
    countryId?: string | null,              // GUID from lookup
    cityId?: string | null,                 // GUID from lookup (cascade by country)
    district?: string | null,               // PLAIN TEXT
    street?: string | null,
    buildingNumber?: string | null,
    postalCode?: string | null,
    additionalAddress?: string | null,
    anotherId?: string | null,
    vatRegistrationNumber?: string | null,  // 15-digit pattern
  },
  settings: {
    id?: string,
    passwordSecurityLevel?: PasswordSecurityLevel,   // enum Normal=1 | Advanced=2
    allowedIPs?: string[],
    maxNormalUserLimit?: number,
    maxSystemUserLimit?: number,
    maxNodeLevel?: number,
    balanceTransferLimit?: number,                    // EXISTS in DTO (was wrong in v3/v4)
  },
  commChannels: {
    id?: string,
    services?: CreateClientServiceDto[]               // ONLY visible rows submitted
  },
  applications: {
    id?: string,
    services?: CreateClientServiceDto[]               // ONLY visible rows submitted
  },
  accountOwner: {
    id?: string,
    accountOwnerProfilePictureInfo?: AttachmentRequestModel | null,
    firstName?: string,
    lastName?: string,
    userName?: string,                                // .trim().toLowerCase() before submit
    password?: string,
    nationalId?: string,
    phoneNumber?: string,
    emailAddress?: string,                            // (note: "emailAddress", not "email")
    role?: UserRoles                                  // UserRoles enum
  },
  deliveryMethod?: DeliveryMethod                     // set from popup BEFORE API call
}

CreateClientServiceDto {
  id?: string,
  appId?: string,                                     // ⚠ drift #11 — same field for app + commchannel
  name: string,
  visibility: boolean,                                // false rows are stripped from payload
  priceType?: number,                                 // PricingType enum
  priceValue?: number,
  status?: string
}
```

---

## 🛠 Required Falcon Directives + Services (from main-branch imports)

| Directive / Service | Origin | Used For |
|---|---|---|
| `FalconStartWithLetterMax30Directive` | `@falcon` | Account Name validation (letter prefix + max 30) |
| `FalconLettersDigitsMaxDirective` | `@falcon` | Finance ID, VAT, others |
| `FalconCheckExistsDirective` | `@falcon` | Async uniqueness check (consumes a checker function input) |
| `FalconFormValidateDirective` | `@falcon` | Wraps NgForm for cross-field validation hooks |
| `WizardHostComponent` + `WizardState` + `WizardStepFormDirective` | `@falcon` | Wizard contract |
| `AccountValidationService` | `@falcon/shared-data-access` | `checkAccountNameExists`, `isUserExist` |
| `LookupService` | `@falcon/shared-data-access` | `getLookup(LOOKUP_IDS.Country)` etc. |
| `Helper` | `@falcon` | `enumToOptions`, `mapLookupToUi` |
| `LOOKUP_IDS` (constants) | `@falcon` | `.Country`, ... |
| `ClassificationCategory` + `ClassificationCategoryI18n` | `@falcon` | Step 1 enum |
| `ClassificationSubCategory` + `ClassificationSubCategoryI18n` | `@falcon` | Step 1 enum |
| `AuthorityLetterType` + `AuthorityLetterTypeI18n` | `@falcon` | Step 1 enum |
| `PricingType` + `PricingTypeI18n` | `@falcon` | Step 3/4 enum |
| `ChannelStatus` + `ChannelStatusI18n` + `ChannelStatusToString` | `@falcon` | Step 3 status pill |
| `PasswordSecurityLevel` | `@falcon` | Step 2 enum (Normal=1, Advanced=2) |
| `DeliveryMethod` | `@falcon` | Popup enum (Email=1, Sms=2, Both=3) |
| `UserRoles` | `@falcon` | Step 5 role enum |
| `AttachmentRequestModel` | `@falcon` | Profile picture payload shape |
| `FalconSendCredentialsPopupComponent` | `@falcon` | The popup (Step 5 → API) |
| `FalconFinishAlertDialogComponent` | `@falcon` (OLD only — port required) | Success modal |

**Key takeaway:** every piece of validation, enum, lookup, and component already exists in `@falcon`. New theme **imports and reuses** — does not reinvent.

---

## 📐 Step-by-Step Wiring Plan (locked against main)

### Step 1 — Information

| Field | Validation directive | Notes |
|---|---|---|
| Account Name | `FalconStartWithLetterMax30Directive` + `FalconCheckExistsDirective` (with `checkAccountNameExists` checker) | Async unique check |
| Finance ID | `required + FalconLettersDigitsMaxDirective` | |
| Classification Category | `Select` bound to `selectedClassificationCategory` (Hook<number>) | From `enumToOptions(ClassificationCategory, ClassificationCategoryI18n, translate)` |
| Classification Sub Category | Same pattern | |
| Authority Letter Type | Same pattern | |
| Country | `AutoComplete` with `countrySuggestions` | Bound to `selectedCountry.value` → sets `state.model.info.countryId` |
| City | `AutoComplete` cascade-loaded on country change | Same pattern |
| Sector / District / Street / Building / Postal / Additional / Another ID | Plain text `InputText` with optional length validators | |
| VAT | `FalconLettersDigitsMaxDirective` (15-digit) | |

### Step 2 — Settings

Already 95% built. Add field handlers for `balanceTransferLimit` IF main-branch UI exposes it (verify by reading the Settings HTML for the field).

### Step 3 — CommChannels

```ts
priceTypeOptions = helper.enumToOptions(PricingType, PricingTypeI18n, translate);
```

When `visibility=false` → `priceType = undefined` + `priceValue = undefined`. Filter out before submit.

### Step 4 — Applications

Identical to Step 3 with `Applications` enum if it exists, else same `PricingType`.

### Step 5 — Account Owner

| Field | Notes |
|---|---|
| First Name / Last Name | Required + letters only |
| User Name | Required + `FalconCheckExistsDirective` (via `isUserExist`) → BEFORE submit: `.trim().toLowerCase()` |
| Password | Display-only or server-generated (per Q1 resolution) |
| National ID / Iqama | Optional text |
| Phone Number | Required + E.164 pattern + `isUserExist(*, *, phone)` |
| Email Address | Required + RFC pattern + `isUserExist(*, email, *)` |
| Role | `UserRoles` enum (hardcoded Account Owner OR PES-driven) |

### Send Credentials Popup

Drop-in `<falcon-send-credentials-popup>` with:
- `[(visible)]="showSendCard"`
- `[accountOwnerName]="ownerName"` (computed from firstName + lastName)
- `[phoneNumber]="ownerPhone"`
- `[email]="ownerEmail"`
- `[loading]="isCreatingAccount"`
- `(submit)="onSendCredentials($event)"`

### Finish Alert Dialog

**Port required.** Build new `<app-finish-alert-dialog>` (or use `<falcon-angular-popup variant=success>` if available) using `<falcon-angular-dialog>` internally — NO PrimeNG.

---

## 📋 Validations Folder Per Step (signal-coupled, per your hard rule)

```
client-information-step/
├── validations/
│   └── validations.ts                ← signal-coupled validators

client-settings-step/
├── validations/
│   └── validations.ts                ← signal-coupled validators

client-comm-channels-step/
├── validations/
│   └── validations.ts                ← per-row validators

client-applications-step/
├── validations/
│   └── validations.ts                ← per-row validators

client-account-owner-step/
├── validations/
│   └── validations.ts                ← signal-coupled validators incl. 3 async
```

Each `validations.ts` exports:
- `validateStep<N>(value: FormValue): Record<keyof FormValue, ValidationMessage | null>`
- Per-field error `computed()` signal factories
- Async validator factories (for fields with backend uniqueness check)

The component imports + wires + binds to `<falcon-form-field [errorKey]>`.

---

## ⚠ Open Items (4 small ones, none blocking)

| # | Item | Severity | Resolution |
|---|---|---|---|
| 1 | `balanceTransferLimit` UI exposure — does main-branch Settings step show a slider/input for this? | 🟢 LOW | Read main-branch Settings HTML; if yes, port; if hidden, default 0 |
| 2 | Step 5 Role — UserRoles enum value for "Account Owner"? | 🟢 LOW | Read `UserRoles` enum |
| 3 | Profile picture `AttachmentRequestModel` shape | 🟢 LOW | Read `@falcon` exports |
| 4 | Port `<falcon-finish-alert-dialog>` (PrimeNG → falcon-angular-dialog) | 🟠 MED | Wave 5.6 build task |

---

## ✅ Bottom Line

- **Understanding: 96%.** Backend contract 100%, popup-triggers-API flow 100%.
- **Zero backend changes needed** — your hard rule is honored.
- **All enums + directives + services exist** in `@falcon` and are re-used by the new theme.
- **One small port required** — finish-alert-dialog (PrimeNG → falcon-angular-dialog).
- **5 critical v4 corrections logged**: countryId/cityId (not strings), balanceTransferLimit (exists), classification as number enums, username sanitization, visible-only filter.

I am ready to code. Say "go" and I start Wave 0 + Wave 1.

## Tags

#type/fidelity-plan #flow/add-client #main-branch-truth #zero-backend-change #signal-coupled-validations
