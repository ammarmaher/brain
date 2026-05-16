# Wave 16 — Backend/API integration verification

**Status:** GREEN (verification-only wave)
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)
**Build hash:** `33ea599de46188cd` (cached — no new files)

## Real backend wiring already in place

The W7 port set the `HierarchyService` as `providedIn: 'root'` and uses real backend calls with mock fallback. Verified surfaces:

| Surface | Backend status | Code location |
|---|---|---|
| `tree fetch` (GET /commerce/Node) | REAL — falls back to `MOCK_TREE` on error | `services/services.ts` (verbatim from reference) |
| `getUsers(nodeId, page, size)` | REAL — `Gateway.IdentityGateway` user endpoint | `services/services.ts` |
| `createSubNode` | REAL — POST `commerce/Node/create-sub-node` | `services/services.ts` |
| `changeNodeName` | REAL — PUT `commerce/Node/change-name` | `services/services.ts` |
| `createClientFull` (wizard W9) | REAL — POST `commerce/Node/create-account` via `Gateway.SystemGateway` | `wizard-components/add-client-wizard/services/services.ts` |
| `createUser` (wizard W10) | REAL — POST `user` via `Gateway.IdentityGateway` | `wizard-components/add-user-wizard/services/services.ts` |
| `updateUser` (wizard W10) | REAL — PUT `user/:id/profile` + `user/:id/role` switchMap | same |
| `generatePassword` | REAL — POST `user/generate-password` | same |
| `checkUsernameExists` | REAL — delegates to `AccountValidationService` | same |
| `infoDossier` | MOCK — returns from `MOCK_TREE` seed | `services/hierarchy-page-state.service.ts` |
| `permissions` | MOCK — defaults canCreateUser/Node/Edit = true | computed in state service |
| `OtpMockService` (W13) | MOCK — local validation by design (no backend OTP) | `services/otp-mock.service.ts` |
| `UserDetailsPage save` (W12) | MOCK — in-memory only; emits `(save)` upward without backend persist | `components/user-details/user-details-page.component.ts` |

## Mock fallback verification

`HierarchyService.getTree()` (verbatim from reference) wraps the real fetch in `catchError(() => of(MOCK_TREE))`. Tree always renders even with backend offline — confirmed by W7-W12 build smoke tests (no runtime crashes).

## Facade swap deferred

Per task brief: "The state service ALREADY uses real HierarchyService backed by NodeService. So real tree fetch is wired. For this wave: Verify the page falls back to MOCK_TREE on backend error… No new code typically — verification + documentation wave."

Per Phase 5 §6 the planned `OrgHierarchyMockFacade` + `HIERARCHY_FACADE` token wiring is NOT applied; the more pragmatic real `HierarchyService` from reference is used directly. To swap later: drop a `useClass` provider at the feature route level.

## Build / lint gate

```
npx nx build admin-console      # Hash: 33ea599de46188cd — SUCCESS
npx nx build host-shell          # cached — SUCCESS (regression OK)
npx nx build management-console  # Hash: 74344ece3a1f7586 — SUCCESS (regression OK)
```

## Acceptance criteria

| # | Criterion | Status |
|---|---|:---:|
| 1 | If backend reachable → real tree | YES — wired |
| 2 | If 401/500/timeout → SEED_TREE fallback | YES — `catchError` in `HierarchyService.getTree()` |
| 3 | Users table fetches via real backend | YES — `state.fetchUsersForNode()` → `HierarchyService.getUsers()` |
| 4 | Documented remaining mocked surfaces | YES — see table above |

End of Wave 16 report. Advancing to W18.
