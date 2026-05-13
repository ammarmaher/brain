# Quality Gates Audit — `tools/gates/gate-NN-*.mjs`

`package.json` declares 12 gate scripts. Each wraps `node tools/gates/gate-NN-*.mjs`. The composite `gate:all` runs 7 of them in sequence.

---

## Composite — `gate:all`

```json
"gate:all": "node tools/gates/gate-01-lint.mjs && node tools/gates/gate-02-typecheck.mjs && node tools/gates/gate-07-token-naming-lint.mjs && node tools/gates/gate-08-hardcoded-value-lint.mjs && node tools/gates/gate-09-a11y-baseline.mjs && node tools/gates/gate-10-noor-naming-lint.mjs && node tools/gates/gate-12-component-token-scope.mjs"
```

`gate:all` runs gates 1, 2, 7, 8, 9, 10, 12 in sequence. Build gates (3-6) and bundle-size gate (11) are NOT in the composite (run independently).

---

## Gate inventory

| # | Script | Purpose | CI behavior | Local behavior | Discoverable pass/fail | Notes |
|---|---|---|---|---|---|---|
| 01 | `gate-01-lint.mjs` | ESLint flat-config — workspace lint with `--max-warnings=0`. In CI, scopes to changed files in git diff `origin/main`; locally runs `nx run-many --target=lint --all --parallel=4`. | CI: `eslint <changed>` | Local: `nx run-many --target=lint --all` | Exit 0 = PASS, exit 1 = FAIL | Live-fires the Wave-PR-8 PrimeNG flat block (memory `project_falcon_primeng_total_removal_complete.md`: "3/3 disallowed imports error"). |
| 02 | `gate-02-typecheck.mjs` | TypeScript `noEmit` typecheck across all projects. | Same | Same | Exit code | Not opened — assumed standard. |
| 03 | `gate-03-build-falcon-ui-core.mjs` | Build `libs/falcon-ui-core` (Stencil) — produces `dist-custom-elements`, the legacy ESM loader, React wrappers, and component types. | Build script | Build script | Build artifact | Memory: `npm run build:libs` runs this + tokens + studio before each app serve. |
| 04 | `gate-04-build-falcon-ui-react.mjs` | Build the React wrappers (Stencil reactOutputTarget). | Build | Build | Artifact | — |
| 05 | `gate-05-build-falcon-ui-vue.mjs` | Build the Vue wrappers via `generate-vue-proxies.cjs`. | Build | Build | Artifact | — |
| 06 | `gate-06-build-falcon-ui-tokens.mjs` | Build / validate the per-component token files. | Build | Build | Artifact | — |
| 07 | `gate-07-token-naming-lint.mjs` | Forbid `--falcon-color-(blue|gray)-*` token names (legacy directional). Noor's law requires `--falcon-{family}-{shade}` (e.g. `--falcon-teal-500`). | CI: scopes to git-diff added lines only (forward-only — grandfathered violations don't fail). Local: scans all `*.tokens.css`, prints existing violations but passes. | Same | Exit 0 / 1 | Memory `feedback_noor_instructions.md`. |
| 08 | `gate-08-hardcoded-value-lint.mjs` | Forbid new hardcoded `#hex`, standalone `px`, `rgba()` in `libs/falcon-ui-tokens/src/**/*.css` + `libs/falcon-ui-core/src/**/*.css`. Allowed inside `var(--token, #fallback)` fallback. | CI: scope to added lines in diff. Local: scans all files, prints count, passes locally. | Same | Exit 0 / 1 | Scope is tokens CSS — does NOT cover Angular templates' arbitrary Tailwind hex/px values (gap). |
| 09 | `gate-09-a11y-baseline.mjs` | Every Stencil TSX must declare `role=` or `aria-*`. New `falcon-*` components MUST have a11y attributes. | CI: scope to newly added `libs/falcon-ui-core/src/components/**/*.tsx` files. Local: full scan. | Same | Exit 0 / 1 | Grandfathered components: `falcon-organization-hierarchy-tree-tw`, `falcon-wizard-tw`, `falcon-toast-host-tw`, `falcon-grid-input-tw`, `falcon-card-tw`, `falcon-grid-input`. Pattern: `\b(role=|aria-[a-z])`. |
| 10 | `gate-10-noor-naming-lint.mjs` | (1) `@falcon/ui-{core,react,vue,tokens}` package names must start with `@falcon/`. (2) Stencil `@Component({ tag: 'falcon-{kebab}' })` tag names must match `^falcon-[a-z][a-z0-9-]*$`. | CI: scope to changed TSX. Local: glob all TSX. | Same | Exit 0 / 1 | Forbids deviation from `falcon-` prefix + kebab-case. |
| 11 | `gate-11-bundle-size-budget.mjs` | admin-console main.js gzipped < 340 KB. Reads `dist/apps/admin-console/browser/main(.hash).js`. Requires a production build to exist (prerequisite: `npm run build:admin-console:prod`). | Build → gate | Same | Exit 0 / 1 | Current baseline ~335 KB. Memory `project_falcon_primeng_total_removal_complete.md` confirms post-PrimeNG removal: 568 → 335 KB. |
| 12 | `gate-12-component-token-scope.mjs` | Per-component token files must declare under `:where(falcon-<component>, .falcon-<component>, [data-falcon-<component>]) { ... }` — NOT `:root`. Polluting `:root` with ~3,500 tokens (46 files × ~76 tokens each) freezes Chrome DevTools. Forward-only enforcement. | Glob scans every `*.tokens.css` | Same | Exit 0 / 1 | Print count + violations. Documents WHY: DevTools inspect performance. |

---

## Per-gate detail

### Gate 01 — Lint (`gate-01-lint.mjs`)

```js
// Maps:
// CI changed files → `npx eslint --max-warnings=0 <files>`
// Local              → `npx nx run-many --target=lint --all --parallel=4 --max-warnings=0`
const targets = CI ? changedFiles() : [];
const cmd = targets.length
  ? `npx eslint --max-warnings=0 ${targets.join(' ')}`
  : `npx nx run-many --target=lint --all --parallel=4 --max-warnings=0`;
```

Exit 1 propagates from eslint exit.

### Gate 07 — Token naming (`gate-07-token-naming-lint.mjs`)

```js
const FORBIDDEN = /--falcon-color-(blue|gray)-/;
```

Grandfathered = existing files with these names pass locally; only NEW additions in git diff fail.

### Gate 08 — Hardcoded value (`gate-08-hardcoded-value-lint.mjs`)

```js
const HEX_RE          = /:\s*#[0-9a-fA-F]{3,8}\s*;/;
const RGBA_RE         = /:\s*rgba?\s*\(/;
const PX_STANDALONE_RE = /:\s*\d+(\.\d+)?px\s*;/;

function isViolation(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('--')) return false;        // only CSS custom property declarations
  if (/:\s*var\s*\(/.test(trimmed)) return false;     // OK if whole value is var(...)
  return HEX_RE.test(trimmed) || RGBA_RE.test(trimmed) || PX_STANDALONE_RE.test(trimmed);
}
```

Scope: `libs/falcon-ui-tokens/src/**/*.css` + `libs/falcon-ui-core/src/**/*.css`. **Does NOT scan `apps/**/*.html`** — so the Tailwind arbitrary `bg-[#f5f6f7]` violations in feature templates are NOT caught by this gate. Recommend extending.

### Gate 09 — A11y baseline (`gate-09-a11y-baseline.mjs`)

```js
const DEFERRED = new Set([
  'falcon-organization-hierarchy-tree-tw',
  'falcon-wizard-tw',
  'falcon-toast-host-tw',
  'falcon-grid-input-tw',
  'falcon-card-tw',
  'falcon-grid-input',
]);

const A11Y_PATTERN = /\b(role=|aria-[a-z])/;
```

Wave 4 audit grandfathered 46 components as compliant. The gate fires only on new TSX files lacking `role=` / `aria-*`. The DEFERRED list is the deviation registry.

### Gate 10 — Noor naming (`gate-10-noor-naming-lint.mjs`)

```js
const PKG_NAME_RE = /^@falcon\//;
const TAG_DECL_RE = /@Component\s*\(\{[\s\S]*?tag\s*:\s*['"]([^'"]+)['"]/g;
const TAG_VALID_RE = /^falcon-[a-z][a-z0-9-]*$/;

const FALCON_UI_PKGS = [
  'libs/falcon-ui-core/package.json',
  'libs/falcon-ui-react/package.json',
  'libs/falcon-ui-vue/package.json',
  'libs/falcon-ui-tokens/package.json',
];
```

Checks: package names start with `@falcon/`; Stencil tag names match `^falcon-[a-z][a-z0-9-]*$`.

### Gate 11 — Bundle size budget (`gate-11-bundle-size-budget.mjs`)

```js
const DIST_DIR = resolve(ROOT, 'dist/apps/admin-console/browser');
const BUDGET_BYTES = 340 * 1024; // 340 KB
```

Finds `main(.hash).js`, gzips it (level 9), compares to budget. Fails on excess. Current baseline `~335 KB` per memory.

### Gate 12 — Component token scope (`gate-12-component-token-scope.mjs`)

```js
const ROOT_AT_TOP_LEVEL = /^[ \t]*:root[\s]*\{/m;
const SCOPED_SELECTOR   = /^[ \t]*:where\(\s*falcon-/m;

const files = readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith('.tokens.css'));

for (const file of files) {
  if (ROOT_AT_TOP_LEVEL.test(src)) violations.push(`${component}: declares under \`:root\``);
  else if (!SCOPED_SELECTOR.test(src)) violations.push(`${component}: missing scoped selector`);
}
```

Why-it-exists message printed on fail: "Tokens on :root inherit to every DOM element. With ~3,500 vars across 46 component contracts, Chrome DevTools freezes on inspect."

---

## Gate combinations actually run

### `npm run gate:all`

Sequential: 01 → 02 → 07 → 08 → 09 → 10 → 12. Does NOT include 03-06 (lib builds) or 11 (bundle size).

### `npm run build:libs` (prestart hook)

```json
"build:libs": "cross-env NX_NO_CLOUD=true nx run-many --target=build --projects=falcon-ui-tokens,falcon-ui-core,falcon-studio",
"prestart": "npm run build:libs",
```

Build gates 03-06 effectively run here (via the underlying Nx build targets).

### Individual gate scripts

`gate:lint`, `gate:typecheck`, `gate:build:falcon-ui-{core,react,vue,tokens}`, `gate:token-naming-lint`, `gate:hardcoded-value-lint`, `gate:a11y-baseline`, `gate:noor-naming-lint`, `gate:bundle-size-budget`, `gate:component-token-scope`.

---

## Current pass/fail state (discoverable evidence)

| Gate | Current state | Evidence |
|---|---|---|
| 01 Lint | **GREEN** (per memory) | `project_falcon_revamp_v3_1_night_shift_results.md` confirms full build green across all 3 apps. |
| 02 Typecheck | **GREEN** | Same memory. |
| 03-06 Lib builds | **GREEN** | Memory: build:libs ran clean post-PrimeNG removal. |
| 07 Token naming | **GREEN** in CI; LOCAL prints existing grandfathered violations | Source code says: "10 existing violations capped" |
| 08 Hardcoded value | **GREEN in CI**; **LOCAL prints existing grandfathered violations**. APP-SIDE Tailwind hex/px violations NOT covered. | Confirmed by FORBIDDEN_PATTERNS_OBSERVED.md grep. |
| 09 A11y baseline | **GREEN** | Wave 4 grandfathered 46 components. |
| 10 Noor naming | **GREEN** | All package.json names start `@falcon/`. |
| 11 Bundle size budget | **GREEN** at ~335 KB | Memory `project_falcon_primeng_total_removal_complete.md`. |
| 12 Component token scope | **GREEN** | Memory: 46 component contracts all scoped. |

---

## Gate gaps / recommendations

1. **Gate 08 scope is tokens-only.** Apps/`*.html` Tailwind arbitrary values `bg-[#f5f6f7]` / `border-[#hex]` / `rounded-[Npx]` are NOT linted. Extend gate-08 to also scan `apps/**/*.html` + `apps/**/*.ts` (template strings). See `FORBIDDEN_PATTERNS_OBSERVED.md` for the violations this would catch.
2. **No "inline-style" gate.** Memory `feedback_no_inline_styles_tokens_only.md` (hardened 2026-05-05) describes a "pre-finish grep gate codified in 4 skill files" — but no dedicated `gate-13-inline-style.mjs` exists. Recommend adding.
3. **Control-flow gate.** `*ngIf` / `*ngFor` / `*ngSwitch` are currently zero matches but no gate prevents regressions. Add a `gate-14-control-flow.mjs`.
4. **Zitadel-direct-call gate.** Memory rule forbids direct Zitadel calls; currently zero matches but no gate prevents regression. Recommend adding.
5. **PrimeNG / PrimeIcons gate.** Already covered by ESLint flat-block (`eslint.config.mjs:26`), so ESLint gate-01 handles it. ✓
6. **Bundle-size budget for host-shell + management-console.** Currently only admin-console has a budget gate. Memory mentions:
   - admin-console: 9.5 MB initial / 20 KB per-component-style
   - host-shell: 6 MB / 20 KB
   - management-console: 12 MB / 20 KB
   The `gate-11` budget is for admin-console main.js gzipped only (340 KB). Other apps rely on Nx project.json budgets enforced at build time.

---

## How Brain SK should use the gates

For a future agent verifying its own work:

1. Before reporting "done": run `npm run gate:all` (composite — 7 gates).
2. If touching tokens: also run `npm run gate:build:falcon-ui-tokens`.
3. If touching admin-console code or shared libs: build admin-console prod (`npm run build:admin-console:prod`) and run `npm run gate:bundle-size-budget`.
4. If adding a new Stencil component: gate 09 + gate 10 + gate 12 + gate 03 cover the contract.
5. Memory `feedback_always_build_zero_errors.md` + `feedback_build_must_be_green.md` (hardened 2026-05-08): no phase ships red. Build verification is authorised even though dev-serve is not.
