*** Create Template (WhatsApp) — Gaps & drifts ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Gaps & Drifts

## CRITICAL: GAP-T-001

Same as parent — backend POST endpoint missing.

## Open PRD rules (BR-TM-30..39)

10 OPEN items in PRD-05 that affect Create Template:

| ID | Item | Impact |
|---|---|---|
| BR-TM-30 | Voice template flow undocumented | Voice wizard pending |
| BR-TM-31 | Checker assignment unclear | Q-TM-CHECKER-ROLE |
| BR-TM-32 | Auto-approval scope unclear | Q-TM-AUTO-APPROVAL-SCOPE |
| BR-TM-33 | Edit semantics — does editing approved template create a new version? | Q-TM-EDIT-VERSIONING |
| BR-TM-34 | Language addition workflow (create ar version of en) | Q-TM-LANGUAGE-CLONE |
| BR-TM-35 | Preview: client-side render OR server endpoint? | Q-TM-PREVIEW-RENDER |
| BR-TM-36 | Module boundary disambiguation (multiple "Template Module" terms) | Q-TM-MODULE-NAMES |
| BR-TM-37 | "Paused/Disabled at Meta" → distinct state? | Q-TM-PAUSED-STATE |
| BR-TM-38 | Template deletion — Checker approval required? | Q-TM-DELETE-APPROVAL |
| BR-TM-39 | Falcon view scope of all-tenants templates | Q-TM-FALCON-VIEW-SCOPE |

## High-severity gaps

### GAP-CT-WHATSAPP-PREVIEW — `<falcon-whatsapp-preview>` doesn't exist

Need to build this Falcon UI Core component. Renders WhatsApp-style message with header/body/footer/buttons.

### GAP-CT-WHATSAPP-VARIABLE-EDITOR — Complex variable-aware textarea

Body editor needs:
- Highlight variables in different color
- Tab-complete to known variables (when contact group linked)
- Catch start/end position violations
- Validate sequence for numeric type

Need a custom `<falcon-template-body-editor>` component or rich-text editor wrapping.

### GAP-CT-WHATSAPP-MEDIA-UPLOAD — Upload + preview thumbnail

Use `<falcon-uploader>` but need preview thumbnail for image/video/document. Document preview is non-trivial (PDF.js or similar).

## See also

- [README](README.md) · [08-BACKEND_API](08-BACKEND_API.md) · [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
