# falcon-radio — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — `errorText` vs `errorMessage` naming inconsistency (P2)

`[CODE]` The wrapper input is `errorText` (falcon-radio.component.ts:51) but binds to the Stencil attr `error-message`, and the Stencil prop is `errorMessage` (falcon-radio.tsx:42). Siblings name it `errorMessage`. Works end-to-end; the name is just inconsistent. **Recommended:** add an `errorMessage` alias `@Input` that writes the same value.

### G2 — No method proxies on the Angular wrapper (P2)

`[CODE]` `<falcon-radio>` / `<falcon-radio-tw>` both define `@Method() setFocus()` + `select()` (falcon-radio.tsx:77-87, -tw:92-101), but the wrapper proxies NEITHER. No Angular-side `focus()`/`select()`. **Recommended:** tag the inner element with a template ref and add async proxies.

### G3 — `falcon-focus` event not surfaced (P2)

`[CODE]` Both tags emit `falcon-focus` (falcon-radio.tsx:60-61, -tw:76-77). The wrapper binds only `(falcon-change)` + `(falcon-blur)` (html:24-25/41-42). Consumers needing a focus signal must attach a native `(focus)`. **Recommended:** add `@Output() falconFocus`.

### G4 — Parent-driven disable input is `disabledInput`, not `disabled` (P2 — papercut)

`[CODE]` The parent-driven disable input is named `disabledInput` (ts:71), whereas `<falcon-angular-switch>`'s equivalent is named `disabled` (falcon-switch.component.ts:77). `[disabled]` on a radio silently no-ops. **Recommended:** add a `disabled` alias (or rename with back-compat) so the two siblings match.

### G5 — No "description" sub-label / rich-label slot (P3)

`[CODE]` The Stencil `.tsx` renders `{this.label}` text only — no `<slot>` for rich label content (the prior dossier's "default slot for label content" is unconfirmed). Card-style radios with a description line (e.g. the templates type cards) must build the description outside the component. **Recommended:** add a `description` input OR a real label slot.

### G6 — `success` / `warning` states are visually inert (P3)

`[CODE]` `state` accepts `success`/`warning` (falcon-radio.types.ts:6), but `hasError` (utils:25-27) is only true for `error`/`errorMessage`, and the CSS state branches only cover error/disabled/checked/focus. So `success`/`warning` paint like default unless someone targets the reflected `state` attr. **Recommended:** either implement success/warning visuals or drop them from the type.

### G7 — No per-option icon (P3)

`[CODE]` No `iconUrl`/icon input. Designs that want a small glyph left of the label must bake it into the `label` text. **Recommended:** optional `@Input() iconUrl?` for parity with dropdown options (low priority).

## Missing accessibility features

- **A1 (P3):** required asterisk is `aria-hidden="true"`; relies on `aria-required` only. Acceptable, worth a doc note.
- **A2 (P3):** verify the focus halo is visible at `size='sm'` (14px mark) in dark mode.
- **A3 (P2):** group-level arrow-key navigation is delegated to native same-`name` grouping (no explicit roving tabindex). Works for native inputs, but undocumented — verify at runtime in the grouped scenario.

## Missing tests

- `[CODE]` **No Angular wrapper spec and no `-tw` twin spec.** There is no `falcon-radio.component.spec.ts` and no e2e for `<falcon-radio-tw>`. A wrapper spec should cover: CVA `writeValue` group-value comparison, `checkedInput`/`disabledInput` bypass paths, the `handleChange` disabled-guard (`if (this.disabled()) return`), and `(valueChange)` emission. The closest existing coverage is the app-level `apps/admin-console/.../new-wallet-balance/__tests__/radio-pill.spec.ts` (asserts wb-radio-pill renders `<falcon-angular-radio>` — not the component's own behavior).

## Missing Tailwind / token parity

- `[CODE]` Shadow + `-tw` share `--falcon-radio-*` tokens via the `:where(...)` chain (radio.tokens.css:44). The border-width-5 trick is reproduced identically in `radio-tailwind-classes.ts` (`border-[length:var(--falcon-radio-border-width-checked)]`). **Parity OK at the token level.**
- `[CODE]` `radio-tailwind-classes.ts:84-101` reads `--falcon-radio-label-color-error/disabled/default` for the label; the Shadow CSS matches. No divergence found.

## Performance risks

- Wrapper uses signals + `OnPush` — efficient. `defaultWrapperClasses`-style method calls re-run per CD cycle but cost is trivial string concat. **No real risk.**
- Module-level `__idSeq` (ts:25) — fine for SPA; MF remotes with independent bundles would each have their own counter, but the `falcon-arad-` prefix makes collisions extremely unlikely.

## Visual / interaction risks

- The border-width-5 dot is visually sensitive at `size='sm'` and in dark mode — verify the teal ring reads as a filled dot, not a thick outline.
- `checkedInput=true` + a slow CVA `writeValue` could momentarily disagree if both are bound (don't bind both — see API constraints).

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G2 | Expose `setFocus()` / `select()` on Angular wrapper | P2 |
| G1 | `errorMessage` alias input | P2 |
| G3 | Bind/re-emit `falcon-focus` | P2 |
| G4 | `disabled` alias (match switch) | P2 |
| G5 | `description` input / label slot | P3 |
| G6 | Implement or drop `success`/`warning` | P3 |
| G7 | `iconUrl` per option | P3 |

## Recommended upgrade API (concrete)

```ts
// Angular wrapper additions
@Input() errorMessage?: string;          // alias of errorText
@Input() set disabled(v: boolean | null) { this.disabled.set(!!v); } // alias of disabledInput
@Input() description?: string;
@Output() falconFocus = new EventEmitter<boolean>();
async setFocus(): Promise<void>;
async select(): Promise<void>;
```

## Fix-shared-vs-per-page

All gaps above belong in the **shared Falcon component**, not per-page. The wrapper is the single chokepoint that proves the dual-render pattern.

## Workarounds (if upgrade blocked)

- For G2 today: `ViewChild` the host, `querySelector('input')?.focus()`.
- For G3 today: native `(focus)` listener.
- For G5 today: build the description line outside the component (as the templates cards do).

## Wave 7 Findings (2026-05-17)

**Consumer count: 5** ([CODE] grep `<falcon-angular-radio>`). See USAGE for the (now-stale) Wave-7 list.

## Deep-Dive Sweep Findings (2026-06-03 — B06)

**Consumer count: 5 `.html` render sites + 1 TS template (wb-radio-pill) + 2 in `libs/falcon`** ([CODE] grep `<falcon-angular-radio[\s>]`).

Drift corrected vs prior dossier (no deletion/promotion flags; component stays ACTIVE/PREFERRED):
- **API drift fixed** — added `disabledInput` (the parent-driven inert-disable input, entirely missing before), `inputId`, `value` default; corrected to a single `@Output` `(valueChange)`; documented `setFocus`/`select` exist on BOTH tags but are unproxied.
- **Fabricated facts removed** — the `<falcon-angular-otp-send-dialog>` consumer (no radio reference exists) and the `--falcon-radio-bg-checked-inner` token (does not exist; real mechanism = `border-width-checked` 5px).
- **New gap G4** — parent-disable input naming mismatch vs switch (`disabledInput` vs `disabled`).
- All findings are `safe-local` (doc) — see FINDINGS/B06.md. The HIGH-RISK items in B06 are on the radio-**group**, not this component.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06) against all source layers. Gaps re-derived from live code; G4 (disable-naming mismatch) added; fabricated consumer + token removed. No deletion/promotion flags — component stays ACTIVE/PREFERRED.
