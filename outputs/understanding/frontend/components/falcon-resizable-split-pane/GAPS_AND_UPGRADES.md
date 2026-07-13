# falcon-resizable-split-pane — GAPS AND UPGRADES

> NEW dossier (B26, 2026-06-03). Single-render pure-Angular shared-ui component — rubric dim **B (Stencil dual-render)** is **N/A**; dim **E (React/Vue parity)** is **N/A** (Angular-only). AUDIT-in-prose; row-per-finding table in `FINDINGS/B26.md`.

## Best-practice posture (POSITIVE — batch exemplar for engineering rigor)

`[CODE]` This is the **most architecturally complete shared-ui unit in the B25/B26 batch**: standalone, `OnPush` (ts:67), full signal surface (`input()` + two-way `model()` + `output()` + `signal()`/`computed()` + `viewChild.required()`), **explicit + complete teardown** (DestroyRef + ngOnDestroy + drag-stop listener removal, ts:296/299-302/241-244), a **pure DOM-less math core** (`falcon-resizable-split-pane.math.ts`) that is the unit-tested seam, a **real gate-12-compliant token file** (`resizable-split-pane.tokens.css`, `:where(...)`), a **justified `ViewEncapsulation.None` inline `styles` block** (token-only — the `::-webkit-scrollbar` / parent-state / `@keyframes` genuinely can't be utilities), and **strong a11y** (`role="separator"` + Arrow keys + live `aria-value*` + reduced-motion). It is **house-rule clean on tokens-over-literals** (the inline styles + token file are token-only; the only inline `style` at runtime is JS-computed geometry, which is correct). The gaps below are edge-completeness + the one RTL caveat — not structural debt.

## Missing capabilities (active source verified)

### G1 — Component-level spec absent; only the math core is covered (P2)

`[CODE]` No `*.spec.ts` in the component folder (Glob 2026-06-03). The math header (math.ts:1-5, 99-101) references a "split-pane-math.spec" covering the pure functions — so the **geometry math is tested**, but the **component wiring is not**: `leftBasis()` null↔`'0 0 Npx'`, `ariaNow()` fallback, the `dragging` flag flips, the scroll-mirror rAF, the wheel-forward handler, the reset, and the window-resize re-clamp have no component test (the component can't instantiate under node-vitest due to DOM — math.ts:2-5 — which is WHY the math was extracted, but the wiring still wants a jsdom/integration test).

**Recommended fix (P2):** add a jsdom/integration spec (or a Playwright e2e) for the component wiring; keep the pure-math unit spec as the geometry oracle. Confirm the referenced `split-pane-math.spec` exists and is wired into CI.

### G2 — RTL drag-direction not handled / not verified (P2)

`[CODE]` The drag computes `width = pointerX − containerLeft` and always resizes the geometric-LEFT pane (math.ts:45-51; ts:233). The component CLAIMS RTL-safety (ts:31-33, html:5-9) on the basis that the grip is a centred pill and the utilities are logical — which is true for the *visual centring* — but the **drag semantics** assume left=resized. Under RTL the visual "left" pane is on the right, so dragging may widen the wrong (or feel inverted) column. Not runtime-verified.

**Recommended fix (P2):** verify under `[dir=rtl]`; if inverted, branch the pointer math on direction (`containerRight − pointerX` for RTL) or document the limitation. **The grip centring is fine; this is specifically the drag delta.**

### G3 — Vertical-divider only (no horizontal split) (P3)

`[CODE]` The component is hardcoded to a vertical divider / left-right split (flex row, ts:75; `aria-orientation="vertical"`, html:49). A top/bottom (horizontal) split is not supported.

**Recommended fix (P3):** OPTIONAL — add an `orientation: 'vertical' | 'horizontal'` input if a horizontal split is ever needed. Currently YAGNI (the one consumer is vertical).

### G4 — Single fixed consumer / behavioural-oracle coupling (P2 — adoption + generality)

`[CODE]` Adoption = 1 (the wallet alloc-table). The defaults (272/160/260px, the 48px `--row-h`, the wallet grip-shadow note) and even the comments are wallet-shaped (ts:5-9, 131-137; tokens.css:8-9, 41-48). It was extracted *to be* generic, but it has only ever been validated against the wallet. A second, differently-shaped consumer would be the real generality test.

**Recommended fix (P2):** when a second consumer adopts it, re-verify the defaults + the synced-scroll model generalize (e.g. a consumer that does NOT want a hidden left scrollbar). Until then, treat the wallet as the only proven shape.

### G5 — `gripCenterLeft()` retained-but-uncalled (dead-ish export) (P3)

`[CODE]` math.ts:99-104 — `gripCenterLeft()` is exported (index.ts:11) and tested, but **the component no longer calls it** (the grip centres via CSS — ts:28-29). It is deliberately retained "for consumers/tests that want the same formula," so it is not truly dead, but it is an export with no internal caller and a real risk of confusing a maintainer ("why is there a grip-center fn if the grip is CSS-centred?").

**Recommended fix (P3):** keep it (the comment justifies it) but ensure the comment stays — or, if no consumer/test actually uses it, demote it. Low priority; it's documented.

### G6 — `--falcon-split-pane-row-h` is a "host-may-bind" token with no component enforcement (P3)

`[CODE]` tokens.css:98-104 mints `--falcon-split-pane-row-h` (48px) as a "shared row height the host CAN bind both panes to" — but the component itself does not impose or use it. It's an optional contract handle. A consumer expecting the split to enforce row height would be surprised.

**Recommended fix (P3):** document clearly (done here) that `--row-h` is consumer-opt-in; consider an `@Input() rowHeight` if row-alignment enforcement becomes desirable.

## Missing accessibility features

- **A1 (P3) — no `aria-valuetext`:** the separator exposes numeric `aria-value*` (px) but no human `aria-valuetext` (e.g. "Organizations column, 272 pixels"). A screen-reader user hears a bare number. Adding `aria-valuetext` would help.
- **A2 (P3) — focus outline removed:** `[CODE]` ts:110-112 sets `:focus { outline: none }` on the resizer; focus IS indicated by the grip growing on `:focus-visible` (ts:103), which is an acceptable custom focus affordance — but removing the default outline is a pattern to call out (ensure the grip-grow is sufficiently visible in all themes/contrasts).
- **A3 (P3):** the draggable separator has keyboard step (Arrow keys) but no Home/End or PageUp/PageDown to jump to min/max — a nicety for keyboard users.

## Missing tests

- `[CODE]` Component wiring spec (G1) — math is covered, wiring is not.
- `[INFERRED]` Confirm the referenced `split-pane-math.spec` is actually present + green in CI (the math header asserts it exists; not re-verified by this read-only sweep).

## Missing Tailwind / token parity

- **N/A (dual-render parity)** — no Stencil twin.
- **N/A (React/Vue parity)** — Angular-only; no `libs/falcon-ui-react`/`vue` equivalent. (The token file's fallbacks intentionally mirror the React/SCSS wallet baseline, which is a parity *source*, not a cross-framework wrapper.)
- **Token discipline: PASS** — token file + inline styles are token-only (the batch's best).

## Performance risks

- `[CODE]` The scroll mirror uses a rAF loop with a 120ms scroll-end settle (ts:188-201) — efficient, and it cancels the rAF when idle. The drag writes geometry imperatively (no CD thrash). `OnPush` + signals. **Low risk.** One micro-note: the rAF loop runs continuously *while scrolling* (re-requesting each frame until the 120ms idle) — correct, but a very long continuous scroll keeps a rAF alive (bounded, self-cancelling). No leak (ngOnDestroy cancels it).

## Visual / interaction risks

- `[CODE]` **RTL drag inversion** (G2) — the main interaction risk.
- `[CODE]` `ViewEncapsulation.None` global class names (`.falcon-split-*`) — a consumer redefining them would collide (process risk; documented).
- `[CODE]` The idle grip nudge is an attention pulse (disabled under reduced-motion) — could feel busy if many splits were on one page; with 1 consumer, moot.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G2 | Verify/fix RTL drag-direction | P2 |
| G1 | Add component-wiring spec (keep math spec) | P2 |
| G4 | Re-verify generality on a 2nd consumer | P2 |
| A1 | `aria-valuetext` on the separator | P3 |
| A3 | Home/End/PageUp/PageDown keyboard jumps | P3 |
| G3 | Optional horizontal `orientation` | P3 |
| G5 | Keep/demote `gripCenterLeft()` | P3 |

## Recommended upgrade API (concrete)

```ts
// optional additive inputs
readonly orientation = input<'vertical' | 'horizontal'>('vertical');  // G3
readonly rowHeight = input<number | null>(null);                      // G6 (enforce --row-h)
```

```html
<!-- A1: human-readable separator value -->
<div role="separator" ... [attr.aria-valuetext]="resizerAriaLabel() + ': ' + ariaNow() + 'px'">
```

```ts
// G2: RTL-aware drag delta (sketch)
const w = isRtl ? widthFromPointer(rect.right - clientX, 0, cfg)
                : widthFromPointer(clientX, rect.left, cfg);
```

## Fix-shared-vs-per-page

All gaps belong in the **shared component / its math core** — this IS the single chokepoint that extracted the wallet's resizer for reuse. Per-page resizer reinvention is exactly what the W3 extraction set out to prevent.

## Workarounds (if upgrade blocked)

- For G2/RTL today: if a consumer hits inverted drag under RTL, wrap the consumer in a `[dir=ltr]` boundary for the split, or document the limitation, pending the RTL-aware delta fix.
- For G3/horizontal today: there is no workaround — build a different component if a horizontal split is needed.

## Deep-Dive Sweep Findings (2026-06-03 — B26)

**Consumer count: 1 render site / 1 file + 0 in `libs/falcon`** (`[CODE]` grep `<falcon-resizable-split-pane`). The wallet alloc-table (behavioural oracle).

- **Status ACTIVE/SHARED/NEW (W3 wave).** Brand-new extraction from the wallet alloc-table; reusable by design.
- **Engineering posture is the batch EXEMPLAR** — signals + two-way model + complete teardown + pure math core + real gate-12 token file + justified token-only inline `styles` + strong `role="separator"` a11y. **Dim C (house rules): PASS** (token-only — the best in B25/B26). **Dim A: PASS.** **Dim D: strong** (a11y), with A1/A2/A3 niceties.
- **Brief correction:** the task brief says "used by the new-wallet-balance **drawer** + alloc-table"; the live render site is the **alloc-table ONLY** — there is no split-pane render in any wallet drawer (grep confirmed). Recorded in OVERVIEW/USAGE.
- **Top actionable items:** RTL drag-direction (G2 — the one genuine functional caveat), a component-wiring spec (G1), and a 2nd-consumer generality check (G4).
- **All findings are `safe-local`** (RTL verify / spec / additive / a11y nicety / doc). **0 HIGH-RISK-QUEUE.** No deletion/promotion flag — ACTIVE/SHARED.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26) against all source layers (component 307 ln + html 79 ln + math 105 ln + token file 131 ln). Posture PASS (the batch's engineering exemplar); G1-G6 + A1-A3 derived from live source. RTL drag caveat (G2) is the one genuine functional gap (🟡 not runtime-verified). The "drawer" consumer in the brief is NOT a render site (corrected). All `safe-local`; no deletion/promotion flag.
