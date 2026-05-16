# Components — not-found

### NotFoundComponent
- File: `apps/host-shell/src/app/features/not-found/not-found.component.ts:6-20`
- Selector: `app-not-found`
- Standalone: yes
- Imports: `ButtonDirective` from `primeng/button`
- Inputs / Outputs: none
- Services injected: `Router` (from `@angular/router`)
- Methods:
  - `goHome()` → `router.navigate(['/shell'])`

### Template (`not-found.component.html:1-20`)
```html
<div class="not-found-container">
  <div class="content">
    <img src="assets/images/under-construction.png" alt="Under Construction" class="under-construction-img" />
    <h1 class="title">Page Under Construction</h1>
    <p class="message">
      We're working hard to bring this page to life. Please check back soon!
    </p>
    <button
      pButton
      label="Back to Dashboard"
      icon="pi pi-home"
      class="p-button-rounded p-button-primary mt-3"
      (click)="goHome()"
    ></button>
  </div>
</div>
```

### Falcon components used
None. Pure PrimeNG (`<button pButton>` with `pi pi-home` icon).
