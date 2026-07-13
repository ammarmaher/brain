# falcon-drawer — GAPS AND UPGRADES

> Gap IDs stabilised 2026-06-03 (B14). All findings this pass are DOC/audit only — nothing fixed.

## Missing capabilities (active source verified)

### G-ZONELESS-SLOT — projected default-slot body is wiped under zoneless CD (🟠 P0 — the headline gap)
`[CODE]` `wb-balance-transfer-drawer.component.ts:5-23` + `balance-transfer.component.html:4-10` — under the platform's `provideZonelessChangeDetection()` baseline, the Stencil drawer's projected default-slot body **does not paint** (header + footer render, body is EMPTY). Both wallet feature teams permanently route around it with a hand-rolled native `<aside role="dialog">` shell (WAIVER W11). Net effect: **the drawer primitive has ZERO live consumers** and the "use `<falcon-angular-drawer>`" SPEC rule is contradicted in committed code.

**Impact:** any new feature that follows the house rule and uses `<falcon-angular-drawer>` for a projected-body form will ship an empty body — a silent, severe regression.

**Recommended fix:** root-cause the slot wipe in the Stencil drawer cores under zoneless CD (likely a `render()`-vs-slot-projection timing issue when CD is not zone-driven). Until fixed, the WAIVER stands and this gap must be surfaced to every builder. **risk-class: HIGH-RISK-QUEUE** (behavior/render-path defect in a shared primitive; the fix touches the Stencil core).

### G-A11Y-LABEL — wrapper does not expose `closeAriaLabel` (P1 a11y/i18n)
`[CODE]` `falcon-drawer.tsx:44` / `falcon-drawer-tw.tsx:49` — `closeAriaLabel` exists on BOTH Stencil tags (default `'Close'`) but the wrapper does not bridge it → the × label is stuck English. Add `@Input() closeAriaLabel = 'Close'` + `[attr.close-aria-label]`. **risk-class: HIGH-RISK-QUEUE** (a11y semantics; mechanically additive).

### G-METHOD — wrapper does not proxy `show()` / `hide()` (P2)
`[CODE]` Both tags expose `@Method() show()`/`hide()`; the wrapper has no Angular proxies. Drive via `[open]`/`[(open)]`. **risk-class: safe-local** (additive).

### G-SPELL — `dismissable` (drawer) vs `dismissible` (dialog) (P2)
`[CODE]` `falcon-drawer.tsx:40` uses `dismissable`; `falcon-dialog.tsx:48` uses `dismissible`. Cross-component inconsistency → silent default when copied. Add a `dismissible` alias (deprecate the typo over one release). **risk-class: safe-local** (additive alias) / HIGH-RISK if the canonical prop is renamed.

### G-BACKDROP-MODE — no "show-backdrop-but-click-through" mode (P2)
`[CODE]` `falcon-drawer.tsx:105-109` — `modal=false` shows no backdrop AND does not dismiss on outside click. There is no mode that shows a backdrop while allowing click-through, nor one that shows a backdrop that dismisses on outside-click without blocking. Decouple `[backdrop]` from `[modal]`. **risk-class: safe-local** (additive).

### G-FOCUS-PERF — `collectFocusable()` runs on every Tab press (P3)
`[CODE]` `falcon-drawer.tsx:151-156` — an O(N) `querySelectorAll` over the panel subtree on every Tab. For 100+-input settings panels this is non-trivial. Memoise per render. **risk-class: safe-local**.

### G-EXIT-ANIM — no exit transition (P3)
`[CODE]` `falcon-drawer.tsx:169` — the panel is removed from the DOM immediately on close (returns `null`). Opens slide; closes pop. Keep the panel mounted briefly during close-out (gate behind opt-in). **risk-class: safe-local** (perceived-UX change → gate it).

### G-HEADER-ACTIONS — no header-actions slot (P2)
No place for an action button INSIDE the header strip beyond the close ×. Consumers fight the × positioning when projecting everything via `slot="header"`. Add `<slot name="header-actions">`. **risk-class: safe-local** (additive slot).

### G-TONE — no severity/tone variant (P3)
No info/success/warning/danger header strip (the dialog has one). **risk-class: safe-local**.

## Drift corrected this pass (B14 — 2026-06-03)

### DRIFT-TOPLAYER — native `<dialog falconOverlay="drawer">` was undocumented (🟠)
`[CODE]` `falcon-drawer.component.{ts,html,css}` + `falcon-overlay.directive.ts` — the prior dossier described a hand-rolled overlay + z-index ladder. The live wrapper renders the Stencil tag inside a native `<dialog>` promoted into the Top Layer; the slide stays intrinsic to the inner panel; z-index is fallback-only. CORRECTED in OVERVIEW / API / INTEGRATION_VALIDATION / TOKENS. **risk-class: safe-local** (doc).

### DRIFT-ADOPTION — "0 consumers / unconfirmed" → "0 LIVE TAGS by WAIVER" (🟠)
`[CODE]` The prior dossier flagged a contradiction (OVERVIEW cited org-node-drawer; GAPS/USAGE said 0). The 2026-06-03 sweep resolves it: there are **zero live `<falcon-angular-drawer>` tags** repo-wide; all 12 grep hits are comments/test-assertions documenting the deliberate WAIVER (G-ZONELESS-SLOT). The org-node-drawer is NOT a confirmed consumer. CORRECTED in OVERVIEW / USAGE / BUSINESS. **risk-class: safe-local** (doc).

### DRIFT-FOOTER — footer has NO chrome on EITHER path (🟡)
`[CODE]` falcon-drawer.tsx:222-224 (Shadow, bare slot + empty comment) + falcon-drawer-tw.tsx:222 (`-tw`, bare `<slot name="footer" />`) — neither path wraps the footer in token chrome (unlike the dialog `-tw` path). The prior "footer renders only when slotted" is accurate; clarified that the footer carries no built-in padding/border on either path. DOCUMENTED in API/USAGE. **risk-class: safe-local**.

## Missing accessibility features
- `[CODE]` Native `<dialog>.showModal()` + the hand-rolled Stencil focus trap both run (good). But the close × label is not i18n (G-A11Y-LABEL).
- The close × button has no programmatic SVG `<title>` — relies on `aria-label`.
- `aria-describedby` for the body content is not auto-linked.

## Missing tests
- `[CODE]` Listing 2026-06-03 → **0 spec/e2e for the Stencil cores OR the wrapper**. (`new-wallet-balance/__tests__/standards-drawer.spec.ts` is a consumer-side standards spec that asserts the tag is ABSENT — not a library spec.) GAP G-TEST: add a wrapper spec (open/close signal sync, `openChange`, `dismissable` mirror) + an e2e for focus-trap correctness AND a regression for the zoneless-CD slot wipe. **risk-class: safe-local**.

## Missing Tailwind / token parity
- Both render paths share `--falcon-drawer-*` tokens. **Parity OK** — both footers are equally bare.

## Performance risks
- Global `document` keydown listener while open (cheap).
- `collectFocusable()` per Tab (G-FOCUS-PERF).
- Backdrop `backdrop-filter: blur(4px)` heavy on low-end devices (token-controlled).

## Visual / interaction risks
- No exit transition (G-EXIT-ANIM) — opens slide, closes pop.
- Backdrop blur cost on low-end devices.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| G-ZONELESS-SLOT | Fix the projected-body slot wipe under zoneless CD | P0 | HIGH-RISK-QUEUE |
| G-A11Y-LABEL | Surface `closeAriaLabel` on wrapper | P1 | HIGH-RISK-QUEUE |
| G-METHOD | Proxy `show()`/`hide()` | P2 | safe-local |
| G-SPELL | `dismissible` alias | P2 | safe-local |
| G-BACKDROP-MODE | Decouple `[backdrop]` from `[modal]` | P2 | safe-local |
| G-HEADER-ACTIONS | Header-actions slot | P2 | safe-local |
| G-TEST | Wrapper + e2e + zoneless regression spec | P2 | safe-local |
| G-FOCUS-PERF / G-EXIT-ANIM / G-TONE | perf / exit anim / tone | P3 | safe-local |

## Fix-shared-vs-per-page
All gaps belong in the **shared Falcon component / token file**. The zoneless-CD fix (G-ZONELESS-SLOT) is the unblocking item — until it lands, the per-feature hand-rolled shells are the right WAIVER.

## Future-proof recommendation
Consolidate the dialog + drawer focus-trap code into a shared `useFocusTrap()` Stencil mixin (both duplicate ~30 lines). AND root-cause the zoneless-CD slot wipe — without it, the drawer primitive remains an orphan.

## Wave 7 Findings (2026-05-17)
**Consumer count: 0** ([CODE] grep `<falcon-angular-drawer>`). Flagged "zero adoption — showcase/playground only".

## Deep-Dive Sweep Findings (2026-06-03 — B14)
**Consumer count: 0 LIVE TAGS** ([CODE] grep `<falcon-angular-drawer[\s>]` in `.html` → 0). 8 app files / 12 occurrences are all comments/test-assertions documenting the deliberate WAIVER.

Status stays **ACTIVE primitive but ORPHANED in app code by a behavior defect.** Findings: G-ZONELESS-SLOT (headline — projected-body wipe under zoneless CD), DRIFT-TOPLAYER (architecture), DRIFT-ADOPTION (zero-live-tags-by-WAIVER), DRIFT-FOOTER (no chrome either path), G-A11Y-LABEL/G-SPELL/G-BACKDROP-MODE/G-METHOD/G-FOCUS-PERF/G-EXIT-ANIM/G-TEST carried/added. **2 HIGH-RISK-QUEUE** (G-ZONELESS-SLOT render defect, G-A11Y-LABEL a11y); rest `safe-local`. See FINDINGS/B14.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against all source layers + the new native-`<dialog>` shell + the WAIVER comments in the wallet consumers. The zoneless-CD slot-wipe defect (G-ZONELESS-SLOT) is the load-bearing new finding. No deletion flag — the primitive is sound where slots aren't projected under zoneless CD, and the focus-trap/Top-Layer machinery is correct.
