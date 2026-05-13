# falcon-input — API

## Tag map

| Render path | Tag | Notes |
|---|---|---|
| Angular wrapper | `<falcon-angular-input>` | Default — toggles between Shadow + Light via `useTailwind`. CVA-enabled. |
| Stencil Shadow | `<falcon-input>` | Token-driven, framework-agnostic, isolated styles. |
| Stencil Light | `<falcon-input-tw>` | Light DOM — consumer's Tailwind v4 utilities cascade in. |

## Props / @Input

### Behaviour (apply to both render paths)

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `''` | Two-way via CVA / `[(ngModel)]`. Mutable on Stencil host. |
| `label` | `string?` | — | Renders above the field. |
| `placeholder` | `string?` | — | Native HTML placeholder. |
| `helperText` | `string?` | — | Renders below the field in muted style. Hidden when `errorMessage` is non-empty. |
| `errorMessage` | `string?` | — | Renders below the field in danger style. Implicitly forces error styling. |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | Native input type. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Reflected on Stencil host (`:host([size='sm'])`). |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Reflected. |
| `variant` | `'form' \| 'search' \| 'grid'` | `'form'` | Wave 9.C — visual variant per architect §5.12.2. Reflected on Stencil host. |
| `appearance` | `'default' \| 'filled' \| 'ghost'` | `'default'` | Wave 9.C — surface appearance. Reflected. |
| `disabled` | `boolean` | `false` | Reflected. CVA `setDisabledState()` wires this from Forms. |
| `readonly` | `boolean` | `false` | Reflected. |
| `required` | `boolean` | `false` | Reflected. Renders `*` marker. |
| `clearable` | `boolean` | `false` | Shows clear (X) button when value present. |
| `name` | `string?` | — | Mirrors native `name`. |
| `inputId` | `string?` | — | Override generated id. Defaults to `falcon-input-<seq>` or `falcon-ai-<seq>` (Angular wrapper). |
| `autocomplete` | `string` | `'off'` | Native HTML autocomplete. |
| `maxlength` | `number?` | — | Native HTML maxlength. |
| `minlength` | `number?` | — | Native HTML minlength. |
| `autoFocusOnMount` | `boolean` | `false` | Stencil only — focuses on `componentDidLoad`. |
| `spellcheckMode` | `boolean` | `true` | Native HTML spellcheck. |
| `clearAriaLabel` | `string` | `'Clear input'` | a11y override. `<falcon-search-input>` passes `'Clear search'`. |

### Feature toggles (Stencil mode only; Tailwind mode honours caller classes)

| Name | Type | Default | Reflected | Effect |
|---|---|---|---|---|
| `borderless` | `boolean` | `false` | `:host([borderless])` | Strips outer border. |
| `shadowless` | `boolean` | `false` | `:host([shadowless])` | Strips drop shadow. |
| `flat` | `boolean` | `false` | `:host([flat])` | Strips border + shadow + radius. |
| `noFocusRing` | `boolean` | `false` | `:host([no-focus-ring])` | Strips focus-visible ring. |

### Angular wrapper-only

| Name | Type | Default | Notes |
|---|---|---|---|
| `useTailwind` | `boolean` | `true` | Render-path switch. `true` → `<falcon-input-tw>` Light DOM. `false` → `<falcon-input>` Shadow DOM. |
| `wrapperClass` | `string` | `''` | Extra classes for the outer wrapper element. |
| `inputClass` | `string` | `''` | Extra classes for the native `<input>` element. |
| `labelClass` | `string` | `''` | Extra classes for the `<label>` element. |

## Events / @Output (Stencil — all bubble + composed)

| Event | Detail type | When |
|---|---|---|
| `falcon-input` | `FalconInputEventDetail` (`{ value: string }`) | On every keystroke. |
| `falcon-change` | `FalconInputEventDetail` | On blur OR after `Enter`. |
| `falcon-focus` | `FalconInputEventDetail` | On focus. |
| `falcon-blur` | `FalconInputEventDetail` | On blur. CVA calls `onTouched()` here. |
| `falcon-clear` | `FalconInputEventDetail` | When clear button clicked / `clear()` invoked. |

The Angular wrapper listens to these via `(falcon-input)`, `(falcon-change)`, `(falcon-blur)`, `(falcon-clear)` and translates `event.detail.value` back into CVA `onChange(next)`.

## Slots

| Slot | Render path | Purpose |
|---|---|---|
| `prefix` | Shadow only | Render an icon / glyph before the native input (e.g. search icon, currency). |
| `suffix` | Shadow only | Render an icon / glyph after the native input (e.g. validation tick). |

## CSS variables (component-scoped — all read via Tailwind v4 arbitrary-value utilities)

Declared in `libs/falcon-ui-tokens/src/components/input.tokens.css` and mirrored in the Tailwind helpers under `libs/falcon-ui-core/src/tailwind/input-tailwind-classes.ts`. Studio mutates these to restyle every render path at once.

- `--falcon-input-label-margin-bottom`, `--falcon-input-label-font-size`, `--falcon-input-label-font-weight`, `--falcon-input-label-line-height`, `--falcon-input-label-cursor`, `--falcon-input-label-color`, `--falcon-input-label-color-error`
- `--falcon-input-helper-padding-x`, `--falcon-input-error-padding-x`, `--falcon-input-error-font-size`
- `--falcon-input-clear-button-size`, `--falcon-input-clear-button-color`, `--falcon-input-clear-button-color-hover`, `--falcon-input-clear-button-bg-hover`

The Tailwind v4 SSOT at `falcon-tailwind-tokens.css` provides the base size / colour / shadow primitives that the input tokens compose from.

## CVA contract

```ts
writeValue(value: string | null | undefined): void
registerOnChange(fn: (value: string) => void): void
registerOnTouched(fn: () => void): void
setDisabledState(isDisabled: boolean): void
```

## Public methods (Stencil only)

| Method | Returns | Purpose |
|---|---|---|
| `setFocus()` | `Promise<void>` | Programmatically focus the native input. |
| `clear()` | `Promise<void>` | Programmatically clear the value (mirrors clear-button click). |
