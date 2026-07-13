# falcon-message-service — USAGE

## Real usage examples (active codebase)

### Example 1 — live `.add()` caller (templates review toasts)

`[CODE]` `apps/admin-console/src/app/features/templates-page/components/templates-list.component.ts:161` injects the shim as `toast`, then fires PrimeNG-shaped messages (which now route to the orchestrator):

```ts
private readonly toast = inject(FalconMessageService);
// ...
// :407-411 — approve success
this.toast.add({
  severity: 'success',
  summary: this.i18n.translate('templates.details.toast.approved'),
  life: 3000,   // ⚠ life is IGNORED in Phase 5 — orchestrator owns timing
});
// :399-403 — CAS-loss (another reviewer beat us)
this.toast.add({
  severity: 'warn',   // mapped → 'warning'
  summary: this.i18n.translate('templates.details.toast.alreadyDecided'),
  life: 4500,
});
// :416-420 — failure
this.toast.add({ severity: 'error', summary: this.i18n.translate('templates.details.toast.decisionError'), life: 4000 });
```

`apps/management-console/.../templates-list.component.ts:165` is identical (mgmt mirror).

### Example 2 — the no-op host mount (host-shell)

`[CODE]` `apps/host-shell/src/app/app.ts:38`:

```html
<falcon-angular-message-host position="top-right"></falcon-angular-message-host>
<!-- ↑ renders NOTHING in Phase 5 — messages$ always emits []. The live toast
     renderer is <falcon-angular-toast-adapter> (FalconToastAdapterComponent),
     also mounted in this template, bound to the orchestrator's activeToast(). -->
```

### Example 3 — the migration trail (what NEW code did instead)

`[CODE]` `apps/admin-console/.../templates-wizard/templates-wizard.component.ts:99-103` shows the canonical move — it injects `FalconMessageOrchestratorService` directly and notes: *"migrated FalconMessageService → FalconToastService. The legacy service feeds `<falcon-angular-message-host>`; the canonical Wave 4.2 surface is `<falcon-angular-notification-stack>` driven by …"*. This is the pattern NEW code follows.

## Recommended usage for NEW Angular code

**Do NOT inject `FalconMessageService` in new code.** Call the orchestrator directly:

```ts
import { FalconMessageOrchestratorService } from '@falcon/ui-core/angular';

private readonly messages = inject(FalconMessageOrchestratorService);

this.messages.show({
  category: 'success',                 // 'business-error' | 'warning' | 'info' | 'validation-error' | ...
  title: this.i18n.translate('templates.toast.approvedTitle'),
  message: this.i18n.translate('templates.toast.approvedBody'),
  source: 'admin-console.templates-list.approve',
  // optional: dedupeKey, correlationId, params
});
```

Wiring (once per app): `providers: [...provideMessageOrchestrator(), ...]` (`[CODE]` `falcon-message-orchestrator.providers.ts:161`).

## Migrating an existing PrimeNG `MessageService` caller

The ONLY change is the import path — the `.add({severity, summary, detail})` shape is preserved by the shim:

```ts
// before
import { MessageService } from 'primeng/api';
private readonly msgs = inject(MessageService);
// after
import { FalconMessageService } from '@falcon/ui-core/angular';
private readonly msgs = inject(FalconMessageService);
// .add({ severity: 'warn', summary, detail }) keeps working ('warn' → 'warning')
```

> Caveat: drop reliance on `life` / `closable` / `icon` — those are ignored once routed through the orchestrator.

## Tailwind-only usage

N/A — the host renders no visible content of its own; visual styling is the orchestrator toast-adapter's notification card (configured via `falcon-defaults.json`).

## Token override

N/A — no token contract. To restyle the toasts the orchestrator renders, configure `falcon-defaults.json.notification` (dismissMode / dismissDurationSec / countdownBar / borderWidth / accents / radius) — `[CODE]` `falcon-message-orchestrator.service.ts:24-32`.

## Bad usage to avoid

- **Do NOT** subscribe to `FalconMessageService.messages$` — it always emits `[]` (`[CODE]` :65-69). The old dossier's "the host subscribes and renders" is stale.
- **Do NOT** mount a second `<falcon-angular-message-host>` expecting a stack — it renders nothing either way.
- **Do NOT** set `life: 0` for a sticky toast — ignored; configure `dismissMode` in `falcon-defaults.json` instead.
- **Do NOT** reach for `FalconMessageService` in NEW code — use `FalconMessageOrchestratorService.show()`.
- **Do NOT** confuse the two `FalconMessage` types — import `FalconOrchestratorMessage` for the orchestrator shape.

## Do / Don't

| Do | Don't |
|---|---|
| Keep PrimeNG `.add({severity,summary,detail})` callers on the shim | Subscribe to `messages$` (dead) |
| Use `severity:'warn'` for PrimeNG compat (→ 'warning') | Rely on `life`/`closable`/`icon` (ignored) |
| Use `FalconMessageOrchestratorService.show()` for new code | Inject `FalconMessageService` in new code |
| Treat the host as a removable no-op | Restyle "the message-host" (no surface) |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `FalconMessageService` / `FalconAngularMessageHostComponent` / `falcon-angular-message-host` across `apps/` + `libs/falcon/`:

- **Live `.add()` callers (2 files):** `apps/admin-console/.../templates-page/components/templates-list.component.ts` (12 `.add()` sites), `apps/management-console/.../templates-page/components/templates-list.component.ts` (mirror).
- **Host mount (1 file):** `apps/host-shell/src/app/app.ts` (no-op).
- **Provider registration (1 file):** `apps/host-shell/src/app/app.config.ts` (redundant — `providedIn:'root'`).
- **Comment/migration-trail/test references (non-render):** `apps/{admin,management}-console/.../templates-wizard.component.ts`, `.../add-user-wizard/services/user.service.ts`, `.../org-hierarchy-page/services/state/users-state.signals.ts`, `apps/admin-console/tests/add-client-state-signals.spec.ts`, `libs/falcon-ui-core/SPEC-LOCK.md`, `eslint.config.mjs`.
- **`libs/falcon/`:** 0 direct callers.

> `[INFERRED]` Live caller count is **2 app files (12 occurrences)** — far below the orchestrator's true platform footprint. Most feedback now goes through the orchestrator directly (interceptors, `falcon-http-messages.ts`, wizard-finalization) or `FalconNotificationService`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18). `templates-list` `.add()` sites + the host-shell mount + the orchestrator migration trail all confirmed in live source. Consumer sweep run via Grep across `apps/` + `libs/falcon/`.
