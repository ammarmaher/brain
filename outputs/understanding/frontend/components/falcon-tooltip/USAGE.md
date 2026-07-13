# falcon-tooltip — USAGE

## Real usage examples (active codebase)

`[CODE]` **No production-feature usage today** — grep `<falcon-angular-tooltip>` across `apps/` returns ZERO hits (2026-06-03). The only references are the `@falcon` barrel re-export + the Falcon Studio gallery showcase (`overlay-feedback-examples.ts`). The prior dossier's `playground.page.html` consumer is gone (route removed). The patterns below are recommended (not observed in features).

## Recommended usage for NEW pages

### 1. Icon-only button affordance

```html
<falcon-angular-tooltip [content]="'Edit user'" placement="top">
  <falcon-angular-button
    variant="ghost" size="sm" [iconOnly]="true" ariaLabel="Edit user"
    (falconClick)="onEdit()">
    <i slot="icon-start" class="falcon-icon falcon-icon-pencil"></i>
  </falcon-angular-button>
</falcon-angular-tooltip>
```

Notes: `ariaLabel` on the button covers screen readers; the tooltip covers sighted users. `placement="top"` is the standard convention.

### 2. Truncated label expansion

```html
<falcon-angular-tooltip [content]="row.fullName" placement="top-start">
  <span class="truncate max-w-[120px] inline-block">{{ row.fullName }}</span>
</falcon-angular-tooltip>
```

### 3. Rich tooltip via slot + interactive

```html
<falcon-angular-tooltip placement="bottom" [interactive]="true">
  <i class="falcon-icon falcon-icon-info-circle"></i>
  <div slot="content">
    <strong>Active subscriptions</strong>
    <p class="text-xs">Click for details</p>
    <a (click)="openDetails()" class="text-falcon-teal-500 underline cursor-pointer">View</a>
  </div>
</falcon-angular-tooltip>
```

Notes: `interactive=true` keeps the panel alive while the pointer is over it — required for the link to be reachable across the 8px gap.

### 4. Form field hint

```html
<label class="flex items-center gap-1">
  <span>Tax ID</span>
  <falcon-angular-tooltip
    [content]="'13-digit number from your registration document'" placement="right">
    <i class="falcon-icon falcon-icon-info-circle text-falcon-neutral-500"></i>
  </falcon-angular-tooltip>
</label>
<falcon-angular-input ... />
```

## Reactive Forms / ngModel

N/A — not a form control.

## Tailwind-only usage

- The trigger child can be ANY HTML/Falcon component with full Tailwind freedom.
- The tooltip panel uses tokens — do NOT override paint via host classes; use `rootClass` + token overrides.

## Per-instance token override

```css
.brand-tooltip {
  --falcon-tooltip-panel-bg: var(--color-falcon-teal-700);
  --falcon-tooltip-panel-color: white;
  --falcon-tooltip-offset: 12px;
  --falcon-tooltip-panel-max-width: 320px;
}
```

```html
<falcon-angular-tooltip rootClass="brand-tooltip" [content]="'Branded hint'"> … </falcon-angular-tooltip>
```

## Top-Layer note (Wave 6)

`[CODE]` When you use `<falcon-angular-tooltip>`, the wrapper promotes the rendered panel into the browser's Top Layer (`showPopover()` + `FalconStackingService`) so a hint on a control INSIDE a `<falcon-angular-drawer>` / dialog / transformed table row renders on top instead of being clipped by an ancestor stacking context (`[CODE]` falcon-tooltip.component.ts:118-163). This is automatic — no input needed. The raw Stencil tags (used directly, outside the wrapper) do NOT get Top Layer and CAN be clipped.

## Bad usage to avoid

- **Don't** wrap a non-focusable element expecting it to stay non-focusable — the trigger span gets `tabIndex=0` for free (GAP G5); wrapping an element that already has `tabIndex` doubles the focus stop.
- **Don't** put a link/button inside the tooltip without `[interactive]="true"` — it hides before the pointer arrives, unreachable.
- **Don't** use the tooltip as the ONLY label for a control — it is sighted-only + hover-gated; always also set `ariaLabel` on the underlying control.
- **Don't** choose `placement="right"`/`"left"` near a viewport edge — no collision/flip (GAP G1); the panel overflows off-screen.
- **Don't** pass `maxWidth="100%"` — fills the viewport; use an explicit `px`/`rem`.
- **Don't** rely on `disabled` to close an open tooltip — there is no `@Watch` (GAP G2); call `close()`.

## Import requirements (standalone component)

```ts
@Component({
  standalone: true,
  imports: [FalconAngularTooltipComponent],
  // CUSTOM_ELEMENTS_SCHEMA NOT needed — the wrapper declares it internally.
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `placement="top"` as the default | Use `left`/`right` near narrow viewport edges (no flip) |
| Set `[interactive]="true"` for tooltips with a link | Skip it and wonder why the link is unclickable |
| Pair tooltips with icon-only `<falcon-angular-button>` + `ariaLabel` | Use the tooltip as the only label (sighted-only) |
| Set `[maxWidth]="'320px'"` for long content | Let the panel stretch to viewport width |
| Use `[content]` for plain text, `slot="content"` for rich | Inline `<br>` in `[content]` |
| Let the wrapper's Top-Layer promotion handle clipping | Use the raw `<falcon-tooltip>` tag inside a drawer (gets clipped) |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-tooltip` / `FalconAngularTooltipComponent` (excl. node_modules):

- **`apps/**` hits: 0** (no feature-template usage anywhere).
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tooltip/` — own files.
- `libs/falcon/src/shared-ui/index.ts:235` — `@falcon` barrel re-export.
- `libs/falcon-studio/src/lib/registry/{gallery-defaults.ts, examples/overlay-feedback-examples.ts}` — gallery showcase.
- `libs/falcon-ui-core/SPEC-LOCK.md` · `libs/falcon-ui-tokens/src/components/tooltip.tokens.css` — doc/token refs.

> Net real consumer count: **0**. Down from the prior "Wave 7: 1 (playground)" — the playground route was removed; the showcase moved to the falcon-studio gallery. Under-leveraged primitive.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). Consumer sweep re-run (0 `apps/**` consumers). Added the Top-Layer usage note + the no-disabled-Watch / unconditional-tabIndex caveats from live source.
