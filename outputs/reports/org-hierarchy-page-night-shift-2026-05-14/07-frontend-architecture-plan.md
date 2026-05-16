# Phase 5 — Frontend Architecture Plan

**Run:** 2026-05-14 — Brain SK Night Shift synthesis
**Target:** `apps/admin-console/src/app/features/org-hierarchy-page/` (91 files / 0 SCSS)
**Inputs:** Agents 1–4 reports + Phase 4 mapping + Phase 6 backend plan

---

## 1. Top-line architectural decisions (locked)

1. **Standalone Angular 21 + Zoneless** — every component standalone, `ChangeDetectionStrategy.OnPush`, signals + `inject()`, control flow `@if`/`@for` (matches Agent 3 §9 conventions verbatim + admin-console's zoneless pilot in `app.config.ts:27`).
2. **Tailwind only, tokens only** — zero SCSS, zero PrimeNG, zero inline hex; replace reference's 3 hex constants (1 `BRAND` + 2 SVG strokes) with `falcon-*` CSS vars during copy.
3. **One consolidated `models.ts` per context** — per `feedback_folder_structure_pattern.md`.
4. **Falcon UI Core (`<falcon-*>`) is the only UI kit.**
5. **Module Federation remote** — admin-console is exposed via `app.routes.ts` (default Routes export). New feature route registered at admin-console root.
6. **Provider pattern** — `HIERARCHY_FACADE` injection token provided at route level (NOT root) so the mock adapter only lives in this feature's DI scope.

## 2. Route registration

### 2.1 admin-console `app.routes.ts` patch

```ts
import { Routes } from '@angular/router';
// import { adminConsoleGuard } from '@falcon';  // re-enable per D-Auth

export const appRoutes: Routes = [
  {
    path: '',
    // canActivate: [adminConsoleGuard],  // Decision: enable in Wave 5 verification
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'organization-hierarchy' },
      {
        path: 'org-hierarchy-page',
        loadChildren: () =>
          import('./features/org-hierarchy-page/org-hierarchy-page.routes').then(
            (m) => m.orgHierarchyPageRoutes,
          ),
        data: { breadcrumb: 'Org Hierarchy' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

export const routes = appRoutes;
export default appRoutes;
```

### 2.2 Feature route file `org-hierarchy-page.routes.ts`

```ts
/*** Org Hierarchy Page route shell — page-scoped DI + child routes. ***/
import { Routes } from '@angular/router';
import { HIERARCHY_FACADE } from '@falcon/sdk';
import { OrgHierarchyMockFacade } from './services/services';
import { HierarchyPageStateService } from './services/hierarchy-page-state.service';

export const orgHierarchyPageRoutes: Routes = [
  {
    path: '',
    providers: [
      { provide: HIERARCHY_FACADE, useClass: OrgHierarchyMockFacade },
      HierarchyPageStateService,
    ],
    loadComponent: () =>
      import('./components/org-hierarchy-page-menu.component').then(
        (m) => m.OrgHierarchyPageMenuComponent,
      ),
    // children: [] — drilldown routes (user details) added in Wave 12
  },
];
```

## 3. Host-shell sidebar patch (Option B from Agent 3 §15)

`apps/host-shell/src/app/layout/layout.component.ts` — add a constant and a NavItem:

```ts
private readonly admin_console_PATH_ORG_HIERARCHY_PAGE =
  `${APP_ROUTES.admin_console_BASE}/org-hierarchy-page`;

// Inside createNavItems(userType), section: 'Account Administration':
{
  label: 'Org Hierarchy (Admin)',
  path: this.admin_console_PATH_ORG_HIERARCHY_PAGE,
  iconClass: FALCON_ICONS.ORGANIZATION,
  section: 'Account Administration',
  scope: AppRouteScope.AdminConsole,
  requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER],
  hidden: isClient,
},
```

This is the ONLY host-shell edit. The new NavItem stands beside the existing "Organization Hierarchy (New Page)" entry that routes to management-console (D7).

## 4. Folder structure (91 files / 43 directories — 1:1 mirror with 2 renames)

See Agent 3 §16 for the full tree. Headline structure:

```
apps/admin-console/src/app/features/org-hierarchy-page/
├── org-hierarchy-page.routes.ts                     [TOP-LEVEL — renamed]
├── guards/        (guards.ts)                       [verbatim]
├── resolvers/     (resolvers.ts)                    [verbatim]
├── models/        (models.ts)                       [verbatim]
├── services/      (services.ts + 5 supporting)      [⚓ verbatim + 🚩 new mock facade]
└── components/
    ├── org-hierarchy-page-menu.component.{ts,html}  [TOP-LEVEL — renamed; selector app-org-hierarchy-page-menu]
    ├── skeleton/
    ├── tab-components/
    │   ├── applications-table/
    │   ├── apps-services-tab/
    │   ├── comm-channels-tab/
    │   ├── settings-tab/
    │   └── hierarchy-tab/
    │       ├── falcon-org-chart/    (subtree: chart-card, chart-toolbar, directives, services, models)
    │       ├── falcon-org-info-panel/
    │       ├── falcon-org-kanban/   (with falcon-org-user-card child)
    │       ├── falcon-org-node-drawer/
    │       ├── falcon-org-node-header/
    │       └── falcon-org-view-toggle/
    └── wizard-components/
        ├── add-client-wizard/  (5 steps + models + services + service-row-table)
        └── add-user-wizard/    (3 steps + models + services)
```

## 5. State management — single page-scoped store

**`HierarchyPageStateService`** (page-scoped via route providers — singleton within feature DI):

```ts
@Injectable()  // NOT providedIn: 'root' — keeps state scoped to the feature
export class HierarchyPageStateService {
  // Tree + selection
  readonly tree = signal<ClientNode | null>(null);
  readonly selectedNodeId = signal<string | null>(null);
  readonly selectedNode = computed(() => findNode(this.tree(), this.selectedNodeId()));

  // View state
  readonly activeTab = signal<TabKey>('hierarchy');
  readonly viewMode  = signal<'list' | 'chart'>('list');
  readonly infoOpen  = signal<boolean>(false);
  readonly editingInfo = signal<boolean>(false);
  readonly editingSettings = signal<boolean>(false);

  // Wizard state
  readonly addClientOpen = signal<boolean>(false);
  readonly addUserOpen = signal<boolean>(false);

  // Drawer state
  readonly nodeDrawerMode = signal<'add' | 'edit' | null>(null);

  // Derived
  readonly visibleTabs = computed<TabKey[]>(() =>
    this.selectedNode()?.type === 'root'
      ? ['hierarchy', 'settings']
      : ['hierarchy', 'commChannels', 'appsServices', 'settings'],
  );

  readonly viewToggleVisible = computed(() => this.activeTab() === 'hierarchy');

  readonly canCreateNode = signal(true);  // wires from HIERARCHY_FACADE.permissions()
  readonly canCreateUser = signal(true);
  readonly canEditNode  = signal(true);

  // Mutations
  selectNode(id: string)            { this.selectedNodeId.set(id); /* + auto-expand + auto-scroll guard */ }
  setActiveTab(t: TabKey)           { this.activeTab.set(t); if (t !== 'hierarchy') this.viewMode.set('list'); }
  setViewMode(v: 'list' | 'chart')  { this.viewMode.set(v); }
  openInfo()  { this.infoOpen.set(true); }
  closeInfo() { this.infoOpen.set(false); this.editingInfo.set(false); }
  openAddClient() { this.addClientOpen.set(true); }
  openAddUser()   { this.addUserOpen.set(true); }
  openAddNode()   { this.nodeDrawerMode.set('add'); }
  openEditNode()  { this.nodeDrawerMode.set('edit'); }
  closeNodeDrawer() { this.nodeDrawerMode.set(null); }
}
```

**Side-effect guard for auto-scroll** — `justClickedRef` flag (Agent 2 §1.3) to distinguish programmatic vs user-click selection (only auto-scroll on programmatic).

## 6. Facade implementation — `OrgHierarchyMockFacade`

```ts
@Injectable()
export class OrgHierarchyMockFacade implements HierarchyFacade {
  private readonly nodeService = inject(NodeService);
  private readonly notifier    = inject(FALCON_NOTIFIER);

  /*** Real backend for tree — adapter from OrgHierarchyNode → ClientNode ***/
  async getTree(): Promise<ClientNode> {
    try {
      const res = await firstValueFrom(this.nodeService.getNode());
      if (!res?.isSuccessful) throw new Error(res?.errors?.[0] ?? 'getTree failed');
      return adaptOrgHierarchyNodeArray(res.result);
    } catch (e) {
      // dev/preview fallback — seed tree
      console.warn('[OrgHierarchyMockFacade] tree fetch failed, using mock seed', e);
      return SEED_TREE;
    }
  }

  /*** Mocked for v1 — backend endpoints not yet available ***/
  async getUsers(nodeId: string): Promise<User[]>            { return SEED_USERS_BY_NODE[nodeId] ?? SEED_USERS; }
  async getInfoPanel(nodeId: string): Promise<NodeDossier>    { return SEED_DOSSIERS[nodeId] ?? EMPTY_DOSSIER; }
  async permissions(nodeId: string): Promise<HierarchyPermissions> { return { canCreateUser: true, canCreateNode: true, canEditNode: true }; }

  /*** Mutations — in-memory; emit invalidate(...) so consumers refresh ***/
  async createClient(p: NewClientPayload): Promise<ClientNode>           { /* push to SEED_TREE.children, return new node */ }
  async createSubNode(parentId: string, p: NewSubNodePayload): Promise<ClientNode> { /* push to parent.children */ }
  async changeNodeName(id: string, p: ChangeNodeNamePayload): Promise<void>        { /* mutate seed */ }
  async addNode(parentId: string, name: string): Promise<ClientNode>                { return this.createSubNode(parentId, { name }); }
  async editNode(id: string, name: string): Promise<void>                          { return this.changeNodeName(id, { name }); }
  async createUser(nodeId: string, p: NewUserPayload): Promise<User>               { /* append to SEED_USERS_BY_NODE[nodeId] */ }

  invalidate(scope: HierarchyInvalidateScope, nodeId?: string): void               { /* no-op for mock; real impl would clear cache */ }
}

function adaptOrgHierarchyNodeArray(nodes: OrgHierarchyNode[] | null | undefined): ClientNode {
  // Build a synthetic root if multiple top-level nodes; otherwise wrap the single root.
  const tops = (nodes ?? []).map(adaptOne);
  if (tops.length === 1) return tops[0];
  return { id: 'falcon-root', type: 'root', name: 'Falcon', children: tops };
}

function adaptOne(n: OrgHierarchyNode): ClientNode {
  const type: HierarchyNodeType =
    n.isRootNode ? 'root' :
    n.isFirstLevelChild ? 'client' : 'sub-node';
  return {
    id:       n.id ?? cryptoRandomId(),
    type,
    name:     n.label,
    brand:    n.icon,        // visual mapping
    clientId: n.tenantId ?? undefined,
    children: (n.children ?? []).map(adaptOne),
  };
}
```

## 7. OTP mock — task-brief rule with React-rule toggle

```ts
export type OtpValidationMode = 'all-zeros-pass' | 'except-150999';

@Injectable({ providedIn: 'root' })
export class OtpMockService {
  private readonly mode = signal<OtpValidationMode>('all-zeros-pass');  // ⚓ task brief default

  setMode(m: OtpValidationMode): void { this.mode.set(m); }

  validate(code: string): boolean {
    const m = this.mode();
    if (m === 'all-zeros-pass')   return code === '000000';
    /* m === 'except-150999' */   return code !== '150999';
  }

  /*** 60 s resend timer + paste handler stay outside this service — owned by the OTP dialog component ***/
}
```

Switching to the React rule is a 1-line change (`setMode('except-150999')`).

## 8. Asset strategy

| Asset | Source | Target |
|---|---|---|
| Aramco logo | `Source_of_truth_theme/React/Organization page/admin/assets/aramco-logo.png` | `apps/admin-console/public/assets/org-hierarchy/aramco-logo.png` (copied) |
| Al-Rajhi / SNB / Bupa SVGs | inline in React `data.jsx` | inline data-URI in `services/mock-tree.ts` (no asset copy needed) |
| BMW conic-gradient | inline SVG in React | inline component template OR data-URI |
| Brand icons (sub-nodes, e.g. HR/DB/CC chips) | inline SVG | inline component template |
| Tree connector lines / chevron / kebab | currently inline SVG in React | inline SVG OR `<falcon-icon>` for those mapped in `FALCON_ICONS` |

## 9. i18n — namespace plan

Reference uses **231 distinct i18n keys** (Agent 3 §11). Three namespaces:

- `hierarchy.*` — tree, tabs, info panel, settings tab, drawers
- `addClient.*` — wizard steps, footer buttons, success
- `addUser.*` — wizard steps, footer buttons, success
- `otp.*` — modal copy, resend, success/fail

**Strategy:** copy the existing keys from `libs/falcon/src/language/i18n/en.json` + `ar.json` verbatim (the reference feature already added them in prior waves). No new keys needed. **Hardcoded English strings** flagged by Agent 2 (e.g. `'Verified'`, `'Verification required before saving'`, `'OTP Verification'`, `'Invalid OTP'`, etc.) — added to i18n during copy, NOT left hardcoded.

## 10. Falcon imports manifest (~48 distinct symbols)

From Agent 3 §10 ranked list — included verbatim in copy. Key contracts:

- `@falcon` — 26 imports: `FALCON_ICONS`, `FalconIconComponent`, `TranslatePipe`, `TranslateService`, `FALCON_NOTIFIER`, `FalconNotifierFacade`, `FALCON_LANGUAGE`, `FalconLanguageFacade`, plus types
- `@falcon/sdk` — 5: `HIERARCHY_FACADE`, `HierarchyFacade`, `ClientNode`, `User`, `NodeDossier`
- `@falcon/ui-core/angular` — 5: barrel imports for `FalconAngularButtonComponent`, `FalconAngularTabsComponent`, `FalconAngularDataTableComponent`, `FalconAngularDropdownComponent`, etc.
- `@falcon/ui-core/angular/falcon-input` — 1: `FalconAngularInputComponent`

Wave 4 (page skeleton) must surface a compilation gate: `nx build admin-console` must remain green after the initial copy.

## 11. Module Federation considerations

- admin-console is exposed via `webpack.config.js` (or `module-federation.config.js`) — already configured.
- The new route registers under `admin-console/org-hierarchy-page`. Host-shell already supports lazy-loading remote routes via `loadRemoteModule('admin_console', './admin-console')` per `apps/host-shell/src/app/app.routes.ts:51-57`.
- No federation config changes needed.

## 12. Authorization

- `adminConsoleGuard` currently commented out in `admin-console/src/app/app.routes.ts:7`. Re-enable in Wave 18 (regression). For dev convenience we leave it off until then.
- Inner `HierarchyFacade.permissions(nodeId)` controls action button visibility (canCreateNode/canCreateUser/canEditNode).

## 13. Accessibility floor (page-level)

Each new wave must observe:
- Keyboard: tree row navigable (focusable), Enter triggers selection, Space toggles expansion
- Drawer: Esc closes; first focus on input; Enter submits
- Popup/OTP: focus first input on open; trap not yet (P0-01 inherited gap — document)
- Toasts: aria-live=polite via existing Falcon notifier
- RTL: tree row chevrons + ctx-menu anchor side flip via direction service / `dir` attr
- All button-like icons get `aria-label`

## 14. Performance floor

- OnPush + signals → minimal re-renders by default
- Tree virtualization: deferred (the 10-level BMW seed is < 200 rows; no virtualization needed in v1)
- Chart pan/zoom: RAF-throttled via `FalconPanZoomDirective` (verbatim from reference)
- Lazy-loaded route + lazy step components in wizards via dynamic `import()`

## 15. Build/Test gates per wave

After every implementation wave:
1. `npx nx build admin-console` — must be GREEN. Compilation errors block the wave.
2. `npx nx lint admin-console` — must be GREEN. ESLint must pass; `app-org-hierarchy-page-menu` selector must satisfy `app-*` rule. NO `.eslintrc.json` override per `feedback_strict_task_scope.md`.
3. `npx nx test admin-console --watch=false` — pass if any wave authored tests.
4. Manual visual parity check — deferred to Wave 17 (visual parity repair loop).

## 16. What this plan does NOT change (out of scope for this feature wave)

- Library/component upgrades (UC-W01, P0-01, FT-01, P0-02, etc.) — separate waves
- Backend endpoints — mocked locally, marked TODO for future ticket
- Host-shell anything except 1 NavItem addition + 1 constant
- Management-console feature — left untouched
- ESLint config — no rule changes
- Token files (`falcon-ui-tokens`) — values consumed, never authored

## 17. Risks & contingencies

| Risk | Likelihood | Mitigation |
|---|:---:|---|
| `<falcon-tree-panel>` SCSS encapsulation issue surfaces in admin-console | Med | Page-local `::ng-deep` override at root component as last resort; documented |
| Inherited FT-01 `pi pi-ellipsis-v` icon visible in row action | High | Override row-action template with our own `<falcon-icon>` |
| Wizard step components imported from libs differ in shape | Low | Verbatim copy from management-console |
| Backend NodeService returns shape that breaks adapter | Med | Adapter `adaptOne()` is defensive; falls back to seed tree on any error |
| Module Federation surfaces missing `Routes` export | Low | `app.routes.ts` already exports `routes` + `default` |
| Login can't be automated (security policy) | Confirmed | User performs login in verification waves; orchestrator screenshots before/after |
| Build red on copy due to import path differences | Med | Wave 4 dedicated to ensuring `nx build admin-console` is green before adding behavior |

## 18. Definition of Done — feature-level

- ✅ Route `org-hierarchy-page` registered, lazy-loaded
- ✅ Menu item visible in host-shell sidebar; clicking navigates
- ✅ All 38 page-local components scaffolded + wired
- ✅ All test cases from task §"TESTING AND VISUAL PARITY" pass at least once manually OR via cypress harness
- ✅ Build/lint/test green
- ✅ Visual parity ≥ 90 % (Wave 17 target)
- ✅ Token discipline: 0 hex constants outside `falcon-*` vars
- ✅ Reports under `Brain Outputs/reports/org-hierarchy-page-night-shift-2026-05-14/` complete
- ✅ Obsidian updates linked
- ⏸ Commits/pushes only on explicit user instruction (standing rule)

End of Phase 5 architecture plan.
