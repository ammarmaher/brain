# falcon-tabs — DECISION

## Brain SK final recommendation

### Use this component for
- Page-section navigation with associated bodies (Org Hierarchy / Settings / Apps / Comm Channels tab pattern).
- Guided "pick one option" UX with rich card-style choices (`mode="radio-cards"`).
- Tab strips with per-tab header actions (`falconTabActions`).
- Replacing any legacy `<p-tabView>` or `.tabs-bar` HTML pattern from V0.2.

### Avoid this component for
- Routed URL-driven nested views (use `<a routerLink>` strips instead).
- Wizard step navigation (use `falcon-angular-stepper` / `falcon-angular-wizard`).
- Single-tab "section headers" — over-engineering.
- Filter chip rows (use a custom chip + checkbox flow).
- Very large tab counts that need horizontal scrolling (no scrollable mode yet — see gaps).

### Preferred render path
`useTailwind=true` (default) → `<falcon-tabs-tw>`. Light DOM lets the `falconTabActions` injection work cleanly (the actions anchor is parented inside the Light tablist, not stuck on the Shadow boundary).

### Required upgrades before wider use
- **None block CURRENT usage.** All consumers in the workspace work today.
- **Tier 1 (recommended within 1 milestone):**
  1. Replace `falconTabActions` MutationObserver hack with a real Stencil `<slot name="header-end">`.
  2. Add `<slot name="header-start">` for symmetry.
  3. Add `iconUrl` / per-tab badge slots.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-tab-actions.directive` | Companion directive — only meaningful with `<falcon-angular-tabs>`. |
| `falcon-angular-button` | Most common content of a `falconTabActions` template. |
| `falcon-angular-radio` | Radio-cards mode is a stylistic alternative; for pure single-value picking, decide between radio-cards (richer cards with icon+description) and radio-group (compact stacked radios). |
| `falcon-angular-badge` / `falcon-angular-tag` | Currently NOT slotted per tab — gap. Today consumers embed counts in the label string. |
| `falcon-angular-stepper` | Different use case — sequential progress, not parallel selection. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-tabs>` for any horizontal/vertical tabbed section. Prefer `falconTabActions` for per-tab action buttons over outer-flex sibling layout — it places actions on the same baseline as the tablist border. For pages where the action belongs to the whole tab strip (not a single tab), the outer-flex pattern remains valid. Always pass a `value` and `label` per `FalconTabOption`; pass `helperText` only in `radio-cards` mode. Use `[(selectedValue)]` for two-way binding.

### Status
**READY** — production-grade for navigation mode and radio-cards mode. The `falconTabActions` pattern is **READY but fragile** — works today but needs the slot replacement.

---

## Dynamic capability assessment

### 1. What is static today?
- The tab indicator is always a sliding strip (no border-fill or pill-shape variant).
- Navigation mode always emits panel slots; radio-cards mode never does.
- The keyboard nav keys are fixed (`Arrow*`, `Home`, `End`, `Enter`, `Space`).
- The maximum number of tabs is unbounded but no scrollable mode exists.
- The "icon" per option is always a font-icon CSS class (`<i class="...">`).

### 2. What is already dynamic through inputs/outputs?
- `tabs` (array of options).
- `mode` (navigation vs radio-cards).
- `size`, `orientation`.
- `selectedValue` (two-way).
- `ariaLabel`, `helperText`, `errorMessage`.
- `useTailwind` render path.
- `rootClass`.
- Per-option `value`, `label`, `disabled`, `icon`, `helperText`.

### 3. What is already dynamic through slots / ng-template?
- Stencil `slot="panel-<value>"` per tab (navigation mode).
- Angular `<ng-template falconTabActions="<value>">` for per-tab header-end action area.

### 4. What is dynamic through token / theme overrides?
Everything visual: tablist bg, border, gap. Tab font / colour / weight / padding per state per size. Indicator height, color, transition. Radio-cards card bg / border / radius / selected styling. Helper / error colors. Motion timing.

### 5. What is dynamic through Tailwind classes?
- Host layout (`block`, `border-b`, `px-4` etc.).
- Margin / spacing utilities on the outer container.
- Nothing inside the tablist or panels.

### 6. What is missing to make this component reusable across pages?
- A real Stencil slot for header-start / header-end actions (current Angular MutationObserver injection is fragile).
- A panel slot for radio-cards mode.
- Per-tab badge / count slot.
- `iconUrl` + per-tab icon-template options.
- Lazy panel rendering for heavy bodies.
- Scrollable mode for >N tabs.

### 7. What capability should be added to the shared component instead of a one-off page hack?
Replace `falconTabActions` MutationObserver lift with a proper Stencil `<slot name="header-end">` + a thin Angular helper that projects the `<ng-template>` content into that slot via `<ng-template *ngTemplateOutlet>`. This keeps the per-tab pattern but removes the DOM-shifting fragility.

### 8. What flags / options / templates / slots would make it better?
- `[lazy]="true"` — defer panel rendering.
- `[scrollable]="true"` — overflow handling for many tabs.
- `[variant]="'underline' | 'pill' | 'filled'"` — visual mode for navigation.
- `<slot name="header-start">` + `<slot name="header-end">` — real Stencil slots.
- Per-tab `<slot name="badge-<value>">`.
- `iconUrl` per option for SVG icons.
- Optional `<ng-template falconTabLabel="value">` for rich label content.
- Optional `<ng-template falconTabBadge="value">` for custom badge.

### 9. What is the safest upgrade path?
1. Add `<slot name="header-end">` to Stencil sources (additive).
2. Update the Angular wrapper to project the active `falconTabActions` template into that slot via `<ng-template *ngTemplateOutlet>` instead of MutationObserver.
3. Remove the MutationObserver code path in a follow-up release.
4. Add `<slot name="header-start">` (additive).
5. Add per-tab badge/icon slots (additive).
6. Add `lazy` and `scrollable` as opt-in flags (additive).

### 10. What would be risky to change because other pages depend on it?
- **The active tab auto-select on `componentWillLoad` when `selectedValue=null`.** Removing it would change render output for new pages.
- **The 2-way `selectedValue` binding semantics** — flipping to `valueChange` only would break `[(selectedValue)]` consumers.
- **The default sliding underline animation duration (220ms).** Cheap to keep; consumers may have visual diffing tests that match this timing.
- **The `falcon-change` Stencil event** — removing it would break any non-Angular consumer that bypasses the wrapper.
- **`FalconTabOption.value` typed as `string | number`** — narrowing to `string` would break the org-hierarchy mapping that uses `ClientTab` numeric enum values.
- **Per-tab `disabled: true` is honored both for click and keyboard** — flipping this contract would break the org-hierarchy "hidden tabs" pattern.
