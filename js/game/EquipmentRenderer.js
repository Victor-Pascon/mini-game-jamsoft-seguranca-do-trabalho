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
  const y = player.y + bounce;
  const w = player.width;
  const h = player.height;

  // Colete refletivo
  if (has('colete')) {
    const vest = colorOf('colete', 'color', '#ff8f00');
    const vestLight = colorOf('colete', 'accent', '#ffe082');
    renderer.drawRect(x + 1, y + 11, w - 2, 11, vest);
    renderer.drawRect(x + 1, y + 13, w - 2, 2, COLORS.SAFETY_WHITE);
    renderer.drawRect(x + 1, y + 17, w - 2, 2, COLORS.SAFETY_WHITE);
    renderer.drawRect(x + 1, y + 21, w - 2, 1, shadeColor(vest, -35));
    renderer.drawRect(x + 8, y + 11, 8, 3, '#1b2430');
    // Pequeno logo JAMSOFT no peito.
    renderer.drawRect(x + 10, y + 14, 4, 4, '#ffffff');
    renderer.drawRect(x + 11, y + 15, 2, 2, COLORS.SAFETY_ORANGE);
  }

  // Cinto de segurança / harness
  if (has('cinto')) {
    const strap = '#263238';
    renderer.drawRect(x + 6, y + 11, 2, 11, strap);
    renderer.drawRect(x + 16, y + 11, 2, 11, strap);
    renderer.drawRect(x + 6, y + 14, 10, 2, strap);
    renderer.drawRect(x + 9, y + 14, 4, 3, COLORS.SAFETY_YELLOW);
    renderer.drawRect(x + 5, y + 20, 5, 2, strap);
    renderer.drawRect(x + 14, y + 20, 5, 2, strap);
  }

  // Capacete
  if (has('capacete')) {
    const helmet = colorOf('capacete', 'color', '#ffc107');
    const helmetLight = colorOf('capacete', 'accent', '#ffe082');
    renderer.drawRect(x + 2, y - 2, 20, 6, helmet);
    renderer.drawRect(x + 4, y - 3, 16, 2, helmetLight);
    renderer.drawRect(x + 0, y + 3, 24, 3, shadeColor(helmet, -25));
    renderer.drawRect(x + 1, y + 3, 22, 1, helmet);
    renderer.drawRect(x + 9, y - 2, 4, 5, '#ffffff');
    renderer.drawRect(x + 10, y - 1, 2, 3, COLORS.SAFETY_ORANGE);
    renderer.drawRect(x + 3, y + 5, 2, 2, '#263238');
    renderer.drawRect(x + 19, y + 5, 2, 2, '#263238');
  }

  // Protetor auricular
  if (has('protetor')) {
    const cup = colorOf('protetor', 'color', '#ff7043');
    const cupLight = colorOf('protetor', 'accent', '#ffab91');
    renderer.drawRect(x + 2, y + 1, 20, 2, '#263238');
    renderer.drawRect(x - 2, y + 3, 5, 8, cup);
    renderer.drawRect(x + 21, y + 3, 5, 8, cup);
    renderer.drawRect(x - 1, y + 4, 2, 5, cupLight);
    renderer.drawRect(x + 22, y + 4, 2, 5, cupLight);
    renderer.drawRect(x - 2, y + 3, 5, 1, shadeColor(cup, -35));
    renderer.drawRect(x + 21, y + 3, 5, 1, shadeColor(cup, -35));
  }

  // Óculos de proteção
  if (has('oculos')) {
    const lens = colorOf('oculos', 'color', '#4dd0e1');
    renderer.drawRect(x + 1, y + 6, 2, 4, '#263238');
    renderer.drawRect(x + 21, y + 6, 2, 4, '#263238');
    renderer.drawRect(x + 3, y + 5, 18, 6, '#263238');
    renderer.drawRect(x + 4, y + 6, 7, 4, lens);
    renderer.drawRect(x + 13, y + 6, 7, 4, lens);
    renderer.drawRect(x + 5, y + 6, 2, 2, '#ffffff');
    renderer.drawRect(x + 14, y + 6, 2, 2, '#ffffff');
    renderer.drawRect(x + 11, y + 7, 2, 2, '#263238');
  }

  // Máscara de fuga / respirador
  if (has('mascara')) {
    const mask = colorOf('mascara', 'color', '#eceff1');
    const filter = colorOf('mascara', 'accent', '#90a4ae');
    renderer.drawRect(x + 3, y + 9, 3, 2, '#37474f');
    renderer.drawRect(x + 18, y + 9, 3, 2, '#37474f');
    renderer.drawRect(x + 6, y + 9, 12, 7, mask);
    renderer.drawRect(x + 7, y + 8, 10, 2, '#ffffff');
    renderer.drawRect(x + 8, y + 11, 8, 3, filter);
    renderer.drawRect(x + 9, y + 11, 3, 1, '#cfd8dc');
    renderer.drawRect(x + 10, y + 14, 4, 1, '#ffffff');
  }

  // Luvas
  if (has('luvas')) {
    const glove = colorOf('luvas', 'color', '#3949ab');
    const gloveLight = colorOf('luvas', 'accent', '#9fa8da');
    renderer.drawRect(x - 2, y + 13, 5, 7, glove);
    renderer.drawRect(x + 21, y + 13, 5, 7, glove);
    renderer.drawRect(x - 1, y + 12, 4, 2, COLORS.SAFETY_YELLOW);
    renderer.drawRect(x + 21, y + 12, 4, 2, COLORS.SAFETY_YELLOW);
    renderer.drawRect(x - 1, y + 15, 2, 3, gloveLight);
    renderer.drawRect(x + 22, y + 15, 2, 3, gloveLight);
  }

  // Botas
  if (has('botas')) {
    const boot = colorOf('botas', 'color', '#6d4c41');
    renderer.drawRect(x + 2, y + 19, 7, 5, boot);
    renderer.drawRect(x + 15, y + 19, 7, 5, boot);
    renderer.drawRect(x + 1, y + 23, 8, 2, '#263238');
    renderer.drawRect(x + 14, y + 23, 8, 2, '#263238');
    renderer.drawRect(x + 3, y + 20, 5, 2, '#90a4ae');
    renderer.drawRect(x + 16, y + 20, 5, 2, '#90a4ae');
    renderer.drawRect(x + 4, y + 19, 3, 1, colorOf('botas', 'accent', '#bcaaa4'));
    renderer.drawRect(x + 17, y + 19, 3, 1, colorOf('botas', 'accent', '#bcaaa4'));
  }

  // Prancheta do PGR na mão esquerda
  if (has('prancheta')) {
    const board = colorOf('prancheta', 'color', '#1565c0');
    renderer.drawRect(x - 5, y + 13, 7, 10, board);
    renderer.drawRect(x - 4, y + 14, 5, 8, '#ffffff');
    renderer.drawRect(x - 4, y + 12, 5, 2, '#90a4ae');
    renderer.drawRect(x - 3, y + 16, 3, 1, '#1565c0');
    renderer.drawRect(x - 3, y + 18, 3, 1, '#1565c0');
    renderer.drawRect(x - 3, y + 20, 2, 1, '#1565c0');
  }

  // Brilho de "novo EPI" ao redor do sprite.
  if (flash > 0) {
    const pulse = 0.5 + 0.5 * Math.sin(flash * Math.PI * 8);
    const alpha = Math.min(1, flash * 1.6) * (0.45 + pulse * 0.4);
    const glow = `rgba(255, 215, 0, ${alpha})`;
    renderer.drawRect(x - 2, y - 4, w + 4, 2, glow);
    renderer.drawRect(x - 2, y + h + 1, w + 4, 2, glow);
    renderer.drawRect(x - 3, y - 2, 2, h + 4, glow);
    renderer.drawRect(x + w + 1, y - 2, 2, h + 4, glow);

    const sparkle = `rgba(255, 255, 255, ${alpha})`;
    const points = [
      [x - 6, y + 2], [x + w + 4, y + 6],
      [x - 4, y + h - 4], [x + w + 2, y + h - 2]
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
