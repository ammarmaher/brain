---
name: Web Platform v2 rebuild strategy
description: Agreed architectural direction for rebuilding falcon-web-platform-ui as a new Nx workspace (v2), keeping backend compatibility
type: project
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
**Decision (2026-04-18):** Rebuild the Falcon Web Platform frontend as a **new sibling Nx workspace** (`falcon-web-platform-v2`), not in-place.

**Why:** Current `falcon-web-platform-ui` has a monolithic `@falcon` lib, no enforced Nx boundaries (`[{sourceTag:'*',onlyDependOnLibsWithTags:['*']}]` is a no-op), a broken Tailwind v4 PostCSS pipeline, god components (CommsHubComponent = 1,264 lines), hand-written DTOs, no DTO↔ViewModel mapping, naked .subscribe() calls, and CSS specificity debt from 50+ imports in styles.scss. In-place rebuild invites architectural contamination; parallel workspace keeps old serving prod while new is built.

**How to apply:**
- Keep the architectural *shape* of v1 (host shell + remotes + public SDK + Zitadel OIDC + per-gateway base URLs + signals + facades + HashLocationStrategy) — only the implementation is rebuilt.
- Workspace layout: `apps/{shell, portal-admin, portal-client}`, `libs/{platform, sdk, design-system, domain/<module>, shared}`. Tags are `type:* + scope:* + context:*` with strict eslint boundary rules written BEFORE code.
- Theming: Style-Dictionary-style pipeline — tokens.ts compiles to CSS vars + Tailwind v4 preset + PrimeNG 20 preset (via `definePreset` from Aura). No raw hex, no `::ng-deep`, no raw PrimeNG class names in features — everything wrapped in `libs/design-system/primitives/`.
- Backend: OpenAPI codegen into `libs/domain/<module>/data-access/generated/`, hand-written DTOs banned, data-access exports ViewModels via `resource()` signals, components never inject HttpClient.
- Cutover: reverse-proxy per-route; freeze v1 to bug fixes only; no dual-write across v1 and v2.

**First module to build (Phase 3):** Users — exercises every layer and becomes the blueprint extracted into an Nx generator (`nx g @falcon/workspace:domain <name>`).

**Phase order for Phase 4 waves:** Permissions → Accounts → Roles → Contact Groups → Billing/Charges → Templates → Channels → Schedules → Media → Conversations → Audit → Reporting → Workflows → AI → Notifications.

**First day of concrete work:** (1) delete abandoned `falcon-web-platform-ui/new-front/`, (2) spike Tailwind v4 fix in v1 by migrating host-shell to `@angular/build:application`, (3) stand up empty v2 workspace with Nx tags + eslint boundary rules before any code, (4) design-token build pipeline, (5) write 10 ADRs (workspace, theming, state, codegen, MFE, auth, permissions, error handling, testing, deployment).

**Reference business modules to cover** (from falcon-wiki): Account Mgmt, User Mgmt, Contact Groups, Permissions (PBAC), Contracts/Balance/Charge/Billing, Templates, Schedules, Media, Notifications, Conversations, Audit/OSS, Reporting (ClickHouse), Workflow Engine, AI, Voice, WhatsApp, Micro-App Hosting — ~17 skeleton modules + 5-10 app-layer MFEs.
