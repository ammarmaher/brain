# falcon-notification — USAGE

## Real usage examples (active codebase)

`[CODE]` The card is the LIVE message surface, but it is almost never instantiated directly in feature templates — features fire it through the orchestrator or a facade. The direct embeds are the showcase + the adapter:

### The live renderer — `<falcon-toast-adapter>` (mounted once in app.ts)

`[CODE]` `libs/falcon-ui-core/src/services/message-orchestrator/adapters/falcon-toast-adapter.component.ts:83-91`:

```ts
@for (m of [message]; track m.id) {
  <falcon-angular-notification
    [intent]="intentFor(m)"
    [title]="m.title"
    [subtitle]="m.message"
    (dismiss)="onDismiss(m.id)" />
}
```

`[CODE]` `apps/host-shell/src/app/app.ts:47-48` mounts `<falcon-modal-adapter />` + `<falcon-toast-adapter />` (the comment notes it "Replaces the prior `<falcon-angular-notification-stack>` mount"). The adapter passes NO appearance overrides — the card reads `FalconConfigurationService.notification.*` defaults.

### How features actually fire a notification (the real usage)

```ts
// (A) preferred — directly via the orchestrator
import { FalconMessageOrchestratorService } from '@falcon/ui-core/angular';
inject(FalconMessageOrchestratorService).show({
  category: 'success', title: 'Saved', message: 'Changes applied.', source: 'my-feature.save',
});

// (B) legacy facade still used by many slices (settings-tab, info-panel, host-notifier)
import { FalconNotificationService } from '@falcon/ui-core/angular';
inject(FalconNotificationService).push({ intent: 'success', title: 'Saved', subtitle: 'Changes applied.' });

// (C) imperative non-HTTP facade
import { FalconToastService } from '@falcon/ui-core/angular';
inject(FalconToastService).error('Invalid email', 'Please use a real address.');

// (D) per-HTTP-call — attach to the request
import { withSuccess, withMessages, FalconToastMessage } from '@falcon/ui-core/angular';
this.http.post(url, payload, withSuccess('User created successfully'));
this.http.delete(url, withMessages({
  success: FalconToastMessage.success('Client deleted'),
  error:   FalconToastMessage.error('Cannot delete', 'Client has active accounts.'),
}));
```

All four route into `FalconMessageOrchestratorService` → `<falcon-toast-adapter>` → this card.

## Recommended usage for NEW pages

Use **(A)** the orchestrator for full control, or **(D)** `withMessages()` for HTTP feedback. Do NOT mount a `<falcon-angular-notification-stack>` (superseded — `<falcon-toast-adapter>` is already in `app.ts`). Do NOT embed `<falcon-angular-notification>` directly unless you need a non-orchestrator inline status card on a specific page:

### Standalone single card (rare — inline page status, not the global stack)

```html
<falcon-angular-notification
  [open]="showSaveSuccess()"
  intent="success"
  title="Saved"
  subtitle="Changes applied."
  dismissMode="auto"
  (dismiss)="showSaveSuccess.set(false)" />
```

### Manual-dismiss (sticky until clicked)

```html
<falcon-angular-notification
  [open]="errorOpen()"
  intent="error"
  title="Connection lost"
  subtitle="Reconnecting…"
  dismissMode="manual"
  (dismiss)="errorOpen.set(false)" />
```

## Reactive Forms / ngModel

N/A.

## Tailwind-only usage

The component IS Tailwind — its inline template uses utilities throughout. Callers do not add Tailwind around it.

## Per-instance token override

`[CODE]` **Not possible via a token file** — notification has NO `notification.tokens.css`. Appearance is driven by the 16 inputs + Falcon palette tokens (consumed as Tailwind utilities) + inline `[style.border-*]`/`[style.border-radius.px]`. For platform-wide changes, set `FalconConfigurationService.notification.*` (from `falcon-defaults.json`) or override the palette tokens globally.

## Bad usage to avoid

- **Don't** use it for action-required decisions — use the orchestrator's `action-required`/`configuration-required` (modal channel).
- **Don't** mount `<falcon-angular-notification-stack>` in a new app — it is superseded by `<falcon-toast-adapter>` (already mounted) AND its service feed always returns `[]` (Phase-5 shim) → renders nothing.
- **Don't** mount a second `<falcon-toast-adapter>` / notification stack — duplicate cards.
- **Don't** pass `[dismissDuration]="0"` with `dismissMode="auto"` — the timer fires immediately (`Math.max(1, …)` clamps to 1s, `[CODE]` falcon-notification.component.ts:288). Use `dismissMode="manual"` for persistent.
- **Don't** expect rich content — no slots; `title` + `subtitle` text only.
- **Don't** pass `null` to an appearance input expecting a reset — only `undefined` falls back to the config default.
- **Don't** subscribe to `(dismiss)` AND let the timer auto-dismiss while ALSO tracking via the orchestrator — pick one ownership.

## Import requirements (standalone component)

```ts
// For the orchestrator path (preferred): inject the service, mount nothing
// — <falcon-toast-adapter /> is already in app.ts.

// For a standalone inline card:
@Component({ standalone: true, imports: [FalconAngularNotificationComponent] })
```

## Do / Don't

| Do | Don't |
|---|---|
| Fire via `orchestrator.show(...)` / `FalconNotificationService.push(...)` / `withMessages(...)` | Mount a `<falcon-angular-notification-stack>` (superseded, feeds `[]`) |
| Let `<falcon-toast-adapter>` (in app.ts) render | Add a second adapter/stack |
| Use `dismissMode="manual"` for critical errors | `dismissMode="auto"` + `dismissDuration=0` for persistent (timer clamps to 1s) |
| Provide `title` (required) + `subtitle` | Rely on long titles, skip subtitle |
| Use the orchestrator `modal` channel for must-ack | Put a confirm/cancel decision in a notification |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-notification` / `FalconNotificationService` / `FalconToastService` / `withSuccess|withMessages|FalconToastMessage` across the repo (excl. node_modules) = **~45 files**. By category:

- **Live renderer + mount:** `libs/falcon-ui-core/.../adapters/falcon-toast-adapter.component.ts`; `apps/host-shell/src/app/app.ts`.
- **`FalconNotificationService.push`:** `apps/host-shell/falcon-facades/host-notifier.facade.ts`; `apps/{admin,management}-console/.../settings-tab/signals/settings-tab.signals.ts`; `.../falcon-org-info-panel/signals/info-panel-state.signals.ts`; `.../add-user-wizard/services/user.service.ts`; `.../add-client-wizard/{signals/add-client-wizard.signals.ts,services/client.service.ts}`; `.../org-hierarchy-page/services/services.ts`.
- **`FalconToastService` / `withMessages` / `FalconToastMessage`:** `apps/admin-console/.../contracts-cost-management/**` (wizard, edit, models, + specs); `apps/{admin,management}-console/.../new-wallet-balance/**` (+ specs); `apps/{admin,management}-console/.../templates-page/.../templates-wizard.component.ts`; `apps/host-shell/.../service-pricing/service-pricing.component.ts`; `apps/host-shell/.../do-payment-priority-popup/**`; `libs/falcon-ui-core/.../falcon-confirm-dialog-host/**`.
- **HTTP dispatcher/config:** `apps/host-shell/src/app/core/http-ui/{falcon-http-ui-dispatcher.service.ts, falcon-http-ui.config.ts, README.md}` (+ `apps/host-shell/tests/falcon-http-ui-dispatcher.spec.ts`).
- **Barrel:** `libs/falcon/src/shared-ui/index.ts:371`.
- **Showcase:** `apps/host-shell/.../falcon-ui-showcase/{library-section,falcon-ui-showcase}.component.ts`.

> Real consumer count via the messaging family = **~45 files** (vs the prior dossier's "4 = showcase + 2 wizard signals + app.ts"). The wizard signals that the prior sweep matched on `<falcon-angular-notification-stack>` now route via `FalconNotificationService` → orchestrator.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16). Recommended usage rewritten to the orchestrator path; the dead-stack-mount + service-shim-returns-`[]` traps documented; consumer sweep re-run (~45 files). The `withMessages`/`withSuccess` HTTP examples transcribed from `falcon-http-messages.ts:20-27`.
