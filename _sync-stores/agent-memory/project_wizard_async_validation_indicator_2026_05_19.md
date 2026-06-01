---
name: Wizard async-validation indicator + delay fix
description: Add Client/User wizards — inline pending spinner on backend-validated fields + Step 5 username delay root-cause fix
type: project
originSessionId: b523d985-a807-44bb-8643-3f2c6160a3d5
---
🟢 BUILD-GREEN 2026-05-19. Add Client + Add User wizards in `C:\Falcon\Falcon\falcon-web-platform-ui` (note: real path has double `Falcon\Falcon`, not the `C:\Falcon\falcon-web-platform-ui` in old memory).

Three fields hit backend uniqueness checks via `AccountValidationService` (`@falcon`):
- Add Client Step 1 `accountName` → `checkAccountNameExists()` GET /commerce/Node/ValidateAccountName
- Add Client Step 5 `ownerUser` → `isUserExist()` POST /identity/user/exist
- Add User Step 1 `userName` → `isUserExist()` (already had inline spinner)

**Done:** Added inline pending spinner (sibling-overlay `<span animate-spin>` in a `relative` wrapper) to Add Client Step 1 `accountName` (`end-9`, clears the clearable X button) and Step 5 `ownerUser` (`end-3`). Bound to existing `accountNameCheckPending` / `usernameCheckPending` signals. New i18n key `hierarchy.addClient.checking` (en+ar). `TranslatePipe` added to client-account-owner-step imports.

**Root cause of Step 5 username "delayed validation":** `userError()` in `client-account-owner-step.component.ts` gated the async branch behind `if (!touched().has('ownerUser')) return null` — backend duplicate verdict stayed hidden until blur. Add User Step 1 had no such gate. Fixed by removing the touched gate on the async branch (sync-error touched gate kept). Empty state stays silent because `usernameAsyncError` initialises null.
