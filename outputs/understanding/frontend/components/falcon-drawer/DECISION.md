# falcon-drawer — DECISION

## Brain SK final recommendation

### Use this component for
- Right/left side detail panels (Add/Edit node, user inspector, filter panels).
- Off-canvas mobile menus.
- Form-heavy side sheets where the body needs full height.
- Side-anchored wizards / multi-step flows.

> **CAVEAT (2026-06-03):** under the platform's zoneless change detection, the Stencil drawer's projected default-slot body is wiped (G-ZONELESS-SLOT) — both wallet Balance-Transfer features hand-roll a native `<aside role="dialog">` shell instead (WAIVER W11). **Verify G-ZONELESS-SLOT is fixed before using `<falcon-angular-drawer>` for a projected-body form**; otherwise follow the WAIVER pattern (token-bound native shell, Falcon-primitive fields).

### Avoid this component for
- Centered confirmation modals (use `popup` / `confirm-dialog`).
- Passive notifications (use `notification`).
- Tooltips, menu popovers (dedicated components).
- Persistent navigation (a layout sidebar, not a drawer).

### Preferred render path
`useTailwind=true` (default). Light DOM lets the body content classes cascade naturally — and is the same path the consumers would use (the zoneless bug affects both).

### Required upgrades before wider use
**Tier 0 (unblocking):**
1. **Fix the zoneless-CD slot wipe (G-ZONELESS-SLOT)** — without it the primitive is unusable for projected-body forms and stays orphaned.

**Tier 1:**
2. Expose `closeAriaLabel` on the wrapper for i18n (G-A11Y-LABEL).
3. Add `<slot name="header-actions">` (G-HEADER-ACTIONS).
4. Add a `dismissible` alias for consistency with dialog (G-SPELL).

**Tier 2:**
5. `[backdrop]` decoupled from `[modal]` (G-BACKDROP-MODE).
6. Exit transition (G-EXIT-ANIM, opt-in).
7. Consolidate focus-trap logic with `falcon-angular-dialog`.

### Relationship to other components

| Component | Relationship |
|---|---|
| `falcon-angular-dialog` | Sibling — same hand-rolled focus-trap idiom + same `[falconOverlay]` directive (`"modal"`); different layout (centered scale-in). |
| `falcon-angular-button` | Drawer footer canonical pattern. |
| `falcon-angular-popup` | For action-required confirms — drawer is for detail/work, popup is for decisions. |
| `falcon-angular-input` / `-dropdown` / form controls | Body content. |
| `[falconOverlay]` directive + `FalconStackingService` | Shared Top-Layer substrate. |

### Exact rule for future implementation tasks
> Use `<falcon-angular-drawer>` for any side-anchored sliding sheet — **after confirming the zoneless-CD slot wipe (G-ZONELESS-SLOT) is resolved**; if not, hand-roll a token-bound native `<aside role="dialog">` shell with Falcon-primitive fields (the documented WAIVER). Default `position="right"` + `size="md"` (480px). Provide `slot="header"` (title + sub-line) and `slot="footer"` (Cancel + Save) — **supply the footer's own border+padding (no auto-chrome on either path)**. Bind `[(open)]` or `[open]`+`(openChange)`. Use `[closable]="false"` + a Cancel button for destructive-risk forms. Use `[modal]="true"` by default (only `false` for non-blocking inspectors — note it also disables outside-click dismiss). Watch the `dismissable` a-spelling. Never add `z-[…]` — the Top Layer stacks.

### Status
**ACTIVE primitive, but ORPHANED in app code** by the zoneless-CD slot-wipe defect. Production-grade machinery (Top Layer, focus trap, RTL `justify-content` flip) — the slot bug is the single thing keeping it off the page. NOT a deletion candidate (the shape is correct and needed; fix the bug).

---

## Dynamic capability assessment

### 1. What is static today?
- Slide direction determined by `position` (no custom angle).
- Backdrop always blur-based (native `::backdrop`, literal `rgba`).
- Close × SVG hardcoded.
- DOM destroyed on close (no exit animation).
- Footer has no built-in chrome on either path.
- Focus trap non-configurable.

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **10 wrapper `@Input`s** — `open` (signal-mirrored setter) / `position` / `size` / `closable` / `dismissable` / `modal` / `header` / `ariaLabel` / `useTailwind` / `rootClass`.
- `[CODE]` **3 `@Output`s** — `drawerShow` / `drawerHide` / `openChange`.
- `show()`/`hide()`/`closeAriaLabel` Stencil-only (NOT proxied — G-METHOD / G-A11Y-LABEL).

### 3. What is already dynamic through slots / ng-template?
- (default) body; `slot="header"` rich header; `slot="footer"` actions. No `ng-template` inputs.

### 4. What is dynamic through token/theme overrides?
- Per-position width/height per size (8 tokens), per-position radius (4), overlay bg/blur/opacity (neutralised on host), panel bg/color/shadow, header/title/close, body padding, motion, z-index (fallback). Dark mode auto-flips.

### 5. What is dynamic through Tailwind classes?
- Inside header/body/footer slots — full Tailwind. NOT on the drawer host.

### 6. What is missing to make this component reusable across pages?
- **A zoneless-CD-safe projected body (G-ZONELESS-SLOT) — the #1 blocker.**
- i18n on close × (G-A11Y-LABEL). Header-actions slot. `canClose`/`dismissible` alias. Exit transition. Footer chrome parity with dialog `-tw`.

### 7. What capability should be added to the shared component (not a page hack)?
- The zoneless-CD fix; all of item 6.

### 8. What flags / options / templates / slots would make it better?
- `[closeAriaLabel]`, `[tone]`, `<slot name="header-actions">`, `<slot name="body-loading">` (skeleton), a `[backdrop]` mode decoupled from `[modal]`.

### 9. What is the safest upgrade path?
1. **Phase 0:** fix the zoneless-CD slot wipe in the Stencil cores (unblocks everything).
2. **Phase A (additive):** `closeAriaLabel` `@Input`; header-actions slot; `dismissible` alias.
3. **Phase B:** decouple `[backdrop]` from `[modal]`; consolidate focus trap with dialog.
4. **Phase C (gated):** exit transition.

### 10. What is risky to change because other pages depend on it?
- The `(drawerHide)` payload `reason` field — consumers may switch on it.
- The `position="right"` / `closable=true` / `modal=true` defaults — flipping relocates/exposes/unblocks every drawer.
- The DOM-destroy-on-close behavior — flipping to "keep mounted" persists signal state between opens.
- The native `<dialog>` Top-Layer wrapper — reverting to z-index would regress the whole overlay migration.
- The WAIVER itself — "fixing" a hand-rolled balance-transfer shell back to `<falcon-angular-drawer>` would re-introduce the empty-body bug (do NOT).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14). Recommendation: ACTIVE-but-orphaned, NOT a deletion candidate. Counts: 10 wrapper `@Input`s, 3 `@Output`s; `show`/`hide`/`closeAriaLabel` Stencil-only. The zoneless-CD slot wipe (G-ZONELESS-SLOT) is the load-bearing "risky to change / must fix" item; the WAIVER must NOT be reverted until it lands.
