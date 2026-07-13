# Falcon Shared Features — OVERVIEW

> [!note] AREA DOSSIER (SPEC §7 non-component, 5-file set) — CREATED 2026-06-03 (batch L05, ammar-web-platform-ui).
> Covers `libs/falcon/src/shared-features/` — the **feature-level** shared components + services that live in the `@falcon` lib (NOT the atomic `falcon-ui-core` UI kit, NOT the `shared-ui` primitives). These are page-grade, multi-part presentational features that BOTH apps embed via a thin per-app wrapper. Mirror the falcon-input dossier tone; adapted to the 5-file area shape.

## Purpose

`shared-features/` is the home for **presentational feature units that two or more apps share** — each is a self-contained "page or panel" (its own template, config, models, sometimes a signal-state slice and pure validators) that the host/remote app embeds and wires to the backend. The folder embodies the Falcon architecture rule **"Library = presentation, App = API"**: every unit here owns ALL view state but ZERO `HttpClient` — the host wrapper injects the transport and runs the HTTP ([CODE] `service-pricing-table/services/service-pricing-transport.ts:1-8` states the rule verbatim).

This is distinct from:
- `libs/falcon-ui-core` — the atomic dual-render UI kit (`<falcon-angular-*>`), documented per-component in `understanding/frontend/components/`.
- `libs/falcon/src/shared-ui/lib/components` — smaller reusable Angular components (otp-dialog, node-details-section, etc.).
- `libs/falcon/src/shared-ui/lib/directives` — the directive bundle (batch B23).

## Inventory (5 feature units)

| Unit | Selector | Kind | Source root |
|---|---|---|---|
| **comm-mkt-view** | `app-comm-mkt-view` | Multi-part page (view + 3 sub-components + config + model) | `shared-features/comm-mkt-view/` |
| **service-pricing-table** | `falcon-service-pricing-table` | Multi-part page (table + models + transport contract + pure validators) | `shared-features/service-pricing-table/` |
| **user-details** | `app-user-details-page` | Page + per-instance signal-state slice + pure validators + models | `shared-features/user-details/` |
| **org-node-avatar** | `app-org-node-avatar` | Pure presentational primitive (+ NodeIdentity model) | `shared-features/org-node-avatar/` |
| **falcon-brand-logo** | `app-falcon-brand-logo` | Pure presentational primitive (inline brand SVG) | `shared-features/falcon-brand-logo/` |

**File count: 29 source files** ([CODE] recursive listing of `shared-features/` 2026-06-03 — 28 `.ts`/`.html` + 0 `.css`/`.scss`; note ZERO SCSS — the area is Tailwind-only, see AUDIT.md C). Spec/test files: 0 IN-FOLDER (`user-details` parity covered by `tools/validation-tests/user-profile-name-validations.test.ts`).

## Business / UI use case (per unit)

- **comm-mkt-view** — the shared mgmt **Communication Channels** + **Marketplace Applications** Client-facing page, SoT-ported from a React `CommMktPage`. Renders a service catalog as either a card grid OR a data-table list (persisted per-kind), with status filtering, a read-only "pending price change" shadow band, and a row/card action set (Disable / Enable / Do Payment) gated identically for both views ([CODE] `comm-mkt-view.config.ts:185-257`).
- **service-pricing-table** — the ONE consolidated **Apps & Services / Communication Channels pricing** table for the Falcon-admin org-hierarchy. Owns inline shadow-row edit forms (price-type + effective-date, price-value), delete-confirm via the message orchestrator, calendar business rules mirrored from the backend, and visibility toggles. Replaced 4 near-identical copies ([CODE] `service-pricing-table.component.ts:1-13`).
- **user-details** — the **User drilldown / Edit User V2** screen: 3 view tabs (Personal / Role / Permissions), per-field PES edit-grants, status-transition matrix, OTP verify for phone/email, avatar upload, and a profile→status→role sequential save chain. Works both as a routed page (via app wrapper) AND embedded in a panel; also serves `/profile` self-mode ([CODE] `user-details-page.component.ts:1-8`).
- **org-node-avatar** — renders a node's visual identity (Falcon brand SVG / `<img>` / initials chip) from one `NodeIdentity` descriptor. Replaces an ad-hoc `@if imageUrl … @else initials` block that was duplicated across wizard chrome, header strip, and drawer context-card and missed the Falcon-brand branch ([CODE] `org-node-avatar.component.ts:1-16`).
- **falcon-brand-logo** — single source of truth for the Falcon stylised-F brand glyph (admin-console copies extracted into one component); 100%×100% of host, `fill="currentColor"` ([CODE] `falcon-brand-logo.component.ts:1-22`).

## When to use / when NOT

- **Use** a `shared-features` unit when the SAME page/panel must appear in both admin-console and management-console (or host-shell + a remote) and differs only by a discriminator input (`kind` / `perspective` / `userId`). Add a thin per-app wrapper that injects the transport + handles navigation.
- **Do NOT** put `HttpClient` calls, route definitions, or app-specific navigation here — those belong in the app wrapper. Do NOT add a new atomic UI primitive here (that goes to `falcon-ui-core` via the falcon-component-creation skill).

## Status

- **ACTIVE / SHARED.** All 5 units are live with real consumers (see USAGE Consumer Sweep). `comm-mkt-view`, `service-pricing-table`, `user-details` are heavy, recently-evolved features (dense Wave/BUG provenance comments dated through 2026-06-03). `org-node-avatar` + `falcon-brand-logo` are small stable primitives.

## Full source-file path table

| Unit | File | Role |
|---|---|---|
| comm-mkt-view | `comm-mkt-view/comm-mkt-view.component.ts` | View component (`app-comm-mkt-view`) |
| | `comm-mkt-view/comm-mkt-view.component.html` | Template (list + grid) |
| | `comm-mkt-view/comm-mkt-view.config.ts` | kind config + action catalog + status/icon helpers |
| | `comm-mkt-view/models/comm-mkt-view.model.ts` | `CommMktItem` / `CommMktPending` / view-mode types |
| | `comm-mkt-view/components/card/comm-mkt-card.component.ts` | Grid card sub-component |
| | `comm-mkt-view/components/service-icon/comm-mkt-service-icon.component.ts` | Inline brand-glyph SVG sub-component |
| | `comm-mkt-view/components/view-toggle/comm-mkt-view-toggle.component.ts` | list/grid toggle sub-component |
| | `comm-mkt-view/index.ts` | Barrel |
| service-pricing-table | `service-pricing-table/service-pricing-table.component.ts` | Table component (`falcon-service-pricing-table`) + 6 output event types |
| | `service-pricing-table/service-pricing-table.component.html` | Template |
| | `service-pricing-table/service-pricing-kind.ts` | `ServicePricingKind` discriminator |
| | `service-pricing-table/models/models.ts` | Wire DTOs + view-models + ServiceRow→ApplicationRow adapter |
| | `service-pricing-table/models/table-config.ts` | Stateless column + row-action builders + PES flags |
| | `service-pricing-table/services/service-pricing-transport.ts` | Transport CONTRACT (interface + `SERVICE_PRICING_TRANSPORT` token) |
| | `service-pricing-table/validations/validations.ts` | Pure effective-date validators + `SERVICE_PRICING_VALIDATIONS` token/provider |
| | `service-pricing-table/index.ts` | Barrel |
| user-details | `user-details/components/user-details-page.component.ts` | Page (`app-user-details-page`) — thin orchestrator/view |
| | `user-details/components/user-details-page.component.html` | Template (3 tabs + edit) |
| | `user-details/signals/signals.ts` | `UserDetailsStateSlice` (per-instance signal store) |
| | `user-details/validations/validations.ts` | Pure field validators |
| | `user-details/models/user-details.models.ts` | `User` UI model + enum maps + `mapUserResponseToUser` |
| | `user-details/models/index.ts` | Models barrel |
| | `user-details/index.ts` | Barrel |
| org-node-avatar | `org-node-avatar/org-node-avatar.component.ts` | Component (`app-org-node-avatar`) |
| | `org-node-avatar/org-node-avatar.component.html` | Template (3-way `@switch`) |
| | `org-node-avatar/models/models.ts` | `NodeIdentity` / `NodeIdentityKind` / `OrgNodeAvatarSize` |
| | `org-node-avatar/index.ts` | Barrel |
| falcon-brand-logo | `falcon-brand-logo/falcon-brand-logo.component.ts` | Component (`app-falcon-brand-logo`) — inline SVG |
| | `falcon-brand-logo/index.ts` | Barrel |

## Selectors / tags

- `app-comm-mkt-view`, `falcon-service-pricing-table`, `app-user-details-page`, `app-org-node-avatar`, `app-falcon-brand-logo`.
- Note the **`app-` prefix on 4 of 5** (host-shell convention) vs `falcon-` on the service-pricing table only — a minor naming inconsistency (AUDIT C/F).

## Known consumers (high-level — full list in USAGE Consumer Sweep)

- **comm-mkt-view** → mgmt `comms-hub` + `marketplace-applications` (2 wrappers).
- **service-pricing-table** → host-shell `shared-components/service-pricing` (one wrapper consumed by admin `marketplace-applications` + `comm-channels-services`).
- **user-details** → host-shell `user-details-route` + `user-profile-route`; embedded by admin + mgmt `org-hierarchy-page-menu`.
- **org-node-avatar** / **falcon-brand-logo** → admin + mgmt org-hierarchy chrome (context-card, sibling-chip, node-header, node-details-section).

## Related areas

- `understanding/frontend/components/falcon-input` (gold reference) + the `falcon-ui-core` family these features compose (data-table, dropdown, date-picker, status-badge, tabs, switch, phone/email field).
- `understanding/frontend/form-validation` (batch L05 sibling) — the validation system these features plug into; `user-details/validations` deliberately mirrors `falcon-validations.ts personName`.
- `understanding/frontend/sdk` — the `@falcon/sdk` ports these features depend on (`USER_DETAILS_GATEWAY`, `FALCON_NOTIFIER`, `FalconMessageOrchestratorService`).
- `understanding/frontend/shared-utils` (batch L03) — `ServiceOperationResult`, `FalconItemStatus`, status-style maps these features consume.

## Ownership / Responsibility

- Owned by the `@falcon` lib (`libs/falcon`). Each unit is its own folder following the folder-doctrine slices (component / models / signals / validations / services / config).
- The presentation/transport split is enforced by convention + the `SERVICE_PRICING_TRANSPORT` / `USER_DETAILS_GATEWAY` DI tokens — NOT by lint (AUDIT F).

## Verification
🟢 code-verified 2026-06-03 (L05) — inventory + selectors + roles confirmed via recursive listing of `shared-features/` and reading every main component, config, model, signal-slice, transport, and validations file. Consumer high-level map confirmed via Grep of all 5 selectors + class names + DI tokens across `apps/` + `libs/falcon/` (full file list in USAGE). 🟡 only on the "ZERO SCSS" claim being a folder-wide assertion (verified by the recursive find returning no `.scss`/`.css`).
