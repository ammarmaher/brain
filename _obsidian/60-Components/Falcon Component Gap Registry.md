---
type: registry
cluster: component-gaps
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Component Gap Registry ***
*** Tracks missing REUSABLE capabilities across the Falcon component library ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Component Gap Registry

> Single source of truth for "what's missing from the Falcon component library so an agent can deterministically know whether to wait, work around, or escalate." Sourced from [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) (124-item P0-P3 list) + per-component dossier GAPS files.

## 1. Purpose

Make capability gaps **citable, prioritizable, and unblockable**:
- A new page task hits a missing capability → look here FIRST (don't re-discover the gap)
- Existing gap exists → cite the ID and either wait (P0/P1) or apply the documented workaround
- No matching gap → log a new entry HERE before any bespoke work begins
- Maintains the reuse-first contract from [[Falcon Component Selection Decision Tree]]

## 2. How to read this registry

Each gap row has:

| Column | Meaning |
|---|---|
| **Gap ID** | Stable identifier (e.g., `P0-01`, `P1-08`). P0 = blocks correct usage / a11y. P1 = frequent / high-leverage. P2 = improvement. P3 = polish. |
| **Component** | The Falcon component that needs the capability |
| **Missing Capability** | What's not there today (one sentence) |
| **Needed By Page** | Which page(s) request the capability today |
| **Reusable?** | YES = belongs in shared component. NO = page-specific (don't add to shared) |
| **Recommended Fix** | The intended resolution path (existing component / new API / workaround) |
| **Priority** | P0 / P1 / P2 / P3 |

**Decision flow when a gap is hit:**
1. Match the missing capability to a row below
2. P0 or P1 → **STOP**, escalate to Ammar
3. P2 or P3 → apply "Recommended Fix" workaround; ship; tag the PR with the Gap ID
4. No match → add a new row using the template at §6

## 3. P0 — Blocks correct usage / data integrity / a11y compliance

| Gap ID | Component | Missing Capability | Needed By Page | Reusable? | Recommended Fix | Priority |
|---|---|---|---|---|---|---|
| **P0-01** | `<falcon-angular-popup>` | Focus trap (WCAG violation) | Any modal with internal focusable controls | YES | Compose `<falcon-angular-dialog>` to inherit trap + focus restore (P1-02) | P0 |
| **P0-02** | `<falcon-stepper>` (legacy) | Multi-wizard migration to `<falcon-angular-stepper>` + `<falcon-angular-wizard>` | Add Client (admin + management), Add User (admin + management) | YES | Migrate the 4 wizards; delete legacy stepper after parity | P0 |
| **P0-03** | `<falcon-table>` | PrimeIcons residual `pi pi-ellipsis-v` row-action button | Anywhere table is shipped | YES | Replace with `<falcon-angular-icon>` per Wave PR-8 | P0 |
| **P0-04** | `<falcon-uploader>` / `<falcon-single-uploader>` | PrimeIcons residual (`pi pi-cloud-upload`, `pi pi-pencil`) | All uploader consumers | YES | Replace icons via `<falcon-angular-icon>` | P0 |
| **P0-05** | `<falcon-table>` | Keyboard activation for sortable column headers (WCAG) | Any sortable table | YES | Add `tabindex=0` + `keydown.enter/space` | P0 |
| **P0-06** | `<falcon-angular-tree>` | Per-row template + per-row action slot | Tree-panel convergence; any tree with rich rows | YES | Add `<ng-template falconTreeRow>` + `<ng-template falconTreeRowActions>` | P0 |
| **P0-07** | `<falcon-angular-tabs>` | Replace `falconTabActions` MutationObserver lift with real `<slot name="header-end">` | All tabbed pages | YES | Add real slot, deprecate MutationObserver | P0 |
| **P0-08** | button / input / dropdown / multi-select / phone-field / email-field / combobox | Component-token fallback hex drifts from SSOT primitive | All tokenized components | YES | Reconcile fallback hex to match primitive (teal-500 = `#124c52`, NOT `#0d3f44`) | P0 |
| **P0-09** | (docs only) | `tailwind.config.js` `important: true` claim drift | All token reads | n/a | Update `TAILWIND_TOKEN_MAP.md` + `falcon-tailwind-tokens.css` comments | P0 |
| **P0-10** | (codebase rule) | No-SCSS gate (20+ feature SCSS files violate the standing rule) | All feature folders | n/a | Add a gate; remove SCSS files | P0 |
| **P0-11** | `FalconFormValidateDirective` | Drop PrimeNG selectors + inline styles + console.log | All forms | YES | Refactor to target Falcon atoms, remove inline styles, drop console.log | P0 |
| **P0-12** | `<falcon-angular-wizard>` | Visualize `step.status` via embedded stepper (partial) | Add Client / Add User wizards | YES | Drive stepper from `stepControls` validity + dirty + invalid state | P0 |
| **P0-13** | `<falcon-angular-uploader>` | Built-in native validation (`enableNativeValidation` Input) | All upload consumers | YES | Add input + emit `falcon-validate` event with violations | P0 |

## 4. P1 — Frequent need / high-leverage reusable upgrades

> Selected high-impact entries — see [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) for the full P1 list (52 entries).

| Gap ID | Component | Missing Capability | Needed By Page | Reusable? | Recommended Fix | Priority |
|---|---|---|---|---|---|---|
| **P1-01** | dropdown / multi-select / combobox / checkbox-group / radio-group / phone-field / otp | Universal `FalconOptionTemplateDirective` (per-option template) | Any page with custom-rendered option lists | YES | Bridge Stencil slot ↔ Angular `ng-template`; unify across 6+ components | P1 |
| **P1-02** | `<falcon-angular-popup>` | Compose `<falcon-angular-dialog>` for focus-trap + tokens (resolves P0-01) | Every popup | YES | Replace hand-rolled scaffold with composition | P1 |
| **P1-03** | input / dropdown / multi-select / combobox / textarea / password / input-number / email-field / phone-field / calendar / date-picker / otp / search-input / grid-input | Method-proxy harmonization (`setFocus()` / `clear()` / `openPanel()` / `closePanel()`) | All form consumers | YES | Add proxy methods to Angular wrappers | P1 |
| **P1-04** | calendar / date-picker / search-input / grid-input | CVA backfill | All forms using these inputs | YES | Implement `ControlValueAccessor` on 4 wrappers | P1 |
| **P1-05** | email-field / phone-field | `verified` / `verifying` state visuals | Any verification flow (login, edit-user) | YES | Built-in success spinner + checkmark | P1 |
| **P1-06** | `<falcon-angular-otp-send-dialog>` | Resend cooldown + code-expired state | All OTP flows | YES | Add 30-60s cooldown + visual countdown | P1 |
| **P1-07** | `<falcon-angular-password>` | Pluggable strength estimator (zxcvbn) + meter labels | All password creation forms | YES | Strategy pattern for estimators | P1 |
| **P1-08** | dropdown / multi-select / combobox | Async `loadOptions(query)` hook | Add Client / Add User (city/country/role/node pickers) | YES | Built-in observable-driven option load | P1 |
| **P1-09** | `<falcon-mobile-number>` (legacy) | Migrate 5 consumers to `<falcon-angular-phone-field>` | forgot-password, add-client / add-user × admin / management | YES | Replace + delete legacy | P1 |
| **P1-10** | `<falcon-photo-uploader>` (legacy) | Migrate 6 wizard step files to `<falcon-angular-single-uploader>` | Add Client / Add User photo steps | YES | Use `previewMode='thumbnail'` + token override `--falcon-single-uploader-tile-radius: 50%` | P1 |
| **P1-11** | `<falcon-angular-tree-table>` | Strategy E projection (per-row Angular templates) | Hierarchical tables | YES | Mirror data-table's Strategy E | P1 |
| **P1-12** | `<falcon-angular-data-table>` | `(multiSortChange)` output | Multi-sort tables | YES | Forward Stencil's `falcon-multi-sort` event | P1 |
| **P1-13** | `<falcon-angular-paginator>` | API parity — 6 missing inputs + `rowsChange` output | Standalone paginators | YES | Bridge Stencil `totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport` | P1 |
| **P1-14** | `<falcon-table>` | Grid keyboard navigation (Arrow / Home / End / PageUp / PageDown) | All data tables | YES | Implement WAI-ARIA grid pattern | P1 |
| **P1-15** | `<falcon-organization-hierarchy-tree-tw>` | Shadow companion + Angular wrapper | Org-hierarchy pages | YES | Add Stencil shadow + Angular wrapper; deprecate Light-only | P1 |
| **P1-16** | data-table / table / paginator / tree-table | Spec coverage on Strategy E orchestrator + Stencil utils | (test-only) | YES | Write specs | P1 |
| **P1-17** | `<falcon-angular-filter-panel>` | Falcon-atom migration + custom field type | Any filter UI | YES | Replace raw `<input>`/`<select>`/`<input type=date>` with Falcon atoms | P1 |
| **P1-18** | admin-console + management-console (org-hierarchy menu) | Refactor inline status chips to `<falcon-angular-status-badge>` | Org-hierarchy pages | YES | Replace inline Tailwind chips with badge component | P1 |
| **P1-19** | `<falcon-angular-menu>` | `appendTo="body"` portal mode | Any menu inside `overflow:hidden` container | YES | Implement body portal; default to `host` (current) for back-compat | P1 |
| **P1-20** | `<falcon-angular-card>` | `interactive` / `selected` / `(falconClick)` | Plan-tier tiles, dashboard widget selection | YES | Add inputs + output; respect `aria-pressed` | P1 |
| **P1-21** | `<falcon-angular-button>` | Polymorphic `href` / `target` / `rel` (renders `<a>`) | Any "navigate to detail" button | YES | When `href` set, render anchor; preserve focus-visible + button styles | P1 |
| **P1-22** | drawer + dialog | Expose `closeAriaLabel` in Angular wrappers | i18n flows | YES | Surface the Stencil prop | P1 |
| **P1-23** | dialog + toast | `@deprecated` JSDoc tags | (codebase hygiene) | n/a | Add `@deprecated` so TypeScript LSP shows strikethrough | P1 |
| **P1-24** | menu / tabs / accordion / confirm-dialog / popup / notification / avatar | Migrate icon-as-CSS-class-string to `<falcon-angular-icon>` composition | All components above | YES | Accept icon NAME (token), not class string | P1 |
| **P1-25** | `<falcon-angular-tooltip>` | Collision-aware flip placement | Any tooltip near viewport edges | YES | Implement auto-flip on overflow | P1 |
| **P1-26** | popup + notification | Introduce `*.tokens.css` contract files | Any visual customization | YES | Add `popup.tokens.css` + `notification.tokens.css` per [[Falcon Component Theme Contract]] | P1 |
| **P1-27** | `<falcon-angular-popup>` | `loading` + `confirmDisabled` for async confirm flows | Any popup with async save | YES | Add inputs + spinner overlay | P1 |
| **P1-28** | `<falcon-angular-notification>` | Hover-pause auto-dismiss | All notifications | YES | Match `<falcon-angular-toast>` hover-pause behavior | P1 |
| **P1-29** | `<falcon-angular-avatar>` | Image-load-error fallback (initials → icon) | All avatar consumers | YES | `onerror` → initials → icon fallback chain | P1 |
| **P1-30** | new component | `<falcon-angular-avatar-group>` with overflow pill | Member rosters, team views | YES | New component composing avatars | P1 |
| **P1-31** | `<falcon-angular-accordion>` | Per-tab header slot (`<slot name="header-{value}">`) | Accordion with status badges in headers | YES | Add slot | P1 |
| **P1-32** | `<falcon-angular-accordion>` | `single-locked` mode (always 1 open, no collapse to zero) | Step-like accordions | YES | Add mode value | P1 |
| **P1-33** | `<falcon-angular-confirm-dialog>` | Internal footer uses `<falcon-angular-button>` (currently raw `<button>`) | All confirm dialogs | YES | Replace raw button | P1 |
| **P1-34** | `FalconMessageService` | `maxStack` cap | All app-level toasts | YES | Configurable cap; oldest-out | P1 |
| **P1-35** | `<falcon-angular-icon>` | Spin / pulse animation props | Inline loading indicators | YES | Add `spin` / `pulse` boolean inputs | P1 |
| **P1-36** | `<falcon-angular-icon>` | Auto-route between Falcon font and Iconify by `:` prefix | All icon consumers | YES | `solar:pencil` → Iconify, else Falcon font | P1 |
| **P1-37** | (SSOT @theme) | Promote intent palette (`--color-falcon-{primary,danger,success,warning,info}`) into `@theme` | All Tailwind utility consumers | YES | Move from semantic.css to falcon-tailwind-tokens.css | P1 |
| **P1-38** | apps/*/src/tailwind.css | Auto-generate `@source inline(...)` safelist from `*-tailwind-classes.ts` | All three apps | YES | Codegen script | P1 |
| **P1-39** | components/*.tokens.css | Move 178 dark-mode bypass overrides into SSOT alpha chain | All tokenized components | YES | Use `var(--color-falcon-teal-alpha-*)` instead of literal rgba | P1 |
| **P1-40** | components/*.tokens.css | Per-component token-file linter | All tokenized components | YES | Gate: `:where(...)` scoping + `--falcon-<X>-*` only + match SSOT primitive | P1 |
| **P1-41** | apps/**/*.html | Sweep arbitrary Tailwind hex/px to Falcon tokens | All feature templates | YES | Codemod + gate; worst: admin-console org-hierarchy-page-menu | P1 |
| **P1-42** | (4 wizards) | Migrate wizard host from legacy `<falcon-stepper>` to `<falcon-angular-stepper>` (duplicate of P0-02) | Add Client / Add User wizards | YES | Same as P0-02 framing | P1 |
| **P1-43** | `<falcon-angular-popup>` | Slot-friendly `variant="custom"` | OTP / confirm / save / unsaved flows | YES | Unblocks deletion of `send-credentials-popup` legacy | P1 |
| **P1-44** | status-badge / badge / empty-state / tag | Wrapper `[ariaLabel]` parity sweep | a11y flows | YES | Surface Stencil `ariaLabel` prop | P1 |
| **P1-45** | `<falcon-angular-wizard>` | Skip button for optional steps | Any optional-step wizard | YES | Add `optional` prop + `(skip)` output | P1 |
| **P1-46** | `<falcon-angular-wizard>` | Per-step `slot="header-{index}"` | Custom step headers | YES | Add slot | P1 |
| **P1-47** | `<falcon-angular-wizard>` | Async-validator awaiting in `stepControls` bridge | Any wizard using `FalconCheckExistsDirective` | YES | Wait for `PENDING` state | P1 |
| **P1-48** | `<falcon-angular-tree>` | Virtualization + lazy children loader + drag-and-drop + multi-mode select | Large trees | YES | Series UC-T02..T05 | P1 |
| **P1-49** | `<falcon-tree-panel>` (legacy) | Action `disabled?: (node) => boolean` + `variant` + keyboard activation | Org-hierarchy | YES | Add to legacy until P1-15 ships | P1 |
| **P1-50** | `FalconFormValidateDirective` | Auto-link `aria-describedby` + set `aria-invalid="true"` | All forms | YES | Add after P0-11 refactor | P1 |
| **P1-51** | new component | Promote `<falcon-form-field>` to Falcon UI core (`<falcon-angular-form-field>`) | 80+ wizard call sites | YES | Add token contract + auto-link label-for-control + tooltip slot | P1 |
| **P1-52** | dropdown / multi-select / combobox / checkbox / checkbox-group / radio / radio-group / switch | `errorMessage` everywhere (alias `errorText` + soft-deprecate) | All forms | YES | Add alias prop | P1 |

## 5. Specific user-listed examples — gap status

The user's task listed 6 example gaps explicitly. Status of each:

| User-listed example | Maps to | Status |
|---|---|---|
| **data-table needs custom cell templates** | (already supported as Strategy E) | ✅ Built-in — `<ng-template falconColumn="<field>" let-row>...</ng-template>` |
| **data-table needs per-row loading/skeleton** | NEW GAP — `FDT-SHADOW-FU-XX` not yet covering this | ⚠ **NEW P2** — log as `P2-DT-ROW-LOADING`: per-row skeleton overlay during inline async actions (e.g., row-level "Disable" save). Workaround: row-level disabled state + global table loader |
| **tabs need left/right header action slots** | P0-07 (replace MutationObserver with real slot) | ⚠ P0 tracked — `falconTabActions` directive works today via MutationObserver; P0-07 hardens it |
| **dropdown needs async loadOptions** | P1-08 | ⚠ P1 tracked |
| **tree needs per-row action template** | P0-06 | ⚠ P0 tracked |
| **popup needs focus trap / loading / confirmDisabled** | P0-01 (focus trap) + P1-27 (loading + confirmDisabled) | ⚠ P0 + P1 tracked |

## 6. New gap entry — template

When you encounter a missing capability not listed above, add a row here BEFORE bespoke work:

```markdown
| **<P0/P1/P2/P3>-<short-id>** | <component> | <one-sentence missing capability> | <page(s) that need it> | YES / NO | <recommended fix path> | <P0/P1/P2/P3> |
```

**Naming convention:**
- P0-XX / P1-XX continue the existing backlog numbering (next free number)
- P2-XX / P3-XX are open spaces; prefix with component initials if helpful (e.g., `P2-DT-ROW-LOADING`)
- "Reusable? = NO" means the gap is page-specific and should be solved via a local Angular component, NOT via a new shared component or shared API addition

## 7. Wrong patterns to avoid

- ❌ Adding a workaround in code WITHOUT logging the gap here
- ❌ Logging a gap as "P0" when it's actually a polish item (be honest with priority)
- ❌ Marking a page-specific need as "Reusable = YES" just to push it onto the shared library team
- ❌ Treating P0/P1 gaps as "just work around it" — they BLOCK page work until Ammar approves a workaround
- ❌ Duplicating an existing gap with a new ID — search this file + [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) first

## 8. Angular-first notes

- All gaps are Angular-consumer-facing (the Angular wrapper API surface)
- Stencil layer gaps (e.g., add a slot in `falcon-X.tsx`) ALSO require Angular wrapper bridging
- React/Vue wrappers are future placeholders — their gap entries should reference the equivalent Angular wrapper gap

## 9. Future-agent instructions

- **Before any bespoke work:** search this file for the missing capability
- **If found:** cite the Gap ID in your PR + apply the documented workaround OR wait for the fix
- **If not found:** add a new row here with the template at §6 — even if you don't have time to fix it
- **Periodically:** sync new entries here into [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) so the Brain Outputs SoT stays current

## See also

- [[Falcon Component Recognition Playbook]] — pattern → component
- [[Falcon Component Capability Matrix]] — what each component DOES support (the inverse view)
- [[Falcon Component Selection Decision Tree]] — when to log a gap vs when to proceed
- [[Falcon Screenshot To Component Mapping Guide]] — Step 4 (gap detection) feeds this registry
- [[Falcon New Page Implementation Checklist]] — pre-merge "all gaps documented" check
- [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) — Brain Outputs SoT (124 entries)
- [`FALCON_COMPONENT_CAPABILITY_MATRIX.md`](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md) — verified capability data

## Tags

#type/registry #layer/frontend #cluster/component-gaps #priority/critical #gap

## Hubs

- [[60-Components/Falcon Component Recognition Playbook|Component Recognition Playbook]] · [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[GAPS_INDEX]]
