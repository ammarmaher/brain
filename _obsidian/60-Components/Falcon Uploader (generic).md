---
type: falcon-component
component: Falcon Uploader (generic)
folder-name: falcon-angular-uploader
deprecated: true
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Uploader (generic) ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-uploader/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Uploader (generic)

> Multi-file uploader with three operating modes — `dropzone`, `button`, `inline-list`. Renders a native `<input type="file">` plus optional file-list with per-row status badges, progress bars, error messages, thumbnails, and remove buttons. Dual render-path (Shadow + Light + Angular wrapper).

> **Disambiguation:** this is the **generic multi-file** `falcon-uploader` component (`<falcon-angular-uploader>`). For the avatar / profile photo uploader (`falcon-photo-uploader`, circular preview) see the existing vault note [[Falcon Uploader]] — that note covers the org-info photo flow.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-uploader/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-uploader/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-uploader/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-uploader/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-uploader/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-uploader/DECISION.md)

## Pages using this component

- Per dossier: no production consumers observed yet (playground showcase only). Intended consumers — wizard document uploads on [[Organization Hierarchy]] Add Client / Add User flows (logos, contracts, ID copies) once migration from legacy `<falcon-photo-uploader>` happens.

## PRDs that use this component

- [[01 Account Management]] — Add Client wizard (intended document uploads).
- [[02 User Management]] — Add User wizard (intended ID-copy uploads).
- [[04 Contact Group Management]] — multi-attachment composers (intended).

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-uploader/GAPS_AND_UPGRADES.md) — production adoption gap; validation deferred (consumer drives `file.status` / `file.errorMessage`).

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-uploader`.

## Tags

#type/falcon-component #prd/01 #prd/02 #prd/04 #gap

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
