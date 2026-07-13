# falcon-ai-tts-svc — Error Model

> gRPC-status-first; REST returns the gRPC envelope `{code, message, details[]}` with a mapped HTTP status. Mapping in `Grpc/SpeechGrpcService.cs:121-190` + `Startup/ExceptionHandlers/GlobalExceptionHandler.cs`.

| HTTP | gRPC status (code) | Trigger | Example message | FE handling |
|---|---|---|---|---|
| 400 | INVALID_ARGUMENT (3) | empty/oversized text; unknown voice; missing transcribe audio; bad enum; audio > 25 MiB; bad audio URL | `Synthesis text is required.` / `Voice 'nobody' is not available for language 'en'.` | show validation message; don't retry |
| 429 | RESOURCE_EXHAUSTED (8) | > 16 concurrent syntheses (fail-fast) | — | toast "busy", back off + retry |
| 503 | UNAVAILABLE (14) | speech engine down (vendor 5xx/timeout) after Groq→ElevenLabs fallback chain | — | transient; retry affordance |
| 500 | INTERNAL (13) | transcode failure / storage (OSS) failure / produced-audio validation failure | — | generic failure toast |
| 401 | — | missing/invalid token | — | enforced at the gateway; normal auth refresh flow |
| 403 | — | wrong userType for the gateway route (ClientOnly on core-api / FalconOnly on system-api) | — | console is on the right gateway by construction |

Notes:
- Error `message` strings may quote proto snake_case names (`audio_bytes`) — cosmetic; JSON fields are camelCase.
- Engine-outage runbook: fallback chain Groq → ElevenLabs → cached asset → error; `aitts_*` metrics + UNAVAILABLE statuses surface it (docs/DEPLOY.md §5).
- Gateway-level: core-api PerTenant rate limit (100 req/60s sliding window) also returns 429 with `ServiceOperationResult.Failure("TooManyRequests")` — distinguishable from the service's gRPC envelope.
