/**
 * API JSON do ranking. Rotas:
 *   GET /api/ranking         -> jogadores com tempo concluído, do mais rápido ao mais lento
 *   GET /api/players         -> todos os cadastros
 *   PUT /api/players/:id     -> cria/atualiza um jogador
 */
const MAX_BODY = 16 * 1024;

function send(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Corpo muito grande.'), { status: 413 }));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(Object.assign(new Error('JSON inválido.'), { status: 400 }));
      }
    });
    request.on('error', reject);
  });
}

/** Retorna true se a rota pertence à API (e já foi respondida). */
export async function handleApi(store, request, response, url) {
  if (!url.pathname.startsWith('/api/')) return false;

  try {
    const { pathname } = url;
    const method = request.method;

    if (pathname === '/api/ranking' && method === 'GET') {
      send(response, 200, { ranking: store.getRanking(url.searchParams.get('limit') ?? 100) });
      return true;
    }

    if (pathname === '/api/players' && method === 'GET') {
      send(response, 200, { players: store.getAll() });
      return true;
    }

    const match = pathname.match(/^\/api\/players\/([^/]+)$/);
    if (match && method === 'PUT') {
      const body = await readJson(request);
      const id = decodeURIComponent(match[1]);
      const saved = store.save({ ...body, id });
      if (!saved) {
        send(response, 400, { error: 'Jogador inválido.' });
      } else {
        send(response, 200, { player: saved });
      }
      return true;
    }

    send(response, match ? 405 : 404, { error: 'Rota não encontrada.' });
  } catch (error) {
    send(response, error.status || 500, { error: error.status ? error.message : 'Erro interno.' });
  }
  return true;
}
