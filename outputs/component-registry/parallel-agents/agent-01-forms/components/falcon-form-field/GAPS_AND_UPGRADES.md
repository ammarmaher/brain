# falcon-form-field — GAPS AND UPGRADES

## Missing capabilities

### G1 — SCSS file exists (violates no-SCSS rule) (P1)

`falcon-form-field.component.scss` exists. Per project rules (`feedback_no_inline_styles_tokens_only.md`, `project_brain_skills_primeng_purge.md`), component CSS rules must NOT live in SCSS. Migrate to Tailwind utilities + tokens.

**Recommended fix:** rewrite template + tokens; delete SCSS.

### G2 — Label not programmatically associated with inner control (P1)

Native `<label>` rendered by this wrapper does NOT have `for=` pointing to the inner control's `id`. Screen readers may not announce the label when the slotted input is focused.

**Recommended fix:** require the inner control to expose an `inputId` and pass it as `[for]` on the label. OR auto-generate an id and bridge via signal.

### G3 — Component duplicates label rendering when wrapping Falcon inputs (P1)

`<falcon-form-field label="X">` + `<falcon-angular-input label="X">` will render TWO labels. Consumers must remember to only set on one.

**Recommended fix:** document the migration path. Once all wizard templates are updated, deprecate `<falcon-form-field>` entirely.

### G4 — Required asterisk + `aria-required` not synced (P2)

Wrapper renders asterisk based on `required` input, but `aria-required` lives on the slotted control. Consumer must set both.

**Recommended fix:** during migration to built-in labels, this becomes moot.

### G5 — No way to bind error state visual to slotted control's actual state (P2)

`hasError` is derived from `errorKey` only — it doesn't track the slotted control's `state="error"`.

### G6 — Hint vs helperText naming inconsistency (P3)

Wrapper uses `hint`; Falcon inputs use `helperText`.

## Missing accessibility

- See G2.
- Verify `aria-describedby` joins hint / error IDs — likely NOT set automatically.

## Missing tests

- Limited tests. Add coverage for hasError computed signal + content projection.

## Missing Tailwind / token parity

- N/A — Angular-only component.

## Performance risks

- None.

## Visual / interaction risks

- Style drift between SCSS-driven wrapper and Tailwind-driven children.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Migrate SCSS → Tailwind | P1 |
| G2 | Programmatic label association | P1 |
| G3 | Deprecation plan | P1 |
| G4 | A11y sync with slotted control | P2 |
| G5 | Error state cross-bind | P2 |
| G6 | `helperText` alias | P3 |

## Concrete upgrade API

For the deprecation path:

```ts
// Add @Input() helperText alias for hint
// Add @Input() controlId to allow explicit label-for association
// Mark @deprecated in JSDoc
```

For migration: open a workspace-wide refactor to:
1. Replace `<falcon-form-field label="X">...<falcon-angular-input>...</falcon-form-field>` patterns with single `<falcon-angular-input label="X">` calls.
2. Remove `<falcon-form-field>` from `imports: []`.
3. Track via a gate or grep audit.

## Shared vs per-page

Shared. But ultimately this component should be retired.

## Workarounds today

- Continue using as-is in wizards; do not add new usages.
- For label-for-control: set `inputId` explicitly on both the form-field and the inner input.
