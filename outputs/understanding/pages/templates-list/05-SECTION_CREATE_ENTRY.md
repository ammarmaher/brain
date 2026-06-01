*** Templates List — Section: Create entry ***
*** Channel picker for create wizard · 2026-05-18 ***

# Templates List — Create Entry

> The "+ Create Template" button on the list page opens a channel-picker modal that routes the user to the appropriate per-channel wizard.

## Channel picker

```
+--------------------------------------+
|   Create New Template                |
+--------------------------------------+
| What kind of template?              |
|                                      |
|  ┌────────────────┐                  |
|  │  💬 WhatsApp   │                  |
|  └────────────────┘                  |
|  ┌────────────────┐                  |
|  │  📞 Voice      │                  |
|  └────────────────┘                  |
|  ┌────────────────┐                  |
|  │  🤖 AI         │                  |
|  └────────────────┘                  |
|  ┌────────────────┐                  |
|  │  📱 SMS        │                  |
|  └────────────────┘                  |
+--------------------------------------+
```

Selecting WhatsApp opens [[Create Template WhatsApp Flow]] (see `pages/create-template-whatsapp/`).

## Per-channel availability

Filtered by:
- Account's visible channels (per `commerce/Node/{accId}/comm-channels/visible`)
- User's PES `templates.create(channel)` permission per channel

## Falcon components

- `<falcon-dialog>` shell
- `<falcon-button>` per channel (large tile variant)

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · `../create-template-whatsapp/`
