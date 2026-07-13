# falcon-otp-send-dialog — GAPS AND UPGRADES

## Missing capabilities

### G1 — No method proxies on the wrapper (P2)

`[CODE]` The Stencil tags expose `advanceToCodeStep()`, `markVerificationError(msg)`, `resetToChannelStep()` (`falcon-otp-send-dialog.tsx:112-133`, mirrored on `-tw`:124-143), but the Angular wrapper proxies none — consumers must reach the native element ref. (The capability exists; only the Angular-side `goToStep1()`/`goToStep2()`/`reset()` proxy is missing.)

### G2 — Validation deferred — no built-in code validation (P2)

Documented. Acceptable but worth emphasising — parent must validate.

### G3 — Hardcoded copy strings (P2)

All labels (titles, button labels, subtitle) are input strings but defaults are English. i18n hooks would be cleaner — accept `TranslateKey` rather than already-translated string.

**Recommended fix:** allow inputs to be either string OR translate key (with internal translation if available).

### G4 — No resend cooldown timer (P1)

After resend, no built-in 30s countdown to disable resend button. Consumers must implement externally.

**Recommended fix:** add `@Input() resendCooldownSeconds = 0` + internal countdown + disabled state during.

### G5 — No "code expired" state (P2)

If code expires, no built-in UI hint. Add `@Input() codeExpired = false` + visual.

### G6 — kebab-case Outputs (P3)

`falcon-send`, `falcon-verify`, etc. — same as email/phone field. Add camelCase aliases.

### G7 — Step 2 doesn't show channel reminder (P3)

Step 2 shows OTP boxes but doesn't recap which channel sent the code. Add subtitle interpolation.

### G8 — No "Help / wrong number" link in step 2 (P3)

Common UX. Add optional `helpLink` input.

## Newly surfaced findings (2026-06-03 — B07)

### G9 — Partial double-emit guard (P1)

`[CODE]` falcon-otp-send-dialog.component.ts:81-106 — `handleSend()` calls `stopPropagation()` but `handleVerify()`/`handleResend()`/`handleChannelChange()` do NOT, despite the comment claiming the fix is "mirrored for verify/resend/channel-change." Since the Stencil events `bubbles:true, composed:true`, those three double-fire on a host-element listener. **Recommended fix:** add `event.stopPropagation()` to the three handlers (mechanical, matches the existing `falcon-send` pattern).

### G10 — `stepChange` never emitted → `[(step)]` write-back broken (P2)

`[CODE]` The wrapper declares `@Output() stepChange` (ts:70) but no handler ever calls `stepChange.emit(...)`. So a consumer using `[(step)]` gets no callback when the dialog transitions internally (e.g. via the `@Method advanceToCodeStep`). **Recommended fix:** re-emit `stepChange` whenever the inner `step` reflects a change (listen for the Stencil prop reflection or add a `falcon-step-change` event).

### G11 — Shadow↔`-tw` channel-change wiring diverges (P2)

`[CODE]` Shadow wires BOTH `<div onClick>` + radio `onFalcon-change` (tsx:223,251); `-tw` wires only `<div onClick>` (-tw:242-248). The Shadow path can double-emit `falcon-channel-change` on a direct radio click; the `handleChannelChange` method (tsx:135-143) is dead on `-tw`. **Recommended fix:** align both paths (drop the radio `onFalcon-change` on Shadow, or add it on `-tw`).

### G12 — `-tw` step-enter animation no-ops (P3)

`[CODE]` `@keyframes falconOtpSendDialogStepIn` is defined only in the Shadow `falcon-otp-send-dialog.css:46` (`shadow:true`, encapsulated). The light-DOM `-tw` twin references the same name (`falconOtpSendDialogStepClasses()`) but has no matching global keyframe → the default path skips the fade/slide. Cosmetic. **Recommended fix:** move the keyframe to a global stylesheet (or the `-tw` CSS).

## Missing accessibility (verified 2026-06-03 — prior "verify" hedges resolved)

- **CONFIRMED OK:** channel block `role="radiogroup"` + `aria-label="Delivery method"` (`[CODE]` tsx:211); proper `<falcon-radio>` semantics; step-2 error `role="alert"` (tsx:309); leading icons `aria-hidden` (tsx:225); `role="dialog"` + focus trap + Esc inherited from the embedded `<falcon-dialog>` (`closable` + `dismissible`, tsx:354-355).
- **A1 (P2):** focus-moves-to-first-OTP-box on step-2 entry is delegated to `<falcon-otp>` — not verified here; depends on the OTP component's autofocus. Worth a focus-management check.
- **A2 (P3):** the step transition is purely visual; no `aria-live` announces the step change (a screen-reader user gets the new dialog title only).

## Missing tests

- `[CODE]` grep 2026-06-03 → **0 spec/e2e files** for either Stencil tag or the wrapper, despite the channel-resolution logic (`allowedChannels`/`resolveDefaultChannel`), the partial double-emit guard, and the 3 `@Method`s. GAPs: (a) a `.utils.spec.ts` (channel allow-list + default resolution + label/sub-text); (b) a wrapper spec asserting each `@Output` fires exactly ONCE (would catch G9); (c) a Stencil spec for the open-resets-state watch + verify-gated-on-complete.

## Missing Tailwind / token parity

- `[CODE]` Composer layout helpers mirror the Shadow CSS and read `--falcon-otp-send-dialog-*` tokens — token-level parity OK. The divergences are behavioral (G11) + the keyframe scope (G12), not token values.
- `[CODE]` Category 11 SUCCESS-BANNER tokens are dead (no rendering JSX) — a token surface with no consumer (TOKENS.md).

## Performance risks

- None. The component is event-driven with trivial state.

## Visual / interaction risks

- `[CODE]` Step-enter animation works on Shadow, no-ops on the default `-tw` (G12) — a minor visual inconsistency between paths.
- `[CODE]` Cancel mid-step resets state via `@Watch('open')` (tsx:94-103) — CONFIRMED (the prior "verify state reset" hedge resolved).

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G4 | Resend cooldown timer | P1 |
| G2 | Document validation deferral | P2 |
| G3 | Translate key support | P2 |
| G1 | Method proxies | P2 |
| G5 | Code-expired state | P2 |
| G7 | Channel recap in step 2 | P3 |
| G6 | camelCase outputs | P3 |

## Concrete upgrade API

```ts
@Input() resendCooldownSeconds = 0;
@Input() codeExpired = false;
@Input() helpLink?: string;
@Input() showChannelRecap = true;
@Output() send = new EventEmitter<...>();         // alias
@Output() verify = new EventEmitter<...>();
@Output() resend = new EventEmitter<...>();
@Output() cancel = new EventEmitter<void>();
async goToStep1(): Promise<void>;
async goToStep2(): Promise<void>;
async reset(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G4: external timer + disable resend via parent state.
- For G3: pre-translate labels via TranslateService before passing.
- For G5: when expired, show toast/notification externally + reset state.

## Wave 7 Findings (2026-05-17)

**Consumer count: 3** ([CODE] grep `<falcon-angular-otp-send-dialog>`). No new structural gaps.

## Deep-Dive Sweep Findings (2026-06-03 — B07)

**Consumer count: 0 live** ([CODE] grep `<falcon-angular-otp-send-dialog`). The 2026-05-17 consumers (add-user-wizard.html/.ts + playground) are GONE — the component is maintained-but-unused in features today (showcase + re-export only).

Drift corrected vs prior dossier (component stays ACTIVE; no deletion flag — it's a packaged ceremony ready for the next verify flow):
- **`step` enum is `'channel'|'code'`, NOT `'verify'`** (folded into API.md from the prior INTEGRATION correction).
- **17 inputs / 7 outputs confirmed**; the 5 intent outputs use renamed kebab aliases; 3 Stencil `@Method`s confirmed (prior "None proxied" wrong).
- **NEW: G9 partial double-emit guard** (only `falcon-send` stop-propagated) — HIGH-RISK-QUEUE (public-event-contract / could double-fire verify/resend).
- **NEW: G10 `stepChange` never emitted** — `[(step)]` write-back broken.
- **NEW: G11 Shadow↔`-tw` channel-change wiring divergence** — HIGH-RISK-QUEUE (render-path behavior divergence).
- **NEW: G12 `-tw` step-enter keyframe no-op** (Shadow-only `@keyframes`) — cosmetic.
- **Wrong token names corrected** (`-channel-*` → `-option-*`); dead SUCCESS-BANNER token category noted.
- **0 spec/e2e** confirmed.
- a11y placeholders resolved to PASS (radiogroup/role=alert/dialog-trap-inherited). See FINDINGS/B07.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07) against all source layers (wrapper / Shadow / `-tw` / utils / tokens). G9-G12 are new this pass; G1 method-proxy gap re-confirmed (capability exists on Stencil); 0 consumers + 0 specs confirmed. No deletion flag — stays ACTIVE.
