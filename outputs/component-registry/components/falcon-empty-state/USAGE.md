# falcon-empty-state — USAGE

## Example 1 — Empty state inside a data-table

```html
<falcon-angular-data-table [data]="users()" [columns]="cols">
  <ng-template falconDataTableEmpty>
    <falcon-angular-empty-state
      iconName="users"
      titleText="No users found"
      descriptionText="Try clearing your filter or invite teammates to get started.">
      <falcon-angular-button slot="action" (falconClick)="invite()">
        Invite teammate
      </falcon-angular-button>
    </falcon-angular-empty-state>
  </ng-template>
</falcon-angular-data-table>
```

## Example 2 — Standalone empty page

```html
<div class="grid place-items-center min-h-[60vh]">
  <falcon-angular-empty-state
    iconName="search"
    titleText="No results"
    descriptionText="We couldn't find anything matching your search."
    size="lg">
    <falcon-angular-button slot="action" severity="secondary" (falconClick)="clearSearch()">
      Clear search
    </falcon-angular-button>
    <falcon-angular-button slot="action" (falconClick)="contactSupport()">
      Contact support
    </falcon-angular-button>
  </falcon-angular-empty-state>
</div>
```

## Example 3 — Minimal (no action)

```html
<falcon-angular-empty-state
  iconName="inbox"
  titleText="Inbox is empty"
  size="sm">
</falcon-angular-empty-state>
```

## Tailwind-only usage

The Light DOM variant uses `empty-state-tailwind-classes.ts` helpers. Per-instance utility via host classes on `<falcon-angular-empty-state>`.

## Token override pattern

```css
.welcome-empty-state {
  --falcon-empty-state-icon-color: var(--color-falcon-teal-500);
  --falcon-empty-state-title-font-size: 18px;
}
```

## Bad usage to avoid

- DO NOT use this for loading states — use the table's `[loading]` skeleton.
- DO NOT use this for error states — better to compose a dedicated error panel with `<falcon-angular-button>` retry action.
- DO NOT skip `[titleText]` — the heading is the entry point for screen readers.

## Import requirements

```typescript
import { FalconAngularEmptyStateComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-empty-state';
import type { FalconEmptyStateSize }
  from '@falcon-ui-core/components/falcon-empty-state/falcon-empty-state.types';
```

## Do / Don't

- DO — project via `<ng-template falconDataTableEmpty>` for table empty states.
- DO — pass an action button via `slot="action"`.
- DO — translate `titleText` / `descriptionText` outside the component.
- DON'T — render this for loading states.
- DON'T — pass `[iconName]` to a non-existent icon — falls back to empty `<i>`.
