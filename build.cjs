#!/usr/bin/env node

/**
 * @natca/ui-shell build script
 * Copies src/ CSS and theme.json into dist/ for publishing.
 * No bundler needed — these are standalone CSS files.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

const files = [
  'natca-tokens.css',
  'natca-components.css',
  'theme.json',
];

// Clean and recreate dist/
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST);

// Copy each file
for (const file of files) {
  const src = path.join(SRC, file);
  const dest = path.join(DIST, file);

  if (!fs.existsSync(src)) {
    console.error(`Missing: ${src}`);
    process.exit(1);
  }

  fs.copyFileSync(src, dest);
  const size = (fs.statSync(dest).size / 1024).toFixed(1);
  console.log(`  ${file} (${size} KB)`);
}

console.log(`\nBuild complete → dist/`);
