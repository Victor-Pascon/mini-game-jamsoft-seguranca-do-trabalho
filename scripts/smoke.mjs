/**
 * Smoke test de dados e lógica, sem canvas.
 * Roda com: npm run smoke
 */
import { equipmentList, EQUIPMENT_BY_ID, TOTAL_EQUIPMENT } from '../js/data/equipment.js';
import { challenges, CHALLENGE_BY_NPC } from '../js/data/challenges.js';
import { norms, NORM_BY_NR } from '../js/data/norms.js';
import { npcs } from '../js/data/npcs.js';
import { safetyMap, TILE_TYPES, getRoomAt } from '../js/data/maps.js';

import { EquipmentSystem } from '../js/game/EquipmentSystem.js';
import { Challenge } from '../js/game/Challenge.js';
import { Dialog } from '../js/game/Dialog.js';
import { NormManual } from '../js/game/NormManual.js';

const failures = [];

function check(condition, message) {
  if (condition) {
    console.log(`OK   ${message}`);
  } else {
    failures.push(message);
    console.error(`FAIL ${message}`);
  }
}

class FakeInput {
  constructor(keys = []) {
    this.keys = new Set(keys);
  }

  isJustPressed(code) {
    if (this.keys.has(code)) {
      this.keys.delete(code);
      return true;
    }
    return false;
  }

  confirmPressed() {
    for (const code of ['Space', 'Enter', 'KeyZ']) {
      if (this.isJustPressed(code)) return true;
    }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Dados de equipamentos
// ---------------------------------------------------------------------------
check(TOTAL_EQUIPMENT === 10, 'Existem exatamente 10 itens de proteção');
check(
  new Set(equipmentList.map((item) => item.id)).size === equipmentList.length,
  'IDs de equipamentos são únicos'
);

for (const item of equipmentList) {
  check(Boolean(item.name && item.norm && item.icon && item.rule), `Equipamento ${item.id} está completo`);
  check(Boolean(NORM_BY_NR[item.norm]), `Equipamento ${item.id} aponta para uma NR existente (${item.norm})`);
}

// ---------------------------------------------------------------------------
// NRs
// ---------------------------------------------------------------------------
check(norms.length >= 12, 'O manual contém pelo menos 12 NRs');
check(
  new Set(norms.map((norm) => norm.nr)).size === norms.length,
  'Códigos de NR são únicos'
);

for (const norm of norms) {
  check(norm.rules.length >= 3, `${norm.nr} possui pelo menos 3 regras`);
  check(Boolean(norm.summary && norm.title && norm.color), `${norm.nr} possui resumo, título e cor`);
  if (norm.equipmentId) {
    check(Boolean(EQUIPMENT_BY_ID[norm.equipmentId]), `${norm.nr} aponta para um EPI existente`);
  }
}

// ---------------------------------------------------------------------------
// Desafios
// ---------------------------------------------------------------------------
check(challenges.length === 10, 'Existem exatamente 10 desafios');
check(
  new Set(challenges.map((challenge) => challenge.id)).size === challenges.length,
  'IDs de desafios são únicos'
);

for (const challenge of challenges) {
  check(challenge.options.length === 4, `${challenge.id} tem 4 alternativas`);
  check(
    Number.isInteger(challenge.correct) && challenge.correct >= 0 && challenge.correct < 4,
    `${challenge.id} tem índice correto válido`
  );
  check(Boolean(EQUIPMENT_BY_ID[challenge.equipmentId]), `${challenge.id} entrega um EPI conhecido`);
  check(Boolean(CHALLENGE_BY_NPC[challenge.npcId]), `${challenge.id} está ligado a um NPC`);
  check(challenge.norm === EQUIPMENT_BY_ID[challenge.equipmentId]?.norm, `${challenge.id} usa a NR do EPI`);
  check(Boolean(challenge.hint && challenge.explanation), `${challenge.id} tem dica e explicação`);
}

// ---------------------------------------------------------------------------
// NPCs e mapa
// ---------------------------------------------------------------------------
check(npcs.length === 10, 'Existem 10 especialistas');
check(
  new Set(npcs.map((npc) => npc.id)).size === npcs.length,
  'IDs de NPCs são únicos'
);

for (const npc of npcs) {
  check(Boolean(EQUIPMENT_BY_ID[npc.equipmentId]), `${npc.id} entrega EPI conhecido`);
  check(Boolean(CHALLENGE_BY_NPC[npc.id]), `${npc.id} tem desafio correspondente`);
  check(Boolean(safetyMap.rooms[npc.roomId]), `${npc.id} está em uma sala válida`);
  check(npc.dialogIntro.length >= 3, `${npc.id} tem diálogo de apresentação`);

  const room = safetyMap.rooms[npc.roomId];
  const centerX = npc.x + 13;
  const centerY = npc.y + 13;
  const roomAtNpc = getRoomAt(safetyMap, centerX, centerY);
  check(roomAtNpc?.id === room.id, `${npc.id} está dentro da própria sala`);

  const tileX = Math.floor(centerX / safetyMap.tileSize);
  const tileY = Math.floor(centerY / safetyMap.tileSize);
  const tile = safetyMap.tiles[tileY * safetyMap.width + tileX];
  check(tile !== TILE_TYPES.WALL, `${npc.id} não está sobre uma parede`);
}

check(safetyMap.width === 20 && safetyMap.height === 15, 'Mapa tem 20x15 tiles');
check(safetyMap.tiles.length === 20 * 15, 'Mapa tem 300 tiles');
check(safetyMap.roomDefs.length === 12, 'Mapa tem 12 salas');
check(
  safetyMap.roomDefs.filter((room) => room.npcId).length === 10,
  'Mapa tem 10 salas com especialistas'
);

const startX = Math.floor(safetyMap.playerStart.x / safetyMap.tileSize);
const startY = Math.floor(safetyMap.playerStart.y / safetyMap.tileSize);
const startTile = safetyMap.tiles[startY * safetyMap.width + startX];
check(!safetyMap.collisionTiles.includes(startTile), 'Jogador começa em tile livre');

for (const prop of safetyMap.props) {
  check(
    prop.x >= 0 && prop.y >= 0 && prop.x + prop.w <= 640 && prop.y + prop.h <= 480,
    `Prop ${prop.id} está dentro do canvas`
  );
}

// ---------------------------------------------------------------------------
// Progressão
// ---------------------------------------------------------------------------
const equipment = new EquipmentSystem();
check(!equipment.isComplete(), 'Progresso começa vazio');
for (const item of equipmentList) equipment.unlock(item.id);
check(equipment.isComplete(), 'Progresso fica completo com os 10 EPIs');
check(equipment.getCount() === 10, 'Contador de EPIs chega a 10');
check(equipment.getProgress() === 1, 'Progresso chega a 100%');
check(equipment.hasByNorm('NR-6'), 'Busca por NR encontra o capacete');

// ---------------------------------------------------------------------------
// Fluxo de desafio correto
// ---------------------------------------------------------------------------
const firstChallenge = challenges.find((challenge) => challenge.id === 'challenge_nr1');
const challenge = new Challenge();
challenge.startChallenge(firstChallenge);
challenge.update(0.016, new FakeInput(['ArrowDown']));
challenge.update(0.016, new FakeInput(['Space']));
check(challenge.isCompleted() === false, 'Desafio correto aguarda confirmação');
challenge.update(0.016, new FakeInput(['Space']));
check(challenge.isCompleted(), 'Desafio é concluído após confirmação');
check(challenge.getEquipmentId() === 'prancheta', 'Desafio NR-1 entrega a prancheta do PGR');
check(challenge.getNorm() === 'NR-1', 'Desafio NR-1 informa a NR correta');

// ---------------------------------------------------------------------------
// Fluxo de desafio errado + dica
// ---------------------------------------------------------------------------
const wrongChallenge = new Challenge();
wrongChallenge.startChallenge(challenges.find((item) => item.id === 'challenge_nr6'));
wrongChallenge.update(0.016, new FakeInput(['Space']));
check(wrongChallenge.isCompleted() === false, 'Resposta errada não conclui o desafio');
wrongChallenge.update(0.016, new FakeInput(['Space']));
wrongChallenge.update(0.016, new FakeInput(['Space']));
check(wrongChallenge.isCompleted() === false, 'Após a dica, o desafio continua aberto');

// ---------------------------------------------------------------------------
// Diálogo
// ---------------------------------------------------------------------------
const dialog = new Dialog();
dialog.startDialog(['Primeira fala de teste.', 'Segunda fala de teste.'], {
  name: 'Teste',
  role: 'QA',
  color: '#ff6f00',
  avatar: 'QA'
});
for (let index = 0; index < 20; index++) {
  dialog.update(0.1, new FakeInput(['Space']));
}
check(dialog.isFinished(), 'Diálogo avança e termina');

// ---------------------------------------------------------------------------
// Manual
// ---------------------------------------------------------------------------
const manual = new NormManual();
manual.open();
check(manual.isOpen(), 'Manual abre');
manual.update(0.016, new FakeInput(['ArrowRight']));
manual.update(0.016, new FakeInput(['Enter']));
manual.update(0.016, new FakeInput(['Escape']));
manual.update(0.016, new FakeInput(['KeyM']));
check(!manual.isOpen(), 'Manual fecha com M');

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
console.log('');
if (failures.length > 0) {
  console.error(`${failures.length} verificação(ões) falharam.`);
  process.exit(1);
}

console.log('Smoke test concluído com sucesso.');
