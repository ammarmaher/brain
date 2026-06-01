---
name: project-host-shell-ng0201-domrendererfactory2-2026-05-20
description: "host-shell bootstrap NG0201 — DomRendererFactory2 class duplicated by federation, provideAnimationsAsync factory cannot inject it. Diagnosed only, NOT fixed."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7b5d1a5d-1bc4-45f0-b445-a340df592301
---

🔴 DIAGNOSED 2026-05-20. http://localhost:4200 dies on bootstrap with `NG0201 NullInjectorError: No provider for DomRendererFactory2` plus 4 cascading `NG0200` traces.

**Root cause** ([CODE] live capture + bundle inspection 2026-05-20 16:10 IST):
- [CODE] `apps/host-shell/src/app/app.config.ts:74` calls `provideAnimationsAsync('noop')`.
- [CODE] `node_modules/@angular/platform-browser/fesm2022/animations-async.mjs:228` — the factory body is `new AsyncAnimationRendererFactory(inject(DOCUMENT), inject(DomRendererFactory2), inject(NgZone), type)`. Both `'animations'` and `'noop'` modes call all three `inject()`s.
- [CODE] `apps/host-shell/module-federation.config.ts:25-31` excludes `@angular/platform-browser/animations` from federation sharing (comment: "Animations stay local to avoid RUNTIME-006") while [CODE] `:53-62` shares `@angular/platform-browser` as singleton eager.
- [INFERRED] Result: two distinct `DomRendererFactory2` class objects — the SHARED one (registered against `RendererFactory2` by Angular's default bootstrap providers) vs the LOCAL one inside `_dom_renderer_chunk_mjs__WEBPACK_IMPORTED_MODULE_2__` bundled into `apps_host-shell_src_bootstrap_ts.js`. `inject(LOCAL ref)` does not resolve the SHARED registration → NG0201.
- Browser stack pin-points it: `at Object.useFactory (apps_host-shell_src_bootstrap_ts.js:5638:211)` — column 211 lands on `inject(DomRendererFactory2)`. The dev-tools "source link" attributing it to `theme.facade.ts:84` is misleading source-map noise.

**Prior fix attempt** (commit `30b51290 fix(host-shell): provideAnimationsAsync('noop') to resolve NG0201 in zoneless mode (EPV-Z)`, today 16:10) is incorrect — the commit message blames `inject(NgZone)`, but `NgZone` resolves fine as `NoopNgZone` under `provideZonelessChangeDetection`, and 'noop' mode does not change the factory's DI shape.

**Sibling comparison** ([[platform-standards]]):
- host-shell — `provideAnimationsAsync('noop')` — ❌ broken at :4200.
- admin-console — `provideAnimationsAsync()` default — same latent bug, only doesn't surface today because it's served via MF remote, not direct bootstrap. ([CODE] `apps/admin-console/src/app/app.config.ts:36`)
- management-console — does not call it at all — ✅ fine. This is the safe pattern.

**Three fix options** (full detail + diff + validation steps in `C:\Falcon\reports\host-shell-ng0201-domrendererfactory2-2026-05-20.md`):
- **A (recommended)** — drop `provideAnimationsAsync` import + call from host-shell entirely. Match management-console.
- **B** — remove the "keep animations local" filter from `module-federation.config.ts`. Higher-risk; reverts RUNTIME-006 mitigation whose history I couldn't find in the Brain stores.
- **C** — switch to `provideNoopAnimations()` from `@angular/platform-browser/animations` (sync). Caveat: same subpath is also "keep local"-filtered, so the class-dup path could re-emerge.

**NOT applied.** Per [[feedback-never-modify-code-or-commit-2026-05-20]] the user applies code changes themselves.

Related: [[feedback-never-modify-code-or-commit-2026-05-20]] · `reports/host-shell-ng0201-domrendererfactory2-2026-05-20.md` · git commit `30b51290`.
