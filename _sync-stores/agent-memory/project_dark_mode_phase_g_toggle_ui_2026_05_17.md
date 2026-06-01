---
name: Falcon Dark Mode — Phase G (Theme Toggle UI)
description: Topbar icon button calls ThemeService.toggle(); moon shown in light, sun shown in dark. Aria-label tracks action via i18n. Settings 3-way radio DEFERRED (no Settings page exists). All 3 builds GREEN.
type: project
agent: ammar-web-platform-ui
date: 2026-05-17
status: completed
related:
  - project_dark_mode_phase_b_theme_service_2026_05_17.md
  - project_dark_mode_wave14_phase_c_2026_05_17.md
---
# Phase G — Theme Toggle UI

🟢 **LANDED 2026-05-17**. Phase G makes the Phase B/C/D/E dark-mode infrastructure user-discoverable via a single topbar icon button.

## Builds

| App | Hash | Duration |
|---|---|---|
| host-shell | `95a3f7887e71e48d` | 11.418 s |
| admin-console | `cc7dc852427b4c2c` | 17.633 s |
| management-console | `0179afc6ba0d2047` | 14.213 s |

## Shipped surfaces

- **Topbar icon toggle button** at [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.html:51-78` (between bell button and topbar divider). Calls `ThemeService.toggle()`. Icon morphs: moon when light (action = "switch to dark"), sun when dark (action = "switch to light"). Aria-label dynamically bound to `topbar.aria.toggleToDark` / `topbar.aria.toggleToLight` via computed signal.
- **Settings page Theme section** — **DEFERRED**. No Settings page exists in host-shell today (verified via `Glob **/*settings*` → zero matches). Per spec's halt-and-flag rule, did not create a Settings page from scratch.

## Files touched (4 files, +62 lines)

| File | Change |
|---|---|
| [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.ts` | Import ThemeService, `inject(ThemeService)`, `themeServiceTheme` getter, `themeToggleAriaKey` computed, `onToggleTheme()` method |
| [CODE] `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` | New icon button with `@if/@else` for moon/sun morph, `[attr.aria-label]` dynamic binding, `(click)="onToggleTheme()"` |
| [CODE] `libs/falcon/src/language/i18n/en.json` (+2 keys in `topbar.aria.*`) | `toggleToDark`/`toggleToLight` English |
| [CODE] `libs/falcon/src/language/i18n/ar.json` (+2 keys in `topbar.aria.*`) | `toggleToDark`/`toggleToLight` Arabic |

## Doctrine

1. **Inline SVG matches topbar precedent.** The existing topbar uses inline SVGs for search, bell, chevrons, mood-toggle moon, mood-toggle sun, language globe, logout, home. Adding registry entries for two glyphs already inlined elsewhere in the same file would create drift, not eliminate it. Registry is the right SSOT for icons used across multiple components; inline beats registry-detour when the icon is already inlined a few lines away in the same template.
2. **Inject service in component class, expose protected signal to template.** Project has no precedent for `(click)="themeService.toggle()"` directly on the template, so the implementation follows the more disciplined pattern: `private themeService = inject(ThemeService)` + `protected themeServiceTheme = this.themeService.currentTheme` + `protected onToggleTheme(): void { this.themeService.toggle(); }`. Template stays declarative.
3. **Aria-label tracks the ACTION, not the state.** WAI-ARIA APG button pattern for toggle buttons whose icon morphs: name describes what the click will do. Light state → "Switch to dark mode"; dark state → "Switch to light mode". Dynamic via `computed()`.
4. **Coexistence with legacy `HostThemeFacade` is intentional.** The existing in-menu mood toggle (segmented pill at `topbar.component.html:117-149`) still uses `HostThemeFacade` chain. Both layers write the same `.app-dark` class and `data-theme` attribute, so end state is consistent. Migrating the in-menu toggle and deprecating `HostThemeFacade` is a separate cleanup wave.
5. **Don't touch ThemeService API in Phase G.** Phase B locked the API; G is a pure consumer.
6. **Don't add theme tokens in Phase G.** Phase C owns tokens; G uses the existing cascade.
7. **No new dependencies.** Falcon UI Core + Tailwind + existing TranslatePipe only.

## Implementation pattern (reusable)

```typescript
// Component class
private readonly themeService = inject(ThemeService);
protected readonly themeServiceTheme = this.themeService.currentTheme;
protected readonly themeToggleAriaKey = computed(() =>
  this.themeServiceTheme() === 'dark' ? 'topbar.aria.toggleToLight' : 'topbar.aria.toggleToDark',
);
protected onToggleTheme(): void { this.themeService.toggle(); }
```

```html
<button type="button"
        class="icon-btn relative grid place-items-center size-[38px] rounded-[10px] text-falcon-neutral-800 bg-transparent border-0 cursor-pointer hover:bg-falcon-neutral-50 transition-colors duration-150"
        [attr.aria-label]="themeToggleAriaKey() | translate"
        (click)="onToggleTheme()">
  @if (themeServiceTheme() === 'dark') {
    <!-- inline sun SVG -->
  } @else {
    <!-- inline moon SVG -->
  }
</button>
```

## Trigger phrases

- `theme toggle topbar`
- `dark mode toggle button`
- `phase g toggle ui`
- `add theme toggle button to <component>` (this is the canonical pattern)
- `topbar.aria.toggleToDark` / `topbar.aria.toggleToLight`

## Not shipped (future phases)

- **Settings page Theme section** with 3-way radio (Light / Dark / Match system) — deferred until a Settings page exists in host-shell. Track as Phase G2.
- **Migrate in-menu mood toggle to `ThemeService`** — separate cleanup wave; not in G scope.
- **Deprecate `HostThemeFacade`** — separate cleanup wave once all consumers move to `ThemeService`.

## Report

- [REPORT] `C:\Falcon\Brain Outputs\reports\dark-mode-audit\PHASE-G-TOGGLE-UI.md` — full Phase G dossier with build hashes, file diff summary, icon/i18n details, and doctrine.
