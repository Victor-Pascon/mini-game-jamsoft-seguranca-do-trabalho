import { COLORS, FONTS } from '../design-tokens/snes-theme.js';

export const PAUSE_OPTIONS = Object.freeze([
  {
    id: 'resume',
    label: 'CONTINUAR',
    description: 'Voltar à exploração'
  },
  {
    id: 'inventory',
    label: 'INVENTÁRIO',
    description: 'Progresso, EPIs e decoração'
  },
  {
    id: 'manual',
    label: 'MANUAL DE NRs',
    description: '12 cartas de consulta'
  },
  {
    id: 'help',
    label: 'COMO JOGAR',
    description: 'Objetivo e controles'
  },
  {
    id: 'menu',
    label: 'MENU PRINCIPAL',
    description: 'Salvar e voltar ao início'
  }
]);

/**
 * Menu de pausa aberto por Start (ou Esc) durante a exploração.
 * Reúne os painéis que o jogador pode consultar sem perder a sessão.
 */
export class PauseMenu {
  constructor(sound = null) {
    this._sound = sound;
    this._open = false;
    this._selected = 0;
    this._action = null;
    this._time = 0;
  }

  open() {
    this._open = true;
    this._selected = 0;
    this._action = null;
    this._time = 0;
    this._sound?.playManual();
  }

  close() {
    this._open = false;
  }

  isOpen() {
    return this._open;
  }

  consumeAction() {
    const action = this._action;
    this._action = null;
    return action;
  }

  getSelectedId() {
    return PAUSE_OPTIONS[this._selected]?.id || null;
  }

  update(deltaTime, input) {
    if (!this._open) return;

    this._time += deltaTime;

    if (
      input.isJustPressed('Start') ||
      input.isJustPressed('Escape') ||
      input.isJustPressed('Backspace')
    ) {
      this._action = 'resume';
      this._open = false;
      this._sound?.playSelect();
      return;
    }

    if (input.isJustPressed('ArrowUp') || input.isJustPressed('KeyW')) {
      this._selected = (this._selected + PAUSE_OPTIONS.length - 1) % PAUSE_OPTIONS.length;
      this._sound?.playSelect();
      return;
    }

    if (input.isJustPressed('ArrowDown') || input.isJustPressed('KeyS')) {
      this._selected = (this._selected + 1) % PAUSE_OPTIONS.length;
      this._sound?.playSelect();
      return;
    }

    if (!input.confirmPressed()) return;

    this._action = this.getSelectedId();
    this._open = false;
    this._sound?.playSelect();
  }

  render(renderer) {
    if (!this._open) return;

    renderer.drawRect(0, 0, 640, 480, 'rgba(5, 5, 5, 0.82)');
    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);

    renderer.drawPanel(100, 54, 440, 386, {
      bg: '#0b0b0b',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });

    renderer.drawGlow(320, 86, 150, COLORS.JAMSOFT_RED, 0.12);

    renderer.drawText('MENU', 126, 72, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.DISPLAY,
      glow: true
    });
    renderer.drawText('JOGO PAUSADO  •  JAMSOFT TECNOLOGIA', 126, 108, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.TINY,
      shadow: false
    });

    const optionX = 122;
    const optionY = 132;
    const optionW = 396;
    const optionH = 44;
    const optionGap = 6;

    PAUSE_OPTIONS.forEach((option, index) => {
      const y = optionY + index * (optionH + optionGap);
      const selected = index === this._selected;

      renderer.drawRect(optionX + 2, y + 2, optionW, optionH, 'rgba(0, 0, 0, 0.55)');
      renderer.drawRect(
        optionX,
        y,
        optionW,
        optionH,
        selected ? COLORS.JAMSOFT_WHITE : '#3a3a3a'
      );
      renderer.drawRect(
        optionX + 2,
        y + 2,
        optionW - 4,
        optionH - 4,
        selected ? '#2a070a' : '#101010'
      );

      if (selected) {
        renderer.drawRect(optionX + 2, y + 2, 4, optionH - 4, COLORS.JAMSOFT_RED);
      }

      renderer.drawText(option.label, optionX + 18, y + 7, {
        color: selected ? COLORS.JAMSOFT_WHITE : COLORS.JAMSOFT_SMOKE,
        font: FONTS.SMALL,
        shadow: false
      });
      renderer.drawText(option.description, optionX + 18, y + 25, {
        color: selected ? COLORS.JAMSOFT_RED_LIGHT : '#8a8a8a',
        font: FONTS.TINY,
        shadow: false
      });

      if (selected) {
        const pulse = 0.55 + 0.45 * Math.sin(this._time * 5);
        renderer.drawText('A', optionX + optionW - 24, y + 14, {
          color: `rgba(255, 255, 255, ${pulse})`,
          font: FONTS.PRIMARY,
          align: 'center',
          shadow: false
        });
      }
    });

    renderer.drawRect(126, 398, 388, 1, '#3a3a3a');
    renderer.drawText('A CONFIRMAR   •   B / START VOLTAR', 320, 408, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
    renderer.drawText('ANALÓGICO ESQUERDO / D-PAD NAVEGAR', 320, 422, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
  }
}
