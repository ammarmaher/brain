# Business Index

This index is auto-updated by Brain SK TouchBase and report generation.

## Latest

### 2026-05-13 (evening) · PRD understanding — LIVE

Canonical source: [Drive folder](https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH) · local mirror at `Brain SK\skills\imported-business\prd-knowledge\modules\` (6 modules, last synced 2026-04-24).

Brain analysis at [`outputs/prd/`](../outputs/prd/README.md):

| Output | Link |
|---|---|
| PRD index across all modules | [PRD_INDEX](../outputs/prd/PRD_INDEX.md) |
| Rolled-up PRD↔code gap list | [PRD_GAP_SUMMARY](../outputs/prd/PRD_GAP_SUMMARY.md) |
| Account Management | [folder](../outputs/prd/modules/01-account-management/) |
| User Management | [folder](../outputs/prd/modules/02-user-management/) |
| Contract / Packaging / Charging / Billing | [folder](../outputs/prd/modules/03-contract-packaging-charging-billing-management/) |
| Contact Group | [folder](../outputs/prd/modules/04-contact-group-management/) |
| Templates | [folder](../outputs/prd/modules/05-templates/) |
| Root cross-module documents | [folder](../outputs/prd/modules/root-documents/) |

Per-module each contains: `OVERVIEW.md` · `BUSINESS_RULES.md` · `ENTITIES.md` · `WORKFLOWS.md` · `QUESTIONS.md` · `GAPS.md`.

### Headline numbers

- **~180 business rules** extracted with cited evidence to `latest-prd.md` lines
- **~45 domain entities** catalogued
- **185 PRD↔code gap rows:** 69 COVERED · 21 PARTIAL · 45 MISSING · 42 UNVERIFIABLE → ≈ 48% covered

### Top 5 HIGH PRD-vs-code gaps

1. Templates entity has no public API (only 3 CommChannelConfig endpoints exist).
2. Templates service not routed by either gateway.
3. Contact Group frontend unbound (14 endpoints ready, no consumer).
4. CommChannel/App lifecycle admin UI unbound on `polishing-v0.4`.
5. Packaging + Billing missing from PRD body (folder titled but not authored).

### Top 5 open PRD questions

1. Password security levels — PRD: Normal/Advanced 2-tier vs Identity code: Low/Medium/High/Strict 4-tier.
2. Wallet topology mid-life migration when Balance Type changes with non-zero balances.
3. Refund flow for failed campaigns — no PRD, no code.
4. Forgot Password wrong OTP — PRD says silent vs Login spec says lock after 3.
5. Template versioning on edit — does old version keep running until new is approved?

### Refresh

The Drive folder is the authority. To refresh: run `take latest from PRD` against the [`prd-knowledge` skill](../skills/imported-business/prd-knowledge/Skill.md) — that rewrites the local mirror; then re-dispatch the PRD-understanding agent against the same modules.

### Indirect business signals also captured

- [Cross-service endpoint inventory](../outputs/understanding/backend/BACKEND_SERVICE_MAP.md) — the surface area of business features the platform exposes
- [API-to-component trace](../outputs/understanding/integration/API_TO_COMPONENT_TRACE.md) — which UI features consume which backend operations
- [Falcon component registry](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_REGISTRY.md) — the UI vocabulary available for new business features (see also [[Frontend Components Index]] and [[Frontend Understanding]])
