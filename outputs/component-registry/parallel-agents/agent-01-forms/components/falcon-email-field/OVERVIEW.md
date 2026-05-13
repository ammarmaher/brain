# falcon-email-field — OVERVIEW

## Component purpose

Email input that pairs a native `<input type="email">` with an optional in-field "Verify" button — all sharing ONE outer border (single-element look). Designed for flows where the consumer triggers email verification on demand (e.g. send verification code).

## Business / UI use case

- Registration / profile update email entry.
- "Verify email" flows in admin-console / management-console.
- Account-owner email entry in Add Client wizard.

## When to use it / when NOT to use it

**Use it for:**
- Email fields that need a verify-button affordance OR consistent visual treatment for email.
- Email-typed input with appropriate `autocomplete="email"` default.

**Do NOT use it for:**
- Generic text → `<falcon-angular-input>`.
- Email without verify and you don't need any visual specialization → `<falcon-angular-input type="email">` works fine.

## Status

**ACTIVE / PREFERRED** for verify flows. **Validation deferred** — component emits `falcon-verify` event; consumer drives validation logic.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-email-field/falcon-email-field.component.ts` |
| HTML | `.../falcon-email-field.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-email-field/falcon-email-field.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-email-field-tw/falcon-email-field-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/email-field.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-email-field` |
| Stencil Shadow | `<falcon-email-field>` |
| Stencil Light | `<falcon-email-field-tw>` |

## Known consumers

- Add Client wizard (admin + management) — account-owner email.
- Profile update.
- Verify-email screens.

## Related components

- Sibling: `<falcon-angular-input>` (no verify button).

## Ownership

`libs/falcon-ui-core`.
