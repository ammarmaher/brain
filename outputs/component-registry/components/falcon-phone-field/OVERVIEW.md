# falcon-phone-field — OVERVIEW

## Component purpose

Phone number entry combining a country chooser (flag + chevron + dial code) + native `<input type="tel">` + optional Verify button — all inside ONE outer border. The country chooser is a searchable dropdown panel. Replaces `ngx-intl-tel-input` + `google-libphonenumber` (uninstalled in Wave 2).

## Business / UI use case

- All phone-number entry across admin-console + management-console.
- Account-owner phone in Add Client wizard.
- Profile phone update.

## When to use it / when NOT to use it

**Use it for:** any phone-number entry. Always.

**Do NOT use it for:**
- Non-phone numeric → input-number / input.
- US-only without country choice → still use phone-field with `country='US'` and pass `countries` filtered.

## Status

**ACTIVE / PREFERRED.** Wave 2 of v3.1. Validation deferred — emits change/verify; consumer drives validation logic.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-phone-field/falcon-phone-field.component.ts` |
| HTML | `.../falcon-phone-field.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-phone-field/falcon-phone-field.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-phone-field-tw/falcon-phone-field-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/phone-field.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-phone-field` |
| Stencil Shadow | `<falcon-phone-field>` |
| Stencil Light | `<falcon-phone-field-tw>` |

## Known consumers

- Add Client / Add User wizards (admin + management).
- Profile phone field.
- Account-owner step inside Add Client wizard.

## Related components

- Sibling: `<falcon-angular-email-field>` (same verify-button family).
- Composes internally: country dropdown + native input + verify button.

## Ownership

`libs/falcon-ui-core`.
