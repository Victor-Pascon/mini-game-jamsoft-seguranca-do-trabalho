import { readGamepad } from './Gamepad.js';

/**
 * Input - captura teclado e controle Xbox (Standard Gamepad).
 * Mantém o padrão do mini-game original: game loop via requestAnimationFrame.
 *
 * O controle é traduzido para as mesmas ações lógicas do teclado:
 * A = confirmação, B = voltar, X = manual, Y = inventário, Start = menu,
 * D-pad = setas e analógico esquerdo = vetor de movimento.
 */
const GAME_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'Space', 'Enter', 'KeyZ', 'Escape', 'Backspace',
  'KeyM', 'KeyF', 'KeyV', 'KeyH', 'KeyR', 'KeyI',
  'Digit1', 'Digit2', 'Digit3', 'Digit4',
  'PageUp', 'PageDown'
]);

export class Input {
  constructor() {
    this._keys = {};
    this._justPressed = {};
    this._gamepadKeys = {};
    this._gamepadJustPressed = {};
    this._gamepadMovement = { x: 0, y: 0 };
    this._gamepadConnected = false;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._setupListeners();
  }

  _setupListeners() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);
  }

  _onKeyDown(event) {
    if (GAME_KEYS.has(event.code) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
    }
    if (!this._keys[event.code]) {
      this._justPressed[event.code] = true;
    }
    this._keys[event.code] = true;
  }

  _onKeyUp(event) {
    this._keys[event.code] = false;
  }

  _onBlur() {
    this._keys = {};
    this._justPressed = {};
    this._clearGamepad();
  }

  _clearGamepad() {
    this._gamepadKeys = {};
    this._gamepadJustPressed = {};
    this._gamepadMovement = { x: 0, y: 0 };
  }

  _findGamepad() {
    try {
      if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
        return null;
      }

      const gamepads = navigator.getGamepads();
      if (!gamepads) return null;

      for (let index = 0; index < gamepads.length; index++) {
        const gamepad = gamepads[index];
        if (gamepad && gamepad.connected !== false) return gamepad;
      }
    } catch {
      // A API pode ser bloqueada pelo navegador; o teclado continua funcionando.
    }

    return null;
  }

  _applyGamepad(state) {
    const virtualKeys = {
      ArrowUp: state.directions.up,
      ArrowDown: state.directions.down,
      ArrowLeft: state.directions.left,
      ArrowRight: state.directions.right,
      Space: state.buttons.a,
      Escape: state.buttons.b,
      KeyM: state.buttons.x,
      KeyI: state.buttons.y,
      Start: state.buttons.start
    };

    for (const [code, pressed] of Object.entries(virtualKeys)) {
      if (pressed && !this._gamepadKeys[code]) {
        this._gamepadJustPressed[code] = true;
      }
      this._gamepadKeys[code] = pressed;
    }

    this._gamepadMovement = state.movement;
  }

  /** Polling do controle; deve ser chamado uma vez por frame. */
  update() {
    const gamepad = this._findGamepad();
    const state = readGamepad(gamepad);

    if (!state) {
      this._clearGamepad();
      this._gamepadConnected = false;
      return;
    }

    this._gamepadConnected = true;
    this._applyGamepad(state);
  }

  /** Descarta apenas os eventos de "acabou de pressionar" do frame atual. */
  endFrame() {
    this._justPressed = {};
    this._gamepadJustPressed = {};
  }

  isGamepadConnected() {
    return this._gamepadConnected;
  }

  isDown(code) {
    return this._keys[code] === true || this._gamepadKeys[code] === true;
  }

  isJustPressed(code) {
    let pressed = false;

    if (this._justPressed[code]) {
      this._justPressed[code] = false;
      pressed = true;
    }

    if (this._gamepadJustPressed[code]) {
      this._gamepadJustPressed[code] = false;
      pressed = true;
    }

    return pressed;
  }

  anyJustPressed(codes) {
    for (const code of codes) {
      if (this.isJustPressed(code)) return true;
    }
    return false;
  }

  confirmPressed() {
    return this.isJustPressed('Space')
      || this.isJustPressed('Enter')
      || this.isJustPressed('KeyZ');
  }

  getDirection() {
    let dx = 0;
    let dy = 0;

    if (this.isDown('ArrowUp') || this.isDown('KeyW')) dy -= 1;
    if (this.isDown('ArrowDown') || this.isDown('KeyS')) dy += 1;
    if (this.isDown('ArrowLeft') || this.isDown('KeyA')) dx -= 1;
    if (this.isDown('ArrowRight') || this.isDown('KeyD')) dx += 1;

    // O analógico esquerdo mantém a intensidade para uma caminhada suave.
    dx += this._gamepadMovement.x;
    dy += this._gamepadMovement.y;

    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }

    return { x: dx, y: dy };
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
    this._clearGamepad();
  }
}
