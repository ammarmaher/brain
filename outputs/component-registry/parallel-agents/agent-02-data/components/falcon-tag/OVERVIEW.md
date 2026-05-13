# falcon-tag — OVERVIEW

## Purpose

Chip / tag with optional leading icon and optional dismiss `✕` button. Sibling of `<falcon-badge>` and `<falcon-status-badge>`. Wave 9.F. Often used in chip-input / multi-select contexts where individual items can be removed inline.

## Business / UI use case

Filter chips ("Status: Active ✕"), multi-select selected-value chips, permission tags, audit-log severity tags, user-row permission tags inside a cell.

## When to use it

- Dismissible chips (`[dismissible]="true"` + `(falconDismiss)` event).
- Severity-tagged labels with the 7-value vocabulary (`success`, `info`, `warning`, `warn` legacy, `danger`, `secondary`, `contrast`).
- Multi-select "selected" representation.

## When NOT to use it

- Workflow-state cells → `<falcon-status-badge>`.
- Generic count/feature flag badges → `<falcon-badge>`.

## Status

ACTIVE — Stencil Shadow + Light. Angular wrapper `<falcon-angular-tag>` with dual-render-path. Tailwind-only status pill — replaces legacy `<p-tag>`.

## Paths

- Stencil Shadow: `libs/falcon-ui-core/src/components/falcon-tag/falcon-tag.tsx`
- Stencil Light: `libs/falcon-ui-core/src/components/falcon-tag-tw/falcon-tag-tw.tsx`
- Types: `libs/falcon-ui-core/src/components/falcon-tag/falcon-tag.types.ts`
- Tokens: `libs/falcon-ui-tokens/src/components/tag.tokens.css`
- Tailwind helpers: `libs/falcon-ui-core/src/tailwind/tag-tailwind-classes.ts`
- Angular wrapper: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tag/falcon-tag.component.ts`
- Angular selector: `falcon-angular-tag`

## Consumers

- No direct `<falcon-angular-tag>` use found in `apps/` via grep.
- Playground + showcase only.
- Designed for use inside multi-select / chip input UIs and table cells with multi-value lists.

## Related components

- `<falcon-badge>` — semantic-bucket generic indicator
- `<falcon-status-badge>` — workflow-state specialised
- `<falcon-angular-multi-select>` — likely consumer for selected-chips visual

## Ownership

Stencil + Angular wrapper. Wave 9.F backfill. The wrapper retains a legacy Tailwind-class computed signal (`classes`) for backwards compatibility (lines 62-71) — both surfaces work simultaneously.
