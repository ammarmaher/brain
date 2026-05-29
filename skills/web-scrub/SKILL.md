---
name: web-scrub
description: Scrape any URL safely, deep-dive into a UI component, and map it back to its React source — then to a Falcon Angular target. Uses Playwright (live truth) + ts-morph (React source truth) + Crawlee (multi-page). Isolated tool — does NOT touch the Falcon Angular workspace.
---

# web-scrub

## Purpose

When the user gives a URL and says **scrape / scrub / inspect / extract** — or points at a single component and asks for a **deep dive** — `web-scrub` produces an evidence bundle that the rest of the Brain SK skills consume:

1. **Live rendered truth** via Playwright — screenshots, DOM, computed styles, bounding boxes, network log, interactive map.
2. **React source truth** via ts-morph — declaration, props/interface, imports, hooks, event handlers, child components, classNames.
3. **Multi-page crawl** via Crawlee (optional, only when the user asks for route discovery / sitemap walking).

The skill **stops at evidence**. It does NOT implement the Angular component. Downstream skills do that:

| If you need… | Route to |
|---|---|
| Validate a plan against the evidence | [`visual-source-of-truth-analysis-skill`](../../../brain-skills/code-skills/visual-source-of-truth-analysis-skill/SKILL.md) |
| Compare two rendered pages pixel-by-pixel | [`falcon-eyes`](../../domains/frontend/falcon-eyes/SKILL.md) |
| Convert the React component to Angular | [`react-to-angular`](../react-to-angular/SKILL.md) |
| Convert plain HTML to Angular | [`html-to-angular`](../html-to-angular/SKILL.md) |
| Use screenshots as the visual repair contract | [`screenshot-to-angular`](../screenshot-to-angular/SKILL.md) |
| Build a brand-new Falcon component | [`falcon-component-creation-skill`](../../../brain-skills/code-skills/falcon-component-creation-skill/SKILL.md) |

## Trigger phrases

The user can say any of:

- `scrape this URL <url>` / `scrub this URL <url>`
- `inspect this page <url>` / `extract this UI <url>`
- `deep dive into this component` / `scrub this component` / `extract this component`
- `map this to React` / `map component <name> to React source`
- `/web-scrub <url>` (slash form, when wired)

## Source-of-truth priority (do not invert)

Brain SK's [SoT priority](../../../Brain SK/CLAUDE.md) still wins. For `web-scrub`:

1. **React source code** (via ts-morph) — structure, props, behavior, child component tree.
2. **Running React app** (via Playwright) — runtime visual truth, computed styles, real states.
3. **Screenshots** (saved by web-scrub) — final visual acceptance.
4. **Angular/Falcon implementation** — target output, owned by downstream skills.

If React source disagrees with the rendered DOM → trust source for structure, trust the rendered DOM for visual truth. Flag the gap.

## Safety rules (non-negotiable)

The tool MUST refuse or warn when any of these is true:

| Signal | Behavior |
|---|---|
| `robots.txt` disallows path | Halt + write `BLOCKED.md` with reason |
| Page returns 401/403 + visible login wall | Halt — do not attempt credentials |
| CAPTCHA visible (reCAPTCHA / hCaptcha / Turnstile) | Halt — do not attempt bypass |
| Paywall blocker visible | Halt — direct user to official API / RSS / export |
| Anti-bot challenge (Cloudflare interstitial) | Halt — do not impersonate browser fingerprints |
| URL not http/https | Halt — only http+https are allowed |
| Domain in `denyDomains` config | Halt |
| `allowDomainsOnly` non-empty and URL not in list | Halt |

When data extraction (not UI extraction) is the goal, the skill MUST prefer in this order:
1. Official API
2. Sitemap / RSS / Atom
3. Exported data / public dump
4. Crawlee multi-page scrape (only if user explicitly asks)
5. Playwright single-page scrape

## Commands

All commands run from `C:\Falcon\Brain SK\tools\web-scrub`. Outputs land under `C:\Falcon\Brain Outputs\reports\web-scrub\<YYYY-MM-DD-HHmm>_<slug>\`.

### Scrape a URL (full-page evidence)

```powershell
cd "C:\Falcon\Brain SK\tools\web-scrub"
npm run scrape -- --url <url> [--name <slug>] [--viewport 1440x900]
```

Outputs:
- `screenshot-full.png` — full-page screenshot
- `screenshot-viewport.png` — viewport-only
- `dom.html` — DOM snapshot
- `visible-text.txt` — visible text map
- `interactive-map.json` — every interactive element + bounding box + role/name/aria
- `network.json` — every HTTP request + status + resource type
- `REPORT.md` — summary

### Deep-dive a single component

```powershell
npm run deep-dive -- --url <url> --selector "<css-selector>" --name <slug> [--states default,hover,focus,active,disabled]
```

Outputs:
- `subtree.html` — outerHTML of the matched element
- `box.json` — bounding box
- `computed-styles.json` — computed CSS per state
- `state-<name>.png` — one screenshot per state
- `REPORT.md` — summary

### Map a React component

```powershell
npm run react-map -- --component <ReactComponentName> [--project <react-root>]
```

Default `--project` = `C:\Falcon\Source_of_truth_theme` (config: `web-scrub.config.json`).

Outputs:
- `react-analysis.json` — per-file: declaration, props/interface, imports, hooks, event handlers, classNames, child JSX tags
- `REPORT.md`

## End-to-end workflow

When the user says **"deep dive into this component"** on a rendered URL:

1. `npm run scrape -- --url <url>` → save full evidence
2. User picks a CSS selector for the component
3. `npm run deep-dive -- --url <url> --selector "<sel>" --name <slug>` → per-state CSS + screenshots
4. User names the React component
5. `npm run react-map -- --component <Name>` → source-truth analysis
6. **Hand off to downstream skill** — `react-to-angular` / `falcon-component-creation` — with the three output folders as evidence

## Output layout

```
C:\Falcon\Brain Outputs\reports\web-scrub\
  2026-05-28-1745_acme-com-pricing\
    screenshot-full.png
    screenshot-viewport.png
    dom.html
    visible-text.txt
    interactive-map.json
    network.json
    REPORT.md
  2026-05-28-1750_deep-dive_pricing-card\
    subtree.html
    box.json
    computed-styles.json
    state-default.png
    state-hover.png
    state-focus.png
    REPORT.md
  2026-05-28-1755_react-map_PricingCard\
    react-analysis.json
    REPORT.md
```

## Isolation guarantee

The tool lives at `C:\Falcon\Brain SK\tools\web-scrub\` with its OWN `package.json`. Per the Brain SK **Permanent Rule** ([CLAUDE.md](../../CLAUDE.md) — *"Isolated tool folders ... never added to the Falcon Angular workspace"*), this skill MUST NOT add Playwright / ts-morph / Crawlee to `C:\Falcon\Falcon\falcon-web-platform-ui\package.json`. Verified clean install on 2026-05-28.

## Compatible skills (verified)

| Sibling skill | Relationship | Conflict? |
|---|---|---|
| `falcon-eyes` | Both use Playwright in isolated tool folder. web-scrub captures evidence; falcon-eyes does pixel diff. | No — different goals, different output folders |
| `react-to-angular` | Consumes `react-map` output | No — web-scrub feeds it |
| `screenshot-to-angular` | Consumes `scrape` screenshots | No — web-scrub feeds it |
| `html-to-angular` | Consumes `dom.html` from scrape | No — web-scrub feeds it |
| `visual-source-of-truth-analysis-skill` | Consumes screenshots + React source | No — web-scrub generates both |
| `falcon-component-creation-skill` | Consumes mapping recommendation | No — web-scrub provides evidence, not code |
| `screenshot-to-angular` + `page-learning` | Page-learning saves prompts/screenshots as evidence; web-scrub captures the raw URL evidence on demand | No — page-learning is a longer-running classifier; web-scrub is the capture tool |

See [`compatibility-report-2026-05-28.md`](./compatibility-report-2026-05-28.md) for the full audit.

## Hard rules

1. **NEVER add deps to the Falcon Angular workspace.** This skill's deps live ONLY in `tools/web-scrub/node_modules/`.
2. **NEVER bypass CAPTCHA / login / paywall / anti-bot.** Halt + write `BLOCKED.md` with the reason.
3. **NEVER commit or push.** Output goes under `Brain Outputs/reports/web-scrub/`; sync only via additive `robocopy /E /XO` per Brain SK rules.
4. **NEVER claim a component was mapped to Falcon without reading the Falcon component dossier** under `Brain Outputs/understanding/frontend/components/<name>/`.
5. **NEVER trust the rendered DOM as source of behavior** — that's the React source's job.
6. **ALWAYS source-prefix Falcon facts**: `[CODE]` / `[BRAIN-OUT]` / `[VAULT]` / `[BRAIN-SK]` / `[INFERRED]`.
7. **ALWAYS save evidence under timestamped folders** — never overwrite a prior run.

## See also

- Strategy: this skill is the capture layer. The downstream **react-to-angular** + **falcon-component-creation** skills are the implementation layer.
- Tool: `C:\Falcon\Brain SK\tools\web-scrub\` — runnable Node.js scripts.
- Reports: `C:\Falcon\Brain Outputs\reports\web-scrub\<timestamp>_<slug>\`.
- Compatible siblings: see table above.
