*** web-scrub — isolated scraping + UI extraction + React-source-mapping tool ***
*** Path: C:\Falcon\Brain SK\tools\web-scrub\README.md ***
*** Created: 2026-05-28 ***

# web-scrub Tool

Isolated tool that powers the **web-scrub** Brain SK skill.

The skill specification lives at:

```text
C:\Falcon\Brain SK\skills\web-scrub\SKILL.md
```

## What this tool does

1. **Scrape a URL** — full-page screenshot, viewport screenshot, DOM, visible-text map, interactive-element map, network log.
2. **Deep-dive a single component** — DOM subtree, bounding box, per-state computed styles, per-state screenshots (default/hover/focus/active/disabled).
3. **Map a React component** — static analysis via ts-morph of declarations, props/interface, imports, hooks, event handlers, child JSX, classNames.
4. **Crawl a small set of pages** — via Crawlee, for route discovery / sitemap walking (only when explicitly requested).

The tool stops at evidence. The skill is the workflow layer. Downstream skills (`react-to-angular`, `screenshot-to-angular`, `html-to-angular`, `falcon-component-creation`, `falcon-eyes`, `visual-source-of-truth-analysis-skill`) consume the output.

## Install

The tool is **intentionally isolated**. It MUST NOT add dependencies to the Falcon Angular workspace at `C:\Falcon\Falcon\falcon-web-platform-ui`. Brain SK governance rule.

```powershell
cd "C:\Falcon\Brain SK\tools\web-scrub"
npm install
npx playwright install chromium
```

Dependencies declared in `package.json`:

- `@playwright/test`, `playwright` — live browser inspection
- `ts-morph` — TypeScript/TSX/JSX static analysis
- `crawlee` — optional multi-page crawl
- `tsx`, `typescript` — runner + types

## Smoke tests

```powershell
cd "C:\Falcon\Brain SK\tools\web-scrub"
npm run smoke:playwright
npm run smoke:ts-morph
npm run smoke:crawlee
npm run smoke:all
```

All three were green on 2026-05-28 (see `C:\Falcon\Brain Outputs\reports\web-scrub-setup-2026-05-28\01-installation-verification.md`).

## Commands

```powershell
# Scrape a URL
npm run scrape -- --url https://example.com --name example

# Deep-dive a component (provide a CSS selector)
npm run deep-dive -- --url https://example.com --selector "main h1" --name hero-h1

# Map a React component (defaults to Source_of_truth_theme)
npm run react-map -- --component PricingCard
```

Outputs land in `C:\Falcon\Brain Outputs\reports\web-scrub\<YYYY-MM-DD-HHmm>_<slug>\`.

## Safety rules

The tool refuses or warns when the target needs:

- CAPTCHA solving
- Login / paywall bypass
- Anti-bot fingerprint impersonation
- Non-http(s) protocol

It also respects `web-scrub.config.json.safety.allowDomainsOnly` / `denyDomains` when set.

## Files

| File | Purpose |
|---|---|
| `package.json` | Isolated dep list |
| `tsconfig.json` | TS config for the `src/` runner files |
| `web-scrub.config.json` | Default viewport, output root, React project default, safety policy |
| `src/scrape-url.ts` | Single-URL evidence capture |
| `src/deep-dive-component.ts` | Per-state component evidence capture |
| `src/react-map.ts` | ts-morph React-source mapping |
| `src/smoke/*.ts` | Three smoke tests |

## Related

- Skill: `C:\Falcon\Brain SK\skills\web-scrub\SKILL.md`
- Sibling tools: `falcon-eyes` (visual diff), `statistics`, `insight-reports`, `notifications`, `night-shift`, `terminal`
- Reports: `C:\Falcon\Brain Outputs\reports\web-scrub\`
- Setup report: `C:\Falcon\Brain Outputs\reports\web-scrub-setup-2026-05-28\`
