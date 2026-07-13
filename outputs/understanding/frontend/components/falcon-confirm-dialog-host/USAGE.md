# falcon-confirm-dialog-host — USAGE

## Real usage examples (active codebase)

### Example 1 — Delete confirm via `FalconConfirmService` (canonical)

`[CODE]` `apps/management-console/src/app/features/contact-groups/contact-groups-list/contact-groups-list.component.ts:381-396`:

```ts
private readonly confirmer = inject(FalconConfirmService); // :108

protected deleteRow(row: ContactGroupTableRowVm): void {
  // Wave 15 — FalconConfirmService replaces native window.confirm (FLAG B-9)
  this.confirmer
    .confirm({
      title: this.i18n.translate('contactGroups.deleteConfirmTitle') || 'Delete contact group',
      body:  this.i18n.translate('contactGroups.deleteConfirmBody')  || 'Are you sure you want to delete this contact group?',
      severity: 'danger',
      confirmLabel: this.i18n.translate('common.delete') || 'Delete',
      cancelLabel:  this.i18n.translate('common.cancel') || 'Cancel',
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((accepted) => {
      if (!accepted) return;        // false = cancel / × / ESC / backdrop / superseded
      this.api.delete(row.id)...    // run the action only on confirm
    });
}
```

> `[CODE]` Note the **`takeUntilDestroyed`** teardown — if the component is destroyed before the user picks, the Observable's teardown resolves `false` + dismisses the orchestrator modal by `correlationId` (`[CODE]` falcon-confirm.service.ts:109-114). Always pipe `takeUntilDestroyed`.
> `[CODE]` `severity: 'danger'` + `cancelLabel` are accepted but **inert in Phase 5** (the orchestrator renders `variant="error"` and the popup uses its own labels) — see `API.md`. They are harmless compatibility fields.

### Example 2 — Acknowledgement-only popup (`hideCancel`)

`[CODE]` `apps/host-shell/.../do-payment-priority-popup/do-payment-priority-popup.component.ts:178, 602` injects `FalconConfirmService` and calls `.confirm({ ..., hideCancel: true })` for a single-CTA failure acknowledgement. `hideCancel` IS honored — the modal-adapter renders one button; ×/ESC/backdrop still resolve `false`.

### Example 3 — Add Client / Add User wizard discard

`[CODE]` `apps/admin-console/.../add-client-wizard.component.ts:361` + `add-user-wizard.component.ts:404` (and the mgmt mirrors) call `confirm({...}).subscribe(accepted => { if (accepted) this.close(); })` to gate abandoning a dirty wizard.

### The app-shell mount (do this exactly once)

`[CODE]` `apps/host-shell/src/app/app.ts:31, 53`:

```ts
import { FalconAngularConfirmDialogHostComponent } from '@falcon/ui-core/angular';

@Component({
  imports: [ /* … */ FalconAngularConfirmDialogHostComponent ],
  template: `
    <!-- Wave 13 — global confirm-popup host. Singleton via @falcon/ui-core MF share. -->
    <falcon-angular-confirm-dialog-host />
    <!-- … other shell hosts … -->
  `,
})
export class App {}
```

> One host in host-shell covers every Module-Federation remote because `@falcon/ui-core` is a singleton share — admin-console + management-console see the same `FalconConfirmService` instance (`[CODE]` app.ts:49-52).

## Sibling pattern — do NOT confuse with `FalconUnsavedChangesService`

`[CODE]` `apps/admin-console/.../hierarchy-page-state.service.ts:236-243` calls `this.unsaved.confirm({ titleOverride, bodyOverride, hintOverride, confirmLabelOverride, cancelLabelOverride })` — that is **`FalconUnsavedChangesService`** + `<falcon-unsaved-changes-host>`, a SEPARATE host/service pair for route-leave gating with a DIFFERENT request shape (`*Override` fields, plus a `hint`). It returns `Observable<boolean>` (`leave`) the same way. Pick the right service: imperative yes/no decision → `FalconConfirmService`; "you have unsaved changes, leave?" gate → `FalconUnsavedChangesService`.

## Recommended usage for NEW pages

```ts
import { FalconConfirmService } from '@falcon/ui-core/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

private readonly confirm = inject(FalconConfirmService);
private readonly destroyRef = inject(DestroyRef);

doDangerousThing(): void {
  this.confirm
    .confirm({ title: 'Proceed?', body: 'This cannot be undone.', confirmLabel: 'Proceed' })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(ok => { if (ok) this.proceed(); });
}
```

You do NOT mount anything — the host is already mounted in `host-shell/app.ts`. Just inject + subscribe.

## Reactive Forms / ngModel

**N/A** — service-driven, not a form control.

## Tailwind-only / token override

**N/A on the host** — it has no chrome. Style the rendered substrate (`<falcon-angular-popup>` tokens in Phase 5) if needed; the host element renders nothing.

## Bad usage to avoid

- **Do NOT** mount `<falcon-angular-confirm-dialog-host>` in a remote/feature — it is a singleton, mounted once in `host-shell/app.ts`.
- **Do NOT** subscribe to `confirm()` without `takeUntilDestroyed` — leaks + the modal won't auto-dismiss on component teardown.
- **Do NOT** rely on `severity` / `icon` / `cancelLabel` changing the Phase-5 popup — they are inert compatibility fields.
- **Do NOT** use `FalconConfirmService` for a route-leave "unsaved changes" gate — use `FalconUnsavedChangesService`.
- **Do NOT** call `confirm()` expecting a Promise — it returns a cold `Observable<boolean>` (subscribe to it).
- **Do NOT** read `service.active()` expecting the active request — it is always `null` in Phase 5.

## Do / Don't

| Do | Don't |
|---|---|
| Inject `FalconConfirmService` + subscribe to `.confirm()`. | Mount the host more than once. |
| Pipe `takeUntilDestroyed(destroyRef)`. | Subscribe raw (leaks; no auto-dismiss). |
| Treat `false` as the universal cancel (× / ESC / backdrop / superseded). | Distinguish dismissal reasons (you can't). |
| Use `hideCancel: true` for acknowledgement-only. | Expect `severity`/`icon` to retint the popup. |

## Consumer Sweep (2026-06-03)

[CODE] Host element mount: **1** (`apps/host-shell/src/app/app.ts:53`). `FalconConfirmService` injectors/callers (excluding the host + service + spec): **8 files** —
- admin-console: `org-hierarchy-page/services/hierarchy-page-state.service.ts` (:237, :506 — note :237 is actually `FalconUnsavedChangesService`; `FalconConfirmService` use is at :506), `add-user-wizard.component.ts` (:404), `add-client-wizard.component.ts` (:361)
- management-console: `org-hierarchy-page/services/hierarchy-page-state.service.ts` (:296), `add-user-wizard.component.ts` (:448), `contact-groups-list.component.ts` (:382), `contact-group-detail.component.ts` (:346)
- host-shell: `do-payment-priority-popup.component.ts` (:602)
- libs/falcon: `user-details-page.component.ts` (:378 — via `FalconUnsavedChangesService`, the sibling)

> Tests: `apps/host-shell/tests/falcon-message-orchestrator.spec.ts:499` covers the orchestrator path that `FalconConfirmService` routes through (`hideCancel: true` funds popups).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 — NEW). Example 1 (contact-groups delete) + Example 2 (do-payment `hideCancel`) + the `app.ts` mount cited line-accurate. The `FalconUnsavedChangesService` sibling distinction verified at `hierarchy-page-state.service.ts:236-243`. Consumer sweep grep-verified.
