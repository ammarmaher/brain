# falcon-icon — USAGE

## Real usage examples
Direct `<falcon-angular-icon>` usage found in `apps/host-shell/src/app/layout/layout.component.html`. Most consumers use the raw `<i class="falcon-icon falcon-icon-X">` pattern (e.g. settings-tab buttons, drawer footers — see earlier USAGE files).

## Recommended usage for new pages

### Decorative icon (inside button slot)
```html
<falcon-angular-button
  variant="ghost"
  [label]="'common.edit' | translate"
  (falconClick)="onEdit()">
  <falcon-angular-icon slot="icon-start" name="pencil" size="sm" />
</falcon-angular-button>
```

### Meaningful icon with accessible label
```html
<falcon-angular-icon
  name="exclamation-triangle"
  size="md"
  [decorative]="false"
  label="Warning"
  class="text-falcon-amber-700" />
```

### Plain decorative use
```html
<span class="flex items-center gap-1">
  <falcon-angular-icon name="info-circle" size="xs" />
  <span>Status: active</span>
</span>
```

### Color via parent
```html
<span class="text-falcon-red-500">
  <falcon-angular-icon name="trash" size="md" />
</span>
```

Or set the token directly:
```html
<falcon-angular-icon name="check" size="md" style="--falcon-icon-color: var(--color-falcon-green-500);" />
```

## Reactive forms / ngModel
N/A.

## Tailwind-only usage
- Color: apply `text-falcon-{family}-{shade}` on the parent.
- Margin/padding: apply on parent or wrapper.
- The icon size is token-controlled — don't use `text-xl` etc. on the host.

## Token override (per-instance)
```css
.kpi-icon {
  --falcon-icon-color: var(--color-falcon-teal-500);
  --falcon-icon-md: 18px;   /* override md size for THIS instance */
}
```

## Bad usage to avoid
- Don't omit `name` — the icon won't render.
- Don't pass `decorative=false` without a `label` — screen readers won't know what to announce.
- Don't use Tailwind size classes (`text-lg`) on the host — use the `size` prop.
- Don't use this for non-Falcon icons — use `iconify-icon` or raw `<svg>`.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularIconComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA] only if rendering raw Stencil tag
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Pass `name="pencil"` (icon name only, no class prefix) | Pass `name="falcon-icon-pencil"` (double prefix) |
| Use `decorative=true` (default) inside buttons / menus | Use `decorative=false` for purely visual icons |
| Set color on the parent text element | Set `style="color: red"` on the icon directly |
| Use the `size` prop | Use Tailwind `text-*` classes for sizing |
| Use `<falcon-angular-icon>` for new code | Continue using `<i class="falcon-icon falcon-icon-X">` in net-new |
| Provide `label` when `decorative=false` | Forget the label and rely on visual recognition |
