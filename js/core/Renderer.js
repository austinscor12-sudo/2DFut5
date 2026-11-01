import { FIELD, PITCH, TEAM_COLORS, TEAM_NAMES } from '../config.js';

export class Renderer {
  constructor(canvas) {
    canvas.width = FIELD.width;
    canvas.height = FIELD.height;
    this.ctx = canvas.getContext('2d');
  }

  draw(game) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, FIELD.width, FIELD.height);
    this.drawPitch();
    game.players.forEach((p) => this.drawPlayer(p));
    this.drawBall(game.ball);
    this.drawHud(game);
  }

  drawPitch() {
    const ctx = this.ctx;
    ctx.fillStyle = '#256b2a';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);

    const stripes = 8;
    const w = (PITCH.right - PITCH.left) / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 ? '#2e7d32' : '#2a7430';
      ctx.fillRect(PITCH.left + i * w, PITCH.top, w, PITCH.bottom - PITCH.top);
    }

    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(PITCH.left, PITCH.top, PITCH.right - PITCH.left, PITCH.bottom - PITCH.top);

    ctx.beginPath();
    ctx.moveTo(PITCH.cx, PITCH.top); ctx.lineTo(PITCH.cx, PITCH.bottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(PITCH.cx, PITCH.cy, 50, 0, Math.PI * 2);
    ctx.stroke();

    // áreas
    const areaW = 110, areaH = 230;
    ctx.strokeRect(PITCH.left, PITCH.cy - areaH / 2, areaW, areaH);
    ctx.strokeRect(PITCH.right - areaW, PITCH.cy - areaH / 2, areaW, areaH);

    // arcos
    const gd = 18, gw = FIELD.goalWidth;
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.fillRect(PITCH.left - gd, PITCH.cy - gw / 2, gd, gw);
    ctx.fillRect(PITCH.right, PITCH.cy - gw / 2, gd, gw);
    ctx.strokeRect(PITCH.left - gd, PITCH.cy - gw / 2, gd, gw);
    ctx.strokeRect(PITCH.right, PITCH.cy - gw / 2, gd, gw);
  }

  drawPlayer(p) {
    const ctx = this.ctx;

    if (p.controlled) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // cuerpo (camiseta)
    ctx.fillStyle = TEAM_COLORS[p.team];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    // cabeza (color de piel), desplazada hacia donde mira
    ctx.fillStyle = p.skin;
    ctx.beginPath();
    ctx.arc(p.x + p.facing.x * 3, p.y + p.facing.y * 3, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, p.x, p.y - p.radius - 6);
  }

  drawBall(b) {
    const ctx = this.ctx;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  drawHud(game) {
    const ctx = this.ctx;
    const mins = Math.floor(game.timeLeft / 60);
    const secs = String(Math.floor(game.timeLeft % 60)).padStart(2, '0');

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(
      `${TEAM_NAMES.home} ${game.score.home} - ${game.score.away} ${TEAM_NAMES.away}   ${mins}:${secs}`,
      FIELD.width / 2, 27
    );

    if (game.message) {
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      ctx.fillRect(0, FIELD.height / 2 - 40, FIELD.width, 80);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 34px system-ui, sans-serif';
      ctx.fillText(game.message, FIELD.width / 2, FIELD.height / 2 + 11);
      if (game.state === 'finished') {
        ctx.font = '16px system-ui, sans-serif';
        ctx.fillText('Presioná R para jugar de nuevo', FIELD.width / 2, FIELD.height / 2 + 34);
      }
    }
  }
}
