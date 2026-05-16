# Components — Demo

## Tree
```
ShellComponent (selector: app-shell, route: /shell)
└── FacadeStatusComponent (selector: app-facade-status1)

AuthViewComponent (selector: app-auth-view, route: /auth-view)
├── <a routerLink="/shell">
├── <button (click)="logout()">
└── FacadeStatusComponent (selector: app-facade-status1)
```

## Per-component

### ShellComponent
- File: `apps/host-shell/src/app/features/Demo/shell/shell.component.ts:6-25`
- Selector: `app-shell`
- Standalone: yes
- Imports: `FacadeStatusComponent`, `RouterLink`
- Inputs / Outputs: none
- Services injected: `FALCON_CONTEXT` token (`FalconContextFacade`)
- State: `contextValue?: string` — assigned in `ngOnInit` from `context?.getContext?.().env`.
- Template (`shell.component.html`):
  - Card with title "Host: App-chassis", subtitle "This page is served from the host {{contextValue}}."
  - `<a routerLink="/auth-view">Go to Auth View</a>`
  - `<app-facade-status1>`

### AuthViewComponent
- File: `apps/host-shell/src/app/features/Demo/auth-view/auth-view.component.ts:6-19`
- Selector: `app-auth-view`
- Standalone: yes
- Imports: `RouterLink`, `FacadeStatusComponent`
- Inputs / Outputs: none
- Services injected: `AuthService` (host core)
- Methods: `logout()` → `authService.logout()`
- Template (`auth-view.component.html`):
  - `<h2>Auth View</h2>`
  - Navigation row with `← Back to Shell` link to `/shell` + Logout button.
  - `<app-facade-status1>` underneath.

### FacadeStatusComponent
- File: `apps/host-shell/src/app/features/Demo/facade-status/facade-status.component.ts:19-65`
- Selector: `app-facade-status1` (note the digit suffix — collision avoidance with a similar component elsewhere)
- Standalone: yes
- Imports: `CommonModule`
- Inputs / Outputs: none
- Services injected: `FALCON_AUTH`, `FALCON_LANGUAGE`, `FALCON_THEME`, `FALCON_NOTIFIER`, `FALCON_CONTEXT` tokens
- State: `data = signal<FacadeRow[]>([])`, `rows = computed(() => data())`
- Lifecycle: `ngOnInit` reads each facade once and builds a row array:
  - `FALCON_FACADE_TOKENS.AUTH` → `id: …, access: …`
  - `FALCON_FACADE_TOKENS.LANGUAGE` → string (e.g. `'en'`)
  - `FALCON_FACADE_TOKENS.THEME` → string (e.g. `'light'`)
  - `FALCON_FACADE_TOKENS.CONTEXT` → JSON stringified
- Template (`facade-status.component.html`):
  - `<table><thead><tr><th>Facade</th><th>Value</th></tr></thead><tbody><tr *ngFor="let row of rows()">...</tr></tbody></table>`

#### Internal interface
```typescript
type FacadeRow = { key: string; value: string };
```
