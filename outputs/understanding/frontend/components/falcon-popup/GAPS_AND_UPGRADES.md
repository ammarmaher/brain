# falcon-popup — GAPS AND UPGRADES

> Gap IDs stabilised 2026-06-03 (B14). All findings this pass are DOC/audit only — nothing fixed.

## Missing capabilities (active source verified)

### G-LOADING — no loading / disabled state on the confirm action (P0)
`[CODE]` After clicking "Delete", the popup stays open and the Confirm button is clickable again. There is no built-in way to show a spinner during async work, disable both buttons in-flight, or display an error state. Consumers either close-then-run (loses context on failure) or manage a parallel signal (popup has no such inputs).

**Proposed:** `readonly loading = input<boolean>(false)` (disable both buttons, spinner on confirm) + `readonly confirmDisabled = input<boolean>(false)`. **risk-class: safe-local** (additive inputs).

### G-VARIANT — no 5th variant without source changes (P1)
`[CODE]` ts:32,47 — `VARIANTS` is typed against the 4-member union. Adding `archive`/`restore` requires editing the union + the `VARIANTS` map + the `<svg>` `@switch` (ts:134-162). Workaround: `<falcon-angular-confirm-dialog>` for non-canonical flows. **risk-class: safe-local** (extensibility design).

### G-ICONS — icons are hardcoded inline SVG, not `<falcon-angular-icon>` (P1)
`[CODE]` ts:132-163 — four hardcoded inline `<svg>` paths in an `@switch`. Bypasses the vendored Falcon icon font + the `<falcon-angular-icon>` abstraction → inconsistency; brand-icon changes require popup source edits. Swap for `<falcon-angular-icon [name]="content().icon">`. **risk-class: safe-local**.

### G-TOKENS — no token file (P1)
`[CODE]` Unlike dialog/drawer, popup has no `popup.tokens.css`. Visual customisation requires editing the inline template's Tailwind classes; the `::backdrop` dim is a literal (not dark-mode-aware). Introduce `popup.tokens.css` with per-variant accent/chip/surface + motion + backdrop tokens, then refactor to arbitrary-value token utilities. **risk-class: safe-local** (visual-identical until consumers override).

### G-FOCUS — no hand-rolled Tab-cycle trap (P2 — DOWNGRADED from prior P0)
`[CODE]` ts:101-112 — **CORRECTION (2026-06-03):** the popup now renders inside a native `<dialog>.showModal()`, which **confines focus to the dialog + makes the rest of the page inert**. The prior dossier's "P0 — keyboard users can tab into the page underneath" is **no longer accurate** — the native modal handles the business-critical containment. What remains absent is a *hand-rolled* focus-cycle wrap at the first/last focusable boundary (dialog/drawer have one in their Stencil cores) + explicit focus-restore-on-close. Native `showModal()` does restore focus to the invoker by default. **risk-class: safe-local** (the residual is a polish, not a WCAG blocker now).

### G-SELFCLOSE-DOC — does not self-close (P3 docs)
`[CODE]` ts:408-414 — `confirm`/`cancel` only emit; the flow toggles `[open]`. Already documented; keep the "close AFTER async" warning prominent. **risk-class: safe-local** (doc).

### G-NAME-CONSISTENCY — `[name]` interpolation is delete-only (P3)
`[CODE]` ts:63 — other variants ignore `name`. Inconsistent but harmless. **risk-class: safe-local**.

## Drift corrected this pass (B14 — 2026-06-03)

### DRIFT-TOPLAYER — native `<dialog falconOverlay="modal">` (was "fixed wrapper + HostListener") (🟠)
`[CODE]` ts:101-112,230-289 — the prior dossier described an outer `.fixed` backdrop wrapper + `@HostListener('document:keydown.escape')`. The live component renders a native `<dialog>` promoted into the Top Layer; ESC is the native `cancel`→`close`→`(falconClose)="onCancel()"`; focus is natively contained. CORRECTED in OVERVIEW / API / INTEGRATION / BUSINESS, and G-FOCUS downgraded. **risk-class: safe-local** (doc).

### DRIFT-DEFAULTS — `iconBg`/`iconColor`/`glossy` default `undefined`, not `true` (🟡)
`[CODE]` ts:309-311,333-335 — the toggles default to `undefined` (sentinel → `FalconConfigurationService.popup.*`), NOT `true`. The prior API table was wrong. CORRECTED in API. **risk-class: safe-local**.

### DRIFT-HIDE-INPUTS — `hideCancel` / `hideConfirm` were missing (🟡)
`[CODE]` ts:322-323 — two orthogonal footer-button toggles (OK-only / dismiss-only) — absent from the prior API table. The HTTP-error host binds `[hideCancel]="true"`. ADDED to API/USAGE. **risk-class: safe-local**.

### DRIFT-HINTS — `error`/`delete` default hints are EMPTY (🟡)
`[CODE]` ts:56,67 — both are `''`, not "Error code: T2-409 · No data was changed." (the prior BUSINESS.md value was fabricated). CORRECTED in API/BUSINESS. **risk-class: safe-local**.

### DRIFT-CONSUMERS — sweep refreshed (🟡)
`[CODE]` grep 2026-06-03 → **5 app files / 9 + 0 direct in libs/falcon** (templates-wizard ×2, wallet confirm-save, showcase) PLUS 2 library host components. The prior 8 hits (org-hierarchy add-user/add-client/page-menu/applications-table, otp-dialog) are stale. CORRECTED in OVERVIEW/USAGE. **risk-class: safe-local**.

## Missing ng-template / template slots
- No body slot — body is string + signal-driven override (rich content unsupported).
- No footer slot — buttons are fixed at ≤2 (cancel + confirm, gated by `hideCancel`/`hideConfirm`); no tertiary button (G-TERTIARY).
- No icon slot — icons hardcoded per variant (G-ICONS).

## Missing flags / options / states
- `loading` / `confirmDisabled` (G-LOADING).
- `tertiaryButton` for 3-button decisions (Save / Discard / Cancel) (G-TERTIARY).
- `dismissible` — today Esc/backdrop always dismiss; no way to force a button choice (G-DISMISS).
- `size` / `position` — always centered `max-w-md`.

## Missing accessibility features
- **A1 (P2):** no `aria-describedby` linking body/hint to the dialog.
- **A2 (P2):** double `role="dialog"` + `aria-modal="true"` (on the native `<dialog>` AND the inner `<article>`, ts:101-116) — redundant; the inner one is superfluous. Drop the inner pair.
- **A3 (P3):** close × `aria-label="Close"` hardcoded English (ts:174).
- Uses `aria-label="<resolvedTitle>"` rather than `aria-labelledby` → no programmatic link to the rendered `<h2>`.

## Missing tests
- `[CODE]` No library `.spec.ts` (verified 2026-06-03). No visual regression for the 4 variants. (Consumer-side `confirm-save-modal.spec.ts` exists but is not a library spec.) GAP G-TEST: add a spec covering variant content, override fallback (`pick`), `hideCancel`/`hideConfirm`, the config-default chain, and backdrop-click→cancel. **risk-class: safe-local**.

## Missing Tailwind / token parity
N/A — popup is Tailwind-direct, no Shadow/Light split. (The token-file absence is G-TOKENS.)

## Performance risks
- Backdrop-blur (`glossy`) heavy on low-end devices (now in the `::backdrop` — applies to the whole viewport).
- `OnPush` + computeds — efficient.

## Visual / interaction risks
- "Cancel" always `variant="secondary"`; "Confirm" matches the confirm tone, but `unsaved`'s confirm is RED ("Discard & leave") — intentional (destructive) but can read as "wrong" without context. Do NOT change.
- The icon chip has no animation — opens with the panel scale-in.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| G-LOADING | `loading` / `confirmDisabled` inputs | P0 | safe-local |
| G-TOKENS | Introduce `popup.tokens.css` | P1 | safe-local |
| G-ICONS | Replace inline SVG with `<falcon-angular-icon>` | P1 | safe-local |
| G-VARIANT | 5th-variant extensibility | P1 | safe-local |
| A2 | Drop the inner duplicate `role="dialog"` | P2 | safe-local |
| G-FOCUS | Hand-rolled Tab-cycle + explicit restore (polish) | P2 | safe-local |
| G-TERTIARY / G-DISMISS | tertiary button / `dismissible` | P2 | safe-local |
| G-TEST | Add a library spec | P2 | safe-local |

## Recommended upgrade API (proposed)
```ts
readonly loading = input<boolean>(false);
readonly confirmDisabled = input<boolean>(false);
readonly dismissible = input<boolean>(true);
readonly tertiaryButton = input<{ label: string; tone: 'ghost' | 'primary'; } | null>(null);
readonly tertiary = output<void>();
```

## Future-proof recommendation
Two competing directions, both defensible:
1. **Keep it standalone** (current) — add `loading`/tokens/icon-abstraction. Lowest risk; the native `<dialog>` already gives focus containment, so the old "compose dialog for the focus trap" argument is weaker now.
2. **Compose `<falcon-angular-dialog>`** — would consolidate motion/backdrop tokens + dedupe modal scaffolding, BUT dialog is itself @deprecated-for-direct-use and pure-Angular popup is simpler. **Recommendation: stay standalone + add the token file + loading state** rather than refactor onto dialog.

## Wave 7 Findings (2026-05-17)
**Consumer count: 8** ([CODE] grep `<falcon-angular-popup>`). See `USAGE.md` for the (now-stale) file list.

## Deep-Dive Sweep Findings (2026-06-03 — B14)
**Consumer count: 5 app files / 9 occurrences + 0 direct in `libs/falcon` (2 library host components compose it)** ([CODE] grep `falcon-angular-popup`).

Status stays **ACTIVE / PREFERRED for the 4 canonical flows.** Findings: DRIFT-TOPLAYER (architecture — biggest), DRIFT-DEFAULTS (sentinel toggles), DRIFT-HIDE-INPUTS, DRIFT-HINTS (empty `error`/`delete` hints), DRIFT-CONSUMERS; G-LOADING / G-TOKENS / G-ICONS / G-VARIANT carried; **G-FOCUS DOWNGRADED P0→P2** (native `showModal()` contains focus). **0 HIGH-RISK-QUEUE** — all `safe-local` (the focus a11y concern is now mitigated by the platform, and the residual upgrades are additive). See FINDINGS/B14.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against the 416-line source. The headline change is the focus-trap reframing (native `<dialog>.showModal()` confines focus → G-FOCUS no longer a P0 WCAG blocker) + the architecture/defaults/inputs/hints drift corrections. No deletion/promotion flags — stays ACTIVE/PREFERRED.
