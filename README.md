# Brain SK v0.1

Brain SK is a delivery-focused AI coding brain for Falcon projects. It is designed to understand PRDs, backend APIs, architecture wiki rules, Falcon UI components, screenshots/HTML/React designs, validations, PES/permissions, and task progress reporting.

## Core principle

Ammar speaks normally. Brain SK detects the role, task type, source of truth, branch context, skill chain, required scans, implementation workflow, quality gates, reports, and Git sync.

## Default brain repository

```text
https://github.com/ammarmaher/brain
```

Brain artifacts are auto-committed and auto-pushed to this repo after bootstrap, scans, reports, registry updates, Obsidian notes, skill updates, protocol updates, PRD analysis, API understanding, and scan metadata changes.

## Main engines

| Engine | Responsibility |
|---|---|
| Smart Intent Router | Understand Ammar's natural command and route to skills |
| Initial Bootstrap Discovery | First-time parallel scan of PRDs, backend, components, wiki, and repos |
| Business Understanding | Actors, flows, rules, statuses, validations, gaps, assumptions, tests |
| Backend/API Understanding | Controllers, gateway, DTOs, validators, endpoint maps, FE contracts |
| Falcon Component Engine | Scan, document, reuse, and upgrade Falcon custom components |
| UI Conversion Engine | Convert HTML/React/screenshots into Falcon Angular |
| Frontend Governance | Enforce feature folders, models, services, DTO placement, directives |
| Visual Parity Loop | Compare source screenshot vs Angular screenshot and repair mismatches |
| Reporting Engine | Produce compact chart/table-heavy task and API reports |
| Git Auto-Sync | Commit and push brain artifacts and normal implementation work after gates |

## Install/use

1. Put this folder in Git or clone the default brain repo.
2. Open the same folder as an Obsidian vault if desired.
3. Copy/merge `CLAUDE.md` into the project root Claude context.
4. Run the first command:

```text
Initialize Brain SK. Run full bootstrap discovery. Scan PRDs, backend, gateway, Falcon components, architecture wiki, and generate all registries/reports. Auto-push brain artifacts to GitHub.
```


## v8 merged legacy skills update

This package preserves the earlier Falcon Brain Genius v7 skill system. Legacy Angular, Tailwind, RAGE conversion, business, brand/model orchestration, Gemini QA, sound notification, and PDF/report-related skill assets are available under:

```text
skills/legacy-v7/
skills/brand/
skills/imported-business/
legacy/v7-import/
tools/notifications/
reference/legacy-blueprints/
```

Use `LEGACY_SKILL_MIGRATION_MAP.md` to find migrated skills. Use v8 governance first, then legacy specialists for detailed execution behavior.


## Added in TouchBase Final Pack

- Shared Bootstrap TouchBase health/context intake.
- Four-domain routing: Business, Frontend, Backend, Full Stack.
- Claude commands for initialization, conversion, backend linking, and reporting.
- Installation and copy/paste guides.


## Brain SK v0.1 complete merge note

This complete package includes the new Brain SK governance plus all merged v7/legacy/imported skills that were previously missing from the smaller package.

Important paths:

```text
C:\Falcon\Brain SK        = active Brain SK core package / Git repo
C:\Falcon\Falcon          = active Falcon project root with backend and frontend
C:\Falcon\Brain Outputs   = generated understanding, reports, scan metadata
C:\Falcon\Brain SK\_obsidian = Obsidian vault/index
```

Do not write generated understanding inside the core skill/protocol folders. Write it to `C:\Falcon\Brain Outputs`, then mirror it to `C:\Falcon\Brain SK\outputs` before Git push.

See `docs/SKILL_INVENTORY_AND_DOMAIN_MAP.md` for the full skill list and domain routing map.
