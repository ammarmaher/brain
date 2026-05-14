# Wave 13a — Insufficient Balance Modal (BIZ-011)

**Date:** 2026-05-15
**Agent:** Ammar Web-Platform-UI
**Scope:** New `<app-insufficient-balance-modal>` mounted inside `<app-applications-table>`. Triggers from the "Do Payment" row action instead of the previous optimistic status flip.

---

## 1. Result summary
- **Build status:** GREEN (`nx build admin-console --skip-nx-cache` → 0 errors, hash `cca20e4a681c28da`, 18.1s)
- **New code total:** ~190 lines (TS ~108 + HTML ~80 + barrel ~3) — within ≤200 cap
- **Tailwind tokens only:** yes (palette: `falcon-neutral-*`, `falcon-red-*`, `falcon-teal-*`)
- **PrimeNG / SCSS:** none added
- **GAP-BIZ-001 status:** RESOLVED (deferred placeholder replaced with real modal)

## 2. Files changed
| File | Type | Notes |
|---|---|---|
| `apps/admin-console/.../tab-components/insufficient-balance-modal/insufficient-balance-modal.component.ts` | NEW | 108 lines |
| `apps/admin-console/.../tab-components/insufficient-balance-modal/insufficient-balance-modal.component.html` | NEW | 80 lines |
| `apps/admin-console/.../tab-components/insufficient-balance-modal/index.ts` | NEW | barrel |
| `apps/admin-console/.../tab-components/applications-table/applications-table.component.ts` | MOD | imports + state signals + handlers + dispatcher rewrite |
| `apps/admin-console/.../tab-components/applications-table/applications-table.component.html` | MOD | mounted `<app-insufficient-balance-modal>` |
| `libs/falcon/src/language/i18n/en.json` | MOD | +1 `ibModal` block under `hierarchy.applications` |
| `libs/falcon/src/language/i18n/ar.json` | MOD | mirror keys (AR parity) |

## 3. Falcon components used
| Component | Selector | Usage |
|---|---|---|
| Dialog | `<falcon-angular-dialog>` | shell with `severity=warning`, slots `default` (body) + `footer` |
| Button | `<falcon-angular-button>` | Cancel (`variant=secondary`) + Proceed (`variant=primary`) |
| Native `<button>` | — | up/down arrow buttons with chevron SVG + `aria-label` |

## 4. Behavior delivered
- Row action `doPayment` no longer flips status optimistically; it sets `ibModalRow` + opens the modal.
- Modal body shows:
  - Current balance card: hardcoded **1,200 SAR** (mock per spec)
  - Required amount card: bound to `row.priceValue ?? 0` (red-tinted)
  - Re-orderable channel list: WhatsApp / Voice / AI-ChatGPT with rank pill + up/down arrows
  - Info hint: "The first channel will be used automatically."
- Order persists across sessions via `localStorage` key `falcon.ib.channelOrder.v1`.
- Proceed → flip target row status to `active` + emit reordered list + close.
- Cancel / backdrop / Esc → close without changes.
- AR parity: title / subtitle / labels / channel names / button labels all translated.

## 5. Implementation choices
- **No drag-and-drop library** — used up/down arrow buttons only (simpler, less code, accessible by keyboard, RTL-safe). React source actually has BOTH drag-and-drop + arrows; we ship arrows only.
- **localStorage persistence** — wrapped in try/catch with SSR-safe `typeof localStorage` guard.
- **Default channel order recovery** — if saved IDs don't fully match defaults, missing channels appended to preserve UX.
- **Two output events** (`proceed` / `cancel`) instead of one — keeps the dispatcher clean in `applications-table`.
- **Severity `warning`** on dialog — yields the orange severity strip that mirrors the React `#E63946` warning triangle without us hand-rendering the icon.

## 6. i18n keys added (en + ar)
Under `hierarchy.applications.ibModal`:
`title`, `subtitle`, `currentBalance`, `required`, `currency`, `dragLabel`, `firstAuto`, `cancel`, `proceed`, `moveUp`, `moveDown`, `channels.{whatsapp, voice, aiChatgpt}`

## 7. Acceptance criteria
- [x] "Do Payment" opens modal instead of immediate status flip
- [x] Modal shows current balance + required amount + re-orderable channel list (WhatsApp / Voice / AI-ChatGPT)
- [x] Cancel + Proceed buttons present
- [x] Proceed emits + flips target row status to `active`
- [x] Cancel closes without changes
- [x] Uses `<falcon-angular-dialog>` + `<falcon-angular-button>` (no DnD library)
- [x] Tailwind palette tokens only
- [x] ≤200 lines new code
- [x] Build green
- [x] en + ar parity

## 8. Files NOT touched
- Mock applications service (`services/mock-applications.ts`)
- Consumer tabs (`apps-services-tab`, `comm-channels-tab`)
- Anything outside the targets listed in the task brief

## 9. Open items / future improvements
- Real backend balance lookup (currently hardcoded 1,200 SAR)
- Optional drag-and-drop in addition to arrows (React source has both)
- Hook channel-priority result into actual payment dispatch (out of frontend scope)

## 10. No commits, no pushes
Per standing rules. Working tree dirty with 4 modified + 3 new files.
