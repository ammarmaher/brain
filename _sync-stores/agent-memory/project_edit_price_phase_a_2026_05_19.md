---
name: Edit-Price feature Phase A landed
description: Phase A of the edit-price feature for applications (admin-console Apps tab) — endpoint bug fix + row in-flight + error toast.
type: project
originSessionId: b587fc86-734c-4f63-b47d-a1ec14184cff
---
🟢 BUILD-GREEN (NOT runtime-tested) 2026-05-19. Phase A of the edit-price/do-payment feature for APPLICATIONS, admin-console Apps tab, branch polishing-v0.4. Plan at `reports\edit-price-applications-FE-implementation-plan.md`.

A1 audit found the feature ~90% already built; Phase A was 1 real bug + 2 gaps:
- **G1 (bug)** — do-payment for applications was POSTing the comm-channel endpoint. Fixed: new `ApplicationPaymentService` (`libs/falcon/src/shared-data-access/lib/services/`) → `commerce/node/application/do-payment`; `do-payment-priority-popup` got a `target: 'application'|'comm-channel'` discriminator (defaults comm-channel, so comm-channels tab unaffected); `submit()` routes the initial POST by target; priority drag-drop still uses `getVisibleCommChannels` for both. `DoPaymentApplicationRequest/Response` added to `do-payment.models.ts`.
- **G2** — `startDoPayment` now sets the existing `submitting` signal (row in-flight via data-table `[loading]`); cleared in `onIbSucceeded/onIbFailed`. No per-row rowSkeleton (Phase B).
- **G3** — `onMutationError` now fires `FalconToastService.error('hierarchy.services.mutationError')` (new i18n key en+ar); failed price save no longer pre-deletes `editForms` so input is preserved for retry.

Builds: `nx build admin-console` + `nx build host-shell` both GREEN. Build-verified only — do-payment routing / row in-flight / failure toast NOT runtime-tested.

**Next:** Phase B = generic SignalR realtime + loader + per-row `rowSkeleton` table enhancement (TODO-marked, no backend hub yet). Phase C = poll→SignalR swap. Edit-price = sync save (no charge); only do-payment is the async/realtime target.

**Follow-up 2026-05-19** — G1 was a 3-copy bug; the org-hierarchy fix above did NOT reach the sibling copies. The Apps/Services table exists as 3 near-identical components: `org-hierarchy-page/.../apps-services-tab` (canonical), `marketplace-applications/.../apps-services-table`, and `comm-channels-services/.../comm-channels-table`. The marketplace `apps-services-table.startDoPayment()` still omitted `target`, so application payments hit `comm-channel/do-payment`. Fixed: it now sets `target: 'application'` in the `ibTrigger` payload (matching the canonical copy). `comm-channels-table` is a genuine comm-channel — omitting `target` (defaults to `'comm-channel'`) is correct there; verified and left as-is. Lesson: any do-payment change must be applied to all 3 copies, since they drift independently.
