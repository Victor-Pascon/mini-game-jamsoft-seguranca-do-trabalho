import { COLORS, shadeColor } from '../design-tokens/snes-theme.js';
import { EQUIPMENT_BY_ID } from '../data/equipment.js';

/**
 * EquipmentRenderer - desenha os EPIs procedimentalmente.
 *
 * Há duas saídas:
 *  1. drawOverlay(): camadas aplicadas ao sprite 24x24 do jogador.
 *  2. drawIcon()/drawIconSlot(): ícones usados no HUD, desafio e certificado.
 *
 * Não há imagens externas: todo o pixel art é feito com retângulos no canvas,
 * mantendo a mesma linguagem visual do mini-game original da JAMSOFT.
 */

const GRID = 20;

function r(renderer, x, y, size, gx, gy, gw, gh, color) {
  const scale = size / GRID;
  renderer.drawRect(
    x + gx * scale,
    y + gy * scale,
    Math.max(1, gw * scale),
    Math.max(1, gh * scale),
    color
  );
}

function colorOf(id, key = 'color', fallback = COLORS.SAFETY_YELLOW) {
  return EQUIPMENT_BY_ID[id]?.[key] || fallback;
}

/**
 * Desenha um ícone de equipamento em uma grade 20x20, escalada para `size`.
 */
export function drawIcon(renderer, id, x, y, size = 24) {
  const main = colorOf(id, 'color');
  const light = colorOf(id, 'accent', shadeColor(main, 35));
  const dark = shadeColor(main, -35);

  switch (id) {
    case 'capacete':
      r(renderer, x, y, size, 4, 6, 12, 7, main);
      r(renderer, x, y, size, 6, 4, 8, 3, main);
      r(renderer, x, y, size, 7, 4, 6, 1, light);
      r(renderer, x, y, size, 2, 12, 16, 3, dark);
      r(renderer, x, y, size, 2, 12, 16, 1, main);
      r(renderer, x, y, size, 9, 4, 2, 8, '#ffffff');
      r(renderer, x, y, size, 9, 7, 2, 2, COLORS.SAFETY_ORANGE);
      break;

    case 'oculos':
      r(renderer, x, y, size, 1, 8, 18, 2, '#263238');
      r(renderer, x, y, size, 3, 6, 14, 8, '#263238');
      r(renderer, x, y, size, 4, 7, 5, 5, main);
      r(renderer, x, y, size, 11, 7, 5, 5, main);
      r(renderer, x, y, size, 5, 8, 2, 2, '#ffffff');
      r(renderer, x, y, size, 12, 8, 2, 2, '#ffffff');
      r(renderer, x, y, size, 9, 9, 2, 2, '#263238');
      r(renderer, x, y, size, 1, 8, 2, 5, '#263238');
      r(renderer, x, y, size, 17, 8, 2, 5, '#263238');
      break;

    case 'protetor':
      r(renderer, x, y, size, 3, 3, 14, 2, '#263238');
      r(renderer, x, y, size, 3, 3, 2, 8, '#263238');
      r(renderer, x, y, size, 15, 3, 2, 8, '#263238');
      r(renderer, x, y, size, 1, 8, 5, 8, main);
      r(renderer, x, y, size, 14, 8, 5, 8, main);
      r(renderer, x, y, size, 2, 9, 2, 5, light);
      r(renderer, x, y, size, 15, 9, 2, 5, light);
      break;

    case 'mascara':
      r(renderer, x, y, size, 1, 8, 3, 2, '#37474f');
      r(renderer, x, y, size, 16, 8, 3, 2, '#37474f');
      r(renderer, x, y, size, 4, 6, 12, 10, main);
      r(renderer, x, y, size, 5, 5, 10, 2, '#ffffff');
      r(renderer, x, y, size, 6, 9, 8, 4, '#546e7a');
      r(renderer, x, y, size, 7, 10, 3, 2, light);
      r(renderer, x, y, size, 8, 14, 4, 1, '#ffffff');
      break;

    case 'luvas':
      r(renderer, x, y, size, 3, 6, 6, 9, main);
      r(renderer, x, y, size, 11, 6, 6, 9, main);
      r(renderer, x, y, size, 3, 4, 2, 4, main);
      r(renderer, x, y, size, 5, 4, 2, 3, main);
      r(renderer, x, y, size, 13, 4, 2, 3, main);
      r(renderer, x, y, size, 15, 4, 2, 4, main);
      r(renderer, x, y, size, 3, 14, 6, 3, COLORS.SAFETY_YELLOW);
      r(renderer, x, y, size, 11, 14, 6, 3, COLORS.SAFETY_YELLOW);
      r(renderer, x, y, size, 4, 8, 2, 4, light);
      r(renderer, x, y, size, 12, 8, 2, 4, light);
      break;

    case 'colete':
      r(renderer, x, y, size, 4, 3, 12, 14, main);
      r(renderer, x, y, size, 3, 3, 4, 3, main);
      r(renderer, x, y, size, 13, 3, 4, 3, main);
      r(renderer, x, y, size, 8, 3, 4, 3, '#1b2430');
      r(renderer, x, y, size, 4, 7, 12, 2, COLORS.SAFETY_WHITE);
      r(renderer, x, y, size, 4, 12, 12, 2, COLORS.SAFETY_WHITE);
      r(renderer, x, y, size, 4, 16, 12, 2, dark);
      break;

    case 'cinto':
      r(renderer, x, y, size, 6, 3, 2, 14, '#263238');
      r(renderer, x, y, size, 12, 3, 2, 14, '#263238');
      r(renderer, x, y, size, 6, 8, 8, 2, '#263238');
      r(renderer, x, y, size, 8, 8, 4, 3, COLORS.SAFETY_YELLOW);
      r(renderer, x, y, size, 4, 16, 4, 2, '#263238');
      r(renderer, x, y, size, 12, 16, 4, 2, '#263238');
      r(renderer, x, y, size, 4, 3, 4, 2, '#263238');
      r(renderer, x, y, size, 12, 3, 4, 2, '#263238');
      break;

    case 'botas':
      r(renderer, x, y, size, 3, 7, 6, 8, main);
      r(renderer, x, y, size, 11, 7, 6, 8, main);
      r(renderer, x, y, size, 2, 15, 8, 3, '#263238');
      r(renderer, x, y, size, 10, 15, 8, 3, '#263238');
      r(renderer, x, y, size, 3, 12, 6, 3, '#90a4ae');
      r(renderer, x, y, size, 11, 12, 6, 3, '#90a4ae');
      r(renderer, x, y, size, 4, 8, 4, 1, light);
      r(renderer, x, y, size, 12, 8, 4, 1, light);
      break;

    case 'prancheta':
      r(renderer, x, y, size, 4, 4, 12, 14, main);
      r(renderer, x, y, size, 6, 6, 8, 10, '#ffffff');
      r(renderer, x, y, size, 8, 2, 4, 3, '#90a4ae');
      r(renderer, x, y, size, 7, 9, 6, 1, '#1565c0');
      r(renderer, x, y, size, 7, 12, 6, 1, '#1565c0');
      r(renderer, x, y, size, 7, 14, 4, 1, '#1565c0');
      r(renderer, x, y, size, 4, 4, 2, 2, dark);
      break;

    case 'cadeira':
      r(renderer, x, y, size, 5, 2, 10, 8, main);
      r(renderer, x, y, size, 6, 3, 8, 2, light);
      r(renderer, x, y, size, 3, 10, 2, 4, dark);
      r(renderer, x, y, size, 15, 10, 2, 4, dark);
      r(renderer, x, y, size, 5, 10, 10, 4, main);
      r(renderer, x, y, size, 9, 14, 2, 3, '#455a64');
      r(renderer, x, y, size, 5, 17, 10, 2, '#263238');
      r(renderer, x, y, size, 4, 18, 3, 2, '#111111');
      r(renderer, x, y, size, 13, 18, 3, 2, '#111111');
      break;

    default: {
      r(renderer, x, y, size, 4, 4, 12, 12, '#546e7a');
      const fontSize = Math.max(10, Math.floor(size * 0.55));
      renderer.drawText('?', x + size / 2, y + size / 2 - fontSize / 2, {
        color: '#ffffff',
        font: `${fontSize}px "Courier New", monospace`,
        align: 'center',
        shadow: false
      });
      break;
    }
  }
}

function drawLock(renderer, x, y, size) {
  const gray = '#78909c';
  renderer.drawRect(x + size * 0.38, y + size * 0.36, size * 0.24, size * 0.07, gray);
  renderer.drawRect(x + size * 0.38, y + size * 0.40, size * 0.06, size * 0.12, gray);
  renderer.drawRect(x + size * 0.56, y + size * 0.40, size * 0.06, size * 0.12, gray);
  renderer.drawRect(x + size * 0.34, y + size * 0.50, size * 0.32, size * 0.25, gray);
  renderer.drawRect(x + size * 0.48, y + size * 0.57, size * 0.04, size * 0.09, '#263238');
}

/**
 * Slot de EPI no HUD. Mostra o ícone quando desbloqueado e um cadeado
 * quando ainda está bloqueado.
 */
export function drawIconSlot(renderer, id, x, y, size = 24, unlocked = false, options = {}) {
  const { selected = false, pulse = 0 } = options;
  const itemColor = colorOf(id, 'color', COLORS.SAFETY_YELLOW);

  renderer.drawRect(x, y, size, size, selected ? COLORS.SAFETY_YELLOW : '#080d14');
  renderer.drawRect(x + 2, y + 2, size - 4, size - 4, unlocked ? '#172331' : '#101720');

  if (unlocked) {
    drawIcon(renderer, id, x + 2, y + 2, size - 4);
    renderer.drawRect(x + size - 7, y + size - 7, 5, 5, COLORS.SAFETY_GREEN);
    renderer.drawRect(x + size - 6, y + size - 6, 3, 3, '#ffffff');
  } else {
    drawLock(renderer, x, y, size);
  }

  const border = unlocked ? itemColor : '#2f3b4a';
  const glow = unlocked && pulse > 0
    ? `rgba(255, 193, 7, ${0.35 + pulse * 0.35})`
    : border;

  renderer.drawRect(x, y, size, 2, glow);
  renderer.drawRect(x, y + size - 2, size, 2, glow);
  renderer.drawRect(x, y, 2, size, glow);
  renderer.drawRect(x + size - 2, y, 2, size, glow);
}

/**
 * Desenha todas as camadas de EPI sobre o jogador.
 * A ordem importa: colete/harness, cabeça, olhos, rosto, mãos, pés e item de mão.
 */
export function drawOverlay(renderer, player, equipmentSet, bounce = 0, flash = 0) {
  const has = (id) => {
    if (!equipmentSet) return false;
    return typeof equipmentSet.has === 'function'
      ? equipmentSet.has(id)
      : Array.isArray(equipmentSet) && equipmentSet.includes(id);
  };

  const x = player.x;
  const top = player.y + bounce - 6;
  const w = player.width;
  const h = 30;

  // Colete refletivo
  if (has('colete')) {
    const vest = colorOf('colete', 'color', '#ff8f00');
    const vestLight = colorOf('colete', 'accent', '#ffe082');
    renderer.drawRect(x + 3, top + 12, w - 6, 12, shadeColor(vest, -35));
    renderer.drawRect(x + 4, top + 13, w - 8, 10, vest);
    renderer.drawRect(x + 4, top + 13, 2, 10, vestLight);
    renderer.drawRect(x + 4, top + 15, w - 8, 2, COLORS.SAFETY_WHITE);
    renderer.drawRect(x + 4, top + 19, w - 8, 2, COLORS.SAFETY_WHITE);
    renderer.drawRect(x + 5, top + 16, w - 10, 1, 'rgba(255, 255, 255, 0.35)');
    renderer.drawRect(x + 10, top + 16, 5, 4, '#1b2430');
    renderer.drawRect(x + 11, top + 17, 3, 2, COLORS.SAFETY_ORANGE);
    renderer.drawRect(x + 3, top + 22, w - 6, 2, shadeColor(vest, -45));
  }

  // Cinto de segurança / harness
  if (has('cinto')) {
    const strap = '#263238';
    const strapLight = '#455a64';
    renderer.drawRect(x + 6, top + 12, 3, 12, strap);
    renderer.drawRect(x + 15, top + 12, 3, 12, strap);
    renderer.drawRect(x + 7, top + 13, 1, 9, strapLight);
    renderer.drawRect(x + 16, top + 13, 1, 9, strapLight);
    renderer.drawRect(x + 6, top + 16, 12, 3, strap);
    renderer.drawRect(x + 9, top + 16, 4, 4, COLORS.SAFETY_YELLOW);
    renderer.drawRect(x + 10, top + 17, 2, 2, '#263238');
    renderer.drawRect(x + 4, top + 22, 5, 3, strap);
    renderer.drawRect(x + 15, top + 22, 5, 3, strap);
    renderer.drawRect(x + 5, top + 22, 3, 1, strapLight);
    renderer.drawRect(x + 16, top + 22, 3, 1, strapLight);
  }

  // Capacete
  if (has('capacete')) {
    const helmet = colorOf('capacete', 'color', '#ffc107');
    const helmetLight = colorOf('capacete', 'accent', '#ffe082');
    const helmetDark = shadeColor(helmet, -32);
    renderer.drawRect(x + 4, top - 1, 16, 7, helmetDark);
    renderer.drawRect(x + 5, top - 2, 14, 6, helmet);
    renderer.drawRect(x + 7, top - 1, 10, 2, helmetLight);
    renderer.drawRect(x + 2, top + 4, 20, 3, helmetDark);
    renderer.drawRect(x + 3, top + 4, 18, 1, helmet);
    renderer.drawRect(x + 10, top - 2, 4, 6, '#ffffff');
    renderer.drawRect(x + 11, top - 1, 2, 4, COLORS.SAFETY_ORANGE);
    renderer.drawRect(x + 5, top + 5, 2, 2, '#263238');
    renderer.drawRect(x + 17, top + 5, 2, 2, '#263238');
    renderer.drawRect(x + 4, top - 1, 1, 3, 'rgba(255, 255, 255, 0.45)');
  }

  // Protetor auricular
  if (has('protetor')) {
    const cup = colorOf('protetor', 'color', '#ff7043');
    const cupLight = colorOf('protetor', 'accent', '#ffab91');
    const cupDark = shadeColor(cup, -35);
    renderer.drawRect(x + 3, top + 3, 18, 2, '#263238');
    renderer.drawRect(x + 4, top + 3, 16, 1, '#546e7a');
    renderer.drawRect(x - 2, top + 4, 5, 9, cupDark);
    renderer.drawRect(x + 21, top + 4, 5, 9, cupDark);
    renderer.drawRect(x - 1, top + 5, 4, 7, cup);
    renderer.drawRect(x + 21, top + 5, 4, 7, cup);
    renderer.drawRect(x, top + 6, 2, 4, cupLight);
    renderer.drawRect(x + 22, top + 6, 2, 4, cupLight);
    renderer.drawRect(x - 1, top + 11, 4, 2, cupDark);
    renderer.drawRect(x + 21, top + 11, 4, 2, cupDark);
  }

  // Óculos de proteção
  if (has('oculos')) {
    const lens = colorOf('oculos', 'color', '#4dd0e1');
    const lensLight = colorOf('oculos', 'accent', '#b2ebf2');
    renderer.drawRect(x + 1, top + 6, 2, 5, '#263238');
    renderer.drawRect(x + 21, top + 6, 2, 5, '#263238');
    renderer.drawRect(x + 2, top + 5, 20, 7, '#263238');
    renderer.drawRect(x + 3, top + 6, 8, 5, lens);
    renderer.drawRect(x + 13, top + 6, 8, 5, lens);
    renderer.drawRect(x + 4, top + 6, 6, 2, lensLight);
    renderer.drawRect(x + 14, top + 6, 6, 2, lensLight);
    renderer.drawRect(x + 4, top + 9, 6, 1, shadeColor(lens, -25));
    renderer.drawRect(x + 14, top + 9, 6, 1, shadeColor(lens, -25));
    renderer.drawRect(x + 11, top + 7, 2, 2, '#263238');
    renderer.drawRect(x + 4, top + 6, 2, 1, '#ffffff');
    renderer.drawRect(x + 14, top + 6, 2, 1, '#ffffff');
  }

  // Máscara de fuga / respirador
  if (has('mascara')) {
    const mask = colorOf('mascara', 'color', '#eceff1');
    const filter = colorOf('mascara', 'accent', '#90a4ae');
    renderer.drawRect(x + 3, top + 9, 3, 3, '#37474f');
    renderer.drawRect(x + 18, top + 9, 3, 3, '#37474f');
    renderer.drawRect(x + 6, top + 8, 12, 8, shadeColor(mask, -35));
    renderer.drawRect(x + 7, top + 9, 10, 6, mask);
    renderer.drawRect(x + 8, top + 8, 8, 2, '#ffffff');
    renderer.drawRect(x + 8, top + 11, 8, 3, filter);
    renderer.drawRect(x + 9, top + 11, 4, 1, '#cfd8dc');
    renderer.drawRect(x + 9, top + 14, 6, 1, '#ffffff');
    renderer.drawRect(x + 10, top + 16, 4, 1, '#b0bec5');
  }

  // Luvas
  if (has('luvas')) {
    const glove = colorOf('luvas', 'color', '#3949ab');
    const gloveLight = colorOf('luvas', 'accent', '#9fa8da');
    renderer.drawRect(x - 2, top + 20, 5, 6, shadeColor(glove, -35));
    renderer.drawRect(x + 21, top + 20, 5, 6, shadeColor(glove, -35));
    renderer.drawRect(x - 1, top + 21, 4, 5, glove);
    renderer.drawRect(x + 21, top + 21, 4, 5, glove);
    renderer.drawRect(x - 1, top + 20, 4, 2, COLORS.SAFETY_YELLOW);
    renderer.drawRect(x + 21, top + 20, 4, 2, COLORS.SAFETY_YELLOW);
    renderer.drawRect(x - 1, top + 22, 2, 2, gloveLight);
    renderer.drawRect(x + 22, top + 22, 2, 2, gloveLight);
    renderer.drawRect(x, top + 24, 3, 1, gloveLight);
    renderer.drawRect(x + 21, top + 24, 3, 1, gloveLight);
  }

  // Botas
  if (has('botas')) {
    const boot = colorOf('botas', 'color', '#6d4c41');
    const bootLight = colorOf('botas', 'accent', '#bcaaa4');
    renderer.drawRect(x + 3, top + 26, 8, 5, shadeColor(boot, -35));
    renderer.drawRect(x + 13, top + 26, 8, 5, shadeColor(boot, -35));
    renderer.drawRect(x + 4, top + 26, 6, 4, boot);
    renderer.drawRect(x + 14, top + 26, 6, 4, boot);
    renderer.drawRect(x + 3, top + 30, 8, 2, '#263238');
    renderer.drawRect(x + 13, top + 30, 8, 2, '#263238');
    renderer.drawRect(x + 4, top + 27, 5, 1, bootLight);
    renderer.drawRect(x + 14, top + 27, 5, 1, bootLight);
    renderer.drawRect(x + 5, top + 29, 4, 1, '#263238');
    renderer.drawRect(x + 15, top + 29, 4, 1, '#263238');
  }

  // Prancheta do PGR na mão esquerda
  if (has('prancheta')) {
    const board = colorOf('prancheta', 'color', '#1565c0');
    renderer.drawRect(x - 6, top + 16, 8, 11, shadeColor(board, -35));
    renderer.drawRect(x - 5, top + 17, 7, 10, board);
    renderer.drawRect(x - 4, top + 18, 5, 8, '#ffffff');
    renderer.drawRect(x - 4, top + 16, 5, 2, '#90a4ae');
    renderer.drawRect(x - 3, top + 20, 3, 1, '#1565c0');
    renderer.drawRect(x - 3, top + 22, 3, 1, '#1565c0');
    renderer.drawRect(x - 3, top + 24, 2, 1, '#1565c0');
    renderer.drawRect(x - 4, top + 18, 1, 6, 'rgba(255, 255, 255, 0.40)');
  }

  // Brilho de "novo EPI" ao redor do sprite.
  if (flash > 0) {
    const pulse = 0.5 + 0.5 * Math.sin(flash * Math.PI * 8);
    const alpha = Math.min(1, flash * 1.6) * (0.45 + pulse * 0.4);
    const glow = `rgba(255, 215, 0, ${alpha})`;
    renderer.drawRect(x - 2, top - 4, w + 4, 2, glow);
    renderer.drawRect(x - 2, top + h + 1, w + 4, 2, glow);
    renderer.drawRect(x - 3, top - 2, 2, h + 4, glow);
    renderer.drawRect(x + w + 1, top - 2, 2, h + 4, glow);

    const sparkle = `rgba(255, 255, 255, ${alpha})`;
    const points = [
      [x - 6, top + 2], [x + w + 4, top + 6],
      [x - 4, top + h - 4], [x + w + 2, top + h - 2]
    ];
    for (const [sx, sy] of points) {
      renderer.drawRect(sx, sy, 3, 3, sparkle);
      renderer.drawRect(sx + 1, sy - 2, 1, 7, sparkle);
      renderer.drawRect(sx - 2, sy + 1, 7, 1, sparkle);
    }
  }
}

/**
 * Cadeira do posto de trabalho. Antes do desafio da NR-17 é um banco simples;
 * depois, vira uma cadeira ergonômica com rodízios.
 */
export function drawChair(renderer, x, y, ergonomic = false, width = 20, height = 24) {
  renderer.drawRect(x + 2, y + height - 3, width - 4, 3, 'rgba(0, 0, 0, 0.35)');

  if (ergonomic) {
    const green = '#2e7d32';
    const light = '#a5d6a7';
    renderer.drawRect(x + 4, y, width - 8, 10, green);
    renderer.drawRect(x + 5, y + 1, width - 10, 2, light);
    renderer.drawRect(x + 2, y + 9, 2, 4, '#1b5e20');
    renderer.drawRect(x + width - 4, y + 9, 2, 4, '#1b5e20');
    renderer.drawRect(x + 4, y + 9, width - 8, 4, green);
    renderer.drawRect(x + 9, y + 13, 2, 3, '#455a64');
    renderer.drawRect(x + 5, y + 16, width - 10, 2, '#263238');
    renderer.drawRect(x + 4, y + 17, 3, 3, '#111111');
    renderer.drawRect(x + width - 7, y + 17, 3, 3, '#111111');
    renderer.drawRect(x + 5, y + 10, width - 10, 1, light);
  } else {
    renderer.drawRect(x + 3, y + 8, width - 6, 4, '#8d6e63');
    renderer.drawRect(x + 4, y + 8, width - 8, 1, '#bcaaa4');
    renderer.drawRect(x + 4, y + 12, 2, 8, '#5d4037');
    renderer.drawRect(x + width - 6, y + 12, 2, 8, '#5d4037');
    renderer.drawRect(x + 4, y + 19, width - 8, 2, '#4e342e');
  }
}

export function drawEquipmentPreview(renderer, equipmentSet, x, y, size = 28, gap = 6) {
  const ids = ['capacete', 'oculos', 'protetor', 'mascara', 'luvas', 'colete', 'cinto', 'botas', 'prancheta', 'cadeira'];
  const has = (id) => equipmentSet && (typeof equipmentSet.has === 'function' ? equipmentSet.has(id) : false);
  ids.forEach((id, index) => {
    drawIconSlot(renderer, id, x + index * (size + gap), y, size, has(id));
  });
}
