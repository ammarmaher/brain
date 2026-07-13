# Task history — FE Convert-Text ⇄ ai-tts integration (Phase 1)

- **Date:** 2026-07-09 · **Status:** COMPLETED (FE built GREEN, uncommitted; Ammar reviews)
- **Request:** "proceed with the plan in waves; frontend only; stay on the branch I'm on; don't push or commit; then make the knowledge and Obsidian inside Brain SK work as expected."
- **Branch:** `polishing-v0.4` (unchanged; clean before edits). NO commits/pushes.

## Waves delivered
- **Wave 1** — host-app service layer (both consoles): `models/ai-tts.models.ts` (wire+domain+mappers, `TTS_SAVE_FORMAT`=MP3, `ttsVoiceLabel`) + `services/ai-tts-api.service.ts` (`getVoices`, `synthesize`→typed `SynthesizeOutcome` w/ 400/429/503 mapping, `fetchAudioAsFile` native-fetch + docker-host rewrite). Relative `ai-tts/v1/*` + `useGateway()`.
- **Wave 2** — voices dropdown: lazy `GET /ai-tts/v1/voices` on first Convert-Text select; preselect `isDefault`; empty-state note; removed mock layla/omar/sarah.
- **Wave 3** — convert + preview + gate: `onConvert()` synth(MP3)→download→`fileChange` (reuses existing waveform preview + presigned-upload create path); `sourceReady()` accepts TextToSpeech; edit-text/voice invalidates conversion (preview-before-save); converting/converted UI + error toasts.
- **Wave 4** — provenance + i18n: `source=2` sent (model comment updated); `en.json`+`ar.json` keys (`ttsConverting/ttsConverted/ttsRemoveConverted/ttsNoVoices/ttsError.*`). Twins kept byte-identical (diff-verified).

## Files
- NEW (4): `{mgmt,admin}/…/voice-service/models/ai-tts.models.ts`, `…/services/ai-tts-api.service.ts`
- EDITED (8): 2 × `record-details-step.component.ts`, 2 × `.html`, 2 × `voice-record.models.ts` (comment), `libs/falcon/src/language/i18n/en.json`, `ar.json`

## Gate
- `nx run-many build management-console,admin-console --configuration=development` → exit 0. Zero warnings on changed files (only pre-existing NG8102 in unrelated `button-card.component.html`).
- Not runtime-verified end-to-end: local convert needs Phase-0 infra (ai-tts on the gateway; 5210 currently comm-realtime) + save needs backend B-0 (source=2). Did NOT drive Ammar's live MF dev servers (4200/4204/4301).

## Knowledge / Obsidian synced
- `Brain Outputs/understanding/backend/falcon-ai-tts-svc/FRONTEND_CONTRACT.md` — implementation-status banner.
- `Brain SK/_obsidian/45-Backend/AI TTS Service.md` — "FE integration status" section.
- `plans/ai-tts-fe-integration-plan-2026-07-09.md` — Phase-1 marked done.
- Memory `project_ai_tts_svc_intake_fe_integration_plan_2026_07_09.md` — implementation addendum.

## Pending on others
Backend B-0 (accept source=2) unblocks save; B-1 durable from-tts is the durable target; Phase-0 infra for local E2E; admin save 403 until act-as-client (D-5).
