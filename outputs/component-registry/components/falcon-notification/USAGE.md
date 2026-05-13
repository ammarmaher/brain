# falcon-notification — USAGE

## Real usage examples

Found in `apps/host-shell/src/app/features/falcon-ui-showcase/` (showcase only).

## Recommended usage for new pages

### Pattern 1 — Global notification stack via service (preferred)

Mount the stack ONCE at the app shell:

```html
<!-- apps/<app>/src/app/layout.component.html or app.component.html -->
<falcon-angular-notification-stack
  [glossy]="true"
  [iconBg]="false"
  [borderWidth]="1"
  [leftAccent]="2"
  [radius]="20" />
```

Then any component can `inject(FalconNotificationService)` and push:

```ts
import { FalconNotificationService } from '@falcon/ui-core/angular';

constructor(private notif: FalconNotificationService) {}

onSave() {
  this.api.save(this.form.value).subscribe({
    next: () => this.notif.push({
      intent: 'success',
      title: 'Saved',
      subtitle: 'Changes applied successfully.',
      dismissDuration: 6,
    }),
    error: (err) => this.notif.push({
      intent: 'error',
      title: 'Save failed',
      subtitle: err.message,
      dismissMode: 'manual',   // require user dismissal
    }),
  });
}
```

### Pattern 2 — Standalone single notification (no service)

```html
<falcon-angular-notification
  [open]="showSaveSuccess()"
  intent="success"
  title="Saved"
  subtitle="Changes applied."
  dismissMode="auto"
  [dismissDuration]="6"
  (dismiss)="showSaveSuccess.set(false)" />
```

### Pattern 3 — Manual dismiss (sticky until clicked)

```html
<falcon-angular-notification
  [open]="errorOpen()"
  intent="error"
  title="Connection lost"
  subtitle="Reconnecting..."
  dismissMode="manual"
  (dismiss)="errorOpen.set(false)" />
```

## Reactive forms / ngModel
N/A.

## Tailwind-only usage
The component IS Tailwind — inline template uses utilities throughout. Caller doesn't add Tailwind around it.

## Token override
**Not possible per-instance.** Notification has no token CSS file — appearance is driven entirely by `<input>` props + Falcon palette tokens.

For platform-wide changes, override the palette tokens in the global theme.

## Bad usage to avoid
- Don't use this for action-required decisions — use `<falcon-angular-popup>`.
- Don't mount multiple `<falcon-angular-notification-stack>` per app — service is global, one stack is sufficient.
- Don't pass `[dismissDuration]="0"` and `dismissMode="auto"` — the timer fires immediately. Use `dismissMode="manual"` for persistent.
- Don't try to project rich content — no slot support.
- Don't subscribe to `(dismiss)` AND let the service auto-dismiss simultaneously — pick one mechanism.

## Import requirements
```ts
// For service-driven usage (preferred):
@Component({
  standalone: true,
  imports: [FalconAngularNotificationStackComponent],
  // schemas not required — pure Angular
})

// For standalone usage:
@Component({
  standalone: true,
  imports: [FalconAngularNotificationComponent],
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `FalconNotificationService.push()` for business-status feedback | Use this for PrimeNG `MessageService` migration (use toast for that) |
| Mount stack ONCE at app shell | Mount stack per feature |
| Use `dismissMode="manual"` for critical errors | Use `dismissMode="auto"` + `dismissDuration=0` for persistent (timer fires immediately) |
| Use `intent="error"` for failures | Use `intent="info"` for warnings (use `warning` intent) |
| Use `iconBg=true` for distinctive notifications | Use `iconBg=true` everywhere (visual fatigue) |
| Use `glossy=true` for modern look | Use `glossy=true` when render perf matters (backdrop-blur is expensive) |
| Provide both `title` and `subtitle` for context | Skip subtitle and rely on long titles |
