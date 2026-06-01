---
type: plugin-install-log
created: 2026-05-27
phase: Wave 2 (Plugin installations for cross-vault parity)
authority: User explicit instruction in autopilot directive — "install it from your end, please. Always take the recommended."
---

# Plugin Install Log — 2026-05-27 Wave 2

## Pre-install state

### falcon-wiki (6 community plugins)
- dataview, templater-obsidian, breadcrumbs, tag-wrangler, various-complements, smart-connections

### Brain SK (10 community plugins)
- dataview, templater-obsidian, obsidian-tasks-plugin, obsidian-style-settings, obsidian-icon-folder, recent-files-obsidian, realclaudian, smart-connections, smart-connections-visualizer, smart-lookup

## Plugins installed (cross-vault parity)

| Plugin | Source vault | Destination vault | Action |
|---|---|---|---|
| realclaudian (Claudian v2.0.18) | Brain SK | falcon-wiki | Copy folder + enable |
| obsidian-tasks-plugin v8.0.0 | Brain SK | falcon-wiki | Copy folder + enable |
| breadcrumbs v4.9.5 | falcon-wiki | Brain SK | Copy folder + enable |
| tag-wrangler v0.6.4 | falcon-wiki | Brain SK | Copy folder + enable |

## How install was performed

1. `Copy-Item` plugin folder from source vault's `.obsidian/plugins/<id>/` to destination vault's `.obsidian/plugins/<id>/`.
2. Edited `community-plugins.json` in each destination vault to APPEND the new plugin IDs to the enabled list.
3. Preserved all existing plugin entries verbatim.

## Post-install state

### falcon-wiki (now 8 community plugins)
- dataview, templater-obsidian, breadcrumbs, tag-wrangler, various-complements, smart-connections, **realclaudian**, **obsidian-tasks-plugin**

### Brain SK (now 12 community plugins)
- dataview, templater-obsidian, obsidian-tasks-plugin, obsidian-style-settings, obsidian-icon-folder, recent-files-obsidian, realclaudian, smart-connections, smart-connections-visualizer, smart-lookup, **breadcrumbs**, **tag-wrangler**

## Notes for next Obsidian launch (USER)

When you next open either vault in Obsidian:
- Obsidian may show a notice "New plugins detected" — accept.
- Plugins should auto-activate from the enabled list.
- **If a plugin shows as disabled:** open Settings → Community plugins → toggle it on.
- **Plugin settings (data.json) NOT copied** — each plugin starts with default settings in the new vault. You configure to taste.

## Governance note

Brain SK CLAUDE.md rule: *"no edits to `_obsidian/.obsidian/`, Copilot `data.json`, `workspace.json`, plugin config, or any secret file"*.

Override authority: user explicit autopilot directive of 2026-05-27 — *"install it from your end, please. Always take the recommended."* + answer "2-yes" to mandatory plugin installs.

What was edited:
- `community-plugins.json` (BOTH vaults) — appended entries only; preserved all existing entries.

What was NOT edited:
- Any plugin's `data.json` (user settings preserved)
- `workspace.json` (UI state preserved)
- `core-plugins.json` (Obsidian core toggles preserved)
- `.smart-env/` (Smart Connections embeddings preserved)
- Any plugin secrets

## Rollback

```powershell
# Remove the 4 plugin folders
Remove-Item -Recurse -Force 'C:\Falcon\falcon-wiki\.obsidian\plugins\realclaudian'
Remove-Item -Recurse -Force 'C:\Falcon\falcon-wiki\.obsidian\plugins\obsidian-tasks-plugin'
Remove-Item -Recurse -Force 'C:\Falcon\Brain SK\_obsidian\.obsidian\plugins\breadcrumbs'
Remove-Item -Recurse -Force 'C:\Falcon\Brain SK\_obsidian\.obsidian\plugins\tag-wrangler'

# Restore community-plugins.json from snapshot
$SNAP = 'C:\Falcon\universal-brain\snapshots\pre-2026-05-27-improvements\obsidian-configs'
Copy-Item "$SNAP\falcon-wiki-community-plugins.json" 'C:\Falcon\falcon-wiki\.obsidian\community-plugins.json' -Force
Copy-Item "$SNAP\brain-sk-community-plugins.json" 'C:\Falcon\Brain SK\_obsidian\.obsidian\community-plugins.json' -Force
```
