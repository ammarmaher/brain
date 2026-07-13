# falcon-otp — GAPS AND UPGRADES

> Refreshed 2026-06-03 against live source. Prior "verify" items are now resolved against code; consumer count corrected (4 → 3 live + 1 showcase).

## Missing capabilities (active source verified)

### G1 — No `(falconComplete)` event re-emission on the Angular wrapper (P1)

`[CODE]` Both Stencil tags emit a dedicated `falcon-complete` ONCE on the false→true completion transition (falcon-otp.tsx:67-68,144-148 / falcon-otp-tw.tsx:86-87,154-160). The wrapper binds `falcon-change` + `falcon-blur` but **NOT** `falcon-complete` (`[CODE]` falcon-otp.component.html:27-28,46-47) — and even on `falcon-change` it drops the `complete` flag (CVA carries only the string, `[CODE]` falcon-otp.component.ts:98-103). Consumers wanting auto-submit must inspect `value.length === length` externally (which the live login screen does).

**Recommended fix (P1):** add `@Output() falconComplete = new EventEmitter<string>()` bound to `(falcon-complete)` on both branches. (Additive public-API addition — low risk, but it is a wrapper-surface change → HIGH-RISK-QUEUE per the "public API change" rule.)

### G2 — Correctness validation deferred (by design) (P2 — doc)

`[CODE]` The component validates only the per-box character class (`compilePattern`) + completeness; whether the code is *correct* is the backend's call (Identity `auth/verify-otp`). Documented — surface a wrong-code by setting `[state]="'error'"` + `[errorMessage]`.

### G3 — No Angular method proxies (P2)

`[CODE]` Both tags expose `@Method async setFocus(index)` + `clear()` (falcon-otp.tsx:99-112 / falcon-otp-tw.tsx:115-127) but the wrapper proxies neither. To programmatically clear or focus, reach `ViewChild.nativeElement`.

**Recommended fix:** add wrapper `setFocus(index?)` + `clear()` forwarding.

### G4 — SMS auto-fill — RESOLVED (present)

`[CODE]` `autocomplete="one-time-code"` is set on box 0 (`inputMode="numeric"` on all boxes) on both tags (falcon-otp.tsx:341 / falcon-otp-tw.tsx:332). The prior "verify SMS auto-fill" GAP is **satisfied directly from source** — no work needed. Kept here only to record the resolution.

### G5 — Per-box visual state not individually addressable (P3)

`[CODE]` All boxes share one `state` — `buildBoxClasses` applies `error` to every box (falcon-otp.utils.ts:14-23). For "nth box invalid" highlighting there is no per-index API. Niche; P3.

### G6 — Mask character is a token, not an `@Input` (P3)

`[CODE]` `mask=true` switches boxes to `type="password"` (native dots). The `--falcon-otp-mask-character` token (`"●"`) exists but is a CSS token, not an input — and `type=password` dots are browser-rendered, so the token's effect is limited. Adding `@Input() maskCharacter?` would be a clearer API.

## Missing accessibility features (resolved from prior "verify" stubs)

- **Per-box `aria-label` — RESOLVED present:** `aria-label="Digit {n} of {length}"` on every box (`[CODE]` falcon-otp.tsx:348). (Prior dossier guessed "OTP digit N" — corrected.)
- **`aria-invalid` per box — RESOLVED present:** `aria-invalid={hasError}` on every box (`[CODE]` falcon-otp.tsx:349).
- **Completion announced — PARTIAL:** the row is `aria-live="polite"` (`[CODE]` falcon-otp.tsx:314), so box-fill changes are announced, but there is no dedicated "code complete" SR message. A focused `aria-live` "complete" cue could improve it (A1, P3).
- **Error `role="alert"` — RESOLVED present** (`[CODE]` falcon-otp.tsx:369).

## Missing tests

- `[CODE]` Grep 2026-06-03 → **no `*otp*.spec.ts` / `.e2e.ts`** for either Stencil tag, the utils, or the wrapper — despite substantial logic (auto-advance, backspace-retreat, paste-fill, pattern filter, edge-triggered complete, `@Watch` re-sync). **GAP — add:** utils unit tests (valueToBoxes / isComplete / compilePattern / filterByPattern), a Stencil spec (type/backspace/Delete/Arrow/paste/mask), and a wrapper spec (CVA writeValue / ngModel / disabled / would catch G1 once `(falconComplete)` is added).

## Missing Tailwind / token parity

- `[CODE]` Shadow vs `-tw` are a **1:1 behavioral mirror** — identical props, identical 3 events, identical focus/paste/keyboard/complete logic + ARIA. The only structural difference: the `-tw` twin adds 4 `*ExtraClass` props (consumed in Tailwind) that the Shadow tag lacks (falcon-otp-tw.tsx:73-76) — and the wrapper only forwards those 4 to the Tailwind branch (the Shadow branch ignores `wrapperClass`/`boxClass`/`inputClass`/`labelClass`). **Finding:** in Shadow mode the 4 `*Class` inputs silently no-op (a Tailwind-only parity gap, low impact since Tailwind is the default).
- Token contract is shared via `:where()` → Studio runtime mutation hits both. **Parity OK at the token level.**

## Performance risks

- `[CODE]` `@Watch('value')` re-syncs boxes ONLY on real divergence (`boxesToValue` compare) → no CVA-echo render thrash (falcon-otp.tsx:81-89). Edge-triggered complete avoids repeat emits. `OnPush` wrapper. **No real risk.**

## Visual / interaction risks

- Long `length` (>~8–10) causes horizontal overflow — cap in docs.
- Paste-fill with stray chars (spaces, hyphens) — **handled**: `filterByPattern` strips non-matching chars before filling (`[CODE]` falcon-otp.utils.ts:64-71). Resolves the prior "verify Stencil sanitizes" note.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | `(falconComplete)` wrapper output | P1 |
| G3 | `setFocus(index)` / `clear()` proxies | P2 |
| (parity) | Forward `*Class` inputs to Shadow path (or document Tailwind-only) | P2 |
| G6 | `maskCharacter` input | P3 |
| G5 | Per-box state hook | P3 |
| A1 | "Complete" SR announcement | P3 |

## Concrete upgrade API

```ts
// Angular wrapper additions (additive)
@Output() falconComplete = new EventEmitter<string>();   // G1
@Input() maskCharacter?: string;                          // G6
async setFocus(boxIndex = 0): Promise<void>;              // G3
async clear(): Promise<void>;                             // G3
```

## Shared vs per-page

All shared. otp is the single chokepoint for code entry across auth flows + the send dialog; per-page completion watchers (the current workaround for G1) should be retired once `(falconComplete)` lands.

## Workarounds (if upgrade blocked)

- For G1: check `value.length === length` inside `(ngModelChange)` (the live login screen does this).
- For G3: `viewChild` → `nativeElement.setFocus()` / `.clear()`.

## Wave findings (2026-06-03 sweep)

**Consumer count: 3 live feature consumers** (+1 Studio showcase registry) — `[CODE]` grep `falcon-angular-otp` across `apps/` + `libs/falcon/`: enter-otp, forgot-password-flow, and the relocated `libs/falcon/shared-ui` otp-dialog. (Wave 7 counted 4: the playground route is gone; otp-dialog moved out of host-shell.)

**Resolved this sweep:** G4 (SMS auto-fill present), per-box `aria-label`/`aria-invalid`/error-`role=alert` present, paste sanitisation present, Shadow↔`-tw` confirmed 1:1 (behaviour + ARIA). **New this sweep:** the 4 `*Class` inputs are Tailwind-only (Shadow no-op) parity finding; source-comment drift (wrapper header says default=Shadow, code default=Tailwind). Prior TOKENS/USAGE/API drift (fictional `--falcon-otp-box-*` token names, "OTP digit N" a11y label) corrected.
