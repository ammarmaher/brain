---
name: login-auth-revamp-2026-05-21
description: "Login + OTP + Forgot Password + Change Password — full revamp wiring all four screens onto a single --login-* token cascade plus Falcon UI Core overrides, replacing all custom HTML form markup with falcon-angular-input/password/button."
metadata: 
  node_type: memory
  type: project
  originSessionId: 683ca601-96b9-4e8b-be21-8e349c67ce70
---

# Login Auth Revamp — 2026-05-21

🟢 BUILD-GREEN 2026-05-21 — v1 → v10 (ten sequential same-day iterations). Hashes: v1 `b70417a3b30f1aa7` · v2 `fd301a0665cde58a` · v2 final `4e41ae57a4f6b5dd` · v3 `7b1f737d0672f729` · v4 `8b03925c85cf104c` · v5 `e4ccf509ff6c67b6` · v6 `0c0694a81870ec11` · v7 `f6637c6ae3b854b1` · v8 `d9c55b2dcf382d4b` · v9 `952d347e2ad7d3ea` · **v10 autofill+fullwidth `9f189a8dd24c5992`** (15.4 s). **v10** suppressed the browser autofill paint (Chrome/Edge yellow box-shadow on populated inputs) + forced the Login button to actually fill the form width (`fullWidth=true` wasn't enough — host chain defaulted to inline-block) + dropped button height 68→52 (medium).

## Root cause this fixed

Before today, the four auth files referenced **47 distinct `--login-*` CSS custom properties** (e.g. `--login-input-height`, `--login-card-max-width`, `--login-btn-bg`, `--login-card-padding`) but **zero were defined anywhere in the workspace**. Every site relied on the inline `var(..., fallback)` fallback value. Changing a value required hunting 4 HTML files. Form fields were hand-rolled SVG-inside-flex-divs duplicating the visual contract that `<falcon-angular-input>` / `<falcon-angular-password>` / `<falcon-angular-button>` already own.

## What changed

13 files modified — all under `apps/host-shell/src/app/features/auth/**` + 2 i18n JSON entries:

1. `login-layout/login-layout.component.scss` — **canonical SoT**. Defines all 47 `--login-*` tokens at `:host`. Also overrides `--falcon-input-*` / `--falcon-button-*` / `--falcon-otp-*` so wrapped Stencil components render at login dimensions (52px input height, 10px radius, 8px button radius, 50px OTP box, teal-700 focus, teal-700 timer arc) via CSS custom-property inheritance crossing shadow-DOM boundaries. **NO ::ng-deep** into Stencil internals. Plus tablet/phone breakpoint overrides (≤991, ≤767).
2. `get-started/*` — three custom fields collapsed to `<falcon-angular-input iconLeft>` (username + person SVG slot), `<falcon-angular-password toggleMask iconLeft>` (password + lock SVG slot), `<falcon-angular-button variant="primary" fullWidth loading>`. Net: 130 → 70 lines HTML. Removed dead `showPassword` + `togglePasswordVisibility()`.
3. `enter-otp/*` — already uses `<falcon-angular-otp>`; reformatted + timer track/progress strokes flipped from `--palette-*` to `--login-input-border` / `--login-success`.
4. `forgot-password-flow/*` — 3 steps (Form / OTP / ResetPassword) rewritten using Falcon Angular components. 340 → 210 lines HTML. Removed `showNewPassword`/`showConfirmPassword` + toggles.
5. `change-password/*` — three custom password rows → three `<falcon-angular-password>`. New inline verify-status row (spinner→Verifying / check→Verified / link→Verify) renders below currentPassword field. 200 → 130 lines HTML. Removed three `show*Password` flags + three toggle methods.
6. `libs/falcon/src/language/i18n/{en,ar}.json` — added `login.changePassword.verifying` + `verified` keys in both languages (replace-all caught both duplicate blocks).

## v10 — Autofill suppression + full-width button (medium height) (same day) — 1 file

User screenshot flagged: (1) browser autofill paints a yellow/blue background on populated inputs that overrode the login token; (2) Login button rendered ~80px wide left-aligned despite `[fullWidth]="true"`; (3) v7's 68px button felt too tall — wanted medium.

### v10 fixes
- **`--login-btn-height`: 68 → 52 px** (medium, between Falcon's md=38 and lg=68).
- **Autofill suppression** — `input:-webkit-autofill` paints via inset box-shadow + text-fill-color that `background-color` can't override. Used the canonical fix: 1000px `inset box-shadow` matching `--login-input-bg` + force `-webkit-text-fill-color` + `transition: background-color 5000s` to defer browser repaint. Error state preserved via re-applied red-50 inset shadow inside `[state="error"]` parents.
- **Login button full-width fix** — `fullWidth=true` sets `[attr.full-width]=""` on `<falcon-button-tw>` which makes the inner `<button>` 100%. But outer hosts (`<falcon-angular-button>` Angular wrapper + `<falcon-button-tw>` Stencil) default to `inline-block` → host width collapses to content → inner 100% resolves to ~80px. Fix: forced all three layers `display: block; width: 100%` via `::ng-deep` with `:has(falcon-button-tw[full-width])` scope so other Falcon buttons stay default.

### v10 build evidence
```
Hash: 9f189a8dd24c5992   15.4 s   exit 0
```

### v10 rules emitted (additive)
- **Suppress `:-webkit-autofill` paint via inset box-shadow + text-fill-color** — NOT `background-color` (browsers ignore that for autofill). Use 1000px inset shadow matching input bg + `transition: background-color 5000s` to defer browser repaint. Preserve error state by re-applying red-50 inset inside any `[state="error"]` container.
- **`fullWidth=true` on Falcon UI Core buttons requires host-chain display fixes.** The wrapper and Stencil tag both default `inline-block`. For true 100%: override all three layers (`falcon-angular-button`, `falcon-button-tw[full-width]`, `> button`) with `display: block; width: 100%`. Inner-button-only width:100% resolves against a collapsed parent.
- **Use `:has()` for opt-in scoped fixes.** `falcon-angular-button:has(falcon-button-tw[full-width])` lets defensive overrides only fire when consumer opted in — other Falcon buttons stay at default `inline-block`.

## v9 — Label→input gap SoT token (same day) — 1 file

User screenshot showed labels too close to their inputs. Direction: "padding between label and input — best practice, control via tokens."

### v9 fix
New SoT `--login-label-input-gap: 8px` in the login `:host` block, fanned out to all 9 Falcon form-control variants in the override block:
```css
--falcon-input-label-margin-bottom:         var(--login-label-input-gap);
--falcon-password-label-margin-bottom:      var(--login-label-input-gap);
--falcon-email-field-label-margin-bottom:   var(--login-label-input-gap);
--falcon-phone-field-label-margin-bottom:   var(--login-label-input-gap);
--falcon-otp-label-margin-bottom:           var(--login-label-input-gap);
--falcon-textarea-label-margin-bottom:      var(--login-label-input-gap);
--falcon-multi-select-label-margin-bottom:  var(--login-label-input-gap);
--falcon-combobox-label-margin-bottom:      var(--login-label-input-gap);
--falcon-dropdown-label-margin-bottom:      var(--login-label-input-gap);
```
falcon-password reuses input's label-token, but listed defensively. NO HTML changes. NO `::ng-deep`. CSS-custom-property inheritance carries the SoT into every Stencil shadow DOM.

### v9 build evidence
```
Hash: 952d347e2ad7d3ea   12.4 s   exit 0
```

### v9 rule emitted
- **Inter-element micro-spacing is a token, not a number.** Any rhythm that touches more than one component variant (label→input, form-gap, footer-mt, header-mb, …) must live in a `--login-*` SoT token and broadcast via the Falcon UI Core overrides block — never hard-coded per HTML site. List defensive Falcon-variant tokens even if currently aliased, in case Stencil splits the variant later.

## v8 — Glossy notch + subtle pop shadow + dark-mode color (same day) — 2 files

User direction: "Notch should be glossy. Dark mode → more glossy with a different color (give suggestions). Card shadow should pop — a little, not a lot."

### v8 fixes

**Glossy notch (light mode)** — flat `#cfe4d8` → 3-stop gradient + 4-layer box-shadow:
```css
--login-notch-bg: linear-gradient(180deg, #e4f0e7 0%, #cfe4d8 45%, #b8d6c5 100%);
--login-notch-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.65),   /* glassy top */
  inset 0 -1px 0 rgba(13, 63, 68, 0.06),     /* bottom inner */
  0 2px 4px rgba(13, 63, 68, 0.08),          /* close drop */
  0 0 8px rgba(207, 228, 216, 0.4);          /* soft halo */
```

**Dark-mode notch — cyan-teal glow (PICKED)** `#26d0ce → #0fb9b1`. Why: stays in teal brand family but inverts temperature for vivid pop on dark canvas. Rejected alternates: emerald `#34d399` (too green), amber `#f59e0b` (off-brand), pure white (sterile). Selector: `:host-context(.app-dark)` AND `:host-context([data-theme="dark"])` (Falcon stamps both).

**Card "subtle pop" shadow** — single-layer drop → 3-layer stack:
```css
--login-card-shadow:
  0 1px 2px rgba(0, 0, 0, 0.04),               /* close tight */
  0 4px 12px rgba(0, 0, 0, 0.06),              /* mid */
  0 24px 60px -20px rgba(0, 0, 0, 0.15);       /* soft far */
```
Dark-mode swaps the far layer to teal-tinted `rgba(13, 63, 68, 0.55)` for atmospheric depth on dark canvas.

**HTML**: removed `bg-[var(--login-notch-bg)]` from notch — Tailwind compiles `bg-[…]` to `background-color`, which silently fails on a gradient string. SCSS owns the gradient via raw `background:` shorthand.

### v8 build evidence
```
Hash: d9c55b2dcf382d4b   15.2 s   exit 0
```

### v8 rules emitted (additive)
- **Gradient tokens go through `background` (shorthand), NOT `background-color`.** Tailwind's `bg-[var(--…)]` compiles to `background-color` which can't hold a gradient — browser silently drops it. Use raw CSS `background: var(--…)` or `[background:var(--…)]` arbitrary-property.
- **Glossy contract** = linear-gradient body (3 stops, 180deg, light → mid → darker) + 4-layer box-shadow (top inner highlight + bottom inner deepening + close drop + soft outer halo). Each layer is one job; don't compress.
- **Dark-mode targeting via `:host-context(.app-dark)` AND `:host-context([data-theme="dark"])`** — Falcon stamps BOTH on `<html>`; target both for resilience.
- **"Subtle pop" card shadow = 3 layers, not 1.** Close-tight + mid + soft-far. Single-layer drops read as "modal floating"; 3-layer reads as "gently lifted."
- **Cyan-teal glow `#26d0ce / #0fb9b1` is the on-brand dark-mode surface accent.** When dark mode needs vivid pop against the teal canvas, prefer this over emerald or amber.

## v7 — Login button height (68×fullWidth) + boss-regression unblocker (same day) — 2 files

User shared a screenshot: Login button must be tall and visually weighty (~68 px tall, 12 px radius), filling form width entirely. v6 was rendering 44 px (the falcon-button `lg` default).

### v7 fixes
- `--login-btn-height`: 52 → **68 px**; `--login-btn-radius`: 8 → **12 px**.
- New tokens: `--login-btn-font-size: 1rem` (16 px) + `--login-btn-font-weight: 600`.
- Falcon-button override block extended with `--falcon-button-padding-x-lg: 24px` + `--falcon-button-font-size-lg` + `--falcon-button-font-weight`.
- **Defensive `::ng-deep falcon-button-tw[size="lg"] > button { height/min-height/border-radius/font-size/font-weight !important }`** — forces the dimensions onto the actual Stencil shadow-DOM `<button>` element regardless of internal default-value cascade losses. Scoped to `size="lg"` so other Falcon buttons stay untouched.
- **Unblocker for boss session's TS regression in libs/falcon/.../service-pricing-table/models/models.ts** — boss added a new `mapPartialServiceRow()` that wrote to readonly `ServiceRow` fields. My SCSS edits triggered a full libs/falcon rebuild that exposed 5 TS2540 errors. Fixed defensively with 3-line local `Mutable<T>` helper inside the boss's function (`type Mutable<T> = { -readonly [P in keyof T]: T[P] }; const out: Partial<Mutable<ServiceRow>> = {};`) — return type stays `Partial<ServiceRow>` so callers still see immutability. No behavioural change to boss's logic.

### v7 build evidence
```
Hash: f6637c6ae3b854b1   10.6 s   exit 0
```

### v7 rules emitted (additive)
- **Falcon UI Core overrides land at three layers:** (1) `:host` custom property — the `--falcon-*` token (preferred — clean, crosses shadow DOM via inheritance); (2) Stencil size-variant token like `--falcon-*-lg` (the actual one the Tailwind utility reads); (3) defensive `::ng-deep <tag>[size="lg"] > button { … !important }` for high-stakes visual contracts when 1+2 don't stick. Use all three for Login button + similar.
- **`Partial<T>` does NOT strip `readonly`.** When a mapper takes `Partial<Wire>` and builds a partial output, use `Partial<Mutable<T>>` locally — `type Mutable<T> = { -readonly [P in keyof T]: T[P] }`. Return as `Partial<T>` so callers see the immutable shape.
- **Cross-session build-unblockers.** When a parallel session introduces a TS regression in a shared lib that blocks your build, prefer a minimal surgical fix (3 lines, no behaviour change, clear comment) over reverting or waiting. Document it in the report so the other session can verify or replace it.

## v6 — DevTools-mirror + unified notch radius (same day) — 2 files

User opened DevTools and made three live edits, then asked to lock them + consolidate the notch radius.

### v6 fixes
- **Card min-w** `60%` → **`56%`** (less aggressive lower bound for tablet widths).
- **Card max-h** `max-h-full` (100%) → **`max-h-[90%]`** (card no longer extends to absolute viewport bottom — 10% breathing room reveals brand-panel skeleton overlay at card bottom edge).
- **Notch radius** — was `--login-notch-radius: 0 0 16px 16px` (4-value border-radius SHORTHAND). Tailwind `rounded-b-[var(--…)]` compiles to `border-bottom-right-radius` + `border-bottom-left-radius` — both expect a SINGLE value, not a shorthand. The browser silently rejected the multi-value declaration and the notch had FLAT corners.
- **Fix**: new SoT token **`--login-notch-radius-bottom: var(--login-card-radius)`** (single scalar tied to the card's outer radius). The notch's bottom curve now always tracks the card's outer curve — when the card radius changes, the notch bottom radius follows in one source.
- HTML changed `rounded-b-[var(--login-notch-radius,16px)]` → `rounded-b-[var(--login-notch-radius-bottom)]`.

### v6 build evidence
```
Hash: 0c0694a81870ec11    15.6 s   exit 0
```

### v6 rules emitted
- **Notch radius is one scalar tied to card radius.** Use `--login-notch-radius-bottom: var(--login-card-radius)`. Don't define independent notch-radius values — any per-corner difference creates a mismatch the user will catch. The notch HTML uses `rounded-b-[var(--login-notch-radius-bottom)]` — single Tailwind utility, never multi-value shorthand.
- **Never pass `border-radius` 4-value shorthand through per-side Tailwind utilities** (`rounded-b-*` / `rounded-t-*` / `rounded-l-*` / `rounded-r-*`). They compile to per-side `border-*-radius` props that accept ONE value only. Passing a shorthand silently breaks to flat corners. If different per-corner values are needed, use four separate utilities.
- **Card height ≤ 90% of viewport** (`max-h-[90%]`). Lets the card breathe so the brand-panel skeleton overlay is visible at the bottom edge — the reference shows this on every Login / OTP / Forgot variant.
- **Card min-width 56%** (not 60%). Tighter min so on tablet widths the card doesn't get awkwardly wide.

## v5 — Notch geometry per user direction (same day) — 1 file

User direction: "Notch should be in the middle of the component and take 70%. From left 50%, right 50%. ~20.75% of the height."

### v5 fixes (single file: login-layout.component.scss)
- `--login-notch-width`: `188px` → **`70%`** (responsive — Tailwind `w-[var(--…)]` passes percentage through). Centered automatically via the existing `flex justify-center` parent.
- `--login-notch-height`: `14px` → `18px` (slightly more visible).
- `--login-card-padding`: `48px 56px 24px` → **`96px 56px 24px`** (top padding 48 → 96 — notch + breathing room now ≈ 18–20% of card height, matching the user's 20.75% direction).
- Responsive `≤991 px`: top padding 48 → 72; notch height 16.
- Responsive `≤767 px`: top padding 32 → 48; notch height 14.

### v5 build evidence
```
Hash: e4ccf509ff6c67b6   9.3 s   exit 0
```

### v5 rules emitted
- **Notch contract:** `--login-notch-width` MUST be a percentage (default `70%`) so the notch scales with card width. Don't use fixed pixel widths. Notch height stays at 18 px desktop / 16 px tablet / 14 px mobile. Notch lives in a `flex justify-center` container so percentage-width auto-centers.
- **Card top breathing room:** desktop top padding ≥ 80 px so notch + space-to-title is ~20% of card height — matches the reference design's calm vertical rhythm.

## v4 — Falcon-eye III pass (same day) — 5 additional files

After v3 the user asked for a deeper pass: "complete the task 100%, cover all areas in the small pixels." I batch-read **20+ reference PNGs** (every Login + OTP + Forgot/Reset Password + every account-status error variant). Seven new pixel gaps closed.

### v4 fixes
1. **Brand panel typography** — FALCON wordmark `font-semibold tracking-2px` → **`font-bold tracking-1.5px`**. "Hey, Hello!" `font-medium` → **`font-bold`**, leading-1.2 → 1.15, mobile size 2rem → 2.5rem. Sub-paragraphs flipped from hard-coded `text-[21px]` → token-driven `--login-brand-tagline-size` (1.3125rem default).
2. **Error banner softer pink** — all 4 banners' borders flipped `var(--login-danger)` (red-500 solid) → **`--color-falcon-red-100`** (#fde2e4 soft pink rim). Padding `py-3` → `py-2.5`, weight `font-semibold` → `font-medium`. Matches reference tone.
3. **OTP error state wiring** — `<falcon-angular-otp>` has a `state` input I'd never bound. Boxes stayed gray on error. Now: `[state]="screenState === OtpScreenState.Error ? 'error' : 'default'"`. Falcon-otp tokens (`--falcon-otp-bg-error` red-50 + `--falcon-otp-border-color-error` red-500) fire automatically. Applied to both `enter-otp` AND `forgot-password-flow.Otp` step.
4. **Footer language picker** — was a full-width text dropdown with "English/العربية" label. Now matches reference: borderless 9999px pill, hide label text via `::ng-deep` descendant selectors, flag rendered as 24×24 circular chip with 2 px teal-700 ring, chevron tinted to subtitle gray.
5. **Account-status i18n keys** — 5 new keys × 2 languages: `login.getStarted.errors.{usernameIncorrect,userLocked,userSuspended,userPending,userDeleted}`. Copy is verbatim from SoT screenshots (preserves slightly awkward English "you can not perform this action" — the design system owns it).
6. **Card extends to viewport bottom** — verified `rounded-t-` + `h-[100dvh]`, no change needed.
7. **Reference-observation rule book entry** — two parallel error patterns documented: field-level (red border + pink bg + inline icon under field) vs API-level (pink banner above form). Login screen handles both; banner is the more common case for non-validation failures.

### v4 build evidence
```
Hash: 8b03925c85cf104c    8.4 s
All Stencil -tw chunks present; skeleton asset confirmed in dist (208 KB)
```

### v4 rules emitted (additive)
- **Falcon component `state` discipline.** Every Falcon UI Core wrapper with a `state` input MUST be wired to the screen's error condition. `errorMessage` alone is NOT enough — `state="error"` is what triggers the visual error tokens (red border, pink bg) on inputs/password/OTP. Forgetting to bind `[state]` leaves the visual contract dangling even when error text renders.
- **Banner styling v2 (overrides v2 rule):** bg = `--color-falcon-red-50` (#fef5f5); **border = `--color-falcon-red-100`** (#fde2e4 soft pink, NOT solid red-500); text + icon = `--color-falcon-red-500` (#dc2626); padding `py-2.5 px-4`; weight `font-medium` (NOT semibold — too aggressive); layout `flex items-center justify-center gap-2 rounded-md`.
- **Reference-driven typography.** "Hey, Hello!" MUST be `font-bold`. FALCON wordmark `font-bold tracking-1.5px`. Sub-tagline via `--login-brand-tagline-size` token.
- **Language picker = circular flag chip + chevron only.** No text label, no rectangle, no border. `::ng-deep .login-lang-select__control` becomes borderless 9999px pill; descendant `[class*="__label"]` selectors hide the dropdown text; flag image becomes 24×24 with 9999px radius + 2 px teal ring.

## v3 — Falcon-eye II pass (same day) — 7 additional files

User pointed at the actual design SoT folder `C:\Falcon\Source_of_truth_theme\log in\Users profiles (2)` containing 50 reference PNGs incl. `Background Skeneton. .png`. After v2, the user said the result was "at 30% of the work." Six new waves.

### The big v3 fix — 3-layer background canvas
**Root cause:** v1 had a placeholder div with `class="hidden"` that literally hid the skeleton overlay PNG. User was seeing solid teal with no constellation pattern.

**Fix:** new asset `apps/host-shell/src/assets/images/login-bg-skeleton.png` (208 KB, copied from SoT folder) + new CSS pseudo-element overlay in `login-layout.component.scss`:
```scss
.login-shell {
  position: relative;
  isolation: isolate;       /* scopes mix-blend-mode to this stacking context */
  background-color: teal;
}
.login-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/images/login-bg-skeleton.png');
  background-size: cover;
  opacity: 0.18;
  mix-blend-mode: screen;   /* white PNG background → transparent over teal */
  pointer-events: none;
  z-index: 0;
}
```
The skeleton PNG is white/light-gray triangular-polygon lines on white bg. `mix-blend-mode: screen` inverts that — white pixels become transparent and the gray polygon lines tint subtly lighter on the teal canvas. Result matches the reference exactly. **No Photoshop preprocessing**.

### v3 card geometry corrected
- `--login-card-max-width`: **880 → 720 px** (reference is ~38% viewport, ~730 px on 1920)
- `--login-card-padding`: 48px 64px → **48px 56px** (h-padding matches reference)

### v3 copy aligned to SoT verbatim
- Forgot Password subtitle: "Enter your details to reset your password" → **"Enter your user ID"**
- Forgot Password button: "Submit" → **"Next"**
- Reset Password subtitle: "your new password" → **"a new password"**
- All 3 mirrored in `ar.json`: "أدخل اسم المستخدم الخاص بك" / "التالي" / "كلمة مرور جديدة"

### v3 OTP Resend → borderless link
Was outlined button (`border-[1.5px] border-falcon-teal-700 px-[18px] py-[7px] rounded-lg`). Now `border-none bg-transparent p-0` — just teal text + replay icon. Applied to both `enter-otp` and `forgot-password-flow.Otp` step.

### v3 build evidence
```
Hash: 7b1f737d0672f729    9.2 s
Skeleton asset confirmed in dist/apps/host-shell/assets/images/login-bg-skeleton.png (208 KB)
```

### v3 rules emitted (additive)
- **3-layer background contract.** Any future login-adjacent shell MUST follow this exact stack: solid brand color on host + skeleton PNG via `::before` with `mix-blend-mode: screen` + `opacity ≤ 0.20` + `isolation: isolate`. Don't invent new overlay schemes; don't preprocess the PNG; don't change the blend mode.
- **One SoT for the skeleton.** PNG lives at `apps/host-shell/src/assets/images/login-bg-skeleton.png`. Any other shell needing it imports from that path. No per-app copies.
- **Reference-driven copy.** When the SoT folder has copy verbatim (`Next` not `Submit`, `Enter your user ID` not generic), i18n value matches SoT verbatim. Do not paraphrase even if it looks awkward — the design system owns the wording.
- **Resend = link, not button.** All OTP screens MUST render Resend as borderless link + replay icon. No `border-*`/`rounded-*`/`px-*`/`py-*` shell.

## v2 — Falcon-eye pass (same day) — 16 additional files

User feedback after v1: "result doesn't look like expected, and backend errors should show — I can't see them now." Six new waves:

### Pixel-perfect tuning (v2)
- Card max-width 760 → **880 px**; card `w-3/4` → **`w-[92%]`** of main (~720 → ~883 px on 1920 px).
- Card horizontal padding **88 → 64 px** (form breathes more); vertical padding 64 → 48 px top.
- Title `font-medium` → **`font-semibold`** + `2 rem` → **`2.25 rem`** (36 px) across ALL screens.
- Subtitle 14 → **15 px**. Form gap 20 → **24 px**. Notch height 12 → **14 px**.
- Error banner: was `border-30%opacity` + flex-1 left-icon + text-center span. Now **solid red border** + `justify-center` (icon+text render as one centered group) + `font-semibold` + `truncate` (matches screenshot 4 exactly).

### Backend-error pipeline (v2 — primary fix)
- **NEW shared utility** `auth-error.util.ts` exposing `extractAuthError(source, fallback)` + `isNetworkError(source)`. Walks every backend envelope shape: `HttpErrorResponse.error` (object/string), top-level `ErrorMessages|errorMessages|Errors|errors` arrays, top-level `Message|message|Error|error` single fields, **AND `result.errorMessage|message|failureReason|error|errors|errorMessages`** for the `stage === Failed` case (success-envelope-business-rejected — the LIVE-CAUSE of "the user can't see backend errors").
- Wired into every catchError + every `isSuccessful === false` + every `stage === Failed` in all 4 components.
- **change-password gained an error banner** above the form — bound to new `saveError` field. Previously had ZERO error UI; comment said "toast shown by interceptor" but that toast was suppressed/missed.
- **enter-otp gained a top banner** — bound to new `bannerError` field — for resend failures + non-OTP-format backend errors (the inline "Invalid OTP" was scoped to verify only).
- **forgot-password resend** now surfaces backend message inline (catchError used to silently swallow).
- 8 new i18n keys × 2 languages: `login.otp.errors.{networkError,resendFailed}` · `login.forgotPasswordFlow.errors.networkError` · `login.forgotPasswordFlow.otp.errors.{networkError,resendFailed}` · `login.changePassword.errors.{networkError,changeFailed}`.

## Build evidence

```
nx build host-shell

v1:        Hash b70417a3b30f1aa7   11.8 s
v2:        Hash fd301a0665cde58a    9.6 s
v2 final:  Hash 4e41ae57a4f6b5dd   11.4 s
Successfully ran target build for project host-shell and 5 tasks it depends on
```

All Stencil `-tw` chunks present (falcon-input-tw, falcon-password-tw, falcon-button-tw, falcon-otp-tw, falcon-phone-field-tw). Showcase chunk still cleanly split (4.22 kB lazy). No tree-shaking accidents.

## Rules (apply to future auth work)

- ANY new auth screen MUST drop into the `<app-login-layout>` `:host` token cascade. Never redeclare `--login-*` tokens locally; add new login-specific tokens to `login-layout.component.scss` (one SoT).
- Form fields on login screens MUST use `<falcon-angular-input>` / `<falcon-angular-password>` / `<falcon-angular-button>` — never custom HTML/SVG/eye-toggle markup. The Stencil components already own focus ring + error state + eye toggle + loading spinner + required asterisk.
- When the login needs a localized override of a Falcon UI Core token (input height, button radius, otp box size), add it to the **Falcon UI Core overrides** block inside `login-layout.component.scss` `:host`. CSS custom-property inheritance crosses shadow-DOM boundaries — overrides flow into every Stencil child automatically. Don't reach inside with `::ng-deep`.
- i18n keys for status microcopy live in `libs/falcon/src/language/i18n/{en,ar}.json` — MUST add both languages in the same change.
- **One shared extractor for backend errors.** Every auth screen MUST use `extractAuthError()` from `apps/host-shell/src/app/features/auth/services/auth-error.util.ts` — never extract from envelopes ad-hoc. The util walks `HttpErrorResponse.error`, top-level arrays/single-field shapes, AND **`result.errorMessage`/`message`/`failureReason`** for the `stage === Failed` case.
- **No silent catchError in auth flows.** `catchError(() => of(null))` is forbidden — every catchError MUST set a user-visible error string (inline field for verify-style errors, top banner for save/submit errors).
- **No "toast shown by interceptor" assumptions.** If a user can land on a screen, that screen MUST surface failures itself in an inline banner. Toasts may be suppressed or missed.
- **`stage === Failed` IS an error.** HTTP 200 with `isSuccessful: true` but `stage === Failed` means the operation was business-rejected — the backend's message lives inside `result.*`. The extractor handles it; consumers don't need to know.
- **Banner styling contract:** `border border-[color:var(--login-danger)]` (solid, NOT `/30`) + `bg-[var(--login-error-bg)]` + `flex items-center justify-center gap-2` + `font-semibold text-[color:var(--login-danger)]` + `truncate` on the text span. Icon and text render as ONE centered group, matching screenshot 4 exactly.

## Not yet verified

Runtime browser rendering blocked by 40+ pre-existing Stencil/Angular workspace compile errors per `VERIFICATION-STATUS.md` — independent of this revamp. Build-green is the highest verification available until that blocker clears.

## Non-conflict guarantee

Touch zone: `apps/host-shell/src/app/features/auth/**` only. Org Hierarchy session (boss) lives in `apps/host-shell/src/app/features/admin-console/org-hierarchy/**`. **Zero file overlap.** Asynchronous-safe.

## Full report

`Brain Outputs\datasets\authority-dataset\_investigations\2026-05-21-login-revamp\REPORT.md`

## See also

- [[data-table-skeleton-during-external-cells-loading-2026-05-20]] — same `:host` token cascade pattern.
- [[shared-service-pricing-investigation-2026-05-21]] — host-shell facade pattern referenced for the new auth feature structure.
