---
name: Session Backup - Organization Hierarchy Page Round 3
description: Round 3 polish + autonomous live audit of /organization-hierarchy-page
type: project
agent: ammar-web-platform-ui
date: 2026-05-13
status: completed
originSessionId: f9327798-e9ce-4a55-b3d9-9e52fa5e85c2
---
## Round 3 Items — Status

### Item A — Tree row 3-dot persistence on selected row — CLOSED
- File: `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss`
- Change: Added `.client-row.is-selected .row-action { opacity: 1; }` next to existing hover rule. Selected row now always shows the 3-dot action button regardless of hover state.
- Verified live: Selected "ammar" / "Aramco" rows persistently show the 3-dot icon when not hovered.

### Item B — Settings tab Edit button outline tone — CLOSED
- File: `apps/admin-console/src/app/features/organization-hierarchy-page/components/tab-components/settings-tab/react-settings-tab.component.ts`
- Change: Edit button restyled from solid teal (`bg-[#0d3f44] text-white`) to outlined-secondary (`bg-white text-[#0d3f44] border-[#0d3f44] hover:bg-[#e8f0f1]`), pencil icon retained.
- Verified live: Edit button now renders as transparent/teal-bordered with pencil icon.

### Item C — Phone Number +966 country prefix — CLOSED (root cause + fix)
- Root cause: `<falcon-mobile-number>` template rendered `<falcon-phone-field>` (Shadow DOM) directly without registering the Stencil custom element. Element existed in DOM but had no shadow root → completely invisible (no flag, no +966 prefix, no input).
- Files:
  - `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.html` — replaced `<falcon-phone-field>` with `<falcon-angular-phone-field>` (the canonical Angular wrapper that handles its own Stencil registration via ngOnInit).
  - `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts` — added `FalconAngularPhoneFieldComponent` import from `@falcon/ui-core/angular/falcon-phone-field`, added it to standalone imports, removed unused `OnInit` interface.
- Verified live: Add User Step 1 + Add Client Step 5 Phone Number fields now render `[SA] | +966` prefix correctly.
- Notes: I tried two earlier paths (1) importing `defineFalconTwComponent` from `@falcon/ui-core/loader` blew the bundle budget by 26 MB because the loader entry has eager imports for all 56 components, and (2) relative-path import was rejected by tsconfig isolation rules. The wrapper-delegation approach is clean and reuses the proven `<falcon-angular-phone-field>` registration path.

### Item D — Add Client Step 5 Password field — VERIFIED, NO CHANGE
- React `addclient.jsx` line 518-526 has a Password input that is `disabled` + `readOnly` with auto-generated value `'#123455'`. Angular Step 5 already implements this exact UX (readonly input + show-password eye toggle). No edit required.

### Item E — Mock-tree brand logos — CLOSED
- File: `apps/admin-console/src/app/features/organization-hierarchy/services/mock-tree.ts`
- Change: Added `BRAND_LOGO_SVG` map with 4 inline SVG-data-URI logos (Aramco green, Al-Rajhi navy, SNB dark green, Bupa blue — colored circles with brand initials). Each MOCK_TREE root child Account now has an `imageUrl` pointing to its brand logo. Build error TS4111 (index-signature access) resolved by switching from `Readonly<Record>` to `as const` typed object.
- Note: Mock tree only fires when backend HierarchyService falls back; current dev backend serves real data (BMW, Mercedes, Aramco etc.) which has no imageUrls returned. Visible only in offline/test mode.

### Item F — Tree row hover-path highlight — DEFERRED (already implemented partially)
- The tree-panel ALREADY supports `[hoveredPathIds]` propagation via the `falconTreeHoverPath` directive + `.on-path` rail tinting (CSS lines 33-46 of falcon-tree-node.component.scss). React achieves the same effect but via a slightly different visual tone. Not a new build — pre-existing baseline.

## Autonomous Live Audit — 12 Screens

### Screen 1: Add User wizard Step 2 (Role & Status) — REGRESSION FOUND (pre-existing, not Round 3)
- Layout: Correct 2-column grid (User Status / User Role)
- BUG: Both dropdowns show "No results" instead of populated options. The Stencil `<falcon-dropdown-tw>` has `options: []` empty even though the Angular wrapper receives the input correctly (the wrapper's own `options` is also empty).
- Root cause analysis: Property forwarding `[options]="options"` from Angular wrapper to Stencil custom element is silently dropping the array. This is a Stencil/Angular interop bug, NOT introduced by Round 3 changes. Existed before this session.
- Defer: needs library-level fix (likely `[options]` → `[attr.options-json]` JSON serialization OR Stencil ngOnChanges sync).

### Screen 2: Add User wizard Step 3 (Permissions & Privilege) — NOT REACHED LIVE
- Reason: Step 2 is blocked by the dropdown bug above (User Role required, can't select).
- Source-code parity check vs React `adduser.jsx` Step3: Permission Group dropdown + 2-channel Checker Level table (WhatsApp/Voice with None/Level1/Level2 radios). Angular implementation matches structurally (verified via models/models.ts).

### Screen 3: Add User wizard — Credentials modal — NOT REACHED LIVE
- Cannot proceed past Step 2 due to dropdown bug.

### Screen 4: Add Client wizard Step 1 (Client Information) — VERIFIED MATCHES
- 4-col grid Row 1: Account Name * / Finance ID * / Classification Category / Classification Sub Category
- "ACCOUNT OFFICIAL" section header
- 4-col Row 2: Entity Name / Authority Letter Type / Sector ("Government" prefilled) / Budget No.
- 4-col Row 3: Country / City / District / Street
- 4-col Row 4: Building Number / Postal Code / Additional Address / Another ID
- Row 5: VAT Registration Number alone
- Same dropdown options bug affects Country/City/Classification dropdowns (same root cause as Screen 1)

### Screen 5: Add Client wizard Step 2 (Settings) — VERIFIED MATCHES
- 2-card layout: LEFT password security + IPs / RIGHT Account Limitations
- IP chips (192.168.0.1 × 2 with × close), "+ IP Address" button, helper text
- 3 stepper rows: Max Normal User Limit / Max System User Limit / Max Node Level

### Screen 6: Add Client wizard Step 3 (CommChannels) — VERIFIED MATCHES
- 5-col table: Visibility / Name / Price Type / Price Value / Status
- 3 channels: WhatsApp / Voice / AI
- Toggle pills, Riyal symbol prefix, Inactive status badges

### Screen 7: Add Client wizard Step 4 (Applications) — VERIFIED MATCHES
- Same table format as Step 3
- 3 apps: Basic Send App / Survey Engine / Campaign Engine

### Screen 8: Add Client wizard Step 5 (Account Owner) — VERIFIED MATCHES
- Owner Picture uploader top
- 4-col Row 1: First Name * / Last Name * / User Name * / Password (disabled, eye toggle)
- 4-col Row 2: National ID/Iqama / Phone Number * (with Item C SA + +966) / Email Address * / Role (Account Owner — disabled dropdown)

### Screen 9: Hierarchy tab List view (users table) — VERIFIED MATCHES
- 8 columns: USERNAME / FIRST NAME / EMAIL / PHONE NUMBER / ROLE / PERMISSION GROUP / STATUS / ACTIONS
- Status badges with proper per-status colors (Pending amber, Active green, etc.)
- Pagination footer: "Showing 1 - 2 from 2" / "1 of 1" / "Rows per page 10"
- 3-dot per row in ACTIONS column

### Screen 10: Hierarchy tab Board (Kanban) view — VERIFIED MATCHES
- 5 columns: Active / Pending / Suspended / Locked / Deleted with status badges + counts
- Card style: avatar gradient, name, contact icons, role pill (e.g. sys-admin/sys-ops/acc-user), 3-dot menu
- Empty columns show "—" placeholder

### Screen 11: Hierarchy tab Tree (chart) view — VERIFIED MATCHES
- Vertical org-chart with elbow connectors
- Zoom/reset controls top left (- / 100% / + / reset icon)
- Selected node has teal border highlight

### Screen 12: Tree panel context menu — REGRESSION FOUND (pre-existing, not Round 3)
- BUG: Clicking the 3-dot icon on tree rows OR on chart nodes opens the menu (`open: true` in DOM) but renders OFF-SCREEN at y=3399 (page is ~765 high).
- Root cause: `<falcon-menu-tw popup append-to="host">` — the `appendTo="host"` attribute keeps the menu inside its DOM origin which inherits the scroll position of the chart panel, sending it well below the viewport.
- Defer: needs library-level fix to switch `appendTo` to `body` or use a portal, AND CSS `position: fixed` so the menu floats above scroll containers.
- Affects every page using `<falcon-tree-panel>`, not just the new page.

## Build Status — ALL GREEN
- `npx nx build admin-console` — GREEN
- `npx nx build host-shell` — GREEN
- `npx nx build management-console` — GREEN

## Files Modified (5 total)
1. `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss` (Item A)
2. `apps/admin-console/src/app/features/organization-hierarchy-page/components/tab-components/settings-tab/react-settings-tab.component.ts` (Item B)
3. `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.html` (Item C)
4. `libs/falcon/src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts` (Item C)
5. `apps/admin-console/src/app/features/organization-hierarchy/services/mock-tree.ts` (Item E)

## Outstanding Work for Round 4
1. **HIGH PRIORITY** Library bug: `<falcon-angular-dropdown>` `[options]` Angular→Stencil property forwarding silently drops array. Affects User Status / User Role / Country / City / Classification dropdowns in both Add User and Add Client wizards. Investigate `tsconfig.base.json` strict-property checks vs Stencil's `@Prop() options: FalconDropdownOption[] = []`. Likely needs ngOnChanges sync.
2. **HIGH PRIORITY** Library bug: `<falcon-tree-panel>` 3-dot context menus open off-screen due to `<falcon-menu-tw append-to="host">`. Switch to `body` portal + `position: fixed`.
3. Item F (medium polish): Tree row hover-path highlight — refine the `.on-path` visual tone to match React's exact teal tint.
4. Verify Item D Step 5 password field renders correctly when reaching it through happy path (was source-code verified, not visually tested live).
5. Surface mock-tree brand logos visibly by either: (a) adding a dev-only "use mock data" toggle, or (b) wiring backend HierarchyService to return imageUrl in the API response (backend task).
