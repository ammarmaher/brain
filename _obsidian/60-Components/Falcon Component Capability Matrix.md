---
type: reference
cluster: component-capability
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Component Capability Matrix ***
*** Practical quick-pick matrix — UI pattern → component → capabilities → use/avoid ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Component Capability Matrix

> A 9-column practical lookup for choosing the right Falcon component for a UI pattern. Source: [`FALCON_COMPONENT_CAPABILITY_MATRIX.md`](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md) (60 components × 15 capabilities) + per-component dossiers + [[Falcon Component Recognition Playbook]].

## 1. Purpose

Give agents a single-page "which component, why, and when not?" lookup. Each row answers:
- What UI pattern? (recognition)
- Which component? (target)
- Which Angular wrapper? (consumer API)
- What states does it support? (idle/hover/focus/active/disabled/loading/error/selected)
- What slots/templates does it expose? (extension surface)
- Does it consume theme tokens? (themability)
- What's broken or missing? (known gap IDs)
- When to USE it
- When NOT to use it

## 2. Legend

- ✅ supported · ⚠ partial / has caveat · ❌ not supported · n/a not applicable
- "States" column shows the 5 baseline state phases this component honors (idle/hover/focus/active/disabled per [[Falcon Current Hover Focus State Map]]); the listed value summarizes coverage
- "Slots" column shows native extension hooks (Stencil `<slot>` or Angular `ng-template`/directive)
- "Tokens" column → has `*.tokens.css` contract file
- "Known Gaps" column references entries in [[Falcon Component Gap Registry]] or [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md)

## 3. The matrix

### Display & data

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Table | [[Falcon Data Table]] | `<falcon-angular-data-table>` | ✅ idle/hover/selected/loading/empty | ✅ Strategy E (column / empty / loading / global-filter) | ✅ | P1-12 multi-sort output; FDT-SHADOW-FU-01..08; default page size = 10 [Memory: feedback_data_table_default_page_size_10] | Tabular data, any size, lazy or eager | Tree-of-rows (use Tree Table); single-row metric tiles |
| Low-level table | [[Falcon Table]] | `<falcon-angular-table>` | ✅ idle/hover/selected | ⚠ column header/cell helpers | ✅ | P0-03 PrimeIcon residual; P0-05 keyboard activation; P1-14 grid keyboard | Inside Stencil-only contexts | Inside Angular apps — prefer Data Table |
| Tree table | [[Falcon Tree Table]] | `<falcon-angular-tree-table>` | ✅ idle/hover/expanded | ⚠ per-row Stencil slots (O(rows×cols)) | ✅ | P1-11 Strategy E port | Hierarchical rows | Flat data (use Data Table) |
| Pagination | [[Falcon Paginator]] | `<falcon-angular-paginator>` | ✅ CVA-bound | ⚠ page-info template tokens | ✅ | P1-13 API parity (6 missing inputs + rowsChange) | Below any Data Table; default page size = 10 | Standalone (rarely used outside tables) |
| Filter panel | [[Falcon Filter Panel]] | `<falcon-angular-filter-panel>` | ⚠ default | ⚠ custom field renderers (limited) | ✅ | P1-17 Falcon-atom migration | Quick MVP filter UIs | Production-critical filter UIs (use Falcon atoms manually until P1-17) |

### Form inputs

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Text input | [[Falcon Input]] | `<falcon-angular-input>` | ✅ idle/hover/focus/error/disabled/readonly | ✅ prefix/suffix (Shadow) | ✅ | (none P0) | Default for any single-line text | Multi-line (use Textarea); number (Input Number); email (Email Field) |
| Number input | [[Falcon Input Number]] | `<falcon-angular-input-number>` | ✅ same as input | ❌ | ⚠ (7 tokens — undertokenized) | (none P0) | Integer / decimal entry | Currency-formatted display (compose with Icon prefix) |
| Email input | [[Falcon Email Field]] | `<falcon-angular-email-field>` | ✅ + `verifying` / `verified` | ❌ | ✅ | P1-05 verified visuals not built-in | Email field with verification | Plain text |
| Phone / mobile | [[Falcon Phone Field]] | `<falcon-angular-phone-field>` | ✅ + country code + national number | ❌ | ✅ | P1-05 verified visuals | Phone capture | DO NOT use legacy `<falcon-mobile-number>` (P1-09 migration target) |
| Password | [[Falcon Password]] | `<falcon-angular-password>` | ✅ + strength meter | ❌ | ✅ | P1-07 pluggable strength estimator | Password entry | OTP (use OTP component) |
| Textarea | [[Falcon Textarea]] | `<falcon-angular-textarea>` | ✅ standard | ❌ | ✅ | (none P0) | Multi-line text | Rich text (no rich editor in Falcon today — log GAP if needed) |
| OTP | [[Falcon OTP]] | `<falcon-angular-otp>` | ✅ standard | ❌ | ✅ | P1-06 resend cooldown not built-in | OTP entry (4-6 digits) | Generic numeric input |
| Search | [[Falcon Search Input]] | `<falcon-angular-search-input>` | ✅ + clear button | ❌ | ⚠ (4 tokens) | P1-04 CVA gap | Search bar with built-in × button | When you also need formControl (until CVA shipped) |
| Date picker | [[Falcon Date Picker]] | `<falcon-angular-date-picker>` | ✅ standard | ❌ | ✅ | P1-04 CVA gap | Date selection | Date-time (compose) |
| Calendar standalone | [[Falcon Calendar]] | `<falcon-angular-calendar>` | ✅ standard | ❌ | ✅ | P1-04 CVA gap | Inline calendar without input | Date input + popover (use Date Picker) |
| Grid input | [[Falcon Grid Input]] | `<falcon-angular-grid-input>` | ⚠ via event | ❌ | ⚠ (2 tokens) | P1-04 CVA gap | Specialty multi-cell input | Standard text input |

### Selection / pickers

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Dropdown | [[Falcon Dropdown]] | `<falcon-angular-dropdown>` | ✅ CVA + idle/hover/open/focus | ⚠ options slot (Shadow only) | ✅ | P1-01 per-option template; P1-08 async loadOptions | Single-select picker | Multi-select (use Multi Select); typeable (Combobox) |
| Multi-select | [[Falcon Multi Select]] | `<falcon-angular-multi-select>` | ✅ CVA | ❌ | ✅ | P1-01 per-option template; P1-08 async loadOptions | Pick many from list | Single value |
| Combobox | [[Falcon Combobox]] | `<falcon-angular-combobox>` | ⚠ CVA | ❌ | ✅ | P1-01 per-option template; P1-08 async loadOptions | Typeable + filterable | Pure select (use Dropdown) |
| Checkbox | [[Falcon Checkbox]] | `<falcon-angular-checkbox>` | ✅ CVA | ✅ label slot | ✅ | (none P0) | Single boolean | Group of options (use Checkbox Group) |
| Checkbox group | [[Falcon Checkbox Group]] | `<falcon-angular-checkbox-group>` | ✅ CVA | ❌ | ✅ | P1-01 per-option template | Pick many checkboxes | Pick one (use Radio Group) |
| Radio | [[Falcon Radio]] | `<falcon-angular-radio>` | ✅ CVA | ✅ label | ✅ | (none P0) | Single radio in a group | Standalone boolean (use Switch) |
| Radio group | [[Falcon Radio Group]] | `<falcon-angular-radio-group>` | ✅ CVA | ❌ | ✅ | P1-01 per-option template | Pick one from set | Pick many (Checkbox Group) |
| Switch / toggle | [[Falcon Toggle]] | `<falcon-angular-switch>` | ✅ CVA | ✅ label | ✅ | (none P0) | Boolean on/off pill | Multi-state (use radio/segmented control) |

### Actions

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Button | [[Falcon Button]] | `<falcon-angular-button>` | ✅ idle/hover/active/focus-visible/disabled/loading | ✅ start/end icon slots | ✅ | P1-21 polymorphic href | Any clickable action | Anchor with route (until P1-21 — current workaround: wrap with [routerLink]) |
| Menu | [[Falcon Menu]] | `<falcon-angular-menu>` | ✅ idle/hover/focus | ✅ trigger/default | ✅ | P1-19 `appendTo="body"` portal mode | Action / kebab menus | Inside `overflow:hidden` container (until P1-19) |
| Tabs | [[Falcon Tabs]] | `<falcon-angular-tabs>` | ✅ active/hover | ✅ per-panel slot + `falconTabActions` directive | ✅ | P0-07 MutationObserver fragility | Tabbed regions | More than 7 tabs (consider redesign) |
| Stepper | [[Falcon Stepper]] | `<falcon-angular-stepper>` | ✅ active/complete/error | ⚠ default labels | ✅ (14 categories) | P0-12 step.status visualization | Multi-step indicator | Use legacy `<falcon-stepper>` (P0-02 — migration target) |
| Wizard | [[Falcon Wizard]] | `<falcon-angular-wizard>` | ✅ active/complete/error | ✅ per-step + footer-extra | ✅ | P0-12 status link to stepper; P1-45 skip button; P1-47 async validators | Multi-step flow | Single-step form |
| Accordion | [[Falcon Accordion]] | `<falcon-angular-accordion>` | ✅ open/closed/hover | ⚠ content only | ✅ | P1-31 per-tab header slot; P1-32 single-locked mode | Collapsible sections | Tab-like switching (use Tabs) |

### Overlays

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Modal | [[Falcon Popup]] | `<falcon-angular-popup>` | ⚠ open/close (NO focus trap) | ❌ (4 canonical variants) | ❌ (no token file) | P0-01 focus trap; P1-26 token file; P1-27 loading/confirmDisabled; P1-43 `variant="custom"` | Quick modal | Async confirm with loading (until P1-27) — compose with Dialog |
| Confirm dialog | [[Falcon Confirm Dialog]] | `<falcon-angular-confirm-dialog>` | ✅ open/close + focus | ⚠ default body | ✅ | P1-33 internal button → falcon-button | Yes/No confirmation | Complex multi-form dialogs (use Popup variant=custom — pending P1-43) |
| Drawer | [[Falcon Drawer]] | `<falcon-angular-drawer>` | ✅ open/close + focus trap | ✅ header/default/footer | ✅ | P1-22 closeAriaLabel | Side-slide panel | Centered modal (use Popup) |
| OTP send dialog | [[Falcon OTP Send Dialog]] | `<falcon-angular-otp-send-dialog>` | ✅ standard | ❌ | ✅ | P1-06 resend cooldown | OTP entry in dialog | Standalone OTP (use OTP component) |
| Tooltip | [[Falcon Tooltip]] | `<falcon-angular-tooltip>` | ✅ open/close | ✅ trigger slot | ✅ | P1-25 collision-aware flip | Hover-only label | Click-to-reveal content (use popup/menu) |
| Notification | [[Falcon Notification]] | `<falcon-angular-notification>` | ⚠ open/close | ❌ | ❌ (no token file) | P1-26 token file; P1-28 hover-pause | Inline ephemeral message | App-level toast (use Message Host) |
| Toast (DEPRECATED) | [[Falcon Toast]] | `<falcon-angular-toast>` | ✅ polite/assertive | ❌ | ✅ | P1-23 `@deprecated` JSDoc | (don't use — prefer Notification + Message Host) | Any new code |
| Message host | [[Falcon Message Host]] | `<falcon-angular-message-host>` | ✅ delegated | ❌ | ❌ (composes toast tokens) | P1-34 maxStack cap | App-level toast container | Per-feature ephemeral (use inline Notification) |

### Display

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Status chip | [[Falcon Status Badge]] | `<falcon-angular-status-badge>` | ✅ severity | ❌ | ✅ | P1-44 ariaLabel parity | Show entity state (active/disabled/invited/deleted/etc.) | Inline `<div>` chip with manual colors |
| Count badge | [[Falcon Badge]] | `<falcon-angular-badge>` | ✅ default | ✅ ng-content | ✅ | P1-44 ariaLabel parity | Number badge (e.g., notification count) | Status (use Status Badge) |
| Tag | [[Falcon Tag]] | `<falcon-angular-tag>` | ✅ default | ❌ | ✅ | P1-44 ariaLabel parity | Static label chip | State indicator (use Status Badge) |
| Avatar | [[Falcon Avatar]] | `<falcon-angular-avatar>` | ✅ default | ❌ | ✅ | P1-29 img-load fallback; P1-30 avatar-group | Photo or initials | Group of avatars (until P1-30) |
| Icon | [[Falcon Icon]] | `<falcon-angular-icon>` | ✅ default | ❌ | ✅ | P1-35 spin/pulse anim; P1-36 Iconify routing | Any icon | Inline `<i class="fa-...">` (DON'T) |
| Empty state | [[Falcon Empty State]] | `<falcon-angular-empty-state>` | ✅ default | ✅ icon/title/description/actions | ✅ | (none P0) | "No results" panel | Toast-level "no data" (use Notification) |
| Card | [[Falcon Card]] | `<falcon-angular-card>` | ✅ default | ✅ header/default/footer | ✅ | P1-20 `interactive`/`selected`/`(falconClick)` | Box container | Page-shell card (use page-shell recipe directly) |

### Hierarchy

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Generic tree | [[Falcon Tree]] | `<falcon-angular-tree>` | ✅ expand/collapse/select | ❌ (gap) | ✅ | P0-06 per-row template + action slot; P1-48 virtualization / lazy / DnD / multi-select | Simple expandable tree | Per-row actions/custom rows (use legacy tree-panel) |
| Org-hierarchy rail | [[Falcon Tree Panel]] | `<falcon-tree-panel>` (legacy bespoke) | ✅ + per-row kebab + root kebab | ✅ per-row + root 3-dot menus | ❌ (SCSS rules) | P1-15 Shadow companion; P1-49 action `disabled?`/`variant`/`keyboard` | Canonical org-hierarchy rail | Generic tree (use Tree component when P0-06 lands) |
| Org-hierarchy custom tree | [[Falcon Organization Hierarchy Tree TW]] | (Light-DOM only) | ⚠ | ❌ | ✅ | P1-15 Shadow companion + wrapper | When org-hierarchy needs Tailwind-only DOM | Cross-app reuse (until P1-15) |

### Upload

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Photo uploader | [[Falcon Single Uploader]] | `<falcon-angular-single-uploader>` | ✅ idle/loading/error | ❌ | ✅ | (none P0) | Profile picture; circular avatar | Use legacy `<falcon-photo-uploader>` (P1-10 migration target) |
| File uploader | [[Falcon Uploader]] | `<falcon-angular-uploader>` | ✅ idle/uploading/done/error | ❌ | ✅ | P0-13 native validation `enableNativeValidation` | Multi-file upload | Single photo (use Single Uploader) |

### Specialty

| UI Pattern | Falcon Component | Angular Wrapper | Supports States | Supports Slots/Templates | Theme Tokens | Known Gaps | Use When | Do Not Use When |
|---|---|---|---|---|---|---|---|---|
| Form field wrapper | [[Falcon Form Field]] (legacy) | `<app-falcon-form-field>` | ✅ idle/error | ✅ default = control | ❌ (SCSS) | P1-51 promote to Falcon UI core | Label + input + error envelope | Until P1-51 — compose label + wrapper manually |
| Insufficient balance dialog | [[Falcon Insufficient Balance Dialog]] | (composes confirm-dialog) | ✅ standard | ❌ | ✅ | (none P0) | Wallet insufficient-funds flow | Generic confirm (use Confirm Dialog) |
| Send credentials popup | [[Send Credentials Popup]] (legacy bespoke) | `<send-credentials-popup>` | ⚠ standard | ⚠ form inside dialog | ❌ | P1-43 popup `variant="custom"` replacement | (don't use — playground only) | Any new code |
| Shared directives | [[Shared Directives]] | (12 directives) | n/a | n/a | ❌ | P0-11 FalconFormValidateDirective refactor; P1-50 aria-describedby auto-link | Async validators, masks, etc. | Replace directly without `FalconFormValidateDirective` (until P0-11) |

## 4. Coverage stats (sourced 2026-05-13 from CAPABILITY_MATRIX)

| Capability | Components covered | Components partial | Components not |
|---|---:|---:|---:|
| Dual render (Stencil Shadow + Light) | 47 | — | 12 (Angular-only or legacy) |
| CVA (Reactive Forms) | 15 wrappers | 4 partial (calendar/date-picker/search-input/grid-input — P1-04) | rest n/a |
| Slots / templates | ~30 with full slot coverage | ~15 partial | ~15 none |
| Theme tokens (`*.tokens.css`) | 51 components have a contract | 5 partial | 4 missing (popup, notification, photo-uploader, send-credentials-popup) |
| Dark-mode parity | ~10 full | ~40 partial (P1-39 cascade refactor) | ~10 none |
| RTL | ~50 ✅ | ~5 partial | ~5 n/a |
| Production consumers > 0 | 25 (incl. data table, button, input, dropdown, etc.) | 5 partial | 30 lab-only / unused (per knowledge build) |
| Unit tests / specs | 0 components | — | All — P1-16 |

## 5. Decision flow — using this matrix

1. Find the row matching your UI pattern (use [[Falcon Component Recognition Playbook]] §2 if unsure)
2. Check "Supports States" column — does it cover the states you need?
3. Check "Supports Slots/Templates" — can it carry your custom content?
4. Check "Theme Tokens" — does it consume the standard token contract?
5. Check "Known Gaps" — is the capability you need blocked by a known gap?
6. Read "Use When" / "Do Not Use When" — does your scenario match?
7. If everything passes → REUSE via the listed Angular wrapper. If a gap blocks → log in [[Falcon Component Gap Registry]].

## 6. Wrong patterns to avoid

- ❌ Pick a component without checking the "Known Gaps" column — you'll hit the gap mid-implementation
- ❌ Use a deprecated row (toast, calendar-legacy, multiselect-legacy, photo-uploader, mobile-number, stepper-legacy, dialog, form-field, send-credentials-popup, tree-panel) for new work — these are migration targets
- ❌ Treat "partial token" components as fully themable — they have undertokenized properties (e.g., popup has no `*.tokens.css`)
- ❌ Use the Stencil element (`falcon-X` or `falcon-X-tw`) directly in Angular — always use the wrapper

## 7. Angular-first notes

- The "Angular Wrapper" column is the Angular API surface today.
- 15 wrappers implement CVA — see source: [`falcon-ui-core/src/angular-wrapper/components/`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/angular-wrapper/components/).
- 4 wrappers have CVA gaps (calendar / date-picker / search-input / grid-input) — workaround is event-binding until P1-04 ships.
- React/Vue future placeholders inherit the same matrix.

## 8. Future-agent instructions

- Open this matrix BEFORE picking a component. Don't trust memory — check the "Known Gaps" + "Do Not Use When" columns.
- If you spot a deprecated component being used somewhere in active code, log it as a migration follow-up.
- If a row's "Known Gaps" feels stale — refresh from [`COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) and [[Falcon Component Gap Registry]].

## See also

- [[Falcon Component Recognition Playbook]] — pattern → component mapping
- [[Falcon Component Selection Decision Tree]] — reuse/extend/create rules
- [[Falcon Page Assembly Playbook]] — compose chosen components into a page
- [[Falcon Component Gap Registry]] — capability gaps
- [[Falcon Component Theme Contract]] — 9-section per-component contract
- [[FALCON_COMPONENT_INDEX]] — full per-component dossier index

## Tags

#type/reference #layer/frontend #cluster/component-capability #priority/critical

## Hubs

- [[60-Components/Falcon Component Recognition Playbook|Component Recognition Playbook]] · [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
