# falcon-switch — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for boolean toggles where the switch metaphor (a live on/off state) is preferred to a checkbox.**

## Use this component for

- Feature toggles / standing preferences.
- Live row enable/disable in tables (the service-pricing row-visibility pattern).
- Quick on/off on cards / settings panels.

## Avoid this component for

- "I agree" / required form acceptance → `<falcon-angular-checkbox>`.
- A mutually-exclusive named choice → `<falcon-angular-radio>` / radio-group.
- A choice between two named things (Monthly/Yearly) → radio/dropdown (the `channel-pill` labels describe a *state*, not options).
- A tri-state / "unknown" → no native support.

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM; best for Studio token-runtime mutation, cross-framework parity, and Tailwind overrides via `rowClass`/`trackClass`/`labelClass`. Pick `variant`: `dot-knob` (default), `hidden-input` (compact), `channel-pill` (bordered pill). Switch to `useTailwind=false` (Shadow) only for style isolation.

## Required upgrades before wider use

None blocking. Most-common asks: **G3** (loading state for async-confirmed toggles) and **G8** (make `size` actually rescale the switch, or document it's label-only).

## Relationship to other components

- **Siblings** (same surface family): `<falcon-angular-checkbox>`, `<falcon-angular-radio>`.
- No composition relationship; no group component (G9).

## Exact rule for future implementation tasks

1. **Boolean toggle with a switch metaphor?** Use `<falcon-angular-switch>` with `useTailwind=true`.
2. **Pick `variant`** by context: `dot-knob` (default), `hidden-input` (dense), `channel-pill` (bordered). Add `[textOn]`/`[textOff]` to show the state in words (works in any variant).
3. **Bind via CVA** (`formControlName`/`ngModel`), OR `[checkedInput]` when a parent/table row owns the value — never both.
4. **Backend-confirmed toggle?** Drive `[checkedInput]` from the confirmed-state signal, gate `[disabled]` during the call, reconcile on success/failure (no built-in loading — G3).
5. **Set `state="error"` AND `errorText`** in tandem on validation failure.
6. **Need a bigger/smaller switch?** Override per-variant geometry tokens — `size` only changes the label font (G8).
7. **Parent-driven disable** → `[disabled]` (the setter input binds here, unlike radio's `disabledInput`).

---

## Dynamic capability assessment

### 1. What is static today?

- The three variant shapes (`dot-knob` / `hidden-input` / `channel-pill`) — fixed geometry per variant.
- The knob shape + native checkbox underneath.
- Required-asterisk character `*` (hardcoded).
- `__idSeq` prefix `falcon-asw-`.
- `size` does not rescale geometry (G8); `--falcon-switch-group-*` + `size-scale-*` are declared-but-unused.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **18 wrapper `@Input`s** — variant / label / helperText / errorText / size / state / required / name / value / inputId / textOn / textOff / `checkedInput` (CVA bypass) / `disabled` (CVA bypass) / useTailwind / rowClass / trackClass / labelClass.
- `[CODE]` **One `@Output`: `(valueChange)`** (boolean). Stencil `falcon-change`/`falcon-blur` bound internally; `falcon-focus` emitted but NOT bound (G4).
- Full CVA: `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState` (shares `disabled$` with the `disabled` input).

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` None — no label slot (G2). `textOn`/`textOff` are prop-driven inner text (any variant).

### 4. What is dynamic through token/theme overrides?

- Every visual axis via ~80 `--falcon-switch-*` tokens — per-variant track/knob geometry, state backgrounds/borders, focus halo, inner-label type, helper/error type. Host-class + per-instance scope via the `:where()` chain.
- Dark mode flips neutrals automatically. (Density `size-scale-*` is declared but inert — G8.)

### 5. What is dynamic through Tailwind classes?

- `rowClass`/`trackClass`/`labelClass` propagate into the `-tw` shell. Host `class=` flows to the wrapper element. Tailwind path only.

### 6. What is missing to make this component reusable across pages?

- A `loading` state (G3) — every async toggle reinvents disable-during-call.
- `size` that actually rescales (G8).
- Method proxies + label slot (G2), `errorMessage` alias (G1), `falcon-focus` re-emit (G4), the `handleChange` disabled guard (G5).

### 7. What capability should be added to the shared component (not a page hack)?

- `loading` (G3) + the `size` geometry fix (G8) — both are reinvented per consumer today.
- The method proxies + aliases (G1/G2/G4) + the disabled guard (G5).

### 8. What flags / options / templates / slots would make it better?

- `@Input() loading`, `onIcon`/`offIcon`, `errorMessage` alias, `@Output() falconFocus`, async `setFocus()`/`toggle()`, a label slot.

### 9. What is the safest upgrade path?

1. **Phase A (additive, zero risk):** add `errorMessage` alias, `@Output() falconFocus`, `setFocus()`/`toggle()` proxies, and the `handleChange` disabled guard (G5).
2. **Phase B:** add `loading` (G3) with a token-driven spinner.
3. **Phase C:** decide G8 — wire `size-scale-*` into the geometry (behavior change, verify all consumers) OR document label-only + add geometry-override guidance.

Phases A/B are additive. Phase C's "wire size into geometry" is a visual change → verify consumers first.

### 10. What is risky to change because other pages depend on it?

- The **three reflected `variant` attrs** — adding a 4th expands the reflected-attr CSS surface; existing `:host([variant='…'])` rules must stay.
- The **per-variant geometry tokens** — many consumers may rely on the exact 38×22 / 32×18 / 44×22 dimensions; wiring `size` into them (G8) changes rendered size.
- The **`value='on'` default** + the CVA boolean contract — consumers depend on the emitted value being a boolean.
- The default **`useTailwind=true`** — flipping changes DOM (Light ↔ Shadow) and breaks tests.
- The `disabled` / `checkedInput` bypass setters — depended on by table-row consumers (service-pricing).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06). Recommendation unchanged (READY). Counts corrected: 18 wrapper `@Input`s (incl. the `disabled` setter), 1 `@Output` (`valueChange`); `setFocus`/`toggle` proxies + `falcon-focus` + `loading` + the `size`-geometry fix remain GAPs.
🟢 RE-VERIFIED 2026-06-03 (W1-c VERIFY) — PASS. 18-input count (incl. `disabled` setter), boolean CVA contract, and the `disabled`-binds (vs radio's `disabledInput`) asymmetry all re-confirmed against live code. Recommendation unchanged (READY).
