import { Game } from './core/Game.js';
import { Input } from './core/Input.js';
import { Renderer } from './core/Renderer.js';

const canvas = document.getElementById('game');
const game = new Game(new Input());
const renderer = new Renderer(canvas);

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  game.update(dt);
  renderer.draw(game);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
