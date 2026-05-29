# Falcon Stepper — Enhancement & Implementation Plan

> Author: Falcon Stepper Architect agent
> Source of truth: `C:\falcon\new Theme in react\Falcon-App (3)` (admin/addclient.css, admin/addclient.jsx)
> Target compound: `libs/falcon/src/shared-ui/lib/components/falcon-stepper/`

---

## 1. Visual Contract (locked — must match React `.ac-stepper`)

| Token             | Value                                              | Notes                              |
|-------------------|----------------------------------------------------|------------------------------------|
| Rail height       | 69 px                                              | Single full-bleed band             |
| Rail background   | `#F8F8F8`                                          |                                    |
| Rail padding      | `4px 40px 0` (top, sides, bottom)                  | bottom 0; labels live in band      |
| Track             | 4 px tall, `var(--border)` bg, rounded             | Single horizontal line             |
| Track fill        | teal `#0d3f44`, animated `width 0.4s cubic-bezier` | Grows left → current dot           |
| Dot size          | 18 px circle                                       |                                    |
| Dot idle          | `var(--border)`                                    | Solid, no border                   |
| Dot done          | teal + white check svg (11 × 11 px)                | cursor pointer (clickable)         |
| Dot active        | teal + halo `0 0 0 4px rgba(13,63,68,.12)` + inner pulsing 6 px white circle | 1.4s ease-in-out infinite |
| Dot positions     | `left: i / (n-1) * 100%` then `translate(-50%,-50%)` | 5 steps → 0/25/50/75/100 %       |
| Label             | 12 px font, weight 500, color text-muted           | Inside the rail band, below track  |
| Label first       | `text-align: start`                                |                                    |
| Label last        | `text-align: end`                                  |                                    |
| Label active      | teal + weight 700                                  |                                    |
| Label done        | full text color                                    |                                    |
| Label gap         | 14 px from track bottom                            | total band y-budget: track + 14 + label height |

### Behaviour invariants (from React `ACStepBar`)

- **Forward fill.** `pct = current / (n-1) * 100` — the fill bar grows from 0 → current step's percentage.
- **Backward release.** When `current` decreases (Previous), `pct` shrinks; **dots after current revert to idle**, **separators after current revert to gray**.
- **Done is clickable** (idle and active are not). Clicking a done dot jumps back.
- **Active is not clickable.** No hover affordance.
- **Idle is not clickable** (linear flow).

---

## 2. Why the current PrimeNG-driven approach is brittle

PrimeNG v20's `<p-step-list>` ships with these defaults (from `@primeuix/styles/stepper/index.mjs`):

```css
.p-steplist           { display: flex; align-items: center; overflow-x: auto; }
.p-step               { display: flex; flex: 1 1 auto; align-items: center; gap: ...; }
.p-step-header        { display: inline-flex; align-items: center; }   /* horizontal! */
.p-step-title         { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
.p-step-number        { min-width: var(--step-size); border: 2px solid ...; }   /* ~28 px hollow circle */
.p-step:has(~ .p-step-active) .p-stepper-separator { background: ...active; }
```

To match React we need:
- vertical-stack header (number above title) — fight `inline-flex`
- 18 px solid dot — fight `min-width: 28 px; border: 2px solid`
- titles never truncate — fight `text-overflow: ellipsis`
- title positioned absolutely under the dot — fight default flow
- a single full-width track line — PrimeNG only paints inter-step separators

Every override must beat PrimeNG specificity AND injection order. `:host ::ng-deep` works but is fragile across PrimeNG patch upgrades.

---

## 3. Three Implementation Variants

### Variant A — Tightened PrimeNG override (current direction)

Keep `<p-stepper>`, `<p-step-list>`, `<p-step>`, `<p-stepper-separator>`. Override every defaulted property aggressively in `:host ::ng-deep` with `!important`.

| Pros                                        | Cons                                                              |
|---------------------------------------------|-------------------------------------------------------------------|
| One component to author                     | Brittle on PrimeNG upgrades                                       |
| Inherits `linear`, `value()` model, ARIA    | Cannot easily render leading + trailing track bookends            |
| Smallest diff                               | Animated fill bar must be faked via `:has()` + `background`        |
| Existing `FalconStepDirective` API survives | Default `text-overflow: ellipsis` keeps biting unless `!important` |

**Verdict:** Adequate for a 2-line micro-fix; risky as a permanent solution.

---

### Variant B — Custom rail + PrimeNG step-panels (RECOMMENDED)

Replace the visual rail with our own markup (a `<div>` with track + absolute dots + labels — direct port of React `.ac-stepper`). Keep `<p-step-panels>` for the content area (animations + state already work). Keep the linear-mode logic and `currentStep` model.

| Pros                                                               | Cons                                            |
|--------------------------------------------------------------------|-------------------------------------------------|
| Pixel-perfect React parity — no PrimeNG defaults to fight          | Re-implements the rail (≈ 50 lines)             |
| Animated fill bar is just `width: ${pct}%` on a teal element       |                                                 |
| Trivial to add leading/trailing track bookends                     |                                                 |
| Done-dot click handler is a plain `(click)` — no PrimeNG hops      |                                                 |
| Survives PrimeNG patches                                           |                                                 |
| Clean Tailwind/SCSS split — utilities in template, animations in SCSS |                                              |

**Verdict:** Strongest. Recommended.

---

### Variant C — Pure custom (no PrimeNG)

Drop PrimeNG entirely from the stepper. Build rail + panels + linear flow in-house.

| Pros                                       | Cons                                                                  |
|--------------------------------------------|-----------------------------------------------------------------------|
| Full control                               | Re-implements panel animation, focus management, ARIA wiring          |
| Zero PrimeNG churn                         | Larger diff; longer review cycle                                      |
| Easier theming through CSS variables       | Loses parity with other PrimeNG-driven Falcon components              |

**Verdict:** Reserve for a future "shared-ui v2" rewrite. Overkill for now.

---

## 4. Recommended Path — Variant B

### 4.1 Component structure

```
<falcon-stepper>            ← host
  <header.fs-rail>          ← custom rail (Tailwind utilities)
    <span.fs-track>          ← 4 px line, full width
      <span.fs-fill>         ← teal fill, width: pct%
    <button.fs-dot[i] left:%>← absolute, click jumps if done
    <span.fs-label[i]>      ← absolute below dot, first text-start, last text-end
  <p-step-panels>           ← PrimeNG, unchanged
    <p-step-panel>           ← per registered FalconStepDirective
  <footer.fs-footer>        ← Next / Back / Cancel (consumer-overridable via FalconStepperFooterDirective)
```

### 4.2 SCSS surface (only what cannot be done in Tailwind)

- `@keyframes fs-pulse` — inner-dot pulse 1.4s.
- Active dot halo `box-shadow` (Tailwind would need an arbitrary value; SCSS is cleaner).
- White check SVG via `background-image` data URL on done dots.
- Smooth fill transition (`transition: width 0.4s cubic-bezier(0.65, 0, 0.35, 1)`).

### 4.3 Behaviour wiring

- `currentStep` is a `model<number>(1)`.
- `pct = computed(() => steps().length <= 1 ? 0 : (currentStep() - 1) / (steps().length - 1) * 100)`.
- `dotState(i) = computed(() => i + 1 < currentStep() ? 'done' : i + 1 === currentStep() ? 'active' : 'idle')`.
- `onJump(i)` — only fires when target `i` is `done`. Updates `currentStep`.
- Backward release behaviour falls out of `dotState` automatically.

### 4.4 Accessibility

- Rail: `role="tablist"`.
- Each dot button: `role="tab"`, `aria-selected="<i+1===currentStep()>"`, `aria-current="step"` when active, `aria-controls="<panelId>"`, `tabindex="-1"` when not active.
- Each panel: `role="tabpanel"`, `id="<panelId>"`, `aria-labelledby="<dotId>"`.
- Pulse animation respects `prefers-reduced-motion: reduce` (animation paused).

### 4.5 RTL

- Use `inset-inline-start: ${pct}%` for dots/fill so RTL flips for free.
- Translate factor inverts: keep `translateX(-50%)` (still correct because `inset-inline-start` is logical).

---

## 5. Out-of-scope polishments captured for the wizards

These do not block stepper work but ride along in the same milestone.

### 5.1 Validation polish — Add Client wizard

| Step              | Field gaps                                                                                          |
|-------------------|-----------------------------------------------------------------------------------------------------|
| Client Information| `accountOfficial.firstName/lastName` should run `personNameValidator`; `accountOfficial.email` should run `emailValidator`; `accountOfficial.phone` should run `phoneValidator`. Currently only `accountName` is validated. |
| Settings          | `maxNodeLevel`, `maxNormalUserLimit`, `maxSystemUserLimit` need integer + range validation; `balanceTransferLimit` needs `balanceTransferLimitValidator`; `allowedIps` list needs `allowedIpListValidator`. |
| CommChannels      | At least one channel must be enabled — group-level validator required.                              |
| Applications      | Each enabled app needs a non-empty plan reference (cross-row validator).                            |
| Account Owner     | `firstName/lastName` → `personNameValidator`; `userName` → `userNameValidator` + `userNameUniqueValidator`; `email` → `emailValidator`; `phone` → `phoneValidator`; `password` → `passwordValidator(level)` based on settings choice; confirm-password matches. |

### 5.2 Validation polish — Add User wizard

| Step              | Field gaps                                                                                          |
|-------------------|-----------------------------------------------------------------------------------------------------|
| Personal          | Already wired (`personName`, `userName`, `password`, `phone`, `email`). Add `userNameUniqueValidator` async. Add national-ID format check (10 digits KSA) when present. |
| Role / Status     | `roleAssignmentValidator(callerRole)` with caller-role guard; status enum-bound.                    |
| Permissions       | `permissionGroupValidator` per assignment; warn when no permission group is chosen.                 |

### 5.3 UX polishments

- Field-level errors should appear after the field is **blurred** *or* the wizard tried to advance — not as the user types into an empty input.
- Error summary banner above each step listing all failing fields (links scroll into view + focus).
- Disable Next when current step is invalid; keep Back always enabled (linear flow allows backtracking).
- Sticky footer with Back / Next / Cancel; show step counter ("Step 2 of 5") on the right.
- Reduced-motion: skip the pulse animation, snap fill bar instead of animating.
- High-contrast mode: bump dot border to 2 px solid teal for forced-colors mode.

---

## 6. Acceptance criteria

A reviewer should be able to load the wizard at the same browser size as the React reference and see:

1. Rail is a single `#F8F8F8` band, 69 px tall, full bleed.
2. Track is 4 px, idle gray, with a teal fill that ends exactly at the active dot's centre.
3. Five 18 px dots at 0/25/50/75/100 %; first label left-aligned, last right-aligned, middle three centred.
4. Active dot has the halo + pulse; done dots show a white checkmark; click on a done dot navigates back; idle dots are not clickable.
5. Pressing Previous shrinks the fill, reverts trailing dots to idle, reverts trailing label colours.
6. Each panel renders its registered `FalconStepDirective` content; only one panel visible at a time.
7. RTL: layout mirrors; the leftmost dot in LTR becomes the rightmost in RTL; fill grows from the inline start.
8. Keyboard: tab into the rail focuses the active dot; arrow keys do nothing (linear); enter/space on a done dot navigates.
9. No PrimeNG default class leaks alter the visual (no `inline-flex` headers, no truncated titles).

---

## 7. Rollout sequence

1. Land Variant B — replace the rail markup; keep `FalconStepDirective` and `FalconStepperFooterDirective` APIs identical.
2. Migrate Add Client wizard usage (no API change required) — visual smoke check.
3. Migrate Add User wizard usage — visual smoke check.
4. Add the validation polish list (section 5).
5. UX polishments (section 5.3) — separate small PRs.
