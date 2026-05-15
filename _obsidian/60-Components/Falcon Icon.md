*** Component note — Falcon Icon ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-icon/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Icon

> Thin wrapper around the vendored Falcon icon font (122 icons) rendering `<i class="falcon-icon falcon-icon-<name>">`. Standardised size tokens (xs/sm/md/lg/xl), a11y posture (decorative-by-default; meaningful via `decorative=false` + `label`). Wave 9.E foundation. Replaces all `pi pi-*` PrimeIcons.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-icon/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-icon/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-icon/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-icon/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-icon/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-icon/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — used implicitly via the icon font across every section (header actions, status pills, table cells). Per dossier: `apps/host-shell/src/app/layout/layout.component.html` uses `<falcon-angular-icon>` directly; many feature templates still use the raw `<i class="falcon-icon ...">` pattern.

## PRDs that use this component

- _cross-cutting platform component_ — every PRD uses Falcon icons implicitly.

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-icon/GAPS_AND_UPGRADES.md) — filter by component `falcon-icon`. Tier-1: ESLint rule + codemod to migrate raw `<i>` to wrapper; `spin` / `pulse` animation props; unified iconify fallback._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-icon`._

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
