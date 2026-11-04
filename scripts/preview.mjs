import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.wav':'audio/wav','.m4a':'audio/mp4','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}).end(); return; }
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/calendario-consciente') { res.writeHead(302, {'Location':'/calendario-consciente/'}).end(); return; }
    pathname = pathname.replace(/^\/calendario-consciente\//, '/');
    const file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Outside root');
    if (pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(404).end(); return; }
    const info = await stat(file);
    const target = info.isDirectory() ? path.join(file, 'index.html') : file;
    if (info.isDirectory() && !new URL(req.url, 'http://localhost').pathname.endsWith('/')) { res.writeHead(302, {'Location':req.url.split('?')[0] + '/'}).end(); return; }
    const size = (await stat(target)).size;
    const headers = {'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'};
    let start = 0, end = size - 1, status = 200;
    if (req.headers.range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!match || Number(match[1]) >= size) { res.writeHead(416, {'Content-Range':`bytes */${size}`}).end(); return; }
      start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), size-1) : size-1;
      if (end < start) { res.writeHead(416).end(); return; }
      status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
    }
    headers['Content-Length'] = status === 206 ? end-start+1 : size;
    res.writeHead(status, headers);
    if (req.method === 'HEAD' || size === 0) res.end(); else createReadStream(target, {start,end}).pipe(res);
  } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}).end('Página não encontrada.'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Calendário Consciente — Local: http://127.0.0.1:${port}/`));
