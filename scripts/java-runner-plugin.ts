import type { Plugin } from 'vite';
import { javaApiMiddleware } from './java-runner.mjs';

/** Adds /api/java/status and /api/java/run to the Vite dev & preview servers. */
export function javaRunnerPlugin(): Plugin {
  const mw = javaApiMiddleware();
  return {
    name: 'local-java-runner',
    configureServer(server) {
      server.middlewares.use(mw);
    },
    configurePreviewServer(server) {
      server.middlewares.use(mw);
    },
  };
}
