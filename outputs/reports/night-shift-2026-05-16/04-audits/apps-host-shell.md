---
title: Senior Architect A3 — apps/host-shell audit
date: 2026-05-16
scope: C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\**
auditor: Senior Architect A3 (Module Federation host)
mode: READ-ONLY
upstream_inputs:
  - 00-PLAN.md
  - 01-rules-digest.md (38 rules: 6 P0, 15 P1, 17 P2)
  - 02-token-registry-quick-grep.txt
---

# Host-Shell App Audit — apps/host-shell

## 0. Executive summary

`apps/host-shell` is the Module Federation **host** for the client-facing Falcon platform. It owns auth flows, the shell layout (sidebar + topbar), the Falcon-UI showcase / playground, two reference shared-components (one canonical wrapper, one decorator-style), and the remote-module loader.

The shared-components layer is in healthy shape — `OrganizationHierarchyTreeComponent` is a textbook example of the library-skeleton + app-wrapper pattern (signals, OnPush, no constructor injection, PES gating only at wrapper layer). However, **the entire auth feature surface is a regression**: five SCSS files (~1.7k lines) drive the login / OTP / change-password / forgot-password screens via 163 references to `--login-*` CSS variables that **do not exist anywhere in the workspace token registry**. The auth screens also bypass the Falcon UI library entirely — raw `<input>` / `<button>` / `<svg>` markup, hand-rolled BEM, `mr-2` / `text-left` physical directionality.

The Module Federation surface is sound (no remotes registered, single zone, Angular eager-share contract preserved). The two stale `app/remote-route.service.ts` and `app/remote-config.ts` files at the wrong path (canonical copies live in `app/core/services/`) are dead code.

The bottom line: **6 P0, 23 P1, 26 P2 distinct findings**, the largest single remediation being to delete all 11 SCSS files and rebuild the auth feature on Tailwind utilities + Falcon library controls + existing tokens.

## 1. Inventory

| Bucket | Count | Notes |
|---|---|---|
| Files in scope (`src/**`, excluding generated/test) | 172 | |
| TypeScript files in `app/` | 76 | |
| HTML template files in `app/` | 14 | |
| SCSS files in `app/` | **10** | All are R-02 violations |
| CSS files in `app/` | **3** | `app.css` (empty), `playground.page.css` (5 lines), `showcase.css` (229 lines) |
| Top-level entry files | `bootstrap.ts`, `main.ts`, `index.html`, `styles.scss`, `tailwind.css` |
| Top-level `styles.scss` | 26 lines — **R-02 P0** (`.scss` extension) |
| Top-level `tailwind.css` | 2,399 lines — canonical theme entry (allowed) |
| Vendored asset | `assets/font-awesome/css/all.min.css` — 102,649 bytes, R-01-spirit |
| Components with `standalone: true` (R-09) | **47** declarations |
| Components missing `ChangeDetectionStrategy.OnPush` | **10** (23 have it / 33 total `@Component` blocks) |
| `@Input()` / `@Output()` decorator declarations (R-09) | **30** lines across 7 components |
| `*ngIf` / `*ngFor` / `*ngSwitch` | **0** ✓ |
| `@HostBinding` / `@HostListener` | **1** (`showcase-gallery.component.ts:128`) |
| `[ngClass]` usages (R-09) | **17** call sites |
| `[ngStyle]` | **0** ✓ |
| `<input>` raw tags outside libs | **21** sites |
| `<button>` raw tags outside libs | **120** sites across 19 files |
| `<select>` / `<textarea>` raw tags | **0** ✓ |
| Inline `style="..."` (R-02 / R-03) | **8** in TS templates (excl. SVG asset) |
| Hardcoded `z-index:` (R-04) | **11** sites across 4 SCSS files + showcase.css |
| `z-[<num>]` arbitrary Tailwind (R-04) | **2** (`tailwind.css:736`, `topbar.component.html:78`) |
| `--login-*` token references (R-17 ORPHAN) | **163** across 5 SCSS files |
| `var(--falcon-*)` references | 1,581 in `tailwind.css` (legit `@source inline` arbitrary tokens) |
| Tailwind arbitrary `[<n>px]` | **298** hits across 15 files |
| `: any` / `<any>` / `as any` (R-26) | **63+** instances across 9 files (head 200) |
| `[innerHTML]` (R-32) | **1** in `showcase-docs-panel.component.ts:52` (sanitized — allowed) |
| `document.querySelector*` (R-31) | **2** in `core/services/remote-route.service.ts:463,472` (justified MF stylesheet management) |
| `models/*.ts` filename violations (R-10) | **5** (`change-password.models.ts`, `otp.models.ts`, `forgot-password-flow.models.ts`, `login.models.ts`, `user.models.ts`) |
| Multi-line JSDoc blocks (R-22) | **22** files contain `/**` opener; only **3** `@param`/`@returns` hits — actual JSDoc density is low |
| PrimeNG imports / `<p-*>` tags / `pi pi-*` (R-01) | **0** ✓ |
| Dead/duplicated service modules | **2** (`app/remote-route.service.ts`, `app/remote-config.ts`) |
| Zone.js / NgZone references | **0** ✓ — zoneless safe |

## 2. Per-rule findings (P0)

### R-01 — No PrimeNG / PrimeIcons — ZERO tolerance — ✓ CLEAN

No `from 'primeng/'`, no `<p-*>`, no `pi pi-*`. Wave PR-8 cleanup held. Two **comment-only** references in `module-federation.config.ts:12` and `:72` (historical notes).

### R-02 — No SCSS / no component CSS / no `styleUrls` / no inline `style=""` — ✗ MAJOR

| # | File | Line | Quote / evidence | Tier |
|---|---|---|---|---|
| R-02.1 | `apps/host-shell/src/styles.scss` | top-level | File exists with `.scss` extension (26 lines, `@import`/`!important` font overrides). | P0 |
| R-02.2 | `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.scss` | 6 lines | `:host { display: block; } .sidebar { --sb-icon-size: 18px; ...}` | P0 |
| R-02.3 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.scss` | 2 lines | (small but still .scss) | P0 |
| R-02.4 | `apps/host-shell/src/app/layout/layout.component.scss` | 76 lines | | P0 |
| R-02.5 | `apps/host-shell/src/app/features/dashboard/dashboard.component.scss` | 561 lines | `@keyframes skel-shimmer`, `.skel--text { height: 14px }` | P0 |
| R-02.6 | `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 350 lines | `:host { min-height: 100vh; background-image: url(...); }` | P0 |
| R-02.7 | `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 247 lines | `.gs-title { font-size: var(--login-title-size, 2rem); padding-top: 3rem; }` | P0 |
| R-02.8 | `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.scss` | 331 lines | | P0 |
| R-02.9 | `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.scss` | 574 lines | Largest SCSS file in app | P0 |
| R-02.10 | `apps/host-shell/src/app/features/auth/change-password/change-password.component.scss` | 262 lines | | P0 |
| R-02.11 | `apps/host-shell/src/app/features/not-found/not-found.component.scss` | 36 lines | | P0 |
| R-02.12 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase.css` | 229 lines | `.css` (not `.scss`) but still component CSS, declared via `styleUrls`; `@keyframes`, raw `linear-gradient` colors | P0 |
| R-02.13 | `apps/host-shell/src/app/playground/playground.page.css` | 5 lines | `.css` consumed via `styleUrl` | P0 |

`styleUrls:` / `styleUrl:` declarations cite these files (12 components):

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/layout/layout.component.ts` | 29 | `styleUrls: ['./layout.component.scss']` |
| `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` | 78 | `styleUrls: ['./sidebar.component.scss']` |
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts` | 37 | `styleUrls: ['./topbar.component.scss']` |
| `apps/host-shell/src/app/features/dashboard/dashboard.component.ts` | 39 | `styleUrls: ['./dashboard.component.scss']` |
| `apps/host-shell/src/app/features/not-found/not-found.component.ts` | 9 | `styleUrl: './not-found.component.scss'` |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts` | 14 | `styleUrls: ['./login-layout.component.scss']` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts` | 27 | `styleUrls: ['./get-started.component.scss']` |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` | 31 | `styleUrls: ['./enter-otp.component.scss']` |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` | 37 | `styleUrls: ['./forgot-password-flow.component.scss']` |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts` | 29 | `styleUrls: ['./change-password.component.scss']` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.component.ts` | 30 | `styleUrls: ['./showcase.css']` |
| `apps/host-shell/src/app/playground/playground.page.ts` | 116 | `styleUrl: './playground.page.css'` |

`styles:` inline array declarations (8, all P0 by the strict reading of R-02; some are tiny `:host { display: contents }`):

| File | Line | Snippet |
|---|---|---|
| `apps/host-shell/src/app/preview-shell.component.ts` | 42 | ` styles: ['`':host { display: block; } div[style*=\"grid\"][class=\"collapsed\"], div[style*=\"grid\"].collapsed { grid-template-columns: var(--sidebar-w-collapsed, 68px) 1fr !important; }`'`] ` |
| `apps/host-shell/src/app/preview-page.component.ts` | 29 | identical pattern |
| `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | 21 | inline `styles:` block |
| `apps/host-shell/src/app/features/error/error.component.ts` | 20 | inline `styles:` block |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 519 | inline `styles: [...]` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 497 | inline `styles: [...]` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 837 | inline `styles: [...]` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-live-element.component.ts` | 26 | `styles: [':host { display: contents; }']` — minor |

Inline `style="..."` attribute hits (template-side, **excludes SVG asset file**):

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/preview-shell.component.ts` | 21 | `<div [class.collapsed]="collapsed()" style="display: grid; grid-template-columns: var(--sidebar-w, 224px) 1fr; height: 100vh; overflow: hidden;">` |
| `apps/host-shell/src/app/preview-page.component.ts` | 12 | `<div [class.collapsed]="collapsed()" style="display: grid; grid-template-columns: var(--sidebar-w, 224px) 1fr; min-height: 100vh;">` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-expanded-card.component.ts` | 36 | `style="isolation: isolate;"` |

(`assets/images/login-bg-pattern.svg` has 6 `style="mix-blend-mode:..."` hits — SVG assets are out of scope per R-02 spirit; flagged for completeness.)

### R-03 — No hardcoded colors / spacing / radii / shadows / fonts — ✗ EXTENSIVE

Three buckets of violations:

**Bucket 1 — Hardcoded hex inside CSS files (allowed in `var(--token, #fallback)` fallback position only):**

| File | Line | Quote | Allowed? |
|---|---|---|---|
| `apps/host-shell/src/tailwind.css` | 751–776 | `@source inline("bg-[var(--falcon-stepper-circle-bg-active,#0d3f44)]")` | YES — fallback in `var()` |
| `apps/host-shell/src/tailwind.css` (many) | many | All hex hits in `tailwind.css` are inside `var(...)` fallbacks | YES |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 26 | `background-image: url('/assets/images/login_back.webp');` | n/a — URL not hex |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase.css` | 39 | `color-mix(in srgb, var(--color-falcon-teal-100) 70%, transparent)` | YES (uses token) |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.scss` | many | direct color literals in SCSS without fallback wrap | **NO — P0** |

**Bucket 2 — Hardcoded fills inside inline `<svg>` markup in templates (R-03 violations):**

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 62 | `<rect width="40" height="40" fill="#cfd8dc"/>` |
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 63 | `<circle cx="20" cy="16" r="7" fill="#8a9ea7"/>` |
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 64 | `<path d="M7 37c0-7 6-11 13-11s13 4 13 11" fill="#8a9ea7"/>` |
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 82–84 | identical hardcoded avatar SVG fills |

**Bucket 3 — Tailwind arbitrary `[<n>px]` values for design intent (R-03):**

Examples (head of 298 total):

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 68 | `class="user-name text-[13px] font-semibold text-falcon-neutral-900 leading-[1.3] truncate"` |
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 69 | `class="user-job text-[11px] font-medium text-falcon-neutral-600 leading-[1.3] truncate"` |
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 78 | `class="... w-[260px] z-[200] ... rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ..."` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | (153 hits) | Demo skeletons hardcode every dimension |
| `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | (34 hits) | |

A representative high-density site is `topbar.component.html:78` which packs three R-03 + one R-04 in a single class string.

**Bucket 4 — Hardcoded `box-shadow` / `border-radius` / `font-family` in component SCSS:**

Aggregate counts (`grep -nc`):

| Pattern | Count | Top file |
|---|---|---|
| `font-family:` | **109** total (most in tailwind.css inside tokens; significant in `styles.scss:9-21` and `unauthorized.component.ts:3`) | mixed |
| `box-shadow:` / `border-radius:` | spread across `auth/*.scss` (mostly via tokens like `var(--radius-md)` — but those tokens are orphans, see R-17) | auth/*.scss |

`styles.scss:9-21` has multiple `font-family: 'Poppins', 'Inter', system-ui, sans-serif !important;` declarations — direct font literals, not tokens (R-03 + R-22 `!important`).

### R-04 — No hardcoded `z-index` — ✗ 12 SITES

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase.css` | 126 | `z-index: 1;` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase.css` | 164 | `z-index: 2;` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase.css` | 176 | `z-index: 3;` |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 40 | `z-index: 0;` |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 62 | `z-index: 1;` |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 73 | `z-index: 1;` |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 134 | `z-index: 1;` |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.scss` | 355 | `z-index: 1;` |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.scss` | 435 | `z-index: 1;` |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.scss` | 103 | `z-index: 1;` |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.scss` | 191 | `z-index: 1;` |
| `apps/host-shell/src/tailwind.css` | 736 | `@source inline("z-[2]");` — arbitrary value not from overlay ladder |
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 78 | `<div class="... z-[200] ...">` — hardcoded `200` outside overlay tokens; should ride the canonical ladder (drawer 1200 / overlay 1400 etc. per `feedback_zindex_calendar_portal_root_cause_fix`) |

### R-05 — Build must be GREEN

Out of scope for READ-ONLY audit. Build verification belongs to Wave 5.

### R-06 — Noor naming for tokens and component tags — ✓ MOSTLY CLEAN

No `--falcon-color-(blue|gray|red|...)-N` violations found in scope. All `@Component({ selector: '...' })` tags are kebab-case (`app-root`, `app-sidebar`, `app-organization-hierarchy-tree`, `app-do-payment-priority-popup`, `app-preview-shell`, etc.). One observation:

- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-docs-panel.component.ts:23` uses `selector: 'showcase-docs-panel'` (no `app-` prefix). All other showcase children follow `showcase-*`. Acceptable as a local prefix-free family but non-canonical relative to the rest of the app. **P2 flag, not a Noor violation.**

## 3. Per-rule findings (P1)

### R-07 / R-12 — Falcon library FIRST — ✗ MAJOR REGRESSION IN AUTH

Five auth screens build forms entirely out of raw HTML controls with hand-rolled BEM classes, instead of consuming the `<falcon-input>` / `<falcon-button>` / `<falcon-password>` library components. Sample:

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 18 | `<form [formGroup]="form" (ngSubmit)="onLogin()" class="gs-form">` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 34 | `<input id="gsUserName" type="text" formControlName="userName" ... class="gs-input" autocomplete="username" />` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 65 | `<input id="gsPassword" [type]="showPassword ? 'text' : 'password'" formControlName="password" ... class="gs-input" autocomplete="current-password" />` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 74 | `<button type="button" class="gs-icon-right" (click)="togglePasswordVisibility()" tabindex="-1">` |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 29, 100, 144 | three raw `<input>` blocks |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 26, 228, 268 | three raw `<input>` blocks |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` | (multiple) | OTP digit inputs |

`<falcon-input>` / `<falcon-input-tw>` ships in `libs/falcon-ui-core/`. `<falcon-password-tw>` was specifically introduced in `project_zindex_calendar_portal_root_cause_fix` (2026-05-16). The auth feature has not adopted any of them. **High-priority refactor.**

Other raw-tag hits in non-auth surfaces are legitimate showcase / playground demos (R-07 exempts demonstration code that documents the library itself).

### R-08 — Library skeleton vs app wrapper — ✓ EXEMPLARY

`apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` is the canonical reference. Quotes that show the pattern enforced:

| Line | Quote |
|---|---|
| 1–29 | `/*** Falcon Architecture Rule: "Library = Skeleton, App = API". ... PES is INTERNAL ... Backend services are INTERNAL ... ***/` |
| 73–90 | `selector: 'app-organization-hierarchy-tree'` — `app-` prefix on the wrapper |
| 76 | `imports: [FalconTreePanelComponent]` — composes the library skeleton only |
| 129–132 | `private readonly accessControl = inject(AccessControlFacade); private readonly sessionProvider = inject(SessionProvider); private readonly api = inject(OrgHierarchyTreeApiService);` — services injected at wrapper layer only |

`apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts` matches the same pattern at the architecture level (services in wrapper, library skeleton `<falcon-angular-insufficient-balance-dialog>` as the visual layer) but **regresses on R-09** (decorator inputs/outputs — see below).

Lib-import scan (`rg "inject\(.*Service" libs/falcon-ui-core/` not in scope; tested locally only at host-shell layer): no host-shell file injects backend services into a `libs/falcon-ui-core/` element.

### R-09 — Angular 21 idioms — ✗ MIXED

**`standalone: true` on 47 declarations (should be omitted in v20+):**

Representative hits:

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/app.ts` | 8 | `standalone: true,` |
| `apps/host-shell/src/app/preview-page.component.ts` | n/a | NOT set (correct) |
| `apps/host-shell/src/app/preview-shell.component.ts` | n/a | NOT set (correct) |
| `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` | 75 | `standalone: true,` |
| `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts` | 75 | `standalone: true,` |
| `apps/host-shell/src/app/layout/layout.component.ts` | 26 | `standalone: true,` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 14, 35, 53, 74, 98, 118, 138, 158, 180, 207, 231, 252, 275, 311, 346, 381, 409, 432, 462, 493, 515, 547, 603, 626, 659, 711, 733 | **27** standalone declarations in the demo skeleton file |
| ...full list: 47 instances |

**`@Input()` / `@Output()` decorator declarations (must be `input()` / `output()` functions for v20+):**

| File | Lines | Count |
|---|---|---|
| `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts` | 82, 90, 91, 92, 93, 94, 97, 100 | **8** — the entire public API of the wrapper uses decorators. Should migrate to `input()` / `output()`. |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` | 47, 49, 51 | **3** |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-component-card.component.ts` | 65, 66, 67, 68, 69 | **5** |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-expanded-card.component.ts` | 81, 82 | **2** |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-live-element.component.ts` | 29, 30, 31, 32, 34 | **5** |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-falcon-host.directive.ts` | 29, 31, 33 | **3** |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tooltip.component.ts` | 52, 53, 54 | **3** |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` | 209, 210, 212, 214 | **4** |

**`@HostListener` (must use `host:` object):**

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-gallery.component.ts` | 128 | `@HostListener('document:keydown.escape')` |

**`[ngClass]` (must use `class` bindings):**

| File | Lines |
|---|---|
| `apps/host-shell/src/app/playground/playground.page.html` | 54 |
| `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 67, 78 |
| `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | 143, 149, 189, 279, 290, 349, 354, 364, 369, 379, 384, 425, 431, 459 |

**Components missing `OnPush` (R-09 / R-24):**

| File | Notes |
|---|---|
| `apps/host-shell/src/app/app.ts` | App root — acceptable to leave default; lint-friendly to add OnPush |
| `apps/host-shell/src/app/layout/layout.component.ts` | Layout shell — missing OnPush |
| `apps/host-shell/src/app/features/error/error.component.ts` | Static page |
| `apps/host-shell/src/app/features/unauthorized/unauthorized.component.ts` | Static page |
| `apps/host-shell/src/app/features/not-found/not-found.component.ts` | Static page |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts` | Auth layout |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts` | Login screen |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` | OTP screen |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` | Multi-step flow |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts` | Change password screen |

The auth feature has the highest non-OnPush concentration, paralleling the SCSS / library-bypass regression.

### R-10 — Folder structure — one file per type-folder — ✗ 5 VIOLATIONS

Per memory `feedback_folder_structure_pattern`, every feature must use `models.ts` / `services.ts` etc. — NOT `<feature>.models.ts`.

| Folder | Actual filename | Expected |
|---|---|---|
| `apps/host-shell/src/app/features/auth/change-password/models/` | `change-password.models.ts` | `models.ts` |
| `apps/host-shell/src/app/features/auth/enter-otp/models/` | `otp.models.ts` | `models.ts` |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/models/` | `forgot-password-flow.models.ts` | `models.ts` |
| `apps/host-shell/src/app/features/auth/get-started/models/` | `login.models.ts` | `models.ts` |
| `apps/host-shell/src/app/core/user/` | `user.models.ts` + `user-api.service.ts` (no `models/` folder; standalone file at feature root — different anti-pattern) | `models/models.ts` |

`apps/host-shell/src/app/shared-components/organization-hierarchy-tree/models/models.ts` and `services/services.ts` are correct — exemplary.

### R-11 — Tailwind grid FIRST — ✓ MOSTLY OK

Many class-strings combine `grid grid-cols-[1fr_auto]` (skeletons.ts:364, etc.). Several `flex flex-col` + `gap-*` candidates that could migrate to grid (R-11 is heuristic / flag-only). No `p-grid` / `p-col` (PrimeFlex residue) anywhere.

### R-13 — Auth via Identity Service only — ✓ CLEAN

No `zitadel.com` / `@zitadel/` references in scope. `auth.service.ts` and `auth-api.service.ts` route through internal abstractions.

### R-14 — Single workspace path — ✓ CLEAN

No `WebstormProjects` / `falcon-web-platform-ui-old` references.

### R-15 / R-34 — i18n + RTL (logical properties) — ✗ MANY HITS

`mr-2` / `ml-2` / `pl-3` / `text-left` / `left-` / `right-` directional Tailwind utilities found in:

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 67 | `<i class="falcon-icon falcon-icon-spin falcon-icon-spinner mr-2"></i>` |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 320 | identical pattern |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.html` | 113 | `<i class="falcon-icon ... mr-2"></i>` |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.html` | 188 | `<i class="falcon-icon ... mr-2"></i>` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 6 | `/* ======================== Header (left-aligned per screenshot) ====== */` + `text-align: left;` on `.gs-header` line 8 |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.scss` | 6 | same `text-align: left` problem |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 24 | `class="ml-1 inline-block ..."` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 146 | `class="absolute top-0.5 right-0.5 ..."` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` | 323, 328, 333, 364, 368 | `pl-3.5`, `pl-4`, `pl-7`, `pr-1.5` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tooltip.component.ts` | 16–26 | placement map hardcodes `left-1/2`, `right-full`, `mr-2`, `ml-2`, `mr-1`, `ml-1` — directional, will not flip in RTL |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 15–17 | `-top-24 -right-16`, `-bottom-32 -left-16`, `left-1/3` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-component-card.component.ts` | 31 | `class="absolute top-2 right-2 ..."` |
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-component-card.component.ts` | 56 | `class="ml-auto inline-flex ..."` |

Topbar template at `topbar.component.html:78` already uses logical `end-0` — correct. The pattern is inconsistent across the surface.

i18n keys appear to be used uniformly via `translate` pipe in templates (no raw English string scan emerged with high-density hits in auth templates beyond comment-only English). One observation: `apps/host-shell/src/app/preview-shell.component.ts:66` returns hardcoded English `'Organization Hierarchy (PrimeNG)'` and `'Organization Hierarchy'` strings — preview-only page, low risk.

### R-16 — A11y baseline — n/a IN SCOPE

A11y baseline applies to `libs/falcon-ui-core/`. Host-shell components: `app-root` carries `host: { class: 'block h-screen overflow-hidden' }`. `app-sidebar` has `host: { role: 'complementary', '[attr.aria-label]': 'ariaPrimaryLabel()' }` — correct (line 80–83).

### R-17 — Token reality — ✗✗ MAJOR ORPHAN CLUSTER

The most dangerous finding in this audit. The auth feature uses 163 references to `--login-*` and other `var(--*-*)` tokens that **do not exist anywhere in the workspace token registry**.

Verified by:
- `Grep --login- 02-token-registry-quick-grep.txt → 0 matches`
- `Grep --login-bg-pattern-color: <entire workspace> → 0 matches`
- The tokens are referenced in 5 SCSS files but **defined nowhere**.

| File | Count of `--login-*` refs |
|---|---|
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 23 |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 40 |
| `apps/host-shell/src/app/features/auth/change-password/change-password.component.scss` | 44 |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.scss` | 51 |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.scss` | 5 |

Sample broken references:

| File | Line | Quote |
|---|---|---|
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 32 | `background-color: var(--login-bg-pattern-color);` |
| `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` | 78 | `color: var(--login-brand-text);` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 9 | `margin-bottom: var(--login-header-mb);` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 15 | `color: var(--login-title-color);` |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 17 | `font-size: var(--login-title-size, 2rem);` — fallback hides the breakage |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.scss` | 31 | `gap: var(--login-form-gap);` |

These render with browser defaults (empty `var()` → invalid declaration → ignored) wherever there is no fallback. Half of the auth visuals therefore come from browser defaults + nothing else. The token registry should be the source of truth; the auth SCSS feature was clearly imported from an external prototype and **never re-wired to Falcon tokens**.

Other suspect tokens (`--sb-icon-size`, `--falcon-icon-color`, `--sidebar-w`, `--sidebar-w-collapsed`, `--radius-md`, `--skel-base`, `--skel-wave`, `--skel-duration`, `--skel-radius`, `--fw-medium`, `--fw-regular`, `--fw-semibold`, `--lh-normal`) appear in scope; cross-reference against the token registry will be needed in the aggregation wave to classify orphan vs defined.

### R-18 — Brain SK playbook grounded — procedural

`OrganizationHierarchyTreeComponent` cites the Add Client / Add User / Add Node playbook lineage in its long header comment and in `feedback_falcon_custom_library_mandatory` / `feedback_library_skeleton_app_api` memory entries. Auth feature has no playbook citation — needs one (R-37 / R-38 procedural).

### R-19 — Nx boundaries — ✓ CLEAN

No `from 'apps/'` imports. No deep-internal `@falcon/<lib>/src/...` imports. Imports use the `@falcon`, `@falcon/ui-core/angular`, `@falcon/sdk` barrels — correct.

### R-20 — Module Federation safety — ✓ STABLE

`apps/host-shell/module-federation.config.ts` reviewed in full:

- `remotes: []` — host has no compile-time remote registry; all remotes load via `loadRemoteModule()` at route time (see `app.routes.ts:52, 62, 76, 88`).
- `additionalShared` registers `@falcon` + `@falcon/sdk` eager singletons — correct per `feedback_falcon_revamp_v3_1_night_shift_results`.
- Angular eager-share contract preserved (`@angular/*` singleton + strictVersion + eager).
- Animations explicitly kept local to avoid RUNTIME-006 — line 24–31.
- Wave PR-8 PrimeNG share-map branch deletion confirmed in comments at lines 12, 72.

No regressions to the MF surface. The `RemoteRouteService` at `core/services/remote-route.service.ts` does manage stylesheet `<link>` injection via `document.querySelector` (lines 463, 472) — R-31 violation but the canonical justification per `feedback_falcon_revamp_v3_1_night_shift_results` (RemoteManifestProvider abstraction) is that remote-style management at the document level is unavoidable in MF and must live in a single service. Not a refactor candidate.

### R-21 — No premature shared abstraction — ✓ CLEAN

Both `shared-components/` entries have legitimate cross-app consumers:
- `<app-organization-hierarchy-tree>` consumed by `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts:30` via `@host-shell/shared/organization-hierarchy-tree`.
- `<app-do-payment-priority-popup>` consumed by `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.ts:51` via `@host-shell/shared/do-payment-priority-popup`.

Both consumers are external apps importing through the host-shell's TS path alias — exactly per `feedback_library_skeleton_app_api`. Good architecture.

## 4. Per-rule findings (P2)

### R-22 — Comment style — ✓ MOSTLY OK

Only **3** `@param`/`@returns` hits in 1 file (`apps/host-shell/src/app/layout/layout.component.ts:3`). No long JSDoc blocks of concern. Most comments follow the `*** ... ***` banner format (e.g. `app.ts:14-18`, `organization-hierarchy-tree.component.ts:1-29`). One observation: a few comments use `─── @Input() ───` ASCII art (`enter-otp.component.ts:45`) — purely cosmetic, no rule violation.

### R-23 — Clean code / DRY / minimal — ✗ NOTABLE DUPLICATIONS

**Duplicated services (DEAD code):**

| Duplicate | Canonical |
|---|---|
| `apps/host-shell/src/app/remote-route.service.ts` (19,697 bytes) | `apps/host-shell/src/app/core/services/remote-route.service.ts` (17,972 bytes) |
| `apps/host-shell/src/app/remote-config.ts` (770 bytes) | `apps/host-shell/src/app/core/services/remote-config.ts` (869 bytes) |

Verified by Grep — only `bootstrap.ts:6` imports `./app/core/services/remote-route.service`. The flat copies at `app/*` are never imported. **Safe to delete after wave 4 confirmation.**

**Duplicated preview components:**

`preview-page.component.ts` (38 lines) and `preview-shell.component.ts` (82 lines) share an identical inline grid pattern (`style="display: grid; grid-template-columns: var(--sidebar-w, 224px) 1fr; ..."` + duplicate `styles: [...]` array). The router only loads `preview-shell` (path `/preview-shell`). `preview-page` is registered at path `/preview` (app.routes.ts:23) but has no path-protection, no real consumer in admin/management consoles. **Likely dead — flag for archeology.**

### R-24 — Components small + single responsibility + OnPush — ✗ TWO XL FILES

| File | Lines | Issue |
|---|---|---|
| `apps/host-shell/src/app/playground/playground.page.html` | **4,080** | Single template, every Falcon demo component crammed into one page. Should split into per-section components. |
| `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` | **1,493** | Inline `styles: [...]` block (line 837), inline template, many `[ngClass]` calls — should split. |
| `apps/host-shell/src/app/playground/playground.page.ts` | **1,443** | Demo data + handlers + animations. |
| `apps/host-shell/src/tailwind.css` | **2,399** | Tooling-driven `@source inline` lines — not refactorable. |

10 of 33 components lack OnPush (see R-09 list).

### R-25 — Services: providedIn:'root' + inject() + single responsibility — Mixed

`apps/host-shell/src/app/core/interceptors/response-interceptor.ts` and `auth.service.ts` use legacy constructor injection patterns indirectly (see R-26). Most other services use `@Injectable({ providedIn: 'root' })` + `inject()`.

### R-26 — TypeScript strictness — ✗ EXTENSIVE `any` USAGE

| File | Line range | Pattern |
|---|---|---|
| `apps/host-shell/src/app/core/interceptors/response-interceptor.ts` | 15, 36, 86, 88, 116, 155, 242, 252, 275, 283, 325, 327 | `HttpRequest<any>`, `HttpEvent<any>`, `body: any`, `(entry: any)`, `(error: any)` — 12+ instances; could be typed as `unknown` with type guards |
| `apps/host-shell/src/app/core/auth/auth.service.ts` | 208, 210, 211, 278 | `HttpRequest<any>`, `Observable<HttpEvent<any>>` |
| `apps/host-shell/src/app/remote-route.service.ts` (dead duplicate, see R-23) | 22, 120, 140, 197, 269, 321, 361, 386, 412, 442, 468, 491, 516, 530, 544, 560 | 16 `any` instances; whole file is dead |
| `apps/host-shell/src/app/core/services/remote-route.service.ts` | 26, 92, 149, 203, 233, 264, 297, 323, 346, 371, 385, 399, 419 | 13 `any` instances on the canonical copy too |
| `apps/host-shell/src/bootstrap.ts` | 16 | `(window as any).__appType__ = 'host';` — should be `globalThis as { __appType__?: string }` |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts` | 291, 422 | `(res as any).errorMessages?.[0]` — bypassing type system on response shape |
| `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts` | 166, 186, 194 | `(e: any)`, `private extractBodyError(res: any)` |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts` | 353 | `(res as any).errorMessages?.[0]` |

### R-27 — `NgOptimizedImage` — N/A

No `<img src="...">` static images outside of the SVG asset and inline SVG markup. The `login-bg-pattern.svg` is referenced via CSS `background-image`. No `<img>` tag refactors needed.

### R-28 — Lazy feature routes — ✓ MOSTLY

`app.routes.ts` uses `loadComponent()` / `loadChildren()` for `/preview`, `/playground`, `/falcon-ui-showcase`, `/login`, `/preview-shell/*`, `/preview-hierarchy*`. Three routes use eager component references (`LayoutComponent` line 13, `UnauthorizedComponent` line 97, `NotFoundComponent` line 102, `ErrorComponent` line 107) — those are the canonical "tiny shell" components that legitimately live at the root.

`auth.routes.ts:13, 15, 18, 23, 28` uses eager component refs for the auth screens — they share `LoginLayoutComponent` parent, so single bundle is acceptable.

### R-29 / R-30 — Composition / UI states — mostly N/A in scope

Auth screens DO have loading / error / success states wired via signals + `@if` blocks (sampled `get-started.component.html:8-15` API error banner, `forgot-password-flow.component.html:67` spinner). Visual quality is presumably user-verified outside this audit.

### R-31 — No DOM access from Angular — flag only

| File | Line | Quote | Verdict |
|---|---|---|---|
| `apps/host-shell/src/app/core/services/remote-route.service.ts` | 463 | `document.querySelectorAll<HTMLLinkElement>(\`link[data-remote-style="${remoteName}"]\`);` | Acceptable — managing remote-app stylesheets at document level is unavoidable in MF; justified per `feedback_falcon_revamp_v3_1_night_shift_results` |
| `apps/host-shell/src/app/core/services/remote-route.service.ts` | 472 | `document.querySelector<HTMLLinkElement>(\`link[data-remote-style-href="${href}"]\`);` | Same justification |

### R-32 — No `innerHTML` injection — ✓ JUSTIFIED

| File | Line | Quote | Verdict |
|---|---|---|---|
| `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-docs-panel.component.ts` | 52 | `<div class="studio-docs" [innerHTML]="html()"></div>` | Acceptable — `html` is `SafeHtml` from `sanitizer.bypassSecurityTrustHtml(parsed)` where `parsed` comes from in-house `mdToHtml` that escapes every char. Justification documented at lines 1–6. |

### R-33 — Imports — ✓ CLEAN

No `import * as ...`. Specific named imports used throughout.

### R-37 / R-38 — Page learning + per-section compliance table — flag-only

Procedural. Out of scope for code-level audit.

## 5. Module Federation specific findings (MF-1 / MF-2 / MF-3)

### MF-1 — shared-components canonical pattern

| Component | Verdict | Evidence |
|---|---|---|
| `<app-organization-hierarchy-tree>` (skeleton: `<falcon-tree-panel>`) | **CANONICAL ✓** | Lines 1–29 header explains the rule; services injected at wrapper only (lines 129–132); skeleton imported only at line 76 |
| `<app-do-payment-priority-popup>` (skeleton: `<falcon-angular-insufficient-balance-dialog>`) | **CANONICAL ✓ at architecture / ✗ on Angular 21 idioms** | Lines 1–19 header carries the contract; services at lines 110–114; skeleton imported at line 76. But uses `@Input()/@Output()` decorators (lines 82–100) — should migrate to `input()`/`output()` to match the `OrganizationHierarchyTreeComponent` example. |

Recommendation: refactor `do-payment-priority-popup.component.ts` to use `input()`/`output()` functions, signal-based `_trigger` state, and align with the org-hierarchy-tree reference for new contributors.

### MF-2 — `app.css` audit

`apps/host-shell/src/app/app.css` is **EMPTY (0 lines / 1 file present)**. No styles smuggled in. ✓ CLEAN.

The MF-2 concern was reasonable to surface but not realized — the file is a placeholder. Could be deleted; that depends on Angular build config (some setups require the file to exist).

### MF-3 — Remote consumption

| Concern | Verdict |
|---|---|
| Direct cross-remote imports bypassing the federation registry | **CLEAN ✓** — Host only consumes remotes via `loadRemoteModule('admin_console', ...)` in `app.routes.ts:52, 62, 76, 88`. No direct `import from '@admin-console/...'` or similar. |
| `module-federation.config.ts` integrity | **CLEAN ✓** — `remotes: []`, MF runtime fetches discovery at runtime. |
| Wave PR-8 PrimeNG removal preserved | **CONFIRMED ✓** — comments at lines 12 + 72; no `primeng` strings in share map. |

## 6. Top 10 findings (ranked)

| # | Finding | Tier | File evidence |
|---|---|---|---|
| 1 | **163 `--login-*` token references resolve to nothing** | P1 | All five `apps/host-shell/src/app/features/auth/*.scss` files |
| 2 | **11 SCSS files (1,720+ lines) drive the auth + layout + dashboard features** | P0 R-02 | `styles.scss`, `dashboard.component.scss`, `auth/*/`.component.scss`, `layout/*.scss` |
| 3 | **8 `styleUrls` / `styleUrl` declarations + 8 inline `styles:` arrays** | P0 R-02 | 16 component TS files |
| 4 | **Auth feature bypasses Falcon UI library** — raw `<input>` / `<button>` / hand-rolled BEM in 5 auth templates | P1 R-07/R-12 | `auth/*/get-started.component.html` etc. |
| 5 | **12 hardcoded `z-index:` sites + 1 `z-[200]` arbitrary** outside the canonical overlay ladder | P0 R-04 | `login-layout.scss`, `forgot-password-flow.scss`, `enter-otp.scss`, `showcase.css`, `topbar.component.html:78` |
| 6 | **47 `standalone: true` + 30 `@Input()`/`@Output()` decorators** — Angular 20/21 idiom drift | P1 R-09 | `do-payment-priority-popup.component.ts`, `showcase-data/skeletons.ts` (27 sites), 6 showcase gallery files |
| 7 | **2 stale duplicate service files at `app/` instead of `app/core/services/`** (`remote-route.service.ts`, `remote-config.ts`) | P2 R-23 | Both files import-checked; never consumed; safe-to-delete after Wave 4 |
| 8 | **63+ `any` usages across HTTP interceptors + auth services + remote-route services** | P2 R-26 | `response-interceptor.ts`, `auth.service.ts`, both `remote-route.service.ts`, auth feature components |
| 9 | **Hardcoded `fill="#cfd8dc"` / `fill="#8a9ea7"` in inline SVG avatars** in topbar (lines 62–64, 82–84) | P0 R-03 | `topbar.component.html` |
| 10 | **10 of 33 components missing OnPush change detection** + 17 `[ngClass]` (should be `class` bindings) + 1 `@HostListener` | P2 R-09/R-24 | Auth feature concentration; library-section.component.ts |

## 7. Recommended fix sequence

| Phase | Action | Tier | Files affected | Estimated effort |
|---|---|---|---|---|
| F1 | **Delete stale duplicates** at `app/remote-route.service.ts` + `app/remote-config.ts`; rebuild | P2 | 2 files | 5 minutes |
| F2 | **Define or import `--login-*` tokens** OR rewrite auth SCSS to use existing `--falcon-*` tokens (preferred — aligns with Noor naming) | P1 R-17 | 5 SCSS files | 2–4 hours |
| F3 | **Delete top-level `styles.scss`**; move its 3 font declarations into `tailwind.css` `@theme` block as `--font-sans` | P0 R-02 | `styles.scss` → `tailwind.css` | 30 minutes |
| F4 | **Delete `dashboard.component.scss` + `not-found.component.scss` + `layout.component.scss` + `sidebar.component.scss` + `topbar.component.scss` + `showcase.css` + `playground.page.css`**; migrate to Tailwind utilities; remove `styleUrls` declarations | P0 R-02 | 7 files + 7 TS edits | 4–6 hours |
| F5 | **Delete all 5 auth `.component.scss` files**; rewrite auth screens using `<falcon-input>` / `<falcon-button>` / `<falcon-password>` from `libs/falcon-ui-core/` + Tailwind utility classes for layout | P0 R-02 + P1 R-07/R-12 | 5 TS + 5 HTML + 5 SCSS files | 1–2 days |
| F6 | **Eliminate 8 inline `styles:` arrays + 3 template `style="..."` literals** — migrate to Tailwind utilities or host class+`@theme` | P0 R-02 | `preview-shell.component.ts`, `preview-page.component.ts`, `unauthorized.component.ts`, `error.component.ts`, showcase library/empty-data + gallery files | 2–3 hours |
| F7 | **Drop all 12 hardcoded `z-index:` sites + replace `z-[200]` in topbar with canonical drawer/overlay token** per `feedback_zindex_calendar_portal_root_cause_fix` ladder | P0 R-04 | login-layout.scss (no longer exists after F5), topbar.component.html | 1 hour |
| F8 | **Replace inline SVG avatar fills `#cfd8dc` / `#8a9ea7`** with `currentColor` driven by `text-falcon-neutral-*` class | P0 R-03 | `topbar.component.html` lines 62–64 + 82–84 | 30 minutes |
| F9 | **Strip `standalone: true` from all 47 declarations** (it's the default in Angular 20+) | P1 R-09 | scripted find-replace | 30 minutes |
| F10 | **Convert `do-payment-priority-popup.component.ts` to signals**: `@Input` → `input()`, `@Output` → `output()`, internal `_trigger` field → signal | P1 R-09 | 1 file | 1 hour |
| F11 | **Migrate showcase gallery files** to `input()`/`output()` (5 components, ~22 declarations) | P1 R-09 | gallery/*.component.ts | 2 hours |
| F12 | **Replace `@HostListener('document:keydown.escape')` in `showcase-gallery.component.ts:128`** with `host: { '(document:keydown.escape)': '...' }` | P1 R-09 | 1 line | 5 minutes |
| F13 | **Convert 17 `[ngClass]` to `class` bindings** in `library-section.component.ts` + `empty-data-section.component.ts` + `playground.page.html` | P1 R-09 | 3 files | 1 hour |
| F14 | **Rename 5 `models/<name>.models.ts` files to `models/models.ts`** per R-10 | P1 R-10 | 5 files | 15 minutes |
| F15 | **Replace `any` in interceptors + auth services with `unknown` + type guards** | P2 R-26 | `response-interceptor.ts`, `auth.service.ts`, auth feature components | 2–4 hours |
| F16 | **Add OnPush to 10 components missing it** | P2 R-09/R-24 | 10 components | 30 minutes |
| F17 | **Replace directional `mr-*` / `ml-*` / `pl-*` / `text-left` with logical `me-*` / `ms-*` / `ps-*` / `text-start`** in skeletons.ts, showcase-tooltip, hero, component-card, tabs-actions-demo + auth templates | P1 R-15/R-34 | 8 files | 2 hours |
| F18 | **Audit `--sb-icon-size` / `--sidebar-w` / `--skel-*` / `--fw-*` / `--lh-*` / `--radius-md`** for orphan status — cross-ref against token registry; rename or define | P1 R-17 | Aggregation wave | 1 hour |
| F19 | **Consider deleting `preview-page.component.ts`** (no router registration found that protects it; `preview-shell.component.ts` covers all preview cases) | P2 R-23 | 1 file | 15 minutes after Wave 4 confirmation |
| F20 | **Vendored `font-awesome/all.min.css` (102 KB)** — audit which icon classes still resolve to it (model `iconClass: 'fa-solid fa-desktop'`); consider replacing with Falcon icon font | P2 R-01-spirit | Asset + `index.html` `<link>` line 11 + `layout/model/models.ts` | Multi-hour deferred work |

## 8. Architecture observations

1. **Two distinct quality tiers exist in this app.** The `shared-components/` layer (especially `OrganizationHierarchyTreeComponent`) is exemplary modern Angular 21 — signals, OnPush, `input()`/`output()`, no constructor injection, library-skeleton + app-wrapper pattern, terse `*** ***` banner comments documenting the architecture rule. The auth feature is an unmodernized prototype import — five SCSS files, raw HTML controls, decorator inputs, missing OnPush, phantom CSS variables. The audit's largest single recommendation is to bring auth up to the org-hierarchy-tree standard.

2. **The Falcon UI library is mature enough to cover auth** — `<falcon-input>`, `<falcon-input-tw>`, `<falcon-password-tw>` (added 2026-05-16), `<falcon-button>`, `<falcon-button-tw>` all exist. There is no library gap that justifies the auth feature's raw-HTML approach.

3. **MF surface is sound.** `module-federation.config.ts` is clean, Angular eager-share contract intact, Wave PR-8 PrimeNG cleanup preserved. The `core/services/remote-route.service.ts` + `core/module-federation/` cluster (RemoteManifestProvider + mf-diagnostic) is a thoughtful abstraction documented in memory. No regressions.

4. **The flat-vs-nested service split is unresolved.** Two `remote-route.service.ts` + two `remote-config.ts` files exist — flat copies at `app/` are dead. Suggests a half-completed reorganization. Wave 4 should delete the flat copies.

5. **The `playground/playground.page.html` (4,080 lines) is a single mega-template.** It is auth-free and dev-only (route `/playground`), so production impact is zero, but it is the largest file in the app and the hardest to maintain. Tier-2 refactor candidate.

6. **Vendored `font-awesome/all.min.css` (~100 KB)** is loaded at `<head>` in `index.html:9-12`. Only one in-code reference (`layout/model/models.ts:9` example comment `'fa-solid fa-desktop'`). If no real `iconClass` field uses it, the entire asset is dead.

7. **Two preview / dev routes (`/preview`, `/preview-shell`)** with hardcoded English strings + Tailwind-but-no-token-anchored layouts. Both should be marked DEV-ONLY in route metadata (they already carry that comment).

## 9. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Auth screens look broken after removing phantom `--login-*` tokens | High | High | Token replacement work must precede SCSS deletion. Fall back to `var(--falcon-neutral-X)` / `var(--falcon-teal-X)` per design system. |
| Removing `styles.scss` breaks Poppins/Inter font cascade for older browsers | Low | Medium | Move font declarations into `tailwind.css` `@theme` first; verify in build before deleting `styles.scss` from `project.json` styles array. |
| Falcon library equivalents for OTP cluster input don't exist | Low | Low | OTP screen uses 6 numeric inputs side-by-side; if `<falcon-input>` does not support digit-segmented OTP, add a `<falcon-otp-input>` library skeleton component (deferred work flagged in `WAVE-2-PLAN.md`). |
| Removing dead duplicate `remote-route.service.ts` breaks a remote that imports it | Medium | High | Run `rg "from\s+['\"].*\bapp/remote-route\b"` across entire workspace before deletion. Verified scope-local: no admin/management/host consumer. |
| Token rename of `--sb-icon-size` etc. breaks sidebar visuals | Low | Low | These tokens are scoped to a single SCSS file; rename + verify in component. |
| Migrating `do-payment-priority-popup` to signals breaks its consumer in admin-console | Low | High | Admin-console imports the component via `@host-shell/shared/do-payment-priority-popup` — `[trigger]` input binding is template syntax that works for both decorator-based and `input()`-based inputs. Safe to migrate. |
| Deletion of `font-awesome/all.min.css` breaks an icon used somewhere we missed | Medium | Medium | Pre-deletion: search whole workspace for `fa-` class names + `fa-solid` / `fa-regular`. Defer to Tier-2. |
| Build-blocking `styleUrls` removal without HTML/template migration ready | Medium | High | Fix wave plan ordered F3 → F5 in priority — never remove `styleUrls` before the Tailwind-utility replacement has been wired in. |

---

**Audit complete.** All findings cite file:line with quote evidence. READ-ONLY mode held throughout.
