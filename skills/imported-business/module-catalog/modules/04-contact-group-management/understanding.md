# Understanding — Contact Group Management

## Module purpose

Manage reusable lists of recipients (contact groups) that Client-side users upload, configure, share, and reference from templates when sending transactions through Falcon applications. Groups are the data half of the template+group pairing that produces personalized messages.

## Actors / users

| User type | Role | Access |
|---|---|---|
| Falcon | System Administrator | View only, via Main node selection |
| Falcon | Operation | View only |
| Falcon | Product | View only |
| Client | Account Owner | Create / Edit own / Delete own / Share own / Share others-in-hierarchy / Download |
| Client | Node Admin | Same as Account Owner, scoped to hierarchy |
| Client | Normal User (creator) | Create / Edit / Delete / Share / Download |
| Client | Normal User (not creator) | View only on shared groups; cannot edit/delete/share |

Source for the matrix: `attachments.md` → `Contact Group Permissions` sheet.

## Main screens

1. **Contact Groups list** (on the logged-in user's own node).
2. **Contact Groups list** (on a sub-node under Account Owner / Node Admin hierarchy).
3. **Create Contact Group wizard** (4 steps).
4. **Contact Group detail view** (read-only, with Edit button for creator).
5. **Edit Contact Group** (creator only, subset of fields).
6. **Shared Groups tab** (Normal User only).

## Main actions

- Upload & parse file (CSV / XLS / XLSX).
- Configure header row + column names.
- Share during creation or via action menu.
- View detail with paginated contacts.
- Download full validated contacts OR original uploaded file.
- Edit (creator only, name / sharing / reference ID).
- Soft delete (creator only, hides from client side but keeps for Falcon usertype).

## Business rules

- **R1** Each group has a system-generated immutable Contact ID.
- **R2** Group Name ≤ 50 chars, mandatory.
- **R3** Column names — English letters, no duplicates, no special chars, ≤ 20 chars, spaces auto-converted to `_`.
- **R4** Contact file size capped by App Settings (configurable per system).
- **R5** Only the creator can edit or delete the group.
- **R6** Delete is soft — client side hides, Falcon side keeps.
- **R7** Edits propagate to all shared versions (single entity).
- **R8** File contents not validated — whatever is uploaded is accepted.
- **R9** View-tab layout differs by role AND whether viewing own node vs sub-node.

## Permission matrix

From `attachments.md` (Contact Group Permissions sheet):

| Role | View | Create | Edit | Share | Delete | Download CG | Download Original |
|---|---|---|---|---|---|---|---|
| Falcon System Admin | Y | N | N | N | N | Y | Y |
| Falcon Product | Y | N | N | N | N | Y | Y |
| Falcon Operation | Y | N | N | N | N | Y | Y |
| Client AO — creator | Y | Y | Y | Y | Y | Y | Y |
| Client AO — not creator | Y | Y | N | Y | N | Y | Y |
| Client Node Admin — creator | Y | Y | Y | Y | Y | Y | Y |
| Client Node Admin — not creator | Y | Y | N | Y | N | Y | Y |
| Client Normal User — creator | Y | Y | Y | Y | Y | Y | Y |
| Client Normal User — not creator | Y | Y | N | N | N | Y | Y |

Note: "Not creator" Account Owners / Node Admins still retain `Share` but lose `Edit` and `Delete`. Normal Users who are "not creator" cannot share at all — they only use the groups shared with them.

## Workflows

### Create
`Navigate to Contact Groups` → `Add Contact Group` → Step 1 Upload & Details → Step 2 Preview & Configure (header toggle, column validation) → Step 3 Share (optional) → Step 4 Review → `Save` → system assigns Contact ID + creation date → status `In Progress` → `Completed`.

### Share (post-create)
Creator / Account Owner / Node Admin opens three-dots → `Share` → edit Shared With list → `Save`.

### Delete
Creator only → three-dots → `Delete` → soft-delete. Falcon usertype can still see the record (marked as deleted by creator) and download.

### Link to template
Contact group columns become template variables (see Template module). Alert user when linked CommChannel requires a field not in the group (e.g. Nabaa requires NationalID).

## Edge cases

- Upload file with NO header row → system must treat row 1 as data and force user to name columns.
- Duplicate column names on upload → validation error, user cannot proceed.
- User unchecks "First row is header" after editing names → behavior not spelled out; reasonable default is to clear typed names and restart.
- Creator's account is Deleted — PRD doesn't say whether their groups remain accessible to shared recipients. Open question.
- Normal User shares a group with themselves — UI should prevent.

## Validations (consolidated)

- Group name ≤ 50 chars, required.
- Contact file type ∈ {CSV, XLS, XLSX}, required.
- Contact file size ≤ App Settings limit, else alert.
- Column name: EN letters only, no special chars, no duplicates, ≤ 20 chars, spaces → `_`.
- Cannot proceed past Step 2 with invalid column names.
- Edit fields respect non-editable restrictions (Contact ID, Creation Date, Status, Contact table).

## Dependencies

- **Template module** — variables sourced from column names.
- **App Settings** — file size cap, possibly other feature flags.
- **Permission module** — per-action gating (view/create/edit/share/delete/download).
- **Hierarchy module** — tab layout and list scoping depend on where user is in the tree.
- **CommChannel & Services** — alerts when linked channel needs a column the group lacks.

## Data entities

- `ContactGroup` { contactId, name, referenceId, createdBy, createdAt, uploadedCount, status, sharedWith[], originalFile, validatedFile, nodeId, softDeleted }
- `ContactGroupColumn` { groupId, index, name, ignored }
- `ContactGroupRecord` { groupId, rowIndex, fields{columnName: value} }

## API expectations (implied)

- `POST /contact-groups` — create with file upload.
- `GET /contact-groups?nodeId=…&tab=my|shared|node` — list, filtered by viewer role and location in hierarchy.
- `GET /contact-groups/{id}` — detail with contacts (paginated).
- `PATCH /contact-groups/{id}` — edit name / share / reference ID.
- `DELETE /contact-groups/{id}` — soft delete.
- `GET /contact-groups/{id}/download?original=true|false` — download CSV/XLSX.
- Falcon admin list endpoints scoped by Main node selection.

## Assumptions

- The permission matrix cell `Client AO — not creator: Create Yes` means the AO role has the general `Create` capability — it's not tied to this particular group record. Same for Node Admin and Normal User.
- `Share` for Account Owner / Node Admin (not creator) means sharing groups created by OTHERS under their hierarchy, as the PRD body states.
- Soft-delete semantics mirror typical Falcon patterns (record kept, flagged).

## Risks / unclear areas

- "Shared With (+2)" collapsing threshold is undefined. Design should pick a consistent cap.
- The PRD doesn't define behavior when a user account referenced in `Shared With` is deleted — group still appears for them? Stops appearing?
- "The size of the contact file is configuration in the system" — unclear whether per-system or per-tenant.
- Status transitions (`In Progress` → `Completed`) — no timing or failure path described. What happens if parsing fails? No "Failed" status mentioned.

## Clarifying questions for business

1. What is the App Settings max-upload default value?
2. Does "Share" for Account Owner / Node Admin require the shared-with user to be on the same node, or any node in the hierarchy?
3. When a shared-with Normal User is deleted, does the group disappear from others or just from that user?
4. Is there a "Failed" status when file parsing errors? What does the UI show?
5. Deeply nested hierarchy — does an Account Owner see groups three levels below their node in the `Contact Groups` list of their node, or only one level?
