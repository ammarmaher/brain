# State & Signal Patterns — Feature State Services

Memory rule `feedback_folder_structure_pattern.md` + Wave-level practice: page-scoped feature state lives in a signal-backed service registered via `providers: [HierarchyPageStateService]` at the host component. NEVER `providedIn: 'root'` for page state.

---

## Reference implementation

### `apps/admin-console/src/app/features/organization-hierarchy/services/hierarchy-page-state.service.ts`

Lines 1-99 verbatim (see file for full implementation):

```ts
/*** HierarchyPageStateService — owns all view state + actions for the menu page. ***/
/*** Page-scoped via providers: [HierarchyPageStateService]; never providedIn root. ***/

import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FALCON_NOTIFIER, FalconNotifierFacade, NodeDossier } from '@falcon/sdk';
import { TranslateService } from '@falcon';
import type { FalconTreeContextAction } from '@falcon';
import type { FalconOrgNodeDrawerMode } from '../components/tab-components/hierarchy-tab/falcon-org-node-drawer';
import type { FalconOrgViewToggleOption } from '../components/tab-components/hierarchy-tab/falcon-org-view-toggle';

import { AccountSettings, ClientNode, ePasswordSecurityLevel, NewUserPayload, NodeContextAction, User, UsersPage } from '../models/models';
import { HierarchyService } from './services';
import { AddClientApiService } from '../components/wizard-components/add-client-wizard/services/services';
import { AddUserApiService } from '../components/wizard-components/add-user-wizard/services/services';
import { DEFAULT_ACCOUNT_SETTINGS } from './mock-tree';
import {
  buildCreateAccountWireRequest,
  type ClientSettingsFormValue,
  type NewClientWizardPayload,
} from '../components/wizard-components/add-client-wizard/models/models';
import type {
  ColumnDef,
  FalconDataTableMenuItem,
  FalconDataTableRowAction,
  FalconLegacyTreeNode,
} from '@falcon/ui-core/angular';

/*** Local alias — preserves the historical PrimeNG `MenuItem` shape used by
     the internal tree/chart command builders. Loosened `command` signature so
     legacy `() => void` callbacks remain assignable. The tree-panel consumer
     passes its own action descriptors directly (FalconTreeContextAction), so
     this stays scoped to this state service. ***/
interface MenuItem {
  id?: string;
  label?: string;
  icon?: string;
  styleClass?: string;
  command?: (...args: unknown[]) => void;
}
type TreeNode<T = unknown> = FalconLegacyTreeNode<T>;

/*** Right-panel tab keys. ***/
export type ClientTab = 'hierarchy' | 'commChannels' | 'apps' | 'settings';

/*** Split toggles — structureView (Tree|Chart); usersView (List|Board). ***/
export type StructureView = 'tree' | 'chart';
export type UsersView = 'list' | 'board';

// ... (toggle option arrays + tab descriptors + brand palette + i18n key map) ...

@Injectable()
export class HierarchyPageStateService {
  private readonly hierarchy = inject(HierarchyService);
  private readonly addClientApi = inject(AddClientApiService);
  private readonly addUserApi = inject(AddUserApiService);
  private readonly i18n = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifier = inject<FalconNotifierFacade | null>(
    FALCON_NOTIFIER, { optional: true }
  );

  // ... signals + computed + effects + actions ...
}
```

---

## Pattern rules verified

1. **`@Injectable()` — NO `providedIn` argument.** This forces the consumer to register the service in `providers: []` of the host component. Each component instance gets its own state instance.
2. **`inject()` over constructor.** All DI is done via `inject(Token)` at field-initializer scope. Memory rule `feedback_brain_skill` describes this as idiomatic Angular 21.
3. **Optional facade injection** — `inject<FalconNotifierFacade | null>(FALCON_NOTIFIER, { optional: true })` — works in both host (concrete) and remote-standalone (mock fallback) modes.
4. **`destroyRef` + `takeUntilDestroyed()`** — replaces classic `Subject<void>` + `takeUntil()` unsubscribe pattern. Memory mention of zoneless requires functional cleanup.
5. **`signal()`** drives `is*`, `*Open`, `selected*`, `current*` flags. Mutations via `.set()` / `.update()` are synchronous.
6. **`computed()`** derives view models from signal inputs. Memoised by signal-deps tracker.
7. **`effect()`** wires side-effects (analytics, scroll behavior) to signal changes. Auto-cleaned by `DestroyRef`.
8. **`toObservable(signal)`** when an RxJS pipeline needs to react to a signal (e.g. switching HTTP streams when a selected node changes).
9. **`combineLatest(...).pipe(switchMap(...))`** is the standard RxJS pattern for cross-stream coordination. Lives inside the signal service but uses traditional reactive primitives where appropriate.
10. **Component imports the service in `providers: []`** — confirmed in `organization-hierarchy-menu.component.ts`. The state service is destroyed when the host component is destroyed.

---

## When to use signal vs classic service

| Need | Use |
|---|---|
| Cross-app singleton state | `@Injectable({ providedIn: 'root' })` classic service (e.g. `AuthService`, `SessionProvider`, `TranslateService`, `FalconMessageService`). |
| Page-scoped view state, OnPush components | Signal-state service registered in `providers: []` of the host component. **Standard pattern.** |
| HTTP-only data fetch with no transformations | Stateless HTTP service in `services/services.ts` (`HierarchyService`, `AddClientApiService`). |
| Form state that depends on Reactive Forms | Use `FormGroup` + signal-based `selectSignal()` on form value changes via `toSignal()`. |
| Cross-feature state | Promote to a facade in `@falcon/sdk` (`FALCON_NOTIFIER`, `FALCON_CONTEXT`). |
| Cross-shell state (host + remote) | Same — promote to `@falcon/sdk` facade with `provideFalconFacades({ ... })` in host and `provideFalconFallbackFacades()` in remote. |

---

## `inject()` vs constructor — observed convention

- **`inject()` everywhere new code is written.** Both `HierarchyPageStateService` and the host `AuthService` use field-initializer DI exclusively.
- **Constructor injection is reserved** for:
  - HTTP interceptor classes (legacy DI shape — `Injectable() class X implements HttpInterceptor { constructor(private xxx) {} }`).
  - Legacy components / services not yet refactored.

`apps/host-shell/src/app/core/interceptors/request-interceptor.ts` uses `inject()` despite being an interceptor:

```ts
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private methodTypesToNotified = ['POST', 'PUT', 'DELETE'];
  private auth = inject<FalconAuthFacade>(FALCON_AUTH);
  private authTokenService = inject(AuthService);
  // ...
}
```

So `inject()` is the convention even at the interceptor layer.

---

## OnPush implications

Every Falcon Angular wrapper sampled uses `ChangeDetectionStrategy.OnPush`. This means signal-based state services must respect:

- **`@Input` ref changes** trigger CD on OnPush components. Signal `.set(newValue)` does NOT — only the signal subscriber (template binding) updates.
- **In templates**, `signal()` getters must be invoked as functions: `<p>{{ count() }}</p>` not `{{ count }}`. This triggers OnPush CD reads correctly.
- **In `computed()`**, signal deps are tracked. Re-running on every CD cycle is NOT what `computed()` does — it's memoised.
- **In methods** (called from `(click)="onSubmit()"`), Angular flushes the next CD cycle, picking up any signal changes.

The author's comment in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.ts:106-108` explicitly documents why methods (not `computed()`) drive class strings: methods re-run on every CD cycle (which OnPush triggers when `@Input` ref changes), while `computed()` would only track signal deps, not `@Input` props.

> *"Methods (not `computed()`) where `@Input` props drive the output — explicit note at falcon-input.component.ts:106-108."*

This is THE most important nuance to teach a future Brain SK code-author.

---

## linkedSignal / resource / toSignal — usage in the codebase

- **`toObservable(signal)`** confirmed in `hierarchy-page-state.service.ts`.
- **`toSignal(observable$)`** — used in places where an existing `Observable` (e.g. from a facade or HTTP service) needs to bind into a template via signal API.
- **`linkedSignal()`** — NOT observed in sampled files. The codebase pre-dates the Angular 19/20 `linkedSignal` API; signal-state services use `signal()` + `computed()` + `effect()` only. GAP/UNKNOWN: a full codebase grep for `linkedSignal` would confirm — recommend a search.
- **`resource()`** — NOT observed. Codebase uses RxJS `switchMap()` + signal `toObservable()` pattern instead. Could be a fertile upgrade.

---

## Signal-state service template binding

```html
<!-- organization-hierarchy-menu.component.html (snippet pattern observed) -->
@if (state.drawerOpen()) {
  <falcon-angular-drawer
    [visible]="state.drawerOpen()"
    (falcon-close)="state.closeDrawer()">
    <!-- ... -->
  </falcon-angular-drawer>
}
```

State service injected as `state` (or `s`) in the component:

```ts
import { HierarchyPageStateService } from '../services/hierarchy-page-state.service';

@Component({
  selector: 'organization-hierarchy-menu',
  standalone: true,
  imports: [/* falcon-* components */],
  providers: [HierarchyPageStateService],  // page-scoped
  templateUrl: './organization-hierarchy-menu.component.html',
  styleUrls: ['./organization-hierarchy-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHierarchyMenuComponent {
  protected readonly state = inject(HierarchyPageStateService);
}
```

---

## Recommended pattern for NEW page-state services

1. Folder: `apps/<app>/src/app/features/<feature>/services/<feature>-page-state.service.ts`.
2. `@Injectable()` (NO providedIn).
3. Use `inject()` for all dependencies.
4. Use `DestroyRef` + `takeUntilDestroyed()` for all subscriptions.
5. `signal()` for primitive state, `computed()` for derived state, `effect()` for side-effects.
6. Public methods are imperative actions (`openDrawer()`, `selectNode(id)`, `commitForm()`).
7. Expose signals as readonly getters or call sites — `state.drawerOpen()` is preferred over `state.drawerOpen.set(true)` from templates.
8. Register in host component's `providers: []`.
9. Type imports from `@falcon/sdk` (`FALCON_NOTIFIER`, `FALCON_CONTEXT`) for cross-shell behaviors.
10. Use `as const` / `readonly` for constant arrays (toggle options, tab descriptors, brand palette).
