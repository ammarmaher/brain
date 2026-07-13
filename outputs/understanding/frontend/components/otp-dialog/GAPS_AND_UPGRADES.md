# otp-dialog — GAPS AND UPGRADES

> This is where the B27 AUDIT findings for this component live in prose. The component WORKS and is correctly wired (gateway port + signal machine + proper teardown), but it is a **token-rule violator** (inline `<style>` + literal px/rgba) and a **deletion/consolidation candidate** (re-implements dialog chrome that `<falcon-angular-dialog>` already owns). Single-render Angular ⇒ rubric **B/E N/A**.

## Headline finding — token-only / Falcon-component-first VIOLATION

### G-TOKENS — inline `<style>` block + literal px/rgba chrome (🟠 medium, by house-rule standard)

`[CODE]` html:41-90 is an inline `<style>` block, and html:96/100/105/115/119/125/128/137/149/199/215 carry literal `px`/`rgba` inline `style=` values. The backdrop `rgba(13,63,68,0.55)` (html:80) is NOT tokenized despite `--color-falcon-teal-alpha-*` existing. This is the single biggest divergence from the Falcon FE standard (`[BRAIN-OUT]` ANGULAR_AND_TAILWIND_RULES: Tailwind-only, no inline styles, tokens over literals). It is a KNOWN deliberate legacy exception (the comment history shows multiple "positioning re-establishment" passes) — comparable to `new-wallet-balance`. **Not lint-gated** (`[MEMORY]` enforcement-honesty: no ESLint ban on inline styles in feature templates) → enforced only by audit/review.

**Recommended fix (the consolidation, P1):** rebuild the chrome on `<falcon-angular-dialog>` (overlay/card/backdrop/focus-trap/`--falcon-dialog-*` tokens) — deleting the `<style>` block, the literal geometry, and the manual `<dialog>` + backdrop handling. Move card width/paddings/font sizes to `--falcon-otp-dialog-*` (a NEW token file) or reuse dialog tokens. **HIGH-RISK-QUEUE** (render-path + visual change on a verified flow — needs morning approval + browser re-verify).

## Component-first / Falcon-component findings

### G1 — Hand-built native `<dialog>` instead of `<falcon-angular-dialog>` (🟠 medium)

`[CODE]` html:30-39 builds a raw `<dialog>` + manual backdrop-click + manual close-sync, driven by `[falconOverlay]`. Falcon already ships `<falcon-angular-dialog>` (header/body/footer slots, 5 sizes, focus-trap, severities — shared-ui/index.ts:274-288) AND `<falcon-angular-otp-send-dialog>` (a full OTP composer). This component reinvents the dialog shell. By design at the time of the port, but the customization-order doctrine (`[MEMORY]` falcon-component-creation: inputs→templates→slots→tokens→shared-upgrade→new→wrapper→raw-as-GAP) says raw-as-GAP is the LAST resort.

**Recommended fix (P1):** see G-TOKENS — fold into `<falcon-angular-dialog>`.

### G2 — Native `<button>` / `<svg>` / `<h2>` / `<p>` primitives instead of Falcon equivalents (🟡 minor)

`[CODE]` Close-X is a native `<button>` + inline `<svg>` (html:103-112); Resend is a native `<button>` + `<svg>` (html:222-234); the spinner + success-check + countdown ring are hand-rolled `<svg>`/`<span>`. The house rule prefers `<falcon-angular-button>` + the Falcon icon font over raw HTML/SVG primitives (raw HTML = GAP). The countdown ring is bespoke (no Falcon ring primitive exists — legitimate), but the buttons could be Falcon buttons.

**Recommended fix (P2):** swap the two `<button>`s for `<falcon-angular-button>` (text/ghost variants); replace inline SVGs with Falcon icon-font glyphs where one exists.

## Missing capabilities

### G3 — No `(cancelled)` consumption guidance / no `resend` count limit (P3)

`[CODE]` `(cancelled)` is emitted (ts:198) but the sole consumer doesn't bind it (the host's own guard resets `otpOpen`). Resend has no attempt cap on the FE (the BE may enforce one) — a user can resend indefinitely once expired. `[INFERRED]` likely fine (BE rate-limits) but undocumented.

### G4 — `length` input is dead-ish (P3)

`[CODE]` `[length]` (ts:45) is only a fallback until `sendOtp` returns `otpCodeLength`; the sole consumer never passes it, so it always defaults to 6 then gets overridden by the BE. Effectively unused. Keep (it's a sane fallback) but note.

### G5 — No spec / test coverage (P2, test)

`[CODE]` **No `*.spec.ts`** for the component OR the `OtpGateway`/`ProfileOtpService`. The state machine (send→input→verify→success/error/expired), the 12s watchdog, the positive-edge `wasOpen` guard, the auto-verify edge, and the `zeroLength`-vs-`sendFailed` branching are all untested — and these are exactly the bits with documented regression history (auto-open, input-wipe). High value to test.

**Recommended fix (P2):** add `otp-dialog.component.spec.ts` (mock `OTP_GATEWAY`: assert send-on-edge-only, modal-opens-only-on-success, zeroLength→failed('zeroLength'), watchdog→failed, auto-verify timing, verified-after-900ms) + `profile-otp.service.spec.ts` (endpoint/body/header per field). The component is pure-signal/RxJS — node-testable (no Stencil-element instantiation needed for the Angular logic; the composed `<falcon-angular-otp>` can be schema-stubbed).

## Missing accessibility features

- **A1 (P2):** the invalid / expired / verifying status messages (html:179-195) are NOT in an `aria-live` region — a screen reader is not told the code was rejected or expired. Wrap them in `aria-live="assertive"` (errors) / `polite` (status).
- **A2 (P3):** per-box OTP accessibility is the composed `<falcon-angular-otp>` primitive's job (it provides per-box ARIA labels per its dossier) — verify it covers `lg` size + disabled.
- `[CODE]` **Strengths:** `role="dialog"` + `aria-modal` + native `showModal()` focus-trap (html:32-34), labelled close-X (html:106) + countdown wrapper (html:199), decorative SVGs `aria-hidden`. Disabled-state guards on Resend + the OTP boxes during Verifying/Expired (html:168/227).

## Missing Tailwind / token parity

- **N/A** (single-render, no token file). The relevant finding is the INVERSE — it has too FEW tokens (G-TOKENS): the chrome should be tokenized, not literal.

## Performance risks

- `[CODE]` **Low.** One `setInterval` (1s countdown) + a few `setTimeout`s, all cleared on teardown (ts:419-426 + DestroyRef ts:153-156). OnPush + signals. The countdown re-renders the ring `stroke-dashoffset` each second (cheap). The `@if (modalVisible())` removes the whole `<dialog>` from the DOM when closed (no stray element). No risk.

## Visual / interaction risks

- `[CODE]` **Dark mode not token-clean** — literal backdrop/shadow rgba don't dark-adapt (see TOKENS). The modal's design target is light mode; dark contrast unverified.
- `[CODE]` **Auto-open / top-RIGHT-in-RTL / stuck-spinner** were all REAL past regressions (documented html:11-56) now fixed by the `@if (modalVisible())` gate + Pattern A `[open]`-scoped `display:flex` + `[falconOverlay]`. Any future change to the open-gate or the `<style>` `[open]` scope risks reintroducing them — the consolidation (G-TOKENS) must preserve these guards.
- `[CODE]` `scale(1.5)` on the OTP boxes (html:88) is a transform hack to hit ~70px — visually fine but means the boxes' real layout box is smaller than rendered (hit-target/overlap risk on tiny viewports).

## Deletion / consolidation candidate (the migration target)

`[CODE]` **otp-dialog is a CONSOLIDATION candidate, NOT a straight deletion.** It is the ONLY profile-change OTP modal and is actively used (1 host, both consoles + self) — so it cannot just be deleted. But it re-implements chrome that Falcon components own. Two distinct sibling targets:

1. **`<falcon-angular-dialog>`** — the migration target for the SHELL (overlay/card/backdrop/focus-trap/tokens). Rebuild otp-dialog's chrome on it, keeping the gateway machine + the composed `<falcon-angular-otp>` body. Kills G-TOKENS + G1 + G2.
2. **`<falcon-angular-otp-send-dialog>`** — a Stencil dual-render composer (channel radio → OTP boxes) that exists but has **0 app consumers** (`[CODE]` grep across `apps/` = none). It is NOT a drop-in replacement (it adds a channel-picker step otp-dialog doesn't have, and emits raw `falcon-send`/`falcon-verify`/`falcon-resend` events with no gateway wiring), so it does NOT supersede otp-dialog as-is. **Open question for the team:** should the profile-change flow adopt the send-dialog composer (and wire it to `OTP_GATEWAY`), retiring otp-dialog? Or should the send-dialog (unused) be deleted and otp-dialog be the canonical OTP modal after a chrome migration? **Flag for human decision — HIGH-RISK-QUEUE** (touches a verified flow + an unused-but-shipped component).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G-TOKENS / G1 | Rebuild chrome on `<falcon-angular-dialog>` + tokenize geometry | P1 | HIGH-RISK-QUEUE |
| G5 | Add component + gateway spec coverage | P2 | safe-local |
| A1 | `aria-live` on status/error messages | P2 | safe-local |
| G2 | Falcon buttons + icon-font for close/resend | P2 | safe-local |
| (decision) | Reconcile vs `<falcon-angular-otp-send-dialog>` (consolidate or delete the unused sibling) | P2 | HIGH-RISK-QUEUE |
| G3/G4 | Document `(cancelled)` + resend cap; note `length` fallback | P3 | safe-local |

## Recommended upgrade API (concrete)

```html
<!-- post-consolidation: chrome from <falcon-angular-dialog>, body keeps the OTP machine -->
<falcon-angular-dialog [open]="modalVisible()" size="md" position="center"
  [closable]="true" [closeOnEsc]="true" (falconClose)="onCancel()">
  <!-- header/body via slots; OTP boxes + countdown ring as the body -->
  <falcon-angular-otp slot="body" [length]="otpLength()" [(ngModel)]="value" size="lg" … />
</falcon-angular-dialog>
```

```css
/* NEW libs/falcon-ui-tokens/src/components/otp-dialog.tokens.css (scoped :where) */
:where(.falcon-otp-dialog) {
  --falcon-otp-dialog-card-width: 750px;
  --falcon-otp-dialog-pad: 4.5rem;
  --falcon-otp-dialog-title-size: 2.5rem;
  --falcon-otp-dialog-backdrop: var(--color-falcon-teal-alpha-55); /* tokenized backdrop */
}
```

## Fix-shared-vs-per-page

All gaps belong in the **shared component** (it is already shared in `libs/falcon`). The consolidation onto `<falcon-angular-dialog>` is a shared-component upgrade, not a per-page hack.

## Workarounds (if upgrade blocked)

- For G-TOKENS today: leave as-is (it works); just do NOT replicate the inline-style pattern elsewhere.
- For G5 today: rely on runtime verification (the `/profile` + both-console flows are user-confirmed working per `[MEMORY]` edit-user-by-status).
- For A1 today: the modal focus-trap reads the body on open; the missing live-region is a degradation, not a blocker.

## Deep-Dive Sweep Findings (2026-06-03 — B27)

**Consumer count: 1 render consumer** (`<app-otp-dialog>` in user-details-page.component.html:679) + the `OTP_GATEWAY` provider chain (host-shell). `<falcon-angular-otp-send-dialog>` (sibling) = **0 app consumers**.

NEW dossier (no prior version). Findings:
- 🟠 **G-TOKENS / G1** (inline `<style>` + literal px/rgba chrome; hand-built `<dialog>`) — the headline issue; HIGH-RISK-QUEUE to consolidate onto `<falcon-angular-dialog>`.
- 🟡 **G2** (native buttons/SVGs over Falcon equivalents), **G5** (no spec), **A1** (no `aria-live`) — safe-local.
- **Consolidation/decision flag** vs the unused `<falcon-angular-otp-send-dialog>` — HIGH-RISK-QUEUE (human decision: migrate-and-retire OR delete the unused sibling).
- **Strengths:** correct gateway-port decoupling, signal-first zoneless machine, proper teardown, positive-edge guard + watchdog (regression-hardened). The LOGIC is sound; the STYLING + chrome-reuse are the gaps.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW) against otp-dialog.component.ts (440 ln) + .html (239 ln, incl. inline `<style>` 41-90), profile-otp.service.ts, otp.enums.ts, shared-ui/index.ts:274-364 (dialog + send-dialog re-exports), grep `falcon-angular-otp-send-dialog` (0 app consumers). G-TOKENS literals enumerated from html; consolidation target (`<falcon-angular-dialog>`) + decision flag (`<falcon-angular-otp-send-dialog>`) both code-grounded. 2 HIGH-RISK-QUEUE items (consolidation + send-dialog reconciliation).
