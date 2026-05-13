# Obsidian Auto-Link Protocol

Obsidian is the human-readable knowledge interface for Brain SK.
The Git Markdown files are still the source of truth, but Obsidian should automatically open/link the same folder when possible.

## Default behavior

1. Use the Brain SK repository folder as the Obsidian vault when possible.
2. If the vault exists, write/update Obsidian-friendly Markdown notes inside the same repo.
3. Add backlinks between major outputs.
4. Generate an Obsidian index note.
5. If Obsidian is not installed or not available, warn Ammar but continue with Git Markdown.

## Required Obsidian files

Generate or update:

```text
_obsidian/BRAIN_SK_HOME.md
_obsidian/PROJECT_INDEX.md
_obsidian/BUSINESS_INDEX.md
_obsidian/BACKEND_INDEX.md
_obsidian/FRONTEND_INDEX.md
_obsidian/WIKI_INDEX.md
_obsidian/TASK_REPORT_INDEX.md
```

## Auto-link rules

Use Obsidian wiki links where helpful:

```text
[[BUSINESS_RULES_SUMMARY]]
[[API_DTO_DICTIONARY]]
[[FALCON_COMPONENT_REGISTRY]]
[[ARCHITECTURE_RULES]]
[[TASK_REPORT_INDEX]]
```

## Vault detection

TouchBase should check:

- configured `obsidianVaultPath`
- whether that folder exists
- whether it contains `.obsidian/`
- whether it points to or contains Brain SK Markdown files

## If Obsidian is missing

Do not block the task. Generate:

```text
outputs/discovery/obsidian-health.md
```

and include:

- Obsidian status
- expected vault path
- how to open the brain repo as an Obsidian vault
- whether Git Markdown output still succeeded

## Automatic linking requirement

After every scan/report update, update the relevant index note so Ammar can open Obsidian and navigate by domain:

- Business
- Frontend
- Backend
- Full Stack
- Architecture Wiki
- Reports
- Gaps
- Decisions
