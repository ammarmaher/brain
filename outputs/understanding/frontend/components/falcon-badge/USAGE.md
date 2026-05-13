# falcon-badge — USAGE

## Example 1 — Notification count

```html
<falcon-angular-badge variant="danger" appearance="solid" size="sm">3</falcon-angular-badge>
```

> NOTE — the wrapper does NOT currently project content via `<ng-content>` (see GAPS). For label content via the Angular wrapper today, use the Stencil tag directly:

```html
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
import { FalconAngularBadgeComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-badge';
import type {
  FalconBadgeVariant, FalconBadgeAppearance, FalconBadgeSize,
} from '@falcon-ui-core/angular-wrapper/components/falcon-badge';
```

## Do / Don't

- DO — use this for count indicators, feature flags, generic semantic labels.
- DO — use `appearance="subtle"` as default (matches token defaults).
- DO — choose `[dot]` for compact dot-only indicators (pass `ariaLabel` for a11y on Stencil tag).
- DON'T — confuse this with `<falcon-status-badge>` (workflow state) or `<falcon-tag>` (dismissible chip).
- DON'T — use this inside a data-table cell for status — use `<falcon-status-badge>`.
