# falcon-badge — USAGE

## Example 1 — Notification count

```html
<falcon-angular-badge variant="danger" appearance="solid" size="sm">3</falcon-angular-badge>
```

> CORRECTED 2026-06-03 — the prior note here claimed the wrapper does NOT project `<ng-content>`. That is **WRONG**. `[CODE]` falcon-badge.component.html:11,20 projects `<ng-content></ng-content>` inside BOTH the `<falcon-badge-tw>` and `<falcon-badge>` render branches, so `<falcon-angular-badge>3</falcon-angular-badge>` works directly. Using the raw Stencil tag is only needed for the `ariaLabel` prop (not surfaced on the wrapper — see FB-01) or the `-tw`-only `rootExtraClass` prop. Dropping to the Stencil tag for content is unnecessary:

```html
<!-- both work and render identically -->
<falcon-angular-badge variant="danger" appearance="solid" size="sm">3</falcon-angular-badge>
<falcon-badge-tw variant="danger" appearance="solid" size="sm">3</falcon-badge-tw>
```

## Example 2 — Feature flag chips

```html
<falcon-badge-tw variant="primary" appearance="subtle">Beta</falcon-badge-tw>
<falcon-badge-tw variant="success" appearance="subtle">New</falcon-badge-tw>
<falcon-badge-tw variant="info" appearance="outline">Updated</falcon-badge-tw>
```

## Example 3 — Inline icon + label

```html
<falcon-badge-tw variant="success" appearance="subtle" icon-name="check">
  Verified
</falcon-badge-tw>
```

## Tailwind-only usage

Variants drive the helper output in `badge-tailwind-classes.ts`. Per-instance Tailwind utilities can be added via classes on the wrapper host.

## Token override pattern

```css
.my-special-badge {
  --falcon-badge-primary-bg: var(--color-falcon-teal-200);
  --falcon-badge-primary-fg: var(--color-falcon-teal-900);
}
```

## Bad usage to avoid

- DO NOT use `<falcon-badge>` for workflow-state cells — use `<falcon-status-badge>` (different severity vocabulary).
- DO NOT use `<falcon-badge>` for dismissible chips — use `<falcon-tag dismissible>`.
- DO NOT mix `variant="success"` (semantic-bucket green) on a row that uses `<falcon-status-badge>` `severity="active"` — same visual but different semantic contract.

## Import requirements

```typescript
// Canonical barrel (verified — re-exported from libs/falcon-ui-core/.../falcon-badge/index.ts):
import {
  FalconAngularBadgeComponent,
  type FalconBadgeVariant,
  type FalconBadgeAppearance,
  type FalconBadgeSize,
} from '@falcon/ui-core';
```

> CORRECTED 2026-06-03 — the prior `@falcon-ui-core/angular-wrapper/...` path is not the project alias; the public barrel is `@falcon/ui-core` (`[CODE]` libs/falcon-ui-core/src/angular-wrapper/components/falcon-badge/index.ts re-exports the component + the 3 types). The component is standalone (Angular 21 default; the class omits an explicit `standalone: true` flag but is standalone — `[CODE]` falcon-badge.component.ts:24-30 has no NgModule and uses `imports: []`). Add `FalconAngularBadgeComponent` to the host's `imports: []`; `CUSTOM_ELEMENTS_SCHEMA` is internal to the wrapper.

## Do / Don't

- DO — use this for count indicators, feature flags, generic semantic labels.
- DO — use `appearance="subtle"` as default (matches token defaults).
- DO — choose `[dot]` for compact dot-only indicators (pass `ariaLabel` for a11y on Stencil tag).
- DON'T — confuse this with `<falcon-status-badge>` (workflow state) or `<falcon-tag>` (dismissible chip).
- DON'T — use this inside a data-table cell for status — use `<falcon-status-badge>`.

## Wave 7 Consumer Sweep (2026-05-17)

[CODE] grep `<falcon-angular-badge>` across `apps/` + `libs/falcon/` returned **0 consumers** as of 2026-05-17. Status: showcase-only or not yet adopted.

## Calibration Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-badge>` across `apps/` (admin-console, management-console, host-shell) + `libs/falcon/src` returned **0 consumers** as of 2026-06-03 — UNCHANGED from Wave 7. The component remains showcase/playground-only; production count badges and feature flags are still hand-rolled with raw Tailwind. Adoption is still the primary open item (see GAPS_AND_UPGRADES.md). No new consumers, no drift in the public surface since the prior sweep.

## Verification
🟢 code-verified — the `<ng-content>` correction is confirmed against `[CODE]` falcon-badge.component.html:11,20; the import-path correction against the live `index.ts` barrel; the Consumer Sweep is a direct grep on 2026-06-03. NOT runtime-verified.
