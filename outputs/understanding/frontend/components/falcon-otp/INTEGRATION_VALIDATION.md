# falcon-otp — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
- **Identity** (`falcon-core-identity-svc`) — owns OTP issuance, verification, expiry, and resend. The component is presentational; it makes **no HTTP calls** itself. Identity decides whether a transcribed code is valid.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `auth/verify-otp` | POST | Identity | `{ sessionId, code }` / `ServiceOperationResult<LoginStepResult>` | host-shell auth host | `[CODE]` `otp.service.ts:16-23` — `checkOtp` maps screen-level `otp` → backend `code`. |
| `auth/resend-otp` | POST | Identity | `{ sessionId }` / `ServiceOperationResult<LoginStepResult>` | host-shell auth host | `[CODE]` `otp.service.ts:28-34` — re-issues a code for the same session. |
| `auth/forgot-password` | POST | Identity | `{ username, phoneNumber, deliveryMethod }` / `ServiceOperationResult<LoginStepResult>` | host-shell auth host | `[CODE]` `forgot-password-flow.service.ts:20-28` — issues the recovery OTP that this component then captures. |

The component binds **nothing**. The owning flow (`OtpService` / `ForgotPasswordFlowService`) takes the emitted `value` (the full code string) and POSTs it as `code`.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Per-box character class | each digit box | a typed char fails `compilePattern(pattern)` | `[CODE]` `falcon-otp.tsx:164-168` — char rejected, box restored. Client-side, silent. |
| Completeness | the code | not all `length` boxes filled | `[CODE]` `falcon-otp.tsx:141-143` — `complete=false`; consumer gates the Verify button on it. |
| Code correctness | the code | backend rejects the value | `[CODE]` Identity `auth/verify-otp` returns `isSuccessful:false` / a `Failed` stage; the flow sets `[errorMessage]` + `[state]="'error'"` on the component. |
| Required | the code | empty submit (Reactive Forms) | `[INFERRED]` consumer adds `Validators.required` + `Validators.minLength(length)`. |

## PES keys gating this component
- `[INFERRED]` None. OTP entry is part of the unauthenticated auth flow — there is no authenticated session yet, so no PES evaluation applies.

## State / signal pattern
- `[CODE]` `falcon-otp.tsx:59-79` Stencil-internal `@State`: `boxes: string[]`, `focusedIndex`, `resolvedId`; a private `wasComplete` flag drives edge-triggered completion.
- `[CODE]` `falcon-otp.tsx:81-96` `@Watch('value')` re-syncs boxes only when the external value diverges (`boxesToValue` comparison) — avoids render thrash from the CVA echo.
- `[CODE]` `falcon-otp.tsx:140-149` `emitChange` fires `falcon-change` every keystroke and `falcon-complete` ONCE on the false→true transition.
- `[CODE]` `falcon-otp.tsx:99-112` `@Method` `setFocus(index)` / `clear()` exist on the Stencil element. `[CODE]` `API.md` notes the Angular wrapper does not proxy them — to call `clear()` a consumer reaches the native element.
- Error pipeline: a backend rejection flows back as `isSuccessful:false` → flow component sets `errorMessage` → boxes show `role="alert"` error text.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-otp>` (Shadow, `falcon-otp.tsx`) / `<falcon-otp-tw>` (Light DOM). Owns box layout, auto-advance, backspace-retreat, paste-fill, Arrow/Home/End nav, mask, SMS-autofill attribute.
- **Angular wrapper** — `<falcon-angular-otp>`: CVA over the code string. `[CODE]` `API.md` — forwards only `value`; the Stencil `falcon-complete` / `falcon-blur` are NOT surfaced as wrapper outputs (open GAP).
- Per `feedback_library_skeleton_app_api` — the library never verifies; the flow service owns the `auth/verify-otp` call.

## Integration gotchas
- `[CODE]` `falcon-otp.tsx:236-240` Enter is swallowed — a consumer cannot rely on Enter-to-submit; wire submit to the `complete` signal or a button.
- `[CODE]` `falcon-otp.tsx:159-162` Multi-char arrival (>1 char in one box) is treated as paste-fill — autofill and IME both route through this path.
- `[CODE]` `falcon-otp.tsx:84-88` `@Watch('value')` only re-syncs on real divergence — pushing the *same* value via CVA is a no-op (intended).
- `[INFERRED]` `length` MUST equal the backend-issued code length, or verification can never succeed — this is a cross-module contract, not a UI tweak.
- `[CODE]` `falcon-otp.tsx:341` SMS auto-fill is already wired (`autocomplete="one-time-code"`) — `GAPS_AND_UPGRADES.md` G4 ("verify SMS auto-fill") is satisfiable directly from source: it is present.

## Verification
🟢 code-verified (re-read 2026-06-03) from `falcon-otp.tsx` + `falcon-otp-tw.tsx` + `falcon-otp.component.ts` (+ auth `otp.service.ts` / `forgot-password-flow.service.ts`). Endpoints ✅ VERIFIED against the live auth services. `autocomplete="one-time-code"` present on box 0 (G4 resolved). `@Watch('value')` divergence-only re-sync, edge-triggered complete, un-proxied `setFocus()`/`clear()`, wrapper drops the `complete` flag (G1) ✅ source-verified. Live consumer path corrected: the OTP dialog now lives at `libs/falcon/src/shared-ui/lib/components/otp-dialog/` (moved out of host-shell).
