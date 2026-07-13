# falcon-resizable-split-pane — TOKENS

> **This component DOES ship a dedicated token file** — unlike the other B25/B26 shared-ui components. It is the one shared-ui unit in the batch with a real `:where(...)`-scoped, gate-12-compliant token contract PLUS an inline `styles:` block (`ViewEncapsulation.None`) for CSS utilities can't express. The dual-render Stencil Shadow/`-tw` token-split is still **N/A** (single-render Angular), but the component-token-file discipline IS present.

## Component token file

`[CODE]` `libs/falcon-ui-tokens/src/components/resizable-split-pane.tokens.css` (**131 lines** — recount 2026-06-03).

`[CODE]` Scope (resizable-split-pane.tokens.css:59-63):

```css
:where(
  falcon-resizable-split-pane,
  .falcon-resizable-split-pane,
  [data-falcon-resizable-split-pane]
) { … 30 tokens … }
```

`:where()` keeps specificity 0 so per-instance overrides win. **gate-12 compliant** (scoped, NOT `:root`). `[CODE]` resizable-split-pane.tokens.css:24-27 explicitly notes gate-12 + gate-08 compliance: colour/shadow tokens wrap a `var(...)` so they pass the hardcoded-value lint; the pure-geometry px literals are "the legitimate token SOURCE values (this file IS where they live)."

## SSOT cascade model

`[CODE]` resizable-split-pane.tokens.css:11-22 — every COLOUR/SHADOW value cascades from the workspace Falcon tokens (`libs/falcon-theme/src/falcon-tailwind-tokens.css`) via `var(--token, #fallback)`, where the **fallback equals the wallet baseline SCSS value** (parity oracle at `plans/wallet-migration/baseline-css.md` FILE 2 → `.wb-split-resizer` + `.wb-split-grip`). So a token resolves to the SAME pixel in-workspace AND stands alone if `@falcon-ui/tokens` is consumed without the SSOT. **GEOMETRY values unique to the split** (grip rest/active dims, nudge scale) have NO exact platform token and are minted here as the raw source literal — "the ONE place those literals are allowed" (the template references only `var(--falcon-split-pane-*)`).

`[CODE]` The documented baseline-literal → workspace-SSOT 1:1 map (resizable-split-pane.tokens.css:29-40):

| Baseline literal | Workspace SSOT token | Value |
|---|---|---|
| resizer hit-strip 16px | `--spacing-4` | 16px |
| grip width 8px | `--spacing-2` | 8px |
| grip width active 10px | `--spacing-2\.5` | 10px |
| grip radius 6px | `--radius-control-xs` | 6px |
| grip bg (teal-700) | `--color-falcon-teal-700` | `#0d3f44` |
| grip shadow | `--shadow-falcon-uploader-action` | `0 2px 6px rgba(0,0,0,.18)` |
| generic transition .15s | `--duration-falcon-base` | 0.15s |
| emphasized easing | `--ease-falcon-inout` | `cubic-bezier(.4,0,.2,1)` |
| border line 1px | `--falcon-border-width-1` | 1px |

## Token categories (6 declared)

`[CODE]` resizable-split-pane.tokens.css:50-57 (headers) + 64-131:

1. **CONTAINER / PANES** — `--falcon-split-pane-left-default-w` (`var(--spacing-clients, 272px)`), `-left-min-w` (160px, no platform token), `-right-reserve-w` (260px, no platform token), `-arrow-step` (`var(--spacing-5, 24px)`), `-gap` (0px). (ts inputs are the primary geometry path; these are the CSS defaults.)
2. **RESIZER STRIP** — `--falcon-split-pane-resizer-width` (`var(--spacing-4, 16px)`).
3. **GRIP PILL** — `-grip-width` (`var(--spacing-2,8px)`), `-grip-height` (54px), `-grip-width-active` (`var(--spacing-2\.5,10px)`), `-grip-height-active` (66px), `-grip-radius` (`var(--radius-control-xs,6px)`), `-grip-bg` (`var(--color-falcon-teal-700,#0d3f44)`), `-grip-opacity` (0.5), `-grip-opacity-active` (1), `-grip-shadow` (`var(--shadow-falcon-uploader-action, 0 2px 6px rgba(0,0,0,.18))`).
4. **ROW / SCROLL** — `--falcon-split-pane-row-h` (48px — optional shared row height a host can bind both panes to).
5. **Z-INDEX** — `-z-resizer` (6), `-z-grip` (30).
6. **MOTION** — `-transition-fast` (`var(--duration-falcon-base,0.15s)`), `-easing` (`var(--ease-falcon-inout, cubic-bezier(.4,0,.2,1))`), `-grip-transition` (chained opacity/height/width transitions), `-grip-nudge-duration` (1.7s), `-grip-nudge-iterations` (3), `-grip-nudge-scale` (1.85). Plus `-line-width` (`var(--falcon-border-width-1,1px)`).

## Related Falcon theme tokens

`[CODE]` Chained directly (resizable-split-pane.tokens.css):

| Falcon theme token | Used by split via |
|---|---|
| `--spacing-2 / -2\.5 / -4 / -5` | grip widths / resizer strip / arrow step |
| `--spacing-clients` | left default width (272px) |
| `--radius-control-xs` | grip radius |
| `--color-falcon-teal-700` | grip bg |
| `--shadow-falcon-uploader-action` | grip shadow (DEFAULT — wallet overrides per-instance) |
| `--duration-falcon-base` | transition + grip transition |
| `--ease-falcon-inout` | easing |
| `--falcon-border-width-1` | line width |

## Inline `styles:` block (CSS the tokens drive)

`[CODE]` falcon-resizable-split-pane.component.ts:78-128 — `ViewEncapsulation.None` global CSS that **cannot be expressed as utilities** (ts:68-73 justifies the encapsulation choice):
- `.falcon-split-left-scroll` — hides the left pane scrollbar (`scrollbar-width:none` + `::-webkit-scrollbar{width:0;height:0;display:none}`).
- `.falcon-split-grip` — rest size/opacity/transition + the idle nudge animation, all reading `--falcon-split-pane-grip-*` tokens.
- Parent-state grip rules: `.falcon-split-resizer:hover/.focus-visible/.is-dragging .falcon-split-grip` → active size + full opacity + no nudge (reads `-grip-*-active`).
- `@keyframes falcon-split-grip-nudge` — `translate(-50%,-50%) scaleX(1 → var(--falcon-split-pane-grip-nudge-scale))`.
- `@media (prefers-reduced-motion: reduce)` → `animation:none`.

> `[CODE]` Every value in the inline block binds a `--falcon-split-pane-*` token — **token-only, no raw literals** (ts:72-73). This is the rare, *justified* inline-`styles` use (the alternative — utility classes — genuinely cannot do `::-webkit-scrollbar` / parent-state / `@keyframes`).

## Tailwind utility guidance for this component

`[CODE]` The template uses arbitrary utilities that read the tokens, e.g. `w-[var(--falcon-split-pane-resizer-width)]`, `rounded-[var(--falcon-split-pane-grip-radius)]`, `bg-[var(--falcon-split-pane-grip-bg)]`, `shadow-[var(--falcon-split-pane-grip-shadow)]`, `gap-[var(--falcon-split-pane-gap)]`, `z-[var(--falcon-split-pane-z-grip)]` (html:15/46/62). Consumers should override the **tokens**, never hand-roll Tailwind to recolour. JS-computed runtime geometry (left flex-basis, left-stack `translateY`) is dynamic **inline style** — NOT a design literal (ts:26-28).

## Dark mode support

`[CODE]` The grip/resizer colours come from `--color-falcon-teal-700` + `--shadow-falcon-uploader-action`, which are platform tokens — so they follow whatever the platform theme defines for those tokens. The component declares **no explicit `dark:` overrides**, but because it is fully token-driven (not raw-palette like `<falcon-page-skeleton>`), a dark theme that adjusts the underlying Falcon tokens would ripple through. The teal grip is brand-consistent across modes. `[INFERRED]` Not runtime-verified in dark mode; the token-driven design makes it more dark-mode-ready than the raw-palette siblings.

## Density support

`[CODE]` Geometry is driven by the numeric `@Input`s (`leftDefaultWidth`/`leftMinWidth`/`rightReserveWidth`/`arrowStep`) + the CSS-default tokens. No discrete density axis, but a consumer can tune widths via inputs or override the width tokens. The optional `--falcon-split-pane-row-h` (48px) lets a host align both panes to a shared row rhythm.

## RTL support

`[CODE]` `[CODE]` ts:31-33 / html:5-9 claim RTL-safety: the layout uses logical flex utilities and the grip is a **centred pill** (`left-1/2 -translate-x-1/2`, html:62) — direction-agnostic. The drag math is pointer-x − container-left, which is geometric (works either direction). **Caveat (potential RTL bug):** the drag computes `width = pointerX − containerLeft` (math.ts:45-51) and always treats the LEFT pane as the resized one; under RTL the visual "left" pane is on the right, so dragging could feel inverted. The grip centring is fine; the **drag-direction semantics under RTL are not runtime-verified** — flag for the theme/RTL agent (GAP — RECOGNITION/GAPS note it).

## Static style risks

- `[CODE]` **Inline `style` is used at runtime BY DESIGN** for JS-computed geometry only — left flex-basis (`[style.flex]="leftBasis()"`, html:21) and left-stack `transform` (`c.style.transform = mirrorTranslateY(...)`, ts:218). These are dynamic geometry, NOT design literals (ts:26-28) — acceptable.
- `[CODE]` `document.body.style.userSelect`/`.cursor` are set during drag (ts:227-228) and cleared on stop (ts:239-240) — a legitimate global side-effect for a drag UX, properly reverted.
- `[CODE]` The inline `styles:` block + token file are **token-only** (no raw hex/px outside the documented token-source literals). Clean on tokens-over-literals — the **best** of the B25/B26 shared-ui batch on this axis.
- `[CODE]` **No raw `dark:`/`rgba()` in the template** — colours go through tokens.

## No CSS / no SCSS guidance

`[CODE]` There is **no separate `.css`/`.scss` file** — CSS lives in the inline `styles:` block (justified, token-only) + the token file. Consumers must NOT add SCSS to restyle the split; override `--falcon-split-pane-*` tokens (per-instance host class) or use the numeric inputs.

## Token usage by state

| State | Tokens consumed |
|---|---|
| Rest (grip) | `-grip-width`, `-grip-height`, `-grip-radius`, `-grip-bg`, `-grip-opacity`, `-grip-shadow`, `-grip-transition` |
| Active (hover / focus-visible / dragging) | `-grip-width-active`, `-grip-height-active`, `-grip-opacity-active` (animation suppressed) |
| Idle attention | `-grip-nudge-duration`, `-grip-nudge-iterations`, `-grip-nudge-scale`, `-easing` (disabled under `prefers-reduced-motion`) |
| Layout | `-left-default-w`, `-left-min-w`, `-right-reserve-w`, `-gap`, `-resizer-width`, `-arrow-step`, `-row-h` |
| Stacking | `-z-resizer`, `-z-grip` |
| Motion | `-transition-fast`, `-easing` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26) — token file recounted at 131 lines, `:where()` gate-12 scope + 6 categories (30 tokens) + the documented SSOT/baseline-parity map confirmed against resizable-split-pane.tokens.css. Inline `styles:` block read token-only from ts:78-128. JS-geometry-as-inline-style (acceptable) + RTL drag-direction caveat 🟡 code-derived. The most token-disciplined shared-ui unit in B25/B26.
