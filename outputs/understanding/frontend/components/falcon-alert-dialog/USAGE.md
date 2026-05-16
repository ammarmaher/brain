*** falcon-alert-dialog — USAGE ***

# Angular import

```ts
import { FalconAngularAlertDialogComponent } from '@falcon/ui-core/angular/falcon-alert-dialog';

@Component({
  // ...
  imports: [FalconAngularAlertDialogComponent],
})
export class MyPageComponent { /* ... */ }
```

# Template — warning + 2-button (default)

```html
<falcon-angular-alert-dialog
  [open]="showWarn"
  severity="warning"
  [title]="'Insufficient Balance Detected' | translate"
  [subtitle]="'Please prioritize…' | translate"
  [confirmLabel]="'Proceed Payment' | translate"
  [cancelLabel]="'Cancel' | translate"
  (falconCancel)="onWarnCancel()"
  (falconConfirm)="onProceed()">

  <!-- Body slot — any custom content -->
  <div class="border border-falcon-neutral-200 rounded-[12px] p-[14px]">
    <div class="text-[12px] text-falcon-neutral-500 mb-2">
      {{ 'hierarchy.applications.ibModal.dragLabel' | translate }}
    </div>
    <ul class="flex flex-col gap-2">
      @for (ch of channels; track ch.id; let i = $index) {
        <li>{{ i + 1 }}. {{ ch.name }}</li>
      }
    </ul>
  </div>
</falcon-angular-alert-dialog>
```

# Template — info-only / acknowledgement

```html
<falcon-angular-alert-dialog
  [open]="showInfo"
  severity="info"
  [title]="'Update successful' | translate"
  [subtitle]="'Changes were saved.' | translate"
  [hideCancel]="true"
  [confirmLabel]="'OK' | translate"
  (falconConfirm)="dismiss()">
</falcon-angular-alert-dialog>
```

# Template — destructive confirmation

```html
<falcon-angular-alert-dialog
  [open]="showDelete"
  severity="danger"
  [title]="'Delete this account?' | translate"
  [subtitle]="'This action cannot be undone.' | translate"
  [confirmLabel]="'Delete' | translate"
  [cancelLabel]="'Cancel' | translate"
  [closeOnBackdrop]="false"
  (falconConfirm)="confirmDelete()"
  (falconCancel)="cancelDelete()">
</falcon-angular-alert-dialog>
```

# Two-way binding

```html
<falcon-angular-alert-dialog
  [(open)]="state.showWarn"
  severity="warning"
  title="…"
  (falconConfirm)="onProceed()">
</falcon-angular-alert-dialog>
```

# Token override per-instance

```html
<falcon-angular-alert-dialog
  severity="warning"
  style="--falcon-alert-dialog-icon-color: #FF6B35; --falcon-alert-dialog-confirm-bg: #FF6B35;"
  title="…">
</falcon-angular-alert-dialog>
```

# When to use this vs `<falcon-angular-dialog>` vs `<falcon-angular-confirm-dialog>`

- **`<falcon-angular-alert-dialog>`** — centered icon + title + subtitle + custom body
  + 2-button footer. Use for warnings, info-only, success acknowledgements with
  custom body content.
- **`<falcon-angular-confirm-dialog>`** — small left-aligned icon + message + 2-button
  footer. Use for simple yes/no prompts without custom body.
- **`<falcon-angular-dialog>`** — fully custom dialog. Drop down to this when you
  need to override header/footer layout.
