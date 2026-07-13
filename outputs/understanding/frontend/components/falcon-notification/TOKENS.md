# falcon-notification — TOKENS

## Component token file

**None.** `[CODE]` Like popup, notification has NO dedicated token CSS file in `libs/falcon-ui-tokens/src/components/`. Visual values come from:
1. **Falcon palette tokens** accessed through Tailwind utilities in the inline template (`[CODE]` falcon-notification.component.ts:35-64, 70-169).
2. **Inline `[style.*]` escape hatches** for the tunable geometry (`[CODE]` lines 77-81): `[style.border-style]="'solid'"`, `[style.border-width.px]`, `[style.border-left-width.px]`, `[style.border-right-width.px]`, `[style.border-radius.px]`.
3. **Inline `styles:` keyframes** (`[CODE]` lines 171-195): `falconNotifIn` (slide-in) + `falconNotifCountdown` (scaleX 1→0).
4. **`FalconConfigurationService.notification.*`** (from `falcon-defaults.json`) supplies the DEFAULTS for every appearance input (the `resolved*` computeds).

## Palette tokens used (per intent)

| Intent | Border | Icon chip (iconBg=true) | Icon stroke (iconBg=false) | Countdown bar |
|---|---|---|---|---|
| success | `border-falcon-green-500` | `from-falcon-green-100 to-falcon-green-200 text-falcon-green-700 ring-falcon-green-200` | `text-falcon-green-700` | `bg-falcon-green-500` |
| info | `border-falcon-teal-500` | `from-falcon-teal-100 to-falcon-teal-200 text-falcon-teal-700 ring-falcon-teal-200` | `text-falcon-teal-700` | `bg-falcon-teal-500` |
| warning | `border-falcon-amber-500` | `from-falcon-amber-100 to-falcon-amber-200 text-falcon-amber-700 ring-falcon-amber-200` | `text-falcon-amber-700` | `bg-falcon-amber-500` |
| error | `border-falcon-red-500` | `from-falcon-red-100 to-falcon-red-200 text-falcon-red-700 ring-falcon-red-200` | `text-falcon-red-700` | `bg-falcon-red-500` |

| Concern | Source |
|---|---|
| Surface (glossy) | `bg-gradient-to-b from-falcon-neutral-0/85 to-falcon-neutral-0/75 backdrop-blur-xl backdrop-saturate-150` |
| Surface (flat) | `bg-falcon-neutral-0` |
| Title | `text-sm font-semibold text-falcon-neutral-900 leading-snug` |
| Subtitle | `text-xs text-falcon-neutral-600 leading-relaxed` |
| Dismiss × | `text-falcon-neutral-500 hover:bg-falcon-neutral-100 hover:text-falcon-neutral-900` |
| Tint overlay (glossy) | per-intent `from-falcon-{family}-200/40` |
| Slide-in | `falconNotifIn 280ms cubic-bezier(0.22, 1, 0.36, 1) both` |
| Countdown | `falconNotifCountdown linear forwards` (duration from `resolvedDismissDuration()`) |

## Stack container positioning tokens (the ONE real CSS token in play)

`[CODE]` The superseded stack's container reads `--falcon-toast-host-z-index` indirectly via the hardcoded `z-[100001]` (`[CODE]` falcon-notification-stack.component.ts:52-57, `falconNotificationStackContainerClasses`). `[MEMORY]` the toast tier is `100001` (STRICTLY above drawer/popup-dialog 99999 + body-portaled popovers 100000). Position helper maps: `top`→`top-[4.75rem]` (clears the topbar), `bottom`→`bottom-6`, `right`→`right-6`, `left`→`left-6`. The toast-adapter reuses the SAME helper (`[CODE]` falcon-toast-adapter.component.ts:129-131). The Top-Layer `@layer falcon-overlay { :host [popover] {…} }` block clears UA popover defaults without `!important` (`[CODE]` falcon-notification-stack.component.ts:126-149).

## Related Falcon theme tokens

| Family | Used for |
|---|---|
| `falcon-green-{100,200,500,700}` | Success surface + border + chip + icon + bar |
| `falcon-teal-{100,200,500,700}` | Info intent |
| `falcon-amber-{100,200,500,700}` | Warning intent |
| `falcon-red-{100,200,500,700}` | Error intent |
| `falcon-neutral-{0,100,500,600,900}` | Surface, text, dismiss button |

## Tailwind utility guidance

The component is Tailwind-direct (no helper-class indirection, no `-tw` twin). For platform-wide changes, override the palette in the global theme OR set `falcon-defaults.json.notification.*` defaults.

## Dark mode support

`[INFERRED]` Neutrals invert via the global dark map; intent palette families (green/red/amber/teal) keep or have dark variants. The `backdrop-blur` glossy surface relies on translucency over the page — verify against dark canvases. NOT verified end-to-end this pass.

## Density support

None — fixed `max-w-sm`, `px-3 py-2`, icon chip `h-8 w-8`.

## RTL support

`[CODE]` The stack container uses **physical** `right-6` / `left-6` (chosen by `position`), not logical insets (`[CODE]` falcon-notification-stack.component.ts:42-44). The card's left-accent border (`leftAccent`) is physically LEFT (`[style.border-left-width.px]`) — under RTL it does NOT mirror to the trailing edge. NOT verified end-to-end; potential RTL gap on the accent bar.

## Static style risks

- `[CODE]` **Inline `[style.*]` geometry** (border-style/width/left/right/radius) — intentional escape hatches for highly-tunable per-instance appearance, but they bypass any future tokenisation (`[CODE]` falcon-notification.component.ts:77-81). The values come from `resolved*` computeds (config-backed), so not raw literals, but the binding is inline-style not token.
- `[CODE]` No raw hex in the template — all colors are `falcon-*` palette utilities. Clean on the no-hex rule.
- `[CODE]` The inline `styles:` block holds keyframes only (no color/geometry literals).

## No CSS / no SCSS guidance

- No external `.css`/`.scss` file; the `styles:` decorator entry holds the two keyframes.
- Per-instance customization is via the 16 inputs only.

## Future-token recommendation (GAP)

`[CODE]` Introduce `libs/falcon-ui-tokens/src/components/notification.tokens.css` (`:where(falcon-angular-notification, …)`, gate-12 scoped) with per-intent + per-instance tokens, and refactor the inline `[style.*]` + Tailwind utilities to consume them (`bg-[var(--falcon-notification-surface-bg)]`). This would bring the card in line with the toast/tooltip token contract and enable per-instance overrides without inputs.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) — confirmed NO token file; appearance is palette-Tailwind + inline `[style.*]` + config defaults + 2 keyframes. ADDED the stack/adapter `z-[100001]` + Top-Layer `@layer falcon-overlay` positioning detail. Dark/RTL (accent-bar) deferred to theme agent.
