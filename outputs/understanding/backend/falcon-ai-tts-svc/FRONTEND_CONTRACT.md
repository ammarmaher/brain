# falcon-ai-tts-svc — Frontend Contract (Voice "Convert Text" wizard)

> How the Web Platform FE consumes this service for the voice-record create wizard. Companion plan: `C:\Falcon\plans\ai-tts-fe-integration-plan-2026-07-09.md`. All claims adversarially verified 2026-07-09.

## ✅ IMPLEMENTATION STATUS — DONE (2026-07-09, branch `polishing-v0.4`, uncommitted)

The Convert-Text seams below are **now wired** in both consoles; `nx build management-console,admin-console` GREEN, zero warnings on the changed files. NOT committed/pushed (Ammar reviews first).

| Added / changed | Path (mgmt; admin twin identical) |
|---|---|
| NEW models | `…/voice-service/models/ai-tts.models.ts` (wire+domain+mappers, `TTS_SAVE_FORMAT`=MP3, `ttsVoiceLabel`) |
| NEW service | `…/voice-service/services/ai-tts-api.service.ts` (`getVoices`, `synthesize`→typed `SynthesizeOutcome` 400/429/503, `fetchAudioAsFile` native-fetch + docker-host rewrite; relative `ai-tts/v1/*` + `useGateway()`) |
| Voices dropdown | `record-details-step.component.ts` — lazy `getVoices()` on first Convert-Text select, preselect `isDefault`, empty-state note (killed layla/omar/sarah) |
| Convert + preview | `onConvert()` → synthesize(MP3) → download → `fileChange` → existing waveform preview + presigned-upload pipeline reused |
| Save gate | `sourceReady()` accepts TextToSpeech once a converted file exists; editing text/voice invalidates the conversion (preview-before-save) |
| Provenance | `CreateUploadSessionRequest.source` now sends `2` (TextToSpeech); comment updated |
| i18n | `en.json`+`ar.json` — `ttsConverting/ttsConverted/ttsRemoveConverted/ttsNoVoices/ttsError.*` |

**Runtime dependency (unchanged):** convert+preview work once the ai-tts service is reachable via the gateway; **save** needs backend **B-0** (templates-svc accept `source=2`). Admin console save stays 403 under Falcon JWT (D-5). Local end-to-end also needs Phase 0 infra (ai-tts in compose; port 5210 currently comm-realtime).

## Where FE plugs in (verified seams, both consoles)

| Seam | File (management-console; admin twin identical) | Lines |
|---|---|---|
| Hardcoded mock voices `layla/omar/sarah` → replace with GET /v1/voices | `apps/management-console/src/app/features/comms-hub/pages/voice-service/create-wizard/steps/record-details-step/record-details-step.component.ts` | 121-125 |
| `onConvert()` stub (toast `ttsUnavailable`) → replace with POST /v1/synthesize | same file | 275-281 |
| `sourceReady()` excludes TTS → allow TextToSpeech once converted file exists | same file | 129-132 |
| `fileChange = output<File\|null>()` → emit synthesized audio as File; reuses preview player + presigned-upload create pipeline unchanged | same file | 89 |
| Admin twin | `apps/admin-console/src/app/features/comm-channels-services/pages/voice-service/create-wizard/steps/record-details-step/…` | identical |

## Calls (through the console's own gateway — no new auth/config)

- Management Console → CoreGateway (`http://localhost:7038` local): `GET ai-tts/v1/voices`, `POST ai-tts/v1/synthesize` — route `aitts-proxy` ClientOnly + PerTenant (committed on main, core-gateway appsettings.json:169-179).
- Admin Console → SystemGateway (`:7256`): same paths, FalconOnly (system-gateway appsettings.json:122-131). ⚠ voices+synthesize work, but SAVING a record is hard-403 for Falcon JWTs (templates-svc client-only writes) — mgmt console is the E2E path today.
- Relative path + `useGateway()` + `RuntimeBaseUrlInterceptor` exactly like `templates/voice-records`; host-shell RequestInterceptor attaches the Bearer automatically and already skips presigned S3 URLs.
- New `ai-tts-api.service.ts` belongs in EACH console beside `voice-records-api.service.ts` (standing rule: API services live in host apps, not shared libs).

## Recommended call shapes

```http
GET {gw}/ai-tts/v1/voices            → map voices[] to FalconDropdownOption; label "Name — Language (Gender)"; preselect isDefault
POST {gw}/ai-tts/v1/synthesize
     { "text": "...", "voiceId": "hannah", "language": "<from selected voice>", "format": "AUDIO_FORMAT_MP3" }
     → { audioUrl, objectKey, format, durationMs, byteSize, cacheHit, ... }
```

- **Format ruling: MP3** for preview AND save — browser-native, small (a 10,000-char WAV ≈ 21 MB would bust the voice-record 20 MB cap), and `durationMs:0` is harmless because templates-svc probes duration server-side at `complete`.
- Derive `language` from the selected voice (mismatch ⇒ 400).
- `cacheHit:true` ⇒ repeat conversions are instant/free — safe to re-synthesize after URL expiry.

## Preview + save bridge (interim, FE-only after one BE validator change)

1. `fetch(audioUrl)` (presigned, no auth) → `Blob` → `new File([blob], '<name>.mp3', {type:'audio/mpeg'})`.
2. Emit via `fileChange` → existing waveform preview + duration probe just work.
3. Save through the EXISTING pipeline: `POST templates/voice-records/upload-session {source:2,…}` → PUT presigned → `POST …/{id}/complete {name, sharePolicy}`.
4. ⚠ BLOCKER: upload-session validator currently rejects `source=2` (feat/ivr-templete `CreateVoiceRecordUploadSessionValidator.cs` — only 1|3). One-line backend unblock required, else provenance is lied (source=1). Target state = templates-svc `from-tts` endpoint (their own "Chunk 1C" plan).
5. ⚠ Verify MinIO/OSS CORS allows browser GET of the ai-tts presigned audioUrl (MinIO default `MINIO_API_CORS_ALLOW_ORIGIN=*` usually suffices locally; QA OSS unverified).

## UX gates (Source-of-truth React theme parity)

- Convert enabled only when text non-empty AND voice picked (`ttsReady()` exists).
- Step valid ONLY after a successful conversion (`ttsGenerated` gate); editing text/voice invalidates the preview and forces re-convert.
- Error UX: 400 inline validation · 429 "busy, retry" · 503 transient outage banner.
- i18n keys already exist for the panel (en+ar `voiceRecords.wizard.step1.tts*`); add error keys; `ttsUnavailable`/`ttsBackendNote` become obsolete.
- PES: existing `acc.voice-record` `create` flag gates the card — no new action needed.
