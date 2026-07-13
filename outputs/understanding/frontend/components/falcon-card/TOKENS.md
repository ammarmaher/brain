# falcon-card — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/card.tokens.css` (**66 lines**, 6 categories — recount 2026-06-03).

`[CODE]` card.tokens.css:15 — selector `:where(falcon-card, falcon-card-tw, falcon-angular-card, .falcon-card, [data-falcon-card])`. `:where()` keeps specificity 0. **gate-12 compliant** (scoped, not `:root`).

> **CRITICAL (corrected 2026-06-03):** these `--falcon-card-*` tokens are consumed by the **Stencil Shadow `<falcon-card>` CSS only** (`falcon-card.css`, used by the React/Vue output targets). The **Angular wrapper does NOT consume them** — it renders pure-Angular `<div>` chrome whose classes come from the LIVE `classes()`/`bodyClasses()`/… helpers, which emit **hardcoded `bg-falcon-*` palette utilities** (`card-tailwind-classes.ts` mirror). So a per-instance `--falcon-card-*` override has **no effect on `<falcon-angular-card>`** — use `rootClass` + palette utilities on the Angular path. (Even though the selector lists `falcon-angular-card`, the wrapper's `<div>`s don't read those vars.)

## Token categories (6 declared)

`[CODE]` card.tokens.css:16-65:

1. **LAYOUT** — `--falcon-card-{radius (8px), radius-sm (6px), radius-lg (14px), border-width (1px), border-color (neutral-150), outlined-border-color (neutral-200)}`.
2. **SURFACE** — `--falcon-card-{bg (`--color-white`), fg (neutral-800), shadow (`0 1px 3px …`)}`.
3. **TYPOGRAPHY** — `--falcon-card-{font-family (`--font-sans`), font-size (14px / sm 13px / lg 15px)}`.
4. **HEADER** — `--falcon-card-{header-padding (16px 16px 12px), header-font-size (14px), header-font-weight (600), header-fg (neutral-900), subheader-font-size (12px), subheader-fg (neutral-600), header-border-width (0px), header-border-color (transparent)}`.
5. **BODY** — `--falcon-card-body-padding (16px)`.
6. **FOOTER** — `--falcon-card-{footer-padding (12px 16px), footer-border-color (neutral-150), footer-font-size (12px), footer-fg (neutral-700)}`.

## Related Falcon theme tokens (Shadow path)

| Card token | References |
|---|---|
| `--falcon-card-bg` | `var(--color-white, #ffffff)` |
| `--falcon-card-fg` | `var(--color-falcon-neutral-800)` |
| `--falcon-card-border-color` / `-outlined-border-color` | `var(--color-falcon-neutral-150)` / `-200` |
| `--falcon-card-header-fg` / `-subheader-fg` | `var(--color-falcon-neutral-900)` / `-600` |
| `--falcon-card-footer-fg` / `-footer-border-color` | `var(--color-falcon-neutral-700)` / `neutral-150` |
| `--falcon-card-shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)` |

## Angular-path classes (what actually renders for `<falcon-angular-card>`)

`[CODE]` falcon-card.component.ts:89-103 / card-tailwind-classes.ts — hardcoded palette utilities, NOT tokens:
- root: `bg-falcon-neutral-0` + per-variant `border-falcon-neutral-{150|200}` + `shadow-sm` (default) + per-size `rounded-{md|lg|[14px]}` + `text-{[13px]|sm|[15px]}`.
- body: `p-3` / `p-4` / `p-6`.
- header: `px-{3|4|6} pt-{3|4|6} pb-{2|3|4}` + `flex flex-col gap-1`.
- footer: `px-{3|4|6} py-{2|3|4}` + `flex items-center border-t border-falcon-neutral-150`.

## Tailwind utility guidance
- Layout utilities on host: `class="block h-full w-full max-w-md"`.
- Per-instance accent: `rootClass="border-falcon-error-200 bg-falcon-error-50"` (appended to the root `classes()`).
- Do NOT add `bg-*`/`border-*`/`shadow-*`/`rounded-*` on the HOST element — they don't reach the inner root; use `rootClass`.

## Dark mode support
- Angular path: classes use `bg-falcon-neutral-0` (a palette token that flips in dark mode), so the surface follows the dark inversions.
- `[CODE]` Shadow path: `--falcon-card-bg` references `--color-white` which is **NOT in the dark override map** — a Shadow card would stay white-ish in dark mode unless the consumer overrides `--falcon-card-bg`. **Risk noted (Shadow/React-Vue only); the Angular path uses `bg-falcon-neutral-0` and is fine.**

## Density support
Via the `size` prop. Radius `sm`=6px / `md`=8px / `lg`=14px; body padding 12/16/24px; header/footer padding scale by size; font 13/14/15px (Angular path uses the per-size Tailwind classes above; Shadow path uses the size-fixed body/header/footer padding tokens + per-size radius/font tokens).

## RTL support
Card is symmetrical (logical `border-t` footer, symmetric padding). RTL works via `direction: rtl` flip.

## Static style risks
- `[CODE]` falcon-card-tw.tsx:59 — the Shadow/`-tw` source hardcodes `text-xs` for the subheader instead of reading `--falcon-card-subheader-font-size` (12px). The **Angular wrapper** also hardcodes `text-xs text-falcon-neutral-600` (html:22). Cosmetic — `text-xs` ≈ the token's 12px.
- `[CODE]` card.css verified token-only for the Shadow path (every visual value reads `--falcon-card-*`; the only literals are structural flex/overflow + the footer `border-top: 1px solid var(--falcon-card-footer-border-color)`).

## No CSS / no SCSS guidance
- No `.scss` file for cards.
- Angular path: override via `rootClass` + palette utilities. Shadow path: override via `--falcon-card-*` tokens.

## Token usage cheat-sheet (Shadow path)

| Concern | Token |
|---|---|
| Radius (default / sm / lg) | `--falcon-card-radius` / `-radius-sm` / `-radius-lg` |
| Border width / color / outlined | `--falcon-card-border-width` / `-border-color` / `-outlined-border-color` |
| Surface bg / text / shadow | `--falcon-card-bg` / `-fg` / `-shadow` |
| Header padding / title size / weight | `--falcon-card-header-padding` / `-header-font-size` / `-header-font-weight` |
| Subheader size / fg | `--falcon-card-subheader-font-size` / `-subheader-fg` |
| Body padding | `--falcon-card-body-padding` |
| Footer padding / border / font | `--falcon-card-footer-padding` / `-footer-border-color` / `-footer-font-size` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 66 lines / 6 categories. **Corrected:** the `--falcon-card-*` tokens are consumed by the Shadow path only (React/Vue); the Angular wrapper renders hardcoded `bg-falcon-*` palette utilities and ignores them — override the Angular path via `rootClass`. Subheader `text-xs` hardcode confirmed in both `-tw` source and the Angular template.
