# falcon-completion-success-dialog — TOKENS

## Component token file

**None.** `[CODE]` listing 2026-06-03 — there is no `libs/falcon-ui-tokens/src/components/completion-success.tokens.css`. Unlike the canonical `falcon-input` (which has a `:where()`-scoped token file), this dialog carries its visual contract in **two non-token places**:
1. An **inline `styles: [...]` block** on the component (`[CODE]` `falcon-completion-success-dialog.component.ts:37-81`).
2. **Tailwind utilities + arbitrary literals** in the template (`[CODE]` `.html:27,34,71,72`).

This is the same deliberate native-`<dialog>` Top-Layer pattern as `falcon-popup` (which also has inline styles + no token file). **GAP G-TOKENS** (FINDINGS) — flagged, not fixed.

## What the inline `styles:` block contains

`[CODE]` `falcon-completion-success-dialog.component.ts:37-81`:
- `.falcon-cs-backdrop-in` / `.falcon-cs-panel-in` animations + `@keyframes fcsBackdropIn` / `fcsPanelIn` (160ms ease-out / 220ms cubic-bezier) — literal durations + transforms.
- `dialog.falcon-cs-dialog { … display:flex; align-items:center; justify-content:center; padding:1.5rem; inset:0; … }` — the Top-Layer-regression-fix that stretches the native `<dialog>` to the viewport and centers the inner `<section>` (see the verbose 2026-05-24 comment at `:46-59`).
- `dialog.falcon-cs-dialog::backdrop { background: rgba(13, 63, 68, 0.45); backdrop-filter: blur(2px); … }` — **literal teal-tinted dim + 2px blur** (NOT a token; not per-instance overridable). This is the SAME literal as `falcon-dialog`/`falcon-popup` `::backdrop` (Top-Layer cascade override). **GAP** — mint a `--falcon-completion-success-backdrop-*` (or a shared `--falcon-overlay-backdrop-*`) token.

## Token references in the template

`[CODE]` `.html`:
- Surface: `bg-falcon-neutral-0` (panel), `text-falcon-neutral-900` (title), `text-falcon-neutral-600` (subtitle), `text-falcon-neutral-700` + `hover:bg-falcon-neutral-100` (× button) — these DO use Falcon palette tokens. ✅
- Arbitrary literals (off-scale): `rounded-[18px]`, `shadow-[0_24px_60px_rgba(0,0,0,0.18)]`, `max-w-[560px]`, `text-[22px]` (`:27,71`). **GAP G-PX** — not on the `--falcon-radius-*` / `--falcon-font-size-*` / spacing scale.

## Decorative SVG literals

`[CODE]` `.html:44-66` — the inlined `SuccessIllo` illustration uses raw hex fills/strokes (`#E1ECEA`, `#1a5e63`, `#0d3f44`, `#9bb6b1`, `#fff`). A pixel-parity port of the React art. Not token-driven; **will NOT re-tint in dark mode** (GAP G-SVG-LITERALS). Low priority — decorative brand art.

## Related Falcon theme tokens

| Falcon theme token | Used by this dialog via |
|---|---|
| `--color-falcon-neutral-0` | panel background (`bg-falcon-neutral-0`) |
| `--color-falcon-neutral-100` | × hover background |
| `--color-falcon-neutral-600 / 700 / 900` | subtitle / × / title text |

Everything else (radius, shadow, backdrop, animation, SVG colors) is a literal, not a token.

## Tailwind utility guidance

- The component is single-purpose — there is no `wrapperClass`/`class` override hook. Do not try to retheme it via utilities on the host; edit the component or (better) mint tokens (G-TOKENS).

## Dark mode support

`[CODE]` **Partial / NOT verified.** The palette-token text/surface utilities (`bg-falcon-neutral-0` etc.) will follow the theme's `.app-dark` neutral inversion. BUT the inline `::backdrop` literal (`rgba(13,63,68,0.45)`) and the SVG hex art are NOT theme-aware — they stay fixed in dark mode. Flag for the theme/tokens agent.

## Density support

None — fixed geometry.

## RTL support

`[CODE]` Uses logical-property utilities (`top-5 end-5` on the × button, `:34`) so the × auto-mirrors in RTL. The centered flex layout is direction-agnostic. ✅ structurally RTL-safe (not runtime-verified).

## Static style risks

- `[CODE]` **Inline `styles:` block with literals** (`:37-81`) — the backdrop `rgba(13,63,68,0.45)` + `blur(2px)` + keyframe transforms + `padding:1.5rem` are all literals. This is the single biggest token-discipline gap for this component (G-TOKENS). It is a *deliberate* Top-Layer pattern (matches popup/dialog), but it is still off-token.
- `[CODE]` **Arbitrary-px utilities** (`rounded-[18px]`, `text-[22px]`, `max-w-[560px]`, `shadow-[…]`) — off the Falcon scale (G-PX).
- `[CODE]` **Hex-literal SVG art** (`:44-66`) — not theme-aware (G-SVG-LITERALS).

## No CSS / no SCSS guidance

- There is no separate `.css`/`.scss` file — the styles live in the inline `styles:` block. Per the Falcon "Tailwind-only, no inline styles, `@theme` tokens only" rule, the inline block is a *violation* (accepted as the Top-Layer pattern, but flagged). The mgmt new-wallet-balance specs FORBID inline `styles:` for app features; this is a library component, governed by night-shift-audit rather than lint.

## Token usage by state

| Visual element | Source |
|---|---|
| Panel background | `--color-falcon-neutral-0` (token) ✅ |
| Title / subtitle / × text | `--color-falcon-neutral-{900,600,700}` (tokens) ✅ |
| Panel radius | `rounded-[18px]` (literal ❌ G-PX) |
| Panel shadow | `shadow-[0_24px_60px_rgba(0,0,0,0.18)]` (literal ❌) |
| Backdrop dim/blur | inline `rgba(13,63,68,0.45)` + `blur(2px)` (literal ❌ G-TOKENS) |
| Open/close animation | inline `@keyframes` (literal ❌) |
| Illustration | inline SVG hex (literal ❌ G-SVG-LITERALS) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18). No token file confirmed by Glob; inline `styles:` block + arbitrary-px utilities + hex SVG all read from `falcon-completion-success-dialog.component.{ts,html}`. Dark-mode partial-coverage + RTL logical-props are 🟡 STRUCTURALLY-CHECKED (not runtime-verified).
