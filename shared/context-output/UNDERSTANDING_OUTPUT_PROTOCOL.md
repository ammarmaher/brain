# Understanding Output Protocol

Brain SK must not keep important analysis only in hidden reasoning.
Every bootstrap, scan, implementation, API understanding, PRD understanding, or component understanding must generate files Ammar can open.

## Required output root

All generated understanding goes under:

```text
outputs/
```

Recommended structure:

```text
outputs/
  discovery/
    discovered-path-map.md
    discovered-path-map.json
    startup-readiness-report.md
    scan-metadata.json

  understanding/
    business/
      BUSINESS_OVERVIEW.md
      BUSINESS_RULES_SUMMARY.md
      BUSINESS_GAPS.md
      BUSINESS_IMPACT_MAP.md

    backend/
      BACKEND_SERVICE_MAP.md
      GATEWAY_ROUTE_MAP.md
      API_ENDPOINT_REGISTRY.md
      API_DTO_DICTIONARY.md
      controllers/
        <ControllerName>/
          OVERVIEW.md
          ENDPOINTS.md
          DTOS.md
          VALIDATIONS.md
          ERRORS.md
          FRONTEND_CONTRACT.md

    frontend/
      FRONTEND_WORKSPACE_MAP.md
      FALCON_COMPONENT_REGISTRY.md
      TAILWIND_TOKEN_MAP.md
      FRONTEND_STRUCTURE_REPORT.md
      components/
        <ComponentName>/
          OVERVIEW.md
          API.md
          USAGE.md
          GAPS_AND_UPGRADES.md

    wiki/
      ARCHITECTURE_RULES.md
      ARCHITECTURE_CONFLICTS.md
      WIKI_IMAGE_INDEX.md

  reports/
    <task-name>-<yyyy-mm-dd>/
      TASK_REPORT.md
      TASK_REPORT.pdf
      evidence/
      screenshots/
```

## Minimum visible output after TouchBase

After TouchBase runs, these files must exist:

```text
outputs/discovery/discovered-path-map.md
outputs/discovery/discovered-path-map.json
outputs/discovery/startup-readiness-report.md
outputs/discovery/scan-metadata.json
```

If they cannot be generated, the brain must say why.

## What the reports must show

Each report should show:

- what was scanned
- what was found
- what was missing
- what source of truth was used
- which branch/path was used
- what was skipped and why
- what needs Ammar authorization/API key/path input
- whether Obsidian linking was completed
- whether Git auto-sync completed

## No hidden-only analysis rule

If the brain says it understands something, it must write a corresponding Markdown or JSON file into `outputs/` or the relevant registry.
