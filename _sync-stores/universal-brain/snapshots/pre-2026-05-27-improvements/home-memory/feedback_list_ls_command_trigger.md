---
name: list / ls / LS triggers print the Falcon Brain commands panel
description: When the user types "list", "ls", "LS", or any case variant as a standalone message, agent must run preview-commands-banner.ps1 and show the available-commands panel
type: feedback
originSessionId: a26d80da-eafa-4a52-af73-9f7abc7d3f70
---
When the user types `list`, `ls`, `LS`, `List`, etc. as a standalone or near-standalone message inside a Falcon session, treat it as a request to display the Brain's available-commands panel.

**Why:** User asked (2026-05-03) for a quick mid-session way to remind themselves which slash commands exist without having to remember each one or re-print the full Brain banner.

**How to apply:**
- Both slash commands and natural typed words should work:
  - `/list` (slash command file: `C:\Users\Pc5\.claude\commands\list.md`)
  - `/ls`   (slash command file: `C:\Users\Pc5\.claude\commands\ls.md`)
  - bare `list` (no slash) — agent recognizes intent and runs the same script
  - bare `ls` (no slash) — agent recognizes intent and runs the same script
  - case-insensitive (`LS`, `List`, etc. all work)
- All four cases run the same command via Bash:
  ```
  powershell -NoProfile -ExecutionPolicy Bypass -File "C:/falcon/Brain/scripts/preview-commands-banner.ps1"
  ```
- After the command runs, the agent must not add narration, summary, or follow-up text. The panel itself is the entire response.

**Caveat — natural typed words:**
- Only trigger on `list` / `ls` when the message is JUST that word (or "list commands", "show commands", "show ls"). If the user types `list these files` or `ls -la /tmp`, do not interpret it as the Brain command — that's a normal Bash request.
- When ambiguous, ask the user.

**Related files:**
- `C:\falcon\Brain\scripts\preview-commands-banner.ps1` — the panel renderer (UTF-8 BOM)
- `C:\Users\Pc5\.claude\commands\list.md` — `/list` slash command
- `C:\Users\Pc5\.claude\commands\ls.md` — `/ls` slash command
