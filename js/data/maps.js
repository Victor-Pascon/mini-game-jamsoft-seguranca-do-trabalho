import { COLORS } from '../design-tokens/snes-theme.js';

/**
 * Mapa da sede da JAMSOFT TECNOLOGIA para a feira de Segurança do Trabalho.
 *
 * Layout 20x15 tiles (640x480 px), no mesmo formato top-down do mini-game
 * original. Cada sala representa uma NR e abriga um especialista.
 * O corredor central conecta todas as áreas, sem labirintos.
 */
export const TILE_TYPES = {
  HALL: 0,
  WALL: 1,
  EPI_ROOM: 2,
  PGR_ROOM: 3,
  ELETRICA_ROOM: 4,
  LOGISTICA_ROOM: 5,
  RUIDO_ROOM: 6,
  MAQUINAS_ROOM: 7,
  ERGONOMIA_ROOM: 8,
  BRIGADA_ROOM: 9,
  SINALIZACAO_ROOM: 10,
  ALTURA_ROOM: 11,
  MURAL_ROOM: 12,
  AUDITORIO_ROOM: 13,
  DOOR: 14
};

const WIDTH = 20;
const HEIGHT = 15;
const TILE_SIZE = 32;

export const tileTypes = {
  [TILE_TYPES.HALL]: { color: '#151b24', name: 'corredor' },
  [TILE_TYPES.WALL]: { color: '#0d47a1', name: 'parede' },
  [TILE_TYPES.EPI_ROOM]: { color: '#7a3f00', name: 'almoxarifado de EPI' },
  [TILE_TYPES.PGR_ROOM]: { color: '#123f63', name: 'sala do PGR' },
  [TILE_TYPES.ELETRICA_ROOM]: { color: '#5d4e00', name: 'oficina elétrica' },
  [TILE_TYPES.LOGISTICA_ROOM]: { color: '#4e342e', name: 'logística' },
  [TILE_TYPES.RUIDO_ROOM]: { color: '#3d1a4d', name: 'área de ruído' },
  [TILE_TYPES.MAQUINAS_ROOM]: { color: '#5a1a1a', name: 'produção' },
  [TILE_TYPES.ERGONOMIA_ROOM]: { color: '#1b4d2e', name: 'escritório' },
  [TILE_TYPES.BRIGADA_ROOM]: { color: '#5a1a1a', name: 'brigada de incêndio' },
  [TILE_TYPES.SINALIZACAO_ROOM]: { color: '#0e4d45', name: 'sinalização' },
  [TILE_TYPES.ALTURA_ROOM]: { color: '#263238', name: 'trabalho em altura' },
  [TILE_TYPES.MURAL_ROOM]: { color: '#4a0e2e', name: 'mural de normas' },
  [TILE_TYPES.AUDITORIO_ROOM]: { color: '#0e3d2e', name: 'auditório' },
  [TILE_TYPES.DOOR]: { color: '#5d4037', name: 'porta' }
};

export const roomDefs = [
  {
    id: 'epi', x: 1, y: 1, w: 4, h: 3, tile: TILE_TYPES.EPI_ROOM,
    name: 'Almoxarifado de EPI', norm: 'NR-6', npcId: 'npc_epi',
    color: COLORS.ROOM_EPI, label: 'NR-6 · ALMOXARIFADO'
  },
  {
    id: 'pgr', x: 7, y: 1, w: 3, h: 3, tile: TILE_TYPES.PGR_ROOM,
    name: 'Sala do PGR', norm: 'NR-1', npcId: 'npc_pgr',
    color: COLORS.ROOM_PGR, label: 'NR-1 · SESMT / PGR'
  },
  {
    id: 'brigada', x: 11, y: 1, w: 3, h: 3, tile: TILE_TYPES.BRIGADA_ROOM,
    name: 'Brigada de Incêndio', norm: 'NR-23', npcId: 'npc_brigada',
    color: COLORS.ROOM_BRIGADA, label: 'NR-23 · BRIGADA'
  },
  {
    id: 'eletrica', x: 16, y: 1, w: 3, h: 3, tile: TILE_TYPES.ELETRICA_ROOM,
    name: 'Oficina Elétrica', norm: 'NR-10', npcId: 'npc_eletrica',
    color: COLORS.ROOM_ELETRICA, label: 'NR-10 · ELÉTRICA'
  },
  {
    id: 'ruido', x: 1, y: 6, w: 4, h: 3, tile: TILE_TYPES.RUIDO_ROOM,
    name: 'Área de Ruído', norm: 'NR-15', npcId: 'npc_ruido',
    color: COLORS.ROOM_RUIDO, label: 'NR-15 · RUÍDO'
  },
  {
    id: 'ergonomia', x: 7, y: 6, w: 3, h: 3, tile: TILE_TYPES.ERGONOMIA_ROOM,
    name: 'Escritório Ergonômico', norm: 'NR-17', npcId: 'npc_ergonomia',
    color: COLORS.ROOM_ERGONOMIA, label: 'NR-17 · ERGONOMIA'
  },
  {
    id: 'maquinas', x: 11, y: 6, w: 3, h: 3, tile: TILE_TYPES.MAQUINAS_ROOM,
    name: 'Produção / Máquinas', norm: 'NR-12', npcId: 'npc_maquinas',
    color: COLORS.ROOM_MAQUINAS, label: 'NR-12 · MÁQUINAS'
  },
  {
    id: 'logistica', x: 16, y: 6, w: 3, h: 3, tile: TILE_TYPES.LOGISTICA_ROOM,
    name: 'Logística', norm: 'NR-11', npcId: 'npc_logistica',
    color: COLORS.ROOM_LOGISTICA, label: 'NR-11 · LOGÍSTICA'
  },
  {
    id: 'sinalizacao', x: 1, y: 11, w: 4, h: 3, tile: TILE_TYPES.SINALIZACAO_ROOM,
    name: 'Sinalização de Segurança', norm: 'NR-26', npcId: 'npc_sinalizacao',
    color: COLORS.ROOM_SINALIZACAO, label: 'NR-26 · SINALIZAÇÃO'
  },
  {
    id: 'altura', x: 7, y: 11, w: 3, h: 3, tile: TILE_TYPES.ALTURA_ROOM,
    name: 'Trabalho em Altura', norm: 'NR-35', npcId: 'npc_altura',
    color: COLORS.ROOM_ALTURA, label: 'NR-35 · ALTURA'
  },
  {
    id: 'mural', x: 11, y: 11, w: 3, h: 3, tile: TILE_TYPES.MURAL_ROOM,
    name: 'Mural de Normas', norm: null, npcId: null,
    color: COLORS.ROOM_MURAL, label: 'MURAL DE NRS'
  },
  {
    id: 'auditorio', x: 16, y: 11, w: 3, h: 3, tile: TILE_TYPES.AUDITORIO_ROOM,
    name: 'Auditório', norm: null, npcId: null,
    color: COLORS.ROOM_AUDITORIO, label: 'AUDITÓRIO'
  }
];

/*
 * Props decorativos. Não bloqueiam movimento: são parte do cenário e do
 * "espaço de trabalho" (mesa, cadeira ergonômica, painéis, máquinas...).
 */
const props = [
  // NR-6 — Almoxarifado de EPI
  { id: 'epi_shelf_1', type: 'shelf', x: 40, y: 48, w: 30, h: 22, color: '#8d6e63' },
  { id: 'epi_shelf_2', type: 'shelf', x: 122, y: 48, w: 30, h: 22, color: '#8d6e63' },
  { id: 'epi_sign', type: 'sign', x: 40, y: 100, w: 18, h: 18, color: '#ffc107' },
  { id: 'epi_rack', type: 'helmetRack', x: 40, y: 76, w: 22, h: 18 },
  { id: 'epi_locker', type: 'locker', x: 128, y: 86, w: 24, h: 30, color: '#607d8b' },

  // NR-1 — SESMT / PGR
  { id: 'pgr_board', type: 'board', x: 230, y: 38, w: 60, h: 22, color: '#42a5f5' },
  { id: 'pgr_desk', type: 'desk', x: 236, y: 100, w: 72, h: 16, color: '#5d4037' },
  { id: 'pgr_plant', type: 'plant', x: 300, y: 108, w: 14, h: 18 },
  { id: 'pgr_cabinet', type: 'cabinet', x: 298, y: 42, w: 18, h: 28, color: '#90a4ae' },
  { id: 'pgr_printer', type: 'printer', x: 292, y: 94, w: 15, h: 12 },

  // NR-23 — Brigada
  { id: 'brigada_ext', type: 'extinguisher', x: 364, y: 48, w: 12, h: 24, color: '#e53935' },
  { id: 'brigada_hose', type: 'hosebox', x: 420, y: 48, w: 20, h: 20, color: '#c62828' },
  { id: 'brigada_alarm', type: 'fireAlarm', x: 432, y: 84, w: 12, h: 16 },

  // NR-10 — Elétrica
  { id: 'eletrica_panel', type: 'panel', x: 516, y: 42, w: 28, h: 24, color: '#f9a825' },
  { id: 'eletrica_sign', type: 'sign', x: 582, y: 48, w: 18, h: 18, color: '#ffc107', label: 'ALTA TENSÃO' },
  { id: 'eletrica_reel', type: 'cableReel', x: 520, y: 92, w: 20, h: 18 },
  { id: 'eletrica_barrier', type: 'barrier', x: 568, y: 98, w: 28, h: 14 },

  // NR-15 — Ruído
  { id: 'ruido_machine', type: 'noise', x: 40, y: 204, w: 32, h: 28, color: '#78909c' },
  { id: 'ruido_sign', type: 'sign', x: 124, y: 204, w: 18, h: 18, color: '#ffc107', label: 'RUÍDO' },
  { id: 'ruido_panel', type: 'acousticPanel', x: 40, y: 244, w: 24, h: 22 },
  { id: 'ruido_meter', type: 'soundMeter', x: 122, y: 244, w: 14, h: 20 },

  // NR-17 — Ergonomia
  { id: 'ergonomia_desk', type: 'desk', x: 228, y: 200, w: 84, h: 16, color: '#5d4037' },
  { id: 'ergonomia_monitor', type: 'monitor', x: 250, y: 188, w: 20, h: 13 },
  { id: 'ergonomia_chair', type: 'chair', x: 238, y: 220, w: 20, h: 24 },
  { id: 'ergonomia_plant', type: 'plant', x: 300, y: 260, w: 14, h: 18 },
  { id: 'ergonomia_cabinet', type: 'cabinet', x: 230, y: 252, w: 18, h: 28, color: '#90a4ae' },
  { id: 'ergonomia_printer', type: 'printer', x: 292, y: 190, w: 15, h: 12 },

  // NR-12 — Máquinas
  { id: 'maquinas_machine', type: 'machine', x: 356, y: 198, w: 28, h: 24, color: '#c62828' },
  { id: 'maquinas_conveyor', type: 'conveyor', x: 392, y: 206, w: 44, h: 10 },
  { id: 'maquinas_sign', type: 'sign', x: 424, y: 232, w: 16, h: 16, color: '#ffc107' },
  { id: 'maquinas_fence', type: 'safetyFence', x: 356, y: 256, w: 52, h: 10 },
  { id: 'maquinas_cart', type: 'toolcart', x: 418, y: 254, w: 18, h: 16 },

  // NR-11 — Logística
  { id: 'logistica_pallet', type: 'pallet', x: 520, y: 200, w: 30, h: 20 },
  { id: 'logistica_boxes', type: 'boxes', x: 556, y: 200, w: 20, h: 20 },
  { id: 'logistica_sign', type: 'sign', x: 584, y: 240, w: 16, h: 16, color: '#ffc107' },
  { id: 'logistica_tote', type: 'tote', x: 584, y: 204, w: 14, h: 12 },
  { id: 'logistica_forklift', type: 'forklift', x: 528, y: 256, w: 36, h: 26 },

  // NR-26 — Sinalização
  { id: 'sinalizacao_cone_1', type: 'cone', x: 44, y: 360, w: 10, h: 18 },
  { id: 'sinalizacao_sign', type: 'sign', x: 60, y: 358, w: 22, h: 20, color: '#26a69a' },
  { id: 'sinalizacao_cone_2', type: 'cone', x: 130, y: 360, w: 10, h: 18 },
  { id: 'sinalizacao_barrier', type: 'barrier', x: 110, y: 414, w: 30, h: 12 },
  { id: 'sinalizacao_trash', type: 'trash', x: 142, y: 418, w: 10, h: 14 },

  // NR-35 — Altura
  { id: 'altura_scaffold', type: 'scaffold', x: 230, y: 356, w: 26, h: 36, color: '#90a4ae' },
  { id: 'altura_anchor', type: 'anchor', x: 300, y: 360, w: 14, h: 14 },
  { id: 'altura_sign', type: 'sign', x: 296, y: 410, w: 16, h: 16, color: '#ffc107' },
  { id: 'altura_rack', type: 'harnessRack', x: 230, y: 410, w: 24, h: 18 },
  { id: 'altura_barrier', type: 'barrier', x: 290, y: 414, w: 24, h: 12 },

  // Mural e auditório
  { id: 'mural_board', type: 'mural', x: 360, y: 366, w: 80, h: 52, color: '#ec407a', interactive: true },
  { id: 'mural_bench', type: 'bench', x: 366, y: 430, w: 68, h: 10 },
  { id: 'mural_plant', type: 'plant', x: 352, y: 424, w: 14, h: 18 },
  { id: 'mural_trash', type: 'trash', x: 438, y: 426, w: 10, h: 14 },
  { id: 'auditorio_stage', type: 'stage', x: 516, y: 360, w: 76, h: 22, color: '#26a69a' },
  { id: 'auditorio_podium', type: 'podium', x: 548, y: 390, w: 14, h: 14 },
  { id: 'auditorio_speaker', type: 'speaker', x: 518, y: 402, w: 12, h: 18 },
  { id: 'auditorio_chair_1', type: 'chair', x: 534, y: 416, w: 18, h: 22 },
  { id: 'auditorio_chair_2', type: 'chair', x: 560, y: 416, w: 18, h: 22 },

  // Corredores
  { id: 'hall_plant', type: 'plant', x: 170, y: 150, w: 14, h: 18 },
  { id: 'hall_water', type: 'watercooler', x: 470, y: 150, w: 16, h: 24 },
  { id: 'hall_bench', type: 'bench', x: 286, y: 146, w: 68, h: 10 },
  { id: 'hall_plant_2', type: 'plant', x: 172, y: 306, w: 14, h: 18 },
  { id: 'hall_trash', type: 'trash', x: 466, y: 310, w: 10, h: 14 }
];

function buildMap() {
  const tiles = new Array(WIDTH * HEIGHT).fill(TILE_TYPES.HALL);

  const setTile = (x, y, type) => {
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      tiles[y * WIDTH + x] = type;
    }
  };

  // Paredes externas
  for (let x = 0; x < WIDTH; x++) {
    setTile(x, 0, TILE_TYPES.WALL);
    setTile(x, HEIGHT - 1, TILE_TYPES.WALL);
  }
  for (let y = 0; y < HEIGHT; y++) {
    setTile(0, y, TILE_TYPES.WALL);
    setTile(WIDTH - 1, y, TILE_TYPES.WALL);
  }

  // Pisos das salas
  for (const room of roomDefs) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        setTile(x, y, room.tile);
      }
    }
  }

  // Portas nas bordas das salas que fazem fronteira com o corredor.
  for (const room of roomDefs) {
    const midX = room.x + Math.floor(room.w / 2);
    const midY = room.y + Math.floor(room.h / 2);

    const edges = [
      { inside: [midX, room.y], outside: [midX, room.y - 1] },
      { inside: [midX, room.y + room.h - 1], outside: [midX, room.y + room.h] },
      { inside: [room.x, midY], outside: [room.x - 1, midY] },
      { inside: [room.x + room.w - 1, midY], outside: [room.x + room.w, midY] }
    ];

    for (const edge of edges) {
      const [ox, oy] = edge.outside;
      if (ox < 1 || ox >= WIDTH - 1 || oy < 1 || oy >= HEIGHT - 1) continue;
      if (tiles[oy * WIDTH + ox] !== TILE_TYPES.HALL) continue;

      const [ix, iy] = edge.inside;
      if (tiles[iy * WIDTH + ix] === room.tile) {
        setTile(ix, iy, TILE_TYPES.DOOR);
      }
    }
  }

  const rooms = Object.fromEntries(
    roomDefs.map((room) => [room.id, { ...room }])
  );

  return {
    width: WIDTH,
    height: HEIGHT,
    tileSize: TILE_SIZE,
    collisionTiles: [TILE_TYPES.WALL],
    tileTypes,
    tiles,
    roomDefs,
    rooms,
    props,
    playerStart: {
      x: 10 * TILE_SIZE + 4,
      y: 9 * TILE_SIZE + 4
    }
  };
}

export const safetyMap = buildMap();

export const maps = {
  safety: safetyMap
};

export function getRoomById(roomId) {
  return safetyMap.rooms[roomId] || null;
}

export function getRoomCenter(roomId) {
  const room = getRoomById(roomId);
  if (!room) return null;
  return {
    x: (room.x + room.w / 2) * TILE_SIZE,
    y: (room.y + room.h / 2) * TILE_SIZE
  };
}

export function getRoomAt(map, x, y) {
  if (!map) return null;
  const tileX = Math.floor(x / map.tileSize);
  const tileY = Math.floor(y / map.tileSize);

  for (const room of map.roomDefs) {
    if (
      tileX >= room.x && tileX < room.x + room.w &&
      tileY >= room.y && tileY < room.y + room.h
    ) {
      return room;
    }
  }
  return null;
}

export function getTileAt(map, x, y) {
  if (!map) return null;
  const tileX = Math.floor(x / map.tileSize);
  const tileY = Math.floor(y / map.tileSize);
  if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
    return null;
  }
  const index = map.tiles[tileY * map.width + tileX];
  return {
    index,
    ...map.tileTypes[index]
  };
}

export function isRoomCompleted(room, equipmentSet) {
  if (!room || !room.npcId) return false;
  const equipment = equipmentSet;
  return Boolean(room.norm && equipment && equipment.hasByNorm?.(room.norm));
}
