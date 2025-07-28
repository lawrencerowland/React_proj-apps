#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

const csvPath = join(root, 'app-index.csv');
const outputDir = join(root, 'apps', 'tag-concurrence-explorer', 'public');
const outputPath = join(outputDir, 'tag_concurrence_graph.json');

function parseLine(line){
  const result = [];
  let cur = '';
  let inQuotes = false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(ch==='"'){
      if(inQuotes && line[i+1]==='"'){
        cur += '"';
        i++;
      }else{
        inQuotes = !inQuotes;
      }
    }else if(ch===',' && !inQuotes){
      result.push(cur);
      cur = '';
    }else{
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(text){
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if(!lines.length) return [];
  const headers = parseLine(lines[0].replace(/^\uFEFF/, ''));
  const records = [];
  for(let i=1;i<lines.length;i++){
    const fields = parseLine(lines[i]);
    if(fields.length !== headers.length) continue;
    const rec = {};
    headers.forEach((h,idx)=>{
      rec[h] = fields[idx].replace(/^"|"$/g, '');
    });
    records.push(rec);
  }
  return records;
}

const csvText = readFileSync(csvPath, 'utf-8');
const records = parseCSV(csvText);

const tagCount = new Map();
const pairCount = new Map();

for(const rec of records){
  if(!rec.tags) continue;
  const tags = rec.tags.split(',').map(t => t.trim()).filter(Boolean);
  if(!tags.length) continue;
  const unique = [...new Set(tags)];
  for(const t of unique){
    tagCount.set(t, (tagCount.get(t)||0)+1);
  }
  unique.sort();
  for(let i=0;i<unique.length;i++){
    for(let j=i+1;j<unique.length;j++){
      const key = `${unique[i]}|||${unique[j]}`;
      pairCount.set(key, (pairCount.get(key)||0)+1);
    }
  }
}

const nodes = [];
for(const [tag,count] of tagCount){
  nodes.push({ id: tag, weight: count });
}
const edges = [];
for(const [key,count] of pairCount){
  const [a,b] = key.split('|||');
  edges.push({ source: a, target: b, weight: count });
}

const graph = { nodes, edges };
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, JSON.stringify(graph, null, 4), 'utf-8');
console.log(`Generated ${outputPath} with ${nodes.length} nodes and ${edges.length} edges`);
