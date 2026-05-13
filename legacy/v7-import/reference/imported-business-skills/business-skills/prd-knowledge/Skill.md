*** Skill: prd-knowledge ***
*** Sync, version, and diff PRDs from Google Drive into normalized markdown ***

# prd-knowledge

## Purpose

Single source of truth for product requirements. Pulls PRDs from the Falcon Drive folder, normalizes to markdown, versions per module, and reports what changed since the last sync.

## Triggers

- `take latest from PRD`
- `update PRD knowledge`
- Any business-analysis task that requires current PRD content
- Any "what does the spec say?" question

## Source of truth

Google Drive folder: `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`

If Drive is inaccessible: STOP, report missing access, do not guess.

## Owns

- Sync workflow (manual drop MVP → Drive API later)
- Per-module versioning + diff reports
- Source map: Drive file → local file
- Asset handling (images, Excel, Word, diagrams)

## Folder layout

```
prd-knowledge/
  Skill.md
  UPDATES.md                    <- append-only global sync log
  resources/
    sync-protocol.md
    drive-folder-rules.md
    versioning-rules.md
    attachment-rules.md
  incoming/                     <- drop zone for Drive zip exports
  modules/
    <module-slug>/
      latest-prd.md             <- normalized markdown (auto-generated)
      changelog.md              <- per-module sync history
      source-map.json           <- {drive_file_id, last_sync, hash}
      assets/{images,excel,word,diagrams}/
```

## Hard rules

1. Never edit `latest-prd.md` by hand — only via sync
2. Every sync appended to `UPDATES.md` (never rewrite history)
3. Every module gets a `changelog.md` entry on each sync
4. If Drive is inaccessible — STOP and report
5. Validate every term against `domain-glossary` before normalizing
6. **Asset OVERWRITE rule** — every sync ALWAYS overwrites `modules/<slug>/assets/**`. No versioning, no rename, no skip-if-exists. See [`resources/attachment-rules.md`](./resources/attachment-rules.md) and [`resources/knowledge-sync-rules.md`](./resources/knowledge-sync-rules.md).
7. **`v<number>` selection rule** — when multiple PRDs exist for a module, pick highest numeric `v` (e.g. `v10` > `v2`, NOT text comparison). See [`resources/versioning-rules.md`](./resources/versioning-rules.md).
8. Apply migrated module slug rules: lowercase kebab-case, two-digit numeric prefix, expand abbreviations (`Mngmnt → management`).

## Commands

| # | Command | Aliases | What it does |
|---|---|---|---|
| 1 | `take latest from PRD` | `update PRD knowledge` | Full sync: scan Drive → pick latest per `v<number>` → rewrite `README.md`, `latest-prd.md`, `understanding.md`, `attachments.md`, `source-map.json` → download every Drive file with OVERWRITE |
| 2 | `update PRD knowledge` | alias of #1 | Same as #1 |
| 3 | `list command` | `list commands`, `list instructions`, `list prd commands`, `list prd instructions` | Print the command reference table from [INSTRUCTIONS.md](../../settings/sound/INSTRUCTIONS.md) — read-only, no Drive access |

Commands #4 and #5 (test case generation) live in [`test-case-authoring`](../test-case-authoring/Skill.md).

## Restrictions (do NOT do during a sync)

- Do not edit Angular application files
- Do not edit backend application files
- Do not install packages
- Do not run migrations
- Do not refactor source code
- Do not change Nx workspace structure
- Do not change Module Federation config
- Do not change PrimeNG / Tailwind setup
- Only knowledge files inside `prd-knowledge/modules/**` and this skill's docs may be updated

## Sync output (required format)

```
PRD sync complete (YYYY-MM-DD HH:MM)
+ Added:     N modules (...)
✓ Updated:   N modules (... old→new)
= Unchanged: N modules
⚠ Conflicts: N
Skills refreshed: prd-knowledge, module-catalog
```

## Status Announcer (voice + sound)

Source of truth: [`settings/sound/settings.json`](../../settings/sound/settings.json) → `skills.prd-knowledge`.

| Phase | Voice | Phrase | Beep |
|---|---|---|---|
| Activation | `bm_george` | "PRD knowledge running." | — |
| Working (long ops) | `bm_george` | "PRD knowledge working." | — |
| Completion | `bm_george` | "PRD knowledge complete." | ascending → resolve `[660,200; 880,200; 1100,400]` |
| **Global handshake** | `bm_george` | **"I am finishing, boss."** | double-tap `[1320,100; 1320,100]` |

**Reading the response aloud:** When agent-tts is running, every assistant turn under this skill is spoken via Kokoro at the configured voice and 8× volume.

**Final sequence per cycle:**
1. "PRD knowledge running." → work → "PRD knowledge complete."
2. Per-skill beep (ascending → resolve)
3. "I am finishing, boss." (always `bm_george`)
4. Global double-tap beep

Play ONLY after a successful sync. Never on errors or partial output.

## See also

- [resources/sync-protocol.md](./resources/sync-protocol.md)
- [resources/drive-folder-rules.md](./resources/drive-folder-rules.md)
- [resources/versioning-rules.md](./resources/versioning-rules.md)
- [resources/attachment-rules.md](./resources/attachment-rules.md)
