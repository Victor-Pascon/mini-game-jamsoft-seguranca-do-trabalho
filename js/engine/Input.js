/**
 * Input - captura de teclado com suporte a WASD, setas, Espaço, Enter, Z e atalhos.
 * Mantém o padrão do mini-game original: game loop via requestAnimationFrame.
 */
const GAME_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'Space', 'Enter', 'KeyZ', 'Escape', 'Backspace',
  'KeyM', 'KeyF', 'KeyV', 'KeyH', 'KeyR',
  'Digit1', 'Digit2', 'Digit3', 'Digit4',
  'PageUp', 'PageDown'
]);

export class Input {
  constructor() {
    this._keys = {};
    this._justPressed = {};
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
  }

  isDown(code) {
    return this._keys[code] === true;
  }

  isJustPressed(code) {
    if (this._justPressed[code]) {
      this._justPressed[code] = false;
      return true;
    }
    return false;
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

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    return { x: dx, y: dy };
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
  }
}
