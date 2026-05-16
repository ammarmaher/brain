#!/usr/bin/env node
/***
 * Brain SK vault-search — Pattern C semantic search over the Obsidian vault
 * without launching Obsidian. Reuses Smart Connections' bge-micro-v2 embeddings.
 ***/

import { readdir, readFile, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline, env as txEnv } from '@xenova/transformers';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CACHE = join(SCRIPT_DIR, 'model-cache');
const DEFAULT_VAULT = 'C:/Falcon/Brain SK/_obsidian';
const VAULT = resolve(process.env.VAULT || DEFAULT_VAULT);
const TOP_N = Number(process.env.TOP_N || 10);
const MIN_SCORE = Number(process.env.MIN_SCORE || 0);
const SOURCE_MODEL_KEY = 'TaylorAI/bge-micro-v2';
const RUNTIME_MODEL = 'Xenova/bge-micro-v2';
const EMBED_DIR = join(VAULT, '.smart-env', 'multi');

// Persistent filesystem cache so the model is downloaded once.
// Override with MODEL_PATH to point at a pre-downloaded local copy.
txEnv.cacheDir = process.env.MODEL_PATH || DEFAULT_CACHE;
txEnv.allowLocalModels = true;
txEnv.localModelPath = txEnv.cacheDir;
txEnv.useBrowserCache = false;

const query = process.argv.slice(2).join(' ').trim();
if (!query) {
  console.error([
    'Usage:  node vault-search.mjs "<your query>"',
    '',
    'Options (env vars):',
    '  VAULT=<path>       Override vault root (default: ' + DEFAULT_VAULT + ')',
    '  TOP_N=<n>          Number of results (default: 10)',
    '  MIN_SCORE=<float>  Drop matches below this cosine score (default: 0)',
    '',
    'Examples:',
    '  node vault-search.mjs "where do component dossiers live"',
    '  TOP_N=20 node vault-search.mjs "OCS validation rules"',
  ].join('\n'));
  process.exit(1);
}

async function loadEntries() {
  try {
    await access(EMBED_DIR);
  } catch {
    throw new Error(`Embedding store not found: ${EMBED_DIR}\nOpen the vault in Obsidian once so Smart Connections can generate embeddings.`);
  }
  const files = (await readdir(EMBED_DIR)).filter(f => f.endsWith('.ajson'));
  if (!files.length) throw new Error(`No .ajson embeddings in ${EMBED_DIR}.`);

  const entries = [];
  for (const f of files) {
    const raw = (await readFile(join(EMBED_DIR, f), 'utf8')).trim();
    if (!raw) continue;
    let obj;
    try {
      obj = JSON.parse('{' + raw.replace(/,\s*$/, '') + '}');
    } catch (err) {
      console.error(`! Could not parse ${f}: ${err.message}`);
      continue;
    }
    for (const [key, val] of Object.entries(obj)) {
      const vec = val?.embeddings?.[SOURCE_MODEL_KEY]?.vec;
      if (!Array.isArray(vec) || !vec.length) continue;
      entries.push({
        key,
        path: val.path || key.split(':')[1],
        kind: key.startsWith('smart_blocks:') ? 'block' : 'source',
        vec,
      });
    }
  }
  return entries;
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

async function embedQuery(text) {
  const extractor = await pipeline('feature-extraction', RUNTIME_MODEL, { quantized: true });
  const out = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(out.data);
}

function formatRow(r) {
  const score = r.score.toFixed(4);
  if (r.kind === 'block') {
    const heading = r.key.replace(`smart_blocks:${r.path}`, '').replace(/^#/, '');
    return `  ${score}  ↳ ${r.path}  ${heading || '(intro)'}`;
  }
  return `  ${score}  ${r.path}`;
}

async function main() {
  console.error(`Vault: ${VAULT}`);
  console.error('Loading embeddings…');
  const entries = await loadEntries();
  const noteCount = new Set(entries.map(e => e.path)).size;
  console.error(`Loaded ${entries.length} vectors across ${noteCount} notes.`);

  console.error(`Embedding query with ${RUNTIME_MODEL}…`);
  const qvec = await embedQuery(query);

  const scored = entries.map(e => ({ ...e, score: cosine(qvec, e.vec) }));
  scored.sort((a, b) => b.score - a.score);

  const results = scored.filter(r => r.score >= MIN_SCORE).slice(0, TOP_N);

  console.log(`\nTop ${results.length} matches for: "${query}"\n`);
  if (!results.length) {
    console.log('  (no matches above MIN_SCORE)');
    return;
  }
  for (const r of results) console.log(formatRow(r));
  console.log('');
}

main().catch(err => {
  console.error('\n✖ ' + err.message);
  const msg = String(err.message || err);
  if (msg.includes('fetch failed') || msg.includes('ENOTFOUND') || msg.includes('ECONNRESET') || msg.includes('401')) {
    console.error('\nLikely cause: this network blocks huggingface.co.');
    console.error('Fixes:');
    console.error('  1) Run once on an unblocked network — the model is cached at:');
    console.error('     ' + txEnv.cacheDir);
    console.error('  2) Or download the 4 files from huggingface.co/Xenova/bge-micro-v2');
    console.error('     into ' + txEnv.cacheDir + '/Xenova/bge-micro-v2/');
    console.error('     (onnx/model_quantized.onnx, tokenizer.json, tokenizer_config.json, config.json)');
    console.error('  3) Or use Obsidian directly: Smart Lookup view (same embeddings, working today).');
  }
  process.exit(1);
});
