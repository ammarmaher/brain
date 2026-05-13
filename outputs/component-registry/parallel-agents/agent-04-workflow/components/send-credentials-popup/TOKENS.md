# send-credentials-popup (LEGACY) — TOKENS

## Token file path
- _None._ Visual SSOT is the SCSS file.

## Related Falcon theme tokens
- Inherits dialog tokens (`dialog.tokens.css`) via embedded `<falcon-angular-dialog>`.
- Inherits radio tokens via `<falcon-angular-radio>`.
- Inherits button tokens via `<falcon-angular-button>`.

## Tailwind utility guidance
- Templates likely use some Tailwind for layout. Visuals in SCSS.

## Dark mode support
- Inherited from the composed Falcon UI core components.

## Density support
- _None._

## RTL support
- Inherited.

## Static style risks
- **High.** SCSS file owns visual values.

## No CSS / No SCSS guidance
- Delete SCSS during migration to `<falcon-angular-popup variant="custom">`.

## Token usage matrix per state
- N/A.
