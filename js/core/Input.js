const BLOCKED = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
const isTyping = (e) => e.target && e.target.closest && e.target.closest('input, select, textarea');

export class Input {
  constructor() {
    this.keys = new Set();
    this.pressed = new Set();
    this.released = new Set();

    window.addEventListener('keydown', (e) => {
      if (isTyping(e)) return;
      if (BLOCKED.includes(e.code)) e.preventDefault();
      if (!this.keys.has(e.code)) this.pressed.add(e.code);
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      if (isTyping(e)) return;
      if (this.keys.delete(e.code)) this.released.add(e.code);
    });
    window.addEventListener('blur', () => this.keys.clear());
  }

  clear() {
    this.keys.clear(); this.pressed.clear(); this.released.clear();
  }

  direction() {
    let x = 0, y = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) x -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) x += 1;
    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) y -= 1;
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) y += 1;
    const len = Math.hypot(x, y);
    return len ? { x: x / len, y: y / len } : { x: 0, y: 0 };
  }

  isKick() { return this.keys.has('Space'); }
  isSprint() { return this.keys.has('ShiftLeft') || this.keys.has('ShiftRight'); }

  // true una sola vez por pulsación / por soltada
  consumePress(code) {
    const had = this.pressed.has(code);
    this.pressed.delete(code);
    return had;
  }
  consumeRelease(code) {
    const had = this.released.has(code);
    this.released.delete(code);
    return had;
  }
}
