import { Entity } from './Entity.js';
import { COLORS, FONTS } from '../design-tokens/snes-theme.js';
import { drawNpcSprite } from './CharacterRenderer.js';

/**
 * NPC - especialista de segurança da JAMSOFT.
 * Usa o mesmo estilo de sprite do projeto original, com nome, cargo e um
 * indicador de desafio pendente/concluído.
 */
export class NPC extends Entity {
  constructor(options = {}) {
    super({
      x: options.x ?? 0,
      y: options.y ?? 0,
      width: 26,
      height: 26,
      speed: 0,
      color: options.color || COLORS.SNES_BLUE,
      ...options
    });

    this._name = options.name || 'Especialista';
    this._role = options.role || 'Colaborador';
    this._norm = options.norm || '';
    this._equipmentId = options.equipmentId || '';
    this._avatar = options.avatar || '?';
    this._npcId = options.id || 'npc_unknown';
    this._interactRadius = options.interactRadius || 54;
    this._completed = false;
    this._phase = Math.random() * Math.PI * 2;
  }

  get name() { return this._name; }
  get role() { return this._role; }
  get norm() { return this._norm; }
  get equipmentId() { return this._equipmentId; }
  get avatar() { return this._avatar; }
  get npcId() { return this._npcId; }
  get completed() { return this._completed; }

  setCompleted(value) {
    this._completed = Boolean(value);
  }

  canInteract(player) {
    const dx = this.getCenterX() - player.getCenterX();
    const dy = this.getCenterY() - player.getCenterY();
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= this._interactRadius;
  }

  _lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x00FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  _darkenColor(color, percent) {
    return this._lightenColor(color, -percent);
  }

  render(renderer, options = {}) {
    if (!this._visible) return;

    const { nearby = false } = options;
    const time = Date.now() / 1000 + this._phase;
    const bob = Math.sin(time * 2) * 0.5;
    const y = this._y + bob;
    const ground = this._y + this._height;

    // Marcador de piso e aura de desafio.
    renderer.drawRect(this._x + 3, ground - 3, this._width - 6, 3, 'rgba(0, 0, 0, 0.30)');
    renderer.drawRect(this._x + 8, ground - 1, this._width - 16, 1, this._color);
    if (!this._completed) {
      renderer.drawGlow(
        this._x + this._width / 2,
        y + 4,
        32,
        this._color,
        nearby ? 0.16 : 0.075
      );
    }

    // Anel de interação quando o jogador está perto.
    if (nearby) {
      const pulse = 0.55 + 0.45 * Math.sin(time * 5);
      const ringColor = `rgba(255, 193, 7, ${0.45 + pulse * 0.4})`;
      for (let i = 0; i < 12; i++) {
        if (i % 2 === 0) {
          const angle = (i / 12) * Math.PI * 2;
          renderer.drawRect(
            this._x + this._width / 2 + Math.cos(angle) * 20 - 1,
            ground - 5 + Math.sin(angle) * 6,
            3,
            2,
            ringColor
          );
        }
      }
    }

    drawNpcSprite(
      renderer,
      {
        x: this._x,
        y,
        width: this._width,
        height: this._height,
        npcId: this._npcId,
        color: this._color
      },
      { time, direction: 'down' }
    );

    // Pin da NR no peito, alinhado ao uniforme.
    if (this._norm) {
      renderer.drawRect(this._x + 16, y + 9, 8, 6, '#f7f2e7');
      renderer.drawRect(this._x + 17, y + 10, 6, 1, this._color);
      renderer.drawRect(this._x + 17, y + 12, 4, 1, this._color);
    }

    // Nome em plaquinha escura, exibido quando o jogador está perto.
    if (nearby) {
      const firstName = this._name.split(' ')[0];
      const plateW = Math.max(58, firstName.length * 6 + 20);
      const plateX = this._x + this._width / 2 - plateW / 2;
      const plateY = this._y - 23 + Math.sin(time * 2.2) * 1;
      renderer.drawRect(plateX + 2, plateY + 2, plateW, 13, 'rgba(0, 0, 0, 0.42)');
      renderer.drawRect(plateX, plateY, plateW, 13, 'rgba(5, 11, 18, 0.88)');
      renderer.drawRect(plateX, plateY, 3, 13, this._color);
      renderer.drawRect(plateX + 3, plateY, plateW - 3, 1, 'rgba(255, 255, 255, 0.18)');
      renderer.drawText(firstName, this._x + this._width / 2, plateY + 3, {
        color: COLORS.UI_TEXT,
        font: '8px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: true
      });
    }

    // Indicador de status: "!" pulsante ou check de concluído.
    const statusX = this._x + this._width + 1;
    const statusY = this._y + 2;
    const pulse = 0.70 + 0.30 * Math.sin(time * 4);

    if (this._completed) {
      renderer.drawRect(statusX + 1, statusY + 2, 12, 12, 'rgba(0, 0, 0, 0.40)');
      renderer.drawRect(statusX, statusY, 12, 12, COLORS.SAFETY_GREEN_DARK);
      renderer.drawRect(statusX + 2, statusY + 2, 8, 8, COLORS.SAFETY_GREEN);
      renderer.drawText('✓', statusX + 6, statusY - 1, {
        color: '#ffffff',
        font: '10px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: false
      });
    } else {
      renderer.drawRect(statusX + 1, statusY + 2, 12, 12, 'rgba(0, 0, 0, 0.40)');
      renderer.drawRect(statusX, statusY, 12, 12, COLORS.SAFETY_YELLOW_DARK);
      renderer.drawRect(statusX + 2, statusY + 2, 8, 8, COLORS.SAFETY_YELLOW);
      renderer.drawText('!', statusX + 6, statusY - 1, {
        color: '#111111',
        font: '11px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: false
      });
      renderer.drawRect(
        statusX - 2,
        statusY - 2,
        16,
        16,
        `rgba(255, 193, 7, ${0.06 + pulse * 0.08})`
      );
    }
  }
}
