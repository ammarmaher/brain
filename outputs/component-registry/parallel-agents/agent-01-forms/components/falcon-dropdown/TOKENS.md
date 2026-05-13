# falcon-dropdown — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/dropdown.tokens.css` — declares `--falcon-dropdown-*` tokens for the same 14 categories as `<falcon-input>` plus dropdown-specific extras (chevron, panel, listbox, option, search bar).

## Token-driven surface (categories)

1. CONTAINER / TRIGGER — width, min / max.
2. LABEL — color (idle + error), font, weight, margin, required marker.
3. SIZING — heights / paddings per `sm` / `md` / `lg`. Aliases `--falcon-density-input-*`.
4. TYPOGRAPHY — font-family / weight / line-height / letter-spacing.
5. BACKGROUND — trigger bg (idle/hover/focus/error/success/warning/disabled/readonly + filled / ghost appearance).
6. TEXT COLOR — value, placeholder, disabled.
7. BORDER — width, style, radius + colors by state.
8. SHADOW — by state including focus halo + error halo.
9. FOCUS RING — width, color, offset.
10. CHEVRON — color (default + hover), size, rotation transition.
11. PANEL — bg, border, radius, max-height, shadow, z-index.
12. LISTBOX OPTION — bg-idle / hover / selected / active / disabled, text color states.
13. SEARCH BAR — bg, border, font, gap, icon color, focus halo.
14. HELPER / ERROR TEXT — color, font-size, weight, line-height, margin.
15. CLEAR BUTTON — same as input.
16. MOTION — transition duration + easing, panel open/close timing.

## Related Falcon theme tokens

Same primitives as `<falcon-input>` plus:
- `--z-falcon-dropdown` (1000) for panel z-index.
- `--shadow-falcon-popover` for panel elevation.
- `--animate-menu-in` keyframe (Wave 9 menu primitive).

## Tailwind utility guidance

Pass extras via `wrapperClass` / `triggerClass` / `panelClass` / `optionClass`. Do NOT override colors with utilities — override tokens. Layout / responsive width is fine to express in utilities.

## Dark mode

Token-driven — `--falcon-dropdown-panel-bg` and other surface tokens read from neutrals which flip in dark mode. Brand teal focus ring stays constant.

## Density

Heights tied to `--falcon-density-input-height-*` aliases. Compact / comfortable preset flips ripple across input + dropdown identically.

## RTL

Chevron position auto-mirrors via flex layout. Search icon position respects `dir='rtl'`. Verify panel anchoring under RTL (panel attaches below trigger — should be unaffected).

## Static style risks

- `requestAnimationFrame` for search-focus is non-CSS; not a token risk.
- Inline SVG paths for chevron + clear + search icon are hardcoded in `falcon-dropdown.tsx`. Acceptable — icon shape is identity-level, not token-level.

## No CSS / no SCSS guidance

- Per-instance token overrides via host class + CSS file.
- Never set `style="..."` on the host or trigger.
- Never reach into Shadow DOM with `::part` styling unless tokens are insufficient (acceptable for new visual edges only).

## Token usage by state

| State | Tokens consumed |
|---|---|
| Idle | `--falcon-dropdown-bg`, `--falcon-dropdown-border-color`, `--falcon-dropdown-shadow` |
| Hover | `--falcon-dropdown-bg-hover`, `--falcon-dropdown-border-color-hover` |
| Focus | `--falcon-dropdown-bg-focus`, `--falcon-dropdown-border-color-focus`, `--falcon-dropdown-shadow-focus`, `--falcon-dropdown-ring-color-focus` |
| Error | `--falcon-dropdown-bg-error`, `--falcon-dropdown-border-color-error`, `--falcon-dropdown-shadow-error`, `--falcon-dropdown-ring-color-error` |
| Open | `--falcon-dropdown-panel-bg`, `--falcon-dropdown-panel-shadow`, `--falcon-dropdown-panel-border` |
| Option hover | `--falcon-dropdown-option-bg-hover`, `--falcon-dropdown-option-text-color-hover` |
| Option selected | `--falcon-dropdown-option-bg-selected`, `--falcon-dropdown-option-text-color-selected` |
| Disabled | `--falcon-dropdown-bg-disabled`, `--falcon-dropdown-text-color-disabled` |
