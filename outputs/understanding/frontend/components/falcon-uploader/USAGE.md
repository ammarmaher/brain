# falcon-angular-uploader — USAGE

## Real usage in active codebase
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase (all 3 modes).
- _No production consumer in admin-console or management-console wizards yet._ Existing wizards use the legacy `<falcon-photo-uploader>` for avatar fields.

## Recommended NEW usage

### Dropzone with multiple files + per-file progress
```ts
// component.ts
import {
  FalconAngularUploaderComponent,
  type FalconUploaderFile,
} from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularUploaderComponent],
  templateUrl: './attachments.component.html',
})
export class AttachmentsComponent {
  readonly files = signal<FalconUploaderFile[]>([]);

  onValueChange(next: ReadonlyArray<FalconUploaderFile>): void {
    this.files.set([...next]);
    // For each NEW file in queued state, start the upload:
    next.filter(f => f.status === 'queued').forEach(f => this.startUpload(f));
  }

  private async startUpload(file: FalconUploaderFile): Promise<void> {
    this.updateFile(file.id, { status: 'uploading', progress: 0 });
    try {
      const url = await this.api.upload(file, p => this.updateFile(file.id, { progress: p }));
      this.updateFile(file.id, { status: 'success', progress: 100, url });
    } catch (err) {
      this.updateFile(file.id, {
        status: 'error',
        errorMessage: (err as Error).message ?? 'Upload failed',
      });
    }
  }

  private updateFile(id: string, patch: Partial<FalconUploaderFile>): void {
    this.files.update(list => list.map(f => f.id === id ? { ...f, ...patch } : f));
  }
}
```
```html
<!-- component.html -->
<falcon-angular-uploader
  label="hierarchy.addClient.attachments.label"
  placeholder="Drop files here or click to browse"
  placeholderHint="Max 10 MB per file. PDF, PNG, JPG."
  [accept]="'application/pdf,image/png,image/jpeg'"
  [maxSize]="10 * 1024 * 1024"
  [multiple]="true"
  mode="dropzone"
  [value]="files()"
  (valueChange)="onValueChange($event)"
  (fileRemove)="onFileRemove($event)" />
```

### Button mode with custom hint
```html
<falcon-angular-uploader
  mode="button"
  buttonLabel="Choose attachments"
  [accept]="'image/*'"
  [(ngModel)]="files"
  (fileAdd)="onAdd($event)">
  <small slot="hint" class="text-falcon-neutral-500 text-xs">JPG / PNG only.</small>
</falcon-angular-uploader>
```

### Inline-list mode (pre-populated, read-only)
```html
<falcon-angular-uploader
  mode="inline-list"
  [value]="existingAttachments()"
  [readonly]="true" />
```

### Reactive Forms binding
```ts
this.form = this.fb.group({
  attachments: this.fb.control<FalconUploaderFile[]>([]),
});
```
```html
<falcon-angular-uploader formControlName="attachments" mode="dropzone" />
```

### Per-instance token override
```html
<falcon-angular-uploader class="compact-uploader" />
```
```css
:where(.compact-uploader) {
  --falcon-uploader-dropzone-padding-y: 12px;
  --falcon-uploader-dropzone-padding-x: 14px;
  --falcon-uploader-dropzone-border-radius: 8px;
}
```

## Render-mode guidance
- **Default (`useTailwind=true`)** — Light DOM.
- `useTailwind=false` — Shadow when embedded outside Falcon Tailwind reach.

## Tailwind-only usage
- Outer `<falcon-angular-uploader class="…">` for outer container shape.
- File rows, dropzone visuals, progress bars MUST be styled via tokens — not extra Tailwind utilities.

## Admin-console / management-console example (future-state)
When wizards add attachment support, the call site looks like:
```html
<!-- inside client-information-step or a new attachments-step -->
<falcon-angular-uploader
  [label]="'hierarchy.addClient.attachments.label' | translate"
  [placeholder]="'hierarchy.addClient.attachments.dropzone' | translate"
  [(ngModel)]="value().attachments"
  (valueChange)="updateField('attachments', $event)"
  mode="dropzone"
  [maxFiles]="5"
  [maxSize]="10 * 1024 * 1024" />
```

## Bad usage to avoid
- DO NOT mutate the `files` array reference in place — pass a fresh array via the change handler. The CVA writeValue replaces the signal cleanly.
- DO NOT call `URL.revokeObjectURL` on `previewUrl` yourself — the component handles it on remove.
- DO NOT use this for single-file flows — use `<falcon-angular-single-uploader>`.
- DO NOT rely on the component to validate file MIME / size beyond what the native `<input>` does — implement consumer-side validation and set `file.status='error' + errorMessage`.

## Do / Don't
- DO drive `file.status` + `file.progress` + `file.errorMessage` from the consumer's upload pipeline.
- DO provide `placeholderHint` for size / type constraints — improves UX.
- DO listen to `valueChange` to start uploads on new queued files.
- DON'T set `progress` to a value > 100 or < 0 — `clampProgress()` will clip but causes flicker.
- DON'T use `mode="inline-list"` for new uploads — it shows the list but has no trigger.
