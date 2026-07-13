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
- `[CODE]` `falcon-otp-send-dialog.component.ts:81-85` **Wrapper double-emit fix is PARTIAL** — `handleSend()` calls `event.stopPropagation()` so the bubbled `falcon-send` CustomEvent does not fire a host listener twice. BUT `handleVerify()` / `handleResend()` / `handleChannelChange()` do NOT call `stopPropagation()` (ts:87-106), and the inner Stencil events all dispatch `bubbles:true, composed:true`. So those three would still double-fire on a host-element listener (the comment at ts:74-80 says "Mirrored for verify/resend/channel-change" but the code only guards `falcon-send`). Bind via the `@Output`s, never a host listener.

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
- `[CODE]` **Shadow↔`-tw` channel-change parity divergence.** The Shadow path wires BOTH a `<div onClick={handleOptionClick}>` AND an `onFalcon-change={handleChannelChange(channel)}` on each `<falcon-radio>` (`falcon-otp-send-dialog.tsx:223,251`) — so a direct radio click can fire `falcon-channel-change` via the radio event in addition to the div-click path (potential double channel-change emit on Shadow). The `-tw` twin wires ONLY the `<div onClick>` — its `<falcon-radio-tw>` has NO `onFalcon-change` (`falcon-otp-send-dialog-tw.tsx:242-248`). The Shadow `handleChannelChange` method exists (tsx:135-143) but is dead code on the `-tw` path. Net: clicking a radio directly behaves slightly differently between paths. Prefer the default `-tw`.
- `[CODE]` **`stepChange` is never emitted by the wrapper** — there is no handler that calls `this.stepChange.emit(...)` (`falcon-otp-send-dialog.component.ts`). So `[(step)]` two-way write-back from the dialog's own transitions does NOT propagate to the host; drive `step` one-way from the flow.
- `[CODE]` **`-tw` step-enter animation likely no-ops** — the `@keyframes falconOtpSendDialogStepIn` is defined only in the Shadow `falcon-otp-send-dialog.css` (`shadow:true`, encapsulated); the light-DOM `-tw` twin references the same name but has no matching global keyframe (TOKENS.md). Cosmetic only.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07) against `falcon-otp-send-dialog.tsx` (366 ln), `-tw.tsx` (362 ln), `.types.ts`, `.utils.ts`, `.component.ts` (107 ln). `step` enum `'channel'|'code'` (not `'verify'`, types.ts:10) folded into API.md. NEW findings this pass: the double-emit fix is PARTIAL (only `falcon-send` stop-propagated), `stepChange` is never emitted (one-way `step`), the Shadow↔`-tw` channel-change wiring diverges, and the `-tw` step-enter keyframe likely no-ops. Endpoint mapping remains 🟡 CODE-DERIVED from `otp.service.ts`/`forgot-password-flow.service.ts` (the dialog itself makes no HTTP call).
