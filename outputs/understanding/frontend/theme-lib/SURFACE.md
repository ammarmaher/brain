# falcon-theme — SURFACE (public API / exports)

> Batch **L07**. The exported surface of `@falcon/theme`: the CSS files, every `@theme` token family + count, the icon glyph families, the font assets, and the `tokens.ts` TypeScript mirror. Every count measured on disk 2026-06-03.

## 1. Public entry points (`package.json` exports)

`[CODE] package.json:9-13`
| Export specifier | Resolves to | Consumed by |
|---|---|---|
| `@falcon/theme` (`.`) | `src/index.css` | CSS barrel (tokens + icons). Rare — apps `@import` the tokens CSS directly. |
| `@falcon/theme/tokens` | `src/tokens.ts` | TS consumers needing token names/values as constants (build-config / Studio registry). |
| `@falcon/theme/*` | `src/*` | Direct file reach-in (e.g. `@falcon/theme/falcon-tailwind-tokens.css`). |

`main` + `style` = `src/index.css`; `type: module`; `private: true`. `[CODE] package.json:5-8`.

### The barrel — `src/index.css` (9 lines)
`[CODE] index.css:7-8`
```css
@import "./falcon-tailwind-tokens.css";
@import "./styles/falcon-icons.css";
```

## 2. The SSOT — `falcon-tailwind-tokens.css` (699 lines)

### 2a. Top-of-file directives (the Tailwind v4 wiring)

| Directive | Line | What it does |
|---|---|---|
| `@layer theme, base, falcon-base, falcon-overlay, utilities;` | `[CODE] :18` | Locks cascade order. **MUST precede `@import "tailwindcss"`** — the first `@layer` statement locks order; if Tailwind's own `@layer` runs first, `falcon-base`/`falcon-overlay` get appended last (highest priority) and `falcon-overlay`'s `inset:auto` clobbers Tailwind anchor utilities (corner toasts pin to origin). Fixed Wave 9 (2026-05-24). `[CODE] :5-17`. |
| `@import "tailwindcss";` | `[CODE] :20` | Bootstraps Tailwind v4 core (preflight + utility generator). |
| `@config "../../../tailwind.config.js";` | `[CODE] :23` | v4 config bridge. **⚠️ Its inline comment claims it "re-enables `important: true`" — STALE: the config is now `module.exports = {}`** (PrimeNG removal 2026-05-10 made `important:true` harmful). The `@config` directive is now a vestige. `[CODE] tailwind.config.js:1-9`. (F-finding; prior `THEME_SSOT_AUDIT.md:28-39` flagged the same.) |
| `@custom-variant dark (&:where(.app-dark, .app-dark *));` | `[CODE] :25` | Wires Tailwind's `dark:` prefix to fire under `.app-dark` anywhere in the ancestor chain. The override block ALSO matches `.dark`. `[CODE] :553-554`. |

### 2b. `@theme` block — 14 token families (lines 27-528)

`tokens.ts:4` header declares the generated count: **289 tokens**. `[CODE]`. (The prior 2026-05-13 audit measured 216 at 486 lines — the file has grown ~213 lines / +73 tokens since.)

| # | Family | Lines | Members (count) | Notes / source-prefix |
|---|---|---|---|---|
| 1 | **Brand teal** | `:28-51` | 11 stops (50–900 + tint) + `option`/`mid` + 5 alpha derivatives = **18** | `teal-500=#124c52` is canonical brand. `teal-500` (#124c52) vs `teal-600` (#104c54) differ by one digit. Alphas are `rgba(13,63,68,…)` = teal-700 RGB. `[CODE]` |
| 2 | **Neutrals** | `:53-82` | **27 stops**: 0/20/25/30/40/45/50/75/100/150/160/175/200/300/350/400/450/475/500/600/700/750/800/850/900/925/950 | Monotonic light→dark (#ffffff→#000000); fully re-mapped in dark block. `[CODE]` |
| 3 | **Status / accents** | `:84-147` | green(5) + wallet-master(4) + red(5) + amber(3) + blue(1) + success(3) + popover-dark/orgchart-line/cyan(3) + lilac(4) + mint(2) + brand(9) | `green-50` mixed-case `#F3F8F5` (vs lowercase elsewhere) — cosmetic nit. `[CODE]` |
| 4 | **Typography** | `:149-200` | 5 font families + **26 `--text-*` sizes** (incl. `5xs`…`display`, many `*-half` Wave-NS micro-steps) + 5 `--falcon-leading-*` + 6 `--leading-falcon-*` (utility-generating) | `--text-xl`(1.75rem/28px) > `--text-2xl`(1.5rem/24px) — **non-monotonic, intentional** (V0.2 reference: xl=heading scale, 2xl=body-emphasis). `[CODE] :176-177` |
| 5 | **Sizing** | `:202-239` | control(4: xs/sm/md/lg) + icon(4) + 3 iconify aliases + tile(4) + stepper-circle(3) + `--falcon-wb-drawer-width`(380px) | SSOT comment: "do NOT confuse with `--spacing-*`". `--falcon-wb-drawer-width` declared on theme :root to fix a mgmt wallet drawer collapse. `[CODE]` |
| 6 | **Stepper customization** (Wave 10D) | `:241-272` | **11** Studio surface knobs: step-shape/radius/rotate + size-1..5 + animation-enabled + label-position + label-visible | Non-technical Studio left-rail writes these. `[CODE]` |
| 7 | **Border width** | `:274-280` | 4: `1`/`1-5`(=1.5px, hyphen-encoded decimal)/`2`/`4` | `[CODE]` |
| 8 | **Spacing** | `:282-327` | ~36 `--spacing-*` (incl. many `*.25/.5/.75` Wave-NS steps) + **9 layout primitives** (sidebar/sidebar-collapsed/topbar/clients/rail/row-h/row-gap/row-pad-y/row-pad-x/row-action-inset) | `--spacing-14`(3.5rem)=`-9`, `-16`(4rem)=`-11`, `-20`(5rem)=`-12` **value collisions** (legacy aliases, undocumented). `[CODE] :312-314` |
| 9 | **Radii** | `:329-350` | ~21: none/2xs/xs/sm/md/lg/xl/2xl/3xl/full + purpose-named (`pill`=full, `form`, `row`, `control-xs`, `card`, `pane`, `surface-xl`=pane, `modal`) | `[CODE]` |
| 10 | **Shadows** | `:351-382` + `:494` | ~30: falcon-xs..xl + popover/menu/drawer + focus/focus-strong/danger-focus + sticky-edge/action + chart-card/toolbar/pill + menu-deep/card-soft/modal-deep/uploader-action/focus-soft/toggle-active + `--shadow-brand-soft` (outside family dividers) | Black-shadow scale for surfaces; teal-tinted scale for chart machinery. Wave 12A removed glass/glossify shadows. `[CODE]` |
| 11 | **Breakpoints** | `:384-391` | 5: sm576/md768/lg992/xl1200/2xl1920 | Falcon-specific (NOT Tailwind defaults). `[CODE]` |
| 12 | **Motion** | `:393-406` + `:460` | 3 easings + 3 durations + 4 `--animate-*` (menu-in/drawer-in/drawer-in-rtl/scrim-in) + `--transition-falcon-row` | `[CODE]` |
| 13 | **Tree rail / background-images** | `:410-441` | `--color-falcon-rail-turn`/`-trail` (the **single-source-of-truth two-tone hover trail**) + 3 `--background-image-falcon-*` (rail-guide, rail-default, chart-grid) | Change the 2 rail vars to recolor the whole tree hover path. `[CODE] :417-420`. (Prior audit's `--background-image-falcon-rail-on-path` was renamed → `rail-turn`/`-trail` + `rail-guide`.) |
| 14 | **Misc tokens** | scattered | Stencil-override tokens (`--color-falcon-table-bg-soft`, `--spacing-table-*-pad`, `--spacing-applications-name-col`) `:443-455` · z-index scale (10 steps, dropdown1000→tooltip1070→drawer-modal99999) `:462-474` · 11 `--tracking-*` `:477-492` · `--opacity-falcon-skeleton`(0.6) `:507` · `--spacing-falcon-node-gap`(1.5rem) `:519` · `--text-muted` `:408` | `[CODE]` |

### 2c. Outside the `@theme` block

| Construct | Lines | Role |
|---|---|---|
| Dark-mode override block `:where(.app-dark,.app-dark *), :where(.dark,.dark *)` | `[CODE] :530-640` | Re-declares all 27 neutrals + 2 semantic bg + 9 shadows + 3 focus rings + teal option/mid + 5 teal alphas + popover-dark/orgchart-line/lilac/success tints + `--text-muted`. Geometry NOT overridden. |
| `body { color: var(--color-falcon-neutral-900); }` | `[CODE] :658-660` | Phase-H D-NEW-3 fix — anchors default text color so dark-mode descendants don't inherit UA black. |
| `@keyframes` | `[CODE] :663-698` | `menuIn`, `drawerIn`, `drawerInRtl`, `scrimIn` (referenced by `--animate-*`) + Studio set `falcon-fade`/`-scale`/`-slide`/`-soft-lift`/`-pulse`/`-loading`. |

## 3. The icon font — `styles/falcon-icons.css` (386 lines)

`[CODE] falcon-icons.css`
| Surface | Detail |
|---|---|
| `@font-face` `'Falcon Icons'` | `font-display: block`, `src: url('/assets/fonts/falcon-icons/falcon-icons.woff2') format('woff2')`. `:6-12` |
| Base class `.falcon-icon` | `font-family:'Falcon Icons'` + `display:inline-flex` (Wave 19 — was inline-block; fixes glyph vertical centering in buttons) + antialias hints. `:14-31` |
| Modifier `.falcon-icon-fw` | Fixed-width 1.28571429em, centered. `:38-41` |
| Modifier `.falcon-icon-spin` | 2s linear infinite spin; **`prefers-reduced-motion` guard** collapses to 1ms. `:43-61` + `:48-61` |
| **Glyph rules** | **314** `.falcon-icon-{name}::before { content: "\eXXX"; }` rules spanning codepoints `\e900`–`\ea39`. **grep-verified count = 314** `[CODE]` (matches B11's prior 314 correction; supersedes the legacy "122 PrimeIcons subset"). |

### Icon glyph families (314 total — grouped by intent)
- **Navigation / chevrons / carets / angles:** chevron-{left,right,up,down}(+circle variants), caret-{l,r,u,d}, angle-{l,r,u,d}+double, arrow-{l,r,u,d}(+circle, +up-right/up-left/down-left/down-right), bars, step-{forward,backward}(+alt), forward/backward/fast-*.
- **Actions / CRUD:** plus(+circle), minus(+circle), times(+circle), check(+circle, check-square), pencil/pen-to-square/file-edit/user-edit, trash/delete-left/eraser, save/copy/clone/file(+plus/check/arrow-up/word/excel/pdf/export/import/o), download/upload/cloud-{up,down}load, refresh/sync/undo/replay/history, print, ban.
- **Status / feedback:** info(+circle), exclamation-{circle,triangle}, question(+circle), spinner/spinner-dotted/hourglass/stopwatch/clock/calendar-clock, verified/circle(+fill,on,off), star(+fill,half,half-fill), heart(+fill), thumbs-{up,down}(+fill), bell(+slash), flag(+fill), bookmark(+fill), bullseye, wave-pulse, sparkles, lightbulb.
- **Media / UI chrome:** play(+circle), pause(+circle), stop(+circle), eject, volume-{up,down,off}, image(+s)/video/camera, search(+plus/minus), filter(+fill,slash), sort(+all alpha/numeric/amount/up/down variants), eye(+slash), expand/arrows-{h,v,alt}, window-{maximize,minimize}, sliders-{h,v}, palette, align-{l,r,center,justify}, list(+check), th-large, objects-column, table, ellipsis-{h,v}, cog.
- **Commerce / finance:** wallet, credit-card, money-bill, cart-{plus,minus,arrow-down}/shopping-{cart,bag}, receipt, dollar/euro/pound/percentage/indian-rupee/turkish-lira/bitcoin/ethereum, barcode/qrcode, gift, trophy, crown, shop, warehouse.
- **People / org:** user(+plus,minus,edit), users, id-card, address-book, sitemap, building(+columns), briefcase, graduation-cap, headphones, microphone, megaphone.
- **Comms / tech:** envelope/at/comment(+s)/send/reply/paperclip/share-alt, phone/mobile/tablet/desktop, wifi/link/external-link, code/database/server/microchip(+ai), key/lock(+open)/unlock/shield/power-off/sign-{in,out}, language, map(+marker)/compass/directions(+alt)/globe/home/car/truck/box/inbox/folder(+open,plus)/tag(+s)/hashtag/thumbtack/ticket.
- **Brand / vendor logos:** facebook, twitter, instagram, linkedin, github, youtube, vimeo, slack, discord, telegram, whatsapp, reddit, pinterest, tiktok, twitch, paypal, amazon, apple, android, google, microsoft, bitcoin, ethereum, prime, sun, moon.
- **Charts / misc:** chart-{line,bar,pie,scatter}, gauge, calculator, hammer, wrench, bolt, equals, asterisk, face-smile, venus/mars, star-half-fill.

> Full authoritative name↔codepoint table lives in `falcon-icons.css:73-386` and in the `falcon-icon` component dossier (B11).

## 4. Font assets — `src/assets/fonts/`

| Family | CSS token | Files | Use |
|---|---|---|---|
| Neue Haas Grotesk Display Pro | `--font-sans-latin` (= platform `--font-sans`) | `neue-haas/NeueHaasDisplay{Light,Roman,Mediu,Bold}.ttf` (4) | Latin default body/UI. ⚠️ `NeueHaasDisplayMediu.ttf` — truncated filename. `[CODE] tokens CSS :153` |
| Cairo | `--font-sans-ar` | `cairo/Cairo-{Regular,Medium,SemiBold,Bold}.ttf` (4) | Arabic sans. `[CODE] :154` |
| IBM Plex Sans Arabic | `--font-arabic` | `ibm-plex-arabic/IBMPlexSansArabic-{Regular,Medium,SemiBold,Bold}.ttf` (4) | Arabic display. `[CODE] :156` |
| Falcon Icons | `@font-face 'Falcon Icons'` | `falcon-icons/falcon-icons.woff2` (1) | Icon glyphs. `[CODE] falcon-icons.css:9` |
| **Stray zips** | — | `IBM_Plex_Sans_Arabic (1).zip`, `neue-haas-grotesk-display-pro-cdnfonts (1).zip` | Source download archives committed beside the unpacked fonts — should be removed (F-finding). |

**Note:** these CSS files declare `@font-face` ONLY for the icon font. The text-font `@font-face` declarations (Neue Haas / Cairo / IBM Plex) are NOT in this library's CSS — they are declared elsewhere (app global styles / `falcon-ui-tokens`), with this lib only naming the families in the `@theme` `--font-*` tokens and shipping the `.ttf` assets. (F-finding: the assets ship here but their `@font-face` wiring lives outside this lib — split ownership.)

## 5. The TS mirror — `tokens.ts` (913 lines, AUTO-GENERATED)

`[CODE] tokens.ts` — header: "AUTO-GENERATED — DO NOT EDIT BY HAND. Source: falcon-tailwind-tokens.css. Regenerate: `nx run falcon-theme:generate-tokens-ts`. Tokens: 289."
| Export | Shape | Purpose |
|---|---|---|
| `tokens` | `{ '<name>': 'var(--<name>)' }` (289 keys) | Token-name → CSS `var()` reference string. `:6-296` |
| `tokenValues` | `{ '<name>': '<literal>' }` | Token-name → resolved literal value (light-mode). `:298-588` |
| `colors`/`spacing`/`radii`/`shadows`/`typography`/`breakpoints`/`motion`/`zIndex`/`sizing`/`misc` | grouped `var()` maps | Categorized subsets for typed consumption. `:590-907` |
| `FalconTokens` / `FalconTokenName` / `FalconTokenValues` | derived types | Compile-time token-name union. `:909-913` |

**Generation contract** (`project.json:13-25`): `generate-tokens-ts` target runs `node libs/falcon-theme/scripts/generate-tokens-ts.mjs`; inputs = the SSOT CSS + the script; output = `tokens.ts`; `cache:true`. The `build` target is `nx:noop` and `dependsOn: ["generate-tokens-ts"]`; `lint` is `nx:noop`. `[CODE] project.json:7-29`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L07). Token families + counts read directly from `falcon-tailwind-tokens.css`; generated count (289) read from `tokens.ts:4`; 314 glyph rules grep-counted in `falcon-icons.css`; font assets enumerated from the directory listing; `package.json`/`project.json` export + target surface verified line-by-line. Stray zips + truncated `NeueHaasDisplayMediu.ttf` filename observed on disk. No source edited.
