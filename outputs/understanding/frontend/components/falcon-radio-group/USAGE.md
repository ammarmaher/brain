# falcon-radio-group — USAGE

## Real usage examples (active codebase)

### Example 1 — Wallet balance-type picker (the only live consumer)

`apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html:202-209`:

```html
<falcon-angular-radio-group
  class="[&_.falcon-radio-group-options.is-vertical]:flex [&_.falcon-radio-group-options.is-vertical]:flex-col [&_.falcon-radio-group-options.is-vertical]:items-start [&_.falcon-radio-group-options.is-vertical]:gap-2.5"
  [options]="distributionRadioOptions"
  [selectedValue]="selectedDistribution()"
  orientation="vertical"
  size="sm"
  [disabled]="settingsDisabled() || dataLoading()"
  (selectedValueChange)="selectDistribution($any($event))" />
```

> `[CODE]` The big arbitrary-variant `class="[&_.falcon-radio-group-options.is-vertical]:..."` is the consumer hand-supplying the column layout — because the Angular wrapper ships no Light-DOM CSS for its own `.falcon-radio-group-options` class (GAPS G2). The `[&_...]` selector targets the wrapper's plain `<div>`, which works precisely because the group is NOT a Shadow-DOM Stencil element.

### Example 2 — Wallet wallet-type picker

Same file, lines 219-226 — identical shape, bound to `structureRadioOptions` / `selectedStructure()` / `selectStructure(...)`.

### Example 3 — Reactive Forms (recommended new shape)

```ts
options: FalconRadioGroupOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms',   label: 'SMS' },
];
form = new FormGroup({ channel: new FormControl<string>('email', Validators.required) });
```

```html
<falcon-angular-radio-group
  formControlName="channel"
  [options]="options"
  [groupLabel]="'Delivery channel'"
  orientation="horizontal"
  [errorText]="form.controls.channel.touched && form.controls.channel.invalid ? 'Pick one' : ''" />
```

> Until GAPS G2 is fixed, also pass a layout `class` (as Example 1 does) if the default flow/gap is not what you want — the component's own wrapper classes are unstyled on the Light path.

## Recommended usage for NEW Angular pages

```html
<falcon-angular-radio-group
  [options]="options"
  [groupLabel]="'fields.type.label' | translate"
  [(ngModel)]="type"
  [required]="true"
  orientation="vertical"
  size="md" />
```

Defaults: `useTailwind=true`, `orientation='vertical'`, `size='md'`. **Caveat:** confirm the layout renders as intended — supply a `class` if the wrapper's unstyled classes need help (GAPS G2). Best for ≤ ~8 options; beyond that use `<falcon-angular-dropdown>`.

## ngModel (template forms)

```html
<falcon-angular-radio-group [options]="options" [(ngModel)]="selected" />
```

## Tailwind-only usage

```html
<falcon-angular-radio-group class="block w-full" [options]="options" [(ngModel)]="v" />
```

> The wrapper's child layout is `@for`-rendered into a `<div class="falcon-radio-group-options">`; for column/row gaps that the component does not style, add an arbitrary-variant `class` targeting that div (Example 1).

## Token usage (per-instance override pattern)

On the Angular path the **child radio** tokens (`--falcon-radio-*`) are what visibly render; the group's own `--falcon-radio-group-*` tokens mostly drive the orphaned Stencil group:

```css
.brand-group {
  --falcon-radio-border-color-checked: var(--color-falcon-teal-500);  /* effective (child radios) */
  --falcon-radio-group-option-gap: 12px;                              /* only effective once G2 gives the wrapper classes a backing rule */
}
```

## Bad usage to avoid

- **Do NOT** expect `[(selectedValue)]` to two-way bind — it is `[selectedValue]` (input) + `(selectedValueChange)` (output), or bind via CVA. (There is no `model()`.)
- **Do NOT** mix CVA writes (`formControlName`/`ngModel`) with the `[selectedValue]` setter — pick one write path.
- **Do NOT** rely on the group styling its own classes — supply layout `class` (GAPS G2).
- **Do NOT** override `name` per child — the group shares one `name` for native exclusivity.
- **Do NOT** mismatch types: option `value` is compared to the model with `===` (ts:100), so a string model will not check a numeric option.
- **Do NOT** use for a boolean (switch/checkbox) or a long list (dropdown), or for > ~8 options.
- **Do NOT** use `*ngIf` / `*ngFor`.

## Do / Don't

| Do | Don't |
|---|---|
| Bind via `formControlName` / `ngModel` / `[selectedValue]`+`(selectedValueChange)`. | Use `[(selectedValue)]` (no `model()`). |
| Supply a layout `class` until G2 lands. | Assume the group styles its own classes. |
| Use `groupLabel` + `errorText`. | Hand-roll a label/error around it. |
| Align option `value` types with the model. | Mix `'1'` model with `value: 1` option. |
| Set per-option `disabled` in the `options[]`. | Disable children individually outside the group. |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-radio-group[\s>]` across `apps/` returned **2 render occurrences in 1 file**; **0** in `libs/falcon`:

- `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html` (lines 202, 219)

Plus one non-render reference: a code comment in `apps/admin-console/.../wallet-balance-management.component.ts:496`.

> `[CODE]` CORRECTION vs prior "1 consumer = playground.page.html": the playground route is gone; the real (and only) live consumer is `wallet-balance-management`. The newer `new-wallet-balance` feature uses the app-level `wb-radio-pill` (wrapping `<falcon-angular-radio>`) instead of this group. The prior dossier's "Settings tab / pricing tier" consumers are NOT grep-confirmed.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06). Both wallet-balance examples confirmed against live source incl. the arbitrary-variant layout class; Consumer Sweep re-grepped (2 sites in 1 file); stale playground/settings-tab consumers corrected.
