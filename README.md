# Fut5

Minijuego 2D de fútbol 5 (5 vs 5) con HTML5 Canvas y JavaScript puro.

## Controles
- Mover: flechas o WASD
- Correr: Shift (gasta resistencia, barra verde)
- Tiro: mantené Espacio y soltá (barra amarilla; más tiempo = más fuerza)
- Pase: F (va al compañero más alineado con hacia dónde mirás)
- Cambiar de jugador: E
- Menú / pausa: Esc · Reiniciar al terminar el partido: R

## Cómo probarlo
Usa módulos ES, así que no se abre con doble clic en el archivo.
En VS Code: extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.

## Estructura
- `index.html`, `css/style.css`: página, menú y editor
- `js/main.js`: arranque, menú y bucle del juego
- `js/config.js`: tamaños, velocidades, formación, tiro, pase, correr
- `js/data/players.js`: jugadores por defecto (nombre, número, piel, rol, atributos)
- `js/ui/Roster.js`: editor de jugadores y guardado en el navegador (localStorage)
- `js/entities/`: `Player.js`, `Ball.js`
- `js/core/`: `Game.js` (reglas), `Input.js` (teclado), `Renderer.js` (dibujo)
- `js/ai/ai.js`: comportamiento de los jugadores controlados por la computadora

## Publicar
Subir a GitHub y conectar el repo a Cloudflare Pages (sin comando de build, directorio de salida: raíz).
