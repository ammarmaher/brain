# Components — host-shell core

## Tree
```
App (selector: app-root)
└── RouterOutlet
    ├── LayoutComponent (route: /)
    │   ├── ConfirmDialog (p-confirmDialog with falcon-svg-icon template)
    │   ├── SidebarComponent (app-sidebar)
    │   └── <main>
    │       ├── <header>
    │       │   ├── BreadcrumbComponent (app-breadcrumb)
    │       │   ├── FalconIconComponent (search, bell icons)
    │       │   └── UserProfileMenuComponent (app-user-profile-menu)
    │       │       └── ChangePasswordModalComponent (app-change-password-modal, lazy via *ngIf)
    │       └── <router-outlet>  (renders DashboardComponent / UserProfileComponent / Demo features / remote MFEs)
    ├── UnauthorizedComponent (/401)
    ├── NotFoundComponent (/not-found)
    ├── ErrorComponent (/error)
    └── LoginLayoutComponent (/login)
        └── <router-outlet>
            ├── GetStartedComponent
            ├── EnterOtpComponent
            ├── ChangePasswordComponent (auth feature)
            └── ForgotPasswordFlowComponent

Top-level overlay (rendered in App template):
└── p-toast (PrimeNG ToastModule)
```

## Per-component

### App
- File: `apps/host-shell/src/app/app.ts:6-18`
- Selector: `app-root`
- Standalone: yes
- Imports: `RouterOutlet`, `ToastModule`
- Inputs / Outputs: none
- Services injected: `PrimeNGThemeService` (eagerly via `inject()` to trigger constructor side-effects)
- Template: inline — `<p-toast></p-toast>` + `<router-outlet></router-outlet>`
- File: `apps/host-shell/src/app/app.html:1` is a duplicate single-line `<router-outlet>` (not used; templateUrl is not set, inline template wins).

### LayoutComponent
- File: `apps/host-shell/src/app/layout/layout.component.ts:37-562`
- Selector: `app-layout`
- Standalone: yes
- Imports: `RouterModule`, `SidebarComponent`, `BreadcrumbComponent`, `UserProfileMenuComponent`, `FalconIconComponent`, `ConfirmDialogModule`, `SvgIconComponent`
- Inputs / Outputs: none
- Services injected: `Router`, `ActivatedRoute`, `SessionProvider` (`@falcon`), `RouteAccessService` (`@falcon`), `AccessControlFacade` (`@falcon`), `ChangeDetectorRef`, `UserApiService`, `RoleCatalogService`
- Forms: none
- State: imperative class fields (`navItems`, `user`, `currentPage`, `isSidebarCollapsed`)
- Template highlights (`layout.component.html:1-77`):
  - p-confirmDialog with custom ng-template for icon + message
  - `<app-sidebar>` with `[navItems]`, `[brandText]`, `[brandLogoUrl]`, `[collapsed]`, `(collapsedChange)`
  - `<header>` with breadcrumb, search button, bell button, user-profile menu
- Falcon components used: `<falcon-icon>` (search/bell), `<falcon-svg-icon>` (in p-confirmDialog template)
- Lifecycle: builds dynamic nav items based on `sessionProvider.userType` (Falcon=1 / Client=2), normalizes access via `RouteAccessService.getSafeLink()`, applies PES via `AccessControlFacade.ensure()` then `can()` per nav item, listens to `router.events` for `NavigationEnd` to update page title from `route.data.breadcrumb`.
- Loads user profile from `/user/me` on init (line 135-172).

### SidebarComponent
- File: `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts:21-175`
- Selector: `app-sidebar`
- Standalone: yes
- Imports: `NgIf`, `NgFor`, `NgClass`, `RouterLink`, `RouterLinkActive`, `FalconIconComponent`, `ButtonModule`
- Inputs:
  - `navItems: NavItem[]` (required)
  - `brandText = 'FALCON'`
  - `brandLogoUrl: string | undefined` (setter resolves `assets/...` paths)
  - `collapsed = false`
- Outputs: `collapsedChange: EventEmitter<boolean>`
- Services injected: `Router`, `ChangeDetectorRef`
- changeDetection: `OnPush`
- Behavior: builds expanded-children map per nav route, auto-expands parents on `NavigationEnd`, navigates via `router.navigateByUrl()` with `state: { mode: 'view' }` for `AdminConsole`-scoped items.

### BreadcrumbComponent
- File: `apps/host-shell/src/app/layout/components/breadcrumb/breadcrumb.component.ts:9-85`
- Selector: `app-breadcrumb`
- Standalone: yes
- Imports: `CommonModule`, `RouterModule`, `FalconIconComponent`
- Inputs: `showHomeIcon = true`
- Outputs: none
- Services injected: `Router`, `ActivatedRoute`
- Behavior: builds `{label, url}[]` by walking active-route tree, reading `data.breadcrumb`. Always prepends `{ label: 'Home', url: '/shell' }` and appends current crumb if different.

### LanguageToggleComponent
- File: `apps/host-shell/src/app/layout/components/language-toggle/language-toggle.component.ts:7-92`
- Selector: `app-language-toggle`
- Standalone: yes
- Imports: `CommonModule`
- Inputs / Outputs: none
- Services injected: `FALCON_LANGUAGE` token (`FalconLanguageFacade` cast to `HostLanguageFacade`)
- Inline template: checkbox `language-toggle-switch` toggling `'ar' | 'en'`.

### ThemeToggleComponent
- File: `apps/host-shell/src/app/layout/components/theme-toggle/theme-toggle.component.ts:7-90`
- Selector: `app-theme-toggle`
- Standalone: yes
- Imports: `CommonModule`
- Inputs / Outputs: none
- Services injected: `FALCON_THEME` token (`FalconThemeFacade` cast to `HostThemeFacade`)
- Behavior: subscribes to `hostTheme.theme$` via `takeUntilDestroyed(destroyRef)`; toggles `'dark' | 'light'` on `<html>` via `classList`.

### UserProfileMenuComponent
- File: `apps/host-shell/src/app/layout/components/user-profile-menu/user-profile-menu.component.ts:40-262`
- Selector: `app-user-profile-menu`
- Standalone: yes
- Imports: `CommonModule`, `RouterModule`, `TranslatePipe` (`@falcon`), `ChangePasswordModalComponent`
- Inputs: `user: User` (required)
- Outputs: none
- Services injected: `AuthService`, `Router`, `ChangeDetectorRef`, `TranslateService` (`@falcon`), `FALCON_THEME`, `FALCON_LANGUAGE`
- ViewChildren: `dropdownButton`, `dropdownMenu`
- State: `isMenuOpen`, `showChangePasswordModal`, `currentTheme`, `currentLanguage`
- HostListener: `document:click`, `document:keydown.escape`
- Menu items: `Profile` → navigates to `/profile`, `Change Password` → opens modal.
- Calls `authService.logout()` for sign-out.

### ChangePasswordModalComponent (LAYOUT version)
- File: `apps/host-shell/src/app/layout/components/user-profile-menu/change-password-modal/change-password-modal.component.ts:21-186`
- Selector: `app-change-password-modal`
- Standalone: yes
- Imports: `CommonModule`, `FormsModule`, `DialogModule`, `ButtonModule`, `InputTextModule`, `TranslatePipe`
- Inputs: `visible = false`
- Outputs: `visibleChange: EventEmitter<boolean>`
- Services injected: `ChangePasswordService` (layout-local, see SERVICES-APIS), `TranslateService`, `MessageService`, `AuthService`
- Forms: template-driven `[(ngModel)]` for `currentPassword`, `newPassword`, `confirmPassword`
- Submit calls `changePasswordService.changePassword(payload)` → if `isSuccessful` → toast + 1s delay + `authService.logout()` (to force re-auth with new password).
