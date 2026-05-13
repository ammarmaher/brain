# falcon-tree-panel (LEGACY BESPOKE) — TOKENS

## Token file path
- _None._ This bespoke component does NOT have a per-component token file. Visual SSOT is the SCSS files.

## Related Falcon theme tokens (consumed in SCSS — references)
Likely consumed (audit-needed via SCSS read):
- `--color-falcon-teal-…` — selected node, hover, brand accent.
- `--color-falcon-neutral-…` — surfaces, borders, dividers, text.
- `--color-falcon-red-500` — highlighted action.

## Tailwind utility guidance
- The panel's HTML template uses some Tailwind utilities for layout (flex / grid / spacing) — but visual values live in SCSS.
- New code SHOULD NOT layer Tailwind utilities to override visuals — wait for convergence.

## Dark mode support
- **Missing.** No dark mode rules in the SCSS.

## Density support
- **None.** Single density.

## RTL support
- Audit required. The chevron-overlap auto-scroll logic uses `scrollLeft` — in RTL, `scrollLeft` may be negative or inverted depending on browser. Currently not handled.

## Static style risks
- **High.** All visual values in SCSS. Full violation of "no SCSS, tokens-only" rule.

## No CSS / No SCSS guidance
- **The SCSS files violate this rule.** Delete during convergence.

## Token usage matrix per state
- **N/A.** Tokens not used.

## Migration mapping (when convergence happens)
When the panel migrates to compose `<falcon-angular-tree>`:
- Recursive rendering → `<falcon-angular-tree>` + new row template slot.
- Per-row 3-dot menus → new `<slot name="actions-{id}">` in `<falcon-angular-tree>`.
- Hover-path → already provided by `<falcon-angular-tree>` via `(hoverChange)` — replace `TreeHoverPathDirective` usage.
- Chrome (aside, root row, section label) → new `<falcon-tree-shell>` component OR template inside the panel that wraps the bare tree.
- Chevron-overlap auto-scroll → either:
  - Generalize into `<falcon-angular-tree>` and expose a `chevronOverlapGuard?: boolean` Input, OR
  - Keep it in the chrome component since it depends on the sticky action button.

The `tree.tokens.css` file (14 categories) already covers the visual contract — no new tokens needed for the chrome IF the chrome moves into `<falcon-tree-shell>` and uses standard `--falcon-tree-*` plus a small set of new `--falcon-tree-shell-*` variables.
