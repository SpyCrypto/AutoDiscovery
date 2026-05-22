#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

// Remove dist directory if it exists
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

console.log('Building contract...');

// Run TypeScript compiler
try {
  execSync('tsc --project tsconfig.build.json', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('TypeScript compilation failed');
  process.exit(1);
}

// Copy managed directory
const srcManaged = path.join(__dirname, '..', 'src', 'managed');
const destManaged = path.join(distDir, 'managed');

if (fs.existsSync(srcManaged)) {
  fs.mkdirSync(destManaged, { recursive: true });
  fs.cpSync(srcManaged, destManaged, { recursive: true, force: true });
  console.log('Copied src/managed to dist/managed');
}

// Copy contracts directory
const srcContracts = path.join(__dirname, '..', 'src', 'contracts');
const destContracts = path.join(distDir, 'contracts');

if (fs.existsSync(srcContracts)) {
  fs.mkdirSync(destContracts, { recursive: true });
  fs.cpSync(srcContracts, destContracts, { recursive: true, force: true });
  console.log('Copied src/contracts to dist/contracts');
}

console.log('Build complete!');
