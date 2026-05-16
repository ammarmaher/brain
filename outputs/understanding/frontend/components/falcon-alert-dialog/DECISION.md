*** falcon-alert-dialog — DECISION RECORD ***

# Why a new component? (Round 4, 2026-05-15)

## Triggering context

Round 2 + Round 3 of the `organization-hierarchy-page` Falcon-eyes repair built
the "Insufficient Balance Detected" modal as a slot-projection shim on top of
`<falcon-angular-dialog>` — injecting a centered icon + title + subtitle into
`slot="header"` and the priority list into the default slot.

User feedback (Round 4 prompt, 2026-05-15):

> "User explicitly stated a new Falcon library component MUST be created (we
> didn't have anything matching the 'Insufficient Balance Detected' popup
> characteristics). Round 3's dialog-slot shim does not satisfy this. Replace it."

## Rejected alternatives

1. **Keep the slot shim** — Round 3 approach. Rejected because every consumer
   that needs this SoT layout would re-implement the same slot-projection
   boilerplate. Not Falcon-library-first.

2. **Extend `<falcon-dialog>` with new props** — would balloon the dialog API
   surface and break the SRP boundary. The dialog stays a generic modal host;
   the alert-dialog is the opinionated severity-centered variant.

3. **Extend `<falcon-confirm-dialog>` to a centered layout** — would break
   backward compatibility for the existing confirm-dialog consumers (left-aligned
   small icon, short message). Confirm-dialog stays small-prompt; alert-dialog
   is the centered-callout variant.

## Decision

Ship `<falcon-alert-dialog>` (Shadow DOM) + `<falcon-alert-dialog-tw>` (Light DOM)
+ `<falcon-angular-alert-dialog>` (Angular wrapper) as a specialized composition
of `<falcon-dialog>`, following the same dual-render-path pattern as
`<falcon-confirm-dialog>`.

## Key contracts

- **Specialized composition** of `<falcon-dialog>`: inherits focus-trap, backdrop,
  esc handling, all `--falcon-dialog-*` tokens.
- **Centered layout** (icon → title → subtitle → body slot → footer).
- **Severity-driven**: 4 variants, all token-mapped.
- **Body slot only** — header/footer are component-rendered, not consumer-projected.
  Consumers wanting custom header/footer drop down to `<falcon-angular-dialog>`.
- **Two-way `[(open)]`** binding for Angular consumers.
- **No SCSS, no component CSS** in consumer code.

## Token strategy

All visual values flow through CSS custom properties on `:host` (Shadow) or
Tailwind arbitrary-value classes (Light DOM). 23 component-level tokens defined
in `TOKENS.md`. Severity drives icon-color + confirm-bg tokens via attribute
selectors (`:host([severity="..."])`).

## Wire-up

- `define-falcon-tw-component.ts` — added `'falcon-alert-dialog-tw'` loader.
- `define-falcon-component.ts` — added `'falcon-alert-dialog'` Shadow loader.
- `define-custom-elements.ts` — added eager-register entries for both variants.
- `angular-wrapper/index.ts` — added `export * from './components/falcon-alert-dialog';`.
- Stencil auto-regenerates `components.d.ts` on next `nx build falcon-ui-core`.

## Consumer migration

The Round 3 staged `InsufficientBalanceModalComponent` is rewired to use
`<falcon-angular-alert-dialog>` directly. The slot-shim boilerplate is removed
from the consumer's `.html` — the consumer now only declares the title, subtitle,
severity, and slot-projects the priority list. The `<falcon-angular-dialog>`
import is dropped in favor of `<falcon-angular-alert-dialog>`.
