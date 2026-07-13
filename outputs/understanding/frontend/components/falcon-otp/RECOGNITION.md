# falcon-otp — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-otp>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-otp.tsx:283-360` — A horizontal row of **N separate square boxes** (default 6), each holding exactly one character (`maxLength={1}`), evenly gapped. An optional label with a `*` above; a helper or `role="alert"` error line below. Each box has its own border + focus ring; the focused box is highlighted and its contents auto-selected. When `mask` is on, boxes render dots instead of digits (`type="password"`). The whole row is `role="group"` labeled "One-time passcode".

Distinguishing feature: **one character per visually-distinct box**, with the cursor auto-advancing box-to-box — unlike a single text input.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<MuiOtpInput>` (mui-one-time-password-input) | direct 1:1 — segmented OTP boxes. |
| PrimeNG | `<p-inputOtp>` | direct 1:1 — this component replaced it. |
| Ant Design | `<Input.OTP>` | direct 1:1 (Antd 5.x segmented OTP). |
| Bootstrap | no native — hand-rolled row of `maxlength=1` inputs | upgrade target. |
| shadcn / Radix | `<InputOTP>` (shadcn, built on `input-otp`) | direct 1:1 — slots + groups. |
| plain HTML | a row of `<input maxlength="1">` with JS focus-jumping | always replace. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a row of separate single-char boxes for a code | `<falcon-angular-otp>` | a text input |
| a 4-box masked PIN | `<falcon-angular-otp [mask]="true" [length]="4">` | password |
| a "send code then enter it" two-step dialog | `<falcon-angular-otp-send-dialog>` (composes this) | bare otp |
| a masked secret with a reveal eye | `<falcon-angular-password>` | otp |
| a long numeric value in one field | `<falcon-angular-input-number>` | otp |
| a phone number + SMS trigger | `<falcon-angular-phone-field [verifyButton]>` | otp |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[length]` (match the backend-issued code length), `[(ngModel)]`/CVA, `[label]`, `[state]` + `[errorMessage]` for wrong-code feedback.
2. **Character class** — set `pattern` (`[0-9]` default; `[A-Z0-9]` for alphanumeric codes).
3. **Masking** — `[mask]="true"` only for true PINs, not transient OTPs.
4. **Completion handling** — until the wrapper proxies `falcon-complete`, detect completion in `(ngModelChange)` via `value.length === length` and auto-submit.
5. **Tokens** — box size (`--falcon-otp-box-size-{sm,md,lg}`), gap (`--falcon-otp-gap`), border (`--falcon-otp-border-color-focus`), focus ring (`--falcon-otp-ring-color-focus`) via `otp.tokens.css` vars. (State tokens have NO `-box-` infix — see TOKENS.md.)
6. **Verification round-trip** — POST the value to `auth/verify-otp`; render the rejection by setting `[errorMessage]`. The component never validates correctness.
7. **GAP** — a wrapper `(falconComplete)` output and proxied `clear()`/`setFocus()` do not exist on the Angular wrapper — raise as a library upgrade, do not hand-roll a parallel completion watcher into the library.

## Anti-patterns
- A single `<input>` for a code that the design shows as separate boxes — wrong shape.
- Granting access on `complete=true` — completion ≠ correctness; wait for the backend.
- Setting `length` to a value the backend did not issue — verification can never pass.
- Re-implementing paste-fill / auto-advance / SMS-autofill — all built in.
- Using `<falcon-angular-otp>` for a password — masking is per-PIN, not a password substitute.

## Verification
🟢 code-verified (re-read 2026-06-03) from `falcon-otp.tsx` + `falcon-otp-tw.tsx` render trees. Segmented-box fingerprint, `role="group"` "One-time passcode", mask→`type=password`, auto-advance ✅ source-verified. Cross-library mappings 🔴 INFERRED from standard library APIs. Token references corrected (no `-box-` infix on state tokens).
