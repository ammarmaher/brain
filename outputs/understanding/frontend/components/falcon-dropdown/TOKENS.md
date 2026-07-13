# falcon-dropdown — TOKENS

> Sweep-refreshed 2026-06-03 (B04). Corrected vs prior dossier: panel z-index is `--falcon-dropdown-panel-z-index: 100` (NOT `--z-falcon-dropdown:1000`); there is no `--shadow-falcon-popover`/`--animate-menu-in` in this token file. Added the gate-12 portaled-panel scope detail.

## Component token file

`[CODE]` `libs/falcon-ui-tokens/src/components/dropdown.tokens.css` (297 lines).

Two rule blocks:
1. `[CODE]` `:51-56` — bare `falcon-dropdown-tw { display:block; width/min/max }` host-layout guarantee (Wave 2A). Light-DOM `shadow:false` hosts default to `display:inline`, which collapsed the disabled-state box width; asserting `display:block` on the CE fixes it at the root. Mirrors the Shadow `:host{display:block}` rule and the wrapper's `.component.css`.
2. `[CODE]` `:66-73` — the token contract scoped to:
   ```css
   :where(falcon-dropdown, falcon-dropdown-tw, falcon-angular-dropdown,
          .falcon-dropdown, [data-falcon-dropdown], .falcon-overlay-container)
   ```

### gate-12 portaled-panel trap (KEY)

`[CODE]` `dropdown.tokens.css:58-65` documents the **gate-12 rescope (2026-06-02)**: the contract was moved OFF `:root` (where the 2026-05-15 portal-popovers wave had promoted it — ~3,500 vars on `:root` freeze Chrome DevTools) back onto the component `:where()`. **`.falcon-overlay-container` MUST stay in the selector list** because `<falcon-dropdown-tw>` body-portals its panel into that container (`[CODE]` `popover-portal.ts portalToOverlay` / `ensurePortaled`, invoked from `falcon-dropdown-tw.tsx:235,244`). Drop the container and the portaled panel renders unstyled (no `--falcon-dropdown-*`). The plain component tags cover the inline (non-portaled) trigger + the Shadow path's inline panel. `[MEMORY]` matches `reference_gate12_component_token_scope_portal_2026_06_02` (dropdown is one of the 4 portaled-popover token files that MUST include `.falcon-overlay-container`).

## Token categories (14 + PANEL/OPTION/SCROLLBAR)

`[CODE]` Header `dropdown.tokens.css:16-33`:

1. CONTAINER — `width / min-width / max-width`.
2. LABEL — color, color-error, font family/size/weight/line-height, margin-bottom, cursor, required-color. (Mirrors `<falcon-input>` label tokens 1:1.)
3. SIZING — per `sm`/`md`/`lg`: height (→ `--falcon-density-input-height-*`), padding-x (→ density), padding-y, font-size; plus `padding-end-chevron: 32px`.
4. TYPOGRAPHY — font-weight, line-height, letter-spacing.
5. BACKGROUND — by state: default / hover / focus / error / success / warning / disabled / readonly; plus Wave 9.C appearance fallbacks `bg-filled`, `bg-filled-hover`, `bg-filled-focus`, `bg-ghost-hover`.
6. TEXT COLOR — text / text-disabled / placeholder.
7. BORDER — width / style / radius (→ `--falcon-radius-md`) + color by 8 states.
8. SHADOW — by state: idle `none`, focus halo (`rgba(13,63,68,0.08) 0 0 0 3px`), error micro-drop, etc.
9. FOCUS RING — ring-width (3px), ring-color-focus / ring-color-error, ring-offset.
10. CHEVRON + SEARCH — chevron size/color/end(10px)/rotation-open(180deg)/transition(180ms); search height (36px)/padding/icon/bg/border/radius/font/margin.
11. HELPER TEXT — color, font-size, weight, margin-top, padding-x.
12. ERROR TEXT — color, font-size (xxs/11px), weight (medium), line-height (1.2), margin-top, padding-x.
13. CLEAR / TRIGGER — clear button size (18px), color, color-hover, bg, bg-hover, radius (full).
14. MOTION — transition-duration (150ms), easing (ease), panel-transition-duration (120ms).

**PANEL** (popup): `panel-bg`, `panel-border-{width,color}`, `panel-border-radius (10px)`, `panel-shadow (0 8px 24px rgba(0,0,0,0.08))`, `panel-padding (4px)`, `panel-max-height (240px)`, `panel-min-width (100%)`, `panel-z-index (100)`, `panel-offset (4px)`.
**OPTION** (item): `option-padding-{x,y}`, `option-radius (7px)`, `option-font-size (12.5px)`, `option-color`/`-disabled`/`-selected`, `option-bg`/`-hover`/`-active`/`-selected`, `option-font-weight-selected`.
**SCROLLBAR / EMPTY**: scrollbar width/thumb/thumb-hover; empty color/font/padding.
**Icon slot**: `--falcon-dropdown-icon-left-color: var(--falcon-input-icon-color)` (defers to the input token).

## Related Falcon theme tokens

| Theme token | Used by dropdown via |
|---|---|
| `--color-falcon-neutral-0..950` | bg / border / text / disabled / readonly / scrollbar. |
| `--color-falcon-teal-500` | focus border (brand). |
| `--color-falcon-teal-alpha-12` | focus ring color. |
| `--color-falcon-teal-option (#f1f6f6)` | option hover/active bg. |
| `--color-falcon-teal-alpha-04` | selected-option bg. |
| `--color-falcon-red-50 / 500 / 100` | error bg / border-text / error ring. |
| `--color-falcon-green-500` | success border. |
| `--color-falcon-amber-500` | warning border. |
| `--falcon-density-input-height-{sm,md,lg}` + `padding-x-*` | sizing. |
| `--falcon-radius-md` / `--falcon-radius-full` | border radius / clear-button radius. |
| `--falcon-spacing-1 / -2` | helper/error margins + padding. |
| `--font-display` / `--falcon-font-family` | label font. |

## Tailwind utility guidance

`[CODE]` `dropdown-tailwind-classes.ts` returns class strings built entirely from `--falcon-dropdown-*` via arbitrary-value utilities (`h-[length:var(...)]`, `bg-[var(...)]`, etc.). It additionally encodes **variant + appearance overlays** (`falconDropdownVariantClasses` / `falconDropdownAppearanceClasses`, `.ts:29-48`) that the Shadow path expresses through `:host([variant])` / `:host([appearance])` CSS instead. Consumers should override TOKENS, not hand-roll color/radius/shadow utilities. Pass extras via `wrapperClass`/`triggerClass`/`panelClass`/`optionClass`/`labelClass` (Tailwind path only).

Host-side layout additions: `<falcon-angular-dropdown class="w-full max-w-xs" ... />`.

## Dark mode support

Inherits the `:where(.app-dark, .app-dark *)` neutral inversions from `falcon-tailwind-tokens.css`. Brand teal (focus ring / option-selected) stays constant; geometry unchanged. No per-dropdown dark override required — purely token-driven. (Not re-verified end-to-end in this audit — flag for Agent 5.)

## Density support

`[CODE]` Heights map to `--falcon-density-input-height-{sm,md,lg}`, padding-x to `--falcon-density-input-padding-x-{sm,md,lg}` — density presets ripple through input + dropdown identically. Per-field compaction:
```css
.compact-dropdown { --falcon-dropdown-height-md: var(--falcon-density-input-height-sm); }
```

## RTL support

`[CODE]` Both render paths use logical properties: the `-tw` icon uses `start-2.5` (`falcon-dropdown-tw.tsx:494`), trigger padding `ps-[...]`, panel `start-0`. Native direction follows page `dir`. Chevron sits at the end edge via the token. Not re-verified end-to-end — flag for Agent 5 (theme/tokens).

## Static style risks

- `[CODE]` The `-tw` `iconLeft` span carries an **inline `style={{ color: 'var(--falcon-dropdown-icon-left-color, var(--falcon-input-icon-color, #6b7280))' }}`** (`falcon-dropdown-tw.tsx:495`). Token-based with a trailing literal `#6b7280` fallback — acceptable but a hardcoded literal lives in the component (minor; safe-local).
- The Shadow CSS file `falcon-dropdown.css` was not read in this pass; if it hardcodes hex/px outside the token contract, flag separately (not asserted here).
- `falcon-dropdown.component.css` is `display:block; width:100%` only — no static risk.
- Inline SVG paths for chevron/clear/search are hardcoded in both `.tsx` files — acceptable (icon shape is identity-level, not token-level).

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Idle | `--falcon-dropdown-bg`, `-border-color`, `-shadow` |
| Hover | `-bg-hover`, `-border-color-hover`, `-shadow-hover` |
| Focus | `-bg-focus`, `-border-color-focus`, `-shadow-focus`, `-ring-color-focus`, `-ring-width`, `-ring-offset` |
| Error | `-bg-error`, `-border-color-error`, `-shadow-error`, `-ring-color-error`, `-error-color`, `-label-color-error` |
| Open (panel) | `-panel-bg`, `-panel-shadow`, `-panel-border-{width,color,radius}`, `-panel-max-height (240px)`, `-panel-z-index (100)`, `-chevron-rotation-open (180deg)` |
| Option hover/active | `-option-bg-hover`, `-option-bg-active` |
| Option selected | `-option-bg-selected`, `-option-color-selected`, `-option-font-weight-selected` |
| Disabled | `-bg-disabled`, `-border-color-disabled`, `-shadow-disabled`, `-text-color-disabled`, `-chevron-color-disabled` |
| Loading | _No token._ `loading` adds a host class + `aria-busy` only; no token-driven spinner on the dropdown (contrast the combobox spinner). |

## Verification
🟢 code-verified against `dropdown.tokens.css` + `dropdown-tailwind-classes.ts` (read 2026-06-03). gate-12 portaled-panel scope 🟢 code-verified + `[MEMORY]` corroborated. Dark mode / RTL 🟡 token-derived, not runtime-verified.
