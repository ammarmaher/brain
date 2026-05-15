*** Page Learning — Create Template (WhatsApp) ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/create-template-whatsapp/PAGE_LEARNING.md ***

# Create Template (WhatsApp)

> **STUB** — page discovered from PRD-05 OVERVIEW (`05-templates/OVERVIEW.md:35`). 2+-step wizard (Basic Info / Message Structure with preview, submit). Voice variant is TBD (out of captured PRD scope) and is NOT seeded here as a separate page. Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-05 Templates
- PRD section reference: `Brain Outputs/prd/modules/05-templates/OVERVIEW.md:35` (Main Screen #3) + `latest-prd.md:65-86` (WhatsApp wizard details)

## Primary backend service
- Templates Service (`Brain Outputs/understanding/backend/templates/`) — template create / submit-for-approval / Meta external sync

## Expected Falcon components
- [[Falcon Wizard]] — 2+ step container
- [[Falcon Stepper]] — top progress indicator
- [[Falcon Input]] — template name · reference ID
- [[Falcon Dropdown]] — commchannel (locked to WhatsApp here) · category · language
- [[Falcon Textarea]] — message body with dynamic variable insertion
- [[Falcon Dropdown]] — link Contact Group (sets variable source)
- [[Falcon Button]] — next / back / submit / cancel
- [[Falcon Card]] — preview panel (right-side or below editor)
- [[Falcon Status Badge]] — draft / pending preview
- [[Falcon Alert Dialog]] — Meta-rule validation errors

## Key flows on this page
- Step 1 — Basic Info: name · language · category · reference ID (commchannel = WhatsApp)
- Step 2 — Message Structure: body with variables, header/footer/buttons per Meta rules, live preview
- Link Contact Group → columns become template variables (BR-TM-12)
- Save draft (Maker) → resume editing later
- Submit for approval → enters Pending; Meta async approval pipeline (handled by Templates Service)
- Only Client roles with Maker permission can reach this screen (Falcon = view-only per BR-TM-01)

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Create Template WhatsApp]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Templates List]] · [[Contact Groups List]] (linked variable source) · [[Organization Hierarchy]] (sister page)
