# falcon-otp-send-dialog — OVERVIEW

## Component purpose

Two-step verify-identity dialog composing `<falcon-angular-dialog>` + step 1 channel chooser (`<falcon-angular-radio>` rows for email / sms / both) + step 2 OTP entry (`<falcon-angular-otp>`). Step 1 → Send → Step 2 with Verify + Resend. Validation deferred.

## Business / UI use case

- Verify-identity flows: send code to email/sms then confirm.
- Used in account-owner verification inside Add Client wizard.
- Step-up authentication.

## When to use it / when NOT to use it

**Use it for:** OTP-send-then-verify flows requiring channel choice.

**Do NOT use it for:**
- Inline OTP without dialog → `<falcon-angular-otp>`.
- Generic confirm/cancel modal → `<falcon-angular-popup>` / `<falcon-angular-dialog>`.

## Status

**ACTIVE / PREFERRED** for OTP flows.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp-send-dialog/falcon-otp-send-dialog.component.ts` |
| HTML | `.../falcon-otp-send-dialog.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-otp-send-dialog/falcon-otp-send-dialog.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-otp-send-dialog-tw/falcon-otp-send-dialog-tw.tsx` |
| Types | `.../falcon-otp-send-dialog.types.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/otp-send-dialog.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-otp-send-dialog` |
| Stencil Shadow | `<falcon-otp-send-dialog>` |
| Stencil Light | `<falcon-otp-send-dialog-tw>` |

## Known consumers

- Account-owner verify in Add Client wizard.
- Login verify step.

## Related components

- Composes `<falcon-angular-dialog>`, `<falcon-angular-radio>`, `<falcon-angular-otp>`, `<falcon-angular-button>`.

## Ownership

`libs/falcon-ui-core`.
