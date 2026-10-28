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
      this.drawRect(x + 5, y + 5, width, height, 'rgba(0, 0, 0, 0.48)');
    }
    this.drawRect(x, y, width, height, border);
    this.drawRect(x + 2, y + 2, width - 4, height - 4, '#050a10');
    this.drawRect(x + 4, y + 4, width - 8, height - 8, bg);

    // Gradiente sutil para dar profundidade ao painel.
    const ctx = this._ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 4, y + 4, width - 8, height - 8);
    ctx.clip();
    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.075)');
    gradient.addColorStop(0.42, 'rgba(255, 255, 255, 0.012)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.26)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
    ctx.restore();

    if (highlight) {
      this.drawRect(x + 4, y + 4, width - 8, 2, hexToRgba(border, 0.45));
      this.drawRect(x + 4, y + 6, width - 8, 1, 'rgba(255, 255, 255, 0.07)');
    }

    // Cantos metálicos.
    const corner = Math.max(6, Math.min(14, Math.round(width * 0.025)));
    const cornerColor = hexToRgba(border, 0.75);
    this.drawRect(x + 4, y + 4, corner, 1, cornerColor);
    this.drawRect(x + 4, y + 4, 1, corner, cornerColor);
    this.drawRect(x + width - corner - 4, y + 4, corner, 1, cornerColor);
    this.drawRect(x + width - 5, y + 4, 1, corner, cornerColor);
    this.drawRect(x + 4, y + height - 5, corner, 1, cornerColor);
    this.drawRect(x + 4, y + height - corner - 4, 1, corner, cornerColor);
    this.drawRect(x + width - corner - 4, y + height - 5, corner, 1, cornerColor);
    this.drawRect(x + width - 5, y + height - corner - 4, 1, corner, cornerColor);
  }

  drawProgressBar(x, y, width, height, value, color = COLORS.SAFETY_GREEN) {
    const clamped = Math.max(0, Math.min(1, value));
    this.drawRect(x, y, width, height, '#000000');
    this.drawRect(x + 1, y + 1, width - 2, height - 2, '#151f2b');
    this.drawRect(x + 1, y + 1, width - 2, 1, 'rgba(255, 255, 255, 0.08)');
    if (clamped > 0) {
      this.drawRect(x + 1, y + 1, Math.max(2, (width - 2) * clamped), height - 2, color);
      this.drawRect(x + 1, y + 1, Math.max(2, (width - 2) * clamped), 2, shadeColor(color, 35));
      this.drawRect(x + 1, y + height - 3, Math.max(2, (width - 2) * clamped), 1, shadeColor(color, -35));
    }
    // Marcadores internos, como uma barra de energia SNES.
    for (let index = 1; index < 10; index++) {
      this.drawRect(x + Math.floor((width * index) / 10), y + 1, 1, height - 2, 'rgba(0, 0, 0, 0.22)');
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

    if (tileIndex === 1) {
      this._drawWallTile(px, py, size, tileX, tileY, tile.color);
      return;
    }

    this._drawFloorTile(px, py, size, tileX, tileY, tileIndex, tile.color);
  }

  _drawWallTile(px, py, size, tileX, tileY, base) {
    const ctx = this._ctx;
    const variation = hash2d(tileX, tileY, 3);
    const wall = shadeColor(base, -12 + Math.floor(variation * 8));

    ctx.fillStyle = shadeColor(wall, -22);
    ctx.fillRect(px, py, size, size);

    // Capitel iluminado e painel inferior.
    ctx.fillStyle = shadeColor(wall, 22);
    ctx.fillRect(px, py, size, 4);
    ctx.fillStyle = shadeColor(wall, 9);
    ctx.fillRect(px, py + 4, size, 3);
    ctx.fillStyle = shadeColor(wall, -8);
    ctx.fillRect(px, py + 7, size, size - 7);

    // Placas metálicas, com junta alternada.
    ctx.fillStyle = shadeColor(wall, -20);
    ctx.fillRect(px, py + 10, size, 1);
    ctx.fillRect(px, py + 21, size, 1);
    const offset = tileX % 2 === 0 ? 0 : Math.floor(size / 2);
    ctx.fillStyle = shadeColor(wall, -18);
    ctx.fillRect(px + offset, py + 7, 1, size - 7);

    // Brilho ciano discreto, como um painel de sinalização.
    ctx.fillStyle = 'rgba(100, 181, 246, 0.18)';
    ctx.fillRect(px + 3, py + 8, size - 6, 1);

    // Rebites.
    ctx.fillStyle = shadeColor(wall, 30);
    ctx.fillRect(px + 3, py + 12, 1, 1);
    ctx.fillRect(px + size - 4, py + 12, 1, 1);
    ctx.fillRect(px + 3, py + 23, 1, 1);
    ctx.fillRect(px + size - 4, py + 23, 1, 1);

    // Sombra na base da parede.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.30)';
    ctx.fillRect(px, py + size - 3, size, 3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(px, py + size - 4, size, 1);
  }

  _drawFloorTile(px, py, size, tileX, tileY, tileIndex, base) {
    const ctx = this._ctx;
    const variation = (hash2d(tileX, tileY, tileIndex + 11) - 0.5) * 8;
    const floor = shadeColor(base, variation);

    ctx.fillStyle = floor;
    ctx.fillRect(px, py, size, size);

    // Bevel geral do piso.
    ctx.fillStyle = shadeColor(floor, 12);
    ctx.fillRect(px, py, size, 1);
    ctx.fillRect(px, py, 1, size);
    ctx.fillStyle = shadeColor(floor, -20);
    ctx.fillRect(px, py + size - 1, size, 1);
    ctx.fillRect(px + size - 1, py, 1, size);

    // Placas internas de 16 px deixam o chão mais rico sem ruído.
    const half = size / 2;
    ctx.fillStyle = shadeColor(floor, -12);
    ctx.fillRect(px, py + half - 1, size, 1);
    ctx.fillRect(px + half - 1, py, 1, size);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.fillRect(px + 1, py + 1, size - 2, 1);

    // Padrões específicos por setor.
    switch (tileIndex) {
      case 2: // EPI: piso de concreto com pontos de atrito.
        ctx.fillStyle = shadeColor(floor, -14);
        ctx.fillRect(px + 4, py + 4, 2, 2);
        ctx.fillRect(px + size - 8, py + 10, 2, 2);
        ctx.fillRect(px + 9, py + size - 9, 2, 2);
        break;

      case 3: // PGR: carpete azul com trama fina.
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let i = 4; i < size; i += 5) {
          ctx.fillRect(px + i, py + 3, 1, size - 6);
          ctx.fillRect(px + 3, py + i, size - 6, 1);
        }
        break;

      case 4: // Elétrica: piso metálico com faixa de advertência.
        ctx.fillStyle = shadeColor(floor, -18);
        ctx.fillRect(px + 2, py + 2, half - 4, half - 4);
        ctx.fillRect(px + half + 2, py + half + 2, half - 4, half - 4);
        if (hash2d(tileX, tileY, 7) > 0.55) {
          ctx.fillStyle = 'rgba(255, 193, 7, 0.34)';
          ctx.fillRect(px + 2, py + size - 5, size - 4, 2);
        }
        break;

      case 5: // Logística: tábuas e marcas de carga.
        ctx.fillStyle = shadeColor(floor, -18);
        ctx.fillRect(px, py + 8, size, 1);
        ctx.fillRect(px, py + 22, size, 1);
        ctx.fillStyle = shadeColor(floor, 9);
        ctx.fillRect(px + 3, py + 3, size - 6, 1);
        break;

      case 6: // Ruído: painel acústico.
        ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
        for (let gy = 5; gy < size; gy += 6) {
          for (let gx = 5; gx < size; gx += 6) {
            ctx.fillRect(px + gx, py + gy, 2, 2);
          }
        }
        break;

      case 7: // Máquinas: chapa xadrez.
      case 9: // Brigada: piso industrial avermelhado.
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        for (let i = 4; i < size; i += 8) {
          ctx.fillRect(px + i, py + 3, 3, 1);
          ctx.fillRect(px + 3, py + i, 1, 3);
        }
        ctx.fillStyle = shadeColor(floor, -18);
        ctx.fillRect(px + 4, py + 4, 1, 1);
        ctx.fillRect(px + size - 5, py + size - 5, 1, 1);
        break;

      case 8: // Ergonomia: piso de madeira clara.
      case 13: // Auditório: palco de madeira.
        ctx.fillStyle = shadeColor(floor, -18);
        ctx.fillRect(px, py + 9, size, 1);
        ctx.fillRect(px, py + 20, size, 1);
        ctx.fillStyle = shadeColor(floor, 14);
        ctx.fillRect(px + 5, py + 4, size - 10, 1);
        ctx.fillRect(px + 9, py + 15, size - 14, 1);
        break;

      case 10: // Sinalização: piso teal com chevrons.
        ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
        ctx.fillRect(px + 5, py + 10, 8, 2);
        ctx.fillRect(px + 9, py + 7, 2, 8);
        ctx.fillStyle = shadeColor(floor, -16);
        ctx.fillRect(px, py + size - 5, size, 2);
        break;

      case 11: // Altura: grade de aço.
        ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
        for (let i = 4; i < size; i += 6) {
          ctx.fillRect(px + i, py + 2, 1, size - 4);
          ctx.fillRect(px + 2, py + i, size - 4, 1);
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(px + 2, py + 2, size - 4, 1);
        break;

      case 12: // Mural: carpete com fibras coloridas.
        ctx.fillStyle = 'rgba(236, 64, 122, 0.16)';
        ctx.fillRect(px + 5, py + 6, 2, 1);
        ctx.fillRect(px + size - 10, py + 12, 2, 1);
        ctx.fillRect(px + 12, py + size - 10, 2, 1);
        break;

      case 14: // Porta: soleira metálica.
        ctx.fillStyle = shadeColor(floor, -35);
        ctx.fillRect(px, py + 2, size, 3);
        ctx.fillRect(px, py + size - 5, size, 3);
        ctx.fillStyle = 'rgba(255, 193, 7, 0.55)';
        ctx.fillRect(px + 2, py + 2, size - 4, 1);
        ctx.fillRect(px + 2, py + size - 4, size - 4, 1);
        break;

      default:
        // Hall: piso polido com reflexos.
        ctx.fillStyle = 'rgba(120, 181, 255, 0.055)';
        ctx.fillRect(px + 4, py + 4, size - 8, 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(px + 3, py + size - 7, size - 6, 2);
        break;
    }

    // Sujeira/speckles determinísticos.
    for (let index = 0; index < 3; index++) {
      const hx = hash2d(tileX, tileY, index * 23 + tileIndex);
      const hy = hash2d(tileX, tileY, index * 41 + tileIndex + 5);
      ctx.fillStyle = shadeColor(floor, hx > 0.5 ? 16 : -22);
      ctx.fillRect(
        px + 3 + Math.floor(hx * (size - 6)),
        py + 3 + Math.floor(hy * (size - 6)),
        1,
        1
      );
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
