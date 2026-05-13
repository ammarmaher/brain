# falcon-dropdown — USAGE

## Real usage examples

### Example 1 — Status picker (admin-console user role wizard)

```html
<falcon-angular-dropdown
  [label]="'hierarchy.addUser.fields.status.label' | translate"
  [placeholder]="'common.choose' | translate"
  [options]="statusOptions()"
  [state]="statusError() ? 'error' : 'default'"
  [errorText]="statusError() | translate"
  [required]="true"
  [clearable]="true"
  [(ngModel)]="value().status">
</falcon-angular-dropdown>
```

### Example 2 — Searchable country picker (non-phone)

```html
<falcon-angular-dropdown
  label="Country"
  [options]="countryOptions"
  [searchable]="true"
  searchPlaceholder="Search country..."
  [(ngModel)]="selectedCountry">
</falcon-angular-dropdown>
```

### Example 3 — Language picker with icons (Wave 4 — iconUrl)

```ts
languages: FalconDropdownOption[] = [
  { value: 'en', label: 'English',  iconUrl: '/assets/flags/en.svg' },
  { value: 'ar', label: 'العربية', iconUrl: '/assets/flags/ar.svg' },
];
```

```html
<falcon-angular-dropdown
  [options]="languages"
  [(ngModel)]="currentLang"
  variant="search"
  size="sm">
</falcon-angular-dropdown>
```

## Recommended usage for NEW Angular pages

- Always use Reactive Forms or `[(ngModel)]`.
- Set `searchable=true` when options > ~10.
- Set `clearable=true` when the field is optional.
- Use `errorText` + `state="error"` together.
- Prefer `iconUrl` on options over slot-based custom rendering.

## Reactive Forms

```ts
form = new FormGroup({
  status: new FormControl<string | null>(null, Validators.required),
});
```

```html
<falcon-angular-dropdown
  formControlName="status"
  [label]="'Status'"
  [options]="statusOptions"
  [errorText]="form.controls.status.touched && form.controls.status.invalid ? 'Required' : ''"
  [state]="form.controls.status.touched && form.controls.status.invalid ? 'error' : 'default'">
</falcon-angular-dropdown>
```

## ngModel

```html
<falcon-angular-dropdown
  [options]="options"
  [(ngModel)]="selectedValue">
</falcon-angular-dropdown>
```

## Tailwind-only usage

```html
<falcon-angular-dropdown class="w-full max-w-xs" ... />
```

For wrapper-scoped Tailwind extras (panel/trigger/options classes):

```html
<falcon-angular-dropdown
  triggerClass="border-2"
  panelClass="shadow-2xl"
  optionClass="hover:bg-falcon-teal-tint"
  ... />
```

## Token usage (per-instance override pattern)

```html
<falcon-angular-dropdown class="brand-dropdown" ... />
```

```css
.brand-dropdown {
  --falcon-dropdown-border-color-focus: var(--color-falcon-teal-500);
  --falcon-dropdown-border-radius: 12px;
  --falcon-dropdown-panel-max-height: 280px;
}
```

## Bad usage to avoid

- Do NOT use for multi-select — use `<falcon-angular-multi-select>`.
- Do NOT pass `errorMessage` (Stencil-side name) on the Angular wrapper — it's `errorText`.
- Do NOT bind `[value]` directly — use CVA.
- Do NOT try to use `slot="options"` through the Angular wrapper — it doesn't propagate; use `iconUrl` on options or contribute a per-option template upgrade (see GAPS).
- Do NOT hand-roll a search input wrapper around `<falcon-angular-dropdown>` to filter options — use the built-in `searchable=true`.

## Do / Don't

| Do | Don't |
|---|---|
| Use `[options]` setter — wrapper handles Stencil prop assignment timing. | Push options imperatively via `nativeElement.options =`. |
| Use `iconUrl` for flag/avatar visuals. | Wrap in legacy `<falcon-form-field>` unless mixed-control layout demands it. |
| Use `searchable=true` for long lists. | Hand-roll a filter on top of the component. |
| Use `errorText` + `state="error"` together. | Use only one of the two. |
