# falcon-select — OVERVIEW

> Sweep-refreshed 2026-06-03 (B04). ⚠️ NEW: the alias barrel is flagged **DEAD CANDIDATE** in source — see Status.

## Component purpose

**ALIAS (TS class-level only)** for `<falcon-angular-dropdown>`. Wave 5 naming alignment per architect spec §5.12.1 L1 "Select": the spec named this control "Select"; the platform shipped it as `<falcon-dropdown>` (intentional custom-popover, not native `<select>`). The select alias closes the naming gap without code duplication. There is **no `<falcon-angular-select>` HTML tag** — the rendered tag stays `<falcon-angular-dropdown>`.

`[CODE]` `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/index.ts` (12 lines).

## Business / UI use case

Same as `<falcon-angular-dropdown>`. The alias exists purely so new spec-named code can import `FalconAngularSelectComponent` / `FalconSelectOption`.

## When to use it / when NOT to use it

**Use it for:**
- New code that wants the spec name "Select" in TS imports.

**Do NOT use it for:**
- Native `<select>` semantics — this is a custom popover.
- Writing `<falcon-angular-select>` in a template — that tag does not exist.

## Status

**⚠️ DEAD CANDIDATE / ALIAS.** `[CODE]` `falcon-select/index.ts:1` is literally headed:
```ts
// DEAD CANDIDATE - flagged Night Shift 2026-05-16 - verify before removal
```
- `[CODE]` Grep 2026-06-03: `FalconAngularSelectComponent` / `falcon-angular-select` appears in exactly **3 files** — the dead-candidate `index.ts`, `libs/falcon-ui-core/WAVE-5-GAP-CLOSE.md` (the doc that introduced it), and ONE app file `apps/management-console/.../contracts-rate-card-section/contracts-rate-card-section.component.ts` where it appears **only in a banner comment** (the actual template uses `<falcon-angular-dropdown>`, confirmed by that file also matching the dropdown grep). → **0 real runtime consumers of the alias export.**
- Backward-compatible with `<falcon-angular-dropdown>` (same class) — removing the alias would not change any rendered UI, only break the (unused) `FalconAngularSelectComponent` import name.

## Replaces

- Nothing. It is a naming bridge atop `<falcon-angular-dropdown>`.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper barrel (alias) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/index.ts` |
| Actual implementation | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts` |

`[CODE]` `index.ts` re-exports:
```ts
export { FalconAngularDropdownComponent as FalconAngularSelectComponent } from '../falcon-dropdown/falcon-dropdown.component';
export type { FalconDropdownOption as FalconSelectOption } from '../falcon-dropdown/falcon-dropdown.component';
```

> No Stencil `<falcon-select>` tag, no `falcon-select.tsx`, no `select-tailwind-classes.ts`, no `select.tokens.css` exist (Glob 2026-06-03). The alias is purely the one re-export file.

## Selectors

| Layer | Tag |
|---|---|
| Angular class alias | `FalconAngularSelectComponent` (= `FalconAngularDropdownComponent`) |
| Angular HTML selector | `falcon-angular-dropdown` (the alias does NOT register a `falcon-angular-select` tag) |
| Stencil Shadow | `<falcon-dropdown>` |
| Stencil Light | `<falcon-dropdown-tw>` |

## Known consumers

- `[CODE]` Of the alias export: **0 real consumers** (only a doc comment in `contracts-rate-card-section.component.ts`).
- The underlying `<falcon-angular-dropdown>` is used in 57 app files (see the falcon-dropdown dossier).

## Related components

- Identical to `<falcon-angular-dropdown>` — see that component's 9 files for full docs.
- Siblings: `<falcon-angular-multi-select>`, `<falcon-angular-combobox>`.

## Ownership

`libs/falcon-ui-core`.

## Verification
🟢 code-verified against `falcon-select/index.ts` (read 2026-06-03) + grep-verified 0 real consumers. DEAD-CANDIDATE flag 🟢 code-verified (`index.ts:1`).
