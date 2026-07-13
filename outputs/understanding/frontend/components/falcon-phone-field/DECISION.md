# falcon-phone-field — DECISION

## Brain SK final recommendation

**STATUS: READY for all phone entry. NEEDS-UPGRADE for (a) a real `maxlength` input — the `[maxlength]` consumers bind today is silently ignored (G2), (b) Shadow-path parity for `verifyIcon`/`*ExtraClass` (G1), and (c) a `verified` state (G4).** The prior "virtualize the ~250-country dropdown" requirement is **dropped — the list is 25**.

## Use this component for

- All phone-number entry across consoles (User-Details, Add Client/User, forgot-password SMS-OTP capture).
- Verify-via-SMS flows (`verifyButton=true`).

## Avoid this component for

- Non-phone numeric → `<falcon-angular-input-number>`.
- A country picker with no phone → `<falcon-angular-dropdown>`.
- OTP code entry → `<falcon-angular-otp>`.

## Preferred variant / render path

**`useTailwind=true` (default).** This is the only path that honors `verifyIcon` + `*ExtraClass` + `appendTo`, and it body-portals the country panel into `.falcon-overlay-container` + the native Top Layer (escapes parent stacking contexts). Use Shadow only for style isolation, accepting the inline panel + the loss of those props.

## Required upgrades before wider use

None block production. Prioritize G2 (the dead `maxlength` is a correctness trap), G1 (before recommending Shadow), and G4 (`verified` visual) for verify flows.

## Relationship to other components

- **Sibling family:** `<falcon-angular-email-field>` (same verify-button + single-border + 1px-divider family; phone adds the country chooser + dial code + the searchable popover panel — same token shape otherwise).
- **Popover infra:** shares `popover-portal.ts` + `FalconStackingService` with `<falcon-dropdown>` / `<falcon-multi-select>`.
- Legacy `<falcon-mobile-number>` (shared-ui) historically wrapped it (being phased out).
- Does NOT compose `<falcon-input>` — renders its own native `<input type="tel">`.

## Exact rule for future implementation tasks

1. **Phone field?** → `<falcon-angular-phone-field>` ALWAYS, `useTailwind=true`.
2. **Pass `country`** for a sensible default; **`[countries]`** to restrict by region.
3. **Validate** via Reactive Forms `Validators.required` + a libphonenumber/regex validator — the component never validates, and `[maxlength]` does NOT cap (G2).
4. **Bind `(blur)`** so touched updates (native blur doesn't bubble).
5. **Gate edit** via `[readonly]` off a PES flag (User-Details uses `canEditPhone`); `[verifyDisabled]` is a separate button-only gate.
6. **Seed `country`** alongside the value — `writeValue` doesn't parse a dial-code prefix; the emitted E.164 depends on `country`.
7. **Override visuals** via `--falcon-phone-field-*` tokens. The `*Class` inputs flow to `-tw`.
8. **Don't re-wire** `(falcon-open)`/`(falcon-close)` — the wrapper uses them for the Top-Layer popover.

---

## Dynamic capability assessment

### 1. What is static today?
- The 25-country `DEFAULT_PHONE_COUNTRIES` (Stencil-internal const).
- Flag-emoji rendering (OS-dependent).
- Three 1px dividers (chooser→dial, pre-verify).
- No `verified`/`verifying` state.
- `verifyIcon`/`*ExtraClass`/`appendTo` are `-tw`-only (G1); panel renders inline on Shadow, portaled on `-tw`.

### 2. What is already dynamic through inputs/outputs?
- 23 wrapper `@Input`s (label/placeholder/helper/error/country/countries/size/state/readonly/required/verifyButton/verifyLabel/verifyDisabled/verifyIcon/name/inputId/autocomplete/searchPlaceholder/emptyMessage/useTailwind/wrapperClass/inputClass/labelClass/iconRight/inputMode — count includes the `-tw`-only-honored ones).
- 3 `@Output`s — `(falcon-country-change)`, `(falcon-verify)`, `(blur)`.
- Full CVA (with the E.164-model / national-display split).

### 3. What is dynamic through slots / ng-template?
- `slot="icon-right"` (suppressed when `verifyButton` is on). No `icon-left` (chooser owns the start). No `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?
- The full standalone `--falcon-phone-field-*` set (14 categories) via the `:where(... , .falcon-overlay-container)` chain — including the portaled panel. Dark mode auto-flips; density via input-height aliases.

### 5. What is dynamic through Tailwind classes?
- Host `class=`; plus `wrapperClass`/`inputClass`/`labelClass` → `*-extra-class` to the `-tw` twin.

### 6. What is missing to make this component reusable across pages?
- A real `maxlength` (G2); Shadow-path `verifyIcon`/`*ExtraClass` parity (G1); `verified`/`verifying` (G4); verify `aria-label` (G3); method proxies (G5); `componentOnReady` push (G7); `variant`/`appearance` (G6); public country-list export (G9).

### 7. What capability should be added to the shared component (not page hack)?
- `maxlength` + the `verified` visual + the method proxies + Shadow parity — all in the shared Stencil pair + wrapper.

### 8. What flags / options / templates / slots would make it better?
- `@Input() maxlength`, `verified`, `verifying`, `variant`, `appearance`; `@Method() setFocus()/openPanel()`; Shadow-tag `verifyIcon`; barrel-exported `DEFAULT_PHONE_COUNTRIES`.

### 9. What is the safest upgrade path?
1. **Phase A (additive):** real `maxlength`, `verified`/`verifying`, method proxies, verify `aria-label`. Zero break.
2. **Phase B (parity):** `verifyIcon` + `*ExtraClass` on the Shadow tag.
3. **Phase C:** `variant`/`appearance`; `componentOnReady` push; public country export.

### 10. What is risky to change because other pages depend on it?
- The `(falcon-country-change)` / `(falcon-verify)` output names — add aliases, never remove (`(blur)` is depended on for touched).
- The CVA E.164-model / national-display contract — flows store the E.164; changing it would break persisted formats.
- The default `country='SA'` — Saudi-first; flipping surprises every consumer that relies on it.
- The default `useTailwind=true` — flipping changes DOM, the panel render-location (portal↔inline), AND drops `verifyIcon`/`*ExtraClass`.
- The default country list — removing a country silently breaks consumers selecting it.
- The Top-Layer popover wiring — re-wiring `(falcon-open)`/`(falcon-close)` would break stacking.

## Verification
🟢 code-verified (2026-06-03). Corrected: input count = 23; panel renders inline (Shadow) vs body-portaled (`-tw`); popover handlers actively acquire the Top Layer; `maxlength` is not an input (G2); default list is 25 (perf gap closed). Gap refs renumbered to match the refreshed GAPS_AND_UPGRADES.
