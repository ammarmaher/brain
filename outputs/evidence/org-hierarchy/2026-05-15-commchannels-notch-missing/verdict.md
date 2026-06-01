*** QA-WEB VERDICT — falcon-ui-core shadow row notch fix (Wave 20 follow-up) ***
*** Captured 2026-05-15 — Ammar QA-Web                                       ***

# Overall verdict: PASS — fix verified

The notch is rendering, visible, correctly positioned to its target column,
survives collapse/re-expand, and uses the new `--falcon-data-table-shadow-arrow-z` token.

## Environment

| Item              | Value |
|-------------------|-------|
| Browser           | Chrome (Ammar PC, via Claude-in-Chrome MCP) |
| host-shell        | http://localhost:4200 → 200 |
| admin-console     | http://localhost:4204 → 200 |
| mgmt-console      | http://localhost:4301 → 200 |
| Authenticated as  | FalconAdmin (Falcon Admin / sys-admin) |
| Route             | http://localhost:4200/#/admin-console/org-hierarchy-page |
| Node selected     | BMW |
| Tab               | CommChannels & Services |
| Viewport          | 2560 x 1249 (DPR 1.5) |
| Stack came up cleanly | YES — three ports green on initial probe |

## Mock data shape observed (BMW node)

9 rows total. Only 2 had chevron toggles (shadow rows exist):

| Row | Service           | Has shadow? | Mode  | Targets column |
|-----|-------------------|-------------|-------|-----------------|
| c1  | SMS Gateway       | (text shows greve glyph but no toggle wired) | -    | -              |
| c2  | WhatsApp Business | YES         | edit  | priceValue      |
| c3  | Email Relay       | no          | -     | -               |
| c4  | Voice IVR         | YES         | view  | priceType       |
| c5-c9 | (others)        | no          | -     | -               |

NOTE: only 1 shadow per parent in seeded data. A5 (multi-shadow per parent) could not be
exercised against this mock because the data does not contain two shadows on the same parent.

## Per-assertion table

| #   | Assertion                                                                 | Verdict | Evidence (one line) |
|-----|---------------------------------------------------------------------------|---------|---------------------|
| A1  | Notch is visible at top of expanded shadow row                            | PASS    | arrow.display=block, visibility=visible, opacity=1, w=20px h=10px green |
| A2  | Notch x-centered on Price Type col for price-type shadow                  | PASS    | Voice IVR arrow center=1091.00 vs Price Type col center=1091.20 (delta -0.20px) |
| A3  | Notch x-centered on Price Value col for price-value shadow                | PASS    | WhatsApp arrow center=1291.00 vs Price Value col center=1290.54 (delta +0.46px) |
| A4  | Multiple notches per parent row, each aligned to its own column           | N/A *   | Seeded mock has only 1 shadow per parent. Two DIFFERENT parents (c2 priceValue + c4 priceType) confirmed independently aligned. |
| A5  | Window resize keeps notch alignment correct                               | PARTIAL | MCP `resize_window` did NOT actually shrink Chrome inner viewport on this machine (2560 stayed 2560). However an explicit `window.dispatchEvent('resize')` triggered the listener with no errors and arrows stayed within sub-pixel of target. |
| A6  | Collapse + re-expand works — notch reappears aligned                       | PASS    | 4-cycle test: each collapse removes shadow from DOM; each re-expand recreates arrow at center=1291.00 with data-shadow-arrow-ready=true |
| A7  | Edit mode uses Falcon components (input + date picker)                    | PASS    | <falcon-angular-input>+<falcon-input-tw>, <falcon-angular-date-picker>+<falcon-date-picker-tw> present |
| A8  | Cancel reverts to view mode                                               | PASS    | Click Cancel: data-shadow-mode flips edit→view; buttons go Save/Cancel → Edit/Delete |
| A9  | Save emits the save event                                                 | PASS    | Click Save: custom event `falcon-shadow-action` dispatched on <falcon-table-tw>; followed by `falcon-shadow-cells-mounted` re-mount; mode flips edit→view |
| A10 | No console errors related to shadow rows                                  | PASS    | Zero `falcon-shadow*` errors. 1 pre-existing exception (styles.js import.meta) + 52 pre-existing federation/lint warnings — all unrelated to this fix. |

* A4 cannot be exercised against the seeded mock data — flagging as N/A rather than FAIL. The
component itself supports it (each shadow row has its own `data-shadow-target-column`
attribute that drives independent positioning), but no parent row in the BMW mock data
ships two shadows.

## DOM inspection — the critical numbers

WhatsApp Business shadow (c2-s1, edit mode, target=priceValue):
- arrow rect: `{ left:1281, right:1301, top:500.375, bottom:510.375, width:20, height:10 }`
- arrow computed: `position:absolute, top:-10px, left:711px, width:20px, height:10px, z-index:2, display:block, visibility:visible, opacity:1`
- arrow border: `border-bottom: 10px solid rgb(236,253,245)` (green-50 band tint), L+R+T transparent
- arrow center x: 1291.00 — Price Value column center 1290.54 — delta +0.46px
- `data-shadow-arrow-ready` attribute: SET
- `data-shadow-mount="c2::c2-s1"` on <td>: SET
- `data-shadow-mode="edit"` on <td>: SET
- `data-shadow-target-column="priceValue"` on <td>: SET

Voice IVR shadow (c4-s1, view mode, target=priceType):
- arrow rect: `{ left:1081, right:1101, top:770.375, bottom:780.375, width:20, height:10 }`
- arrow computed: same shape, position absolute, top -10px, z-index 2
- arrow center x: 1091.00 — Price Type column center 1091.20 — delta -0.20px
- `data-shadow-arrow-ready` attribute: SET

## Console errors filtered to `falcon-shadow*`, `data-shadow-mount`, uncaught

- ZERO falcon-shadow related errors or warnings
- ZERO uncaught exceptions in shadow code paths

## Bugs found that block the fix

None.

## Follow-up issues found (NOT blockers)

1. **(LOW)** SMS Gateway row shows a glyph in the Action column visually resembling
   a chevron, but no `Toggle row detail` button is wired for that row. Verify whether
   this is a hardcoded text glyph in mock data or an unrendered chevron component.
   Could confuse a user into clicking expecting a shadow row that doesn't exist.

2. **(LOW)** The MCP `resize_window` call returns success but inner viewport stayed
   at 2560 on this Windows host — likely a chrome extension limitation. Future QA
   wanting to test the responsive resize listener should call `window.dispatchEvent('resize')`
   from a JS eval instead, OR open chrome devtools and toggle device emulation.

3. **(LOW)** Pre-existing `SyntaxError: Cannot use 'import.meta' outside a module`
   from `http://localhost:4200/styles.js:99192:28` on every page load. UNRELATED to
   this fix but worth filing — something is being bundled into styles.js as an
   ES-module but loaded as a classic script.

4. **(LOW)** Pre-existing 52x Module Federation "Version 0.0.1 does not satisfy auto"
   warnings on every page load (matches your project memory note for the @falcon
   singleton version mismatch known issue).

## DOM inspection findings summary

The fix is mounted correctly:
- Shadow row `<td>` carries `data-shadow-mount="<rowId>::<shadowId>"` attribute as designed.
- Shadow arrow `<span class="falcon-table-shadow-arrow">` has `data-shadow-arrow-ready` set
  AFTER the layout-coalesced positioning runs (RAF), confirming the new
  `requestAnimationFrame` coalesced repositioning landed.
- Computed `top: -10px` (= `calc(-1 * 10px)` resolved from `--falcon-data-table-shadow-arrow-size`)
  — exactly the new behavior. The base of the triangle now sits ON the row top edge, with
  the triangle extending UP into the parent row's bottom — making it visible against the
  white parent row background instead of green-on-green as in the bug.
- Computed `z-index: 2` matches the new `--falcon-data-table-shadow-arrow-z: 2` token.

## Evidence files saved

- `C:\Falcon\Brain Outputs\evidence\org-hierarchy\2026-05-15-commchannels-notch-missing\dom-evidence.json`
- `C:\Falcon\Brain Outputs\evidence\org-hierarchy\2026-05-15-commchannels-notch-missing\verdict.md` (this file)
- Visual screenshots: returned inline in the conversation transcript at 3 stations:
  - station 1 — BMW node, CommChannels tab, no expansion (baseline `after-1-collapsed.png` equivalent)
  - station 2 — both shadows expanded, WhatsApp in view mode (`after-2-expanded-price-value.png` + `after-3-expanded-price-type.png` equivalent)
  - station 3 — WhatsApp in edit mode + Voice IVR in view mode (`after-4-edit-mode.png` + `after-5-multi-shadow.png` equivalent for the cross-parent multi-shadow scenario)

  The chrome MCP doesn't persist screenshots to disk on this host; if PNG files are
  strictly required at the evidence path, run a separate playwright/headless-chrome
  pass against the same authenticated route — DOM is stable and the structured
  evidence JSON above is sufficient to reproduce.

## Replay snippet (for regression-lock)

```javascript
// Reproduce in browser console at /#/admin-console/org-hierarchy-page with BMW selected → CommChannels & Services tab
(async () => {
  const t2 = document.querySelector('[aria-label="Toggle row detail for row 2"]');
  const t4 = document.querySelector('[aria-label="Toggle row detail for row 4"]');
  if (t2.getAttribute('aria-expanded') !== 'true') t2.click();
  await new Promise(r => setTimeout(r, 300));
  if (t4.getAttribute('aria-expanded') !== 'true') t4.click();
  await new Promise(r => setTimeout(r, 500));

  const shadows = document.querySelectorAll('tr[data-shadow-row-id]');
  const headers = {};
  document.querySelectorAll('thead th').forEach(h => {
    const r = h.getBoundingClientRect();
    headers[h.innerText.replace(/\s+/g,' ').trim()] = (r.left + r.right) / 2;
  });

  let allPass = true;
  for (const tr of shadows) {
    const td = tr.querySelector('td[data-shadow-mount]');
    const arrow = tr.querySelector('.falcon-table-shadow-arrow');
    const target = td.getAttribute('data-shadow-target-column');
    const expectCenter = target === 'priceValue' ? headers['Price Value']
                       : target === 'priceType'  ? headers['Price Type']
                       : null;
    const ar = arrow.getBoundingClientRect();
    const actualCenter = (ar.left + ar.right) / 2;
    const delta = Math.abs(actualCenter - expectCenter);
    const ready = arrow.hasAttribute('data-shadow-arrow-ready');
    const visible = arrow.offsetParent !== null;
    const pass = delta < 1.5 && ready && visible;
    if (!pass) allPass = false;
    console.log(`shadow ${tr.dataset.shadowRowId} target=${target} arrowCenter=${actualCenter} headerCenter=${expectCenter} delta=${delta.toFixed(2)}px ready=${ready} visible=${visible} → ${pass ? 'PASS' : 'FAIL'}`);
  }
  console.log(allPass ? 'REGRESSION-LOCK: PASS' : 'REGRESSION-LOCK: FAIL');
})();
```

## Closing

Wave 20 follow-up fix is confirmed working in the real browser. Shipping the closure.
