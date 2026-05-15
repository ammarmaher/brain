# Brain SK v0.1 Backend Domain

Use this domain for backend/API understanding, microservice scans, controllers, DTOs, validators, error maps, gateway routes, and frontend API contracts.

Specialist skill sources:

- `skills/backend-api-understanding/SKILL.md`
- Backend/API sections of `skills/legacy-v7/60-falcon-project-abstraction-understanding/SKILL.md`

Backend DTOs/controllers/validators/gateway are the source of truth for frontend request/response models and validations.

## Canonical knowledge path

**Canonical backend knowledge path** (read + write):

```text
C:\Falcon\Brain Outputs\understanding\backend
```

Per-service folders live at `understanding/backend/<short-name>/` and carry the canonical 6-file set per service: `SERVICE_OVERVIEW.md`, `ENDPOINT_REGISTRY.md`, `DTO_DICTIONARY.md`, `VALIDATIONS.md`, `ERRORS.md`, `FRONTEND_CONTRACT.md`. Top-level cross-service maps: `BACKEND_SERVICE_MAP.md`, `GATEWAY_ROUTE_MAP.md`.

Knowledge root index (read first): [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). Routing: [`shared/SKILL_ROUTING_MANIFEST.md`](../../shared/SKILL_ROUTING_MANIFEST.md). Learning-First protocol: [`protocols/LEARNING_FIRST_TASK_ROUTING.md`](../../protocols/LEARNING_FIRST_TASK_ROUTING.md).

**Legacy / mirror — do NOT use as active source:**

- `C:\Falcon\Brain Outputs\backend-understanding` (pre-canonicalization path; kept for archival provenance only)

Mirror to `C:\Falcon\Brain SK\outputs\understanding\backend\` is additive only (`robocopy /E /XO`; never `/MIR`).
