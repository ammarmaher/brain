# falcon-tabs — TOKENS

## Token file
`libs/falcon-ui-tokens/src/components/tabs.tokens.css`

243 lines, 14 categories: container, tablist, tab (per state × per size), underline indicator, tab-icon, vertical orientation, radio-cards header, radio-cards body, radio-cards sub-radio, radio-cards sub-text, helper text, error text, panel, motion.

Token selector:
```css
:where(falcon-tabs, falcon-tabs-tw, falcon-angular-tabs, .falcon-tabs, [data-falcon-tabs])
```

## Related Falcon theme tokens
The tab tokens reference these theme primitives:

| Tab token | References |
|---|---|
| `--falcon-tabs-tablist-bg` | `var(--color-falcon-neutral-0)` |
| `--falcon-tabs-tablist-border-bottom-color` | `var(--color-falcon-neutral-150)` |
| `--falcon-tabs-tab-color` | `var(--color-falcon-neutral-500)` |
| `--falcon-tabs-tab-color-active` | `var(--color-falcon-neutral-900)` |
| `--falcon-tabs-indicator-color` | `var(--color-falcon-teal-500)` — brand teal |
| `--falcon-tabs-tab-focus-shadow` | `rgba(13,63,68,0.18) 0 0 0 3px` (teal alpha) |
| `--falcon-tabs-rc-card-bg-selected` | `var(--color-falcon-teal-option, #f1f6f6)` |
| `--falcon-tabs-rc-card-border-color-selected` | `var(--color-falcon-teal-500)` |
| `--falcon-tabs-rc-radio-border-color-selected` | `var(--color-falcon-teal-500)` |
| `--falcon-tabs-helper-color` | `var(--color-falcon-neutral-700)` |
| `--falcon-tabs-error-color` | `var(--color-falcon-red-500)` |

## Tailwind utility guidance
- Layout utilities on the host: `class="block border-b border-falcon-neutral-150 px-4"` is fine (the org-hierarchy menu uses this).
- Do NOT add inner color / padding utilities — they don't reach the Stencil tabs.
- Width clamp on the host with `class="w-full"` works for full-stretch tablist.

## Dark mode support
- All `--color-falcon-neutral-*` and `--color-falcon-teal-*` tokens flip per global dark theme.
- The radio-card selected bg uses `--color-falcon-teal-option` which has dark variant `#1e3a3a`.
- No tabs-specific dark-mode override needed; inheritance is sufficient.

## Density support
Density is via `size` prop (`sm` / `md` / `lg`). Token map:

| Token | sm | md | lg |
|---|---|---|---|
| tablist gap | 20px | 28px | 32px |
| tab padding-x | 4px | 4px | 6px |
| tab padding-y top | 12px | 18px | 22px |
| tab padding-y bottom | 10px | 16px | 20px |
| tab font-size | 12.5px | 14px | 15px |
| tab icon size | 14px | 16px | 18px |

## RTL support
- The Stencil source uses `ArrowLeft` / `ArrowRight` for horizontal navigation regardless of `dir`. Under RTL, the visual layout flips but the keyboard direction does NOT swap. This is consistent with WAI-ARIA APG guidance (keys map to the logical direction, not physical).
- Radio-cards header is `display: grid` — RTL-flips naturally.

## Static style risks
- Indicator transform is JS-set inline `style.transform: translateX(Npx)` / `width: Npx`. This is the documented escape hatch — required because token CSS can't express offsetLeft. Acceptable.
- Helper-text and error-text margin-top tokens are explicit, no hardcodes.

## No CSS / no SCSS guidance
- The wrapper's `falcon-tabs.component.css` exists as an Angular `styleUrl` placeholder. Keep it empty or near-empty.
- Token overrides go in tokens layer, not in component CSS.

## Token usage cheat-sheet

| Concern | Token |
|---|---|
| Border-bottom under tablist | `--falcon-tabs-tablist-border-bottom-color` (default neutral-150) |
| Indicator color | `--falcon-tabs-indicator-color` (default teal-500) |
| Indicator height | `--falcon-tabs-indicator-height: 2px` |
| Indicator slide duration | `--falcon-tabs-indicator-transition-duration: 220ms` |
| Active tab color | `--falcon-tabs-tab-color-active` |
| Active tab weight | `--falcon-tabs-tab-font-weight-active: 600` |
| Inactive tab color | `--falcon-tabs-tab-color` (neutral-500) |
| Disabled opacity | `--falcon-tabs-tab-disabled-opacity: 0.55` |
| Focus halo | `--falcon-tabs-tab-focus-shadow` |
| Radio-card selected bg | `--falcon-tabs-rc-card-bg-selected` (teal-option) |
| Radio-card selected border | `--falcon-tabs-rc-card-border-color-selected` (teal-500) |
| Radio-card "dot" trick | `--falcon-tabs-rc-radio-border-width-selected: 5px` |
| Helper text color | `--falcon-tabs-helper-color` |
| Error text color | `--falcon-tabs-error-color` |
| Panel padding (nav mode) | `--falcon-tabs-panel-padding-x` / `-padding-y` |
| Motion duration | `--falcon-tabs-transition-duration: 150ms` |

## Per-instance override
```css
.compact-tabs {
  --falcon-tabs-tab-padding-y-top-md: 10px;
  --falcon-tabs-tab-padding-y-bottom-md: 8px;
  --falcon-tabs-tablist-gap-md: 16px;
  --falcon-tabs-indicator-height: 3px;
}
```

```html
<falcon-angular-tabs class="compact-tabs" [tabs]="tabs" ... />
```
