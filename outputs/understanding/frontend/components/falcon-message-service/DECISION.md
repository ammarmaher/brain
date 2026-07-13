# falcon-message-service — DECISION

## Brain SK final recommendation

**STATUS: ACTIVE back-compat shim (service) + DEAD no-op host (component) flagged for removal. For NEW code, use `FalconMessageOrchestratorService.show()` — NOT this shim.**

This unit supersedes the `falcon-message-host` dossier (which described a pre-Phase-5 BehaviorSubject queue). The `FalconMessageService` injectable is alive only as a PrimeNG-compat adapter that forwards to the orchestrator.

## Use this unit for

- Keeping an EXISTING PrimeNG-shaped `.add({severity, summary, detail})` call site working through the Falcon orchestrator with zero refactor (e.g. `templates-list` review toasts).

## Avoid this unit for

- **NEW code** — use `FalconMessageOrchestratorService.show({ category, title, message, source })`.
- **Action-required decisions** — use `FalconConfirmService` / `FalconUnsavedChangesService` (orchestrator `action-required` modal). The shim cannot produce a modal.
- **Component-bound passive feedback** — use `FalconNotificationService` + `<falcon-angular-notification-stack>`.
- **Relying on `life`/`closable`/`icon`** — ignored in Phase 5.
- **Subscribing to `messages$`** — dead.

## Preferred render path

There is no render path in this unit. The live toast render is `FalconToastAdapterComponent` (orchestrator-bound). Do NOT mount `<falcon-angular-message-host>` for new shells.

## Required upgrades before wider use

None for the shim (it works). The host should be deleted (G-DEAD-HOST, HIGH-RISK-QUEUE) — but that is cleanup, not a blocker.

## Relationship to other components

| Unit | Relationship |
|---|---|
| `FalconMessageOrchestratorService` | **The authority this shim forwards to.** Canonical. |
| `FalconToastAdapterComponent` / `FalconModalAdapterComponent` | The live renderers (orchestrator-bound). |
| `<falcon-angular-toast>` / `<falcon-angular-toast-host>` | Historical render children — never mounted in Phase 5. |
| `FalconUnsavedChangesService` / `FalconConfirmService` | Sibling shims that also route to the orchestrator (B18 covers unsaved-changes). |
| `FalconNotificationService` + `<falcon-angular-notification-stack>` | The modern signal-native path for new feedback. |

## Exact rule for future implementation tasks

1. **Net-new transient toast?** Inject `FalconMessageOrchestratorService`; call `show({ category, title, message, source })`. Wire `provideMessageOrchestrator()` once per app + mount the adapters once.
2. **Migrating a PrimeNG `MessageService` call site?** Swap the import to `FalconMessageService`; the `.add()` shape still works. Drop reliance on `life`/`closable`/`icon`.
3. **Must-acknowledge / confirm?** Use `FalconConfirmService` / `FalconUnsavedChangesService` — the shim can't block.
4. **Never** subscribe to `messages$`, mount `<falcon-angular-message-host>` afresh, or extend the shim.
5. **Import the right type** — `FalconOrchestratorMessage` for the orchestrator shape.

---

## Dynamic capability assessment

### 1. What is static today?
- The shim always forwards to the orchestrator with `source:'falcon-message-service-shim'`.
- `severityToCategory` mapping is a fixed switch (success/info/warning/business-error/info-fallback).
- The host always renders `<falcon-angular-toast-host>` + a `@for` of `<falcon-angular-toast>` — but the loop is always empty.
- `messages$` always emits `[]`.

### 2. What is already dynamic through inputs/outputs?
- Service: `add()` / `addAll()` / `remove(id)` / `clear()`.
- Host: `position`, `useTailwind` (inert).
- Message: `id` / `severity` / `summary` / `detail` (`life`/`closable`/`icon` accepted-but-ignored).

### 3. What is already dynamic through slots / ng-template?
None.

### 4. What is dynamic through token/theme overrides?
Nothing in this unit. The orchestrator's notification card reads `falcon-defaults.json.notification`.

### 5. What is dynamic through Tailwind classes?
N/A — no surface.

### 6. What is missing to make this unit reusable across pages?
Nothing — the orchestrator (the real authority) is fully reusable. The shim is intentionally minimal.

### 7. What capability should be added to the shared component instead of a page hack?
None to the shim. Any new messaging capability belongs in `FalconMessageOrchestratorService`.

### 8. What flags / options / templates / slots would make it better?
- A dev `console.warn` when `life`/`closable`/`icon` are set (so migrators learn they are ignored) — G-DROP.
- Otherwise, nothing — the shim should shrink, not grow.

### 9. What is the safest upgrade path?
1. **Phase A (doc-only, zero risk):** fix stale JSDoc/banners (G-STALE-CLAIM / G-STALE-BANNER). Mark the host `@deprecated`.
2. **Phase B (HIGH-RISK-QUEUE):** delete `<falcon-angular-message-host>` + its `app.ts` mount + barrel export, once no PrimeNG-shaped caller imports the host. Keep the service.
3. **Phase C:** drop the dead `messages$` slot from the service.
4. **Phase D:** strip `life`/`closable`/`icon` from `FalconMessage` + collapse the `FalconOrchestratorMessage` alias (breaking — gate behind a major).

### 10. What is risky to change because other pages depend on it?
- **`FalconMessageService.add({severity, summary, detail})` shape** — `templates-list` (admin + mgmt) relies on it. Keep the shape.
- **The `'warn'→'warning'` mapping** — removing breaks PrimeNG-migrated callers.
- **`providedIn:'root'` singleton** — flipping to module-scoped breaks shared usage.
- **The barrel export `FalconAngularMessageHostComponent`** — removing it is a public-API break (G-DEAD-HOST is queued for that reason).
- **The `FalconMessage` type name** — collapsing the orchestrator alias would clash; sequence it after the shim is gone.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18). Recommendation: shim ACTIVE / host DEAD-flagged / orchestrator canonical. Counts: 2 live `.add()` callers, 1 no-op mount. `falcon-message-host` dossier flagged for B23 deprecation.
