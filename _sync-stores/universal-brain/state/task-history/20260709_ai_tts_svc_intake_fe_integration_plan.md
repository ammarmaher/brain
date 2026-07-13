# Task history — ai-tts-svc intake + FE Convert-Text integration plan

- **Date:** 2026-07-09 · **Status:** COMPLETED (read-only investigation + plan; no code changed, nothing committed)
- **Request:** clone falcon-ai-tts-svc into C:\Falcon, deep-understand it (docs/API.md + docs/DEPLOY.md), orchestrate senior FE/BE/full-stack agents, plan the FE Voice Service "Convert Text" integration, persist knowledge to Brain SK/Obsidian, present plan as charts.

## What was done
1. Cloned repo → `C:\Falcon\falcon-ai-tts-svc` (main @ da26242); read API.md (QA-verified contract), DEPLOY.md (P8), speech.proto, appsettings.json.
2. Workflow wf_4182aeeb — 5 senior specialists in parallel (TTS backend · FE wizard · templates-svc voice records · both gateways · brain/PRD). ~544k tokens, 228 tool uses.
3. Workflow wf_36a80799 — 7 adversarial verifiers on the load-bearing claims: **7/7 CONFIRMED, zero refutations**.
4. Knowledge shipped: 6-file dossier `Brain Outputs\understanding\backend\falcon-ai-tts-svc\` + Obsidian `Brain SK\_obsidian\45-Backend\AI TTS Service.md`.
5. Plan: `C:\Falcon\plans\ai-tts-fe-integration-plan-2026-07-09.md` + charts artifact `https://claude.ai/code/artifact/e0c1bf76-5bcd-4b68-ba0e-81cfd4bdaf94`.
6. Memory: `project_ai_tts_svc_intake_fe_integration_plan_2026_07_09.md` + MEMORY.md index line.

## Headline findings
- Both gateways route `/ai-tts/*` ON MAIN (core=ClientOnly+PerTenant PR 43230; system=FalconOnly PR 43246); DEPLOY.md "east-west only" is stale.
- FE Convert-Text panel built-but-stubbed in both consoles (fake voices; onConvert toast; sourceReady excludes TTS).
- templates-svc rejects source=2; `from-tts` endpoint (Chunk 1C) unbuilt — persistence bridge is THE blocker (+ B-0 one-line interim unblock).
- Local compose lacks ai-tts; port 5210 collision with comm-realtime; no falcon-aitts-dev bucket.
- ListVoices stub 2 voices vs 12 accepted by synthesize.
- Save format ruling: MP3 (10k-char WAV ≈ 21 MB > 20 MB record cap; duration probed server-side).

## Pending on Ammar
Decisions D-1…D-7 (plan §4): persistence bridge, format, ports, voice catalog, admin scope, business text cap, preview gate.
