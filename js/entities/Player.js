import { PLAYER, PITCH, FORMATION } from '../config.js';

export class Player {
  constructor(data) {
    this.name = data.name;
    this.number = data.number;
    this.skin = data.skin;
    this.team = data.team;
    this.role = data.role;
    this.speed = data.speed ?? PLAYER.speed;
    this.radius = PLAYER.radius;

    this.x = 0; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.facing = { x: this.team === 'home' ? 1 : -1, y: 0 };
    this.kickTimer = 0;
    this.controlled = false;
    this.resetPosition();
  }

  // Posición base según rol y equipo
  get homeSpot() {
    const f = FORMATION[this.role];
    const fx = this.team === 'home' ? f.x : 1 - f.x;
    return {
      x: PITCH.left + fx * (PITCH.right - PITCH.left),
      y: PITCH.top + f.y * (PITCH.bottom - PITCH.top),
    };
  }

  resetPosition() {
    const s = this.homeSpot;
    this.x = s.x; this.y = s.y;
    this.vx = 0; this.vy = 0;
    this.kickTimer = 0;
  }

  setDirection(dx, dy, factor = 1) {
    this.vx = dx * this.speed * factor;
    this.vy = dy * this.speed * factor;
    if (dx || dy) this.facing = { x: dx, y: dy };
  }

  moveToward(tx, ty, factor = 1) {
    const dx = tx - this.x, dy = ty - this.y;
    const d = Math.hypot(dx, dy);
    if (d < 4) return this.setDirection(0, 0);
    this.setDirection(dx / d, dy / d, factor);
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.x = Math.min(PITCH.right - this.radius, Math.max(PITCH.left + this.radius, this.x));
    this.y = Math.min(PITCH.bottom - this.radius, Math.max(PITCH.top + this.radius, this.y));
    this.kickTimer = Math.max(0, this.kickTimer - dt);
  }
}
