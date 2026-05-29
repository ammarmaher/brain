#!/usr/bin/env node
/***
 * Falcon Brain — unified index (brain-index)
 * Phase 1 of BRAIN-NEURAL-LINK-PLAN-2026-05-18.
 *
 * Walks the 7 Brain stores, chunks every .md / .txt on heading boundaries,
 * writes one ranked-search index to Brain/brain-index/index.ndjson.
 *
 * LEXICAL MODE (current): stores chunk text only — brain-search.mjs ranks by
 * BM25. Needs no model and no network. The embedding upgrade later adds a
 * `vec` field to each line; the file format is forward-compatible.
 *
 * Env:
 *   STORE=<id>    index a single store only
 *   LIMIT=<n>     cap total files
 *   OUT_DIR=<p>   override output dir (default C:/Falcon/Brain/brain-index)
 *   MAX_CHUNK=<n> chars per chunk before sub-split (default 1800)
 ***/
import { readdir, readFile, writeFile, stat, mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { join, relative } from 'node:path';

const OUT_DIR = process.env.OUT_DIR || 'C:/Falcon/Brain/brain-index';
const MAX_CHUNK = Number(process.env.MAX_CHUNK || 1800);
const ONLY_STORE = process.env.STORE || '';
const FILE_LIMIT = Number(process.env.LIMIT || 0);

// The 7 canonical Brain stores. The robocopy mirror (Brain SK/outputs) is
// intentionally NOT listed — it duplicates Brain Outputs (Lever 2).
const STORES = [
  { id: 'authority-dataset', root: 'C:/Falcon/Brain Outputs/datasets/authority-dataset', prefix: '[BRAIN-OUT]' },
  { id: 'understanding',     root: 'C:/Falcon/Brain Outputs/understanding',              prefix: '[BRAIN-OUT]' },
  { id: 'old-ui-dataset',    root: 'C:/Falcon/Brain Outputs/datasets/old-ui-dataset',    prefix: '[BRAIN-OUT]' },
  { id: 'prd',               root: 'C:/Falcon/PRD',                                      prefix: '[BRAIN-OUT]' },
  { id: 'falcon-wiki',       root: 'C:/Falcon/falcon-wiki',                              prefix: '[VAULT]' },
  { id: 'brain-sk-obsidian', root: 'C:/Falcon/Brain SK/_obsidian',                       prefix: '[BRAIN-SK]' },
  { id: 'brain-skills',      root: 'C:/Falcon/brain-skills',                             prefix: '[BRAIN-SK]' },
];

// _mounts is the wiki's junction folder into other stores — skip it or every
// store is indexed twice. Also skip VCS / build / Obsidian-internal dirs.
const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.obsidian', '.smart-env', '.trash',
  'dist', 'bin', 'obj', 'model-cache', '_mounts',
]);
const TEXT_EXT = ['.md', '.txt'];

async function walk(dir, acc) {
  let ents;
  try { ents = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(full, acc);
    } else if (e.isFile() && TEXT_EXT.some(x => e.name.toLowerCase().endsWith(x))) {
      acc.push(full);
    }
  }
}

function chunkText(text) {
  const lines = text.split(/\r?\n/);
  const sections = [];
  let cur = { heading: '(intro)', body: [] };
  for (const ln of lines) {
    const m = ln.match(/^#{1,6}\s+(.*)/);
    if (m) {
      if (cur.body.join('\n').trim()) sections.push(cur);
      cur = { heading: m[1].trim(), body: [ln] };
    } else cur.body.push(ln);
  }
  if (cur.body.join('\n').trim()) sections.push(cur);

  const chunks = [];
  for (const s of sections) {
    const body = s.body.join('\n').trim();
    if (!body) continue;
    if (body.length <= MAX_CHUNK) {
      chunks.push({ heading: s.heading, text: body });
    } else {
      for (let i = 0; i < body.length; i += MAX_CHUNK)
        chunks.push({ heading: s.heading, text: body.slice(i, i + MAX_CHUNK) });
    }
  }
  return chunks;
}

async function main() {
  console.error('Falcon Brain indexer — Phase 1 (lexical mode)');
  await mkdir(OUT_DIR, { recursive: true });
  const stores = ONLY_STORE ? STORES.filter(s => s.id === ONLY_STORE) : STORES;
  if (!stores.length) throw new Error(`Unknown STORE=${ONLY_STORE}`);

  let files = [];
  for (const s of stores) {
    const acc = [];
    await walk(s.root, acc);
    for (const f of acc) files.push({ store: s, path: f });
    console.error(`  ${s.id}: ${acc.length} text files`);
  }
  if (FILE_LIMIT) files = files.slice(0, FILE_LIMIT);
  console.error(`Total files to index: ${files.length}`);

  const outPath = join(OUT_DIR, 'index.ndjson');
  const out = createWriteStream(outPath, { encoding: 'utf8' });
  const manifest = {};
  let chunkCount = 0, fileCount = 0;
  const t0 = Date.now();

  for (const { store, path } of files) {
    let raw;
    try { raw = await readFile(path, 'utf8'); } catch { continue; }
    let st; try { st = await stat(path); } catch { st = { mtimeMs: 0 }; }
    const rel = relative(store.root, path).replace(/\\/g, '/');
    const chunks = chunkText(raw);
    manifest[`${store.id}/${rel}`] = { mtimeMs: st.mtimeMs, chunks: chunks.length };

    for (let ci = 0; ci < chunks.length; ci++) {
      const c = chunks[ci];
      out.write(JSON.stringify({
        id: `${store.id}:${rel}#${ci}`,
        storeId: store.id,
        relPath: rel,
        heading: c.heading,
        prefix: store.prefix,
        text: c.text,
      }) + '\n');
      chunkCount++;
    }
    fileCount++;
    if (fileCount % 500 === 0) {
      const rate = fileCount / ((Date.now() - t0) / 1000);
      console.error(`  ${fileCount}/${files.length} files · ${chunkCount} chunks · ${rate.toFixed(0)} files/s`);
    }
  }
  out.end();
  await new Promise(r => out.on('finish', r));

  await writeFile(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 0));
  const stats = {
    generatedAt: new Date().toISOString(),
    mode: 'lexical',
    stores: stores.map(s => s.id),
    files: fileCount,
    chunks: chunkCount,
    elapsedSec: Math.round((Date.now() - t0) / 1000),
  };
  await writeFile(join(OUT_DIR, 'stats.json'), JSON.stringify(stats, null, 2));
  console.error(`Done — ${fileCount} files, ${chunkCount} chunks, ${stats.elapsedSec}s`);
  console.error(`Index: ${outPath}`);
}

main().catch(e => { console.error('FATAL ' + (e.stack || e.message)); process.exit(1); });
