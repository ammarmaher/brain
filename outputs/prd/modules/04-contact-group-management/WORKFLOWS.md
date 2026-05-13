*** PRD Understanding - Contact Group Management - WORKFLOWS ***

# 04-contact-group-management - Workflows

## W1: Create Contact Group (4-step wizard)

- **Trigger:** Client user (per role matrix) clicks `Add Contact Group` on the Contact Groups list.
- **Source:** `latest-prd.md:29-34`; ContactGroup `POST /api/contact-groups`.
- **Pre-step (upload):**
  1. Frontend calls `GET /api/contact-groups/upload-config` to learn `MaxFileSizeMB`, `AllowedExtensions[]`, `PreviewRowCount`.
  2. Frontend calls `POST /api/contact-groups/uploads/init` with file metadata -> gets back pre-signed PUT URL + `uploadId`.
  3. Frontend PUTs file directly to S3 / object storage.
  4. Frontend calls `POST /api/contact-groups/uploads/{uploadId}/complete` -> receives `CompleteUploadResponse { HasHeader, DetectedColumns[], PreviewRows[][] }`.
- **Wizard steps:**
  1. **Step 1 - Upload & Set Details**: Group Name (<=50, mandatory), Reference ID (optional), Contact File (CSV/XLS/XLSX, size-capped).
  2. **Step 2 - Preview & Configure**: "First row is the header" toggle. Column names validated (EN letters only, no duplicates, no special, <=20 chars, spaces -> `_`). Show first 5 data rows.
  3. **Step 3 - Share Group** (optional): pick specific Normal Users OR "All Users".
  4. **Step 4 - Review & Create**: Summary + Save -> system commits via `POST /api/contact-groups` with the `UploadSessionId` + final `ColumnConfig` + `SharePolicy`.
  5. System auto-generates Contact ID + Creation Date; Status = `In Progress` -> `Completed`.
- **Success:** Group persisted; appears in list.
- **Failure modes:** File too large; duplicate column names; invalid column chars; permission denied.

## W2: View Contact Group (role + hierarchy-aware)

- **Trigger:** User navigates to Contact Groups menu.
- **Source:** `latest-prd.md:36-40`; ContactGroup `GET /api/contact-groups` + `GET /api/contact-groups/shared` + `GET /api/contact-groups/{groupId}`.
- **Steps:**
  1. Determine viewer role + position in hierarchy.
  2. Render tabs per BR-CGM-20..23:
     - AO / NA on own node: 1 tab.
     - Normal User on own node: 2 tabs (Contact Groups + Shared Groups).
     - AO / NA on sub-node: 1 tab.
     - Falcon: Main-node-required, 1 tab, view-only (includes soft-deleted).
  3. Fetch list with pagination; render columns per BR-CGM-24.
  4. Open detail via `GET /api/contact-groups/{groupId}` + `GET /api/contact-groups/{groupId}/contacts?page=&pageSize=` (paginated rows).
- **Success:** List + detail rendered.
- **Failure modes:** Permission denied; group not in viewer scope.

## W3: Share Group (post-create)

- **Trigger:** Creator / AO / Node Admin opens three-dots menu -> `Share`.
- **Source:** `latest-prd.md:32, 41` (Shared With column); ContactGroup `PATCH /api/contact-groups/{groupId}/share`.
- **Steps:**
  1. Open Share dialog -> current Shared With list.
  2. Modify: toggle "All Users", or add/remove specific Normal Users.
  3. Save -> request fires `ShareContactGroupRequest { GroupId, SharedWithAllUsers, SharedUsers[] }`.
- **Success:** SharePolicy updated; Shared With column reflects new state on next list refresh.
- **Failure modes:** Permission denied (Normal User non-creator). Share with self (UI should block but PRD silent - BR-CGM-38 OPEN).

## W4: Edit Contact Group (creator only)

- **Trigger:** Creator opens detail -> Edit.
- **Source:** `latest-prd.md:48`; ContactGroup `PATCH /api/contact-groups/{groupId}`.
- **Steps:**
  1. Edit allowed fields: Name, Shared With, Reference ID.
  2. Contact ID, Creation Date, Status, contact table are read-only.
  3. Save -> propagates to all shared versions (single source of truth, BR-CGM-27).
- **Success:** Group updated.
- **Failure modes:** Validation. Permission denied.

## W5: Soft Delete (creator only)

- **Trigger:** Creator clicks three-dots -> Delete.
- **Source:** `latest-prd.md:45`; ContactGroup `DELETE /api/contact-groups/{groupId}`.
- **Steps:**
  1. Confirm delete.
  2. Set `softDeleted = true`.
  3. Client-side list hides the group.
  4. Falcon usertype list still shows it (BR-CGM-28).
- **Success:** Soft delete applied.
- **Failure modes:** Permission denied.

## W6: Download Contact Group

- **Trigger:** User clicks Download from the Actions menu (or Detail Contact list section).
- **Source:** `latest-prd.md:44`; ContactGroup `GET /api/contact-groups/{groupId}/files/{fileType}` where `fileType` in `{original, validated}`.
- **Steps:**
  1. Request returns `GetFileDownloadUrlResponse { DownloadUrl, FileName, ExpiresInSeconds }` (pre-signed GET URL).
  2. Frontend triggers download.
- **Success:** File downloaded.
- **Failure modes:** Permission denied (per matrix). URL expired.

## W7: Link to Template (cross-module)

- **Trigger:** Template creation wizard offers "Link Contact Group" option.
- **Source:** `latest-prd.md:61-63`; cross-cuts 05-templates.
- **Steps:**
  1. Template Maker selects a Contact Group.
  2. Group columns become available as template variables.
  3. If linked CommChannel requires a field not in the group (e.g. NationalID for Nabaa), system alerts the user.
  4. If a template references a variable the group does not contain, system alerts the user.
- **Success:** Mapping recorded on template.
- **Failure modes:** Missing required column -> warning (not block) per PRD wording.

## W8: Falcon View (admin)

- **Trigger:** Falcon usertype navigates to Contact Groups.
- **Source:** `latest-prd.md:40`.
- **Steps:**
  1. Selector: pick a Main node (mandatory pre-step).
  2. List displays all groups for that node, including soft-deleted.
  3. Detail view + download available; no edit / delete / share buttons.
- **Success:** Read-only view of client-owned data.
- **Failure modes:** No Main node selected -> empty.
