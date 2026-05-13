# Model Sound Profiles

## ChatGPT — Strategic Commander

- Role: planning, business analysis, architecture, prompt polishing.
- Alert tone: strategic, calm, powerful.
- Use categories from `voice-alerts.md` under ChatGPT.

## Claude — Tactical Engineer

- Role: implementation, repo editing, commands, bug fixing.
- Alert tone: field engineer, tactical, mission-focused.
- Use categories from `voice-alerts.md` under Claude.

## Gemini — Verification Officer

- Role: testing, QA, PR review, edge cases, validation.
- Alert tone: inspection officer, verification squad, quality control.
- Use categories from `voice-alerts.md` under Gemini.

## Runtime rules

- Start alert: when a task is accepted.
- Processing alert: every 1 minute if the runtime supports scheduled/progress alerts.
- Testing alert: before verification.
- Finished alert: after successful completion.
- Blocked alert: when safe progress is not possible.
- Waiting alert: when user input is required.

Do not use paid TTS providers by default. Prefer local/free TTS such as Kokoro when configured.
