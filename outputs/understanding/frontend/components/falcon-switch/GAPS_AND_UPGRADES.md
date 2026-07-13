# falcon-switch — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — `errorText` vs `errorMessage` naming inconsistency (P2)

`[CODE]` Wrapper input `errorText` (ts:53) binds to Stencil attr `error-message`; the Stencil prop is `errorMessage` (falcon-switch.tsx:43). `[errorMessage]` on a switch is a silent no-op. **Recommended:** add an `errorMessage` alias.

### G2 — No method proxies + no label slot (P2)

`[CODE]` Stencil `@Method() setFocus()` + `toggle()` exist on both tags (falcon-switch.tsx:82-92, -tw:102-111) but the wrapper proxies neither; there is also no label `<slot>` (the wrapper renders `[label]` text only). **Recommended:** add async `setFocus()`/`toggle()` proxies; for rich labels add a slot or a `description` input.

### G3 — No loading / pending state (P2)

`[CODE]` For an async-confirmed toggle (feature flag / row visibility the backend must acknowledge) there is no built-in pending affordance. The host must gate `[disabled]` during the call. **Recommended:** add `@Input() loading = false` + a token-driven spinner in the track.

### G4 — `falcon-focus` event not surfaced (P2)

`[CODE]` Both tags emit `falcon-focus` (falcon-switch.tsx:65-66); the wrapper binds only `(falcon-change)` + `(falcon-blur)` (html:27-28/47-48). **Recommended:** add `@Output() falconFocus`.

### G5 — Wrapper `handleChange` has no disabled guard (P2 — defensive)

`[CODE]` falcon-switch.component.ts:124-130 — unlike the radio wrapper (which early-returns when disabled), the switch wrapper's `handleChange` does NOT guard. It relies entirely on the Stencil layer blocking the native click (`if (this.disabled) { event.preventDefault(); return; }`, falcon-switch.tsx:99-106). Safe today, but a render-path change that bypasses the native input could let a disabled switch emit. **Recommended:** add a `if (this.disabled$()) return;` guard to mirror the radio.

### G6 — No icon inside the knob (P3)

`[CODE]` No `onIcon`/`offIcon`. Some products embed a check/X in the knob. **Recommended:** optional `@Input() onIcon? / offIcon?`.

### G7 — `value` input is vestigial for non-form UI (P3)

`[CODE]` ts:58 — `value` forwards to the native checkbox `value` attr (form submit). For pure boolean UI without a native form submit it does nothing useful (the boolean is the answer). Document.

### G8 — `size` does NOT rescale the switch geometry (P2)

`[CODE]` `--falcon-switch-size-scale-{sm,md,lg}` (switch.tokens.css:91-93) are declared but neither the Shadow CSS nor `switch-tailwind-classes.ts` multiplies track/knob geometry by them. Track/knob dimensions are **per-variant constants** (`--falcon-switch-track-w-dot-knob` etc.). So `size` only changes the label font (`--falcon-switch-label-font-size-{sm,md,lg}`). A consumer expecting `size="lg"` to enlarge the toggle gets only a bigger label. **Recommended:** either wire the scale tokens into the geometry (`calc()`-multiply track/knob dims) or document that `size` is label-only and add explicit per-variant geometry override guidance.

### G9 — Reserved group tokens with no switch-group component (P3)

`[CODE]` switch.tokens.css:200-207 declares `--falcon-switch-group-*` (gap, group label) but there is no `<falcon-angular-switch-group>` component. Reserved / dead. **Recommended:** leave reserved (or build the group if there's demand).

### G10 — Tri-state ('indeterminate') unsupported (by design — fine)

Document explicitly that switches are strictly boolean.

## Missing accessibility features

- **A1 (P2):** verify `aria-checked` transitions are announced by AT across all 3 variants.
- **A2 (P3):** verify the focus halo is visible on all 3 variants (channel-pill's bordered look may interact with the halo).

## Missing tests

- `[CODE]` **No Angular wrapper spec and no `-tw` twin spec.** A wrapper spec should cover CVA `writeValue`, the `disabled`/`checkedInput` bypass paths, the (missing) disabled guard in `handleChange` (G5), the three variants, and `textOn`/`textOff` rendering in a non-pill variant.

## Missing Tailwind / token parity

- `[CODE]` Shadow + `-tw` share `--falcon-switch-*` tokens via the `:where(...)` chain (switch.tokens.css:38); the per-variant geometry + state branches are reproduced in `switch-tailwind-classes.ts`. **Parity OK at the token level.** The `size-scale-*` non-wiring (G8) affects both paths equally.

## Performance risks

- Signals + `OnPush` — efficient. `buildTrackClasses`/`buildKnobClasses` re-run per render but cost is trivial. **No real risk.**
- Module-level `__idSeq` (ts:26) — fine for SPA; MF remotes would each have their own counter, prefix `falcon-asw-` makes collisions unlikely.

## Visual / interaction risks

- `textOn`/`textOff` with long strings can overflow the small track (font-size 9px) — token-driven max-width / truncation would help.
- A loading addition (G3) needs careful track layout so the spinner doesn't fight the knob.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G8 | Wire `size` into geometry OR document label-only | P2 |
| G3 | `loading` state | P2 |
| G1 | `errorMessage` alias | P2 |
| G2 | Method proxies (`setFocus`/`toggle`) + label slot | P2 |
| G4 | Bind/re-emit `falcon-focus` | P2 |
| G5 | Disabled guard in `handleChange` | P2 |
| G6 | Knob icon | P3 |
| G9 | Build switch-group or drop reserved tokens | P3 |

## Concrete upgrade API

```ts
// Angular wrapper additions
@Input() errorMessage?: string;              // alias of errorText
@Input() loading = false;                    // G3
@Input() onIcon?: string;
@Input() offIcon?: string;
@Output() falconFocus = new EventEmitter<boolean>();
async setFocus(): Promise<void>;
async toggle(): Promise<void>;
// handleChange(): add `if (this.disabled$()) return;`   // G5
```

## Fix-shared-vs-per-page

All shared. The current per-page disabled-during-async pattern (service-pricing-table) is exactly what G3's `loading` would tidy.

## Workarounds (if upgrade blocked)

- For G3 today: gate `[disabled]` while pending + show a sibling spinner externally (the service-pricing pattern).
- For G8 today: override the per-variant geometry tokens on a host class for a bigger/smaller switch.
- For G2 today: build a rich label outside the component.

## Wave 7 Findings (2026-05-17)

**Consumer count: 7** (incl. `playground.page.html`, now gone). See USAGE for the (stale) list.

## Deep-Dive Sweep Findings (2026-06-03 — B06)

**Consumer count: 4 `.html` render sites + 1 TS template (service-pricing) + 1 in `libs/falcon` (service-pricing-table)** ([CODE] grep `<falcon-angular-switch[\s>]`).

Drift corrected vs prior dossier (no deletion/promotion flags; component stays ACTIVE/PREFERRED):
- **API drift fixed** — added the `disabled` setter input (parent-driven, G-25); corrected `textOn`/`textOff` to render in ANY variant (not channel-pill-only); documented `setFocus`/`toggle` exist on BOTH tags but are unproxied; removed the fabricated label slot.
- **NEW G8** — `size` does not rescale geometry (`size-scale-*` tokens declared but unwired) — label-font-only.
- **NEW G5** — the wrapper's `handleChange` lacks a disabled guard (relies on Stencil).
- **NEW G9** — reserved `--falcon-switch-group-*` tokens, no switch-group component.
- **Fabricated tokens removed** — `--falcon-switch-knob-position-off/on`, `--falcon-switch-track-border-error`, `--falcon-switch-text-on-padding-x` (real: per-variant geometry + `knob-translate-<variant>`).
- All findings are `safe-local` (doc) — see FINDINGS/B06.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06) against all source layers. G5/G8/G9 added from live code; the channel-pill-only `textOn`/`textOff` claim + fabricated tokens corrected. No deletion/promotion flags — component stays ACTIVE/PREFERRED.
