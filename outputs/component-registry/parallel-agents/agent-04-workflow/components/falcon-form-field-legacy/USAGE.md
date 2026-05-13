# falcon-form-field (LEGACY) — USAGE

## Real usage in active codebase

### admin-console Add Client wizard — Information step
`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:46-58`:
```html
<falcon-form-field label="hierarchy.addClient.fields.classCat.label">
  <falcon-angular-dropdown class="w-full"
    [options]="classCatOptions" [clearable]="true"
    [ngModel]="value().classCat"
    (ngModelChange)="updateField('classCat', $event ?? '')" />
</falcon-form-field>

<falcon-form-field label="hierarchy.addClient.fields.classSub.label">
  <falcon-angular-dropdown class="w-full"
    [options]="classSubOptions" [clearable]="true"
    [ngModel]="value().classSub"
    (ngModelChange)="updateField('classSub', $event ?? '')" />
</falcon-form-field>
```

### Account Official section — with error wiring
`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:71-95`:
```html
<falcon-form-field
  label="hierarchy.addClient.fields.entityName.label"
  [errorKey]="entityNameError()?.key ?? null"
  [errorParams]="entityNameError()?.params ?? null">
  <falcon-angular-input type="text" class="w-full"
    [class.fff-error]="!!entityNameError()"
    [state]="entityNameError() ? 'error' : 'default'"
    [ngModel]="value().entityName"
    (ngModelChange)="updateField('entityName', $event)"
    (blur)="onBlur('entityName')" />
</falcon-form-field>
```
Note the consumer manually adds `class="fff-error"` AND sets `state="error"` on the inner control — double-painting.

## Recommended NEW usage
- For most cases, the Falcon UI core inputs (`<falcon-angular-input>`, `<falcon-angular-dropdown>`, etc.) already accept `label`, `errorMessage`, `helperText`, `required` Inputs. Use those directly — NO wrapper needed.
- If you NEED the consistent label+hint+error shell, this component works. But consider whether the per-input Inputs are sufficient.

## Reactive Forms / ngModel
- The inner control owns the form binding. Pass `errorKey` based on `control.errors`.

## Tailwind / token usage
- The SCSS file defines `.fff-error` and other visual classes — violates the no-SCSS rule.

## Bad usage to avoid
- Don't set both `[invalid]` AND `[errorKey]` — `[invalid]` takes precedence.
- Don't pass plain English strings to `label` / `hint` / `errorKey` — they expect i18n keys.

## Do / Don't
- DO use this when wrapping a Falcon UI input that doesn't have built-in label support.
- DO pass `errorParams` for interpolated error messages.
- DON'T use this if the inner control already has a label.
- DON'T add new visual rules in the SCSS — propose tokens instead.
