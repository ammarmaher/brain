---
name: Notification Facade Wave 13
description: Wave 13 — migrated wizards to FalconToastService + new FalconConfirmService for cross-MF unified notification surface.
type: project
originSessionId: 3c6eb4d3-1acd-410f-88fc-0e249d20b4a6
---
🟢 LANDED 2026-05-17 (Wave 13). Two builds GREEN: admin-console `66a8b7df5818a1e3`/17.38s + host-shell `155d6cd434ef0873`/11.95s.

**User ask:** Toast not showing after Add User wizard closes. Asked for a unified architecture covering success / error / business-message / confirmation-popup that any component (including remotes) can fire to a base-level component.

**Diagnosis (source-prefixed):**
- [CODE] `apps/host-shell/src/app/app.ts:24,30` — TWO toast renderers mounted: legacy `<falcon-angular-message-host>` + canonical Wave-4.2 `<falcon-angular-notification-stack position="top-right">`
- [CODE] `libs/falcon-ui-core/.../falcon-notification.service.ts` — `FalconNotificationService` (signal queue, providedIn root, 12s default dismiss)
- [CODE] `libs/falcon-ui-core/.../falcon-toast.service.ts:20` — `FalconToastService` exposes `.success() / .error() / .warning() / .info()` — the canonical clean facade
- [CODE] `add-user-state.signals.ts:82` (pre-Wave-13) — wizard was using LEGACY `FalconMessageService` → `<falcon-angular-message-host>`. Wave 4.2 migrated the rest of the app to the new stack but missed Add User + Add Client wizards.
- No confirm-popup service existed (the `<falcon-angular-confirm-dialog>` wrapper at `libs/falcon-ui-core/.../falcon-confirm-dialog/falcon-confirm-dialog.component.ts` is fully commented-out unfinished code).

**Decision:** Don't build a new "unified facade" — the codebase already has separated concerns per service:
- Toasts: `FalconToastService` (4 methods: success/error/warning/info)
- HTTP-error popups: `ErrorDialogService` / `FalconHttpErrorDialogService`
- Notification queue primitive: `FalconNotificationService`
- Loader overlay: `FalconLoaderService`
- Confirm popup: ← THIS WAS THE GAP

Adding a 5th meta-facade would be fragmentation. Instead: **migrate to existing FalconToastService + add only the missing FalconConfirmService** (mirror of ErrorDialogService doctrine).

**Delta:**

NEW (3 files):
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog-host/falcon-confirm.service.ts` — `FalconConfirmService` (`providedIn:'root'`). Public API: `confirm({title, body, severity, confirmLabel, cancelLabel, ...}): Observable<boolean>`. Sequential semantics (one active at a time; new request resolves previous as `false`). Teardown on unsubscribe = cancel.
- `libs/falcon-ui-core/.../falcon-confirm-dialog-host/falcon-confirm-dialog-host.component.{ts,html}` — `<falcon-angular-confirm-dialog-host>`. Renders `<falcon-angular-alert-dialog>` (the COMPLETE wrapper, not the commented-out one) when service.active() emits. Forwards confirm/cancel/backdrop/Esc to service.accept()/reject().
- `libs/falcon-ui-core/.../falcon-confirm-dialog-host/index.ts` — barrel

MIGRATED (3 files):
- `apps/admin-console/.../add-user-state.signals.ts` — `FalconMessageService` → `FalconToastService` (success branch now `.toast.success(title, body)`)
- `apps/admin-console/.../add-client-wizard.signals.ts` — same migration (parity)
- `apps/host-shell/src/app/app.ts` — mount `<falcon-angular-confirm-dialog-host />` next to other 4 hosts

PUBLIC API (3 files):
- `libs/falcon-ui-core/src/angular-wrapper/index.ts` — export the new confirm-dialog-host barrel

**Why this fixes the missing-toast bug:**
The legacy `<falcon-angular-message-host>` IS mounted but its `FalconMessageService` queue is what the wizards were writing to. After Wave 4.2's migration of the rest of the platform to `<falcon-angular-notification-stack>`, the wizards became the last consumers of the legacy stack. Switching them to `FalconToastService` routes their success messages through the actively-rendered stack.

**TS visibility gotcha solved:** internal `ActiveConfirm` interface (which adds `resolve`) was leaking through the `active` computed signal's inferred return type → TS4029 "ActiveConfirm cannot be named". Fix: explicit `computed<FalconConfirmRequest | null>` narrows the public type so consumers only see the request shape.

**Cross-MF guarantee:** all 4 services (`FalconNotificationService`, `FalconToastService`, `FalconConfirmService`, `ErrorDialogService`) live in `@falcon/ui-core` which is `singleton: true, requiredVersion: false, eager: true` in every app's `module-federation.config.ts`. Same singleton class identity + same Angular root injector across host + remotes → all remotes share the same instance.

**Available notification surfaces after Wave 13:**
| Concern | Service | API | Renders to |
|---|---|---|---|
| Success toast | `FalconToastService` | `.success(title, body?)` | `<falcon-angular-notification-stack>` (top-right) |
| Error toast | `FalconToastService` | `.error(title, body?)` | same |
| Business / warning toast | `FalconToastService` | `.warning(title, body?)` / `.info(...)` | same |
| HTTP-error popup | `ErrorDialogService` | `.openError({httpStatus, errorMessages})` | `<falcon-angular-error-dialog-host>` |
| **Confirm popup (NEW)** | `FalconConfirmService` | `.confirm({title, body, severity?}): Observable<boolean>` | `<falcon-angular-confirm-dialog-host>` |
| Global loader overlay | `FalconLoaderService` | service-bound signals | `<falcon-angular-loader-overlay>` |

**Sample new-API usage:**
```typescript
// In any component / service / state slice in any MF remote:
import { FalconToastService, FalconConfirmService } from '@falcon/ui-core/angular';

readonly toast = inject(FalconToastService);
readonly confirm = inject(FalconConfirmService);

onSuccess(): void {
  this.toast.success('User created', 'John was created successfully');
}

onDelete(id: string): void {
  this.confirm.confirm({
    title: 'Delete this user?',
    body: 'This action cannot be undone.',
    severity: 'danger',
    confirmLabel: 'Delete',
  }).subscribe(accepted => {
    if (accepted) this.api.deleteUser(id).subscribe();
  });
}
```

**Trigger to revisit:** `notification facade` / `confirm popup` / `migrate to FalconToastService` / `cross-MF singleton service`.
