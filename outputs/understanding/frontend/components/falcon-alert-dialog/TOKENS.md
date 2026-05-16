*** falcon-alert-dialog — TOKENS ***

# Component-level tokens

All on `:host` (Shadow DOM) or as Tailwind arbitrary-value classes (Light DOM
`-tw` variant). Override per-instance via `style="…"` on the host element.

| Token | Default | Drives |
|---|---|---|
| `--falcon-alert-dialog-icon-color` | severity-derived | Severity icon fill |
| `--falcon-alert-dialog-confirm-bg` | `var(--falcon-teal-700, #124C52)` | Confirm button background |
| `--falcon-alert-dialog-confirm-color` | `var(--color-falcon-neutral-0, #FFFFFF)` | Confirm button text |
| `--falcon-alert-dialog-cancel-bg` | `var(--color-falcon-neutral-0, #FFFFFF)` | Cancel button background |
| `--falcon-alert-dialog-cancel-color` | `var(--color-falcon-neutral-700, #1A1A1A)` | Cancel button text |
| `--falcon-alert-dialog-cancel-border` | `var(--color-falcon-neutral-200, #E5E7EB)` | Cancel button border |
| `--falcon-alert-dialog-title-color` | `var(--color-falcon-neutral-900, #111827)` | Title text |
| `--falcon-alert-dialog-subtitle-color` | `var(--color-falcon-neutral-600, #4B5563)` | Subtitle text |
| `--falcon-alert-dialog-title-font-size` | `18px` | Title font size |
| `--falcon-alert-dialog-title-font-weight` | `700` | Title font weight |
| `--falcon-alert-dialog-subtitle-font-size` | `13px` | Subtitle font size |
| `--falcon-alert-dialog-subtitle-line-height` | `1.5` | Subtitle line-height |
| `--falcon-alert-dialog-subtitle-max-width` | `460px` | Subtitle clamp width |
| `--falcon-alert-dialog-icon-size` | `56px` | Icon container size |
| `--falcon-alert-dialog-header-gap` | `12px` | Gap between icon/title/subtitle |
| `--falcon-alert-dialog-footer-gap` | `10px` | Gap between Cancel + Confirm |
| `--falcon-alert-dialog-btn-padding-block` | `10px` | Button vertical padding |
| `--falcon-alert-dialog-btn-padding-inline` | `18px` | Button horizontal padding |
| `--falcon-alert-dialog-btn-radius` | `8px` | Button corner radius |
| `--falcon-alert-dialog-btn-font-size` | `14px` | Button font size |
| `--falcon-alert-dialog-btn-font-weight` | `600` | Button font weight |

# Severity → icon color resolution

```
:host([severity="warning"]) → --falcon-status-danger (#E63946)
:host([severity="danger"])  → --falcon-status-danger (#E63946)
:host([severity="info"])    → --falcon-teal-700      (#124C52)
:host([severity="success"]) → --falcon-status-success (#16A34A)
```

# Inherited tokens (via composition with `<falcon-dialog>`)

The component composes `<falcon-dialog>` so all `--falcon-dialog-*` tokens
(panel bg, backdrop, shadow, container border-radius, etc.) flow through unchanged.
See `falcon-dialog/TOKENS.md` for the full list.

# No SCSS / no component CSS in consumer code

Per Falcon platform standard: consumers MUST NOT add SCSS or component CSS to
override. Override via:
1. Per-instance host `style="..."` for one-off tweaks.
2. Global Theme Studio for theme-wide rebrand.
3. Tailwind class names on slotted body content for body styling.
