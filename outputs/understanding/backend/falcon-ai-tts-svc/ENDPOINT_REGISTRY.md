# falcon-ai-tts-svc — Endpoint Registry

> REST surface = gRPC JSON transcoding of `falcon.aitts.v1.SpeechService` (speech.proto is the contract SoT). All JSON camelCase; enums as full wire values. Gateway public path prefix: `/ai-tts` (stripped before forward). Live-verified on QA 2026-07-07 (docs/API.md §12).

## Business endpoints (all require auth — EastWest policy)

| # | Method | Service path | Gateway path | Purpose |
|---|---|---|---|---|
| 1 | GET | `/v1/voices[?language=LANGUAGE_EN\|LANGUAGE_AR]` | `{gw}/ai-tts/v1/voices` | List synthesis voices (optional language filter). ⚠ stub: returns only hannah+noura today |
| 2 | POST | `/v1/synthesize` | `{gw}/ai-tts/v1/synthesize` | Text → speech; stores audio; returns presigned `audioUrl` + metadata; content-addressed cache |
| 3 | POST | `/v1/transcribe` | `{gw}/ai-tts/v1/transcribe` | Audio (inline base64 ≤25 MiB OR fetchable URL) → transcript + timed segments |

Gateways: core-api (`http://localhost:7038` local / `https://core-api.falconhub.space` QA) — **ClientOnly** + PerTenant rate limit (100/60s sliding window). system-api (`http://localhost:7256` / `https://system-api.falconhub.space`) — **FalconOnly**, no rate limiter. Gateway auto-injects `X-Tenant-Id` (from JWT, anti-spoofed) + `X-Correlation-Id`.

## gRPC (east-west, in-cluster only — NOT gateway-exposed)

- `SpeechService.Synthesize / Transcribe / ListVoices` — unary, package `falcon.aitts.v1`, address `aitts:8081` (h2c), planned local host port 5211.
- Same EastWest auth (forwarded user JWT or service-account/Door-2 token via `ClientAuthInterceptor` + `ZitadelServiceTokenProvider` seams).
- Reserved post-v0.1: `GetCapabilities`, `SynthesizeStream`, `TranscribeStream`.

## Ops endpoints (anonymous on pod)

| Method | Path | Returns |
|---|---|---|
| GET | `/health/live` | 200 "Healthy" (no dependency checks) |
| GET | `/health/ready` | 200 "Healthy" (dependency checks) |
| GET | `/metrics` | Prometheus exposition (`aitts_synthesis_total{cache_hit,engine,format}`, `aitts_synthesis_duration_seconds`, `aitts_transcription_*`) |
| GET | `/swagger` | Swagger UI (REST port only) |

## Request/response cheat-sheet

### POST /v1/synthesize
Request: `{ text*, language?, voiceId?, format?, sayAs?, tenantId?, idempotencyKey? }`
Response: `{ audioUrl, objectKey, format, sampleRate, durationMs, checksum, byteSize, cacheHit }`
- `audioUrl` = presigned OSS/MinIO GET, ~60 min TTL, fetch WITHOUT auth.
- `objectKey` = durable `aitts/<sha256-of-inputs>.<ext>`.
- `format` in response = ACTUAL produced format (µ-law may fall back to WAV).
- MP3 ⇒ `durationMs: 0` (quirk).

### POST /v1/transcribe
Request: `{ audioBytes(base64) XOR audioUrl, language?, format? }`
Response: `{ text, language, segments[{text,startMs,endMs,confidence(always 0)}] }`

### GET /v1/voices
Response: `{ voices[{voiceId, name, language, gender, isDefault}] }`

## Enums

- `Language`: `LANGUAGE_UNSPECIFIED`(auto) · `LANGUAGE_EN` · `LANGUAGE_AR`
- `AudioFormat`: `AUDIO_FORMAT_ULAW_8000_MONO` (default, telephony, `audio/basic` `.ulaw`, NOT browser-playable) · `AUDIO_FORMAT_WAV_16000_MONO` (`audio/wav`) · `AUDIO_FORMAT_MP3` (`audio/mpeg`, 8 kHz)
- `SayAs`: UNSPECIFIED/CARDINAL/ORDINAL/DIGITS/CURRENCY/DATE/TIME/TELEPHONE/SPELL_OUT — currently pass-through no-op
