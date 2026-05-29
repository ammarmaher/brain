# falcon-select — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.
> **`falcon-select` is a pure TS alias of `falcon-dropdown`.** Canonical integration layer → `../falcon-dropdown/INTEGRATION_VALIDATION.md`. This file states only what is alias-specific.

## Owning backend module(s)
None of its own. The component is presentational; its *option list* is business reference data owned exactly as for `falcon-dropdown`:
- **Provisioning** — country / city lookups (`[MEMORY]` ⚠ known empty-seed gap).
- **Identity** — role catalog.
- **Commerce** — category / service-type options.

## Backend wiring
Identical to `falcon-dropdown` — see `../falcon-dropdown/INTEGRATION_VALIDATION.md`. The alias adds **no wiring of its own**: options are fetched by the app/state layer and bound into the same `[options]` input on the shared class.

## Validation rules (V-*)
Identical to `falcon-dropdown`:
| V-rule | Field | Trigger | Error |
|---|---|---|---|
| Required-field | any required picker | submit with empty value | field-level "required" |
| Cross-field dependency | City requires Country | City selected before Country | `CountryRequiredWhenCity` |

## PES keys gating this component
No PES key of its own — inherits the gate of the field it renders, exactly as `falcon-dropdown`.

## State / signal pattern
`[CODE] src/angular-wrapper/components/falcon-select/index.ts` — the alias re-exports the *same class*, so the CVA, signal, and `pushOptions()` behavior are byte-identical to `falcon-dropdown`. `[INFERRED]` Options as a `computed` signal off a lookup `Hook`, `loading` signal drives `[loading]`, `[disabled]` is a property input.

## Skeleton ↔ app-wrapper layering
- **Angular wrapper** — `FalconAngularSelectComponent` = `FalconAngularDropdownComponent` (`[CODE] index.ts`). Template selector is `falcon-angular-dropdown`.
- **Stencil skeleton** — same `<falcon-dropdown>` (Shadow) / `<falcon-dropdown-tw>` (Light) renders. There is no `falcon-select` Stencil tag.

## Integration gotchas
- `[CODE] index.ts` — **Importing `FalconAngularSelectComponent` pulls in `FalconAngularDropdownComponent`.** Tree-shaking sees one class; no double cost, but also no isolated select build target.
- `[CODE]` **The alias does not create an HTML tag.** Wiring `<falcon-angular-select>` into a template fails silently — use `<falcon-angular-dropdown>`.
- `[MEMORY]` All dropdown integration traps apply: use `[disabled]="true"` (property, never `[attr.disabled]`); strip `FALCON_ROOT_NODE.id → null` from payloads; route lookups through the System Gateway via `useGateway()`.

## What it CAN do (integration)
- `[INFERRED]` Everything `falcon-dropdown` does — CVA into a Reactive Form, push-options-on-ready race handling, lookup-driven option lists.

## What it CANNOT do (integration)
- `[CODE]` It cannot integrate differently from `falcon-dropdown`. No alias-specific endpoint, DTO, or validator exists.

## Enhancement opportunities
- `[INFERRED]` If the alias is kept, generate it from a single source so it cannot drift from `falcon-dropdown`; today it is one re-export line, which is already drift-proof.

## Verification
🟡 CODE-DERIVED from `[CODE] src/angular-wrapper/components/falcon-select/index.ts`. Alias-only nature ✅ VERIFIED. Full dropdown integration ✅ VERIFIED via `../falcon-dropdown/INTEGRATION_VALIDATION.md` (Add Client / Add User confirmed working by user 2026-05-18).
