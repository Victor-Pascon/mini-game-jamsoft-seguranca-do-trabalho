import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { handleApi } from '../server/api.mjs';
import { RankingStore } from '../server/RankingStore.mjs';

const root = process.cwd();
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || '127.0.0.1';
const dbPath = process.env.RANKING_DB || join(root, 'data', 'ranking.db');

const store = new RankingStore(dbPath);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

const server = createServer(async (request, response) => {
  try {
    const base = `http://${request.headers.host || 'localhost'}`;
    const url = new URL(request.url || '/', base);
    let pathname = decodeURIComponent(url.pathname);

    if (await handleApi(store, request, response, url)) return;

    if (pathname === '/') pathname = '/index.html';

    // O banco e o código do servidor não são arquivos públicos.
    if (/^\/(data|server)(\/|$)/.test(pathname)) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Arquivo não encontrado.');
      return;
    }

    const filePath = normalize(join(root, pathname));

    if (filePath !== root && !filePath.startsWith(root + sep)) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Acesso negado.');
      return;
    }

    const data = await readFile(filePath);
    const contentType = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';

    response.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(data);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Arquivo não encontrado.');
  }
});

server.listen(port, host, () => {
  console.log('');
  console.log('  JAMSOFT TECNOLOGIA — Segurança em Jogo');
  console.log(`  Servidor local: http://${host === '127.0.0.1' ? 'localhost' : host}:${port}`);
  console.log(`  Banco do ranking: ${dbPath}`);
  console.log('  Ctrl+C para encerrar.');
  console.log('');
});
