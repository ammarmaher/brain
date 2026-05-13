# falcon-stepper (LEGACY) — DECISION

## Brain SK final recommendation

### Status
- **LEGACY-IN-USE** (Wave 3 refactor preserved API; Falcon-only, no PrimeNG).
- Roadmap: deprecate after admin-console + management-console wizards migrate to `<falcon-angular-wizard>` (which wraps `<falcon-angular-stepper>`).

### Use this component for
- Already-existing add-client / add-user wizards in admin-console and management-console — keep them compiling until migration.
- **Nothing else.** No new consumers.

### Avoid this component for
- New wizards.
- Any new page that needs a step rail.
- Standalone playground / showcase demos — use `<falcon-angular-stepper>` instead.

### Preferred variant / render path
- **N/A** — pure Angular bespoke, single render path.

### Required upgrades before wider use
- **NONE.** Do not invest in this component. Invest in the migration to `<falcon-angular-stepper>`.

### Relationship to other components
- Public surface roughly maps to `<falcon-angular-stepper>` + `<falcon-angular-wizard>`:
  - `[(currentStep)]` (1-indexed number) → `[(activeValue)]` on the new stepper (any string|number).
  - `[valid]` → wizard `[canProceed]`.
  - `[linear]` → stepper `mode="linear"`.
  - `(back)` / `(cancel)` / `(finish)` → wizard `(falconWizardBack)` / `(falconWizardDraft)` (or custom cancel handler) / `(falconWizardFinish)`.
  - `<falcon-step label="…"><ng-template>…</ng-template></falcon-step>` → `step.label` + `<div slot="content-{value}">…</div>`.
  - `<ng-template falconStepperFooter let-…>` → either wizard's built-in footer or `<div slot="footer-extra">`.

### Exact rule for future implementation tasks
> "Do NOT add new consumers of the legacy `<falcon-stepper>` (`libs/falcon/src/shared-ui/`). For new code, always use `<falcon-angular-wizard>` (which wraps `<falcon-angular-stepper>`). Existing wizards (add-client, add-user in both consoles) remain on the legacy stepper until the migration Wave ships."

---

## Dynamic capability assessment

### 1. What is static today?
- The footer (when no custom template is provided) is a fixed Next + Back/Cancel row.
- Dot states are limited to `idle / active / done` — no `error` state.
- The dot visuals (sizes, colors) come from the SCSS file — not tokenized.
- The pulse animation is in SCSS without `prefers-reduced-motion` honor.
- Translation is mandatory.

### 2. What is already dynamic through inputs/outputs?
- `[(currentStep)]` two-way.
- `[valid]`, `[linear]`.
- `[nextLabelKey]`, `[backLabelKey]`, `[finishLabelKey]`, `[cancelLabelKey]` (translation keys).
- Outputs: `back`, `cancel`, `finish`.

### 3. What is already dynamic through slots / ng-template?
- One `<falcon-step>` per step, each with a child `<ng-template>` body.
- One `<ng-template falconStepperFooter let-step let-valid let-isFirst let-isLast>` for custom footer.

### 4. What is dynamic through token / theme overrides?
- **Almost nothing.** Only the few `var(--color-falcon-neutral-150, …)` arbitrary values bound inline in the template.

### 5. What is dynamic through Tailwind classes?
- Layout (flex, gap, padding) — yes.
- Visual (dot bg, label color, fill bar) — NO. Owned by SCSS.

### 6. What is missing to make this component reusable across pages?
- Token-driven visuals (full 14-category token contract is the goal — but invest in the new stepper, not this one).
- Per-step error state.
- Keyboard nav.
- A11y improvements (roving tabindex, aria-orientation).

### 7. What capability should be added to the shared component vs a one-off page hack?
- **None — do NOT add to this component.** Add to `<falcon-angular-stepper>` instead.

### 8. What flags / options / templates / slots would make it better?
- Don't enhance. Migrate.

### 9. What is the safest upgrade path?
- **Plan the migration wave.** Touch points:
  - 4 wizard components (admin-console + management-console; client + user).
  - Each wizard has 3-5 step body components — those stay unchanged.
  - 2 `react-*` wrappers (admin-console organization-hierarchy-page) — they delegate to the org-hierarchy wizards, so a change ripples automatically.
- After migration, delete:
  - `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` (the whole folder).
  - The barrel re-exports in `libs/falcon` → `index.ts`.

### 10. What would be risky to change because other pages depend on it?
- The 4 wizards listed in OVERVIEW.md depend on the public selector + Inputs + Outputs + the two directives.
- The `currentStep` model uses 1-indexed numbers; the new stepper uses `string|number` values. Migration must remap consumer logic.
- The `<falcon-step label="…">` directive must be replaced with `[steps]` array literal — restructure the template.
- The `<ng-template falconStepperFooter>` must be replaced with `<falcon-angular-wizard>` footer-extra slot + wizard inputs (showBack/showDraft/showFinish/nextLabel/backLabel/finishLabel/draftLabel).
- Any per-instance custom SCSS the wizard pages add via `[class]` hooks needs to be re-expressed as Tailwind utilities or token overrides.
