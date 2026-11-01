const KEY = 'fut5.roster.v1';

export const SKIN_TONES = [
  ['Muy clara', '#ffdbac'],
  ['Clara', '#f1c27d'],
  ['Trigueña', '#e0ac69'],
  ['Morena', '#c68642'],
  ['Oscura', '#8d5524'],
];
const ROLE_LABELS = { gk: 'Arquero', def: 'Defensor', left: 'Izquierda', right: 'Derecha', fwd: 'Delantero' };
const STAT_LABELS = { speed: 'Velocidad', shot: 'Tiro', pass: 'Pase', control: 'Control' };

const clone = (x) => JSON.parse(JSON.stringify(x));

export function loadRoster(defaults) {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (!Array.isArray(saved)) return clone(defaults);
    return defaults.map((d, i) => ({
      ...clone(d),
      ...(saved[i] || {}),
      team: d.team,
      role: d.role,
      stats: { ...d.stats, ...((saved[i] && saved[i].stats) || {}) },
    }));
  } catch {
    return clone(defaults);
  }
}

export function saveRoster(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* sin almacenamiento */ }
}

export function resetRoster() {
  try { localStorage.removeItem(KEY); } catch { /* sin almacenamiento */ }
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function field(type, value) {
  const i = document.createElement('input');
  i.type = type;
  i.value = value;
  return i;
}

export function renderEditor(container, roster) {
  container.replaceChildren();
  for (const team of ['home', 'away']) {
    const col = el('section', 'team');
    col.append(el('h3', '', team === 'home' ? 'Local' : 'Visitante'));
    roster.filter((p) => p.team === team).forEach((p) => col.append(playerRow(p)));
    container.append(col);
  }
}

function playerRow(p) {
  const row = el('div', 'row');

  const head = el('div', 'row-head');
  const num = field('number', p.number);
  num.min = 1; num.max = 99; num.className = 'num';
  num.setAttribute('aria-label', 'Número');
  num.oninput = () => { p.number = Number(num.value) || p.number; };

  const name = field('text', p.name);
  name.maxLength = 12;
  name.setAttribute('aria-label', 'Nombre');
  name.oninput = () => { p.name = name.value.trim() || 'Jugador'; };

  const tone = document.createElement('select');
  tone.setAttribute('aria-label', 'Tono de piel');
  tone.append(new Option('Personalizado', ''));
  SKIN_TONES.forEach(([label, hex]) => tone.append(new Option(label, hex)));
  tone.value = SKIN_TONES.some(([, hex]) => hex === p.skin) ? p.skin : '';

  const color = field('color', p.skin);
  color.setAttribute('aria-label', 'Color de piel');
  color.oninput = () => {
    p.skin = color.value;
    tone.value = SKIN_TONES.some(([, hex]) => hex === p.skin) ? p.skin : '';
  };
  tone.onchange = () => {
    if (tone.value) { p.skin = tone.value; color.value = tone.value; }
  };

  head.append(num, name, tone, color, el('span', 'role', ROLE_LABELS[p.role]));
  row.append(head);

  const stats = el('div', 'stats');
  for (const key of Object.keys(STAT_LABELS)) {
    const wrap = el('label', 'stat');
    const val = el('b', '', String(p.stats[key]));
    const range = field('range', p.stats[key]);
    range.min = 1; range.max = 10; range.step = 1;
    range.oninput = () => { p.stats[key] = Number(range.value); val.textContent = range.value; };
    wrap.append(el('span', '', STAT_LABELS[key]), range, val);
    stats.append(wrap);
  }
  row.append(stats);
  return row;
}
