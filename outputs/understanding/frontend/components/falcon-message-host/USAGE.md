# falcon-message-host — USAGE

## Real usage examples

### 1. Mount in app shell

`apps/host-shell/src/app/app.ts` (pattern):

```ts
import { FalconAngularMessageHostComponent } from '@falcon/ui-core/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FalconAngularMessageHostComponent /*, ...*/],
  template: `
    <router-outlet />
    <falcon-angular-message-host position="top-right" />
  `,
})
export class AppComponent {}
```

### 2. HTTP interceptor fires toast on error

`apps/host-shell/src/app/core/interceptors/response-interceptor.ts` (pattern — verified consumer):

```ts
import { FalconMessageService } from '@falcon/ui-core/angular';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  private readonly msgs = inject(FalconMessageService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err) => {
        this.msgs.add({ severity: 'error', summary: 'Request failed', detail: err.message });
        return throwError(() => err);
      })
    );
  }
}
```

### 3. Feature component fires toast

```ts
import { FalconMessageService } from '@falcon/ui-core/angular';

@Component({...})
export class MyFeatureComponent {
  private readonly msgs = inject(FalconMessageService);

  onSave() {
    this.api.save(this.form.value).subscribe({
      next: () => this.msgs.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Changes applied.',
        life: 3000,
      }),
      error: (err) => this.msgs.add({
        severity: 'error',
        summary: 'Save failed',
        detail: err.message,
        closable: true,
        life: 0,   // sticky until user dismisses
      }),
    });
  }
}
```

### 4. PrimeNG-compat — `severity: 'warn'` alias

```ts
this.msgs.add({ severity: 'warn', summary: 'Heads up', detail: 'Verify your input.' });
// Internally mapped to severity: 'warning'
```

## Recommended usage for new pages

**For PrimeNG migration:** keep using `FalconMessageService.add()` everywhere `MessageService.add()` was. No code-change needed beyond import path.

**For brand-new code:** prefer `FalconNotificationService.push()` + `<falcon-angular-notification-stack>` for the modern signal-based pattern.

## Reactive forms / ngModel
N/A.

## Tailwind-only usage
The host has no per-instance Tailwind override hooks — it just composes toast-host + toast inside.

## Token override
Override `falcon-toast.tokens.css` and `falcon-toast-host.tokens.css` for visual changes — message-host has no own token contract.

## Bad usage to avoid
- Don't mount multiple `<falcon-angular-message-host>` per app — the service is singleton; the second host would render duplicates.
- Don't directly modify `service.messages$` — use `add()` / `remove()` / `clear()`.
- Don't subscribe to `messages$` from feature components — the host already does this.
- Don't pass `id` manually unless you're tracking it for later `remove(id)` — auto-IDs are fine.

## Import requirements
```ts
// In app shell:
@Component({
  standalone: true,
  imports: [FalconAngularMessageHostComponent],
  // schemas not required
})

// In feature components:
constructor(private msgs: FalconMessageService) {}
// or
private readonly msgs = inject(FalconMessageService);
```

The service is `providedIn: 'root'` — no manual provider registration needed.

## Do / Don't

| Do | Don't |
|---|---|
| Mount once at app shell | Mount per feature |
| Inject `FalconMessageService` everywhere PrimeNG `MessageService` was | Re-export the service with a wrapper |
| Use `severity: 'warn'` for PrimeNG compatibility | Use raw `'warn'` for new code (use `'warning'`) |
| Set `life: 0` for sticky messages | Set `life: 0` AND `closable: false` (immortal toast) |
| Use `add([msg1, msg2])` for batch | Call `add()` in a loop (each triggers a render) |
| Use `clear()` on route change | Manually `remove()` each message |
