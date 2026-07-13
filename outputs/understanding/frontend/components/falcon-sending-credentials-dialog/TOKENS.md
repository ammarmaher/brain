# falcon-sending-credentials-dialog — TOKENS

## Component token file

`[CODE]` **None.** There is no `libs/falcon-ui-tokens/src/components/sending-credentials*.tokens.css` (verified by glob — no `*credential*.tokens.css` file exists). This component is NOT part of the Stencil dual-render token contract; it is a pure Angular composite styled with Tailwind `falcon-*` utility classes directly in the template + a small inline `styles:` block.

Because there is no `:where(...)`-scoped token block, **gate-12 does not apply** to this component (gate-12 only governs `falcon-ui-tokens/src/components/*.tokens.css`). The styling therefore lives in two places:

1. **Template Tailwind utilities** referencing palette tokens (`[CODE]` html): `bg-falcon-neutral-0`, `text-falcon-neutral-900`, `text-falcon-neutral-700`, `text-falcon-neutral-600`, `border-falcon-neutral-300`, `border-falcon-teal-700`, `bg-falcon-teal-50`, `hover:bg-falcon-neutral-100`, `bg-falcon-teal-700`. These resolve to the global `--color-falcon-*` palette in `falcon-tailwind-tokens.css`.
2. **Inline `styles:` block** (`[CODE]` ts:47-86) — the dialog positioning + animation keyframes (see Static-style risks).

## Token categories

N/A (no token file). The visual axes are NOT token-driven; they are hardcoded utility classes / arbitrary values.

## Related Falcon theme tokens (palette consumed via utilities)

| Falcon palette token | Used by (template utility) |
|---|---|
| `--color-falcon-neutral-0` | panel + radio-dot + summary-icon bg (`bg-falcon-neutral-0`) |
| `--color-falcon-neutral-100 / 300 / 600 / 700 / 900` | hover bg / dashed borders / muted+key text / heading text |
| `--color-falcon-teal-50` | owner-summary card bg (`bg-falcon-teal-50`) |
| `--color-falcon-teal-700` | selected-card border + radio dot (`border-falcon-teal-700`, `bg-falcon-teal-700`) |

The selected-card ring and the panel shadow are **raw rgba arbitrary values**, not palette tokens (see below).

## Tailwind utility guidance for this component

There is no Tailwind-helper file and no token override surface. Customization is via the **label inputs** only (copy). Visual changes (card geometry, colors, illustrations, button variants) are shared-component upgrades — not per-consumer Tailwind overrides.

## Dark mode support

`[CODE]` **Not implemented / at risk.** The palette utilities (`bg-falcon-neutral-0`, etc.) would flip under `.app-dark` via the global token overrides, but the inline `styles:` block hardcodes light-mode values that do NOT flip:
- `dialog.falcon-sc-dialog::backdrop { background: rgba(13, 63, 68, 0.45); backdrop-filter: blur(2px); }` (`[CODE]` ts:81-84) — fixed teal-alpha scrim (acceptable in both themes, like the other dialogs).
- Panel `shadow-[0_24px_60px_rgba(0,0,0,0.18)]` (`[CODE]` html:26) and selected-card `shadow-[0_0_0_3px_rgba(13,63,68,0.08)]` (`[CODE]` html:62) — raw rgba, theme-independent.
- The illustration SVGs hardcode `fill="#0d3f44"` / `fill="#E1ECEA"` / `fill="#fff"` / `fill="#1a5e63"` (`[CODE]` html:87-124) — they will NOT adapt to dark mode.

> NOT verified in dark mode at runtime — flag for Agent 5 (theme). The hardcoded SVG fills are a known dark-mode parity gap (GAPS G2).

## Density support

N/A — fixed geometry. No density tokens.

## RTL support

`[CODE]` Partially logical-aware: the close X uses `end-5` (logical inline-end), cards use `text-start`, summary uses `truncate` — these flip in RTL. The illustration SVGs are direction-agnostic (centered). `[INFERRED]` Layout (3-col grid) mirrors via Tailwind RTL handling, but not verified end-to-end — flag for Agent 5.

## Static style risks

- `[CODE]` **Inline `styles:` block in the component decorator** (`[CODE]` ts:47-86) — the ONLY way Top-Layer dialog positioning works, since there is no `.css` file. It contains: 2 animation classes + 2 `@keyframes` (`fscBackdropIn`, `fscPanelIn`), the full `dialog.falcon-sc-dialog { … }` reset (border:0; padding:0; background:transparent; width/height:100%; inset:0; flex centering; padding:1.5rem), and `::backdrop` (rgba teal scrim + blur + animation). This is a **deliberate, documented Top-Layer regression fix** (`[CODE]` ts:56-64 sibling of `falcon-completion-success-dialog`), not stray CSS — but it does hardcode rgba + px values rather than tokens.
- `[CODE]` **Arbitrary-value Tailwind classes with raw rgba**: panel `shadow-[0_24px_60px_rgba(0,0,0,0.18)]`, selected-card `shadow-[0_0_0_3px_rgba(13,63,68,0.08)]`, panel `rounded-[18px]`, card `rounded-[14px]`, illustration `h-[130px]`, summary key text `text-[13px]`, card `style="border-width: 1.5px;"` (`[CODE]` html:67 — an inline style attribute). These bypass the Falcon token scale (e.g. `--falcon-radius-*`, `--falcon-spacing-*`).
- `[CODE]` **Hardcoded hex in inlined SVGs** (`#0d3f44`, `#E1ECEA`, `#fff`, `#1a5e63`) — copied verbatim from React; no token mapping.

These are flagged in `GAPS_AND_UPGRADES.md` (G2/G3) and `FINDINGS/B19.md` as `safe-local` token-discipline items — the standard convention is Falcon tokens over raw hex/px/rgb, but this composite predates/sidesteps that for pixel-parity with the React port. NOT enforced by lint (per `[MEMORY]` — house rules are enforced by night-shift-audit, not ESLint).

## No CSS / no SCSS guidance

- `[CODE]` There is **no `.scss`** and **no `.component.css`** — styling is inline `styles:` + template utilities. (Contrast the deleted legacy `send-credentials-popup`, which had a `.scss` file that violated the no-SCSS rule.)
- For consumers: do NOT add SCSS to restyle it. There is no token override surface; copy is the only safe per-instance change.

## Token usage by state

| State | Styling source |
|---|---|
| Panel | `bg-falcon-neutral-0` + `rounded-[18px]` + `shadow-[0_24px_60px_rgba(0,0,0,0.18)]` (`[CODE]` html:26) |
| Card — unselected | `border-[1.5px] border-dashed border-falcon-neutral-300 hover:border-falcon-teal-700` (`[CODE]` html:63-66) |
| Card — selected | `border border-solid border-falcon-teal-700 shadow-[0_0_0_3px_rgba(13,63,68,0.08)]` + teal radio dot (`[CODE]` html:60-62, 77) |
| Owner summary card | `bg-falcon-teal-50 rounded-xl` (`[CODE]` html:133) |
| Backdrop | inline `::backdrop { background: rgba(13,63,68,0.45); backdrop-filter: blur(2px); }` (`[CODE]` ts:81-84) |
| Send button | `<falcon-button-tw variant="primary">` (token-driven by button.tokens.css) (`[CODE]` html:185-191) |
| Cancel button | `<falcon-button-tw variant="link">` (token-driven by button.tokens.css) (`[CODE]` html:179-184) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19). No token file (glob-confirmed). Styling = inline `styles:` block (ts:47-86) + template Tailwind `falcon-*` utilities + arbitrary rgba/px values + hardcoded SVG hex. Dark-mode SVG-fill gap + raw-rgba/px token-discipline items flagged. gate-12 N/A (no `:where()` token block).
