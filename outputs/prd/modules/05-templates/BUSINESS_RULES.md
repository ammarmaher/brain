*** PRD Understanding - Templates - BUSINESS_RULES ***

# 05-templates - Business Rules

> Citations point at `Brain SK\skills\imported-business\prd-knowledge\modules\05-templates\latest-prd.md` unless otherwise noted.
> NOTE: Only ~250 lines of the 982-line PRD were captured in the sync. Many rules below are extracted from the captured head; deeper details are flagged as OPEN.

## Identity & Ownership

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-TM-01 | Falcon usertype **cannot create** templates. | understanding.md:11; latest-prd.md (per `R1`) | [CONFIRMED] |
| BR-TM-02 | A template belongs to **one** CommChannel. | latest-prd.md:99; understanding.md:36 | [CONFIRMED] |
| BR-TM-03 | A template is in **one** language. Multi-language coverage = multiple templates. | latest-prd.md:70; understanding.md:37 | [CONFIRMED] |
| BR-TM-04 | Template Name is unique within the WhatsApp Business Account per language. | latest-prd.md:68-69 | [CONFIRMED] |
| BR-TM-05 | Allowed characters in template name: `a-z`, `0-9`, `_`. No spaces, no uppercase. | latest-prd.md:69; understanding.md:74 | [CONFIRMED] |

## Variable Rules

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-TM-06 | Variable type is `Number` (`{{1}}, {{2}}, ...`) OR `Name` (`{{user_name}}`). Set ONCE for the template. | latest-prd.md:75; understanding.md:38 | [CONFIRMED] |
| BR-TM-07 | Variables cannot be at the **start** or **end** of the template body; they must be within meaningful text. | latest-prd.md:78; understanding.md:39 | [CONFIRMED] |
| BR-TM-08 | Numeric variables must be sequential from 1. | latest-prd.md:78; understanding.md:40 | [CONFIRMED] |
| BR-TM-09 | Name-type variables use lowercase + underscores + digits, double curly braces. | latest-prd.md:78 | [CONFIRMED] |
| BR-TM-10 | Body variable count: 20-30 limit. | latest-prd.md:78; understanding.md:43 | [CONFIRMED] |

## Header / Body / Footer / Buttons

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-TM-11 | Header (optional): one of Text (<=60 chars, 1 var), Media (Image JPG/JPEG/PNG <=5MB, Video MP4 <=16MB, Document PDF/DOC/XLS ~10MB), or Location. **Media disables Text** (mutually exclusive). | latest-prd.md:76; understanding.md:41 | [CONFIRMED] |
| BR-TM-12 | Linking with Contact Group (optional): maps contact group columns to template variables. | latest-prd.md:78 | [CONFIRMED] |
| BR-TM-13 | Body is **required**; variables constrained per BR-TM-07..10. | latest-prd.md:78 | [CONFIRMED] |
| BR-TM-14 | Template Preview & Sample: live preview with sample values, media rendering, button display. | latest-prd.md:80 | [CONFIRMED] |
| BR-TM-15 | Footer (optional): <=60 chars, **no variables**. | latest-prd.md:82; understanding.md:42 | [CONFIRMED] |
| BR-TM-16 | Buttons (optional): up to 10 total; shape varies by category. Quick Reply custom labels supported. | latest-prd.md:84; understanding.md:43 | [CONFIRMED] |

## Statuses & Approval

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-TM-17 | General template statuses: Pending / Approved / Rejected. | latest-prd.md:39-43 | [CONFIRMED] |
| BR-TM-18 | Pending = submitted, awaiting internal Checker OR external (Meta) approval. | latest-prd.md:41 | [CONFIRMED] |
| BR-TM-19 | Approved = Checker-approved; if external approval needed, also externally approved. If no approval is configured, auto-approved on submit. | latest-prd.md:42; understanding.md:45-46 | [CONFIRMED] |
| BR-TM-20 | Rejected = rejected internally OR rejected externally. | latest-prd.md:43; understanding.md:47 | [CONFIRMED] |

## Maker / Checker Governance

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-TM-21 | Maker creates / edits template and submits. | latest-prd.md:35; understanding.md:13 | [CONFIRMED] |
| BR-TM-22 | Checker reviews, internally approves or rejects. | latest-prd.md:36; understanding.md:14 | [CONFIRMED] |
| BR-TM-23 | WhatsApp approval is a TWO-STEP gate: internal Checker -> Meta. Rejection at either step -> Rejected. | understanding.md:47 | [CONFIRMED] |

## WhatsApp Categories & Meta States

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-TM-24 | WhatsApp categories: Authentication (sub: One-time Passcode); Utility (sub: Default, Flows, Calling permissions request); Marketing (sub: Default, Catalog, Flows, Calling permissions request). | latest-prd.md:61-63 | [CONFIRMED] |
| BR-TM-25 | Marketing templates must comply with Meta marketing policies; recipients must opt-in. | latest-prd.md:63 | [CONFIRMED] |
| BR-TM-26 | Meta state -> General status mapping: In-Review -> Pending; Rejected -> Rejected; Active-Quality-pending / High / Medium / Low -> Approved (usable); Paused / Disabled -> Approved (NOT usable). | latest-prd.md:46-56 | [CONFIRMED] |
| BR-TM-27 | Paused / Disabled templates: general status stays Approved, but sending is BLOCKED at runtime. | latest-prd.md:53-54 | [CONFIRMED] |
| BR-TM-28 | Approval review at Meta typically takes <=24h. | latest-prd.md:48 | [CONFIRMED] |
| BR-TM-29 | Quality tiers (High / Medium / Low) reflect Meta feedback; Low Quality is "in danger" but still usable. | latest-prd.md:51-52 | [CONFIRMED] |

## Open / Unstated

| # | Rule | Citation | Tag |
|---|---|---|---|
| BR-TM-30 | Voice template creation flow - not captured in the synced head. | understanding.md:114 | [OPEN] |
| BR-TM-31 | Approval role assignment (who is the Checker by default?) - not in captured head. | understanding.md:116, 125 | [OPEN] |
| BR-TM-32 | Auto-approval configuration scope - per account? per commchannel? per category? - silent. | understanding.md:117, 125 | [OPEN] |
| BR-TM-33 | Edit semantics - does editing create a new version that enters Pending? Does the old run while the new awaits approval? | latest-prd.md:112; understanding.md:60, 118 | [OPEN] |
| BR-TM-34 | Language addition workflow (e.g. creating Arabic version of an English template). | latest-prd.md:113 | [OPEN] |
| BR-TM-35 | Preview is client-side render OR a server endpoint? | latest-prd.md:114 | [OPEN] |
| BR-TM-36 | Disambiguation between `Copy of Template Module`, `Template Module`, `Template Management Module` - authoritative boundaries. | latest-prd.md:115; attachments.md:7 | [OPEN] |
| BR-TM-37 | "Paused / Disabled at Meta" -> should the general status transition to a distinct "Blocked-by-Meta" state? | understanding.md:58 | [OPEN] |
| BR-TM-38 | Template deletion - does it require Checker approval, or is it Maker-side? | understanding.md:129 | [OPEN] |
| BR-TM-39 | Falcon usertype view of all-clients templates - allowed? PRD says they cannot CREATE but doesn't define view scope. | understanding.md:130 | [OPEN] |
| BR-TM-40 | Template configuration inheritance from Main node to sub-nodes with override - root-documents backlog item. | root-documents/latest-prd.md:28; understanding.md:88 | [OPEN] |
| BR-TM-41 | Service category for WhatsApp is **tentative** in 03 (BR-CC-23). Affects Templates that use it. | 03 latest-prd.md:101 | [OPEN] |
