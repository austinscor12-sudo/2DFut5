import { PLAYER, PITCH, FORMATION, SPRINT, scale } from '../config.js';

export class Player {
  constructor(data) {
    this.name = data.name;
    this.number = data.number;
    this.skin = data.skin;
    this.team = data.team;
    this.role = data.role;
    this.stats = { speed: 5, shot: 5, pass: 5, control: 5, ...(data.stats || {}) };
    this.speed = PLAYER.speed * scale(this.stats.speed);
    this.radius = PLAYER.radius;

    this.x = 0; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.facing = { x: this.team === 'home' ? 1 : -1, y: 0 };
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
    this.kickQueue = null;
    this.charge = 0;
    this.stamina = 1;
    this.exhausted = false;
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

  // Deja "preparada" una patada: se ejecuta cuando la pelota esté a tiro
  queueKick(aim, power) {
    this.kickQueue = { aim: { x: aim.x, y: aim.y }, power, ttl: PLAYER.kickBuffer };
  }

  updateStamina(sprinting, dt) {
    if (sprinting && !this.exhausted) {
      this.stamina = Math.max(0, this.stamina - SPRINT.drain * dt);
      if (this.stamina === 0) this.exhausted = true;
    } else {
      this.stamina = Math.min(1, this.stamina + SPRINT.regen * dt);
      if (this.exhausted && this.stamina >= SPRINT.resumeAt) this.exhausted = false;
    }
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.x = Math.min(PITCH.right - this.radius, Math.max(PITCH.left + this.radius, this.x));
    this.y = Math.min(PITCH.bottom - this.radius, Math.max(PITCH.top + this.radius, this.y));
    this.kickTimer = Math.max(0, this.kickTimer - dt);
    if (this.kickQueue) {
      this.kickQueue.ttl -= dt;
      if (this.kickQueue.ttl <= 0) this.kickQueue = null;
    }
  }
}
