# falcon-sending-credentials-dialog — GAPS AND UPGRADES

## Supersession note (2026-06-03 — B19)

`[CODE]` This component is the **live successor of `send-credentials-popup`** (legacy bespoke Angular component at `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/`, now **deleted from source**). Confirmed by `libs/falcon/src/shared-ui/index.ts:25-26`: "send-credentials-popup re-export removed — that folder does not exist on disk. Use `<falcon-angular-sending-credentials-dialog>` from @falcon/ui-core/angular."

Differences carried forward / changed vs the old dossier:
- **Render approach:** old = composed `<falcon-angular-dialog>` + `<falcon-angular-radio>` + a `.scss` file (SCSS-rule violation). New = pure Angular composite over a native `<dialog>` + `[falconOverlay]` directive + `<falcon-button-tw>`, no SCSS.
- **State contract:** old = `[(visible)]` two-way + `submit` output + `DeliveryMethod` enum (`@falcon/shared-types`). New = one-way `[open]` + `(send)`/`(cancel)` + a NEW `FalconCredentialDeliveryMethod` string union.
- **API style:** old = `@Input`/`@Output` decorators. New = signal `input()`/`output()`, `computed`, `effect`, `viewChild`.
- **Method UI:** old radio group → new 3 illustrated `role="radio"` cards.

**Action:** the old dossier at `understanding/frontend/components/send-credentials-popup/` (+ its `falcon-wiki/30-Components/send-credentials-popup.md` projection, if any) is an **ORPHAN** — flag for **B23** to mark superseded / archive. Do NOT edit it this pass (read-only on prior dossiers except the unit being refreshed).

## Missing capabilities (active source verified)

### G1 — Method cards are `role="radio"` divs without a radio-group container or roving-tabindex (P1, a11y)

`[CODE]` html:51-81 — each card is `<div role="radio" tabindex="0" [attr.aria-checked]>`, but there is **no enclosing `role="radiogroup"` + `aria-label`**, and every card is `tabindex="0"` (no roving-tabindex; arrow keys do not move between options). Space/Enter pick works (ts:180-185), but screen-reader users get three standalone radios with no group semantics and keyboard users tab through all three.

**Recommended fix (P1):** wrap the 3 cards in `<div role="radiogroup" [attr.aria-label]="deliveryLabel()">`; implement roving-tabindex (selected card `tabindex=0`, others `-1`) + ArrowUp/Down/Left/Right to move selection. Risk: a11y behavior change — `HIGH-RISK-QUEUE`.

### G2 — Hardcoded SVG fills + raw rgba/px do not adapt to dark mode / tokens (P2)

`[CODE]` The 3 illustration SVGs hardcode `#0d3f44` / `#E1ECEA` / `#fff` / `#1a5e63` (html:87-124); panel + selected-card shadows use raw `rgba(...)`; geometry uses arbitrary px (`rounded-[18px]`, `rounded-[14px]`, `h-[130px]`, inline `border-width:1.5px`). None flip under `.app-dark`.

**Recommended fix (P2):** map SVG fills to `currentColor` / palette tokens; replace raw rgba shadows + arbitrary radii/spacing with `--falcon-radius-*` / `--falcon-spacing-*` / theme shadow tokens. `safe-local` (token-discipline), but verify the pixel-parity port still matches the SoT.

### G3 — No token surface for per-instance theming (P2)

`[CODE]` There is no `sending-credentials*.tokens.css` and no `--falcon-sending-credentials-*` variables. A consumer cannot retheme the dialog (card colors, panel radius, scrim) without editing the component. Every other dual-render Falcon component exposes a `:where()`-scoped token block.

**Recommended fix (P2):** if this is promoted to a reusable cross-app dialog, introduce a `sending-credentials.tokens.css` (gate-12 `:where(falcon-angular-sending-credentials-dialog, …)`) and migrate the inline `styles:` + arbitrary values onto it. Lower priority while it is single-consumer via wizard-finalization.

### G4 — No owner-contact gating for SMS/Both (P2)

`[CODE]` html:50-128 — all 3 method cards render unconditionally even when `ownerPhone()` / `ownerEmail()` are empty. If business requires a phone for SMS or an email for Email/Both, the dialog offers an impossible choice.

**Recommended fix (P2):** add `[disableSms]` / `[disableBoth]` inputs (or derive from empty owner fields) to grey out / hide unreachable methods, with a hint. Coordinate with the upstream wizard/backend rule first.

### G5 — Labels are not i18n-aware (P3, by design but worth a hook)

`[CODE]` Every label is a plain string the parent must pre-translate (ts:104-120). This is the documented contract, but it means the component cannot be dropped in without an i18n-providing parent.

**Recommended fix (P3):** acceptable as-is for a composite; if reused standalone, an optional TranslatePipe-aware mode could reduce caller boilerplate. Document the contract (done in API/USAGE).

### G6 — No async-confirm spinner on Send (P3)

`[CODE]` `[disableSend]` disables the button but shows no spinner; the operator gets no in-dialog "sending…" affordance (the parent's orchestrator toast covers feedback).

**Recommended fix (P3):** add `[sendLoading]` to drive a spinner inside `<falcon-button-tw>` (it supports a loading state). Additive.

## Missing accessibility features

- **A1 (P1):** radiogroup container + roving-tabindex (G1).
- **A2 (P3):** the dialog is `aria-labelledby` the title but the subtitle is not associated via `aria-describedby`. Wire `aria-describedby` to the subtitle `<p>`.
- **A3 (P3):** no `aria-live` announcement when the selected method changes (relies on `aria-checked` only).

## Missing tests

- `[CODE]` A spec **exists**: `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts` (re-confirmed 2026-06-03). NOT read in depth this pass; `[INFERRED]` it covers open/select/send/cancel. GAP: no test asserts the radiogroup a11y (because G1 is unfixed) and no dark-mode/SVG-fill visual test.

## Missing Tailwind / token parity

- No token file → no Studio runtime theming + no per-instance override (G3). The footer buttons ARE token-driven (they are `<falcon-button-tw>`), so only the dialog chrome lacks tokens.

## Performance risks

- `[CODE]` `options` is a `computed()` recomputed only when a method-label input changes — cheap. The open `effect()` runs on every `open()` change — trivial. No real risk. `OnPush` + signals throughout.

## Visual / interaction risks

- `[CODE]` Top-Layer positioning is a documented regression-prone area (ts:56-64) — the inline `dialog.falcon-sc-dialog` reset is load-bearing; stripping it re-introduces the "anchored at top:24px instead of centred" bug. Do NOT remove it.
- The hardcoded SVG fills + light-mode shadows will look wrong in dark mode (G2).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | radiogroup container + roving-tabindex | P1 | HIGH-RISK-QUEUE (a11y semantics) |
| G2 | token-drive SVG fills + rgba/px (dark mode) | P2 | safe-local |
| G4 | gate SMS/Both on owner contact | P2 | safe-local (coordinate w/ backend rule) |
| G3 | introduce a token file | P2 | safe-local |
| G6 | `[sendLoading]` spinner | P3 | safe-local |
| A2 | `aria-describedby` subtitle | P3 | HIGH-RISK-QUEUE (a11y semantics) |

## Fix-shared-vs-per-page

All gaps belong in the shared component (it is a `libs/falcon-ui-core` composite). The radiogroup a11y fix especially must NOT be hacked per-page.

## Workarounds (if upgrade blocked)

- For G1 today: acceptable interim — Space/Enter pick works; keyboard tab order is just non-roving.
- For G4 today: the upstream wizard should not offer the finalization step with an owner lacking required contact info.

## Deep-Dive Sweep Findings (2026-06-03 — B19)

**Consumer count: 1 render site** (`falcon-wizard-finalization.component.html:25`) — but reached by every Add Client / Add User wizard in both consoles.

- **NEW dossier created** (component had no prior dossier under this slug). **Supersedes** `send-credentials-popup` (deleted from source — flagged orphan for B23).
- **No deletion/promotion flag** for this component — it stays ACTIVE/PREFERRED.
- Findings (see `FINDINGS/B19.md`): G1 (a11y radiogroup, `HIGH-RISK-QUEUE`), G2/G3/G4/G6 + the inline-`styles`/raw-rgba/SVG-hex token-discipline items (`safe-local`). No `pi pi-*` PrimeIcons (icons are inline SVG).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) against falcon-sending-credentials-dialog.component.ts (206 ln) + .component.html (195 ln). Supersession of `send-credentials-popup` confirmed (shared-ui/index.ts:25-26). Gaps G1-G6 read from live source. NEW dossier; old `send-credentials-popup` dossier flagged orphan for B23 (not edited this pass).
