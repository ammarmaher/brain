/*
 * graph-health.mjs — graphology degree/centrality + Louvain communities over the brain graph.
 * Surfaces: orphan nodes (degree 0) by type, most-connected nodes, auto-detected communities.
 * Run: npm run health
 */
import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import { loadGraph } from './load-brain.mjs';

const { nodes, edges } = loadGraph();
const ids = new Set(nodes.map(n => n.id));

// Undirected simple graph: real relationships only (edges whose endpoints both exist).
const g = new Graph({ type: 'undirected' });
for (const n of nodes) if (!g.hasNode(n.id)) g.addNode(n.id, { type: n.type || 'unknown' });
let usable = 0, dangling = 0;
for (const e of edges) {
  if (!ids.has(e.from) || !ids.has(e.to) || e.from === e.to) { dangling++; continue; }
  if (!g.hasEdge(e.from, e.to)) { g.addEdge(e.from, e.to); usable++; }
}

// Orphans = degree 0
const orphans = nodes.filter(n => g.degree(n.id) === 0);
const byType = {};
for (const o of orphans) byType[o.type || 'unknown'] = (byType[o.type || 'unknown'] || 0) + 1;

// Most-connected
const ranked = nodes.map(n => ({ id: n.id, type: n.type, deg: g.degree(n.id) }))
  .sort((a, b) => b.deg - a.deg).slice(0, 15);

// Communities (Louvain)
let communities = {}, nComm = 0, sizes = [];
try {
  communities = louvain(g);
  const counts = {};
  for (const c of Object.values(communities)) counts[c] = (counts[c] || 0) + 1;
  sizes = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  nComm = sizes.length;
} catch (e) { console.error('louvain warning:', e.message); }

const sampleFor = (commId) => {
  const member = Object.entries(communities).find(([, c]) => String(c) === String(commId));
  return member ? member[0] : '?';
};

console.log(`\n=== Falcon brain graph health ===`);
console.log(`Nodes: ${nodes.length}   Usable edges: ${usable}   Dangling edges (endpoint missing): ${dangling}`);
console.log(`\nORPHANS (degree 0): ${orphans.length}  (${((orphans.length / nodes.length) * 100).toFixed(0)}% of graph)`);
console.log('  by type:');
Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([t, c]) => console.log(`    ${String(t).padEnd(18)} ${c}`));

console.log(`\nMOST-CONNECTED nodes (degree):`);
ranked.forEach((r, i) => console.log(`  ${String(i + 1).padStart(2)}. ${r.id.padEnd(40)} [${r.type}]  deg=${r.deg}`));

console.log(`\nCOMMUNITIES (Louvain): ${nComm}`);
sizes.slice(0, 8).forEach(([c, n], i) => console.log(`  ${String(i + 1).padStart(2)}. community ${c}: ${n} nodes (e.g. ${sampleFor(c)})`));
console.log('');
