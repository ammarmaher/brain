# Components — error

### ErrorComponent
- File: `apps/host-shell/src/app/features/error/error.component.ts:5-62`
- Selector: `app-error`
- Standalone: yes
- Imports: `CommonModule`, `RouterModule`
- Inputs / Outputs: none
- Services injected: none
- Template (inline, `template: ` block):
```html
<div class="error-container">
  <div class="error-card">
    <h1>Access Check Failed</h1>
    <p>Falcon could not complete the authorization check for this request.</p>
    <a routerLink="/shell" class="back-link">Return to Home</a>
  </div>
</div>
```
- Styles (inline, `styles: [...]` block):
  - Hardcoded gradient `#f4f7fb → #e7eef9`.
  - Card with `background: #ffffff`, `border-radius: 1rem`, `box-shadow: 0 1.5rem 3rem rgba(24, 39, 75, 0.12)`.
  - Heading color `#1f2937`, paragraph `#4b5563`.
  - Back-link `background: #1d4ed8`, `color: #ffffff`.
- No PrimeNG, no `<falcon-icon>`, no `<falcon-button>` — just an `<a>`.
