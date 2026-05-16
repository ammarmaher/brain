*** falcon-alert-dialog — GAPS + UPGRADE BACKLOG ***

# Known gaps as of Round 4 (2026-05-15) initial ship

## P2 (queued for future wave)

1. **Animation** — No fade/scale enter/exit animation defined yet. Inherits
   `<falcon-dialog>` default animation, which is instant-show. Add motion tokens:
   `--falcon-alert-dialog-enter-duration`, `--falcon-alert-dialog-exit-duration`,
   `--falcon-alert-dialog-enter-easing`.

2. **Custom icon size** — Only one icon-size token (`--falcon-alert-dialog-icon-size`,
   default `56px`). Severity variants might prefer different sizes (success could
   look better at `48px`). Consider per-severity icon-size tokens.

3. **Loading state on Confirm button** — Some flows need a busy spinner on
   Confirm while async work runs. Add `[confirmLoading]` input.

4. **Tertiary action button** — Some SoT patterns show 3 buttons (e.g. "Save Draft" +
   "Cancel" + "Publish"). Currently only 2. Consider `[showTertiary]` + slot for
   tertiary action.

5. **Auto-focus configuration** — Default focuses Confirm. Some flows want default
   focus on Cancel (destructive ops). Add `[autoFocusButton]: 'confirm' | 'cancel'`.

## P3 (deferred)

6. **RTL story** — Test in RTL locale (Arabic). Icon centering should be unchanged
   but title/subtitle anchoring should follow `text-align: center` regardless. Likely
   already correct via the existing `<falcon-dialog>` RTL support, but unverified.

7. **Showcase page** — Add a demo page under `apps/demo/{angular,react,vue}/components/falcon-alert-dialog`
   showing all 4 severities + single-CTA variants.

8. **Storybook-style docs** — Auto-generate API docs into the showcase via the existing
   `libs/falcon-ui-showcase-data` registry + a new `falcon-alert-dialog.md` page.

9. **Eval coverage** — Add unit tests for severity → icon mapping + cancel-reason
   propagation + open-change events.

10. **Round-4 chrome-MCP verify** — Component shipped without live runtime test
    because the dev-serve was running stale code (Round 3 staged changes not picked
    up). Once dev-serve restarts, verify SoT vs Dest matches at all 4 severities.

## Consumer migration backlog

11. **Existing IB modal** — Round 3's `InsufficientBalanceModalComponent` rewired
    in Round 4 to use `<falcon-angular-alert-dialog>`. Test that drag-and-drop
    reordering still works inside the slot-projected priority list.

12. **Other dialog consumers** — Audit other modals across the platform that match
    this SoT centered-icon-title-subtitle-body-2button pattern. Likely candidates:
    delete confirmations, session expiry, unsaved changes, etc. Migrate them in
    a follow-up wave.
