# falcon-loader-inline — TOKENS

## Component token file
`libs/falcon-ui-tokens/src/components/loader-inline.tokens.css` (**260 lines** — counted 2026-06-03).

`[CODE]` Two scopes:
1. The token-declaration block (`:where(falcon-loader-inline, falcon-loader-inline-tw, falcon-angular-loader-inline, .falcon-loader-inline, [data-falcon-loader-inline])` — loader-inline.tokens.css:36-42) keeps specificity 0 (gate-12 compliant — scoped, NOT `:root`).
2. The **visibility-gate** cascade (`:where(falcon-loader-inline, falcon-loader-inline-tw):not([visible])` → `display:none` + `* { animation-play-state: paused !important }` — :237-260) targets ONLY the two Stencil tags, NOT the wrapper (whose `visible` does not reflect to a host attr).

## Token categories (20 declared)

`[CODE]` loader-inline.tokens.css:13-34 header enumerates: 1. HOST/POSITION/VISIBILITY · 2. GEOMETRY · 3. ICON COLOUR · 4. INLINE BACKGROUND · 5. ORBIT RING · 6. ANIMATION · 7. GLOW · 8. HALO · 9. CAPTION+SUB-LABEL+DOTS · 10. SKELETON ROWS · 11. DROP TINT · 12. ANIMATED BACKGROUND · 13. PATTERN OVERLAY · 14. STARS · 15. RIPPLES · 16. SHADOWS (inner/drop/icon) · 17. ICON EFFECTS (blur/auto-cycle) · 18. 3D TILT · 19. TRAIL · 20. NOISE.

Key tokens:
- `--falcon-loader-inline-position: absolute` + `-inset: 0` + `-z-index: 1` (defaults to cover its `position:relative` parent; override to `static` to inline-flow).
- `--falcon-loader-inline-size: 96px`, `-icon-scale: 0.7`, `-shape-radius: 50%`.
- `--falcon-loader-inline-bg: var(--color-falcon-neutral-50, #f1f6f6)` (the `-tw` twin's `soft` bgKind reads this token; other bgKinds read per-instance config colours).
- `--falcon-loader-inline-label-color-{muted,text,teal}`, `-dots-size`, `-dots-duration`, `-skel-*` (the chrome the `-tw` twin reads via `var()`).

## Token vs JSON-config split (IMPORTANT)

`[CODE]` This component is **config-first, token-second** (unlike button/input which are token-first):
- The **30-group JSON `config`** is the authoritative source for per-instance colours / geometry / animation. The Shadow tag's `buildVars()` (falcon-loader-inline.tsx:354-468) writes ~60 `--falcon-loader-inline-*` CSS variables INLINE on the wrapper from the config, overriding the token defaults. The `-tw` twin writes most values as INLINE styles directly from the config (falcon-loader-inline-tw.tsx — e.g. `stageStyle.background = resolveBgBackground()`).
- The **token file** supplies (a) the visibility-gate behaviour, (b) the `soft`-bgKind default surface, (c) the caption/dots/skeleton chrome, and (d) fallback defaults when no config is passed.

> So: tune VISUALS through `config`; tune the host/visibility/chrome through tokens. The 832-line Shadow CSS + 154-line `-tw` CSS are mostly `fli-*` `@keyframes` (heartbeat/pulse/bounce/float/rotate/spin/ring-pulse/star-twinkle/ripple/dot/skel-shimmer/bg-shift/…), `fli-`-prefixed so they cannot collide with consumer keyframes.

## Related Falcon theme tokens

| Falcon theme token | Used by loader-inline via |
|---|---|
| `--color-falcon-neutral-50` | `--falcon-loader-inline-bg` (soft surface) |
| (brand `#0d3f44` / `#15803d`) | `[CODE]` default config `iconColor`/`gradientFrom` are RAW hex in `DEFAULT_INLINE_CFG`, NOT `--color-falcon-*` aliases (falcon-loader-inline.types.ts is types-only; defaults inlined in `.tsx`:38-208) — a tokens-over-literals concern (GAP G5, same family as loader-overlay B-CAL G5). |

## Tailwind utility guidance
The `-tw` twin inlines all layout classes (`relative flex flex-col items-center gap-3`, etc.) — there is NO `loader-inline-tailwind-classes.ts` helper (GAP G6, unlike input/button which have a `*-tailwind-classes.ts` SSOT). Consumers add only host layout via `class=` (the Studio previews use `class="block w-full h-full"`).

## Dark mode support
`[CODE]` The loader has 3 light/mid/dark Studio mini-previews but **no automatic dark-mode token override** — its colours come from the JSON config (the global loader's teal-on-light card is fixed by `inlineConfig()`). The `--falcon-loader-inline-bg` neutral-50 alias WOULD flip under `.app-dark`, but most surfaces are config-driven hex. `[INFERRED]` dark adaptation is the config author's job, not automatic.

## Density support
No density tokens — size is `config.size` (default 96 px) + `config.iconScale`.

## RTL support
`[INFERRED]` The loader is radially symmetric (centered icon + ring + caption) — RTL has no visual effect. The caption text follows page direction. Not re-verified this pass.

## Static style risks
- `[CODE]` **Both Stencil sources write heavy INLINE styles** — this is BY DESIGN: per-instance numeric/colour values flow through `buildVars()`/inline `style={{}}` because the JSON config is the authoritative source (the `.css` stays tokens-only / keyframes-only). NOT a violation — documented rationale in falcon-loader-inline.tsx:351-353,470-472.
- `[CODE]` `--falcon-loader-inline-bg-glossy-overlay` is a raw `rgba(255,255,255,…)` literal in the token file (:90) — a minor tokens-over-literals smell (could alias a white token), `safe-local`.
- `[CODE]` `DEFAULT_INLINE_CFG` brand colours (`#0d3f44`, `#15803d`, `#F1F6F6`) are raw hex in BOTH `.tsx` defaults — not palette aliases (GAP G5).

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Hidden | `:not([visible])` → `display:none` + `* { animation-play-state: paused !important }` (the lightweight contract) |
| Visible | the loader paints; animations run; `aria-busy="true"` (Shadow host) |
| Position | `--falcon-loader-inline-position` (absolute default), `-inset`, `-z-index` |
| Caption | `--falcon-loader-inline-label-color-{muted,text,teal}`, `-label-line-height`, `-dots-size`, `-dots-duration` |
| Skeleton | `--falcon-loader-inline-skel-width`, `-skel-row-{gap,height,radius}`, `-skel-shimmer-{from,via}`, `-skel-duration` |
| Glow/halo pulse | `--falcon-loader-inline-glow-pulse-duration`, `-halo-pulse-duration` |

## No CSS / no SCSS guidance
- Do NOT write a `.scss` to style the loader — tune via `config` + the token cascade.
- The `fli-*` keyframes are global (Light DOM) but namespaced — do not redefine `fli-*` animations in consumer CSS.

## Per-instance override example
```css
.inline-loader-static { --falcon-loader-inline-position: static; }  /* inline-flow */
```

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17 — NEW). Token file counted at 260 lines, 20 categories + the visibility-gate cascade (:237-260) confirmed, gate-12 `:where()` scope confirmed (not `:root`). Config-first / token-second split documented from buildVars (Shadow) + inline-style (`-tw`). Raw-hex defaults (G5) + missing tailwind helper (G6) recorded.
