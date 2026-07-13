# falcon-ai-tts-svc — DTO Dictionary

> Wire shapes of the REST/JSON surface (camelCase; proto snake_case underneath). SoT: `src/Falcon.AiTts.Api/Grpc/Protos/speech.proto`. Verified live 2026-07-07 (docs/API.md).

## SynthesizeRequest (POST /v1/synthesize)

| JSON field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `text` | string | ✔ | — | ≤ 10,000 chars |
| `language` | enum Language | — | `LANGUAGE_UNSPECIFIED` | omit ⇒ engine auto-routes; must match voice's language if voiceId set |
| `voiceId` | string | — | per-language default (`hannah`/`noura`) | unknown ⇒ 400 |
| `format` | enum AudioFormat | — | `AUDIO_FORMAT_ULAW_8000_MONO` | use MP3/WAV for browser |
| `sayAs` | enum SayAs | — | `SAY_AS_UNSPECIFIED` | pass-through, currently no-op |
| `tenantId` | string | — | — | reserved; cache tenant-agnostic |
| `idempotencyKey` | string | — | — | reserved |

## SynthesizeResponse

| JSON field | Type | Notes |
|---|---|---|
| `audioUrl` | string | presigned GET, ~60 min TTL, NO auth to fetch |
| `objectKey` | string | durable `aitts/<sha256-of-inputs>.<ext>` |
| `format` | enum AudioFormat | ACTUAL format (µ-law may fall back to WAV) |
| `sampleRate` | int | 8000 (µ-law/MP3) / 16000 (WAV) |
| `durationMs` | int | ⚠ 0 for MP3 |
| `checksum` | string | SHA-256 hex of audio bytes |
| `byteSize` | int64 | encoded size |
| `cacheHit` | bool | true ⇒ served from cache |

## TranscribeRequest (POST /v1/transcribe)

| JSON field | Type | Req | Notes |
|---|---|---|---|
| `audioBytes` | base64 string | one-of | inline audio ≤ 25 MiB |
| `audioUrl` | string | one-of | fetchable URL (e.g. a synthesize audioUrl) |
| `language` | enum Language | — | hint; omit ⇒ auto-detect |
| `format` | enum AudioFormat | — | format of SUPPLIED audio |

## TranscribeResponse

| JSON field | Type | Notes |
|---|---|---|
| `text` | string | transcript |
| `language` | enum Language | detected |
| `segments` | Segment[] | `{text, startMs, endMs, confidence(always 0)}` |

## Voice (GET /v1/voices → `{voices: Voice[]}`)

| JSON field | Type | Example |
|---|---|---|
| `voiceId` | string | `"hannah"`, `"noura"` (vendor id) |
| `name` | string | `"Hannah"` |
| `language` | enum Language | `"LANGUAGE_EN"` |
| `gender` | string | `"female"` / `"male"` |
| `isDefault` | bool | default for its language |

## Error envelope (REST, non-2xx)

```json
{ "code": 3, "message": "Synthesis text is required.", "details": [] }
```
`code` = gRPC status int. See ERRORS.md.
