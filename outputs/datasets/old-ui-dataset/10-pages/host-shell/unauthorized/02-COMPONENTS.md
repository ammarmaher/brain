# Components — unauthorized

### UnauthorizedComponent
- File: `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts:5-74`
- Selector: `app-unauthorized`
- Standalone: yes
- Imports: `CommonModule`, `RouterModule`
- Inputs / Outputs: none
- Services injected: none
- Inline template:
```html
<div class="unauthorized-container">
  <div class="unauthorized-content">
    <h1 class="error-code">401</h1>
    <h2 class="error-title">Unauthorized Access</h2>
    <p class="error-message">You do not have permission to access this resource.</p>
    <a routerLink="/shell" class="back-link">Return to Home</a>
  </div>
</div>
```
- Inline styles use **CSS variables with hex fallbacks**:
  - `background-color: var(--color-bg, #f5f5f5)`
  - `background: var(--color-surface, white)`
  - `color: var(--color-danger, #e74c3c)` (for the `401` numeral)
  - `color: var(--color-text, #333)`
  - `color: var(--color-text-muted, #666)`
  - `background-color: var(--color-primary, #007bff)`
  - `color: var(--color-primary-contrast, white)`
  - `:hover` → `background-color: var(--color-primary-hover, #0056b3)`

### Falcon components used
None. Pure HTML + `routerLink`.

### Visual treatment
- "401" rendered at 6rem font-size, bold, red.
- Title 2rem, body 1.1rem.
- Card has `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`, `border-radius: 8px`.
- Centered viewport min-height 100vh.
