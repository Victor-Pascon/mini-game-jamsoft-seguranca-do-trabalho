import { COLORS, FONTS } from '../design-tokens/snes-theme.js';
import { formatDateTime, formatDuration } from '../engine/PlayerDatabase.js';

const RANKING_ROWS = 10;
const DATA_ROWS = 4;
const RANKING_ROW_HEIGHT = 26;
const DATA_ROW_HEIGHT = 72;
const MEDAL_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32'];

function clampPage(page, totalRows, rowsPerPage) {
  const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  return Math.max(0, Math.min(pageCount - 1, page));
}

function drawBackground(renderer) {
  renderer.clear(COLORS.JAMSOFT_BLACK);

  const ctx = renderer.context;
  const gradient = ctx.createLinearGradient(0, 0, 0, 480);
  gradient.addColorStop(0, '#101820');
  gradient.addColorStop(0.55, '#0b0b0b');
  gradient.addColorStop(1, '#050505');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 640, 480);

  renderer.drawHazardStripes(0, 0, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
  renderer.drawHazardStripes(0, 474, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
}

function drawButton(renderer, x, y, width, height, label, selected, time) {
  renderer.drawRect(x + 3, y + 3, width, height, 'rgba(0, 0, 0, 0.42)');
  renderer.drawRect(x, y, width, height, selected ? COLORS.JAMSOFT_WHITE : '#3a3a3a');
  renderer.drawRect(x + 2, y + 2, width - 4, height - 4, selected ? '#2a070a' : '#111111');
  renderer.drawRect(x, y, 4, height, selected ? COLORS.JAMSOFT_RED : '#2d2d2d');

  if (selected) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 5);
    renderer.drawRect(x, y, width, 2, `rgba(255, 59, 74, ${0.45 + pulse * 0.4})`);
  }

  renderer.drawText(label, x + width / 2, y + 9, {
    color: selected ? COLORS.JAMSOFT_WHITE : COLORS.JAMSOFT_SMOKE,
    font: FONTS.SMALL,
    align: 'center',
    shadow: true
  });
}

/**
 * RankingScreen - ranking de conclusão e consulta dos cadastros.
 * A navegação funciona com setas/D-pad, A/Enter e B/Escape.
 */
export class RankingScreen {
  constructor(database, sound) {
    this._database = database;
    this._sound = sound;
    this._open = false;
    this._closed = false;
    this._mode = 'ranking';
    this._time = 0;
    this._page = 0;
    this._dataPage = 0;
    this._action = 1;
    this._ranking = [];
    this._players = [];
    this._stats = { total: 0, completed: 0, inProgress: 0, bestTime: null, attempts: 0 };
  }

  open() {
    this._open = true;
    this._closed = false;
    this._mode = 'ranking';
    this._time = 0;
    this._page = 0;
    this._dataPage = 0;
    this._action = 1;
    this._refresh();
    // Traz o ranking do servidor; só atualiza se a tela ainda estiver aberta.
    this._database.refresh?.().then((synced) => {
      if (synced && this._open) this._refresh();
    });
  }

  close() {
    this._open = false;
    this._closed = false;
    this._mode = 'ranking';
  }

  isOpen() {
    return this._open;
  }

  consumeClosed() {
    const closed = this._closed;
    this._closed = false;
    return closed;
  }

  _refresh() {
    this._players = this._database.getAll().sort((a, b) => {
      return String(b.registeredAt).localeCompare(String(a.registeredAt));
    });
    this._ranking = this._database.getRanking();
    this._stats = this._database.getStats();
  }

  _changePage(delta, totalRows, rowsPerPage, property) {
    const next = clampPage(this[property] + delta, totalRows, rowsPerPage);
    if (next !== this[property]) {
      this[property] = next;
      this._sound?.playSelect();
    }
  }

  update(deltaTime, input) {
    if (!this._open) return;

    this._time += deltaTime;

    if (this._mode === 'data') {
      if (input.isJustPressed('ArrowUp') || input.isJustPressed('PageUp')) {
        this._changePage(-1, this._players.length, DATA_ROWS, '_dataPage');
      }
      if (input.isJustPressed('ArrowDown') || input.isJustPressed('PageDown')) {
        this._changePage(1, this._players.length, DATA_ROWS, '_dataPage');
      }
      if (
        input.isJustPressed('Escape') ||
        input.isJustPressed('Start') ||
        input.isJustPressed('Backspace')
      ) {
        this._mode = 'ranking';
        this._action = 1;
        this._sound?.playSelect();
      }
      return;
    }

    if (input.isJustPressed('ArrowUp') || input.isJustPressed('PageUp')) {
      this._changePage(-1, this._ranking.length, RANKING_ROWS, '_page');
    }
    if (input.isJustPressed('ArrowDown') || input.isJustPressed('PageDown')) {
      this._changePage(1, this._ranking.length, RANKING_ROWS, '_page');
    }
    if (input.isJustPressed('ArrowLeft')) {
      this._action = 0;
      this._sound?.playSelect();
    }
    if (input.isJustPressed('ArrowRight')) {
      this._action = 1;
      this._sound?.playSelect();
    }

    if (input.isJustPressed('Escape') || input.isJustPressed('Start')) {
      this._closed = true;
      return;
    }

    if (input.confirmPressed()) {
      if (this._action === 1) {
        this._mode = 'data';
        this._dataPage = 0;
        this._sound?.playSelect();
      } else {
        this._closed = true;
      }
    }
  }

  _renderRanking(renderer) {
    const ranking = this._ranking;
    const pageCount = Math.max(1, Math.ceil(ranking.length / RANKING_ROWS));
    this._page = clampPage(this._page, ranking.length, RANKING_ROWS);
    const pageRows = ranking.slice(
      this._page * RANKING_ROWS,
      this._page * RANKING_ROWS + RANKING_ROWS
    );

    renderer.drawText('RANKING DA FEIRA', 320, 22, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.DISPLAY,
      align: 'center',
      glow: true
    });
    renderer.drawText('Tempo de conclusão — do menor para o maior', 320, 62, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawText(
      `${this._stats.total} cadastrados  •  ${this._stats.completed} concluíram  •  melhor tempo: ${
        this._stats.bestTime === null ? '--:--' : formatDuration(this._stats.bestTime)
      }`,
      320,
      80,
      {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.TINY,
        align: 'center',
        shadow: false
      }
    );

    renderer.drawPanel(32, 96, 576, 288, {
      bg: '#0b0b0b',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });

    if (!pageRows.length) {
      renderer.drawText('Nenhum participante concluiu a jornada ainda.', 320, 214, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.PRIMARY,
        align: 'center',
        shadow: false
      });
      renderer.drawText('Os cadastros podem ser consultados em VER DADOS.', 320, 238, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        align: 'center',
        shadow: false
      });
    }

    pageRows.forEach((player, index) => {
      const position = this._page * RANKING_ROWS + index;
      const y = 108 + index * RANKING_ROW_HEIGHT;
      const accent = MEDAL_COLORS[position] || '#3f3f3f';
      const rowFill = index % 2 === 0 ? '#101010' : '#0c0c0c';

      renderer.drawRect(42, y, 556, RANKING_ROW_HEIGHT - 2, rowFill);
      renderer.drawRect(42, y, 3, RANKING_ROW_HEIGHT - 2, accent);

      renderer.drawText(`${position + 1}º`, 54, y + 6, {
        color: accent,
        font: FONTS.SMALL,
        shadow: false
      });

      renderer.drawText(player.name || 'Participante', 92, y + 2, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.SMALL,
        maxWidth: 230,
        shadow: true
      });
      renderer.drawText(player.company || 'Empresa não informada', 92, y + 13, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        maxWidth: 280,
        shadow: false
      });

      renderer.drawText(formatDuration(player.bestCompletionTime), 584, y + 6, {
        color: position < 3 ? accent : COLORS.SAFETY_YELLOW,
        font: FONTS.SMALL,
        align: 'right',
        shadow: false
      });
    });

    if (pageCount > 1) {
      renderer.drawText(`página ${this._page + 1}/${pageCount}`, 584, 372, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        align: 'right',
        shadow: false
      });
    }

    drawButton(renderer, 180, 400, 120, 32, 'VOLTAR', this._action === 0, this._time);
    drawButton(renderer, 340, 400, 120, 32, 'VER DADOS', this._action === 1, this._time);

    renderer.drawText('←/→ escolhe  •  A/ENTER confirma  •  B/ESC volta', 320, 448, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
    renderer.drawText('↑/↓ ou PAGE UP/PAGE DOWN percorre o ranking', 320, 462, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
  }

  _renderData(renderer) {
    const total = this._players.length;
    const pageCount = Math.max(1, Math.ceil(total / DATA_ROWS));
    this._dataPage = clampPage(this._dataPage, total, DATA_ROWS);
    const pageRows = this._players.slice(
      this._dataPage * DATA_ROWS,
      this._dataPage * DATA_ROWS + DATA_ROWS
    );

    renderer.drawText('DADOS DOS PARTICIPANTES', 320, 20, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.DISPLAY,
      align: 'center',
      glow: true
    });
    renderer.drawText('Cadastros e tempos registrados neste navegador', 320, 60, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawText(
      `${this._stats.total} cadastrados  •  ${this._stats.completed} concluíram  •  ${this._stats.inProgress} em andamento  •  ${this._stats.attempts} tentativas`,
      320,
      78,
      {
        color: COLORS.SAFETY_YELLOW,
        font: FONTS.TINY,
        align: 'center',
        shadow: false
      }
    );

    renderer.drawPanel(24, 94, 592, 296, {
      bg: '#0b0b0b',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });

    if (!pageRows.length) {
      renderer.drawText('Nenhum participante cadastrado.', 320, 210, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.PRIMARY,
        align: 'center',
        shadow: false
      });
    }

    pageRows.forEach((player, index) => {
      const y = 104 + index * DATA_ROW_HEIGHT;
      const completed = player.bestCompletionTime !== null;
      const accent = completed ? COLORS.SAFETY_GREEN : COLORS.SAFETY_YELLOW;

      renderer.drawRect(36, y, 568, DATA_ROW_HEIGHT - 4, index % 2 === 0 ? '#101010' : '#0c0c0c');
      renderer.drawRect(36, y, 3, DATA_ROW_HEIGHT - 4, accent);

      renderer.drawText(`${this._dataPage * DATA_ROWS + index + 1}. ${player.name || 'Sem nome'}`, 50, y + 4, {
        color: COLORS.JAMSOFT_WHITE,
        font: FONTS.SMALL,
        maxWidth: 490,
        shadow: true
      });
      renderer.drawText(`Empresa: ${player.company || '—'}`, 50, y + 17, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        maxWidth: 536,
        shadow: false
      });
      renderer.drawText(`E-mail: ${player.email || '—'}`, 50, y + 30, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        maxWidth: 350,
        shadow: false
      });
      renderer.drawText(`Tel: ${player.phone || '—'}`, 406, y + 30, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        maxWidth: 180,
        shadow: false
      });

      const status = completed
        ? `CONCLUÍDO • melhor tempo: ${formatDuration(player.bestCompletionTime)}`
        : `EM ANDAMENTO • fase ${player.phase + 1}/10`;
      renderer.drawText(`${status}  •  tentativas: ${player.attempts}`, 50, y + 43, {
        color: accent,
        font: FONTS.TINY,
        maxWidth: 380,
        shadow: false
      });
      renderer.drawText(`Cadastro: ${formatDateTime(player.registeredAt)}`, 584, y + 43, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        align: 'right',
        maxWidth: 190,
        shadow: false
      });
    });

    if (pageCount > 1) {
      renderer.drawText(`página ${this._dataPage + 1}/${pageCount}`, 584, 396, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        align: 'right',
        shadow: false
      });
    }

    renderer.drawText('B/ESC volta ao ranking  •  ↑/↓ ou PAGE UP/PAGE DOWN muda página', 320, 420, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
    renderer.drawText('Dados armazenados localmente para a operação da feira.', 320, 446, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
  }

  render(renderer) {
    drawBackground(renderer);
    if (this._mode === 'data') {
      this._renderData(renderer);
    } else {
      this._renderRanking(renderer);
    }
  }
}
