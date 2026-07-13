# falcon-message-service — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` The shim has **no visible business surface of its own** — its business value is **migration economics + governance**. It lets PrimeNG-`MessageService`-shaped code keep firing transient operator feedback (approve/reject/save/error toasts) **without a rewrite**, while transparently funneling that feedback through the **one canonical message-routing authority** (`FalconMessageOrchestratorService`) so the platform's "only one message visible at a time per channel, action-required beats toast, latest-wins" spec holds even for legacy callers.

`[CODE]` `falcon-message-service.ts:75-87` — the operator-facing business event (e.g. "template approved") is `add({severity:'success', summary})` → `orchestrator.show({category:'success', title, …})` → the toast-adapter's notification card.

## PRD / business rules touched

| Rule | Source | How this unit enforces / surfaces it |
|---|---|---|
| Migration must not require rewriting message call-sites | `[BRAIN-OUT]` OVERVIEW "Replaces PrimeNG `<p-toast>`" + `[CODE]` `falcon-message-service.ts:73-74` | `add/addAll/remove/clear` + the `{severity,summary,detail}` shape preserved; only the import path changes. |
| One message visible at a time per channel (toast) | `[CODE]` `message-priorities.json:2-3` (`showOnlyOneMessage`, `replaceSamePriorityWithLatest`) + `falcon-message-orchestrator.service.ts:194-233` | Because `.add()` now routes to the orchestrator, even legacy callers obey latest-wins / priority routing — no toast pile-up. |
| Action-required ALWAYS beats toast | `[CODE]` `message-priorities.json:6-7` (action/config = modal, blocking) + orchestrator `routeToast` suppression | A `FalconMessageService.add()` toast is suppressed (stashed pending) while a blocking modal is up — the shim inherits this for free. |
| `severity:'warn'` (PrimeNG) must keep working | `[CODE]` `falcon-message-service.ts:53` | `severityToCategory` normalizes `'warn'`→`'warning'`→category `'warning'`. |
| Templates approval/rejection produces operator feedback | `[CODE]` `templates-list.component.ts:407/450/490/522` | Approve/reject/submit success + CAS-loss warning + failure toasts all go through the shim. |

## Business constraints baked in

- `[CODE]` **A `FalconMessageService.add()` can only ever be a toast, never a blocking modal** — `severityToCategory` maps only to toast-presentation categories (success/info/warning/business-error). A legacy caller cannot accidentally raise an action-required popup through this API. That is a *business safety property*: imperative fire-and-forget feedback never blocks the operator.
- `[CODE]` `falcon-message-service.ts:38-46` **`life` / `closable` / `icon` are no longer the caller's decision** — auto-dismiss timing + dismissibility + icon are now a platform-wide policy (`falcon-defaults.json.notification`), not a per-call choice. A team can change dismiss timing once, centrally, and every legacy toast obeys.
- `[CODE]` :84 **Correlation, not content, identifies a message** — the shim stamps `correlationId = id ?? 'falcon-msg|{seq}'`; `remove(id)` retracts by correlation. Business code that needs to retract its own message must pass a stable `id`.
- `[CODE]` :97 **3s dedupe is inherited** — identical category+title+message within 3s is suppressed by the orchestrator, so a double-click that fires the same toast twice shows once (a business UX win the old BehaviorSubject path lacked).

## Business flows using this unit

| Flow | Page | Role of the unit in the flow |
|---|---|---|
| Template approve / reject | templates-page (admin + mgmt) | `[CODE]` `templates-list.component.ts` — success/rejection/CAS-loss/error toasts via `.add()`. |
| Template submit for approval / to Meta | templates-page | `[CODE]` :490/522 — submission outcome toasts. |
| (historical) global HTTP error feedback | host-shell | The old dossier cited `response-interceptor.ts`; the live HTTP pipeline now uses `falcon-http-messages.ts` → orchestrator directly, NOT this shim. |
| (historical) Add Client / Add User wizard | org-hierarchy | The old dossier cited `add-client-wizard.signals.ts` / `add-user-state.signals.ts`; those moved to direct orchestrator / notification (`[CODE]` `user.service.ts:19-24` comment trail). |

## Business gotchas

- `[CODE]` **"toasts not showing" is no longer a missing-host problem** — even with the `<falcon-angular-message-host>` mount deleted, `.add()` would still work (it routes to the orchestrator, rendered by `FalconToastAdapterComponent`). The old dossier's "missing host mount → silent queue" diagnosis is **inverted** in Phase 5: the host is irrelevant.
- `[CODE]` **A caller relying on `life:0` for a sticky message will be surprised** — it auto-dismisses on the platform default. This is a behavior change vs PrimeNG. (FINDINGS G-DROP.)
- `[INFERRED]` **"Use the orchestrator / notification for new code" is a governance rule, not a reason to distrust the shim** — the shim is a live, correct adapter. What is deprecated is *reaching for the PrimeNG-shaped API in net-new code*.
- `[CODE]` **Two `FalconMessage` types in one library** is a latent footgun — a business developer importing the wrong one gets a different field set (FINDINGS, duplicate type name).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B18) — `severityToCategory` mapping, toast-only constraint, dedupe inheritance, and the `templates-list` business flows all confirmed in live source. Historical flows (interceptor / wizard signals) marked as MOVED based on `[CODE]` migration-trail comments + the orchestrator being the live HTTP-error surface (`falcon-http-messages.ts`).
