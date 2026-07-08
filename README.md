# 🌃 Dodge Mike's Newport Send

A neon arcade dodger. Pilot **Mike** through **10 Newport districts**, weave past falling
bar signs, grab power-ups, and skim past danger for **near-miss combos**. The whole game is
**one HTML file**; a thin Capacitor wrapper (`ios/`) ships it as the iOS App Store app.

🎮 **Play it:** https://mikefeehan.github.io/Dodge-The-Newport-Send/
📱 **App Store:** Dodge Mike's Newport Send (iOS)

## Files
- `index.html` — the entire game (graphics, audio, logic — all inline)
- `player.png` / `player2.png` — Mike's two-frame run animation
- `bg/1.jpg … 10.jpg` — per-district background art
- `niiko_x_swae.mp3` — the soundtrack (must sit next to `index.html`)
- `ios/` + `capacitor.config.json` + `codemagic.yaml` — iOS app wrapper and cloud build
- `scripts/smoke-test.js` — headless Playwright smoke test (runs in GitHub Actions)

## How to play
- **Survive 10 levels**, 30 seconds each. Score **carries** across levels.
- Each level starts with **3 lives**. A hit costs a life and gives you a moment of invulnerability.
- The rare **+1 life** power-up can boost you up to **5 lives** during that level.
- Clear the timer to advance to the next district and reset back to **3 lives**.
- **Skim past signs** without touching them to rack up a **combo multiplier**.
- From level 5, **express signs** drop fast — watch for the flashing ⚡ warning.
  From level 6, **weaver signs** snake side-to-side on the way down.
- Beat all 10 districts for the full **victory celebration**. 🎆

### Controls
| Platform | Steer | Other |
|----------|-------|-------|
| **Desktop** | Arrow keys / **WASD**, or just **move the mouse** | **P** = pause · **M** = mute |
| **Mobile** | **Drag** anywhere to steer | on-screen pause / mute buttons |

> On the start screen, pick **Horizontal** or **Vertical** — each mode gets its own
> field shape. Music starts on that first tap.

## Power-ups
| | Name | Effect |
|---|------|--------|
| 🩵 | **SLOW** | Slows everything down (~5s) |
| 💚 | **SHIELD** | Absorbs one hit (~8s) |
| 💛 | **VIP** | Instantly clears every sign on screen |
| 💜 | **2×** | Doubles your score (~7s) |
| ❤️ | **+1** | Extra life for the current level (rare) |

## Scoring & leaderboards
- Score builds continuously, scaled by your **level** and **combo multiplier**.
- **Near-misses** and power-ups grow your combo; getting hit resets it.
- Game Over shows your run stats; save your initials to the local **Top-5 leaderboard**.
- On iOS, scores also post to the **Game Center leaderboard** when you're signed in.
- The start screen tracks your **lifetime runs** and **furthest district**.

## iOS app extras
The Capacitor wrapper adds **haptic feedback**, **Game Center**, a one-time **rate-the-app
prompt**, and a **screen wake lock** during play. All of it is feature-detected — the web
build simply skips it.

## The 10 districts
The Peninsula · Balboa Pier · Cannery Village · Lido Marina · Newport Heights · Corona del Mar ·
Fashion Island · Back Bay · The Wedge · Sunset Send — each with its own neon palette and rising difficulty.

## Run it locally
It's a static page, so any web server works (audio needs `http://`, not `file://`):
```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Test
```bash
npm install --no-save playwright && npx playwright install chromium
node scripts/smoke-test.js
```
The same test runs in GitHub Actions on every PR and push to `main`.

## Build the iOS app
See `IOS_BUILD_GUIDE.md` (Codemagic cloud build — no Mac needed) and `GAME_CENTER_SETUP.md`
for the one-time App Store Connect leaderboard setup.

## Publish on GitHub Pages
Pages serves the repo root from `main` — merging to `main` **is** the web deploy.

---
*Dev note: `window.__DODGE__` exposes a small debug handle (state + manual step/draw) for tinkering
in the console; the smoke test drives the game through it.*
