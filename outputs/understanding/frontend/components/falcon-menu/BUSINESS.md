# falcon-menu — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` The menu is how Falcon presents **the set of operations available on a single subject** — the actions an operator can take against a specific tree node, a specific data-table row, or the current page. It is the kebab/3-dot affordance: click it and see exactly the verbs (Edit, Delete, Archive, Move, Activate) that are legal *for that subject right now*. `[CODE]` `falcon-menu.tsx:1-13` — it is the PrimeNG `p-menu` carve-out replacement; `[CODE]` `OVERVIEW.md:30` — preferred since Revamp v3.1.

In business terms the menu's *item list* is a per-subject capability statement. The list is not static — it is computed from the subject's current state, the operator's user-type, and the backend-supplied set of allowed actions. The component renders that statement and routes the operator's choice back via a `command` callback.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Row actions are gated by the row's lifecycle state and a backend-computed action set | `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan` (`availableActions[]` FSM-computed per row) | Each `FalconMenuItem` for an applications/comm-channels row is built from the backend `availableActions[]` array (`DoPayment`/`Disable`/`Enable`/`EditPriceType`/`EditPriceValue`); an action absent from that set is simply not added to `items`. |
| Falcon-only operations are hidden from Client users | `[MEMORY]` `project_settings_tab_standalone_wave14` (PES `FalconAccess.*`) + `[VAULT]` Permissions-&-Authorization | The menu item array is filtered by PES before being passed to `[items]`; a Client-user menu omits Falcon-only verbs entirely. |
| Soft-deleted rows expose a restricted action set | `[MEMORY]` `project_pr40937_include_deleted_lift` (`onUserRowActionLocal`, status `'deleted'`) | The org-hierarchy page menu builds a different `FalconMenuItem[]` when a row's status is `deleted` — e.g. the row-action passes `?includeDeleted=true` so the deleted user opens with 200, not 404. |
| Disabled items communicate "not available now" without hiding the verb | `[CODE]` `falcon-menu.tsx:185-192` (`isNavigable` skips `disabled`) | A `FalconMenuItem` with `disabled: true` renders greyed and is skipped by keyboard navigation — the operator sees the verb exists but cannot invoke it. |

## Business constraints baked in
- `[CODE]` `falcon-menu.tsx:231-249` — **`invokeItem` is the single decision point.** A disabled or separator item is rejected (`:233`); a valid item runs its `command` callback then emits `falcon-menu-item-select`; in popup mode the menu closes and returns focus to the trigger. The owning flow's command callback is where the business action actually fires.
- `[CODE]` `falcon-menu.tsx:234-241` — **a thrown command does not break the menu.** If a consumer's `command` throws, it is caught and logged; the menu still closes (`:243-248`). Business reasoning: a failed action must not leave a stuck open menu.
- `[CODE]` `falcon-menu.tsx:329-339` — **separators carve the action list into business groups** (e.g. routine actions above the divider, destructive actions below). A `FalconMenuItem` with `separator: true` is purely a divider — its `label`/`icon` are ignored.
- `[CODE]` `falcon-menu.types.ts` (`FalconMenuItem.data`) — **`data` round-trips arbitrary business context.** The owning flow attaches the row/node payload to each item; `falcon-menu-item-select` returns the item with its `data` so the handler knows which subject was acted on.
- `[CODE]` `falcon-menu.tsx` — **no nested submenus** `[CODE]` `API.md:112` — the carve-out scope excludes categorised action trees. A flow needing "Export → CSV / PDF / Excel" cannot express it here.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Organization Hierarchy tree node menu | organization-hierarchy (admin + management consoles) | Per-node kebab — Add Client / Add User / Add Node / Edit Node / Delete, composed inside `FalconTreePanelComponent` `[CODE]` `USAGE.md:137-140` |
| Data-table row action menu | org-hierarchy applications / comm-channels tabs | Per-row 3-dot — one shared menu, dynamic `items` per row via `showAt(rowEl, event)` `[CODE]` `API.md:103-107` |
| User-row action menu | org-hierarchy users | Edit / Delete / open-with-`includeDeleted` for soft-deleted rows `[MEMORY]` `project_pr40937_include_deleted_lift` |
| Page-header kebab | platform-wide | Page-scoped operations `[CODE]` `OVERVIEW.md:14` |

## Business gotchas
- The menu **renders whatever `items` it is given** — it does not itself enforce PES or row-state rules. `[INFERRED]` Gating is the owning flow's job: filter the `FalconMenuItem[]` by user-type / PES / `availableActions[]` *before* binding `[items]`. A menu showing an illegal verb is a flow bug, not a component bug.
- `[CODE]` `falcon-menu.tsx:366-368` — mouse-enter sets the active item; for a user mixing mouse and keyboard, focus can jump unexpectedly `[CODE]` `GAPS_AND_UPGRADES.md:76-77`. Not a correctness issue but worth knowing for a11y-sensitive flows.
- `[CODE]` `falcon-menu.tsx:301-326` — in external-anchor mode the panel is `position: fixed` and does NOT scroll with the page `[CODE]` `GAPS_AND_UPGRADES.md:75-76`. For a long table, a menu opened then scrolled floats oddly.
- `[CODE]` `GAPS_AND_UPGRADES.md:12-18` — `appendTo="body"` is **typed but not implemented**. A menu inside an `overflow: hidden` container (deep tree, clipped table) gets clipped today. The owning flow must account for this until the upgrade lands.

## Verification
🟢 LANDED — menu is production-ready for its current consumers `[CODE]` `USAGE.md:135-140` (composed inside `falcon-tree-panel`). 🟡 CODE-DERIVED for the per-subject capability semantics from `falcon-menu.tsx`. Row-state / PES / `availableActions[]` gating ✅ VERIFIED in `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan` + `project_pr40937_include_deleted_lift`.
