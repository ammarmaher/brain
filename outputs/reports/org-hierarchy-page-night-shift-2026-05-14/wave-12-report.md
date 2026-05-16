# Wave 12 — User details drilldown panel (NEW)

**Status:** GREEN
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)
**Build hash:** `15b0857d96329037` (admin-console, 13,852 ms)

## Files created (3) — NET-NEW (not in reference)

| Path | Purpose |
|---|---|
| `components/user-details/user-details-page.component.ts` | UserDetailsPageComponent — 3-tab drilldown (Personal / Role & Status / Permissions) with edit mode |
| `components/user-details/user-details-page.component.html` | Drilldown template — avatar header + 3 view tabs + conditional input/span fields + Save/Cancel footer when editing |
| `components/user-details/index.ts` | Barrel |

## Files overwritten (2)

| Path | Diff |
|---|---|
| `components/org-hierarchy-page-menu.component.ts` | + `signal('userDetails', null)` + `onUserRowActionLocal()` + `onUserDetailsClose()` + `onUserDetailsSave()` handlers; + `UserDetailsPageComponent` import + `User` type import |
| `components/org-hierarchy-page-menu.component.html` | + `@else if (userDetails(); as u) { <app-user-details-page [user]="u" (close) (save) /> }` branch; rowAction wiring changed from `state.onUserRowAction($event)` → `onUserRowActionLocal($any($event))` |

## Decisions applied

- **D-W12-1: Drilldown placement** — chose in-place panel swap (no child route). Rationale: the row action is from inside the menu component; switching routes mid-feature would re-mount the entire `OrgHierarchyPageMenuComponent` and lose tree selection + lazy load state. Panel swap keeps state alive and is simpler.
- **D-W12-2: Save behavior** — emits the new `User` upward but doesn't persist via backend (no facade `updateUser` shipped on consumer side this wave). Notifier shows success toast.
- **D-W12-3: User imports** — pulled `FALCON_NOTIFIER` and `FalconNotifierFacade` from `@falcon/sdk` (not `@falcon`) per repo's existing facade pattern. Verified at `libs/sdk/src/tokens/falcon-facades.tokens.ts`.

## Build / lint gate

```
npx nx build admin-console
# Hash: 15b0857d96329037, Time: 13,852 ms — SUCCESS
```

## Acceptance criteria (5 from wave plan §W12)

| # | Criterion | Status |
|---|---|:---:|
| 1 | 3 view tabs (Personal / Role / Permissions) render | YES — `<falcon-angular-tabs>` |
| 2 | Edit pill toggles edit-mode (inputs become editable) | YES — `editMode()` signal switches between `<falcon-angular-input>` and `<span>` per field |
| 3 | Save toasts + emits updated user | YES — `notifier.success(...)` + `(save)` output |
| 4 | Cancel discards | YES — `cancelEdit()` clears `draft()` signal |
| 5 | More Details row action navigates | YES — `(rowAction)="onUserRowActionLocal(...)"` opens panel via `userDetails.set(user)` |

## Open issues / decisions punted

1. **Backend persistence** — Save is in-memory only. To persist, an `updateUser` facade call must be invoked from `onUserDetailsSave()`. Deferred until a backend endpoint and `HierarchyService.updateUser` exist.
2. **Phone / email verify pills** — not surfaced in W12 (lean MVP). Original brief mentioned this — OTP integration deferred to W13.
3. **Tab edit-mode forms (Role/Permissions)** — view-only in W12. Editing role/permGroup requires dropdown options and validation. Deferred.

End of Wave 12 report. Advancing to W13.
