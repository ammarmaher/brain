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
  --falcon-empty-state-title-size: 18px; /* [CODE] real token name is -title-size (NOT -title-font-size) */
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

## When to reach for `<falcon-empty-data>` instead

`[CODE]` Use the richer sibling `<falcon-angular-empty-data>` when you want the **card** look (dashed border + glossy gradient + tinted disc + built-in CTA button + info chip) OR when the empty state is **inside a data-table** (pass `[emptyData]="config"` to `<falcon-angular-data-table>` and it auto-mounts `<falcon-empty-data>`). Use `<falcon-angular-empty-state>` (this component) when you want the **minimal** look, a **projected/custom action** (`slot="action"`), or **heading semantics** (`<h3>`). They are complementary, NOT duplicates.

## Wave 7 Consumer Sweep (2026-05-17)

[CODE] grep `<falcon-angular-empty-state>` returned **1 consumer file** as of 2026-05-17:
- `apps/admin-console/.../add-user-wizard/add-user-wizard.component.html`

## Deep-Dive Consumer Sweep (2026-06-03 — B12)

`[CODE]` grep `<falcon-angular-empty-state>` across `apps/` → **3 files** (UP from 1). NOT re-exported from `libs/falcon` shared-ui (only `<falcon-angular-empty-data>` is).

- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html:53` — `iconName="user-x"`, `size="md"`, no action ("you cannot add a user here" explainer).
- `apps/management-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html:53` — same explainer, mgmt console.
- `apps/management-console/src/app/features/new-wallet-balance/new-wallet-balance.component.ts:155` — `iconName="building"`, `size="md"`, no action (no-wallet-data block; an inline-template render).

> `[INFERRED]` Adoption is still niche (3 minimal explainers) vs the broadly-used `<falcon-empty-data>` (auto-mounted by every `[emptyData]` data-table). That is by design: empty-state is the minimal tier.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh). Consumer Sweep re-run (1 → 3 files: add-user-wizard ×2 + new-wallet-balance, grep-verified); token-override example name corrected (`-title-size`); `<falcon-empty-data>` selection cross-ref added.
