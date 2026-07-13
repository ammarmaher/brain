# falcon-ai-tts-svc — Service Overview

> **AI Speech Service (TTS + STT)** — a pure converter: text → synthesized audio URL, or audio → transcript text. No Asterisk/IVR coupling, no persistence of business entities. gRPC-primary with REST JSON transcoding of the same contract.
>
> Intaken 2026-07-09 from `https://t2development.visualstudio.com/Falcon/_git/falcon-ai-tts-svc` (main @ da26242). Local clone: `C:\Falcon\falcon-ai-tts-svc`.

## Identity card

| Aspect | Value | Source |
|---|---|---|
| Solution | `AiTts.sln`, single API project `Falcon.AiTts.Api` (.NET 10) | [CODE] AiTts.sln |
| Contract SoT | `src/Falcon.AiTts.Api/Grpc/Protos/speech.proto` — `falcon.aitts.v1.SpeechService` | [CODE] speech.proto:17 |
| RPCs (v0.1) | `Synthesize`, `Transcribe`, `ListVoices` (unary); `GetCapabilities`/`SynthesizeStream`/`TranscribeStream` reserved post-v0.1 | [CODE] speech.proto:23-50 |
| Planes | REST/JSON (HTTP/1.1 :8080) via gRPC JSON transcoding · gRPC h2c (HTTP/2 :8081) east-west | [CODE] appsettings.json:25-30 |
| Gateway exposure | `/ai-tts/{**remainder}` → strip prefix → `/v1/*`; core-api (**ClientOnly** + PerTenant rate limit) and system-api (**FalconOnly**, no rate limiter) | [CODE] falcon-int-core-gateway-svc appsettings.json aitts-proxy; falcon-int-system-gateway-svc appsettings.json aitts-proxy |
| Auth | `EastWest` policy on all RPCs — forwarded user JWT (any `user-type` claim, decoded from Zitadel metadata bag) OR service-account token | [CODE] Grpc/SpeechGrpcService.cs (class-level Authorize); Infrastructure/Auth/EastWestAuthorizationHandler.cs |
| Engines | Groq primary (Orpheus TTS EN `canopylabs/orpheus-v1-english` + AR-Saudi `canopylabs/orpheus-arabic-saudi`; Whisper `large-v3-turbo` STT); ElevenLabs fallback engine | [CODE] appsettings.json:81-99; Infrastructure/Speech/Fallback/FallbackSpeechEngine.cs |
| Audio pipeline | ffmpeg transcode (baked into Docker image; PATH lookup) → validate → S3-compatible store (MinIO local / Aliyun OSS QA `falcon-aitts-dev`) → presigned GET URL | [CODE] Infrastructure/Audio/FfmpegAudioTranscoder.cs; Infrastructure/Storage/S3ObjectStorage.cs |
| Cache | Content-addressed on inputs (SHA-256 over engine/model/voice/versions/language/sayAs/format/sampleRate/text), tenant-agnostic, single-flight; hit ⇒ `cacheHit:true`, no engine call | [CODE] Application/Speech/SynthesisCacheKey.cs |
| Observability | Serilog console; Prometheus `/metrics` (`aitts_synthesis_total`, `aitts_synthesis_duration_seconds`, `aitts_transcription_*`); Swagger; `/health/live` + `/health/ready` | [CODE] docs/DEPLOY.md §1 |
| Live status | REST surface live-verified through QA gateways 2026-07-07, 19/19 checks | [CODE] docs/API.md §12 |

## Key operational limits

- Max synthesis text **10,000 chars** (`RequestValidation:MaxTextLength`).
- Max transcribe audio **25 MiB**.
- **16 concurrent syntheses** (`Concurrency:MaxConcurrentSynthesis`), excess fails fast `429 RESOURCE_EXHAUSTED` (not queued); cache hits don't consume permits.
- Presigned `audioUrl` TTL **~60 min** (`S3:DownloadUrlExpiryMinutes`).
- Vendor chunking: long text split ~200 chars (`Groq:Tts:MaxInputChars`) on sentence/word boundaries and concatenated.

## Known quirks (live-verified, docs/API.md §12)

- `SAY_AS_DIGITS` currently a **no-op** (byte-identical audio).
- **MP3 responses report `durationMs: 0`** (metadata quirk; bytes correct) — `AudioMetadataExtractor` computes duration only for µ-law/WAV.
- Segment `confidence` always `0` (Whisper doesn't return it).
- Format fallback: µ-law encode failure ⇒ WAV output — **always trust response `format`**, not the request.
- JSON surface is **camelCase**; enums sent as full wire values (`LANGUAGE_EN`, `AUDIO_FORMAT_MP3`).

## Voice catalog (⚠ mismatch)

- `GET /v1/voices` (`ListVoicesHandler`) is a **P1 stub returning only 2 voices**: `hannah` (EN, default) + `noura` (AR, default).
- `GroqVoiceCatalog` (used to *validate* synthesize `voiceId`) accepts **12 voices**: EN hannah*, autumn, diana, austin, daniel, troy · AR noura*, lulwa, aisha, abdullah, fahad, sultan (*=default).
- FE Convert-Text dropdown consuming `/v1/voices` will show 2 until the handler is wired to the catalog (GAP-AITTS-02).

## Deploy & local run

- **QA/dev K8s (P8)**: manifests staged in `Falcon-Dev-K8s` (PR-only repo); out-of-band blockers: ECR repo `falcon-qa-ai-tts-api`, Aliyun OSS bucket `falcon-aitts-dev` (me-central-1), Zitadel service-account (Door-2) secrets, Groq key. See docs/DEPLOY.md §2.
- **Local (documented plan, NOT yet in compose)**: service `ai-tts`, host ports 5210→8080 REST / 5211→8081 gRPC, MinIO bucket `falcon-aitts-dev` via extended minio-init, `Groq__ApiKey` host env. ⚠ As of 2026-07-09 `C:\Falcon\Falcon\Falcon\docker-compose.yml` has **no ai-tts entry** and host port **5210 is held by comm-realtime** — see GAP-AITTS-01.
- docs/DEPLOY.md's "no gateway/ingress route (east-west only)" is **STALE** — both gateway repos carry the `/ai-tts` route on main (core PR 43230 merged 2026-07-06; system PR 43246 merged 2026-07-07).

## Gaps register

| Id | Gap | Evidence |
|---|---|---|
| GAP-AITTS-01 | ~~No `ai-tts` service in local compose~~ **RESOLVED locally 2026-07-09** — added to `docker-compose.override.yml` (untracked): `ai-tts` built from repo (image `falcon-ai-tts:latest`, ffmpeg baked, ports 5220/5221), both gateways' `aitts-cluster`→`http://ai-tts:8080`, `falcon-aitts-dev` bucket via `ai-tts-minio-init`, Groq key via git-ignored `.env`. Live-verified: voices+synthesize (EN+AR) 200 through both gateways, cache hit, presigned fetch OK. (5210 collision avoided by using 5220/5221 + docker-network name.) | docker-compose.override.yml |
| GAP-AITTS-02 | ListVoices stub (2) vs synthesize-accepted catalog (12) | ListVoicesHandler.cs vs GroqVoiceCatalog.cs |
| GAP-AITTS-03 | No persistence bridge: synthesized audio lives in the ai-tts bucket behind a ~60-min presigned URL; templates-svc voice records need the bytes in *their* bucket; the planned `from-tts` create path ("Chunk 1C") is unimplemented and upload-session rejects `source=2` | templates-svc feat/ivr-templete CreateVoiceRecordUploadSessionValidator.cs |
| GAP-AITTS-04 | Design doc `.falcon-docs/ai-tts-svc/falcon-ai-tts-svc-design-v0.4.md` referenced by DEPLOY.md/speech.proto is not on disk anywhere under C:\Falcon | DEPLOY.md:7; speech.proto:16 |
| GAP-AITTS-05 | No PRD/BR coverage for Convert-Text (BR-TM-30 [OPEN]); 10,000-char limit is an engine limit, not a business rule | PRD Template-Module-V4; Brain Outputs prd/modules/05-templates/BUSINESS_RULES.md:71 |
| GAP-AITTS-06 | README.md is an untouched Azure DevOps template stub; real docs live in docs/API.md + docs/DEPLOY.md | README.md |

## Related

- Consumer plan: `C:\Falcon\plans\ai-tts-fe-integration-plan-2026-07-09.md`
- FE seam: voice-record create wizard `record-details-step` (both consoles) in `falcon-web-platform-ui`
- Persistence sibling: [Templates Service](../falcon-core-templates-svc/) voice records (branch `feat/ivr-templete`)
