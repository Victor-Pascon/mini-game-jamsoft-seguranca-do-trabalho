import { Entity } from './Entity.js';
import { Collision } from '../engine/Collision.js';
import { COLORS, FONTS } from '../design-tokens/snes-theme.js';
import { drawOverlay } from './EquipmentRenderer.js';
import { drawPlayerSprite, drawPlayerDecoration } from './CharacterRenderer.js';

/**
 * Jogador - colaborador da JAMSOFT que conquista EPIs ao longo da jornada.
 * O sprite é o mesmo estilo SNES do projeto original; os equipamentos são
 * desenhados em camadas por EquipmentRenderer.
 */
export class Player extends Entity {
  constructor(options = {}) {
    super({
      x: options.x ?? 100,
      y: options.y ?? 100,
      width: 24,
      height: 24,
      speed: options.speed ?? 150,
      color: options.color ?? COLORS.SNES_YELLOW,
      ...options
    });

    this._direction = 'down';
    this._isMoving = false;
    this._animTimer = 0;
    this._animFrame = 0;
    this._animSpeed = 0.12;
    this._equipment = new Set();
    this._flashTimer = 0;
    this._flashId = null;
    this._labelTimer = 0;
    this._decoration = 'pin_jamsoft';
  }

  get direction() { return this._direction; }
  get equipment() { return this._equipment; }
  get decoration() { return this._decoration; }

  setDecoration(id) {
    this._decoration = id || null;
  }

  setEquipment(ids) {
    this._equipment = new Set(Array.isArray(ids) ? ids : []);
  }

  equip(id) {
    this._equipment.add(id);
  }

  hasEquipment(id) {
    return this._equipment.has(id);
  }

  flashEquipment(id) {
    this._flashId = id;
    this._flashTimer = 1.8;
  }

  update(deltaTime, input, map) {
    const direction = input.getDirection();

    if (direction.x !== 0 || direction.y !== 0) {
      this._isMoving = true;

      const dx = direction.x * this._speed * deltaTime;
      const dy = direction.y * this._speed * deltaTime;

      const oldX = this._x;
      const oldY = this._y;

      this._x += dx;
      if (map && Collision.checkMapCollision(this, map)) {
        this._x = oldX;
      }

      this._y += dy;
      if (map && Collision.checkMapCollision(this, map)) {
        this._y = oldY;
      }

      // Fallback para posições que eventualmente comecem sobre um tile sólido.
      if (map) {
        Collision.resolveMapCollision(this, map);
      }

      if (Math.abs(direction.y) > Math.abs(direction.x)) {
        this._direction = direction.y < 0 ? 'up' : 'down';
      } else {
        this._direction = direction.x < 0 ? 'left' : 'right';
      }

      this._animTimer += deltaTime;
      if (this._animTimer >= this._animSpeed) {
        this._animTimer = 0;
        this._animFrame = (this._animFrame + 1) % 4;
      }
    } else {
      this._isMoving = false;
      this._animFrame = 0;
    }

    if (this._flashTimer > 0) {
      this._flashTimer = Math.max(0, this._flashTimer - deltaTime);
    }
    this._labelTimer += deltaTime;
  }

  render(renderer) {
    if (!this._visible) return;

    const time = this._labelTimer;
    const bounce = this._isMoving ? Math.sin((this._animFrame / 4) * Math.PI * 2) * 1 : 0;

    // Aura dourada quando todos os EPIs foram conquistados.
    if (this._equipment.size >= 10) {
      renderer.drawGlow(
        this._x + this._width / 2,
        this._y + 8,
        38,
        '#ffd700',
        0.16
      );
    }

    drawPlayerSprite(renderer, this._x, this._y, {
      direction: this._direction,
      moving: this._isMoving,
      frame: this._animFrame,
      time
    });

    // Camadas de EPI
    drawOverlay(
      renderer,
      this,
      this._equipment,
      bounce,
      this._flashTimer > 0 ? this._flashTimer / 1.8 : 0
    );

    drawPlayerDecoration(renderer, this, this._decoration, bounce);

    // Indicador de "VOCÊ" acima do sprite, com plaquinha para não sumir no cenário.
    const labelY = this._y - 27 + Math.sin(time * 3) * 1.5;
    renderer.drawRect(this._x + this._width / 2 - 20, labelY - 1, 40, 11, 'rgba(4, 9, 15, 0.70)');
    renderer.drawRect(this._x + this._width / 2 - 20, labelY - 1, 40, 1, 'rgba(255, 255, 255, 0.20)');
    renderer.drawText('VOCÊ', this._x + this._width / 2, labelY + 1, {
      color: '#ffffff',
      font: FONTS.TINY,
      align: 'center',
      shadow: true
    });
    renderer.drawRect(this._x + this._width / 2 - 2, labelY + 12, 4, 3, '#ffffff');
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

  getSaveData() {
    return {
      x: this._x,
      y: this._y,
      direction: this._direction,
      decoration: this._decoration
    };
  }

  loadFromData(data) {
    if (!data) return;
    this._x = data.x ?? this._x;
    this._y = data.y ?? this._y;
    this._direction = data.direction || 'down';
    if (Object.prototype.hasOwnProperty.call(data, 'decoration')) {
      this._decoration = data.decoration || null;
    }
  }
}
