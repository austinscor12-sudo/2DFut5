// Jugadores por defecto. Desde el juego se pueden editar (menú "Editar jugadores")
// y se guardan en el navegador.
// roles: gk (arquero), def, left, right, fwd
// stats (1 a 10): speed (velocidad), shot (tiro), pass (pase), control (control de pelota)

export const PLAYERS = [
  { name: 'Lucas',  number: 1,  skin: '#f1c27d', team: 'home', role: 'gk',    stats: { speed: 5, shot: 6, pass: 5, control: 5 } },
  { name: 'Tomi',   number: 2,  skin: '#c68642', team: 'home', role: 'def',   stats: { speed: 5, shot: 5, pass: 6, control: 5 } },
  { name: 'Nico',   number: 7,  skin: '#ffdbac', team: 'home', role: 'left',  stats: { speed: 7, shot: 5, pass: 7, control: 6 } },
  { name: 'Fede',   number: 8,  skin: '#8d5524', team: 'home', role: 'right', stats: { speed: 6, shot: 6, pass: 6, control: 7 } },
  { name: 'Santi',  number: 9,  skin: '#e0ac69', team: 'home', role: 'fwd',   stats: { speed: 7, shot: 8, pass: 5, control: 7 } },

  { name: 'Mati',   number: 1,  skin: '#ffdbac', team: 'away', role: 'gk',    stats: { speed: 5, shot: 6, pass: 5, control: 5 } },
  { name: 'Joaco',  number: 4,  skin: '#e0ac69', team: 'away', role: 'def',   stats: { speed: 5, shot: 5, pass: 6, control: 5 } },
  { name: 'Bauti',  number: 6,  skin: '#c68642', team: 'away', role: 'left',  stats: { speed: 6, shot: 5, pass: 6, control: 6 } },
  { name: 'Thiago', number: 10, skin: '#f1c27d', team: 'away', role: 'right', stats: { speed: 6, shot: 6, pass: 7, control: 6 } },
  { name: 'Dante',  number: 11, skin: '#8d5524', team: 'away', role: 'fwd',   stats: { speed: 6, shot: 7, pass: 5, control: 6 } },
];
