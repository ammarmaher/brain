# falcon-document-uploader — USAGE

## Real usage examples (active codebase)

### Example 1 — contact-groups CSV/Excel import (flagship; the raw File drives an S3 upload)

`[CODE]` `apps/management-console/.../contact-groups/create-contact-group/steps/upload-group-details-step/upload-group-details-step.component.html:56-73`:

```html
<falcon-angular-document-uploader
  [label]="'contactGroups.create.uploadFieldLabel' | translate"
  [helperText]="uploaderHelperText()"
  [buttonText]="'contactGroups.create.uploadFileButton' | translate"
  [accept]="acceptAttr()"
  [maxSizeMB]="maxSizeMB()"
  [multiple]="false"
  [useTailwind]="true"
  [extErrorTemplate]="extErrorTemplate()"
  [sizeErrorTemplate]="sizeErrorTemplate()"
  [networkErrorTemplate]="networkErrorTemplate()"
  [successBannerTemplate]="successBannerTemplate()"
  [retryText]="retryText()"
  [removeText]="removeText()"
  [replaceText]="replaceText()"
  (fileAdd)="onFileAdd($event)"
  (fileRemove)="onFileRemove()"
></falcon-angular-document-uploader>
```

> `[CODE]` Key points: `[useTailwind]="true"` is mandatory here — the comment (html:50-52) records that the Shadow `<falcon-document-uploader>` is **NOT registered** in this app and renders BLANK; only the `-tw` variant self-registers. `(fileAdd)="onFileAdd($event)"` forwards `$event.nativeFile` (the raw `File`) into the S3 init→PUT→complete pipeline (closes FLAG B-CG-2); `(fileRemove)` clears it. `acceptAttr()` / `maxSizeMB()` are computed from `inject(FALCON_UPLOADER_DEFAULTS).document` (the canonical constraints) rather than magic literals (`[CODE]` upload-group-details-step.component.ts:94-96).

### Example 2 — templates wizard media step (image vs document branch, both consoles)

`[CODE]` `apps/{admin,management}-console/.../templates-page/.../step2-message-structure.component.html:267-289`:

```html
<!-- image → <falcon-angular-image-uploader> (preview); video/document → <falcon-angular-document-uploader> (icon tile) -->
@if (mediaKind() === 'image') {
  <falcon-angular-image-uploader … />
} @else {
  <falcon-angular-document-uploader
    [label]="'templates.wizard.step2.media.uploadPh' | translate"
    … />
}
```

> The raw `File` arrives via `(fileAdd)`; the wizard uploads it to the media backend.

### Example 3 — recommended NEW usage (single document, Reactive Forms)

```ts
import {
  FalconAngularDocumentUploaderComponent,
  type FalconFileUploaderAddDetail,
} from '@falcon/ui-core/angular';

@Component({ standalone: true, imports: [FalconAngularDocumentUploaderComponent, ReactiveFormsModule] })
export class AttachStep {
  onFileAdd(d: FalconFileUploaderAddDetail): void {
    // d.nativeFile is the raw File — run the real upload, then push progress/status
    // back via the bound value or the Stencil setFiles() method.
  }
}
```

```html
<falcon-angular-document-uploader
  [label]="'Attach spreadsheet' "
  [accept]="'xlsx,xls,csv'"
  [maxSizeMB]="5"
  [multiple]="false"
  [useTailwind]="true"
  formControlName="doc"
  (fileAdd)="onFileAdd($event)" />
```

## Reactive Forms

The CVA value is a `ReadonlyArray<FalconFileUploaderFile>`. To reflect a real upload, push updated `{status, progress, errorCode}` items back into the value (or call the Stencil `setFiles()` via a ref). `(fileAdd).nativeFile` is the hook to START the upload.

## ngModel (template forms)

```html
<falcon-angular-document-uploader [(ngModel)]="docs" [multiple]="true" (fileAdd)="upload($event)" />
```

## Tailwind-only usage

Use `[rootClass]` for layout utilities (forwarded as `[class]` on the inner Stencil element). Do NOT hand-roll color/shape utilities — override the shared `--falcon-file-uploader-*` tokens or use the `shape`/`borderStyle`/`progressMode` inputs.

## Token / per-instance + app-wide override

- **Per-instance visual tokens:** mutate `--falcon-file-uploader-*` via a host class (the `:where(...)` selector in `file-uploader.tokens.css` keeps specificity 0). NOTE: this token block is SHARED with `<falcon-image-uploader>` — an override on a shared class affects both unless scoped to `falcon-angular-document-uploader`.
- **App-wide DEFAULTS:** override `FALCON_UPLOADER_DEFAULTS.document` at bootstrap via `provideFalconUploader({ defaults: { document: {...} } })` (`[CODE]` `libs/falcon-studio-runtime/.../provide-falcon-uploader.ts`); the wrapper seeds every input from `.document` unless a per-instance `[input]` is bound (`[CODE]` ts:73). The built-in values come from `libs/falcon-studio/src/config/falcon-component-defaults.json` (`uploader.document`).

## Do / Don't

| Do | Don't |
|---|---|
| Set `[useTailwind]="true"` (default) — the Shadow tag is unregistered in apps (renders blank). | Set `useTailwind=false` without registering `<falcon-document-uploader>` first. |
| Drive the upload from `(fileAdd).nativeFile`; push progress/status back. | Expect the component to upload (it only validates ext+size). |
| Feed translated `*Template` / copy inputs (`{exts}`/`{max}`/`{n}` placeholders intact). | Hardcode English copy. |
| Bind `formControlName` / `[(ngModel)]`. | Bind the Stencil `[files]` directly alongside ngModel. |
| Use `<falcon-angular-image-uploader>` for images. | Use this for image thumbnails (it shows a doc icon, no preview). |
| Override app-wide defaults via `provideFalconUploader`. | Repeat the same `accept`/`maxSizeMB` literals per instance. |
| Use `@if`/`@for`. | Use `*ngIf`/`*ngFor`. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-document-uploader>` across `apps/` → **4 render sites** (3 production features + 1 showcase):

- `apps/management-console/.../contact-groups/create-contact-group/steps/upload-group-details-step/upload-group-details-step.component.html:56` (+ `.ts` + `apps/management-console/tests/contact-groups/upload-group-details-step.component.spec.ts`).
- `apps/admin-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html:289` (+ `.ts`).
- `apps/management-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html:289` (+ `.ts`).
- `apps/host-shell/.../falcon-ui-showcase/library-section/uploader-section.component.ts:155` (showcase lab).

Config/DI references (non-render): `apps/host-shell/src/app/app.config.ts:176-178` (seeds defaults), `libs/falcon-studio-runtime/src/index.ts` + `.../uploader-defaults.token.ts` + `.../provide-falcon-uploader.ts`, `libs/falcon-studio/.../gallery-defaults.ts` + `demos/file-uploader-demo.component.ts`, `libs/falcon-ui-core/{web-types.json, components.d.ts, stub-seeder.cjs}` (generated).

> Unlike single-uploader, this component has **genuine production reach** — the contact-groups CSV/Excel import + the templates media step in both consoles.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19). Example 1 confirmed against upload-group-details-step.component.html:56-73 (+ the `[useTailwind]="true"` / Shadow-blank comment + the DI-defaults `.ts`). Consumer Sweep re-run → 4 render sites (3 production + showcase) + DI/Studio refs. App-wide defaults via `provideFalconUploader` confirmed.
