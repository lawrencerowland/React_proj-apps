#!/usr/bin/env node
import { readdirSync, statSync, cpSync, mkdirSync, renameSync, existsSync, rmSync } from 'fs';
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
  const appPath = join(appsDir, app);
  if (existsSync(join(appPath, 'src'))) {
    execSync('vite build', { stdio: 'inherit', cwd: root, env: { ...process.env, APP: app } });
  } else {
    const target = join(docsDir, 'apps', app);
    rmSync(target, {recursive: true, force: true});
    cpSync(appPath, target, {recursive: true});
  }
}

cpSync(join(root, 'index.html'), join(docsDir, 'index.html'));
cpSync(join(root, 'app-index.csv'), join(docsDir, 'app-index.csv'));
cpSync(join(root, 'pics'), join(docsDir, 'pics'), { recursive: true });

// Normalise image file extensions so the index page can load them reliably
const picsDir = join(docsDir, 'pics');
for (const file of readdirSync(picsDir)) {
  const lower = file.toLowerCase();
  if (file !== lower) {
    renameSync(join(picsDir, file), join(picsDir, lower));
  }
}

