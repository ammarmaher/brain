# falcon-insufficient-balance-dialog — DECISION

## Brain SK final recommendation

**STATUS: READY — the canonical "rank a flat list inside a modal, then commit" component.** Use it for the do-payment channel-priority flow (its built reason) AND for any generic flat-list ranking decision (override the labels). Self-contained 3-artefact build (Shadow + `-tw` + wrapper) + Phase B native-`<dialog>` Top-Layer promotion. Production-grade as-is; the gaps in `GAPS_AND_UPGRADES.md` are improvements, not blockers.

## Use this component for
- A do-payment that finalizes `Failed + CommChannelPriorityOrderRequired` → rank channels → resubmit (its production flow, via the host-shell `do-payment-priority-popup`).
- ANY generic flat-list ranking task (campaign recipient priority, route preference) — override `headingText` / `confirmLabel` / `firstAutoLabel`.

## Avoid this component for
- A binary yes/no decision with no list → `<falcon-angular-popup>` / `<falcon-angular-confirm-dialog>`.
- A centered modal with a bespoke (non-list) body → `<falcon-angular-dialog>`.
- A "send credentials" confirmation → `<falcon-angular-sending-credentials-dialog>`.
- An editable list inline on a page (no modal) → a data-table / order-list component.

## Preferred render path
**`useTailwind=true` (default — `<falcon-insufficient-balance-dialog-tw>`, Light DOM).** Switch to Shadow (`useTailwind=false`) only for style isolation. **CAVEAT:** the `-tw` twin reads raw `var(--color-falcon-*)` palette refs for some visuals (error banner, drag-over border), so per-instance `--falcon-ib-dialog-*` colour overrides may retint the Shadow path only (GAP G-TOK). Either way the wrapper's native `<dialog>` Top-Layer promotion applies.

## Required upgrades before wider use
- **HIGH-RISK-QUEUE:** `aria-describedby` linking the panel to subtitle/body (G-A11Y — a11y semantics).
- **safe-local:** compose `<falcon-angular-button>` for the footer (G-BTN); align `-tw` colour reads to `--falcon-ib-dialog-*` tokens (G-TOK); token-drive the wrapper `::backdrop` (G-BACKDROP); add specs (G-TEST); icon-font glyphs (G1).

## Relationship to other components
- **Sibling dialogs (do NOT compose):** `<falcon-angular-dialog>` (generic modal), `<falcon-alert-dialog>` (acknowledge), `<falcon-angular-popup>` (decide), `<falcon-angular-sending-credentials-dialog>`. This dialog is **self-contained** — it does NOT compose `<falcon-dialog>` (the 3 visual toggles need direct backdrop/icon control). But Phase B DID wrap it in a native `<dialog>` for Top-Layer promotion.
- **Composes (gap):** the footer SHOULD compose `<falcon-angular-button>` but uses raw `<button>` today (G-BTN).
- **App orchestrator:** the host-shell `do-payment-priority-popup` owns the Charging/Commerce/realtime wiring; the library dialog is pure UI.

## Exact rule for future implementation tasks
1. **A modal with a drag-reorderable ranked list + Proceed/Cancel?** Use `<falcon-angular-insufficient-balance-dialog>`.
2. **The do-payment priority flow?** Do NOT wire the dialog directly — reuse / mirror the `do-payment-priority-popup` orchestrator (it owns doPayment + SignalR + GET-fallback + the 3 terminal-reason branches).
3. **Non-payment reuse?** Override `headingText` / `confirmLabel` / `firstAutoLabel` (defaults are payment-flavored).
4. **Bind `[open]` + `(openChange)`/`(falconCancel)`; pass `undefined` (not `null`) to `[errorMessage]`; bind `[items]` as a property.**
5. **Do NOT re-add a `WalletType.MultipleWallets` AND-guard** before opening — removed 2026-06-02; the server reason is authoritative.
6. **Override row geometry via `--falcon-ib-dialog-row-*` tokens** (flows to both paths); colour overrides may need the Shadow path until G-TOK is fixed.

---

## Dynamic capability assessment

### 1. What is static today?
- The render tree (no body slot — items are flat, drag handlers own the rows).
- The inline SVG icons (warning triangle, 6-dot grip, chevrons, info/error circles) — no icon-font glyphs yet (G1).
- The footer being raw `<button>` (G-BTN).
- The `'cancel' | 'backdrop' | 'esc'` cancel-reason set.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **~20 wrapper `@Input`s** — `open`/`items`/`loading`/`busy`/`errorMessage` + 3 visual toggles + 9 label strings + `closeOnBackdrop`/`closeOnEsc`/`allowDragDrop`/`fit`/`useTailwind`/`appendTo`.
- `[CODE]` **3 `@Output`s** — `(falconProceed)` `{orderedIds}`, `(falconCancel)` `{reason}`, `(openChange)` boolean — re-emitted from clean kebab Stencil events on both tags.

### 3. What is already dynamic through slots / ng-template?
- **None** — intentionally slot-free (a body slot was rejected; D-hist below). The body is fully controlled.

### 4. What is dynamic through token/theme overrides?
- ~80 `--falcon-ib-dialog-*` tokens (backdrop/panel/icon/header/list/row/buttons/info/error/footer). Row GEOMETRY flows to both paths; some COLOURS reach the Shadow path only on `-tw` (G-TOK). The wrapper `::backdrop` uses raw literals, bypassing the backdrop tokens (G-BACKDROP).

### 5. What is dynamic through Tailwind classes?
- Host layout via `class=`/`style=`. The `-tw` twin inlines its internal Tailwind classes (no caller-overridable utility surface beyond the tokens + `style`).

### 6. What is missing to make this component reusable across pages?
- `aria-describedby` for full dialog a11y (G-A11Y).
- Footer composing `<falcon-angular-button>` (G-BTN) for kit consistency + loading/disabled parity.
- `-tw` colour reads via `--falcon-ib-dialog-*` tokens (G-TOK) so per-instance recolouring works on the default path.
- A WAI-ARIA keyboard-drag mode (G3) — today the 4 arrow buttons are the keyboard path.

### 7. What capability should be added to the shared component (not a page hack)?
- ALL of item 6 — these belong in the library, not per-page. The dialog is the single ranked-list-modal primitive.

### 8. What flags / options / templates / slots would make it better?
| Addition | Type | Surface |
|---|---|---|
| `aria-describedby` → subtitle/body | a11y | both Stencil tags (G-A11Y) |
| compose `<falcon-button>` in footer | refactor | both Stencil tags (G-BTN) |
| `-tw` reads `--falcon-ib-dialog-*` colour tokens | token parity | `-tw` twin (G-TOK) |
| keyboard-drag (Space-grab / arrows / Enter-drop) | a11y | both Stencil tags (G3) |

### 9. What is the safest upgrade path?
1. **Phase A (a11y/parity, low risk):** `aria-describedby` (G-A11Y), `-tw` colour-token reads (G-TOK), token-drive the wrapper `::backdrop` (G-BACKDROP).
2. **Phase B (refactor):** compose `<falcon-angular-button>` in the footer (G-BTN) — verify the busy/disabled wiring.
3. **Phase C (additive a11y):** keyboard-drag mode (G3); icon-font glyphs (G1) once they ship.
4. **Phase D:** specs (G-TEST).

### 10. What is risky to change because other pages depend on it?
- **The generic `{id,label}[]` → `orderedIds` contract** — the do-payment popup + the wallet-transfer features key off it.
- **`open` get/set + `openSignal` + the native-`<dialog>` `falconOpen` model** — changing the open mechanism risks the Top-Layer sync.
- **The walletType-guard removal** — re-adding it would re-break the do-payment flow for single-wallet `CommChannelPriorityOrderRequired` cases (2026-06-02 fix).
- **`appendTo='body'` portal + `ngOnDestroy` detach** — removing the detach leaks `<body>` hosts on route change.
- **Esc/backdrop suppression while `busy`** — pages rely on it to prevent abandoning a submitting payment.

---

## Historical build decisions (Wave 15, 2026-05-15 — preserved)

- **D1** — strategy-correct 3-artefact rebuild (replaced the wrong-path Wave-14 Angular feature component in `libs/falcon/src/shared-ui/`).
- **D2** — SELF-CONTAINED (does NOT compose `<falcon-dialog>`/`<falcon-alert-dialog>`) so the 3 visual toggles get direct backdrop/icon control (~80% chrome duplication accepted).
- **D3** — generic `{id,label}[]` items; caller owns the API.
- **D4/D5** — 3 reflected visual-toggle props + token-driven row dimensions (user-requested).
- **D6** — new `notifications` showcase category ("Custom Pop-up Notification").
- **D7** — HTML5 native drag-drop (no `@angular/cdk`/`sortablejs`); the 4 arrow buttons cover keyboard.
- **D8** — loader chicken-and-egg: register a new `-tw` tag in `define-falcon-tw-component.ts` only AFTER a bootstrap build emits the dist artefact.
- **Phase B / Wave 4.2 (2026-05-21, post-Wave-15):** wrapped in native `<dialog falconOverlay="modal">` for Top-Layer promotion + retained the `<body>` portal as defence-in-depth.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17). Restructured to the gold DECISION format (recommendation + 10-axis) while preserving the Wave-15 historical decisions. Recommendation: READY. Counts: ~20 `@Input`s, 3 `@Output`s (clean kebab parity). The a11y `aria-describedby` gap (G-A11Y) is HIGH-RISK-QUEUE; G-BTN/G-TOK/G-BACKDROP/G-TEST are safe-local.
