# falcon-form-field (LEGACY) — TOKENS

## Token file path
- _None._ Visual SSOT is the SCSS file.

## Related Falcon theme tokens
- Likely consumes `--color-falcon-neutral-…` and `--color-falcon-red-500` (error) via SCSS.

## Tailwind utility guidance
- The template uses some Tailwind utilities for layout; visual styling is in SCSS.

## Dark mode support
- **Missing.**

## Density support
- _None._

## RTL support
- Audit required.

## Static style risks
- **High.** SCSS defines `.fff-error` and other classes.

## No CSS / No SCSS guidance
- The SCSS file violates this rule. Promote to Falcon UI core OR migrate visuals to Tailwind utilities.

## Token usage matrix per state
- N/A.

## Migration mapping
When promoted to Falcon UI core, the token contract would include:
- `--falcon-form-field-label-{font-size,font-weight,color,margin-bottom}`.
- `--falcon-form-field-required-marker-color`.
- `--falcon-form-field-hint-{font-size,color,margin-top}`.
- `--falcon-form-field-error-{font-size,color,margin-top,font-weight}`.
- `--falcon-form-field-gap` (label-to-control, control-to-hint).
- `--falcon-form-field-disabled-opacity`.
