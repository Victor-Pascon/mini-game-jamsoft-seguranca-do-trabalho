import { COLORS } from '../design-tokens/snes-theme.js';
import { wrapText } from '../engine/TextUtils.js';
import { drawChair } from './EquipmentRenderer.js';

function shadow(renderer, x, y, w, h) {
  renderer.drawRect(x + 2, y + h - 2, Math.max(2, w - 2), 3, 'rgba(0, 0, 0, 0.35)');
}

function labelAbove(renderer, text, x, y, color = COLORS.UI_TEXT) {
  renderer.drawText(text, x, y, {
    color,
    font: '7px "Consolas", "Lucida Console", monospace',
    align: 'center',
    shadow: true
  });
}

/**
 * Cenário procedural. Todos os props são desenhados com retângulos/círculos
 * simples para manter a estética pixel art SNES.
 *
 * Props não bloqueiam o movimento: são parte da narrativa visual dos setores.
 */
export function drawProp(renderer, prop, equipmentSystem = null, options = {}) {
  const { nearInteractive = false } = options;
  const { x, y, w, h } = prop;

  switch (prop.type) {
    case 'shelf': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#5d4037');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#3e2723');
      renderer.drawRect(x + 3, y + 4, w - 6, 2, '#8d6e63');
      renderer.drawRect(x + 3, y + h - 9, w - 6, 2, '#8d6e63');
      renderer.drawRect(x + 3, y + 5, 6, 5, COLORS.SAFETY_YELLOW);
      renderer.drawRect(x + 11, y + 5, 6, 5, COLORS.SAFETY_BLUE);
      renderer.drawRect(x + 19, y + 5, 6, 5, COLORS.SAFETY_RED);
      renderer.drawRect(x + 5, y + h - 15, 5, 5, '#a1887f');
      renderer.drawRect(x + 13, y + h - 15, 7, 5, '#8d6e63');
      break;
    }

    case 'sign': {
      const color = prop.color || COLORS.SAFETY_YELLOW;
      renderer.drawRect(x + 1, y + 1, w, h, 'rgba(0, 0, 0, 0.35)');
      renderer.drawRect(x, y, w, h, '#111111');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, color);
      if (prop.label === 'ALTA TENSÃO') {
        renderer.drawRect(x + w / 2 - 1, y + 4, 4, 5, '#111111');
        renderer.drawRect(x + w / 2 - 3, y + 8, 5, 4, '#111111');
        renderer.drawRect(x + w / 2 - 1, y + 10, 3, 5, '#111111');
      } else if (prop.label === 'RUÍDO') {
        renderer.drawRect(x + 4, y + 6, 3, 6, '#111111');
        renderer.drawRect(x + 7, y + 5, 3, 8, '#111111');
        renderer.drawRect(x + 10, y + 7, 3, 4, '#111111');
        renderer.drawRect(x + 3, y + 14, 12, 2, '#111111');
      } else {
        renderer.drawRect(x + w / 2 - 1, y + 4, 3, 7, '#111111');
        renderer.drawRect(x + w / 2 - 1, y + 13, 3, 2, '#111111');
      }
      break;
    }

    case 'board': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#37474f');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, prop.color || '#42a5f5');
      renderer.drawRect(x + 4, y + 4, w - 8, h - 8, '#eceff1');
      renderer.drawRect(x + 7, y + 8, w - 30, 2, '#90a4ae');
      renderer.drawRect(x + 7, y + 12, w - 24, 2, '#90a4ae');
      renderer.drawRect(x + 7, y + 16, w - 34, 2, '#90a4ae');
      renderer.drawRect(x + w - 15, y + 6, 8, 10, COLORS.SAFETY_YELLOW);
      renderer.drawRect(x + 4, y + 2, 3, 3, '#e53935');
      renderer.drawRect(x + w - 8, y + 2, 3, 3, '#43a047');
      labelAbove(renderer, 'PGR', x + w / 2, y - 8, COLORS.SAFETY_YELLOW);
      break;
    }

    case 'desk': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, prop.color || '#5d4037');
      renderer.drawRect(x + 2, y + 2, w - 4, 4, '#8d6e63');
      renderer.drawRect(x + 4, y + 8, 3, h - 8, '#3e2723');
      renderer.drawRect(x + w - 7, y + 8, 3, h - 8, '#3e2723');
      renderer.drawRect(x + 9, y + 8, w - 18, 3, '#4e342e');
      renderer.drawRect(x + 14, y + 3, 8, 5, '#ffffff');
      renderer.drawRect(x + 15, y + 4, 6, 1, '#90a4ae');
      renderer.drawRect(x + w - 18, y + 3, 5, 5, '#e53935');
      break;
    }

    case 'monitor': {
      renderer.drawRect(x, y, w, h, '#263238');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 5, '#0d47a1');
      renderer.drawRect(x + 3, y + 3, w - 6, 2, '#64b5f6');
      renderer.drawRect(x + 6, y + h - 3, 8, 3, '#111111');
      break;
    }

    case 'chair': {
      drawChair(renderer, x, y, Boolean(equipmentSystem?.has('cadeira')), w, h);
      break;
    }

    case 'plant': {
      renderer.drawRect(x + 4, y + 12, 6, 7, '#5d4037');
      renderer.drawRect(x + 2, y + 10, 10, 3, '#4e342e');
      renderer.drawRect(x + 5, y + 4, 3, 8, '#2e7d32');
      renderer.drawRect(x + 2, y + 5, 5, 3, '#43a047');
      renderer.drawRect(x + 7, y + 2, 4, 4, '#66bb6a');
      renderer.drawRect(x + 1, y + 8, 4, 3, '#388e3c');
      break;
    }

    case 'extinguisher': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x + 2, y + 5, w - 4, h - 5, '#b71c1c');
      renderer.drawRect(x + 3, y + 6, 3, h - 7, '#e53935');
      renderer.drawRect(x + 3, y, w - 6, 5, '#263238');
      renderer.drawRect(x + w - 5, y + 3, 3, 5, '#263238');
      renderer.drawRect(x + 4, y + 12, w - 8, 5, '#ffffff');
      renderer.drawRect(x + 6, y + 13, w - 12, 2, '#e53935');
      break;
    }

    case 'hosebox': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#b71c1c');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#e53935');
      renderer.drawRect(x + 5, y + 5, w - 10, h - 10, '#ffcdd2');
      renderer.drawRect(x + 7, y + 7, w - 14, h - 14, '#b71c1c');
      renderer.drawRect(x + 9, y + 9, w - 18, 3, '#ffcdd2');
      break;
    }

    case 'panel': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#263238');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, prop.color || '#f9a825');
      renderer.drawRect(x + 5, y + 5, w - 10, h - 10, '#37474f');
      renderer.drawRect(x + 8, y + 8, 5, 4, '#263238');
      renderer.drawRect(x + 15, y + 8, 5, 4, '#263238');
      renderer.drawRect(x + 8, y + 14, 5, 4, '#263238');
      renderer.drawRect(x + 15, y + 14, 5, 4, '#263238');
      renderer.drawRect(x + 8, y + 8, 2, 2, '#43a047');
      renderer.drawRect(x + 15, y + 8, 2, 2, '#e53935');
      break;
    }

    case 'noise': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#455a64');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, prop.color || '#78909c');
      renderer.drawRect(x + 5, y + 5, w - 10, 5, '#263238');
      renderer.drawRect(x + 5, y + 13, w - 10, 5, '#263238');
      renderer.drawRect(x + 5, y + 21, w - 10, 3, '#263238');
      for (let index = 0; index < 3; index++) {
        renderer.drawRect(x + w + 4 + index * 4, y + 5 + index * 2, 2, h - 10 - index * 4, '#ab47bc');
      }
      labelAbove(renderer, '85 dB(A)', x + w / 2, y - 8, '#ce93d8');
      break;
    }

    case 'machine': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#263238');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, prop.color || '#c62828');
      renderer.drawRect(x + 5, y + 5, w - 10, 8, '#90a4ae');
      renderer.drawRect(x + 7, y + 7, w - 14, 2, '#cfd8dc');

      const ctx = renderer.context;
      const cx = x + w / 2;
      const cy = y + h - 8;
      ctx.fillStyle = '#90a4ae';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#263238';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      renderer.drawRect(x + w - 10, y + 4, 4, 4, '#43a047');
      renderer.drawRect(x + w - 17, y + 4, 4, 4, '#e53935');
      renderer.drawRect(x + 4, y + h - 12, 8, 3, COLORS.SAFETY_YELLOW);
      break;
    }

    case 'conveyor': {
      renderer.drawRect(x, y, w, h, '#546e7a');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#263238');
      for (let index = 0; index < 6; index++) {
        renderer.drawRect(x + 4 + index * 7, y + 4, 3, 2, '#90a4ae');
      }
      renderer.drawRect(x + 8, y - 5, 8, 7, '#8d6e63');
      renderer.drawRect(x + 24, y - 5, 8, 7, '#a1887f');
      break;
    }

    case 'pallet': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y + 6, w, 8, '#8d6e63');
      renderer.drawRect(x + 2, y + 8, w - 4, 2, '#5d4037');
      renderer.drawRect(x + 2, y + 14, 3, 6, '#5d4037');
      renderer.drawRect(x + w - 5, y + 14, 3, 6, '#5d4037');
      renderer.drawRect(x + 5, y, 10, 8, '#a1887f');
      renderer.drawRect(x + 16, y + 2, 9, 6, '#8d6e63');
      break;
    }

    case 'boxes': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y + 2, w, h - 2, '#8d6e63');
      renderer.drawRect(x + 2, y, w - 4, h - 2, '#a1887f');
      renderer.drawRect(x + 2, y + 6, w - 4, 2, '#5d4037');
      renderer.drawRect(x + w / 2 - 1, y + 2, 2, h - 2, '#6d4c41');
      break;
    }

    case 'cone': {
      renderer.drawRect(x + 3, y + 4, w - 6, h - 4, '#e65100');
      renderer.drawRect(x + 2, y + h - 3, w - 4, 3, '#3e2723');
      renderer.drawRect(x + 4, y + 8, w - 8, 4, '#ffffff');
      renderer.drawRect(x + w / 2 - 1, y + 1, 2, h - 4, '#ffb74d');
      break;
    }

    case 'scaffold': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x + 2, y, 3, h, '#90a4ae');
      renderer.drawRect(x + w - 5, y, 3, h, '#90a4ae');
      renderer.drawRect(x, y + 8, w, 3, '#cfd8dc');
      renderer.drawRect(x, y + 22, w, 3, '#cfd8dc');
      renderer.drawRect(x, y + h - 3, w, 3, '#cfd8dc');
      renderer.drawRect(x + 5, y + 11, w - 10, 2, COLORS.SAFETY_YELLOW);
      renderer.drawRect(x + 5, y + 25, w - 10, 2, COLORS.SAFETY_YELLOW);
      renderer.drawRect(x + w - 8, y + 4, 4, 4, COLORS.SAFETY_RED);
      labelAbove(renderer, '2 m', x + w / 2, y - 8, '#b0bec5');
      break;
    }

    case 'anchor': {
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#546e7a');
      renderer.drawRect(x + 4, y + 4, w - 8, h - 8, '#90a4ae');
      renderer.drawRect(x + w / 2 - 2, y + 2, 4, h - 4, COLORS.SAFETY_YELLOW);
      renderer.drawRect(x + 2, y + h / 2 - 2, w - 4, 4, COLORS.SAFETY_YELLOW);
      break;
    }

    case 'mural': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#4a0e2e');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, prop.color || '#ec407a');
      renderer.drawRect(x + 4, y + 4, w - 8, 10, '#880e4f');
      renderer.drawText('MURAL DE NRS', x + w / 2, y + 5, {
        color: '#ffffff',
        font: '7px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: false
      });

      const chips = [
        '#1565c0', '#8e24aa', '#ff6f00', '#00897b',
        '#f9a825', '#2e7d32', '#c62828', '#6d4c41',
        '#e53935', '#455a64'
      ];
      chips.forEach((color, index) => {
        const col = index % 5;
        const row = Math.floor(index / 5);
        const chipX = x + 6 + col * 14;
        const chipY = y + 18 + row * 14;
        renderer.drawRect(chipX, chipY, 11, 11, '#ffffff');
        renderer.drawRect(chipX + 1, chipY + 1, 9, 9, color);
        renderer.drawRect(chipX + 3, chipY + 3, 5, 2, 'rgba(255, 255, 255, 0.75)');
      });

      if (nearInteractive) {
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 180);
        renderer.drawRect(x - 2, y - 2, w + 4, 2, `rgba(255, 215, 0, ${0.5 + pulse * 0.5})`);
        renderer.drawRect(x - 2, y + h, w + 4, 2, `rgba(255, 215, 0, ${0.5 + pulse * 0.5})`);
        renderer.drawRect(x - 2, y - 2, 2, h + 4, `rgba(255, 215, 0, ${0.5 + pulse * 0.5})`);
        renderer.drawRect(x + w, y - 2, 2, h + 4, `rgba(255, 215, 0, ${0.5 + pulse * 0.5})`);
      }
      break;
    }

    case 'bench': {
      renderer.drawRect(x, y, w, 5, '#8d6e63');
      renderer.drawRect(x + 3, y + 5, 3, h - 5, '#5d4037');
      renderer.drawRect(x + w - 6, y + 5, 3, h - 5, '#5d4037');
      renderer.drawRect(x + 2, y + 1, w - 4, 2, '#bcaaa4');
      break;
    }

    case 'stage': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#1b5e20');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 6, '#263238');
      renderer.drawRect(x, y, 8, h, '#b71c1c');
      renderer.drawRect(x + w - 8, y, 8, h, '#b71c1c');
      renderer.drawRect(x + 10, y + 4, w - 20, 8, '#0d3b66');
      renderer.drawText('JAMSOFT', x + w / 2, y + 5, {
        color: COLORS.SAFETY_YELLOW,
        font: '7px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: false
      });
      renderer.drawRect(x + 4, y + h - 4, w - 8, 3, '#5d4037');
      break;
    }

    case 'podium': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x + 2, y + 4, w - 4, h - 4, '#5d4037');
      renderer.drawRect(x, y, w, 4, '#8d6e63');
      renderer.drawRect(x + 4, y + 8, w - 8, 5, '#ffffff');
      renderer.drawRect(x + 5, y + 9, w - 10, 1, '#90a4ae');
      renderer.drawRect(x + 5, y + 11, 4, 1, '#90a4ae');
      renderer.drawRect(x + w / 2 + 3, y - 5, 1, 9, '#263238');
      renderer.drawRect(x + w / 2 + 1, y - 6, 5, 2, '#263238');
      break;
    }

    case 'watercooler': {
      renderer.drawRect(x, y + 8, w, h - 8, '#eceff1');
      renderer.drawRect(x + 2, y + 10, w - 4, h - 12, '#cfd8dc');
      renderer.drawRect(x + 3, y, w - 6, 10, '#4fc3f7');
      renderer.drawRect(x + 4, y + 2, 3, 6, '#b3e5fc');
      renderer.drawRect(x + 5, y + 16, 3, 3, '#2196f3');
      renderer.drawRect(x + 10, y + 16, 3, 3, '#f44336');
      break;
    }

    case 'locker': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#455a64');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#78909c');
      renderer.drawRect(x + 4, y + 4, w - 8, h - 8, '#546e7a');
      renderer.drawRect(x + 5, y + 6, w - 10, 1, '#263238');
      renderer.drawRect(x + 5, y + 9, w - 10, 1, '#263238');
      renderer.drawRect(x + 5, y + 12, w - 10, 1, '#263238');
      renderer.drawRect(x + w - 9, y + 14, 3, 2, '#cfd8dc');
      renderer.drawRect(x + 5, y + h - 10, w - 10, 5, '#eceff1');
      renderer.drawRect(x + 7, y + h - 9, w - 14, 3, '#1565c0');
      renderer.drawRect(x + 2, y + h - 2, 4, 2, '#263238');
      renderer.drawRect(x + w - 6, y + h - 2, 4, 2, '#263238');
      break;
    }

    case 'cabinet': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#37474f');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, prop.color || '#90a4ae');
      renderer.drawRect(x + 4, y + 4, w - 8, 7, '#cfd8dc');
      renderer.drawRect(x + 4, y + 13, w - 8, 7, '#b0bec5');
      renderer.drawRect(x + 4, y + 22, w - 8, 5, '#b0bec5');
      renderer.drawRect(x + w / 2 - 3, y + 7, 6, 2, '#263238');
      renderer.drawRect(x + w / 2 - 3, y + 16, 6, 2, '#263238');
      renderer.drawRect(x + w / 2 - 3, y + 24, 6, 1, '#263238');
      break;
    }

    case 'printer': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, w, h, '#263238');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#eceff1');
      renderer.drawRect(x + 3, y + 3, w - 6, 4, '#cfd8dc');
      renderer.drawRect(x + 5, y + 9, w - 10, 2, '#ffffff');
      renderer.drawRect(x + 6, y + 4, 3, 2, '#43a047');
      renderer.drawRect(x + 10, y + 4, 2, 2, '#e53935');
      renderer.drawRect(x + 4, y + h - 1, w - 8, 2, '#ffffff');
      break;
    }

    case 'fireAlarm': {
      renderer.drawRect(x, y, w, h, '#b71c1c');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#e53935');
      renderer.drawRect(x + 3, y + 3, w - 6, 4, '#ffffff');
      renderer.drawRect(x + 4, y + 4, w - 8, 2, '#b71c1c');
      renderer.drawRect(x + w / 2 - 2, y + 8, 4, 5, '#ffffff');
      renderer.drawRect(x + 2, y + h - 3, w - 4, 2, '#263238');
      break;
    }

    case 'helmetRack': {
      renderer.drawRect(x, y, w, h, '#5d4037');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#8d6e63');
      for (let index = 0; index < 3; index++) {
        const hx = x + 3 + index * 7;
        renderer.drawRect(hx, y + 5, 5, 2, COLORS.SAFETY_YELLOW);
        renderer.drawRect(hx - 1, y + 7, 7, 2, '#f9a825');
        renderer.drawRect(hx + 1, y + 9, 3, 1, '#263238');
      }
      renderer.drawRect(x + 2, y + h - 4, w - 4, 2, '#5d4037');
      break;
    }

    case 'cableReel': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#8d6e63');
      renderer.drawRect(x + 4, y + 4, w - 8, h - 8, '#4e342e');
      renderer.drawRect(x + 6, y + 6, w - 12, h - 12, '#1565c0');
      renderer.drawRect(x + 8, y + 8, w - 16, h - 16, '#42a5f5');
      renderer.drawRect(x + 3, y + h - 3, w - 6, 2, '#5d4037');
      renderer.drawRect(x + w - 5, y + 4, 3, h - 8, '#ffb74d');
      break;
    }

    case 'barrier': {
      renderer.drawRect(x + 3, y + h - 3, 4, 3, '#263238');
      renderer.drawRect(x + w - 7, y + h - 3, 4, 3, '#263238');
      renderer.drawRect(x, y + 3, w, 5, '#e65100');
      for (let index = 0; index < w; index += 8) {
        renderer.drawRect(x + index, y + 3, 4, 5, '#ffffff');
      }
      renderer.drawRect(x + 2, y + 2, 3, h - 2, '#ffb74d');
      renderer.drawRect(x + w - 5, y + 2, 3, h - 2, '#ffb74d');
      break;
    }

    case 'acousticPanel': {
      renderer.drawRect(x, y, w, h, '#311b3d');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#6a1b9a');
      for (let py = 4; py < h - 4; py += 6) {
        for (let px = 4; px < w - 4; px += 6) {
          renderer.drawRect(x + px, y + py, 3, 3, '#8e24aa');
        }
      }
      break;
    }

    case 'soundMeter': {
      renderer.drawRect(x + w / 2 - 1, y + 8, 2, h - 8, '#263238');
      renderer.drawRect(x + 2, y + 2, w - 4, 8, '#263238');
      renderer.drawRect(x + 3, y + 3, w - 6, 5, '#90a4ae');
      renderer.drawRect(x + 4, y + 4, w - 8, 3, '#43a047');
      renderer.drawRect(x + 2, y + h - 2, w - 4, 2, '#263238');
      break;
    }

    case 'safetyFence': {
      renderer.drawRect(x, y, 3, h, '#f9a825');
      renderer.drawRect(x + w - 3, y, 3, h, '#f9a825');
      renderer.drawRect(x, y + 2, w, 3, '#ffc107');
      renderer.drawRect(x, y + h - 4, w, 3, '#ffc107');
      for (let index = 5; index < w - 5; index += 8) {
        renderer.drawRect(x + index, y + 2, 4, 3, '#263238');
        renderer.drawRect(x + index, y + h - 4, 4, 3, '#263238');
      }
      break;
    }

    case 'toolcart': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y + 3, w, h - 3, '#b71c1c');
      renderer.drawRect(x + 2, y + 4, w - 4, 6, '#e53935');
      renderer.drawRect(x + 3, y + 5, 5, 3, '#90a4ae');
      renderer.drawRect(x + 10, y + 5, 4, 3, '#ffc107');
      renderer.drawRect(x + 2, y + 12, w - 4, 2, '#263238');
      renderer.drawRect(x + 3, y + h - 3, 3, 3, '#263238');
      renderer.drawRect(x + w - 6, y + h - 3, 3, 3, '#263238');
      break;
    }

    case 'forklift': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x + 8, y + 4, w - 20, h - 10, '#f9a825');
      renderer.drawRect(x + 10, y + 6, w - 24, 6, '#ffc107');
      renderer.drawRect(x + 12, y + 13, 10, 7, '#263238');
      renderer.drawRect(x + 14, y + 14, 6, 4, '#546e7a');
      renderer.drawRect(x + w - 13, y + 2, 4, h - 8, '#263238');
      renderer.drawRect(x + w - 9, y + 4, 2, h - 12, '#90a4ae');
      renderer.drawRect(x + 2, y + h - 8, w - 12, 3, '#546e7a');
      renderer.drawRect(x + 2, y + h - 5, w - 12, 2, '#263238');
      renderer.drawRect(x + 9, y + h - 4, 4, 3, '#111111');
      renderer.drawRect(x + w - 17, y + h - 4, 4, 3, '#111111');
      renderer.drawRect(x + 10, y + 5, 2, 2, '#ffffff');
      break;
    }

    case 'tote': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y + 2, w, h - 2, '#1565c0');
      renderer.drawRect(x + 2, y, w - 4, 3, '#42a5f5');
      renderer.drawRect(x + 3, y + 5, w - 6, h - 8, '#0d47a1');
      renderer.drawRect(x + 4, y + 6, w - 8, 2, '#ffffff');
      renderer.drawRect(x + 4, y + 6, 5, 2, '#ffc107');
      renderer.drawRect(x + 4, y + 10, w - 8, 1, '#64b5f6');
      break;
    }

    case 'harnessRack': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y, 2, h, '#546e7a');
      renderer.drawRect(x + w - 2, y, 2, h, '#546e7a');
      renderer.drawRect(x, y, w, 2, '#90a4ae');
      renderer.drawRect(x + 4, y + 3, 6, 7, '#ffc107');
      renderer.drawRect(x + 6, y + 6, 2, 8, '#263238');
      renderer.drawRect(x + 12, y + 3, 6, 7, '#ffc107');
      renderer.drawRect(x + 14, y + 6, 2, 8, '#263238');
      renderer.drawRect(x + 8, y + 12, 2, 5, '#263238');
      renderer.drawRect(x + 13, y + 12, 2, 5, '#263238');
      break;
    }

    case 'trash': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y + 2, w, h - 2, '#455a64');
      renderer.drawRect(x + 2, y + 4, w - 4, h - 6, '#78909c');
      renderer.drawRect(x + 1, y, w - 2, 4, '#263238');
      renderer.drawRect(x + 3, y + 2, w - 6, 1, '#cfd8dc');
      renderer.drawRect(x + w / 2 - 1, y + 7, 2, 5, '#263238');
      break;
    }

    case 'speaker': {
      renderer.drawRect(x + 2, y + h - 4, w - 4, 3, '#263238');
      renderer.drawRect(x + w / 2 - 1, y + 8, 2, h - 10, '#546e7a');
      renderer.drawRect(x + 1, y + 2, w - 2, 10, '#111111');
      renderer.drawRect(x + 3, y + 4, w - 6, 3, '#546e7a');
      renderer.drawRect(x + w / 2 - 2, y + 7, 4, 3, '#90a4ae');
      renderer.drawRect(x + w / 2 - 2, y + 12, 4, 2, '#ffc107');
      break;
    }

    case 'normPoster': {
      const accent = prop.color || COLORS.SAFETY_YELLOW;
      renderer.drawRect(x + 3, y + 3, w, h, 'rgba(0, 0, 0, 0.40)');
      renderer.drawRect(x, y, w, h, '#07111b');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#0d2030');
      renderer.drawRect(x, y, w, 3, accent);
      renderer.drawRect(x, y, 4, h, accent);
      renderer.drawRect(x + 4, y, w - 4, 1, 'rgba(255, 255, 255, 0.18)');

      renderer.drawRect(x + 10, y + 8, w - 20, 17, 'rgba(0, 0, 0, 0.36)');
      renderer.drawRect(x + 10, y + 8, 4, 17, accent);
      renderer.drawText(prop.norm || 'NR', x + 19, y + 10, {
        color: accent,
        font: '9px "Consolas", "Lucida Console", monospace',
        shadow: true
      });
      renderer.drawText(String(prop.title || '').toUpperCase(), x + 58, y + 11, {
        color: COLORS.UI_TEXT,
        font: '8px "Consolas", "Lucida Console", monospace',
        shadow: false,
        maxWidth: w - 72
      });

      let lineY = y + 30;
      const rules = Array.isArray(prop.lines) ? prop.lines.slice(0, 3) : [];
      for (const rule of rules) {
        const wrapped = wrapText(rule, 42);
        for (let index = 0; index < wrapped.length; index++) {
          renderer.drawText(index === 0 ? '•' : ' ', x + 12, lineY, {
            color: accent,
            font: '8px "Consolas", "Lucida Console", monospace',
            shadow: false
          });
          renderer.drawText(wrapped[index], x + 20, lineY, {
            color: '#d6e2ec',
            font: '7px "Consolas", "Lucida Console", monospace',
            shadow: false
          });
          lineY += 8;
        }
      }

      renderer.drawRect(x + 10, y + h - 11, w - 20, 1, 'rgba(255, 255, 255, 0.10)');
      renderer.drawText('RESUMO EDUCATIVO', x + 12, y + h - 9, {
        color: COLORS.UI_TEXT_DIM,
        font: '7px "Consolas", "Lucida Console", monospace',
        shadow: false
      });
      break;
    }

    case 'earmuffStation': {
      shadow(renderer, x, y, w, h);
      renderer.drawRect(x, y + 2, w, h - 2, '#37474f');
      renderer.drawRect(x + 2, y + 4, w - 4, h - 6, '#546e7a');
      renderer.drawRect(x + 3, y, w - 6, 4, '#90a4ae');
      renderer.drawRect(x + 5, y + 8, 12, 12, '#ffc107');
      renderer.drawRect(x + 7, y + 10, 8, 8, '#f9a825');
      renderer.drawRect(x + 24, y + 8, 12, 12, '#ffc107');
      renderer.drawRect(x + 26, y + 10, 8, 8, '#f9a825');
      renderer.drawRect(x + 5, y + 20, 38, 2, '#263238');
      renderer.drawRect(x + 12, y + 27, 32, 3, '#111111');
      break;
    }

    case 'floorSign': {
      renderer.drawRect(x + 2, y + 2, w, h, 'rgba(0, 0, 0, 0.32)');
      renderer.drawRect(x, y, w, h, '#f9a825');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#ffc107');
      for (let index = 4; index < w - 8; index += 14) {
        renderer.drawRect(x + index, y + 3, 8, 2, '#111111');
        renderer.drawRect(x + index + 4, y + h - 5, 8, 2, '#111111');
      }
      renderer.drawText(prop.label || '', x + w / 2, y + h / 2 - 4, {
        color: '#111111',
        font: '9px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: false
      });
      break;
    }

    case 'exitSign': {
      renderer.drawRect(x + 2, y + 2, w, h, 'rgba(0, 0, 0, 0.42)');
      renderer.drawRect(x, y, w, h, '#1b5e20');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#2e7d32');
      renderer.drawRect(x + 3, y + 3, w - 6, 1, '#a5d6a7');
      renderer.drawRect(x + 7, y + 8, 10, 10, '#ffffff');
      renderer.drawRect(x + 9, y + 10, 3, 6, '#2e7d32');
      renderer.drawRect(x + 13, y + 12, 3, 3, '#2e7d32');
      renderer.drawText('SAÍDA', x + 23, y + 9, {
        color: '#ffffff',
        font: '8px "Consolas", "Lucida Console", monospace',
        shadow: false
      });
      break;
    }

    case 'ladder': {
      renderer.drawRect(x, y, 3, h, '#90a4ae');
      renderer.drawRect(x + w - 3, y, 3, h, '#90a4ae');
      for (let index = 4; index < h - 2; index += 9) {
        renderer.drawRect(x + 2, y + index, w - 4, 3, '#cfd8dc');
        renderer.drawRect(x + 2, y + index + 2, w - 4, 1, '#607d8b');
      }
      renderer.drawRect(x - 2, y, 2, h, 'rgba(0, 0, 0, 0.20)');
      break;
    }

    case 'fireBlanket': {
      renderer.drawRect(x + 2, y + 2, w, h, 'rgba(0, 0, 0, 0.32)');
      renderer.drawRect(x, y, w, h, '#b71c1c');
      renderer.drawRect(x + 2, y + 2, w - 4, h - 4, '#e53935');
      renderer.drawRect(x + 3, y + 3, w - 6, 8, '#ffcdd2');
      renderer.drawText('MANTA', x + w / 2, y + 5, {
        color: '#b71c1c',
        font: '7px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: false
      });
      renderer.drawRect(x + 4, y + 15, w - 8, 2, '#ffffff');
      renderer.drawRect(x + 4, y + 20, w - 8, 2, '#ffffff');
      renderer.drawRect(x + w / 2 - 2, y + h - 9, 4, 5, '#263238');
      break;
    }

    default: {
      renderer.drawRect(x, y, w, h, 'rgba(255, 255, 255, 0.08)');
      break;
    }
  }
}

export function isNearProp(player, prop, radius = 50) {
  if (!prop) return false;
  const playerX = player.x + player.width / 2;
  const playerY = player.y + player.height / 2;
  const propX = prop.x + prop.w / 2;
  const propY = prop.y + prop.h / 2;
  const dx = playerX - propX;
  const dy = playerY - propY;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}

export function getNearbyInteractiveProp(player, props = []) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (const prop of props) {
    if (!prop.interactive) continue;
    const playerX = player.x + player.width / 2;
    const playerY = player.y + player.height / 2;
    const propX = prop.x + prop.w / 2;
    const propY = prop.y + prop.h / 2;
    const distance = Math.hypot(playerX - propX, playerY - propY);

    if (distance <= 56 && distance < nearestDistance) {
      nearest = prop;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function drawRoomLabels(renderer, map) {
  if (!map) return;

  for (const room of map.roomDefs) {
    const centerX = (room.x + room.w / 2) * map.tileSize;
    // A primeira linha de salas fica parcialmente sob a barra superior do HUD.
    // Por isso, o rótulo desce para y=48 apenas nessa linha.
    const topY = room.y === 1 ? 48 : room.y * map.tileSize + 5;
    const label = room.phaseLabel
      || (room.norm ? room.norm : room.name.split(' ')[0].toUpperCase());
    const width = Math.max(38, label.length * 6 + 14);

    renderer.drawRect(centerX - width / 2 + 2, topY + 2, width, 12, 'rgba(0, 0, 0, 0.38)');
    renderer.drawRect(centerX - width / 2, topY, width, 12, 'rgba(5, 11, 18, 0.76)');
    renderer.drawRect(centerX - width / 2, topY, 3, 12, room.color);
    renderer.drawRect(centerX + width / 2 - 3, topY, 3, 12, room.color);
    renderer.drawRect(centerX - width / 2 + 3, topY, width - 6, 1, 'rgba(255, 255, 255, 0.15)');

    renderer.drawText(label, centerX, topY + 2, {
      color: room.color,
      font: '9px "Consolas", "Lucida Console", monospace',
      align: 'center',
      shadow: true
    });
  }
}
