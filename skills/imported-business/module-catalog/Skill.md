*** Skill: module-catalog ***
*** Per-module dossiers — scope, surfaces, decisions, open questions ***

# module-catalog

## Purpose

Curated knowledge per Falcon business module. What it does, where it lives across the stack, what decisions have been made, what is still open. Onboarding artifact + cross-link hub between PRD, Wiki, code, and tests.

## Triggers

- Any task scoped to a specific module (e.g. Account Management, Contact Group, Charging)
- Onboarding a new dev or agent
- "What does X module do?" / "Where does X live?" questions
- After a `prd-knowledge` sync — refresh affected modules

## Owns

- Per-module README + scope statement
- Surface map (frontend feature, backend service, gateway route, entities)
- Decision log (ADR-style)
- Open questions / TBDs
- Test coverage snapshot

## Folder layout

```
module-catalog/
  Skill.md
  INDEX.md                      <- master list, status per module
  resources/
    dossier-template.md         <- standard module file shape
    decision-log-rules.md
  modules/
    <module-slug>/
      README.md                 <- scope + surfaces + entities + links
      behavior.md               <- current behavior, edge cases
      surface-map.md            <- frontend / backend / gateway routes
      decisions.md              <- ADR-style decision log
      open-questions.md         <- TBDs, gaps
      links.md                  <- {prd, wiki, code, test} pointers
      coverage.md               <- test coverage snapshot
```

## Hard rules

1. Every module has all required files (no partials) — both NEW dossier files (`README, behavior, surface-map, decisions, open-questions, links, coverage`) AND OLD migrated files (`understanding.md, latest-prd.md, attachments.md, source-map.json`)
2. Every decision has date + rationale + alternatives considered
3. `INDEX.md` regenerated on any module add or rename
4. Every term used must exist in `domain-glossary`
5. Every link in `links.md` must resolve (no broken pointers)
6. After a PRD sync that touched module X, X's `links.md` and `README.md last-updated` must be refreshed
7. **`understanding.md` must follow the 15-section schema** — see [`resources/module-understanding-rules.md`](./resources/module-understanding-rules.md)
8. **Migrated 6 modules from OLD claude-falcon-skills are preserved** in `modules/01-account-management/`, `02-user-management/`, `03-contract-packaging-charging-billing-management/`, `04-contact-group-management/`, `05-templates/`, `root-documents/`

## Restrictions

- Do not edit Angular application files
- Do not edit backend application files
- Do not install packages
- Do not run migrations
- Do not refactor source code
- Do not change Nx workspace structure / Module Federation / PrimeNG / Tailwind
- Only knowledge files inside `module-catalog/modules/**` and this skill's docs may be touched

## Cross-skill contracts

- **From `prd-knowledge`:** receives list of changed modules → refresh their `links.md` + `last-updated`
- **From `domain-glossary`:** every term used is validated
- **To `test-case-authoring`:** provides PRD link + scope + entities

## Status Announcer (voice + sound)

Source of truth: [`settings/sound/settings.json`](../../settings/sound/settings.json) → `skills.module-catalog`.

| Phase | Voice | Phrase | Beep |
|---|---|---|---|
| Activation | `bm_daniel` | "Module catalog running." | — |
| Working (long ops) | `bm_daniel` | "Module catalog working." | — |
| Completion | `bm_daniel` | "Module catalog complete." | long-short-long telegraph `[700,500; 700,200; 700,500]` |
| **Global handshake** | `bm_george` | **"I am finishing, boss."** | double-tap `[1320,100; 1320,100]` |

**Reading the response aloud:** When agent-tts is running, every assistant turn under this skill is spoken via Kokoro at `bm_daniel` and 8× volume.

**Final sequence per cycle:**
1. "Module catalog running." → work → "Module catalog complete."
2. Per-skill beep (long-short-long telegraph)
3. "I am finishing, boss." (always `bm_george`)
4. Global double-tap beep

Play ONLY after a full module dossier creation or `INDEX.md` regeneration.

## See also

- [resources/dossier-template.md](./resources/dossier-template.md)
- [resources/decision-log-rules.md](./resources/decision-log-rules.md)
- [INDEX.md](./INDEX.md)
