# falcon-confirm-dialog — OVERVIEW

## Component purpose
Specialised composed variant of `<falcon-angular-dialog>` providing a fixed confirm/reject layout — accept button + reject button + icon + message in the body, projected into the underlying dialog's footer slot.

## Business / UI use case
- OK / Cancel prompts that don't match the 4 `falcon-popup` canonical variants.
- Confirmations with explicit accept/reject button labels (e.g. "Approve" / "Reject", "Continue" / "Go back").
- When `falcon-popup` variants are too opinionated and `falcon-dialog` is too low-level.

## When to use it
- For "Are you sure?" prompts with non-canonical button labels.
- When you want pre-defined accept/reject buttons but custom title + message.
- When `severity` should drive the accent color (info / success / warning / danger).

## When NOT to use it
- For the 4 canonical flows — use `<falcon-angular-popup>`.
- For form-bearing dialogs — use `<falcon-angular-dialog>` directly.
- For drawers / notifications / popovers.

## Active / preferred / deprecated / legacy status
**ACTIVE.** Wave 9.F. Production-grade. Replaces legacy `<p-confirmDialog>`.

## Replaces
- PrimeNG `<p-confirmDialog>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog/falcon-confirm-dialog.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog/falcon-confirm-dialog.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-confirm-dialog/falcon-confirm-dialog.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-confirm-dialog/falcon-confirm-dialog.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-confirm-dialog-tw/falcon-confirm-dialog-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/confirm-dialog.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-confirm-dialog>`
- Stencil Shadow: `<falcon-confirm-dialog>`
- Stencil Light: `<falcon-confirm-dialog-tw>`

## Known consumers
**No matches in `apps/`.** The component is exported but not yet adopted in production pages — current confirmation patterns use `falcon-angular-popup` (the 4 canonical flows cover most needs).

## Related components
- `falcon-angular-dialog` — substrate (composed internally).
- `falcon-angular-popup` — alternative for the 4 canonical decision flows.
- `falcon-angular-icon` — should be used for the body icon (currently `<i class="...">` markup).

## Ownership / responsibility
Owned by Falcon UI Core. Architectural §5.12.2 "specialized composed pattern" — purpose-built layer over `falcon-dialog`.
