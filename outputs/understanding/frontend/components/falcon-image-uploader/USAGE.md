# falcon-image-uploader — USAGE

## Real usage examples (active codebase)

### Example 1 — Client picture (Add Client wizard, BASE64-critical fileAdd pipeline)

`apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:13-26`:

```html
<!-- *** Wave 2 (2026-05-31) — migrated from <falcon-photo-uploader> to the React-SoT
     *** card-row <falcon-angular-image-uploader>. BASE64-CRITICAL: onClientPhotoPicked
     *** reads the picked raw File (fileAdd.nativeFile) ONCE and sets BOTH form fields —
     *** `photo` (data-URL preview) AND `photoData` ({extension, fileBase64String}). The
     *** photoData object flows VERBATIM into wire-builders.ts → info.profilePictureInfo. *** -->
<falcon-angular-image-uploader
  [label]="'hierarchy.addClient.clientPicture' | translate"
  [helperText]="'hierarchy.addClient.photoHint' | translate"
  accept="png,jpg,jpeg"
  [maxSizeMB]="1"
  [multiple]="false"
  [showBanner]="false"
  [showStatusBadge]="false"
  [showSuccessRing]="false"
  [showWaves]="true"
  [ngModel]="photoFiles()"
  [sizeErrorTemplate]="('hierarchy.addClient.photoTooLarge' | translate).replace('{{maxMb}}', '{max}')"
  (fileAdd)="onClientPhotoPicked($event)"
  (fileRemove)="onClientPhotoRemoved()" />
```

> Note the `[ngModel]="photoFiles()"` (re-seeds the saved preview on step-return — the wrapper is a CVA, no public `[files]` input) and the **decoration flags turned off** (`showBanner`/`showStatusBadge`/`showSuccessRing` false) to match the legacy card look. The size-error i18n string reuses the existing addClient key, swapping its `{{maxMb}}` placeholder for the uploader's `{max}` token.

### Example 2 — Oversize error MESSAGE companion line

Same file (`:32-41`): because `[showBanner]="false"`, the uploader's built-in size banner never shows; the rejected descriptor renders full RED water, and the consumer adds its own `role="alert"` line gated on `photoError()` with the legacy "too large" copy. **Pattern:** when you suppress the built-in banner, supply your own error text and gate it on a signal fed by `(fileError)`/`(fileAdd)`.

### Example 3 — Information panel logo (both consoles)

`apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` — the node/account logo editor mounts `<falcon-angular-image-uploader>` driven by the panel's edit-mode signal; the picked file feeds the Information-panel update payload (`info.profilePictureInfo`).

### Example 4 — Template media (Templates wizard Step 2)

`apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html:3` — header-media image picker for a message template.

## Recommended usage for NEW Angular pages

```html
<falcon-angular-image-uploader
  [label]="'fields.avatar.label' | translate"
  [helperText]="'fields.avatar.hint' | translate"
  accept="png,jpg,jpeg"
  [maxSizeMB]="2"
  [multiple]="false"
  shape="circle"
  [(ngModel)]="avatarFiles"
  (fileAdd)="onAvatarPicked($event)"
  (fileRemove)="onAvatarRemoved()" />
```

Read the raw File once in the handler:

```ts
onAvatarPicked(detail: FalconFileUploaderAddDetail): void {
  const file = detail.nativeFile;            // the raw File
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result as string; // preview
    const base64 = dataUrl.split(',')[1];    // wire payload
    this.form.patchValue({ photoData: { extension: file.name.split('.').pop(), fileBase64String: base64 } });
  };
  reader.readAsDataURL(file);
}
```

Defaults are tuned for avatars: `useTailwind=true`, `shape='circle'`, `accept='png,jpg,jpeg'`, `maxSizeMB=2`, `multiple=false`.

## Reactive Forms

```ts
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FalconAngularImageUploaderComponent, type FalconFileUploaderFile } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FalconAngularImageUploaderComponent],
  template: `
    <falcon-angular-image-uploader formControlName="avatar" [label]="'Avatar'" />
  `,
})
export class ExampleComponent {
  avatar = new FormControl<readonly FalconFileUploaderFile[]>([]);
}
```

## ngModel (template forms)

```html
<falcon-angular-image-uploader [(ngModel)]="files" [label]="'Logo'" (fileAdd)="onPicked($event)" />
```

## Tailwind-only usage

The component is fully token-driven; pass layout utilities via `rootClass`:

```html
<falcon-angular-image-uploader rootClass="max-w-md" [label]="'Logo'" [(ngModel)]="files" />
```

## App-wide default override (DI)

`[CODE]` ts:68-76 — seed every image-uploader instance from one place:

```ts
provideFalconUploader({ defaults: { image: { buttonText: 'Upload Logo', maxSizeMB: 3, shape: 'rounded' } } });
```

Per-instance `[input]` bindings always win over DI defaults.

## Token usage (per-instance override pattern)

Add a host class on the consumer, then mutate `--falcon-file-uploader-*` tokens in a scoped CSS file (the `:where()` selector keeps specificity 0, so per-instance wins):

```css
.special-avatar { --falcon-file-uploader-row-radius: 16px; --falcon-file-uploader-row-border-active: var(--color-falcon-green-500); }
```

```html
<falcon-angular-image-uploader rootClass="special-avatar" [label]="'Logo'" [(ngModel)]="files" />
```

## Bad usage to avoid

- **Do NOT** bind a public `[files]` on the wrapper — it does not exist; drive the list via `[(ngModel)]`/`formControlName` (the CVA).
- **Do NOT** treat the CVA value as the raw File — the value is the `FalconFileUploaderFile[]` descriptor array; the raw `File` is `fileAdd.nativeFile`.
- **Do NOT** pass MIME types to `accept` — it expects bare extensions (`png,jpg,jpeg`).
- **Do NOT** expect a built-in success/size banner if you set `[showBanner]="false"` — supply your own error line (see Example 2).
- **Do NOT** import `FalconAngularImageUploaderComponent` AND set `CUSTOM_ELEMENTS_SCHEMA` — the wrapper already declares it.
- **Do NOT** use SCSS rules in the consumer's `.component.css` to restyle the row — use the `--falcon-file-uploader-*` token-override pattern.
- **Do NOT** use `*ngIf`/`*ngFor` around it — use `@if`/`@for` per project rule.
- **Do NOT** use it for documents (PDF/docx) — use `<falcon-angular-document-uploader>`.

## Import requirements (standalone component)

```ts
import { FalconAngularImageUploaderComponent } from '@falcon/ui-core';
import { FormsModule } from '@angular/forms';  // for ngModel
// or ReactiveFormsModule

@Component({ standalone: true, imports: [FalconAngularImageUploaderComponent, FormsModule], … })
```

## Do / Don't

| Do | Don't |
|---|---|
| Read the raw File from `fileAdd.nativeFile`. | Read the File from the CVA value (it's a descriptor). |
| Drive the value via `[(ngModel)]`/`formControlName`. | Bind a non-existent `[files]` input. |
| Pass bare extensions to `accept`. | Pass MIME types. |
| Override `--falcon-file-uploader-*` tokens via host class. | Hardcode hex/px or write SCSS. |
| Supply your own error line when `showBanner=false`. | Expect the built-in size banner with banner off. |
| Use `<falcon-angular-document-uploader>` for files. | Force PDFs through the image uploader. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-angular-image-uploader` across `apps/` → **18 occurrences / 8 HTML files**; co-imported by **6 TS feature components**; **0** under `libs/falcon/`. Full list:

- `apps/admin-console/.../add-client-wizard/client-information-step.component.html` (2) + `.ts`
- `apps/admin-console/.../add-client-wizard/client-account-owner-step.component.html` (2) + `.ts`
- `apps/{admin,management}-console/.../add-user-wizard/user-personal-step.component.html` (2 each) + `.ts`
- `apps/{admin,management}-console/.../tab-components/hierarchy-tab/falcon-org-info-panel.component.html` (2 each) + `.ts`
- `apps/{admin,management}-console/.../templates-page/.../step2-message-structure.component.html` (3 each)
- `apps/host-shell/.../falcon-ui-showcase/library-section/uploader-section.component.ts` (6 — showcase) + registered in `falcon-ui-showcase.component.ts`, `app.config.ts`, `tailwind.css` (`@source`).

> All production consumers are org-hierarchy wizards/panels + templates wizards in both consoles, plus the host-shell showcase. The migration from `<falcon-photo-uploader>` landed Wave 2 (2026-05-31).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20). Example 1 + 2 quoted verbatim from client-information-step.component.html; Consumer Sweep grep-verified (18 occ / 8 HTML files + 6 TS co-files). The `fileAdd.nativeFile` → `photoData` → `info.profilePictureInfo` pipeline is confirmed in the consumer's inline comment (html:2-12); the exact `wire-builders.ts` line is 🟡 CODE-DERIVED from that comment, not re-read here.
