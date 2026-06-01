*** Create Contact Group — Step 4: Naming + Share ***
*** 2026-05-18 ***

# Create Contact Group — Step 4: Naming + Share

## Fields

| Field | Required | Rule | Backend field |
|---|---|---|---|
| `name` | YES | ≤50 chars · `.trim()` non-empty · unique per node | `CreateContractGroupRequest.Name` |
| `referenceId` | NO | string | `CreateContactGroupRequest.ReferenceId` |
| `sharePolicy.sharedWithAllUsers` | NO (default false) | boolean | `CreateContactGroupRequest.SharePolicy.SharedWithAllUsers` |
| `sharePolicy.sharedUsers[]` | NO (default `[]`) | user IDs | `CreateContactGroupRequest.SharePolicy.SharedUsers` |

## Async uniqueness check

Async validator on `name`: debounced 300ms, calls (TBD) `GET contactgroup/contact-groups/exists?nodeId=&name=`.

[INFERRED] This endpoint doesn't appear in the registry — likely UNIQUENESS is enforced only at submit-time. Flag GAP.

## Share-policy section

Multiselect of Normal Users in same account (BR-CGM-10) via `GET identity/user?Status=2,3,4&Role=6`. Same user-picker as in the list-page edit-share flow.

Plus toggle: "Share with all users".

## Commit

```
POST /api/contact-groups
Body: {
  uploadSessionId: "<uploadId>",
  name: "...",
  referenceId: "...",
  hasHeader: true,
  columnConfig: { columns: [{ name, dataType }, ...] },
  sharePolicy: {
    sharedWithAllUsers: false,
    sharedUsers: ["<userId1>", "<userId2>"]
  }
}
Response: ServiceOperationResult<CreateContactGroupResponse> {
  groupId: "...",
  status: "Active"
}
```

## UI shape

```
+--------------------------------------+
| Step 4 of 4 — Naming + Share         |
+--------------------------------------+
|                                      |
|  Group Name *  [________________]   |
|  Reference ID  [________________]   |
|                                      |
|  Share with:                         |
|  ◯ Specific users (multi-select)     |
|     [Search and select users...]     |
|  ◯ All users in account              |
|  ◯ Just me                           |
|                                      |
|       [← Previous]  [Finish ✓]       |
+--------------------------------------+
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [../contact-groups-list/06-SECTION_USER_PICKER.md](../contact-groups-list/06-SECTION_USER_PICKER.md)
