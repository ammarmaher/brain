# Routing — user-profile

## Routes
| Path | Component | Lazy? | Guards | Resolvers | Params | Query params | History state |
|---|---|---|---|---|---|---|---|
| `/profile` (child of LayoutComponent) | `UserProfileComponent` | no | (inherits) | — | — | `?mode=view\|edit\|add\|add-wizard`, `?nodeId=<id>`, `?orgNodeId=<id>` | `showTree?: boolean`, `orgNodeLabel?: string`, `orgNodeIconUrl?: string`, `expandPath?: string[]`, `sourceRoute?: string`, `selectNodeId?: string` |
| `/profile/:nodeId` (child of LayoutComponent) | `UserProfileComponent` | no | (inherits) | — | `nodeId` | (same as above) | (same as above) |

Defined: `apps/host-shell/src/app/app.routes.ts:39-52`.

Both routes share the same component. Component reads everything from `route.queryParamMap` + `route.snapshot.paramMap` + `window.history.state` on every navigation, since Angular reuses the component instance.

## Query param semantics

- `mode = 'view'` (default) — read-only profile.
- `mode = 'edit'` — editing existing profile.
- `mode = 'add'` — inline new-user create (currently degrades because backend has no inline endpoint; `UserProfileService.createUserProfile` returns a failed result).
- `mode = 'add-wizard'` — opens `<app-add-user-wizard>` overlay.

- `nodeId` (path or query) — meaning depends on caller:
  - Equal to `FALCON_ROOT_NODE.id` → ignored, treat as own-profile (`this.nodeId = null`).
  - Otherwise, used as user/org-node ID for fetch and wizard target.

- `orgNodeId` (query) — explicit org-node selection for tree (used when caller navigates from a user-list-view where the URL `nodeId` is a USER id, not an org-node id).

## History state semantics (not in URL)

Read in `onRouteParamsChanged()` (`user-profile.component.ts:980-994`):

- `showTree: boolean` — whether to render the left org-hierarchy tree panel. true when navigated from admin/management consoles; false when navigated from the user-profile-menu (own-profile context).
- `orgNodeLabel: string` — node label displayed in the top bar.
- `orgNodeIconUrl: string` — node icon URL displayed in the top bar.
- `expandPath: string[]` — ancestor-key path from root to target node, used by `expandAlongPath()` to auto-expand to the deep node.
- `sourceRoute: string` — the URL to navigate back to when a tree node is clicked or wizard is closed (e.g. `/admin-console/organization-hierarchy`).
- `selectNodeId: string` — pre-select this node in the tree on land.

## Guard implementations
Inherits from LayoutComponent (`authGuard` + `shellPrimeAccessGuard`). No additional PES guard on the route itself; PES is enforced inline by `accessControlFacade.ensure() + can()` calls for role-edit decisions.

## Resolver implementations
None.

## Internal sub-routes inside the wizard (state-machine, NOT Angular routes)
- Step 0: `PersonalInformationStepComponent` (stepperConfig.steps[0])
- Step 1: `RoleStatusStepComponent` (stepperConfig.steps[1])

Driven by `currentStep` integer and validated per-step via NgForm `valid + !pending` of the referenced ViewChild.
