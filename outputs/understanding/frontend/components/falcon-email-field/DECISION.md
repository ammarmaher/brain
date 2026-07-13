# falcon-email-field — DECISION

## Brain SK final recommendation

**STATUS: READY for verify-button email flows. NEEDS-UPGRADE for (a) a `verified`/`verifying` state visual (G2) and (b) Shadow-path parity for `verifyIcon` + `*ExtraClass` (G1).**

## Use this component for

- Email entry requiring an in-field Verify button (the User-Details email field is the flagship — PES-gated `canEditEmail`).
- Account-owner / profile email fields where the single-element verify look is wanted.

## Avoid this component for

- Plain email with no verify → `<falcon-angular-input type="email">` is sufficient.
- Generic text → `<falcon-angular-input>`. Phone → `<falcon-angular-phone-field>`. Password → `<falcon-angular-password>`.

## Preferred render path

**`useTailwind=true` (default).** This is also the ONLY path that honors `verifyIcon` + `wrapperClass`/`inputClass`/`labelClass` today (the Shadow tag lacks them — G1). Use Shadow only for style isolation, accepting the loss of those props.

## Required upgrades before wider use

None block production use. Prioritize G2 (`verified` state) for any flow that needs a confirmation badge, and G1 (Shadow parity) before recommending `useTailwind=false`.

## Relationship to other components

- **Sibling family:** `<falcon-angular-phone-field>` (same verify-button + single-border + 1px-divider family; phone adds a country chooser, email is the chooser-less sibling — same token shape).
- **Sibling:** `<falcon-angular-input type="email">` (plain email, no verify).
- Pairs with a consumer-owned OTP/verification flow (the component only emits `falcon-verify`).
- Does NOT compose `<falcon-input>` — renders its own native `<input type="email">`.

## Exact rule for future implementation tasks

1. **Email + verify affordance?** → `<falcon-angular-email-field [verifyButton]="true">` with `useTailwind=true`.
2. **Validate** via Reactive Forms `Validators.email` (+ `Validators.required`) — the component never validates format.
3. **Sync `[verifyDisabled]`** with form validity (and/or a PES result) so verify can't fire on a malformed/disallowed address.
4. **Bind `(blur)`** so `touched` updates (native blur does not bubble) and required errors paint.
5. **Gate edit** via `[readonly]` off a PES flag (as User-Details does with `canEditEmail`), not a non-existent `[disabled]` input.
6. **Override visuals** via `--falcon-email-field-*` tokens. The `*Class` inputs DO flow (to `-tw`).
7. **Handle `(falcon-verify)`** to launch the challenge.

---

## Dynamic capability assessment

### 1. What is static today?
- The single-element border + 1px verify divider.
- Verify-button label text (consumer-supplied) — no built-in i18n key.
- No `verified` / `verifying` state visual.
- `verifyIcon` + `*ExtraClass` honored on `-tw` only (G1).

### 2. What is already dynamic through inputs/outputs?
- 21 wrapper `@Input`s (label/placeholder/helper/error/size/state/readonly/required/verifyButton/verifyLabel/verifyDisabled/verifyIcon/name/inputId/autocomplete/useTailwind/wrapperClass/inputClass/labelClass/iconLeft/iconRight/inputMode).
- 2 `@Output`s — `(falcon-verify)` (aliased `verifyOut`) + `(blur)` (re-emitted Stencil `falcon-blur`).
- Full CVA (writeValue/registerOnChange/registerOnTouched/setDisabledState).

### 3. What is dynamic through slots / ng-template?
- `slot="icon-left"` + `slot="icon-right"` (the latter suppressed when `verifyButton` is on). No `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?
- The full standalone `--falcon-email-field-*` set (14 categories) via the `:where()` chain. Dark mode auto-flips; density via input-height aliases.

### 5. What is dynamic through Tailwind classes?
- Host `class=`; plus `wrapperClass`/`inputClass`/`labelClass` → forwarded as `*-extra-class` to the `-tw` twin (these DO flow, unlike password's dead ones).

### 6. What is missing to make this component reusable across pages?
- `verified`/`verifying` state (G2).
- Shadow-path `verifyIcon` + `*ExtraClass` parity (G1).
- Verify-button `aria-label` (G3).
- `componentOnReady` value re-push for data-table cells (G4).
- `setFocus()` wrapper proxy (G5).
- `variant`/`appearance` (G6).

### 7. What capability should be added to the shared component (not page hack)?
- The `verified`/`verifying` visual + the Shadow parity + the method proxy — all in the shared Stencil pair + wrapper.

### 8. What flags / options / templates / slots would make it better?
- `@Input() verified`, `verifying`, `variant`, `appearance`; `@Method() setFocus()`; Shadow-tag `verifyIcon`.

### 9. What is the safest upgrade path?
1. **Phase A (additive):** `verified`/`verifying` inputs + token-driven visuals; `setFocus()` proxy; verify-button `aria-label`. Zero break.
2. **Phase B (parity):** add `verifyIcon` + `*ExtraClass` to the Shadow tag.
3. **Phase C:** `variant`/`appearance`; `componentOnReady` push.

### 10. What is risky to change because other pages depend on it?
- The `(falcon-verify)` / `(blur)` output names — only add aliases, never remove (User-Details depends on `(blur)` for touched).
- The default `useTailwind=true` — flipping changes DOM (Light↔Shadow) AND drops `verifyIcon`/`*ExtraClass`.
- The single-element border token tuning — height/radius edits desync input vs button.
- `verifyDisabled` semantics (button-only) — do not conflate with the field-level readonly gate.

## Verification
🟢 code-verified (2026-06-03). Corrected: input count = 21 (incl. `verifyIcon`/`iconLeft`/`iconRight`/`inputMode`); 2 outputs (`falcon-verify` + `blur`); slots `icon-left`/`icon-right` exist; added the G1 Shadow↔`-tw` divergence and the no-`verified`-prop fact.
