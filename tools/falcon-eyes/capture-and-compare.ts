/*
 * Falcon Eyes — capture-and-compare.ts
 * Path: tools/falcon-eyes/capture-and-compare.ts
 * Created: 2026-05-15
 *
 * Captures source + destination screenshots (full page + named sections),
 * runs pixelmatch per pair, and writes:
 *
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/source/<section>.png
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/destination/<section>.png
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/diff/<section>-diff.png
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/SOURCE.png
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/DESTINATION.png
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/DIFF.png
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/SCREENSHOT_REPORT.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/SCREENSHOT_DATA.json
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/SEMANTIC_MISMATCHES.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/sections/<section>/FALCON_COMPONENT_REPAIR_MAP.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/metadata/run.json
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/metadata/pixelmatch.json
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/FALCON_EYES_REPORT.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/FALCON_EYES_DATA.json
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/SEMANTIC_MISMATCH_BACKLOG.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/SECTION_SCORECARD.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/FALCON_COMPONENT_REPAIR_MAP.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/ALL_SCREENSHOTS_INDEX.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/ALL_SCREENSHOTS_SUMMARY_REPORT.md
 *
 * Falcon Eyes intentionally STOPS at the pixel layer. Semantic mismatch
 * analysis, Falcon component mapping, and repair recommendations are filled
 * in by Claude using the Falcon Eyes skill spec.
 *
 * Usage:
 *   npx tsx capture-and-compare.ts
 *   npx tsx capture-and-compare.ts --source http://... --destination http://...
 *   npx tsx capture-and-compare.ts --only tabs-header,comm-channels-tab
 *   npx tsx capture-and-compare.ts --no-pixelmatch
 */

import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

type SectionConfig = {
  name: string;
  description?: string;
  sourceSelector?: string;
  destinationSelector?: string;
  fullPageFallback?: boolean;
};

type SectionsFile = {
  page?: string;
  notes?: string;
  sections: SectionConfig[];
};

type FalconEyesConfig = {
  source: { url: string; label?: string };
  destination: { url: string; label?: string };
  viewport: { width: number; height: number; deviceScaleFactor?: number };
  wait: { state: 'load' | 'domcontentloaded' | 'networkidle'; extraDelayMs?: number };
  pixelmatch: { threshold: number; includeAA: boolean; diffColor: [number, number, number] };
  output: {
    rootDir: string;
    mirrorTo?: string;
    writeFullPage: boolean;
    writeSectionScreenshots: boolean;
    writeDiffImages: boolean;
    writeJson: boolean;
    writeMarkdown: boolean;
  };
  navigation: { preWaitForSelector?: string | null; scrollToTopBeforeCapture?: boolean };
  headless: boolean;
};

type CliArgs = {
  config: string;
  sections: string;
  source?: string;
  destination?: string;
  only?: string[];
  out?: string;
  noPixelmatch: boolean;
};

type PerSectionResult = {
  name: string;
  sourcePath: string | null;
  destinationPath: string | null;
  diffPath: string | null;
  width: number;
  height: number;
  diffPixels: number;
  totalPixels: number;
  mismatchPercent: number;
  capturedAt: string;
  notes: string[];
};

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    config: path.join(__dirname, 'falcon-eyes.config.json'),
    sections: path.join(__dirname, 'section-capture.config.json'),
    noPixelmatch: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--config': args.config = next; i++; break;
      case '--sections': args.sections = next; i++; break;
      case '--source': args.source = next; i++; break;
      case '--destination': args.destination = next; i++; break;
      case '--only': args.only = (next || '').split(',').map(s => s.trim()).filter(Boolean); i++; break;
      case '--out': args.out = next; i++; break;
      case '--no-pixelmatch': args.noPixelmatch = true; break;
    }
  }
  return args;
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

function stamp(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

async function gotoAndPrepare(page: Page, url: string, cfg: FalconEyesConfig): Promise<void> {
  await page.goto(url, { waitUntil: cfg.wait.state });
  if (cfg.navigation.preWaitForSelector) {
    await page.waitForSelector(cfg.navigation.preWaitForSelector, { timeout: 30000 }).catch(() => undefined);
  }
  if (cfg.navigation.scrollToTopBeforeCapture) {
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  if (cfg.wait.extraDelayMs && cfg.wait.extraDelayMs > 0) {
    await page.waitForTimeout(cfg.wait.extraDelayMs);
  }
}

async function captureSection(
  page: Page,
  section: SectionConfig,
  side: 'source' | 'destination',
  outDir: string,
  cfg: FalconEyesConfig,
): Promise<{ filePath: string | null; note: string | null }> {
  const selector = side === 'source' ? section.sourceSelector : section.destinationSelector;
  const filePath = path.join(outDir, `${section.name}.png`);

  try {
    if (selector && selector.trim().length > 0) {
      const el = await page.$(selector);
      if (el) {
        await el.screenshot({ path: filePath });
        return { filePath, note: null };
      }
      if (!section.fullPageFallback) {
        return { filePath: null, note: `selector not found and fullPageFallback=false for ${section.name}` };
      }
    }
    if (section.fullPageFallback !== false) {
      await page.screenshot({ path: filePath, fullPage: true });
      return { filePath, note: 'used full-page fallback' };
    }
    return { filePath: null, note: `no selector and fullPageFallback disabled for ${section.name}` };
  } catch (err) {
    return { filePath: null, note: `capture error: ${(err as Error).message}` };
  }
}

function normalizeToSameSize(a: PNG, b: PNG): { a: PNG; b: PNG } {
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const crop = (src: PNG): PNG => {
    if (src.width === w && src.height === h) return src;
    const out = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * src.width + x) << 2;
        const j = (y * w + x) << 2;
        out.data[j] = src.data[i];
        out.data[j + 1] = src.data[i + 1];
        out.data[j + 2] = src.data[i + 2];
        out.data[j + 3] = src.data[i + 3];
      }
    }
    return out;
  };
  return { a: crop(a), b: crop(b) };
}

function diffPair(
  sourcePng: PNG,
  destinationPng: PNG,
  cfg: FalconEyesConfig,
): { diff: PNG; diffPixels: number; totalPixels: number } {
  const { a, b } = normalizeToSameSize(sourcePng, destinationPng);
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: cfg.pixelmatch.threshold,
    includeAA: cfg.pixelmatch.includeAA,
    diffColor: cfg.pixelmatch.diffColor,
  });
  return { diff, diffPixels, totalPixels: a.width * a.height };
}

function writeMarkdownReport(
  runRoot: string,
  cfg: FalconEyesConfig,
  results: PerSectionResult[],
): void {
  const lines: string[] = [];
  lines.push('# Falcon Eyes Report');
  lines.push('');
  lines.push(`> Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Sources');
  lines.push('');
  lines.push(`- **Source:** ${cfg.source.url} ${cfg.source.label ? `(${cfg.source.label})` : ''}`);
  lines.push(`- **Destination:** ${cfg.destination.url} ${cfg.destination.label ? `(${cfg.destination.label})` : ''}`);
  lines.push(`- **Viewport:** ${cfg.viewport.width}x${cfg.viewport.height} @ ${cfg.viewport.deviceScaleFactor ?? 1}x`);
  lines.push('');
  lines.push('## Section results (pixel layer only)');
  lines.push('');
  lines.push('| Section | Source | Destination | Diff | Mismatch % | Notes |');
  lines.push('|---|---|---|---|---:|---|');
  for (const r of results) {
    lines.push(
      `| ${r.name} ` +
      `| ${r.sourcePath ? path.relative(runRoot, r.sourcePath).replace(/\\/g, '/') : '—'} ` +
      `| ${r.destinationPath ? path.relative(runRoot, r.destinationPath).replace(/\\/g, '/') : '—'} ` +
      `| ${r.diffPath ? path.relative(runRoot, r.diffPath).replace(/\\/g, '/') : '—'} ` +
      `| ${r.mismatchPercent.toFixed(2)} ` +
      `| ${r.notes.join('; ') || '—'} |`,
    );
  }
  lines.push('');
  lines.push('## Next step');
  lines.push('');
  lines.push('Falcon Eyes (the skill) now fills in the **semantic** templates:');
  lines.push('');
  lines.push('- `SEMANTIC_MISMATCH_BACKLOG.md`');
  lines.push('- `SECTION_SCORECARD.md`');
  lines.push('- `FALCON_COMPONENT_REPAIR_MAP.md`');
  lines.push('');
  lines.push('See `domains/frontend/falcon-eyes/SKILL.md`.');
  fs.writeFileSync(path.join(runRoot, 'FALCON_EYES_REPORT.md'), lines.join('\n'), 'utf8');
}

function writeJsonReport(runRoot: string, cfg: FalconEyesConfig, results: PerSectionResult[]): void {
  const payload = {
    generatedAt: new Date().toISOString(),
    source: cfg.source,
    destination: cfg.destination,
    viewport: cfg.viewport,
    wait: cfg.wait,
    pixelmatch: cfg.pixelmatch,
    sections: results,
  };
  fs.writeFileSync(path.join(runRoot, 'FALCON_EYES_DATA.json'), JSON.stringify(payload, null, 2), 'utf8');
}

function rel(runRoot: string, p: string | null): string {
  return p ? path.relative(runRoot, p).replace(/\\/g, '/') : '—';
}

function statusLabel(mismatchPercent: number): 'pass' | 'needs repair' | 'unknown' {
  if (Number.isNaN(mismatchPercent)) return 'unknown';
  if (mismatchPercent <= 1) return 'pass';
  return 'needs repair';
}

function writePerSectionReports(
  runRoot: string,
  cfg: FalconEyesConfig,
  results: PerSectionResult[],
): void {
  const sectionsRoot = path.join(runRoot, 'sections');
  ensureDir(sectionsRoot);

  for (const r of results) {
    const sectionDir = path.join(sectionsRoot, r.name);
    ensureDir(sectionDir);

    const sourceCopy = path.join(sectionDir, 'SOURCE.png');
    const destCopy = path.join(sectionDir, 'DESTINATION.png');
    const diffCopy = path.join(sectionDir, 'DIFF.png');
    if (r.sourcePath && fs.existsSync(r.sourcePath)) fs.copyFileSync(r.sourcePath, sourceCopy);
    if (r.destinationPath && fs.existsSync(r.destinationPath)) fs.copyFileSync(r.destinationPath, destCopy);
    if (r.diffPath && fs.existsSync(r.diffPath)) fs.copyFileSync(r.diffPath, diffCopy);

    const status = statusLabel(r.mismatchPercent);

    const md: string[] = [];
    md.push(`# Screenshot Report — ${r.name}`);
    md.push('');
    md.push(`> Generated: ${new Date().toISOString()}`);
    md.push('');
    md.push('## Capture');
    md.push('');
    md.push(`- **Section:** ${r.name}`);
    md.push(`- **Source URL:** ${cfg.source.url}`);
    md.push(`- **Destination URL:** ${cfg.destination.url}`);
    md.push(`- **Capture timestamp:** ${r.capturedAt}`);
    md.push(`- **Viewport:** ${cfg.viewport.width}x${cfg.viewport.height} @ ${cfg.viewport.deviceScaleFactor ?? 1}x`);
    md.push(`- **Source screenshot (flat):** \`${rel(runRoot, r.sourcePath)}\``);
    md.push(`- **Destination screenshot (flat):** \`${rel(runRoot, r.destinationPath)}\``);
    md.push(`- **Diff screenshot (flat):** \`${rel(runRoot, r.diffPath)}\``);
    md.push(`- **Section folder screenshots:** \`sections/${r.name}/SOURCE.png\`, \`sections/${r.name}/DESTINATION.png\`, \`sections/${r.name}/DIFF.png\``);
    md.push('');
    md.push('## Pixel layer (produced by Falcon Eyes tool)');
    md.push('');
    md.push(`- **Pixel mismatch %:** ${r.mismatchPercent.toFixed(2)}%`);
    md.push(`- **Diff pixels / total pixels:** ${r.diffPixels} / ${r.totalPixels}`);
    md.push(`- **Diff image size:** ${r.width} x ${r.height}`);
    md.push(`- **Perceptual score:** _(unavailable — install \`odiff-bin\` to populate)_`);
    md.push('');
    md.push('## Semantic layer (filled by Falcon Eyes skill)');
    md.push('');
    md.push('- **Visual parity score for this section:** _TBD_');
    md.push('- **Semantic difference summary:** _TBD_');
    md.push('- **Falcon components involved:** _TBD_');
    md.push('- **Tailwind / token issues:** _TBD_');
    md.push('- **Dynamic API issues:** _TBD_');
    md.push('- **Missing shared component capabilities:** _TBD_');
    md.push('- **Repair recommendations:** _TBD_');
    md.push('');
    md.push('## Severity counters');
    md.push('');
    md.push('| P0 | P1 | P2 | P3 |');
    md.push('|---:|---:|---:|---:|');
    md.push('| 0 | 0 | 0 | 0 |');
    md.push('');
    md.push(`## Status — ${status}`);
    md.push('');
    md.push('`pass` / `needs repair` / `blocked` / `unknown` — the tool defaults this from pixel mismatch %. Falcon Eyes (the skill) overrides it after semantic review.');
    md.push('');
    md.push('## Notes');
    md.push('');
    md.push(r.notes.length ? r.notes.map(n => `- ${n}`).join('\n') : '_None_');
    fs.writeFileSync(path.join(sectionDir, 'SCREENSHOT_REPORT.md'), md.join('\n'), 'utf8');

    const data = {
      section: r.name,
      sourceUrl: cfg.source.url,
      destinationUrl: cfg.destination.url,
      capturedAt: r.capturedAt,
      viewport: cfg.viewport,
      pixel: {
        sourcePath: rel(runRoot, r.sourcePath),
        destinationPath: rel(runRoot, r.destinationPath),
        diffPath: rel(runRoot, r.diffPath),
        sectionSourcePath: `sections/${r.name}/SOURCE.png`,
        sectionDestinationPath: `sections/${r.name}/DESTINATION.png`,
        sectionDiffPath: `sections/${r.name}/DIFF.png`,
        width: r.width,
        height: r.height,
        diffPixels: r.diffPixels,
        totalPixels: r.totalPixels,
        mismatchPercent: r.mismatchPercent,
        perceptualScore: null,
      },
      semantic: {
        visualParityScore: null,
        differenceSummary: null,
        falconComponentsInvolved: [],
        tailwindOrTokenIssues: [],
        dynamicApiIssues: [],
        missingSharedComponentCapabilities: [],
        repairRecommendations: [],
      },
      severity: { P0: 0, P1: 0, P2: 0, P3: 0 },
      status,
      notes: r.notes,
    };
    fs.writeFileSync(path.join(sectionDir, 'SCREENSHOT_DATA.json'), JSON.stringify(data, null, 2), 'utf8');

    const mismatches: string[] = [];
    mismatches.push(`# Semantic Mismatches — ${r.name}`);
    mismatches.push('');
    mismatches.push(`> Add one block per visible defect using \`tools/falcon-eyes/semantic-mismatch-template.md\`. Source / destination / diff for this section are in this same folder: \`SOURCE.png\`, \`DESTINATION.png\`, \`DIFF.png\`.`);
    mismatches.push('');
    mismatches.push('### Mismatches');
    mismatches.push('');
    mismatches.push('_None recorded yet._');
    fs.writeFileSync(path.join(sectionDir, 'SEMANTIC_MISMATCHES.md'), mismatches.join('\n'), 'utf8');

    const sectionRepair: string[] = [];
    sectionRepair.push(`# Falcon Component Repair Map — ${r.name}`);
    sectionRepair.push('');
    sectionRepair.push('| Mismatch ID | Falcon component | Repair path (input / template / slot / token / upgrade) | Likely file to change | Proof needed |');
    sectionRepair.push('|---|---|---|---|---|');
    sectionRepair.push(`| _FE-${r.name}-0001_ |  |  |  |  |`);
    sectionRepair.push('');
    sectionRepair.push('Customization order: inputs → ng-template → slots → tokens → shared component upgrade → new reusable lib component → feature-local wrapper → raw (document as GAP).');
    fs.writeFileSync(path.join(sectionDir, 'FALCON_COMPONENT_REPAIR_MAP.md'), sectionRepair.join('\n'), 'utf8');
  }
}

function writeRunLevelReports(runRoot: string, cfg: FalconEyesConfig, results: PerSectionResult[]): void {
  const backlog: string[] = [];
  backlog.push('# Semantic Mismatch Backlog');
  backlog.push('');
  backlog.push('> Pixel diff is just evidence. For every visible defect below, replace the placeholder block with a full semantic-mismatch record using `tools/falcon-eyes/semantic-mismatch-template.md`. Mirror each block into the matching `sections/<section>/SEMANTIC_MISMATCHES.md`.');
  backlog.push('');
  for (const r of results) {
    backlog.push(`## ${r.name} (${r.mismatchPercent.toFixed(2)}% pixel mismatch)`);
    backlog.push('');
    backlog.push(`- source: \`${rel(runRoot, r.sourcePath)}\``);
    backlog.push(`- destination: \`${rel(runRoot, r.destinationPath)}\``);
    backlog.push(`- diff: \`${rel(runRoot, r.diffPath)}\``);
    backlog.push(`- per-section report: \`sections/${r.name}/SCREENSHOT_REPORT.md\``);
    backlog.push('');
    backlog.push('_Add one block per visible defect using the template skeleton._');
    backlog.push('');
  }
  fs.writeFileSync(path.join(runRoot, 'SEMANTIC_MISMATCH_BACKLOG.md'), backlog.join('\n'), 'utf8');

  const score: string[] = [];
  score.push('# Section Scorecard');
  score.push('');
  score.push('| Section | Pixel mismatch % | Semantic parity % | Severity caps | Status | Notes |');
  score.push('|---|---:|---:|---|---|---|');
  for (const r of results) {
    score.push(`| ${r.name} | ${r.mismatchPercent.toFixed(2)} |  |  | ${statusLabel(r.mismatchPercent)} | ${r.notes.join('; ') || ''} |`);
  }
  score.push('');
  score.push('Rules:');
  score.push('- Any P0 caps total at 70 %.');
  score.push('- Any P1 caps affected section at 75 %.');
  score.push('- Any untested required section stays below 60 %.');
  score.push('- Target: 90 % minimum, 95 % ideal.');
  fs.writeFileSync(path.join(runRoot, 'SECTION_SCORECARD.md'), score.join('\n'), 'utf8');

  const repair: string[] = [];
  repair.push('# Falcon Component Repair Map');
  repair.push('');
  repair.push('| Mismatch ID | Section | Falcon component | Repair path (input / template / slot / token / upgrade) | Likely file to change | Proof needed |');
  repair.push('|---|---|---|---|---|---|');
  for (const r of results) {
    repair.push(`| _FE-${r.name}-0001_ | ${r.name} |  |  |  |  |`);
  }
  repair.push('');
  repair.push('Use the customization order from the skill:');
  repair.push('1. Existing Falcon component inputs / config');
  repair.push('2. Existing Falcon ng-template support');
  repair.push('3. Existing Falcon slots / content projection');
  repair.push('4. Existing Falcon Tailwind / token variants');
  repair.push('5. Shared Falcon component upgrade');
  repair.push('6. New reusable Falcon component in the library');
  repair.push('7. Feature-local wrapper (page-specific only)');
  repair.push('8. Raw implementation (last resort, document as GAP)');
  fs.writeFileSync(path.join(runRoot, 'FALCON_COMPONENT_REPAIR_MAP.md'), repair.join('\n'), 'utf8');
}

function writeAllScreenshotsIndex(runRoot: string, results: PerSectionResult[]): void {
  const lines: string[] = [];
  lines.push('# All Screenshots Index');
  lines.push('');
  lines.push('> Every screenshot captured in this run, with links to the matching per-section report, semantic mismatch file, and Falcon component repair map.');
  lines.push('');
  lines.push('| Section | Source | Destination | Diff | Report | Semantic mismatches | Repair map | Status |');
  lines.push('|---|---|---|---|---|---|---|---|');
  for (const r of results) {
    lines.push(
      `| ${r.name} ` +
      `| [source](${rel(runRoot, r.sourcePath)}) ` +
      `| [destination](${rel(runRoot, r.destinationPath)}) ` +
      `| [diff](${rel(runRoot, r.diffPath)}) ` +
      `| [report](sections/${r.name}/SCREENSHOT_REPORT.md) ` +
      `| [mismatches](sections/${r.name}/SEMANTIC_MISMATCHES.md) ` +
      `| [repair](sections/${r.name}/FALCON_COMPONENT_REPAIR_MAP.md) ` +
      `| ${statusLabel(r.mismatchPercent)} |`,
    );
  }
  fs.writeFileSync(path.join(runRoot, 'ALL_SCREENSHOTS_INDEX.md'), lines.join('\n'), 'utf8');
}

function writeAllScreenshotsSummaryReport(runRoot: string, cfg: FalconEyesConfig, results: PerSectionResult[]): void {
  const lines: string[] = [];
  const totalSections = results.length;
  const totalScreenshots = results.reduce((acc, r) => {
    return acc + (r.sourcePath ? 1 : 0) + (r.destinationPath ? 1 : 0) + (r.diffPath ? 1 : 0);
  }, 0);
  const visualParityValues = results
    .map(r => 100 - r.mismatchPercent)
    .filter(v => !Number.isNaN(v));
  const averageVisualParity = visualParityValues.length
    ? visualParityValues.reduce((a, b) => a + b, 0) / visualParityValues.length
    : 0;
  const below90 = results.filter(r => 100 - r.mismatchPercent < 90).map(r => r.name);
  const below60 = results.filter(r => 100 - r.mismatchPercent < 60).map(r => r.name);
  const top10 = [...results]
    .sort((a, b) => b.mismatchPercent - a.mismatchPercent)
    .slice(0, 10);

  lines.push('# All Screenshots Summary Report');
  lines.push('');
  lines.push(`> Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Run');
  lines.push('');
  lines.push(`- **Source:** ${cfg.source.url}`);
  lines.push(`- **Destination:** ${cfg.destination.url}`);
  lines.push(`- **Viewport:** ${cfg.viewport.width}x${cfg.viewport.height} @ ${cfg.viewport.deviceScaleFactor ?? 1}x`);
  lines.push(`- **Total sections compared:** ${totalSections}`);
  lines.push(`- **Total screenshots captured:** ${totalScreenshots}`);
  lines.push(`- **Average visual parity (pixel-derived):** ${averageVisualParity.toFixed(2)}%`);
  lines.push(`- **Sections below 90% parity:** ${below90.length ? below90.join(', ') : 'none'}`);
  lines.push(`- **Sections below 60% parity:** ${below60.length ? below60.join(', ') : 'none'}`);
  lines.push('');
  lines.push('## Section table');
  lines.push('');
  lines.push('| Section | Source Screenshot | Destination Screenshot | Diff Screenshot | Score | P0 | P1 | P2 | P3 | Status |');
  lines.push('|---|---|---|---|---:|---:|---:|---:|---:|---|');
  for (const r of results) {
    const score = (100 - r.mismatchPercent).toFixed(2);
    lines.push(
      `| ${r.name} ` +
      `| ${rel(runRoot, r.sourcePath)} ` +
      `| ${rel(runRoot, r.destinationPath)} ` +
      `| ${rel(runRoot, r.diffPath)} ` +
      `| ${score} ` +
      `| 0 | 0 | 0 | 0 ` +
      `| ${statusLabel(r.mismatchPercent)} |`,
    );
  }
  lines.push('');
  lines.push('## Top 10 visual mismatches (pixel layer)');
  lines.push('');
  lines.push('| Rank | Section | Pixel mismatch % | Per-section report |');
  lines.push('|---:|---|---:|---|');
  top10.forEach((r, i) => {
    lines.push(`| ${i + 1} | ${r.name} | ${r.mismatchPercent.toFixed(2)} | sections/${r.name}/SCREENSHOT_REPORT.md |`);
  });
  lines.push('');
  lines.push('## Top Falcon components causing mismatch');
  lines.push('');
  lines.push('_Falcon Eyes (the skill) fills this — derived from each per-section `Falcon components involved` block._');
  lines.push('');
  lines.push('## Top Tailwind / token issues');
  lines.push('');
  lines.push('_Falcon Eyes (the skill) fills this — derived from each per-section `Tailwind / token issues` block._');
  lines.push('');
  lines.push('## Top missing dynamic APIs');
  lines.push('');
  lines.push('_Falcon Eyes (the skill) fills this — derived from each per-section `Dynamic API issues` and `Missing shared component capabilities` blocks._');
  lines.push('');
  lines.push('## Recommended repair order');
  lines.push('');
  lines.push('_Falcon Eyes (the skill) fills this once severities are finalized. Default ordering: P0 → P1 → P2 → P3, then by section weight._');
  lines.push('');
  lines.push('## Reporting contract');
  lines.push('');
  lines.push('Every run produces: one report per section under `sections/<name>/`, one combined summary (this file), one screenshot index (`ALL_SCREENSHOTS_INDEX.md`), one semantic mismatch backlog (`SEMANTIC_MISMATCH_BACKLOG.md`), and one Falcon component repair map (`FALCON_COMPONENT_REPAIR_MAP.md`).');
  fs.writeFileSync(path.join(runRoot, 'ALL_SCREENSHOTS_SUMMARY_REPORT.md'), lines.join('\n'), 'utf8');
}

function writeSemanticTemplates(runRoot: string, cfg: FalconEyesConfig, results: PerSectionResult[]): void {
  writePerSectionReports(runRoot, cfg, results);
  writeRunLevelReports(runRoot, cfg, results);
  writeAllScreenshotsIndex(runRoot, results);
  writeAllScreenshotsSummaryReport(runRoot, cfg, results);
}

async function captureSide(
  browser: Browser,
  url: string,
  outDir: string,
  sections: SectionConfig[],
  side: 'source' | 'destination',
  cfg: FalconEyesConfig,
  onSection: (s: SectionConfig, side: 'source' | 'destination', file: string | null, note: string | null) => void,
): Promise<void> {
  const ctx = await browser.newContext({
    viewport: { width: cfg.viewport.width, height: cfg.viewport.height },
    deviceScaleFactor: cfg.viewport.deviceScaleFactor ?? 1,
  });
  const page = await ctx.newPage();
  try {
    await gotoAndPrepare(page, url, cfg);
    if (cfg.output.writeFullPage) {
      const fullPath = path.join(outDir, '_full-page.png');
      await page.screenshot({ path: fullPath, fullPage: true });
    }
    if (cfg.output.writeSectionScreenshots) {
      for (const s of sections) {
        const { filePath, note } = await captureSection(page, s, side, outDir, cfg);
        onSection(s, side, filePath, note);
      }
    }
  } finally {
    await ctx.close();
  }
}

async function main(): Promise<void> {
  const argv = parseArgs(process.argv.slice(2));
  const cfg = readJson<FalconEyesConfig>(argv.config);
  const sectionsFile = readJson<SectionsFile>(argv.sections);

  if (argv.source) cfg.source.url = argv.source;
  if (argv.destination) cfg.destination.url = argv.destination;

  let sections = sectionsFile.sections || [];
  if (argv.only && argv.only.length > 0) {
    const set = new Set(argv.only);
    sections = sections.filter(s => set.has(s.name));
  }

  const runStamp = stamp();
  const runRoot = argv.out || path.join(cfg.output.rootDir, runStamp);
  const sourceDir = path.join(runRoot, 'source');
  const destinationDir = path.join(runRoot, 'destination');
  const diffDir = path.join(runRoot, 'diff');
  const metaDir = path.join(runRoot, 'metadata');
  ensureDir(sourceDir);
  ensureDir(destinationDir);
  ensureDir(diffDir);
  ensureDir(metaDir);

  const perSection: Record<string, PerSectionResult> = {};
  for (const s of sections) {
    perSection[s.name] = {
      name: s.name,
      sourcePath: null,
      destinationPath: null,
      diffPath: null,
      width: 0,
      height: 0,
      diffPixels: 0,
      totalPixels: 0,
      mismatchPercent: 0,
      capturedAt: new Date().toISOString(),
      notes: [],
    };
  }

  const browser = await chromium.launch({ headless: cfg.headless });
  try {
    await captureSide(browser, cfg.source.url, sourceDir, sections, 'source', cfg, (s, _side, file, note) => {
      perSection[s.name].sourcePath = file;
      if (note) perSection[s.name].notes.push(`source: ${note}`);
    });
    await captureSide(browser, cfg.destination.url, destinationDir, sections, 'destination', cfg, (s, _side, file, note) => {
      perSection[s.name].destinationPath = file;
      if (note) perSection[s.name].notes.push(`destination: ${note}`);
    });
  } finally {
    await browser.close();
  }

  if (!argv.noPixelmatch && cfg.output.writeDiffImages) {
    for (const s of sections) {
      const rec = perSection[s.name];
      if (!rec.sourcePath || !rec.destinationPath) continue;
      const srcPng = PNG.sync.read(fs.readFileSync(rec.sourcePath));
      const dstPng = PNG.sync.read(fs.readFileSync(rec.destinationPath));
      const { diff, diffPixels, totalPixels } = diffPair(srcPng, dstPng, cfg);
      const diffPath = path.join(diffDir, `${s.name}-diff.png`);
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      rec.diffPath = diffPath;
      rec.diffPixels = diffPixels;
      rec.totalPixels = totalPixels;
      rec.mismatchPercent = totalPixels === 0 ? 0 : (diffPixels / totalPixels) * 100;
      rec.width = diff.width;
      rec.height = diff.height;
    }
  }

  const runMeta = {
    runStamp,
    runRoot,
    generatedAt: new Date().toISOString(),
    source: cfg.source,
    destination: cfg.destination,
    viewport: cfg.viewport,
    wait: cfg.wait,
    pixelmatch: cfg.pixelmatch,
    sectionCount: sections.length,
  };
  fs.writeFileSync(path.join(metaDir, 'run.json'), JSON.stringify(runMeta, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(metaDir, 'pixelmatch.json'),
    JSON.stringify(Object.values(perSection), null, 2),
    'utf8',
  );

  if (cfg.output.writeMarkdown) writeMarkdownReport(runRoot, cfg, Object.values(perSection));
  if (cfg.output.writeJson) writeJsonReport(runRoot, cfg, Object.values(perSection));
  writeSemanticTemplates(runRoot, cfg, Object.values(perSection));

  console.log(`Falcon Eyes run complete: ${runRoot}`);
}

main().catch(err => {
  console.error('Falcon Eyes failed:', err);
  process.exit(1);
});
