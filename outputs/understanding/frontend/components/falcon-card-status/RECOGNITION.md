# falcon-card-status — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-card-status>` as the component to use, and how to compose it to parity.

## Visual fingerprint

`[CODE]` card-status-tailwind-classes.ts + comm-mkt-card — a **rectangular white card with a colored 1px border and rounded corners (14px)**, laid out top-to-bottom:
- a **top row** of three cells: a small leading **icon** (34px column) | a **title** (often 2 lines) | a right-aligned **status badge + price** column;
- a **body** with a description (often clamped to 3 lines) and optional dashed **dates band** / green **pending band**;
- a **bottom-right row of action buttons**, always pinned to the card's bottom edge even when bodies differ in height.

Distinguishing tell vs siblings: the **border color encodes a status** (teal = active, red = expired, neutral = disabled/inactive) AND there is a **guaranteed action footer**. If it is a plain content card with no status tone / no action footer, it is `<falcon-angular-card>`. If it is a status *pill* (not a card), it is `<falcon-angular-status-badge>`.

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Card>` + `<CardContent>` + `<CardActions>` + a status border via `sx` | MUI's `CardActions` ≈ the guaranteed actions slot; the status border tone is bespoke in MUI. |
| PrimeNG | `<p-card>` with header/footer templates + a status class | direct concept; Falcon bakes the status tone + bottom-pinned actions into tokens. |
| Ant Design | `<Card>` with `actions` prop + a `status` ribbon/border | Ant's `actions` array ≈ the actions slot; Falcon projects buttons instead. |
| Bootstrap | `.card` + `.card-body` + `.card-footer` + `.border-{success,danger}` | the Bootstrap status-border utility is the closest analog; replace wholesale. |
| shadcn / Radix | `<Card>` + `<CardFooter>` + a conditional border class | shadcn composes primitives; Falcon is one shell with a `status` prop + slots. |
| plain HTML | `<div class="card">` + a status modifier class | always replace with `<falcon-angular-card-status>`. |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| an entity card whose border tone = status, with a guaranteed action footer | `<falcon-angular-card-status>` | — |
| a plain content card (no status tone, no action footer) | `<falcon-angular-card>` | card-status |
| a status pill / chip (not a card) | `<falcon-angular-status-badge>` | card-status |
| a removable label chip | `<falcon-angular-tag>` | card-status |
| a grid of service / application / channel cards | `<falcon-angular-card-status>` (via the `comm-mkt-view` `<app-comm-mkt-card>` pattern) | hand-rolled `.cm-card` markup |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[status]` (map your domain enum → one of `active`/`expired`/`disabled`/`inactive`), `[size]` (`sm`/`md`/`lg`), `[rootClass]` (extra utilities).
2. **Templates** — none (no `ng-template`); content is slot-projected.
3. **Slots** — project into `slot="media"` (icon), `slot="title"`, `slot="status"` (badge + price), the **default** slot (body: description / dates / pending bands), and `slot="actions"` (your buttons). Add `self-start` to top-row slots if your status column is taller than the title.
4. **Variants** — `status` (border tone) + `size` (padding/gap) are the only variant axes. `status` is the ONLY thing that changes the look beyond size.
5. **Token override** — per-instance host class mutating `--falcon-card-status-*` (radius, padding, per-status border tone, hover shadow), OR the `rootClass` input. Never hardcode hex/px.
6. **Upgrade** — need an auto-rendered status badge / a selected highlight / a root landmark? Those are `GAPS_AND_UPGRADES.md` proposals (G2/G3/G5) — raise them; for "selected" today use `rootClass`.
7. **Wrapper** — the `comm-mkt-view` `<app-comm-mkt-card>` IS the reference caller-wrapper (domain mapping + action catalog + slot composition). Mirror it for a new entity-grid; do not re-roll the chrome.

## Anti-patterns

- Passing a **domain status enum** to `[status]` — it takes only the 4 presentation buckets; map in the caller (comm-mkt-card `cardStatus()`).
- Trying to mount the **Stencil `<falcon-card-status>`** in Angular or hunting for a `useTailwind` input — the Angular path renders its own chrome on purpose (mounting the scoped/`-tw` element re-breaks interactive button projection under zoneless CD).
- Putting **action behaviour** (which buttons, permission, click handlers) into the card — the card is presentation-only; the caller owns every button.
- Re-rolling the SoT `.cm-card` markup per page instead of using this shell.
- Hardcoding hex/px in the consumer's CSS to restyle the chrome — use `--falcon-card-status-*` tokens or `rootClass`.
- Reading the card's border color back as authoritative state — the badge label + backend record are authoritative; the tone is advisory.
- Forgetting `self-start` on top-row slots when the status column is tall — content will center-align (the card's top grid is `items-center`).

## Verification
🟡 CODE-DERIVED 2026-06-03 (B11 — NEW) from `falcon-card-status.tsx` + `card-status-tailwind-classes.ts` + `comm-mkt-card.component.ts`. Visual fingerprint + slot map + the domain→bucket recipe confirmed against the live comm-mkt-card consumer. Cross-library mapping 🟡 `[INFERRED]` standard-library knowledge.
