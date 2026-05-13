# falcon-select — USAGE

## Real usage examples

The HTML tag is `<falcon-angular-dropdown>` regardless of which TS class name is imported. Examples are identical to `<falcon-angular-dropdown>` usage — see `../falcon-dropdown/USAGE.md`.

### Example — TS import using the "Select" alias

```ts
import { FalconAngularSelectComponent, FalconSelectOption } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularSelectComponent], // alias of FalconAngularDropdownComponent
  // ...
})
export class MyFormComponent {
  countries: FalconSelectOption[] = [/* ... */];
}
```

```html
<!-- HTML tag is still falcon-angular-dropdown -->
<falcon-angular-dropdown
  [label]="'Country'"
  [options]="countries"
  [searchable]="true"
  [(ngModel)]="selectedCountry">
</falcon-angular-dropdown>
```

## Recommended usage for NEW Angular pages

- Either import name works.
- Prefer `FalconAngularDropdownComponent` for clarity (matches the HTML tag).
- Use the `Select` alias when matching spec / API naming explicitly.

## Reactive Forms / ngModel / Tailwind-only / Token usage

Identical to dropdown — see `../falcon-dropdown/USAGE.md`.

## Bad usage to avoid

- Do NOT expect a `<falcon-angular-select>` HTML tag — it doesn't exist.
- Do NOT use `<select>` native — this alias is for the custom-popover dropdown.

## Do / Don't

| Do | Don't |
|---|---|
| Import alias if spec-aligned naming is desired. | Expect a new HTML tag. |
| Use the HTML tag `<falcon-angular-dropdown>`. | Try `<falcon-angular-select>`. |
