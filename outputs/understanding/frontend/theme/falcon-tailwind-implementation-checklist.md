# Falcon Tailwind Implementation Checklist — SoT

> Source of truth for the pre-merge Tailwind review checklist. Vault graph node: `_obsidian/36-Theming/Tailwind Implementation Review Checklist.md`.

**Created:** 2026-05-20
**Vault node:** `_obsidian/36-Theming/Tailwind Implementation Review Checklist.md`

## Theme block

- [ ] Utility-generating tokens in `@theme { … }` (not `:root`)
- [ ] Internal-only CSS variables in `:root`
- [ ] No duplicate token definitions across SSOT + per-component contract
- [ ] Dark counterparts exist (or auto-flip via cascade)
- [ ] New tokens follow naming convention
- [ ] No hex/rgb literals that should have been tokens

## Components

- [ ] No inline `style="…"`
- [ ] No hardcoded color in templates
- [ ] No hardcoded spacing / radius / shadow when a token exists
- [ ] No `bg-[var(--falcon-X)]` arbitrary syntax when a named utility could exist
- [ ] All 9 states defined or marked N/A:
  - [ ] default
  - [ ] hover
  - [ ] focus-visible (with token-driven ring)
  - [ ] active
  - [ ] disabled
  - [ ] loading
  - [ ] error / invalid
  - [ ] selected / expanded
  - [ ] dark mode
- [ ] Resizing checklist passed
- [ ] Angular wrapper does NOT redesign component
- [ ] Wrapper does NOT accept external classes from consumer

## Responsive + layout

- [ ] Breakpoints intentional (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- [ ] Container queries used where appropriate
- [ ] `min-w-0` / `min-h-0` applied in nested flex/grid
- [ ] No accidental overflow
- [ ] Truncation strategy explicit
- [ ] Works in narrow side panel (320px)

## Source detection

- [ ] Classes static / scanner-discoverable
- [ ] Dynamic maps use static keys
- [ ] Safelist minimal + documented
- [ ] No "just in case" entries

## Dark mode

- [ ] Visually correct in dark without custom dark CSS
- [ ] Hover polarity correct (lighter than panel, not darker)
- [ ] Customer brands NOT remapped in dark
- [ ] Focus ring contrast WCAG AA in both modes

## Multi-framework

- [ ] Wrapper props/events/slots mirror Stencil 1:1
- [ ] Stencil works in vanilla HTML / Web Component context
- [ ] Token contract resolves identically in Angular + Stencil scoped CSS

## Governance

- [ ] Component contract documented (9-section template)
- [ ] Token gaps recorded in `GAPS_AND_UPGRADES.md`
- [ ] Audit scorecard updated if score changed band
- [ ] Brain Outputs SoT updated
- [ ] Latest Tailwind docs re-checked if SSOT touched

## See also

- `falcon-tailwind-theme.md`
- `falcon-component-theme-contract.md`
- `falcon-component-audit-scorecard.md`
- `falcon-tailwind-alignment-scorecard.md`
