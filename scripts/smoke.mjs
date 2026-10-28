/**
 * Smoke test de dados e lógica, sem canvas.
 * Roda com: npm run smoke
 */
import { equipmentList, EQUIPMENT_BY_ID, TOTAL_EQUIPMENT } from '../js/data/equipment.js';
import { challenges, CHALLENGE_BY_NPC } from '../js/data/challenges.js';
import { norms, NORM_BY_NR } from '../js/data/norms.js';
import { npcs } from '../js/data/npcs.js';
import { safetyMap, TILE_TYPES, getRoomAt } from '../js/data/maps.js';
import { PHASES, getPhaseMap } from '../js/data/phaseMaps.js';

import { EquipmentSystem } from '../js/game/EquipmentSystem.js';
import { Challenge } from '../js/game/Challenge.js';
import { Dialog } from '../js/game/Dialog.js';
import { NormManual } from '../js/game/NormManual.js';
import { Inventory } from '../js/game/Inventory.js';
import { Player } from '../js/game/Player.js';
import { decorativeItems, isDecorationUnlocked } from '../js/data/decorations.js';
import { SaveSystem } from '../js/engine/SaveSystem.js';
import { readGamepad } from '../js/engine/Gamepad.js';
import { PauseMenu, PAUSE_OPTIONS } from '../js/game/PauseMenu.js';

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
// Fases lineares
// ---------------------------------------------------------------------------
check(PHASES.length === 10, 'Existem exatamente 10 fases lineares');
check(new Set(PHASES.map((phase) => phase.id)).size === PHASES.length, 'IDs de fases são únicos');
check(
  new Set(PHASES.map((phase) => phase.equipmentId)).size === PHASES.length,
  'Cada fase entrega um EPI diferente'
);

for (let index = 0; index < PHASES.length; index++) {
  const phase = PHASES[index];
  const map = getPhaseMap(index);

  check(Boolean(phase.normData), `${phase.id} tem dados de NR`);
  check(Boolean(EQUIPMENT_BY_ID[phase.equipmentId]), `${phase.id} entrega EPI conhecido`);
  check(Boolean(CHALLENGE_BY_NPC[phase.npcId]), `${phase.id} tem desafio correspondente`);
  check(npcs.some((npc) => npc.id === phase.npcId), `${phase.id} tem especialista válido`);

  check(Boolean(map), `${phase.id} gera mapa`);
  check(map.width === 20 && map.height === 15, `${phase.id} tem 20x15 tiles`);
  check(map.phase === true, `${phase.id} é marcado como fase`);
  check(map.roomDefs.length === 1, `${phase.id} tem uma sala temática`);
  check(map.roomDefs[0].norm === phase.norm, `${phase.id} exibe a NR correta`);
  check(
    map.props.some((prop) => prop.type === 'normPoster'),
    `${phase.id} decora a sala com pôster de regras`
  );

  const startTileX = Math.floor(map.playerStart.x / map.tileSize);
  const startTileY = Math.floor(map.playerStart.y / map.tileSize);
  const startTile = map.tiles[startTileY * map.width + startTileX];
  check(!map.collisionTiles.includes(startTile), `${phase.id} começa com jogador em piso livre`);

  const npcTileX = Math.floor(map.npcSpawn.x / map.tileSize);
  const npcTileY = Math.floor(map.npcSpawn.y / map.tileSize);
  const npcTile = map.tiles[npcTileY * map.width + npcTileX];
  check(!map.collisionTiles.includes(npcTile), `${phase.id} posiciona o especialista em piso livre`);

  const exitTileX = Math.floor(map.exit.x / map.tileSize);
  const exitTileY = Math.floor(map.exit.y / map.tileSize);
  check(
    map.tiles[exitTileY * map.width + exitTileX] === TILE_TYPES.DOOR,
    `${phase.id} tem porta de saída no mapa`
  );

  for (const prop of map.props) {
    check(
      prop.x >= 0 && prop.y >= 0 && prop.x + prop.w <= 640 && prop.y + prop.h <= 480,
      `${phase.id}: prop ${prop.id} está dentro do canvas`
    );
  }

  check(
    Array.isArray(map.workers) && map.workers.length >= 2,
    `${phase.id} tem uma equipe trabalhando no setor`
  );
  check(
    new Set((map.workers || []).map((worker) => worker.id)).size === (map.workers || []).length,
    `${phase.id} tem IDs de funcionários únicos`
  );
  check(
    (map.workers || []).some((worker) => worker.equipment.includes(phase.equipmentId)),
    `${phase.id} mostra o EPI da fase em um funcionário`
  );

  for (const worker of map.workers || []) {
    check(
      worker.x - 3 >= 0 &&
        worker.y - 9 >= 0 &&
        worker.x + 36 <= 640 &&
        worker.y + 33 <= 480,
      `${phase.id}: funcionário ${worker.id} está dentro do canvas`
    );
    check(Boolean(worker.task), `${phase.id}: funcionário ${worker.id} tem tarefa visível`);
    check(
      (worker.equipment || []).every((id) => Boolean(EQUIPMENT_BY_ID[id])),
      `${phase.id}: funcionário ${worker.id} usa apenas EPIs conhecidos`
    );
  }

  const reservedZones = [
    { name: 'pôster de regras', x: 180, y: 84, w: 280, h: 88 },
    { name: 'moldura e placa da porta', x: map.exit.x - 28, y: map.exit.y - 34, w: map.exit.w + 60, h: map.exit.h + 42 },
    { name: 'especialista', x: 295, y: 188, w: 50, h: 48 },
    { name: 'início do jogador', x: 300, y: 348, w: 40, h: 40 }
  ];

  const layoutViolations = [];
  for (const prop of map.props) {
    for (const zone of reservedZones) {
      if (prop.type === 'normPoster' && zone.name === 'pôster de regras') continue;
      const overlaps =
        prop.x < zone.x + zone.w &&
        prop.x + prop.w > zone.x &&
        prop.y < zone.y + zone.h &&
        prop.y + prop.h > zone.y;
      if (overlaps) layoutViolations.push(`${prop.id} invade ${zone.name}`);
    }
  }
  check(
    layoutViolations.length === 0,
    `${phase.id} mantém pôster, porta, especialista e início do jogador livres${
      layoutViolations.length ? `: ${layoutViolations.join('; ')}` : ''
    }`
  );

  const workerViolations = [];
  for (const worker of map.workers || []) {
    const bounds = { x: worker.x - 3, y: worker.y - 9, w: 39, h: 42 };
    for (const zone of reservedZones) {
      const overlaps =
        bounds.x < zone.x + zone.w &&
        bounds.x + bounds.w > zone.x &&
        bounds.y < zone.y + zone.h &&
        bounds.y + bounds.h > zone.y;
      if (overlaps) workerViolations.push(`${worker.id} invade ${zone.name}`);
    }
  }
  check(
    workerViolations.length === 0,
    `${phase.id} posiciona funcionários fora das áreas reservadas${
      workerViolations.length ? `: ${workerViolations.join('; ')}` : ''
    }`
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
// Inventário e decoração
// ---------------------------------------------------------------------------
check(decorativeItems.length === 3, 'Existem 3 itens decorativos');
check(
  new Set(decorativeItems.map((item) => item.id)).size === decorativeItems.length,
  'IDs de itens decorativos são únicos'
);

const invEquipment = new EquipmentSystem();
const invPlayer = new Player({ x: 0, y: 0 });
const inventory = new Inventory();
inventory.open();
check(inventory.isOpen(), 'Inventário abre');

inventory.update(0.016, new FakeInput(['Enter']), { equipment: invEquipment, player: invPlayer });
check(invPlayer.decoration === null, 'Decoração pode ser removida');
check(inventory.consumeChanged(), 'Mudança de decoração solicita save');

inventory.update(0.016, new FakeInput(['Enter']), { equipment: invEquipment, player: invPlayer });
check(invPlayer.decoration === 'pin_jamsoft', 'Decoração pode ser equipada');

inventory.update(0.016, new FakeInput(['ArrowDown']), { equipment: invEquipment, player: invPlayer });
inventory.update(0.016, new FakeInput(['Enter']), { equipment: invEquipment, player: invPlayer });
check(invPlayer.decoration === 'pin_jamsoft', 'Item decorativo bloqueado não equipa');

invEquipment.unlock('capacete');
check(
  isDecorationUnlocked(decorativeItems[1], invEquipment),
  'Adesivo de capacete libera com o capacete'
);
inventory.update(0.016, new FakeInput(['Enter']), { equipment: invEquipment, player: invPlayer });
check(invPlayer.decoration === 'adesivo_capacete', 'Adesivo de capacete pode ser equipado');

for (const item of equipmentList.slice(0, 5)) {
  invEquipment.unlock(item.id);
}
inventory.update(0.016, new FakeInput(['ArrowDown']), { equipment: invEquipment, player: invPlayer });
inventory.update(0.016, new FakeInput(['Enter']), { equipment: invEquipment, player: invPlayer });
check(invPlayer.decoration === 'faixa_guardiao', 'Faixa de guardião libera após 5 fases');

inventory.update(0.016, new FakeInput(['KeyM']), { equipment: invEquipment, player: invPlayer });
check(inventory.consumeStudyRequest(), 'Inventário solicita material de estudo');
inventory.update(0.016, new FakeInput(['KeyI']), { equipment: invEquipment, player: invPlayer });
check(!inventory.isOpen(), 'Inventário fecha com I');

// ---------------------------------------------------------------------------
// Controle Xbox (mapeamento puro, sem navegador)
// ---------------------------------------------------------------------------
function fakeGamepad({ buttons = {}, axes = [0, 0] } = {}) {
  return {
    index: 0,
    connected: true,
    mapping: 'standard',
    axes,
    buttons: Array.from({ length: 16 }, (_, index) => ({
      pressed: Boolean(buttons[index]),
      value: buttons[index] ? 1 : 0
    }))
  };
}

const neutralPad = readGamepad(fakeGamepad());
check(neutralPad?.buttons.a === false, 'Controle neutro não confirma sozinho');
check(neutralPad?.movement.x === 0 && neutralPad?.movement.y === 0, 'Controle neutro não move');

const facePad = readGamepad(fakeGamepad({ buttons: { 0: true, 1: true, 2: true, 3: true, 9: true } }));
check(facePad?.buttons.a && facePad?.buttons.b, 'A e B do controle são mapeados');
check(facePad?.buttons.x && facePad?.buttons.y, 'X e Y do controle são mapeados');
check(facePad?.buttons.start, 'Start do controle é mapeado');

const dpadPad = readGamepad(fakeGamepad({ buttons: { 12: true, 14: true } }));
check(dpadPad?.directions.up && dpadPad?.directions.left, 'D-pad funciona nas direções');
check(dpadPad?.movement.x === 0 && dpadPad?.movement.y === 0, 'D-pad não altera o vetor analógico');

const analogPad = readGamepad(fakeGamepad({ axes: [0, -0.8] }));
check(analogPad?.directions.up, 'Analógico funciona nos menus');
check(analogPad?.movement.y < 0, 'Analógico move o personagem');

const deadzonePad = readGamepad(fakeGamepad({ axes: [0.18, 0.12] }));
check(deadzonePad?.movement.x === 0 && deadzonePad?.movement.y === 0, 'Zona morta ignora drift do analógico');

const analogRight = readGamepad(fakeGamepad({ axes: [0.85, 0.1] }));
check(
  analogRight?.directions.right && !analogRight?.directions.down,
  'Analógico usa o eixo dominante nos menus'
);

const pause = new PauseMenu();
check(PAUSE_OPTIONS.length === 5, 'Menu de pausa tem cinco opções');
pause.open();
pause.update(0.016, new FakeInput(['ArrowDown']));
check(pause.getSelectedId() === 'inventory', 'Menu de pausa navega com setas/D-pad');
pause.update(0.016, new FakeInput(['Space']));
check(!pause.isOpen() && pause.consumeAction() === 'inventory', 'A confirma a opção do menu');
pause.open();
pause.update(0.016, new FakeInput(['Start']));
check(pause.consumeAction() === 'resume', 'Start fecha o menu de pausa');
pause.open();
pause.update(0.016, new FakeInput(['Escape']));
check(pause.consumeAction() === 'resume', 'B fecha o menu de pausa');

// ---------------------------------------------------------------------------
// Save da fase
// ---------------------------------------------------------------------------
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
};
const saveSystem = new SaveSystem();
const savePlayer = new Player({ x: 308, y: 356 });
savePlayer.setDecoration(null);
saveSystem.saveGame(savePlayer, ['capacete'], ['challenge_nr6'], 1, 42.5);
const loadedSave = saveSystem.loadGame();
check(loadedSave?.phase === 1, 'Save persiste a fase atual');
check(loadedSave?.equipment?.includes('capacete'), 'Save persiste os EPIs da fase');
check(
  loadedSave?.completedChallenges?.includes('challenge_nr6'),
  'Save persiste os desafios concluídos'
);
check(loadedSave?.playTime === 42.5, 'Save persiste o tempo de jogo');
check(loadedSave?.player?.decoration === null, 'Save persiste a decoração removida');
delete globalThis.localStorage;

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
console.log('');
if (failures.length > 0) {
  console.error(`${failures.length} verificação(ões) falharam.`);
  process.exit(1);
}

console.log('Smoke test concluído com sucesso.');
