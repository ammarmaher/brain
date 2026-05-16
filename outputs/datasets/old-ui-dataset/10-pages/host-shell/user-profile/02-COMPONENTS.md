# Components — user-profile

## Tree
```
UserProfileComponent (selector: app-user-profile, routes: /profile and /profile/:nodeId)
├── ConfirmDialog (p-confirmDialog, key='deleteProfilePicture' for avatar delete confirmation)
├── (left panel) OrganizationHierarchyTreeComponent (from @falcon, only when showOrgTree=true)
├── (right panel — view/edit mode)
│   ├── Tabs: Personal | Role | Permissions
│   ├── (Personal) <falcon-uploader>, <falcon-mobile-number>, p-inputtext, p-input-group, <falcon-svg-icon>
│   ├── (Role) p-select for Status + p-select for Role
│   └── (Permissions) — placeholder section
├── ProfileOtpModalComponent (app-profile-otp-modal, mounted always; visible state by showOtpModal)
└── AddUserWizardComponent (app-add-user-wizard, mounted via *ngIf="showWizard")
    ├── DynamicStepperComponent (from @falcon)
    ├── PersonalInformationStepComponent (app-personal-information-step)
    │   ├── <falcon-uploader> (profile picture)
    │   ├── <falcon-mobile-number>
    │   └── p-inputtext with FalconCheckExistsDirective + FalconLettersDigitsMaxDirective + FalconUsernameFormatDirective + FalconFormValidateDirective + email pattern
    ├── RoleStatusStepComponent (app-role-status-step)
    │   ├── p-select for status
    │   └── p-select for role (filtered by role-edit matrix)
    ├── FalconSendCredentialsPopupComponent (from @falcon)
    └── FalconFinishAlertDialogComponent (from @falcon)
```

## Per-component

### UserProfileComponent (container)
- File: `apps/host-shell/src/app/features/user-profile/user-profile.component.ts:64-1491`
- Selector: `app-user-profile`
- Standalone: yes
- Imports (lines 67-86): `CommonModule`, `FormsModule`, `InputTextModule`, `ButtonModule`, `SkeletonModule`, `SelectModule`, `InputGroupModule`, `TranslatePipe`, `OrganizationHierarchyTreeComponent`, `FalconUploaderComponent`, `FalconMobileNumberComponent`, `AddUserWizardComponent`, `ProfileOtpModalComponent`, `FalconDividerComponent`, `InputGroupAddon`, `ConfirmDialogModule`, `SvgIconComponent`
- Providers: `ConfirmationService` (component-level)
- Services injected (lines 93-106): `UserProfileService`, `SessionProvider`, `MessageService`, `TranslateService`, `ActivatedRoute`, `Router`, `DestroyRef`, `OrgHierarchyApiService`, `RoleCatalogService`, `AccessControlFacade`, `ChangeDetectorRef`, `Helper`, `ConfirmationService`
- ViewChild: `personalForm`, `roleForm` (NgForm references)
- State (selected fields):
  - Form fields (template-driven): `firstName`, `lastName`, `userName`, `nationalId`, `phoneNumber`, `email`, `userStatus`, `roleKey`, `assignedPermissionGroup`
  - Mode: `mode: ProfilePageMode`, `activeTab: 'personal'|'role'|'permissions'`, `loading`, `saving`
  - Profile picture: `currentImageUrl`, `profilePictureInfo: ProfilePictureInfo | null`, `deleteImage`
  - Tree: `rootNode: TreeNode | null`, `selectedTreeNodeId`, `selectedTreeNode`, `loadingTree`, `loadingChildrenIds`, `loadedChildrenIds`, `expandedKeys`, `isFalcon`
  - Wizard: `showWizard`, `wizardNodeId`
  - OTP verification: `emailChanged/Verified/Touched`, `phoneChanged/Verified/Touched`, `showOtpModal`, `pendingVerificationField: VerifiableField | null`
  - Dropdowns: `statusOptions: Hook<number>[]`, `roleOptions: RoleOption[]`, `permissionGroupOptions: Hook<string>[]`, `roleSelectionEditable`
  - Profile cache: `profile: UserProfile | null`, `originalProfile: UserProfile | null`
- Lifecycle:
  - `ngOnInit` initializes options + subscribes to `route.queryParamMap` for navigation-driven state updates.
  - `ngOnDestroy` revokes any object URL created for the image.
- Save flow (`save()`, lines 732-787):
  - Builds `SaveUserProfileRequest` from local form fields.
  - Calls `profileService.updateUserProfile(payload, this.nodeId, this.originalProfile)` (or `.createUserProfile()` in Add mode — which returns a failed result by design).
  - On success: patches local cache, switches mode back to View, resets verification.
  - On failure: reloads from API.

### AddUserWizardComponent
- File: `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/add-user-wizard.component.ts:34-303`
- Selector: `app-add-user-wizard`
- Standalone: yes
- Imports: `CommonModule`, `DynamicStepperComponent`, `PersonalInformationStepComponent`, `RoleStatusStepComponent`, `FalconSendCredentialsPopupComponent`, `FalconFinishAlertDialogComponent`, `ConfirmDialogModule`, `SvgIconComponent`, `TranslatePipe`
- Inputs:
  - `selectedNode: SelectedNodeInfo | null = null`
  - `nodeId: string | null = null`
  - `nodePath: string | null = null`
  - `targetUserType!: string` (required)
  - `targetTenantId: string | null = null`
- Outputs: `cancel: EventEmitter<void>`, `finishClosed: EventEmitter<void>`
- ViewChildren: `personalStep`, `roleStep`
- Services injected: `ChangeDetectorRef`, `UserWizardService`, `TranslateService`, `ConfirmationService`, `MessageService`
- State: `currentStep`, `isCurrentStepValid`, `showSendCard`, `showFinishDialog`, `isCreating`, `wizardState`
- Stepper config (line 105-117):
```typescript
stepperConfig: StepperConfig = {
  title: 'Add New User',
  steps: [
    { label: 'Personal Information', completed: false },
    { label: 'Role & Status', completed: false },
  ],
  cancelButtonLabel: 'Cancel',
  backButtonLabel: 'Back',
  nextButtonLabel: 'Next',
  finishButtonLabel: 'Finish',
  showStepCounter: true,
  allowNavigation: true,
};
```
- On finish: opens `FalconSendCredentialsPopupComponent` for delivery-method selection; on send, calls `userWizardService.createUser(wizardState.model)`. On success → shows `FalconFinishAlertDialogComponent`.

### PersonalInformationStepComponent
- File: `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/steps/personal-information-step/personal-information-step.component.ts:19-124`
- Selector: `app-personal-information-step`
- Standalone: yes
- Imports: `CommonModule`, `FormsModule`, `InputTextModule`, `TranslatePipe`, `FalconFormValidateDirective`, `FalconCheckExistsDirective`, `FalconLettersDigitsMaxDirective`, `FalconUsernameFormatDirective`, `FalconMobileNumberComponent`, `FalconUploaderComponent`, `FalconDividerComponent`
- Inputs: `wizardState: { model: UserCreateRequest }`
- ViewChild: `form: NgForm`
- Services injected: `AccountValidationService` (`@falcon`), `ChangeDetectorRef`
- Async validator: `checkUsernameExists = (username) => this.accountValidationService.isUserExist(normalized, email, phoneNumber)` — passed to `FalconCheckExistsDirective` via input binding `[falconCheckExists]`.
- Profile-picture upload via `FalconUploaderComponent` — same Base64+extension pattern as parent.

### RoleStatusStepComponent
- File: `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/steps/role-status-step/role-status-step.component.ts:22-193`
- Selector: `app-role-status-step`
- Standalone: yes
- Imports: `CommonModule`, `FormsModule`, `SelectModule`, `TranslatePipe`, `FalconFormValidateDirective`
- Inputs: `wizardState`, `targetUserType: string`, `targetTenantId: string | null`
- Services injected: `RoleCatalogService`, `AccessControlFacade`, `TranslateService`, `Helper`
- Status options: filtered to `[UserStatus.Pending, UserStatus.Active]` (no other status assignable on create).
- Role options: fetched from `/pes/roles` via `roleCatalogService.getRoleOptions()`, then filtered through the role-edit matrix (only target roles that the actor can assign to at least one built-in source role of the same target user type).

### PermissionsPrivilegeStepComponent
- File: `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/steps/permissions-privilege-step/permissions-privilege-step.component.ts:14-61`
- Selector: `app-permissions-privilege-step`
- Standalone: yes
- Imports: `CommonModule`, `FormsModule`, `SelectModule`, `TranslatePipe`, `FalconFormValidateDirective`
- Hardcoded permission groups: Admin Group, Editor Group, Viewer Group.
- NOT in the active stepper config (which only includes Personal + Role-Status) — appears to be future work.

### ProfileOtpModalComponent
- File: `apps/host-shell/src/app/features/user-profile/components/profile-otp-modal/profile-otp-modal.component.ts:22-294`
- Selector: `app-profile-otp-modal`
- Standalone: yes
- Imports: `CommonModule`, `FormsModule`, `DialogModule`, `ButtonModule`, `InputOtpModule`, `TranslatePipe`
- encapsulation: `ViewEncapsulation.None` (styles must apply through portaled dialog content)
- Inputs:
  - `visible: boolean`
  - `field: VerifiableField | null`
  - `fieldValue: string`
- Outputs:
  - `verified: EventEmitter<VerifiableField>`
  - `dismissed: EventEmitter<void>`
- Services injected: `ProfileOtpService`, `ChangeDetectorRef`
- State machine: `OtpScreenState.Sending → Input → Verifying → Success | Error | Expired`
- Timer: `setInterval(1000)` decrementing `remainingSeconds` (default 120 from `OTP_DEFAULTS.EXPIRY_SECONDS`)
- Masked value (`maskedValue` getter):
  - Email: `t**@example.com` (first char + 2 stars + everything from `@` onward)
  - Phone: `****1234` (4 stars + last 4 digits)
- Flow:
  - `ngOnChanges`: when `visible` flips true → `resetState() → sendOtp()`.
  - `sendOtp()` posts to `verify-{email,phone}` → on success enters `OtpScreenState.Input`.
  - On OTP completion auto-submits `verify()`; posts to `verify-{email,phone}/confirm` → on success emits `verified(field)` after 900ms delay.

### Common Falcon UI used
- `<falcon-uploader>` — profile picture
- `<falcon-mobile-number>` — phone input
- `<falcon-divider>` — section separators
- `<falcon-svg-icon>` — icons
- `<organization-hierarchy-tree>` (`OrganizationHierarchyTreeComponent`) — left tree
- `<dynamic-stepper>` (`DynamicStepperComponent`) — wizard chrome
- `<falcon-send-credentials-popup>` — wizard final-step popup
- `<falcon-finish-alert-dialog>` — wizard finish confirmation
