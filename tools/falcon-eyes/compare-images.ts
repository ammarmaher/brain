/*
 * Falcon Eyes — compare-images.ts
 * Path: tools/falcon-eyes/compare-images.ts
 * Created: 2026-05-15
 *
 * Standalone pixelmatch wrapper: takes two PNGs on disk and writes a diff PNG
 * + a JSON summary to the given output folder. Use when screenshots already
 * exist on disk (e.g. Claude captured them separately) and only the diff is
 * needed.
 *
 * Usage:
 *   npx tsx compare-images.ts --source ./a.png --destination ./b.png --out ./out
 *   npx tsx compare-images.ts --source ./a.png --destination ./b.png --out ./out --threshold 0.15
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

type Args = {
  source: string;
  destination: string;
  out: string;
  threshold: number;
  includeAA: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    source: '',
    destination: '',
    out: '',
    threshold: 0.1,
    includeAA: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--source': args.source = next; i++; break;
      case '--destination': args.destination = next; i++; break;
      case '--out': args.out = next; i++; break;
      case '--threshold': args.threshold = Number(next); i++; break;
      case '--include-aa': args.includeAA = true; break;
    }
  }
  if (!args.source || !args.destination || !args.out) {
    throw new Error('compare-images requires --source <png> --destination <png> --out <dir>');
  }
  return args;
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

function main(): void {
  const argv = parseArgs(process.argv.slice(2));
  fs.mkdirSync(argv.out, { recursive: true });

  const src = PNG.sync.read(fs.readFileSync(argv.source));
  const dst = PNG.sync.read(fs.readFileSync(argv.destination));
  const { a, b } = normalizeToSameSize(src, dst);
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: argv.threshold,
    includeAA: argv.includeAA,
    diffColor: [255, 0, 255],
  });
  const totalPixels = a.width * a.height;
  const mismatchPercent = totalPixels === 0 ? 0 : (diffPixels / totalPixels) * 100;

  const diffPath = path.join(argv.out, 'diff.png');
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  fs.writeFileSync(
    path.join(argv.out, 'diff.json'),
    JSON.stringify(
      {
        source: argv.source,
        destination: argv.destination,
        diffPath,
        width: a.width,
        height: a.height,
        diffPixels,
        totalPixels,
        mismatchPercent,
        threshold: argv.threshold,
        includeAA: argv.includeAA,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log(`compare-images: ${diffPixels}/${totalPixels} (${mismatchPercent.toFixed(2)}%) — ${diffPath}`);
}

main();
