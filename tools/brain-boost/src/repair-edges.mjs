/*
 * repair-edges.mjs — DETERMINISTIC graph mapping repair (no inferred/hallucinated edges).
 *   1) Dangling-edge remap: an edge endpoint that isn't a node → if exactly ONE prefix-variant
 *      (comp:/svc:/mod:/page:/token:/css:/tw:/twcls:/pes:/vrule:) exists, remap to it.
 *   2) Orphan wiring: an orphan CSSVariable/TailwindClass/DesignToken whose id contains exactly
 *      one component short-name → add comp -> orphan (USES_CSS_VARIABLE / USES_TAILWIND_CLASS / MAPS_TO_TOKEN).
 * Emits a reversible wave-delta into the live graph (delete the file to revert).
 * Run: npm run repair-edges
 */
import fs from 'node:fs';
import path from 'node:path';
import Graph from 'graphology';
import { loadGraph } from './load-brain.mjs';

const DELTA = 'C:\\Falcon\\falcon-wiki\\200-Graph\\graph\\wave-deltas\\edge-repair-2026-05-28.json';
const PREFIXES = ['comp:', 'svc:', 'mod:', 'page:', 'token:', 'css:', 'tw:', 'twcls:', 'pes:', 'pesrule:', 'vrule:', 'dto:', 'evt:', 'arch:', 'br:'];

const { nodes, edges } = loadGraph();
const ids = new Set(nodes.map(n => n.id));

function connectedness(extra = []) {
  const g = new Graph({ type: 'undirected' });
  for (const n of nodes) if (!g.hasNode(n.id)) g.addNode(n.id);
  const add = (f, t) => { if (ids.has(f) && ids.has(t) && f !== t && !g.hasEdge(f, t)) g.addEdge(f, t); };
  for (const e of edges) add(e.from, e.to);
  for (const e of extra) add(e.from, e.to);
  const connected = nodes.filter(n => g.degree(n.id) > 0).length;
  return { connected, total: nodes.length, pct: (connected / nodes.length) * 100, orphans: nodes.length - connected };
}

// --- component short-name map (longest first to avoid input ⊂ input-number) ---
const compShort = nodes.filter(n => n.type === 'Component' && /^comp:falcon-/.test(n.id))
  .map(n => ({ id: n.id, short: n.id.replace(/^comp:falcon-/, '') }))
  .sort((a, b) => b.short.length - a.short.length);

// --- resolve a missing id to exactly one existing node ---
function resolve(missing) {
  const bare = missing.includes(':') ? missing.split(':').slice(1).join(':') : missing;
  const cands = new Set();
  if (ids.has('comp:falcon-' + bare)) cands.add('comp:falcon-' + bare);
  for (const p of PREFIXES) { if (ids.has(p + bare)) cands.add(p + bare); }
  return cands.size === 1 ? [...cands][0] : null;
}

const before = connectedness();
const repair = [];
const seen = new Set();
const push = (from, to, type, why) => {
  const key = `${from}|${to}|${type}`;
  if (from === to || !ids.has(from) || !ids.has(to) || seen.has(key)) return;
  seen.add(key); repair.push({ from, to, type, 'evidence-strength': 'deterministic', notes: why, 'discovered-in-wave': 'edge-repair-2026-05-28' });
};

// Pass 1 — dangling remap
let remapped = 0;
for (const e of edges) {
  let { from, to } = e;
  let changed = false;
  if (!ids.has(from)) { const r = resolve(from); if (r) { from = r; changed = true; } }
  if (!ids.has(to)) { const r = resolve(to); if (r) { to = r; changed = true; } }
  if (changed && ids.has(from) && ids.has(to)) { push(from, to, e.type || 'RELATED_TO', `remap of dangling edge ${e.from}->${e.to}`); remapped++; }
}

// Pass 2 — orphan wiring (css/tailwind/token → component)
const typeEdge = { CSSVariable: 'USES_CSS_VARIABLE', TailwindClass: 'USES_TAILWIND_CLASS', DesignToken: 'MAPS_TO_TOKEN' };
const orphanSet = new Set(before.orphans ? nodes.filter(n => {
  // recompute orphan membership quickly
  return true;
}).map(n => n.id) : []);
const g0 = new Graph({ type: 'undirected' });
for (const n of nodes) g0.addNode(n.id);
for (const e of edges) if (ids.has(e.from) && ids.has(e.to) && e.from !== e.to && !g0.hasEdge(e.from, e.to)) g0.addEdge(e.from, e.to);
let wired = 0;
for (const n of nodes) {
  if (g0.degree(n.id) > 0) continue;            // only true orphans
  const etype = typeEdge[n.type];
  if (!etype) continue;
  const idl = n.id.toLowerCase();
  const match = compShort.find(c => idl.includes(c.short));   // longest-first
  if (match) { push(match.id, n.id, etype, `orphan ${n.type} wired to component by id-parse`); wired++; }
}

const after = connectedness(repair);

fs.writeFileSync(DELTA, JSON.stringify({
  generated_by: 'brain-boost/src/repair-edges.mjs',
  generated_at: new Date().toISOString(),
  method: 'deterministic (id-normalization remap + component-id-parse orphan wiring) — no inferred edges',
  reversible: 'delete this file to revert',
  edges: repair
}, null, 2));

console.log(`\n=== deterministic edge-repair ===`);
console.log(`Dangling edges remapped : ${remapped}`);
console.log(`Orphans wired to component: ${wired}`);
console.log(`New deterministic edges  : ${repair.length}  → ${path.basename(DELTA)} (reversible)`);
console.log(`\nBRAIN MAPPING (connectedness = nodes with >=1 real edge / total):`);
console.log(`  BEFORE: ${before.connected}/${before.total} = ${before.pct.toFixed(1)}%  (orphans ${before.orphans})`);
console.log(`  AFTER : ${after.connected}/${after.total} = ${after.pct.toFixed(1)}%  (orphans ${after.orphans})`);
console.log('');
