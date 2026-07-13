# falcon-icon — OVERVIEW

## Component purpose

Thin **dual-render wrapper around the vendored Falcon icon FONT** (`libs/falcon-theme/src/styles/falcon-icons.css`). Renders `<i class="falcon-icon falcon-icon-{name}">` with standardised size tokens (xs/sm/md/lg/xl) + a correct a11y posture (decorative `aria-hidden` by default; meaningful via `decorative=false` + `label`). Exists so consumers stop hand-writing the raw `<i class="falcon-icon falcon-icon-X">` and get consistent sizing + accessibility for free. Cross-framework (Angular / React / Vue / plain JS).

## The icon FONT, the name set, and the `pi pi-*` rule

`[CODE]` falcon-icons.css — the Falcon Icons font is a **drop-in PrimeIcons replacement** (Wave PR-8): "same woff2 codepoints, new font-family (`'Falcon Icons'`) + class prefix (`falcon-icon-`) so the workspace carries no PrimeNG identifiers." (header comment, lines 1-4).

- **Glyph contract:** a name is valid iff `.falcon-icon-{name}::before { content: "\eXXX" }` exists in `falcon-icons.css`. The component renders the class **unconditionally** — an unknown name yields an empty `<i>` (silent; GAP).
- **Name set size:** `[CODE]` the live `falcon-icons.css` declares **314 glyph rules** (`.falcon-icon-*::before { content: … }`, codepoints `\e900`–`\ea39`) plus 2 utility classes (`.falcon-icon-fw` fixed-width, `.falcon-icon-spin` + its `@keyframes`). **This corrects the long-standing "122 icons" figure** in prior dossiers/memory — 122 was the original PrimeIcons-migration subset; the live font now carries 314 glyphs.
- **How a name maps to a glyph:** `name="trash"` → wrapper sets class `falcon-icon falcon-icon-trash` → CSS `.falcon-icon-trash::before { content: "\e93d" }` paints codepoint U+E93D from the `'Falcon Icons'` woff2. The font-family declaration (`@font-face`) is loaded **once globally** via `falcon-icons.css` and cascades through Shadow boundaries; the Shadow component re-declares only the `.falcon-icon` class chain (class CSS does not pierce the boundary).
- **The no-`pi pi-*` rule:** PrimeIcons are physically removed; never write `<i class="pi pi-X">`. Use `<falcon-angular-icon name="X">` (preferred) or, at minimum, the raw `<i class="falcon-icon falcon-icon-X">` class.

### Full icon-name set (314 glyphs, grouped)

`[CODE]` enumerated from `falcon-icons.css` (names below, all consumed WITHOUT the `falcon-icon-` prefix):

- **Chevrons / carets / angles / arrows:** `chevron-{left,right,down,up}`, `chevron-circle-{left,right,down,up}`, `caret-{left,right,down,up}`, `angle-{left,right,down,up}`, `angle-double-{left,right,down,up}`, `arrow-{left,right,down,up}`, `arrow-circle-{down,left,right,up}`, `arrow-up-{left,right}`, `arrow-down-{left,right}`, `arrow-right-arrow-left`, `arrow-up-right-and-arrow-down-left-from-center`, `arrow-down-left-and-arrow-up-right-to-center`, `arrows-{h,v}`, `arrows-alt`, `directions`, `directions-alt`, `expand`.
- **Status / feedback:** `check`, `check-circle`, `check-square`, `times`, `times-circle`, `plus`, `plus-circle`, `minus`, `minus-circle`, `circle`, `circle-fill`, `circle-{on,off}`, `info`, `info-circle`, `question`, `question-circle`, `exclamation-circle`, `exclamation-triangle`, `ban`, `verified`, `equals`, `asterisk`.
- **Actions / editing:** `pencil`, `pen-to-square`, `file-edit`, `user-edit`, `eraser`, `delete-left`, `trash`, `copy`, `clone`, `save`, `print`, `download`, `upload`, `cloud-{download,upload,cloud}`, `file-{import,export,arrow-up,plus,check}`, `reply`, `share-alt`, `link`, `external-link`, `undo`, `replay`, `refresh`, `sync`, `history`.
- **Sort / filter / view:** `sort`, `sort-{up,down}`, `sort-{up,down}-fill`, `sort-alt`, `sort-alt-slash`, `sort-alpha-{up,down,up-alt,down-alt}`, `sort-numeric-{up,down,up-alt,down-alt}`, `sort-amount-{up,down,up-alt,down-alt}`, `filter`, `filter-fill`, `filter-slash`, `list`, `list-check`, `th-large`, `objects-column`, `bars`, `align-{left,right,center,justify}`, `sliders-{h,v}`.
- **Media / playback:** `play`, `play-circle`, `pause`, `pause-circle`, `stop`, `stop-circle`, `forward`, `backward`, `fast-forward`, `fast-backward`, `step-forward`, `step-backward`, `step-forward-alt`, `step-backward-alt`, `eject`, `volume-{up,down,off}`, `microphone`, `headphones`, `video`, `image`, `images`, `camera`, `megaphone`.
- **Commerce / finance:** `wallet`, `credit-card`, `money-bill`, `dollar`, `euro`, `pound`, `percentage`, `turkish-lira`, `indian-rupee`, `bitcoin`, `ethereum`, `shopping-cart`, `shopping-bag`, `cart-{plus,minus,arrow-down}`, `receipt`, `gift`, `barcode`, `qrcode`, `calculator`, `tag`, `tags`, `ticket`.
- **People / org / objects:** `user`, `users`, `user-{plus,minus,edit}`, `id-card`, `address-book`, `building`, `building-columns`, `warehouse`, `shop`, `briefcase`, `sitemap`, `crown`, `trophy`, `graduation-cap`, `box`, `truck`, `car`, `home`.
- **Files / data / system:** `file`, `file-o`, `file-{word,excel,pdf,plus,check,edit}`, `folder`, `folder-open`, `folder-plus`, `clipboard`, `book`, `bookmark`, `bookmark-fill`, `inbox`, `envelope`, `paperclip`, `database`, `server`, `microchip`, `microchip-ai`, `code`, `table`, `desktop`, `mobile`, `tablet`, `hashtag`, `at`, `key`, `lock`, `lock-open`, `unlock`, `shield`, `power-off`, `cog`, `wrench`, `hammer`, `gauge`, `wave-pulse`.
- **Charts / analytics:** `chart-{bar,line,pie,scatter}`, `bullseye`.
- **Comms / social:** `comment`, `comments`, `phone`, `send`, `bell`, `bell-slash`, `flag`, `flag-fill`, `globe`, `map`, `map-marker`, `compass`, `wifi`, `language`, `whatsapp`, `telegram`, `slack`, `discord`, `facebook`, `twitter`, `twitch`, `instagram`, `linkedin`, `github`, `youtube`, `vimeo`, `pinterest`, `reddit`, `tiktok`, `paypal`, `amazon`, `google`, `apple`, `microsoft`, `android`, `prime`.
- **Misc / UI chrome:** `search`, `search-{plus,minus}`, `eye`, `eye-slash`, `heart`, `heart-fill`, `thumbs-{up,down}`, `thumbs-{up,down}-fill`, `star`, `star-fill`, `star-half`, `star-half-fill`, `bolt`, `lightbulb`, `sparkles`, `palette`, `sun`, `moon`, `sign-{in,out}`, `ellipsis-{h,v}`, `thumbtack`, `face-smile`, `window-{maximize,minimize}`, `clock`, `stopwatch`, `hourglass`, `calendar`, `calendar-{clock,plus,minus,times}`, `spinner`, `spinner-dotted`, `venus`, `mars`.

> The complete authoritative list always lives in `falcon-icons.css` — **read it directly for "is icon X available?"**; this grouped list is a snapshot of the 314 names.

## Business / UI use case

- The standard way to render any Falcon-font glyph across all UIs.
- Inside buttons (`slot="icon-start"`/`icon-end`), menus, accordions, tabs, badges, status indicators.
- Form-field decorations (info-circle next to a label), date-band glyphs, empty-state illustrations.

## When to use it / when NOT to use it

**Use it for:**
- Any bare glyph in the Falcon icon set (the 314 names above).
- Consistent sizing (xs/sm/md/lg/xl) tied to icon tokens.
- Correct a11y posture (decorative-by-default; meaningful via `label`).

**Do NOT use it for:**
- A **platform-owned, exact** SVG glyph the font cannot carry (e.g. the SAR currency symbol) → the shared **`<falcon-svg-icon name="…">`** registry (`[CODE]` libs/falcon/src/shared-ui/lib/ui/svg-icon/`, exported from `@falcon` as `SvgIconComponent` + `SVG_ICON_NAMES`). E.g. `currency-sar` is shared by wallet / applications-table / Add-Client / comm-mkt-view.
- A one-off third-party / brand SVG not in the font → raw `<svg>` or `<iconify-icon>` (Iconify is installed as a side-effect import).
- Images / avatars → `<falcon-angular-avatar>`. Brand logos → raw `<img>`.

## Status

**ACTIVE.** Wave 9.E. Architect §5.12.1 foundation. The vendored font replaced all `pi pi-*` PrimeIcons (Wave PR-8). The `<falcon-angular-icon>` wrapper is the **preferred** form; many existing files still use the bare `<i class="falcon-icon …">` pattern (a documented adoption gap — but the wrapper now HAS real consumers; see below).

## Replaces

- PrimeIcons `<i class="pi pi-X">` (Wave PR-8).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-icon/falcon-icon.component.ts` (66 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-icon/falcon-icon.component.html` (21 ln — pure tag-switcher) |
| Angular wrapper CSS | **NONE** — `[CODE]` host layout via `@HostBinding('class')` = `'falcon-angular-icon inline-flex align-middle'` (component.ts:61). |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-icon/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-icon/falcon-icon.tsx` (44 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-icon/falcon-icon.css` (72 ln — token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-icon-tw/falcon-icon-tw.tsx` (39 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-icon/falcon-icon.types.ts` (4 ln) |
| Utils | **NONE.** |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/icon-tailwind-classes.ts` (`falconIconClasses()`) |
| Icon font CSS (registry) | `libs/falcon-theme/src/styles/falcon-icons.css` (**386 ln; 314 glyph rules**) |
| Font asset | `libs/falcon-theme/src/assets/fonts/falcon-icons/falcon-icons.woff2` |
| Component token file | `libs/falcon-ui-tokens/src/components/icon.tokens.css` (31 lines) |
| Spec / e2e | **NONE** — no `falcon-icon.spec.ts` / `.e2e.ts` for any layer (verified 2026-06-03). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-icon` |
| Stencil Shadow tag | `<falcon-icon>` |
| Stencil Light tag | `<falcon-icon-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `falcon-angular-icon` across `apps/` = **12 occurrences across 5 files**, plus shared use in `libs/falcon/`. Representative:

- `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts` — heaviest single user: `name="calendar"` (3× in the dates band), `name="ban"`/`name="credit-card"`/`name="check"` (action-button icons via `@switch`).
- `apps/admin-console/src/app/features/wallet-balance-management/components/balance-transfer/balance-transfer.component.html` (3) + the management-console twin (2).
- `apps/admin-console/src/app/features/new-wallet-balance/components/wb-icons/wb-icons.component.ts` (3).
- `apps/management-console/src/app/features/new-wallet-balance/components/wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.html` (3) + its `__tests__/standards-drawer.spec.ts`.

> **Drift corrected (B11):** the prior dossier's "0 consumers (Wave 7)" is **stale** — the wrapper is adopted in comm-mkt-view + the wallet/new-wallet features. The icon FONT CLASS (`<i class="falcon-icon falcon-icon-X">`) remains far more widespread; migrating those to the wrapper is the open adoption gap. See USAGE.md Consumer Sweep.

## Related components

- `falcon-angular-button` — `<falcon-angular-icon slot="icon-start">` is the blessed way to put a glyph in a button (comm-mkt-card does exactly this).
- `falcon-angular-avatar` — falls back to a `<i class="falcon-icon …">` glyph when no `src`/`initials` (renders the class directly, not a nested `<falcon-angular-icon>`).
- `falcon-angular-empty-state` — composes an icon for the empty illustration.
- `falcon-svg-icon` — the shared multi-path **SVG registry** (`SVG_ICON_REGISTRY` / `SVG_ICON_NAMES`, `@falcon` → `SvgIconComponent`). The blessed home for platform-owned exact SVG glyphs the icon font cannot carry (e.g. `currency-sar`). Prefer over re-drawing SVG inline.
- `iconify-icon` — secondary side-effect import for non-Falcon third-party glyphs.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). The vendored font is curated — adding a glyph is a **registry change** (font asset + `falcon-icons.css` regeneration), not a per-component change.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B11 sweep). Source-file table re-confirmed (wrapper has NO `.css`/utils/spec). **Icon-name set counted at exactly 314 glyph `::before` rules in `falcon-icons.css` — the "122 icons" figure corrected.** Consumer list refreshed: 12 wrapper occurrences across 5 app files + comm-mkt-view in `libs/falcon` (prior "0 consumers" corrected).
