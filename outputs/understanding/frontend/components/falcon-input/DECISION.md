# falcon-input — DECISION

## Brain SK final recommendation

**STATUS: READY (flagship reference). Use for all single-line text-entry fields in new Angular code.**

## Use this component for

- Generic free-text entry (text / email / search / tel / url).
- Username, account name, first name, last name, ID-as-string, free-form code entry without mask.
- Any input that needs a Falcon label / helper / error contract.
- Type=password ONLY when reveal toggle + strength meter are NOT required. Otherwise prefer `<falcon-angular-password>`.
- As the composing primitive inside higher-level components: `<falcon-angular-password>`, `<falcon-angular-search-input>` already do this.

## Avoid this component for

- Numeric step + decimals + format → `<falcon-angular-input-number>`.
- Email with verify button → `<falcon-angular-email-field>`.
- Phone with country + dial code → `<falcon-angular-phone-field>`.
- Multi-line → `<falcon-angular-textarea>`.
- In-grid numeric cell → `<falcon-angular-grid-input>`.
- OTP code entry → `<falcon-angular-otp>`.
- Search with debounce/clear → `<falcon-angular-search-input>`.

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM render path. Best for:

- Studio token-runtime mutation.
- Cross-framework parity with React + Vue.
- Tailwind utility overrides via `class=`, `wrapperClass`, `inputClass`, `labelClass`.

**`useTailwind=false`** (Shadow path) — switch to it ONLY when:

- You need `slot="prefix"` / `slot="suffix"` (Tailwind path doesn't render slots — G1).
- You need `borderless` / `shadowless` / `flat` / `noFocusRing` feature toggles (Tailwind path silently no-ops — G5).
- You need style isolation from a noisy parent stylesheet.

## Required upgrades before wider use

None. The component is production-quality for the majority of form needs today. The 9 gaps documented in `GAPS_AND_UPGRADES.md` are improvements, not blockers.

## Relationship to other components

- **Composed BY:** `<falcon-angular-password>` (adds reveal toggle + strength meter), `<falcon-angular-search-input>` (adds clear-X + debounce, sets `variant="search"`).
- **Sibling specialists** (do not compose, but share the same surface API): `<falcon-angular-input-number>`, `<falcon-angular-textarea>`, `<falcon-angular-email-field>`, `<falcon-angular-phone-field>`, `<falcon-angular-grid-input>`, `<falcon-angular-otp>`.
- **Sometimes wrapped BY:** legacy `<falcon-form-field>` (legacy bespoke labeled wrapper). New code should use the built-in `label` input instead of wrapping.

## Exact rule for future implementation tasks

1. **Single-line free-text field?** Use `<falcon-angular-input>` with `useTailwind=true` (default).
2. **Add `label` + optional `helperText` + `errorMessage`** instead of wrapping in `<falcon-form-field>`.
3. **Bind via Reactive Forms** (`formControlName`) or `[(ngModel)]`. Never `[value]` directly.
4. **Set `state="error"` AND `errorMessage`** in tandem when validation fails.
5. **Use per-instance token overrides** (host class + CSS file mutating `--falcon-input-*`) when visual tweaks are needed. Never hardcode hex / px.
6. **Use Tailwind utilities on `class=` / `wrapperClass`** for responsive sizing / layout only.
7. **Switch to `useTailwind=false`** if you need prefix/suffix slots OR the four Shadow-only feature toggles.

---

## Dynamic capability assessment

### 1. What is static today?

- Built-in clear-button SVG (hardcoded path).
- Built-in label / helper / error markup structure.
- Required-asterisk character `*` (hardcoded; no i18n hook).
- `__idSeq` autogen ID prefix `falcon-ai-` / `falcon-input-` / `falcon-input-tw-`.
- The four Shadow-only feature toggles are not honored by the Tailwind path.

### 2. What is already dynamic through inputs/outputs?

- 27 wrapper `@Input`s — every behavior + visual axis (type / size / state / variant / appearance / borderless / shadowless / flat / noFocusRing / readonly / required / clearable / etc.).
- 5 outputs (`falcon-input`, `falcon-change`, `falcon-clear`, `falcon-blur`, plus `falcon-focus` via raw Stencil tag).
- Full CVA support: `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`.

### 3. What is already dynamic through slots / ng-template?

- Shadow path: `slot="prefix"` + `slot="suffix"` via `<ng-content select="[slot=prefix]">`. Tailwind path: NONE (G1).
- No `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?

- Every visual axis (~70+ `--falcon-input-*` tokens). Host-class scope plus per-instance scope both supported via the `:where()` selector chain.
- Theme dark mode flips colors / shadows automatically.
- Density presets shift heights via `--falcon-density-input-*` aliases.

### 5. What is dynamic through Tailwind classes?

- Host `class=` flows to wrapper element (layout / responsive / spacing).
- `wrapperClass` / `inputClass` / `labelClass` propagate into the Tailwind shell.
- Tailwind utilities can override anything the tokens drive, but discipline says — override tokens instead.

### 6. What is missing to make this component reusable across pages?

- Prefix/suffix slots on Tailwind path (G1).
- Prefix/suffix ICON inputs (G8) — most common need today.
- Programmatic `setFocus()` / `clear()` on Angular wrapper (G2).
- Surface `clearAriaLabel` / `autoFocusOnMount` / `spellcheckMode` (G3).
- `falcon-focus` event re-emission (G4).
- Feature-toggle parity on Tailwind path (G5).
- Optional input mask (G7).

### 7. What capability should be added to shared component (not page hack)?

- Slot + icon inputs (G1 + G8) — every page that wants a search glyph will reinvent this.
- Focus / clear method proxies (G2) — pages currently reach into the DOM.
- Token-driven feature toggles for Tailwind path (G5) — necessary for full parity.

### 8. What flags / options / templates / slots would make it better?

- `@Input() prefixIcon?: string` + `@Input() suffixIcon?: string` (icon name from vendored Falcon icon font).
- `@Input() mask?: string` for masked input.
- `@Input() loading?: boolean` to show a token-driven spinner in the suffix slot.
- `@Output() falconFocus` Angular wrapper event.
- Async method proxies: `setFocus()`, `clear()`.

### 9. What is the safest upgrade path?

1. **Phase A (additive, zero risk):** add Angular wrapper @Inputs for `clearAriaLabel`, `autoFocusOnMount`, `spellcheckMode`, `prefixIcon`, `suffixIcon`, `loading`. Forward as `[attr.*]`. Add `@Output() falconFocus`. Add `setFocus()` / `clear()` method proxies.
2. **Phase B (Stencil-side):** add `<slot name="prefix">` and `<slot name="suffix">` to `<falcon-input-tw>`. Update Angular wrapper template to project `<ng-content>` outside the `@if`.
3. **Phase C (Tailwind helper):** thread feature toggles into `falconInputWrapperClasses()` so Tailwind path honors `borderless` / `shadowless` / `flat` / `noFocusRing`.
4. **Phase D (mask):** introduce `FalconInputMaskDirective` (preferred over baking into the component).

All phases are additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- The default `value` initialization to `''` (empty string, not `null`). Many consumers depend on this via CVA's `writeValue(null)` → `''` coercion.
- The auto-ID prefix scheme — anything keying off DOM IDs (Cypress, e2e tests) would break.
- The four reflected Shadow-only attrs (`borderless` / `shadowless` / `flat` / `noFocusRing`) — any CSS in the Studio depending on `:host([borderless])` would need updating.
- `<falcon-form-field>` legacy nesting pattern — existing wizards use this. Do NOT remove `<falcon-form-field>` support before migrating wizards.
- The default `useTailwind=true` switch — flipping it would change DOM structure (Light DOM ↔ Shadow DOM) and break tests.
