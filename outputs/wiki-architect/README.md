*** Brain Outputs — Architecture wiki understanding ***

# Falcon architecture wiki understanding

This folder holds the **brain's wiki-grounded** view of the Falcon architecture. It supersedes the earlier code-extracted fallback at `outputs/understanding/wiki/` from the moment the wiki vault is available.

## Canonical source

- **Azure DevOps wiki (authoritative):** `https://t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki/1129/Home`
- **Backing git repo:** `https://t2development.visualstudio.com/Falcon/_git/Falcon.wiki` (branch `wikiMaster`)
- **Local clone:** `C:\Falcon\falcon-wiki\` (HEAD `0d0cb311…` as of 2026-05-13)

The Azure DevOps wiki UI and the git repo are the same content. The brain reads the local clone for analysis; refresh via `git -C C:\Falcon\falcon-wiki pull`.

## Why this folder exists

The earlier discovery pass produced a *code-extracted* architecture rule book at `outputs/understanding/wiki/` because the wiki was missing locally. With the wiki now cloned, this folder holds the **wiki-grounded** rule book — the authoritative version. The earlier fallback remains for historical comparison but is superseded.

## Layout

```
wiki-architect/
  README.md                       ← this file
  WIKI_OVERVIEW.md                ← what the wiki contains, top-level navigation
  Home/
    Software-Architecture-Design/
      ARCHITECTURE_VISION.md      ← summary of Architecture Vision wiki doc
      HIGH_LEVEL_ARCHITECTURE.md
      CLEAN_ARCHITECTURE.md
      DESIGN_PATTERNS_AND_GUIDELINES.md
      FRONT_END_ARCHITECTURE.md
      SECURITY_ARCHITECTURE.md
      PERMISSIONS_AND_AUTHORIZATION.md
      ACCOUNT_MANAGEMENT_MODULE.md
      CONTACT_GROUP_MODULE.md
      DEVELOPMENT_AND_DEPLOYMENT_STRATEGY.md
      AZURE_WORK_ITEM_STATES.md
      FALCON_AI_CONVERSATIONAL_ORCHESTRATION.md
      FALCON_PRICING_TARIFF_OCS.md
      FALCON_TEMPLATE_MANAGEMENT.md
      SYSTEM_CONTEXT.md
      DEPLOYMENT_DOCUMENT.md
  CONSOLIDATED_ARCHITECTURE_RULES.md     ← unified rule book (wiki-grounded; supersedes outputs/understanding/wiki/ARCHITECTURE_RULES.md)
  CONSOLIDATED_ARCHITECTURE_CONFLICTS.md ← what the code does differently from the wiki (rewrite of outputs/understanding/wiki/ARCHITECTURE_CONFLICTS.md against the real wiki)
  WIKI_TO_CODE_TRACE.md           ← which wiki rules are implemented in which code locations
```

## Hard rules

- Never edit `C:\Falcon\falcon-wiki\` directly. That is the local clone of the canonical wiki — edits there would either be lost on `git pull` or pollute the wiki on `git push`.
- Treat the wiki as the **highest** source-of-truth priority (per `protocols/SOURCE_OF_TRUTH_PRIORITY.md` — Architecture Wiki sits at #1). When the wiki contradicts the code-extracted fallback, the wiki wins; record the diff in `CONSOLIDATED_ARCHITECTURE_CONFLICTS.md`.
- Every rule captured here MUST cite the wiki source file (relative path under `Home/Software-Architecture-Design/`) so verification is one click away.
- Wiki refresh cadence: pull weekly (Sunday) or before any architectural decision; record the HEAD SHA on each refresh.

## Relationship to the code-extracted fallback

The earlier `outputs/understanding/wiki/` (`ARCHITECTURE_RULES.md` + `ARCHITECTURE_CONFLICTS.md` + `WIKI_FALLBACK_NOTE.md` + `WIKI_IMAGE_INDEX.md`) was the brain's best-effort rule book when the wiki was unreachable. It stays in place as audit history. The files in *this* `wiki-architect/` folder supersede it from 2026-05-13 onward.

## Status as of 2026-05-13

- Wiki cloned to `C:\Falcon\falcon-wiki` (HEAD `0d0cb311b56a991b94b6a0af03a26a12014b2926`, branch `wikiMaster`, 110 files).
- 16 canonical Software-Architecture-Design documents detected (Architecture-Vision, High-Level-Architecture, Clean-Architecture, Design-Patterns, Front-End-Architecture, Security-Architecture, Permissions-Authorization, Account-Management, Contact-Group, Dev-Deployment-Strategy, Azure-statuses, AI-Orchestration, Pricing-Tariff-OCS, Template-Management, System-Context, Deployment-Document).
- Wiki-grounded architecture agent dispatched in this same Brain SK pass — see per-doc files alongside this README.
- Readiness row "Architecture wiki coverage" lifted from `15%` to ≥ `70%` once the agent completes.
