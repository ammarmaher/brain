*** Edit User — Components ***
*** SoT for Falcon component composition · 2026-05-17 ***

# Edit User — Components

> Falcon-UI-Core-only inventory. Old-UI uses heavy PrimeNG; new UI replaces all PrimeNG with Falcon components per [F-016].

## Component tree (NEW UI target)

```
EditUserContainer (or RightPaneDetailsView)
├── <falcon-tabs>
│   ├── Tab "Personal Info"
│   │   ├── <falcon-uploader> (profile picture)
│   │   ├── <falcon-input> (firstName)
│   │   ├── <falcon-input> (lastName)
│   │   ├── <falcon-input> (userName · disabled)
│   │   ├── <falcon-email-field> (composite — email + Verify chip)
│   │   ├── <falcon-mobile-number> (composite — phone + Verify chip)
│   │   ├── <falcon-input> (nationalId)
│   │   └── <falcon-button> (Save) + <falcon-button> (Cancel)
│   ├── Tab "Role & Status"
│   │   ├── <falcon-select> (status — filtered by BR-UM-08)
│   │   ├── <falcon-select> (role — PES-filtered)
│   │   └── <falcon-button> (Save) + <falcon-button> (Cancel)
│   └── Tab "Permissions"
│       └── <falcon-select> (permissionGroup)
├── <falcon-dialog> (ProfileOtpModal — mounted always; visible via signal)
│   └── <falcon-otp> (6-digit input)
└── <falcon-confirm-dialog> (deleteProfilePicture key)
```

## Per-component spec

### `<falcon-tabs>`

- 3 tabs: Personal Info · Role & Status · Permissions
- Hide Role & Status + Permissions when `!canEditStatus && !canEditRole` (i.e. My Profile mode)
- Falcon UI Core: `libs/falcon-ui-core/src/lib/components/falcon-tabs/`

### `<falcon-input>`

- Reusable text input
- Used for firstName, lastName, userName (disabled), nationalId
- Props: `[label]`, `[required]`, `[disabled]`, `[validators]`, `[(ngModel)]` or formControlName
- For `userName`: `[disabled]="true"` + gray styling + lock icon

### `<falcon-email-field>` (composite proposed)

If no such Falcon component exists: compose with `<falcon-input>` + `<falcon-button>` (Verify chip) + glue to `ProfileOtpModal`. Behavior:
- onChange → emit `emailChanged` event
- Show green checkmark when verified
- Show "Verify" link when changed and not yet verified

### `<falcon-mobile-number>`

- Already exists in Falcon UI Core
- Internal E.164 validation
- Props: `[label]`, `[required]`, `[(ngModel)]`, `[country]` (default 'SA')

### `<falcon-select>`

- Replaces PrimeNG `<p-select>` ([F-016])
- Used for status, role, permissionGroup
- Props: `[options]`, `[(ngModel)]`, `[disabled]`, `[label]`, `[required]`

### `<falcon-uploader>`

- Already exists in Falcon UI Core
- Used for profile picture
- Props: `[accept]="'image/*'"`, `[maxSize]="4*1024*1024"`, `[(ngModel)]="profilePictureInfo"`
- Emits: `(filesSelected)`, `(delete)`

### `<falcon-dialog>`

- Replaces PrimeNG `<p-dialog>` ([F-016])
- Used for ProfileOtpModal shell

### `<falcon-otp>`

- Replaces PrimeNG `<p-inputOtp>` ([F-016])
- 6-digit input · auto-focus next on each keystroke

### `<falcon-button>`

- Used for Save, Cancel, Verify (chip variant)
- Variants: primary (Save), secondary (Cancel), text (Verify chip)

### `<falcon-confirm-dialog>`

- Replaces PrimeNG `<p-confirmDialog>` ([F-016])
- Used for delete-photo confirmation

## Anti-patterns to AVOID in new UI

| Old-UI thing | Replace with | Reference |
|---|---|---|
| PrimeNG `<p-select>` | `<falcon-select>` | [F-016] |
| PrimeNG `<p-inputtext>` | `<falcon-input>` | [F-016] |
| PrimeNG `<p-input-group>` for chip layout | Tailwind utility flex + `<falcon-button>` | [F-016] |
| PrimeNG `<p-confirmDialog>` | `<falcon-confirm-dialog>` | [F-016] |
| PrimeNG `<p-inputOtp>` | `<falcon-otp>` | [F-016] |
| PrimeNG `<p-dialog>` | `<falcon-dialog>` | [F-016] |
| Template-driven `NgForm` | Reactive Forms `FormBuilder` | [F-022] |
| `*ngIf` / `*ngFor` | `@if` / `@for` | [F-018] |
| SCSS component styles | Tailwind utility classes | [F-017] |

## Layout doctrine (per Noor instructions)

- Use Tailwind utility classes for layout. No custom SCSS.
- Use Falcon color tokens (`bg-falcon-neutral-0`, etc.) not raw `#fff` or `bg-white`.
- Section separators: `<falcon-divider>` or `border-b border-falcon-neutral-150` utility.

## See also

- [README](README.md) · [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md) · [03-SECTION_ROLE_STATUS](03-SECTION_ROLE_STATUS.md) · [04-SECTION_PERMISSIONS](04-SECTION_PERMISSIONS.md) · [05-SECTION_OTP_VERIFICATION](05-SECTION_OTP_VERIFICATION.md) · [06-SECTION_PROFILE_PICTURE](06-SECTION_PROFILE_PICTURE.md)
