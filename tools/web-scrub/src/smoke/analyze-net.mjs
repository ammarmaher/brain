import { readFileSync } from 'node:fs';
const dir = process.argv[2];
const n = JSON.parse(readFileSync(dir + '/network.json', 'utf8'));
const api = n.filter((r) => /hierarchy|wallet|commerce|charging|accounts|Node|setting/i.test(r.url));
console.log('total requests:', n.length, '| api/data calls:', api.length);
for (const r of api) console.log(' ', r.status, r.method, r.url.slice(0, 100));
const bad = n.filter((r) => r.status >= 400);
console.log('--- failures (' + bad.length + ') ---');
for (const r of bad) console.log(' ', r.status, r.method, r.url.slice(0, 100));
