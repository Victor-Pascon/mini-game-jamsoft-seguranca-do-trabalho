import { Renderer } from '../engine/Renderer.js';
import { Input } from '../engine/Input.js';
import { SaveSystem } from '../engine/SaveSystem.js';
import { Sound } from '../engine/Sound.js';
import { Collision } from '../engine/Collision.js';
import { wrapText } from '../engine/TextUtils.js';
import { COLORS, FONTS } from '../design-tokens/snes-theme.js';

import { StateManager, STATE } from './State.js';
import { Player } from './Player.js';
import { NPC } from './NPC.js';
import { EquipmentSystem } from './EquipmentSystem.js';
import { Dialog } from './Dialog.js';
import { Challenge } from './Challenge.js';
import { NormManual } from './NormManual.js';
import { Inventory } from './Inventory.js';
import { PauseMenu } from './PauseMenu.js';
import { Certificate } from './Certificate.js';
import { drawProp, drawRoomLabels, getNearbyInteractiveProp } from './Props.js';
import { drawIcon, drawOverlay } from './EquipmentRenderer.js';
import { drawMapDetails, drawDust, drawPhaseDoor } from './EnvironmentRenderer.js';
import { drawPlayerSprite } from './CharacterRenderer.js';
import { drawWorker } from './WorkerRenderer.js';

import { getRoomAt } from '../data/maps.js';
import { PHASES, getPhaseMap } from '../data/phaseMaps.js';
import { getNpc } from '../data/npcs.js';
import { getChallengeByNpc } from '../data/challenges.js';
import { dialogs } from '../data/dialogs.js';
import { equipmentList, getEquipment } from '../data/equipment.js';

/**
 * Game - orquestra o loop principal, estados, HUD, exploração, desafios,
 * manual de NRs e certificado final.
 */
export class Game {
  constructor(canvas) {
    this._renderer = new Renderer(canvas);
    this._input = new Input();
    this._save = new SaveSystem();
    this._sound = new Sound();
    this._state = new StateManager();
    this._map = getPhaseMap(0);
    this._phaseIndex = 0;
    this._phaseSolved = false;

    this._manual = new NormManual(this._sound);
    this._inventory = new Inventory(this._sound);
    this._pause = new PauseMenu(this._sound);
    this._certificate = new Certificate();
    this._dialog = new Dialog();
    this._challenge = new Challenge(this._sound);
    this._introDialog = new Dialog();

    this._player = null;
    this._npcs = [];
    this._equipment = new EquipmentSystem();
    this._completedChallenges = [];

    this._activeNpc = null;
    this._nearbyNpc = null;
    this._nearbyProp = null;
    this._nearDoor = false;

    this._showIntro = false;
    this._menuSelection = 0;
    this._helpOpen = false;
    this._toast = null;
    this._toastTimer = 0;

    this._time = 0;
    this._playTime = 0;
    this._lastTime = 0;
    this._running = false;
    this._rafId = null;

    // O cenário (piso, paredes, luzes e rótulos) não muda durante a partida.
    // Renderizá-lo uma vez em um canvas auxiliar economiza milhares de
    // operações de desenho por frame e mantém a exploração fluida.
    this._backgroundCanvas = document.createElement('canvas');
    this._backgroundCanvas.width = 640;
    this._backgroundCanvas.height = 480;
    this._backgroundRenderer = new Renderer(this._backgroundCanvas);

    this._resetWorld(false);
  }

  _buildMapBackground() {
    const renderer = this._backgroundRenderer;
    renderer.clear();
    renderer.drawMap(this._map, this._map.tileSize);
    drawMapDetails(renderer, this._map, 0, { dust: false });
    drawRoomLabels(renderer, this._map);
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    this._rafId = requestAnimationFrame((time) => this._loop(time));
  }

  stop() {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._input.destroy();
  }

  _loop(time) {
    if (!this._running) return;

    const deltaTime = Math.min((time - this._lastTime) / 1000, 0.05);
    this._lastTime = time;

    this.update(deltaTime);
    this.render();

    this._rafId = requestAnimationFrame((nextTime) => this._loop(nextTime));
  }

  _resetWorld(showIntro = false) {
    this._player = new Player({ x: 0, y: 0 });
    this._npcs = [];
    this._equipment = new EquipmentSystem();
    this._completedChallenges = [];
    this._dialog = new Dialog();
    this._challenge = new Challenge(this._sound);
    this._introDialog = new Dialog();
    this._certificate = new Certificate();
    this._manual = new NormManual(this._sound);
    this._inventory = new Inventory(this._sound);
    this._pause = new PauseMenu(this._sound);
    this._helpOpen = false;

    this._phaseIndex = 0;
    this._phaseSolved = false;
    this._activeNpc = null;
    this._nearbyNpc = null;
    this._nearbyProp = null;
    this._nearDoor = false;
    this._playTime = 0;

    this._loadPhase(0);
    this._showIntro = showIntro;
    this._toast = null;
    this._toastTimer = 0;

    this._syncNpcStates();
  }

  _loadPhase(index) {
    const safeIndex = Math.max(0, Math.min(PHASES.length - 1, index));
    const phase = PHASES[safeIndex];
    if (!phase) return;

    this._phaseIndex = safeIndex;
    this._map = getPhaseMap(safeIndex);
    this._phaseSolved = this._equipment.has(phase.equipmentId);

    this._player.setPosition(this._map.playerStart.x, this._map.playerStart.y);
    this._player.setEquipment(this._equipment.getAll());

    const npcData = getNpc(phase.npcId);
    this._npcs = npcData
      ? [new NPC({ ...npcData, x: this._map.npcSpawn.x, y: this._map.npcSpawn.y })]
      : [];

    this._activeNpc = null;
    this._nearbyNpc = null;
    this._nearbyProp = null;
    this._nearDoor = false;
    this._buildMapBackground();
    this._syncNpcStates();
  }

  _syncNpcStates() {
    for (const npc of this._npcs) {
      const data = getNpc(npc.npcId);
      npc.setCompleted(Boolean(data && this._equipment.has(data.equipmentId)));
    }
  }

  _startNewGame() {
    this._resetWorld(false);
    this._save.delete();
    this._state.setState(STATE.EXPLORE);
    this._showIntro = true;
    this._introDialog.startDialog(dialogs.intro, dialogs.introSpeaker);
    this._menuSelection = 0;
    this._helpOpen = false;
    this._sound.playStart();
  }

  _loadGame() {
    const saved = this._save.loadGame();
    if (!saved) {
      this._sound.playWrong();
      this._showToast('Nenhum progresso salvo. Comece um novo jogo.', 2.2);
      return;
    }

    this._resetWorld(false);
    this._equipment.loadFromArray(saved.equipment);
    this._completedChallenges = Array.isArray(saved.completedChallenges)
      ? [...saved.completedChallenges]
      : [];
    this._playTime = Number.isFinite(saved.playTime) ? Math.max(0, saved.playTime) : 0;

    const savedPhase = Number.isInteger(saved.phase) ? saved.phase : -1;
    let phaseIndex = savedPhase;
    if (phaseIndex < 0 || phaseIndex >= PHASES.length) {
      const firstMissing = PHASES.findIndex(
        (phase) => !this._equipment.has(phase.equipmentId)
      );
      phaseIndex = firstMissing >= 0 ? firstMissing : PHASES.length - 1;
    }
    this._loadPhase(phaseIndex);

    this._player.setEquipment(this._equipment.getAll());
    if (saved.player) {
      this._player.loadFromData(saved.player);
    }

    if (this._isInvalidPosition(this._player)) {
      this._player.setPosition(this._map.playerStart.x, this._map.playerStart.y);
    }

    this._syncNpcStates();
    this._menuSelection = 0;
    this._helpOpen = false;

    // Se o save foi feito imediatamente após o último EPI, retoma direto no
    // certificado em vez de deixar a jornada sem a recompensa final.
    if (this._equipment.isComplete()) {
      this._state.setState(STATE.CERTIFICATE);
      this._certificate.start();
      this._showIntro = false;
      this._sound.playVictory();
      return;
    }

    this._state.setState(STATE.EXPLORE);
    this._showIntro = false;
    this._showToast('Progresso carregado. Continue sua jornada!', 2.5);
    this._sound.playStart();
  }

  _isInvalidPosition(player) {
    const tileSize = this._map.tileSize;
    const centerX = player.getCenterX();
    const centerY = player.getCenterY();

    if (
      centerX < 0 || centerX >= this._map.width * tileSize ||
      centerY < 0 || centerY >= this._map.height * tileSize
    ) {
      return true;
    }

    const tileX = Math.floor(centerX / tileSize);
    const tileY = Math.floor(centerY / tileSize);
    const tileIndex = this._map.tiles[tileY * this._map.width + tileX];
    return this._map.collisionTiles.includes(tileIndex);
  }

  _saveProgress() {
    this._save.saveGame(
      this._player,
      this._equipment.toArray(),
      this._completedChallenges,
      this._phaseIndex,
      this._playTime
    );
  }

  update(deltaTime) {
    this._input.update();
    this._updateFrame(deltaTime);
    this._input.endFrame();
  }

  _updateFrame(deltaTime) {
    this._time += deltaTime;
    this._updateToast(deltaTime);

    // Atalhos globais
    if (this._input.isJustPressed('KeyF')) {
      this._toggleFullscreen();
    }

    if (this._input.isJustPressed('KeyV')) {
      const muted = this._sound.toggleMute();
      this._showToast(muted ? 'Som desligado' : 'Som ligado', 1.6);
    }

    if (!this._state.is(STATE.MENU) && !this._pause.isOpen() && !this._helpOpen) {
      this._playTime += deltaTime;
    }

    if (this._helpOpen) {
      if (
        this._input.confirmPressed() ||
        this._input.isJustPressed('Escape') ||
        this._input.isJustPressed('Start')
      ) {
        this._helpOpen = false;
        this._sound.playSelect();
      }
      return;
    }

    if (this._state.is(STATE.MENU)) {
      this._updateMenu();
      return;
    }

    if (this._state.is(STATE.EXPLORE)) {
      this._updateExplore(deltaTime);
      return;
    }

    if (this._state.is(STATE.DIALOG)) {
      this._updateDialog(deltaTime);
      return;
    }

    if (this._state.is(STATE.CHALLENGE)) {
      this._updateChallenge(deltaTime);
      return;
    }

    if (this._state.is(STATE.CERTIFICATE)) {
      this._updateCertificate(deltaTime);
    }
  }

  _updateMenu() {
    if (this._input.isJustPressed('ArrowUp') || this._input.isJustPressed('KeyW')) {
      this._menuSelection = (this._menuSelection + 2) % 3;
      this._sound.playSelect();
    }

    if (this._input.isJustPressed('ArrowDown') || this._input.isJustPressed('KeyS')) {
      this._menuSelection = (this._menuSelection + 1) % 3;
      this._sound.playSelect();
    }

    if (this._input.confirmPressed()) {
      if (this._menuSelection === 0) {
        this._startNewGame();
      } else if (this._menuSelection === 1) {
        if (this._save.hasSave()) {
          this._loadGame();
        } else {
          this._sound.playWrong();
          this._showToast('Nenhum progresso salvo. Comece um novo jogo.', 2.2);
        }
      } else {
        this._helpOpen = true;
        this._sound.playSelect();
      }
    }
  }

  _updateExplore(deltaTime) {
    if (this._pause.isOpen()) {
      this._pause.update(deltaTime, this._input);
      const action = this._pause.consumeAction();
      if (action) this._handlePauseAction(action);
      return;
    }

    if (this._manual.isOpen()) {
      this._manual.update(deltaTime, this._input);
      return;
    }

    if (this._inventory.isOpen()) {
      this._inventory.update(deltaTime, this._input, this._inventoryContext());
      if (this._inventory.consumeChanged()) {
        this._saveProgress();
      }
      if (this._inventory.consumeStudyRequest()) {
        this._inventory.close();
        this._manual.open();
      }
      return;
    }

    if (
      this._input.isJustPressed('Start') ||
      this._input.isJustPressed('Escape')
    ) {
      this._pause.open();
      return;
    }

    if (this._input.isJustPressed('KeyI')) {
      if (!this._showIntro) {
        this._inventory.open();
        return;
      }
    }

    if (this._input.isJustPressed('KeyM')) {
      this._manual.open();
      return;
    }

    this._player.update(deltaTime, this._input, this._map);

    // Evita que o jogador atravesse um NPC.
    for (const npc of this._npcs) {
      if (this._player.distanceTo(npc) < 22) {
        Collision.resolveEntityOverlap(this._player, npc);
      }
    }
    Collision.resolveMapCollision(this._player, this._map);
    this._clampLockedExit();

    this._nearbyNpc = this._findNearbyNpc();
    this._nearbyProp = getNearbyInteractiveProp(this._player, this._map.props);
    this._nearDoor = this._isNearExitDoor();

    if (this._showIntro) {
      this._introDialog.update(deltaTime, this._input);
      if (this._introDialog.isFinished()) {
        this._showIntro = false;
      }
      return;
    }

    if (this._phaseSolved && this._playerTouchesExit()) {
      this._advancePhase();
      return;
    }

    const confirm = this._input.confirmPressed();

    if (confirm && this._nearbyNpc) {
      this._startNpcDialog(this._nearbyNpc);
      return;
    }

    if (confirm && this._nearbyProp) {
      this._manual.open();
    }
  }

  _handlePauseAction(action) {
    if (action === 'inventory') {
      this._inventory.open();
      return;
    }

    if (action === 'manual') {
      this._manual.open();
      return;
    }

    if (action === 'help') {
      this._helpOpen = true;
      return;
    }

    if (action === 'menu') {
      this._saveProgress();
      this._pause.close();
      this._helpOpen = false;
      this._menuSelection = this._save.hasSave() ? 1 : 0;
      this._state.setState(STATE.MENU);
    }
  }

  _inventoryContext() {
    return {
      equipment: this._equipment,
      player: this._player,
      stats: {
        playTime: this._playTime,
        phaseIndex: this._phaseIndex,
        phasesCompleted: this._equipment.getCount(),
        totalPhases: PHASES.length,
        equipmentCount: this._equipment.getCount(),
        totalEquipment: this._equipment.getTotal(),
        challengesCompleted: this._completedChallenges.length
      }
    };
  }

  _clampLockedExit() {
    if (this._phaseSolved || !this._map?.exit) return;

    const bounds = this._player.getBounds();
    const exit = this._map.exit;
    const overlapsDoorY = bounds.y + bounds.height > exit.y && bounds.y < exit.y + exit.h;
    if (!overlapsDoorY) return;

    const maxX = exit.x - this._player.width;
    if (this._player.x > maxX) {
      this._player.x = maxX;
    }
  }

  _isNearExitDoor() {
    if (!this._map?.exit) return false;
    const exit = this._map.exit;
    const centerX = this._player.getCenterX();
    const centerY = this._player.getCenterY();
    return centerX > exit.x - 118 && Math.abs(centerY - (exit.y + exit.h / 2)) < 92;
  }

  _playerTouchesExit() {
    if (!this._map?.exit) return false;
    const bounds = this._player.getBounds();
    const exit = this._map.exit;
    const overlapsY = bounds.y + bounds.height > exit.y && bounds.y < exit.y + exit.h;
    return overlapsY && bounds.x + bounds.width >= exit.x + 10;
  }

  _findNearbyNpc() {
    let nearest = null;
    let bestDistance = Infinity;

    for (const npc of this._npcs) {
      if (!npc.canInteract(this._player)) continue;
      const distance = this._player.distanceTo(npc);
      if (distance < bestDistance) {
        nearest = npc;
        bestDistance = distance;
      }
    }

    return nearest;
  }

  _startNpcDialog(npc) {
    const data = getNpc(npc.npcId);
    if (!data) return;

    this._activeNpc = npc;

    const alreadyEquipped = this._equipment.has(data.equipmentId);
    const lines = alreadyEquipped ? data.dialogRepeat : data.dialogIntro;

    this._dialog.startDialog(lines, {
      id: data.id,
      name: data.name,
      role: data.role,
      color: data.color,
      avatar: data.avatar,
      norm: data.norm
    });

    this._state.setState(STATE.DIALOG);
    this._sound.playSelect();
  }

  _updateDialog(deltaTime) {
    this._dialog.update(deltaTime, this._input);

    if (!this._dialog.isFinished()) return;

    const npc = this._activeNpc;
    if (!npc) {
      this._state.setState(STATE.EXPLORE);
      return;
    }

    const data = getNpc(npc.npcId);
    if (!data) {
      this._state.setState(STATE.EXPLORE);
      this._activeNpc = null;
      return;
    }

    if (!this._equipment.has(data.equipmentId)) {
      const challenge = getChallengeByNpc(npc.npcId);
      if (challenge) {
        this._challenge.startChallenge(challenge);
        this._state.setState(STATE.CHALLENGE);
        return;
      }
    }

    this._state.setState(STATE.EXPLORE);
    this._activeNpc = null;
  }

  _updateChallenge(deltaTime) {
    this._challenge.update(deltaTime, this._input);

    if (!this._challenge.isCompleted()) return;

    const equipmentId = this._challenge.getEquipmentId();

    if (equipmentId && !this._equipment.has(equipmentId)) {
      this._equipment.unlock(equipmentId);
      this._player.equip(equipmentId);
      this._player.flashEquipment(equipmentId);

      const challengeId = this._challenge.getChallengeId();
      if (challengeId && !this._completedChallenges.includes(challengeId)) {
        this._completedChallenges.push(challengeId);
      }

      if (this._activeNpc) {
        this._activeNpc.setCompleted(true);
      }

      this._phaseSolved = true;
      this._syncNpcStates();
      this._saveProgress();
      this._sound.playUnlock();

      const item = getEquipment(equipmentId);
      const phase = PHASES[this._phaseIndex];
      this._showToast(
        `EPI conquistado: ${item?.name || equipmentId} • porta ${phase?.norm || ''} liberada`,
        3.5
      );
    }

    this._activeNpc = null;
    this._state.setState(STATE.EXPLORE);
  }

  _advancePhase() {
    if (!this._phaseSolved) return;

    const nextIndex = this._phaseIndex + 1;
    if (nextIndex >= PHASES.length) {
      this._saveProgress();
      this._certificate.start();
      this._state.setState(STATE.CERTIFICATE);
      this._showIntro = false;
      this._sound.playVictory();
      return;
    }

    this._sound.playSelect();
    this._loadPhase(nextIndex);
    this._state.setState(STATE.EXPLORE);
    this._showIntro = false;
    this._saveProgress();

    const phase = PHASES[nextIndex];
    this._showToast(
      `Fase ${nextIndex + 1}/${PHASES.length} • ${phase.norm} — ${phase.name}`,
      3.5
    );
  }

  _updateCertificate(deltaTime) {
    this._certificate.update(deltaTime, this._input);

    if (!this._certificate.isFinished()) return;

    this._save.delete();
    this._resetWorld(false);
    this._menuSelection = 0;
    this._helpOpen = false;
    this._state.setState(STATE.MENU);
    this._sound.playSelect();
  }

  _updateToast(deltaTime) {
    if (this._toastTimer <= 0) return;

    this._toastTimer = Math.max(0, this._toastTimer - deltaTime);
    if (this._toastTimer === 0) {
      this._toast = null;
    }
  }

  _showToast(message, duration = 2.5) {
    this._toast = message;
    this._toastTimer = duration;
  }

  _toggleFullscreen() {
    try {
      const element = document.getElementById('game-container') || document.documentElement;

      if (!document.fullscreenElement) {
        const request = element.requestFullscreen?.();
        if (request && typeof request.catch === 'function') {
          request.catch(() => {});
        }
      } else {
        const exit = document.exitFullscreen?.();
        if (exit && typeof exit.catch === 'function') {
          exit.catch(() => {});
        }
      }
    } catch {
      // Alguns navegadores podem bloquear a tela cheia; o jogo continua normalmente.
    }
  }

  render() {
    if (this._state.is(STATE.MENU)) {
      this._renderMenu();
      if (this._helpOpen) this._renderMenuHelp();
      this._renderToast(420);
      return;
    }

    if (this._state.is(STATE.CHALLENGE)) {
      this._challenge.render(this._renderer);
      return;
    }

    if (this._state.is(STATE.CERTIFICATE)) {
      this._certificate.render(this._renderer, this._equipment);
      return;
    }

    this._renderWorld();
    this._renderer.drawVignette();

    if (this._helpOpen) {
      this._renderMenuHelp();
      return;
    }

    if (this._pause.isOpen()) {
      this._renderHud();
      this._pause.render(this._renderer);
      return;
    }

    if (this._manual.isOpen()) {
      this._manual.render(this._renderer, this._equipment);
      return;
    }

    if (this._inventory.isOpen()) {
      this._inventory.render(this._renderer, this._inventoryContext());
      return;
    }

    this._renderHud();

    if (this._showIntro) {
      this._introDialog.render(this._renderer);
    } else if (this._state.is(STATE.DIALOG)) {
      this._dialog.render(this._renderer);
    }

    this._renderToast(54);
  }

  _renderWorld() {
    this._renderer.context.drawImage(this._backgroundCanvas, 0, 0, 640, 480);
    drawDust(this._renderer, this._time);

    for (const prop of this._map.props) {
      drawProp(this._renderer, prop, this._equipment, {
        nearInteractive: prop === this._nearbyProp
      });
    }

    const room = this._map.roomDefs[0];
    drawPhaseDoor(this._renderer, this._map.exit, {
      solved: this._phaseSolved,
      color: room?.color || COLORS.SAFETY_YELLOW,
      last: this._phaseIndex >= PHASES.length - 1
    });

    // Funcionários, especialista e jogador são ordenados pela profundidade
    // para que ninguém pareça estar flutuando sobre outra pessoa.
    const actors = [
      ...(this._map.workers || []).map((worker) => ({
        y: worker.y,
        draw: () => drawWorker(this._renderer, worker, this._time)
      })),
      ...this._npcs.map((npc) => ({
        y: npc.y,
        draw: () => npc.render(this._renderer, { nearby: npc === this._nearbyNpc })
      })),
      {
        y: this._player.y,
        draw: () => this._player.render(this._renderer)
      }
    ].sort((a, b) => a.y - b.y);

    for (const actor of actors) actor.draw();
  }

  _renderHud() {
    // Barra superior
    this._renderer.drawRect(0, 0, 640, 46, 'rgba(0, 0, 0, 0.64)');
    this._renderer.drawRect(0, 44, 640, 2, COLORS.SAFETY_ORANGE);

    this._renderer.drawText('PROTEÇÃO', 16, 6, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      shadow: false
    });
    this._renderer.drawText(
      `${this._equipment.getCount()}/${this._equipment.getTotal()}`,
      16,
      17,
      {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.LARGE,
        shadow: true
      }
    );
    this._renderer.drawProgressBar(
      72,
      25,
      110,
      8,
      this._equipment.getProgress(),
      COLORS.SAFETY_GREEN
    );

    const room = getRoomAt(
      this._map,
      this._player.getCenterX(),
      this._player.getCenterY()
    );
    const roomName = room ? room.name : 'Corredor principal';
    const roomNorm = room?.norm || 'CIRCULAÇÃO';
    const phaseLabel = `${roomNorm} · FASE ${this._phaseIndex + 1}/${PHASES.length}`;

    this._renderer.drawText(roomName, 320, 6, {
      color: COLORS.UI_TEXT,
      font: FONTS.SMALL,
      align: 'center',
      shadow: true
    });
    this._renderer.drawText(phaseLabel, 320, 22, {
      color: room?.color || COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    this._renderer.drawText('M NORMAS  •  I INV  •  START MENU', 624, 6, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'right',
      shadow: false
    });
    this._renderer.drawText(
      `V SOM ${this._sound.isMuted() ? 'OFF' : 'ON'}`,
      624,
      20,
      {
        color: this._sound.isMuted() ? COLORS.UI_DANGER : COLORS.SAFETY_GREEN,
        font: FONTS.TINY,
        align: 'right',
        shadow: false
      }
    );
    this._renderer.drawText('WASD/Setas  •  A/ESPAÇO', 624, 34, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'right',
      shadow: false
    });

    // Durante diálogos e introdução, a barra inferior fica oculta para dar
    // lugar à caixa de fala.
    if (this._state.is(STATE.DIALOG) || this._showIntro) return;

    // Barra inferior de EPIs
    this._renderer.drawRect(0, 432, 640, 48, 'rgba(0, 0, 0, 0.72)');
    this._renderer.drawRect(0, 432, 640, 2, COLORS.SAFETY_ORANGE);

    this._renderer.drawText('EPIs', 16, 440, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      shadow: false
    });
    this._renderer.drawText(
      `${this._equipment.getCount()}/${this._equipment.getTotal()}`,
      16,
      452,
      {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.PRIMARY,
        shadow: true
      }
    );

    this._equipment.renderBar(this._renderer, 72, 442, {
      slotSize: 24,
      gap: 4
    });

    const nextItem = this._equipment.getMissing()[0];
    if (this._equipment.isComplete()) {
      this._renderer.drawText('JORNADA COMPLETA!', 624, 446, {
        color: COLORS.SAFETY_GREEN,
        font: FONTS.SMALL,
        align: 'right',
        glow: true
      });
    } else {
      this._renderer.drawText(
        nextItem ? `PRÓXIMO: ${nextItem.name}` : 'Converse com os especialistas',
        624,
        446,
        {
          color: COLORS.SAFETY_YELLOW,
          font: FONTS.TINY,
          align: 'right',
          shadow: false
        }
      );
    }

    if (!this._showIntro && this._state.is(STATE.EXPLORE)) {
      if (this._nearbyNpc) {
        const npcDataInfo = getNpc(this._nearbyNpc.npcId);
        const already = npcDataInfo && this._equipment.has(npcDataInfo.equipmentId);
        const text = already
          ? `A / ESPAÇO  Conversar com ${this._nearbyNpc.name}`
          : `A / ESPAÇO  Desafio ${npcDataInfo?.norm || ''} com ${this._nearbyNpc.name}`;

        this._renderPrompt(text);
      } else if (this._nearbyProp) {
        this._renderPrompt('A / ESPAÇO  Abrir Mural de Normas');
      } else if (this._nearDoor) {
        this._renderPrompt(
          this._phaseSolved
            ? `PORTA LIBERADA  →  ${this._phaseIndex >= PHASES.length - 1 ? 'CERTIFICADO' : 'PRÓXIMA NR'}`
            : 'PORTA BLOQUEADA  —  CONCLUA O DESAFIO'
        );
      }
    }
  }

  _renderPrompt(text) {
    this._renderer.drawRect(140, 394, 360, 28, 'rgba(0, 0, 0, 0.84)');
    this._renderer.drawRect(140, 394, 360, 2, COLORS.SAFETY_YELLOW);
    this._renderer.drawRect(140, 420, 360, 1, 'rgba(255, 193, 7, 0.35)');
    this._renderer.drawText(text, 320, 402, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.TINY,
      align: 'center',
      shadow: true
    });
  }

  _renderToast(y = 54) {
    if (!this._toast || this._toastTimer <= 0) return;

    const alpha = Math.min(1, this._toastTimer * 3);
    const width = Math.min(540, Math.max(220, this._toast.length * 7 + 28));
    const x = (640 - width) / 2;

    this._renderer.drawRect(x, y, width, 26, `rgba(0, 0, 0, ${0.82 * alpha})`);
    this._renderer.drawRect(x, y, width, 2, `rgba(255, 193, 7, ${alpha})`);
    this._renderer.drawText(this._toast, 320, y + 8, {
      color: `rgba(255, 255, 255, ${alpha})`,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
  }

  _renderMenu() {
    const renderer = this._renderer;
    renderer.clear(COLORS.JAMSOFT_BLACK);

    const ctx = renderer.context;
    const gradient = ctx.createLinearGradient(0, 0, 0, 480);
    gradient.addColorStop(0, '#181818');
    gradient.addColorStop(0.55, '#0c0c0c');
    gradient.addColorStop(1, '#050505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 480);

    // Grade sutil de fundo
    for (let x = 0; x < 640; x += 32) {
      renderer.drawRect(x, 0, 1, 480, 'rgba(255, 255, 255, 0.018)');
    }
    for (let y = 0; y < 480; y += 32) {
      renderer.drawRect(0, y, 640, 1, 'rgba(255, 255, 255, 0.018)');
    }

    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);

    renderer.drawGlow(320, 66, 220, COLORS.JAMSOFT_RED, 0.12);

    renderer.drawText('JAMSOFT TECNOLOGIA', 320, 16, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawText('SEGURANÇA EM JOGO', 320, 34, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.MENU_TITLE,
      align: 'center',
      glow: true
    });

    renderer.drawText('A Jornada da Proteção', 320, 88, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.DIALOG,
      align: 'center',
      shadow: true
    });

    renderer.drawText('Feira de Segurança do Trabalho • Itabaiana/SE', 320, 110, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    // Faixa de ícones de EPI
    equipmentList.forEach((item, index) => {
      const x = 160 + index * 32;
      renderer.drawRect(x, 132, 26, 26, '#0b0b0b');
      renderer.drawRect(x, 132, 26, 2, item.color);
      renderer.drawRect(x, 156, 26, 2, item.color);
      drawIcon(renderer, item.id, x + 1, 133, 24);
    });

    renderer.drawText('10 ITENS DE PROTEÇÃO', 320, 164, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    renderer.drawRect(160, 178, 320, 1, 'rgba(255, 255, 255, 0.14)');

    const options = [
      { label: 'NOVO JOGO', icon: 'play', enabled: true },
      { label: 'CONTINUAR', icon: 'save', enabled: this._save.hasSave() },
      { label: 'COMO JOGAR', icon: 'book', enabled: true }
    ];

    const optionX = 150;
    const optionW = 310;
    const optionH = 40;

    options.forEach((option, index) => {
      const y = 196 + index * 50;
      const selected = this._menuSelection === index;

      renderer.drawRect(optionX + 3, y + 3, optionW, optionH, 'rgba(0, 0, 0, 0.42)');
      renderer.drawRect(optionX, y, optionW, optionH, selected ? COLORS.JAMSOFT_WHITE : '#3a3a3a');
      renderer.drawRect(optionX + 2, y + 2, optionW - 4, optionH - 4, selected ? '#2a070a' : '#111111');
      renderer.drawRect(optionX, y, 4, optionH, selected ? COLORS.JAMSOFT_RED : '#2d2d2d');

      if (selected) {
        const pulse = 0.5 + 0.5 * Math.sin(this._time * 5);
        renderer.drawRect(optionX, y, optionW, 2, `rgba(255, 59, 74, ${0.45 + pulse * 0.45})`);
        renderer.drawRect(optionX - 6, y + 10, 3, optionH - 20, COLORS.JAMSOFT_RED_LIGHT);
      }

      if (option.icon === 'play') {
        renderer.drawRect(optionX + 20, y + 12, 4, 16, COLORS.JAMSOFT_RED);
        renderer.drawRect(optionX + 24, y + 14, 3, 12, COLORS.JAMSOFT_RED_LIGHT);
        renderer.drawRect(optionX + 27, y + 16, 3, 8, COLORS.JAMSOFT_WHITE);
      } else if (option.icon === 'save') {
        renderer.drawRect(optionX + 18, y + 12, 16, 16, option.enabled ? COLORS.JAMSOFT_WHITE : '#4a4a4a');
        renderer.drawRect(optionX + 22, y + 12, 8, 7, '#1a1a1a');
        renderer.drawRect(optionX + 21, y + 21, 10, 5, COLORS.JAMSOFT_RED);
        renderer.drawRect(optionX + 24, y + 23, 4, 2, '#1a1a1a');
      } else {
        renderer.drawRect(optionX + 18, y + 12, 16, 16, COLORS.JAMSOFT_RED);
        renderer.drawRect(optionX + 21, y + 14, 10, 12, COLORS.JAMSOFT_WHITE);
        renderer.drawRect(optionX + 25, y + 12, 2, 16, COLORS.JAMSOFT_RED);
      }

      renderer.drawText(option.label, optionX + 46, y + 11, {
        color: option.enabled
          ? COLORS.JAMSOFT_WHITE
          : COLORS.JAMSOFT_SMOKE,
        font: FONTS.PRIMARY,
        shadow: true
      });

      if (index === 1) {
        renderer.drawRect(
          optionX + optionW - 22,
          y + 17,
          6,
          6,
          option.enabled ? COLORS.SAFETY_GREEN : '#4a4a4a'
        );
        if (!option.enabled) {
          renderer.drawText('sem save', optionX + optionW - 32, y + 27, {
            color: COLORS.JAMSOFT_SMOKE,
            font: FONTS.TINY,
            align: 'right',
            shadow: false
          });
        }
      }
    });

    // Painel do guardião no canto direito
    renderer.drawPanel(496, 186, 120, 156, {
      bg: '#101010',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });
    renderer.drawGlow(556, 224, 46, COLORS.JAMSOFT_RED, 0.14);
    this._drawMenuGuardian(renderer);
    renderer.drawText('GUARDIÃO', 556, 260, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.SMALL,
      align: 'center',
      glow: true
    });
    renderer.drawText('DA SEGURANÇA', 556, 273, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
    renderer.drawText('10 EPIs', 556, 298, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
    renderer.drawText('JAMSOFT', 556, 314, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    const blink = Math.sin(this._time * 4) > -0.2;
    if (blink) {
      renderer.drawText('A / ESPAÇO / ENTER para selecionar', 320, 360, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.SMALL,
        align: 'center',
        glow: true
      });
    }

    renderer.drawText('WASD / setas / analógico / D-pad para navegar', 320, 380, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    renderer.drawRect(160, 398, 320, 1, 'rgba(255, 255, 255, 0.12)');

    renderer.drawText(
      'Conteúdo educativo • Consulte as NRs oficiais e o SESMT.',
      320,
      408,
      {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        align: 'center',
        shadow: false
      }
    );

    renderer.drawText('JAMSOFT TECNOLOGIA • Feira de Segurança do Trabalho', 320, 452, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
  }

  _drawMenuGuardian(renderer) {
    const ctx = renderer.context;
    const fakePlayer = { x: 0, y: 0, width: 24, height: 24 };
    const allEquipment = new Set(equipmentList.map((item) => item.id));

    ctx.save();
    ctx.translate(532, 202);
    ctx.scale(2.25, 2.25);

    drawPlayerSprite(renderer, 0, 0, {
      direction: 'down',
      time: this._time
    });
    drawOverlay(renderer, fakePlayer, allEquipment, 0, 0);

    ctx.restore();

    // Brilho de equipamento completo.
    const pulse = 0.5 + 0.5 * Math.sin(this._time * 2.6);
    renderer.drawRect(502, 251, 108, 2, `rgba(255, 59, 74, ${0.20 + pulse * 0.18})`);
  }

  _renderMenuHelp() {
    const renderer = this._renderer;

    renderer.drawRect(0, 0, 640, 480, 'rgba(5, 5, 5, 0.96)');
    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);

    renderer.drawPanel(40, 20, 560, 440, {
      bg: '#0b0b0b',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });

    renderer.drawText('COMO JOGAR', 56, 36, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.DISPLAY,
      glow: true
    });

    renderer.drawText('Sua missão em 6 passos', 56, 70, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      shadow: false
    });

    let y = 92;
    dialogs.helpSteps.forEach((step, index) => {
      const lines = wrapText(step, 72);
      renderer.drawText(`${index + 1}.`, 56, y, {
        color: COLORS.JAMSOFT_RED_LIGHT,
        font: FONTS.SMALL,
        shadow: false
      });
      lines.forEach((line, lineIndex) => {
        renderer.drawText(line, 76, y + lineIndex * 14, {
          color: COLORS.JAMSOFT_WHITE,
          font: FONTS.TINY,
          shadow: true
        });
      });
      y += Math.max(17, lines.length * 14 + 5);
    });

    renderer.drawRect(56, y + 4, 528, 1, '#3a3a3a');
    y += 16;

    renderer.drawText('CONTROLES', 56, y, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.TINY,
      shadow: false
    });

    y += 18;
    dialogs.helpControls.forEach((control, index) => {
      const col = index < 4 ? 0 : 1;
      const row = index < 4 ? index : index - 4;
      renderer.drawText(control, 56 + col * 270, y + row * 17, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        shadow: false
      });
    });

    y += 76;

    renderer.drawPanel(56, y, 528, 58, {
      bg: 'rgba(42, 7, 10, 0.92)',
      border: COLORS.JAMSOFT_RED_DARK
    });
    renderer.drawText('DICA', 70, y + 10, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.TINY,
      shadow: false
    });
    const tipLines = wrapText(
      'Converse com todos os especialistas. O HUD mostra os EPIs conquistados e cada acerto equipa um novo item no sprite.',
      76
    ).slice(0, 2);
    tipLines.forEach((line, index) => {
      renderer.drawText(line, 70, y + 26 + index * 14, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.TINY,
        shadow: true
      });
    });

    renderer.drawText(dialogs.helpGamepad, 320, 388, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    renderer.drawText(dialogs.helpFooter, 320, 404, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    const blink = Math.sin(this._time * 5) > -0.2;
    if (blink) {
      renderer.drawText('A/ESPAÇO  •  B/ESC/START', 320, 432, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.PRIMARY,
        align: 'center',
        glow: true
      });
    }
  }
}
