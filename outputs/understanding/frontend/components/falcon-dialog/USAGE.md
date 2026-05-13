# falcon-dialog — USAGE

## Real usage examples
Direct usage of `<falcon-angular-dialog>` in `apps/` is limited to the playground showcase. Production usage is via composition:
- `<falcon-angular-confirm-dialog>` composes this internally for accept/reject layouts.
- `send-credentials-popup` legacy Angular component composes this for credential delivery (per registry note).

## Recommended usage for new pages (rare)

```html
<!-- Only use this directly when popup variants don't fit AND confirm-dialog is too restrictive -->
<falcon-angular-dialog
  [(open)]="modalOpen"
  [title]="'Generate Report'"
  [description]="'Choose report parameters'"
  size="md"
  position="center"
  severity="info">

  <div class="grid gap-4 py-2">
    <falcon-angular-dropdown [options]="reportTypeOptions" formControlName="type" label="Report type" />
    <falcon-angular-date-picker formControlName="from" label="From" />
    <falcon-angular-date-picker formControlName="to"   label="To" />
  </div>

  <div slot="footer" class="flex justify-end gap-2 pt-4">
    <falcon-angular-button variant="ghost" [label]="'Cancel' | translate" (falconClick)="onCancel()" />
    <falcon-angular-button [label]="'Generate' | translate" [loading]="generating()" (falconClick)="onGenerate()" />
  </div>
</falcon-angular-dialog>
```

## Reactive forms inside dialog
Same pattern as drawer — the dialog is just a container, the form lives inside.

## ngModel example
N/A.

## Tailwind-only usage
Apply layout utilities INSIDE the body slot. Don't override panel geometry via host classes.

## Token override
```css
.report-dialog {
  --falcon-dialog-panel-max-width-md: 720px;
  --falcon-dialog-panel-padding-block: 32px;
  --falcon-dialog-panel-padding-inline: 40px;
}
```

## Bad usage to avoid
- **Don't use this for "Are you sure?" prompts** — use `<falcon-angular-confirm-dialog>`.
- **Don't use this for the 4 canonical actions** — use `<falcon-angular-popup>`.
- Don't wire `(falconConfirm)` / `(falconCancel)` without explicitly emitting them — they don't fire from any built-in button.
- Don't render multiple dialogs simultaneously — focus trap conflicts.
- Don't use `position="side-right"` — that's drawer's concept; use `<falcon-angular-drawer position="right">` instead.

## Import requirements
```ts
@Component({
  standalone: true,
  imports: [FalconAngularDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `<falcon-angular-popup>` for canonical decision flows | Use `<falcon-angular-dialog>` directly for new code |
| Compose this via `<falcon-angular-confirm-dialog>` for accept/reject | Wire `falconConfirm`/`falconCancel` without explicit emit |
| Use this only for custom-shape modals popup doesn't cover | Stack multiple dialogs at once |
| Use tokens for visual overrides | Inline Tailwind on panel host |
