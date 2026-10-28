import { COLORS, FONTS } from '../design-tokens/snes-theme.js';

const CONFETTI_COLORS = [
  COLORS.SAFETY_YELLOW,
  COLORS.SAFETY_ORANGE,
  COLORS.SAFETY_GREEN,
  COLORS.SAFETY_BLUE,
  '#ffffff',
  '#ec407a'
];

function drawSeal(renderer, cx, cy, radius) {
  const ctx = renderer.context;

  ctx.fillStyle = COLORS.SAFETY_YELLOW_DARK;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0d1622';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.SAFETY_YELLOW;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 8, 0, Math.PI * 2);
  ctx.stroke();

  renderer.drawText('SESMT', cx, cy - 13, {
    color: COLORS.SAFETY_YELLOW,
    font: '9px "Consolas", "Lucida Console", monospace',
    align: 'center',
    shadow: false
  });
  renderer.drawText('SEGURANÇA', cx, cy - 2, {
    color: '#ffffff',
    font: '6px "Consolas", "Lucida Console", monospace',
    align: 'center',
    shadow: false
  });
  renderer.drawText('TRABALHO', cx, cy + 6, {
    color: '#ffffff',
    font: '6px "Consolas", "Lucida Console", monospace',
    align: 'center',
    shadow: false
  });

  renderer.drawRect(cx - 15, cy + 15, 4, 4, COLORS.SAFETY_YELLOW);
  renderer.drawRect(cx + 11, cy + 15, 4, 4, COLORS.SAFETY_YELLOW);
}

/**
 * Certificado final da feira.
 * Exibe os 10 EPIs conquistados, as NRs estudadas e um selo do SESMT.
 */
export class Certificate {
  constructor() {
    this._active = false;
    this._finished = false;
    this._time = 0;
    this._particles = [];
    this._showInput = false;
  }

  start() {
    this._active = true;
    this._finished = false;
    this._time = 0;
    this._showInput = false;
    this._particles = Array.from({ length: 70 }, () => this._newParticle(true));
  }

  _newParticle(initial = false) {
    return {
      x: Math.random() * 640,
      y: initial ? Math.random() * 480 : -10,
      vx: (Math.random() - 0.5) * 26,
      vy: 22 + Math.random() * 46,
      size: 2 + Math.floor(Math.random() * 3),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    };
  }

  update(deltaTime, input) {
    if (!this._active) return;

    this._time += deltaTime;

    for (const particle of this._particles) {
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      if (particle.y > 488) {
        particle.y = -8;
        particle.x = Math.random() * 640;
      }
      if (particle.x < -8) particle.x = 648;
      if (particle.x > 648) particle.x = -8;
    }

    if (this._time > 2.2) {
      this._showInput = true;
    }

    if (this._showInput && input.confirmPressed()) {
      this._active = false;
      this._finished = true;
    }
  }

  isActive() {
    return this._active;
  }

  isFinished() {
    return this._finished;
  }

  render(renderer, equipmentSystem) {
    renderer.clear('#050a10');

    const ctx = renderer.context;
    const gradient = ctx.createLinearGradient(0, 0, 0, 480);
    gradient.addColorStop(0, '#0b1a2b');
    gradient.addColorStop(0.5, '#081018');
    gradient.addColorStop(1, '#050a10');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 480);

    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.SAFETY_YELLOW, '#111111', 12);

    renderer.drawParticles(this._particles);

    // Painel do certificado
    renderer.drawRect(42, 26, 560, 418, 'rgba(0, 0, 0, 0.55)');
    renderer.drawRect(40, 24, 560, 418, COLORS.SAFETY_YELLOW_DARK);
    renderer.drawRect(42, 26, 556, 414, '#0d1622');
    renderer.drawRect(46, 30, 548, 406, '#0a111b');
    renderer.drawRect(46, 30, 548, 3, COLORS.SAFETY_YELLOW);
    renderer.drawRect(46, 433, 548, 3, COLORS.SAFETY_YELLOW);

    // Confete em primeiro plano, bem sutil, para dar profundidade ao painel.
    renderer.drawParticles(this._particles.slice(0, 22), 0.25);

    // Cantos ornamentais
    const corners = [
      [48, 32], [584, 32], [48, 424], [584, 424]
    ];
    for (const [cornerX, cornerY] of corners) {
      renderer.drawRect(cornerX, cornerY, 8, 8, COLORS.SAFETY_YELLOW);
      renderer.drawRect(cornerX + 2, cornerY + 2, 4, 4, COLORS.SAFETY_ORANGE);
    }

    renderer.drawText('JAMSOFT TECNOLOGIA', 320, 46, {
      color: COLORS.SAFETY_BLUE,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawText('CERTIFICADO DE SEGURANÇA DO TRABALHO', 320, 66, {
      color: COLORS.SAFETY_YELLOW,
      font: '18px "Consolas", "Lucida Console", monospace',
      align: 'center',
      glow: true
    });

    renderer.drawRect(120, 92, 400, 2, COLORS.SAFETY_YELLOW_DARK);
    renderer.drawRect(200, 96, 240, 1, COLORS.SAFETY_YELLOW);

    renderer.drawText('Certificamos que', 320, 110, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawText('GUARDIÃO DA SEGURANÇA', 320, 128, {
      color: COLORS.SAFETY_ORANGE,
      font: '30px "Consolas", "Lucida Console", monospace',
      align: 'center',
      glow: true
    });

    renderer.drawText('concluiu a jornada educativa de Segurança do Trabalho', 320, 166, {
      color: COLORS.UI_TEXT,
      font: FONTS.SMALL,
      align: 'center',
      shadow: true
    });

    renderer.drawText('e conquistou os 10 itens de proteção:', 320, 184, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    if (equipmentSystem) {
      equipmentSystem.renderPreview(renderer, 148, 200, 30, 5);
    }

    renderer.drawText(
      'NR-1 • NR-6 • NR-10 • NR-11 • NR-12 • NR-15 • NR-17 • NR-23 • NR-26 • NR-35',
      320,
      244,
      {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.TINY,
        align: 'center',
        shadow: false
      }
    );

    renderer.drawText('Certificado educativo emitido na Feira de Segurança do Trabalho', 320, 266, {
      color: COLORS.UI_TEXT,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    const date = new Date().toLocaleDateString('pt-BR');
    renderer.drawText(`${date} — Itabaiana/SE`, 320, 286, {
      color: COLORS.UI_TEXT_DIM,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    // Assinaturas
    renderer.drawRect(90, 356, 170, 1, COLORS.SAFETY_YELLOW_DARK);
    renderer.drawText('Equipe SESMT', 175, 362, {
      color: COLORS.UI_TEXT,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });
    renderer.drawText('Segurança e Saúde no Trabalho', 175, 376, {
      color: COLORS.UI_TEXT_DIM,
      font: '8px "Consolas", "Lucida Console", monospace',
      align: 'center',
      shadow: false
    });

    renderer.drawRect(380, 356, 170, 1, COLORS.SAFETY_YELLOW_DARK);
    renderer.drawText('JAMSOFT TECNOLOGIA', 465, 362, {
      color: COLORS.UI_TEXT,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });
    renderer.drawText('Feira de Segurança do Trabalho', 465, 376, {
      color: COLORS.UI_TEXT_DIM,
      font: '8px "Consolas", "Lucida Console", monospace',
      align: 'center',
      shadow: false
    });

    drawSeal(renderer, 320, 350, 28);

    renderer.drawText(
      'Certificado válido como atividade educativa. Consulte as NRs oficiais e o SESMT.',
      320,
      406,
      {
        color: COLORS.UI_TEXT_DIM,
        font: '8px "Consolas", "Lucida Console", monospace',
        align: 'center',
        shadow: false
      }
    );

    if (this._showInput) {
      const blink = Math.sin(this._time * 6) > -0.2;
      if (blink) {
        renderer.drawText('A / ESPAÇO para voltar ao início', 320, 456, {
          color: COLORS.SAFETY_YELLOW,
          font: FONTS.PRIMARY,
          align: 'center',
          glow: true
        });
      }
    } else {
      renderer.drawText('Preparando seu certificado...', 320, 456, {
        color: COLORS.UI_TEXT_DIM,
        font: FONTS.SMALL,
        align: 'center',
        shadow: false
      });
    }
  }
}
