import { COLORS, shadeColor } from '../design-tokens/snes-theme.js';
import { getSpeakerLook } from './CharacterRenderer.js';

/**
 * PortraitRenderer - retratos procedurais com olhos e boca animados.
 *
 * O retrato é desenhado em uma grade 44x44 e escalado para o tamanho do
 * painel. Cada especialista tem tom de pele, cabelo, expressão e acessórios
 * próprios; ao digitar, a boca se move e, em intervalos curtos, os olhos
 * piscam. Nenhum asset externo é usado.
 */

const GRID = 44;

function rect(renderer, x, y, width, height, color) {
  renderer.drawRect(
    Math.floor(x),
    Math.floor(y),
    Math.max(1, Math.ceil(width)),
    Math.max(1, Math.ceil(height)),
    color
  );
}

function drawHair(renderer, gx, gy, u, look) {
  const hair = look.hair;
  const light = look.hairLight || shadeColor(hair, 20);
  const dark = look.hairShade || shadeColor(hair, -35);
  const style = look.hairStyle || 'short';

  // Topo da cabeça.
  rect(renderer, gx + 12 * u, gy + 5 * u, 20 * u, 5 * u, dark);
  rect(renderer, gx + 13 * u, gy + 4 * u, 18 * u, 4 * u, hair);
  rect(renderer, gx + 15 * u, gy + 4 * u, 10 * u, 1 * u, light);
  rect(renderer, gx + 11 * u, gy + 7 * u, 3 * u, 8 * u, hair);
  rect(renderer, gx + 30 * u, gy + 7 * u, 3 * u, 8 * u, hair);

  if (style === 'bob') {
    rect(renderer, gx + 10 * u, gy + 9 * u, 3 * u, 11 * u, hair);
    rect(renderer, gx + 31 * u, gy + 9 * u, 3 * u, 11 * u, hair);
    rect(renderer, gx + 13 * u, gy + 9 * u, 18 * u, 3 * u, hair);
    rect(renderer, gx + 15 * u, gy + 10 * u, 9 * u, 1 * u, light);
  } else if (style === 'long') {
    rect(renderer, gx + 9 * u, gy + 9 * u, 4 * u, 17 * u, hair);
    rect(renderer, gx + 31 * u, gy + 9 * u, 4 * u, 17 * u, hair);
    rect(renderer, gx + 10 * u, gy + 23 * u, 2 * u, 3 * u, dark);
    rect(renderer, gx + 32 * u, gy + 23 * u, 2 * u, 3 * u, dark);
    rect(renderer, gx + 13 * u, gy + 9 * u, 18 * u, 3 * u, hair);
  } else if (style === 'curly') {
    const curls = [
      [9, 6], [12, 4], [16, 3], [20, 2], [24, 2], [28, 3], [32, 5], [34, 8],
      [8, 11], [33, 12]
    ];
    for (const [cx, cy] of curls) {
      rect(renderer, gx + cx * u, gy + cy * u, 3 * u, 3 * u, hair);
      rect(renderer, gx + (cx + 1) * u, gy + cy * u, 1 * u, 1 * u, light);
    }
    rect(renderer, gx + 11 * u, gy + 9 * u, 3 * u, 8 * u, hair);
    rect(renderer, gx + 30 * u, gy + 9 * u, 3 * u, 8 * u, hair);
  } else if (style === 'ponytail') {
    rect(renderer, gx + 10 * u, gy + 9 * u, 3 * u, 9 * u, hair);
    rect(renderer, gx + 31 * u, gy + 9 * u, 3 * u, 9 * u, hair);
    rect(renderer, gx + 33 * u, gy + 12 * u, 5 * u, 11 * u, dark);
    rect(renderer, gx + 34 * u, gy + 12 * u, 3 * u, 8 * u, hair);
    rect(renderer, gx + 13 * u, gy + 9 * u, 18 * u, 3 * u, hair);
  } else if (style === 'bun') {
    rect(renderer, gx + 30 * u, gy + 1 * u, 5 * u, 6 * u, dark);
    rect(renderer, gx + 31 * u, gy + 1 * u, 3 * u, 4 * u, hair);
    rect(renderer, gx + 31 * u, gy + 2 * u, 2 * u, 1 * u, light);
    rect(renderer, gx + 13 * u, gy + 9 * u, 18 * u, 2 * u, hair);
  } else if (style === 'buzz') {
    rect(renderer, gx + 13 * u, gy + 5 * u, 18 * u, 2 * u, hair);
    rect(renderer, gx + 11 * u, gy + 7 * u, 2 * u, 5 * u, dark);
    rect(renderer, gx + 31 * u, gy + 7 * u, 2 * u, 5 * u, dark);
  } else {
    // short
    rect(renderer, gx + 11 * u, gy + 8 * u, 2 * u, 6 * u, hair);
    rect(renderer, gx + 31 * u, gy + 8 * u, 2 * u, 6 * u, hair);
    rect(renderer, gx + 13 * u, gy + 9 * u, 18 * u, 2 * u, hair);
    rect(renderer, gx + 15 * u, gy + 10 * u, 8 * u, 1 * u, light);
  }

  if (look.headwear === 'helmet') {
    const helmet = look.headwearColor || COLORS.SAFETY_YELLOW;
    const helmetLight = shadeColor(helmet, 30);
    const helmetDark = shadeColor(helmet, -35);
    rect(renderer, gx + 10 * u, gy + 1 * u, 24 * u, 10 * u, helmetDark);
    rect(renderer, gx + 11 * u, gy + 1 * u, 22 * u, 8 * u, helmet);
    rect(renderer, gx + 14 * u, gy + 2 * u, 12 * u, 2 * u, helmetLight);
    rect(renderer, gx + 8 * u, gy + 9 * u, 28 * u, 3 * u, helmetDark);
    rect(renderer, gx + 9 * u, gy + 9 * u, 26 * u, 2 * u, helmet);
    rect(renderer, gx + 21 * u, gy + 1 * u, 2 * u, 8 * u, '#ffffff');
    rect(renderer, gx + 21 * u, gy + 4 * u, 2 * u, 2 * u, COLORS.SAFETY_ORANGE);
  }
}

function drawFace(renderer, gx, gy, u, look, options = {}) {
  const { blink = false, talking = false, time = 0 } = options;
  const eyeLook = Math.round(Math.sin(time * 0.85) * 0.75);

  // Pescoço.
  rect(renderer, gx + 19 * u, gy + 29 * u, 6 * u, 7 * u, look.skinShade);
  rect(renderer, gx + 20 * u, gy + 29 * u, 4 * u, 6 * u, look.skin);

  // Orelhas.
  rect(renderer, gx + 10 * u, gy + 19 * u, 3 * u, 6 * u, look.outline);
  rect(renderer, gx + 11 * u, gy + 20 * u, 2 * u, 4 * u, look.skinShade);
  rect(renderer, gx + 31 * u, gy + 19 * u, 3 * u, 6 * u, look.outline);
  rect(renderer, gx + 31 * u, gy + 20 * u, 2 * u, 4 * u, look.skinShade);

  // Silhueta arredondada do rosto.
  rect(renderer, gx + 12 * u, gy + 8 * u, 20 * u, 22 * u, look.outline);
  rect(renderer, gx + 13 * u, gy + 8 * u, 18 * u, 21 * u, look.skin);
  rect(renderer, gx + 14 * u, gy + 28 * u, 16 * u, 3 * u, look.skin);
  rect(renderer, gx + 15 * u, gy + 30 * u, 14 * u, 2 * u, look.skinShade);
  rect(renderer, gx + 13 * u, gy + 10 * u, 3 * u, 14 * u, look.skinLight);
  rect(renderer, gx + 29 * u, gy + 10 * u, 2 * u, 14 * u, look.skinShade);
  rect(renderer, gx + 16 * u, gy + 8 * u, 11 * u, 1 * u, look.skinLight);
  rect(renderer, gx + 17 * u, gy + 29 * u, 8 * u, 1 * u, look.skinLight);

  drawHair(renderer, gx, gy, u, look);

  if (look.earrings) {
    rect(renderer, gx + 10 * u, gy + 24 * u, 1 * u, 2 * u, COLORS.SAFETY_YELLOW);
    rect(renderer, gx + 33 * u, gy + 24 * u, 1 * u, 2 * u, COLORS.SAFETY_YELLOW);
  }

  // Sobrancelhas.
  rect(renderer, gx + 15 * u, gy + 16 * u, 5 * u, 1 * u, look.hairShade || look.hair);
  rect(renderer, gx + 25 * u, gy + 16 * u, 5 * u, 1 * u, look.hairShade || look.hair);
  rect(renderer, gx + 16 * u, gy + 15 * u, 3 * u, 1 * u, look.hair);

  // Olhos grandes, com brilho e piscada.
  const eyeY = 18;
  if (blink) {
    rect(renderer, gx + 16 * u, gy + (eyeY + 1) * u, 4 * u, 1 * u, look.eye);
    rect(renderer, gx + 25 * u, gy + (eyeY + 1) * u, 4 * u, 1 * u, look.eye);
    rect(renderer, gx + 15 * u, gy + eyeY * u, 1 * u, 1 * u, look.skinShade);
    rect(renderer, gx + 30 * u, gy + eyeY * u, 1 * u, 1 * u, look.skinShade);
  } else {
    rect(renderer, gx + 15 * u, gy + eyeY * u, 5 * u, 4 * u, '#f7f2e8');
    rect(renderer, gx + 25 * u, gy + eyeY * u, 5 * u, 4 * u, '#f7f2e8');
    rect(renderer, gx + (17 + eyeLook) * u, gy + (eyeY + 1) * u, 2 * u, 3 * u, look.eye);
    rect(renderer, gx + (27 + eyeLook) * u, gy + (eyeY + 1) * u, 2 * u, 3 * u, look.eye);
    rect(renderer, gx + (17 + eyeLook) * u, gy + (eyeY + 1) * u, 1 * u, 1 * u, '#ffffff');
    rect(renderer, gx + (27 + eyeLook) * u, gy + (eyeY + 1) * u, 1 * u, 1 * u, '#ffffff');
    rect(renderer, gx + 15 * u, gy + (eyeY + 3) * u, 5 * u, 1 * u, look.skinShade);
    rect(renderer, gx + 25 * u, gy + (eyeY + 3) * u, 5 * u, 1 * u, look.skinShade);
  }

  // Nariz e bochechas.
  rect(renderer, gx + 21 * u, gy + 22 * u, 3 * u, 3 * u, look.skinShade);
  rect(renderer, gx + 21 * u, gy + 22 * u, 2 * u, 1 * u, look.skinLight);
  rect(renderer, gx + 15 * u, gy + 24 * u, 2 * u, 1 * u, 'rgba(201, 112, 89, 0.18)');
  rect(renderer, gx + 28 * u, gy + 24 * u, 2 * u, 1 * u, 'rgba(201, 112, 89, 0.18)');

  if (look.glasses) {
    rect(renderer, gx + 14 * u, gy + 17 * u, 7 * u, 2 * u, '#1e2a35');
    rect(renderer, gx + 14 * u, gy + 18 * u, 2 * u, 5 * u, '#1e2a35');
    rect(renderer, gx + 19 * u, gy + 18 * u, 2 * u, 5 * u, '#1e2a35');
    rect(renderer, gx + 24 * u, gy + 18 * u, 2 * u, 2 * u, '#1e2a35');
    rect(renderer, gx + 24 * u, gy + 17 * u, 7 * u, 2 * u, '#1e2a35');
    rect(renderer, gx + 30 * u, gy + 18 * u, 2 * u, 5 * u, '#1e2a35');
    rect(renderer, gx + 21 * u, gy + 19 * u, 2 * u, 1 * u, 'rgba(255, 255, 255, 0.60)');
    rect(renderer, gx + 16 * u, gy + 19 * u, 2 * u, 1 * u, 'rgba(255, 255, 255, 0.65)');
    rect(renderer, gx + 26 * u, gy + 19 * u, 2 * u, 1 * u, 'rgba(255, 255, 255, 0.65)');
  }

  if (look.facialHair === 'mustache') {
    rect(renderer, gx + 19 * u, gy + 26 * u, 7 * u, 1 * u, look.hairShade || look.hair);
    rect(renderer, gx + 20 * u, gy + 27 * u, 2 * u, 1 * u, look.hairShade || look.hair);
    rect(renderer, gx + 24 * u, gy + 27 * u, 2 * u, 1 * u, look.hairShade || look.hair);
  } else if (look.facialHair === 'beard') {
    rect(renderer, gx + 16 * u, gy + 25 * u, 2 * u, 6 * u, look.hairShade || look.hair);
    rect(renderer, gx + 28 * u, gy + 25 * u, 2 * u, 6 * u, look.hairShade || look.hair);
    rect(renderer, gx + 17 * u, gy + 29 * u, 12 * u, 3 * u, look.hairShade || look.hair);
    rect(renderer, gx + 19 * u, gy + 30 * u, 8 * u, 1 * u, look.hair);
  } else if (look.facialHair === 'goatee') {
    rect(renderer, gx + 20 * u, gy + 29 * u, 5 * u, 3 * u, look.hairShade || look.hair);
  }

  // Boca: fechada quando a fala terminou; animada durante a digitação.
  const mouthOpen = talking && (Math.floor(time * 11) % 2 === 0);
  if (mouthOpen) {
    rect(renderer, gx + 19 * u, gy + 26 * u, 7 * u, 4 * u, '#5b2528');
    rect(renderer, gx + 20 * u, gy + 26 * u, 5 * u, 1 * u, '#fff4e6');
    rect(renderer, gx + 21 * u, gy + 28 * u, 3 * u, 1 * u, '#c45f62');
  } else {
    rect(renderer, gx + 19 * u, gy + 27 * u, 7 * u, 1 * u, '#713638');
    rect(renderer, gx + 18 * u, gy + 27 * u, 1 * u, 1 * u, look.skinShade);
    rect(renderer, gx + 26 * u, gy + 27 * u, 1 * u, 1 * u, look.skinShade);
  }
}

export function drawPortrait(renderer, speaker, options = {}) {
  if (!speaker) return;

  const {
    x = 0,
    y = 0,
    size = 86,
    time = 0,
    blink = false,
    talking = false
  } = options;

  const look = getSpeakerLook(speaker);
  const u = size / GRID;
  const gx = x;
  const gy = y;
  const accent = speaker.color || look.uniform || COLORS.SAFETY_ORANGE;

  // Moldura e fundo.
  rect(renderer, x + 4, y + 4, size, size, 'rgba(0, 0, 0, 0.48)');
  rect(renderer, x, y, size, size, '#111a25');
  rect(renderer, x + 2, y + 2, size - 4, size - 4, shadeColor(accent, -55));

  const ctx = renderer.context;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 3, y + 3, size - 6, size - 6);
  ctx.clip();

  const bg = ctx.createLinearGradient(x, y, x, y + size);
  bg.addColorStop(0, shadeColor(accent, -62));
  bg.addColorStop(0.55, '#111b27');
  bg.addColorStop(1, '#070c13');
  ctx.fillStyle = bg;
  ctx.fillRect(x + 3, y + 3, size - 6, size - 6);

  // Halo e textura de fundo.
  renderer.drawGlow(x + size * 0.5, y + size * 0.42, size * 0.55, accent, 0.12);
  for (let i = -GRID; i < GRID * 2; i += 5) {
    rect(renderer, x + i * u, y + 3, u, size - 6, 'rgba(255, 255, 255, 0.025)');
  }
  for (let i = 0; i < GRID; i += 4) {
    rect(renderer, x + 3, y + i * u, size - 6, 1, 'rgba(255, 255, 255, 0.045)');
  }

  // Ombros e uniforme.
  rect(renderer, gx + 4 * u, gy + 35 * u, 36 * u, 9 * u, look.outline);
  rect(renderer, gx + 5 * u, gy + 36 * u, 34 * u, 8 * u, look.uniform);
  rect(renderer, gx + 5 * u, gy + 36 * u, 34 * u, 2 * u, look.uniformLight);
  rect(renderer, gx + 18 * u, gy + 35 * u, 8 * u, 5 * u, look.outline);
  rect(renderer, gx + 19 * u, gy + 35 * u, 6 * u, 4 * u, look.skinShade);
  rect(renderer, gx + 13 * u, gy + 37 * u, 18 * u, 3 * u, look.collar || '#f6f1e7');
  rect(renderer, gx + 18 * u, gy + 37 * u, 8 * u, 3 * u, look.skinShade);
  rect(renderer, gx + 19 * u, gy + 38 * u, 6 * u, 1 * u, look.skin);
  rect(renderer, gx + 12 * u, gy + 40 * u, 2 * u, 4 * u, look.uniformLight);
  rect(renderer, gx + 30 * u, gy + 40 * u, 2 * u, 4 * u, look.uniformDark);
  rect(renderer, gx + 26 * u, gy + 39 * u, 7 * u, 4 * u, look.badge || '#ffffff');
  rect(renderer, gx + 27 * u, gy + 40 * u, 3 * u, 1 * u, accent);
  rect(renderer, gx + 27 * u, gy + 41 * u, 5 * u, 1 * u, shadeColor(accent, -35));

  if (look.vest) {
    rect(renderer, gx + 6 * u, gy + 37 * u, 32 * u, 1 * u, 'rgba(255, 255, 255, 0.80)');
    rect(renderer, gx + 6 * u, gy + 41 * u, 32 * u, 1 * u, 'rgba(255, 255, 255, 0.62)');
  }

  drawFace(renderer, gx, gy, u, look, { blink, talking, time });

  ctx.restore();

  // Moldura interna com cantos.
  rect(renderer, x, y, size, 2, shadeColor(accent, 15));
  rect(renderer, x, y + size - 2, size, 2, shadeColor(accent, -45));
  rect(renderer, x, y, 2, size, shadeColor(accent, 15));
  rect(renderer, x + size - 2, y, 2, size, shadeColor(accent, -45));

  const corner = Math.max(4, Math.round(size * 0.07));
  rect(renderer, x + 2, y + 2, corner, 2, '#ffffff');
  rect(renderer, x + 2, y + 2, 2, corner, '#ffffff');
  rect(renderer, x + size - corner - 2, y + 2, corner, 2, '#ffffff');
  rect(renderer, x + size - 4, y + 2, 2, corner, '#ffffff');
  rect(renderer, x + 2, y + size - 4, corner, 2, '#ffffff');
  rect(renderer, x + 2, y + size - corner - 2, 2, corner, '#ffffff');
  rect(renderer, x + size - corner - 2, y + size - 4, corner, 2, '#ffffff');
  rect(renderer, x + size - 4, y + size - corner - 2, 2, corner, '#ffffff');
}
