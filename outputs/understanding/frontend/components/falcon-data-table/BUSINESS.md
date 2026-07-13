# falcon-data-table — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` It is how the operator **reads, scans, and acts on a list of business records**. Every "list of things the operator manages" — users under an account, communication channels, applications/services, audit entries — is rendered through this one component. In business terms it is the primary work surface: it turns a backend collection into a sortable, paginated, filterable grid where each row carries its own per-row action menu, so the operator can both *survey* a population and *operate* on individual members of it without leaving the page.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Users list is node-scoped + role-filtered | `[MEMORY]` `project_pr40937_include_deleted_lift` | The admin-console org-hierarchy users table is fed a node-scoped Identity query; Falcon admins additionally see soft-deleted rows (`IncludeDeleted`). The table renders whatever the state service hands it. |
| Soft-deleted records stay visible to Falcon admins | `[MEMORY]` `project_pr40937_include_deleted_lift` | A `status='deleted'` row still renders; the row-action menu uses `visible(row)` predicates so destructive actions disappear on already-deleted rows. |
| Comm Channels / Apps services list with FSM-driven actions | `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan` + `project_commchannels_apps_tabs_wave17` | Each service row carries a backend-computed `availableActions[]`; the row-action menu only offers actions the row's lifecycle state permits. |
| Scheduled pricing changes shown inline per service | `[MEMORY]` Wave 20/21 shadow rows + `project_commchannels_apps_tabs_backend_integration_plan` | A service with a pending price-type / price-value change shows that change as a **shadow row** anchored under the relevant column, in view or edit mode. |
| Status is a controlled vocabulary | `[CODE]` `USAGE.md` Example 1 — `@switch (value)` on `active / pending / suspended / locked / deleted` | The status cell renders a fixed set of business states as coloured pills — status is not free text. |

## Business constraints baked in
- `[CODE]` `API.md` **Selection is two-way, but the table is not a form** — `[(selection)]` exposes which rows the operator has picked for a bulk business action (delete N, export N); there is no `[(ngModel)]`. Picking rows is a *staging* act, not a field edit.
- `[CODE]` `API.md` **`rowActions` predicates encode action legality** — `visible(row)` removes an action a row's state forbids; `disabled(row)` greys one that is contextually blocked; `enableFlag` + `flagMode` gate an action behind a platform feature flag. The menu the operator sees is the set of *currently-legal* business actions for that row.
- `[CODE]` `API.md` shadow rows — **`targetColumn` ties a pending change to the field it changes** — a scheduled price-type change renders its notch under the Price Type column; a scheduled price-value change under Price Value. The visual link IS the business statement "this pending change affects this attribute".
- `[CODE]` `API.md` Wave 20 — **view ↔ edit modes on a shadow row** — `shadowRowModes` is library-owned two-way state; flipping a shadow row to `edit` is the business act of amending a not-yet-effective change before it lands.
- `[CODE]` `[lazy]="true"` — **server-side pagination is the default for real lists** — large business collections are paged at the backend; the table never assumes it holds the whole population.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Browse / manage users under a node | org-hierarchy hierarchy tab | Lists Identity users; row ⋮ menu launches per-user actions (More Details, Edit, etc.). |
| Manage Communication Channels | org-hierarchy Comm Channels tab | Lists Commerce comm-channel services; visibility / price-type / price-value / do-payment actions per row; pending changes as shadow rows. |
| Manage Applications / Services | org-hierarchy Apps & Services tab | Same as Comm Channels for application services. |
| Add Client wizard — service selection | org-hierarchy Add Client Step | `client-service-row-table` lists selectable services as part of client creation. |
| Comms Hub list | management-console comms-hub | Lists comms-hub records. |

## Business gotchas
- `[CODE]` shadow rows — a shadow row is **not** a row-expansion panel. Row-expansion is for one heavy detail panel per row; shadow rows are for *zero-to-many* column-anchored pending changes (`USAGE.md` "When to use shadow rows vs row-expansion"). Picking the wrong one mis-states the business model.
- `[MEMORY]` `project_commchannels_apps_tabs_wave17` — an **empty table usually means a backend gap, not a UI fault**. The Comm Channels / Apps tabs load live Commerce data; an empty grid is a node with no services OR a seed/visibility gap, not a broken table.
- `[CODE]` `API.md` — `availableActions[]` is **backend-computed FSM output**. The frontend must not invent its own "can I do X" logic — it renders the actions the backend already decided are legal for that row's state.
- `[CODE]` `emptyMessageKey` does NOT translate — the component never calls an i18n service; the consumer pre-translates via `emptyMessage`. An "empty list" message that shows a raw key is a wiring mistake, not a missing translation.

## Verification
🟡 CODE-DERIVED, RE-VERIFIED 2026-06-03 (B08) from the dossier files (themselves source-grounded) + `falcon-data-table.component.ts` (1612 ln) + `[MEMORY]` org-hierarchy entries. The users list, Comm Channels and Apps tabs are confirmed-working features per `[MEMORY]` Wave 17 — ✅ for those flows. Shadow rows are ✅ shipped (Wave 20/21) with a production consumer (admin/mgmt applications-table, Wave 22C/D). Business rules re-confirmed; the `availableActions[]`-FSM + `rowActions` predicate gating is unchanged.
