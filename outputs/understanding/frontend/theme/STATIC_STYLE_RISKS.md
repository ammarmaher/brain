*** Static style risks — inline styles, hardcoded hex, hardcoded px, divergences ***
*** Verified against active source at 2026-05-13 ***

# Static style risks

The hardened rule (`feedback_no_inline_styles_tokens_only.md`, 2026-05-05) requires: zero inline styles; tokens only for colours, borders, radii, shadows, spacing, fonts. This audit catalogs every active violation in the source tree.

---

## 1. Raw `style="..."` attribute in template HTML

Search: `style\s*=\s*["']` in `apps/**/*.html`.

| FILE | LINE | CONTEXT |
|---|---|---|
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/applications-table/applications-table.component.html` | 43 | `<svg ... style="vertical-align: -2px;">` |

**Total**: 1 occurrence.
**Verdict**: Minor — inside `<svg>` decorative icon. Likely OK but worth replacing with a Tailwind class `align-[-2px]` or moving to the SVG `<g transform="translate(0, -2)">`.

---

## 2. Angular `[style.X]=` binding

Search: `\[style\.` in `apps/**/*.html`.

| FILE | LINES | BINDINGS USED |
|---|---|---|
| `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` | 38-39 | `[style.transform]`, `[style.transition]` — sidebar chevron rotation |
| `apps/host-shell/src/app/features/dashboard/dashboard.component.html` | 33, 121, 147 | `[style.height.%]` × 3 — bar charts / usage gauges (dynamic from data) |
| `apps/management-console/src/app/features/organization-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 31-33, 65-68, 78-80, etc. | `[style.transform]`, `[style.width.px]`, `[style.height.px]`, `[style.left.px]`, `[style.top.px]` — dynamic SVG/HTML positioning for org-chart |
| `apps/management-console/src/app/features/organization-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | (multiple) | Same pattern — org-chart card positioning |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | (multiple) | Mirrored from management-console |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | (multiple) | Same |

**Total**: 6 files, ~30+ binding instances.

### Verdict per file

- **Org-chart components (4 files)** — UNAVOIDABLE. Dynamic SVG positioning needs runtime pixel coordinates. Token discipline does not apply to programmatically-positioned shapes.
- **Sidebar chevron (1 file)** — REPLACEABLE. Could use `[class.rotate-180]="collapsed()"` instead of `[style.transform]="collapsed() ? 'rotate(180deg)' : ...'`. host-shell tailwind.css already safelists `rotate-180` for this purpose. **Recommend fix.**
- **Dashboard bars/gauges (1 file)** — PARTIALLY REPLACEABLE. Dynamic data drives heights/widths. Could mutate a CSS custom property on the host class instead: `[style.--bar-height.%]="getBarHeight()"` then `height: var(--bar-height)`. Or accept as required dynamism.

**Recommended action**: Codify org-chart and dashboard-bar as explicit exemptions via an ESLint rule + allowlist. Fix sidebar chevron. See UPGRADE_CANDIDATES UP-14.

---

## 3. Hardcoded hex inside template HTML

Search: `#[0-9a-fA-F]{6}` in `apps/**/*.html`.

**Total occurrences**: 38 across 15 files.

### File-by-file

| FILE | OCCURRENCES | CONTEXT |
|---|---|---|
| `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | 6 | `<rect fill="#cfd8dc">`, `<circle fill="#8a9ea7">`, `<path fill="#8a9ea7">` × 2 (avatar placeholder SVG, twice) |
| `apps/admin-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html` | 13 | Likely brand SVG fills |
| `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html` | 1 | SVG illustration |
| `apps/management-console/src/app/features/organization-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 2 | SVG line / fill |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/settings-tab/settings-tab.component.html` | 1 | SVG icon |
| `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` | 2 | SVG icons |
| `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` | 1 | SVG icon |
| `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html` | 2 | SVG decoration |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-view-toggle/falcon-org-view-toggle.component.html` | 1 | SVG icon |
| `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 1 | SVG row marker |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 1 | SVG |
| `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` | 2 | SVG decoration |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 2 | SVG link colors |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 2 | SVG icons |
| `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-kanban/falcon-org-user-card/falcon-org-user-card.component.html` | 1 | SVG |

### Verdict by category

- **Avatar placeholder SVGs (topbar.component.html)** — `#cfd8dc` (light gray) + `#8a9ea7` (medium gray) are decorative neutrals. Could swap to `currentColor` + Tailwind `text-falcon-neutral-300` / `text-falcon-neutral-500` on the parent. **Recommend fix.**
- **Brand SVG icons (multiple wizards / settings / view-toggle)** — Several may be using brand teal hex. Need spot-check; replace with `currentColor` + `text-falcon-teal-500` on parent.
- **Org-chart link colors** — Likely use `--color-falcon-orgchart-line` token already; verify hex matches.

**Recommended action**: Case-by-case audit. See UPGRADE_CANDIDATES UP-17.

---

## 4. Hardcoded values inside Stencil component `style={{ }}` JSX

Search: `style=\{` in `libs/falcon-ui-core/src/components/**/*.tsx`.

**Total**: 18 files, 57 occurrences.

| FILE | OCCURRENCES | CONTEXT |
|---|---|---|
| `falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree-tw.tsx` | 28 | Tree-node dynamic positioning (rail offsets, indent depths, sticky right edge) |
| `falcon-stepper-tw/falcon-stepper-tw.tsx` | 5 | Step dot dynamic transforms (rotation, scale per Studio knobs) |
| `falcon-table/falcon-table.tsx` | 3 | Sticky column offsets, scrollHeight |
| `falcon-table-tw/falcon-table-tw.tsx` | 3 | Same |
| `falcon-stepper/falcon-stepper.tsx` | 3 | Stepper internal |
| `falcon-dialog-tw/falcon-dialog-tw.tsx` | 2 | Anchor position |
| `falcon-tooltip-tw/falcon-tooltip-tw.tsx` | 2 | Floating-UI anchor |
| `falcon-tabs/falcon-tabs.tsx` | 1 | Sliding indicator transform |
| `falcon-tabs-tw/falcon-tabs-tw.tsx` | 1 | Sliding indicator transform |
| `falcon-tooltip/falcon-tooltip.tsx` | 1 | Anchor position |
| `falcon-drawer-tw/falcon-drawer-tw.tsx` | 1 | Drawer slide-in transform |
| `falcon-menu-tw/falcon-menu-tw.tsx` | 1 | Anchor offset |
| `falcon-single-uploader/falcon-single-uploader.tsx` | 1 | Tile thumbnail image |
| `falcon-single-uploader-tw/falcon-single-uploader-tw.tsx` | 1 | Same |
| `falcon-tree-table/falcon-tree-table.tsx` | 1 | Indent depth |
| `falcon-tree-table-tw/falcon-tree-table-tw.tsx` | 1 | Same |
| `falcon-uploader/falcon-uploader.tsx` | 1 | Progress width |
| `falcon-uploader-tw/falcon-uploader-tw.tsx` | 1 | Progress width |

### Verdict

All 57 occurrences are dynamic geometry (transforms, offsets, computed widths/heights, position anchors). These are unavoidable at the component-internal level — Stencil components implement the floating-UI positioning, the sliding tab indicator math, the dynamic progress bar, the tree-rail SVG offsets, etc. Token discipline does not target this — these are RUNTIME-driven values that must be inline.

**Verdict**: Accept as-is. Pattern is "use `style=` only for runtime-computed geometric values; never for design properties (color, font, radius, shadow, etc.)". Spot-check confirmed: no design-property hardcoded values in these `style=` blocks.

---

## 5. SCSS rule violations in `apps/*/src/app/features/`

Search: `*.component.scss` in `apps/**/*.scss` with > 2 meaningful (non-comment, non-blank) lines.

**Total violators**: 20 files (out of 36 total SCSS files).

| FILE | MEANINGFUL LOC | NOTES |
|---|---|---|
| `apps/host-shell/.../forgot-password-flow.component.scss` | 496 | Multi-step login styles, OTP geometry |
| `apps/host-shell/.../dashboard.component.scss` | 443 | Bar charts, usage gauges, KPI cards |
| `apps/host-shell/.../enter-otp.component.scss` | 309 | OTP input styling |
| `apps/host-shell/.../login-layout.component.scss` | 291 | Login chrome |
| `apps/host-shell/.../get-started.component.scss` | 207 | Onboarding cards |
| `apps/host-shell/.../change-password.component.scss` | 207 | Form styling |
| `apps/admin-console/.../organization-hierarchy-menu.component.scss` | 217 | Tab list, view-toggle |
| `apps/admin-console/.../applications-table.component.scss` | 183 | Table chrome |
| `apps/admin-console/.../client-settings-step.component.scss` | 117 | Wizard step internal |
| `apps/admin-console/.../falcon-org-chart/falcon-org-chart.component.scss` | 131 | Org-chart canvas |
| `apps/admin-console/.../add-user-wizard.component.scss` | 54 | Wizard shell |
| `apps/admin-console/.../add-client-wizard.component.scss` | 54 | Wizard shell |
| `apps/host-shell/src/app/layout/layout.component.scss` | 44 | Shell layout |
| `apps/admin-console/.../client-service-row-table.component.scss` | 45 | Row table |
| `apps/admin-console/.../falcon-chart-card.component.scss` | 36 | Org-chart card |
| `apps/host-shell/src/styles.scss` | 19 | **GLOBAL — Poppins font override with !important** |
| `apps/admin-console/.../falcon-org-user-card.component.scss` | 31 | Kanban user card |
| `apps/host-shell/.../not-found.component.scss` | 30 | 404 page |
| `apps/admin-console/src/styles.scss` | 19 | Global — minor reset rules |
| `apps/admin-console/.../falcon-org-kanban.component.scss` | 8 | Kanban shell |

### Verdict

Every one of these files is a forward-only rule violation. The hardened rule (`feedback_v02_theme_adopted.md`): **"Tailwind utilities on templates only — no SCSS, no component CSS, no PrimeNG."**

**Recommended action**: Per UPGRADE_CANDIDATES UP-03, add a gate that pins existing files to current line counts (grandfathered) and blocks ANY new SCSS rules. Migrate by feature wave.

### Worst offender — `host-shell/src/styles.scss:10-21`

```scss
:root {
  --font-sans: 'Poppins', 'Inter', system-ui, sans-serif;
}
[dir="rtl"], html[dir="rtl"] {
  --font-sans: 'IBM Plex Sans Arabic', 'Poppins', sans-serif;
}
html, body, app-root {
  font-family: 'Poppins', 'Inter', system-ui, sans-serif !important;;  /* TWO semicolons */
}
[dir="rtl"], [dir="rtl"] body {
  font-family: 'Poppins', 'Inter', system-ui, sans-serif !important;
}
button, input, select, textarea {
  font-family: inherit !important;
}
```

**Two distinct problems**:
1. **Brand-font conflict** — SSOT declares `--font-sans: var(--font-sans-latin)` which resolves to `"Neue Haas Grotesk Display Pro"`. host-shell's `styles.scss` rebinds `--font-sans` to Poppins-first. The SSOT is the canonical brand-font source per `feedback_v02_theme_adopted.md`. Pick one truth. **UP-10.**
2. **`!important` everywhere** — used to defeat... something (originally PrimeNG's user-agent font reset; that need is gone post-PrimeNG removal). The override is no longer load-bearing and adds specificity weight that future code has to fight.

---

## 6. Divergences between Shadow + Light (Stencil)

I sampled a few component pairs and verified the helpers (`*-tailwind-classes.ts`) mirror the shadow CSS. No obvious divergences observed in input/button/dropdown/checkbox. The known divergence per `FALCON_COMPONENT_REGISTRY.md`:

- **`falcon-organization-hierarchy-tree-tw`** — Light DOM only, no Shadow companion. Documented + intentional (Wave-X promotion candidate).

No other divergences observed in the spot-check. A full audit would require diffing every `.css` shadow stylesheet vs the matching `*-tailwind-classes.ts` helper output — out of Agent 5's scope (Agent 1-4 component agents own the per-component dive).

---

## 7. Token bypass risks

Tokens that have hardcoded values inside the component-token file (instead of pointing at SSOT primitives):

| FILE | LINE | TOKEN | HARDCODED VALUE | RECOMMENDED |
|---|---|---|---|---|
| `organization-hierarchy.tokens.css` | 36 | `--falcon-org-hierarchy-panel-border-radius` | `14px` | accept (per spec) |
| `organization-hierarchy.tokens.css` | 50 | `--falcon-org-hierarchy-root-padding-y` | `14px` | accept (per spec) |
| `organization-hierarchy.tokens.css` | 51 | `--falcon-org-hierarchy-root-padding-x` | `16px` | accept (per spec) |
| `organization-hierarchy.tokens.css` | 70 | `--falcon-org-hierarchy-root-name-max-width` | `220px` | accept |
| `organization-hierarchy.tokens.css` | 124 | `--falcon-org-hierarchy-menu-btn-shadow` | hardcoded `rgba(13, 63, 68, 0.08)` | UP-06 — use `var(--color-falcon-teal-alpha-08)` |
| `organization-hierarchy.tokens.css` | 138 | `--falcon-org-hierarchy-ctx-menu-border-radius` | `10px` | accept |
| `organization-hierarchy.tokens.css` | 142-143 | `--falcon-org-hierarchy-ctx-menu-shadow` | hardcoded `rgba(0, 0, 0, 0.12)` + nested `var(--color-falcon-neutral-200)` | accept hardcoded shadow alpha (no SSOT 12-alpha); the neutral ref is fine |
| `organization-hierarchy.tokens.css` | 144 | `--falcon-org-hierarchy-ctx-menu-z-index` | `9999` | should use `var(--z-falcon-popover)` (`1060`) — DRIFT vs Z-INDEX scale |
| `dialog.tokens.css` | 42 | `--falcon-dialog-panel-border-radius` | `18px` | accept (per spec) |
| `dialog.tokens.css` | 43 | `--falcon-dialog-panel-shadow` | hardcoded `rgba(0, 0, 0, 0.18)` | accept (no SSOT match) |
| `button.tokens.css` | 77 | `--falcon-button-border-radius` | `10px` | accept (per spec — reference V0.2) |
| `button.tokens.css` | 163-170 | focus shadows | hardcoded `rgba(13, 63, 68, 0.18)`, `rgba(220, 38, 38, 0.22)` | UP-06 — use `var(--color-falcon-teal-alpha-12)` or `--shadow-falcon-focus`/`--shadow-falcon-danger-focus` |

**General pattern**: Geometry hardcoding (px values for radii/sizes/insets that match the design reference) is acceptable. Color/alpha hardcoding that has an SSOT equivalent is a UP-06 candidate.

---

## Top 3 risks (ranked)

1. **SCSS rule violations in feature components** (20+ files, 3000+ lines) — biggest violation surface. Forward drift accelerates without UP-03 gate.
2. **`apps/host-shell/src/styles.scss` `--font-sans` override** — conflicts with SSOT; uses `!important`; documents no intent; ships brand-font inconsistency.
3. **Tailwind utility safelist drift between host-shell + admin-console + management-console** — host-shell 2113 / admin 2050 / mgmt 0. Mgmt is exposed to silent drops on dynamic class strings; host vs admin diverge silently. UP-05 + UP-13.

---

## Cross-references

- See `NO_CSS_NO_SCSS_COMPLIANCE.md` for the SCSS/CSS rule-violation deep-dive.
- See `UPGRADE_CANDIDATES.md` for fix-it backlog (UP-03, UP-05, UP-06, UP-10, UP-13, UP-14, UP-17).
- See `UTILITY_SAFELIST_AUDIT.md` for safelist drift details.
