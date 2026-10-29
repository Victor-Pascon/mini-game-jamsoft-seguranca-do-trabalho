import { COLORS, FONTS } from '../design-tokens/snes-theme.js';
import { wrapText } from '../engine/TextUtils.js';
import { getEquipment } from '../data/equipment.js';
import { getNorm } from '../data/norms.js';
import { drawIcon } from './EquipmentRenderer.js';

/**
 * Tela de desafio de múltipla escolha.
 * Acertar libera o EPI; errar mostra uma dica educativa e permite tentar de novo.
 */
export class Challenge {
  constructor(sound = null) {
    this._sound = sound;
    this._data = null;
    this._selected = 0;
    this._result = null; // null | 'correct' | 'wrong'
    this._showHint = false;
    this._attempts = 0;
    this._active = false;
    this._completed = false;
    this._time = 0;
  }

  /**
   * Embaralha as alternativas numa cópia dos dados (a fonte não é alterada)
   * e recalcula o índice da correta. Evita repetir a ordem anterior.
   */
  _shuffleOptions(data, previousOrder = null) {
    const count = data.options.length;
    let order;
    let tries = 0;
    do {
      order = Array.from({ length: count }, (_, index) => index);
      for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      tries += 1;
    } while (previousOrder && tries < 10 && order.every((v, i) => v === previousOrder[i]));

    this._order = order;
    this._data = {
      ...data,
      options: order.map((original) => data.options[original]),
      correct: order.indexOf(data.correct)
    };
  }

  startChallenge(data) {
    this._source = data;
    this._order = null;
    this._shuffleOptions(data);
    this._selected = 0;
    this._result = null;
    this._showHint = false;
    this._attempts = 0;
    this._active = true;
    this._completed = false;
    this._time = 0;
  }

  update(deltaTime, input) {
    if (!this._active || !this._data) return;

    this._time += deltaTime;

    if (this._result === 'correct') {
      if (input.confirmPressed()) {
        this._active = false;
        this._completed = true;
      }
      return;
    }

    if (this._result === 'wrong') {
      if (input.confirmPressed()) {
        if (!this._showHint) {
          this._showHint = true;
        } else {
          this._result = null;
          this._showHint = false;
          this._shuffleOptions(this._source, this._order);
          this._selected = 0;
        }
      }
      return;
    }

    const up = input.isJustPressed('ArrowUp') || input.isJustPressed('KeyW');
    const down = input.isJustPressed('ArrowDown') || input.isJustPressed('KeyS');

    if (up) this._selected = (this._selected + 3) % 4;
    if (down) this._selected = (this._selected + 1) % 4;

    for (let index = 0; index < 4; index++) {
      if (input.isJustPressed(`Digit${index + 1}`)) {
        this._selected = index;
      }
    }

    if (input.confirmPressed()) {
      this._checkAnswer();
    }
  }

  _checkAnswer() {
    if (!this._data) return;

    this._attempts += 1;

    if (this._selected === this._data.correct) {
      this._result = 'correct';
      this._sound?.playCorrect();
    } else {
      this._result = 'wrong';
      this._showHint = false;
      this._sound?.playWrong();
    }
  }

  isActive() {
    return this._active;
  }

  isCompleted() {
    return this._completed;
  }

  getEquipmentId() {
    return this._data?.equipmentId || null;
  }

  getNorm() {
    return this._data?.norm || null;
  }

  getChallengeId() {
    return this._data?.id || null;
  }

  render(renderer) {
    if (!this._data) return;

    renderer.clear('#080d14');

    const ctx = renderer.context;
    const gradient = ctx.createLinearGradient(0, 0, 0, 480);
    gradient.addColorStop(0, '#0b1a2b');
    gradient.addColorStop(0.55, '#081018');
    gradient.addColorStop(1, '#050a10');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 480);

    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);

    if (this._result === 'correct') {
      this._renderCorrect(renderer);
      return;
    }

    if (this._result === 'wrong') {
      this._renderWrong(renderer);
      return;
    }

    this._renderQuestion(renderer);
  }

  _renderQuestion(renderer) {
    renderer.drawRect(0, 0, 640, 64, 'rgba(0, 0, 0, 0.55)');
    renderer.drawRect(0, 62, 640, 2, COLORS.SAFETY_ORANGE);

    renderer.drawText('DESAFIO DE SEGURANÇA', 24, 12, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.LARGE,
      glow: true
    });
    renderer.drawText(this._data.roomName, 24, 40, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.SMALL,
      shadow: false
    });

    const norm = getNorm(this._data.norm);
    const normColor = norm?.color || COLORS.SAFETY_ORANGE;

    renderer.drawRect(520, 12, 96, 38, normColor);
    renderer.drawRect(522, 14, 92, 34, '#0b121b');
    renderer.drawText(this._data.norm, 568, 17, {
      color: normColor,
      font: FONTS.LARGE,
      align: 'center',
      shadow: true
    });

    renderer.drawPanel(30, 78, 580, 94, {
      bg: '#101a26',
      border: COLORS.SAFETY_ORANGE
    });

    renderer.drawText('PERGUNTA', 46, 90, {
      color: COLORS.SAFETY_ORANGE,
      font: FONTS.TINY,
      shadow: false
    });

    const questionLines = wrapText(this._data.question, 62);
    questionLines.forEach((line, index) => {
      renderer.drawText(line, 46, 108 + index * 20, {
        color: COLORS.UI_TEXT,
        font: FONTS.DIALOG,
        shadow: true
      });
    });

    const optionY = 188;
    const optionH = 48;
    const optionGap = 10;

    this._data.options.forEach((option, index) => {
      const y = optionY + index * (optionH + optionGap);
      const selected = this._selected === index;

      renderer.drawRect(46, y + 2, 548, optionH, 'rgba(0, 0, 0, 0.35)');
      renderer.drawRect(46, y, 548, optionH, selected ? COLORS.SAFETY_ORANGE : '#172331');
      renderer.drawRect(48, y + 2, 544, optionH - 4, selected ? '#2a1400' : '#0d1622');
      renderer.drawRect(46, y, 548, 2, selected ? COLORS.SAFETY_YELLOW : '#2f3b4a');
      renderer.drawRect(46, y + optionH - 2, 548, 2, selected ? COLORS.SAFETY_ORANGE : '#101720');

      renderer.drawRect(58, y + 10, 28, 28, selected ? '#111111' : '#263238');
      renderer.drawRect(
        60,
        y + 12,
        24,
        24,
        selected ? '#ffc107' : '#1b2a3a'
      );
      renderer.drawText(String(index + 1), 72, y + 15, {
        color: selected ? '#111111' : '#ffffff',
        font: FONTS.PRIMARY,
        align: 'center',
        shadow: false
      });

      const optionLines = wrapText(option, 54);
      optionLines.forEach((line, lineIndex) => {
        renderer.drawText(line, 98, y + 9 + lineIndex * 16, {
          color: selected ? '#ffffff' : '#e0e0e0',
          font: FONTS.PRIMARY,
          shadow: true
        });
      });
    });

    renderer.drawText('↑ ↓ ou 1-4 para escolher  •  A / ESPAÇO confirma', 46, 430, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      shadow: false
    });

    renderer.drawText(`Fonte: ${this._data.norm}`, 594, 430, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'right',
      shadow: false
    });
  }

  _renderCorrect(renderer) {
    const equipment = getEquipment(this._data.equipmentId);
    const itemColor = equipment?.color || COLORS.SAFETY_YELLOW;

    renderer.drawRect(0, 0, 640, 480, 'rgba(4, 10, 18, 0.94)');
    renderer.drawGlow(320, 150, 110, itemColor, 0.18);

    renderer.drawText('RESPOSTA CORRETA!', 320, 28, {
      color: COLORS.SAFETY_GREEN,
      font: FONTS.TITLE,
      align: 'center',
      glow: true
    });

    renderer.drawText('VOCÊ CONQUISTOU', 320, 70, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.SMALL,
      align: 'center',
      shadow: true
    });

    const pulse = 0.5 + 0.5 * Math.sin(this._time * 5);
    const frame = `rgba(255, 215, 0, ${0.45 + pulse * 0.45})`;

    renderer.drawRect(258, 88, 124, 124, frame);
    renderer.drawRect(260, 90, 120, 120, '#0b121b');
    renderer.drawRect(262, 92, 116, 116, '#101a26');
    drawIcon(renderer, this._data.equipmentId, 272, 102, 96);

    renderer.drawText(equipment?.name || 'Novo equipamento', 320, 222, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.LARGE,
      align: 'center',
      glow: true
    });

    renderer.drawText(`${this._data.norm} — ${this._data.normTitle}`, 320, 248, {
      color: COLORS.UI_TEXT,
      font: FONTS.SMALL,
      align: 'center',
      shadow: true
    });

    renderer.drawPanel(60, 270, 520, 86, {
      bg: 'rgba(12, 30, 24, 0.92)',
      border: COLORS.SAFETY_GREEN_DARK
    });

    renderer.drawText('POR QUE ISSO IMPORTA', 76, 282, {
      color: COLORS.SAFETY_GREEN,
      font: FONTS.TINY,
      shadow: false
    });

    const explanationLines = wrapText(this._data.explanation, 66);
    explanationLines.slice(0, 3).forEach((line, index) => {
      renderer.drawText(line, 76, 300 + index * 17, {
        color: COLORS.UI_TEXT,
        font: FONTS.SMALL,
        shadow: true
      });
    });

    const blink = Math.sin(this._time * 6) > -0.2;
    if (blink) {
      renderer.drawText('A / ESPAÇO para equipar o personagem', 320, 374, {
        color: COLORS.SAFETY_GREEN,
        font: FONTS.PRIMARY,
        align: 'center',
        glow: true
      });
    }

    renderer.drawText(
      'O item será adicionado ao sprite, ao HUD e ao certificado.',
      320,
      404,
      {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        align: 'center',
        shadow: false
      }
    );
  }

  _renderWrong(renderer) {
    const correctOption = this._data.options[this._data.correct] || '';

    renderer.drawRect(0, 0, 640, 480, 'rgba(18, 6, 8, 0.94)');

    renderer.drawText('RESPOSTA INCORRETA', 320, 42, {
      color: COLORS.UI_DANGER,
      font: FONTS.TITLE,
      align: 'center',
      glow: true
    });

    renderer.drawText('A resposta correta era:', 320, 94, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawPanel(60, 116, 520, 60, {
      bg: 'rgba(12, 30, 24, 0.92)',
      border: COLORS.SAFETY_GREEN_DARK
    });

    const correctLines = wrapText(correctOption, 58);
    correctLines.slice(0, 2).forEach((line, index) => {
      renderer.drawText(line, 320, 128 + index * 18, {
        color: COLORS.SAFETY_GREEN,
        font: FONTS.PRIMARY,
        align: 'center',
        shadow: true
      });
    });

    renderer.drawPanel(60, 192, 520, 116, {
      bg: 'rgba(26, 20, 8, 0.92)',
      border: COLORS.SAFETY_YELLOW_DARK
    });

    renderer.drawText('DICA DE SEGURANÇA', 76, 204, {
      color: COLORS.SAFETY_YELLOW,
      font: FONTS.TINY,
      shadow: false
    });

    renderer.drawText(`${this._data.norm} — ${this._data.normTitle}`, 76, 218, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      shadow: false
    });

    const hintLines = wrapText(this._data.hint, 64);
    hintLines.slice(0, 4).forEach((line, index) => {
      renderer.drawText(line, 76, 238 + index * 17, {
        color: COLORS.UI_TEXT,
        font: FONTS.SMALL,
        shadow: true
      });
    });

    const blink = Math.sin(this._time * 6) > -0.2;
    if (blink) {
      renderer.drawText(
        this._showHint ? 'A / ESPAÇO para voltar à pergunta' : 'A / ESPAÇO para ver a dica',
        320,
        330,
        {
          color: COLORS.SAFETY_YELLOW,
          font: FONTS.PRIMARY,
          align: 'center',
          glow: true
        }
      );
    }

    renderer.drawText('Errar faz parte do aprendizado. Leia a dica e tente de novo.', 320, 360, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    renderer.drawText(`Tentativas: ${this._attempts}`, 594, 430, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'right',
      shadow: false
    });
  }
}
