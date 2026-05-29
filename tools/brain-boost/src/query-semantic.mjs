/*
 * query-semantic.mjs — answer a query 3 ways so the difference is visible:
 *   LEXICAL  (what the brain does today: all-tokens substring, fuse-style)
 *   SEMANTIC (transformers.js embedding + cosine — meaning, not words)
 *   HYBRID   (Orama BM25 full-text + semantic, score-merged)
 *
 * Run: npm run query -- "how do components and tailwind relate"
 *      npm run query -- "shadow dom dual render" --limit 8
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { create, insertMultiple, search } from '@orama/orama';
import { embed, cosine } from './embed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(__dirname, '..', '.cache', 'brain-index.json');

const argv = process.argv.slice(2);
let limit = 8;
const li = argv.indexOf('--limit');
if (li >= 0) { limit = parseInt(argv[li + 1], 10) || 8; argv.splice(li, 2); }
const query = argv.join(' ').trim();
if (!query) { console.error('Usage: npm run query -- "<text>" [--limit N]'); process.exit(1); }
if (!fs.existsSync(INDEX)) { console.error('No index found. Run `npm run index` first.'); process.exit(1); }

const { docs, model, dims } = JSON.parse(fs.readFileSync(INDEX, 'utf8'));

const norm = s => String(s || '').toLowerCase().replace(/[:_\-./\\]+/g, ' ').replace(/\s+/g, ' ').trim();

// --- LEXICAL: all query tokens must appear (mirrors query.js fallback) ---
function lexical(q, n) {
  const toks = norm(q).split(' ').filter(Boolean);
  return docs.filter(d => { const h = norm(`${d.id} ${d.name} ${d.text}`); return toks.every(t => h.includes(t)); })
    .slice(0, n).map(d => ({ id: d.id, type: d.type, name: d.name }));
}

// --- SEMANTIC: cosine over embeddings ---
async function semantic(q, n) {
  const qv = await embed(q);
  return docs.map(d => ({ id: d.id, type: d.type, name: d.name, score: cosine(qv, d.vector) }))
    .sort((a, b) => b.score - a.score).slice(0, n);
}

// --- HYBRID: Orama BM25 (full-text) merged with semantic ---
async function hybrid(q, n) {
  const db = await create({ schema: { id: 'string', type: 'string', name: 'string', text: 'string' } });
  await insertMultiple(db, docs.map(d => ({ id: d.id, type: d.type, name: d.name, text: d.text })));
  const bm = await search(db, { term: q, properties: ['name', 'text'], limit: 50 });
  const bmScore = new Map(bm.hits.map(h => [h.document.id, h.score]));
  const maxBm = Math.max(1e-9, ...[...bmScore.values()]);
  const qv = await embed(q);
  const merged = docs.map(d => {
    const sem = cosine(qv, d.vector);
    const lex = (bmScore.get(d.id) || 0) / maxBm;
    return { id: d.id, type: d.type, name: d.name, score: 0.6 * sem + 0.4 * lex };
  }).sort((a, b) => b.score - a.score).slice(0, n);
  return merged;
}

const show = (rows) => rows.map((r, i) =>
  `   ${String(i + 1).padStart(2)}. ${r.id}  [${r.type}]${r.name && r.name !== r.id ? '  — ' + r.name : ''}${r.score != null ? `  (${r.score.toFixed(3)})` : ''}`
).join('\n') || '   (none)';

console.log(`\nQuery: "${query}"   model=${model} ${dims}d   corpus=${docs.length} nodes\n`);
const lex = lexical(query, limit);
console.log(`[BEFORE] LEXICAL all-tokens (today's behavior) — ${lex.length} hit(s):`);
console.log(show(lex));
const sem = await semantic(query, limit);
console.log(`\n[AFTER] SEMANTIC by meaning — ${sem.length} hit(s):`);
console.log(show(sem));
const hyb = await hybrid(query, limit);
console.log(`\n[AFTER] HYBRID (Orama BM25 + semantic) — ${hyb.length} hit(s):`);
console.log(show(hyb));

const lexIds = new Set(lex.map(r => r.id));
const newFound = sem.filter(r => !lexIds.has(r.id));
console.log(`\nSemantic surfaced ${newFound.length} node(s) lexical search MISSED:`);
console.log(show(newFound.slice(0, limit)));
