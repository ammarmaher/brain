# falcon-completion-success-dialog — USAGE

## Real usage examples (active codebase)

### Example 1 — composed by `<falcon-angular-wizard-finalization>` (the live consumer)

`[CODE]` `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.html:47-53` — the one place it actually mounts:

```html
<falcon-angular-completion-success-dialog
  [open]="successOpen()"
  [title]="successTitle()"
  [subtitle]="successSubtitle()"
  [autoDismissMs]="autoDismissMs()"
  (closed)="onSuccessClosed()"
></falcon-angular-completion-success-dialog>
```

`[CODE]` The finalization component's state machine (`.ts:1-9` header): channel-selection popup → Send → picker closes + central loader shows + `submitFn()` fires → **success → loader hides → this dialog opens** → `(closed)` → emits `finalized`. The submit-ERROR path instead fires an orchestrator `business-error` toast (5s) — NOT this dialog.

### Example 2 — the deliberate "do NOT route through the orchestrator" decision

`[CODE]` `falcon-wizard-finalization.component.html:14-23` documents why the success ack stays inline:

```
2. <falcon-angular-completion-success-dialog> — branded success ack
   (clipboard illustration + auto-dismiss). Reverted from the Phase 3
   orchestrator action-required route (2026-05-24 addendum) — the
   orchestrator's modal-adapter rendered this as a small red-icon
   <falcon-angular-popup variant="error" hideCancel> OK/Cancel alert,
   which is the wrong visual for "Credentials sent to the user".
```

> This is the canonical example of when a bespoke dialog is correct vs collapsing into the orchestrator: the orchestrator is right for *toasts + decision modals*, wrong for a *large branded celebratory ack*.

### Example 3 — recommended standalone usage (new code)

```html
<falcon-angular-completion-success-dialog
  [open]="created()"
  [title]="'flows.addClient.success.title' | translate"
  [subtitle]="'flows.addClient.success.subtitle' | translate"
  [autoDismissMs]="10000"
  [closeAriaLabel]="'common.close' | translate"
  (closed)="onAckClosed()">
</falcon-angular-completion-success-dialog>
```

```ts
protected readonly created = signal(false);
protected onAckClosed(): void { this.created.set(false); /* navigate / reset */ }
```

> Pass **pre-translated** `[title]` / `[subtitle]` / `[closeAriaLabel]` — the component has no i18n hook.

## When to reach for a sibling instead

- Decision needed (OK/Cancel) → `<falcon-angular-popup variant="save">`.
- Transient corner success → `FalconMessageOrchestratorService.show({ category:'success', title, message, source })`.
- Multi-dialog creation flow (picker → submit → ack) → use `<falcon-angular-wizard-finalization>` (which composes THIS dialog) rather than wiring it by hand.

## Tailwind-only usage

The panel sizing/spacing is baked into the template via Tailwind utilities (`max-w-[560px] px-14 pt-12 pb-14 text-center` etc., `[CODE]` html:27). There is no `wrapperClass`/`class` override hook — to change layout you must edit the component (it is a single-purpose branded dialog). For host-side positioning you don't need any utilities (it is Top-Layer, viewport-centered).

## Token / per-instance override

`[CODE]` There is **no token contract** and no per-instance override hook. The panel reads Falcon palette tokens via utilities (`bg-falcon-neutral-0`, `text-falcon-neutral-900/700/600`) but the radius/shadow/backdrop/animation are arbitrary literals in the inline `styles:` + template (see TOKENS.md / GAP G-TOKENS). You cannot retheme a single instance without code changes.

## Bad usage to avoid

- **Do NOT** use it as a confirm/decision dialog — it is button-less and auto-dismisses.
- **Do NOT** put text the user must read carefully — clicking the panel dismisses it (`onPanelClick`).
- **Do NOT** route it through the orchestrator's `action-required` modal — that was tried and reverted (wrong visual).
- **Do NOT** pass untranslated keys — `[title]`/`[subtitle]` render verbatim.
- **Do NOT** rely on it for error states — wrong intent + wrong art; use a toast or `<falcon-angular-popup variant="error">`.
- **Do NOT** mount it standalone for a full creation flow — prefer `<falcon-angular-wizard-finalization>`.
- **Do NOT** add `*ngIf`/`*ngFor` around it — it already uses `@if (open())` internally; the surrounding template must use `@if`/`@for` per project rule.

## Do / Don't

| Do | Don't |
|---|---|
| Use for a large branded creation-success ack | Use for any decision (no buttons) |
| Pass pre-translated `[title]`/`[subtitle]` | Pass i18n keys raw |
| Keep it inline (not orchestrator-routed) | Collapse it into the orchestrator modal |
| Let it auto-dismiss (or `autoDismissMs=0`) | Put copy-me text in it (click dismisses) |
| Compose via `<falcon-angular-wizard-finalization>` for flows | Hand-wire picker+submit+ack yourself |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `falcon-angular-completion-success-dialog` / `FalconAngularCompletionSuccessDialogComponent` across `apps/` + `libs/`:

- **Live composer (1 lib file pair):** `libs/falcon-ui-core/.../falcon-wizard-finalization/falcon-wizard-finalization.component.{ts,html}`.
- **Flow drivers (3 app signals files):** `apps/admin-console/.../add-client-wizard/signals/add-client-wizard.signals.ts`; `apps/{admin,management}-console/.../org-hierarchy-page/services/state/add-user-state.signals.ts`.
- **Test (1):** `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts`.
- **Config ref (non-render):** `eslint.config.mjs`.
- **Direct app-template mounts: 0** — the dialog is reached transitively through `<falcon-angular-wizard-finalization>`.

> `[INFERRED]` The component has **no direct template consumer** — it is a library-internal composition target of `falcon-wizard-finalization`, which the Add Client / Add User wizards use.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18). The wizard-finalization composition + the "reverted from orchestrator" decision + the no-direct-consumer fact all confirmed against live source. Consumer sweep run via Grep.
