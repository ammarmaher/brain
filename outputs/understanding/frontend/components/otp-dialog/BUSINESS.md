# otp-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[CODE]` The dialog is how Falcon **proves a user owns the email/phone they just changed** before that change is persisted. In business terms it is the **contact-ownership gate** on self-service profile editing: a user edits their email or phone on the User Details / My Profile page, and they cannot Save until they enter the one-time code sent to that NEW value. `[CODE]` otp-dialog.component.ts:1-18 + user-details-page.component.html:679 + en.json:1130-1131 (`verificationRequired` / `saveBlockedHint`).

It is the visible enforcement of "you may not change a contact channel to something you don't control."

## PRD / business rules touched

| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A changed email/phone must be OTP-verified before save | `[CODE]` en.json:1130 (`"verificationRequired": "Verification required before saving"`) + 1131 (`saveBlockedHint`) + signals.ts verification slice (otpOpen/…/phoneVerifiedLocal/emailVerifiedLocal) signals.ts:9 | The host gates Save on `(verified)`; this dialog runs send→verify and only emits `verified` after the BE confirms the code. |
| OTP is delivered to the NEW value, not the old | `[CODE]` profile-otp.service.ts:41 (`body = { phoneNumber: value }` / `{ email: value }`) + ts:228-235 | The dialog sends `fieldValue()` (the draft) on the wire so the BE targets the right verification record. |
| OTP code length + expiry are BACKEND-driven | `[CODE]` ts:242-247 (`otpCodeLength` wins) + VerificationCodeResponse | The box count + countdown come from the BE `sendOtp` response, not a client constant — the business owns the policy. |
| Resend only after expiry | `[CODE]` html:223-227 (`[disabled]="!expired()"`) + ts:201-203/265 | The operator cannot spam resend; the Resend button is enabled only once the code has expired. |
| A failed/unusable send must not show an empty popup | `[CODE]` ts:220-254 (`failSend` keeps `visible=false`) | If the BE can't issue a code (transport fail OR `otpCodeLength<=0`), the modal never opens — the user gets an error toast instead of a broken popup. |

## Business constraints baked in

- `[CODE]` **The code is never returned to the app** — only the boolean `verified` event. The verified STATE lives on the backend; the FE merely unblocks Save. A builder must NOT try to read/store the entered code. ts:300-318.
- `[CODE]` **BE policy overrides client defaults** — `OTP_DEFAULTS.LENGTH=6` / `EXPIRY_SECONDS=120` are only fallbacks (ts:45/86-88); the BE `otpCodeLength`/`otpExpiresInSeconds` win. Do not hardcode "6 digits / 2 minutes" in business copy as if fixed. otp.enums.ts:25-28.
- `[CODE]` **`zeroLength` is a backend BUSINESS FAULT, not transport** — if `sendOtp` succeeds (`isSuccessful`) but returns `otpCodeLength <= 0`, the dialog routes to a DISTINCT `'hierarchy.otp.zeroLength'` toast ("the verification service returned an invalid code length… contact support"), separate from `'sendFailed'`. ts:248-251 + en.json:1916.
- `[CODE]` **Positive-edge open guard** — the dialog only SENDS on a real Verify-button click (false→true edge), never on a profile reload or mid-typing recompute (the `wasOpen` guard, ts:131/135-146). This prevents the business-visible "OTP auto-pops on page entry" + "my typed code got wiped" bugs the comment documents.
- `[CODE]` **12-second send watchdog** — if the gateway hangs, the dialog gives up after 12s with the standard error toast rather than spinning forever. ts:119/400-410.
- `[CODE]` **Verify error messages come from the BE** — a wrong code / attempts-exhausted message is surfaced inline (`verifyErrorMsg`) from the SOR failure body; only if absent does it fall back to generic `hierarchy.otp.invalid`. ts:329-353.

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Change own email | User Details / My Profile (admin + mgmt + host-shell `/profile` self) | Sends OTP to the new email, verifies, unblocks Save. |
| Change own phone | same | Sends OTP to the new phone number, verifies, unblocks Save. |

> Both run through the SAME shared `user-details-page` host (`[MEMORY]` edit-user-by-status — the self route uses `/user/me`), so admin, client, and self users all hit this one dialog.

## Business gotchas

- A **"Save" that stays disabled** after editing email/phone is the verification gate working — the user must complete this dialog first. Not a bug. `[CODE]` en.json:1131 `saveBlockedHint`.
- The **modal not appearing after clicking Verify** can mean the send FAILED (toast shown) — by design the modal only opens on a successful send. `[CODE]` ts:240-254.
- A **`zeroLength` toast** is a backend configuration fault (the OTP service returned a bad length) — a "contact support" path, not user error. `[CODE]` en.json:1916.
- **Resend disabled until expiry** is intentional rate-limiting — not a broken button. `[CODE]` html:227.
- The dialog **auto-verifies** ~200ms after the last digit (incomplete→complete edge) — the user usually doesn't press a Verify button; the box-fill IS the submit. `[CODE]` ts:181-185.
- The dialog **owns its error UX** (`notShowToaster:'true'` on every call) — if a user sees BOTH a global toaster AND this dialog's inline error for one OTP attempt, a gateway call forgot the header. `[CODE]` profile-otp.service.ts:46/62/78.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). The verify-before-save gate (en.json:1130-1131 + signals verification slice), BE-driven length/expiry (ts:242-247), `zeroLength`-vs-`sendFailed` business distinction (ts:248-251 + en.json:1916), positive-edge guard (ts:131-146), 12s watchdog (ts:400-410), and auto-verify (ts:181-185) all re-confirmed in live source. Flow list 🟡 CODE-DERIVED from user-details-page.component.html:679 + `[MEMORY]` edit-user-by-status (user-confirmed working `/profile` + both consoles).
