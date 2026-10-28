export class Entity {
  constructor(options = {}) {
    this._x = options.x ?? 0;
    this._y = options.y ?? 0;
    this._width = options.width ?? 32;
    this._height = options.height ?? 32;
    this._speed = options.speed ?? 150;
    this._color = options.color ?? '#ffffff';
    this._visible = options.visible !== false;
  }

  get x() { return this._x; }
  get y() { return this._y; }
  get width() { return this._width; }
  get height() { return this._height; }
  get speed() { return this._speed; }
  get color() { return this._color; }
  get visible() { return this._visible; }

  set x(value) { this._x = value; }
  set y(value) { this._y = value; }

  getCenterX() {
    return this._x + this._width / 2;
  }

  getCenterY() {
    return this._y + this._height / 2;
  }

  getBounds() {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    };
  }

  distanceTo(other) {
    const dx = this.getCenterX() - other.getCenterX();
    const dy = this.getCenterY() - other.getCenterY();
    return Math.sqrt(dx * dx + dy * dy);
  }

  move(dx, dy, deltaTime) {
    this._x += dx * this._speed * deltaTime;
    this._y += dy * this._speed * deltaTime;
  }

  moveTo(x, y) {
    this._x = x;
    this._y = y;
  }

  setPosition(x, y) {
    this._x = x;
    this._y = y;
  }

  render(renderer) {
    if (!this._visible) return;
    renderer.drawRect(this._x, this._y, this._width, this._height, this._color);
  }

  update(deltaTime) {
    // Implementado pelas subclasses.
  }
}
