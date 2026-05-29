*** Contact Groups List — Section: User picker ***
*** Share-policy multiselect · 2026-05-18 ***

# Contact Groups List — User Picker

> Multiselect of Identity users for share-policy. Filtered to specific statuses + roles.

## Endpoint

```
GET identity/user
    ?Status=2          // Active
    &Status=3          // Suspended
    &Status=4          // Locked
    &Role=6            // NormalUser
    &PageNumber=1
    &PageSize=20
    &Search=<term>
```

[CODE] `contact-group-details.service.ts:178-181` filter rationale:

> "Status code values include Suspended + Locked deliberately because already-shared users may be in those states."

## Search

Typeahead with debounce (~300ms). Calls same endpoint with `Search=<term>`.

## Selection

User picks one or more users from results. Selected → `SharedUsers[]` array.

## Special selection: SharedWithAllUsers

A toggle "Share with all users" → sets `SharedWithAllUsers: true` and clears `SharedUsers[]`.

## Save

```
PATCH contactgroup/contact-groups/{id}/share
Body: { SharedWithAllUsers: boolean, SharedUsers: [<userId>, ...] }
```

## Falcon component

- `<falcon-multiselect>` with async search
- Could be `<falcon-typeahead-multi-select>` if exists
- Otherwise compose with `<falcon-input>` + virtualized list

## See also

- [05-SECTION_EDIT_PANEL](05-SECTION_EDIT_PANEL.md) · [08-BACKEND_API](08-BACKEND_API.md)
