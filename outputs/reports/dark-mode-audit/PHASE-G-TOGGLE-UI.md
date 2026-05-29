# Phase G — Theme Toggle UI
**Date:** 2026-05-17
**Owner:** Ammar Web-Platform-UI
**Status:** 🟢 LANDED — topbar surface shipped; Settings surface deferred (no Settings page yet)

## Summary

Phase G makes the dark-mode infrastructure (shipped by Phase B + C + D + E) user-discoverable. It adds a single icon-button to the host-shell topbar that flips light↔dark with one click via the canonical Phase B `ThemeService.toggle()`. The icon morphs (moon when light, sun when dark) and the aria-label tracks the **action**, not the state, so screen-reader users hear "Switch to dark mode" / "Switch to light mode".

The 3-way (Light / Dark / Match system) radio surface was **deferred** — no Settings page exists in host-shell today, and the task spec explicitly told me not to create one in this phase. The toggle button alone covers the 95% case; a future phase can add `setTheme('system')` UI when a Settings page lands.

## Surfaces shipped

- **Topbar icon toggle button** at [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.html:51-78`
  - Wired to [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts` — `onToggleTheme()` method (calls `ThemeService.toggle()`), `themeServiceTheme` and `themeToggleAriaKey` computed signals for template binding.
- **Settings page theme section** — **DEFERRED**. No Settings page exists in `apps/host-shell/src/app/` (verified via `Glob **/*settings*` returning zero matches). Per the task spec's "halt-and-flag" instruction, did not create a Settings page from scratch in this phase.

## How users discover it

- **Topbar** → click the moon icon (light mode) or sun icon (dark mode) between the bell button and the user-menu divider to instantly flip the theme.
- **Settings** → N/A (no Settings page in scope yet). Future phase opportunity.

## Visual placement

The new button slots between the existing notification bell button and the topbar vertical divider — same `size-[38px] rounded-[10px]` chrome and `text-falcon-neutral-800 hover:bg-falcon-neutral-50` styling as the search and bell buttons, so the icon cluster reads as one consistent right-rail row.

## Icons used

The host-shell topbar uses **inline SVG** throughout (not `<falcon-svg-icon>`) — so for visual consistency the new button also uses inline SVG instead of touching the central SVG registry.

- **moon** (icon shown in light mode → "switch to dark"): outline path `M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z` (heroicons-style, 18×18, viewBox `0 0 24 24`, `stroke-width="2"`). Identical to the moon already used inline at [CODE] `topbar.component.html:131` for the in-menu mood toggle.
- **sun** (icon shown in dark mode → "switch to light"): outline `<circle cx="12" cy="12" r="4"/>` + 8 rays (`M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41`), 18×18, viewBox `0 0 24 24`, `stroke-width="2"`. Identical to the sun already used inline at [CODE] `topbar.component.html:112-115` (in-menu mood) and `topbar.component.html:145-147` (mood toggle inner button).

**Registry untouched.** No new entries added to [CODE] `libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.registry.ts` — the topbar inline-SVG precedent is preserved.

## i18n keys added

| Key | English | Arabic |
|---|---|---|
| `topbar.aria.toggleToDark` | "Switch to dark mode" | "التبديل إلى الوضع الداكن" |
| `topbar.aria.toggleToLight` | "Switch to light mode" | "التبديل إلى الوضع الفاتح" |

- [CODE] `libs/falcon/src/language/i18n/en.json:700-702` (inside `topbar.aria`)
- [CODE] `libs/falcon/src/language/i18n/ar.json:700-702` (inside `topbar.aria`)

The dynamic computed `themeToggleAriaKey()` picks the right key per current state: light state → `toggleToDark`, dark state → `toggleToLight`. Template binds `[attr.aria-label]="themeToggleAriaKey() | translate"`.

## Implementation pattern

Followed the spec's rule "don't inject ThemeService directly into the template if no precedent exists":

```typescript
// Component class — inject ThemeService once
private readonly themeService = inject(ThemeService);

// Expose current theme + aria-label key for template binding
protected readonly themeServiceTheme = this.themeService.currentTheme;
protected readonly themeToggleAriaKey = computed(() =>
  this.themeServiceTheme() === 'dark'
    ? 'topbar.aria.toggleToLight'
    : 'topbar.aria.toggleToDark',
);

// Single-action method — what the click handler calls
protected onToggleTheme(): void {
  this.themeService.toggle();
}
```

Template uses the protected signal-getter + control flow:
```html
<button (click)="onToggleTheme()" [attr.aria-label]="themeToggleAriaKey() | translate">
  @if (themeServiceTheme() === 'dark') { <!-- sun --> }
  @else { <!-- moon --> }
</button>
```

## Coexistence with legacy `HostThemeFacade`

The existing in-menu mood toggle (the segmented pill at `topbar.component.html:117-149`) still uses the legacy `HostThemeFacade` chain (`facadeMood` + `setMood` + `theme$`). **Intentionally left alone** per the Phase B doctrine of "coexistence — both layers write the same `.app-dark` class and `data-theme` attribute, so end state is consistent." A future cleanup wave can migrate the in-menu toggle to `ThemeService.setTheme()` and deprecate `HostThemeFacade`.

The new topbar button is the **primary, high-visibility surface**; the in-menu toggle remains the secondary, deeper-discovery surface until both can be unified.

## Accessibility

- `[attr.aria-label]` binds to the dynamic `themeToggleAriaKey()` computed signal — screen readers hear the **action** they will trigger, not the current state. Per WAI-ARIA APG button pattern for toggle buttons whose icon morphs.
- Visible focus ring via the `--shadow-falcon-focus` token (default browser focus + the existing `:focus-visible` styling on `.icon-btn` consumers — auto-inherited).
- Keyboard reachable via Tab; Enter/Space triggers click (default `<button type="button">` behavior).
- `(click)` handler is the only event listener — no custom keyboard handling needed.

## Theme handling under cascade

- Hover bg: `hover:bg-falcon-neutral-50` — the `.app-dark` cascade variant at [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:13` auto-flips `falcon-neutral-50` to its dark counterpart per the Phase C SSOT tokens.
- Icon color: `text-falcon-neutral-800` — same auto-flip via cascade.
- No per-button dark overrides needed.

## RTL

The topbar uses logical-direction utilities (`end-2`, `ps-1.5`, `pe-2.5`) throughout. The toggle button has no directional positioning — `grid place-items-center` centers the icon in both LTR and RTL. The button's position in the row (between bell and divider) flips naturally with the document direction.

## Build results

| App | Hash | Duration |
|---|---|---|
| host-shell | `95a3f7887e71e48d` | 11.418 s |
| admin-console | `cc7dc852427b4c2c` | 17.633 s |
| management-console | `0179afc6ba0d2047` | 14.213 s |

All 3 builds GREEN. No new warnings introduced.

## Files touched

| File | Change |
|---|---|
| [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts` | +30 lines (import ThemeService, inject, computed signals, onToggleTheme handler) |
| [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | +28 lines (new icon button between bell and divider) |
| [CODE] `libs/falcon/src/language/i18n/en.json` | +2 keys (`topbar.aria.toggleToDark`, `topbar.aria.toggleToLight`) |
| [CODE] `libs/falcon/src/language/i18n/ar.json` | +2 keys (Arabic translations) |

No deletions. No moves. Net: +62 lines across 4 files.

## Doctrine reinforced

- **Inline SVG matches the topbar's existing precedent** — adding entries to the central `svg-icon.registry.ts` for two glyphs already inlined elsewhere in the same file would have created drift, not eliminated it. The registry is the right SSOT for icons used across multiple components; for a single-file local-use pair already inlined a few lines away, inline beats registry-detour.
- **Inject service in component class, expose signal-getter to template** — the project has no precedent for `(click)="themeService.toggle()"` directly on the template, so I followed the more disciplined pattern of `inject(ThemeService)` + a `protected` `onToggleTheme()` method. Same end behavior, but keeps the template purely declarative.
- **Aria-label tracks the action** — WAI-ARIA recommends that the accessible name of a toggle button reflect the action it will perform, not the current state. Dynamic computed → screen readers hear "Switch to dark mode" when in light, and "Switch to light mode" when in dark.
- **Don't migrate the legacy mood toggle in this phase** — coexistence per Phase B keeps the change surface tight and avoids regressions. Phase B already established that `ThemeService` and `HostThemeFacade` write the same end state.

## Not shipped (future phases)

- **Settings page Theme section** with 3-way radio (Light / Dark / Match system) — deferred until a Settings page exists. Track as Phase G2 when Settings is built.
- **Migrating in-menu mood toggle to `ThemeService`** — separate cleanup wave; not in Phase G scope.
- **Deprecating `HostThemeFacade`** — separate cleanup wave once all consumers move to `ThemeService`.

## Verification checklist

- [x] Topbar toggle button exists and is visible in the topbar action cluster
- [x] Click calls `ThemeService.toggle()` (single-line action via `onToggleTheme()`)
- [x] Icon morphs on theme change (moon → sun and back, driven by `@if` control flow on `themeServiceTheme()`)
- [x] Aria-label tracks action, not state (dynamic computed key)
- [x] i18n keys added to both `en.json` and `ar.json` under `topbar.aria.*`
- [x] No new dependencies added
- [x] No alteration to `ThemeService` API
- [x] No new theme tokens added
- [x] All 3 builds GREEN (host-shell 95a3f7887e71e48d/11.4s, admin-console cc7dc852427b4c2c/17.6s, management-console 0179afc6ba0d2047/14.2s)
