# falcon-badge — OVERVIEW

## Purpose

General-purpose visual indicator (count / status / label). Foundation primitive at Architect §5.12.1. Distinct from `<falcon-status-badge>` (workflow-state palette) and `<falcon-tag>` (chip with optional dismiss).

## Business / UI use case

Generic badge use — count indicator on a menu item ("Notifications 3"), feature flag ("Beta"), semantic label ("New" / "Updated"), inline status pill that doesn't fit the workflow-state vocabulary.

## When to use it

- Count badges (`Inbox 12`).
- Feature flags (`Beta` / `New` / `Updated`).
- Severity-bucketed semantic tags when you want surface treatment (solid/subtle/outline).

## When NOT to use it

- Workflow state on a list row → use `<falcon-status-badge>`.
- Removable chips → use `<falcon-tag dismissible>`.
- Severity-tagged labels with dismissible action → `<falcon-tag>`.

## Status

ACTIVE — Stencil Shadow + Light. Angular wrapper `<falcon-angular-badge>` with dual-render-path. Wave 9.E foundation.

## Paths

- Stencil Shadow: `libs/falcon-ui-core/src/components/falcon-badge/falcon-badge.tsx`
- Stencil Light: `libs/falcon-ui-core/src/components/falcon-badge-tw/falcon-badge-tw.tsx`
- Types: `libs/falcon-ui-core/src/components/falcon-badge/falcon-badge.types.ts`
- Tokens: `libs/falcon-ui-tokens/src/components/badge.tokens.css`
- Tailwind helpers: `libs/falcon-ui-core/src/tailwind/badge-tailwind-classes.ts`
- Angular wrapper: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-badge/falcon-badge.component.ts`
- Angular selector: `falcon-angular-badge`

## Consumers

- No direct `<falcon-angular-badge>` use found in `apps/` via grep. Currently unused in production feature pages.
- Playground / showcase only.

## Related components

- `<falcon-status-badge>` — workflow-state palette (different severity vocabulary, different bucket map)
- `<falcon-tag>` — chip / dismissible severity tag

## Ownership

Stencil + Angular wrapper. The `falcon-badge.tokens.css` file is the SSOT for the 6-variant × 3-appearance matrix.
