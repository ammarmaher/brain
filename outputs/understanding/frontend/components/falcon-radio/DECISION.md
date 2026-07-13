# falcon-radio — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for a single mutually-exclusive option.** For multi-option choices the intent is "use a group", but note the Angular `<falcon-angular-radio-group>` ships no Light-DOM CSS for its own classes (see that dossier) — so production multi-option code today typically lays out `<falcon-angular-radio>` directly (shared `name`) or via the `wb-radio-pill` wrapper.

## Use this component for

- A single circular option bound to a `value`, almost always part of a small exclusive set.
- One radio per card/pill in a non-uniform layout (drive `checkedInput`/`disabledInput` from the parent).
- The composing primitive inside the radio-group + app wrappers like `wb-radio-pill`.

## Avoid this component for

- A true on/off boolean → `<falcon-angular-switch>` / `<falcon-angular-checkbox>`.
- One value from a long hidden list → `<falcon-angular-dropdown>`.
- A segmented button-style single choice (no direct Falcon equivalent — raise a GAP).

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM. Best for Studio token-runtime mutation, cross-framework parity, and Tailwind overrides via `rowClass`/`markClass`/`labelClass`. Switch to `useTailwind=false` (Shadow) only for style isolation from a noisy parent stylesheet (the radio has no Shadow-only feature toggles).

## Required upgrades before wider use

None. Production-quality today. The gaps in `GAPS_AND_UPGRADES.md` are improvements, not blockers.

## Relationship to other components

- **Composed by:** `<falcon-angular-radio-group>` (which `@for`s radio children) and the app-level `wb-radio-pill`.
- **Siblings** (same surface family, do not compose): `<falcon-angular-checkbox>`, `<falcon-angular-switch>`.

## Exact rule for future implementation tasks

1. **One exclusive option?** Use `<falcon-angular-radio>` with `useTailwind=true`.
2. **Always set a meaningful `value`** per radio; share `name` across an exclusive set.
3. **Parent-driven check/disable** → `[checkedInput]` / `[disabledInput]` (NOT `[disabled]`). **Form-bound** → `formControlName`/`ngModel` whose value matches the radio's `value`.
4. **Set `state="error"` AND `errorText`** together when validation fails.
5. **Read the newly-checked value** on `(valueChange)` — never wait for an un-check event.
6. **Multi-option?** Prefer a group, but verify the radio-group's Light-DOM styling gap (see that dossier) before relying on it; otherwise lay radios out directly with shared `name`.

---

## Dynamic capability assessment

### 1. What is static today?

- The border-width-5 dot mechanism (the "dot" is the thick teal border, not an element).
- The native `<input type="radio">` underneath + visually-hidden treatment.
- Required-asterisk character `*` (hardcoded; no i18n hook).
- `__idSeq` autogen prefix `falcon-arad-`.
- `success`/`warning` states are accepted but visually inert (G6).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **15 wrapper `@Input`s** (2026-06-03 recount, B06-VERIFY — the 15 names enumerated here, grep-confirmed) — label / helperText / errorText / size / state / required / name / value / inputId / `checkedInput` (CVA bypass) / `disabledInput` (CVA bypass) / useTailwind / rowClass / markClass / labelClass.
- `[CODE]` **One `@Output`: `(valueChange)`** (boolean). Stencil `falcon-change`/`falcon-blur` are bound internally; `falcon-focus` is emitted by the tags but NOT bound (G3).
- Full CVA: `writeValue` (group-value comparison), `registerOnChange`, `registerOnTouched`, `setDisabledState` (shares the `disabled` signal with `disabledInput`).

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` None — the wrapper template is a pure attribute-forwarding tag-switcher; the Stencil tags render `{this.label}` text (no label `<slot>`). G5.

### 4. What is dynamic through token/theme overrides?

- Every visual axis via ~50 `--falcon-radio-*` tokens (mark size, border widths incl. the checked-dot width, colors, focus halo, helper/error type). Host-class + per-instance scope both work via the `:where()` chain.
- Dark mode flips neutrals automatically; density category is declared but inert.

### 5. What is dynamic through Tailwind classes?

- `rowClass` / `markClass` / `labelClass` propagate into the `-tw` shell (`*-extra-class`). Host `class=` flows to the wrapper element (layout/spacing). Tailwind path only.

### 6. What is missing to make this component reusable across pages?

- Method proxies `setFocus()` / `select()` (G2).
- `errorMessage` alias (G1) + `disabled` alias to match switch (G4).
- `falcon-focus` re-emission (G3).
- A `description` / rich-label slot (G5).

### 7. What capability should be added to the shared component (not a page hack)?

- The method proxies + the `disabled`/`errorMessage` aliases (G1/G2/G4) — small, additive, removes per-page DOM reach-ins (the wb-radio-pill `styles:` rule is one such reach-in).

### 8. What flags / options / templates / slots would make it better?

- `@Input() description?`, `@Input() iconUrl?`, `@Output() falconFocus`, async `setFocus()`/`select()`.

### 9. What is the safest upgrade path?

1. **Phase A (additive, zero risk):** add `errorMessage` + `disabled` alias inputs, `@Output() falconFocus`, and `setFocus()`/`select()` proxies (tag the inner element with a ref).
2. **Phase B:** implement or remove `success`/`warning` visuals (decide first).
3. **Phase C:** add a `description` input / label slot.

All phases are additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- The **border-width-5 dot mechanism** — any redesign to a real inner-dot element risks visual regression across every consumer + the token contract (`--falcon-radio-border-width-checked`).
- The **group-valued CVA contract** (`writeValue` compares to `value`) — many consumers (and the radio-group) depend on it; changing to a boolean toggle would break them.
- The `checkedInput` / `disabledInput` bypass setters — depended on by the radio-group and `wb-radio-pill`.
- The default `useTailwind=true` — flipping it changes DOM (Light ↔ Shadow) and would break consumers' arbitrary-variant selectors that target the Light-DOM structure.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06). Recommendation unchanged (READY). Counts corrected: 1 `@Output` (`valueChange`); `setFocus`/`select` proxies + `falcon-focus` re-emit + aliases remain GAPs.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — **`@Input` total corrected 17 → 15** (grep-confirmed, incl. the two setters `checkedInput`/`disabledInput`). Recommendation unchanged (READY).
