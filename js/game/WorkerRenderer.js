import { COLORS, hexToRgba, hash2d } from '../design-tokens/snes-theme.js';
import { drawWorkerSprite } from './CharacterRenderer.js';
import { drawOverlay } from './EquipmentRenderer.js';

/**
 * WorkerRenderer - funcionários de cenário.
 *
 * Cada fase tem uma pequena equipe trabalhando no seu posto. O funcionário
 * usa o mesmo sprite base do jogador/NPC, recebe os EPIs representativos da
 * NR da sala e ganha uma ferramenta/efeito sutil para parecer em atividade.
 * Nada aqui participa da colisão ou da progressão: é ambientação.
 */

const TAG_FONT = '600 7px "Consolas", "Lucida Console", monospace';

function drawTaskTag(renderer, worker) {
  const text = String(worker.task || '').trim();
  if (!text) return;

  const width = Math.max(38, Math.ceil(text.length * 4.4) + 12);
  const x = Math.round(worker.x + 12 - width / 2);
  const y = Math.round(worker.y - 22);
  const accent = worker.color || COLORS.SAFETY_YELLOW;

  renderer.drawRect(x + 1, y + 1, width, 10, 'rgba(0, 0, 0, 0.45)');
  renderer.drawRect(x, y, width, 10, 'rgba(5, 13, 20, 0.88)');
  renderer.drawRect(x, y, 2, 10, accent);
  renderer.drawRect(x + 2, y, width - 2, 1, 'rgba(255, 255, 255, 0.10)');
  renderer.drawText(text, x + 6, y + 2, {
    color: '#e6edf3',
    font: TAG_FONT,
    shadow: false
  });
}

function drawTool(renderer, worker) {
  const x = Math.floor(worker.x);
  const y = Math.floor(worker.y);

  switch (worker.tool) {
    case 'scanner':
      renderer.drawRect(x + 20, y + 12, 4, 8, '#263238');
      renderer.drawRect(x + 21, y + 13, 2, 4, '#7ee787');
      renderer.drawRect(x + 21, y + 18, 2, 1, '#455a64');
      break;
    case 'box':
      renderer.drawRect(x + 20, y + 13, 9, 8, '#4e342e');
      renderer.drawRect(x + 21, y + 14, 7, 6, '#8d6e63');
      renderer.drawRect(x + 23, y + 12, 3, 2, '#bcaaa4');
      renderer.drawRect(x + 24, y + 15, 1, 4, 'rgba(255, 255, 255, 0.22)');
      break;
    case 'wrench':
      renderer.drawRect(x + 21, y + 12, 2, 8, '#90a4ae');
      renderer.drawRect(x + 20, y + 10, 4, 3, '#cfd8dc');
      renderer.drawRect(x + 21, y + 11, 2, 1, '#455a64');
      break;
    case 'meter':
      renderer.drawRect(x + 20, y + 11, 6, 9, '#263238');
      renderer.drawRect(x + 21, y + 12, 4, 4, '#a5d6a7');
      renderer.drawRect(x + 21, y + 17, 4, 1, '#ffc107');
      renderer.drawRect(x + 22, y + 19, 2, 1, '#546e7a');
      break;
    case 'hose':
      renderer.drawRect(x + 20, y + 13, 5, 6, '#37474f');
      renderer.drawRect(x + 22, y + 12, 8, 2, '#b71c1c');
      renderer.drawRect(x + 29, y + 11, 3, 4, '#cfd8dc');
      renderer.drawRect(x + 30, y + 12, 1, 2, '#78909c');
      break;
    case 'probe':
      renderer.drawRect(x + 21, y + 10, 1, 10, '#ffd54f');
      renderer.drawRect(x + 20, y + 9, 3, 3, '#263238');
      renderer.drawRect(x + 21, y + 10, 1, 1, '#ff5252');
      break;
    case 'flag':
      renderer.drawRect(x + 21, y + 10, 1, 12, '#e0e0e0');
      renderer.drawRect(x + 22, y + 10, 8, 5, '#26a69a');
      renderer.drawRect(x + 23, y + 11, 5, 1, '#b2dfdb');
      break;
    case 'tablet':
      renderer.drawRect(x + 20, y + 11, 8, 10, '#111722');
      renderer.drawRect(x + 21, y + 12, 6, 7, '#4dd0e1');
      renderer.drawRect(x + 22, y + 13, 4, 1, '#e0f7fa');
      renderer.drawRect(x + 22, y + 15, 3, 1, '#00838f');
      break;
    default:
      break;
  }
}

function drawEffect(renderer, worker, time) {
  const x = Math.floor(worker.x);
  const y = Math.floor(worker.y);
  const accent = worker.color || COLORS.SAFETY_YELLOW;

  switch (worker.effect) {
    case 'scan': {
      const pulse = 0.45 + 0.33 * Math.sin(time * 4.2 + worker.x * 0.05);
      renderer.drawRect(x + 25, y + 15, 9, 1, `rgba(126, 231, 135, ${pulse.toFixed(2)})`);
      renderer.drawRect(x + 33, y + 16, 3, 1, `rgba(126, 231, 135, ${(pulse * 0.6).toFixed(2)})`);
      break;
    }

    case 'spark': {
      for (let index = 0; index < 3; index++) {
        const phase = time * 6 + index * 2.1 + worker.y * 0.03;
        if (Math.sin(phase) < 0.1) continue;
        const sx = x + 24 + Math.round(hash2d(index, worker.x, 11) * 5);
        const sy = y + 8 + Math.round(hash2d(index, worker.y, 13) * 8);
        const alpha = 0.35 + 0.4 * Math.abs(Math.sin(phase * 1.7));
        renderer.drawRect(sx, sy, 1, 1, `rgba(255, 235, 120, ${alpha.toFixed(2)})`);
        renderer.drawRect(sx + 1, sy - 1, 1, 1, `rgba(255, 255, 255, ${(alpha * 0.5).toFixed(2)})`);
      }
      break;
    }

    case 'noise': {
      const pulse = 0.25 + 0.25 * Math.abs(Math.sin(time * 4.5 + worker.x * 0.02));
      renderer.drawRect(x + 27, y + 5, 2, 4, `rgba(206, 147, 216, ${pulse.toFixed(2)})`);
      renderer.drawRect(x + 30, y + 3, 2, 8, `rgba(206, 147, 216, ${(pulse * 0.8).toFixed(2)})`);
      renderer.drawRect(x + 33, y + 1, 2, 12, `rgba(206, 147, 216, ${(pulse * 0.55).toFixed(2)})`);
      break;
    }

    case 'heat': {
      for (let index = 0; index < 3; index++) {
        const phase = time * 1.8 + index * 2.4 + worker.x * 0.02;
        const rise = (phase % 1) * 12;
        const hx = x + 5 + index * 5 + Math.round(Math.sin(phase * 3) * 2);
        const hy = y + 13 - rise;
        const alpha = Math.max(0, 0.4 - rise * 0.03);
        renderer.drawRect(hx, hy, 1, 2, `rgba(255, 138, 64, ${alpha.toFixed(2)})`);
      }
      break;
    }

    case 'electric': {
      const flicker = Math.sin(time * 11 + worker.y * 0.1);
      if (flicker < 0.25) break;
      renderer.drawRect(x + 22, y + 8, 1, 3, 'rgba(255, 235, 59, 0.8)');
      renderer.drawRect(x + 23, y + 10, 2, 1, 'rgba(255, 235, 59, 0.6)');
      renderer.drawRect(x + 25, y + 7, 1, 3, 'rgba(255, 255, 255, 0.7)');
      break;
    }

    case 'signal': {
      const pulse = 0.2 + 0.35 * Math.abs(Math.sin(time * 3.4 + worker.x * 0.02));
      renderer.drawGlow(x + 12, y + 20, 24, accent, 0.05);
      renderer.drawRect(x + 22, y + 8, 2, 2, `rgba(255, 255, 255, ${pulse.toFixed(2)})`);
      renderer.drawRect(x + 20, y + 10, 6, 1, hexToRgba(accent, pulse * 0.8));
      break;
    }

    case 'dust': {
      for (let index = 0; index < 2; index++) {
        const phase = time * 1.1 + index * 3.1 + worker.x * 0.04;
        const dx = x + 3 + Math.round((Math.sin(phase) + 1) * 6);
        const alpha = 0.10 + 0.08 * Math.abs(Math.cos(phase));
        renderer.drawRect(dx, y + 22 - (index % 2), 1, 1, `rgba(220, 225, 230, ${alpha.toFixed(2)})`);
      }
      break;
    }

    case 'paper': {
      const drift = Math.sin(time * 2.2 + worker.x * 0.03);
      renderer.drawRect(x + 25, y + 12, 1, 1, 'rgba(255, 255, 255, 0.55)');
      renderer.drawRect(x + 27 + Math.round(drift * 2), y + 9, 1, 1, 'rgba(255, 255, 255, 0.42)');
      renderer.drawRect(x + 24, y + 7, 1, 1, 'rgba(255, 255, 255, 0.30)');
      break;
    }

    case 'screen': {
      const pulse = 0.10 + 0.08 * Math.abs(Math.sin(time * 3.8));
      renderer.drawGlow(x + 24, y + 15, 18, '#4dd0e1', pulse);
      renderer.drawRect(x + 21, y + 12, 1, 1, 'rgba(224, 247, 250, 0.7)');
      break;
    }

    default:
      break;
  }
}

export function drawWorker(renderer, worker, time = 0) {
  if (!worker) return;

  drawWorkerSprite(renderer, worker, { time });
  drawOverlay(
    renderer,
    { x: worker.x, y: worker.y, width: 24, height: 24 },
    new Set(worker.equipment || []),
    0,
    0
  );
  drawTool(renderer, worker);
  drawEffect(renderer, worker, time);
  drawTaskTag(renderer, worker);
}
