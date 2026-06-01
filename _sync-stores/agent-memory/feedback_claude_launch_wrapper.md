---
name: PowerShell `claude` wrapper prints Brain banner before launch
description: User-level $PROFILE defines a `claude` function that runs show-banner.ps1, then invokes claude.cmd — guarantees the Brain banner is visible on every launch
type: feedback
originSessionId: a26d80da-eafa-4a52-af73-9f7abc7d3f70
---
Every time the user types `claude` in PowerShell, the Brain banner prints to the terminal BEFORE Claude Code starts.

**Why:** Claude Code's `SessionStart` hook captures stdout into Claude's context but doesn't display it on the user's visible terminal. To make the banner user-visible, the launch must be wrapped at the shell level.

**How to apply:**
- Wrapper lives in `C:\Users\Pc5\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` (the user's PowerShell `$PROFILE`).
- Defines `function claude { ... }` that:
  1. Runs `C:\falcon\Brain\scripts\show-banner.ps1` (prints the Brain identity + System Integrity Check banners with green/red ▣)
  2. Then calls `C:\Users\Pc5\AppData\Roaming\npm\claude.cmd @args` to start Claude Code
- File saved with UTF-8 BOM so Windows PowerShell parses Unicode glyphs correctly.

**Brain is engaged for every session:**
- The SessionStart hook in `~/.claude/settings.json` (entry 0) ALSO runs show-banner.ps1, so the banner content is injected into Claude's context as a system message — Claude knows the Brain is active without needing a trigger phrase.
- Combined: user sees the banner in their terminal (via $PROFILE wrapper); Claude sees it in context (via SessionStart hook). Brain mode is the default operating state from the first message.

**Files involved:**
- `C:\Users\Pc5\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` — the wrapper
- `C:\falcon\Brain\scripts\show-banner.ps1` — the banner renderer (UTF-8 BOM)
- `C:\Users\Pc5\.claude\settings.json` — SessionStart hook (entry 0) — Claude-context copy
- `C:\Users\Pc5\AppData\Roaming\npm\claude.cmd` — real Claude Code binary

**Caveat:** wrapper only fires when launching from PowerShell. If launched from cmd.exe or another shell, only the SessionStart hook fires (banner only in Claude's context, not visible on screen).

**To disable:** comment out the `claude` function in `$PROFILE`, or rename it.
**To update banner:** edit `show-banner.ps1` directly; profile auto-picks up changes on next launch.
