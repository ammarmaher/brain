# Voice-Records FE → nested sharePolicy backend contract + Select-All write support

**Completed 2026-07-06 · both builds green · new mapper spec passes (12 tests).**

## What & why
Backend (falcon-core-templates-svc @ 54c3f22) now returns nested `sharePolicy { sharedWithAllUsers, sharedUsers[]|null }` on all voice-record read payloads. FE in both consoles was on an abandoned flat prototype (createdByName/sharedWith/sharedWithAllUsers/sharedUsers). Rewired FE to match; added full Select-All (broadcast) write support.

## Changes (23 files, both mgmt comms-hub + admin comm-channels-services voice-service)
- models/voice-record.models.ts: new VoiceRecordSharePolicyWire; list/details wire use nested sharePolicy; domain row gains sharedUsers[]; new voiceSharedUserDisplayName(); mapper null≡[], defensive default; createdByName null on list rows.
- mgmt shared-records-tab: exact "You" fold via session.identityUserId vs sharedUsers[].userId (removed name/email heuristic + stale "future backend tweak" comment).
- Select-All: falcon-angular-switch toggle in details editor + wizard share step (both apps); picker hidden while on; details seeds from d.sharedWithAllUsers, save no longer force-false (fixes silent downgrade); wizard policy build all-users→{true,[]}. Removed [showSelectAll] from pickers.
- New __tests__/voice-record-models.spec.ts (both apps).
- Fixed stale createdBy header comments in admin grid.

## Decisions (user-approved)
1. Created-by columns kept rendering "—" (list DTO has no creator — backend gap, flagged; do not author backend).
2. Full Select-All write support.

## Verify
- npx nx run-many -t build -p management-console,admin-console → Successfully ran (exit 0). Only pre-existing NG8102 + bundle-budget warnings in templates-page.
- voice-record-models.spec.ts → 12/12 pass.
- Pre-existing unrelated failure: contact-groups create-contact-group.component.spec (FalconMessageOrchestrator DI).

## Not done
- Not committed/pushed (standing rule).
- Backend list-DTO creator field: flagged to backend team.
