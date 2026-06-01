---
name: Brain SK — canonical PRD + wiki sources
description: Locked-in canonical URLs for Falcon PRDs (Google Drive) and architecture wiki (Azure DevOps), with their local representations and how to refresh. Set 2026-05-13 by Ammar.
type: reference
originSessionId: 5d9b5937-e933-4387-b32c-6db67d52ecad
---
# Brain SK — canonical PRD + wiki sources (2026-05-13)

Ammar locked in both canonical sources on 2026-05-13. Future Brain SK sessions must treat these as authoritative.

## PRDs

| Layer | Value |
|---|---|
| Canonical source | `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH` |
| Local synced mirror | `C:\Falcon\Brain SK\skills\imported-business\prd-knowledge\modules\` |
| Brain analysis output | `C:\Falcon\Brain Outputs\prd\` |
| Refresh command | `take latest from PRD` (or `update PRD knowledge`) against the `prd-knowledge` skill at `Brain SK\skills\imported-business\prd-knowledge\Skill.md` |
| Drive folder structure | One subfolder per module with `v<number>` PRDs; pick highest numeric v (NOT text comparison — `v10 > v2`) |

The Drive folder requires sign-in. WebFetch CANNOT reach it directly. The `prd-knowledge` skill is the only sanctioned path to read PRDs into Brain SK.

Modules currently synced (as of 2026-04-24):
- `01-account-management`
- `02-user-management`
- `03-contract-packaging-charging-billing-management`
- `04-contact-group-management`
- `05-templates`
- `root-documents`

## Architecture wiki

| Layer | Value |
|---|---|
| Canonical source (web UI) | `https://t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki/1129/Home` |
| Canonical source (git, backing repo) | `https://t2development.visualstudio.com/Falcon/_git/Falcon.wiki` (also reachable via `…/DefaultCollection/Falcon/_git/Falcon.wiki`) |
| Branch | `wikiMaster` |
| Local clone | `C:\Falcon\falcon-wiki\` |
| Brain analysis output | `C:\Falcon\Brain Outputs\wiki-architect\` |
| Refresh command | `git -C "C:\Falcon\falcon-wiki" pull` (weekly cadence — Sunday — or before any architectural decision) |
| Top-level layout | `Home.md` + `Home/` (with `Software-Architecture-Design/` holding the 16 canonical docs) + `.attachments/` (images) |

Cached Azure DevOps credentials on this box work for read-only access — clone succeeded without a prompt on 2026-05-13. If a future session gets an auth error, ask Ammar for fresh credentials.

The 16 canonical Software-Architecture-Design docs (filenames as on disk):
`Account-Management-Module.md`, `Architecture-Vision.md`, `Azure-statuses-(US,-Bugs,-Tasks).md`, `Clean-Architecture-project-structure-&-business-concepts.md`, `Contact-Group-Module.md`, `Deployment-Document-(Dev-Servers-specs-&-Env-setup).md`, `Design-Patterns-&-Guidelines.md`, `Development-&-Deployment-Strategy.md`, `Falcon-AI-Conversational-Orchestration.md`, `Falcon-Pricing,-Tariff-&-OCS-—-BRD-+-Technical-Architecture.md`, `Falcon-Template-Management-BRD-&-Technical-Architecture.md`, `Front%2DEnd-Architecture.md`, `High-Level-Architecture.md`, `Permissions-&-Authorization-Module-(Policy%2DBased-Access-Control).md`, `Security-Architecture.md`, `System-Context.md`.

## Source-of-truth priority

Per `Brain SK\protocols\SOURCE_OF_TRUTH_PRIORITY.md`:
1. **Architecture wiki** — highest. When the wiki contradicts code-extracted rules or backend DTOs, the wiki wins.
2. Backend controllers / DTOs / validators — for API contracts only.
3. **Approved PRDs** — for business rules and workflows.
4. Existing codebase + current branch.
5. Falcon registries + approved patterns.
6. Visual / HTML / React references.
7. Best-practice assumptions — must be explicitly marked.

If the wiki and a PRD disagree on a business rule, **flag both and ask Ammar**. The wiki wins on architecture; the PRD wins on business. Architecture-vs-business conflicts are real and need human resolution.

## Hard rules

- Never edit `C:\Falcon\falcon-wiki\` (local clone — edits lost on pull / pollute wiki on push).
- Never edit `Brain SK\skills\imported-business\prd-knowledge\modules\` (owned by the `prd-knowledge` skill — overwritten on next sync).
- Brain analysis lives only in `Brain Outputs\wiki-architect\` and `Brain Outputs\prd\` — never inside Brain SK core (except via the additive mirror to `Brain SK\outputs\` for git sync).
- Every rule / business statement extracted MUST cite a source line in the original wiki or PRD file.
- If the wiki HEAD changes upstream and the local clone is stale by more than 7 days for an architectural decision task, re-pull before answering.
- If the PRD local mirror is stale by more than 14 days for a business-analysis task, re-run `take latest from PRD` first.

## Why this memory exists

**Why:** Ammar explicitly named both URLs as canonical on 2026-05-13 and asked me to make sure future sessions always know they ARE the canonical sources. Brain SK is a multi-session system; this fact must survive context resets.

**How to apply:**
- On every new Brain SK session that touches business or architecture, consult this memory FIRST before asking Ammar for source paths.
- When invoking the `prd-knowledge` skill or running architecture analysis, use these exact URLs in commit messages, audit trails, and reports.
- The `brain.config.json` at `Brain SK\config\brain.config.json` already encodes these under `paths.prdDriveUrl`, `paths.prdLocalMirror`, `paths.architectureWikiUrl`, `paths.architectureWikiGitUrl`, `paths.architectureWikiLocalClone`. That is the runtime source of truth.
