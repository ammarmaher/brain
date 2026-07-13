# falcon-empty-data — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/empty-data.tokens.css` (**130 lines** — counted 2026-06-03).

`[CODE]` Scoped under `:where(falcon-empty-data, falcon-empty-data-tw, falcon-empty-data-shadow, .falcon-empty-data, [data-falcon-empty-data])` (empty-data.tokens.css:24-27). `:where()` keeps specificity 0 so per-instance host-class overrides win. **gate-12 compliant** (scoped, not `:root`).

> ⚠️ `[CODE]` The selector and the header comment (line 12) both reference `falcon-empty-data-shadow`, but **no `<falcon-empty-data-shadow>` component exists** (only `falcon-empty-data` Shadow + `falcon-empty-data-tw` Light). Harmless extra selector member; flagged as stale (GAP G6 / FINDINGS). The Angular selector `falcon-angular-empty-data` is **NOT** in the `:where()` list — but the wrapper renders the inner Stencil tag (which IS listed), so token resolution still works; adding `falcon-angular-empty-data` would only matter for direct host-element styling.

## Token categories (7 declared, ~60 vars)

1. **CARD** — `--falcon-empty-data-card-radius` (0px!), `-padding-y/x`, `-gap`, `-border-width`, `-border-color` (teal-800 @18% via `color-mix`), `-bg-fallback` (teal-800 @4%), `-bg-glossy-start` (@4%), `-bg-glossy-end` (@6%).
2. **GLYPH DISC** — `-glyph-size` (64px), `-glyph-radius` (9999px), `-glyph-svg-size` (36px), `-glyph-bg` (teal-50), `-glyph-fg` (teal-700), `-glyph-fg-mono` (neutral-500), `-glyph-border-width/-color`, `-glyph-opacity` (1, runtime-overridden inline when `iconOpacityOn`).
3. **TITLE** — `-title-size` (`var(--text-md)`), `-title-weight` (600), `-title-color` (neutral-925), `-title-letter-spacing` (0.01em), `-title-line-height` (1.25).
4. **BODY** — `-body-size` (`var(--text-sm)`), `-body-color` (neutral-500), `-body-line-height` (1.5), `-body-max-width` (380px).
5. **ACTION BUTTON** — `-btn-radius` (10px), `-btn-gap`, `-btn-margin-top`, `-btn-border-width` (1.5px); solid: `-btn-bg` (teal-800) / `-btn-fg` (neutral-0) / `-btn-border-color`; dashed: `-btn-bg-dashed` (white) / `-btn-fg-dashed` (teal-700); sizes `-btn-h-{sm,md,lg}` (28/34/42px) + `-btn-px-{sm,md,lg}` + `-btn-text-{sm,md,lg}`.
6. **INFO CHIP** — `-info-radius` (9999px), `-info-padding-y/x`, `-info-gap`, `-info-margin-top`, `-info-border-width`, `-info-bg` (teal-800 @5%), `-info-border-color` (@10%), `-info-text-color` (neutral-500), `-info-text-size` (`var(--text-2xs)`), `-info-icon-color` (teal-700), `-info-max-width` (420px). Plus a standalone `-icon-size` (36px) exposed for caller override.
7. **LAYOUT** — `-table-min-height` (360px ≈ 6 rows), `-page-max-width-mini` (50vw), `-page-padding-y` (80px), and default wrapper `-wrapper-padding-x/y` + `-wrapper-margin-x/y` (overridable per instance via `padX/padY/marginX/marginY` inputs → inline style).

## Related Falcon theme tokens (from `falcon-tailwind-tokens.css`)

| Falcon theme token | Used by empty-data via |
|---|---|
| `--color-falcon-teal-800` (`#0d3f44`) | Card border/bg (via `color-mix`), button bg/border, info chip. The dominant brand color. |
| `--color-falcon-teal-700` | Glyph fg, dashed-button text, info-icon color. |
| `--color-falcon-teal-50` | Glyph disc background. |
| `--color-falcon-neutral-0` (white) | Button fg, dashed-button bg. |
| `--color-falcon-neutral-500 / 925` | Body + info text / title text. |
| `--text-md / --text-sm / --text-2xs` | Title / body / info type scale. |

## Tailwind utility guidance for this component

`[CODE]` The Tailwind helper `empty-data-tailwind-classes.ts` emits **only layout/box-model/typography** utilities composed from `--falcon-empty-data-*` arbitrary-value classes. Color/gradient/border-shorthand are applied **inline** by the `-tw` component because Tailwind arbitrary syntax cannot express `linear-gradient(180deg, var(--A), var(--B))` or `border: <w> dashed <c>` (`[CODE]` empty-data-tailwind-classes.ts:7-17). Consumers should NOT hand-roll Tailwind colors — override tokens instead.

## Dark mode support

`[INFERRED]` Inherits the platform `:where(.app-dark, .app-dark *)` neutral inversions from `falcon-tailwind-tokens.css`. The empty-data token file declares **no per-component dark override** — the `color-mix(... teal-800 ...%, transparent)` card surfaces and neutral text auto-adapt when the underlying palette tokens flip. NOT independently re-verified in this audit — flag for theme/tokens agent (consistent with the falcon-input dossier's dark-mode caveat).

## Density support

`[CODE]` There is **no density input/token** for this component (unlike `falcon-filter-panel`). The closest sizing axis is `mode` (`table` vs `page`) + the CTA `actionSize`. `--falcon-empty-data-table-min-height` (360px) governs the reserved table height; no density preset rescales it.

## RTL support

`[INFERRED]` The card is a centred `flex-col` with `text-align:center`; the layout is direction-neutral. Wrapper margins/paddings use logical properties (`padding-inline`/`margin-inline` in the Shadow CSS; `px-`/`mx-` Tailwind utilities resolve logically). Info chip + button are centred. No `dir`-specific override observed; NOT verified end-to-end — flag for theme agent.

## Static style risks

- `[CODE]` **Inline `style` on the `-tw` (Light) variant is extensive** — falcon-empty-data-tw.tsx:264-330 sets card `border`/`background`, glyph `background-color`/`border`/`color`, title color/size/weight/line-height/letter-spacing, body color/size/line-height/max-width, button border/bg/color, info chip bg/border/color, info-icon color — ALL as inline `style={{...}}` objects. **Every value is a `var(--falcon-empty-data-*)` reference (token-with-no-literal-fallback), which is acceptable per house rules** (tokens, not hex/px). But it IS a large inline-style surface — see GAP G8. The Shadow variant has NONE of this (pure CSS file).
- `[CODE]` `--falcon-empty-data-card-radius: 0px` — the card has **square corners by default** (`[CODE]` empty-data.tokens.css:31). Intentional (SoT port), but a per-instance override is needed for rounded cards.
- `[CODE]` `font-weight: String(600)` hardcoded in the `-tw` title style (`[CODE]` tw.tsx:295) rather than reading `--falcon-empty-data-title-weight` — minor drift vs the Shadow CSS which reads the token (G8 sub-item).
- `[CODE]` Glyph SVG `stroke-width="1.5"` + CTA `+` SVG `stroke-width="2.2"` + info SVG `stroke-width="1.8"` are hardcoded literals inside the inline SVGs (both variants) — not tokenised. Acceptable for vector geometry, but noted.

## No CSS / no SCSS guidance

- The Shadow variant CSS (`falcon-empty-data.css`, 244 ln) is **token-only — VERIFIED clean 2026-06-03**: every visual value reads a `--falcon-empty-data-*` var; the only literals are structural (`display:flex`, `border-style:solid`, `box-sizing`). No raw hex.
- The `-tw` CSS file is `:host { display: block; }` only.
- Consumer per-instance overrides MUST mutate `--falcon-empty-data-*` via a host class. Never hardcode hex/px.

## Token usage by state

| State / part | Token(s) consumed |
|---|---|
| Card chrome | `--falcon-empty-data-card-radius`, `-card-padding-{x,y}`, `-card-gap`, `-card-border-width`, `-card-border-color`, `-card-bg-fallback` |
| Card gradient (glossy) | `-card-bg-glossy-start`, `-card-bg-glossy-end` |
| Glyph disc | `-glyph-size`, `-glyph-radius`, `-glyph-svg-size`, `-glyph-bg`, `-glyph-fg`, `-glyph-fg-mono`, `-glyph-border-{width,color}`, `-glyph-opacity` |
| Title | `-title-size`, `-title-weight`, `-title-color`, `-title-letter-spacing`, `-title-line-height` |
| Body | `-body-size`, `-body-color`, `-body-line-height`, `-body-max-width` |
| CTA (solid) | `-btn-bg`, `-btn-fg`, `-btn-border-color`, `-btn-border-width`, `-btn-radius`, `-btn-gap`, `-btn-margin-top`, `-btn-h/px/text-{size}` |
| CTA (dashed) | `-btn-bg-dashed`, `-btn-fg-dashed`, `-btn-border-color` |
| CTA (none) | transparent + `-btn-fg-dashed` |
| CTA focus | `outline: 2px solid var(--falcon-empty-data-btn-border-color)` (`[CODE]` Shadow CSS:167-170) |
| Info chip | `-info-bg`, `-info-border-{width,color}`, `-info-text-color`, `-info-text-size`, `-info-radius`, `-info-padding-{x,y}`, `-info-gap`, `-info-margin-top`, `-info-max-width`, `-info-icon-color` |
| Layout / sizing | `-wrapper-padding-{x,y}`, `-wrapper-margin-{x,y}`, `-table-min-height`, `-page-padding-y`, `-page-max-width-mini` |
| Loading | _None — no loading state (use the table skeleton)._ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12, NEW) — token file recounted at 130 lines, `:where()` scope + 7 categories confirmed, Shadow CSS verified token-only, large `-tw` inline-style surface confirmed (all token-referenced), `falcon-empty-data-shadow` stale-selector + `card-radius:0px` + `font-weight:600` hardcode flagged.
