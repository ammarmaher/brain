*** Create Template (WhatsApp) — Contact Group linking ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Contact Group Link

> Optional. Per BR-TM-12, links template variables to contact group columns so when this template is used in a campaign, variable values pull from the contact list.

## Link wizard section

After defining body variables, user can optionally:
1. Pick a Contact Group from dropdown.
2. Map each variable to a column.

```
+--------------------------------------+
|  Link Contact Group (optional)       |
+--------------------------------------+
|  Group  [ My CG 2026-Q1 ▼ ]         |
|                                      |
|  Map variables to columns:           |
|  {{1}}  →  [ first_name ▼ ]         |
|  {{2}}  →  [ phone     ▼ ]         |
|  {{3}}  →  [ amount    ▼ ]         |
+--------------------------------------+
```

## Backend shape

```jsonc
{
  "contactGroupLink": {
    "contactGroupId": "<cg-id>",
    "columnMapping": {
      "{{1}}": "first_name",
      "{{2}}": "phone",
      "{{3}}": "amount"
    }
  }
}
```

## Catalog source

Fetches contact-groups via `GET contactgroup/contact-groups?ownerId={accId}` (existing endpoint per [BRAIN-OUT] contact-group dossier).

Fetches contact-group columns via `GET contactgroup/contact-groups/{id}` (returns column config).

## See also

- [03-STEP_2_MESSAGE_STRUCTURE](03-STEP_2_MESSAGE_STRUCTURE.md) · `../contact-groups-list/`
