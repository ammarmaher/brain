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
  - ~~P1 G1: Migrate SCSS → Tailwind~~ — **RESOLVED/MOOT** (no SCSS exists; already Tailwind-only — corrected 2026-06-03).
  - P1 G2: Label-for-control association (`controlId`/`for=`).
  - P1 G3: Workspace-wide migration audit + deprecation (migrate Falcon-input usages off the wrapper).

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
- Label-row markup + the single message line (error xor hint).
- Tailwind-utility visuals (NOT SCSS — corrected 2026-06-03); colors via `--text-*` theme tokens.
- No `--falcon-form-field-*` token namespace (none needed).

### 2. Dynamic via inputs/outputs?
- 7 signal inputs.
- 0 outputs.

### 3. Slots/templates?
- Default content slot.

### 4. Tokens?
- No component token file. Label/hint colors read the `--text-2` / `--text-muted` theme tokens via `var(..., fallback)`; required/error use the `text-falcon-red-500` palette utility.

### 5. Tailwind?
- **Yes** — the wrapper IS Tailwind-utility-driven (corrected 2026-06-03; the prior "isn't using Tailwind / SCSS-only" was drift). Host `class=` adds layout utilities.

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
1. Add `controlId` input + render `[for]` on the label (G2).
2. Add `helperText` alias for `hint` (G6); add a component spec (G-TEST).
3. Document deprecation; tag with `@deprecated` JSDoc (G3).
4. Run workspace-wide migration replacing `<falcon-form-field>` around Falcon inputs with the input's built-in `label`.
(The old "migrate SCSS" step is dropped — no SCSS exists.)

### 10. Risky?
- Workspace-wide replace must not double-label (G3).
- Some legacy wizards depend on the wrapper's `gap-1.5` row spacing — verify visually before removing the wrapper.
- The `--text-2` / `--text-muted` fallback literals (`#3d3d3d` / `#6b7280`) assume those theme tokens exist — verify platform-wide (G7).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B24). Recommendation unchanged (LEGACY / NEEDS-DEPRECATION, Tailwind-only). **Drift corrected:** the component is Tailwind-utility-driven with no SCSS and no token file — every "SCSS-only / migrate SCSS" claim in the prior dossier was wrong. 7 inputs / 0 outputs / `hasError` precedence re-confirmed from source.
