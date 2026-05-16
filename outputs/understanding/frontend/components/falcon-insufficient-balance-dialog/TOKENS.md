# falcon-insufficient-balance-dialog — TOKENS

Token file: `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css`

Imported into: `libs/falcon-ui-tokens/src/index.css` (component-layer import order — bottom).

Selector chain (Canonical Pattern C7):
```css
:where(
  falcon-insufficient-balance-dialog,
  falcon-insufficient-balance-dialog-tw,
  falcon-angular-insufficient-balance-dialog,
  .falcon-insufficient-balance-dialog,
  [data-falcon-insufficient-balance-dialog]
) { ... }
```

## Token catalogue

### Backdrop + panel chrome
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-backdrop-bg` | `rgba(15, 23, 42, 0.42)` |
| `--falcon-ib-dialog-backdrop-z` | `1000` |
| `--falcon-ib-dialog-panel-bg` | `--color-falcon-neutral-0` |
| `--falcon-ib-dialog-panel-radius` | `16px` |
| `--falcon-ib-dialog-panel-padding-block` | `28px` |
| `--falcon-ib-dialog-panel-padding-inline` | `28px` |
| `--falcon-ib-dialog-panel-max-width` | `480px` |
| `--falcon-ib-dialog-panel-shadow` | `0 25px 50px -12px rgba(0,0,0,0.25)` |

### Glossy mode (toggled by `[show-glossy="true"]`)
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-glossy-backdrop-filter` | `blur(8px) saturate(1.4)` |
| `--falcon-ib-dialog-glossy-panel-filter` | `saturate(1.05)` |

### Icon (toggled by `[show-icon-color]` / `[show-icon-background]`)
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-icon-size` | `56px` |
| `--falcon-ib-dialog-icon-color` | `--falcon-status-danger` (red) |
| `--falcon-ib-dialog-icon-color-neutral` | `--color-falcon-neutral-400` |
| `--falcon-ib-dialog-icon-bg` | `rgba(230, 57, 70, 0.10)` |
| `--falcon-ib-dialog-icon-bg-size` | `72px` |
| `--falcon-ib-dialog-icon-bg-radius` | `50%` |

### Header text
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-header-gap` | `12px` |
| `--falcon-ib-dialog-title-color` | `--color-falcon-neutral-900` |
| `--falcon-ib-dialog-title-font-size` | `18px` |
| `--falcon-ib-dialog-title-font-weight` | `700` |
| `--falcon-ib-dialog-title-line-height` | `1.3` |
| `--falcon-ib-dialog-subtitle-color` | `--color-falcon-neutral-600` |
| `--falcon-ib-dialog-subtitle-font-size` | `13px` |
| `--falcon-ib-dialog-subtitle-line-height` | `1.5` |
| `--falcon-ib-dialog-subtitle-max-width` | `460px` |

### List card
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-list-bg` | `--color-falcon-neutral-30` |
| `--falcon-ib-dialog-list-border` | `1px solid --color-falcon-neutral-200` |
| `--falcon-ib-dialog-list-radius` | `12px` |
| `--falcon-ib-dialog-list-padding` | `14px` |
| `--falcon-ib-dialog-drag-label-color` | `--color-falcon-neutral-500` |
| `--falcon-ib-dialog-drag-label-font-size` | `12px` |

### Row pill — dimensions (Wave 15 user-requested configurable surface)
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-row-height` | `42px` |
| `--falcon-ib-dialog-row-min-width` | `280px` |
| `--falcon-ib-dialog-row-gap` | `10px` |
| `--falcon-ib-dialog-row-padding-inline` | `12px` |
| `--falcon-ib-dialog-row-padding-block` | `10px` |
| `--falcon-ib-dialog-row-radius` | `8px` |
| `--falcon-ib-dialog-row-bg` | `--color-falcon-neutral-0` (white) |
| `--falcon-ib-dialog-row-border` | `1px solid --color-falcon-neutral-200` |
| `--falcon-ib-dialog-row-hover-border` | `--color-falcon-teal-500` |
| `--falcon-ib-dialog-row-dragging-opacity` | `0.55` |
| `--falcon-ib-dialog-row-dragging-shadow` | `0 8px 20px -6px rgba(0,0,0,0.18)` |
| `--falcon-ib-dialog-row-rank-color` | `--color-falcon-neutral-500` |
| `--falcon-ib-dialog-row-rank-font-size` | `13px` |
| `--falcon-ib-dialog-row-rank-width` | `18px` |
| `--falcon-ib-dialog-row-label-color` | `--color-falcon-neutral-900` |
| `--falcon-ib-dialog-row-label-font-size` | `13px` |
| `--falcon-ib-dialog-row-label-font-weight` | `500` |
| `--falcon-ib-dialog-row-grip-color` | `--color-falcon-neutral-400` |
| `--falcon-ib-dialog-row-grip-size` | `14px` |
| `--falcon-ib-dialog-row-controls-gap` | `8px` |

### Reorder buttons
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-btn-size` | `22px` |
| `--falcon-ib-dialog-btn-radius` | `50%` |
| `--falcon-ib-dialog-btn-bg` | `--color-falcon-neutral-100` |
| `--falcon-ib-dialog-btn-fg` | `--color-falcon-neutral-600` |
| `--falcon-ib-dialog-btn-bg-hover` | `--color-falcon-teal-500` |
| `--falcon-ib-dialog-btn-fg-hover` | `--color-falcon-neutral-0` |
| `--falcon-ib-dialog-btn-disabled-opacity` | `0.4` |
| `--falcon-ib-dialog-btn-icon-size` | `12px` |
| `--falcon-ib-dialog-btn-icon-stroke` | `2` |

### Info pill ("first channel used automatically")
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-info-bg` | `--color-falcon-teal-50` |
| `--falcon-ib-dialog-info-fg` | `--color-falcon-teal-700` |
| `--falcon-ib-dialog-info-padding-block` | `10px` |
| `--falcon-ib-dialog-info-padding-inline` | `12px` |
| `--falcon-ib-dialog-info-radius` | `8px` |
| `--falcon-ib-dialog-info-margin-block-start` | `12px` |
| `--falcon-ib-dialog-info-font-size` | `12.5px` |
| `--falcon-ib-dialog-info-gap` | `8px` |
| `--falcon-ib-dialog-info-icon-size` | `14px` |

### Error banner
Same shape as info pill but with `--color-falcon-red-*` family.

### Footer buttons
| Token | Default |
| --- | --- |
| `--falcon-ib-dialog-footer-gap` | `10px` |
| `--falcon-ib-dialog-footer-margin-block-start` | `16px` |
| `--falcon-ib-dialog-footer-btn-padding-block` | `10px` |
| `--falcon-ib-dialog-footer-btn-padding-inline` | `18px` |
| `--falcon-ib-dialog-footer-btn-radius` | `8px` |
| `--falcon-ib-dialog-footer-btn-font-size` | `14px` |
| `--falcon-ib-dialog-footer-btn-font-weight` | `600` |
| `--falcon-ib-dialog-footer-btn-cancel-bg` | white |
| `--falcon-ib-dialog-footer-btn-cancel-fg` | `--color-falcon-neutral-700` |
| `--falcon-ib-dialog-footer-btn-cancel-border` | `--color-falcon-neutral-200` |
| `--falcon-ib-dialog-footer-btn-confirm-bg` | `--color-falcon-teal-700` |
| `--falcon-ib-dialog-footer-btn-confirm-fg` | white |
| `--falcon-ib-dialog-footer-btn-disabled-opacity` | `0.55` |

## Override patterns

### Global (per-app theme)
Override any token in the app's global theme entry — flows through `:where(...)` selector chain.

### Per-instance (inline style)
```html
<falcon-angular-insufficient-balance-dialog
  style="--falcon-ib-dialog-row-height: 56px; --falcon-ib-dialog-icon-color: #ff6b35"
  ... />
```

### Per-instance (class)
```css
.priority-dialog {
  --falcon-ib-dialog-row-height: 56px;
  --falcon-ib-dialog-row-min-width: 320px;
  --falcon-ib-dialog-icon-color: #ff6b35;
  --falcon-ib-dialog-footer-btn-confirm-bg: #ff6b35;
}
```

## Standing rules enforced

- ✅ `feedback_no_inline_styles_tokens_only.md` — every visual value via CSS custom property
- ✅ `feedback_shadow_is_token_ssot.md` — Shadow `.css` consumes tokens; Light/TW mirrors the same tokens via Tailwind arbitrary values
- ✅ `feedback_brain_skills_primeng_purge.md` — zero PrimeNG, no SCSS, Tailwind v4 utilities only on Light variant
- ✅ Canonical Pattern C7 — selector chain reaches Shadow + Light + Angular wrapper + utility class + data-attr
