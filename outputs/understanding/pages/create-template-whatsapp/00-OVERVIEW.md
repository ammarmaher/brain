*** Create Template (WhatsApp) — Overview ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Overview

> 2-step wizard for authoring WhatsApp templates per PRD-05 BR-TM-* rules. Maker submits, Checker approves, Meta auto-approves. **Backend POST endpoint MISSING (GAP-T-001).**

## Source-of-truth

- [PRD] PRD-05 BUSINESS_RULES · BR-TM-04..16 (template structure) + BR-TM-21..29 (Maker/Checker/Meta)
- [PRD] PRD-05 ENTITIES · `Brain Outputs/prd/modules/05-templates/ENTITIES.md`
- [BRAIN-OUT] Templates backend dossier (NO POST endpoint today)

## Trigger / entry

- **Page:** Templates List → "+ Create Template" → channel picker → WhatsApp
- **Modal/page:** Full-screen wizard or dialog (TBD)
- **Precondition:** WhatsApp channel visible for account · user has `FalconAccess.templates.create('WHATSAPP')` PES

## The 2 steps

| Step | Title | Detail |
|---|---|---|
| 1 | Basic Info | Name · Category · Language · Reference ID (optional) |
| 2 | Message Structure | Header · Body (required) · Variables · Footer · Buttons + Preview |

[PRD] latest-prd.md:65-86.

## Submit

Single POST on Finish:

```
POST /api/templates (when endpoint exists)
Body: CreateTemplateRequest {
  channel: 'WHATSAPP',
  name: '...',                     // a-z, 0-9, _ only
  category: 'AUTHENTICATION' | 'UTILITY' | 'MARKETING',
  subCategory: 'OneTimePasscode' | 'Default' | 'Flows' | ...,
  language: 'en' | 'ar',
  referenceId: '...',
  header: { type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LOCATION' | null, content: ... } | null,
  body: { content: '...', variableType: 'Number' | 'Name', variables: [...] },
  footer: { content: '...' } | null,
  buttons: [...],
  contactGroupLink: { contactGroupId, columnMapping } | null,
}
Response: ServiceOperationResult<CreateTemplateResponse> { templateId, status: 'Draft' }
```

## State sequence

```
[Click Finish] → POST /api/templates (status=Draft)
   │
   ▼
[User in Templates List clicks Submit] → POST /api/templates/{id}/submit
   │
   ▼
status = PendingChecker
   │
   ▼ (Checker reviews internally)
   ├─ approve → POST /api/templates/{id}/approve → status = PendingMeta
   │     │
   │     ▼ (Meta auto-submits via API)
   │     ├─ Meta approves → webhook → status = Approved
   │     └─ Meta rejects → webhook → status = Rejected (Meta)
   └─ reject → POST /api/templates/{id}/reject → status = Rejected (internal)
```

## Cross-flow deps

- [[Templates List]] — parent (lists all templates after create).
- [[Contact Groups List]] — provides column source for variable mapping (BR-TM-12).
- External: Meta WhatsApp Business API.

## See also

- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md) · [03-STEP_2_MESSAGE_STRUCTURE](03-STEP_2_MESSAGE_STRUCTURE.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
