---
type: rule
library: "[[Tailwind CSS]]"
topic: do-not-change-visual-rules
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Do Not Change Visual Rules — strict guardrails ***
*** Read before any token / theme / component visual change ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Do Not Change Visual Rules

> The strict guardrails that prevent silent regression of Falcon's visual identity. Every item below is **locked** unless Ammar explicitly approves the change. If you find yourself wanting to break one of these rules, **stop and ask**.

> [!warning] 🔴 GUARDRAIL DECLARATION — Ammar 2026-05-20
> The Falcon Light Mode Visual Baseline (this note + 6 companion notes in `36-Theming/`) is the **official guardrail**. Any future Tailwind / theme / component change MUST compare against [[Falcon Light Mode Visual Baseline]] first and MUST NOT change the existing visual characteristics unless Ammar explicitly approves the change.
>
> **Default answer to "can I change this visual?" is NO.** Permission is cheaper than a regression. See the 20 lockdowns in §2 below — every one is a no-without-approval. Memory pointer: `feedback_visual_baseline_guardrail_2026_05_20`.

## 1. Purpose

Lock the Falcon visual identity so:
- A token refactor cannot accidentally change brand colors
- A page-author cannot accidentally invent new spacing
- A "quick fix" cannot become a permanent visual regression
- The visual-diff CI gate (Wave 13) has a documented "before" reference to enforce

## 2. The 20 lockdown rules

### Brand & color lockdowns

**1. Do not change brand colors without approval.**
- `--color-falcon-teal-700` (`#0d3f44`) — brand primary
- `--color-falcon-teal-500` / `-600` — primary-hover families
- `--color-falcon-teal-900` (`#082a2e`) — active / deepest
- `--color-falcon-teal-50` (`#f3f8f5`) — soft brand surface
- `--color-falcon-teal-100` (`#e8f0f1`) — selected tint
- `--color-falcon-teal-tint` (`#eef3f4`) — data-table selected
- Teal-alpha rails (`-alpha-04..18`)

These are the deep teal identity of Falcon. They are NOT to be remapped, swapped, recoloured, or "modernized" without explicit Ammar approval. See [[Falcon Light Mode Visual Baseline]] §"Main brand colors".

**2. Do not change neutral surface colors without approval.**
- `--color-falcon-neutral-0` (`#ffffff`) — page card / pane bg
- `--color-falcon-neutral-25` (`#fafbfc`) — row hover
- `--color-falcon-neutral-30` (`#fafafa`) — table header bg
- `--color-falcon-neutral-50` (`#f5f7f8`) — generic hover well
- `--color-falcon-neutral-75` (`#f5f6f7`) — org-hierarchy outer wrapper
- `--color-falcon-neutral-150` (`#eef0f2`) — strong divider
- `--color-falcon-neutral-200` (`#e5e7eb`) — default border

**3. Do not remap customer brand colors.**
- `aramco #0d6e0e` · `bmw #1c69d4` · `rajhi #1e4fa3` · `snb #1a6b2e` · `bupa #007bc3`
- These are customer-logo identities. Never adjusted for theme, never repurposed for non-customer surfaces.

**4. Do not introduce new neutral stops.**
- The 27-stop neutral palette is already over-granulated (per [[Falcon Color Palette Audit]]).
- Pick from existing stops. Adding a 28th requires an audit decision, not a per-page need.

**5. Do not use arbitrary colors if a token exists.**
- `bg-[#0d3f44]` is forbidden if `bg-falcon-teal-700` produces the same color.
- `style="background: #f3f8f5"` is forbidden if `bg-falcon-teal-50` produces the same color.
- Use the token-mapped utility every time.

### Page spacing & layout lockdowns

**6. Do not change page spacing system without approval.**
- Outer page padding is `p-3 md:p-5` (12px / 20px). Not 16px. Not 24px.
- Card gap is `gap-4` (16px). Not `gap-3`. Not `gap-5`.
- Button padding-x is 16px @ md. Section padding-y is ~12px-20px depending on density.

**7. Do not change border-radius system without approval.**
- Cards / panels: `rounded-[14px]`. Not 12. Not 16.
- Buttons / inputs: `rounded-md` per component contract. Not overridden per page.
- Chips: `rounded-full`. Not square.
- Small kebab icons: `rounded-xs` / `rounded-sm`. Not 4px arbitrary.

**8. Do not change page-shell pattern without approval.**
- Outer wrapper: `bg-falcon-neutral-75 flex flex-col p-3 md:p-5 h-full min-h-0`
- Main pane: `bg-falcon-neutral-0 border border-falcon-neutral-200 rounded-[14px] overflow-hidden flex flex-col min-h-0`
- These exact classes are the page-shell signature. See [[Falcon Organization Hierarchy Visual Standard]].

**9. Do not change the data-table wrapper recipe.**
- Always `border border-falcon-neutral-200 rounded-md`. Not `border-2`. Not `rounded-lg`.

### Typography lockdowns

**10. Do not change font families.**
- Display: Poppins/Inter (per `falcon-tailwind-tokens.css:131-135`)
- Sans-latin: Neue Haas Grotesk
- Sans-arabic: IBM Plex Sans Arabic
- New page must consume `font-display` / `font-sans` / `font-sans-arabic` — never introduce a fourth family.

**11. Do not introduce new type sizes.**
- Use the scale: `text-2xs`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`.
- No `text-[13.5px]`, `text-[17px]` etc.

### Interactive-state lockdowns

**12. Do not change hover colors without approval.**
- Topbar icon-btn hover: `bg-falcon-neutral-50`
- Data-table row hover: `#fafbfc` (neutral-25)
- Tree-panel row hover: `bg-falcon-neutral-0`
- Sidebar nav-item hover: `bg-white/[0.06]`
- All documented in [[Falcon Current Hover Focus State Map]].

**13. Do not weaken focus rings.**
- Focus-visible MUST use `--shadow-falcon-focus` or `--shadow-falcon-focus-strong`.
- Removing focus-visible to "clean up the look" is a WCAG-fail accessibility regression.

**14. Do not change disabled treatment.**
- `opacity-50 + cursor-not-allowed` is the universal disabled pattern.
- Removing either half = a11y or UX regression.

### Component-style lockdowns

**15. Do not replace component styles with page-specific hacks.**
- A page may NOT do `<falcon-angular-button class="!bg-pink !rounded-full">`.
- The right fix is a new variant on the component, added via the component contract.

**16. Do not bypass the variant system.**
- Buttons get `variant="primary"`, not raw classes.
- Inputs get `severity` / `size` props, not class overrides.

**17. Do not use raw `<button>` / `<input>` / `<table>` in page code.**
- All interactive elements must come from `<falcon-angular-*>` wrappers.
- Exception: HTML semantic wrappers (`<section>`, `<header>`, `<main>`, `<aside>`) are fine for layout.

### Theme / mode lockdowns

**18. Do not make dark mode changes in this step.**
- Light-mode baseline is what's documented here.
- Dark-mode work (Wave 1+) follows a separate plan — see [[Wave 1A Readiness Closure Plan]].
- Any "let me just tweak this dark color" is out of scope until Ammar opens that lane.

**19. Do not apply React/Vue thinking to current Angular scope.**
- Today's code lives in Angular templates + Stencil components.
- React/Vue wrappers are FUTURE placeholders.
- Don't introduce React component patterns (e.g., `className`, JSX hooks) into Angular templates.
- Don't pre-build React/Vue parity until those wrappers actually ship.

### Process lockdowns

**20. Do not refactor tokens without visual-diff CI green.**
- Wave 1+ token refactors require the visual-diff CI (Wave 13 Playwright + pixelmatch tool at `tools/visual-regression/`) to be GREEN before and after.
- Zero-pixel-diff is the bar.
- See [[Falcon Wave 1A Readiness]] + [[Wave 1A Readiness Closure Plan]].

## 3. Evidence / source file references

- [VAULT] [[Falcon Light Mode Visual Baseline]] — the locked baseline
- [VAULT] [[Falcon Current Color Usage Map]] — color tokens
- [VAULT] [[Falcon Current Spacing Radius Shadow Map]] — spacing/radius/shadow tokens
- [VAULT] [[Falcon Current Hover Focus State Map]] — interactive states
- [VAULT] [[Falcon Organization Hierarchy Visual Standard]] — canonical page reference
- [VAULT] [[Falcon Page Visual Consistency Rules]] — companion ruleset
- [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css` — SSOT @theme block
- [CODE] `libs/falcon-ui-tokens/src/components/*.tokens.css` — per-component contracts

## 4. Best practice for reuse

- **Default answer to "can I change X?" is NO unless Ammar says yes.** This note is a permission gate, not a recommendation list.
- **Document gaps, don't break rules.** If a page genuinely needs a new color/spacing/radius/component, log it via [[Tailwind Falcon Alignment Scorecard]].
- **Read this note BEFORE editing tokens.** Don't read it after a refactor when CI breaks.

## 5. Wrong patterns to avoid

These bullets repeat the lockdowns but in failure-pattern form (for grep/skim):
- ❌ Hex-coded inline styles (`style="background: #0d3f44"`)
- ❌ Arbitrary-value Tailwind (`bg-[#0d3f44]`, `rounded-[13px]`, `p-[7px]`)
- ❌ Per-page `!important` overrides on Falcon components
- ❌ New colors / spacings / radii without a logged gap
- ❌ Removing focus-visible rings during a refactor
- ❌ Skipping disabled `opacity-50 + cursor-not-allowed`
- ❌ Reordering customer-brand identity colors
- ❌ Introducing a 4th font family
- ❌ Building a new component when one exists (e.g., new tree panel, new data table)
- ❌ Touching dark-mode tokens during light-mode work
- ❌ Pre-building React/Vue parity in Angular scope
- ❌ Touching tokens without visual-diff CI green

## 6. Angular-first notes

- All lockdowns apply to the **Angular consumer chain** today.
- Stencil components inside Angular wrappers consume the same tokens via scoped CSS — they don't bypass the lockdowns.
- React/Vue future placeholders: when wrappers ship, they MUST honor these same lockdowns. No separate visual scheme.

## 7. Future-agent instructions

- **Treat this note as a refusal list.** If a task asks you to change one of the 20 items above without Ammar approval, refuse and escalate.
- **Read this BEFORE any token-level edit.** Refactors are forbidden territory unless Ammar opens the lane.
- **Pair this with the visual-diff CI.** Wave 13's Playwright+pixelmatch tool exists to enforce zero-pixel-diff during token refactors.
- **If unsure whether a change crosses a lockdown line:** ask Ammar. Permission is cheaper than a regression.

## See also

- [[Falcon Page Visual Consistency Rules]] — companion ruleset (proactive vs this note's reactive guardrails)
- [[Falcon Light Mode Visual Baseline]] — the canonical "before" picture
- [[Falcon Current Color Usage Map]] · [[Falcon Current Spacing Radius Shadow Map]] · [[Falcon Current Hover Focus State Map]]
- [[Falcon Organization Hierarchy Visual Standard]] — canonical reference page
- [[Falcon Tailwind Theme]] · [[Falcon Design Tokens]] · [[Falcon Component Theme Contract]]
- [[Falcon Wave 1A Readiness]] · [[Wave 1A Readiness Closure Plan]] — wave-aware change pipeline
- [[Tailwind Falcon Alignment Scorecard]] — gap surface

## Tags

#type/rule #layer/frontend #layer/design #priority/critical #light-mode-baseline #guardrails

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
