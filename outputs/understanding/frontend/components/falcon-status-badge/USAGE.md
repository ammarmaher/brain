# falcon-status-badge — USAGE

## Real usage examples (active codebase)

### Example 1 — Inside a data-table cell template (RECOMMENDED, production)

`[CODE]` `apps/admin-console/src/app/features/contact-groups/contact-groups-list/contact-groups-list.component.html:143-148` (mirrored in management-console):

```html
<!-- Status -->
<ng-template falconDataTableCell field="status" let-row>
  <falcon-angular-status-badge
    [severity]="statusSeverity(row)"
    [label]="statusLabel(row)">
  </falcon-angular-status-badge>
</ng-template>
```

> `statusSeverity(row)` maps the row's backend status to one of the 9 `FalconStatusBadgeSeverity` values; `statusLabel(row)` returns the pre-translated word. The component owns the color, the consumer owns the word.

### Example 2 — Generic data-table cell with translate pipe

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

### Example 3 — Standalone

```html
<falcon-angular-status-badge severity="active" label="Active"></falcon-angular-status-badge>
<falcon-angular-status-badge severity="pending" label="Pending"></falcon-angular-status-badge>
<falcon-angular-status-badge severity="deleted" label="Deleted" size="sm"></falcon-angular-status-badge>
```

### Example 4 — Dot-only mode (with the Stencil-tag a11y workaround)

```html
<falcon-angular-status-badge severity="active" label="" [dot]="true"></falcon-angular-status-badge>
```

`[CODE]` Because the wrapper does NOT expose `ariaLabel` (FSB-03), a dot-only badge via the wrapper is silent to screen readers. Drop to the raw Stencil tag to set it:

```html
<falcon-status-badge-tw severity="active" aria-label="Active" dot></falcon-status-badge-tw>
```

## Recommended usage for NEW Angular pages

Defaults are tuned for table cells: `useTailwind=true`, `severity='active'`, `size='md'`, `dot=true`. Always pass the real `[severity]` + a pre-translated `[label]`. Render inside `<ng-template falconDataTableCell="status">` for list pages.

## Tailwind-only usage

The Light DOM variant relies on per-severity helpers in `status-badge-tailwind-classes.ts` that consume `--falcon-status-badge-*` tokens via arbitrary-value utilities (`bg-[color:var(--falcon-status-badge-active-bg)]`, etc.). Do NOT bypass `[severity]` by writing utility classes directly — the severity contract drives the accessibility-tested color buckets.

## Token override (per-instance) pattern

```css
.alert-page-status {
  --falcon-status-badge-active-bg: var(--color-falcon-mint-200);
  --falcon-status-badge-active-dot-bg: var(--color-falcon-green-700);
}
```

> Revalidate WCAG-AA contrast after any bucket-color override.

## Bad usage to avoid

- **DO NOT** hand-roll status chips with `bg-falcon-{color}-50 text-falcon-{color}-700` Tailwind combinations — the shared component exists for consistency, and hand-rolled chips drift from the SSOT bucket map.
- **DO NOT** pass an arbitrary `severity` string — the TS type forbids it; the renderer falls back to the neutral bucket.
- **DO NOT** use `<falcon-badge>` (semantic-bucket variants) or `<falcon-tag>` (generic 7-value palette) when `<falcon-status-badge>` (workflow-state palette) is the right semantic.
- **DO NOT** rely on the wrapper exposing `ariaLabel` — it does not (FSB-03); use the Stencil-tag workaround for dot-only mode.
- **DO NOT** use `*ngIf`/`*ngFor` around it — use `@if`/`@for`.

## Import requirements (standalone component)

```ts
import { FalconAngularStatusBadgeComponent } from '@falcon/ui-core';
import type { FalconStatusBadgeSeverity, FalconStatusBadgeSize } from '@falcon/ui-core';

@Component({ standalone: true, imports: [FalconAngularStatusBadgeComponent], ... })
```

## Do / Don't

| Do | Don't |
|---|---|
| Use for workflow-state row cells (user / account / service). | Use for generic count / notification badges (`<falcon-badge>`). |
| Translate the label outside; pass a pre-translated `[label]`. | Pass an i18n key as the label. |
| Choose `dot=false` for dense cells; `dot=true` for headers / hero status. | Hand-roll `bg-falcon-{color}-50 text-falcon-{color}-700` chips. |
| Pass a real `[severity]` from the 9-value union. | Pass an arbitrary off-vocabulary string. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-status-badge` across `apps/` → **16 files / 21 occurrences**; across `libs/falcon/` → **4 files / 5 occurrences**. Full list:

**apps/ (16 files):**
- `apps/{admin,management}-console/.../contracts-cost-management/contracts-cost-management.component.html` + `.ts` (admin) + `components/contracts-view-contract/contracts-view-contract.component.{html,ts}` (both)
- `apps/{admin,management}-console/.../contact-groups/contact-groups-list/contact-groups-list.component.{html,ts}` (status cell)
- `apps/{admin,management}-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.{html,ts}`
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/{client-comm-channels-step,client-applications-step}.component.html`

**libs/falcon/ (4 files):**
- `libs/falcon/src/shared-features/comm-mkt-view/comm-mkt-view.component.html`
- `libs/falcon/src/shared-features/comm-mkt-view/components/card/comm-mkt-card.component.ts`
- `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html`
- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` (2 occurrences)

> `[INFERRED]` count rose from the prior Wave-7 "6" (and the OVERVIEW's stale "no consumers found") as contracts-cost-management, contact-groups, and the shared comm-mkt-view/service-pricing-table/user-details features adopted the component, and the folder renamed `organization-hierarchy/` → `org-hierarchy-page/`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10). Example 1 confirmed against live source (contact-groups-list.component.html:143-148). Consumer Sweep re-run (`falcon-angular-status-badge` → 16 app files / 21 occurrences + 4 lib files / 5 occurrences) — corrects the prior "no consumers" / Wave-7 "6".
