---
type: contract
cluster: 13-error-catalog
title: Frontend Error-Handling Contract
purpose: "Answers 'what are the 3 standing FE error-handling rules + status → UX mapping + anti-patterns to avoid'. Open before writing any frontend error handler, toast, or inline-error wiring."
extracted: 2026-05-16
---

# Frontend Error-Handling Contract

> [!tldr]
> Three standing rules that every Falcon FE-side error handler MUST observe: **(1) HTTP status is the primary routing signal** · **(2) display `errorMessages[0]` verbatim — it is already localized** · **(3) never parse `FalconKeys.Error.*` codes for user-facing copy** (codes are for logging / telemetry only). Codes that mean something to flow control (re-auth, lockout, OTP countdown) are matched on, never displayed. This contract is repeated in every V-rule's "Frontend implementation hint" and in [BRAIN-OUT] `understanding/backend/commerce/FRONTEND_CONTRACT.md` — it is the single most important cross-cutting rule for any feature implementing validation surfaces.

## 1. The 3 standing rules

### Rule 1 — HTTP status is the primary routing signal

[BRAIN-OUT] `06-validation-by-feature/MATRIX.md` §7: *"Use HTTP status code as the primary routing signal."*

Why: HTTP status is stable, semantic, and language-agnostic. It survives backend code renames, localization changes, and inter-service drift. Error codes carry meaning the FE must NOT depend on for control flow except in narrowly-scoped cases (Pattern 2 + Pattern 3 in [CATALOG.md §5](./CATALOG.md#5-defensive-coding-patterns)).

| Status | FE routing decision |
|---|---|
| 400 | inline field error / step error (validation) |
| 401 | redirect to re-auth |
| 403 | toast (generic) — DO NOT differentiate IP-allowlist from permission per BR-UM-24 |
| 404 | inline "not found" / refresh list |
| 409 | inline field error on the conflicting field (uniqueness) |
| 410 | "session expired" — restart flow |
| 422 | inline / dialog (business rule) |
| 423 | redirect to static lockout screen — no retry button |
| 429 | start countdown timer (OTP) |
| 5xx | toast with retry; preserve form state |

### Rule 2 — Display `errorMessages[0]` verbatim

[BRAIN-OUT] every V-rule's "Frontend implementation hint": *"Display localized `errorMessages[0]` to the user (already localized; do not parse codes)."*

Why: The backend already runs `ErrorLocalizer.Localize(code)` against `Resources/ErrorMessages.{en,ar}.resx`. `app.ValidateErrrosResourceCompleteness()` fails service startup if any code is missing a translation — so [BRAIN-OUT] `understanding/backend/commerce/ERRORS.md` §"Localization" guarantees a message exists for every code. Re-translating client-side risks the FE catalog drifting out of sync with the backend resource files.

```typescript
const message: string = err.error?.errorMessages?.[0] ?? this.t('Generic.Error');
this.toast.error(message);          // verbatim — already localized
```

### Rule 3 — Never parse codes for user-facing copy

[BRAIN-OUT] `12-ERROR_STATES.md` (Add Client): *"Use HTTP status code for routing logic. Use `errorMessages[0]` for display copy. Error codes are for logging / instrumentation only — never branch UI copy on them."*

Why: A backend code rename (`InvalidValue` → `InvalidValueV2`) must not break the FE. Code-keyed copy tables fall out of sync silently. Switch statements on `FalconKeys.Error.*` strings are the single largest source of stale-string drift in the old UI — see §5 anti-patterns.

```typescript
// Anti-pattern (DON'T)
switch (err.error?.errors?.[0]?.code) {
  case 'AccountNameRequired': return 'Please enter account name';   // breaks if code renamed
  case 'AccountNameTooLong':  return 'Max 30 chars';                // already covered by errorMessages[0]
}

// Correct
return err.error?.errorMessages?.[0] ?? this.t('Generic.Error');     // verbatim, localized
```

Codes ARE used for:
- **Logging / telemetry** — `this.telemetry.log({ code, status, endpoint })`
- **Flow control on narrowly-scoped cases** — `code === 'ReservationNotFound'` triggers silent re-quote on Commit; `code === 'OtpStillValid'` starts 60s countdown.
- **Debug overlays in dev mode** — show the raw code to engineers, never to users.

## 2. The `ServiceOperationResult<T>` envelope

[BRAIN-OUT] Every Falcon backend response (success and failure) is wrapped in `ServiceOperationResult<T>`. Shape:

```typescript
interface ServiceOperationResult<T> {
  isSuccess: boolean;                 // true → data populated, false → errors populated
  data: T | null;                     // present on success
  errors: Array<{                     // present on failure
    code: string;                     // FalconKeys.Error.* string — for LOGGING only
    message: string;                  // raw English (use errorMessages[0] instead)
  }>;
  errorMessages: string[];            // ALREADY LOCALIZED — display verbatim
  correlationId?: string;             // X-Correlation-Id echo — for log correlation
}
```

The HTTP layer carries:

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
X-Correlation-Id: 7b3e...
X-Tenant-Id: tenant-001    (Contact-Group + Templates use this header explicitly)

{
  "isSuccess": false,
  "data": null,
  "errors": [{ "code": "InsufficientBalance", "message": "Insufficient balance" }],
  "errorMessages": ["Available balance: SAR 12.50 — required SAR 50.00."],
  "correlationId": "7b3e..."
}
```

[BRAIN-OUT] How errors are raised in the backend (from `commerce/ERRORS.md`):

```csharp
throw new FalconException(FalconKeys.Error.NodeNotFound);                  // single
throw new FalconException(new[] {                                          // multiple
  new Error(FalconKeys.Error.AccountNameRequired),
  new Error(FalconKeys.Error.OwnerIdRequired)
});
```

The middleware reads the `[ErrorHttpStatus]` attribute on the constant via reflection (Commerce-only; other services use a code-suffix switch or default 400). Without the attribute the default is 400.

### Multi-error case (FastEndpoints pre-processor + DataAnnotations)

When multiple `[ThrowIfNotPassed]` / `[Range]` / `[EnumDataType]` violations fire on the same payload, the response carries multiple `errors[]` entries — but `errorMessages` flattens into one localized line per error in array index order. FE should display them either as:
- a stacked list (`<ul>` of `errorMessages`) — recommended for forms with multiple errors per submit
- the first message only — fallback for toast surfaces

```typescript
const messages = err.error?.errorMessages ?? [];
this.toast.error(messages.join('\n'));   // stacked
// OR
this.toast.error(messages[0]);            // first only
```

### Idempotency-as-success exception (Charging)

[BRAIN-OUT] `charging/ERRORS.md` §"Idempotency-as-Success Pattern": `DirectDebitResponse`, `ReserveWalletChargeResponse`, and `UpdateWalletReservationResponse` carry an `AlreadyApplied: bool` field on **success** when the handler detects a duplicate (same `ReferenceType + ReferenceId` seen before). The response is HTTP 200 with `isSuccess: true`, but `AlreadyApplied = true` and the **original** transaction id. **FE must not treat this as an error.** Surface as success with a debug-only "Already applied" indicator if anything.

## 3. HTTP status → UX response mapping

The canonical mapping every feature follows. Cross-cut against [CATALOG.md §1](./CATALOG.md#1-code-grouping-by-http-status).

| Status | UX response | Examples |
|---|---|---|
| **400** Bad Request | **Inline field error** on the offending control. For wizards, the step indicator also marks the offending step. Scroll to first error. | `AccountNameRequired`, `FirstNameLettersOnly`, `MaxLengthExceeded`, `InvalidFileType` |
| **401** Unauthorized | **Trigger re-auth flow.** Preserve form state if possible so user can resume after re-login. | `InvalidCredentials`, `Unauthorized`, `InvalidRefreshToken` |
| **403** Forbidden (general) | **Toast** ("You do not have permission to ..."). Close any open wizard. Do NOT enable a retry button. | `Forbidden`, `UnauthorizedAction`, `UnauthorizedUserToPerformThisAction`, `ForbiddenToShareContactGroup` |
| **403** IP allowlist (BR-UM-24) | **Generic** "Login failed" toast — identical copy to 401. DO NOT differentiate — would defeat enumeration-leak protection. | `IpNotAllowed`, `InvalidIpAddress` |
| **404** Not Found | **Inline "not found"** + refresh list. For Reservation TTL expiry on Commit → silent re-quote (Pattern 2). | `WalletNotFound`, `ContractNotFound`, `ReservationNotFound` |
| **409** Conflict (uniqueness) | **Inline field error** on the conflicting field. Stepper highlights the step. | `DuplicateTenantName` (Step 1 account name), `DuplicateUsername` (Step 5 username), `DuplicateNodeName` |
| **409** Conflict (concurrency) | **Silent retry once.** If still 409, show "Try again" toast. | `WalletVersionConflict` |
| **409** Conflict (state) | **Toast** ("Already in this state — refresh and retry"). | `UserAlreadyInStatus`, `ServiceAlreadyActive`, `UploadSessionAlreadyCompleted` |
| **410** Gone | **"Session expired — restart"** flow restart prompt. | `UploadSessionExpired`, `UserDeletedCannotEdit` |
| **422** Business rule | **Inline field error or dialog** (depending on cardinality). Wizard stepper marks affected step. | `InvalidAccountLimits`, `PriceValueNotConfigured`, `ContractEditOnlyAllowedWhenPending`, `InsufficientBalance` (with Top-up CTA), `NoApplicableRate` (non-actionable copy) |
| **422** Password policy | **Strength meter checklist** highlights failing class. Cross-field `passwordsMatch` validator catches Confirm mismatch client-side. | `PasswordTooShort`, `PasswordRequiresUppercase`, `PasswordsDoNotMatch`, `ChangePasswordFailed` |
| **422** OTP | **Inline + counter** if backend response carries one. Resend disabled on `OtpResendLimitExceeded` → redirect to lockout screen. | `InvalidVerificationCode`, `OtpResendLimitExceeded`, `OtpNotReady` |
| **423** Locked | **Static "Account locked" full-screen.** No retry button. No "try again" CTA. Reset only via admin status flip (BR-UM-08). | `UserLocked` (post-3-wrong-passwords) |
| **429** OTP throttle | **Disable Resend + start 60s countdown.** | `OtpStillValid` |
| **500–504** Server error | **Toast + retry button.** Preserve form state. For partial-failure of Add Client Step 5 (Account created but Identity hop failed): documented partial-failure UX. | `InternalServerError`, `ExternalServiceError`, `CreateIdentityUserFailed`, `IdentityServiceTimeout`, all `Zitadel*Failed` |

### Wizard stepper integration

When the offending code maps to a specific wizard step, the stepper component must mark that step as **error state** (per [BRAIN-OUT] `12-ERROR_STATES.md` §"Banner UX rule"). The mapping for Add Client:

| Step | Codes routing here |
|---|---|
| Step 1 (Basic Info) | `AccountNameRequired`, `AccountNameTooLong`, `DuplicateTenantName`, `DuplicateNodeName`, `OfficialDataRequired`, `FinanceIdRequired`, `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided`, `InvalidAuthorityLetterType`, `BudgetNoRequired`, all image-uploader 400s |
| Step 2 (Settings) | `MainAccountSettingsRequired`, `InvalidAccountLimits`, `InvalidNodeLevel`, `InvalidValue`, `InvalidIpAddress` |
| Steps 3 + 4 (CommChannels / Apps) | `PriceValueNotConfigured`, `PricingTypeNotConfigured`, `HiddenProductMustNotHavePricing`, `InvalidPriceValue`, `InvalidPriceType`, `PriceValueRequired` |
| Step 5 (Account Owner) | `RequiredFieldMissing`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `UsernameMustStartWithLetter`, `InvalidPhoneNumber`, `DuplicateUsername` |
| Cross-cutting (toast) | `Forbidden`, `Unauthorized`, all 500-class Identity/Zitadel failures, generic 5xx network errors |

## 4. Per-feature UX overrides

Not every feature shares the canonical mapping. Six overrides documented across the V-rule notes + feature compare notes.

### 4.1 — Login lockout uses a **full-screen static page**, not a toast

[BRAIN-OUT] V-login-lockout-3-wrong-attempts: *"On 423 `UserLocked` response: navigate to a static 'Account locked — contact your administrator' screen. DO NOT auto-redirect to retry; DO NOT show a 'Try again' button."*

The lockout is terminal until an admin flips status (BR-UM-08). FE must not encourage retry attempts — that's the entire point of the lockout. Same UI for `OtpResendLimitExceeded` (422) — reuses the same full-screen lockout per the V-rule's "Suggested validator wiring".

### 4.2 — Forgot-Password OTP is **silent** on wrong code

[BRAIN-OUT] V-login-lockout-3-wrong-attempts §"Forgot-Password divergence": *"BR-UM-32 explicitly says the Forgot Password OTP path stays silent — wrong OTP does NOT lock the account."*

UX:
- **Login OTP screen** → backend response may carry a counter; FE shows "Attempt 2 of 3" if present.
- **Forgot Password OTP screen** → backend never carries a counter; FE must NOT show "attempts remaining". Same screen geometry as Login OTP, but no counter element rendered.

### 4.3 — IP-allowlist failure must look like credential failure

[BRAIN-OUT] V-account-ip-allowlist-enforcement + BR-UM-24: *"Show generic 'Login failed' message on 403 `IpNotAllowed` — DO NOT differentiate from `InvalidCredentials`."*

The point of the IP check running before credentials is to avoid leaking whether the username exists. The FE differentiating "IP blocked" from "wrong password" defeats the protection. Use identical localized copy for both — typically `t('Generic.LoginFailed')`.

### 4.4 — `NoApplicableRate` shows **non-actionable** copy, no retry

[BRAIN-OUT] V-charging-no-applicable-rate: *"Show a user-friendly 'Service not configured' message and surface it to ops."*

The 422 is a contract-configuration gap, not a user-fixable error. UX:
- **No retry button** — pressing retry would yield the same 422.
- **Non-actionable copy** — display message verbatim from `errorMessages[0]` ("Service not configured" or similar).
- **Ops breadcrumb** — log the failing tuple (`ApplicationId × ChannelId × Priority × Destination`) with correlation id so support can fix the matrix.
- **No "Contact support" CTA** — that's noise; the breadcrumb in support's logs is enough.

### 4.5 — `InsufficientBalance` includes a deep-link to Transfer Balance dialog

[BRAIN-OUT] V-charging-insufficient-balance: *"Treat any `InsufficientBalance` 422 from Reserve/Commit/Direct-Debit as the final answer — show the localized message from the response body and offer a 'Top up' link to the transfer dialog."*

UX:
- **Dialog (not toast)** because user needs to acknowledge + act.
- **Body** shows `errorMessages[0]` (typically "Available SAR X / Required SAR Y").
- **Primary CTA** "Top up balance" → opens Transfer Balance dialog with the deficit pre-filled as the Amount.
- **Secondary CTA** "Cancel" closes both dialogs.

### 4.6 — Payment polling has a **30-minute hard upper bound**

[INFERRED] from the reservation TTL (300s) + UX guidance in V-charging-insufficient-balance that the FE handles `ReservationNotFound` as expiry. If a Do-Payment flow includes a status-poll loop (Reserve → poll for Kafka-driven commit), the FE must give up after 30 minutes — 6× the reservation TTL — and show a "Payment could not be confirmed — contact support" dialog. **Verify this duration against actual product spec; the 30-minute number is a conservative inference.**

### 4.7 — Add Client Step 5 partial-failure UX

[BRAIN-OUT] `Add Client/12-ERROR_STATES.md`: *"Account may have been created server-side before the Identity hop failed — surface a clear partial-failure UX."*

`CreateIdentityUserFailed` / `GetIdentityUserFailed` / `ExternalServiceError` (500) on Step 5 means:
- The Account already exists in Commerce (and Zitadel tenant created).
- The Account Owner user record failed to create in Identity.
- **Wizard state must be preserved** — operator should be able to retry Step 5 user creation alone.
- Toast: *"Account created but Account Owner creation failed — contact support"*.
- The retry endpoint may differ from the original (re-trigger Identity user creation for an existing Account). Documented as a gap pending a dedicated retry endpoint.

## 5. Anti-patterns

[BRAIN-OUT] Patterns observed in the **old UI** ([BRAIN-OUT] memory: `project_old_ui_dataset_2026_05_16.md` — code-grounded extraction from `origin/main` of falcon-web-platform-ui). Each anti-pattern below is a recurring sin from old code that the new build must not inherit.

### Anti-pattern 1 — `switch` statements on error codes for display copy

```typescript
// FOUND in old UI — DO NOT REPLICATE
private getErrorMessage(code: string): string {
  switch (code) {
    case 'AccountNameRequired':   return 'Account name is required';
    case 'AccountNameTooLong':    return 'Account name must be ≤30 characters';
    case 'DuplicateTenantName':   return 'This name is already in use';
    case 'FirstNameLettersOnly':  return 'First name must contain letters only';
    // ... 80 more cases ...
    default:                      return 'An error occurred';
  }
}
```

**Why bad:**
- Duplicates the backend's `Resources/ErrorMessages.{en,ar}.resx` files — guaranteed to drift.
- English-only — breaks Arabic locale.
- Silent default ("An error occurred") buries new codes.
- Adds a coupled FE-BE deployment dependency for every new error code.

**Correct:** `err.error?.errorMessages?.[0]` — already localized by the backend.

### Anti-pattern 2 — Hard-coded English fallback

```typescript
// FOUND in old UI — DO NOT REPLICATE
catchError((err) => {
  this.toast.error('Something went wrong. Please try again.');     // English-only, untranslated
  return EMPTY;
});
```

**Why bad:** Bypasses the localized error message that the backend already provided. Breaks Arabic locale silently. Reader has no idea what went wrong.

**Correct:**
```typescript
catchError((err) => {
  const msg = err.error?.errorMessages?.[0] ?? this.t('Generic.Error');   // i18n key as last resort
  this.toast.error(msg);
  return EMPTY;
});
```

### Anti-pattern 3 — Silent `return of([])` after error

```typescript
// FOUND in old UI — DO NOT REPLICATE
this.api.getThings().pipe(
  catchError((err) => {
    console.log('error fetching things', err);
    return of([]);                                                  // user sees empty list, no error feedback
  })
).subscribe(things => this.things.set(things));
```

**Why bad:** User sees an empty state and assumes "no data" when actually a 5xx fired. No recovery path. No correlation id surfaced.

**Correct:** Use `catchError` to log telemetry, surface the localized message, and let the parent component handle the empty/error state distinctly:
```typescript
this.api.getThings().pipe(
  catchError((err) => {
    this.telemetry.log(err.error?.errors?.[0]?.code, err.status);
    this.errorState.set(err.error?.errorMessages?.[0] ?? this.t('Generic.Error'));
    return EMPTY;                                                   // signal: don't update list
  })
).subscribe(things => { this.things.set(things); this.errorState.set(null); });
```

### Anti-pattern 4 — Native `alert()` calls

```typescript
// FOUND in old UI — DO NOT REPLICATE
catchError((err) => {
  alert('Login failed');                                            // browser-native blocking alert
  return EMPTY;
});
```

**Why bad:** Browser-native modal, blocks the entire page, not styleable, not localized, not accessible. Disrupts SPA UX.

**Correct:** Use Falcon Notification / Falcon Dialog / Falcon Toast components consistently with the rest of the app.

### Anti-pattern 5 — Mixing codes and statuses for the same routing decision

```typescript
// FOUND in old UI — DO NOT REPLICATE
if (err.status === 401 || err.error?.errors?.[0]?.code === 'Unauthorized') {
  this.auth.relogin();
}
if (err.status === 423 || err.error?.errors?.[0]?.code === 'UserLocked') {
  this.router.go('/locked');
}
```

**Why bad:** Two truth sources for the same branch. When backend updates the code spelling (`Unauthorized` → `NotAuthorized`), the OR-branch saves the FE silently — masking the drift. Code drifts go undetected until the OR-clause is removed.

**Correct:** Status only.
```typescript
if (err.status === 401) { this.auth.relogin(); }
if (err.status === 423) { this.router.go('/locked'); }
```

### Anti-pattern 6 — Differentiating IP-allowlist 403 from credentials 401

```typescript
// FOUND in old UI — VIOLATES BR-UM-24
if (err.error?.errors?.[0]?.code === 'IpNotAllowed') {
  this.toast.error('Your IP is not allowed for this account');     // leaks: account exists
} else if (err.status === 401) {
  this.toast.error('Wrong username or password');                  // leaks: account exists OR not
}
```

**Why bad:** Telegraphs that the username exists (because the IP rule wouldn't fire on an unknown username). Defeats the entire purpose of running the IP gate before credentials.

**Correct:** Same generic copy for both.
```typescript
if (err.status === 401 || err.status === 403) {
  this.toast.error(this.t('Generic.LoginFailed'));                 // identical for both
}
```

## 6. Quick-reference checklist for any new FE error handler

Before merging a PR that adds error handling, verify:

- [ ] **Routing on HTTP status** — `err.status`, never `err.error?.errors?.[0]?.code` for branching UI copy.
- [ ] **Display `errorMessages[0]`** — verbatim, with one i18n-key fallback if the array is empty.
- [ ] **Code logged, not displayed** — `this.telemetry.log({ code, status })` only.
- [ ] **Correlation id captured** — `err.error?.correlationId` or `err.headers?.get('X-Correlation-Id')` for support requests.
- [ ] **Form state preserved** — on 5xx, do NOT clear the form. User can retry without re-typing.
- [ ] **Re-auth path on 401** — preserve attempted navigation target for post-login redirect.
- [ ] **Lockout terminal** — 423 / `OtpResendLimitExceeded` route to static page, no retry.
- [ ] **OTP throttle (429)** — countdown timer disables Resend button.
- [ ] **IP-allowlist = credentials** — identical localized copy, no differentiation.
- [ ] **Charging cascade** — `InsufficientBalance` shows Top-up CTA; `NoApplicableRate` shows non-actionable copy + ops breadcrumb; `ReservationNotFound` triggers silent re-quote.
- [ ] **Wizard stepper marked** — for codes that route to a specific step, the stepper component visually shows the step in error state.
- [ ] **Idempotency-as-success** — Charging `AlreadyApplied = true` is NOT treated as an error.

## 7. Cross-references

- [`CATALOG.md`](./CATALOG.md) — full error-code catalog (130 codes by status / service / feature / V-rule)
- [`_INDEX.md`](./_INDEX.md) — cluster entry MOC
- [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) — V-rule × feature matrix; §7 carries the FE-contract recap
- [BRAIN-OUT] `understanding/backend/commerce/FRONTEND_CONTRACT.md` — original FE contract (referenced by every V-rule note)
- [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/12-ERROR_STATES.md` — Add Client UX mapping (golden worked example)
- [BRAIN-OUT] `understanding/backend/<service>/ERRORS.md` (one per service) — source catalogs
- [BRAIN-OUT] `Brain SK/_obsidian/30-Validation/V-*.md` — 25 V-rule notes (each carries a "Frontend implementation hint" that mirrors this contract)
- [BRAIN-OUT] memory: `project_old_ui_dataset_2026_05_16.md` — old UI code-grounded dataset (source for the anti-pattern citations)
- [`../04-feature-parity-matrix/*.compare.md`](../04-feature-parity-matrix/) — per-feature compare notes (each lists per-feature UX overrides)
