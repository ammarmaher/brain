*** PRD Understanding - Templates - ENTITIES ***

# 05-templates - Domain Entities

> Inferred from `latest-prd.md` (captured head only) + `understanding.md` + Templates service DTO_DICTIONARY. *Italicized* fields are inferred.

| Entity | Description | Key Fields | Lifecycle Status | Relationships |
|---|---|---|---|---|
| Template | A predefined message structure for a specific CommChannel + language. | id, accountId (tenantId), name (a-z, 0-9, _; <=N chars, unique per WhatsApp Business Account+language), commChannelId, language (per Meta supported list for WhatsApp), category, subCategory?, variableType (Number\|Name), referenceId?, status, metaState?, externalRefId? (Meta template ID), createdBy, createdAt, approvedBy?, approvedAt? | Draft (Maker-only) -> Pending -> Approved / Rejected. For WhatsApp: Meta sub-states (In-Review, Active-*, Paused, Disabled, Rejected). | N:1 CommChannel; N:1 Account; 1:N TemplateVariable; 0:1 TemplateVersion chain |
| TemplateHeader | Optional template header structure. | templateId, type (Text\|Media\|Location), textContent? (<=60, 1 var), media? { kind: Image\|Video\|Document, urlOrBlob, sizeBytes }, location? | n/a | 1:1 Template |
| TemplateBody | Required template body. | templateId, content (string with `{{n}}` or `{{name}}` placeholders), variableCount (20-30) | n/a | 1:1 Template |
| TemplateFooter | Optional footer (no variables). | templateId, content (<=60) | n/a | 1:1 Template |
| TemplateButton | Optional button (max 10 per template; shape varies by category). | templateId, index, kind (QuickReply\|Url\|PhoneNumber\|Copy\|...), label, payload? | n/a | N:1 Template |
| TemplateVariable | One placeholder, possibly linked to a contact group column. | templateId, placeholder (`{{1}}` or `{{user_name}}`), contactGroupColumnName? | n/a | N:1 Template; N:0..1 ContactGroupColumn (04) |
| TemplateVersion | An immutable snapshot tied to a submit/approval cycle. | templateId, revisionNumber, body, submittedAt, approvalTrail[] | inferred | N:1 Template |
| TemplateApprovalTrail | Audit row for each approval step. | templateId, revisionNumber, actorUserId, actorRole (Maker\|Checker\|MetaSystem), action (Submit\|Approve\|Reject\|MetaUpdate), at, externalState? (Meta state), reason? | append-only | N:1 Template |
| CommChannelConfig (Templates service backend) | Per-tenant + per-channel configuration (BodyType, LevelsCount, CheckerLevels[]). | id (`tenantId + commChannelId`), tenantId, commChannelId, bodyType, levelsCount?, checkerLevels[] | n/a | 1:1 Channel-per-Tenant |
| CheckerLevel | One approval level (1..N). | levelNumber, users[] | n/a | N:1 CommChannelConfig |
| CheckerUser | A user assigned to a checker level. | userId, ... | n/a | N:1 CheckerLevel |

## Relationship summary

```
Account (01)
  ├─ CommChannelConfig × N (per channel) ─── governs ─→ Template approval flow
  │   └─ CheckerLevel × N
  │       └─ CheckerUser × N
  └─ Template × N
      ├─ TemplateHeader (0..1)
      ├─ TemplateBody (1)
      ├─ TemplateFooter (0..1)
      ├─ TemplateButton × N (max 10)
      ├─ TemplateVariable × N
      ├─ TemplateVersion × N (history)
      └─ TemplateApprovalTrail × N (audit)

Contact Group (04) ─── columns ─→ TemplateVariable.contactGroupColumnName
Meta (external) ─── webhook ─→ Template.metaState updates
```

## Status enumeration

- **Template.status** (general): `Pending`, `Approved`, `Rejected` (BR-TM-17).
- **Template.metaState** (WhatsApp): `In-Review`, `Rejected`, `Active - Quality pending`, `Active - High Quality`, `Active - Medium Quality`, `Active - Low Quality`, `Paused`, `Disabled` (BR-TM-26).
- **Template.variableType**: `Number`, `Name` (BR-TM-06).
- **TemplateHeader.type**: `Text`, `Media`, `Location`.
- **TemplateButton.kind**: `QuickReply`, `Url`, `PhoneNumber`, `Copy`, ... (full enumeration deferred to deep-sync).
- **CommChannelConfig.bodyType** (Templates service): likely Plain / Template / Interactive (verify - per DTO_DICTIONARY note).
- **TemplateApprovalTrail.action**: `Submit`, `Approve`, `Reject`, `MetaUpdate`.

## Notes on Templates service backend

The currently-built Templates microservice does **not** expose template entity CRUD endpoints (per ENDPOINT_REGISTRY: only 3 endpoints, all about CommunicationChannelConfig + UserCheckerLevels). The actual `Template` entity above is **not yet wired into a public API surface** — see GAPS.md.
