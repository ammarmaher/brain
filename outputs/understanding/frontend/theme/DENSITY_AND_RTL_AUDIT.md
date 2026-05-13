*** Density and RTL audit ***
*** Source: `libs/falcon-ui-tokens/src/density/{comfortable,compact}.css` + `rtl/rtl.css` ***
*** Verified against active source at 2026-05-13 ***

# Density and RTL audit

## Density

### Layer order

```
libs/falcon-ui-tokens/src/index.css:
  @import './density/comfortable.css';   /* line 16 */
  @import './density/compact.css';        /* line 17 */
```

Comfortable is declared FIRST so it fires on `:root` (default) AND on `[data-density='comfortable']`. Compact is declared SECOND, fires ONLY on `[data-density='compact']`. Cascade ensures compact overrides comfortable when the attribute is set.

### Triggers

- **Default (`:root`)** → comfortable density (auto-applied to every page).
- **`[data-density='comfortable']`** → explicit comfortable density.
- **`[data-density='compact']`** → tighter density.

Attribute can be set on `<html>`, `<body>`, or any ancestor. Density cascades down to all descendants.

### Tokens declared per density file

Both files declare the same set of `--falcon-density-*` tokens (with different values), THEN resolve `--falcon-{component}-*` from those density tokens.

| TOKEN (density) | COMFORTABLE | COMPACT |
|---|---|---|
| `--falcon-density-input-height-sm` | 32 px | 28 px |
| `--falcon-density-input-height-md` | 40 px | 34 px |
| `--falcon-density-input-height-lg` | 48 px | 40 px |
| `--falcon-density-input-padding-x-sm` | `--falcon-spacing-2` (8 px) | `--falcon-spacing-1` (4 px) |
| `--falcon-density-input-padding-x-md` | `--falcon-spacing-3` (12 px) | `--falcon-spacing-2` (8 px) |
| `--falcon-density-input-padding-x-lg` | `--falcon-spacing-4` (16 px) | `--falcon-spacing-3` (12 px) |
| `--falcon-density-input-padding-y-sm` | 6 px | 4 px |
| `--falcon-density-input-padding-y-md` | 10 px | 6 px |
| `--falcon-density-input-padding-y-lg` | 12 px | 8 px |
| `--falcon-density-button-height-sm` | 34 px | 28 px |
| `--falcon-density-button-height-md` | 38 px | 32 px |
| `--falcon-density-button-height-lg` | 44 px | 36 px |
| `--falcon-density-button-padding-x-sm` | 18 px | 12 px |
| `--falcon-density-button-padding-x-md` | 16 px | 14 px |
| `--falcon-density-button-padding-x-lg` | 20 px | 16 px |
| `--falcon-density-button-padding-y-sm` | 6 px | 4 px |
| `--falcon-density-button-padding-y-md` | 8 px | 5 px |
| `--falcon-density-button-padding-y-lg` | 10 px | 7 px |
| `--falcon-density-dropdown-height-sm` | 32 px | 28 px |
| `--falcon-density-dropdown-height-md` | 40 px | 34 px |
| `--falcon-density-dropdown-height-lg` | 48 px | 40 px |
| `--falcon-density-menu-item-min-height` | 32 px | 26 px |
| `--falcon-density-menu-item-padding-y` | 8 px | 5 px |
| `--falcon-density-table-row-height` | 44 px | 34 px |
| `--falcon-density-table-cell-padding-y` | 10 px | 6 px |
| `--falcon-density-table-cell-padding-x` | 14 px | 10 px |

### Component-token resolution

Both files then resolve density tokens INTO component-level tokens:

```css
--falcon-input-height-sm: var(--falcon-density-input-height-sm);
--falcon-input-height-md: var(--falcon-density-input-height-md);
--falcon-input-height-lg: var(--falcon-density-input-height-lg);
...
--falcon-button-height-sm: var(--falcon-density-button-height-sm);
...
--falcon-menu-item-min-height: var(--falcon-density-menu-item-min-height);
--falcon-menu-item-padding-y: var(--falcon-density-menu-item-padding-y);
```

So when `[data-density='compact']` is set, the density tokens swap to compact values, which immediately propagate to every component reading `--falcon-input-height-md` etc.

### Density-aware components (verified)

- **Input** — heights + paddings respond.
- **Button** — heights + paddings respond.
- **Dropdown** — heights respond.
- **Menu** — item-min-height + padding-y respond.

### Components NOT directly resolved in density CSS but density-token-aware

- **Combobox** — reads from `--falcon-density-input-*` indirectly via `combobox.tokens.css`. Same heights as input/dropdown.
- **Multi-select** — same indirect path.
- **Textarea** — partial; reads from `--falcon-density-input-padding-*` but height is rows-driven not height-driven.

### Components that do NOT respond to density

- **Icon, avatar, badge, tag, status-badge** — sized by their own `--falcon-{component}-size` tokens, not density.
- **Tree** — uses its own `--spacing-row-*` tokens (SSOT layout primitives), not density.
- **Card** — padding is variant-keyed (`padding=sm|md|lg`), not density-keyed.
- **Calendar** — uses its own grid sizing.
- **Tabs, accordion, dialog, drawer, toast** — geometric components with their own size tokens.

### Density runtime switching

**Today**: NO Angular service writes `data-density` at runtime. The `PrimeNGThemeService` (name vestige) only manages `app-dark` class for theme. Density remains at the default (`comfortable`) for all sessions.

**Latent capability**: Adding `setDensity('comfortable' | 'compact')` to the theme service would let users toggle density on demand. The cascade already supports it. See UPGRADE_CANDIDATES UP-16.

### Density gaps

1. **Limited coverage** — only 4 components (input, button, dropdown, menu — plus indirect coverage for combobox, multi-select, textarea, table). Other components (card, dialog, drawer, etc.) have their own size variants and would need separate density mappings if compact is ever surfaced UI-side.
2. **No documentation** — the density layer is not referenced anywhere in `apps/`. Brain SK should surface it for future use.
3. **No runtime control** — see UP-16.

---

## RTL (Right-to-Left)

### Layer order

```
libs/falcon-ui-tokens/src/index.css:
  @import './rtl/rtl.css';   /* line 19 */
```

Single file — 26 lines — at the END of the imports (after density, before components). Cascade-late so it can override anything declared earlier.

### Trigger

```css
[dir='rtl'] { ... }
```

The Angular `RtlService` (or equivalent) writes `<html dir="rtl">` based on language selection. All descendants inherit the direction.

### What RTL flips explicitly

| TOKEN | LTR VALUE | RTL VALUE | REASON |
|---|---|---|---|
| `--shadow-falcon-drawer` | `-8px 0 12px -8px rgba(0, 0, 0, 0.06)` | `8px 0 12px -8px rgba(0, 0, 0, 0.06)` | Drawer shadow casts opposite direction in RTL |
| `--shadow-falcon-sticky-edge` | `-8px 0 8px -6px rgba(13, 63, 68, 0.08)` | `8px 0 8px -6px rgba(13, 63, 68, 0.08)` | Sticky-edge shadow flips |
| `--falcon-toast-slide-distance` | (default — implied `-12px` per `falcon-slide` keyframe) | `-12px` (explicit) | Toast slide enters from opposite side |
| `--falcon-dialog-side-right-enter-translate-x` | (default `100%`) | `-100%` | Side-right dialog enters from the LEFT in RTL |

**Total**: 4 token overrides.

### What RTL handles automatically (no token override needed)

Per the `rtl/rtl.css` comments + code:

1. **Logical CSS properties** — `padding-inline-*`, `margin-inline-*`, `inset-inline-*`, `border-inline-*` auto-flip. Every Falcon component uses `padding-inline-end` instead of `padding-right` etc. So the CSS itself adapts.
2. **Input/dropdown chevron** — uses `inset-inline-end` in Stencil shadow CSS; auto-flips.
3. **Menu panel offset direction** — handled by floating-UI library's anchor logic; library knows direction.
4. **Tree rail gradient** — line is center-aligned (`linear-gradient(to right, transparent calc(50% - 0.5px), ...)`); doesn't need to flip.

### RTL gaps

1. **`--falcon-toast-slide-distance: -12px`** in RTL — but the LTR `falcon-slide` keyframe at SSOT lines 471-474 has `translateX(-12px)`. If RTL sets the token to `-12px` ALSO, then the slide enters from the LEFT in both directions. Looks like a typo. Should be `+12px` in RTL so the toast slides in from the right (which is the leading edge in RTL).
2. **Falcon icon font glyphs**: some icons are direction-sensitive (chevrons, arrows). The icon font CSS (`falcon-icons.css`) does not mirror per-glyph. If an arrow points LEFT in LTR, it still points LEFT in RTL — visually wrong. Workaround: components that render direction-sensitive icons should `transform: scaleX(-1)` under `[dir='rtl']`. Not currently centralized.
3. **Tailwind v4 logical-property utilities**: `ps-*`, `pe-*`, `me-*`, `ms-*`, `start-*`, `end-*` are available. Templates should prefer these over `pl-*`/`pr-*`/`ml-*`/`mr-*`/`left-*`/`right-*` for RTL safety. Audit current templates — `apps/*/src/app/**/*.html` — for non-logical utilities. Out of scope for Agent 5.

---

## RTL support level summary

| ASPECT | SUPPORTED? | NOTES |
|---|---|---|
| Logical CSS properties (`padding-inline-*` etc.) | YES | Universal across Stencil + Angular templates |
| Drawer shadow flip | YES | Explicit token override |
| Toast slide direction | PARTIAL | Suspected typo (`-12px` vs `+12px`) — UP-X candidate |
| Dialog side-right flip | YES | Explicit token override |
| Sticky-edge shadow | YES | Explicit token override |
| Chevron position | YES (auto via inset-inline-end) | |
| Menu floating anchor | YES (via floating-ui) | |
| Icon glyph mirroring | NO | Direction-sensitive icons stay in LTR orientation |
| Type direction | YES (automatic via `[dir='rtl']`) | |

---

## Recommendations

1. **UP-16 — Wire `setDensity()` into the theme service.** Today the cascade supports compact density but there's no Angular service to expose it. Adding the toggle is low-risk and unlocks a frequently-requested capability.
2. **Audit RTL toast slide-distance** — confirm `-12px` is correct or should be `+12px`. Flag for verification.
3. **Centralize direction-sensitive icon mirroring** — a single `[dir='rtl'] .falcon-icon[data-direction-sensitive='true'] { transform: scaleX(-1) }` rule in `rtl.css` would handle chevrons/arrows uniformly. Need to add `data-direction-sensitive="true"` to applicable icons in templates.
4. **Density coverage expansion** — extend density mappings to card padding + dialog padding + drawer padding for true compact-mode density across the platform.

---

## Cross-references

- See `THEME_SSOT_AUDIT.md` for the SSOT token families that density and RTL build on.
- See `TOKEN_FLOW_REPORT.md` for the full cascade resolution including density and RTL layers.
- See `UPGRADE_CANDIDATES.md` UP-16 (density runtime toggle) and the RTL typo verification.
