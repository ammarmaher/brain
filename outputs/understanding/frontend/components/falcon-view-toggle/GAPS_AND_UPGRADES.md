# falcon-view-toggle — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — No tests (P1)

`[CODE]` There is **no `falcon-view-toggle.component.spec.ts`** (Glob of the folder returns only `.ts` / `.html` / `index.ts`). Untested behaviors: the `setValue` same-value guard (ts:44), the `valueChange` emission, active/inactive class computation, the `iconSvg` vs `icon` `@switch` branches, and `aria-selected` wiring. A signals-only OnPush component is trivial to unit-test with the modern `TestBed` component-input API.

**Recommended fix (P1):** add `falcon-view-toggle.component.spec.ts` — cover (a) clicking an inactive pill emits `valueChange` with its key + updates `value`; (b) clicking the active pill emits nothing; (c) each `iconSvg` renders the right SVG, `icon` renders `falcon-icon-{name}`; (d) `aria-selected` tracks the selected key.

### G2 — No `size` axis (P3)

`[CODE]` Fixed `px-2 py-1.5 text-xs`, icons 12×12 (html:7/13). No `sm`/`md`/`lg` input. Other Falcon controls (input, dropdown, button) offer a size axis; a view toggle next to a larger control can look undersized.

**Recommended fix (P3):** add `@Input() size?: 'sm' | 'md' | 'lg'` mapping to padding/text/icon-size class sets.

### G3 — No `disabled` state (P2)

`[CODE]` There is no `disabled` input and no per-option `disabled`. A page cannot grey-out the toggle (e.g. while data is loading or a switch is forbidden) — it can only veto the change after the fact via `(valueChange)` (the live workaround). This also means the toggle cannot be PES-gated at the component level (see INTEGRATION_VALIDATION).

**Recommended fix (P2):** add `@Input() disabled = false` (whole-control) and optional `option.disabled` per-pill; apply `disabled` attr + `aria-disabled` + a muted class, and guard `setValue` when disabled.

### G4 — No CVA / form-control variant (P3)

`[CODE]` No `ControlValueAccessor`. This is *correct* for a view switcher, but document it: anyone wanting a Reactive-Forms-bound segmented control must use `<falcon-angular-radio>` (radio-cards) instead. Optionally a sibling `FalconSegmentedControlComponent` with CVA could be offered if a form use case appears.

### G5 — Only two baked SVG icons (P3)

`[CODE]` ts:21 `FalconViewToggleSvg = 'list-bullets' | 'org-chart'` — only the two icons needed by the List/Tree site are baked into the template `@switch` (html:11-35). Any other built-in icon must go through the `icon` (Falcon icon-font class) path, or the union + `@switch` must be extended. Acceptable, but the icon story is split (baked SVG vs font class).

**Recommended fix (P3):** prefer routing ALL icons through the Falcon icon-font `icon` prop and retiring the two baked SVGs, OR formalize a small baked-icon set. Reduces template branching.

### G6 — No token contract / no style customization hook (P2)

`[CODE]` No `--falcon-view-toggle-*` token file and no `wrapperClass`/`buttonClass`/`labelClass` inputs. The active-pill color, container bg, and shadow are all hardcoded inline. A consumer that needs a different active color (e.g. a non-teal feature theme) cannot customize without forking. Contrast falcon-input's ~70 `--falcon-input-*` tokens.

**Recommended fix (P2):** extract a `view-toggle.tokens.css` scoped under `:where(.falcon-view-toggle, ...)` (gate-12 style) and read the container/active/inactive colors + shadow from `--falcon-view-toggle-*` tokens; add an optional `wrapperClass` input for layout extras.

### G7 — Raw-value style deviations (P2 — house-rule)

`[CODE]` html:8 — `shadow-[0_1px_3px_rgba(13,63,68,0.08)]` embeds a raw `rgba()` color literal (the active-pill drop shadow), and html:32 uses `text-[12px]` (arbitrary px) while the rest of the template uses the `text-xs` token. These violate the tokens-over-literals house rule. The component header comment (ts:9) frames the shadow as a deliberate spec match, but it is still a hardcoded value.

**Recommended fix (P2):** replace the `rgba()` shadow with a `--falcon-*` shadow token (folds into G6's token file) and switch `text-[12px]` → `text-xs` for consistency.

### G8 — `model.required` with no default + immediate parent-overwrite (P3)

`[CODE]` ts:41 `value = model.required<TKey>()` — required, no fallback. At the live site the parent always feeds `[value]`, so this is fine. But a consumer that forgets to bind `value` (or binds an `undefined` signal) gets a runtime "required input not set" error. Document that `value` MUST be bound.

## Missing accessibility features

- **A1 (P2):** no `aria-controls` linking each `role="tab"` to the `role="tabpanel"` it switches — the panel is rendered by the host, so the association is lost. Screen-reader users hear "tab, selected" but not what it controls.
- **A2 (P2):** **no roving-tabindex / Arrow-key navigation.** The WAI-ARIA tablist pattern expects Left/Right (or Up/Down) to move between tabs with a single tab-stop; here each `<button role="tab">` is independently Tab-focusable and there is no keydown handler. Functional (buttons are clickable + Enter/Space activate) but not spec-compliant tablist keyboarding.
- **A3 (P3):** the `role="tablist"` container has no `aria-label` / `aria-labelledby`, so the group is unnamed to AT.
- **A4 (P3):** the active pill is distinguished by color + shadow only; `aria-selected` carries the state for AT (good), but a non-color affordance (e.g. an inset ring) would help low-vision sighted users.

## Missing tests

- `[CODE]` No spec at all (G1). Add `falcon-view-toggle.component.spec.ts`.

## Missing Tailwind / token parity

- `[CODE]` No token file → nothing to keep in parity with a Stencil twin (there is no twin). The "parity" gap here is between this component's hardcoded styling and the tokenized rest of the library (G6/G7).

## Performance risks

- `[CODE]` `@for ... track opt.key` (html:2) — correctly keyed; minimal. The `[class]` string concatenation re-evaluates each CD pass but is tiny. **No real risk.** Just keep `options` referentially stable (USAGE).

## Visual / interaction risks

- `[CODE]` Active-pill detection is `value() === opt.key` everywhere — if two options share a `key`, both light up. Keys must be unique (enforced by the `track opt.key` semantics too).
- `[CODE]` Clicking the active pill is a silent no-op — intended, but a consumer expecting toggle-off behavior would be surprised. Documented.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Add component spec | P1 |
| G3 | `disabled` state (control + per-option) | P2 |
| G6 | Token contract + style hook | P2 |
| G7 | Remove raw `rgba()` shadow + `text-[12px]` | P2 |
| A1 | `aria-controls` tab↔panel link | P2 |
| A2 | Roving-tabindex + Arrow-key nav | P2 |
| G2 | `size` axis | P3 |
| G5 | Consolidate icon story | P3 |

## Recommended upgrade API (concrete)

```ts
// additive inputs
@Input() size: 'sm' | 'md' | 'lg' = 'md';
@Input() disabled = false;          // whole-control
@Input() ariaLabel?: string;        // names the tablist
@Input() wrapperClass = '';         // layout extras
// FalconViewToggleOption gains: readonly disabled?: boolean;
```

All additive — no consumer break.

## Fix-shared-vs-per-page

All gaps belong in the **shared component** (`libs/falcon/src/shared-ui/.../falcon-view-toggle`), not per-page. The two consoles already consume the same instance; per-page restyling would re-fragment what Wave 19 deliberately consolidated.

## Workarounds (if upgrade blocked)

- For G3 (disabled today): the live site's `(valueChange)` veto is the de-facto disable — block the change in the handler and let the pill snap back. Not a true visual disable.
- For G6 (restyle today): none without forking; do NOT add consumer CSS targeting the inner buttons.

## Deep-Dive Sweep Findings (2026-06-03 — B25)

**Consumer count: 2 app render sites (admin + mgmt org-hierarchy) + 0 in `libs/falcon`** (`[CODE]` grep `<falcon-view-toggle[\s>]`).

- **NEW dossier** — no prior dossier existed; created from scratch. Component stays **ACTIVE / SHARED** (the canonical segmented-view toggle; replaced the legacy `FalconOrgViewToggleComponent`).
- **No deletion/promotion flags** — it is correctly promoted and is the right home for this pattern.
- **Findings are all `safe-local`** (test gap, doc, token/raw-value cleanup) — see FINDINGS/B25.md. The two raw-value style deviations (G7) and the missing `disabled`/token contract (G3/G6) are the substantive items; none are HIGH-RISK.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) against falcon-view-toggle.component.ts (46 ln) + .html (39 ln). Gaps enumerated from live source: no spec (G1), no size (G2), no disabled (G3), no CVA (G4), 2 baked icons (G5), no token contract (G6), raw `rgba()` shadow + `text-[12px]` (G7), required-value caveat (G8); a11y A1-A4 (no aria-controls / no roving-tabindex / unnamed tablist). No deletion/promotion flags.
