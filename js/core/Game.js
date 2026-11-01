import { MATCH_SECONDS, GOAL_PAUSE_SECONDS, BALL, PLAYER, TEAM_NAMES, PITCH, FIELD } from '../config.js';
import { PLAYERS } from '../data/players.js';
import { Player } from '../entities/Player.js';
import { Ball } from '../entities/Ball.js';
import { aiTarget, aiAim } from '../ai/ai.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export class Game {
  constructor(input) {
    this.input = input;
    this.players = PLAYERS.map((d) => new Player(d));
    this.ball = new Ball();
    this.restart();
  }

  restart() {
    this.score = { home: 0, away: 0 };
    this.timeLeft = MATCH_SECONDS;
    this.state = 'playing'; // playing | goal | finished
    this.pause = 0;
    this.message = '';
    this.kickoff();
  }

  kickoff() {
    this.players.forEach((p) => p.resetPosition());
    this.ball.reset();
    this.human = null;
    this.stuckTimer = 0;
  }

  dist(p) { return Math.hypot(p.x - this.ball.x, p.y - this.ball.y); }

  // Con quién jugás: el local más cercano a la pelota, pero sin cambiar a cada rato.
  // Con la tecla E forzás el cambio al jugador más cercano.
  pickHuman() {
    const outfield = this.players
      .filter((p) => p.team === 'home' && p.role !== 'gk')
      .sort((a, b) => this.dist(a) - this.dist(b));
    const closest = outfield[0];

    if (!this.human || this.dist(closest) + 25 < this.dist(this.human)) this.human = closest;

    if (this.input.consumePress('KeyE')) {
      this.human = outfield[0] !== this.human ? outfield[0] : outfield[1];
    }
  }

  chaser(team) {
    if (team === 'home') return this.human;
    let best = null, bestDist = Infinity;
    for (const p of this.players) {
      if (p.team !== 'away' || p.role === 'gk') continue;
      const d = this.dist(p);
      if (d < bestDist) { best = p; bestDist = d; }
    }
    return best;
  }

  update(dt) {
    if (this.state === 'finished') {
      if (this.input.consumePress('KeyR')) this.restart();
      return;
    }

    if (this.state === 'goal') {
      this.pause -= dt;
      if (this.pause <= 0) { this.state = 'playing'; this.message = ''; this.kickoff(); }
      return;
    }

    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.state = 'finished';
      const { home, away } = this.score;
      this.message = home === away ? 'Empate' : `Ganó ${TEAM_NAMES[home > away ? 'home' : 'away']}`;
      return;
    }

    this.pickHuman();
    this.players.forEach((p) => (p.controlled = p === this.human));
    const awayChaser = this.chaser('away');

    for (const p of this.players) {
      let wantsKick, aim;

      if (p.controlled) {
        const d = this.input.direction();
        p.setDirection(d.x, d.y);
        wantsKick = this.input.isKick();
        aim = p.facing;
      } else {
        const t = aiTarget(p, this, awayChaser);
        p.moveToward(t.x, t.y, t.speed);
        wantsKick = p.role === 'gk' || p === awayChaser;
        aim = aiAim(p);
      }

      p.update(dt);
      this.contact(p, wantsKick, aim);
    }

    this.separatePlayers();

    const scorer = this.ball.update(dt);
    if (scorer) {
      this.score[scorer]++;
      this.state = 'goal';
      this.pause = GOAL_PAUSE_SECONDS;
      this.message = `¡Gol de ${TEAM_NAMES[scorer]}!`;
      return;
    }

    this.rescueStuckBall(dt);
  }

  contact(p, wantsKick, aim) {
    const b = this.ball;
    const dx = b.x - p.x, dy = b.y - p.y;
    const dist = Math.hypot(dx, dy) || 0.001;
    const min = p.radius + b.radius;
    if (dist >= min) return;

    const nx = dx / dist, ny = dy / dist;
    let targetX = p.x + nx * min;
    let targetY = p.y + ny * min;

    // ¿La pelota quedaría contra la pared? Entonces se corre el jugador, no la pelota.
    const inGoalMouth = Math.abs(b.y - PITCH.cy) < FIELD.goalWidth / 2;
    const minX = inGoalMouth ? -Infinity : PITCH.left + b.radius;
    const maxX = inGoalMouth ? Infinity : PITCH.right - b.radius;
    const clampedX = clamp(targetX, minX, maxX);
    const clampedY = clamp(targetY, PITCH.top + b.radius, PITCH.bottom - b.radius);
    const blocked = clampedX !== targetX || clampedY !== targetY;

    if (blocked) {
      b.x = clampedX; b.y = clampedY;
      const bx = p.x - b.x, by = p.y - b.y;
      const bd = Math.hypot(bx, by) || 0.001;
      p.x = clamp(b.x + (bx / bd) * min, PITCH.left + p.radius, PITCH.right - p.radius);
      p.y = clamp(b.y + (by / bd) * min, PITCH.top + p.radius, PITCH.bottom - p.radius);
    } else {
      b.x = targetX; b.y = targetY;
    }

    if (wantsKick && p.kickTimer <= 0) {
      b.vx = aim.x * BALL.kickPower;
      b.vy = aim.y * BALL.kickPower;
      p.kickTimer = PLAYER.kickCooldown;
    } else if (!blocked) {
      b.vx = b.vx * 0.5 + (p.vx * 1.2 + nx * 60) * 0.5;
      b.vy = b.vy * 0.5 + (p.vy * 1.2 + ny * 60) * 0.5;
    }
  }

  // Los jugadores no se pueden superponer
  separatePlayers() {
    const ps = this.players;
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const min = a.radius + b.radius;
        if (d >= min) continue;
        const push = (min - d) / 2;
        const nx = dx / d, ny = dy / d;
        a.x -= nx * push; a.y -= ny * push;
        b.x += nx * push; b.y += ny * push;
        for (const q of [a, b]) {
          q.x = clamp(q.x, PITCH.left + q.radius, PITCH.right - q.radius);
          q.y = clamp(q.y, PITCH.top + q.radius, PITCH.bottom - q.radius);
        }
      }
    }
  }

  // Red de seguridad: si la pelota queda quieta contra una pared, se la manda hacia el centro
  rescueStuckBall(dt) {
    const b = this.ball;
    const speed = Math.hypot(b.vx, b.vy);
    const nearWall =
      b.x < PITCH.left + 45 || b.x > PITCH.right - 45 ||
      b.y < PITCH.top + 45 || b.y > PITCH.bottom - 45;

    if (speed < 30 && nearWall) this.stuckTimer += dt;
    else this.stuckTimer = 0;

    if (this.stuckTimer > 1.5) {
      const dx = PITCH.cx - b.x, dy = PITCH.cy - b.y;
      const d = Math.hypot(dx, dy) || 1;
      b.vx = (dx / d) * 300;
      b.vy = (dy / d) * 300;
      this.stuckTimer = 0;
    }
  }
}
