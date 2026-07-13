# falcon-loader-overlay — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/loader-overlay.tokens.css` (~271 lines).

The selector

```css
:where(
  falcon-loader-overlay,
  falcon-loader-overlay-tw,
  falcon-angular-loader-overlay,
  .falcon-loader-overlay,
  [data-falcon-loader-overlay]
) { … }
```

ensures Shadow + Light + Angular host + utility-class + data-attr consumers ALL read the same `--falcon-loader-overlay-*` variables (doctrine C7). **Gate-12 compliant** — the block is scoped under `:where(...)`, NOT `:root` (`[CODE]` loader-overlay.tokens.css:34-40).

## Token categories (19 declared)

1. **HOST / Z-INDEX / VISIBILITY** — `z-index: 100002` (top of the unified z-ladder rev 3: drawer 99999 < portaled popovers 100000 < toast 100001 < **loader 100002**), `position: fixed`, `inset: 0`, transition duration/easing, `foreground` text colour.
2. **STAGE BACKGROUND** — `bg` (default `linear-gradient(135deg,#0a2f33,#15803d)`), `bg-color`, `bg-grad-from/to/angle`, `bg-radial-color`, `bg-blur`.
3. **STAGE OVERLAYS** — vignette (color/opacity/start), noise opacity, grid (color/size), scanlines (color/gap).
4. **DROP TINT** — color, opacity, blend.
5. **ANIMATED BACKGROUND** — color-a/b/c, duration, direction, blur.
6. **PATTERN OVERLAY** — color, opacity, scale, angle.
7. **STARS** — color, size, twinkle-duration.
8. **WAVES** — color, amp, duration, opacity.
9. **RIPPLES** — color, duration.
10. **SPOTLIGHT** — color, size, opacity, x, y.
11. **HALO** — color, size, intensity, pulse-duration.
12. **ORBIT RING** — color, width, size, duration, opacity.
13. **BUBBLES** — color, min/max-size, duration, opacity, blur.
14. **SPARKLES** — color, duration, size.
15. **LOGO** — size, color, grad-from/to, opacity.
16. **LOGO MOTION** — anim-duration, anim-easing, anim-delay, from-x/y, to-x/y (drift vectors).
17. **PROGRESS BAR** — color, track-bg, width, height, radius, glow-blur, indeterminate-duration.
18. **CAPTION + SUB-CAPTION + DOTS** — caption color/size/weight/letter-spacing/line-height; subcaption color/size/weight; dots size/gap/duration.
19. **SKELETON ROWS** — row height/radius/gap, shimmer-from/via, duration.

> The token file declares **~130 custom properties** across these 19 groups — a near-1:1 mirror of the `FalconLoaderOverlayCfg` JSON keys, so a Studio token-runtime edit and a JSON-config edit hit the same visual axes.

## Token-vs-config precedence (important)

Tokens are **defaults**; the JSON `config` **wins**. Both render paths read `config`, derive inline `style={{ '--falcon-loader-overlay-*': … }}` per element, and those inline vars override the `loader-overlay.tokens.css` defaults for that instance (`[CODE]` falcon-loader-overlay.tsx:336-343,503-507 / falcon-loader-overlay-tw.tsx:1105-1115). Conversely, **geometry/containment** tokens (`position`, `z-index`, `inset`, `transition-*`) are read directly off the cascade by the `-tw` host (`[CODE]` falcon-loader-overlay-tw.tsx:1106-1112) and are the correct override surface for "contain me in a card" (see USAGE Example 1).

## Related Falcon theme tokens

| Falcon theme token | Used by loader-overlay via |
|---|---|
| `--color-falcon-neutral-0` | `--falcon-loader-overlay-foreground` (caption/dots default text). |
| _(brand teals/greens are baked as raw hex in the token defaults — see Static style risks)_ | Stage gradient + halo + ring defaults. |

> **Notable:** unlike `input.tokens.css` (which references `--color-falcon-*` for nearly every value), `loader-overlay.tokens.css` hardcodes most brand colours as **raw hex** (`#0a2f33`, `#15803d`, `#a16207`, `#ffffff`, `rgba(255,255,255,…)`) rather than `--color-falcon-*` aliases. This is partly intentional (the Studio JSON ships explicit hex per the React SoT), but it means the loader does NOT auto-follow palette/theme changes the way the input does. **See Static style risks + GAPS G5.**

## Tailwind utility guidance for this component

There is **no `*-tailwind-classes.ts` helper** for this component (contrast with `input-tailwind-classes.ts` / `badge-tailwind-classes.ts`). The `-tw` twin applies Tailwind utilities **only for layout** (`absolute inset-0 pointer-events-none`, `flex`, `rounded-full`, z-index utilities) and reads **all visual values via inline `style={{ var(--falcon-loader-overlay-*) }}` or computed config strings** (`[CODE]` falcon-loader-overlay-tw.tsx throughout). For host-side additions use the `class=` attribute:

```html
<falcon-angular-loader-overlay class="block w-full h-full" ... />
```

## Dark mode support

**No dedicated dark-mode override.** The overlay is intrinsically a dark, brand-coloured surface (teal/green gradient, white foreground) in both light and dark app themes — by design it does not flip. There is no `:where(.app-dark …)` block in `loader-overlay.tokens.css`. `[VAULT]` falcon-ui-tokens/WAVE-9-DARK-MODE.md references the loader but no per-token dark inversion is declared here. **NOT verified end-to-end — flag for the theme/tokens agent.**

## Density support

**None.** The overlay is a fullscreen splash; it has no density presets and does not alias `--falcon-density-*`. All geometry comes from the JSON config (logo size, ring size, progress width, etc.).

## RTL support

The `-tw` close button uses logical `insetInlineEnd: '18px'` (`[CODE]` falcon-loader-overlay-tw.tsx:1156) so it mirrors correctly in RTL. The **Shadow** variant positions its close button via the scoped `.flo-close` CSS rule in `falcon-loader-overlay.css` (not read in full this pass) — confirm it uses logical properties too. Most content is centered (caption/logo/ring) so direction is largely moot. **Partially verified — flag the Shadow `.flo-close` rule for the theme agent.**

## Static style risks

- **Raw hex / rgba in the token defaults** — `loader-overlay.tokens.css` hardcodes ~30 brand colours as literal hex/rgba rather than `--color-falcon-*` aliases (lines 65-242). The token-file convention prefers palette aliases; this file is a deliberate-but-documented exception driven by the React JSON SoT. **GAP G5 (safe-local) — alias to `--color-falcon-*` where a 1:1 palette colour exists, keeping the hex as fallback.**
- **Raw hex inside the component `DEFAULT_OVERLAY_CFG`** — both `.tsx` files inline ~30 hex colour literals in their default config objects (`[CODE]` falcon-loader-overlay.tsx:41-198 / falcon-loader-overlay-tw.tsx:58-195). These are the React-parity defaults; they are config values, not CSS rules, so they do not violate the "no hex in CSS" rule, but they DO duplicate the token defaults (drift risk if one is edited and not the other). The "KEEP IN SYNC" banners acknowledge this (`[CODE]` falcon-loader-overlay-tw.tsx:55-57).
- **`px` literals in inline styles** — the `-tw` twin writes dozens of `${cfg.x}px` inline styles (logo size, ring size, progress width, etc.). These are config-driven runtime values, not static CSS, so they are acceptable; they cannot be tokenised because they are per-instance.
- **`min-height: 100vh` on the `-tw` stage** (`[CODE]` falcon-loader-overlay-tw.tsx:1122) — a hardcoded `100vh` that fights any contained (non-fullscreen) host; consumers must neutralise it with `[&_[data-fl-part=stage]]:!min-h-0` (USAGE Example 1). **GAP G7 (safe-local) — token-ise the stage min-height so containment doesn't need a `!important` override.**

## No CSS / no SCSS guidance

- The Angular wrapper has **no `.component.css`** — pure tag-switcher (good).
- The `-tw` twin's only stylesheet is the global-`@keyframes` sidecar `falcon-loader-overlay-tw.css` (`flo*` prefix) — the only members that survive Stencil's scoped wrapping. No hex/colour rules there (keyframes are geometry/opacity only). ✅ clean.
- The Shadow `.css` (~24 KB) holds the scoped `flo-*` layout + `@keyframes`. Not fully audited this pass for embedded hex; **flag for a focused CSS pass.**
- Consumer per-instance overrides MUST mutate `--falcon-loader-overlay-*` tokens (geometry) or the JSON `config` (appearance). Never hardcode hex/px on the host.

## Token usage by group (config key → token → render-path consumer)

| Group | Representative token(s) | Driven inline by config key |
|---|---|---|
| Stage bg | `--falcon-loader-overlay-bg`, `-bg-blur` | `bgMode`/`bgColor`/`bgGrad*` (built into the bg string) |
| Vignette | `--falcon-loader-overlay-vignette-color`, `-vignette-opacity` | `bgVignette` |
| Halo | `--falcon-loader-overlay-halo-color/size/intensity/pulse-duration` | `halo*` |
| Ring | `--falcon-loader-overlay-ring-color/width/size/duration/opacity` | `ring*` |
| Bubbles | `--falcon-loader-overlay-bubble-color/opacity/blur` | `bubble*` (per-particle geometry inline, not tokenised) |
| Logo | `--falcon-loader-overlay-logo-size/color/opacity` + drift vectors | `logo*` |
| Progress | `--falcon-loader-overlay-progress-color/track-bg/width/height/radius/glow-blur` | `progress*` |
| Caption | `--falcon-loader-overlay-caption-color/size/weight/letter-spacing/line-height` | `caption*` |
| Skeleton | `--falcon-loader-overlay-skel-row-height/radius/gap/shimmer-*` | `skel*` |
| Visibility | `--falcon-loader-overlay-position/z-index/inset/transition-*` | (cascade-read; geometry override surface) |

## Verification
🟢 code-verified against `loader-overlay.tokens.css` + the inline `style` reads in both `.tsx` files. Gate-12 `:where()` scoping confirmed. Dark-mode / RTL Shadow `.flo-close` 🔴 not fully verified (flagged for the theme agent). Raw-hex token finding 🟢 code-verified (lines cited).
