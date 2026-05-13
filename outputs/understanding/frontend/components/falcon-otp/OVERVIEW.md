# falcon-otp — OVERVIEW

## Component purpose

One-time-passcode (OTP) entry with N boxes (default 6). Auto-advance, backspace-retreat, paste-fill, and keyboard nav (Arrow/Home/End). Per-box ARIA labels. CVA-supported. Validation deferred — value emission only.

## Business / UI use case

- Login OTP verification.
- Email/phone verification flow inside `<falcon-angular-otp-send-dialog>`.
- 2FA codes.

## When to use it / when NOT to use it

**Use it for:** any N-digit code entry where each digit is in its own box.

**Do NOT use it for:**
- Password → `<falcon-angular-password>`.
- Full numeric entry → `<falcon-angular-input-number>`.
- Pattern lock → not a Falcon component.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-inputOtp>` and hand-rolled OTP fields.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp/falcon-otp.component.ts` |
| HTML | `.../falcon-otp.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-otp/falcon-otp.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-otp-tw/falcon-otp-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/otp.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-otp` |
| Stencil Shadow | `<falcon-otp>` |
| Stencil Light | `<falcon-otp-tw>` |

## Known consumers

- `<falcon-angular-otp-send-dialog>` step 2.
- Login / 2FA flows.
- Email/phone verify flows.

## Related components

- Composed by `<falcon-angular-otp-send-dialog>`.

## Ownership

`libs/falcon-ui-core`.
