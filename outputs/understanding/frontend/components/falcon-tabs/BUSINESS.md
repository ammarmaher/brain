# falcon-tabs — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` Tabs are how Falcon partitions a single business entity into **parallel, mutually-exclusive views** the operator switches between without leaving the page. On the Organization Hierarchy page a selected node is examined through up to four lenses — Hierarchy, Settings, Communication Channels, Applications — each a separate business concern of the same node. In `radio-cards` mode the same component becomes a **guided single-choice selector** (pick an account type, pick an OTP channel). Tabs say "these are all aspects of one thing; look at one at a time"; the stepper says "these are ordered steps of a process".

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Node-aware tab visibility — the tab set depends on node type | `[MEMORY]` project_settings_tab_standalone_wave14 ("Falcon root → [hierarchy, settings]; client root → all 4; sub-node → [hierarchy, commChannels, apps]") | The consumer passes a `visibleTabsForFalcon()` computed into `[tabs]`; the component renders exactly the supplied set — it does not decide visibility itself. |
| Settings is only valid for a main node | `[MEMORY]` project_settings_tab_standalone_wave14 ("pre-empts `SettingsOnlyAllowedForMainNode` 422") | Settings is omitted from `tabs[]` for sub-nodes — the unreachable tab simply never renders, pre-empting the backend rejection. |
| A disabled tab is not selectable by click or keyboard | `[CODE]` `falcon-tabs.tsx` (per `API.md` — `disabled` tabs get `tabIndex=-1`, skip focus, `select()` is a no-op) | `FalconTabOption.disabled` blocks both pointer and keyboard selection. |
| One section is always active | `[CODE]` `falcon-tabs.tsx` `componentWillLoad` (per `API.md` — auto-selects first enabled tab when `selectedValue` is null) | The page never shows "no tab selected"; a node always opens on a concrete lens. |

## Business constraints baked in
- `[CODE]` per `API.md` **First enabled tab auto-activates** — when `selectedValue` is null and `tabs[]` is non-empty, the Stencil component selects the first non-disabled tab on `componentWillLoad`. A business view always has a default lens.
- `[CODE]` per `API.md` **Disabled tab = "this lens is not available for this entity"** — `disabled: true` removes the tab from both click and keyboard reach. This is a business statement, not a styling state.
- `[INFERRED]` **`mode="navigation"` vs `mode="radio-cards"` is a business distinction** — `navigation` is "switch the view of one entity"; `radio-cards` is "commit a categorical choice". They are not interchangeable styling variants.
- `[MEMORY]` **The tab SET is consumer-owned and node-aware** — `org-hierarchy-menu.component` passes a computed visible-tabs array; the component never hides a tab on its own. The business rule "which tabs exist" lives in the page state, not the component.
- `[INFERRED]` **`FalconTabOption.value` is typed `string | number`** specifically so the org-hierarchy `ClientTab` numeric enum can be a tab value — narrowing it to `string` would break that mapping (`DECISION.md` item 10).

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Organization Hierarchy node view | admin-console organization-hierarchy-menu | ✅ Main tab strip — Hierarchy / Settings / Comm Channels / Applications lenses of the selected node. `[CODE]` `organization-hierarchy-menu.component.html:54`. |
| Organization Hierarchy node view (twin) | management-console organization-hierarchy-page-menu | ✅ Same tab strip on the client-facing app. |
| User Details page | host-shell user-details-page | ✅ Section tabs on the user-details view. `[CODE]` `user-details-page.component.html`. |
| OTP channel chooser / account-type picker | (dialog) | `[INFERRED]` `mode="radio-cards"` guided single-choice selectors. |
| UI showcase Live/Code toggle + per-tab actions demo | host-shell falcon-ui-showcase | ✅ Reference implementation of `falconTabActions`. |

## Business gotchas
- A tab is a *lens on one entity*, not a *step in a process* — if the design implies "do this then that", it is a wizard, not tabs.
- The component renders whatever `tabs[]` it is given — **it does not enforce node-aware visibility**. If a builder leaves a tab in the array that should be hidden for a sub-node, the unreachable tab will render and clicking it can trigger a backend 422 (`SettingsOnlyAllowedForMainNode`). The visibility computation is the page's responsibility.
- `radio-cards` mode emits a selection but renders **no body panel** — the consumer must render the chosen body separately (`@switch`). Using radio-cards for view switching (expecting panels) is the wrong mode.
- Tab `disabled` is a render-time business state, not a transient "loading" flag — there is no separate "this tab is loading, defer interaction" state (`GAPS_AND_UPGRADES.md`).
- Per-tab action buttons (filter/view toggles) belong to a *specific tab's* view state and use `falconTabActions`; a toggle that changes the *whole page* (the Tree/Chart view switch) is a page-level sibling, not a `falconTabActions` template — `[CODE]` `organization-hierarchy-menu.component.html:53-65` deliberately uses the outer-flex sibling pattern for exactly that reason.

## Verification
✅ VERIFIED — `falcon-tabs` is in confirmed production use: the admin-console + management-console Organization Hierarchy tab strips and the host-shell User Details page all consume `<falcon-angular-tabs>` (`USAGE.md` Wave 7 sweep — 5 consumers). Business rules around node-aware tab visibility and the `SettingsOnlyAllowedForMainNode` pre-emption are ✅ VERIFIED against `[MEMORY]` project_settings_tab_standalone_wave14. Auto-select / disabled-tab behaviour is 🟡 CODE-DERIVED from the existing `API.md` (Stencil source `falcon-tabs.tsx` not re-read line-by-line in this pass).
