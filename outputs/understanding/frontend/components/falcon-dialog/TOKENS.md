# falcon-dialog — TOKENS

## Component token file
`libs/falcon-ui-tokens/src/components/dialog.tokens.css` (**243 lines** — recount 2026-06-03).

`[CODE]` Token selector (gate-12 compliant — scoped under `:where()`, NOT `:root`):
```css
:where(falcon-dialog, falcon-dialog-tw, falcon-angular-dialog, .falcon-dialog, [data-falcon-dialog])
```
`:where()` keeps specificity 0 so per-instance host-class overrides win. Both render paths consume the same tokens; the `-tw` Tailwind helper reads them via arbitrary-value utilities (`bg-[var(--falcon-dialog-panel-bg)]` etc., `[CODE]` dialog-tailwind-classes.ts).

## Token categories (14 declared)
1. CONTAINER — `--falcon-dialog-display: contents`.
2. BACKDROP — `bg` (`var(--color-falcon-teal-alpha-18, rgba(13,63,68,0.18))`), `blur` (4px), `opacity`. **Note:** on the migrated wrapper these are visually neutralised on the host (`[CODE]` falcon-dialog.component.css:29-31 sets them transparent/0) so the native `::backdrop` (`rgba(13,63,68,0.45)`, blur 2px — `[CODE]` falcon-dialog.component.css:56-61) supplies dim+blur instead. The Stencil-internal backdrop still receives click events.
3. PANEL (base) — `bg`, `color`, `border-{width,style,color}`, `border-radius` (18px), `shadow` (`0 24px 60px rgba(0,0,0,0.18)`), `padding-block` (28px), `padding-inline` (36px).
4. PANEL (sizes) — `max-width-{sm 420, md 560, lg 720, xl 880, full calc(100vw-32px)}`, `max-height` (`calc(100vh-80px)`), `min-width` (280), `mobile-max-width` (92vw).
5. HEADER — `padding-block/-inline`, `border-bottom-{width,color}`, `gap` (12px), `margin-bottom` (12px), `text-align` (center).
6. TITLE — `font-family/-size (20px)/-weight (700)/color/line-height`.
7. DESCRIPTION — `font-size (13px)/color/line-height/max-width (520px)`.
8. CLOSE BUTTON — `size (32px)`, `icon-size (16px)`, `color`, `color-hover`, `bg (transparent)`, `bg-hover`, `border-radius (8px)`, `top (18px)`, `end (22px)`.
9. BODY — `padding (0)`, `color`, `font-size (14px)`, `line-height`, `max-height (60vh)`.
10. FOOTER — `padding-block (12px)/-inline`, `gap (12px)`, `border-top-{width,color}`, `justify (flex-end)`, `margin-top (20px)`.
11. SEVERITY ACCENT — `strip-height (4px)` + per-severity `{info,success,warning,danger}-{color, title-color, icon-color, focus-ring-color}`. INFO=blue-500, SUCCESS=green-500/700, WARNING=**amber**-500/700 (palette is amber, not orange), DANGER=red-500/700. The four `*-focus-ring-color` values are raw `rgba()` literals with an inline `/*** … no SSOT token — accepted gap ***/` comment.
12. POSITION variants — `center-{align,justify}`, `top-{align, padding-top 80px}`, `side-right-{padding, width 480, height 100vh, radius}`, `side-right-enter-translate-x (100%)`.
13. FOCUS RING — `color` (`var(--color-falcon-teal-alpha-12)`), `width (3px)`.
14. Z-INDEX + STATE — `--falcon-dialog-z-index: 99999`, `disabled-opacity (0.6)`, `disabled-cursor`. **See "Z-index is fallback-only" below.**

## Severity cascade
`[CODE]` dialog.tokens.css:183-243 — `[data-component='falcon-dialog-panel'][data-severity='X']` (Light path), `falcon-dialog-tw[severity='X']` (Light host), and `falcon-dialog[severity='X']` (Shadow host) all remap the generic `--falcon-dialog-title-color` + `--falcon-dialog-focus-ring-color` to the severity-specific values. The cascade is the single source of truth; mutating a severity accent token updates strip + icon defaults automatically.

## Related Falcon theme tokens

| Dialog token | References |
|---|---|
| `--falcon-dialog-backdrop-bg` | `var(--color-falcon-teal-alpha-18, rgba(13, 63, 68, 0.18))` |
| `--falcon-dialog-panel-bg` | `var(--color-falcon-neutral-0, #ffffff)` |
| `--falcon-dialog-panel-color` | `var(--color-falcon-neutral-900, #1a1a1a)` |
| `--falcon-dialog-focus-ring-color` | `var(--color-falcon-teal-alpha-12, rgba(13,63,68,0.12))` |
| `--falcon-dialog-severity-{success,warning,danger}-color` | `var(--color-falcon-{green,amber,red}-500)` |
| `--falcon-dialog-title-font-family` | `var(--falcon-font-family)` |

## Z-index is fallback-only (Top Layer migration)
`[CODE]` dialog.tokens.css:158-178 — `--falcon-dialog-z-index: 99999` carries a long `@deprecated — Wave 8 (Phase D, 2026-05-21) — top-layer-migration` note: the native `<dialog>.showModal()` wrapper promotes the dialog into the **browser Top Layer** (above ALL z-index stacking), so this token is **irrelevant at runtime** for the migrated wrapper. It stays alive only because the un-migrated Stencil shadow-DOM cores still read it (`falcon-dialog.css:24,57`, `dialog-tailwind-classes.ts:21,59`) plus app `tailwind.css` fallbacks. The deletion plan lives in `[BRAIN-OUT]` understanding/frontend/overlay-architecture/DEAD-TOKENS.md. **NEW CODE MUST NOT depend on it for stacking** — `[CODE]` overlay.tokens.css:122-157 ESLint guard `tools/eslint-rules/no-overlay-zindex.js` flags new `z-[≥1000]`.

## Tailwind utility guidance
- Body slot content uses Tailwind freely (the contact-groups dialog uses `flex flex-col gap-4 p-4`).
- Don't add layout/geometry utilities to the dialog host — use `[size]` or token overrides.

## Dark mode support
- Neutrals invert (panel bg → dark surface) via the global `.app-dark` map.
- Teal-alpha backdrop recomputes; brand teal focus ring stays consistent.
- Panel shadow strengthens. Geometry (radius / padding / max-width) unchanged.
- Purely token-driven — no per-dialog dark override required.

## Density support
Via the `size` prop (no separate density alias). Panel max-width: sm 420 / md 560 / lg 720 / xl 880 / full `calc(100vw-32px)`; max-height `calc(100vh-80px)`.

## RTL support
Symmetric layout; backdrop dim/blur applies uniformly. Close × uses logical `end`/`top` offsets (`--falcon-dialog-close-end`) so it follows page direction. `position="side-right"` is **physical** (does not flip under RTL) — another reason to prefer drawer for side panels. Not verified end-to-end this audit (flag for theme/tokens agent).

## Static style risks
- `[CODE]` falcon-dialog.component.css:56-61 — the native `::backdrop` uses **literal** `rgba(13,63,68,0.45)` + `blur(2px)` (a deliberate Top-Layer-cascade override; the comment says it mirrors the Falcon dialog tokens). Acceptable but a literal, not a token reference (DRIFT-BACKDROP-LITERAL — `safe-local`).
- `[CODE]` dialog.tokens.css:117-135 — four `*-focus-ring-color` severity tokens are raw `rgba()` literals (self-documented "no SSOT token — accepted gap").
- `[CODE]` Both Stencil cores hardcode a `<svg>` for the close × (structural, not a paint risk).
- `[CODE]` dialog-tailwind-classes.ts:73-108 — `falconDialogPanelStyle` + `falconDialogSeverityStripStyle` write **inline `style` objects** on the `-tw` panel (transform/opacity for the open-state animation; the severity strip absolute positioning). These are token-referencing inline styles (`transform: translateY(var(--falcon-dialog-enter-translate-y))…`), acceptable for the animation hook.

## No CSS / no SCSS guidance
- Token file is the SSOT. Consumer per-instance overrides mutate `--falcon-dialog-*` via a host class + the consumer's CSS file. **Never hardcode hex/px inline.**
- Do not write component CSS rules in the consumer's `.component.css` to restyle the panel.

## Token usage by state

| Concern | Token(s) |
|---|---|
| Backdrop (host-neutralised; native `::backdrop` wins) | `--falcon-dialog-backdrop-bg`, `--falcon-dialog-backdrop-blur`, `--falcon-dialog-backdrop-opacity` |
| Panel surface | `--falcon-dialog-panel-bg`, `-color`, `-border-radius`, `-shadow`, `-padding-block`, `-padding-inline` |
| Panel size | `--falcon-dialog-panel-max-width-{sm,md,lg,xl,full}`, `-max-height`, `-min-width` |
| Header / title / description | `--falcon-dialog-header-*`, `-title-*`, `-description-*` |
| Close button | `--falcon-dialog-close-{size,icon-size,color,color-hover,bg,bg-hover,border-radius,top,end}` |
| Body | `--falcon-dialog-body-{padding,color,font-size,line-height,max-height}` |
| Footer | `--falcon-dialog-footer-{padding-block,padding-inline,gap,border-top-width,border-top-color,justify,margin-top}` |
| Severity | `--falcon-dialog-severity-{info,success,warning,danger}-{color,title-color,icon-color,focus-ring-color}`, `-strip-height` |
| Position | `--falcon-dialog-{center,top,side-right}-*` |
| Focus | `--falcon-dialog-focus-ring-color`, `-focus-ring-width` |
| Motion | `--falcon-dialog-transition-duration (220ms)`, `-transition-easing`, `-enter-translate-y (8px)`, `-enter-scale (0.98)` |
| Z-index (fallback only) | `--falcon-dialog-z-index (99999)` |
| Disabled | `--falcon-dialog-disabled-opacity`, `-disabled-cursor` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) — token file recounted at 243 lines, 14 categories + severity cascade confirmed, z-index demoted to fallback (Top-Layer `@deprecated` note quoted), native `::backdrop` literal + 4 severity-ring literals flagged. Tailwind helper token-references confirmed in dialog-tailwind-classes.ts.
