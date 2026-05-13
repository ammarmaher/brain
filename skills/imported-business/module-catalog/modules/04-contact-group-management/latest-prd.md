# Latest PRD — Contact Group Management

| Field | Value |
|---|---|
| Drive folder | `4- Contact Group Mngmnt Module` |
| Selected PRD file | `Contact Group Management Module_V2` |
| Detected version | `V2` → numeric 2 |
| Mime type | Google Doc |
| Sync date | 2026-04-24 |
| Selection reason | Explicit `_V2` marker beats the unversioned alternative. |

## Ignored duplicates

- `Contact Group Management Module` — no `v<n>` marker; treated as older/unknown. Kept in Drive, not used as source.

## Summary

Module owns structured lists of recipients (contact groups) created by Client user types (Account Owner, Node Admin, Normal User) and used by Normal Users for sending transactions. Contact groups are created by uploading a file (CSV / XLS / XLSX), configuring columns, and optionally sharing with Normal Users inside the same account. Groups can be linked to templates so column names become template variables. Falcon usertypes are view-only — they do NOT create, edit, delete, or share.

## Main requirements

### Roles and what they can do
- **Falcon usertypes** (System Admin, Operation, Product) — View only (via Main node selection). No create / edit / delete / share.
- **Client Account Owner** — Can create, edit own, share; can also share groups created by others in their hierarchy.
- **Client Node Admin** — Same as Account Owner, scoped to their hierarchy.
- **Client Normal User** — Can create, edit own, share own; can use groups (own + shared-with-me) to send transactions.

### Create Contact Group (wizard)
1. **Upload & Set Details** — Group Name (≤50 chars, mandatory), Reference ID (optional), Contact File (CSV/XLS/XLSX, mandatory, size capped by App Settings).
2. **Preview & Configure** — "First row is the header" toggle; column names validated (EN letters only, no duplicates, no special chars, max 20 chars, spaces → `_`). Data preview of first 5 rows.
3. **Share Group** (optional) — Pick specific Normal Users OR "All Users".
4. **Review & Create** — Summary + save. System auto-generates Contact ID and creation date.

### View Contact Group
- **Account Owner / Node Admin on their node** — one tab `Contact Groups`.
- **Normal User on their node** — two tabs: `Contact Groups` (own) + `Shared Groups` (shared with me, view-only).
- **Account Owner / Node Admin on sub-nodes in their hierarchy** — one tab, view groups created in that sub-node (no Shared Groups tab).
- **Falcon usertype** — must select a Main node first; one tab, view-only, can still see groups soft-deleted by creators.

### List columns
Contact ID (system-generated, immutable), Contact Group Name, Reference ID, Created By (empty when viewer is creator), Creation Date `DD/MM/YYYY HH:MM AM/PM`, Uploaded Contact (count), Status (`In Progress` / `Completed`), Shared With (users, collapsed like `+2`), Actions (three-dots).

### Actions
- `View More` — detail view including Group Info, Status, Shared With, Contact list section (Download Contact Group / Download Original, paginated contacts table).
- `Delete` — soft delete, only for creator. Deleted record hidden from client side but still visible to Falcon usertype with download access.
- `Share` — available per role matrix.
- `Edit` (only on creator's detail view): Name / Shared With / Reference ID editable; Contact ID / Creation Date / Status / contact table are read-only.

## Validations & rules (extracted)

- Only one of multiple PRDs survives per module (version rule).
- Contact file content is NOT validated beyond parsing — whatever the user uploads is accepted.
- File size cap is configured per system (App Settings).
- Edits to a contact group propagate to all shared versions (single source of truth).
- `View Contact Group` tabs differ by role AND position in hierarchy tree.
- Deleted groups are soft-delete: hidden client-side, visible to Falcon usertype.

## Dependencies

- **Template module** — contact group columns become template variables. Warn / alert the user when:
  - The contact group is linked to a CommChannel that requires a field the group does not have (e.g. NationalID for Nabaa).
  - A template references a variable the group does not contain.
- **App Settings** — max upload file size.
- **Permission module** — defines who sees each action on the list / detail.

## Open questions

- File size limit is configurable per system — no default stated.
- CSV/XLS/XLSX: does the system re-parse the original file every time, or snapshot once at upload? PRD says original is downloadable; unclear whether edits re-read original or diff.
- Normal User creating: Create flow says they can share during creation. List matrix says Normal User (not creator) cannot share. Does a Normal User who IS creator lose the share ability post-creation? Permission sheet line says "Normal User — creator: Share Yes" — so yes, creator retains. OK but worth flagging.
- Sub-node Account Owner view says "without the shared groups tab" — but Account Owner on their OWN node also has only one tab. Behavior is consistent; doc wording is slightly redundant.
- Size capture: "Uploaded Contact" column stores count captured at upload time — if records are removed post-upload (support edit? PRD says no), does count change? Current PRD says no edit to the contact list, so count is frozen.
