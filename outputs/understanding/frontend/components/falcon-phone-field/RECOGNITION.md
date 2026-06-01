# falcon-phone-field — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-phone-field>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-phone-field.tsx:309-399` — A single bordered field split into segments by **1px vertical dividers** (not separate borders):
1. **Country chooser** (start side) — a flag glyph + a small down-chevron, clickable. `[CODE]` `:311-340`
2. **Dial code** — a read-only label like `+966`. `[CODE]` `:346-348`
3. **Native phone input** — `type="tel"`, the typeable area. `[CODE]` `:351-372`
4. **Optional Verify button** (end side) — appears only when `verifyButton` is set, preceded by its own divider. `[CODE]` `:381-398`

Clicking the chooser opens a floating **country panel**: a search box at the top, then a scrollable list of rows each showing `flag · country name · dial code`; the selected row is highlighted. `[CODE]` `:401-476`. Label + required-asterisk above; helper or error text below.

Distinguishing feature vs siblings: the **flag-glued-to-input** look — a flag and dial code fused into the left edge of a text field, all under one border.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TextField>` + a country `<Select>` `InputAdornment`, or `mui-tel-input` | `mui-tel-input` is the closest 1:1 — flag adornment + intl input. |
| PrimeNG | no native intl-phone; usually `<p-inputgroup>` + `<p-dropdown>` + `<p-inputmask>` | Falcon replaces that hand-assembly with one component. |
| Ant Design | `<Input>` + `addonBefore={<Select/>}` (country) | `addonBefore` country select ≈ the chooser segment. |
| Bootstrap | `intl-tel-input` (the jQuery/JS plugin) bolted onto an `<input>` | This component replaced exactly that pattern (`ngx-intl-tel-input` was uninstalled). |
| shadcn / Radix | `react-phone-number-input` or a custom `<Input>` + `<Popover><Command>` country picker | The Popover+Command country search ≈ the Falcon country panel. |
| plain HTML | `<input type="tel">` (no country picker) | Always upgrade — the bare tel input loses the dial code + chooser. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a flag + dial code fused to a phone input | `<falcon-angular-phone-field>` | — |
| a phone number that triggers an SMS code | `<falcon-angular-phone-field [verifyButton]="true">` then `<falcon-angular-otp-send-dialog>` | a bare input |
| a 4–8 box code entry | `<falcon-angular-otp>` | phone-field |
| a plain numeric value (quota, count) | `<falcon-angular-input-number>` | phone-field |
| a masked secret with reveal eye | `<falcon-angular-password>` | phone-field |
| a country picker with NO phone | `<falcon-angular-dropdown>` (with `iconUrl` flags) | phone-field |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[label]`, `[(ngModel)]`/CVA, `country` (ISO-2 default, e.g. `'SA'`), `[required]`, `size`, `[state]` + `[errorMessage]` for error rendering.
2. **Country scope** — pass `[countries]` to restrict the list to the business region (e.g. GCC-only). Default is the built-in 25-country list.
3. **Verify affordance** — set `[verifyButton]="true"` + `verifyLabel`; handle `(falcon-verify)` to open an OTP-send dialog.
4. **Validation** — the component does NOT validate; add `Validators.required` + a libphonenumber/regex validator on the Reactive Forms control. This is mandatory, not optional.
5. **Tokens** — restyle chooser bg, dividers, verify button via `phone-field.tokens.css` vars; never hardcode CSS.
6. **GAP** — a per-country "verified ✓" badge or a pluggable validator input do not exist — raise as a library upgrade (`GAPS_AND_UPGRADES.md` G1/G2), do not hand-roll around the component.

## Anti-patterns
- `<falcon-angular-input type="tel">` for a phone — loses the chooser, dial code, and divider treatment.
- Trusting the emitted value as a valid number — it is digit-stripped and composed, never validated.
- `[attr.disabled]` — bind the `disabled` *property*, not the attribute.
- Re-implementing the country panel or flag picker — it is built in; restrict via `[countries]` instead.
- Native `intl-tel-input` / `ngx-intl-tel-input` in app code — banned; both were removed from the platform.

## Verification
🟡 CODE-DERIVED from `falcon-phone-field.tsx` render tree + `falcon-phone-field.component.ts`. Cross-library mappings 🔴 INFERRED from standard library APIs.
