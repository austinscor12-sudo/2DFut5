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

export const PLAYER = { radius: 14, speed: 180, kickCooldown: 0.35, kickBuffer: 0.18 };

// Correr (Shift): gasta resistencia; si se agota, hay que esperar a recuperar un poco
export const SPRINT = { multiplier: 1.45, drain: 0.4, regen: 0.15, resumeAt: 0.25 };

// Tiro: mantené Espacio y soltá. Más tiempo = más fuerza
export const SHOT = { chargeTime: 0.9, minPower: 0.45 };

// Pase (F): se dirige al compañero más alineado con hacia dónde mirás
export const PASS = { minPower: 240, maxPower: 480, aimCone: 0.35 };

// Convierte un atributo de 1 a 10 en un multiplicador (5 = normal, 10 = +25%, 1 = -20%)
export const scale = (stat) => 1 + (stat - 5) * 0.05;
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
