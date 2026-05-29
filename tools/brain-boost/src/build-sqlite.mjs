/*
 * build-sqlite.mjs — Tier 2: persist the embeddings to an on-disk sqlite-vec store
 * so the semantic index survives between runs (vs the in-memory cosine scan).
 * Output: .cache/brain.db  (vec_nodes virtual table + nodes_meta)
 * Run: npm run build-sqlite
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(__dirname, '..', '.cache', 'brain-index.json');
const DB = path.join(__dirname, '..', '.cache', 'brain.db');

if (!fs.existsSync(INDEX)) { console.error('No index. Run `npm run index` first.'); process.exit(1); }
const { docs, dims } = JSON.parse(fs.readFileSync(INDEX, 'utf8'));

if (fs.existsSync(DB)) fs.rmSync(DB);
const db = new Database(DB);
sqliteVec.load(db);

const { sqlite_version, vec_version } = db.prepare('select sqlite_version() as sqlite_version, vec_version() as vec_version').get();
console.log(`sqlite ${sqlite_version}  sqlite-vec ${vec_version}`);

db.exec('CREATE TABLE nodes_meta(rowid INTEGER PRIMARY KEY, node_id TEXT, type TEXT, name TEXT)');
db.exec(`CREATE VIRTUAL TABLE vec_nodes USING vec0(embedding float[${dims}])`);

const insMeta = db.prepare('INSERT INTO nodes_meta(rowid, node_id, type, name) VALUES (?, ?, ?, ?)');
const insVec = db.prepare('INSERT INTO vec_nodes(rowid, embedding) VALUES (?, ?)');
const tx = db.transaction(() => {
  docs.forEach((d, i) => {
    const rowid = i + 1;
    insMeta.run(rowid, d.id, d.type, d.name);
    insVec.run(BigInt(rowid), Buffer.from(new Float32Array(d.vector).buffer));
  });
});
tx();

const n = db.prepare('SELECT count(*) c FROM vec_nodes').get().c;
console.log(`Persisted ${n} vectors → ${path.relative(process.cwd(), DB)} (${(fs.statSync(DB).size / 1024 / 1024).toFixed(1)} MB)`);
db.close();
