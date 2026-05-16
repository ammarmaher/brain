# Rules / patterns — user-profile

## Observed (good)
- **Standalone components**, OnPush not used here but explicit `ChangeDetectorRef.markForCheck/detectChanges` calls when tree mutations require sync refresh.
- **`takeUntilDestroyed(destroyRef)`** consistently used in all subscriptions.
- **Routing as single source of truth** — `route.queryParamMap` subscription re-runs `onRouteParamsChanged()` whenever query params change, syncing all state. Component instance reuse is intentional.
- **Diff-based save dispatch** — `UserProfileService.updateUserProfile` only POSTs each change-bucket (profile / status / role) when it actually changed.
- **Sequential RxJS chain** for multi-endpoint save (`switchMap → switchMap`) preserves the success/failure contract: if profile-update fails, status/role never run.
- **Role-edit PES matrix is dynamic** — driven by `roleSelectionEditable` boolean computed from `accessControlFacade.can()` checks.
- **Sequence-number tracking** for async role fetches (`roleOptionsRequestSequence`) — guards against stale responses overwriting fresh data.
- **`originalProfile` snapshot** — kept side-by-side with edit form to support `cancelEdit()` and to detect changes.
- **Profile-picture delete via confirmation** (`ConfirmationService.confirm`).
- **`navigator.clipboard.writeText` + toast** for copy-email convenience (line 789-799).
- **OTP modal state machine** with explicit states + masked value display.

## Observed (bad — would be flagged by the night-shift digest)

- **Container is 1491 lines** — `UserProfileComponent` does tree management + tabs + profile load + save + verification + wizard launch + back-nav + ancestor-icon walks. Massive single-responsibility violation.
- **Template-driven forms** (`NgForm` + `ngModel`) instead of Reactive forms.
- **Direct `window.history.state` read** in `onRouteParamsChanged` — typed-router data abstraction not used.
- **`window.history.state` write** implicit via `router.navigate(..., { state: {...} })` — fine but coupled to navigation timing.
- **`*ngIf` / `*ngFor` / `[ngClass]`** style (via `CommonModule` imports).
- **`@Input() / @Output()` decorators** everywhere (wizard, OTP modal, child step components).
- **`@ViewChild()` decorators** instead of `viewChild()` signal queries.
- **SCSS files** throughout (`user-profile.component.scss`, `personal-information-step.component.scss`, etc.) — would be flagged by "no SCSS / Tailwind utilities only" rule.
- **`PrimeNG` heavy** — `p-tree` (indirect via `OrganizationHierarchyTreeComponent` wrapper), `p-select`, `p-input-group`, `p-skeleton`, `p-button`, `p-input-text`, `p-confirm-dialog`, `p-dialog`, `p-input-otp`.
- **Multiple email regex sources** — `UserProfileComponent` uses inline `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, while `PersonalInformationStepComponent` uses `FALCON_PATTERNS.EMAIL_STRING`. The two should match (DRY).
- **`as any` casts** — `(response as any).errorMessages?.[0]` in `OrgHierarchyApiService`, `AddUserWizardComponent.onSendCredentials`, `UserProfileComponent` etc.
- **`setTimeout(() => …, 0)`** + `setTimeout(() => …, 100)` chains in `AddUserWizardComponent.checkCurrentStepValidity` — fragile re-check pattern for ViewChild availability.
- **Hardcoded i18n English defaults** in some strings (e.g. `stepperConfig.title = 'Add New User'`, `cancelButtonLabel = 'Cancel'`). Should be i18n keys resolved via TranslateService.
- **`useGateway()` bypass** in `RoleCatalogService` — builds URL by string-concatenation with `envConfig.baseURLPes` directly instead of letting `RuntimeBaseUrlInterceptor` handle it.
- **Inconsistent leading slashes** in OTP endpoints (`/user/me/verify-phone` vs `user/me/verify-phone/confirm`).
- **`navigateByUrl('/', { skipLocationChange: true })` then navigate** trick (line 621-628) — forces re-evaluation; smells like a workaround.
- **Permission groups hardcoded** in `UserProfileComponent.initPermissionGroupOptions` and `PermissionsPrivilegeStepComponent.initPermissionGroupOptions` (lines 938-950, 48-60) as `'Admin Group' / 'Editor Group' / 'Viewer Group'`. No real backend integration — Permissions tab is WIP.
- **`createUserProfile` is a stub** that returns a failed `ServiceOperationResult` with a `console.warn` ("Use the Add User Wizard"). Dead inline-add path.
- **`OrgHierarchyApiService.delay(500)`** + `delay(300)` on error fallback — artificial delays to mask UX glitches; should be removed.
- **`profileService.createUserProfile` exists** but is a no-op explicitly. Either remove or expose only via the wizard.

## Patterns worth porting

- **Multi-endpoint save chain with diff detection** (`hasPersonalInfoChanges`, `statusChanged`, `roleChanged`) — cleanly avoids unnecessary backend churn.
- **Role-edit matrix via PES query**: `FalconAccess.userRole.other(source, target)` is a clean way to express "actor with role X can promote/demote target to role Y".
- **`expandAlongPath(index)` recursive expansion** — feeds the tree one level at a time, fetching children only when needed.
- **`AuthFlowStateService`-style pattern** — pattern of "stash transient state in sessionStorage as a single JSON blob" reused here would simplify some history-state assumptions.
- **Sequence-number guard** (`roleOptionsRequestSequence`) — pattern for async race-condition safety.
- **Profile-picture data flow** (`FileReader → base64 → ProfilePictureInfo`) is simple and works server-side. Worth keeping as the canonical pattern across the platform.

## Anti-patterns to NOT port to new theme

- **One mega-component for a multi-step + multi-tab + tree page**. Split into smaller routes or a parent-with-child-outlets architecture.
- **Template-driven forms for this complexity** — too many cross-field rules. Reactive forms preferred.
- **`window.history.state` reads** to recover navigation context. Use a router-level state service (typed) instead.
- **Two `ChangePasswordComponent` shapes** in the codebase (auth feature + layout dropdown). Same applies to the duplicate `ChangePasswordRequest` interface — one uses `oldPassword/newPassword/confirmNewPassword`, the other `currentPassword/newPassword/confirmPassword`. Pick one shape.
- **Inline regex** for email validation when a shared constant exists (`FALCON_PATTERNS.EMAIL_STRING`).
- **`HttpService` mixed with `HttpClient`** — `OrgHierarchyApiService` uses `HttpService` (from `@falcon`) while the rest of host-core uses `HttpClient` directly. Pick one.
- **The Permissions tab is incomplete** — either ship it or hide the tab. Currently visible-but-non-functional state is confusing.
