# falcon-card — USAGE

## Real usage examples
The component is exported and registered but has zero `<falcon-angular-card>` usage matches in `apps/`. This is an under-leveraged primitive. Examples below are recommended patterns.

## Recommended usage for new Angular pages

### Plain text header + footer + body slot
```html
<falcon-angular-card
  [header]="'Account Details'"
  [subheader]="'Last updated 2 hours ago'"
  variant="default"
  size="md">
  <p>Account information panel body.</p>
</falcon-angular-card>
```

### Rich header slot with action button
```html
<falcon-angular-card variant="outlined">
  <div slot="header" class="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
    <div class="flex flex-col">
      <h3 class="text-base font-semibold m-0 text-falcon-neutral-900">Permissions</h3>
      <p class="text-xs text-falcon-neutral-600 m-0">3 roles assigned</p>
    </div>
    <falcon-angular-button
      variant="ghost"
      size="sm"
      [label]="'common.edit' | translate"
      (falconClick)="onEdit()">
      <i slot="icon-start" class="falcon-icon falcon-icon-pencil"></i>
    </falcon-angular-button>
  </div>
  <ul class="px-4 py-3">...</ul>
</falcon-angular-card>
```

### Flat variant for nested cards
```html
<falcon-angular-card variant="default">
  <falcon-angular-card variant="flat" size="sm" [header]="'Nested section'">
    Inner content.
  </falcon-angular-card>
</falcon-angular-card>
```

## Reactive forms / ngModel
Not applicable — card is not a form control.

## Tailwind-only usage
The wrapper exposes `computed()` helpers (`classes`, `bodyClasses`, `headerClasses`, `footerClasses`) that emit Tailwind class strings. These are visible in the wrapper file but the canonical rendering goes through the Stencil tag (Light or Shadow). For pure Tailwind without Stencil, use a hand-rolled `<div class="rounded-md bg-white border border-falcon-neutral-150 shadow-sm">` — but you lose token consistency.

## Token override example
```css
.dashboard-card {
  --falcon-card-radius: 14px;
  --falcon-card-shadow: 0 2px 6px rgba(0,0,0,0.06);
  --falcon-card-body-padding: 24px;
  --falcon-card-header-padding: 24px 24px 16px;
}
```

```html
<falcon-angular-card class="dashboard-card" [header]="'KPI'">
  ...
</falcon-angular-card>
```

## Bad usage to avoid
- Don't both project a `slot="header"` AND pass `[header]` prop — both render (verified Stencil behavior); pick one.
- Don't add inline Tailwind utilities for padding on the card host — body uses the token. Override the body padding token instead.
- Don't try to make the whole card clickable with a wrapping `<button>` — no `interactive` mode, but you can wrap the card in your own `<button>` and handle focus styling there.
- Don't nest more than 2 levels deep — token shadows compound and the visual gets noisy.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `variant="default"` for primary surface cards | Use `variant="flat"` as default (loses elevation cue) |
| Project rich header content with `slot="header"` | Project AND pass header prop simultaneously |
| Use tokens for per-instance overrides | Inline Tailwind utilities on the host |
| Stack flat cards inside default cards for hierarchy | Stack default cards in default cards (too many shadows) |
| Wrap data tables in a card for consistent framing | Wrap dialogs in a card (use dialog's own surface) |
