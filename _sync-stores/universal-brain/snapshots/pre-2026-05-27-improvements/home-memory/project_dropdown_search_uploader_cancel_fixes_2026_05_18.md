---
name: Dropdown search + uploader-cancel wizard-close fixes
description: Two FE bugs fixed 2026-05-18 — country/city searchable dropdowns + photo uploader file-picker cancel closing the wizard; includes the Angular native-event/@Output name-collision gotcha
type: project
originSessionId: 5b2512b2-3198-4930-931a-52efc8fb6045
---
Two frontend bugs fixed 2026-05-18 in admin-console org-hierarchy-page.

**Bug 1 — country/city dropdowns not searchable.** `<falcon-dropdown-tw>` already implements `searchable` fully (search input, `filterOptions` case-insensitive substring match). Fix was app-side only: added `[searchable]="true"` to country+city dropdowns in client-information-step (Add Client wizard) and falcon-org-info-panel (Information panel edit mode). Library needed no change.

**Bug 2 — dismissing the OS file picker closed the Add Client wizard.**
**Why:** The library `falcon-photo-uploader`'s `<input type="file">` fires a native DOM `cancel` event (bubbles) when the picker is dismissed. It bubbled to `<app-add-client-wizard>`, whose parent binds `(cancel)="state.addClientOpen.set(false)"`. Angular wires `(cancel)` to the wizard's `@Output() cancel` AND — because the name matches a native DOM event — also attaches a native `cancel` listener on the host element. The bubbled event triggered it.
**Fix:** library-side — file input now does `(cancel)="$event.stopPropagation()"` so the internal picker-dismiss event never escapes the uploader. Fixes every consumer (Add Client, Add User, Info panel).

**How to apply (reusable Angular gotcha):** A component `@Output()` whose name collides with a native DOM event name (`cancel`, `close`, `change`, `input`, `toggle`, `error`…) will ALSO fire its `(name)` handler for any matching native DOM event that bubbles up from descendants. When embedding native elements, stop their internal events from propagating out, or avoid colliding output names.

**Follow-up 2026-05-18 — country→city + search-focus.**
- Add Client wizard now loads cities per-country (was: all cities eager-prefetched at wizard open). `AddClientWizardSignalsService.loadClientCities(countryId)` empties cities + fetches `getLookup(LOOKUP_IDS.City, {code})`, resolving `code` from a retained `countryCatalog`. Step 1 country dropdown calls `onCountryChange()` which clears the `city` form slot in lockstep. Mirrors the Info panel's pre-existing `InfoPanelStateSlice.setCountry()` (Info panel already did this correctly).
- Library `falcon-dropdown-tw` + `falcon-dropdown`: searchable dropdowns now open + focus the search box and seed the typed char when any printable key is pressed on the closed/focused trigger (`handleTriggerKeydown`) — type-to-filter without clicking. Both variants kept in sync.
- Body-portaled dropdown panel stretched full-viewport on first open (`positionPopoverFixed` set only `min-width`, leaving `width:auto` → the `start-0 end-0` utility classes resolved to edge-to-edge stretch against the overlay container). Fix: new opt-in `exactWidth` option on `PortalPositionOptions` in `popover-portal.ts` — when set, writes an explicit `width: <anchorWidth>px !important`. `falcon-dropdown-tw` passes `{exactWidth:true}`. Calendars/menus keep `min-width`-only so they retain their intrinsic width.
