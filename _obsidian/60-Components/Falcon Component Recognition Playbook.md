---
type: playbook
cluster: component-recognition
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Component Recognition Playbook ***
*** Teaches the Brain to map a UI pattern to an existing Falcon component before writing any code ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Component Recognition Playbook

> Before writing a single line of HTML, an Angular template, or a custom Stencil component, the Brain MUST analyze the requested UI and map each visible UI pattern to the existing Falcon component library. Raw HTML or a new bespoke component is the **last resort**, not the first reach.

## 1. Purpose

Make UI recognition deterministic:
- Eliminate "let's just inline a `<table>`/`<div>`" mistakes when a Falcon component exists
- Eliminate reinventing already-built capabilities (sort, paginate, validate, etc.)
- Establish a shared vocabulary for "what is this thing on the screen?"
- Provide the lookup table that every screenshot/design-to-Angular task starts with

## 2. Master pattern → component mapping

> Read row-by-row. Left column = what you see on the screen. Right columns = what to use in Angular.

### Display & data

| UI pattern (what you see) | Falcon component (use this) | Angular wrapper | When |
|---|---|---|---|
| **Table with rows + columns** | [[Falcon Data Table]] | `<falcon-angular-data-table>` | Default for all tabular data — supports sort, paginator, custom cell `ng-template`s, sticky actions, row menu, empty/loading states |
| Tabular layout but **inside Stencil-only context** | [[Falcon Table]] | `<falcon-angular-table>` (low-level) | Rarely the right answer in apps — prefer Data Table |
| **Tree-of-rows table** (hierarchical) | [[Falcon Tree Table]] | `<falcon-angular-tree-table>` | When rows expand into child rows |
| **Pagination strip below a table** | [[Falcon Paginator]] | `<falcon-angular-paginator>` | Composes into Data Table; default page size 10 (Falcon standing rule) |
| **Filter strip / advanced filter panel** | [[Falcon Filter Panel]] | `<falcon-angular-filter-panel>` | Wraps a table's filter UI (warning: P1 gap — uses native HTML controls; Falcon-atom migration pending) |

### Inputs & selection

| UI pattern | Falcon component | Angular wrapper | When |
|---|---|---|---|
| **Single-line text input** | [[Falcon Input]] | `<falcon-angular-input>` | Default text field — CVA-bound, prefix/suffix icon slots |
| **Number input** | [[Falcon Input Number]] | `<falcon-angular-input-number>` | Integer or decimal — has digit-mask helpers |
| **Email input** | [[Falcon Email Field]] | `<falcon-angular-email-field>` | Email-validated input with `verifying`/`verified` lifecycle |
| **Phone / mobile input** | [[Falcon Phone Field]] | `<falcon-angular-phone-field>` | Country code + national number — DO NOT use legacy `<falcon-mobile-number>` (P1-09 migration) |
| **Password input** | [[Falcon Password]] | `<falcon-angular-password>` | Strength meter (heuristic; zxcvbn upgrade pending P1-07) |
| **Multi-line text** | [[Falcon Textarea]] | `<falcon-angular-textarea>` | CVA-bound multi-line input |
| **OTP entry** | [[Falcon OTP]] | `<falcon-angular-otp>` | 4-6 digit OTP entry |
| **Search input** (icon + text) | [[Falcon Search Input]] | `<falcon-angular-search-input>` | Has built-in clear button (CVA gap — P1-04) |
| **Dropdown / select** | [[Falcon Dropdown]] | `<falcon-angular-dropdown>` | Default single-select picker — CVA-bound |
| **Multi-select dropdown** | [[Falcon Multi Select]] | `<falcon-angular-multi-select>` | Chip-style multi-select |
| **Combobox** (typeable + filterable) | [[Falcon Combobox]] | `<falcon-angular-combobox>` | When user can both type and pick |
| **Checkbox** | [[Falcon Checkbox]] | `<falcon-angular-checkbox>` | Single boolean |
| **Group of checkboxes** | [[Falcon Checkbox Group]] | `<falcon-angular-checkbox-group>` | Pick-many |
| **Radio button** | [[Falcon Radio]] | `<falcon-angular-radio>` | Single choice in a group |
| **Radio group** | [[Falcon Radio Group]] | `<falcon-angular-radio-group>` | Pick-one |
| **Toggle / switch** | [[Falcon Toggle]] | `<falcon-angular-switch>` | Boolean on/off pill |
| **Date picker** | [[Falcon Date Picker]] | `<falcon-angular-date-picker>` | Input + calendar combo (CVA gap — P1-04) |
| **Calendar (standalone)** | [[Falcon Calendar]] | `<falcon-angular-calendar>` | Date-picker without input — legacy `<falcon-calendar-legacy>` deprecated |
| **Grid input** (per-column inline inputs) | [[Falcon Grid Input]] | `<falcon-angular-grid-input>` | Specialty grid editor |

### Actions

| UI pattern | Falcon component | Angular wrapper | When |
|---|---|---|---|
| **Button** (any flavor) | [[Falcon Button]] | `<falcon-angular-button>` | `variant="primary\|secondary\|ghost\|link\|danger"`, `size="sm\|md\|lg"` — NEVER use raw `<button>` styled inline |
| **Menu / kebab / dropdown menu** | [[Falcon Menu]] | `<falcon-angular-menu>` | Action menu — `appendTo="body"` portal pending P1-19 |
| **Tabs** | [[Falcon Tabs]] | `<falcon-angular-tabs>` | Use `falconTabActions` directive to slot action UI per tab (P0-07 fragility — being fixed) |
| **Stepper / wizard** | [[Falcon Stepper]] + [[Falcon Wizard]] | `<falcon-angular-stepper>` + `<falcon-angular-wizard>` | Multi-step flow — DO NOT use legacy `<falcon-stepper>` (P0-02 migration) |
| **Accordion / collapsible** | [[Falcon Accordion]] | `<falcon-angular-accordion>` | Expandable sections |

### Overlays

| UI pattern | Falcon component | Angular wrapper | When |
|---|---|---|---|
| **Modal / dialog** | [[Falcon Popup]] | `<falcon-angular-popup>` | Default modal (NB: focus-trap gap P0-01 → compose with `<falcon-angular-dialog>` per P1-02) |
| **Confirm dialog** | [[Falcon Confirm Dialog]] | `<falcon-angular-confirm-dialog>` | Yes/No with title + body |
| **Insufficient-balance dialog** | [[Falcon Insufficient Balance Dialog]] | (composes confirm-dialog) | Wallet flow specialty |
| **Drawer / side panel** | [[Falcon Drawer]] | `<falcon-angular-drawer>` | Right-or-left slide-in (e.g., Add Node) |
| **OTP send dialog** | [[Falcon OTP Send Dialog]] | `<falcon-angular-otp-send-dialog>` | OTP entry inside a dialog |
| **Tooltip** | [[Falcon Tooltip]] | `<falcon-angular-tooltip>` | Hover-only short label (auto-flip pending P1-25) |
| **Toast / notification** | [[Falcon Notification]] | `<falcon-angular-notification>` | Inline ephemeral message — `<falcon-angular-toast>` is DEPRECATED |
| **Message host** | [[Falcon Message Host]] | `<falcon-angular-message-host>` | Container for app-level toasts/notifications |

### Display

| UI pattern | Falcon component | Angular wrapper | When |
|---|---|---|---|
| **Status chip / state pill** | [[Falcon Status Badge]] | `<falcon-angular-status-badge>` | `severity="active\|disabled\|invited\|deleted\|warning\|info\|success"` — NEVER inline `bg-falcon-X-100 text-falcon-X-700` |
| **Count badge / number bubble** | [[Falcon Badge]] | `<falcon-angular-badge>` | Numeric indicator (notification counter, etc.) |
| **Tag / label chip** | [[Falcon Tag]] | `<falcon-angular-tag>` | Static label chip |
| **Avatar** | [[Falcon Avatar]] | `<falcon-angular-avatar>` | Photo or initials chip — img-load-error fallback pending P1-29 |
| **Icon** | [[Falcon Icon]] | `<falcon-angular-icon>` | Use icon NAME, not class string — auto-Iconify routing pending P1-36 |
| **Empty state** | [[Falcon Empty State]] | `<falcon-angular-empty-state>` | "No results" panels — has icon/title/description/actions slots |
| **Card / panel container** | [[Falcon Card]] | `<falcon-angular-card>` | Box with header/footer slots — `interactive`/`selected` pending P1-20 |

### Hierarchy / navigation

| UI pattern | Falcon component | Angular wrapper | When |
|---|---|---|---|
| **Tree view** (generic) | [[Falcon Tree]] | `<falcon-angular-tree>` | Generic tree (no per-row slot today — P0-06 gap) |
| **Org-hierarchy tree rail** | [[Falcon Tree Panel]] | `<falcon-tree-panel>` (legacy bespoke) | The canonical rail used in Organization Hierarchy page — Shadow companion pending P1-15 |
| **Org-hierarchy custom tree (Tailwind)** | [[Falcon Organization Hierarchy Tree TW]] | (Light-DOM only) | Specialty bespoke tree — wrapping pending P1-15 |

### Upload

| UI pattern | Falcon component | Angular wrapper | When |
|---|---|---|---|
| **Photo / profile pic uploader** | [[Falcon Single Uploader]] | `<falcon-angular-single-uploader>` | New default for photo uploads — DO NOT use legacy `<falcon-photo-uploader>` (P1-10 migration) |
| **General file uploader** | [[Falcon Uploader]] | `<falcon-angular-uploader>` | Multi-file uploader — native validation pending P0-13 |

### Loading / feedback

| UI pattern | Falcon component | Angular wrapper | When |
|---|---|---|---|
| **Loader / spinner / inline progress** | (provideFalconLoader) | Use `provideFalconLoader` global default + `app.config.ts` override | Inline centered loader (z-2000) is now the global default per [Memory: project_falcon_loader_inline_config_2026_05_19] |
| **Skeleton placeholder** | (registry-driven) | Locked to Loader Studio registry per [Memory: project_signalr_realtime_loader_skeleton_handoff_2026_05_19] | Use registry config; don't author one-off skeletons |
| **Form field validation message** | (Form field auto-render) | `errorMessage` / `errorText` prop on form wrappers | Errors render below the field automatically |

### Specialty / future

| UI pattern | Falcon component | Notes |
|---|---|---|
| **Form field wrapper (label + input + error)** | [[Falcon Form Field]] | Legacy bespoke — promotion to Falcon UI core pending P1-51 |
| **OTP send + verify** | [[Falcon OTP Send Dialog]] | Built atop dialog + OTP |
| **Send-credentials popup** | [[Send Credentials Popup]] | Legacy bespoke — replacement via popup `variant="custom"` pending P1-43 |

## 3. Recognition heuristics — how to actually decide

When you see a UI region, walk this short checklist top-to-bottom. The first match wins.

1. **Is it tabular (rows + columns of data)?** → `<falcon-angular-data-table>` (always — never a raw `<table>`)
2. **Is it a single form control?** → match the input type column above
3. **Is it a list of options that the user picks from?** → dropdown / multi-select / combobox / checkbox-group / radio-group
4. **Is it overlaid on top of the page (modal/drawer/menu/tooltip)?** → match the overlay column
5. **Is it a chip/pill showing a state?** → status-badge (with severity), tag (static label), or badge (count)
6. **Is it a button-shaped clickable thing?** → `<falcon-angular-button>` with the right variant
7. **Is it a "no results" / "nothing here yet" panel?** → `<falcon-angular-empty-state>`
8. **Is it the entire page wrapper or a card section?** → `<falcon-angular-card>` (for cards) or the page-shell recipe in [[Falcon Organization Hierarchy Visual Standard]]
9. **Is it a tree-of-rows?** → `<falcon-angular-tree>` (or `<falcon-tree-panel>` for the canonical org-hierarchy rail)
10. **Is it none of the above?** → Re-read this list. Then check [[Falcon Component Capability Matrix]] for adjacent capabilities. THEN consider documenting a gap in [[Falcon Component Gap Registry]]. **Last resort:** propose a new component (requires Ammar approval).

## 4. Source-cited capability anchor

Capability data verified against [`Brain Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md`](../../Brain%20Outputs/understanding/frontend/FALCON_COMPONENT_CAPABILITY_MATRIX.md) — 60 components × 15 capabilities. Read that file for the full Dual/CVA/RFm/ngM/Slt/POp/Lzy/Pag/Kbd/A11/Tok/Drk/RTL/Prd/Tst matrix.

Upgrade backlog data from [`Brain Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md`](../../Brain%20Outputs/understanding/frontend/COMPONENT_UPGRADE_BACKLOG.md) — 124-item P0-P3 prioritized list. Cross-referenced in [[Falcon Component Gap Registry]].

## 5. Wrong patterns to avoid

- ❌ `<table>` / `<tr>` / `<td>` raw HTML when data is tabular → use `<falcon-angular-data-table>`
- ❌ `<button>` styled with `bg-falcon-teal-700 text-white px-4 py-2` → use `<falcon-angular-button variant="primary">`
- ❌ `<select>` raw HTML → use `<falcon-angular-dropdown>`
- ❌ `<input type="text">` raw HTML in forms → use `<falcon-angular-input>` (CVA-bound)
- ❌ `<div class="bg-falcon-green-100 text-falcon-green-700 rounded-full px-2 py-1">Active</div>` → use `<falcon-angular-status-badge severity="active">`
- ❌ Custom modal scaffold with backdrop + ARIA boilerplate → use `<falcon-angular-popup>` (or compose `<falcon-angular-dialog>`)
- ❌ Per-page CSS for `.no-results { … }` → use `<falcon-angular-empty-state>`
- ❌ Inline `style="background: #..."` for anything that has a token

## 6. Angular-first notes

- All Angular wrappers come from `libs/falcon-ui-core/src/angular-wrapper/components/`
- Most expose `[(ngModel)]` AND reactive-forms via CVA — verify per-component via [[Falcon Component Capability Matrix]]
- 4 components have CVA gaps (calendar/date-picker/search-input/grid-input — P1-04)
- The Stencil layer (`falcon-X` and `falcon-X-tw`) is the underlying primitive — never used directly in Angular apps
- React/Vue wrappers are future placeholders (per [[Tailwind Multi-Framework Strategy]]) — no current Angular task should branch on framework

## 7. Future-agent instructions

- **Run this playbook BEFORE writing any new page or component.** Open the screenshot/design, walk §2 row-by-row, and record the mapping.
- **If a pattern doesn't map cleanly:** check [[Falcon Component Capability Matrix]] for adjacent capabilities (e.g., "data table with custom cell" → Strategy E via `ng-template`).
- **If still no match:** log it in [[Falcon Component Gap Registry]] BEFORE you build anything bespoke.
- **NEVER skip steps 1-9 of §3.** The mapping is the work — building is just typing afterwards.

## See also

- [[Falcon Page Assembly Playbook]] — assemble the matched components into a full page
- [[Falcon Component Selection Decision Tree]] — reuse vs extend vs create
- [[Falcon Component Capability Matrix]] — 9-column quick-pick table
- [[Falcon Screenshot To Component Mapping Guide]] — 6-step process for designs/screenshots
- [[Falcon Component Gap Registry]] — track missing capabilities
- [[Falcon New Page Implementation Checklist]] — pre-merge checklist
- [[Falcon Light Mode Visual Baseline]] · [[Falcon Organization Hierarchy Visual Standard]] · [[Falcon Do Not Change Visual Rules]]
- [[FALCON_COMPONENT_INDEX]] · [[COMPONENT_INDEX]]

## Tags

#type/playbook #layer/frontend #cluster/component-recognition #priority/critical

## Hubs

- [[60-Components/Falcon Component Recognition Playbook|Falcon Component Recognition Playbook]] · [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
