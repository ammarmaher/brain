# falcon-combobox — TOKENS

> Sweep-refreshed 2026-06-03 (B04). Verified category list against live `combobox.tokens.css`; noted the dead helper/error tokens (declared but never rendered) and the gate-12 scope (no `.falcon-overlay-container` — correctly, the panel is NOT body-portaled).

## Component token file

`[CODE]` `libs/falcon-ui-tokens/src/components/combobox.tokens.css` (152 lines), scoped to:
```css
:where(falcon-combobox, falcon-combobox-tw, falcon-angular-combobox, .falcon-combobox, [data-falcon-combobox])
```

### gate-12 note (PASS — no overlay-container needed)

`[CODE]` Unlike `dropdown.tokens.css`, this selector does **NOT** include `.falcon-overlay-container`, and that is **correct**: the combobox panel renders **inline** in the light DOM (`falcon-combobox.tsx:276` / `-tw.tsx:260`) and is promoted to the Top Layer via the native Popover API in place (the wrapper's MutationObserver) — it is NOT re-parented into the body overlay container. So `--falcon-combobox-*` already cascade to the inline panel. No gate-12 portaled-panel trap here. The contract sits on the component `:where()` (off `:root`) — gate-12 compliant.

## Token categories (12 declared + HELPER/ERROR + SCROLLBAR)

`[CODE]` Header `combobox.tokens.css:6-20`:

1. CONTAINER — `width / min-width / max-width`.
2. LABEL — color, color-error, font family/size/weight/line-height, margin-bottom (4px), required-color.
3. SIZING — per `sm`/`md`/`lg`: height (→ `--falcon-density-input-height-*`), padding-x (→ density), padding-y, font-size; plus `padding-end: 52px` (reserves clear + spinner room).
4. TYPOGRAPHY — font-weight, line-height, font-family.
5. BACKGROUND — by state: default / hover / focus / disabled (NO error/success/warning bg — the combobox has no `state`).
6. TEXT COLOR — text / text-disabled / placeholder.
7. BORDER — width / style / radius (→ `--falcon-radius-md`) + color: default / hover / focus / disabled.
8. SHADOW — `none` + focus halo (`rgba(13,63,68,0.08) 0 0 0 3px`).
9. PANEL — bg, border-{width,color}, radius (10px), shadow (0 8px 24px rgba(0,0,0,0.08)), padding (4px), max-height (240px), min-width (100%), z-index (100), offset (4px).
10. OPTION — padding-{x,y}, radius (7px), font-size (12.5px), color/-disabled/-selected, bg/-hover/-active/-selected, font-weight-selected; plus EMPTY (no-matches) color/font/padding + SCROLLBAR width/thumb.
11. CLEAR BUTTON — size (18px), color, color-hover, bg, bg-hover.
12. MOTION — transition-duration (150ms), easing (ease), panel-transition-duration (120ms).

`[CODE]` **HELPER / ERROR TEXT tokens** (`:140-151`) are declared (`--falcon-combobox-helper-*`, `--falcon-combobox-error-*`) **but never consumed** — neither Stencil component renders a helper or error element. These are **dead tokens** until G1/G2 lands (minor; safe-local).

> No `--falcon-combobox-ring-*` focus-ring tokens exist (the focus look is the shadow halo only) — the prior dossier's `ring-color-focus` / `ring-width` rows were inaccurate. No `--falcon-combobox-chevron-*` tokens (the combobox has no chevron — it is a text input, not a button-trigger). No dedicated `--falcon-combobox-spinner-*` token — the `-tw` spinner uses inline arbitrary classes reading `--color-falcon-neutral-200` / `--color-falcon-teal-500` (`-tw.tsx:240`).

## Related Falcon theme tokens

| Theme token | Used by combobox via |
|---|---|
| `--color-falcon-neutral-0..900` | bg / border / text / disabled / scrollbar. |
| `--color-falcon-teal-500` | focus border + `-tw` spinner top-arc. |
| `--color-falcon-teal-option (#f1f6f6)` | option hover/active bg. |
| `--color-falcon-teal-alpha-04` | selected-option bg. |
| `--color-falcon-neutral-200` | `-tw` spinner ring. |
| `--falcon-density-input-height-{sm,md,lg}` + `padding-x-*` | sizing. |
| `--falcon-radius-md` | border radius. |
| `--font-display` / `--falcon-font-family` | label + body font. |

## Tailwind utility guidance

`[CODE]` `combobox-tailwind-classes.ts` builds every class from `--falcon-combobox-*` via arbitrary-value utilities. Pass per-instance extras via `wrapperClass`/`inputClass`/`panelClass`/`optionClass`/`labelClass` (Tailwind path only). Layout/responsive via host `class=`.

## Dark mode support

Token-driven via the `:where(.app-dark, ...)` neutral inversions. Brand teal focus halo + spinner stay constant. Not re-verified end-to-end — flag for Agent 5.

## Density support

`[CODE]` Heights → `--falcon-density-input-height-{sm,md,lg}`, padding-x → density tokens. Per-field compaction via a host class mutating `--falcon-combobox-height-md`.

## RTL support

`[CODE]` The `-tw` trailing icon zone uses `end-2` (`-tw.tsx:237`), panel uses `start-0` (`combobox-tailwind-classes.ts:84`), padding `ps-[...]` — logical properties. The Top-Layer acquire path even neutralizes the UA popover stylesheet direction-aware (LTR vs RTL physical-end, `.component.ts:239-246`). Not re-verified end-to-end — flag for Agent 5.

## Static style risks

- `[CODE]` The `-tw` spinner span (`-tw.tsx:240`) carries arbitrary Tailwind classes with literal `#e5e7eb` / `#124c52` fallbacks inside `var(...)` — token-first with literal fallbacks (acceptable; safe-local).
- `[CODE]` Inline SVG paths for the clear-X are hardcoded in both `.tsx` (identity-level, acceptable).
- No `.component.css` exists for the combobox wrapper, and the `-tw` Stencil has no `styleUrl` — no separate CSS file to audit for hardcoded px (only the Shadow `falcon-combobox.css`, not read in this pass).

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Idle | `--falcon-combobox-bg`, `-border-color`, `-text-color` |
| Hover | `-bg-hover`, `-border-color-hover` |
| Focus | `-border-color-focus`, `-shadow-focus` |
| Panel open | `-panel-bg`, `-panel-shadow`, `-panel-border-{color,radius}`, `-panel-max-height (240px)`, `-panel-z-index (100)` |
| Option hover/active | `-option-bg-hover`, `-option-bg-active` |
| Option selected | `-option-bg-selected`, `-option-color-selected`, `-option-font-weight-selected` |
| Loading | _No token_ — `-tw` spinner uses arbitrary classes; Shadow uses `.falcon-combobox-spinner` CSS. |
| No matches | `-empty-color`, `-empty-font-size`, `-empty-padding-*` |
| Disabled | `-bg-disabled`, `-text-color-disabled` |
| Error/helper | _Tokens declared but UNUSED_ (no error/helper element rendered) — dead tokens. |

## Verification
🟢 code-verified against `combobox.tokens.css` + `combobox-tailwind-classes.ts` + both `.tsx` (read 2026-06-03). Dead helper/error tokens + no-portal gate-12 status 🟢 code-verified. Dark mode / RTL 🟡 token-derived, not runtime-verified.
