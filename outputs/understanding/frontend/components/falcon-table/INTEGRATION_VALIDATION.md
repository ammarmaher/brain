# falcon-table — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
`falcon-table` itself is **presentational — it owns no data and binds to no endpoint.** Its substrate role means every backend tie sits in the *consumer* (`<falcon-angular-data-table>` + the feature's state slice). Where Falcon features render data through this substrate:
- **Commerce** — account service rows (CommChannels + Apps tabs). `[MEMORY]` endpoints `GET commerce/Node/{nodeId}/comm-channels/visible/details` + `GET commerce/Node/{nodeId}/applications` via the System Gateway.
- **Identity** — user-list rows in user-management views.
- Any module — generic admin/management list pages.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `commerce/Node/{nodeId}/comm-channels/visible/details` | GET | Commerce | — / `AccountCommunicationChannelResponse[]` (details variant) | System Gateway | `[MEMORY]` Wave 17 — mapped via `serviceRowsToApplicationRows` adapter into `ApplicationRow`, then fed to the table |
| `commerce/Node/{nodeId}/applications` | GET | Commerce | — / `AccountApplicationResponse[]` | System Gateway | `[MEMORY]` Wave 17 — same adapter; shadow rows for scheduled changes |
| Lazy page/sort/filter | (consumer-defined) | (consumer's module) | — / server page | (consumer's gateway) | `[CODE]` falcon-table-tw.tsx — `falcon-lazy-load` emits `FalconTableLazyLoadDetail` (`first`, `rows`, `sortField`, `sortOrder`, `multiSortMeta`, `filters`, `globalFilter`); the consumer calls the API |

The table NEVER calls an endpoint itself. It emits `falcon-lazy-load` / `falcon-page-change` / `falcon-sort` / `falcon-global-filter-change` and trusts the consumer to fetch.

## Validation rules (V-*)
`falcon-table` has **no validation rules** — it is a read/select surface, not a form. Validation lives in the rows' source data and in the feature forms above/below it. The one data-shape contract it enforces:
- `[CODE]` falcon-table.types.ts:15-21 — `FalconTableColumn` requires `key` + `label`; `dataKey` (default `'id'`) must resolve to a unique row id or selection/shadow-row matching breaks silently.

## PES keys gating this component
The table has **no PES key of its own.** Row-level action availability is gated upstream:
- `[MEMORY]` project_commchannels_apps_tabs_backend_integration_plan — service rows carry a backend-computed `availableActions[]` FSM; PES `adminConsole.services.{visibility,editPriceType,editPriceValue,payment}` decides which actions render. The table renders whatever action cells the consumer projects.
- `[MEMORY]` project_pr40937 — soft-deleted rows appear only for Falcon-session users; the `IncludeDeleted` query flag is a role-scoped toggle at the HTTP-service boundary, not a table filter.

## State / signal pattern
`[MEMORY]` Wave 17 — the consuming tab component injects a state slice (mirrors `SettingsTabStateSlice`); an `effect()` triggers `state.load(nodeId)` on every `nodeId` change; a `computed tableRows = serviceRowsToApplicationRows(state.rows())` feeds the table. `loading` signal drives `[loading]`. The table itself holds only view state (`internalGlobalFilter`, `internalFilters`, sort, current page, selection) as Stencil `@State`.

Error pipeline `[MEMORY]` Wave 17, verified configured in `apps/host-shell/.../falcon-http-ui.config.ts:23-67`: 400 → top-right business-validation toast; 403/404/5xx/network → popup confirm; 422 → warning toast; 200+`isSuccessful:false` → "Validation error" toast; 401 → AuthService refresh-token flow. The table renders the empty/loading state while this pipeline runs.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-table>` (Shadow) / `<falcon-table-tw>` (Light, the canonical render path). Pure presentational. `[CODE]` falcon-table-tw.tsx — Strategy E projection points (`<td data-cell-mount>`, `<td data-shadow-mount>`, `[data-empty-mount]`, `[data-loading-mount]`, `[data-header-mount]`) emitted only when `hostsExternalCells=true` / `shadowRows` non-empty.
- **Angular wrapper (basic, deprecated)** — `<falcon-angular-table>`: `@Input` + `syncProps()` reflects object props onto the element. No template projection.
- **Angular wrapper (canonical)** — `<falcon-angular-data-table>`: composes `<falcon-table-tw>`, consumes `falcon-cells-mounted` / `falcon-shadow-cells-mounted` via `addEventListener`, mounts `EmbeddedViewRef`s into the Stencil mount-point `<td>`s. This is where every app/state integration belongs — per `feedback_library_skeleton_app_api`, data is fetched by the app/state layer, never inside the library.

## Integration gotchas
- `[CODE]` falcon-table.types.ts:204 — **kebab-case Stencil events** (`falcon-cells-mounted`, `falcon-shadow-cells-mounted`) do NOT reliably bind via Angular template `(...)` syntax for these custom-element events; `<falcon-angular-data-table>` falls back to `addEventListener`. A direct consumer must do the same.
- **Object/array inputs** (`rows`, `columns`, `selectedRowIds`, `sortBy`, `shadowRows`, `globalFilterFields`, `rowsPerPageOptions`, `rowStyleClass`) must be set as element *properties* via `ElementRef.nativeElement` — Angular `[attr.x]` only handles primitive strings.
- `[CODE]` falcon-table.types.ts:34-36 — `col.render()` returns HTML flushed via `innerHTML`; **consumer owns sanitisation**. Never put a Falcon Angular component inside `col.render()` — it will not instantiate. Use a `<ng-template falconDataTableCell>` instead.
- Strategy E mount-point attribute names (`data-cell-mount`, `data-header-mount`, `data-row-id`, `data-row-index`, `data-shadow-mount`) are a private contract the data-table orchestrator reads literally — renaming breaks projection.
- `[MEMORY]` Wave 17 — `notShowToaster:'true'` header is set ONLY on do-payment POSTs; service-list GETs run the standard error pipeline.

## Verification
🟡 CODE-DERIVED + `[MEMORY]`. Endpoint wiring + state-slice pattern ✅ VERIFIED (`[MEMORY]` project_commchannels_apps_tabs_wave17` — `nx build admin-console` GREEN, mocks deleted, API loading live, user-confirmed working). Strategy E mount-point contract `[CODE]`-verified against `falcon-table-tw.tsx`.
