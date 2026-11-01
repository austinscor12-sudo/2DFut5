import { MATCH_SECONDS, GOAL_PAUSE_SECONDS, BALL, PLAYER, TEAM_NAMES } from '../config.js';
import { PLAYERS } from '../data/players.js';
import { Player } from '../entities/Player.js';
import { Ball } from '../entities/Ball.js';
import { aiTarget, aiAim } from '../ai/ai.js';

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
  }

  chaser(team) { return this._chasers[team]; }

  computeChasers() {
    this._chasers = {};
    for (const team of ['home', 'away']) {
      let best = null, bestDist = Infinity;
      for (const p of this.players) {
        if (p.team !== team || p.role === 'gk') continue;
        const d = Math.hypot(p.x - this.ball.x, p.y - this.ball.y);
        if (d < bestDist) { best = p; bestDist = d; }
      }
      this._chasers[team] = best;
    }
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

    this.computeChasers();
    this.players.forEach((p) => (p.controlled = false));
    this._chasers.home.controlled = true; // el jugador manejado es el local más cercano a la pelota

    for (const p of this.players) {
      let wantsKick, aim;

      if (p.controlled) {
        const d = this.input.direction();
        p.setDirection(d.x, d.y);
        wantsKick = this.input.isKick();
        aim = p.facing;
      } else {
        const t = aiTarget(p, this);
        p.moveToward(t.x, t.y, t.speed);
        wantsKick = p.role === 'gk' || this.chaser(p.team) === p;
        aim = aiAim(p);
      }

      p.update(dt);
      this.contact(p, wantsKick, aim);
    }

    const scorer = this.ball.update(dt);
    if (scorer) {
      this.score[scorer]++;
      this.state = 'goal';
      this.pause = GOAL_PAUSE_SECONDS;
      this.message = `¡Gol de ${TEAM_NAMES[scorer]}!`;
    }
  }

  contact(p, wantsKick, aim) {
    const b = this.ball;
    const dx = b.x - p.x, dy = b.y - p.y;
    const dist = Math.hypot(dx, dy) || 0.001;
    const min = p.radius + b.radius;
    if (dist >= min) return;

    const nx = dx / dist, ny = dy / dist;
    b.x = p.x + nx * min;
    b.y = p.y + ny * min;

    if (wantsKick && p.kickTimer <= 0) {
      b.vx = aim.x * BALL.kickPower;
      b.vy = aim.y * BALL.kickPower;
      p.kickTimer = PLAYER.kickCooldown;
    } else {
      b.vx = b.vx * 0.5 + (p.vx * 1.2 + nx * 60) * 0.5;
      b.vy = b.vy * 0.5 + (p.vy * 1.2 + ny * 60) * 0.5;
    }
  }
}
