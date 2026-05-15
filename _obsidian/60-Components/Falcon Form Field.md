*** Component note — Falcon Form Field ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-form-field/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Form Field

> LEGACY / BESPOKE Angular labeled-field wrapper (label row + required asterisk + hint + error message + content slot). Pre-Wave-5 era. New Falcon UI inputs (`<falcon-angular-input>` etc.) have built-in `label` / `helperText` / `errorMessage` — they do NOT need this wrapper. Active in admin + management consoles' organization-hierarchy wizards; migration ongoing. SoT surprise: SCSS file exists in this legacy component, contradicting the no-SCSS rule — flagged for cleanup.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-form-field/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-form-field/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-form-field/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-form-field/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-form-field/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-form-field/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — add-user-wizard + add-client-wizard step templates on both admin-console and management-console (per dossier "Known consumers").

## PRDs that use this component

- [[02 User Management]] — Add User wizard step rows (legacy wrapper).
- [[01 Account Management]] — Add Client wizard step rows (legacy wrapper).

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-form-field/GAPS_AND_UPGRADES.md) — filter by component `falcon-form-field`. P1 G1: migrate SCSS → Tailwind + tokens. P1 G3: workspace-wide migration audit + deprecation._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-form-field`._

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
