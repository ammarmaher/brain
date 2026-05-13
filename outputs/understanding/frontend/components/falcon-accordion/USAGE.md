# falcon-accordion — USAGE

## Real usage examples
**Zero matches in `apps/`.** Component is unused in production templates. Examples below are recommended patterns.

## Recommended usage for new pages

### Basic — single-open mode
```html
<falcon-angular-accordion
  [items]="[
    { value: 'general', label: 'General Settings', icon: 'falcon-icon falcon-icon-cog' },
    { value: 'billing', label: 'Billing', icon: 'falcon-icon falcon-icon-credit-card' },
    { value: 'security', label: 'Security', description: 'Manage 2FA + sessions' }
  ]"
  mode="single"
  size="md"
  [(expandedValues)]="expanded">
  
  <div slot="content-general">
    <falcon-angular-input label="Display name" />
  </div>
  <div slot="content-billing">Billing form here</div>
  <div slot="content-security">Security form here</div>
</falcon-angular-accordion>
```

Notes:
- One open at a time.
- Each panel content is projected via `slot="content-<value>"`.
- `expandedValues` is two-way via `valueChange` — or use `[(expandedValues)]`.

### Multi-open mode with disabled item
```html
<falcon-angular-accordion
  [items]="items"
  mode="multiple"
  [expandedValues]="['general', 'billing']"
  (valueChange)="onExpandedChange($event)" />
```

```ts
items: FalconAccordionItem[] = [
  { value: 'general', label: 'General' },
  { value: 'billing', label: 'Billing' },
  { value: 'security', label: 'Security', disabled: true },
];

onExpandedChange(values: ReadonlyArray<string | number>) {
  this.persistOpen(values);
}
```

## Reactive forms inside accordion
The accordion is just a container — projected content can hold form controls. Pattern:

```html
<form [formGroup]="form">
  <falcon-angular-accordion [items]="sections">
    <div slot="content-personal">
      <falcon-angular-input formControlName="firstName" label="First name" />
      <falcon-angular-input formControlName="lastName" label="Last name" />
    </div>
    <div slot="content-contact">
      <falcon-angular-email-field formControlName="email" />
      <falcon-angular-phone-field formControlName="phone" />
    </div>
  </falcon-angular-accordion>
</form>
```

## ngModel example
The `[(expandedValues)]` is the two-way binding for the accordion's expansion state. ngModel is not supported for this (no CVA).

## Tailwind-only usage
- Layout utilities on the host (margin, width clamp).
- Content inside panels uses Tailwind freely.

## Token override
```css
.dense-accordion {
  --falcon-accordion-header-padding-y-md: 8px;
  --falcon-accordion-header-padding-x-md: 12px;
  --falcon-accordion-border-radius: 6px;
}
```

## Bad usage to avoid
- Don't expect `mode="single"` to enforce "always 1 open" — clicking the open item collapses it. Use `expand()` imperatively if needed.
- Don't pass duplicate `value` in items — collapses keyboard nav.
- Don't pass an empty `items` array and expect the accordion to render an empty shell — it renders nothing.
- Don't put a `<falcon-angular-tabs>` inside an accordion panel content — focus management overlaps.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularAccordionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `mode="multiple"` for forms with independent groups | Use `mode="single"` and expect always-1-open |
| Pass `icon` as CSS class for accordion items | Project SVGs into header (not supported — header is from item props only) |
| Use `[(expandedValues)]` for two-way binding | Subscribe to `expand` / `collapse` separately to track state |
| Allow per-item `disabled: true` to gray out sections | Use accordion-wide `disabled` for granular gating |
| Project rich content via `slot="content-<value>"` | Try to slot into the header (not supported) |
