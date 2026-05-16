# Phase 6 — Backend / API Integration Discovery & Plan

**Run:** 2026-05-14 — Brain SK Night Shift
**Target feature:** `apps/admin-console/src/app/features/org-hierarchy-page/`

---

## TL;DR

✅ A complete **facade contract** for hierarchy data already exists in `@falcon/sdk` as `HierarchyFacade`.
⚠️ **ZERO concrete implementations** of that facade exist anywhere in the workspace today.
✅ One backend HTTP endpoint exists: `GET commerce/Node` (gateway-routed) returns `ServiceOperationResult<OrgHierarchyNode[]>`.
🟠 The feature must provide its own **mock-first concrete implementation** of `HierarchyFacade`, calling `NodeService` for tree data and falling back to in-memory mocks for everything else until backend endpoints land.
🟢 OTP behavior (`all zeros pass / anything else fails`) is **client-side mock only** per task spec — no backend dependency in this wave.

---

## 1. The facade contract — `HierarchyFacade`

**Location:** `libs/sdk/src/facades/HierarchyFacade.ts`
**Token:** `HIERARCHY_FACADE` (Angular `InjectionToken`)

### Methods

| Method | Returns | Notes |
|---|---|---|
| `getTree()` | `Promise<ClientNode>` | Root node + children |
| `getUsers(nodeId)` | `Promise<User[]>` | Users belonging to a node |
| `getInfoPanel(nodeId)` | `Promise<NodeDossier>` | 17-field client dossier |
| `permissions(nodeId)` | `Promise<HierarchyPermissions>` | canCreateUser / canCreateNode / canEditNode |
| `createClient(payload)` | `Promise<ClientNode>` | Add-Client wizard finish |
| `createSubNode(parentId, payload)` | `Promise<ClientNode>` | Add-Node drawer |
| `changeNodeName(nodeId, payload)` | `Promise<void>` | Edit-Node drawer |
| `createUser(nodeId, payload)` | `Promise<User>` | Add-User wizard finish |
| `addNode(parentId, name)` | `Promise<ClientNode>` | Single-input add (W8 shortcut) |
| `editNode(nodeId, name)` | `Promise<void>` | Single-input rename |
| `invalidate(scope, nodeId?)` | `void` | Cache invalidation: `'tree' \| 'users' \| 'info' \| 'all'` |

### Types

```ts
type HierarchyNodeType = 'root' | 'client' | 'sub-node';
type HierarchyUserStatus = 'active' | 'pending' | 'suspended' | 'locked' | 'deleted';

interface ClientNode { id; type; name; brand?; clientId?; users?: User[]; children?: ClientNode[] }
interface User { id; username; firstName; email; phone; role; permGroup; status }
interface NodeDossier { /* 17 fields — accountName, financeId, classification, ... */ }
interface NewClientPayload { name; brand?; dossier?: Partial<NodeDossier> }
interface NewSubNodePayload { name }
interface NewUserPayload { username; firstName; email; phone; role; permGroup; status? }
interface HierarchyPermissions { canCreateUser; canCreateNode; canEditNode }
```

**Verdict:** Contract is rich enough for the entire UI surface — including the 17-field info panel sourced from React `hierarchy.jsx:954-998`. No facade extension needed in Wave 1.

## 2. Concrete implementation status

Grep `implements HierarchyFacade | HIERARCHY_FACADE` across the entire workspace:

| Match | File |
|---|---|
| 1 (the contract itself) | `libs/sdk/src/facades/HierarchyFacade.ts` |

**Zero providers, zero implementations.** This means:

- Any consumer wiring `inject(HIERARCHY_FACADE)` today gets a NullInjector error.
- The new admin-console feature **must ship its own implementation** in `services/`.

## 3. Real backend surface available today

### `NodeService` (libs/falcon/src/core/lib/services/node.service.ts)

```ts
@Injectable({ providedIn: 'root' })
export class NodeService {
  getNode(): Observable<ServiceOperationResult<OrgHierarchyNode[]>>;
}
```

- HTTP: `GET commerce/Node` via gateway (`useGateway()`)
- Returns array of `OrgHierarchyNode` (different shape than `ClientNode` — adapter needed)
- Used today by `AuthService` post-login to bootstrap the user's node context

### `OrgHierarchyNode` shape (libs/falcon/src/shared-types/lib/models/globals.ts:180)

```ts
{ id: string|null, label: string, tenantId?, icon?, url?, hasChildren, children?, isRootNode?, isMainMenu?, isFalconNode?, isFirstLevelChild? }
```

**Adapter target:** Map `OrgHierarchyNode` → `ClientNode` in the new feature's HierarchyFacade impl:
- `label` → `name`
- `isRootNode ? 'root' : (isFirstLevelChild ? 'client' : 'sub-node')` → `type`
- `icon` → `brand` (visual mapping)
- `tenantId` → `clientId`
- Recurse on `children`

### `ServiceOperationResult<T>` wrapper

```ts
{ isSuccessful, result, errorCodes, errors }
```

All backend responses use this — the implementation should unwrap and surface errors via `FALCON_NOTIFIER`.

### `FALCON_ROOT_NODE` constant

Pre-canned root node available for offline/preview rendering.

## 4. Other related services found

| Service | Purpose | Used? |
|---|---|---|
| `NodeService` (commerce/Node) | Get tree | YES — by AuthService |
| `session-provider.service.ts` | Session bootstrap | YES |
| No `UserService` for hierarchy users | not in libs/falcon/core | **GAP** |
| No `OtpService` | not in libs/falcon/core | OK — per spec, OTP is client-side mock |
| No `VerificationService` | not in libs/falcon/core | OK — phone/email verify is OTP-popup driven |
| No `InfoPanelService` / `DossierService` | not present | **GAP — mock for now** |

## 5. Gaps to backend (document; do NOT attempt to add backend endpoints)

| # | Capability | Status | Mitigation in new feature |
|---|---|:---:|---|
| 1 | `getTree` (real) | ✅ via NodeService | Adapter wraps NodeService into HierarchyFacade.getTree() |
| 2 | `getUsers(nodeId)` | ❌ no endpoint | In-memory mock; document gap |
| 3 | `getInfoPanel(nodeId)` | ❌ no endpoint | In-memory mock with 17-field dossier |
| 4 | `permissions(nodeId)` | ❌ no endpoint | Default to `{ true, true, true }` for FalconAdmin; document |
| 5 | `createClient(payload)` | ❌ no endpoint | Mock: push to in-memory tree + emit invalidate('tree') |
| 6 | `createSubNode(parentId, payload)` | ❌ no endpoint | Mock |
| 7 | `changeNodeName / addNode / editNode` | ❌ no endpoint | Mock |
| 8 | `createUser(nodeId, payload)` | ❌ no endpoint | Mock: append to in-memory users[] for nodeId |
| 9 | Phone/email OTP send + verify | ❌ no endpoint | Client-side mock; rule = "all zeros pass" |
| 10 | User status transitions | ❌ no endpoint | Mock with status enum |

## 6. Recommended adapter architecture

```
apps/admin-console/src/app/features/org-hierarchy-page/services/
├── services.ts                       # Re-exports state service + facade impl
├── hierarchy-page-state.service.ts   # Page-level signals (selectedNode, viewMode, activeTab, tabUsers, infoOpen)
├── org-hierarchy-mock.facade.ts      # Concrete HierarchyFacade — wraps NodeService for tree, mocks the rest
├── mock-tree.ts                      # Brand-seeded fallback tree (Aramco, Al-Rajhi, SNB, Bupa)
├── mock-users.ts                     # Sample users with all 5 statuses
├── mock-dossiers.ts                  # 17-field dossiers per seed node
└── otp-mock.service.ts               # Client-side OTP validator (all-zeros rule)

apps/admin-console/src/app/features/org-hierarchy-page/org-hierarchy-page.routes.ts
└── provides HIERARCHY_FACADE useClass: OrgHierarchyMockFacade
```

**Provider wiring (in the feature's route file):**

```ts
import { HIERARCHY_FACADE } from '@falcon/sdk';
import { OrgHierarchyMockFacade } from './services/services';

export const orgHierarchyPageRoutes: Routes = [{
  path: '',
  loadComponent: () => import('./components/org-hierarchy-page-menu.component')
    .then(m => m.OrgHierarchyPageMenuComponent),
  providers: [
    { provide: HIERARCHY_FACADE, useClass: OrgHierarchyMockFacade },
    HierarchyPageStateService,
  ],
}];
```

When backend endpoints land, swap `useClass` for a real implementation in `services/org-hierarchy-real.facade.ts` (gated by env flag in admin-console's app.config.ts).

## 7. Mock data seeds (sourced from React `mock-tree.ts` parallel)

| Node | type | brand | mock users |
|---|---|---|---|
| Falcon (root) | `root` | falcon-logo SVG | 0 (placeholder list) |
| Aramco | `client` | green Aramco SVG | 4 users (active, pending, suspended) |
| Al-Rajhi | `client` | red Al-Rajhi SVG | 3 users |
| SNB | `client` | green SNB SVG | 2 users |
| Bupa | `client` | blue Bupa SVG | 3 users |
| HR (under Aramco) | `sub-node` | yellow HR chip | 1 user |
| DB (under Al-Rajhi) | `sub-node` | blue DB chip | 1 user |
| CC (under SNB) | `sub-node` | purple CC chip | 1 user |

(Final seed list reconciled with HTML/React discovery outputs in Phase 4 component mapping.)

## 8. Menu integration backend touchpoint

The new menu item lives in `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.{ts,html}`.

- Real-mode: NavItem[] is supplied by `LayoutComponent` (host-shell), which itself sources items from a route-resolver or runtime config (TBD in Phase 5).
- Mock-mode (preview): `MOCK_SECTIONS.account.orgHierarchy` already references `FALCON_ICONS.ORGANIZATION` (= `'organization-hierarchy'`).

**For the new feature**, we will:
1. Register the admin-console route `org-hierarchy-page`.
2. Surface it via the federated `loadRemoteModule('admin_console', './admin-console')` flow already used in `host-shell` for `preview-shell`.
3. Either (a) add a NavItem entry to whatever feeds LayoutComponent in real-mode, or (b) extend MOCK_SECTIONS with an `orgHierarchyPage` entry routed to `/admin-console/org-hierarchy-page`.

Final choice picked in Phase 5 (architecture plan) after structure-discovery agent confirms LayoutComponent's NavItem source.

## 9. Integration readiness scores

| Area | Ready % | Notes |
|---|:---:|---|
| Tree fetch (real backend) | 80 % | adapter trivial, model mismatch only |
| Users / Dossier / Permissions (mocked) | 100 % | for this wave |
| Mutations (createClient, createUser, etc.) | 100 % | mocked |
| OTP behavior | 100 % | client-side mock-rule satisfied |
| Menu integration | 70 % | needs Phase 5 decision (real-mode vs preview-mode) |
| Backend replaceability | 100 % | facade lets us swap `useClass` later |

## 10. Action items captured

1. ⚓ Build `OrgHierarchyMockFacade implements HierarchyFacade` in the new feature
2. ⚓ Adapter: `OrgHierarchyNode` → `ClientNode` mapping
3. ⚓ Three mock files: `mock-tree.ts`, `mock-users.ts`, `mock-dossiers.ts`
4. ⚓ Client-side `OtpMockService` (`code === '0000'` passes)
5. 🚩 Wire `HIERARCHY_FACADE` provider in `org-hierarchy-page.routes.ts`
6. 🚩 Document the backend-gap action items in `gaps-and-next-actions.md` for follow-up tickets
7. 🚩 Plan a `OrgHierarchyRealFacade` skeleton with `// TODO backend` placeholders for each unimplemented endpoint
