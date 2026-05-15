*** Page Learning — Templates List ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/templates-list/PAGE_LEARNING.md ***

# Templates List

> **STUB** — page discovered from PRD-05 OVERVIEW (`05-templates/OVERVIEW.md:33`). Templates list with status / commchannel / category / language / reference ID columns. Includes the Approval / Checker view as a tab. Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-05 Templates
- PRD section reference: `Brain Outputs/prd/modules/05-templates/OVERVIEW.md:33` (Main Screen #1) + `:37` (#5 Approval / Checker view)

## Primary backend service
- Templates Service (`Brain Outputs/understanding/backend/templates/`) — template list / status / Meta sync endpoints

## Expected Falcon components
- [[Falcon Data Table]] — primary list with columns (name · commchannel · category · language · reference ID · status)
- [[Falcon Filter Panel]] — commchannel · status · language · category filters
- [[Falcon Search Input]] — quick search by name
- [[Falcon Tabs]] — All / Pending / Approved / Rejected (or Checker view per role)
- [[Falcon Status Badge]] — Pending / Approved / Rejected (+ Meta-specific states for WhatsApp)
- [[Falcon Button]] — "Create Template" (per commchannel)
- [[Falcon Menu]] — row 3-dot actions (View / Edit Draft / Submit / Approve / Reject per role)
- [[Falcon Dropdown]] — Create Template entry per commchannel (WhatsApp / Voice / AI / ...)
- [[Falcon Empty State]] — no templates yet
- [[Falcon Paginator]] — pagination

## Key flows on this page
- Falcon usertypes: cannot create (BR-TM-01); may view + approve in some cases
- Client roles (AO / NA / NU): create templates if permissioned (Maker default)
- Maker: edit draft pre-submit, submit for approval
- Checker: approve / reject internally on Pending items
- Meta external lifecycle (WhatsApp): automatic state sync from Meta API
- Create Template entry shows commchannel options (WhatsApp / Voice / AI / ...)

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Templates List]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Create Template WhatsApp]] · [[Organization Hierarchy]] (sister page)
