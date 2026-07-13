# falcon-unsaved-changes-host — USAGE

## Real usage examples (active codebase)

### Example 1 — the central CanDeactivate / leave gate (org-hierarchy)

`[CODE]` `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts:205-260` — `confirmDiscardIfDirty()` is THE single gate every leave path (router `CanDeactivate` / tab switch / tree-node select / in-page menu) funnels through:

```ts
private readonly unsaved = inject(FalconUnsavedChangesService);

confirmDiscardIfDirty(): Observable<boolean> {
  // emit true immediately when nothing on the page is dirty
  if (!infoDirty && !settingsDirty && !addClientDirty && !addUserDirty && !drawerDirty) {
    return of(true);
  }
  // context-specific body so the operator knows WHICH surface is dirty
  const bodyKey = infoDirty ? 'hierarchy.unsavedChanges.infoBody'
    : settingsDirty ? 'hierarchy.unsavedChanges.settingsBody'
    : (addClientDirty || addUserDirty || drawerDirty) ? 'hierarchy.unsavedChanges.wizardBody'
    : 'hierarchy.unsavedChanges.infoBody';

  return this.unsaved
    .confirm({
      titleOverride: this.i18n.translate('hierarchy.unsavedChanges.title'),
      bodyOverride: this.i18n.translate(bodyKey),
      hintOverride: this.i18n.translate('hierarchy.unsavedChanges.hint'),   // ⚠ dropped in Phase 5 (G-HINT-DROP)
      confirmLabelOverride: this.i18n.translate('hierarchy.unsavedChanges.discard'),
      cancelLabelOverride: this.i18n.translate('hierarchy.unsavedChanges.stay'),
    })
    .pipe(tap((leave) => { if (leave) { /* reset the dirty surface BEFORE returning true */ } }));
}
```

> The gate **discards the dirty surface** (resets the form + returns it to view mode) on confirm, BEFORE emitting `true`. The popup BLOCKS the action. The mgmt mirror is identical.

### Example 2 — wizard exit guard (Add User)

`[CODE]` `apps/admin-console/.../add-user-wizard/add-user-wizard.component.ts:398-411`:

```ts
protected onExit(): void {
  if (!this.isAnyDirty()) { /* close immediately */ return; }
  this.unsaved
    .confirm({
      titleOverride: this.translateService.translate('hierarchy.unsavedChanges.title'),
      bodyOverride: this.translateService.translate('hierarchy.unsavedChanges.wizardBody'),
      hintOverride: this.translateService.translate('hierarchy.unsavedChanges.hint'),
      confirmLabelOverride: this.translateService.translate('hierarchy.unsavedChanges.discard'),
      cancelLabelOverride: this.translateService.translate('hierarchy.unsavedChanges.stay'),
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((leave) => { if (leave) { /* close wizard */ } });
}
```

### Example 3 — the no-op host mount (host-shell)

`[CODE]` `apps/host-shell/src/app/app.ts:57`:

```html
<!-- Global unsaved-changes gate — any component injects FalconUnsavedChangesService
     and calls .confirm({...}).subscribe(leave => ...). Singleton via @falcon/ui-core
     MF share; one host covers host-shell + every remote. -->
<falcon-unsaved-changes-host />
<!-- ↑ renders NOTHING in Phase 5 — service.active() is always null. The live modal
     renderer is <falcon-angular-modal-adapter> (FalconModalAdapterComponent),
     also mounted in this template, bound to orchestrator.activeModal(). -->
```

## Recommended usage for NEW Angular code

Inject the service; gate every leave path through `confirm()`:

```ts
private readonly unsaved = inject(FalconUnsavedChangesService);

canLeave(): Observable<boolean> {
  if (!this.form.dirty) return of(true);
  return this.unsaved.confirm({
    titleOverride: this.i18n.translate('common.unsaved.title'),
    bodyOverride: this.i18n.translate('common.unsaved.body'),
    confirmLabelOverride: this.i18n.translate('common.unsaved.discard'),
    cancelLabelOverride: this.i18n.translate('common.unsaved.stay'),
    // ⚠ hintOverride is dropped in Phase 5 — fold any hint into bodyOverride
  });
}
```

Wire it into a functional `CanDeactivateFn` guard:

```ts
export const leaveGuard: CanDeactivateFn<MyComp> = (cmp) => cmp.canLeave();
```

> Fold any "hint" text into `bodyOverride` — `hintOverride` is silently dropped (G-HINT-DROP).

## Tailwind-only usage

N/A — the host renders no visible content; the live modal is the orchestrator's `<falcon-angular-popup>` (styled via the popup's tokens/utilities).

## Token / per-instance override

N/A — no token contract on this unit. To restyle the leave-confirmation modal, see `falcon-popup/TOKENS.md` (the orchestrator's modal-adapter renders a popup).

## Bad usage to avoid

- **Do NOT** mount a second `<falcon-unsaved-changes-host>` — it renders nothing either way; the singleton service is the contract.
- **Do NOT** pass `hintOverride` expecting a hint line — dropped in Phase 5. Fold it into `bodyOverride`.
- **Do NOT** rely on `cancelLabelOverride` rendering — it is not mapped to the orchestrator action-required modal.
- **Do NOT** subscribe to `confirm()` more than once per leave decision — it emits once then completes.
- **Do NOT** fire two overlapping `confirm()` calls — the first resolves `false`.
- **Do NOT** pass untranslated keys — overrides render verbatim.
- **Do NOT** use it for non-leave confirmations (delete/publish) — use `FalconConfirmService` / `<falcon-angular-popup>`.

## Do / Don't

| Do | Don't |
|---|---|
| Gate every leave path through `confirm()` | Re-implement a per-page unsaved popup |
| Return `of(true)` when not dirty (skip the prompt) | Always open `confirm()` unconditionally |
| Pass pre-translated overrides | Pass i18n keys raw |
| Fold hint text into `bodyOverride` | Rely on `hintOverride` (dropped) |
| Treat `confirm()` as one-shot | Subscribe twice / overlap calls |
| Wire it into a `CanDeactivateFn` | Hand-roll `window.confirm()` |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `FalconUnsavedChangesService` / `falcon-unsaved-changes-host` across `apps/` + `libs/`:

- **Service `confirm()` callers (8 app files):**
  - `apps/{admin,management}-console/.../org-hierarchy-page/services/hierarchy-page-state.service.ts` — central `confirmDiscardIfDirty()` gate + Add Client tree-select discard.
  - `apps/{admin,management}-console/.../add-user-wizard/add-user-wizard.component.ts` (+ `.html` ref) — `onExit()`.
  - `apps/admin-console/.../add-client-wizard/add-client-wizard.component.ts` (+ `.html` ref) — wizard discard.
  - `apps/{admin,management}-console/.../falcon-org-info-panel/signals/info-panel-state.signals.ts` — info-panel edit discard.
  - `apps/{admin,management}-console/.../org-hierarchy-page-menu.component.html` — menu-driven leave.
- **Host mount (1):** `apps/host-shell/src/app/app.ts` (no-op).
- **Library (the unit + its composed popup):** `libs/falcon-ui-core/.../falcon-unsaved-changes-host/{service,host}` + `libs/falcon-ui-core/.../falcon-popup/falcon-popup.component.ts` (the variant it would render).

> `[INFERRED]` Service usage is **broad** (org-hierarchy page + both wizards + info-panel + menus, mirrored across admin + mgmt). The HOST mount is a single no-op.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18). `confirmDiscardIfDirty()` central gate + `onExit()` wizard guard + the no-op host mount all confirmed against live source. The dropped `hintOverride` re-confirmed against the orchestrator types. Consumer sweep run via Grep.
