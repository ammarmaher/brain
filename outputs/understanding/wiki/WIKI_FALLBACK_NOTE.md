*** WIKI_FALLBACK_NOTE — code-extracted architecture rule book ***

## Why this document exists

The canonical architecture Wiki at `C:\Falcon\falcon-wiki` is **MISSING** in this
environment (recorded as `WARN` in the readiness report from the first-pass
TouchBase). It is normally auto-synced every Sunday from
`https://t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki`.

To unblock the discovery pipeline, this rule book and the accompanying
`ARCHITECTURE_RULES.md` / `ARCHITECTURE_CONFLICTS.md` were produced by
**reading the actual code** in the active services under `C:\Falcon\Falcon\`.
They reflect *what the code does today*, not *what the standard says it should*.

## How to treat these documents

This is a **fallback**. When the Wiki vault is restored, the canonical
documents below take precedence over anything written here. If a rule in this
fallback contradicts a Wiki rule, the Wiki is authoritative — open an
`ARCHITECTURE_CONFLICTS.md` entry for the gap and fix the code, not the doc.

## Canonical Wiki documents (override these extracted rules)

From `C:\Falcon\CLAUDE.md`:

| Document | Path |
|---|---|
| Architecture Vision | `Home/Software-Architecture-Design/Architecture-Vision.md` |
| High-Level Architecture | `Home/Software-Architecture-Design/High-Level-Architecture.md` |
| Clean Architecture & DDD | `Home/Software-Architecture-Design/Clean-Architecture-project-structure-&-business-concepts.md` |
| Design Patterns & Naming | `Home/Software-Architecture-Design/Design-Patterns-&-Guidelines.md` |
| Frontend Architecture | `Home/Software-Architecture-Design/Front-End-Architecture.md` |
| Security Architecture | `Home/Software-Architecture-Design/Security-Architecture.md` |
| Permissions & Authorization | `Home/Software-Architecture-Design/Permissions-&-Authorization-Module-(Policy-Based-Access-Control).md` |
| Account Management | `Home/Software-Architecture-Design/Account-Management-Module.md` |
| Contact Group Module | `Home/Software-Architecture-Design/Contact-Group-Module.md` |
| Dev & Deployment Strategy | `Home/Software-Architecture-Design/Development-&-Deployment-Strategy.md` |
| Azure Work Item States | `Home/Software-Architecture-Design/Azure-statuses-(US,-Bugs,-Tasks).md` |
| Wiki entry point | `Home.md` |

## Re-running after Wiki is restored

1. Restore the Obsidian vault to `C:\Falcon\falcon-wiki` (Sunday sync, or
   manual pull from the Azure DevOps Wiki).
2. Re-run the first-pass TouchBase — the readiness report should flip the
   wiki entry from `WARN` to `OK`.
3. Re-run the Architecture / Structure Agent — it will produce a
   wiki-grounded rule book that supersedes this fallback.
4. Diff the two rule books and triage every delta as either:
   - **code-evolved** (Wiki is stale; update Wiki),
   - **code-drift** (Wiki is canonical; fix code), or
   - **agreed-deviation** (record an explicit exception in `ARCHITECTURE_CONFLICTS.md`).

## Scope of evidence used in this fallback

- Read-only scan of csproj/sln/slnx, appsettings, controllers/endpoints,
  domain entities, DI wiring, gateway YARP config, frontend nx/package.json.
- All active service roots under `C:\Falcon\Falcon\`, excluding
  `legacy-*`, `archived`, `deprecated-*`, `node_modules`, build outputs.
- Each extracted rule cites at least one source file in
  `ARCHITECTURE_RULES.md`. Rules without code evidence are marked
  `UNVERIFIED — wiki needed`.
