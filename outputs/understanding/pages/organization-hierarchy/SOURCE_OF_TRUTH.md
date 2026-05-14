# Source of Truth — Organization Hierarchy

> Per Brain SK `protocols\SOURCE_OF_TRUTH_PRIORITY.md` ordering: Wiki → Backend → PRD → Code → Falcon Registries → HTML/React → Assumptions.

## Authoritative sources for this page

| Tier | Source | Path / URL | Status | Last checked |
|---|---|---|---|---|
| 1 | Architecture Wiki | `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\` | **PARTIAL** — no specific org-hierarchy doc; general Architecture Vision + Clean Architecture docs apply | 2026-05-14 |
| 2 | Backend / API truth | Identity Service + Commerce Service + Provisioning Service | **PARTIAL** — see backend-api-discovery-and-integration-plan.md | 2026-05-14 |
| 3 | PRD | _none found specific to org-hierarchy_ | **MISSING — GAP** | 2026-05-14 |
| 4 | Existing Angular code | `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page` | EXISTS — verified | 2026-05-14 |
| 5 | Falcon component registry | `C:\falcon\Brain SK\registries\FALCON_COMPONENT_REGISTRY.md` | EXISTS — seeded with 7 components | 2026-05-14 |
| 6a | HTML visual source | `C:\Falcon\Source_of_truth_theme\HTML\T2 Falcon Admin - Offline.html` | EXISTS — verified | 2026-05-14 |
| 6a | HTML live URL | `http://localhost:8765/T2%20Falcon%20Admin%20-%20Offline.html` | _verify when server up_ | — |
| 6b | React behavior source | `C:\Falcon\Source_of_truth_theme\React\Organization page` | EXISTS — verified (folder structure) | 2026-05-14 |
| 6b | React live URL | `http://localhost:5500/T2%20Falcon%20Admin.html` | _verify when server up_ | — |

## Source folders — detailed inventory

### HTML source folder
```
C:\Falcon\Source_of_truth_theme\HTML\
└── T2 Falcon Admin - Offline.html      (the offline-runnable bundle)
```
This is a runtime unpacker over a JSON manifest of the React sources.

### React source folder
```
C:\Falcon\Source_of_truth_theme\React\
└── Organization page\
    └── (admin/ subfolder per HTML §1 — to be verified by re-scan)
```
Contains the JSX + CSS files that are the actual editable source-of-truth:
- `admin/app.jsx` — main shell (315 lines)
- `admin/hierarchy.jsx` — core page (1458 lines)
- `admin/addclient.jsx` — Add Client wizard (836 lines)
- `admin/adduser.jsx` — Add User wizard (459 lines)
- `admin/userdetails.jsx` — drill-down view (478 lines)
- `admin/apps.jsx` — Apps & CommChannels tab (625 lines)
- `admin/settingstab.jsx` — Settings tab (272 lines)
- `admin/otp-verify.jsx` — OTP modal (587 lines)
- `admin/drawers.jsx` — generic drawer (64 lines)
- `admin/data.jsx` — seed data + BrandLogo (197 lines)
- `admin/i18n.jsx` — EN+AR strings (936 lines)
- `admin/styles.css` — tokens + every component (3579 lines)
- `admin/addclient.css`, `settingstab.css`, `otp-verify.css`, `comm-mkt.css` — feature CSS

### Angular destination folder
```
C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\
├── components\          (presentation components)
├── models\              (interfaces, types)
├── services\            (HierarchyPageStateService)
└── org-hierarchy-page.routes.ts
```

## Reports ingested as starting evidence (2026-05-14)

| Report | Lines | Role |
|---|---|---|
| `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\01-html-source-discovery.md` | 1057 | HTML/React structural truth, 23 sections covering chrome → tree → tabs → tables → wizards → OTP → chart |
| `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\02-react-source-discovery.md` | (read in summary) | React behavior + component-structure |
| `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\05-component-knowledge-check.md` | (read in summary) | Per-Falcon-component capability scan |
| `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\visual-parity-report.md` | 124 | Wave 17 sweep blocked on browser; manual procedure documented |
| `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\gaps-and-next-actions.md` | 71 | 7 library upgrades + 4 open items + 23 a11y lint baseline |

Plus the component-level log: `Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\component-knowledge-log.md` (488 lines, 18 sections — pre-existing).

## Verification policy

Per Ammar's directive 2026-05-14: ingested reports are evidence, NOT trusted blindly. Every rule must be re-verified against:
1. Live source HTML at the server URL
2. Live React reference at the server URL
3. Current Angular implementation
4. Current Falcon component registry (`FALCON_COMPONENT_REGISTRY.md`)
5. Current backend/API knowledge (where applicable)
6. Current wiki/PRD (if available)

Until a rule is re-verified, its status is `unknown` in the rule taxonomy.

## Source-of-truth conflicts found in prior reports

| # | Conflict | Source A | Source B | Resolution policy |
|---|---|---|---|---|
| 1 | OTP accept rule | Task spec: all-zeros pass | React code: only `'150999'` rejected | Honor Brain SK task spec (all-zeros pass); flag discrepancy |
| 2 | Tab order spec | Task spec mentioned "Apps & Services, CommChannels & Services" | Source order is "Hierarchy, CommChannels, Apps&Services, Settings" | Use source order |
| 3 | Filter/Search visibility | Task spec implies always visible | Source: only on root node | Use source — root-only |

## Open questions for Ammar (relating to source of truth itself)

- Is there a Confluence/SharePoint PRD for org-hierarchy that we should add as Tier 3? Mark MISSING/GAP if no.
- Should Wiki tier escalate to BLOCKING for any architectural-class decisions? Current policy: warn but proceed.
