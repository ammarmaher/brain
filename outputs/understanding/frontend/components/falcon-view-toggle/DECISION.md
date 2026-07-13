# falcon-view-toggle — DECISION

## Brain SK final recommendation

**STATUS: READY (shared primitive). Use for any compact 2-4 option view-mode switcher in new Angular code.** It is the canonical Falcon segmented-pill toggle, promoted to `libs/falcon/shared-ui` in Wave 19 to replace the consumer-side `FalconOrgViewToggleComponent`. Low current adoption (2 sites) but it is the correct home for the pattern — do NOT re-create a one-off toggle in a feature folder.

## Use this component for

- A small set (2-4) of mutually-exclusive **view modes** that change the layout of the same data (List ⇄ Tree, Grid ⇄ List, Cards ⇄ Table).
- A toolbar/tab-bar corner "how do I view this" switch with a translated label + small icon per option.
- View-state that lives in a signal and may need to be **vetoed** before committing (use the one-way + `(valueChange)` pattern).

## Avoid this component for

- A **form value** the user submits → `<falcon-angular-radio>` (it has CVA).
- Tabbed **content panels** → `<falcon-angular-tabs>` (mode `navigation`).
- Icon/title/description **selection cards** → `<falcon-angular-tabs>` (mode `radio-cards`).
- A boolean → `<falcon-angular-switch>`.
- More than ~4 options / overflowing options → a select/dropdown (no overflow handling here).

## Preferred variant / render path

`[CODE]` There is only **one render path** — this is a single-render pure-Angular component (no Shadow/`-tw`/`useTailwind` switch). Bind it two ways:
- **`[(value)]`** (default) — simple round-trip, model commits immediately.
- **`[value]` + `(valueChange)`** — when a change must pass a guard that can veto (the live org-hierarchy unsaved-changes pattern; the next CD pass re-feeds `[value]` to snap the pill back).

## Required upgrades before wider use

None block usage today. For broader adoption the most valuable additions are a `disabled` state (G3), a token/style contract (G6), and removing the raw `rgba()` shadow (G7) — all additive, see GAPS_AND_UPGRADES.

## Relationship to other components

- **Replaced:** legacy consumer-side `FalconOrgViewToggleComponent` (`<falcon-org-view-toggle>`).
- **Nested inside:** `<falcon-angular-tabs>` action slot at the live site.
- **Sibling Wave-19 promotions:** `<falcon-node-details-section>`, `<falcon-org-node-header>` (this batch), `<falcon-status-chip>`, `<falcon-angular-empty-data>`.
- **Functional cousins (do not compose):** `<falcon-angular-tabs>`, `<falcon-angular-radio>`, `<falcon-angular-switch>`.

## Exact rule for future implementation tasks

1. **Need a compact 2-4 option view-mode switch?** Use `<falcon-view-toggle>` — do not build a bespoke toggle in a feature folder.
2. **Pass `[options]`** as a typed `readonly FalconViewToggleOption<TKey>[]` const (stable reference), with i18n `labelKey`s.
3. **Use `iconSvg`** for List/Tree (baked); use `icon` (Falcon icon-font class) for anything else.
4. **Bind `[(value)]`** for a plain switch, or **`[value]`+`(valueChange)`** when the change must be vetoable.
5. **Do NOT** use it for a submitted form value (no CVA) — use `<falcon-angular-radio>`.
6. **Do NOT** add consumer CSS to restyle it — there is no token-override path; raise G6.
7. **Add new labels to `en.json` + `ar.json`.**

---

## Dynamic capability assessment

### 1. What is static today?

- `[CODE]` The entire visual contract: container bg (`bg-falcon-neutral-50`), pill geometry (`px-2 py-1.5 text-xs rounded-xs`), 12×12 icon size, active-pill colors + the `rgba()` drop shadow, inactive colors — all hardcoded inline (html:1-9).
- The two baked SVG icons (`list-bullets`, `org-chart`); only these two (ts:21).
- No `size`, no `disabled`, no `appearance` — fixed.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **Two inputs:** `[options]` (`input.required`, the full per-option data — key/label/icon) and `[value]` (`model.required`, two-way). Everything *content*-related (how many pills, their labels, their icons, which is selected) is dynamic.
- `[CODE]` **One auto-output:** `(valueChange)` (synthesized by the `value` `model()`), fired from the guarded `setValue` (ts:43-45).

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **Nothing** — no `<ng-content>`, no `ng-template` inputs. Per-option rendering is fully data-driven, not slot-driven.

### 4. What is dynamic through token/theme overrides?

- `[CODE]` **Nothing via tokens** — there is no `--falcon-view-toggle-*` token file (GAP G6). Dark mode IS handled, but via inline `dark:` utilities (html:8-9), not a token layer. A consumer cannot retheme the active color without forking.

### 5. What is dynamic through Tailwind classes?

- `[CODE]` Only the **host** `class=` (the host is `inline-flex`) for layout/spacing around the control. There is no `wrapperClass`/`buttonClass` input to reach the inner pills.

### 6. What is missing to make this component reusable across pages?

- `disabled` state (G3) — pages can't grey it out.
- A `size` axis (G2) — can't match larger neighbors.
- A token/style hook (G6) — can't retheme the active color.
- A CVA variant or a documented "use radio for forms" redirect (G4).

### 7. What capability should be added to shared component (not page hack)?

- `disabled` (control + per-option) and a `view-toggle.tokens.css` contract — both belong in the shared component so every adopter benefits and no feature re-forks the toggle.
- Roving-tabindex + `aria-controls` (A1/A2) — accessibility belongs at the primitive level.

### 8. What flags / options / templates / slots would make it better?

- `@Input() size`, `@Input() disabled`, `@Input() ariaLabel`, `@Input() wrapperClass`.
- `option.disabled?: boolean` per pill.
- Optional `option.iconTemplate` (TemplateRef) for fully custom icons — would retire the baked-SVG split (G5).

### 9. What is the safest upgrade path?

1. **Phase A (additive, zero risk):** add `disabled`, `size`, `ariaLabel`, `wrapperClass` inputs + `option.disabled`. Guard `setValue` on disabled. No consumer break (all default to current behavior).
2. **Phase B (tokenize):** extract `view-toggle.tokens.css` under `:where(.falcon-view-toggle, ...)`; move container/active/inactive colors + shadow to `--falcon-view-toggle-*`; drop the raw `rgba()` shadow + `text-[12px]` (G6/G7).
3. **Phase C (a11y):** add roving-tabindex + Arrow-key nav + `aria-controls`/`aria-label` (A1/A2/A3).
4. **Phase D (icons):** route all icons through the Falcon icon-font / optional template; retire baked SVGs (G5).

### 10. What is risky to change because other pages depend on it?

- `[CODE]` **The `valueChange`/`model` contract** — the org-hierarchy veto pattern depends on one-way `[value]` being re-fed to snap back; changing the model to internalize state (and stop honoring the parent's `[value]`) would break the veto.
- `[CODE]` **The label-is-translated assumption** — both consumers pass i18n keys; if the component stopped piping `translate`, every consumer would show raw keys.
- `[CODE]` **The `key` decoupling** (`tree`/`chart` vs List/Tree) — downstream `showOrgChart()` keys off `chart`; the component must keep emitting the option `key` verbatim.
- The fixed visual look — any restyle ripples to all (currently 2) adopters; treat as a shared-component change.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Recommendation: READY / shared primitive. 2 inputs (`options` required, `value` required model), 1 auto-output (`valueChange`), no slots, no token contract; substantive additive upgrades = `disabled` (G3) + token contract (G6) + raw-value cleanup (G7) + a11y (A1/A2). NEW dossier created this pass.
