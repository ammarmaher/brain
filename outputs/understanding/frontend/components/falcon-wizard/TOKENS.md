# falcon-angular-wizard — TOKENS

## Token file path
- `libs/falcon-ui-tokens/src/components/wizard.tokens.css` (~4 KB, ~98 lines).
- `[CODE]` **Scoped under `:where(falcon-wizard, falcon-wizard-tw, falcon-angular-wizard, .falcon-wizard, [data-falcon-wizard])`** (wizard.tokens.css:13) — specificity 0, per-instance overrides win. **gate-12 compliant** (NOT `:root`).
- `[CODE]` Declared categories (header :6-10): **1. SURFACE** (`--falcon-wizard-bg`/`-fg`/`-border-color`/`-border-radius` 12px/`-divider-color`) · **2. TYPOGRAPHY** (`--falcon-wizard-font-family`) · **3. LAYOUT** (per-section `--falcon-wizard-{header,stepper,content,footer}-padding` + content min-height + per-size `content-padding-sm`/`-lg` + `footer-gap`) · **4. BUTTONS** (`--falcon-wizard-btn-{padding-y,padding-x,radius,font-size,font-weight}` + `-btn-primary-{bg,fg}`, `-btn-back-{bg,fg,border}`, `-btn-draft-{bg,fg,border}`).

## Related Falcon theme tokens
From `libs/falcon-theme/src/falcon-tailwind-tokens.css`:
- `--color-falcon-teal-500` — Next/Finish primary button bg.
- `--color-falcon-neutral-200` — section dividers.
- `--color-falcon-neutral-900` — header text.
- `--color-falcon-neutral-500` — secondary text + Save Draft button.

## Tokens consumed indirectly
The wizard embeds `<falcon-stepper>` — so all 14 categories of stepper tokens apply (see `falcon-stepper/TOKENS.md`).

## Tailwind utility guidance
- The Stencil source uses raw CSS class names like `falcon-wizard-root`, `falcon-wizard-header`, `falcon-wizard-stepper`, `falcon-wizard-content`, `falcon-wizard-footer`, `falcon-wizard-footer-spacer`, `falcon-wizard-btn`, `falcon-wizard-btn--back`, `falcon-wizard-btn--next`, `falcon-wizard-btn--finish`, `falcon-wizard-btn--draft`.
- These are intended to be styled via tokens in `wizard.tokens.css` — not by adding Tailwind utilities post-hoc.
- Consumers SHOULD limit external Tailwind to the outer `<falcon-angular-wizard>` margins / max-width / shadow / radius.

## Dark mode support
- Audit needed. The Stencil class is small and doesn't have obvious dark-mode aware variables. Recommend adding overrides at the standard `@custom-variant dark` block in `falcon-tailwind-tokens.css`.

## Density support
- `size: 'sm' | 'md' | 'lg'` forwarded to the embedded stepper, but the wizard's own padding/margin do NOT scale with size.
- **Recommendation:** add `density: 'comfortable' | 'compact'` that reduces `--falcon-wizard-content-padding-y` and `--falcon-wizard-footer-padding-y`.

## RTL support
- The footer layout uses flexbox + `falcon-wizard-footer-spacer` that pushes Save Draft + Next to one side. In RTL, this flips naturally if no `start/end` margins are hardcoded.
- The Back button is on the left in LTR (start side). RTL should put it on the right (end side) — verify the CSS.

## Static style risks
- `[CODE]` **`falcon-wizard.css` (98 ln) re-read 2026-06-03 — token-only / VERIFIED clean.** Every visual value reads a `--falcon-wizard-*` var; the footer button classes (`.falcon-wizard-btn--back/draft/next/finish`) all consume `--falcon-wizard-btn-*` tokens (css:75-89). The only literals are structural: `display:flex`, `gap:6px` on `.falcon-wizard-btn`, `line-height:1.2`, `border:1px solid transparent`, `opacity:0.5` on `:disabled`, and a `var(--duration-150, 150ms)` transition fallback. No raw color hex.
- `[CODE]` The Angular wrapper has NO `.component.css`/`.scss` at all (template-only, host class via `@HostBinding`). No static risk.
- `[CODE]` The `-tw` twin's button visuals come from `falconWizardBtnClasses({variant})` in `wizard-tailwind-classes.ts` (Tailwind arbitrary-value utilities on the same tokens) — SSOT with the Shadow CSS.

## No CSS / No SCSS guidance
- Stencil consumes `falcon-wizard.css` (Shadow) / `wizard-tailwind-classes.ts` (`-tw`). No `*.component.scss` in the Angular wrapper.

## Token usage matrix per state (proposed — needs full audit of wizard.tokens.css)
| Element | Default | Hover | Focus | Disabled | Loading |
|---|---|---|---|---|---|
| Back button | `--falcon-wizard-back-bg`, `…-color` | `…-hover` | `…-focus` | `…-disabled-opacity` | — |
| Next/Finish button | `--falcon-wizard-next-bg` (teal-500) | `…-hover` (teal-600) | `…-focus-ring` | `…-disabled-opacity` | `…-busy-spinner` (proposed) |
| Save Draft button | `--falcon-wizard-draft-bg` | `…-hover` | `…-focus` | `…-disabled-opacity` | — |
| Content area | `--falcon-wizard-content-bg`, `…-padding-y`, `…-padding-x` | — | — | — | — |
| Footer row | `--falcon-wizard-footer-bg`, `…-padding-y`, `…-border-top` | — | — | — | — |
| Header row | `--falcon-wizard-header-bg`, `…-margin-bottom` | — | — | — | — |

> Note (2026-06-03): the actual token names confirmed in `wizard.tokens.css` use `--falcon-wizard-btn-primary-{bg,fg}` (Next+Finish share one token pair), `--falcon-wizard-btn-back-{bg,fg,border}`, `--falcon-wizard-btn-draft-{bg,fg,border}`, and per-section `--falcon-wizard-{header,stepper,content,footer}-padding` (NOT split `-padding-y`/`-padding-x` except content's `-sm`/`-lg` size variants). There are NO hover/focus/disabled token variants for the buttons — disabled is a flat `opacity:0.5` rule in `falcon-wizard.css:71`; hover is a flat `opacity` transition. The matrix above is the prior *proposed* shape; the real contract is the 4-category set in the file header.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20 REFRESH) — `wizard.tokens.css` confirmed `:where()`-scoped (gate-12 OK, NOT `:root`), 4 categories (SURFACE/TYPOGRAPHY/LAYOUT/BUTTONS); `falcon-wizard.css` (98 ln) re-read → token-only, no raw hex (footer buttons consume `--falcon-wizard-btn-*`). Embedded `<falcon-stepper>` inherits `stepper.tokens.css`. Dark-mode + RTL 🟡 not re-verified end-to-end (flag for Agent 5).
