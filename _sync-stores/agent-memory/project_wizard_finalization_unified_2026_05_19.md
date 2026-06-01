---
name: Wizard finalization unified
description: Shared falcon-angular-wizard-finalization component drives Add Client + Add User creation finalization identically.
type: project
originSessionId: 3da1350d-090f-4b35-90f6-d9e3d3de1a20
---
🟢 BUILD-GREEN 2026-05-19. New shared presentational component `falcon-angular-wizard-finalization` (selector `falcon-angular-wizard-finalization`, class `FalconAngularWizardFinalizationComponent`) in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/`, exported via `@falcon/ui-core/angular`.

Drives: channel-selection popup → Send (spinner) → injected `submitFn:(method)=>Observable` API call → success: `falcon-angular-completion-success-dialog` (click-anywhere dismiss) → emits `finalized`; on HTTP/business error → top-right 5s error toast, completion dialog suppressed. Outputs `finalized` + `cancelled`.

Both Add Client (`add-client-wizard.signals.ts` `createClientSubmit$`/`addClientSubmitFn` → `ClientService.createClientFull`) and Add User (`add-user-state.signals.ts` `createUserSubmit$`/`addUserSubmitFn` → `UserService.createUser`) now mount this in `org-hierarchy-page-menu.component.html`. Add User OTP code-entry dialog removed (admin-console only; management-console still uses `falcon-otp-send-dialog`). submitFn rethrows on `isSuccessful===false`. `createClientFull` got `notShowToaster:'true'` to kill a double-toast.

**Why:** user wanted one component + identical finalization UX for both creation wizards.
**How to apply:** any new entity-creation wizard should reuse `falcon-angular-wizard-finalization` with its own `submitFn`; keep API calls in host-app signal slices.
