# falcon-view-toggle — TOKENS

## Component token file

`[CODE]` **NONE.** There is no `libs/falcon-ui-tokens/src/components/view-toggle.tokens.css`, and no per-component CSS file. This is a single-render pure-Angular shared-ui component whose entire visual contract is **inline Tailwind utility classes** in `falcon-view-toggle.component.html`. Contrast with falcon-input, which ships a ~237-line `input.tokens.css` scoped under `:where(...)`. None of the gate-12 `:where()` token-scope machinery applies here because there is no token file to scope.

## How styling actually works

`[CODE]` falcon-view-toggle.component.html:1-9 — all color/spacing/radius is expressed as Tailwind utilities that resolve through the Falcon Tailwind theme (`--falcon-*` design tokens compiled into the utility classes):

| Surface | Utilities | Falcon token(s) behind them |
|---|---|---|
| Container | `bg-falcon-neutral-50 rounded-xs p-0.5 border border-falcon-neutral-150` (html:1) | `--color-falcon-neutral-50`, `--color-falcon-neutral-150`, `--falcon-radius-xs`, spacing-0.5 |
| Active pill | `bg-falcon-neutral-0 text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]` (html:8) | `--color-falcon-neutral-0`, `--color-falcon-teal-700` + an **inline shadow literal** (NOT a token) |
| Active pill (dark) | `dark:bg-falcon-teal-500 dark:text-falcon-neutral-0 dark:shadow-none` (html:8) | `--color-falcon-teal-500`, `--color-falcon-neutral-0` |
| Inactive pill | `bg-transparent text-falcon-neutral-600 hover:text-falcon-neutral-900` (html:9) | `--color-falcon-neutral-600`, `--color-falcon-neutral-900` |
| Inactive pill (dark) | `dark:text-falcon-neutral-400 dark:hover:text-falcon-neutral-900` (html:9) | `--color-falcon-neutral-400`, `--color-falcon-neutral-900` |
| Pill geometry | `px-2 py-1.5 rounded-xs text-xs font-medium leading-tight` (html:7) | spacing-2 / spacing-1.5, `--falcon-radius-xs`, `--font-size-xs`, `--font-weight-medium` |
| Icon size | SVG `width="12" height="12"` (html:13/23); custom-icon `text-[12px]` (html:32) | hardcoded 12px (matches the component's documented 12×12 icon spec) |

## Token categories

`[CODE]` N/A — no declared token file, so no `--falcon-view-toggle-*` token namespace exists. Everything is theme-token-backed Tailwind utilities (good for dark mode + RTL via the global theme) plus the few raw values flagged below.

## Related Falcon theme tokens (consumed via utilities)

| Falcon theme token | Used via |
|---|---|
| `--color-falcon-neutral-{0,50,150,400,600,900}` | container bg/border, active/inactive text |
| `--color-falcon-teal-{500,700}` | active pill text (light) + active pill bg (dark) |
| `--falcon-radius-xs` | container + pill radius (`rounded-xs`) |
| `--font-size-xs`, `--font-weight-medium` | pill label type |

## Tailwind utility guidance for this component

Consumers should **not** try to override the pill colors via Tailwind on the host — there is no class hook into the inner buttons. Layout-only utilities (margins, width) belong on the host `class=`. Anything deeper requires upstreaming a `--falcon-view-toggle-*` token contract (GAP G6).

## Dark mode support

`[CODE]` html:8-9 — dark mode IS handled, but **inline per-utility** via `dark:` variants (`dark:bg-falcon-teal-500`, `dark:text-falcon-neutral-0`, `dark:shadow-none`, `dark:text-falcon-neutral-400`), NOT via a token layer that auto-flips. This works but couples dark-mode to the template; a token-driven approach (like falcon-input's `:where(.app-dark)` overrides) would be cleaner. Verified the dark classes exist for both active and inactive states.

## Density support

`[CODE]` None — fixed `px-2 py-1.5 text-xs`, icons 12×12. No density alias, no `size` input.

## RTL support

`[INFERRED]` The container is `inline-flex items-center gap-0.5` (html:1) and pills are `inline-flex items-center gap-2` (html:7) — gap/flex layout mirrors automatically under `[dir='rtl']` via the global theme, so the icon-then-label order flips correctly. No explicit RTL handling in the component; relies on flex direction + the page-level `dir`. NOT verified end-to-end in this audit — flag for theme review.

## Static style risks

- `[CODE]` html:8 — **`shadow-[0_1px_3px_rgba(13,63,68,0.08)]`** is an arbitrary Tailwind value containing a raw `rgba()` color literal `(13,63,68,...)` (the teal-ish drop shadow). This is a **house-rule deviation** (tokens-over-literals) — it should be a `--falcon-*` shadow token. The component header comment (ts:9) documents it as a deliberate match to the source spec, but it remains a raw literal. Severity 🟡 (FINDINGS / GAP G7).
- `[CODE]` html:32 — custom-icon glyph uses `text-[12px]` (arbitrary px) while the rest of the template uses the `text-xs` token. Minor inconsistency 🟡 (GAP G7).
- `[CODE]` SVG icons hardcode `width="12" height="12"` — acceptable for inline SVG (matches the documented 12×12 icon spec), but not token-driven.
- No SCSS, no inline `style=` attributes — clean on those axes.

## No CSS / no SCSS guidance

- The component has zero `.css`/`.scss` — correct per the no-SCSS / Tailwind-only house rule.
- Consumers MUST NOT add a `.component.css` rule targeting the inner pills. There is no token-override path (no token file); deeper customization must be upstreamed as a token contract.

## Token usage by state

| State | "Token"(s) consumed (via utilities) |
|---|---|
| Container | `bg-falcon-neutral-50`, `border-falcon-neutral-150`, `rounded-xs` |
| Active | `bg-falcon-neutral-0`, `text-falcon-teal-700`, `shadow-[…rgba…]` (raw), dark: `bg-falcon-teal-500`/`text-falcon-neutral-0` |
| Inactive | `bg-transparent`, `text-falcon-neutral-600`, dark: `text-falcon-neutral-400` |
| Hover (inactive) | `hover:text-falcon-neutral-900`, dark: `dark:hover:text-falcon-neutral-900` |
| Disabled | _None — no disabled state exists._ |
| Loading | _None — no loading state exists._ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Confirmed NO token file + NO component CSS — styling is 100% inline Tailwind. Dark-mode handled via inline `dark:` variants. Two raw-value deviations flagged: the active-pill `rgba()` shadow + `text-[12px]` custom-icon size.
