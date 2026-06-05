# 🌃 Dodge Mike's Newport Send

A neon arcade dodger. Pilot **Mike's face** through **10 Newport districts**, weave past falling
bar signs, grab power-ups, and skim past danger for **near-miss combos**. One single HTML file —
no build step, no dependencies.

🎮 **Play it:** https://mikefeehan.github.io/Dodge-The-Newport-Send/

## Files
- `index.html` — the entire game (graphics, audio, logic — all inline)
- `niiko_x_swae.mp3` — the soundtrack (must sit next to `index.html`)

## How to play
- **Survive 10 levels**, 30 seconds each. Score **carries** across levels.
- You have **3 lives** (earn up to 5). A hit costs a life and gives you a moment of invulnerability.
- **Skim past signs** without touching them to rack up a **combo multiplier** — the higher the
  combo, the more every point is worth.

### Controls
| Platform | Steer | Other |
|----------|-------|-------|
| **Desktop** | Arrow keys / **WASD**, or just **move the mouse** | **P** = pause · **M** = mute |
| **Mobile** | **Drag** anywhere to steer, or **tilt** the phone | on-screen pause / mute buttons |

> Tap **Play** to start — that first tap is what unlocks the music and (on iPhone) the tilt sensors.

## Power-ups
| | Name | Effect |
|---|------|--------|
| 🩵 | **SLOW** | Slows everything down (~5s) |
| 💚 | **SHIELD** | Absorbs one hit (~8s) |
| 💛 | **VIP** | Instantly clears every sign on screen |
| 💜 | **2×** | Doubles your score (~7s) |
| ❤️ | **+1** | Extra life (rare) |

## Scoring & leaderboard
- Score builds continuously, scaled by your **level** and **combo multiplier**.
- **Near-misses** and power-ups grow your combo; getting hit resets it.
- Game Over shows your run stats (score, best, levels cleared, best combo, time survived).
- Save your initials to a local **Top-5 leaderboard** (stored in your browser) and **Share** your score.

## The 10 districts
The Peninsula · Balboa Pier · Cannery Village · Lido Marina · Newport Heights · Corona del Mar ·
Fashion Island · Back Bay · The Wedge · Sunset Send — each with its own neon palette and rising difficulty.

## Run it locally
It's a static page, so any web server works (audio needs `http://`, not `file://`):
```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Publish on GitHub Pages
1. Push `index.html` **and** `niiko_x_swae.mp3` to the repo root.
2. **Settings → Pages →** Branch: `main`, Folder: `/ (root)` → **Save**.
3. Live in ~1 minute at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

---
*Dev note: `window.__DODGE__` exposes a small debug handle (state + manual step/draw) for tinkering in the console.*
