---
patternId: PATTERN-04
name: Component .scss file → Tailwind utilities on the template
violatesRules: [R-FE-001, R-FE-002]
estimatedReach: 13 SCSS files (10 in apps, 3 in libs/falcon/shared-ui), each referenced by a styleUrls in a `.ts`
estimatedEffortPerOccurrence: 25 minutes
totalEffortHours: ~5
ammarAgent: ammar-web-platform-ui
priority: high
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Components still ship a side-car `.scss` file referenced via `styleUrls: ['./foo.component.scss']` or `styleUrl: './foo.component.scss'`. R-FE-001 (Tailwind utilities only) and R-FE-002 (no SCSS, no component CSS, no PrimeNG) forbid this — the only CSS allowed is the canonical theme entry (Tailwind tokens) plus the Stencil `.tokens.css` files inside the Falcon UI library. The post-PrimeNG-purge night-shift left these as legacy debt.

## Where it appears (top 10 file paths)
**Apps (host-shell only — admin-console + management-console are clean):**
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\layout.component.scss → layout.component.ts L29
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\sidebar\sidebar.component.scss → sidebar.component.ts L78
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\topbar\topbar.component.scss → topbar.component.ts L37
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\not-found\not-found.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\dashboard\dashboard.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\login-layout\login-layout.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\change-password.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\enter-otp\enter-otp.component.scss

**Libs (legacy `libs/falcon/shared-ui` components — should already be Tailwind-only post-Wave 16):**
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-stepper\falcon-stepper.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-photo-uploader\falcon-photo-uploader.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-mobile-number\falcon-mobile-number.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-tree-panel\falcon-tree-panel.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-tree-panel\falcon-tree-node\falcon-tree-node.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-multiselect\falcon-multiselect.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-photo-uploader\falcon-photo-uploader.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\send-credentials-popup\send-credentials-popup.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\components\falcon-form-field\falcon-form-field.component.scss

## What replaces it (the canonical pattern)
```ts
// Before
@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
})

// After — drop the styleUrls entirely
@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
})
```

```scss
/* Before — login-layout.component.scss */
.login-card {
  background: var(--color-falcon-neutral-0);
  border-radius: 12px;
  box-shadow: 0 20px 60px -20px rgba(13, 63, 68, 0.18);
  padding: 32px;
}
```

```html
<!-- After — translated to Tailwind on the template -->
<div class="bg-falcon-neutral-0 rounded-xl shadow-falcon-card p-8">
  ...
</div>
```

If a shadow / border-radius is not in the token scale, add it to `falcon-tailwind-tokens.css` (single SSOT). Do not introduce a new scss file.

## Migration steps (one-time refactor)
1. For each `.scss`, list every selector + declaration.
2. For each selector, find the template node and replace with Tailwind utilities.
3. Add any missing token aliases to `libs/falcon-theme/src/falcon-tailwind-tokens.css` BEFORE deleting the scss (one-line PRs per token).
4. Delete the `.scss` file and the `styleUrls` / `styleUrl` line on the `.ts`.
5. Build all three apps + visual smoke.

## Detection regex
```
styleUrls?\s*:\s*\[?\s*['"][^'"]+\.scss
```

## Falcon components / libs involved
- Tokens SSOT: `libs/falcon-theme/src/falcon-tailwind-tokens.css`
- Component token catalogues: `libs/falcon-ui-tokens/src/components/*.tokens.css`

## Risk + verification
- Build: `nx build host-shell admin-console management-console`.
- High risk for `layout.component.scss`, `sidebar.component.scss`, `topbar.component.scss` — these contain layout primitives that the entire host-shell relies on. Migrate them last and pixel-diff every chrome screenshot.
- Auth feature scss files are simpler — start there.
- Libraries: any `libs/falcon/shared-ui` scss is consumed by all three apps; a regression cascades.
