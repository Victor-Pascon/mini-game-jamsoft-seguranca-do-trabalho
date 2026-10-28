import { COLORS, FONTS, shadeColor } from '../design-tokens/snes-theme.js';
import { wrapText } from '../engine/TextUtils.js';
import { drawPortrait } from './PortraitRenderer.js';

/**
 * Caixa de diálogo com efeito de máquina de escrever.
 * Mantém o estilo do projeto original: painel SNES, retrato do especialista,
 * indicador de avanço e progresso das falas.
 */
export class Dialog {
  constructor() {
    this._lines = [];
    this._currentLine = 0;
    this._speaker = null;
    this._charIndex = 0;
    this._charTimer = 0;
    this._charSpeed = 48;
    this._active = false;
    this._finished = false;
    this._blinkTimer = 0;
    this._time = 0;
    this._blink = false;
  }

  startDialog(lines, speaker = null) {
    this._lines = (Array.isArray(lines) ? lines : [String(lines ?? '')])
      .map((line) => String(line ?? ''))
      .filter((line) => line.length > 0);

    this._currentLine = 0;
    this._speaker = speaker;
    this._charIndex = 0;
    this._charTimer = 0;
    this._blinkTimer = 0;
    this._time = 0;
    this._blink = false;
    this._active = this._lines.length > 0;
    this._finished = !this._active;
  }

  update(deltaTime, input) {
    if (!this._active) return;

    this._time += deltaTime;
    this._blinkTimer += deltaTime;
    const blinkCycle = 3.6;
    const blinkPhase = this._blinkTimer % blinkCycle;
    this._blink = blinkPhase > blinkCycle - 0.14;
    const line = this._lines[this._currentLine] || '';

    if (this._charIndex < line.length) {
      this._charTimer += deltaTime;
      const charsToAdd = Math.floor(this._charTimer * this._charSpeed);

      if (charsToAdd > 0) {
        this._charTimer = 0;
        this._charIndex = Math.min(line.length, this._charIndex + charsToAdd);
      }

      if (input.confirmPressed()) {
        this._charIndex = line.length;
      }
      return;
    }

    if (input.confirmPressed()) {
      if (this._currentLine < this._lines.length - 1) {
        this._currentLine += 1;
        this._charIndex = 0;
        this._charTimer = 0;
      } else {
        this._active = false;
        this._finished = true;
      }
    }
  }

  isActive() {
    return this._active;
  }

  isFinished() {
    return this._finished;
  }

  end() {
    this._active = false;
    this._finished = true;
  }

  _getVisibleLines() {
    const line = this._lines[this._currentLine] || '';
    const maxChars = this._speaker ? 45 : 58;
    const fullLines = wrapText(line, maxChars);
    const totalChars = fullLines.reduce((sum, value) => sum + value.length, 0);

    if (totalChars === 0) return [];

    const ratio = Math.min(1, this._charIndex / Math.max(1, line.length));
    let remaining = Math.floor(totalChars * ratio);
    const visible = [];

    for (const fullLine of fullLines) {
      if (remaining <= 0) break;
      visible.push(fullLine.slice(0, remaining));
      remaining -= fullLine.length;
    }

    return visible;
  }

  render(renderer) {
    if (!this._active && !this._finished) return;
    if (this._lines.length === 0) return;

    const boxX = 20;
    const boxY = 286;
    const boxW = 600;
    const boxH = 176;

    renderer.drawPanel(boxX, boxY, boxW, boxH, {
      bg: 'rgba(7, 13, 22, 0.97)',
      border: COLORS.UI_BORDER
    });

    // Linha de acento e brilho interno.
    renderer.drawRect(boxX + 8, boxY + 8, boxW - 16, 2, COLORS.SAFETY_YELLOW);
    renderer.drawRect(boxX + 8, boxY + 10, boxW - 16, 1, 'rgba(255, 193, 7, 0.18)');
    renderer.drawRect(boxX + 8, boxY + boxH - 13, boxW - 16, 1, 'rgba(255, 255, 255, 0.08)');

    let textX = boxX + 24;
    let textY = boxY + 34;
    const line = this._lines[this._currentLine] || '';
    const isLineComplete = this._charIndex >= line.length;

    if (this._speaker) {
      const portraitSize = 88;
      const portraitX = boxX + 14;
      const portraitY = boxY + 18;

      // Retrato detalhado com olhos e boca animados.
      drawPortrait(renderer, this._speaker, {
        x: portraitX,
        y: portraitY,
        size: portraitSize,
        time: this._time,
        blink: this._blink,
        talking: !isLineComplete
      });

      // Indicador de voz ao lado do retrato.
      const voiceX = portraitX + 4;
      const voiceY = portraitY + portraitSize + 7;
      for (let index = 0; index < 4; index++) {
        const activeBar = !isLineComplete && (Math.floor(this._time * 12) % 4) >= index;
        const barHeight = 3 + index * 2;
        renderer.drawRect(
          voiceX + index * 5,
          voiceY + 7 - barHeight,
          3,
          barHeight,
          activeBar ? COLORS.SAFETY_YELLOW : 'rgba(255, 255, 255, 0.14)'
        );
      }

      // Placa com nome e cargo, flutuando acima do painel.
      const plateX = boxX + 10;
      const plateY = boxY - 32;
      const plateW = 390;
      const plateH = 30;
      const accent = this._speaker.color || COLORS.SAFETY_ORANGE;

      renderer.drawRect(plateX + 3, plateY + 3, plateW, plateH, 'rgba(0, 0, 0, 0.55)');
      renderer.drawRect(plateX, plateY, plateW, plateH, COLORS.UI_BORDER);
      renderer.drawRect(plateX + 2, plateY + 2, plateW - 4, plateH - 4, '#0b1521');
      renderer.drawRect(plateX + 2, plateY + 2, 5, plateH - 4, accent);
      renderer.drawRect(plateX + 7, plateY + 2, plateW - 9, 1, 'rgba(255, 255, 255, 0.14)');
      renderer.drawText(this._speaker.name || 'Especialista', plateX + 16, plateY + 5, {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.SMALL,
        shadow: true
      });
      renderer.drawText(this._speaker.role || '', plateX + 16, plateY + 16, {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        shadow: false
      });

      const badge = this._speaker.norm || this._speaker.avatar || '';
      if (badge && badge.length <= 6) {
        const badgeW = Math.max(38, badge.length * 7 + 10);
        const badgeX = plateX + plateW - badgeW - 8;
        renderer.drawRect(badgeX, plateY + 7, badgeW, 16, shadeColor(accent, -45));
        renderer.drawRect(badgeX + 1, plateY + 8, badgeW - 2, 14, 'rgba(0, 0, 0, 0.28)');
        renderer.drawText(badge, badgeX + badgeW / 2, plateY + 10, {
          color: accent,
          font: '8px "Consolas", "Lucida Console", monospace',
          align: 'center',
          shadow: true
        });
      }

      textX = boxX + 124;
      textY = boxY + 30;

      // Separação vertical entre retrato e texto.
      renderer.drawRect(textX - 12, boxY + 18, 1, boxH - 36, 'rgba(255, 255, 255, 0.08)');
    }

    const visibleLines = this._getVisibleLines();
    const lineHeight = 21;

    visibleLines.forEach((visibleLine, index) => {
      renderer.drawText(visibleLine, textX, textY + index * lineHeight, {
        color: COLORS.UI_TEXT,
        font: FONTS.DIALOG,
        shadow: true
      });
    });

    // Cursor de digitação.
    if (!isLineComplete && visibleLines.length > 0) {
      const lastLine = visibleLines[visibleLines.length - 1];
      const cursorX = textX + renderer.measureText(lastLine, FONTS.DIALOG) + 2;
      const cursorY = textY + (visibleLines.length - 1) * lineHeight + 2;
      if (Math.floor(this._time * 8) % 2 === 0) {
        renderer.drawRect(cursorX, cursorY, 7, 2, COLORS.SAFETY_YELLOW);
      }
    }

    // Progresso das falas.
    renderer.drawText(
      `${this._currentLine + 1}/${this._lines.length}`,
      boxX + boxW - 18,
      boxY + boxH - 21,
      {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        align: 'right',
        shadow: false
      }
    );

    if (isLineComplete) {
      const blink = Math.sin(this._blinkTimer * 6) > -0.2;
      if (blink) {
        renderer.drawText(
          this._currentLine < this._lines.length - 1 ? 'A / ESPAÇO ▼' : 'A / ESPAÇO para encerrar ▼',
          boxX + boxW / 2,
          boxY + boxH - 21,
          {
            color: COLORS.SAFETY_YELLOW,
            font: FONTS.TINY,
            align: 'center',
            shadow: true
          }
        );
      }
    }

    // Barra de progresso do texto (feedback visual de leitura).
    const lineProgress = line.length > 0 ? Math.min(1, this._charIndex / line.length) : 1;
    renderer.drawRect(boxX + 8, boxY + boxH - 7, boxW - 16, 2, 'rgba(255, 255, 255, 0.12)');
    renderer.drawRect(boxX + 8, boxY + boxH - 7, (boxW - 16) * lineProgress, 2, COLORS.SAFETY_ORANGE);
  }
}
