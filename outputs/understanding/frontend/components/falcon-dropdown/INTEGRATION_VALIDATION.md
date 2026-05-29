# falcon-dropdown — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
The component itself is **presentational** — it owns no data. Its *option list* is business reference data owned elsewhere:
- **Provisioning** — country / city lookups (`LookupController`). `[MEMORY]` ⚠ known empty-seed gap: lookups return `[]` in Provisioning + Charging → Add Client pickers can render empty.
- **Identity** — user-role options derive from `BuiltInRoleCatalog` (6 canonical roles).
- **Commerce** — category / service-type options.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Country / City options | `getLookup(LOOKUP_IDS.Country \| City, { code })` | Provisioning | Per-country city fetch; camelCase wire |
| Role options | role catalog query | Identity | 6 built-in roles |
| Selected value | bound via CVA into the parent wizard payload | (the flow's owning module) | dropdown emits value only |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error |
|---|---|---|---|
| Required-field | Country, Owner Role | submit with empty value | field-level "required" |
| Cross-field dependency | City requires Country | City selected before Country | `CountryRequiredWhenCity` |

## PES keys gating this component
The dropdown has no PES key of its own — it inherits the gate of the **field** it renders. Where the host field is PES-gated (e.g. a Falcon-only attribute), the dropdown is rendered `[disabled]` by the parent step's PES resolution.

## State / signal pattern
`[BRAIN-OUT]` Options are a `computed` signal off a lookup `Hook<LookupValueResponse>`; a `loading` signal drives `[loading]`; `[disabled]` is a plain input bound from the parent step. Selecting a parent dropdown clears the dependent child and cancels any in-flight child lookup (out-of-order-write guard).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-dropdown-tw>` (Light DOM) / `<falcon-dropdown>` (Shadow). Pure presentational.
- **Angular wrapper** — `<falcon-angular-dropdown>`: CVA, `@Input('disabled')` *property* setter, size/variant contract shared with `<falcon-angular-input>`.
- Per `feedback_library_skeleton_app_api`, lookups are fetched by the app/state layer, never inside the library component.

## Integration gotchas
- `[MEMORY]` **Use `[disabled]="true"` (property), never `[attr.disabled]`** — attribute binding does not trigger the wrapper's `@Input` setter, so the inner Stencil dropdown stays enabled.
- `[MEMORY]` **`shadow:false` `display:inline` trap** — a disabled dropdown once collapsed to chip width; fixed at library level with a `display:block; width:var(--falcon-dropdown-width)` rule.
- `[MEMORY]` Dropdown payloads must strip `FALCON_ROOT_NODE.id → null` and route through the **System Gateway** (`useGateway()`), not a direct auth host.

## Verification
🟡 CODE-DERIVED + `[MEMORY]`. Lookup empty-seed gap ✅ flagged in `project_lookup_empty_seed_2026_05_18`. Full-fidelity pass should read `falcon-dropdown.component.ts` directly.
