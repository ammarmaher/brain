---
name: Component Knowledge Base — 3-layer dossiers
description: All 62 Falcon components now have 9-file dossiers (UI + Business + Integration/Validation + Recognition); plan, conclusion, link map, Falcon Eyes wired
type: project
originSessionId: 67902d27-112b-46a5-ac1e-d7db47e9edfc
---
The Falcon component knowledge base — built so that a screenshot/design maps to the right Falcon component + composition recipe.

**Why:** The 62 component dossiers had only the UI layer (6 files). User wanted them understood three ways — UI, business, integration+validation — and linked to pages + backend modules.

**How to apply:** Each component folder `Brain Outputs/understanding/frontend/components/<name>/` now has 9 files. For "which component for this design" → read `RECOGNITION.md` (visual fingerprint + cross-library map MUI/PrimeNG/Ant/Bootstrap/shadcn → Falcon). For build rules → `BUSINESS.md` + `INTEGRATION_VALIDATION.md`. Master orientation → `COMPONENT_LIBRARY_CONCLUSION.md`.

**Landed 2026-05-18:**
- Plan: `Brain/Brain Generated/COMPONENT-KNOWLEDGE-BASE-PLAN-2026-05-18.md`.
- 3 new dossier files per component (62 × 3 = 186): `BUSINESS.md`, `INTEGRATION_VALIDATION.md`, `RECOGNITION.md`. Schema at `components/_template/`. Exemplar: `falcon-dropdown`. Built by 13 parallel agents.
- `COMPONENT_LIBRARY_CONCLUSION.md` — master index: 62 components in 12 categories, decision spine, retired list.
- Falcon Eyes skill (`Brain SK/domains/frontend/falcon-eyes/SKILL.md`) wired to consult the dossiers.
- Searchable via `brain-search` (re-indexed: 2,210 files / 27,143 chunks).

**Drift the build caught (dossiers were stale):** `falcon-icon` registry is ~322 icons not 122; `falcon-button` has a 6th `dashed` variant; `falcon-input-number` GAPS G5 is stale; `falcon-filter-panel` `role="search"` already shipped; `falcon-combobox` has a 250ms debounce. Corrections recorded in the new INTEGRATION_VALIDATION files (old 6 left untouched).

**Retired/orphan components confirmed — do not use:** `falcon-mobile-number` (deleted → use phone-field), `falcon-multiselect-legacy` (deleted → multi-select), `falcon-stepper-legacy` (deleted → stepper/wizard), `send-credentials-popup` (orphan → falcon-sending-credentials-dialog), `falcon-calendar-legacy` (orphan → date-picker), `falcon-organization-hierarchy-tree-tw` (no production consumer → tree-panel), `falcon-toast` component is `@deprecated`.

**In progress:** P2 `COMPONENT_PAGE_MODULE_MAP.md` (component↔page↔barrel↔backend module link graph) — agent running 2026-05-18.
