# falcon-status-badge — OVERVIEW

## Purpose

Specialized status pill — composed visual variant of `<falcon-tag>` (architect §5.12.2). 9 user/service severities collapse into 4 visual buckets (success / warning / neutral / danger) plus a leading severity-tinted dot. Spec source: React V0.2 `.status-badge` (admin/styles.css:1194-1220).

## Business / UI use case

User-row status (active / pending / suspended / locked / deleted) and service-row status (inactive / paid / expired / disabled). The canonical visual for workflow state on every list page.

## When to use it

- Any list cell rendering a user / account / service state.
- Inside `<ng-template falconDataTableCell="status">` projection.

## When NOT to use it

- Generic chip / count indicators — use `<falcon-badge>` (semantic-bucket variants) or `<falcon-tag>` (severity tag).
- Non-status badges (e.g. notification count) — use `<falcon-badge>`.

## Status

ACTIVE — Stencil Shadow + Light. Angular wrapper `<falcon-angular-status-badge>` with dual-render-path. Public API preserved from Wave 9.F pre-backfill (every legacy `@Input` still exists).

## Paths

- Stencil Shadow: `libs/falcon-ui-core/src/components/falcon-status-badge/falcon-status-badge.tsx`
- Stencil Light: `libs/falcon-ui-core/src/components/falcon-status-badge-tw/falcon-status-badge-tw.tsx`
- Types: `libs/falcon-ui-core/src/components/falcon-status-badge/falcon-status-badge.types.ts`
- Tokens: `libs/falcon-ui-tokens/src/components/status-badge.tokens.css`
- Tailwind helpers: `libs/falcon-ui-core/src/tailwind/status-badge-tailwind-classes.ts`
- Angular wrapper: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-status-badge/falcon-status-badge.component.ts`
- Angular selector: `falcon-angular-status-badge`

## Consumers

- No direct `<falcon-angular-status-badge>` use found in `apps/` via grep — the admin-console `organization-hierarchy-menu.component.html` inlines its own status chip Tailwind utilities (lines 162-195) rather than composing `<falcon-angular-status-badge>`. **GAP — this is a refactor opportunity.** See GAPS_AND_UPGRADES.md.

## Related components

- `<falcon-badge>` — generic semantic badge (different surface contract)
- `<falcon-tag>` — chip / dismissible severity tag
- `<falcon-data-table>` — typical consumer via `<ng-template falconDataTableCell="status">`

## Ownership

Stencil + Angular wrapper. Owns the 9-severity → 4-visual-bucket mapping. The `falcon-status-badge.tokens.css` file is the SSOT for status colors.
