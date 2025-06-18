#!/usr/bin/env node
import { readdirSync, statSync, cpSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);
const appsDir = join(root, 'apps');
const docsDir = join(root, 'docs');

mkdirSync(docsDir, { recursive: true });

const apps = readdirSync(appsDir).filter(app =>
  statSync(join(appsDir, app)).isDirectory()
);

for (const app of apps) {
  console.log(`Building ${app}...`);
  execSync('vite build', { stdio: 'inherit', cwd: root, env: { ...process.env, APP: app } });
}

cpSync(join(root, 'index.html'), join(docsDir, 'index.html'));
cpSync(join(root, 'app-index.csv'), join(docsDir, 'app-index.csv'));
cpSync(join(root, 'pics'), join(docsDir, 'pics'), { recursive: true });

