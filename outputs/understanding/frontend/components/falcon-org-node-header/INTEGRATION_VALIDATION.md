# falcon-org-node-header — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)

`[CODE]` **None.** The component is purely presentational — it shows the selected node's name/image/type and emits action intents. It calls no endpoint and owns no data. The flows its outputs trigger are owned by:
- **Commerce** — Add Client / Add Node / Edit Node (org structure create/update; `[MEMORY]` Commerce owns node/client create payloads; node-name chokepoint `NodeName.Create()`).
- **Identity** — Add User (`[MEMORY]` Identity owns user lifecycle).
- **None** — the Information toggle is a pure client-side view switch (opens the org info panel).

> Because the component is unused, none of these are wired through it; the live `<falcon-node-details-section>` actions slot (org-hierarchy-page-menu.component.html:159-270) is where the projected `<falcon-angular-button>`s call `state.saveSettings()` etc.

## Backend wiring

| Endpoint | Method | Backend module | DTO | Gateway | Notes |
|---|---|---|---|---|---|
| _(none directly)_ | — | — | — | — | `[CODE]` The header only emits `addClient`/`addNode`/`editNode`/`addUser`/`toggleInfo` (ts:30-34). The parent step/wizard performs any HTTP. |
| Add Client / Add Node create (downstream) | `POST` | Commerce | wizard payload | System Gateway (admin) / Core Gateway (mgmt) | `[INFERRED]` triggered by the flow the `addClient`/`addNode` output opens — not by the header. |
| Add User create (downstream) | `POST` | Identity | user-create payload | System / Core Gateway | `[INFERRED]` triggered by the `addUser` flow. |
| Settings save (live supersessor) | `PUT` | Commerce | settings payload | System / Core Gateway | `[CODE]` In the live header (`<falcon-node-details-section>`) the Save button calls `state.saveSettings()` (org-hierarchy-page-menu.component.html:176) with `[loading]="state.settingsSubmitting()"`. |

> `[CODE]` The header emits payload-less `void` events; the parent already holds the selected node and builds the request. Per `feedback_library_skeleton_app_api`, the presentational component never fetches.

## Validation rules (V-*)

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| _(none)_ | — | — | `[CODE]` No validation surface. The header has no inputs the user edits, no `errorMessage`/`state` axis. Node-name validation etc. lives in the Add/Edit flows the outputs trigger. |

> `[CODE]` falcon-org-node-header.component.ts has no validators. It is display + event-emit only.

## PES keys gating this component

| PES key | Action | Effect when denied |
|---|---|---|
| (parent-resolved) → `canAddClient` | render Add Client button | `[CODE]` button hidden (`@if (canAddClient())`, html:52) |
| (parent-resolved) → `canAddNode` | render Add Node button | hidden (html:60) |
| (parent-resolved) → `canEditNode` | render Edit Node/Info button | hidden (html:68) |
| (parent-resolved) → `canAddUser` | render Add User button | hidden (html:85) — default permitted |
| (parent-resolved) → `canShowInfo` | render Information toggle | hidden (html:36/44) — default permitted |

`[CODE]` The component has **no PES key of its own** — it consumes already-resolved boolean `can*` flags (ts:22-26). The parent (org-hierarchy page / state slice) is responsible for mapping PES keys (e.g. `FalconAccess.adminConsole.*`) to these booleans. The header's role is to **render-gate** by hiding the button when the flag is false. `[CODE]` In the live supersessor, the analogous gating is done by `@if (state.settingsPesFlags().canEdit*)` around the projected buttons (org-hierarchy-page-menu.component.html:183).

> **Gating limitation:** the header can only *hide* (not *disable*) buttons — there is no `disabled` axis. PES "visible-but-disabled" semantics are not supportable here.

## State / signal pattern

`[CODE]` falcon-org-node-header.component.ts:
- Inputs: `nodeName` (`input.required`), `nodeType`/`imageUrl`/`canAddClient`/`canAddNode`/`canEditNode`/`canAddUser`/`canShowInfo`/`infoOpen`/`useCustomActions` (all `input()` with defaults) — ts:18-28.
- Outputs: 5 `output<void>()` — ts:30-34.
- Derived: `initials = computed<string>()` from `nodeName()` (ts:36-40).
- `OnPush` (ts:14). No subscriptions, no lifecycle hooks, no `DestroyRef` → nothing to tear down (zoneless-safe).
- **Stateless** — the parent owns the selected node + PES booleans + `infoOpen` and re-feeds them as inputs; the header reacts to the 5 outputs. No internal mutable state at all.

## Skeleton ↔ app-wrapper layering

`[CODE]` **N/A — no skeleton/wrapper split.** Single Angular component; no Stencil-skeleton + Angular-wrapper pair, no `componentOnReady`, no `useTailwind`. Renders plain `<header>`/`<button>`/`<img>`/`<svg>` directly. (The app-level twin `app-org-node-header` is a *duplicate component*, not a wrapper layer — see OVERVIEW.)

## Integration gotchas

- `[CODE]` **It is unused** — wiring `(addClient)` etc. on this component has no live effect; the live header is `<falcon-node-details-section>`. Integrate against node-details-section, not this.
- `[CODE]` **Name collision** — `import { FalconOrgNodeHeaderComponent } from '@falcon'` gives the shared one (selector `falcon-org-node-header`); a relative import from the feature folder gives the app twin (`app-org-node-header`). Same class name, divergent template (the app twin uses `<falcon-angular-button>` + `<falcon-brand-logo>` and lacks `useCustomActions`). Maintainers must check WHICH one they touched (GAP G1).
- `[CODE]` **No dark mode** (TOKENS G8) — would render light-on-light on a dark canvas if adopted.
- `[CODE]` **`useCustomActions` is all-or-nothing** — it suppresses the ENTIRE built-in row (html:32-34); you cannot mix one built-in button with one custom one. The supersessor's `falconNodeDetailsActions` template is strictly more flexible.
- `[CODE]` **Outputs are `void`** — the parent must already know the node context; nothing is passed back.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) — confirmed no backend wiring, no validation, no own PES key (consumes parent `can*` booleans), no skeleton/wrapper layering. The signal pattern (`input()`/`output()`/`computed()` + OnPush + zero internal state) re-confirmed in source. Live integration is via the supersessor `<falcon-node-details-section>` (org-hierarchy-page-menu.component.html:151-270); downstream Commerce/Identity endpoints cross-referenced from `[MEMORY]` but NOT touched by this component.
