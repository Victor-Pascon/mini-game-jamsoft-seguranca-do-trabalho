/**
 * Design Tokens - JAMSOFT Segurança em Jogo
 * Estilo visual: Super Nintendo / Pixel Art
 * Paleta: JAMSOFT (azul + laranja) + cores de segurança do trabalho.
 *
 * Regra: todo o jogo é desenhado em canvas, em uma resolução fixa de 640x480.
 * Os tokens abaixo mantêm a linguagem visual do mini-game original da JAMSOFT.
 */

export const COLORS = {
  // Identidade JAMSOFT
  PRIMARY: '#0d47a1',
  PRIMARY_LIGHT: '#1565c0',
  PRIMARY_DARK: '#0a3575',
  ACCENT: '#ff6f00',
  ACCENT_LIGHT: '#ff8f00',
  ACCENT_DARK: '#d35400',

  // Cores de segurança / sinalização (NR-26)
  SAFETY_YELLOW: '#ffc107',
  SAFETY_YELLOW_DARK: '#f39c12',
  SAFETY_BLACK: '#111111',
  SAFETY_RED: '#e74c3c',
  SAFETY_RED_DARK: '#c0392b',
  SAFETY_GREEN: '#2ecc71',
  SAFETY_GREEN_DARK: '#27ae60',
  SAFETY_BLUE: '#3498db',
  SAFETY_BLUE_DARK: '#2980b9',
  SAFETY_ORANGE: '#ff6f00',
  SAFETY_ORANGE_DARK: '#d35400',
  SAFETY_CYAN: '#1abc9c',
  SAFETY_CYAN_DARK: '#16a085',
  SAFETY_PURPLE: '#9b59b6',
  SAFETY_PURPLE_DARK: '#8e44ad',
  SAFETY_PINK: '#e91e63',
  SAFETY_PINK_DARK: '#c2185b',
  SAFETY_GRAY: '#607d8b',
  SAFETY_GRAY_DARK: '#37474f',
  SAFETY_WHITE: '#f5f5f5',

  // Paleta SNES - base
  SNES_BLACK: '#000000',
  SNES_DARK: '#1a1a2e',
  SNES_GRAY_DARK: '#2d2d44',
  SNES_GRAY: '#4a4a6a',
  SNES_GRAY_LIGHT: '#6a6a8a',
  SNES_WHITE: '#f0f0f0',
  SNES_RED: '#e74c3c',
  SNES_RED_DARK: '#c0392b',
  SNES_GREEN: '#2ecc71',
  SNES_GREEN_DARK: '#27ae60',
  SNES_BLUE: '#3498db',
  SNES_BLUE_DARK: '#2980b9',
  SNES_YELLOW: '#f1c40f',
  SNES_YELLOW_DARK: '#f39c12',
  SNES_PURPLE: '#9b59b6',
  SNES_PURPLE_DARK: '#8e44ad',
  SNES_ORANGE: '#e67e22',
  SNES_ORANGE_DARK: '#d35400',
  SNES_CYAN: '#1abc9c',
  SNES_CYAN_DARK: '#16a085',
  SNES_PINK: '#e91e63',
  SNES_PINK_DARK: '#c2185b',

  // Piso e paredes
  FLOOR_BASE: '#151b24',
  FLOOR_LIGHT: '#1b2430',
  FLOOR_DARK: '#10151d',
  WALL_BASE: '#0d47a1',
  WALL_LIGHT: '#1565c0',
  WALL_DARK: '#0a3575',
  WALL_HIGHLIGHT: '#1976d2',

  // Salas por Norma Regulamentadora
  ROOM_EPI: '#ff6f00',
  ROOM_PGR: '#42a5f5',
  ROOM_BRIGADA: '#ef5350',
  ROOM_ELETRICA: '#ffd54f',
  ROOM_RUIDO: '#ab47bc',
  ROOM_ERGONOMIA: '#66bb6a',
  ROOM_MAQUINAS: '#ef5350',
  ROOM_LOGISTICA: '#a1887f',
  ROOM_SINALIZACAO: '#26a69a',
  ROOM_ALTURA: '#90a4ae',
  ROOM_MURAL: '#ec407a',
  ROOM_AUDITORIO: '#26a69a',

  // UI
  UI_BG: 'rgba(0, 0, 0, 0.88)',
  UI_BG_SOFT: 'rgba(8, 14, 24, 0.92)',
  UI_BORDER: '#ff6f00',
  UI_TEXT: '#f0f0f0',
  UI_TEXT_DIM: '#9aa5b1',
  UI_HIGHLIGHT: '#ffd700',
  UI_SUCCESS: '#2ecc71',
  UI_DANGER: '#ff5252',

  // Efeitos
  SHADOW: 'rgba(0, 0, 0, 0.35)',
  GLOW: 'rgba(255, 193, 7, 0.3)',
  GLOW_BLUE: 'rgba(21, 101, 192, 0.35)'
};

export const FONTS = {
  TINY: '9px "Courier New", monospace',
  SMALL: '11px "Courier New", monospace',
  PRIMARY: '14px "Courier New", monospace',
  DIALOG: '16px "Courier New", monospace',
  LARGE: '20px "Courier New", monospace',
  TITLE: '28px "Courier New", monospace',
  HERO: '42px "Courier New", monospace'
};

export const SPACING = {
  TILE_SIZE: 32,
  HALF_TILE: 16,
  PLAYER_SIZE: 24,
  NPC_SIZE: 26,
  UI_PADDING: 8,
  UI_GAP: 4
};

export const EFFECTS = {
  PARTICLE_COUNT: 12,
  PARTICLE_SPEED: 150,
  PARTICLE_LIFE: 0.6,
  PARTICLE_SIZE: 3,
  GLOW_INTENSITY: 0.3,
  GLOW_RADIUS: 8,
  ANIMATION_SPEED: 0.15,
  BLINK_SPEED: 500
};

export const SNES_PALETTE = [
  '#000000', '#1a1a2e', '#2d2d44', '#4a4a6a',
  '#6a6a8a', '#8a8aaa', '#aaaaaa', '#f0f0f0',
  '#e74c3c', '#c0392b', '#e67e22', '#d35400',
  '#f1c40f', '#f39c12', '#2ecc71', '#27ae60',
  '#1abc9c', '#16a085', '#3498db', '#2980b9',
  '#9b59b6', '#8e44ad', '#e91e63', '#c2185b',
  '#0d47a1', '#1565c0', '#ff6f00', '#ff8f00',
  '#ffd700', '#ff4444', '#00ff00', '#4444ff'
];

export function getSNESColor(index) {
  return SNES_PALETTE[index % SNES_PALETTE.length];
}

export function shadeColor(color, percent) {
  if (typeof color !== 'string' || !color.startsWith('#')) return color;
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x00FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

export function hexToRgba(color, alpha = 1) {
  if (typeof color !== 'string' || !color.startsWith('#')) return color;
  const hex = color.slice(1);
  const full = hex.length === 3
    ? hex.split('').map((c) => c + c).join('')
    : hex;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function drawPixelRect(ctx, x, y, width, height, color, pixelSize = 2) {
  ctx.fillStyle = color;
  for (let px = 0; px < width; px += pixelSize) {
    for (let py = 0; py < height; py += pixelSize) {
      if (Math.random() > 0.1) {
        ctx.fillRect(x + px, y + py, pixelSize, pixelSize);
      }
    }
  }
}

export function drawSNESBorder(ctx, x, y, width, height, color, thickness = 4) {
  ctx.fillStyle = shadeColor(color, -40);
  ctx.fillRect(x, y, width, thickness);
  ctx.fillRect(x, y + height - thickness, width, thickness);
  ctx.fillRect(x, y, thickness, height);
  ctx.fillRect(x + width - thickness, y, thickness, height);

  ctx.fillStyle = shadeColor(color, 40);
  ctx.fillRect(x + thickness, y + thickness, width - thickness * 2, thickness);
  ctx.fillRect(x + thickness, y + height - thickness * 2, width - thickness * 2, thickness);
  ctx.fillRect(x + thickness, y + thickness, thickness, height - thickness * 2);
  ctx.fillRect(x + width - thickness * 2, y + thickness, thickness, height - thickness * 2);

  ctx.fillStyle = color;
  ctx.fillRect(x + thickness * 2, y + thickness * 2, width - thickness * 4, height - thickness * 4);
}

/**
 * Hash determinístico para gerar texturas de tiles estáveis (sem flicker).
 */
export function hash2d(x, y, seed = 0) {
  let n = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
  n = (n ^ (n >> 13)) * 1274126177;
  n = n ^ (n >> 16);
  return (n >>> 0) / 4294967295;
}
