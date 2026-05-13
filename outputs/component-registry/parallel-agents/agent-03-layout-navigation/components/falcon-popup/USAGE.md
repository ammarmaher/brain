# falcon-popup — USAGE

## Real usage examples

### 1. Delete confirmation (cited)

`apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html` (grep hit; pattern):

```html
<falcon-angular-popup
  [open]="confirmDelete()"
  variant="delete"
  [name]="userName()"
  (confirm)="onConfirmDelete()"
  (cancel)="confirmDelete.set(false)" />
```

Notes:
- `variant="delete"` provides the trash icon + "Delete this record?" title + red Delete button.
- `[name]` is interpolated into the body string: `"You're about to permanently delete \"<name>\""`.
- `(confirm)` fires on Delete button click.
- `(cancel)` fires on Cancel / × / backdrop / Esc.

### 2. Unsaved changes warning

```html
<falcon-angular-popup
  [open]="hasUnsavedChanges()"
  variant="unsaved"
  (confirm)="onDiscardAndLeave()"
  (cancel)="onStayOnPage()" />
```

Notes:
- `variant="unsaved"` provides the info-circle icon + warning intent + amber chip.
- "Discard & leave" is a red destructive button despite being the "confirm" action — `confirmTone: 'danger'` for the unsaved variant.

### 3. Save / publish confirmation

```html
<falcon-angular-popup
  [open]="confirmSave()"
  variant="save"
  [hintOverride]="changedFieldsHint()"
  (confirm)="onPublish()"
  (cancel)="confirmSave.set(false)" />
```

Notes:
- `variant="save"` uses success intent + green chip + git-pull-create icon.
- `[hintOverride]` lets the consumer compute "3 fields changed · 1 permission updated" dynamically.

### 4. Error fallback

```html
<falcon-angular-popup
  [open]="errorOpen()"
  variant="error"
  [titleOverride]="customErrorTitle()"
  [bodyOverride]="customErrorBody()"
  (confirm)="onRetry()"
  (cancel)="errorOpen.set(false)" />
```

Notes:
- `variant="error"` uses danger intent + red chip.
- Confirm button label defaults to "Try again" (override via `confirmLabelOverride`).
- Useful for surfacing API errors.

## Recommended usage for new Angular pages

```ts
// In component
protected confirmDelete = signal(false);

protected onClickDelete() {
  this.confirmDelete.set(true);
}

protected onConfirmDelete() {
  this.api.delete(this.id).subscribe(() => {
    this.confirmDelete.set(false);
  });
}
```

```html
<button (click)="onClickDelete()">Delete</button>

<falcon-angular-popup
  [open]="confirmDelete()"
  variant="delete"
  [name]="record.name"
  (confirm)="onConfirmDelete()"
  (cancel)="confirmDelete.set(false)" />
```

## Reactive forms inside popup
Not supported — popup is a passive confirmation modal, no form fields.

## ngModel example
N/A.

## Tailwind-only usage
The component IS Tailwind — its inline template uses utility classes throughout. Consumers don't add Tailwind around the popup; they bind props.

## Token override
The popup template uses Falcon palette tokens (`bg-falcon-neutral-0`, `text-falcon-red-700`, etc.) but does NOT have a dedicated token file. To restyle, you'd need to mutate the palette tokens globally — not per-instance overridable.

**Gap:** consider a `popup.tokens.css` for per-variant per-instance overrides.

## Bad usage to avoid
- Don't pass empty-string overrides expecting "show me empty" — empty string is treated as "no override". Pass `' '` (single space) if you genuinely want to render empty.
- Don't use this for non-decision-required dialogs (e.g. "Here's some info, dismiss to continue") — popup forces 2 buttons.
- Don't use this for a save-then-route flow where the form might be invalid — the popup assumes the form is valid before opening.
- Don't render multiple popups simultaneously — no focus stack; the second one steals.
- Don't rely on this for keyboard focus trap — there isn't one. (P0 gap.)

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularPopupComponent],
  // schemas not needed — popup is pure Angular (no Stencil tag exposed to consumer)
})
```

The component's `ngOnInit()` calls `defineFalconTwComponent('falcon-button')` to register the underlying `<falcon-button-tw>` footer buttons. This is automatic.

## Do / Don't

| Do | Don't |
|---|---|
| Use `variant="delete"` for destructive actions | Use `variant="error"` for delete confirms |
| Bind `[name]` for delete variant | Inject the name into `bodyOverride` manually (loses the formatting) |
| Use signals for `[open]` | Use a `setTimeout` to toggle visibility |
| Treat empty-string overrides as "no override" | Pass `''` to render empty (will fall back to variant default) |
| Handle async work in `(confirm)` and toggle `[open]` after | Toggle `[open]=false` in the confirm handler BEFORE async work completes (user sees the popup vanish then unable to retry on failure) |
| Use this for any of the 4 canonical decisions | Use this for "show info" or "select option" UX |
