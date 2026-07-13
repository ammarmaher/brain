---
name: project_contact_group_edit_feature_fe_2026_06_20
description: "Contact-group EDIT feature (name + referenceId + shared-with) implemented FE-only in mgmt detail + list; PES edit grant already correct (creator-only, verified)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 647e5b35-c065-4611-93b3-c21d05bfe1d5
---

Contact-group **Edit was MISSING** (mgmt detail had only `view`/`share` modes; list comment literally said "NO Edit Group action — no name/ref edit form"). The backend `PATCH /{id}` (name/ref/sharePolicy) + `PATCH /{id}/share` already existed and PES `edit` was already seeded — so this was a pure FE build.

**IMPLEMENTED FE-only (management-console), `nx build management-console` GREEN (eeb7a5c6):**
- `contact-group-detail.component.ts`: added `mode:'edit'`. Editable **Name + Reference ID** (signals + reused `validateContactGroupName`/`validateReferenceId` from `upload-group-details.validation`) + the existing inline **shared-with** editor (reuses `seedShareEditor`/`isAllUsersMode` verbatim — the share-all hydration fix untouched). `openEdit()` gated by `rowFlags().canEditRow`; `enterEditMode`/`isEditDirty`/`onEditClosed`(discard-confirm)/`onEditSave`(editValid + save-confirm)/`persistEdit`; `pendingEditMode` from router `state.editMode` (mirrors `pendingShareMode`).
- **Save path (NON-OBVIOUS, important):** `persistEdit` forkJoins ONLY the changed calls — `api.patch(id,{name, referenceId: ref||null})` (→ `PATCH /{id}`) for metadata AND `api.patchSharePolicy(id, fullObjects)` (→ the W5-verified `PATCH /{id}/share`) for sharing. It DELIBERATELY AVOIDS `patch()`'s `sharePolicy` field (`PatchSharePolicyRequest` = IDs-only, "legacy" — the path behind the admin "null sharedUsers silently dropped" bug). Early-returns if nothing changed (never `forkJoin([])`).
- HTML: Name/Ref cells swap to `<falcon-angular-input>` (same idiom as create wizard) in edit mode; shared-with multi-select now shows for `share || edit`; header shows Cancel/Save for `share||edit` (dispatch by mode) and an **Edit** button (pencil, gated `canEditRow`) in view.
- List `contact-groups-list.component.ts`: new `'edit'` kebab action (visible `isCompleted && flagsFor(row).canEditRow`) + `onRowAction` edit branch + `openEdit(row)` navigates `[id]` with `{editMode:true}` (mirrors `openShare`).
- i18n `contactGroups.actions.edit` (en+ar); `detail.edit` + save/cancel/discard/validation/`messages.updateError` already existed.

**PES: edit grant ALREADY correct (creator-only) — VERIFIED LIVE 2026-06-20:** accowner edit-own → **200**, accadmin edit-other → **403**. No PES or backend change. Admin console stays read-only (no edit added). FE-only, UNCOMMITTED, live-UI verify user-gated. Related [[project_contact_group_share_all_users_multiselect_hydration_2026_06_20]] · [[project_contact_group_share_403_pes_baseurl_fix_2026_06_20]].
