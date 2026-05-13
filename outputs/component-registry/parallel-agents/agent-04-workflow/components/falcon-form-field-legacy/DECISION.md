# falcon-form-field (LEGACY) — DECISION

## Brain SK final recommendation

### Status
- **LEGACY-IN-USE.** Bespoke Angular standalone component (Wave 22).
- Roadmap: promote to Falcon UI core OR deprecate in favor of per-input label/error Inputs.

### Use this component for
- Existing wizard step templates that already wrap inputs with `<falcon-form-field>`.
- New code that wants a consistent label+hint+error shell around a control without rich built-in labeling.

### Avoid this component for
- Wrapping `<falcon-angular-input>` / `<falcon-angular-dropdown>` etc. that ALREADY accept `label` / `errorMessage` / `helperText` Inputs — prefer the per-input Inputs to avoid double-painting.

### Preferred variant / render path
- N/A — pure Angular bespoke.

### Required upgrades before wider use
1. **Decide:** promote to `<falcon-angular-form-field>` (token + dual-render) OR deprecate.
2. **If promoting:** add full token contract, auto-link label `for=`, hint+error coexistence flag, tooltip slot, labelText fallback.
3. **Delete SCSS** during the migration (P0).

### Relationship to other components
- Wraps Falcon UI inputs that already have built-in label/error UX — see item above re: double-painting.
- Used heavily in Add Client / Add User wizards.

### Exact rule for future implementation tasks
> "For new code, prefer the per-input `label` / `helperText` / `errorMessage` Inputs on Falcon UI inputs. Use `<falcon-form-field>` only when the inner control lacks these built-in (rare). Migration to a Falcon UI core `<falcon-angular-form-field>` is the long-term plan."

---

## Dynamic capability assessment

### 1. What is static today?
- Hint and error cannot coexist.
- No tooltip / info-circle next to label.
- Label is i18n key only (no plain-string fallback).
- Label `for=` not auto-linked.

### 2. What is already dynamic through inputs/outputs?
- `label`, `required`, `hint`, `errorKey`, `errorParams`, `disabled`, `invalid`.

### 3. What is already dynamic through slots / ng-template?
- Default `<ng-content>` for the control body.

### 4. What is dynamic through token / theme overrides?
- _Nothing._ Bespoke SCSS.

### 5. What is dynamic through Tailwind classes?
- Outer layout context.

### 6. What is missing?
- Auto-link `for=` (P1).
- Hint+error coexistence (P2).
- Tooltip slot (P2).
- `labelText` fallback (P3).

### 7. What capability should be added to the shared component vs a one-off page hack?
- Promotion to Falcon UI core is the answer — single shared component.

### 8. What flags / options / templates / slots would make it better?
- `inputId?: string` auto-link.
- `showHintOnError?: boolean`.
- `tooltipKey?: string`.
- `labelText?: string`.

### 9. What is the safest upgrade path?
1. Decide promote vs deprecate.
2. If promote: design `<falcon-angular-form-field>` + token contract; migrate consumers; delete legacy.
3. If deprecate: migrate consumers to use per-input labels; delete legacy.

### 10. What would be risky to change because other pages depend on it?
- Many wizard steps use this. Changing visuals or removing the double-painting may shift layout.
- Consumers expecting `.fff-error` class to be added by the wrapper — if the SCSS is rewritten, the class name may change.
