# falcon-popup — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-popup>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-popup.component.ts:113-211` — a **centered glossy modal card**, fixed `max-w-md` (448px), height clamped `min-h-[18rem] max-h-[22rem]`:
- A **header row** — a small ~28px **icon chip** (rounded, intent-tinted background ring) on the leading edge, a heavy 18px title beside it, and a circular close-× on the trailing edge (ts:125-183).
- A **centered body** — a paragraph of body copy, optionally a smaller grey hint line below it (ts:185-190).
- A **footer**, right-justified, using `<falcon-button-tw>` — a secondary Cancel + an intent-toned Confirm; either button can be hidden via `[hideCancel]`/`[hideConfirm]` (ts:192-210).
- A **backdrop-blur "glossy" effect** when `glossy` resolves true (`backdrop-blur-xl backdrop-saturate-150` + `::backdrop blur(8px) saturate(1.5)`) and a 180ms scale-in (`falconPopupIn`).
- Four icon glyphs, one per variant — git-pull-closed (error), trash (delete), info-circle (unsaved), git-pull-create (save) (ts:134-162).

Fingerprint vs siblings: *centered card, icon chip in the header (not centered above), glossy blur, exactly 4 recognisable decision shapes*. If the design's icon is large and centered ABOVE the title, that is `falcon-alert-dialog`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` styled as a confirmation card; or a custom `ConfirmDialog` | MUI has no 4-variant preset — popup is the Falcon canonical-flows answer |
| PrimeNG | `<p-confirmPopup>` / `confirmationService` with severity | conceptually close — severity + icon + accept/reject |
| Ant Design | `Modal.confirm` / `Modal.error` / `Modal.warning` / `Modal.success` | the static `Modal.*` family is the closest — each maps to a popup variant |
| Bootstrap | `.modal` styled per-intent | upgrade target — no variant preset |
| shadcn / Radix | `<AlertDialog>` with a per-variant icon + accent | Radix AlertDialog given variant styling |
| plain HTML | `window.confirm()` / `window.alert()` | replace — popup is the styled, variant-driven answer; `window.alert()` ≈ OK-only (`[hideCancel]`) `error` popup |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a delete confirmation ("permanently delete X, cannot be undone") | `<falcon-angular-popup variant="delete">` | confirm-dialog / alert-dialog |
| an unsaved-changes warning before navigation | `<falcon-angular-popup variant="unsaved">` (or `FalconUnsavedChangesService`) | confirm-dialog |
| a publish/save confirmation with a change summary | `<falcon-angular-popup variant="save">` | dialog |
| a generic "something went wrong, try again" error | `<falcon-angular-popup variant="error">` (or `FalconHttpErrorDialogService`) | alert-dialog |
| a decision OUTSIDE the 4 — archive, restore, approve/reject | `<falcon-angular-confirm-dialog>` | popup (closed set) |
| a centered big-icon high-stakes callout with a custom body | `<falcon-angular-alert-dialog>` | popup |
| a form / multi-field editing modal (rich body) | `<falcon-angular-dialog>` | popup (no slots) |
| a passive notification, no decision required | `<falcon-angular-notification>` / toast | popup |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Variant first** — pick `variant` by business intent: `delete` / `unsaved` / `save` / `error`. The variant carries copy, icon, intent colour, confirm tone — most of the design is decided here.
2. **Inputs** — `[open]`, `[name]` (delete-variant body interpolation only), `[hideCancel]` / `[hideConfirm]` for single-CTA mode (`[CODE]` ts:322-323).
3. **Visual sub-modes** — `[glossy]`, `[iconBg]`, `[iconColor]` — three boolean toggles; `undefined` inherits the `FalconConfigurationService` default (`[CODE]` ts:333-335).
4. **Copy overrides** — `[titleOverride]`, `[bodyOverride]`, `[hintOverride]`, `[confirmLabelOverride]`, `[cancelLabelOverride]` — ONLY when the variant default doesn't fit; an empty/whitespace string is treated as "no override" (`[CODE]` ts:343-345).
5. **No slots** — `[CODE]` popup has NO content slots. Rich body content is unsupported (deliberate; use `dialog`).
6. **No token override** — `[CODE]` popup has no token file; per-instance restyling requires source changes. The proposed `popup.tokens.css` is a GAP (G-TOKENS).
7. **GAP** — `loading`/`confirmDisabled` async state, a 5th variant, a tertiary button, a body slot, and `<falcon-angular-icon>` icons are all NOT available — raise as shared upgrades; do not hand-roll a 5th variant.

## Anti-patterns
- Using popup for a decision OUTSIDE the 4 variants — use `falcon-confirm-dialog` (closed set).
- Toggling `[open]=false` in `(confirm)` **before** async finishes — the popup vanishes and the user can't retry on failure.
- Passing `''` to an override expecting empty text — falls back to the variant default; pass `' '` (single space).
- Rendering two popups at once — both `showModal()` into the Top Layer; competing confirms confuse.
- "Fixing" the `unsaved` variant's red confirm button — the red tone is intentional ("Discard & leave" is destructive).
- Binding `(falconClick)` on the footer buttons — `[CODE]` ts:199/207 the Stencil event is `(falcon-click)`.
- Mounting your own error popup instead of using `FalconHttpErrorDialogService.show(...)`.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B14) for the visual fingerprint + composition recipe from the 416-line `falcon-popup.component.ts`. Cross-library map `[INFERRED]`. `(falcon-click)` dash-event + the `undefined`-sentinel toggles + `hideCancel`/`hideConfirm` + closed-variant-set ✅ CODE-VERIFIED. (Removed the prior "no keyboard focus trap (P0)" anti-pattern — native `showModal()` now confines focus.)
