# Organization Hierarchy — Page Overview

**Page identity:** Organization Hierarchy (admin-console)
**Route:** `http://localhost:4200/#/admin-console/org-hierarchy-page`
**Owner module:** `apps/admin-console/src/app/features/org-hierarchy-page`
**First registry seed date:** 2026-05-14
**Maintained by skill:** `component-capability-upgrade` (page-level extension)

## What this page does

Falcon administrators manage the tenant hierarchy (root → clients → sub-nodes), invite users, manage permissions, view Comm Channels & Services + Apps & Services pricing, configure per-account settings (Password Security Level, Allowed IPs, Limits), and drill into a User Details page.

## Top-level UX surfaces

| Surface | Purpose | Source-of-truth section |
|---|---|---|
| Sidebar (host-shell) | Global navigation | HTML §2 |
| Topbar (host-shell) | Page title + breadcrumb + Search/Notifications/User chip | HTML §1 |
| Tree panel (left, 272px) | Hierarchical clients/nodes with kebab actions | HTML §4 |
| Tab strip | Hierarchy / CommChannels / Apps&Services / Settings | HTML §5 |
| View toggle (Hierarchy tab only) | List vs Tree (chart) view | HTML §5 + §18 |
| Users table | Username/FirstName/Email/Phone/Role/PermGroup/Status | HTML §6 |
| Information panel | Drill-in to view/edit node info (view + edit modes) | HTML §11 |
| Apps & Services table | Visibility/Name/Price/Status with row actions | HTML §7 |
| CommChannels & Services table | Same shape, different seed data | HTML §8 |
| Settings tab | Password Security + IPs + Limits | HTML §9 |
| Add Client wizard | 5-step full-page replacement | HTML §12 |
| Add User wizard | 3-step full-page replacement | HTML §13 |
| User Details (drilldown) | View + edit modes with 3 sub-tabs | HTML §22 |
| Node drawer (Add/Edit) | Right-slide single-input drawer | HTML §15 |
| OTP modal | 6-digit verification (60s timer) | HTML §14 |
| Org chart view | Pan/zoom node-card chart with focus mode | HTML §18 |

## Who is supposed to use this page

| Role | Capabilities (per source) |
|---|---|
| Falcon System Admin | Full control: add clients, add nodes, add users, change settings, manage everything |
| Client Account Owner | Manage own organization tree + users within own client only (back-end gated, frontend currently no-op) |
| Restricted users | Most tabs hidden / read-only based on PES permissions (NOT yet wired) |

PES/permission wiring is currently a **GAP** — see `GAP_REGISTRY.md`.

## Apps that host this page

| App | Status |
|---|---|
| `admin-console` | Primary host — actively maintained (target of this registry) |
| `management-console` | Duplicate `organization-hierarchy-page` exists — was using same shared lib components (`<falcon-angular-data-table>` row-action menu now disabled there too per 2026-05-14 library edit) |
| `host-shell` | Hosts the navigation entry (`Org Hierarchy (Admin)`) |

## Current incidence of edits (2026-05-14)

This page has been touched extensively in the last 24-48h:
- Wave 4-15 conversion (React → Angular Tailwind) — landed
- Wave 17.1-17.6 visual polish — landed
- Wave 18 (today) — library deletion of orphan menu + height harmonization + dropdown radius

## Related artifacts

- Source HTML: see [`SOURCE_OF_TRUTH.md`](SOURCE_OF_TRUTH.md)
- Reports ingested: see [`SOURCE_OF_TRUTH.md`](SOURCE_OF_TRUTH.md) "Reports ingested" section
- Score: [`PAGE_SCORECARD.md`](PAGE_SCORECARD.md)
- Rules taxonomy: [`PAGE_RULE_REGISTRY.md`](PAGE_RULE_REGISTRY.md)
- Components used: [`COMPONENT_MAPPING.md`](COMPONENT_MAPPING.md)
