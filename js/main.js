import { Game } from './core/Game.js';
import { Input } from './core/Input.js';
import { Renderer } from './core/Renderer.js';
import { PLAYERS } from './data/players.js';
import { loadRoster, saveRoster, resetRoster, renderEditor } from './ui/Roster.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const menu = $('menu');
const home = $('menu-home');
const edit = $('menu-edit');
const rosterBox = $('roster');

const input = new Input();
const renderer = new Renderer(canvas);

let roster = loadRoster(PLAYERS);
let game = null;
let menuOpen = true;

function showMenu(view) {
  menuOpen = true;
  menu.hidden = false;
  home.hidden = view !== 'home';
  edit.hidden = view !== 'edit';
  $('btn-resume').hidden = !game;
}

function hideMenu() {
  menuOpen = false;
  menu.hidden = true;
  input.clear();
}

$('btn-play').onclick = () => { game = new Game(input, roster); hideMenu(); };
$('btn-resume').onclick = hideMenu;
$('btn-edit').onclick = () => { renderEditor(rosterBox, roster); showMenu('edit'); };
$('btn-save').onclick = () => { saveRoster(roster); game = null; showMenu('home'); };
$('btn-reset').onclick = () => { resetRoster(); roster = loadRoster(PLAYERS); renderEditor(rosterBox, roster); };

window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && !menuOpen && game) showMenu('home');
});

showMenu('home');

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (game && !menuOpen) game.update(dt);
  renderer.draw(game);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
