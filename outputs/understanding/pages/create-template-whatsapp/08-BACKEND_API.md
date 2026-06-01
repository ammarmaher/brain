*** Create Template (WhatsApp) — Backend API ***
*** GAP-T-001 · 2026-05-18 ***

# Create Template (WhatsApp) — Backend API

> **Endpoint MISSING per GAP-T-001.** Below is what SHOULD exist.

## Endpoints needed

| Method | Path | Phase | Status |
|---|---|---|---|
| GET | `/api/templates/name-available?accountId=&channel=WHATSAPP&name=&language=` | Async uniqueness | **MISSING** |
| GET | `/api/contact-groups?ownerId={accId}` | Optional Contact Group linking | EXISTS (per contact-group dossier) |
| GET | `/api/contact-groups/{cgId}` | Get columns of selected CG | EXISTS |
| **POST** | **`/api/templates`** | **Create draft** | **MISSING** |

## Request shape — `CreateTemplateRequest`

```jsonc
{
  "channel": "WHATSAPP",
  "accountId": "<acc-id>",
  "name": "order_confirmation",
  "category": "UTILITY",
  "subCategory": "Default",
  "language": "en",
  "referenceId": "CG-2026-001",
  "header": {
    "type": "TEXT",
    "content": "Order #{{1}} confirmed"
  } /* OR null OR media variant */,
  "body": {
    "content": "Hi {{user_name}}, your order #{{1}} is on its way.",
    "variableType": "Name"
  },
  "footer": {
    "content": "Reply STOP to opt out."
  } /* OR null */,
  "buttons": [
    { "type": "QuickReply", "label": "Track order" },
    { "type": "Url", "label": "Open app", "url": "https://app.example.com" }
  ],
  "contactGroupLink": {
    "contactGroupId": "<cg-id>",
    "columnMapping": {
      "{{user_name}}": "first_name",
      "{{1}}": "order_id"
    }
  } /* OR null */
}
```

## Response — `CreateTemplateResponse`

```jsonc
{
  "isSuccessful": true,
  "result": {
    "templateId": "<new-template-id>",
    "status": "Draft",
    "createdAt": "2026-05-18T..."
  }
}
```

## Gateway routing

`templates/*` → System Gateway OR Core Gateway depending on actor type → Templates Service.

## See also

- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
