# falcon-otp — DECISION

## Brain SK final recommendation

**STATUS: READY + LIVE.** Use for all N-digit code entry. 3 live consumers (auth enter-otp + forgot-password + shared otp-dialog) as of 2026-06-03. Add G1 (`(falconComplete)` wrapper output) to retire the per-page completion-length workaround.

## Use this component for

- 6-digit OTP / 2FA codes.
- 4-digit PINs (mask=true).
- Alpha-numeric short codes (custom `pattern`).

## Avoid this component for

- Password → `<falcon-angular-password>`.
- Long numeric entry → input-number.
- Free-text → input.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G1 (`falconComplete` output).

## Relationship

- Composed by `<falcon-angular-otp-send-dialog>` step 2.

## Exact rule

1. N-digit code? → `<falcon-angular-otp>`.
2. Default `length=6`; tune as needed.
3. Set `mask=true` for PINs.
4. Set `pattern` for non-numeric codes.
5. Bind via CVA; detect completion via length check (until G1 lands).

---

## Dynamic capability assessment

### 1. What is static today?
- Per-box flex layout; box-only rendering (no inline/banner alternative).
- Enter is always swallowed; auto-advance / backspace-retreat / paste-fill / Arrow-Home-End nav are fixed.
- Mask glyph is a token, not an input (`--falcon-otp-mask-character`); masked boxes are native `type=password` dots.

### 2. What is dynamic through inputs/outputs?
- 16 wrapper `@Input`s (label/placeholder/helper/error/length/mask/size/state/required/name/inputId/pattern/useTailwind + 4 `*Class`).
- **0 wrapper `@Output`s** — value out via **CVA** only; the Stencil `falcon-complete` is NOT re-emitted (G1).
- Full CVA (writeValue / registerOnChange / registerOnTouched / setDisabledState).

### 3. What is dynamic through slots / ng-template?
- **None.** No `<slot>` / `<ng-content>`.

### 4. What is dynamic through token/theme overrides?
- A full 14-category `--falcon-otp-*` set (~60 tokens) — box size, gap, bg/border/text per state, focus ring, separator, mask, caret, motion. All real-palette-aliased.
- Dark mode + density (box size via `size`) flow through.

### 5. What is dynamic through Tailwind classes?
- Host `class=` + 4 `*Class` passthroughs (`wrapperClass`/`boxClass`/`inputClass`/`labelClass`) — but these flow ONLY to the Tailwind (default) path; the Shadow path ignores them (parity finding).

### 6. What is missing to make it reusable across pages?
- `(falconComplete)` wrapper output (G1), `setFocus(index)`/`clear()` proxies (G3), `maskCharacter` input (G6), `*Class` parity on the Shadow path, per-box state hook (G5).

### 7. What capability should be added to the shared component (not a page hack)?
- All the above. The current G1 workaround (per-page `value.length === length` check, as in enter-otp) should be retired once `(falconComplete)` lands.

### 8. What flags / options would make it better?
- `(falconComplete)` output, `maskCharacter` input, `setFocus`/`clear` proxies; `*Class` forwarded to both paths.

### 9. What is the safest upgrade path?
1. **Phase A (additive):** add `(falconComplete)` (G1) + `setFocus`/`clear` proxies (G3) + `maskCharacter` (G6). Add the missing specs.
2. **Phase B (parity):** forward the 4 `*Class` inputs to the Shadow branch too (or formally document them Tailwind-only).
All additive — no consumer break.

### 10. What is risky to change because other pages depend on it?
- Changing default `length` from 6 — silent backend-contract breakage.
- The CVA `value` string contract — auth flows read it via `(ngModelChange)`.
- The default `useTailwind=true` — flipping to Shadow changes the DOM (Light↔Shadow) AND drops the `*Class` inputs.
- Pattern semantics (`compilePattern` anchoring) — changing it could let previously-rejected chars through.

## Verification
🟢 code-verified (re-read 2026-06-03) against `falcon-otp.component.ts/.html`, both Stencil tags, `falcon-otp.utils.ts`, the token file + Tailwind helper, and the live auth consumers. G1 (un-bound `falcon-complete`) + Shadow↔`-tw` 1:1 parity + `*Class` Tailwind-only + stale wrapper source-comment (default=Tailwind, not Shadow) ✅ confirmed this pass.
