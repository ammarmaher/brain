# falcon-otp — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` `falcon-otp.tsx:1-3` — The control through which a user proves they hold a side-channel (email inbox / SMS-reachable phone). It is the data-entry surface for **identity verification**: the operator/user transcribes a one-time passcode that the platform sent out-of-band. In business terms it is the second factor — possession — in any flow that needs more than a password.

## What it CAN do (business capability)
- `[CODE]` `falcon-otp.tsx:46,56` Capture an N-digit code (default 6) restricted to a character class (`pattern` default `[0-9]`) — so an alphanumeric short-code or a numeric OTP both work.
- `[CODE]` `falcon-otp.tsx:140-149` Edge-trigger a **completion event** (`falcon-complete`) the instant the last box fills — letting a flow auto-submit verification without a button press.
- `[CODE]` `falcon-otp.tsx:255-281` Accept a **paste-fill**: a user copying a 6-digit code from an SMS/email pastes it once and every box fills.
- `[CODE]` `falcon-otp.tsx:339,341` Mask the digits (`mask`, renders `type="password"`) and advertise `autocomplete="one-time-code"` on the first box — enabling OS-level SMS auto-fill (iOS/Android).
- `[CODE]` `falcon-otp.tsx:49,368-372` Surface an error message (`errorMessage`) with `role="alert"` — the channel through which a flow says "that code was wrong."

## What it CANNOT do (business limits — do not assume otherwise)
- `[CODE]` `falcon-otp.tsx:1-3` + `OVERVIEW.md` **It does not verify the code.** It collects digits and reports `complete`; whether the code is *correct* is decided by the backend. A builder must round-trip the value to Identity.
- `[CODE]` `falcon-otp.tsx:236-240` It deliberately suppresses Enter — the field never submits a form on its own. Submission is the flow's decision.
- `[INFERRED]` It owns no timer, no resend, no expiry countdown. "Code expired in 60s" / "Resend code" are flow concerns — `<falcon-otp-send-dialog>` adds resend; bare `<falcon-otp>` has neither.
- `[INFERRED]` It has no rate-limit awareness — repeated wrong attempts are the backend's lockout concern, not the component's.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| OTP step in login | `[CODE]` `enter-otp.component.html` consumer + `otp.service.ts:16-23` | The login flow renders this; the value is POSTed to `auth/verify-otp`. |
| Forgot-password OTP verification | `[CODE]` `forgot-password-flow.service.ts:34-41` | Recovery flow verifies the entered code before allowing a new password. |
| First-login / 2FA possession factor | `[BRAIN-OUT]` auth playbooks | OTP entry gates the transition from "credentials accepted" to "session granted." |
| Wrong-code feedback | `[CODE]` `falcon-otp.tsx:49,114-115` | A failed verification sets `state='error'` + `errorMessage` — the user sees the rejection on the boxes. |

## Business constraints baked in
- `[CODE]` `falcon-otp.tsx:46` Default length 6 — matches the platform's 6-digit OTP standard. Changing it must match the backend's issued length or verification always fails.
- `[CODE]` `falcon-otp.tsx:56` Numeric-only by default — OTPs are digits; alphanumeric is the exception, set explicitly via `pattern`.
- `[CODE]` `falcon-otp.tsx:341` SMS auto-fill is wired by design (`autocomplete="one-time-code"`) — a deliberate UX-trust decision so users are not forced to retype.
- `[INFERRED]` Masking is OFF by default — an OTP is low-sensitivity and transient; masking (`mask=true`) is reserved for true PINs.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Login OTP | host-shell `enter-otp` | The possession-factor entry after password. |
| Forgot-password | host-shell `forgot-password-flow` | Verifies the recovery code before set-password. |
| OTP send dialog | composed inside `<falcon-otp-send-dialog>` step 2 | The code-entry surface of the two-step verify dialog. |
| Account-owner / step-up verify | Add Client wizard (via the send dialog) | Confirms the account owner controls the contact channel. |

## Business gotchas
- `complete=true` means "all boxes filled," **not** "code is valid" — never grant access on completion alone; wait for the backend verdict.
- A correct length is a hard contract with the backend — a `length` mismatch is a silent business failure (the user can never produce a verifiable code).
- The component has no expiry/resend — if the design shows a countdown or "Resend", that logic belongs to the flow (or use `<falcon-otp-send-dialog>`).

## Verification
🟡 CODE-DERIVED from `falcon-otp.tsx` + `otp.service.ts` + `forgot-password-flow.service.ts`. Login/forgot-password usage ✅ VERIFIED (auth flows are live consumers per Wave-7 sweep). Correction vs `API.md`: the Stencil component **does** emit a dedicated `falcon-complete` event (`falcon-otp.tsx:67-68,145-147`) — the GAP "no completion event" is stale at the Stencil layer (wrapper re-emission is the open item).
