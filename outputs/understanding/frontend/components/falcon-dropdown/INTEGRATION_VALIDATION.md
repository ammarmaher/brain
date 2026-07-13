# falcon-dropdown — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`. Sweep-refreshed 2026-06-03 (B04) — `[MEMORY]`-backed integration facts preserved; state/signal + portal facts re-verified against live `falcon-dropdown.component.ts`.

## Owning backend module(s)
The component itself is **presentational** — it owns no data. Its *option list* is business reference data owned elsewhere:
- **Provisioning** — country / city lookups (`LookupController`). `[MEMORY]` ⚠ known empty-seed gap: lookups can return `[]` in Provisioning + Charging → Add Client pickers can render empty (`project_lookup_empty_seed_2026_05_18`).
- **Identity** — user-role options derive from `BuiltInRoleCatalog` (6 canonical roles).
- **Commerce** — category / service-type / currency options.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Country / City options | `getLookup(LOOKUP_IDS.Country \| City, { code })` | Provisioning | Per-country city fetch; camelCase wire |
| Role options | role-catalog query | Identity | 6 built-in roles |
| Currency / channel options (wallet) | client-side from the wallet hierarchy aggregation | Commerce/Charging | `[MEMORY]` no dropdown API — options derived from the ONE aggregation response |
| Selected value | bound via CVA into the parent wizard/drawer payload | (the flow's owning module) | dropdown emits value only |

> `[CODE]` The dropdown never calls these endpoints itself — the parent step/drawer's state slice does. The element only emits `falcon-change`/`falcon-clear`/`falcon-open`/`falcon-close`/`falcon-blur` → wrapper → CVA / `valueChange`.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error |
|---|---|---|---|
| Required-field | Country, Owner-Role, Status (where editable) | submit / blur with empty value | field-level "required" → `errorText` + `[state]="'error'"` |
| Cross-field dependency | City requires Country | City selected before Country resolved | `CountryRequiredWhenCity` (parent-step rule, surfaced via `errorText`) |

> `[CODE]` The dropdown has **no built-in validator** — `hasError` is purely `state==='error' || !!errorMessage` (`falcon-dropdown.utils.ts:33-35` `isFieldInError`, `falcon-dropdown-tw.tsx:266-268`). All real validation is Reactive Forms validators / backend, surfaced back into `errorText`.

## PES keys gating this component
The dropdown has no PES key of its own — it inherits the gate of the **field** it renders. Where the host field is PES-gated (e.g. a Falcon-only attribute or a role-locked field), the parent step's PES resolution renders the dropdown `[disabled]`. `risk-class HIGH-RISK-QUEUE` for any change to disabled-state plumbing — it backs role gates.

## State / signal pattern
`[CODE]` `falcon-dropdown.component.ts`:
- Internal `value = signal<FalconDropdownValue>(null)` (`.ts:177`) and `disabled = signal<boolean>(false)` (`.ts:178`).
- `[disabled]` accepts a **property** binding via `disabledFromInput` (`.ts:186-189`) — boolean OR string-truthy. CVA's `setDisabledState` writes the same signal.
- `[options]` setter (`.ts:128-133`) → `pushOptions()` (`.ts:236-263`): waits `customElements.whenDefined(tag)` + `componentOnReady()`, assigns `el.options`, then **re-asserts the value** (Wave 7.4) so Stencil re-evaluates selection after the async options arrive — fixes the cell-remount-empty race inside `<falcon-angular-data-table>` during wizard step navigation.
- `writeValue` (`.ts:269-284`) also pushes the value to the live element via `componentOnReady().then(push)` independently of the `[attr.value]` template binding, because Angular schedules attribute writes on the next CD tick which can run AFTER Stencil hydration on cell remount.
- **Top-Layer migration** (`.ts:330-402`): on `falcon-open` the wrapper schedules (rAF) `acquireTopLayer()` — locates the body-portaled panel by `data-falcon-popover-instance="<resolvedId>"` inside `.falcon-overlay-container`, feature-detects the Popover API, sets `popover="auto"`, calls `showPopover()`, and registers with `FalconStackingService`. On `falcon-close`/destroy it `hidePopover()` + unregisters. Additive — the body-portal at the overlay-container level is the fallback for browsers without the Popover API.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-dropdown>` (Shadow, panel rendered **inline** under the control, no portal) / `<falcon-dropdown-tw>` (Light DOM, panel **body-portaled** into `.falcon-overlay-container` via `ensurePortaled` + `positionPopoverFixed`, with scroll/resize reposition listeners). Both pure presentational.
- **Angular wrapper** — `<falcon-angular-dropdown>`: CVA, `@Input('disabled')` property setter, size/variant contract shared with `<falcon-angular-input>`, Top-Layer promotion of the portaled panel.
- Per `feedback_library_skeleton_app_api`, lookups are fetched by the app/state layer, never inside the library component.

## Integration gotchas
- `[CODE]/[MEMORY]` **Use `[disabled]="true"` (property), never `[attr.disabled]`** — attribute binding does not trigger the `disabledFromInput` setter, so the inner Stencil dropdown stays enabled.
- `[CODE]/[MEMORY]` **`shadow:false` `display:inline` trap** — a disabled `-tw` dropdown once collapsed to placeholder-text width; fixed at the library level with the `falcon-dropdown-tw { display:block; width:var(--falcon-dropdown-width) }` rule (`dropdown.tokens.css:51-56`). Do not strip it.
- `[CODE]` **Portaled panel ≠ host descendant** — once `<falcon-dropdown-tw>` portals its panel to body, outside-click detection passes BOTH anchor + panel to `isOutsideClick` (`.tsx:188-197`). A per-instance host-class token override does NOT reach the portaled panel — use `panelClass` (Tailwind) instead.
- `[CODE]` **Shadow path does NOT portal** — `<falcon-dropdown>` renders its panel inline (`falcon-dropdown.tsx:486`). In a clipped/overflow-hidden ancestor the Shadow-path panel can be cut off; prefer the default `-tw` path (body-portal) inside drawers/dialogs.
- `[MEMORY]` Dropdown wizard payloads strip `FALCON_ROOT_NODE.id → null` and route through the **System Gateway** (`useGateway()`) for admin / Core Gateway for client — the dropdown itself is gateway-agnostic.

## Verification
🟢 code-verified state/signal/portal pattern against `falcon-dropdown.component.ts` + `falcon-dropdown-tw.tsx` (read 2026-06-03). Lookup empty-seed gap + gateway routing ✅ `[MEMORY]`-backed. V-rules 🟡 code-derived from parent-step usage, not re-read from backend source.
