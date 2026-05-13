# falcon-form-field — TOKENS

## Token file

**NONE in `libs/falcon-ui-tokens/src/components/`.** Component lives at `libs/falcon/src/shared-ui/lib/components/falcon-form-field/` with its own SCSS file — predating the token discipline. **Migrate to a `form-field.tokens.css` when retiring SCSS (G1).**

## Token categories (future / proposed)

If migrated:

1. CONTAINER — display, padding, gap, margin-bottom.
2. LABEL ROW — gap between label + required asterisk, alignment.
3. LABEL — color (idle / invalid / disabled), font, weight, font-size, line-height.
4. REQUIRED ASTERISK — color, font.
5. HINT — color, font, margin-top.
6. ERROR — color, font, margin-top.

## Related Falcon theme tokens

- `--color-falcon-neutral-800` for label.
- `--color-falcon-red-500` for required + error.
- `--color-falcon-neutral-700` for hint.
- `--falcon-font-size-xs` for hint/error.

## Tailwind utility guidance

When migrated, drop SCSS entirely; template uses Tailwind utilities + token CSS vars.

## Dark mode

Will be token-driven after migration.

## Density

N/A.

## RTL

Label-row direction respects `dir`.

## Static style risks

**SCSS file** (`falcon-form-field.component.scss`) is the biggest risk. Contents unknown without reading — likely includes hardcoded colors / margins / fonts.

## No CSS / no SCSS

**VIOLATED** today. Migrate.

## Token usage by state

| State | Tokens (future) |
|---|---|
| Idle | `--falcon-form-field-label-color`, `--falcon-form-field-hint-color` |
| Required | `--falcon-form-field-required-color` |
| Invalid | `--falcon-form-field-label-color-invalid`, `--falcon-form-field-error-color` |
| Disabled | `--falcon-form-field-label-color-disabled` |
