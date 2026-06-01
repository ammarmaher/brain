# send-credentials-popup (LEGACY / ORPHAN) — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify the Falcon component for a "send credentials" confirmation — and the critical caveat that `send-credentials-popup` itself is gone.
> ⚠ **Correction vs the old 6 dossier files:** `send-credentials-popup` is an ORPHAN — no source, no consumers. **If a design matches this pattern, use the live successor `<falcon-angular-sending-credentials-dialog>`.** Everything below describes that successor as the recognition target.

## Visual fingerprint
`[CODE]` `falcon-sending-credentials-dialog.component.html:6-186` — a **wide centered modal** (`max-w-[880px]`, generous `p-16` padding) over a dimmed blurred backdrop. Anatomy:
- A **close × button** top-trailing.
- A **centered header** — a bold title ("Sending Credentials") and a muted subtitle explaining email/SMS will carry username + password.
- A **delivery-method section** — a row of **three large selectable cards** (`Send via Email`, `Send via SMS`, `Both, SMS and Email`). Each card has a **radio dot** + label, and a **decorative SVG illustration** (an envelope, a phone, a paper-plane). The selected card has a solid teal border + focus ring; unselected cards have a dashed neutral border.
- An **owner summary card** (teal-tinted) — three columns showing the account owner's **name, phone, email** each with a circular icon.
- A footer with a **Cancel** link button and a **Send Credentials** primary button.

Distinguishing it: it is a **wide modal with a 3-card illustrated radio choice** plus a **contact-summary card**. The illustrated method cards are the giveaway — it is not a plain radio list and not a generic confirm dialog.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + `<RadioGroup>` rendered as `<Card>` tiles | composed — no single MUI component; it is a Dialog with card-styled radios |
| PrimeNG | `<p-dialog>` + `<p-selectButton>` / card-styled `<p-radioButton>` | composed pattern |
| Ant Design | `<Modal>` + `<Radio.Group>` styled as selectable `<Card>`s | composed pattern |
| Bootstrap | `.modal` + `.btn-group` radio cards / `.form-check` | composed pattern |
| shadcn / Radix | `<Dialog>` + `<RadioGroup>` with `<Card>` items | composed — closest is shadcn's card-radio pattern |
| plain HTML | hand-rolled modal + `<input type="radio">` cards | replace with `<falcon-angular-sending-credentials-dialog>` |

**Recognition cue:** a **modal asking "how should we deliver login credentials?" with illustrated email/SMS/both cards and an account-owner summary** is this exact component. It is purpose-built — there is no generic "channel chooser dialog" in Falcon.

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a "send credentials" confirmation with email/SMS/both choice after creating an account | `<falcon-angular-sending-credentials-dialog>` | `send-credentials-popup` (ORPHAN — gone) |
| a generic OK/Cancel "Are you sure?" prompt | `<falcon-angular-confirm-dialog>` | this |
| one of the 4 canonical action flows (error/delete/unsaved/save) | `<falcon-angular-popup>` | this |
| a centered modal with a bespoke non-credential body | `<falcon-angular-dialog>` | this |
| a draggable ranked-list / insufficient-balance prompt | `<falcon-angular-insufficient-balance-dialog>` | this |
| a different out-of-band delivery (e.g. password reset) | a NEW component built on the `falcon-popup` self-contained pattern | extending this one |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`) — for the successor `<falcon-angular-sending-credentials-dialog>`:
1. **Inputs (visibility + data)** — `[open]` (signal), `[ownerName]` / `[ownerPhone]` / `[ownerEmail]` (the summary-card fields), `[defaultDelivery]` (`'email'` default — seeds the selected card), `[disableSend]` (in-flight guard).
2. **Inputs (labels)** — `[title]`, `[subtitle]`, `[deliveryLabel]`, `[ownerKeyLabel]` / `[phoneKeyLabel]` / `[emailKeyLabel]`, `[sendLabel]`, `[cancelLabel]`, `[closeAriaLabel]`, `[emailMethodLabel]` / `[smsMethodLabel]` / `[bothMethodLabel]` — all pre-translated strings (the parent applies the `TranslatePipe`).
3. **Inputs (dismissal)** — `[closeOnBackdrop]`, `[closeOnEsc]` (both default true).
4. **No slots** — `[CODE]` `falcon-sending-credentials-dialog.component.html` the body is fully controlled (header + 3 cards + summary + footer). You cannot project custom content; the three delivery methods are fixed.
5. **No token file** — the successor is Tailwind-utility styled (`[CODE]` template uses `bg-falcon-*` / `text-falcon-*` palette classes); restyle by overriding the Falcon palette tokens those utilities resolve to, not a component token file.
6. **Outputs** — handle `(send)` (emits `'email' | 'sms' | 'both'`) and `(cancel)` (void).
7. **App wiring** — the wizard finalize step owns the actual credential-dispatch API call; this component only collects the choice.

## Anti-patterns
- `[BRAIN-OUT]` Reaching for `<falcon-send-credentials-popup>` / `FalconSendCredentialsPopupComponent` — it is an ORPHAN; the import will fail. Use `<falcon-angular-sending-credentials-dialog>`.
- `[BRAIN-OUT]` `OVERVIEW.md:13` Using this for a generic confirmation dialog — it is domain-specific; use `confirm-dialog` / `popup`.
- `[CODE]` Expecting it to compose `falcon-dialog` — it does not; it is a self-contained Tailwind component (like `falcon-popup`).
- `[CODE]` Expecting a `DeliveryMethod` enum from `(send)` — the successor emits a string union `'email' | 'sms' | 'both'`; remap if a backend enum is needed.
- `[INFERRED]` Forgetting to reset `disableSend` after the dispatch call — Send stays disabled (the same trap the legacy `loading` prop had).
- `[INFERRED]` Building a NEW credential-flow by extending this component — instead build fresh on the `falcon-popup` self-contained pattern (this component is purpose-locked to the 3 fixed methods).

## Verification
🔴 INFERRED that `send-credentials-popup` is the ORPHAN — confirmed by `Glob` returning no source + `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md` "STATUS: ORPHAN". 🟡 CODE-DERIVED for the successor `falcon-sending-credentials-dialog` from `[CODE]` `falcon-sending-credentials-dialog.component.{ts,html}`. Cross-library mapping is `[INFERRED]`. **Correction recorded:** the recognition target is `<falcon-angular-sending-credentials-dialog>`, NOT the orphaned `send-credentials-popup`.
