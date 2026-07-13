# falcon-data-table — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
The table is **presentational** — it owns no endpoint. The collections it renders are owned per-consumer:
- **Identity** — the org-hierarchy *users* list. `[MEMORY]` `project_pr40937_include_deleted_lift` — `user-api.service.ts` `listByNode` / `getById`, with `IncludeDeleted` auto-appended for Falcon sessions.
- **Commerce** — *Communication Channels* + *Applications/Services*. `[MEMORY]` `project_commchannels_apps_tabs_phase1` — `GET commerce/Node/{nodeId}/comm-channels/visible/details` and `GET commerce/Node/{nodeId}/applications` via `CommerceGatewayService`; 15 symmetric mutation endpoints (visibility / price-type / price-value / do-payment / enable / disable / delete-pending).
- `[INFERRED]` **Charging** — wallet / do-payment polling. `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan` — do-payment polls `GET order/{orderId}/status`; funding decisions are Charging-owned.

The table never issues HTTP. The consumer's **state slice** owns the fetch and feeds `[data]` / `[totalRecords]`; the table emits `(lazyLoad)` / `(rowAction)` / shadow events back.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `commerce/Node/{nodeId}/comm-channels/visible/details` | `GET` | Commerce | `AccountCommunicationChannelResponse` (→ FE `ServiceRow`) | System Gateway | `[MEMORY]` Phase 1 — the `details` variant returns shadow-row data |
| `commerce/Node/{nodeId}/applications` | `GET` | Commerce | `AccountApplicationResponse` (→ FE `ServiceRow`) | System Gateway | `[MEMORY]` Phase 1 — structurally identical to comm-channels |
| service mutations (visibility / price-type / price-value / enable / disable / delete-pending) | `POST` / `DELETE` | Commerce | per-action req DTOs; writes are `FalconOnly` except enable/disable/do-payment | System Gateway | `[MEMORY]` integration plan — 15 endpoints |
| `order/{orderId}/status` | `GET` | Charging / Commerce orders | order-status response | System Gateway | `[MEMORY]` — do-payment polls 2s × 30min via `SimplePollService` |
| users `listByNode` / `getById` | `GET` | Identity | user list / `User` | System Gateway | `[MEMORY]` PR-40937 — `IncludeDeleted` auto-set for Falcon sessions |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The table does **no field validation** — it is a display + action surface. |

`[CODE]` There is no `validations/validations.ts` for the table. Validation belongs to the **shadow-row edit forms** the consumer projects via `<ng-template falconDataTableShadow>` — e.g. `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan`: a periodic price change requires a future `effectiveDate` clamped to `renewDate.Day - 1`, else the Commerce backend returns `InvalidEffectiveDateForPeriodicPricingChange`. Those rules live in the consumer's edit-form `validations/`, not the table. The backend is the final authority — `availableActions[]` is FSM-computed server-side.

## PES keys gating this component
The table has no PES key of its own. Action visibility is consumer-resolved:
- `[CODE]` `API.md` **`FalconDataTableRowMenuAction<T>.visible(row)` / `disabled(row)`** — the consumer's state slice resolves these against `FalconAccess.*`. `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan` — PES keys `adminConsole.services.{visibility, editPriceType, editPriceValue, payment}` gate the per-row mutation actions.
- `[CODE]` `API.md` **`enableFlag` + `flagMode: 'disable' | 'hide'`** — gates an action behind a platform feature flag (`actionFlags` map).
- `[INFERRED]` On top of PES, the backend `availableActions[]` per row is the hard gate — the frontend `visible(row)` typically just mirrors it.

## State / signal pattern
`[CODE]` The table is a **controlled component**; the consumer owns the state slice:
- `[MEMORY]` `project_commchannels_apps_tabs_wave17` — each tab injects a `SettingsTabStateSlice`-style slice; an `effect()` fires `state.load(nodeId)` on every nodeId change; a `computed tableRows = serviceRowsToApplicationRows(state.rows())` feeds `[data]`.
- Two-way `[(selection)]`, `[(expandedShadowRowIds)]`, `[(shadowRowModes)]` — the table mirrors these from inputs and emits `*Change` on user action; the consumer's signal stays the source of truth.
- `[CODE]` `DECISION.md` Wave 21 — `shadowRows` is deliberately **one-way** (consumer-derived collection state); `(shadowRowDeleteRequest)` emits a *proposed* new collection rather than writing back, preserving consumer ownership.
- Error pipeline: `[MEMORY]` `project_commchannels_apps_tabs_wave17` — configured in `apps/host-shell/.../falcon-http-ui.config.ts`: 400 → top-right business-validation toast (12s); 403/404/5xx/network → popup confirm; 422 → warning toast; 200 + `isSuccessful:false` → "Validation error" toast; 401 → AuthService refresh-token flow. `notShowToaster:'true'` header is set ONLY on do-payment POSTs (their failures get dedicated dialogs).

## Skeleton ↔ app-wrapper layering
This component is the **textbook three-layer Falcon stack**:
- **Stencil skeleton** — `<falcon-table-tw>` (Light DOM, `hosts-external-cells=""`). `[CODE]` `falcon-data-table.component.ts:1-5` — it owns the rendering substrate: renders `<td data-cell-mount>` mount-points, emits `falcon-cells-mounted` / `falcon-row-action-trigger` / `falcon-shadow-*` events. Pure presentational, framework-neutral.
- **Angular wrapper** — `<falcon-angular-data-table>` (`libs/falcon-ui-core/src/angular-wrapper/...`). It is the **Strategy E projection orchestrator**: it listens to `falcon-cells-mounted` and mounts Angular `EmbeddedViewRef` root-nodes into the Stencil-emitted cells, so `<ng-template falconDataTableCell>` projection works. It also bridges all Stencil events to Angular `@Output`s and composes `<falcon-angular-menu>` for the row ⋮ popup. `[CODE]` `:112-120` `@Component` decorator.
- **App layer** — the org-hierarchy tab components + their state slices. They own the HTTP fetch, the `ColumnDef[]`, the `rowActions[]`, and the projected cell templates. `[MEMORY]` Phase 1 — `CommerceGatewayService` + `CommerceActionsService` + per-tab `services/*.service.ts` live here, never inside the wrapper (per `feedback_library_skeleton_app_api`).
- `[CODE]` `DECISION.md` Wave 22D — shadow rows are **Angular-only**: the Strategy E orchestrator is framework-specific; React/Vue would each need their own. The Stencil skeleton exposes the raw events; only the Angular wrapper turns templates into rendered subtrees.

## Integration gotchas
- `[CODE]` `OVERVIEW.md` + `TOKENS.md` — **object props bypass `[attr.x]`** — `data`, `columns`, `selectedRowIds`, `rowsPerPageOptions`, `globalFilterFields`, `rowStyleClass`, `shadowRows` are set via `el.<prop> = …` in `syncProps()`; Angular's `[attr.x]` would stringify them.
- `[MEMORY]` `project_commchannels_apps_tabs_phase1` — **camelCase wire** — Commerce JSON is camelCase (.NET 6+ default); the `serviceRowsToApplicationRows` adapter (`[MEMORY]` Wave 17) maps the backend `ServiceRow` wire shape to the table's render contract so the shared `<app-applications-table>` stays decoupled from the wire.
- `[MEMORY]` Phase 1 — **HttpContext clobber** — `CommerceGatewayService` uses the single-options-object pattern on `DELETE` + `POST` so the `useGateway()` HttpContext is not overwritten.
- `[CODE]` `API.md` — **shadow `targetColumn` must resolve to a visible column** — Wave 21 FU-02 — a mistyped `targetColumn` silently hides the notch + emits one dev-mode `console.warn`. The consumer must NEVER hardcode the notch position.
- `[CODE]` `GAPS_AND_UPGRADES.md` — `[reorderableColumns]` / `[resizableColumns]` are **API-parity placeholders with no implementation** — binding them to `true` does nothing.
- `[CODE]` `GAPS_AND_UPGRADES.md` — **no `(multiSortChange)`** — `sortMode='multiple'` is non-functional from the consumer's view; only single-mode `(sortChange)` surfaces.
- `[CODE]` `GAPS_AND_UPGRADES.md` — **no virtual scrolling** — the EmbeddedViewRef registry has no size cap; for lists >500 rows use `[lazy]="true"` + page size ≤50.

## Verification
🟡 CODE-DERIVED, RE-VERIFIED 2026-06-03 (B08) from the dossier files (source-grounded with line refs) + `falcon-data-table.component.ts` (1612 ln) + `[MEMORY]` org-hierarchy Wave 15/17/Phase-1 + PR-40937 entries. Backend endpoints, gateway, state-slice pattern and error pipeline ✅ VERIFIED against `[MEMORY]`. The **`loading`-hard-swap + consumer `busyRowIds`/`isRowBusy` row-mutation pattern** is now documented in API.md/USAGE.md (verified against `libs/falcon/.../service-pricing-table` + 3 app features). Charging ownership of do-payment is `[INFERRED]`.
