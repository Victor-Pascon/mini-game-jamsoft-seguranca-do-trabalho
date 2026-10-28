import { COLORS, FONTS } from '../design-tokens/snes-theme.js';
import { wrapText } from '../engine/TextUtils.js';
import { equipmentList } from '../data/equipment.js';
import {
  decorativeItems,
  isDecorationUnlocked
} from '../data/decorations.js';
import { drawIconSlot, drawOverlay } from './EquipmentRenderer.js';
import { drawPlayerSprite, drawPlayerDecoration } from './CharacterRenderer.js';

function formatPlayTime(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Inventário de exploração (tecla I).
 * Reúne tempo de jogo, progresso, EPIs, itens decorativos e acesso ao manual.
 */
export class Inventory {
  constructor(sound = null) {
    this._sound = sound;
    this._open = false;
    this._selected = 0;
    this._time = 0;
    this._message = '';
    this._studyRequested = false;
    this._changed = false;
  }

  open() {
    this._open = true;
    this._selected = 0;
    this._time = 0;
    this._message = '';
    this._studyRequested = false;
    this._changed = false;
    this._sound?.playManual();
  }

  close() {
    this._open = false;
    this._message = '';
  }

  isOpen() {
    return this._open;
  }

  consumeStudyRequest() {
    const requested = this._studyRequested;
    this._studyRequested = false;
    return requested;
  }

  consumeChanged() {
    const changed = this._changed;
    this._changed = false;
    return changed;
  }

  getSelectedDecoration() {
    return decorativeItems[this._selected]?.id || null;
  }

  _moveSelection(direction, context) {
    const total = decorativeItems.length + 1;
    this._selected = (this._selected + direction + total) % total;
    this._message = '';
    this._sound?.playSelect();
  }

  update(deltaTime, input, context = {}) {
    if (!this._open) return;

    this._time += deltaTime;
    const equipment = context.equipment || null;
    const player = context.player || null;

    if (input.isJustPressed('KeyI') || input.isJustPressed('Escape') || input.isJustPressed('Backspace')) {
      this.close();
      return;
    }

    if (input.isJustPressed('KeyM')) {
      this._studyRequested = true;
      return;
    }

    if (input.isJustPressed('ArrowUp') || input.isJustPressed('KeyW')) {
      this._moveSelection(-1, context);
      return;
    }

    if (input.isJustPressed('ArrowDown') || input.isJustPressed('KeyS')) {
      this._moveSelection(1, context);
      return;
    }

    if (!input.confirmPressed()) return;

    // A última entrada da lista é o atalho para o material de estudo.
    if (this._selected >= decorativeItems.length) {
      this._studyRequested = true;
      return;
    }

    const item = decorativeItems[this._selected];
    const unlocked = isDecorationUnlocked(item, equipment);

    if (!unlocked) {
      const target = item.unlockEquipment
        ? equipmentList.find((equipmentItem) => equipmentItem.id === item.unlockEquipment)?.name
        : null;
      this._message = target
        ? `Conquiste ${target} para liberar este item.`
        : `Conclua ${item.unlockCount} fases para liberar este item.`;
      this._sound?.playWrong();
      return;
    }

    if (player?.decoration === item.id) {
      player.setDecoration(null);
      this._message = `${item.name} removido do personagem.`;
    } else {
      player?.setDecoration(item.id);
      this._message = `${item.name} equipado no personagem.`;
    }

    this._changed = true;
    this._sound?.playSelect();
  }

  render(renderer, context = {}) {
    if (!this._open) return;

    const equipment = context.equipment || null;
    const player = context.player || null;
    const stats = context.stats || {};

    renderer.drawRect(0, 0, 640, 480, 'rgba(5, 5, 5, 0.96)');

    // Grade discreta para dar profundidade sem atrapalhar a leitura.
    for (let x = 0; x < 640; x += 32) {
      renderer.drawRect(x, 0, 1, 480, 'rgba(255, 255, 255, 0.025)');
    }
    for (let y = 0; y < 480; y += 32) {
      renderer.drawRect(0, y, 640, 1, 'rgba(255, 255, 255, 0.025)');
    }

    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);

    renderer.drawText('INVENTÁRIO', 24, 14, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.DISPLAY,
      shadow: false
    });
    renderer.drawText('JAMSOFT • JORNADA DA PROTEÇÃO', 26, 48, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.TINY,
      shadow: false
    });
    renderer.drawText('I / Y FECHAR', 616, 22, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'right',
      shadow: false
    });

    this._renderStats(renderer, stats);
    this._renderEquipment(renderer, equipment);
    this._renderDecorations(renderer, equipment, player);
    this._renderStudy(renderer);

    renderer.drawText(
      '↑↓ escolher  •  A / ENTER equipar/remover ou abrir  •  B / ESC fechar',
      320,
      448,
      {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        align: 'center',
        shadow: false
      }
    );
  }

  _renderStats(renderer, stats) {
    const cards = [
      { label: 'TEMPO JOGADO', value: formatPlayTime(stats.playTime) },
      { label: 'FASE ATUAL', value: `${(stats.phaseIndex || 0) + 1}/${stats.totalPhases || 10}` },
      { label: 'FASES CONCLUÍDAS', value: `${stats.phasesCompleted || 0}/${stats.totalPhases || 10}` },
      { label: 'ITENS DE PROTEÇÃO', value: `${stats.equipmentCount || 0}/${stats.totalEquipment || 10}` }
    ];

    cards.forEach((card, index) => {
      const x = 24 + index * 148;
      const y = 66;
      const width = 140;
      const height = 54;

      renderer.drawRect(x + 2, y + 2, width, height, 'rgba(0, 0, 0, 0.5)');
      renderer.drawRect(x, y, width, height, COLORS.JAMSOFT_RED_DARK);
      renderer.drawRect(x + 2, y + 2, width - 4, height - 4, '#101010');
      renderer.drawRect(x + 2, y + 2, width - 4, 2, COLORS.JAMSOFT_RED);
      renderer.drawText(card.label, x + 10, y + 9, {
        color: COLORS.JAMSOFT_SMOKE,
        font: '600 9px "Consolas", "Lucida Console", monospace',
        shadow: false
      });
      renderer.drawText(card.value, x + 10, y + 25, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.LARGE,
        shadow: true
      });
    });
  }

  _renderEquipment(renderer, equipment) {
    renderer.drawPanel(24, 132, 300, 238, {
      bg: '#0b0b0b',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });

    const count = equipment?.getCount ? equipment.getCount() : 0;
    const total = equipment?.getTotal ? equipment.getTotal() : equipmentList.length;

    renderer.drawText('ITENS ADQUIRIDOS', 40, 144, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.SMALL,
      shadow: false
    });
    renderer.drawText(`${count}/${total}`, 308, 145, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.SMALL,
      align: 'right',
      shadow: false
    });

    equipmentList.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 40 + col * 146;
      const y = 168 + row * 37;
      const unlocked = equipment?.has ? equipment.has(item.id) : false;

      drawIconSlot(renderer, item.id, x, y, 20, unlocked);

      const lines = wrapText(item.name, 18).slice(0, 2);
      lines.forEach((line, lineIndex) => {
        renderer.drawText(line, x + 26, y + lineIndex * 11, {
          color: unlocked ? COLORS.JAMSOFT_WHITE : '#6f6f6f',
          font: '600 9px "Consolas", "Lucida Console", monospace',
          shadow: false,
          maxWidth: 112
        });
      });

      renderer.drawText(unlocked ? 'OK' : '—', x + 137, y + 6, {
        color: unlocked ? COLORS.SAFETY_GREEN : '#555555',
        font: FONTS.TINY,
        align: 'right',
        shadow: false
      });
    });
  }

  _renderDecorations(renderer, equipment, player) {
    renderer.drawPanel(332, 132, 284, 238, {
      bg: '#0b0b0b',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });

    renderer.drawText('DECORAÇÃO', 348, 144, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.SMALL,
      shadow: false
    });

    decorativeItems.forEach((item, index) => {
      const selected = this._selected === index;
      const unlocked = isDecorationUnlocked(item, equipment);
      const equipped = player?.decoration === item.id;
      const x = 348;
      const y = 166 + index * 34;
      const width = 252;
      const height = 28;

      renderer.drawRect(x + 2, y + 2, width, height, 'rgba(0, 0, 0, 0.45)');
      renderer.drawRect(
        x,
        y,
        width,
        height,
        selected ? COLORS.JAMSOFT_WHITE : '#2d2d2d'
      );
      renderer.drawRect(x + 2, y + 2, width - 4, height - 4, selected ? '#2a070a' : '#101010');
      if (selected) {
        renderer.drawRect(x, y, 4, height, COLORS.JAMSOFT_RED);
      }

      renderer.drawText(item.name, x + 10, y + 3, {
        color: unlocked ? COLORS.JAMSOFT_WHITE : '#777777',
        font: '600 11px "Consolas", "Lucida Console", monospace',
        shadow: false,
        maxWidth: 160
      });

      renderer.drawText(
        !unlocked ? 'BLOQUEADO' : equipped ? 'EQUIPADO' : 'EQUIPAR',
        x + width - 9,
        y + 8,
        {
          color: !unlocked
            ? '#8a8a8a'
            : equipped
              ? COLORS.SAFETY_GREEN
              : COLORS.JAMSOFT_RED_LIGHT,
          font: '600 9px "Consolas", "Lucida Console", monospace',
          align: 'right',
          shadow: false
        }
      );
    });

    const selectedItem = decorativeItems[this._selected] || decorativeItems[0];
    const description = this._message || selectedItem.description;
    const lines = wrapText(description, 34).slice(0, 3);

    lines.forEach((line, index) => {
      renderer.drawText(line, 348, 278 + index * 12, {
        color: this._message ? COLORS.JAMSOFT_RED_LIGHT : COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        shadow: false,
        maxWidth: 180
      });
    });

    // Prévia do personagem com os EPIs e a decoração atuais.
    renderer.drawText('PRÉVIA', 556, 276, {
      color: COLORS.JAMSOFT_SMOKE,
      font: '600 8px "Consolas", "Lucida Console", monospace',
      align: 'center',
      shadow: false
    });

    const fakePlayer = {
      x: 0,
      y: 0,
      width: 24,
      height: 24,
      hasEquipment: (id) => Boolean(equipment?.has?.(id))
    };
    const ctx = renderer.context;
    ctx.save();
    ctx.translate(544, 298);
    ctx.scale(1.45, 1.45);
    drawPlayerSprite(renderer, 0, 0, {
      direction: 'down',
      time: this._time
    });
    drawOverlay(renderer, fakePlayer, equipment, 0, 0);
    drawPlayerDecoration(renderer, fakePlayer, player?.decoration || null, 0);
    ctx.restore();
  }

  _renderStudy(renderer) {
    const selected = this._selected >= decorativeItems.length;
    const x = 24;
    const y = 382;
    const width = 592;
    const height = 54;

    renderer.drawRect(x + 2, y + 2, width, height, 'rgba(0, 0, 0, 0.5)');
    renderer.drawRect(x, y, width, height, selected ? COLORS.JAMSOFT_WHITE : COLORS.JAMSOFT_RED_DARK);
    renderer.drawRect(x + 2, y + 2, width - 4, height - 4, selected ? '#2a070a' : '#101010');
    renderer.drawRect(x + 2, y + 2, width - 4, 2, COLORS.JAMSOFT_RED);

    renderer.drawText('MATERIAL DE ESTUDO', x + 16, y + 10, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.SMALL,
      shadow: false
    });
    renderer.drawText('Manual de NRs — 12 cartas de consulta', x + 16, y + 28, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      shadow: false
    });
    renderer.drawText('ENTER ou M', x + width - 16, y + 18, {
      color: selected ? COLORS.JAMSOFT_RED_LIGHT : COLORS.JAMSOFT_SMOKE,
      font: FONTS.SMALL,
      align: 'right',
      shadow: false
    });
  }
}
