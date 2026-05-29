# falcon-status-badge — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` Renders the **lifecycle / workflow status of a domain entity** as a single, instantly-readable pill. In business terms it is the answer to "*where is this thing in its lifecycle?*" for a user, an account/node, or a service/application row. It is the canonical visual for **state-on-a-list** — every org-hierarchy list, every service table, every user grid uses it to tell the operator, at a glance and consistently across the whole platform, whether a row is live, waiting, frozen, or gone.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| `[CODE]` Every user/node row carries a lifecycle status | `[CODE]` `USAGE.md:76-77` — `org-hierarchy-page-menu.component.{html,ts}` | The org-hierarchy menu renders this badge for node/user status; status drives row actions (e.g. a `deleted` row routes user-details with `includeDeleted=true` — `[MEMORY]` `project_pr40937_include_deleted_lift`). |
| `[CODE]` Service/application rows carry an enable/lifecycle status | `[CODE]` `USAGE.md:78-80` — `applications-table` + `client-service-row-table` | Service rows render the badge with the service-status set (`inactive`/`paid`/`expired`/`disabled`); `eFalconServiceStatus` from the backend maps onto these severities. |
| `[CODE]` Comms hub entries carry a status | `[CODE]` `USAGE.md:81` — management-console `comms-hub.component.html` | The badge is the status visual on the client-facing comms hub list. |
| `[INFERRED]` Soft-deleted entities remain visible to Falcon admins | `[MEMORY]` `project_pr40937_include_deleted_lift` | The `deleted` severity (danger bucket) is the visual marker for a soft-deleted row that a Falcon admin can still see. |

## Business constraints baked in — STATUS ENUM → VISUAL BUCKET MAP
`[CODE]` `falcon-status-badge.types.ts:6-15` / `status-badge.tokens.css` / `API.md:48-56` The component owns a **fixed 9-severity vocabulary collapsing into 4 visual buckets**. This map is the *single source of truth for status color* on the platform (`OVERVIEW.md:47`):

| Domain status (`severity`) | Visual bucket | Meaning in business terms | bg / fg / dot tokens |
|---|---|---|---|
| `active` | **Success** (green) | entity is live and operating | `green-200` / `green-700` / `green-500` |
| `paid` | **Success** (green) | a service row is settled / paid-up | `green-200` / `green-700` / `green-500` |
| `pending` | **Warning** (amber) | entity is waiting on an action / approval (e.g. a newly created user — see falcon-dropdown `BUSINESS.md`, user status defaults to Pending at creation) | `amber-50` / `amber-700` / `amber-500` |
| `suspended` | **Neutral** (grey) | entity is temporarily halted | `neutral-175` / `neutral-700` / `neutral-500` |
| `locked` | **Neutral** (grey) | entity is access-frozen | `neutral-175` / `neutral-700` / `neutral-500` |
| `inactive` | **Neutral** (grey) | a service row is not currently active | `neutral-175` / `neutral-700` / `neutral-500` |
| `disabled` | **Neutral** (grey) | a service row has been switched off | `neutral-175` / `neutral-700` / `neutral-500` |
| `deleted` | **Danger** (red) | entity is soft-deleted | `red-100` / `red-700` / `red-500` |
| `expired` | **Danger** (red) | a service row's term has lapsed | `red-100` / `red-700` / `red-500` |

`[CODE]` `falcon-status-badge.component.ts:19-22` The **first 5** (`active`/`pending`/`suspended`/`locked`/`deleted`) mirror the React V0.2 `.status-badge` **user-status** set; the remaining 4 (`inactive`/`paid`/`expired`/`disabled`) extend the badge for **service / application row** status. This split is documented directly in the wrapper source comment.

Other baked-in constraints:
- `[CODE]` `falcon-status-badge.component.ts:45-51` **`severity` defaults to `active`** — a null/undefined severity coerces to `active`. A builder must pass the real status; the renderer does not invent "unknown".
- `[CODE]` `API.md:48` / `USAGE.md:52` **An arbitrary string is rejected by the TS type** — only the 9 values compile; an off-vocabulary value falls back to the neutral bucket.
- `[CODE]` `API.md:17` **The component does not translate** — `[label]` must be passed *pre-translated* by the consumer (e.g. `('status.' + value) | translate`). The badge owns the *color*, the consumer owns the *words*.
- `[CODE]` `API.md:75` / `TOKENS.md:43` **Color buckets are WCAG-AA contrast-tested** against the React V0.2 reference — overriding a bucket bg without revalidating contrast breaks an accessibility guarantee.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Organization Hierarchy — node / user list | admin-console `org-hierarchy-page-menu` | Status pill per node/user row; status gates row actions. |
| Applications / services table | admin-console org-hierarchy `applications-table` | Service-status pill per service row (`inactive`/`paid`/`expired`/`disabled`/`active`). |
| Add Client — service row table | admin-console `add-client-wizard/client-service-row-table` | Service-status pill during client creation. |
| Comms hub | management-console `comms-hub` | Status pill on client-facing comms entries. |
| User / account list cells | any list via `<ng-template falconDataTableCell="status">` | Canonical status-cell render. |

## Business gotchas
- The 9→4 map means **`suspended`, `locked`, `inactive`, `disabled` are visually identical** (all neutral grey) — the operator distinguishes them by the *label text*, not the color. A builder must never drop the label to "just the dot" for a neutral-bucket status without an `aria-label`, or the four states become indistinguishable.
- `paid` is a **success-bucket service status**, not a payment receipt — it means the service row is settled; do not reuse it as a generic "payment succeeded" toast color.
- `pending` (warning/amber) is the same status a newly-created user lands in (`[MEMORY]` falcon-dropdown `BUSINESS.md` — user status is `Pending` at creation, never operator-chosen). The badge surfaces that lifecycle outcome; it is not an editable choice.
- This is **not `<falcon-tag>`** — `<falcon-tag>`'s 7 `severity` values are a generic palette; `<falcon-status-badge>`'s 9 values are domain status enums. Using `<falcon-tag severity="warning">` for a `pending` account is semantically wrong even if it looks the same.
- `[CODE]` `OVERVIEW.md:37` / `GAPS_AND_UPGRADES.md:7` **The biggest business risk is non-adoption** — admin-console `organization-hierarchy-menu.component.html:162-195` historically hand-rolled status chips in raw Tailwind. Hand-rolled chips drift from the SSOT bucket map, so two pages can show the same status in different colors. Always compose the shared component.

## Verification
✅ VERIFIED — the 9-severity → 4-bucket map is confirmed in `[CODE]` `falcon-status-badge.types.ts:6-15`, `falcon-status-badge.component.ts:19-32`, and `status-badge.tokens.css` (per `TOKENS.md:19-27`). Consumer use in org-hierarchy / applications-table / comms-hub is ✅ VERIFIED present in source (`USAGE.md:74-81`, 6 files). The Organization Hierarchy page is a `[MEMORY]`-confirmed working feature. Soft-delete `deleted`-status visibility is ✅ VERIFIED via `[MEMORY]` `project_pr40937_include_deleted_lift` (landed 2026-05-17).
