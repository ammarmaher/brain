# falcon-tabs — USAGE

## Real usage examples (cited from active source)

### 1. Organization-hierarchy tab strip (admin-console)

`apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html` (lines 53-65):

```html
<div class="org-menu-tabs-bar flex items-center justify-between gap-2">
  <falcon-angular-tabs
    [tabs]="visibleTabsForFalcon()"
    [selectedValue]="state.activeClientTab()"
    (valueChange)="onTabChange($event)" />
  <!-- Tree/Chart toggle sits as an OUTER sibling, not via falconTabActions -->
  @if (state.activeClientTab() === 'hierarchy') {
    <falcon-org-view-toggle
      class="org-menu-tabs-toggle"
      [options]="state.structureOptions"
      [(value)]="state.structureView" />
  }
</div>
```

Notes:
- This page uses the **outer-flex sibling pattern** (NOT `falconTabActions`) to place a toggle next to the tabs. That's intentional because the toggle is "page-level" — it changes the entire view layer, not just the active tab's body.
- The `falconTabActions` pattern (next example) is preferred when the action belongs to a specific tab's view state.

### 2. Per-tab actions via `falconTabActions` directive (showcase reference)

`apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` (excerpt):

```ts
import {
  FalconAngularTabsComponent,
  FalconTabActionsDirective,
  type FalconTabOption,
} from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularTabsComponent, FalconTabActionsDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <falcon-angular-tabs
      [tabs]="tabs"
      [selectedValue]="activeTab()"
      (valueChange)="onTabChange($event)">

      <ng-template falconTabActions="overview">
        <!-- List / Grid toggle -->
        <button (click)="overviewView.set('list')">List</button>
        <button (click)="overviewView.set('grid')">Grid</button>
      </ng-template>

      <ng-template falconTabActions="usage">
        <!-- Basic / Advanced toggle -->
      </ng-template>

      <ng-template falconTabActions="examples">
        <button (click)="toggleExamplesView()">View code</button>
      </ng-template>
    </falcon-angular-tabs>
  `,
})
export class ShowcaseTabsActionsDemoComponent {
  protected readonly tabs: ReadonlyArray<FalconTabOption> = [
    { value: 'overview', label: 'Overview' },
    { value: 'usage',    label: 'Usage' },
    { value: 'examples', label: 'Examples' },
  ];
  protected readonly activeTab = signal<TabKey>('overview');
}
```

Notes:
- Each `<ng-template falconTabActions="<value>">` matches a tab's `value`.
- Only the template matching the active tab is rendered.
- A MutationObserver in the wrapper component lifts the rendered anchor into the Stencil tablist row, so the actions sit on the same baseline as the tab buttons (Stencil source `falcon-tabs.tsx` ensures the tablist is the flex container).
- The template content stays in the consumer's Light DOM — it can use any Angular bindings, services, icons, etc.

### 3. Settings tab projected via Stencil panel slot

When using navigation mode with panel projection (NOT the dominant pattern in this codebase, but Stencil supports it):

```html
<falcon-angular-tabs
  [tabs]="[
    { value: 'overview', label: 'Overview' },
    { value: 'settings', label: 'Settings' }
  ]"
  [(selectedValue)]="active">

  <div slot="panel-overview">Overview body here</div>
  <div slot="panel-settings">Settings body here</div>
</falcon-angular-tabs>
```

The Stencil `<falcon-tabs>` renders `<slot name="panel-${value}">` for each tab. Admin-console pages do NOT use this — they switch panels via `@switch` on the active tab signal AFTER the `<falcon-angular-tabs>` element. Both patterns work; the `@switch` pattern is more common because the consuming page often owns the panel layout.

## Recommended usage for new Angular pages

```html
<falcon-angular-tabs
  [tabs]="tabs"
  [(selectedValue)]="activeTab"
  ariaLabel="Section selector">

  <ng-template falconTabActions="my-tab-value">
    <falcon-angular-button
      variant="ghost"
      size="sm"
      [label]="'common.refresh' | translate"
      (falconClick)="refresh()" />
  </ng-template>
</falcon-angular-tabs>

<div class="mt-4">
  @switch (activeTab) {
    @case ('my-tab-value') { <my-tab-component /> }
    @case ('other-tab-value') { <other-tab-component /> }
  }
</div>
```

## Reactive forms example
```ts
form = new FormGroup({
  section: new FormControl<string | number | null>('hierarchy'),
});
```
```html
<form [formGroup]="form">
  <falcon-angular-tabs
    [tabs]="tabs"
    formControlName="section" />
</form>
```

The wrapper's CVA bridges the value automatically.

## ngModel example
```html
<falcon-angular-tabs
  [tabs]="tabs"
  [(ngModel)]="activeTabId" />
```

## Tailwind-only usage
The wrapper is Tailwind-driven by default. Layout utilities on the host work for spacing:

```html
<falcon-angular-tabs
  class="block border-b border-falcon-neutral-150 px-4"
  [tabs]="tabs"
  ... />
```

## Token override example
```css
.compact-tabs {
  --falcon-tabs-tablist-gap-md: 16px;
  --falcon-tabs-tab-padding-y-top-md: 12px;
  --falcon-tabs-tab-padding-y-bottom-md: 10px;
  --falcon-tabs-tab-font-size-md: 13px;
  --falcon-tabs-indicator-height: 3px;
}
```

## Bad usage to avoid
- Don't pass `[tabs]` via `[attr.tabs]` — that stringifies the array. Use `[tabs]` (property binding — already wired in the wrapper template).
- Don't manually `position: absolute` an action button into the tablist — use `falconTabActions`. Manual injection breaks on re-render.
- Don't toggle `selectedValue` to a non-existent value — Stencil's `select(value)` is a no-op but binding sets the signal regardless and the underline indicator will reset to translate(0,0).
- Don't omit `value` keys when generating tabs dynamically — duplicate values break the `tabRefs` map and the focus management.
- Don't wrap `<falcon-angular-tabs>` in a flex container that has `flex-wrap: wrap` if you use `falconTabActions` — the action injection assumes single-row tablist layout.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [
    FalconAngularTabsComponent,
    FalconTabActionsDirective,  // only if using per-tab actions
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],   // because the wrapper renders <falcon-tabs[-tw]>
  ...
})
```

The wrapper auto-registers the Stencil tags via `defineFalconTwComponent('falcon-tabs')`. The directive is registered separately because it's a content-projection slot, not the tabs element itself.

## Do / Don't

| Do | Don't |
|---|---|
| Use `falconTabActions` for per-tab header actions | Position action buttons absolutely over the tablist |
| Pass `tabs` as a `ReadonlyArray<FalconTabOption>` from a `computed()` | Re-create the array on every change detection cycle (Stencil re-renders + indicator re-measures) |
| Use `mode="radio-cards"` for guided "pick one" UX | Use radio-cards for view switching (use navigation mode + panels for that) |
| Pass `ariaLabel` to give the tablist a name | Rely on a `<h2>` outside the component to label it implicitly |
| Drive `selectedValue` via signal | Set it imperatively in `setTimeout` |
| Use `(valueChange)` or `[(selectedValue)]` for two-way | Subscribe to the raw `falcon-change` event from the Stencil tag |
