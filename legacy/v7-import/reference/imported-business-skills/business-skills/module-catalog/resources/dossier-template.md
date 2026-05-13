*** Module Dossier Template ***
*** Standard shape every modules/<slug>/README.md must follow ***

# Module Dossier Template

Copy this when creating a new module dossier. Replace bracketed placeholders.

```markdown
# Module: <Module Name>

Status: <Active | Planned | Deprecated | Archived>
Owner: <Service name — e.g. Commerce>
Last updated: <YYYY-MM-DD>

## Scope

<One paragraph — what this module does and does NOT do.>

## Surfaces

- Frontend: <web-platform-ui path or "n/a">
- Backend:  <falcon-core-*-svc path>
- Gateway:  <core-gateway / system-gateway route>

## Key entities

- <Entity> (canonical: <service>)
- <Entity> (canonical: <service>)

## Linked artifacts

See [links.md](./links.md) for the full set. Quick refs:
- PRD:  prd-knowledge/modules/<slug>/latest-prd.md
- Wiki: falcon-wiki/.../<page>.md
- Code: services/<Service>/<Folder>/
- Tests: test-case-authoring/modules/<slug>/

## Recent decisions (latest 3)

1. (YYYY-MM-DD) <decision summary> — see [decisions.md](./decisions.md)
2. ...
3. ...

## Open questions

See [open-questions.md](./open-questions.md). Currently <N> open.
```

## Required sibling files

Every module dossier folder also has:

| File | Purpose |
|---|---|
| `behavior.md` | Current behavior + edge cases (free-form prose) |
| `surface-map.md` | Detail of frontend/backend/gateway surfaces |
| `decisions.md` | ADR-style decision log (see [decision-log-rules.md](./decision-log-rules.md)) |
| `open-questions.md` | TBDs with `q-<id>` anchors |
| `links.md` | All external links: PRD, Wiki, code, tests, dashboards |
| `coverage.md` | Test coverage snapshot — written by `test-case-authoring` |
| `understanding.md` | (migrated from OLD) Claude's 15-section digested PRD interpretation — see [`module-understanding-rules.md`](./module-understanding-rules.md) |
| `latest-prd.md` | (migrated from OLD) Selected PRD details + structured summary — kept in sync from `prd-knowledge/modules/<slug>/` |
| `attachments.md` | (migrated from OLD) Inventory of non-selected useful files |
| `source-map.json` | (migrated from OLD) Drive ↔ local metadata, ignored duplicates, unreadable files, open questions |

## 15-section `understanding.md` schema (migrated from OLD)

Every `understanding.md` covers these sections in order. Source of truth: [`module-understanding-rules.md`](./module-understanding-rules.md).

1. module purpose
2. actors / users
3. screens / pages
4. main actions
5. business rules
6. permission rules (when applicable)
7. main workflows
8. edge cases
9. validations
10. dependencies on other modules
11. data entities
12. API expectations (if mentioned)
13. assumptions
14. risks / unclear areas
15. suggested clarifying questions

**Writing rules:**
- Clear structured language; no copy-paste from PRD
- Be explicit about every assumption
- Flag contradictions between PRD and attachments
- Flag every unclear area as a clarifying question
- Neutral / descriptive tone — no marketing language
- Primary source = selected latest PRD; supporting = attachments with `used_for_understanding: yes`
- On new PRD version: rewrite, preserve unanswered clarifying questions, add "Changes since previous version" note at the top

## `source-map.json` schema (migrated from OLD)

```json
{
  "moduleName": "",
  "originalDriveFolderName": "",
  "localModuleFolder": "",
  "lastSyncedAt": "",
  "selectedLatestPrd": {
    "fileName": "",
    "version": "",
    "sourcePathOrLink": "",
    "selectionReason": ""
  },
  "ignoredDuplicatePrds": [],
  "supportingFiles": [],
  "images": [],
  "excelFiles": [],
  "wordFiles": [],
  "unreadableFiles": [],
  "openQuestions": []
}
```

## `attachments.md` per-file shape (migrated from OLD)

Sections: Word files · Excel files · images · diagrams · screenshots · other attachments · unreadable files

For each file:
- file name
- type
- source link/path
- detected purpose
- `used_for_understanding`: yes/no
- extracted key information
- notes
