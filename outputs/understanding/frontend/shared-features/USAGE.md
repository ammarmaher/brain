# Falcon Shared Features — USAGE

> Real codebase usage + the recommended pattern + Consumer Sweep. Cite file:line where load-bearing.

## The shared-feature pattern (recommended new usage)

Every unit follows the **presentation-lib / API-app** split. A new app surface that needs one of these features:

1. Creates a **thin per-app wrapper** component in `apps/<app>/.../shared-components/` (or a feature folder) that:
   - embeds the `<app-*>` / `<falcon-*>` feature selector,
   - provides the concrete transport against the feature's DI token (e.g. `{ provide: SERVICE_PRICING_TRANSPORT, useClass: CommerceGatewayService }`),
   - resolves PES flags + does the HTTP (GET → adapt → feed `[rows]`/`[items]`; mutation outputs → POST/PUT → reload),
   - owns navigation (e.g. handles `(back)`).
2. Binds the discriminator input (`kind` / `userId` / `selfMode` / `perspective`) to select the variant.

This keeps the feature 100% presentational + testable, and lets admin + mgmt reuse it byte-for-byte.

### comm-mkt-view
```html
<!-- mgmt comms-hub / marketplace wrapper -->
<app-comm-mkt-view [kind]="kind" [items]="items()" [loading]="loading()"
                   [error]="error()" [busyRowIds]="busy()"
                   (action)="onAction($event)" />
```
[CODE] consumed by `apps/management-console/.../comms-hub/comms-hub.component.ts` (`kind='commChannels'`) + `.../marketplace-applications/marketplace-applications.component.ts` (`kind='appsServices'`). The wrapper parses backend `details[]` into `pending` via `parseDetailsToPending()` and gates actions with the shared `COMM_MKT_ACTIONS` catalog.

### service-pricing-table
```html
<falcon-service-pricing-table [rows]="rows()" [kind]="kind()" [accessFlags]="flags()"
                              [submitting]="submitting()" [busyRowIds]="busy()"
                              (visibilityToggle)="…" (priceTypeSave)="…" (priceValueSave)="…"
                              (rowAction)="…" (scheduledDelete)="…" (doPaymentRequest)="…" />
```
[CODE] the ONE wrapper is host-shell `shared-components/service-pricing/service-pricing.component.ts` (provides `SERVICE_PRICING_TRANSPORT → CommerceGatewayService`). That wrapper is in turn embedded by admin `marketplace-applications` + `comm-channels-services`. Delete-confirm is delegated to `FalconMessageOrchestratorService.show({ category: 'action-required', … })` ([CODE] `service-pricing-table.component.ts:851-863`) — NOT a local `<falcon-angular-popup>`.

### user-details
```html
<!-- routed: host-shell user-details-route -->
<app-user-details-page [userId]="userId()" [includeDeleted]="includeDeleted()" (back)="goBack()" />
<!-- self profile: host-shell user-profile-route -->
<app-user-details-page [selfMode]="true" (back)="goBack()" />
<!-- embedded: admin/mgmt org-hierarchy-page-menu -->
<app-user-details-page [userId]="selectedUserId" [includeDeleted]="includeDeleted" />
```
[CODE] consumers: `apps/host-shell/.../features/user-details/{user-details-route,user-profile-route}.component.ts` + admin & mgmt `org-hierarchy-page/components/org-hierarchy-page-menu.component.{ts,html}`. The host app provides the `USER_DETAILS_GATEWAY` port (`apps/host-shell/.../core/user/user-api.service.ts`). `selfMode` drives the GET user/me path + the read-only Role/Status/Permissions tabs.

### org-node-avatar / falcon-brand-logo
```html
<app-org-node-avatar [identity]="state.selectedNodeIdentity()" size="md" />
<app-falcon-brand-logo class="w-7 h-7 text-falcon-teal-700" />
```
[CODE] the producer (page state service) classifies a node into `NodeIdentity` (`HierarchyPageStateService.selectedNodeIdentity` per the component doc). `falcon-brand-logo` is sized/colored purely by host Tailwind utilities.

## Do / Don't

| Do | Don't |
|---|---|
| Add a thin app wrapper + provide the transport token | Call `HttpClient` from inside a `shared-features` unit |
| Feed `[rows]`/`[items]` from an adapted GET; handle outputs → mutation → reload | Mutate the `rows()`/`items()` input array in place |
| Resolve PES flags in the wrapper, pass `[accessFlags]` | Re-implement the action-visibility gate at the call site (use `commMktActionVisible` / `buildServiceRowActions`) |
| Route delete-confirm through `FalconMessageOrchestratorService` | Mount a local `<falcon-angular-popup variant="delete">` (the prior pattern, removed) |
| Bind `selfMode` for `/profile`; let the slice load GET user/me | Pass `session.identityUserId` as `[userId]` for self (it can be null → blank page, the historical bug) |
| Pre-compute `NodeIdentity` (incl. the `falcon-brand` branch) in the state service | Re-do `@if imageUrl … @else initials` inline (misses the brand branch — the bug org-node-avatar fixed) |

## Consumer Sweep (Grep-verified 2026-06-03)

Method: `Grep` of all 5 selectors + class names + the 2 introduced DI tokens across `apps/` + `libs/falcon/` (excluding `dist/`).

| Unit | Live consumer files | Count |
|---|---|---|
| **comm-mkt-view** | mgmt `comms-hub.component.ts`, mgmt `marketplace-applications.component.ts` (+ its own sub-components) | **2 app wrappers** |
| **service-pricing-table** | host-shell `service-pricing/service-pricing.component.{ts,html}` (sole wrapper); embedded by admin `marketplace-applications.component.html` + admin `comm-channels-services.component.html` | **1 wrapper, 2 embeds** |
| **user-details** | host-shell `user-details-route.component.ts`, host-shell `user-profile-route.component.ts`; admin `org-hierarchy-page-menu.component.{ts,html}`; mgmt `org-hierarchy-page-menu.component.{ts,html}` | **4 consumer files** |
| **org-node-avatar** | admin + mgmt org-hierarchy: `falcon-org-node-context-card.{ts,html}`, `falcon-org-node-sibling-chip.{ts,html}`, `falcon-org-node-header.component.html`, `hierarchy-page-state.service.ts` (producer); `shared-ui/.../falcon-node-details-section` + its avatar directive | **~10 files (both apps)** |
| **falcon-brand-logo** | admin + mgmt org-hierarchy context-card / sibling-chip / node-header; org-node-avatar reuses the SAME SVG geometry (kept in lockstep by hand) | **~6 files (both apps)** |
| **new-wallet-balance (incidental)** | admin `new-wallet-balance` uses `node-identity.ts` + `NodeIdentity` (the org-node-avatar model) but renders its own avatar markup | model-reuse only |

**Net:** all 5 units are LIVE with real cross-app consumers — none is dormant. `service-pricing-table` + `user-details` are the most heavily wired (each is the sole canonical implementation of a whole page). `org-node-avatar` + `falcon-brand-logo` are the most broadly reused (org-hierarchy chrome in both apps).

## Verification
🟢 code-verified 2026-06-03 (L05) — usage snippets reflect the actual wrapper bindings; Consumer Sweep enumerated by Grep of selectors + class names + `SERVICE_PRICING_TRANSPORT`/`UserDetailsStateSlice` across `apps/` + `libs/falcon/`. 🟡 the org-node-avatar/falcon-brand-logo per-file counts are folder-level approximations (both selectors appear in the same chrome files); the exact file set is in the Grep results captured this pass.
