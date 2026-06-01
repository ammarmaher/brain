---
name: API-interacting code stays in the host app, not the library
description: Architecture rule — services/classes that call the backend API must live in host-shell; the Falcon library is presentation-only
type: feedback
originSessionId: 35b8c7d3-e5bb-4f95-a251-4d5abbc4b7d4
---
Anything that calls or interacts with the backend API — API services, gateway/HTTP service classes, `services/` folders that fetch data — must live in the **host application** (`apps/host-shell`), NOT in the shared library (`libs/falcon`). The host-shell is the layer that owns backend-API interaction. The Falcon library is presentation/UI only.

**Why:** the user's deliberate architecture. The host app is the single place that talks to the backend; the library must stay framework-agnostic, presentation-only, and API-free. A library that calls APIs couples reusable UI to a specific backend wiring.

**How to apply:**
- Never move an API-calling component or its `services/` folder into `libs/falcon`. If a component has a `services/` folder doing HTTP/gateway calls, it belongs in `apps/host-shell/src/app/shared-components/`.
- A library component that needs API data must NOT call the API itself — the host app provides the data/service and the library component "grabs the class" (receives the service via DI / injected token / `@Input`), the pattern already used by `OrganizationHierarchyTreeComponent` (caller injects its own user-loading service).
- Pure presentational shared components with zero API interaction (e.g. `org-node-avatar`, `falcon-brand-logo` — just render an avatar / SVG) MAY live in `libs/falcon/src/shared-features/`.
- `@nx/enforce-module-boundaries` will flag admin-console importing `@host-shell/shared/*` API components cross-app — that boundary error is **accepted/intentional**, not something to "fix" by moving the component to a lib.

**Incident:** during Night Shift Level 3 (2026-05-19) the boundary refactor wrongly moved `OrganizationHierarchyTreeComponent` (has a `services/` folder doing tree-fetch API calls) and `DoPaymentPriorityPopupComponent` (calls payment/order-status APIs) into `libs/falcon`. The user corrected this; both were reverted to `apps/host-shell/src/app/shared-components/` with their `services/` folders intact. `org-node-avatar` + `falcon-brand-logo` (no API) correctly stayed in the library.
