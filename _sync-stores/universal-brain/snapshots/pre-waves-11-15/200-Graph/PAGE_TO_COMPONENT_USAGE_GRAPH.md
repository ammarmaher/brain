---
type: graph-cluster
title: Page → Component Usage Graph
created: 2026-05-27
wave-introduced: 1
expanded-in-wave: 3
node-type-from: Page
node-type-to: Component
up: "[[00_START_HERE]]"
parent-moc: "[[../00-MOCs/Pages]]"
tags: [graph, pages, components, usage]
---

# Page → Component Usage Graph

> [!summary]
> 14 canonical pages (per agent inventory) × N components used per page. Wave 1 seeds the 14 Page nodes + module assignments. Wave 3 expands `USES_COMPONENT` edges to every page→component pairing using each page dossier's `09-COMPONENTS.md` file.

## Page nodes (Wave 1 seed)

| # | Graph ID | Wikilink | Canonical dossier path | Module (Wave 1 inferred) |
|---:|---|---|---|---|
| 1 | `page:add-contract` | [[../20-Pages/add-contract]] (TBD) | `understanding/pages/add-contract/` | contract-charging-billing |
| 2 | `page:change-password` | [[../20-Pages/change-password]] (TBD) | `understanding/pages/change-password/` | user-mgmt |
| 3 | `page:contact-groups-list` | [[../20-Pages/contact-groups-list]] (TBD) | `understanding/pages/contact-groups-list/` | contact-group-mgmt |
| 4 | `page:contracts-list` | [[../20-Pages/contracts-list]] (TBD) | `understanding/pages/contracts-list/` | contract-charging-billing |
| 5 | `page:create-contact-group` | [[../20-Pages/create-contact-group]] (TBD) | `understanding/pages/create-contact-group/` | contact-group-mgmt |
| 6 | `page:create-template-whatsapp` | [[../20-Pages/create-template-whatsapp]] (TBD) | `understanding/pages/create-template-whatsapp/` | templates |
| 7 | `page:edit-contract` | [[../20-Pages/edit-contract]] (TBD) | `understanding/pages/edit-contract/` | contract-charging-billing |
| 8 | `page:edit-user` | [[../20-Pages/edit-user]] (TBD) | `understanding/pages/edit-user/` | user-mgmt |
| 9 | `page:forgot-password` | [[../20-Pages/forgot-password]] (TBD) | `understanding/pages/forgot-password/` | identity (root-documents) |
| 10 | `page:login` | [[../20-Pages/login]] (TBD) | `understanding/pages/login/` | identity (root-documents) |
| 11 | `page:my-profile` | [[../20-Pages/my-profile]] (TBD) | `understanding/pages/my-profile/` | user-mgmt |
| 12 | `page:organization-hierarchy` | [[../20-Pages/Organization-Hierarchy]] | `understanding/pages/organization-hierarchy/` (**25 files — largest**) | account-mgmt |
| 13 | `page:templates-list` | [[../20-Pages/templates-list]] (TBD) | `understanding/pages/templates-list/` | templates |
| 14 | `page:wallets-and-balance-management` | [[../20-Pages/wallets-and-balance-management]] (TBD) | `understanding/pages/wallets-and-balance-management/` | contract-charging-billing |

> [!info]
> Wikilinks marked `(TBD)` mean the projection file may not yet exist in `20-Pages/`; the canonical dossier path is always populated. The agent confirmed `20-Pages/` has 14 files but with mixed naming (e.g., `Organization-Hierarchy.md` + several `*-Night-Shift-2026-05-16.md` event files). Wave 3 reconciles the wikilink slugs against the on-disk filenames.

## Module → Page (IN_MODULE edges, Wave 1)

| Module ID | Pages |
|---|---|
| `mod:account-mgmt` | organization-hierarchy |
| `mod:user-mgmt` | edit-user, my-profile, change-password |
| `mod:contract-charging-billing` | add-contract, edit-contract, contracts-list, wallets-and-balance-management |
| `mod:contact-group-mgmt` | create-contact-group, contact-groups-list |
| `mod:templates` | create-template-whatsapp, templates-list |
| `mod:root-documents` (identity / auth) | login, forgot-password |

That's 14 IN_MODULE edges confirmed in Wave 1.

## Wave 1 sample page → components evidence

From [VAULT] `20-Pages/Organization-Hierarchy.md` frontmatter (read by agent):

```yaml
components:
  - "[[30-Components/falcon-data-table]]"
  - "[[30-Components/falcon-input]]"
  - ...
```

That's a direct evidence path for `USES_COMPONENT` edges. Wave 3 will:
1. Read every page's projection frontmatter `components:` array
2. Read every page's canonical `09-COMPONENTS.md` (more authoritative)
3. Emit one `USES_COMPONENT` edge per pairing
4. Reconcile any disagreement → emit `Conflict` node

## Estimated Wave 3 edge count

Avg ~25 components per page × 14 pages = **~350 USES_COMPONENT edges** expected after Wave 3.

## See also

- [[COMPONENT_REGISTRY_GRAPH]] — the destination components
- [[API_BUSINESS_ARCHITECTURE_GRAPH]] — the API side these pages call
- [[../00-MOCs/Pages]] — vault MOC
