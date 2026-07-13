# falcon-tabs — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[INFERRED]`.

## Owning backend module(s)
**None — the tabs component is presentational.** It owns the *selected-tab* state only. The data behind each tab panel is owned by that panel's own state slice / backend module:
- Hierarchy tab → **Commerce** (org tree). `[MEMORY]` `commerce/Node` endpoints.
- Settings tab → **Commerce** `GET/PUT commerce/setting` via System Gateway. `[MEMORY]` project_settings_tab_standalone_wave14.
- Comm Channels tab → **Commerce** `GET commerce/Node/{nodeId}/comm-channels/visible/details`. `[MEMORY]` project_commchannels_apps_tabs_wave17.
- Applications tab → **Commerce** `GET commerce/Node/{nodeId}/applications`. `[MEMORY]` project_commchannels_apps_tabs_wave17.
- `[INFERRED]` The `<falcon-angular-tabs>` element never touches any of these — each tab body component injects its own slice.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | The tabs component makes no calls. Each tab *body* component owns its endpoint (see Owning backend module(s) above for the per-tab map). |

`[INFERRED]` Integration shape: `<falcon-angular-tabs>` emits `valueChange`; the page maps that to its `activeClientTab` signal; an `effect()` on the active tab triggers the matching body's `state.load(nodeId)`. The tabs component is a pure selector — the data fetch is downstream.

## Validation rules (V-*)
The tabs component runs **selection validation**, not field validation.

| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Disabled-tab gate | tab selection | click / keyboard on a `disabled: true` tab | `select()` is a no-op; the tab has `tabIndex=-1` and skips focus — `[CODE]` per `API.md` |
| Unknown-value gate | `selectedValue` | `select(value)` with a value not in `tabs[]` | `select()` is a no-op; binding still sets the signal and the underline indicator resets to `translate(0,0)` — `[CODE]` per `USAGE.md` "Bad usage" note |
| Node-aware tab set | which tabs exist | page recomputes `visibleTabsForFalcon()` | not a component rule — the consumer omits invalid tabs to pre-empt the backend `SettingsOnlyAllowedForMainNode` 422 |
| Field-level V-rules | tab body fields | inside a tab body (e.g. Settings form) | owned by the tab body's `FormGroup`, NOT the tabs component |

`[INFERRED]` There is no async / data validation in the tabs component — it is selection-only. A `radio-cards` selection that the business wants to be "required" is validated by the consuming form's CVA (the wrapper is a `ControlValueAccessor`, so `Validators.required` on the bound `FormControl` works).

## PES keys gating this component
The tabs component has **no PES key of its own**.
- `[MEMORY]` Tab *visibility* is node-type-driven (Falcon root vs client root vs sub-node) and that decision may be PES-influenced upstream — but the component only receives the resulting `tabs[]` array.
- `[MEMORY]` Per-tab body PES gating happens inside the body — e.g. the Settings tab resolves per-section PES from `FalconAccess.adminConsole.{rootPasswordSecurityLevel, accountAllowedIps, accountQuota}.edit()` (project_settings_tab_standalone_wave14). The tabs component is unaware of those keys.

## State / signal pattern
`[CODE]` `falcon-tabs.component.ts` (per `API.md`):
- `selectedValue` is two-way bindable; the wrapper writes it to an internal `signal<value>()`. The wrapper implements `ControlValueAccessor` + registers `NG_VALUE_ACCESSOR` — `[(ngModel)]` and `formControlName` both bind a `string | number | null`.
- `[tabs]` is passed via property binding (not `[attr.tabs]`) so the array reaches Stencil un-stringified.
- Per-tab actions: `contentChildren(FalconTabActionsDirective)` + a `computed<TemplateRef | null>()` selects the active tab's actions template.
- `[CODE]` per `API.md` All Stencil events (`falcon-change`, `falcon-blur`, `falcon-focus`) are bridged internally; only `valueChange` is exposed.
- `[INFERRED]` Error-pipeline: the tabs component emits no HTTP errors; a failed tab-body load surfaces through the host-shell error pipeline (`falcon-http-ui.config.ts`).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `[CODE]` `falcon-tabs.tsx` (`<falcon-tabs>`, Shadow) + `falcon-tabs-tw.tsx` (`<falcon-tabs-tw>`, Light). Owns the tablist, the JS-measured sliding underline indicator, keyboard nav, and the `panel-{value}` slots. Pure presentational.
- **Angular wrapper** — `<falcon-angular-tabs>`: CVA + the **`falconTabActions` MutationObserver lift** — the wrapper physically moves the active tab's `<ng-template falconTabActions="value">` rendered nodes into the Stencil tablist row. This is the ONE place in the workspace where Angular content injection escapes into Stencil layout (`OVERVIEW.md`).
- **App / state layer** — the consuming page owns the tab body components, their state slices, and all backend calls. The library never fetches.

## Integration gotchas
- `[CODE]` per `API.md`/`GAPS_AND_UPGRADES.md` **`falconTabActions` is MutationObserver-based and fragile** — wrapping the tablist in a `flex-wrap` container, switching `orientation` at runtime, or mutating the Shadow root via `::part(tablist)` can break the actions-anchor parenting. The observer re-attaches via `requestAnimationFrame`, but this is the library's largest integration risk. For a runtime-orientation-switching consumer this is P0.
- **`[tabs]` must be property-bound** — `[attr.tabs]` stringifies the array. The wrapper template already uses `[tabs]`.
- **Re-creating the `tabs[]` array every CD cycle** triggers a Stencil re-render + a `getBoundingClientRect()` indicator re-measure (`measureActiveTab()` runs on every `componentDidUpdate`). Use an immutable `computed()`.
- **Setting `selectedValue` to a non-existent value** — `select()` no-ops but the signal still updates and the underline resets to `translate(0,0)`; do not bind to a value outside `tabs[]`.
- **Duplicate `value`s** break the internal `tabRefs` map and focus management.
- `[CODE]` per `API.md` **Keyboard direction does not swap under RTL** — `ArrowLeft`/`ArrowRight` map to the logical (not physical) direction; this is consistent with WAI-ARIA APG, but Arabic users may perceive it inverted.
- `radio-cards` mode emits no `panel-{value}` slots — render the selected body outside the component with `@switch`.

## Verification
🟢 VERIFIED 2026-06-03 (B13) — `<falcon-angular-tabs>` is in confirmed production use (org-hierarchy menus both consoles, templates-page, contracts, contact-groups, shared user-details in `libs/falcon`). Per-tab backend ownership ✅ VERIFIED against `[MEMORY]` (Settings Wave 14, CommChannels/Apps Wave 17). The `falconTabActions` `effect()`+MutationObserver lift + CVA wiring + the wrapper's `syncSelection()` controlled-tab escape hatch are now 🟢 CODE-VERIFIED against `falcon-tabs.component.ts` (re-read line-by-line). Backend-wiring table intentionally empty: the tabs component has no backend surface by design.
