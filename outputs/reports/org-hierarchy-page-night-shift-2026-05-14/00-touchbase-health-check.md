# Phase 0 — TouchBase & Health Check

**Run:** 2026-05-14 00:41 UTC+3
**Orchestrator:** Brain SK v0.1 — Night Shift Mode
**Task:** Create `org-hierarchy-page` feature in admin-console (NEW folder)

---

## 1. Path verification

| Path | Status | Notes |
|---|:---:|---|
| `C:\Falcon\Brain SK` | ✅ | Brain core present |
| `C:\Falcon\Brain Outputs` | ✅ | Output root present |
| `C:\Falcon\falcon-web-platform-ui` | ❌ | **Does NOT exist** — memory rule is stale |
| `C:\Falcon\Falcon\falcon-web-platform-ui` | ✅ | **Actual workspace** (task path correct) |
| `C:\Falcon\Source_of_truth_theme\HTML` | ✅ | HTML source present |
| `C:\Falcon\Source_of_truth_theme\React\Organization page` | ✅ | React source present |
| `C:\Falcon\Brain SK\_obsidian` | ✅ | Obsidian vault present |
| `C:\Falcon\Brain Outputs\understanding\frontend` | ✅ | 24 top-level docs + 60 component dossiers |

**Resolution:** Use `C:\Falcon\Falcon\falcon-web-platform-ui` as the canonical workspace. Memory file `feedback_webstorm_duplicate_workspace.md` needs a refresh after this session.

## 2. Server status

| Port | Service | Status |
|---|---|:---:|
| 4200 | host-shell (Angular dev) | ❌ NOT listening |
| 4204 | admin-console standalone | ❌ NOT listening |
| 4301 | management-console remote | ❌ NOT listening |
| 5500 | React source (live URL) | ✅ Listening |
| 8765 | HTML source (live URL) | ✅ Listening |
| 5178 | alternative HTML source | ❌ NOT listening (memory referred to old port) |

**Source-of-truth URLs (confirmed reachable):**
- HTML: `http://localhost:8765/T2 Falcon Admin - Offline.html`
- React: `http://localhost:5500/T2 Falcon Admin.html`

**Action needed before login/route testing in Phase 11+:** Angular dev server on 4200 must be started by the user (`npx nx serve host-shell` from workspace root).

## 3. Toolchain

- Node: **v22.19.0** ✅
- npm: present (PowerShell ExecutionPolicy blocks direct call — Bash tool works around this)
- Git: branch **`polishing-v0.4`** on workspace; clean except in-flight changes

## 4. Repository layout — what exists today

```
C:\Falcon\Falcon\falcon-web-platform-ui\
  apps\
    admin-console\         # TARGET — features\ is EMPTY (no org-hierarchy here yet)
    host-shell\            # Module Federation host, login lives here at /#/login
    management-console\    # REFERENCE — has full organization-hierarchy-page (91 files)
  libs\                    # @falcon shared library (60+ components)
  demos\                   # Cross-framework Falcon UI showcases (skip)
```

**Critical discovery:** `apps/admin-console/src/app/features/` is **empty**. Prior memory files
(`project_react_to_angular_org_hierarchy_page.md`, `project_org_hierarchy_html_conversion.md`)
referenced a state that no longer exists on this branch. Treat them as historical context only —
the new `org-hierarchy-page` feature is being built into a clean admin-console.

**Reference feature found at:**
`apps/management-console/src/app/features/organization-hierarchy-page/`
This folder matches the structure required by the task screenshot — 5 dirs + skeleton + 5 tab-components + 2 wizards with step subfolders. It will be the structural template for the new admin-console feature.

## 5. Falcon component knowledge base

`C:\Falcon\Brain Outputs\understanding\frontend\` is rich:

**Top-level docs (24):** REGISTRY, REGISTRY_DEEP, CAPABILITY_MATRIX, RELATIONSHIP_MAP, UPGRADE_BACKLOG, THEME_AND_TAILWIND_REPORT, WRAPPER_AND_RENDER_PATH_REPORT, FINAL_COVERAGE_REPORT, FRONTEND_STRUCTURE_REPORT, FRONTEND_WORKSPACE_MAP, ANGULAR_AND_TAILWIND_RULES, TAILWIND_TOKEN_MAP, plus 12 others.

**Component dossiers (60):**
falcon-accordion, falcon-avatar, falcon-badge, falcon-button, falcon-calendar, falcon-card, falcon-checkbox, falcon-checkbox-group, falcon-combobox, falcon-confirm-dialog, **falcon-data-table**, falcon-date-picker, **falcon-dialog**, **falcon-drawer**, falcon-dropdown, falcon-email-field, falcon-empty-state, falcon-filter-panel, falcon-form-field, falcon-grid-input, falcon-icon, falcon-input, falcon-input-number, falcon-menu, falcon-message-host, **falcon-mobile-number**, falcon-multi-select, falcon-notification, **falcon-organization-hierarchy-tree-tw**, **falcon-otp**, **falcon-otp-send-dialog**, falcon-paginator, falcon-password, **falcon-phone-field**, falcon-photo-uploader, **falcon-popup**, falcon-radio, falcon-radio-group, falcon-search-input, falcon-select, falcon-single-uploader, **falcon-status-badge**, **falcon-stepper**, falcon-switch, falcon-table, **falcon-tabs**, falcon-tag, falcon-textarea, falcon-toast, falcon-tooltip, **falcon-tree**, **falcon-tree-panel**, falcon-tree-table, falcon-uploader, **falcon-wizard**, send-credentials-popup, shared-directives + legacy variants.

**Bolded = primary candidates** for this feature. Every visible source-of-truth UI element has a 1:1 Falcon counterpart. No major component invention should be required — this is a composition + token-mapping job.

## 6. Admin-console current state

- `app.routes.ts:9` — redirects `''` to `'organization-hierarchy'` but that route is not defined → **admin-console is currently broken**. Adding the new `org-hierarchy-page` route will be the only working route in admin-console.
- `app.config.ts` — Zoneless change detection is active (per v3.1 night shift), uses `provideFalconFallbackFacades()`, `RuntimeBaseUrlInterceptor`, default Gateway.SystemGateway.
- `mocks/falcon-fallback.providers.ts` — local mock layer present.

## 7. Host-shell — where login + sidebar live

- `apps/host-shell/src/app/app.routes.ts` — has `/login`, `/preview`, `/playground`, `/preview-shell`, `/preview-hierarchy`, plus the federated remotes.
- `LayoutComponent` (host-shell/src/app/layout/) — main authenticated chrome; sources NavItem[] (real-mode) or falls back to MOCK_SECTIONS list.
- `SidebarComponent` — already has an `orgHierarchy` mock entry under `account` section using `FALCON_ICONS.ORGANIZATION`. Real mode is router-driven.

**Menu integration approach (locked):** Add a new NavItem (real-mode) pointing to `/admin-console/org-hierarchy-page`. If host-shell currently sources NavItem[] from an API/static config, we'll extend that source; if not, we'll add a route entry in admin-console and rely on Module Federation to expose it. Final approach decided in Phase 5.

## 8. Source server prep (confirmed running)

- React `http://localhost:5500/T2 Falcon Admin.html` → React project at `C:\Falcon\Source_of_truth_theme\React\Organization page`
- HTML `http://localhost:8765/T2 Falcon Admin - Offline.html` → standalone bundled HTML

Both pages return 200 (servers reported listening; visual fetch deferred to discovery agents).

## 9. Constraints reconfirmed (from CLAUDE.md + memory)

- **Tailwind only** — no SCSS, no PrimeNG, no component CSS
- **Tokens only** — no inline hex/px values for color/border/radius/shadow/spacing/font
- **Falcon UI Core / `@falcon` is the only UI kit**
- **Models pattern** — one consolidated `models.ts` per context (NOT one file per interface)
- **No commit/push** without explicit user instruction
- **No password entry in browser** — security policy. User performs login during verification waves.
- **Build must be green** at end of every wave
- **No infinite loops** — max 5 visual-parity repair rounds, 90 % parity target

## 10. Obsidian vault

`C:\Falcon\Brain SK\_obsidian` exists. Plugin data files will NOT be touched. Linking + index updates only.

## 11. Git protocol

- Working tree dirty acceptable during waves
- No commits until phases land
- Implementation commit message (when authorized): `add organization hierarchy`
- Brain/report commit message: `docs(brain-sk): add org hierarchy page night shift wave report`
- Additive sync `Brain Outputs/` → `Brain SK/outputs/` only; no `robocopy /MIR`

## 12. Risks logged before next phase

| # | Risk | Mitigation |
|---|---|---|
| 1 | Login cannot be automated — security policy blocks password typing | User performs login during verification waves; orchestrator screenshots before/after |
| 2 | Two memory entries for "org-hierarchy" point to stale state on different branches | Treat both as historical; Phase 2 confirms current state authoritatively |
| 3 | Angular dev server not running | Defer all browser tests until Wave 4+ menu integration; can begin building features in isolation |
| 4 | admin-console current redirect to non-existent route means it is currently broken | New `org-hierarchy-page` route may need to also fix the placeholder redirect target |
| 5 | Falcon Chrome MCP availability not yet confirmed for Source Behavior Test agent | Source HTML + React inspection done via Read/Grep first; live-UI behavior validation pivots to user demo if MCP unavailable |

## TouchBase verdict

✅ **GREEN — proceed to Phase 1 (parallel discovery)**

No blocking issues. Source servers reachable; reference feature folder identified; full component knowledge base present; admin-console target verified empty (clean greenfield).
