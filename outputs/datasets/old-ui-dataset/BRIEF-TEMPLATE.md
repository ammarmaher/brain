# Per-Feature Deep-Dive Brief (Old UI Dataset)

> Shared brief template — each deep-dive agent reads this + its scope-specific instructions.

## Mission

Mine the OLD UI (`origin/main` branch) to capture a reliable, code-grounded dataset of how each page is implemented, what backend it talks to, what rules it follows, and how it connects to other pages. The new theme/UI rebuild relies on this dataset for backend wiring.

## Source

**Read-only worktree**: `C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\`

This is `origin/main` of `falcon-web-platform-ui` (detached HEAD at `803ac1d1`). **DO NOT edit anything here** — strictly read-only.

## Scope structure

`apps/<app>/src/app/features/<feature>/` is your primary scope. You may need to:
- Read `apps/<app>/src/app/core/`, `app/shared/`, `app/layout/` for shared services + guards
- Read `libs/falcon/` for shared UI/services consumed
- Read `libs/sdk/` for HTTP DTOs / API surface
- Read `apps/<app>/src/app/app.routes.ts` for top-level routing
- Read `apps/<app>/src/environments/` for base URLs

## Output

Write a folder of structured Markdown files at `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\<app>\<feature>\`:

```
<feature>/
├── 00-README.md            # one-page summary + manifest of below
├── 01-ROUTING.md           # routes, lazy-load, guards, params
├── 02-COMPONENTS.md        # component tree, inputs/outputs, templates
├── 03-SERVICES-APIS.md     # services injected + every HTTP call
├── 04-DTOS.md              # every TS interface for request/response/state
├── 05-PES.md               # every AccessControlFacade / FalconAccess.* call + guards
├── 06-VALIDATIONS.md       # form validators, business rules, async validators
├── 07-CROSS-PAGE.md        # what shared state, services, components this depends on / contributes
└── 08-RULES-APPLIED.md     # patterns observed (good + bad) per the night-shift rules digest
```

## File templates

### 00-README.md
```markdown
---
type: page-dataset
app: <app>
feature: <feature>
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: <agent>
---

# <Feature Title>

## TL;DR
*(2-3 sentences — what this page does, the user it serves, the back-end it talks to)*

## Manifest
- [[01-ROUTING]] — N routes, N guards
- [[02-COMPONENTS]] — N components
- [[03-SERVICES-APIS]] — N services, M endpoints
- [[04-DTOS]] — N DTOs
- [[05-PES]] — N permission checks
- [[06-VALIDATIONS]] — N validators
- [[07-CROSS-PAGE]] — N inbound deps, N outbound contributions
- [[08-RULES-APPLIED]] — N patterns observed

## Source files
| File | Role |
|---|---|
| `apps/<app>/src/app/features/<feature>/foo.component.ts` | container |
| ... | |
```

### 01-ROUTING.md
```markdown
# Routing — <feature>

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `/admin-console/<feature>` | `FeatureContainerComponent` | yes | `AuthGuard`, `PesGuard` | `FeatureResolver` | `id` |

## Route module
- File: `apps/<app>/src/app/features/<feature>/<feature>.routes.ts:1-40`
- Loader: `loadChildren: () => import('./feature.routes').then(m => m.routes)`

## Guard implementations
*(for each guard, quote the canActivate logic + dependencies)*

## Resolver implementations
*(for each resolver, quote what it fetches + dependencies)*
```

### 02-COMPONENTS.md
```markdown
# Components — <feature>

## Tree
```
FeatureContainerComponent
├── FeatureToolbarComponent (selector: app-feature-toolbar)
├── FeatureTableComponent (selector: app-feature-table)
│   └── FeatureRowComponent (selector: app-feature-row)
└── FeatureDetailDrawerComponent (selector: app-feature-detail-drawer)
```

## Per-component
### FeatureContainerComponent
- File: `apps/.../feature.container.component.ts`
- Selector: `app-feature-container`
- Inputs: `[item]`, `[mode]` 
- Outputs: `(save)`, `(cancel)`
- Services injected (via inject()): `FeatureService`, `ToastService`, ...
- Forms: Reactive (`FormBuilder`)
- State: signal-based / observable-based
- Template highlights: ...
- Falcon components used: `<falcon-table>`, `<falcon-button>`, ...
```

### 03-SERVICES-APIS.md (CRITICAL — backend integration evidence)
```markdown
# Services & APIs — <feature>

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `FeatureService` | `apps/.../feature.service.ts` | `providedIn: 'root'` | CRUD for feature entity |

## HTTP endpoints called
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `/api/v1/features?clientId={id}` | `FeatureService.list()` | n/a | `FeatureListResponse` | `feature.service.ts:23` |
| POST | `/api/v1/features` | `FeatureService.create()` | `CreateFeatureRequest` | `Feature` | `feature.service.ts:42` |
| PUT | `/api/v1/features/{id}` | `FeatureService.update()` | `UpdateFeatureRequest` | `Feature` | `feature.service.ts:60` |
| DELETE | `/api/v1/features/{id}` | `FeatureService.delete()` | n/a | n/a | `feature.service.ts:78` |

## Base URL resolution
- Service uses `environment.apiBaseUrl + '/features'` → resolves to `https://api.falconhub.space/v1` in prod (`environments/environment.prod.ts:5`).

## Auth / interceptors
- All calls go through `AuthInterceptor` adding `Bearer <jwt>` header.
- Tenant header `x-tenant-id` added by `TenantInterceptor`.

## Backend service mapping
- `/api/v1/features/*` → Falcon Core Commerce Service (per gateway routing in `falcon-int-core-gateway-svc`) — IF derivable from URL pattern.
```

### 04-DTOS.md
```markdown
# DTOs — <feature>

## Request DTOs
### CreateFeatureRequest
- File: `apps/.../models/feature.models.ts:12` (or `libs/sdk/src/lib/feature/feature.dto.ts`)
- Shape:
```typescript
interface CreateFeatureRequest {
  name: MultiLanguageName;   // { en: string; ar: string }
  clientId: string;
  amount: number;
  // ...
}
```
- Used by: `FeatureService.create()`

## Response DTOs
### Feature
- File: `apps/.../models/feature.models.ts:30`
- Shape: ...
- Used by: list, get, create, update

### FeatureListResponse
- Shape: `{ items: Feature[]; total: number; page: number; pageSize: number }`

## Shared/enums
### FeatureStatus
- File: ...
- Values: `Active | Inactive | Pending`
```

### 05-PES.md (Permission/Eligibility/Subscription gating)
```markdown
# PES — <feature>

## Permission keys used
| Key path | Where checked | File:line |
|---|---|---|
| `FalconAccess.adminConsole.feature.view()` | route guard | `feature.routes.ts:15` |
| `FalconAccess.adminConsole.feature.create()` | toolbar button shown | `feature-toolbar.component.ts:22` |
| `FalconAccess.adminConsole.feature.delete(item.id)` | row action enabled | `feature-row.component.ts:30` |

## AccessControlFacade usage
- Service: `AccessControlFacade` from `libs/falcon/src/lib/access-control/`
- Signals: `can()` / `canSync()` / `cannot()` / observable variants
- Pattern (quote one example):
```typescript
const canCreate = computed(() => this.access.can('adminConsole.feature.create'));
```

## Route guards
- `PesGuard` redirects to `/unauthorized` when no `view()` permission

## Eligibility / Subscription checks
*(if any — feature flags, service-subscription state)*
```

### 06-VALIDATIONS.md
```markdown
# Validations — <feature>

## Form validators (sync)
| Form | Field | Validator | Message key |
|---|---|---|---|
| Create dialog | `name.en` | `required, maxLength(80)` | `validation.name.required` |
| Create dialog | `amount` | `min(0)` | `validation.amount.positive` |

## Async validators
| Field | Validator | Endpoint | Debounce |
|---|---|---|---|
| `name.en` | `UniqueNameValidator` | `GET /api/v1/features/check-name` | 400ms |

## Business rules captured in code
*(any conditional validation logic encoded outside FormControl validators — e.g. cross-field rules)*
```

### 07-CROSS-PAGE.md
```markdown
# Cross-page dependencies — <feature>

## Inbound (this feature depends on)
- `OrganizationHierarchyService` from `apps/.../shared/` — for current-node context
- `<falcon-tree-panel>` from `libs/falcon/` for tree picker
- `AuthInterceptor` from `core/interceptors/`

## Outbound (other features depend on this)
- `FeatureContextService` exposed via `providedIn: 'root'` — consumed by `dashboard` feature for top-line metric

## Shared state
- Reads: `OrgHierarchyStateService.currentNodeId$`
- Writes: nothing global

## Navigation entry points
- Menu item: `Admin Console > Features` (icon: feature-icon)
- Deep links: `/admin-console/features/{id}` from notification emails
```

### 08-RULES-APPLIED.md
```markdown
# Rules / patterns — <feature>

## Observed (good)
- Standalone components throughout
- Reactive forms via FormBuilder
- Signal-based state in container component
- ServiceOperationResult<T> wrapper handled (per platform standard)

## Observed (bad — would be flagged by the night-shift digest)
- `*ngIf` and `*ngFor` instead of `@if`/`@for`
- `@Input/@Output` decorators (would be `input()/output()` under Angular v20+ idioms)
- `[ngClass]` usage
- SCSS files
- ...

## Patterns worth porting
- The `<feature>-state.service.ts` pattern with computed signals — clean, no overhead
- ...

## Anti-patterns to NOT port to new theme
- Direct `document.querySelector` calls
- ...
```

## Method (per agent)

1. **Inventory** — `Glob` all files under `apps/<app>/src/app/features/<feature>/**`. Build file count + structure.
2. **Routing** — read `<feature>.routes.ts` and `app.routes.ts` to capture loader + guards + path.
3. **Components** — for each `.component.ts`, capture decorator metadata, inputs/outputs, services injected, template highlights. Read templates for component tree.
4. **Services + APIs** — for each `.service.ts`, capture every `this.http.<method>('<url>', ...)` call. Be exhaustive — every endpoint matters.
5. **DTOs** — find `models/*.ts`, `*.models.ts`, interfaces declared near services. Quote the shape exactly.
6. **PES** — grep for `AccessControlFacade`, `FalconAccess`, `.can(`, `.canSync(`, `pes`, route guards.
7. **Validations** — Reactive form validators + AsyncValidatorFn + business logic.
8. **Cross-page** — `imports` from outside the feature folder; `providedIn: 'root'` services exposed.
9. **Rules** — pattern observations (idioms, anti-patterns).

## Quality standards

- **No invention**. Every fact must cite `file:line`.
- **Exhaustive on APIs** — every HTTP endpoint, no skipping. This is the highest-value output.
- **Type-correct DTOs** — quote the interface verbatim.
- **Source-prefixed claims** — `[CODE]` for direct code reads, `[INFERRED]` for derived statements (e.g. "this routes through Core Gateway because the URL matches a YARP rule"). Be honest about inference.
- **Real numbers** — file counts, endpoint counts, validator counts. No "many" or "several".

## Rules of engagement

- READ-ONLY in the worktree. No edits.
- Write only inside `C:\Falcon\Brain Outputs\datasets\old-ui-dataset\10-pages\<app>\<feature>\`.
- If a file in scope is too large to read in one call, read in chunks and merge.
- If a referenced file doesn't exist (e.g. service that's expected but missing), say so — don't invent.
- Skip generated `dist/`, `node_modules/`, `__tests__`, `*.spec.*`.
