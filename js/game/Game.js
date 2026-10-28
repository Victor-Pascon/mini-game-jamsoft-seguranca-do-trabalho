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
import { Certificate } from './Certificate.js';
import { drawProp, drawRoomLabels, getNearbyInteractiveProp } from './Props.js';
import { drawIcon, drawOverlay } from './EquipmentRenderer.js';

import { safetyMap, getRoomAt } from '../data/maps.js';
import { npcs as npcData, getNpc } from '../data/npcs.js';
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
    this._map = safetyMap;

    this._manual = new NormManual(this._sound);
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

    this._showIntro = false;
    this._menuSelection = 0;
    this._menuHelp = false;
    this._toast = null;
    this._toastTimer = 0;

    this._time = 0;
    this._lastTime = 0;
    this._running = false;
    this._rafId = null;

    this._resetWorld(false);
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
    this._player = new Player({
      x: this._map.playerStart.x,
      y: this._map.playerStart.y
    });
    this._npcs = npcData.map((data) => new NPC(data));
    this._equipment = new EquipmentSystem();
    this._completedChallenges = [];
    this._dialog = new Dialog();
    this._challenge = new Challenge(this._sound);
    this._introDialog = new Dialog();
    this._certificate = new Certificate();
    this._manual = new NormManual(this._sound);

    this._activeNpc = null;
    this._nearbyNpc = null;
    this._nearbyProp = null;
    this._showIntro = showIntro;
    this._toast = null;
    this._toastTimer = 0;

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
    this._menuHelp = false;
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

    this._player.setEquipment(this._equipment.getAll());
    if (saved.player) {
      this._player.loadFromData(saved.player);
    }

    if (this._isInvalidPosition(this._player)) {
      this._player.setPosition(this._map.playerStart.x, this._map.playerStart.y);
    }

    this._syncNpcStates();
    this._menuSelection = 0;
    this._menuHelp = false;

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
      this._completedChallenges
    );
  }

  update(deltaTime) {
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
    if (this._menuHelp) {
      if (this._input.confirmPressed() || this._input.isJustPressed('Escape')) {
        this._menuHelp = false;
        this._sound.playSelect();
      }
      return;
    }

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
        this._menuHelp = true;
        this._sound.playSelect();
      }
    }
  }

  _updateExplore(deltaTime) {
    if (this._manual.isOpen()) {
      this._manual.update(deltaTime, this._input);
      return;
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

    this._nearbyNpc = this._findNearbyNpc();
    this._nearbyProp = getNearbyInteractiveProp(this._player, this._map.props);

    if (this._showIntro) {
      this._introDialog.update(deltaTime, this._input);
      if (this._introDialog.isFinished()) {
        this._showIntro = false;
      }
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
      name: data.name,
      role: data.role,
      color: data.color,
      avatar: data.avatar
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

      this._syncNpcStates();
      this._saveProgress();
      this._sound.playUnlock();

      const item = getEquipment(equipmentId);
      this._showToast(`EPI conquistado: ${item?.name || equipmentId}`, 3);
    }

    this._activeNpc = null;

    if (this._equipment.isComplete()) {
      this._certificate.start();
      this._state.setState(STATE.CERTIFICATE);
      this._sound.playVictory();
    } else {
      this._state.setState(STATE.EXPLORE);
    }
  }

  _updateCertificate(deltaTime) {
    this._certificate.update(deltaTime, this._input);

    if (!this._certificate.isFinished()) return;

    this._save.delete();
    this._resetWorld(false);
    this._menuSelection = 0;
    this._menuHelp = false;
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
      if (this._menuHelp) this._renderMenuHelp();
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

    if (this._manual.isOpen()) {
      this._renderer.drawScanlines();
      this._renderer.drawVignette();
      this._manual.render(this._renderer, this._equipment);
      return;
    }

    this._renderHud();
    this._renderer.drawScanlines();
    this._renderer.drawVignette();

    if (this._showIntro) {
      this._introDialog.render(this._renderer);
    } else if (this._state.is(STATE.DIALOG)) {
      this._dialog.render(this._renderer);
    }

    this._renderToast(54);
  }

  _renderWorld() {
    this._renderer.drawMap(this._map, this._map.tileSize);
    drawRoomLabels(this._renderer, this._map);

    for (const prop of this._map.props) {
      drawProp(this._renderer, prop, this._equipment, {
        nearInteractive: prop === this._nearbyProp
      });
    }

    for (const npc of this._npcs) {
      npc.render(this._renderer);
    }

    this._player.render(this._renderer);
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

    this._renderer.drawText(roomName, 320, 6, {
      color: COLORS.UI_TEXT,
      font: FONTS.SMALL,
      align: 'center',
      shadow: true
    });
    this._renderer.drawText(roomNorm, 320, 22, {
      color: room?.color || COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    this._renderer.drawText('M NORMAS  •  F TELA', 624, 6, {
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
    this._renderer.drawText('WASD/Setas  •  ESPAÇO', 624, 34, {
      color: COLORS.UI_TEXT_DIM,
      font: '8px "Courier New", monospace',
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
          font: '8px "Courier New", monospace',
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
          ? `ESPAÇO  Conversar com ${this._nearbyNpc.name}`
          : `ESPAÇO  Desafio ${npcDataInfo?.norm || ''} com ${this._nearbyNpc.name}`;

        this._renderPrompt(text);
      } else if (this._nearbyProp) {
        this._renderPrompt('ESPAÇO  Abrir Mural de Normas');
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
    renderer.clear('#050a10');

    const ctx = renderer.context;
    const gradient = ctx.createLinearGradient(0, 0, 0, 480);
    gradient.addColorStop(0, '#0b1a2b');
    gradient.addColorStop(0.55, '#081018');
    gradient.addColorStop(1, '#050a10');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 480);

    // Grade sutil de fundo
    for (let x = 0; x < 640; x += 32) {
      renderer.drawRect(x, 0, 1, 480, 'rgba(255, 255, 255, 0.022)');
    }
    for (let y = 0; y < 480; y += 32) {
      renderer.drawRect(0, y, 640, 1, 'rgba(255, 255, 255, 0.022)');
    }

    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);

    renderer.drawGlow(320, 66, 210, '#ffc107', 0.06);

    renderer.drawText('JAMSOFT TECNOLOGIA', 320, 16, {
      color: COLORS.SAFETY_BLUE,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawText('SEGURANÇA EM JOGO', 320, 36, {
      color: COLORS.SAFETY_YELLOW,
      font: '40px "Courier New", monospace',
      align: 'center',
      glow: true
    });

    renderer.drawText('A Jornada da Proteção', 320, 86, {
      color: COLORS.UI_TEXT,
      font: FONTS.DIALOG,
      align: 'center',
      shadow: true
    });

    renderer.drawText('Feira de Segurança do Trabalho • Itabaiana/SE', 320, 108, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    // Faixa de ícones de EPI
    equipmentList.forEach((item, index) => {
      const x = 160 + index * 32;
      renderer.drawRect(x, 132, 26, 26, '#0b121b');
      renderer.drawRect(x, 132, 26, 2, item.color);
      renderer.drawRect(x, 156, 26, 2, item.color);
      drawIcon(renderer, item.id, x + 1, 133, 24);
    });

    renderer.drawText('10 ITENS DE PROTEÇÃO', 320, 164, {
      color: COLORS.UI_TEXT_DIM,
      font: '7px "Courier New", monospace',
      align: 'center',
      shadow: false
    });

    renderer.drawRect(160, 178, 320, 1, 'rgba(255, 255, 255, 0.12)');

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
      renderer.drawRect(optionX, y, optionW, optionH, selected ? COLORS.SAFETY_YELLOW : '#2f3b4a');
      renderer.drawRect(optionX + 2, y + 2, optionW - 4, optionH - 4, selected ? '#2a1400' : '#0d1622');
      renderer.drawRect(optionX, y, 4, optionH, selected ? COLORS.SAFETY_ORANGE : '#1b2a3a');

      if (selected) {
        const pulse = 0.5 + 0.5 * Math.sin(this._time * 5);
        renderer.drawRect(optionX, y, optionW, 2, `rgba(255, 215, 0, ${0.5 + pulse * 0.4})`);
        renderer.drawRect(optionX - 6, y + 10, 3, optionH - 20, COLORS.SAFETY_YELLOW);
      }

      if (option.icon === 'play') {
        renderer.drawRect(optionX + 20, y + 12, 4, 16, COLORS.SAFETY_GREEN);
        renderer.drawRect(optionX + 24, y + 14, 3, 12, COLORS.SAFETY_GREEN);
        renderer.drawRect(optionX + 27, y + 16, 3, 8, COLORS.SAFETY_GREEN);
      } else if (option.icon === 'save') {
        renderer.drawRect(optionX + 18, y + 12, 16, 16, option.enabled ? COLORS.SAFETY_YELLOW : '#4a4a4a');
        renderer.drawRect(optionX + 22, y + 12, 8, 7, '#263238');
        renderer.drawRect(optionX + 21, y + 21, 10, 5, '#ffffff');
        renderer.drawRect(optionX + 24, y + 23, 4, 2, '#263238');
      } else {
        renderer.drawRect(optionX + 18, y + 12, 16, 16, COLORS.SAFETY_BLUE);
        renderer.drawRect(optionX + 21, y + 14, 10, 12, '#ffffff');
        renderer.drawRect(optionX + 25, y + 12, 2, 16, COLORS.SAFETY_BLUE);
      }

      renderer.drawText(option.label, optionX + 46, y + 11, {
        color: option.enabled
          ? (selected ? COLORS.SAFETY_YELLOW : COLORS.UI_TEXT)
          : COLORS.UI_TEXT_DIM,
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
            color: COLORS.UI_TEXT_DIM,
            font: '7px "Courier New", monospace',
            align: 'right',
            shadow: false
          });
        }
      }
    });

    // Painel do guardião no canto direito
    renderer.drawPanel(496, 186, 120, 156, {
      bg: '#0d1622',
      border: COLORS.SAFETY_YELLOW_DARK
    });
    renderer.drawGlow(556, 224, 46, '#ffc107', 0.10);
    this._drawMenuGuardian(renderer);
    renderer.drawText('GUARDIÃO', 556, 260, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.SMALL,
      align: 'center',
      glow: true
    });
    renderer.drawText('DA SEGURANÇA', 556, 273, {
      color: COLORS.UI_TEXT_DIM,
      font: '7px "Courier New", monospace',
      align: 'center',
      shadow: false
    });
    renderer.drawText('10 EPIs', 556, 298, {
      color: COLORS.SAFETY_GREEN,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
    renderer.drawText('JAMSOFT', 556, 314, {
      color: COLORS.UI_TEXT_DIM,
      font: '7px "Courier New", monospace',
      align: 'center',
      shadow: false
    });

    const blink = Math.sin(this._time * 4) > -0.2;
    if (blink) {
      renderer.drawText('ESPAÇO / ENTER para selecionar', 320, 360, {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.SMALL,
        align: 'center',
        glow: true
      });
    }

    renderer.drawText('WASD / setas para navegar', 320, 380, {
      color: COLORS.UI_TEXT_DIM,
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
        color: COLORS.UI_TEXT_DIM,
        font: '9px "Courier New", monospace',
        align: 'center',
        shadow: false
      }
    );

    renderer.drawText('JAMSOFT TECNOLOGIA • Feira de Segurança do Trabalho', 320, 452, {
      color: COLORS.UI_TEXT_DIM,
      font: '8px "Courier New", monospace',
      align: 'center',
      shadow: false
    });
  }

  _drawMenuGuardian(renderer) {
    const ctx = renderer.context;
    const fakePlayer = { x: 0, y: 0, width: 24, height: 24 };
    const allEquipment = new Set(equipmentList.map((item) => item.id));

    ctx.save();
    ctx.translate(532, 198);
    ctx.scale(2, 2);

    // Base do sprite (mesmo estilo do Player)
    renderer.drawRect(4, 22, 16, 4, 'rgba(0, 0, 0, 0.35)');
    renderer.drawRect(4, 2, 16, 10, COLORS.SNES_YELLOW, {
      border: true,
      borderColor: '#f9a825'
    });
    renderer.drawRect(6, 4, 12, 3, '#ffe082');
    renderer.drawRect(7, 6, 4, 4, '#ffffff');
    renderer.drawRect(13, 6, 4, 4, '#ffffff');
    renderer.drawRect(9, 7, 2, 2, '#111111');
    renderer.drawRect(15, 7, 2, 2, '#111111');
    renderer.drawRect(2, 12, 20, 10, COLORS.SNES_YELLOW, {
      border: true,
      borderColor: '#f9a825'
    });
    renderer.drawRect(6, 14, 12, 2, '#f9a825');
    renderer.drawRect(4, 20, 6, 4, '#f9a825');
    renderer.drawRect(14, 20, 6, 4, '#f9a825');

    drawOverlay(renderer, fakePlayer, allEquipment, 0, 0);

    ctx.restore();
  }

  _renderMenuHelp() {
    const renderer = this._renderer;

    renderer.drawRect(0, 0, 640, 480, 'rgba(4, 8, 14, 0.94)');
    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);

    renderer.drawPanel(40, 20, 560, 440, {
      bg: '#0d1622',
      border: COLORS.SAFETY_ORANGE
    });

    renderer.drawText('COMO JOGAR', 56, 36, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.TITLE,
      glow: true
    });

    renderer.drawText('Sua missão em 6 passos', 56, 70, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      shadow: false
    });

    let y = 92;
    dialogs.helpSteps.forEach((step, index) => {
      const lines = wrapText(step, 72);
      renderer.drawText(`${index + 1}.`, 56, y, {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.SMALL,
        shadow: false
      });
      lines.forEach((line, lineIndex) => {
        renderer.drawText(line, 76, y + lineIndex * 14, {
          color: COLORS.UI_TEXT,
          font: '10px "Courier New", monospace',
          shadow: true
        });
      });
      y += Math.max(17, lines.length * 14 + 5);
    });

    renderer.drawRect(56, y + 4, 528, 1, '#2f3b4a');
    y += 16;

    renderer.drawText('CONTROLES', 56, y, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.TINY,
      shadow: false
    });

    y += 18;
    dialogs.helpControls.forEach((control, index) => {
      const col = index < 4 ? 0 : 1;
      const row = index < 4 ? index : index - 4;
      renderer.drawText(control, 56 + col * 270, y + row * 17, {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        shadow: false
      });
    });

    y += 76;

    renderer.drawPanel(56, y, 528, 58, {
      bg: 'rgba(26, 20, 8, 0.92)',
      border: COLORS.SAFETY_YELLOW_DARK
    });
    renderer.drawText('DICA', 70, y + 10, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.TINY,
      shadow: false
    });
    const tipLines = wrapText(
      'Converse com todos os especialistas. O HUD mostra os EPIs conquistados e cada acerto equipa um novo item no sprite.',
      76
    ).slice(0, 2);
    tipLines.forEach((line, index) => {
      renderer.drawText(line, 70, y + 26 + index * 14, {
        color: COLORS.UI_TEXT,
        font: '10px "Courier New", monospace',
        shadow: true
      });
    });

    renderer.drawText(dialogs.helpFooter, 320, 404, {
      color: COLORS.UI_TEXT_DIM,
      font: '9px "Courier New", monospace',
      align: 'center',
      shadow: false
    });

    const blink = Math.sin(this._time * 5) > -0.2;
    if (blink) {
      renderer.drawText('ESPAÇO ou ESC para voltar', 320, 432, {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.PRIMARY,
        align: 'center',
        glow: true
      });
    }
  }
}
