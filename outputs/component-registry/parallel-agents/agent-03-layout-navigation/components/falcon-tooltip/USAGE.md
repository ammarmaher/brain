# falcon-tooltip — USAGE

## Real usage examples
Only in `apps/host-shell/src/app/playground/playground.page.html` showcase. No production-feature usage today. Examples below are recommended patterns.

## Recommended usage for new pages

### 1. Icon-only button affordance
```html
<falcon-angular-tooltip [content]="'Edit user'" placement="top">
  <falcon-angular-button
    variant="ghost"
    size="sm"
    [iconOnly]="true"
    ariaLabel="Edit user"
    (falconClick)="onEdit()">
    <i slot="icon-start" class="falcon-icon falcon-icon-pencil"></i>
  </falcon-angular-button>
</falcon-angular-tooltip>
```

Notes:
- The `ariaLabel` on the button covers screen readers; the tooltip covers sighted users.
- `placement="top"` is the standard convention for above-trigger tooltips.

### 2. Truncated label expansion
```html
<falcon-angular-tooltip [content]="row.fullName" placement="top-start">
  <span class="truncate max-w-[120px] inline-block">{{ row.fullName }}</span>
</falcon-angular-tooltip>
```

Notes:
- Only shows the tooltip when the user hovers — efficient for table rows.

### 3. Rich tooltip via slot
```html
<falcon-angular-tooltip placement="bottom" interactive="true">
  <i class="falcon-icon falcon-icon-info-circle"></i>
  <div slot="content">
    <strong>Active subscriptions</strong>
    <p class="text-xs">Click for details</p>
    <a (click)="openDetails()" class="text-falcon-teal-500 underline cursor-pointer">View</a>
  </div>
</falcon-angular-tooltip>
```

Notes:
- `interactive=true` lets users hover over the panel without it disappearing.
- Project rich content via `slot="content"`.

### 4. Form field hint
```html
<label class="flex items-center gap-1">
  <span>Tax ID</span>
  <falcon-angular-tooltip
    [content]="'13-digit number from your registration document'"
    placement="right">
    <i class="falcon-icon falcon-icon-info-circle text-falcon-neutral-500"></i>
  </falcon-angular-tooltip>
</label>
<falcon-angular-input ... />
```

## Reactive forms / ngModel
Not applicable.

## Tailwind-only usage
- Trigger child can be ANY HTML/component with full Tailwind freedom.
- Tooltip panel uses tokens — don't override via host classes.

## Token override
```css
.brand-tooltip {
  --falcon-tooltip-panel-bg: var(--color-falcon-teal-700);
  --falcon-tooltip-panel-color: white;
  --falcon-tooltip-offset: 12px;
}
```

```html
<falcon-angular-tooltip rootClass="brand-tooltip" [content]="'Branded hint'">
  ...
</falcon-angular-tooltip>
```

## Bad usage to avoid
- Don't wrap a non-focusable element and expect screen readers to find the tooltip — the trigger gets `tabIndex=0` for free, but if the inner content also has `tabIndex` set, you'll have a doubled focus stop.
- Don't put interactive elements (links, buttons) inside the tooltip without setting `interactive=true` — they'll be unreachable.
- Don't use placement `-start` / `-end` for very short triggers — the offset shift can look off-axis.
- Don't pass `maxWidth="100%"` — that fills the viewport; use an explicit `px` or `rem` value.
- Don't open multiple tooltips simultaneously on one trigger — they overlap.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularTooltipComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use placement `top` as default | Use `left` / `right` for narrow viewports |
| Use `interactive=true` for tooltips with links | Skip `interactive` and wonder why the link is unclickable |
| Pair tooltips with icon-only `<falcon-angular-button>` for affordance labels | Use tooltips as the ONLY label (sighted-only — needs `ariaLabel` too) |
| Set `maxWidth="320px"` for long content | Let the tooltip stretch to viewport width |
| Use plain `[content]` for short text | Use `<slot name="content">` for short text (overkill) |
| Project rich content via `slot="content"` for multi-line | Inline `<br>` tags in `[content]` |
