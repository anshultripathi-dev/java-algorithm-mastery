// Production-style local server: serves ./dist and the local Java runner API on 127.0.0.1:4173
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { javaApiMiddleware, javaStatus } from './java-runner.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.png': 'image/png', '.ico': 'image/x-icon' };
const api = javaApiMiddleware();

const server = http.createServer(async (req, res) => {
  await api(req, res, async () => {
    try {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      let file = path.join(root, p);
      if (!file.startsWith(root)) throw new Error('bad path');
      const s = await stat(file).catch(() => null);
      if (!s || s.isDirectory()) file = path.join(root, 'index.html');
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      res.end(await readFile(file));
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  });
});
server.listen(port, '127.0.0.1', async () => {
  const st = await javaStatus();
  console.log(`Java Foundations to Algorithm Mastery → http://127.0.0.1:${port}`);
  console.log(st.available ? `Local Java runner ready (${st.javac}; compiling with --release ${st.release})` : 'No JDK found: the playground will show setup instructions instead of running code.');
});
