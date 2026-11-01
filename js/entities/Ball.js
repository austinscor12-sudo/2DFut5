import { BALL, PITCH, FIELD } from '../config.js';

export class Ball {
  constructor() {
    this.radius = BALL.radius;
    this.reset();
  }

  reset() {
    this.x = PITCH.cx; this.y = PITCH.cy;
    this.vx = 0; this.vy = 0;
  }

  // Devuelve 'home' o 'away' si hubo gol (el equipo que anotó), si no null.
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const damp = Math.pow(BALL.friction, dt * 60);
    this.vx *= damp; this.vy *= damp;
    if (Math.abs(this.vx) < 2) this.vx = 0;
    if (Math.abs(this.vy) < 2) this.vy = 0;

    const r = this.radius;
    if (this.y < PITCH.top + r)    { this.y = PITCH.top + r;    this.vy = -this.vy * BALL.wallBounce; }
    if (this.y > PITCH.bottom - r) { this.y = PITCH.bottom - r; this.vy = -this.vy * BALL.wallBounce; }

    const inGoalMouth = Math.abs(this.y - PITCH.cy) < FIELD.goalWidth / 2;

    if (!inGoalMouth) {
      if (this.x < PITCH.left + r)  { this.x = PITCH.left + r;  this.vx = -this.vx * BALL.wallBounce; }
      if (this.x > PITCH.right - r) { this.x = PITCH.right - r; this.vx = -this.vx * BALL.wallBounce; }
      return null;
    }

    if (this.x < PITCH.left - r)  return 'away';
    if (this.x > PITCH.right + r) return 'home';
    return null;
  }
}
