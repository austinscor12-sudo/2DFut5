# Fut5

Minijuego 2D de fútbol 5 (5 vs 5) con HTML5 Canvas y JavaScript puro.

## Controles
Flechas o WASD: mover. Espacio: patear. E: cambiar de jugador. R: reiniciar al terminar.

## Cómo probarlo
Usa módulos ES, así que no se abre con doble clic en el archivo.
En VS Code: extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.

## Estructura
- `index.html`: página y canvas
- `css/style.css`: estilos
- `js/main.js`: arranque y bucle del juego
- `js/config.js`: tamaños, velocidades, formación, colores
- `js/data/players.js`: **los 10 jugadores** (nombre, número, color de piel, rol)
- `js/entities/`: `Player.js`, `Ball.js`
- `js/core/`: `Game.js` (reglas), `Input.js` (teclado), `Renderer.js` (dibujo)
- `js/ai/ai.js`: comportamiento de los jugadores controlados por la computadora

## Publicar
Subir a GitHub y conectar el repo a Cloudflare Pages (sin comando de build, directorio de salida: raíz).
