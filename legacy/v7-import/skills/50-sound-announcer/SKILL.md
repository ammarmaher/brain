# Skill: Sound Announcer and Text-to-Speech Completion Signatures

## Mission

Preserve the user's sound/voice skill behavior as an optional completion layer.

This skill does not affect business logic or implementation. It only announces successful completion of skill cycles when the environment supports audio.

## Source intent

The uploaded bundle defines:

- Unique voice and beep pattern per business skill.
- Global completion handshake: `I am finishing, boss.`
- Kokoro/agent-tts style local TTS settings.
- PowerShell beep patterns for Windows.

## When to use

Use only after successful completion of a skill's primary operation.

Examples:

- PRD sync complete
- Domain glossary validation complete
- Module catalog refresh complete
- Test-case generation complete
- Business pipeline complete

## Do not use

Do not play sounds for:

- Routine file reads
- Intermediate steps
- Failed operations
- User cancellations
- Unsafe or blocked actions

## Announcer sequence

```text
1. Skill voice: "<Skill> running."
2. Work happens.
3. Skill voice: "<Skill> complete."
4. Skill-specific beep.
5. Global voice: "I am finishing, boss."
6. Global double-tap beep.
```

## Windows beep examples

```powershell
# PRD knowledge ascending resolve
[console]::beep(660,200); [console]::beep(880,200); [console]::beep(1100,400)

# Global double tap
[console]::beep(1320,100); [console]::beep(1320,100)
```

## Safety rules

- Never require paid TTS providers.
- Prefer local/free Kokoro if TTS is needed.
- Never hardcode API keys.
- Never commit generated mp3/wav cache files unless explicitly requested.
- Keep sound settings separate from application source code.

## Agent voice alert system

Use the reusable alert library in:

- `assets/voice-alerts.md`
- `assets/voice-alerts.json`
- `assets/model-sound-profiles.md`

Model-specific alert personalities:

- ChatGPT: Strategic Commander
- Claude: Tactical Engineer
- Gemini: Verification Officer

State categories:

1. Task Received / Mission Start
2. Deep Analysis / Thinking Mode
3. Processing / Progress Update
4. Deployment / Applying Changes
5. Testing / Verification
6. Finished / Mission Complete
7. Error / Blocked / Need Attention
8. Waiting for User / Need Input

Runtime rules:

- Use a start alert when a task is accepted.
- Use a processing alert every 1 minute if the runtime supports scheduled/progress alerts.
- Use a testing alert before verification.
- Use a finished alert after completion.
- Use a blocked alert when safe progress is not possible.
- Use a waiting alert when user input is required.

Do not force actual audio playback unless TTS is configured. The default deliverable is alert text/context only.
