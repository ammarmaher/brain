# falcon-email-field — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/email-field.tokens.css`.

## Token categories

Inherits all `<falcon-input>` tokens plus:

1. VERIFY BUTTON — height (matches input), width / padding-x, bg, color, border, radius.
2. VERIFY BUTTON STATES — idle / hover / active / disabled.
3. SHARED-BORDER PARTITION — the 1px vertical divider between input and verify button (color, width).
4. VERIFIED STATE (when added) — checkmark icon color + container.

## Related Falcon theme tokens

- `--color-falcon-teal-500` for verify-button-bg.
- `--color-falcon-neutral-0` for verify-button text color.
- `--color-falcon-neutral-200` for shared-border partition.
- `--color-falcon-green-500` for verified state (when implemented).

## Tailwind utility guidance

`wrapperClass`, `inputClass`, `labelClass`.

## Dark mode

Token-driven.

## Density

Inherits input density.

## RTL

Verify button flips to left side automatically; partition divider switches sides.

## Static style risks

Partition divider is 1px solid — token-driven.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Input idle | (inherits `<falcon-input>` tokens) |
| Verify button idle | `--falcon-email-field-verify-bg`, `--falcon-email-field-verify-color`, `--falcon-email-field-verify-border-color` |
| Verify hover | `--falcon-email-field-verify-bg-hover`, `--falcon-email-field-verify-color-hover` |
| Verify disabled | `--falcon-email-field-verify-bg-disabled`, `--falcon-email-field-verify-color-disabled` |
| Partition | `--falcon-email-field-partition-color`, `--falcon-email-field-partition-width` |
| Verified (future) | `--falcon-email-field-verified-icon-color`, `--falcon-email-field-verified-bg` |
