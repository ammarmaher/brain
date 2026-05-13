# falcon-phone-field — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/phone-field.tokens.css`.

## Token categories

Inherits all `<falcon-input>` tokens plus:

1. COUNTRY CHOOSER BUTTON — bg, color, padding-x, chevron color, hover bg.
2. FLAG ICON — size (controlled per `size`), border-radius if image flag.
3. DIAL CODE LABEL — color, font-weight, padding-x.
4. PARTITION DIVIDERS — color, width — three partitions: country/dial-code, dial-code/input, input/verify.
5. COUNTRY DROPDOWN PANEL — bg, border, max-height, shadow.
6. COUNTRY LIST OPTION — bg-idle / hover / selected, text-color, flag size, dial code color.
7. COUNTRY SEARCH BAR — same surface as dropdown panel header.
8. VERIFY BUTTON — same family as email-field's verify button.

## Related Falcon theme tokens

- `--color-falcon-neutral-50` for country chooser bg.
- `--color-falcon-neutral-200` for partition divider.
- `--color-falcon-teal-500` for verify button + focus.
- Brand teal for selected country in panel.

## Tailwind utility guidance

`wrapperClass`, `inputClass`, `labelClass`.

## Dark mode

Token-driven.

## Density

Inherits input density. Flag size scales with `size`.

## RTL

Country chooser flips to RIGHT in RTL. Partition order auto-mirrors.

## Static style risks

- Flag emoji rendering is OS-dependent — visual variance.
- Partition dividers are 1px solid via token — verify pixel alignment at 200% zoom.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Country chooser idle | `--falcon-phone-field-country-bg`, `--falcon-phone-field-country-color` |
| Country chooser hover | `--falcon-phone-field-country-bg-hover` |
| Dial code | `--falcon-phone-field-dial-code-color`, `--falcon-phone-field-dial-code-font-weight` |
| Partition | `--falcon-phone-field-partition-color`, `--falcon-phone-field-partition-width` |
| Verify button | `--falcon-phone-field-verify-bg`, `--falcon-phone-field-verify-color`, `--falcon-phone-field-verify-bg-hover` |
| Country panel | `--falcon-phone-field-panel-bg`, `--falcon-phone-field-panel-shadow`, `--falcon-phone-field-panel-max-height` |
| Country option hover | `--falcon-phone-field-option-bg-hover` |
| Country option selected | `--falcon-phone-field-option-bg-selected` |
| Flag size | `--falcon-phone-field-flag-size-{sm,md,lg}` |
