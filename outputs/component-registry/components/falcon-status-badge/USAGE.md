# falcon-status-badge — USAGE

## Example 1 — Inside a data-table cell template (RECOMMENDED)

```html
<falcon-angular-data-table [data]="users()" [columns]="cols">
  <ng-template falconDataTableCell="status" let-value="value">
    <falcon-angular-status-badge
      [severity]="value"
      [label]="('status.' + value) | translate">
    </falcon-angular-status-badge>
  </ng-template>
</falcon-angular-data-table>
```

## Example 2 — Standalone

```html
<falcon-angular-status-badge severity="active" label="Active"></falcon-angular-status-badge>
<falcon-angular-status-badge severity="pending" label="Pending"></falcon-angular-status-badge>
<falcon-angular-status-badge severity="deleted" label="Deleted" size="sm"></falcon-angular-status-badge>
```

## Example 3 — Dot-only mode

```html
<falcon-angular-status-badge severity="active" label="" [dot]="true"></falcon-angular-status-badge>
```

On the Stencil tag you can additionally set `aria-label="Active"` so screen readers announce the state when no text is visible:

```html
<falcon-status-badge-tw severity="active" aria-label="Active" dot></falcon-status-badge-tw>
```

## Tailwind-only usage

The Light DOM variant relies on per-severity helpers in `status-badge-tailwind-classes.ts`. Do NOT bypass `[severity]` by writing utility classes directly — the severity contract drives accessibility-tested color buckets.

## Token override pattern

```css
.alert-page-status {
  --falcon-status-badge-active-bg: var(--color-falcon-mint-200);
  --falcon-status-badge-active-dot-bg: var(--color-falcon-green-700);
}
```

## Bad usage to avoid

- DO NOT hand-roll status chips with Tailwind utilities — that's what admin-console's `organization-hierarchy-menu.component.html:162-195` currently does. The shared component exists for consistency. **Refactor opportunity — see GAPS.**
- DO NOT pass an arbitrary `severity` string — the TypeScript type forbids it; the renderer falls back to neutral.
- DO NOT use `<falcon-badge>` (semantic-bucket variants) when `<falcon-status-badge>` (workflow-state palette) is the right semantic.

## Import requirements

```typescript
import { FalconAngularStatusBadgeComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-status-badge';
import type { FalconStatusBadgeSeverity, FalconStatusBadgeSize }
  from '@falcon-ui-core/components/falcon-status-badge/falcon-status-badge.types';
```

## Do / Don't

- DO — use this for workflow-state row cells (user status, account status, service status).
- DO — translate the label outside the component; pass pre-translated string via `[label]`.
- DO — choose `dot=false` for dense table cells; `dot=true` for headers / hero status.
- DON'T — hand-roll status chips with `bg-falcon-{color}-50 text-falcon-{color}-700` Tailwind combinations — those become unmaintainable across pages.
- DON'T — use this for generic count / notification badges (use `<falcon-badge>`).
