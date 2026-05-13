# falcon-photo-uploader (LEGACY) — USAGE

## Real usage in active codebase

### admin-console Add Client wizard — Information step
`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:3-9`:
```html
<falcon-photo-uploader
  [photo]="value().photo"
  (photoChange)="updateField('photo', $event)"
  [labelKey]="'hierarchy.addClient.clientPicture'"
  [subLabelKey]="'hierarchy.addClient.photoHint'"
  [dragHintKey]="'hierarchy.addClient.dragHint'"
  [uploadBtnKey]="'hierarchy.addClient.uploadPhoto'" />
```
NOTE: the template uses `(photoChange)` — this is the implicit `model()` two-way change event, not `(fileSelected)`. The data URL flows back into `value().photo`.

### admin-console Add Client wizard — Account Owner step
Same pattern but for the account-owner photo.

### admin-console Add User wizard — Personal step
Same pattern for the user avatar.

### management-console mirrors
Each admin-console consumer has a mirror in `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/...`.

### Playground
`apps/host-shell/src/app/playground/playground.page.html` — showcase.

## Recommended NEW usage
- DO NOT add new consumers of this legacy component.
- **For new circular avatar uploads:** use `<falcon-angular-single-uploader previewMode="thumbnail">` plus per-instance token overrides to round the corners into a full circle:
  ```css
  :where(.avatar-uploader) {
    --falcon-single-uploader-tile-radius: 50%;
  }
  ```
  Then in the template:
  ```html
  <falcon-angular-single-uploader class="avatar-uploader" size="lg" previewMode="thumbnail" />
  ```
  This is a pragmatic stopgap until a real Falcon-UI-core avatar uploader lands.

## Reactive Forms / ngModel
- Not a form control. Two-way `[(photo)]` only.
- If a Reactive Form needs to capture the photo, bind it manually:
  ```ts
  this.form.controls.photo.setValue(dataUrl);
  ```
  and in the template:
  ```html
  <falcon-photo-uploader [photo]="form.value.photo ?? ''"
    (photoChange)="form.controls.photo.setValue($event)" />
  ```

## Tailwind / token usage
- The SCSS file is the visual SSOT — violates the project's "no SCSS" rule.
- Consumer cannot meaningfully override visuals via tokens (none exist).

## Bad usage to avoid
- DO NOT pass an http URL via `[photo]` — the component expects a data URL.
- DO NOT use this for non-image files (e.g., document upload).
- DO NOT extend this component for new code — start fresh from `<falcon-angular-single-uploader>` and add a circular mask via token.

## Do / Don't
- DO use this only for the existing wizards until migration.
- DO read the data URL from `(photoChange)` and pipe to the consumer's state service.
- DON'T add new features to this component.
- DON'T re-export or alias it elsewhere — the legacy footprint should not grow.
