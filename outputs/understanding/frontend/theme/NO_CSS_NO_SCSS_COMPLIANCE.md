*** No-CSS / No-SCSS compliance audit ***
*** Hardened rule: Tailwind utilities on templates only, no SCSS, no component CSS, no PrimeNG. ***
*** Verified against active source at 2026-05-13 ***

# Compliance audit: no SCSS, no component CSS

## The rule

Per:
- `feedback_v02_theme_adopted.md` — "Tailwind utilities on templates only — no SCSS, no component CSS, no PrimeNG. Falcon UI Core (`<falcon-*>`) is the only UI kit."
- `feedback_no_inline_styles_tokens_only.md` (HARDENED 2026-05-05) — "zero inline styles, tokens only (colors/borders/radii/shadows/spacing/fonts)."
- `project_brain_skills_primeng_purge.md` — "Tailwind utilities on templates only; canonical theme entry is the sole CSS file allowed."
- `ANGULAR_AND_TAILWIND_RULES.md §1` — "No SCSS in component CSS files (and no rules in app-level `styles.scss` beyond minimal carry-overs)."

**Allowed CSS**:
- `libs/falcon-theme/src/falcon-tailwind-tokens.css` (the SSOT `@theme` block)
- `libs/falcon-theme/src/styles/falcon-icons.css` (vendored Falcon icon font)
- `libs/falcon-ui-tokens/src/**/*.css` (token contracts — primitives, semantic, themes, density, rtl, components)
- `libs/falcon-ui-core/src/components/<name>/<name>.css` (Stencil Shadow DOM stylesheets — required by Stencil)
- `apps/<app>/src/tailwind.css` (Tailwind v4 entry; `@source` + `@import` directives only)
- Minimal `apps/<app>/src/styles.scss` carry-overs (file kept; should be near-empty).
- `:host { display: block }` placeholders in Angular wrapper `*.component.css` (required by Angular's `styleUrl` reference; ideally empty).

**Not allowed**:
- Per-component `*.component.scss` files with real rules in `apps/<app>/src/app/features/**/`.
- Per-component `*.component.css` files with real rules in `libs/falcon-ui-core/src/angular-wrapper/components/**/`.
- Any other `*.scss` / `*.css` file with declarations not in the allowlist above.

---

## Compliance status

### ✅ Compliant

#### 1. Angular wrapper component CSS (`libs/falcon-ui-core/src/angular-wrapper/components/**/*.component.css`)

**28 files audited.** All 3-11 lines. All contain only `:host { display: block; width: 100% }` or the minimum `:host` rule needed for layout.

Sample (`falcon-input.component.css` — 10 lines, 216 bytes):
```css
:host { display: block; width: 100%; }
:host.falcon-angular-input falcon-input {
  display: block;
  width: 100%;
}
```

No rule declares color, font, padding, border, shadow, etc. ✅ Fully compliant.

#### 2. Stencil Shadow DOM CSS (`libs/falcon-ui-core/src/components/<name>/<name>.css`)

These files ARE permitted — Stencil Shadow components need their own stylesheet. The Shadow CSS reads `--falcon-<component>-*` tokens and renders via the shadow root. This is the SSOT for the Shadow render path.

#### 3. `libs/falcon-theme/src/` files

All 3 files (`falcon-tailwind-tokens.css`, `index.css`, `styles/falcon-icons.css`) are in the allowlist. Compliant.

#### 4. `libs/falcon-ui-tokens/src/` files

All 60+ files (primitives × 6, semantic × 1, themes × 2, density × 2, rtl × 1, components × 45 + index) are in the allowlist. Compliant.

#### 5. `apps/management-console/src/styles.scss`

3-line carry-over. Comment-only post-PrimeNG removal. Compliant.

```scss
/* *** Wave PR-8: legacy commented PrimeNG `@import` lines removed; the entire
       primeng/ override directory under libs/falcon/src/theme/styles/ is gone.
       Add management-console-specific styles below as needed. *** */
```

#### 6. `apps/admin-console/src/styles.scss`

19 meaningful lines. Contains `.contracts-page` font-resets — these are global UA-override patches for a single feature page. Borderline carry-over; should migrate to a Tailwind utility approach in the contracts-page template. **Borderline compliant — flag for future cleanup.**

#### 7. `apps/management-console/src/tailwind.css`

25 lines, zero safelist. The Tailwind entry — allowed.

---

### ❌ NON-COMPLIANT

#### 8. `apps/host-shell/src/styles.scss` — Brand-font override

**19 meaningful lines.** Contains the host-shell font override:

```scss
/* Reset default UA body margin (matches React prototype) */
html, body { margin: 0; padding: 0; }

/* Force React-prototype fonts globally — Poppins (LTR) + IBM Plex Sans Arabic (RTL) */
:root {
  --font-sans: 'Poppins', 'Inter', system-ui, sans-serif;
}
[dir="rtl"], html[dir="rtl"] {
  --font-sans: 'IBM Plex Sans Arabic', 'Poppins', sans-serif;
}
html, body, app-root {
  font-family: 'Poppins', 'Inter', system-ui, sans-serif !important;;
}
[dir="rtl"], [dir="rtl"] body {
  font-family: 'Poppins', 'Inter', system-ui, sans-serif !important;
}
/* Force form elements to inherit font (UA defaults to Arial otherwise) */
button, input, select, textarea {
  font-family: inherit !important;
}
```

**Violations**:
1. Overrides `--font-sans` outside the SSOT.
2. Uses `!important` to defeat the SSOT chain.
3. Double semicolon on line 17 (parse hazard).
4. Conflicts with `feedback_v02_theme_adopted.md` ("V0.2 theme adopted as Falcon source of truth via Tailwind v4 @theme single source").

**Recommended fix**: UPGRADE_CANDIDATES UP-10 — reconcile brand-font decision; either update SSOT to Poppins-first OR remove this override. Decision required.

---

#### 9. Feature component SCSS files — 20+ files with real rules

These violate the rule "no SCSS in component CSS files":

| FILE | MEANINGFUL LOC | OVERRIDES SUSPECTED | SAMPLE VIOLATION |
|---|---|---|---|
| `host-shell/.../forgot-password-flow.component.scss` | 496 | `--otp-*` tokens, `:host` flexbox, `.fpf-title` font-size, `.fpf-step` padding | Custom OTP geometry tokens defined inside `:host` (not in SSOT) |
| `host-shell/.../dashboard.component.scss` | 443 | Dashboard bar/gauge geometry, KPI card styles | Bar-height styles |
| `host-shell/.../enter-otp.component.scss` | 309 | OTP input styling | Same OTP token pattern as forgot-password |
| `host-shell/.../login-layout.component.scss` | 291 | Login page chrome | Page-level layout |
| `host-shell/.../get-started.component.scss` | 207 | Onboarding card styles | Per-card layout |
| `host-shell/.../change-password.component.scss` | 207 | Form layout | Form padding/typography |
| `admin/.../organization-hierarchy-menu.component.scss` | 217 | **Uses `::ng-deep` against `.p-tablist`** | `:host(.org-menu) ::ng-deep .p-tablist .p-tablist-tab-list { position: relative; padding-right: 160px; height: 55px; }` |
| `admin/.../applications-table.component.scss` | 183 | Table-specific overrides | Cell padding |
| `admin/.../client-settings-step.component.scss` | 117 | Wizard step content | Step layout |
| `admin/.../falcon-org-chart.component.scss` | 131 | Org-chart canvas | Pixel-precise positioning |
| `admin/.../add-user-wizard.component.scss` | 54 | Wizard shell | Wizard padding |
| `admin/.../add-client-wizard.component.scss` | 54 | Wizard shell | Wizard padding |
| `host-shell/src/app/layout/layout.component.scss` | 44 | Shell layout, scrollbar styles | `::-webkit-scrollbar` + SCSS variables for colors |
| `admin/.../client-service-row-table.component.scss` | 45 | Service row table | Custom cell rules |
| `admin/.../falcon-chart-card.component.scss` | 36 | Chart card | Card layout |
| `admin/.../falcon-org-user-card.component.scss` | 31 | Org-chart user card | Card layout |
| `host-shell/.../not-found.component.scss` | 30 | 404 page | Centering, illustration |
| `admin/.../falcon-org-kanban.component.scss` | 8 | Kanban shell | Layout |

**Sub-violations**:

- **PrimeNG selector `.p-tablist` referenced in admin-console/.../organization-hierarchy-menu.component.scss** — `::ng-deep .p-tablist` references PrimeNG even though PrimeNG was removed in Wave PR-8. This is dead-code reference; the selector matches nothing. Should delete the block.
- **Custom `--otp-*` tokens declared inside `:host` in 2 files** — these tokens are not in the SSOT and not in `libs/falcon-ui-tokens/`. They are component-local — but per the SSOT-only rule, they should be promoted to a `libs/falcon-ui-tokens/src/components/otp.tokens.css` declaration. The OTP component-token file EXISTS already (156 lines, 67 tokens), so the SCSS files are duplicating/conflicting with it.
- **`::ng-deep` usage** in several files — Angular `::ng-deep` is technically deprecated and writes through view-encapsulation boundaries. The remaining `::ng-deep` usages target PrimeNG class names that no longer render. Either delete or convert to global rules.
- **SCSS variables (`$color-bg`, `$color-surface`, etc.) in layout.component.scss** — uses SCSS variable syntax to alias CSS custom properties. Functionally equivalent to using `var(--color-falcon-neutral-0)` directly, but adds a SCSS compile step for no benefit.

#### 10. Legacy bespoke component SCSS in `libs/falcon/src/shared-ui/lib/components/**` (8 files)

| FILE | LOC |
|---|---|
| `falcon-multiselect.component.scss` | 297 |
| `falcon-tree-node.component.scss` | 254 |
| `send-credentials-popup.component.scss` | 215 |
| `falcon-tree-panel.component.scss` | 152 |
| `falcon-stepper.component.scss` | 141 |
| `falcon-photo-uploader.component.scss` | ~25 |
| `falcon-mobile-number.component.scss` | ~21 |
| `falcon-form-field.component.scss` | ~14 |

**Verdict**: These are LEGACY bespoke Angular components flagged as deprecation candidates in `FALCON_COMPONENT_REGISTRY.md`. The expectation is that consumers migrate to `<falcon-angular-*>` Falcon UI components and these legacy components retire. The SCSS in them is acceptable until they retire. **OK while in-deprecation; should die with the components.**

---

## Summary statistics

- **Allowed CSS/SCSS files**: ~70 files across SSOT + token system + Stencil + minimal carry-overs.
- **Compliant Angular wrapper CSS**: 28 / 28 files (100%).
- **Violations — feature SCSS**: 18 files (real rules in `apps/<app>/src/app/features/`).
- **Violations — global SCSS**: 1 file (`apps/host-shell/src/styles.scss` — font override).
- **Borderline — global SCSS**: 1 file (`apps/admin-console/src/styles.scss` — global UA-override patches).
- **Legacy deprecation cohort**: 8 SCSS files in `libs/falcon/src/shared-ui/lib/components/`.

**Total non-compliant files**: 19 (excluding legacy cohort).
**Total non-compliant LOC**: ~3,200 lines of SCSS rules that should not exist.

---

## Recommended actions

1. **UP-03 — Add `gate-14-no-feature-scss.mjs`** (P0). Pin existing files to current LOC. Block any new SCSS rules.
2. **UP-10 — Reconcile `apps/host-shell/src/styles.scss` font override** (P2). Decision required: Poppins-first (update SSOT) OR Neue Haas (remove override).
3. **Per-feature migration plan** — chunk the 18 feature SCSS files into per-wave migration tasks. Estimated effort: 5-15 days per file; total ~3-8 weeks for the cohort.
4. **Remove dead `::ng-deep .p-*` references** in admin-console/.../organization-hierarchy-menu.component.scss. These match nothing post-PrimeNG.
5. **Promote local custom tokens to `libs/falcon-ui-tokens/src/components/`** — the OTP `--otp-*` tokens in forgot-password-flow + enter-otp duplicate the OTP component-token file.

---

## Cross-references

- See `STATIC_STYLE_RISKS.md` for inline-style + hardcoded-hex violations.
- See `UPGRADE_CANDIDATES.md` UP-03 + UP-10 for the gate + override-reconcile workstreams.
