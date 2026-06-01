# Wave 0 Baseline — Sending-Credentials Dialog Bleed-Through

**Agent:** A2 / Ammar QA-Web
**Date:** 2026-05-21
**Run window:** 19:38:18 – 19:47:30 (clean baseline, pre-Wave-1)
**Wave 1 interference began:** 19:48:43 (first failing compile from parallel session)
**Browser:** Chrome via Claude-in-Chrome MCP — deviceId `d35ab80b-6e0a-4c9e-bf80-4134008c8e29`
**Tab:** 642011430 — `http://localhost:4200/#/admin-console/org-hierarchy-page`
**Viewport:** 2560 × 1249 (devicePixelRatio 1.5; window rendered at 1456 × 832 for capture)
**User:** `sysadmin` / `Admin@1234` (Falcon admin-console)

## Verdict for Wave 1 runtime-verification readiness

**YELLOW — Wave 1 can be runtime-verified against this baseline, but with caveats**

- The single most-important piece of evidence (the bleed-through screenshot of the open Sending-Credentials dialog) was captured cleanly **before** Wave 1 began editing the same source files.
- Comprehensive DOM/CSS analysis (saved to `dom-analysis.json`) pinpoints the root cause and the existing-but-unused proper top-layer container, so Wave 1 can target the right fix.
- Two of the four behavior-baseline checks (focus state, focus trap) were captured cleanly.
- ESC, backdrop click, and Completion-Success behavior **could not be cleanly baselined** because the parallel Wave 1 session began modifying both `falcon-sending-credentials-dialog.component.ts` and `falcon-completion-success-dialog.component.html` mid-run, repeatedly failing to compile and injecting a webpack-dev-server error overlay over the browser. Wave 1 will need to capture those itself after its code lands.

## Brain-prefixed source citations

- [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-sending-credentials-dialog\falcon-sending-credentials-dialog.component.ts`
- [CODE] `Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-completion-success-dialog\falcon-completion-success-dialog.component.html`
- [MEMORY] `project_docker_health_login_verify_2026_05_21` — 17/17 containers Up; sysadmin login verified

## Evidence captured (inline Chrome MCP screenshots — referenced by tool-result ID)

The Claude-in-Chrome MCP `save_to_disk` flag did not persist PNG files to a discoverable filesystem path on this Windows host. The canonical visual evidence is preserved inline in the parent agent's conversation transcript as `<output_image>` blocks. Each is referenced below by its tool-result ID — the parent agent can scroll the transcript to find the matching image.

| # | Tool ID | Captured at | Subject |
|---|---|---|---|
| 1 | `ss_2289tayyk` | 19:38:43 | Post-login Admin Console dashboard with sysadmin's nav (proves auth + portal load) |
| 2 | `ss_6390ppbuu` | 19:39:42 | Org Hierarchy page with BMW child showing Falcon root + client tree |
| 3 | `ss_3186ijtua` | 19:39:54 | Falcon root selected → "Add Client" button revealed |
| 4 | `ss_972326zfy` | 19:40:18 | Wizard Step 1/5 Client Information form (empty) |
| 5 | `ss_4209yh8lw` | 19:40:39 | Wizard Step 1/5 filled — Account Name=TestZIndex01, Finance ID=FIN-Z01-2026 |
| 6 | `ss_4590eqpvw` | 19:41:11 | Wizard Step 2/5 Settings — Allowed IPs + Password Security + Account Limits |
| 7 | `ss_3804dqmrm` | 19:41:35 | Wizard Step 3/5 CommChannels — WhatsApp/Voice/AI rows, all toggles off |
| 8 | `ss_2330qo7u1` | 19:41:54 | Step 3 WhatsApp toggled ON — Price Type + Price Value now required (red border) |
| 9 | `ss_5140ffbcp` | 19:42:09 | Price Type dropdown open showing Monthly / Yearly / One Time Payment |
| 10 | `ss_1032lkbkz` | 19:42:21 | Price Type = One Time Payment selected, Price Value still required |
| 11 | `ss_8023ol5jb` | 19:42:42 | Wizard Step 4/5 Applications — Basic Send / Survey / Campaign Engines |
| 12 | `ss_8045x7awd` | 19:43:04 | Wizard Step 5/5 Account Owner form (empty + Save button enabled top right) |
| 13 | `ss_5523b0kbp` | 19:43:32 | **STEP 5 FILLED — baseline matches the canonical "01-step5-before-save" screenshot the task asked for** |
| 14 | `ss_14946fovh` | 19:43:34 | Duplicate of #13 — saved-to-disk attempt (file did not persist) |
| 15 | **`ss_19199287p`** | 19:43:42 | **THE BUG — Sending Credentials dialog OPEN, bleed-through visible. Canonical "02-dialog-open-bleed-through" evidence** |
| 16 | `ss_0551cdxyt` | 19:48:43 | Dev-overlay capture proving Wave 1 introduced `HostListener` reference without import (line 161) |
| 17 | `ss_2921wrb5u` | 19:48:51 | Dev-overlay dismissed; back at Step 5 with dialog already closed |
| 18 | `ss_56521nk6o` | 19:49:23 | Second Wave 1 dev-overlay surfacing `falcon-completion-success-dialog.component.html` NG5002 closing-tag errors (lines 70:3 + 71:1) |

The single most-important capture is **screenshot #15 (`ss_19199287p`)** — the open Sending-Credentials dialog clearly showing the stepper rail and Step 5 form bleeding through the dialog's translucent backdrop.

## What screenshot `ss_19199287p` shows

- The Sending Credentials modal `<section role="dialog" aria-modal="true">` is centered in the viewport (white panel, "Sending Credentials" header, "Delivery method:" radio cards, "Account owner / Phone Number / Email" summary, "Cancel" + "Send Credentials" footer).
- BEHIND the dialog backdrop, all of the following content is clearly visible (washed but legible):
  - The **wizard stepper rail at the top** with all five steps (Client Information → Settings → CommChannels → Applications → Account Owner) and their connecting line plus active dot
  - The **Step 5 form** — labels (First Name, Last Name, User Name, Password, National ID/Iqama, Phone Number, Email Address, Role) AND filled values (TestZ, Owner, testzowner01, 43TMZ=YDBKKq, +966 595604099, testz.owner01@t2.sa, Account Owner)
  - The **left tree** (BMW, Mitsubishi, Honda, Mercedes, Toyota, asdasdasd, asdasdas, ss)
  - The **left nav** (Dashboard, Contact Groups, Templates, Organization Hierarchy, …)
  - The **top header bar** (Sys Admin user chip, notifications icon, theme toggle)

That underlying content is visible because the backdrop is a translucent `bg-falcon-neutral-900/45` (~45% dark teal) with only `backdrop-blur-[2px]` — too thin a tint and too weak a blur. With a properly-defined z-index this is still a deliberately translucent backdrop; the bug is that **the backdrop's stacking context is broken**, so even content that should be hidden by translucency (page chrome from a different layer) ends up at the same painting depth.

## Root cause (DOM-evidence-backed)

The dialog backdrop element:

```
<div role="presentation"
     class="fixed inset-0 grid place-items-center p-6 bg-falcon-neutral-900/45
            backdrop-blur-[2px] falcon-sc-backdrop-in
            z-[var(--falcon-dialog-z-index)]">
```

The Tailwind arbitrary value `z-[var(--falcon-dialog-z-index)]` compiles to a single utility rule:

```css
.z-\[var\(--falcon-dialog-z-index\)\] { z-index: var(--falcon-dialog-z-index); }
```

But `--falcon-dialog-z-index` is **NOT defined anywhere** in the cascade — not on `:root`, not on the dialog component, not in any inherited token sheet. The `var(...)` reference therefore resolves to its fallback (none specified → initial → `auto`).

Verified via `getComputedStyle(backdrop).zIndex` → **`"auto"`**.

Cascading consequence: `position: fixed` + `z-index: auto` places the backdrop in the parent's *local* stacking context at the document-order position where it was inserted. Since the dialog is nested INSIDE:

```
falcon-angular-sending-credentials-dialog (static, 0x0)
  └─ falcon-angular-wizard-finalization (static, 0x0)
       └─ app-org-hierarchy-page-menu (static)
            └─ page main → app-layout → app-root → body
```

the backdrop is constrained to that subtree's stacking context. Anything ELSE in the page subtree that creates a stacking context — or, more simply, anything painted in a later document position — competes for layering.

A **proper top-layer container is present in the DOM but unused** by this dialog:

```
.falcon-overlay-container { position: fixed; z-index: 100000; … }
```

Wave 1's fix is therefore one of two clean options:

1. **Add the missing CSS custom property.** Define `--falcon-dialog-z-index: 100001` (or whatever value sits above `.falcon-overlay-container`'s 100000) at `:root` in the design-token sheet. This is the minimal-risk fix — no template/host changes.
2. **Migrate to a portal/top-layer.** Render the dialog through `.falcon-overlay-container`, Angular CDK overlay, or HTML `<dialog>` + `showModal()` (which uses the native top layer and is immune to ancestor stacking contexts). This is the more architectural fix and aligns with the "top-layer-migration" investigation directory name.

## Behavior baselines

### Focus on open — **FAIL (a11y)**

After the Sending Credentials dialog opens:

- `document.activeElement` = `<button>Save</button>` — the page-level Save button that triggered the dialog
- `activeElement_inDialog` = **false** — focus did NOT enter the dialog
- Initial focus should land on the dialog's first interactive control (the "Send via Email" radio).

### Focus trap — **FAIL (a11y)**

- Tabbable controls inside the open dialog: 6
- Tabbable controls OUTSIDE the dialog still reachable via Tab: **33**
- A user pressing Tab while the dialog is open will tab into the wizard's Step 5 form, the left tree, the top header, the left nav, etc. — all of which should be inert while a modal is open.

### ARIA — **PASS**

- Dialog has `role="dialog"` ✓
- Dialog has `aria-modal="true"` ✓
- Backdrop has `role="presentation"` ✓
- (These good semantics are contradicted by the focus-management gaps above — assistive tech will announce a modal but the user can still tab outside it.)

### ESC keypress — **NOT BASELINED CLEANLY**

ESC was pressed at 19:43, and the dialog appeared to close — but the same window also surfaced the webpack-dev-server compile-error overlay (the parallel Wave 1 session's failing build). The dialog dismiss may have been a side effect of overlay interaction rather than a real ESC handler.

The strongest piece of indirect evidence that ESC was **NOT** handled in the pre-Wave-1 baseline is Wave 1's failing compile itself: it adds `@HostListener('document:keydown.escape')` on the very component we're testing. You only add a handler that wasn't there before.

**Conservative baseline assumption: ESC did NOT close the dialog. Wave 1 verification should confirm post-fix that ESC closes (and that focus returns to the Save button that triggered the modal).**

### Backdrop click — **NOT BASELINED**

Was not safely testable in the clean baseline window. Wave 1 verification should cover.

### Completion Success dialog — **NOT BASELINED**

Could not be reached. When I attempted to re-trigger via Add User (to reach the second dialog without re-running the full 5-step wizard), the page surfaced a Wave 1 compile-error overlay for `falcon-completion-success-dialog.component.html` (NG5002 closing-tag errors on lines 70-71). Wave 1 is concurrently editing that template.

## Console-error log

**During the clean baseline window (19:38:17 – 19:48:32):**
- Zero runtime errors
- Only webpack-dev-server lifecycle messages + REMOTE-ROUTES bootstrap logs from the host-shell
- Module-federation success: `[MF] OK management_console (2 routes @ /management-console)`, `[MF] OK admin_console (2 routes @ /admin-console)`

**After 19:48:43 (Wave 1 interference — not baseline):**
- `[webpack-dev-server] ERROR libs/falcon-ui-core/.../falcon-sending-credentials-dialog.component.ts:161:4 - error TS2304: Cannot find name 'HostListener'.`
- `[webpack-dev-server] ERROR libs/falcon-ui-core/.../falcon-completion-success-dialog.component.html:70:3 - error NG5002: Unexpected closing tag "div".`
- `[webpack-dev-server] ERROR libs/falcon-ui-core/.../falcon-completion-success-dialog.component.html:71:1 - error NG5002: Unexpected closing block. … forgot to close the <dialog> element?`

## Recommendation for Wave 1 verification round

When Wave 1's code conversion is complete (HostListener imported, completion-success template fixed):

1. Re-run the exact path (sysadmin → Org Hierarchy → Falcon root → Add Client → 5-step wizard → Save) and capture a fresh dialog-open screenshot. Compare pixel-for-pixel against `ss_19199287p` for the bleed-through area:
   - The stepper rail (y ≈ 175) should be **fully masked** by the backdrop, not visible.
   - The Step 5 form labels and values should be fully masked, not legible.
2. Verify `getComputedStyle(backdrop).zIndex` returns a numeric value (not `"auto"`).
3. Verify the dialog is either at z ≥ 100001 OR has been portalled into `.falcon-overlay-container` / native top layer.
4. Verify ESC closes the dialog and returns focus to the Save button.
5. Verify backdrop click closes the dialog (or explicitly does NOT, per design intent — record either way).
6. Verify focus on open lands inside the dialog and Tab cycles only within it.
7. Reach the Completion Success dialog (click Send Credentials inside the modal). Run the same 6-check rubric on it.

## File manifest

```
C:\Falcon\Brain Outputs\_investigations\2026-05-21-top-layer-migration\baseline\
├── BASELINE.md          (this file)
└── dom-analysis.json    (machine-readable DOM + CSS evidence)
```

PNG screenshots: the Chrome MCP server's `save_to_disk` flag did not persist files to a discoverable location on this Windows install. Canonical visual evidence is preserved inline in the parent agent's conversation transcript — see the tool-result-ID table above.
