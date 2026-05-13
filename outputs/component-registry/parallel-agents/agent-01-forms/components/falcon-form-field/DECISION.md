# falcon-form-field — DECISION

## Brain SK final recommendation

**STATUS: LEGACY / NEEDS-DEPRECATION.** Use ONLY for legacy code maintenance or for wrapping non-Falcon controls. **Do NOT use for new Falcon-input usages.**

## Use this component for

- Legacy migrations.
- Mixed-form layouts with non-Falcon controls.

## Avoid this component for

- New `<falcon-angular-input>` usages — they have built-in `label` / `errorMessage`.
- New `<falcon-angular-dropdown>` / `<falcon-angular-textarea>` / etc. — same.

## Preferred render path

N/A — Angular-only component.

## Required upgrades before wider use

- **DO NOT** widen use. Instead:
  - P1 G1: Migrate SCSS → Tailwind + tokens.
  - P1 G2: Label-for-control association.
  - P1 G3: Workspace-wide migration audit + deprecation.

## Relationship

- Often wraps Falcon UI inputs (legacy pattern).
- Replaced by built-in input labels.

## Exact rule

1. New code? → use Falcon UI input's built-in `label` / `errorMessage` / `required`. Do NOT use `<falcon-form-field>`.
2. Legacy code? → keep `<falcon-form-field>` until refactor pass migrates.
3. Non-Falcon control? → acceptable use.

---

## Dynamic capability assessment

### 1. Static?
- SCSS-driven visuals.
- Label-row markup.
- No token contract yet.

### 2. Dynamic via inputs/outputs?
- 7 signal inputs.
- 0 outputs.

### 3. Slots/templates?
- Default content slot.

### 4. Tokens?
- None — SCSS-only.

### 5. Tailwind?
- N/A — wrapper isn't using Tailwind.

### 6. Missing for cross-page reuse?
- Token contract (G1).
- Label-for-control association (G2).
- Deprecation plan (G3).
- A11y sync (G4).

### 7. Shared vs page-hack?
- Shared.

### 8. Flags?
- `helperText` alias for `hint` (G6).
- `controlId` for explicit association (G2).

### 9. Safest path?
1. Migrate SCSS → Tailwind + tokens (template + token file).
2. Add `controlId` input + bridge to inner control.
3. Document deprecation; tag with `@deprecated` JSDoc.
4. Run workspace-wide migration replacing `<falcon-form-field>` around Falcon inputs.

### 10. Risky?
- Removing SCSS may shift visuals — guard with a visual regression test.
- Workspace-wide replace must not double-label.
- Some legacy wizards depend on the wrapper's spacing — token-mirror before removing SCSS.
