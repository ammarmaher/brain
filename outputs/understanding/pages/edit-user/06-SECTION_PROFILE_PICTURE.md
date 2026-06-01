*** Edit User — Section: Profile Picture upload/delete ***
*** SoT for the avatar control · 2026-05-17 ***

# Edit User — Profile Picture

> Optional per [PRD] BR-UM-16. Upload accepts `image/*` MIME types up to 4 MB.

## Upload flow

[CODE] `apps/host-shell/.../user-profile.component.ts:801-823` (`onFilesSelected`):

```typescript
onFilesSelected(files: File[]): void {
  const file = files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    this.messageService.add({
      severity: 'error',
      detail: this.t('profile.picture.invalidType'),
    });
    return;
  }
  if (file.size > 4 * 1024 * 1024) {
    this.messageService.add({
      severity: 'error',
      detail: this.t('profile.picture.tooLarge'),
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = (reader.result as string).split(',')[1];
    this.profilePictureInfo = {
      extension: file.name.split('.').pop(),
      fileBase64String: base64,
    };
    this.currentImageUrl = URL.createObjectURL(file);
    this.deleteImage = false;
  };
  reader.readAsDataURL(file);
}
```

## Delete flow

[CODE] `user-profile.component.ts` (search for `confirmDeleteProfilePicture`):

```
1. User clicks "Delete photo"
2. ConfirmationService.confirm({ key: 'deleteProfilePicture', message: ... })
3. On accept:
   - this.deleteImage = true
   - this.profilePictureInfo = null
   - this.currentImageUrl = ''
4. On save, payload includes `DeleteImage: true`
5. Backend clears `User.Image` field
```

## Validation rules

| Rule | Value | Where enforced |
|---|---|---|
| MIME type | `image/*` (image/jpeg, image/png, image/gif, image/webp) | FE only — `file.type.startsWith('image/')` |
| Size | ≤ 4 MB | FE only — `file.size <= 4 * 1024 * 1024` |
| Single file | Yes | FE — `files?.[0]` |
| Backend size cap | TBD (likely 5-10 MB hard cap) | BE — verify in [BRAIN-OUT] identity validators |

[PRD] BR-UM-48 — OPEN: "Profile picture format / size limits are silent in PRD."

## Payload shape

`ProfilePictureInfo`:

```typescript
interface ProfilePictureInfo {
  extension: string;          // 'jpg' | 'png' | 'gif' | 'webp'
  fileBase64String: string;   // raw base64 (no data: prefix)
}
```

Wire to backend as part of `UpdateUserProfileByIdRequest`:

```jsonc
{
  // ... other fields ...
  "profilePictureInfo": { "extension": "jpg", "fileBase64String": "..." },
  "deleteImage": false
}
```

OR for delete:

```jsonc
{
  // ... other fields ...
  "profilePictureInfo": null,
  "deleteImage": true
}
```

## Storage backend

[INFERRED] Identity stores the image as base64 in Mongo (per `UserResponse.image: string`) OR as a CDN URL after upload. Both are observed in `UserResponse.image: string`. Verify with backend before assuming.

## UI shape

```
+----------------------------------+
|        [ Avatar ]                 |
|       (rounded image)             |
|                                   |
|  [ Change photo ] [ Delete ]      |
|                                   |
|  Recommended: 200x200, max 4 MB   |
+----------------------------------+
```

## Falcon component composition

| Element | Falcon component | Customization |
|---|---|---|
| Avatar + uploader | `<falcon-uploader>` | `[accept]="'image/*'"` · `[maxSize]="4*1024*1024"` · `[(ngModel)]="profilePictureInfo"` |
| Delete button | `<falcon-button>` | secondary variant · confirm dialog on click |

## Object URL lifecycle

[CODE] `user-profile.component.ts` `ngOnDestroy`:

```typescript
ngOnDestroy(): void {
  if (this.currentImageUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(this.currentImageUrl);
  }
}
```

**Critical:** revoke blob URLs to prevent memory leaks across many edits.

## See also

- [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [README](README.md)
