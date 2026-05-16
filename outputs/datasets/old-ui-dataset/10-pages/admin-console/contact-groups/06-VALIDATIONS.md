# Validations — contact-groups (admin-console)

## Form validators (sync)

| Form | Field | Validator | Where enforced | Message key |
|---|---|---|---|---|
| Detail page — edit mode | `editName` | non-empty after `.trim()` | `isNameValid` getter (line 195) — disables Save button + shows inline error | `contactGroups.detail.validation.nameRequired` (template line 198) |
| Detail page — edit mode | `editReferenceId` | none | n/a — optional field | n/a |

That's the entire client-side validation surface for this feature.

```ts
// contact-group-details.component.ts:195-197
get isNameValid(): boolean {
  return this.editName.trim().length > 0;
}
```

Template wiring (HTML lines 196-200):
```html
<small *ngIf="!isNameValid" class="p-error">
  {{ 'contactGroups.detail.validation.nameRequired' | translate }}
</small>
```

Save button (HTML line 155):
```html
[disabled]="!isNameValid || isSaving"
```

## Forms architecture
- The list page (`ContactGroupsComponent`) has **no form**.
- The detail page (`ContactGroupDetailsComponent`) uses **template-driven forms** (`FormsModule` import on line 12, `[(ngModel)]` on `editName` + `editReferenceId`). No `FormBuilder`, no `FormGroup`, no `FormControl`.
- No `ReactiveFormsModule` is imported in either component.

## Async validators

**None** in this feature. The brief mentions the "wizard async validation" branch but **the create-contact-group wizard is NOT in admin-console** — it lives only at `apps/management-console/src/app/features/contact-groups/create-contact-group/`. The admin-console only has list + detail + edit. Therefore there is no equivalent async validator here. [CODE — verified by grep; no `AsyncValidatorFn` / `asyncValidators` references anywhere in the admin-console contact-groups tree.]

## Business rules captured in code

### Edit gate (creator-only)
```ts
// contact-group-details.component.ts:166-169
get canEdit(): boolean {
  // Creator-only for Edit — BE also enforces; tenant flag alone is insufficient.
  return this.detail?.isCreator === true && this.permissions().canEdit;
}
```
Two conditions ANDed: tenant permission `canEdit` AND the user is the original creator (`detail.isCreator` from the backend). Both must be true.

### Per-row action visibility (3 rules)
```ts
// models.ts:47-60 — rowFlags()
const isOwner = !!session?.identityUserId
  && session.identityUserId === row.createdByUserId;
return {
  canEditRow:   flags.canEdit   && isOwner,                              // edit requires owner
  canDeleteRow: flags.canDelete && isOwner,                              // delete requires owner
  canShareRow:  flags.canShare  && (isOwner || flags.canShareOther),     // share allows non-owners IF canShareOther
};
```

### Download gates
```ts
// contact-group-details.component.ts:183-192
get canDownloadValidated(): boolean {
  return this.isCompleted
    && this.detail?.files?.hasValidated === true
    && this.permissions().canDownloadValidated;
}
get canDownloadOriginal(): boolean {
  return this.detail?.files?.hasOriginal === true
    && this.permissions().canDownloadOriginal;
}
```
- Validated download requires the group be `Completed` (status code 2). Original has no completion gate.
- File availability is a per-group server-asserted boolean (`FileAvailabilityDto`).
- Tenant download permission must also be granted.

### Contacts-table gating
```ts
// contact-group-details.component.ts:319-322 (inside loadDetail callback)
if (detail.status === ContactGroupStatus.Completed) {
  this.loadContacts(groupId);
}
```
The contacts table only fetches its data when the group has reached `Completed`. Templates show a "No data available yet" placeholder when `isProcessing` (any status ≠ Completed).

### Status normalisation
```ts
// libs/falcon/.../contact-group.models.ts:113-117
export function normalizeContactGroupStatus(raw: number | null | undefined): ContactGroupStatus {
  return raw === ContactGroupStatus.Completed
    ? ContactGroupStatus.Completed
    : ContactGroupStatus.InProgress;
}
```
- Any unknown / null / legacy enum value (including the deprecated `Failed`) defaults to `InProgress`.
- Banner comment in the file (lines 101-107) makes this explicit policy.

### Delete-row action (placeholder)
```ts
// contact-groups.component.ts:419-423
onDelete(_row: ContactGroupTableRowVm): void {
  // Admin-console delete flow is handled in the detail page; the list
  // action mirrors Management Console by navigating to details.
  this.onMoreDetails(_row);
}
```
Delete from the row menu **does not delete** — it just navigates to the detail page. (The detail page itself does not have a Delete button in the current HTML either — delete UX is not implemented in admin-console at this commit.)

### Cancel-edit guard
```ts
// contact-group-details.component.ts:606-623
onCancel(): void {
  this.confirmationService.confirm({
    message: this.translateService.translate('confirm.discardChangesMessage'),
    acceptLabel: this.translateService.translate('button.yes'),
    rejectLabel: this.translateService.translate('button.no'),
    accept: () => { /* restore originalDetail */ },
  });
}
```
Cancel always prompts the discard-confirmation dialog — even when the user changed nothing. There is no dirty-tracking. [CODE — `originalDetail` is cloned at edit start but never diffed against current state.]

### Save: sharePolicy is silently dropped
```ts
// contact-group-details.component.ts:625-637
onSave(): void {
  if (!this.groupId || !this.detail || !this.isNameValid) return;

  const selectedUsers = (this.detail.sharePolicy.sharedUsers ?? [])
    .filter(u => this.editSelectedUserIds.includes(u.userId))
    .map(u => ({ ... }));                                  // ← built but UNUSED

  const payload: UpdateContactGroupRequest = {
    groupId: this.groupId,
    name: this.editName.trim(),
    referenceId: this.editReferenceId.trim() || null,
    sharePolicy: null,                                     // ← hard-coded null
  };
  // ... PATCH
}
```
Save sends `sharePolicy: null`. The selected-user IDs the user picked in the multiselect are **never serialised** — `selectedUsers` is computed and then discarded. **This is a bug in the current build** that the new theme/UI should fix. (`selectedUsers` is also pulled from `detail.sharePolicy.sharedUsers` instead of from the freshly-loaded `rawUsers` cache, so any newly-added users would be lost regardless.) [CODE]

### Multiselect: select-all behaviour
```ts
// contact-group-details.component.ts:828-862
onSelectAllRequested(): void {
  // ...
  this.detailService
    .getShareableUsers('', 1, SELECT_ALL_PAGE_SIZE)        // page size = 9_999_999
    .subscribe({
      next: (r) => {
        // ...
        this.editSelectedUserIds = r.users.map((u) => u.userId);
        this.allSelected = true;
      },
    });
}
```
"Select All" fetches every user in a single mega-page and pre-selects them all. There is no server-side "select all" flag — the selection is materialised as a full ID list on the client. (Combined with the bug above, this means saving with Select All would also send `sharePolicy: null`.) [CODE]

### Username field treatment on `getShareableUsers`
```ts
// contact-group-details.service.ts:178-189
let params = new HttpParams()
  .append('Status', UserStatus.Active.toString())          // 2
  .append('Status', UserStatus.Suspended.toString())       // 3
  .append('Status', UserStatus.Locked.toString())          // 4
  .append('Role', UserRoles.NormalUser.toString())         // 6
  .set('PageNumber', page.toString())
  .set('PageSize', pageSize.toString());

if (search) {
  params = params.set('Search', search);
}
```
- The picker excludes `Inactive` / `Deleted` users but **includes Suspended + Locked** — required because users could be in those states yet still appear as already-shared.
- Restricted to `NormalUser` role only (excludes admins). [CODE comment line 173: "Same params as create-contact-group share step."]

## What's NOT validated client-side

- No name length max (backend likely enforces)
- No reference-id format validation
- No duplicate-name check (this is what the wizard async validator would do, but it's not present here)
- No sharedUsers length max
- No invalid-character check on any field
