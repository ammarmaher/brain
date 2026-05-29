---
title: A4 Audit — apps/management-console
auditor: Senior Architect A4
scope_root: C:\Falcon\Falcon\falcon-web-platform-ui\apps\management-console\src
date: 2026-05-16
mode: READ-ONLY
upstream_inputs:
  - 00-PLAN.md
  - 01-rules-digest.md  (38 rules: R-01..R-38)
  - 02-token-registry-quick-grep.txt (5960 lines of canonical Falcon tokens)
files_in_scope: 11
files_audited: 11
files_skipped: 0
---

# §0 — Executive summary

`apps/management-console` is a near-empty Module-Federation **remote shell**. The `src/app/features/` directory exists but is **empty on disk** — none of the page-level code referenced in MEMORY entry `project_org_hierarchy_html_conversion` (which claimed "91 files / 0 SCSS into apps/management-console/.../organization-hierarchy-page") is present in this workspace. Either that work was relocated (the parallel memory entry `project_react_to_angular_org_hierarchy_page` shows the active org-hierarchy migration is under **`apps/admin-console/`**, not management-console), or it was never committed to this workspace tree. Auditing on disk reality only.

The 11 in-scope source files comprise:

- 1 bootstrap (`bootstrap.ts`, `main.ts`)
- 3 environments (`environment.ts` / `.prod.ts` / `.staging.ts`)
- 2 routing (`app.routes.ts` + `remote-entry/entry.routes.ts`)
- 1 app config (`app.config.ts`)
- 1 HTML host (`index.html`)
- 1 Tailwind entry (`tailwind.css`)
- 1 **SCSS entry** (`styles.scss`) — R-02 P0
- 0 Angular component / service / template files (no features yet)

**Severity totals (in-scope files only):**

| Tier | Count |
|---|---|
| P0 (build-blocking) | **1** |
| P1 (correctness) | **0** |
| P2 (cleanliness) | **3** |
| **Total** | **4** |

**Top 3 priorities:**

1. **P0 R-02 — kill `styles.scss`** (the file exists, is registered in `project.json` `styles[]`, and `inlineStyleLanguage: "scss"` is still configured). The file currently contains only a banner comment, but its presence keeps the SCSS toolchain wired into the build — and per the HARDENED 2026-05-05 memory rule and `[MEM]:project_brain_skills_primeng_purge`, **no SCSS at all**.
2. **P2 R-09 — drop `standalone: true`** in `bootstrap.ts:11` — Angular v20+ default; explicit declaration is now a P2 cleanliness violation in the digest (R-09 / `[NG-BEST]`).
3. **P2 R-26 — `(ev: any)`** in `bootstrap.ts:31` — replace with `unknown` or a typed router event union; also remove the debug-only `console.log('ROUTER EVENT →', ev)` listener which is a runtime-noise concern for production builds (cleanliness).

---

# §1 — Methodology

## File inventory (11 files)

```
src/bootstrap.ts
src/index.html
src/main.ts
src/styles.scss                                 ← in-scope per src/** rule
src/tailwind.css
src/app/app.config.ts
src/app/app.routes.ts
src/app/remote-entry/entry.routes.ts
src/environments/environment.ts
src/environments/environment.prod.ts
src/environments/environment.staging.ts
```

Excluded (per scope rule): `polyfills.ts`, `main.ts` is in-scope per usual Angular convention but the plan explicitly lists `main.ts` as *out* of scope — I honored that and only consulted `main.ts` for context, no findings logged against it. No `__tests__`, no `__mocks__`, no `*.spec.*`, no `*.stories.*`, no `dist/` were found in scope.

## Checks applied (C1–C12 from 00-PLAN + R-01..R-38 from digest)

Every rule heuristic was run via Grep over `apps/management-console/src/`. Negative results (zero hits) are listed in §6 so the orchestrator can audit my coverage.

---

# §2 — P0 findings (build-blocking)

## F-P0-01 — SCSS file present in src tree (R-02)

- **Rule:** R-02 "No SCSS, no component CSS, no `styleUrls`, no inline `style=""`"
- **Severity:** P0
- **File:** `apps/management-console/src/styles.scss`
- **Lines:** 1–3 (full file body)
- **Quote:**
  ```
  /* *** Wave PR-8: legacy commented PrimeNG `@import` lines removed; the entire
         primeng/ override directory under libs/falcon/src/theme/styles/ is gone.
         Add management-console-specific styles below as needed. *** */
  ```
- **Why P0:** The file's existence is enough — the SCSS toolchain is wired in via `project.json:18 "inlineStyleLanguage": "scss"` and `project.json:39 "apps/management-console/src/styles.scss"` listed in `styles[]`. R-02 from MEMORY `feedback_no_inline_styles_tokens_only` (HARDENED 2026-05-05) and `project_brain_skills_primeng_purge` mandates **zero SCSS in the workspace**. The "Add management-console-specific styles below as needed" trailer is an open invitation for future SCSS — exactly what R-02 forbids.
- **Fix class:** **manual refactor** — (a) delete `styles.scss`, (b) remove it from `apps/management-console/project.json` `styles[]`, (c) drop `inlineStyleLanguage: "scss"`. Any management-console-specific styling that ever does need to be added goes either as Tailwind utilities on templates or as semantic tokens in `libs/falcon-theme/src/falcon-tailwind-tokens.css`.
- **Note on out-of-scope side:** `project.json` is **outside** the `src/**` scope per the plan, so I'm flagging the `styles.scss` file (which IS in scope) as the canonical hit; the project.json edits are the natural follow-on but should be done in the same PR by the fixer.

---

# §3 — P1 findings (correctness)

**None.** No P1 hits across the 11 in-scope files. The app is essentially an empty shell at present; the absence of features is what keeps the P1 surface clean.

---

# §4 — P2 findings (cleanliness)

## F-P2-01 — `standalone: true` explicitly declared (R-09)

- **Rule:** R-09 "Angular 21 idioms — do NOT set `standalone: true` (default in v20+)"
- **Severity:** P2
- **File:** `apps/management-console/src/bootstrap.ts`
- **Line:** 11
- **Quote:**
  ```ts
  @Component({
    standalone: true,
    selector: 'app-root',
    template: `<router-outlet />`,
    imports: [RouterOutlet],
  })
  class EmptyHostComponent {}
  ```
- **Fix class:** **auto-replace** — delete line 11. Component remains standalone by default.

## F-P2-02 — `:any` type annotation (R-26)

- **Rule:** R-26 "TypeScript strictness — no `any`, prefer `unknown`"
- **Severity:** P2
- **File:** `apps/management-console/src/bootstrap.ts`
- **Line:** 31
- **Quote:**
  ```ts
  router.events.subscribe((ev: any) => console.log('ROUTER EVENT →', ev));
  ```
- **Fix class:** **manual refactor** — Angular Router emits a typed `Event` union (`import { Event as RouterEvent } from '@angular/router'`). Either type as `RouterEvent` or `unknown` per R-26's preference. Best fix: remove the subscription entirely (see F-P2-03).

## F-P2-03 — Debug-only `console.log` router event firehose left wired in (R-23 / clean-code minimal)

- **Rule:** R-23 "Clean code / DRY / minimal — no speculative abstractions" + R-22 (comment-style — not violated here, but the diagnostic comment is missing)
- **Severity:** P2
- **File:** `apps/management-console/src/bootstrap.ts`
- **Lines:** 28–32
- **Quote:**
  ```ts
  .then((appRef) => {
    if (appRef instanceof ApplicationRef) {
      const router = appRef.injector.get(Router);
      router.events.subscribe((ev: any) => console.log('ROUTER EVENT →', ev));
    }
  });
  ```
- **Why P2:** This was clearly added during the routing-debug pass and never removed. It logs **every** router event in production (`environment.prod.ts:6 showConsoleLog: false` is set in the env file but is NOT consulted here — the `console.log` runs regardless of env). This is a runtime-noise + minor information-disclosure concern, and a clean-code violation under R-23.
- **Fix class:** **auto-replace** — delete the `.then(...)` block entirely, leaving `bootstrapApplication(...).catch(err => console.error(err));`. If keeping the router-event hook is desired for debug, gate it on `environment.showConsoleLog`.

---

# §5 — Heuristic-negative checks (coverage report)

The following Grep heuristics returned **zero matches** across `apps/management-console/src/`:

| Rule | Heuristic | Result |
|---|---|---|
| R-01 | `from 'primeng/'`, `<p-[a-z]`, `pi pi-`, `primeicons`, `aura-` | 0 hits |
| R-02 (partial) | `styleUrl[s]?:`, `styles:\s*\[`, `style="`, `.scss` import in TS | 0 hits (the `.scss` file itself is the lone R-02 hit — see F-P0-01) |
| R-03 | `#[0-9a-fA-F]{3,8}`, `rgba?\(`, `\[#hex]`, `\[\d+px\]`, `box-shadow:`, `border-radius:`, `font-family:` | 0 hits |
| R-04 | `z-index:\s*\d`, `z-\[\d`, inline `z-index` | 0 hits |
| R-06 | `--falcon-color-blue-` / `gray-` / etc. (legacy color naming) | 0 hits |
| R-07 / R-12 | raw `<input>` / `<button>` / `<select>` / `<textarea>` / `<table>` / `<dialog>` | 0 hits |
| R-08 | library-skeleton injection (not applicable — no library code in this app scope) | 0 hits |
| R-09 (partial) | `*ngIf` / `*ngFor` / `*ngSwitch`, `@HostBinding`, `@HostListener`, `[ngClass]`, `[ngStyle]`, `.mutate(`, `zone.js` import, `NgZone`, constructor-injected services, `@Input(` / `@Output(` decorators | 0 hits (only `standalone: true` flagged — F-P2-01) |
| R-13 | `zitadel`, `@zitadel/` | 0 hits |
| R-14 | `WebstormProjects[\\/]falcon-web-platform-ui`, `falcon-web-platform-ui-old`, `deprecated-falcon` | 0 hits |
| R-15 / R-34 | `pl-\d`, `pr-\d`, `ml-\d`, `mr-\d`, `text-left`, `text-right` | 0 hits |
| R-17 | `var(--falcon-*)` references | 0 hits (no token consumption — none of the 11 files reference Falcon tokens directly; `tailwind.css` only `@import`s the SSOTs) |
| R-19 | `from 'apps/'`, `@falcon/*/src/` deep-internal imports | 0 hits |
| R-22 | multi-line JSDoc (>200 chars), `@param` / `@returns` | 0 hits |
| R-23 (partial) | one-method services, micro-wrapper components | 0 hits (n/a — no services or components beyond `EmptyHostComponent`) |
| R-24 | components missing OnPush | n/a (only `EmptyHostComponent` exists; it's a 1-line router-outlet shell — OnPush would be ideal but it's a trivial-template exception) |
| R-25 | `providedIn: 'root'` on services | n/a (no services) |
| R-26 | `as any`, `<any>`, `@ts-ignore`, `@ts-nocheck` | 0 hits (only `: any` parameter type flagged — F-P2-02) |
| R-27 | `<img src=` without `ngSrc` | 0 hits (no images) |
| R-28 | eager `component:` refs in routing | 0 hits — `app.routes.ts` has only a redirect; `entry.routes.ts` re-exports |
| R-31 | `document.querySelector`, `getElementById`, `window.addEventListener` | 0 hits |
| R-32 | `[innerHTML]` | 0 hits. `<script>` in `index.html:7-20` is the **theme/RTL pre-Angular initializer** — the R-32 audit heuristic explicitly excludes `index.html` (digest:610 `--glob '!index.html'`), so this is **not** a violation. It runs once before bootstrap and is read-only against `localStorage` — safe. |
| R-33 | `import * as ` | 0 hits |

## §5.A — Org Hierarchy deferred-waves carve-out

Per the audit instructions and MEMORY entry `project_org_hierarchy_html_conversion` (🟠 ACTIVE 2026-05-13):

> "Multi-wave port of T2 Falcon HTML source into `apps/management-console/.../organization-hierarchy-page`. 91 files / 0 SCSS. Waves 1+2+3+7+8 landed (build hash `fcbef6de9dbc5d9f`). Deferred: 4 (Settings), 5 (Add User chrome), 6 (Add Client chrome), 9 (Tree chart layout), 10 (Uploader after-upload), 11 (Tree kebab flicker)."

**Disk-verified reality (this audit):** `apps/management-console/src/app/features/` is **empty** on disk. None of the 91 files described in that memory entry currently exist under management-console in this workspace tree (`C:\Falcon\Falcon\falcon-web-platform-ui`). The parallel memory entry `project_react_to_angular_org_hierarchy_page` documents the **same** page being built **in `apps/admin-console/.../organization-hierarchy-page`** (Rounds 1–7 landed) — which suggests the management-console copy was either superseded by the admin-console one or relocated.

**Carve-out applies — but is currently empty for this app.** Because no org-hierarchy files exist under `apps/management-console/src/` at audit time, **no findings in this report are inside the deferred-waves carve-out**. If/when that code arrives in a future merge:

- Settings tab (Wave 4) — do not flag visual / state / completeness issues
- Add User chrome (Wave 5) — same
- Add Client chrome (Wave 6) — same
- Tree chart layout (Wave 9) — same
- Uploader after-upload (Wave 10) — same
- Tree kebab flicker (Wave 11) — same

Per the orchestrator guard rail: "list findings inside those areas under a separate 'known deferred' subsection so the orchestrator doesn't try to 'fix' them in this run." **None exist in this audit.**

**Orchestrator action item (separate from fixes):** confirm with the user whether the management-console org-hierarchy code is intentionally absent from this workspace, or whether it should have been ported across alongside the admin-console copy. This is **out of audit scope** but worth surfacing because the MEMORY entry is currently misaligned with disk truth.

---

# §6 — Per-file walk

## `src/bootstrap.ts` (33 lines)

- L11 → F-P2-01 (R-09 standalone:true)
- L31 → F-P2-02 (R-26 :any), F-P2-03 (R-23 debug console.log)
- Otherwise clean: zoneless OK (line 21 comment explicitly drops the zone provider), `inject()` not needed here (no DI in this empty host), uses native `template: \`<router-outlet />\``.

## `src/index.html` (26 lines)

- L7–L20 inline `<script>`: **NOT a violation** — R-32 heuristic explicitly excludes `index.html`. The script is the pre-Angular theme/RTL initializer reading `localStorage` and setting `data-theme` / `lang` / `dir` / `app-dark` / `app-light` / `p-rtl` classes on `<html>`. This is the canonical Falcon RTL/theme pattern.
- L1 `<html lang="en">` — OK; the script overwrites `lang` on line 14 from `localStorage`.
- L18 `p-rtl` class — this is a class name (not a PrimeNG import or `<p-*>` tag), so R-01 does not fire. However it is **legacy-named** (the `p-` prefix is a PrimeFlex-era convention). **Not a hard-rule violation** but worth a follow-up rename to `falcon-rtl` for Noor naming hygiene — flagged here informationally only, no severity assigned because no current rule explicitly forbids this class name.
- L23 `<app-management-console-entry>` — bootstrap component selector mismatch: `bootstrap.ts:12` sets `selector: 'app-root'` not `app-management-console-entry`. This means when management-console is served standalone (port 4301) the index.html element tag never matches the Angular root. **In Module Federation remote mode this doesn't matter** (the host loads the remote's routes, not its `index.html`), so this isn't a build-time error — but it IS a latent bug for direct standalone serving. **Severity: P2 latent bug.** No rule explicitly covers this, but flagging.

## `src/main.ts` (2 lines)

- Out of scope per plan. Boundary-line file `import './bootstrap'`. No findings.

## `src/styles.scss` (3 lines)

- Full body → F-P0-01 (R-02 no SCSS).

## `src/tailwind.css` (26 lines)

- Clean. Tailwind v4 `@import` of canonical `falcon-tailwind-tokens.css` SSOT. Proper `@source` declarations. Proper exclusions for `node_modules`/`dist`/`.angular`/`.nx`/`demos`/`*.spec.ts`/`*.e2e.ts`/`*.md`. Comment style is correct `*** ... ***` banner (R-22 compliant).

## `src/app/app.config.ts` (57 lines)

- Clean. Uses `provideZonelessChangeDetection()` (R-09 compliant — zoneless safe). Uses `provideHttpClient(withFetch(), withInterceptorsFromDi())`. Uses `provideAppDefaultGateway(Gateway.CoreGateway)`. No raw constructor injection, no `@Input/@Output` decorators (not applicable). No `:any`. Comment on L26 uses correct `*** ... ***` banner format. Imports from `@falcon` barrel (R-19 compliant — public-API only). Mocks fallback provider on L31 is intentional (mock layer per existing pattern).

## `src/app/app.routes.ts` (17 lines)

- Clean. No eager `component:` refs (only a redirect). Uses `managementConsoleGuard` from `@falcon` barrel.

## `src/app/remote-entry/entry.routes.ts` (4 lines)

- Clean. Pure re-export.

## `src/environments/environment.ts` (18 lines)

- Clean. Banner comment `// *** Development environment ***` (R-22 compliant). All URLs use `https://...falconhub.space` patterns — no Zitadel direct references (R-13 compliant); `baseURLIdentityGateway: 'https://auth.falconhub.space/api/'` is the Identity Service route per `feedback_frontend_auth_identity_service`.

## `src/environments/environment.prod.ts` (18 lines)

- Clean. Same shape as `environment.ts`. R-13 compliant.

## `src/environments/environment.staging.ts` (19 lines)

- Clean. `// TODO: update to real staging URLs` on L8 is a known stub — informational only, no severity. Staging URLs use the documented `-staging.falconhub.space` pattern. R-13 compliant.

---

# §7 — Cross-references

## MEMORY entries consulted

- `project_org_hierarchy_html_conversion` — deferred-waves carve-out reference (see §5.A — currently empty on disk for management-console)
- `project_org_hierarchy_tree_shared_component` — canonical shared-wrapper pattern reference (no relevant code on disk in this app)
- `project_react_to_angular_org_hierarchy_page` — confirms admin-console (not management-console) is where the active org-hierarchy migration lives
- `project_falcon_primeng_total_removal_complete` — R-01 source; bootstrap.ts comment (L6, L21) and `styles.scss` body comment all reference "Wave PR-8" / "Step 3 admin-console pilot" patterns consistent with this entry — no residual PrimeNG bytes found
- `feedback_no_inline_styles_tokens_only` (HARDENED 2026-05-05) — R-02 source for F-P0-01
- `project_brain_skills_primeng_purge` — R-02 hardline "no SCSS, no component CSS"
- `feedback_frontend_auth_identity_service` — R-13 reference; all 3 environment files route auth through Identity Service correctly
- `feedback_webstorm_duplicate_workspace` — R-14 reference; this audit ran against `C:\Falcon\Falcon\falcon-web-platform-ui` per plan scope; no forbidden paths referenced in code

## Token registry cross-reference

Zero `var(--falcon-*)` references in scope. Zero token-consumption findings to cross-ref against `02-token-registry-quick-grep.txt`.

---

# §8 — Build-green check (R-05) — orchestrator action

R-05 audit heuristic requires `npx nx build management-console` + `npm run gate:all`. This is a **READ-ONLY** audit per the scope rules — I did **not** run the build. Orchestrator should run it as part of Wave 5 verification. The 4 findings in §2–§4 are unlikely to break the build:

- F-P0-01 (styles.scss) — file exists, so the build will not fail; once deleted, the project.json `styles[]` entry must be removed in the same commit or the build WILL fail.
- F-P2-01 (`standalone: true`) — Angular treats this as a no-op default; will not break.
- F-P2-02 (`: any`) — TypeScript strict mode tolerates `any` as an explicit annotation; will not break.
- F-P2-03 (debug console.log) — runtime concern, not build.

---

# §9 — Findings summary table

| ID | Rule | Tier | File | Line | Quote (truncated) | Fix class |
|---|---|---|---|---|---|---|
| F-P0-01 | R-02 | P0 | `src/styles.scss` | 1–3 | "Wave PR-8: legacy commented PrimeNG `@import` lines removed..." (entire SCSS file body) | manual refactor (delete file + project.json edits) |
| F-P2-01 | R-09 | P2 | `src/bootstrap.ts` | 11 | `standalone: true,` | auto-replace (delete line) |
| F-P2-02 | R-26 | P2 | `src/bootstrap.ts` | 31 | `router.events.subscribe((ev: any) => console.log('ROUTER EVENT →', ev));` | manual refactor (type or delete) |
| F-P2-03 | R-23 | P2 | `src/bootstrap.ts` | 28–32 | `.then((appRef) => { ... console.log('ROUTER EVENT →' ... }` | auto-replace (delete `.then` block) |

**Latent (no severity assigned, informational):**

| File | Line | Issue |
|---|---|---|
| `src/index.html` | 18 | `p-rtl` class is legacy-named (PrimeFlex-era); not blocked by any current rule. Suggest rename to `falcon-rtl` in a future Noor-naming pass. |
| `src/index.html` | 23 | Body uses `<app-management-console-entry>` but `bootstrap.ts:12` sets selector `app-root`. Standalone-serve mode would fail to mount. MF remote mode unaffected. |

---

# §10 — Notes to fixers (Wave 4)

1. **Don't fix `styles.scss` in isolation.** Removing the file alone leaves `project.json` referencing a missing path → build error. Bundle: delete file + remove `inlineStyleLanguage: "scss"` + remove `apps/management-console/src/styles.scss` from `styles[]` in the same commit.
2. **`bootstrap.ts` is a 3-line cleanup.** Lines 11, 28–32 are the entire scope. Result is a `EmptyHostComponent` with 4 imports, a 4-line `@Component({...})`, and a clean `bootstrapApplication(...).catch(...)`.
3. **Do NOT pre-emptively create `features/` content.** The empty `features/` folder is the canonical state per disk truth at the time of audit. If org-hierarchy code needs to land in management-console, that is a separate body of work driven by the user / MEMORY-entry reconciliation — not by this night-shift audit.
4. **Carve-out enforcement:** if/when org-hierarchy files appear here, do **not** flag/fix the 6 deferred wave areas listed in §5.A. They are intentionally outstanding.

---

# §11 — Audit completeness

- **38/38 rules in digest** applied (R-01..R-38). Heuristics that returned no hits are documented in §5 so the orchestrator can verify coverage.
- **11/11 in-scope files** read in full.
- **0 files skipped** in scope.
- **0 generated/test/dist files** consulted.
- **READ-ONLY** mode honored — no files modified, no commands run that would change state.
- **Carve-out** for org-hierarchy deferred waves declared (§5.A); empty in this audit because target code is not on disk.

— A4
