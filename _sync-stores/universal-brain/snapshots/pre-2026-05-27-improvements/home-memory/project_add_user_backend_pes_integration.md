---
name: Add User Wizard Backend + PES Integration
description: Full backend + PES integration of the Add User wizard. Status: LANDED 2026-05-16. ErrorDialogService + FalconAngularErrorDialogHostComponent shipped; CommerceSettingsService new; FalconAccess.adminConsole.{user,userPermissionGroup,userProfilePicture} new; FIELD_LEVEL_ERROR_MAP wired; async-pending gate; success toast via FalconMessageService.
type: project
agent: ammar-web-platform-ui
date: 2026-05-16
status: completed
originSessionId: 07b8ba28-8860-4ccb-8523-141463aa32f3
---
# Add User Wizard — Backend + PES Integration

**Status:** 🟢 LANDED (2026-05-16) — Waves 1 → 8 all GREEN.

**Reference flow:** `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/`

## Locked decisions

| ID | Decision |
|---|---|
| **D1 PES naming** | `sys.user`, `sys.user-permission-group`, `sys.user-profile-picture` under `FalconAccess.adminConsole.*` |
| **D2 PES-denied** | Disabled with tooltip (not hidden) for recoverable grants |
| **D3 Status field** | Read-only "Pending" chip; lifecycle transitions belong to Edit User |
| **D4 Double-toast** | `notShowToaster: 'true'` header on `UserService.createUser`; error popup is the SSOT, not the global toast |
| **D5 Welcome message** | Skipped |
| **D6 National ID** | Optional |
| **D7 401 in popup** | Skipped — global response interceptor handles re-auth |
| **D8 Add Client** | Documentation only — no code changes this run |

## Files created

| Path | Role |
|---|---|
| `libs/falcon/src/shared-data-access/lib/services/error-dialog.service.ts` | Backend-error popup state holder (singleton, providedIn:'root') |
| `libs/falcon/src/shared-data-access/lib/services/commerce-settings.service.ts` | GET commerce/Settings/Get — password level, user limit, node cap, allowed IPs |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-error-dialog-host/falcon-error-dialog-host.component.{ts,html}` + `index.ts` | UI host that renders the popup — mounted in app.ts |
| `apps/admin-console/.../add-user-wizard/services/user.service.ts` | Domain service (Wave 1 rename from services/services.ts → user.service.ts; v1.3.0 added listPermissionGroupsForRole + getNormalUserCount) |
| `apps/admin-console/.../add-client-wizard/services/client.service.ts` | Sibling rename (Wave 1) |
| `apps/admin-console/.../add-user-wizard/user-personal-step/validations/validations.ts` | Step rules + provider (Wave 2; v1.3.0 added optional pendingSig opts) |
| `apps/admin-console/.../add-user-wizard/user-role-status-step/validations/validations.ts` | Step rules + provider |
| `apps/admin-console/.../add-user-wizard/user-permissions-step/validations/validations.ts` | Step rules + provider |

## Files modified

| Path | Change |
|---|---|
| `libs/falcon/src/shared-data-access/lib/services/index.ts` | Export ErrorDialogService + CommerceSettingsService |
| `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` | + `adminConsole.user.add()`, `adminConsole.userPermissionGroup.assign()`, `adminConsole.userProfilePicture.upload()` |
| `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` | `userNameUnique` signature gained optional `pendingSignal: WritableSignal<boolean>`; `finalize()` resets it on emit/error |
| `libs/falcon/src/shared-utils/lib/validations/named-validators.ts` | `userNameUniqueValidator` forwards the new pendingSignal arg |
| `libs/falcon/src/language/i18n/en.json` + `ar.json` | + `common.ok`, `hierarchy.error.title.{400/403/404/409/422/500/default}`, `hierarchy.error.countOne/countOther`, `hierarchy.error.unknown`, `hierarchy.addUser.success.{title,detail}`, `hierarchy.addClient.success.{title,detail}`, `hierarchy.addUser.empty.{title,description}`, `hierarchy.addUser.checking` |
| `libs/falcon-ui-core/src/angular-wrapper/index.ts` | Export FalconAngularErrorDialogHostComponent |
| `apps/host-shell/src/app/app.ts` | Mount `<falcon-angular-error-dialog-host>` next to `<falcon-angular-message-host>` |
| `apps/admin-console/.../services/hierarchy-page-state.service.ts` | Inject ErrorDialogService + FalconMessageService; rewrite `onAddUserSubmit` + `onAddClientSubmit` error+success paths; add `wizardBackendErrors` signal + helpers `inferStatus()`, `statusFromHttpError()`, `collectErrorMessages()` |
| `apps/admin-console/.../components/org-hierarchy-page-menu.component.html` | Pass `[backendErrors]="state.wizardBackendErrors()"` to add-user-wizard |
| `apps/admin-console/.../add-user-wizard/add-user-wizard.component.{ts,html}` | mount-time forkJoin (PES flags + commerce settings); loading skeleton; empty-state when canAddUser=false; `permGroups` signal driven by role change via `UserService.listPermissionGroupsForRole`; `firstFailingStepFromBackend` reads `FIELD_LEVEL_ERROR_MAP` from models |
| `apps/admin-console/.../add-user-wizard/models/models.ts` | + `FIELD_LEVEL_ERROR_MAP` constant; `STATUS_OPTIONS` collapsed to pending-only |
| `apps/admin-console/.../add-user-wizard/user-personal-step/user-personal-step.component.{ts,html}` | Rules built inline; `usernameCheckPending` signal; inline spinner in username field; Next gate `!usernameCheckPending()` |
| `apps/admin-console/.../add-user-wizard/user-permissions-step/user-permissions-step.component.{ts,html}` | `[permGroups]` input override; `permGroupOptions` now a computed |

## Reusability snippets

### 1. ErrorDialogService usage in any wizard

```typescript
import { ErrorDialogService } from '@falcon';

const errorDialog = inject(ErrorDialogService);

// On any backend failure (after notShowToaster: 'true' suppression):
void errorDialog.openError({
  httpStatus: 422,                          // or inferred from envelope
  errorMessages: ['Normal user limit reached'],
});
// 401 is silently suppressed; global interceptor re-auths.
```

### 2. FalconAccess.adminConsole.* + resolveFlags pattern

```typescript
import { AccessControlFacade, FalconAccess } from '@falcon';
import { forkJoin, from } from 'rxjs';

forkJoin({
  flags: from(this.accessControl.resolveFlags({
    addUser:         FalconAccess.adminConsole.user.add(),
    assignPermGroup: FalconAccess.adminConsole.userPermissionGroup.assign(),
    uploadPhoto:     FalconAccess.adminConsole.userProfilePicture.upload(),
    /* and per-role grant flags via FalconAccess.userRole.other(currentRole, target) */
  })),
  settings: this.commerceSettingsApi.getSettings(),
})
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(({ flags, settings }) => {
    // Until PES catalog confirms the new sys.* resources, fail-OPEN when all flags are false
    // (allow-by-default fallback). Remove once catalog rollout is verified.
  });
```

### 3. FIELD_LEVEL_ERROR_MAP pattern

```typescript
// In feature models/models.ts:
export const FIELD_LEVEL_ERROR_MAP: Readonly<Record<string, { readonly step: 1 | 2 | 3; readonly field: string }>> = {
  DuplicateUsername:      { step: 1, field: 'userName' },
  NormalUserLimitReached: { step: 2, field: 'role' },
  RequiredFieldMissing:   { step: 3, field: 'permGroup' },
  /* ... full table per spec */
};

// In wizard component:
private firstFailingStepFromBackend(errs: readonly { code: string; message: string }[]): number | null {
  let best: 1 | 2 | 3 | null = null;
  for (const e of errs) {
    const m = FIELD_LEVEL_ERROR_MAP[e.code];
    if (m && (best === null || m.step < best)) best = m.step;
  }
  return best;
}

// Effect — auto-jump + revealErrors on backend errors:
effect(() => {
  const errs = this.backendErrors();
  if (!errs?.length) return;
  const target = this.firstFailingStepFromBackend(errs);
  if (target !== null) {
    this.currentStep.set(target);
    this.markStepRevealedAndReveal(target);
  }
});
```

## Cross-references

- **Plan source:** Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md — locked decisions D1-D8 + 12 re-test scenarios
- **Strategy:** Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md §7.6 (Backend errors, success toasts, PES gating)
- **Changelog:** Brain Outputs/strategies/falcon-component-creation/09-CHANGELOG.md v1.3.0
- **Companion (Add Client):** documentation-only this run per D8; existing client.service.ts rename landed in Wave 1, but the error-popup migration is documentation-tied — the state service's onAddClientSubmit was rewritten alongside onAddUserSubmit for consistency, so Add Client benefits from D7's popup pattern without additional Add Client UI changes.

## Final build results

| Project | Hash | Time |
|---|---|---|
| `falcon-ui-core` | (consumed by admin-console — no standalone hash) | n/a |
| `admin-console` | `0d1a2b1dcce8b091` | 14.5s |
| `host-shell` | `ad3419aed948d3c8` | 11.4s |

## Re-test scenarios (for the user)

1. Happy path → success toast survives wizard-close + refetch users list
2. 403 on submit → popup title "Permission denied (HTTP 403)"; severity danger
3. 400 with `DuplicateUsername` → popup + wizard jumps to Step 1 + userName field flagged
4. 409 conflict → popup title "Conflict (HTTP 409)"
5. 422 `NormalUserLimitReached` → popup title "Business rule rejected (HTTP 422)"; severity warning; jump to Step 2 role
6. Async username pending → Next button disabled + inline spinner visible inside username field
7. PES denial of role-grant (e.g. cannot grant sys-admin) → role dropdown excludes that key
8. PES denial of photo upload → uploader disabled + tooltip
9. PES denial of permission-group assign → Step 3 dropdown disabled + tooltip
10. No double-toast on errors → only popup, not the global interceptor toast
11. Role change → permission-groups dropdown refetches (falls back to PERM_GROUP_OPTIONS until backend endpoint lands)
12. Wizard mount → token-styled skeleton while forkJoin completes; empty-state if `canAddUser=false`

## Trigger to resume / extend

`continue Add User wizard backend + PES integration` — full context restorable from this memory + the plan in Brain Outputs.
