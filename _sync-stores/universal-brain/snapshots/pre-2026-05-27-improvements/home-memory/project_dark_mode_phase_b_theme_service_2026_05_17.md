---
name: Falcon Dark Mode — Phase B (ThemeService wiring)
description: ThemeService at apps/host-shell/falcon-facades/theme.facade.ts owns <html class="app-dark"> + <html data-theme="dark|light"> together. APP_INITIALIZER wired. FOUC scripts in all 3 index.html. All 3 builds GREEN.
type: project
agent: ammar-web-platform-ui
date: 2026-05-17
status: completed
related:
  - project_dark_mode_wave14_phase_c_2026_05_17.md
originSessionId: e4d28e9d-28d9-43e1-ac0f-c412532e588d
---
# Phase B — Dark Mode ThemeService

🟢 **LANDED 2026-05-17** (Wave 14 Phase B).

## Builds

| App | Hash | Duration |
|---|---|---|
| host-shell | `940d5572db9fdd14` | 20.70s |
| admin-console | `1f5b37b0a92fa701` | 19.05s |
| management-console | `b408b2ccc96db650` | 16.39s |

## Files

### Created
- [CODE] `apps/host-shell/falcon-facades/theme.facade.ts` (~165 lines) — new `ThemeService` with signal-based API.

### Edited
- [CODE] `apps/host-shell/src/app/app.config.ts` — added `provideAppInitializer(() => { ngInject(ThemeService); })` so the service constructs during bootstrap, applying theme BEFORE the component tree renders.
- [CODE] `apps/host-shell/src/index.html` — FOUC script rewritten to read `falcon-theme` key + respect `prefers-color-scheme: dark` fallback for `system` preference.
- [CODE] `apps/admin-console/src/index.html` — same FOUC script.
- [CODE] `apps/management-console/src/index.html` — same FOUC script.

## Public API

```typescript
export type FalconThemePreference = 'light' | 'dark' | 'system';
export type FalconResolvedTheme   = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme: Signal<FalconResolvedTheme>;       // applied to <html>
  readonly preference:  Signal<FalconThemePreference>;      // user's stored choice
  setTheme(preference: FalconThemePreference): void;
  toggle(): void;                                           // flips light↔dark
}
```

## Design decisions

1. **Two selectors set together** — every theme application sets BOTH `<html class="app-dark">` (drives Tailwind utility layer at [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:13`) AND `<html data-theme="dark|light">` (drives Stencil component layer at [CODE] `libs/falcon-ui-tokens/src/themes/dark.css:11`). Both selectors are required for full coverage.
2. **localStorage key `falcon-theme`** (NOT `theme`) — distinct from the legacy `HostThemeFacade` (`theme` key) so both can coexist without conflict. The new ThemeService is authoritative at runtime.
3. **`'system'` as default** — preference resolves to OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`. `matchMedia` `change` event re-resolves when preference is `'system'`.
4. **`toggle()` collapses `'system'` to effective** — first toggle from `'system'` lands on the *opposite* of the current OS preference. Matches user mental model of "toggle the thing I see".
5. **Constructor applies synchronously** — service does `applyTheme()` in its constructor BEFORE the `effect()` is queued, so the first paint after bootstrap is always correct. The `effect()` then handles all subsequent signal-driven updates.
6. **SSR-safe** — `inject(PLATFORM_ID)` + `isPlatformBrowser()` guards every `localStorage`, `matchMedia`, `documentElement` access.
7. **FOUC mitigation, three layers**:
   - Layer 1: inline `<script>` in `<head>` of each `index.html` — runs before bundle load.
   - Layer 2: `provideAppInitializer(() => { ngInject(ThemeService); })` — service constructs during Angular bootstrap, before component tree renders.
   - Layer 3: legacy `HostThemeFacade` still sets the same attributes via its own constructor (no conflict — same end state).

## Coexistence with legacy `HostThemeFacade`

[CODE] `apps/host-shell/falcon-facades/host-theme.facade.ts` is unchanged. It uses localStorage key `theme` (separate from `falcon-theme`) and writes to the same `<html>` attributes. The new `ThemeService` wins last-write for the same attribute set, but since both services apply identical mutations (`app-dark` class + `data-theme`), there is no observable conflict. A future phase can deprecate `HostThemeFacade` and migrate its consumers to `ThemeService`.

## Doctrine

- **Do NOT inline color logic in services** — tokens own that. ThemeService only flips selectors; cascade does the rest.
- **Both selectors required** — Tailwind utility layer needs `.app-dark`; Stencil component layer needs `[data-theme='dark']`. Setting one without the other leaves half the UI in light mode.
- **`provideAppInitializer` is the right wire-up for `providedIn: 'root'` services that need to construct on startup** — `inject(ThemeService)` triggers construction; the initializer body has no other work.
- **Inline FOUC scripts must mirror service logic exactly** — same key, same fallback (OS preference for `'system'`), same selector mutations. Drift between the two is what causes the dreaded "white flash for half a second on dark theme".

## Trigger phrases

- `dark mode toggle service`
- `falcon-theme localStorage key`
- `theme service phase b`
- `Wave 14 Phase B`
- `add theme toggle to <component>` (Phase D will provide a UI — this phase only ships the service).

## Not yet shipped (future phases)

- UI toggle button (Phase D).
- Migrating remaining hardcoded colors (Phase A audit identifies these).
- Deprecating `HostThemeFacade` (separate cleanup wave).
