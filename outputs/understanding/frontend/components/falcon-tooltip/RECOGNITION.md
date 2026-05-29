# falcon-tooltip — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-tooltip>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-tooltip.tsx:164-198` — a **small dark floating panel** that appears next to a trigger element on hover or focus. The panel is compact (default `max-width` 240px, font ~11.5px), has a small corner radius (~6px), a soft shadow, and a **tiny arrow** (`falcon-tooltip-arrow`) pointing back at the trigger. By default it is dark-on-light (`[CODE]` `tooltip.tokens.css` — `panel-bg: neutral-900`, white text). It floats with an 8px gap from the trigger and is positioned by JS at one of **12 placements** (`top`/`right`/`bottom`/`left` × default/`-start`/`-end`).

Distinguishing it from siblings: it is **trigger-anchored and transient** (appears only on hover/focus, vanishes on leave), it is **tiny** (a sentence or two, not a form), it has **no buttons** and **no header**, and it has a **directional arrow** pointing at its trigger.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Tooltip>` | direct 1:1 — MUI `<Tooltip placement>` ≈ `falcon-tooltip placement` |
| PrimeNG | `[pTooltip]` directive | direct — `falcon-tooltip` replaced the `[pTooltip]` directive (Wave PR-8) |
| Ant Design | `<Tooltip>` | direct 1:1 |
| Bootstrap | `data-bs-toggle="tooltip"` / `.tooltip` | direct — upgrade target |
| shadcn / Radix | `<Tooltip>` (Radix Tooltip) | direct 1:1 — same hover/focus + arrow model |
| plain HTML | the native `title=""` attribute | replace with this — `title` is visually unstyled and uncontrollable |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a small hint appearing on hover/focus with an arrow | `<falcon-angular-tooltip>` | popover/menu |
| a list of clickable actions appearing on click | `<falcon-angular-menu>` | tooltip |
| a hint that contains ONE link the user can click | `<falcon-angular-tooltip interactive="true">` | menu |
| a rich panel with substantial interactive content | a custom popup (or `<falcon-angular-popup>`) | tooltip |
| a passive success/error message that lingers | `<falcon-angular-notification>` / `<falcon-angular-toast>` | tooltip |
| an "Are you sure?" decision | `<falcon-angular-confirm-dialog>` / `<falcon-angular-popup>` | tooltip |
| an icon-only button that needs a sighted-user label | `<falcon-angular-tooltip>` wrapping the button (+ `ariaLabel` on the button) | tooltip alone as the only label |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[content]` (plain text), `[placement]` (`top` default — one of the 12), `[delay]` (show delay ms), `[interactive]` (set `true` if the panel has a link), `[maxWidth]` (e.g. `'320px'` for long text), `[disabled]` (mute).
2. **Trigger** — project the trigger element as the **default slot child** — any HTML or Falcon component. The tooltip wraps it; the wrapper span becomes keyboard-focusable automatically.
3. **Rich content** — for multi-line / formatted content, project `slot="content"` instead of using `[content]`. Keep plain text in `[content]`.
4. **Token override** — restyle the panel via `tooltip.tokens.css` vars (`--falcon-tooltip-panel-bg`, `-color`, `-offset`, `-panel-max-width`, arrow size/color). Apply via `rootClass`.
5. **Pair with the control's own label** — when wrapping an icon-only `<falcon-angular-button>`, ALWAYS also set `ariaLabel` on the button (tooltip is sighted-only).
6. **Upgrade, don't hand-roll** — collision-aware flip placement, `hideDelay`, `focusableTrigger` opt-out, `maxHeight`, show/hide animation are all known gaps (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md`) — raise them as shared upgrades rather than building a one-off positioner.

## Anti-patterns
- `[BRAIN-OUT]` `USAGE.md:89` Putting a link/button inside the tooltip without `interactive="true"` — it becomes unreachable (the panel hides before the pointer arrives).
- `[BRAIN-OUT]` `DECISION.md` Using the tooltip as the **only** label for a control — it is sighted-only and hover-gated; screen-reader and touch users get nothing.
- `[BRAIN-OUT]` `USAGE.md:88` Wrapping an element that already has `tabIndex` — produces a doubled focus stop (the wrapper span adds its own `tabIndex=0`).
- `[BRAIN-OUT]` `USAGE.md:91` `maxWidth="100%"` — fills the viewport; always use an explicit `px`/`rem` value.
- `[CODE]` Choosing `placement="right"`/`"left"` near a viewport edge — no collision detection; the panel overflows off-screen.
- Using the native `title=""` attribute in app code — banned; it is unstyled and uncontrollable.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-tooltip.tsx` render structure + `tooltip.tokens.css` references + `[BRAIN-OUT]` existing dossiers. Cross-library mapping is `[INFERRED]` from each library's documented API.
