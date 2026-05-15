# Skill Routing Manifest

## Auto-detection

| Ammar says | Domain | Required skills |
|---|---|---|
| Analyze PRD / feature / scenario | Business | business-understanding, validation-rules, PES if needed |
| Convert HTML to Angular | Frontend | html-to-angular, Angular best practice, Tailwind-only, Falcon component registry, visual parity |
| Convert React to Angular | Frontend | react-to-angular, Angular best practice, Tailwind-only, component upgrade, visual parity |
| Visual difference / parity / source-vs-destination screenshots / "why this table doesn't look like that" / Night Shift visual repair | Frontend | **falcon-eyes** (canonical) — aliases `visual-difference-qa` and `visual-parity` route here. Pre-requisite for any UI fix when parity < 90 %. |
| Analyze controller / DTO / API | Backend | backend-api-understanding, DTO dictionary, validation/error map, gateway map |
| UI is done, link backend | Full Stack | backend API understanding, FE/BE contract mapping, validation sync, integration tests |
| Generate report | Shared | task-report-generator, data-visualization (analytics), PDF/report skill |
| Chart / scorecard / progress bar / gap chart / readiness chart / capability dashboard | Shared / Analytics | data-visualization |

## Manual override

Ammar can write:

```text
Domain: Frontend
Task: Convert this HTML to Falcon Angular.
```

Manual domain overrides auto-detection.
