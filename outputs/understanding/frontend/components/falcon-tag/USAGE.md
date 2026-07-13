# falcon-tag — USAGE

## Real usage examples (active codebase)

### Example 1 — "Shared-with" name chips with `+N` overflow (production)

`[CODE]` `apps/admin-console/src/app/features/contact-groups/contact-groups-list/contact-groups-list.component.html:119-140` (mirrored in management-console):

```html
<ng-template falconDataTableCell field="sharedWith" let-row>
  @if (row.sharedWith && row.sharedWith.length > 0) {
    <div class="flex flex-wrap items-center gap-1">
      @for (chip of sharedVisible(row); track chip.label) {
        <falcon-angular-tag [value]="chip.label" severity="secondary" size="sm"></falcon-angular-tag>
      }
      @if (sharedOverflow(row) > 0) {
        <falcon-angular-tag
          [value]="'contactGroups.list.sharedMore' | translate: { count: sharedOverflow(row) }"
          severity="secondary" size="sm"></falcon-angular-tag>
      }
    </div>
  } @else {
    <span class="text-falcon-neutral-400">—</span>
  }
</ng-template>
```

> Note the multi-tag layout is the consumer's own `<div class="flex flex-wrap gap-1">` — there is no `<falcon-tag-list>` orchestrator (FT-05).

### Example 2 — Detail-card sharedWith chips

`[CODE]` `apps/management-console/.../contact-groups/contact-group-detail/contact-group-detail.component.html:154-159`:

```html
@if (sharedChips().length > 0) {
  <div class="flex flex-wrap items-center gap-1">
    @for (chip of sharedChips(); track $index) {
      <falcon-angular-tag [value]="chip" severity="secondary" size="sm"></falcon-angular-tag>
    }
  </div>
}
```

### Example 3 — Filter chip with dismiss

```html
@for (chip of activeFilters(); track chip.key) {
  <falcon-angular-tag
    [value]="chip.label"
    severity="info"
    size="sm"
    [dismissible]="true"
    (falconDismiss)="removeFilter(chip.key)">
  </falcon-angular-tag>
}
```

### Example 4 — Icon + label / square corners

```html
<falcon-angular-tag severity="success" icon="check" value="Verified"></falcon-angular-tag>
<falcon-angular-tag severity="warning" [rounded]="false" value="Beta"></falcon-angular-tag>
```

Or via projected content (overrides `[value]`):

```html
<falcon-angular-tag severity="success">
  <i class="falcon-icon falcon-icon-check"></i> Verified
</falcon-angular-tag>
```

## Recommended usage for NEW Angular pages

Use `severity="secondary"` for neutral non-status chips (the dominant production case). Bind `(falconDismiss)` to a parent collection mutation when `[dismissible]="true"`. Defaults: `useTailwind=true`, `severity='secondary'`, `size='md'`, `rounded=true`.

## Tailwind-only usage

`[CODE]` The Light DOM variant uses `tag-tailwind-classes.ts` helpers — which return **hardcoded `bg-falcon-*` palette utilities, NOT token vars**. Per-instance utility via host classes still works; but per-instance **token** overrides only affect the Shadow path (see TOKENS.md token-parity note).

## Token override pattern (Shadow path only)

```css
/* Only effective when useTailwind=false (Shadow path), which consumes --falcon-tag-* */
.alert-tag {
  --falcon-tag-bg: var(--color-falcon-red-100);
  --falcon-tag-fg: var(--color-falcon-red-700);
}
```

## Bad usage to avoid

- **DO NOT** use for workflow state cells — use `<falcon-status-badge>` (9 status enums, not the 7 generic severities).
- **DO NOT** use for generic count badges — use `<falcon-badge>`.
- **DO NOT** bind `'warn'` severity in new code — legacy alias for `'warning'`.
- **DO NOT** ship `[dismissible]="true"` without a `(falconDismiss)` handler — a ✕ that does nothing.
- **DO NOT** reach for `info`/`success` to make a neutral label "look nicer" — use `secondary`; severity colors carry meaning.
- **DO NOT** extend the wrapper's dead `classes` computed (FT-01) — it is unused; the Stencil tag is the live path.

## Import requirements (standalone component)

```ts
import { FalconAngularTagComponent } from '@falcon/ui-core';

@Component({ standalone: true, imports: [FalconAngularTagComponent], ... })
```

## Do / Don't

| Do | Don't |
|---|---|
| Use for dismissible / filter / multi-select chips. | Use for workflow state (`<falcon-status-badge>`). |
| Emit `(falconDismiss)` and update parent state. | Ship a ✕ with no handler. |
| Use `severity="secondary"` for neutral chips. | Overload `info`/`success` for "looks". |
| Wrap a tag set in `<div class="flex flex-wrap gap-1">`. | Expect a built-in `<falcon-tag-list>` orchestrator. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-tag` across `apps/` → **9 files / 18 occurrences**; across `libs/falcon/` → **0**. Full list:

- `apps/{admin,management}-console/.../contact-groups/contact-groups-list/contact-groups-list.component.html` (4 each — sharedWith + overflow)
- `apps/{admin,management}-console/.../contact-groups/contact-group-detail/contact-group-detail.component.html` (1 each)
- `apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html` (2)
- `apps/management-console/.../contact-groups/create-contact-group/steps/share-group-step/share-group-step.component.html` (2)
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` (2)
- `apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` (1 each)

> `[INFERRED]` count rose from the prior Wave-7 "2" mainly because the contact-groups feature (sharedWith chips across list / detail / share-dialog / create-wizard, both consoles) adopted the component.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10). Examples 1-2 confirmed against live source (contact-groups-list.component.html:119-140, contact-group-detail.component.html:154-159). Consumer Sweep re-run (`falcon-angular-tag` → 9 app files / 18 occurrences, 0 in libs/falcon) — corrects the prior Wave-7 "2"/"no consumers".
