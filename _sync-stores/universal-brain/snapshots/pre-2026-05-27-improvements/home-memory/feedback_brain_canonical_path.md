---
name: feedback_brain_canonical_path
description: Falcon Brain canonical root is now C:\Falcon\Brain SK\ (NOT C:\falcon\Brain — that path no longer exists). Voice notification scripts live at C:\Falcon\Brain SK\tools\notifications\.
type: feedback
originSessionId: a83a27a8-4864-4a73-8a44-f1e20afeb339
---
**The Falcon Brain canonical root is `C:\Falcon\Brain SK\`.**

Earlier guidance pointing at `C:\falcon\Brain\` is **stale** — that folder no longer exists on disk. Content was migrated into `C:\Falcon\Brain SK\` (per `Brain SK\CLAUDE.md`).

**Why:** Verified 2026-05-14 while fixing the broken voice notification hooks. The user-level `C:\Users\User\.claude\settings.json` was still calling `C:/falcon/Brain/scripts/voice-hook.ps1` — that path is gone. The canonical voice-hook is now at `C:\Falcon\Brain SK\tools\notifications\voice-hook.ps1` and its companion `play-alert-context.ps1` was newly created next to it (portable: derives `AlertsRoot` / `ClaimsJson` from `$PSScriptRoot`).

**Canonical paths (verified 2026-05-14):**
- Voice hook entry: `C:\Falcon\Brain SK\tools\notifications\voice-hook.ps1`
- Picker: `C:\Falcon\Brain SK\tools\notifications\play-alert-context.ps1`
- MP3 alerts: `C:\Falcon\Brain SK\tools\notifications\sound\voice-samples\alerts\<mindset>\<category>\<01-10>.mp3`
- Claims sidecar: `C:\Falcon\Brain SK\tools\notifications\assets\voice-alerts-claims.json`
- Voice phrase text: `C:\Falcon\Brain SK\tools\notifications\assets\voice-alerts.json`

**How to apply:**
1. Any hook / script / doc still referencing `C:\falcon\Brain\scripts\*` or `C:\falcon\Brain\assets\*` is broken — repoint to `C:\Falcon\Brain SK\tools\notifications\*` (or wherever the migrated content lives under `Brain SK\`).
2. `C:\Falcon\.claude\CLAUDE.md` and `C:\Falcon\CLAUDE.md` still reference the old path in places — they have not been updated. Verify before quoting.
3. The `show-banner.ps1` referenced by the SessionStart hook in `C:\Users\User\.claude\settings.json` is also stale (points at `C:/falcon/Brain/scripts/show-banner.ps1`); needs the same repointing — only a legacy v7 copy survives at `Brain SK\legacy\v7-import\scripts\show-banner.ps1`.
4. The universal session-state Brain at `C:\Falcon\universal-brain\` (project-agnostic) is a SEPARATE concept — do not conflate.
