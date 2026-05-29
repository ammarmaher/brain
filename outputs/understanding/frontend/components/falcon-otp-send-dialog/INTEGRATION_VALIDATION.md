# falcon-otp-send-dialog — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
- **Identity** (`falcon-core-identity-svc`) — owns OTP issuance, delivery (email/SMS), verification, resend, expiry. The dialog is a presentational orchestrator; it makes **no HTTP calls** itself. Every backend interaction is performed by the *flow* that hosts the dialog, in response to the dialog's emitted intents.

## Backend wiring
The dialog binds nothing directly. Its events map onto Identity endpoints as follows:

| Dialog event | Flow action → Endpoint | Method | Backend module | DTO (req / resp) | Notes |
|---|---|---|---|---|---|
| `falcon-send` | request OTP delivery → `auth/forgot-password` (recovery) or session OTP issuance | POST | Identity | `{ username, phoneNumber, deliveryMethod }` / `ServiceOperationResult<LoginStepResult>` | `[CODE]` `forgot-password-flow.service.ts:20-28` — `deliveryMethod` mirrors the chosen channel. |
| `falcon-verify` | verify the code → `auth/verify-otp` | POST | Identity | `{ sessionId, code }` / `ServiceOperationResult<LoginStepResult>` | `[CODE]` `otp.service.ts:16-23` — payload `code` = the dialog's `FalconOtpSendDialogVerifyDetail.code`. |
| `falcon-resend` | re-issue the code → `auth/resend-otp` | POST | Identity | `{ sessionId }` / `ServiceOperationResult<LoginStepResult>` | `[CODE]` `otp.service.ts:28-34`. |
| `falcon-cancel` | abort the ceremony — no backend call | — | — | — | `[CODE]` `falcon-otp-send-dialog.tsx:177-181` — sets `open=false`. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Allowed channel | channel radios | `mode` excludes a channel | `[CODE]` `.utils.ts:9-19` — disallowed radios simply do not render; not a runtime error. |
| OTP completeness | the code (step 2) | not all `otpLength` boxes filled | `[CODE]` `falcon-otp-send-dialog.tsx:162,318` — Verify button disabled while `!otpComplete`. |
| Code correctness | the code | Identity rejects `auth/verify-otp` | `[CODE]` `auth/verify-otp` returns `isSuccessful:false` / `Failed` stage → flow calls `markVerificationError(msg)` (`falcon-otp-send-dialog.tsx:121-124`). |
| Contact validity | `email` / `phone` inputs | — | NOT validated by the dialog — the flow vouches for them. |

## PES keys gating this component
- `[INFERRED]` None for the auth-flow usage (no session yet). For the Add Client account-owner verify, the *parent step* is PES-gated, not the dialog — the dialog opens only if the step is permitted.

## State / signal pattern
- `[CODE]` `falcon-otp-send-dialog.tsx:64-70` Stencil `@State`: `selectedChannel`, `otpValue`, `otpComplete`, `internalError`, `resolvedId`.
- `[CODE]` `falcon-otp-send-dialog.tsx:46,54` `open` and `step` are `mutable, reflect` props — two-way bindable from the flow.
- `[CODE]` `falcon-otp-send-dialog.tsx:94-103` `@Watch('open')` resets to step 1 on close; `@Watch('mode')` re-resolves channel; `@Watch('errorMessage')` mirrors an external error onto `internalError`.
- `[CODE]` `falcon-otp-send-dialog.tsx:190-196` `handleOtpChange` clears `internalError` once the user types again — stale-error hygiene.
- `[CODE]` `falcon-otp-send-dialog.component.ts:74-85` **Wrapper double-emit fix** — the Angular wrapper calls `event.stopPropagation()` on `falcon-send` so the bubbled native CustomEvent does not fire the consumer's binding twice.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-otp-send-dialog>` (Shadow, `.tsx`) / `<falcon-otp-send-dialog-tw>` (Light DOM). A **composer**: it embeds `<falcon-dialog>` (shell), `<falcon-radio>` (channel rows), `<falcon-otp>` (code entry), `<falcon-button>` — never re-implements their internals (`.tsx:1-6`).
- **Angular wrapper** — `<falcon-angular-otp-send-dialog>`: NOT a CVA (it is an orchestrator, not a value control). Re-emits the five Stencil events as `@Output`s + `openChange`/`stepChange` two-way pairs.
- Per `feedback_library_skeleton_app_api` — the library composes UI only; the flow owns all Identity calls.

## Integration gotchas
- `[CODE]` `falcon-otp-send-dialog.types.ts:10` **`step` is `'channel' | 'code'`** — `API.md` incorrectly documents `'channel' | 'verify'`. Bind `'code'`, not `'verify'`.
- `[CODE]` `falcon-otp-send-dialog.component.ts:74-85` Only `falcon-send` is explicitly stop-propagated in the wrapper; verify/resend/channel-change handlers exist but the documented double-emit fix comment covers all — bind via the `@Output`s, not a host listener, to avoid double-fire.
- `[CODE]` `falcon-otp-send-dialog.tsx:183-188` The inner `<falcon-dialog>` close is mirrored to `open=false` + `falcon-cancel` — handle cancel idempotently.
- `[CODE]` `falcon-otp-send-dialog.tsx:94-103` Closing resets state — do not rely on the dialog retaining a partially entered code across open/close.
- `[INFERRED]` `otpLength` must match the Identity-issued code length, exactly as for bare `<falcon-otp>`.

## Verification
🟡 CODE-DERIVED from `falcon-otp-send-dialog.{tsx,types.ts,utils.ts,component.ts}` + auth OTP services. Correction vs `API.md`: `step` enum is `'channel' | 'code'` (`falcon-otp-send-dialog.types.ts:10`), not `'channel' | 'verify'`. Endpoint mapping 🟡 CODE-DERIVED from `otp.service.ts` / `forgot-password-flow.service.ts` (the dialog is not itself a consumer of those services in the inspected code).
