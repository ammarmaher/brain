# falcon-status-badge — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` Renders the **lifecycle / workflow status of a domain entity** as a single, instantly-readable pill. In business terms it is the answer to "*where is this thing in its lifecycle?*" for a user, an account/node, or a service/application row. It is the canonical visual for **state-on-a-list** — every org-hierarchy list, every service table, every user grid uses it to tell the operator, at a glance and consistently across the whole platform, whether a row is live, waiting, frozen, or gone.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| `[CODE]` Every user/node row carries a lifecycle status | `[CODE]` org-hierarchy-page-menu.component.{html,ts} (both consoles) | The org-hierarchy menu renders this badge for node/user status; status drives row actions (e.g. a `deleted` row routes user-details with `includeDeleted=true` — `[MEMORY]` `project_pr40937_include_deleted_lift`). |
| `[CODE]` Contact-group rows carry a status | `[CODE]` contact-groups-list.component.html:143-148 (both consoles) | The status column cell renders `<falcon-angular-status-badge [severity]="statusSeverity(row)" [label]="statusLabel(row)">`. |
| `[CODE]` Service/application + contract rows carry an enable/lifecycle status | `[CODE]` add-client-wizard/{client-applications-step,client-comm-channels-step} + contracts-cost-management/contracts-view-contract | Rows render the badge with the service-status set (`inactive`/`paid`/`expired`/`disabled`); `eFalconServiceStatus` from the backend maps onto these severities. |
| `[CODE]` Shared comm-mkt / pricing / user-details views carry status | `[CODE]` libs/falcon shared-features comm-mkt-view / service-pricing-table / user-details | The badge is the status visual across the shared feature surfaces. |
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
| Organization Hierarchy — node / user list | both consoles `org-hierarchy-page-menu` | Status pill per node/user row; status gates row actions. |
| Contact Groups list | both consoles `contact-groups-list` | Status column cell (`falconDataTableCell field="status"`). |
| Contracts & Cost Management | both consoles `contracts-cost-management` / `contracts-view-contract` | Contract/service status pill. |
| Add Client — applications / comm-channels steps | admin-console `add-client-wizard` | Service-status pill during client creation. |
| Shared comm-mkt / pricing / user-details | `libs/falcon` shared-features | Canonical status-cell render across shared surfaces. |

## Business gotchas
- The 9→4 map means **`suspended`, `locked`, `inactive`, `disabled` are visually identical** (all neutral grey) — the operator distinguishes them by the *label text*, not the color. A builder must never drop the label to "just the dot" for a neutral-bucket status without an `aria-label`, or the four states become indistinguishable.
- `paid` is a **success-bucket service status**, not a payment receipt — it means the service row is settled; do not reuse it as a generic "payment succeeded" toast color.
- `pending` (warning/amber) is the same status a newly-created user lands in (`[MEMORY]` falcon-dropdown `BUSINESS.md` — user status is `Pending` at creation, never operator-chosen). The badge surfaces that lifecycle outcome; it is not an editable choice.
- This is **not `<falcon-tag>`** — `<falcon-tag>`'s 7 `severity` values are a generic palette; `<falcon-status-badge>`'s 9 values are domain status enums. Using `<falcon-tag severity="warning">` for a `pending` account is semantically wrong even if it looks the same.
- `[CODE]` **Historic non-adoption is now resolved** — the component is broadly composed (16 app files / 21 + 4 lib / 5, 2026-06-03). Any residual hand-rolled `bg-falcon-{color}-50 text-falcon-{color}-700` chip is a per-page leftover, not the norm; hand-rolled chips drift from the SSOT bucket map (two pages showing the same status in different colors), so always compose the shared component.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B10) — the 9-severity → 4-bucket map confirmed in `[CODE]` `falcon-status-badge.types.ts:6-17`, `falcon-status-badge.component.ts:23-34`, `status-badge.tokens.css:33-73`. Consumer use ✅ VERIFIED present in source (Consumer Sweep — 16 app files / 21 occurrences + 4 lib files / 5; corrects the prior "6"). Organization Hierarchy is a `[MEMORY]`-confirmed working feature. Soft-delete `deleted`-status visibility ✅ VERIFIED via `[MEMORY]` `project_pr40937_include_deleted_lift`.
