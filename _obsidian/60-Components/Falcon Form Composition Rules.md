---
type: rules
cluster: components
layer: composition
component: forms
scope: angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Form Composition Rules ***
*** Angular-first — deep rules for every form-containing composition ***
*** Read before building any form, wizard step, or edit panel ***

# Falcon Form Composition Rules

> **Purpose:** Deep rules for composing Falcon form controls (`<falcon-angular-input>`, dropdown, phone, email, date picker, uploader, etc.) with reactive form validation, error messages, grid layout, submit/cancel footer, disabled/loading states, and CVA compliance.
>
> **Matrix entries:** [[Falcon Component Combination Matrix]] → C03 (Form + Validation + Footer), C05 (Stepper + Forms + Summary)
> **Guardrail:** [[Falcon Light Mode Visual Baseline]] — input height 38 px, label text 13 px `text-falcon-neutral-700`

---

## 1 · Form Architecture

**Always use Reactive Forms — never Template-driven:**

```typescript
// Component class
form = this.fb.group({
  name:        ['', [Validators.required, FALCON_VALIDATIONS.startWithLetter, FALCON_VALIDATIONS.lettersOnly]],
  email:       ['', [Validators.required, Validators.email]],
  phone:       ['', [Validators.required]],
  countryCode: [null, Validators.required],
  birthDate:   [null],
});
```

**Rules:**
- Import `FormBuilder` via `inject(FormBuilder)` — never `new FormGroup()`
- Validator functions come from `FALCON_VALIDATIONS` registry first — check the registry before writing a custom validator
- Do NOT use `[(ngModel)]` anywhere — it is forbidden in Falcon Angular workspace
- Form group is defined at class level, not inside `ngOnInit`

---

## 2 · Control-to-Wrapper Mapping

| Data type | Falcon wrapper | Notes |
|---|---|---|
| Short text | `<falcon-angular-input>` | Default — accountName, username, city |
| Long text | `<falcon-angular-textarea>` | Bio, description, notes |
| Password | `<falcon-angular-password>` | NEVER `<falcon-angular-input type="password">` |
| Email | `<falcon-angular-email-field>` | Preferred over plain input + email validator |
| Phone / mobile | `<falcon-angular-phone-field>` | Emits E.164 string — do NOT try to parse the value |
| Number / quantity | `<falcon-angular-input-number>` | Price, quantity, thresholds |
| Single select | `<falcon-angular-dropdown>` | FK selects, enum selects |
| Multi-select | `<falcon-angular-multi-select>` | Multiple FK values |
| Boolean toggle | `<falcon-angular-toggle>` | Active/inactive, feature flags |
| Checkbox single | `<falcon-angular-checkbox>` | Agreement, opt-in |
| Date | `<falcon-angular-date-picker>` | **CVA GAP** — no `formControlName` yet; use `(dateChange)` + manual `form.patchValue` |
| Calendar | `<falcon-angular-calendar>` | **CVA GAP** — same manual workaround |
| File upload | `<falcon-angular-uploader>` | Generic multi-file |
| Photo upload | `<falcon-angular-uploader>` (photo variant) | 1 MiB cap; inline size error |

---

## 3 · CVA Rules

> [!warning] CVA Gaps (P1-04)
> `<falcon-angular-date-picker>`, `<falcon-angular-calendar>`, `<falcon-angular-search-input>`, and `<falcon-angular-grid-input>` do NOT implement ControlValueAccessor. They cannot use `formControlName`. Use the manual `(eventOutput)` + `form.patchValue()` workaround until the CVA upgrade lands.

**For CVA controls (everything except the 4 gaps above):**
```html
<falcon-angular-input
  formControlName="name"
  [label]="'Full Name'"
  [required]="true"
  [errorMessage]="nameError()" />
```

**For non-CVA controls (date picker etc.):**
```html
<falcon-angular-date-picker
  [value]="form.value.birthDate"
  (dateChange)="form.patchValue({ birthDate: $event })" />
```

---

## 4 · Label & Error Message Rules

```typescript
// Error helper in component
nameError = computed(() => {
  const ctrl = this.form.get('name');
  if (!ctrl?.touched) return '';
  if (ctrl.errors?.['required']) return 'Name is required';
  if (ctrl.errors?.['startWithLetter']) return 'Must start with a letter';
  return '';
});
```

**Rules:**
- `[label]` is ALWAYS provided — never an unlabeled field in a form
- `[required]` shows the red asterisk — use it for all required fields
- `[errorMessage]` only shows when non-empty — bind it to a computed signal that returns `''` when untouched
- Do NOT use `*ngIf` on a sibling `<span class="error">` — use `[errorMessage]` input on the wrapper
- Labels are rendered by the wrapper component — never add a manual `<label>` above a Falcon input

---

## 5 · Grid Layout

**Standard 2-column layout (detail panel, drawer, settings):**
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <falcon-angular-input formControlName="firstName" [label]="'First Name'" />
  <falcon-angular-input formControlName="lastName" [label]="'Last Name'" />
  <falcon-angular-dropdown formControlName="country" [label]="'Country'" [options]="countries()" />
  <falcon-angular-dropdown formControlName="city" [label]="'City'" [options]="cities()" />
</div>
```

**Single-column layout (wizard steps, narrow drawers):**
```html
<div class="flex flex-col gap-3">
  <falcon-angular-input formControlName="accountName" [label]="'Account Name'" />
  <falcon-angular-email-field formControlName="email" [label]="'Email'" />
  <falcon-angular-phone-field formControlName="phone" [label]="'Phone'" />
</div>
```

**Rules:**
- 2-column grid on `md:` breakpoint — single column on mobile
- Gap is `gap-4` (16 px) for 2-column, `gap-3` (12 px) for single-column
- Full-width fields (textarea, file uploader, multi-select) span both columns: `col-span-2`
- Never use fixed `width` on individual fields — let the grid control widths

---

## 6 · Dropdown / Select Rules

```html
<falcon-angular-dropdown
  formControlName="countryCode"
  [label]="'Country'"
  [options]="countries()"
  [searchable]="true"
  [loading]="countriesLoading()"
  [errorMessage]="countryError()"
  (change)="onCountryChange($event)" />
```

**Rules:**
- `[options]` must be typed as `FalconDropdownOption[]` (shape: `{label: string, value: any}`)
- `[searchable]="true"` for any dropdown with > 10 options (country, city lookups)
- Do NOT use raw `<select>` — not styled, not accessible, breaks Falcon token system
- For cascading selects (country → city): listen to `(change)` on the parent, fetch child options, update child `[options]`
- For role dropdowns: filter to the correct scope (system roles vs tenant roles) — role-scope bug was fixed 2026-05-19
- `[disabled]="true"` on `<falcon-angular-dropdown>` uses the `[disabled]` property, NOT `[attr.disabled]` — Stencil wrapper rule

---

## 7 · Phone Field Rules

```html
<falcon-angular-phone-field
  formControlName="phone"
  [label]="'Phone Number'"
  [defaultCountryCode]="'+962'"
  [errorMessage]="phoneError()" />
```

**Rules:**
- Always bind `formControlName` — this wrapper DOES implement CVA
- The emitted value is E.164 (e.g., `+962791234567`) — never attempt to parse or strip the prefix
- `[defaultCountryCode]` should match the tenant's primary country — do NOT hardcode `+1`
- Phone field does NOT include a separate country code dropdown — the flag + code is built into the component

---

## 8 · File / Photo Uploader Rules

```html
<!-- Photo uploader (profile pictures) -->
<falcon-angular-uploader
  [variant]="'photo'"
  [maxBytes]="1048576"
  [value]="form.value.profilePicture"
  (upload)="onPhotoUpload($event)" />
```

**Rules:**
- Default max size: **1 MiB** (1,048,576 bytes) — PRD Q-UM-05/BR-UM-48 cap; do NOT override to 2 MiB
- Oversized file: inline red-border error inside the uploader card — auto-clear after 6 s (no toast)
- Wire field name exactly as `profilePictureInfo` for backend compatibility — NOT `profilePictureImageInfo` (mismatch was fixed 2026-05-18)
- File uploader cancel event does NOT close the wizard — cancel closes the OS file picker only (Angular @Output/native-event collision — fixed 2026-05-18)
- Generic multi-file uploader: use `<falcon-angular-uploader [variant]="'generic'">` — different component variant

---

## 9 · Async Validation Indicator

```html
<!-- Async validation spinner on accountName -->
<falcon-angular-input
  formControlName="accountName"
  [label]="'Account Name'"
  [pending]="accountNamePending()"
  [errorMessage]="accountNameError()" />
```

```typescript
// Async validator pattern
accountNamePending = computed(() =>
  this.form.get('accountName')?.pending ?? false
);
```

**Rules:**
- `[pending]="true"` shows an inline spinner inside the input suffix slot
- Async validators only fire when the field is `touched` — do NOT hide the pending state behind an explicit blur gate (wizard async-validation bug — fixed 2026-05-19)
- Currently supported on: `accountName` (Add Client Step 1) and `username` (Add User Step 5)
- Do NOT show the async spinner on every field — only on fields with server-side uniqueness checks

---

## 10 · Submit / Cancel Footer

```html
<div class="flex items-center justify-end gap-2 p-4 border-t border-falcon-neutral-200 flex-shrink-0">
  <falcon-angular-button
    variant="secondary"
    size="md"
    [disabled]="isSaving()"
    (click)="onCancel()">
    Cancel
  </falcon-angular-button>
  <falcon-angular-button
    variant="primary"
    size="md"
    [disabled]="form.invalid || isSaving()"
    [loading]="isSaving()"
    (click)="onSave()">
    {{ isSaving() ? 'Saving...' : 'Save' }}
  </falcon-angular-button>
</div>
```

**Rules:**
- Footer is a sibling below the form body — `flex-shrink-0` prevents it from being compressed
- `border-t border-falcon-neutral-200` separates footer from body — always present
- Save is `[disabled]` when `form.invalid OR isSaving()` — both conditions must be checked
- Cancel during an in-flight save: `[disabled]="isSaving()"` on Cancel too — prevents race condition
- In wizards: Back/Next buttons replace Save/Cancel — Back is on the left edge, Next on the right

---

## 11 · Disabled / Read-Only States

**Disabled form (view mode):**
```typescript
// Disable all controls for read-only mode
setReadOnly(readonly: boolean): void {
  if (readonly) this.form.disable();
  else this.form.enable();
}
```

**Disabled individual field:**
```typescript
this.form.get('city')?.disable();
```

**Rules:**
- Use `FormGroup.disable()` / `FormControl.disable()` — never bind `[disabled]="true"` on each wrapper manually
- Disabled fields are visually greyed out via Falcon token `--falcon-input-disabled-bg` — do NOT add custom opacity
- `form.value` on a disabled group returns only enabled controls — use `form.getRawValue()` to include disabled fields in the submit payload

---

## 12 · Unsaved Changes Guard

```typescript
// In parent component:
hasUnsavedChanges = computed(() => this.form.dirty);

// Register with service:
constructor() {
  this.unsavedChangesService.register(() => this.hasUnsavedChanges());
}
```

**Rules:**
- `FalconUnsavedChangesService` is the single service for all unsaved-changes confirmation — not a per-component dialog
- Guard fires: switching tabs, clicking another tree node, clicking router link, closing drawer
- After successful save: call `this.form.markAsPristine()` — this deactivates the guard
- After cancel: call `this.form.reset(originalValues)` to restore pristine state

---

## Anti-Patterns

| Anti-Pattern | Correct |
|---|---|
| `<input type="text" class="form-control">` | `<falcon-angular-input>` |
| `<input type="password">` | `<falcon-angular-password>` |
| `[(ngModel)]="field"` | `formControlName="field"` |
| `new FormGroup(...)` in ngOnInit | Class-level `form = this.fb.group(...)` |
| Manual `<label>` above an input | `[label]="'...'` on the wrapper |
| `<span class="error">{{ errorMsg }}</span>` beside input | `[errorMessage]="errorSignal()"` on wrapper |
| Custom whitespace validator | Not in PRD — removed 2026-05-19 |
| `[attr.disabled]="true"` on Stencil wrapper | `[disabled]="true"` (property binding) |
| Hardcoded 2 MiB uploader limit | `[maxBytes]="1048576"` (1 MiB) |

---

## Cross-Links

- [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Password]] · [[Falcon Phone Field]] · [[Falcon Email Field]]
- [[Falcon Date Picker]] · [[Falcon Uploader]] · [[Falcon Toggle]] · [[Falcon Checkbox]]
- [[Falcon Component Combination Matrix]] → C03, C05
- [[Falcon Component Composition Playbook]] → Composition 3, 5
- [[Falcon Popup and Drawer Composition Rules]] — drawer wraps forms
- [[Shared Directives]] — 12 form/mask/validator/async directives
- [[Falcon Component Gap Registry]] → P1-04 (CVA gaps), P1-08 (async indicator)
- [[Falcon New Page Implementation Checklist]] — pre-merge gate

## Tags

#type/rules #layer/frontend #layer/composition #component/forms #status/active

## Hubs

- [[Falcon Input]] · [[COMPONENT_INDEX]] · [[Falcon Component Composition Playbook]]
