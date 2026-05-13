# falcon-radio — OVERVIEW

## Component purpose

Single radio button (mutually exclusive boolean). Uses the border-width-5 trick for the visible inner dot via tokens. CVA-supported. Designed to be composed inside `<falcon-angular-radio-group>` (preferred) but can be used standalone.

## Business / UI use case

- Single radio inside form-control rows (rare standalone; usually grouped).
- Step 1 channel chooser inside `<falcon-angular-otp-send-dialog>` (email / sms / both).
- Wizards with mutually-exclusive single-row choices.

## When to use it / when NOT to use it

**Use it for:** an individual radio dot bound to a value. Almost always inside `<falcon-angular-radio-group>`.

**Do NOT use it for:**
- Multiple options sharing a value → use `<falcon-angular-radio-group>` (don't hand-roll).
- Boolean on/off → `<falcon-angular-checkbox>` or `<falcon-angular-switch>`.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-radioButton>`.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio/falcon-radio.component.ts` |
| HTML | `.../falcon-radio.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-radio/falcon-radio.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-radio-tw/falcon-radio-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/radio.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-radio` |
| Stencil Shadow | `<falcon-radio>` |
| Stencil Light | `<falcon-radio-tw>` |

## Known consumers

- `<falcon-angular-radio-group>` (canonical use).
- `<falcon-angular-otp-send-dialog>` step 1.
- Wizard forms.

## Related components

- Composed by: `<falcon-angular-radio-group>`, `<falcon-angular-otp-send-dialog>`.
- Sibling: `<falcon-angular-checkbox>`, `<falcon-angular-switch>`.

## Ownership

`libs/falcon-ui-core`.
