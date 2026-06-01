---
type: maintenance-contract
created: 2026-05-27
purpose: "Single index of every maintenance contract emitted during the 2026-05-27 Brain Improvement Plan. Future Claudes find this file when asked 'what do I need to keep current'."
companion: BRAIN-IMPROVEMENT-PLAN-2026-05-27.md (the source of these contracts)
---

# Brain Maintenance Contract

> [!info]
> Each row below is a standing rule that emerged from the 2026-05-27 improvement plan. When the corresponding artifact changes, update its dependents per the "When triggered" column.

## Standing contracts

| # | Artifact | When triggered | What to update | Owner |
|---|---|---|---|---|
| 1 | New brain store added (or removed) | Filesystem change | `BRAIN-ARCHITECTURE-CHART.md` § 2-3 · `0-MASTER-INDEX.md` routing tables · `BRAIN-ARCHITECTURE.canvas` · this file | Claude or Ammar |
| 2 | New V-rule authored | New file in `30-Validation/` | Update `V-rules-MOC.md` list · ensure frontmatter matches `FRONTMATTER-SCHEMA-2026-05-27.md` · add to relevant `MATRIX.md` if not auto-pulled by Dataview | Claude |
| 3 | V-rule superseded | `superseded-by:` frontmatter added | Update `MATRIX.legacy-2026-05-27.md` fallback (not auto-tracked by Dataview) only if explicit human curation | Claude |
| 4 | New E-* entity reconciled | New file in `40-API/` | Update `E-entities-MOC.md` · update `E-entities.base` if new columns surface | Claude |
| 5 | New Q-* ticket opened | New file in `_pending-questions/` | Append `## Tasks-plugin tracking` section per Wave 12 convention · ensure frontmatter has `tracked-as-task: true` | Claude |
| 6 | Q-* ticket resolved | `status: RESOLVED` set | Flip Tasks-plugin checkbox to `[x]` · move file to `_pending-questions/_resolved/` (optional housekeeping) | Claude |
| 7 | New BR-* added to PRD | Edit to `prd/modules/*/BUSINESS_RULES.md` | Update `BR-registry.base` if file count changed · update `09-business-rules-by-feature/MATRIX.md` static fallback (Dataview can't introspect inline rules until they become individual notes) | Claude |
| 8 | New tag namespace needed | User suggests a new `#category/` | Update `TAG-TAXONOMY-2026-05-27.md` · run Tag Wrangler in both vaults · update MOC dataview queries that filter by tag | Ammar approves, Claude applies |
| 9 | New frontmatter key needed | Schema gap discovered | Update `FRONTMATTER-SCHEMA-2026-05-27.md` · backfill existing files via subagent like Wave 6 | Claude |
| 10 | New Obsidian plugin installed | User installs plugin | Update `PLUGIN-INSTALL-LOG-2026-05-27.md` · update `community-plugins.json` in target vault · note any data.json side effects | Ammar installs, Claude logs |
| 11 | MEMORY.md grows past 50 KB | Autoload truncation risk | Run Wave 4 compaction again (subagent) · preserve `MEMORY.legacy-<date>.md` | Claude |
| 12 | Restore packet stale (>14 days) | Time-based | Refresh via `/save-session-state` | Claude |
| 13 | New brain device onboarded | New laptop with `C:\falcon-brain-sync` clone | Edit `sync-from-canonical.ps1` `$Pairs[0]` if home path differs · pull · open Claude Code at `C:\Falcon` | Ammar |
| 14 | Sync repo conflict | `git merge` fails on `.md` | Manually merge — robocopy never merges, only mirrors | Ammar |
| 15 | New brain skill or slash command added | New file in `.claude/commands/` | Update `/brain-help` listing · document in `BRAIN-ARCHITECTURE-CHART.md` § 4.3 | Claude |
| 16 | New MOC created in `00-MOCs/` | User asks "give me a curated landing for X" | Add to `Architecture-MOC.md` or relevant parent MOC · ensure `type: moc` + `scope:` in frontmatter | Claude |
| 17 | Bases registry adoption decision | User wants `.base` for new collection | Create `.base` file + sibling `.base.README.md` · pattern in Wave 8 | Claude |
| 18 | Folder icon convention extended | User adds icons via UI | Update `OBSIDIAN-ICON-MAPPING-2026-05-27.md` to reflect chosen icons | Ammar updates UI, Claude documents |

## How to run the source-prefix lint

```powershell
# Scan default outputs (universal-brain state)
C:\Falcon\universal-brain\hooks\check-source-prefix.ps1

# Scan a specific file
C:\Falcon\universal-brain\hooks\check-source-prefix.ps1 -Path 'C:\Falcon\path\to\file.md'

# Scan whatever's in clipboard (e.g. paste a Claude response)
C:\Falcon\universal-brain\hooks\check-source-prefix.ps1 -RecentClaude
```

## Files this contract references (manifest)

| Document | Purpose | Last updated |
|---|---|---|
| `BRAIN-ARCHITECTURE-CHART.md` | Full visual+tabular brain map | 2026-05-27 |
| `BRAIN-ARCHITECTURE.canvas` | Obsidian Canvas twin of the chart | 2026-05-27 |
| `0-MASTER-INDEX.md` | Routing — which store owns which question | 2026-05-27 |
| `VERIFICATION-STATUS.md` | Honest accounting per claim | 2026-05-16 |
| `BRAIN-IMPROVEMENT-PLAN-2026-05-27.md` | Original 11-phase plan | 2026-05-27 |
| `BRAIN-IMPROVEMENT-PLAN-2026-05-27-SUPPLEMENT-A-plugins.md` | Plugin-aware additions | 2026-05-27 |
| `FRONTMATTER-SCHEMA-2026-05-27.md` | Canonical frontmatter spec | 2026-05-27 |
| `TAG-TAXONOMY-2026-05-27.md` | Canonical tag namespaces | 2026-05-27 |
| `OBSIDIAN-ICON-MAPPING-2026-05-27.md` | Folder icon recommendations | 2026-05-27 |
| `PLUGIN-INSTALL-LOG-2026-05-27.md` | Plugin install audit trail | 2026-05-27 |
| `FRONTMATTER-BACKFILL-LOG-2026-05-27.md` | Per-file backfill log (Wave 6) | 2026-05-27 |
| `MEMORY.legacy-2026-05-27.md` | Pre-compaction MEMORY backup | 2026-05-27 |
| `snapshots/pre-2026-05-27-improvements/` | Full Phase 0 snapshot | 2026-05-27 |
| `hooks/check-source-prefix.ps1` | Source-prefix lint | 2026-05-27 |
| `00-MOCs/V-rules-MOC.md` · `E-entities-MOC.md` · `Q-tickets-MOC.md` · `Components-MOC.md` · `Architecture-MOC.md` · `Tasks-MOC.md` | 6 MOCs | 2026-05-27 |
| `_templates/Q-ticket.md` · `BR-rule.md` · `topic-memory.md` · `daily-note.md` | 4 new Templater scaffolds | 2026-05-27 |
| `30-Validation/V-rules.base` · `40-API/E-entities.base` · `_pending-questions/Q-tickets.base` · `prd/modules/BR-registry.base` | 4 Bases registries | 2026-05-27 |
| `*-2026-05-27.md` `MATRIX.legacy-*` (6 files) | Static fallbacks for the 6 live Dataview MATRIXes | 2026-05-27 |

## Rollback master list

```powershell
# Full brain rollback to pre-2026-05-27 state:
$SNAP = 'C:\Falcon\universal-brain\snapshots\pre-2026-05-27-improvements'
robocopy "$SNAP\authority-dataset" 'C:\Falcon\Brain Outputs\datasets\authority-dataset' /MIR /XJ
robocopy "$SNAP\home-memory" 'C:\Users\User\.claude\projects\C--Falcon\memory' /MIR /XJ
robocopy "$SNAP\brain-sk-targeted\30-Validation" 'C:\Falcon\Brain SK\_obsidian\30-Validation' /MIR /XJ
robocopy "$SNAP\brain-sk-targeted\40-API" 'C:\Falcon\Brain SK\_obsidian\40-API' /MIR /XJ
robocopy "$SNAP\falcon-wiki-targeted\00-MOCs" 'C:\Falcon\falcon-wiki\00-MOCs' /MIR /XJ
Copy-Item "$SNAP\obsidian-configs\falcon-wiki-community-plugins.json" 'C:\Falcon\falcon-wiki\.obsidian\community-plugins.json' -Force
Copy-Item "$SNAP\obsidian-configs\brain-sk-community-plugins.json" 'C:\Falcon\Brain SK\_obsidian\.obsidian\community-plugins.json' -Force
```
