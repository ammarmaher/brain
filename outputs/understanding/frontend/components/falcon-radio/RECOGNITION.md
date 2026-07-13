# falcon-radio — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-radio>` (almost always inside `<falcon-angular-radio-group>`) as the component to use, and how to compose it to parity.

## Visual fingerprint
A **circular mark** with a text label beside it, in a clickable row. Unchecked: a thin-bordered hollow circle. Checked: the circle reads as a filled ring with a solid center — but there is **no separate inner-dot element**; the center is produced by *thickening the mark's border from 1.5px to 5px* in the checked state `[CODE]` `falcon-radio.tsx:1-8`, with the border turning teal. Optional red required `*` on the label, optional helper line, optional error line (`role="alert"`). Recognition signal: **circular** marks appearing in a set where exactly one is filled — that exclusivity is the radio tell (squares that allow multiple = checkbox).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Radio>` / `<RadioGroup>` + `<FormControlLabel>` | MUI `<Radio>` ≈ `<falcon-angular-radio>`; `<RadioGroup>` ≈ `<falcon-angular-radio-group>` |
| PrimeNG | `<p-radioButton>` | direct 1:1 — this component replaced `<p-radioButton>` |
| Ant Design | `<Radio>` / `<Radio.Group>` (and `<Radio.Button>` segmented variant) | `<Radio.Group>` ≈ the Falcon group; Ant's button-style variant has no direct Falcon equivalent |
| Bootstrap | `.form-check` with `<input type="radio">` | upgrade target |
| shadcn / Radix | `<RadioGroup>` / `<RadioGroupItem>` (Radix RadioGroup) | Radix RadioGroupItem ≈ `<falcon-angular-radio>`; both wrap a real radio |
| plain HTML | `<input type="radio">` | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| ONE circular option in a custom layout (e.g. one per card) | `<falcon-angular-radio>` standalone | radio-group |
| SEVERAL circular options, pick exactly one | `<falcon-angular-radio-group>` | hand-rolled `<falcon-angular-radio>` set |
| a square box that can be checked independently | `<falcon-angular-checkbox>` | radio |
| several square boxes, pick any number | `<falcon-angular-checkbox-group>` | radio-group |
| an on/off toggle | `<falcon-angular-switch>` | radio |
| one value picked from a long hidden list | `<falcon-angular-dropdown>` | radio |
| a segmented button-style single choice | (no direct Falcon equivalent — raise a GAP) | radio (visually different) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory` — inputs → templates → slots → variants → token override → upgrade → wrapper):
1. **Prefer the group** — for any choice of 2+ options use `<falcon-angular-radio-group>`; it owns the shared `name`, arrow-key navigation, and the single-value CVA. Do not assemble radios by hand.
2. **Inputs (per radio / per group option)** — `[label]`, `[value]` (the business value for that option — always set it), `[helperText]`, `[errorText]`, `size`, `[required]`.
3. **Binding** — inside a group, the group's CVA / `formControlName` handles selection. Standalone: bind `[checkedInput]` for parent-driven check, or a `formControl` whose value matches the radio's `value`.
4. **Exclusivity** — ensure all radios in one choice share a `name` (the group does this automatically).
5. **Slots** — Stencil exposes a default slot for label content; the simple `[label]` input covers most cases.
6. **Tokens** — restyle via `radio.tokens.css` `--falcon-radio-*` (mark size, checked border/teal, focus ring). The host class accepts override classes (e.g. `.add-client-special-radio`).
7. **Upgrade** — a `description` line, per-option `iconUrl`, or method proxies are GAPs (`DECISION.md` G2/G4) — raise, do not hand-roll.

## Anti-patterns
- Hand-rolling multiple `<falcon-angular-radio>`s for a multi-option choice — use `<falcon-angular-radio-group>`; otherwise you re-implement `name` sharing, keyboard nav, and the value contract incorrectly.
- Using radios for a true on/off boolean — use `<falcon-angular-switch>` / `<falcon-angular-checkbox>`.
- Native `<input type="radio">` or PrimeNG `<p-radioButton>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Binding a boolean form control to a single radio expecting checkbox behavior — radio CVA `writeValue` takes the *group's* value and self-compares; it is not a boolean toggle.
- Waiting for an "unchecked" event when another radio is picked — the browser fires no `change` on the un-checked radio; read the newly-checked value.
- Expecting `[disabled]` as a template input — it does NOT exist under that name; the parent-driven disable input is `[disabledInput]` (or disable via the form control). `[disabled]="…"` silently no-ops.

## Verification
🟡 RE-VERIFIED 2026-06-03 (B06) — CODE-DERIVED from `[CODE]` falcon-radio.tsx + falcon-radio.component.ts + falcon-radio.component.html. Cross-library map 🔴 INFERRED from each library's public API. Border-width-5 mark, group-valued CVA, no-uncheck-event ✅ VERIFIED against source. Note corrected: parent-driven disable input EXISTS but is named `disabledInput` (not `disabled`) — the "Expecting `[disabled]`" anti-pattern stands.
