# falcon-input — USAGE

## Real-world snippet (admin-console wizard, Light DOM default)

`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:14-29`

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
  [(ngModel)]="state.accountName"
></falcon-angular-input>
```

### What this shows

- **i18n via TranslatePipe** — all label / placeholder / helper / error strings flow through `| translate`.
- **Signal-derived error state** — `accountNameError()` is a signal returning `{ key, params } | null`; the template reactively renders its message OR an empty string.
- **`[state]` flips to `'error'`** based on the same signal — the visual state and error message are kept in sync.
- **Per-instance token override** — the `add-client-special-input` class is defined in component CSS that mutates `--falcon-input-*` tokens for that single element (height, radius, focus colour, background). The standard `<falcon-input>` rendering is unchanged everywhere else.
- **`[(ngModel)]`** wires the input to the state-service signal via `ControlValueAccessor`. Same idiom works for Reactive Forms (`formControl` / `formControlName`).
- **`w-full`** Tailwind utility on the wrapper — sets width to 100% of the parent.

## Playground snippet (host-shell, both render paths side-by-side)

`apps/host-shell/src/app/playground/playground.page.html`

```html
<!-- Shadow DOM render path -->
<falcon-angular-input
  class="w-full"
  [label]="'Username'"
  [placeholder]="'Enter your username'"
  [helperText]="'Stencil-rendered. Token-driven. Shadow DOM.'"
  [size]="'md'"
  [clearable]="true"
  [(ngModel)]="username"
></falcon-angular-input>

<!-- Light DOM render path -->
<falcon-angular-input
  [useTailwind]="true"
  class="w-full"
  [label]="'Username'"
  [placeholder]="'Enter your username'"
  [helperText]="'Tailwind-rendered. Same tokens. Light DOM.'"
  [size]="'md'"
  [clearable]="true"
  [(ngModel)]="username"
></falcon-angular-input>
```

The playground demonstrates that flipping `useTailwind` swaps the render path while every visual value stays identical because both paths read from `--falcon-input-*` tokens.

## Reactive Forms snippet

```html
<form [formGroup]="form">
  <falcon-angular-input
    formControlName="email"
    [label]="'Email'"
    type="email"
    [required]="true"
    [clearable]="true"
    [state]="form.controls.email.invalid && form.controls.email.touched ? 'error' : 'default'"
    [errorMessage]="form.controls.email.touched && form.controls.email.errors?.['email'] ? 'Please enter a valid email' : ''"
  ></falcon-angular-input>
</form>
```

## Stencil-only usage (e.g. inside a non-Angular page)

```html
<falcon-input
  label="Email"
  placeholder="you@company.com"
  type="email"
  size="md"
  required
  clearable
></falcon-input>

<script>
  document.querySelector('falcon-input').addEventListener('falcon-change', (event) => {
    console.log('New value:', event.detail.value);
  });
</script>
```

## Slotted prefix / suffix (Shadow DOM only)

```html
<falcon-input label="Amount" placeholder="0.00">
  <span slot="prefix">$</span>
  <span slot="suffix">USD</span>
</falcon-input>
```

## Per-instance token override pattern

In the consuming component's CSS:

```css
:host ::ng-deep .add-client-special-input {
  --falcon-input-control-height: 2.5rem;       /* taller */
  --falcon-input-radius: var(--radius-md);     /* rounder */
  --falcon-input-focus-color: var(--color-falcon-amber-500); /* amber instead of teal */
  --falcon-input-bg: var(--color-falcon-neutral-50);
}
```

This works for **both render paths** because both Shadow + Light DOM resolve their visual values through the same `--falcon-input-*` token chain. (Wave 12A removed glass / glossify tokens but the per-instance override pattern stayed intact.)
