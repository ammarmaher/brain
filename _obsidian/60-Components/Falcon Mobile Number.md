*** Component note — Falcon Mobile Number ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-mobile-number/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Mobile Number

> LEGACY FACADE (Wave 2). Compile-only compatibility shim preserving the legacy `<falcon-mobile-number>` selector + inputs/outputs while delegating internally to `<falcon-angular-phone-field>`. Replaced `ngx-intl-tel-input` + `google-libphonenumber` + `intl-tel-input` (uninstalled). Do NOT use for new code — use `<falcon-angular-phone-field>` directly. Slated for deletion after consumer migration.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-mobile-number/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-mobile-number/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-mobile-number/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-mobile-number/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-mobile-number/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-mobile-number/DECISION.md)

## Pages using this component

- _no production consumers spotted in the audit; needs full project grep_ (per dossier "Known consumers"). Legacy contact phone fields in old wizards are the only plausible consumers.

## PRDs that use this component

- _legacy facade — no PRD should target this; new uses must point at `<falcon-angular-phone-field>`._

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-mobile-number/GAPS_AND_UPGRADES.md) — filter by component `falcon-mobile-number`. Migration path: replace consumers with `<falcon-angular-phone-field>` and delete the facade folder._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-mobile-number`._

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
