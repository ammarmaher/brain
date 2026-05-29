# falcon-otp-send-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` `falcon-otp-send-dialog.tsx:1-6` — A self-contained **verify-identity ceremony**: it walks a user through *choosing a delivery channel* → *receiving a code* → *transcribing it*. In business terms it is the packaged step-up-authentication interaction — the modal a flow opens when it needs the user to prove control of a contact channel before proceeding (account-owner verification, sensitive action confirmation, login second factor).

## What it CAN do (business capability)
- `[CODE]` `falcon-otp-send-dialog.tsx:198-283` Present **step 1 — channel choice**: radio rows for Email / SMS / Both, each showing where the code will go (`channelSubText` resolves the actual email/phone). `[CODE]` `.utils.ts:43-57`
- `[CODE]` `falcon-otp-send-dialog.tsx:49,88-92` + `.utils.ts:9-29` Enforce a business-permitted channel set via `mode` — `'email-only'`, `'sms-only'`, or `'both-allowed'` — and re-resolve the selection if `mode` tightens.
- `[CODE]` `falcon-otp-send-dialog.tsx:286-344` Present **step 2 — code entry**: composes `<falcon-otp>`, a Verify button gated on completeness, a Resend link, and a target-confirmation line ("We sent a 6-digit code to …").
- `[CODE]` `falcon-otp-send-dialog.tsx:72-81,152-181` Emit five business intents — `falcon-send`, `falcon-verify`, `falcon-resend`, `falcon-channel-change`, `falcon-cancel` — the touch-points a flow listens to.
- `[CODE]` `falcon-otp-send-dialog.tsx:111-133` Expose programmatic control — `advanceToCodeStep()`, `markVerificationError(msg)`, `resetToChannelStep()` — so the flow drives the ceremony based on backend results.

## What it CANNOT do (business limits — do not assume otherwise)
- `[CODE]` `falcon-otp-send-dialog.tsx:152-159` **It does not send the OTP.** `falcon-send` is an *intent* — the flow must call Identity to actually deliver the code.
- `[CODE]` `falcon-otp-send-dialog.tsx:161-167` **It does not verify the code.** `falcon-verify` hands the code to the flow; correctness is the backend's verdict, painted back via `markVerificationError`.
- `[CODE]` `API.md` It does not validate the `email` / `phone` it is given — those are inputs the flow supplies and vouches for.
- `[INFERRED]` It has no resend cooldown, no expiry countdown, no attempt-limit — `falcon-resend` fires every click; throttling is the flow/backend's job.
- `[CODE]` `falcon-otp-send-dialog.tsx:54` It does not own the step transition's *trigger* — `step` is two-way bindable; the flow flips `channel`→`code` after a successful send.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Channel must be one the tenant permits | `[CODE]` `.utils.ts:9-19` `allowedChannels` | `mode` restricts which radios render — a tenant configured email-only never sees SMS. |
| Identity verification before sensitive action | `[BRAIN-OUT]` Add Client account-owner verify (`OVERVIEW.md` consumers) | The dialog is the gate between "owner contact entered" and "owner contact confirmed." |
| OTP delivery + verification | `[CODE]` `auth/verify-otp` / `auth/resend-otp` (`otp.service.ts`) | `falcon-send`/`falcon-verify`/`falcon-resend` map to Identity OTP issuance + verification. |
| Wrong-code feedback | `[CODE]` `falcon-otp-send-dialog.tsx:121-124,190-196` | `markVerificationError` paints the rejection; typing again clears it (`:194-195`). |

## Business constraints baked in
- `[CODE]` `falcon-otp-send-dialog.tsx:49` Default `mode='both-allowed'` — the most permissive; a flow should tighten it to match tenant policy.
- `[CODE]` `falcon-otp-send-dialog.tsx:94-103` Closing the dialog resets it to step 1 with a cleared code — a re-opened dialog always starts the ceremony fresh (no stale half-entered code).
- `[CODE]` `falcon-otp-send-dialog.tsx:162` Verify is disabled until the OTP is complete — a user cannot submit a partial code.
- `[CODE]` `falcon-otp-send-dialog.tsx:55-62` Every label is a public prop — the ceremony's copy is i18n-overridable, not hardcoded English.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Add Client wizard — account-owner verify | organization-hierarchy | Confirms the account owner controls the email/phone before the account is created. |
| Login second factor | host-shell auth | The channel-choice + code-entry ceremony for step-up auth. |
| Sensitive-action confirmation | `[INFERRED]` various | Any action a flow decides needs out-of-band confirmation. |

## Business gotchas
- `falcon-send` / `falcon-verify` / `falcon-resend` are **intents, not outcomes** — the flow owns every backend call and must drive `step`, `errorMessage`, and `open` from the results.
- The dialog will happily fire `falcon-resend` on every click — if the business needs a cooldown, the flow must disable/throttle.
- `mode` is a *policy* input — set it from tenant config, not a UI default, or a user may be offered a channel the tenant forbids.
- A re-opened dialog is always fresh — do not expect it to remember a previously entered code.

## Verification
🟡 CODE-DERIVED from `falcon-otp-send-dialog.tsx` / `.utils.ts` / `.types.ts` + auth OTP services. Add Client account-owner usage 🟡 CODE-DERIVED from `OVERVIEW.md` consumer list (not user-confirmed in this pass).
