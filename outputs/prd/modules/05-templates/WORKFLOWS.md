*** PRD Understanding - Templates - WORKFLOWS ***

# 05-templates - Workflows

> Only the captured-head workflows are detailed below. Voice + post-step-2 WhatsApp + edit / versioning / Meta-update flows are TBD.

## W1: Create WhatsApp Template (Maker)

- **Trigger:** Maker (client roles with permission per BR-TM-01) opens Templates -> Create -> picks WhatsApp.
- **Source:** `latest-prd.md:65-86`; understanding.md:50-52.
- **Steps:**
  1. **Step 1 - Basic Information**: Template Name (a-z, 0-9, _; no spaces; unique per WhatsApp Business Account per language), Template Category (Authentication / Utility / Marketing), Template Sub-category (conditional on category), Template Language (one per template; Meta supported list), Reference ID (internal tracking).
  2. **Step 2 - Template Message Structure**:
     - Pick Variable Type (Number OR Name) - set ONCE per template.
     - Header (optional): Text (<=60 chars, max 1 var) OR Media (Image JPG/JPEG/PNG <=5MB, Video MP4 <=16MB, Document PDF/DOC/XLS ~10MB) OR Location. Media disables Text.
     - Linking with Contact Group (optional): map contact-group columns to variables.
     - Body (required): variables sequential from 1 (numeric) or name-style; constrained per BR-TM-07..10.
     - Template Preview & Sample: live preview with sample values + buttons + media.
     - Footer (optional): <=60 chars, no variables.
     - Buttons (optional): up to 10; QuickReply / Url / PhoneNumber / Copy / etc.
  3. **Submit** -> status = `Pending` -> internal Checker.
- **Success:** Template persisted in `Pending`.
- **Failure modes:** Validation (name format, name uniqueness, variable rules). Permission denied (Falcon usertype).

## W2: Internal Approval (Checker)

- **Trigger:** Checker opens Pending list / notification.
- **Source:** `latest-prd.md:36, 41-43`; understanding.md:53-55.
- **Steps:**
  1. Checker views template detail with preview.
  2. Checker approves OR rejects (with reason if rejected).
  3. If approved:
     - If template's CommChannel has an external approval step (WhatsApp -> Meta) -> dispatch to Meta API; status stays `Pending` (now awaiting external).
     - If no external approval -> status -> `Approved`.
  4. If rejected -> status -> `Rejected`.
- **Success:** Checker decision recorded; TemplateApprovalTrail row appended.
- **Failure modes:** External API dispatch fails (queue + retry expected; details TBD).

## W3: Meta External Approval (WhatsApp only)

- **Trigger:** Template dispatched to Meta after internal approval.
- **Source:** `latest-prd.md:44-56`; understanding.md:54-56.
- **Steps:**
  1. Meta receives template; sets initial Meta state = `In-Review`.
  2. Meta reviews (typically <=24h per BR-TM-28).
  3. Meta sends webhook / poll updates with new state (`Active - Quality pending` -> later transitions to High/Medium/Low Quality based on user feedback; or `Rejected`).
  4. Templates service maps Meta state -> general status:
     - `In-Review` -> Pending.
     - `Rejected` -> Rejected.
     - `Active-*` -> Approved (usable).
     - `Paused` / `Disabled` -> Approved (NOT usable; **runtime sender must block**).
- **Success:** Status reflects Meta decision.
- **Failure modes:** Webhook delivery failure; Meta policy change.

## W4: Auto-Approval (when no Checker configured)

- **Trigger:** Maker submits a template on a CommChannel + tenant where no approval is configured.
- **Source:** `latest-prd.md:42`; BR-TM-19; understanding.md:46.
- **Steps:**
  1. Submit.
  2. CommChannelConfig.bodyType / levels indicate no approval needed.
  3. Status -> `Approved` immediately (skip Pending).
- **Success:** Template usable instantly.
- **Failure modes:** None (handler routing).

## W5: Edit Template (TBD - partial coverage)

- **Trigger:** Maker opens template detail in draft -> Edit.
- **Source:** understanding.md:60; latest-prd.md:112.
- **Steps:** (under-defined in PRD head)
  1. If template is in Draft (pre-submit) -> direct edit.
  2. If template is Pending / Approved / Rejected -> creates a new version (revision) that enters Pending?
  3. Old version possibly keeps running until new is approved.
- **Open Q-TM-05:** Versioning semantics (in-place vs new revision) not stated.

## W6: Quality Drift (Meta runtime feedback)

- **Trigger:** Meta sends webhook updating Meta state from `Active - High Quality` -> Medium -> Low -> Paused -> Disabled.
- **Source:** `latest-prd.md:50-54`; understanding.md:56-58.
- **Steps:**
  1. Webhook arrives, Templates service updates `Template.metaState`.
  2. General status stays `Approved` until Meta state = `Paused` / `Disabled`, where runtime usage is BLOCKED at send-time (BR-TM-27).
  3. UI surfaces a banner / status pill.
- **Open Q-TM-06:** Should general status transition to a distinct "Blocked-by-Meta" state? (BR-TM-37 OPEN).

## W7: Link to Contact Group

- **Trigger:** Maker chooses "Link Contact Group" during Step 2 of W1.
- **Source:** `latest-prd.md:78`; understanding.md:82.
- **Steps:**
  1. Pick a Contact Group from the picker (scoped to creator's hierarchy).
  2. Each group column becomes available as a template variable.
  3. Mapping persists on the template.
- **Cross-reference:** 04-contact-group-management `GET /api/contact-groups` + `GetContactGroupDetailsResponse` for columns.

## W8: Preview / Sample Render

- **Trigger:** Maker / viewer expands Preview section.
- **Source:** `latest-prd.md:80`; understanding.md:43.
- **Steps:**
  1. Frontend renders Body with placeholder substitution from sample data.
  2. Media is rendered inline.
  3. Buttons are rendered with labels.
- **Open Q-TM-07:** Pure client-side render OR server endpoint? (BR-TM-35 OPEN).

## W9: Voice Template Creation (TBD - not in captured head)

- (Q-TM-04 OPEN) - flow not captured.

## W10: AI Template Creation (TBD - not in captured head)

- (Q-TM-08 OPEN) - flow not captured.
