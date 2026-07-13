# falcon-switch — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-switch>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A horizontal **pill-shaped track** that changes background color between off (neutral grey) and on (teal), with an optional **label** to the trailing side. Three coexisting variants:
- **`dot-knob`** (default) — a round **knob** that slides from the leading edge (off) to the trailing edge (on); the track recolors as it slides.
- **`hidden-input`** — a flat **knobless pill**; only the track color signals state.
- **`channel-pill`** — a **bordered pill** (1.5px border, 100px radius, 44×22) with a small dot whose fill flips on toggle; tinted teal when on, neutral outline when off.

Optional inner text labels (`textOn` / `textOff`) can appear inside the track of **any** variant when set — the "on" word shows when checked, the "off" word when unchecked (cross-faded by opacity). Plus: an optional `*` required asterisk on the label, a teal focus halo ring, error coloring, helper text below. In RTL the knob slides toward the opposite direction and the inner-label order flips. NOTE: track/knob geometry is per-VARIANT; `size` (sm/md/lg) currently rescales the **label font only**, not the switch (GAPS G8).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Switch>` / `<FormControlLabel control={<Switch/>}>` | direct 1:1 — MUI Switch ≈ `dot-knob`. |
| PrimeNG | `<p-inputSwitch>` / `<p-toggleSwitch>` | direct 1:1 — this component **replaces** `<p-inputSwitch>`. |
| Ant Design | `<Switch>` / `<Switch checkedChildren unCheckedChildren>` | Ant's `checkedChildren`/`unCheckedChildren` ≈ the `channel-pill` `textOn`/`textOff`. |
| Bootstrap | `.form-check.form-switch` + `<input type="checkbox">` | upgrade target — replace with this component. |
| shadcn / Radix | `<Switch>` (Radix Switch) | direct 1:1 — Radix Switch ≈ `dot-knob`. |
| plain HTML | `<input type="checkbox">` styled as a toggle | always replace with this component (`feedback_falcon_ui_library_only_no_native`). |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a sliding on/off knob or recoloring pill | `<falcon-angular-switch>` | — |
| a track with ON/OFF (or named state) text inside | `<falcon-angular-switch variant="channel-pill">` | a two-option radio |
| a square box recording a form-time yes/no | `<falcon-angular-checkbox>` | switch |
| "I agree" / required acceptance | `<falcon-angular-checkbox>` | switch (`USAGE.md:85`) |
| mutually exclusive named options (e.g. Monthly/Yearly) | `<falcon-angular-radio-group>` / `<falcon-angular-dropdown>` | switch |
| a tri-state / "unknown" value | none of these — switch is strictly boolean | switch |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[label]`, `[(ngModel)]` / `formControlName` (CVA), `[size]`, `[state]`, `[helperText]`, `[errorText]`, `[required]`.
2. **Variant** — pick `variant`: `dot-knob` (default feature toggle), `hidden-input` (compact dense rows), `channel-pill` (bordered pill). To show the state in words, set `[textOn]` / `[textOff]` — they work in ANY variant.
3. **Slot** — there is NO label slot (the wrapper renders `[label]` text only — GAPS G2); compose a rich label outside the component.
4. **Parent-driven** — use `[checkedInput]` when a parent slice / table row owns the value (backend-confirmed toggles); use `[disabled]` (the setter input) for parent-driven disable; never combine `[checkedInput]` with CVA.
5. **Token override** — restyle track / knob colors and sizes via `switch.tokens.css` vars (`--falcon-switch-track-bg-on`, `--falcon-switch-knob-bg`, etc.); never hardcode hex/px.
6. **Shared upgrade** — a `loading` state (G3), `description` sub-label (G2), `errorMessage` alias (G1), or in-knob icon (G6) is a GAP (`GAPS_AND_UPGRADES.md`) — raise it, do not hand-roll.
7. **Wrapper** — for new pages always use `<falcon-angular-switch>` (the Angular wrapper), never the raw Stencil tag.

## Anti-patterns
- Native checkbox styled as a toggle, or PrimeNG `<p-inputSwitch>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Both `[(ngModel)]` and `[checkedInput]` on one instance — they fight (`USAGE.md:79`).
- Assuming `textOn`/`textOff` only work on `channel-pill` — they render in ANY variant (CORRECTED 2026-06-03).
- Treating a switch as instantly committed when the backend can reject it — gate `[disabled]` during the call and reconcile with the confirmed state.
- Using a switch for a required form acceptance ("I agree") — that is a checkbox (`USAGE.md:85`).
- Modelling a choice between two *named things* as a `channel-pill` switch — that is a radio/dropdown decision; the pill labels describe a *state*, not options.
- Expecting tri-state — switch is strictly boolean by design (`GAPS_AND_UPGRADES.md:25`).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B06) — CODE-DERIVED from falcon-switch.tsx + falcon-switch-tw.tsx + switch.tokens.css. CORRECTED: channel-pill is a bordered pill (not "two text labels each side"); `textOn`/`textOff` render in any variant; no label slot exists; `size`=label-font-only (G8). Cross-library mapping `[INFERRED]` from standard parity.
