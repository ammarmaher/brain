# falcon-menu — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None directly — the component is presentational.** `[CODE]` `falcon-menu.tsx` — the menu renders a `FalconMenuItem[]` and routes selection; it owns no data and makes no HTTP calls. The *action set* it renders is computed by the calling flow from backend-owned state:
- **Commerce** — applications / comm-channels row actions derive from the backend `availableActions[]` array (`eFalconServiceAction` FSM) `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan`.
- **Commerce** — org-hierarchy node operations (Add/Edit/Delete node).
- **Identity** — user-row actions (incl. soft-deleted handling) `[MEMORY]` `project_pr40937_include_deleted_lift`.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (none called by the component) | — | — | — | — | `[CODE]` `falcon-menu.tsx:62-67` emits `falcon-menu-item-select` / `falcon-menu-open` / `falcon-menu-close`; the consuming flow's `command` callback runs the actual API call. |
| `[INFERRED]` per-row `availableActions[]` source | GET | Commerce via System Gateway | `availableActions[]: eFalconServiceAction[]` | System Gateway `useGateway()` | `[MEMORY]` — the action set used to BUILD the `FalconMenuItem[]` comes from the row fetch; the menu only renders it. |
| `[INFERRED]` the chosen action's endpoint | (varies) | (varies) | (varies) | System / Core Gateway | the `command` callback fires the actual mutation (do-payment, disable, delete, edit-node, …). |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| (none) | — | — | The menu has no form fields and runs no validators `[CODE]` `API.md:91` ("CVA support: Not applicable"). |
| `[CODE]` navigability rule | `FalconMenuItem` | item is `separator` or `disabled` | not a backend V-rule — `isNavigable` (`falcon-menu.tsx:185-192`) excludes the item from keyboard nav and `invokeItem` rejects it (`:233`) |

`[INFERRED]` Action *legality* is validated upstream: the owning flow filters `items` by PES + user-type + backend `availableActions[]` before binding. The menu trusts its input.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (none own) | — | The menu component has no PES key. |
| `[INFERRED]` `FalconAccess.adminConsole.services.{visibility,editPriceType,editPriceValue,payment}` etc. | per-item action | `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan` — PES is resolved by the owning flow; a denied action's `FalconMenuItem` is **omitted from the array** (or marked `disabled: true`) before `[items]` is bound. The menu never sees a forbidden verb. |

## State / signal pattern
`[CODE]` `falcon-menu.component.ts` (Angular wrapper) uses classic `@Input()` decorators `[CODE]` `API.md:95`.
`[CODE]` `API.md:96-99` — **`items` MUST be pushed as a JS property, not an attribute** — `[attr.items]` would stringify the array; the wrapper's setter pushes it onto the live Stencil element. **`anchorEl` is likewise a property push** — an `HTMLElement` is non-serializable (`falcon-menu.tsx:51-57`). The wrapper's `syncProps()` awaits `componentOnReady()` before pushing to survive the hydration race.
`[CODE]` `falcon-menu.tsx:59` — Stencil `@State() activeIndex` drives the roving-`tabIndex` focus model (`:362`). `[CODE]` `:86-97` — `@Watch('open')` resets `activeIndex` and emits `falcon-menu-open` / `falcon-menu-close` with a `reason` (`trigger`/`item-select`/`outside-click`/`escape`/`programmatic`).
`[INFERRED]` In a data-table consumer the flow typically holds a `signal<FalconMenuItem[]>` rebuilt per row click; in `falcon-tree-panel` the menu items are computed from the node's permissions. **Error pipeline:** a failed action invoked by a `command` callback surfaces through the global HTTP error pipeline (`[MEMORY]` `project_commchannels_apps_tabs_wave17` — `falcon-http-ui.config.ts`); the menu itself has already closed (`falcon-menu.tsx:243-248`).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` `falcon-menu.tsx` `<falcon-menu>` (Shadow) + `falcon-menu-tw` (Light DOM, `OVERVIEW.md:43`). Pure presentational; owns the keyboard model, outside-click closure, and external-anchor positioning.
- **Angular wrapper** — `[CODE]` `OVERVIEW.md:39` `<falcon-angular-menu>`. Proxies the Stencil methods (`showAt`, `hide`, `openMenu`, `closeMenu`, `toggle`, `[CODE]` `API.md:44-50`); pushes `items` / `anchorEl` as properties; picks render path via `[useTailwind]`. Still presentational.
- **Composed-in higher-level layer** — `[CODE]` the menu is composed *inside* `FalconTreePanelComponent` (`libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html:149`) and `FalconAngularDataTableComponent` (`falcon-data-table.component.html:51`, wired at `.component.ts:1186`); both use the external-anchor `showAt()` pattern. These composers build the `FalconMenuItem[]` (PES-filtered, state-gated) and own the `command` API calls. Per `[VAULT]` `feedback_library_skeleton_app_api`, item-list construction + API calls live in the composer layer, never inside the library menu.
- **Top-Layer promotion (wrapper, Wave 6 / 2026-05-21)** — `[CODE]` falcon-menu.component.ts:69-83,253-338 — the wrapper promotes the inline `data-component="falcon-menu-panel"` into the browser Top Layer (native `popover` API + `FalconStackingService`) on open, neutralizing the UA popover stylesheet. This **partially mitigates** the unimplemented `appendTo="body"` gap: in supporting browsers the promoted panel escapes a row's `overflow:hidden` even though there is no DOM body-portal.

## Integration gotchas
- `[CODE]` `falcon-menu.tsx:150-157` — outside-click closure uses `composedPath()` to pierce Shadow DOM; the `anchorEl` is treated as *inside* so re-clicking the same row trigger toggles rather than double-firing close-then-open. A wrapper that switched to Light-DOM-only would break Shadow consumers (`DECISION.md:113`).
- `[CODE]` `falcon-menu.tsx:126-138` — `showAt(el, sameEl)` **toggles closed** when called again with the same anchor; calling with a *different* anchor repositions. A shared per-row menu relies on this — do not also manually `hide()` before `showAt()`.
- `[CODE]` `falcon-menu.tsx:48` — `appendTo="body"` is **typed but not implemented**; only `'host'` works as a DOM-parenting choice. BUT the wrapper's Top-Layer popover promotion (Wave 6) makes the panel escape `overflow:hidden` clipping in supporting browsers regardless — so the practical "clipped inside a deep tree" risk is mostly addressed today (the P1 fix in `GAPS_AND_UPGRADES.md` is now narrower: a true DOM-portal fallback for non-popover browsers).
- `[CODE]` `falcon-menu.tsx:318-322` — external-anchor positioning aligns to the anchor's **right edge** always; under RTL pages this may want the left edge (`TOKENS.md:36-38`).
- `[CODE]` `falcon-menu.tsx:62-67` — Stencil events are `falcon-menu-item-select` / `-open` / `-close`; the Angular wrapper re-exposes them as `falconMenuItemSelect` / `falconMenuOpen` / `falconMenuClose`. Bind the wrapper names in Angular.
- `[CODE]` `falcon-menu.tsx:159-168` — the Esc-to-close listener is `document`-global while `open && popup`; rendering two menus simultaneously means they share that listener (`USAGE.md:108`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13) — menu is production-ready, composed inside `falcon-tree-panel` (`.html:149`) + `falcon-data-table` (`.html:51`, `.ts:1186`). Property-push (`items`/`anchorEl`), the BUG-LIB-004 `syncChanged` fix, the external-anchor `showAt` toggle, the `composedPath` outside-click, and the Wave-6 Top-Layer promotion all re-read line-by-line in `falcon-menu.component.ts` + `falcon-menu.tsx`. PES + `availableActions[]` gating `[INFERRED]` to live in the composer layer — `[MEMORY]`-confirmed; `appendTo="body"` clipping risk re-scoped (Top-Layer mitigates it in supporting browsers).
