import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({ test: { globals: true, environment: 'node', include: ['src/**/*.test.ts'], exclude: ['node_modules'], root: '.', coverage: { provider: 'v8', reporter: ['text', 'json', 'html'], include: ['src/providers/**', 'src/lib/**', 'src/contracts/**'], thresholds: { branches: 50, functions: 50, lines: 50, statements: 50, }, }, reporters: ['default'], }, resolve: { alias: { '@': path.resolve(__dirname, './src'), }, }, });
