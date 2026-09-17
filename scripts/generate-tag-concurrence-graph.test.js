// @vitest-environment node
import { test, expect } from 'vitest';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const script = new URL('./generate-tag-concurrence-graph.js', import.meta.url);
function fixture(csv, check) {
  const root = mkdtempSync(join(tmpdir(), 'tag-refresh-'));
  try {
    mkdirSync(join(root, 'scripts')); writeFileSync(join(root, 'package.json'), '{"type":"module"}');
    copyFileSync(script, join(root, 'scripts/generate.js')); writeFileSync(join(root, 'app-index.csv'), csv);
    const run = () => execFileSync(process.execPath, [join(root, 'scripts/generate.js')], { stdio: 'pipe' });
    const read = name => JSON.parse(readFileSync(join(root, 'apps/tag-concurrence-explorer/public', name), 'utf8'));
    check({ run, read, root });
  } finally { rmSync(root, { recursive: true, force: true }); }
}
test('generator counts each tag and pair once per app and records refresh provenance', () => {
  const csv = '#,name,tags\n1,first,"risk, decision, risk"\n2,second,"risk, decision"\n3,solo,other\n';
  fixture(csv, ({ run, read }) => {
    run(); const graph = read('tag_concurrence_graph.json'), metadata = read('tag_concurrence_metadata.json');
    expect(graph.nodes).toEqual([{ id: 'decision', weight: 2 }, { id: 'other', weight: 1 }, { id: 'risk', weight: 2 }]);
    expect(graph.edges).toEqual([{ source: 'decision', target: 'risk', weight: 2 }]);
    expect(metadata).toMatchObject({ sourceAppCount: 3, nodeCount: 3, edgeCount: 1, sourceSha256: createHash('sha256').update(csv).digest('hex') });
    run(); expect(read('tag_concurrence_metadata.json').refreshedAt).toBe(metadata.refreshedAt);
  });
});
test('current catalogue regenerates the same 40 tags and 58 weighted pairs', () => {
  const csv = readFileSync(new URL('../app-index.csv', import.meta.url), 'utf8');
  const current = JSON.parse(readFileSync(new URL('../apps/tag-concurrence-explorer/public/tag_concurrence_graph.json', import.meta.url), 'utf8'));
  const provenance = JSON.parse(readFileSync(new URL('../apps/tag-concurrence-explorer/public/tag_concurrence_metadata.json', import.meta.url), 'utf8'));
  expect(provenance.sourceSha256).toBe(createHash('sha256').update(csv).digest('hex'));
  expect(provenance.sourceApps).toHaveLength(19);
  fixture(csv, ({ run, read }) => { run(); expect(read('tag_concurrence_graph.json')).toEqual(current); expect(read('tag_concurrence_metadata.json')).toMatchObject({ sourceAppCount: 19, nodeCount: 40, edgeCount: 58 }); });
});
test('malformed catalogue rows fail instead of silently claiming complete coverage', () => {
  fixture('#,name,tags\n1,first,risk,extra\n', ({ run }) => expect(run).toThrow());
});

test('empty or missing source columns fail without claiming a refresh', () => {
  for (const csv of ['', '#,name,other\n1,first,risk\n', '#,tags\n1,risk\n']) fixture(csv, ({ run }) => expect(run).toThrow());
});
