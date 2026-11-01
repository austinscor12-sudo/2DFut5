// Todos los números "ajustables" del juego están acá.

export const FIELD = { width: 900, height: 520, margin: 40, goalWidth: 150 };

export const PITCH = {
  left: FIELD.margin,
  right: FIELD.width - FIELD.margin,
  top: FIELD.margin,
  bottom: FIELD.height - FIELD.margin,
  cx: FIELD.width / 2,
  cy: FIELD.height / 2,
};

export const MATCH_SECONDS = 180;
export const GOAL_PAUSE_SECONDS = 1.5;

export const TEAM_COLORS = { home: '#2563eb', away: '#dc2626' };
export const TEAM_NAMES = { home: 'Local', away: 'Visitante' };

export const PLAYER = { radius: 14, speed: 190, kickCooldown: 0.35 };
export const BALL = { radius: 7, friction: 0.985, kickPower: 560, wallBounce: 0.8 };

// Posiciones base (0 a 1) del equipo local, que ataca hacia la derecha.
// El visitante se espeja automáticamente.
export const FORMATION = {
  gk:    { x: 0.05, y: 0.5 },
  def:   { x: 0.25, y: 0.5 },
  left:  { x: 0.45, y: 0.25 },
  right: { x: 0.45, y: 0.75 },
  fwd:   { x: 0.6,  y: 0.5 },
};
