# falcon-dialog — GAPS AND UPGRADES

> Gap IDs stabilised 2026-06-03 (B14). All findings this pass are DOC/audit only — nothing fixed.

## Missing capabilities (active source verified)

### G-DEP — `@deprecated` is governance-only, NOT in the source (P0 guard-rail)
`[CODE]` The registry + memory say "use `falcon-angular-popup`". The Stencil source (`falcon-dialog.tsx`) and the wrapper (`falcon-dialog.component.ts`) have **no JSDoc `@deprecated`, no `console.warn`, no compile-time signal**. Easy to use accidentally for a flow `popup` handles.

**Proposed:** Add JSDoc `@deprecated Use <falcon-angular-popup> for action-required flows or <falcon-angular-confirm-dialog> for OK/Cancel prompts. This is the underlying primitive only.` to wrapper + both Stencil sources. **risk-class: safe-local** (additive annotation).

### G-ERR — `errorMessage` is a dead prop (P1)
`[CODE]` `falcon-dialog.tsx:52` + `falcon-dialog-tw.tsx:58` accept `errorMessage` and the wrapper exposes it (ts:76) but **no render anchor exists** in either Stencil core. A builder binding `[errorMessage]` gets nothing. Either remove it (breaking — gate behind major) or wire a body-banner render. **risk-class: safe-local** (removal is API-narrowing but no consumer depends on a no-op).

### G-SIDE — `position="side-right"` overlaps the drawer concept (P1)
`[CODE]` `falcon-dialog.tsx:50` + tokens `side-right-{width,height,radius}` — a right-anchored "drawer-shaped dialog" that lacks drawer edge defaults. Remove `side-right` from `FalconDialogPosition`; point consumers to `<falcon-angular-drawer position="right">`. **risk-class: HIGH-RISK-QUEUE** (public type-union change — could break a consumer binding `[position]="'side-right'"`).

### G-CONFIRM — `falconConfirm` / `falconCancel` events without a UI (P1)
`[CODE]` Both Stencil cores declare `falcon-confirm`/`falcon-cancel` events and the wrapper re-emits them (ts:102-110), but **no built-in button emits them** — dead-weight on the API surface. Either remove (breaking) or document that consumers must project their own buttons + emit manually. **risk-class: safe-local** (doc) / HIGH-RISK if removed.

### G-A11Y-LABEL — no `closeAriaLabel` wrapper passthrough (P2 a11y/i18n)
`[CODE]` `closeAriaLabel` exists on BOTH Stencil tags (default `'Close'`) but the wrapper does not bridge it → the × label is stuck English. Add `@Input() closeAriaLabel = 'Close'` + forward via `[attr.close-aria-label]`. **risk-class: HIGH-RISK-QUEUE** (a11y semantics) — though mechanically additive.

### G-METHOD — wrapper does not proxy `show()` / `hide()` (P2)
`[CODE]` Both Stencil tags expose `@Method() show()` / `hide()`, but the wrapper has no Angular-side proxies. Consumers drive open/close via `[open]`/`[(open)]` (works) — but if a method proxy is wanted, reach into `ViewChild.nativeElement`. **risk-class: safe-local** (additive).

### G-DISMISS-API — 3 dismissal props are confusing in combination (P2)
`dismissible` overrides both `closeOnBackdrop` + `closeOnEsc`. Consider a single `[dismissOptions]` object or one master flag. **risk-class: safe-local** (doc) / HIGH-RISK if the prop shape changes.

### G-HEADER-ACTIONS — no header-actions slot (P2)
No place for action buttons in the header strip beyond the close ×. Same as drawer. **risk-class: safe-local** (additive slot).

### G-FULLSCREEN — `full` size but no `[fullScreenAt]` breakpoint (P3)
For responsive (md desktop / full mobile) consumers wrap their own breakpoint + dynamic `[size]`. **risk-class: safe-local**.

## Drift corrected this pass (B14 — 2026-06-03)

### DRIFT-TOPLAYER — native `<dialog falconOverlay="modal">` was undocumented (🟠)
`[CODE]` `falcon-dialog.component.{ts,html,css}` + `falcon-overlay.directive.ts` — the prior dossier described a hand-rolled `position:fixed` backdrop + a z-index ladder. The live wrapper renders the Stencil tag inside a native `<dialog>` promoted into the **Top Layer** via `showModal()`; z-index is fallback-only. CORRECTED in OVERVIEW / API / INTEGRATION_VALIDATION / TOKENS. **risk-class: safe-local** (doc).

### DRIFT-CONSUMERS — consumer sweep was stale (🟠)
`[CODE]` Prior dossier said "1 file (playground showcase only)" + cited `otp-dialog.component.ts`. grep 2026-06-03 → **9 app files / 19 occurrences + 2 lib / 3** (contact-groups share-dialog, templates flow modals, wallet confirm-save). `otp-dialog` uses `falcon-angular-popup` now, not dialog; `playground` is removed. CORRECTED in OVERVIEW / USAGE. **risk-class: safe-local** (doc).

### DRIFT-FOOTER — `-tw` footer chrome vs Shadow bare footer (🟡)
`[CODE]` falcon-dialog-tw.tsx:246-248 wraps `slot="footer"` in `<div class={falconDialogFooterClasses()}>` (token-driven chrome) **unconditionally**; falcon-dialog.tsx:246-248 (Shadow) renders a bare `<slot name="footer">` with no wrapper. So the default Tailwind path auto-adds footer padding/border/justify while the Shadow path does not — a minor Shadow↔`-tw` parity divergence. DOCUMENTED in API. **risk-class: safe-local**.

### DRIFT-SEVERITY-STRIP — severity accent strip is `-tw`-only (🟡)
`[CODE]` falcon-dialog-tw.tsx:214 renders `{severity && <span style={stripStyle} aria-hidden>}` (a 4px top strip). The Shadow `.tsx` has **no equivalent strip element** — severity on Shadow only reflects to `data-severity` + the token cascade (no painted strip). DOCUMENTED in API/TOKENS. **risk-class: safe-local**.

## Missing accessibility features
- **A1 (P2):** Esc + native modal focus containment exist (native `<dialog>.showModal()` + the hand-rolled Stencil trap) — good. But the close × label is not i18n (G-A11Y-LABEL).
- **A2 (P3):** `aria-describedby` is set when the `description` prop is used but NOT when only a default-slot description is projected.

## Missing tests
- `[CODE]` Listing 2026-06-03 → **0 spec/e2e for any layer** (Shadow, `-tw`, wrapper, native-dialog shell). GAP G-TEST: add (a) a wrapper spec covering open/close signal sync + `openChange` + `closeOnEsc` mirror; (b) an e2e for focus-trap correctness + Top-Layer dismissal + the `-tw` footer chrome. **risk-class: safe-local**.

## Missing Tailwind / token parity
- Both render paths share `--falcon-dialog-*` tokens. **Parity OK at the token level** — but the `-tw` footer chrome + severity strip render-divergence (DRIFT-FOOTER / DRIFT-SEVERITY-STRIP) means the visible result differs by path even with identical tokens.

## Performance risks
- Global `document` keydown listener while open (cheap). Body content rendered/destroyed each open/close (fine — hoist state).
- `falconDialogPanelStyle` / `…StripStyle` recompute on each render (`-tw`) — tiny object literals, no real risk.

## Visual / interaction risks
- Two render paths can drift (the `-tw` footer chrome / severity strip already do).
- `position="top"` scale-fades like center (doesn't slide down) — `[BRAIN-OUT]` cosmetic.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| G-DEP | `@deprecated` JSDoc + optional warn | P0 | safe-local |
| G-ERR | Remove or wire `errorMessage` | P1 | safe-local |
| G-SIDE | Drop `side-right` position | P1 | HIGH-RISK-QUEUE |
| G-CONFIRM | Remove/document confirm/cancel events | P1 | safe-local |
| G-A11Y-LABEL | Surface `closeAriaLabel` on wrapper | P2 | HIGH-RISK-QUEUE |
| G-METHOD | Proxy `show()`/`hide()` on wrapper | P2 | safe-local |
| G-TEST | Add wrapper + e2e specs | P2 | safe-local |
| DRIFT-FOOTER | Align Shadow footer chrome with `-tw` | P3 | safe-local |

## Fix-shared-vs-per-page
All gaps belong in the **shared Falcon component / token file**, not per-page. The wrapper is the single chokepoint that proves the Top-Layer overlay pattern.

## Workarounds (if upgrade blocked)
- For G-A11Y-LABEL today: switch to `useTailwind=false` Shadow path and set the Stencil prop directly via `[attr.close-aria-label]` (not surfaced — would need `CUSTOM_ELEMENTS_SCHEMA` + raw tag). Easier: accept English `'Close'`.
- For G-CONFIRM today: project your own footer buttons + handle `(falconClick)`.
- For G-SIDE today: use `<falcon-angular-drawer position="right">`.

## Wave 7 Findings (2026-05-17)
**Consumer count: 2** ([CODE] grep `<falcon-angular-dialog>`). See `USAGE.md` for the file list.

## Deep-Dive Sweep Findings (2026-06-03 — B14)
**Consumer count: 9 app files / 19 occurrences + 2 in `libs/falcon`** ([CODE] grep `falcon-angular-dialog`).

Status stays **@deprecated-for-direct-use but FUNCTIONAL**. No deletion flag (genuine bespoke-body consumers exist: contact-groups share-dialog, wallet confirm-save, templates flow modal). Findings: DRIFT-TOPLAYER (architecture), DRIFT-CONSUMERS (sweep), DRIFT-FOOTER + DRIFT-SEVERITY-STRIP (`-tw`/Shadow parity), G-DEP/G-ERR/G-CONFIRM/G-A11Y-LABEL/G-SIDE/G-METHOD/G-TEST carried forward. **2 HIGH-RISK-QUEUE** (G-SIDE type-union change, G-A11Y-LABEL a11y); rest `safe-local`. See FINDINGS/B14.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14) against all source layers + the new native-`<dialog>` shell + the shared overlay directive/service. Gap IDs restabilised; Top-Layer architecture + consumer-sweep + `-tw` footer/severity divergence are the major corrections. No deletion/promotion flags — stays ACTIVE-but-deprecated-for-direct-use.
