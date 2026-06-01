*** Contact Groups List — Section: Edit panel ***
*** Edit name/refId/share · 2026-05-18 ***

# Contact Groups List — Edit Panel

> Inline edit panel inside the detail view. Only creators can edit.

## Editable fields

| Field | Editable | Validator | Endpoint field |
|---|---|---|---|
| `name` | YES | required, non-empty | `UpdateContactGroupRequest.Name` |
| `referenceId` | YES | optional | `UpdateContactGroupRequest.ReferenceId` |
| `sharePolicy` | YES (via separate share panel) | enum | (via separate `PATCH /share` endpoint) |

## Share policy editor

The `sharePolicy` is edited via a separate panel/dialog with the user picker (see [06-SECTION_USER_PICKER](06-SECTION_USER_PICKER.md)).

Endpoints split:
- General fields → `PATCH contactgroup/contact-groups/{id}` with `{ Name, ReferenceId }`
- Share policy → `PATCH contactgroup/contact-groups/{id}/share` with `{ SharedWithAllUsers, SharedUsers[] }`

## Save

```typescript
this.contactGroupDetailsService
  .updateGroup(groupId, { Name, ReferenceId })
  .subscribe({
    next: detail => { /* refresh + toast success */ },
    error: err => { /* toast error */ },
  });
```

## Falcon components

- `<falcon-input>` Name + ReferenceId
- `<falcon-button>` Save / Cancel
- `<falcon-multiselect>` Share-policy users (see user-picker)

## See also

- [04-SECTION_DETAIL_VIEW](04-SECTION_DETAIL_VIEW.md) · [06-SECTION_USER_PICKER](06-SECTION_USER_PICKER.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
