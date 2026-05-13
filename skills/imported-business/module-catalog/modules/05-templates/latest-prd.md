# Latest PRD — Templates

| Field | Value |
|---|---|
| Drive folder | `5- Templates` |
| Selected PRD file | `Copy of Template Module` |
| Detected version | `unknown` |
| Mime type | Google Doc |
| Modified | 2026-04-23 |
| Size | 448 KB (982 lines text export) |
| Sync date | 2026-04-24 |
| Selection reason | User explicitly chose this file among 3 unknown-version candidates (per skill rule for multiple-unknown PRDs). |

## Ignored duplicates

- `Template Module` — unknown version, older, 30 KB.
- `Template Management Module` — unknown version, older, 9 KB.

Both retained in Drive; neither used as source for this sync.

## Summary

A Template is a predefined message structure used by Applications or Users to send messages via CommChannels (WhatsApp, Voice, AI, …). Templates may include static content + dynamic variables. Each template belongs to ONE CommChannel and may need approval. The PRD introduces Maker/Checker governance, a general template status lifecycle (Pending / Approved / Rejected) with CommChannel-specific mappings (especially Meta for WhatsApp), and a step-based creation wizard per CommChannel.

## Main requirements

### CommChannel template types (captured)

- **WhatsApp** — structured, approval-based; Meta approval workflow with granular statuses.
- **Voice** — IVR-style predefined messages for campaigns / transactional calls.
(Other CommChannels likely covered later in the full document.)

### Maker / Checker governance

- **Maker** — creates / edits template and submits.
- **Checker** — reviews, internal approves / rejects.

### General template statuses

- **Pending** — submitted, awaiting Checker OR awaiting external (Meta) approval.
- **Approved** — Checker-approved; if external approval needed, also externally approved. If no approval configured, auto-approved on submit.
- **Rejected** — rejected internally OR rejected externally.

### WhatsApp status mapping to Meta states

| Meta state | General status | Meaning |
|---|---|---|
| In-Review | Pending | Under Meta review (≤ 24h) |
| Rejected | Rejected | Failed Meta policy |
| Active - Quality pending | Approved | No quality feedback yet; usable |
| Active - High Quality | Approved | Good feedback; usable |
| Active - Medium Quality | Approved | Mixed; usable but at risk |
| Active - Low Quality | Approved | Negative feedback; usable but in danger |
| Paused | Approved | Paused by Meta due to feedback; NOT usable |
| Disabled | Approved | Disabled by Meta; NOT usable |

The "Paused" / "Disabled" ambiguity — they map to `Approved` (general) but are not usable. Flagged as open question.

### WhatsApp template categories (Meta)

- **Authentication** — OTP, login codes. Sub-category: `One-time Passcode`.
- **Utility** — transactional (orders, shipping, payments, alerts). Sub-categories: `Default`, `Flows`, `Calling permissions request`.
- **Marketing** — promotional. Sub-categories: `Default`, `Catalog`, `Flows`, `Calling permissions request`. Must comply with Meta marketing policies; recipients must opt-in.

### WhatsApp Create Template — wizard

**Step 1 — Basic Information**
- Template Name (unique within WhatsApp Business Account PER language; lowercase letters + numbers + underscores; no spaces).
- Template Category (Authentication / Utility / Marketing) + sub-category (conditional).
- Template Language (from Meta supported list; one language per template; multi-language = multiple templates).
- Reference ID (user-defined internal tracking).

**Step 2 — Template Message Structure**

- **Variable type** — `Number` (`{{1}}`, `{{2}}`, …) OR `Name` (`{{user_name}}`). Set once for the template.
- **Header** (optional) — one of: Text (≤60 chars, 1 var), Media (Image JPG/JPEG/PNG ≤5MB, Video MP4 ≤16MB, Document PDF/DOC/XLS ~10MB), Location. Media disables Text.
- **Linking with Contact Group** (optional) — maps contact group columns to template variables (cross-reference `04-contact-group-management`).
- **Body** (required) — variables must be sequential from 1 (for numeric), must not be at start/end, must be within meaningful text. Name-type variables lowercase + underscores + digits, double curly braces. Limit: 20–30 variables.
- **Template Preview & Sample** — live preview with sample values, media rendering, button display.
- **Footer** (optional) — ≤60 chars, no variables.
- **Buttons** (optional) — up to 10 total; shape varies by category. Quick Reply custom labels supported.

### Voice templates
Covered later in the document (beyond the captured 250 lines).

## Validations (captured)

- Template name unique per WhatsApp Business Account + per language.
- Allowed characters in name: `a-z`, `0-9`, `_`. No spaces.
- Body must contain at least one meaningful line; variables constrained per rules above.
- Text Header ≤ 60 chars, 1 variable max.
- Footer ≤ 60 chars, no variables.
- Media size limits per type.
- Max 10 buttons.

## Dependencies

- **Contact Group Management** (`04-contact-group-management`) — Contact group columns become template variables when linked.
- **CommChannel module** — each template belongs to ONE commchannel.
- **Applications** — may invoke templates to send transactions.
- **Meta API** — external approval for WhatsApp.
- **Permission module** — who can create / approve.
- **Account Management** — template configuration per commchannel per account ("Template configuration is currently per commchannel in template management for the account; later maybe per Main node inherited to sub-nodes" — see `root-documents/latest-prd.md` open items).

## Open questions

- Voice template creation / submission details — in sections beyond the captured head.
- Full list of CommChannel-specific template configurations (Service category, Quality tiers, body limits).
- Behavior when Meta pauses / disables a template that's already being used by a live campaign.
- Approval workflow details — who is the Checker by role? Account Owner? Falcon Operation?
- Auto-approval configuration — per account, per commchannel, per category?
- Template revision — when editing, does a new version enter Pending? Does the old one keep running?
- Language addition — creating an Arabic version of an English template — workflow details.
- Preview system — is it a pure client-side render, or does it call a server endpoint?
- "Copy of Template Module" and the other two Unknown-version files have unclear authoritative boundaries — full doc comparison + user confirmation recommended.
