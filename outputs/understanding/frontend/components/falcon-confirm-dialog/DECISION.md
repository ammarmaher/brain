# falcon-confirm-dialog — DECISION

## Brain SK final recommendation

**STATUS: DORMANT / SUPERSEDED — DO NOT USE; delete-or-revive decision pending.** `[CODE]` The Angular wrapper is commented out (falcon-confirm-dialog.component.ts:1-79), `index.ts` exports `export {}`, and there are zero render consumers. For any confirm need, use **`FalconConfirmService.confirm()`** (renders `<falcon-angular-popup variant="error">`) or **`<falcon-angular-alert-dialog>`** for icon-led acknowledgements.

## Use this component for

**Nothing new.** It is dormant. (As-designed it was for small "are you sure?" prompts with custom verbs that don't fit a `<falcon-popup>` variant — that need is now met by `FalconConfirmService`.)

## Avoid this component for

- **Everything** — it does not render. Specifically:
  - Imperative confirms → `FalconConfirmService.confirm()`.
  - The 4 canonical flows → `<falcon-angular-popup>`.
  - Icon-led / subtitle "are you sure?" → `<falcon-angular-alert-dialog>`.
  - Forms / custom modal bodies → `<falcon-angular-dialog>`.

## Preferred variant / render path

N/A (dormant). If revived, `useTailwind=true` (Light DOM) would be the default — but note the `-tw` accept-button token mismatch (GAP G5) would need fixing first.

## Required upgrades before any use

**An owning delete-or-revive decision (GAP G1).** Until then the component must not be adopted. If revived: G3 (compose `<falcon-angular-button>`), G4 (`<falcon-angular-icon>`), G5 (fix Shadow↔`-tw` accept-button token parity), G7 (`aria-describedby`), plus a `.spec.ts` (none exists).

## Relationship to other components

| Component | Relationship |
|---|---|
| `<falcon-dialog>` / `<falcon-dialog-tw>` | **Composed internally** as the chrome substrate (`[CODE]` tsx:100, tw.tsx:69). |
| `<falcon-angular-popup>` | The LIVE renderer `FalconConfirmService` uses for `action-required` — the de-facto replacement. |
| `<falcon-angular-alert-dialog>` | The LIVE rich-confirm substrate (icon + title + subtitle + 2 buttons). |
| `FalconConfirmService` + `<falcon-angular-confirm-dialog-host>` | The imperative confirm path that bypasses this component entirely. |

## Exact rule for future implementation tasks

> **Do NOT use `<falcon-angular-confirm-dialog>`.** It is dormant (wrapper commented out, `export {}`, zero consumers). For a confirm prompt inject `FalconConfirmService` and call `.confirm({ title, body, confirmLabel?, cancelLabel?, hideCancel? }).subscribe(accepted => …)`. For an icon-led acknowledgement modal use `<falcon-angular-alert-dialog>`. If a task explicitly asks to use or revive this component, treat it as GAP G1 (delete-or-revive) and surface the decision — do not silently uncomment the wrapper.

---

## Dynamic capability assessment

### 1. What is static today?

- **Everything** — the component never renders (wrapper commented out). The Stencil tags' rendered DOM (when forced) is a fixed 2-button footer (Reject first, Accept second), a centered icon `<i>`, a one-line message, raw `<button>`s.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` On the Stencil tags (live but unused): `open` / `heading` / `message` / `icon` / `acceptLabel` / `rejectLabel` / `severity` / `size` / `position` / `closable` / `closeOnBackdrop` / `closeOnEsc`; events `falcon-confirm-accept` / `falcon-confirm-reject` / `falcon-confirm-open-change`.
- On the Angular wrapper (DORMANT — commented): `open` / `title` / `message` / `icon` / `acceptLabel` / `rejectLabel` / `severity` / `size` / `position` / `closable` / `closeOnBackdrop` / `closeOnEsc` / `useTailwind` / `rootClass`; outputs `accept` / `reject` / `openChange`. **None are reachable** (class not exported).

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` One default `<slot>` in the body (tsx:119, tw.tsx:85). The footer is locked. No `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?

- `[CODE]` 15 `--falcon-confirm-dialog-*` tokens (body / icon / message / actions / buttons) — but the `-tw` accept button reads `--falcon-teal-700`, NOT `--falcon-confirm-dialog-accept-bg` (G5 parity break). Chrome tokens inherited from `dialog.tokens.css`.

### 5. What is dynamic through Tailwind classes?

- `[CODE]` The `-tw` twin inlines its utilities; the dead `confirm-dialog-tailwind-classes.ts` helpers are unused. Consumers cannot pass arbitrary wrapper classes (no `wrapperClass`-style input; `rootClass` only forwards to the dialog).

### 6. What is missing to make this component reusable across pages?

- A live (uncommented) wrapper, an owning niche distinct from popup/alert-dialog, `loading`/`disabled` button states, `<falcon-angular-button>` composition, `<falcon-angular-icon>`, `aria-describedby`, Shadow↔`-tw` parity, and a spec. In short: it needs a revive decision (G1) before any reuse.

### 7. What capability should be added to shared component (not page hack)?

- Nothing should be added until G1 is decided. If revived, items in §6 go into the shared component, not per-page.

### 8. What flags / options / templates / slots would make it better?

- `[loading]` / `[acceptDisabled]` / `[rejectDisabled]`, a tertiary-button slot, `[autoFocusButton]`, an `[iconName]` (falcon-icon) input — all moot while dormant.

### 9. What is the safest upgrade path?

1. **Decide G1 (delete-or-revive).** Safest is likely DELETE (zero consumers, live replacement exists) — but that touches the umbrella registration + token build → HIGH-RISK-QUEUE, human sign-off.
2. If revived: uncomment wrapper → fix G5 token parity → compose `<falcon-angular-button>` (G3) + `<falcon-angular-icon>` (G4) → add `aria-describedby` (G7) → add spec. All additive once the wrapper is live.

### 10. What is risky to change because other pages depend on it?

- **Nothing depends on it** — risk of changing the component is low. The risk in DELETING is the umbrella loader registration (`define-custom-elements.ts`, `stub-seeder.cjs`) + the `confirm-dialog.tokens.css` `:where()` block that also lists `falcon-dialog` tags (removing it must not strip dialog-token coverage). Those make G1 a queued, sign-off item rather than a safe-local fix.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). Recommendation flipped from the prior "READY but UNDER-LEVERAGED" to **DORMANT/SUPERSEDED** — the wrapper is commented out and the live confirm path is `FalconConfirmService`→popup. Delete-or-revive (G1) raised as the single gating decision; counts corrected (0 consumers; wrapper not exported).
