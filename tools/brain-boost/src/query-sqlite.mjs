/*
 * query-sqlite.mjs — Tier 2: KNN query against the persisted sqlite-vec store (no re-embed of corpus).
 * Run: npm run query-sqlite -- "shadow dom dual render" --limit 6
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { embed } from './embed.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(__dirname, '..', '.cache', 'brain.db');

const argv = process.argv.slice(2);
let limit = 6;
const li = argv.indexOf('--limit');
if (li >= 0) { limit = parseInt(argv[li + 1], 10) || 6; argv.splice(li, 2); }
const query = argv.join(' ').trim();
if (!query) { console.error('Usage: npm run query-sqlite -- "<text>" [--limit N]'); process.exit(1); }
if (!fs.existsSync(DB)) { console.error('No brain.db. Run `npm run build-sqlite` first.'); process.exit(1); }

const db = new Database(DB, { readonly: true });
sqliteVec.load(db);
const qv = await embed(query);

const rows = db.prepare(`
  WITH knn AS (
    SELECT rowid, distance FROM vec_nodes WHERE embedding MATCH ? AND k = ?
  )
  SELECT m.node_id, m.type, m.name, knn.distance
  FROM knn JOIN nodes_meta m ON m.rowid = knn.rowid
  ORDER BY knn.distance
`).all(Buffer.from(new Float32Array(qv).buffer), limit);

console.log(`\nKNN over persisted sqlite-vec store — "${query}" (${rows.length} hits):`);
rows.forEach((r, i) => console.log(`  ${String(i + 1).padStart(2)}. ${r.node_id}  [${r.type}]${r.name && r.name !== r.node_id ? '  — ' + r.name : ''}  (dist ${r.distance.toFixed(3)})`));
console.log('');
db.close();
