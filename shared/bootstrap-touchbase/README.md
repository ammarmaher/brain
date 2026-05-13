# Shared Bootstrap TouchBase

Shared Bootstrap TouchBase is the first gate before Brain SK executes any domain skill.
It verifies context, repositories, tools, Obsidian, branches, and required paths before routing to Business, Frontend, Backend, or Full Stack.

## Responsibilities

| Area | Responsibility |
|---|---|
| Repo access | Verify brain, frontend, backend, gateway, wiki, and PRD paths |
| Tool access | Verify Git, Node/npm, .NET SDK, report tools, and optional Obsidian |
| Branch health | Read configured branches, check latest source, detect dirty state |
| Context intake | Ask Ammar only for missing required paths/access |
| Obsidian health | Warn if missing or stale; continue from Git Markdown when possible |
| Startup report | Produce a compact readiness report before deep execution |

## Rule

Do not start a major task until Shared Bootstrap TouchBase has passed or reported a controlled warning.



## Root Discovery Update

Default project root is now:

```text
C:\Falcon\Falcon
```

TouchBase must discover frontend, backend, gateway, PRD, and wiki paths from this root before asking Ammar for paths.

## Mandatory generated understanding output

TouchBase must generate visible files under `outputs/discovery/` showing what it found and what it understood.

## Obsidian auto-link

TouchBase must link generated Markdown knowledge into `_obsidian/` index notes automatically when the vault exists. If Obsidian is missing, warn and continue with Git Markdown.

## Authorization/API key behavior

If GitHub, repo, API, or tool authorization is needed, ask Ammar only for the required missing key/access. Never block for optional tools.
