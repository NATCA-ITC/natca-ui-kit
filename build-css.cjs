#!/usr/bin/env node

/**
 * @natca-itc/ui-shell CSS build script
 * Copies CSS tokens, components, and theme.json into dist/ for publishing.
 */

const fs = require('fs')
const path = require('path')

const DIST = path.join(__dirname, 'dist')

const files = [
  { src: 'src/css/natca-tokens.css', dest: 'natca-tokens.css' },
  { src: 'src/css/natca-components.css', dest: 'natca-components.css' },
  { src: 'src/theme.json', dest: 'theme.json' },
]

// Ensure dist/ exists (vue build may not have run yet)
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST)
}

for (const { src, dest } of files) {
  const srcPath = path.join(__dirname, src)
  const destPath = path.join(DIST, dest)

  if (!fs.existsSync(srcPath)) {
    console.error(`Missing: ${srcPath}`)
    process.exit(1)
  }

  fs.copyFileSync(srcPath, destPath)
  const size = (fs.statSync(destPath).size / 1024).toFixed(1)
  console.log(`  ${dest} (${size} KB)`)
}

console.log(`\nCSS build complete → dist/`)
