# falcon-confirm-dialog — USAGE

## Real usage examples
**Zero matches in `apps/`.** Component is exported but unused in production. Examples below are recommended patterns.

## Recommended usage for new pages

### Basic OK / Cancel
```html
<falcon-angular-confirm-dialog
  [(open)]="confirmOpen"
  [title]="'Approve request?'"
  [message]="'This will mark the request as approved and notify the requester.'"
  severity="info"
  [acceptLabel]="'Approve'"
  [rejectLabel]="'Cancel'"
  (accept)="onApprove()"
  (reject)="onReject()" />
```

### With icon class
```html
<falcon-angular-confirm-dialog
  [(open)]="confirmOpen"
  [title]="'Delete record?'"
  [message]="'This action cannot be undone.'"
  severity="danger"
  icon="falcon-icon falcon-icon-trash"
  [acceptLabel]="'Delete'"
  [rejectLabel]="'Cancel'"
  (accept)="onDelete()"
  (reject)="onCancel()" />
```

### With additional body content (default slot)
```html
<falcon-angular-confirm-dialog
  [(open)]="confirmOpen"
  [title]="'Schedule action?'"
  [message]="'Pick a time for this action to run automatically.'"
  severity="info"
  (accept)="onSchedule()"
  (reject)="onCancel()">

  <falcon-angular-date-picker
    [(value)]="scheduleAt"
    label="Run at" />
</falcon-angular-confirm-dialog>
```

## Reactive forms inside confirm-dialog
The component supports projected body content — wrap with a `[formGroup]` inside the default slot if needed. But this is unusual; for form-bearing decisions, `<falcon-angular-dialog>` is more flexible.

## ngModel example
N/A.

## Tailwind-only usage
The component inherits dialog's surface — apply layout utilities INSIDE the body content. Don't try to restyle the accept/reject buttons via host classes (they're internal `<button>`s).

## Token override
```css
.high-stakes-confirm {
  --falcon-confirm-dialog-accept-bg: var(--color-falcon-red-700);  /* danger flag */
  --falcon-confirm-dialog-btn-radius: 8px;
  --falcon-confirm-dialog-body-padding: 16px 0;
  --falcon-confirm-dialog-icon-size: 40px;
}
```

```html
<falcon-angular-confirm-dialog
  rootClass="high-stakes-confirm"
  [title]="'Permanent action'"
  ...
/>
```

## Bad usage to avoid
- Don't use this for the 4 canonical flows — use `<falcon-angular-popup>`.
- Don't expect to project custom buttons in the footer — the accept/reject buttons are hardcoded.
- Don't bind `(accept)` AND treat reject as cancel separately — reject fires for ALL dismissal paths (backdrop, Esc, close ×, reject button).
- Don't pass an `<svg>` to `icon` — the prop is a CSS class string, rendered via `<i class={...}>`.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularConfirmDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

The wrapper internally imports `FalconAngularDialogComponent` — no need to import it explicitly.

## Do / Don't

| Do | Don't |
|---|---|
| Use for non-canonical confirms (Approve / Reject) | Use for the 4 canonical flows (use popup) |
| Pass `[icon]` as a falcon-icon class string | Pass `<svg>` content |
| Treat `(reject)` as the universal cancel path | Bind `(falconClose)` from the inner dialog separately |
| Use `severity="danger"` for destructive | Use `severity="info"` + manually swap colors |
| Project additional body content (date picker, options) | Project replacement footer buttons (won't work) |
