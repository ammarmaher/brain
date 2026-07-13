---
type: backend-service
service: ai-tts
primary-prds: [PRD-05]
repo: falcon-ai-tts-svc
created: 2026-07-09
---
*** Backend Service — AI TTS / Speech ***
*** SoT: Brain Outputs/understanding/backend/falcon-ai-tts-svc/ ***
*** Repository: C:\Falcon\falcon-ai-tts-svc ***

# AI TTS Service (Speech — TTS/STT)

> **Pure converter**: text → synthesized audio URL (Groq Orpheus, EN + Saudi AR) and audio → transcript (Groq Whisper large-v3-turbo). gRPC-primary (`falcon.aitts.v1.SpeechService`, h2c :8081) with REST JSON transcoding (:8080) of the same contract: `GET /v1/voices` · `POST /v1/synthesize` · `POST /v1/transcribe`. ElevenLabs fallback engine, ffmpeg transcode, S3/MinIO/OSS storage, content-addressed tenant-agnostic cache.
>
> **Gateway-exposed on main since 2026-07-06/07**: `/ai-tts/*` on core-api (ClientOnly + PerTenant) and system-api (FalconOnly). Live-verified on QA 2026-07-07 (19/19). The repo's DEPLOY.md "east-west only" is stale.

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/falcon-ai-tts-svc/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/falcon-ai-tts-svc/ENDPOINT_REGISTRY.md)
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/falcon-ai-tts-svc/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/falcon-ai-tts-svc/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/falcon-ai-tts-svc/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/falcon-ai-tts-svc/FRONTEND_CONTRACT.md)
- Repo docs: `C:\Falcon\falcon-ai-tts-svc\docs\API.md` (consumer reference, QA-verified) · `docs\DEPLOY.md` (P8; partially stale)

## Pages served

- Voice Service create wizard — **Convert Text** panel (both consoles; FE seams verified, currently stubbed)
- Future: voice templates / IVR flows (gRPC east-west consumers "voice + templates" per design)

## Consumers & neighbors

- [[Templates Service]] — voice records persistence (branch `feat/ivr-templete`); reserved `eVoiceRecordSource.TextToSpeech=2`; planned `from-tts` create path (Chunk 1C) NOT implemented; upload-session validator rejects source=2
- [[Core Gateway Service]] / [[System Gateway Service]] — `aitts-proxy` YARP routes (committed on main)
- Voice runtime (`/voice/**` → :8082) — repo not cloned locally; unlocated

## Key limits & quirks

10,000-char text · 16 concurrent syntheses (429 fail-fast) · presigned URL ~60 min · MP3 `durationMs:0` quirk · µ-law default NOT browser-playable · `sayAs` currently no-op · ListVoices stub returns 2 voices while synthesize accepts 12 (GroqVoiceCatalog).

## Open gaps

GAP-AITTS-01 local compose absent + port 5210 collision (comm-realtime) · GAP-AITTS-02 ListVoices stub · GAP-AITTS-03 no TTS→voice-record persistence bridge · GAP-AITTS-04 design doc v0.4 missing on disk · GAP-AITTS-05 no PRD/BR for convert-text (BR-TM-30 OPEN) — full register in SERVICE_OVERVIEW.

## Integration plan

- `C:\Falcon\plans\ai-tts-fe-integration-plan-2026-07-09.md` — phased FE⇄BE plan (verified 2026-07-09, 7/7 claims confirmed)

## FE integration status — ✅ Convert-Text WIRED (2026-07-09)

Phase 1 FE **done** on branch `polishing-v0.4` (uncommitted; Ammar reviews). Both consoles: new `models/ai-tts.models.ts` + `services/ai-tts-api.service.ts`; voices dropdown from `GET /ai-tts/v1/voices`; `onConvert()` → `POST /ai-tts/v1/synthesize` (MP3) → download → emit as record file → existing preview + presigned-upload pipeline; preview-before-save gate; `source=2` provenance; en+ar i18n. `nx build` both consoles GREEN, zero warnings on changed files.

**Backend still needed:** B-0 accept `source=2` on upload-session (else save 400); B-1 durable `from-tts`. Full detail: [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/falcon-ai-tts-svc/FRONTEND_CONTRACT.md).

## Local infra — ✅ LIVE & VERIFIED (Phase 0, 2026-07-09)

`ai-tts` wired into the local stack via `docker-compose.override.yml` (untracked): built from the sibling repo (`falcon-ai-tts:latest`, ffmpeg baked, ports 5220/5221); both gateways' `aitts-cluster`→`http://ai-tts:8080`; `falcon-aitts-dev` bucket; Groq key in git-ignored `.env`. **Live-verified:** `GET /ai-tts/v1/voices` 200 (hannah+noura) through core (7038) **and** system (7256) gateways; `POST synthesize` EN+AR → 200 real MP3; `cacheHit:true` on repeat; presigned fetch after `minio→localhost` rewrite → 200 audio/mpeg (SigV2 ⇒ rewrite-safe). **Findings:** ElevenLabs fallback is a stub (Groq failure ⇒ 503, FE toasts gracefully); MP3 `durationMs:0`. Convert+preview now work in the browser.

## Full flow (incl. SAVE) — ✅ E2E-VERIFIED locally 2026-07-09

Ammar authorized backend enablement. Two LOCAL/uncommitted templates-svc edits on `feat/ivr-templete` (switched from the consolidation branch; clean tree): **B-0** validator accepts `source=2`; **auth bridge** `ZitadelClaimsTransformation` falls back to `sub` for `user-id` (the ivr branch predates the Zitadel-id consolidation whose tokens dropped `user-id` metadata — the **B-5** gap, bridged locally). Verified through the core gateway: synthesize(MP3)→upload-session(source=2)=201→PUT=200→complete=**200** (Ready, source=2, duration 0:04 server-probed)→list→preview-url 200→delete 204. Durable fix (backend team): merge `feat/ivr-templete` rebased over the consolidation (B-5) + a real `from-tts` endpoint (B-1). Revert: `git checkout .` + `git checkout feature/zitadel-id-consolidation` + restart templates.
