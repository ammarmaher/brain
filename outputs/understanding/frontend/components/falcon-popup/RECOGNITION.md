# falcon-popup — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-popup>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-popup.component.ts:89-201` — a **centered glossy modal card**, fixed `max-w-md` (448px), height clamped `min-h-[18rem] max-h-[22rem]`:
- A **header row**: a small ~28px **icon chip** (rounded, intent-tinted background ring) on the leading edge, a heavy 18px title beside it, and a circular close-X on the trailing edge `[CODE]` `:113-171`.
- A **centered body** — a paragraph of body copy, optionally a smaller grey hint line below it `[CODE]` `:173-178`.
- A **2-button footer**, right-justified, using `<falcon-button-tw>` — a secondary Cancel + an intent-toned Confirm `[CODE]` `:180-198`.
- A **backdrop-blur "glossy" effect** by default (`backdrop-blur-md backdrop-saturate-150`, `[CODE]` `:93-97`) and a 180ms scale-in animation (`falconPopupIn`, `:205-217`).
- Four icon glyphs, one per variant — git-pull-closed (error), trash (delete), info-circle (unsaved), git-pull-create (save) `[CODE]` `:122-150`.

The fingerprint vs siblings: *centered card, icon chip in the header (not centered above), glossy blur, exactly 4 recognisable decision shapes*. If the design's icon is large and centered above the title, that is `falcon-alert-dialog`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` styled as a confirmation card; or a custom `ConfirmDialog` wrapper | MUI has no 4-variant preset — popup is the Falcon canonical-flows answer |
| PrimeNG | `<p-confirmPopup>` / `confirmationService` with severity | conceptually close — PrimeNG severity + icon + accept/reject |
| Ant Design | `Modal.confirm` / `Modal.error` / `Modal.warning` / `Modal.success` | the static `Modal.*` family is the closest match — each maps to a popup variant (`error`→error, `confirm`→delete/unsaved/save) |
| Bootstrap | `.modal` styled per-intent | upgrade target — no variant preset |
| shadcn / Radix | `<AlertDialog>` with a per-variant icon + accent | Radix AlertDialog given variant styling |
| plain HTML | `window.confirm()` / `window.alert()` | replace — popup is the styled, variant-driven answer; `window.alert()` ≈ OK-only `error` popup |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a delete confirmation ("permanently delete X, cannot be undone") | `<falcon-angular-popup variant="delete">` | confirm-dialog / alert-dialog |
| an unsaved-changes warning before navigation | `<falcon-angular-popup variant="unsaved">` | confirm-dialog |
| a publish/save confirmation with a change summary | `<falcon-angular-popup variant="save">` | dialog |
| a generic "something went wrong, try again" error | `<falcon-angular-popup variant="error">` | alert-dialog |
| a decision OUTSIDE the 4 — archive, restore, approve/reject | `<falcon-angular-confirm-dialog>` | popup (variants are a closed set) |
| a centered big-icon high-stakes callout with a custom body | `<falcon-angular-alert-dialog>` | popup |
| a form / multi-field editing modal | `<falcon-angular-dialog>` | popup |
| a passive notification, no decision required | `<falcon-angular-notification>` / toast | popup |

## Composition recipe to reach parity
Customization order (per `[VAULT]` `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Variant first** — pick `variant` by business intent: `delete` / `unsaved` / `save` / `error` `[CODE]` `API.md:65-80`. The variant carries copy, icon, intent colour, and confirm tone — most of the design is decided here.
2. **Inputs** — `[open]`, `[name]` (delete-variant body interpolation only), `[hideCancel]` / `[hideConfirm]` for single-CTA mode `[CODE]` `falcon-popup.component.ts:252-253`.
3. **Visual sub-modes** — `[glossy]`, `[iconBg]`, `[iconColor]` — three boolean toggles; `undefined` inherits the `FalconConfigurationService` default `[CODE]` `:239-241`.
4. **Copy overrides** — `[titleOverride]`, `[bodyOverride]`, `[hintOverride]`, `[confirmLabelOverride]`, `[cancelLabelOverride]` — use ONLY when the variant default does not fit the page; an empty/whitespace string is treated as "no override" `[CODE]` `:273-275`.
5. **No slots** — `[CODE]` `API.md:89-90` — popup has NO content slots. Rich body content is not supported; that is a deliberate constraint.
6. **No token override** — `[CODE]` `TOKENS.md:4` — popup has no token file; per-instance restyling requires source changes. The proposed `popup.tokens.css` is a documented GAP (`TOKENS.md:76-102`).
7. **GAP** — focus trap, `loading` / `confirmDisabled` async state, a 5th variant, a tertiary button, and a body slot are all NOT available `[CODE]` `GAPS_AND_UPGRADES.md:3-93`. `DECISION.md:159-168` recommends composing `<falcon-angular-dialog>` internally as the highest-leverage upgrade. Raise it; do not hand-roll a 5th variant.

## Anti-patterns
- Using popup for a decision OUTSIDE the 4 variants — `[CODE]` `USAGE.md:112` use `falcon-confirm-dialog` instead; `VARIANTS` is a closed set.
- Toggling `[open]=false` in the `(confirm)` handler **before** async work finishes — `[CODE]` `USAGE.md:138` the popup vanishes and the user cannot retry on failure.
- Passing `''` to an override expecting empty text — `[CODE]` `USAGE.md:113` empty string falls back to the variant default; pass `' '` (single space) for genuinely empty.
- Rendering two popups at once — `[CODE]` `USAGE.md:116` no focus stack; the second steals.
- "Fixing" the `unsaved` variant's red confirm button — `[CODE]` `GAPS_AND_UPGRADES.md:112-113` the red tone is intentional ("Discard & leave" is destructive).
- Relying on a keyboard focus trap — `[CODE]` `USAGE.md:117` there is none (P0 gap).
- Binding `(falconClick)` on the footer buttons — `[CODE]` `falcon-popup.component.ts:187` the Stencil event is `(falcon-click)`.

## Verification
🟢 LANDED for current usage — 8 production consumers (`USAGE.md:141-153`). 🟡 CODE-DERIVED for the visual fingerprint + composition recipe from `falcon-popup.component.ts`. Cross-library map is `[INFERRED]` from each library's documented confirmation primitive.
