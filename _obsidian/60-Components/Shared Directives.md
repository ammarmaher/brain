*** Component note — Shared Directives ***
*** SoT: Brain Outputs/understanding/frontend/components/shared-directives/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Shared Directives

> Not a UI component proper — set of 12 standalone Angular directives at `libs/falcon/src/shared-ui/lib/directives/`. Sync validators, async (debounced) validators, input masks, form-wide UX enhancements, and runtime mutations. Composed on form inputs across feature folders.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/shared-directives/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/shared-directives/API.md)
- [USAGE](../../outputs/understanding/frontend/components/shared-directives/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/shared-directives/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/shared-directives/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/shared-directives/DECISION.md)

> **Directives covered:** `FalconFormValidateDirective`, `FalconStartWithLetterDirective`, `FalconStartWithLetterMax30Directive`, `FalconLettersDigitsMaxDirective`, `FalconUsernameFormatDirective`, `FalconPhoneNumberDirective`, `FalconPhoneMaskDirective`, `FalconCheckExistsDirective` (async), `FalconIpAddressDirective`, `FalconEffectiveDateDirective`, `FalconColumnNameDirective`, `FalconTruncateDirective`.

## Pages using this component

- Cross-cutting — every page with form inputs. [[Organization Hierarchy]] (account-name uniqueness via `FalconCheckExistsDirective`, IP allowlist editor via `FalconIpAddressDirective`, phone-mask via `FalconPhoneMaskDirective`); Add Client / Add User wizards.

## PRDs that use this component

- Cross-cutting — every PRD with form fields ([[01 Account Management]] · [[02 User Management]] · [[03 Contract Packaging Charging Billing]] · [[04 Contact Group Management]] · [[05 Templates]]).

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/shared-directives/GAPS_AND_UPGRADES.md) — filter by directive name.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `shared-directives` (note: directives are behavioral — visual reports rare).

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
