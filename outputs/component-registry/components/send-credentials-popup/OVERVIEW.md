# send-credentials-popup (LEGACY) — OVERVIEW

## Purpose
Confirmation popup for "send credentials to account owner". Renders inside a `<falcon-angular-dialog>` shell, with a radio group of `DeliveryMethod` options (email / sms / both / etc.) and a Submit button. Used after creating a new client or user to confirm how their initial credentials should be delivered.

## Business / UI use case
- Final step of Add Client wizard (`accountOwnerName`, `phoneNumber`, `email`).
- Final step of Add User wizard.
- Any flow that creates an account requiring out-of-band credential delivery.

## When to use it / when NOT to use it
- USE for credential-delivery confirmation flows. Specific to this domain.
- DO NOT use as a generic confirmation dialog — use `<falcon-angular-popup variant="save">` or `<falcon-angular-confirm-dialog>` instead.

## Status
- **LEGACY-IN-USE.** Bespoke Angular standalone component.
- Likely candidate for migration once `<falcon-angular-popup>` lands a slot-friendly variant (currently `<falcon-angular-popup>` has 4 fixed variants — error / delete / unsaved / save — none of which support a radio-group body slot).

## Selector / Tags
- `<falcon-send-credentials-popup>` (Angular).
- No Stencil tag.

## Source paths
| Layer | Path |
|---|---|
| Component | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.ts` |
| Template | `…/send-credentials-popup.component.html` |
| SCSS | `…/send-credentials-popup.component.scss` |

## Known consumers
- _Verify with grep._ Likely Add Client wizard final step and/or Add User wizard final step.

## Related components
- `<falcon-angular-dialog>` — composed as the dialog shell.
- `<falcon-angular-radio>` — composed for the delivery method radio group.
- `<falcon-angular-button>` — Submit + Cancel.
- `<falcon-angular-popup>` — eventual replacement target (needs slot-friendly variant first).

## Ownership / Responsibility
- Legacy bespoke.
- Owns the `DeliveryMethod` enum mapping via `Helper.enumToOptions` from `@falcon/shared-data-access`.
- Owns its own SCSS file (violates project rule).
