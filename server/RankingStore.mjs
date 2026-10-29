/**
 * RankingStore - banco SQLite do ranking da feira.
 *
 * Usa o módulo nativo `node:sqlite` (sem dependências externas). O servidor
 * é a fonte da verdade; o navegador mantém uma cópia local para continuar
 * jogável quando a API estiver indisponível.
 */
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const MAX_NAME = 40;
const MAX_COMPANY = 48;
const MAX_EMAIL = 70;
const MAX_PHONE = 24;
const MAX_ID = 80;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    company TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    registered_at TEXT NOT NULL,
    started_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT,
    completion_time REAL,
    best_completion_time REAL,
    best_completed_at TEXT,
    attempts INTEGER NOT NULL DEFAULT 1,
    phase INTEGER NOT NULL DEFAULT 0,
    equipment_count INTEGER NOT NULL DEFAULT 0,
    play_time REAL NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_players_best ON players (best_completion_time);
`;

function text(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function seconds(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function integer(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(number)));
}

function isoOrNull(value) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** Valida e normaliza um jogador vindo da rede. Retorna null se inválido. */
export function sanitizePlayer(raw, now = new Date().toISOString()) {
  if (!raw || typeof raw !== 'object') return null;
  const id = text(raw.id, MAX_ID);
  if (!id) return null;

  const registeredAt = isoOrNull(raw.registeredAt) || now;
  const completionTime = seconds(raw.completionTime);
  const best = seconds(raw.bestCompletionTime ?? completionTime);

  return {
    id,
    name: text(raw.name, MAX_NAME),
    company: text(raw.company, MAX_COMPANY),
    email: String(raw.email ?? '').replace(/\s+/g, '').toLowerCase().slice(0, MAX_EMAIL),
    phone: text(raw.phone, MAX_PHONE),
    registeredAt,
    startedAt: isoOrNull(raw.startedAt) || registeredAt,
    updatedAt: isoOrNull(raw.updatedAt) || now,
    completedAt: isoOrNull(raw.completedAt),
    completionTime,
    bestCompletionTime: best,
    bestCompletedAt: isoOrNull(raw.bestCompletedAt),
    attempts: integer(raw.attempts, 1, 9999, 1),
    phase: integer(raw.phase, 0, 9, 0),
    equipmentCount: integer(raw.equipmentCount, 0, 10, 0),
    playTime: seconds(raw.playTime) ?? 0
  };
}

function rowToPlayer(row) {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    registeredAt: row.registered_at,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    completionTime: row.completion_time,
    bestCompletionTime: row.best_completion_time,
    bestCompletedAt: row.best_completed_at,
    attempts: row.attempts,
    phase: row.phase,
    equipmentCount: row.equipment_count,
    playTime: row.play_time
  };
}

export class RankingStore {
  constructor(filePath = ':memory:') {
    if (filePath !== ':memory:') mkdirSync(dirname(filePath), { recursive: true });
    this._db = new DatabaseSync(filePath);
    this._db.exec('PRAGMA journal_mode = WAL;');
    this._db.exec(SCHEMA);

    this._selectOne = this._db.prepare('SELECT * FROM players WHERE id = ?');
    this._selectAll = this._db.prepare('SELECT * FROM players ORDER BY registered_at DESC');
    this._selectRanking = this._db.prepare(`
      SELECT * FROM players
      WHERE best_completion_time IS NOT NULL
      ORDER BY best_completion_time ASC, best_completed_at ASC
      LIMIT ?
    `);
    this._upsert = this._db.prepare(`
      INSERT INTO players (
        id, name, company, email, phone, registered_at, started_at, updated_at,
        completed_at, completion_time, best_completion_time, best_completed_at,
        attempts, phase, equipment_count, play_time
      ) VALUES (
        :id, :name, :company, :email, :phone, :registeredAt, :startedAt, :updatedAt,
        :completedAt, :completionTime, :bestCompletionTime, :bestCompletedAt,
        :attempts, :phase, :equipmentCount, :playTime
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        company = excluded.company,
        email = excluded.email,
        phone = excluded.phone,
        started_at = excluded.started_at,
        updated_at = excluded.updated_at,
        completed_at = excluded.completed_at,
        completion_time = excluded.completion_time,
        attempts = MAX(players.attempts, excluded.attempts),
        phase = excluded.phase,
        equipment_count = excluded.equipment_count,
        play_time = excluded.play_time,
        best_completion_time = CASE
          WHEN excluded.best_completion_time IS NULL THEN players.best_completion_time
          WHEN players.best_completion_time IS NULL
            OR excluded.best_completion_time < players.best_completion_time
            THEN excluded.best_completion_time
          ELSE players.best_completion_time
        END,
        best_completed_at = CASE
          WHEN excluded.best_completion_time IS NULL THEN players.best_completed_at
          WHEN players.best_completion_time IS NULL
            OR excluded.best_completion_time < players.best_completion_time
            THEN excluded.best_completed_at
          ELSE players.best_completed_at
        END
      WHERE excluded.updated_at >= players.updated_at
         OR (excluded.best_completion_time IS NOT NULL
             AND (players.best_completion_time IS NULL
                  OR excluded.best_completion_time < players.best_completion_time))
    `);
  }

  /** Insere ou atualiza um jogador. O melhor tempo nunca piora. */
  save(raw) {
    const player = sanitizePlayer(raw);
    if (!player) return null;
    this._upsert.run(player);
    return rowToPlayer(this._selectOne.get(player.id));
  }

  get(id) {
    const row = this._selectOne.get(String(id));
    return row ? rowToPlayer(row) : null;
  }

  getAll() {
    return this._selectAll.all().map(rowToPlayer);
  }

  getRanking(limit = 100) {
    const max = integer(limit, 1, 1000, 100);
    return this._selectRanking.all(max).map(rowToPlayer);
  }

  close() {
    this._db.close();
  }
}
