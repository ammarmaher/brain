---
name: Organization Hierarchy HTML Conversion (management-console) — ⚠️ DISK MISMATCH 2026-05-16
description: Active multi-wave port of the T2 Falcon HTML source-of-truth. Memory claims 91 files in apps/management-console/.../organization-hierarchy-page but 2026-05-16 Night Shift disk verification found management-console/src/app/features/ EMPTY (0 files). Actual org-hierarchy-page folder is in apps/admin-console. Verify disk state before resuming.
type: project
originSessionId: a0f7aabb-0f28-4ab5-a50c-b04ad1d73725
---
# Organization Hierarchy HTML Conversion — management-console

## ⚠️ DISK MISMATCH (Night Shift verification 2026-05-16)

**This memory is partially stale.** Night Shift 2026-05-16 disk-verified the following discrepancies:

| Memory claim | 2026-05-16 disk reality |
|---|---|
| `apps/management-console/.../organization-hierarchy-page/` | `apps/management-console/src/app/features/` is EMPTY (0 entries) |
| 91 files / 43 directories created | 0 files at the claimed path |
| Folder name `organization-hierarchy-page` | Closest existing folder is `apps/admin-console/src/app/features/org-hierarchy-page/` (different name, different app) |

**Possible explanations** (not yet investigated):
1. Work was on a different branch/worktree that never merged into the current tree
2. Files were lost between 2026-05-13 and 2026-05-16
3. Original memory entry was inaccurate

**Cross-reference:** memory `project_react_to_angular_org_hierarchy_page.md` describes work in `apps/admin-console/.../organization-hierarchy-page` — that may be the same effort under a different label.

**Before resuming any wave below**, verify the target files actually exist at the path each wave names. If they don't, this memory's "waves landed" status is unreliable.

See: `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\REPORT.md` for full Night Shift context.

---

## Status — 2026-05-13 (CLAIMED — see disk mismatch above)

**🟢 Build GREEN (claimed)** — last fresh hash `fcbef6de9dbc5d9f` (2026-05-13, after Waves 1+2+3+7+8).

Working tree dirty — **NOT committed, NOT pushed** per standing rule.

---

## How to resume this work in a new session

Open a new Claude Code session at `C:\Falcon` and paste this trigger:

```
continue HTML conversion of organization-hierarchy-page
```

Or alternatively:

```
resume org-hierarchy HTML conversion (read memory project_org_hierarchy_html_conversion)
```

When triggered, Claude should:
1. Read this memory file
2. Re-spin the HTML source on port 5178 if not running:
   `cd C:\Falcon\Source_of_truth_theme\HTML && python -m http.server 5178`
3. Re-open the Chrome MCP tab to `http://localhost:5178/T2%20Falcon%20Admin%20-%20Offline.html` for visual reference
4. Continue with the next deferred wave (see "Deferred waves" below)
5. Stop and ask the user before commit / push

---

## Project context

**Target feature root:**
`C:\Falcon\falcon-web-platform-ui\apps\management-console\src\app\features\organization-hierarchy-page\`

**Route:** `/management-console/organization-hierarchy-page` (registered in `apps/management-console/src/app/app.routes.ts`)

**Reference patterned after:** `apps/admin-console/.../organization-hierarchy/` (folder structure only — visual contract differs)

**HTML source of truth:** `C:\Falcon\Source_of_truth_theme\HTML\T2 Falcon Admin - Offline.html` (large bundled HTML; serve on port 5178)

**Dev ports:**
- 4200 → host-shell (where login lives)
- 4301 → management-console remote
- 5178 → HTML source of truth

**Login credentials (test, dev-only):** `AmmarSk` / `Admin@1234`.
**Claude cannot type the password** (security policy bans password entry even with explicit permission). User must type the password and click Login. Claude resumes after the post-login route lands.

**Files: 91 created across 43 directories. 0 SCSS files (Tailwind-only rule enforced).**

---

## Waves landed (DO NOT re-do)

| Wave | What changed | Files |
|---|---|---|
| **1** | View-toggle relabeled `List \| Tree` (state keys 'tree'/'chart' kept). | `services/hierarchy-page-state.service.ts` (STRUCTURE_OPTIONS labelKeys) |
| **2** | Selected-node header context-aware: when Info panel open → Add Node/Add User hide; outline `Back to users` + solid teal `Edit Info` show. | `components/organization-hierarchy-page-menu.component.html` (canEditNode=infoIsOpen wiring) + `falcon-org-node-header.component.html` (button branching) |
| **3** | Apps/CommChannels: 4-state status pill set `Active / Expired / Disable / Inactive / -----`. Mock data expanded to 8 apps + 9 channels mirroring HTML truth. | `services/mock-applications.ts` (ApplicationStatus type widened) + `applications-table.component.html` (switch on status) |
| **7** | Add Node drawer rebuilt: minimal bottom-underline input (no border/rounded), native plain Cancel link + solid teal Add button. Cleaned imports (dropped FalconAngularInput + FalconAngularButton). | `falcon-org-node-drawer.component.{ts,html}` |
| **8** | Information panel: added large avatar circle + name + "Client Picture" sublabel block above the 4-col field grid; switched bg neutral-30 → white. | `falcon-org-info-panel.component.html` |

---

## Deferred waves (PICK UP HERE)

Priority order based on user-flagged issues + visual impact:

### Wave 11 — Tree kebab flicker (USER-REPORTED) ⚠️
**Symptom:** kebab `⋮` on tree rows shows on hover but disappears when mouse moves to popup → flicker.
**Owner:** `FalconTreePanelComponent` (from `@falcon` — out of feature scope).
**Fix options:**
- (a) `::ng-deep` override at page level forcing `opacity: 1` always
- (b) Open issue against `@falcon` lib
- **Recommend:** (a) for fast win

### Wave 10 — Uploader after-upload (USER-REPORTED) ⚠️
**Symptom:** after photo upload, no `×` (delete) or `✎` (edit) icons appear on the avatar preview.
**Owner:** `FalconPhotoUploaderComponent` (from `@falcon`).
**Fix options:**
- (a) Wrap with a local component that adds the icons as absolute-positioned overlays
- (b) Fix upstream
- **Recommend:** (a) — create `html-photo-uploader-with-actions` in this feature

### Wave 4 — Settings tab view mode (LARGE REWRITE)
**HTML truth diff:**
- Edit pill in top-right (with pencil icon)
- Left: radio cards (Normal "Username, Password, OTP" / Advanced "Comply with NCA regulations…")
- Allowed IPs as chips (no × in view mode)
- Red helper text "* Restrict platform access and limit it from these IPs only"
- Right sidebar `ACCOUNT LIMITATIONS`: 3 numeric inputs with up/down arrows
**Files to touch:** `settings-tab.component.html` + `client-settings-step.component.html` (shared step in view mode)

### Wave 5 — Add User wizard chrome (LARGE REWRITE)
**HTML truth diff:**
- Top bar shows **selected node** (Aramco avatar + name), NOT Falcon brand
- Top-right: `Cancel` + (`Previous` if step >1) + `Next`/`Finish` — no Back on step 1
- Card title: "Add New User" + `step N/3` pill
- Stepper: HORIZONTAL with green checkmarked completed steps
- **Step 1 has NO password field** — 6 fields in 2 rows of 3 (FirstName/LastName/UserName, NationalID/Phone/Email)
- Step 2: 2-col with locked Active status + System Admin role default
- Last step button label: `Finish`
**Files to touch:** `add-user-wizard.component.{ts,html}`, `user-personal-step.component.{ts,html}`, `user-role-status-step.component.html`, `user-permissions-step.component.html`

### Wave 6 — Add Client wizard chrome (LARGE REWRITE)
**HTML truth diff:**
- Title: **"Create New Client"** (not "Add New Client")
- Top bar shows Falcon brand (add-client only available on root)
- **4-col grids** everywhere (not 2-col)
- Step 2 (Settings) has twin-input sidebar: `Current existing` + `Max allowed` per limit row
- Service-row table (step 3+4): 5 cols Visibility/Name/PriceType/PriceValue/Status
- Last step button label: `Save`
**Files to touch:** `add-client-wizard.component.{ts,html}` + all 5 step components + `client-service-row-table.component.html`

### Wave 9 — Tree (chart) view layout (LARGE REWRITE)
**HTML truth diff:**
- Card-based layout: white card + brand icon (left) + name + "N sub-nodes" stacked
- Falcon root card: dark teal with white text + brand icon
- Sub-node cards: colored letter chips (HR/DB/CC/etc.)
- Legend at top: `● Platform   ○ Client   ○ Sub-node`
- Right hint: "Click any node to view its details"
- Dotted-grid background
- Bottom-right toolbar: `%` chip + `+` + `−` + `fit` + `fullscreen` + `refresh`
**Files to touch:** `falcon-org-chart.component.{ts,html}`, `falcon-chart-card.component.html`, `falcon-chart-toolbar.component.html`, `falcon-org-chart.component.css` (TW only)

---

## Comprehensive delta table (HTML source-of-truth vs Angular impl)

These were documented from live Chrome MCP screenshots on 2026-05-13:

- **Tabs visibility:** root → only `Hierarchy`+`Settings`; non-root → all 4. ✅ Already correct in `state.visibleTabs()`.
- **Users table on root:** `Filter` button + `Search here` input always visible on right. ❌ Not implemented.
- **Selected-node header buttons:**
  - Root: `Add Client` (outline) + `Add User` (solid). ✅ Correct
  - Non-root list view: `Information` (ghost) + `Add Node` (outline) + `Add User` (solid). ✅ Correct
  - Non-root tree/chart view: header hidden, chart fills. ✅ Correct
  - Info-open: `Back to users` (outline) + `Edit Info` (solid). ✅ FIXED in Wave 2
- **Tree-panel header:** "T2 Falcon" + collapse arrow + `⋮` menu top-right. Verify rendered via FalconTreePanel.
- **Tree row icons:** brand icons per client (Al-Rajhi red, SNB green, Bupa blue, Aramco green circle, BMW logo); sub-nodes use 2-letter colored chips (HR yellow, DB blue, CC purple, IC/OC/CC orange, M purple, IT red).
- **Apps/CommChannels columns:** Visibility | Name | Price Type | Price Value | First Activation Date | Activation Date | Renew Date | Status | Action (9 incl. action). ✅ Correct.
- **Status pill colors:** Active green / Expired red / Disable gray / Inactive amber / null=-----. ✅ FIXED in Wave 3.
- **Information panel:** 17 fields in 4-col grid, "Account Official" section header at row 2, VAT alone on last row. ✅ Partially fixed in Wave 8 (added avatar block; section header logic simplified).
- **Add Node drawer:** right slide-in, bottom-underline input, `Cancel`+`Add` buttons. ✅ FIXED in Wave 7.

---

## How to verify after each wave

1. `cd C:\Falcon\falcon-web-platform-ui && npx nx build management-console`
2. Look for `Successfully ran target build` + new hash
3. If green: proceed; if red: read errors, fix, retry
4. User must visually verify in browser since Claude cannot log in

---

## Commit/push protocol

**Standing rule: NO commits or pushes without explicit user "commit" / "push" message.**

When the user says "commit" — proposed commit message is in `~/.claude/projects/C--Falcon/memory/active-session-log.md` or inline in latest assistant message. User edits, then says "commit it" → Claude commits. Push only after separate explicit "push".

---

## Pointers / related memory

- `project_falcon_revamp_v3_1_night_shift_results.md` — prior management-console refactor (Angular 21, zoneless)
- `project_falcon_primeng_total_removal_complete.md` — PrimeNG removal context
- `feedback_v02_theme_adopted.md` — Falcon theme tokens (used throughout this feature)
- `feedback_no_inline_styles_tokens_only.md` — tokens-only rule
- `feedback_frontend_auth_identity_service.md` — auth via Identity Service, not Zitadel directly
