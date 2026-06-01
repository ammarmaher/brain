*** Contact Groups List — Section: Detail view ***
*** Per-group detail page · 2026-05-18 ***

# Contact Groups List — Detail View

> Deep-link at `/contact-groups/:groupId`. Shows group metadata, contact list (paginated), download buttons, edit/share affordances.

## Layout

```
+-----------------------------------------------------+
| < Back | Contact Group: <name>          [Edit] [⋮] |
+-----------------------------------------------------+
|  Reference ID:  CG-2026-001                         |
|  Created By:    user@example.com on 15-May-2026     |
|  Status:        [ Active ]                          |
|  Shared With:   12 users (View)                     |
|  Contacts:      1,234 rows                          |
|                                                     |
|  [Download Original] [Download Validated]           |
|                                                     |
|  Contacts (paginated)                               |
|  ┌──────────────────────────────────────┐          |
|  │ first_name │ last_name │ phone │ ... │          |
|  ├──────────────────────────────────────┤          |
|  │   John     │  Doe      │ +966.. │ ... │          |
|  │   Jane     │  Smith    │ +966.. │ ... │          |
|  │   ...                              │          |
|  └──────────────────────────────────────┘          |
|         < 1 2 3 ... 25 >                            |
+-----------------------------------------------------+
```

## Endpoints used

| Endpoint | Purpose |
|---|---|
| `GET contactgroup/contact-groups/{id}` | Group metadata |
| `GET contactgroup/contact-groups/{id}/contacts?page=&pageSize=` | Paginated contacts |
| `GET contactgroup/contact-groups/{id}/files/{1|2}` | Pre-signed download URLs |
| `PATCH contactgroup/contact-groups/{id}` | Update name/refId/share-policy |

## Contacts pagination

`PagedResult<Dictionary<string, object>>` — backend returns dynamic alias-keyed contacts where keys match the configured column names (e.g. `first_name`, `phone`, `amount`).

## Download

`GET contactgroup/contact-groups/{id}/files/{fileType}`:
- `fileType=1` → Original (the file the user uploaded)
- `fileType=2` → Validated (after backend normalization)

Returns `{ downloadUrl, fileName, expiresInSeconds }` — pre-signed S3 URL. FE triggers download via programmatic `<a download>` click.

## Soft-deleted UX

If `status === 'SoftDeleted'`:
- Show red badge banner at top: "This group was deleted on <date>"
- Hide Edit/Share/Delete actions
- Download still available (for Falcon to access)

## Falcon components

- `<falcon-page-header>` with back button
- `<falcon-info-section>` metadata
- `<falcon-button>` Download / Edit
- `<falcon-angular-data-table>` contacts (lazy)
- `<falcon-menu>` kebab

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [05-SECTION_EDIT_PANEL](05-SECTION_EDIT_PANEL.md) · [08-BACKEND_API](08-BACKEND_API.md)
