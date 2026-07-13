# falcon-toast — USAGE

## Real usage examples (active codebase)

`[CODE]` **There are NO `apps/**` consumers of `<falcon-angular-toast>` / `<falcon-angular-toast-host>`** (grep verified 2026-06-03 — see Consumer Sweep). The component is reached ONLY through one composition + the design-time gallery:

### The one production path — `<falcon-angular-message-host>` (legacy PrimeNG-parity)

`[CODE]` `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.ts:18-48`:

```ts
@Component({
  selector: 'falcon-angular-message-host',
  imports: [FalconAngularToastComponent, FalconAngularToastHostComponent],
  ...
})
export class FalconAngularMessageHostComponent implements OnInit {
  @Input() position: FalconToastHostPosition = 'top-right';
  private readonly service = inject(FalconMessageService);
  ngOnInit(): void {
    this.service.messages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((next) => this.messages.set(next));
  }
}
```

The host renders one `<falcon-angular-toast>` per active `FalconMessageService` message inside `<falcon-angular-toast-host>`. This is the PrimeNG `MessageService` drop-in. **NOTE:** `<falcon-angular-message-host>` is itself dead-mounted in the current app shell — `apps/host-shell/src/app/app.ts` mounts `<falcon-modal-adapter />` + `<falcon-toast-adapter />` instead (`[CODE]` app.ts:47-48), and the toast-adapter renders `<falcon-angular-notification>`, NOT `<falcon-angular-toast>`. So in the running app, `<falcon-toast>` renders nothing today.

### Design-time showcase

`[CODE]` `libs/falcon-studio/src/lib/registry/examples/overlay-feedback-examples.ts` + `gallery-defaults.ts` — Falcon Studio gallery entries demonstrating the toast (not app runtime).

## Recommended usage for NEW pages

**Do NOT instantiate `<falcon-angular-toast>` directly.** For all new platform messaging:

```ts
import { FalconMessageOrchestratorService } from '@falcon/ui-core/angular';
private readonly messages = inject(FalconMessageOrchestratorService);

this.messages.show({
  category: 'success',          // or 'info' | 'warning' | 'business-error' | 'validation-error' | …
  title: 'Saved',
  message: 'Changes applied.',
  source: 'my-feature.save',
});
```

…or, for the legacy notification facade still used by many slices:

```ts
import { FalconNotificationService } from '@falcon/ui-core/angular';
inject(FalconNotificationService).push({ intent: 'success', title: 'Saved', subtitle: 'Changes applied.' });
```

Both route into the orchestrator and render via `<falcon-toast-adapter>` → `<falcon-angular-notification>` (mounted once in `app.ts`). For HTTP feedback, attach `withSuccess()`/`withMessages()` to the request (see `INTEGRATION_VALIDATION.md`).

### Direct standalone toast (rare — non-orchestrator embedding)

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

## Reactive Forms / ngModel

N/A — not a form control.

## Tailwind-only usage

- Toast geometry/paint is fully token-driven; the `-tw` path uses the `falconToast*Classes()` helpers (`[CODE]` toast-tailwind-classes.ts).
- The `action` slot accepts custom Tailwind buttons via `<ng-content select="[slot=action]">`.

## Per-instance token override

```css
.brand-toast {
  --falcon-toast-bg: var(--color-falcon-teal-50);
  --falcon-toast-color: var(--color-falcon-teal-900);
  --falcon-toast-border-color: var(--color-falcon-teal-200);
  --falcon-toast-icon-success-color: var(--color-falcon-teal-700);
}
```

Apply the host class via `rootClass="brand-toast"` (forwarded to the Stencil tag on both paths).

## Bad usage to avoid

- **Do NOT** instantiate `<falcon-angular-toast>` in feature code — the live platform surface is the orchestrator + `<falcon-angular-notification>`.
- **Do NOT** mount `<falcon-angular-message-host>` in a new app shell — it is the dead-mounted legacy path; use `<falcon-toast-adapter>` (already in `app.ts`).
- **Do NOT** put a must-acknowledge error in a toast — it auto-dismisses; route it through the orchestrator's modal channel (`action-required` / `configuration-required`).
- **Do NOT** set `duration=0` AND `dismissible=false` — the toast becomes immortal and un-closable.
- **Do NOT** pass HTML in `message` — rendered as text; use the `action` slot for affordances.
- **Do NOT** mount more than one host of any kind per app — duplicate toasts.

## Import requirements (standalone component)

```ts
@Component({
  standalone: true,
  imports: [FalconAngularToastComponent, FalconAngularToastHostComponent],
  // CUSTOM_ELEMENTS_SCHEMA NOT needed — the wrappers declare it internally.
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `FalconMessageOrchestratorService.show(...)` for new messaging | Instantiate `<falcon-angular-toast>` directly |
| Use `FalconNotificationService.push(...)` for the legacy facade | Mount `<falcon-angular-message-host>` in a new shell |
| Let `<falcon-toast-adapter>` (in `app.ts`) render messages | Add a second message host/adapter |
| Override paint via `toast.tokens.css` vars + `rootClass` | Hardcode hex/px in `style=` |
| Use the orchestrator `modal` channel for must-ack errors | Put a critical error in an auto-dismiss toast |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-toast` / `FalconAngularToast(Host)?Component` across the repo (excl. node_modules):

- **`apps/**` template hits: 0** (`<falcon-angular-toast>` is NOT used in any feature template — verified via `Grep` on `apps/`).
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.ts` (+ `.html`) — the ONE composition that imports/renders the toast (legacy, dead-mounted).
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/` — the component's own files (component, host, index).
- `libs/falcon/src/shared-ui/index.ts:379-380` — `@falcon` barrel re-export.
- `libs/falcon-studio/src/lib/registry/{gallery-defaults.ts, examples/overlay-feedback-examples.ts}` — gallery showcase.
- `libs/falcon-ui-tokens/src/components/toast.tokens.css` · `libs/falcon-ui-core/SPEC-LOCK.md` · `libs/falcon-studio/WAVE-8A-AUDIT-REPORT.md` — token/doc refs.

> Total real consumer files = **1** (`<falcon-angular-message-host>`), and it is dead-mounted. The prior dossier's "Wave 7 consumer count: 2 incl. playground.page.html" is now stale (playground route removed; showcase moved to falcon-studio gallery + the live `falcon-ui-showcase` uses notification).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). Consumer sweep re-run (`<falcon-angular-toast>` = 0 app consumers; sole path = `<falcon-angular-message-host>`, dead-mounted). app.ts mount of `<falcon-toast-adapter>` (NOT the message-host) confirmed (`[CODE]` app.ts:47-48). Recommended-usage rewritten to the orchestrator path.
