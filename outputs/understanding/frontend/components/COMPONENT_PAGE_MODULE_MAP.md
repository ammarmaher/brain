*** Falcon Component Knowledge Base — Phase 2 ***
# COMPONENT_PAGE_MODULE_MAP.md — Component ↔ Page ↔ Barrel ↔ Backend Module

> The cross-cutting link graph for the Falcon component knowledge base (Plan §2 "Cross-cutting B").
> Answers: *what uses this component · what breaks if I change it · what backend owns its data.*
> Author: Ammar Web-Platform-UI · Date: 2026-05-18 · READ-ONLY build (no source touched).

## Sources & source-prefix legend

Every fact below is prefixed with its origin:

- `[CODE]` — verified against the real source: barrel `libs/falcon-ui-core/src/angular-wrapper/index.ts` + `.../components/` folder listing.
- `[BRAIN-OUT]` — read from `Brain Outputs/understanding/pages/<page>/09-COMPONENTS.md` (or `COMPONENT_MAPPING.md` for organization-hierarchy), `08-BACKEND_API.md`, and per-component `INTEGRATION_VALIDATION.md`.
- `[INFERRED]` — my own reasoning; **honestly flagged** so it can be sanity-checked.

### Important data-quality notes (read before trusting the tables)

1. **Page docs use *alias* component names.** `09-COMPONENTS.md` / `COMPONENT_MAPPING.md` mention components by selector aliases — `falcon-angular-data-table`, `falcon-data-table`, `falcon-table-tw`, `falcon-custom-table-footer` all resolve to the **`falcon-data-table` / `falcon-table` dossier pair**; `falcon-multiselect` → `falcon-multi-select`; `falcon-toggle` → `falcon-switch`; `falcon-svg-icon` → `falcon-icon`; `falcon-organization-hierarchy-tree` / `falcon-tree-panel` / `falcon-org-chart` → `falcon-organization-hierarchy-tree-tw` + `falcon-tree-panel` + `falcon-tree`. I normalise to the **62 dossier folder names** throughout. `[INFERRED]` for every alias resolution.
2. **Some names in page docs are NOT library components** — `falcon-page-header`, `falcon-section-header`, `falcon-info-section`, `falcon-validation-host`, `falcon-password-strength`, `falcon-whatsapp-preview`, `falcon-stat-card`, `falcon-divider`, `falcon-progress-bar`, `falcon-alert`, `falcon-radio-card`, `falcon-finish-alert-dialog`, `falcon-org-info-panel`, `falcon-data-table-cell`. These are **app-level components** (in `apps/*`) or **non-existent / planned**. They are tracked in **Section D** as gaps, not in A/B/C.
3. **`organization-hierarchy/API_RULES.md`** only surfaces `identity` by keyword grep, but the page demonstrably performs node CRUD (Commerce), wallet reads (Charging) and service/comm-channel reads (Provisioning) per `[MEMORY]` Wave-14/15/17 entries. I therefore mark it **Commerce + Identity + Charging + Provisioning** with the non-Identity three flagged `[INFERRED]`.
4. **Backend-module column for every component** is lifted verbatim-in-summary from that component's `INTEGRATION_VALIDATION.md` "Owning backend module(s)" section `[BRAIN-OUT]`.

---

# Section A — Page → Components

For each of the 14 page folders: the Falcon library components it uses (normalised to dossier names) and the backend module(s) it talks to.

### A1. add-contract `[BRAIN-OUT] 09-COMPONENTS.md + 08-BACKEND_API.md`
- **Components:** falcon-button · falcon-calendar · falcon-input · falcon-input-number · falcon-select · falcon-stepper · falcon-icon `[INFERRED falcon-svg-icon→falcon-icon]`
- **Backend module(s):** Commerce
- **App-level (Section D):** falcon-validation-host

### A2. change-password `[BRAIN-OUT]`
- **Components:** falcon-button · falcon-password
- **Backend module(s):** Identity
- **App-level (Section D):** falcon-password-strength

### A3. contact-groups-list `[BRAIN-OUT]`
- **Components:** falcon-data-table `[alias falcon-angular-data-table]` · falcon-button · falcon-confirm-dialog · falcon-empty-state · falcon-input · falcon-menu · falcon-multi-select `[alias falcon-multiselect]` · falcon-organization-hierarchy-tree-tw `[alias falcon-organization-hierarchy-tree]` · falcon-tabs
- **Backend module(s):** Commerce + Identity
- **App-level (Section D):** falcon-info-section · falcon-page-header

### A4. contracts-list `[BRAIN-OUT]`
- **Components:** falcon-data-table `[alias]` · falcon-button · falcon-calendar · falcon-empty-state · falcon-menu · falcon-organization-hierarchy-tree-tw `[alias]` · falcon-tag · falcon-tree
- **Backend module(s):** Charging + Commerce
- **App-level (Section D):** falcon-page-header · falcon-section-header

### A5. create-contact-group `[BRAIN-OUT]`
- **Components:** falcon-data-table `[alias]` · falcon-button · falcon-input · falcon-multi-select `[alias]` · falcon-radio-group · falcon-stepper · falcon-switch `[alias falcon-toggle]` · falcon-uploader
- **Backend module(s):** Identity (per 08-BACKEND_API.md; `[INFERRED]` Commerce likely also for contact-group persistence)
- **App-level (Section D):** falcon-alert · falcon-progress-bar

### A6. create-template-whatsapp `[BRAIN-OUT]`
- **Components:** falcon-button · falcon-input · falcon-radio · falcon-select · falcon-stepper · falcon-textarea · falcon-uploader
- **Backend module(s):** **none confirmed** — `08-BACKEND_API.md` says the Templates endpoint is MISSING (GAP-T-001); routes *would* go to a Templates Service via System/Core Gateway `[BRAIN-OUT]`. `[INFERRED]` Commerce-adjacent.
- **App-level (Section D):** falcon-whatsapp-preview

### A7. edit-contract `[BRAIN-OUT]`
- **Components:** falcon-calendar · falcon-input · falcon-input-number · falcon-tabs
- **Backend module(s):** Commerce
- **App-level (Section D):** —

### A8. edit-user `[BRAIN-OUT]`
- **Components:** falcon-button · falcon-confirm-dialog · falcon-dialog · falcon-email-field · falcon-input · falcon-mobile-number · falcon-otp · falcon-select · falcon-tabs · falcon-uploader
- **Backend module(s):** Commerce + Identity
- **App-level (Section D):** falcon-divider · ("falcon-neutral-"/"falcon-ui-core" are token/lib-name false positives, ignored)

### A9. forgot-password `[BRAIN-OUT]`
- **Components:** falcon-input · falcon-mobile-number · falcon-otp · falcon-password
- **Backend module(s):** Identity
- **App-level (Section D):** —

### A10. login `[BRAIN-OUT]`
- **Components:** falcon-button · falcon-input · falcon-otp · falcon-password
- **Backend module(s):** Identity
- **App-level (Section D):** —

### A11. my-profile `[BRAIN-OUT]`
- **Components:** falcon-button · falcon-dialog · falcon-email-field · falcon-input · falcon-mobile-number · falcon-uploader
- **Backend module(s):** Identity
- **App-level (Section D):** falcon-page-header

### A12. organization-hierarchy `[BRAIN-OUT] COMPONENT_MAPPING.md + [MEMORY] Wave-14/15/17`
- **Components:** falcon-calendar · falcon-confirm-dialog `[alias falcon-angular-confirm-dialog]` · falcon-data-table `[aliases falcon-angular-data-table / falcon-table-tw / falcon-custom-table-footer]` · falcon-dropdown `[alias falcon-angular-dropdown]` · falcon-empty-state `[alias falcon-angular-empty-data]` · falcon-input · falcon-input-number · falcon-menu `[aliases falcon-menu / falcon-menu-tw]` · falcon-otp · falcon-paginator `[aliases falcon-angular-paginator / falcon-paginator-tw]` · falcon-radio · falcon-single-uploader · falcon-status-badge `[alias falcon-status]` · falcon-stepper · falcon-switch · falcon-tabs `[alias falcon-tabs-tw]` · falcon-tag · falcon-photo-uploader · falcon-tree-panel · falcon-organization-hierarchy-tree-tw `[INFERRED — tree-panel renders the org tree]`
- **Add Client wizard sub-folder additionally uses:** falcon-button · falcon-dialog · falcon-form-field · falcon-multi-select · falcon-password · falcon-phone-field · falcon-popup · falcon-radio-group · falcon-textarea · falcon-icon · falcon-stepper-legacy · send-credentials-popup `[alias falcon-send-credentials-popup]`
- **Backend module(s):** Identity (confirmed) + Commerce + Charging + Provisioning (`[INFERRED]` — node CRUD = Commerce; wallets = Charging; comm-channels/apps services = Provisioning, per `[MEMORY]` Wave entries)
- **App-level (Section D):** falcon-org-info-panel · falcon-org-chart · falcon-radio-card · falcon-finish-alert-dialog · falcon-data-table-cell · falcon-step

### A13. templates-list `[BRAIN-OUT]`
- **Components:** falcon-data-table `[alias]` · falcon-button · falcon-dialog · falcon-input · falcon-menu · falcon-select · falcon-tag
- **Backend module(s):** **none confirmed** in 08-BACKEND_API.md — same Templates-Service gap as A6. `[INFERRED]` Commerce-adjacent.
- **App-level (Section D):** falcon-page-header

### A14. wallets-and-balance-management `[BRAIN-OUT]`
- **Components:** falcon-data-table `[alias]` · falcon-button · falcon-drawer · falcon-input · falcon-input-number · falcon-organization-hierarchy-tree-tw `[alias]` · falcon-select
- **Backend module(s):** Charging + Commerce + Identity
- **App-level (Section D):** falcon-divider · falcon-page-header · falcon-stat-card

---

# Section B — Component → Pages

All 62 dossier components. Columns: **Pages consuming it** (from Section A; "—" = no production consumer) · **Barrel import path** · **Owning backend module** (from its own `INTEGRATION_VALIDATION.md` `[BRAIN-OUT]`).

Barrel root: `@falcon/ui-core/angular` → `libs/falcon-ui-core/src/angular-wrapper/index.ts`. Every component below is re-exported there unless noted. `[CODE]` confirmed against `index.ts`.

| Component | Consuming pages | Barrel import path | Owning backend module |
|---|---|---|---|
| falcon-accordion | — *(no production consumer)* | `@falcon/ui-core/angular` → `./components/falcon-accordion` `[CODE]` | None — presentational |
| falcon-alert-dialog | — *(no production page; used by funding/discard flows)* | `./components/falcon-alert-dialog` `[CODE]` | None — presentational (gates Charging/Commerce decisions) |
| falcon-avatar | — *(no production consumer)* | `./components/falcon-avatar` `[CODE]` | None — presentational |
| falcon-badge | — *(no production consumer)* | `./components/falcon-badge` `[CODE]` | None — presentational |
| falcon-button | add-contract · change-password · contact-groups-list · contracts-list · create-contact-group · create-template-whatsapp · edit-user · login · my-profile · templates-list · wallets · organization-hierarchy(Add Client) | `./components/falcon-button` `[CODE]` | None — presentational |
| falcon-calendar | add-contract · contracts-list · edit-contract · organization-hierarchy | `./components/falcon-calendar` `[CODE]` | None — presentational |
| falcon-calendar-legacy | — *(legacy, no production consumer)* | **not in barrel** `[CODE]` — legacy, superseded by falcon-calendar | None — presentational |
| falcon-card | — *(no production consumer)* | `./components/falcon-card` `[CODE]` | None — presentational |
| falcon-checkbox | — *(no production consumer)* | `./components/falcon-checkbox` `[CODE]` | None — presentational |
| falcon-checkbox-group | — *(no production consumer)* | `./components/falcon-checkbox-group` `[CODE]` | None — presentational |
| falcon-combobox | — *(no production consumer)* | `./components/falcon-combobox` `[CODE]` | None — presentational |
| falcon-confirm-dialog | contact-groups-list · edit-user · organization-hierarchy | `./components/falcon-confirm-dialog` `[CODE]` | None — presentational |
| falcon-data-table | contact-groups-list · contracts-list · create-contact-group · edit-user `[INFERRED]` · templates-list · wallets · organization-hierarchy | `./components/falcon-data-table` `[CODE]` | None — presentational; collections owned per-consumer |
| falcon-date-picker | — *(no production consumer)* | `./components/falcon-date-picker` `[CODE]` | None — presentational |
| falcon-dialog | edit-user · my-profile · templates-list · organization-hierarchy(Add Client) | `./components/falcon-dialog` `[CODE]` | None — presentational |
| falcon-drawer | wallets | `./components/falcon-drawer` `[CODE]` | None — presentational |
| falcon-dropdown | organization-hierarchy | `./components/falcon-dropdown` `[CODE]` | None — presentational; option list owned per-consumer |
| falcon-email-field | edit-user · my-profile | `./components/falcon-email-field` `[CODE]` | None directly — presentational (email = Identity attribute) |
| falcon-empty-state | contact-groups-list · contracts-list · organization-hierarchy `[alias falcon-angular-empty-data]` | `./components/falcon-empty-state` `[CODE]` | None — presentational |
| falcon-filter-panel | — *(no production consumer)* | `./components/falcon-filter-panel` `[CODE]` | None — presentational |
| falcon-form-field | organization-hierarchy(Add Client) | `./components/falcon-form-field` *(re-exported within sibling dialog modules)* `[INFERRED — not a standalone line in index.ts]` | None — presentational |
| falcon-grid-input | — *(no production consumer)* | `./components/falcon-grid-input` `[CODE]` | None — presentational |
| falcon-icon | add-contract `[alias falcon-svg-icon]` · organization-hierarchy(Add Client) | `./components/falcon-icon` `[CODE]` | None — presentational |
| falcon-input | add-contract · contact-groups-list · create-contact-group · create-template-whatsapp · edit-contract · edit-user · forgot-password · login · my-profile · templates-list · wallets · organization-hierarchy | `./components/falcon-input` `[CODE]` | None — presentational |
| falcon-input-number | add-contract · edit-contract · wallets · organization-hierarchy | `./components/falcon-input-number` `[CODE]` | None — presentational |
| falcon-insufficient-balance-dialog | — *(no production page; funding flow)* | `./components/falcon-insufficient-balance-dialog` `[CODE]` | None at component level — gates **Charging** funding decision |
| falcon-menu | contact-groups-list · contracts-list · templates-list · organization-hierarchy | `./components/falcon-menu` `[CODE]` | None directly — presentational |
| falcon-message-host | — *(infra plumbing, no page)* | `./components/falcon-message-service` `[CODE]` | None — presentational plumbing |
| falcon-mobile-number | edit-user · forgot-password · my-profile | **not a distinct barrel line** — see falcon-phone-field `[INFERRED — page docs call it falcon-mobile-number; library exports falcon-phone-field]` | Identity — captured phone is a user/contact attribute |
| falcon-multi-select | contact-groups-list · create-contact-group · organization-hierarchy(Add Client) | `./components/falcon-multi-select` `[CODE]` | None — presentational; option list owned per-consumer |
| falcon-multiselect-legacy | — *(legacy stub, no consumer)* | **not in barrel** `[CODE]` — historical stub | None — nothing to integrate |
| falcon-notification | — *(no production consumer)* | `./components/falcon-notification` `[CODE]` | None — presentational |
| falcon-organization-hierarchy-tree-tw | contact-groups-list · contracts-list · wallets · organization-hierarchy `[INFERRED]` | `@falcon/ui-core/angular` → types via `../components/falcon-organization-hierarchy-tree-tw/...types` `[CODE]` | None — presentational; hierarchy owned by **Commerce** |
| falcon-otp | edit-user · forgot-password · login · organization-hierarchy | `./components/falcon-otp` `[CODE]` | **Identity** — owns OTP issuance/verify/expiry/resend |
| falcon-otp-send-dialog | — *(no production page; OTP delivery flow)* | `./components/falcon-otp-send-dialog` `[CODE]` | **Identity** — OTP issuance/delivery/verify |
| falcon-paginator | organization-hierarchy | `./components/falcon-paginator` `[CODE]` | None — presentational |
| falcon-password | change-password · forgot-password · login · organization-hierarchy(Add Client) | `./components/falcon-password` `[CODE]` | **Identity** — password storage/policy (Zitadel-delegated) |
| falcon-phone-field | edit-user `[INFERRED]` · forgot-password `[INFERRED]` · my-profile `[INFERRED]` · organization-hierarchy(Add Client) | `./components/falcon-phone-field` `[CODE]` | None — presentational (value consumed by Identity) |
| falcon-photo-uploader | organization-hierarchy | **not a distinct barrel line** — app/skeleton-level wrapper around falcon-single-uploader `[INFERRED]` | None — presentational + file-decoding |
| falcon-popup | organization-hierarchy(Add Client) | `./components/falcon-popup` `[CODE]` | None — presentational |
| falcon-radio | create-template-whatsapp · organization-hierarchy | `./components/falcon-radio` `[CODE]` | None — presentational |
| falcon-radio-group | create-contact-group · organization-hierarchy(Add Client) | `./components/falcon-radio-group` `[CODE]` | None — presentational |
| falcon-search-input | — *(no production consumer)* | `./components/falcon-search-input` `[CODE]` | None — presentational, search-only |
| falcon-select | add-contract · create-template-whatsapp · edit-user · templates-list · wallets | `./components/falcon-select` `[CODE]` | None — presentational; option list owned per-consumer |
| falcon-single-uploader | organization-hierarchy | `./components/falcon-single-uploader` `[CODE]` | None — presentational |
| falcon-status-badge | organization-hierarchy `[alias falcon-status]` | `./components/falcon-status-badge` `[CODE]` | None — presentational |
| falcon-stepper | add-contract · create-contact-group · create-template-whatsapp · organization-hierarchy | `./components/falcon-stepper` `[CODE]` | None — presentational |
| falcon-stepper-legacy | organization-hierarchy(Add Client) `[BRAIN-OUT — referenced in Add Client docs]` | **not in barrel** `[CODE]` — legacy, superseded by falcon-stepper | None — presentational |
| falcon-switch | create-contact-group `[alias falcon-toggle]` · organization-hierarchy | `./components/falcon-switch` `[CODE]` | None — presentational |
| falcon-table | contact-groups-list · contracts-list · create-contact-group · templates-list · wallets · organization-hierarchy `[INFERRED — substrate of falcon-data-table]` | `./components/falcon-table` `[CODE]` | None — presentational (substrate) |
| falcon-tabs | contact-groups-list · edit-contract · edit-user · organization-hierarchy | `./components/falcon-tabs` `[CODE]` | None — presentational |
| falcon-tag | contracts-list · templates-list · organization-hierarchy | `./components/falcon-tag` `[CODE]` | None — presentational |
| falcon-textarea | create-template-whatsapp · organization-hierarchy(Add Client) | `./components/falcon-textarea` `[CODE]` | None — presentational |
| falcon-toast | — *(infra; no production page)* | `./components/falcon-toast` `[CODE]` | None — presentational |
| falcon-tooltip | — *(no production consumer; used ad-hoc)* | `./components/falcon-tooltip` `[CODE]` | None — presentational |
| falcon-tree | contracts-list · organization-hierarchy `[INFERRED — substrate of tree-panel]` | `./components/falcon-tree` `[CODE]` | None — presentational |
| falcon-tree-panel | organization-hierarchy | **not a distinct barrel line** — composes falcon-tree `[INFERRED]` | None — presentational; tree data = **Commerce** |
| falcon-tree-table | — *(no production consumer)* | `./components/falcon-tree-table` `[CODE]` | None — presentational |
| falcon-uploader | create-contact-group · create-template-whatsapp · edit-user · my-profile | `./components/falcon-uploader` `[CODE]` | None — presentational |
| falcon-wizard | — *(no production consumer — pages use falcon-stepper)* | `./components/falcon-wizard` `[CODE]` | None — presentational |
| send-credentials-popup | organization-hierarchy(Add Client) `[alias falcon-send-credentials-popup]` | `./components/falcon-sending-credentials-dialog` `[CODE]` | None — presentational (credentials issued by **Identity**) |

---

# Section C — Component → Backend Module (grouped)

Per the `INTEGRATION_VALIDATION.md` "Owning backend module(s)" sections `[BRAIN-OUT]`. The headline finding: **the Falcon component library is almost entirely presentational** — components own no data; the *consuming app-wrapper* binds the backend.

### C1. Commerce
*No component dossier names Commerce as its **own** module.* Components that **render Commerce-owned data via their consumer**: falcon-organization-hierarchy-tree-tw / falcon-tree-panel (org hierarchy), falcon-data-table / falcon-table (node lists, contracts), falcon-calendar / falcon-calendar-legacy (effective-date = Commerce pricing rules). `[BRAIN-OUT]` — ownership is at the *consumer*, not the component.

### C2. Charging
*No component owns Charging.* Components **gating Charging decisions**: falcon-insufficient-balance-dialog (funding / do-payment) and falcon-alert-dialog (insufficient-balance decision). `[BRAIN-OUT]` `falcon-insufficient-balance-dialog/INTEGRATION_VALIDATION.md`, `falcon-alert-dialog/SPEC.md`.

### C3. Provisioning
*No component dossier names Provisioning as its owning module.* `[BRAIN-OUT]` — no `INTEGRATION_VALIDATION.md` references Provisioning ownership. The organization-hierarchy comm-channels/apps tabs touch Provisioning `[INFERRED — [MEMORY] Wave-17]` but do so through app-level state slices, not library components.

### C4. Identity
The **only** module any component claims to own:
- **falcon-otp** — Identity owns OTP issuance, verification, expiry, resend. `[BRAIN-OUT]`
- **falcon-otp-send-dialog** — Identity owns OTP issuance/delivery (email/SMS)/verify/resend/expiry. `[BRAIN-OUT]`
- **falcon-password** — Identity owns password storage (Zitadel-delegated) + password policy. `[BRAIN-OUT]`
- **falcon-mobile-number** — Identity (the captured phone is a user/contact attribute; legacy forgot-password SMS-OTP). `[BRAIN-OUT]`

### C5. None — presentational (the other 58 components)
Every remaining dossier explicitly states *"None — the component is presentational."* `[BRAIN-OUT]`: accordion, alert-dialog, avatar, badge, button, calendar, calendar-legacy, card, checkbox, checkbox-group, combobox, confirm-dialog, data-table, date-picker, dialog, drawer, dropdown, email-field, empty-state, filter-panel, form-field, grid-input, icon, input, input-number, insufficient-balance-dialog, menu, message-host, multi-select, multiselect-legacy, notification, organization-hierarchy-tree-tw, paginator, phone-field, photo-uploader, popup, radio, radio-group, search-input, select, single-uploader, status-badge, stepper, stepper-legacy, switch, table, tabs, tag, textarea, toast, tooltip, tree, tree-panel, tree-table, uploader, wizard, send-credentials-popup. *(insufficient-balance-dialog and alert-dialog appear here AND in C2 — the component is presentational but gates a Charging decision.)*

**Doctrine confirmed `[INFERRED from the 62 dossiers]`:** Falcon UI components are pure presentation. Backend ownership lives in the **app-level consumer** (state slice / API service in `apps/*`). To answer "what backend owns this data" you must look at the *page*, not the component — which is exactly why Section A pairs each page with its modules.

---

# Section D — Orphans & Gaps

### D1. Components with NO production consumer (orphans)
17 of 62 dossier components are not used by any of the 14 documented pages `[BRAIN-OUT — absent from every 09-COMPONENTS.md / COMPONENT_MAPPING.md]`:

| Component | Note |
|---|---|
| falcon-accordion | In barrel, never consumed by a documented page. |
| falcon-avatar | In barrel, no documented consumer. |
| falcon-badge | In barrel, no documented consumer (distinct from falcon-status-badge, which *is* used). |
| falcon-card | In barrel, no documented consumer. |
| falcon-checkbox | In barrel, no documented consumer. |
| falcon-checkbox-group | In barrel, no documented consumer. |
| falcon-combobox | In barrel, no documented consumer. |
| falcon-date-picker | In barrel, no documented consumer — pages use falcon-calendar instead. |
| falcon-filter-panel | In barrel, no documented consumer. |
| falcon-grid-input | In barrel, no documented consumer. |
| falcon-notification | In barrel, no documented consumer. |
| falcon-search-input | In barrel, no documented consumer. |
| falcon-tree-table | In barrel, no documented consumer. |
| falcon-tooltip | In barrel; used ad-hoc, no documented page binds it. |
| falcon-wizard | In barrel, but **all wizard pages use falcon-stepper instead** — likely superseded. `[INFERRED]` |
| falcon-calendar-legacy | Legacy, **not in barrel**, superseded by falcon-calendar. Dossier kept for history. |
| falcon-multiselect-legacy | Legacy stub, **not in barrel**, superseded by falcon-multi-select. |

Plus **infra-only** (no page, but not true orphans): falcon-toast, falcon-message-host (toast/message plumbing), falcon-alert-dialog, falcon-otp-send-dialog, falcon-insufficient-balance-dialog (dialog flows triggered programmatically, not page-mounted).

### D2. Page docs referencing a component that is NOT a library component
These names appear in `09-COMPONENTS.md` / `COMPONENT_MAPPING.md` but have **no dossier and no barrel export** — they are app-level components, tokens, or planned/missing `[CODE — absent from index.ts; [BRAIN-OUT] — named in page docs]`:

| Name in page doc | Page(s) | Verdict |
|---|---|---|
| falcon-page-header | contact-groups-list, contracts-list, my-profile, templates-list, wallets | App-level component (`apps/*`), not in UI library. |
| falcon-section-header | contracts-list | App-level component. |
| falcon-info-section | contact-groups-list | App-level component. |
| falcon-validation-host | add-contract | App/infra construct (validation registry host), not a UI component. |
| falcon-password-strength | change-password | App-level component (likely a strength-meter under falcon-password). |
| falcon-whatsapp-preview | create-template-whatsapp | App-level component (feature-specific preview). |
| falcon-stat-card | wallets | App-level component. |
| falcon-divider | edit-user, wallets | Likely a Tailwind/CSS divider or app component — not in barrel. |
| falcon-progress-bar | create-contact-group | Not in barrel — app-level or planned. |
| falcon-alert | create-contact-group | Not in barrel as `falcon-alert` (closest is falcon-alert-dialog) — app-level inline alert. `[INFERRED]` |
| falcon-radio-card | organization-hierarchy(Add Client) | App-level composite (radio + card), not a library component. |
| falcon-finish-alert-dialog | organization-hierarchy(Add Client) | App-level wizard-finish dialog. |
| falcon-org-info-panel | organization-hierarchy | App-level component (`apps/admin-console/.../falcon-org-info-panel`) per `[MEMORY]` Wave-15. |
| falcon-org-chart | organization-hierarchy(Add Client) | App-level component. |
| falcon-data-table-cell | organization-hierarchy(Add Client) | Sub-part of falcon-data-table, not separately exported. |
| falcon-step | organization-hierarchy(Add Client) | Sub-element of falcon-stepper, not separately exported. |

**No page references a component that *used to exist and was deleted*** — all unknown names resolve to app-level components or planned items, not stale library references. `[INFERRED]`

### D3. Barrel-only components with no dossier
The barrel `index.ts` exports a few items that have **no dossier folder** (out of scope for the 62-component KB, recorded for completeness `[CODE]`): `falcon-error-dialog-host`, `falcon-confirm-dialog-host`, `falcon-completion-success-dialog`, `falcon-empty-data`, `falcon-custom-table-footer`, `falcon-loader-inline`, `falcon-loader-overlay`, `falcon-message-service`. These are dialog-host / utility wrappers; `falcon-empty-data` and `falcon-custom-table-footer` are effectively covered by the falcon-empty-state and falcon-data-table dossiers respectively.

### D4. Module-coverage gaps
- **create-template-whatsapp** and **templates-list** have **no confirmed backend module** — `08-BACKEND_API.md` flags the Templates Service endpoint as MISSING (GAP-T-001). Any component bound there is bound to a non-existent backend. `[BRAIN-OUT]`
- **organization-hierarchy/API_RULES.md** under-documents its modules (only `identity` greppable) despite the page demonstrably hitting Commerce/Charging/Provisioning — a documentation gap, flagged in note #3 above. `[INFERRED]`
- **No component dossier owns Provisioning** even though the org-hierarchy comm-channels/apps tabs are Provisioning-backed — confirming the doctrine that module ownership is an app-layer, not component-layer, fact. `[INFERRED]`

---

*Phase 2 deliverable · `COMPONENT_PAGE_MODULE_MAP.md` · Ammar Web-Platform-UI · 2026-05-18 · every verified feature (Add Client/User/Node, Edit Node, admin tabs, Organization Hierarchy) is traceable page → component → barrel → module via Sections A + B.*
