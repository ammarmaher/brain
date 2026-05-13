# Feature Folder Structure — admin-console + management-console

Memory rule `feedback_folder_structure_pattern.md`: every feature uses `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts` — **ONE file per type-folder** holding all classes/interfaces of that type. Large signal-state services may live as their own files alongside.

The rule is **followed in practice with one well-defined exception** (signal-state services).

---

## Pattern observed in admin-console

### `apps/admin-console/src/app/features/organization-hierarchy/`

```
organization-hierarchy/
├── organization-hierarchy.routes.ts      Routes (default + named export)
├── components/
│   ├── organization-hierarchy-menu.component.html
│   ├── organization-hierarchy-menu.component.scss
│   ├── organization-hierarchy-menu.component.ts
│   ├── skeleton/
│   │   └── org-hierarchy-skeleton.component.ts
│   ├── tab-components/
│   │   ├── applications-table/
│   │   ├── hierarchy-tab/
│   │   │   ├── falcon-org-chart/
│   │   │   ├── falcon-org-info-panel/
│   │   │   ├── falcon-org-kanban/
│   │   │   ├── falcon-org-node-drawer/
│   │   │   ├── falcon-org-node-header/
│   │   │   └── falcon-org-view-toggle/
│   │   └── settings-tab/
│   └── wizard-components/
│       ├── add-client-wizard/
│       │   ├── client-account-owner-step/
│       │   ├── client-information-step/
│       │   ├── client-service-row-table/
│       │   └── client-settings-step/
│       └── add-user-wizard/
│           ├── user-permissions-step/
│           ├── user-personal-step/
│           └── user-role-status-step/
├── models/
│   └── models.ts                          ← one file per type-folder
├── services/
│   ├── services.ts                        ← one file per type-folder (HTTP services)
│   ├── hierarchy-page-state.service.ts    ← exception: large signal-state service
│   ├── mock-applications.ts               ← exception: mock data colocated
│   ├── mock-tree.ts                       ← exception: mock data colocated
│   ├── validation-messages.ts             ← exception: i18n keys
│   └── validators.ts                      ← exception: form validators
├── resolvers/
│   └── resolvers.ts                       ← one file per type-folder
└── guards/
    └── guards.ts                          ← one file per type-folder
```

### `apps/admin-console/src/app/features/organization-hierarchy-page/`

Shorter shape (no resolvers/, no guards/):

```
organization-hierarchy-page/
├── organization-hierarchy-page.routes.ts
├── components/
│   ├── organization-hierarchy-page-menu.component.html
│   ├── organization-hierarchy-page-menu.component.ts
│   ├── skeleton/, tab-components/, wizard-components/
├── models/
│   └── models.ts
└── services/
    ├── services.ts
    └── hierarchy-page-state.service.ts
```

---

## Pattern observed in management-console

### `apps/management-console/src/app/features/organization-hierarchy-page/`

Carries `resolvers/` + `guards/` (admin-console's `organization-hierarchy-page/` does NOT — divergence):

```
organization-hierarchy-page/
├── organization-hierarchy-page.routes.ts
├── components/
│   ├── organization-hierarchy-page-menu.component.html
│   ├── organization-hierarchy-page-menu.component.ts
│   ├── skeleton/, tab-components/, wizard-components/
├── models/
│   └── models.ts
├── services/
│   ├── services.ts
│   ├── hierarchy-page-state.service.ts
│   ├── mock-applications.ts
│   ├── mock-tree.ts
│   ├── validation-messages.ts
│   └── validators.ts
├── resolvers/
│   └── resolvers.ts
└── guards/
    └── guards.ts
```

---

## Rules verified

1. **One file per type-folder** for `models/`, `resolvers/`, `guards/` — confirmed across admin + management.
2. **`services/services.ts`** is the canonical HTTP service file. Multiple `Injectable` classes live in one file.
3. **`<feature>.routes.ts`** sits at the feature folder root — exports default + named.
4. **Sub-feature components nest deeper** — `components/<sub-feature>/<component>/` with kebab-case folder names.
5. **Component triplet** stays per Angular convention: `*.component.html` + `*.component.scss` (often near-empty) + `*.component.ts`.

## Documented exceptions

A few file types live outside the one-file-per-folder rule by design:

- **Signal-state services** — `hierarchy-page-state.service.ts` is too large + has its own lifecycle hooks. Kept in its own file alongside `services.ts` for editor performance + diff readability.
- **Mock data files** — `mock-tree.ts`, `mock-applications.ts` colocated with services but separate file for static fixture data.
- **Validation files** — `validators.ts` and `validation-messages.ts` colocated with services because they share dependencies on the state service.

## SCSS files in feature folders

Per the standing `tailwind-only` rule, component-level SCSS files should not declare rules. The active code has a few `.component.scss` files alongside Angular components in admin-console. **Sampled `organization-hierarchy-menu.component.scss` and `add-client-wizard.component.scss`** — files exist but are minimal (single-purpose carry-overs from the React reference port; some still contain residual rules that need cleanup per `FORBIDDEN_PATTERNS_OBSERVED.md`).

## File-naming rules

- **Kebab-case** for files and folders (e.g. `organization-hierarchy-menu.component.ts`).
- Multi-word component selectors stay kebab: `falcon-org-node-drawer`, `client-information-step`, etc.
- Angular type separators are dots: `*.component.ts`, `*.service.ts`, `*.routes.ts`, `*.guard.ts`, `*.resolver.ts`, `*.interceptor.ts`, `*.pipe.ts`, `*.module.ts` — Nx `nx.json` generators lock `typeSeparator: "."`.

## Lib-side mirroring

Inside `libs/falcon/src/`, the sub-folders also use one-file-per-type:

```
libs/falcon/src/
├── core/
│   └── lib/
│       ├── access-control/
│       ├── guards/
│       │   ├── admin-console.guard.ts
│       │   ├── admin-organization-hierarchy.guard.ts
│       │   └── management-console.guard.ts
│       ├── services/
│       │   ├── node.service.ts
│       │   ├── route-access.service.ts
│       │   └── session-provider.service.ts
│       └── user-session.interface.ts
├── language/lib/
│   ├── pipes/translate.pipe.ts
│   ├── services/translate.service.ts
│   └── translate.initializer.ts
├── shared-ui/lib/
│   ├── components/<bespoke>/
│   ├── directives/
│   └── ui/
├── shared-data-access/lib/
│   ├── interceptors/runtime-base-url.interceptor.ts
│   ├── runtime-config/
│   ├── services/
│   └── validators/
├── shared-types/lib/{enums,models,constants}/
└── shared-utils/lib/{utils,validators}/
```

The library-internal structure uses `lib/<subdomain>/` as an intermediate folder per Nx Angular library convention. Apps stay flatter (no `lib/` layer).

## Recommended structure for NEW features

1. Create `apps/<app>/src/app/features/<feature-name>/` with kebab-case.
2. Add `<feature-name>.routes.ts` with default + named exports.
3. Add `models/models.ts` (interfaces + types).
4. Add `services/services.ts` for HTTP services.
5. Add `components/<feature-name>-menu.component.{ts,html,scss}` as the entry component.
6. Sub-feature components go under `components/<sub-feature>/` nested.
7. If signal state needed → add `services/<feature-name>-page-state.service.ts` as its own file.
8. Add `guards/guards.ts` only if route-level access control is needed (functional `CanActivateFn`).
9. Add `resolvers/resolvers.ts` only if data preloading is required.
10. Wire from `app.routes.ts` via `loadChildren: () => import('./features/<feature-name>/<feature-name>.routes')`.
