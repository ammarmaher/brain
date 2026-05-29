# 04 — Tailwind-First Governance

All CSS/SCSS must be reviewed.

## Goal

Replace CSS/SCSS with Tailwind utility classes where safe.

## Rules

1. Tailwind is the default styling approach.
2. Do not add new SCSS unless absolutely necessary.
3. Remove unused SCSS/CSS.
4. Move simple layout, spacing, sizing, color, border, radius, shadow, flex, grid, alignment, typography, overflow, transition, and hover styles to Tailwind.
5. Prefer Falcon design tokens and Tailwind token classes.
6. Do not hardcode random colors, spacing, shadows, or radii.
7. If a token exists, use it.
8. If no token exists, use the closest existing token or report the missing token.
9. Do not create static values unless necessary.
10. If SCSS is required, explain why in the report.

## Good Tailwind Migration Targets

- display flex/grid
- gap
- padding/margin
- width/height
- background color
- border
- rounded
- shadow
- text size
- text color
- hover state
- overflow
- position
- z-index
- transition

## SCSS Allowed Only For

- complex browser-specific behavior
- deep third-party overrides that cannot be handled by Tailwind
- animation/keyframes if no Tailwind alternative exists
- rare component internals requiring encapsulated styles

Every remaining SCSS/CSS file must be justified in the final report.
