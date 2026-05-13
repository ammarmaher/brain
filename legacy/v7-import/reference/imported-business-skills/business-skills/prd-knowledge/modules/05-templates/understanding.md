# Understanding — Templates

## Module purpose

Define, approve, and govern predefined message structures used to send transactions through CommChannels. Templates are the "schema" + static content, while Contact Groups provide the data. Templates ship with a lifecycle (Pending / Approved / Rejected), a Maker/Checker governance model, and external approval for certain CommChannels (notably Meta for WhatsApp).

## Actors / users

- **Falcon usertypes** — cannot CREATE templates (per PRD statement); likely view + approve in some cases. Full role matrix deferred (not in captured head).
- **Client — Account Owner / Node Admin / Normal User** — can create templates if they have the permission. Within Maker/Checker, they occupy the Maker role by default.
- **Checker** — whoever holds the Checker permission for the account / commchannel. Role assignment not fully spelled out.
- **External authority** — Meta for WhatsApp; Voice provider for Voice; none for AI (presumably).

## Main screens

1. **Templates menu item** — list of templates with status, commchannel, category, language, reference ID.
2. **Create Template** entry — shows options per commchannel (WhatsApp, Voice, …).
3. **Wizard — WhatsApp** — 2+ steps (Basic Info, Message Structure, preview, submit).
4. **Wizard — Voice** — TBD (not in captured head).
5. **Approval / Checker view** — for reviewing Pending templates.

## Main actions

- Create (Maker).
- Edit draft (Maker, before submit).
- Submit for approval.
- Approve / Reject internally (Checker).
- External approval lifecycle (Meta for WhatsApp — automatic from API).
- Publish / Pause (implied, not fully captured).
- Link to Contact Group (sets variables source).
- Preview.

## Business rules (captured)

- **R1** Falcon usertype cannot create templates.
- **R2** One template belongs to one commchannel.
- **R3** One template is in one language; multi-language = multiple templates.
- **R4** Template name unique within WhatsApp Business Account per language; characters restricted.
- **R5** Variables can be Number or Name — set ONCE for the template.
- **R6** Variables cannot be at start or end of the template body.
- **R7** Number variables must be sequential from 1.
- **R8** Header media disables Text header (mutually exclusive).
- **R9** Body variable limit: 20–30.
- **R10** Buttons ≤ 10.
- **R11** Footer cannot contain variables.
- **R12** When approval is not configured, template auto-approves on submit.
- **R13** WhatsApp approval is a two-step gate: internal Checker → Meta. Rejection at either step → `Rejected`.

## Workflows

### Create (WhatsApp, Maker)
Templates → Create → choose WhatsApp → Step 1 Basic Info (name, category, sub-cat, language, reference ID) → Step 2 Message Structure (variable type, header, contact group link, body, preview, footer, buttons) → Submit.

### Approval (internal + external for WhatsApp)
Submit → `Pending` (awaiting internal Checker) → Checker approves → (if no external approval needed) → `Approved`; OR → (external step) → send to Meta → `Pending` until Meta decides → `Approved` or `Rejected`.

### Meta quality drift
Approved template's Meta state degrades (High → Medium → Low → Paused → Disabled). General status remains `Approved` until Meta "Paused" / "Disabled" at which point sending is blocked at runtime even though general status says Approved. Open question: should general status transition to a distinct "Blocked-by-Meta" state?

### Edit
Not fully captured — open question whether edit creates a new version entering Pending.

## Edge cases

- Template linked to a contact group that later drops a column → variable unresolvable at send time.
- Meta changes policy; template approval is retroactively revoked (Paused / Disabled).
- Two Makers try to create templates with the same name + language — second save must reject.
- Variable at start or end of body — validation must block.
- Media header uploaded above size limit — reject with specific error.
- Account owner disabled while one of their pending templates is awaiting Meta response — what happens to the template?

## Validations (consolidated)

- Name: `a-z0-9_`, no spaces, unique per WhatsApp Business Account per language.
- Language: from Meta-supported list.
- Body: variables constrained per R6/R7; 20–30 max.
- Header (Text): ≤60 chars, 1 variable.
- Header (Media): format + size per type.
- Footer: ≤60 chars, no variables.
- Buttons: ≤10.

## Dependencies

- **04-contact-group-management** — variable mapping source.
- **CommChannel module** — commchannel selection + its configuration (Template Management for that commchannel).
- **Applications** — consume templates when sending transactions.
- **Meta (WhatsApp Business API)** — external approval endpoint, quality tiers, pause/disable signals.
- **Account Management** — template configuration per commchannel per account; future: inheritance on Main node (see open questions in `root-documents/latest-prd.md`).
- **Permission module** — Maker / Checker / view roles.

## Data entities (inferred)

- `Template` { id, name, language, commChannelId, category, subCategory, variableType: number|name, header{…}, body, footer, buttons[…], referenceId, status, metaState?, externalRefId?, accountId, createdBy, createdAt, approvedBy?, approvedAt? }
- `TemplateVariable` { templateId, placeholder, contactGroupColumnName? }
- `TemplateVersion` { templateId, revisionNumber, body, submittedAt, approvalTrail[…] } — inferred; actual versioning behavior not captured.

## API expectations (implied)

- `POST /templates` — create draft.
- `POST /templates/{id}/submit` — send to Checker / Meta.
- `POST /templates/{id}/approve` or `reject` — internal Checker action.
- `GET /templates` — list with status filters.
- `GET /templates/{id}` — detail + preview.
- Webhook endpoint for Meta quality / status updates.

## Assumptions

- Preview is rendered from the same fields as the runtime send, guaranteeing WYSIWYG.
- Deleting a template is a separate action and may be blocked if in use.
- Templates cannot be shared across accounts.

## Risks / unclear areas

- Voice template creation flow not captured — open.
- Full PRD (982 lines) only partially read (~250 lines). Significant detail may remain.
- Approval role assignment (who is the Checker?) not clearly stated.
- Auto-approval when approval is not configured — scope of "not configured" unclear.
- Versioning on edit — new version vs in-place edit.
- Blocking on Meta Pause / Disable — how is send-time check implemented, and is it real-time?
- Cross-commchannel templates (Voice / AI) — creation flows not captured.

## Clarifying questions

1. Full Voice template flow — is it similar to WhatsApp minus external approval?
2. Who plays the Checker role by default — Account Owner? Falcon Operation? Configurable?
3. When a template is edited, does the old version keep running until the new one is approved?
4. How is Meta's Pause / Disable signal surfaced to the UI — webhook, poll, both?
5. What's the authoritative distinction between `Copy of Template Module`, `Template Module`, and `Template Management Module`? Which one governs which aspect?
6. Does template deletion require Checker approval, or is it a Maker-side action?
7. Can Falcon usertype view templates across all clients? The PRD says Falcon cannot CREATE; can they view/approve?
