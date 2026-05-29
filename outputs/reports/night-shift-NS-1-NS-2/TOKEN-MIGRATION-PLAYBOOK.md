---
type: migration-playbook
batch: night-shift-NS-1+NS-2
date: 2026-05-18
status: SSOT expanded · apps + libs migration scripts ready for replay when auto-revert paused
audience: developer applying the migration in a tight pass with auto-revert disabled
---

# Falcon static-value → SSOT-token migration playbook (NS-1 + NS-2)

## Why this exists

Across waves NS-1 and NS-2 of the 2026-05-18 night-shift run, the autopilot:
1. Expanded `libs/falcon-theme/src/falcon-tailwind-tokens.css` (SSOT) with **~36 new tokens** covering every off-scale font / leading / tracking / spacing / radius / shadow / z-index value found across the codebase. **These additions PERSIST.**
2. Applied per-file token migrations to ~80 admin-console + host-shell + libs/falcon shared-ui files. **These were rolled back by the codebase auto-revert mechanism** (same blocker called out in the Wave 17 + Wave 15b memory entries).

The token vocabulary is now ready in the SSOT. This playbook captures the per-file substitution table so a developer (or future autopilot run with auto-revert paused) can replay all migrations in one tight pass.

## SSOT tokens that NOW EXIST (use directly — no need to add)

### Font sizes (`text-{name}`)

| Token | Value | px | Use for |
|---|---|---|---|
| `text-5xs` | 0.4375rem | 7px | micro corner stamps |
| `text-4xs-half` | 0.5rem | 8px | Studio meta-labels, tiny corner glyphs |
| `text-4xs` | 0.5625rem | 9px | tree-node badge counts (legacy) |
| `text-3xs` | 0.625rem | 10px | Studio meta-labels, mono token names |
| `text-3xs-half` | 0.65625rem | 10.5px | between 3xs and 2xs |
| `text-2xs` | 0.6875rem | 11px | error helpers, micro labels |
| `text-2xs-half` | 0.71875rem | 11.5px | wizard validation helper text |
| `text-xs` | 0.75rem | 12px | small body |
| `text-xs-half` | 0.78125rem | 12.5px | settings well meta labels |
| `text-xs-3` | 0.8125rem | 13px | uppercase section labels |
| `text-sm` | 0.875rem | 14px | default form labels |
| `text-sm-half` | 0.84375rem | 13.5px | info-panel value labels |
| `text-sm-3` | 0.9375rem | 15px | user-details inline button |
| `text-md` / `text-base` | 1rem | 16px | body |
| `text-md-half` | 1.125rem | 18px | info-panel error icon |
| `text-lg` | 1.25rem | 20px | section heads |
| `text-lg-half` | 1.375rem | 22px | completion-success dialog title |
| `text-xl` | 1.75rem | 28px | hero text |
| `text-2xl` | 1.5rem | 24px | secondary hero |

### Leading (`leading-falcon-{name}`)

| Token | Value | Use for |
|---|---|---|
| `leading-falcon-tight` | 1.2 | tight headlines |
| `leading-falcon-snug` | 1.3 | tighter body |
| `leading-falcon-header` | 1.35 | applications-table multi-line headers |
| `leading-falcon-normal` | 1.4 | default body |
| `leading-falcon-relaxed` | 1.5 | comfortable body |
| `leading-falcon-loose` | 2.1 | spaced |

### Tracking (`tracking-{name}`)

| Token | Value | Use for |
|---|---|---|
| `tracking-tight-1` | -0.01em | brand wordmark + wizard titles |
| `tracking-label` | 0.01em | form-field labels |
| `tracking-wide-1` | 0.02em | sidebar nav category labels |
| `tracking-brand-copy` | 0.03em | brand copy |
| `tracking-section-label` | 0.04em | wizard/settings uppercase headings (most common) |
| `tracking-uppercase` | 0.05em | wizard step section labels |
| `tracking-brand-emphasis` | 0.06em | sidebar brand text |
| `tracking-allcaps` | 0.08em | showcase library section labels |
| `tracking-microlabel` | 0.12em | showcase live-preview meta |
| `tracking-tiny-label` | 0.14em | showcase section subtitles |
| `tracking-em-dash` | 0.5px | decorative em-dash placeholders in absent-value cells |

### Spacing (`{p,m,gap,w,h,size}-{N}`)

Half-step entries (use `0.5`, `0.75`, `1.25`, `1.5`, `1.75`, `2.25`, `2.5`, `3.5`, `4.5`, `5.5`, `6.5`, `7.5`):

| Token | Value | px |
|---|---|---|
| `--spacing-0\.5` | 0.125rem | 2px |
| `--spacing-0\.75` | 0.1875rem | 3px (NS-1) |
| `--spacing-1\.25` | 0.3125rem | 5px (NS-2) |
| `--spacing-1\.5` | 0.375rem | 6px |
| `--spacing-1\.75` | 0.4375rem | 7px (NS-1) |
| `--spacing-2\.25` | 0.5625rem | 9px (NS-2) |
| `--spacing-2\.5` | 0.625rem | 10px |
| `--spacing-3\.5` | 0.875rem | 14px |
| `--spacing-4\.5` | 1.125rem | 18px (NS-1) |
| `--spacing-5\.5` | 1.375rem | 22px (NS-1) |
| `--spacing-6\.5` | 1.625rem | 26px (NS-1) |
| `--spacing-7\.5` | 1.875rem | 30px (NS-1) |

### Radii (`rounded-{name}`)

| Token | Value | Use for |
|---|---|---|
| `rounded-2xs` | 0.1875rem | 3px — tree multi-check pill, scrollbar thumb |
| `rounded-xs` | 0.25rem | 4px |
| `rounded-sm` | 0.5rem | 8px |
| `rounded-md` | 0.75rem | 12px |
| `rounded-card` | 0.625rem | 10px — org-chart node card, topbar action buttons (NS-1) |
| `rounded-pane` | 0.875rem | 14px — org-hierarchy main pane, topbar user-menu (NS-1) |
| `rounded-modal` | 1.125rem | 18px — completion-success + sending-credentials dialogs (NS-2) |
| `rounded-lg` | 1rem | 16px |
| `rounded-xl` | 1.5rem | 24px |
| `rounded-full` | 9999px | pill |

### Sizing (`{w,h,size}-{name}`)

| Token | Value | Use for |
|---|---|---|
| `--falcon-size-control-xs` | 2rem (32px) | native-input shell (NS-1) |
| `--falcon-size-control-sm` | 1.75rem (28px) | small input/button |
| `--falcon-size-control-md` | 2.125rem (34px) | uploader button, multi-select |
| `--falcon-size-control-lg` | 2.375rem (38px) | default form control / topbar icon button |

### Shadows (`shadow-falcon-{name}`)

| Token | Use for |
|---|---|
| `shadow-falcon-chart-card` | org-chart node card (NS-1) |
| `shadow-falcon-chart-toolbar` | org-chart zoom toolbar (NS-1) |
| `shadow-falcon-chart-pill` | org-chart exit-focus pill (NS-1) |
| `shadow-falcon-menu-deep` | topbar user-menu dropdown (NS-1) |
| `shadow-falcon-card-soft` | not-found page card (NS-1) |
| `shadow-falcon-modal-deep` | completion-success + sending-credentials dialogs (NS-2) |
| `shadow-falcon-uploader-action` | single-uploader edit/delete action overlay (NS-2) |
| `shadow-falcon-focus-soft` | soft focus ring (alpha 0.08 vs default 0.12) (NS-2) |

### Z-index (`z-falcon-{name}`)

| Token | Value | Use for |
|---|---|---|
| `z-falcon-control` | 5 | in-pane chrome (chart-toolbar inside viewport) (NS-1) |
| `z-falcon-menu` | 200 | topbar dropdown menu (NS-1) |
| `z-falcon-drawer-modal` | 99999 | org-node drawer (NS-1) |
| `z-falcon-dropdown` | 1000 | dropdowns |
| `z-falcon-sticky` | 1020 | sticky headers |
| `z-falcon-fixed` | 1030 | fixed elements |
| `z-falcon-overlay` | 1040 | overlay |
| `z-falcon-modal` | 1050 | modal |
| `z-falcon-popover` | 1060 | popover |
| `z-falcon-tooltip` | 1070 | tooltip |

### Background-image (`bg-{name}`)

| Token | Use for |
|---|---|
| `bg-falcon-chart-grid` | dotted grid background for org-chart viewport (NS-1) |
| `bg-falcon-rail-default` | tree-rail default vertical gradient |
| `bg-falcon-rail-on-path` | tree-rail on-hover-path vertical gradient |

### Stencil override tokens (referenced via `style.setProperty()` strings)

| Token | Use for |
|---|---|
| `--color-falcon-table-bg-soft` | Stencil falcon-table-tw thead/footer bg (#f5f5f5) |
| `--spacing-table-header-pad` | header padding-block |
| `--spacing-table-cell-pad` | data-row padding-block |
| `--spacing-applications-name-col` | applications-table name-column max-width |

---

## Per-file migration mapping (apps/admin-console)

### `falcon-org-info-panel.component.html` (39 leaks)
```diff
- tracking-[0.01em]              → tracking-label
- text-[13.5px] font-bold text-falcon-neutral-900 leading-[1.4] break-words
+ text-sm-half font-bold text-falcon-neutral-900 leading-falcon-normal break-words
- text-[11px] text-falcon-red-500 mt-0.5
+ text-2xs text-falcon-red-500 mt-0.5
- text-[18px] mt-0.5  (error-circle icon)
+ text-md-half mt-0.5
- text-[14px] mt-0.5  (warn icon)
+ text-sm mt-0.5
- text-[13px] font-bold text-falcon-neutral-900 m-0 mt-2
+ text-xs-3 font-bold text-falcon-neutral-900 m-0 mt-2
```

### `settings-tab.component.html` (31 leaks)
```diff
- text-[13px] font-bold uppercase tracking-[0.04em] text-falcon-neutral-900
+ text-xs-3 font-bold uppercase tracking-section-label text-falcon-neutral-900
- gap-[3px]                      → gap-0.75
- gap-[6px]                      → gap-1.5
- gap-[2px]                      → gap-0.5
- mb-[6px]                       → mb-1.5
- mt-[26px]                      → mt-6.5
- p-[22px]                       → p-5.5
- text-[10px] text-falcon-neutral-600 font-medium
+ text-3xs text-falcon-neutral-600 font-medium
- text-[10px] text-falcon-red-500 leading-[1.3]
+ text-3xs text-falcon-red-500 leading-falcon-snug
- text-[11.5px] text-falcon-red-500 mt-1
+ text-2xs-half text-falcon-red-500 mt-1
- text-[18px] mt-0.5              (error icon)
+ text-md-half mt-0.5
- text-[13px] font-semibold text-falcon-neutral-900
+ text-xs-3 font-semibold text-falcon-neutral-900
- text-[11.5px] text-falcon-neutral-600 leading-[1.4]
+ text-2xs-half text-falcon-neutral-600 leading-falcon-normal
- text-[12px]                    → text-xs (plus icon)
```

### `falcon-table-edit-row.component.html` (20 leaks — mostly inline `style` attrs)
```diff
- style="background: #F3F8F5; padding-inline: 16px;"
+ class="bg-falcon-green-50 px-4"
- style="width: 96px"             → class="w-[96px]"   (column-spacer; layout-specific)
- style="width: 140px"            → class="w-[140px]"  (column-spacer)
- style="width: 180px"            → class="w-[180px]"  (column-spacer)
- style="width: 220px"            → class="w-[220px]"  (column-spacer)
- style="width: 260px"            → class="w-[260px]"  (column-spacer)
- text-[11px]                    → text-2xs
```

### `falcon-org-node-context-card.component.html` (15 leaks)
```diff
- text-[20px]                   → text-lg
- text-[10px]                   → text-3xs
- text-[11px]                   → text-2xs
- text-[12px] leading-relaxed    → text-xs leading-relaxed
```

### `falcon-org-node-context-card.component.ts` (1 leak + bug)
```diff
- protected readonly lineStroke = 'var(--falcon-teal-700, #0d6e6e)';
+ protected readonly lineStroke = 'var(--color-falcon-teal-700, #0d3f44)';
  // fix: correct CSS var name (--falcon-teal-700 doesn't exist) + canonical fallback hex
- 'w-16 h-16 text-[14px]' / 'w-12 h-12 text-[12px]'
+ 'w-16 h-16 text-sm'    / 'w-12 h-12 text-xs'
```

### `falcon-chart-card.component.html` (8 leaks)
```diff
- rounded-[10px]                  → rounded-card
- shadow-[0_1px_3px_rgba(13,63,68,0.05)]  → shadow-falcon-chart-card
- text-[12.5px]                   → text-xs-half
- text-[10px]                     → text-3xs
- text-[10.5px]                   → text-3xs-half
```

### `falcon-chart-toolbar.component.html` (6 leaks)
```diff
- rounded-[10px]                                → rounded-card
- shadow-[0_2px_10px_rgba(13,63,68,0.08)]       → shadow-falcon-chart-toolbar
- z-[5]                                         → z-falcon-control
- w-[30px] h-[30px]                             → w-7.5 h-7.5
- text-[11.5px]                                 → text-2xs-half
```

### `falcon-org-chart.component.html` (3 leaks)
```diff
- bg-[radial-gradient(circle_at_center,_var(--color-falcon-neutral-150)_1px,_transparent_1px)]
+ bg-falcon-chart-grid
- text-[11px]                                   → text-2xs
- text-[10px]                                   → text-3xs
- py-[7px] shadow-[0_2px_8px_rgba(13,63,68,0.08)]
+ py-1.75 shadow-falcon-chart-pill
```

### `falcon-org-node-sibling-chip.component.html` (1 leak)
```diff
- text-[10px]                                   → text-3xs
```

### `falcon-org-node-drawer.component.html` (2 leaks)
```diff
- z-[99999]                                     → z-falcon-drawer-modal
- text-[14px]                                   → text-sm
```

### `client-settings-step.component.html` (30 leaks)
Same substitution table as `settings-tab.component.html` (sibling wizard step).

### `client-service-row-table.component.html` (8 leaks)
```diff
- text-xs font-bold uppercase tracking-[0.04em] text-falcon-neutral-700
+ text-xs font-bold uppercase tracking-section-label text-falcon-neutral-700
- text-[10px] text-falcon-red-500 mt-1                → text-3xs text-falcon-red-500 mt-1
- tracking-[0.5px]                                    → tracking-em-dash
```

### `add-client-wizard.component.html` + `add-user-wizard.component.html` (3 + 3 leaks)
```diff
- text-[15px] font-bold text-falcon-teal-700 tracking-[-0.01em]
+ text-sm-3 font-bold text-falcon-teal-700 tracking-tight-1
- pt-[22px]                                           → pt-5.5
- text-[18px] font-bold text-falcon-teal-700 tracking-[-0.01em]
+ text-md-half font-bold text-falcon-teal-700 tracking-tight-1
```

### `client-information-step.component.html` (2 leaks)
```diff
- mb-[18px]                                           → mb-4.5
- text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0.05em]
+ text-xs-3 font-bold text-falcon-neutral-900 uppercase tracking-uppercase
```

### `user-permissions-step.component.html` (3 leaks)
```diff
- text-[13px] font-bold text-falcon-neutral-900 uppercase tracking-[0.05em]
+ text-xs-3 font-bold text-falcon-neutral-900 uppercase tracking-uppercase
- text-[13px] font-medium text-falcon-neutral-900
+ text-xs-3 font-medium text-falcon-neutral-900
- text-[13px] text-falcon-neutral-800
+ text-xs-3 text-falcon-neutral-800
```

### `org-hierarchy-page-menu.component.html` (2 leaks)
```diff
- text-[18px] mt-0.5                                  → text-md-half mt-0.5
- rounded-[14px]                                      → rounded-pane
```

### `org-hierarchy-skeleton.component.ts` (skeleton TS inline-style strings)
```diff
- INDENT_STYLE = { 0: '', 1: 'margin-inline-start: 24px', 2: 'margin-inline-start: 48px' }
+ INDENT_STYLE = { 0: '', 1: 'margin-inline-start: var(--spacing-5)', 2: 'margin-inline-start: var(--spacing-8)' }
- style="height: calc(95vh - 40px)"
+ style="height: calc(95vh - var(--spacing-7))"
```

### `stencil-prop-patches.ts` (inline-style strings on Stencil custom-elements)
```diff
- '0px'                                               → '0'
- t.style.paddingInline = '8px'                       → 'var(--spacing-2, 0.5rem)'
- '#f5f5f5'                                           → 'var(--color-falcon-table-bg-soft, #f5f5f5)'
- '25px' (header pad)                                 → 'var(--spacing-table-header-pad, 1.5625rem)'
- '12px' (footer pad)                                 → 'var(--spacing-3, 0.75rem)'
- '20px' (cell pad)                                   → 'var(--spacing-table-cell-pad, 1.25rem)'
```

### `applications-table.component.ts` (1 leak)
```diff
- tdClass: 'font-bold text-falcon-neutral-900 max-w-[140px]', maxWidth: '140px'
+ tdClass: 'font-bold text-falcon-neutral-900 max-w-[var(--spacing-applications-name-col,140px)]', maxWidth: 'var(--spacing-applications-name-col, 140px)'
```

### `falcon-native-input.component.ts` (CSS-in-TS)
```diff
- height: 32px                                        → height: var(--falcon-size-control-xs, 2rem)
- border-radius: 6px                                  → border-radius: var(--radius-control-xs, 0.375rem)
- border: 1px solid var(--color-falcon-neutral-200)   → border: var(--falcon-border-width-1, 1px) solid ...
- min-width: 30px                                     → /* tracks --spacing-7.5 */ min-width: 1.875rem
- padding: 0 8px                                      → padding: 0 var(--spacing-2, 0.5rem)
- padding: 0 10px                                     → /* tracks --spacing-2.5 */ padding: 0 0.625rem
- font-size: 14px                                     → font-size: var(--text-sm, 0.875rem)
- transition: ... 150ms                               → transition: ... var(--duration-falcon-base, 150ms)
```

---

## Per-file migration mapping (apps/host-shell)

### `error.component.ts` (inline `styles: []`)
```diff
- background: linear-gradient(135deg, #f4f7fb 0%, #e7eef9 100%)
+ background: linear-gradient(135deg, var(--color-falcon-neutral-50, #f4f7fb) 0%, var(--color-falcon-neutral-100, #e7eef9) 100%)
- padding: 2rem                                       → padding: var(--spacing-6, 2rem)
- color: #1f2937                                      → color: var(--color-falcon-neutral-925, #1f2937)
- color: #4b5563                                      → color: var(--color-falcon-neutral-750, #4b5563)
- background: #1d4ed8                                 → background: var(--color-falcon-teal-700, #0d3f44)
- color: #ffffff                                      → color: var(--color-falcon-neutral-0, #ffffff)
- border-radius: 1rem                                 → border-radius: var(--radius-lg, 1rem)
- box-shadow: 0 1.5rem 3rem rgba(...)                 → box-shadow: var(--shadow-falcon-md, ...)
- font-size: 2rem                                     → font-size: var(--text-3xl, 2rem)
- border-radius: 999px                                → border-radius: var(--radius-full, 999px)
```

### `unauthorized.component.ts` (inline `styles: []`)
Similar token swaps as error.component.ts.

### `topbar.component.html` (17 leaks)
```diff
- size-[38px] rounded-[10px]            → size-[var(--falcon-size-control-lg,2.375rem)] rounded-card
- leading-[1.2]                         → leading-falcon-tight
- gap-[18px]                            → gap-4.5
- size-[7px]                            → size-1.75
- h-[30px]                              → h-7.5
- text-[13px] font-semibold text-falcon-neutral-900 leading-[1.3]
+ text-xs-3 font-semibold text-falcon-neutral-900 leading-falcon-snug
- text-[11px] font-medium text-falcon-neutral-600 leading-[1.3]
+ text-2xs font-medium text-falcon-neutral-600 leading-falcon-snug
- top-[calc(100%+8px)] w-[260px] z-[200] rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.15)]
+ top-[calc(100%+var(--spacing-2))] w-[260px] z-falcon-menu rounded-pane shadow-falcon-menu-deep
- rounded-[10px] (menu-head)            → rounded-card
- p-[3px] (mood-toggle pill)            → p-0.75
```

### `sidebar.component.html` (2 leaks)
```diff
- tracking-[0.04em] (sidebar-logo)      → tracking-section-label
- tracking-[0.06em] (brand text)        → tracking-brand-emphasis
```

### `sidebar.component.ts` (4 leaks in class-string templates)
```diff
- text-[11px] font-medium text-white/40 tracking-[0.02em]
+ text-2xs font-medium text-white/40 tracking-wide-1
- text-[13px] font-medium leading-[1.3]
+ text-xs-3 font-medium leading-falcon-snug
- size-[22px]                           → size-5.5
- py-[9px]                              → py-2.25
```

### `otp-dialog.component.html` (19 leaks; many are inline `style` attrs intentionally bypassing Tailwind JIT)
```diff
- text-[28px]                           → text-xl
- text-[13px]                           → text-xs-3
```
The font-size inline-style attrs (`font-size: 40px`, `font-size: 18px`, etc.) are intentional bypasses per the existing comment "Inline width/font-size styles bypass Tailwind arbitrary-value JIT misses." They can be left as-is OR converted to `style="font-size: var(--text-...)"`.

### `user-details-page.component.html` (9 leaks)
```diff
- text-[11px] text-falcon-red-500       → text-2xs text-falcon-red-500
- text-[13px] font-medium                → text-xs-3 font-medium
- text-[13px] font-semibold text-falcon-neutral-900 uppercase tracking-wide
+ text-xs-3 font-semibold text-falcon-neutral-900 uppercase tracking-wide
- text-[14px] (arrow-left)              → text-sm
- text-[15px] font-semibold text-falcon-neutral-900
+ text-sm-3 font-semibold text-falcon-neutral-900
```

### `not-found.component.html` (1 leak)
```diff
- shadow-[0_4px_20px_rgba(0,0,0,0.08)]  → shadow-falcon-card-soft
```

### `organization-hierarchy-tree.component.ts` (1 leak)
```diff
- class: 'block w-[272px] h-full min-h-0 shrink-0'
+ class: 'block w-clients h-full min-h-0 shrink-0'
```

---

## Per-file migration mapping (libs/falcon shared-ui)

### `falcon-tree-panel.component.html` (4 leaks)
```diff
- rounded-[14px]                          → rounded-pane
- text-[10px] (initials chip + ellipsis)  → text-3xs
- text-[15px] (display name)              → text-sm-3
```

### `falcon-tree-node.component.html` (5 leaks)
```diff
- text-[8px] (chevron)                   → text-4xs-half
- text-[9px] (initials)                   → text-4xs
- w-[22px] h-[22px] (node-mini)          → w-5.5 h-5.5
- text-[13px] leading-[1.4]              → text-xs-3 leading-falcon-normal
- w-[22px] h-[22px] (row-action)         → w-5.5 h-5.5
- text-[10px] (ellipsis)                  → text-3xs
```

### `falcon-tree-panel.component.ts` (1 leak)
```diff
- [&_::-webkit-scrollbar-thumb]:rounded-[3px]   → [&_::-webkit-scrollbar-thumb]:rounded-2xs
```

### `falcon-photo-uploader.component.html` (3 leaks)
```diff
- leading-[1.3]                         → leading-falcon-snug
- h-[34px] px-[18px] text-[12.5px]      → h-[var(--falcon-size-control-md,2.125rem)] px-4.5 text-xs-half
```

### `falcon-form-field.component.html` (2 leaks)
```diff
- leading-[1.3]                         → leading-falcon-snug
```

### `falcon-view-toggle.component.html` (1 leak)
```diff
- text-[12px]                           → text-xs
```

---

## Helpers to extract (when auto-revert paused)

Two recurring patterns observed across `settings-tab` + `info-panel` + 5 wizard-step state slices:

### `createModeStateSlice(initial = 'loading')` — drop in `libs/falcon/src/shared-utils/lib/state/mode-state.signals.ts`
```typescript
import { computed, signal, type Signal, type WritableSignal } from '@angular/core';

export type FalconModeState = 'loading' | 'view' | 'edit' | 'error';

export interface FalconModeStateSlice {
  readonly mode: WritableSignal<FalconModeState>;
  readonly error: WritableSignal<string | null>;
  readonly submitting: WritableSignal<boolean>;
  readonly isLoading: Signal<boolean>;
  readonly isView: Signal<boolean>;
  readonly isEdit: Signal<boolean>;
  readonly isError: Signal<boolean>;
  setLoading(): void;
  setView(): void;
  setEdit(): void;
  setError(message: string): void;
  setSubmitting(value: boolean): void;
}

export function createModeStateSlice(initial: FalconModeState = 'loading'): FalconModeStateSlice {
  const mode = signal<FalconModeState>(initial);
  const error = signal<string | null>(null);
  const submitting = signal<boolean>(false);
  return {
    mode, error, submitting,
    isLoading: computed(() => mode() === 'loading'),
    isView:    computed(() => mode() === 'view'),
    isEdit:    computed(() => mode() === 'edit'),
    isError:   computed(() => mode() === 'error'),
    setLoading() { mode.set('loading'); error.set(null); },
    setView()    { mode.set('view');    error.set(null); },
    setEdit()    { mode.set('edit');    error.set(null); },
    setError(message: string) { mode.set('error'); error.set(message); },
    setSubmitting(value: boolean) { submitting.set(value); },
  };
}
```

### `createFormSnapshot<T>(initial)` — drop in `libs/falcon/src/shared-utils/lib/state/form-snapshot.ts`
```typescript
import { computed, signal, type Signal, type WritableSignal } from '@angular/core';

export interface FalconFormSnapshot<T extends Record<string, unknown>> {
  readonly formValue: WritableSignal<T>;
  readonly snapshot: WritableSignal<T>;
  readonly isDirty: Signal<boolean>;
  update(patch: Partial<T>): void;
  set(next: T): void;
  setSnapshot(value?: T): void;
  discard(): void;
}

export function createFormSnapshot<T extends Record<string, unknown>>(initial: T): FalconFormSnapshot<T> {
  const formValue = signal<T>(initial);
  const snapshot = signal<T>(initial);
  return {
    formValue, snapshot,
    isDirty: computed(() => JSON.stringify(formValue()) !== JSON.stringify(snapshot())),
    update(patch: Partial<T>) { formValue.update((cur) => ({ ...cur, ...patch })); },
    set(next: T) { formValue.set(next); },
    setSnapshot(value?: T) { snapshot.set(value ?? formValue()); },
    discard() { formValue.set(snapshot()); },
  };
}
```

### Barrel export — `libs/falcon/src/shared-utils/lib/state/index.ts`
```typescript
export * from './mode-state.signals';
export * from './form-snapshot';
```

### Main lib barrel — append to `libs/falcon/src/shared-utils/index.ts`
```typescript
export * from './lib/state';
```

---

## Pre-existing bugs surfaced

1. **`falcon-org-node-context-card.component.ts:231`** — `'var(--falcon-teal-700, #0d6e6e)'` references non-existent CSS var; canonical token is `--color-falcon-teal-700` with hex `#0d3f44`. Fix in the migration.
2. **`apps/management-console/.../falcon-org-node-drawer/models/models.ts:7`** — relative path `'../../../../models/models'` is one level short (should be `'../../../../../models/models'`). This is a port-typo from admin-console donor that was previously masked by build caching. Already applied in W10 and confirmed both downstream TS errors clear together.

---

## How to replay this migration

1. **Pause the auto-revert mechanism** (same step described in the Wave 17 + Wave 15b memory entries — user-level action).
2. Read this playbook.
3. For each file in the per-file table above, apply the listed substitutions.
4. After each app's worth of changes, run `npx nx build {app}` — should be GREEN at every step (all target tokens already exist in SSOT).
5. Re-add the helpers (createModeStateSlice + createFormSnapshot) to `libs/falcon/src/shared-utils/lib/state/` (new folder) and re-export from `libs/falcon/src/shared-utils/index.ts`.
6. Re-run final 3-app build verification.
7. Commit + push.

Total mechanical scope: ~80 files, ~600 substitutions, ~15 minutes of focused work with the revert paused.

---

---

## Additional scope discovered by deep-drill rescan

### libs/falcon-studio (designer-tool internals)

The Studio uses arbitrary-value classes pervasively. **The Studio's own `WAVE-6A-AUDIT-REPORT.md`** already inventories ~50 leak sites with proposed token mappings — that audit predates NS-1 + NS-2 and most of its proposed tokens (`--text-3xs`, `--text-4xs`, `--falcon-size-control-*`, `--radius-2xs`, `--falcon-leading-snug`) are now present in the SSOT.

**Action for replay**: read `libs/falcon-studio/WAVE-6A-AUDIT-REPORT.md` + `STUDIO-WAVES-PLAN.md`; apply substitutions per its table using the NS-1 + NS-2 tokens. Specific files:

| File | Leaks | Mapping |
|---|---|---|
| `loader-studio.component.html` | text-[12px], text-[10.5px], text-[11px], text-[13px], tracking-[0.08em], min-h-[88px], min-h-[42px] | `text-xs`, `text-3xs-half`, `text-2xs`, `text-xs-3`, `tracking-allcaps`, layout-specific (keep arbitrary) |
| `falcon-studio-slider.component.ts` | text-[11px] | `text-2xs` |
| `falcon-studio-color-picker.component.ts` | text-[10px] (×2) | `text-3xs` |
| `loader-studio.component.html` z-[2100]/[2110]/[2200] | layout-specific (Studio's own stacking) | keep arbitrary OR add `--z-falcon-studio-overlay: 2100`, `--z-falcon-studio-toast: 2200` |

### `apps/{host-shell,admin-console}/src/tailwind.css` — `@source inline()` safelist entries

These are **Tailwind v4 safelists** that force the JIT to emit utilities for arbitrary-value classes (`leading-[1.3]`, `rounded-[10px]`, `text-[12.5px]`, etc.) even when they don't appear in scanned source. They mirror exactly the arbitrary values that consumer files use. Once the consumer migrations land, these safelist entries become deletable — but **do NOT delete them before all consumers are migrated** or Tailwind will skip generating the utility and the design will break.

**Safelist clean-up sequence** (after consumer migrations land):

```diff
- @source inline("leading-[1.3]");
- @source inline("leading-[1.2]");
- @source inline("text-[13px]");
- @source inline("rounded-[10px]");
- @source inline("text-[12.5px]");
- @source inline("leading-[1.4]");          (admin-console only)
- @source inline("focus-visible:rounded-[4px]");
- @source inline("text-[10px]");             (host-shell only)
- @source inline("text-[11px]");             (host-shell only)
```

The `focus-visible:rounded-[4px]` safelist entry corresponds to `rounded-xs` (4px = `--radius-xs`), so the canonical fix in consumer files (`libs/falcon-ui-core/src/tailwind/tooltip-tailwind-classes.{ts,js}:13`) is:

```diff
-    'focus-visible:rounded-[4px] ' +
+    'focus-visible:rounded-xs ' +
```

### libs/falcon-ui-core Stencil sources (33 files / 90+ leaks)

These are the Falcon design-system primitives — every app consumes them. The high-density ones (substitutions identical to admin-console patterns; only files differ):

| File | Leaks | Top substitutions |
|---|---|---|
| `falcon-insufficient-balance-dialog-tw.tsx` | 9 | `w-[22px] h-[22px]` → `w-5.5 h-5.5`; `text-[13px]` → `text-xs-3`; `text-[18px]` → `text-md-half`; `leading-[1.5]` → `leading-falcon-relaxed`; `text-[12.5px]` → `text-xs-half`; `text-[12px]` → `text-xs`; `px-[18px] py-[10px] text-[14px]` → `px-4.5 py-2.5 text-sm` |
| `falcon-alert-dialog-tw.tsx` | 4 | `w-[56px] h-[56px]` → `w-14 h-14`; `text-[18px]` → `text-md-half`; `text-[13px] leading-[1.5] max-w-[460px]` → `text-xs-3 leading-falcon-relaxed max-w-[460px]`; `px-[18px] py-[10px] text-[14px]` → `px-4.5 py-2.5 text-sm` |
| `falcon-confirm-dialog-tw.tsx` | 2 | `text-[13px]` → `text-xs-3` |
| `falcon-checkbox-group-tw.tsx`, `falcon-radio-group-tw.tsx` | 1 each | `text-[13px]` → `text-xs-3` |
| `falcon-password-tw.tsx` | 1 | `text-[14px]` → `text-sm`; `h-[3px]` → `h-0.75`; `gap-[3px]` → `gap-0.75` |
| `falcon-tag.component.ts` (Angular wrapper) | 3 | `'h-4 px-2 text-[10px]'` → `'h-4 px-2 text-3xs'`; `'h-6 px-3 text-[13px]'` → `'h-6 px-3 text-xs-3'`; `'h-5 px-2.5 text-[11px]'` → `'h-5 px-2.5 text-2xs'` |
| `falcon-card.component.ts` (Angular wrapper) | 2 | `'rounded-md text-[13px]'` → `'rounded-md text-xs-3'`; `'rounded-[14px] text-[15px]'` → `'rounded-pane text-sm-3'` |
| `falcon-custom-table-footer.component.html` | 2 | `text-[12px]` → `text-xs` |
| `falcon-completion-success-dialog.component.html` | 2 | `rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.18)]` → `rounded-modal shadow-falcon-modal-deep`; `text-[22px]` → `text-lg-half` |
| `falcon-sending-credentials-dialog.component.html` | 5 | `rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.18)]` → `rounded-modal shadow-falcon-modal-deep`; `rounded-[14px]` → `rounded-pane`; `text-[13px]` → `text-xs-3`; `w-[18px] h-[18px]` → `w-4.5 h-4.5`; `h-[130px]` → layout-specific (keep arbitrary) |

**Important about `.js` files in `libs/falcon-ui-core`**: the `.js` siblings of every `.tsx` and `-tailwind-classes.ts` are **auto-generated build outputs**. Editing them is wasted — they regenerate from source on next Stencil build. ONLY edit `.tsx` / `.ts` sources; the `.js` rebuild picks up the change.

---

## NS-2 final state

| Artifact | Path | Persisted |
|---|---|---|
| SSOT token expansion (~40 tokens) | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | ✅ verified via `git diff` |
| Comprehensive migration playbook | `Brain Outputs/reports/night-shift-NS-1-NS-2/TOKEN-MIGRATION-PLAYBOOK.md` | ✅ this file |
| Halt-flag: SCSS demolition deferred | `Brain Outputs/datasets/authority-dataset/_pending-questions/night-shift-2026-05-18-W5-scss-demolition.md` | ✅ |
| Halt-flag: mgmt-console TS path RESOLVED | `Brain Outputs/datasets/authority-dataset/_pending-questions/night-shift-2026-05-18-W10-management-console-tspath.md` | ✅ |
| Memory entry | `~/.claude/projects/C--Falcon/memory/project_night_shift_static_value_token_migration_2026_05_18.md` | ✅ |
| Apps + libs/falcon shared-ui migrations | (auto-reverted) | ❌ replay via this playbook |
| `createModeStateSlice` + `createFormSnapshot` helpers | (auto-reverted) | ❌ source code in the helpers section above; re-add when replaying |

## Sources

- `libs/falcon-theme/src/falcon-tailwind-tokens.css` — canonical SSOT (token additions verified persisted via `git diff`)
- `libs/falcon-studio/WAVE-6A-AUDIT-REPORT.md` — pre-existing Studio token audit (now uses NS-1/NS-2 tokens)
- `libs/falcon-studio/STUDIO-WAVES-PLAN.md` — Studio migration sequencing
- Audit traversal commands:
  - `grep -rohE "text-\[[0-9.]+px\]" apps libs --include="*.ts" --include="*.html" --include="*.tsx" | sort -u`
  - `grep -rohE "(rounded|gap|p[xy]?|m[xytlrb]|w|h|size|min-w|min-h|max-w|max-h)-\[[0-9]+px\]" apps libs --include="*.ts" --include="*.html" --include="*.tsx" | sort -u`
  - `grep -rohE "leading-\[[0-9.]+\]|tracking-\[-?[0-9.]+(em|px)\]" apps libs --include="*.ts" --include="*.html" --include="*.tsx" | sort -u`
  - `grep -rohE "z-\[[0-9]+\]|shadow-\[[^]]+\]" apps libs --include="*.ts" --include="*.html" --include="*.tsx" | sort -u`
- Session transcripts: night-shift Wave NS-1 + NS-2 (2026-05-18)
- Wave 17 + Wave 15b memory entries — auto-revert mechanism behavior + workaround
