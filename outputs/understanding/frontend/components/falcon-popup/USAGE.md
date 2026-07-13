# falcon-popup — USAGE

## Real usage examples (active codebase)

### 1. Via the app-shell hosts (the dominant real pattern)
Most popup usage flows through TWO singleton host components, NOT inline tags:

- `[CODE]` `falcon-http-error-dialog-host.component.ts:33-46` — binds `FalconHttpErrorDialogService` signals to a `<falcon-angular-popup [hideCancel]="true" variant="error">`. Any code calls `FalconHttpErrorDialogService.show({ title, body, hint, okLabel })`; the host opens an OK-only error popup. Both `(confirm)`/`(cancel)` call `dialog.close()`.
- `[CODE]` `falcon-unsaved-changes-host.component.ts:30-39` — renders `<falcon-angular-popup [open]="true" variant="unsaved">` when `FalconUnsavedChangesService.active()` is set; `(confirm)`→`accept()` (discard & leave), `(cancel)`→`reject()` (stay). Feature code calls `this.unsaved.confirm({ bodyOverride }).subscribe(leave => …)`.

```html
<!-- falcon-http-error-dialog-host (mount ONCE in the app shell) -->
<falcon-angular-popup
  [open]="dialog.open()" [variant]="variant()" [hideCancel]="true"
  [titleOverride]="dialog.title()" [bodyOverride]="dialog.body()" [hintOverride]="dialog.hint()"
  [confirmLabelOverride]="resolvedOkLabel()"
  [glossy]="glossy()" [iconBg]="iconBg()" [iconColor]="iconColor()"
  (confirm)="onAcknowledge()" (cancel)="onAcknowledge()" />
```

### 2. Delete confirmation (direct tag)

```html
<falcon-angular-popup
  [open]="confirmDelete()"
  variant="delete"
  [name]="record.name"
  (confirm)="onConfirmDelete()"
  (cancel)="confirmDelete.set(false)" />
```
Notes: `variant="delete"` → trash icon + "Delete this record?" + red Delete button; `[name]` interpolates into the body; `(cancel)` fires on Cancel / × / backdrop / Esc.

### 3. Unsaved-changes warning
```html
<falcon-angular-popup [open]="hasUnsavedChanges()" variant="unsaved"
  (confirm)="onDiscardAndLeave()" (cancel)="onStayOnPage()" />
```
> "Discard & leave" is a **red** destructive button despite being the "confirm" action — `confirmTone: 'danger'` for `unsaved`. This is intentional; do NOT "fix" it to primary.

### 4. Save / publish confirmation
```html
<falcon-angular-popup [open]="confirmSave()" variant="save"
  [hintOverride]="changedFieldsHint()"
  (confirm)="onPublish()" (cancel)="confirmSave.set(false)" />
```
> `[hintOverride]` overrides the placeholder default hint ("3 fields changed · 1 permission updated").

### 5. Error fallback (direct, OK-only)
```html
<falcon-angular-popup [open]="errorOpen()" variant="error" [hideConfirm]="false" [hideCancel]="true"
  [titleOverride]="customErrorTitle()" [bodyOverride]="customErrorBody()"
  (confirm)="onRetry()" (cancel)="errorOpen.set(false)" />
```

## Recommended usage for new Angular pages
```ts
protected confirmDelete = signal(false);
protected onConfirmDelete() {
  this.api.delete(this.id).subscribe(() => this.confirmDelete.set(false)); // close AFTER async
}
```
```html
<falcon-angular-popup [open]="confirmDelete()" variant="delete" [name]="record.name"
  (confirm)="onConfirmDelete()" (cancel)="confirmDelete.set(false)" />
```

> For global error surfacing, prefer `FalconHttpErrorDialogService.show(...)` (don't mount your own error popup). For unsaved-changes guards, prefer `FalconUnsavedChangesService.confirm(...)`.

## Reactive forms inside popup
Not supported — popup is a passive confirmation modal, no form fields, no slots.

## ngModel example
N/A.

## Tailwind-only usage
The component IS Tailwind — its inline template uses utility classes throughout. Consumers bind props, they don't add Tailwind around the popup.

## Token override
`[CODE]` The popup has **no dedicated token file** — its inline template uses Falcon palette tokens directly (`bg-falcon-neutral-0`, `text-falcon-red-700`, etc.). To restyle you'd mutate the palette globally — not per-instance overridable. The `glossy`/`iconBg`/`iconColor` toggles are the only per-instance knobs. **Gap:** a `popup.tokens.css` (GAP G-TOKENS).

## Bad usage to avoid
- Don't pass empty-string overrides expecting "show me empty" — `''` is treated as "no override" (`pick()`, ts:343). Pass `' '` (single space) for genuinely empty.
- Don't use this for non-decision dialogs ("here's some info, dismiss") — popup forces buttons (use `[hideCancel]`/`[hideConfirm]` for single-CTA, or a notification for passive info).
- Don't use this for a decision OUTSIDE the 4 variants — use `falcon-angular-confirm-dialog` (variants are a closed set).
- Don't toggle `[open]=false` in the `(confirm)` handler BEFORE async work finishes — the popup vanishes and the user can't retry on failure.
- Don't bind `(falconClick)` on the footer buttons — `[CODE]` ts:199/207 the Stencil event is `(falcon-click)` (dash-separated); `(falconClick)` no-ops.
- Don't render two popups simultaneously — each `showModal()` lands above the last in the Top Layer, but two passive confirms competing is confusing UX.
- Don't expect rich body content — there are no slots.

## Import requirements (standalone component)
```ts
import { FalconAngularPopupComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularPopupComponent],
  // CUSTOM_ELEMENTS_SCHEMA NOT needed on the host — popup declares it internally for <falcon-button-tw>.
})
```
`[CODE]` ts:296-298 — the component's `ngOnInit()` calls `defineFalconTwComponent('falcon-button')` so the footer `<falcon-button-tw>` upgrades even if no `falcon-angular-button` has mounted yet.

## Do / Don't

| Do | Don't |
|---|---|
| Use `variant="delete"` for destructive actions | Use `variant="error"` for delete confirms |
| Bind `[name]` for the delete variant | Inject the name into `bodyOverride` manually |
| Use `[hideCancel]`/`[hideConfirm]` for single-CTA | Render a passive info popup with both buttons |
| Prefer `FalconHttpErrorDialogService` for errors | Mount your own error popup inline |
| Close `[open]` AFTER async completes | Close before async (user can't retry on failure) |
| Bind `(confirm)` / `(cancel)` (component outputs) | Bind `(falconClick)` on the footer buttons |

## Consumer Sweep (2026-06-03)

[CODE] grep `falcon-angular-popup` across `apps/` → **5 files / 9 occurrences**; **0 direct in `libs/falcon`** (composed by 2 host components inside `falcon-ui-core`). Full app list:

- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/templates-wizard.component.ts` (1 each).
- `apps/admin-console/.../new-wallet-balance/components/wb-confirm-save-modal/wb-confirm-save-modal.component.ts` (3) + `new-wallet-balance/__tests__/confirm-save-modal.spec.ts` (3, test).
- `apps/host-shell/.../falcon-ui-showcase/library-section/library-section.component.ts` (1, showcase).

**Effective reach is wider:** the `FalconAngularHttpErrorDialogHostComponent` + `FalconUnsavedChangesHostComponent` (both in `falcon-ui-core`) compose the popup for the global HTTP-error + unsaved-changes flows, so every page that triggers an interceptor error or a dirty-form guard uses it indirectly.

> `[INFERRED]` The prior dossier's 8 hits (org-hierarchy add-user/add-client/page-menu/applications-table, otp-dialog, `shared-ui/index.ts`) are stale: the wizards now route discard through the unsaved-changes host / templates-wizard; otp-dialog's popup ref no longer matches the grep. The direct count fell, but indirect (host-driven) usage rose.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14). Host-composition examples confirmed against falcon-http-error-dialog-host.component.ts:33-46 + falcon-unsaved-changes-host.component.ts:30-39. `(falcon-click)` dash-event confirmed (ts:199/207). Consumer Sweep re-run (`falcon-angular-popup` → 5 app files / 9 + 2 lib hosts).
