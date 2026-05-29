---
type: checklist
library: "[[Tailwind CSS]]"
topic: pre-merge-review
created: 2026-05-20
---
*** Tailwind Implementation Review Checklist — pre-merge sign-off ***
*** Run this against every PR that touches styling, theme, or component visuals ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-tailwind-implementation-checklist.md ***

# Tailwind Implementation Review Checklist

> Run this checklist on every PR that touches Tailwind tokens, component contracts, Angular wrappers, or app templates. If a box can't be checked, document the exception or block the merge.

## Theme

- [ ] Values that need utilities are declared in `@theme { … }` (not `:root`)
- [ ] Internal-only CSS variables are in `:root` (not `@theme`)
- [ ] No duplicate token definitions across SSOT + per-component contract
- [ ] Dark-mode counterparts exist for every theme-flippable token (or auto-flip via cascade)
- [ ] New tokens follow the naming convention (`--color-falcon-<role>-<stop>` or `--falcon-<component>-<slot>`)
- [ ] No hex/rgb literal that should have been a token

See [[Falcon Tailwind Theme]] · [[Tailwind Theme Variables]].

## Components

- [ ] No inline `style="…"` for component styling
- [ ] No hardcoded color in templates (e.g., `text-[#0d3f44]`)
- [ ] No hardcoded spacing / radius / shadow when a token exists
- [ ] No `bg-[var(--falcon-X)]` arbitrary syntax when a named utility could exist (file a token-promotion gap instead)
- [ ] All 9 interactive states defined or marked N/A with rationale:
  - [ ] default
  - [ ] hover
  - [ ] focus-visible (with ring via `var(--shadow-falcon-focus)`)
  - [ ] active
  - [ ] disabled
  - [ ] loading (where applicable)
  - [ ] error / invalid (where applicable)
  - [ ] selected / expanded (where applicable)
  - [ ] dark mode (automatic via cascade if tokenized correctly)
- [ ] Sizing / resizing tested (see resizing checklist in [[Tailwind Sizing and Responsive]])
- [ ] Angular wrapper does NOT redesign the component (only adapts framework APIs)
- [ ] No external classes accepted by wrapper from consumer (only props / CSS-var overrides)

See [[Falcon Component Theme Contract]].

## Responsive + layout

- [ ] Breakpoints used intentionally (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- [ ] Container queries used for component-level responsiveness where appropriate
- [ ] `min-w-0` / `min-h-0` applied in nested flex / grid layouts
- [ ] No accidental overflow on long content
- [ ] Truncation strategy explicit (`truncate`, `line-clamp-*`, or wrap)
- [ ] Works in narrow side panel (320px) where the component might be placed

See [[Tailwind Sizing and Responsive]] · [[Tailwind Layout Flex Grid]].

## Source detection + safelist

- [ ] Classes are static / scanner-discoverable (no runtime concatenation of class names)
- [ ] Dynamic class maps are explicit (object maps with static keys)
- [ ] Safelist entries (`@source inline("…")`) are documented (why needed; could it be a `@utility`?)
- [ ] No "just in case" safelist bloat

See [[Tailwind Source Detection]].

## Dark mode

- [ ] Component visually correct in dark mode without custom dark CSS
- [ ] Selected / hover backgrounds have correct polarity (lighter than panel, not darker)
- [ ] Brand customer colors (aramco / bmw / etc.) NOT remapped in dark cascade
- [ ] Focus ring contrast meets WCAG AA in both light and dark

See [[Tailwind Dark Mode]].

## Multi-framework architecture

- [ ] Angular wrapper props/events/slots mirror Stencil component 1:1
- [ ] No Angular-specific styling logic that would break for future React/Vue consumers
- [ ] Stencil component works in vanilla HTML / Web Component context
- [ ] Token contract resolves identically in Angular template + Stencil scoped CSS

See [[Tailwind Multi-Framework Strategy]] · [[Falcon Angular Wrapper Pattern]].

## Documentation + governance

- [ ] Component contract documented per the 9-section template ([[Component Theme Contract Template]])
- [ ] Token gaps recorded in `GAPS_AND_UPGRADES.md` (not silently hardcoded)
- [ ] Theme audit scorecard updated if a component crossed a score threshold (see [[Falcon Component Audit Scorecard]])
- [ ] Brain Outputs SoT updated if governance changed
- [ ] If touching `falcon-tailwind-tokens.css` SSOT, official Tailwind docs re-checked per [[Tailwind Official Docs Map]] fetch-before-implementation rule

## Sign-off

| Reviewer | Date | Verdict |
|---|---|---|
| (architect) | | ✅ APPROVE / ⚠️ CONDITIONAL / ❌ BLOCK |
| (designer) | | ✅ / ⚠️ / ❌ |
| (qa) | | ✅ / ⚠️ / ❌ |

## See also

- [[Falcon Tailwind Theme]] · [[Falcon Component Theme Contract]] · [[Component Theme Contract Template]] · [[Falcon Component Audit Scorecard]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs SoT: [falcon-tailwind-implementation-checklist](../../Brain%20Outputs/understanding/frontend/theme/falcon-tailwind-implementation-checklist.md)

## Tags

#type/checklist #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
