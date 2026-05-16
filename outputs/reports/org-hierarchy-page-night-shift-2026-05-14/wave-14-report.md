# Wave 14 — Info-panel + Settings tab + Node drawer

**Status:** ✅ GREEN — full info-panel + settings-tab UI landed (Phase-2 continuation, 2026-05-14)
**Run:** 2026-05-14 (Brain SK Night-Shift Phase-2 autonomous executor)
**Build hash:** `62cb300123dba712` (admin-console)
**Branch:** `polishing-v0.4` (dirty — no commits)

## What landed (Phase-2 finish)

### Info panel (`app-org-info-panel`) — 5 files

- `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.ts` — Standalone signal-input component, selector renamed `falcon-org-info-panel` → `app-org-info-panel` per W7 D14 selector-prefix convention.
- `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` — 17-field grid (`identity` / `business` / `address` / `identifiers` sections), Business section heading, avatar block with first-letter initial bubble + "Client Picture" sublabel. View-mode renders bold static text; edit-mode renders `<falcon-angular-input>` per field.
- `components/tab-components/hierarchy-tab/falcon-org-info-panel/models/models.ts` — `OrgInfoFieldKey` + `OrgInfoSection` types. `NodeDossier` re-exported from `@falcon/sdk`.
- `components/tab-components/hierarchy-tab/falcon-org-info-panel/index.ts` — Barrel export.

Behaviour matrix:
- `loading=true` → 12 skeleton tiles
- `dossier=null` → empty placeholder
- `dossier=<value>` + `editable=false` → static dossier (view mode)
- `dossier=<value>` + `editable=true` → editable fields

Photo uploader replacement (D4) is NOT in this v1 panel — reference info-panel only renders the avatar bubble + name + "Client Picture" caption. The full circular uploader is in Add-Client wizard step 1, which is already W9.

### Settings tab (`app-settings-tab`) — 3 files

- `components/tab-components/settings-tab/settings-tab.component.ts` — Standalone wrapper that hosts `<app-client-settings-step>` (already shipped in W9). Mode signal (`view`/`edit`) toggles `readonly` flag on the step. Save/Cancel/Edit pills bind to state. Save calls `state.saveSettings()` + notifier toast.
- `components/tab-components/settings-tab/settings-tab.component.html` — Header with Edit / Save+Cancel pills, hosts settings step with `[(value)]`, `[(valid)]`, `[(dirty)]` two-way bindings.
- `components/tab-components/settings-tab/index.ts` — Barrel.

Settings step (W9) already accepts `readonly` input. The state service already exposes `fromAccountSettings`, `saveSettings`, `getSettingsForNode` — no state changes needed.

### Menu wiring (replacing W14 placeholders) — 2 file edits

- `components/org-hierarchy-page-menu.component.ts` — Imports `FalconOrgInfoPanelComponent` + `SettingsTabComponent`, both added to component `imports[]` array.
- `components/org-hierarchy-page-menu.component.html` —
  - Replaced "Information panel UI lands in Wave 14" placeholder with `<app-org-info-panel [dossier]="state.infoDossier()" [nodeName]="node.name" [editable]="false" (back)="state.closeInfo()" />`
  - Replaced `@case ('settings')` "Settings tab — content lands in Wave 14" with `<app-settings-tab [nodeId]="state.effectiveNodeId()" />`

## D-W14a — RESOLVED

The original W14 deferral note (placeholder UI rendered for info-panel + settings-tab) is now closed. Both real components mount in their target slots.

## Decisions taken

- **D-W14b-1** Selector renamed to `app-org-info-panel` (not `falcon-org-info-panel`) to satisfy `@angular-eslint/component-selector` rule and match the W7 D14 convention used by `app-org-node-header`, `app-org-view-toggle`, `app-org-node-drawer`. No template/CSS rename needed because no consumer uses the old name.
- **D-W14b-2** No photo uploader yet — reference info-panel only has the avatar bubble. The circular-mask single uploader (D4) was already noted as a library upgrade in `gaps-and-next-actions.md` and is not required for this panel's parity.
- **D-W14b-3** Info-panel `editable` left at `false` — the reference info-panel doesn't surface an Edit pill on its own header (node-header above it owns the Edit Node pill, which opens the drawer instead). Future ticket can wire `editable=true` after a discovery pass.

## Validation

- ✅ `nx build admin-console` GREEN — hash `62cb300123dba712`
- ✅ `nx lint admin-console` — 23 errors (matches inherited baseline; zero new from W14)
- ⏳ Visual smoke: needs user reload of `/admin-console/org-hierarchy-page` → select non-root node → click Information button on node-header → 17-field grid shows. Click Settings tab → view-mode renders.

## Files created in this phase

| File | Lines |
|---|---|
| `falcon-org-info-panel/falcon-org-info-panel.component.ts` | 50 |
| `falcon-org-info-panel/falcon-org-info-panel.component.html` | 56 |
| `falcon-org-info-panel/models/models.ts` | 24 |
| `falcon-org-info-panel/index.ts` | 3 |
| `settings-tab/settings-tab.component.ts` | 66 |
| `settings-tab/settings-tab.component.html` | 36 |
| `settings-tab/index.ts` | 2 |

## Files edited

| File | Why |
|---|---|
| `components/org-hierarchy-page-menu.component.ts` | Import + register 2 new components |
| `components/org-hierarchy-page-menu.component.html` | Replace 2 placeholders with real components |

## Pickup trigger if anything else surfaces

- "info-panel edit pill" → if user wants Edit pill on the panel itself
- "info-panel persistence" → backend save (currently in-memory only per D-W12-2 pattern)
