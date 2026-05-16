---
type: page-dataset
app: admin-console
feature: comms-hub
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: Deep-Dive Agent P3
---

# Comms Hub — Communication Channels & Services (Admin Console)

## TL;DR

`comms-hub` is the Falcon-user (System Gateway) screen for managing the per-account list of **communication channels / services** (one row per channel like SMS, Email, WhatsApp, etc. provisioned to the selected hierarchy node). It is a 30 / 70 split-pane page: an organization-hierarchy tree on the left selects a node, and a `<falcon-table>` on the right lists that node's comm channels with inline-edit, visibility toggle, disable / enable, do-payment, and pending price-change details. All CRUD goes through the **Core Commerce service** under `commerce/Node/...` via the System Gateway.

This is **NOT** a list of channel definitions (Twilio/SMTP providers, etc.) — there are no provider integration endpoints. It is the **per-account commercial subscription** view of channels: which channels exist for this node, their pricing type/value, status, activation/renew dates, visibility, and pending price-change requests. Channel templates and provider configs do not appear in this feature.

## Manifest

- [[01-ROUTING]] — 1 route, 2 guards (route-level `shellAccessGuard` + global `adminConsoleGuard`)
- [[02-COMPONENTS]] — 1 owned component (`CommsHubComponent`); reuses 2 shared dialogs and `<falcon-organization-hierarchy-tree>` + `<falcon-table>`
- [[03-SERVICES-APIS]] — 4 services injected for HTTP; **14 endpoints** mapped (list / visibility / 4 price changes / 4 deletes / disable / enable / do-payment / visible-channels / order-status)
- [[04-DTOS]] — 22 named interfaces / response types (locally-defined CommChannelServiceItem set + the shared CommerceGateway request / response set + dialog DTOs)
- [[05-PES]] — 6 permission keys consulted (1 entry guard + 4 capability flags via `resolveFlags` + 1 nav-level path access)
- [[06-VALIDATIONS]] — 4 inline-edit validations (effective date 3 rules + price value bounds)
- [[07-CROSS-PAGE]] — Heavy inbound coupling to `organization-hierarchy` feature (Commerce gateway + Org API service + models reused). Outbound: owns no shared state.
- [[08-RULES-APPLIED]] — 9 good patterns, 8 bad patterns flagged

## Source files

| File | Role |
|---|---|
| `apps/admin-console/src/app/features/comms-hub/comms-hub.component.ts` | Container component (1264 lines) — owns tree + table + dialogs + edit state |
| `apps/admin-console/src/app/features/comms-hub/comms-hub.component.html` | Template — 6 `<ng-template>` blocks + main 30/70 layout + 2 outer dialogs |
| `apps/admin-console/src/app/features/comms-hub/comms-hub.component.scss` | Styles — 30/70 layout, skeleton, dark/RTL/responsive |
| `apps/admin-console/src/app/features/comms-hub/models/models.ts` | Local DTOs — `CommChannelServiceItem`, price-change request/response, status mapper |
| `apps/admin-console/src/app/features/comms-hub/services/comms-hub.service.ts` | Local list/update API — the only service in `./services`; CRUD lives in CommerceGatewayService |
| `apps/admin-console/src/app/features/routes.ts` | Wires the feature into admin-console at path `comm-mgmt` |
| `apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts` | Reused dialog (drag-drop channel priority list) |
| `apps/admin-console/src/app/shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component.ts` | Reused dialog (warning only) |
| `apps/admin-console/src/app/shared/services/communication-channels-api.service.ts` | Visible-channels endpoint (priority-dialog data source) |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` | Re-used façade — bridges into CommerceGatewayService |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts` | The real HTTP surface — 14 endpoint methods |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/models/models.ts` | Shared request/response DTOs for commerce mutations |
| `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts` | Node tree data (root / children) |
