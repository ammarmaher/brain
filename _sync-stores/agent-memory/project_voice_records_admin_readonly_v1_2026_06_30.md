---
name: project_voice_records_admin_readonly_v1_2026_06_30
description: "Voice Service (Voice Records) admin-console Falcon read-only view — built W1-W4, nx GREEN, uncommitted on polishing-v0.4; create-wizard/share/delete deferred per Falcon-read-only API."
metadata: 
  node_type: memory
  type: project
  originSessionId: 5976432b-1428-415f-a958-f9c51cccf11d
---

Built the **Voice Service → Voice Records** page in the **admin-console** (`apps/admin-console/src/app/features/comm-channels-services/pages/voice-service/`) as a **Falcon read-only v1**. nx build admin-console GREEN; **UNCOMMITTED on `polishing-v0.4`** (do NOT commit without instruction).

**Decisions locked by user 2026-06-30:** D1=**read-only first** (Falcon JWT hard-403s create/complete/share/delete per the API md → no write UI in v1, no Switch-Perspective, "Falcon — Read only" badge shown); D2=show-3-cards-TTS-disabled (for the future wizard); D3=Voice-Account tab = placeholder empty-state; D4=share users via cloned `searchShareableUsers` (`identity/user`); D5=delete enabled + 409 toast. All in the plan at `C:/Falcon/Source_of_truth_theme/VOICE-RECORDS-ADMIN-IMPLEMENTATION-PLAN.md`.

**What shipped (W1-W4):**
- Shell `voice-service.component` = org-hierarchy clients tree (left) + `falcon-node-details-section` header + `falcon-angular-tabs` (Voice Account | Voice Records, records default). Reuses parent-route `CommChannelsPageStateService` for client selection.
- `voice-records-tab` = `falcon-angular-data-table` **server-side paged** (`[lazy]` + `[paginator]=false` + custom footer; signal-driven `toObservable(query)`→`switchMap` load), `falcon-angular-search-input`, columns name/preview/createdAt(date+time cell)/source(badge), row action **More details** only.
- **NEW shared lib component `falcon-angular-audio-player`** (`libs/falcon-ui-core/.../falcon-audio-player`, exported from `angular-wrapper/index.ts`): Tailwind-only click-to-play pill (play/pause + progress + time) over one HTMLAudioElement; source-agnostic via `[src]` OR lazy `[resolve]` callback (mints/refreshes a presigned URL per play). App glue `voice-record-preview.component` (one instance per row) injects the API and resolves `GET /{id}/preview-url` (cached until ~30s pre-expiry).
- W4 details dialog (`falcon-angular-dialog`) fetches `GET /{id}` → name/source/format/duration/size/createdAt/createdBy.
- i18n `voiceRecords.*` in en.json + ar.json.

**API contract (read endpoints only):** service `VoiceRecordsApiService`, base **`templates/voice-records`** via admin SystemGateway (`useGateway()` no-arg); same `falcon-core-templates-svc` as templates (`TEMPLATES_API_PREFIX='templates/templates'`). Params **camelCase** `tenantId`/`nodeId`/`nameContains`/`page`/`pageSize` (Falcon MUST pass tenantId+nodeId). Envelope `ServiceOperationResult<PagedResult>` but PagedResult here uses **`page`** not `pageNumber`.

**KNOWN GAPS (flagged to user, need backend):** (1) list-row DTO has NO `createdBy`/`sharedWith`/`availableActions` → those columns omitted, actions FE-derived. (2) Convert-Text/TextToSpeech has no upload endpoint. (3) Voice-Account tab has no API. (4) Create/Share/Delete need an act-as-client token mechanism before they can be built (the whole reason v1 is read-only).

**DEFERRED (not built):** Share + Delete row actions (need the write token).

**UPDATE 2026-06-30 — Create wizard BUILT + strict SoT fixes + adversarial review (build GREEN, still uncommitted polishing-v0.4):** Per user feedback ("be strict, same as SoT"): REMOVED the search bar (not in SoT) + the read-only badge; ADDED the "Create Voice Record" button (records-tab header) + aligned table to the SoT 7 columns (added Created by + Shared with — list DTO lacks the data so they show "—"). Built the 2-step **Create wizard** under `create-wizard/`: orchestrator (own node-header + Cancel/Previous/Next→Create, `falcon-angular-stepper`, "New Voice Record"/"step N/2") swapped into the shell via a `creating` signal (tree stays); step1 = name(≤40) + 3 source cards (Upload functional via `falcon-document-uploader`; Convert-Text + Record DISABLED/coming-soon — only Upload wired v1); step2 = `falcon-multi-select` + selected-cards (recipients from `identity/user`). Commit = `createUploadSession → XHR putToPresignedUrl(progress) → completeUpload(name,sharePolicy)`. 3-reviewer adversarial pass: i18n COMPLETE (69 keys, 0 missing en+ar; `common.back`="Previous"), SoT parity CONFIRMED on every dimension, commit flow wire-correct vs the md. Fixed 1 BLOCKER — `onFileAdded` must read `detail.nativeFile` (the raw File), NOT `detail.file` (a metadata view-model) or the PUT uploads garbage — plus: onStepClick `creating()` guard, contentType MIME fallback from extension, name re-guard in commit, a11y radiogroup, upload progress bar. STILL: Falcon JWT 403s writes (act-as-client token pending → wizard surfaces server msg as toast); Record(mic)/Convert-Text/Voice-Account/Share/Delete deferred. Dev: `nx serve host-shell` must be RESTARTED to pick up the new lib export + files.

**Lib build gotcha:** `falcon-ui-core:build` is a Stencil build, `cache:false`, keyed on `src/**/*` — changing lib source (e.g. adding the audio player) re-runs it and it can flakily emit a broken `dist/*.d.ts` ("not a module"); a clean re-run regenerates valid dist. NOT a code bug.

Reference twins used: `templates-page` (admin, same backend, tabs+data-table) and contact-group `create-contact-group` (wizard+share). Live browser E2E is **user-gated** (not yet runtime-verified). Related: [[project_commchannels_submenu_meta_voice_ai_2026_06_30]], [[feedback_fe_no_commit_no_branch_without_instruction_2026_06_22]].
