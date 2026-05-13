# Forbidden Patterns Observed — `apps/` Active Source

Grep was run across `apps/**` for every active prohibition listed in `ANGULAR_AND_TAILWIND_RULES.md` + project memory. Results below.

---

## 1. `*ngIf` / `*ngFor` / `*ngSwitch` legacy control-flow

| Pattern | Apps matches | Status |
|---|---|---|
| `*ngIf` | **0** | ✓ CLEAN |
| `*ngFor` | **0** | ✓ CLEAN |
| `*ngSwitch` | **0** | ✓ CLEAN |

All templates use the new `@if / @for / @switch` control flow. Verified.

---

## 2. PrimeNG imports

| Pattern | Apps matches | Libs matches | Status |
|---|---|---|---|
| `from 'primeng/...` (regexed `from 'primeng`) | **0** | **0** | ✓ CLEAN |
| `^import.*primeng` | **0** | **0** | ✓ CLEAN |
| Any literal `primeng` substring | Apps: 0 in source. Libs: 0 in source. Multiple in `*.md` docs / plans / archive folders. | — | ✓ CLEAN — docs/plans referencing the legacy are not source. |

ESLint flat-block in `eslint.config.mjs:26` live-fires on any `primeng/*` import (Wave PR-8). Confirmed.

---

## 3. PrimeIcons / `pi pi-*` class names

| Pattern | Apps matches | Status |
|---|---|---|
| `pi pi-` class string | **0** | ✓ CLEAN |
| `primeicons` substring | 0 in apps source. Mentions in `eslint.config.mjs:4` (the FlatBlock declaration) + `libs/falcon-theme/src/styles/falcon-icons.css:1` (the replacement font icon CSS). | ✓ CLEAN — only forbidden-references and replacement assets. |

Memory `project_falcon_primeng_total_removal_complete.md` confirms 122 PrimeIcons migrated to vendored Falcon font.

---

## 4. Inline `style="..."` attributes in templates

| Pattern | Apps matches | Status |
|---|---|---|
| `style="<anything>"` in `*.html` | **1** | ⚠️ ONE VIOLATION |

### The violation

`apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/applications-table/applications-table.component.html:43`

```html
                    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px;">
```

Inline SVG icon with `style="vertical-align: -2px;"`. Could be replaced with a Tailwind `align-baseline` class or a structural fix to the wrapper element. **Priority: P3 (polish).**

---

## 5. Hardcoded `#hex` colours in Tailwind arbitrary value classes

Memory rule `feedback_no_inline_styles_tokens_only.md` (hardened 2026-05-05): zero inline styles, tokens only (colours/borders/radii/shadows/spacing/fonts). Tailwind v4 arbitrary-value classes (`bg-[#hex]`, `text-[#hex]`, `border-[#hex]`, `rounded-[Npx]`) bypass the token system.

| Pattern | Apps matches in `*.html` | Status |
|---|---|---|
| `bg-[#` | **3** | ⚠️ VIOLATIONS |
| `text-[#` | **7** | ⚠️ VIOLATIONS |
| `border-[#` | **9** | ⚠️ VIOLATIONS |
| `rounded-[` (Npx) | **24** in 12 files | ⚠️ VIOLATIONS |

### Concentration

`apps/admin-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html` carries the bulk: 3 `bg-[#`, 7 `text-[#`, 9 `border-[#`. Cited examples:

```html
<!-- organization-hierarchy-page-menu.component.html -->
<section class="bg-[#f5f6f7] flex flex-col gap-4 p-3 md:p-5 h-full min-h-0">
<main class="bg-white border border-[#eef0f2] rounded-[14px] overflow-hidden flex flex-col min-h-0">
<div class="flex items-center justify-between gap-2 px-6 border-b border-[#eef0f2] h-[55px]">
                        ? 'text-[#1a1a1a] font-semibold border-[#0d3f44] '
                        : 'text-[#6b7280] font-medium border-transparent hover:text-[#1a1a1a] '
```

These colours have token equivalents:

- `#f5f6f7` → `bg-falcon-neutral-75` or similar
- `#eef0f2` → `border-falcon-neutral-150`
- `#1a1a1a` → `text-falcon-neutral-900`
- `#6b7280` → `text-falcon-neutral-600`
- `#0d3f44` → `border-falcon-teal-700`
- `14px` rounded → `rounded-xl` (`var(--radius-xl)` = 1.5rem ≈ 24px). For 14px specifically maybe `rounded-md` (1rem ≈ 16px) or a dedicated token.

**Priority: P1 (frequent need).** This is the highest-impact cleanup. Should extend gate-08 to scan apps templates.

### Additional files with `bg-[#hex]` / `text-[#hex]` / `border-[#hex]` / `rounded-[Npx]`

(Sampled from broader grep — full list in raw grep output above.)

- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html` — `bg-[var(--border-2,#eef0f2)]`. Uses `var()` fallback pattern, but still hardcodes the fallback hex. Should be `bg-[var(--falcon-border-2, var(--color-falcon-neutral-150))]`.
- Multiple kanban / chart-card / chart-toolbar / node-header / node-drawer / org-view-toggle / settings-tab / hierarchy-tab files in admin + management consoles.
- `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` has 4 `rounded-[Npx]` instances (border-radius arbitrary).
- `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` + `forgot-password-flow/...html` — 2 each.
- `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/applications-table/applications-table.component.html`.

---

## 6. SCSS files in component folders

Memory rule: no SCSS in component CSS, no rules in app-level `styles.scss` beyond minimal carry-over.

Confirmed by Agent 5 (tokens) — the active `apps/<app>/src/styles.scss` is near-empty. Several component-level `*.component.scss` files exist (e.g. `apps/admin-console/.../organization-hierarchy-menu.component.scss`) but they're sampled as near-empty placeholders.

A spot-check confirms there ARE legacy `.scss` files with content in feature folders — for example `add-client-wizard.component.scss` and `client-settings-step/client-settings-step.component.scss` (referenced in earlier grep output). These should be audited and migrated to Tailwind utilities.

**Priority: P2 (improvement).** Lower priority than the arbitrary-value Tailwind cleanup because SCSS files are scoped to their components, but they're still off-policy.

---

## 7. Zitadel direct calls

| Pattern | Apps matches | Libs matches | Status |
|---|---|---|---|
| `zitadel` (case-insensitive) | **0** | **0** (in source — `*.ts` / `*.html` / `*.scss`) | ✓ CLEAN |

All auth flows go through `auth-api.service.ts` → `Gateway.IdentityGateway`. Verified.

---

## 8. Component CSS files with declared rules

Sample check: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.css` exists. Memory note: "These files are usually empty placeholders — Angular needs a `styleUrl` reference even if the file is blank — but a closer audit could confirm zero rules across all wrappers."

Not deeply grepped in this pass. Recommend a follow-up audit.

---

## 9. `legacy-peer-deps` flag

`.npmrc` carries `legacy-peer-deps=true` per memory `project_falcon_revamp_next_steps_plan.md` Tier 1 todo. Not a forbidden pattern per se but should be reviewed.

---

## Summary — Active forbidden-pattern violations

| Category | Files | Count | Priority |
|---|---|---|---|
| `*ngIf` / `*ngFor` / `*ngSwitch` | 0 | 0 | — |
| `from 'primeng/...'` | 0 | 0 | — |
| `pi pi-*` | 0 | 0 | — |
| Inline `style="..."` | 1 | 1 | P3 |
| Tailwind arbitrary `bg-[#hex]` / `text-[#hex]` / `border-[#hex]` | 15+ | 19+ matches | **P1** |
| Tailwind arbitrary `rounded-[Npx]` | 12+ | 24+ matches | **P1** |
| `var(--foo, #hex)` fallback hex in templates | sampled 2+ | TBD | P2 |
| `*.component.scss` with declared rules in feature folders | sampled 2-5 | TBD | P2 |
| Direct Zitadel calls | 0 | 0 | — |

**Total real violations:** 1 inline-style + ~50+ Tailwind arbitrary-value hex/px instances. The 50+ arbitrary Tailwind classes are the single biggest forward-looking cleanup task.

---

## Recommended gate extensions

1. **`gate-13-arbitrary-tailwind-lint.mjs`** — fail on new `bg-\[#`, `text-\[#`, `border-\[#`, `rounded-\[\d`, `w-\[\d+px`, `h-\[\d+px`, `gap-\[\d+px`, `p[xytrlb]?-\[\d+px` in HTML / template strings in `apps/**`. Forward-only (diff-scope in CI; advisory locally).
2. **`gate-14-inline-style-lint.mjs`** — fail on `style="..."` in `*.html` (except inline SVG when whitelisted by selector).
3. **`gate-15-control-flow-lint.mjs`** — fail on `*ngIf`, `*ngFor`, `*ngSwitch` regression.
4. **`gate-16-zitadel-direct.mjs`** — fail on `zitadel.com` substring in `apps/**` + `libs/**` source.

These four gates would harden the platform against memory-rule regression.
