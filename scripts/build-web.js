// Copies the static web game into www/ so Capacitor can bundle it into the native app.
// The game itself stays at the repo root (that's what GitHub Pages serves).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

const items = [
  'index.html', 'player.png', 'player2.png', 'niiko_x_swae.mp3',
  'manifest.webmanifest', 'icons', 'bg',
];
for (const it of items) {
  const src = path.join(root, it);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(www, it), { recursive: true });
  } else {
    console.warn('  (skip, missing) ' + it);
  }
}
console.log('Copied web assets -> www/');
