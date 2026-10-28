import { COLORS, FONTS, shadeColor, hexToRgba, hash2d } from '../design-tokens/snes-theme.js';

/**
 * Renderer - toda a renderização é feita em canvas 640x480.
 * Mantém o estilo SNES do projeto original, com texturas determinísticas,
 * scanlines, vinheta e painéis com bordas 3D.
 */
export class Renderer {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;
    this._pixelSize = 2;
    this._scanlineOffset = 0;
    this._ctx.imageSmoothingEnabled = false;
  }

  clear(color = COLORS.SNES_DARK) {
    this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, this._width, this._height);
  }

  drawScanlines() {
    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
    for (let y = 0; y < this._height; y += 4) {
      this._ctx.fillRect(0, y, this._width, 2);
    }
  }

  drawVignette() {
    const gradient = this._ctx.createRadialGradient(
      this._width / 2, this._height / 2, this._width * 0.30,
      this._width / 2, this._height / 2, this._width * 0.72
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
    this._ctx.fillStyle = gradient;
    this._ctx.fillRect(0, 0, this._width, this._height);
  }

  drawRect(x, y, width, height, color, options = {}) {
    const {
      border = false,
      borderColor = null,
      shadow = false,
      pixelated = false
    } = options;

    if (pixelated) {
      this._drawPixelatedRect(x, y, width, height, color);
    } else {
      this._ctx.fillStyle = color;
      this._ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
    }

    if (shadow) {
      this._ctx.fillStyle = COLORS.SHADOW;
      this._ctx.fillRect(Math.floor(x) + 3, Math.floor(y) + height, width, 3);
    }

    if (border) {
      this._ctx.strokeStyle = borderColor || shadeColor(color, 40);
      this._ctx.lineWidth = 2;
      this._ctx.strokeRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
    }
  }

  _drawPixelatedRect(x, y, width, height, color) {
    const pixelSize = this._pixelSize;
    this._ctx.fillStyle = color;

    for (let px = 0; px < width; px += pixelSize) {
      for (let py = 0; py < height; py += pixelSize) {
        const variation = (Math.random() - 0.5) * 0.1;
        this._ctx.globalAlpha = 1 + variation;
        this._ctx.fillRect(
          Math.floor(x + px),
          Math.floor(y + py),
          pixelSize,
          pixelSize
        );
      }
    }
    this._ctx.globalAlpha = 1;
  }

  /**
   * Painel no estilo SNES, com borda externa, sombra e brilho interno.
   */
  drawPanel(x, y, width, height, options = {}) {
    const {
      bg = COLORS.UI_BG_SOFT,
      border = COLORS.UI_BORDER,
      shadow = true,
      highlight = true
    } = options;

    if (shadow) {
      this.drawRect(x + 4, y + 4, width, height, 'rgba(0, 0, 0, 0.45)');
    }
    this.drawRect(x, y, width, height, border);
    this.drawRect(x + 2, y + 2, width - 4, height - 4, '#000000');
    this.drawRect(x + 4, y + 4, width - 8, height - 8, bg);

    if (highlight) {
      this.drawRect(x + 4, y + 4, width - 8, 2, hexToRgba(border, 0.35));
    }
  }

  drawProgressBar(x, y, width, height, value, color = COLORS.SAFETY_GREEN) {
    const clamped = Math.max(0, Math.min(1, value));
    this.drawRect(x, y, width, height, '#000000');
    this.drawRect(x + 1, y + 1, width - 2, height - 2, '#1f2933');
    if (clamped > 0) {
      this.drawRect(x + 1, y + 1, Math.max(2, (width - 2) * clamped), height - 2, color);
      this.drawRect(x + 1, y + 1, Math.max(2, (width - 2) * clamped), 2, shadeColor(color, 35));
    }
  }

  drawHazardStripes(x, y, width, height, colorA = COLORS.SAFETY_YELLOW, colorB = COLORS.SAFETY_BLACK, stripe = 10) {
    const ctx = this._ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.fillStyle = colorA;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = colorB;
    const step = stripe * 2;
    for (let i = -height; i < width + height; i += step) {
      ctx.beginPath();
      ctx.moveTo(x + i, y + height);
      ctx.lineTo(x + i + stripe, y + height);
      ctx.lineTo(x + i + stripe + height, y);
      ctx.lineTo(x + i + height, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawSprite(sprite, x, y, width, height) {
    if (!sprite || !sprite.image) return;

    const frameX = sprite.frameX !== undefined ? sprite.frameX * sprite.frameWidth : 0;
    const frameY = sprite.frameY !== undefined ? sprite.frameY * sprite.frameHeight : 0;

    this._ctx.imageSmoothingEnabled = false;
    this._ctx.drawImage(
      sprite.image,
      frameX, frameY,
      sprite.frameWidth, sprite.frameHeight,
      Math.floor(x), Math.floor(y),
      width || sprite.frameWidth,
      height || sprite.frameHeight
    );
    this._ctx.imageSmoothingEnabled = false;
  }

  drawText(text, x, y, options = {}) {
    const {
      color = COLORS.UI_TEXT,
      font = FONTS.PRIMARY,
      align = 'left',
      baseline = 'top',
      maxWidth = null,
      shadow = true,
      glow = false
    } = options;

    this._ctx.font = font;
    this._ctx.textAlign = align;
    this._ctx.textBaseline = baseline;

    if (shadow) {
      this._ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      if (maxWidth) {
        this._ctx.fillText(text, x + 1, y + 1, maxWidth);
      } else {
        this._ctx.fillText(text, x + 1, y + 1);
      }
    }

    if (glow) {
      this._ctx.shadowColor = color;
      this._ctx.shadowBlur = 8;
    }

    this._ctx.fillStyle = color;
    if (maxWidth) {
      this._ctx.fillText(text, x, y, maxWidth);
    } else {
      this._ctx.fillText(text, x, y);
    }

    this._ctx.shadowBlur = 0;
    this._ctx.shadowColor = 'transparent';
  }

  drawTile(tile, tileX, tileY, size, tileIndex = 0) {
    if (!tile) return;

    const px = tileX * size;
    const py = tileY * size;
    const base = tile.color;

    this._ctx.fillStyle = base;
    this._ctx.fillRect(px, py, size, size);

    if (tileIndex === 1) {
      // Parede de alvenaria azul, com juntas estáveis.
      this._ctx.fillStyle = shadeColor(base, 16);
      this._ctx.fillRect(px, py, size, 2);
      this._ctx.fillStyle = shadeColor(base, -24);
      this._ctx.fillRect(px, py + size - 2, size, 2);

      this._ctx.fillStyle = shadeColor(base, -18);
      this._ctx.fillRect(px, py + Math.floor(size / 2) - 1, size, 1);
      const offset = (tileY % 2 === 0) ? 0 : Math.floor(size / 2);
      this._ctx.fillRect(px + offset, py, 1, size);
      return;
    }

    // Piso: brilho superior, sombra inferior e detalhes determinísticos.
    this._ctx.fillStyle = shadeColor(base, 12);
    this._ctx.fillRect(px, py, size, 2);
    this._ctx.fillStyle = shadeColor(base, -18);
    this._ctx.fillRect(px, py + size - 2, size, 2);

    const detailCount = 2;
    for (let i = 0; i < detailCount; i++) {
      const hx = hash2d(tileX, tileY, i * 17 + tileIndex);
      const hy = hash2d(tileX, tileY, i * 31 + tileIndex + 7);
      const dx = Math.floor(hx * (size - 4)) + 2;
      const dy = Math.floor(hy * (size - 4)) + 2;
      this._ctx.fillStyle = shadeColor(base, hx > 0.5 ? 22 : -22);
      this._ctx.fillRect(px + dx, py + dy, 2, 2);
    }

    if (tileIndex === 14) {
      // Porta: maçaneta e batente.
      this._ctx.fillStyle = shadeColor(base, 24);
      this._ctx.fillRect(px + 4, py + 4, size - 8, 2);
      this._ctx.fillStyle = COLORS.SAFETY_YELLOW;
      this._ctx.fillRect(px + size - 9, py + size / 2 - 2, 3, 3);
    }
  }

  drawMap(map, tileSize) {
    if (!map || !map.tiles) return;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tileIndex = map.tiles[y * map.width + x];
        const tile = map.tileTypes[tileIndex];
        if (tile) {
          this.drawTile(tile, x, y, tileSize, tileIndex);
        }
      }
    }
  }

  drawCharacter(x, y, width, height, color, options = {}) {
    const {
      direction = 'down',
      isMoving = false,
      frame = 0,
      name = ''
    } = options;

    const bounce = isMoving ? Math.sin(frame * 0.5) * 2 : 0;
    const drawY = y + bounce;

    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this._ctx.beginPath();
    this._ctx.ellipse(
      x + width / 2,
      y + height + 2,
      width / 2 - 2,
      3,
      0, 0, Math.PI * 2
    );
    this._ctx.fill();

    const bodyColor = color;
    const lightColor = shadeColor(color, 40);
    const darkColor = shadeColor(color, -40);

    this._ctx.fillStyle = bodyColor;
    this._ctx.fillRect(x + 4, drawY + 2, width - 8, height / 2 - 2);
    this._ctx.fillStyle = lightColor;
    this._ctx.fillRect(x + 6, drawY + 4, width - 12, 3);

    const eyeY = drawY + 8;
    this._ctx.fillStyle = COLORS.SNES_WHITE;
    let eyeOffsetX = 0;
    if (direction === 'left') eyeOffsetX = -2;
    if (direction === 'right') eyeOffsetX = 2;
    this._ctx.fillRect(x + 8 + eyeOffsetX, eyeY, 4, 4);
    this._ctx.fillRect(x + width - 12 + eyeOffsetX, eyeY, 4, 4);

    this._ctx.fillStyle = COLORS.SNES_BLACK;
    this._ctx.fillRect(x + 10 + eyeOffsetX, eyeY + 1, 2, 2);
    this._ctx.fillRect(x + width - 10 + eyeOffsetX, eyeY + 1, 2, 2);

    this._ctx.fillStyle = bodyColor;
    this._ctx.fillRect(x + 2, drawY + height / 2, width - 4, height / 2 - 2);
    this._ctx.fillStyle = darkColor;
    this._ctx.fillRect(x + 6, drawY + height / 2 + 4, width - 12, 2);

    if (name) {
      this.drawText(name, x + width / 2, drawY - 12, {
        color: COLORS.UI_TEXT,
        font: FONTS.SMALL,
        align: 'center',
        shadow: true
      });
    }
  }

  drawParticles(particles, opacity = 1) {
    particles.forEach((p) => {
      const life = p.life === undefined ? 1 : p.life;
      const alpha = Math.min(1, Math.max(0, life)) * opacity;
      this._ctx.globalAlpha = alpha;
      this._ctx.fillStyle = p.color;
      this._ctx.fillRect(
        Math.floor(p.x),
        Math.floor(p.y),
        Math.ceil(p.size),
        Math.ceil(p.size)
      );
    });
    this._ctx.globalAlpha = 1;
  }

  drawGlow(x, y, radius, color, intensity = 0.3) {
    const gradient = this._ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, hexToRgba(color, intensity));
    gradient.addColorStop(1, hexToRgba(color, 0));
    this._ctx.fillStyle = gradient;
    this._ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  drawFade(alpha) {
    this._ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    this._ctx.fillRect(0, 0, this._width, this._height);
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get context() {
    return this._ctx;
  }
}
