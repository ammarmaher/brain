# falcon-combobox — GAPS AND UPGRADES

## Missing capabilities

### G1 — No `helperText` or `errorMessage` inputs on the wrapper (P1)

Unlike `<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-multi-select>`, the combobox wrapper has NO helper / error inputs. Form-level error messages cannot be rendered inside the component.

**Recommended fix:** add `@Input() helperText?` and `@Input() errorMessage?` (or `errorText` consistent with dropdown — but prefer `errorMessage`).

### G2 — No `state` input (P1)

No `state: 'default' | 'error' | 'success' | 'warning'` input. Cannot show error/success styling consistently with other form controls.

**Recommended fix:** add `state` input mirroring `<falcon-angular-input>`.

### G3 — No `disabled` input (P1)

`disabled` is managed only via CVA's `setDisabledState`. No imperative input. Disabled state via `[disabled]=true` would be more idiomatic for non-Forms consumers.

### G4 — No `required` input (P2)

Form contracts include required marker on label.

### G5 — No `variant` / `appearance` (P2)

Doesn't follow Wave 9.C convention.

### G6 — No per-item template (P1)

Same as dropdown — only `label` is rendered; no icon / sub-label support.

### G7 — No async/debounce built in (P2)

`filterChange` fires on every keystroke. A built-in `@Input() debounceMs = 0` would centralize the pattern.

### G8 — No methods proxied (P1)

Stencil exposes `openPanel`/`closePanel`/etc. presumably; wrapper does not.

### G9 — Value type is `string` only (P2)

Unlike dropdown (`string | number`), combobox value is `string`. Inconsistent.

### G10 — No `searchable` toggle (built-in by design)

Search is implicit — fine, but worth noting in docs.

## Missing accessibility

- Live region for result count.
- `aria-autocomplete="list"` / `"both"` attribute — verify Stencil.
- Loading announcement to screen readers.

## Missing tests

- No spec located. Add CVA cycle + filter pipeline + free-text vs strict modes.

## Missing Tailwind / token parity

- Likely fine — same dual-render pattern. Verify.

## Performance risks

- No debounce → many `filterChange` emissions for typists. Consumers must debounce.

## Visual / interaction risks

- "No matches" message vs `loading=true` — visual interaction needs verification.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Add `helperText` + `errorMessage` | P1 |
| G2 | Add `state` input | P1 |
| G3 | Add `disabled` input | P1 |
| G6 | Per-item template / iconUrl | P1 |
| G8 | Method proxies | P1 |
| G4 | Add `required` input | P2 |
| G5 | Add `variant` / `appearance` | P2 |
| G7 | Built-in `debounceMs` | P2 |
| G9 | Allow `string \| number` value | P2 |

## Concrete upgrade API

```ts
@Input() helperText?: string;
@Input() errorMessage?: string;
@Input() state: 'default' | 'error' | 'success' | 'warning' = 'default';
@Input() disabled = false;
@Input() required = false;
@Input() variant: 'form' | 'search' | 'grid' = 'form';
@Input() appearance: 'default' | 'filled' | 'ghost' = 'default';
@Input() debounceMs = 0;
@ContentChild(FalconComboboxItemTemplateDirective) itemTpl?;
async openPanel(): Promise<void>;
async closePanel(): Promise<void>;
async setFocus(): Promise<void>;
async clear(): Promise<void>;
```

## Shared vs per-page

All gaps belong in the shared component.

## Workarounds today

- For G1/G2: wrap in `<falcon-form-field>` for label + error markup.
- For G3: use Reactive Forms `disable()` on the control.
- For G7: pipe `filterChange` through `Subject + debounceTime`.
