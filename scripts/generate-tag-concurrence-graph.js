#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);
const csvPath = join(root, 'app-index.csv');
const outputDir = join(root, 'apps', 'tag-concurrence-explorer', 'public');
const outputFile = join(outputDir, 'tag_concurrence_graph.json');

const csvText = readFileSync(csvPath, 'utf8');

const parseCsvLine = (line) => {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  fields.push(current.trim());
  return fields.map((field) => field.replace(/^"|"$/g, ''));
};

const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
if (lines.length === 0) {
  console.warn('app-index.csv is empty.');
  process.exit(0);
}

const header = parseCsvLine(lines[0]);
const tagIndex = header.findIndex((column) => column.trim().toLowerCase() === 'tags');
if (tagIndex === -1) {
  console.warn('No tags column found in app-index.csv.');
  process.exit(0);
}

const tagCount = new Map();
const pairCount = new Map();

for (const line of lines.slice(1)) {
  const fields = parseCsvLine(line);
  if (fields.length !== header.length) {
    continue;
  }

  const tagField = fields[tagIndex];
  if (!tagField) {
    continue;
  }

  const tags = tagField
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  if (tags.length === 0) {
    continue;
  }

  const uniqueTags = Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));

  for (const tag of uniqueTags) {
    tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
  }

  for (let i = 0; i < uniqueTags.length; i += 1) {
    for (let j = i + 1; j < uniqueTags.length; j += 1) {
      const key = `${uniqueTags[i]}||${uniqueTags[j]}`;
      pairCount.set(key, (pairCount.get(key) ?? 0) + 1);
    }
  }
}

const nodes = Array.from(tagCount.entries())
  .map(([tag, count]) => ({ id: tag, weight: count }))
  .sort((a, b) => a.id.localeCompare(b.id));

const edges = Array.from(pairCount.entries())
  .map(([key, count]) => {
    const [source, target] = key.split('||');
    return { source, target, weight: count };
  })
  .sort((a, b) => {
    const sourceCompare = a.source.localeCompare(b.source);
    return sourceCompare !== 0 ? sourceCompare : a.target.localeCompare(b.target);
  });

const output = { nodes, edges };

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

const docsTarget = join(root, 'docs', 'apps', 'tag-concurrence-explorer');
if (existsSync(docsTarget)) {
  mkdirSync(docsTarget, { recursive: true });
  cpSync(outputFile, join(docsTarget, 'tag_concurrence_graph.json'));
}

console.log(
  `Generated ${outputFile} with ${nodes.length} nodes and ${edges.length} edges.`
);
