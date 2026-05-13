# falcon-toast — USAGE

## Real usage examples
- Showcase only (`apps/host-shell/src/app/playground/playground.page.html`).
- Production code uses `FalconMessageService.add({...})` via `<falcon-angular-message-host>` (which composes this internally).

## Recommended usage for new pages

**Note:** for net-new code, prefer `<falcon-angular-notification>` + `FalconNotificationService`. The toast pattern below is for migration from PrimeNG `MessageService`.

### Via FalconMessageService (drop-in PrimeNG MessageService)

```ts
import { FalconMessageService } from '@falcon/ui-core/angular';

constructor(private msgs: FalconMessageService) {}

onSave() {
  this.api.save(this.form.value).subscribe({
    next: () => {
      this.msgs.add({ severity: 'success', summary: 'Saved', detail: 'Changes applied.' });
    },
    error: (err) => {
      this.msgs.add({ severity: 'error', summary: 'Save failed', detail: err.message });
    }
  });
}
```

Mount the host ONCE in the app shell:
```html
<falcon-angular-message-host position="top-right" />
```

The message host subscribes to `FalconMessageService.messages$` and renders one `<falcon-angular-toast>` per active message inside `<falcon-angular-toast-host>`.

### Direct standalone toast (rare)

```html
<falcon-angular-toast-host position="top-right">
  <falcon-angular-toast
    severity="success"
    title="Saved"
    message="Changes applied successfully."
    [duration]="4000"
    (falconDismiss)="onDismiss($event)" />
</falcon-angular-toast-host>
```

## Reactive forms / ngModel
N/A.

## Tailwind-only usage
- Toast geometry is token-driven.
- Action button can have `<ng-content select="[slot=action]">` for custom Tailwind buttons.

## Token override
```css
.brand-toast {
  --falcon-toast-bg: var(--color-falcon-teal-50);
  --falcon-toast-color: var(--color-falcon-teal-900);
  --falcon-toast-border-color: var(--color-falcon-teal-200);
  --falcon-toast-icon-success-color: var(--color-falcon-teal-700);
}
```

## Bad usage to avoid
- **Don't use `<falcon-angular-toast>` directly for new code** — prefer `<falcon-angular-notification>` (per registry deprecation).
- Don't put critical errors in toasts that auto-dismiss — use a popup / dialog for must-acknowledge errors.
- Don't render multiple `<falcon-angular-message-host>` in the same app — one per app shell.
- Don't set `duration=0` AND `dismissible=false` — the toast becomes immortal.
- Don't pass HTML in `message` — it's rendered as text.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularToastComponent, FalconAngularToastHostComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

For the message service pattern, inject `FalconMessageService` (provided in root).

## Do / Don't

| Do | Don't |
|---|---|
| Use `FalconMessageService.add({severity, summary, detail})` for net-new code that needs PrimeNG-compat | Reach for `<falcon-angular-toast>` directly |
| Use `<falcon-angular-notification>` for new business-status feedback | Mix toast + notification semantics on the same page |
| Mount `<falcon-angular-message-host>` once at app shell | Mount one per feature module |
| Set `duration` based on message importance (longer for errors) | Set 0 duration without `dismissible=true` |
| Use `severity="error"` for failures | Use `severity="info"` for warnings |
