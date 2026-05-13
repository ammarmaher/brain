# Agent 1 — Upgrade Candidates Backlog

Cross-component reusable-upgrade backlog. Each entry is a concrete proposal that, if implemented in the shared Falcon UI library, would benefit multiple components.

---

## U1 — Universal `FalconOptionTemplateDirective` pattern

**Title:** Per-option / per-row / per-chip custom rendering via projected directive.

**Motivation:** Today, only `<falcon-angular-data-table>` exposes `FalconDataTableCellDirective`. Every other list-of-options component (dropdown, multi-select, combobox, checkbox-group, radio-group, OTP, phone-field country list) renders flat label-only options. Wave 4 partially addressed this for dropdown via `iconUrl`, but that's a special case. Consumers needing per-option icon + sub-label + status pill + dirty indicator currently cannot extend.

**Scope:** dropdown, multi-select, combobox, checkbox-group, radio-group, phone-field, otp (per-box rendering).

**Proposed API:**

```ts
@Directive({ selector: '[falconOption]', standalone: true })
export class FalconOptionTemplateDirective<T = unknown> {
  @Input('falconOption') readonly typeMarker?: string;
  constructor(public template: TemplateRef<{ $implicit: T; index: number }>) {}
}

// On wrappers:
@ContentChild(FalconOptionTemplateDirective) optionTpl?: FalconOptionTemplateDirective;
```

```html
<falcon-angular-dropdown [options]="countries" [(ngModel)]="country">
  <ng-template falconOption let-opt let-i="index">
    <span class="flex items-center gap-2">
      <img [src]="opt.flagUrl" class="w-5 h-5 rounded-sm" />
      <span class="font-medium">{{ opt.label }}</span>
      <span class="ms-auto text-falcon-neutral-500 text-xs">{{ opt.dialCode }}</span>
    </span>
  </ng-template>
</falcon-angular-dropdown>
```

**Risk:** MEDIUM. Needs careful Stencil-side coordination — slot or template-projection bridge. Per-option templates may not render inside Shadow DOM without `:host(::slotted)` adjustments. Investigate Light-DOM-only support first.

**Priority:** **P1** (highest reusability win across 6+ components).

---

## U2 — Form-control `errorMessage` everywhere (errorText alias + soft-deprecate)

**Title:** Harmonize `errorMessage` input name across the form-control family.

**Motivation:** Currently 8 wrappers use `errorMessage`, 8 use `errorText`. Mixing them in a single form is a daily papercut for developers.

**Scope:** dropdown, multi-select, combobox, checkbox, checkbox-group, radio, radio-group, switch.

**Proposed API:**

```ts
@Input() errorMessage?: string;  // canonical
@Input() errorText?: string;     // @deprecated — alias for errorMessage
```

In template binding: `errorMessage ?? errorText`.

**Risk:** LOW. Additive. No breakage. Document deprecation; remove `errorText` after one milestone.

**Priority:** **P2**. Easy win.

---

## U3 — Method-proxy harmonization on Angular wrappers

**Title:** Expose Stencil-side `@Method()` proxies on Angular wrappers.

**Motivation:** Stencil components expose `setFocus()` / `openPanel()` / `closePanel()` / `clear()`. Angular wrappers do NOT proxy these — consumers reach into `nativeElement.querySelector('falcon-X')` and call the methods directly. Inconsistent and fragile.

**Scope:** input, dropdown, multi-select, combobox, textarea, password, input-number, email-field, phone-field, calendar, date-picker, otp, search-input, grid-input.

**Proposed API:** Per component, expose:

```ts
@ViewChild('stencilEl', { static: false, read: ElementRef }) stencilEl?: ElementRef<HTMLElement>;
async setFocus(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.setFocus?.(); }
async clear(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.clear?.(); }
// + openPanel / closePanel / etc. where applicable
```

**Risk:** LOW. Additive. Wrap in try/catch for components that don't expose the method.

**Priority:** **P1**.

---

## U4 — CVA backfill for calendar + date-picker + search-input

**Title:** Add `ControlValueAccessor` to the three CVA-missing wrappers.

**Motivation:** These three are the only form-control-ish components in scope that don't implement CVA. Consumers using Reactive Forms have to bridge them externally — friction.

**Scope:** calendar, date-picker, search-input.

**Proposed API:**

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(...), multi: true }],
writeValue(v) { ... },
registerOnChange(fn) { ... },
registerOnTouched(fn) { ... },
setDisabledState(isDisabled) { ... },
```

Keep existing `valueChange` / `falconChange` outputs in place — additive, no breakage.

**Risk:** LOW for date-picker + search-input; MEDIUM for calendar (need to define value type cleanly given range future).

**Priority:** **P1** for date-picker; **P2** for the other two.

---

## U5 — `verified` state visual on email-field + phone-field

**Title:** Add `verified` + `verifying` inputs to verify-button components.

**Motivation:** Email-field and phone-field both emit `falcon-verify` but have no visual feedback when the consumer confirms verification succeeded. Consumers compose sibling spinners + checkmarks externally.

**Scope:** email-field, phone-field.

**Proposed API:**

```ts
@Input() verifying = false;  // shows spinner inside verify button
@Input() verified  = false;  // replaces verify button with checkmark + "Verified" label
```

Token contract:

```css
--falcon-<email|phone>-field-verified-icon-color: var(--color-falcon-green-500);
--falcon-<email|phone>-field-verifying-spinner-color: var(--color-falcon-teal-500);
```

**Risk:** LOW. Additive.

**Priority:** **P1**.

---

## U6 — Resend cooldown + code-expired state on OTP send dialog

**Title:** Built-in resend cooldown timer + code-expired state.

**Motivation:** Every OTP flow needs a 30-60 second cooldown on Resend. Currently consumers wire this externally. Code-expired flow also common.

**Scope:** otp-send-dialog.

**Proposed API:**

```ts
@Input() resendCooldownSeconds = 0;  // 0 = no cooldown
@Input() codeExpired = false;
```

Internal: countdown signal + disabled state during.

**Risk:** LOW. Additive.

**Priority:** **P1**.

---

## U7 — Pluggable strength estimator + meter labels on password

**Title:** Externalize strength scoring.

**Motivation:** Built-in heuristic (length + mixed case + digit + symbol) is naive. zxcvbn is the standard; consumers want to plug it in.

**Scope:** password.

**Proposed API:**

```ts
@Input() strengthEstimator?: (value: string) => 0 | 1 | 2 | 3 | 4;
@Input() meterLabels?: [string, string, string, string, string];
@Input() requirements?: string[];
```

**Risk:** LOW. Additive (default = current heuristic).

**Priority:** **P1**.

---

## U8 — Async option loading hook on dropdown + multi-select + combobox

**Title:** Built-in `loadOptions(query)` callback for async option loading.

**Motivation:** Currently consumers manage observable + re-feeding `options` input — verbose. A built-in hook with debounce + loading state would centralize the pattern.

**Scope:** dropdown, multi-select, combobox.

**Proposed API:**

```ts
@Input() loadOptions?: (query: string) => Observable<FalconDropdownOption[]>;
@Input() debounceMs = 300;
// internal loading state visualised via token-driven spinner.
```

**Risk:** MEDIUM. RxJS dependency on shared lib is fine (already used in apps). Stencil-side must support async option mutation.

**Priority:** **P1**.

---

## U9 — Per-option `iconUrl` parity across dropdown family

**Title:** Wave 4 `iconUrl` pattern extended to multi-select, combobox, radio-group, checkbox-group options.

**Motivation:** Dropdown got `iconUrl` to solve the language-picker case. Other components needing the same (chips with flags, tier cards with icons) lack it. Until U1 ships, this is the lightweight upgrade.

**Scope:** multi-select option, combobox item, radio-group option, checkbox-group option.

**Proposed API:**

```ts
export interface FalconMultiSelectOption {
  // ... existing
  iconUrl?: string;
  iconSrcset?: string;
  iconAlt?: string;
}
```

**Risk:** LOW. Additive.

**Priority:** **P2**.

---

## U10 — Wrapper event re-emission on textarea (and audit all wrappers)

**Title:** Re-emit Stencil events as Angular `@Output`s on the wrapper.

**Motivation:** Textarea wrapper doesn't expose `falconInput` / `falconChange` / `falconBlur` outputs — value only via CVA. Consumers wanting explicit listeners must attach to nativeElement.

**Scope:** textarea (primary), audit input + dropdown + all wrappers for event-emission completeness.

**Proposed API:** add `@Output() falconInput / falconChange / falconBlur` per wrapper.

**Risk:** LOW.

**Priority:** **P2**.

---

## U11 — Range mode for calendar + date-picker

**Title:** `mode: 'single' | 'range'` (multi later).

**Motivation:** Range pickers are a top user request. Currently consumers compose two date-pickers + manual coordination.

**Scope:** calendar, date-picker.

**Proposed API:**

```ts
@Input() mode: 'single' | 'range' = 'single';
@Output() rangeChange = new EventEmitter<{ start: string; end: string }>();
```

**Risk:** HIGH. Value shape changes. Stage as opt-in via `mode` input. Big visual changes.

**Priority:** **P1** (most-requested) but **schedule as a milestone**.

---

## U12 — Pluggable phone-field validator + virtualized country dropdown

**Title:** Two concrete phone-field upgrades.

**Motivation:** (a) Phone validation is currently consumer-only — no built-in `Validators.phone` equivalent. (b) Country dropdown renders ~250 items eagerly.

**Scope:** phone-field.

**Proposed API:**

```ts
@Input() validator?: (e164: string) => boolean;
@Input() virtualScroll = true;  // default-on
```

**Risk:** MEDIUM. Virtualization needs Stencil-side cdk-virtual-scroll equivalent.

**Priority:** **P1** (validator); **P2** (virtualization).

---

## U13 — Deprecate `<falcon-form-field>` + migrate consumers

**Title:** Workspace-wide audit + replacement.

**Motivation:** Legacy SCSS-driven labeled wrapper. Falcon UI inputs have built-in label/error. Currently many wizard rows double-handle the label.

**Scope:** form-field + all consumers (organization-hierarchy wizards primarily).

**Proposed API:** N/A — pure migration.

Steps:
1. Add `@deprecated` JSDoc.
2. Migrate SCSS → Tailwind + tokens (interim).
3. Add programmatic label-for-control (G2 in form-field GAPS).
4. Workspace-wide grep + refactor pass replacing `<falcon-form-field><falcon-angular-input>...` with single `<falcon-angular-input>`.
5. Remove form-field from `imports: []` after migration.

**Risk:** MEDIUM. Visual regressions possible during SCSS removal.

**Priority:** **P2** (long-tail cleanup).

---

## U14 — `description` sub-label across boolean controls

**Title:** Add `description` input to checkbox / radio / switch / checkbox-group / radio-group options.

**Motivation:** Many designs include label + smaller description. Today consumers compose externally with sibling muted text.

**Scope:** checkbox, radio, switch, checkbox-group option, radio-group option.

**Proposed API:**

```ts
@Input() description?: string;  // on checkbox / radio / switch
// On group option types:
{ value, label, description?, disabled? }
```

**Risk:** LOW.

**Priority:** **P2**.

---

## U15 — Card variant on radio-group + radio-group sibling for tabs/radio-cards

**Title:** Card-style radio buttons (icon + title + description).

**Motivation:** Pricing tier pickers, settings cards. Currently `<falcon-angular-tabs mode='radio-cards'>` covers this — but consumers conflate "tabs" with "radio-group". Adding `appearance: 'plain' | 'card'` on radio-group would clarify.

**Scope:** radio-group.

**Proposed API:**

```ts
@Input() appearance: 'plain' | 'card' = 'plain';
```

Combined with U14 description input — card variant becomes a polished tier picker.

**Risk:** LOW.

**Priority:** **P2**.

---

## U16 — Keyboard step on input-number

**Title:** Arrow Up/Down increment/decrement when `showButtons=false`.

**Motivation:** Browser native `<input type=number>` supports this. Falcon's input-number does not.

**Scope:** input-number.

**Proposed API:** Internal keyboard handler. No new public input needed; opt-in via `@Input() keyboardStep = true`.

**Risk:** LOW.

**Priority:** **P2**.

---

## U17 — `prefixIcon` / `suffixIcon` shorthand inputs

**Title:** Common-case shorthand for prefix/suffix icons.

**Motivation:** Adding a leading icon to an input today requires Shadow mode + slot. A simple `prefixIcon='email'` input + token-driven layout would cover 80% of cases.

**Scope:** input, email-field, phone-field, search-input (already has built-in).

**Proposed API:**

```ts
@Input() prefixIcon?: string;  // icon name from vendored Falcon icon font
@Input() suffixIcon?: string;
```

**Risk:** LOW. Additive.

**Priority:** **P2**.

---

## U18 — Tailwind path slot rendering (prefix/suffix on input)

**Title:** Bring `slot="prefix"` / `slot="suffix"` to `<falcon-input-tw>` (currently Shadow only).

**Motivation:** Tailwind path is the default — but it doesn't support slots. Consumers needing slot-based prefix/suffix are forced to Shadow mode.

**Scope:** input, possibly extend to dropdown / multi-select / combobox if slot-based custom content is needed.

**Proposed API:** Stencil-side `<slot name="prefix">` + `<slot name="suffix">` in `<falcon-input-tw>`. Angular wrapper template moves `<ng-content>` outside the `@if useTailwind` branch.

**Risk:** MEDIUM. Light DOM slot semantics differ from Shadow DOM — verify.

**Priority:** **P2**.

---

## Priority distribution

| Priority | Count |
|---|---|
| P1 | 8 |
| P2 | 9 |
| P3 | 0 |

(All P3-ish improvements were folded into per-component GAPS_AND_UPGRADES.md; this backlog focuses on cross-component reusable upgrades.)

## Ordering recommendation for execution

1. **U1** — biggest reusability win.
2. **U2** — easiest harmonization (alias + deprecate).
3. **U3** — method-proxy harmonization.
4. **U4** — CVA backfill (start with date-picker).
5. **U7** — pluggable password strength.
6. **U5** — verified state on email/phone.
7. **U6** — OTP resend cooldown.
8. **U12** — phone validator + virtualization.
9. **U8** — async option loading.
10. **U17** + **U18** — icon + slot shorthand on input family.
11. **U13** — form-field deprecation.
12. **U11** — range mode (milestone-sized).
13. **U9**, **U10**, **U14**, **U15**, **U16** — smaller P2 polish.
