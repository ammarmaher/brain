*** Create Template (WhatsApp) — Playbook ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Playbook

## TL;DR

2-step wizard for WhatsApp template creation per PRD-05 BR-TM-04..29. Step 1 Basic Info (name/category/subcategory/language/refId). Step 2 Message Structure (header/body/footer/buttons + live preview). Variables follow BR-TM-06..10. Async name uniqueness check. **Backend POST endpoint MISSING (GAP-T-001).** 10 OPEN BR-TM-* rules.

## Sections

1. Permissions — Maker only (Client users); Falcon CANNOT create per BR-TM-01.
2. Step 1 — Name (a-z/0-9/_) · Category × SubCategory matrix · Language · RefId.
3. Step 2 — Header (text/media/location mutex) · Body (req + var rules) · Footer (no vars) · Buttons (≤10).
4. Preview pane — live render. Client-side OR server-side OPEN.
5. Contact Group link (optional) — map variables to columns.
6. Validations — 22 V-rules.
7. Backend API — POST missing; async uniqueness missing.
8. Components — needs new `<falcon-whatsapp-preview>` + `<falcon-template-body-editor>`.
9. Kafka — proposed `templates.*` topics.
10. State — Created → PendingChecker → PendingMeta → Approved (Meta).
11. Errors — proposed FalconKeys.
12. Gaps — GAP-T-001 + 10 OPEN PRD items.

## Hubs

[[Create Template WhatsApp Flow]] · [[Templates List]] · [[Contact Groups List]] · [[05 Templates]]
