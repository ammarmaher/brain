# Volume 56 — Frontend Architecture Specialist Guide

> **Specialist depth:** The Angular 20 NX monorepo at `falcon-web-platform-ui` — 3 apps + Module Federation + Falcon UI Core (Stencil) + Tailwind v4 tokens-only + signals state + validations convention + wizard patterns.
>
> **Authority:** Prior memory entries from Waves 9-17 of front-end work + falcon-wiki Frontend Architecture doc. Code citations pending Wave 29 mining agent.

---

## §1 — The 3 Apps

### §1.1 The shell topology

| App | Port | Role | Audience |
|---|---|---|---|
| **host-shell** | 4200 | Module Federation **host** — owns layout, topbar, sidebar, theme, routing | All |
| **admin-console** | 4204 | Federation **remote** — admin/falcon-side surfaces | Falcon staff |
| **management-console** | 4301 | Federation **remote** — client/account-management surfaces | Client AOs/NAs |

### §1.2 Why split this way

- **Single host** = unified shell, theme, identity flow.
- **Multiple remotes** = independent deploy cadence, smaller-bundle delivery per audience, ownership-by-team.

### §1.3 Routing

The host loads remotes lazily via Module Federation:
```
/                  → host-shell home
/admin/...         → admin-console remote (Falcon-only routes)
/management/...    → management-console remote (Client routes)
```

Each remote owns its `app.routes.ts` with its own children. The host's `app.routes.ts` declares the `loadRemoteModule` lazy boundaries.

---

## §2 — Module Federation

### §2.1 Configuration

- Host: `apps/host-shell/module-federation.config.ts` (or similar)
- Remotes: `apps/admin-console/module-federation.config.ts` + `apps/management-console/…`

### §2.2 Shared deps

`@angular/*`, `rxjs`, `tslib`, plus `libs/falcon/*` are shared `singleton: true` to avoid version skew at runtime.

### §2.3 Remote URL strategy

Remotes expose at fixed ports in dev (4204, 4301). In production, the host loads remotes from CDN URLs read from runtime config (typically `assets/runtime-config.json`).

### §2.4 Auth context propagation across federation

The host owns `AuthService`. Remotes use Angular DI to access the host's AuthService instance (made possible by the singleton-shared lib). No duplicate auth state.

---

## §3 — Nx Monorepo + Libs Structure

### §3.1 Top-level structure

```
falcon-web-platform-ui/
├── apps/
│   ├── host-shell/
│   ├── admin-console/
│   └── management-console/
├── libs/
│   ├── falcon/             # workspace lib — services, facades, state, shared utils
│   │   ├── src/shared-utils/
│   │   ├── src/state/
│   │   └── ...
│   ├── falcon-ui-core/     # Stencil components (<falcon-*>)
│   ├── falcon-theme/       # design tokens (falcon-tailwind-tokens.css)
│   └── per-feature libs/
├── nx.json
└── tsconfig.base.json
```

### §3.2 Lib boundaries

Nx enforces dependency graph:
- Apps depend on libs (one-way).
- Libs can depend on lower-tier libs.
- No circular deps (Nx catches at build).

### §3.3 Scopes (Nx tags)

- `scope:host-shell` — host-only code.
- `scope:admin-console` — admin-only.
- `scope:management-console` — client-only.
- `scope:shared` — usable by any.
- `type:feature` / `type:ui` / `type:data-access` / `type:util` — layered architecture tags.

---

## §4 — Falcon UI Core (Stencil `<falcon-*>` Catalog)

### §4.1 The 60-component catalog

Per prior memory, Falcon UI Core has ~60 Stencil components, 22 READY / 22 NEEDS-UPGRADE / 2 DEPRECATED / 7 LEGACY / 2 REFERENCE-ONLY.

Examples (high-traffic):
- `<falcon-photo-uploader>` (with view-mode support from Wave 14b)
- `<falcon-tree-panel>` + `<falcon-tree-node>` (org hierarchy)
- `<falcon-angular-data-table>` (shadow-row paginator)
- `<falcon-angular-menu>` (popup overlay with token CSS-var pass-through)
- `<falcon-org-info-panel>` (information panel)
- `<falcon-chart-card>` (analytics card)
- `<falcon-node-details-section>` (tab section wrapper with action slot)

### §4.2 Why Stencil (not Angular)?

Stencil components are framework-agnostic Web Components. Falcon UI Core can theoretically be reused outside Angular. In practice, Falcon's apps are Angular-only, but the abstraction is preserved.

### §4.3 Falcon-only UI rule

**Hard rule (from prior memory):** "Tailwind utilities only — NO SCSS, NO component CSS, NO PrimeNG. Falcon UI Core is the only UI kit."

This is the cleanup goal of Waves 9-17 (Phase E migration etc.). Hardcoded colors → tokens. SCSS → Tailwind utilities. PrimeNG → Falcon UI Core.

### §4.4 Component contract pattern

Each Stencil component:
- Exposes a typed input (e.g., `[viewMode]`, `[status]`).
- Emits events (e.g., `(submit)`, `(change)`).
- Accepts a `rootClass` for Tailwind utility injection.
- Accepts CSS-var arbitrary properties via `styleClass` (e.g., `[--falcon-menu-item-bg:teal-700]`).

---

## §5 — Theme System

### §5.1 Token registry

Single source of truth: `libs/falcon-theme/src/falcon-tailwind-tokens.css`.

Per Wave 14, this file accumulates tokens like:
- Font sizes (5xs-md-half, lg-half=22px)
- Tracking (tight-1/wide-1/section-label/uppercase/brand-emphasis/allcaps/microlabel/tiny-label/em-dash)
- Leading (falcon-tight/snug/header/normal)
- Spacing (0.75/1.25/1.75/2.25/4.5/5.5/6.5/7.5)
- Radii (card/pane/modal/control-xs)
- Sizing (control-xs)
- Shadows (chart-card/toolbar/pill/menu-deep/card-soft/modal-deep/uploader-action/focus-soft)
- z-indexes (control/menu/drawer-modal)
- Backgrounds (bg-falcon-chart-grid)

### §5.2 Auto-revert protection

Per Wave 17 memory: the codebase has an auto-revert mechanism that protects every file outside the SSOT (token registry) from drift. If a developer hard-codes a color, it gets auto-reverted to the token. This was a major blocker for the token migration but is the right discipline.

### §5.3 Dark mode (Wave 14 Phase B+G)

- `<html class="app-dark" data-theme="dark">` — **dual selector**.
- `ThemeService.toggle()` flips both.
- localStorage key: `falcon-theme` (light | dark | system).
- FOUC scripts in `index.html` files read the key + respect OS preference for `system`.
- Topbar icon button is the toggle UI.

### §5.4 Why dual selector

- `.app-dark` — Tailwind v4 utility layer dark variant.
- `[data-theme='dark']` — Stencil component layer override.
- Setting one without the other leaves half the UI in wrong mode.

---

## §6 — Component Folder Doctrine

### §6.1 The canonical pattern

Every Falcon feature component (wizard step, drawer panel, page-pool form, host-shell shared component) follows:

```
<name>/
├── <name>.component.ts
├── <name>.component.html
├── models/
│   └── models.ts          # entity types, view-models
├── services/
│   └── <domain>.service.ts # HTTP + business logic
└── validations/
    └── validations.ts      # rules, validators
```

### §6.2 Per-component validations injection

Each step's validations are injected via:
- A per-component `InjectionToken` (typed for the step).
- A `*RulesProvider()` factory that resolves from the global `FALCON_VALIDATIONS` registry.

### §6.3 Global registry

`libs/falcon/src/shared-utils/lib/validations/` exports `FALCON_VALIDATIONS`. It's wired once in `app.config.ts` via `provideFalconValidations()`.

### §6.4 Reference implementation

`apps/admin-console/.../add-user-wizard/` is the canonical reference. All 3 wizard steps + `services/user.service.ts` follow the doctrine.

---

## §7 — Validations Convention

### §7.1 The contract

```typescript
// validations.ts
export const addUserStep1Rules = (rules: FalconValidations) => ({
  email: rules.email().required(),
  phone: rules.phone().required().e164(),
  name: rules.text().required().maxLength(120)
});
```

### §7.2 The factory injection

```typescript
// component.ts
constructor(
  @Inject(ADD_USER_STEP1_RULES) protected rules: ReturnType<typeof addUserStep1Rules>
) {}
```

### §7.3 Why this pattern

- **Co-location** — rules live next to the component.
- **Testability** — rules can be unit-tested without rendering.
- **Reusability** — rules can be re-used across components via the global registry.
- **Type safety** — rules are typed; component knows what's available.

### §7.4 Convention doc

See `Brain Outputs/strategies/falcon-component-creation/10-VALIDATION_CONVENTION.md` for the full contract.

---

## §8 — Service + Facade Pattern

### §8.1 Service = the data layer

```typescript
@Injectable({ providedIn: 'root' })
export class HierarchyService {
  constructor(private http: HttpClient) {}
  getNodes(parentId: string) {
    return this.http.get<NodeResponse[]>(`commerce/Node/${parentId}/children`, {
      context: new HttpContext().set(USE_GATEWAY, true)
    });
  }
}
```

### §8.2 Facade = the state-shape layer

```typescript
@Injectable({ providedIn: 'root' })
export class HierarchyFacade {
  private service = inject(HierarchyService);
  private state = createSignalState({
    nodes: [],
    loading: false,
    selected: null
  });

  load(parentId: string) {
    this.state.set({ loading: true });
    this.service.getNodes(parentId)
      .pipe(finalize(() => this.state.set({ loading: false })))
      .subscribe(nodes => this.state.set({ nodes }));
  }

  readonly nodes = this.state.computed(s => s.nodes);
  readonly loading = this.state.computed(s => s.loading);
}
```

### §8.3 Why facade

- **Component decoupling** — components depend on the facade's signals, not the service.
- **Testability** — components can be tested with a mock facade.
- **Reactivity** — facade exposes signals; components consume directly in templates.

---

## §9 — HTTP Layer

### §9.1 The `useGateway()` HttpContext

```typescript
this.http.get(..., {
  context: new HttpContext().set(USE_GATEWAY, true)
});
```

When `useGateway()` is true, the HTTP interceptor routes the request through the appropriate gateway (Core or System) based on the current user's role.

### §9.2 Single-options-object pattern

For DELETE + POST methods, use the single-options-object pattern to defeat HttpContext clobber:

```typescript
this.http.delete(url, { context, body: payload }); // single object
// NOT this.http.delete(url, context); // wrong overload
```

### §9.3 Error pipeline

Per `apps/host-shell/.../falcon-http-ui.config.ts:23-67`:
- **400** → top-right business-validation toast (12s)
- **403/404/5xx/network** → popup confirm dialog
- **422** → warning toast
- **200 with `isSuccessful: false`** → "Validation error" toast
- **401** → AuthService refresh-token flow

`notShowToaster: 'true'` header skips the toast (used for do-payment POSTs where dialogs handle failure).

---

## §10 — Auth Flow (Frontend)

### §10.1 OAuth2/OIDC client

`angular-oauth2-oidc` (or equivalent) client wraps Zitadel. Authorization-code flow with PKCE.

### §10.2 Token handling

- Access token: in memory (signal) + sometimes HttpInterceptor injects.
- Refresh token: secure cookie OR sessionStorage (depending on config).
- On 401: AuthService attempts refresh; on success, retries original request; on fail, redirects to login.

### §10.3 The 4 Falcon custom claims (Wave 23 cross-ref)

After Zitadel issues token, `ZitadelClaimsTransformation` (backend) promotes metadata to JWT claims:
- `user-id`
- `user-type` (Falcon | Client)
- `tenant-id`
- `node-id`

FE reads these claims from the JWT to populate `CurrentUser` signal.

### §10.4 IncludeDeleted flag (Wave 14 PR #40937 lift)

For Falcon sessions, `user-api.service.ts` auto-appends `IncludeDeleted=true` on user list/get calls. Client sessions don't get this flag.

---

## §11 — State Management

### §11.1 Pattern: Signal-based state slices

Per Wave 14 memory, state slices like `SettingsTabStateSlice`, `InfoPanelStateSlice`, `CommChannelsTabStateSlice` etc. follow a canonical pattern:

```typescript
@Injectable()
export class SettingsTabStateSlice {
  // Signals for view-state
  private _mode = signal<'loading' | 'view' | 'edit' | 'error'>('loading');
  private _formValue = signal<FormValueType>(null);
  private _snapshot = signal<FormValueType>(null);     // for dirty-tracking
  private _submitting = signal<boolean>(false);

  // Computed exposures
  readonly mode = this._mode.asReadonly();
  readonly isDirty = computed(() => !deepEqual(this._formValue(), this._snapshot()));

  // Mount-time forkJoin
  mount(nodeId: string) {
    forkJoin({
      pes: this.pesService.resolve(),
      settings: this.commerceService.getSettings(nodeId)
    }).subscribe(({ pes, settings }) => {
      this._formValue.set(settings);
      this._snapshot.set(structuredClone(settings));
      this._mode.set('view');
    });
  }

  save() {
    this._submitting.set(true);
    this.commerceService.putSettings(this._formValue())
      .pipe(finalize(() => this._submitting.set(false)))
      .subscribe(...);
  }
}
```

### §11.2 Why not NgRx

Angular's signals are sufficient for Falcon's state needs. NgRx's boilerplate cost (actions/reducers/effects/selectors) exceeds the value at the current scale.

### §11.3 The state slice is per-feature

Slices live with the feature folder (per §6 doctrine). Cross-feature data is at the facade layer.

---

## §12 — Wizard Pattern

### §12.1 Canonical structure

Each wizard step is a self-contained component (per §6 doctrine):
- Has its own folder.
- Owns its template + service + validations.
- Communicates with the wizard orchestrator via signals + events.

### §12.2 The orchestrator

The wizard component:
- Holds the step index signal.
- Renders the current step via `*ngIf` or `@if`.
- Validates the current step before allowing "Next".
- Aggregates all steps' data on final submit.

### §12.3 Reference: Add Client wizard

5-step wizard documented in `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` (folder-form playbook, 17 files):
- README.md
- 00-OVERVIEW.md
- 01-PERMISSIONS.md
- 02-STEP_<N>_<NAME>.md (per step)
- 07-VALIDATIONS.md
- 08-BACKEND_API.md
- 09-COMPONENTS.md
- 10-KAFKA_SIDE_EFFECTS.md
- 11-STATE_TRANSITIONS.md
- 12-ERROR_STATES.md
- 13-GAPS_AND_DRIFTS.md
- 14-IMPLEMENTATION_CHECKLIST.md
- PLAYBOOK.md (full single-doc version)

### §12.4 The Brain SK playbook rule

> "Brain Outputs is the source of truth. The flow playbooks are the implementation spec. A session producing code without grounding in the playbook is producing speculation."

When implementing a wizard, the playbook is the spec. Code that drifts from the playbook is a candidate for refactor.

---

## §13 — i18n

### §13.1 File layout

```
apps/<app>/src/assets/i18n/
├── en.json
└── ar.json
```

### §13.2 Tree structure

```json
{
  "hierarchy": {
    "info": {
      "actions": { "save": "Save", "cancel": "Cancel" },
      "success": "Information updated",
      "validation": { "required": "Required" }
    }
  },
  "topbar": {
    "aria": {
      "toggleToDark": "Switch to dark mode",
      "toggleToLight": "Switch to light mode"
    }
  }
}
```

### §13.3 RTL handling

Arabic locale flips layout via `dir="rtl"` on `<html>`. Tailwind v4 logical properties (`start-*` / `end-*`) flip automatically. RTL-specific tweaks via `[&_::-webkit-scrollbar]` arbitrary variants (Wave 14 falcon-tree-panel doctrine).

### §13.4 Multi-language design tokens

Display text in `MultiLanguageName(En, Ar)` (Wave 18a confirmed at `Domain/Entities/Node/MultiLanguageName.cs:7`). Frontend renders the matching variant based on user locale.

---

## §14 — Routing & Guards

### §14.1 Route guards

Per prior memory, there's a commented-out `adminConsoleGuard` in `apps/admin-console/src/app/app.routes.ts:7` — GAP-005 in the discovery report.

### §14.2 PES-based guards [INFERRED / partial]

Route guards check the `CurrentUser`'s PES keys before allowing navigation. If user lacks the required key, redirect to a 403 page.

### §14.3 Auth guard

Top-level guard requires `isAuthenticated` (from AuthService signal). If false, redirect to `/login`.

---

## §15 — PR Review Checklist (frontend-touching)

- [ ] Does the new component follow the canonical folder pattern (§6)?
- [ ] Are validations declared in `validations/validations.ts` + injected via factory?
- [ ] Does the component use signals (not RxJS state)?
- [ ] Does the HTTP call use `useGateway()` HttpContext where appropriate?
- [ ] Are translation keys added to both `en.json` and `ar.json`?
- [ ] Are colors via tokens (NOT hardcoded hex)?
- [ ] Is the component Tailwind utilities only (NO SCSS, NO component CSS)?
- [ ] Does the component use Falcon UI Core components where available (NOT PrimeNG)?
- [ ] Is the dark-mode dual selector (`.app-dark` + `[data-theme='dark']`) honored?
- [ ] Are PES-based route guards added where needed?
- [ ] Are aria-labels dynamic (tracking action, not state)?
- [ ] Is the component listed in `nx.json` with the right tags?

---

## §16 — Cross-References

- [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] (Obsidian)
- `Brain Outputs/understanding/frontend/` — canonical frontend knowledge root
- `Brain Outputs/understanding/pages/<page>/` — page-learning folders
- `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` — folder doctrine
- Vol 47 — User Lifecycle (backend dep)
- Vol 50 — PES Catalog (PES keys consumed by guards + UI surfaces)
- Vol 51 §V51-GATEWAYS-ADDENDUM (Wave 24 — gateway routing)
- Vol 53 — Order/Polling (the SimplePollService pattern)
- WAVE-29-CODE-MINING-WEB-PLATFORM-UI.md (pending — agent running)

---

## §17 — Open Questions

| ID | Question | Severity |
|---|---|---|
| Q-FE-01 | Confirm canonical NgRx vs signals choice for new code | LOW |
| Q-FE-02 | Is `adminConsoleGuard` re-enable scheduled? | MED |
| Q-FE-03 | Module Federation runtime config — environment-aware URLs? | LOW |
| Q-FE-04 | Falcon UI Core: 22 NEEDS-UPGRADE components — prioritization plan? | MED |
| Q-FE-05 | Dark-mode toggle is in topbar; should Settings page have 3-way (System / Light / Dark) too? | LOW |
| Q-FE-06 | RTL testing strategy — is there per-locale visual regression? | MED |

---

**End of Volume 56 — Frontend Architecture Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Builds on:** Prior memory entries (Waves 9-17) + falcon-wiki Frontend Architecture doc
**Pending:** Wave 29 code-mining agent will produce §V56-CODE-VERIFICATION-ADDENDUM
