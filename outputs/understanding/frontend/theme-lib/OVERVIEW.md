# falcon-theme — OVERVIEW

> Library deep-dive sweep batch **L07** (SPEC §7 non-component, lighter 5-file set). CREATED 2026-06-03 (ammar-web-platform-ui). Read-only pass — no source edited.

## What this library is

`@falcon/theme` (`libs/falcon-theme`) is the **canonical design-token SSOT** for the whole Falcon web platform — the single `@theme` declaration block that every Tailwind v4 utility is generated from (`color-*`, `text-*`, `p-*`/`m-*`/`gap-*`, `rounded-*`, `shadow-*`, `z-*`, `leading-*`, `tracking-*`, `animate-*`, breakpoints), **plus** the vendored Falcon icon glyph font and its `@font-face` + class contract, **plus** all font assets (Cairo, IBM Plex Sans Arabic, Neue Haas Grotesk Display Pro, the Falcon icon woff2).

- `[CODE] libs/falcon-theme/README.md:1-8` — "Falcon canonical design-token SSOT … the single source of truth for every Tailwind v4 `@theme` value, plus the Falcon icon font and its assets. Consumed by every app's `tailwind.css` entry via CSS `@import`."
- `[CODE] libs/falcon-theme/src/falcon-tailwind-tokens.css:1-3` — file banner: "Falcon Theme — Tailwind v4 SSOT (Single Source of Truth) … Every value in this `@theme` block becomes a Tailwind utility."

It is a **CSS-first, zero-runtime** library: there is no Angular code, no component, no service. Tokens flow into apps at *build time* through Tailwind's CSS pipeline, not through TypeScript imports.

## Purpose / business + UI use case

- **One knob, platform-wide.** Mutating a token here propagates to *every component in every framework simultaneously* (Angular wrappers, Stencil Shadow + `-tw` Light-DOM twins, React, Vue, and the Falcon Studio token registry). `[CODE] README.md:49-51`.
- **Brand identity.** The brand teal `#124c52`, the per-tenant brand accents (Aramco/BMW/Rajhi/SNB/Bupa), the typography families, and the corner-radius / shadow language all live here. `[CODE] falcon-tailwind-tokens.css:31-44, 139-156`.
- **Dark mode** is a single cascade override block keyed on `.app-dark` / `.dark`; geometry stays stable, only surface/text/border/shadow invert. `[CODE] falcon-tailwind-tokens.css:530-640`.
- **Icon system.** The vendored Falcon icon font replaced PrimeIcons in the PrimeNG-total-removal program (2026-05-10); class contract `<i class="falcon-icon falcon-icon-{name}">`. `[CODE] falcon-icons.css:1-4`.

## When to use / when NOT

| Use this lib for | Do NOT use this lib for |
|---|---|
| Theme-level **primitives**: color, typography, spacing, radius, shadow, motion, breakpoints, z-index, sizing, border-width, tracking, opacity, animation keyframes. `[CODE] README.md:44-48` | **Component-level token contracts** — those live in `libs/falcon-ui-tokens/src/components/*.tokens.css` (L06). `[CODE] README.md:45-47` |
| The Falcon **icon font** glyphs + `.falcon-icon` classes. | Per-component visual knobs (`--falcon-input-*`, `--falcon-drawer-*`, …) — owned by L06. |
| Adding a NEW global token (a new radius, a new shadow) when ≥2 components need it. | Adding a one-off value for a single component (use that component's `*.tokens.css`). |

## Status

**ACTIVE / load-bearing / forward-only.** `[CODE] README.md:44` ("This is forward-only."). This is the lowest layer of the FE styling stack — every app and every component depends on it transitively. There is no replacement planned.

## Replaces

- **PrimeIcons / `tailwindcss-primeui` / PrimeNG theme** — the icon font is a "drop-in replacement for the previous trimmed PrimeIcons stylesheet … new font-family + class prefix so the workspace carries no PrimeNG identifiers." `[CODE] falcon-icons.css:1-4`. PrimeNG was uninstalled platform-wide 2026-05-10. `[CODE] README.md:52-53`, `[CODE] tailwind.config.js:4-5`.
- **Legacy SCSS variables / `tailwind.config.js theme.extend`** — the Tailwind v4 `@theme` block is the SSOT; `tailwind.config.js` is now empty (`module.exports = {}`). `[CODE] tailwind.config.js:9`. See `[BRAIN-OUT] understanding/frontend/decisions/ADR-007-tailwind-theme-over-config.md` + `ADR-002-tailwind-v4-over-scss.md`.

## Full source-file path table

| File | Lines | Role |
|---|---|---|
| `libs/falcon-theme/src/falcon-tailwind-tokens.css` | **699** `[CODE]` | The `@theme` SSOT block + `@layer`/`@import "tailwindcss"`/`@config`/`@custom-variant dark` + dark-override block + `body{}` default-color rule + all `@keyframes`. |
| `libs/falcon-theme/src/styles/falcon-icons.css` | 386 `[CODE]` | Falcon icon `@font-face` + `.falcon-icon` base/`-fw`/`-spin` classes + reduced-motion guard + **314** glyph `::before{content}` rules. |
| `libs/falcon-theme/src/index.css` | 9 `[CODE]` | Barrel — `@import`s the tokens CSS + the icons CSS. For consumers that prefer one entry-point. |
| `libs/falcon-theme/src/tokens.ts` | 913 `[CODE]` | **AUTO-GENERATED** TS mirror of the `@theme` block — `tokens` (var-refs) + `tokenValues` (literals) + 9 grouped exports (`colors`/`spacing`/`radii`/`shadows`/`typography`/`breakpoints`/`motion`/`zIndex`/`sizing`/`misc`) + `FalconTokens`/`FalconTokenName` types. Header: "DO NOT EDIT BY HAND. Regenerate: `nx run falcon-theme:generate-tokens-ts`. Tokens: 289." |
| `libs/falcon-theme/scripts/generate-tokens-ts.mjs` | — `[CODE]` (exists) | Node script that parses the SSOT CSS → emits `tokens.ts`. Run by the `generate-tokens-ts` nx target. |
| `libs/falcon-theme/src/assets/fonts/falcon-icons/falcon-icons.woff2` | — | Vendored icon font binary (served at `/assets/fonts/falcon-icons/falcon-icons.woff2`). |
| `libs/falcon-theme/src/assets/fonts/cairo/Cairo-{Regular,Medium,SemiBold,Bold}.ttf` | — | Arabic sans (`--font-sans-ar`). |
| `libs/falcon-theme/src/assets/fonts/ibm-plex-arabic/IBMPlexSansArabic-{Regular,Medium,SemiBold,Bold}.ttf` | — | Arabic display (`--font-arabic`). |
| `libs/falcon-theme/src/assets/fonts/neue-haas/NeueHaasDisplay{Light,Roman,Mediu,Bold}.ttf` | — | Latin sans (`--font-sans-latin`, the platform default). |
| `libs/falcon-theme/src/assets/IBM_Plex_Sans_Arabic (1).zip`, `…/neue-haas-grotesk-display-pro-cdnfonts (1).zip` | — | **Stray download zips** committed beside the unpacked fonts (cleanup candidate — F-finding). |
| `libs/falcon-theme/project.json`, `package.json`, `README.md` | — | nx project (`nx:noop` build → `generate-tokens-ts`), package manifest (`@falcon/theme`, exports `.`→`index.css`, `./tokens`→`tokens.ts`), human README. |

## Selectors / tags / public entry points

This library has **no DOM selectors or custom elements**. Its public surfaces are:
- **CSS `@import`** (the primary path): `@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css";` — `[CODE]` apps reach it by *filesystem-relative* path, because Tailwind v4 does not resolve TS aliases inside `.css`. `[CODE] README.md:30-32`.
- **Icon class contract:** `<i class="falcon-icon falcon-icon-{name}">` (+ `.falcon-icon-fw` fixed-width, `.falcon-icon-spin`). `[CODE] falcon-icons.css:4,14,38,43`.
- **TS path alias `@falcon/theme`** (rare): `package.json` exports `.`→`src/index.css`, `./tokens`→`src/tokens.ts`, `./*`→`src/*`. `[CODE] package.json:9-13`. In practice no Angular component imports from it — "tokens flow through CSS at build time." `[CODE] README.md:40-42`.
- **Dark variant trigger:** `<html class="app-dark">` (or `.dark`). `[CODE] falcon-tailwind-tokens.css:25,553-554`.

## Known consumers (grep-verified 2026-06-03 — see USAGE.md)

- **All 3 apps** `@import` the SSOT in their Tailwind entry: `apps/{admin-console,management-console,host-shell}/src/tailwind.css:4`. `[CODE]` (verified).
- The icon font + `.falcon-icon-*` classes are consumed transitively wherever `<falcon-angular-icon>` or raw `<i class="falcon-icon …">` appears (heaviest icon consumer set documented under `falcon-icon` B11).
- The `@theme` tokens are consumed by **every** component-token file (L06 builds component tokens on top of these primitives via `var(--…)`) and by every Stencil `-tw` Tailwind-class helper.

## Related units

- **`libs/falcon-ui-tokens` (L06)** — the *next layer up*: per-component token contracts that reference these theme primitives. The split is load-bearing: theme = global primitives, ui-tokens = component knobs. `[CODE] README.md:45-47`.
- **`libs/falcon-ui-core` (B-batches)** — Stencil components + Angular wrappers + Tailwind-class helpers that *consume* both layers.
- **`falcon-icon` component (B11)** — the Angular/Stencil wrapper over the `.falcon-icon` font defined here; the 314-glyph set is documented in its dossier.
- **Prior brain reports** (now partly stale; superseded by this dossier where they disagree): `[BRAIN-OUT] understanding/frontend/theme/THEME_SSOT_AUDIT.md` (verified 2026-05-13 @ 486 lines / 216 tokens), `[BRAIN-OUT] understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md`, `[BRAIN-OUT] understanding/frontend/theme/{DARK_MODE_AUDIT,DENSITY_AND_RTL_AUDIT,APP_TAILWIND_AUDIT,UTILITY_SAFELIST_AUDIT,TOKEN_FLOW_REPORT}.md`.

## Ownership

FE platform / design-system team. Mutations here are reviewed as platform-wide changes (every framework + every component affected). The `night-shift-audit` + `get-shit-done` review board enforce the token-only / no-hex-px / Falcon-component house rules against this SSOT. `[MEMORY] reference_fe_structure_standard_angular21_2026_06_02`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L07). All 4 src files + README + project.json + package.json read in full; line counts measured on disk (tokens CSS=699, icons CSS=386, index.css=9, tokens.ts=913); 314 glyph rules grep-counted; 3-app `@import` of the SSOT grep-verified; prior `THEME_SSOT_AUDIT.md` cross-checked and deltas noted. No source edited.
