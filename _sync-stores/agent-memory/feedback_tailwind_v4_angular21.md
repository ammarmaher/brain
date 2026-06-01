---
name: tailwind-v4-angular21-build-workaround
description: Non-obvious fixes required for Tailwind v4 design tokens to apply in falcon-web-platform-ui/new-front (Angular 21 + NX 22 + webpack-browser)
type: feedback
originSessionId: 14e9a0d4-ec74-4a6a-aecc-e5c0608e9645
---
Tailwind v4 + Angular 21 webpack-browser (@nx/angular:webpack-browser) has cascade bugs that silently drop utility classes. The working pipeline in `falcon-web-platform-ui/new-front` is:

1. Compile Tailwind via `@tailwindcss/cli` (NOT PostCSS): `tailwindcss -i styles.src.css -o styles.css`, run in `prestart`/`prebuild` scripts.
2. Post-process with `scripts/unlayer-theme.mjs` to:
   - Extract the first `@layer base { :root { ...theme tokens... } }` block (the one with `--spacing`, `--color-sidebar`, etc.) and MERGE its declarations into the user's own `:root { --background, --sidebar, ... }` block. Reason: Chrome/css-loader drops the Tailwind-generated `:root` rule when alone — the user-defined one survives.
   - Collapse any `:root, :host` selectors to just `:root`.
   - Strip the `@layer base { *, ::after... { border-color: var(--color-gray-200) } }` v3-compat rule — it overrides `.border-border`/`.border-muted` utilities because the `@layer theme, base, components, utilities;` order declaration isn't honored by Chrome in this build setup.
3. `apps/host-shell/postcss.config.js` and root `postcss.config.js` must stay disabled (renamed `.disabled`) — otherwise Angular's webpack re-runs Tailwind and injects a SECOND unlayered copy as inline `<style>` that breaks the cascade.
4. `nx-welcome.ts` (starter component) ships with a raw `<style>` block containing Tailwind v3 preflight that injects globally and overrides utilities — must be replaced with a minimal template.

**Why:** these workarounds surfaced one-by-one during a debugging session (Apr 2026) because: Tailwind v4 assumes PostCSS pipeline with working `@layer` support, but Angular 21's webpack-browser CSS pipeline mishandles both the layer-order statement rule and deduplicates `:root` blocks.

**How to apply:** when adding new theme tokens, add them to `styles.src.css` in BOTH the `@theme` block (for utility generation) AND the `:root` block (for runtime value). Re-run `npm run tailwind:build` after any change to `styles.src.css`. If new utility classes don't apply at runtime, check the post-process output with `Grep :root styles.css` and verify tokens are merged into the user `:root`.
