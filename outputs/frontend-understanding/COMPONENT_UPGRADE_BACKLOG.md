# Falcon Component Upgrade Backlog — Master List

*** Brain SK canonical — Agent 7 merge, 2026-05-13 ***
*** Aggregates all UPGRADE_CANDIDATES.md from Agents 1-6 ***
*** Priority order: P0 (blocks correct usage) → P1 (frequent need) → P2 (improvement) → P3 (polish) ***

## P0 — Blocks correct usage / data integrity / a11y compliance

| ID | Title | Scope | Motivation | Risk | Source |
|---|---|---|---|---|---|
| **P0-01** | Focus trap on `<falcon-angular-popup>` | popup | Popup re-implements modal scaffold but lacks focus trap — verified WCAG violation. Compose `<falcon-angular-dialog>` to inherit focus trap + focus restore. | Moderate (visual diff) | Agent 3 / UP-3-02 |
| **P0-02** | Migrate org-hierarchy wizards from legacy `<falcon-stepper>` to `<falcon-angular-wizard>` | 4 wizards (admin + management × add-client + add-user) | Stencil stepper + wizard are production-ready but every wizard still uses pre-Stencil bespoke `<falcon-stepper>` + `FalconStepDirective` + `FalconStepperFooterDirective`. Single largest migration backlog item. Unlocks Studio-token customisation. | HIGH (revenue-bearing flows) | Agent 4 / UC-W02, Agent 6 / item 1 |
| **P0-03** | Replace `pi pi-ellipsis-v` in Stencil `<falcon-table>` row-action button | falcon-table | Wave PR-8 explicitly bans `pi pi-*` classes. `falcon-table.tsx:655` still uses PrimeIcon. Single source edit. | Low | Agent 2 / UC-P0-01 |
| **P0-04** | Replace PrimeIcons residuals in uploader Stencil components | falcon-uploader, falcon-single-uploader | `<i class="pi pi-cloud-upload">` at `falcon-uploader.tsx:319,361` and `falcon-single-uploader.tsx:235,313`. ESLint flat-block doesn't catch Stencil `.tsx`. | Low | Agent 4 / UC-W04 |
| **P0-05** | Keyboard activation for sortable column headers in `<falcon-table>` | falcon-table | Sortable headers respond to click only. WCAG requires keyboard activation. Add `tabindex=0` + `keydown.enter/space`. | Low | Agent 2 / UC-P0-02 |
| **P0-06** | Per-row template / per-row action slot on `<falcon-angular-tree>` | falcon-tree | Blocks tree-panel convergence. Current parallel implementation risks visual drift. | Medium | Agent 4 / UC-W01 |
| **P0-07** | Replace `falconTabActions` MutationObserver lift with real `<slot name="header-end">` | falcon-tabs | MutationObserver is fragile to orientation switches and overflow:hidden parents. Largest fragility in Agent 3 scope. | Moderate | Agent 3 / UP-3-01 |
| **P0-08** | Reconcile component-token fallback hex vs SSOT primitive value | button, input, dropdown, multi-select, phone-field, email-field, combobox tokens | `--falcon-button-primary-bg: var(--color-falcon-teal-500, #0d3f44)` — teal-500 is `#124c52`, fallback is teal-700. Three confirmed drifts. SSOT-less consumers would ship wrong colour. | Low | Agent 5 / UP-01 |
| **P0-09** | Reconcile `tailwind.config.js` `important: true` doc claim | TAILWIND_TOKEN_MAP.md + falcon-tailwind-tokens.css comment | Doc says `important: true` on. Live config is `module.exports = {}` — explicitly removed because it broke `<falcon-tabs-tw>` slider. Future agents read stale docs and build wrong assumptions. | Zero (docs only) | Agent 5 / UP-02 |
| **P0-10** | Codify no-SCSS rule in a gate | apps/*/src/app/features/**/*.component.scss | 20+ feature SCSS files have real rules (forgot-password 496 LOC, dashboard 443 LOC, etc.). Every line violates the standing rule. Without a gate, drift continues each wave. | Medium | Agent 5 / UP-03 |
| **P0-11** | Refactor `FalconFormValidateDirective` — drop PrimeNG selectors + inline styles + console.log | shared-directives | Targets `.p-dropdown` etc. (no longer exist); inline styles violate the no-inline-styles hardened rule; debug `console.log` in production. | Medium | Agent 4 / UC-D01 |
| **P0-12** | Visualize `step.status` in `<falcon-angular-wizard>` via embedded stepper | falcon-wizard | Stepper has per-step error state but wizard doesn't drive it from `stepControls`. | Low | Agent 4 / UC-Z01 |
| **P0-13** | Built-in native validation on `<falcon-angular-uploader>` (`enableNativeValidation` Input) | falcon-uploader | Validation deferred today; every consumer reimplements size/mime/count checks. | Low | Agent 4 / UC-U01 |

## P1 — Frequent need / high-leverage reusable upgrades

| ID | Title | Scope | Motivation | Risk | Source |
|---|---|---|---|---|---|
| **P1-01** | Universal `FalconOptionTemplateDirective` pattern | dropdown, multi-select, combobox, checkbox-group, radio-group, phone-field country list, otp | Single biggest reusability win across 6+ components. Only `<falcon-angular-data-table>` exposes Strategy E today; others render flat label-only options. | Medium (Stencil slot vs ng-template bridge) | Agent 1 / U1, Agent 6 / item 9 |
| **P1-02** | Compose `<falcon-angular-dialog>` inside `<falcon-angular-popup>` (P0 focus-trap fix + tokens) | popup | Inherits focus trap + focus restore + ARIA wiring. Removes popup's hand-rolled scaffold. Composes with token file UP-3-10. | Moderate | Agent 3 / UP-3-02 |
| **P1-03** | Method-proxy harmonization on Angular wrappers (`setFocus()` / `clear()` / `openPanel()` / `closePanel()`) | input, dropdown, multi-select, combobox, textarea, password, input-number, email-field, phone-field, calendar, date-picker, otp, search-input, grid-input | Consumers today reach into `nativeElement` to call Stencil methods. Inconsistent. | Low | Agent 1 / U3 |
| **P1-04** | CVA backfill for calendar + date-picker + search-input + grid-input | calendar, date-picker, search-input, grid-input | All four lack CVA. Date-picker is the most painful — Reactive Forms friction at every use site. | Low (DP, SI, GI) / Medium (calendar) | Agent 1 / U4 |
| **P1-05** | `verified` / `verifying` state visuals on email-field + phone-field | email-field, phone-field | Both emit `falcon-verify` but no built-in success visual. Consumers compose sibling spinners + checkmarks externally. | Low | Agent 1 / U5 |
| **P1-06** | Resend cooldown + code-expired state on OTP send dialog | otp-send-dialog | Every OTP flow needs 30-60s cooldown. Consumers wire externally today. | Low | Agent 1 / U6 |
| **P1-07** | Pluggable strength estimator + meter labels on `<falcon-angular-password>` | password | Built-in heuristic is naive; zxcvbn is the standard. | Low | Agent 1 / U7 |
| **P1-08** | Async `loadOptions(query)` hook on dropdown + multi-select + combobox | dropdown, multi-select, combobox | Currently consumers manage observable + re-feed `options` input. Verbose. | Medium | Agent 1 / U8 |
| **P1-09** | Migrate `<falcon-mobile-number>` consumers to `<falcon-angular-phone-field>` | 5 files: forgot-password, add-client / add-user × admin / management | Stencil phone-field is ready. Delete legacy bespoke. | Low | Agent 4 / UC-L01, Agent 6 / item 2 |
| **P1-10** | Migrate `<falcon-photo-uploader>` consumers to `<falcon-angular-single-uploader>` with circular mask | 6 wizard step files | Stencil single-uploader is ready. `previewMode='thumbnail'` + token override `--falcon-single-uploader-tile-radius: 50%`. | Low | Agent 4 / UC-L04, Agent 6 / item 3 |
| **P1-11** | Strategy E projection for `<falcon-angular-tree-table>` | tree-table | Tree-table requires per-row Stencil slots (`O(rows × cols)` markup). Strategy E mirrors `<falcon-angular-data-table>`. | Medium | Agent 2 / UC-P1-01 |
| **P1-12** | `(multiSortChange)` output on `<falcon-angular-data-table>` | data-table | Stencil core emits `falcon-multi-sort` but wrapper only forwards single-mode `(sortChange)`. Multi-sort mode non-functional from consumer view. | Low | Agent 2 / UC-P1-02 |
| **P1-13** | `<falcon-angular-paginator>` PR-3 API parity (6 missing inputs + rowsChange output) | paginator | Stencil core has `totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport` — wrapper exposes none. Standalone Angular consumers can't drive rows-per-page. | Low | Agent 2 / UC-P1-03 |
| **P1-14** | Grid keyboard navigation on `<falcon-table>` rows (Arrow / Home / End / PageUp / PageDown) | falcon-table | `role="grid"` implies WAI-ARIA grid keyboard pattern. Today only TAB walks rows. | Medium | Agent 2 / UC-P1-04 |
| **P1-15** | `<falcon-organization-hierarchy-tree>` Shadow companion + Angular wrapper | organization-hierarchy-tree-tw | Only Falcon component shipped Light-DOM only + no Angular wrapper. Production adoption blocked. | Medium | Agent 2 / UC-P1-05 |
| **P1-16** | Specs for Strategy E orchestrator + Stencil table/paginator utils | data-table, table, paginator, tree-table | Zero spec coverage on a critical projection path + pure-function utilities. | Low (test-only) | Agent 2 / UC-P1-06, UC-P1-07 |
| **P1-17** | `<falcon-angular-filter-panel>` Falcon-atom migration + custom field type | filter-panel | Native `<input>` / `<select>` / `<input type=date>` visually inconsistent with Falcon atoms. | Medium | Agent 2 / UC-P1-08 |
| **P1-18** | Refactor admin / management consoles to compose `<falcon-angular-status-badge>` instead of inline Tailwind chips | admin-console + management-console org-hierarchy menu | Admin-console inlines `bg-falcon-{color}-50 text-falcon-{color}-700` for status chips. Same in management-console. Divergent palette risk. | Low | Agent 2 / UC-P1-09 |
| **P1-19** | Implement `appendTo="body"` portal mode on `<falcon-angular-menu>` | menu | Type allows `'host' | 'body'` but only `'host'` works. Menus inside `overflow:hidden` containers get clipped. Common shipping bug. | Low | Agent 3 / UP-3-03 |
| **P1-20** | `interactive` / `selected` / `(falconClick)` on `<falcon-angular-card>` | card | Registry mislabels these as supported. Selectable card patterns (billing plan tiles, dashboard widget selection) currently hand-rolled. | Low | Agent 3 / UP-3-04 |
| **P1-21** | Polymorphic `href` / `target` / `rel` on `<falcon-angular-button>` (renders `<a>`) | button | Every "navigate to detail" button hand-rolled with `(falconClick)="router.navigate(...)"`. Loses right-click → Open in new tab. | Low | Agent 3 / UP-3-05 |
| **P1-22** | Expose `closeAriaLabel` in drawer + dialog Angular wrappers | drawer, dialog | Stencil source accepts the prop but wrappers don't bridge it. × button label stuck as "Close" — not translated. | Trivial | Agent 3 / UP-3-06 |
| **P1-23** | Add `@deprecated` JSDoc to `<falcon-angular-dialog>` + `<falcon-angular-toast>` | dialog, toast | Documented-deprecated but lack `@deprecated` in source — TypeScript LSP doesn't show strikethrough, ESLint can't flag direct usage. | None | Agent 3 / UP-3-07 |
| **P1-24** | Migrate item icons from CSS class strings to `<falcon-angular-icon>` composition | menu, tabs, accordion, confirm-dialog, popup, notification, avatar | Today these accept icon info as CSS class string (`icon: 'falcon-icon falcon-icon-pencil'`) — bypasses the icon abstraction layer, blocks future Iconify fallback. | Moderate | Agent 3 / UP-3-08 |
| **P1-25** | Collision-aware flip placement on `<falcon-angular-tooltip>` | tooltip | When requested placement overflows viewport, tooltip is invisible offscreen. Modern UI libs implement auto-flip. | Moderate | Agent 3 / UP-3-09 |
| **P1-26** | Introduce token files for `<falcon-angular-popup>` and `<falcon-angular-notification>` | popup, notification | Only Falcon UI components WITHOUT a dedicated `*.tokens.css`. All visual values inline. Per-instance customisation impossible. | Moderate | Agent 3 / UP-3-10 |
| **P1-27** | Add `loading` / `confirmDisabled` to `<falcon-angular-popup>` | popup | Async confirm flows have no built-in spinner / button-disable. | Low | Agent 3 / UP-3-11 |
| **P1-28** | Hover-pause auto-dismiss on `<falcon-angular-notification>` | notification | Toast has hover-pause; notification doesn't. Users hovering get dismissed mid-read. | Low | Agent 3 / UP-3-12 |
| **P1-29** | Image-load-error fallback on `<falcon-angular-avatar>` (initials → icon) | avatar | When `src` 404s, broken image graphic shows. No automatic fallback. | Low | Agent 3 / UP-3-13 |
| **P1-30** | Companion `<falcon-angular-avatar-group>` with overflow pill | new (avatar-group) | "Members: [a1] [a2] [a3] +5 more" — every consumer hand-rolls overlap + pill. | Low | Agent 3 / UP-3-14 |
| **P1-31** | Per-tab header slot for `<falcon-angular-accordion>` (`<slot name="header-{value}">`) | accordion | No way to put status badges / action buttons in accordion item header beyond `description` prop. | Low | Agent 3 / UP-3-15 |
| **P1-32** | `single-locked` accordion mode | accordion | `mode="single"` allows collapse-to-zero. For always-1-open UX, no built-in option. | Low | Agent 3 / UP-3-16 |
| **P1-33** | `<falcon-angular-button>` composition in `<falcon-angular-confirm-dialog>` footer | confirm-dialog | Internal raw `<button>` bypasses design-system primitive — no loading state, no shared tokens. | Low | Agent 3 / UP-3-17 |
| **P1-34** | `maxStack` cap on `FalconMessageService` | message-host | No upper bound. Flaky API firing 100 error toasts overwhelms viewport. | Low | Agent 3 / UP-3-18 |
| **P1-35** | Spin / pulse animation props on `<falcon-angular-icon>` | icon | Common need for inline loading indicators. Today consumers add `class="animate-spin"`. | Low | Agent 3 / UP-3-20 |
| **P1-36** | Unified icon API: auto-route between Falcon font and Iconify | icon | Two icon sources today; consumers pick whichever is convenient. Auto-detect by `:` prefix (`solar:pencil` → Iconify). | Moderate | Agent 3 / UP-3-21 |
| **P1-37** | Promote intent palette into the SSOT `@theme` block (`--color-falcon-{primary,danger,success,warning,info}`) | falcon-tailwind-tokens.css | Today `--falcon-color-primary` lives ONLY in `semantic/semantic.css` — invisible to Tailwind utilities. Templates can't say `bg-falcon-primary`. | Low | Agent 5 / UP-04 |
| **P1-38** | Auto-generate `@source inline(...)` safelist from `*-tailwind-classes.ts` helpers | apps/*/src/tailwind.css | host-shell has 2113 safelist lines, admin-console 2050 (drifted), mgmt-console 0. Hand-curated drift. | Medium | Agent 5 / UP-05 |
| **P1-39** | Move 178 dark-mode bypass overrides back into SSOT alpha chain | components/*.tokens.css | `themes/dark.css` has per-component overrides because base tokens use literal `rgba(13, 63, 68, X)` instead of `var(--color-falcon-teal-alpha-*)`. Collapsing into SSOT shrinks dark.css to 12 lines. | Medium | Agent 5 / UP-06 |
| **P1-40** | Per-component token-file linter | components/*.tokens.css | Each file must (a) start with `:where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X])`; (b) declare only `--falcon-<component>-*` tokens; (c) match SSOT primitive fallbacks. Gate catches drift uniformly. | Low | Agent 5 / UP-07 |
| **P1-41** | Sweep arbitrary Tailwind hex/px to Falcon tokens (extend gate-08 to apps) | apps/**/*.html + Tailwind class strings | 50+ instances of `bg-[#f5f6f7]`, `border-[#eef0f2]`, `rounded-[14px]` in feature templates. Worst: admin-console org-hierarchy-page-menu. | Medium | Agent 6 / item 4 |
| **P1-42** | Migrate every wizard host from legacy `<falcon-stepper>` to `<falcon-angular-stepper>` | 4 wizards | Highest-impact win — eliminates last bespoke Angular stepper, unlocks Studio-customisable visuals. (Duplicate of P0-02 framing — Agent 6 puts it as architecture P1.) | Medium | Agent 6 / item 1 |
| **P1-43** | Add slot-friendly `<falcon-angular-popup variant="custom">` | popup | Unblocks deletion of `send-credentials-popup` bespoke. Future-proofs OTP / confirm / save / unsaved flows needing rich body. | Low | Agent 4 / UC-W03 |
| **P1-44** | Wrapper `[ariaLabel]` parity sweep (status-badge, badge, empty-state, tag) | data + display family | Stencil cores expose `ariaLabel` but Angular wrappers don't surface it consistently. | Low | Agent 2 / UC-P2-05 |
| **P1-45** | Skip button for optional wizard steps | wizard | No way to mark a step optional + emit skip event. | Low | Agent 4 / UC-Z02 |
| **P1-46** | Per-step `slot="header-{index}"` on wizard | wizard | Custom header content per step. | Low | Agent 4 / UC-Z03 |
| **P1-47** | Async-validator awaiting in wizard's `stepControls` bridge | wizard | Today pure-sync `ctrl.valid` reading misses `PENDING` state. Breaks `FalconCheckExistsDirective` flows. | Medium | Agent 4 / UC-Z06 |
| **P1-48** | Tree virtualization + lazy children loader + drag-and-drop + multi-mode select | tree | Tree component series (UC-T02 / T03 / T04 / T05). | Medium | Agent 4 / UC-T02-T05 |
| **P1-49** | Tree-panel action `disabled?: (node) => boolean` + `variant` + keyboard activation | tree-panel | Common production needs not exposed. | Low | Agent 4 / UC-TP01-TP03 |
| **P1-50** | Auto-link `aria-describedby` + set `aria-invalid="true"` in `FalconFormValidateDirective` | shared-directives | A11y wiring after the UC-D01 refactor. | Low | Agent 4 / UC-D06 |
| **P1-51** | Promote `<falcon-form-field>` to Falcon UI core (`<falcon-angular-form-field>`) | new component | 80+ call sites in wizards. Get a token contract + auto-link label-for-control + tooltip slot. | Medium | Agent 4 / UC-W05 |
| **P1-52** | Form-control `errorMessage` everywhere (errorText alias + soft-deprecate) | dropdown, multi-select, combobox, checkbox, checkbox-group, radio, radio-group, switch | 8 wrappers use `errorMessage`, 8 use `errorText`. Mixing them is a daily papercut. | Low | Agent 1 / U2 |
| **P1-53** | Phone-field built-in validator + virtualized country dropdown | phone-field | Validation consumer-only; ~250-country list renders eagerly. | Medium | Agent 1 / U12 |

## P2 — Improvement / scaling polish

| ID | Title | Scope | Motivation | Risk | Source |
|---|---|---|---|---|---|
| **P2-01** | Typed cell column types (`'status'` / `'tag'` / `'avatar'`) on `<falcon-table>` + `<falcon-tree-table>` | table, data-table, tree-table | Removes per-page `<ng-template>` boilerplate for common cell shapes. | Medium | Agent 2 / UC-P2-01 |
| **P2-02** | Default `<falcon-empty-state>` composition inside table empty cell | table, data-table, empty-state | Built-in shorthand removes per-table `<ng-template falconDataTableEmpty>` boilerplate. | Low | Agent 2 / UC-P2-02 |
| **P2-03** | `<falcon-angular-data-table>` `[density]` input | data-table | Stencil core supports `density` — wrapper doesn't expose it. | Low | Agent 2 / UC-P2-03 |
| **P2-04** | Implement or remove `[reorderableColumns]` / `[resizableColumns]` placeholders | data-table | Inputs exist but do nothing. API surface confusion. | High (if implementing) | Agent 2 / UC-P2-04 |
| **P2-05** | Multi-select for `<falcon-angular-tree-table>` | tree-table | Today only `'none'` and `'radio'` modes — no bulk actions on tree data. | Medium | Agent 2 / UC-P2-06 |
| **P2-06** | Frozen + sticky-actions precedence documentation | table | Both compete for inline-end position. Document or implement explicit precedence. | Low | Agent 2 / UC-P2-07 |
| **P2-07** | Brand registry tokens for `<falcon-organization-hierarchy-tree>` | organization-hierarchy-tree-tw | Brand bubble styling uses `client-logo bank-{x}` CSS classes — should be typed registry. | Medium | Agent 2 / UC-P2-08 |
| **P2-08** | Remove dead-code `classes` computed from `<falcon-angular-tag>` | tag | Wrapper has unused `classes` computed signal (lines 62-71) + dead helpers. | Low | Agent 2 / UC-P2-09 |
| **P2-09** | Strategy E for `<falcon-table>` global filter | table | Built-in `<input type=search>` cannot be replaced with `<falcon-angular-search-input>`. | Low | Agent 2 / UC-P2-10 |
| **P2-10** | Per-option `iconUrl` parity across dropdown family | multi-select, combobox, radio-group, checkbox-group | Wave 4 added `iconUrl` to dropdown. Lightweight alternative until U1 ships. | Low | Agent 1 / U9 |
| **P2-11** | Wrapper event re-emission on textarea (audit all wrappers) | textarea + audit | Textarea doesn't expose `falconInput` / `falconChange` / `falconBlur` outputs. Value via CVA only. | Low | Agent 1 / U10 |
| **P2-12** | Range mode for calendar + date-picker (milestone-sized) | calendar, date-picker | Most-requested user feature. Value-shape change. | HIGH | Agent 1 / U11 |
| **P2-13** | Deprecate `<falcon-form-field>` + migrate consumers | form-field + consumers | 131 call sites. Falcon UI inputs have built-in label/error. Migrate to per-input labels. | Medium | Agent 1 / U13 |
| **P2-14** | `description` sub-label across boolean controls (checkbox / radio / switch) | checkbox, radio, switch, group options | Common pattern: label + smaller description. Today composed externally. | Low | Agent 1 / U14 |
| **P2-15** | Card variant on radio-group + sibling for tabs/radio-cards | radio-group | Pricing tier pickers, settings cards. `<falcon-angular-tabs mode='radio-cards'>` covers this — adding `appearance='plain'\|'card'` to radio-group clarifies. | Low | Agent 1 / U15 |
| **P2-16** | Keyboard step on input-number (Arrow Up/Down when `showButtons=false`) | input-number | Native browser supports this; Falcon's doesn't. | Low | Agent 1 / U16 |
| **P2-17** | `prefixIcon` / `suffixIcon` shorthand on input family | input, email-field, phone-field, search-input | Common case shorthand. Today requires Shadow + slot. | Low | Agent 1 / U17 |
| **P2-18** | Tailwind path slot rendering (prefix/suffix on input) | input | Light path doesn't support slots — forces Shadow mode for slot use. | Medium | Agent 1 / U18 |
| **P2-19** | Migration adapter from `FalconMessageService` to `FalconNotificationService` | message-host | Long-term consolidation. | Moderate | Agent 3 / UP-3-19 |
| **P2-20** | Delete dead-code sibling `remote-route.service.ts` + `remote-config.ts` | host-shell core | Two `remote-route.service.ts` files exist; only `core/services/` is active. | Low | Agent 6 / item 5 |
| **P2-21** | Rename `PrimeNGThemeService` → `ThemeRtlSyncService` | host-shell core | Vestigial name. Current job is theme + RTL `<html>` class sync. | Low | Agent 6 / item 6 |
| **P2-22** | Add `panelHeader` / `panelFooter` slots to `<falcon-angular-tabs>` | tabs | Tabs need action buttons left/right of header. Today consumers hand-roll chrome. | Low | Agent 6 / item 8 |
| **P2-23** | Per-option `ng-template` on `<falcon-angular-dropdown>` | dropdown | Wave 4 TODO comment in `user-role-status-step.component.ts`. (Specific instance of P1-01 cross-component upgrade.) | Medium | Agent 6 / item 9 |
| **P2-24** | Add `falcon-angular-popup variant="slot"` (or `'form'`) | popup | Unblocks `<send-credentials-popup>` retirement of dialog dependency. | Low | Agent 6 / item 10 |
| **P2-25** | Promote `<falcon-tree-panel>` legacy to a paired Shadow+Light Stencil component | tree-panel | Unlock Studio token customisation + React/Vue wrappers. | Medium | Agent 6 / item 11 |
| **P2-26** | Promote `<falcon-organization-hierarchy-tree-tw>` to paired Shadow+Light | organization-hierarchy-tree-tw | The only Light-only Falcon component. Inconsistency hurts. | Low-Medium | Agent 6 / item 12 |
| **P2-27** | Standardize per-instance host-class override pattern | docs + lint | Today consumers use SCSS files for host-class token overrides (violation cluster from P0-10). Need documented pattern. | Low (doc-first) | Agent 5 / UP-11 |
| **P2-28** | Add `--falcon-icon-{xl,2xl,3xl}` to size scale | falcon-tailwind-tokens.css | Stat-card and dashboard tiles need 32/40/48 px icons. Today uses bare `text-[40px]` (anti-pattern). | Low | Agent 5 / UP-12 |
| **P2-29** | Bring management-console safelist to parity | management-console tailwind.css | Zero safelist — any `[class.X]` binding may silently drop. | Low | Agent 5 / UP-13 |
| **P2-30** | Unify hex case inside SSOT | falcon-tailwind-tokens.css | Mixed `#F3F8F5` vs `#f3f8f5`. String-comparison gates fail. | Zero | Agent 5 / UP-08 |
| **P2-31** | Fix `--color-falcon-green-50: #F3F8F5;;` double-semicolon | falcon-tailwind-tokens.css line 75 | Parser tolerates but triggers stylelint warning. | Zero | Agent 5 / UP-09 |
| **P2-32** | Document the host-shell `--font-sans` override decision | host-shell styles.scss + falcon-tailwind-tokens.css | SSOT says Neue Haas Grotesk Display Pro; host-shell forces Poppins/Inter with `!important`. Either SSOT or override is wrong. | Medium | Agent 5 / UP-10 |
| **P2-33** | Bake `label` + `required` + `error` into every Falcon input wrapper — retire `<falcon-form-field>` legacy | all form-control wrappers | 131 call sites is largest surface. Requires careful migration. (Same intent as P2-13.) | HIGH | Agent 6 / item 7 |
| **P2-34** | Wizard reset() method + `disabled` / `busy` flags + lazy step bodies | wizard | UC-Z04 / Z05 / Z07. | Low | Agent 4 |
| **P2-35** | Uploader retry button + per-file template + `dragAnywhere` + `displayMode='grid'` | uploader | UC-U02 / U03 / U04 / U05. | Low | Agent 4 |
| **P2-36** | Single-uploader retry button + drag-replace overlay + loading state | single-uploader | UC-SU01-SU06 selection. | Low | Agent 4 |
| **P2-37** | Tree custom search predicate + keyboard chord `*` for `expandAll()` | tree | UC-T06 / UC-T07. | Low | Agent 4 |
| **P2-38** | Tree-panel `<ng-content select="[slot=root-row]">` + section-label slot + multi-select mode | tree-panel | UC-TP04 / TP05 / TP06. | Low | Agent 4 |

## P3 — Polish

| ID | Title | Scope | Motivation | Risk | Source |
|---|---|---|---|---|---|
| **P3-01** | i18n strings for `'Search…'`, `'No records'`, `'Pagination'`, `'Remove'` aria-labels | table, paginator, tag | Hardcoded English in Stencil cores leaks into Arabic UIs. | Low | Agent 2 / UC-P3-01 |
| **P3-02** | Dark-mode bucket overrides per component-token file | All 10 Agent 2 components | Loading overlay `rgba(255,255,255,0.7)` hardcoded — visible regression on dark canvas. | Low | Agent 2 / UC-P3-02 |
| **P3-03** | Remove `'warn'` legacy alias from `FalconTagSeverity` | tag types | API simplification. | Medium (consumers) | Agent 2 / UC-P3-03 |
| **P3-04** | Multi-sort "remove from sort list" affordance | table | Today only flip-twice. Shift+Alt-click to remove. | Low | Agent 2 / UC-P3-04 |
| **P3-05** | Visual-comparison docs for sibling badges (badge / status-badge / tag) | docs | Overlapping visual identities. Help consumers pick. | Low (doc) | Agent 2 / UC-P3-05 |
| **P3-06** | Single source for `FalconStatusBadgeSeverity` type (wrapper re-declares vs imports) | status-badge wrapper | Wrapper re-declares the type — import from `falcon-status-badge.types.ts` instead. | Low | Agent 2 / UC-P3-06 |
| **P3-07** | Promote `<falcon-organization-hierarchy-tree-tw>` Light-DOM tag to paired Shadow+Light | organization-hierarchy-tree-tw | Same as P2-26 but Agent 6 priorities it lower. | Low-Medium | Agent 6 / item 12 |
| **P3-08** | Add `provideAnimationsAsync()` to `management-console/app.config.ts` | mgmt-console app config | Host + admin register it; mgmt doesn't. Future animation needs fail silently. | Low | Agent 6 / item 13 |
| **P3-09** | Re-enable `adminConsoleGuard` in `apps/admin-console/src/app/app.routes.ts:7` | admin-console routes | Currently commented out. Defence-in-depth. | Low-Medium | Agent 6 / item 14 |
| **P3-10** | Add `<falcon-angular-icon>` adoption across host-shell chrome (topbar + sidebar) | host-shell layout | Topbar + sidebar render inline SVG glyphs (~50 per file). Wrap normalises sizing/colouring. | Low | Agent 6 / item 15 |
| **P3-11** | Migrate host-shell from Karma to Vitest | host-shell tests | Admin + management already on Vitest. Standardise. | Low | Agent 6 / item 16 |
| **P3-12** | Adopt `<falcon-angular-menu>` for per-row 3-dot actions in `<falcon-tree-panel>` | tree-panel + menu | Standardises menu chrome — menu has zero consumers. | Medium | Agent 6 / item 17 |
| **P3-13** | Adopt `<falcon-angular-confirm-dialog>` for delete confirmations | confirm-dialog | Layout-level placeholder is unused. Wire 1-2 wizards. | Low | Agent 6 / item 18 |
| **P3-14** | Lint inline `[style.X]=` bindings in Angular templates (outside org-chart allowlist) | apps/* templates | Inline-style ban hardened 2026-05-05. Today raw `style=` is caught but `[style.X]=` slips through. | Low | Agent 5 / UP-14 |
| **P3-15** | Drop `tailwind.config.js` entirely | tailwind.config.js + falcon-tailwind-tokens.css line 8 | Empty v3 bridge. Vestige. | Low | Agent 5 / UP-15 |
| **P3-16** | Promote `data-density` + `data-theme` toggles into runtime theme service | apps/host-shell/src/app/core/services/prime-ng-theme.service.ts | Tokens layer supports it; no Angular service writes the attrs. | Low | Agent 5 / UP-16 |
| **P3-17** | Audit hex inside SVG fill/stroke in Angular templates (use `currentColor` + token color) | 15 template files | 38 hardcoded hex occurrences. Brand-color SVGs should match teal. | Low | Agent 5 / UP-17 |
| **P3-18** | Stepper density / dark-mode / prefers-reduced-motion / aria-orientation | stepper | UC-S04-S08. | Low | Agent 4 |
| **P3-19** | Uploader status labels i18n + progress text option | uploader | UC-U06 / U07. | Low | Agent 4 |
| **P3-20** | Add `errorKey` + `format` + service-level cache options to validator directives | shared-directives | UC-D03-D05. | Low | Agent 4 |

---

## Backlog roll-up

| Priority | Count | Note |
|---|---|---|
| **P0** | 13 | Blockers / correctness / WCAG / SSOT-truth fixes |
| **P1** | 53 | High-leverage reusable upgrades + production migrations |
| **P2** | 38 | Scaling polish + ergonomic improvements |
| **P3** | 20 | House-keeping + polish |
| **TOTAL** | **124** | Across 6 parallel agents |

## Top cross-cutting themes

1. **Reusability through projection** — Strategy E (P0-06, P1-01, P1-11) is the single biggest reusability theme. Today only `<falcon-angular-data-table>` exposes it. Replicating across tree, tree-table, dropdown, multi-select, combobox, accordion, tabs unlocks per-cell / per-row / per-option / per-tab custom rendering without per-page hacks.
2. **API harmonization** — `errorMessage` everywhere (P1-52), method-proxy parity (P1-03), wrapper PR-3 input parity (P1-13), event re-emission (P2-11), `[ariaLabel]` parity (P1-44). Small individually, big cumulatively.
3. **Composition over duplication** — `<falcon-angular-popup>` should compose `<falcon-angular-dialog>` (P1-02). `<falcon-angular-confirm-dialog>` footer should use `<falcon-angular-button>` (P1-33). Item icons should compose `<falcon-angular-icon>` instead of CSS class strings (P1-24).
4. **Token discipline** — SSOT fallback drift (P0-08), intent palette promotion (P1-37), dark-mode bypass collapse (P1-39), token-file shape lint (P1-40). One-pass reconciliation across `components/*.tokens.css`.
5. **Legacy migration** — wizards (P0-02), mobile-number (P1-09), photo-uploader (P1-10), send-credentials-popup (P1-43 + UC-L05), tree-panel (P2-25), form-field (P2-13). All blocked on a few P0/P1 upgrades.
6. **A11y completeness** — popup focus trap (P0-01), keyboard sort (P0-05), keyboard nav (P1-14), tooltip flip (P1-25), ARIA close labels (P1-22), aria-describedby/invalid wiring (P1-50).
7. **Gate / lint hardening** — no-SCSS in features (P0-10), token fallback parity (P0-08), arbitrary Tailwind sweep (P1-41), inline `[style.X]=` lint (P3-14), component-token-shape lint (P1-40).

## Recommended execution order (first 12 items)

1. **P0-09** — Reconcile doc claim about `important: true` (zero-effort docs fix).
2. **P0-03 + P0-04** — PrimeIcons swap in Stencil tables + uploaders (single-source edits).
3. **P0-08** — Token fallback reconciliation (one gate run + auto-fix).
4. **P0-05 + P0-07** — Keyboard sort on table + replace tabs MutationObserver with slot.
5. **P0-01 + P1-02 + P1-26** — Popup focus trap via dialog composition + popup token file.
6. **P0-06 + UC-W01** — Tree per-row template + actions slot (unblocks tree-panel convergence).
7. **P0-02** — Wizard migration (gated on stepper proven in production).
8. **P1-09 + P1-10** — Phone-field and single-uploader migrations (low-risk + visible win).
9. **P1-13** — Paginator wrapper PR-3 parity.
10. **P1-37** — Intent palette → SSOT.
11. **P1-39 + P1-40** — Dark-mode collapse + component-token-shape lint.
12. **P0-10** — No-SCSS gate (forward-only enforcement).
