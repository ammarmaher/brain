# falcon-grid-input — DECISION

## Brain SK final recommendation

**STATUS: READY + ADOPTED for inline cell editing.** 2 live consumers (Contracts cost-management price/cost matrix, both consoles) as of 2026-06-03.

## Use this component for

- Inline cell editors inside data tables / grids.
- Spreadsheet-style edit experiences.

## Avoid this component for

- Form fields → input.
- Numeric with format → input-number.
- Multi-line → textarea.

## Preferred render path

`useTailwind=true`.

## Required upgrades

None blocking the happy path. **G4** (no `aria-label` passthrough → unlabelled cells for screen readers) is the most important pre-scale a11y item. **G1** (numeric `mode`) is a common future need — the live contracts consumers parse the committed string themselves. **G5** (orphan focus-ring tokens + `primary`-palette miss) is a quick safe-local cleanup.

## Relationship

- **Composes** `<falcon-input variant="grid" size="sm">` (Shadow) / `<falcon-input-tw variant="grid" size="sm">` (Light).
- **Live host:** plain `<table>` matrix cells in Contracts cost-management (NOT yet `<falcon-angular-data-table>` custom cells — that is the recommended-but-unused pattern).
- **Siblings:** `<falcon-angular-input>` (forms), `<falcon-angular-input-number>` (numeric), `<falcon-angular-textarea>` (multi-line), `<falcon-angular-dropdown>` (in-cell pickers).

## Exact rule

1. Cell edit inside a grid/table/matrix? → `<falcon-angular-grid-input>`.
2. Pass `originalValue` for Escape-revert (omitting reverts to `''`).
3. Handle `(falconGridCommit)` (write), `(falconGridCancel)` (close), `(falconGridNavigate)` (move focus — Tab is hijacked).
4. `autoFocus=false` for an all-editable grid (whole matrix at once); `true` for one-cell-at-a-time edit.
5. Parse/validate the committed **string** yourself; restyle via `--falcon-input-*` (not the orphan `--falcon-grid-input-*`).
6. Don't use outside a grid context.

---

## Dynamic capability assessment

### 1. What is static today?
- Cell-only layout (root `display:block`, `block w-full`).
- String value only; size pinned `sm`, variant pinned `grid` — no `size`/`variant`/`mode` inputs.
- No labels / helper / error / aria-label.
- The keyboard contract (Enter/Escape/Tab semantics) is fixed.

### 2. What is dynamic through inputs/outputs?
- 5 wrapper `@Input`s (`value`, `originalValue`, `autoFocus`, `disabled`, `useTailwind`).
- 3 `@Output`s (`falconGridCommit {value}`, `falconGridCancel` void, `falconGridNavigate {direction}`).
- **No CVA** — `[value]` + `(falconGridCommit)` only.

### 3. What is dynamic through slots / ng-template?
- **None.** No `<slot>` / `<ng-content>`.

### 4. What is dynamic through token/theme overrides?
- Field bg/border/focus/height/text: the inherited `--falcon-input-*` set (variant grid, size sm).
- The 2 own tokens (`--falcon-grid-input-focus-ring-*`) are **orphan** — overriding them does nothing today (G5).

### 5. What is dynamic through Tailwind classes?
- Host `class=` only. (The `falconGridInputRootClasses()` helper is a dead export — G6.)

### 6. What is missing to make it reusable across pages?
- `aria-label` passthrough (G4), numeric `mode` (G1), error feedback (G2), method proxies (G3), wired-not-orphan focus-ring tokens (G5).

### 7. What capability should be added to the shared component (not a page hack)?
- All of the above. The contracts feature already proved the anti-pattern it avoided: a per-page bespoke `app-contracts-number-input` (now removed for this shared component).

### 8. What flags / options would make it better?
- `mode='number'`, `errorState`/`errorMessage`, `ariaLabel`, `setFocus()`/`selectAll()` proxies, a `dirty` class/token.

### 9. What is the safest upgrade path?
1. **Phase A (safe-local):** delete or wire the orphan focus-ring tokens + fix the `primary`-palette miss (G5); remove or use the dead helper (G6); add specs.
2. **Phase B (a11y, HIGH-RISK-QUEUE):** add `ariaLabel` passthrough (G4).
3. **Phase C (additive API):** `mode`, `errorState`/`errorMessage`, `setFocus()` proxy. All additive — no consumer break.

### 10. What is risky to change because other pages depend on it?
- Auto-focus default — the live contracts matrix relies on `autoFocus=false`; flipping the default would steal focus across the whole grid.
- Tab/Shift+Tab as navigation events — host code depends on `falconGridNavigate`.
- The `committed`-flag de-dup contract — consumers trust exactly one commit per edit; changing it risks double-writes.
- The `{ value: string }` commit shape — both consumers parse the string; a typed payload would break them.

## Verification
🟢 code-verified (re-read 2026-06-03) against `falcon-grid-input.component.ts/.html` + both Stencil tags + token file + Tailwind helper, and against the live Contracts cost-management consumers. Findings G4/G5/G6 + 1:1 Shadow↔`-tw` parity ✅ source-verified this pass.
