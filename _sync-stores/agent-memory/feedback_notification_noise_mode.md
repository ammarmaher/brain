---
name: notification-noise-mode-preference
description: "User wants audible beep/ring alerts on task-finish + needs-input; never mute. Toggle = mode.json (voice|silent|mute); note \"silent\" confusingly means beeps-only."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 631671ab-69ac-40b8-b6d3-c6d90a187680
---

Keep the Falcon voice-hook notification system AUDIBLE — the user wants a beep/ring when a task finishes and when Claude needs their input. Never leave it on `mute`.

**Why:** User explicitly asked on 2026-05-28 to "activate noise mode... not the mute. Make it ringing." They want a clear audible signal for take-action and task-finish events.

**How to apply:** The switch is `C:\Falcon\Brain SK\tools\notifications\mode.json` → `mode` field, with three values:
- `voice` = spoken MP3 phrases via `play-alert-context.ps1` (needs pre-recorded clips on disk + Kokoro TTS server at localhost:8880).
- `silent` = CONFUSINGLY named, actually = beeps-only via `[console]::beep` in `voice-hook.ps1`. **This is the "noise mode" the user wants.**
- `mute` = nothing.

Set to `silent` on 2026-05-28 because `voice` was non-functional: the `claude` mindset (the one the hooks use) has NO pre-recorded MP3 clips on disk and the Kokoro server is down — so voice mode produces silence. Beep patterns were also enhanced to ring more clearly (finished = rising 3-tone chime; waitingForInput = 3× phone-style double-ring; blocked = 2× alarm).

The hooks are already wired in global `C:\Users\User\.claude\settings.json`: `Stop`→finished, `Notification`→waitingForInput, `PostToolUse`(error)→blocked, `UserPromptSubmit`→taskReceived. No settings.json change is needed to toggle sound — only `mode.json`. To restore spoken voice later: start Kokoro, regenerate the `claude` MP3 clips, then set `mode=voice`.
