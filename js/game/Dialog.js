import { COLORS, FONTS } from '../design-tokens/snes-theme.js';
import { wrapText } from '../engine/TextUtils.js';

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
    this._active = this._lines.length > 0;
    this._finished = !this._active;
  }

  update(deltaTime, input) {
    if (!this._active) return;

    this._blinkTimer += deltaTime;
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
    const fullLines = wrapText(line, 54);
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
    const boxY = 300;
    const boxW = 600;
    const boxH = 150;

    renderer.drawPanel(boxX, boxY, boxW, boxH, {
      bg: 'rgba(8, 14, 24, 0.96)',
      border: COLORS.UI_BORDER
    });

    // Linha de acento no topo do painel.
    renderer.drawRect(boxX + 8, boxY + 8, boxW - 16, 2, COLORS.SAFETY_YELLOW);

    let textX = boxX + 22;

    if (this._speaker) {
      const portraitSize = 44;
      const portraitX = boxX + 12;
      const portraitY = boxY + 18;

      renderer.drawRect(portraitX, portraitY, portraitSize, portraitSize, '#0b121b');
      renderer.drawRect(portraitX + 2, portraitY + 2, portraitSize - 4, portraitSize - 4, this._speaker.color || COLORS.SAFETY_ORANGE);
      renderer.drawRect(portraitX + 5, portraitY + 5, portraitSize - 10, 12, 'rgba(255, 255, 255, 0.22)');

      const eyeY = portraitY + 16;
      renderer.drawRect(portraitX + 10, eyeY, 5, 5, '#ffffff');
      renderer.drawRect(portraitX + 28, eyeY, 5, 5, '#ffffff');
      renderer.drawRect(portraitX + 12, eyeY + 1, 3, 3, '#111111');
      renderer.drawRect(portraitX + 30, eyeY + 1, 3, 3, '#111111');
      renderer.drawRect(portraitX + 15, portraitY + 30, 14, 3, 'rgba(0, 0, 0, 0.45)');

      renderer.drawText(
        this._speaker.avatar || '',
        portraitX + portraitSize / 2,
        portraitY + 25,
        {
          color: '#ffffff',
          font: (this._speaker.avatar || '').length > 2
            ? '8px "Courier New", monospace'
            : '13px "Courier New", monospace',
          align: 'center',
          shadow: true
        }
      );

      // Placa com nome e cargo.
      const plateX = boxX + 66;
      // A placa fica acima do painel, sem invadir a borda superior.
      const plateY = boxY - 30;
      const plateW = Math.max(220, Math.min(400, (this._speaker.name || '').length * 10 + 180));
      const plateH = 26;

      renderer.drawRect(plateX + 3, plateY + 3, plateW, plateH, 'rgba(0, 0, 0, 0.5)');
      renderer.drawRect(plateX, plateY, plateW, plateH, COLORS.UI_BORDER);
      renderer.drawRect(plateX + 2, plateY + 2, plateW - 4, plateH - 4, '#0d1622');
      renderer.drawText(this._speaker.name || 'Especialista', plateX + 10, plateY + 5, {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.SMALL,
        shadow: true
      });
      renderer.drawText(this._speaker.role || '', plateX + 10, plateY + 15, {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        shadow: false
      });

      textX = boxX + 68;
    }

    const visibleLines = this._getVisibleLines();
    const lineHeight = 21;
    const textY = boxY + 30;

    visibleLines.forEach((line, index) => {
      renderer.drawText(line, textX, textY + index * lineHeight, {
        color: COLORS.UI_TEXT,
        font: FONTS.DIALOG,
        shadow: true
      });
    });

    // Progresso das falas.
    renderer.drawText(
      `${this._currentLine + 1}/${this._lines.length}`,
      boxX + boxW - 18,
      boxY + boxH - 20,
      {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        align: 'right',
        shadow: false
      }
    );

    const line = this._lines[this._currentLine] || '';
    const isLineComplete = this._charIndex >= line.length;

    if (isLineComplete) {
      const blink = Math.sin(this._blinkTimer * 6) > -0.2;
      if (blink) {
        renderer.drawText(
          this._currentLine < this._lines.length - 1 ? 'ESPAÇO ▼' : 'ESPAÇO para encerrar ▼',
          boxX + boxW / 2,
          boxY + boxH - 20,
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
