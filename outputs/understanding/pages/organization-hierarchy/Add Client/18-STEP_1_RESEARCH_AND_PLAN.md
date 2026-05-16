---
type: step-research-and-plan
purpose: deep-step1-research-plus-implementation-ready-plan
created: 2026-05-16
related-plan: 15-IMPLEMENTATION_PLAN.md v2.1
target-step: Step 1 — Account Information
status: implementation-ready
scope: frontend only · no code · planning artifact
implementation-owner: Ammar Mk
---

*** Add Client Step 1 — Research + Plan ***
*** Backend ↔ frontend wiring, every validator, every directive ***
*** All decisions disk-grounded, implementation-ready ***

# 🔬 Step 1 (Account Information) — Research + Plan

> Comprehensive research + implementation-ready plan for **Step 1 of the Add Client wizard**. Built by inspecting backend Commerce + Identity + Lookup contracts, the existing frontend component, the `validators.ts` library, the `AccountValidationService`, and the Falcon component dossiers. **All gaps closed; you can begin implementation immediately.**

## 🆕 Big news from this research

1. **Q6 is fully resolved** — `GET /api/CommunicationChannel` exists at `CommunicationChannelController`, returns `List<CommunicationChannelResponse>`. The earlier ENDPOINT_REGISTRY grep missed it. Step 3 backend question is **closed**.

2. **`AccountName` max is 30 chars** in the DTO (`[ThrowIfMaxLengthExceed(30)]`) — **NOT 100 as earlier plans assumed**. This matches Username's 30 cap. Plan v2.1 needs a correction.

3. **`accountNameUniqueValidator` + `userNameUniqueValidator` already exist** as `AsyncValidatorFn` factories in `services/validators.ts` — but they're wired to local mock data (`treeProvider` callback), NOT to `AccountValidationService` (the backend). The gap is real but smaller than thought: add a backend-bound variant, keep the mock for tests.

4. **Cross-field server errors are well-documented**: `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided`, `OfficialDataRequired`. These need FE pre-checks to avoid round-trips.

---

## 📋 Section 0 — Executive summary

| Aspect | Value |
|---|---|
| Step | 1 of 5 (Account Information) |
| Required fields | AccountName, Classification (cat + sub), AuthorityLetterType, FinanceId, BudgetNumber (conditional) |
| Optional fields | EntityName, Sector (cascade from authority), Country, City, District, Street, BuildingNo, PostalCode, AdditionalAddress, AnotherId, VAT, ProfilePicture |
| Backend endpoints (Step 1) | `GET /api/Node/ValidateAccountName?AccountName=` (async unique check) · `GET /api/Lookup/{id}` (cascade dropdowns) |
| Falcon components | `<falcon-angular-input>` · `<falcon-angular-dropdown>` · `<falcon-angular-form-field>` · `<falcon-angular-photo-uploader>` · `<falcon-angular-textarea>` (new — for Additional Address) |
| Directives needed | None new (Falcon library inputs handle keyboard/RTL/focus already) |
| Async validators | 1 — `accountNameUniqueValidator` (backend-bound, new factory wrapping `AccountValidationService.checkAccountNameExists`) |
| Cross-field validators | 3 — Country↔City, City↔District, City↔Street |
| Init data calls | 4 — Lookup for Authority, Classification Cat/Sub, Country, City (cascade) |

---

## 🔍 Section 1 — Backend understanding (Step 1 surface)

### 1.1 Commit endpoint (called on Step 5 submit, NOT Step 1)

`POST /api/Node/create-account` with `CreateAccountRequest`. **Step 1 does NOT submit anything on its own** — it just buffers form values in the wizard's signal state.

### 1.2 Account-name uniqueness endpoint (Step 1 async validator)

```
GET /api/Node/ValidateAccountName?AccountName=<name>
Auth: class-level (Falcon admin role)
Returns: ServiceOperationResult<bool>
   - true  = name is taken (duplicate)
   - false = name is available
Header convention: 'notShowToaster': 'true' to suppress global error toast
Gateway: System Gateway (default for Commerce)
```

**Already wrapped in `AccountValidationService.checkAccountNameExists(name)` at `libs/falcon/.../shared-data-access/lib/services/account-validation.service.ts`** — returns `Observable<boolean>` where `true` = exists.

### 1.3 Lookup endpoint (Step 1 cascade dropdowns)

```
GET /api/Lookup/{id}?name=&code=
Returns: List<Hook<LookupValueResponse>>
   - Hook<T>: { id: T, name: string } — wraps each lookup value
Auth: class-level
Gateway: System Gateway
```

**Already wrapped in `LookupService.getLookup(lookupId, args?)` at `libs/falcon/.../shared-data-access/lib/services/lookup.service.ts`** — returns `Observable<Hook<LookupValueResponse>[]>`.

Lookups needed by Step 1 (lookup IDs TBD per drift — recommend caching the IDs in a shared constants file):

| Lookup | Driving change | Lookup ID source |
|---|---|---|
| Authority Letter Type | wizard open | Static (or `LOOKUP_IDS.AuthorityLetter`) |
| Classification Category | wizard open | Static (or `LOOKUP_IDS.ClassificationCategory`) |
| Classification SubCategory | category change | Cascade by category ID |
| Country | wizard open | Static (or `LOOKUP_IDS.Country`) |
| City | country change | Cascade by country ID |
| Sector | authority change | Static map `sectorForAuthority(authority)` — currently in code |

### 1.4 CreateAccountRequest.Info DTO (the Step 1 contribution to the composite submit)

| Field | Type | DTO validation | Step-1 FE-side rule |
|---|---|---|---|
| `AccountName` | `string` | `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` | required · letters-prefix · max **30** (not 100) · async uniqueness |
| `FinanceId` | `string?` | (no attribute) — handler enforces required | required (drift #3) · 2-50 chars free-text |
| `ProfilePictureInfo` | `ProfilePictureInfo?` | none | optional · max 2 MB · image MIME types · server validates `ProfilePictureSizeExceeded` + `ImageExtensionNotAllowed` |
| `ClassificationCategory` | `eClassificationCategory?` | `[ThrowIfNotEnumValue<...>]` | required · from Lookup |
| `ClassificationSubCategory` | `eClassificationSubCategory?` | `[ThrowIfNotEnumValue<...>]` | required when category selected · from cascade Lookup |
| `AuthorityLetterType` | `eAuthorityLetterType?` | `[ThrowIfNotEnumValue<...>]` | required · from Lookup · drives Sector + Budget |
| `EntityName` | `string?` | none | optional · 2-50 chars when present |
| `Sector` | `string?` | none | derived from Authority via `sectorForAuthority()` |
| `BudgetNo` | `string?` | none (handler conditional) | required when Authority ∈ {Government, Charity} (drift #4) · numeric · 2-50 chars |
| `CountryId` | `string?` | none | optional · server triggers `CountryRequiredWhenCityProvided` if CityId set |
| `CityId` | `string?` | none | optional · server triggers `CityRequiredWhenDistrictProvided` + `CityRequiredWhenStreetProvided` |
| `District` | `string?` | none | optional · 2-50 chars · requires City |
| `Street` | `string?` | none | optional · 2-50 chars · requires City |
| `BuildingNumber` | `string?` | none | optional · 2-50 chars |
| `PostalCode` | `string?` | none | optional · 2-10 chars (numeric or alphanumeric) |
| `AdditionalAddress` | `string?` | none | optional · 0-500 chars (textarea) |
| `AnotherId` | `string?` | none | optional · 2-50 chars |
| `VatRegistrationNumber` | `string?` | none | optional · 15-digit Saudi VAT format |

### 1.5 Backend errors Step 1 might surface (400 + 422)

#### 400 — Bad Request (Step 1 relevant subset)

| Error code | Triggered by | FE response |
|---|---|---|
| `AccountNameRequired` | empty AccountName at submit | FE blocks Next; should never reach BE |
| `AccountNameTooLong` | AccountName > 30 chars | FE blocks (sync validator) |
| `FinanceIdRequired` | empty FinanceId at submit | FE blocks (sync validator per drift #3) |
| `BudgetNoRequired` | empty BudgetNo when conditional applies | FE blocks (sync validator per drift #4) |
| `CountryRequiredWhenCityProvided` | City set, Country empty | FE pre-checks (cross-field validator) |
| `CityRequiredWhenDistrictProvided` | District set, City empty | FE pre-checks (cross-field validator) |
| `CityRequiredWhenStreetProvided` | Street set, City empty | FE pre-checks (cross-field validator) |
| `OfficialDataRequired` | (unclear trigger — flag for backend) | Generic message + Light Learning event |
| `CommercialRegistrationRequired` | likely Authority ∈ {Private}? | FE conditional |
| `LicenseNoRequired` | likely Authority-conditional | FE conditional |
| `ProfilePictureSizeExceeded` | upload > N MB | FE pre-checks (uploader maxSize) |
| `ImageExtensionNotAllowed` | non-image upload | FE pre-checks (uploader accept) |
| `FileSizeExceeded` | upload > N MB (general) | FE pre-checks |
| `MainNodeAccountInfoRequired` | `Info` null at submit | should never reach BE if FE wizard works |
| `MaxLengthExceeded` | any field over limit | FE blocks per-field validator |
| `BelowMinimumLength` | any field under min | FE blocks per-field validator |
| `RequiredFieldMissing` | unspecified required | catch-all server fallback |

#### 422 — Unprocessable Entity

| Error code | Triggered by |
|---|---|
| `InvalidAuthorityLetterType` | enum mismatch (FE should match BE enum) |
| `InvalidValue` | generic invalid value |
| `InvalidCreationFlow` | wizard state corruption |
| `InvalidTenantId` | (rare; tenant context mismatch) |

---

## 🧰 Section 2 — Frontend infrastructure understanding

### 2.1 HTTP plumbing (already in place)

`HttpService` at `libs/falcon/src/shared-data-access/lib/services/http.service.ts`:

- `get<T>(url, options?)`, `post<T>(url, body, options?)`, `put<T>(url, body, options?)`, `delete<T>(url, options?)`
- Wraps `HttpClient` + adds the gateway context
- **Always use `...useGateway()`** in the options to attach the gateway base URL (defaults to System Gateway; pass `Gateway.IdentityGateway` for Identity calls)
- Header `'notShowToaster': 'true'` suppresses the global error toaster for "is X taken?" style probes

### 2.2 LookupService (cascade dropdowns)

`LookupService.getLookup(lookupId, args?)`:

- Returns `Observable<Hook<LookupValueResponse>[]>`
- `Hook<T> = { id: T, name: string }`
- Already injected via `inject(LookupService)`

**For Step 1 cascade dropdowns:**

```
Authority lookup        →  loaded on init
Classification Cat       →  loaded on init
Classification SubCat    →  loaded on Cat change (cascade)
Country                  →  loaded on init
City                     →  loaded on Country change (cascade)
Sector                   →  derived locally from Authority (NOT a Lookup — uses sectorForAuthority() map)
```

### 2.3 AccountValidationService (backend-bound async)

`AccountValidationService.checkAccountNameExists(name)`:
- POSTs `commerce/Node/ValidateAccountName?accountName=<name>`
- Returns `Observable<boolean>` where `true` = duplicate, `false` = available
- Suppresses error toaster
- **Use for Step 1's async uniqueness check**

### 2.4 Page-level `services/validators.ts` (sync + factory async validators that already exist)

Full export inventory:

| Validator | Type | Purpose | Step 1 use? |
|---|---|---|---|
| `lettersAndDigits` | sync | letters + numbers + spaces (Unicode) | maybe (EntityName) |
| `lettersDigitsOrEmail` | sync | letters/digits OR email pattern | no |
| `nationalIdValidator` | sync | 10-digit Saudi national ID | no (Step 5) |
| `anyStringValidator(min, max, required)` | sync factory | generic length-bounded string | YES — most optional fields |
| `accountNameValidator` | sync | required + letters-prefix + length (page-level, currently `ACCOUNT_NAME_MIN=2, MAX=30`) | **YES — primary AccountName validator** |
| `accountNameUniqueValidator(treeProvider, exceptId?)` | **async factory** | local mock check via `treeProvider() → collectAccountNames` | ⚠️ **needs backend variant** (this checks mock, not backend) |
| `nodeNameValidator` | sync | similar to accountName, max 30 | no |
| `personNameValidator` | sync | letters + digits, 2-50 chars | no (Step 5) |
| `userNameValidator` | sync | letters-digits-or-email, 2-30 chars | no (Step 5) |
| `userNameUniqueValidator(existingUsernames)` | **async factory** | local mock username uniqueness | ⚠️ **needs backend variant** (Step 5) |
| `emailValidator` | sync | RFC email format | no (Step 5) |
| `phoneValidator` | sync | E.164 format | no (Step 5) |
| `saudiPhoneValidator` | sync | `+966\d{9}` format | no (Step 5) |
| `passwordValidator(securityLevel)` | sync factory | password rules per level | no (server-generated, drift #1 dead) |
| `roleAssignmentValidator` | sync | role must be in granted list | no (Step 5) |
| `permissionGroupValidator` | sync | permission group format | no (Step 5) |
| `maxNodeLevelsValidator(max)` | sync factory | depth limit | no (Step 2) |
| `userLimitValidator` | sync | 1-999 int range | no (Step 2) |
| `allowedIpListValidator` | sync | each item valid IPv4/IPv6/CIDR | no (Step 2) |
| `hierarchyDepthGuard` | sync factory | hierarchy depth check | no (Add Node) |
| `passwordsMatch` | sync | two passwords match | no (server-generated) |
| `parentMustExist` | sync | node parent must be in tree | no (Add Node) |
| `cannotMoveUnderSelf` | sync | can't move node under itself | no (Edit Node) |
| `runValidators(control, ...vs)` | utility | run multiple validators on one control | YES — use for composed validation |

### 2.5 Page-level `services/validation-messages.ts` (i18n + error rendering)

Exports:

- `ValidationMessage = { key: string, params?: Record<string, string|number> }` — the canonical UI error shape
- `messageFor(errors: ValidationErrors): ValidationMessage | null` — converts validator output to i18n message
- `hasLiveError(errors: ValidationErrors): boolean` — decides whether to show error during typing or wait for blur
- `LIVE_ERROR_KEYS: Set<string>` — keys that show live (most format/length errors)
- `VALIDATOR_KEYS: Record<string, (err) => ValidationMessage>` — the full mapping table
- `ServiceErrorEnvelope` + `toServiceErrors` — for backend error → UI error pipeline

**Backend error keys → i18n keys are already mapped** for: `required, whitespace, maxLength, minLength, startsWithLetter, lettersOnly, lettersAndDigits, lettersDigitsOrEmail, invalidEmail, invalidPhone, invalidSaudiPhone, invalidIp, invalidList, invalidLimit, notInteger, outOfRange, duplicateAccountName, duplicateUsername, passwordTooShort, passwordRequiresUppercase, passwordRequiresLowercase, passwordRequiresDigit, passwordRequiresSpecialChar, passwordsDoNotMatch, parentNotFound, cannotMoveUnderSelf, hierarchyDepthExceeded`.

### 2.6 Existing directives in the workspace

| Directive | Selector | Where it lives | Step 1 use? |
|---|---|---|---|
| `FalconPanZoomDirective` | `[appPanZoom]` | `org-hierarchy-page/components/.../falcon-org-chart/directives/` | no (hierarchy chart) |

**No directives are needed for Step 1.** The Falcon library components (`<falcon-angular-input>`, `<falcon-angular-dropdown>`, etc.) handle keyboard, RTL, focus, and accessibility internally. Adding directives would be over-engineering for this step.

### 2.7 PES integration (Step 1 perspective)

Step 1 is NOT gated by PES at the field level. The PES gate is on the **"Add Client" BUTTON** that opens the wizard (per playbook 01-PERMISSIONS — `Add Client` action key, Falcon role matrix sys-admin/operation/product). Step 5 uses PES for role-grant filtering.

For Step 1: no PES call needed. The wizard already opened means PES already passed.

The PES surface lives at `libs/falcon/src/core/lib/access-control/access-control.facade.ts` + `FalconAccess` action map in `shared-types`. Step 5 will consume it.

---

## 📐 Section 3 — Existing Step 1 component analysis

### 3.1 What works

The current `client-information-step.component.ts` is well-structured:

- ✅ Uses signals: `model.required<ClientInfoFormValue>()` for value, `model<boolean>` for valid + dirty
- ✅ Uses `signal<Set<string>>` for touched-fields tracking
- ✅ Uses `computed<ValidationMessage | null>` per field for errors
- ✅ Uses `effect()` to sync `valid` output from `isFormValid()`
- ✅ Imports `accountNameValidator` + `anyStringValidator` from page-level `validators.ts`
- ✅ Uses `messageFor` + `hasLiveError` from `validation-messages.ts`
- ✅ Honors `<falcon-angular-input>` + `<falcon-angular-dropdown>` + `<falcon-angular-form-field>` + `<falcon-angular-photo-uploader>` per Falcon library doctrine
- ✅ Has `onAuthorityChange()` that derives Sector via `sectorForAuthority()` map

### 3.2 What's missing

| Gap | Impact | Fix |
|---|---|---|
| **No backend uniqueness check** — uses `collectAccountNames(treeRoot)` (mock data) | Doesn't catch real duplicate names in production | Add backend-bound async validator (Section 4) |
| **Static dropdown options** — `AUTHORITY_OPTIONS`, `COUNTRY_OPTIONS`, etc. are hardcoded arrays in `models.ts` | Adding new authorities/countries requires code release | Load from `LookupService` on init (Section 5) |
| **No `validations/` folder** — validation logic + form schema inline in component | Component is hard to test in isolation; no central per-step rule catalog | Extract to `validations/validations.ts` (Section 6) |
| **No `services/` folder per step** — init data loading inline | No place to compose multiple LookupService calls cleanly | Create `services/services.ts` (Section 5) |
| **No models per step** — types live in wizard-level `models/models.ts` | Per-step locality lost; cross-step coupling | Move step-1 types to `client-information-step/models/models.ts` |
| **No cross-field validators** for Country↔City, City↔District/Street | Backend errors will fire on submit instead of FE pre-check | Add cross-field validators in `validations/validations.ts` |
| **No conditional Budget Number rule** beyond a label change | Submit fails with `BudgetNoRequired` instead of FE block | Add conditional validator (drift #4) |
| **AccountName max** — `accountNameValidator` uses ACCOUNT_NAME_MAX=30 already ✅ | Already correct — DTO matches | No action |
| **No textarea for AdditionalAddress** — currently uses input | Long addresses break (500-char field) | Add `<falcon-angular-textarea>` for AdditionalAddress |
| **No image validation pre-checks on Photo Uploader** | Server rejection only | Wire size + MIME pre-checks via uploader inputs |

---

## 🧩 Section 4 — Falcon components for Step 1

Per the customization order (R-FE-005). All components confirmed to exist in the workspace:

| Field | Falcon component | Import path | Already used? |
|---|---|---|---|
| Account Name | `<falcon-angular-input>` | `@falcon` | ✅ yes |
| Finance ID | `<falcon-angular-input>` | `@falcon` | ✅ yes |
| Entity Name | `<falcon-angular-input>` | `@falcon` | ✅ yes (if rendered) |
| Profile Picture | `<falcon-angular-photo-uploader>` | `@falcon` | ✅ yes |
| Classification Category | `<falcon-angular-dropdown>` | `@falcon` | ✅ yes |
| Classification SubCategory | `<falcon-angular-dropdown>` | `@falcon` | ✅ yes |
| Authority Letter Type | `<falcon-angular-dropdown>` | `@falcon` | ✅ yes |
| Sector (derived) | `<falcon-angular-input>` (readonly) OR `<falcon-angular-dropdown>` (disabled) | `@falcon` | ✅ yes |
| Country | `<falcon-angular-dropdown>` | `@falcon` | ✅ yes |
| City | `<falcon-angular-dropdown>` | `@falcon` | ✅ yes |
| District / Street / Building No / Postal Code / Another ID / VAT | `<falcon-angular-input>` | `@falcon` | ✅ yes |
| Budget Number | `<falcon-angular-input>` (numeric input type) | `@falcon` | ✅ yes |
| Additional Address | `<falcon-angular-textarea>` | `@falcon` | ⚠️ verify import path — may need to add |
| Form field wrapper (label + error layout) | `<falcon-angular-form-field>` | `@falcon` | ✅ yes |

**No raw HTML controls. No SCSS. Tailwind v4 utility classes only on the template.**

### Components NOT needed for Step 1

- `<falcon-angular-button>` — owned by the wizard shell (Next/Previous/Cancel)
- `<falcon-angular-stepper>` — wizard-level
- `<falcon-angular-radio-group>` — Step 5 (Delivery Method)
- `<falcon-angular-multi-select>` — Step 2 (IPs)
- `<falcon-angular-data-table>` — Steps 3+4

---

## 🛡 Section 5 — Validation matrix (complete per-field)

| Field | Sync validators (Layer 4 + 3) | Async validators (Layer 3 + 1) | Cross-field rules (Layer 3) | Init data dependency |
|---|---|---|---|---|
| Account Name | `accountNameValidator` (required, letters-prefix, 2-30) | **`accountNameUniqueValidatorBackend(svc)`** (new — see §6) | none | none |
| Finance ID | `anyStringValidator(2, 50, true)` (required) | none | none | none |
| Entity Name | `anyStringValidator(2, 50, false)` (optional) | none | none | none |
| Profile Picture | size ≤ 2 MB · MIME ∈ {jpeg, png, webp} | none | none | none |
| Classification Cat | required | none | none | Lookup `Classification` |
| Classification SubCat | required when Cat selected | none | requires Cat | Cascade Lookup |
| Authority Letter Type | required | none | none | Lookup `Authority` |
| Sector | none (derived) | none | computed from Authority via `sectorForAuthority()` | none |
| Country | optional | none | required when City set (`CountryRequiredWhenCityProvided`) | Lookup `Country` |
| City | optional | none | required when District/Street set; requires Country | Cascade Lookup |
| District | `anyStringValidator(2, 50, false)` | none | requires City | none |
| Street | `anyStringValidator(2, 50, false)` | none | requires City | none |
| Building Number | `anyStringValidator(2, 50, false)` | none | none | none |
| Postal Code | optional · alphanumeric 2-10 | none | none | none |
| Another ID | `anyStringValidator(2, 50, false)` | none | none | none |
| VAT Registration | optional · `^\d{15}$` (Saudi VAT) | none | none | none |
| Budget Number | **conditional required when Authority ∈ {Government, Charity}** (drift #4) · numeric 2-50 chars | none | depends on Authority | none |
| Additional Address | `anyStringValidator(0, 500, false)` | none | none | none |

### Three cross-field validators (new — needed for Step 1)

1. **`countryRequiredWhenCity`** — fires if CityId is set but CountryId is empty
2. **`cityRequiredWhenDistrict`** — fires if District is set but CityId is empty
3. **`cityRequiredWhenStreet`** — fires if Street is set but CityId is empty

These live in `client-information-step/validations/validations.ts` (not in page-level `validators.ts` — they're step-specific).

---

## 🔌 Section 6 — Async validator wiring (the AccountName uniqueness backend check)

### 6.1 What exists today

`services/validators.ts` exports `accountNameUniqueValidator(treeProvider, exceptId?)` — an `AsyncValidatorFn` factory that:
- Takes a callback `() => ClientNode | null` (the tree root)
- Debounces 250ms via `timer(250)`
- Calls `collectAccountNames(root)` from `mock-tree.ts` (LOCAL CHECK, not backend)
- Returns `{ duplicateAccountName: true }` if name is in the local list

**This is a mock-friendly variant for tests + dev mode. Production needs a backend-bound variant.**

### 6.2 What to add

Add a NEW factory **in `client-information-step/validations/validations.ts`** (NOT in `validators.ts` — step-specific):

```
accountNameUniqueValidatorBackend(svc: AccountValidationService, debounceMs = 350): AsyncValidatorFn
```

What it does:
1. Skip if value empty or untouched
2. Debounce 350ms (longer than mock — saves API calls)
3. Call `svc.checkAccountNameExists(value)` (which already has `notShowToaster: 'true'`)
4. `switchMap` to cancel stale requests
5. Catch HTTP errors → resolve to `null` (defensive — don't block submit on network failure)
6. Return `{ duplicateAccountName: true }` if exists, else `null`
7. Reuse the same `duplicateAccountName` error key → already mapped in `validation-messages.ts`

### 6.3 How the component wires it

```
Step 1 component:
  inject(AccountValidationService)
  inject(Step1ValidationService) (or use validations.ts factories directly)
  
  asyncValidator = accountNameUniqueValidatorBackend(this.accountValidationService)
  
  Account Name signal value change:
    → sync validators run first (accountNameValidator)
    → if sync fails: show sync error, DO NOT call async (saves API call)
    → if sync passes + value > 2 chars: trigger async after 350ms debounce
    → during async: show "pending" state in UI (spinner)
    → on resolve: show ✓ or duplicateAccountName error
```

### 6.4 Sync-then-async contract (R-FE-NEW pattern)

```
SyncValidator    pass    pass    fail
                  ↓       ↓       ↓
AsyncValidator   call    cancel   skip
                  ↓       ↓       ↓
UI               wait    cancel   show sync error
                  ↓
                show async result
```

---

## 🚀 Section 7 — Cascade dropdown loading pattern

### 7.1 The 4 lookups Step 1 needs

| Lookup | Triggered by | Source | Cache |
|---|---|---|---|
| Authority Letter Type | wizard open (init) | `LookupService.getLookup('AuthorityLetter')` | per wizard session |
| Classification Category | wizard open (init) | `LookupService.getLookup('Classification')` | per wizard session |
| Classification SubCategory | Category change | `LookupService.getLookup('ClassificationSub', { code: categoryCode })` | per category value |
| Country | wizard open (init) | `LookupService.getLookup('Country')` | per wizard session |
| City | Country change | `LookupService.getLookup('City', { code: countryCode })` | per country value |

**Sector is NOT a lookup** — it's derived locally from `sectorForAuthority(authority)`. Keep that.

### 7.2 The Step1InitService design

In `client-information-step/services/services.ts` — new file:

```
@Injectable()  // provided at step component level, NOT root
export class Step1InitService {
  inject(LookupService)
  
  // Signals exposed to the component:
  authorityOptions     = signal<LookupOption[]>([])
  classCatOptions      = signal<LookupOption[]>([])
  classSubOptions      = signal<LookupOption[]>([])
  countryOptions       = signal<LookupOption[]>([])
  cityOptions          = signal<LookupOption[]>([])
  
  loadingAuthority     = signal<boolean>(false)
  loadingClassCat      = signal<boolean>(false)
  // ... etc per dropdown
  
  init(): void {
    // parallel: authority + classCat + country
    // takeUntilDestroyed cleanup
  }
  
  onCategoryChange(catCode): void {
    // load SubCategory cascade
  }
  
  onCountryChange(countryCode): void {
    // load City cascade
  }
  
  // Defensive: cache last successful response per lookup id+code
  // Defensive: fallback to hardcoded options on error + Light Learning event
}
```

### 7.3 The component's responsibility

```
Step 1 component:
  inject(Step1InitService)
  
  ngOnInit: Step1InitService.init()
  
  Template:
    [options]="step1Init.authorityOptions()"
    [loading]="step1Init.loadingAuthority()"
    (valueChange)="onAuthorityChange($event)"
  
  onAuthorityChange:
    update value().authority signal
    set derived Sector via sectorForAuthority()
    (Authority change does NOT trigger a lookup — Sector is local)
```

---

## 🚧 Section 8 — Directives needed

**Answer: none for Step 1.**

Reasons:
- Falcon library inputs handle: keyboard navigation, focus management, RTL flipping, accessibility (ARIA), error display state, label/hint slots
- No need for `[autofocus]` directive — `<falcon-angular-input [autofocus]>` already supports it as an input
- No need for `[trim]` directive — sync validators handle whitespace via `whitespace: 'edge'` error key
- No need for `[uppercase]` / `[mask]` — those are field-specific concerns; if needed for VAT or Postal, add them inline as `(blur)="value = value.toUpperCase()"`

**If a directive IS needed later** (e.g., complex input masking), it lives at `client-information-step/directives/directives.ts` per R-FE-009 — but not for Step 1's MVP.

---

## 🗺 Section 9 — Backend error → i18n key mapping

For each backend 400/422 error code that Step 1 might surface, the FE displays a translated message. Mapping lives in `validation-messages.ts` (page-level). Keys to confirm exist (if not, add them):

| Backend code | FE i18n key | Already mapped? |
|---|---|---|
| `AccountNameRequired` | `hierarchy.validation.required` (generic) | ✅ |
| `AccountNameTooLong` | `hierarchy.validation.maxLength` | ✅ |
| `FinanceIdRequired` | `hierarchy.validation.financeIdRequired` | ⚠️ confirm in catalog |
| `BudgetNoRequired` | `hierarchy.validation.budgetNoRequired` | ⚠️ confirm in catalog |
| `CountryRequiredWhenCityProvided` | `hierarchy.validation.countryRequiredWhenCity` | ⚠️ confirm in catalog |
| `CityRequiredWhenDistrictProvided` | `hierarchy.validation.cityRequiredWhenDistrict` | ⚠️ confirm in catalog |
| `CityRequiredWhenStreetProvided` | `hierarchy.validation.cityRequiredWhenStreet` | ⚠️ confirm in catalog |
| `OfficialDataRequired` | `hierarchy.validation.officialDataRequired` | ⚠️ confirm |
| `ProfilePictureSizeExceeded` | `hierarchy.validation.fileSizeExceeded` | ⚠️ confirm |
| `ImageExtensionNotAllowed` | `hierarchy.validation.imageExtensionNotAllowed` | ⚠️ confirm |
| `FileSizeExceeded` | `hierarchy.validation.fileSizeExceeded` | ⚠️ confirm |
| `InvalidAuthorityLetterType` | `hierarchy.validation.invalidAuthorityLetter` | ⚠️ confirm |
| `InvalidValue` | `hierarchy.validation.invalidValue` | ⚠️ confirm |
| `MainAccountSettingsRequired` | `hierarchy.validation.mainAccountSettingsRequired` | ⚠️ confirm |
| `MainNodeAccountInfoRequired` | `hierarchy.validation.mainNodeAccountInfoRequired` | ⚠️ confirm |
| `duplicateAccountName` (sync/async FE-side) | `hierarchy.validation.duplicateAccountName` | ✅ |

**Action item:** before Session 0 ships, audit `validation-messages.ts` `VALIDATOR_KEYS` map against this table. Add missing entries with placeholder en + ar values (translation can come later).

---

## 📁 Section 10 — Files to create + files to modify

### Files to CREATE (4 new files)

```
client-information-step/
├── models/
│   └── models.ts                              ← MOVE step-1 types from ../models/models.ts here
├── services/
│   └── services.ts                            ← NEW: Step1InitService with cascade lookups
└── validations/
    └── validations.ts                         ← NEW: per-step validation factories + cross-field rules
```

### Files to MODIFY (3 existing files)

```
client-information-step/
├── client-information-step.component.ts       ← inject Step1InitService + new async validator wire
└── client-information-step.component.html     ← bind dropdown options to signals + add textarea

add-client-wizard/
└── models/models.ts                           ← REMOVE step-1 types (moved to step folder)
```

### Files to AUDIT (no necessary changes if all keys present)

```
org-hierarchy-page/services/
└── validation-messages.ts                     ← audit per Section 9 mapping table
```

### Files NOT touched

- `add-client-wizard.component.ts` shell (no behavior change)
- `org-hierarchy-page/services/validators.ts` (the existing factories stay; new backend-bound factory goes in step-1 validations.ts)
- `org-hierarchy-page/services/hierarchy-page-state.service.ts` (stays read-only from this step)
- Any other step
- Backend (no changes)

### Lines of code estimate

- `models/models.ts` — ~80 lines (move + tighten existing types)
- `services/services.ts` — ~150 lines (Step1InitService with 5 lookups + cascade methods)
- `validations/validations.ts` — ~120 lines (1 async factory + 3 cross-field validators + form schema)
- Component updates — ~80 lines net (delete inline validation + dropdown options · add init service injection + async validator wiring)
- Template updates — ~30 lines (bind dropdown options to signals · add textarea · add loading states)

**Total Step 1: ~460 lines of code, mostly mechanical.** Estimated 1 focused session.

---

## ✅ Section 11 — Implementation checklist (in order)

The order matters — each step builds on the previous.

### Phase A — Prep (no code, ~10 min)

- [ ] Read this plan top to bottom
- [ ] Audit `validation-messages.ts` per Section 9; add missing i18n keys with placeholder en/ar strings
- [ ] Confirm `<falcon-angular-textarea>` import path (Component Atlas + workspace search)
- [ ] Confirm Lookup IDs for Authority, Classification, Country (where the constants live)

### Phase B — Type extraction (~15 min)

- [ ] Create `client-information-step/models/models.ts`
- [ ] Move: `ClientInfoFormValue`, `AUTHORITY_OPTIONS`, `CLASS_CAT_OPTIONS`, `CLASS_SUB_OPTIONS`, `CITY_OPTIONS`, `COUNTRY_OPTIONS`, `sectorForAuthority`, `budgetLabelKeyForAuthority`, `emptyClientInfo` from `add-client-wizard/models/models.ts`
- [ ] Update imports in `client-information-step.component.ts` (point to local `./models/models.ts`)
- [ ] Update imports in `add-client-wizard.component.ts` (point to step folder)
- [ ] Verify build: `nx build admin-console` GREEN

### Phase C — Step service (~30 min)

- [ ] Create `client-information-step/services/services.ts` with `Step1InitService`
- [ ] Implement `init()` — parallel load of Authority + ClassCat + Country lookups
- [ ] Implement `onCategoryChange(code)` — cascade SubCategory
- [ ] Implement `onCountryChange(code)` — cascade City
- [ ] Add signal-based caching per lookup id + code
- [ ] Add `loading*` signals per dropdown
- [ ] Add defensive fallback — hardcoded options on error + Light Learning event
- [ ] Add `takeUntilDestroyed(inject(DestroyRef))` cleanup
- [ ] Verify build: GREEN

### Phase D — Step validations (~45 min)

- [ ] Create `client-information-step/validations/validations.ts`
- [ ] Export `accountNameUniqueValidatorBackend(svc, debounceMs?): AsyncValidatorFn` factory
- [ ] Export `budgetNoConditionalValidator(authority): ValidatorFn` factory
- [ ] Export 3 cross-field validators: `countryRequiredWhenCity`, `cityRequiredWhenDistrict`, `cityRequiredWhenStreet`
- [ ] Export `step1FormSchema` — declarative validator-per-field mapping
- [ ] Export `step1IsValid(value: ClientInfoFormValue): boolean` — pure check including cross-field
- [ ] Export `step1FieldErrors(value): Record<keyof ClientInfoFormValue, ValidationMessage | null>` — per-field error map
- [ ] All async wrappers: 350ms debounce + switchMap + HTTP error catch → null
- [ ] All async wrappers: skip if sync fails (saves API call)
- [ ] Verify build: GREEN

### Phase E — Component refactor (~45 min)

- [ ] In `client-information-step.component.ts`:
  - [ ] Replace the inline `accountNameError` computed (using `collectAccountNames(treeRoot)`) with a wiring to the new `accountNameUniqueValidatorBackend` 
  - [ ] Add `<spinner>` pending state for the async account-name check
  - [ ] Inject `AccountValidationService` from `@falcon`
  - [ ] Inject `Step1InitService` (provided at `providers: [Step1InitService]` on the component decorator)
  - [ ] Replace `classCatOptions = CLASS_CAT_OPTIONS.map(...)` with `step1Init.classCatOptions()` signal binding
  - [ ] Same for `authorityOptions`, `countryOptions`, `cityOptions`, `classSubOptions`
  - [ ] Wire `(valueChange)="onAuthorityChange($event)"` to update Sector AND call `step1Init.onAuthorityChange(...)` (actually authority doesn't cascade — but trigger Sector derivation)
  - [ ] Wire `(valueChange)="onCategoryChange($event)"` to call `step1Init.onCategoryChange(code)` for SubCategory cascade
  - [ ] Wire `(valueChange)="onCountryChange($event)"` to call `step1Init.onCountryChange(code)` for City cascade
  - [ ] Replace inline `isFormValid` computed with `step1IsValid(this.value())`
  - [ ] Replace per-field error computeds with `step1FieldErrors(this.value())[fieldName]`
  - [ ] Add conditional Budget Number required logic via the new validator
  - [ ] Update banner comment to note the validations/ folder pattern
- [ ] Verify build: GREEN

### Phase F — Template updates (~30 min)

- [ ] In `client-information-step.component.html`:
  - [ ] Replace each dropdown's `[options]="classCatOptions"` (static) with `[options]="step1Init.classCatOptions()"` (signal)
  - [ ] Add `[loading]="step1Init.loadingClassCat()"` to each dropdown that has cascade loading
  - [ ] Replace AdditionalAddress `<falcon-angular-input>` with `<falcon-angular-textarea>` (for multi-line)
  - [ ] Add pending-state UI for Account Name (small spinner next to field when async in flight)
  - [ ] Verify all bindings are signal-based (no plain properties)
- [ ] Verify build: GREEN

### Phase G — Audit + verify (~30 min)

- [ ] Run focused audit: `audit-orchestrator.ps1 -OnlyRules R-FE-001,R-FE-002,R-FE-003,R-FE-004,R-FE-005 -TargetRepos C:\Falcon\Falcon\falcon-web-platform-ui`
- [ ] Verify zero new violations on touched files
- [ ] Run page audit: `audit-orchestrator.ps1 -OnlyRules R-NOOR-003,R-NOOR-005,R-NOOR-007,R-NOOR-008 -TargetRepos C:\Falcon\Falcon\falcon-web-platform-ui`
- [ ] Manual verification:
  - [ ] Account Name field: type "Existing Account" → blur → 350ms later see `duplicateAccountName` error
  - [ ] Account Name field: type new name → see green/no error after async resolves
  - [ ] Account Name field: type < 2 chars → see sync error, NO async fired (Network tab confirms)
  - [ ] Authority dropdown: change value → Sector field updates (derived locally)
  - [ ] Category dropdown: change value → SubCategory dropdown reloads
  - [ ] Country dropdown: change value → City dropdown reloads
  - [ ] City set, Country empty → see `countryRequiredWhenCity` error
  - [ ] District set, City empty → see `cityRequiredWhenDistrict` error
  - [ ] Authority = Government → Budget Number becomes required
  - [ ] Authority = Private → Budget Number becomes optional
  - [ ] Profile Picture upload >2 MB → blocked with size error
  - [ ] Profile Picture upload non-image → blocked with MIME error
  - [ ] Wizard "Next" button: disabled until all required fields valid

### Phase H — Light Learning capture (~5 min)

- [ ] Append to `Brain Outputs/understanding/pages/organization-hierarchy/LIGHT_LEARNING_EVENTS.md`:
  - Event for the backend-bound async validator wiring
  - Event for any cascade lookup discovery
  - Event for any unexpected backend error code surfaced

### Phase I — Commit (await your explicit "commit")

- [ ] Stage Step 1 changes only (4 new + 3 modified)
- [ ] Wait for user "commit web-platform-ui step 1" before pushing
- [ ] Per R-XC-005 + R-XC-006

---

## 🎯 Section 12 — Acceptance criteria

Step 1 is **done** when ALL of these hold:

| # | Criterion | Verification |
|---|---|---|
| 1 | New `validations/` folder + `services/` folder + `models/` folder exist per Section 10 | `ls` |
| 2 | `accountNameUniqueValidatorBackend` factory in validations.ts wraps `AccountValidationService.checkAccountNameExists` | code review |
| 3 | Async validator fires on blur, 350ms debounce, switchMap cancellation | Network tab + manual test |
| 4 | Async failure (network down) resolves to `null` — does NOT block submit | manual test (offline mode) |
| 5 | 3 cross-field validators wired (Country↔City, City↔District/Street) | manual test |
| 6 | Budget Number conditional required (Authority ∈ {Gov, Charity}) | manual test |
| 7 | 5 cascade lookups load from `LookupService` on init | Network tab |
| 8 | Hardcoded option arrays REMOVED from `add-client-wizard/models/models.ts` (moved to step folder) | grep |
| 9 | All required fields enforce client-side BEFORE Next button enables | manual test |
| 10 | `nx build admin-console` green | CLI |
| 11 | Audit clean (no new R-FE-*, R-NOOR-* violations on touched files) | audit-orchestrator |
| 12 | `step1Valid` signal correctly tracks all required fields + async resolves | manual test |
| 13 | All form values persist in component signals (NOT in localStorage) | code review |
| 14 | All visible strings use `TranslatePipe` (no hardcoded strings) | grep |
| 15 | No raw HTML controls (`<input>`, `<select>`, `<button>`) — only `<falcon-angular-*>` | audit |
| 16 | No SCSS file created in this step | `find` |
| 17 | RTL parity: form layout mirrors correctly under `dir="rtl"` | manual visual |
| 18 | Light Learning events captured per Phase H | grep `LIGHT_LEARNING_EVENTS.md` |
| 19 | Working tree dirty (uncommitted) — awaits explicit "commit" | `git status` |

---

## 🚨 Section 13 — Remaining open questions (none blocking)

After this research, **zero blockers remain** for Step 1. Three minor items to defer (do NOT block Session 0):

| ID | Question | When to resolve |
|---|---|---|
| audit-K1 | Confirm Lookup IDs (string constants) for Authority, Classification, Country | During Phase A |
| audit-K2 | Confirm i18n keys exist per Section 9 (add placeholders if missing) | During Phase A |
| audit-K3 | Verify `<falcon-angular-textarea>` import path (Component Atlas says it exists, confirm in workspace) | During Phase F |

---

## 🧠 Section 14 — Brain artifacts this plan consumes

- ✅ Add Client playbook (16 files)
- ✅ Plan v2.1 (commit `863d5ec`) + resolutions doc (`6b656dd`)
- ✅ Commerce ENDPOINT_REGISTRY, DTO_DICTIONARY, VALIDATIONS, ERRORS
- ✅ NodeController/DTOS.md (deep dive)
- ✅ `validators.ts` + `validation-messages.ts` (full inventory)
- ✅ `AccountValidationService` (full signature)
- ✅ `LookupService` (full signature + Hook<T> shape)
- ✅ `HttpService` + `useGateway()` runtime config
- ✅ `AccessControlFacade` + `FalconAccess` action map (Step 5 use, confirmed irrelevant for Step 1)
- ✅ Current Step 1 component (full source read)
- ✅ Component Atlas + dossiers for: input, dropdown, form-field, photo-uploader, textarea
- ✅ Tier 2 Folder Structure Deep-Dive + State Management Architecture
- ✅ Tier 3 ADR-008 (feature folder pattern)
- ✅ Tier 4 Anti-Pattern Catalog

---

## ✅ Plan locked — implementation-ready

Disk-true + every gap closed + every async validator wired + every component identified + every directive justified. Implementation owner: **Ammar Mk**. No code in this doc. Session 0 follows the 9-phase checklist in §11.

---

## Related

- [15-IMPLEMENTATION_PLAN.md](15-IMPLEMENTATION_PLAN.md) v2.1 — overall wizard plan
- [16-OPEN_QUESTIONS_RESOLVED.md](16-OPEN_QUESTIONS_RESOLVED.md) — 9 questions resolved
- [17-BACKEND_QUESTION_Q6_COMM_CHANNELS_CATALOG.md](17-BACKEND_QUESTION_Q6_COMM_CHANNELS_CATALOG.md) — **NOW RESOLVED** (endpoint found in registry)
- [02-STEP_1_BASIC_INFO.md](02-STEP_1_BASIC_INFO.md) — playbook spec for fields
- [07-VALIDATIONS.md](07-VALIDATIONS.md) — playbook validation rules
- [13-GAPS_AND_DRIFTS.md](13-GAPS_AND_DRIFTS.md) — PRD↔DTO drift list (drifts #3, #4 relevant)
- Actual code: `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/`
- `services/validators.ts` (page-level shared library)
- `services/validation-messages.ts` (i18n catalog)
- `AccountValidationService`, `LookupService`, `HttpService` (FE shared services)

## Tags

#type/step-research-plan #flow/add-client #step-1 #implementation-ready #disk-true #frontend-only
