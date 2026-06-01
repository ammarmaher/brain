---
type: pre-execution-snapshot-inventory
created: 2026-05-27
purpose: "Captures exact pre-plan state so any phase is reversible. Restore via robocopy from this dir → original locations."
---

# Pre-Execution Snapshot Inventory — 2026-05-27

## Sync repo baseline (uncommitted state before plan)

- Repo: `C:\falcon-brain-sync\`
- Working tree: **CLEAN** (no uncommitted changes)
- Last commit: `1f57664 2026-05-24 17:27:27 +0300 docs(brain): Wave G — input-layer digit caps`

## Snapshot contents (this directory)

| Subdir | Files | Size | Restore command |
|---|---:|---:|---|
| `authority-dataset/` | 134 | 6.86 MB | `robocopy authority-dataset 'C:\Falcon\Brain Outputs\datasets\authority-dataset' /MIR` |
| `home-memory/` | 262 | 1.42 MB | `robocopy home-memory 'C:\Users\User\.claude\projects\C--Falcon\memory' /MIR` |
| `universal-brain/` | 12 | 0.08 MB | `robocopy universal-brain 'C:\Falcon\universal-brain' /MIR` |
| `brain-sk-targeted/30-Validation/` | 30 | — | restore selectively |
| `brain-sk-targeted/40-API/` | 23 | — | restore selectively |
| `brain-sk-targeted/67-Business-Rules/` | 3 | — | restore selectively |
| `brain-sk-targeted/_templates/` | 11 | — | restore selectively |
| `falcon-wiki-targeted/00-MOCs/` | 38 | — | restore selectively |
| `falcon-wiki-targeted/100-Authority/` | 32 | — | restore selectively |
| `falcon-wiki-targeted/65-Validation-Rules/` | 1 | — | restore selectively |
| `falcon-wiki-targeted/66-PES-Rules/` | 1 | — | restore selectively |
| `falcon-wiki-targeted/67-Business-Rules/` | 1 | — | restore selectively |
| `falcon-wiki-targeted/80-Questions/` | 0 | — | (empty) |
| `obsidian-configs/` | 4 | <1 KB each | manual restore — see below |

## Obsidian plugin configs captured

| File | Vault | Source path |
|---|---|---|
| `falcon-wiki-community-plugins.json` | falcon-wiki | `C:\Falcon\falcon-wiki\.obsidian\community-plugins.json` |
| `falcon-wiki-core-plugins.json` | falcon-wiki | `C:\Falcon\falcon-wiki\.obsidian\core-plugins.json` |
| `brain-sk-community-plugins.json` | Brain SK | `C:\Falcon\Brain SK\_obsidian\.obsidian\community-plugins.json` |
| `brain-sk-core-plugins.json` | Brain SK | `C:\Falcon\Brain SK\_obsidian\.obsidian\core-plugins.json` |

## What is intentionally NOT snapshotted

| Path | Reason |
|---|---|
| `.smart-env/` (both vaults) | Smart Connections owns this. Embeddings can be regenerated. |
| `.obsidian/plugins/<plugin>/main.js` files | Plugin code can be re-downloaded if needed. Manifests are enough. |
| `.obsidian/plugins/<plugin>/data.json` | Plugin user settings — re-snapshotting after plan if changed |
| `Brain SK\` (full vault — 300 MB · 12,485 files) | Only targeted dirs snapshotted to keep snapshot light |
| `falcon-wiki\` (full vault — 702 MB · 8,204 files) | Same |

## Discoveries during inventory

| Finding | Implication for plan |
|---|---|
| `falcon-wiki\80-Questions\` is EMPTY (0 files) | Q-* tickets actually live in `authority-dataset\_pending-questions\`. Phase 9.5 targets that location only. |
| Brain SK has 30 files in 30-Validation (not 25) | Some files are templates/indexes. The 25 V-rules ≠ all files in the folder. |
| Brain SK has 23 files in 40-API (not 15) | Same — some are templates/indexes. The 15 E-* ≠ all files. |
| Brain SK 67-Business-Rules only has 3 files | BR-* registry is lighter than expected here. BR-* details live primarily in `prd\modules\<n>\BUSINESS_RULES.md`. |
| falcon-wiki 65/66/67 have only 1 file each | These are MATRIX/index files only. Actual rules live elsewhere. |

## Restoration drill (if ANY phase needs to be undone)

To restore a specific store from this snapshot:

```powershell
$SNAP = 'C:\Falcon\universal-brain\snapshots\pre-2026-05-27-improvements'

# Restore authority-dataset entirely
robocopy "$SNAP\authority-dataset" 'C:\Falcon\Brain Outputs\datasets\authority-dataset' /MIR /XJ /R:1 /W:1

# Restore home-memory entirely
robocopy "$SNAP\home-memory" 'C:\Users\User\.claude\projects\C--Falcon\memory' /MIR /XJ /R:1 /W:1

# Restore Brain SK 30-Validation
robocopy "$SNAP\brain-sk-targeted\30-Validation" 'C:\Falcon\Brain SK\_obsidian\30-Validation' /MIR /XJ /R:1 /W:1

# Restore Obsidian community plugin config (falcon-wiki)
Copy-Item "$SNAP\obsidian-configs\falcon-wiki-community-plugins.json" 'C:\Falcon\falcon-wiki\.obsidian\community-plugins.json' -Force
```

## Phase 0 outcome

✅ Sync repo clean baseline confirmed.
✅ All target stores snapshotted with file counts verified.
✅ Obsidian plugin configs captured for rollback.
✅ Restoration commands documented.

**Proceeding to Wave 2 (plugin installations).**
