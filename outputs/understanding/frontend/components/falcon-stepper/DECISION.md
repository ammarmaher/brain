# falcon-angular-stepper — DECISION

## Brain SK final recommendation

### Status
- **NEEDS-UPGRADE.** The component is production-ready visually but no real consumer is wired to it yet — the org-hierarchy wizards still consume the legacy bespoke stepper.

### Use this component for
- Multi-step wizards (Add Client / Add User / Add Service / etc.).
- Any "step X of Y" progress indicator above a sequential workflow.
- Compose with `<falcon-angular-wizard>` for full navigation (Next/Back/Finish/Save Draft + validation gates).

### Avoid this component for
- Tab-style navigation between unrelated sections — use `<falcon-angular-tabs>` `mode="navigation"`.
- Free-form / non-sequential menus — use `<falcon-angular-menu>` or a custom side rail.
- A "checklist" view (n boxes, user ticks each) — use `<falcon-angular-checkbox-group>`.
- Single-screen progress bars without distinct steps — use `<progress>` or a custom Tailwind utility.

### Preferred variant / render path
- **`useTailwind=true` (default)** — Light DOM `<falcon-stepper-tw>` keeps the consumer's Tailwind utilities cascading in and lets the Studio mutate `--falcon-stepper-*` tokens at runtime.
- Use `useTailwind=false` (Shadow) only when:
  - The stepper is embedded in a foreign host outside the Falcon Tailwind scanner reach.
  - Hard style isolation is required (rare).

### Required upgrades before wider use
1. **Plan + execute the migration** of admin-console + management-console `add-client-wizard` and `add-user-wizard` from the legacy `FalconStepperComponent` (under `libs/falcon/src/shared-ui/`) onto `FalconAngularStepperComponent`.
2. **Resolve the `labelPosition` default asymmetry** between Shadow (`'top-center'`) and Light (`'bottom-center'`).
3. **Add per-step custom-dot / custom-label slot directives** so wizard step decorations (e.g., a tiny "saving…" spinner on the active step) don't require a fork.
4. **Add `aria-orientation`** on the outer `<div role="group">` for vertical mode.
5. **Add dark-mode token overrides** in `falcon-tailwind-tokens.css`.

### Relationship to other components
- `<falcon-angular-wizard>` composes this stepper as its progress display. Use the wizard when you also need Next/Back/Finish/Save buttons + per-step validation.
- The legacy bespoke `<falcon-stepper>` (in `libs/falcon/src/shared-ui/`) is REFERENCE-ONLY — see `falcon-stepper-legacy/`.
- Tabs (`<falcon-angular-tabs>` `mode="navigation"`) is the non-sequential cousin.

### Exact rule for future implementation tasks
> "All new wizards MUST use `<falcon-angular-wizard>` (which wraps `<falcon-angular-stepper>`). All new step-progress indicators MUST use `<falcon-angular-stepper>` directly. Use the legacy `FalconStepperComponent` ONLY for code already on it pending migration — never for new features."

---

## Dynamic capability assessment

### 1. What is static today?
- The dot inner content is hard-coded to one of {number, check SVG, pulse, font icon} — no slot for full custom decoration.
- The label is rendered as a plain `<span>` with `step.label` text — no template for rich labels (label + chip + tooltip).
- Per-step error message: dot turns red but the message itself is NOT rendered next to the label.
- The footer (Next/Back) is owned by the wizard, not the stepper — pure stepper has zero footer affordances.
- Dark-mode tokens are not provided.

### 2. What is already dynamic through inputs/outputs?
- `steps[]` array — every step's value, label, description, icon, disabled, optional, errorMessage.
- `activeValue`, `completedValues` — drive dot states + fill bar.
- `mode` (linear vs non-linear), `orientation` (horizontal/vertical), `size` (3-step scale), `labelPosition` (3 options), `showStepNumbers`, `showCheckOnComplete`, `disabled`, `helperText`, `errorMessage`, `groupLabel`, `ariaLabel`.
- `useTailwind` toggles Shadow vs Light render path.
- `rootClass` — caller layer of utility classes.
- 3 `@Output()`s: `valueChange`, `stepClick`, `stepComplete`.
- 3 callable `@Method()`s: `next()`, `prev()`, `goTo(value)`.

### 3. What is already dynamic through slots / ng-template?
- One slot per step: `content-{value}` (e.g., `slot="content-info"`). Rendered as the panel body for that step.
- Vertical mode: same slot, rendered inline under each label.
- Horizontal mode: panels region renders below the dot row, only the active panel is visible.
- _None observed in active source_ for dot or label slots.

### 4. What is dynamic through token / theme overrides?
- Every visual value documented in `stepper.tokens.css` (14 categories ≈ 70+ CSS variables): colors per state, sizes per size scale, transitions per category, halo / focus / error rings, label max-width + padding, optional tag font, group label font/size, helper + error message visuals.
- Per-instance override: `<falcon-angular-stepper class="my-stepper">` + `:where(.my-stepper) { --falcon-stepper-…: …; }` lets one instance differ without forking the component.

### 5. What is dynamic through Tailwind classes?
- `rootClass` adds utilities to the outer Stencil element.
- The Angular wrapper's hostbinding adds `falcon-angular-stepper` class — consumers can layer on it via `:host(.falcon-angular-stepper).special-context { … }` (but token overrides are preferred).

### 6. What is missing to make this component reusable across pages?
- **Per-step custom-dot slot** (or `[falconStepperDot]` Angular directive).
- **Per-step custom-label slot.**
- **Per-step error-message INLINE rendering** (not just the dot color).
- **`canAdvance` / async validation gate** on the stepper itself (today only the wizard wrapper has it).
- **`stepIndicator?: string`** ("Step 2 of 5") helper — eliminates per-consumer string concat.
- **Dark-mode tokens** for upcoming/active/completed.
- **Density support** (compact mode reducing vertical gap + label margin).
- **`aria-orientation`** correctness for vertical mode.

### 7. What capability should be added to the shared component vs a one-off page hack?
- Custom dot / label / per-step error rendering — SHARED (add slots + directives). Per-page would fragment the visual contract.
- Validation gates — SHARED on the stepper, but with the wizard wrapper continuing to own the wider Next/Back UX.
- Dark mode — SHARED (theme tokens).
- Density — SHARED.
- Studio integration for the new slots — SHARED, with token surfaces.

### 8. What flags / options / templates / slots would make it better?
- `dotTemplate: TemplateRef<{ step, state, index }>` per step (Angular projection).
- `labelTemplate: TemplateRef<{ step, state }>` per step.
- `errorTemplate: TemplateRef<{ step, message }>` for the inline error renderer.
- `density: 'comfortable' | 'compact'` Input.
- `dir: 'ltr' | 'rtl' | 'auto'` Input (or read from computed style).
- `stepIndicator: boolean | (current, total) => string` Input.
- `canAdvance: (current, next) => boolean | Promise<boolean>` async gate.
- `prefersReducedMotion` honor (auto-pause the pulse animation).

### 9. What is the safest upgrade path?
1. Add per-step slots (`dot-{value}`, `label-{value}`, `error-{value}`) with fallback to current rendering — purely additive, zero break.
2. Add Angular directives (`[falconStepperDot]`, `[falconStepperLabel]`, `[falconStepperError]`) that materialize into those slots — purely additive.
3. Add `aria-orientation` on the outer group — purely additive.
4. Add `density` Input, default `'comfortable'` — purely additive.
5. Add `canAdvance` Prop + `falcon-blocked` event — purely additive.
6. Migrate org-hierarchy wizards onto `<falcon-angular-stepper>` (this is the big work, but it doesn't change the component itself — it changes consumers).
7. Align `labelPosition` defaults between Shadow and Light DOM (THIS IS BREAKING if a current consumer relies on the difference — audit before changing).
8. Add dark mode tokens — purely additive.

### 10. What would be risky to change because other pages depend on it?
- **`labelPosition` default** — Shadow uses `'top-center'`, Light uses `'bottom-center'`. Aligning them is a breaking visual change for any playground / test rig that snapshots layout.
- **Removing legacy `step.errorMessage` paint-only semantics** in favor of inline rendering — if any consumer relies on the current "dot-only red" behavior, the new inline message text could shift layout.
- **`steps[]` is reference-tracked** — if consumers rely on the array being mutated in place (vs replaced), the eager `_steps` setter would silently fail to push updates.
- **Stencil event names** are `falcon-change`, `falcon-step-click`, `falcon-complete`, `falcon-blur` — renaming them is a breaking change. Outputs on the wrapper (`valueChange`, `stepClick`, `stepComplete`) abstract this for Angular consumers, but direct Stencil consumers (rare) would break.
- **The `@Method()` calls** (`next`, `prev`, `goTo`) are public — third-party consumers might invoke them via `await stepperEl.next()`. Renaming would break callers.
