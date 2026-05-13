# Tailwind-First UI Rules

## Mission

All UI/layout implementation must prefer **Tailwind CSS first**, especially for grid, flex, spacing, alignment, sizing, responsive behavior, and common visual utilities.

SCSS is allowed only as a controlled fallback when Tailwind cannot cleanly solve the case or when the project has a verified edge case requiring custom selectors, theme-token mapping, browser fixes, or PrimeNG/internal component overrides.

## Priority order

1. Existing project architecture and component patterns.
2. Tailwind utilities for grid, layout, spacing, typography, sizing, responsiveness, and state styling.
3. PrimeNG components for enterprise UI behavior.
4. Theme tokens / CSS variables for reusable values.
5. SCSS fallback only when required and documented.

## Grid system rule

Use Tailwind as the default grid system: `grid`, `grid-cols-*`, `col-span-*`, `gap-*`, responsive variants, `flex`, `items-*`, `justify-*`, `basis-*`, `grow`, and `shrink`.

Do not introduce a competing grid system unless the existing screen already requires it.

## SCSS fallback gate

Before writing SCSS, the agent must answer:

1. Can Tailwind solve this with utilities?
2. Can Tailwind config/theme tokens solve it?
3. Can PrimeNG props/classes solve it?
4. Is this an edge case involving deep component internals, pseudo-elements, complex animations, browser-specific fixes, or reusable token mapping?

SCSS is allowed only if the answer to 1-3 is no and 4 is yes.

## Required SCSS comment

Every new SCSS block must include a short reason:

```scss
/* SCSS fallback: Tailwind cannot target this PrimeNG internal overlay state safely. */
```

## Anti-patterns

- Do not create large SCSS files for simple spacing/grid/layout.
- Do not duplicate Tailwind utilities in SCSS.
- Do not use fragile `::ng-deep` unless there is no stable alternative.
- Do not hardcode colors, shadows, radius, or spacing when tokens exist.
- Do not mix PrimeFlex and Tailwind for the same layout unless the existing screen already does.

## Output requirement

When finishing a UI task, report:

- Tailwind utilities used.
- Any SCSS fallback added and why.
- Responsive behavior verified.
- Theme/token compatibility.
