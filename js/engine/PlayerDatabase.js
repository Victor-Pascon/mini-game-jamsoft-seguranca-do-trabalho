/**
 * PlayerDatabase - cadastro local dos participantes da feira.
 *
 * O projeto não tem backend. Este "banco interno" usa localStorage para
 * manter os cadastros e os tempos de conclusão no próprio notebook da feira.
 * A implementação tolera storage indisponível/corrompido e cai para memória,
 * para que o jogo nunca deixe de abrir por causa do ranking.
 *
 * Com `remote` ativo, cada alteração também é enviada ao servidor (SQLite,
 * ver server/RankingStore.mjs) e `refresh()` traz o ranking oficial de volta.
 * O servidor offline nunca bloqueia o jogo: o cache local continua valendo e
 * os cadastros pendentes são reenviados no próximo `refresh()`.
 */

export const PLAYER_DB_KEY = 'jamsoft_seguranca_players';
export const PLAYER_DB_VERSION = 1;

const MAX_NAME = 40;
const MAX_COMPANY = 48;
const MAX_EMAIL = 70;
const MAX_PHONE = 24;

function cleanText(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanEmail(value) {
  return String(value ?? '').replace(/\s+/g, '').trim().toLowerCase().slice(0, MAX_EMAIL);
}

function cleanPhone(value) {
  return String(value ?? '').trim().slice(0, MAX_PHONE);
}

function finiteTime(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function integerBetween(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}

function clonePlayer(player) {
  return player ? { ...player } : null;
}

function normalizePlayer(raw) {
  if (!raw || typeof raw !== 'object' || !raw.id) return null;

  const now = new Date().toISOString();
  const completionTime = finiteTime(raw.completionTime);
  const bestCompletionTime = finiteTime(raw.bestCompletionTime ?? completionTime);

  return {
    id: String(raw.id),
    name: cleanText(raw.name, MAX_NAME),
    company: cleanText(raw.company, MAX_COMPANY),
    email: cleanEmail(raw.email),
    phone: cleanPhone(raw.phone),
    registeredAt: String(raw.registeredAt || now),
    startedAt: String(raw.startedAt || raw.registeredAt || now),
    updatedAt: String(raw.updatedAt || raw.registeredAt || now),
    completedAt: raw.completedAt ? String(raw.completedAt) : null,
    completionTime,
    bestCompletionTime,
    bestCompletedAt: raw.bestCompletedAt ? String(raw.bestCompletedAt) : null,
    attempts: integerBetween(raw.attempts, 1, 9999, 1),
    phase: integerBetween(raw.phase, 0, 9, 0),
    equipmentCount: integerBetween(raw.equipmentCount, 0, 10, 0),
    playTime: finiteTime(raw.playTime) ?? 0
  };
}

function normalizePayload(raw) {
  const source = Array.isArray(raw) ? raw : raw?.players;
  if (!Array.isArray(source)) return [];
  return source.map(normalizePlayer).filter(Boolean);
}

export function formatDuration(seconds) {
  const value = finiteTime(seconds);
  if (value === null) return '--:--';

  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const two = (number) => String(number).padStart(2, '0');

  return hours > 0
    ? `${hours}:${two(minutes)}:${two(secs)}`
    : `${two(minutes)}:${two(secs)}`;
}

export function formatDateTime(isoDate) {
  if (!isoDate) return '—';
  try {
    return new Date(isoDate).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '—';
  }
}

export class PlayerDatabase {
  constructor(storage = null, { remote = null } = {}) {
    this._remote = remote ? String(remote).replace(/\/+$/, '') : null;
    this.syncError = null;
    this._key = PLAYER_DB_KEY;
    this._version = PLAYER_DB_VERSION;
    this._storage = storage;
    this._memory = [];
    this._idCounter = 0;
  }

  _getStorage() {
    if (this._storage !== null) return this._storage;
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch {
      return null;
    }
  }

  _readPlayers() {
    const storage = this._getStorage();
    if (!storage) return this._memory.map(clonePlayer);

    try {
      const raw = storage.getItem(this._key);
      if (!raw) {
        return this._memory.map(clonePlayer);
      }
      const parsed = JSON.parse(raw);
      return normalizePayload(parsed);
    } catch {
      return this._memory.map(clonePlayer);
    }
  }

  _writePlayers(players) {
    this._memory = players.map(clonePlayer);
    const storage = this._getStorage();
    if (!storage) return;

    try {
      storage.setItem(
        this._key,
        JSON.stringify({ version: this._version, players: this._memory })
      );
    } catch {
      // Sem espaço ou storage bloqueado: mantém a sessão em memória.
    }
  }

  _nextId() {
    this._idCounter += 1;
    return `jogador_${Date.now().toString(36)}_${this._idCounter.toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 6)}`;
  }

  _request(path, options) {
    return fetch(`${this._remote}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    }).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
  }

  _push(player) {
    if (!this._remote || !player) return Promise.resolve(false);
    return this._request(`/api/players/${encodeURIComponent(player.id)}`, {
      method: 'PUT',
      body: JSON.stringify(player)
    }).then(
      () => {
        this.syncError = null;
        return true;
      },
      (error) => {
        this.syncError = error;
        return false;
      }
    );
  }

  /**
   * Mescla o banco do servidor no cache local e reenvia o que só existe aqui.
   * Resolve com true se o servidor respondeu.
   */
  refresh() {
    if (!this._remote) return Promise.resolve(false);
    return this._request('/api/players').then(
      (payload) => {
        const remotePlayers = normalizePayload(payload?.players);
        const local = this._readPlayers();
        const merged = new Map(local.map((player) => [player.id, player]));
        const remoteIds = new Set();

        for (const remote of remotePlayers) {
          remoteIds.add(remote.id);
          const mine = merged.get(remote.id);
          if (!mine || remote.updatedAt >= mine.updatedAt) {
            const times = [remote.bestCompletionTime, mine?.bestCompletionTime]
              .filter((time) => time !== null && time !== undefined);
            merged.set(remote.id, {
              ...remote,
              bestCompletionTime: times.length ? Math.min(...times) : null
            });
          }
        }

        this._writePlayers([...merged.values()]);
        this.syncError = null;
        for (const player of local) {
          if (!remoteIds.has(player.id)) this._push(player);
        }
        return true;
      },
      (error) => {
        this.syncError = error;
        return false;
      }
    );
  }

  getAll() {
    return this._readPlayers().map(clonePlayer);
  }

  getById(id) {
    return clonePlayer(this._readPlayers().find((player) => player.id === id) || null);
  }

  getRanking() {
    return this._readPlayers()
      .filter((player) => player.bestCompletionTime !== null)
      .sort((a, b) => {
        if (a.bestCompletionTime !== b.bestCompletionTime) {
          return a.bestCompletionTime - b.bestCompletionTime;
        }
        return String(a.bestCompletedAt || '').localeCompare(String(b.bestCompletedAt || ''));
      })
      .map(clonePlayer);
  }

  getStats() {
    const players = this._readPlayers();
    const ranking = this.getRanking();
    return {
      total: players.length,
      completed: ranking.length,
      inProgress: players.length - ranking.length,
      bestTime: ranking.length ? ranking[0].bestCompletionTime : null,
      attempts: players.reduce((sum, player) => sum + player.attempts, 0)
    };
  }

  register(data = {}) {
    const players = this._readPlayers();
    const now = new Date().toISOString();
    const email = cleanEmail(data.email);
    const existing = players.find((player) => player.email && player.email === email);

    if (existing) {
      existing.name = cleanText(data.name, MAX_NAME);
      existing.company = cleanText(data.company, MAX_COMPANY);
      existing.email = email;
      existing.phone = cleanPhone(data.phone);
      existing.startedAt = now;
      existing.updatedAt = now;
      existing.completionTime = null;
      existing.completedAt = null;
      existing.phase = 0;
      existing.equipmentCount = 0;
      existing.playTime = 0;
      existing.attempts = integerBetween(existing.attempts + 1, 1, 9999, 1);
      this._writePlayers(players);
      this._push(existing);
      return clonePlayer(existing);
    }

    const player = {
      id: this._nextId(),
      name: cleanText(data.name, MAX_NAME),
      company: cleanText(data.company, MAX_COMPANY),
      email,
      phone: cleanPhone(data.phone),
      registeredAt: now,
      startedAt: now,
      updatedAt: now,
      completedAt: null,
      completionTime: null,
      bestCompletionTime: null,
      bestCompletedAt: null,
      attempts: 1,
      phase: 0,
      equipmentCount: 0,
      playTime: 0
    };

    players.push(player);
    this._writePlayers(players);
    this._push(player);
    return clonePlayer(player);
  }

  updateProgress(id, progress = {}) {
    const players = this._readPlayers();
    const player = players.find((item) => item.id === id);
    if (!player) return null;

    player.phase = integerBetween(progress.phase, 0, 9, player.phase);
    player.equipmentCount = integerBetween(
      progress.equipmentCount,
      0,
      10,
      player.equipmentCount
    );
    player.playTime = finiteTime(progress.playTime) ?? player.playTime;
    player.updatedAt = new Date().toISOString();
    this._writePlayers(players);
    this._push(player);
    return clonePlayer(player);
  }

  complete(id, completionTime) {
    const players = this._readPlayers();
    const player = players.find((item) => item.id === id);
    const time = finiteTime(completionTime);
    if (!player || time === null) return null;

    const now = new Date().toISOString();
    player.completionTime = time;
    player.completedAt = now;
    player.bestCompletionTime = player.bestCompletionTime === null
      ? time
      : Math.min(player.bestCompletionTime, time);
    player.bestCompletedAt = now;
    player.phase = 9;
    player.equipmentCount = 10;
    player.playTime = time;
    player.updatedAt = now;
    this._writePlayers(players);
    this._push(player);
    return clonePlayer(player);
  }
}
