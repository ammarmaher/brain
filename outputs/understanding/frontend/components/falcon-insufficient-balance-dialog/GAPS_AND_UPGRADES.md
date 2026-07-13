# falcon-insufficient-balance-dialog — GAPS AND UPGRADES

## Missing capabilities (active source verified 2026-06-03)

### G-A11Y — No `aria-describedby` linking the panel to subtitle/body (P1, a11y) — NEW
`[CODE]` The panel has `role="alertdialog"` + `aria-modal="true"` + `aria-label={headingText}` (falcon-insufficient-balance-dialog.tsx:375-377), but the subtitle and body (the priority list + info pill) are NOT associated via `aria-describedby`. A screen reader announces the heading but not the explanatory subtitle/instructions. (Same a11y gap as the B15 alert-dialog G8.)

**Fix (P1):** add ids to the subtitle + info pill and wire `aria-describedby` on the panel. **risk-class: HIGH-RISK-QUEUE** (a11y semantics on a payment-critical surface).

### G-BTN — Footer Cancel/Proceed are raw `<button>`, not `<falcon-angular-button>` (P2) — NEW
`[CODE]` falcon-insufficient-balance-dialog.tsx:413-429 (+ the `-tw` twin) render the footer as raw `<button class="falcon-ib-dialog__fbtn …">` — NOT `<falcon-angular-button>`/`<falcon-button-tw>`. So they don't inherit the button primitive's loading-spinner/disabled/focus-halo contract; `busy` only sets `disabled`, with no spinner. Falcon-component-over-native gap (same family as B15 alert-dialog G3 + confirm-dialog G3).

**Fix (P2):** compose `<falcon-button-tw variant="primary"/"secondary" [loading]>` in the footer. **risk-class: safe-local** (verify the busy/disabled wiring).

### G-TOK — `-tw` twin reads raw `var(--color-falcon-*)` palette refs, not `--falcon-ib-dialog-*` tokens (P2) — NEW
`[CODE]` falcon-insufficient-balance-dialog-tw.tsx:202,359 — the error banner (`bg-[var(--color-falcon-red-50,…)]`) + the drag-over border (`border-[var(--color-falcon-teal-500,…)]`) read theme palette vars directly, NOT the `--falcon-ib-dialog-*` tokens the Shadow path uses. A per-instance `style="--falcon-ib-dialog-error-bg:…"`-style override would retint the Shadow path only; both live render sites use `useTailwind=true`. Geometry tokens DO flow to both. (Same family as B15 alert-dialog G1.)

**Fix (P2):** `-tw` should read `var(--falcon-ib-dialog-error-bg, var(--color-falcon-red-50,…))` etc. **risk-class: safe-local.**

### G-BACKDROP — Wrapper native `::backdrop` uses raw literals, not tokens (P2) — NEW
`[CODE]` falcon-insufficient-balance-dialog.component.css:48-56 — the native `<dialog>::backdrop` paints `rgba(15,23,42,0.42)` + `blur(8px) saturate(1.4)` + `180ms` as RAW literals (and NEUTRALISES the host's `--falcon-ib-dialog-backdrop-bg`/`-glossy-backdrop-filter` tokens to `transparent`/`none`). So overriding `--falcon-ib-dialog-backdrop-bg` does NOT change the native backdrop. (Same family as B15 alert-dialog G2.)

**Fix (P2):** token-drive the wrapper `::backdrop` from `--falcon-ib-dialog-backdrop-bg` / `-glossy-backdrop-filter`. **risk-class: safe-local.**

### G-TEST — No spec / e2e coverage (P2) — NEW
`[CODE]` grep 2026-06-03 → no `*insufficient-balance-dialog*.spec.ts`/`.e2e.ts` for either Stencil tag or the wrapper, despite reorder/drag/re-seed/dismissal-suppression/native-dialog-sync logic.

**Fix (P2):** add a Stencil spec (re-seed on open, reorder via buttons + drag, busy suppresses Proceed/dismiss, 3 cancel reasons) + a wrapper spec (`openSignal` ↔ native-`<dialog>` sync, the 3 event re-emits, `appendTo` portal/detach). **risk-class: safe-local.**

### G1 — Inline SVGs instead of glyph font (P3)
`[CODE]` The 6-dot grip + jump/step/info/error chevrons are inline `<svg>` (tsx:236-287) — no `grip-vertical`/`chevrons-*` glyphs in the vendored Falcon icon font yet. Swap for `<falcon-icon name>` when those glyphs ship. **risk-class: safe-local.**

### G3 — No keyboard-only drag-reorder mode (P3)
`[CODE]` HTML5 native drag-drop is not keyboard-accessible. The 4 reorder buttons (jump-top/step-up/step-down/jump-bottom) provide keyboard parity (every position reachable — tsx:327-342), so this is a polish gap, not a blocker. A WAI-ARIA grab/move/drop mode (Space to grab, arrows to move, Enter to drop) is the future enhancement. **risk-class: safe-local.**

### G4 — Focus restore on close (P3 — REASSESSED 2026-06-03, mostly RESOLVED)
`[CODE]` **CORRECTION:** Phase B / Wave 4.2 wrapped the dialog in a native `<dialog falconOverlay="modal">` that calls `showModal()` — which gives a **real focus trap + automatic focus-restore to the opener for free** (component.ts:144-167). So the prior "no focus trap" gap is RESOLVED for the default (modal) path. **Residual:** if a consumer flips `useTailwind=false` AND `appendTo='host'` AND the native-dialog promotion is bypassed (an edge case), the Stencil-only path still relies on natural tab order. The Stencil core itself has no internal focus trap — it leans on the native `<dialog>`. **risk-class: safe-local** (residual edge case only).

### G5 — No localStorage persistence (P3 — intentional)
`[CODE]` By design (server is source of truth — `@Watch('open')` re-seeds from `items` every false→true). If a future use-case wants per-user persistence, the CALLER caches last-ordered IDs in its own state. Not a defect.

### G6 — Animation polish (P3)
`[CODE]` Backdrop fade-in (180ms ease) + the Stencil panel open transition. Reorder is instant — no spring on item swap. A future motion-preset (`view-transition` / spring) on `move()` would polish it. **risk-class: safe-local.**

## Missing template slots
- **None applicable** — the body is intentionally slot-free (a body slot was rejected in D-hist to keep drag handlers correct). `customSvg`-style injection does not apply here.

## Missing flags / states
- No async-aware Proceed beyond `busy` → `disabled` (the footer button has no spinner — tied to G-BTN).
- No multi-select drag (single-item ordering is the requirement; D-hist rejected multi-select).

## Missing accessibility features
- **A1 (P1):** `aria-describedby` (G-A11Y) — the headline a11y issue.
- **A2 (P3):** keyboard-drag mode (G3) — the 4 buttons cover the functional need.
- `[CODE]` `role="alertdialog"` + `aria-modal` + native-`<dialog>` focus-trap are correct; reorder buttons + list role + error `role="alert"` are correct.

## Missing tests
See G-TEST — zero spec/e2e.

## Missing Tailwind / token parity
- G-TOK (`-tw` raw palette refs) + G-BACKDROP (wrapper `::backdrop` literals). Geometry tokens have parity; some colours + the native backdrop do not.

## Performance risks
- `[CODE]` The drag-image clone (`onDragStart` snapshots the row + appends to `<body>` + removes after a frame — tsx:165-184) is per-drag and cleaned up — fine.
- `[CODE]` `@State()` reorder updates re-render only the list — OnPush + scoped state, cheap.

## Visual / interaction risks
- Two render paths can drift if a visual ships to one tag only (process risk — guard via a parity spec, G-TEST). G-TOK is an existing instance.
- The wrapper neutralises the inner Stencil backdrop + relies on the native `::backdrop` — if a consumer forces `appendTo='host'` outside a Top-Layer context, the dim could be lost (edge case).

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| G-A11Y | `aria-describedby` → subtitle/body | P1 | HIGH-RISK-QUEUE |
| G-BTN | Compose `<falcon-button>` in the footer | P2 | safe-local |
| G-TOK | `-tw` read `--falcon-ib-dialog-*` colour tokens | P2 | safe-local |
| G-BACKDROP | Token-drive the wrapper `::backdrop` | P2 | safe-local |
| G-TEST | Add Stencil + wrapper specs | P2 | safe-local |
| G1 | Icon-font glyphs (grip/chevrons) | P3 | safe-local |
| G3 | Keyboard-drag mode | P3 | safe-local |
| G6 | Animated reorder | P3 | safe-local |

## Fix-shared-vs-per-page
All gaps belong in the **shared Falcon component / token file**, NOT per-page. The dialog is the single ranked-list-modal primitive + the do-payment funding-priority surface.

## Workarounds (if upgrade blocked)
- For G-A11Y today: none at the consumer level (the panel ARIA is internal). Code review.
- For G-TOK today: override colours on the Shadow path (`useTailwind=false`) if per-instance recolouring is needed.
- For G-BTN today: accept the raw-button footer (functionally fine; just no spinner on busy).

## Library-side artefacts (this component ships)
- ✅ Stencil Shadow + Light/TW + Angular wrapper + token file + showcase registry (`notifications` category) + showcase doc. Loader registered in `define-falcon-tw-component.ts`; barrels in `angular-wrapper/index.ts` + `falcon-ui-tokens/src/index.css`.

## Deep-Dive Sweep Findings (2026-06-03 — B17)

**Consumer count: 2 render sites (1 live `do-payment-priority-popup` + 1 showcase demo); 0 in `libs/falcon`** ([CODE] grep `<falcon-angular-insufficient-balance-dialog>`).

Drift corrected vs prior dossier (no deletion/promotion flags — component stays ACTIVE):
- **OVERVIEW rewritten to the gold 9-file format** (the prior OVERVIEW predated the standard) + added the Phase B native-`<dialog>` Top-Layer + `<body>` portal + `appendTo` facts.
- **API: added the MISSING `allowDragDrop`/`fit`/`appendTo` inputs + the native-dialog bridge handlers + `openSignal`.**
- **BUSINESS/USAGE/INTEGRATION: corrected the trigger** — the `WalletType.MultipleWallets` AND-guard was REMOVED (2026-06-02); `CommChannelPriorityOrderRequired` alone now opens the dialog; the live flow is SignalR-push + bounded GET fallback (not a fixed 2s poll).
- **TOKENS/INTEGRATION: z-index DRIFT corrected `1000` → `99999`.**
- **NEW findings:** G-A11Y (aria-describedby — HIGH-RISK-QUEUE) + G-BTN/G-TOK/G-BACKDROP/G-TEST (safe-local) + G4 reassessed (native-dialog now provides focus-trap).
- See FINDINGS/B17.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17) against all source layers. G-A11Y (no aria-describedby) + G-BTN (raw footer buttons) + G-TOK (`-tw` palette refs) confirmed by direct read; G4 reassessed against the Phase B native-`<dialog>` wrapper (focus-trap RESOLVED for the modal path). Component stays ACTIVE — no deletion/promotion flags.
