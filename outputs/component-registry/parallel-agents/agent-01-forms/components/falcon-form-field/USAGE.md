# falcon-form-field — USAGE

## Real usage examples

### Example 1 — Wrapping a Falcon input (LEGACY pattern; new code should not do this)

`apps/management-console/.../user-personal-step.component.html`:

```html
<falcon-form-field
  label="hierarchy.addUser.fields.firstName.label"
  [required]="true"
  [errorKey]="firstNameError()?.key ?? null"
  [errorParams]="firstNameError()?.params ?? null">
  <falcon-angular-input type="text" class="w-full"
    [state]="firstNameError() ? 'error' : 'default'"
    [placeholder]="'hierarchy.addUser.fields.firstName.placeholder' | translate"
    [ngModel]="value().firstName"
    (ngModelChange)="updateField('firstName', $event)"
    (blur)="onBlur('firstName')" />
</falcon-form-field>
```

> The above is double-handling the label (form-field label + falcon-input has its own label support). New code should drop `<falcon-form-field>` and use `<falcon-angular-input>`'s built-in `label` / `required` / `errorMessage` instead.

### Example 2 — Wrapping a non-Falcon control (still valid)

```html
<falcon-form-field
  label="profile.bio"
  hint="profile.bioHint"
  [errorKey]="bioError() ? 'profile.bioErr' : null">
  <my-custom-rich-editor [(value)]="bio"></my-custom-rich-editor>
</falcon-form-field>
```

## Recommended usage for NEW Angular pages

- **DO NOT use `<falcon-form-field>` to wrap `<falcon-angular-*>` inputs.** Use their built-in `label`/`errorMessage`/`required` inputs instead.
- Use only for non-Falcon controls or mixed-layout rows.
- Migration plan: replace `<falcon-form-field>` wrappers in wizards over time.

## Reactive Forms

The wrapper doesn't bind value — consumer does.

## ngModel

Same — wrapper is purely visual.

## Tailwind-only

The wrapper has an SCSS file — **flag for migration to Tailwind utilities**.

## Token usage

If/when migrated to Tailwind, expose tokens like:

```css
.brand-form-field {
  --falcon-form-field-label-color: var(--color-falcon-teal-700);
  --falcon-form-field-required-color: var(--color-falcon-red-500);
}
```

## Bad usage to avoid

- Do NOT use to wrap Falcon UI inputs in NEW code.
- Do NOT depend on internal label-for-control association — slotted children retain their own IDs.
- Do NOT pass already-translated strings — `label` / `hint` / `errorKey` are i18n KEYS.

## Do / Don't

| Do | Don't |
|---|---|
| Use only for legacy / non-Falcon controls. | Wrap Falcon UI inputs in new code. |
| Pass translation keys. | Pass translated strings directly. |
| Migrate to built-in input labels over time. | Add new `<falcon-form-field>` usages. |
