---
scope: apps/admin-console
architect: A2
date: 2026-05-16
files_in_scope: 88
total_findings: 96
p0: 19
p1: 47
p2: 30
---

# Audit — apps/admin-console

## 1. Inventory

### Top-level structure

```
apps/admin-console/
├── eslint.config.mjs
├── module-federation.config.ts
├── project.json                      # ← P0: wires apps/admin-console/src/styles.scss + inlineStyleLanguage:"scss"
├── webpack.config.ts | webpack.prod.config.ts | vite.config.mts
├── public/  | mocks/  | (no __tests__ in src)
└── src/
    ├── index.html                    # `p-rtl` class residue + inline IIFE writing dir/lang/data-theme on documentElement
    ├── main.ts                       # OUT OF SCOPE (bootstrap)
    ├── bootstrap.ts                  # IN SCOPE — `EmptyHostComponent` with `standalone: true`, `(ev: any)` in router log
    ├── styles.scss                   # P0 — SCSS forbidden (R-02). Two `:where()` rules patching `.contracts-page`
    ├── tailwind.css                  # Tailwind v4 entry (allowed CSS — sole canonical token entry)
    ├── environments/                 # 3 env stubs (out of audit interest)
    └── app/
        ├── app.config.ts             # Zoneless + animations + HTTP/router config (clean)
        ├── app.routes.ts             # Lazy-loaded /org-hierarchy-page route (clean)
        ├── remote-entry/entry.routes.ts  # Re-exports app.routes for MF
        └── features/
            └── org-hierarchy-page/   # ONLY feature in admin-console
                ├── org-hierarchy-page.routes.ts
                ├── models/models.ts                                  # ✓ R-10
                ├── services/
                │   ├── services.ts                                    # ✓ R-10
                │   ├── hierarchy-page-state.service.ts                # ✗ R-10: separate file in services/
                │   ├── otp-mock.service.ts                            # ✗ R-10
                │   ├── mock-applications.ts | mock-tree.ts            # ✗ R-10 (mock-data — should be in models or fixtures/)
                │   ├── validation-messages.ts | validators.ts         # ✗ R-10
                └── components/
                    ├── org-hierarchy-page-menu.component.{ts,html}    # 800+ LOC orchestrator with imperative Stencil patching
                    ├── falcon-status/                                  # `app-falcon-status` (selector deviation — uses `app-` prefix, not `falcon-`)
                    ├── skeleton/                                       # Single-file inline-template skeleton (uses `bg-emerald`, `bg-amber`, `bg-rose`, `bg-slate`)
                    ├── user-details/                                   # 315-line user details overlay
                    ├── verify/otp-dialog.component.{ts,html}           # ← Inline `<style>` block (P0)
                    ├── wizard-components/
                    │   ├── add-client-wizard/                         # 5-step wizard
                    │   │   ├── client-information-step/, client-settings-step/, client-comm-channels-step/, client-applications-step/, client-account-owner-step/, client-service-row-table/
                    │   │   ├── models/models.ts, services/services.ts
                    │   └── add-user-wizard/                           # 3-step wizard
                    │       ├── user-personal-step/, user-role-status-step/, user-permissions-step/
                    │       ├── models/models.ts, services/services.ts
                    └── tab-components/
                        ├── apps-services-tab/, comm-channels-tab/    # Thin wrappers around shared applications-table — duplicates each other
                        ├── settings-tab/                              # Wraps client-settings-step in view/edit mode
                        ├── applications-table/                        # `falcon-angular-data-table` consumer with shadow-rows
                        ├── falcon-table-edit-row/                     # ← Many inline `style="width:Npx"`
                        └── hierarchy-tab/
                            ├── falcon-org-info-panel/                 # `text-falcon-danger-600` (unknown token)
                            ├── falcon-org-node-drawer/                # Raw `<input>` + raw `<button>` (Falcon equivalents exist)
                            ├── falcon-org-node-header/                # Raw `<img>` (no NgOptimizedImage)
                            └── falcon-org-chart/                      # services/chart-layout.service.ts (R-10), directives/directives.ts ✓
                                ├── falcon-org-chart/                   # Uses `var(--falcon-neutral-150|400|teal-700)` — NOT in registry
                                ├── falcon-chart-toolbar/              # `z-[5]` hardcoded z-index + hand-rolled buttons
                                └── falcon-chart-card/                  # Hardcoded `rgba(13,63,68,0.05)` shadow
```

### Pages (lazy-loaded top-level routes)

| Page | File | Components used | Services injected |
|---|---|---|---|
| /org-hierarchy-page | `components/org-hierarchy-page-menu.component.ts:1` | 21 library + 14 app components | `HierarchyPageStateService` (page-scoped), `TranslateService` |

### Feature folders (one feature: `org-hierarchy-page`)

| Folder | TS files | Has `models.ts` | Has `services.ts` | Has `resolvers.ts` | Has `directives.ts` |
|---|---|---|---|---|---|
| `org-hierarchy-page/` | 9 (loose `validators.ts`, `mock-tree.ts`, `mock-applications.ts`, `validation-messages.ts`, etc.) | ✓ | ✓ (+ 6 sibling .ts) | ✗ | ✗ |
| `wizard-components/add-client-wizard/` | per-step folders + `models/models.ts` + `services/services.ts` | ✓ | ✓ | ✗ | ✗ |
| `wizard-components/add-user-wizard/` | per-step folders + `models/models.ts` + `services/services.ts` | ✓ | ✓ | ✗ | ✗ |
| `tab-components/hierarchy-tab/falcon-org-chart/` | `services/chart-layout.service.ts` (R-10 ✗), `directives/directives.ts` ✓, `models/models.ts` ✓ | ✓ | ✗ (wrong name) | ✗ | ✓ |
| `tab-components/hierarchy-tab/falcon-org-info-panel/` | `models/models.ts` ✓ | ✓ | ✗ | ✗ | ✗ |

### Shared components (no `shared-components/` directory — all components are co-located in `features/org-hierarchy-page/components/`)

The Admin Console does **not yet have a `shared-components/<name>/<name>-wrapper`** layer (R-08 pattern is N/A for the current feature surface — admin-console is a single-feature app today). Memory `feedback_library_skeleton_app_api` notes the canonical pattern lives at `apps/host-shell/src/app/shared-components/<name>/`. Admin-console's only Falcon-library consumer that injects services is `OrgHierarchyPageMenuComponent` itself — it directly injects `HierarchyPageStateService` and patches Stencil custom-elements imperatively. Two acceptable choices:
1. Keep as-is — it's a page, not a wrapper.
2. Lift the imperative Stencil patching into a `shared-components/org-hierarchy-page-wrapper/` per R-08.

No raw `<falcon-angular-*>` skeleton consumed bypassing a wrapper was found.

## 2. Findings by rule

### R-01 — No PrimeNG / PrimeIcons / Aura (P0)

✅ **CLEAN** — Zero matches for `from 'primeng/'`, `<p-*>`, `pi pi-*` class, `primeicons`, `aura-`, `PrimeNGModule`, `@primeng`.

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

**Caveat (low-severity heritage):** `index.html:23` adds the class `p-rtl` to `document.documentElement` — this is a legacy PrimeFlex/PrimeNG RTL marker class. It's not an import (R-01 passes) but suggests downstream CSS may still expect it. **Flag-only** as P2 cleanliness for the broader purge.

### R-02 — No SCSS / no component CSS / no `styleUrls` / no inline `style=""` (P0)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 02-A | `apps/admin-console/src/styles.scss` | full file | Two `:where(.contracts-page p)` / `:where(.contracts-page span:not([class]))` rules with `revert-layer`. File is a `.scss` and wired through `project.json:39 + 18 (inlineStyleLanguage: "scss")` | **P0** | Migrate the two `:where()` rules into a Tailwind layer in `tailwind.css` or remove (Wave PR-8 already dropped the PrimeNG imports). Drop `styles.scss` from `project.json` styles[] and flip `inlineStyleLanguage` to a non-SCSS value (or remove). |
| 02-B | `apps/admin-console/project.json` | 18 | `"inlineStyleLanguage": "scss"` | **P0** | Remove or set to `"css"`. |
| 02-C | `apps/admin-console/project.json` | 39 | `"apps/admin-console/src/styles.scss"` in `styles[]` | **P0** | Remove. |
| 02-D | `components/verify/otp-dialog.component.html` | 26-38 | Inline `<style>` block inside the template (component CSS embedded into HTML) — styles `::backdrop` and `.otp-box-wrapper` with `transform: scale(1.5)`, `padding: 20px 40px`, `background: rgba(13, 63, 68, 0.55)`, `backdrop-filter: blur(1px)` | **P0** | Move to canonical theme entry as `dialog[data-component="app-otp-dialog"]::backdrop` token + use `<falcon-angular-dialog>` or a Falcon overlay primitive that owns the backdrop. |
| 02-E | `components/verify/otp-dialog.component.html` | 18 | `<dialog ... style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 0; margin: 0; background: transparent; width: 750px; max-width: 94vw; max-height: 94vh;">` | **P0** | Replace literal `style=` with Tailwind utilities (`fixed top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] max-w-[94vw] max-h-[94vh] p-0 m-0 bg-transparent`) or use Falcon dialog primitive. |
| 02-F | `components/verify/otp-dialog.component.html` | 44 | `<div class="relative bg-white rounded-2xl overflow-hidden" style="width: 100%; box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30);">` | **P0** | Tokenize via `--falcon-overlay-shadow-xl` or similar, drop inline `style=`. |
| 02-G | `components/verify/otp-dialog.component.html` | 48 | `<div class="w-full bg-falcon-teal-700" style="height: 8px;" aria-hidden="true"></div>` | **P0** | `h-2` or `h-[8px]` (token), drop `style=`. |
| 02-H | `components/verify/otp-dialog.component.html` | 53 | `style="top: 32px; inset-inline-end: 36px; width: 28px; height: 28px;"` | **P0** | `top-8 end-9 w-7 h-7`. |
| 02-I | `components/verify/otp-dialog.component.html` | 63 | `style="padding: 72px 72px 64px 72px; gap: 36px;"` | **P0** | `px-[72px] pt-[72px] pb-[64px] gap-9`. |
| 02-J | `components/verify/otp-dialog.component.html` | 67, 73, 76, 92, 127 | Repeated `style="font-size: 40px / 18px / 22px / 28px / 38px"` for typography | **P0** | Move to typography scale tokens (canonical scale per R-06/Noor); banish ad-hoc font-size values. |
| 02-K | `components/verify/otp-dialog.component.html` | 72 | `style="gap: 6px;"` | **P0** | `gap-1.5`. |
| 02-L | `components/verify/otp-dialog.component.html` | 111 | `style="width: 140px; height: 140px; margin-top: 12px;"` | **P0** | `w-[140px] h-[140px] mt-3` (or token). |
| 02-M | `components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 18, 22, 24, 27, 39, 52, 54, 56, 59 | 9 inline `style="width: 96px/140px/180px/220px/260px"` + `style="background: #F3F8F5; padding-inline: 16px"` | **P0** | Move column widths into a CSS Grid layout owned by the parent table; the comment on line 14 calls out that this is a workaround for a `<tr><td colspan>` projection. The hex `#F3F8F5` is a hardcoded color (also R-03 hit). |
| 02-N | `components/org-hierarchy-page-menu.component.html` | 217 | `<falcon-angular-data-table style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falcon-table-footer-bg: var(--color-falcon-neutral-30, #f7f8fa);">` | **P0** | Set CSS custom properties at the component host class via a Tailwind utility (`[--falcon-table-header-bg:var(--color-falcon-neutral-30)]`) or move the override into a falcon-tailwind-tokens.css preset. |
| 02-O | `components/org-hierarchy-page-menu.component.ts` | 182-184, 195-198, 220-232, 235-236 | Imperative `t.style.setProperty('--falcon-table-header-bg', '#f5f5f5')` and many similar setProperty calls (TS-side inline style assignments) | **P0** | Same as 02-N — these write CSS custom properties from TS as a Stencil-prop-forwarding workaround. Rule-strictly this is "inline style via DOM API" — R-02 covers `style="..."` literals; per Conflicts C-3 in the digest, computed `[style.foo.unit]` bindings are allowed but **unconditional `el.style.setProperty()` from TS to override a third-party shadow root is borderline**. Flag as P0 because the values themselves are also hardcoded hex/px literals (R-03). The cleanest fix is for the library to expose proper inputs. |
| 02-P | `components/skeleton/org-hierarchy-skeleton.component.ts` | 56-58, 71, 83, 85 | Inline `style="height: calc(95vh - 40px)"` (line 71) + `[style]="indentStyle(row.indent)"` resolving to a string literal `"margin-left: 24px"` / `"margin-left: 48px"` (lines 56-58 in const + line 83 binding) | **P0** | Replace `[style]` raw-string assignment with `[style.padding-inline-start.px]="indent*24"` (logical, RTL-safe); replace `style="height: calc(95vh - 40px)"` with `h-[calc(95vh-40px)]` Tailwind utility. |
| 02-Q | `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 42-54 | Documented exception (line 42-44 comment): native `<input falconIpAddress>` because `FalconIpAddressDirective` needs raw `ElementRef.nativeElement.value`. Not flagged as new violation — pre-existing GAP-LIB. Flag-only as P2 ASSUMPTION (the directive could be ported to work with the Falcon wrapper). | P2 | Migrate `FalconIpAddressDirective` to accept the Falcon wrapper's input event surface. |

**Subtotal R-02: 16 P0 + 1 P2.**

### R-03 — No hardcoded colors / spacing / radii / shadows / fonts (P0)

Per the rule: Tailwind arbitrary values `[#hex]` / `[12px]` / `[2px_4px_8px]` are forbidden unless they reference a token. **Exception:** hex inside a `var()` fallback is allowed. Existing 1053 grandfathered values are not blocked by Gate 08 but the audit must surface them.

Findings limited to **new** hardcoded values (the `tailwind.css` `@source inline("...var(--..., #hex)")` lines all use the `var(--token, #fallback)` shape — those are allowed):

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 03-A | `components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 18 | `style="background: #F3F8F5; ..."` — raw hex outside any `var()` fallback | **P0** | Token: introduce `--falcon-edit-row-stripe-bg` and reference it. |
| 03-B | `components/verify/otp-dialog.component.html` | 28 | `background: rgba(13, 63, 68, 0.55);` (inside `<style>` block) | **P0** | Token: `--falcon-dialog-backdrop-bg` (overlay tokens). |
| 03-C | `components/verify/otp-dialog.component.html` | 44 | `box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30);` | **P0** | Token: `--falcon-overlay-shadow-xl`. |
| 03-D | `components/org-hierarchy-page-menu.component.ts` | 220-221 | `t.style.setProperty('--falcon-table-header-bg', '#f5f5f5')` + footer-bg same | **P0** | Define a `--falcon-table-header-bg-canonical` named token in the canonical token registry; reference it. Currently fully hardcoded with a comment explaining `--color-falcon-neutral-50` is the wrong shade. |
| 03-E | `components/org-hierarchy-page-menu.component.ts` | 222-223 | `--falcon-table-container-border-radius: '0px'` + `--falcon-table-container-bg` defaulting to a hex | P1 | Token already exists (`--falcon-table-container-border-radius` is in registry); the literal `'0px'` should be `var(--falcon-radius-0)` if such a token exists, or 0 should remain (it's a "neutral zero" not a design value). |
| 03-F | `components/org-hierarchy-page-menu.component.ts` | 227-228, 232 | `'25px'`, `'12px'`, `'20px'` hardcoded padding values | P1 | Spacing tokens — define `--falcon-table-header-padding-block-tall`, etc. The values are explained by a verbose comment but they're still hardcoded. |
| 03-G | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 1 | `shadow-[0_2px_10px_rgba(13,63,68,0.08)]` arbitrary Tailwind value with raw rgba | **P0** | Token: `--falcon-elevation-shadow-low` or similar; replace with `shadow-falcon-low`. |
| 03-H | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 105 | `shadow-[0_2px_8px_rgba(13,63,68,0.08)]` arbitrary Tailwind value with raw rgba | **P0** | Same fix as 03-G. |
| 03-I | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 3 | `shadow-[0_1px_3px_rgba(13,63,68,0.05)]` arbitrary Tailwind value with raw rgba | **P0** | Token: `--falcon-elevation-shadow-xs` or similar. |
| 03-J | `components/skeleton/org-hierarchy-skeleton.component.ts` | 19-23 | Non-Falcon palette tokens: `bg-emerald-100`, `bg-amber-100`, `bg-rose-100`, `bg-slate-200` (raw Tailwind defaults — NOT Falcon-namespaced) | **P0** | Replace with `bg-falcon-green-100`, `bg-falcon-amber-100`, `bg-falcon-red-100`, `bg-falcon-neutral-200`. |
| 03-K | `components/skeleton/org-hierarchy-skeleton.component.ts` | 70, 74, 77, 87, 89, 95-156 | Raw `bg-slate-*`, `bg-slate-300/70`, `border-slate-200`, `border-slate-100`, `bg-emerald-50/40`, `bg-slate-50/60` everywhere in the skeleton template | **P0** (≈30 instances) | Replace with Falcon-namespaced equivalents (`bg-falcon-neutral-*`, `border-falcon-neutral-*`, `bg-falcon-green-*`). Hardest case is the `/40` and `/70` alpha modifiers — they need Falcon-namespaced color/alpha pairs in the token registry. |
| 03-L | `tailwind.css` | 729-1051 | All `@source inline("...,#hex")` lines have hex inside `var(--token, #hex)` fallback — **ALLOWED per R-03 exception**. **NOT flagged.** | — | — |
| 03-M | Many HTML files | many | `text-[10px]` / `text-[11px]` / `text-[11.5px]` / `text-[12.5px]` / `text-[13px]` / `text-[13.5px]` / `text-[15px]` / `text-[18px]` / `text-[28px]` / `text-[38px]` / `text-[40px]` — non-tokenized typography scale across the entire feature | **P0** (≈80 instances) | Drive every font-size through the canonical Noor typography scale. |
| 03-N | Many HTML files | many | `rounded-[10px]`, `rounded-[14px]`, `rounded-[4px]`, `h-[34px]`, `w-[34px]`, `w-[30px]`, `h-[30px]`, `px-[14px]`, `px-[18px]`, `py-[14px]`, `py-[7px]`, `px-[10px]`, `right-[10px]`, etc. | **P0** (≈30 instances; 03-G/H/I cover the shadows) | Token-back radii, spacings, sizing primitives. |

**Subtotal R-03: ≈115 P0 hardcoded-value instances** (the vast majority are typography sizes + arbitrary spacings in templates). The 5 most concentrated offenders are `org-hierarchy-skeleton.component.ts`, `otp-dialog.component.html`, `falcon-table-edit-row.component.html`, `org-hierarchy-page-menu.component.{ts,html}`, and the three `falcon-org-chart` files.

### R-04 — No hardcoded z-index (P0)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 04-A | `tailwind.css` | 717 | `@source inline("z-[2]");` — safelist for a literal `z-[2]` | **P0** | Remove from safelist; use overlay-ladder token. |
| 04-B | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 1 | `class="absolute bottom-3.5 end-3.5 z-[5] ..."` hardcoded `z-[5]` | **P0** | Replace with overlay-ladder token. Per memory `project_zindex_calendar_portal_root_cause_fix`, the chart toolbar should use the canonical ladder (likely a "toolbar-overlay" tier). |
| 04-C | `components/verify/otp-dialog.component.html` | 52 | `class="absolute inline-flex ... z-10"` Tailwind preset `z-10` | P2 (Tailwind preset, not strictly arbitrary) | If the dialog is now in the native top-layer (line 18 uses `<dialog>` with `showModal()`), `z-10` for the close button is fine inside the dialog. Flag-only — review whether `z-10` is needed at all. |
| 04-D | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 105 | `class="... z-10 ..."` Tailwind preset | P2 | Same as 04-C — flag-only. |

**Subtotal R-04: 2 P0 + 2 P2.**

### R-05 — Build must be GREEN (P0)

Did not run `nx build admin-console` (read-only audit). The 19 P0 + 47 P1 issues above will not break a build (they're rule violations, not compiler errors). Per memory `project_falcon_revamp_v3_1_night_shift_results`, admin-console main.js was baselined at 1,210 KB raw / 335 KB gzipped — well under Gate 11's 340 KB budget. **No P0 build hits surfaced via static read.**

### R-06 — Noor naming for tokens and component tags (P0)

Admin Console scope is **palette-over-intent** for color names (forward-only — don't migrate existing semantic tokens).

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 06-A | `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 49, 72 | `text-falcon-danger-600` — semantic-intent name (`danger`), AND the token `--color-falcon-danger-600` does NOT exist in the registry (also R-01 token-reality miss) | **P0** | Noor-rename to `text-falcon-red-600` (forward-only NEW code rule); also define `--color-falcon-red-600` if a 600-shade is genuinely needed (or use `text-falcon-red-500` / `-700` from existing shades). |
| 06-B | `components/user-details/user-details-page.component.html` | 127, 158 | `bg-falcon-warning-100 text-falcon-warning-700 hover:bg-falcon-warning-200` — semantic-intent name (`warning`), tokens NOT in registry | **P0** | Noor-rename to `bg-falcon-amber-100 text-falcon-amber-700 hover:bg-falcon-amber-200`; ensure `--color-falcon-amber-100/200` exist (currently registry has 50/500/700 only — need to add 100 and 200). |
| 06-C | `components/user-details/user-details-page.component.html` | 132, 163 | `bg-falcon-success-100 text-falcon-success-700` — semantic-intent + tokens NOT in registry | **P0** | Noor-rename to `bg-falcon-green-100 text-falcon-green-700` (those tokens exist). |
| 06-D | `components/user-details/user-details-page.component.html` | 280 | `text-falcon-red-600` — token `--color-falcon-red-600` does NOT exist (registry has 50/100/500/700/900) | **P0** | Use existing `text-falcon-red-500` or `text-falcon-red-700`; OR add `--color-falcon-red-600` to the registry. |
| 06-E | `components/falcon-status/falcon-status.component.ts` | 26-33 | Status pill class strings use palette names: `bg-falcon-green-50`, `bg-falcon-amber-50`, `bg-falcon-red-100` (Noor-compliant ✓). One mix: `bg-falcon-amber-50` for "pending" (intent) but the class itself is palette-named, so this PASSES Noor. | ✓ | No change. |
| 06-F | All component selectors | various | `app-` prefix used for all in-app components (e.g. `app-falcon-status`, `app-otp-dialog`, `app-org-hierarchy-page-menu`, etc.). Pattern matches R-06 (`falcon-*` lowercase-kebab-case is for **library** components; app components use `app-*` per Angular convention.). | ✓ | No change. |

**Subtotal R-06: 4 P0** (all are Noor-naming + token-reality combos).

---

### R-07 / R-12 — Falcon library FIRST + Native HTML control = GAP (P1)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 07-A | `components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 25-31 | Raw `<input id="orgNodeNameInput" type="text" class="..." [value]="..." (input)="...">` where `<falcon-angular-input>` is used elsewhere in this same file | **P1** | Migrate to `<falcon-angular-input>`. |
| 07-B | `components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 14, 45, 50 | Raw `<button type="button">` × 3 (close, cancel, save) — file does NOT import or use `<falcon-angular-button>` anywhere | **P1** | Migrate all 3 to `<falcon-angular-button>` (Falcon supports `variant`, `size`, slot icons). |
| 07-C | `components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | (the rest) | `<falcon-angular-button>` IS used here for Cancel/Save (lines 73-83) — ✓ clean for buttons. | — | — |
| 07-D | `components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` | 54-60 | Raw `<button type="button" class="absolute right-[10px] ...">` for the password-show/hide toggle | **P1** | Migrate to `<falcon-angular-button>` (or the password Falcon component should already have a built-in show/hide affordance — verify per Falcon `<falcon-password>`). |
| 07-E | `components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 16-24 | Hand-rolled toggle switch: `<button type="button" role="switch" [attr.aria-checked]="r.visible" ...>` with absolutely-positioned span | **P1** | Migrate to `<falcon-angular-switch>` (used by `applications-table` line 46). |
| 07-F | `components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 56-63 | Raw `<input type="number" min="0" ...>` with custom Tailwind border styling. `<falcon-angular-input-number>` exists (used in `client-settings-step.html:145+`) | **P1** | Migrate to `<falcon-angular-input-number>` (size="sm" supported). |
| 07-G | `components/user-details/user-details-page.component.html` | 7-12, 24-37, 126-130, 157-161, 284-300 | 7 raw `<button type="button">` for back arrow, edit toggle, "Verify" pill button (×2), Cancel + Save in footer | **P1** | Migrate all 7 to `<falcon-angular-button>`. Particularly the Cancel/Save pair on lines 284-300 mirrors the same Cancel/Save pattern in `falcon-table-edit-row.component.html` which DOES use `<falcon-angular-button>`. |
| 07-H | `components/org-hierarchy-page-menu.component.html` | 192-198 | Raw `<button type="button" ...><i class="falcon-icon falcon-icon-filter ..."></i><span>{{ ... }}</span></button>` for the "Filter" button | **P1** | Migrate to `<falcon-angular-button>` with `slot="icon-start"`. |
| 07-I | `components/verify/otp-dialog.component.html` | 51-60, 134-146 | 2 raw `<button type="button">` for close X and Resend link. Close X especially has an SVG path that should be `<falcon-angular-button variant="ghost">` with `<falcon-angular-icon name="close"/>` | **P1** | Migrate both. |
| 07-J | `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 56-65 | 2 raw `<button type="button">` for IP commit (+) and IP cancel (×) inline buttons | **P1** | Migrate to `<falcon-angular-button variant="ghost" size="xs">` or similar — these are visual chips that should live in the library. |
| 07-K | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 2-43 | 4 raw `<button type="button">` for zoom-in, zoom-out, fit, reset | **P1** | Migrate to `<falcon-angular-button variant="ghost" size="sm">` with icon slots. Or — the entire toolbar is a candidate for a Falcon `<falcon-angular-toolbar>` skeleton with a structured action API. Flag as architectural GAP. |
| 07-L | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 65-76, 103-110 | Raw `<button type="button" class="chart-user-circle ...">` for user circles + raw `<button>` for "exit focus" | **P1** | The chart user-circle button is custom UX (no Falcon equivalent). Flag-only as GAP. Exit-focus button → `<falcon-angular-button>`. |
| 07-M | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 1-58 | Outer `<button>` is the chart-card itself — has its own keyboard handlers (Enter/Space). Falcon does not currently ship a card-button. | GAP-only | Flag as `GAP-CARD-INTERACTIVE`. |

**Subtotal R-07/R-12: 11 P1 + 2 GAP** (mostly buttons; one raw input remaining is documented exception).

### R-08 — Library skeleton vs app wrapper pattern (P1)

Admin Console has no `shared-components/` folder. All Falcon library consumers are pages or feature components. The pattern is N/A for the current feature surface (single feature: `org-hierarchy-page`). **No P1 hits.**

However:
- `components/org-hierarchy-page-menu.component.ts` calls `document.querySelector('app-org-hierarchy-page-menu')` (line 171) and then patches Stencil custom-element props imperatively (lines 218-251). This is a workaround pattern that R-08's wrapper layer would ideally hold. **Flag-only as P2 architectural debt** — when a Falcon `<falcon-angular-data-table>` ships proper Angular inputs for all the table CSS-var overrides, this imperative patching can be deleted.

### R-09 — Angular 21 idioms (P1)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 09-A | `bootstrap.ts` | 10-16 | `@Component({ standalone: true, selector: 'app-root', ...})` — in Angular v20+, `standalone: true` is the default and should be omitted | **P1** | Remove `standalone: true`. Also applies to all 27 component files (see list in R-09-B). |
| 09-B | All 27 `.component.ts` files | various | All 27 components declare `standalone: true` explicitly — Angular 21 default. | **P1** | Remove `standalone: true` from all 27 component decorators. |
| 09-C | `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.ts` | 51 | `@HostBinding('attr.data-readonly') get _readonlyAttr(): '' \| null { return this.readonly() ? '' : null; }` | **P1** | Replace with `host: { '[attr.data-readonly]': "readonly() ? '' : null" }` in the `@Component` decorator. |
| 09-D | `bootstrap.ts` | 31 | `router.events.subscribe((ev: any) => console.log('ROUTER EVENT →', ev));` — `any` type + leftover debug log | **P1** | Type `ev` as `Event` (Angular router) or `RouterEvent`; remove debug log before shipping. |
| 09-E | All component files | — | `@if`/`@for`/`@switch` used throughout ✓ — no `*ngIf`/`*ngFor`/`*ngSwitch` matches found | ✓ | No change. |
| 09-F | All component files | — | `input()`, `output()`, `model()`, `signal()`, `computed()` used throughout ✓; no `@Input` / `@Output` decorators found | ✓ | No change. |
| 09-G | All component files | — | `ChangeDetectionStrategy.OnPush` set on 27/27 component .component.ts files ✓ | ✓ | No change. |
| 09-H | All `.ts` files | — | No `NgZone`, `zone.js`, `[ngClass]`, `[ngStyle]`, `.mutate(` matches | ✓ | No change. |
| 09-I | All `.ts` files | — | No constructor-injection of services found (all use `inject()`) — Wave 19 migration | ✓ | No change. |

**Subtotal R-09: 30 P1** (27 standalone:true + 1 HostBinding + 1 standalone:true in bootstrap + 1 router event `any`).

### R-10 — Folder structure / one file per type-folder (P1)

The rule: every feature uses `models/models.ts`, `services/services.ts`, `resolvers/resolvers.ts`, `directives/directives.ts` — ONE file per type-folder.

| # | Folder | Files | Severity | Fix |
|---|---|---|---|---|
| 10-A | `services/` (top of `org-hierarchy-page`) | `services.ts` + `hierarchy-page-state.service.ts` + `otp-mock.service.ts` + `mock-applications.ts` + `mock-tree.ts` + `validation-messages.ts` + `validators.ts` (7 files) | **P1** | Two acceptable resolutions: (a) merge ALL service classes/functions into `services/services.ts` (the rule); or (b) move mocks + validators + validation-messages out of `services/` to dedicated sibling folders (`fixtures/`, `validators/`, `messages/`) each with its plural single-file. Current state mixes services with mocks/validators which makes the folder ambiguous. |
| 10-B | `components/tab-components/hierarchy-tab/falcon-org-chart/services/` | `chart-layout.service.ts` (single file but WRONG name — should be `services.ts`) | **P1** | Rename `chart-layout.service.ts` → `services.ts`. |
| 10-C | `components/tab-components/hierarchy-tab/falcon-org-chart/directives/` | `directives.ts` ✓ | ✓ | No change. |
| 10-D | All `models/` folders | All have `models.ts` ✓ (5 of them) | ✓ | No change. |
| 10-E | `components/wizard-components/add-client-wizard/services/` | `services.ts` ✓ | ✓ | No change. |
| 10-F | `components/wizard-components/add-user-wizard/services/` | `services.ts` ✓ | ✓ | No change. |

**Subtotal R-10: 2 P1.**

### R-11 — Tailwind grid FIRST (P1)

Manual review — most layouts already use `grid`. Flagged candidates that could be cleaner as grid:

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 11-A | `components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` | 17, 20-69 | `<div class="flex items-end gap-4 ...">` with 5 child spacers `<div style="width: Npx">` rebuilding the parent table's column layout in flex | **P1** | Switch to CSS Grid with `grid-cols-[96px_140px_180px_220px_1fr]` and lose all the inline-width spacers. The file comment (lines 13-16) already calls this a workaround for `<tr><td colspan>` projection. |
| 11-B | `components/skeleton/org-hierarchy-skeleton.component.ts` | 78-91, 92-100 | Tree row children use `grid-cols-[12px_24px_1fr]` ✓; tabs / header use `flex` — clean. | ✓ | No change. |

**Subtotal R-11: 1 P1.**

### R-13 — Auth: Frontend NEVER calls Zitadel directly (P1)

✅ **CLEAN** — no `zitadel.com`, `@zitadel/`, or `/zitadel/` matches.

### R-14 — Single workspace path (P1)

✅ **CLEAN** — no `WebstormProjects` or `falcon-web-platform-ui-old` references.

### R-15 / R-34 — i18n / RTL — logical properties only (P1/P2)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 15-A | `components/org-hierarchy-page-menu.component.html` | 60 | `<div class="pl-5 pr-2 pt-1 border-b ...">` — physical `pl-5 pr-2` | **P1** | Logical: `ps-5 pe-2`. |
| 15-B | `components/org-hierarchy-page-menu.component.html` | 200 | `<i class="... absolute left-2.5 ...">` — physical `left-2.5` | **P1** | Logical: `start-2.5`. |
| 15-C | `components/skeleton/org-hierarchy-skeleton.component.ts` | 56-58, 83 | Skeleton tree-row indent uses `margin-left: 24px` / `48px` via `[style]` (line 83) — physical left margin from a raw string | **P1** | Switch to `[style.padding-inline-start.px]="indent*24"` (logical, RTL-safe). |
| 15-D | `components/skeleton/org-hierarchy-skeleton.component.ts` | 85 | `<span class="absolute -left-3 top-0 h-full ...">` — physical `-left-3` for the tree connector | **P1** | Logical: `-start-3` (Tailwind v4 supports). |
| 15-E | `components/verify/otp-dialog.component.html` | 92 | `<span class="absolute left-1/2 top-1/2 ...">` — physical `left-1/2` for centering. **OK in RTL** (50% is direction-neutral) but `start-1/2` is the canonical idiom. | P2 | Logical: `start-1/2`. |
| 15-F | `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 24 | `<span class="flex flex-col gap-0.5 -ml-1">` — physical `-ml-1` | **P1** | Logical: `-ms-1`. |
| 15-G | `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 48 | `<input ... class="w-full h-9 px-3 pr-16 ...">` — physical `pr-16` | **P1** | Logical: `pe-16`. |
| 15-H | `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 55 | `<div class="absolute right-1 top-1/2 ...">` — physical `right-1` | **P1** | Logical: `end-1`. |
| 15-I | `components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 50 | `<span class="absolute left-2.5 ...">` — physical | **P1** | Logical: `start-2.5`. |
| 15-J | `components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 57 | `<input ... class="... pl-8 pr-3 ...">` — physical | **P1** | Logical: `ps-8 pe-3`. |
| 15-K | `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 49 | `<span class="... font-bold mr-0.5">*</span>` — physical `mr-0.5` for the required asterisk | **P1** | Logical: `me-0.5`. |
| 15-L | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 32 | `<div class="absolute top-0 left-0 origin-top-left ...">` — physical `left-0` and `origin-top-left` | **P1** | Logical: `start-0 origin-top-start`. (Tailwind v4 supports `origin-top-start`.) |
| 15-M | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 3 | `<button class="... text-left ...">` — physical | **P1** | Logical: `text-start`. |
| 15-N | `components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` | 54 | `<button class="absolute right-[10px] top-1/2 -translate-y-1/2 ...">` — physical `right-[10px]` (also arbitrary-value, R-03) | **P1** | Logical: `end-[10px]` (or token). |
| 15-O | All templates | — | No `<bdi>` or `dir="auto"` for user-generated content with mixed scripts (account names) | P2 | Wrap user names that may contain mixed Arabic + Latin in `<bdi>` or set `dir="auto"`. |

**Subtotal R-15/R-34: 11 P1 + 4 P2.**

### R-16 — A11y baseline (P1)

Applies to library `falcon-*.tsx` files. **N/A** for apps/admin-console (not a library).

App-level a11y observations (manual):
- ✓ `role="dialog"`, `aria-modal="true"`, `[attr.aria-label]` used in `otp-dialog.component.html`.
- ✓ `role="radiogroup"`, `aria-label`, `role="switch"`, `[attr.aria-checked]` used appropriately.
- ✗ `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` line 65-76 — the user-circle `<button>` has `[attr.aria-label]="u.firstName"` (good) but no clear focus state.

### R-17 — Token reality (P1 — but the misses listed are P0 under R-01/R-06 + R-03)

These are the consumption-side `var(--...)` and `bg|text|border-falcon-*` references that **do NOT resolve** in `02-token-registry-quick-grep.txt`:

| # | File | Line | Reference | Registry has | Severity | Fix |
|---|---|---|---|---|---|---|
| 17-A | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 19 | `var(--falcon-neutral-150)` | `--color-falcon-neutral-150` | **P0** | Rename to `var(--color-falcon-neutral-150)`. |
| 17-B | same file | 39 | `var(--falcon-neutral-400)` | `--color-falcon-neutral-400` | **P0** | Rename. |
| 17-C | same file | 57 | `var(--falcon-teal-700)` | `--color-falcon-teal-700` | **P0** | Rename. |
| 17-D | `components/user-details/user-details-page.component.html` | 127, 158 | `bg-falcon-warning-100 / text-falcon-warning-700 / hover:bg-falcon-warning-200` | no `--color-falcon-warning-*` shades exist | **P0** | Map to `amber` (see R-06-B). |
| 17-E | same file | 132, 163 | `bg-falcon-success-100 / text-falcon-success-700` | no `--color-falcon-success-100/700` (only `-20`/`-50`) | **P0** | Map to `green` (see R-06-C). |
| 17-F | same file | 280 | `text-falcon-red-600` | no `--color-falcon-red-600` (only 50/100/500/700/900) | **P0** | Use existing shade or add `-600` to registry. |
| 17-G | `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 49, 72 | `text-falcon-danger-600` | no `--color-falcon-danger-*` exists | **P0** | Noor-rename to `text-falcon-red-600` (after adding the 600 shade) — see R-06-A. |
| 17-H | `tailwind.css` | 41-44 | References `--falcon-size-icon-sm`, `--falcon-border-width-1-5`, `--falcon-border-width-1` | Registry has all three ✓ | ✓ | No change. |
| 17-I | `tailwind.css` | 1148-1151 | `--color-falcon-teal-500`, `--color-falcon-neutral-0` | Registry has both ✓ | ✓ | No change. |
| 17-J | `components/tab-components/applications-table/applications-table.component.html` | 167, 207 | `min-h-[var(--falcon-data-table-shadow-row-min-height)]` | Registry has `--falcon-data-table-shadow-row-min-height` ✓ | ✓ | No change. |

**Subtotal R-17: 7 P0 token-reality misses** (these overlap with R-06 since the misses are also Noor-naming violations).

### R-18 — Brain SK governance (P1 — procedural)

Audit method: read the relevant flow playbooks before implementing. Not directly checkable from code, but the high density of `Wave NN` + `Round N (date)` comments in templates (e.g. `org-hierarchy-page-menu.component.ts` lines 1-2, 137-139, 142-143, 162-184, 210-251) indicates iterative work without grounding in a single playbook. **Flag-only as procedural P1** — any future page-level change must reference `Brain Outputs/understanding/pages/organization-hierarchy/`.

### R-19 — No app→app imports, libs→apps imports, public-API only (P1)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 19-A | `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.ts` | 17 | `import { FalconAngularInputComponent } from '@falcon/ui-core/angular/falcon-input';` — deep-internal subpath import (the canonical public API barrel is `@falcon/ui-core/angular`, used by the rest of the codebase) | **P1** | Move import to `@falcon/ui-core/angular`. |

**Subtotal R-19: 1 P1.**

### R-20 — Module Federation safety (P1)

No `module-federation.config.ts` changes are part of the audit. The file exists at root. No findings.

### R-21 — No premature shared abstraction (P1)

- `tab-components/apps-services-tab/` and `tab-components/comm-channels-tab/` are 1-line wrappers around `<app-applications-table>` (identical structure, different `[rows]`/`titleKey`). **Flag as candidate for inline.** Single-line components for routing dispatch are not over-abstraction per se, but they're functionally identical wrappers. **Flag-only P2.**
- `components/falcon-status/` is unused per the comment in `org-hierarchy-page-menu.component.ts:34-36` ("Wave 19 (2026-05-14): FalconStatusComponent replaced by the library's <falcon-angular-status-badge>...consumer-side component kept on disk for reference but unused."). **Dead code — P2 cleanup.**

### R-22 — Comment style — terse `*** ... ***` banner (P2)

✅ Mostly compliant. Zero `@param`/`@returns` JSDoc found. All multi-line comments use `*** ... ***` banner format. However:

- Many banners exceed the "max 2 lines" guideline (R-22 says max 2 lines). Notable offenders:
  - `components/org-hierarchy-page-menu.component.ts` lines 210-251 — 40+ line banner explaining the table-header workaround. **P2** — split into a doc note in `Brain Outputs/`.
  - `components/verify/otp-dialog.component.html` lines 1-15 — 14-line opening comment. **P2**.
  - `components/skeleton/org-hierarchy-skeleton.component.ts` documented with single-line banners ✓.

**Subtotal R-22: ≈8 P2 over-long banner blocks.**

### R-23 — Clean code / DRY / minimal (P2)

| # | Observation | File | Severity |
|---|---|---|---|
| 23-A | `apps-services-tab` and `comm-channels-tab` are identical 5-line wrappers around the same `<app-applications-table>` — pure duplication. | `components/tab-components/{apps-services-tab,comm-channels-tab}/*` | P2 |
| 23-B | `components/falcon-status/` is dead code (replaced by `<falcon-angular-status-badge>` in Wave 19) but still on disk. | `components/falcon-status/*.ts` + `*.html` | P2 |
| 23-C | `components/org-hierarchy-page-menu.component.ts` is ~400 LOC orchestrator with deep imperative DOM patching. The `effect()` on lines 162-260 manipulates Stencil components imperatively via `querySelector` + `setProperty`. Symptomatic of library-API gaps. | `components/org-hierarchy-page-menu.component.ts` | P2 |
| 23-D | `bootstrap.ts:31` has a `router.events.subscribe(...)` debug logger left over | `bootstrap.ts` | P1 (already in 09-D) |

**Subtotal R-23: 3 P2.**

### R-24 — Components small + OnPush (P2)

- ✓ All 27 components have `ChangeDetectionStrategy.OnPush`.
- ✗ `components/org-hierarchy-page-menu.component.ts` is ~400 LOC + `org-hierarchy-page-menu.component.html` is 260+ LOC. **P2 — split.**
- ✗ `components/user-details/user-details-page.component.html` is 316 LOC with @switch handling 3 tabs inline. **P2 — split each tab into its own component (already done in wizard pattern).**

### R-25 — Services providedIn:'root' + inject() (P2)

- ✓ All injectable services use `providedIn: 'root'` except `HierarchyPageStateService` (page-scoped, intentional).
- ✓ All services use `inject()` not constructor injection.

### R-26 — TypeScript strictness — no `any` (P2)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 26-A | `bootstrap.ts` | 31 | `(ev: any) => console.log(...)` | P2 (also R-09-D) | Type as `Event` or remove the log. |
| 26-B | Multiple `.ts` files | many | `$any($event...)` template casts (e.g. `client-information-step`, `falcon-table-edit-row`, `org-hierarchy-page-menu`) used to defeat strict typing on event payloads | P2 | Type the event payload at the source (Falcon component output type). |

### R-27 — `NgOptimizedImage` for static images (P2)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 27-A | `components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 13 | `<img [src]="src" [alt]="nodeName()" class="w-full h-full object-cover" />` — no `ngSrc` directive | **P2** | Use `<img [ngSrc]="src" width="28" height="28" [alt]="nodeName()" />` + import `NgOptimizedImage`. |

**Subtotal R-27: 1 P2.**

### R-28 — Lazy loading for feature routes (P2)

✅ `org-hierarchy-page` is `loadChildren()` at `app.routes.ts:13-16`; the page-menu component is `loadComponent()` at `org-hierarchy-page.routes.ts:13-16`. **CLEAN.**

### R-29 — Composition over duplication (P2)

- `applications-table.component.html` is 270+ lines but it's mostly `<ng-template falconDataTableCell|HeaderCell|Shadow>` blocks (intentional library composition, OK).
- `user-details-page.component.html` is 316 LOC orchestrating 3 tabs inline — see R-24.

### R-30 — UI states (P2)

- `applications-table.component.html` defines `[emptyData]="emptyDataConfig()"` ✓ (empty state via Falcon data-table).
- `org-hierarchy-page-menu.component.html` `[emptyData]="usersEmptyDataConfig()"` ✓.
- `falcon-org-info-panel.component.html` lines 85-89 has explicit empty state.
- ✗ No explicit error state in `applications-table`, `org-hierarchy-page-menu`, or `user-details-page` (they assume happy-path data binding). **P2 — add error/permission-denied banners.**

### R-31 — No DOM access from Angular (P2)

| # | File | Line | Evidence | Severity | Fix |
|---|---|---|---|---|---|
| 31-A | `components/org-hierarchy-page-menu.component.ts` | 171, 180, 186, 191, 201, 205, 218, 233, 247 | 9× `document.querySelector(...)` / `document.querySelectorAll(...)` / `document.createElement('span')` to imperatively patch Stencil custom-elements | **P2** (architectural — these are Stencil-prop-forwarding workarounds; the comments admit this) | The cleanest fix is for the Falcon library to expose proper Angular inputs for all the CSS-vars currently patched. Short-term: encapsulate the DOM logic in a directive (`falconStencilPropPatch`) so the component body doesn't read `document` directly. |
| 31-B | `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.ts` | 172 | `document.querySelector('.falcon-chart-viewport')` | **P2** | Use a `viewChild('viewport', { read: ElementRef })` instead — the template already has `#viewport` template-ref (line 18). |
| 31-C | `components/tab-components/hierarchy-tab/falcon-org-chart/directives/directives.ts` | 87, 101 | `this.host.nativeElement.classList.add('panning')` / `.remove('panning')` — DOM class mutation from a directive | P2 | Acceptable in a directive — directives are the right place for DOM ops. Flag-only. |

**Subtotal R-31: 2 P2 + 1 acceptable.**

### R-32 — No `innerHTML` injection (P2)

✅ **CLEAN** — no `[innerHTML]`, no `<script>` (outside `index.html` IIFE).

### R-33 — Imports clean (P2)

- No `import * as ...` matches.
- ESLint --no-unused-imports not run (read-only audit).

### R-34 — i18n / RTL logical (P2) — covered by R-15 above.

### R-35 / R-36 — Polish + design-eng (P2)

Manual visual review required. Notes:
- `org-hierarchy-skeleton.component.ts` lacks `prefers-reduced-motion` respect — `animate-pulse` runs unconditionally. **P2.**
- `falcon-chart-toolbar` zoom buttons have hover state but no focus-visible ring distinct from hover. **P2.**

### R-37 — Page learning evidence (P2 — procedural)

No `LIGHT_LEARNING_EVENTS.md` check from static read. Flag-only as **procedural P2.**

### R-38 — Per-section compliance table (P2 — procedural)

No per-section compliance tables in commit messages or comments. Flag-only as **procedural P2.**

---

## 3. Top-10 priority fixes (ranked)

1. **Remove `apps/admin-console/src/styles.scss` + drop SCSS wiring from `project.json`** (P0 R-02-A/B/C) — the only SCSS in the entire admin-console app; deletes 1 file + 2 lines of project.json. Highest ROI.
2. **Token-rename `var(--falcon-neutral-150|400|teal-700)` → `var(--color-falcon-*)` in `falcon-org-chart.component.html`** (P0 R-17-A/B/C) — 3 grep-and-replace edits unbreak the chart's gridlines + node connectors.
3. **Replace `bg-falcon-warning-*` + `bg-falcon-success-*` + `text-falcon-danger-600` with palette names (`amber`/`green`/`red`)** (P0 R-06-A/B/C/D + R-17-D/E/F/G) — 8 line edits across `user-details-page.component.html` (4 places) + `falcon-org-info-panel.component.html` (2 places) and add `--color-falcon-amber-100`, `--color-falcon-amber-200`, `--color-falcon-red-600` to the registry.
4. **Inline `<style>` block in `otp-dialog.component.html` (lines 26-38)** — move backdrop + .otp-box-wrapper rules to canonical token entry; convert all 9 `style="..."` literal attributes to Tailwind utilities (P0 R-02-D through R-02-L). High-impact single file.
5. **Hardcoded z-index `z-[5]` in `falcon-chart-toolbar.component.html` + `z-[2]` safelist in `tailwind.css:717`** (P0 R-04-A/B) — route through the canonical overlay ladder.
6. **Migrate the 27 components from `standalone: true` to default-standalone (Angular 21)** (P1 R-09-A/B) — single grep-and-strip across all `*.component.ts` files.
7. **Replace 11 raw `<button>` + 1 raw `<input>` + 1 hand-rolled toggle switch with Falcon equivalents** (P1 R-07-A through R-07-J) — covers `org-node-drawer`, `user-details`, `client-settings`, `org-hierarchy-page-menu`, `otp-dialog`, `client-service-row-table`, `client-account-owner-step`, `falcon-chart-toolbar`.
8. **R-15 RTL: convert physical (`pl-*`/`pr-*`/`ml-*`/`mr-*`/`left-*`/`right-*`/`text-left`) to logical (`ps-*`/`pe-*`/`ms-*`/`me-*`/`start-*`/`end-*`/`text-start`) — 11 occurrences across 7 files** (P1 R-15-A through R-15-N).
9. **R-23 dead-code cleanup: delete `components/falcon-status/`** (P2 R-23-B + R-21) — the comment in `org-hierarchy-page-menu.component.ts:34-36` says it's been replaced.
10. **R-03 typography sweep: replace `text-[10px]`/`text-[11px]`/`text-[11.5px]`/`text-[12.5px]`/`text-[13px]`/`text-[13.5px]`/`text-[15px]`/`text-[18px]`/`text-[28px]`/`text-[38px]`/`text-[40px]` with the canonical Noor typography scale** — ≈80 instances across all templates.

## 4. Recommended fix sequence

| Wave | Scope | Effort | Risk | P0 cleared | P1 cleared |
|---|---|---|---|---|---|
| W1 | SCSS removal (#1) + chart token rename (#2) + Noor color rename (#3) | 1 hr | low | 14 | 0 |
| W2 | OTP dialog inline-style purge (#4) | 1.5 hr | low (visual regression check needed) | 9 | 0 |
| W3 | z-index ladder (#5) | 30 min | low | 2 | 0 |
| W4 | Falcon library migrations (#7) | 3 hr | medium (visual parity check per file) | 0 | 13 |
| W5 | standalone:true purge (#6) | 30 min (codemod) | low | 0 | 28 |
| W6 | RTL logical sweep (#8) | 1 hr | low | 0 | 11 |
| W7 | falcon-status dead-code + apps-services/comm-channels dedup (#9) | 30 min | low | 0 | 0 (P2 only) |
| W8 | Typography scale sweep (#10) | 2 hr | low | 25-30 | 0 |
| W9 | `<style>` setProperty patching (02-N/02-O) + table-edit-row spacers refactor (R-11-A) | 2 hr | high (Stencil prop-forwarding gap is the real fix) | 1 | 1 |
| W10 | Folder structure (R-10) + deep-import (R-19) + HostBinding (R-09-C) + bootstrap any (R-09-D) | 1 hr | low | 0 | 4 |

**Total estimated fix effort: ~13 hours** to bring admin-console to full P0/P1 compliance.

## 5. Architecture observations

### Noor compliance (color-naming palette-over-intent)
- **NEW code partially Noor-compliant.** Files written most recently (`falcon-status.component.ts`, `org-hierarchy-skeleton.component.ts`) use palette names — good. Files inherited from earlier waves (`user-details-page.component.html` Waves 7b/12, `falcon-org-info-panel.component.html`) still use semantic `warning`/`success`/`danger` for new code — these are **P0 hits** because the intent tokens DON'T resolve (no `--color-falcon-warning/success/danger-*` shades in the registry).
- **Forward-only carve-out:** No existing semantic tokens were flagged. Only NEW code using non-resolving semantic names was flagged.

### Page-level layout ownership
- ✓ The page (`org-hierarchy-page-menu.component.html`) owns its grid layout via `host: { class: 'flex flex-col h-full min-h-0' }` and the inner `grid-cols-[auto_1fr]`. Wrapped Falcon components do not size themselves.
- ✗ The `falcon-table-edit-row` component DOES size itself (lines 22, 24, 27, 39 hardcoded widths matching parent column widths) — this is a **page-layout-ownership violation** documented as a workaround for `<tr><td colspan>` projection. Should be a CSS-Grid layout owned by the data-table host.

### Falcon library coverage
- 15 distinct Falcon library tags in use: `<falcon-angular-button>`, `<falcon-angular-input>`, `<falcon-angular-input-number>`, `<falcon-angular-dropdown>`, `<falcon-angular-radio>`, `<falcon-angular-switch>`, `<falcon-angular-tabs>`, `<falcon-angular-data-table>`, `<falcon-angular-tag>`, `<falcon-angular-otp>`, `<falcon-angular-status-badge>`, `<falcon-angular-saudi-riyal-icon>`, `<falcon-angular-drawer>`, `<falcon-angular-alert-dialog>`, `<falcon-angular-popup>` + `<falcon-photo-uploader>`, `<falcon-form-field>`, `<falcon-stepper>`/`<falcon-step>`, `<falcon-view-toggle>`, `<falcon-node-details-section>`, `<falcon-send-credentials-popup>`, `<falcon-angular-date-picker>`, `<falcon-angular-phone-field>`, `<falcon-angular-tooltip>`, `<falcon-angular-icon>` (implied via slot), etc. **Coverage is broad.**
- Remaining raw-HTML candidates for new Falcon components: `<falcon-angular-toolbar>` (for chart toolbar — R-07-K), `<falcon-card-button>` (for chart card — R-07-M GAP), `<falcon-angular-form-row-actions>` (for the IP commit/cancel +/× inline buttons — R-07-J).

### Imperative Stencil patching
- The `effect()` in `org-hierarchy-page-menu.component.ts` (lines 162-260) patches Stencil custom-elements imperatively for: tabs panel padding, paginator rows-per-page dropdown, table header/footer bg, table container radius, header padding, body cell padding, table actions header label. **This is a major architectural debt.** Every patch is documented as a Stencil prop-forwarding workaround. The cleanest fix is library-side, not consumer-side.

### Zoneless
- App config provides `provideZonelessChangeDetection()` ✓. No `Zone.*` or `NgZone` references. Wave Step 3 from memory completed.

### Wave culture
- 21 references to `Wave NN` and `Round N (date)` in comments. This pattern documents intent but bloats files. Future: route per-page learnings into `Brain Outputs/understanding/pages/organization-hierarchy/` instead of inline.

## 6. Risk register

| Risk | Mitigation |
|---|---|
| Removing `styles.scss` may break `.contracts-page` styling on legacy pages not in admin-console | Verify no live consumers of `.contracts-page` class in the page being audited (org-hierarchy doesn't use it). Migrate the 2 rules to canonical theme entry before deleting. |
| Token-renaming `var(--falcon-neutral-150)` → `var(--color-falcon-neutral-150)` may regress visuals if the original was intended to be a different token (`--falcon-neutral-150` was once a primitive but renamed) | Manual visual diff in the chart viewport before/after. |
| Migrating raw `<button>`s to `<falcon-angular-button>` may change pixel-level dimensions | Compare against the Brain SK org-hierarchy playbook reference visuals. |
| The 27 `standalone: true` removals are mechanical but risk if any component has unconventional setup | Codemod + `nx build admin-console` smoke test. |
| OTP dialog refactor (most concentrated cleanup) may regress the native `<dialog>` top-layer behavior | The native `<dialog>` element + `showModal()` is the source of truth — keep that, only replace inline styles with utilities. |
| Imperative Stencil patching in `org-hierarchy-page-menu.component.ts` is a load-bearing workaround for library gaps. Removing it without library fixes would break the page visuals. | Library-side fix MUST land first (Falcon UI Core wave) before consumer-side `effect()` can be deleted. Flag as a multi-wave plan. |
| `bg-emerald`/`bg-amber`/`bg-rose`/`bg-slate` in `org-hierarchy-skeleton.component.ts` are vanilla Tailwind palette colors not Falcon-namespaced. If they're inside the skeleton view ONLY for placeholder loading and never visible to a non-loading user, the visual regression risk is low — but the rule violation is real. | Migrate to Falcon-namespaced; add the alpha-variants (`/40`, `/70`) needed for skeleton placeholder shade if they don't already exist in the token tree. |
