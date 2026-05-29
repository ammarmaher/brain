/*
 * index-semantic.mjs — embed brain nodes (+ optionally dossier files) → semantic index.
 * Output: .cache/brain-index.json  { model, dims, count, docs:[{id,kind,source,type,name,text,vector}] }
 * Run: npm run index               (nodes only — 533 docs)
 *      npm run index -- --dossiers  (nodes + 566 dossier files)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadGraph, nodeText } from './load-brain.mjs';
import { embedAll, EMBED_MODEL, EMBED_DIMS } from './embed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', '.cache', 'brain-index.json');
const FRONTEND = 'C:\\Falcon\\Brain Outputs\\understanding\\frontend';
const withDossiers = process.argv.includes('--dossiers');
const SKIP = new Set(['node_modules', '.git', 'dist', '.cache']);

const { nodes } = loadGraph();
const docs = nodes.map(n => ({
  id: n.id, kind: 'node', source: n.id, type: n.type || 'unknown',
  name: n.name || n.id, trust: n.trust || null, text: nodeText(n)
}));
console.log(`Loaded ${nodes.length} graph nodes.`);

if (withDossiers) {
  const md = [];
  (function walk(dir) {
    let ents = []; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name)); }
      else if (e.name.endsWith('.md')) md.push(path.join(dir, e.name));
    }
  })(FRONTEND);
  const CHUNK = 3000, OVERLAP = 200;
  let chunkCount = 0;
  for (const f of md) {
    let raw = ''; try { raw = fs.readFileSync(f, 'utf8'); } catch { continue; }
    const rel = path.relative(FRONTEND, f).replace(/\\/g, '/');
    const text = raw.replace(/\r/g, '');
    if (text.length <= CHUNK) {
      docs.push({ id: 'doc:' + rel, kind: 'dossier', source: rel, type: 'Dossier', name: rel, text });
      chunkCount++;
      continue;
    }
    let i = 0, n = 0;
    while (i < text.length) {
      docs.push({ id: `doc:${rel}#${n}`, kind: 'dossier', source: rel, type: 'Dossier', name: `${rel}#${n}`, text: text.slice(i, i + CHUNK) });
      i += CHUNK - OVERLAP; n++; chunkCount++;
    }
  }
  console.log(`Added ${md.length} dossier files → ${chunkCount} chunks (size ${CHUNK}, overlap ${OVERLAP}).`);
}

console.log(`Embedding ${docs.length} docs with ${EMBED_MODEL} (${EMBED_DIMS}d)...`);
const t0 = Date.now();
const vectors = await embedAll(docs.map(d => d.text), (done, total) => process.stdout.write(`\r  ${done}/${total}`));
process.stdout.write('\n');
docs.forEach((d, i) => { d.vector = vectors[i]; });

fs.writeFileSync(OUT, JSON.stringify({
  model: EMBED_MODEL, dims: EMBED_DIMS, count: docs.length,
  kinds: { node: docs.filter(d => d.kind === 'node').length, dossier: docs.filter(d => d.kind === 'dossier').length },
  built_at: new Date().toISOString(), docs
}));
console.log(`Indexed ${docs.length} docs in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${path.relative(process.cwd(), OUT)}`);
