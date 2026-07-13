# falcon-unsaved-changes-host — OVERVIEW

> **Supersession note (2026-06-03, B18):** the HOST component's own banner says it "renders `<falcon-angular-popup variant=unsaved>` when a request is active." `[CODE]` `falcon-unsaved-changes.service.ts:1-14` — **as of Phase 5 (2026-05-24) that is no longer true:** the SERVICE routes every `confirm()` through `FalconMessageOrchestratorService.show({category:'action-required'})`, the host's `active()` signal is **always null**, and the host renders nothing. The real modal is drawn by the orchestrator's `FalconModalAdapterComponent`. The host is a **no-op shell pending removal**.

## Component purpose

This unit is the **global "you have unsaved changes — discard & leave?" gate**: an injectable `FalconUnsavedChangesService` (the imperative API any feature/guard calls) plus its now-vestigial `<falcon-unsaved-changes-host>` (the legacy render shell). `[CODE]` `falcon-unsaved-changes.service.ts:43-90` — `confirm(options): Observable<boolean>` opens the leave-confirmation; the Observable emits **once** — `true` = discard & leave, `false` = stay / cancel / backdrop / Esc — then completes. It is the chokepoint every leave path (router **CanDeactivate**, tab switch, tree-node select, in-page menu) funnels through so the prompt + copy are identical platform-wide.

## Business / UI use case

- **Route-guard-driven leave protection** — `[CODE]` `apps/{admin,management}-console/.../org-hierarchy-page/services/hierarchy-page-state.service.ts:205-260` — `confirmDiscardIfDirty()` is THE single gate: emits `true` immediately when nothing is dirty; otherwise opens `FalconUnsavedChangesService.confirm({...})` with context-aware copy and, on Discard, resets the dirty surface BEFORE emitting `true`. Router `CanDeactivate` / tab-switch / tree-select / menus all call it.
- **Wizard exit guard** — `[CODE]` `apps/{admin,management}-console/.../add-user-wizard/add-user-wizard.component.ts:398-411` — `onExit()` routes through the same service when the wizard is dirty.
- The same singleton is shared via Module-Federation `@falcon/ui-core` so **one gate covers host-shell + every remote**.

## When to use it / when NOT to use it

**Use it for:**
- Any "abandon in-progress edits?" prompt — wherever a CanDeactivate guard, tab switch, or navigation could discard unsaved form state.
- A platform-consistent discard/stay decision (the copy + buttons are identical everywhere).

**Do NOT use it for:**
- **Generic confirmations** with bespoke semantics (delete / archive / publish) — use `FalconConfirmService` or `<falcon-angular-popup>` directly.
- **Transient feedback** — use `FalconMessageOrchestratorService.show({category:'success'|'business-error'})`.
- **Mounting a NEW `<falcon-unsaved-changes-host>`** — it renders nothing in Phase 5; the orchestrator's modal-adapter is the renderer.
- **Relying on `hintOverride`** — `[CODE]` the Phase-5 orchestrator mapping has NO `hint` field, so `hintOverride` is silently dropped (GAP G-HINT-DROP).

## Status

**ACTIVE — the SERVICE (`FalconUnsavedChangesService`) is alive and heavily used as the platform leave-gate. The HOST component (`<falcon-unsaved-changes-host>`) is a no-op shell kept mounted to avoid a churny diff; flagged for removal** (`[CODE]` `falcon-unsaved-changes.service.ts:13-14`). Canonical render = `FalconMessageOrchestratorService` + `FalconModalAdapterComponent`.

## Replaces

- Per-page inline `<falcon-angular-popup variant="unsaved">` mounts (centralized into one service + gate).
- Internally superseded by `FalconMessageOrchestratorService` (Phase 5, 2026-05-24) — the service now forwards to it.

## Source file paths

| Layer | Path |
|---|---|
| Service TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-unsaved-changes-host/falcon-unsaved-changes.service.ts` (100 ln) |
| Host component TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-unsaved-changes-host/falcon-unsaved-changes-host.component.ts` (57 ln, INLINE template) |
| Barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-unsaved-changes-host/index.ts` |
| Top-level barrel | `libs/falcon-ui-core/src/angular-wrapper/index.ts:53-55` → consumers import from `@falcon/ui-core/angular` |
| Host composes | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-popup/falcon-popup.component.ts` (`<falcon-angular-popup variant="unsaved">` — only when `active()` fires, which it never does in Phase 5) |
| **Live successor (service)** | `libs/falcon-ui-core/src/services/message-orchestrator/falcon-message-orchestrator.service.ts` |
| Live successor (renderer) | `FalconModalAdapterComponent` (orchestrator-bound, mounted in `apps/host-shell/src/app/app.ts`) |
| Stencil sources | _None_ — Angular-only. |
| Token file | _None_ — the (never-rendered) popup uses Falcon palette tokens; the host/service have no tokens. |
| Spec | _None_ for the service or host. (Orchestrator tested separately.) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular host selector | `falcon-unsaved-changes-host` (no-op) |
| Injectable | `FalconUnsavedChangesService` (`providedIn: 'root'`) |
| Stencil tag | _None_ |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `FalconUnsavedChangesService` / `falcon-unsaved-changes-host` across `apps/`:
- **Service `confirm()` callers (the live API):**
  - `apps/{admin,management}-console/.../org-hierarchy-page/services/hierarchy-page-state.service.ts` — `confirmDiscardIfDirty()` central gate (router CanDeactivate / tab / tree / menu) + the Add Client tree-select discard path.
  - `apps/{admin,management}-console/.../add-user-wizard/add-user-wizard.component.ts` — `onExit()` wizard discard.
  - `apps/{admin,management}-console/.../falcon-org-info-panel/signals/info-panel-state.signals.ts` — info-panel edit discard.
  - `apps/{admin,management}-console/.../add-client-wizard/add-client-wizard.component.ts` — wizard discard.
- **Host mount (1):** `apps/host-shell/src/app/app.ts:9,32,57` (`<falcon-unsaved-changes-host />` — no-op).

## Related components

- **Composed (when active — never in Phase 5):** `<falcon-angular-popup variant="unsaved">`.
- **Live successor:** `FalconMessageOrchestratorService` + `FalconModalAdapterComponent`.
- **Sibling shims** routing to the orchestrator: `FalconMessageService` + `<falcon-angular-message-host>` (B18), `FalconConfirmService` + `<falcon-angular-confirm-dialog-host>`, `falcon-http-error-dialog-host`.
- **Substrate of the popup it would render:** `[falconOverlay]` directive (B14).

## Ownership / responsibility

`libs/falcon-ui-core` (Angular-wrapper layer). Owned by Falcon UI team. Canonical render contract lives in `libs/falcon-ui-core/src/services/message-orchestrator`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18 sweep, NEW dossier). Supersession + the route-guard↔host↔confirm wiring confirmed against `falcon-unsaved-changes.service.ts` (100 ln), `falcon-unsaved-changes-host.component.ts` (57 ln), the orchestrator service, `hierarchy-page-state.service.ts` `confirmDiscardIfDirty()`, `add-user-wizard.component.ts` `onExit()`, and the `app.ts` mount. Consumer sweep via Grep.
