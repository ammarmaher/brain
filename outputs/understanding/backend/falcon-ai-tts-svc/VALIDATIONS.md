# falcon-ai-tts-svc — Validations

> Enforced in `Infrastructure/Audio/SynthesisRequestValidator.cs` + handlers. Verified by adversarial re-check 2026-07-09.

| # | Rule | Limit / behavior | Source |
|---|---|---|---|
| V-AITTS-01 | Synthesis text required | empty/whitespace ⇒ 400 "Synthesis text is required." | SynthesisRequestValidator.cs:21-29 |
| V-AITTS-02 | Max synthesis text length | 10,000 chars (`RequestValidation:MaxTextLength`, code default 10_000) ⇒ 400 | SynthesisRequestValidator.cs:26-29,76; appsettings.json:68-70 |
| V-AITTS-03 | Voice must exist for language | unknown voiceId ⇒ 400 "Voice 'x' is not available for language 'y'." Validated against `GroqVoiceCatalog` (12 voices), NOT the ListVoices stub | GroqSynthesisVoicePolicy.cs:43-50 |
| V-AITTS-04 | Format enum strict | only ULAW_8000_MONO / WAV_16000_MONO / MP3 / UNSPECIFIED accepted; bad token ⇒ 400 enum-conversion error | speech.proto:61-66; docs/API.md §7 |
| V-AITTS-05 | Transcribe audio required | neither audioBytes nor audioUrl ⇒ 400 "Transcription audio is required (supply audio_bytes or audio_url)." | SynthesisRequestValidator.cs (transcribe path) |
| V-AITTS-06 | Max transcribe audio | 25 MiB (`Groq:Stt:MaxFileBytes` 26214400) ⇒ 400 | appsettings.json:88 |
| V-AITTS-07 | Concurrency backpressure | > 16 concurrent syntheses ⇒ fail-fast 429 RESOURCE_EXHAUSTED (no queueing); cache hits exempt | SemaphoreConcurrencyLimiter.cs:30; ConcurrencyOptions.cs:20 |
| V-AITTS-08 | Language/voice consistency | voiceId implies language; mismatched explicit language ⇒ V-AITTS-03 400 | GroqSynthesisVoicePolicy.cs |

## FE pre-flight mirror recommendations (Convert-Text wizard)

- Disable Convert until: text non-empty AND voice selected (already `ttsReady()` in the step).
- Client-side max-length counter at 10,000 (business may cap lower — BR gap, see GAP-AITTS-05).
- Derive `language` from the selected voice's `language` field — never let them diverge.
- Treat 429 as "busy — try again shortly", 503 as transient engine outage.

## Adjacent validation contract (saving the record — templates-svc)

Voice-record save is governed by templates-svc `GET /templates/voice-records/validation-config`: name 2–50 chars (trim, tenant-unique case-sensitive), maxFileSizeMB 20, allowedExtensions [.mp3,.wav], allowedMimeTypes [audio/mpeg, audio/wav, audio/x-wav, audio/wave, audio/vnd.wave]. ⚠ WAV_16000 at 32 kB/s ≈ 1.92 MB/min ⇒ a full 10,000-char synthesis (~11 min) ≈ 21 MB **exceeds the 20 MB cap** — MP3 is the safe save format for long texts.
