# falcon-radio-group — DECISION

## Brain SK final recommendation

**STATUS: USABLE-WITH-CAVEATS.** It binds a single-value choice correctly via CVA, but (a) it orphans the Stencil group (two implementations in the lib) and (b) it ships no Light-DOM styling for its own classes, so consumers must hand-supply layout. Use it for ≤ ~8-option pick-one choices, always passing a layout `class` until GAPS G2 lands. The orphaned-Stencil / keyboard-a11y items (G0/G3) are queued for human decision.

## Use this component for

- A mutually-exclusive choice of ~2–8 options, all visible (the wallet balance/wallet-type pattern).
- Reactive Forms / `ngModel` single-value binding where you also control the layout `class`.

## Avoid this component for

- A true on/off boolean → `<falcon-angular-checkbox>` / `<falcon-angular-switch>`.
- One value from a long hidden list (> ~8) → `<falcon-angular-dropdown>`.
- Multiple values → `<falcon-angular-checkbox-group>` / `<falcon-angular-multi-select>`.
- Icon+title+description card pickers → `<falcon-angular-tabs mode='radio-cards'>`.
- Any scenario where you need the component to be fully self-styled out-of-the-box (G2).

## Preferred variant / render path

**`useTailwind=true` (default)** — forwarded to each child radio. There is no Shadow render path for the *group itself* (the Stencil group is orphaned); `useTailwind` only selects the child radios' render path.

## Required upgrades before wider use

- For confidence at scale: **G0** (resolve the orphaned Stencil group), **G2** (Light-DOM CSS for the wrapper classes), **G3** (verify keyboard nav). These are queued, not blocking the existing single consumer — but a new consumer should expect to supply layout `class` and verify keyboard behavior.

## Relationship to other components

- **Composes:** `<falcon-angular-radio>` (drives each via `[name]` + `[checkedInput]` + `(valueChange)`).
- **Alternatives:** `<falcon-angular-dropdown>` (long lists), `<falcon-angular-checkbox-group>` (multi-value), `<falcon-angular-tabs mode='radio-cards'>` (card picker).
- **Orphaned siblings:** the Stencil `<falcon-radio-group>` / `<falcon-radio-group-tw>` (not rendered by Angular).

## Exact rule for future implementation tasks

1. **Pick-one of ~2–8 options?** Use `<falcon-angular-radio-group>` with `[options]` + CVA.
2. **Supply a layout `class`** (arbitrary-variant utilities targeting `.falcon-radio-group-options`) until G2 lands.
3. **Bind via** `formControlName` / `ngModel` / `[selectedValue]`+`(selectedValueChange)` — NOT `[(selectedValue)]`.
4. **Align option `value` types** with the model (`===` comparison).
5. **Use `groupLabel` + `errorText`** (NOT `errorMessage`).
6. **Per-option disable** via `option.disabled`; whole-group via `[disabled]`.
7. **Verify keyboard nav** at runtime before claiming a11y-compliant (G3).

---

## Dynamic capability assessment

### 1. What is static today?

- Options are label-only (no description/icon).
- No card/boxed appearance.
- The Angular wrapper renders a fixed `<div>` structure with un-backed class names.
- The Stencil group + its CSS/tokens are orphaned.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **11 wrapper `@Input`s** — options / selectedValue (setter) / orientation / groupLabel / helperText / errorText / size / disabled / required / useTailwind / name.
- `[CODE]` **One `@Output`: `(selectedValueChange)`**.
- Full CVA (single value): `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` None — no per-option template (G1).

### 4. What is dynamic through token/theme overrides?

- `--falcon-radio-group-*` tokens exist (label/helper/error/required/gap/accent) — but on the Angular path most only take effect once the wrapper classes get a backing rule (G2). The child radios' `--falcon-radio-*` tokens DO render.

### 5. What is dynamic through Tailwind classes?

- Host `class=` flows to the `<div>` — and is currently *required* to supply layout (arbitrary-variant utilities target `.falcon-radio-group-options`).

### 6. What is missing to make this component reusable across pages?

- Self-styling of the wrapper classes (G2).
- A resolution of the orphaned Stencil group (G0).
- Per-option description/icon (G1/G7), `errorMessage` alias (G4), unified option type (G5), card appearance (G6), verified keyboard nav (G3).

### 7. What capability should be added to the shared component (not a page hack)?

- The Light-DOM CSS (G2) — every consumer currently re-supplies layout.
- The orphaned-group resolution (G0) — removes the two-implementation risk.

### 8. What flags / options / templates / slots would make it better?

- `appearance='card'`, `description`/`iconUrl` option fields, an item `ng-template`, an `errorMessage` alias, a single SSOT `FalconRadioGroupOption`.

### 9. What is the safest upgrade path?

1. **Phase A (additive, low risk):** add `.component.css` styling the wrapper classes from `--falcon-radio-group-*` tokens (G2) + an `errorMessage` alias (G4) + unify the option type (G5). Verify keyboard nav (G3).
2. **Phase B (queued, human decision):** resolve G0 — delete the orphaned Stencil group OR repoint the wrapper to render it (public-render-path change).
3. **Phase C:** add per-option description/template (G1) and `appearance='card'` (G6).

### 10. What is risky to change because other pages depend on it?

- The **`===` selection equality** — switching to deep/loose equality would break consumers that rely on strict primitive matching.
- The **auto-generated `name`** scheme — anything keying off the group `name` (Cypress, CSS) would break.
- The **default `useTailwind=true`** forwarding — flipping it changes the child radios' DOM.
- Resolving **G0** (repoint to Stencil group) would change the rendered DOM structure + the class names consumers target with arbitrary-variant Tailwind — that is why it is queued, not auto-fixed.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06). Recommendation changed to USABLE-WITH-CAVEATS (was "READY for basic radios") to reflect the orphaned-Stencil-group + missing-Light-DOM-CSS findings. Counts: 11 `@Input`s, 1 `@Output`; `selectedValue` is one-way input + output. G0/G2/G3 queued for human decision.
