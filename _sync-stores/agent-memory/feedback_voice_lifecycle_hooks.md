---
name: Voice lifecycle hooks (Claude Code → Brain voices)
description: Every Claude Code lifecycle event must trigger the corresponding Brain voice category via settings.json hooks
type: feedback
originSessionId: f1afca13-882b-4599-8532-38124ed50b1c
---
Every instruction lifecycle event must play a Brain voice. The user explicitly required this on 2026-05-01.

**Why:** The user built distinct voices per mindset and per category in `C:\falcon\Brain\settings\sound\voice-samples\alerts\`. Bare console beeps are not acceptable — the actual MP3 voices must play.

**How to apply:** Lifecycle hooks are wired in `C:\Users\Pc5\.claude\settings.json` and route through `C:\falcon\Brain\scripts\voice-hook.ps1` (fire-and-forget detached spawn).

| Event | Claude Code hook | Voice category |
|---|---|---|
| Get instruction | `UserPromptSubmit` | `taskReceived` |
| Pending instruction | `Notification` | `waitingForInput` |
| Error instruction | `PostToolUse` (matcher `.*`, `-OnlyOnError`) | `blocked` |
| Finish instruction | `Stop` | `finished` |

`voice-hook.ps1` requirements:
- Must spawn `play-alert-context.ps1` via `Start-Process` so the hook returns immediately (Claude Code timeouts hooks; blocking would lag every response)
- `-OnlyOnError` parses stdin JSON and gates on `tool_response.is_error`, `tool_response.error`, `tool_response.success == false`, or top-level `error`
- Mindset defaults to `claude` for Claude Code sessions; pass `-Mindset chatgpt|gemini` only when running inside that mindset's loop

**Do not** replace the voice hooks with bare `[console]::beep` or text alerts — the user has explicitly tested for the MP3 voice and will notice the regression.
