import { COLORS, shadeColor, hexToRgba, hash2d } from '../design-tokens/snes-theme.js';
import { TILE_TYPES } from '../data/maps.js';

/**
 * EnvironmentRenderer - camada de ambientação do mapa.
 *
 * O piso base é desenhado pelo Renderer. Esta camada acrescenta rodapés,
 * soleiras, luzes de teto, reflexos e poeira para dar profundidade ao escritório
 * sem alterar a colisão ou a lógica de exploração.
 */

const HALL_LIGHTS = [
  [320, 144],
  [320, 304],
  [176, 208],
  [464, 208],
  [176, 368],
  [464, 368]
];

function tileIndexAt(map, x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return -1;
  return map.tiles[y * map.width + x];
}

function drawStrip(renderer, x, y, width, height, colorA, colorB) {
  renderer.drawRect(x, y, width, height, colorA);
  if (colorB) {
    renderer.drawRect(x, y + Math.max(0, height - 1), width, 1, colorB);
  }
}

function drawRoomBorders(renderer, map) {
  const ts = map.tileSize;

  for (const room of map.roomDefs) {
    const x0 = room.x * ts;
    const y0 = room.y * ts;
    const width = room.w * ts;
    const height = room.h * ts;
    const accent = hexToRgba(room.color, 0.55);

    // Sombra de parede no topo, criando profundidade.
    for (let index = 0; index < 7; index++) {
      renderer.drawRect(
        x0,
        y0 + index,
        width,
        1,
        `rgba(0, 0, 0, ${0.12 - index * 0.014})`
      );
    }

    // Rodapés por tile, com vão nas portas.
    for (let tx = room.x; tx < room.x + room.w; tx++) {
      const topTile = tileIndexAt(map, tx, room.y);
      if (topTile !== TILE_TYPES.DOOR) {
        drawStrip(renderer, tx * ts, y0, ts, 4, 'rgba(5, 10, 16, 0.76)', accent);
      } else {
        renderer.drawRect(tx * ts, y0, ts, 3, '#1b2735');
        renderer.drawRect(tx * ts + 2, y0 + 1, ts - 4, 1, COLORS.SAFETY_YELLOW);
      }

      const bottomTile = tileIndexAt(map, tx, room.y + room.h - 1);
      if (bottomTile !== TILE_TYPES.DOOR) {
        drawStrip(
          renderer,
          tx * ts,
          y0 + height - 4,
          ts,
          4,
          'rgba(5, 10, 16, 0.54)',
          hexToRgba(room.color, 0.25)
        );
      } else {
        renderer.drawRect(tx * ts, y0 + height - 3, ts, 3, '#1b2735');
        renderer.drawRect(tx * ts + 2, y0 + height - 2, ts - 4, 1, COLORS.SAFETY_YELLOW);
      }
    }

    for (let ty = room.y; ty < room.y + room.h; ty++) {
      const leftTile = tileIndexAt(map, room.x, ty);
      if (leftTile !== TILE_TYPES.DOOR) {
        renderer.drawRect(x0, ty * ts, 4, ts, 'rgba(5, 10, 16, 0.55)');
        renderer.drawRect(x0 + 3, ty * ts, 1, ts, hexToRgba(room.color, 0.22));
      } else {
        renderer.drawRect(x0, ty * ts, 3, ts, '#1b2735');
        renderer.drawRect(x0 + 1, ty * ts + 2, 1, ts - 4, COLORS.SAFETY_YELLOW);
      }

      const rightTile = tileIndexAt(map, room.x + room.w - 1, ty);
      if (rightTile !== TILE_TYPES.DOOR) {
        renderer.drawRect(x0 + width - 4, ty * ts, 4, ts, 'rgba(5, 10, 16, 0.55)');
        renderer.drawRect(x0 + width - 4, ty * ts, 1, ts, hexToRgba(room.color, 0.22));
      } else {
        renderer.drawRect(x0 + width - 3, ty * ts, 3, ts, '#1b2735');
        renderer.drawRect(x0 + width - 2, ty * ts + 2, 1, ts - 4, COLORS.SAFETY_YELLOW);
      }
    }

    // Cantos com pequenos pilares.
    const corners = [
      [x0, y0],
      [x0 + width - 4, y0],
      [x0, y0 + height - 4],
      [x0 + width - 4, y0 + height - 4]
    ];
    for (const [cx, cy] of corners) {
      renderer.drawRect(cx, cy, 4, 4, '#0b131c');
      renderer.drawRect(cx + 1, cy + 1, 2, 2, accent);
    }
  }
}

function drawWorkerZone(renderer, worker, roomColor) {
  const x = Math.round(worker.x - 8);
  const y = Math.round(worker.y + 24);
  const width = 40;
  const height = 9;
  const line = hexToRgba(roomColor, 0.34);
  const fill = hexToRgba(roomColor, 0.11);

  renderer.drawGlow(worker.x + 12, worker.y + 22, 26, roomColor, 0.045);
  renderer.drawRect(x, y, width, height, fill);
  renderer.drawRect(x, y, width, 1, line);
  renderer.drawRect(x, y + height - 1, width, 1, line);

  // Cantos amarelos deixam o posto de trabalho legível mesmo em salas claras.
  renderer.drawRect(x, y, 5, 1, hexToRgba(COLORS.SAFETY_YELLOW, 0.62));
  renderer.drawRect(x + width - 5, y, 5, 1, hexToRgba(COLORS.SAFETY_YELLOW, 0.62));
  renderer.drawRect(x, y + height - 1, 5, 1, hexToRgba(COLORS.SAFETY_YELLOW, 0.42));
  renderer.drawRect(x + width - 5, y + height - 1, 5, 1, hexToRgba(COLORS.SAFETY_YELLOW, 0.42));
}

function drawPhaseAmbience(renderer, map) {
  if (!map.phase || !Array.isArray(map.roomDefs)) return;

  for (const room of map.roomDefs) {
    const ts = map.tileSize;
    const x0 = room.x * ts;
    const y0 = room.y * ts;
    const width = room.w * ts;
    const height = room.h * ts;
    const color = room.color || COLORS.SAFETY_YELLOW;

    // Faixa de identificação na parede superior, abaixo do HUD.
    renderer.drawRect(x0 + 8, y0 + 2, width - 16, 2, hexToRgba(color, 0.32));
    renderer.drawRect(x0 + 8, y0 + 4, width - 16, 1, 'rgba(255, 255, 255, 0.08)');

    // Rodapé com marcações alternadas, lembrando uma faixa de segurança.
    for (let x = x0 + 12; x < x0 + width - 12; x += 18) {
      renderer.drawRect(x, y0 + height - 7, 9, 1, hexToRgba(color, 0.22));
      renderer.drawRect(x + 9, y0 + height - 7, 3, 1, 'rgba(0, 0, 0, 0.18)');
    }

    // Cantos pintados no piso, alinhando a área de circulação.
    const corner = 14;
    const cornerLine = hexToRgba(color, 0.26);
    renderer.drawRect(x0 + 12, y0 + 16, corner, 2, cornerLine);
    renderer.drawRect(x0 + 12, y0 + 16, 2, corner, cornerLine);
    renderer.drawRect(x0 + width - 12 - corner, y0 + 16, corner, 2, cornerLine);
    renderer.drawRect(x0 + width - 14, y0 + 16, 2, corner, cornerLine);
    renderer.drawRect(x0 + 12, y0 + height - 16, corner, 2, cornerLine);
    renderer.drawRect(x0 + 12, y0 + height - 16 - corner, 2, corner, cornerLine);
    renderer.drawRect(x0 + width - 12 - corner, y0 + height - 16, corner, 2, cornerLine);
    renderer.drawRect(x0 + width - 14, y0 + height - 16 - corner, 2, corner, cornerLine);

    // Grande marca d'água com a NR da fase. Fica no piso, atrás dos atores.
    const stampX = x0 + width / 2;
    const stampY = y0 + height - 118;
    renderer.drawGlow(stampX, stampY + 14, 92, color, 0.035);
    renderer.drawText(String(room.norm || ''), stampX, stampY, {
      color: hexToRgba(color, 0.13),
      font: '800 30px "Consolas", "Lucida Console", monospace',
      align: 'center',
      shadow: false
    });
    renderer.drawRect(stampX - 52, stampY + 32, 104, 1, hexToRgba(color, 0.16));
    renderer.drawRect(stampX - 32, stampY + 35, 64, 1, hexToRgba(color, 0.10));

    // Postos de trabalho visíveis sob cada funcionário.
    for (const worker of map.workers || []) {
      drawWorkerZone(renderer, worker, color);
    }
  }
}

function drawDoorGuides(renderer, map) {
  const ts = map.tileSize;

  for (const room of map.roomDefs) {
    const x0 = room.x * ts;
    const y0 = room.y * ts;
    const width = room.w * ts;
    const height = room.h * ts;

    // Portas no topo e na base.
    for (let tx = room.x; tx < room.x + room.w; tx++) {
      if (tileIndexAt(map, tx, room.y) === TILE_TYPES.DOOR && room.y > 0) {
        const cx = tx * ts + ts / 2;
        const cy = y0 - 16;
        renderer.drawRect(cx - 5, cy, 10, 2, hexToRgba(room.color, 0.52));
        renderer.drawRect(cx - 3, cy + 2, 6, 2, hexToRgba(room.color, 0.42));
        renderer.drawRect(cx - 1, cy + 4, 2, 2, hexToRgba(room.color, 0.34));
      }

      if (tileIndexAt(map, tx, room.y + room.h - 1) === TILE_TYPES.DOOR) {
        const cx = tx * ts + ts / 2;
        const cy = y0 + height + 9;
        renderer.drawRect(cx - 5, cy, 10, 2, hexToRgba(room.color, 0.52));
        renderer.drawRect(cx - 3, cy - 2, 6, 2, hexToRgba(room.color, 0.42));
        renderer.drawRect(cx - 1, cy - 4, 2, 2, hexToRgba(room.color, 0.34));
      }
    }

    // Portas laterais.
    for (let ty = room.y; ty < room.y + room.h; ty++) {
      if (tileIndexAt(map, room.x, ty) === TILE_TYPES.DOOR && room.x > 0) {
        const cx = x0 - 16;
        const cy = ty * ts + ts / 2;
        renderer.drawRect(cx, cy - 5, 2, 10, hexToRgba(room.color, 0.52));
        renderer.drawRect(cx + 2, cy - 3, 2, 6, hexToRgba(room.color, 0.42));
        renderer.drawRect(cx + 4, cy - 1, 2, 2, hexToRgba(room.color, 0.34));
      }

      if (tileIndexAt(map, room.x + room.w - 1, ty) === TILE_TYPES.DOOR) {
        const cx = x0 + width + 9;
        const cy = ty * ts + ts / 2;
        renderer.drawRect(cx, cy - 5, 2, 10, hexToRgba(room.color, 0.52));
        renderer.drawRect(cx - 2, cy - 3, 2, 6, hexToRgba(room.color, 0.42));
        renderer.drawRect(cx - 4, cy - 1, 2, 2, hexToRgba(room.color, 0.34));
      }
    }
  }
}

function drawCeilingLights(renderer, map) {
  const ts = map.tileSize;

  for (const room of map.roomDefs) {
    const cx = (room.x + room.w / 2) * ts;
    const top = room.y * ts + 7;

    renderer.drawGlow(cx, top + 18, 48, room.color, 0.035);

    renderer.drawRect(cx - 13, top, 26, 5, 'rgba(5, 10, 16, 0.76)');
    renderer.drawRect(cx - 11, top + 1, 22, 3, '#d7e6f2');
    renderer.drawRect(cx - 9, top + 1, 18, 1, '#ffffff');
    renderer.drawRect(cx - 12, top + 1, 2, 3, shadeColor(room.color, -30));
    renderer.drawRect(cx + 10, top + 1, 2, 3, shadeColor(room.color, -30));
  }

  if (map.phase) return;

  for (const [cx, cy] of HALL_LIGHTS) {
    renderer.drawGlow(cx, cy + 10, 38, '#ffffff', 0.025);
    renderer.drawRect(cx - 11, cy, 22, 4, 'rgba(5, 10, 16, 0.74)');
    renderer.drawRect(cx - 9, cy + 1, 18, 2, '#e8f2fb');
    renderer.drawRect(cx - 7, cy + 1, 14, 1, '#ffffff');
  }
}

function drawHallLane(renderer) {
  // Linha de circulação central, discreta o suficiente para não competir com o HUD.
  for (let y = 138; y < 340; y += 22) {
    renderer.drawRect(318, y, 4, 10, 'rgba(255, 193, 7, 0.16)');
    renderer.drawRect(319, y, 2, 8, 'rgba(255, 255, 255, 0.08)');
  }
}

export function drawDust(renderer, time) {
  for (let index = 0; index < 26; index++) {
    const hx = hash2d(index, 2, 17);
    const hy = hash2d(index, 5, 31);
    const speed = 0.10 + hash2d(index, 7, 43) * 0.18;
    const x = ((hx * 640 + time * (4 + speed * 12)) % 640 + 640) % 640;
    const y = (hy * 480 + Math.sin(time * 0.35 + index) * 7 + 480) % 480;
    const alpha = 0.035 + hash2d(index, 9, 57) * 0.075;
    const flicker = 0.8 + 0.2 * Math.sin(time * 1.7 + index * 2.3);
    renderer.drawRect(
      Math.floor(x),
      Math.floor(y),
      1,
      1,
      `rgba(255, 244, 214, ${(alpha * flicker).toFixed(3)})`
    );
  }
}

export function drawMapDetails(renderer, map, time = 0, options = {}) {
  if (!map) return;
  drawRoomBorders(renderer, map);
  if (!map.phase) {
    drawDoorGuides(renderer, map);
    drawHallLane(renderer);
  } else {
    drawPhaseAmbience(renderer, map);
  }
  drawCeilingLights(renderer, map);
  if (options.dust !== false) drawDust(renderer, time);
}

/**
 * Porta de saída da fase. Fica na parede direita e alterna entre bloqueada
 * (vermelha, com trava) e liberada (verde, com seta e cartaz de SAÍDA).
 */
export function drawPhaseDoor(renderer, exit, options = {}) {
  if (!exit) return;

  const { solved = false, color = COLORS.SAFETY_YELLOW, last = false } = options;
  const x = exit.x - 8;
  const y = exit.y - 8;
  const width = exit.w + 16;
  const height = exit.h + 16;
  const stateColor = solved ? (last ? '#ffd54f' : '#66bb6a') : '#e53935';

  if (solved) {
    renderer.drawGlow(exit.x + exit.w / 2, exit.y + exit.h / 2, 40, stateColor, 0.16);
  }

  renderer.drawRect(x + 3, y + 3, width, height, 'rgba(0, 0, 0, 0.46)');
  renderer.drawRect(x, y, width, height, '#0b131c');
  renderer.drawRect(x + 2, y + 2, width - 4, height - 4, solved ? '#153a2b' : '#2a1114');
  renderer.drawRect(x + 5, y + 5, width - 10, height - 10, solved ? '#0b241a' : '#16090d');

  // Painéis internos da porta.
  renderer.drawRect(x + 9, y + 8, width - 18, 2, solved ? '#2e7d32' : '#4e1f24');
  renderer.drawRect(x + 9, y + height - 10, width - 18, 2, solved ? '#2e7d32' : '#4e1f24');
  renderer.drawRect(x + 7, y + 12, 2, height - 24, solved ? '#1b5e20' : '#3e171b');
  renderer.drawRect(x + width - 9, y + 12, 2, height - 24, solved ? '#1b5e20' : '#3e171b');

  if (solved) {
    // Setas indicando a passagem.
    for (let index = 0; index < 3; index++) {
      const ax = exit.x - 32 + index * 8;
      const ay = exit.y + 27;
      renderer.drawRect(ax, ay, 4, 2, `rgba(102, 187, 106, ${0.55 + index * 0.12})`);
      renderer.drawRect(ax - 2, ay + 2, 4, 2, `rgba(102, 187, 106, ${0.40 + index * 0.12})`);
      renderer.drawRect(ax - 4, ay + 4, 4, 2, `rgba(102, 187, 106, ${0.28 + index * 0.12})`);
    }
  } else {
    // Grade e cadeado.
    for (let index = 0; index < 4; index++) {
      const barX = x + 12 + index * 8;
      renderer.drawRect(barX, y + 14, 3, height - 28, '#7f1d1d');
      renderer.drawRect(barX + 1, y + 14, 1, height - 28, '#ef5350');
    }
    renderer.drawRect(exit.x + 7, exit.y + 24, 18, 16, '#111111');
    renderer.drawRect(exit.x + 8, exit.y + 25, 16, 14, '#ffc107');
    renderer.drawRect(exit.x + 11, exit.y + 27, 10, 7, '#111111');
    renderer.drawRect(exit.x + 13, exit.y + 29, 6, 4, '#ffc107');
    renderer.drawRect(exit.x + 14, exit.y + 34, 4, 3, '#111111');
  }

  // Placa acima da porta.
  const signW = 88;
  const signH = 16;
  const signX = exit.x + exit.w / 2 - signW / 2;
  const signY = exit.y - 26;
  renderer.drawRect(signX + 2, signY + 2, signW, signH, 'rgba(0, 0, 0, 0.45)');
  renderer.drawRect(signX, signY, signW, signH, '#07111b');
  renderer.drawRect(signX + 1, signY + 1, signW - 2, signH - 2, solved ? '#1b5e20' : '#4a151a');
  renderer.drawRect(signX + 1, signY + 1, signW - 2, 1, solved ? '#a5d6a7' : '#ef9a9a');
  renderer.drawText(solved ? (last ? 'CERTIFICADO' : 'SAÍDA') : 'BLOQUEADA', signX + signW / 2, signY + 4, {
    color: solved ? '#ffffff' : '#ffcdd2',
    font: '8px "Consolas", "Lucida Console", monospace',
    align: 'center',
    shadow: false
  });

  // Pequeno marcador de cor da NR na moldura.
  renderer.drawRect(x, y, 3, height, color);
  renderer.drawRect(x, y + height - 3, width, 3, stateColor);
}
