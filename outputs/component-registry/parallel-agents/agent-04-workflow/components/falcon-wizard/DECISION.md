# falcon-angular-wizard — DECISION

## Brain SK final recommendation

### Status
- **READY** for new wizards. Architect §5.12.3 + Wave 5 contract validated.

### Use this component for
- ANY new multi-step business form (Add Client, Add User, Add Subscription, Add Contact Group, etc.).
- Wraps `<falcon-angular-stepper>` plus a Next/Back/Finish/Draft footer plus a Reactive-Forms `stepControls` validation bridge.

### Avoid this component for
- Tabs / non-sequential navigation — use `<falcon-angular-tabs>` `mode="navigation"`.
- Single-step forms — just use the form + a normal button row.
- Wizards where each step needs its own page-level chrome (separate header + footer per step) — that pattern requires per-step routing and individual pages.

### Preferred variant / render path
- **`useTailwind=true` (default)** — Light DOM.
- `useTailwind=false` for foreign hosts without Falcon Tailwind.

### Required upgrades before wider use
1. **Fix `step.status` visualization** — either thread through to embedded stepper OR remove from type. (P0)
2. **Add `disabled?: boolean` overall flag + `busy?: boolean` overlay** for async-submit scenarios. (P2)
3. **Add `reset()` method** for post-submit reuse. (P2)
4. **Improve async-validator awaiting** in the `stepControls` derived validator. (P2)
5. **Add `Skip` button** for optional steps. (P1)
6. **Plan + execute org-hierarchy wizard migration** from legacy bespoke stepper.

### Relationship to other components
- Composes `<falcon-angular-stepper>` internally.
- Pairs with `<falcon-angular-popup variant="unsaved">` for cancel-with-dirty-state confirm (consumer-owned).
- Uses `<falcon-angular-button>` styling for the footer (matches token-based theme).

### Exact rule for future implementation tasks
> "All new wizards MUST use `<falcon-angular-wizard>`. Per-step bodies are projected via `slot='step-{index}'`. Validation gating MUST use `[stepControls]` (one AbstractControl per step) or `[validateStep]` for custom async logic. Cancel-with-dirty-state is handled by the consumer using `<falcon-angular-popup variant='unsaved'>` — NOT inside the wizard."

---

## Dynamic capability assessment

### 1. What is static today?
- Footer button order (Back | extra | Draft | Next/Finish) — not configurable.
- Header / content / footer layout is fixed three-row vertical.
- `step.status` field defined but not visualized.
- No `Skip` button.
- No `Reset` method.
- No `disabled` overall flag.
- No `busy` overlay.

### 2. What is already dynamic through inputs/outputs?
- `steps[]` array.
- `currentStep` (two-way).
- `canProceed`, `showDraft`, `showBack`, `showFinish` toggles.
- `nextLabel`, `backLabel`, `finishLabel`, `draftLabel` strings.
- `size` (forwarded to stepper).
- `validateStep` OR `stepControls` for validation.
- `useTailwind` toggle.
- 6 outputs: next, back, finish, draft, stepChange, stepValidationFail.

### 3. What is already dynamic through slots / ng-template?
- `slot="header"` — content above the stepper.
- `slot="step-{index}"` — per-step body.
- `slot="footer-extra"` — extra footer content.
- All three are real CSS-Shadow slot names; in the Angular wrapper, consumers project with `<ng-content select="[slot=header]"></ng-content>` etc.

### 4. What is dynamic through token / theme overrides?
- Wizard-scoped tokens in `wizard.tokens.css` (audit-needed) — content padding, footer padding, button colors per variant, header margin.
- Embedded stepper tokens (full 14 categories of `stepper.tokens.css`).
- Per-instance override: `<falcon-angular-wizard class="add-client-wizard">` + `:where(.add-client-wizard) { --falcon-wizard-…: …; }`.

### 5. What is dynamic through Tailwind classes?
- Outer wrapper class (`class="…"`) for margins / max-width / shadow.
- Step body components (slot content) are pure Angular — Tailwind utilities apply normally.

### 6. What is missing to make this component reusable across pages?
- `step.status` visualization. (P0)
- `Skip` button for optional steps. (P1)
- `disabled` + `busy` overall flags. (P2)
- `reset()` method. (P2)
- Async-validator awaiting in `stepControls` bridge. (P2)
- Per-step header slot (`slot="header-{index}"`). (P1)
- Lazy step-body rendering option. (P3)

### 7. What capability should be added to the shared component vs a one-off page hack?
- All of the above belong in the shared wizard — fragmenting the contract would defeat its purpose.
- Cancel-with-dirty-state confirm stays at the consumer (it's tied to consumer's app-wide unsaved-changes pattern).

### 8. What flags / options / templates / slots would make it better?
- `disabled?: boolean` Input.
- `busy?: boolean` Input + spinner overlay.
- `showSkip?: boolean` Input.
- `skipLabel?: string` Input.
- `reset(): Promise<void>` Method.
- `stepIndexOffset?: 0 | 1` Input for migration parity.
- `lazyStepBodies?: boolean` Input.
- `slot="header-{index}"` per-step header.

### 9. What is the safest upgrade path?
1. Fix `step.status` visualization (purely additive — currently a no-op).
2. Add `disabled` + `busy` Inputs (purely additive).
3. Add `reset()` Method (purely additive).
4. Add `Skip` button + `showSkip` + `skipLabel` (purely additive).
5. Add `stepIndexOffset` migration shim (purely additive, default `0`).
6. Add `slot="header-{index}"` (purely additive).
7. Migrate org-hierarchy wizards from legacy stepper onto this wizard — BIG WAVE.

### 10. What would be risky to change because other pages depend on it?
- **`currentStep` semantics (0-indexed)** — any future migration assumes 0-indexed. Adding `stepIndexOffset` mitigates this.
- **`steps[]` shape** — adding optional fields is safe; making fields required is breaking.
- **Footer button order** — any consumer that styles them via CSS would notice a reordering.
- **`validateStep` precedence over `stepControls`** — if a consumer thought they combine, behavior would surprise them; document loudly.
- **Stencil event names** (`falconWizardNext`, `falconWizardBack`, `falconWizardFinish`, `falconWizardDraft`, `falconWizardStepChange`, `falconStepValidationFail`) — renaming breaks consumers.
