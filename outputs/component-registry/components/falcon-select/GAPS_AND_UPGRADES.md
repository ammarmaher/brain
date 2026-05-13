# falcon-select — GAPS AND UPGRADES

This component is an **alias** of `<falcon-angular-dropdown>`. All gaps and upgrade ideas live in `../falcon-dropdown/GAPS_AND_UPGRADES.md`.

## Alias-specific gaps

### G1 — No HTML selector named `falcon-angular-select` (P3)

The class alias exists but no Angular `@Component({ selector: 'falcon-angular-select' })` exists. Consumers must use `<falcon-angular-dropdown>` in templates regardless of which class name is imported. This is a naming inconsistency.

**Recommended fix (optional):** add a thin shell component with `selector: 'falcon-angular-select'` that simply renders `<falcon-angular-dropdown ...>` with all inputs/outputs passed through. Trade-off: another class + tag in the codebase for spec-name purity.

### G2 — Documentation drift risk (P2)

If `<falcon-angular-dropdown>` evolves, the alias must stay in sync. Currently the `index.ts` re-export handles this automatically.

### G3 — Stencil Shadow tag stays `<falcon-dropdown>` (P3)

For full alignment, a Stencil-side tag alias `<falcon-select>` could be added. Probably not worth it.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Add `falcon-angular-select` HTML selector | P3 (optional) |

## Shared vs per-page

All shared.

## Workarounds today

- Use `<falcon-angular-dropdown>` in HTML regardless. Import the alias if you prefer the "Select" class name.
