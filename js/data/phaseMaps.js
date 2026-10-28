import { COLORS } from '../design-tokens/snes-theme.js';
import { TILE_TYPES, tileTypes } from './maps.js';
import { getEquipment } from './equipment.js';
import { getNpc } from './npcs.js';
import { getNorm } from './norms.js';

/**
 * Fases lineares do jogo.
 *
 * Cada fase é uma sala temática completa (20x15 tiles) dedicada a uma NR.
 * A saída fica na parede direita e só é liberada depois que o desafio da fase
 * é concluído. Ao atravessar a porta, a próxima sala é carregada.
 *
 * A ordem segue a jornada "da cabeça aos pés" do HUD: capacete, óculos,
 * protetor, máscara, luvas, colete, cinto, calçado, prancheta e cadeira.
 */

const WIDTH = 20;
const HEIGHT = 15;
const TILE_SIZE = 32;
const ROOM = { x: 1, y: 2, w: 18, h: 11 };
const PLAYER_START = { x: 308, y: 356 };
const NPC_SPAWN = { x: 307, y: 196 };
const EXIT = { x: 18 * TILE_SIZE, y: 6 * TILE_SIZE, w: TILE_SIZE, h: 2 * TILE_SIZE };

const PHASE_SPECS = [
  {
    id: 'epi',
    npcId: 'npc_epi',
    name: 'Almoxarifado de EPI',
    label: 'NR-6 · ALMOXARIFADO',
    tile: TILE_TYPES.EPI_ROOM,
    color: COLORS.ROOM_EPI
  },
  {
    id: 'maquinas',
    npcId: 'npc_maquinas',
    name: 'Produção / Máquinas',
    label: 'NR-12 · MÁQUINAS',
    tile: TILE_TYPES.MAQUINAS_ROOM,
    color: COLORS.ROOM_MAQUINAS
  },
  {
    id: 'ruido',
    npcId: 'npc_ruido',
    name: 'Área de Ruído',
    label: 'NR-15 · RUÍDO',
    tile: TILE_TYPES.RUIDO_ROOM,
    color: COLORS.ROOM_RUIDO
  },
  {
    id: 'brigada',
    npcId: 'npc_brigada',
    name: 'Brigada de Incêndio',
    label: 'NR-23 · INCÊNDIO',
    tile: TILE_TYPES.BRIGADA_ROOM,
    color: COLORS.ROOM_BRIGADA
  },
  {
    id: 'eletrica',
    npcId: 'npc_eletrica',
    name: 'Oficina Elétrica',
    label: 'NR-10 · ELÉTRICA',
    tile: TILE_TYPES.ELETRICA_ROOM,
    color: COLORS.ROOM_ELETRICA
  },
  {
    id: 'sinalizacao',
    npcId: 'npc_sinalizacao',
    name: 'Sinalização de Segurança',
    label: 'NR-26 · SINALIZAÇÃO',
    tile: TILE_TYPES.SINALIZACAO_ROOM,
    color: COLORS.ROOM_SINALIZACAO
  },
  {
    id: 'altura',
    npcId: 'npc_altura',
    name: 'Trabalho em Altura',
    label: 'NR-35 · ALTURA',
    tile: TILE_TYPES.ALTURA_ROOM,
    color: COLORS.ROOM_ALTURA
  },
  {
    id: 'logistica',
    npcId: 'npc_logistica',
    name: 'Logística',
    label: 'NR-11 · LOGÍSTICA',
    tile: TILE_TYPES.LOGISTICA_ROOM,
    color: COLORS.ROOM_LOGISTICA
  },
  {
    id: 'pgr',
    npcId: 'npc_pgr',
    name: 'Sala do PGR',
    label: 'NR-1 · SESMT / PGR',
    tile: TILE_TYPES.PGR_ROOM,
    color: COLORS.ROOM_PGR
  },
  {
    id: 'ergonomia',
    npcId: 'npc_ergonomia',
    name: 'Escritório Ergonômico',
    label: 'NR-17 · ERGONOMIA',
    tile: TILE_TYPES.ERGONOMIA_ROOM,
    color: COLORS.ROOM_ERGONOMIA
  }
];

/**
 * Decoração fixa de cada fase. O pôster central é gerado a partir das regras
 * oficiais resumidas em norms.js; os demais props reforçam o risco e os
 * objetos de proteção daquela NR.
 */
const DECOR = {
  epi: [
    { id: 'epi_shelf_a', type: 'shelf', x: 40, y: 84, w: 64, h: 24, color: '#8d6e63' },
    { id: 'epi_shelf_b', type: 'shelf', x: 40, y: 114, w: 64, h: 24, color: '#8d6e63' },
    { id: 'epi_rack', type: 'helmetRack', x: 40, y: 146, w: 54, h: 28 },
    { id: 'epi_locker_a', type: 'locker', x: 520, y: 84, w: 56, h: 64, color: '#607d8b' },
    { id: 'epi_locker_b', type: 'locker', x: 488, y: 154, w: 56, h: 64, color: '#607d8b' },
    { id: 'epi_cabinet', type: 'cabinet', x: 40, y: 300, w: 48, h: 56, color: '#90a4ae' },
    { id: 'epi_pallet', type: 'pallet', x: 500, y: 340, w: 58, h: 44 },
    { id: 'epi_sign', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107', label: 'EPI' },
    { id: 'epi_bench', type: 'bench', x: 200, y: 376, w: 96, h: 12 }
  ],
  maquinas: [
    { id: 'maquinas_machine', type: 'machine', x: 40, y: 84, w: 72, h: 52, color: '#c62828' },
    { id: 'maquinas_conveyor', type: 'conveyor', x: 40, y: 176, w: 136, h: 16 },
    { id: 'maquinas_fence', type: 'safetyFence', x: 40, y: 200, w: 136, h: 10 },
    { id: 'maquinas_cart', type: 'toolcart', x: 40, y: 220, w: 32, h: 28 },
    { id: 'maquinas_cabinet', type: 'cabinet', x: 520, y: 84, w: 56, h: 60, color: '#90a4ae' },
    { id: 'maquinas_shelf', type: 'shelf', x: 488, y: 152, w: 56, h: 24, color: '#8d6e63' },
    { id: 'maquinas_pallet', type: 'pallet', x: 40, y: 300, w: 60, h: 40 },
    { id: 'maquinas_sign', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107' },
    { id: 'maquinas_cone_a', type: 'cone', x: 500, y: 350, w: 10, h: 18 },
    { id: 'maquinas_cone_b', type: 'cone', x: 530, y: 350, w: 10, h: 18 },
    { id: 'maquinas_barrier', type: 'barrier', x: 460, y: 380, w: 96, h: 14 }
  ],
  ruido: [
    { id: 'ruido_machine', type: 'noise', x: 40, y: 84, w: 80, h: 60, color: '#78909c' },
    { id: 'ruido_meter', type: 'soundMeter', x: 130, y: 84, w: 22, h: 30 },
    { id: 'ruido_panel_a', type: 'acousticPanel', x: 40, y: 154, w: 48, h: 64 },
    { id: 'ruido_muffs', type: 'earmuffStation', x: 40, y: 230, w: 56, h: 36 },
    { id: 'ruido_panel_b', type: 'acousticPanel', x: 520, y: 84, w: 56, h: 60 },
    { id: 'ruido_cabinet', type: 'cabinet', x: 520, y: 300, w: 56, h: 56, color: '#90a4ae' },
    { id: 'ruido_sign', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107', label: 'RUÍDO' },
    { id: 'ruido_cone_a', type: 'cone', x: 500, y: 350, w: 10, h: 18 },
    { id: 'ruido_cone_b', type: 'cone', x: 530, y: 350, w: 10, h: 18 },
    { id: 'ruido_barrier', type: 'barrier', x: 460, y: 380, w: 96, h: 14 }
  ],
  brigada: [
    { id: 'brigada_ext', type: 'extinguisher', x: 40, y: 84, w: 18, h: 34, color: '#e53935' },
    { id: 'brigada_hose', type: 'hosebox', x: 70, y: 84, w: 40, h: 36, color: '#c62828' },
    { id: 'brigada_alarm', type: 'fireAlarm', x: 120, y: 84, w: 16, h: 24 },
    { id: 'brigada_blanket', type: 'fireBlanket', x: 150, y: 84, w: 28, h: 32 },
    { id: 'brigada_locker', type: 'locker', x: 520, y: 84, w: 56, h: 64, color: '#607d8b' },
    { id: 'brigada_cabinet', type: 'cabinet', x: 40, y: 300, w: 48, h: 56, color: '#90a4ae' },
    { id: 'brigada_sign', type: 'sign', x: 480, y: 300, w: 20, h: 20, color: '#ffc107', label: 'FUGA' },
    { id: 'brigada_barrier', type: 'barrier', x: 460, y: 330, w: 96, h: 14 },
    { id: 'brigada_cone_a', type: 'cone', x: 500, y: 350, w: 10, h: 18 },
    { id: 'brigada_cone_b', type: 'cone', x: 530, y: 350, w: 10, h: 18 }
  ],
  eletrica: [
    { id: 'eletrica_panel', type: 'panel', x: 40, y: 84, w: 64, h: 50, color: '#f9a825' },
    { id: 'eletrica_sign', type: 'sign', x: 110, y: 84, w: 20, h: 20, color: '#ffc107', label: 'TENSÃO' },
    { id: 'eletrica_reel', type: 'cableReel', x: 40, y: 150, w: 44, h: 40 },
    { id: 'eletrica_barrier', type: 'barrier', x: 40, y: 210, w: 80, h: 16 },
    { id: 'eletrica_cart', type: 'toolcart', x: 520, y: 84, w: 36, h: 32 },
    { id: 'eletrica_cabinet', type: 'cabinet', x: 488, y: 126, w: 56, h: 48, color: '#90a4ae' },
    { id: 'eletrica_sign_2', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107' },
    { id: 'eletrica_cone_a', type: 'cone', x: 500, y: 350, w: 10, h: 18 },
    { id: 'eletrica_cone_b', type: 'cone', x: 530, y: 350, w: 10, h: 18 },
    { id: 'eletrica_barrier_2', type: 'barrier', x: 460, y: 380, w: 96, h: 14 }
  ],
  sinalizacao: [
    { id: 'sinalizacao_sign_a', type: 'sign', x: 40, y: 84, w: 22, h: 20, color: '#26a69a', label: 'PARE' },
    { id: 'sinalizacao_cone_a', type: 'cone', x: 72, y: 84, w: 10, h: 18 },
    { id: 'sinalizacao_cone_b', type: 'cone', x: 96, y: 84, w: 10, h: 18 },
    { id: 'sinalizacao_barrier', type: 'barrier', x: 40, y: 120, w: 100, h: 14 },
    { id: 'sinalizacao_floor', type: 'floorSign', x: 180, y: 330, w: 80, h: 30, color: '#ffc107', label: 'NR-26' },
    { id: 'sinalizacao_exit', type: 'exitSign', x: 520, y: 84, w: 56, h: 26 },
    { id: 'sinalizacao_barrier_2', type: 'barrier', x: 520, y: 130, w: 56, h: 14 },
    { id: 'sinalizacao_sign_b', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107' },
    { id: 'sinalizacao_cone_c', type: 'cone', x: 500, y: 350, w: 10, h: 18 },
    { id: 'sinalizacao_cone_d', type: 'cone', x: 530, y: 350, w: 10, h: 18 },
    { id: 'sinalizacao_trash', type: 'trash', x: 560, y: 300, w: 12, h: 16 }
  ],
  altura: [
    { id: 'altura_scaffold', type: 'scaffold', x: 40, y: 84, w: 50, h: 80, color: '#90a4ae' },
    { id: 'altura_ladder', type: 'ladder', x: 100, y: 84, w: 22, h: 80 },
    { id: 'altura_anchor', type: 'anchor', x: 140, y: 84, w: 24, h: 24 },
    { id: 'altura_rack', type: 'harnessRack', x: 40, y: 190, w: 56, h: 40 },
    { id: 'altura_barrier', type: 'barrier', x: 40, y: 250, w: 80, h: 16 },
    { id: 'altura_fence', type: 'safetyFence', x: 520, y: 84, w: 56, h: 10 },
    { id: 'altura_cabinet', type: 'cabinet', x: 488, y: 110, w: 56, h: 60, color: '#90a4ae' },
    { id: 'altura_sign', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107' },
    { id: 'altura_cone_a', type: 'cone', x: 500, y: 350, w: 10, h: 18 },
    { id: 'altura_cone_b', type: 'cone', x: 530, y: 350, w: 10, h: 18 },
    { id: 'altura_barrier_2', type: 'barrier', x: 460, y: 380, w: 96, h: 14 }
  ],
  logistica: [
    { id: 'logistica_pallet', type: 'pallet', x: 40, y: 84, w: 60, h: 40 },
    { id: 'logistica_boxes', type: 'boxes', x: 110, y: 84, w: 40, h: 40 },
    { id: 'logistica_tote', type: 'tote', x: 150, y: 84, w: 24, h: 20 },
    { id: 'logistica_forklift', type: 'forklift', x: 40, y: 150, w: 72, h: 52 },
    { id: 'logistica_shelf_a', type: 'shelf', x: 520, y: 84, w: 56, h: 24, color: '#8d6e63' },
    { id: 'logistica_shelf_b', type: 'shelf', x: 520, y: 114, w: 56, h: 24, color: '#8d6e63' },
    { id: 'logistica_sign', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107' },
    { id: 'logistica_barrier', type: 'barrier', x: 460, y: 330, w: 96, h: 14 },
    { id: 'logistica_pallet_b', type: 'pallet', x: 500, y: 350, w: 58, h: 44 }
  ],
  pgr: [
    { id: 'pgr_board', type: 'board', x: 40, y: 84, w: 120, h: 60, color: '#42a5f5' },
    { id: 'pgr_desk', type: 'desk', x: 40, y: 160, w: 140, h: 20, color: '#5d4037' },
    { id: 'pgr_monitor', type: 'monitor', x: 70, y: 146, w: 28, h: 18 },
    { id: 'pgr_chair', type: 'chair', x: 60, y: 186, w: 24, h: 30 },
    { id: 'pgr_cabinet', type: 'cabinet', x: 520, y: 84, w: 56, h: 64, color: '#90a4ae' },
    { id: 'pgr_printer', type: 'printer', x: 520, y: 154, w: 28, h: 20 },
    { id: 'pgr_plant', type: 'plant', x: 520, y: 300, w: 18, h: 24 },
    { id: 'pgr_sign', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107' },
    { id: 'pgr_trash', type: 'trash', x: 560, y: 300, w: 12, h: 16 }
  ],
  ergonomia: [
    { id: 'ergonomia_desk', type: 'desk', x: 40, y: 84, w: 140, h: 20, color: '#5d4037' },
    { id: 'ergonomia_monitor', type: 'monitor', x: 80, y: 70, w: 28, h: 18 },
    { id: 'ergonomia_printer', type: 'printer', x: 40, y: 112, w: 28, h: 20 },
    { id: 'ergonomia_chair', type: 'chair', x: 60, y: 120, w: 24, h: 30 },
    { id: 'ergonomia_cabinet', type: 'cabinet', x: 520, y: 84, w: 56, h: 60, color: '#90a4ae' },
    { id: 'ergonomia_water', type: 'watercooler', x: 520, y: 154, w: 24, h: 36 },
    { id: 'ergonomia_plant_a', type: 'plant', x: 520, y: 300, w: 18, h: 24 },
    { id: 'ergonomia_plant_b', type: 'plant', x: 40, y: 300, w: 18, h: 24 },
    { id: 'ergonomia_sign', type: 'sign', x: 480, y: 310, w: 20, h: 20, color: '#ffc107' }
  ]
};

function buildPoster(phase) {
  const norm = phase.normData;
  return {
    id: 'phase_poster',
    type: 'normPoster',
    x: 180,
    y: 84,
    w: 280,
    h: 88,
    color: phase.color,
    norm: phase.norm,
    title: norm?.short || phase.norm,
    lines: Array.isArray(norm?.rules) ? norm.rules.slice(0, 3) : []
  };
}

export const PHASES = PHASE_SPECS.map((spec) => {
  const npc = getNpc(spec.npcId);
  const equipment = getEquipment(npc?.equipmentId);
  const norm = equipment?.norm || npc?.norm || '';
  return {
    ...spec,
    npcName: npc?.name || 'Especialista',
    equipmentId: equipment?.id || npc?.equipmentId || '',
    norm,
    normData: getNorm(norm)
  };
});

export const PHASE_COUNT = PHASES.length;

export function getPhase(index) {
  return PHASES[index] || null;
}

export function getPhaseByNpc(npcId) {
  return PHASES.find((phase) => phase.npcId === npcId) || null;
}

export function getPhaseIndexByNpc(npcId) {
  return PHASES.findIndex((phase) => phase.npcId === npcId);
}

/**
 * Cria uma cópia nova do mapa da fase. A cópia evita que uma partida altere
 * o estado de outra (importante para o save e para o reinício do jogo).
 */
export function getPhaseMap(index) {
  const phase = PHASES[Math.max(0, Math.min(PHASES.length - 1, index))];
  if (!phase) return null;

  const tiles = new Array(WIDTH * HEIGHT).fill(TILE_TYPES.WALL);

  for (let y = ROOM.y; y < ROOM.y + ROOM.h; y++) {
    for (let x = ROOM.x; x < ROOM.x + ROOM.w; x++) {
      tiles[y * WIDTH + x] = phase.tile;
    }
  }

  // Porta de saída na parede direita, em duas lajes.
  tiles[6 * WIDTH + 18] = TILE_TYPES.DOOR;
  tiles[7 * WIDTH + 18] = TILE_TYPES.DOOR;

  const room = {
    id: phase.id,
    x: ROOM.x,
    y: ROOM.y,
    w: ROOM.w,
    h: ROOM.h,
    tile: phase.tile,
    name: phase.name,
    norm: phase.norm,
    npcId: phase.npcId,
    color: phase.color,
    label: phase.label,
    phaseLabel: phase.label
  };

  return {
    id: `phase_${phase.id}`,
    phase: true,
    phaseIndex: index,
    width: WIDTH,
    height: HEIGHT,
    tileSize: TILE_SIZE,
    collisionTiles: [TILE_TYPES.WALL],
    tileTypes,
    tiles,
    roomDefs: [room],
    rooms: { [room.id]: room },
    props: [buildPoster(phase), ...(DECOR[phase.id] || [])],
    playerStart: { ...PLAYER_START },
    npcSpawn: { ...NPC_SPAWN },
    exit: { ...EXIT }
  };
}
