---
name: Falcon Final Mission — Component Token Audit + Static Value Removal + Semantic Mapping
description: Wave 6 (FINAL). After Studio Waves 3+4+5 complete, sweep every component to remove ALL static visual values. Every value must come from `falcon-tailwind-tokens.css` as the single source of truth. Strict semantic mapping rules — do NOT replace by value alone, classify first.
type: project
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Locked 2026-05-08.** Final mission for the Falcon Studio/theme/component system. Runs as Wave 6 after Waves 3+4+5 land green.

## Goal

Every component uses tokens/variables from the shared Falcon token system. The flow:

```
falcon-tailwind-tokens.css
  → CSS variables / Tailwind theme tokens
  → Tailwind utility classes or arbitrary values reading vars
  → component styles
  → Studio live preview / customization
```

No component bypasses this flow. No static colors, spacing, radius, shadows, font sizes, borders, hover/focus/error values inside components.

## Critical token mapping rule (do NOT shortcut)

Do NOT replace a static value with the nearest token by value alone. **Classify the value first**, then map to the closest correct *semantic* token.

| Static value type | Maps to |
|---|---|
| Font-size value | font-size token |
| Line-height value | line-height token |
| Padding value | spacing/padding token |
| Gap value | spacing/gap token |
| Width/height value | sizing token |
| Border-radius | radius token |
| Border color | border/state color token |
| Hover background | hover background token |
| Focus ring | focus token |
| Error border | error border token |
| Shadow value | shadow/elevation token |
| Glass blur | glass blur token |

**Wrong:** mapping a font-size to a padding token because the px values match. Mapping a hover color to a typography token. Reusing a token because the numeric value is close if the semantic meaning is different.

## Sizing token rule (be stricter)

Always prefer **explicit sizing tokens** for: input height, button height, select height, dropdown height, icon size, checkbox size, radio size, avatar size, badge height, table row height, modal width, drawer width, card min/max width, component-specific fixed width/height.

If no sizing token exists, CREATE one in `falcon-tailwind-tokens.css` following the existing naming convention (`--falcon-size-control-{sm|md|lg}`, `--falcon-size-icon-{sm|md|lg}`, `--falcon-size-input-md`, etc.). Do NOT force spacing tokens into sizing.

## Audit categories per component

For each component, sweep:
1. **Static colors** — `#hex`, `rgb()`, `rgba()`, `hsl()`, raw `bg-white`/`text-red-500`/`border-gray-*` when they should be Falcon
2. **Static spacing** — `px-[Npx]`, `py-[Npx]`, `p-[Npx]`, `m-[Npx]`, `gap-[Npx]`
3. **Static sizing** — `h-[Npx]`, `w-[Npx]`, `min-h-[Npx]`, `max-w-[Npx]`
4. **Static border/radius** — `rounded-[Npx]`, `border-[Npx]`
5. **Static shadows** — `shadow-[...]`, raw `box-shadow`
6. **Static typography** — `text-[Npx]`, raw font-weights, hardcoded line-heights
7. **Static state values** — every state (idle/hover/focus/active/selected/disabled/readonly/error/success/warning/loading) must use shared tokens
8. **Liquid Glass + Glassmorphism** — every glass value tokenized

## Hover/focus/error/success/warning consistency

Centralize. Multiple components sharing the same hover concept use the SAME hover variables. Mutating a hover token in SSOT should update ALL related hover states.

Examples:
- Shared: `--falcon-hover-bg`, `--falcon-hover-border`, `--falcon-hover-text`, `--falcon-hover-shadow`
- Per-component when justified: `--falcon-button-bg-hover`, `--falcon-input-border-hover`, `--falcon-table-row-bg-hover`

## Source-of-truth rule (LOCKED)

All NEW tokens go to `libs/falcon/src/theme/falcon-tailwind-tokens.css` ONLY. Do NOT define design tokens inside:
- Component SCSS files
- Component TS files
- Random local CSS files
- Demo preview files
- Inline styles
- Hardcoded Tailwind arbitrary values without variables

**Bad:** `bg-[#104c54]`, `border-[rgb(220,38,38)]`, `shadow-[0_10px_30px_rgba(0,0,0,0.15)]`, `text-[12px]`, `h-[38px]`, `rounded-[7px]`

**Good (variable):** `bg-[var(--falcon-primary-bg)]`, `border-[var(--falcon-error-border)]`, `shadow-[var(--falcon-shadow-md)]`, `text-[var(--falcon-font-size-xs)]`, `h-[var(--falcon-size-input-md)]`, `rounded-[var(--falcon-radius-sm)]`

**Good (utility from SSOT):** `bg-falcon-teal-500`, `border-falcon-red-500`, `shadow-falcon-focus` (only if generated from the SSOT)

## Process per component

1. Read styles/template
2. Identify static visual values
3. Classify each by category
4. Find existing semantic token in SSOT
5. Use existing token if correct semantic + visually close + same purpose
6. Create new token if no correct semantic exists (follow naming convention)
7. Sizing: prefer explicit sizing tokens, never force spacing into sizing
8. State styles use shared state tokens where possible
9. Test live preview in /studio
10. Verify light + dark mode

## Final search patterns (before declaring done)

Grep for: `# hex`, `rgb(`, `rgba(`, `hsl(`, `hsla(`, `shadow-[`, `bg-[#`, `text-[#`, `border-[#`, `rounded-[`, `h-[Npx`, `w-[Npx`, `min-h-[`, `max-h-[`, `min-w-[`, `max-w-[`, `p-[Npx`, `px-[Npx`, `py-[Npx`, `m-[Npx`, `gap-[Npx`, `style="`, `box-shadow`, `background:`, `color:`, `border-color:`, `font-size:`, `line-height:`, `height:`, `width:`

Review every result. Replace if it should be tokenized. Document any value that's truly structural / unavoidable.

## Build verification

- `npx nx build falcon-ui-core` → zero errors
- `npx nx build falcon-studio` → zero errors
- `npx nx build host-shell` → zero errors
- Token-mutation invariant: change ONE token in SSOT, verify ALL related components shift on /playground AND /studio simultaneously
- Studio live preview still works
- Light mode + dark mode both render correctly
- Wave 3 customization + Wave 4 drag-drop + Wave 5 component gallery all still work

## Components to audit (full catalog)

All 27 from Wave 1+2:
input, dropdown, checkbox, radio, multi-select, switch, textarea, button, tabs, tree-table, stepper, uploader, tree, tooltip, accordion, paginator, toast, dialog, table, calendar, date-picker, otp, single-uploader, phone-field, email-field, otp-send-dialog

Plus Wave 3+4+5 deliverables in `libs/falcon-studio/`.

Plus shared Falcon components in `libs/falcon/src/shared-ui/` (data-table, tree-panel, mobile-number, photo-uploader, etc.).

## Final documentation

Add a token map / comment block in `falcon-tailwind-tokens.css` (or sibling `TOKENS.md`) explaining: shared state tokens, hover/focus/error/success/warning tokens, spacing tokens, sizing tokens, typography tokens, radius tokens, shadow/elevation tokens, glass/Liquid Glass/Glassmorphism tokens, component-specific token groups.

## Hard guardrails

- Tailwind-first, CSS variables first
- DO NOT rebuild the project
- DO NOT create a second token system
- DO NOT create disconnected variables in random files
- DO NOT change unrelated business logic
- DO NOT break Studio, theme editor, Liquid Glass, Glassmorphism, component preview
- Use existing Falcon naming convention for any new tokens
- No commits, no pushes
- Build green at end (per `feedback_build_must_be_green.md`)

## Cross-session resume

Live plan in-repo: `libs/falcon-studio/STUDIO-WAVES-PLAN.md` "Wave 6 — FINAL MISSION" section. Read that for the full spec. Read this memory entry for the high-level overview.
