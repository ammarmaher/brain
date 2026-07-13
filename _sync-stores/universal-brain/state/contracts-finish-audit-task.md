# Task: Contracts & Cost Management — FINISH-AUDIT (Part 1 mask + Part 2 tokenize)

Repo: C:\Falcon\Falcon\falcon-web-platform-ui  (NOTE: two Falcon segments)
Branch: leave dirty, NO commits, NO builds (user rebuilds centrally).
Date: 2026-06-04. Agent: ammar-web-platform-ui.

## Scope
- apps/admin-console/.../features/contracts-cost-management/**
- apps/management-console/.../features/contracts-cost-management/**
- libs/falcon-theme/src/falcon-tailwind-tokens.css  (the @theme SSOT — only token file touched)
HARD: zero new css/scss, no inline style=, Falcon falcon-angular-* only, no PrimeNG,
no service/DTO/validation/route/PES edits, preserve rendered look, mgmt stays view-only.

## Part 1 — KEY FINDING (mask)
All editable number inputs route through Stencil web components that OWN their value pipeline:
- <falcon-angular-input-number> -> falcon-input-number-tw (Intl 3-digit group on blur, raw while
  focused, numbers-only ALREADY enforced at host keydown/beforeinput/paste). NO group-size override.
- <falcon-angular-grid-input> (matrix cells) -> falcon-grid-input-tw -> falcon-input-tw variant=grid.
  String [value]/(falconGridCommit); component .ts parseRate does Number(trimmed) -> NaN on commas
  -> would NULL the wire value if a comma string reached it.
CONCLUSION: the 4-digit-group + 4-decimal display mask CANNOT be cleanly imposed without forking the
shared libs/falcon-ui-core Stencil components (out of scope) OR risking wire value (matrix) OR
breaking the live-verified look / SAR icon-slot composition. -> Build the directive artifact
(group4-number-mask.directive.ts) per spec, DO NOT wire onto Stencil controls, FLAG for user review.
numbers-only is already enforced for input-number by the Stencil component.

## Part 2 — token map (px/literal -> EXISTING utility unless noted)
text-[12px]->text-xs ; [12.5px]->text-xs-half ; [13px]->text-xs-3 ; [13.5px]->text-sm-half ;
[14px]->text-sm ; [15px]->text-sm-3  (all EXISTING --text-* tokens, confirmed used in-repo)
rounded-[8px]->rounded-sm ; [10px]->rounded-card ; [12px]->rounded-md ; [14px]->rounded-surface-xl
px/py/gap-[18px]->*-4.5 (--spacing-4.5) ; my-[10px]->my-2.5 ; px-[22px]->px-5.5 (--spacing-5.5=22px)
w-[40px] h-[40px]->w-7 h-7 (--spacing-7=40px; established avatar convention) ;
w-[32px] h-[32px]->w-6 h-6 (--spacing-6=32px)
w-[160px]->w-40 ; min-w-[12rem]->min-w-48 ; min-w-[5rem]->min-w-20 ; max-w-[360px]->max-w-90
border-[1.5px]->border-[length:var(--falcon-border-width-1-5)] (host-shell safelists this exact form)
min-w-[960px]-> NEW token --spacing-contracts-matrix-min (60rem) -> min-w-contracts-matrix-min
[--sb-icon-size:22px]->var(--falcon-size-icon-xl) NEW 1.375rem ;
[--sb-icon-size:32px]->var(--falcon-size-icon-2xl) NEW 2rem
LEAVE: grid-cols-[1fr_auto] (structural grid, not a px/color literal); riyal glyph content.

## NEW tokens to mint in falcon-tailwind-tokens.css @theme
--falcon-size-icon-xl: 1.375rem; (22px)
--falcon-size-icon-2xl: 2rem;     (32px)
--spacing-contracts-matrix-min: 60rem; (960px) -> generates min-w-contracts-matrix-min

## Status
COMPLETE (Part 2 fully applied; Part 1 directive built + FLAGGED, not wired). NO commits, NO builds.

## What landed
- 3 tokens minted in libs/falcon-theme/src/falcon-tailwind-tokens.css @theme:
  --falcon-size-icon-xl 1.375rem (22px), --falcon-size-icon-2xl 2rem (32px),
  --spacing-contracts-matrix-min 60rem (960px). Braces 36/36 balanced (verified).
- NEW directive apps/admin-console/.../contracts-cost-management/directives/group4-number-mask.directive.ts
  (standalone, framework-pure, TS parse 0 diagnostics). Implements digits-only + single-dot + cap-4-dec
  + comma-every-4 + parsed-number emission/control-write. NOT wired (see flag).
- ALL arbitrary [Npx]/hex/inline-style across BOTH feature folders replaced with token utilities
  (10 html files: admin 7, mgmt 5... actually admin 7 templates + mgmt 5). Final sweep = 0 raw literals.
  Remaining [...] = Angular bindings + structural grid-cols-[1fr_auto] + token-ref [--sb-icon-size:var(...)]
  + border-[length:var(--falcon-border-width-1-5)].

## FLAG for user (Part 1)
The 4-group+4-dec DISPLAY mask cannot be cleanly imposed on the Falcon Stencil number controls
(<falcon-angular-input-number> Intl-3-group re-asserts _display; <falcon-angular-grid-input> string
commit -> component parseRate Number() NaNs on commas -> would NULL the wire). Clean path needs either a
libs/falcon-ui-core Stencil change (out of scope) or swapping cells to <falcon-angular-input type=text>
+ the directive (changes live look + touches wire/validation bridges the brief forbids). numbers-only is
ALREADY enforced for input-number by the Stencil component. committedValue (info-step + edit-step) is a
money form field, not rate/matrix/addon -> scope question flagged.
