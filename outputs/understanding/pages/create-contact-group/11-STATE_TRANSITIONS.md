*** Create Contact Group — State transitions ***
*** 2026-05-18 ***

# Create Contact Group — State Transitions

## Wizard step FSM

```
Stage 1 (Upload) → Stage 2 (Column) → Stage 3 (Preview) → Stage 4 (Naming) → POST commit
```

## UploadSession FSM

[See [06-SECTION_UPLOAD_SESSION_FSM](06-SECTION_UPLOAD_SESSION_FSM.md)]

## ContactGroup FSM (post-commit)

On commit: ContactGroup is created with `status: 'Active'`. From there:

```
Active → Inactive → Active   (creator-toggle)
Active → SoftDeleted          (creator-delete)
Active → SoftDeleted          (admin-delete per PES)
```

Detailed in `../contact-groups-list/11-STATE_TRANSITIONS.md`.

## See also

- [06-SECTION_UPLOAD_SESSION_FSM](06-SECTION_UPLOAD_SESSION_FSM.md) · [../contact-groups-list/11-STATE_TRANSITIONS.md](../contact-groups-list/11-STATE_TRANSITIONS.md)
