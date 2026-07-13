# falcon-completion-success-dialog — GAPS AND UPGRADES

> **This file holds the B18 AUDIT findings for this unit in prose.** Findings rows also in `plans/library-deep-dive/FINDINGS/B18.md`. **We fix NOTHING this pass.**

## Missing / risky capabilities (active source verified)

### G-TOKENS — inline `styles:` block + literal backdrop, no token file (🟠, safe-local)

`[CODE]` `falcon-completion-success-dialog.component.ts:37-81` ships an inline `styles: [...]` block (Tailwind-only house-rule violation) carrying raw literals: `::backdrop { background: rgba(13,63,68,0.45); backdrop-filter: blur(2px); }` (:76-80), keyframe transforms, and `padding:1.5rem` (:74). No `completion-success.tokens.css` exists. This is the SAME deliberate native-`<dialog>` Top-Layer pattern as `falcon-popup` (also inline styles, also no token file) — *accepted-but-flagged*.

**Recommended:** mint a shared `--falcon-overlay-backdrop-{color,blur}` token (the SAME literal recurs in `falcon-dialog`/`falcon-popup` `::backdrop` per B14) + `--falcon-completion-success-{radius,shadow}` tokens, and reference them from the inline block. Low risk (additive), but touches the inline style → bundle in with a tokens pass.

### G-PX — arbitrary-px off the Falcon scale (🟡, safe-local)

`[CODE]` `.html:27,71` — `rounded-[18px]`, `text-[22px]`, `max-w-[560px]`, `shadow-[0_24px_60px_rgba(0,0,0,0.18)]`; inline `padding:1.5rem` (:74). Off the `--falcon-radius-*` / `--falcon-font-size-*` / spacing scales.

**Recommended:** map to nearest Falcon tokens (or mint exact ones if the React-parity pixel values must be honored).

### G-SVG-LITERALS — decorative SVG uses raw hex, not theme-aware (🟡, safe-local)

`[CODE]` `.html:44-66` — the inlined `SuccessIllo` illustration uses `#E1ECEA`, `#1a5e63`, `#0d3f44`, `#9bb6b1`, `#fff`. Pixel-parity React port. Will NOT re-tint in dark mode (the surrounding panel does, via `bg-falcon-neutral-0`).

**Recommended (low priority):** optionally map the SVG strokes/fills to `--falcon-teal-*` / `--falcon-neutral-*` so the art adapts to dark mode. It is decorative brand art, so cosmetic.

### G-I18N — hardcoded English default copy (🟠, safe-local)

`[CODE]` `:89-97` — `title` `'Completed successfully'`, `subtitle` `'Credentials sent to the user'`, `closeAriaLabel` `'Close'` are hardcoded English. Consistent with the `@falcon/ui-core` "no `TranslateService` dep" rule; live callers pass translated strings. But a bare `<falcon-angular-completion-success-dialog>` renders untranslated English.

**Recommended:** document the "caller MUST pass translated strings" contract (done in API/USAGE/BUSINESS). No code change needed — the no-i18n-in-ui-core rule is intentional.

### G-ROLE — `role="alertdialog"` on a passive auto-dismiss ack (🟡, HIGH-RISK-QUEUE)

`[CODE]` `.html:18` — an auto-dismissing, button-less, click-anywhere-to-close SUCCESS ack is `role="alertdialog"` + `aria-live="polite"`. `alertdialog` semantically implies an *interrupting, response-required* dialog (WAI-ARIA: "alerts the user AND expects a response"). For a passive, self-dismissing confirmation this is heavier than warranted; a screen reader may announce it as demanding action it doesn't.

**Why HIGH-RISK-QUEUE:** changing an ARIA role is an a11y-semantics change with assistive-tech-behavior implications — needs deliberate review, not a drive-by edit.

**Recommended (queued):** consider `role="dialog"` (it IS modal + labelled) or a polite status region. Validate with a screen reader.

### G-CLICK-ANYWHERE — clicking the panel body dismisses (🟡, safe-local)

`[CODE]` `:144-147` `onPanelClick()` → `onClose()`. Per the React parity spec ("click anywhere dismisses", tested at `spec.ts:129`). A user reaching to read/copy the success text closes the dialog. Intentional, but a UX footgun for any text the user needs to retain.

**Recommended:** document as a known parity quirk (done in USAGE/RECOGNITION). If product wants copy-able content, gate panel-click dismiss behind an input.

## Missing cross-framework / dual-render parity

- `[CODE]` `:84` — **NO Stencil Shadow/`-tw` twin**, **NO React/Vue wrapper** in `libs/falcon-ui-react` / `libs/falcon-ui-vue`. It is Angular-only (the React original lives in the legacy `addclient.jsx`, not a Falcon-UI-React component). This is *expected* for a bespoke branded dialog (same as `falcon-popup`), but it means: (a) no Studio token-runtime mutation (no token file anyway), (b) no cross-framework reuse. Flagged for completeness; dims B/E are N/A.

## Missing accessibility features

- **A1 (P3):** the dialog has no visible-focus-on-open management beyond what `showModal()` provides (native focuses the first focusable = the × button). Acceptable.
- **A2 (P3):** `aria-live="polite"` + `role="alertdialog"` is redundant/conflicting (see G-ROLE). Pick one announcement strategy.
- **A3 (P3):** no `aria-modal` attr is set explicitly — native `<dialog>` `showModal()` implies modality, so this is fine, but worth a doc note.

## Missing tests

- `[CODE]` `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts` (9 tests) covers: title/subtitle render, default copy, auto-dismiss fires after `autoDismissMs`, `autoDismissMs=0` keeps open, backdrop click → closed, panel click → closed, × → closed, hidden when `open=false`, rendered when `open=true`. **Good coverage.**
- **Gap (P3):** no test for `dismissOnOverlayClick=false` (backdrop click should NOT close), no test for ESC/native-`cancel` → closed, no test for the `[falconOverlay]` `showModal()` Top-Layer integration (TestBed overrides the template; the directive's native-dialog path is not exercised). Add those.

## Performance risks

- Single `effect()` + one `setTimeout` — negligible. `OnPush`. The inlined SVG is static markup (no re-render cost). **No real risk.**

## Visual / interaction risks

- `[CODE]` The inline `::backdrop` literal cannot be themed/overridden per-instance (G-TOKENS) — a host wanting a different dim opacity must edit the component.
- `[CODE]` Click-anywhere dismiss (G-CLICK-ANYWHERE) is the main interaction risk.
- Dark-mode: the SVG art + backdrop stay fixed (G-SVG-LITERALS).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G-ROLE | Reconsider `role="alertdialog"` vs `role="dialog"` | P2 | HIGH-RISK-QUEUE |
| G-TOKENS | Mint backdrop/radius/shadow tokens; de-literal the inline block | P2 | safe-local |
| G-PX | Map arbitrary-px to Falcon scale | P3 | safe-local |
| G-I18N | Document caller-supplies-translation contract | P3 (done) | safe-local |
| G-CLICK-ANYWHERE | Document / optionally gate panel-click dismiss | P3 | safe-local |
| G-SVG-LITERALS | Token-ize / dark-mode the illustration | P3 | safe-local |
| G-TEST | Cover `dismissOnOverlayClick=false` + ESC + Top-Layer | P3 | safe-local |

## Fix-shared-vs-per-page

All findings belong in the **shared component**. There is no per-page work (the dialog is library-internal, composed by `falcon-wizard-finalization`).

## Deep-Dive Sweep Findings (2026-06-03 — B18)

**Consumer count: 1 live composer (`falcon-wizard-finalization`) + 3 app flow-driver signals files + 1 spec; 0 direct app-template mounts.** ([CODE] grep.)

- **No deletion/promotion flags** — the component is ACTIVE and deliberately kept inline (NOT orchestrator-routed; the 2026-05-24 addendum is the canonical justification).
- **One HIGH-RISK-QUEUE finding:** G-ROLE (a11y role semantics). All others are `safe-local` (token/px/i18n-doc/svg/test). See FINDINGS/B18.md.
- **Note:** the inline `styles:` block is the same deliberate Top-Layer pattern as `falcon-popup` — flagged for token-discipline (G-TOKENS) but not a defect.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18) against `falcon-completion-success-dialog.component.{ts,html}` + the 9-test spec + the `[falconOverlay]` directive. Gaps anchored to exact lines. G-ROLE raised as HIGH-RISK-QUEUE (a11y semantics). No deletion/promotion flags — component stays ACTIVE.
