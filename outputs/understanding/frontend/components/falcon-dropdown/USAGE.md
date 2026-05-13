# falcon-dropdown — USAGE

## Playground snippet (host-shell, both render paths)

`apps/host-shell/src/app/playground/playground.page.html`

```html
<!-- Shadow DOM (Stencil) render path -->
<falcon-angular-dropdown
  class="w-full"
  [label]="'Country'"
  [placeholder]="'Select a country'"
  [helperText]="'Stencil-rendered. Token-driven. Searchable + clearable.'"
  [size]="'md'"
  [options]="countryOptions"
  [searchable]="true"
  [clearable]="true"
  [(ngModel)]="selectedCountry"
></falcon-angular-dropdown>

<!-- Light DOM (Tailwind) render path -->
<falcon-angular-dropdown
  [useTailwind]="true"
  class="w-full"
  [label]="'Country'"
  [placeholder]="'Select a country'"
  [helperText]="'Tailwind-rendered. Same tokens. Light DOM.'"
  [size]="'md'"
  [options]="countryOptions"
  [searchable]="true"
  [clearable]="true"
  [(ngModel)]="selectedCountry"
></falcon-angular-dropdown>
```

## Auth flow snippet (host-shell login-layout)

`apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts:N`

```ts
/*** Mutable copy passed to <falcon-angular-dropdown> [options] (typed FalconDropdownOption[]). ***/
languageOptions: FalconDropdownOption[] = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];
```

```html
<falcon-angular-dropdown
  [label]="'Language'"
  [options]="languageOptions"
  [(ngModel)]="selectedLanguage"
  [size]="'sm'"
></falcon-angular-dropdown>
```

## i18n adapter pattern (admin-console add-user wizard)

`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-role-status-step/user-role-status-step.component.ts`

```ts
/*** Adapter: translate i18n label keys at construction so <falcon-angular-dropdown> can render them.
     Wave 4 follow-up: add per-item template slot to <falcon-angular-dropdown> for live language switch. ***/
roleOptions: FalconDropdownOption[] = this.translate.translateOptions(rawRoleOptions);
```

This pattern is mandatory until the per-item template slot lands — the dropdown does NOT currently let the consumer slot a `ng-template` per option, so labels must be translated upfront and re-translated on language change.

## Reactive Forms

```html
<form [formGroup]="form">
  <falcon-angular-dropdown
    formControlName="country"
    [label]="'Country'"
    [options]="countryOptions"
    [searchable]="true"
    [required]="true"
    [state]="form.controls.country.invalid && form.controls.country.touched ? 'error' : 'default'"
    [errorMessage]="form.controls.country.touched && form.controls.country.errors?.['required'] ? 'Country is required' : ''"
  ></falcon-angular-dropdown>
</form>
```

## Stencil-only HTML usage

```html
<falcon-dropdown
  label="Tenant"
  placeholder="Choose a tenant"
  searchable
  clearable
  required
  size="md"
></falcon-dropdown>

<script>
  const el = document.querySelector('falcon-dropdown');
  el.options = [
    { value: 't1', label: 'Tenant A' },
    { value: 't2', label: 'Tenant B' },
  ];
  el.addEventListener('falcon-change', (e) => {
    console.log('Selected:', e.detail.option);
  });
</script>
```

## Grouped options

When `option.group` is set on each entry, options visually cluster under group headers (renderer is internal — no slot per group yet).

## Custom option rendering (Shadow DOM only)

```html
<falcon-dropdown label="Account">
  <div slot="options">
    <!-- Custom option markup goes here -->
  </div>
</falcon-dropdown>
```

> The slotted-options template is a placeholder pattern — the default panel rendering is preferred. Custom slot rendering is experimental.

## Per-instance token override

In the consuming component's CSS:

```css
:host ::ng-deep .org-menu-tenant-dropdown {
  --falcon-dropdown-trigger-height: 2.5rem;
  --falcon-dropdown-radius: var(--radius-md);
  --falcon-dropdown-panel-max-height: 320px;
  --falcon-dropdown-option-hover-bg: var(--color-falcon-teal-option);
}
```

Applied like:

```html
<falcon-angular-dropdown class="org-menu-tenant-dropdown" ...></falcon-angular-dropdown>
```

Both Shadow + Light render paths pick the override up because both resolve to `--falcon-dropdown-*` tokens.
