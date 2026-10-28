import { COLORS, FONTS } from '../design-tokens/snes-theme.js';
import { wrapText } from '../engine/TextUtils.js';
import { norms, NORMS_DISCLAIMER } from '../data/norms.js';
import { getEquipment } from '../data/equipment.js';
import { drawIcon } from './EquipmentRenderer.js';

const PAGE_SIZE = 6;

function contrastText(color) {
  if (typeof color !== 'string' || !color.startsWith('#')) return '#ffffff';
  const hex = color.length === 4
    ? color.slice(1).split('').map((c) => c + c).join('')
    : color.slice(1);
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? '#111111' : '#ffffff';
}

/**
 * Manual de Normas Regulamentadoras.
 * Overlay consultável a qualquer momento na exploração (tecla M).
 * Layout em duas páginas de 6 cards + detalhe com as principais regras.
 */
export class NormManual {
  constructor(sound = null) {
    this._sound = sound;
    this._open = false;
    this._mode = 'list';
    this._selected = 0;
    this._page = 0;
    this._time = 0;
  }

  open() {
    this._open = true;
    this._mode = 'list';
    this._time = 0;
    this._selected = Math.max(0, Math.min(norms.length - 1, this._selected));
    this._page = Math.floor(this._selected / PAGE_SIZE);
    this._sound?.playManual();
  }

  close() {
    this._open = false;
    this._mode = 'list';
  }

  isOpen() {
    return this._open;
  }

  update(deltaTime, input) {
    if (!this._open) return;

    this._time += deltaTime;

    if (input.isJustPressed('KeyM')) {
      this.close();
      return;
    }

    if (input.isJustPressed('Escape') || input.isJustPressed('Backspace')) {
      if (this._mode === 'detail') {
        this._mode = 'list';
      } else {
        this.close();
      }
      return;
    }

    if (this._mode === 'list') {
      const pageStart = this._page * PAGE_SIZE;
      const pageEnd = Math.min(norms.length, pageStart + PAGE_SIZE) - 1;

      if (input.isJustPressed('ArrowLeft')) {
        this._page = Math.max(0, this._page - 1);
        this._selected = this._page * PAGE_SIZE;
        this._sound?.playSelect();
      }

      if (input.isJustPressed('ArrowRight')) {
        const maxPage = Math.ceil(norms.length / PAGE_SIZE) - 1;
        this._page = Math.min(maxPage, this._page + 1);
        this._selected = this._page * PAGE_SIZE;
        this._sound?.playSelect();
      }

      if (input.isJustPressed('ArrowUp')) {
        this._selected = Math.max(pageStart, this._selected - 1);
        this._sound?.playSelect();
      }

      if (input.isJustPressed('ArrowDown')) {
        this._selected = Math.min(pageEnd, this._selected + 1);
        this._sound?.playSelect();
      }

      if (input.confirmPressed()) {
        this._mode = 'detail';
        this._sound?.playSelect();
      }
      return;
    }

    if (input.isJustPressed('ArrowLeft')) {
      this._selected = (this._selected - 1 + norms.length) % norms.length;
      this._page = Math.floor(this._selected / PAGE_SIZE);
      this._sound?.playSelect();
    }

    if (input.isJustPressed('ArrowRight')) {
      this._selected = (this._selected + 1) % norms.length;
      this._page = Math.floor(this._selected / PAGE_SIZE);
      this._sound?.playSelect();
    }

    if (input.confirmPressed()) {
      this._mode = 'list';
      this._sound?.playSelect();
    }
  }

  render(renderer, equipmentSystem = null) {
    if (!this._open) return;

    renderer.drawRect(0, 0, 640, 480, 'rgba(4, 8, 14, 0.94)');
    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);

    if (this._mode === 'detail') {
      this._renderDetail(renderer, equipmentSystem);
    } else {
      this._renderList(renderer, equipmentSystem);
    }
  }

  _renderList(renderer, equipmentSystem) {
    renderer.drawText('MANUAL DE NORMAS REGULAMENTADORAS', 24, 18, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.LARGE,
      glow: true
    });

    renderer.drawText('NRs — Segurança e Saúde no Trabalho', 24, 46, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.SMALL,
      shadow: false
    });

    const totalPages = Math.ceil(norms.length / PAGE_SIZE);
    renderer.drawText(`PÁGINA ${this._page + 1}/${totalPages}`, 616, 24, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.SMALL,
      align: 'right',
      shadow: false
    });

    const cardW = 288;
    const cardH = 104;
    const gapX = 16;
    const gapY = 12;
    const startX = 24;
    const startY = 78;

    const pageStart = this._page * PAGE_SIZE;
    const pageItems = norms.slice(pageStart, pageStart + PAGE_SIZE);

    pageItems.forEach((norm, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const globalIndex = pageStart + index;
      const selected = globalIndex === this._selected;

      renderer.drawRect(x + 3, y + 3, cardW, cardH, 'rgba(0, 0, 0, 0.4)');
      renderer.drawRect(x, y, cardW, cardH, selected ? norm.color : '#2f3b4a');
      renderer.drawRect(x + 2, y + 2, cardW - 4, cardH - 4, selected ? '#1e1508' : '#101a26');
      renderer.drawRect(x, y, 4, cardH, norm.color);

      if (selected) {
        const pulse = 0.5 + 0.5 * Math.sin(this._time * 5);
        renderer.drawRect(x, y, cardW, 2, `rgba(255, 215, 0, ${0.5 + pulse * 0.4})`);
      }

      // Badge da NR
      renderer.drawRect(x + 12, y + 10, 52, 24, norm.color);
      renderer.drawText(norm.nr, x + 38, y + 14, {
        color: contrastText(norm.color),
        font: FONTS.SMALL,
        align: 'center',
        shadow: false
      });

      // Título
      const titleLines = wrapText(norm.title, 32).slice(0, 2);
      titleLines.forEach((line, lineIndex) => {
        renderer.drawText(line, x + 72, y + 9 + lineIndex * 12, {
          color: COLORS.UI_TEXT,
          font: '10px "Consolas", "Lucida Console", monospace',
          shadow: false
        });
      });

      // Resumo
      const summaryLines = wrapText(norm.summary, 48).slice(0, 2);
      summaryLines.forEach((line, lineIndex) => {
        renderer.drawText(line, x + 12, y + 48 + lineIndex * 12, {
          color: COLORS.UI_TEXT_DIM,
          font: FONTS.TINY,
          shadow: false
        });
      });

      // Rodapé do card
      renderer.drawRect(x + 12, y + cardH - 24, cardW - 24, 1, '#263238');

      renderer.drawText(norm.short, x + 12, y + cardH - 18, {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        shadow: false
      });

      if (norm.equipmentId) {
        const unlocked = equipmentSystem?.has(norm.equipmentId);
        renderer.drawText(
          unlocked ? 'EPI ✓' : 'DESAFIO',
          x + cardW - 12,
          y + cardH - 18,
          {
            color: unlocked ? COLORS.SAFETY_GREEN : COLORS.SAFETY_ORANGE,
            font: FONTS.TINY,
            align: 'right',
            shadow: false
          }
        );
      } else {
        renderer.drawText('CONSULTA', x + cardW - 12, y + cardH - 18, {
          color: COLORS.UI_TEXT_DIM,
          font: FONTS.TINY,
          align: 'right',
          shadow: false
        });
      }
    });

    renderer.drawText('↑↓ selecionar  •  ←→ página  •  A abrir  •  B fechar', 24, 436, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      shadow: false
    });

    renderer.drawText('Resumo educativo — consulte a NR oficial e o SESMT.', 616, 436, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'right',
      shadow: false
    });
  }

  _renderDetail(renderer, equipmentSystem) {
    const norm = norms[this._selected];
    if (!norm) return;

    const equipment = norm.equipmentId ? getEquipment(norm.equipmentId) : null;
    const unlocked = equipment ? equipmentSystem?.has(equipment.id) : false;

    renderer.drawPanel(24, 66, 592, 362, {
      bg: '#0d1622',
      border: norm.color
    });

    renderer.drawRect(24, 66, 592, 4, norm.color);

    renderer.drawRect(44, 86, 92, 42, norm.color);
    renderer.drawRect(46, 88, 88, 38, '#0b121b');
    renderer.drawText(norm.nr, 90, 94, {
      color: norm.color,
      font: FONTS.LARGE,
      align: 'center',
      glow: true
    });

    const titleLines = wrapText(norm.title, 36).slice(0, 2);
    titleLines.forEach((line, index) => {
      renderer.drawText(line, 152, 88 + index * 22, {
        color: COLORS.UI_TEXT,
        font: FONTS.LARGE,
        shadow: true
      });
    });

    const summaryLines = wrapText(norm.summary, 78).slice(0, 2);
    summaryLines.forEach((line, index) => {
      renderer.drawText(line, 44, 146 + index * 17, {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.SMALL,
        shadow: false
      });
    });

    renderer.drawRect(44, 188, 552, 1, '#2f3b4a');

    renderer.drawText('PRINCIPAIS REGRAS', 44, 200, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.TINY,
      shadow: false
    });

    let ruleY = 220;
    for (const rule of norm.rules) {
      renderer.drawRect(46, ruleY + 4, 4, 4, norm.color);
      const ruleLines = wrapText(rule, 76);
      ruleLines.forEach((line, index) => {
        renderer.drawText(line, 58, ruleY + index * 16, {
          color: COLORS.UI_TEXT,
          font: FONTS.SMALL,
          shadow: true
        });
      });
      ruleY += Math.max(18, ruleLines.length * 16 + 4);
    }

    if (equipment) {
      renderer.drawRect(44, 352, 552, 1, '#2f3b4a');
      drawIcon(renderer, equipment.id, 46, 362, 20);
      renderer.drawText(`Item da jornada: ${equipment.name}`, 74, 362, {
        color: unlocked ? COLORS.SAFETY_GREEN : COLORS.UI_TEXT,
        font: FONTS.SMALL,
        shadow: true
      });
      renderer.drawText(unlocked ? 'CONQUISTADO' : 'BLOQUEADO', 584, 364, {
        color: unlocked ? COLORS.SAFETY_GREEN : COLORS.SAFETY_ORANGE,
        font: FONTS.TINY,
        align: 'right',
        shadow: false
      });
    }

    const disclaimerLines = wrapText(NORMS_DISCLAIMER, 92).slice(0, 2);
    disclaimerLines.forEach((line, index) => {
      renderer.drawText(line, 44, 392 + index * 11, {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        shadow: false
      });
    });

    renderer.drawText(`←→ outra NR  •  B / ESC volta  •  M / X fecha`, 24, 440, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      shadow: false
    });

    renderer.drawText(`${this._selected + 1}/${norms.length}`, 616, 440, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'right',
      shadow: false
    });
  }
}
