import { PITCH, FIELD } from '../config.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// A dónde tiene que ir un jugador controlado por la computadora
export function aiTarget(player, game, awayChaser) {
  const ball = game.ball;

  if (player.role === 'gk') {
    const x = player.team === 'home' ? PITCH.left + 30 : PITCH.right - 30;
    const half = FIELD.goalWidth / 2 - 10;
    return { x, y: clamp(ball.y, PITCH.cy - half, PITCH.cy + half), speed: 0.9 };
  }

  if (player === awayChaser) {
    return { x: ball.x, y: ball.y, speed: 1 };
  }

  const base = player.homeSpot;
  return {
    x: clamp(base.x + (ball.x - PITCH.cx) * 0.3, PITCH.left + 60, PITCH.right - 60),
    y: base.y + (ball.y - PITCH.cy) * 0.25,
    speed: 0.85,
  };
}

// Hacia dónde patea la computadora (arco rival con un poco de variación)
export function aiAim(player) {
  const gx = player.team === 'home' ? PITCH.right : PITCH.left;
  const gy = PITCH.cy + (Math.random() - 0.5) * (FIELD.goalWidth * 0.7);
  const dx = gx - player.x, dy = gy - player.y;
  const d = Math.hypot(dx, dy) || 1;
  return { x: dx / d, y: dy / d };
}
