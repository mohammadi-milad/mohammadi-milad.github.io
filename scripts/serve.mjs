import http from 'node:http';
import fs from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const port = Number(process.env.PORT || 4321);
const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
const runBuild = () => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Build failed: ${code}`)));
});
await runBuild();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    if (base) {
      if (pathname === '/') { res.writeHead(302, { Location: `${base}/` }); res.end(); return; }
      if (!pathname.startsWith(`${base}/`)) throw new Error('Not found');
      pathname = pathname.slice(base.length);
    }
    let file = path.resolve(output, `.${pathname}`);
    if (!file.startsWith(`${output}${path.sep}`) && file !== output) throw new Error('Invalid path');
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const data = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await fs.readFile(path.join(output, '404.html')).catch(() => '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Page not found</title></head><body><h1>Page not found</h1><p>Please try the address again.</p></body></html>'));
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}${base}/`));

if (process.argv.includes('--watch')) {
  let timer, building = false, queued = false;
  const rebuild = async () => {
    if (building) { queued = true; return; }
    building = true;
    try { await runBuild(); } catch (error) { console.error(error.message); }
    building = false;
    if (queued) { queued = false; rebuild(); }
  };
  for (const directory of ['src', 'content', 'public', 'scripts']) {
    watch(path.join(root, directory), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 160);
    });
  }
}
