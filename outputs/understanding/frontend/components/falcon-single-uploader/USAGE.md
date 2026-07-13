# falcon-single-uploader — USAGE

## Real usage examples (active codebase)

> `[CODE]` There is **NO production feature consumer** of `<falcon-angular-single-uploader>` in admin-console or management-console (grep 2026-06-03). The only live render sites are the Falcon UI showcase + its registry. (Correction vs prior dossier: the old `apps/host-shell/src/app/playground/playground.page.html` consumer is **gone** — the playground route was removed; the live showcase is `features/falcon-ui-showcase/`.) The examples below are the recommended pattern + the showcase reference.

### Example 1 — showcase / registry (the only live render path)

`[CODE]` `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` + `.../showcase-data/registry.ts` render `<falcon-angular-single-uploader>` as a gallery tile. The arbitrary-value `-tw` utilities are kept alive by the `@source` safelist in `apps/host-shell/src/tailwind.css` + `apps/admin-console/src/tailwind.css`.

### Example 2 — recommended NEW usage (value-driven, image thumbnail, real upload)

```ts
import {
  FalconAngularSingleUploaderComponent,
  type FalconSingleUploaderFile,
} from '@falcon/ui-core/angular';

@Component({ standalone: true, imports: [FalconAngularSingleUploaderComponent] })
export class CompanyLogoStepComponent {
  readonly logo = signal<FalconSingleUploaderFile | null>(null);

  async onUpload(detail: { file: FalconSingleUploaderFile }): Promise<void> {
    this.logo.set({ ...detail.file, status: 'uploading', progress: 0 });
    try {
      const url = await this.api.uploadLogo(detail.file, p =>
        this.logo.update(f => (f ? { ...f, progress: p } : null)));
      this.logo.update(f => (f ? { ...f, status: 'success', progress: 100, url } : null));
    } catch (err) {
      this.logo.update(f => (f ? { ...f, status: 'error', errorMessage: (err as Error).message } : null));
    }
  }
  onDelete(): void { this.api.deleteLogo(); this.logo.set(null); }
}
```

```html
<falcon-angular-single-uploader
  [label]="'company.logo' | translate"
  [placeholder]="'company.dropLogo' | translate"
  [placeholderHint]="'PNG, JPG up to 2 MB'"
  [accept]="'image/png,image/jpeg'"
  [maxSize]="2 * 1024 * 1024"
  size="lg"
  previewMode="thumbnail"
  [value]="logo()"
  (fileUpload)="onUpload($event)"
  (fileDelete)="onDelete()" />
```

> The consumer owns the upload + writes `{status, progress, url}` back into `value` so the tile shows the progress bar (`status==='uploading'`) and then the thumbnail. The component does NOT upload or validate.

### Example 3 — Reactive Forms / ngModel + alternate preview modes

```html
<!-- icon-only for non-image documents -->
<falcon-angular-single-uploader
  [label]="'Contract'" size="md" previewMode="icon-only"
  [accept]="'application/pdf'" formControlName="contract" />

<!-- compact (icon + name + size in a row) for a narrow column -->
<falcon-angular-single-uploader size="sm" previewMode="compact" [(ngModel)]="signature" />
```

`formControlName` / `[(ngModel)]` carry a `FalconSingleUploaderFile | null`.

## Reactive Forms

The control value IS the file descriptor. To reflect a real upload, push updated `{status, progress, url}` back into the value. CVA `onTouched` fires on `falcon-blur` (the native input blur), so `touched`-gated errors work.

## ngModel (template forms)

```html
<falcon-angular-single-uploader [(ngModel)]="file" />
```

## Tailwind-only usage

Use `[rootClass]` (forwarded as `[class]` on the inner Stencil element, BOTH render paths) for layout utilities:

```html
<falcon-angular-single-uploader [rootClass]="'max-w-[200px]'" [(ngModel)]="file" />
```

## Token / per-instance override

`[CODE]` Mutate the `--falcon-single-uploader-*` tokens via a host class. The `:where(...)` selector in `single-uploader.tokens.css` keeps specificity 0, so per-instance overrides win:

```css
.logo-uploader {
  --falcon-single-uploader-tile-size-lg: 160px;
  --falcon-single-uploader-tile-border-radius: var(--falcon-radius-lg);
  --falcon-single-uploader-edit-bg: var(--color-falcon-teal-mid);
}
```

```html
<falcon-angular-single-uploader class="logo-uploader" [(ngModel)]="file" />
```

> Both render paths read the SAME tokens (Shadow CSS = SoT; the `-tw` helper consumes identical names) — SSOT, so the override applies in either path.

## Do / Don't

| Do | Don't |
|---|---|
| Use for single-file replace-tile flows. | Use for multi-file → `<falcon-angular-document-uploader>` / `image-uploader`. |
| Drive `status`/`progress`/`url`/`errorMessage` from the consumer. | Expect the component to upload or validate (deferred). |
| Bind `formControlName` / `[(ngModel)]` / `[value]`. | Bind `[file]` directly alongside ngModel (races the mutable prop). |
| Override `--falcon-single-uploader-*` tokens via a host class. | Hardcode hex/px in consumer CSS. |
| Use `previewMode` `thumbnail` (images) / `icon-only` (docs) / `compact` (narrow). | Assume `compact` body shows in non-compact mode (it is hidden). |
| Listen to `(fileEdit)` for "user wants to replace" — the picker reopens automatically. | Manually `URL.createObjectURL`/revoke — the component handles it. |
| Use `@if`/`@for`. | Use `*ngIf`/`*ngFor`. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-single-uploader` / `falcon-single-uploader` across `apps/` + `libs/falcon/` → **0 production-feature files; showcase/registry/safelist only**:

- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` (render).
- `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/registry.ts` (registry entry).
- `apps/host-shell/src/tailwind.css` + `apps/admin-console/src/tailwind.css` (`@source` safelist).
- `apps/host-shell/src/assets/component-docs/single-uploader.md` (showcase doc).

No match under `libs/falcon/`. **Production single/multi-file uploads use the `file-uploader-shared` family** (`<falcon-angular-document-uploader>` / `image-uploader`), not this component — see DECISION.

> `[INFERRED]` This component is feature-complete but un-adopted; if a feature needs a square single-file replace tile, this is the right component. Otherwise the avatar-row uploaders cover the live needs. (Prior dossier's "1 consumer = playground.page.html" is stale — the playground route was removed.)

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19). Consumer Sweep re-run (showcase/registry/safelist only; 0 production feature consumers; playground consumer removed). Token-override + `[rootClass]` patterns confirmed against the tokens file + wrapper html (ts:68, html:19/44).
