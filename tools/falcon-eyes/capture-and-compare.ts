/*
 * Falcon Eyes — capture-and-compare.ts
 * Path: tools/falcon-eyes/capture-and-compare.ts
 * Created: 2026-05-15
 *
 * Captures source + destination screenshots (full page + named sections),
 * runs pixelmatch per pair, and writes:
 *
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/source/*
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/destination/*
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/diff/*
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/metadata/run.json
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/metadata/pixelmatch.json
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/FALCON_EYES_REPORT.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/FALCON_EYES_DATA.json
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/SEMANTIC_MISMATCH_BACKLOG.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/SECTION_SCORECARD.md
 *   reports/falcon-eyes/<YYYY-MM-DD-HHmm>/FALCON_COMPONENT_REPAIR_MAP.md
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

function writeSemanticTemplates(runRoot: string, results: PerSectionResult[]): void {
  const backlog: string[] = [];
  backlog.push('# Semantic Mismatch Backlog');
  backlog.push('');
  backlog.push('> Pixel diff is just evidence. For every visible defect below, replace the placeholder block with a full semantic-mismatch record using the format from `tools/falcon-eyes/semantic-mismatch-template.md`.');
  backlog.push('');
  for (const r of results) {
    backlog.push(`## ${r.name} (${r.mismatchPercent.toFixed(2)}% mismatch)`);
    backlog.push('');
    backlog.push(`- source: \`${r.sourcePath ? path.relative(runRoot, r.sourcePath).replace(/\\/g, '/') : '—'}\``);
    backlog.push(`- destination: \`${r.destinationPath ? path.relative(runRoot, r.destinationPath).replace(/\\/g, '/') : '—'}\``);
    backlog.push(`- diff: \`${r.diffPath ? path.relative(runRoot, r.diffPath).replace(/\\/g, '/') : '—'}\``);
    backlog.push('');
    backlog.push('### Mismatches');
    backlog.push('');
    backlog.push('_Add one block per visible defect using the template skeleton._');
    backlog.push('');
  }
  fs.writeFileSync(path.join(runRoot, 'SEMANTIC_MISMATCH_BACKLOG.md'), backlog.join('\n'), 'utf8');

  const score: string[] = [];
  score.push('# Section Scorecard');
  score.push('');
  score.push('| Section | Pixel mismatch % | Semantic parity % (filled by Falcon Eyes) | Severity caps | Notes |');
  score.push('|---|---:|---:|---|---|');
  for (const r of results) {
    score.push(`| ${r.name} | ${r.mismatchPercent.toFixed(2)} |  |  | ${r.notes.join('; ') || ''} |`);
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
  repair.push('| _FE-...-0001_ |  |  |  |  |  |');
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
      const diffPath = path.join(diffDir, `${s.name}.diff.png`);
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
  writeSemanticTemplates(runRoot, Object.values(perSection));

  console.log(`Falcon Eyes run complete: ${runRoot}`);
}

main().catch(err => {
  console.error('Falcon Eyes failed:', err);
  process.exit(1);
});
