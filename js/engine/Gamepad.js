/**
 * Mapeamento do controle Xbox (Standard Gamepad).
 *
 * O jogo continua recebendo ações no mesmo formato do teclado: direções viram
 * setas, A vira confirmação e B vira Escape. O analógico esquerdo também
 * fornece um vetor contínuo para a movimentação do personagem.
 */
export const GAMEPAD_BUTTONS = Object.freeze({
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  VIEW: 8,
  MENU: 9,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15
});

export const GAMEPAD_DEADZONE = 0.35;

const BUTTON_THRESHOLD = 0.5;

function isPressed(buttons, index) {
  const button = buttons?.[index];
  if (!button) return false;

  if (button.pressed === true) return true;
  return Number(button.value) >= BUTTON_THRESHOLD;
}

function axisValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

/**
 * Converte um Gamepad da API do navegador em ações estáveis do jogo.
 * Retorna null quando não há controle disponível.
 */
export function readGamepad(gamepad) {
  if (!gamepad) return null;

  const buttons = gamepad.buttons || [];
  const axes = gamepad.axes || [];
  const axisX = axisValue(axes[0]);
  const axisY = axisValue(axes[1]);
  const magnitude = Math.hypot(axisX, axisY);

  let movementX = 0;
  let movementY = 0;

  if (magnitude > GAMEPAD_DEADZONE) {
    const scaled = Math.min(
      1,
      (magnitude - GAMEPAD_DEADZONE) / (1 - GAMEPAD_DEADZONE)
    );
    movementX = (axisX / magnitude) * scaled;
    movementY = (axisY / magnitude) * scaled;
  }

  const dpad = {
    up: isPressed(buttons, GAMEPAD_BUTTONS.DPAD_UP),
    down: isPressed(buttons, GAMEPAD_BUTTONS.DPAD_DOWN),
    left: isPressed(buttons, GAMEPAD_BUTTONS.DPAD_LEFT),
    right: isPressed(buttons, GAMEPAD_BUTTONS.DPAD_RIGHT)
  };

  const directions = { ...dpad };

  // Em menus, o analógico usa apenas o eixo dominante para evitar diagonais
  // acidentais ao navegar por listas.
  if (magnitude > GAMEPAD_DEADZONE && !dpad.up && !dpad.down && !dpad.left && !dpad.right) {
    if (Math.abs(axisX) >= Math.abs(axisY)) {
      directions.left = axisX < 0;
      directions.right = axisX > 0;
    } else {
      directions.up = axisY < 0;
      directions.down = axisY > 0;
    }
  }

  return {
    index: Number.isInteger(gamepad.index) ? gamepad.index : 0,
    connected: gamepad.connected !== false,
    buttons: {
      a: isPressed(buttons, GAMEPAD_BUTTONS.A),
      b: isPressed(buttons, GAMEPAD_BUTTONS.B),
      x: isPressed(buttons, GAMEPAD_BUTTONS.X),
      y: isPressed(buttons, GAMEPAD_BUTTONS.Y),
      start: isPressed(buttons, GAMEPAD_BUTTONS.MENU),
      view: isPressed(buttons, GAMEPAD_BUTTONS.VIEW)
    },
    directions,
    movement: {
      x: movementX,
      y: movementY
    }
  };
}
