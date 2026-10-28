import { Entity } from './Entity.js';
import { COLORS, FONTS } from '../design-tokens/snes-theme.js';

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

  render(renderer) {
    if (!this._visible) return;

    const time = Date.now() / 1000;
    const bob = Math.sin(time * 2 + this._phase) * 1;
    const y = this._y + bob;
    const bodyColor = this._color;
    const lightColor = this._lightenColor(bodyColor, 40);
    const darkColor = this._darkenColor(bodyColor, 40);

    // Aura suave para chamar atenção em quem ainda tem desafio.
    if (!this._completed) {
      renderer.drawGlow(
        this._x + this._width / 2,
        y + this._height / 2,
        27,
        this._color,
        0.08
      );
    }

    // Sombra
    renderer.drawRect(
      this._x + 4,
      this._y + this._height - 2,
      this._width - 8,
      4,
      'rgba(0, 0, 0, 0.35)'
    );

    // Cabeça
    renderer.drawRect(
      this._x + 3,
      y + 2,
      this._width - 6,
      10,
      bodyColor,
      { border: true, borderColor: darkColor }
    );

    // Destaque no topo
    renderer.drawRect(
      this._x + 5,
      y + 4,
      this._width - 10,
      3,
      lightColor
    );

    // Olhos
    const eyeY = y + 6;
    renderer.drawRect(this._x + 6, eyeY, 5, 5, COLORS.SNES_WHITE);
    renderer.drawRect(this._x + this._width - 11, eyeY, 5, 5, COLORS.SNES_WHITE);
    renderer.drawRect(this._x + 8, eyeY + 1, 3, 3, COLORS.SNES_BLACK);
    renderer.drawRect(this._x + this._width - 9, eyeY + 1, 3, 3, COLORS.SNES_BLACK);

    // Corpo
    renderer.drawRect(
      this._x + 2,
      y + 12,
      this._width - 4,
      12,
      bodyColor,
      { border: true, borderColor: darkColor }
    );

    // Gravata / detalhe de uniforme
    renderer.drawRect(
      this._x + this._width / 2 - 2,
      y + 14,
      4,
      6,
      darkColor
    );

    // Crachá de segurança
    renderer.drawRect(this._x + 5, y + 16, 5, 4, '#ffffff');
    renderer.drawRect(this._x + 6, y + 17, 3, 2, this._completed ? COLORS.SAFETY_GREEN : COLORS.SAFETY_ORANGE);

    // Nome acima
    renderer.drawText(
      this._name.split(' ')[0],
      this._x + this._width / 2,
      this._y - 10,
      {
        color: COLORS.UI_TEXT,
        font: FONTS.SMALL,
        align: 'center',
        shadow: true
      }
    );

    // Indicador de status: "?" pulsa enquanto o desafio está pendente.
    const pulse = 0.65 + 0.35 * Math.sin(time * 4 + this._phase);
    if (this._completed) {
      renderer.drawRect(this._x + this._width - 2, this._y - 24, 12, 12, COLORS.SAFETY_GREEN_DARK);
      renderer.drawRect(this._x + this._width, this._y - 22, 8, 8, COLORS.SAFETY_GREEN);
      renderer.drawText('✓', this._x + this._width + 4, this._y - 23, {
        color: '#ffffff',
        font: '9px "Courier New", monospace',
        align: 'center',
        shadow: false
      });
    } else {
      renderer.drawRect(this._x + this._width - 2, this._y - 24, 12, 12, COLORS.SAFETY_YELLOW_DARK);
      renderer.drawRect(this._x + this._width, this._y - 22, 8, 8, COLORS.SAFETY_YELLOW);
      renderer.drawText('!', this._x + this._width + 4, this._y - 24, {
        color: '#111111',
        font: '10px "Courier New", monospace',
        align: 'center',
        shadow: false
      });
      renderer.drawText('?', this._x + this._width / 2, this._y - 38, {
        color: `rgba(255, 193, 7, ${pulse})`,
        font: FONTS.SMALL,
        align: 'center',
        shadow: true
      });
    }

    // Selo da NR no ombro
    if (this._norm) {
      renderer.drawRect(this._x + this._width - 10, y + 12, 8, 8, this._color);
      renderer.drawRect(this._x + this._width - 9, y + 13, 6, 6, '#ffffff');
      renderer.drawRect(this._x + this._width - 8, y + 14, 4, 4, this._color);
    }
  }
}
