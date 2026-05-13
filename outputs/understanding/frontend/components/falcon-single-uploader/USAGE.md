# falcon-angular-single-uploader — USAGE

## Real usage in active codebase
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase (all 3 preview modes + sizes).
- _No production consumer in admin-console or management-console yet._

## Recommended NEW usage

### Single logo upload with thumbnail preview
```ts
// component.ts
import {
  FalconAngularSingleUploaderComponent,
  type FalconSingleUploaderFile,
} from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularSingleUploaderComponent],
  templateUrl: './company-logo-step.component.html',
})
export class CompanyLogoStepComponent {
  readonly logo = signal<FalconSingleUploaderFile | null>(null);

  async onUpload(detail: { file: FalconSingleUploaderFile }): Promise<void> {
    // Start the upload — patch progress over time.
    this.logo.set({ ...detail.file, status: 'uploading', progress: 0 });
    try {
      const url = await this.api.uploadCompanyLogo(detail.file, p => {
        this.logo.update(f => f ? { ...f, progress: p } : null);
      });
      this.logo.update(f => f ? { ...f, status: 'success', progress: 100, url } : null);
    } catch (err) {
      this.logo.update(f => f ? { ...f, status: 'error', errorMessage: (err as Error).message } : null);
    }
  }

  onDelete(): void {
    this.api.deleteCompanyLogo();
    this.logo.set(null);
  }
}
```
```html
<!-- component.html -->
<falcon-angular-single-uploader
  label="hierarchy.addClient.fields.logo.label"
  placeholder="Drop logo or click to browse"
  placeholderHint="PNG, JPG up to 2 MB"
  [accept]="'image/png,image/jpeg'"
  [maxSize]="2 * 1024 * 1024"
  size="lg"
  previewMode="thumbnail"
  [value]="logo()"
  (fileUpload)="onUpload($event)"
  (fileDelete)="onDelete()" />
```

### Icon-only mode (for non-image documents)
```html
<falcon-angular-single-uploader
  label="hierarchy.addClient.fields.contract.label"
  size="md"
  previewMode="icon-only"
  [accept]="'application/pdf'"
  [(ngModel)]="contract" />
```

### Compact mode (icon + filename + size to the right)
```html
<falcon-angular-single-uploader
  size="sm"
  previewMode="compact"
  [(ngModel)]="signature" />
```

### Per-instance token override
```html
<falcon-angular-single-uploader class="logo-uploader" />
```
```css
:where(.logo-uploader) {
  --falcon-single-uploader-tile-size-lg: 160px;
  --falcon-single-uploader-tile-radius: 16px;
}
```

## Render-mode guidance
- **Default (`useTailwind=true`)** — Light DOM.
- `useTailwind=false` — Shadow when embedded outside Falcon Tailwind scanner.

## Tailwind-only usage
- Outer class for layout (margin / max-width).
- Internal tile / icon / action visuals — tokens only.

## Bad usage to avoid
- DO NOT use for multi-file uploads — use `<falcon-angular-uploader>`.
- DO NOT manually create / revoke `URL.createObjectURL(blob)` — the component handles it.
- DO NOT rely on `file.errorMessage` to fail validation upstream — set it AFTER upload starts failing.
- DO NOT use `previewMode="icon-only"` for image-first uploads — defeats the visual cue.

## Do / Don't
- DO use `previewMode="thumbnail"` for images, `"icon-only"` for non-image documents, `"compact"` for narrow form columns.
- DO leverage Reactive Forms via `formControlName`.
- DO listen to `fileEdit` to track "user wants to replace" analytics — the picker reopens automatically afterwards.
- DON'T paint your own delete button — there's a built-in one with the right tokens.
