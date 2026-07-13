# otp-dialog — TOKENS

> **Single-render Angular component — there is NO component token file** (`[CODE]` no `libs/falcon-ui-tokens/src/components/otp-dialog.tokens.css`) **and NO `.component.css`.** Worse for house-rule compliance: this component carries an **inline `<style>` block** (html:41-90) plus **dozens of literal `px` / `rgba` values in inline `style=` attributes**. It is a deliberate legacy/parity exception to the Falcon token-only mandate — comparable to `new-wallet-balance`. Rubric **B/E N/A**; gate-12 N/A (no token file). This is the central AUDIT finding for the component (see `GAPS_AND_UPGRADES.md`).

## Component token file

**NONE.** No tokens are declared for this component. The composed `<falcon-angular-otp>` primitive has its own `--falcon-otp-*` tokens (its dossier), but the DIALOG CHROME (card, paddings, fonts, ring, backdrop) is hardcoded inline.

## Token categories (declared by this component)

**Zero.** All chrome geometry/typography/shadow is literal.

## Inline `<style>` block (html:41-90) — the literals

`[CODE]` Two rules in a template `<style>`:

| Selector | Literal declarations | Note |
|---|---|---|
| `dialog.otp-dialog-host[open]` | `border:0; padding:0; background:transparent; max-width:none; max-height:none; width:100%; height:100%; margin:0; inset:0; overflow:visible; display:flex; align-items:center; justify-content:center; padding:1.5rem` | Pattern A full-viewport flex-centring container. The `[open]` scope is deliberate (UA `dialog:not([open])` hides a closed dialog even if `@if` races). html:64-79. |
| `dialog[data-component="app-otp-dialog"]::backdrop` | `background: rgba(13, 63, 68, 0.55); backdrop-filter: blur(1px)` | **Literal rgba** — the Falcon teal `#0d3f44` at 55% alpha hardcoded, NOT `var(--color-falcon-teal-alpha-*)`. html:80-83. |
| `dialog[data-component="app-otp-dialog"] .otp-box-wrapper` | `transform: scale(1.5); transform-origin:center; padding: 20px 40px` | Scales the OTP boxes to ~70px (SoT size) via a transform + literal px pad. html:84-89. |

## Literal `px` / inline `style=` values in the markup

`[CODE]` Inline `style=` attributes (a representative, not exhaustive, list):

| Element | Literal value | Line |
|---|---|---|
| Card | `width: 750px; max-width: 100%; max-height: 100%; box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30)` | html:96 |
| Teal accent stripe | `height: 8px` | html:100 |
| Close-X button | `top: 32px; inset-inline-end: 36px; width: 28px; height: 28px` | html:105 |
| Body wrapper | `padding: 72px 72px 64px 72px; gap: 36px` | html:115 |
| Title `<h2>` | `font-size: 40px` | html:119 |
| Subtitle group | `gap: 6px` | html:124 |
| Intro `<p>` | `font-size: 18px` | html:125 |
| Recipient `<p>` | `font-size: 22px` | html:128 |
| Spinner | `width: 56px; height: 56px; border-width: 4px` | html:137 |
| Success check | `width: 64px; height: 64px` | html:149 |
| Countdown ring | `width: 140px; height: 140px; margin-top: 12px` | html:199 |
| Countdown number | `font-size: 38px` | html:215 |
| Ring `<circle>` strokes | `stroke="var(--color-falcon-neutral-150, #e6eaee)"`, `stroke="var(--color-falcon-teal-700, #0d3f44)"` | html:203/207 (token-with-fallback — the ONLY token usage in the SVG) |

> So the chrome is ~95% literal px/rgba. The only token references in the whole template are: the two ring `<circle>` strokes (`var(--color-falcon-*, fallback)`, html:203/207) and the Falcon utility classes below.

## Tailwind utilities used (token-backed)

`[CODE]` Falcon utility classes DO appear (mixed with the literals): `bg-falcon-neutral-0` (card bg), `bg-falcon-teal-700` (accent + success), `text-falcon-neutral-900/800/700/600/400`, `text-falcon-teal-700`, `text-falcon-red-500` (errors), `rounded-2xl` (card), `animate-spin`, `border-falcon-neutral-150`, `border-t-falcon-teal-700`, `text-[15px]`/`text-[13px]`/`text-[16px]`/`text-[28px]` (arbitrary-px utilities — also literal-ish). These resolve theme tokens, but the geometry is the inline `style=` literals.

## Related Falcon theme tokens

| Falcon theme token | Used by this component via |
|---|---|
| `--color-falcon-neutral-0` | `bg-falcon-neutral-0` card. |
| `--color-falcon-teal-700` | accent stripe / success badge / verified text / ring stroke fallback. |
| `--color-falcon-neutral-150` | ring track stroke (via `var(...,#e6eaee)`). |
| `--color-falcon-red-500` | invalid/expired message text. |
| `--color-falcon-neutral-900..400` | titles / subtitles / hints. |

> Notably **the backdrop rgba(13,63,68,0.55) is NOT tokenized** despite `--color-falcon-teal-alpha-*` existing in the theme (used elsewhere, e.g. app.ts global loader). This is a direct token-rule miss.

## Tailwind utility guidance for this component

There is no clean override surface — the geometry is inline. A consumer cannot rescale the card or change paddings without editing the component. (Gap — the whole chrome should be rebuilt on `<falcon-angular-dialog>` + tokens; see GAPS.)

## Dark mode support

⚠️ `[CODE]` **Partial / at-risk.** The Falcon-utility colors (`text-falcon-neutral-*`, `bg-falcon-neutral-0`) flip with `.app-dark`, but:
- The **literal backdrop** `rgba(13,63,68,0.55)` does NOT respond to dark mode (fixed teal).
- The **box-shadow** `rgba(13,63,68,0.30)` is fixed.
- The ring stroke fallbacks (`#e6eaee` / `#0d3f44`) only fire if the tokens are missing, but the literals don't dark-adapt.
- `bg-falcon-neutral-0` card on a fixed-teal backdrop may have reduced contrast in dark mode.

`[INFERRED]` Net: the modal is visually fine in light mode (its design target) but its dark-mode behavior is not token-clean. Flag.

## Density support

**N/A** — fixed `750px` card + literal paddings; no density axis. The composed OTP boxes are `scale(1.5)`'d (html:88) regardless of density.

## RTL support

- `[CODE]` Mostly RTL-correct via logical properties: `inset: 0` (style block), `inset-inline-end: 36px` (close-X, html:105), and the auto-open-fix comment explicitly notes the prior `inset:0 + margin:0` top-LEFT-in-LTR / top-RIGHT-in-RTL bug that Pattern A fixed (html:42-56). The `::backdrop` + flex-centring is direction-agnostic.
- The OTP boxes / `·` separator use `left-1/2`/`-translate-x-1/2` (html:173) — physical, but centered so direction-neutral.

## Static style risks

- 🔴 `[CODE]` **HIGH (by house-rule standard):** inline `<style>` block (html:41-90) + ~14 literal-px/rgba inline `style=` attributes + a literal `rgba(13,63,68,0.55)` backdrop. This is the dominant audit finding. It is a KNOWN deliberate exception (legacy port), not an accident — but it is the canonical example of what NOT to do in a new Falcon component.
- `[CODE]` The two ring `<circle>` strokes use `var(--color-falcon-*, #fallback)` (html:203/207) — token-with-fallback, acceptable.
- `[CODE]` The `eslint-disable no-restricted-syntax` pattern seen on app.ts for high-z-index chrome is NOT present here; the inline literals are simply un-gated (no ESLint ban on inline `style=` in feature templates per `[MEMORY]` enforcement-honesty note).

## No CSS / no SCSS guidance

- ✅ No SCSS, no `.component.css` (good).
- 🔴 But an inline `<style>` block + literal `style=` everywhere (bad). The canonical fix: replace the hand-built `<dialog>` chrome with `<falcon-angular-dialog>` (which owns overlay/card/backdrop/focus-trap + `--falcon-dialog-*` tokens) and move geometry into tokens — eliminating the `<style>` block and the literals. See GAPS G-TOKENS / the deletion-consolidation candidate.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Card / chrome geometry | **literals** (750px width, paddings, font sizes, shadow) — no tokens. |
| Backdrop | **literal** `rgba(13,63,68,0.55)` (should be `--color-falcon-teal-alpha-*`). |
| Accent / success | `--color-falcon-teal-700` (via `bg-falcon-teal-700`). |
| Error/expired text | `--color-falcon-red-500` (via `text-falcon-red-500`). |
| Ring track / progress | `--color-falcon-neutral-150` / `--color-falcon-teal-700` (via `var(...,fallback)`). |
| OTP boxes | `--falcon-otp-*` (inherited from the composed `<falcon-angular-otp>` primitive) + a `scale(1.5)` transform. |

## Verification
🟡 CODE-DERIVED 2026-06-03 (B27, NEW). Confirmed NO token file + NO `.component.css` (glob = ts/html/index only). The inline `<style>` block (html:41-90) + literal-px/rgba inline styles enumerated verbatim from html (96/100/105/115/119/125/128/137/149/199/215). Token references limited to ring strokes (203/207) + Falcon utility classes. Backdrop `rgba(13,63,68,0.55)` confirmed non-tokenized despite available `--color-falcon-teal-alpha-*`. This is the component's headline audit issue.
