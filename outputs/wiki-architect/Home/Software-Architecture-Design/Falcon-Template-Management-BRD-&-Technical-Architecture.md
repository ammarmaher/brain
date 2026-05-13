# Falcon Template Management — BRD + Technical Architecture

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Falcon-Template-Management-BRD-&-Technical-Architecture.md`
**Length:** 4751 lines · **Headings:** 178
**Last wiki HEAD seen:** `0d0cb311…` (newest doc in the wiki — committed in HEAD)

## Purpose

Two-part document combining a **BRD** for WhatsApp/Meta message template management and a **technical HLD/LLD** for the **Template Management Service** that owns templates, an **Internal Approval Workflow Engine** (two-tier sequential, any-to-approve), a **Meta Template Adapter** for Meta WhatsApp Business API integration, a **Meta Webhook Handler** for status changes, a **Template Validation Engine** with versioned rule snapshots and feature flags, and a **Template Preview Engine** for WhatsApp-style preview rendering. Scope is explicitly **WhatsApp only** — Voice/IVR/SMS/RCS templates are out of scope. The 178 headings cover end-to-end design at LLD-fidelity for the Meta adapter, validation rules, preview, Flow Forms handling, credential resolution, etc.

## Key rules / decisions (summary only — see source for full LLD)

### §3 Scope (`…md:25-46`)

**In scope:** WhatsApp template creation, Marketing/Utility/Authentication categories, header/body/footer/buttons, validation + preview, Meta submission, status sync, sync from Meta, Flow buttons, optional two-tier sequential approval.

**Out of scope:** Role-based access details (delegated to Access Control), Voice/IVR, voice library, SMS/RCS/email/push, campaign execution, charging, opt-in management, contact-group ingestion, delivery reports.

### §7 High-Level Business Process (`…md:78-99`)

14 steps from user creates template → Meta-final-status. Critical phases:
- Internal approval (if configured) — two tiers, any-to-approve, sequential.
- Meta submission only after final internal approval (or auto-approved if no approval configured).
- Meta status sync via webhook + periodic sync.

### §8 Functional Requirements (FR-001 to FR-030) (`…md:100-134`)

30 FRs covering create, draft, submit, internal approval, category-driven UI, name validation, language, variables, buttons, preview, authentication templates, Flow buttons, status sync, edit/delete, audit history.

### §9 Wizard structure (`…md:135-241`)

**Step 1 — Basic Information:** WABA, Template Name (lowercase letters/numbers/underscores, 1-215 chars), Language, Reference ID (optional), Category, Sub-Category.

**Step 2 — Message Structure:** Headers (text/image/video/document/location), Body (1-1024 chars), Footer (60 chars max, no variables), Buttons (max 10).

**Step 3 — Save / Submit / Internal Approval:**
- No internal approval → submit to Meta immediately.
- Internal approval required → Level 1 → optional Level 2 → submit to Meta.

### §10 Template Status Model (`…md:243-383`)

**Falcon Normalized Statuses:** Pending Internal | Internally Approved | Submitted To Meta | Approved | Rejected | Restricted | Deleted | Unsupported | Sync Failed.

**Internal Approval Statuses:** Pending Level 1 | Pending Level 2 | Internally Approved | Rejected Level 1 | Rejected Level 2.

**Display status** = simplified for UI; **Raw Meta Status** kept for traceability; **Approval Status** for internal workflow; **Sendability Status** used by Messaging/Campaign services to gate sending.

### §12-§14 Editing/Deletion + Internal Approval + Meta Sync (`…md:419-477`)

- Editability depends on **current Falcon status** AND **Meta lifecycle rules**.
- Internal Approval workflow: configurable per-tenant, **two-tier sequential with any-to-approve logic**; first valid decision at the active level is accepted.
- Meta synchronization required for Meta-side changes (paused, disabled, deleted, quality update).

### §21 Technical Architecture (`…md:572-end`)

#### §21.3.1 Template Management Service (`…md:658-678`)

Core service for template CRUD, draft persistence, internal approval state, Meta interaction orchestration.

#### §21.3.2 Internal Approval Workflow Engine (`…md:679-870`)

State machine engine. Reviewers identified externally (Access Control / config). Workflow handles `Pending Level 1 → Pending Level 2 → Internally Approved` (or rejection routes). Concurrent decisions at the active level: first wins; others marked "ignored".

#### §21.3.3 Meta Template Adapter (`…md:871-1915`) — extensive LLD

- Adapter implements the Meta WhatsApp Business API contract.
- Versioned API usage matrix (creation, edit, delete, fetch, status sync, media upload, Flows).
- Credential resolution per WABA/account.
- Resilience: retry, circuit-break, idempotency keys, dead-letter for Meta-rejected payloads.

#### §21.3.4 Meta Webhook Handler (`…md:2352-2388`)

Receives Meta status change events. Validates signature. Maps to normalized statuses. Updates Falcon template state. Publishes events to Kafka.

#### §21.3.5 Template Validation Engine (`…md:2389-2794`)

Two-tier architecture:
- `TemplateValidationEngine` (entry point).
- `ValidationOrchestrator` invokes a **Rule Registry** by category.
- Rules use a `TemplateValidationContext` containing `TenantId, AccountId, WabaId, Template, ExistingTemplateNameLanguageKeys, SupportedLanguages, MetaRuleSnapshot, FeatureFlags`.
- `WhatsAppTemplateRuleSnapshot` — versioned rule values (name min/max, body length, button limits, OTP rules). Version stamped so debug across Meta rule changes is possible.
- `FeatureFlags` — runtime switches (`marketingFlows, utilityFlows, catalogTemplates, oneTapAuth, zeroTapAuth, copyOfferCode, approvedTemplateEditing`).
- 25+ rule examples enumerated: `NameFormatRule, NameLengthRule, NameUniquenessPerLanguageRule, LanguageSupportedRule, CategorySupportedRule, ReferenceIdLengthRule, BodyRequiredRule, BodyLengthRule, VariableSyntaxRule, VariableSequentialNumberRule, VariableSampleRequiredRule, HeaderTypeAllowedRule, TextHeaderLengthRule, MediaHeaderTypeRule, MediaHeaderSizeRule, FooterLengthRule, ButtonCountRule, ButtonLabelLengthRule, ButtonLabelUniquenessRule, WebsiteUrlFormatRule, DynamicUrlSampleRequiredRule, PhoneNumberFormatRule, AuthenticationOtpRule, FlowButtonAllowedRule, FlowExistsAndPublishedRule, TemplateEditabilityRule`.

**Crucial design rule** (`…md:2715-2718`): **"Backend validation is authoritative. Angular validation is for user experience only. Angular should not duplicate the full validation engine."**

Frontend uses a metadata API (`GET /api/templates/whatsapp/validation-metadata`) to drive UI hints without duplicating logic.

#### §21.3.6 Template Preview Engine (`…md:2795-end`)

Renders WhatsApp-style preview. Includes Flow Forms preview strategy. LLD for the preview routing + the Flow Forms LLD (substantial — covers form-state, preview state machine, message bubble UI).

## Diagrams / images referenced

Document is text/code-block-heavy. Specific images not enumerated in the read sample but include C2 container diagrams, preview mockups, and Flow form previews in the `.attachments/` folder.

## Cross-references

- Authorization deferred to `Permissions-&-Authorization-Module-…md` (PBAC).
- Messaging/Campaign services use the **Sendability Status** computed by this module.
- Account-aware: WABA selection scope depends on `Account-Management-Module.md` node structure.

## Implications for code

**Code location:** `C:\Falcon\Falcon\falcon-core-templates-svc\src\Falcon.Templates.*`.

**Verified against code (per fallback):**
- Layered structure (Api, Application, Contracts, Domain, Infrastructure) ✓.
- FastEndpoints endpoint style (`…\Falcon.Templates.Api\Endpoints\CommunicationChannelConfigs\*Endpoint.cs`) — wiki silent on style choice. ✓ noted.
- Kafka consumers (`CommChannelInit / CommChannelVisibilityChanged / UserCheckerAssigned / UserCheckerAssignmentsUpdated` per fallback §2.2).
- MongoDB DB name `FalconTemplateDb` — PascalCase drift from wiki-prescribed `falcon_core_templates_db`.

**Major implementation gaps (likely):**
1. **Internal Approval Workflow Engine** — wiki §21.3.2 prescribes the engine. Verify code has approval-level entities + state machine.
2. **Meta Template Adapter** — wiki §21.3.3 is the largest single LLD block. Verify code has adapter package + Meta API client.
3. **Meta Webhook Handler** — endpoint expected; signature validation; status mapping.
4. **Template Validation Engine** — wiki §21.3.5 is fully designed. Code must have `ITemplateValidationEngine` + rule registry + 25+ rules.
5. **Versioned `WhatsAppTemplateRuleSnapshot`** with feature-flag awareness.
6. **`/api/templates/whatsapp/validation-metadata`** endpoint for frontend hints.
7. **Template Preview Engine + Flow Forms** — wiki §21.3.6.

**Open items per wiki §20 (Open Questions):** see source — these are EXPLICITLY UNRESOLVED and should not be treated as decisions.
