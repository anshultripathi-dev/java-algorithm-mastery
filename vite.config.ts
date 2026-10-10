import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { javaRunnerPlugin } from './scripts/java-runner-plugin.ts';

export default defineConfig({
  base: '/java-algorithm-mastery/',
  plugins: [react(), tailwindcss(), javaRunnerPlugin()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  server: { host: '127.0.0.1', port: 5173 },
  preview: { host: '127.0.0.1', port: 4173 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
