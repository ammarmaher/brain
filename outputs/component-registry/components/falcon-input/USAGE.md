# falcon-input — USAGE

## Real usage examples (active codebase)

### Example 1 — Reactive Forms style with explicit `state` binding + per-instance token override

`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html`:

```html
<!-- *** Falcon UI cross-framework <falcon-angular-input> — proves the Nx wiring (Stencil core + tokens + Angular CVA wrapper) end-to-end. *** -->
<!-- *** `add-client-special-input` class demonstrates per-instance token override (height, radius, focus color, bg). *** -->
<falcon-angular-input
  class="add-client-special-input w-full"
  [label]="'hierarchy.addClient.fields.accountName.label' | translate"
  [placeholder]="'hierarchy.addClient.fields.accountName.placeholder' | translate"
  [helperText]="'hierarchy.addClient.fields.accountName.helper' | translate"
  [errorMessage]="accountNameError() ? (accountNameError()!.key | translate: accountNameError()!.params) : ''"
  [state]="accountNameError() ? 'error' : 'default'"
  [required]="true"
  [clearable]="true"
  [maxlength]="100"
  [ngModel]="value().accountName"
  (ngModelChange)="updateField('accountName', $event)"
  (blur)="onBlur('accountName')">
</falcon-angular-input>
```

### Example 2 — Tailwind-mode with `wrapperClass` overlay

Same file, second snippet:

```html
<!-- *** Falcon UI in TAILWIND mode (useTailwind=true). *** -->
<!-- *** Caller-supplied wrapperClass adds hover-green border on top of the canonical idle/focus look. *** -->
<falcon-angular-input
  [useTailwind]="true"
  class="w-full"
  [label]="'hierarchy.addClient.fields.financeId.label' | translate"
  ... />
```

### Example 3 — Wrapped in legacy `<falcon-form-field>` for old-school labeled wrapper

`apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html`:

```html
<falcon-form-field [label]="'...'" [required]="true">
  <falcon-angular-input type="text" class="w-full"
    [state]="firstNameError() ? 'error' : 'default'"
    [placeholder]="'hierarchy.addUser.fields.firstName.placeholder' | translate"
    [ngModel]="value().firstName"
    (ngModelChange)="updateField('firstName', $event)"
    (blur)="onBlur('firstName')" />
</falcon-form-field>
```

> Note: new code should use the built-in `label` / `required` / `errorMessage` inputs on `<falcon-angular-input>` instead of wrapping in `<falcon-form-field>`. Keep `<falcon-form-field>` only when the form has heterogeneous labeled controls.

## Recommended usage for NEW Angular pages

```html
<falcon-angular-input
  [label]="'fields.email.label' | translate"
  [placeholder]="'fields.email.placeholder' | translate"
  [errorMessage]="emailError() | translate"
  [state]="emailError() ? 'error' : 'default'"
  [required]="true"
  [clearable]="true"
  type="email"
  size="md"
  [(ngModel)]="email">
</falcon-angular-input>
```

Defaults are tuned for forms: `useTailwind=true`, `type='text'`, `size='md'`, `state='default'`, `variant='form'`, `appearance='default'`.

## Reactive Forms

```ts
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FalconAngularInputComponent } from '@falcon/ui-core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ReactiveFormsModule, FalconAngularInputComponent],
  template: `
    <form [formGroup]="form">
      <falcon-angular-input
        formControlName="email"
        [label]="'Email'"
        [errorMessage]="form.controls.email.touched && form.controls.email.invalid ? 'Invalid email' : ''">
      </falcon-angular-input>
    </form>
  `,
})
export class ExampleComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}
```

## ngModel (template forms)

```html
<falcon-angular-input
  [label]="'Username'"
  [(ngModel)]="username"
  (ngModelChange)="onUsernameChange($event)">
</falcon-angular-input>
```

## Tailwind-only usage

When you need extra Tailwind utilities on the field shell (e.g. responsive width, max-w), apply them via the host `class=` attribute or the `wrapperClass` input:

```html
<falcon-angular-input class="max-w-sm" [label]="'Name'" [(ngModel)]="name" />
```

For wrapper-scoped customization in Tailwind mode:

```html
<falcon-angular-input
  [useTailwind]="true"
  wrapperClass="hover:border-falcon-green-500 focus-within:border-falcon-green-700"
  [(ngModel)]="value" />
```

## Token usage (per-instance override pattern)

Add a host class (e.g. `add-client-special-input`) on the consumer, then in a CSS file scoped to the consumer mutate the `--falcon-input-*` tokens:

```css
.add-client-special-input {
  --falcon-input-height-md: 40px;
  --falcon-input-border-radius: 12px;
  --falcon-input-border-color-focus: var(--color-falcon-green-500);
  --falcon-input-bg: var(--color-falcon-teal-tint);
}
```

> Stencil Shadow honors the override because `--falcon-input-*` tokens are inherited through Shadow DOM. Tailwind path picks them up through the same `falcon-input.tokens.css` `:where()` selector chain.

## Admin-console / management-console example

`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` is the most thorough reference; see USAGE Example 1 above.

## Bad usage to avoid

- **Do NOT** bind both `[value]` and `[(ngModel)]` — CVA handles value; `[value]` is a Stencil-prop-attr passthrough and will race.
- **Do NOT** import `FalconAngularInputComponent` AND set `CUSTOM_ELEMENTS_SCHEMA` on the host — the wrapper already declares it internally.
- **Do NOT** put SCSS rules in the consumer's `.component.css` to style the field. Use the per-instance token override pattern above.
- **Do NOT** nest `<falcon-angular-input>` inside `<falcon-form-field>` for NEW code — duplicates label rendering. Use the built-in `label` / `errorMessage` instead.
- **Do NOT** use `*ngIf` / `*ngFor` in the surrounding template — use `@if` / `@for` per project rule.
- **Do NOT** rely on `prefix` / `suffix` slots in Tailwind mode — they are not implemented there. Use Shadow mode (`useTailwind=false`) if slots are required.
- **Do NOT** add `pi pi-*` icons — PrimeIcons are physically removed. Use the vendored Falcon icon font instead.

## Import requirements (standalone component)

```ts
import { FalconAngularInputComponent } from '@falcon/ui-core';
import { FormsModule } from '@angular/forms'; // for ngModel
// or: import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FalconAngularInputComponent, FormsModule],
  ...
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use built-in `label` / `helperText` / `errorMessage` inputs. | Nest in `<falcon-form-field>` for new code. |
| Set `state="error"` AND `errorMessage` together. | Set only one (works, but inconsistent). |
| Override tokens via host class + CSS file. | Hardcode hex / px in `style=`. |
| Use `useTailwind=true` (default). | Toggle to Shadow only if slots needed. |
| Bind `(ngModelChange)` or `formControlName`. | Bind `[value]` directly. |
| Add Tailwind utilities via `class=` or `wrapperClass`. | Add SCSS rules in consumer CSS. |
