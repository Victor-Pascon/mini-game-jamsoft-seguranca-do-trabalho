import { COLORS, FONTS } from '../design-tokens/snes-theme.js';

const FIELDS = [
  {
    key: 'name',
    label: 'NOME COMPLETO',
    placeholder: 'Como devemos chamar você?',
    maxLength: 40,
    kind: 'text'
  },
  {
    key: 'company',
    label: 'EMPRESA',
    placeholder: 'Onde você trabalha?',
    maxLength: 48,
    kind: 'text'
  },
  {
    key: 'email',
    label: 'E-MAIL',
    placeholder: 'seuemail@empresa.com',
    maxLength: 70,
    kind: 'email'
  },
  {
    key: 'phone',
    label: 'TELEFONE',
    placeholder: '(79) 99999-9999',
    maxLength: 24,
    kind: 'phone'
  }
];

function normalizePhone(value) {
  return String(value || '').replace(/[^\d+()\-\s]/g, '');
}

function validate(values) {
  const errors = [];

  if (String(values.name || '').trim().length < 2) {
    errors.push({ field: 0, message: 'Informe seu nome completo.' });
  }
  if (String(values.company || '').trim().length < 2) {
    errors.push({ field: 1, message: 'Informe o nome da empresa.' });
  }

  const email = String(values.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.push({ field: 2, message: 'Informe um e-mail válido.' });
  }

  const phoneDigits = String(values.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.push({ field: 3, message: 'Informe um telefone com 8 a 15 dígitos.' });
  }

  return errors;
}

function drawField(renderer, field, value, x, y, width, active, time) {
  const boxHeight = 30;
  const border = active ? COLORS.JAMSOFT_RED_LIGHT : '#3a3a3a';
  const fill = active ? '#1a1112' : '#101010';

  renderer.drawRect(x + 2, y + 2, width, boxHeight, 'rgba(0, 0, 0, 0.42)');
  renderer.drawRect(x, y, width, boxHeight, border);
  renderer.drawRect(x + 2, y + 2, width - 4, boxHeight - 4, fill);

  if (active) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 5);
    renderer.drawRect(x, y, width, 2, `rgba(255, 59, 74, ${0.45 + pulse * 0.4})`);
    renderer.drawRect(x, y, 3, boxHeight, COLORS.JAMSOFT_RED);
  }

  renderer.drawText(field.label, x, y - 16, {
    color: active ? COLORS.JAMSOFT_WHITE : COLORS.JAMSOFT_SMOKE,
    font: FONTS.TINY,
    shadow: false
  });

  const hasValue = value.length > 0;
  const cursor = active && Math.sin(time * 5) > -0.15 ? '|' : '';
  const displayValue = hasValue ? `${value}${cursor}` : active ? `${field.placeholder}${cursor}` : field.placeholder;

  renderer.drawText(displayValue, x + 12, y + 8, {
    color: hasValue ? COLORS.JAMSOFT_WHITE : '#6f6f6f',
    font: FONTS.SMALL,
    maxWidth: width - 24,
    shadow: false
  });
}

/**
 * Formulário de cadastro desenhado no canvas.
 * O teclado fornece os caracteres; D-pad/analógico e A/B cuidam da navegação.
 */
export class RegistrationForm {
  constructor(sound) {
    this._sound = sound;
    this._open = false;
    this._time = 0;
    this._focus = 0;
    this._values = this._emptyValues();
    this._error = '';
    this._submitted = null;
    this._cancelled = false;
  }

  _emptyValues() {
    return FIELDS.reduce((values, field) => {
      values[field.key] = '';
      return values;
    }, {});
  }

  open() {
    this._open = true;
    this._time = 0;
    this._focus = 0;
    this._values = this._emptyValues();
    this._error = '';
    this._submitted = null;
    this._cancelled = false;
  }

  close() {
    this._open = false;
    this._focus = 0;
    this._values = this._emptyValues();
    this._error = '';
    this._submitted = null;
    this._cancelled = false;
  }

  isOpen() {
    return this._open;
  }

  consumeSubmitted() {
    const data = this._submitted ? { ...this._submitted } : null;
    this._submitted = null;
    return data;
  }

  consumeCancelled() {
    const cancelled = this._cancelled;
    this._cancelled = false;
    return cancelled;
  }

  _moveFocus(delta) {
    this._focus = (this._focus + delta + FIELDS.length + 1) % (FIELDS.length + 1);
    this._error = '';
    this._sound?.playSelect();
  }

  _applyText(events) {
    if (this._focus >= FIELDS.length) return;

    const field = FIELDS[this._focus];
    let value = this._values[field.key] || '';

    for (const event of events) {
      if (event.type === 'backspace') {
        value = value.slice(0, -1);
        continue;
      }

      if (event.type !== 'char') continue;
      const next = field.kind === 'phone' ? normalizePhone(event.value) : event.value;
      if (!next) continue;

      const candidate = `${value}${next}`;
      if (candidate.length > field.maxLength) continue;
      if (field.kind === 'email' && /\s/.test(next)) continue;
      value = candidate;
    }

    this._values[field.key] = value;
    this._error = '';
  }

  _submit() {
    const errors = validate(this._values);
    if (errors.length) {
      this._focus = errors[0].field;
      this._error = errors[0].message;
      this._sound?.playWrong();
      return;
    }

    this._submitted = {
      name: this._values.name.trim(),
      company: this._values.company.trim(),
      email: this._values.email.trim(),
      phone: this._values.phone.trim()
    };
    this._error = '';
    this._sound?.playStart();
  }

  update(deltaTime, input) {
    if (!this._open) return;

    this._time += deltaTime;
    this._applyText(input.consumeTextInput());

    const tabPressed = input.isJustPressed('Tab');
    const shiftPressed = input.isDown('ShiftLeft') || input.isDown('ShiftRight');

    if (input.isJustPressed('ArrowUp') || (tabPressed && shiftPressed)) {
      this._moveFocus(-1);
    } else if (input.isJustPressed('ArrowDown') || tabPressed) {
      this._moveFocus(1);
    }

    if (input.isJustPressed('Escape') || input.isJustPressed('Start')) {
      this._cancelled = true;
      return;
    }

    const keyboardConfirm = input.isJustPressed('Enter');
    const gamepadConfirm = input.isGamepadJustPressed('Space');

    if (keyboardConfirm || gamepadConfirm) {
      if (this._focus < FIELDS.length - 1) {
        this._moveFocus(1);
      } else if (this._focus === FIELDS.length - 1) {
        this._focus = FIELDS.length;
        this._sound?.playSelect();
      } else {
        this._submit();
      }
    }
  }

  render(renderer) {
    renderer.clear(COLORS.JAMSOFT_BLACK);

    const ctx = renderer.context;
    const gradient = ctx.createLinearGradient(0, 0, 0, 480);
    gradient.addColorStop(0, '#1c090b');
    gradient.addColorStop(0.55, '#0c0c0c');
    gradient.addColorStop(1, '#050505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 480);

    renderer.drawHazardStripes(0, 0, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
    renderer.drawHazardStripes(0, 474, 640, 6, COLORS.JAMSOFT_RED, COLORS.JAMSOFT_BLACK, 12);
    renderer.drawGlow(320, 44, 180, COLORS.JAMSOFT_RED, 0.15);

    renderer.drawText('CADASTRO DO PARTICIPANTE', 320, 20, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.DISPLAY,
      align: 'center',
      glow: true
    });

    renderer.drawText('Preencha seus dados para entrar no ranking da feira.', 320, 62, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.SMALL,
      align: 'center',
      shadow: false
    });

    renderer.drawPanel(56, 84, 528, 356, {
      bg: '#0b0b0b',
      border: COLORS.JAMSOFT_RED_DARK,
      inner: '#050505'
    });

    renderer.drawText('DADOS DO PARTICIPANTE', 78, 96, {
      color: COLORS.JAMSOFT_RED_LIGHT,
      font: FONTS.TINY,
      shadow: false
    });

    const fieldX = 88;
    const fieldW = 464;
    const fieldYs = [134, 186, 238, 290];

    FIELDS.forEach((field, index) => {
      drawField(
        renderer,
        field,
        this._values[field.key] || '',
        fieldX,
        fieldYs[index],
        fieldW,
        this._focus === index,
        this._time
      );
    });

    if (this._error) {
      renderer.drawText(this._error, fieldX, 326, {
        color: COLORS.UI_DANGER,
        font: FONTS.TINY,
        maxWidth: fieldW,
        shadow: false
      });
    } else {
      renderer.drawText('Todos os campos são obrigatórios.', fieldX, 326, {
        color: COLORS.JAMSOFT_SMOKE,
        font: FONTS.TINY,
        shadow: false
      });
    }

    const submitSelected = this._focus === FIELDS.length;
    const buttonX = 88;
    const buttonY = 344;
    const buttonW = 464;
    const buttonH = 34;

    renderer.drawRect(buttonX + 3, buttonY + 3, buttonW, buttonH, 'rgba(0, 0, 0, 0.42)');
    renderer.drawRect(
      buttonX,
      buttonY,
      buttonW,
      buttonH,
      submitSelected ? COLORS.JAMSOFT_WHITE : COLORS.JAMSOFT_RED_DARK
    );
    renderer.drawRect(
      buttonX + 2,
      buttonY + 2,
      buttonW - 4,
      buttonH - 4,
      submitSelected ? '#2a070a' : '#13090a'
    );
    renderer.drawRect(buttonX, buttonY, 4, buttonH, COLORS.JAMSOFT_RED);

    if (submitSelected) {
      const pulse = 0.5 + 0.5 * Math.sin(this._time * 5);
      renderer.drawRect(buttonX, buttonY, buttonW, 2, `rgba(255, 59, 74, ${0.45 + pulse * 0.4})`);
    }

    renderer.drawText('COMEÇAR JOGO', 320, buttonY + 9, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.PRIMARY,
      align: 'center',
      glow: submitSelected
    });

    renderer.drawText('Os dados ficam salvos somente neste navegador/dispositivo.', 320, 388, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });

    renderer.drawText('↑/↓ ou TAB troca campo  •  ENTER/A avança  •  ESC/B volta', 320, 450, {
      color: COLORS.JAMSOFT_WHITE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
    renderer.drawText('Digite com o teclado. O controle navega entre os campos.', 320, 464, {
      color: COLORS.JAMSOFT_SMOKE,
      font: FONTS.TINY,
      align: 'center',
      shadow: false
    });
  }
}
