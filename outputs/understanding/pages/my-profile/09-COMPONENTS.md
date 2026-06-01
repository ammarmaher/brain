*** My Profile — Components ***
*** 2026-05-18 ***

# My Profile — Components

## Component tree

```
MyProfileContainer (or shared UserProfileComponent with self-edit mode)
├── <falcon-page-header> "My Profile"
├── Avatar + name display
├── Reactive Form (Personal Info section)
│   ├── <falcon-input> firstName
│   ├── <falcon-input> lastName
│   ├── <falcon-input> userName (disabled)
│   ├── <falcon-email-field> email + Verify chip
│   ├── <falcon-mobile-number> phone + Verify chip
│   └── <falcon-input> nationalId
├── <falcon-uploader> profile picture
├── Security section:
│   └── <falcon-button> Change Password → navigate
├── <falcon-button> Save · Cancel
└── <falcon-dialog> OTP modal (shared with Edit User)
```

## Anti-patterns

Same as Edit User. NEW UI: Reactive Forms, no PrimeNG, no SCSS, no NgForm.

## Component reuse vs new

Two paths:
1. **Reuse `UserProfileComponent`** with a `mode='self-edit'` input → hides tabs.
2. **Build standalone `MyProfileComponent`** for cleaner separation.

NEW UI doctrine: standalone preferred — clearer scope, fewer conditionals.

## See also

- `../edit-user/09-COMPONENTS.md` · [00-OVERVIEW](00-OVERVIEW.md)
