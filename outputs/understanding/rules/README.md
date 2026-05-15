*** Falcon Rulebook — canonical source of truth ***
*** One file per rule. Frontmatter is the machine surface. ***
*** SoT for the night-shift code-audit detector engine. ***

# Falcon Rulebook

> The canonical, machine-readable rulebook for **clean code + architectural roles** across the Falcon platform. Every rule that an Ammar / Adnan agent must enforce — frontend, backend, admin-console (Noor), cross-cutting — lives here as a single typed note with a deterministic detector hint.
>
> Built from the union of: architecture wiki, brain-skills, CLAUDE.md (root + per-project + .claude), agent memory feedback notes, Brain Outputs/understanding patterns, and Noor Instructions resources.

## Folder map

| Folder | Scope |
|---|---|
| `frontend/` | All apps + libs in `falcon-web-platform-ui` (Angular + Tailwind + Falcon UI Core). Universal frontend rules. |
| `frontend-admin-console/` | **Noor scope only** — `apps/admin-console/**`. Overrides global rules where stated (e.g. color-naming). |
| `backend/` | All .NET 10 services: commerce, charging, provisioning, identity. Clean Architecture + DDD + Wiki rules. |
| `cross-cutting/` | Platform-wide rules that affect both stacks: identity ownership, no-direct-zitadel, build-must-be-green, commit/push permissions, strict task scope. |
| `detectors/` | Implementation scripts (regex / structural / AST / semantic-LLM) that turn each rule into auditable signal. |
| `exemptions/` | Per-file or per-folder exemptions, justified and dated. Used by detectors to suppress known noise. |
| `proposed/` | Rules suggested by night shift or by Ammar but not yet promoted. Reviewed in morning briefing. |

## Per-rule file format

Every rule is one MD file named `<rule-id>-<short-slug>.md`. Required frontmatter — see `RULE_TEMPLATE.md`.

## How rules get promoted

1. Source detected (PR review, learning event, wiki update, screenshot critique).
2. Drafted in `proposed/`.
3. Ammar approves in morning briefing → file moves to its category folder.
4. Detector authored under `detectors/` and dry-run on touched files.
5. Detector wired into night-shift code-audit job.

## How rules get retired

Rules are never deleted. To retire a rule:
- set `severity: deprecated`
- add `deprecatedDate` and `deprecatedReason`
- the detector still runs but findings are demoted to FYI only

## Rule ID prefixes

| Prefix | Scope |
|---|---|
| `R-FE-*` | frontend (universal) |
| `R-NOOR-*` | frontend admin-console (Noor) |
| `R-BE-*` | backend (.NET services) |
| `R-XC-*` | cross-cutting (operational, security, governance) |

## Related

- Vault hub: `_obsidian/35-Architecture/RULES_INDEX.md` (graph + Dataview view of this folder)
- Night shift job: `C:\Falcon\Brain\jobs\code-audit-*.md` (uses these rules)
- Exemption registry: `exemptions/EXEMPTIONS.md`
- Falcon Wiki source rules: `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\`
